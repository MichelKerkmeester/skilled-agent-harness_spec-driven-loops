# Iteration 1: Slice 1: spec-kit vector layer (sqlite-vec)

## Focus
Slice 1: spec-kit vector layer (sqlite-vec) (8 slice files, shared across all seats)

## Per-Seat Contribution
Succeeded: mimo-a, mimo-b, mimo-c | Failed: none

## Merged Findings (relevance-gated at 0.55)
Kept 42 units (5 marginal in [0.40,0.55)); 7 agreement-eligible (>=2 seats), 7 new this iteration.

### Agreement-eligible units
- [2x] `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts` :: `vec0` (dependency, rel 1) — Core sqlite-vec virtual table for KNN search. Turso lacks loadExtension and vec0 — blocks vector search entirely.
- [3x] `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts` :: `sqliteVec.load` (dependency, rel 1) — LoadExtension API for sqlite-vec. Turso (Rust) has no loadExtension — must reimplement vector search natively or via external service.
- [2x] `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts` :: `database.pragma` (dependency, rel 0.85) — better-sqlite3 .pragma() API used for WAL, busy_timeout, foreign_keys, cache_size, mmap_size, synchronous, wal_autocheckpoint, temp_store. Turso has different pragma interface.
- [2x] `.opencode/skills/system-spec-kit/mcp_server/lib/search/db-shard-migration.ts` :: `migrateLegacySingleDbToShardSync` (integration_point, rel 1) — Migration uses ATTACH DATABASE, vec0 virtual table recreation, and VACUUM. All three need Turso-compatible equivalents.
- [2x] `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts` :: `writeVectorsToShard` (integration_point, rel 1) — Reindex writes to staging shard then atomically renames. Uses vec0 virtual table creation inside shard. Migration must preserve atomic swap semantics.
- [2x] `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts` :: `ensure_vector_shard_schema` (integration_point, rel 1) — Five pragma calls on attached vector shard; Turso lacks .pragma() and ATTACH — entire shard initialization must be redesigned
- [2x] `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts` :: `database.exec` (integration_point, rel 1) — ATTACH/DETACH for vector shard separation; Turso has no ATTACH DATABASE — shard architecture requires rework

## Coverage
sliceCoverage 0.625 · agreementRate 0.167 · relevanceFloor 0.6 · reuseCatalogCoverage 0.25
