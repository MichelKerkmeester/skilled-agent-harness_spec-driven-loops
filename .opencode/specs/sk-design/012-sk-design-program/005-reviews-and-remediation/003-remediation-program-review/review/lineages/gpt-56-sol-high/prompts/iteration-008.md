DEEP-REVIEW
Resolved route: mode=review; target_agent=@deep-review; execution=single_review_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Review Iteration 8 Prompt Pack

## State

Iteration 8/10, forced max-iterations. Active P0=0 P1=6 P2=0; latest adjudication passed. All dimensions have prior coverage.
Dimension: maintainability, operator/API parity.
Frozen target/scope: `.opencode/specs/sk-design/017-remediation-program-review`, validated 118 files, pinned HEAD `7b9d3b6b71`.
Focus: compare database operator commands/options/defaults/error exits/output JSON and adapter/retrieval public result fields against the current manifest-listed README, playbook, specs, and tests. Search for semantic drift beyond known stale paths: option names, default mode, cutover/rollback preconditions, status fields, repair semantics, absent-generation behavior, and performance/parity output claims. Carry existing path findings without duplicating them.

## Required Bindings

Emit the canonical six BINDING lines before state reads for exact target/specFolder, maxIterations=10, convergence=0.1, review mode, and all dimensions.

## State And Outputs

Read lineage config/state/registry/strategy. Write only `iterations/iteration-008.md`, append state, `deltas/iter-008.jsonl`, and update strategy.

## Constraints

- One LEAF iteration; no subagents or fixes; target read-only. Load review-core.
- Strict manifest scope. Use direct parsing/reads/exact search/focused tests. Code Graph unavailable. Do not use Python.
- Findings need cited full schema/hash; complete typed numeric-confidence adjudication for new P0/P1. Stable findings are refinements only when evidence/severity changes.
- Canonical iteration 8 route proof; session `fanout-gpt-56-sol-high-1784650021792-031fvi`, generation 1, lineage new; matching state/delta and exact final verdict.
- Continue regardless of telemetry convergence; choose a distinct parity/performance or final adversarial angle for iteration 9.

## Allowed Write Paths

Only the four named lineage-local outputs.

## Banned Operations

No deletion, rename, truncation, stage, commit, or write elsewhere. Record and contain violations.
