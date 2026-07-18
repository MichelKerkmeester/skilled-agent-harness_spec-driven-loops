DEEP-REVIEW
Resolved route: mode=review; target_agent=@deep-review; execution=single_review_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Review Iteration Prompt Pack

## STATE

STATE SUMMARY (auto-generated):
Iteration: 1 of 10
Dimension: correctness
Prior Findings: P0=0 P1=0 P2=0
Dimension Coverage: none (0/4)
Traceability: core=pending overlay=pending
Resource Map Coverage: resource-map.md not present; skipping coverage gate.
Coverage Age: 0
Last 2 ratios: N/A -> N/A
Stuck count: 0
Provisional Verdict: PENDING hasAdvisories=false

Review Iteration: 1 of 10
Mode: review
Dimension: correctness
Review Target: .opencode/specs/sk-design/011-sk-design-styles-utilization
Review Scope Files: parent spec/metadata, child phases 001-010, and implementation surfaces under .opencode/skills/sk-design named by those phases
Prior Findings: P0=0 P1=0 P2=0

## SHARED DOCTRINE

Load `.opencode/skills/sk-code/code-review/references/review_core.md` before final severity calls.

## STATE FILES

- Config: .opencode/specs/sk-design/011-sk-design-styles-utilization/review/lineages/sol-b/deep-review-config.json
- State Log: .opencode/specs/sk-design/011-sk-design-styles-utilization/review/lineages/sol-b/deep-review-state.jsonl
- Findings Registry: .opencode/specs/sk-design/011-sk-design-styles-utilization/review/lineages/sol-b/deep-review-findings-registry.json
- Strategy: .opencode/specs/sk-design/011-sk-design-styles-utilization/review/lineages/sol-b/deep-review-strategy.md
- Write iteration narrative to: .opencode/specs/sk-design/011-sk-design-styles-utilization/review/lineages/sol-b/iterations/iteration-001.md
- Write delta to: .opencode/specs/sk-design/011-sk-design-styles-utilization/review/lineages/sol-b/deltas/iter-001.jsonl

## CONSTRAINTS

- You are the LEAF `deep-review` agent. Do not dispatch sub-agents.
- Emit the six canonical BINDING lines before state reads.
- Review only correctness in this iteration, using 3-5 focused actions and direct file:line evidence.
- Review target files are read-only. Do not implement fixes.
- ALLOWED WRITE PATHS: only the iteration narrative, append-only state log, delta file, and in-place strategy update listed above.
- BANNED OPERATIONS: delete, rename, move, truncate, stage, commit, or modify any target/config/registry/dashboard/report/runtime file.
- The code graph is absent and memory retrieval timed out; use direct reads, exact searches, and a cited graphless fallback ledger.
- Treat this phase parent as a complex scope and emit complete review-depth v2 fields.
- The state-log and delta canonical iteration records must match and include route proof.
- End the narrative with exactly one final line: `Review verdict: PASS`, `Review verdict: CONDITIONAL`, or `Review verdict: FAIL`.

## CORRECTNESS FOCUS

Verify parent/child lifecycle status claims, phase dependency ordering, implementation-summary truthfulness, and whether named sk-design runtime artifacts support any shipped-behavior claims. Prefer concrete contradictions and observable state bugs over planning-style suggestions.
