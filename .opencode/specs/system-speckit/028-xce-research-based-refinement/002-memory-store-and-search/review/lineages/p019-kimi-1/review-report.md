# Review Report: 019-maintenance-grace-daemon-survives-reelection

## Executive Summary

- **Verdict**: CONDITIONAL
- **Active findings**: P0=0, P1=1, P2=4
- **hasAdvisories**: true
- **Scope**: Review of the maintenance-grace marker writer, launcher adopt predicate, and both launcher guard sites for phase 019.
- **Stop reason**: maxIterationsReached (configured `maxIterations: 1`)

The runtime behavior of the fix is sound: a fresh marker naming a live child prevents reaping at both the stale-reclaim and dead-socket respawn paths, and the predicate fails safe toward reaping. However, a P1 contract drift exists between the spec-mandated marker shape (`jobId`) and the shipped implementation (`labels`). Four P2 findings cover stale doc paths, duplicate label churn, silent write-failure dropping, and a stale implementation-summary claim about embedding-queue coverage.

## Planning Trigger

The CONDITIONAL verdict routes to `/speckit:plan` for a small remediation pass. The P1 contract drift must be reconciled (update the spec or the writer/tests) before the phase can be considered fully aligned. The P2 items are doc/robustness cleanups that can be batched with the P1 fix.

## Active Finding Registry

| ID | Severity | Dimension | Title | File:Line | Status |
|----|----------|-----------|-------|-----------|--------|
| F001 | P1 | correctness | Marker on-disk shape drifts from spec-mandated `jobId` field | `.opencode/skills/system-spec-kit/mcp_server/lib/storage/maintenance-marker.ts:45-50` | active |
| F002 | P2 | maintainability | Spec docs reference stale `mcp_server/bin/` paths | `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/019-maintenance-grace-daemon-survives-reelection/spec.md:118` | active |
| F003 | P2 | correctness | Duplicate labels possible in maintenance marker | `.opencode/skills/system-spec-kit/mcp_server/lib/storage/maintenance-marker.ts:36-39` | active |
| F004 | P2 | correctness | Marker write failures are silently dropped | `.opencode/skills/system-spec-kit/mcp_server/lib/storage/maintenance-marker.ts:44-51` | active |
| F005 | P2 | maintainability | Implementation summary is stale about embedding-queue coverage | `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:1038` | active |

## Remediation Workstreams

1. **Reconcile marker contract (F001, F002, F005)**
   - Decide whether the on-disk contract is `jobId` (spec/tests) or `labels` (implementation).
   - Update the losing side: either change the writer to emit `jobId` and update `retry-manager.ts` label usage, or update `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md`, and the stress harness to describe/reference `labels`.
   - Refresh doc paths from `mcp_server/bin/` to `.opencode/bin/`.

2. **Harden marker writer (F003, F004)**
   - Deduplicate `activeLabels` or switch to a set/map to avoid duplicate entries.
   - Surface or handle the return value of `atomicWriteFile`; at minimum log a warning when the marker cannot be written.

## Spec Seed

- Update `spec.md` section 3 (marker shape) and the Files to Change table to reflect either `labels` or `jobId` consistently.
- Update `implementation-summary.md` to remove the claim that the embedding queue is unprotected.

## Plan Seed

- T1: Choose the canonical marker field (`jobId` vs `labels`) and update spec/plan/tasks/tests accordingly.
- T2: Update doc paths to `.opencode/bin/` in spec, plan, tasks, and implementation-summary.
- T3: Harden `maintenance-marker.ts` write-result handling and label deduplication.
- T4: Re-run unit and isolated-harness tests; verify build and `node --check`.

## Traceability Status

| Protocol | Level | Status | Evidence |
|----------|-------|--------|----------|
| spec_code | core | partial | F001: spec field name diverges from implementation |
| checklist_evidence | core | pass | Implementation summary records evidence for each checked item |
| feature_catalog_code | overlay | N/A | Not exercised (maxIterations=1) |
| playbook_capability | overlay | N/A | Not exercised (maxIterations=1) |

## Deferred Items

- P2 findings F002-F005 are advisory and can be addressed in the same remediation pass as F001.
- Security, traceability, and maintainability dimensions were not dispatched because `maxIterations` was set to 1.

## Audit Appendix

### Iteration Table

| Run | Focus | Status | Findings (P0/P1/P2) | New Findings Ratio |
|-----|-------|--------|---------------------|--------------------|
| 1 | correctness | complete | 0/1/4 | 1.00 |

### Convergence Replay

- Max iterations reached after 1 iteration.
- Dimension coverage: correctness only; security/traceability/maintainability not covered.
- No blocked-stop events recorded.

### File Coverage Matrix

All files listed in `deep-review-strategy.md` Files Under Review were inspected in iteration 1.

### Dimension Breakdown

- correctness: 1 P1, 2 P2
- maintainability: 2 P2
- security: not reviewed
- traceability: not reviewed
