# Context Index: 027

> Historical phase-identity bridge for 027. Resolves old top-level phase paths to their current homes. Newest reorganization first.

## Six-Track Grouping (2026-06-14)

The thirty prior top-level phases (`001` through `030`) were grouped under six themed parent tracks, mirroring how `026-graph-and-context-optimization` organizes its work and how `before-vs-after.md` narrates the epic by system. `000-release-cleanup` kept its position and now also hosts the regrouping task at `000-release-cleanup/000-spec-tree-consolidation`. Children were renumbered contiguously within each new parent. Per-phase changelog files keep their original paths; see `changelog/README.md` for the changelog bridge.

| Old top-level folder | Current home |
|---|---|
| `001-peck-teachings-adoption` | `001-research-and-doctrine/001-peck-teachings-adoption` |
| `006-gem-team-adoption` | `001-research-and-doctrine/002-gem-team-adoption` |
| `002-memory-write-safety` | `002-memory-store-and-search/001-memory-write-safety` |
| `003-memory-index-causal-lifecycle` | `002-memory-store-and-search/002-memory-index-causal-lifecycle` |
| `004-semantic-trigger-fallback` | `002-memory-store-and-search/003-semantic-trigger-fallback` |
| `005-learning-feedback-reducers` | `002-memory-store-and-search/004-learning-feedback-reducers` |
| `007-memclaw-derived-memory-hardening` | `002-memory-store-and-search/005-memclaw-derived-memory-hardening` |
| `008-openltm-retrieval-observability` | `002-memory-store-and-search/006-openltm-retrieval-observability` |
| `009-openltm-continuity-resilience` | `002-memory-store-and-search/007-openltm-continuity-resilience` |
| `013-vector-read-path-resilience` | `002-memory-store-and-search/008-vector-read-path-resilience` |
| `014-packed-bm25-field-weights` | `002-memory-store-and-search/009-packed-bm25-field-weights` |
| `017-bm25-warmup-churn-reduction` | `002-memory-store-and-search/010-bm25-warmup-churn-reduction` |
| `020-vector-resilience-durability` | `002-memory-store-and-search/011-vector-resilience-durability` |
| `021-hybrid-search-scope-then-limit` | `002-memory-store-and-search/012-hybrid-search-scope-then-limit` |
| `022-provenance-injection` | `002-memory-store-and-search/013-provenance-injection` |
| `023-idempotency-flag-on-correctness` | `002-memory-store-and-search/014-idempotency-flag-on-correctness` |
| `012-causal-traversal-bfs` | `003-advisor-and-codegraph/001-causal-traversal-bfs` |
| `018-xce-feature-adoption-advisor-codegraph` | `003-advisor-and-codegraph/002-xce-feature-adoption-advisor-codegraph` |
| `019-skill-advisor-cross-session-reconnect` | `003-advisor-and-codegraph/003-skill-advisor-cross-session-reconnect` |
| `010-mcp-to-cli-tool-transition` | `004-shared-infrastructure/001-mcp-to-cli-tool-transition` |
| `011-command-presentation-workflow-separation` | `004-shared-infrastructure/002-command-presentation-workflow-separation` |
| `015-storage-adapter-ports` | `004-shared-infrastructure/003-storage-adapter-ports` |
| `016-cli-tooling-ux` | `004-shared-infrastructure/004-cli-tooling-ux` |
| `024-autonomous-dependency-patching` | `004-shared-infrastructure/005-autonomous-dependency-patching` |
| `025-code-mode-orphan-lifecycle` | `004-shared-infrastructure/006-code-mode-orphan-lifecycle` |
| `026-ipc-client-cap-hardening` | `004-shared-infrastructure/007-ipc-client-cap-hardening` |
| `027-finding-remediation` | `005-verification-and-remediation/001-finding-remediation` |
| `028-tri-system-deep-research` | `005-verification-and-remediation/002-tri-system-deep-research` |
| `029-deep-research-remediation` | `005-verification-and-remediation/003-deep-research-remediation` |
| `030-residual-design-units` | `005-verification-and-remediation/004-residual-design-units` |

> Note: the prior-wave sections below predate this grouping. Where they name a `027-xce-research-based-refinement/0NN-...` child (for example the MCP-to-CLI placement at `010` and the epic-close placements at `024`/`025`), that child has since moved again under this wave. Resolve any such old path through the table above first.

## 027 to 028 Split

On 2026-05-28, the Code Graph phases formerly in disk folders `007`-`010` and the CocoIndex phases formerly in disk folders `013`-`017` were extracted to sibling packet `028-code-graph-and-cocoindex` and renumbered to `001`-`009`.

The `external/cocoindex-main`, `external/cocoindex-code-main`, and `backup/` assets moved with the new 028 packet. The `external/xce-mcp` source material and the memory-topic research remained in this 027 packet.

| Old 027 disk folder | New 028 folder | Former child title (pre-split; titles since normalized to new numbers) | Level | Topic |
|---|---|---|---|---|
| `007-code-graph-hld-lld` | `001-code-graph-hld-lld` | `Phase Parent: 027/002 Code Graph HLD/LLD` | 2 (phase-parent) | code-graph |
| `008-code-graph-trace` | `002-code-graph-trace` | `Phase Parent: 027/003 Code Graph Trace` | 2 (phase-parent) | code-graph |
| `009-code-graph-impact-analysis` | `003-code-graph-impact-analysis` | `Phase Parent: 027/004 Code Graph Impact Analysis` | phase-parent | code-graph |
| `010-code-graph-adoption-eval` | `004-code-graph-adoption-eval` | `Phase Parent: Code Graph Adoption Evaluation Harness` | phase-parent | code-graph |
| `013-cocoindex-complete-fork` | `005-cocoindex-complete-fork` | `Phase Parent - Complete CocoIndex MCP Fork` | 2 (phase-parent) | cocoindex |
| `014-coco-intent-steering` | `006-coco-intent-steering` | `Phase 007 — Coco-Index Intent Steering + Bounded Query Expansion` | 3 | cocoindex |
| `015-retrieval-rerank-clients` | `007-retrieval-rerank-clients` | `Phase 010 — Retrieval Rerank Clients (Shared RerankClient + EmbeddingCacheClient Interfaces)` | 3 | cocoindex |
| `016-coco-memory-context-extras` | `008-coco-memory-context-extras` | `Phase Parent 011 — Coco Memory Context Extras` | 2 (phase-parent) | cocoindex |
| `017-cocoindex-memory-port-research` | `009-cocoindex-memory-port-research` | `cocoindex-main → spec_kit_memory port + MCP namespace shortening (research)` | 1 | cocoindex |

Use `027-xce-research-based-refinement` for the remaining memory phases and research provenance. Use `028-code-graph-and-cocoindex` for the moved Code Graph and CocoIndex phase children.

## Peck Teachings Placement

On 2026-06-04, `028-peck-teachings-adoption/` was placed under `027-xce-research-based-refinement/` as child phase `008-peck-teachings-adoption/` so the planned peck-derived improvements are tracked as a feature phase of 027.

| Old folder | New folder | Topic |
|---|---|---|
| `028-peck-teachings-adoption/` | `027-xce-research-based-refinement/008-peck-teachings-adoption/` | Low-risk peck teachings T3, T4, and T2; T1 remains deferred |

On 2026-06-04, the same peck-derived phase was renumbered again to the first active child slot so the remaining memory phases keep a contiguous 002-008 sequence and the parent can resume peck self-check work first.

| Old 027 child folder | Current 027 child folder | Topic |
|---|---|---|
| `008-peck-teachings-adoption/` | `001-peck-teachings-adoption/` | Low-risk peck teachings T3, T4, and T2; T1 remains deferred |
| `001-memory-write-safety/` | `002-memory-write-safety/` | Memory write safety and feedback correctness |
| `002-incremental-index-foundation/` | `003-memory-index-causal-lifecycle/001-incremental-index-foundation/` | Incremental memory index foundation |
| `003-causal-edge-tombstones/` | `003-memory-index-causal-lifecycle/002-causal-edge-tombstones/` | Causal edge tombstone lifecycle |
| `004-metadata-edge-promoter/` | `003-memory-index-causal-lifecycle/003-metadata-edge-promoter/` | Deterministic metadata edge promotion |
| `005-write-path-reconciliation/` | `003-memory-index-causal-lifecycle/004-write-path-reconciliation/` | Desired/prior statediff reconciliation |
| `006-semantic-trigger-fallback/` | `004-semantic-trigger-fallback/` | Hybrid lexical plus semantic trigger matching |
| `007-learning-feedback-reducers/` | `005-learning-feedback-reducers/` | Learning feedback reducers |

## MCP to CLI Workstream Placement

028-mcp-to-cli-tool-transition relocated here as child phase 010 (history-preserving git mv); the dual-stack CLI transition is now a 027 workstream.

## Epic-Close Infrastructure Placement

On 2026-06-11, two standalone track-root packets were relocated under `027-xce-research-based-refinement/` as epic-close child phases (025 via history-preserving git mv; 024 was uncommitted and landed directly at its new path). Track-level registries were repointed and the dangling track children removed.

| Old track-root folder | Current 027 child folder | Topic |
|---|---|---|
| `028-autonomous-dependency-patching/` | `027-xce-research-based-refinement/024-autonomous-dependency-patching/` | npm audit detection + lockfile-only remediation across skill package roots |
| `029-code-mode-orphan-lifecycle/` | `027-xce-research-based-refinement/025-code-mode-orphan-lifecycle/` | mcp-code-mode stdio server exits with its session; PPID-1 orphan reap |
