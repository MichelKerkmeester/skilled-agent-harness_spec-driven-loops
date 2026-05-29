# Iteration 009 — Correctness

**Verdict:** PASS | **Findings:** P0=0 P1=0 P2=3 | **newFindingsRatio:** 1.0 | **adversarial P0 replays:** 0

## Findings

### [P2] PROV-1 — provenance/WIP-status  (confidence 0.97)
- **[SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:1313-1317]** · finding_class: `docs-vs-code`
- **Evidence:**
```
export function checkpointAllWal(): void {
  if (!db) return;
  try { db.pragma(`${ACTIVE_VECTOR_SCHEMA}.wal_checkpoint(TRUNCATE)`); } catch { /* best-effort */ }
  try { db.pragma('wal_checkpoint(TRUNCATE)'); } catch { /* best-effort */ }
}
```
- **Why:** The iteration brief states these enhancements are UNCOMMITTED parallel-session WIP. RECONCILIATION: that premise is now STALE. `git status --porcelain` returns empty for all four affected files; HEAD is `34604b521b fix(spec-memory): at-rest WAL durability — bounded autocheckpoint + periodic/dual-schema TRUNCATE (026/007/010)`. `git show HEAD:...` confirms checkpointAllWal (line 1313), wal_autocheckpoint=256 (lines 479,1230), the close_db shard-checkpoint-before-detach ordering, the registerInterval caller, the vector-index.ts re-export, and both new vitest cases are ALL committed. The conversation-start git snapshot showing `M` was captured before a parallel session committed the WIP. Flagging per brief: the enhancements are no longer uncommitted.
- **Fix:** No action needed; the WIP has landed in HEAD 34604b521b. Update any tracking that still treats this as uncommitted.

### [P2] COR-1 — correctness-confirmation  (confidence 0.93)
- **[SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:1305-1310]** · finding_class: `instance-only`
- **Evidence:**
```
try { db.pragma(`${ACTIVE_VECTOR_SCHEMA}.wal_checkpoint(TRUNCATE)`); } catch (_: unknown) { /* best-effort */ }
    try { db.pragma('wal_checkpoint(TRUNCATE)'); } catch (_: unknown) { /* best-effort */ }
    detachActiveVectorShard(db);
    db.close();
```
- **Why:** Confirms the shard-checkpoint-before-detach ordering is CORRECT: the active_vec shard WAL is TRUNCATE-checkpointed (line 1305) BEFORE detachActiveVectorShard (line 1308) issues `DETACH DATABASE active_vec`. Checkpointing must precede detach because once detached the schema name is unresolvable. Both pragmas are try/catch-wrapped so a missing/never-attached shard (e.g. when sqlite-vec failed to load or attach was skipped) cannot block close. The new vitest assertion checks pragma invocationCallOrder[shardCheckpoint] < exec invocationCallOrder[DETACH], directly proving the ordering invariant. Tests pass empirically.
- **Fix:** None — ordering and best-effort guards are correct.

### [P2] COR-2 — correctness-confirmation  (confidence 0.9)
- **[SOURCE: .opencode/skills/system-spec-kit/mcp_server/context-server.ts:1994]** · finding_class: `cross-consumer`
- **Evidence:**
```
registerInterval(() => vectorIndex.checkpointAllWal(), 300_000, { unref: true });
```
- **Why:** Confirms the periodic checkpointAllWal wiring is correct and safe. (1) checkpointAllWal guards `if (!db) return`, so it no-ops if the interval fires after close. (2) The interval is registered via registerInterval which supports `{ unref: true }` (timer-registry.ts:27-28 `if (options.unref) handle.unref?.()`), so it won't keep the event loop alive. (3) Shutdown calls clearAllTimers() (context-server.ts:1476) which clearInterval()s the registered handle (timer-registry.ts clearAllTimers loop), so the interval cannot fire post-shutdown. (4) The dual try/catch in checkpointAllWal means a detached/absent shard can't throw. No race or leak.
- **Fix:** None — the caller, unref, and shutdown-clear path are all consistent.

## Coverage
Covered: full read of vector-index-store.ts (checkpointAllWal at 1313-1317, wal_autocheckpoint=256 at 479 and 1230, close_db shard-checkpoint-before-detach ordering at 1305-1310) and the two new vitest cases (vector-index-store.vitest.ts:78-117). Verified the complete cross-consumer wiring: vector-index.ts:132 re-export and context-server.ts:1994 registerInterval caller, plus registerInterval/track/clearAllTimers in timer-registry.ts (unref + shutdown-clear safety). Ran the WAL-checkpoint vitest subset — 4 passed, 1 unrelated skip — confirming correctness empirically. PROVENANCE RECONCILIATION (per brief): the enhancements are NOT uncommitted — `git status --porcelain` is empty for all four files and `git show HEAD` confirms every change is in HEAD commit 34604b521b (\"at-rest WAL durability — bounded autocheckpoint + periodic/dual-schema TRUNCATE\"). The conversation-start `M` snapshot predates a parallel session's commit. Correctness verdict: PASS — no P0/P1. The shard-before-detach ordering, dual-schema TRUNCATE, bounded autocheckpoint, and periodic interval are all correct, defensively guarded (best-effort try/catch + `if (!db) return` + unref + clearAllTimers), and test-covered. NOT verified: real-world WAL durability under an actual SIGKILL mid-checkpoint (the tests assert call-ordering and at-rest WAL size 0, not kill-during-checkpoint behavior); behavior when sqlite-vec fails to load and active_vec is never attached was reasoned (try/catch swallows the 'unknown database' error) but not exercised by a dedicated test.

Review verdict: PASS
