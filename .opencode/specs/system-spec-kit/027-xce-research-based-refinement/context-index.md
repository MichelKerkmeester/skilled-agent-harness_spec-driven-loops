# Context Index: 027 to 028 Split

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
| `002-incremental-index-foundation/` | `003-incremental-index-foundation/` | Incremental memory index foundation |
| `003-causal-edge-tombstones/` | `004-causal-edge-tombstones/` | Causal edge tombstone lifecycle |
| `004-metadata-edge-promoter/` | `005-metadata-edge-promoter/` | Deterministic metadata edge promotion |
| `005-write-path-reconciliation/` | `006-write-path-reconciliation/` | Desired/prior statediff reconciliation |
| `006-semantic-trigger-fallback/` | `004-semantic-trigger-fallback/` | Hybrid lexical plus semantic trigger matching |
| `007-learning-feedback-reducers/` | `005-learning-feedback-reducers/` | Learning feedback reducers |

## MCP to CLI Workstream Placement

028-mcp-to-cli-tool-transition relocated here as child phase 010 (history-preserving git mv); the dual-stack CLI transition is now a 027 workstream.
