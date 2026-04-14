#!/usr/bin/env bash
# Syncs player-facing markdown files from the game repo into the website's
# content/ directory. Run whenever any of the mirrored markdown files change
# in the game repo (typically as part of a release).
#
# Assumes the game repo is checked out at ../court_wizard relative to this repo.
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
GAME_REPO="${REPO_ROOT}/../court_wizard"

if [[ ! -d "${GAME_REPO}" ]]; then
  echo "error: game repo not found at ${GAME_REPO}" >&2
  exit 1
fi

mkdir -p "${REPO_ROOT}/content"

for file in INSTRUCTIONS.md CHANGELOG.md CREDITS.md HEALTH_WARNING.md PRIVACY_POLICY.md; do
  src="${GAME_REPO}/${file}"
  dst="${REPO_ROOT}/content/${file}"
  if [[ ! -f "${src}" ]]; then
    echo "error: ${src} not found" >&2
    exit 1
  fi
  cp "${src}" "${dst}"
  echo "synced ${file}"
done

echo "Done."
