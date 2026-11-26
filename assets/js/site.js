/* Chloé's Cakeaway — interactions (vanilla, deferred)
   - header state, scroll progress, hide-on-scroll
   - mobile menu (circular reveal) with focus handling
   - scroll reveals + image wipes (IntersectionObserver)
   - word-by-word statement, gentle parallax, stacked collection chapters
   - gallery filters, "show more", native <dialog> lightbox
   - enquiry form → composes an Instagram DM (copy + open)            */
(function () {
  'use strict';
  var doc = document.documentElement;
  var body = document.body;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var IG_HANDLE = 'chloescakeaway';

  /* ── header, progress bar, hide on scroll down ── */
  var header = $('#header');
  var progress = $('.progress', header);
  var lastY = window.scrollY;
  var queued = false;
  var scrollers = [];
  var max = 0;
  function measure() { max = doc.scrollHeight - window.innerHeight; }
  window.addEventListener('resize', function () { measure(); }, { passive: true });
  function onScroll() {
    var y = window.scrollY;
    header.classList.toggle('is-scrolled', y > 24);
    if (progress) progress.style.setProperty('--p', max > 0 ? (y / max).toFixed(4) : 0);
    if (!body.classList.contains('menu-open')) {
      header.classList.toggle('is-hidden', y > lastY && y > window.innerHeight * 0.9);
    }
    lastY = y;
    for (var i = 0; i < scrollers.length; i++) scrollers[i](y);
    queued = false;
  }
  window.addEventListener('scroll', function () { if (!queued) { queued = true; requestAnimationFrame(onScroll); } }, { passive: true });

  /* ── mobile menu ── */
  var menuBtn = $('#menuBtn');
  var menu = $('#menu');
  var main = $('#main');
  function setMenu(open, focusBtn) {
    body.classList.toggle('menu-open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menu.setAttribute('aria-hidden', String(!open));
    if (open) { main.setAttribute('inert', ''); body.style.overflow = 'hidden'; setTimeout(function () { var l = $('a', menu); if (l) l.focus({ preventScroll: true }); }, 300); }
    else { main.removeAttribute('inert'); body.style.overflow = ''; if (focusBtn) menuBtn.focus(); }
  }
  if (menuBtn && menu) {
    menuBtn.addEventListener('click', function () { setMenu(!body.classList.contains('menu-open'), true); });
    $$('a', menu).forEach(function (a) { a.addEventListener('click', function () { setMenu(false, false); }); });
    document.addEventListener('keydown', function (e) {
      if (!body.classList.contains('menu-open')) return;
      if (e.key === 'Escape') { setMenu(false, true); return; }
      if (e.key === 'Tab') {
        var f = [menuBtn].concat($$('a', menu));
        var i = f.indexOf(document.activeElement);
        if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); }
        else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); }
      }
    });
    window.matchMedia('(min-width: 1024px)').addEventListener('change', function (m) { if (m.matches) setMenu(false, false); });
  }

  /* ── in-page links: re-check the landing point, because sections using
        content-visibility only learn their true height once rendered ── */
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href^="#"]');
    if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey) return;
    var id = a.getAttribute('href');
    var target = id.length > 1 ? document.getElementById(id.slice(1)) : null;
    if (!target) return;
    e.preventDefault();
    var behavior = reduce ? 'auto' : 'smooth';
    target.scrollIntoView({ behavior: behavior });
    var tries = 0;
    var stop = function () { tries = 99; };
    window.addEventListener('wheel', stop, { once: true, passive: true });
    window.addEventListener('touchstart', stop, { once: true, passive: true });
    window.addEventListener('keydown', stop, { once: true });
    var settle = function () {
      var off = target.getBoundingClientRect().top - (parseFloat(getComputedStyle(doc).scrollPaddingTop) || 0);
      if (Math.abs(off) > 4 && tries++ < 4) { target.scrollIntoView({ behavior: tries > 2 ? 'auto' : behavior }); setTimeout(settle, 700); }
    };
    setTimeout(settle, reduce ? 50 : 750);
    if (history.replaceState) history.replaceState(null, '', id);
  });

  /* ── active section in the nav ── */
  var navLinks = $$('.nav a');
  if ('IntersectionObserver' in window && navLinks.length) {
    var secObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        navLinks.forEach(function (a) { a.classList.toggle('is-active', a.getAttribute('href') === '#' + en.target.id); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    navLinks.forEach(function (a) { var s = $(a.getAttribute('href')); if (s) secObs.observe(s); });
  }

  /* ── reveals ── */
  var reveals = $$('[data-reveal], .reveal-img');
  if (!reduce && 'IntersectionObserver' in window) {
    var revObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); revObs.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.01 });
    reveals.forEach(function (el) { revObs.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* ── statement: words light up as you scroll ── */
  var statement = $('[data-split]');
  if (statement && !reduce) {
    (function split(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          var frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(function (part) {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
            var s = document.createElement('span'); s.className = 'w'; s.textContent = part; frag.appendChild(s);
          });
          node.replaceChild(frag, n);
        } else if (n.nodeType === 1) { split(n); }
      });
    })(statement);
    statement.classList.add('is-split');
    var words = $$('.w', statement);
    scrollers.push(function () {
      var r = statement.getBoundingClientRect();
      var vh = window.innerHeight;
      if (r.bottom < -200 || r.top > vh + 200) return;
      var prog = Math.min(1, Math.max(0, (vh * 0.85 - r.top) / (r.height + vh * 0.3)));
      var n = Math.round(prog * words.length);
      for (var i = 0; i < words.length; i++) words[i].classList.toggle('on', i < n);
    });
  }

  /* ── gentle parallax ── */
  var para = $$('[data-parallax]');
  var paraMQ = window.matchMedia('(min-width: 900px)');
  if (para.length && !reduce) {
    scrollers.push(function () {
      if (!paraMQ.matches) return;
      var vh = window.innerHeight;
      para.forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh) return;
        var c = (r.top + r.height / 2 - vh / 2) / vh;
        el.style.translate = '0 ' + (c * parseFloat(el.dataset.parallax) * -100).toFixed(1) + 'px';
      });
    });
  }

  /* ── collection: stacked chapters recede as the next arrives ── */
  var stack = $('.chapters');
  var chapters = $$('.chapter', stack);
  var stackMQ = window.matchMedia('(min-width: 900px) and (min-height: 700px)');
  if (stack && !reduce) {
    var applyStack = function () {
      stack.classList.toggle('is-stacking', stackMQ.matches);
      chapters.forEach(function (c, i) { c.style.setProperty('--i', i); if (!stackMQ.matches) { c.style.removeProperty('--s'); c.style.removeProperty('--b'); } });
    };
    applyStack();
    stackMQ.addEventListener('change', applyStack);
    scrollers.push(function () {
      if (!stackMQ.matches) return;
      for (var i = 0; i < chapters.length - 1; i++) {
        var next = chapters[i + 1].getBoundingClientRect();
        var cur = chapters[i].getBoundingClientRect();
        var p = Math.min(1, Math.max(0, 1 - (next.top - cur.top) / cur.height));
        chapters[i].style.setProperty('--s', (1 - p * 0.06).toFixed(4));
        chapters[i].style.setProperty('--b', (1 - p * 0.25).toFixed(3));
      }
    });
  }

  /* ── deep links that preselect the occasion in the form ── */
  var occasion = $('#f-occasion');
  $$('[data-occasion]').forEach(function (a) {
    a.addEventListener('click', function () { if (occasion) occasion.value = a.dataset.occasion; });
  });

  /* ── gallery: filters + show more ── */
  var items = $$('.masonry__item');
  var moreBtn = $('#galleryMore');
  var filter = 'all';
  var limit = 20;
  function renderGallery() {
    var shown = 0;
    items.forEach(function (it) {
      var match = filter === 'all' || it.dataset.cat === filter;
      var show = match && (filter !== 'all' || shown < limit);
      it.hidden = !show;
      if (show) shown++;
    });
    if (moreBtn) moreBtn.parentElement.hidden = !(filter === 'all' && limit < items.length);
  }
  $$('.filter').forEach(function (b) {
    b.addEventListener('click', function () {
      filter = b.dataset.filter;
      $$('.filter').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
      renderGallery();
    });
  });
  if (moreBtn) moreBtn.addEventListener('click', function () { limit = items.length; renderGallery(); });
  renderGallery();

  /* ── lightbox (native dialog) ── */
  var lb = $('#lightbox');
  var lbImg = $('#lbImg');
  var lbCap = $('#lbCap');
  var lbCount = $('#lbCount');
  var lbLink = $('#lbLink');
  var current = 0;
  var visible = function () { return items.filter(function (it) { return !it.hidden; }); };
  function show(idx) {
    var list = visible();
    if (!list.length) return;
    current = (idx + list.length) % list.length;
    var it = list[current];
    var img = $('img', it);
    var srcset = img.getAttribute('data-full') || img.currentSrc || img.src;
    lbImg.removeAttribute('srcset');
    lbImg.src = srcset;
    lbImg.alt = img.alt;
    lbImg.style.animation = 'none'; void lbImg.offsetWidth; lbImg.style.animation = '';
    lbCap.textContent = it.dataset.cap;
    lbCount.textContent = (current + 1) + ' / ' + list.length;
    lbLink.href = it.dataset.url || 'https://www.instagram.com/' + IG_HANDLE + '/';
  }
  if (lb && lb.showModal) {
    items.forEach(function (it) {
      it.addEventListener('click', function () { show(visible().indexOf(it)); lb.showModal(); });
    });
    $('#lbClose').addEventListener('click', function () { lb.close(); });
    $('#lbPrev').addEventListener('click', function () { show(current - 1); });
    $('#lbNext').addEventListener('click', function () { show(current + 1); });
    lb.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') show(current - 1);
      if (e.key === 'ArrowRight') show(current + 1);
    });
    lb.addEventListener('click', function (e) { if (e.target === lb || e.target.classList.contains('lightbox__stage')) lb.close(); });
    var tx = null;
    lb.addEventListener('touchstart', function (e) { tx = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', function (e) {
      if (tx === null) return;
      var dx = e.changedTouches[0].clientX - tx;
      if (Math.abs(dx) > 50) show(current + (dx < 0 ? 1 : -1));
      tx = null;
    });
  }

  /* ── enquiry form → Instagram message ── */
  var form = $('#enquiryForm');
  if (form) {
    var dateInput = $('#f-date');
    if (dateInput) {
      var t = new Date(); t.setMinutes(t.getMinutes() - t.getTimezoneOffset());
      dateInput.min = t.toISOString().slice(0, 10);
    }
    var fields = ['f-name', 'f-email', 'f-occasion', 'f-date'];
    var validate = function (el) {
      var err = $('#' + el.id + '-err');
      var ok = el.checkValidity();
      el.setAttribute('aria-invalid', String(!ok));
      if (err) err.textContent = ok ? '' : (el.dataset.msg || 'Please complete this field.');
      return ok;
    };
    fields.forEach(function (id) {
      var el = $('#' + id);
      if (el) el.addEventListener('blur', function () { if (el.value) validate(el); });
    });
    var message = '';
    var nice = function (iso) {
      if (!iso) return '';
      var d = new Date(iso + 'T12:00:00');
      return d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    };
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var firstBad = null;
      fields.forEach(function (id) { var el = $('#' + id); if (el && !validate(el) && !firstBad) firstBad = el; });
      if (firstBad) { firstBad.focus(); return; }
      var v = function (id) { var el = $('#' + id); return el ? el.value.trim() : ''; };
      var lines = [
        'Hi Chloé! I\'d love to enquire about a cake.',
        '',
        'Name: ' + v('f-name'),
        'Email: ' + v('f-email')
      ];
      if (v('f-phone')) lines.push('Phone: ' + v('f-phone'));
      lines.push('Occasion: ' + v('f-occasion'));
      lines.push('Date needed: ' + nice(v('f-date')));
      if (v('f-servings')) lines.push('Servings: ' + v('f-servings'));
      if (v('f-diet')) lines.push('Dietary needs / allergies: ' + v('f-diet'));
      if (v('f-ideas')) { lines.push(''); lines.push('Design ideas: ' + v('f-ideas')); }
      lines.push(''); lines.push('Thank you!');
      message = lines.join('\n');
      $('#sentText').textContent = message;
      form.classList.add('is-ready');
      $('#sentTitle').focus();
      try { sessionStorage.setItem('cc-enquiry', message); } catch (err) { /* storage unavailable */ }
    });
    var status = $('#sentStatus');
    var copy = function () {
      if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(message);
      var ta = document.createElement('textarea'); ta.value = message; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      var ok = false; try { ok = document.execCommand('copy'); } catch (err) { ok = false; }
      document.body.removeChild(ta);
      return ok ? Promise.resolve() : Promise.reject();
    };
    $('#sendIg').addEventListener('click', function () {
      // open synchronously (popup blockers), then copy
      copy().then(function () { status.textContent = 'Copied — now paste it into your Instagram message to Chloé.'; })
            .catch(function () { status.textContent = 'Couldn’t copy automatically — please select the text above and copy it.'; });
    });
    $('#copyOnly').addEventListener('click', function () {
      copy().then(function () { status.textContent = 'Message copied to your clipboard.'; })
            .catch(function () { status.textContent = 'Couldn’t copy automatically — please select the text above and copy it.'; });
    });
    $('#editEnquiry').addEventListener('click', function () { form.classList.remove('is-ready'); status.textContent = ''; $('#f-name').focus(); });
  }

  /* ── footer year ── */
  var yr = $('#year');
  if (yr) yr.textContent = new Date().getFullYear();

  // first paint: measure after layout settles to avoid a forced synchronous reflow
  requestAnimationFrame(function () { measure(); onScroll(); });
  window.addEventListener('load', measure);
})();
