import { createContext, useContext, type ReactNode } from "react";
import es, { type Dictionary } from "./es";
import pt from "./pt";

export const LOCALES = ["es", "pt"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "es";
export const LOCALE_STORAGE_KEY = "longone.locale";

const dictionaries: Record<Locale, Dictionary> = { es, pt };

export function isLocale(v: string | undefined): v is Locale {
  return v === "es" || v === "pt";
}

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

export const otherLocale = (l: Locale): Locale => (l === "es" ? "pt" : "es");

/* ---------- paths ---------- */

export const paths = {
  home: (l: Locale) => `/${l}/`,
  development: (l: Locale, slug: string) => `/${l}/${dictionaries[l].paths.developments}/${slug}`,
  credits: (l: Locale) => `/${l}/${dictionaries[l].paths.credits}`,
  section: (l: Locale, id: string) => `/${l}/#${id}`,
};

/** Map a pathname to its equivalent in another locale (used by the language switch + hreflang). */
export function translatePath(pathname: string, to: Locale): string {
  const parts = pathname.split("/").filter(Boolean);
  if (!parts.length || !isLocale(parts[0])) return paths.home(to);
  const from = parts[0];
  const rest = parts.slice(1);
  if (rest[0] === dictionaries[from].paths.developments && rest[1]) return paths.development(to, rest[1]);
  if (rest[0] === dictionaries[from].paths.credits) return paths.credits(to);
  return paths.home(to);
}

/* ---------- context ---------- */

interface I18nValue {
  locale: Locale;
  t: Dictionary;
}

const I18nContext = createContext<I18nValue>({ locale: DEFAULT_LOCALE, t: es });

export function I18nProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  return <I18nContext.Provider value={{ locale, t: dictionaries[locale] }}>{children}</I18nContext.Provider>;
}

export const useI18n = () => useContext(I18nContext);

/** Pick the localized member of an { es, pt } record. */
export type Localized<T = string> = Record<Locale, T>;
export const pick = <T,>(v: Localized<T>, l: Locale): T => v[l];

export function formatDate(iso: string, locale: Locale, opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", year: "numeric" }) {
  const [y, m, d] = iso.split("-").map(Number);
  // Build in UTC and format in UTC so server and browser render the same string.
  return new Intl.DateTimeFormat(locale === "es" ? "es" : "pt-BR", { ...opts, timeZone: "UTC" }).format(
    new Date(Date.UTC(y, (m || 1) - 1, d || 1)),
  );
}
