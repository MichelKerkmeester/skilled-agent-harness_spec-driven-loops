DEEP-REVIEW
Resolved route: mode=review; target_agent=@deep-review; execution=single_review_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Review Iteration Prompt Pack

## STATE
Iteration: 5 of 10
Dimension: cross-dimension stabilization and adversarial replay
Authoritative active findings: P0=0 P1=5 P2=0
Dimensions covered: correctness, security, traceability, maintainability (4/4)
Last ratios: 0.5 -> 0.2
Coverage age before this pass: 0
Provisional verdict: CONDITIONAL

Reducer hygiene: the reducer generated `SUMMARY-P1-002`, `SUMMARY-P1-003`, and `SUMMARY-P1-004` from iteration-003 cumulative summary fallback. These are not real findings. Include `resolvedFindings:["SUMMARY-P1-002","SUMMARY-P1-003","SUMMARY-P1-004"]` in the iteration record. The content-hash reducer also merged `SOL-A-I003-P1-001` into `SOL-A-I001-P1-001` because both cite the same parent spec hash; preserve both IDs and explain the replay warning, but do not alter prior write-once artifacts.

## REVIEW ASSIGNMENT
Adversarially replay all five P1 claim packets. Re-read each primary evidence anchor and seek focused counterevidence. Confirm, downgrade, or disprove each finding; do not add findings unless genuinely novel P0/P1 evidence appears. Verify the producer/consumer path and negative-test expectation for the two security findings, lifecycle consumer impact for the continuity finding, orchestration consumer impact for the dependency finding, and additive-vs-replacement semantics for the maintainability finding.

## STATE FILES
- Config: `.opencode/specs/sk-design/011-sk-design-styles-utilization/review/lineages/sol-a/deep-review-config.json`
- State Log: `.opencode/specs/sk-design/011-sk-design-styles-utilization/review/lineages/sol-a/deep-review-state.jsonl`
- Registry: `.opencode/specs/sk-design/011-sk-design-styles-utilization/review/lineages/sol-a/deep-review-findings-registry.json`
- Strategy: `.opencode/specs/sk-design/011-sk-design-styles-utilization/review/lineages/sol-a/deep-review-strategy.md`
- Narrative: `.opencode/specs/sk-design/011-sk-design-styles-utilization/review/lineages/sol-a/iterations/iteration-005.md`
- Delta: `.opencode/specs/sk-design/011-sk-design-styles-utilization/review/lineages/sol-a/deltas/iter-005.jsonl`

## CONSTRAINTS
- LEAF-only, target read-only, no fixes/sub-agents/WebFetch.
- Write only the four mutable/output files under `sol-a`.
- Graphless fallback only; no scripts writing outside `sol-a`.
- Target 9 tool calls, soft max 12, hard max 13.

## OUTPUT CONTRACT
- Narrative absolute final line exact verdict.
- Append canonical iteration and matching delta; update strategy to synthesis-ready if replay is stable.
- Include all five authoritative findingDetails and complete typed claim packets. `findingsNew` should be `[]` unless truly new evidence requires a new ID.
- `findingsSummary` must reflect the five authoritative findings after any justified transitions. Include the three placeholder IDs in `resolvedFindings` exactly as listed.
- Use exact canonical v2 shapes. Required bug classes: `claim_replay`, `producer_consumer`, `negative_test_gap`, `metadata_consumer`, `change_classification`; place each in covered/ruledOut/deferred/blocked exactly once with cited canonical ledger rows.
- Include `fixCompletenessReplay` rows for all five findings with status PASS/FAIL/carried_forward, evidence refs, and producer/consumer/matrix coverage. Since no fixes have been applied, active confirmed findings are `carried_forward`, not PASS.
- Set `newFindingsRatio:0` if no new or refined finding emerges; set `findingStability:1.0` only if severities/statuses remain unchanged.
