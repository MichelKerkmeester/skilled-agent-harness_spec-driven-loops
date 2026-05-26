# Iteration 2: Consumer & Router Mapping

[SOURCE: grep code_graph_|ccc_|detect_changes across mcp_server/*.ts, .opencode/agents/, .claude/agents/]

## Cross-Subsystem Handler Imports (stay-and-rewire)

All 5 handlers import code-graph symbols directly from `../code_graph/lib/`:

| Consumer File | Imported Symbol(s) | Source Module |
|--------------|-------------------|---------------|
| `handlers/memory-search.ts:27` | `getGraphReadinessSnapshot()` | `code_graph/lib/ensure-ready.js` |
| `handlers/session-resume.ts:14-15` | `graphDb.*`, `getGraphFreshness()`, `getOpsHardenedGraphState()`, `getOpsHardenedTrust()` | `code_graph/lib/code-graph-db.js`, `ensure-ready.js`, `ops-hardening.js` |
| `handlers/session-bootstrap.ts` | ops-hardening imports | `code_graph/lib/ops-hardening.js` |
| `handlers/session-health.ts` | ops-hardening import | `code_graph/lib/ops-hardening.js` |
| `handlers/memory-context.ts:18-19` | `classifyQueryIntent()`, `buildContext()` | `code_graph/lib/query-intent-classifier.js`, `code-graph-context.js` |

## Context Server (stay-and-rewire)

| Consumer File | Imported Symbol(s) |
|--------------|-------------------|
| `context-server.ts:88` | `graphDb.*` |
| `context-server.ts:89` | `detectRuntime()`, `RuntimeInfo` |

## Tool-Schemas (stay-and-rewire)

`tool-schemas.ts` defines inline ToolDefinition objects for all 6 code_graph_* tools (lines 562-699) + ccc_* + detect_changes. These schemas are NOT imported from code_graph/ — they're defined inline in tool-schemas.ts. This means:
- `tool-schemas.ts` has ~200 lines of code-graph schema definitions that must be re-defined or re-imported post-extraction
- `tools/index.ts:10` imports `code_graph/tools/index.js` for dispatch routing

## Tool Dispatch Registration (stay-and-rewire)

`tools/index.ts:10`: `import * as codeGraphTools from '../code_graph/tools/index.js'`

Post-extraction, this import path must point to new skill location.

## Hooks (stay-and-rewire)

| Hook File | Imported Symbol(s) | Source |
|-----------|-------------------|--------|
| `hooks/memory-surface.ts:9` | `graphDb.*` | `code_graph/lib/code-graph-db.js` |
| `hooks/claude/compact-inject.ts:18-19` | `mergeCompactBrief()`, `MergeInput` | `code_graph/lib/compact-merger.js` |
| `hooks/claude/session-prime.ts` | startup-brief symbols | implicit |
| `hooks/gemini/session-prime.ts` | startup-brief symbols | implicit |
| `hooks/gemini/compact-cache.ts` | compaction refresh | implicit |
| `hooks/codex/lib/freshness-smoke-check.ts` | freshness fallback | implicit |

## Session Snapshot (stay-and-rewire)

`lib/session/session-snapshot.ts:10-11`: imports `getStats()` and `getGraphFreshness()` from code_graph

## Skill Advisor Cross-Reference

`skill_advisor/lib/freshness/trust-state.ts:44`: type export `GraphFreshness`, `StructuralReadiness` from `../../../code_graph/lib/ops-hardening.js`
`skill_advisor/bench/code-graph-parse-latency.bench.ts:13,16`: imports `parseFile()`, `SupportedLanguage` from code_graph

These are the only skill_advisor imports of code-graph. They're type-only or bench-only — low extraction risk.

## Layer Definitions

`lib/architecture/layer-definitions.ts`: references `code_graph_query`, `code_graph_context`, `code_graph_scan`, `code_graph_status`, `code_graph_verify`, `ccc_status`, `ccc_reindex`, `ccc_feedback` in L6/L7 layer tool lists. These are string references, not imports.

## Agent Files (update)

All agent files reference code-graph tools in their allowed-tool lists and workflow descriptions:

| Agent File | References |
|-----------|-----------|
| `.opencode/agents/context.md` | code_graph_status, code_graph_query, code_graph_context in tool table, standard flow, default sequence |
| `.opencode/agents/deep-research.md` | code_graph_query, code_graph_context in allowed tools |
| `.opencode/agents/deep-review.md` | code_graph_query, code_graph_context in allowed tools |
| `.claude/agents/context.md` | mirror of .opencode/agents/context.md |
| `.claude/agents/deep-review.md` | mirror of .opencode variant |
| `.gemini/agents/context.md` | mirror |
| `.gemini/agents/deep-review.md` | mirror |
| `.codex/agents/context.toml` | mirror |
| `.codex/agents/deep-research.toml` | mirror |
| `.codex/agents/deep-review.toml` | mirror |

All are `update` disposition — no tool-id changes, but tool-id namespace references may need doc updates.

## Command Files (update)

`commands/spec_kit/deep-research.md`: code_graph_query, code_graph_context
`commands/spec_kit/deep-review.md`: same
`commands/memory/search.md`: code-graph bridging references
`commands/memory/README.txt`: tool ownership matrix
`commands/doctor.md`: code-graph target in router
`commands/doctor/_routes.yaml`: code-graph route definition
`commands/doctor/assets/doctor_code-graph.yaml`: full diagnostic workflow (move)
`commands/doctor/update.md`: dependency-ordered update includes code-graph
