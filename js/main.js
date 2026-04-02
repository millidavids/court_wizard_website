/* Court Wizard — Progressive Enhancement
   Everything works without this file. It adds:
   - Scroll-triggered reveal animations
   - Nav background transition on scroll
   - Mobile nav close on link click
*/
(function () {
  // Scroll reveal via IntersectionObserver
  var els = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && els.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
    els.forEach(function (el) { io.observe(el); });
  }

  // Nav scroll state
  var nav = document.querySelector('.nav');
  if (nav) {
    var onScroll = function () {
      nav.classList.toggle('is-scrolled', window.scrollY > 60);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // Close mobile nav on link click
  var toggle = document.getElementById('nav-toggle');
  document.querySelectorAll('.nav-links a').forEach(function (a) {
    a.addEventListener('click', function () {
      if (toggle) toggle.checked = false;
    });
  });
})();
