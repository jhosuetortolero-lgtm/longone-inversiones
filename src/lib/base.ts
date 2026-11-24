/**
 * Deployment base path (Vite `base`, from BASE_PATH at build time).
 * "/" for a root domain, "/longone-inversiones/" for a GitHub Pages project site.
 * Router paths in the app stay root-relative ("/es/…"); these helpers add the base
 * wherever a real URL is written into the DOM.
 */
export const BASE = import.meta.env.BASE_URL || "/";

/** "/es/" → "/longone-inversiones/es/" (identity when BASE is "/"). */
export function withBase(path: string) {
  if (!path.startsWith("/") || path.startsWith("//") || BASE === "/") return path;
  if (path.startsWith(BASE)) return path;
  return BASE + path.slice(1);
}

/** Static file in public/ ("/assets/…") → URL including the base. */
export const asset = withBase;

/** React Router basename ("" when deployed at the domain root). */
export const ROUTER_BASENAME = BASE === "/" ? undefined : BASE.replace(/\/$/, "");
