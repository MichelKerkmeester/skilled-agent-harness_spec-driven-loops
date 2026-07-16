# Review Report: 020-maintenance-grace-background-embedding

## 1. Executive Summary

- **Verdict**: CONDITIONAL
- **Active findings**: P0=0, P1=2, P2=2
- **hasAdvisories**: true
- **Scope**: Review of the reference-counted maintenance-marker implementation (`lib/storage/maintenance-marker.ts`), the scan wiring (`handlers/memory-index.ts`), and the background-embedding queue wiring (`lib/providers/retry-manager.ts`), plus the spec docs for this phase.
- **Stop reason**: maxIterations reached (1 of 1)

A single correctness/traceability iteration found two P1 issues: the synchronous foreground `memory_index_scan` path is not protected by the marker, and the marker writer does not handle filesystem-write failures. Two P2 advisories cover test-hygiene and verification-table clarity. No P0 findings were confirmed.

## 2. Planning Trigger

The CONDITIONAL verdict routes to `/speckit:plan` for remediation. The two P1 findings should be addressed before the phase can be considered release-ready:

1. Clarify or close the synchronous-scan protection gap (F001).
2. Harden `writeMarker()` against transient write failures (F002).

After remediation, a follow-up review covering the remaining dimensions (security, maintainability) is recommended.

## 3. Active Finding Registry

### F001 — Synchronous foreground scan path unprotected

- **Severity**: P1
- **Dimension**: correctness / traceability
- **File**: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:1489-1491`
- **Title**: Synchronous foreground `memory_index_scan` path is not protected by the maintenance marker.
- **Evidence**: `if (!args.background) { return runIndexScan(args, {}); }` bypasses `beginMaintenance`. The background path at `handlers/memory-index.ts:1502-1541` correctly acquires and releases a marker.
- **First/last seen**: iteration 1
- **Status**: active

### F002 — Marker write failures unhandled

- **Severity**: P1
- **Dimension**: correctness
- **File**: `.opencode/skills/system-spec-kit/mcp_server/lib/storage/maintenance-marker.ts:44-51`
- **Title**: `writeMarker()` does not handle failures from `atomicWriteFile`.
- **Evidence**: `writeMarker()` calls `atomicWriteFile` without a `try/catch`. The 20-second refresh timer (`lib/storage/maintenance-marker.ts:63`) calls `writeMarker` unconditionally; an unhandled exception in the timer callback can crash the daemon.
- **First/last seen**: iteration 1
- **Status**: active

### F003 — Test reset helper leaves marker file on disk

- **Severity**: P2
- **Dimension**: maintainability
- **File**: `.opencode/skills/system-spec-kit/mcp_server/lib/storage/maintenance-marker.ts:87-91`
- **Title**: `__resetMaintenanceMarkerForTest()` clears in-memory state but leaves the marker file on disk.
- **Evidence**: The helper resets counters and clears the timer but does not `rmSync` the marker. Relies on temp-directory cleanup in tests.
- **First/last seen**: iteration 1
- **Status**: active

### F004 — Verification table lacks scope note

- **Severity**: P2
- **Dimension**: traceability
- **File**: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/020-maintenance-grace-background-embedding/implementation-summary.md:88-92`
- **Title**: Implementation summary verification table lacks a scope note for marker coverage.
- **Evidence**: The table lists suites as PASS but does not clarify that marker protection is currently limited to the background scan path.
- **First/last seen**: iteration 1
- **Status**: active

## 4. Remediation Workstreams

### Workstream A: Close correctness gaps

- **Findings**: F001, F002
- **Order**: F002 first (daemon crash risk), then F001 (scope clarification).
- **Actions**:
  1. Wrap `atomicWriteFile` in `writeMarker()` with a `try/catch` that logs the error and allows the marker to lapse rather than crashing.
  2. Decide whether the synchronous `memory_index_scan` path should hold the marker. If yes, add `beginMaintenance('index_scan')` around `runIndexScan` in `handleMemoryIndexScan` for the non-background branch. If no, update `spec.md` and `implementation-summary.md` to state explicitly that only background scans are protected.

### Workstream B: Test and docs hygiene

- **Findings**: F003, F004
- **Order**: F003 (test cleanup), F004 (doc update).
- **Actions**:
  1. Make `__resetMaintenanceMarkerForTest()` remove the marker file when present.
  2. Add a one-line scope note to the implementation-summary verification table.

## 5. Spec Seed

No new spec requirements are proposed. Consider adding a clarifying note to `spec.md` §3 if the synchronous scan path is intentionally excluded from marker coverage.

## 6. Plan Seed

1. **T001** [P1] Harden `maintenance-marker.ts:writeMarker()` against `atomicWriteFile` failures.
2. **T002** [P1] Resolve synchronous-scan protection gap: either wire `beginMaintenance` into the foreground path or document the intentional exclusion.
3. **T003** [P2] Update `__resetMaintenanceMarkerForTest()` to remove the marker file.
4. **T004** [P2] Add marker-coverage scope note to `implementation-summary.md` verification table.
5. **T005** Follow-up review pass covering security and maintainability dimensions.

## 7. Traceability Status

| Protocol | Level | Status | Evidence |
|----------|-------|--------|----------|
| `spec_code` | core | partial | Most claims verified; synchronous scan path protection ambiguous/missing vs spec wording. |
| `checklist_evidence` | core | notApplicable | No `checklist.md` present. |
| `feature_catalog_code` | overlay | notApplicable | No catalog drift detected. |
| `playbook_capability` | overlay | notApplicable | No playbook scenarios reviewed. |

## 8. Deferred Items

- Security review of the marker module and retry-manager integration (deferred to a future iteration).
- Maintainability review of naming, module boundaries, and test coverage (deferred to a future iteration).
- P2 findings F003 and F004 are advisory and do not block release on their own.

## 9. Audit Appendix

### Iteration table

| Iteration | Focus | Dimensions | New Ratio | P0 | P1 | P2 | Status |
|-----------|-------|------------|-----------|----|----|----|--------|
| 1 | correctness | correctness, traceability | 0.57 | 0 | 2 | 2 | complete |

### Convergence replay

- Max iterations: 1 (reached).
- Dimension coverage after iteration 1: correctness=true, traceability=true, security=false, maintainability=false.
- Required traceability protocols: `spec_code` partial, `checklist_evidence` not applicable.
- Legal-stop gates: coverage gate not satisfied (security/maintainability uncovered), so STOP would have been blocked even without the iteration cap.

### File coverage matrix

| File | Reviewed | Findings |
|------|----------|----------|
| `mcp_server/lib/storage/maintenance-marker.ts` | yes | F002, F003 |
| `mcp_server/handlers/memory-index.ts` | yes | F001, F004 |
| `mcp_server/lib/providers/retry-manager.ts` | yes | none |
| `mcp_server/tests/maintenance-marker.vitest.ts` | yes | none |
| `spec.md` | yes | none |
| `plan.md` | yes | none |
| `implementation-summary.md` | yes | F004 |

### Claim adjudication

Both P1 findings include typed claim-adjudication packets in `iterations/iteration-001.md`. No downgrades were applied.
