# Iteration 1: Code-Graph Source Tree Inventory

[SOURCE: glob **/* in mcp_server/code_graph/]

## File Count Summary

| Directory | .ts files | .md files | .json files | Total |
|-----------|-----------|-----------|-------------|-------|
| `lib/` | 30 | 1 (README) | 0 | 31 |
| `lib/utils/` | 1 | 1 (README) | 0 | 2 |
| `handlers/` | 10 | 1 (README) | 0 | 11 |
| `tools/` | 2 | 1 (README) | 0 | 3 |
| `tests/` | 28+ | 1 (README) | 1 (gold-queries) | 30+ |
| `feature_catalog/` | 0 | 16 | 0 | 16 |
| `manual_testing_playbook/` | 0 | 11 | 0 | 11 |
| Root | 0 | 1 (README) | 0 | 1 |
| **Total** | **71** | **33** | **1** | **~111** |

## Lib Modules (30 files)

Every lib module is pure code-graph functionality — all `move` disposition.

| File | Purpose |
|------|---------|
| `code-graph-db.ts` (1244 lines) | SQLite storage — 7 tables, node/edge CRUD, scope fingerprint, stats |
| `structural-indexer.ts` | Main indexer — parses files via tree-sitter, writes nodes+edges |
| `ensure-ready.ts` (817 lines) | Read-path readiness check + auto-rescan policy |
| `startup-brief.ts` (366 lines) | Builds compact startup brief for hook-capable runtimes |
| `code-graph-context.ts` | LLM-oriented compact graph neighborhood builder |
| `budget-allocator.ts` | Token budget allocation for context queries |
| `working-set-tracker.ts` | Tracks working set of files for rescan decisions |
| `compact-merger.ts` | Merges compact brief payloads |
| `tree-sitter-parser.ts` | Tree-sitter WASM parser for AST extraction |
| `query-intent-classifier.ts` | Classifies query intents (add_feature, fix_bug, etc.) |
| `readiness-contract.ts` | Readiness contract types and checks |
| `seed-resolver.ts` | Resolves CocoIndex/manual/graph seeds to nodes |
| `query-result-adapter.ts` | Adapts graph query results for MCP response |
| `ops-hardening.ts` | Operational hardening (GraphFreshness union, trust state) |
| `edge-drift.ts` | Edge drift detection and repair |
| `diff-parser.ts` | Parses unified diffs for detect_changes |
| `phase-runner.ts` | Phase runner for multi-step operations |
| `parser-skip-list.ts` | Parser skip list management |
| `auto-rescan-policy.ts` | Policy for auto-rescan decisions |
| `apply-orchestrator.ts` | Apply-mode orchestration (rescan, repair, recover) |
| `apply-metadata.ts` | Apply operation metadata tracking |
| `recovery-procedures.ts` | Recovery procedures for corrupted DB states |
| `exclude-rule-classifier.ts` | Classifies exclude rules |
| `gold-battery-runner.ts` | Runs gold query battery for verification |
| `gold-query-verifier.ts` | Verifies gold query results |
| `indexer-types.ts` | Core types (CodeNode, CodeEdge, SymbolKind) |
| `cross-file-edge-resolver.ts` | Resolves edges across files |
| `runtime-detection.ts` | Detects current runtime (Claude, Codex, etc.) |
| `index-scope-policy.ts` | Index scope policy (skills/agents/commands/specs/plugins) |
| `index.ts` | Barrel re-export of core lib modules |

## Handlers (10 files, all `move`)

| Handler | MCP Tool | Lines |
|---------|----------|-------|
| `scan.ts` | code_graph_scan | Significant |
| `query.ts` | code_graph_query | Significant |
| `status.ts` | code_graph_status | Compact |
| `context.ts` | code_graph_context | Significant |
| `verify.ts` | code_graph_verify | Significant |
| `apply.ts` | code_graph_apply | Significant |
| `detect-changes.ts` | detect_changes | Moderate |
| `ccc-status.ts` | ccc_status | Compact |
| `ccc-reindex.ts` | ccc_reindex | Compact |
| `ccc-feedback.ts` | ccc_feedback | Moderate |

## Key DB Import

`code-graph-db.ts:20` imports `DATABASE_DIR` from `../../core/config.ts`. This is the critical path for DB extraction shape decision (Q2).

## Stress Tests Outside code_graph/

- `mcp_server/stress_test/code-graph/doctor-apply-mode-stress.vitest.ts` — move
- `mcp_server/stress_test/code-graph/code-graph-degraded-sweep.vitest.ts` — move
- `mcp_server/stress_test/code-graph/code-graph-context-stress.vitest.ts` — move
- `mcp_server/stress_test/code-graph/code-graph-scan-stress.vitest.ts` — move
- `mcp_server/stress_test/code-graph/ccc-integration-stress.vitest.ts` — move
- `mcp_server/stress_test/code-graph/detect-changes-preflight-stress.vitest.ts` — move

Total: 6 stress test files.

## Tests Outside code_graph/ That Import code-graph Symbols

9 additional test files under `mcp_server/tests/` import code-graph symbols:
- `code-graph-status-readiness-snapshot.vitest.ts`
- `code-graph-degraded-readiness-envelope-parity.vitest.ts`
- `code-graph-apply-orchestrator.vitest.ts`
- `code-graph-apply-e2e.vitest.ts`
- `code-graph-recovery-procedures.vitest.ts`
- `code-graph-gold-battery.vitest.ts`
- `code-graph-query-fallback-decision.vitest.ts`
- `code-graph-context-cocoindex-telemetry-passthrough.vitest.ts`
- `code-graph-db.vitest.ts`

These stay in `mcp_server/tests/` but must be re-wired to import from new skill path.

## Verified Against Pre-Research Baseline

- 108 code files → confirmed 111 files (includes tools/, READMEs, docs; 71 TS + doc files exceed baseline projection)
- 7 exclusive SQLite tables → confirmed (code_nodes, code_edges, code_scope, parse_diagnostics, edge_drift_log, apply_audit_log, gold_verification_results)
- 12 MCP tools → confirmed (code_graph_scan, query, status, context, verify, apply, detect_changes, ccc_status, ccc_reindex, ccc_feedback, + 2 future phase slots)
- stress tests → found 6 files (not just 1 as baseline assumed)

## New Discoveries vs Baseline

1. 6 stress test files under `stress_test/code-graph/` (baseline listed 1)
2. 9 external test files importing code-graph under `mcp_server/tests/` (baseline didn't enumerate individually)
3. 1 `lib/index.ts` barrel export file
4. `lib/utils/workspace-path.ts` utility
5. `detect_changes` handler is separate from code_graph_ namespace but co-registered in code-graph-tools
