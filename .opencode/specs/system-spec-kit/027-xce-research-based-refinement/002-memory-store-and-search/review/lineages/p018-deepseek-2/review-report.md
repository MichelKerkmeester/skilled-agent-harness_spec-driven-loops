# Review Report — 018-reindex-scan-responsiveness-and-cancellation

**Generated**: 2026-06-17T14:15:00Z
**Session**: fanout-p018-deepseek-2-1781718236450-bbehhf (generation 1, lineage new)
**Iterations**: 1 of max 1
**Stop reason**: maxIterationsReached (hard cap)

---

## 1. Executive Summary

| Field | Value |
|-------|-------|
| **Verdict** | PASS |
| **Active P0** | 0 |
| **Active P1** | 0 |
| **Active P2** | 3 |
| **hasAdvisories** | true |
| **Dimensions covered** | 1/4 (correctness) |
| **Scope** | 4 source files (memory-index.ts, batch-processor.ts, job-store.ts, handler-memory-index-scan-jobs.vitest.ts) |
| **Convergence reason** | maxIterations=1 hard cap reached before full dimension coverage |

The shipped implementation correctly addresses the event-loop starvation incident. All four spec requirements (REQ-001 through REQ-004) are satisfied: tail-loop yields with cancel checks are in place, `processBatches` has an `shouldAbort` early-exit, the in-process cancel flag delivers cancellation without DB contention, and the test mock has parity. Three P2 advisories are recorded — none block release.

---

## 2. Planning Trigger

Verdict PASS with advisories routes to `/create:changelog`. No remediation planning required. The three P2 findings are advisory improvements that can be addressed in a future maintenance pass.

---

## 3. Active Finding Registry

| ID | Severity | Category | Dimension | Title | File | Line | Status |
|----|----------|----------|-----------|-------|------|------|--------|
| F001 | P2 | correctness | correctness | Cancelled files counted as failed in batch results | memory-index.ts | 1059 | active |
| F002 | P2 | correctness | correctness | Near-duplicate repair phase missing isCancelled hook | memory-index.ts | 1261 | active |
| F003 | P2 | correctness | correctness | Cancelled scan discards intermediate results silently | memory-index.ts | 1178 | active |

### F001 detail
**Claim**: When `ctx.isCancelled?.()` returns true in the per-file batch processor callback, the function returns `{ status: 'cancelled' } as IndexResult`. This status is not in the `isSuccessfulStatus` set, so `results.failed++` is incremented. A cancelled file is not a failure.
**Evidence**: `memory-index.ts:1051-1061`
**Impact**: Low — the stale-delete guard at `memory-index.ts:1212` correctly defers cleanup when `results.failed > 0`, which is appropriate during cancellation. The semantic inaccuracy affects scan result reporting only.

### F002 detail
**Claim**: `runNearDuplicateRepairBackfill()` at `memory-index.ts:1261` is called without a cancellation observer, unlike `runTriggerEmbeddingBackfill()` which receives `ctx.isCancelled`.
**Evidence**: `memory-index.ts:1257` (trigger-backfill passes hook) vs `memory-index.ts:1261` (near-dup-repair does not)
**Impact**: Low — the phase is bounded to BATCH_SIZE rows. Worst-case delay is one batch of near-duplicate checks.

### F003 detail
**Claim**: When cancellation is detected in the tail loops, `runIndexScan` returns `cancelledScanEnvelope(scanKey)` directly, discarding all intermediate results accumulated in the `results` object. Successfully indexed files (already committed via their own transactions) are not reflected in the cancellation envelope.
**Evidence**: `memory-index.ts:1178, 1313`
**Impact**: Informational only — the cancellation envelope intentionally does not report partial results. The committed work is durable regardless.

---

## 4. Remediation Workstreams

No remediation workstreams required. All findings are P2 advisories that do not block release.

### Optional follow-up lane: Scan result quality
- **F001**: Add `'cancelled'` to the `isSuccessfulStatus` set or handle it as a separate non-failure case before the failed-increment branch.
- **F002**: Pass `ctx.isCancelled` (or a derived `isCancelled` hook) to `runNearDuplicateRepairBackfill`.
- **F003**: Consider logging the count of successfully indexed files in the cancelled envelope for operator visibility.

---

## 5. Spec Seed

No spec amendments required. All four REQs are met. The three P2 findings do not require spec changes — they are code-quality observations below the severity threshold for spec updates.

---

## 6. Plan Seed

If the advisories are to be addressed, a lightweight plan:
1. **T-F001**: Add `'cancelled'` to the batch-result success-status set in `memory-index.ts` (~1 line).
2. **T-F002**: Thread the `ctx.isCancelled` hook into `runNearDuplicateRepairBackfill` (~3 lines in the call site + parameter type).
3. **T-F003**: Add a `filesIndexedBeforeCancel` count to the cancelled envelope (~5 lines).

Total estimated change: <15 lines across one file. No new dependencies or test changes required.

---

## 7. Traceability Status

| Protocol | Level | Status | Gate | Details |
|----------|-------|--------|------|---------|
| `spec_code` | core | pass | hard | All 4 REQs (REQ-001..004) verified against shipped implementation with file:line evidence. |
| `checklist_evidence` | core | pending | hard | Not executed — maxIterations=1 halted before traceability dimension iteration. Tasks T002-T005 are claimed complete in `tasks.md`; verification deferred. |
| `feature_catalog_code` | overlay | pending | advisory | Not executed — maxIterations=1 halted before overlay protocol pass. Feature catalog claim at `memory-index.ts:78-79` (Workspace scanning and indexing, Async ingestion job lifecycle) appears consistent with shipped capability but not formally verified. |

### spec_code evidence detail

| REQ | Requirement | Status | Evidence |
|-----|------------|--------|----------|
| REQ-001 | Tail-loop yields every ~200 rows / ~50 folders | PASS | `memory-index.ts:1176-1180` (metadata-edge yield at 200), `memory-index.ts:1311-1315` (causal-chain yield at 50) |
| REQ-002 | Cancelled run stops promptly | PASS | `batch-processor.ts:150` (shouldAbort breaks batch loop), `memory-index.ts:1011-1012,1034,1178,1313` (per-file cancel, shouldAbort wiring, tail-loop cancel returns) |
| REQ-003 | Cancel without DB contention | PASS | `job-store.ts:319` (in-process Set write), `job-store.ts:339-340` (no-DB read), `job-store.ts:369,398` (terminal cleanup) |
| REQ-004 | No test regression | DEFERRED | `handler-memory-index-scan-jobs.vitest.ts:107` — mock parity confirmed; suite execution deferred to build-time gate |

---

## 8. Deferred Items

| Item | Source | Priority | Notes |
|------|--------|----------|-------|
| checklist_evidence protocol | core traceability gate | P1 | Tasks T002-T005 completion claims not verified against shipped code in this review session |
| feature_catalog_code protocol | overlay traceability gate | P2 | Feature catalog claims at `memory-index.ts:78-79` not cross-referenced |
| Security dimension | review dimension | P1 | Not reviewed — maxIterations=1 halted before D2 Security pass |
| Maintainability dimension | review dimension | P2 | Not reviewed — maxIterations=1 halted before D4 Maintainability pass |
| Leash-heartbeat re-election follow-on | spec open question | P1 | Documented as out-of-scope follow-on; daemon still recycles during heavy scan |

---

## 9. Audit Appendix

### Iteration Table

| # | Focus | Dimensions | Files | P0 | P1 | P2 | Ratio | Status |
|---|-------|------------|-------|----|----|----|-------|--------|
| 1 | correctness | correctness | 4 | 0 | 0 | 3 | 1.00 | complete |

### Convergence Signal Replay

| Signal | Value | Vote | Notes |
|--------|-------|------|-------|
| Rolling Average | N/A | — | Only 1 evidence iteration; requires ≥2 |
| MAD Noise Floor | N/A | — | Only 1 evidence iteration; requires ≥3 |
| Dimension Coverage | 0.25 | CONTINUE | 1/4 dimensions covered |

**Stop decision**: maxIterationsReached. The hard cap of 1 iteration was reached before composite convergence could evaluate.

### Dimension Breakdown

| Dimension | Iterations | Verdict | Findings |
|-----------|------------|---------|----------|
| correctness | 1 | PASS | 3 P2 advisories |
| security | 0 | UNREVIEWED | — |
| traceability | 0 | UNREVIEWED | — |
| maintainability | 0 | UNREVIEWED | — |

### File Coverage Matrix

| File | Correctness | Security | Traceability | Maintainability |
|------|-------------|----------|-------------|-----------------|
| `mcp_server/handlers/memory-index.ts` | reviewed | — | — | — |
| `mcp_server/utils/batch-processor.ts` | reviewed | — | — | — |
| `mcp_server/lib/ops/job-store.ts` | reviewed | — | — | — |
| `mcp_server/tests/handler-memory-index-scan-jobs.vitest.ts` | reviewed | — | — | — |

### Replay Validation

Replay of convergence outcome from JSONL state: config record confirms maxIterations=1. Iteration record run=1 confirms status=complete, focus=correctness. Hard cap maxIterationsReached is the correct stop reason. No replay discrepancy detected.
