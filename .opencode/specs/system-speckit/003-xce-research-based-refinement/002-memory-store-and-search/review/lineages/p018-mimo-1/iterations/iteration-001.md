# Review Iteration 001 — Correctness

## Dimension: Correctness
**Focus:** Logic, behavior, error handling — does the code do what the spec claims?

---

## Findings

### P2-001: Yield counter starts at 0, first yield at row 200 (not 1)
**Category:** correctness
**Severity:** P2
**[SOURCE: memory-index.ts:1176]**

The metadata-edge promotion loop initializes `promoterYieldCount = 0` at line 1168 and increments with `++promoterYieldCount % 200 === 0`. The first yield fires after 200 rows, meaning rows 1–199 execute synchronously. For a corpus with fewer than 200 indexed rows, no yield ever fires. This is acceptable because 200 synchronous SQLite row-operations complete in well under a second, but it is worth noting that the yield is a ceiling, not a guarantee.

**Verdict:** Advisory. No behavioral defect; the 200-row batch is small enough that the event loop is never starved in that window.

---

### P2-002: Causal-chain loop yield granularity (50 folders) is coarser
**Category:** correctness
**Severity:** P2
**[SOURCE: memory-index.ts:1311]**

The causal-chain folder loop yields every 50 folders (`chainYieldCount % 50 === 0`). Each folder runs a `SELECT` + `createSpecDocumentChain`, which is heavier than a single promoteMetadataEdges row. In a workspace with thousands of spec folders the per-folder cost could still accumulate, but 50-folder batches are reasonable given typical spec-folder counts (< 100).

**Verdict:** Advisory. Acceptable for current scale.

---

### P2-003: `shouldAbort` checked only at batch-loop top, not between items
**Category:** correctness
**Severity:** P2
**[SOURCE: batch-processor.ts:150]`

`shouldAbort` is checked once per batch iteration (`for (let i = 0; ...)`), not between individual items within a batch. A batch of up to 100 items (`MAX_BATCH_SIZE`) will complete before the abort takes effect. Combined with the per-item `isCancelled` check inside the scan's processor callback (`memory-index.ts:1011`), individual items still short-circuit, so the worst case is one batch of no-op `processWithRetry` calls after cancel.

**Verdict:** Advisory. The dual-layer guard (shouldAbort at batch level + isCancelled at item level) covers the gap.

---

### P1-001: `isCancelRequestedFast` returns false for jobs that crashed before cancel request
**Category:** correctness
**Severity:** P1
**[SOURCE: job-store.ts:339-341]**

`isCancelRequestedFast` reads only the in-process `cancelledJobIds` Set. If the daemon restarts after a crash, the Set is empty, so a job that was `cancel_requested=1` in the DB but whose process died before seeing the cancel will appear not-cancelled to the fast path. The background scan's `isCancelled` hook routes through `isCancelRequestedFast` (`memory-index.ts:1506`), so a post-crash restart of a scan job that was previously requested to cancel will not observe the durable cancel flag.

However, `resetRunningJobsForKind` (`job-store.ts:375-401`) marks interrupted jobs as `failed` on boot, so the job is terminal and cannot be re-run. The scan dispatch in `handleMemoryIndexScan` creates a fresh job, so the stale cancel flag is irrelevant.

**Verdict:** Conditional. The crash-recovery path (`resetRunningJobsForKind`) mitigates this, but the design relies on that mitigation being infallible. If a future refactor skips the reset, the fast path would silently ignore a durable cancel request. Recommend documenting this coupling explicitly.

---

### P2-004: `cancelledJobIds` Set is never cleaned on `resetRunningJobsForKind` for non-cancelled jobs
**Category:** correctness  
**Severity:** P2
**[SOURCE: job-store.ts:397-399]`

`resetRunningJobsForKind` deletes each interrupted jobId from `cancelledJobIds`, which is correct. But if a job was in the Set and then completed normally (not via reset), `completeJob` at line 369 also deletes it. No leak.

**Verdict:** No issue. Cleanup is covered on both paths.

---

### P2-005: `promoterYieldCount` and `chainYieldCount` are local variables, not reset across scans
**Category:** correctness
**Severity:** P2
**[SOURCE: memory-index.ts:1168, 1305]**

Both counters are declared inside `runIndexScan`, so each invocation gets fresh counters. No accumulation across calls.

**Verdict:** No issue.

---

## Dimension Coverage

| Dimension | Iteration | Status |
|-----------|-----------|--------|
| Correctness | 001 | ✅ Covered |
| Security | — | Pending |
| Spec-Alignment | — | Pending |
| Completeness | — | Pending |

## Summary

- **P0 findings:** 0
- **P1 findings:** 1 (mitigated by crash-recovery, but coupling should be documented)
- **P2 findings:** 4 (all advisory, no behavioral defects)
- **New info ratio:** 1.0 (first iteration)

Review verdict: CONDITIONAL
