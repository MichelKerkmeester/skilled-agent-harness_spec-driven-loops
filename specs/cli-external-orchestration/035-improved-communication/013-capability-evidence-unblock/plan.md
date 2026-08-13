---
title: "Implementation Plan: Phase 013 Capability-Evidence Unblock"
description: "Capture and record fresh provider control evidence, apply it through the existing capability merge and compiler, and prove supported reachability plus fail-closed reversal."
trigger_phrases:
  - "capability-evidence-unblock"
  - "implementation plan"
  - "control knobs fail-closed"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/035-improved-communication/013-capability-evidence-unblock"
    last_updated_at: "2026-08-13T00:00:00.000Z"
    last_updated_by: "codex"
    recent_action: "Authored the planned capability-evidence scaffold."
    next_safe_action: "Capture fresh dated provider evidence and the exact-original-before-transport baseline."
    blockers: []
    key_files:
      - "plan.md"
      - "spec.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-013-scaffold-20260813"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Phase purpose, boundary, dependencies, and acceptance are defined."
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->
# Implementation Plan: Phase 013 Capability-Evidence Unblock

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript provider capability contracts and JSON fixtures |
| **Framework** | Fail-closed provider routing and control compilation |
| **Storage** | Dated capability snapshot stored with evaluation strata |
| **Testing** | Compiler, transport reachability, expiry, contradiction, and package checks |

### Overview

Capture fresh evidence for temperature and thinking controls, merge it through the existing capability path, and prove that supported dispatch reaches transport while missing or stale evidence still fails closed.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [ ] Current exact-original-before-transport behavior is recorded.
- [ ] Evidence source, observation, mapping, provider/model identity, and expiry are defined.
- [ ] Fail-closed compiler behavior is frozen.

### Definition of Done

- [ ] All five requirements have observed evidence.
- [ ] Fresh evidence reaches transport and missing/stale/contradictory variants fail closed.
- [ ] The package gate and strict packet validation pass.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Evidence-backed capability snapshot merged through the existing fail-closed control compiler.

### Key Components

| Component | Responsibility |
|-----------|----------------|
| Capability snapshot | Records provider/model identity, mappings, observation, and expiry |
| Snapshot merge | Applies evidence without replacing unknown facts by assumption |
| Control compiler | Returns supported only when capability, mapping, freshness, and evidence agree |
| Reachability harness | Proves supported transport and exact-original reversal |

### Data Flow

Dated snapshot -> `mergeCapabilitySnapshot` -> `compilePromptControls` -> provider dispatch or exact-original-before-transport.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## Affected Surfaces

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Provider preset | Holds unknown control facts | Associate only recorded fresh evidence | Preset and compiler tests |
| Capability snapshot fixture | Not reproducibly checked in | Add dated facts and evaluation strata | Fixture schema and freshness checks |
| Control compiler | Enforces fail-closed policy | Preserve logic; verify supported path | Supported/reversal matrix |
| Provider executor | Stops before transport when unsupported | Prove fresh evidence reaches transport | Transport spy |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [ ] Capture baseline preset, compiler, and executor outcomes.
- [ ] Collect and review fresh temperature/thinking evidence.

### Phase 2: Implementation

- [ ] Author the dated snapshot and evaluation-strata record.
- [ ] Apply it through the existing merge/compiler path.

### Phase 3: Verification

- [ ] Prove supported compilation and transport reachability.
- [ ] Remove, stale, contradict, and make facts unknown to prove fail-closed reversal.
- [ ] Run the package gate and strict packet validation.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Contract | Snapshot identity, mapping, observation, and expiry | Fixture schema tests |
| Compiler | Temperature and thinking supported/unsupported states | TypeScript unit tests |
| Reachability | Dispatch reaches transport with fresh evidence | Provider transport spy |
| Negative control | Missing, stale, contradictory, unknown, wrong-preset evidence | Matrix tests plus `npm run check` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Fresh provider capability evidence | External/observed | Required | Controls remain unknown and fail closed |
| Existing merge/compiler/executor path | Internal | Available | Evidence cannot affect supported reachability |
| Phase 009 | Related | Optional | Prompt tuning remains separate from capability reachability |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Evidence is invalid, stale, non-reproducible, or causes unsupported controls to reach transport.
- **Procedure**: Remove the snapshot association, restore unknown control facts, rerun reversal tests, and confirm exact-original-before-transport.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Baseline + fresh evidence -> Snapshot and merge -> Reachability and reversal verification
```

| Stage | Depends On | Blocks |
|-------|------------|--------|
| Baseline and evidence | Provider facts and current preset | Snapshot |
| Snapshot and merge | Reviewed evidence | Verification |
| Verification | Applied snapshot | Parent decision |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Stage | Complexity | Estimated Effort |
|-------|------------|------------------|
| Baseline and evidence | Medium | 1-2 days |
| Snapshot and merge | Medium | 1 day |
| Verification and handoff | Medium | 1-2 days |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-Change Checks

- [ ] Record current unknown capability facts and exact-original outcome.
- [ ] Capture evidence source, observation, and expiry.
- [ ] Confirm missing evidence already fails closed.

### Procedure

1. Remove the capability snapshot association.
2. Restore unknown facts for affected controls.
3. Replay compiler and transport-negative tests.
4. Confirm exact-original-before-transport.

### Data Reversal

- **Has data migrations?** No.
- **Reversal procedure**: Remove the dated fixture association only.
<!-- /ANCHOR:enhanced-rollback -->
