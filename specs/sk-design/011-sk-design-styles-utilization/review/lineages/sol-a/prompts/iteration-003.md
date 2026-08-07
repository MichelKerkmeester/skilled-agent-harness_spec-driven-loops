DEEP-REVIEW
Resolved route: mode=review; target_agent=@deep-review; execution=single_review_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Review Iteration Prompt Pack

## STATE
Iteration: 3 of 10
Dimension: traceability
Prior cumulative findings: P0=0 P1=3 P2=0
Dimension Coverage: correctness, security (2/4)
Core protocols: covered once; replay requirement/task/checklist evidence now.
Last ratios: 1.0 -> 0.833333
Provisional verdict: CONDITIONAL

## REVIEW ASSIGNMENT
Perform one traceability pass. Build concise requirement-to-plan/task/checklist matrices for phases 004-010, with emphasis on the two security gaps from iteration 002, dependency handoffs 004->005/006->007->008/009->010, and the parent phase-map/metadata state. Verify checked items only where checked evidence exists. Do not re-run the exhausted correctness inventory or duplicate active findings.

## STATE FILES
- Config: `.opencode/specs/sk-design/011-sk-design-styles-utilization/review/lineages/sol-a/deep-review-config.json`
- State Log: `.opencode/specs/sk-design/011-sk-design-styles-utilization/review/lineages/sol-a/deep-review-state.jsonl`
- Registry: `.opencode/specs/sk-design/011-sk-design-styles-utilization/review/lineages/sol-a/deep-review-findings-registry.json`
- Strategy: `.opencode/specs/sk-design/011-sk-design-styles-utilization/review/lineages/sol-a/deep-review-strategy.md`
- Narrative: `.opencode/specs/sk-design/011-sk-design-styles-utilization/review/lineages/sol-a/iterations/iteration-003.md`
- Delta: `.opencode/specs/sk-design/011-sk-design-styles-utilization/review/lineages/sol-a/deltas/iter-003.jsonl`

## CONSTRAINTS
- LEAF-only, read-only target, no fixes, no sub-agents, no WebFetch.
- Write only the four listed mutable/output files under `sol-a`.
- Use direct reads and exact grep as graphless fallback. Do not invoke scripts that write outside `sol-a`.
- Target 9 tool calls, soft max 12, hard max 13.

## CANONICAL V2 CONTRACT
The iteration record MUST contain these exact shapes:
- `reviewDepthSchemaVersion: 2`
- `reviewDepthApplicability: {"scopeClass":"standard","enforcement":"strict","reason":"...","evidenceRefs":["path:line"]}`
- `targetSelection: {"selectedTargets":["path"],"selectionReason":"...","discoveryMethods":["direct_read","exact_grep"],"omittedHighRiskTargets":[],"graphStatus":"unavailable","semanticSearchStatus":"unavailable","evidenceRefs":["path:line"]}`
- `searchCoverage: {"requiredBugClasses":["traceability_gap","dependency_handoff","checklist_evidence"],"covered":[],"ruledOut":[],"deferred":[],"blocked":[],"graphCoverageMode":"graphless_fallback"}` with every required class appearing in exactly one outcome array.
- `searchLedger` rows each require `id`, `dimension`, `targetRefs`, `bugClass`, `hypothesis` or `invariant`, `searchActions:[{"method":"direct_read|exact_grep|producer_consumer_trace|negative_test_inspection","queryOrPath":"...","result":"...","evidenceRefs":["path:line"]}]`, `disposition`, `rationale`, and the matching disposition link field (`linkedFindingId`, `ruledOutReason`, `deferredReason`, `blockedReason`, or `notApplicableReason`).

## OUTPUT CONTRACT
- Narrative absolute final line must be the exact verdict.
- Append one canonical `type=iteration` JSONL record and write matching delta.
- `findingsSummary` is cumulative after this iteration; start from P0=0/P1=3/P2=0. `findingsNew` is an array of only newly introduced IDs.
- Every new P0/P1 needs a complete typed claim packet. Existing three packets are already adjudicated; carry without duplication.
- Traceability results must use the canonical `{summary,results[]}` shape with `protocolId`, `status`, `gateClass`, `applicable`, counts, evidence, findingRefs, and summary.
- Update strategy next focus to maintainability.
