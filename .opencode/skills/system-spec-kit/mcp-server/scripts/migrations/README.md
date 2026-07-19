---
title: "Migration Scripts"
description: "Checkpoint helpers and versioned one-shot data migrations for the memory SQLite database."
trigger_phrases:
  - "migration checkpoint"
  - "restore checkpoint"
---

# Migration Scripts

## 1. OVERVIEW

`scripts/migrations/` holds two kinds of CLI helpers for the memory SQLite database: **checkpoint helpers** that protect the database around schema changes, and **versioned one-shot data migrations** (`.mjs`) that repair or normalize memory data in place.

Checkpoint helpers:

- `create-checkpoint.ts` - creates a point-in-time SQLite checkpoint and metadata sidecar.
- `restore-checkpoint.ts` - restores a previously captured checkpoint.

## 2. ONE-SHOT DATA MIGRATIONS

Each `.mjs` migration is **dry-run by default** (count-only, mutates nothing) and requires an explicit `--apply` guarded by baseline-count and/or checkpoint-id gates; several also support `--rollback` from recorded audit rows.

| Migration | Purpose |
|---|---|
| `backfill-derived-causal-edge-ids.mjs` | Backfills `causal_edges.derived_id`. |
| `collapse-duplicate-content-rows.mjs` | Collapses exact-duplicate memory content rows. |
| `dedup-constitutional-trigger-rows.mjs` | Deletes duplicate and sandbox-sourced constitutional rows after baseline confirmation. |
| `downweight-entity-linker-supports.mjs` | Down-weights `entity_linker` "supports" edges from strength 0.7 to 0.05 in place. |
| `drain-file-absent-dead-path-rows.mjs` | Deletes index rows whose resolved file path is absent on disk. |
| `heal-system-speckit-track-identity.mjs` | Heals `system-spec-kit` track identity on memory rows. |
| `mark-z-archive-rows-archived.mjs` | Rewrites `z_archive` rows to `tier=archived`; `--rollback` restores prior tiers from audit rows. |
| `normalize-embedding-model-provenance.mjs` | Normalizes embedding-model provenance and aliases, recording before-values in an audit table. |
| `rebuild-memory-index-archived-check.mjs` | Rebuilds `memory_index` with an archived-inclusive CHECK constraint, then marks `z_archive` rows archived. |
| `regenerate-legacy-trigger-phrases.mjs` | Regenerates legacy trigger phrases (batched, resumable, and merge-preserving). |
| `regenerate-placeholder-surrogate-titles.mjs` | Rewrites placeholder "Memory NNNN" surrogate titles from the stored document title. |
| `retrofix-frontmatter-only-tiers.mjs` | Recomputes `critical`/`important` importance tiers from frontmatter; `--rollback` restores from audit rows. |

## 3. RELATED

- `../README.md`
- `../../database/README.md`
