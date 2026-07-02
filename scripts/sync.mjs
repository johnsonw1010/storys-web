#!/usr/bin/env node
/**
 * sync.mjs — Phase 1 content pipeline (de-risk build).
 *
 * Pulls all three Master Sheet tabs BY GID (rename-proof), parses BY HEADER NAME,
 * normalizes brand_id, and JOINS them into the site's nested `Brand[]` shape
 * (episodes + locations embedded per brand, camelCase) — the exact structure
 * `src/data/brands.ts` exports and `map.astro` serializes to the browser.
 *
 * Output path is configurable. DEFAULT = scratchpad (NOT src/data) so this can be
 * verified without touching live content. To wire it live, set OUT to
 * src/data/brands.generated.json (requires sign-off — src/data is protected).
 *
 *   node scripts/sync.mjs               # writes to $OUT or scratchpad, prints a report
 */

import { writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO = resolve(__dirname, "..");

const SHEET_ID = "1axbM6qDG1pz1jCZ3_NyBZWtgcNbNb6cNtnou7FBI2P4";
const GIDS = { episodes: "0", locations: "671058504", brands: "2083068908" };
const OUT =
  process.env.OUT ??
  resolve(REPO, "..", "..", "scratchpad", "brands.generated.json"); // scratchpad default; not src/data

const VALID_CATEGORIES = new Set([
  "food","fashion","wellness","tech","media","travel","platform",
  "community","retail","creator","education","mobility","investment",
]);

// brand_id typo map (applied AFTER trim+lowercase)
const BRAND_ID_FIXES = { backfounder: "backerfounder", "soft savant skill": "megan" };

// Manual episode→brand links for blank-brand_id eps the title-matcher can't catch
// (title names the founder / a short name, not a brand token). ep 46 is a genuine
// multi-founder recap and stays unlinked on purpose.
const EPISODE_BRAND_OVERRIDES = { 36: "speak", 50: "dengyi" };

// --- CSV parser (RFC4180-ish; same approach as sync-episodes.mjs) ---------
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

const clean = (v) => { const s = (v ?? "").toString().trim(); return s === "" || s === "無" || s === "缺" ? null : s; };
const normId = (v) => { const s = clean(v); if (!s) return null; const k = s.toLowerCase(); return BRAND_ID_FIXES[k] ?? k; };
// Only accept http(s) URLs — a sheet-authored `javascript:`/`data:` URL must never reach an href.
const httpUrl = (v) => { const s = clean(v); return s && /^https?:\/\//i.test(s) ? s : ""; };

// Auto-clean: "#N Storys | <brand> | <descriptive> | <guest>" → keep brand + descriptive.
function cleanTitle(raw) {
  const s = clean(raw); if (!s) return "";
  let parts = s.split(/\s*[|｜]\s*/).map((p) => p.trim()).filter(Boolean);
  if (parts.length && /storys/i.test(parts[0]) && /^#?\s*\d+/.test(parts[0])) parts.shift(); // drop "#N Storys"
  if (parts.length >= 3) parts.pop();                                                          // drop trailing guest
  return parts.join("｜");
}
// Normalize for fuzzy brand-name matching in titles (handles variant chars / spacing).
const normMatch = (s) => (s ?? "").toLowerCase().replace(/[\s\-—_|｜·,，。、:：&()（）]/g, "");

async function fetchTab(gid) {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${gid}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Tab ${gid} fetch failed: HTTP ${res.status}`);
  const rows = parseCsv(await res.text());
  const header = rows[0].map((h) => h.trim());
  // index-by-header-name accessor
  const idx = (name) => header.indexOf(name);
  return rows.slice(1).map((r) => ({ get: (name) => r[idx(name)] }));
}

async function main() {
  const [brandRows, locRows, epRows] = await Promise.all([
    fetchTab(GIDS.brands), fetchTab(GIDS.locations), fetchTab(GIDS.episodes),
  ]);

  // index episodes + locations by normalized brand_id
  const epsByBrand = new Map(), locsByBrand = new Map();
  const orphanEps = [], orphanLocs = [], dupLocs = [], badCoordLocs = [];
  const seenLoc = new Set();

  const brandIds = new Set(brandRows.map((b) => normId(b.get("id"))).filter(Boolean));
  // distinctive match tokens per brand (id + english + chinese name), for auto-linking blank-bid eps
  const brandTokens = brandRows.map((b) => {
    const id = normId(b.get("id"));
    const toks = [id, normMatch(b.get("name_en")), normMatch(b.get("name_zh"))].filter((t) => t && t.length >= 3);
    return { id, toks };
  }).filter((x) => x.id);

  const autoLinked = [], ambiguous = [], unmatched = [], titleSamples = [];
  for (const e of epRows) {
    const num = clean(e.get("集數")) ? Number(e.get("集數")) : null;
    const rawTitle = e.get("中文標題");
    const ep = { num, titleZh: cleanTitle(rawTitle), appleId: clean(e.get("Apple Podcasts ID")) };
    if (titleSamples.length < 8 && clean(rawTitle)) titleSamples.push({ raw: clean(rawTitle), clean: ep.titleZh });
    let bid = normId(e.get("brand_id"));
    if (bid && brandIds.has(bid)) { (epsByBrand.get(bid) ?? epsByBrand.set(bid, []).get(bid)).push(ep); continue; }
    if (bid && !brandIds.has(bid)) { orphanEps.push({ num, bid }); continue; }
    // blank brand_id → manual override first, else auto-link by title
    if (EPISODE_BRAND_OVERRIDES[num] && brandIds.has(EPISODE_BRAND_OVERRIDES[num])) {
      const ob = EPISODE_BRAND_OVERRIDES[num];
      autoLinked.push({ num, brand: ob, via: "override" });
      (epsByBrand.get(ob) ?? epsByBrand.set(ob, []).get(ob)).push(ep);
      continue;
    }
    const hay = normMatch(rawTitle);
    const hits = brandTokens.filter((b) => b.toks.some((t) => hay.includes(t)));
    if (hits.length === 1) { autoLinked.push({ num, brand: hits[0].id }); (epsByBrand.get(hits[0].id) ?? epsByBrand.set(hits[0].id, []).get(hits[0].id)).push(ep); }
    else if (hits.length === 0) unmatched.push({ num, title: ep.titleZh });
    else ambiguous.push({ num, brands: hits.map((h) => h.id) });
  }
  for (const l of locRows) {
    const bid = normId(l.get("brand_id"));
    if (!bid) continue;
    const rawLat = clean(l.get("lat")), rawLng = clean(l.get("lng"));
    const loc = { nameZh: clean(l.get("name_zh")) ?? "", nameEn: clean(l.get("name_en")) ?? "",
      addressZh: clean(l.get("address_zh")) ?? "", addressEn: clean(l.get("address_en")) ?? "",
      lat: Number(rawLat), lng: Number(rawLng),
      gmaps: clean(l.get("gmaps_url")) ?? undefined, kind: clean(l.get("kind")) ?? undefined };
    if (!brandIds.has(bid)) { orphanLocs.push(bid); continue; }
    // defensive: a location with no usable coordinates can't be mapped — skip it
    // (renders as 0 locations for that brand until the sheet's lat/lng are filled).
    // Note: Number(null/"") === 0 which IS finite, so guard on the raw cell too.
    if (rawLat == null || rawLng == null || !Number.isFinite(loc.lat) || !Number.isFinite(loc.lng)) {
      badCoordLocs.push(`${bid}|${loc.nameZh}`); continue;
    }
    const key = `${bid}|${loc.nameZh}|${loc.addressZh}`;
    if (seenLoc.has(key)) { dupLocs.push(key); continue; }   // defensive: drop exact dup rows
    seenLoc.add(key);
    (locsByBrand.get(bid) ?? locsByBrand.set(bid, []).get(bid)).push(loc);
  }

  const brands = [], badCats = [], noLogoFile = [];
  for (const b of brandRows) {
    const id = normId(b.get("id"));
    if (!id) continue;
    const category = clean(b.get("category"));
    if (!VALID_CATEGORIES.has(category)) badCats.push({ id, category });
    const logoFile = existsSync(resolve(REPO, "public/brand/logos", `${id}.png`));
    if (!logoFile) noLogoFile.push(id);
    const eps = (epsByBrand.get(id) ?? []).sort((a, z) => (a.num ?? 0) - (z.num ?? 0));
    brands.push({
      id, nameZh: clean(b.get("name_zh")) ?? "", nameEn: clean(b.get("name_en")) ?? "",
      category, type: clean(b.get("type")),
      descZh: clean(b.get("desc_zh")) ?? "", descEn: clean(b.get("desc_en")) ?? "",
      domain: clean(b.get("domain")) ?? "", website: httpUrl(b.get("website")),
      episodes: eps, locations: locsByBrand.get(id) ?? [], logo: logoFile,
    });
  }

  await writeFile(OUT, JSON.stringify(brands, null, 2) + "\n", "utf8");

  // ---- report ----
  const epsMatched = [...epsByBrand.values()].reduce((n, a) => n + a.length, 0);
  const locsMatched = [...locsByBrand.values()].reduce((n, a) => n + a.length, 0);
  console.log(`\n=== sync.mjs report ===`);
  console.log(`brands:            ${brands.length}`);
  console.log(`episodes matched:  ${epsMatched}  | orphaned: ${orphanEps.length} ${JSON.stringify(orphanEps.map(o=>o.bid))}`);
  console.log(`  auto-linked follow-ups: ${autoLinked.length} ${JSON.stringify(autoLinked)}`);
  console.log(`  ambiguous (multi-brand, left unlinked): ${ambiguous.length} ${JSON.stringify(ambiguous)}`);
  console.log(`  unmatched blank-bid (left unlinked):    ${unmatched.length} eps ${JSON.stringify(unmatched.map(u=>u.num))}`);
  console.log(`\n  title clean samples (raw → clean):`);
  for (const t of titleSamples) console.log(`   • ${t.raw}\n     → ${t.clean}`);
  console.log("");
  console.log(`locations matched: ${locsMatched}  | orphaned: ${orphanLocs.length}  | exact dupes dropped: ${dupLocs.length} ${JSON.stringify(dupLocs)}`);
  console.log(`  dropped (no coords, fill lat/lng in sheet): ${badCoordLocs.length} ${JSON.stringify(badCoordLocs)}`);
  console.log(`bad categories:    ${badCats.length} ${JSON.stringify(badCats)}`);
  console.log(`missing logo file: ${noLogoFile.length} ${JSON.stringify(noLogoFile)}`);
  console.log(`wrote -> ${OUT}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
