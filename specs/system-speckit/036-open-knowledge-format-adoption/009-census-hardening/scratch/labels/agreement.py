#!/usr/bin/env python3
"""Cohen's kappa between the two model labelers and the disputed rows for the operator.

Reads to-label-trimmed.jsonl, luna-labels.raw and deepseek-part{1,2,3}.raw beside it.
A row a labeler did not return, or returned unparsable, counts as unlabeled and is left
out of kappa. Disputed order follows the census protocol section 4: intended against
not_intended first, then rows where one labeler says cant_tell; the cap is 20, or 40
when kappa falls below 0.6. Writes agreement.json and operator-rows.md.
"""
import json, math, os, re
from collections import Counter

HERE = os.path.dirname(os.path.abspath(__file__))
LABELS = ('intended', 'not_intended', 'cant_tell')
rows = {r['row']: r for r in map(json.loads, open(os.path.join(HERE, 'to-label-trimmed.jsonl')))}

def parse(paths):
    out = {}
    for p in paths:
        if not os.path.exists(p):
            continue
        for line in open(p):
            m = re.search(r'\{.*\}', line)
            if not m:
                continue
            try:
                o = json.loads(m.group(0))
            except json.JSONDecodeError:
                continue
            if isinstance(o.get('row'), int) and o.get('label') in LABELS and o['row'] in rows:
                out.setdefault(o['row'], o)
    return out

luna = parse([os.path.join(HERE, 'luna-labels.raw')])
deep = parse([os.path.join(HERE, f'deepseek-part{b}.raw') for b in (1, 2, 3)]
             + [os.path.join(HERE, f'deepseek-d{q}.raw') for q in range(1, 13)])
both = sorted(set(luna) & set(deep))

def kappa(pairs):
    n = len(pairs)
    if n == 0:
        return None
    po = sum(1 for a, b in pairs if a == b) / n
    ca, cb = Counter(a for a, _ in pairs), Counter(b for _, b in pairs)
    pe = sum(ca[k] * cb[k] for k in LABELS) / (n * n)
    return round((po - pe) / (1 - pe), 4) if pe < 1 else 1.0

pairs = [(luna[r]['label'], deep[r]['label']) for r in both]
k = kappa(pairs)
by_origin = {}
for origin in sorted({rows[r]['origin'] for r in rows}):
    sub = [(luna[r]['label'], deep[r]['label']) for r in both if rows[r]['origin'] == origin]
    by_origin[origin] = {'n': len(sub), 'kappa': kappa(sub), 'agree': sum(1 for a, b in sub if a == b)}

hard = [r for r in both if {luna[r]['label'], deep[r]['label']} == {'intended', 'not_intended'}]
soft = [r for r in both if luna[r]['label'] != deep[r]['label'] and r not in hard]
# Rows where both say intended but pick different ambiguous candidates are a dispute too.
pick = [r for r in both if luna[r]['label'] == deep[r]['label'] == 'intended'
        and rows[r]['class'] == 'ambiguous' and (luna[r].get('pick') or '') != (deep[r].get('pick') or '')]
cap = 40 if (k is not None and k < 0.6) else 20
disputed = (hard + soft + pick)[:cap]

result = {
    'rows': len(rows), 'luna_labeled': len(luna), 'deepseek_labeled': len(deep), 'both_labeled': len(both),
    'kappa': k, 'observed_agreement': round(sum(1 for a, b in pairs if a == b) / len(pairs), 4) if pairs else None,
    'confusion': {f'{a}|{b}': c for (a, b), c in sorted(Counter(pairs).items())},
    'by_origin': by_origin, 'hard_disputes': len(hard), 'soft_disputes': len(soft), 'pick_disputes': len(pick),
    'cap': cap, 'operator_rows': disputed,
    'luna_counts': dict(Counter(luna[r]['label'] for r in luna)),
    'deepseek_counts': dict(Counter(deep[r]['label'] for r in deep)),
}
json.dump(result, open(os.path.join(HERE, 'agreement.json'), 'w'), indent=2)

with open(os.path.join(HERE, 'operator-rows.md'), 'w') as fh:
    fh.write('# Guessed citations for operator labels\n\n')
    fh.write('For each row, answer intended, not intended or can\'t tell: is a candidate the file the author meant?\n\n')
    for n, r in enumerate(disputed, 1):
        row = rows[r]
        fh.write(f'## {n}. row {r} ({row["class"]}, {row["origin"].rstrip("-")})\n\n')
        fh.write(f'- Doc: `{row["doc"]}:{row["line"]}`\n- Citation: `{row["citation"]}`\n')
        fh.write(f'- Luna: {luna[r]["label"]} {luna[r].get("pick") or ""}\n- DeepSeek: {deep[r]["label"]} {deep[r].get("pick") or ""}\n')
        cands = row['candidates'][:8]
        more = row['candidates_total'] - len(cands)
        fh.write('- Candidates: ' + ', '.join(f'`{c}`' for c in cands) + (f' and {more} more' if more > 0 else '') + '\n\n')
        fh.write('```text\n' + row['context'][:1500] + '\n```\n\n')
print(json.dumps({k2: v for k2, v in result.items() if k2 != 'operator_rows'}, indent=2))
