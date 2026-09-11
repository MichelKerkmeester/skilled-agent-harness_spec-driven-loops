#!/usr/bin/env python3
"""Font-substitution label-mask measurement for CAP-001 run 4.

Two independent measures per mask:
  (a) pixel: changed pixels in the margin ring around the mask (with-fonts vs no-fonts,
      corrected for the 1px whole-page shift the no-fonts render carries)
  (b) ink:   dark pixels in the no-fonts render inside the crop but outside the mask's own
             bounds, that are NOT dark in the with-fonts render -> label spill
"""
import json, sys
from PIL import Image

MARGIN = 8
INK = 200  # luminance below this is glyph ink; grid dots sit ~225

def lum(p): return (p[0]*299 + p[1]*587 + p[2]*114)//1000

MASKS = {
  'swimlane': [
    ('HANDOFF', 452,124,60,12),
    ('REVISE',  576,240,52,12),
  ],
  'architecture': [
    ('HTTPS',    172,252,48,12),
    ('RESP',     172,296,32,12),
    ('SSR',      368,252,48,12),
    ('READ MDX', 584,248,60,12),
    ('QUERY',    584,284,44,12),
  ],
}
# mapping measured from magenta fiducials read back out of real captures
MAP = {'wf': (1.2, 40.0, 1.2, 160.0), 'nf': (1.2, 40.0, 1.2, 159.0)}

def px(u, which, axis):
    sx, x0, sy, y0 = MAP[which]
    return (sx*u + x0) if axis == 'x' else (sy*u + y0)

out = []
for form, masks in MASKS.items():
    wf = Image.open(f'{form}-with-fonts.png').convert('RGB').load()
    nf = Image.open(f'{form}-no-fonts.png').convert('RGB').load()
    for name, mx, my, mw, mh in masks:
        for which, img in (('wf', wf), ('nf', nf)):
            pass
        bw = (int(px(mx,'wf','x')), int(px(my,'wf','y')), int(round(px(mx+mw,'wf','x'))), int(round(px(my+mh,'wf','y'))))
        bn = (int(px(mx,'nf','x')), int(px(my,'nf','y')), int(round(px(mx+mw,'nf','x'))), int(round(px(my+mh,'nf','y'))))
        changed = 0; spill = 0; spill_pts = []
        for dy in range(-MARGIN, (bw[3]-bw[1])+MARGIN):
            for dx in range(-MARGIN, (bw[2]-bw[0])+MARGIN):
                xw, yw = bw[0]+dx, bw[1]+dy
                xn, yn = bn[0]+dx, bn[1]+dy
                inside = bw[0] <= xw < bw[2] and bw[1] <= yw < bw[3]
                if inside: continue
                a = wf[xw, yw]; b = nf[xn, yn]
                if a != b: changed += 1
                if lum(b) < INK and lum(a) >= INK:
                    spill += 1; spill_pts.append([xn, yn, list(b)])
        out.append({
          'form': form, 'mask': name, 'rect_units': [mx,my,mw,mh],
          'rect_px_with_fonts': bw, 'rect_px_no_fonts': bn,
          'changed_px_in_margin_ring': changed,
          'ink_outside_mask_new_in_no_fonts': spill,
          'spill_sample': spill_pts[:6],
          'verdict': 'OVERFLOW' if spill else 'clean',
        })
print(json.dumps(out, indent=2))
