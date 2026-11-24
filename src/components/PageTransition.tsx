import { createContext, useCallback, useContext, useEffect, useRef, type ReactNode } from "react";
import { useLocation, useNavigate } from "react-router";
import { getGsap, motion, prefersReducedMotion } from "../lib/motion";
import { site } from "../data/site";
import { jumpTo, smoothScrollTo } from "../lib/smoothScroll";
import { withBase } from "../lib/base";

interface TransitionValue {
  go: (to: string) => void;
}

const Ctx = createContext<TransitionValue>({ go: () => {} });
export const usePageTransition = () => useContext(Ctx);

function scrollToHash(hash: string, smooth: boolean) {
  const id = decodeURIComponent(hash.replace(/^#/, ""));
  const el = id ? document.getElementById(id) : null;
  if (smooth) smoothScrollTo(el ?? 0);
  else jumpTo(el ?? 0);
}

/**
 * Curtain transition between pages: an obsidian panel with the Longone symbol covers
 * the viewport, the route changes underneath, then the panel lifts away.
 */
export function PageTransitionProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const curtain = useRef<HTMLDivElement>(null);
  const pending = useRef<string | null>(null);
  const busy = useRef(false);

  const go = useCallback(
    (to: string) => {
      const url = new URL(withBase(to), window.location.href);
      const samePage = url.pathname === window.location.pathname;
      if (samePage) {
        if (url.hash) {
          history.pushState(null, "", url.hash);
          scrollToHash(url.hash, !prefersReducedMotion());
        } else smoothScrollTo(0);
        return;
      }
      if (busy.current) return;
      const el = curtain.current;
      if (!el || prefersReducedMotion()) {
        navigate(to);
        return;
      }
      busy.current = true;
      pending.current = to;
      const { gsap } = getGsap();
      gsap.set(el, { visibility: "visible", yPercent: 100 });
      gsap.to(el, {
        yPercent: 0,
        duration: motion.curtainIn,
        ease: motion.easeInOut,
        onComplete: () => navigate(to),
      });
    },
    [navigate],
  );

  // After the new route has rendered: reset scroll, then lift the curtain.
  useEffect(() => {
    const el = curtain.current;
    if (!pending.current) {
      if (location.hash) requestAnimationFrame(() => scrollToHash(location.hash, false));
      return;
    }
    pending.current = null;
    if (location.hash) scrollToHash(location.hash, false);
    else jumpTo(0);
    const { gsap, ScrollTrigger } = getGsap();
    ScrollTrigger.refresh();
    gsap.to(el, {
      yPercent: -100,
      duration: motion.curtainOut,
      ease: motion.easeInOut,
      delay: 0.05,
      onComplete: () => {
        gsap.set(el, { visibility: "hidden" });
        busy.current = false;
      },
    });
  }, [location.pathname, location.hash]);

  return (
    <Ctx.Provider value={{ go }}>
      {children}
      <div className="curtain" ref={curtain} aria-hidden="true">
        <img src={site.logo.symbolWhite} alt="" width="120" height="120" />
      </div>
    </Ctx.Provider>
  );
}
