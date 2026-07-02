# Storys Web — Changelog

> Append-only session history (newest at the **bottom**). One entry per working session.
> Capture the *why* — intent, decisions, open questions — and link commits. Don't relist files; git has those.
> Current state and the plan live in `PLAN.md`.

---

## 2026-06-24 — Cloudflare deploy, content architecture, VA handoff

**Summary:** First major working session. Designed the whole content architecture, shipped the site to Cloudflare, and handed content collection to the VA.

**Major**
- **Deployed to Cloudflare Workers (Phase 0).** Reconciled a diverged repo: merged 29 episode-bot commits + Cloudflare's `workers-autoconfig` branch (adapter + `wrangler.jsonc`, `output: "hybrid"`) + the local logo commit. Kept the local **rich 16-field episode schema** (the bot on origin only had 4 fields). Built and deployed via `wrangler deploy`; site live, all pages 200, logos serving. (origin/main `6d51f25`)
- **Architecture decided: Sheets-as-CMS, no database.** One Google "Master Sheet" with `Episodes` / `brands` / `locations` tabs drives the site; `brand_id` links them. D1 was considered and rejected (admin-UI cost for no gain).
- **Location model:** added the `kind` (store|hq) concept via a design panel — HQ pins stay off the consumer map but show on brand pages.
- **Locations data plan:** hybrid — VA collects addresses, we geocode with OSM Nominatim (no Google billing); map stays Leaflet + OSM.

**Minor / decisions**
- Confirmed hosting = Workers (not Pages). Authenticated `wrangler` via OAuth.
- Set up `.claude/launch.json` (Astro dev :4321, Wrangler preview :8787); started both.
- Proposed an "Editorial Luxury" visual redesign — **mockups only, not built**; live site unchanged.

**VA handoff (content track, now in progress)**
- Built the Master Sheet (Johnson's own copy, `1axbM6…`), shared correctly; merged brands/locations into it as tabs.
- Wrote the VA brief + `brands.csv` / `locations.csv` (in `docs/va-handoff/` and the Drive "Website content" folder). VA tasks: fresh transparent logos for all 20 brands, review brands, add all store locations.

**Open questions / next**
- Build the Editorial Luxury Tier 1 slice? (awaiting go)
- Phase 1 (sheet → site pipeline) starts once the VA's sheet is populated.
- Set up auto-deploy (GitHub Action) so `git push` ships? Attach `storys.fm` domain?
- Started this PLAN.md / CHANGELOG.md journal system + cross-tool entry points.

---

## 2026-06-25 — Docs cleanup, forms plan, content-pipeline diagram

**Summary:** Project-management hygiene + planning. No app/runtime changes; the live site is untouched.

**Minor**
- Rewrote `README.md` for Cloudflare (it still described the old Netlify host) and made it defer to `PLAN.md` for live state. Removed stale `.next/` Next.js artifacts + old `tsconfig.tsbuildinfo`.
- Added a Mermaid "how content reaches the site" diagram to `PLAN.md` — build-time sync, **not** MCP, **not** live; deploy is manual so sheet edits aren't instant.
- Committed the previously-untracked journal/doc system (`PLAN.md`, `CHANGELOG.md`, `CLAUDE.md`, `AGENTS.md`, `docs/`) into git.

**Planned (not built)**
- Wrote `docs/plans/inbound-forms.md`: replace the inert Netlify forms with a Google-backed inbound (on-brand Astro form → Apps Script → Sheet + email; Google Forms as a ship-today fallback). Flagged the dead forms as a 🔴 risk in `PLAN.md`.

**Discussed, not yet locked**
- Episode pages: proposed click-to-expand panel (embedded Apple + Spotify on the right, brand-voiced summary on the left). Leaning **AI-draft-from-transcript + human edit**, stored as a new Sheet column; never publish AI summaries unreviewed. Brand tone drafted (~50 words) — pending sign-off.
- Bolder visual redesign: recommend **gating it until the Phase 1 content pipeline is wired**, so we style real/stable content and fold the new episode panel into the redesign rather than building it twice.
- Reminder logged: re-create the VA handoff in Traditional Chinese.

---

## 2026-06-28 — Protected-paths guardrail in CLAUDE.md

**Summary:** Workflow/tooling session, mostly *outside* this repo. The only in-repo change: an "ask before editing" guardrail in `CLAUDE.md`. No app/runtime changes; live site untouched.

**Minor / decisions**
- Added an **"Ask before editing"** section to `CLAUDE.md`: stop and ask before touching `wrangler.jsonc`, the `deploy`/`build` scripts in `package.json`, or anything in `src/data/` — the high-blast-radius surfaces (manual deploy; `src/data/*` is live content mid-migration to the Sheet). Soft guardrail (instruction-level), not a hook.
- Context (outside this repo): organized lesson notes into an "AI Collaboration Playbook" in the Obsidian vault; added a global verification-discipline rule plus `/spec` + `/interview` slash commands under `~/.claude/`.

**Open questions / next**
- Optionally harden the guardrail from a soft rule into a `settings.json` PreToolUse hook (hard lock) if instruction-level proves too loose.

---

## 2026-06-30 → 07-02 — Phase-1 engine, episode pages, SEO, covers, brand voice

**Summary:** Several working sessions (detailed narrative in the Obsidian hub `projects/storys/storys-log.md`). Built the Phase-1 join engine, shipped episode pages + the SEO baseline, batched episode covers, and drafted the brand-voice memory. All work is **local/uncommitted — nothing deployed yet.**

**Major**
- **Phase-1 sync engine** (`scripts/sync.mjs`): pulls all 3 tabs by `gid`, parses by header name, normalizes `brand_id` (typo map), auto-cleans titles + auto-links follow-up episodes, and **joins into the nested camelCase `Brand[]`** the site needs. Verified vs. live sheet (20 brands · 51 eps · 23 locations, 0 orphans) and proven field-for-field against `brands.ts`. Plus `scripts/validate.mjs` (build-time data checks, wired into `scripts/safe-deploy.sh`).
- **Episode pages** (`/episodes/[num]`): per-episode indexable page — double-bezel cover, cleaned title, guest, brand tag, compact listen row (Spotify auto-hidden while sheet IDs are wrong-format), inline Apple player, brand-voiced blurb + 3 takeaways, `PodcastEpisode` JSON-LD, OG, prev/next. Episode list no longer bounces to Apple. 11 blurbs written (writer→checker), stored in `src/lib/episode-summaries.json`.
- **SEO/AEO baseline (#4):** hand-rolled prerendered `sitemap.xml` (80 URLs, XML-escaped, origin from `Astro.site`) + `robots.txt`; centralized **canonical + OpenGraph/Twitter** in `BaseLayout` (pages pass props; episode page de-duped). Code-reviewed (2 cleanups applied) + security-reviewed (no new vulns; JSON-LD `set:html` hardened with `<`-escape).
- **Episode covers (#3):** fetched all 55 from Master Sheet col O (Drive links) → resized to 800px JPG in `public/episodes/covers/` (1.5 MB total). Verified rendering.
- **Brand logos (#9):** imported the VA's fresh 07-01 set (public Drive endpoint + `sips` → 1000px PNG). 17 clean transparent + new `speak`/`howkind`; `megan` dropped (grey bg → favicon), `kure8`/`vacanza`/`backerfounder` flagged for better sources.
- **Pipeline wired LIVE (#7):** `src/data/brands.ts` now imports `brands.generated.json` (from `scripts/sync.mjs`); keeps the shared types/consts/`brandLogoUrl`. **21 brands** (new `howkind`) · 54 eps · 23 locations · `zhenfan`→`zhenfang` + `astro.config` redirect. Hardened `sync.mjs` to drop coord-less locations. `astro check` clean (0 errors); all routes 200; redirect verified.
- **Security hardening (from `/security-review` of the wire):** sheet data is now VA-authored → treated as untrusted. Fixed a stored-XSS vector (`JSON.stringify` into `set:html` doesn't escape `</script>`): escaped the inline-script sinks in `map.astro`/`visit.astro`, sanitized `website` to http(s)-only in `sync.mjs`, and added a website-scheme hard-check + HTML-in-text warning to `validate.mjs`. `validate.mjs` still passes (missing-coords downgraded to a warning). See Decision #18.

**Decisions** (canonical: hub `storys-decisions.md` #15–16)
- **Wire the brands pipeline live now** — replace hardcoded `BRANDS` in the protected `src/data/brands.ts` with generated data (+ `zhenfan`→`zhenfang` rename/redirect), guarded by branch snapshot + `validate.mjs` + count diff.
- **Brand voice = on-disk memory** (`docs/brand/storys-brand-voice.md`), extracted from the 11 approved blurbs + VIS; the writer→checker→human-gate loop reads it.

**Open questions / next**
- Johnson: approve `docs/brand/storys-brand-voice.md` (gates the ~40-blurb batch); drop Neue Kabel + 王漢宗特黑體繁 fonts (gates the design pass); confirm `summaries` tab + gid.
- Then: wire pipeline live (#7), blurbs batch (#2), dead-forms fix (#5), default OG card, design/VIS pass (#6), ship + attach `storys.fm` (#10).

---

## 2026-07-02 (cont.) — Blurbs ×40, locations backfill, summaries tab, /visit + About

**Summary:** The big content push, all human-gated. Voice doc approved → full blurb batch; Claude wrote the Master Sheet directly (clipboard-paste, CSV-verified); /visit widened; About palette section removed. Everything local — nothing deployed.

**Major**
- **All 51 episodes now have brand-voiced blurbs.** 8 writer agents (Sonnet) drafted from transcripts per `docs/brand/storys-brand-voice.md`; 4 independent checkers (Opus) verified every claim against the transcripts — 22 passed, 18 fixed (recurring: cross-episode contamination on multi-part/回顧 pairs; rule added to the voice doc). Sidecar `src/lib/episode-summaries.json` + seed regenerated.
- **`summaries` tab is live in the Master Sheet** (Claude-created, 51 rows pasted, gid `2040068732` locked into `sync-summaries.mjs`; name-based gviz retired). Sheet→sidecar round-trip verified byte-identical. Human gate: Johnson flips `summary_status` to `approved` per row.
- **Locations backfilled by Claude (replacing VA task 2.2):** research agent sourced official store lists; +32 stores (vacanza 25, dengyi 6, zhenfang 1) + howkind's 2 missing addresses/coords pasted into the Locations tab → 58 rows, 0 missing coords → sync pulls **57 locations, 0 orphans** → validate PASS → map verified (vacanza 33 · dengyi 7 · zhenfang 7 · howkind 2).
- **/visit widened** to `min(1720px, 94vw)` (picker 430px→360px below 1200px per review; map ~58vh); **About "Visual Identity" section removed** (Johnson: irrelevant). Reviewed + verified at 4 viewports.

**Decisions** (hub #19–20): Claude writes the sheet via clipboard-paste with CSV re-fetch verification; About palette removed + /visit near-full-width.

**Open / flagged**
- Johnson: review 51 blurbs (approve/edit statuses); vacanza 信義新光三越 likely closed + nubra address A8-vs-旗艦店 (destructive row edits, his call); fonts still gate the design pass.
- Remaining: dead forms (#5), default OG card, ship (#10).

---

## 2026-07-02 (night) — Spotify embeds, episodes repoint, scroll-motion landing

**Summary:** Three Johnson asks executed: Spotify fixed on every episode page, a scroll-motion pass on the landing page (design-taste skill), and an IG-Reels embed plan. Both reviews run; all findings fixed. Local only.

**Major**
- **Episodes sync repointed to the Master Sheet** (`scripts/sync-episodes.mjs` default; old sheet retired as source) → `episodes.json` now 55 episodes; `/episodes/53–55` pages live. Added a **positional-parse header guard** (reordered sheet column now fails loudly) and the **http(s) scheme guard** on `soundonUrl`/`kkboxUrl` (security review HIGH: a sheet-authored `javascript:` URL could reach an href).
- **Spotify fixed (#8):** sheet col J holds real 22-char IDs (verified via Spotify oEmbed); episode pages render a Spotify embed below the Apple player + a working listen-row link. Invalid IDs still auto-hide.
- **Landing page scroll motion** (`index.astro`): hero entrance choreography, stat count-ups, one brand marquee, IO scroll-reveals (JS-failure-safe via `html.rv-ready` gating), scroll-scrubbed hero exit + about-glow behind `@supports (animation-timeline)`. Reduced-motion collapses everything to static. Audit fixes: home episode list → internal episode pages (was Apple), cleaned titles, golden accent + duplicate eyebrow removed.
- **Map header** now uses the official 創業之聲 icon (dark variant) instead of the placeholder circle-S.

**Reviews:** security 1 HIGH fixed + rest clean; correctness 5 fixed (marquee loop math on mobile, `.rv` vs hover transition clash, eager marquee images, dead selector, header guard). Verified in real Chrome (preview tab renders frozen — noted for future motion verification).

**Planned:** IG Reels on episode pages = `ig_reel_url` column → sync → click-to-load facade (~half a day, awaiting go).

---

## 2026-07-02 (late) — Marquee polish + Instagram data pipeline

**Summary:** Marquee logos to 56px/0.82 with measured light-logo silhouette treatment (4 pure-white logos render as forest-ink marks). Scraped all 347 @storys.shows posts (Johnson logged in; internal feed API), matched 275 to brands (all 21 covered, 198 reels), and created the Master Sheet's **`instagram` tab (gid 48841711)**: 11 cols incl. likes/comments/plays for top-video picking + analysis, `featured` for manual curation. CSV-verified. Temp dev ingest endpoint created + deleted in-session.

**Reels rendering (same session, "go" given):** `scripts/sync-reels.mjs` (tab pinned by gid → `src/lib/ig-reels.json`, 158 reels/20 brands, shortcode-validated + featured-first/likes-desc sort; review fixes: pinned-to-episode outranks featured, comma-tolerant int parse, load-failure fallback link) + `getEpisodeReels()` in `src/lib/episodes.ts` + click-to-load facades on `/episodes/[num]` (top 3; iframe injected only on tap, shortcode re-validated at the sink; scroll-snap row; no layout shift). Verified live: ep39 plays in place; ep55 (no reels) skips the section. To regenerate: `node scripts/sync-reels.mjs`.

**Reel card design (Johnson-iterated to final on ep39, applies to all episode pages):** card = **video-aspect media box (375:426** — the clips' true near-square format; only covers are 9:16, a key finding) + compact 14px action bar (likes · 在 Instagram 開啟 ↗, always present). At rest: real reel cover (153 harvested → `public/ig/covers/{code}.jpg`, 480px/5.2MB) + play. Playing: **pure video, zero IG chrome** — header cropped, footer falls below the box; iframe sized to its natural height via IG's MEASURE postMessage (origin-checked); off-format videos fail safe (crop video, never show chrome). Rejected on the way: 9:16 card + tall info panel (dead space), fixed oversize crops (IG shrinks media to forced heights). Final review: security clean (origin + contentWindow + clamp on the MEASURE listener; sink-side shortcode re-validation); applied its suggestions — **one-reel-at-a-time playback** (collapses others; no overlapping audio / stacked IG bundles) + zero-reels listener guard. Noted for later: move inline `onerror` handlers into the script before any CSP ships; hoist the 375/426 crop constants to CSS vars if reel formats ever vary. Verified live in Chrome.

---

## 2026-07-03 — Backlog committed + rebased; OG card; cron labels; inbound forms built

**Summary:** The whole uncommitted body of work (07-01→07-03) landed on local `main` as 6 feature commits, then rebased over origin's 8 stale bot commits (`-X theirs`; our Master-Sheet `episodes.json` wins) — main is now 13 ahead / 0 behind, working tree clean. Push + deploy remain Johnson-gated (`scripts/safe-deploy.sh`).

**Major**
- **Default OG share card** (`public/og/default.png`, 1200×630): official STORYS dark tagline lockup on deep forest, double-bezel inset, orange accent; rendered from `docs/brand/og-card.html` (kept for regeneration after the font pass). `BaseLayout` now defaults `ogImage` to it — every share link gets a branded card; episode pages keep their covers. Verified in built HTML (home = card + width/height hints; ep5 = its cover).
- **Inbound forms pipeline (code complete)** — replaces the dead Netlify markup. Site: `src/lib/inbound.ts` (endpoint/secret config) + `inbound-client.ts` (urlencoded POST = simple CORS request since Apps Script can't answer preflight; honeypot; pending button; `?sent=1` redirect on success; bilingual inline error otherwise). Google side: `scripts/apps-script/inbound-forms.gs` (secret check → honeypot backstop → appendRow to auto-created `inbound_*` tabs → email). **Verified end-to-end against a mock endpoint** (payload with CJK intact, success redirect + note) and the unconfigured path (honest error, button recovers). Remaining: Johnson's ~10-min Apps Script deploy — walkthrough + defaults recorded in `docs/plans/inbound-forms.md`.
- **Cron workflow (§5.2):** labels renamed RSS→Master Sheet (the actual repoint rode in with `sync-episodes.mjs` defaults); ⚠️ takes effect on origin only after push — until then the daily cron keeps adding old-sheet bot commits (rebase again if the push waits days).

**Minor:** deleted orphan `zhenfan.png` (byte-identical to `zhenfang.png`, zero references); honeypot CSS class `netlify-honeypot`→`hp-field`.

**Decisions:** forms defaults (separate "Storys Inbound" sheet · honeypot-only · urlencoded transport · honest-error-when-unconfigured); backlog committed & rebased locally, push Johnson-gated. (See PLAN.md Decisions 2026-07-03.)

**Open questions:** `NOTIFY_EMAIL` + public `CONTACT_EMAIL` for forms; when to push (cron divergence grows daily); blurb review still the human gate before deploy.

**Verification:** `validate.mjs` PASS (0 hard, 1 by-design warning) · `npm run build` clean ×3 · `astro check` 0 errors 0 warnings · forms tested in real Chromium both paths · rebased tree byte-identical to pre-rebase (`git diff` empty).
