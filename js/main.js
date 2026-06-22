/* Court Wizard — Compendium UI controller (progressive enhancement)

   The page works fully without this file (long-scroll, native <details>).
   With JS it becomes the game-style compendium:
     • Tab bar switches the visible section (path-routed: /tab).
     • Entries are deep-linkable: /tab/slug (e.g. /about/privacy, /features/endless).
     • Wide (>=900px): clicking an entry shows its detail in the left panel.
     • Narrow (<900px): entries expand inline as native <details> accordions.

   Deep paths are served index.html by the host (Cloudflare Pages SPA fallback /
   serve.py), then routed here from location.pathname.
*/
(function () {
  'use strict';

  var root = document.documentElement;
  var VALID = ['about', 'features', 'wizards', 'screenshots', 'manual', 'changelog'];

  var tabs = Array.prototype.slice.call(document.querySelectorAll('.cw-tab'));
  var entries = Array.prototype.slice.call(document.querySelectorAll('[data-entry]'));
  var detailPanel = document.querySelector('.cw-detail');
  var content = document.querySelector('.cw-content');
  var wide = window.matchMedia('(min-width: 900px)');

  var activeEntry = null;

  function tabName(el) { return (el.getAttribute('href') || '').replace(/^\//, ''); }

  // Entry route slug: explicit data-route, else the id minus its section prefix
  // (man-overview -> overview, abt-privacy -> privacy, cl-v0-10-72 -> v0-10-72).
  function slugOf(entry) {
    return entry.getAttribute('data-route') || entry.id.replace(/^[^-]+-/, '');
  }
  function sectionOf(entry) {
    var s = entry.closest ? entry.closest('.cw-section') : null;
    return s ? s.id : '';
  }

  function pushPath(path) {
    if (window.history && history.pushState && path !== location.pathname) {
      // try/catch: history.pushState throws a SecurityError on the file://
      // scheme; swallow it so navigation still updates the UI.
      try { history.pushState(null, '', path); } catch (e) {}
    }
  }

  function resetDetail() {
    if (activeEntry) {
      activeEntry.classList.remove('is-active');
      activeEntry = null;
    }
    if (detailPanel) {
      detailPanel.innerHTML = '<p class="cw-detail__placeholder">Select an entry to learn more.</p>';
    }
  }

  function selectEntry(entry) {
    if (!detailPanel) return;
    if (activeEntry) activeEntry.classList.remove('is-active');
    activeEntry = entry;
    entry.classList.add('is-active');
    entry.open = false; // detail lives in the side panel, never inline in wide mode

    var src = entry.querySelector('.cw-entry__detail');
    if (!src) return;
    var clone = src.cloneNode(true);
    // Strip any ids so the clone never duplicates IDs in the live DOM.
    Array.prototype.forEach.call(clone.querySelectorAll('[id]'), function (n) {
      n.removeAttribute('id');
    });
    detailPanel.innerHTML = '';
    Array.prototype.slice.call(clone.childNodes).forEach(function (n) {
      detailPanel.appendChild(n);
    });
    detailPanel.scrollTop = 0;
  }

  function setTab(name) {
    if (VALID.indexOf(name) === -1) name = 'about';
    root.dataset.tab = name;
    tabs.forEach(function (t) {
      t.classList.toggle('is-active', tabName(t) === name);
    });
    // Collapse any inline-expanded entry so a tab switch / route change never
    // leaves a narrow-mode <details> open out of sync with the URL.
    entries.forEach(function (en) { en.open = false; });
    if (content) content.scrollTop = 0;
    resetDetail();
  }

  // ── Tab clicks (manage history ourselves; avoids document jump) ──
  tabs.forEach(function (tab) {
    tab.addEventListener('click', function (e) {
      e.preventDefault();
      var name = tabName(tab);
      pushPath('/' + name);
      setTab(name);
    });
  });

  // ── Path routing: "/tab" or "/tab/slug" (deep link to an entry) ──
  // Lower-cased so a hand-typed "/About/Credits" still resolves.
  function parsePath() {
    var segs = (location.pathname || '/').split('/').filter(Boolean);
    return { tab: (segs[0] || 'about').toLowerCase(), slug: (segs[1] || '').toLowerCase() };
  }

  // Find an entry by slug. Prefer the one in the URL's tab (exact match);
  // otherwise fall back to any section so a mismatched tab segment still
  // resolves and self-corrects the tab (e.g. /screenshots/privacy → about).
  function findEntry(tab, slug) {
    if (!slug) return null;
    var fallback = null;
    for (var i = 0; i < entries.length; i++) {
      if (slugOf(entries[i]) === slug) {
        if (sectionOf(entries[i]) === tab) return entries[i];
        if (!fallback) fallback = entries[i];
      }
    }
    return fallback;
  }

  // Reveal an entry's detail: side panel in wide mode, inline accordion otherwise.
  function openEntry(entry) {
    if (wide.matches) {
      selectEntry(entry);
    } else {
      entry.open = true;
      if (entry.scrollIntoView) entry.scrollIntoView({ block: 'start' });
    }
  }

  function routeFromPath() {
    var p = parsePath();
    var entry = findEntry(p.tab, p.slug);
    // A resolved entry decides the tab so the two can never drift out of sync.
    setTab(entry ? sectionOf(entry) : p.tab); // validates → falls back to 'about'
    if (entry) openEntry(entry);
  }

  // ── Back/forward ──
  window.addEventListener('popstate', routeFromPath);

  // ── Entry clicks ──
  entries.forEach(function (entry) {
    var summary = entry.querySelector('.cw-entry__row');
    if (!summary) return;
    summary.addEventListener('click', function (e) {
      var tab = root.dataset.tab;
      var entryPath = '/' + tab + '/' + slugOf(entry);
      if (wide.matches) {
        // Wide: route to the side panel instead of toggling inline.
        e.preventDefault();
        if (entry === activeEntry) {
          resetDetail();
          pushPath('/' + tab);
        } else {
          selectEntry(entry);
          pushPath(entryPath);
        }
      } else {
        // Narrow: let the native <details> toggle expand inline. entry.open is
        // still the pre-toggle value here, so invert it for the resulting URL.
        pushPath(entry.open ? '/' + tab : entryPath);
      }
    });
  });

  // ── Layout changes: re-apply the current URL so the active entry is shown
  //    correctly in the new mode (side panel ⇄ inline) instead of orphaned. ──
  function onLayoutChange() {
    routeFromPath();
  }
  if (wide.addEventListener) {
    wide.addEventListener('change', onLayoutChange);
  } else if (wide.addListener) {
    wide.addListener(onLayoutChange); // older Safari
  }

  // ── Initial sync ──
  // Back-compat: rewrite a legacy "#tab" / "#tab/anchor" URL to its path form
  // so old links (e.g. the #about/privacy URLs already shared) keep working.
  // Only when there is no real path — otherwise a deep path that merely carries
  // a fragment (e.g. /features/endless#x) would be clobbered.
  if (!(location.pathname || '/').split('/').filter(Boolean).length && location.hash) {
    var hp = location.hash.replace(/^#/, '').split('/').filter(Boolean);
    if (hp.length && history.replaceState) {
      try { history.replaceState(null, '', '/' + hp.join('/')); } catch (e) {}
    }
  }
  routeFromPath();

  // ── Light/dark theme toggle (the inline <head> script sets the initial
  //    theme before paint; this just handles clicks + persistence) ──
  var themeBtn = document.querySelector('.cw-theme-toggle');
  if (themeBtn) {
    var syncThemeLabel = function () {
      var isLight = root.dataset.theme === 'light';
      var label = isLight ? 'Switch to dark theme' : 'Switch to light theme';
      themeBtn.setAttribute('aria-label', label);
      themeBtn.setAttribute('title', label);
    };
    syncThemeLabel();
    themeBtn.addEventListener('click', function () {
      var next = root.dataset.theme === 'light' ? 'dark' : 'light';
      root.dataset.theme = next;
      try { localStorage.setItem('cw-theme', next); } catch (e) {}
      syncThemeLabel();
    });
  }
})();
