import Lenis from "lenis";
import { getGsap, prefersReducedMotion } from "./motion";

/**
 * Inertial wheel scrolling (Lenis) driven by the GSAP ticker, so ScrollTrigger and the
 * cinematic canvas read the same smoothed position every frame.
 * - Uses the native scroll position: `position: sticky` keeps working.
 * - Touch devices keep their native momentum scrolling (syncTouch: false).
 * - Disabled with prefers-reduced-motion.
 */
let lenis: Lenis | null = null;

export function initSmoothScroll() {
  if (typeof window === "undefined" || lenis || prefersReducedMotion()) return lenis;
  const { gsap, ScrollTrigger } = getGsap();
  lenis = new Lenis({
    lerp: 0.085,
    smoothWheel: true,
    wheelMultiplier: 0.95,
    syncTouch: false,
    autoRaf: false,
    anchors: false,
    prevent: (node) => !!node.closest?.("dialog, [data-lenis-prevent]"),
  });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => lenis?.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  return lenis;
}

export const getLenis = () => lenis;

// Lenis already applies the page's `scroll-padding-top` (= header height) to element
// targets, so no extra offset is added here.
const headerOffset = () => 0;

/** Animated scroll to an element (or y) — falls back to native smooth scrolling. */
export function smoothScrollTo(target: HTMLElement | number) {
  if (lenis) {
    lenis.scrollTo(target, { offset: typeof target === "number" ? 0 : headerOffset(), duration: 1.6, force: true });
    return;
  }
  if (typeof target === "number") window.scrollTo({ top: target, behavior: prefersReducedMotion() ? "auto" : "smooth" });
  else target.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
}

/** Instant jump (route changes). */
export function jumpTo(target: HTMLElement | number) {
  if (lenis) {
    lenis.scrollTo(target, { offset: typeof target === "number" ? 0 : headerOffset(), immediate: true, force: true });
    return;
  }
  if (typeof target === "number") window.scrollTo(0, target);
  else target.scrollIntoView({ block: "start" });
}

export function lockScroll(locked: boolean) {
  if (!lenis) return;
  if (locked) lenis.stop();
  else lenis.start();
}
