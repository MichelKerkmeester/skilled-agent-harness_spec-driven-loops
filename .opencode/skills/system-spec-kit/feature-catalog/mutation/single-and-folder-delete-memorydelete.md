---
title: "Single and folder delete (memory_delete)"
description: "Covers the delete tool that supports both single-record and bulk folder deletion with atomic transactions."
trigger_phrases:
  - "single and folder delete"
  - "memory_delete"
  - "delete memory"
  - "bulk folder deletion"
  - "atomic delete transaction"
version: 3.6.0.22
---

# Single and folder delete (memory_delete)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Covers the delete tool that supports both single-record and bulk folder deletion with atomic transactions.

You can remove one memory at a time or clear out an entire folder at once. Before a big deletion, the system takes a snapshot so you can undo it if you change your mind. Deletions are all-or-nothing: either everything you asked to remove is gone or nothing changes at all. This prevents situations where only half the data gets deleted and the rest is left in a messy state.

---

## 2. HOW IT WORKS

Two deletion modes in one tool. Pass a numeric `id` for single delete or a `specFolder` string (with `confirm: true`) for bulk folder delete.

Single deletes run inside a database transaction: remove the spec-doc record via `vectorIndex.deleteMemory(id)`, clean up associated causal graph edges via `causalEdges.deleteEdgesForMemory(id)` and record a mutation ledger entry. If any step fails, the entire transaction rolls back. This atomicity guarantee was added in the implementation (CR-P1-1) to prevent partial deletes from leaving orphaned data.

Bulk deletes by spec folder are more involved. The system first creates an auto-checkpoint with a timestamped name (like `pre-cleanup-2026-02-28T12-00-00`) so you can roll back if the deletion was a mistake. Then it deletes all matching spec-doc records inside a database transaction with per-record causal edge cleanup and per-record mutation ledger entries. The entire operation is atomic: either all spec-doc records in the folder are deleted or none are. The response includes the checkpoint name and a restore command hint.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp-server/handlers/memory-crud-delete.ts` | Handler | Delete handler: single-ID and bulk-folder delete with atomic transactions |
| `mcp-server/handlers/memory-crud-utils.ts` | Handler | Shared CRUD utility helpers (ledger append, hash snapshot) |
| `mcp-server/handlers/memory-crud-types.ts` | Handler | Delete argument type definitions |
| `mcp-server/handlers/mutation-hooks.ts` | Handler | Post-mutation hook dispatch (cache invalidation) |
| `mcp-server/hooks/mutation-feedback.ts` | Hook | Mutation feedback hook builder |
| `mcp-server/lib/search/vector-index.ts` | Lib | Vector index facade for `deleteMemory()` |
| `mcp-server/lib/storage/causal-edges.ts` | Lib | Causal edge cleanup per deleted memory |
| `mcp-server/lib/storage/checkpoints.ts` | Lib | Auto-checkpoint creation before bulk folder delete |
| `mcp-server/lib/storage/mutation-ledger.ts` | Lib | Mutation audit ledger |
| `mcp-server/lib/storage/history.ts` | Lib | Per-memory DELETE history writes |
| `mcp-server/lib/search/graph-search-fn.ts` | Lib | Degree cache clearing after delete |
| `mcp-server/lib/response/envelope.ts` | Lib | Response envelope formatting |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `mcp-server/tests/handler-memory-crud.vitest.ts` | Automated test | CRUD handler validation |
| `mcp-server/tests/memory-crud-extended.vitest.ts` | Automated test | Extended transactional mutation scenarios |
| `mcp-server/tests/memory-delete-cascade.vitest.ts` | Automated test | Delete cascade behavior |
| `mcp-server/tests/causal-edges.vitest.ts` | Automated test | Causal edge storage tests |
| `mcp-server/tests/causal-edges-unit.vitest.ts` | Automated test | Causal edge unit tests |
| `mcp-server/tests/mutation-ledger.vitest.ts` | Automated test | Mutation ledger tests |

---

## 4. SOURCE METADATA
- Group: Mutation
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `mutation/single-and-folder-delete-memorydelete.md`
- Source list updated 2026-03-26 per audit remediation
Related references:
- [memory-metadata-update-memoryupdate.md](../../feature-catalog/mutation/memory-metadata-update-memoryupdate.md) — Memory metadata update (memory_update)
- [tier-based-bulk-deletion-memorybulkdelete.md](../../feature-catalog/mutation/tier-based-bulk-deletion-memorybulkdelete.md) — Tier-based bulk deletion (memory_bulk_delete)
