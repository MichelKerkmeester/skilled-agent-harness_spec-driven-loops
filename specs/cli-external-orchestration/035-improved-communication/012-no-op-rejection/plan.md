---
title: "Implementation Plan: Phase 012 No-Op Rejection"
description: "Implement an explicit no-improvement policy for unchanged and threshold-defined near-echo candidates, with typed reasons and safe fallback."
trigger_phrases:
  - "no-op-rejection"
  - "implementation plan"
  - "unchanged echo acceptance"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/035-improved-communication/012-no-op-rejection"
    last_updated_at: "2026-08-13T00:00:00.000Z"
    last_updated_by: "codex"
    recent_action: "Authored the planned no-improvement policy scaffold."
    next_safe_action: "Capture the unchanged and near-echo baseline, then calibrate the threshold."
    blockers:
      - "The minimal edit-distance threshold requires fixture-based calibration."
    key_files:
      - "plan.md"
      - "spec.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-012-scaffold-20260813"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "What minimal edit-distance threshold separates a real projection from a near-echo without rejecting legitimately-terse-but-clear rewrites?"
    answered_questions:
      - "Phase purpose, boundary, dependencies, and acceptance are defined."
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->
# Implementation Plan: Phase 012 No-Op Rejection

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript fidelity and render policy |
| **Framework** | Runtime-neutral projection validator |
| **Storage** | No persistence change; typed content-free reason only |
| **Testing** | Threshold matrix, fallback assertions, and package gate |

### Overview

Replace unchanged-candidate acceptance with an explicit no-improvement result, add a calibrated minimal edit-distance boundary, and route that outcome to deterministic formatting or exact-original.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [ ] Verbatim, capitalization-only, terse-valid, and substantive baselines are recorded.
- [ ] The threshold metric and normalization rules are explicit.
- [ ] Fidelity, privacy, and meaning-judge boundaries are frozen.

### Definition of Done

- [ ] All five requirements have observed evidence.
- [ ] Boundary fixtures prove no-improvement without rejecting legitimate terse rewrites.
- [ ] The package gate and strict packet validation pass.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Post-restoration product-policy classification with typed safe fallback.

### Key Components

| Component | Responsibility |
|-----------|----------------|
| No-improvement classifier | Detects exact equality and threshold-defined near echoes |
| Typed reason contract | Exposes a distinct content-free outcome |
| Render fallback | Selects deterministic formatting or exact-original |
| Threshold fixtures | Calibrate false-positive and false-negative boundaries |

### Data Flow

Restored candidate -> exact/near-echo classifier -> no-improvement reason -> deterministic formatting or exact-original; otherwise continue existing gates.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## Affected Surfaces

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `src/fidelity/validator.ts` | Accepts unchanged restored text | Return no-improvement instead | Equality and threshold tests |
| Reason contracts | Describe gate outcomes | Add a typed content-free reason if absent | Type and serialization tests |
| Render decision | Chooses projection or fallback | Handle no-improvement explicitly | Exact-output assertions |
| Threshold fixtures | Not present | Add boundary and terse-message matrix | Calibration report |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [ ] Record the current unchanged and near-echo acceptance baseline.
- [ ] Define normalization, distance metric, threshold candidates, and boundary fixtures.

### Phase 2: Implementation

- [ ] Add exact and near-echo no-improvement classification.
- [ ] Add the typed reason and deterministic/exact-original fallback.

### Phase 3: Verification

- [ ] Test verbatim, capitalization-only, formatting-only, terse-valid, and substantive cases.
- [ ] Confirm fidelity, privacy, and meaning-judge behavior are unchanged.
- [ ] Run the package gate and strict packet validation.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Classification | Exact equality and threshold boundaries | Deterministic unit tests |
| Policy | Typed reason and fallback output | Integration fixtures |
| Negative control | Legitimately terse but clear rewrites | Boundary matrix |
| Regression | Fidelity, privacy, meaning judge, and package behavior | Existing suite and `npm run check` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Threshold calibration fixtures | Evidence | Required | Near-echo policy cannot be approved |
| Existing restored-candidate comparison | Internal | Available | Exact no-op classification cannot be placed correctly |
| Phase 011 | Related | Optional | Meaning-loss and no-change remain separate policies |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Legitimate terse rewrites are rejected, fallback is ambiguous, or an existing boundary changes.
- **Procedure**: Disable near-echo thresholding, retain exact-original behavior for exact equality if approved, rerun boundary fixtures, and restore the prior render-policy path.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Baseline and calibration -> No-improvement policy -> Boundary and regression verification
```

| Stage | Depends On | Blocks |
|-------|------------|--------|
| Baseline and calibration | Existing validator and fixture corpus | Policy implementation |
| Policy implementation | Approved threshold | Verification |
| Verification | Implemented policy | Phase handoff |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Stage | Complexity | Estimated Effort |
|-------|------------|------------------|
| Baseline and calibration | Medium | 1-2 days |
| Policy implementation | Medium | 1-2 days |
| Verification and handoff | Medium | 1-2 days |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-Change Checks

- [ ] Capture current equality and near-echo outcomes.
- [ ] Record threshold candidates and boundary fixtures.
- [ ] Confirm exact-original fallback is available.

### Procedure

1. Disable the near-echo threshold.
2. Restore the prior post-restoration policy path.
3. Replay boundary and regression fixtures.
4. Confirm fidelity and privacy outputs match baseline.

### Data Reversal

- **Has data migrations?** No.
- **Reversal procedure**: Remove the policy configuration and typed branch only.
<!-- /ANCHOR:enhanced-rollback -->
