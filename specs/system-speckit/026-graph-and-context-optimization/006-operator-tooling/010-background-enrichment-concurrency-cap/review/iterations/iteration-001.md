# Deep-Review Iteration 1

- **Worker**: cli-claude-code · claude-opus-4-8 · account2 · `review` agent · high effort
- **Target**: `/tmp/010-fix.diff` (memory-save.ts scheduler + context-server.ts scan yield)
- **Dimensions**: slot-accounting, event-loop yielding, enrichment regression, error paths

## Verdict: No P0 / No P1. Fix correct on all four dimensions. 2 non-blocking P2.

### Confirmed sound (with evidence)
- **Slot accounting** (`memory-save.ts:2919-2977`): exactly one `++` (in `start`, the only setImmediate caller), exactly one `--` (in `finally`, the outermost-try exit). Queue-push does not increment; increment deferred to dequeue. Cap holds under burst N≫4 (increment is now synchronous at call time → stale-zero race gone). Unconditional re-arm `start(next)` cannot overflow — it is preceded by `--` in the same synchronous block (net-zero); inductively `0 ≤ active ≤ MAX`. No stuck tail (last completion shifts `undefined`, active→0). Matches the loop-manager's independent trace.
- **Event-loop yielding**: re-arm via `setImmediate` defers to the next loop's check phase, so the poll phase (IPC accept) runs between enrichment generations. Scan-loop yield `% 50` triggers correctly (sum == files processed), skips/recounts no files.
- **Enrichment regression**: diff touches only increment placement + re-arm mechanism; deferred-result, `runPostInsertEnrichment`, `recordEnrichmentResult`, subscriber emit, sync fallback, and the pending-marker backfill contract all unchanged.
- **Error paths**: throw / `requireDb()` failure / superseded-row early-return all exit through `finally` → slot released. No unhandled rejection.

### P2 (non-blocking, no change required)
- **P2-1** (`:2961`, med): residual accept() latency (bounded, not the wedge) if `runPostInsertEnrichment` does heavy *synchronous* CPU work — a tuning characteristic of the enrichment body, outside this diff.
- **P2-2** (`:2944`, low): bare `setImmediate` not unref'd / not in the timer registry — **pre-existing** (original used raw setImmediate too), self-terminating at shutdown. Optional hardening only.

## Convergence tracker
- New P0: 0 · New P1: 0 · New P2: 2 (both pre-existing/tuning, not defects in the fix)
- Consecutive iterations with no new P0/P1: **1** (early-stop target: 3)
