import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import "@fontsource-variable/newsreader/opsz.css";
import "@fontsource-variable/jost/wght.css";
import "./styles/index.css";
import "lenis/dist/lenis.css";
import App from "./app/App";
import { initSmoothScroll } from "./lib/smoothScroll";
import { ROUTER_BASENAME } from "./lib/base";

initSmoothScroll();

const container = document.getElementById("root")!;
const app = (
  <StrictMode>
    <BrowserRouter basename={ROUTER_BASENAME}>
      <App />
    </BrowserRouter>
  </StrictMode>
);

// Hydrate only when the static HTML was prerendered for this exact URL. A host's SPA
// fallback (e.g. an unknown path served with the root page) is client-rendered instead.
const normalize = (p: string) => p.replace(/\/+$/, "") || "/";
if (container.hasChildNodes() && normalize(container.dataset.path ?? "") === normalize(location.pathname)) {
  hydrateRoot(container, app);
} else {
  container.replaceChildren();
  createRoot(container).render(app);
}
