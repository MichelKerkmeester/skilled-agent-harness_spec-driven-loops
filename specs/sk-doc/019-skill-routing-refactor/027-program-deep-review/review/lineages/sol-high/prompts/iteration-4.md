DEEP-REVIEW
Resolved route: mode=review; target_agent=@deep-review; execution=single_review_iteration; state_source=externalized_files; do_not_switch_mode=true

## GATE 3 PRE-RESOLVED
This autonomous LEAF dispatch has no human responder. Documentation scope and write authority are already bound to the state paths below. Do not ask setup questions.

## STATE SUMMARY
Iteration: 4 of 5
Dimension: maintainability
Prior Findings: P0=0 P1=2 P2=0
Dimension Coverage: correctness, security, traceability complete; 3/4
Claim Adjudication Gate: PASS.
Stop Policy: max-iterations; convergence is telemetry before iteration 5.

## TASK
Execute exactly one deep-review maintainability iteration. Audit contract ownership and duplication across pure libraries, fleet gate, generator, scaffolder/templates, doctor/advisor consumers, changed doctrine, and tests. Focus on silent failure modes, maintainable failure messages, schema drift risk, scaffold-template equivalence, and whether tests honestly protect future changes. Do not restate P1-001 or P1-002 unless new evidence changes severity or scope. Load `.opencode/skills/sk-code/code-review/references/review-core.md` before severity calls.

## STATE FILES
- Config: `.opencode/specs/sk-doc/019-skill-routing-refactor/027-program-deep-review/review/lineages/sol-high/deep-review-config.json`
- State Log: `.opencode/specs/sk-doc/019-skill-routing-refactor/027-program-deep-review/review/lineages/sol-high/deep-review-state.jsonl`
- Findings Registry: `.opencode/specs/sk-doc/019-skill-routing-refactor/027-program-deep-review/review/lineages/sol-high/deep-review-findings-registry.json`
- Strategy: `.opencode/specs/sk-doc/019-skill-routing-refactor/027-program-deep-review/review/lineages/sol-high/deep-review-strategy.md`
- Iteration narrative: `.opencode/specs/sk-doc/019-skill-routing-refactor/027-program-deep-review/review/lineages/sol-high/iterations/iteration-004.md`
- Delta: `.opencode/specs/sk-doc/019-skill-routing-refactor/027-program-deep-review/review/lineages/sol-high/deltas/iter-004.jsonl`

## REQUIRED OUTPUT
Write the narrative, update strategy in place, append exactly one canonical `type:"iteration"` state record, and create the matching delta. Include route proof, all required v1 fields, complete typed adjudication packets for every new P0/P1, and the exact final narrative line `Review verdict: PASS|CONDITIONAL|FAIL` with the concrete enum substituted.

## ALLOWED WRITE PATHS
- The iteration narrative path above
- The state log above, append only
- The delta path above
- The strategy path above, in-place updates only

## BANNED OPERATIONS
No source/spec edits, no writes outside the four allowed paths, no config/registry/dashboard/report edits, no delete/rename operations, no implementation fixes, no Task/sub-agent dispatch, and no WebFetch.
