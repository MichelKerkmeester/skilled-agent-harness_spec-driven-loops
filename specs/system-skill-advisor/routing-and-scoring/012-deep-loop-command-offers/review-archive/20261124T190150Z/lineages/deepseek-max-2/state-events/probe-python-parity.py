import importlib.util, json, os, sys

root = '/Users/michelkerkmeester/worktrees/public/535-deep-loop-offers-traceability-review'
path = os.path.join(root, '.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py')
spec = importlib.util.spec_from_file_location('skill_advisor_probe', path)
mod = importlib.util.module_from_spec(spec)
sys.modules['skill_advisor_probe'] = mod
spec.loader.exec_module(mod)

with open(os.path.join(root, '.skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json'), encoding='utf-8') as fh:
    cases = json.load(fh)['cases']

mismatches = 0
for case in cases:
    got = (mod.asks_for_loop_run(case['prompt']), mod.is_stuck_run_complaint(case['prompt']), mod.is_writing_about_topic(case['prompt']))
    want = (case['asksForLoopRun'], case['stuckRun'], case['writingAbout'])
    if got != want:
        mismatches += 1
        print(f"MISMATCH predicates id={case['id']} got={got} want={want} :: {case['prompt']}")
    if 'servedReviewKept' in case:
        kept = bool(mod._apply_deep_loop_offer_gate([{'skill': 'command-spec-kit-deep-review'}], case['prompt'].lower()))
        if kept != case['servedReviewKept']:
            mismatches += 1
            print(f"MISMATCH servedReviewKept id={case['id']} got={kept} want={case['servedReviewKept']} :: {case['prompt']}")
    if 'typedRunsKept' in case:
        kept_rows = mod._apply_deep_loop_offer_gate([{'skill': s} for s in mod._DEEP_LOOP_RUN_ROWS], case['prompt'].lower())
        kept_runs = sorted(mod._DEEP_LOOP_RUN_ROWS[row['skill']] + ('' if row.get('typed') is True else ' (unmarked)') for row in kept_rows)
        if kept_runs != sorted(case['typedRunsKept']):
            mismatches += 1
            print(f"MISMATCH typedRunsKept id={case['id']} got={kept_runs} want={sorted(case['typedRunsKept'])} :: {case['prompt']}")

print(f"cases={len(cases)} mismatches={mismatches}")
