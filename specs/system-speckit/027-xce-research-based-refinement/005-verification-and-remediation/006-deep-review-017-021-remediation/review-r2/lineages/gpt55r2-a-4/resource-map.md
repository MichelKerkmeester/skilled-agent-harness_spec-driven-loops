# Resource Map - gpt55r2-a-4

## Phase-5 Augmentation
- Novel logic gaps: F001 in community fallback scoped retrieval and F002 in summary embedding scope-then-limit retrieval.

| File | Role | Findings |
|------|------|----------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/community-search.ts` | Community summary/member lookup fallback | F001 |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts` | `memory_search` orchestration and fallback append | F001 |
| `.opencode/skills/system-spec-kit/mcp_server/formatters/search-results.ts` | Search response formatter | F001 |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/memory-summaries.ts` | Summary embedding retrieval | F002 |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts` | Stage 1 summary-channel admission/filtering | F002 |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts` | Primary vector comparator for scope and active projection | F002 |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts` | Primary lexical comparator for scope-before-limit semantics | F002 |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-types.ts` | Descendant spec-folder scope helper | F002 |

## Empty-Result Case
Not empty. Two active P1 findings were recorded.
