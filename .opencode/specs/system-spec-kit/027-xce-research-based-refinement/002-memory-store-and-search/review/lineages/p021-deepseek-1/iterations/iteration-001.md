# Iteration 001: Correctness

## Focus
Correctness of the three implementation files: event-loop lag sampler, `timedPhase` wrapper, trigger-embedding-backfill chunking pattern, transaction/yield boundaries, cancellation threading, and resource cleanup.

## Scorecard
- Dimensions covered: correctness, traceability (partial)
- Files reviewed: 3
- New findings: P0=0 P1=0 P2=2
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.0

## Findings

### P2, Suggestion

- **F001**: `runNearDuplicateRepairBackfill` return value discarded at `timedPhase` call site. `memory-index.ts:1261` — The function returns `Promise<number>` (the count of repaired rows), but the `timedPhase` wrapper discards it. All four other `timedPhase` call sites capture their result into `results.*`. The near-dup-repair function handles its own warnings internally (lines 772-781), so no data is lost, but capturing the return value would be consistent with the pattern and would expose the count in scan results for operators. [SOURCE: `handlers/memory-index.ts:1261`]

- **F002**: `releaseScanLease()` is called both inside the try block (before return) and in the finally block, resulting in a redundant second call on all normal exit paths. `memory-index.ts:529,845,1430,1482` — The function is idempotent (guarded by `scanLeaseReleased` flag at line 481), so correctness is preserved, but the pattern makes the control flow harder to audit: every early-return path must remember to call release before return, even though finally always runs. Consolidating release to finally-only (or using a single-guard pattern) would reduce maintenance risk. [SOURCE: `handlers/memory-index.ts:479-484,529,845,1430,1472-1483`]

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | pass | hard | memory-index.ts:241-242,500-525,1226-1237,1472-1484 | REQ-001 (lag sampler) verified: gated on `ctx.onPhase` presence (line 500-501), samples 250ms drift (line 513-524), cleaned up in finally (line 1477-1480). REQ-002 (backfill chunking) verified: yield between chunk transactions (trigger-embedding-backfill.ts:247-259), cancel check at boundary (line 248), cache-hit yield (line 282-284). REQ-003 (marker refresh) verified: `timedPhase` calls `ctx.onPhase?.(phase)` before each tail phase (line 1227), background runner maps to `maintenance.refresh()` (line 1510). |
| checklist_evidence | n/a | hard | N/A | No checklist.md exists (Level 1 spec folder) — protocol skipped per contract. |

## Assessment
- New findings ratio: 0.0 (2 P2-only findings)
- Dimensions addressed: correctness, traceability (spec_code protocol)
- Novelty justification: Two P2 findings are minor code-style/maintainability notes; the core code logic (lag sampler, transaction-yield boundary, cancellation threading, timer cleanup) is correct and well-structured. The spec-to-code traceability confirms all REQ-001 through REQ-003 deliverable claims resolve to concrete, verifiable implementation lines.

### Correctness verification deep-dive

**Event-loop lag sampler** (`memory-index.ts:500-525,1472-1484`):
- Gated correctly: `instrument` is true only when `ctx.onPhase` is a function (line 500-501), keeping synchronous foreground path byte-identical.
- Drift measurement is sound: `sampledAt - loopLagExpectedAt` captures true event-loop blocking (line 515). The variable is reset to `sampledAt + LOOP_LAG_SAMPLE_MS` (line 516), so each sample measures the gap since the expected tick.
- Cleanup is complete: `clearInterval(loopLagTimer)` with null assignment and `maxLoopLagMs` log in the outer `finally` block (lines 1477-1480) covers normal exit, early cancellation at line 528, and empty-file-list early return at line 845.
- No race: Node's single-threaded JS execution means the `setInterval` callback and the scan's synchronous regions never race on `maxLoopLagMs` or `loopLagExpectedAt`.

**timedPhase wrapper** (`memory-index.ts:1226-1237`):
- Marker refresh: `ctx.onPhase?.(phase)` fires before timing starts (line 1227), giving each tail phase a full TTL ahead — correctly implements REQ-003.
- Instrument gating: `!instrument` short-circuit (line 1228) skips timing on the synchronous path after the no-op `ctx.onPhase?.(phase)` call. Both paths fire `fn()`.
- Wall-clock measurement: `Date.now()` deltas capture total phase time, including async await periods — designed to complement the lag sampler for distinguishing "slow but cooperative" from "blocking."

**Trigger-embedding-backfill chunking** (`trigger-embedding-backfill.ts:169-259`):
- Transaction boundary is correct: `syncPhraseChunk` is a `database.transaction()` closure (line 169), called per 200-row slice (line 253). The `await setImmediate` yield at line 258 is strictly BETWEEN chunk transactions, never inside one.
- Cancellation threading: `options.isCancelled?.()` checked at chunk loop entry (line 248) before any chunk is processed, and at embedding loop entry (line 275) before each pending row. Both return `cancelled` status with partial but consistent state.
- Cache-hit fast path: Yields every 50 processed rows (line 282-284), preventing multi-hundred-row cache-hit streaks from starving the loop. Each `markTriggerEmbeddingStatus` call is auto-committed (no explicit transaction), safe because the upserts are idempotent.
- Per-chunk atomicity is safe: `ON CONFLICT DO UPDATE` ensures idempotent phrase-hash upserts, and per-memory-id deletes ensure stale-phrase cleanup is scoped within each chunk's memory slice.

**Correctness of `markTriggerEmbeddingStatus` outside transaction in cache-hit path** (`trigger-embedding-backfill.ts:296-301`):
- The cache-hit branch calls `markTriggerEmbeddingStatus` as a raw `.prepare().run()` without a `database.transaction()` wrapper. In contrast, the generated-embedding branch wraps both `storeEmbedding` AND `markTriggerEmbeddingStatus` in a single `database.transaction()` (lines 311-322).
- This asymmetry is safe: `markTriggerEmbeddingStatus` is a single `UPDATE` statement (lines 125-135) that auto-commits. If interrupted mid-loop, rows marked 'ready' stay ready, pending rows retry on next run. However, a future maintainer adding logic after `markTriggerEmbeddingStatus` in this branch (expecting atomicity) could introduce a bug. This is a design consistency note, not a current correctness issue.

### Spec-to-code traceability (spec_code protocol)

| REQ | Claim | Implementation Evidence | Status |
|-----|-------|------------------------|--------|
| REQ-001 | Scan distinguishes true block from slow work | `LOOP_LAG_SAMPLE_MS=250` (line 241), `setInterval` drift sampler (lines 511-526), `timedPhase` per-phase wall-clock (lines 1226-1237), gated on `ctx.onPhase` (line 500-501) | pass |
| REQ-002 | Trigger-backfill chunked and cancellable | `PHRASE_SYNC_CHUNK_ROWS=200` (line 55), chunk loop with between-chunk yield (lines 247-259), `isCancelled` option (line 32), cache-hit yield (lines 282-284), `cancelled` status (line 35) | pass |
| REQ-003 | Each tail phase carries full marker TTL | `timedPhase` calls `ctx.onPhase?.(phase)` at entry (line 1227), background runner maps to `maintenance.refresh()` (lines 1507-1510) | pass |
| REQ-004 | Launcher unchanged, confirmed correct | Implementation summary confirms read-only investigation; no launcher code changed | pass |

## Ruled Out
- **Transaction-yield boundary violation**: Grep confirmed no `await` inside `database.transaction()` closures in trigger-embedding-backfill.ts. Both `setImmediate` calls are outside transaction closures (lines 258, 283).
- **Missing timer cleanup**: All exit paths (normal return, early cancellation, empty-files) fall through the outer `finally` block (lines 1472-1484), which clears both `leaseHeartbeat` and `loopLagTimer`.
- **Synchronous path pollution**: All instrumentation is gated on `typeof ctx.onPhase === 'function'` (line 500-501); the synchronous `handleMemoryIndexScan` path passes `{}` for ctx, so `instrument` is always false.

## Dead Ends
(None — all investigation paths yielded actionable evidence.)

## Recommended Next Focus
Maintainability (Priority 4): Review code style consistency (F001 return-value pattern discrepancy, F002 dual-release pattern), dead-code detection, and comment quality across all three files.

Review verdict: PASS
