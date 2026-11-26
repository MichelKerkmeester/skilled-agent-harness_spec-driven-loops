#!/usr/bin/env python3
"""List every path:line citation in a range of rows of one packet doc, with the text the cited line holds now.

usage: cites.py <doc.md> <first-row-id> <last-row-id>
Row ids are AC-NNN, TNNN or CHK-NNN. A bare `:N` citation inherits the last named path in the same row.
Run from the repository root.
"""
import re, sys, pathlib, subprocess

PKT = pathlib.Path("specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers")
ADV = pathlib.Path(".skilled/skills/system-skill-advisor/runtime")
doc, first, last = sys.argv[1], sys.argv[2], sys.argv[3]
lines = (PKT / doc).read_text().splitlines()
ROW = re.compile(r"^(?:\| (AC-\d+) |- \[[ xB]\] (T\d+|CHK-\d+) )")
CITE = re.compile(r"`([^`\s]*?\.(?:ts|py|cjs|mjs|json|jsonl|md|txt|yaml|sh))?:(\d+)`|`([^`\s]+\.(?:ts|py|cjs|mjs|json|jsonl|md|txt|yaml|sh)):(\d+)`")

def resolve(p):
    cands = [pathlib.Path(p), PKT / p, ADV / p, pathlib.Path(".skilled/skills/system-deep-loop/runtime") / p,
             pathlib.Path(".skilled/commands/deep/assets") / p, pathlib.Path(".skilled/changelog/skilled") / p]
    for c in cands:
        if c.is_file():
            return c
    hits = subprocess.run(["git", "ls-files", f"*{p}"], capture_output=True, text=True).stdout.split()
    return pathlib.Path(hits[0]) if len(hits) == 1 else None

active = False
for i, l in enumerate(lines, 1):
    m = ROW.match(l)
    rid = m and (m.group(1) or m.group(2))
    if rid == first:
        active = True
    if not active or not rid:
        continue
    print(f"=== {rid} ({doc}:{i})")
    cur = None
    for c in re.finditer(r"`([^`]*?):(\d+)`", l):
        path, n = c.group(1), int(c.group(2))
        if path:
            cur = path
        target = path or cur
        f = resolve(target) if target else None
        if not f:
            print(f"  {target}:{n}  -> UNRESOLVED PATH")
            continue
        src = f.read_text(errors="replace").splitlines()
        text = src[n - 1].strip()[:150] if 0 < n <= len(src) else "<past end of file>"
        print(f"  {f}:{n}  -> {text!r}")
    if rid == last:
        break
