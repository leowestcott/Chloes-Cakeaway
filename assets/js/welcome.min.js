/* Optional welcome overlay (index-welcome.html only).
   Shown once per browser session, auto-dismisses after ~4s, skippable with
   Enter / Esc / click. Respects prefers-reduced-motion. */
(function () {
  'use strict';
  var el = document.getElementById('welcome');
  if (!el) return;
  var seen = false;
  try { seen = sessionStorage.getItem('cc-welcome') === '1'; } catch (e) { /* storage blocked */ }
  if (seen) { el.remove(); return; }
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var done = false;
  document.documentElement.style.overflow = 'hidden';
  function dismiss() {
    if (done) return;
    done = true;
    try { sessionStorage.setItem('cc-welcome', '1'); } catch (e) { /* ignore */ }
    document.documentElement.style.overflow = '';
    if (reduce) { el.remove(); return; }
    el.classList.add('is-leaving');
    setTimeout(function () { el.remove(); }, 1150);
    var first = document.querySelector('.skip');
    if (first) first.focus({ preventScroll: true });
  }
  var timer = setTimeout(dismiss, reduce ? 1200 : 4200);
  el.addEventListener('click', function () { clearTimeout(timer); dismiss(); });
  document.addEventListener('keydown', function onKey(e) {
    if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') { clearTimeout(timer); dismiss(); document.removeEventListener('keydown', onKey); }
  });
  var btn = el.querySelector('.btn');
  if (btn) btn.focus({ preventScroll: true });
})();
