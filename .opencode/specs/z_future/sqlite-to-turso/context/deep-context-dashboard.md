---
title: Deep Context Dashboard
description: Auto-generated reducer view over the deep-context packet.
---

# Deep Context Dashboard

Auto-generated from the JSONL state log, per-seat findings, and the merged registry. Never manually edited.

## 1. STATUS
- Scope: SQLite usage surfaces across system-spec-kit mcp_server, system-code-graph, and system-skill-advisor (better-sqlite3 + sqlite-vec + FTS5, recursive CTEs, pragmas, WAL, daemon/lease single-writer models) plus packet 027-xce-research-based-refinement storage changes (incremental-index schema v31-v34, causal tombstones, statediff reconciliation, OpenLTM retrieval observability), oriented at Turso/libSQL migration touchpoints
- Started: 2026-06-10T15:54:19Z
- Status: ITERATING
- Iterations (parallel sweeps): 10 of 10
- Session ID: ctx-20260610-155419-sqlt
- Lineage mode: new
- Generation: 1

## 2. PROGRESS

| # | Focus | Findings | NewAgr | sliceCov | agrRate | Status |
|---|-------|----------|--------|----------|---------|--------|
| 1 | Slice 1: spec-kit vector layer (sqlite-vec) | 42 | 7 | 0.63 | 0.17 | evidence |
| 2 | Slice 2: spec-kit FTS5/BM25 retrieval layer | 21 | 3 | 0.67 | 0.14 | evidence |
| 3 | Slice 3: causal graph + recursive CTE layer | 24 | 1 | 1.00 | 0.04 | evidence |
| 4 | Slice 4: packet-027 storage additions | 25 | 0 | 0.50 | 0.00 | evidence |
| 5 | Slice 5: lifecycle and maintenance layer | 48 | 0 | 1.00 | 0.00 | evidence |
| 6 | Slice 6: system-code-graph DB layer | 24 | 1 | 0.67 | 0.04 | evidence |
| 7 | Slice 7: system-skill-advisor DB and lease layer | 40 | 5 | 1.00 | 0.13 | evidence |
| 8 | Slice 8: cross-cutting spec-kit infrastructure databases | 35 | 7 | 1.00 | 0.20 | evidence |
| 9 | Slice 9: cross-seat re-confirmation of high-value single-seat units | 36 | 0 | 1.00 | 1.00 | evidence |
| 10 | Slice 10: final coverage sweep of previously uncovered files | 29 | 15 | 1.00 | 0.52 | evidence |

## 3. MERGED METRICS
- findings (deduped units): 396
- gated findings (>= relevance gate): 288
- low-confidence (below gate): 108
- agreement-eligible (>= agreementMin): 75
- agreementRate: 0.26
- relevanceFloor: 0.73
- reuseCandidates: 25 | integrationPoints: 97 | conventions: 22 | dependencies: 93 | gaps: 51

## 4. REUSE CATALOG (top, agreement-weighted)

| Symbol/Path | Reuse | Agreement (k) | Relevance | Evidence |
|-------------|-------|---------------|-----------|----------|
| rollbackBadApply | - | 1 | 0.90 | .opencode/skills/system-code-graph/mcp_server/lib/recovery-procedures.ts:272 |
| acquireSkillGraphLease | - | 1 | 0.90 | .opencode/skills/system-skill-advisor/mcp_server/lib/daemon/lease.ts:300 |
| sweepCausalEdges | - | 1 | 0.90 | .opencode/skills/system-spec-kit/mcp_server/lib/causal/sweep.ts:229 |
| prevent_ledger_delete | - | 1 | 0.90 | .opencode/skills/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts:135 |
| prevent_ledger_update | - | 1 | 0.90 | .opencode/skills/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts:133 |
| persistIndexedFileResult | - | 1 | 0.80 | .opencode/skills/system-code-graph/mcp_server/lib/ensure-ready.ts:593 |
| runDaemonStateMutation | - | 1 | 0.80 | .opencode/skills/system-skill-advisor/mcp_server/lib/daemon/state-mutation.ts:18 |
| insertEdge | - | 1 | 0.80 | .opencode/skills/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:344 |
| insertEdgesBatch | - | 1 | 0.80 | .opencode/skills/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:512 |
| rollbackWeights | - | 1 | 0.80 | .opencode/skills/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:1061 |
| updateEdge | - | 1 | 0.80 | .opencode/skills/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:802 |
| reopenActiveDatabase | - | 1 | 0.75 | .opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:1727 |
| removeFile | - | 1 | 0.70 | .opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:896 |
| replaceEdges | - | 1 | 0.70 | .opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:740 |
| replaceNodes | - | 1 | 0.70 | .opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:692 |

## 5. CONTRADICTIONS (surfaced, never auto-resolved)
- sqliteVec.load (signature): mimo-a="sqliteVec.load(database) via better-sqlite3 loadExtension" vs mimo-b="sqliteVec.load(database)" vs mimo-c="sqliteVec.load(database) — loadExtension equivalent"
- database.pragma (signature): mimo-a="database.pragma('journal_mode = WAL') + 7 other pragmas in initialize_db" vs mimo-b="database.pragma('journal_mode = WAL')"
- vec_distance_cosine (signature): mimo-a="vec_distance_cosine function via sqlite-vec" vs mimo-b="vec_distance_cosine used via sqlite-vec extension loaded by sqliteVec.load(database)" vs mimo-c="vec_distance_cosine(v.<embeddingColumn>, ?)"
- memory_fts (signature): mimo-a="FTS5 virtual table for BM25 full-text search" vs mimo-b="memory_fts FTS5 virtual table referenced in schema migrations" vs mimo-c="CREATE VIRTUAL TABLE memory_fts USING fts5(...)"
- bm25 (signature): mimo-a="FTS5 bm25() ranking function" vs mimo-b="FTS5 bm25() ranking function with per-column weights" vs mimo-c="FTS5 bm25() ranking function with per-column weights"
- migrateLegacySingleDbToShardSync (signature): mimo-a="Legacy profile DB → canonical + vector shard split with ATTACH DATABASE" vs mimo-b="ATTACH legacy + shard → copy vec tables → INSERT INTO vec0 → DETACH → VACUUM"
- writeVectorsToShard (signature): mimo-a="Staging shard → atomic rename over active shard per reindex job" vs mimo-b="new Database(shardPath) → pragma WAL → sqliteVec.load → CREATE VIRTUAL TABLE vec0 → writeVectors + writeVectorsToKnn → wal_checkpoint(TRUNCATE)"
- ensure_vector_shard_schema (signature): mimo-b="database.pragma(shema.journal_mode/cache_size/mmap_size/temp_store/wal_autocheckpoint)" vs mimo-c="CREATE VIRTUAL TABLE ... USING vec0(embedding FLOAT[dim])"
- database.exec (signature): mimo-b="ATTACH DATABASE / DETACH DATABASE active_vec" vs mimo-c="database.exec('ATTACH DATABASE ? AS active_vec')"
- vec_distance_cosine (signature): mimo-c="vec_distance_cosine(v.<embeddingColumn>, ?)" vs mimo-a="vec_distance_cosine(v.embeddingColumn, ?) as distance" vs mimo-b="vec_distance_cosine(v.${vectorSource.embeddingColumn}, ?) as distance"
- canonical.exec (signature): mimo-c="canonical.exec(ATTACH DATABASE ... AS legacy/shard)" vs mimo-a="canonical.exec(ATTACH DATABASE ... AS legacy/shard)" vs mimo-b="canonical.exec(`ATTACH DATABASE ... AS legacy`); canonical.exec(`ATTACH DATABASE ... AS shard`);"
- memory_fts (signature): mimo-a="SELECT sql FROM sqlite_master WHERE type='table' AND name='memory_fts'" vs mimo-b="verifyFts5Isolation(db): boolean — probes sqlite_master for memory_fts" vs mimo-c="SELECT sql FROM sqlite_master WHERE type='table' AND name='memory_fts'"
- migrateLearnedTriggers (signature): mimo-a="ALTER TABLE memory_index ADD COLUMN learned_triggers TEXT DEFAULT '[]'" vs mimo-b="db.prepare('PRAGMA table_info(memory_index)').all()" vs mimo-c="db.prepare('PRAGMA table_info(memory_index)').all()"
- rollbackLearnedTriggers (signature): mimo-a="ALTER TABLE memory_index DROP COLUMN learned_triggers" vs mimo-b="ALTER TABLE memory_index DROP COLUMN learned_triggers" vs mimo-c="db.prepare('PRAGMA table_info(memory_index)').all() + db.exec('ALTER TABLE ... DROP COLUMN')"
- BM25_FTS5_WEIGHTS (signature): mimo-a="const BM25_FTS5_WEIGHTS = [10.0, 5.0, 2.0, 1.0]" vs mimo-b="const BM25_FTS5_WEIGHTS = [10.0, 5.0, 2.0, 1.0] — field weight multipliers"
- shouldUseSqliteLexicalEngine (signature): mimo-a="function shouldUseSqliteLexicalEngine(database): boolean" vs mimo-b="SPECKIT_BM25_ENGINE=sqlite requires memory_fts table"
- LEARNED_TRIGGERS_COLUMN (signature): mimo-a="export const LEARNED_TRIGGERS_COLUMN = 'learned_triggers'" vs mimo-b="Column deliberately excluded from FTS5 index"
- causal_walk (signature): mimo-a="WITH RECURSIVE causal_walk(origin_id, node_id, hop_distance, walk_score) AS ..." vs mimo-b="WITH RECURSIVE causal_walk(origin_id, node_id, hop_distance, walk_score) AS (...)" vs mimo-c="WITH RECURSIVE causal_walk(origin_id, node_id, hop_distance, walk_score) AS (...)"
- sqlite_master (signature): mimo-a="SELECT 1 AS present FROM sqlite_master WHERE type='table' AND name = ?" vs mimo-c="SELECT 1 AS present FROM sqlite_master WHERE type='index' AND name = ?"
- WITH RECURSIVE causal_walk (signature): mimo-c="WITH RECURSIVE causal_walk(...) AS (SELECT ... UNION SELECT ... UNION ALL SELECT ...)" vs mimo-a="WITH RECURSIVE causal_walk AS (SELECT ... UNION SELECT ... UNION ALL SELECT ...)" vs mimo-b="WITH RECURSIVE causal_walk(origin_id, node_id, hop_distance, walk_score) AS (SELECT ... UNION SELECT ... UNION ALL SELECT ...)"
- WITH RECURSIVE dependents (signature): mimo-c="WITH RECURSIVE dependents(child_path) AS (SELECT child_path FROM dependency_edges WHERE ... UNION SELECT edge.child_path FROM dependency_edges edge JOIN dependents dep ON ...)" vs mimo-a="WITH RECURSIVE dependents(child_path) AS (SELECT child_path FROM dependency_edges WHERE parent_path IN (...) UNION SELECT edge.child_path FROM dependency_edges edge JOIN dependents dep ON edge.parent_path = dep.child_path)" vs mimo-b="WITH RECURSIVE dependents(child_path) AS (SELECT child_path FROM dependency_edges WHERE parent_path IN (...) UNION SELECT edge.child_path FROM dependency_edges edge JOIN dependents dep ON edge.parent_path = dep.child_path)"
- storeIdempotencyReceipt (signature): mimo-b="INSERT INTO memory_idempotency_receipts ... ON CONFLICT(receipt_key) DO UPDATE SET" vs mimo-a="INSERT INTO memory_idempotency_receipts (...) VALUES (...) ON CONFLICT(receipt_key) DO UPDATE SET ..." vs mimo-c="database.prepare(`INSERT INTO memory_idempotency_receipts ... ON CONFLICT ... DO UPDATE SET ...`).run()"
- recordNearDuplicateCheck (signature): mimo-b="UPDATE memory_index SET near_duplicate_of = ?, last_dedup_checked_at = datetime('now') WHERE id = ?" vs mimo-a="UPDATE memory_index SET near_duplicate_of = ?, last_dedup_checked_at = datetime('now') WHERE id = ?" vs mimo-c="database.prepare(`UPDATE memory_index SET near_duplicate_of = ?, last_dedup_checked_at = datetime('now') WHERE id = ?`).run()"
- VACUUM main INTO (signature): mimo-a="VACUUM main INTO <path>" vs mimo-b="database.exec(`VACUUM main INTO ${quoteSqlString(mainSnapshotPath)}`)" vs mimo-c="database.exec('VACUUM main INTO <path>')"
- VACUUM active_vec INTO (signature): mimo-a="VACUUM active_vec INTO <path>" vs mimo-b="database.exec(`VACUUM active_vec INTO ${quoteSqlString(vecSnapshotPath)}`)" vs mimo-c="database.exec('VACUUM active_vec INTO <path>')"
- memory_fts delete-all (signature): mimo-a="INSERT INTO memory_fts(memory_fts) VALUES('delete-all')" vs mimo-b="database.exec(`INSERT INTO memory_fts(memory_fts) VALUES('delete-all')`)" vs mimo-c="INSERT INTO memory_fts(memory_fts) VALUES('delete-all')"
- memory_fts rebuild (signature): mimo-a="INSERT INTO memory_fts(memory_fts) VALUES('rebuild')" vs mimo-b="database.exec(`INSERT INTO memory_fts(memory_fts) VALUES('rebuild')`)" vs mimo-c="INSERT INTO memory_fts(memory_fts) VALUES('rebuild')"
- consolidation_state (signature): mimo-a="CREATE TABLE IF NOT EXISTS consolidation_state (id INTEGER PRIMARY KEY CHECK(id = 1), last_run_at TEXT)" vs mimo-b="CREATE TABLE IF NOT EXISTS consolidation_state + INSERT ... ON CONFLICT(id) DO UPDATE"
- VACUUM main INTO (signature): mimo-b="database.exec(`VACUUM main INTO ${quoteSqlString(mainSnapshotPath)}`)" vs mimo-a="VACUUM main INTO <path>" vs mimo-c="database.exec('VACUUM main INTO <path>')"
- VACUUM active_vec INTO (signature): mimo-b="database.exec(`VACUUM active_vec INTO ${quoteSqlString(vecSnapshotPath)}`)" vs mimo-a="VACUUM active_vec INTO <path>" vs mimo-c="database.exec('VACUUM active_vec INTO <path>')"
- restoreCheckpointV2 (signature): mimo-b="function restoreCheckpointV2(database, checkpoint, _scope, opts): RestoreResult" vs mimo-a="function restoreCheckpointV2(database, checkpoint, scope, opts): RestoreResult" vs mimo-c="function restoreCheckpointV2(database, checkpoint, scope, opts): RestoreResult"
- memory_fts (signature): mimo-b="INSERT INTO memory_fts(memory_fts) VALUES('delete-all'/'rebuild')" vs mimo-a="INSERT INTO memory_fts(memory_fts) VALUES('delete-all')" vs mimo-c="INSERT INTO memory_fts(memory_fts) VALUES('delete-all'|'rebuild'|'optimize')"
- memory_fts (signature): mimo-b="database.prepare("INSERT INTO memory_fts(memory_fts) VALUES('optimize')").run()" vs mimo-a="INSERT INTO memory_fts(memory_fts) VALUES('optimize')" vs mimo-c="INSERT INTO memory_fts(memory_fts) VALUES('optimize')"
- VACUUM main INTO (signature): mimo-c="database.exec('VACUUM main INTO <path>')" vs mimo-a="VACUUM main INTO <path>" vs mimo-b="database.exec(`VACUUM main INTO ${quoteSqlString(mainSnapshotPath)}`)"
- queryStartupHighlights (signature): mimo-b="WITH filtered_nodes AS (...), aggregated AS (...), ranked AS (SELECT ... ROW_NUMBER() OVER (...)) SELECT ... FROM ranked" vs mimo-c="WITH filtered_nodes AS (...), aggregated AS (...), ranked AS (SELECT ... ROW_NUMBER() OVER (...))"
- assertDbHandleClosed (signature): mimo-b="handle.prepare('SELECT 1').get() — throws DbClosedError if queryable" vs mimo-a="handle.prepare('SELECT 1').get() — probes better-sqlite3 handle liveness" vs mimo-c="handle.prepare('SELECT 1').get()"
- db.pragma (signature): mimo-c="db.pragma('busy_timeout = 5000'); db.pragma('journal_mode = WAL'); db.pragma('foreign_keys = ON')" vs mimo-a="db.pragma('busy_timeout = 5000')" vs mimo-b="db.pragma('busy_timeout = 5000'); db.pragma('journal_mode = WAL'); db.pragma('foreign_keys = ON')"
- db.pragma (signature): mimo-a="db.pragma('busy_timeout = 5000'), db.pragma('foreign_keys = ON'), db.pragma('wal_checkpoint(FULL)')" vs mimo-c="db.pragma('busy_timeout = 5000'); db.pragma('journal_mode = WAL'); db.pragma('foreign_keys = ON'); db.pragma('journal_mode = DELETE'); db.pragma('wal_checkpoint(FULL)')"
- ensureVecTableForDim (signature): mimo-a="ensureVecTableForDim(database, 768); ensureVecTableForDim(database, 1024) — creates vec_<dim> virtual tables via sqlite-vec" vs mimo-c="ensureVecTableForDim(database, 768); ensureVecTableForDim(database, 1024)"
- database.exec (signature): mimo-a="database.exec(SCHEMA_SQL) — executes multi-statement DDL string" vs mimo-c="database.exec(SCHEMA_SQL) — multi-statement DDL execution"
- ensureSchema (signature): mimo-a="db.exec('PRAGMA journal_mode = WAL; CREATE TABLE IF NOT EXISTS ...') — pragma embedded in exec string" vs mimo-b="db.exec(`PRAGMA journal_mode = WAL; CREATE TABLE IF NOT EXISTS skill_graph_daemon_lease ...`)"
- checkSqliteIntegrity (signature): mimo-a="new Database(dbPath, { readonly: true, fileMustExist: true }); db.prepare('PRAGMA quick_check').get()" vs mimo-b="new Database(dbPath, { readonly: true, fileMustExist: true }) + db.pragma('busy_timeout = 5000')"
- getTableColumns (signature): mimo-a="db.prepare(`PRAGMA table_info(${tableName})`).all()" vs mimo-b="db.prepare('PRAGMA table_info(session_state)')"
- hasActiveVectorShard (signature): mimo-a="db.prepare('PRAGMA database_list').all()" vs mimo-b="db.prepare('PRAGMA database_list').all() — shard/schema detection"
- getTableColumns (signature): mimo-a="db.prepare(`PRAGMA ${ACTIVE_VECTOR_SCHEMA}.table_info(${tableName})`).all()" vs mimo-b="PRAGMA table_info(tableName) with optional ACTIVE_VECTOR_SCHEMA prefix"
- migrateEmbeddingCacheSchema (signature): mimo-a="ALTER TABLE RENAME TO / INSERT OR REPLACE FROM / DROP TABLE migration chain" vs mimo-b="ALTER TABLE RENAME TO + CREATE TABLE + INSERT OR REPLACE + DROP TABLE — multi-step schema migration"
- claimRetryCandidate (signature): mimo-a="UPDATE memory_index SET embedding_status = 'retry' WHERE id = ? AND embedding_status = 'pending' AND retry_count = ? AND ((? IS NULL AND last_retry_at IS NULL) OR last_retry_at = ?)" vs mimo-b="UPDATE memory_index SET embedding_status='retry' WHERE id=? AND embedding_status='pending' AND retry_count=? AND last_retry_at=? — optimistic concurrency"
- init (signature): mimo-a="function init(database: Database.Database, vectorFn, graphFn): void" vs mimo-c="function init(database: Database.Database, vectorFn, graphFn)"
- bm25Search (signature): mimo-a="SELECT id, spec_folder, importance_tier FROM memory_index WHERE id IN (?)" vs mimo-c="db.prepare(`SELECT id, spec_folder, importance_tier FROM memory_index WHERE id IN (...)`)"
- ftsSearch (signature): mimo-a="fts5Bm25Search(db, query, { limit, specFolder, includeArchived }) — uses bm25(memory_fts, 10.0, 5.0, 2.0, 1.0)" vs mimo-b="fts5Bm25Search(db, query, { limit, specFolder, includeArchived })"
- exactTriggerSearch (signature): mimo-a="SELECT m.* FROM memory_index m JOIN active_memory_projection p ... WHERE LOWER(m.trigger_phrases) LIKE ?" vs mimo-b="SELECT m.* FROM memory_index m JOIN active_memory_projection p ... WHERE LOWER(m.trigger_phrases) LIKE ?" vs mimo-c="db.prepare(`SELECT m.* FROM memory_index m JOIN active_memory_projection ...`)"
- structuralSearch (signature): mimo-a="SELECT id, title, file_path, importance_tier, importance_weight, spec_folder FROM memory_index ORDER BY CASE importance_tier ..." vs mimo-b="SELECT id, title, file_path, importance_tier, importance_weight, spec_folder FROM memory_index WHERE ... ORDER BY CASE importance_tier ..."
- lookupIdempotencyReceipt (signature): mimo-a="SELECT payload_hash, response_payload FROM memory_idempotency_receipts WHERE receipt_key = ?" vs mimo-b="SELECT payload_hash, response_payload FROM memory_idempotency_receipts WHERE receipt_key = ?" vs mimo-c="database.prepare(`SELECT payload_hash, response_payload FROM memory_idempotency_receipts WHERE receipt_key = ?`).get()"
- shouldSkipNearDuplicateCheck (signature): mimo-a="SELECT updated_at, last_dedup_checked_at FROM memory_index WHERE id = ?" vs mimo-b="SELECT updated_at, last_dedup_checked_at FROM memory_index WHERE id = ?" vs mimo-c="database.prepare(`SELECT updated_at, last_dedup_checked_at FROM memory_index WHERE id = ?`).get()"
- computeResultConfidence (signature): mimo-a="no direct SQLite/driver coupling; migration-neutral" vs mimo-b="computeResultConfidence(results: ScoredResult[]): ResultConfidence[]" vs mimo-c="export function computeResultConfidence(results: ScoredResult[]): ResultConfidence[]"
- normalizeContentForEmbedding (signature): mimo-a="no direct SQLite/driver coupling; migration-neutral" vs mimo-b="normalizeContentForEmbedding(content: string): string" vs mimo-c="export function normalizeContentForEmbedding(content: string): string"
- chunkLargeFile (signature): mimo-a="no direct SQLite/driver coupling; migration-neutral" vs mimo-b="chunkLargeFile(content: string): ChunkingResult" vs mimo-c="export function chunkLargeFile(content: string): ChunkingResult"
- planStatediff (signature): mimo-a="no direct SQLite/driver coupling; StatediffTargetType names are table references" vs mimo-c="export function planStatediff(desiredRows, priorRows, options): StatediffAction[]"
- resolveCanonicalDbDir (signature): mimo-a="no direct SQLite/driver coupling; migration-neutral" vs mimo-b="resolveCanonicalDbDir(dir, workspaceRoot?) → string" vs mimo-c="export function resolveCanonicalDbDir(dir: string, workspaceRoot?: string): string"

## 6. GRAPH CONVERGENCE
- graphDecision: STOP_BLOCKED
- sliceCoverage: 1.00
- reuseCatalogCoverage: 1.00
- agreementRate: 0.17
- relevanceFloor: 1.00
- dependencyCompleteness: 1.00
- Blocker: low_cross_executor_agreement
