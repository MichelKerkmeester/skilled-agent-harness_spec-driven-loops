# Resource Map - gpt55r2-a-7

## Scope
Review lineage artifacts for `A-search-retrieval`.

## Reviewed Code Paths
| Path | Role | Findings |
|------|------|----------|
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts` | Main search handler, community fallback, formatting handoff | F001 |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/community-search.ts` | Community summary fallback member-id source | F001 |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts` | Stage 1 candidate generation and fallback channels | F002, F003, F004 |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/memory-summaries.ts` | Summary embedding retrieval | F002 |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/llm-reformulation.ts` | Deep-mode LLM query reformulation | F003 |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts` | Canonical descendant folder scoping comparator | F004 evidence |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts` | Hard-exclusion contract evidence | F002 evidence |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts` | Lexical default deprecated exclusion evidence | F002 evidence |
| `.opencode/skills/system-spec-kit/mcp_server/formatters/search-results.ts` | Recovery/response formatting containment check | no finding |
| `.opencode/skills/system-spec-kit/mcp_server/tests/community-search.vitest.ts` | Existing governance-scope tests | F001 coverage gap |

## Artifact Files
| Artifact | Purpose |
|----------|---------|
| `deep-review-config.json` | Run configuration and lineage binding |
| `deep-review-state.jsonl` | Append-only config, iteration, adjudication, synthesis state |
| `deep-review-findings-registry.json` | Reducer-style active finding registry |
| `deep-review-strategy.md` | Dimension coverage and next focus |
| `deep-review-dashboard.md` | Human-readable status summary |
| `iterations/iteration-001.md` | Evidence-backed iteration narrative |
| `review-report.md` | Final synthesized review report |
