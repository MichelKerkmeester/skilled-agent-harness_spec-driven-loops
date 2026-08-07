# Iteration 021 — Angle 21

**Angle:** Stress coverage gaps: which 027 features still lack stress suites after the four added (e.g. write-path reconciliation, metadata-edge promoter, semantic triggers).

**Summary:** After the four added stress suites, the remaining gaps are concentrated in high-risk 027 memory/search paths that have focused regression tests but no dedicated stress suites. The docs are mostly honest about semantic-trigger promotion being blocked; the issue is coverage depth, not a false shipped claim.

**Findings kept:** 4

## [P2][REFINEMENT] Write-path reconciliation lacks a real stress suite

- Evidence: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/002-memory-index-causal-lifecycle/004-write-path-reconciliation/implementation-summary.md:77-79 lists only normal mcp_server/tests suites; vitest.stress.config.ts:13-18 includes only mcp_server/stress_test and excludes mcp_server/tests; command `rg --files '.opencode/skills/system-spec-kit/mcp_server/stress_test' | rg '(write-path|reconciliation|statediff|frontmatter|metadata|promoter|semantic|trigger|backfill|scope|limit|provenance|dependency|orphan|bfs|bm25|adapter|feedback|reducer)'` returned only enrichment-marker-backfill and trigger benchmark filenames.
- Detail: The code has focused unit/source-shape coverage for ordering and action-batch wiring, but no stress entry under `mcp_server/stress_test` for concurrent saves, scans, bulk deletes, stale cleanup, or subscriber fan-out. This is a coverage gap because the feature explicitly moves cache and hygiene effects into write-path action batches.
- Fix sketch: Add a `stress_test/substrate/write-path-reconciliation-stress.vitest.ts` suite that drives many scan/save/delete action batches and verifies subscriber idempotence, stale-delete safety, and cache hygiene.

## [P2][REFINEMENT] Metadata-edge promoter has unit coverage but no high-volume stress coverage

- Evidence: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/002-memory-index-causal-lifecycle/003-metadata-edge-promoter/spec.md:203-205 requires no duplicate edges and stale auto-edge tombstoning; tests/frontmatter-promoter.vitest.ts:82-121,124-145,198-219 cover small fixtures only; the stress filename command above returned no frontmatter/metadata/promoter stress suite.
- Detail: The promoter writes generated causal edges and must preserve manual edges while cleaning stale generated edges, but current tests exercise a handful of in-memory rows. There is no stress suite for large packet trees, repeated index scans, metadata churn, unresolved target storms, or manual-edge collisions at scale.
- Fix sketch: Add a durability stress suite that indexes a large synthetic packet hierarchy, mutates graph metadata repeatedly, and asserts no duplicate generated edges, no manual overwrite, and bounded tombstone cleanup.

## [P2][REFINEMENT] Semantic-trigger stress coverage stops short of promotion-risk scenarios

- Evidence: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/003-semantic-trigger-fallback/spec.md:66 and :91 require FP, recall, latency, cost, and rollback evidence before union promotion; 004-tests-goldens-shadow-eval/implementation-summary.md:55 and :117-124 state the current goldens are synthetic and live-profile evidence is blocked; stress_test/durability/release-cleanup-new-surfaces-stress.vitest.ts:315-347 only checks default-off plus loaded shadow behavior over synthetic prompts.
- Detail: There is one broad release-cleanup stress case touching semantic triggers, but it does not stress live-profile embeddings, cold-cache/backfill churn, union-mode rollback, or false-positive behavior under realistic mixed prompts. The docs correctly say promotion is blocked, so this is not a shipped functional defect, but it remains a stress gap for the 027 semantic-trigger feature.
- Fix sketch: Add a dedicated semantic-trigger stress suite that replays a large privacy-safe prompt corpus through shadow and union-candidate modes, measuring FP, recall lift, p95 latency, cost counters, and rollback behavior.

## [P2][REFINEMENT] Hybrid search scope-then-limit lacks scale stress coverage

- Evidence: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/spec.md:153 describes the shipped scoped-search fix and SQLite-parameter chunking; 021-hybrid-search-scope-then-limit/implementation-summary.md:61-64 says coverage is three in-memory regression cases; the stress filename command above returned no scope/limit/hybrid-search stress suite.
- Detail: The feature fixes a recall-affecting search bug, but the test evidence is limited to small regression fixtures. There is no stress suite for large BM25 candidate sets, many spec-folder/tier filters, chunked metadata resolution near SQLite parameter limits, or mixed excluded/high-ranked documents.
- Fix sketch: Add a search-quality stress suite with thousands of BM25 candidates and scoped filters that verifies recall, ordering, and parameter-limit chunking before final limit slicing.
