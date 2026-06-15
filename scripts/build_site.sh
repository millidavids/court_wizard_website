#!/usr/bin/env bash
# Builds the _site/ directory for Cloudflare Pages deployment.
# Single source of truth for which files ship with the site — both
# scripts/deploy.sh (manual deploy) and .github/workflows/deploy.yml
# (CI deploy) invoke this script.
#
# Requires Node + dependencies (`npm ci` / `npm install`) for the markdown
# render step.
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "${REPO_ROOT}"

rm -rf _site
mkdir -p _site

# Render HTML (index + legal pages, with markdown rendered at build time)
# into _site/. render.mjs is the ONLY writer of HTML into _site — do NOT
# copy *.html below or it would clobber the rendered output.
node scripts/render.mjs

# Copy static assets only (no *.html, no raw content/*.md).
cp -r css js images _site/

echo "Built _site/ with $(find _site -type f | wc -l) files."
