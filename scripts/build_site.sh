#!/usr/bin/env bash
# Builds the _site/ directory for Cloudflare Pages deployment.
# Single source of truth for which files ship with the site — both
# scripts/deploy.sh (manual deploy) and .github/workflows/deploy.yml
# (CI deploy) invoke this script.
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "${REPO_ROOT}"

rm -rf _site
mkdir -p _site

cp -r \
  index.html \
  manual.html \
  changelog.html \
  credits.html \
  health.html \
  privacy.html \
  css \
  js \
  images \
  content \
  _site/

echo "Built _site/ with $(find _site -type f | wc -l) files."
