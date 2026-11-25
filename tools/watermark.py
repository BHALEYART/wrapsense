#!/usr/bin/env python3
"""Burn a faint, centered WrapSense watermark into machine renders.

Source of truth: art/products-clean/*.webp (clean, unwatermarked, NOT published).
Output:          src/assets/img/products/*.webp (what the site serves).

When replacing a machine image, save the clean version to art/products-clean/
and run:  python3 tools/watermark.py [name ...]   (no names = all)

The mark is the bold W, large and centered. On the machine it is a brightness shift
(darker on light metal, lighter on dark panels) so it stays faint but visible on any
finish; over empty/transparent areas it is a faint navy W.
"""
import sys, pathlib
import numpy as np
from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parent.parent
CLEAN = ROOT / 'art/products-clean'
OUT = ROOT / 'src/assets/img/products'
LOGO = ROOT / 'src/assets/img/brand/w-mark-512.png'   # bold W reads far better than the thin wordmark
SIZE = 0.45        # mark width as a fraction of image width...
MAX_H = 0.45       # ...capped at this fraction of image height
DELTA = 46         # brightness shift on the machine (0-255): darkens light metal, lightens dark panels
BG_ALPHA = 0.12    # opacity of the navy mark over empty/transparent areas
NAVY = np.array([14, 30, 60], np.float32)

def mark(src: pathlib.Path, dst: pathlib.Path):
    im = Image.open(src).convert('RGBA')
    W, H = im.size
    logo = Image.open(LOGO).convert('RGBA')
    lw = int(W * SIZE); lh = round(logo.height * lw / logo.width)
    if lh > H * MAX_H:
        lh = int(H * MAX_H); lw = round(logo.width * lh / logo.height)
    logo = logo.resize((lw, lh), Image.LANCZOS)
    L = np.zeros((H, W), np.float32)
    x0, y0 = (W - lw) // 2, (H - lh) // 2
    L[y0:y0 + lh, x0:x0 + lw] = np.asarray(logo, np.float32)[..., 3] / 255
    A = np.asarray(im, np.float32)
    rgb, a = A[..., :3], A[..., 3:] / 255
    lum = (rgb @ np.array([0.299, 0.587, 0.114], np.float32))[..., None]
    rgb = np.clip(rgb + np.where(lum > 120, -1.0, 1.0) * DELTA * L[..., None], 0, 255)
    la = (L * BG_ALPHA)[..., None]
    oa = la + a * (1 - la)
    out = (NAVY * la + rgb * a * (1 - la)) / np.maximum(oa, 1e-4)
    res = Image.fromarray(np.dstack([np.clip(out, 0, 255), oa[..., 0] * 255]).astype(np.uint8), 'RGBA')
    res.save(dst, 'WEBP', quality=80, method=6, alpha_quality=92)

if __name__ == '__main__':
    names = sys.argv[1:]
    files = [CLEAN / (n if n.endswith('.webp') else n + '.webp') for n in names] if names else sorted(CLEAN.glob('*.webp'))
    for f in files:
        mark(f, OUT / f.name); print('marked', f.name)
