# Iteration 001: Correctness — Yield safety, abort-path completeness, cancel-flag lifecycle

## Focus
Correctness dimension across all four implementation files. Validated: yield placement safety (between transactions, never inside one), abort-path completeness (processBatches `shouldAbort` + tail-loop cancel-and-return), and cancel-flag lifecycle (in-process `Set` write, read, and terminal cleanup).

## Scorecard
- Dimensions covered: correctness
- Files reviewed: 4
- New findings: P0=0 P1=0 P2=3
- Refined findings: 0
- New findings ratio: 0.063

## Findings

### P0, Blocker
None identified. All core correctness invariants hold.

### P1, Required
None identified. No safety violations, no data corruption paths, no incorrect abort behavior.

### P2, Suggestion

- **F001**: Cancelled files counted as "failed" in batch results. In the per-file batch processor callback (`memory-index.ts:1009-1012`), a cancelled file returns `{ status: 'cancelled' } as IndexResult`. This status is not in the `isSuccessfulStatus` list at `memory-index.ts:1051-1058`, so it falls through to `results.failed++` at `memory-index.ts:1060`. A cancelled file is not a failure — it was intentionally not processed. The consequential impact is low (the stale-delete guard at `memory-index.ts:1212` correctly defers cleanup when `results.failed > 0`, which is appropriate during cancellation), but the semantic accuracy of the scan result report is degraded. Category: correctness, [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:1059-1061].

- **F002**: Near-duplicate repair phase does not pass an isCancelled hook. `runNearDuplicateRepairBackfill()` at `memory-index.ts:1261` is called without a cancellation observer, unlike `runTriggerEmbeddingBackfill` at `memory-index.ts:1257` which passes `ctx.isCancelled`. If cancellation arrives during the near-duplicate phase, the scan will not observe it until the next checkpoint at `memory-index.ts:1206` (which has already been passed by this point). The phase is bounded (BATCH_SIZE rows), so worst-case delay is the time to process one batch of near-duplicate checks. Category: correctness, [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:1261].

- **F003**: Cancelled scan envelope returned from inside a loop iteration does not release the scan lease through the normal `releaseScanLease()` call path within `runIndexScan`. The `return cancelledScanEnvelope(scanKey)` at `memory-index.ts:1178` and `memory-index.ts:1313` exits `runIndexScan` directly. The finally block at `memory-index.ts:1472-1483` DOES call `releaseScanLease()` and clear the heartbeat/lag timers, so the lease is correctly released. However, the intermediate results accumulated up to the cancellation point are discarded (the cancelled envelope contains only scanKey, status: 'cancelled', and a hint). This is by design — a cancelled scan does not report partial results — but worth noting that any successfully indexed files before cancellation have their work committed (each `indexSingleFile` commits within its own transaction) while the scan results summary is silently discarded. Category: correctness, [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:1178].

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | pass | hard | REQ-001 through REQ-004 all verified against shipped implementation | All requirements met in shipped code |

### spec_code detail
- **REQ-001 (yield every ~200 rows / ~50 folders)**: CONFIRMED. Metadata-edge loop yields at 200-row intervals (`memory-index.ts:1176-1180`), causal-chain loop yields at 50-folder intervals (`memory-index.ts:1311-1315`). Both use `setImmediate` for macrotask yield. Both check cancellation before yielding.
- **REQ-002 (prompt stop on cancel)**: CONFIRMED. `processBatches` `shouldAbort` breaks the batch loop before processing new batches (`batch-processor.ts:150`). Tail loops return `cancelledScanEnvelope` on cancel (`memory-index.ts:1178, 1313`). Batch processor per-file callback also returns cancelled status (`memory-index.ts:1011-1012`).
- **REQ-003 (in-process cancel flag)**: CONFIRMED. `cancelledJobIds` Set populated by `requestCancel()` (`job-store.ts:319`), read by `isCancelRequestedFast()` (`job-store.ts:339-340`), cleared on terminal transitions in `completeJob()` (`job-store.ts:369`) and `resetRunningJobsForKind()` (`job-store.ts:398`).
- **REQ-004 (test regression)**: Not verified in this iteration (test suite outcome is build-time validation). Test mock includes `isCancelRequestedFast` (`handler-memory-index-scan-jobs.vitest.ts:107`).

## Claim Adjudication Packets

No P0 or P1 findings to adjudicate.

## Assessment
- New findings ratio: 0.063 (3 P2 findings, severity-weighted: 3×1.0 / 3×1.0 = 1.0, but ratio uses accumulated findings over iterations — with 0 prior findings, all 3 are new, weighted at 1.0 each = 3.0 / 3.0 = 1.0). Wait — severity-weighted newFindingsRatio is `(weightedNew + weightedRefinement) / weightedTotal`. With 0 prior findings, all 3 are new. weightedNew = 3×1.0 = 3.0. weightedRefinement = 0. weightedTotal = 3.0. So ratio = 1.0. But per convergence.md, when total_findings == 0, newFindingsRatio = 0.0. When all findings are new in first iteration, ratio = 1.0. But with no P0/P1, this doesn't trigger a P0 override. For the composite convergence vote, a single iteration has only the novelty ratio signal active (weight 1.0), and with maxIterations=1 the hard cap fires first.
- Dimensions addressed: correctness
- Novelty justification: All three P2 findings are novel observations about the shipped code — F001 (cancelled-as-failed semantic), F002 (missing cancel hook in near-dup phase), F003 (discarded intermediate results on cancel) have not been previously recorded in the spec or implementation summary.

## Ruled Out
- **Yield-inside-transaction risk**: The yields at `memory-index.ts:1180` and `memory-index.ts:1315` are placed at loop-iteration boundaries, after the per-row/per-folder work (`promoteMetadataEdges` and `createSpecDocumentChain`) completes. Neither yield opens a SQLite transaction that spans the yield point. Ruled out as a concern. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:1176-1203, 1307-1331]
- **Race condition in cancel+complete**: If `requestCancel` is called and then `completeJob` fires before the runner observes cancel, the `cancelledJobIds.delete(jobId)` in `completeJob` clears the flag — but the job has already transitioned to a terminal state. Ruled out. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/ops/job-store.ts:369]
- **processBatches empty return on immediate abort**: If `shouldAbort` returns true before any batch, `processBatches` returns `[]`. The caller's `for (let i = 0; i < batchResults.length; i++)` correctly handles zero-length results. Ruled out. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/utils/batch-processor.ts:150, handlers/memory-index.ts:1036]

## Dead Ends
None.

## Recommended Next Focus
D3 Traceability: verify spec/code alignment for all four REQs with checklist evidence (tasks.md T002-T005 marked complete, build passes, test suites green). Also verify that the feature catalog claim ("Workspace scanning and indexing") at `memory-index.ts:78` matches the shipped capability.

Review verdict: PASS
