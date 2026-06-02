---
title: "Schema version history (v28 to v30)"
description: "Records the recent vector-index schema migration timeline: v28 active-row logical-key unique index, v29 checkpoint-v2 snapshot columns, and v30 post-insert enrichment marker columns. Current SCHEMA_VERSION is 30."
trigger_phrases:
  - "schema version history"
  - "schema migration v28 v29 v30"
  - "SCHEMA_VERSION 30 timeline"
  - "vector index schema migrations"
  - "what did migration v29 v30 add"
---

# Schema version history (v28 to v30)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

The Spec Kit Memory database carries a single integer `SCHEMA_VERSION` in `vector-index-schema.ts`, and a transactional migration runner applies each numbered migration in order when an older database is opened. This file records the most recent three migrations so an operator can see what changed without reading the migration code. The current value is `SCHEMA_VERSION = 30`. All three migrations are additive and idempotent — re-running any of them on an already-migrated database is a no-op.

---

## 2. HOW IT WORKS

The migration runner walks from the database's stored version up to `SCHEMA_VERSION`, applying each `migrations[v]` inside a single transaction for atomicity, then stamps the new version. Fresh databases get the final schema directly from the table DDL, so each migration also keeps the fresh-DB `CREATE TABLE` shape in parity.

### Migration timeline

| Version | What it added | Why |
|---------|---------------|-----|
| **v28** | The active-row logical-key partial unique index `idx_memory_logical_key_active_unique` on `memory_index`, covering `(spec_folder, canonical/file path, anchor, tenant, user, agent, session)` where `importance_tier NOT IN ('constitutional','deprecated')`. | Guarantees at most one non-deprecated, non-constitutional row per logical key per scope, so supersede-on-reindex retires the prior version by tier rather than by deletion. Constitutional rows are exempt so always-surfaced rules can keep intentional duplicates. |
| **v29** | Two columns on `checkpoints`: `snapshot_format TEXT DEFAULT 'v1'` and `snapshot_path TEXT`. | Marks each checkpoint row as v1 (gzip JSON BLOB) or v2 (file-based VACUUM-INTO snapshot) and records the v2 snapshot directory, so restore can detect the format and pruning can find v2 directories cheaply. The `DEFAULT 'v1'` classifies every legacy checkpoint with no backfill. |
| **v30** | Four columns on `memory_index` — `post_insert_enrichment_status` (`NOT NULL DEFAULT 'complete'`), `post_insert_enrichment_state`, `post_insert_enrichment_completed_at`, `post_insert_enrichment_version` — plus the partial index `idx_post_insert_enrichment_incomplete`. | Tracks whether the deferred post-insert enrichment step (entities, graph signals) completed for each saved row, so an incomplete row can be repaired on a later pass. The partial index lets the repair scan find only the incomplete rows cheaply. |

### Migration safety properties

- **Additive only.** v28-v30 add an index or columns; none drop or rewrite existing data, so a partial application leaves the database readable by the prior version.
- **Idempotent.** Each migration checks for the index/column before creating it (and tolerates a `duplicate column` error), so a re-run is a no-op.
- **Default-classified.** The v29 and v30 column defaults (`'v1'`, `'complete'`) classify every pre-existing row correctly without a separate backfill step.

---

## 3. SOURCE FILES

### Implementation

| File | Role |
|------|------|
| `mcp_server/lib/search/vector-index-schema.ts` | `SCHEMA_VERSION = 30`; `migrations[28]` (active-row unique index), `migrations[29]` (checkpoint snapshot columns), `migrations[30]` (post-insert enrichment columns + repair index); the transactional migration runner and fresh-DB DDL |

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
- Feature file path: `08--bug-fixes-and-data-integrity/069-schema-version-history-v28-v30.md`
Related references:
- [060-database-and-schema-safety.md](060-database-and-schema-safety.md) — Database and schema safety
- [070-error-code-reference.md](070-error-code-reference.md) — Error code reference (E429, -32001, -32002)
