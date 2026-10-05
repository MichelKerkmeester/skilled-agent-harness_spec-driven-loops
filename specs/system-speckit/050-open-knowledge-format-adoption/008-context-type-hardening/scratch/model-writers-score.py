#!/usr/bin/env python3
"""Score the model-writer docs against the shared frontmatter value list.

For each doc: the value of contextType and importance_tier read from its leading
frontmatter, after unwrapping one surrounding ```markdown fence if present, and
whether the W1 helper warns on the raw file as written. Off-list rates per model
and key carry a Wilson 95% interval. A missing or empty doc counts as missing.
"""
import json, math, os, re, subprocess, sys

ROOT = sys.argv[1]  # repository root
HERE = os.path.dirname(os.path.abspath(__file__))
DOCS = os.path.join(HERE, 'model-writers')
HELPER = os.path.join(ROOT, '.skilled/skills/system-spec-kit/runtime/cli/rules/check-frontmatter-values-helper.cjs')
VALUES = json.load(open(os.path.join(ROOT, '.skilled/skills/system-spec-kit/shared/frontmatter-values.json')))
ACCEPTED = {
    'contextType': set(VALUES['contextType']['document']['canonical']) | set(VALUES['contextType']['document']['aliases']),
    'importance_tier': set(VALUES['importanceTier']['canonical']) | set(VALUES['importanceTier']['aliases']),
}

def wilson(k, n, z=1.96):
    if n == 0:
        return None
    p = k / n
    d = 1 + z * z / n
    c = (p + z * z / (2 * n)) / d
    h = z * math.sqrt(p * (1 - p) / n + z * z / (4 * n * n)) / d
    return [round(max(0.0, c - h), 4), round(min(1.0, c + h), 4)]

def unwrap(text):
    lines = text.strip('\n').split('\n')
    if len(lines) >= 2 and re.match(r'^\s*```', lines[0]) and re.match(r'^\s*```\s*$', lines[-1]):
        return '\n'.join(lines[1:-1]) + '\n', True
    return text, False

def values(text):
    m = re.match(r'^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)', text)
    out = {}
    if not m:
        return out
    for line in m.group(1).split('\n'):
        f = re.match(r'^(contextType|importance_tier):\s*(.*?)\s*$', line)
        if f:
            out[f.group(1)] = re.sub(r'^(["\'])(.*)\1$', r'\2', f.group(2)).strip().lower()
    return out

rows = []
for model in ('deepseek', 'luna', 'swe'):
    for n in range(1, 11):
        path = os.path.join(DOCS, model, f'{n:02d}.md')
        raw = open(path).read() if os.path.exists(path) else ''
        if raw.strip() == '':
            rows.append({'model': model, 'n': n, 'missing': True})
            continue
        body, fenced = unwrap(raw)
        vals = values(body)
        w1 = subprocess.run(['node', HELPER, path], capture_output=True, text=True)
        rows.append({
            'model': model, 'n': n, 'missing': False, 'fenced': fenced,
            'contextType': vals.get('contextType'), 'importance_tier': vals.get('importance_tier'),
            'w1_raw_warnings': [l for l in w1.stdout.splitlines() if l.startswith('WARN')],
        })

summary = {}
for model in ('deepseek', 'luna', 'swe'):
    present = [r for r in rows if r['model'] == model and not r['missing']]
    entry = {'docs': 10, 'present': len(present), 'missing': 10 - len(present),
             'fenced': sum(1 for r in present if r['fenced']),
             'w1_raw_warned_docs': sum(1 for r in present if r['w1_raw_warnings'])}
    for key in ('contextType', 'importance_tier'):
        absent = sum(1 for r in present if r[key] is None)
        off = [r[key] for r in present if r[key] is not None and r[key] not in ACCEPTED[key]]
        entry[key] = {'off_list': len(off), 'key_absent': absent, 'n': len(present),
                      'rate': round(len(off) / len(present), 4) if present else None,
                      'wilson95': wilson(len(off), len(present)),
                      'values': sorted({r[key] for r in present if r[key] is not None}),
                      'off_values': sorted(set(off))}
    summary[model] = entry

json.dump({'protocol': 'v1', 'rows': rows, 'summary': summary}, open(os.path.join(HERE, 'model-writers-result.json'), 'w'), indent=2)
print(json.dumps(summary, indent=2))
