#!/usr/bin/env node
/**
 * sync-summaries.mjs — pull human-owned episode summaries from the Master Sheet
 * (Episodes tab) into src/lib/episode-summaries.json, which the episode pages render.
 *
 * Source of truth = the Master Sheet (Option A). Columns expected on the Episodes tab:
 *   集數              -> episode number (key)
 *   summary_zh        -> the editorial blurb (one paragraph)
 *   summary_takeaways -> 3 lines, each "標題｜內文"
 *   summary_meta      -> ~70-char SEO meta description
 *   summary_status    -> draft | ready-for-review | approved   (only ready/approved render)
 *
 * Run: node scripts/sync-summaries.mjs
 */
import { writeFile } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SHEET_ID = "1axbM6qDG1pz1jCZ3_NyBZWtgcNbNb6cNtnou7FBI2P4";
// Summaries live on the dedicated "summaries" tab, pinned by gid (rename-proof;
// same convention as sync.mjs). Tab created + seeded 2026-07-02.
const GID = "2040068732";
const OUT = resolve(__dirname, "..", "src", "lib", "episode-summaries.json");
const RENDERABLE = new Set(["ready-for-review", "ready", "approved"]);

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

const clean = (v) => { const s = (v ?? "").toString().trim(); return s === "" || s === "缺" || s === "無" ? "" : s; };

function parseTakeaways(cell) {
  return clean(cell)
    .split(/\s*‖\s*|\r?\n/) // takeaways separated by ‖ (sheet-safe) or newlines
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => {
      const [title, ...rest] = l.split(/[｜|]/);
      return { title: (title || "").trim(), body: rest.join("｜").trim() };
    })
    .filter((t) => t.title || t.body);
}

async function main() {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${GID}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`summaries tab fetch failed: HTTP ${res.status}`);
  const rows = parseCsv(await res.text());
  const header = rows[0].map((h) => h.trim());
  const col = (name) => header.indexOf(name);
  const iNum = col("num"), iBlurb = col("summary_zh"), iTake = col("summary_takeaways"),
        iMeta = col("summary_meta"), iStatus = col("summary_status");

  if (iBlurb === -1) {
    console.error("No summary_zh column on the Episodes tab yet — add the summary columns first. Nothing written.");
    process.exit(1);
  }

  const out = {};
  let kept = 0, skipped = 0;
  for (const r of rows.slice(1)) {
    const num = clean(r[iNum]);
    const blurb = clean(r[iBlurb]);
    const status = (clean(r[iStatus]) || "draft").toLowerCase();
    if (!num || !blurb) continue;
    if (!RENDERABLE.has(status)) { skipped++; continue; }
    out[num] = {
      status,
      blurb,
      takeaways: iTake > -1 ? parseTakeaways(r[iTake]) : [],
      metaDesc: iMeta > -1 ? clean(r[iMeta]) : "",
    };
    kept++;
  }

  await writeFile(OUT, JSON.stringify(out, null, 2) + "\n", "utf8");
  console.log(`[sync-summaries] wrote ${kept} summaries (skipped ${skipped} non-ready) -> ${OUT}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
