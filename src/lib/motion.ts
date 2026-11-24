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
};

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

export const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;
