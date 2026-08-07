# Review Evidence Resource Map - gpt55r2-a-5

## Scope
- Review scope: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/006-deep-review-017-021-remediation/review-r2/scopes/A-search-retrieval/spec.md`
- Resource map present at init: false

## Evidence Paths
| Path | Role | Findings |
|------|------|----------|
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts` | Search handler, ranking mutation, cache key, community fallback | F001, F002, F003 |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-context.ts` | Folder discovery and internal memory_search caller | F001, F002 |
| `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts` | Strict public Zod schema and allowed parameter list | F003 |
| `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts` | Public MCP JSON schema | F003 |
| `.opencode/skills/system-spec-kit/mcp_server/context-server.ts` | Server instructions advertising retrievalLevel | F003 |
| `.opencode/skills/system-spec-kit/mcp_server/hooks/memory-surface.ts` | Hook guidance advertising retrievalLevel | F003 |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts` | Similarity producer proving 0..100 score scale | F002 |
| `.opencode/skills/system-spec-kit/mcp_server/formatters/search-results.ts` | Formatter type contract for similarity scale | F002 |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/types.ts` | Canonical effective-score normalizer | F002 |

## Phase-5 Augmentation
- Novel logic gaps: `folderBoost` cache separation, `folderBoost` score-scale normalization, and `retrievalLevel` schema parity.
- Empty-result case: not applicable; this iteration found active P1 findings.
