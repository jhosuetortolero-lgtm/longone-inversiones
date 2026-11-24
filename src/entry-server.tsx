import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router";
import App from "./app/App";
import { HeadProvider, renderHead, type HeadCollector } from "./lib/head";
import { LOCALES, getDictionary, paths } from "./i18n";
import { developments } from "./data/developments";
import { ROUTER_BASENAME, withBase } from "./lib/base";

/** Every URL that is prerendered to static HTML (also used for sitemap + route checks). */
export function routes() {
  const list: { path: string; locale: string; alternates: Record<string, string> }[] = [];
  const add = (make: (l: (typeof LOCALES)[number]) => string) => {
    const alternates = Object.fromEntries(LOCALES.map((l) => [l, make(l)]));
    for (const l of LOCALES) list.push({ path: make(l), locale: l, alternates });
  };
  add((l) => paths.home(l));
  for (const d of developments) add((l) => paths.development(l, d.slug));
  add((l) => paths.credits(l));
  return list;
}

/** @param url router path ("/es/…"); the deployment base is added here. */
export function render(url: string) {
  const collector: HeadCollector = {};
  const fullPath = withBase(url);
  const html = renderToString(
    <StrictMode>
      <HeadProvider collector={collector}>
        <StaticRouter location={fullPath} basename={ROUTER_BASENAME}>
          <App />
        </StaticRouter>
      </HeadProvider>
    </StrictMode>,
  );
  const head = collector.head;
  return {
    html,
    head: head ? renderHead(head) : "",
    lang: head ? getDictionary(head.locale).htmlLang : "es",
    fullPath,
  };
}
