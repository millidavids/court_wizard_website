/* Court Wizard — Compendium UI controller (progressive enhancement)

   The page works fully without this file (long-scroll, native <details>).
   With JS it becomes the game-style compendium:
     • Tab bar switches the visible section (hash-routed).
     • Wide (>=900px): clicking an entry shows its detail in the left panel.
     • Narrow (<900px): entries expand inline as native <details> accordions.
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

  function tabName(el) { return (el.getAttribute('href') || '').replace(/^#/, ''); }

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
    if (content) content.scrollTop = 0;
    resetDetail();
  }

  // ── Tab clicks (manage history ourselves; avoids document jump) ──
  tabs.forEach(function (tab) {
    tab.addEventListener('click', function (e) {
      e.preventDefault();
      var name = tabName(tab);
      if (name !== root.dataset.tab && window.history && history.pushState) {
        history.pushState(null, '', '#' + name);
      }
      setTab(name);
    });
  });

  // ── Back/forward + manual hash edits ──
  function fromHash() { return (location.hash || '').replace(/^#/, ''); }
  window.addEventListener('popstate', function () { setTab(fromHash()); });
  window.addEventListener('hashchange', function () { setTab(fromHash()); });

  // ── Entry clicks ──
  entries.forEach(function (entry) {
    var summary = entry.querySelector('.cw-entry__row');
    if (!summary) return;
    summary.addEventListener('click', function (e) {
      if (wide.matches) {
        // Wide: route to the side panel instead of toggling inline.
        e.preventDefault();
        if (entry === activeEntry) {
          resetDetail();
        } else {
          selectEntry(entry);
        }
      }
      // Narrow: let the native <details> toggle expand inline.
    });
  });

  // ── Layout changes: clear cross-mode state so nothing is orphaned ──
  function onLayoutChange() {
    entries.forEach(function (en) { en.open = false; });
    resetDetail();
  }
  if (wide.addEventListener) {
    wide.addEventListener('change', onLayoutChange);
  } else if (wide.addListener) {
    wide.addListener(onLayoutChange); // older Safari
  }

  // ── Initial sync ──
  setTab(root.dataset.tab || fromHash() || 'about');

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
