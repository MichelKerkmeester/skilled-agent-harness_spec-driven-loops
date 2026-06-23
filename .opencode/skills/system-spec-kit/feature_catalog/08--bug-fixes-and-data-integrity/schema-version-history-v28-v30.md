---
title: "Schema version history (v28 to v37)"
description: "Records the vector-index schema migration timeline from v28 active-row uniqueness through v37 tombstone partitions. Current SCHEMA_VERSION is 37."
trigger_phrases:
  - "schema version history"
  - "schema migration v28 v37"
  - "SCHEMA_VERSION 37 timeline"
  - "vector index schema migrations"
  - "what did migration v34 v37 add"
version: 3.6.0.3
---

# Schema version history (v28 to v37)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

The Spec Kit Memory database carries a single integer `SCHEMA_VERSION` in `vector-index-schema.ts`, and a transactional migration runner applies each numbered migration in order when an older database is opened. This file records the recent migration timeline so an operator can see what changed without reading the migration code. The current value is `SCHEMA_VERSION = 37`. These migrations are additive and idempotent — re-running any of them on an already-migrated database is a no-op.

---

## 2. HOW IT WORKS

The migration runner walks from the database's stored version up to `SCHEMA_VERSION`, applying each `migrations[v]` inside a single transaction for atomicity, then stamps the new version. Fresh databases get the final schema directly from the table DDL, so each migration also keeps the fresh-DB `CREATE TABLE` shape in parity.

### Migration timeline

| Version | What it added | Why |
|---------|---------------|-----|
| **v28** | The active-row logical-key partial unique index `idx_memory_logical_key_active_unique` on `memory_index`, covering `(spec_folder, canonical/file path, anchor, tenant, user, agent, session)` where `importance_tier NOT IN ('constitutional','deprecated')`. | Guarantees at most one non-deprecated, non-constitutional row per logical key per scope, so supersede-on-reindex retires the prior version by tier rather than by deletion. Constitutional rows are exempt so always-surfaced rules can keep intentional duplicates. |
| **v29** | Two columns on `checkpoints`: `snapshot_format TEXT DEFAULT 'v1'` and `snapshot_path TEXT`. | Marks each checkpoint row as v1 (gzip JSON BLOB) or v2 (file-based VACUUM-INTO snapshot) and records the v2 snapshot directory, so restore can detect the format and pruning can find v2 directories cheaply. The `DEFAULT 'v1'` classifies every legacy checkpoint with no backfill. |
| **v30** | Four columns on `memory_index` — `post_insert_enrichment_status` (`NOT NULL DEFAULT 'complete'`), `post_insert_enrichment_state`, `post_insert_enrichment_completed_at`, `post_insert_enrichment_version` — plus the partial index `idx_post_insert_enrichment_incomplete`. | Tracks whether the deferred post-insert enrichment step (entities, graph signals) completed for each saved row, so an incomplete row can be repaired on a later pass. The partial index lets the repair scan find only the incomplete rows cheaply. |
| **v31** | Incremental-index foundation schema and memory chunk metadata columns. | Supports safer parent/chunk reindexing and chunk diagnostics without replacing parent rows blindly. |
| **v32** | `causal_edge_tombstones` table and indexes. | Preserves deletion lineage for causal edges before removed memories or orphan repairs erase active edges. |
| **v33** | Generated causal-edge provenance columns. | Records confidence and extraction method alongside causal edges so generated edges can be inspected separately from manual edges. |
| **v34** | `memory_trigger_embeddings` table and status index. | Stores derived trigger embeddings for default-off semantic trigger shadow matching while lexical triggers remain primary. |
| **v35** | `memory_index.source_kind` with provenance backfill. | Normalizes row provenance into `human`, `agent`, `system`, `import` or `feedback`. |
| **v36** | `memory_idempotency_receipts`, `delete_after`, `near_duplicate_of`, and `last_dedup_checked_at`. | Adds server-derived replay receipts and advisory near-duplicate hints behind the idempotency gate. |
| **v37** | `deleted_at`, active recall index, and purgeable retention index. | Adds tombstone-ready partitions for soft-delete and retention behavior behind the tombstone gate. |

### Migration safety properties

- **Additive only.** v28-v37 add indexes, columns, or companion tables; none drop or rewrite existing data, so a partial application leaves the database readable by the prior version.
- **Idempotent.** Each migration checks for the index/column before creating it (and tolerates a `duplicate column` error), so a re-run is a no-op.
- **Default-classified.** Defaults and backfills classify pre-existing rows safely without requiring separate operator repair.

---

## 3. SOURCE FILES

### Implementation

| File | Role |
|------|------|
| `mcp_server/lib/search/vector-index-schema.ts` | `SCHEMA_VERSION = 37`; `migrations[28]` through `migrations[37]`; the transactional migration runner and fresh-DB DDL |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `mcp_server/tests/schema-migration.vitest.ts` | Automated test | Migration runner ordering and atomicity |
| `mcp_server/tests/vector-index-schema-compatibility.vitest.ts` | Automated test | Fresh-DB DDL parity and version compatibility |
| `mcp_server/tests/vector-index-schema-migration-refinements.vitest.ts` | Automated test | Idempotency and migration-refinement coverage |
| `mcp_server/tests/checkpoints-schema-v29.vitest.ts` | Automated test | v29 snapshot columns exist, default is `'v1'`, re-run is a no-op |
| `mcp_server/tests/vector-index-schema-enrichment-v30.vitest.ts` | Automated test | v30 enrichment marker columns and repair index |

---

## 4. SOURCE METADATA
- Group: Bug Fixes And Data Integrity
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `08--bug-fixes-and-data-integrity/schema-version-history-v28-v30.md`
Related references:
- [database-and-schema-safety.md](database-and-schema-safety.md) — Database and schema safety
- [error-code-reference.md](error-code-reference.md) — Error code reference (E429, -32001, -32002)
