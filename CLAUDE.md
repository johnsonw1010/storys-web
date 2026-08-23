# Storys Web

**Before doing anything, read `PLAN.md`** (project state, plan, key facts, decisions). It is the single source of truth for context.

**Before finishing a session:** run `/wrap-session` — it updates `PLAN.md` (Start Here + checkboxes + Decisions), appends the `CHANGELOG.md` entry, and logs to the Obsidian hub (`projects/storys/`) in one pass.

Keep `PLAN.md` current and small; history goes in `CHANGELOG.md`.

## Working rules
- **After completing a build phase, run `/code-review` and `/security-review`** before moving to the next phase (standing rule from Johnson).

## Quick facts
- Deploy is **manual**: `npm run build && npx wrangler@4 deploy` (git push does NOT deploy).
- Dev: `npm run dev` (:4321, HMR) · `npm run preview` (:8787, real Worker). Preview tools: default to the **Astro dev** launch config; use **Wrangler preview** only to test the real Worker.
- Content is moving from hardcoded `src/data/*` to a Google Master Sheet (see PLAN.md → Phase 1).

## Ask before editing
Before changing any of these, **stop and ask me first** — explain what you'll change and why. Don't edit them as a side effect of another task.
- `wrangler.jsonc` and the `deploy`/`build` scripts in `package.json` — deploy is manual and unforgiving; a wrong edit can break prod, and `git push` does NOT deploy so it's easy to miss.
- Anything in `src/data/` (`brands.ts`, `episodes.json`, `i18n.ts`) — this is the live site content, mid-migration to the Google Sheet.
