/**
 * FrameSequence — scroll-driven image-sequence renderer for the homepage film.
 *
 * Memory strategy
 *  - Encoded WebP files are fetched progressively (coarse-to-fine: every 16th frame,
 *    then 8th, 4th, 2nd, 1st) and kept as Blobs (≈35–60 KB each).
 *  - Only a window of frames around the playhead is *decoded* (ImageBitmap). The window
 *    size comes from a memory budget; frames farthest from the playhead are evicted
 *    (bitmap.close()) first. Decodes run off the main thread and ahead in the scroll
 *    direction, so drawing never blocks on a decode.
 *  - If the exact frame is not decoded yet, the nearest decoded frame is drawn instead:
 *    the canvas never goes blank and never stalls.
 * Rendering
 *  - Fractional positions crossfade the two neighbouring frames (smooth at slow scroll).
 *  - Canvas backing store follows the CSS size × capped devicePixelRatio; frames are
 *    drawn "cover" with an optional per-frame horizontal focal point for portrait screens.
 */

export interface FrameSet {
  path: string;
  width: number;
  height: number;
  count: number;
}

export interface FrameSequenceOptions {
  canvas: HTMLCanvasElement;
  set: FrameSet;
  /** use every n-th frame of the set (2 on phones) */
  stride: number;
  pad: number;
  /** decoded-frame memory budget in MB */
  memoryBudgetMB: number;
  /** horizontal focal point (0–1) for a given *source* frame index */
  focal?: (sourceFrame: number) => number;
  onFirstFrame?: () => void;
  onCoarseProgress?: (ratio: number) => void;
  onFatal?: () => void;
}

type Decoded = ImageBitmap | HTMLImageElement;

const MAX_PARALLEL_FETCH = 6;
const MAX_PARALLEL_DECODE = 3;
const COARSE_STEP = 8;

export class FrameSequence {
  private o: FrameSequenceOptions;
  private files: number[];
  private blobs: (Blob | null | undefined)[];
  private decoded = new Map<number, Decoded>();
  private decoding = new Set<number>();
  private queue: number[] = [];
  private inFlight = 0;
  private ctx: CanvasRenderingContext2D;
  private pos = 0;
  private lastPos = 0;
  private dir = 1;
  private raf = 0;
  private capacity: number;
  private aborter = new AbortController();
  private firstDrawn = false;
  private failures = 0;
  private coarseTotal = 0;
  private coarseDone = 0;
  private destroyed = false;
  private cssW = 0;
  private cssH = 0;
  private objectUrls = new Map<number, string>();
  /** createImageBitmap is fastest, but some WebKit (iOS) builds reject Blob sources → <img> */
  private bitmaps = typeof createImageBitmap === "function";
  private decodeFailures = 0;

  constructor(o: FrameSequenceOptions) {
    this.o = o;
    const ctx = o.canvas.getContext("2d", { alpha: false });
    if (!ctx) throw new Error("2D canvas unavailable");
    this.ctx = ctx;
    this.files = [];
    for (let f = 1; f <= o.set.count; f += o.stride) this.files.push(f);
    if (this.files[this.files.length - 1] !== o.set.count) this.files.push(o.set.count);
    this.blobs = new Array(this.files.length);
    const frameMB = (o.set.width * o.set.height * 4) / (1024 * 1024);
    this.capacity = Math.max(8, Math.floor(o.memoryBudgetMB / frameMB));
  }

  get length() {
    return this.files.length;
  }

  /** source frame number (1-based) for a sequence index */
  sourceFrame(i: number) {
    return this.files[Math.max(0, Math.min(this.files.length - 1, Math.round(i)))];
  }

  start() {
    const n = this.files.length;
    const seen = new Set<number>();
    const order: number[] = [];
    const push = (i: number) => {
      if (i >= 0 && i < n && !seen.has(i)) {
        seen.add(i);
        order.push(i);
      }
    };
    push(0);
    push(n - 1);
    for (const step of [16, COARSE_STEP, 4, 2, 1]) {
      for (let i = 0; i < n; i += step) push(i);
      if (step === COARSE_STEP) this.coarseTotal = order.length;
    }
    this.queue = order;
    this.resize();
    this.pumpFetch();
  }

  private url(i: number) {
    return `${this.o.set.path}f_${String(this.files[i]).padStart(this.o.pad, "0")}.webp`;
  }

  private pumpFetch() {
    while (!this.destroyed && this.inFlight < MAX_PARALLEL_FETCH && this.queue.length) {
      const i = this.queue.shift()!;
      if (this.blobs[i] !== undefined) continue;
      this.inFlight++;
      fetch(this.url(i), { signal: this.aborter.signal, cache: "force-cache" })
        .then((r) => {
          if (!r.ok) throw new Error(String(r.status));
          return r.blob();
        })
        .then((b) => {
          this.blobs[i] = b;
        })
        .catch((e: unknown) => {
          if ((e as Error)?.name === "AbortError") return;
          this.blobs[i] = null;
          this.failures++;
          // first frame missing or too many failures → let the caller fall back to the poster
          if (i === 0 || this.failures > this.files.length * 0.25) this.o.onFatal?.();
        })
        .finally(() => {
          if (this.destroyed) return;
          this.inFlight--;
          if (this.coarseDone < this.coarseTotal) {
            this.coarseDone++;
            this.o.onCoarseProgress?.(this.coarseDone / this.coarseTotal);
          }
          this.pumpDecode();
          this.pumpFetch();
        });
    }
  }

  /** frames we want decoded, nearest to the playhead first, biased in the scroll direction */
  private wanted(): number[] {
    const n = this.files.length;
    const ahead = Math.ceil(this.capacity * 0.65);
    const behind = this.capacity - ahead;
    const c = Math.round(this.pos);
    const out: number[] = [];
    for (let d = 0; d <= Math.max(ahead, behind); d++) {
      const fwd = c + d * this.dir;
      const back = c - d * this.dir;
      if (d <= ahead && fwd >= 0 && fwd < n) out.push(fwd);
      if (d > 0 && d <= behind && back >= 0 && back < n) out.push(back);
    }
    return out;
  }

  private pumpDecode() {
    if (this.destroyed) return;
    for (const i of this.wanted()) {
      if (this.decoding.size >= MAX_PARALLEL_DECODE) break;
      if (this.decoded.has(i) || this.decoding.has(i)) continue;
      const blob = this.blobs[i];
      if (!blob) continue;
      this.decoding.add(i);
      this.decode(i, blob)
        .then((img) => {
          if (this.destroyed) {
            this.release(i, img);
            return;
          }
          this.decoded.set(i, img);
          this.evict();
          if (Math.abs(i - this.pos) < 2 || !this.firstDrawn) this.invalidate();
        })
        .catch(() => {
          this.blobs[i] = null;
          this.decodeFailures++;
          // nothing decodable → let the caller fall back to the poster instead of a frozen film
          if ((i === 0 && !this.firstDrawn) || this.decodeFailures > this.files.length * 0.25) this.o.onFatal?.();
        })
        .finally(() => {
          this.decoding.delete(i);
          this.pumpDecode();
        });
    }
  }

  private async decode(i: number, blob: Blob): Promise<Decoded> {
    if (this.bitmaps) {
      try {
        return await createImageBitmap(blob);
      } catch {
        // switch the whole sequence to <img> decoding and retry this frame below
        this.bitmaps = false;
      }
    }
    const url = URL.createObjectURL(blob);
    this.objectUrls.set(i, url);
    const img = new Image();
    img.src = url;
    try {
      await img.decode();
    } catch (e) {
      URL.revokeObjectURL(url);
      this.objectUrls.delete(i);
      throw e;
    }
    return img;
  }

  private release(i: number, img: Decoded) {
    if ("close" in img) img.close();
    const url = this.objectUrls.get(i);
    if (url) {
      URL.revokeObjectURL(url);
      this.objectUrls.delete(i);
    }
  }

  private evict() {
    if (this.decoded.size <= this.capacity) return;
    const byDistance = [...this.decoded.keys()].sort((a, b) => Math.abs(b - this.pos) - Math.abs(a - this.pos));
    while (this.decoded.size > this.capacity && byDistance.length) {
      const i = byDistance.shift()!;
      const img = this.decoded.get(i)!;
      this.decoded.delete(i);
      this.release(i, img);
    }
  }

  /** progress 0–1 along the sequence */
  setProgress(p: number) {
    const next = Math.max(0, Math.min(1, p)) * (this.files.length - 1);
    if (next !== this.lastPos) this.dir = next > this.lastPos ? 1 : -1;
    this.lastPos = next;
    this.pos = next;
    this.pumpDecode();
    this.invalidate();
  }

  resize() {
    const c = this.o.canvas;
    const rect = c.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    this.cssW = rect.width;
    this.cssH = rect.height;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    if (rect.width * dpr > 2560) dpr = 2560 / rect.width;
    const w = Math.round(rect.width * dpr);
    const h = Math.round(rect.height * dpr);
    if (c.width !== w || c.height !== h) {
      c.width = w;
      c.height = h;
    }
    this.invalidate();
  }

  private invalidate() {
    if (this.raf || this.destroyed) return;
    this.raf = requestAnimationFrame(() => {
      this.raf = 0;
      this.draw();
    });
  }

  private nearestDecoded(i: number): Decoded | undefined {
    const exact = this.decoded.get(i);
    if (exact) return exact;
    for (let d = 1; d < this.files.length; d++) {
      const a = this.decoded.get(i - d * this.dir) ?? this.decoded.get(i + d * this.dir);
      if (a) return a;
    }
    return undefined;
  }

  private draw() {
    const a = Math.floor(this.pos);
    const t = this.pos - a;
    const base = this.nearestDecoded(a);
    if (!base) return;
    const { width: cw, height: ch } = this.o.canvas;
    const { width: iw, height: ih } = this.o.set;
    const scale = Math.max(cw / iw, ch / ih);
    const dw = iw * scale;
    const dh = ih * scale;
    const focal = this.o.focal ? this.o.focal(this.sourceFrame(this.pos)) : 0.5;
    const dx = (cw - dw) * focal;
    const dy = (ch - dh) * 0.5;
    const ctx = this.ctx;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.globalAlpha = 1;
    ctx.drawImage(base, dx, dy, dw, dh);
    const next = t > 0.02 ? this.decoded.get(a + 1) : undefined;
    if (next && this.decoded.has(a)) {
      ctx.globalAlpha = t;
      ctx.drawImage(next, dx, dy, dw, dh);
      ctx.globalAlpha = 1;
    }
    if (!this.firstDrawn) {
      this.firstDrawn = true;
      this.o.onFirstFrame?.();
    }
  }

  get viewport() {
    return { w: this.cssW, h: this.cssH };
  }

  destroy() {
    this.destroyed = true;
    this.aborter.abort();
    cancelAnimationFrame(this.raf);
    for (const [i, img] of this.decoded) this.release(i, img);
    this.decoded.clear();
    this.blobs = [];
  }
}
