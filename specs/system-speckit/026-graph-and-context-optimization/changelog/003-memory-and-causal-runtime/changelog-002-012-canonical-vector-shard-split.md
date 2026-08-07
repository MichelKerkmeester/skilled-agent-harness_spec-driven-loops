---
title: "Canonical Vector Shard Split"
description: "Spec-memory storage split into a stable canonical metadata DB plus per-profile attached vector and cache shards. Vector payloads, dim tables and embedding cache rows moved to per-profile SQLite shards attached as active_vec at runtime init."
trigger_phrases:
  - "canonical vector shard split"
  - "active_vec vector shard"
  - "context-index.sqlite canonical db"
  - "per-profile vector shard split"
  - "db-shard-migration"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-19

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/012-canonical-vector-shard-split` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack`

### Summary

Embedding-profile experiments duplicated canonical memory metadata, lineage, FTS, governance tables and checkpoint state across per-profile SQLite files. Hot vector pages from inactive profiles remained mapped during profile switches, wasting approximately 35 to 40 MB of RSS per profile swap and keeping old profile state visible to the active session.

The storage layer was split into one stable canonical DB (`context-index.sqlite`) that owns metadata, lineage, FTS, projection tables, governance, checkpoints and session state, plus per-profile attached shards (`vectors/context-vectors__<slug>.sqlite`) that own `vec_memories*`, dim-tagged `vec_<dim>` tables and profile-specific `embedding_cache`. The active shard is attached as the `active_vec` schema alias during guarded memory-runtime initialization and reattached after each active-embedder selection. A migration helper moves legacy single-profile files to `database/migrations/` for operator rollback.

All vector query, mutation and cache paths qualify through `active_vec`. Tests cover fresh creation, migration, idempotency, attach/detach, profile swap, cache isolation, mutation destination, vector query, metadata mismatch rejection, WAL correctness and checkpoint compatibility. All suites passed with no new regressions.

### Added

- `getCanonicalDatabasePath(baseDir)` and `getVectorShardPath(baseDir)` path helpers in `profile.ts`, with `getDatabasePath()` preserved as a deprecated alias
- `attachActiveVectorShard()`, `detachActiveVectorShard()` and `getActiveVectorSource()` helpers in `vector-index-store.ts` with low-memory shard pragmas and idempotent attach
- `db-shard-migration.ts` with `migrateLegacySingleDbToShard()` for copying canonical and vector payloads, VACUUM on both sides and legacy-file staging under `database/migrations/`
- `db_split` telemetry block in `memory_health` full-report covering canonical path, shard path, sizes, attach status and profile provider/model/dim
- `canonical-vector-shard.vitest.ts` with 13 tests covering the full shard lifecycle

### Changed

- Vector query paths in `vector-index-queries.ts` now qualify `vec_memories*` and dim-tagged tables as `active_vec.*`
- Vector mutation paths in `vector-index-mutations.ts` now write to `active_vec` tables
- `embedding-cache.ts` moved cache schema creation and reads/writes to the active shard, with standalone-test fallback
- `context-server.ts` guarded init callback now runs `attachActiveVectorShard()` after `initializeDb` behind the memory-runtime guard
- `reindex.ts` profile-swap path now detaches the old shard and attaches the new shard when the active embedder changes

### Fixed

- Old profile vector pages remained memory-mapped during profile switches, consuming approximately 35 to 40 MB of RSS that was not released until process exit
- Legacy per-profile `context-index__<slug>.sqlite` files duplicated canonical metadata, lineage, FTS and checkpoint tables for each profile, causing storage growth on every model experiment

### Verification

| Check | Result |
|-------|--------|
| `npm run typecheck` | PASS |
| `npx vitest --run canonical-vector-shard` | PASS. 13 tests |
| `npx vitest --run vector-index` | PASS. 170 tests (no regressions) |
| `npx vitest --run embedding-cache` | PASS. 24 tests (no regressions from packet 009) |
| `npx vitest --run memory-runtime-guard` | PASS. 6 tests (no regressions from packet 011) |
| `npx vitest --run embedder-reindex` | PASS. 4 tests |
| `npx vitest --run handler-memory-save` | 11 failures matching the pre-existing baseline from packet 011. 52 passed. 3 skipped. No new regressions. |
| `npm run build` | PASS |
| `validate.sh 012 --strict` | PASS |

### Files Changed

| File | What changed |
|------|--------------|
| `shared/embeddings/profile.ts` | `getCanonicalDatabasePath()` and `getVectorShardPath()` added. `getDatabasePath()` kept as deprecated alias. |
| `mcp_server/lib/search/vector-index-store.ts` | Shard attach, detach, telemetry, low-memory pragmas, WAL setup and temporary vector aliases for internal compatibility. |
| `mcp_server/lib/search/db-shard-migration.ts` (NEW) | `migrateLegacySingleDbToShard()` copies canonical and shard payloads, VACUUMs both, moves legacy file to `database/migrations/` as a rollback backup. |
| `mcp_server/lib/search/vector-index-queries.ts` | Vector query paths qualified as `active_vec.*` tables. |
| `mcp_server/lib/search/vector-index-mutations.ts` | Vector mutation paths qualified as `active_vec.*` tables. |
| `mcp_server/lib/cache/embedding-cache.ts` | Cache schema creation and reads/writes moved to active shard with standalone-test fallback. |
| `mcp_server/context-server.ts` | `attachActiveVectorShard()` registered into the guarded init callback after `initializeDb`. |
| `mcp_server/handlers/memory-crud-health.ts` | `db_split` telemetry block added to full-report response. |
| `mcp_server/lib/embedders/reindex.ts` | Profile-swap path detaches old shard and attaches new shard on active-embedder change. |
| `mcp_server/lib/storage/checkpoints.ts` | Checkpoint compatibility confirmed via shard-aware vector lookup and aliases. |
| `mcp_server/tests/canonical-vector-shard.vitest.ts` (NEW) | 13 tests covering fresh creation, migration, idempotency, attach/detach, profile swap, cache isolation, mutation destination, vector query, metadata mismatch rejection, WAL and checkpoint compatibility. |

### Follow-Ups

- Remove temporary unqualified `vec_memories` aliases from internal modules outside the primary query/mutation path once direct call sites migrate to qualified shard-table references.
- Delete legacy backup files under `database/migrations/` after production verification confirms the split is stable.
