# Resource Map - gpt55r2-a-9

## Source Scope

The scope folder did not contain a `resource-map.md`; this lineage emitted a review-derived resource map from iteration evidence.

## Reviewed Resources

| Resource | Role | Iteration Evidence |
| --- | --- | --- |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts` | Hybrid retrieval orchestration, FTS/BM25/keyword fusion | F-A9-001 |
| `.opencode/skills/system-spec-kit/shared/algorithms/rrf-fusion.ts` | Shared RRF score accumulation | F-A9-001 |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts` | Evidence-gap detection producer | F-A9-002 |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts` | Handler bridge into formatter | F-A9-002 |
| `.opencode/skills/system-spec-kit/mcp_server/formatters/search-results.ts` | Recovery policy and citation policy consumer | F-A9-002 |
| `.opencode/skills/system-spec-kit/mcp_server/tests/empty-result-recovery.vitest.ts` | Formatter contract test for evidence-gap recovery | F-A9-002 |

## Phase-5 Augmentation

Novel logic gaps found:

| Finding | Gap |
| --- | --- |
| F-A9-001 | Keyword fusion accepts duplicate same-ID rows from FTS and BM25 aliases, allowing same-source RRF score inflation. |
| F-A9-002 | Evidence-gap boolean is produced by Stage 4 but not passed through the live handler under the formatter's expected key. |
