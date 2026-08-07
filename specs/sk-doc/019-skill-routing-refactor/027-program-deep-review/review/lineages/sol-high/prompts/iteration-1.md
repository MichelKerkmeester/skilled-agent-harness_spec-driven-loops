DEEP-REVIEW
Resolved route: mode=review; target_agent=@deep-review; execution=single_review_iteration; state_source=externalized_files; do_not_switch_mode=true

## GATE 3 PRE-RESOLVED
This autonomous LEAF dispatch has no human responder. Documentation scope and write authority are already bound to the state paths below. Do not ask setup questions.

## STATE SUMMARY
Iteration: 1 of 5
Dimension: correctness
Prior Findings: P0=0 P1=0 P2=0
Dimension Coverage: 0/4
Stop Policy: max-iterations; convergence is telemetry before iteration 5.
Resource Map Coverage: resource-map.md not present; skipping coverage gate.

## TASK
Execute exactly one deep-review iteration. Review the program correctness claims and implementation invariants named in the target `spec.md`, prioritizing the H/S classifier, command-metadata schema, fleet gate, manifest generation/freshness, scaffolder, and watcher state transitions. Use commit range `2fa9fc480c..a39e6ea716` only to identify in-scope program changes. Load `.opencode/skills/sk-code/code-review/references/review-core.md` before severity calls.

## STATE FILES
- Config: `.opencode/specs/sk-doc/019-skill-routing-refactor/027-program-deep-review/review/lineages/sol-high/deep-review-config.json`
- State Log: `.opencode/specs/sk-doc/019-skill-routing-refactor/027-program-deep-review/review/lineages/sol-high/deep-review-state.jsonl`
- Findings Registry: `.opencode/specs/sk-doc/019-skill-routing-refactor/027-program-deep-review/review/lineages/sol-high/deep-review-findings-registry.json`
- Strategy: `.opencode/specs/sk-doc/019-skill-routing-refactor/027-program-deep-review/review/lineages/sol-high/deep-review-strategy.md`
- Iteration narrative: `.opencode/specs/sk-doc/019-skill-routing-refactor/027-program-deep-review/review/lineages/sol-high/iterations/iteration-001.md`
- Delta: `.opencode/specs/sk-doc/019-skill-routing-refactor/027-program-deep-review/review/lineages/sol-high/deltas/iter-001.jsonl`

## REQUIRED OUTPUT
Write the narrative, update strategy in place, append exactly one canonical `type:"iteration"` state record, and create the matching delta. Include route proof, all required v1 fields, typed adjudication packets for every P0/P1, and the exact final narrative line `Review verdict: PASS|CONDITIONAL|FAIL` with the concrete enum substituted.

## ALLOWED WRITE PATHS
- The iteration narrative path above
- The state log above, append only
- The delta path above
- The strategy path above, in-place updates only

## BANNED OPERATIONS
No source/spec edits, no writes outside the four allowed paths, no config/registry/dashboard/report edits, no delete/rename operations, no implementation fixes, no Task/sub-agent dispatch, and no WebFetch.
