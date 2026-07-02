import { SHOW_ID, SHOW_URL, BRANDS, type Brand } from "../data/brands";
import rawEpisodes from "../data/episodes.json";
import summaries from "./episode-summaries.json";
import reelsData from "./ig-reels.json";

export interface EpisodeSummary {
  status: string;
  blurb: string;
  takeaways: { title: string; body: string }[];
  metaDesc: string;
}

/** Human-reviewed editorial summary for an episode (sidecar; → Sheet/episodes.json later). */
export function getEpisodeSummary(num: number | null | undefined): EpisodeSummary | null {
  if (num == null) return null;
  return (summaries as Record<string, EpisodeSummary>)[String(num)] ?? null;
}

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

export function getEpisodeByNum(num: number): SyncedEpisode | undefined {
  return getAllEpisodes().find((e) => e.num === num);
}

/** Drop the "#N Storys |" prefix and the trailing "| guest" from a raw sheet title. */
export function cleanEpisodeTitle(raw: string): string {
  let parts = raw.split(/\s*[|｜]\s*/).map((p) => p.trim()).filter(Boolean);
  if (parts.length && /storys/i.test(parts[0]) && /^#?\s*\d+/.test(parts[0])) parts.shift();
  if (parts.length >= 3) parts.pop();
  return parts.join("｜") || raw;
}

/** Internal episode-page URL; falls back to Apple only if an episode has no num. */
export function episodeUrl(ep: Pick<SyncedEpisode, "num" | "appleId">): string {
  return ep.num != null ? `/episodes/${ep.num}` : appleEpisodeUrl(ep.appleId);
}

export interface Reel {
  code: string;
  likes: number;
  epNum: number | null;
  featured: boolean;
}

/**
 * Instagram reels for an episode, keyed by its brand (synced from the Master
 * Sheet's `instagram` tab by scripts/sync-reels.mjs). Selection: reels pinned to
 * THIS episode (ep_num) lead, then featured, then top-liked. A reel pinned to a
 * different episode never leaks onto siblings.
 */
export function getEpisodeReels(
  brandId: string | null | undefined,
  epNum: number | null,
  max = 3,
): Reel[] {
  if (!brandId) return [];
  const all = (reelsData as Record<string, Reel[]>)[brandId] ?? [];
  return all
    .filter((r) => r.epNum == null || r.epNum === epNum)
    .sort(
      (a, z) =>
        (z.epNum === epNum ? 1 : 0) - (a.epNum === epNum ? 1 : 0) ||
        (z.featured ? 1 : 0) - (a.featured ? 1 : 0) ||
        z.likes - a.likes,
    )
    .slice(0, max);
}

export function appleEmbedUrl(appleId: string | null | undefined): string | null {
  return appleId ? `https://embed.podcasts.apple.com/tw/podcast/id${SHOW_ID}?i=${appleId}` : null;
}

export function spotifyEmbedUrl(spotifyId: string | null | undefined): string | null {
  return spotifyId ? `https://open.spotify.com/embed/episode/${spotifyId}` : null;
}

export { SHOW_ID, SHOW_URL };
