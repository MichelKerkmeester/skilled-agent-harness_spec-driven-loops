#!/usr/bin/env python3
"""Extract each matrix run's final message into reports/<cli>-<id>.md and print a verdict table.

Usage: extract.py <out-dir> <evidence-dir>
"""
import csv, json, os, re, sys

out_dir, ev = sys.argv[1], sys.argv[2]
ledger = os.path.join(ev, 'ledger.tsv')
reports = os.path.join(ev, 'reports')
os.makedirs(reports, exist_ok=True)
home = os.path.expanduser('~')
ansi = re.compile(r'\x1b\[[0-9;?]*[A-Za-z]')

rows = {}
if os.path.exists(ledger):
    for r in csv.reader(open(ledger), delimiter='\t'):
        if len(r) >= 6 and r[1] != 'probe':
            rows[(r[0], r[1])] = r  # a rerun overwrites the earlier row


def final_text(cli, rid):
    base = os.path.join(out_dir, f'{cli}-{rid}')
    if cli == 'codex' and os.path.exists(base + '.last'):
        return open(base + '.last', errors='replace').read()
    if not os.path.exists(base + '.out'):
        return ''
    raw = open(base + '.out', errors='replace').read()
    if cli == 'opencode':
        parts = []
        for line in raw.splitlines():
            try:
                o = json.loads(line)
            except ValueError:
                continue
            if o.get('type') == 'text':
                parts.append(o.get('part', {}).get('text', ''))
        return '\n'.join(parts)
    return raw


table = []
for (cli, rid), r in sorted(rows.items(), key=lambda kv: (kv[0][1], kv[0][0])):
    text = ansi.sub('', final_text(cli, rid)).replace(home, '~')
    head = f'<!-- dispatch: {cli} {rid}; ledger: {r[2]} {r[3]} {r[4]} {r[5]} -->\n\n'
    with open(os.path.join(reports, f'{cli}-{rid}.md'), 'w') as fh:
        fh.write(head + text.strip() + '\n')
    # A tester may bold the verdict after the colon, as in "RESULT: **PASS**".
    results = re.findall(r'RESULT:\s*\**\s*(PASS|FAIL|SKIP|BLOCKED)\b', text)
    verdict = results[-1] if results else 'NO-REPORT'
    native = re.findall(r'NATIVE:\**\s*([^\n]*)', text)
    table.append((rid, cli, verdict, r[4], r[5], (native[-1] if native else '-')[:70]))

for t in table:
    print('\t'.join(str(x) for x in t))
counts = {}
for t in table:
    counts[t[2]] = counts.get(t[2], 0) + 1
print('TOTAL', len(table), counts)
