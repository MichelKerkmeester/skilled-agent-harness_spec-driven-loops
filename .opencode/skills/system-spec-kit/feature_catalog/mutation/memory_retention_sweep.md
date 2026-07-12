---
title: "Memory retention sweep (memory_retention_sweep)"
description: "Governed MCP mutation tool that closes expired memory_index.delete_after rows with dry-run support, history writes, governance audit rows, and mutation-ledger recording."
trigger_phrases:
  - "memory_retention_sweep"
  - "retention sweep"
  - "delete_after rows"
  - "retention_expired"
version: 3.6.0.11
---

# Memory retention sweep (memory_retention_sweep)

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

`memory_retention_sweep` enforces governed retention metadata by finding `memory_index.delete_after` timestamps in the past and deleting those spec-doc records through the normal vector-index deletion path.

The tool exists so retention closure is explicit, auditable, and callable through MCP rather than hidden inside ad hoc cleanup scripts.

---

## 2. HOW IT WORKS

The handler calls `checkDatabaseUpdated()`, opens the vector-index database, and returns a structured MCP error if the database is unavailable. On success it calls `runMemoryRetentionSweep()` with `dryRun` support, returns candidate rows and deleted IDs, and emits a hint when dry-run mode found expired rows.

The governance library selects expired rows with `datetime(delete_after) < datetime('now')`. Dry runs return candidates and leave storage untouched. Non-dry runs initialize history, execute the sweep in a SQLite transaction, delete each candidate through `vectorIndex.deleteMemory()`, record a `DELETE` history event, write a governance audit decision with `reason: "retention_expired"`, and append a consolidated mutation-ledger entry when at least one row was deleted.

The MCP schema registers the tool under L4 mutation and the memory-tool dispatcher routes `memory_retention_sweep` to the handler. The tool contributes to the current `mk-spec-memory` server's tool count (canonical source: `TOOL_DEFINITIONS.length` in `mcp_server/tool-schemas.ts`).

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `mcp_server/handlers/memory-retention-sweep.ts:13-84` | Handler | MCP entry point, database availability check, dry-run hinting, success/error envelopes |
| `mcp_server/lib/governance/memory-retention-sweep.ts:52-68` | Governance lib | Selects expired `delete_after` rows in deterministic order |
| `mcp_server/lib/governance/memory-retention-sweep.ts:107-209` | Governance lib | Runs dry-run or transactional deletion with history, audit, and ledger writes |
| `mcp_server/tool-schemas.ts:329-333` | Tool schema | Declares the `memory_retention_sweep` MCP tool and `dryRun` input |
| `mcp_server/tool-schemas.ts:921-927` | Tool registry | Adds the tool to the canonical `TOOL_DEFINITIONS` list |
| `mcp_server/tools/memory-tools.ts:65-75` | Dispatcher | Includes `memory_retention_sweep` in the memory tool-name set |
| `mcp_server/tools/memory-tools.ts:108-110` | Dispatcher | Routes validated calls to `handleMemoryRetentionSweep()` |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `mcp_server/tests/memory-retention-sweep.vitest.ts` | Vitest | Covers dry-run, deletion, ledger/audit behavior, and handler envelopes |
| `mcp_server/tests/tool-input-schema.vitest.ts` | Vitest | Validates strict MCP tool schemas against `TOOL_DEFINITIONS` |

---

## 4. SOURCE METADATA
- Group: Mutation
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `mutation/memory_retention_sweep.md`

- Packet source: `005-memory-retention-sweep`
Related references:
- [reconsolidation-conflict-transaction-helper.md](reconsolidation_conflict_transaction_helper.md) — Reconsolidation conflict transaction helper
