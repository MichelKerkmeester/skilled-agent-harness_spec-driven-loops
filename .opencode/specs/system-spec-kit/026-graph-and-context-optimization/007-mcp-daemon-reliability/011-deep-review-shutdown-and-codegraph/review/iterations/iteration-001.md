# Iteration 001 — Correctness

**Verdict:** CONDITIONAL | **Findings:** P0=0 P1=2 P2=1 | **newFindingsRatio:** 1.0 | **adversarial P0 replays:** 0

## Findings

### [P1] CORR-001 — WAL checkpoint lifecycle / corruption-prevention asymmetry  (confidence 0.78)
- **[SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:1289-1296]** · finding_class: `class-of-bug`
- **Evidence:**
```
for (const [, conn] of db_connections) {
    try {
      if (conn !== db) {
        detachActiveVectorShard(conn);
        conn.close();
      }
    } catch (_: unknown) { /* ignore close errors */ }
  }
```
- **Why:** The non-active tracked connections are detached and closed WITHOUT the explicit wal_checkpoint(TRUNCATE) on main that the active `db` receives at lines 1305-1306. better-sqlite3 `.close()` only performs a passive checkpoint, which (per the code's own comment at 1299-1304) can leave un-checkpointed FTS5 frames that an abrupt later kill could corrupt. The documented FTS-corruption-prevention rationale applies to every persistent connection, not only the active one, so multi-path deployments leave non-active DBs with a larger corruption window at rest.
- **Fix:** Before `conn.close()` in the loop, run `try { conn.pragma(`${ACTIVE_VECTOR_SCHEMA}.wal_checkpoint(TRUNCATE)`); } catch {}` and `try { conn.pragma('wal_checkpoint(TRUNCATE)'); } catch {}` mirroring the active-db block so all tracked connections checkpoint+truncate before close.

### [P1] CORR-002 — Shard WAL checkpoint ordering on non-active connections  (confidence 0.7)
- **[SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:804-814, 1292]** · finding_class: `class-of-bug`
- **Evidence:**
```
export function detachActiveVectorShard(database: Database.Database): void {
  drop_legacy_temp_aliases(database);

  if (get_attached_vector_path(database)) {
    database.exec(`DETACH DATABASE ${ACTIVE_VECTOR_SCHEMA}`);
  }
```
- **Why:** For the active db, close_db explicitly truncates the shard WAL (line 1305 `${ACTIVE_VECTOR_SCHEMA}.wal_checkpoint(TRUNCATE)`) while still attached, THEN detaches (line 1307). For non-active connections (line 1292) detachActiveVectorShard is called directly with no prior TRUNCATE of the shard WAL. SQLite's DETACH flushes WAL into the shard file, but the explicit TRUNCATE the active path relies on to leave the shard -wal empty at rest (per the 1299-1304 rationale) is skipped, so a non-active connection's attached shard can be left with a non-empty -wal until the next process touches it.
- **Fix:** In the close_db loop, checkpoint the shard WAL (`conn.pragma(`${ACTIVE_VECTOR_SCHEMA}.wal_checkpoint(TRUNCATE)`)` best-effort) before calling detachActiveVectorShard(conn), matching the active-db ordering.

### [P2] CORR-003 — Module-global telemetry coherence during multi-connection close  (confidence 0.66)
- **[SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:811-813, 1292]** · finding_class: `instance-only`
- **Evidence:**
```
if (active_vector_source) {
    active_vector_source = { ...active_vector_source, attached: false };
  }
```
- **Why:** detachActiveVectorShard mutates the single module-global `active_vector_source.attached = false`. In the close_db loop it is invoked for every NON-active connection (line 1292). If more than one connection is tracked (active db + a custom-path db), detaching a non-active conn flips the global telemetry to attached:false even though the active db's shard is still attached at that point. getActiveVectorSource() (816-847) would then report stale state for the still-open active db until close_db reaches the active-db block. Harmless during full shutdown, but the global is not connection-scoped, so any caller that detaches one connection while another stays live gets incorrect attached telemetry.
- **Fix:** Only update active_vector_source when `database === db` (the active connection): guard the mutation with `if (active_vector_source && database === db)` so detaching a non-active connection does not corrupt the active connection's telemetry.

## Coverage
Covered the full close + WAL checkpoint lifecycle in vector-index-store.ts: close_db (1286-1311), checkpointAllWal (1313-1317), detachActiveVectorShard (804-814), attachActiveVectorShard ordering (749-798), the db_connections map (declared line 682, set at 1273, cleared at 1297), set_active_database_connection (693-729), and initialize_db close paths (1241/1254/1266). Verified barrel re-exports in vector-index.ts (lines 129-169) correctly surface close_db/checkpointAllWal/detachActiveVectorShard with no shadowing or missing exports. Confirmed no double-close of the active db (loop skips conn===db, then the if(db) block closes it) and no double-close on validation-failure paths (those connections are closed inline and never added to db_connections, which only happens after all validation passes at line 1273). Examined the checkpointAllWal/close_db TOCTOU on module-global `db`: NOT recorded as a finding because Node's single-threaded JS model with no await boundaries inside either function precludes real interleaving, and both pragmas are best-effort try/catch wrapped. COULD NOT verify at runtime: (1) whether better-sqlite3 DETACH actually leaves a non-empty shard -wal in practice (SQLite-version dependent) -- CORR-002 rests on the code's own documented TRUNCATE rationale, not a reproduced corruption; (2) actual call sites/concurrency of checkpointAllWal vs close_db from the daemon watchdog/signal handlers (the 007-mcp-daemon-reliability caller layer was out of scope and not read); (3) whether multi-path db_connections (>1 tracked connection) ever co-exist at runtime, which gates the severity of CORR-001/002/003 -- if only one connection is ever live, all three drop toward P2/non-issue.

Review verdict: CONDITIONAL
