DEEP-REVIEW
Resolved route: mode=review; target_agent=@deep-review; execution=single_review_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Review Iteration Prompt Pack

## STATE

STATE SUMMARY (auto-generated):
Iteration: 5 of 10
Dimension: cross-reference stabilization
Prior Findings: P0=0 P1=6 P2=1
Dimension Coverage: correctness, security, traceability, maintainability (4/4)
Traceability: core=pass overlay=notApplicable
Resource Map Coverage: resource-map.md not present; skipping coverage gate.
Coverage Age: 0; one stabilization pass required
Last 2 ratios: 0.25 -> 0.1129032258
Stuck count: 0
Provisional Verdict: CONDITIONAL hasAdvisories=false

Review Iteration: 5 of 10
Mode: review
Dimension: cross-reference stabilization
Review Target: .opencode/specs/sk-design/011-sk-design-styles-utilization
Review Scope Files: exact evidence and adjacent counterevidence for active P1-001 through P1-006, plus reducer-owned registry and prior iteration narratives
Prior Findings: P0=0 P1=6 P2=1

## STATE FILES

- Config: .opencode/specs/sk-design/011-sk-design-styles-utilization/review/lineages/sol-b/deep-review-config.json
- State Log: .opencode/specs/sk-design/011-sk-design-styles-utilization/review/lineages/sol-b/deep-review-state.jsonl
- Findings Registry: .opencode/specs/sk-design/011-sk-design-styles-utilization/review/lineages/sol-b/deep-review-findings-registry.json
- Strategy: .opencode/specs/sk-design/011-sk-design-styles-utilization/review/lineages/sol-b/deep-review-strategy.md
- Write iteration narrative to: .opencode/specs/sk-design/011-sk-design-styles-utilization/review/lineages/sol-b/iterations/iteration-005.md
- Write delta to: .opencode/specs/sk-design/011-sk-design-styles-utilization/review/lineages/sol-b/deltas/iter-005.jsonl

## CONSTRAINTS

- LEAF-only; no sub-agents. Load shared review doctrine and emit BINDING lines.
- Target is read-only; write only narrative/state/delta/strategy.
- This is a stabilization pass, not a new broad sweep. Re-read cited evidence for each P1 and one adjacent counterevidence source.
- Confirm, downgrade, disprove, or refine each active P1. New findings require a genuinely distinct root cause.
- Carry forward completed core-protocol results; do not rerun full inventory.
- Emit v2 graphless ledger rows for the replay and exact state/delta route proof.
- End with one canonical verdict line.

## STABILIZATION FOCUS

Replay active P1-001 through P1-006 against current target files. Confirm evidence density, same-root deduplication, final severity, and packet scope. Check that P2-007 remains advisory. Seek concrete counterevidence that would downgrade each claim, record whether any finding changes, and leave no unresolved claim-adjudication packet. If the registry remains stable and no new P0/P1 appears, set `newFindingsRatio` to 0 and recommend legal convergence.
