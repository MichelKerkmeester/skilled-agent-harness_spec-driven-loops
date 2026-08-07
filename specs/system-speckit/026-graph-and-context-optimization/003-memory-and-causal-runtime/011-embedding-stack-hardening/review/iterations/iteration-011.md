# Deep Review Iteration 011

## Dimension

daemon shutdown + WAL ordering line-level: `context-server.cjs`/`context-server.ts` fatal shutdown sequencing, interval checkpoints, `vector-index-store.ts` `close_db`/`checkpointAllWal`/detach ordering, and unclean-shutdown marker write/delete semantics.

## Files Reviewed

- `.opencode/skills/system-spec-kit/mcp_server/context-server.ts:1473` - `fatalShutdown` single-entry guard and cleanup sequence.
- `.opencode/skills/system-spec-kit/mcp_server/context-server.ts:1501` - file watcher drain before vector-index close.
- `.opencode/skills/system-spec-kit/mcp_server/context-server.ts:1507` - synchronous `vectorIndex.closeDb()` cleanup step.
- `.opencode/skills/system-spec-kit/mcp_server/context-server.ts:1525` - registered timers cleared after shutdown hooks.
- `.opencode/skills/system-spec-kit/mcp_server/context-server.ts:2044` - periodic `checkpointAllWal` interval registration.
- `.opencode/skills/system-spec-kit/mcp_server/lib/runtime/timer-registry.ts:33` - interval registry implementation.
- `.opencode/skills/system-spec-kit/mcp_server/lib/runtime/timer-registry.ts:60` - `clearAllTimers`.
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:739` - unclean-shutdown marker write on DB open.
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:756` - unclean-shutdown marker removal helper.
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:842` - active vector-shard detach operation.
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:1325` - `close_db` entry.
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:1358` - marker removal after main WAL checkpoint.
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:1361` - shard detach after marker removal.
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:1362` - SQLite close after marker removal.
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:1367` - `checkpointAllWal` guard.
- `.opencode/skills/system-spec-kit/mcp_server/tests/vector-index-store.vitest.ts:61` - WAL close tests.
- `.opencode/skills/system-spec-kit/mcp_server/tests/vector-index-store.vitest.ts:104` - periodic checkpoint test.
- `.opencode/skills/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2499` - shutdown ordering source test.
- `.opencode/skills/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2600` - boot FTS integrity marker gate test.

## Findings by Severity

### P0

None.

### P1

#### DR-011-P1-001 [P1] Clean-shutdown marker is deleted before shard detach and DB close can fail

- File: `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:1358`
- Evidence: `initialize_db` writes `.unclean-shutdown` when opening a file DB at `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:1270`. On close, `close_db` removes that marker as soon as the main `wal_checkpoint(TRUNCATE)` succeeds at lines 1353-1359, but the attached vector shard is detached afterward at line 1361 and the actual SQLite handle is closed afterward at line 1362. `detachActiveVectorShard` calls `database.exec("DETACH DATABASE ...")` at line 846 outside a local catch, and `db.close()` is also outside a local catch, so either failure aborts the close path after the marker has already been deleted.
- Impact: A later boot uses marker presence to decide whether to run the FTS integrity check; `scheduleBootFtsIntegrityCheck` skips the check when the marker is absent at `.opencode/skills/system-spec-kit/mcp_server/context-server.ts:380`. The current order can therefore record a clean shutdown before the attached shard is detached and before the main handle actually closes. If close fails after marker deletion, the next daemon start can skip the corruption-detection path even though shutdown did not complete cleanly.
- Finding class: algorithmic.
- Scope proof: `rg -n "write_unclean_shutdown_marker|remove_unclean_shutdown_marker|scheduleBootFtsIntegrityCheck|wal_checkpoint|detachActiveVectorShard|db.close" .opencode/skills/system-spec-kit/mcp_server` shows one marker writer, one marker remover, and the boot check gate. Existing tests assert WAL checkpoint-before-detach and boot check gating, but do not assert marker deletion after successful detach and close.
- Affected surface hints: ["vector index close", "unclean-shutdown marker", "boot FTS integrity check", "active vector shard"]
- Recommendation: Move marker removal after both `detachActiveVectorShard(db)` and `db.close()` have succeeded, or keep an explicit `cleanCloseSucceeded` flag that only removes the marker in a `finally`/post-close section after all required close stages complete. If checkpoint failure remains best-effort, the marker should still represent whether detach and handle close completed, not only whether the main checkpoint statement returned.

##### Claim adjudication

- Claim: The clean-shutdown marker can be removed before the database shutdown sequence actually completes.
- Evidence refs: `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:1270`, `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:1353`, `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:1358`, `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:1361`, `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:1362`, `.opencode/skills/system-spec-kit/mcp_server/context-server.ts:380`, `.opencode/skills/system-spec-kit/mcp_server/context-server.ts:381`.
- Counterevidence sought: A local catch/finally around `detachActiveVectorShard(db)` or `db.close()` that preserves/recreates the marker on failure; a test asserting marker removal only after close succeeds; a boot check that runs even when the marker was prematurely removed.
- Alternative explanation: The code may intentionally treat main WAL checkpoint success as "clean enough" and treat detach/close failures as non-critical.
- Final severity: P1.
- Confidence: 0.82.
- Downgrade trigger: Downgrade to P2 if maintainers confirm the marker contract is only "main WAL checkpoint succeeded" rather than "database closed cleanly", or if better-sqlite3 `close()`/DETACH failures are proven impossible in this attached-shard lifecycle.

### P2

None.

## Traceability Checks

- `spec_code`: Partial. The code implements the advertised watcher-drain-before-close and checkpoint-before-detach ordering, but the marker lifecycle does not fully match the boot integrity gate semantics.
- `checklist_evidence`: Partial. Existing tests cover checkpoint calls and boot marker gating, but not marker deletion ordering across detach/close failure.
- `skill_agent`: Not applicable for this line-level shutdown pass.
- `agent_cross_runtime`: Not applicable for this line-level shutdown pass.
- `feature_catalog_code`: Partial. Shutdown durability behavior is present in code, with the marker-order exception above.
- `playbook_capability`: Not applicable.

## Ruled Out

- `fatal_shutdown_double_close`: Ruled out. `fatalShutdown` is guarded by `shuttingDown` at `.opencode/skills/system-spec-kit/mcp_server/context-server.ts:1473`, `close_db` clears tracked connections and nulls active `db` after close at `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:1363`, and `checkpointAllWal` returns when `db` is null at line 1368.
- `checkpoint_after_detach`: Ruled out. Active and non-active close paths issue shard WAL checkpoint before `detachActiveVectorShard`, and the tests assert this order for the active path.
- `interval_checkpoint_after_close`: Ruled out. The interval is registered at `.opencode/skills/system-spec-kit/mcp_server/context-server.ts:2044`, timers are cleared late at line 1525, but any interval firing after a successful close reaches `checkpointAllWal` and returns on null `db`.
- `watcher_reopen_after_close`: Ruled out. The shutdown sequence drains `fileWatcher` before `vectorIndex.closeDb()` at `.opencode/skills/system-spec-kit/mcp_server/context-server.ts:1501` and line 1507.

## SCOPE VIOLATIONS

None.

## Verdict

CONDITIONAL. One new P1 remains: marker deletion can announce a clean shutdown before detach and DB close have actually succeeded. No new P0 found.

## Next Dimension

Continue line-level adversarial verification on the remaining non-WAL P1 clusters: provider override bootstrap, reindex cancellation, TCP auth/perimeter, workflow lock fail-open, and model-server lease/listener lifecycle.
