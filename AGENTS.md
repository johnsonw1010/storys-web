# Storys Web — agent instructions

**Start by reading `PLAN.md`** — it holds the project state, plan, key facts, and decisions (the single source of truth). Read it before making changes so you resume with full context.

**Before you finish a session:**
1. Update `PLAN.md`: refresh "Start Here", update the checkboxes, and add to the Decisions list if you made a decision.
2. Append one entry to `CHANGELOG.md` (newest at the bottom): date, one-line summary, major vs minor changes, decisions, and open questions. Link commits; do not relist files (git already tracks them).

Keep `PLAN.md` current and concise; narrative history belongs in `CHANGELOG.md`.

## Quick facts
- Stack: Astro static site, deployed on Cloudflare Workers (`@astrojs/cloudflare`, `wrangler.jsonc`).
- Deploy is **manual**: `npm run build && npx wrangler@4 deploy`. A `git push` alone does NOT deploy.
- Dev servers: `npm run dev` → :4321 (hot reload); `npm run preview` → :8787 (real Worker build).
- Content is migrating from hardcoded `src/data/brands.ts` + `episodes.json` to a Google "Master Sheet" (see PLAN.md → Phase 1). `brand_id` is the key that links episodes, brands, and locations.
