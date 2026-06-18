# Iteration 001: Correctness review of reindex-scan responsiveness fix

## Focus

- Dimension: correctness
- Files: mcp_server/handlers/memory-index.ts, mcp_server/utils/batch-processor.ts, mcp_server/lib/ops/job-store.ts, tests/handler-memory-index-scan-jobs.vitest.ts
- Scope: Verify the event-loop yield and cancellation changes behave as specified and introduce no correctness regressions.

## Scorecard

- Dimensions covered: correctness
- Files reviewed: 4
- New findings: P0=0 P1=0 P2=2
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 1.00

## Findings

### P2, Suggestion

- **F001**: `processBatches` early-abort hook lacks a dedicated unit test, `.opencode/skills/system-spec-kit/mcp_server/utils/batch-processor.ts:150`. The new `RetryOptions.shouldAbort` option is checked at the top of the batch loop and correctly breaks out of the loop, skipping remaining batches and inter-batch delays. However, `batch-processor.vitest.ts` (lines 1-391) covers validation, batching, retry, delay, and sequential behavior but does not include a test that asserts early-abort actually stops iteration when `shouldAbort` returns true. The hook is exercised indirectly through the scan-jobs cancel test, but a direct unit test would guard against future regressions in the primitive.

- **F002**: `job-store` fast cancel mirror lacks a dedicated unit test, `.opencode/skills/system-spec-kit/mcp_server/lib/ops/job-store.ts:339`. `isCancelRequestedFast` reads the in-process `cancelledJobIds` Set without touching SQLite. `requestCancel` populates the Set before the durable UPDATE, and `completeJob`/`resetRunningJobsForKind` clear it on terminal transitions. `job-store.vitest.ts` (lines 1-157) exercises `isCancelRequested` and the durable cancel flag but does not assert that `requestCancel` populates the fast mirror, that `isCancelRequestedFast` returns true, or that terminal cleanup clears the mirror.

## Cross-Reference Results

| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | pass | hard | handlers/memory-index.ts:1176-1180, handlers/memory-index.ts:1311-1315, utils/batch-processor.ts:149-151, lib/ops/job-store.ts:316-320, lib/ops/job-store.ts:339-341 | REQ-001..REQ-004 all resolve to shipped behavior. |
| checklist_evidence | pass | hard | implementation-summary.md:86-90 | Build and 68 touched-surface tests reported PASS. Level-1 packet has no checklist.md. |

## Assessment

- New findings ratio: 1.00
- Dimensions addressed: correctness
- Novelty justification: Both findings are new P2 advisories about unit-test coverage for newly introduced primitives. No P0/P1 correctness defects were found. The core behavioral claims in the spec are confirmed by direct code inspection.

## Ruled Out

- Event-loop starvation in the batch loop: `processBatches` already yields cooperatively inside each batch and after every 50 items, so the starvation was correctly identified as the synchronous all-rows tail loops.
- Yield inside an open transaction: All yields in `memory-index.ts` sit at loop-iteration boundaries after per-row DB work, never inside a `promoteMetadataEdges` transaction.

## Dead Ends

- None.

## Recommended Next Focus

STOP — maxIterations=1 reached.

Review verdict: PASS
