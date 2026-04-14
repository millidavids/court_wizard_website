/* Court Wizard — Markdown page renderer
   Fetches the markdown file named in #md-content[data-source] and renders
   it with marked (loaded from CDN). Used by changelog.html and credits.html.
*/
document.addEventListener('DOMContentLoaded', async function () {
  var el = document.getElementById('md-content');
  if (!el) return;
  var src = el.dataset.source;
  if (!src) {
    el.innerHTML = '<p>No source configured.</p>';
    return;
  }
  try {
    var res = await fetch(src, { cache: 'no-cache' });
    if (!res.ok) throw new Error(res.status + ' ' + res.statusText);
    var md = await res.text();
    if (typeof marked === 'undefined') {
      el.innerHTML = '<p>Markdown renderer failed to load.</p>';
      return;
    }
    el.innerHTML = marked.parse(md);
  } catch (e) {
    el.innerHTML = '<p>Failed to load content. Please try again later.</p>';
    console.error('markdown.js:', e);
  }
});
