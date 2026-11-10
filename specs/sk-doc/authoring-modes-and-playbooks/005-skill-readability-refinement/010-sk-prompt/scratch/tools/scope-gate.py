"""Render warnings and validity for the files in a scope list.

A file the render ledger's `exempt` map lists is skipped when the shared loader
accepts its entry: code depends on its exact text, so the render canon does not apply.
A code packaging stages as advisory is counted apart unless RENDER_STAGED_OFF=1
enforces it. Packaging also stages whole scopes (SKILL.md, ROUTER.md, shared and
runtime references); this gate does not, so an enforced code counts in every file.
"""
import json, os, subprocess, sys
files = [l.strip() for l in open(sys.argv[1]) if l.strip()]
SKILLS = '.skilled/skills/'
sys.path.insert(0, SKILLS + 'sk-doc/shared/scripts')
import render_exempt
exempt = set(render_exempt.load_exempt())
import ast, re
_pk = open(SKILLS + 'sk-doc/sk-create-skill/scripts/package_skill.py').read()
_m = re.search(r'^RENDER_STAGED_CODES = (\([^)]*\))', _pk, re.M)
staged = set(ast.literal_eval(_m.group(1))) if _m and os.environ.get('RENDER_STAGED_OFF') != '1' else set()
env = dict(os.environ, JEV_FEATURES='0'); warn = invalid = skipped = advisory = 0
for f in files:
    if not os.path.isfile(f): continue
    if f.startswith(SKILLS) and f[len(SKILLS):] in exempt:
        skipped += 1; print(f'EXEMPT {f}'); continue
    d = json.loads(subprocess.run([sys.executable, '-B', '.skilled/skills/sk-doc/scripts/validate_document.py', f, '--json'], capture_output=True, text=True, env=env).stdout or '{}')
    if not d.get('valid', False): invalid += 1; print(f'INVALID {f}: {[e.get("message","")[:80] for e in d.get("blocking_errors", [])][:2]}')
    for w in d.get('warnings', []):
        if str(w.get('type', '')) in staged:
            advisory += 1
        elif str(w.get('type', '')).startswith('render_'):
            warn += 1; print(f"{f}:{w.get('line','?')}: {w['type']}: {w.get('message','')[:110]}")
print(f'files={len(files)} render_warnings={warn} invalid={invalid}' + (f' exempt={skipped}' if skipped else '') + (f' advisory={advisory}' if advisory else ''))
