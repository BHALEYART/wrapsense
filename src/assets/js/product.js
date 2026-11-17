/* Product page: image gallery, sub-navigation highlighting, mobile sticky CTA. */
(function () {
  'use strict';
  var gallery = document.querySelector('[data-gallery]');
  if (gallery) {
    var thumbs = [].slice.call(gallery.querySelectorAll('.gallery__thumb'));
    var slides = [].slice.call(gallery.querySelectorAll('.gallery__slide'));
    var select = function (i) {
      slides.forEach(function (s, j) { s.hidden = j !== i; });
      thumbs.forEach(function (t, j) { t.setAttribute('aria-pressed', String(j === i)); });
    };
    thumbs.forEach(function (t, i) {
      t.addEventListener('click', function () { select(i); });
      t.addEventListener('keydown', function (e) {
        var k = e.key, n = thumbs.length, j = null;
        if (k === 'ArrowRight' || k === 'ArrowDown') j = (i + 1) % n;
        if (k === 'ArrowLeft' || k === 'ArrowUp') j = (i - 1 + n) % n;
        if (j !== null) { e.preventDefault(); thumbs[j].focus(); select(j); }
      });
    });
  }

  var links = [].slice.call(document.querySelectorAll('.subnav a'));
  if (links.length && 'IntersectionObserver' in window) {
    var map = {};
    links.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          links.forEach(function (a) { a.classList.remove('is-active'); a.removeAttribute('aria-current'); });
          var a = map[en.target.id];
          if (a) { a.classList.add('is-active'); a.setAttribute('aria-current', 'true'); }
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    Object.keys(map).forEach(function (id) { var el = document.getElementById(id); if (el) io.observe(el); });
  }

  var sticky = document.querySelector('[data-sticky-cta]');
  var hero = document.querySelector('.product-hero__actions');
  if (sticky && hero && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (e) { sticky.classList.toggle('is-visible', !e[0].isIntersecting && e[0].boundingClientRect.top < 0); }).observe(hero);
  }
})();

/* Blog: highlight the current section in the table of contents. */
(function () {
  var links = [].slice.call(document.querySelectorAll('.toc a'));
  if (!links.length || !('IntersectionObserver' in window)) return;
  var byId = {};
  links.forEach(function (a) { byId[a.getAttribute('href').slice(1)] = a; });
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return;
      links.forEach(function (a) { a.classList.remove('is-active'); a.removeAttribute('aria-current'); });
      var a = byId[e.target.id];
      if (a) { a.classList.add('is-active'); a.setAttribute('aria-current', 'true'); }
    });
  }, { rootMargin: '-20% 0px -70% 0px' });
  Object.keys(byId).forEach(function (id) { var el = document.getElementById(id); if (el) io.observe(el); });
})();
