// Build-time HTML renderer.
//
// Produces the shipped HTML in _site/ so the site works without JavaScript:
//   • index.html   — injects per-version changelog entries (from content/CHANGELOG.md)
//   • credits/health/privacy.html — inject rendered markdown bodies
//
// HTML written here is the single source of truth in _site/; build_site.sh
// copies only assets afterwards (it must never re-copy these files).

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { marked } from 'marked';

// marked >=12 emits no heading ids by default; be explicit so repeated
// "### Changed" headings across changelog versions never collide as IDs.
marked.setOptions({ gfm: true });

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SITE = join(ROOT, '_site');
mkdirSync(SITE, { recursive: true });

const read = (p) => readFileSync(join(ROOT, p), 'utf8');
const write = (name, html) => writeFileSync(join(SITE, name), html);

const escapeHtml = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

// ── Changelog → one <details> entry per version ──────────────────────────
function buildChangelog() {
  const lines = read('content/CHANGELOG.md').split('\n');
  const headRe = /^##\s+\[([^\]]+)\]\s*(?:-\s*(.+))?$/;
  const versions = [];
  let cur = null;

  for (const line of lines) {
    const m = line.match(headRe);
    if (m) {
      cur = { version: m[1].trim(), date: (m[2] || '').trim(), body: [] };
      versions.push(cur);
    } else if (cur) {
      cur.body.push(line); // lines before the first version (preamble) are dropped
    }
  }

  return versions
    .map((v) => {
      const bodyHtml = marked.parse(v.body.join('\n').trim());
      const label = v.date ? `${v.version} · ${v.date}` : v.version;
      const dateLine = v.date
        ? `\n    <p class="cw-detail__category">${escapeHtml(v.date)}</p>`
        : '';
      return `<details class="cw-entry" id="cl-${slug(v.version)}" data-entry>
  <summary class="cw-entry__row"><span class="cw-entry__label">${escapeHtml(label)}</span></summary>
  <div class="cw-entry__detail">
    <h3 class="cw-detail__title">${escapeHtml(v.version)}</h3>${dateLine}
    <div class="cw-prose">${bodyHtml}</div>
  </div>
</details>`;
    })
    .join('\n');
}

// ── index.html ────────────────────────────────────────────────────────────
const changelogHtml = buildChangelog();
let index = read('index.html');
if (!index.includes('<!-- inject:changelog -->')) {
  throw new Error('index.html is missing the <!-- inject:changelog --> placeholder');
}
index = index.replace('<!-- inject:changelog -->', () => changelogHtml);
write('index.html', index);

// ── Legal pages: replace <!-- inject:md <path> --> with rendered markdown ──
const INJECT_RE = /<!--\s*inject:md\s+(\S+)\s*-->/g;
for (const page of ['credits.html', 'health.html', 'privacy.html']) {
  const html = read(page).replace(
    INJECT_RE,
    (_, src) => `<div class="cw-prose">${marked.parse(read(src))}</div>`
  );
  write(page, html);
}

console.log('Rendered _site/{index,credits,health,privacy}.html');
