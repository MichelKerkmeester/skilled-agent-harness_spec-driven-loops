"""Replay the sk-code advisor probe battery through the live advisor CLI.

Prints one line per probe and a final summary line:
  positives <won>/17 negatives-false-positive <sk-code wins>/5
A positive is won when sk-code is the first recommendation. A negative is a
false positive when sk-code is the first recommendation.
Run from the repository root.
"""
import json
import re
import subprocess

BATTERY = '.skilled/skills/sk-code/manual-testing-playbook/skill-advisor-integration/advisor-probe-battery.md'
rows, seen = [], set()
for line in open(BATTERY, encoding='utf-8'):
    m = re.match(r'^\| ([PN]\d+) \| ([^|]+) \| [^|]+ \| `([^`]+)`', line)
    if m and m.group(1) not in seen:
        seen.add(m.group(1))
        rows.append((m.group(1), m.group(3)))
pos = neg = npos = nneg = 0
for rid, prompt in rows:
    out = subprocess.run(
        ['node', '.skilled/bin/skill-advisor.cjs', 'advisor_recommend', '--json',
         json.dumps({'prompt': prompt}), '--format', 'json'],
        capture_output=True, text=True, stdin=subprocess.DEVNULL)
    recs = json.loads(out.stdout)['data']['recommendations']
    top = recs[0]['skillId'] if recs else 'none'
    if rid.startswith('P'):
        npos += 1
        pos += top == 'sk-code'
    else:
        nneg += 1
        neg += top == 'sk-code'
    print(f'{rid} top={top}')
print(f'positives {pos}/{npos} negatives-false-positive {neg}/{nneg}')
