import { forwardRef, type AnchorHTMLAttributes, type MouseEvent } from "react";
import { usePageTransition } from "./PageTransition";
import { withBase } from "../lib/base";

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & { to: string };

/** Internal link that plays the page curtain (or smooth-scrolls for same-page anchors). */
export const TransitionLink = forwardRef<HTMLAnchorElement, Props>(function TransitionLink(
  { to, onClick, children, ...rest },
  ref,
) {
  const { go } = usePageTransition();
  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (rest.target && rest.target !== "_self") return;
    e.preventDefault();
    go(to);
  };
  return (
    <a ref={ref} href={withBase(to)} onClick={handle} {...rest}>
      {children}
    </a>
  );
});
