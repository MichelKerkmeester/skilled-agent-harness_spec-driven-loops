#!/usr/bin/env python3
"""Read the operator's answers from operator-rows.md and merge them with the model labels.

Each answered row takes the operator's label; every other guessed row keeps the label the
two models agree on, or stays unsettled. Prints the settled intended share per phase with a
Wilson 95% interval, and refuses to score while any answer is still `?`.
"""
import json, math, os, re, sys
HERE = os.path.dirname(os.path.abspath(__file__))
text = open(os.path.join(HERE, 'operator-rows.md')).read()
answers = {int(r): a.strip().split()[0] for r, a in re.findall(r'## \d+\. row (\d+) [^\n]*\n\n\*\*Answer:\*\* ([^\n]*)', text)}
pending = [r for r, a in answers.items() if a == '?']
if pending:
    sys.exit(f'{len(pending)} of {len(answers)} rows still unanswered: {pending[:10]}')
bad = {r: a for r, a in answers.items() if a not in ('intended', 'not_intended', 'cant_tell')}
if bad:
    sys.exit(f'unrecognised answers: {bad}')
agree = json.load(open(os.path.join(HERE, 'agreement.json')))
rows = {r['row']: r for r in map(json.loads, open(os.path.join(HERE, 'to-label-trimmed.jsonl')))}
def parse(paths):
    out = {}
    for p in paths:
        if os.path.exists(p):
            for line in open(p):
                m = re.search(r'\{.*\}', line)
                if m:
                    try:
                        o = json.loads(m.group(0))
                    except json.JSONDecodeError:
                        continue
                    if isinstance(o.get('row'), int) and o['row'] in rows:
                        out.setdefault(o['row'], o['label'])
    return out
luna = parse([os.path.join(HERE, 'luna-labels.raw')])
deep = parse([os.path.join(HERE, 'deepseek-part1.raw')] + [os.path.join(HERE, f'deepseek-d{q}.raw') for q in range(1, 13)])
def wilson(k, n, z=1.96):
    p = k / n; d = 1 + z * z / n; c = (p + z * z / (2 * n)) / d
    h = z * math.sqrt(p * (1 - p) / n + z * z / (4 * n * n)) / d
    return [round(max(0, c - h), 4), round(min(1, c + h), 4)]
result = {}
for origin in sorted({r['origin'] for r in rows.values()}):
    ids = [r for r in rows if rows[r]['origin'] == origin]
    final = {}
    for r in ids:
        if r in answers:
            final[r] = answers[r]
        elif luna.get(r) == deep.get(r):
            final[r] = luna[r]
        else:
            final[r] = 'unsettled'
    n = len(ids); k = sum(1 for v in final.values() if v == 'intended')
    result[origin] = {'n': n, 'intended': k, 'wilson95': wilson(k, n),
                      'counts': {v: list(final.values()).count(v) for v in set(final.values())}}
json.dump({'operator_answers': len(answers), 'kappa': agree['kappa'], 'by_phase': result},
          open(os.path.join(HERE, 'operator-scored.json'), 'w'), indent=2)
print(json.dumps(result, indent=2))
