#!/usr/bin/env python3
"""Settle the 40 disputed guessed rows by the three-model panel and score the guessed class.

Each panel model's answers are read from panel/<model>-b*.out. Two or three matching labels
settle a row; an `intended` majority on an ambiguous row also needs a matching path. Every
other guessed row keeps the label Luna and DeepSeek agree on, or stays unsettled. Prints the
intended share per phase over settled rows (the decision record's figure) and over all rows
(score-operator.py's figure), each with a Wilson 95% interval, plus pairwise panel agreement.
"""
import glob, json, math, os, re
from collections import Counter

HERE = os.path.dirname(os.path.abspath(__file__))
PANEL = os.path.join(HERE, 'panel')
MODELS = ('swe', 'glm', 'gemini')
LABELS = ('intended', 'not_intended', 'cant_tell')

disputed = {r['row']: r for r in json.load(open(os.path.join(PANEL, 'rows.json')))}
rows = {r['row']: r for r in map(json.loads, open(os.path.join(HERE, 'to-label-trimmed.jsonl')))}


def parse(paths, keep):
    out = {}
    for p in paths:
        if not os.path.exists(p):
            continue
        for line in open(p, errors='replace'):
            m = re.search(r'\{[^{}]*\}', line)
            if not m:
                continue
            try:
                o = json.loads(m.group(0))
            except json.JSONDecodeError:
                continue
            if isinstance(o.get('row'), int) and o['row'] in keep and o.get('label') in LABELS:
                out.setdefault(o['row'], (o['label'], (o.get('path') or '').strip()))
    return out


votes = {m: parse(sorted(glob.glob(os.path.join(PANEL, f'{m}-b*.out'))), disputed) for m in MODELS}


def settle(row):
    cast = [votes[m][row] for m in MODELS if row in votes[m]]
    label, n = Counter(l for l, _ in cast).most_common(1)[0] if cast else (None, 0)
    if n < 2:
        return 'unsettled', None
    if label == 'intended' and disputed[row]['kind'] == 'ambiguous':
        path, k = Counter(p for l, p in cast if l == 'intended').most_common(1)[0]
        if k < 2 or not path:
            return 'unsettled', None
        return label, path
    return label, None


verdict = {r: settle(r) for r in disputed}

luna = parse([os.path.join(HERE, 'luna-labels.raw')], rows)
deep = parse([os.path.join(HERE, 'deepseek-part1.raw')]
             + [os.path.join(HERE, f'deepseek-d{q}.raw') for q in range(1, 13)], rows)


def wilson(k, n, z=1.96):
    if n == 0:
        return None
    p = k / n; d = 1 + z * z / n; c = (p + z * z / (2 * n)) / d
    h = z * math.sqrt(p * (1 - p) / n + z * z / (4 * n * n)) / d
    return [round(max(0, c - h), 4), round(min(1, c + h), 4)]


by_phase = {}
for origin in sorted({r['origin'] for r in rows.values()}):
    ids = [r for r in rows if rows[r]['origin'] == origin]
    final = {}
    for r in ids:
        if r in verdict:
            final[r] = verdict[r][0]
        elif r in luna and r in deep and luna[r][0] == deep[r][0]:
            final[r] = luna[r][0]
        else:
            final[r] = 'unsettled'
    settled = [v for v in final.values() if v != 'unsettled']
    k = sum(1 for v in final.values() if v == 'intended')
    by_phase[origin] = {
        'n': len(ids), 'settled': len(settled), 'unsettled': len(ids) - len(settled), 'intended': k,
        'intended_share_settled': round(k / len(settled), 4) if settled else None,
        'wilson95_settled': wilson(k, len(settled)),
        'intended_share_all': round(k / len(ids), 4), 'wilson95_all': wilson(k, len(ids)),
        'counts': dict(Counter(final.values())),
    }

pairs = {}
for i, a in enumerate(MODELS):
    for b in MODELS[i + 1:]:
        both = [r for r in disputed if r in votes[a] and r in votes[b]]
        pairs[f'{a}-{b}'] = {'both': len(both), 'agree': sum(votes[a][r][0] == votes[b][r][0] for r in both)}

out = {
    'votes_cast': {m: len(votes[m]) for m in MODELS},
    'disputed_rows': len(disputed),
    'verdict_counts': dict(Counter(v[0] for v in verdict.values())),
    'pairwise_agreement': pairs,
    'by_phase': by_phase,
    'verdicts': {str(r): {'label': v[0], 'path': v[1],
                          'votes': {m: votes[m].get(r, (None, ''))[0] for m in MODELS}} for r, v in sorted(verdict.items())},
}
json.dump(out, open(os.path.join(PANEL, 'panel-scored.json'), 'w'), indent=2)
print(json.dumps({k: out[k] for k in ('votes_cast', 'verdict_counts', 'pairwise_agreement', 'by_phase')}, indent=2))
