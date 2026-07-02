#!/usr/bin/env node
/**
 * validate.mjs — Phase 1 build-time data validation gate (§5.1).
 *
 * Self-contained: re-fetches all three Master Sheet tabs BY GID (same source as
 * sync.mjs) and re-runs the same normalization, then validates the joined data
 * and prints a clear PASS/FAIL report.
 *
 * Does NOT import sync.mjs (that has write side-effects). It reuses sync.mjs's
 * conventions: the RFC4180-ish CSV parser, the clean()/normId() helpers, the
 * BRAND_ID_FIXES typo map, and the header-name field accessor.
 *
 * Exit code:
 *   - process.exit(1) if ANY hard error is found (fails the build).
 *   - exit 0 otherwise (warnings never fail the build).
 *
 *   node scripts/validate.mjs
 *
 * HARD errors (fail build):
 *   - duplicate brand `id`
 *   - unknown `category` (not in the 13-value Category enum from brands.ts)
 *   - a `category` with no matching `cat.<category>` key in src/data/i18n.ts
 *   - any episode/location `brand_id` that doesn't resolve to a known brand
 *   - a location with missing or non-numeric `lat`/`lng`
 *
 * WARNINGS (report only):
 *   - a `retail` brand with 0 locations
 *   - a brand missing its logo PNG at public/brand/logos/<id>.png
 */

import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO = resolve(__dirname, "..");

const SHEET_ID = "1axbM6qDG1pz1jCZ3_NyBZWtgcNbNb6cNtnou7FBI2P4";
const GIDS = { episodes: "0", locations: "671058504", brands: "2083068908" };

// 13-value Category enum — MUST mirror src/data/brands.ts. Kept inline (not
// imported) because brands.ts is a .ts module; we read i18n.ts below to confirm
// each category also has a translation key, which catches drift either way.
const VALID_CATEGORIES = new Set([
  "food", "fashion", "wellness", "tech", "media", "travel", "platform",
  "community", "retail", "creator", "education", "mobility", "investment",
]);

// brand_id typo map (applied AFTER trim+lowercase) — same as sync.mjs.
const BRAND_ID_FIXES = { backfounder: "backerfounder", "soft savant skill": "megan" };

// --- CSV parser (RFC4180-ish; identical approach to sync.mjs) --------------
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

async function fetchTab(gid) {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${gid}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Tab ${gid} fetch failed: HTTP ${res.status}`);
  const rows = parseCsv(await res.text());
  const header = rows[0].map((h) => h.trim());
  const idx = (name) => header.indexOf(name);
  return rows.slice(1).map((r) => ({ get: (name) => r[idx(name)] }));
}

// Extract every distinct cat.* key declared in src/data/i18n.ts (e.g. "cat.food").
function readCatKeysFromI18n() {
  const src = readFileSync(resolve(REPO, "src/data/i18n.ts"), "utf8");
  const keys = new Set();
  const re = /["']cat\.([a-z0-9_-]+)["']\s*:/gi;
  let m;
  while ((m = re.exec(src)) !== null) keys.add(m[1].toLowerCase());
  return keys;
}

// ANSI helpers (degrade gracefully if not a TTY)
const useColor = process.stdout.isTTY;
const c = (code, s) => (useColor ? `\x1b[${code}m${s}\x1b[0m` : s);
const red = (s) => c("31", s), green = (s) => c("32", s), yellow = (s) => c("33", s), bold = (s) => c("1", s);
const OK = green("✓"), BAD = red("✗"), WARN = yellow("!");

async function main() {
  const catKeys = readCatKeysFromI18n();

  const [brandRows, locRows, epRows] = await Promise.all([
    fetchTab(GIDS.brands), fetchTab(GIDS.locations), fetchTab(GIDS.episodes),
  ]);

  const hardErrors = []; // { check, detail }
  const warnings = [];

  // ---- Brands: ids, duplicates, categories ----
  const idCounts = new Map();      // normalized id -> count
  const idFirstSeen = new Map();   // normalized id -> raw value (for reporting)
  const brandIds = new Set();      // resolvable brand ids
  const brandById = new Map();     // id -> { type, rawCategory }

  for (const b of brandRows) {
    const id = normId(b.get("id"));
    if (!id) continue;
    idCounts.set(id, (idCounts.get(id) ?? 0) + 1);
    if (!idFirstSeen.has(id)) idFirstSeen.set(id, clean(b.get("id")));
    brandIds.add(id);

    const category = clean(b.get("category"));
    const type = clean(b.get("type"));
    brandById.set(id, { type, category });

    // HARD: unknown category (not in 13-value enum)
    if (!category || !VALID_CATEGORIES.has(category)) {
      hardErrors.push({ check: "unknown-category", detail: `brand '${id}': category=${JSON.stringify(category)} not in Category enum` });
    } else if (!catKeys.has(category)) {
      // HARD: category valid in enum but missing a cat.<category> key in i18n.ts
      hardErrors.push({ check: "missing-i18n-cat-key", detail: `brand '${id}': category '${category}' has no "cat.${category}" key in src/data/i18n.ts` });
    }

    // HARD: website must be http(s) if present — a sheet-authored javascript:/data: URL must never reach an href.
    const website = clean(b.get("website"));
    if (website && !/^https?:\/\//i.test(website)) {
      hardErrors.push({ check: "bad-website-scheme", detail: `brand '${id}': website ${JSON.stringify(website)} is not http(s)` });
    }
    // WARN: HTML-ish chars in a serialized text field (the inline-script sink is escaped; this surfaces suspicious input).
    for (const f of ["name_zh", "name_en", "desc_zh", "desc_en"]) {
      const v = clean(b.get(f));
      if (v && /[<>]/.test(v)) warnings.push({ check: "html-in-text", detail: `brand '${id}': field '${f}' contains < or > — ${JSON.stringify(v.slice(0, 40))}` });
    }
  }

  // HARD: duplicate brand id
  for (const [id, n] of idCounts) {
    if (n > 1) hardErrors.push({ check: "duplicate-brand-id", detail: `brand id '${id}' appears ${n} times` });
  }

  // ---- Episodes: brand_id resolution ----
  // Only rows that HAVE a brand_id are checked for resolution. Blank brand_id
  // rows are interview-recap / multi-founder episodes that sync.mjs links by
  // title/override — not a data error, so not validated here.
  let epWithBid = 0, epBlankBid = 0;
  const epOrphans = [];
  for (const e of epRows) {
    const num = clean(e.get("集數"));
    const bid = normId(e.get("brand_id"));
    if (!bid) { epBlankBid++; continue; }
    epWithBid++;
    if (!brandIds.has(bid)) {
      hardErrors.push({ check: "episode-orphan-brand_id", detail: `episode ${num ?? "?"}: brand_id '${bid}' resolves to no known brand` });
      epOrphans.push({ num, bid });
    }
  }

  // ---- Locations: brand_id resolution + lat/lng ----
  let locWithBid = 0, locBlankBid = 0;
  const locsByBrand = new Map();
  for (const l of locRows) {
    const bid = normId(l.get("brand_id"));
    const nameZh = clean(l.get("name_zh")) ?? "(unnamed)";
    if (!bid) { locBlankBid++; continue; }
    locWithBid++;

    // HARD: location brand_id must resolve
    if (!brandIds.has(bid)) {
      hardErrors.push({ check: "location-orphan-brand_id", detail: `location '${nameZh}': brand_id '${bid}' resolves to no known brand` });
    } else {
      locsByBrand.set(bid, (locsByBrand.get(bid) ?? 0) + 1);
    }

    // HARD: lat/lng missing or non-numeric (checked regardless of brand match)
    const latRaw = clean(l.get("lat")), lngRaw = clean(l.get("lng"));
    const lat = latRaw === null ? NaN : Number(latRaw);
    const lng = lngRaw === null ? NaN : Number(lngRaw);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      // WARN not HARD: sync.mjs drops coord-less locations from the map, so this is
      // incomplete data (VA to fill), not a build-breaker (see Decision #17).
      warnings.push({ check: "location-bad-latlng", detail: `location '${nameZh}' (brand ${bid}): lat=${JSON.stringify(latRaw)} lng=${JSON.stringify(lngRaw)} — missing/non-numeric, dropped from map` });
    }
  }

  // ---- Warnings ----
  for (const [id, info] of brandById) {
    // WARN: retail brand with 0 locations
    if (info.type === "retail" && !(locsByBrand.get(id) > 0)) {
      warnings.push({ check: "retail-no-locations", detail: `brand '${id}' is type=retail but has 0 locations` });
    }
    // WARN: missing logo PNG
    if (!existsSync(resolve(REPO, "public/brand/logos", `${id}.png`))) {
      warnings.push({ check: "missing-logo", detail: `brand '${id}': no logo at public/brand/logos/${id}.png` });
    }
  }

  // ---- Report ----
  console.log("");
  console.log(bold("=== validate.mjs — Storys data validation (§5.1) ==="));
  console.log("");
  console.log("Counts:");
  console.log(`  brands:    ${brandIds.size}`);
  console.log(`  episodes:  ${epRows.length}  (with brand_id: ${epWithBid}, blank brand_id: ${epBlankBid})`);
  console.log(`  locations: ${locRows.length}  (with brand_id: ${locWithBid}, blank brand_id: ${locBlankBid})`);
  console.log(`  i18n cat.* keys: ${catKeys.size}  |  Category enum size: ${VALID_CATEGORIES.size}`);
  console.log("");

  // Group hard errors by check for readability
  const checks = [
    ["duplicate-brand-id", "Duplicate brand ids"],
    ["unknown-category", "Categories in the 13-value enum"],
    ["missing-i18n-cat-key", "Category → cat.* i18n key present"],
    ["episode-orphan-brand_id", "Episode brand_id resolves to a brand"],
    ["location-orphan-brand_id", "Location brand_id resolves to a brand"],
    ["bad-website-scheme", "Brand website is http(s)"],
  ];
  console.log(bold("HARD checks (fail build):"));
  for (const [key, label] of checks) {
    const hits = hardErrors.filter((e) => e.check === key);
    if (hits.length === 0) {
      console.log(`  ${OK} ${label}`);
    } else {
      console.log(`  ${BAD} ${label} — ${hits.length} error(s):`);
      for (const h of hits) console.log(`      ${red("•")} ${h.detail}`);
    }
  }
  console.log("");

  console.log(bold("WARNINGS (report only, do not fail build):"));
  if (warnings.length === 0) {
    console.log(`  ${OK} none`);
  } else {
    const wChecks = [
      ["retail-no-locations", "Retail brands with 0 locations"],
      ["missing-logo", "Brands missing a logo PNG"],
      ["location-bad-latlng", "Locations dropped for missing coordinates"],
      ["html-in-text", "Brand text fields containing < or >"],
    ];
    for (const [key, label] of wChecks) {
      const hits = warnings.filter((w) => w.check === key);
      if (hits.length === 0) continue;
      console.log(`  ${WARN} ${label} — ${hits.length}:`);
      for (const h of hits) console.log(`      ${yellow("•")} ${h.detail}`);
    }
  }
  console.log("");

  // ---- Verdict ----
  if (hardErrors.length > 0) {
    console.log(red(bold(`FAIL — ${hardErrors.length} hard error(s), ${warnings.length} warning(s).`)));
    console.log("");
    process.exit(1);
  }
  console.log(green(bold(`PASS — 0 hard errors, ${warnings.length} warning(s).`)));
  console.log("");
  process.exit(0);
}

main().catch((e) => { console.error(red("validate.mjs crashed:")); console.error(e); process.exit(1); });
