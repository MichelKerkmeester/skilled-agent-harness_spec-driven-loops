"""Render warnings and validity for the files in a scope list.

A file the render ledger's `exempt` map lists, with a consumer file that still
exists, is skipped: code depends on its exact text, so the render canon does not apply.
"""
import json, os, subprocess, sys
files = [l.strip() for l in open(sys.argv[1]) if l.strip()]
SKILLS = '.skilled/skills/'
try:
    ledger = json.load(open(SKILLS + 'sk-doc/sk-create-skill/scripts/render-known-debt.json'))
except (OSError, ValueError):
    ledger = {}
exempt = {doc for doc, e in (ledger.get('exempt') or {}).items()
          if isinstance(e, dict) and set(e) == {'consumer', 'reason'} and str(e.get('reason', '')).strip()
          and not os.path.isabs(str(e['consumer']))
          and os.path.realpath(SKILLS + str(e['consumer'])).startswith(os.path.realpath(SKILLS) + os.sep)
          and os.path.isfile(SKILLS + str(e['consumer']))}
env = dict(os.environ, JEV_FEATURES='0'); warn = invalid = skipped = 0
for f in files:
    if not os.path.isfile(f): continue
    if f.startswith(SKILLS) and f[len(SKILLS):] in exempt:
        skipped += 1; print(f'EXEMPT {f}'); continue
    d = json.loads(subprocess.run([sys.executable, '-B', '.skilled/skills/sk-doc/scripts/validate_document.py', f, '--json'], capture_output=True, text=True, env=env).stdout or '{}')
    if not d.get('valid', False): invalid += 1; print(f'INVALID {f}: {[e.get("message","")[:80] for e in d.get("blocking_errors", [])][:2]}')
    for w in d.get('warnings', []):
        if str(w.get('type', '')).startswith('render_'):
            warn += 1; print(f"{f}:{w.get('line','?')}: {w['type']}: {w.get('message','')[:110]}")
print(f'files={len(files)} render_warnings={warn} invalid={invalid}' + (f' exempt={skipped}' if skipped else ''))
