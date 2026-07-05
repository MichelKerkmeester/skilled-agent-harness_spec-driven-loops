---
title: "System Code Graph Tool Surface"
description: "Per-tool contract reference for the 8 MCP tools exposed by mk-code-index: purpose, handler file, key preconditions, and token budget."
trigger_phrases:
  - "code-graph tool list"
  - "code-graph tool surface"
  - "mk-code-index tools"
  - "code-graph tool contracts"
importance_tier: "normal"
contextType: "implementation"
version: 1.2.0.9
---

# System Code Graph Tool Surface

The 8 MCP tools registered by `mk-code-index` with the handler file, primary purpose, key preconditions, and token budget.

---

## 1. OVERVIEW

### Purpose

Map the `mk-code-index` MCP tools to their runtime handlers, families, key preconditions, and expected token budget.

### When to Use

- Routing operator prompts that name `code_graph_*` or `detect_changes`.
- Checking which tools are readiness-gated before dispatch.
- Updating documentation after `CODE_GRAPH_TOOL_SCHEMAS` changes.

### Core Principle

Tool schemas are runtime authority; this reference is the operator map that keeps routing and docs aligned.

### Key Sources

The authoritative tool list lives in `mcp_server/tool-schemas.ts` as `CODE_GRAPH_TOOL_SCHEMAS` (an exported array). This reference summarizes that surface for operators and routing logic. When the schema array and this reference disagree, the schema array wins — patch this doc.

### Tool families

- **Read-path (3):** `code_graph_query`, `code_graph_context`, `detect_changes` — all gated by readiness.
- **Maintenance (5):** `code_graph_scan`, `code_graph_status`, `code_graph_verify`, `code_graph_apply`, `code_graph_classify_query_intent`.

### Durations and timeouts

The daemon-backed CLI default timeout is 30s. `code_graph_apply` runs a preflight gold-query battery, the requested operation, and a postflight battery; `dryRun:true` also runs both batteries, so apply invocations routinely exceed 30s. For CLI apply calls, pass an explicit `--timeout-ms` such as `120000` or higher.

### Compaction and maintenance

The code-graph database currently has no automatic `VACUUM` or checkpoint policy beyond a rollback-path WAL truncate. Deletions and tombstones accumulate; manual maintenance, such as offline `VACUUM` with the daemon stopped, is the only compaction path today.

---

## 2. TOOL TABLE

| # | Tool | Family | Purpose | Key Preconditions | Token Budget |
|---|---|---|---|---|---|
| 1 | `code_graph_scan` | Maintenance | Build / refresh the structural code graph. Incremental by default (skips unchanged files by content hash). | None for empty graph; for full re-scan over populated graph requires `forceScopeChange: true` if scope fingerprint differs. | 1000 |
| 2 | `code_graph_query` | Read | Query structural relationships: `outline`, `calls_from`, `calls_to`, `imports_from`, `imports_to`, `blast_radius`. | `readiness === "fresh"` — returns `blocked` payload otherwise. | 1200 |
| 3 | `code_graph_classify_query_intent` | Maintenance | Classify natural-language queries into `{structural, semantic, hybrid}` for routing. | None — operates on text input only. | 300 |
| 4 | `code_graph_context` | Read | Build LLM-oriented compact graph neighborhoods. Accepts manual seeds or graph seeds. Modes: `neighborhood`, `outline`, `impact`. | `readiness === "fresh"`. Returns `blocked` with `requiredAction: "code_graph_scan"` otherwise. | 1200 |
| 5 | `code_graph_status` | Maintenance | Report graph health: totals, freshness, trust state, last scan, schema version, parse health, quality summary. Read-only. | None — always answerable. | 500 |
| 6 | `code_graph_verify` | Maintenance | Run the persisted gold-query battery against the current graph. Supports category filter, fail-fast, baseline persistence. | `readiness === "fresh"`. Returns `blocked` otherwise. | 1000 |
| 7 | `code_graph_apply` | Maintenance | Verification-gated recovery: `rescan`, `prune-excludes`, `repair-nodes`, `recover-sqlite-corruption`, `rollback-bad-apply`. Pre/post battery + JSONL audit log. | Hard-stale recovery and ALL destructive operations (`recover-sqlite-corruption`, `rollback-bad-apply`) require `confirm: true` regardless of staleness. `repair-nodes` requires `crashRootCauseAddressed: true`. | 1000 |
| 8 | `detect_changes` | Read | Map a unified-diff to affected symbols via line-range overlap. Refuses on non-fresh state (returns `blocked`, not empty `affectedSymbols[]`). | `readiness === "fresh"`. `diff` is required (unified-diff text). | 1200 |

---

## 3. HANDLER MAP

Each tool dispatches through `mcp_server/tools/code-graph-tools.ts` into the flat `mcp_server/handlers/*.ts` layer, then into focused `mcp_server/lib/*.ts` modules:

| Tool | Schema | Handler |
|---|---|---|
| `code_graph_scan` | `mcp_server/tool-schemas.ts` (`codeGraphScan`) | `mcp_server/tools/code-graph-tools.ts` → `mcp_server/handlers/scan.ts` → `mcp_server/lib/structural-indexer.ts` |
| `code_graph_query` | `tool-schemas.ts` (`codeGraphQuery`) | `tools/code-graph-tools.ts` → `handlers/query.ts` → `lib/query-result-adapter.ts` / `lib/code-graph-db.ts` |
| `code_graph_classify_query_intent` | `tool-schemas.ts` (`codeGraphClassifyQueryIntent`) | `tools/code-graph-tools.ts` → `handlers/classify-query-intent.ts` → `lib/query-intent-classifier.ts` |
| `code_graph_context` | `tool-schemas.ts` (`codeGraphContext`) | `tools/code-graph-tools.ts` → `handlers/context.ts` → `lib/code-graph-context.ts` |
| `code_graph_status` | `tool-schemas.ts` (`codeGraphStatus`) | `tools/code-graph-tools.ts` → `handlers/status.ts` → `lib/code-graph-db.ts` / `lib/readiness-contract.ts` |
| `code_graph_verify` | `tool-schemas.ts` (`codeGraphVerify`) | `tools/code-graph-tools.ts` → `handlers/verify.ts` → `lib/gold-query-verifier.ts` / `lib/gold-battery-runner.ts` |
| `code_graph_apply` | `tool-schemas.ts` (`codeGraphApply`) | `tools/code-graph-tools.ts` → `handlers/apply.ts` → `lib/apply-orchestrator.ts` / `lib/recovery-procedures.ts` |
| `detect_changes` | `tool-schemas.ts` (`detectChanges`) | `tools/code-graph-tools.ts` → `handlers/detect-changes.ts` → `lib/diff-parser.ts` / `lib/code-graph-db.ts` |

The runtime topology is flat: there are no `lib/scan/`, `lib/query/`, `lib/context/`, `lib/status/`, `lib/verify/`, `lib/apply/` or `lib/detect-changes/` directories. The schema registry and dispatch switch in `mcp_server/tools/code-graph-tools.ts`, together with `mcp_server/handlers/index.ts`, are the source of truth for tool-to-handler mapping.

---

## 4. NAMESPACING

All tools are invoked through the MCP namespace `mcp__mk_code_index__*`. MCP converts hyphens in the server name (`mk-code-index`) to underscores in the namespace prefix. Examples:

```text
mcp__mk_code_index__code_graph_scan
mcp__mk_code_index__code_graph_query

```

The same 8-tool surface is also reachable through the daemon-backed CLI shim `.opencode/bin/code-index.cjs` (for example `code-index code_graph_status --format json`). The CLI is an additive dual-stack fallback over the same warm daemon, not a replacement for the MCP registration: `--warm-only` probes the daemon socket without cold-spawning, and exit `75` signals retryable daemon/IPC unavailability.

Direct library consumers in `system-spec-kit` handlers and hooks bypass MCP and import from `system-code-graph/mcp_server/lib/*` via the boundary at `system-spec-kit/mcp_server/lib/code-graph-boundary.ts`. They do not call the MCP-namespaced tool IDs.

---

## 5. RELATED RESOURCES

- [`../readiness/readiness_and_scope_fingerprint.md`](../readiness/readiness_and_scope_fingerprint.md) — read-path readiness contract that gates tools 2, 4, 6, 8.
- [`../config/database_path_policy.md`](../config/database_path_policy.md) — canonical database path for all 8 tools.
- [`naming_conventions.md`](naming_conventions.md) — name map across skill folder, MCP server, launcher, and config key.
- [`../../mcp_server/tool-schemas.ts`](../../mcp_server/tool-schemas.ts) — schema array; canonical source.
