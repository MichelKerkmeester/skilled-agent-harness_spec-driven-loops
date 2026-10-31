#!/usr/bin/env python3
"""Draw the protocol v1 samples from a row-level census and check them against facts.

Usage: sample-and-check.py <repo-root> <rows.jsonl> <out-dir> [--sizes moved=100,gone=100,past_end=100,basename_only=50,ambiguous=50] [--packet-base]

Classes and ground truth follow ../measurement-protocol.md sections 2 and 3:
  moved     right when a file-level rename chain in git history links a resolver
            candidate of the cited path to the new path, the new path is tracked,
            and in-range versus past-end matches the new file's line count;
  past_end  right when the resolved path is tracked and has fewer lines than cited;
  gone      right when no resolver candidate is a tracked file; each row also gets a
            cause: parser miss (a tracked file exists once spaces are kept, counted
            wrong), ignored, deleted (the path appears in history), or never existed.
Guessed rows (basename_only, ambiguous) are written out for the model labelers.
The gone class is also split by cause over the whole class.
"""
import json, math, os, random, re, subprocess, sys
from collections import Counter, defaultdict

SEED = 20261004
ROOT, ROWS, OUT = sys.argv[1], sys.argv[2], sys.argv[3]
SIZES = {'moved': 100, 'gone': 100, 'past_end': 100, 'basename_only': 50, 'ambiguous': 50}
for arg in sys.argv[4:]:
    if arg.startswith('--sizes='):
        SIZES = {k: int(v) for k, v in (p.split('=') for p in arg[len('--sizes='):].split(','))}
HERE = os.path.dirname(os.path.abspath(__file__))
TAG = os.environ.get('SAMPLE_TAG', '')
os.makedirs(OUT, exist_ok=True)

def wilson(k, n, z=1.96):
    if n == 0:
        return None
    p = k / n
    d = 1 + z * z / n
    c = (p + z * z / (2 * n)) / d
    h = z * math.sqrt(p * (1 - p) / n + z * z / (4 * n * n)) / d
    return [round(max(0.0, c - h), 4), round(min(1.0, c + h), 4)]

def git(*args, data=None):
    return subprocess.run(['git', '-C', ROOT, *args], input=data, capture_output=True, text=True)

tracked = set(git('ls-files', '-z').stdout.split('\0')) - {''}
ever = set(open(os.path.join(HERE, 'ever-paths.txt')).read().split('\n')) - {''}
renames = defaultdict(set)
for line in open(os.path.join(HERE, 'renames-head.txt')):
    f = line.rstrip('\n').split('\t')
    if len(f) == 3 and f[0].startswith('R'):
        renames[f[1]].add(f[2])

def rename_closure(start):
    seen, todo = {start}, [start]
    while todo:
        cur = todo.pop()
        for nxt in renames.get(cur, ()):
            if nxt not in seen:
                seen.add(nxt)
                todo.append(nxt)
    return seen

line_cache = {}
def line_count(p):
    if p not in line_cache:
        try:
            with open(os.path.join(ROOT, p), 'rb') as fh:
                data = fh.read()
            text = data.decode('utf8', 'replace')
            parts = re.split(r'\r?\n', text)
            line_cache[p] = 0 if text == '' else (len(parts) - 1 if text.endswith('\n') else len(parts))
        except OSError:
            line_cache[p] = None
    return line_cache[p]

def norm(p):
    p = os.path.normpath(p).replace(os.sep, '/')
    return p

def candidates(row, target=None):
    t = target or row['target']
    out = [norm(os.path.join(os.path.dirname(row['doc']), t)), norm(t)]
    base = row.get('base')
    if base:
        out.append(norm(os.path.join(base, t)))
    return [c for c in out if not c.startswith('../') and not c.startswith('/')]

def spaced_targets(row):
    """Every 'w1 w2 target' span the citing sentence holds directly before the target."""
    s, t = row['sentence'], row['target']
    out = []
    for m in re.finditer(r'((?:[A-Za-z0-9_./-]+ )+)' + re.escape(t) + r':' + str(row['targetLine']), s):
        words = m.group(1).split()
        for i in range(len(words)):
            out.append(' '.join(words[i:]) + ' ' + t)
    return out

rows = [json.loads(l) for l in open(ROWS)]
for r in rows:
    if r.get('family') == 'skills' and 'base' not in r:
        r['base'] = '/'.join(r['doc'].split('/')[:3])
classes = {'moved': ['moved_in_range', 'moved_past_end'], 'gone': ['unresolved', 'missing'],
           'past_end': ['past_end'], 'basename_only': ['basename_only'], 'ambiguous': ['ambiguous'],
           'guessed': ['basename_only', 'ambiguous']}
key = lambda r: (r['doc'], r['line'], r['target'], r['targetLine'])
pools = {c: sorted([r for r in rows if r['status'] in s], key=key) for c, s in classes.items()}

# One check-ignore call over every gone candidate of the whole class.
gone_cands = sorted({c for r in pools['gone'] for c in candidates(r)})
ig = git('check-ignore', '-z', '--stdin', data='\0'.join(gone_cands) + '\0')
ignored = set(ig.stdout.split('\0')) - {''}

def check_moved(r):
    cands = candidates(r)
    linked = any(r['path'] in rename_closure(c) for c in cands)
    lc = line_count(r['path'])
    end = r['targetLineEnd'] or r['targetLine']
    fits = lc is not None and r['targetLine'] <= lc and end <= lc
    part_ok = (r['status'] == 'moved_in_range') == fits
    right = linked and r['path'] in tracked and part_ok
    return right, {'linked': linked, 'tracked': r['path'] in tracked, 'lines': lc, 'part_ok': part_ok}

def check_past_end(r):
    lc = line_count(r['path'])
    end = r['targetLineEnd'] or r['targetLine']
    right = r['path'] in tracked and lc is not None and (r['targetLine'] > lc or end > lc)
    return right, {'lines': lc, 'tracked': r['path'] in tracked}

def gone_cause(r):
    cands = candidates(r)
    for t in spaced_targets(r):
        if any(c in tracked for c in candidates(r, t)):
            return 'parser miss', cands
    if any(c in tracked for c in cands):
        return 'tracked', cands
    if any(c in ignored for c in cands):
        return 'ignored', cands
    if any(c in ever for c in cands):
        renamed = any(len(rename_closure(c) & tracked) > 0 for c in cands)
        return ('deleted (renamed, no rule)' if renamed else 'deleted'), cands
    return 'never existed', cands

def check_gone(r):
    if r['status'] == 'missing':
        # Tracked in the index but absent from the worktree: right when the file is really absent.
        absent = r['path'] is None or line_count(r['path']) is None
        return absent, {'cause': 'index only' if absent else 'present'}
    cause, cands = gone_cause(r)
    right = cause not in ('parser miss', 'tracked')
    return right, {'cause': cause}

rng = random.Random(SEED)
samples = {}
for c, size in SIZES.items():
    pool = pools[c]
    if size <= 0:
        size = len(pool)
    samples[c] = pool if len(pool) <= size else rng.sample(pool, size)

results = {'protocol': 'v1', 'seed': SEED, 'pool_sizes': {c: len(p) for c, p in pools.items()}, 'classes': {}}
checks = {'moved': check_moved, 'past_end': check_past_end, 'gone': check_gone}
for c, fn in checks.items():
    out = []
    for r in samples[c]:
        right, why = fn(r)
        out.append({**{k: r[k] for k in ('doc', 'line', 'target', 'targetLine', 'status', 'path')}, 'right': right, **why})
    k = sum(1 for o in out if o['right'])
    results['classes'][c] = {'n': len(out), 'right': k, 'accuracy': round(k / len(out), 4) if out else None,
                             'wilson95': wilson(k, len(out))}
    with open(os.path.join(OUT, f'sample-{c}.jsonl'), 'w') as fh:
        for o in out:
            fh.write(json.dumps(o) + '\n')

results['gone_causes_whole_class'] = dict(Counter(gone_cause(r)[0] for r in pools['gone']))
results['gone_causes_sample'] = dict(Counter(o['cause'] for o in map(json.loads, open(os.path.join(OUT, 'sample-gone.jsonl')))))
results['sizes'] = SIZES

basenames = defaultdict(list)
for p in tracked:
    basenames[os.path.basename(p)].append(p)
with open(os.path.join(OUT, 'guessed-for-labeling.jsonl'), 'w') as fh:
    for c in [c for c in ('basename_only', 'ambiguous', 'guessed') if c in SIZES]:
        for r in samples[c]:
            try:
                lines = git('show', f'HEAD:{r["doc"]}').stdout.split('\n')
            except Exception:
                lines = []
            lo, hi = max(0, r['line'] - 3), min(len(lines), r['line'] + 2)
            cands = [r['path']] if r['status'] == 'basename_only' else sorted(basenames[os.path.basename(r['target'])])
            fh.write(json.dumps({'id': f'{TAG}{r["status"][:1]}-{r["doc"]}:{r["line"]}:{r["target"]}', 'class': r['status'],
                                 'doc': r['doc'], 'line': r['line'], 'citation': f'{r["target"]}:{r["targetLine"]}',
                                 'context': '\n'.join(lines[lo:hi]), 'candidates': cands[:25],
                                 'candidates_total': len(cands)}) + '\n')

json.dump(results, open(os.path.join(OUT, 'accuracy.json'), 'w'), indent=2)
print(json.dumps(results, indent=2))
