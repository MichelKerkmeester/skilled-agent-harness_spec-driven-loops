DEEP-REVIEW
Resolved route: mode=review; target_agent=@deep-review; execution=single_review_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Review Iteration Prompt Pack

## STATE

STATE SUMMARY (auto-generated):
Iteration: 4 of 10
Dimension: maintainability
Prior Findings: P0=0 P1=6 P2=0
Dimension Coverage: correctness, security, traceability (3/4)
Traceability: core=pass overlay=notApplicable
Resource Map Coverage: resource-map.md not present; skipping coverage gate.
Coverage Age: 0
Last 2 ratios: 0.60 -> 0.25
Stuck count: 0
Provisional Verdict: CONDITIONAL hasAdvisories=false

Review Iteration: 4 of 10
Mode: review
Dimension: maintainability
Review Target: .opencode/specs/sk-design/011-sk-design-styles-utilization
Review Scope Files: phase-parent and implementation children 004-010, with the named shared seams and sk-design consumer surfaces
Prior Findings: P0=0 P1=6 P2=0

## STATE FILES

- Config: .opencode/specs/sk-design/011-sk-design-styles-utilization/review/lineages/sol-b/deep-review-config.json
- State Log: .opencode/specs/sk-design/011-sk-design-styles-utilization/review/lineages/sol-b/deep-review-state.jsonl
- Findings Registry: .opencode/specs/sk-design/011-sk-design-styles-utilization/review/lineages/sol-b/deep-review-findings-registry.json
- Strategy: .opencode/specs/sk-design/011-sk-design-styles-utilization/review/lineages/sol-b/deep-review-strategy.md
- Write iteration narrative to: .opencode/specs/sk-design/011-sk-design-styles-utilization/review/lineages/sol-b/iterations/iteration-004.md
- Write delta to: .opencode/specs/sk-design/011-sk-design-styles-utilization/review/lineages/sol-b/deltas/iter-004.jsonl

## CONSTRAINTS

- LEAF-only; no sub-agents. Emit canonical BINDING lines and load shared review doctrine.
- Target is read-only; only narrative/state/delta/strategy paths are writable.
- Use direct reads/exact searches and complete v2 graphless ledger evidence.
- Do not retry completed core-protocol or false shipped-code searches.
- Refine prior findings when the root cause is shared; do not duplicate.
- End with one exact canonical verdict line and verify state/delta identity.

## MAINTAINABILITY FOCUS

Audit ownership and duplication across the planned implementation chain: whether one shared contract has a named owner, whether phases 004-010 duplicate or conflict on common provenance/proof/authority fields, whether proposed file/package locations are concrete enough to avoid parallel implementations, and whether rollback/feature-gate boundaries are independently operable. Focus on defects that materially raise implementation or maintenance risk, not stylistic preferences.
