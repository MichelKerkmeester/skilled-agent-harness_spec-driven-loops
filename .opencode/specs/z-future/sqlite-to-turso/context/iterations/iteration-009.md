# Iteration 9: Slice 9: cross-seat re-confirmation of high-value single-seat units

## Focus
Slice 9: cross-seat re-confirmation of high-value single-seat units (17 slice files, shared across all seats)

## Per-Seat Contribution
Succeeded: mimo-a, mimo-b, mimo-c | Failed: none

## Merged Findings (relevance-gated at 0.55)
Kept 36 units (0 marginal in [0.40,0.55)); 36 agreement-eligible (>=2 seats), 0 new this iteration.

### Agreement-eligible units
- [3x] `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts` :: `writeVectorsToKnn` (integration_point, rel 0.9) — CONFIRMED: Transaction-wrapped delete+insert per row into vec_memories virtual table (lines 370-381). Uses db.transaction, DELETE FROM vec_memories WHERE rowid, INSERT INTO vec_memories(rowid, embedding). Blocks Turso migration.
- [3x] `.opencode/skills/system-spec-kit/mcp_server/lib/search/bm25-index.ts` :: `isMemoryFtsAvailable` (integration_point, rel 0.8) — CONFIRMED: Probes sqlite_master for memory_fts table existence; gates FTS5 vs in-memory BM25 engine selection. Turso migration must replace this with alternative lexical engine detection.
- [3x] `.opencode/skills/system-spec-kit/mcp_server/lib/search/db-shard-migration.ts` :: `canonical.exec` (integration_point, rel 1) — CONFIRMED: ATTACH/DETACH used for 3-database migration (legacy→canonical→shard) at lines 243-244, 272-273. Turso has no ATTACH — requires architectural redesign.
- [3x] `.opencode/skills/system-spec-kit/mcp_server/lib/search/db-shard-migration.ts` :: `copyShardPayloadTable` (integration_point, rel 1) — CONFIRMED: Creates vec0 virtual table in attached shard (line 72: CREATE VIRTUAL TABLE shard.vec_memories USING vec0) and copies rows via INSERT. Also uses loadExtension via sqliteVec.load at line 242. Turso has no vec0, no ATTACH, no loadExtension.
- [3x] `.opencode/skills/system-spec-kit/mcp_server/lib/storage/checkpoints.ts` :: `memory_fts delete-all` (integration_point, rel 0.9) — CONFIRMED: FTS5 'delete-all' command used in clearTable() function. Turso/libSQL lacks FTS5; must reimplement.
- [3x] `.opencode/skills/system-spec-kit/mcp_server/lib/storage/checkpoints.ts` :: `memory_fts rebuild` (integration_point, rel 0.9) — CONFIRMED: FTS5 'rebuild' command used in runDerivedArtifactRebuilds (line 1930). FTS5 not available in Turso.
- [3x] `.opencode/skills/system-spec-kit/mcp_server/lib/storage/checkpoints.ts` :: `restoreCheckpointV2` (integration_point, rel 1) — CONFIRMED: v2 restore is entirely file-copy based (lines 2689-2707: fs.renameSync live→backup, fs.copyFileSync snapshot→live). Turso remote DB cannot fs.copyFileSync — needs API-level redesign.
- [3x] `.opencode/skills/system-spec-kit/mcp_server/lib/storage/checkpoints.ts` :: `VACUUM active_vec INTO` (integration_point, rel 1) — CONFIRMED: VACUUM INTO on attached database (active_vec) at line 2284. Turso lacks ATTACH and VACUUM INTO; vector shard snapshot needs complete reimplementation.
- [3x] `.opencode/skills/system-spec-kit/mcp_server/lib/storage/checkpoints.ts` :: `VACUUM main INTO` (integration_point, rel 1) — CONFIRMED: VACUUM INTO is SQLite-specific; used at line 2281 for v2 checkpoint creation. Turso/libSQL does not support it.
- [3x] `.opencode/skills/system-spec-kit/mcp_server/lib/storage/learned-triggers-schema.ts` :: `memory_fts` (integration_point, rel 0.7) — CONFIRMED: FTS5 virtual table existence probe in verifyFts5Isolation(). Turso lacks FTS5 — this check and all memory_fts consumers must be replaced or gated.
- [3x] `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts` :: `Database` (dependency, rel 0.95) — CONFIRMED: Direct better-sqlite3 driver import. Every call site couples to the synchronous better-sqlite3 API. Turso uses @libsql/client.
- [3x] `.opencode/skills/system-spec-kit/mcp_server/lib/analytics/session-analytics-db.ts` :: `db.pragma` (dependency, rel 0.7) — CONFIRMED: Three .pragma() calls at lines 299-301. libSQL lacks .pragma() method — must use db.exec('PRAGMA ...') or connection string params.

## Coverage
sliceCoverage 1 · agreementRate 1.000 · relevanceFloor 0.7 · reuseCatalogCoverage 0
