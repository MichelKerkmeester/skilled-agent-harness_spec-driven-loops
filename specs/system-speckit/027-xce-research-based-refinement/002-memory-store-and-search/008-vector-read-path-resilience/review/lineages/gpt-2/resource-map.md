# Review Resource Map

Root spec `resource-map.md` was absent at initialization, so the formal Resource Map Coverage Gate was skipped.

## Reviewed Files

| File | Role |
|------|------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts` | Shard integrity probe, attach, dimension source |
| `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts` | Repair reindex and staged shard swap |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts` | KNN benchmark and vector query path |
| `.opencode/skills/system-spec-kit/mcp_server/lib/observability/retrieval-observability.ts` | Degraded-vector health counters |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-health.ts` | `memory_health` recall degradation payload |
| `.opencode/skills/system-spec-kit/mcp_server/tests/vector-shard-read-path-resilience.vitest.ts` | Corruption self-heal test |
| `.opencode/skills/system-spec-kit/mcp_server/tests/vector-dimension-source.vitest.ts` | Dimension-source tests |
| `.opencode/skills/system-spec-kit/mcp_server/tests/vector-knn-query-shape-benchmark.vitest.ts` | KNN query-shape benchmark test |

## Phase-5 Augmentation

- Novel logic gap: same-process post-repair vector search is not covered after the staged shard is renamed over the live shard path. Source: `iterations/iteration-001.md` and `iterations/iteration-003.md`.
