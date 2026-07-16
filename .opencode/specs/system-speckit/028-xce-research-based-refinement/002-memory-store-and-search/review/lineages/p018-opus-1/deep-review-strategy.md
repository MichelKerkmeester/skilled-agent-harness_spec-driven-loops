# Deep Review Strategy: 018-reindex-scan-responsiveness-and-cancellation

## Topic

Single-iteration fan-out review (lineage `p018-opus-1`, executor cli-claude-code / claude-opus-4-8) of the Level 1 fix that makes the background `memory_index_scan` yield the event loop in its all-rows tail loops and be genuinely cancellable.

## Review Dimensions

- [x] Correctness (D1)
- [x] Security (D2)
- [x] Traceability (D3)
- [x] Maintainability (D4)

All four dimensions covered in iteration 001 because the change is small (4 files, +35/-3 LOC) and maxIterations=1.

## Completed Dimensions

| Dimension | Verdict | Summary |
|-----------|---------|---------|
| Correctness | PASS | Yields land between self-contained transactions; cancel short-circuits return the cancelled envelope; partial-batch handling is order-safe. One P2 in-process Set cleanup gap. |
| Security | PASS | No new trust boundary, input, or credential surface. Internal cooperative-yield + in-memory flag only. |
| Traceability | PASS | REQ-001/002/003 resolve to shipped code with file:line evidence. REQ-004 test claim documented in summary/commit, not independently re-run (sandbox blocked test exec). |
| Maintainability | PASS (advisory) | Comment in job-store.ts overstates the terminal-cleanup invariant (P2). |

## Running Findings

- P0: 0
- P1: 0
- P2: 1 (F001 — cancelledJobIds Set entry leaks on the `failed`-via-`setJobState` terminal path; invariant comment inaccurate)

## What Worked

- Reading the implementation commit diff (`f1dbb676f2`) end-to-end, then verifying current file state against it.
- Tracing every job terminal path (`completeJob`, `setJobState('failed')`, `resetRunningJobsForKind`) against the Set add/delete sites.

## What Failed

- Running the touched-surface vitest suites directly: blocked by the Bash approval sandbox. Test-pass evidence relies on the commit message + implementation-summary, not a re-run in this session.

## Exhausted Approaches

- None.

## Ruled Out Directions

- Security deep-dive on the scan inputs: the change introduces no new input handling, so no attack surface delta.
- Concurrency-corruption hunt around the yields: confirmed yields sit only between committed per-row transactions, never inside one (spec risk mitigation holds).

## Next Focus

Loop complete at maxIterations=1. No further iterations. Synthesis emitted `review-report.md`.

## Known Context

- No `resource-map.md` present at init → `resource-map.md not present. Skipping coverage gate`.
- Level 1 spec folder, no `checklist.md` → `checklist_evidence` protocol N/A (exempt).
- Spec documents a deliberate follow-on (launcher lease-heartbeat re-election) that is explicitly out of scope.

## Cross-Reference Status

| Level | Protocol | Status | Notes |
|-------|----------|--------|-------|
| Core | spec_code | pass | REQ-001/002/003 verified to shipped code; all 4 "Files to Change" match the diff |
| Core | checklist_evidence | N/A | Level 1, no checklist.md |
| Overlay | feature_catalog_code | N/A | Internal daemon fix, no catalog claim |

## Files Under Review

| File | Coverage | Notes |
|------|----------|-------|
| handlers/memory-index.ts | reviewed | Tail-loop yields (1176, 1311), shouldAbort wire (1034), fast-cancel hook (1506) |
| utils/batch-processor.ts | reviewed | shouldAbort on RetryOptions, checked at top of batch loop (150) |
| lib/ops/job-store.ts | reviewed | cancelledJobIds Set, isCancelRequestedFast, terminal cleanup (369, 398) — P2 gap on failed path |
| tests/handler-memory-index-scan-jobs.vitest.ts | reviewed | Mock parity for isCancelRequestedFast (1 line) |

## Review Boundaries

- maxIterations: 1 (fan-out lineage, single comprehensive pass)
- convergenceThreshold: 0.10
- Observation-only: no code modified.

## Non-Goals

- The launcher lease-heartbeat / daemon re-election subsystem (documented out-of-scope follow-on).
- A full corpus reindex or the cosmetic consistency/enrichment cleanup.

## Stop Conditions

- maxIterations=1 reached after iteration 001.
