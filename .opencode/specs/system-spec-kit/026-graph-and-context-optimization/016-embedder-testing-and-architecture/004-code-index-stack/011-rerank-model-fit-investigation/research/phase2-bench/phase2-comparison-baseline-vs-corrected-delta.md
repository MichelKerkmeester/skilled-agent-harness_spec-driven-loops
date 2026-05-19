# Phase 2 Baseline vs Corrected Delta

This compares the historical 8-probe Phase 2 result files with the corrected re-bench. The corrected run used the same three lanes, the hardened path extractor, and `code-retrieval-fixture-corrected.json`.

## Summary

| Lane | Old hits | Corrected hits on old 8 | Corrected hits full 18 | Miss to hit: harness | Miss to hit: fixture | Hit to miss |
|---|---:|---:|---:|---:|---:|---:|
| baseline-bge | 3/8 | 6/8 | 14/18 | 3 | 1 | 1 |
| bge-path-class | 3/8 | 6/8 | 14/18 | 3 | 1 | 1 |
| jina-v3 | 5/8 | 6/8 | 14/18 | 0 | 1 | 0 |

## Per-Probe Delta

| Lane | Probe | Old Hit | Corrected Hit | Classification | Old Expected | Corrected Expected | Note |
|---|---:|:---:|:---:|---|---|---|---|
| baseline-bge | 1 | no | no | unchanged | `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/registry.ts` | `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/registry.ts` |  |
| baseline-bge | 3 | yes | yes | unchanged | `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config.py` | `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config.py` |  |
| baseline-bge | 5 | yes | no | rerun/parser regression to inspect | `.opencode/skills/system-code-graph/mcp_server/tests/code-graph-status-readiness-snapshot.vitest.ts` | `.opencode/skills/system-code-graph/mcp_server/tests/code-graph-status-readiness-snapshot.vitest.ts` | Expected path unchanged but the fresh corrected run no longer reports it in top-5; leave as measured residual risk, not a fixture correction. |
| baseline-bge | 10 | no | yes | fixture fix only | `.opencode/skills/system-spec-kit/scripts/dist/memory/generate-context.js` | `.opencode/skills/system-spec-kit/scripts/memory/generate-context.ts` | Probe 10 original target had 0 vec/FTS rows and matched `**/dist`; corrected target is indexed TypeScript source. |
| baseline-bge | 11 | no | yes | harness fix only | `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config.py` | `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config.py` | Expected path is unchanged; hardened extraction removes wrappers/mock literals and keeps the true path in the measured top-5. |
| baseline-bge | 14 | no | yes | harness fix only | `.opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts` | `.opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts` | Expected path is unchanged; hardened extraction removes wrappers/mock literals and keeps the true path in the measured top-5. |
| baseline-bge | 16 | yes | yes | unchanged | `.opencode/skills/system-code-graph/mcp_server/tests/readiness-marker-atomic-write.vitest.ts` | `.opencode/skills/system-code-graph/mcp_server/tests/readiness-marker-atomic-write.vitest.ts` |  |
| baseline-bge | 18 | no | yes | harness fix only | `.opencode/skills/mcp-coco-index/mcp_server/tests/test_refresh_split.py` | `.opencode/skills/mcp-coco-index/mcp_server/tests/test_refresh_split.py` | Expected path is unchanged; hardened extraction removes wrappers/mock literals and keeps the true path in the measured top-5. |
| bge-path-class | 1 | no | no | unchanged | `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/registry.ts` | `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/registry.ts` |  |
| bge-path-class | 3 | yes | yes | unchanged | `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config.py` | `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config.py` |  |
| bge-path-class | 5 | yes | no | rerun/parser regression to inspect | `.opencode/skills/system-code-graph/mcp_server/tests/code-graph-status-readiness-snapshot.vitest.ts` | `.opencode/skills/system-code-graph/mcp_server/tests/code-graph-status-readiness-snapshot.vitest.ts` | Expected path unchanged but the fresh corrected run no longer reports it in top-5; leave as measured residual risk, not a fixture correction. |
| bge-path-class | 10 | no | yes | fixture fix only | `.opencode/skills/system-spec-kit/scripts/dist/memory/generate-context.js` | `.opencode/skills/system-spec-kit/scripts/memory/generate-context.ts` | Probe 10 original target had 0 vec/FTS rows and matched `**/dist`; corrected target is indexed TypeScript source. |
| bge-path-class | 11 | no | yes | harness fix only | `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config.py` | `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config.py` | Expected path is unchanged; hardened extraction removes wrappers/mock literals and keeps the true path in the measured top-5. |
| bge-path-class | 14 | no | yes | harness fix only | `.opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts` | `.opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts` | Expected path is unchanged; hardened extraction removes wrappers/mock literals and keeps the true path in the measured top-5. |
| bge-path-class | 16 | yes | yes | unchanged | `.opencode/skills/system-code-graph/mcp_server/tests/readiness-marker-atomic-write.vitest.ts` | `.opencode/skills/system-code-graph/mcp_server/tests/readiness-marker-atomic-write.vitest.ts` |  |
| bge-path-class | 18 | no | yes | harness fix only | `.opencode/skills/mcp-coco-index/mcp_server/tests/test_refresh_split.py` | `.opencode/skills/mcp-coco-index/mcp_server/tests/test_refresh_split.py` | Expected path is unchanged; hardened extraction removes wrappers/mock literals and keeps the true path in the measured top-5. |
| jina-v3 | 1 | no | no | unchanged | `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/registry.ts` | `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/registry.ts` |  |
| jina-v3 | 3 | yes | yes | unchanged | `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config.py` | `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config.py` |  |
| jina-v3 | 5 | no | no | unchanged | `.opencode/skills/system-code-graph/mcp_server/tests/code-graph-status-readiness-snapshot.vitest.ts` | `.opencode/skills/system-code-graph/mcp_server/tests/code-graph-status-readiness-snapshot.vitest.ts` |  |
| jina-v3 | 10 | no | yes | fixture fix only | `.opencode/skills/system-spec-kit/scripts/dist/memory/generate-context.js` | `.opencode/skills/system-spec-kit/scripts/memory/generate-context.ts` | Probe 10 original target had 0 vec/FTS rows and matched `**/dist`; corrected target is indexed TypeScript source. |
| jina-v3 | 11 | yes | yes | unchanged | `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config.py` | `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config.py` |  |
| jina-v3 | 14 | yes | yes | unchanged | `.opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts` | `.opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts` |  |
| jina-v3 | 16 | yes | yes | unchanged | `.opencode/skills/system-code-graph/mcp_server/tests/readiness-marker-atomic-write.vitest.ts` | `.opencode/skills/system-code-graph/mcp_server/tests/readiness-marker-atomic-write.vitest.ts` |  |
| jina-v3 | 18 | yes | yes | unchanged | `.opencode/skills/mcp-coco-index/mcp_server/tests/test_refresh_split.py` | `.opencode/skills/mcp-coco-index/mcp_server/tests/test_refresh_split.py` |  |

## Audit Facts

- Probe 10 audit: vec_count=0, fts_count=0, exclusion match=`**/dist`.
- Historical artifacts are preserved: `phase2-comparison.md` and the original `*.results.jsonl` files were not overwritten; corrected artifacts use `-corrected` suffixes.
