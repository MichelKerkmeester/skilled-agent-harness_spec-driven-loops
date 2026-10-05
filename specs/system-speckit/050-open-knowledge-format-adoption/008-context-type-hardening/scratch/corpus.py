"""Corpus false alarms for both warnings, protocol v1 section 3."""
import json, os, subprocess, sys, time
P = 'specs/system-speckit/050-open-knowledge-format-adoption/008-context-type-hardening'
files = [f for f in subprocess.run(['git', 'ls-files', '-z', '--', 'specs', '.skilled/skills'], capture_output=True, text=True).stdout.split('\0')
         if f.endswith('.md') and '/z_archive/' not in f and os.path.isfile(f)]
untracked = [f for f in subprocess.run(['git', 'ls-files', '-z', '--others', '--exclude-standard', '--', 'specs', '.skilled/skills'], capture_output=True, text=True).stdout.split('\0')
             if f.endswith('.md') and '/z_archive/' not in f and os.path.isfile(f)]
allf = sorted(set(files + untracked))
withfm = [f for f in allf if open(f, encoding='utf-8', errors='replace').read(4).lstrip('﻿').startswith('---')]
t = time.time()
w1 = []
HELPER = '.skilled/skills/system-spec-kit/runtime/cli/rules/check-frontmatter-values-helper.cjs'
for i in range(0, len(withfm), 400):
    r = subprocess.run(['node', HELPER] + withfm[i:i + 400], capture_output=True, text=True)
    assert r.returncode == 0, r.stderr
    w1 += [l.split('\t') for l in r.stdout.splitlines() if l.startswith('WARN\t')]
t1 = time.time() - t
sys.path.insert(0, '.skilled/skills/sk-doc/shared/scripts')
import validate_document as vd
vals = vd._load_frontmatter_values()
t = time.time(); w2 = []
for f in withfm:
    for w in vd.validate_frontmatter_values(open(f, encoding='utf-8', errors='replace').read(), vals):
        w2.append([f, w['message']])
t2 = time.time() - t
res = dict(protocol='v1', docs_scanned=len(withfm), tracked=len(files), untracked=len(untracked), w1_warnings=len(w1), w2_warnings=len(w2),
           w1_seconds=round(t1, 1), w2_seconds=round(t2, 1), w1=w1, w2=w2)
json.dump(res, open(P + '/scratch/corpus-result.json', 'w'), indent=1)
print({k: res[k] for k in ('docs_scanned', 'tracked', 'untracked', 'w1_warnings', 'w2_warnings', 'w1_seconds', 'w2_seconds')})
for x in (w1 + w2)[:20]: print(x)
