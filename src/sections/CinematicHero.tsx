import { useEffect, useRef, useState } from "react";
import cinematic from "../data/cinematic.generated.json";
import { paths, useI18n } from "../i18n";
import { FrameSequence } from "../lib/frameSequence";
import { getGsap, motion, prefersReducedMotion, useIsoLayoutEffect } from "../lib/motion";
import { TransitionLink } from "../components/TransitionLink";
import { getLenis } from "../lib/smoothScroll";
import { asset } from "../lib/base";

/** Source frame (1-based) where each narrative chapter begins — matched to the footage. */
const CHAPTER_FRAMES = [1, 44, 92, 121, 150];
/** Timeline position (0–1 of the pinned scroll) at which the film reaches its last frame. */
const FILM_END = 0.86;
/** Horizontal focal point per source frame for portrait screens (cover crop follows the subject). */
const FOCAL: [number, number][] = [
  [1, 0.4],
  [44, 0.5],
  [92, 0.56],
  [121, 0.62],
  [150, 0.64],
  [190, 0.63],
];

function focalAt(frame: number) {
  for (let k = 1; k < FOCAL.length; k++) {
    const [f1, v1] = FOCAL[k];
    const [f0, v0] = FOCAL[k - 1];
    if (frame <= f1) return v0 + ((frame - f0) / (f1 - f0)) * (v1 - v0);
  }
  return FOCAL[FOCAL.length - 1][1];
}

const chapterAt = (frame: number) => {
  let c = 0;
  for (let i = 0; i < CHAPTER_FRAMES.length; i++) if (frame >= CHAPTER_FRAMES[i]) c = i;
  return c;
};

type Mode = "pending" | "film" | "static";

export function CinematicHero() {
  const { locale, t } = useI18n();
  const section = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const rail = useRef<HTMLOListElement>(null);
  const [mode, setMode] = useState<Mode>("pending");
  const [loaded, setLoaded] = useState(0);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    const canvasOk = !!document.createElement("canvas").getContext;
    setMode(prefersReducedMotion() || conn?.saveData || !canvasOk ? "static" : "film");
  }, []);

  useIsoLayoutEffect(() => {
    if (mode !== "film" || !section.current || !canvas.current) return;
    const { gsap, ScrollTrigger } = getGsap();
    const root = section.current;
    const small = window.matchMedia("(max-width: 820px)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const chosen = !small && window.innerWidth * dpr > 1500 ? cinematic.sets.hd : cinematic.sets.md;
    const set = { ...chosen, path: asset(chosen.path) };
    const deviceMemory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
    const budget = small ? 64 : deviceMemory && deviceMemory < 8 ? 140 : 260;

    let seq: FrameSequence;
    try {
      seq = new FrameSequence({
        canvas: canvas.current,
        set,
        stride: small ? 2 : 1,
        pad: cinematic.pad,
        memoryBudgetMB: budget,
        focal: focalAt,
        onFirstFrame: () => setLive(true),
        onCoarseProgress: (r) => setLoaded(r),
        onFatal: () => setMode("static"),
      });
    } catch {
      setMode("static");
      return;
    }
    seq.start();
    const ro = new ResizeObserver(() => seq.resize());
    ro.observe(canvas.current);

    const railItems = rail.current ? Array.from(rail.current.querySelectorAll<HTMLLIElement>("li")) : [];
    const railLine = root.querySelector<HTMLElement>(".cine__rail-line i");
    let activeChapter = -1;
    const total = cinematic.frameCount - 1;
    const toTime = (frame: number) => ((frame - 1) / total) * FILM_END;

    const ctx = gsap.context(() => {
      const film = { p: 0 };
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "bottom bottom",
          // Lenis already smooths the wheel: follow it 1:1. Without it, add a short catch-up.
          scrub: getLenis() ? true : motion.heroScrub,
          invalidateOnRefresh: true,
        },
      });

      tl.to(
        film,
        {
          p: 1,
          duration: FILM_END,
          onUpdate: () => {
            seq.setProgress(film.p);
            const frame = 1 + film.p * total;
            const c = chapterAt(frame);
            if (c !== activeChapter) {
              activeChapter = c;
              railItems.forEach((li, i) => li.toggleAttribute("data-active", i === c));
            }
            if (railLine) railLine.style.transform = `scaleY(${film.p})`;
          },
        },
        0,
      );

      tl.to(".cine__intro", { autoAlpha: 0, y: -48, duration: 0.07 }, 0.01);
      tl.to(".cine__scrim", { autoAlpha: 0, duration: 0.08 }, 0.02);
      tl.to(".cine__cue", { autoAlpha: 0, duration: 0.03 }, 0);
      tl.fromTo(".cine__rail", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.03 }, 0.05);

      const captions = gsap.utils.toArray<HTMLElement>(".cine__chapter");
      captions.forEach((el, i) => {
        const start = i === 0 ? 0.085 : toTime(CHAPTER_FRAMES[i]) + 0.01;
        const end = i < captions.length - 1 ? toTime(CHAPTER_FRAMES[i + 1]) - 0.005 : FILM_END - 0.01;
        tl.fromTo(el, { autoAlpha: 0, y: 28 }, { autoAlpha: 1, y: 0, duration: 0.03 }, start);
        tl.to(el, { autoAlpha: 0, y: -28, duration: 0.03 }, Math.max(start + 0.04, end - 0.03));
      });

      tl.to(".cine__rail", { autoAlpha: 0, duration: 0.03 }, FILM_END - 0.01);
      tl.fromTo(".cine__shade--end", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.06 }, FILM_END - 0.03);
      tl.fromTo(".cine__signature", { autoAlpha: 0, y: 36 }, { autoAlpha: 1, y: 0, duration: 0.06 }, FILM_END);
      tl.to({}, { duration: 1 - (FILM_END + 0.06) }, FILM_END + 0.06);
    }, root);

    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh).catch(() => {});

    return () => {
      ctx.revert();
      ro.disconnect();
      seq.destroy();
    };
  }, [mode]);

  const film = mode === "film";
  const sets = cinematic.sets;

  return (
    <section
      ref={section}
      className={`cine cine--${mode}${live ? " is-live" : ""}`}
      aria-labelledby="hero-title"
      data-header-overlay=""
      style={film ? { ["--cine-scroll" as string]: `${motion.heroScrollVh.desktop}vh`, ["--cine-scroll-sm" as string]: `${motion.heroScrollVh.mobile}vh` } : undefined}
    >
      <div className="cine__stage">
        <img
          className="cine__poster"
          src={asset(cinematic.poster.md)}
          srcSet={`${asset(cinematic.poster.md)} ${sets.md.width}w, ${asset(cinematic.poster.hd)} ${sets.hd.width}w`}
          sizes="100vw"
          alt=""
          width={sets.hd.width}
          height={sets.hd.height}
          fetchPriority="high"
          decoding="async"
        />
        {film && <canvas ref={canvas} className="cine__canvas" aria-hidden="true" />}
        <div className="cine__shade" aria-hidden="true" />
        <div className="cine__shade cine__shade--end" aria-hidden="true" />
        <div className="cine__scrim" aria-hidden="true" />

        <div className="cine__intro">
          <h1 id="hero-title" className="cine__title">
            {t.hero.title.map((line) => (
              <span className="cine__line" key={line}>
                <span>{line}</span>
              </span>
            ))}
          </h1>
          <p className="cine__lead">{t.hero.lead}</p>
          <div className="cine__ctas">
            <TransitionLink className="btn btn--solid" to={paths.section(locale, t.anchors.developments)}>
              {t.hero.explore}
            </TransitionLink>
            <TransitionLink className="btn btn--line" to={paths.section(locale, t.anchors.contact)}>
              {t.hero.advisor}
            </TransitionLink>
          </div>
        </div>

        {film && (
          <>
            <ol className="cine__chapters" aria-hidden="true">
              {t.hero.chapters.map((c, i) => (
                <li className="cine__chapter" key={c.label}>
                  <span className="cine__chapter-num">{String(i + 1).padStart(2, "0")}</span>
                  <span className="cine__chapter-label">{c.label}</span>
                  <span className="cine__chapter-line">{c.line}</span>
                </li>
              ))}
            </ol>

            <div className="cine__rail" aria-hidden="true">
              <span className="cine__rail-line">
                <i />
              </span>
              <ol ref={rail}>
                {t.hero.chapters.map((c, i) => (
                  <li key={c.label} data-active={i === 0 ? "" : undefined}>
                    <span>{String(i + 1).padStart(2, "0")}</span> {c.label}
                  </li>
                ))}
              </ol>
            </div>

            <div className="cine__signature">
              <p className="cine__signature-main" lang="en">
                Beyond real estate.
              </p>
              <p className="cine__signature-sub">{t.hero.signatureSub}</p>
            </div>

            <div className="cine__cue" aria-hidden="true">
              <span>{t.hero.scroll}</span>
              <i />
            </div>

            <div className={`cine__loader${loaded >= 1 ? " is-done" : ""}`} role="status" aria-live="off">
              <span>{t.hero.loading}</span>
              <span className="cine__loader-bar">
                <i style={{ transform: `scaleX(${loaded})` }} />
              </span>
            </div>
          </>
        )}

        <p className="cine__note">{t.hero.note}</p>
      </div>
    </section>
  );
}
