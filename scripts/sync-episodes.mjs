#!/usr/bin/env node
/**
 * Fetches the Storys Podcast RSS feed and writes a normalized JSON file at
 * src/data/episodes.json. The site renders episode metadata from this file
 * when present; otherwise it falls back to the per-brand episodes list in
 * src/data/brands.ts.
 *
 * Run manually:   npm run sync-episodes
 * Runs in CI:     daily via .github/workflows/sync-episodes.yml
 */

import { writeFile } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { XMLParser } from "fast-xml-parser";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const RSS_URL = process.env.STORYS_RSS_URL ?? "https://anchor.fm/s/fd7da1ec/podcast/rss";
const SHOW_ID = process.env.STORYS_SHOW_ID ?? "1779337239";
const OUTPUT = resolve(__dirname, "..", "src", "data", "episodes.json");

const ITUNES_LOOKUP = (appleId) =>
  `https://itunes.apple.com/lookup?id=${appleId}&entity=podcastEpisode&limit=200`;

/** Best-effort: pull "EP #12" / "EP12" / "12｜..." / etc. */
function extractEpisodeNumber(title) {
  if (!title) return null;
  const patterns = [
    /^EP[\s#]*(\d+)/i,
    /第\s*(\d+)\s*集/,
    /^#?(\d+)[\s｜|·\-]/,
    /(\d+)\s*\/\s*\d+/,
  ];
  for (const p of patterns) {
    const m = title.match(p);
    if (m && m[1]) return Number(m[1]);
  }
  return null;
}

async function fetchEpisodesViaItunes() {
  const res = await fetch(ITUNES_LOOKUP(SHOW_ID));
  if (!res.ok) throw new Error(`iTunes lookup failed: HTTP ${res.status}`);
  const data = await res.json();
  const episodes = (data.results || []).filter((r) => r.kind === "podcast-episode");
  return episodes.map((e) => ({
    num: extractEpisodeNumber(e.trackName),
    titleZh: e.trackName,
    appleId: String(e.trackId),
    publishDate: e.releaseDate ?? null,
  }));
}

async function fetchEpisodesViaRss() {
  const res = await fetch(RSS_URL);
  if (!res.ok) throw new Error(`RSS fetch failed: HTTP ${res.status}`);
  const xml = await res.text();
  const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "@_" });
  const parsed = parser.parse(xml);
  const items = parsed?.rss?.channel?.item ?? [];
  const list = Array.isArray(items) ? items : [items];
  return list.map((item) => ({
    num: extractEpisodeNumber(item.title),
    titleZh: item.title ?? "",
    appleId: null,
    publishDate: item.pubDate ?? null,
  }));
}

async function main() {
  console.log(`[sync-episodes] Trying iTunes Lookup for show ${SHOW_ID}…`);
  let items = [];
  try {
    items = await fetchEpisodesViaItunes();
    console.log(`[sync-episodes] iTunes Lookup returned ${items.length} episodes.`);
  } catch (err) {
    console.warn(`[sync-episodes] iTunes Lookup failed: ${err.message}. Falling back to RSS…`);
  }

  if (items.length === 0) {
    try {
      items = await fetchEpisodesViaRss();
      console.log(`[sync-episodes] RSS returned ${items.length} episodes.`);
    } catch (err) {
      console.error(`[sync-episodes] RSS failed: ${err.message}`);
      process.exit(1);
    }
  }

  items.sort((a, b) => (b.num ?? 0) - (a.num ?? 0));

  const out = {
    syncedAt: new Date().toISOString(),
    items,
  };
  await writeFile(OUTPUT, JSON.stringify(out, null, 2) + "\n", "utf8");
  console.log(`[sync-episodes] Wrote ${items.length} episodes to ${OUTPUT}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
