"""Replay the sk-code advisor probe battery through the live advisor CLI.

Prints one line per probe and a final summary line:
  positives <won>/17 negatives-false-positive <sk-code wins>/5
A positive is won when sk-code is the first recommendation. A negative is a
false positive when sk-code is the first recommendation.
Run from the repository root.

A degraded run fails instead of scoring: a probe whose CLI envelope is not
status "ok" with live or stale freshness, a non-native scorer row in --via
python mode, or a non-zero advisor exit is reported on stderr and exits 1.
"""
import argparse
import json
import re
import subprocess
import sys

BATTERY = '.skilled/skills/sk-code/manual-testing-playbook/skill-advisor-integration/advisor-probe-battery.md'
CLI_ADVISOR = ['node', '.skilled/bin/skill-advisor.cjs', 'advisor_recommend', '--json']
PY_ADVISOR = ['.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py']


def probe_cli(prompt):
    """Return (top, problem); problem is None only for a trustworthy envelope."""
    out = subprocess.run(
        CLI_ADVISOR + [json.dumps({'prompt': prompt}), '--format', 'json'],
        capture_output=True, text=True, stdin=subprocess.DEVNULL)
    if out.returncode != 0:
        return None, f'exit {out.returncode}: {(out.stderr or out.stdout).strip()}'
    try:
        payload = json.loads(out.stdout)
    except json.JSONDecodeError:
        return None, f'unparseable JSON: {out.stdout.strip()[:200]}'
    data = payload.get('data') or {}
    if payload.get('status') != 'ok' or data.get('freshness') not in ('live', 'stale'):
        return None, f"status={payload.get('status')} freshness={data.get('freshness')}"
    recs = data.get('recommendations') or []
    return (recs[0]['skillId'] if recs else 'none'), None


def probe_python(prompt):
    """Return (top, problem); problem flags any row the native scorer did not produce."""
    out = subprocess.run(
        ['python3'] + PY_ADVISOR + [prompt, '--threshold', '0.8', '--force-native'],
        capture_output=True, text=True, stdin=subprocess.DEVNULL)
    if out.returncode != 0:
        return None, f'exit {out.returncode}: {(out.stderr or out.stdout).strip()}'
    try:
        rows = json.loads(out.stdout)
    except json.JSONDecodeError:
        return None, f'unparseable JSON: {out.stdout.strip()[:200]}'
    if not isinstance(rows, list):
        return None, f'unexpected payload: {out.stdout.strip()[:200]}'
    foreign = [row for row in rows if row.get('source') != 'native']
    if foreign:
        pairs = ', '.join(f"{row.get('skill')}={row.get('source')}" for row in foreign)
        return None, f'non-native source(s): {pairs}'
    return (rows[0]['skill'] if rows else 'none'), None


parser = argparse.ArgumentParser(description='Replay the sk-code advisor probe battery.')
parser.add_argument('--via', choices=['python'], default='cli',
                    help='Score through skill_advisor.py --force-native instead of the daemon CLI.')
args = parser.parse_args()
probe = probe_python if args.via == 'python' else probe_cli
rows, seen = [], set()
for line in open(BATTERY, encoding='utf-8'):
    m = re.match(r'^\| ([PN]\d+) \| ([^|]+) \| [^|]+ \| `([^`]+)`', line)
    if m and m.group(1) not in seen:
        seen.add(m.group(1))
        rows.append((m.group(1), m.group(3)))
pos = neg = npos = nneg = failures = 0
for rid, prompt in rows:
    top, problem = probe(prompt)
    if problem is not None:
        print(f'{rid} failed: {problem}', file=sys.stderr)
        failures += 1
        continue
    if rid.startswith('P'):
        npos += 1
        pos += top == 'sk-code'
    else:
        nneg += 1
        neg += top == 'sk-code'
    print(f'{rid} top={top}')
if failures:
    print(f'degraded run: {failures} probe(s) failed; refusing to score', file=sys.stderr)
    sys.exit(1)
print(f'positives {pos}/{npos} negatives-false-positive {neg}/{nneg}')
