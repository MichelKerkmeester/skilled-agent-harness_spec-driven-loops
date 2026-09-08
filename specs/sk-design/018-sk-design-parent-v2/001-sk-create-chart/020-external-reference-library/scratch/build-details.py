"""Writes the details index and gallery from library/details/index.json."""
import json, sys, os
LIB = sys.argv[1].rstrip('/') + '/'
rows = json.load(open(LIB + 'details/index.json'))
by = {}
for r in rows: by.setdefault(r['name'], []).append(r)
lines = ['# Chart detail crops', '', 'Element-level captures of individual charts, taken at 2x by scrolling each source page and screenshotting the chart element with a small margin. Where the page renders charts inside iframes the frame is captured. Each source has one note; the file suffix is the scheme and the order on the page. The captures are reference material for the chart corpus, not assets it ships.', '', '| Source | Crops | What to look at |', '|--------|-------|-----------------|']
for name, rs in by.items():
    files = ', '.join(f"`{os.path.basename(r['file'])}`" for r in rs)
    lines.append(f"| [{name}]({rs[0]['url']}) | {files} | {rs[0]['note']} |")
open(LIB + 'details/index.md', 'w').write('\n'.join(lines) + '\n')
cells = ''.join(f'<figure><a href="{r["url"]}"><img src="{os.path.basename(r["file"])}" loading="lazy" alt="{r["name"]} {r["scheme"]}"></a><figcaption><strong>{r["name"]}</strong> · {r["scheme"]}<br>{r["note"]}</figcaption></figure>' for r in rows)
open(LIB + 'details/gallery.html', 'w').write(f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Chart detail crops</title><style>
:root{{color-scheme:light dark}}body{{margin:0;padding:24px;font:14px/1.5 ui-sans-serif,system-ui,sans-serif;background:#f7f7f4;color:#26251e}}@media(prefers-color-scheme:dark){{body{{background:#26251e;color:#f7f7f4}}}}
h1{{font-size:20px;margin:0 0 4px}}p{{margin:0 0 20px;opacity:.75}}main{{display:grid;grid-template-columns:repeat(auto-fill,minmax(360px,1fr));gap:20px;align-items:start}}figure{{margin:0}}img{{width:100%;height:auto;border-radius:4px;border:1px solid #cdcdc966;display:block;background:#fff}}figcaption{{padding:8px 2px 0;font-size:13px}}
</style></head><body><h1>Chart detail crops</h1><p>{len(rows)} crops from {len(by)} source pages, 2026-09-08. Click a crop to open its source page.</p><main>{cells}</main></body></html>''')
print(len(rows), 'crops from', len(by), 'pages')
