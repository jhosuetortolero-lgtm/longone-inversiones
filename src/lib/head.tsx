import { createContext, useContext, useEffect, type ReactNode } from "react";
import { LOCALES, getDictionary, translatePath, type Locale } from "../i18n";
import { contact, office, site } from "../data/site";

export interface HeadData {
  title: string;
  description: string;
  locale: Locale;
  /** pathname of the current page (no origin) */
  path: string;
  image?: string;
  type?: "website" | "article";
  noindex?: boolean;
  /** omit hreflang alternates (e.g. 404) */
  noAlternates?: boolean;
  jsonLd?: object[];
  preloadImage?: { href: string; srcset?: string; sizes?: string };
}

/* Server-side collector: the page component registers its head during render. */
export interface HeadCollector {
  head?: HeadData;
}
const HeadContext = createContext<HeadCollector | null>(null);
export const HeadProvider = ({ collector, children }: { collector: HeadCollector | null; children: ReactNode }) => (
  <HeadContext.Provider value={collector}>{children}</HeadContext.Provider>
);

/** Absolute URL of a page: site URL (which includes any base path) + router path. */
const abs = (p: string) => (p.startsWith("http") ? p : `${site.url}${p}`);
/** Absolute URL of a static file whose path already includes the base. */
const absAsset = (p: string) => (p.startsWith("http") ? p : `${new URL(site.url).origin}${p}`);
/** Build-time switch (VITE_NOINDEX=1): keep a demo deployment out of search engines. */
const NOINDEX_ALL = import.meta.env.VITE_NOINDEX === "1";
const hreflangOf = (l: Locale) => (l === "pt" ? "pt-BR" : "es");

interface TagSpec {
  tag: "meta" | "link" | "script";
  attrs: Record<string, string>;
  content?: string;
}

export function headTags(h: HeadData): TagSpec[] {
  const t = getDictionary(h.locale);
  const canonical = abs(h.path);
  const image = absAsset(h.image ?? site.ogImage);
  const tags: TagSpec[] = [
    { tag: "meta", attrs: { name: "description", content: h.description } },
    { tag: "link", attrs: { rel: "canonical", href: canonical } },
    { tag: "meta", attrs: { property: "og:type", content: h.type ?? "website" } },
    { tag: "meta", attrs: { property: "og:site_name", content: site.name } },
    { tag: "meta", attrs: { property: "og:title", content: h.title } },
    { tag: "meta", attrs: { property: "og:description", content: h.description } },
    { tag: "meta", attrs: { property: "og:url", content: canonical } },
    { tag: "meta", attrs: { property: "og:image", content: image } },
    { tag: "meta", attrs: { property: "og:locale", content: t.ogLocale } },
    { tag: "meta", attrs: { name: "twitter:card", content: "summary_large_image" } },
    { tag: "meta", attrs: { name: "twitter:title", content: h.title } },
    { tag: "meta", attrs: { name: "twitter:description", content: h.description } },
    { tag: "meta", attrs: { name: "twitter:image", content: image } },
  ];
  if (h.noindex || NOINDEX_ALL) tags.push({ tag: "meta", attrs: { name: "robots", content: NOINDEX_ALL ? "noindex, nofollow" : "noindex, follow" } });
  if (!h.noAlternates) {
    for (const l of LOCALES) {
      tags.push({ tag: "link", attrs: { rel: "alternate", hreflang: hreflangOf(l), href: abs(translatePath(h.path, l)) } });
      if (l !== h.locale) tags.push({ tag: "meta", attrs: { property: "og:locale:alternate", content: getDictionary(l).ogLocale } });
    }
    tags.push({ tag: "link", attrs: { rel: "alternate", hreflang: "x-default", href: abs(translatePath(h.path, "es")) } });
  }
  if (h.preloadImage) {
    const a: Record<string, string> = { rel: "preload", as: "image", href: h.preloadImage.href, fetchpriority: "high" };
    if (h.preloadImage.srcset) a.imagesrcset = h.preloadImage.srcset;
    if (h.preloadImage.sizes) a.imagesizes = h.preloadImage.sizes;
    tags.push({ tag: "link", attrs: a });
  }
  for (const data of h.jsonLd ?? []) {
    tags.push({ tag: "script", attrs: { type: "application/ld+json" }, content: JSON.stringify(data).replace(/</g, "\\u003c") });
  }
  return tags;
}

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Serialize for the static prerender (scripts/prerender.mjs). */
export function renderHead(h: HeadData): string {
  const parts = [`<title>${esc(h.title)}</title>`];
  for (const t of headTags(h)) {
    const attrs = Object.entries(t.attrs)
      .map(([k, v]) => `${k}="${esc(v)}"`)
      .join(" ");
    parts.push(t.tag === "script" ? `<script data-head ${attrs}>${t.content}</script>` : `<${t.tag} data-head ${attrs}>`);
  }
  return parts.join("\n    ");
}

function applyHead(h: HeadData) {
  document.title = h.title;
  document.documentElement.lang = getDictionary(h.locale).htmlLang;
  document.head.querySelectorAll("[data-head]").forEach((n) => n.remove());
  const frag = document.createDocumentFragment();
  for (const t of headTags(h)) {
    const el = document.createElement(t.tag);
    el.setAttribute("data-head", "");
    for (const [k, v] of Object.entries(t.attrs)) el.setAttribute(k, v);
    if (t.content) el.textContent = t.content;
    frag.appendChild(el);
  }
  document.head.appendChild(frag);
}

export function useHead(h: HeadData) {
  const collector = useContext(HeadContext);
  if (collector) collector.head = h;
  const key = JSON.stringify(h);
  useEffect(() => {
    applyHead(JSON.parse(key) as HeadData);
  }, [key]);
}

/* ---------- structured data (only verified, non-commercial facts) ---------- */

export const organizationLd = () => ({
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  name: site.name,
  url: site.officialSite,
  logo: absAsset(site.logo.png),
  areaServed: ["Alagoas, Brasil", "Pernambuco, Brasil"],
  knowsLanguage: ["es", "pt-BR"],
  address: {
    "@type": "PostalAddress",
    streetAddress: `${office.street}, ${office.district}`,
    addressLocality: office.city,
    addressRegion: office.state,
    postalCode: office.postalCode,
    addressCountry: office.country,
  },
  ...(contact.whatsapp ? { telephone: `+${contact.whatsapp}` } : null),
});

export const breadcrumbLd = (items: { name: string; path: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: abs(it.path) })),
});

export { abs as absoluteUrl, absAsset as absoluteAssetUrl };
