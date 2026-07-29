DEEP-REVIEW
Resolved route: mode=review; target_agent=@deep-review; execution=single_review_iteration; state_source=externalized_files; do_not_switch_mode=true

## GATE 3 PRE-RESOLVED
This autonomous LEAF dispatch has no human responder. Documentation scope and write authority are already bound to the state paths below. Do not ask setup questions.

## STATE SUMMARY
Iteration: 3 of 5
Dimension: traceability
Prior Findings: P0=0 P1=1 P2=0
Dimension Coverage: correctness and security complete; 2/4
Claim Adjudication Gate: PASS after iteration 2 re-adjudicated P1-001.
Stop Policy: max-iterations; convergence is telemetry before iteration 5.

## TASK
Execute exactly one deep-review traceability iteration. Compare `spec.md:51-60` against the seven root `command-metadata.json` files, template/scaffolder outputs, doctor and advisor consumers, changed doctrine, tests, `.github/workflows/routing-registry-drift.yml`, and `.opencode/scripts/git-hooks/pre-push`. Execute `spec_code`; keep `checklist_evidence` explicitly notApplicable because no checklist exists. Audit applicable `feature_catalog_code` and `playbook_capability` overlays. Confirm whether the active P1 is represented honestly in doctrine or remains implementation-only. Load `.opencode/skills/sk-code/code-review/references/review-core.md` before severity calls.

## STATE FILES
- Config: `.opencode/specs/sk-doc/019-skill-routing-refactor/027-program-deep-review/review/lineages/sol-high/deep-review-config.json`
- State Log: `.opencode/specs/sk-doc/019-skill-routing-refactor/027-program-deep-review/review/lineages/sol-high/deep-review-state.jsonl`
- Findings Registry: `.opencode/specs/sk-doc/019-skill-routing-refactor/027-program-deep-review/review/lineages/sol-high/deep-review-findings-registry.json`
- Strategy: `.opencode/specs/sk-doc/019-skill-routing-refactor/027-program-deep-review/review/lineages/sol-high/deep-review-strategy.md`
- Iteration narrative: `.opencode/specs/sk-doc/019-skill-routing-refactor/027-program-deep-review/review/lineages/sol-high/iterations/iteration-003.md`
- Delta: `.opencode/specs/sk-doc/019-skill-routing-refactor/027-program-deep-review/review/lineages/sol-high/deltas/iter-003.jsonl`

## REQUIRED OUTPUT
Write the narrative, update strategy in place, append exactly one canonical `type:"iteration"` state record, and create the matching delta. Include route proof, all required v1 fields, structured traceability results, complete typed adjudication packets for every new P0/P1, and the exact final narrative line `Review verdict: PASS|CONDITIONAL|FAIL` with the concrete enum substituted.

## ALLOWED WRITE PATHS
- The iteration narrative path above
- The state log above, append only
- The delta path above
- The strategy path above, in-place updates only

## BANNED OPERATIONS
No source/spec edits, no writes outside the four allowed paths, no config/registry/dashboard/report edits, no delete/rename operations, no implementation fixes, no Task/sub-agent dispatch, and no WebFetch.
