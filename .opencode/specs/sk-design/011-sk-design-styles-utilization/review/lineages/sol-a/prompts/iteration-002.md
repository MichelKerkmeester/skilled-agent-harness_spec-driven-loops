DEEP-REVIEW
Resolved route: mode=review; target_agent=@deep-review; execution=single_review_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Review Iteration Prompt Pack

## STATE
STATE SUMMARY (auto-generated):
Iteration: 2 of 10
Dimension: security
Prior Findings: P0=0 P1=1 P2=0
Dimension Coverage: correctness (1/4)
Traceability: core=covered overlay=notApplicable
Resource Map Coverage: resource-map.md not present; skipping coverage gate.
Coverage Age: 0
Last 2 ratios: N/A -> 1.0
Stuck count: 0
Provisional Verdict: CONDITIONAL hasAdvisories=false

## REVIEW ASSIGNMENT
Execute one security pass over the planned corpus retrieval, STUDY exemplar, shared context seam, and Open Design transport boundaries in phases 004, 006, 007, and 010. Test rights/provenance eligibility, prompt-injection and copy/leak controls, path handling, generation binding, transport trust, and fail-closed behavior against current contracts. Distinguish planned guarantees from current runtime behavior and do not penalize intentionally unimplemented features merely for being planned.

Carry forward `SOL-A-I001-P1-001`. Re-read its cited evidence as needed and include a corrected typed claim-adjudication packet containing explicit `findingId`. Do not duplicate the finding.

## STATE FILES
- Config: `.opencode/specs/sk-design/011-sk-design-styles-utilization/review/lineages/sol-a/deep-review-config.json`
- State Log: `.opencode/specs/sk-design/011-sk-design-styles-utilization/review/lineages/sol-a/deep-review-state.jsonl`
- Findings Registry: `.opencode/specs/sk-design/011-sk-design-styles-utilization/review/lineages/sol-a/deep-review-findings-registry.json`
- Strategy: `.opencode/specs/sk-design/011-sk-design-styles-utilization/review/lineages/sol-a/deep-review-strategy.md`
- Narrative: `.opencode/specs/sk-design/011-sk-design-styles-utilization/review/lineages/sol-a/iterations/iteration-002.md`
- Delta: `.opencode/specs/sk-design/011-sk-design-styles-utilization/review/lineages/sol-a/deltas/iter-002.jsonl`

## CONSTRAINTS
- LEAF-only; no sub-agents, no implementation, no target mutation, no WebFetch.
- Target 9 tool calls, soft max 12, hard max 13.
- Write only Narrative, State Log append, Delta, and Strategy listed above.
- BANNED: deletes, renames, truncating writes outside allowed files, or any mutation outside `sol-a`.
- Use direct reads and exact searches as graphless fallback; do not invoke scripts that write outside `sol-a`.

## OUTPUT CONTRACT
- Narrative must end with the exact verdict line.
- Append one canonical `type=iteration` record; `findingsNew` MUST be an array of new finding IDs.
- Because scope is standard, include `reviewDepthSchemaVersion:2` and the exact v2 fields: `reviewDepthApplicability`, `targetSelection`, `searchCoverage` with `graphCoverageMode:"graphless_fallback"`, and `searchLedger` rows whose methods use the allowed vocabulary (`direct_read`, `exact_grep`, `semantic_search`, `code_graph_status_check`, `producer_consumer_trace`, `negative_test_inspection`).
- Every finding needs `id`, severity, category, `file:line`, evidence, scope proof, and `content_hash`.
- Every P0/P1, including the carried P1, needs a typed packet with `findingId`, claim, evidenceRefs, counterevidenceSought, alternativeExplanation, finalSeverity, confidence, and downgradeTrigger.
- Write the delta JSONL and update strategy next focus to traceability.
