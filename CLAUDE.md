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
