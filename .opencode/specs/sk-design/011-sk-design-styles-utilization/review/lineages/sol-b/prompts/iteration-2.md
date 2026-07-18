DEEP-REVIEW
Resolved route: mode=review; target_agent=@deep-review; execution=single_review_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Review Iteration Prompt Pack

## STATE

STATE SUMMARY (auto-generated):
Iteration: 2 of 10
Dimension: security
Prior Findings: P0=0 P1=2 P2=0
Dimension Coverage: correctness (1/4)
Traceability: core=partial overlay=pending
Resource Map Coverage: resource-map.md not present; skipping coverage gate.
Coverage Age: 0
Last 2 ratios: N/A -> 1.0
Stuck count: 0
Provisional Verdict: CONDITIONAL hasAdvisories=false

Review Iteration: 2 of 10
Mode: review
Dimension: security
Review Target: .opencode/specs/sk-design/011-sk-design-styles-utilization
Review Scope Files: parent spec/metadata, child phases 004-010 security contracts, and named implementation surfaces under .opencode/skills/sk-design
Prior Findings: P0=0 P1=2 P2=0

## STATE FILES

- Config: .opencode/specs/sk-design/011-sk-design-styles-utilization/review/lineages/sol-b/deep-review-config.json
- State Log: .opencode/specs/sk-design/011-sk-design-styles-utilization/review/lineages/sol-b/deep-review-state.jsonl
- Findings Registry: .opencode/specs/sk-design/011-sk-design-styles-utilization/review/lineages/sol-b/deep-review-findings-registry.json
- Strategy: .opencode/specs/sk-design/011-sk-design-styles-utilization/review/lineages/sol-b/deep-review-strategy.md
- Write iteration narrative to: .opencode/specs/sk-design/011-sk-design-styles-utilization/review/lineages/sol-b/iterations/iteration-002.md
- Write delta to: .opencode/specs/sk-design/011-sk-design-styles-utilization/review/lineages/sol-b/deltas/iter-002.jsonl

## CONSTRAINTS

- LEAF-only; no sub-agents. Load the shared review doctrine before severity calls.
- Emit canonical BINDING lines before state reads.
- Review target files are read-only; only the listed iteration/state/delta/strategy files are writable.
- Do not delete, rename, move, truncate, stage, commit, or edit config/registry/dashboard/report/runtime files.
- Use direct reads and exact searches because memory is unavailable and the code graph is absent.
- Emit complete v2 search-depth fields with cited graphless fallback ledger rows.
- The state-log and delta canonical iteration records must match and include route proof.
- End the narrative with exactly one canonical `Review verdict:` final line.

## SECURITY FOCUS

Audit the planned corpus-to-prompt and transport trust boundaries: path traversal and symlink containment, malicious corpus text/prompt injection, provenance and rights labels, raw payload/value leakage, stale generation guards, no-cache claims, and fail-open versus fail-closed behavior. Distinguish absent planned implementation from defects in the planning contract itself. Re-adjudicate existing P1 only if security evidence changes its severity.
