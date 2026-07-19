---
title: "Per-memory history log"
description: "Covers the per-record audit trail that records ADD, UPDATE and DELETE mutation events in the `memory_history` table."
trigger_phrases:
  - "per-memory history log"
  - "memory_history"
  - "mutation audit trail"
  - "add update delete history events"
version: 3.6.0.13
---

# Per-memory history log

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Covers the per-record audit trail that records ADD, UPDATE and DELETE mutation events in the `memory_history` table.

Every time a spec-doc record is created, changed or deleted, the system writes a log entry recording what happened, when and who did it. This is like a change history on a shared document. If something looks wrong later, you can trace back to exactly what changed and when it happened.

---

## 2. HOW IT WORKS

The `memory_history` table records a per-record audit trail of mutation events. Each row captures the spec-doc record ID, event type (`ADD`, `UPDATE`, `DELETE`), timestamp, actor and optional `prev_value`/`new_value` payloads. This provides a lifecycle trace for individual memories and supports audit/debug workflows such as "show me all mutation events for memory #42."

The history log is written by mutation handlers (`memory_save`, `memory_update`, `memory_delete`, `memory_bulk_delete`) and lower-level mutation helpers, including the post-merge atomic save commit and deletion helpers. `lib/storage/history.ts` owns schema-safe initialization/migration and read/write helpers, while `vector-index-schema.ts` ensures initialization runs at DB startup. The orphan cleanup script removes orphaned history rows when parent memories are missing.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/skills/system-spec-kit/mcp-server/lib/storage/history.ts` | Lib | History table init/migration and `recordHistory`/query helpers |
| `.opencode/skills/system-spec-kit/mcp-server/lib/search/vector-index-schema.ts` | Lib | DB startup initialization for `memory_history` |
| `.opencode/skills/system-spec-kit/mcp-server/handlers/save/atomic-index-memory.ts` | Handler | Atomic save commit that writes history for the post-merge path |
| `.opencode/skills/system-spec-kit/mcp-server/handlers/save/create-record.ts` | Handler | Writes `ADD` events in save flow |
| `.opencode/skills/system-spec-kit/mcp-server/handlers/memory-crud-update.ts` | Handler | Writes `UPDATE` events in update flow |
| `.opencode/skills/system-spec-kit/mcp-server/handlers/memory-crud-delete.ts` | Handler | Writes `DELETE` events in delete flow |
| `.opencode/skills/system-spec-kit/mcp-server/handlers/memory-bulk-delete.ts` | Handler | Writes `DELETE` events for bulk tier deletion |
| `.opencode/skills/system-spec-kit/mcp-server/lib/search/vector-index-mutations.ts` | Lib | Writes `DELETE` events for mutation API delete helpers |
| `.opencode/skills/system-spec-kit/scripts/memory/cleanup-orphaned-vectors.ts` | Script | Removes orphaned `memory_history` rows and orphaned vectors |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/system-spec-kit/mcp-server/tests/history.vitest.ts` | Automated test | History schema migration, actor format coverage, and boundary validation |
| `.opencode/skills/system-spec-kit/mcp-server/tests/memory-crud-extended.vitest.ts` | Automated test | Mutation handler integration paths that write history events |

---

## 4. SOURCE METADATA
- Group: Mutation
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `mutation/per-memory-history-log.md`
Related references:
- [correction-tracking-with-undo.md](../../feature-catalog/mutation/correction-tracking-with-undo.md) — Correction tracking with undo
- [reconsolidation-conflict-transaction-helper.md](../../feature-catalog/mutation/reconsolidation-conflict-transaction-helper.md) — Reconsolidation conflict transaction helper
