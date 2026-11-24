/**
 * Static prerender: renders every route with the SSR bundle into dist/<route>/index.html
 * (correct <html lang>, title, description, canonical, hreflang, Open Graph, JSON-LD),
 * then writes sitemap.xml (with xhtml:link alternates), robots.txt and 404.html.
 * Run after `vite build` and `vite build --ssr src/entry-server.tsx --outDir dist-ssr`.
 */
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, process.env.PRERENDER_DIST || "dist");
const template = readFileSync(join(dist, "index.html"), "utf8");
const ssrDir = process.env.PRERENDER_SSR || "dist-ssr";
const { render, routes } = await import(pathToFileURL(join(root, ssrDir, "entry-server.js")).href);

const siteUrl = (process.env.VITE_SITE_URL || "https://longoneinversiones.com.br").replace(/\/$/, "");

// React 19 emits <link rel="preload" as="image"> for eager images at the start of the
// container when it does not own <head>. Left there they break hydration, so they are
// moved into <head>, where they still do their job.
const HOISTED = /<link rel="preload" as="image"[^>]*\/>/g;

function page(url) {
  const { html, head, lang, fullPath } = render(url);
  const preloads = html.match(HOISTED) ?? [];
  const body = html.replace(HOISTED, "");
  return template
    .replace('<div id="root">', `<div id="root" data-path="${fullPath}">`)
    .replace("<!--app-lang-->", lang)
    .replace("<!--app-head-->", [head, ...preloads].join("\n    "))
    .replace("<!--app-html-->", body);
}

// "/es/" → es/index.html ; "/es/emprendimientos/x" → es/emprendimientos/x.html
// (served for the slash-less URL by Vercel cleanUrls, Netlify, Cloudflare Pages and vite preview)
function write(urlPath, content) {
  const file = urlPath.endsWith("/") ? join(dist, urlPath, "index.html") : join(dist, `${urlPath}.html`);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, content);
  return file;
}

const list = routes();
for (const r of list) write(r.path, page(r.path));
write("/", page("/"));
writeFileSync(join(dist, "404.html"), page("/es/404"));
console.log(`prerendered ${list.length + 2} pages`);

const hreflang = (l) => (l === "pt" ? "pt-BR" : "es");
const today = new Date().toISOString().slice(0, 10);
const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
  ...list.map((r) =>
    [
      "  <url>",
      `    <loc>${siteUrl}${r.path}</loc>`,
      `    <lastmod>${today}</lastmod>`,
      ...Object.entries(r.alternates).map(([l, p]) => `    <xhtml:link rel="alternate" hreflang="${hreflang(l)}" href="${siteUrl}${p}"/>`),
      `    <xhtml:link rel="alternate" hreflang="x-default" href="${siteUrl}${r.alternates.es}"/>`,
      "  </url>",
    ].join("\n"),
  ),
  "</urlset>",
].join("\n");
writeFileSync(join(dist, "sitemap.xml"), sitemap + "\n");
const noindex = process.env.VITE_NOINDEX === "1";
writeFileSync(
  join(dist, "robots.txt"),
  noindex ? "User-agent: *\nDisallow: /\n" : `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`,
);
console.log("sitemap.xml + robots.txt written");

rmSync(join(root, ssrDir), { recursive: true, force: true });
