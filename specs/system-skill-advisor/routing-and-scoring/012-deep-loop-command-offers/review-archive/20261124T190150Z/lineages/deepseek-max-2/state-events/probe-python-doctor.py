import importlib.util, os, sys

root = '/Users/michelkerkmeester/worktrees/public/535-deep-loop-offers-traceability-review'
path = os.path.join(root, '.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py')
spec = importlib.util.spec_from_file_location('sa_probe2', path)
mod = importlib.util.module_from_spec(spec)
sys.modules['sa_probe2'] = mod
spec.loader.exec_module(mod)

doctor = 'command-doctor-deep-loop'
cases = [
    ('stuck-refuse-run', "the deep research run is stuck. please don't run anything", False),
    ('stuck-refuse-fix', "my deep research run is stuck and I don't want a fix", False),
    ('stuck-plain', 'my deep research run is stuck', True),
    ('stuck-typed-review', 'my deep review run is stuck, /deep:review again', None),
]
for name, prompt, expected in cases:
    kept = bool(mod._apply_deep_loop_offer_gate([{'skill': doctor}], prompt.lower()))
    flag = '' if expected is None else ('OK' if kept == expected else 'MISMATCH')
    print(f'DOCTOR {name} kept={kept} expected={expected} {flag}')

run_rows = [{'skill': s} for s in mod._DEEP_LOOP_RUN_ROWS]
for name, prompt in [
    ('typed-on-stuck', 'my deep review run is stuck, /deep:review again'),
    ('typed-control', '/deep:review the parser'),
    ('typed-two-commands', 'run /deep:review on the parser, then /create:changelog'),
    ('typed-both-loops', '/deep:review the parser then /deep:research caching'),
]:
    rows = mod._apply_deep_loop_offer_gate([dict(r) for r in run_rows], prompt.lower())
    print(f'TYPED {name} rows={[(r["skill"], r.get("typed")) for r in rows]}')
