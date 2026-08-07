# Deep Review Strategy — 027/002/018 reindex-scan responsiveness and cancellation

## Topic
Release-readiness audit of the event-loop responsiveness + cancellability fix for the
background `memory_index_scan` (fan-out lineage p018-opus-2, executor
cli-claude-code/claude-opus-4-8, maxIterations=1).

## Review Dimensions
- [x] Correctness (verdict: PASS — yields between transactions; early-abort preserves mtime invariant; Set lifecycle correct)
- [x] Security (verdict: PASS — no new input/trust/IPC surface)
- [x] Traceability (verdict: PASS — REQ-001/002/003 trace to shipped code; REQ-004 operator-verifiable)
- [x] Maintainability (verdict: PASS-with-advisory — new paths lack direct tests, F001)

## Completed Dimensions
All four dimensions covered in iteration 1. No P0/P1; 2 P2 advisories.

## Running Findings
- P0: 0
- P1: 0
- P2: 2 (F001 test-coverage of new paths, F002 requestCancel Set growth) — deltas: +2 from init

## What Worked
- Reading the commit diff (`f1dbb676f2`) plus the surrounding loop context pinned every
  REQ to a concrete line and confirmed the stated transaction-safety risk is mitigated.
- Cross-referencing the two unit suites (`batch-processor.vitest.ts`, `job-store.vitest.ts`)
  against the new exports surfaced the untested-new-path gap cleanly.

## What Failed
- Live `vitest run` of the five touched suites: blocked by interactive-approval
  requirement in the autonomous sandbox. REQ-004 left operator-verifiable.

## Exhausted Approaches
- Suite execution via `npx vitest` — not retried; environment cannot auto-approve it.

## Ruled-Out Directions
- Yield-inside-transaction corruption (mitigated by placement).
- Early-abort losing successfully-indexed work / mtime safety (partial results still folded; mtime-after-success invariant held).
- Security regression (no new surface).

## Next Focus
None required at current scope. Owner follow-ups: add direct tests for `shouldAbort`
and the `isCancelRequestedFast` Set lifecycle (F001); optionally guard `requestCancel`
against terminal/unknown-job Set growth (F002).

## Known Context
- Level 1 spec folder; no `checklist.md` (checklist_evidence exempt), no `resource-map.md`
  (`resource-map.md not present. Skipping coverage gate`).
- Documented out-of-scope follow-on: launcher lease-heartbeat re-election recycles the
  daemon mid-scan — the real blocker to a completed full scan, correctly excluded here.

## Cross-Reference Status
### Core
- spec_code: pass (3 REQs confirmed in code; REQ-004 operator-verifiable)
- checklist_evidence: n/a (Level 1, no checklist.md)
### Overlay
- feature_catalog_code: n/a (no catalog claim targets this fix)

## Files Under Review
| File | Coverage | Notes |
|------|----------|-------|
| `mcp_server/handlers/memory-index.ts` | reviewed | Tail-loop yields (`:1176`,`:1311`), processBatches shouldAbort wiring (`:1034`), fast-cancel hook (`:1506`) |
| `mcp_server/utils/batch-processor.ts` | reviewed | `shouldAbort` on RetryOptions + loop break (`:18`,`:150`) |
| `mcp_server/lib/ops/job-store.ts` | reviewed | in-process Set, fast check, terminal cleanup (`:75`,`:316-341`,`:369`,`:397-399`) |
| `mcp_server/tests/handler-memory-index-scan-jobs.vitest.ts` | reviewed | mock parity for new export (`:107`) |
| `mcp_server/tests/batch-processor.vitest.ts` | cross-ref | no shouldAbort test (F001) |
| `mcp_server/tests/job-store.vitest.ts` | cross-ref | no isCancelRequestedFast/Set test (F001) |

## Review Boundaries
- maxIterations: 1 (fan-out lineage)
- convergenceThreshold: 0.10
- severityThreshold: P2
- Scope frozen to the in-scope event-loop defect; launcher re-election is out of scope.

## Non-Goals
- Fixing or evaluating the launcher lease-heartbeat / daemon re-election subsystem.
- Auditing the broader memory-index scan beyond the three changed surfaces.

## Stop Conditions
- maxIterations (1) reached with all dimensions covered and no P0/P1 → STOP to synthesis.
