/* =========================================================
   Storys — Brand Data
   ---------------------------------------------------------
   The BRANDS array is GENERATED from the Google Master Sheet
   by `scripts/sync.mjs` (pull-by-gid → join → nested Brand[]),
   written to `brands.generated.json`. Do NOT hand-edit brands
   here — edit the sheet and re-run `node scripts/sync.mjs`.
   This module owns the shared types, constants, and the
   `brandLogoUrl()` helper that the whole app imports.
   ========================================================= */

import brandsData from "./brands.generated.json";

export type Category =
  | "food"
  | "fashion"
  | "wellness"
  | "tech"
  | "media"
  | "travel"
  | "platform"
  | "community"
  | "retail"
  | "creator"
  | "education"
  | "mobility"
  | "investment";

export type BrandType = "retail" | "online";

export interface Location {
  nameZh: string;
  nameEn: string;
  addressZh: string;
  addressEn: string;
  lat: number;
  lng: number;
  gmaps?: string;
  kind?: "store" | "hq";
}

export interface Episode {
  num: number | null;
  titleZh: string;
  appleId: string | null;
}

export interface Brand {
  id: string;
  nameZh: string;
  nameEn: string;
  category: Category;
  type: BrandType;
  descZh: string;
  descEn: string;
  domain: string;
  website: string;
  episodes: Episode[];
  locations?: Location[];
  logo?: boolean;
  image?: string;
}

export const SHOW_ID = "1779337239";
export const SHOW_URL = `https://podcasts.apple.com/tw/podcast/id${SHOW_ID}`;

/**
 * Resolve a brand's display logo URL.
 *   - If the brand has a hand-curated PNG in public/brand/logos/{id}.png
 *     (marked via `logo: true` on the Brand), use that.
 *   - Otherwise fall back to a Google favicon for the brand's domain.
 */
export function brandLogoUrl(
  brand: Pick<Brand, "id" | "domain" | "logo">,
): string {
  return brand.logo
    ? `/brand/logos/${brand.id}.png`
    : `https://www.google.com/s2/favicons?domain=${brand.domain}&sz=128`;
}

/** Generated from the Master Sheet — see scripts/sync.mjs. Do not hand-edit. */
export const BRANDS: Brand[] = brandsData as unknown as Brand[];
