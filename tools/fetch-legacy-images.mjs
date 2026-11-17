// Downloads images that only exist on the old WordPress site into src/assets/img/legacy/.
// Run this BEFORE the domain is switched to the new site:  npm run fetch-images
import fs from 'node:fs';
import path from 'node:path';
import { legacyImages } from '../src/data/legacy-images.mjs';

const dir = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../src/assets/img/legacy');
fs.mkdirSync(dir, { recursive: true });
let ok = 0, fail = 0;
for (const [key, L] of Object.entries(legacyImages)) {
  const out = path.join(dir, L.file);
  if (fs.existsSync(out)) { ok++; continue; }
  try {
    const r = await fetch(L.src, { headers: { 'User-Agent': 'Mozilla/5.0 (WrapSense site migration)' } });
    if (!r.ok) throw new Error('HTTP ' + r.status);
    fs.writeFileSync(out, Buffer.from(await r.arrayBuffer()));
    console.log('✓', key, '→', L.file);
    ok++;
  } catch (e) {
    console.error('✗', key, L.src, e.message);
    fail++;
  }
}
console.log(`\n${ok} ready, ${fail} failed.${fail ? ' Re-run, or save failed images manually into src/assets/img/legacy/ using the file names above.' : ' Run npm run build — the site now serves these locally.'}`);
