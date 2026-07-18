DEEP-REVIEW
Resolved route: mode=review; target_agent=@deep-review; execution=single_review_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Review Iteration Prompt Pack

## STATE
Iteration: 4 of 10
Dimension: maintainability
Authoritative active findings from iteration narratives: P0=0 P1=4 P2=0
Dimensions covered: correctness, security, traceability (3/4)
Last ratios: 0.833333 -> 0.5
Provisional verdict: CONDITIONAL

Reducer note: the reducer's content-hash dedup may collapse independent findings in the same source file and its summary fallback may create placeholders when carried finding details are absent. Treat the four named IDs as authoritative and include all four in this iteration's `findingDetails` as carried/refined entries with their existing IDs, severities, evidence, and claim packets. Do not mint summary placeholders or duplicate IDs.

## REVIEW ASSIGNMENT
Perform one maintainability pass over phases 004-010 and the parent. Audit ownership clarity, duplicated contract/schema fields, reusable seam boundaries, change amplification, generated-metadata conventions, and phase-local documentation consistency. Focus on defects that make safe implementation materially harder, not stylistic preferences. Do not re-run exhausted correctness/security/traceability searches except to verify a specific maintainability hypothesis.

## STATE FILES
- Config: `.opencode/specs/sk-design/011-sk-design-styles-utilization/review/lineages/sol-a/deep-review-config.json`
- State Log: `.opencode/specs/sk-design/011-sk-design-styles-utilization/review/lineages/sol-a/deep-review-state.jsonl`
- Registry: `.opencode/specs/sk-design/011-sk-design-styles-utilization/review/lineages/sol-a/deep-review-findings-registry.json`
- Strategy: `.opencode/specs/sk-design/011-sk-design-styles-utilization/review/lineages/sol-a/deep-review-strategy.md`
- Narrative: `.opencode/specs/sk-design/011-sk-design-styles-utilization/review/lineages/sol-a/iterations/iteration-004.md`
- Delta: `.opencode/specs/sk-design/011-sk-design-styles-utilization/review/lineages/sol-a/deltas/iter-004.jsonl`

## CONSTRAINTS
- LEAF-only, target read-only, no fixes/sub-agents/WebFetch.
- Write only the four mutable/output files above under `sol-a`.
- Graphless direct-read/exact-search fallback only; no scripts writing outside `sol-a`.
- Target 9 tool calls, soft max 12, hard max 13.

## OUTPUT CONTRACT
- Narrative absolute final line is exact verdict.
- Append canonical iteration and matching delta; update strategy next focus to a cross-dimension stabilization/adversarial replay.
- `findingsSummary` must equal the authoritative cumulative registry after this pass. `findingsNew` contains only new IDs.
- `findingDetails` MUST contain all four carried IDs plus any new findings. Carried details use existing IDs and must not be counted in `findingsNew`.
- Use canonical review-depth-v2 exact shapes from iteration 003, with required bug classes `ownership_drift`, `schema_duplication`, and `change_amplification`, each covered/ruled-out/deferred/blocked exactly once and backed by canonical ledger rows.
- Preserve canonical traceability `{summary,results}` shape.
- Every P0/P1 needs complete typed claim packet; include carried packets and any new packets.
