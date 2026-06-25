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
