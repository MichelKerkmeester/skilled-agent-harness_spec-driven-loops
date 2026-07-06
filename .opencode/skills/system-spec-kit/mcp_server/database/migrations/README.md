---
title: "MCP Server Database Migrations"
description: "Reserved infrastructure folder for future authored schema migration scripts targeting context-index.sqlite and per-embedder vector shards."
trigger_phrases:
  - "database migrations"
  - "schema migrations"
  - "context-index migrations"
  - "vector shard migration"
---

# MCP Server Database Migrations

> Reserved infrastructure for authored schema migrations. No migration runner is wired up today.

---

## 1. OVERVIEW

This folder holds future per-server schema migration scripts that target `context-index.sqlite` (the canonical metadata database) and the per-embedder vector shards under `../vectors/`. It is reserved infrastructure. The folder exists with a `.gitkeep` placeholder so that the path is committed and discoverable before any migration scripts land.

Today's schema-evolution model is lazy and idempotent. `CREATE TABLE IF NOT EXISTS` statements live inside the runtime source and run on attach. Migration scripts will only land here when that model is no longer sufficient. See [Section 4](#4-current-schema-evolution-model) and [Section 5](#5-activation-criterion).

---

## 2. STATUS

**Reserved Infrastructure.** As of writing, no MCP server code reads from this directory and no migration runner exists. A grep of the source tree (`mcp_server/lib/`, `mcp_server/handlers/`, `mcp_server/scripts/`) returns no references to `database/migrations` or any `MIGRATIONS_DIR` constant.

The folder is committed empty (only `.gitkeep`) so that future authored migrations have a stable home and so this README can document the contract before the first migration script lands.

---

## 3. STRUCTURE

```text
migrations/
+-- README.md       # This file
`-- .gitkeep        # Keeps the folder present in clean checkouts
```

When the folder activates, scripts land at the root:

```text
migrations/
+-- README.md
+-- .gitkeep
+-- 001-add_provenance_to_vec_metadata.sql
+-- 002-rebuild_embedding_cache_index.ts
`-- ...
```

---

## 4. CURRENT SCHEMA EVOLUTION MODEL

Today the MCP daemon evolves schema lazily. On daemon startup or shard attach, runtime code issues `CREATE TABLE IF NOT EXISTS` statements that bring missing tables into existence without touching existing data. The current call sites are:

| File | Lines | Purpose |
|---|---|---|
| `../../lib/search/vector-index-store.ts` | 417, 460, 485 | Create `vec_metadata`, `embedding_cache` and the per-dimension vector table on shard attach |
| `../../lib/search/vector-index-schema.ts` | 247, 608, 648, 922, 972, 991, 1011, 1031, 1053 | Create the canonical metadata tables on `context-index.sqlite` attach |
| `../../lib/embedders/schema.ts` | 62, 130 | Create `vec_metadata` and per-dimension tables when an embedder profile activates |
| `../../lib/embedders/reindex.ts` | 82, 264, 274 | Create `embedder_jobs` and rebuild vector tables during a reindex sweep |

These statements are idempotent and safe to run on every boot. They handle the common case: a new table or a fresh shard needs the canonical shape.

They do not handle:

- Removing or renaming a column on an existing table.
- Adding a column with a non-trivial default that requires backfill.
- Rebuilding an index after a `vec_metadata` shape change.
- One-shot data transformations that must run exactly once.

When any of those cases lands, an authored migration script belongs in this folder.

---

## 5. ACTIVATION CRITERION

A migration script lands here when at least one of the following is true:

1. A column must be **added, removed, renamed, or retyped** on a table that already holds production data. `CREATE TABLE IF NOT EXISTS` cannot perform an `ALTER`.
2. An index must be **dropped and rebuilt** because its target columns changed.
3. A **one-shot data transformation** must run exactly once across an existing database, with a record that it has run.
4. A **deprecated table or shard** must be removed in a coordinated way.

Until one of those triggers fires, lazy `CREATE TABLE IF NOT EXISTS` remains the supported path.

When the first migration lands, the script author also lands the runner. The runner is to be decided. Two plausible homes:

- A small TypeScript helper invoked by the daemon at boot, after database attach but before tool registration.
- A script under `../../../scripts/spec/` invoked explicitly from `/doctor:update` or a one-off maintenance command.

The first authored migration chooses one and documents it in this README.

---

## 6. NAMING CONVENTION

Authors follow this pattern when the folder activates:

```text
NNN-snake_case_description.{sql,ts}
```

- `NNN`: 3-digit zero-padded sequence number, monotonically increasing. The next script after `005-...` is `006-...`.
- `snake_case_description`: action-verb-first, lowercase, snake_case. Start with the verb that describes what the migration does to the schema or data.
- Extension: `.sql` for pure DDL or DML. `.ts` when the migration needs control flow, transactions across multiple statements, or read-then-write logic.

Worked example:

```text
001-add_provenance_to_vec_metadata.sql
```

This name reads as "migration number one, add the provenance column to the `vec_metadata` table". The verb is first. The target table is named. The shape (SQL) signals pure DDL.

---

## 7. RELATED RESOURCES

### Parent Documentation

| Document | Purpose |
|---|---|
| [`../README.md`](../README.md) | Database directory guide and runtime storage contract |

### Source Code

| Path | Role |
|---|---|
| [`../../lib/search/vector-index-store.ts`](../../lib/search/vector-index-store.ts) | Vector shard attach and lazy table creation |
| [`../../lib/search/vector-index-schema.ts`](../../lib/search/vector-index-schema.ts) | Canonical metadata schema for `context-index.sqlite` |
| [`../../lib/embedders/schema.ts`](../../lib/embedders/schema.ts) | Per-embedder profile schema setup |
| [`../../lib/embedders/reindex.ts`](../../lib/embedders/reindex.ts) | Reindex sweep with table rebuilds |

### Architectural Baseline

These ADRs set the architecture future migrations must preserve. All three live in the `003-embedder-testing-and-architecture` umbrella under `.opencode/specs/system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/`.

| ADR | Location | Topic |
|---|---|---|
| Canonical vector shard split | [`002-spec-memory-stack/012-canonical-vector-shard-split/spec.md`](../../../../../specs/system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/012-canonical-vector-shard-split/spec.md) | One canonical `context-index.sqlite` plus per-profile shards under `vectors/context-vectors__<slug>.sqlite` |
| ADR-013 (nomic default) | [`002-spec-memory-stack/004-spec-memory-embedder-bake-off/decision-record.md`](../../../../../specs/system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/004-spec-memory-embedder-bake-off/decision-record.md) | Switch production default to `nomic-embed-text-v1.5` (768d, Ollama) |
| ADR-014 (local-first cascade) | [`002-spec-memory-stack/004-spec-memory-embedder-bake-off/decision-record.md`](../../../../../specs/system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/004-spec-memory-embedder-bake-off/decision-record.md) | Reorder cascade to local-first and align hf-local fallback to nomic |
