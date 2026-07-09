# RCAF DEEP REVIEW — ITERATION 5 — sk-doc deep-dive

## ROLE
Expert reviewer. Concise findings with file:line evidence.

## CONTEXT
Iter 5 of 10. Cumulative F-001..F-024 (do NOT re-report). Status: 0 P0 / 12 P1 / 10 P2.

## ACTION

**Focus**: sk-doc compliance deep-dive + feature catalog accuracy.

**Step 1: SKILL.md + README.md DQI re-validate (verify post-conformance state)**
- Read `.opencode/skills/deep-loop-runtime/SKILL.md` (claimed DQI 95). Run `python3 .opencode/skills/sk-doc/scripts/validate_document.py` on it. Run `python3 .opencode/skills/sk-doc/scripts/extract_structure.py` for DQI breakdown. Verify still valid + DQI ≥ 80.
- Same for `.opencode/skills/deep-loop-runtime/README.md` (claimed DQI 98).
- Same for `.opencode/skills/deep-loop-runtime/changelog/v1.0.0.md` (claimed DQI 75).
Flag P1 for VALID→INVALID regressions; P2 for DQI score drops below threshold.

**Step 2: feature_catalog/ accuracy check**
- Read `.opencode/skills/deep-loop-runtime/feature_catalog/feature_catalog.md` (the top-level catalog).
- For each of 17 features, verify the per-feature file under `feature_catalog/0[1-7]--<category>/` actually exists and matches its catalog entry.
- For each feature file: does §Source Files cite real, current file paths in deep-loop-runtime/lib/ or /scripts/?
- Cross-check the category structure (7 categories) — are they balanced + complete? Any feature mis-categorized?
Cite file:line for drift. P1 for missing files / wrong paths; P2 for category drift.

**Step 3: manual_testing_playbook/ scenario quality**
- Read `.opencode/skills/deep-loop-runtime/manual_testing_playbook/manual_testing_playbook.md`.
- For each of 17 per-feature scenarios under `manual_testing_playbook/0[1-7]--<category>/`:
  - Does it have the canonical 5-section structure (OVERVIEW / SCENARIO CONTRACT / TEST EXECUTION / SOURCE ANCHORS / SOURCE_METADATA per the 116/008 template)?
  - Is the test executable by a human operator (concrete commands, expected outcomes)?
  - Does SOURCE_METADATA cite the right code file?
Cite file:line. P1 for unusable scenarios; P2 for missing sections.

**Step 4: references/ documentation depth**
- Read each of:
  - `.opencode/skills/deep-loop-runtime/references/script_interface_contract.md`
  - `.opencode/skills/deep-loop-runtime/references/coverage_graph_schema.md`
  - `.opencode/skills/deep-loop-runtime/references/state_format.md`
  - `.opencode/skills/deep-loop-runtime/references/integration_points.md`
- For each: is the content accurate to what the code actually does? Or does it describe an idealized contract that the code doesn't fully implement?
Cite file:line. P1 for inaccurate descriptions; P2 for missing detail.

**Step 5: Write findings (F-025+) + delta JSONL**

`.opencode/specs/.../review/iterations/iteration-005.md`:
```markdown
# Iteration 5 — sk-doc Deep-Dive

## Summary
...
## Findings
### P0
### P1
### P2
## Convergence Signal
- newFindings: <N>
- Cumulative: P0=0 P1=<sum> P2=<sum>
```

`.opencode/specs/.../review/deltas/iter-005.jsonl`:
```jsonl
{"iter":5,"finding_id":"F-025","severity":"P1","dimension":"sk-doc","file":"<path>","line":<N>,"title":"<short>","evidence":"<quote>","fix":"<recommendation>"}
```

DELTA JSONL IS REQUIRED — do not skip.

After writing both, print:
`ITER-5 DONE: <P0>/<P1>/<P2>, dimensions=sk-doc-deep-dive`
