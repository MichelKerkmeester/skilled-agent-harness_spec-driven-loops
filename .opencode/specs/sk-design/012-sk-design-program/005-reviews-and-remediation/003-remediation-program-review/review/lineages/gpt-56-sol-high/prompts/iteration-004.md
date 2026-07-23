DEEP-REVIEW
Resolved route: mode=review; target_agent=@deep-review; execution=single_review_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Review Iteration 4 Prompt Pack

## State

Iteration 4 of 10; forced max-iterations policy. Dimensions covered: correctness, security, traceability. Active findings: P0=0 P1=3 P2=0. Latest claim adjudication passed.
Dimension: maintainability.
Target/scope: `.opencode/specs/sk-design/017-remediation-program-review`, validated 118-file manifest, pinned HEAD `7b9d3b6b71`.
Focus: stale path/reference closure, centralized path authority, generated metadata integrity, command authority consistency, comments/docs accuracy, file-format warning follow-up, and safe follow-on change cost. Search only the manifest for hardcoded `_engine`, `_db`, old manifest/database paths, compatibility aliases, stale presentation-authority claims, and mismatched metadata. Revisit active findings only when new evidence refines them.

## Required Bindings

Emit canonical BINDING lines before state reads for target, maxIterations=10, convergence=0.1, mode=review, all four dimensions, and exact specFolder.

## State Paths

Config, state, registry, and strategy are in `.opencode/specs/sk-design/017-remediation-program-review/review/lineages/gpt-56-sol-high/`. Write `iterations/iteration-004.md`, append state, write `deltas/iter-004.jsonl`, and update only the strategy.

## Constraints

- One LEAF iteration, no subagents, no fixes, target read-only. Load review-core doctrine.
- Read state first. Write only iteration-004.md, append-only state, iter-004.jsonl, and strategy.
- Concrete manifest-scoped file:line evidence for every finding. Full finding schema/content hash; typed adjudication with findingId for new P0/P1.
- Canonical route proof and iteration 4 record; session `fanout-gpt-56-sol-high-1784650021792-031fvi`, generation 1, lineage new. Delta first record equals state append.
- Exact final verdict line. Direct-read/exact-search/Git/test fallback because Code Graph is unavailable.
- Bundle contents and concurrent system-deep-loop work remain out of scope.
- This pass completes initial four-dimension coverage but MUST NOT synthesize; next focus must broaden to a distinct packet-level angle for iterations 5-10.

## Allowed Write Paths

Only `.opencode/specs/sk-design/017-remediation-program-review/review/lineages/gpt-56-sol-high/{iterations/iteration-004.md,deep-review-state.jsonl,deltas/iter-004.jsonl,deep-review-strategy.md}`.

## Banned Operations

No deletion, rename, truncation, staging, commit, or write elsewhere. Record scope violations instead.
