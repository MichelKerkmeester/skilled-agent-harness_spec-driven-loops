---
title: "Soft-delete tombstones and active/purgeable partitions"
description: "Default-off tombstone infrastructure for memory delete and retention paths, with schema v37 active and purgeable partial indexes."
trigger_phrases:
  - "soft-delete tombstones and active purgeable partitions"
  - "SPECKIT_SOFT_DELETE_TOMBSTONES"
  - "schema v37 tombstone partition"
  - "purgeable retention partition"
---

# Soft-delete tombstones and active/purgeable partitions

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Soft-delete tombstones are available behind `SPECKIT_SOFT_DELETE_TOMBSTONES`, while hard-delete behavior remains the default.

The feature adds tombstone-ready storage, delete-handler gates, and retention partitioning without making recall surfaces filter tombstoned rows by default.

---

## 2. HOW IT WORKS

Schema v37 adds `deleted_at`, an active partial index where `deleted_at IS NULL`, and a purgeable partial index where `deleted_at IS NOT NULL`. The migration is additive and idempotent.

Single delete, folder/tier bulk delete, and retention sweep handlers all check the flag. With the flag off, existing hard-delete and active TTL sweep behavior remains unchanged. With the flag on, delete paths write `COALESCE(deleted_at, now)` to preserve the first tombstone timestamp, and retention sweep targets the purgeable partition while reporting tombstone-state data.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `mcp_server/lib/search/vector-index-schema.ts` | Shared | Schema v37 deleted_at column and active/purgeable indexes |
| `mcp_server/handlers/memory-crud-delete.ts` | Handler | Single-delete flag gate and tombstone writer path |
| `mcp_server/handlers/memory-bulk-delete.ts` | Handler | Bulk-delete flag gate and first-timestamp tombstone behavior |
| `mcp_server/lib/governance/memory-retention-sweep.ts` | Shared | Active TTL sweep by default; purgeable partition when enabled |
| `mcp_server/ENV_REFERENCE.md` | Reference | Documents the default-off tombstone flag |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `mcp_server/tests/causal-edge-tombstones.vitest.ts` | Automated test | Flag-off hard-delete and flag-on first-timestamp coverage |
| `mcp_server/tests/memory-retention-sweep.vitest.ts` | Automated test | Active TTL and purgeable partition coverage |
| `mcp_server/tests/memory-retention-feedback-learning.vitest.ts` | Automated test | Retention sweep interaction coverage |

---

## 4. SOURCE METADATA

- Group: Mutation
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `02--mutation/soft-delete-tombstones-and-active-purgeable-partitions.md`

Related references:
- [single-and-folder-delete-memorydelete.md](single-and-folder-delete-memorydelete.md) - Single and folder delete behavior
- [memory-retention-sweep.md](memory-retention-sweep.md) - Retention sweep behavior
