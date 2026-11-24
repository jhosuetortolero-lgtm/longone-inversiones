#!/usr/bin/env node
/**
 * Cinematic frame extraction for the Longone homepage hero.
 *
 * Reads the ORIGINAL supplied video (never modified) and writes:
 *   public/assets/cinematic/frames/hd/f_0001.webp …   (1920 wide, every frame)
 *   public/assets/cinematic/frames/md/f_0001.webp …   (1280 wide, every frame)
 *   public/assets/cinematic/poster-hd.webp / poster-md.webp   (first frame, LCP poster)
 *   public/assets/cinematic/stills/still-XX.webp     (key stills for editorial use)
 *   public/assets/cinematic/frames/manifest.json     (metadata consumed by the app)
 *
 * Usage:
 *   node scripts/extract-frames.mjs [path/to/video.mp4] [--quality 68]
 * Requires ffmpeg + ffprobe on PATH (ffmpeg ≥ 6; uses -fps_mode).
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, rmSync, statSync, writeFileSync, copyFileSync } from "node:fs";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const qIdx = args.indexOf("--quality");
const QUALITY = qIdx >= 0 ? Number(args[qIdx + 1]) : 68;
const positional = args.filter((a, i) => !a.startsWith("--") && args[i - 1] !== "--quality");
const video = resolve(positional[0] ?? join(root, "public/assets/cinematic/source/longone_video.mp4"));
if (!existsSync(video)) {
  console.error(`Video not found: ${video}`);
  process.exit(1);
}

const outBase = join(root, "public/assets/cinematic");
const framesDir = join(outBase, "frames");
const SETS = [
  { id: "hd", width: 1920 },
  { id: "md", width: 1280 },
];
// Frame numbers (1-based) of the stills exported for editorial sections.
const STILLS = [1, 60, 96, 118, 160, 190];

function probe() {
  const json = execFileSync(
    "ffprobe",
    ["-v", "error", "-select_streams", "v:0", "-count_frames",
      "-show_entries", "stream=width,height,r_frame_rate,nb_read_frames,codec_name,duration",
      "-show_entries", "format=duration,size", "-of", "json", video],
    { encoding: "utf8" },
  );
  const data = JSON.parse(json);
  const s = data.streams[0];
  const [n, d] = s.r_frame_rate.split("/").map(Number);
  return {
    width: s.width,
    height: s.height,
    fps: n / d,
    frames: Number(s.nb_read_frames),
    codec: s.codec_name,
    duration: Number(data.format.duration),
    bytes: Number(data.format.size),
  };
}

const meta = probe();
console.log("source", meta);

const manifest = {
  generatedAt: new Date().toISOString(),
  source: { file: video.replace(root, "").replaceAll("\\", "/"), ...meta },
  frameCount: meta.frames,
  aspect: meta.width / meta.height,
  pattern: "f_{index}.webp",
  pad: 4,
  sets: {},
  poster: {},
  stills: [],
};

for (const set of SETS) {
  const dir = join(framesDir, set.id);
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
  execFileSync("ffmpeg", [
    "-v", "error", "-y", "-i", video,
    "-an",
    "-vf", `scale=${set.width}:-2:flags=lanczos`,
    "-fps_mode", "passthrough",
    "-c:v", "libwebp", "-quality", String(QUALITY), "-compression_level", "5",
    join(dir, "f_%04d.webp"),
  ], { stdio: "inherit" });
  const files = readdirSync(dir).filter((f) => f.endsWith(".webp")).sort();
  const bytes = files.reduce((acc, f) => acc + statSync(join(dir, f)).size, 0);
  const height = Math.round((set.width / meta.width) * meta.height / 2) * 2;
  manifest.sets[set.id] = { path: `/assets/cinematic/frames/${set.id}/`, width: set.width, height, count: files.length, bytes };
  if (files.length !== meta.frames) {
    console.warn(`warning: ${set.id} produced ${files.length} frames, source reports ${meta.frames}`);
  }
  copyFileSync(join(dir, files[0]), join(outBase, `poster-${set.id}.webp`));
  manifest.poster[set.id] = `/assets/cinematic/poster-${set.id}.webp`;
  console.log(`${set.id}: ${files.length} frames, ${(bytes / 1048576).toFixed(2)} MB`);
}
manifest.frameCount = manifest.sets.hd.count;

const stillsDir = join(outBase, "stills");
rmSync(stillsDir, { recursive: true, force: true });
mkdirSync(stillsDir, { recursive: true });
for (const [i, frame] of STILLS.entries()) {
  const name = `still-${String(i + 1).padStart(2, "0")}.webp`;
  execFileSync("ffmpeg", [
    "-v", "error", "-y", "-i", video, "-an",
    "-vf", `select=eq(n\\,${frame - 1}),scale=1920:-2:flags=lanczos`,
    "-frames:v", "1", "-c:v", "libwebp", "-quality", "82", join(stillsDir, name),
  ]);
  manifest.stills.push({ frame, path: `/assets/cinematic/stills/${name}` });
}

writeFileSync(join(framesDir, "manifest.json"), JSON.stringify(manifest, null, 2));
console.log("manifest written:", join(framesDir, "manifest.json"));

// Slim copy consumed by the React app at build time.
const appManifest = {
  frameCount: manifest.frameCount,
  fps: meta.fps,
  aspect: manifest.aspect,
  pad: manifest.pad,
  sets: manifest.sets,
  poster: manifest.poster,
  stills: manifest.stills,
};
writeFileSync(join(root, "src/data/cinematic.generated.json"), JSON.stringify(appManifest, null, 2));
console.log("app manifest written: src/data/cinematic.generated.json");
