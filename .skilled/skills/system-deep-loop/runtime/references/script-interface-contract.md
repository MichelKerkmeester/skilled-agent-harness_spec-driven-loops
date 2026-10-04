---
title: Deep Loop Runtime Script Interface Contract
description: Formal contract for the direct .cjs script entry points that replaced the removed deep_loop_graph MCP tools.
trigger_phrases:
  - "deep-loop runtime scripts"
  - "script interface contract"
  - "deep_loop_graph replacement scripts"
  - "coverage graph script exit codes"
importance_tier: important
contextType: implementation
version: 1.4.0.3
---

# Deep Loop Runtime Script Interface Contract

Formal contract for the direct `.cjs` script entry points under `.skilled/skills/system-deep-loop/runtime/scripts/`.

---

## 1. OVERVIEW

The 118 FULL_ISOLATE_NO_MCP arc removed the four deep-loop graph tools the retired memory server used to expose. Their live replacement is direct process invocation through four `.cjs` scripts.

| Script | Replaces | Purpose |
|---|---|---|
| `scripts/convergence.cjs` | `deep_loop_graph_convergence` | Computes graph-aware continue or stop decisions. |
| `scripts/upsert.cjs` | `deep_loop_graph_upsert` | Stores graph nodes and edges. |
| `scripts/query.cjs` | `deep_loop_graph_query` | Reads graph views. |
| `scripts/status.cjs` | `deep_loop_graph_status` | Reports graph health. |

Every script follows the same lifecycle: parse CLI args, re-exec through the TSX loader when needed, import the TypeScript library, open SQLite through `coverage-graph-db.ts`, execute, emit one JSON object to stdout, close DB in `finally`, and map failures to exit codes.

---

## 2. SHARED PROCESS CONTRACT

### Loader Contract

- Scripts are Node executables with `#!/usr/bin/env node`.
- Line 2 is `'use strict';`.
- Scripts resolve `system-spec-kit/runtime/cli/node_modules/tsx/dist/loader.mjs`.
- If `DEEP_LOOP_TSX_LOADED !== '1'`, the script spawns Node with `--import <tsx-loader>` and original args.
- The child receives cwd, env plus `DEEP_LOOP_TSX_LOADED=1`, and stdin when stdin is not a TTY.

### Stdout Contract

- Stdout is JSON-only for workflow-facing responses.
- Success uses `status: "ok"`.
- Failure uses `status: "error"`, `error`, and `code`.
- Script errors may write diagnostic stack JSON to stderr.
- Workflow YAML should parse stdout, not stderr.

### Read-Only Mode

- `status.cjs`, `query.cjs` and `convergence.cjs` accept `--read-only`. Each selects the coverage database except for `--loop-type council`, which selects the council database. Existing files use the module's read-only SQLite opener. When both WAL side files are absent, coverage opens a header-adjusted byte buffer and council tries an immutable URI. Otherwise, both open the database path as read-only. If the council URI open fails, it falls back to a read-only path open.
- An absent database is served from `:memory:` after the opener creates its schema and version row there. The opener creates no directory or on-disk database file and returns `databasePresent: false`. Status reports zero counts, query returns empty query results, coverage convergence returns `CONTINUE` and council convergence returns `STOP_BLOCKED`. Successful responses put `readOnly: true` and the boolean `databasePresent` in `data`.
- For an existing database, the main database file is opened read-only. The opener does not apply schema SQL or update the on-disk version row, and it creates no directory or main database file. Status and convergence skip observability event appends. Query has no append path. Convergence also skips snapshot creation. Both modules' source comments warn that path-opening a WAL database can recreate missing `-wal` or `-shm` files on first query. The buffer and immutable URI avoid that path when both side files are absent. The council opener also falls back to the path if its immutable URI open fails, so the code does not guarantee zero side-file writes in every path-open case.
- In convergence, `--read-only` disables `--persist-snapshot`. Nonempty coverage and council results report `data.snapshotPersistence: "not_requested"` even if persistence was requested. Empty coverage returns before adding that field. Empty council returns before persistence and its persistence field. Council also does not require `--round-id` when read-only mode disables persistence.
- `upsert.cjs` has no read-only mode.

### Exit-Code Matrix

| Exit code | Meaning | Source condition |
|---:|---|---|
| 0 | OK | Valid input and successful operation. |
| 1 | Script error | Unexpected runtime failure or uncategorized exception. |
| 2 | DB error | SQLite or DB lifecycle failure. |
| 3 | Input validation error | Missing args, invalid loop type, invalid query type, malformed JSON, or unexpected positional args. |

### Required Namespace Args

| Arg | Required | Values | Notes |
|---|---|---|---|
| `--spec-folder` | Yes | path string | Stored as `specFolder`. |
| `--loop-type` | Yes | `research`, `review` or `council` | Validated before DB operations. |
| `--session-id` | Yes | string | Scopes graph reads and writes to one loop lineage. |

---

## 3. SCRIPT CONTRACTS

### convergence.cjs

Source: `.skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs`

Additional args: `--iteration`, `--persist-snapshot`, `--read-only`.

Workflow-facing fields: `graph_decision`, `graph_signals_json`, `graph_blockers_json`, `graph_stop_blocked`, `graph_convergence_score`.

Behavior: Returns `CONTINUE` for empty graphs, `STOP_BLOCKED` when blocking guards fail, and `STOP_ALLOWED` when all convergence signals pass.

### upsert.cjs

Source: `.skilled/skills/system-deep-loop/runtime/scripts/upsert.cjs`

Additional args: `--nodes`, `--edges`, or `--events`.

Workflow-facing fields: `graph_nodes_json`, `graph_edges_json`, `graph_upsert_event_count`.

Behavior: Requires at least one node or edge, validates kinds and relations by loop type, rejects self-loops, and clamps weights.

### query.cjs

Source: `.skilled/skills/system-deep-loop/runtime/scripts/query.cjs`

Additional args: `--query-type`, optional `--limit`, `--node-id`, `--max-depth`, `--read-only`.

Workflow-facing fields: `data.queryType`, `data.namespace`, query-specific arrays.

Behavior: Supports uncovered questions, coverage gaps, unverified claims, contradictions, provenance chains, and hot nodes.

### status.cjs

Source: `.skilled/skills/system-deep-loop/runtime/scripts/status.cjs`

Additional args: `--read-only`.

Workflow-facing fields: `schemaVersion`, `rowCount`, counts, breakdowns, signals.

Behavior: Reports clean empty state with null signals when no nodes exist.

---

## 4. DB LIFECYCLE REQUIREMENT

Scripts must not open SQLite directly. They import `lib/coverage-graph/coverage-graph-db.ts`, rely on lazy `getDb()` or library functions, and call `db.closeDb()` inside `finally`.

Visible anchors:

- `scripts/convergence.cjs` closes after signal and query work.
- `scripts/upsert.cjs` closes after `batchUpsert`.
- `scripts/query.cjs` closes after query dispatch.
- `scripts/status.cjs` closes after status assembly.
- `tests/lifecycle/db-open-close.vitest.ts` covers lifecycle behavior.

### Database Directory Environment Variables

| Variable | Points to | Default when unset |
|---|---|---|
| `DEEP_LOOP_COVERAGE_DB_DIR` | Directory containing `deep-loop-graph.sqlite` | `.skilled/skills/system-deep-loop/runtime/database` |
| `DEEP_LOOP_COUNCIL_DB_DIR` | Directory containing `council-graph.sqlite` | `.skilled/skills/system-deep-loop/runtime/database` |

---

## 5. PERMISSIONS-GATE RELATIONSHIP

`permissions-gate` is not called directly by the scripts, and it has zero production callers anywhere today. `evaluateToolCall` and `evaluatePreDispatchToolCalls` are not wired into any executor dispatch path. The matching logic (tool/bash-command-to-operation-class mapping, glob specificity, default-deny) is built and unit-tested. Script execution is an `execute` operation that the gate's design would allow only for runtime-owned script paths, once it is connected and a permission matrix is active. Today no permission matrix is consulted before scripts run.

Relevant source:

- `lib/deep-loop/permissions-gate.ts` maps tools and bash commands to operation classes.
- `SKILL.md` states direct `.cjs` invocation is the supported consumer path.
- `/doctor:deep-loop` calls status, query and convergence with `--read-only`. Its route is `add-only` only because the workflow writes its packet-local state log.

---

## 6. FAILURE TRIAGE

| Symptom | First check | Likely fix |
|---|---|---|
| Exit 3 | Missing namespace arg or malformed JSON | Correct CLI args or JSON quoting. |
| Exit 2 | SQLite open or query failure | Inspect schema version and DB path. |
| Exit 1 | Unexpected exception | Read stderr stack JSON, then inspect the called library. |
| Non-JSON stdout | Script contract drift | Restore JSON-only stdout or update YAML output bindings. |
| Empty convergence output | Graph has zero nodes | Upsert graph events before convergence or accept `CONTINUE`. |

---

## 7. SOURCE ANCHORS

| Path | Contract Role |
|---|---|
| `scripts/convergence.cjs` | Stop-decision script and convergence output bindings. |
| `scripts/upsert.cjs` | Mutation script and graph event ingestion. |
| `scripts/query.cjs` | Read script and query-type dispatch. |
| `scripts/status.cjs` | Health script and schema/count reporting. |
| `lib/coverage-graph/coverage-graph-db.ts` | DB lifecycle owner. |
| `lib/deep-loop/permissions-gate.ts` | Pre-dispatch execute/write matching logic is built and tested. It has zero production callers and is not wired into dispatch. |
| `tests/integration/*-script.vitest.ts` | Script-level regression coverage. |
| `tests/lifecycle/db-open-close.vitest.ts` | DB lifecycle regression coverage. |
