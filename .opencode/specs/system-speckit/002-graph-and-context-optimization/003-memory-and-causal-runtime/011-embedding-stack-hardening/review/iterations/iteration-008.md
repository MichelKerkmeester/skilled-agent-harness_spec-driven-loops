# Deep Review Iteration 008

## Dimension

correctness/data-safety under-explored sweep: cache eviction and shard cache migration, WAL durability ordering, daemon shutdown sequencing, retention sweep maintenance, and embed batching/concurrency.

## Files Reviewed

- `.opencode/skills/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts:142` - shard-qualified cache table selection.
- `.opencode/skills/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts:206` - legacy cache schema migration.
- `.opencode/skills/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts:274` - LRU byte-budget eviction.
- `.opencode/skills/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts:416` - cache hit recency update.
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:1202` - custom database connection entry point.
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:1312` - tracked connection registration.
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:1325` - shared close sequence.
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:1345` - active shard WAL checkpoint.
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:1348` - active main WAL checkpoint.
- `.opencode/skills/system-spec-kit/mcp_server/context-server.ts:1493` - file-watcher drain before closeDb invariant.
- `.opencode/skills/system-spec-kit/mcp_server/context-server.ts:1501` - awaited file-watcher close.
- `.opencode/skills/system-spec-kit/mcp_server/context-server.ts:1507` - vectorIndex close after watcher drain.
- `.opencode/skills/system-spec-kit/mcp_server/context-server.ts:2044` - periodic WAL checkpoint registration.
- `.opencode/skills/system-spec-kit/mcp_server/lib/governance/memory-retention-sweep.ts:109` - post-delete FTS optimize.
- `.opencode/skills/system-spec-kit/mcp_server/lib/governance/memory-retention-sweep.ts:117` - incremental_vacuum guard.
- `.opencode/skills/system-spec-kit/mcp_server/lib/governance/memory-retention-sweep.ts:134` - post-delete WAL checkpoint.
- `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/execution-router.ts:198` - count and byte chunk assembly.
- `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/execution-router.ts:212` - chunked embedBatch call.
- `.opencode/skills/system-spec-kit/shared/embeddings/providers/hf-local.ts:823` - bounded embed retry loop.
- `.opencode/skills/system-spec-kit/shared/embeddings/providers/hf-local.ts:835` - batched POST request.
- `.opencode/skills/system-spec-kit/shared/embeddings/providers/hf-local.ts:862` - retryable readiness failure handling.
- `.opencode/skills/system-spec-kit/shared/embeddings/providers/hf-local.ts:925` - null-preserving batch preparation.
- `.opencode/skills/system-spec-kit/mcp_server/tests/vector-index-store.vitest.ts:66` - close_db WAL checkpoint tests.
- `.opencode/skills/system-spec-kit/mcp_server/tests/vector-index-store.vitest.ts:166` - active database switch test exercising multiple tracked connections.
- `.opencode/skills/system-spec-kit/mcp_server/tests/embedders/execution-router.vitest.ts:198` - byte-budget batch split coverage.
- `.opencode/skills/system-spec-kit/mcp_server/tests/memory-retention-sweep.vitest.ts:170` - post-delete maintenance coverage.

## Findings by Severity

### P0

None.

### P1

#### DR-008-P1-001 [P1] Non-active tracked SQLite connections skip the TRUNCATE checkpoint on shutdown

- File: `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:1329`
- Evidence: `initialize_db(custom_path)` supports multiple file-backed connections, and validated connections are kept in `db_connections` at `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:1312`. On shutdown, `close_db()` first iterates that map and, for every connection that is not the current `db`, immediately calls `detachActiveVectorShard(conn)` and `conn.close()` at `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:1329`-`.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:1332`. The explicit WAL durability sequence only runs later for the active singleton at `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:1345` and `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:1348`. That leaves prior/custom tracked connections without the same main or shard `wal_checkpoint(TRUNCATE)` guarantee before detach/close, despite the code comment saying better-sqlite3 close alone can leave uncheckpointed frames.
- Finding class: cross-consumer
- Scope proof: `rg -n "db_connections\\.set|initialize_db\\(|close_db\\(|wal_checkpoint"` shows the connection map and checkpoint logic are both centralized in `vector-index-store.ts`; the existing WAL tests assert the active connection path but do not cover the multi-connection switch at `.opencode/skills/system-spec-kit/mcp_server/tests/vector-index-store.vitest.ts:166`.
- Affected surface hints: ["vector-index shutdown", "custom database paths", "active vector shard", "unclean shutdown marker"]
- Recommendation: Factor the active connection's checkpoint-before-detach sequence into a helper and apply it to every tracked connection before `detachActiveVectorShard(conn)` and `conn.close()`. Remove each connection's unclean marker only after its own main checkpoint succeeds.

Claim adjudication:

- claim: `close_db()` can leave WAL frames for non-active tracked SQLite connections because it closes them before running the explicit main/shard TRUNCATE checkpoint sequence.
- evidenceRefs: [`.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:1202`, `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:1312`, `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:1329`, `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:1331`, `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:1345`, `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:1348`, `.opencode/skills/system-spec-kit/mcp_server/tests/vector-index-store.vitest.ts:166`]
- counterevidenceSought: Checked whether every tracked connection receives a checkpoint helper, whether the non-active branch calls `checkpointAllWal()`, and whether test coverage asserts checkpointing after switching active databases. The reviewed code only checkpoints the active singleton, and the multi-database test checks cache isolation rather than shutdown durability.
- alternativeExplanation: better-sqlite3 may passively checkpoint some frames on `close()`, but the active path's own comment rejects passive close as sufficient for the FTS/WAL corruption-prevention invariant.
- finalSeverity: P1
- confidence: 0.86
- downgradeTrigger: Downgrade if `db_connections` is proven test-only or if better-sqlite3 close is documented and tested to fully truncate both main and attached shard WALs for these non-active connections under the deployed runtime.

### P2

None.

## Traceability Checks

- `spec_code`: partial. The shutdown and WAL durability invariants are implemented for the active singleton path, but not for every tracked connection reachable through `initialize_db(custom_path)`.
- `checklist_evidence`: partial. Existing tests cover active main/shard checkpoint order and multi-DB cache isolation separately; no test combines database switching with all-connection shutdown checkpointing.
- `skill_agent`: pending.
- `agent_cross_runtime`: pending.
- `feature_catalog_code`: partial.
- `playbook_capability`: pending.

## Ruled-Out Areas

- Cache eviction and shard cache migration: no new finding. The cache table selector switches to `active_vec.embedding_cache` when the shard is attached, legacy schema migration is shard-qualified, hits update `last_used_at`, and byte-budget eviction has direct tests for global, per-profile, and query caps.
- Daemon fatal shutdown sequencing: no new finding. `fatalShutdown()` awaits file-watcher close before `vectorIndex.closeDb()`, matching the drain-then-close invariant.
- Retention sweep maintenance: no new finding. The sweep runs FTS optimize, checks `auto_vacuum` before `incremental_vacuum`, and checkpoints WAL after the delete transaction.
- Embed batching/concurrency: no new finding. The execution router chunks by both count and byte budget, the HF local client preserves null slots, validates row counts/dimensions, and retries a bounded transient readiness failure once.

## SCOPE VIOLATIONS

None.

## Verdict

FAIL for the under-explored correctness sweep because one new P1 data-safety finding was found. Overall program verdict remains CONDITIONAL with advisories/open P1s.

## Next Dimension

Continue convergence only after adjudicating DR-008-P1-001 alongside the existing P1 set; avoid re-mining the saturated single-writer/lease supervision cluster.
