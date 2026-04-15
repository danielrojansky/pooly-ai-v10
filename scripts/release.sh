#!/usr/bin/env bash
# scripts/release.sh — version bump, commit, tag, push, deploy to Vercel
#
# Usage:
#   bash scripts/release.sh minor    # 0.x.0 → 0.(x+1).0  (default)
#   bash scripts/release.sh major    # x.0.0 → (x+1).0.0
#   bash scripts/release.sh patch    # 0.0.x → 0.0.(x+1)  (hotfix)

set -euo pipefail

BUMP="${1:-minor}"

# Validate bump type
if [[ "$BUMP" != "major" && "$BUMP" != "minor" && "$BUMP" != "patch" ]]; then
  echo "❌  Invalid bump type: $BUMP. Use major | minor | patch."
  exit 1
fi

echo "🔨  Running production build…"
npm run build

echo "📦  Bumping $BUMP version…"
npm version "$BUMP" --no-git-tag-version

NEW_VERSION=$(node -p "require('./package.json').version")

echo "📝  Committing v$NEW_VERSION…"
git add package.json package-lock.json
git commit -m "chore: release v$NEW_VERSION"
git tag "v$NEW_VERSION"

echo "🚀  Pushing to GitHub…"
git push origin main --tags

echo "⚡  Deploying to Vercel production…"
vercel --prod --yes --scope danielrojansky-8273s-projects

echo ""
echo "╔══════════════════════════════════════════════╗"
echo "║  ✅  Released v$NEW_VERSION to production    "
echo "╚══════════════════════════════════════════════╝"
