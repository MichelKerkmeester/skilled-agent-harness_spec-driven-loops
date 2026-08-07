# Deep Review Strategy

## Files Under Review

| File | Role |
|------|------|
| `mcp_server/handlers/memory-index.ts` | Scan executor: tail-loop yields, cancel checks, processBatches wiring |
| `mcp_server/utils/batch-processor.ts` | Batch primitive: `shouldAbort` early-abort hook |
| `mcp_server/lib/ops/job-store.ts` | Job lifecycle: in-process cancel Set, `isCancelRequestedFast`, terminal cleanup |

## Cross-Reference Status

### Core
- Spec ↔ Implementation: REQ-001 (tail-loop yields) ↔ `memory-index.ts:1176` (metadata-edge) and `memory-index.ts:1311` (causal-chain)
- Spec ↔ Implementation: REQ-002 (cancelled run stops promptly) ↔ `batch-processor.ts:150` (`shouldAbort` break) and `memory-index.ts:1177-1179` / `memory-index.ts:1312-1314` (tail-loop cancel returns)
- Spec ↔ Implementation: REQ-003 (in-process cancel flag) ↔ `job-store.ts:75` (Set), `job-store.ts:339-341` (`isCancelRequestedFast`), `job-store.ts:319` (add on requestCancel), `job-store.ts:369` (delete on completeJob)
- Spec ↔ Implementation: REQ-004 (no test regression) ↔ implementation-summary claims 68 tests pass

### Overlay
- Plan ↔ Implementation: Phase ordering matches plan.md §4
- Tasks ↔ Implementation: T002-T005 map to the three source files + test mock

## Known Context
- The incident: a `memory_index_scan` with `{force:true, background:true}` pegged the event loop for over an hour, IPC timed out, scan uncancellable, daemon SIGKILLed.
- The fix: three cooperating changes — tail-loop yields, processBatches early-abort, in-process cancel flag.
- Scope held to event-loop defect; launcher lease-heartbeat re-election is a documented follow-on.
- `resource-map.md` absent at init; skipping coverage gate.

## Review Boundaries
- Read-only audit of the three source files and spec folder docs.
- No code changes during review.
- Findings cite `[SOURCE: file:line]`.
