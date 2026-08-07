# Review Report: 018-reindex-scan-responsiveness-and-cancellation

## 1. Executive Summary

- **Verdict**: PASS
- **Active findings**: P0=0, P1=0, P2=2
- **hasAdvisories**: true
- **Scope**: Review the implementation of the background memory_index_scan event-loop yield and cancellation fix.
- **Stop reason**: maxIterationsReached (1 of 1 iterations)
- **Session**: fanout-p018-kimi-1-1781718236450-bbehhf

The implementation correctly addresses the event-loop starvation and cancellation defects described in the spec. All four normative requirements (REQ-001 through REQ-004) resolve to concrete shipped behavior. The only active findings are P2 advisories about adding dedicated unit tests for two new primitives introduced by the fix.

## 2. Planning Trigger

PASS verdict with P2 advisories routes to `/create:changelog` to record the clean audit. The two P2 items may be addressed as follow-up test-coverage work without blocking release.

## 3. Active Finding Registry

### F001 — processBatches shouldAbort hook lacks dedicated unit test

- **Severity**: P2
- **Dimension**: correctness / maintainability
- **File**: `.opencode/skills/system-spec-kit/mcp_server/utils/batch-processor.ts:150`
- **Evidence**:
  - `.opencode/skills/system-spec-kit/mcp_server/utils/batch-processor.ts:11-19` — `RetryOptions.shouldAbort` declared.
  - `.opencode/skills/system-spec-kit/mcp_server/utils/batch-processor.ts:149-151` — abort check at top of batch loop.
  - `.opencode/skills/system-spec-kit/mcp_server/tests/batch-processor.vitest.ts:1-391` — no test covers `shouldAbort`.
- **Status**: active
- **Description**: The new early-abort hook is correctly wired but lacks direct unit-test coverage in the batch-processor test suite. It is exercised indirectly by the scan-jobs cancel test.

### F002 — job-store isCancelRequestedFast lacks dedicated unit test

- **Severity**: P2
- **Dimension**: correctness / maintainability
- **File**: `.opencode/skills/system-spec-kit/mcp_server/lib/ops/job-store.ts:339`
- **Evidence**:
  - `.opencode/skills/system-spec-kit/mcp_server/lib/ops/job-store.ts:75` — in-process `cancelledJobIds` Set.
  - `.opencode/skills/system-spec-kit/mcp_server/lib/ops/job-store.ts:316-320` — `requestCancel` populates Set before DB write.
  - `.opencode/skills/system-spec-kit/mcp_server/lib/ops/job-store.ts:339-341` — `isCancelRequestedFast` reads Set.
  - `.opencode/skills/system-spec-kit/mcp_server/tests/job-store.vitest.ts:1-157` — no test covers `isCancelRequestedFast` or Set cleanup.
- **Status**: active
- **Description**: The new fast cancel check avoids SQLite contention but is not directly asserted in the job-store test suite. Terminal cleanup of the Set is also not explicitly tested.

## 4. Remediation Workstreams

### Test-coverage follow-up

1. Add a `batch-processor.vitest.ts` test that supplies `shouldAbort` returning true mid-run and asserts the loop stops early and skips the inter-batch delay.
2. Add a `job-store.vitest.ts` test that asserts `requestCancel` makes `isCancelRequestedFast` return true and that `completeJob`/`resetRunningJobsForKind` clear the mirror.

## 5. Spec Seed

No spec changes required. The existing spec requirements are implemented correctly. Optional future spec addendum: cite the new `shouldAbort` and `isCancelRequestedFast` contracts in the test-plan sections of the packet.

## 6. Plan Seed

- **T1**: Add dedicated unit test for `processBatches({ shouldAbort })` early-abort path.
- **T2**: Add dedicated unit test for `isCancelRequestedFast` and `cancelledJobIds` cleanup.

## 7. Traceability Status

| Protocol | Level | Status | Evidence |
|----------|-------|--------|----------|
| spec_code | core | pass | REQ-001..REQ-004 map to concrete file:line behavior |
| checklist_evidence | core | pass | implementation-summary.md verification table cited; no checklist.md in Level-1 packet |
| feature_catalog_code | overlay | N/A | No catalog contradictions identified |
| playbook_capability | overlay | N/A | No playbook scenarios evaluated in 1-iteration run |

## 8. Deferred Items

- F001 and F002 are deferred as P2 advisories.
- Security, traceability, and maintainability dimensions were not covered due to maxIterations=1.
- Launcher lease-heartbeat re-election follow-on remains out of scope per the spec boundary.

## 9. Audit Appendix

### Iteration table

| Iteration | Focus | Files | P0 | P1 | P2 | Status | New-findings ratio |
|-----------|-------|-------|----|----|----|--------|--------------------|
| 001 | correctness | 4 | 0 | 0 | 2 | complete | 1.00 |

### Convergence replay

- Max iterations configured: 1
- Iterations completed: 1
- Stop reason: maxIterationsReached
- No blocked-stop events
- No P0/P1 findings

### File coverage matrix

| File | Iteration |
|------|-----------|
| mcp_server/handlers/memory-index.ts | 001 |
| mcp_server/utils/batch-processor.ts | 001 |
| mcp_server/lib/ops/job-store.ts | 001 |
| tests/handler-memory-index-scan-jobs.vitest.ts | 001 |

### Dimension breakdown

| Dimension | Covered |
|-----------|---------|
| correctness | yes |
| security | no |
| traceability | no |
| maintainability | no |
