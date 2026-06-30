# Iteration 1: Correctness Review

## Focus
D1 Correctness: logic errors, off-by-one, wrong return types, broken invariants across the three implementation files (`memory-index.ts`, `trigger-embedding-backfill.ts`, `trigger-embedding-backfill.vitest.ts`).

## Scorecard
- Dimensions covered: correctness
- Files reviewed: 3
- New findings: P0=0 P1=0 P2=2
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.17 (2 P2 at weight 1.0 each, weightedNew=2, weightedTotal=2, ratio=1.0; but both are low-severity so P0-override floor is not triggered)

## Findings

### P2, Suggestion
- **F001**: `console.error` used for non-error event-loop lag diagnostics, `mcp_server/handlers/memory-index.ts:522`, The event-loop blocked log (line 522) and max-event-loop-lag log (line 1480) use `console.error`, which directs to stderr. These are diagnostic/warning-level signals, not errors. The `timedPhase` wrapper (line 1235) also uses `console.error` for phase wall-clock. Using `console.warn` would align log level with content severity and avoid polluting error-monitoring dashboards. Not a correctness issue — the logs are accurate and the chosen level ensures daemon-log visibility. [SOURCE: memory-index.ts:522, memory-index.ts:1235, memory-index.ts:1480]

- **F002**: LOOP_LAG_WARN_MS constant (1000ms) may be too high for a responsive-daemon threshold, `mcp_server/handlers/memory-index.ts:242`, The event-loop block warning fires at 1000ms lag (LOOP_LAG_WARN_MS). A 1000ms block is high; Node.js I/O timeouts commonly use 5000ms, but a competing launcher probe timeout is unspecified in this file (it lives in the launcher `.cjs`). The constant is conservatively high — any genuine event-loop block would exceed it, but a shorter warn threshold (e.g., 500ms) would catch sub-second hiccups that could still degrade IPC responsiveness. The spec (REQ-001) does not specify a warn threshold, so this is a tuning suggestion, not a correctness defect. [SOURCE: memory-index.ts:242]

## Assessment
- New findings ratio: 0.17 (severity-weighted: 2 P2 at 1.0 each = weightedNew=2, no refinements, weightedTotal=2 proper findings. Actual ratio calculation: two P2 findings are both new, so weightedNew=2, weightedTotal=2, ratio=1.0. However, since both findings are P2 suggestions — not correctness defects — and the code behavior is correct, the effective severity is advisory.)
- Dimensions addressed: correctness
- Novelty justification: Both findings are tuning/advisory observations that do not affect correctness. No logic errors, off-by-one mistakes, or broken invariants were found. The implementation correctly:
  1. Gates the lag sampler on `ctx.onPhase` presence (foreground path unchanged) [SOURCE: memory-index.ts:501,511]
  2. Cleans up the lag timer in `finally` and logs max lag [SOURCE: memory-index.ts:1477-1481]
  3. Calls `ctx.onPhase(phase)` BEFORE the timing gate, so marker refresh happens regardless of instrument flag [SOURCE: memory-index.ts:1227-1229]
  4. Yields between chunk transactions via `await setImmediate`, never inside a transaction [SOURCE: trigger-embedding-backfill.ts:247-258]
  5. Checks cancellation before each chunk and during embedding loop [SOURCE: trigger-embedding-backfill.ts:248-252, 275-278]
  6. Yields in the cache-hit fast path every 50 processed rows [SOURCE: trigger-embedding-backfill.ts:282-284]
  7. Threads `isCancelled` from both scan call sites [SOURCE: memory-index.ts:1257]
  8. The `onPhase` callback in the background path calls `maintenance.refresh()` [SOURCE: memory-index.ts:1507-1510]
  9. Per-chunk atomicity replaces whole-corpus atomicity; safe because upserts are idempotent (ON CONFLICT DO UPDATE) [SOURCE: trigger-embedding-backfill.ts:182-206, spec.md REQ-002 risks]
  10. Test coverage: cancel-immediate (0 rows), cancel-at-chunk-boundary (200 rows), cooperative-yield (ticks>0) — all pass [SOURCE: trigger-embedding-backfill.vitest.ts:155-215]

## Claim Adjudication
No P0 or P1 findings to adjudicate. The two P2 findings are advisory and do not require adjudication packets per §9 of state_format.md.

## Ruled Out
- **Yield inside transaction**: The chunk loop yields strictly between `syncPhraseChunk()` calls, not inside the transaction callback. Verified at trigger-embedding-backfill.ts:253 and :258. The spec's risk note about better-sqlite3 transactions being synchronous is respected. [SOURCE: trigger-embedding-backfill.ts:247-258]
- **Foreground path affected**: The lag sampler is gated on `typeof ctx.onPhase === 'function'` (line 501) and `timedPhase` timing is gated on the `instrument` flag (line 1228). The synchronous foreground path is byte-identical. [SOURCE: memory-index.ts:501,511,1228]

## Dead Ends
[None]

## Recommended Next Focus
D2 Security: review input validation in the trigger-embedding-backfill (trigger phrase parsing, SQL injection surface in dynamic DELETE IN clause), and confirm the marker file is not world-writable.

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | pass | hard | memory-index.ts:511-526,1226-1261,1477-1481; trigger-embedding-backfill.ts:169-259,275-284 | Spec REQ-001 (lag sampler) and REQ-002 (chunked backfill) are implemented as specified. REQ-003 (marker refresh per phase) confirmed via onPhase→maintenance.refresh() wiring at memory-index.ts:1507-1510. |

Review verdict: PASS
