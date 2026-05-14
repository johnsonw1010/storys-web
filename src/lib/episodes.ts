import { SHOW_ID, SHOW_URL, BRANDS, type Brand } from "../data/brands";
import rawEpisodes from "../data/episodes.json";

export interface SyncedEpisode {
  num: number | null;
  titleZh: string;
  appleId: string | null;
  publishDate: string | null;
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
      titleZh: e.titleZh,
      appleId: e.appleId,
      publishDate: null,
    })),
  );
  return derived.sort((a, b) => (b.num ?? 0) - (a.num ?? 0));
}

export function getLatestEpisodes(n: number): SyncedEpisode[] {
  return getAllEpisodes().slice(0, n);
}

export { SHOW_ID, SHOW_URL };
