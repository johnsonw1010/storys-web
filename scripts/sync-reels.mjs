#!/usr/bin/env node
/**
 * sync-reels.mjs — pull the Master Sheet's `instagram` tab (pinned by gid) into
 * src/lib/ig-reels.json, grouped by brand_id.
 *
 * The site renders REELS only (type=reel) that are tied to a brand. Sorting is
 * decided here so the page stays dumb: featured=yes first, then likes desc.
 * `ep_num`, when set, pins a reel to one episode (excluded from siblings).
 *
 *   node scripts/sync-reels.mjs
 */
import { writeFile } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SHEET_ID = "1axbM6qDG1pz1jCZ3_NyBZWtgcNbNb6cNtnou7FBI2P4";
const GID = "48841711"; // instagram tab (created 2026-07-02)
const OUT = resolve(__dirname, "..", "src", "lib", "ig-reels.json");

function parseCsv(text) {
  const rows = []; let row = [], field = "", q = false, i = 0;
  while (i < text.length) {
    const c = text[i];
    if (q) {
      if (c === '"') { if (text[i + 1] === '"') { field += '"'; i += 2; continue; } q = false; i++; continue; }
      field += c; i++;
    } else {
      if (c === '"') { q = true; i++; continue; }
      if (c === ",") { row.push(field); field = ""; i++; continue; }
      if (c === "\n" || c === "\r") { if (c === "\r" && text[i + 1] === "\n") i++; row.push(field); field = ""; rows.push(row); row = []; i++; continue; }
      field += c; i++;
    }
  }
  if (field !== "" || row.length) { row.push(field); rows.push(row); }
  return rows.filter((r) => r.some((x) => x !== ""));
}

const clean = (v) => { const s = (v ?? "").toString().trim(); return s === "" ? null : s; };
// Tolerate human-formatted counts ("1,234") but warn on anything unparseable
// instead of silently zeroing the likes ranking.
let badInts = 0;
const int = (v) => {
  const s = clean(v);
  if (s == null) return null;
  const n = Number(s.replace(/,/g, ""));
  if (!Number.isFinite(n)) { badInts++; return null; }
  return n;
};
// Shortcodes are IG base64url-ish tokens — only safe chars reach the embed URL.
const SHORTCODE_RE = /^[A-Za-z0-9_-]{5,20}$/;

async function main() {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${GID}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`instagram tab fetch failed: HTTP ${res.status}`);
  const rows = parseCsv(await res.text());
  const header = rows[0].map((h) => h.trim());
  const col = (name) => header.indexOf(name);
  const iCode = col("shortcode"), iType = col("type"), iBid = col("brand_id"),
        iNum = col("ep_num"), iLikes = col("likes"), iFeat = col("featured");
  if (iCode === -1 || iType === -1 || iBid === -1) {
    throw new Error(`instagram tab is missing expected headers (got: ${header.join(", ")})`);
  }

  const byBrand = {};
  let skippedCode = 0;
  for (const r of rows.slice(1)) {
    if (clean(r[iType]) !== "reel") continue;
    const bid = clean(r[iBid]);
    if (!bid) continue;
    const code = clean(r[iCode]);
    if (!code || !SHORTCODE_RE.test(code)) { skippedCode++; continue; }
    (byBrand[bid] ??= []).push({
      code,
      likes: int(r[iLikes]) ?? 0,
      epNum: iNum === -1 ? null : int(r[iNum]),
      featured: iFeat === -1 ? false : /^(yes|y|true|1)$/i.test(clean(r[iFeat]) ?? ""),
    });
  }
  for (const bid of Object.keys(byBrand)) {
    byBrand[bid].sort((a, z) => (z.featured ? 1 : 0) - (a.featured ? 1 : 0) || z.likes - a.likes);
  }

  await writeFile(OUT, JSON.stringify(byBrand, null, 2) + "\n", "utf8");
  const total = Object.values(byBrand).reduce((n, a) => n + a.length, 0);
  console.log(`[sync-reels] wrote ${total} reels across ${Object.keys(byBrand).length} brands -> ${OUT}` +
    (skippedCode ? ` (skipped ${skippedCode} bad shortcodes)` : "") +
    (badInts ? ` (WARNING: ${badInts} unparseable numeric cells treated as blank)` : ""));
}

main().catch((e) => { console.error(e); process.exit(1); });
