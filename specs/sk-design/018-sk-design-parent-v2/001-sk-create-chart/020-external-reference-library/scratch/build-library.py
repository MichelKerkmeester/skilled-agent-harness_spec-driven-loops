"""Builds the library from a capture directory: dedupes near-identical dark captures, converts
keepers to JPEG at a review width, and writes index.md, index.json and gallery.html."""
import subprocess, os, json, sys
SRC, OUT = sys.argv[1].rstrip('/') + '/', sys.argv[2].rstrip('/') + '/'
DATE = '2026-09-08'; WIDTH = '1200'; QUALITY = '74'
E = json.load(open(os.path.join(os.path.dirname(__file__), 'sources.json')))
os.makedirs(OUT, exist_ok=True)
rows, dropped = [], []
for e in E:
    name, url, kind, note = e['name'], e['url'], e['kind'], e['note']
    light, dark = f'{SRC}{name}-light.png', f'{SRC}{name}-dark.png'
    if not os.path.exists(light): print('missing', name); continue
    # Only sources seen to honour the system colour scheme keep a dark capture; the rest theme
    # by their own switch and their dark file is the light page again.
    schemes = ['light'] + (['dark'] if e.get('dark') and os.path.exists(dark) else [])
    if os.path.exists(dark) and not e.get('dark'): dropped.append(name)
    for sch in schemes:
        dst = f'{OUT}{name}-{sch}.jpg'
        subprocess.run(['sips', '-s', 'format', 'jpeg', '-s', 'formatOptions', QUALITY, '--resampleWidth', WIDTH, f'{SRC}{name}-{sch}.png', '--out', dst], capture_output=True)
        rows.append(dict(file=f'{name}-{sch}.jpg', name=name, scheme=sch, url=url, kind=kind, note=note, captured=DATE))
json.dump(rows, open(OUT + 'index.json', 'w'), indent=2)
head = f"""# External chart reference library

Screenshots of publicly reachable chart galleries, docs pages, design-system guidance and editorial chart products, captured on {DATE} with Playwright driving the installed Chrome at 1440 wide: each page was scrolled so lazily rendered cards drew, then captured from the top down to 3200 pixels and stored at {WIDTH} wide. Sources seen to honour the system colour scheme keep both captures; the rest theme by their own switch, so only their light capture is kept. Each entry records where it came from and the one idea worth borrowing. The captures are reference material for the chart corpus, not assets it ships; the pages remain the property of their publishers.

| File | Source | Kind | What to look at |
|------|--------|------|-----------------|
"""
body = ''.join(f"| `{r['file']}` | [{r['url']}]({r['url']}) | {r['kind']} | {r['note']} |\n" for r in rows)
tail = """
## Not captured

| Source | Why |
|--------|-----|
| Highcharts demos, Reuters Graphics, Datawrapper blog and academy | Cookie or consent walls cover the page at load |
| The Economist graphic detail | A verification wall |
| Grafana Play | A welcome modal, and no stable public dashboard path |
| Carbon complex charts page and the Carbon Storybook | 404 and an error page |
| Linear Insights, PostHog, The Pudding, Nivo home, Unovis home | Marketing heroes without a chart worth keeping |
| Apple Health, Stocks and Weather | Native apps; the HIG page stands in for them |
| Tremor under bare headless Chrome | Rendered an application error; captured once Playwright drove a full Chrome profile |

## Reproduce

`node scratch/capture-playwright.cjs <dir>` from the repository root takes every capture (it needs the Playwright package under the md-generator backend and the installed Google Chrome), then `python3 scratch/build-library.py <dir> library` builds this directory from `scratch/sources.json`. `scratch/contact-sheet.cjs <dir> <out.html> <cols>` tiles a directory for triage. The earlier bare-Chrome scripts are kept as the record of the first two rounds.
"""
open(OUT + 'index.md', 'w').write(head + body + tail)
cells = ''.join(f'<figure><a href="{r["url"]}"><img src="{r["file"]}" loading="lazy" alt="{r["name"]} {r["scheme"]}"></a><figcaption><strong>{r["name"]}</strong> · {r["scheme"]} · {r["kind"]}<br>{r["note"]}</figcaption></figure>' for r in rows)
open(OUT + 'gallery.html', 'w').write(f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>External chart reference library</title><style>
:root{{color-scheme:light dark}}body{{margin:0;padding:24px;font:14px/1.5 ui-sans-serif,system-ui,sans-serif;background:#f7f7f4;color:#26251e}}@media(prefers-color-scheme:dark){{body{{background:#26251e;color:#f7f7f4}}}}
h1{{font-size:20px;margin:0 0 4px}}p{{margin:0 0 20px;opacity:.75}}main{{display:grid;grid-template-columns:repeat(auto-fill,minmax(420px,1fr));gap:20px}}figure{{margin:0}}img{{width:100%;aspect-ratio:1440/1100;object-fit:cover;object-position:top;border-radius:4px;border:1px solid #cdcdc966;display:block}}figcaption{{padding:8px 2px 0;font-size:13px}}
</style></head><body><h1>External chart reference library</h1><p>{len(rows)} captures from {len(E)} sources, {DATE}. Each capture shows the top of a scrolled page; click it to open the source.</p><main>{cells}</main></body></html>''')
print(len(rows), 'captures from', len(E), 'sources; dark dropped:', dropped)
