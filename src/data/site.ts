/**
 * Central brand, URL and contact settings.
 * WhatsApp: +55 81 99684-6263, supplied by the project owner on 2026-11-24 as the
 * number that receives the inquiry form (override with VITE_CONTACT_WHATSAPP).
 * E-mail and CRM endpoint stay empty until Longone confirms them (see .env.example).
 */
import { asset } from "../lib/base";

const env = import.meta.env;

const clean = (v: unknown) => (typeof v === "string" ? v.trim() : "");

/** Number that receives inquiries (digits, with country code). */
const DEFAULT_WHATSAPP = "5581996846263";

export const site = {
  name: "Longone Inversiones Inmobiliárias",
  shortName: "Longone",
  signature: "Beyond real estate.",
  url: (clean(env.VITE_SITE_URL) || "https://longoneinversiones.com.br").replace(/\/$/, ""),
  officialSite: "https://longoneinversiones.com.br/",
  brandColors: {
    obsidian: "#0d1013",
    longoneBlue: "#2e86d9",
  },
  logo: {
    full: asset("/assets/brand/longone-logo.webp"),
    fullWhite: asset("/assets/brand/longone-logo-white.webp"),
    fullInk: asset("/assets/brand/longone-logo-ink.webp"),
    wordmarkWhite: asset("/assets/brand/longone-wordmark-white.webp"),
    wordmarkInk: asset("/assets/brand/longone-wordmark-ink.webp"),
    nameWhite: asset("/assets/brand/longone-name-white.webp"),
    symbolWhite: asset("/assets/brand/longone-symbol-white.webp"),
    symbolInk: asset("/assets/brand/longone-symbol-ink.webp"),
    png: asset("/assets/brand/longone-logo.png"),
  },
  ogImage: asset("/assets/og/longone-og.jpg"),
} as const;

export const contact = {
  /** HTTPS endpoint receiving the inquiry form as JSON (CRM webhook). Empty = not connected. */
  endpoint: clean(env.VITE_CONTACT_ENDPOINT),
  /** Official WhatsApp number, digits only with country code. Empty = not published. */
  whatsapp: (clean(env.VITE_CONTACT_WHATSAPP) || DEFAULT_WHATSAPP).replace(/\D/g, ""),
  /** Official e-mail address. Empty = not published. */
  email: clean(env.VITE_CONTACT_EMAIL),
} as const;

/** Office address — supplied by the project owner on 2026-11-24. */
export const office = {
  street: "Rua Dom Expedito Lopes, 19",
  district: "Monte",
  city: "Olinda",
  state: "PE",
  postalCode: "53240-200",
  country: "BR",
} as const;

const officeQuery = `${office.street}, ${office.district}, ${office.city} - ${office.state}, ${office.postalCode}, Brasil`;

/** Keyless Google Maps embed with a pin on the address (hl = interface language). */
export const officeMapEmbed = (hl: string) =>
  `https://maps.google.com/maps?q=${encodeURIComponent(officeQuery)}&z=16&hl=${hl}&output=embed`;

export const officeMapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(officeQuery)}`;

export const hasDirectChannels = Boolean(contact.whatsapp || contact.email);

/** "5581996846263" → "+55 81 99684-6263" */
export function formatPhone(digits: string) {
  const m = digits.match(/^(55)(\d{2})(\d{4,5})(\d{4})$/);
  return m ? `+${m[1]} ${m[2]} ${m[3]}-${m[4]}` : `+${digits}`;
}
