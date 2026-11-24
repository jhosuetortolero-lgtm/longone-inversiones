import { useEffect, useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/** Animation settings shared across the site. */
export const motion = {
  ease: "expo.out",
  easeInOut: "power3.inOut",
  curtainIn: 0.5,
  curtainOut: 0.7,
  /** Scroll smoothing for the cinematic sequence (seconds the playhead takes to catch up). */
  heroScrub: 0.35,
  /** Extra scroll distance of the pinned hero, in viewport heights. */
  heroScrollVh: { desktop: 300, mobile: 210 },
  /**
   * How the site honours the OS "reduce motion" setting (iPhone: Ajustes › Acessibilidade ›
   * Movimento › Reduzir movimento; Android: Remover animações).
   * - "gentle": the scroll-controlled film still plays — it only moves while the visitor
   *   scrolls, 1:1 with the finger/wheel, no inertia. Fades stay; slides, zooms, parallax,
   *   looping cues and smooth-scroll inertia are removed.
   * - "static": no film and no scroll effects (poster image only).
   */
  reducedMotion: "gentle" as "gentle" | "static",
};

export type MotionLevel = "full" | "gentle" | "static";

let registered = false;
export function getGsap() {
  if (!registered && typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });
    registered = true;
  }
  return { gsap, ScrollTrigger };
}

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** "full" normally; with reduce-motion on, the level chosen in `motion.reducedMotion`. */
export const motionLevel = (): MotionLevel => (prefersReducedMotion() ? motion.reducedMotion : "full");

export const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;
