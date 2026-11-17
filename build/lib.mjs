import fs from 'node:fs';
import path from 'node:path';
import { legacyImages } from '../src/data/legacy-images.mjs';

export const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
export const SRC = path.join(ROOT, 'src');
export const DIST = path.join(ROOT, 'dist');

export const esc = (s = '') =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

/** Tagged template that joins arrays and drops null/false. Values are NOT escaped — escape explicitly. */
export const html = (strings, ...vals) =>
  strings.reduce((out, s, i) => {
    let v = vals[i - 1];
    if (Array.isArray(v)) v = v.join('');
    if (v === null || v === undefined || v === false) v = '';
    return out + v + s;
  });

export const warnings = [];

// ── image metadata ───────────────────────────────────────────────
function webpSize(file) {
  const b = fs.readFileSync(file);
  const chunk = b.toString('ascii', 12, 16);
  if (chunk === 'VP8X') return { w: 1 + b.readUIntLE(24, 3), h: 1 + b.readUIntLE(27, 3) };
  if (chunk === 'VP8L') {
    const bits = b.readUInt32LE(21);
    return { w: (bits & 0x3fff) + 1, h: ((bits >> 14) & 0x3fff) + 1 };
  }
  if (chunk === 'VP8 ') return { w: b.readUInt16LE(26) & 0x3fff, h: b.readUInt16LE(28) & 0x3fff };
  throw new Error('Unknown webp ' + file);
}
function pngSize(file) {
  const b = fs.readFileSync(file);
  return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) };
}

const cache = new Map();
/**
 * Resolve an image reference to { src, w, h, remote }.
 * 'products/foo.webp' → local file in src/assets/img
 * 'legacy:key'        → local copy in src/assets/img/legacy if fetched, else remote URL
 */
export function img(ref) {
  if (!ref) return null;
  if (cache.has(ref)) return cache.get(ref);
  let out;
  if (ref.startsWith('legacy:')) {
    const key = ref.slice(7);
    const L = legacyImages[key];
    if (!L) throw new Error('Unknown legacy image ' + key);
    const local = path.join(SRC, 'assets/img/legacy', L.file);
    if (fs.existsSync(local)) {
      const s = L.file.endsWith('.png') ? pngSize(local) : jpgSize(local) || { w: L.w, h: L.h };
      out = { src: '/assets/img/legacy/' + L.file, w: s.w, h: s.h, remote: false, alt: L.alt };
    } else {
      warnings.push(`legacy image "${key}" not downloaded — hotlinking ${L.src} (run npm run fetch-images)`);
      out = { src: L.src, w: L.w, h: L.h, remote: true, alt: L.alt };
    }
  } else {
    const file = path.join(SRC, 'assets/img', ref);
    if (!fs.existsSync(file)) throw new Error('Missing image ' + ref);
    const s = ref.endsWith('.webp') ? webpSize(file) : pngSize(file);
    out = { src: '/assets/img/' + ref, w: s.w, h: s.h, remote: false };
  }
  cache.set(ref, out);
  return out;
}

function jpgSize(file) {
  const b = fs.readFileSync(file);
  let i = 2;
  while (i < b.length) {
    if (b[i] !== 0xff) return null;
    const m = b[i + 1];
    const len = b.readUInt16BE(i + 2);
    if (m >= 0xc0 && m <= 0xcf && m !== 0xc4 && m !== 0xc8 && m !== 0xcc) return { h: b.readUInt16BE(i + 5), w: b.readUInt16BE(i + 7) };
    i += 2 + len;
  }
  return null;
}

/** <img> tag with dimensions, lazy loading by default. */
export function imgTag(ref, alt, { cls = '', eager = false, sizes = '', fetchpriority = '' } = {}) {
  const i = img(ref);
  if (!i) return '';
  return `<img src="${esc(i.src)}" alt="${esc(alt ?? i.alt ?? '')}" width="${i.w}" height="${i.h}"${cls ? ` class="${cls}"` : ''}${eager ? '' : ' loading="lazy"'} decoding="async"${sizes ? ` sizes="${sizes}"` : ''}${fetchpriority ? ` fetchpriority="${fetchpriority}"` : ''}${i.remote ? ' referrerpolicy="no-referrer"' : ''}>`;
}

export function write(rel, content) {
  const file = path.join(DIST, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
}

export function copyDir(from, to) {
  fs.mkdirSync(to, { recursive: true });
  for (const e of fs.readdirSync(from, { withFileTypes: true })) {
    const a = path.join(from, e.name), b = path.join(to, e.name);
    if (e.isDirectory()) copyDir(a, b);
    else fs.copyFileSync(a, b);
  }
}

export const icon = (name, cls = 'icon') => `<svg class="${cls}" aria-hidden="true" focusable="false"><use href="#i-${name}"></use></svg>`;

export const truncate = (s, n) => (s.length <= n ? s : s.slice(0, s.lastIndexOf(' ', n - 1)).replace(/[,.;:—–-]+$/, '') + '…');
