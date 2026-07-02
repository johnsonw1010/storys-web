# Storys Web

**Before doing anything, read `PLAN.md`** (project state, plan, key facts, decisions). It is the single source of truth for context.

**Before finishing a session:**
1. Update `PLAN.md` — refresh the "Start Here" block, tick/add checkboxes, and add any new entry to the Decisions list.
2. Append one entry to `CHANGELOG.md` (newest at the bottom): date, one-line summary, major vs minor changes, decisions, open questions. Link commits; don't relist files.

Keep `PLAN.md` current and small; history goes in `CHANGELOG.md`.

## Quick facts
- Deploy is **manual**: `npm run build && npx wrangler@4 deploy` (git push does NOT deploy).
- Dev: `npm run dev` (:4321, HMR) · `npm run preview` (:8787, real Worker).
- Content is moving from hardcoded `src/data/*` to a Google Master Sheet (see PLAN.md → Phase 1).

## Ask before editing
Before changing any of these, **stop and ask me first** — explain what you'll change and why. Don't edit them as a side effect of another task.
- `wrangler.jsonc` and the `deploy`/`build` scripts in `package.json` — deploy is manual and unforgiving; a wrong edit can break prod, and `git push` does NOT deploy so it's easy to miss.
- Anything in `src/data/` (`brands.ts`, `episodes.json`, `i18n.ts`) — this is the live site content, mid-migration to the Google Sheet.
