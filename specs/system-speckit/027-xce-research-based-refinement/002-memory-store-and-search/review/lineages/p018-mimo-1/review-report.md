# Review Report: reindex-scan responsiveness and cancellation

## 1. Executive Summary

The 018 phase delivers on its spec: the background `memory_index_scan` now yields the event loop in its all-rows tail loops and is genuinely cancellable. The three-file change (tail-loop yields, `processBatches` early-abort, in-process cancel flag) is well-scoped and correctly placed. One P1 finding (design coupling between the fast cancel path and crash recovery) is mitigated by existing code but warrants documentation. Four P2 findings are advisory with no behavioral impact. Verdict: **CONDITIONAL**.

## 2. Planning Trigger

A live incident: `memory_index_scan` with `{force:true, background:true}` starved the daemon's single event-loop thread for over an hour, making all IPC timeout and the scan uncancellable, forcing SIGKILL.

## 3. Active Finding Registry

| ID | Severity | Category | File:Line | Summary |
|----|----------|----------|-----------|---------|
| P1-001 | P1 | correctness | `job-store.ts:339-341` | `isCancelRequestedFast` reads only in-process Set; post-crash restart relies on `resetRunningJobsForKind` to make stale cancel irrelevant |
| P2-001 | P2 | correctness | `memory-index.ts:1176` | First yield at row 200; small corpora never yield (acceptable) |
| P2-002 | P2 | correctness | `memory-index.ts:1311` | Causal-chain yield every 50 folders (acceptable at current scale) |
| P2-003 | P2 | correctness | `batch-processor.ts:150` | `shouldAbort` at batch top, not per-item (dual-layer guard covers) |
| P2-004 | P2 | correctness | `job-store.ts:397-399` | cancelledJobIds cleanup verified on both paths (no issue) |

## 4. Remediation Workstreams

### P1-001: Document fast-cancel / crash-recovery coupling
- **Action:** Add a code comment in `job-store.ts` near `isCancelRequestedFast` documenting that the fast path is only safe because `resetRunningJobsForKind` marks interrupted jobs terminal on boot.
- **Optional enhancement:** On boot, before any scan dispatch, backfill `cancelledJobIds` from durable `cancel_requested=1` rows so the fast path is self-contained.
- **Effort:** Low (comment) / Medium (backfill)

## 5. Spec Seed

No new spec work identified. The existing spec accurately describes the problem, scope, and deliverables.

## 6. Plan Seed

The launcher lease-heartbeat re-election follow-on (already documented in spec.md §7 and implementation-summary.md §Known Limitations) remains the blocking item for full scan completion.

## 7. Traceability Status

| Protocol | Status |
|----------|--------|
| spec_code | ✅ All 4 REQs traced to implementation |
| checklist_evidence | N/A (Level 1, no checklist.md required) |

## 8. Deferred Items

- Security dimension: not covered in this 1-iteration lineage pass.
- Spec-alignment dimension: not covered (but spec-code trace was verified during correctness review).
- Completeness dimension: not covered.
- Full convergence requires additional iterations across remaining dimensions.

## 9. Audit Appendix

- **Iterations dispatched:** 1
- **Stop reason:** maxIterations (1)
- **Dimensions covered:** 1 / 4
- **Config fidelity:** Valid; lineage block matches
- **State consistency:** JSONL has 1 config record + 1 iteration record

## Verdict

**CONDITIONAL** — P1 findings present with remediation plan. No P0 findings.

Review verdict: CONDITIONAL
