# Review Report: reindex-scan responsiveness and cancellation

## Executive Summary

- **Verdict**: PASS
- **hasAdvisories**: true
- **Active findings**: P0=0, P1=0, P2=1
- **Scope**: Review the implementation that makes `memory_index_scan` yield the event loop in its all-rows tail loops and become genuinely cancellable.
- **Stop reason**: maxIterations reached (1 of 1)

The correctness pass confirms that the three required changes are in place and behave as specified: tail-loop macrotask yields with cancel checks, an early-abort hook on `processBatches`, and an in-process cancel mirror read by `isCancelRequestedFast`. The only active finding is a low-severity advisory that the synchronous (non-background) scan path remains non-cancellable.

## Planning Trigger

PASS with advisories routes to changelog creation. The P2 advisory does not block release but should be added to the follow-on tracker if the synchronous path is ever exposed to cancel calls.

## Active Finding Registry

### F001 — Synchronous `memory_index_scan` path remains non-cancellable

- **Severity**: P2
- **Dimension**: correctness
- **Status**: active
- **File**: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:1488-1491`
- **Evidence**: `handleMemoryIndexScan` calls `runIndexScan(args, {})` when `args.background` is false, providing no `isCancelled` hook. The background branch supplies `() => isCancelRequestedFast(jobId)`.
- **Impact**: A long synchronous scan cannot be interrupted and could still starve the event loop. The spec explicitly scopes to background scans, so this is a documented limitation rather than a defect.
- **Suggested action**: Either document the synchronous path as non-cancellable or wire it through the same cooperative hooks if cancel support is desired later.

## Remediation Workstreams

1. **Documentation / follow-up** (F001)
   - Add a one-line note to `spec.md` or `implementation-summary.md` stating that cancellation and event-loop yields apply only to `background: true` scans.
   - No code change required for the current release.

## Spec Seed

No normative spec changes required. Optional addition to `implementation-summary.md` Known Limitations:

> The synchronous (`background: false`) `memory_index_scan` path does not accept cancellation hooks; only background scans are cooperative and cancellable.

## Plan Seed

- [ ] Triage F001: decide whether to document the limitation or extend cooperative hooks to the synchronous path.

## Traceability Status

| Protocol | Level | Status | Notes |
|----------|-------|--------|-------|
| spec_code | core | pass | All P0/P1 requirements verified against shipped code |
| checklist_evidence | core | pass | Level 1 folder; build/test evidence documented in implementation-summary.md |
| feature_catalog_code | overlay | not run | Skipped due to maxIterations=1 |
| playbook_capability | overlay | not run | Skipped due to maxIterations=1 |

## Deferred Items

- F001 (P2 advisory): synchronous path non-cancellable.
- Security, traceability, and maintainability dimensions were not covered because `maxIterations` was set to 1.

## Audit Appendix

### Iteration Coverage

| Run | Focus | Files | P0 | P1 | P2 | Status |
|-----|-------|-------|----|----|----|--------|
| 1 | correctness | 4 | 0 | 0 | 1 | complete |

### Convergence Replay

- Configured maxIterations: 1
- Iterations completed: 1
- New findings ratio (last): 0.10
- Stop reason: maxIterations reached
- Dimension coverage: 25% (1 of 4 dimensions)

### Files Reviewed

- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts`
- `.opencode/skills/system-spec-kit/mcp_server/utils/batch-processor.ts`
- `.opencode/skills/system-spec-kit/mcp_server/lib/ops/job-store.ts`
- `.opencode/skills/system-spec-kit/mcp_server/tests/handler-memory-index-scan-jobs.vitest.ts`

### Key Evidence Lines

- Tail-loop yield every ~200 rows: `memory-index.ts:1176-1180`
- Tail-loop yield every ~50 folders: `memory-index.ts:1311-1315`
- `processBatches` early-abort: `batch-processor.ts:150`
- In-process cancel Set and fast checker: `job-store.ts:75`, `job-store.ts:316-341`
- Background dispatch uses fast checker: `memory-index.ts:1506`
