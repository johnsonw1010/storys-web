#!/usr/bin/env bash
# safe-deploy.sh — loop-engineering "Build 1": a verifiable safe-deploy gate.
#
# The verification loop: the build must succeed AND `wrangler deploy --dry-run`
# must be clean, THEN it stops for an explicit human yes before the real deploy.
# A separate checker confirms "done" so you never guess whether you broke prod.
#
# Usage:
#   ./scripts/safe-deploy.sh            # verify only (build + dry-run) — NEVER deploys
#   ./scripts/safe-deploy.sh --deploy   # verify, then (only if clean) prompt y/N and deploy
#
# Exit codes: 0 = checks passed (deploy done if requested & confirmed),
#             1 = build failed, 2 = dry-run failed.
#
# Note: deploy is manual & unforgiving (git push does NOT deploy). This script is
# the human gate, not an automation — it will not deploy without a typed "y".

set -euo pipefail
cd "$(dirname "$0")/.."

WRANGLER="npx wrangler@4"
DO_DEPLOY=false
[[ "${1:-}" == "--deploy" ]] && DO_DEPLOY=true

echo "▶ [1/3] Validating sheet data (node scripts/validate.mjs)…"
if ! node scripts/validate.mjs; then
  echo "✗ Data validation failed — fix the sheet before deploying. Nothing deployed."
  exit 3
fi
echo "✓ Data valid."
echo

echo "▶ [2/3] Building (npm run build)…"
if ! npm run build; then
  echo "✗ Build failed — fix it before deploying. Nothing deployed."
  exit 1
fi
echo "✓ Build clean."
echo

echo "▶ [3/3] Dry-run ($WRANGLER deploy --dry-run)…"
if ! $WRANGLER deploy --dry-run; then
  echo "✗ Dry-run failed — Worker bundle/config problem. Nothing deployed."
  exit 2
fi
echo "✓ Dry-run clean."
echo
echo "✅ Safe-deploy checks PASSED — build + dry-run are green."

if [[ "$DO_DEPLOY" != true ]]; then
  echo "ℹ Verify-only mode. To ship:  ./scripts/safe-deploy.sh --deploy"
  exit 0
fi

# Human gate — the loop stops here for you.
echo
read -r -p "Deploy to PRODUCTION now? [y/N] " ans
case "$ans" in
  [yY]|[yY][eE][sS])
    echo "▶ Deploying ($WRANGLER deploy)…"
    $WRANGLER deploy
    echo "✓ Deployed."
    ;;
  *)
    echo "✋ Aborted by human — nothing deployed."
    exit 0
    ;;
esac
