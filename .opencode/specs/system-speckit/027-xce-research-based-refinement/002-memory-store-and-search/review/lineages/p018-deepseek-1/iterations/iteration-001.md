# Iteration 001: Correctness - Tail-loop yields, early-abort, in-memory cancel flag

## Focus
Correctness dimension across all three modified implementation files:
- `mcp_server/utils/batch-processor.ts` — `shouldAbort` early-abort hook
- `mcp_server/lib/ops/job-store.ts` — in-process `isCancelRequestedFast` flag
- `mcp_server/handlers/memory-index.ts` — tail-loop yields + cancel wiring

## Scorecard
- Dimensions covered: correctness
- Files reviewed: 3 (plus test mock)
- New findings: P0=0 P1=0 P2=2
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.17 (2 P2 findings, severity-weighted: 2 * 1.0 / 12 = 0.17)

## Findings

### P0, Blocker
None.

### P1, Required
None.

### P2, Suggestion
- **F001**: Duplicate causal-edges import shadows static import, `mcp_server/handlers/memory-index.ts:1291`. The dynamic `await import('../lib/storage/causal-edges.js')` creates a second module reference to `createSpecDocumentChain` and `init` that shadows the static `import * as causalEdges from '../lib/storage/causal-edges.js'` on line 32. Both resolve `../lib/storage/causal-edges.js` and are used in the same function body (`runIndexScan`), making the code unnecessarily hard to follow — a reader may not realize the dynamic `init` on line 1292 is the same module as the static import. [SOURCE: memory-index.ts:32 vs memory-index.ts:1291]

- **F002**: Undocumented magic number for lease heartbeat floor, `mcp_server/handlers/memory-index.ts:496`. `Math.max(10000, Math.floor(leaseExpiryMs / 3))` hardcodes a 10-second minimum heartbeat interval. The code comment explains the one-third-of-expiry rationale but not why 10 seconds is the chosen floor — a reader cannot determine whether this is a conservative safety margin or an arbitrary lower bound. [SOURCE: memory-index.ts:496]

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | pass | hard | memory-index.ts:1166-1203, memory-index.ts:1307-1340, batch-processor.ts:14-19, batch-processor.ts:150, job-store.ts:75, job-store.ts:316-341, job-store.ts:369 | All normative claims in spec.md resolve to shipped implementation with file:line evidence |

## Assessment
- New findings ratio: 0.17
- Dimensions addressed: correctness
- Novelty justification: Two P2 documentation/clarity findings. The core correctness claims (yields between transactions, cancel check before yield, fast flag lifecycle, shouldAbort at batch boundary) are all correctly implemented with evidence at the cited file:line locations. No logic errors, off-by-one issues, broken invariants, or wrong return types found.

### Verified invariants
1. **Yield placement safety**: All `setImmediate` yields land between self-contained per-row transactions, never inside an open better-sqlite3 transaction. Confirmed by code comments at memory-index.ts:1170-1174 and memory-index.ts:1308-1310.
2. **Cancel check ordering**: Cancel is checked BEFORE the yield at both tail loops (memory-index.ts:1177-1179, memory-index.ts:1312-1314), so cancellation is observable at the yield boundary before the macrotask is released.
3. **shouldAbort at batch boundary**: batch-processor.ts:150 checks `retryOptions.shouldAbort?.()` at the top of each batch iteration, before any work starts.
4. **In-process flag lifecycle**: `cancelledJobIds` Set populated by `requestCancel` (job-store.ts:319), read by `isCancelRequestedFast` with no SQLite query (job-store.ts:339-341), cleared on `completeJob` (job-store.ts:369) and `resetRunningJobsForKind` (job-store.ts:398).
5. **Lease heartbeat cleanup**: `finally` block at memory-index.ts:1472-1483 properly clears intervals and releases lease.
6. **Background wiring**: memory-index.ts:1506 routes `isCancelled` through `isCancelRequestedFast(jobId)`.
7. **Test mock parity**: handler-memory-index-scan-jobs.vitest.ts:107 exports `isCancelRequestedFast` as a `vi.fn` reading from an in-memory Map, correctly mimicking the production in-process behavior.

## Ruled Out
None.

## Dead Ends
None.

## Recommended Next Focus
[D1 Correctness completed with PASS. Remaining dimensions: D2 Security, D3 Traceability, D4 Maintainability. With maxIterations=1 reached, no next focus — proceed to synthesis.]

## Claim Adjudication
No P0/P1 findings to adjudicate.

Review verdict: PASS
