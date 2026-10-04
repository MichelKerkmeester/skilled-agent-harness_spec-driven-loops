#!/usr/bin/env python3
"""Build the planted lineage of protocol section 5 and score the helper against it.

Usage: planted.py <repo-root>
Writes planted-packet/ (spec.md, research/planted.md, context/ present files) next to
this script, runs the helper on it with the cutoff lifted, and writes planted-result.json.
Every tag has a known answer: moved, gone, past end and guessed must warn with that
class; controls and ignored tags must not warn.
"""
import json, os, random, subprocess, sys

ROOT = sys.argv[1]
HERE = os.path.dirname(os.path.abspath(__file__))
PKT = os.path.join(HERE, 'planted-packet')
REL = os.path.relpath(PKT, ROOT)
HELPER = os.path.join(ROOT, '.skilled/skills/system-spec-kit/runtime/cli/rules/check-source-tags-helper.mjs')
rng = random.Random(20261004)

def git(*a, data=None):
    return subprocess.run(['git', '-C', ROOT, *a], input=data, capture_output=True, text=True).stdout

tracked = sorted(set(git('ls-files', '-z').split('\0')) - {''})
tset = set(tracked)
ever = set(open(os.path.join(HERE, '../../009-census-hardening/scratch/ever-paths.txt')).read().split('\n'))
rules = json.load(open(os.path.join(ROOT, '.skilled/skills/sk-doc/shared/scripts/cite-drift-redirects.json')))['rules']
rules.sort(key=lambda r: (-len(r['from']), r['from']))
base_count = {}
for p in tracked:
    base_count[os.path.basename(p)] = base_count.get(os.path.basename(p), 0) + 1

def lines(p):
    try:
        t = open(os.path.join(ROOT, p), encoding='utf8', errors='replace').read()
    except OSError:
        return None
    return 0 if t == '' else t.count('\n') + (0 if t.endswith('\n') else 1)

def redirect(p):
    seen, cur = {p}, p
    for _ in range(8):
        rule = next((r for r in rules if cur.startswith(r['from'])), None)
        if rule is None:
            return None
        nxt = rule['to'] + cur[len(rule['from']):]
        if nxt in tset:
            return nxt
        if nxt in seen:
            return None
        seen.add(nxt)
        cur = nxt
    return None

md = [p for p in tracked if p.endswith('.md') and (lines(p) or 0) >= 20 and ' ' not in p]
rng.shuffle(md)
tags = []

# moved: a .skilled/skills file cited under its old .opencode/skills prefix, which the table maps back.
for p in [p for p in md if p.startswith('.skilled/skills/')]:
    old = '.opencode/' + p[len('.skilled/'):]
    if old not in tset and redirect(old) == p and base_count[os.path.basename(p)] > 1:
        tags.append(('moved', f'{old}:3'))
    if sum(1 for t in tags if t[0] == 'moved') == 10:
        break
# gone: a path that never existed, with a basename no tracked file has.
for n in range(1, 11):
    p = f'planted/never/zz-planted-gone-{n}.ts'
    assert p not in ever and f'zz-planted-gone-{n}.ts' not in base_count
    tags.append(('gone', f'{p}:1'))
# past end: a tracked file cited five lines past its end.
for p in md[:10]:
    tags.append(('past end', f'{p}:{lines(p) + 5}'))
# guessed: a basename unique in the tree, cited under a folder that does not hold it.
uniq = [p for p in md[10:] if base_count[os.path.basename(p)] == 1 and '/' in p]
for p in uniq[:10]:
    tags.append(('guessed', f'planted/wrongdir/{os.path.basename(p)}:1'))
# controls: in range, five of them REPO RULES.md:88.
for _ in range(5):
    tags.append(('control', 'REPO RULES.md:88'))
for p in md[30:35]:
    tags.append(('control', f'{p}:2'))
# ignored: under specs/**/context/, five present and five absent.
os.makedirs(os.path.join(PKT, 'context'), exist_ok=True)
os.makedirs(os.path.join(PKT, 'research'), exist_ok=True)
for n in range(1, 6):
    with open(os.path.join(PKT, 'context', f'present-{n}.md'), 'w') as fh:
        fh.write('one\ntwo\nthree\nfour\nfive\n')
    tags.append(('ignored', f'{REL}/context/present-{n}.md:3'))
for n in range(1, 6):
    tags.append(('ignored', f'{REL}/context/absent-{n}.md:3'))

counts = {}
for c, _ in tags:
    counts[c] = counts.get(c, 0) + 1
assert all(counts.get(c) == 10 for c in ('moved', 'gone', 'past end', 'guessed', 'control', 'ignored')), counts

with open(os.path.join(PKT, 'spec.md'), 'w') as fh:
    fh.write('# Planted lineage fixture\n\n| Field | Value |\n|---|---|\n| **Created** | 2026-10-05 |\n')
with open(os.path.join(PKT, 'research', 'planted.md'), 'w') as fh:
    fh.write('# Planted tags\n\n')
    for i, (c, cite) in enumerate(tags, 1):
        fh.write(f'- planted {i} ({c}) [SOURCE: {cite}]\n')

out = subprocess.run(['node', HELPER, PKT], capture_output=True, text=True, cwd=ROOT,
                     env={**os.environ, 'SPECKIT_SOURCE_TAG_CUTOFF': '2000-01-01'})
warn = {}
for l in out.stdout.splitlines():
    f = l.split('\t')
    if f[0] == 'WARN':
        warn[int(f[1].rsplit(':', 1)[1]) - 2] = f[3]
res = {'exit': out.returncode, 'stderr': out.stderr.strip(), 'tail': out.stdout.splitlines()[-2:], 'classes': {}}
for c in ('moved', 'gone', 'past end', 'guessed', 'control', 'ignored'):
    idx = [i for i, (cc, _) in enumerate(tags, 1) if cc == c]
    if c in ('control', 'ignored'):
        res['classes'][c] = {'n': len(idx), 'warned': sum(1 for i in idx if i in warn),
                             'wrong': [tags[i - 1][1] + ' -> ' + warn[i] for i in idx if i in warn]}
    else:
        hit = [i for i in idx if warn.get(i) == c]
        res['classes'][c] = {'n': len(idx), 'recall': len(hit) / len(idx),
                             'missed': [tags[i - 1][1] + ' -> ' + str(warn.get(i)) for i in idx if warn.get(i) != c]}
json.dump(res, open(os.path.join(HERE, 'planted-result.json'), 'w'), indent=2)
print(json.dumps(res, indent=2))
