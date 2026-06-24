import { SHOW_ID, SHOW_URL, BRANDS, type Brand } from "../data/brands";
import rawEpisodes from "../data/episodes.json";

export interface SyncedEpisode {
  num: number | null;
  publishDate: string | null;
  titleZh: string;
  titleEn: string | null;
  guestName: string | null;
  guestTitle: string | null;
  brandNameZh: string | null;
  brandId: string | null;
  appleId: string | null;
  spotifyId: string | null;
  soundonUrl: string | null;
  kkboxUrl: string | null;
  durationSec: number | null;
  transcriptFile: string | null;
  coverFile: string | null;
  summary: string | null;
}

export interface EpisodesData {
  syncedAt: string | null;
  items: SyncedEpisode[];
}

const data = rawEpisodes as EpisodesData;

export function appleEpisodeUrl(appleId: string | null | undefined): string {
  if (!appleId) return SHOW_URL;
  return `${SHOW_URL}?i=${appleId}`;
}

export function findBrandByAppleId(appleId: string | null | undefined): Brand | undefined {
  if (!appleId) return undefined;
  return BRANDS.find((b) => b.episodes.some((e) => e.appleId === appleId));
}

/**
 * If RSS sync has populated episodes.json, use it. Otherwise fall back to the
 * flat list derived from BRANDS so the site still renders meaningfully.
 */
export function getAllEpisodes(): SyncedEpisode[] {
  if (data.items.length > 0) {
    return [...data.items].sort((a, b) => (b.num ?? 0) - (a.num ?? 0));
  }
  const derived: SyncedEpisode[] = BRANDS.flatMap((b) =>
    b.episodes.map((e) => ({
      num: e.num,
      publishDate: null,
      titleZh: e.titleZh,
      titleEn: null,
      guestName: null,
      guestTitle: null,
      brandNameZh: b.nameZh,
      brandId: b.id,
      appleId: e.appleId,
      spotifyId: null,
      soundonUrl: null,
      kkboxUrl: null,
      durationSec: null,
      transcriptFile: null,
      coverFile: null,
      summary: null,
    })),
  );
  return derived.sort((a, b) => (b.num ?? 0) - (a.num ?? 0));
}

export function getLatestEpisodes(n: number): SyncedEpisode[] {
  return getAllEpisodes().slice(0, n);
}

export { SHOW_ID, SHOW_URL };
