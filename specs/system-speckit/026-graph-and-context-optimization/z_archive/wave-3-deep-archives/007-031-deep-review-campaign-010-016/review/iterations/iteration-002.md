# Iteration 2: D1 Correctness Deep-Dive — Tool Registrations, Residual Strings

## Focus
D1 Correctness — Verify tool registrations match the `mk-code-index` namespace, check for residual `system_code_graph` strings, and validate dispatch error messages.

## Scorecard
- Dimensions covered: correctness
- Files reviewed: 6
- New findings: P0=0 P1=0 P2=3
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.50

## Findings

### P2 — Suggestion

- **F006**: architecture.md §9 open question #1 states "SKILL.md still describes 12 MCP tools, while the live schema array and dispatcher expose ten" — however SKILL.md does NOT claim 12 tools. The `CODE_GRAPH_TOOL_SCHEMAS` array (tool-schemas.ts:219-230) contains exactly 10 entries: `code_graph_scan`, `code_graph_query`, `code_graph_status`, `code_graph_context`, `code_graph_verify`, `code_graph_apply`, `detect_changes`, `ccc_status`, `ccc_reindex`, `ccc_feedback`. The dispatcher (tools/code-graph-tools.ts:24-39) also registers exactly 10 tool names plus 3 future extension slots (`code_graph_hld_lld`, `code_graph_trace`, `code_graph_impact_analysis`). The architecture.md open question is stale and should be resolved. — architecture.md:288

- **F007**: Launcher error message at mk-code-index-launcher.cjs:162 says `system-code-graph not found at ${rel(kitDir)}` — while this is technically correct (the directory IS named `system-code-graph`), it creates naming confusion for operators debugging MCP issues. The launcher file prefix is consistently `mk-code-index` (log prefix, state file, lock dir), but this one error message uses the directory name. — mk-code-index-launcher.cjs:162

- **F008**: Tool-schemas.ts exports a compatibility alias `TOOL_DEFINITIONS = CODE_GRAPH_TOOL_SCHEMAS` (line 233) that is not documented in SKILL.md, architecture.md, or README.md. The main export name `CODE_GRAPH_TOOL_SCHEMAS` matches the index.ts import (index.ts:6), but the alias exists for "moved tests and local schema smoke checks" per the comment. This is a minor discoverability gap for consumers who might encounter `TOOL_DEFINITIONS` in test code. — tool-schemas.ts:232-233

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | index.ts:8-23, tool-schemas.ts:219-230 | MCP server name `mk-code-index` correct; 10 tools registered and dispatched correctly |
| feature_catalog_code | partial | advisory | feature_catalog/06--mcp-tool-surface/01-tool-registrations.md:41-42 | Feature catalog references match live dispatch names |

## Assessment
- Novelty declining: 3 new P2 findings from 6 files (ratio 0.50)
- Architecture open question F006 adds no functional risk but is stale documentation
- All tool registrations verified: 10 tools in schema array, 10 in dispatcher, MCP key `mk_code_index` matches server name `mk-code-index`
- Residual `system_code_graph` (old underscore format) confirmed absent from all .ts source files

## Ruled Out
- Checked all .ts source files for `system_code_graph` residual: zero hits
- index.ts server name `{ name: 'mk-code-index', version: '1.0.0' }` is correct
- Tool names in tool-schemas.ts match handler names in tools/code-graph-tools.ts
- `ccc_feedback` schema correctly marks `query` and `rating` as required (line 214)

## Dead Ends
- Future extension slots in dispatcher (lines 16-18, 36-38) are intentionally left for planned tools per architecture.md §7

## Recommended Next Focus
D2 Security — operational safety, cross-skill integration boundaries, and environment handling