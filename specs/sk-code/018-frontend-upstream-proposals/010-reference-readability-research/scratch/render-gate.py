"""Run validate_document.py --json over skill docs and report render_* warnings and invalid files.

Default scope: tracked .md under sk-code and sk-create-skill. --fleet: every skill, and writes fleet-render.json.
"""
import json, os, subprocess, sys
from concurrent.futures import ThreadPoolExecutor

ROOT = subprocess.run(['git', 'rev-parse', '--show-toplevel'], capture_output=True, text=True).stdout.strip()
HERE = os.path.dirname(os.path.abspath(__file__))
VALIDATOR = os.path.join(ROOT, '.skilled/skills/sk-doc/scripts/validate_document.py')
SKIP = ('/manual-testing-playbook/', '/changelog/', '/benchmark/', '/feature-catalog/')
fleet = '--fleet' in sys.argv
roots = ['.skilled/skills'] if fleet else ['.skilled/skills/sk-code', '.skilled/skills/sk-doc/sk-create-skill']
files = []
for r in roots:
    out = subprocess.run(['git', 'ls-files', '--', f'{r}/*.md', f'{r}/**/*.md'], cwd=ROOT, capture_output=True, text=True).stdout.split()
    files += [f for f in out if not any(s in '/' + f for s in SKIP) and '/node_modules/' not in f and os.path.isfile(os.path.join(ROOT, f)) and not os.path.islink(os.path.join(ROOT, f))]
files = sorted(set(files))
env = dict(os.environ, JEV_FEATURES='0')
def run(f):
    p = subprocess.run([sys.executable, '-B', VALIDATOR, f, '--json'], cwd=ROOT, capture_output=True, text=True, env=env)
    try:
        d = json.loads(p.stdout)
    except Exception:
        return f, None, []
    hits = [w for w in d.get('warnings', []) + d.get('blocking_errors', []) if str(w.get('type', w.get('rule', ''))).startswith('render_')]
    return f, d.get('valid'), hits
with ThreadPoolExecutor(8) as ex:
    results = list(ex.map(run, files))
warn = invalid = valid = unparsed = 0
report = {}
for f, ok, hits in results:
    if ok is None: unparsed += 1; continue
    if ok: valid += 1
    else: invalid += 1
    if hits:
        report[f] = hits
        for h in hits:
            warn += 1
            if not fleet:
                print(f"{f}:{h.get('line', '?')}: {h.get('type', h.get('rule'))}: {str(h.get('message', ''))[:120]}")
if fleet:
    with open(os.path.join(HERE, 'fleet-render.json'), 'w') as fh:
        json.dump({'files': len(files), 'valid': valid, 'invalid': invalid, 'render_hits': report}, fh, indent=2)
    print(f"fleet files={len(files)} valid={valid} invalid={invalid} unparsed={unparsed} render_warnings={warn}")
else:
    print(f"files={len(files)} unparsed={unparsed}")
print(f"render_warnings={warn} invalid={invalid}")
