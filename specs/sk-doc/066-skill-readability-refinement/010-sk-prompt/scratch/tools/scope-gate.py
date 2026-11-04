"""Render warnings and validity for the files in a scope list."""
import json, os, subprocess, sys
files = [l.strip() for l in open(sys.argv[1]) if l.strip()]
env = dict(os.environ, JEV_FEATURES='0'); warn = invalid = 0
for f in files:
    if not os.path.isfile(f): continue
    d = json.loads(subprocess.run([sys.executable, '-B', '.skilled/skills/sk-doc/scripts/validate_document.py', f, '--json'], capture_output=True, text=True, env=env).stdout or '{}')
    if not d.get('valid', False): invalid += 1; print(f'INVALID {f}: {[e.get("message","")[:80] for e in d.get("blocking_errors", [])][:2]}')
    for w in d.get('warnings', []):
        if str(w.get('type', '')).startswith('render_'):
            warn += 1; print(f"{f}:{w.get('line','?')}: {w['type']}: {w.get('message','')[:110]}")
print(f'files={len(files)} render_warnings={warn} invalid={invalid}')
