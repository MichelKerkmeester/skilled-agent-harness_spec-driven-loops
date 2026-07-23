DEEP-REVIEW
Resolved route: mode=review; target_agent=@deep-review; execution=single_review_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Review Iteration 5 Prompt Pack

## State

Iteration 5/10, forced max-iterations. Initial dimensions 4/4 covered. Active P0=0 P1=5 P2=0; claim adjudication passed.
Dimension: correctness, second-pass integration breadth.
Target: `.opencode/specs/sk-design/017-remediation-program-review`; frozen scope is its validated 118-file manifest at pinned HEAD `7b9d3b6b71`.
Focus: packet-level consumer closure across runtime entry points and regeneration boundaries. Enumerate manifest-scoped consumers of `lib/paths.mjs`, `style-library.mjs`, `persistent-adapter.mjs`, generated graph metadata, command metadata, the four design-mode corpus consumers, and md-generator `study-prepare.ts`. Verify no runtime consumer reconstructs retired paths, mismatches the moved manifests, or silently depends on stale generated state. Distinguish historical docs and fixture overrides from active consumers.

## Required Bindings

Emit the six canonical BINDING lines before state reads for exact target/spec folder, maxIterations=10, convergence=0.1, mode review, and all four dimensions.

## State And Outputs

Use the config/state/registry/strategy under `.opencode/specs/sk-design/017-remediation-program-review/review/lineages/gpt-56-sol-high/`. Write only `iterations/iteration-005.md`, append state, `deltas/iter-005.jsonl`, and update strategy.

## Constraints

- Exactly one LEAF iteration; no subagents; target read-only; no remediation. Load review-core.
- Read state first. Stay strictly within manifest for target evidence. Code Graph unavailable; use direct consumer enumeration, exact search, pinned diffs, and focused tests.
- New findings need concrete file:line, full finding schema, content hash, and complete typed adjudication with findingId for P0/P1. Refinements retain stable IDs/hashes.
- Canonical iteration 5 route proof; session `fanout-gpt-56-sol-high-1784650021792-031fvi`, generation 1, lineage new. Delta/state first records agree; exact final verdict line.
- Convergence remains telemetry; select a distinct unresolved breadth angle for iteration 6.

## Allowed Write Paths

Only the four lineage paths named above.

## Banned Operations

No delete, rename, truncation, staging, commit, or writing outside those paths. Record and contain any scope violation.
