/* Flipbook engine. You normally do not need to edit this file.
   Content lives in js/data.js */
(function () {
  'use strict';

  var D = window.PORTFOLIO || {};
  D.projects = D.projects || [];
  var P = 640, H = 800;           // one page, in design pixels

  /* ---------- helpers ---------- */
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }
  function has(v) { return v !== undefined && v !== null && String(v).trim() !== ''; }
  function pad(n) { return String(n).padStart(2, '0'); }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function img(src, alt, cls) {
    return '<img class="' + (cls || '') + '" src="' + esc(src) + '" alt="' + esc(alt || '') +
      '" data-ph="' + esc(src) + '" draggable="false">';
  }
  function fixImages(root) {
    root.querySelectorAll('img[data-ph]').forEach(function (im) {
      function swap() {
        var d = document.createElement('div');
        d.className = (im.className || '') + ' ph-box';
        d.innerHTML = '<span>' + esc(im.getAttribute('data-ph')) + '</span>';
        im.replaceWith(d);
      }
      if (im.complete && im.naturalWidth === 0 && im.getAttribute('src')) swap();
      else im.addEventListener('error', swap, { once: true });
    });
  }
  function head(title, light) {
    return '<div class="ph-head' + (light ? ' light' : '') + '"><span>Portfolio / ' + esc(D.name) +
      '</span><i></i><span>' + esc(title) + '</span></div>';
  }
  function pnum(i) { return '<div class="pnum">' + pad(i) + '</div>'; }
  function list(items, cls) {
    return '<ul class="' + (cls || '') + '">' + (items || []).map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul>';
  }
  function timeline(items) {
    return '<div class="tl">' + (items || []).map(function (it) {
      return '<div class="tl-item"><b>' + esc(it.title) + '</b> <span>' + esc(it.when) + '</span>' +
        list(it.lines) + '</div>';
    }).join('') + '</div>';
  }
  function chunk(arr, n) { var o = []; for (var i = 0; i < arr.length; i += n) o.push(arr.slice(i, i + n)); return o; }
  /* number of gallery pages: ~3 images per page, and the project must fill an even number of pages */
  function galPages(p) {
    var g = (p.gallery || []).length; if (!g) return 0;
    var base = 1 + (has(p.hero) ? 1 : 0) + chunk(p.drawings || [], 3).length;
    var pages = Math.ceil(g / 3);
    if ((base + pages) % 2) pages++;
    return Math.min(pages, g);
  }
  function spread(arr, pages) {
    var out = [], i = 0, q = Math.floor(arr.length / pages), r = arr.length % pages;
    for (var k = 0; k < pages; k++) { var n = q + (k < r ? 1 : 0); out.push(arr.slice(i, i + n)); i += n; }
    return out;
  }
  function projLen(p) {
    var n = 1 + (has(p.hero) ? 1 : 0) + galPages(p) + chunk(p.drawings || [], 3).length;
    return n + (n % 2);
  }
  function projStart(i) { var s = 7; for (var j = 0; j < i; j++) s += projLen(D.projects[j]); return s; }
  function slot(arr, k, fallback) { return (arr && arr[k]) ? arr[k] : fallback; }

  /* ---------- page builders ---------- */
  function coverFace() {
    var bg = D.coverImage ? '<div class="cover-bg">' + img(D.coverImage, '', 'fill') + '</div>' : '';
    return bg + '<div class="cover">' +
      '<div class="cover-top"><span>' + esc(D.role) + '</span><span>' + esc(D.name) + '</span></div>' +
      '<div class="cover-card"><div class="cover-years">' + esc(D.years) + '</div><h1>PORTFOLIO</h1></div>' +
      '<div class="cover-bottom"><span>' + esc(D.location) + '</span><span>' + esc(D.email) + '</span></div></div>';
  }
  function aboutLeft() {
    var social = (D.social || []).map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('');
    return '<div class="about-l"><div class="dots"></div>' +
      '<div class="first">' + esc(D.firstName) + '</div>' +
      '<div class="portrait">' + img(D.portrait, 'Portrait of ' + D.name, 'portrait-img') + '</div>' +
      '<div class="last">' + esc(D.lastName) + '</div>' +
      '<div class="contact"><h4>CONTACT</h4><ul><li>' + esc(D.phone) + '</li><li>' + esc(D.email) +
      '</li><li>' + esc(D.location) + '</li>' + social + '</ul></div></div>' + pnum(1);
  }
  function aboutRight() {
    return '<div class="about-r"><h2>Hello, I\'m ' + esc(D.firstName) + '!</h2>' +
      '<p class="bio">' + esc(D.bio) + '</p>' +
      '<h4>EDUCATION</h4>' + timeline(D.education) +
      '<h4>EXPERIENCE</h4>' + timeline(D.experience) + '</div>' + pnum(2);
  }
  function skillsLeft() {
    var sw = (D.software || []).map(function (s) {
      return '<div class="sw-i"><div class="sw-badge">' + esc(s.badge) + '</div><span>' + esc(s.name) + '</span></div>';
    }).join('');
    return '<div class="skills-l"><h4>SOFTWARE SKILLS</h4><div class="sw">' + sw + '</div>' +
      '<h4>PERSONAL SKILLS</h4>' + list(D.skills, 'dash') +
      '<h4>LANGUAGES</h4>' + list(D.languages, 'dash') + '</div>' + pnum(3);
  }
  function skillsRight() {
    return '<div class="skills-r"><blockquote>&ldquo;' + esc(D.quote) + '&rdquo;</blockquote>' +
      '<h4>AWARDS &amp; CERTIFICATES</h4>' + list(D.awards, 'dash') +
      '<a class="btn-cv" href="' + esc(D.cv) + '" download>Download my CV <span aria-hidden="true">&darr;</span></a></div>' + pnum(4);
  }
  function contentsItems() {
    var items = D.projects.map(function (p, i) {
      return { n: i + 1, title: p.title, thumb: p.thumb || p.hero || (p.gallery && p.gallery[0]) || ((p.drawings && p.drawings[0]) ? (p.drawings[0].src || p.drawings[0]) : ''), face: projStart(i) };
    });
    items.push({ n: D.projects.length + 1, title: 'Contact', thumb: D.closingImage, face: projStart(D.projects.length) });
    return items;
  }
  function contentsFace(side, items) {
    var half = Math.ceil(items.length / 2);
    var mine = side === 0 ? items.slice(0, half) : items.slice(half);
    var cells = mine.map(function (it) {
      return '<a class="ci" href="#" data-goto="' + it.face + '"><div class="ci-n">' + pad(it.n) + '</div>' +
        '<div class="ci-img">' + img(it.thumb, it.title, 'fill') + '</div>' +
        '<div class="ci-t">' + esc(it.title) + '</div><div class="ci-p">Page ' + pad(it.face) + '</div></a>';
    }).join('');
    return '<div class="contents">' + (side === 0 ? '<h2>CONTENTS.</h2>' : '') +
      '<div class="ci-grid">' + cells + '</div></div>' + pnum(5 + side);
  }
  function projectFaces(p, i, s) {
    var n = i + 1;
    var specs = [['Location', p.location], ['Project Type', p.type], ['Project Year', p.year],
      ['Size', p.area], ['Building Storey', p.floors], ['My Role', p.role], ['Status', p.status]]
      .filter(function (r) { return has(r[1]); })
      .map(function (r) { return '<dt>' + esc(r[0]) + '</dt><dd>' + esc(r[1]) + '</dd>'; }).join('');
    var concept = (p.concept || []).map(function (c) {
      return '<div class="cn"><h5>' + esc(c.label) + '</h5><p>' + esc(c.text) + '</p></div>';
    }).join('');
    var pal = (p.palette || []).length ? '<div class="cn"><h5>Colors</h5><div class="pal">' + p.palette.map(function (c) {
      return '<div class="pal-i"><i style="background:' + esc(c.color) + '"></i><span>' + esc(c.name) + '</span></div>';
    }).join('') + '</div></div>' : '';
    var F = [];
    F.push('<div class="po-l">' + head(p.title) + '<div class="po-num">' + pad(n) + '</div><h2>' + esc(p.title) + '</h2>' +
      (has(p.subtitle) ? '<div class="po-sub">' + esc(p.subtitle) + '</div>' : '') +
      '<dl>' + specs + '</dl>' +
      (has(p.description) ? '<p class="po-desc">' + esc(p.description) + '</p>' : '') + concept + pal + '</div>');
    if (has(p.hero)) F.push('<div class="po-r">' + img(p.hero, p.title, 'fill') + head(p.title, true) + '</div>');
    (galPages(p) ? spread(p.gallery, galPages(p)) : []).forEach(function (grp, gi) {
      F.push('<div class="gal-mix n' + grp.length + (gi % 2 ? ' rev' : '') + '">' + head(p.title) +
        '<div class="gal-grid3">' + grp.map(function (src) { return '<div class="gal-c">' + img(src, p.title, 'fill') + '</div>'; }).join('') + '</div></div>');
    });
    chunk(p.drawings || [], 3).forEach(function (grp) {
      F.push('<div class="dr">' + head(p.title) + '<div class="dr-stack">' + grp.map(function (d) {
        var src = typeof d === 'string' ? d : d.src, cap = (typeof d === 'object' && d.caption) ? d.caption : '';
        return '<figure class="fig">' + img(src, cap, 'fill') + '<figcaption>' + esc(cap) + '</figcaption></figure>';
      }).join('') + '</div></div>');
    });
    if (F.length % 2) F.push('<div class="dr">' + head(p.title) + '</div>');
    return F.map(function (h, k) { return h + pnum(s + k); });
  }
  function contactLeft(s) {
    var social = (D.social || []).map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('');
    return '<div class="ct-l"><div class="ct-big">Thank<br>you.</div>' +
      '<p>Let&rsquo;s talk about your next project, internship or job.</p>' +
      '<ul class="ct-list"><li>' + esc(D.email) + '</li><li>' + esc(D.phone) + '</li><li>' + esc(D.location) + '</li>' + social + '</ul>' +
      '<a class="btn-cv" href="' + esc(D.cv) + '" download>Download my CV <span aria-hidden="true">&darr;</span></a></div>' + pnum(s);
  }
  function contactRight(s) {
    return '<div class="po-r">' + img(D.closingImage, 'Closing image', 'fill') + head('Contact', true) + '</div>' + pnum(s);
  }
  function backCover() {
    return '<div class="cover back"><div class="cover-card small"><h1>' + esc(D.name) + '</h1><div class="cover-years">' + esc(D.years) + '</div></div></div>';
  }

  function buildFaces() {
    var F = [];
    F.push(coverFace());
    F.push(aboutLeft(), aboutRight(), skillsLeft(), skillsRight());
    var items = contentsItems();
    F.push(contentsFace(0, items), contentsFace(1, items));
    D.projects.forEach(function (p, i) { projectFaces(p, i, F.length).forEach(function (h) { F.push(h); }); });
    var c = F.length;
    F.push(contactLeft(c), contactRight(c + 1));
    F.push(backCover());
    return F;
  }
  function faceCls(i, total) {
    var c = (i % 2 === 0) ? 'pg-r' : 'pg-l';
    if (i === 0 || i === total - 1) c += ' is-cover';
    return c;
  }

  /* ---------- state ---------- */
  var viewport = document.getElementById('viewport');
  var scaler = document.getElementById('scaler');
  var book = document.getElementById('book');
  var pageInfo = document.getElementById('pageInfo');
  var faces = [], F = 0, L = 0;       // faces, face count, leaf count
  var mobile = false;
  var k = 0;                          // desktop: number of flipped leaves (0..L)
  var cur = 0;                        // mobile: current face
  var leaves = [];
  var zoomLevels = [1, 1.5, 2], zoomIdx = 0;
  var soundOn = true;
  var settleTimer = null;

  try { soundOn = localStorage.getItem('pf-sound') !== 'off'; } catch (e) {}

  function isMobile() {
    var w = window.innerWidth, h = window.innerHeight;
    return w < 720 || w / h < 1.0;
  }

  /* ---------- sound ---------- */
  var audio = null;
  function flipSound() {
    if (!soundOn) return;
    try {
      audio = audio || new (window.AudioContext || window.webkitAudioContext)();
      var sr = audio.sampleRate, len = Math.floor(sr * 0.3);
      var buf = audio.createBuffer(1, len, sr), d = buf.getChannelData(0);
      for (var i = 0; i < len; i++) {
        var t = i / len;
        d[i] = (Math.random() * 2 - 1) * Math.pow(1 - t, 2.2) * Math.sin(Math.PI * Math.min(1, t * 6));
      }
      var src = audio.createBufferSource(); src.buffer = buf;
      var f = audio.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 2300; f.Q.value = 0.6;
      var g = audio.createGain(); g.gain.value = 0.35;
      src.connect(f); f.connect(g); g.connect(audio.destination); src.start();
    } catch (e) {}
  }

  /* ---------- build ---------- */
  function build() {
    faces = buildFaces(); F = faces.length; L = F / 2;
    book.innerHTML = '';
    if (mobile) {
      book.className = 'book mobile';
      faces.forEach(function (html, i) {
        var d = document.createElement('div');
        d.className = 'face mpage ' + faceCls(i, F);
        d.innerHTML = html;
        book.appendChild(d);
      });
      leaves = [];
    } else {
      book.className = 'book';
      leaves = [];
      for (var i = 0; i < L; i++) {
        var leaf = document.createElement('div');
        leaf.className = 'leaf';
        leaf.innerHTML = '<div class="face front ' + faceCls(2 * i, F) + '">' + faces[2 * i] + '</div>' +
          '<div class="face back ' + faceCls(2 * i + 1, F) + '">' + faces[2 * i + 1] + '</div>';
        book.appendChild(leaf);
        leaves.push(leaf);
      }
    }
    fixImages(book);
    applyState(true);
  }

  /* ---------- layout ---------- */
  function layout() {
    var vw = viewport.clientWidth, vh = viewport.clientHeight;
    var fit = mobile ? Math.min((vw - 20) / P, (vh - 16) / H) : Math.min((vw - 56) / (2 * P), (vh - 24) / H);
    fit = Math.min(fit, 1.5);
    var s = fit * zoomLevels[zoomIdx];
    var closed = !mobile && (k === 0 || k === L);
    var wUnits = (mobile || closed) ? P : 2 * P;
    scaler.style.width = wUnits * s + 'px';
    scaler.style.height = H * s + 'px';
    var shift = 0;
    if (!mobile && k === 0) shift = -P * s;
    book.style.transform = 'translateX(' + shift + 'px) scale(' + s + ')';
    viewport.style.touchAction = zoomIdx === 0 ? 'none' : 'auto';
    viewport.classList.toggle('zoomed', zoomIdx > 0);
    book.classList.toggle('at-start', !mobile && k === 0);
    book.classList.toggle('at-end', !mobile && k === L);
  }

  function updateInfo() {
    var t;
    if (mobile) t = cur === 0 ? 'Cover' : cur === F - 1 ? 'Back cover' : 'Page ' + cur + ' of ' + (F - 2);
    else t = k === 0 ? 'Cover' : k === L ? 'Back cover' : 'Pages ' + (2 * k - 1) + '-' + (2 * k) + ' of ' + (F - 2);
    pageInfo.textContent = t;
    var atStart = mobile ? cur === 0 : k === 0;
    var atEnd = mobile ? cur === F - 1 : k === L;
    document.getElementById('btnPrev').disabled = atStart;
    document.getElementById('btnNext').disabled = atEnd;
  }

  function restZ() {
    leaves.forEach(function (leaf, i) {
      leaf.style.transitionDelay = '';
      leaf.style.zIndex = i < k ? i + 1 : L - i;
    });
  }

  function applyState(instant) {
    if (mobile) {
      var pages = book.children;
      for (var i = 0; i < pages.length; i++) {
        var off = i - cur;
        pages[i].style.transform = 'translateX(' + (off * 104) + '%)';
        pages[i].style.opacity = Math.abs(off) > 1 ? 0 : 1;
        pages[i].style.visibility = Math.abs(off) > 1 ? 'hidden' : 'visible';
      }
    } else {
      leaves.forEach(function (leaf, i) { leaf.classList.toggle('flipped', i < k); });
      restZ();
    }
    if (instant) { book.classList.add('no-anim'); scaler.classList.add('no-anim'); }
    layout();
    updateInfo();
    if (instant) { void book.offsetWidth; book.classList.remove('no-anim'); scaler.classList.remove('no-anim'); }
  }

  /* ---------- navigation ---------- */
  function goSpread(nk) {
    nk = clamp(nk, 0, L);
    if (nk === k) return;
    var from = k, dir = nk > from ? 1 : -1;
    k = nk;
    var order = [];
    for (var i = Math.min(from, nk); i < Math.max(from, nk); i++) order.push(i);
    if (dir < 0) order.reverse();
    var step = order.length > 6 ? 35 : 70;
    order.forEach(function (i, idx) {
      var leaf = leaves[i];
      leaf.style.transitionDelay = (idx * step) + 'ms';
      leaf.style.zIndex = dir > 0 ? 500 + i : 500 + (L - i);
      leaf.classList.toggle('flipped', i < k);
      if (idx < 4) setTimeout(flipSound, idx * step + 60);
    });
    clearTimeout(settleTimer);
    settleTimer = setTimeout(restZ, 950 + order.length * step);
    layout();
    updateInfo();
  }
  function goFace(f) {
    f = clamp(f, 0, F - 1);
    if (mobile) { cur = f; flipSound(); applyState(false); }
    else goSpread(Math.ceil(f / 2));
  }
  function next() { if (mobile) goFace(cur + 1); else goSpread(k + 1); }
  function prev() { if (mobile) goFace(cur - 1); else goSpread(k - 1); }

  /* ---------- events ---------- */
  var sx = 0, sy = 0, down = false;
  viewport.addEventListener('pointerdown', function (e) {
    if (e.target.closest('a,button,[data-goto]')) return;
    down = true; sx = e.clientX; sy = e.clientY;
  });
  viewport.addEventListener('pointercancel', function () { down = false; });
  viewport.addEventListener('pointerup', function (e) {
    if (!down) return; down = false;
    if (zoomIdx > 0) return;
    var dx = e.clientX - sx, dy = e.clientY - sy;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) { dx < 0 ? next() : prev(); return; }
    if (Math.abs(dx) < 8 && Math.abs(dy) < 8) {
      var r = book.getBoundingClientRect();
      var mid = mobile ? r.left + r.width * 0.5 : r.left + r.width * 0.5;
      if (!mobile && (k === 0)) { next(); return; }
      if (!mobile && (k === L)) { prev(); return; }
      e.clientX < mid ? prev() : next();
    }
  });
  document.addEventListener('click', function (e) {
    var g = e.target.closest('[data-goto]');
    if (g) { e.preventDefault(); goFace(parseInt(g.getAttribute('data-goto'), 10)); }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight' || e.key === 'PageDown') { next(); }
    else if (e.key === 'ArrowLeft' || e.key === 'PageUp') { prev(); }
    else if (e.key === 'Home') goFace(0);
    else if (e.key === 'End') goFace(F - 1);
  });
  document.getElementById('btnNext').addEventListener('click', next);
  document.getElementById('btnPrev').addEventListener('click', prev);
  document.getElementById('btnContents').addEventListener('click', function () { goFace(5); });
  document.getElementById('btnZoom').addEventListener('click', function () {
    zoomIdx = (zoomIdx + 1) % zoomLevels.length; layout();
    viewport.scrollTo(0, 0);
  });
  var btnSound = document.getElementById('btnSound');
  function paintSound() { btnSound.setAttribute('aria-pressed', soundOn ? 'true' : 'false'); btnSound.classList.toggle('off', !soundOn); }
  btnSound.addEventListener('click', function () {
    soundOn = !soundOn; paintSound();
    try { localStorage.setItem('pf-sound', soundOn ? 'on' : 'off'); } catch (e) {}
  });
  document.getElementById('btnFull').addEventListener('click', function () {
    if (document.fullscreenElement) document.exitFullscreen();
    else if (document.documentElement.requestFullscreen) document.documentElement.requestFullscreen();
  });
  document.getElementById('btnPrint').addEventListener('click', function () { window.print(); });

  var rt = null;
  window.addEventListener('resize', function () {
    clearTimeout(rt);
    rt = setTimeout(function () {
      var m = isMobile();
      if (m !== mobile) {
        if (m) cur = k === 0 ? 0 : (k === L ? F - 1 : 2 * k - 1);
        else k = Math.ceil(cur / 2);
        mobile = m; build();
      } else layout();
    }, 80);
  });

  /* print: put every page on its own sheet */
  var printAll = document.getElementById('printAll');
  window.addEventListener('beforeprint', function () {
    var f = buildFaces();
    printAll.innerHTML = f.map(function (h, i) { return '<div class="pp face ' + faceCls(i, f.length) + '">' + h + '</div>'; }).join('');
    fixImages(printAll);
  });
  window.addEventListener('afterprint', function () { printAll.innerHTML = ''; });

  /* ---------- start ---------- */
  document.getElementById('brandName').textContent = D.name || 'Portfolio';
  document.title = (D.name ? D.name + ' | ' : '') + 'Architecture Portfolio';
  var cvLink = document.getElementById('btnCV');
  if (D.cv) cvLink.setAttribute('href', D.cv);
  paintSound();
  mobile = isMobile();
  build();
  // fonts load late: re-measure once
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(layout);
})();
