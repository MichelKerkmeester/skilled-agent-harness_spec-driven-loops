# Review Report: maintenance-grace covers background embedding

**Target**: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/020-maintenance-grace-background-embedding`
**Type**: spec-folder (Level 1)
**Session**: `fanout-p020-deepseek-1-1781721166412-nlwse6` (fan-out lineage p020-deepseek-1)
**Date**: 2026-06-17

---

## 1. Executive Summary

| Field | Value |
|-------|-------|
| **Verdict** | CONDITIONAL |
| **Active P0** | 0 |
| **Active P1** | 1 |
| **Active P2** | 0 |
| **hasAdvisories** | false |
| **Iterations** | 1 (max 1 reached) |
| **Stop Reason** | maxIterationsReached |
| **Release Readiness** | converged (no P0, 1 P1 requiring remediation) |
| **Scope** | 4 files, ~2970 lines |

The 020-maintenance-grace-background-embedding feature widens the maintenance marker from 019 to cover the post-scan background-embedding queue. The implementation is well-executed: a clean shared reference-counted module, correct scan IIFE refactor, and properly gated embedding-queue wiring. All 4 spec requirements are confirmed implemented, all 4 tasks delivered, and the test suite covers the reference-counted lifecycle. One P1 finding (F001) concerns state mutation ordering in `beginMaintenance` and requires remediation before the code reaches full correctness confidence.

---

## 2. Planning Trigger

**Verdict = CONDITIONAL** → routes to remediation planning via `/speckit:plan`.

One active P1 finding (F001) must be resolved: reorder or guard the state mutation and `writeMarker()` call in `beginMaintenance()`. This is a low-blast change (~3 lines) in `maintenance-marker.ts`. No P0 findings exist, so release is not blocked — the finding is a correctness-hardening fix, not a ship-stopper.

---

## 3. Active Finding Registry

### F001 (P1, active) — State inconsistency in beginMaintenance

| Field | Value |
|-------|-------|
| **Severity** | P1 |
| **Dimension** | Correctness |
| **Category** | correctness |
| **File** | `lib/storage/maintenance-marker.ts:59-61` |
| **Claim** | `beginMaintenance` modifies `activeCount` and `activeLabels` before calling `writeMarker()`. If `writeMarker()` throws, module state is inconsistent with no recovery path. |
| **Evidence** | `activeCount += 1` (line 59), `activeLabels.push(label)` (line 60), then `writeMarker()` (line 61) |
| **Counterevidence Sought** | Checked both callers — they run post-DB-init so `DATABASE_DIR` exists in practice. Neither wraps in try/catch. |
| **Alternative Explanation** | `atomicWriteFile` may handle missing directories internally, making the throw impossible in practice — unconfirmed without reading `transaction-manager.ts`. |
| **Confidence** | 0.72 |
| **Downgrade Trigger** | If `atomicWriteFile` is confirmed to never throw on missing dirs, or callers add try/catch, downgrade to P2 (defensive-code advisory). |
| **First Seen** | Iteration 1 |
| **Transitions** | Iteration 1: null → P1 (initial discovery) |

---

## 4. Remediation Workstreams

### Lane 1: Correctness Hardening (F001)

- **Constituent findings**: F001
- **Target file**: `lib/storage/maintenance-marker.ts`
- **Action**: Reorder lines 59-61 so `writeMarker()` is called before `activeCount += 1` and `activeLabels.push(label)`, OR wrap the state mutations in try/catch with rollback on write failure.
- **Estimated blast radius**: 3 lines, no downstream consumers affected (callers only use handle API).
- **Execution order**: 1 (only lane)

---

## 5. Spec Seed

**Proposed spec delta** (minimal):

- Add to `spec.md` §4 Requirements, REQ-001 acceptance criteria: "`beginMaintenance` must not modify module state before confirming the marker file write succeeded."
- Or add a note to §6 Risks: "If `writeMarker` throws during `beginMaintenance`, the module enters an unrecoverable state. Mitigation: write-before-mutate ordering."

---

## 6. Plan Seed

**Remediation task**:

- **T-F001**: Reorder `beginMaintenance` to write the marker before mutating `activeCount`/`activeLabels`, or add try/catch with rollback. Target: `lib/storage/maintenance-marker.ts:58-66`. Verify: marker unit test still passes; confirm a synthetic `writeMarker` failure test recovers cleanly.

---

## 7. Traceability Status

### Core Protocols

| Protocol | Status | Gate | Counts | Notes |
|----------|--------|------|--------|-------|
| spec_code | pass | hard | 4 pass / 0 partial / 0 fail | All 4 REQ items confirmed in code |
| checklist_evidence | pass | hard | 4 pass / 0 partial / 0 fail | T002-T005 confirmed implemented |

### Overlay Protocols

None applicable (spec-folder target, no SKILL.md/agent overlays).

### Spec Code Detail

| REQ | Requirement | Implementation | Status |
|-----|------------|---------------|--------|
| REQ-001 | Shared reference-counted module | `maintenance-marker.ts:58-83` | pass |
| REQ-002 | Embedding queue protected | `retry-manager.ts:1032-1055` | pass |
| REQ-003 | Scan + queue overlap without clobbering | `maintenance-marker.ts:58-83` + test `maintenance-marker.vitest.ts:82-109` | pass |
| REQ-004 | Idle tick never marks | `retry-manager.ts:1032-1034` (empty-queue guard before beginMaintenance) | pass |

---

## 8. Deferred Items

No P2 advisories or deferred items in this review.

---

## 9. Audit Appendix

### Iteration Table

| Run | Focus | Dimensions | Files | P0/P1/P2 | New Ratio | Status |
|-----|-------|------------|-------|-----------|-----------|--------|
| 1 | Full pass | correctness,security,traceability,maintainability | 4 | 0/1/0 | 1.00 | complete |

### File Coverage Matrix

| File | Correctness | Security | Traceability | Maintainability |
|------|------------|----------|-------------|----------------|
| maintenance-marker.ts | Yes | Yes | Yes | Yes |
| memory-index.ts | Yes | Yes | Yes | Yes |
| retry-manager.ts | Yes | Yes | Yes | Yes |
| maintenance-marker.vitest.ts | Yes | — | Yes | Yes |

### Convergence Replay

- **Max iterations**: Reached (1 of 1). Hard stop enforced per config.
- **Dimension coverage**: 4/4 (correctness, security, traceability, maintainability).
- **Stabilization passes**: N/A (max iterations hit before stabilization check).
- **Legal-stop gates**: Not evaluated at max-iterations hard stop.
- **Verdict**: CONDITIONAL (0 P0, 1 P1, 0 P2).

### Adversarial Replay

F001 was re-examined:
- Evidence re-read at `maintenance-marker.ts:58-66` — confirmed ordering issue exists.
- Counterevidence: both callers initialize post-DB-setup; `atomicWriteFile` may be defensive — not confirmed.
- Severity confirmed at P1: latent correctness risk, low operational likelihood.
