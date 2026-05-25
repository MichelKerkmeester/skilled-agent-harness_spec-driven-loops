---
title: "System Code Graph Tool Surface"
description: "Per-tool contract reference for the 8 MCP tools exposed by mk-code-index: purpose, handler file, key preconditions, and token budget."
trigger_phrases:
  - "code-graph tool list"
  - "code-graph tool surface"
  - "mk-code-index tools"
  - "code-graph tool contracts"
---

# System Code Graph Tool Surface

The 8 MCP tools registered by `mk-code-index` with the handler file, primary purpose, key preconditions, and token budget.

---

<!-- ANCHOR:1-overview -->
## 1. OVERVIEW

### Purpose

Map the `mk-code-index` MCP tools to their runtime handlers, families, key preconditions, and expected token budget.

### When to Use

- Routing operator prompts that name `code_graph_*`, `detect_changes`, or `code_graph_* and detect_changes`.
- Checking which tools are readiness-gated before dispatch.
- Updating documentation after `CODE_GRAPH_TOOL_SCHEMAS` changes.

### Core Principle

Tool schemas are runtime authority; this reference is the operator map that keeps routing and docs aligned.

### Key Sources

The authoritative tool list lives in `mcp_server/tool-schemas.ts` as `CODE_GRAPH_TOOL_SCHEMAS` (an exported array). This reference summarizes that surface for operators and routing logic. When the schema array and this reference disagree, the schema array wins — patch this doc.

### Tool families

- **Read-path (3):** `code_graph_query`, `code_graph_context`, `detect_changes` — all gated by readiness.
- **Maintenance (5):** `code_graph_scan`, `code_graph_status`, `code_graph_verify`, `code_graph_apply`, `code_graph_classify_query_intent`.
- **structural tool (3):** `code_graph_status`, `code_graph_scan`, `code_graph_verify` — coordinate with structural search (semantic search).

---

<!-- /ANCHOR:1-overview -->

<!-- ANCHOR:2-tool-table -->
## 2. TOOL TABLE

| # | Tool | Family | Purpose | Key Preconditions | Token Budget |
|---|---|---|---|---|---|
| 1 | `code_graph_scan` | Maintenance | Build / refresh the structural code graph. Incremental by default (skips unchanged files by content hash). | None for empty graph; for full re-scan over populated graph requires `forceScopeChange: true` if scope fingerprint differs. | 1000 |
| 2 | `code_graph_query` | Read | Query structural relationships: `outline`, `calls_from`, `calls_to`, `imports_from`, `imports_to`, `blast_radius`. | `readiness === "fresh"` — returns `blocked` payload otherwise. | 1200 |
| 3 | `code_graph_classify_query_intent` | Maintenance | Classify natural-language queries into `{structural, semantic, hybrid}` for routing. | None — operates on text input only. | 300 |
| 4 | `code_graph_context` | Read | Build LLM-oriented compact graph neighborhoods. Accepts structural search seeds, manual seeds, or graph seeds. Modes: `neighborhood`, `outline`, `impact`. | `readiness === "fresh"`. Returns `blocked` with `requiredAction: "code_graph_scan"` otherwise. | 1200 |
| 5 | `code_graph_status` | Maintenance | Report graph health: totals, freshness, trust state, last scan, schema version, parse health, quality summary. Read-only. | None — always answerable. | 500 |
| 6 | `code_graph_verify` | Maintenance | Run the persisted gold-query battery against the current graph. Supports category filter, fail-fast, baseline persistence. | `readiness === "fresh"`. Returns `blocked` otherwise. | 1000 |
| 7 | `code_graph_apply` | Maintenance | Verification-gated recovery: `rescan`, `prune-excludes`, `repair-nodes`, `recover-sqlite-corruption`, `rollback-bad-apply`. Pre/post battery + JSONL audit log. | Hard-stale recovery requires `confirm: true`. `repair-nodes` requires `crashRootCauseAddressed: true`. | 1000 |
| 8 | `detect_changes` | Read | Map a unified-diff to affected symbols via line-range overlap. Refuses on non-fresh state (returns `blocked`, not empty `affectedSymbols[]`). | `readiness === "fresh"`. `diff` is required (unified-diff text). | 1200 |
| 9 | `code_graph_status` | structural | Check structural search availability: `available`, `binaryPath`, `indexExists`, `indexSize`, `recommendation`. | None — probe is non-destructive. | n/a |
| 10 | `code_graph_scan` | structural | Trigger structural search incremental (or full) re-index. | structural search binary must be installed and on PATH. | n/a |
| 8 | `code_graph_verify` | structural | Submit quality feedback on structural search search results (`helpful` / `not_helpful` / `partial`). | `query` and `rating` are required. | n/a |

---

<!-- /ANCHOR:2-tool-table -->

<!-- ANCHOR:3-handler-map -->
## 3. HANDLER MAP

Each tool's runtime handler lives under `mcp_server/`:

| Tool | Schema | Handler |
|---|---|---|
| `code_graph_scan` | `mcp_server/tool-schemas.ts` (`codeGraphScan`) | `mcp_server/tools/code-graph-tools.ts` (dispatch) → `mcp_server/lib/scan/` |
| `code_graph_query` | `tool-schemas.ts` (`codeGraphQuery`) | `tools/code-graph-tools.ts` → `lib/query/` + `lib/blast-radius/` |
| `code_graph_classify_query_intent` | `tool-schemas.ts` (`codeGraphClassifyQueryIntent`) | `tools/code-graph-tools.ts` → `lib/query-intent-classifier.ts` |
| `code_graph_context` | `tool-schemas.ts` (`codeGraphContext`) | `tools/code-graph-tools.ts` → `lib/context/` |
| `code_graph_status` | `tool-schemas.ts` (`codeGraphStatus`) | `tools/code-graph-tools.ts` → `lib/status/` |
| `code_graph_verify` | `tool-schemas.ts` (`codeGraphVerify`) | `tools/code-graph-tools.ts` → `lib/verify/` |
| `code_graph_apply` | `tool-schemas.ts` (`codeGraphApply`) | `tools/code-graph-tools.ts` → `lib/apply/` |
| `detect_changes` | `tool-schemas.ts` (`detectChanges`) | `tools/code-graph-tools.ts` → `lib/detect-changes/` |
| `code_graph_status` | `tool-schemas.ts` (`cccStatus`) | `tools/code-graph-tools.ts` → `lib/ccc/` |
| `code_graph_scan` | `tool-schemas.ts` (`cccReindex`) | `tools/code-graph-tools.ts` → `lib/ccc/` |
| `code_graph_verify` | `tool-schemas.ts` (`cccFeedback`) | `tools/code-graph-tools.ts` → `lib/ccc/` |

Library paths (`lib/scan/`, `lib/query/`, etc.) are approximate — see `mcp_server/tools/code-graph-tools.ts` for the actual dispatch table. Names move; the schema-to-handler mapping in `tools/code-graph-tools.ts` is the runtime source of truth.

---

<!-- /ANCHOR:3-handler-map -->

<!-- ANCHOR:4-namespacing -->
## 4. NAMESPACING

All tools are invoked through the MCP namespace `mcp__mk_code_index__*`. MCP converts hyphens in the server name (`mk-code-index`) to underscores in the namespace prefix. Examples:

```text
mcp__mk_code_index__code_graph_scan
mcp__mk_code_index__code_graph_query

```

Direct library consumers in `system-spec-kit` handlers and hooks bypass MCP and import from `system-code-graph/mcp_server/lib/*` via the boundary at `system-spec-kit/mcp_server/lib/code-graph-boundary.ts`. They do not call the MCP-namespaced tool IDs.

---

<!-- /ANCHOR:4-namespacing -->

<!-- ANCHOR:5-related-resources -->
## 5. RELATED RESOURCES

- [`../readiness/readiness_and_scope_fingerprint.md`](../readiness/readiness_and_scope_fingerprint.md) — read-path readiness contract that gates tools 2, 4, 6, 8.
- [`../integrations/ccc_bridge_integration.md`](../integrations/ccc_bridge_integration.md) — when and how to use `code_graph_* and detect_changes` tools alongside structural search MCP.
- [`../config/database_path_policy.md`](../config/database_path_policy.md) — canonical database path for all 8 tools.
- [`naming_conventions.md`](naming_conventions.md) — name map across skill folder, MCP server, launcher, and config key.
- [`../../mcp_server/tool-schemas.ts`](../../mcp_server/tool-schemas.ts) — schema array; canonical source.

<!-- /ANCHOR:5-related-resources -->
