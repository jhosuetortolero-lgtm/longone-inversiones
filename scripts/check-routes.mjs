/**
 * Post-build route & SEO checks on the static output (no browser needed).
 * For every prerendered page: file exists, <html lang>, <title>, meta description,
 * canonical, hreflang es / pt-BR / x-default, hydration marker, h1, and that every
 * local URL referenced by src/srcset/href lives under the deployment base and exists
 * in dist/. Also validates sitemap.xml, robots.txt, 404.html and .nojekyll.
 *
 * Usage: node scripts/check-routes.mjs   (after npm run build)
 * Honors BASE_PATH (e.g. "/longone-inversiones/") and VITE_NOINDEX=1 like the build.
 */
import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");

const BASE = (() => {
  const b = process.env.BASE_PATH || "/";
  return b.endsWith("/") ? b : `${b}/`;
})();
const withBase = (p) => (BASE === "/" ? p : BASE + p.slice(1));
const stripBase = (p) => (BASE !== "/" && p.startsWith(BASE) ? "/" + p.slice(BASE.length) : p);
const noindex = process.env.VITE_NOINDEX === "1";

const slugs = ["green-sea-oceanique", "caminho-das-ondas", "more-nature-spa", "maria-farinha-flats-residence", "green-sea-essence"];
const routes = [
  { path: "/es/", lang: "es" },
  { path: "/pt/", lang: "pt-BR" },
  { path: "/es/creditos", lang: "es" },
  { path: "/pt/creditos", lang: "pt-BR" },
  ...slugs.flatMap((s) => [
    { path: `/es/emprendimientos/${s}`, lang: "es" },
    { path: `/pt/empreendimentos/${s}`, lang: "pt-BR" },
  ]),
];

const fileFor = (p) => (p.endsWith("/") ? join(dist, p, "index.html") : join(dist, `${p}.html`));
let failures = 0;
const fail = (route, msg) => {
  failures++;
  console.log(`  ✗ ${route}: ${msg}`);
};
const missingAssets = new Set();

for (const r of routes) {
  const file = fileFor(r.path);
  if (!existsSync(file)) {
    fail(r.path, "file missing");
    continue;
  }
  const html = readFileSync(file, "utf8");
  const checks = [
    [new RegExp(`<html lang="${r.lang}"`).test(html), `html lang should be ${r.lang}`],
    [/<title>[^<]{10,}<\/title>/.test(html), "title"],
    [/<meta data-head name="description" content="[^"]{50,}"/.test(html), "meta description"],
    [new RegExp(`rel="canonical" href="https://[^"]*${withBase(r.path).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"`).test(html), "canonical"],
    [/hreflang="es"/.test(html) && /hreflang="pt-BR"/.test(html) && /hreflang="x-default"/.test(html), "hreflang set"],
    [html.includes(`data-path="${withBase(r.path)}"`), "hydration marker"],
    [/<h1[\s>]/.test(html), "h1"],
    [/property="og:image" content="https:\/\//.test(html), "og:image"],
    [!/<div id="root"[^>]*><link/.test(html), "React preload links left inside #root"],
    [!noindex || /name="robots" content="noindex/.test(html), "noindex meta expected"],
  ];
  for (const [ok, msg] of checks) if (!ok) fail(r.path, msg);

  const refs = [...html.matchAll(/(?:src|href)="(\/[^"#?]*)"/g)].map((m) => m[1]);
  const sets = [...html.matchAll(/(?:srcSet|srcset|imagesrcset)="([^"]+)"/gi)].flatMap((m) =>
    m[1].split(",").map((s) => s.trim().split(" ")[0]),
  );
  for (const ref of [...refs, ...sets]) {
    if (!ref.startsWith("/") || ref.startsWith("//")) continue;
    if (BASE !== "/" && !ref.startsWith(BASE)) {
      missingAssets.add(`${ref} (from ${r.path}): outside base ${BASE}`);
      continue;
    }
    const local = stripBase(ref);
    if (local === "/" || /^\/(es|pt)(\/|$)/.test(local)) continue; // page links, checked below
    if (!existsSync(join(dist, decodeURI(local)))) missingAssets.add(`${ref} (from ${r.path})`);
  }
  console.log(`  ✓ ${r.path}`);
}

for (const a of missingAssets) fail("assets", `missing ${a}`);

const sitemap = readFileSync(join(dist, "sitemap.xml"), "utf8");
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => stripBase(new URL(m[1]).pathname));
for (const r of routes) if (!locs.includes(r.path)) fail("sitemap", `missing ${r.path}`);

const robots = readFileSync(join(dist, "robots.txt"), "utf8");
if (noindex ? !/Disallow: \//.test(robots) : !/Sitemap: https?:\/\//.test(robots))
  fail("robots.txt", noindex ? "should disallow all" : "no Sitemap line");

for (const f of ["404.html", "index.html", "favicon.ico", "site.webmanifest", ".nojekyll", "assets/og/longone-og.jpg"])
  if (!existsSync(join(dist, f))) fail(f, "missing");

// internal links between pages must point at a prerendered route
const pageLinks = new Set();
for (const r of routes) {
  const html = readFileSync(fileFor(r.path), "utf8");
  for (const m of html.matchAll(/href="([^"#]*)/g)) {
    const local = stripBase(m[1]);
    if (/^\/(es|pt)\//.test(local)) pageLinks.add(local);
  }
}
for (const l of pageLinks) if (!routes.some((r) => r.path === l)) fail("links", `internal link to unknown route ${l}`);

console.log(
  failures
    ? `\n${failures} problem(s) found`
    : `\nAll ${routes.length} routes, ${pageLinks.size} internal link targets, sitemap, robots and assets OK (base ${BASE}${noindex ? ", noindex" : ""})`,
);
process.exit(failures ? 1 : 0);
