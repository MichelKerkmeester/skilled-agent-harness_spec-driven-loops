# Review Report: 019-maintenance-grace-daemon-survives-reelection

## Executive Summary

**Verdict**: CONDITIONAL
**Active P0**: 0 | **Active P1**: 1 | **Active P2**: 2
**hasAdvisories**: true
**Scope**: Spec-folder review of the maintenance-grace daemon-survives-reelection implementation (packet 019 under 027/002).
**Stop Reason**: maxIterations=1 exhausted (single-pass fan-out lineage).
**Release Readiness**: release-blocking (1 active P1 finding: spec file-path drift; no P0 correctness failures).

## Planning Trigger

The CONDITIONAL verdict routes to remediation planning. One P1 finding (F001: spec file-to-change table lists wrong paths for compiled .cjs files) requires a spec-doc update. Two P2 advisories (F002: stale limitation doc, F003: spec/plan TTL outdated) should be addressed during the same pass.

## Active Finding Registry

| ID | Severity | Dimension | Title | File:Line | First Seen | Status |
|----|----------|-----------|-------|-----------|------------|--------|
| F001 | P1 | traceability | Spec file-to-change table diverges from actual compiled file locations | .opencode/specs/.../spec.md:116-118 | 1 | active |
| F002 | P2 | maintainability | Stale limitation document: embedding queue IS marker-protected | .opencode/specs/.../implementation-summary.md:104 | 1 | active |
| F003 | P2 | maintainability | Spec/plan TTL (60s) diverges from implementation (180s) | .opencode/specs/.../spec.md:76 | 1 | active |

### Finding Details

**F001 (P1)**: The spec.md "Files to Change" table lists `mcp_server/bin/lib/model-server-supervision.cjs` and `mcp_server/bin/mk-spec-memory-launcher.cjs`. The actual compiled files reside at `.opencode/bin/lib/model-server-supervision.cjs` (exports `readMaintenanceMarker` and `shouldAdoptDespiteProbe` at lines 611-640) and `.opencode/bin/mk-spec-memory-launcher.cjs` (exports at lines 1845-1847). The test file `launcher-maintenance-guard.vitest.ts:13` correctly requires from `../../../../bin/mk-spec-memory-launcher.cjs`, confirming the actual location. The spec table is not an accurate find-the-shipped-file reference.

**F002 (P2)**: implementation-summary.md line 104 states the embedding queue is not marker-protected and suggests extending protection as follow-on work. Current code at `retry-manager.ts:1038` already calls `beginMaintenance('embedding-queue')` with release in a `finally` block (line 1055). The limitation document is stale.

**F003 (P2)**: spec.md (line 76) and plan.md (line 55) reference a 60s TTL. Current implementation at `maintenance-marker.ts:25` uses `MAINTENANCE_MARKER_TTL_MS = 180_000` (180s). implementation-summary.md documents the increase was driven by a ~79s blocking tail phase exceeding 60s. The spec/plan docs should be updated to reflect the shipped value.

## Remediation Workstreams

### Workstream 1: Spec Document Accuracy (F001, F003)
**Constituent Findings**: F001, F003
**Execution Order**: 1
1. Update spec.md "Files to Change" table to reflect actual compiled file locations (`.opencode/bin/lib/model-server-supervision.cjs`, `.opencode/bin/mk-spec-memory-launcher.cjs`)
2. Update spec.md and plan.md TTL references from 60s to 180s, or note the rationale for the divergence

### Workstream 2: Implementation Summary Accuracy (F002)
**Constituent Findings**: F002
**Execution Order**: 2
1. Update implementation-summary.md "Known Limitations" section to remove the stale claim about the embedding queue being unprotected, since `retry-manager.ts` already calls `beginMaintenance('embedding-queue')`

## Spec Seed

### spec.md delta
- Replace "Files to Change" table entries for `model-server-supervision.cjs` and `mk-spec-memory-launcher.cjs` with correct paths under `.opencode/bin/`
- Update TTL references from 60s to 180s, add note that the TTL was raised after live testing revealed a ~79s blocking phase

### implementation-summary.md delta
- Remove or correct "Known Limitations" bullet claiming the embedding queue is not marker-protected; note instead that both the scan and embedding queue are now protected via reference counting

## Plan Seed

1. T001: Update spec.md file paths and TTL value (spec.md)
2. T002: Update plan.md TTL value (plan.md)
3. T003: Remove stale embedding-queue limitation from implementation-summary.md (implementation-summary.md)

## Traceability Status

| Protocol | Status | Gate | Evidence |
|----------|--------|------|----------|
| spec_code | partial | hard | REQ-001/002/003/004 all verified in shipped code; F001 (file-path mismatch) and F003 (TTL divergence) are spec-doc issues, not implementation issues |
| checklist_evidence | n/a | hard | Level 1 spec, no checklist.md required |

## Deferred Items

- Security dimension not evaluated (maxIterations=1 exhausted before reaching it)
- `adversarial-replay` not executed (no P0 findings to replay)
- Full 4-dimension coverage requires additional iterations

## Audit Appendix

### Iteration Table
| Iteration | Focus | newFindingsRatio | Findings | Status |
|-----------|-------|-----------------|----------|--------|
| 001 | correctness+traceability | 0.55 | P0=0 P1=1 P2=2 | complete |

### Convergence Signal Replay
| Signal | Value | Threshold | Met |
|--------|-------|-----------|-----|
| Rolling Average | N/A (single iteration) | 0.08 | N/A |
| MAD Noise Floor | N/A | - | N/A |
| Dimension Coverage | 3/4 | 4/4 | NO |
| Max Iterations | 1/1 reached | - | STOP |

### File Coverage Matrix
| File | Correctness | Security | Traceability | Maintainability |
|------|-------------|----------|-------------|----------------|
| lib/storage/maintenance-marker.ts | ✓ | - | ✓ | ✓ |
| bin/lib/model-server-supervision.cjs | ✓ | - | ✓ | - |
| bin/mk-spec-memory-launcher.cjs | ✓ | - | ✓ | - |
| handlers/memory-index.ts | ✓ | - | ✓ | - |
| lib/providers/retry-manager.ts | ✓ | - | ✓ | ✓ |
| tests/maintenance-marker.vitest.ts | ✓ | - | ✓ | - |
| tests/launcher-maintenance-guard.vitest.ts | ✓ | - | ✓ | - |
| stress_test/.../daemon-reelection-adoption-live.vitest.ts | ✓ | - | ✓ | - |

### Dimension Breakdown
- **Correctness**: PASS (no logic bugs; marker mechanism verified: reference counting, atomic writes, unref timer, phase-boundary refresh, fail-safe predicate, both guard sites present; embedding queue also protected)
- **Traceability**: CONDITIONAL (F001: spec file paths diverge; REQ-001/002/003/004 all verified)
- **Security**: NOT EVALUATED (maxIterations exhausted)
- **Maintainability**: CONDITIONAL (F002: stale limitation doc; F003: spec/plan TTL outdated)

### Adversarial Replay
Not executed: no P0 findings to replay.
