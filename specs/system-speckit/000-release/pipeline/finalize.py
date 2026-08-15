#!/usr/bin/env python3
# Normalize the by-skill changelog into a release-ready doc:
#  - fix bare '#### <name>' headings to full 'track/(z_archive/)NNN-name' via the manifest
#  - report duplicate folder-ids within a skill section (the sk-git split)
#  - prepend a release header
import re, sys, collections

manifest, src, out, commits = sys.argv[1:5]
title2track = {
    "Spec Kit & Memory": "system-speckit", "Deep Loop": "system-deep-loop",
    "External CLI Orchestration": "cli-external-orchestration", "Documentation (sk-doc)": "sk-doc",
    "Design (sk-design)": "sk-design", "Code (sk-code)": "sk-code", "Git (sk-git)": "sk-git",
    "Prompt (sk-prompt)": "sk-prompt", "MCP Tooling": "mcp-tooling", "Hooks & Runtime": "hooks",
    "Skill Advisor": "system-skill-advisor", "Agents": "agents",
}
# basename -> [(track, relpath)]
bmap = collections.defaultdict(list)
for line in open(manifest):
    p = line.split('\t')[0]
    if not p.startswith('specs/'): continue
    rel = p[len('specs/'):]
    bmap[rel.split('/')[-1]].append((rel.split('/')[0], rel))

lines = open(src).read().splitlines()
cur = None
seen = collections.defaultdict(list)
fixed = 0
dropped = []
skip = False
body = []
for ln in lines:
    m2 = re.match(r'^## (.+)$', ln)
    m4 = re.match(r'^#### (\S+)(.*)$', ln)
    if m2:
        cur = title2track.get(m2.group(1).strip()); skip = False
        body.append(ln); continue
    if m4:
        tok, rest = m4.group(1), m4.group(2)
        full = tok
        if '/' not in tok:
            cands = bmap.get(tok, [])
            pick = [c for c in cands if c[0] == cur] or cands
            if pick:
                full = pick[0][1]; fixed += 1
        if full in seen[cur]:
            skip = True; dropped.append((cur, full)); continue  # drop duplicate entry + its body
        skip = False; seen[cur].append(full)
        body.append('#### ' + full + rest); continue
    if skip:
        continue  # inside a dropped duplicate's body
    body.append(ln)

# strip the old top title (first two lines) — we re-header below
while body and (body[0].startswith('# ') or body[0].startswith('> ') or body[0].strip() == ''):
    body.pop(0)

header = [
    "# v4.0.0.0 — Changelog by Skill",
    "",
    f"> Per-spec-folder changelog summaries for the v3.6.0.0 → v4.0.0.0 release "
    f"({commits} commits, {sum(len(v) for v in seen.values())} folders across 12 skills). "
    f"Each entry summarizes one spec folder, grouped under its skill.",
    "",
]
open(out, 'w').write('\n'.join(header + body) + '\n')
print(f"fixed_bare_labels={fixed}")
print(f"dropped_duplicates={dropped if dropped else 'none'}")
print(f"total_entries={sum(len(v) for v in seen.values())}")
