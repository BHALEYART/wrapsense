/* "Build a complete packaging line" — interactive background.
   Desktop: expanding, fading circles follow the pointer, coloured by the stage column the pointer lines up with.
   All devices: stages cascade in when the section scrolls into view, each firing a burst in its colour.
   Touch: while scrolling, ripples rise from the stage nearest the middle of the screen; tapping a stage bursts it.
   prefers-reduced-motion: none of this runs (the section is shown as-is). */
(function () {
  'use strict';
  var root = document.querySelector('[data-line-fx]');
  if (!root || !window.requestAnimationFrame) return;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reduce.matches) return;

  var canvas = root.querySelector('.line-fx__canvas');
  var ctx = canvas && canvas.getContext('2d');
  var stages = Array.prototype.slice.call(root.querySelectorAll('.line__stage'));
  if (!ctx || !stages.length) return;

  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  var W = 0, H = 0, rings = [], running = false, inView = false;

  // stage colours (from the stage gradients), as RGB
  function hex(h) { h = h.replace('#', ''); return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]; }
  var colors = stages.map(function (li) { return (li.getAttribute('data-colors') || '#2a75d1').split(' ').map(hex); });

  function size() {
    var r = root.getBoundingClientRect();
    W = r.width; H = r.height;
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  size();
  if (window.ResizeObserver) new ResizeObserver(size).observe(root); else window.addEventListener('resize', size);

  // tile geometry relative to the section
  function tileBox(i) {
    var t = stages[i].querySelector('.line__tile') || stages[i];
    var a = t.getBoundingClientRect(), b = root.getBoundingClientRect();
    return { x: a.left - b.left + a.width / 2, y: a.top - b.top + a.height / 2, w: a.width, h: a.height, left: a.left - b.left, right: a.right - b.left };
  }
  // stage whose column the x position lines up with (nearest tile centre)
  function stageAtX(x) {
    var best = 0, bd = Infinity;
    for (var i = 0; i < stages.length; i++) { var c = tileBox(i), d = Math.abs(c.x - x); if (d < bd) { bd = d; best = i; } }
    return best;
  }
  // blend across a tile's gradient by horizontal position inside it
  function colorAt(i, x) {
    var c = colors[i], box = tileBox(i);
    var t = Math.max(0, Math.min(1, (x - box.left) / (box.right - box.left || 1)));
    var seg = t * (c.length - 1), k = Math.min(c.length - 2, Math.floor(seg)), f = seg - k;
    if (c.length < 2) return c[0];
    return [0, 1, 2].map(function (j) { return Math.round(c[k][j] + (c[k + 1][j] - c[k][j]) * f); });
  }

  function ring(x, y, rgb, opts) {
    opts = opts || {};
    rings.push({ x: x, y: y, rgb: rgb, r: opts.r0 || 6, max: opts.max || 150, life: 0, dur: opts.dur || 1100, a: opts.a || 0.15, fill: opts.fill !== false });
    if (rings.length > 90) rings.shift();
    if (!running) { running = true; requestAnimationFrame(frame); }
  }
  function burst(i, strength) {
    var b = tileBox(i), c = colors[i];
    for (var k = 0; k < 3; k++) {
      (function (k) {
        setTimeout(function () { ring(b.x, b.y, c[Math.min(k, c.length - 1)], { r0: b.w * 0.25, max: b.w * (0.9 + k * 0.35) * (strength || 1), dur: 1300 + k * 250, a: 0.14 - k * 0.035 }); }, k * 140);
      })(k);
    }
  }

  var last = performance.now();
  function frame(now) {
    var dt = Math.min(64, now - last); last = now;
    ctx.clearRect(0, 0, W, H);
    for (var i = rings.length - 1; i >= 0; i--) {
      var g = rings[i];
      g.life += dt;
      var p = g.life / g.dur;
      if (p >= 1) { rings.splice(i, 1); continue; }
      var e = 1 - Math.pow(1 - p, 3); // ease-out
      var r = g.r + (g.max - g.r) * e;
      var alpha = g.a * (1 - p);
      var col = g.rgb[0] + ',' + g.rgb[1] + ',' + g.rgb[2];
      if (g.fill) {
        var grad = ctx.createRadialGradient(g.x, g.y, r * 0.2, g.x, g.y, r);
        grad.addColorStop(0, 'rgba(' + col + ',' + (alpha * 0.35) + ')');
        grad.addColorStop(1, 'rgba(' + col + ',0)');
        ctx.fillStyle = grad;
        ctx.beginPath(); ctx.arc(g.x, g.y, r, 0, Math.PI * 2); ctx.fill();
      }
      ctx.strokeStyle = 'rgba(' + col + ',' + alpha + ')';
      ctx.lineWidth = 1.25 + 1 * (1 - p);
      ctx.beginPath(); ctx.arc(g.x, g.y, r, 0, Math.PI * 2); ctx.stroke();
    }
    if (rings.length) requestAnimationFrame(frame); else { running = false; ctx.clearRect(0, 0, W, H); }
  }

  /* ── reveal: stages cascade in, each bursting in its colour ── */
  root.classList.add('line-fx--armed');
  var revealed = false;
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      inView = en.isIntersecting;
      if (en.isIntersecting && !revealed && en.intersectionRatio > 0.25) {
        revealed = true;
        root.classList.add('is-revealed');
        stages.forEach(function (_, i) { setTimeout(function () { burst(i, 1.1); }, 180 + i * 140); });
      }
    });
  }, { threshold: [0, 0.25, 0.5] });
  io.observe(root);

  /* ── desktop: ripples follow the pointer ── */
  var current = -1;
  function setCurrent(i) {
    if (i === current) return;
    if (current > -1) stages[current].classList.remove('is-hot');
    current = i;
    if (i > -1) stages[i].classList.add('is-hot');
  }
  if (finePointer) {
    var lx = -999, ly = -999, lt = 0;
    root.addEventListener('pointermove', function (e) {
      var b = root.getBoundingClientRect(), x = e.clientX - b.left, y = e.clientY - b.top;
      var i = stageAtX(x);
      setCurrent(i);
      var now = performance.now(), dx = x - lx, dy = y - ly;
      if (dx * dx + dy * dy > 6400 && now - lt > 220) { // every ~80px of travel, at most ~4 per second
        ring(x, y, colorAt(i, x), { max: 120 + Math.random() * 60, dur: 1000 + Math.random() * 300 });
        lx = x; ly = y; lt = now;
      }
    });
    root.addEventListener('pointerleave', function () { setCurrent(-1); });
    root.addEventListener('pointerdown', function (e) {
      var b = root.getBoundingClientRect(), x = e.clientX - b.left, y = e.clientY - b.top, i = stageAtX(x);
      ring(x, y, colorAt(i, x), { max: 240, dur: 1400, a: 0.2 });
    });
  } else {
    /* ── touch: ripples from the stage nearest the middle of the screen while scrolling; tap to burst ── */
    var lastScroll = 0;
    window.addEventListener('scroll', function () {
      if (!inView || !revealed) return;
      var now = performance.now();
      if (now - lastScroll < 650) return;
      lastScroll = now;
      var mid = window.innerHeight / 2, best = 0, bd = Infinity;
      stages.forEach(function (li, i) { var r = li.getBoundingClientRect(), d = Math.abs(r.top + r.height / 2 - mid); if (d < bd) { bd = d; best = i; } });
      setCurrent(best);
      var bx = tileBox(best);
      ring(bx.x + (Math.random() - 0.5) * bx.w * 0.6, bx.y, colors[best][Math.floor(Math.random() * colors[best].length)], { r0: bx.w * 0.2, max: bx.w * 1.2, dur: 1300, a: 0.14 });
    }, { passive: true });
    stages.forEach(function (li, i) {
      li.addEventListener('touchstart', function () { setCurrent(i); burst(i, 1.3); }, { passive: true });
    });
  }

  // stop if the user switches on reduced motion mid-visit
  if (reduce.addEventListener) reduce.addEventListener('change', function (e) { if (e.matches) { rings = []; root.classList.add('is-revealed'); } });
})();
