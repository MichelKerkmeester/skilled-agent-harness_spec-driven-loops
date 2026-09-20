#!/usr/bin/env python3
"""Fleet census for divider / TOC / anchor drift across structured .md.

Counts, per doc-type bucket:
  - files with numbered ALL-CAPS H2
  - files missing at least one `---` divider between numbered H2 (+ total gaps)
  - files carrying a TABLE OF CONTENTS
  - files carrying <!-- ANCHOR --> comments (mix of vestigial nav + functional continuity)
  - single-dash (#N-x) vs double-dash (#N--x) TOC anchors

The divider heuristic treats blank AND html-comment-only lines as transparent
so an <!-- ANCHOR --> comment sitting between `---` and a heading is not a false
positive, and skips numbered headings inside fenced code blocks.
"""
import re, pathlib
from collections import defaultdict

ROOTS = [pathlib.Path(".opencode/skills"), pathlib.Path(".opencode/commands"), pathlib.Path(".opencode/agents")]
SKIP = ("z_archive", "/tests/", "node_modules", "/dist/", "test-fixtures", "/scratch/")

def bucket(p):
    s, n = str(p), p.name
    if n == "README.md": return "README"
    if n == "SKILL.md": return "SKILL"
    if "/constitutional/" in s: return "constitutional"
    if "/procedures/" in s or "procedure-card" in s: return "procedure"
    if "/commands/" in s: return "command"
    if "/agents/" in s: return "agent"
    if "/references/" in s: return "reference"
    if "/assets/" in s: return "asset"
    if "/changelog/" in s: return "changelog"
    if "/feature-catalog/" in s: return "feature-catalog"
    if "/manual-testing-playbook/" in s: return "playbook"
    return "other"

def transparent(s):
    return (not s) or s.startswith("<!--") or s.endswith("-->")

def numbered_h2(text):
    fence, idx, lines = False, [], text.splitlines()
    for i, l in enumerate(lines):
        st = l.strip()
        if st.startswith("```"):
            fence = not fence; continue
        if fence: continue
        if re.match(r'^##\s+(?:[^\w\s]\s+)?\d+\.\s+', l):
            idx.append(i)
    return idx, lines

def main():
    files = []
    for r in ROOTS:
        if r.exists():
            files += [p for p in r.rglob("*.md") if not any(s in str(p) for s in SKIP)]
    stat = defaultdict(lambda: dict(n=0, numbered=0, drift=0, gaps=0, toc=0, anchor=0, sdash=0, ddash=0))
    for p in files:
        t = p.read_text(errors="ignore"); s = stat[bucket(p)]; s['n'] += 1
        if re.search(r'(?im)^##\s+(?:[^\w\s]\s+)?TABLE OF CONTENTS\b', t): s['toc'] += 1
        if re.search(r'<!--\s*/?ANCHOR\b', t, re.I): s['anchor'] += 1
        if re.search(r'\(#\d+-[a-z]', t): s['sdash'] += 1
        if re.search(r'\(#\d+--[a-z]', t): s['ddash'] += 1
        idx, lines = numbered_h2(t)
        if len(idx) > 1:
            s['numbered'] += 1; bad = 0
            for h in idx[1:]:
                j = h - 1
                while j >= 0 and transparent(lines[j].strip()): j -= 1
                if j < 0 or lines[j].strip() != '---': bad += 1
            if bad: s['drift'] += 1; s['gaps'] += bad
    hdr = f"{'type':16}{'files':>7}{'numH2':>7}{'drift':>7}{'gaps':>7}{'TOC':>5}{'ANC':>5}"
    print(hdr); print('-' * len(hdr))
    tot = defaultdict(int)
    for b in sorted(stat, key=lambda x: -stat[x]['drift']):
        s = stat[b]
        print(f"{b:16}{s['n']:7}{s['numbered']:7}{s['drift']:7}{s['gaps']:7}{s['toc']:5}{s['anchor']:5}")
        for k in s: tot[k] += s[k]
    print('-' * len(hdr))
    print(f"{'TOTAL':16}{tot['n']:7}{tot['numbered']:7}{tot['drift']:7}{tot['gaps']:7}{tot['toc']:5}{tot['anchor']:5}")

if __name__ == "__main__":
    main()
