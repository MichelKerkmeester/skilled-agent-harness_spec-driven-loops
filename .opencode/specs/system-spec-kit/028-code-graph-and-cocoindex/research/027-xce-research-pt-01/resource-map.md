> Extracted from `027/research/027-xce-research-pt-01/resource-map.md` on 2026-05-28 (code-graph + cocoindex sections).
> Memory-topic sections and raw run-logs remain in 027.

### MCP Server — Code Graph
| Path | Lines (approx) | Purpose |
|------|---------------|---------|
| `mcp_server/code_graph/lib/code-graph-context.ts` | 642 | ContextResult schema, buildContext, formatTextBrief, impact/neighborhood/outline queryModes |
| `mcp_server/code_graph/lib/code-graph-db.ts` | ~1,250 | SQLite schema (code_files, code_nodes, code_edges, code_graph_metadata), queryEdgesFrom/To, isFileStale, resolveSubjectFilePath, queryFileDegrees, queryFileImportDependents, getTokenUsageRatio |
| `mcp_server/code_graph/lib/indexer-types.ts` | 198 | SymbolKind, EdgeType, DEFAULT_EDGE_WEIGHTS, CodeNode, CodeEdge, EdgeEvidenceClass, generateContentHash, ParseResult |
| `mcp_server/code_graph/lib/structural-indexer.ts` | ~2,200 | Recursive walk(), capturesToNodes(), skipFreshFiles, incremental indexing, writeTransaction |
| `mcp_server/code_graph/lib/tree-sitter-parser.ts` | 60 (read) | Cursor-based AST walk via web-tree-sitter WASM, produces RawCapture[] |
| `mcp_server/code_graph/lib/budget-allocator.ts` | 134 | allocateBudget(), DEFAULT_FLOORS, ALLOCATION_RESULT, overflow redistribution |
| `mcp_server/code_graph/lib/cross-file-edge-resolver.ts` | 123 | Cross-file CALLS edge reconciliation (resolved/unresolved/ambiguous stats) |
| `mcp_server/code_graph/lib/compact-merger.ts` | ~130 | estimateTokens() (chars/4 heuristic), truncateToTokens() |
| `mcp_server/code_graph/lib/diff-parser.ts` | 317 | Custom unified-diff parser, rangesOverlap(), LineChange |
| `mcp_server/code_graph/handlers/context.ts` | 416 | MCP handler: readiness gate, seed normalization, queryMode dispatch, budgetTokens, trustState |
| `mcp_server/code_graph/handlers/detect-changes.ts` | 369 | MCP handler: diff → symbol line-range overlap → affectedSymbols[] + affectedFiles[] |
| `mcp_server/code_graph/tools/code-graph-tools.ts` | 101 | MCP tool registration registry (9 code_graph tools) |


### MCP Server — Shared / Analytics
| Path | Lines (approx) | Purpose |
|------|---------------|---------|
| `mcp_server/lib/analytics/session-analytics-db.ts` | ~500 | analytics_sessions schema (prompt_tokens, completion_tokens, total_tokens, turn_count), per-turn breakdown, getSessionRow(), getSessionAggregate() |
| `mcp_server/hooks/response-hints.ts` | ~80 | extractSurfacedTokenCount() from LLM API usage envelope |
| `mcp_server/hooks/claude/session-stop.ts` | ~400 | Session-stop token persistence into analytics DB |
| `mcp_server/hooks/claude/hook-state.ts` | ~250 | State schema: estimatedPromptTokens, estimatedCompletionTokens |
| `mcp_server/lib/eval/eval-metrics.ts` | ~300 | 12 pure-computation metrics: MRR, NDCG, Recall, HitRate, Precision, F1, MAP, etc. |
| `mcp_server/lib/eval/ground-truth-generator.ts` | ~150 | Ground truth generation from labeled data |
| `mcp_server/lib/eval/ablation-framework.ts` | ~200 | Controlled channel ablation studies |
| `mcp_server/lib/eval/warm-start-variant-runner.ts` | ~200 | Evaluation variant runner |
| `mcp_server/lib/eval/eval-db.ts` | ~200 | Evaluation database persistence |
| `mcp_server/lib/eval/` | 15 files total | Full eval framework inventory |
| `mcp_server/tests/eval-metrics.vitest.ts` | 625 | 12-metric test suite + computeAllMetrics wrapper |
| `mcp_server/tests/smart-router-measurement.vitest.ts` | 184 | Static measurement harness tests |
| `scripts/observability/smart-router-measurement.ts` | 841 | Measurement engine: runMeasurement(), corpus types, report generation |
| `vitest.stress.config.ts` | 35 | Stress test config: 120s timeout, fileParallelism false |


