import manifest from "./media.generated.json";
import { asset } from "../lib/base";

export interface MediaItem {
  id: string;
  base: string;
  width: number;
  height: number;
  color: string;
  widths: number[];
  watermark?: boolean;
  category?: string | null;
  author?: string | null;
  license?: string | null;
  licenseUrl?: string | null;
  sourceUrl?: string | null;
}

type Manifest = {
  developments: Record<string, MediaItem[]>;
  destinations: Record<string, MediaItem[]>;
};

const data = manifest as unknown as Manifest;
const index = new Map<string, MediaItem>();
for (const group of [data.developments, data.destinations]) {
  for (const list of Object.values(group)) for (const item of list) index.set(item.id, item);
}

export function media(id: string): MediaItem {
  const item = index.get(id);
  if (!item) throw new Error(`Unknown media id "${id}" — run "npm run images" and check src/data/*.ts`);
  return item;
}

export const destinationMedia = (slug: string) => data.destinations[slug] ?? [];
export const developmentMedia = (slug: string) => data.developments[slug] ?? [];

export function srcSet(item: MediaItem) {
  return item.widths.map((w) => `${asset(item.base)}-${w}.webp ${w}w`).join(", ");
}

/** Pick the smallest variant at least `target` px wide (falls back to the largest). */
export function src(item: MediaItem, target = 1600) {
  const w = item.widths.find((x) => x >= target) ?? item.widths[item.widths.length - 1];
  return `${asset(item.base)}-${w}.webp`;
}

export const aspect = (item: MediaItem) => item.width / item.height;
