#!/usr/bin/env python3
"""Crop / diff / probe helper for CAP-001 run 4."""
import sys, hashlib
from PIL import Image

def crop(src, out, x, y, w, h, zoom=1):
    im = Image.open(src).convert('RGB')
    c = im.crop((x, y, x + w, y + h))
    if zoom != 1:
        c = c.resize((c.width * zoom, c.height * zoom), Image.NEAREST)
    c.save(out)
    print(f"crop {src} -> {out} box=({x},{y},{w},{h}) zoom={zoom} size={c.size}")

def diff(a, b, out=None, dy=0):
    ia = Image.open(a).convert('RGB'); ib = Image.open(b).convert('RGB')
    print(f"sizes {ia.size} {ib.size} shift_dy={dy}")
    w = min(ia.width, ib.width); h = min(ia.height, ib.height) - abs(dy)
    pa = ia.load(); pb = ib.load()
    n = 0; boxes = None
    for yy in range(h):
        for xx in range(w):
            if pa[xx, yy] != pb[xx, yy + dy]:
                n += 1
                if boxes is None: boxes = [xx, yy, xx, yy]
                else:
                    boxes[0] = min(boxes[0], xx); boxes[1] = min(boxes[1], yy)
                    boxes[2] = max(boxes[2], xx); boxes[3] = max(boxes[3], yy)
    print(f"differing_pixels={n} bbox={boxes}")

def px(src, x, y):
    im = Image.open(src).convert('RGB')
    print(f"{src} ({x},{y}) = {im.getpixel((x,y))}")

def colhist(src, x, y, w, h, top=12):
    im = Image.open(src).convert('RGB').crop((x, y, x+w, y+h))
    from collections import Counter
    c = Counter(im.getdata())
    for col, n in c.most_common(top):
        print(f"  {col} x{n}")

if __name__ == '__main__':
    cmd = sys.argv[1]
    if cmd == 'crop':
        a = sys.argv[2:]
        crop(a[0], a[1], int(a[2]), int(a[3]), int(a[4]), int(a[5]), int(a[6]) if len(a) > 6 else 1)
    elif cmd == 'diff':
        a = sys.argv[2:]
        diff(a[0], a[1], None, int(a[2]) if len(a) > 2 else 0)
    elif cmd == 'px':
        px(sys.argv[2], int(sys.argv[3]), int(sys.argv[4]))
    elif cmd == 'colhist':
        a = sys.argv[2:]
        colhist(a[0], int(a[1]), int(a[2]), int(a[3]), int(a[4]))
