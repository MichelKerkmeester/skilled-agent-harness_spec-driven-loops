# Fixture Audit Evidence

| Probe | Status | Vec Count | FTS Count | Expected Path | Exclusion Match |
|---:|---|---:|---:|---|---|
| 1 | indexed | 20 | 20 | `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/registry.ts` | `-` |
| 2 | indexed | 12 | 12 | `.opencode/skills/system-spec-kit/mcp_server/handlers/embedder-set.ts` | `-` |
| 3 | indexed | 52 | 52 | `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config.py` | `-` |
| 4 | indexed | 168 | 168 | `.opencode/skills/system-spec-kit/scripts/spec/validate.sh` | `-` |
| 5 | indexed | 64 | 64 | `.opencode/skills/system-code-graph/mcp_server/tests/code-graph-status-readiness-snapshot.vitest.ts` | `-` |
| 6 | indexed | 36 | 36 | `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/adapters/ollama.ts` | `-` |
| 7 | indexed | 236 | 236 | `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts` | `-` |
| 8 | indexed | 32 | 32 | `.opencode/skills/system-code-graph/mcp_server/lib/ccc-readiness-probe.ts` | `-` |
| 9 | indexed | 24 | 24 | `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/registered_embedders.py` | `-` |
| 10 | excluded | 0 | 0 | `.opencode/skills/system-spec-kit/scripts/dist/memory/generate-context.js` | `**/dist` |
| 11 | indexed | 52 | 52 | `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config.py` | `-` |
| 12 | indexed | 60 | 60 | `.opencode/skills/system-spec-kit/mcp_server/lib/search/rerank/retrieval-rescue.ts` | `-` |
| 13 | indexed | 20 | 20 | `.opencode/skills/system-code-graph/mcp_server/lib/budget-allocator.ts` | `-` |
| 14 | indexed | 268 | 268 | `.opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts` | `-` |
| 15 | indexed | 80 | 80 | `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/query.py` | `-` |
| 16 | indexed | 16 | 16 | `.opencode/skills/system-code-graph/mcp_server/tests/readiness-marker-atomic-write.vitest.ts` | `-` |
| 17 | indexed | 44 | 44 | `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/indexer.py` | `-` |
| 18 | indexed | 12 | 12 | `.opencode/skills/mcp-coco-index/mcp_server/tests/test_refresh_split.py` | `-` |

Audit method: loaded `.cocoindex_code/target_sqlite.db` read-only with sqlite-vec, counted `code_chunks_vec` and `code_chunks_fts` rows by mirror-normalized suffix, and matched missing targets against `.cocoindex_code/settings.yml` exclusion patterns.
