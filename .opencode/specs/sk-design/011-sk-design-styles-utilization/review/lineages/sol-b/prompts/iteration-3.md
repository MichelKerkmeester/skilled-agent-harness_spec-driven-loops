DEEP-REVIEW
Resolved route: mode=review; target_agent=@deep-review; execution=single_review_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Review Iteration Prompt Pack

## STATE

STATE SUMMARY (auto-generated):
Iteration: 3 of 10
Dimension: traceability
Prior Findings: P0=0 P1=5 P2=0
Dimension Coverage: correctness, security (2/4)
Traceability: core=partial overlay=pending
Resource Map Coverage: resource-map.md not present; skipping coverage gate.
Coverage Age: 0
Last 2 ratios: 1.0 -> 0.60
Stuck count: 0
Provisional Verdict: CONDITIONAL hasAdvisories=false

Review Iteration: 3 of 10
Mode: review
Dimension: traceability
Review Target: .opencode/specs/sk-design/011-sk-design-styles-utilization
Review Scope Files: phase-parent plus child phases 001-010, their canonical specs/checklists/summaries/metadata, and directly named sk-design implementation surfaces
Prior Findings: P0=0 P1=5 P2=0

## STATE FILES

- Config: .opencode/specs/sk-design/011-sk-design-styles-utilization/review/lineages/sol-b/deep-review-config.json
- State Log: .opencode/specs/sk-design/011-sk-design-styles-utilization/review/lineages/sol-b/deep-review-state.jsonl
- Findings Registry: .opencode/specs/sk-design/011-sk-design-styles-utilization/review/lineages/sol-b/deep-review-findings-registry.json
- Strategy: .opencode/specs/sk-design/011-sk-design-styles-utilization/review/lineages/sol-b/deep-review-strategy.md
- Write iteration narrative to: .opencode/specs/sk-design/011-sk-design-styles-utilization/review/lineages/sol-b/iterations/iteration-003.md
- Write delta to: .opencode/specs/sk-design/011-sk-design-styles-utilization/review/lineages/sol-b/deltas/iter-003.jsonl

## CONSTRAINTS

- LEAF-only; no sub-agents. Load shared review doctrine.
- Emit canonical BINDING lines before state reads.
- Review target is read-only. Write only the listed narrative, append-only log, delta, and strategy paths.
- Use direct reads and exact searches; graph and memory are unavailable.
- Emit complete v2 graphless search-depth fields and exact route proof.
- End narrative with one canonical final verdict line.

## TRACEABILITY FOCUS

Execute the first full `spec_code` and `checklist_evidence` core-protocol audit. The earlier iterations only deferred or used checklists as contract evidence; this is required protocol coverage, not a retry of an exhausted audit. Verify parent phase-map status against each child summary, completed research claims against actual synthesis artifacts, planned phases against unchecked tasks/checklists and absent runtime artifacts, metadata status/last-active-child consistency, and named cross-reference existence. Mark overlays applicable/not-applicable with evidence. Refine existing findings instead of duplicating them, and add new findings only for distinct root causes.
