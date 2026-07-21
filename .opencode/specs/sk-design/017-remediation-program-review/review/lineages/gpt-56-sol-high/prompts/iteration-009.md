DEEP-REVIEW
Resolved route: mode=review; target_agent=@deep-review; execution=single_review_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Review Iteration 9 Prompt Pack

## State

Iteration 9/10, forced max-iterations. Active JSONL findings: P0=0 P1=8 P2=0; reducer currently shows 7 because `P1-007` and `P1-008` were incorrectly emitted with the same content hash. Latest claim adjudication passed.
Dimension: correctness, third-pass adversarial parity/performance.
Frozen scope: validated 118 files for `.opencode/specs/sk-design/017-remediation-program-review`, pinned HEAD `7b9d3b6b71`.
Focus A: independently challenge the shadow-parity 10/10 and p95 1150→53 ms claims. Inspect query set, relevance/oracle fixtures, comparison semantics, sample counts, warm/cold treatment, timing boundaries, output fields, and packet claims. Reproduce what is feasible without mutating target/database state; treat human relevance and cutover as intentionally open.
Focus B: re-read `P1-007` and `P1-008`, retain both stable IDs as refinements, and emit distinct canonical `content_hash` values computed from `file_path + U+001F + line_range + U+001F + finding_type + U+001F + normalized_description_first_80`. Use snake-case `content_hash` in findingDetails. Do not reuse a source-file hash.

## Required Bindings

Emit canonical six BINDING lines before state reads for exact target/specFolder, maxIterations=10, convergence=0.1, review mode, and all dimensions.

## State And Outputs

Use lineage config/state/registry/strategy. Write only `iterations/iteration-009.md`, append state, `deltas/iter-009.jsonl`, and update strategy.

## Constraints

- One LEAF iteration; no subagents/fixes; target read-only. Load review-core.
- Strict manifest scope. Code Graph unavailable. Use direct evidence and read-only/test commands. Do not use Python.
- `P1-007` and `P1-008` must both appear as refined findingDetails with distinct canonical `content_hash`, complete existing adjudication packets, and unchanged severities unless counterevidence warrants transition.
- New findings require full schema/hash and numeric-confidence typed adjudication.
- Canonical iteration 9 route proof; session `fanout-gpt-56-sol-high-1784650021792-031fvi`, generation 1, lineage new; matching state/delta and exact final verdict.
- Choose iteration 10 as a final adversarial stabilization/replay pass; do not synthesize now.

## Allowed Write Paths

Only the four named lineage-local outputs.

## Banned Operations

No deletion, rename, truncation, staging, commit, target database generation, or write elsewhere. Record and contain violations.
