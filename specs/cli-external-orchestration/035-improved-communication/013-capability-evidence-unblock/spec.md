---
title: "Feature Specification: Phase 013 Capability-Evidence Unblock"
description: "Supply fresh confirmed capability evidence so provider control knobs (temperature, thinking, tier) are reachable through the shipped path instead of failing closed to exact-original before transport."
trigger_phrases:
  - "capability-evidence-unblock"
  - "capability evidence unblock"
  - "control knobs fail-closed"
  - "projection quality"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/035-improved-communication/013-capability-evidence-unblock"
    last_updated_at: "2026-08-13T00:00:00.000Z"
    last_updated_by: "claude"
    recent_action: "Authored the phase spec from deep-research priority E."
    next_safe_action: "Plan the capability-evidence capture and its recording against the evaluation strata."
    blockers: []
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-013-scaffold-20260813"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Phase purpose, boundary, dependencies, and acceptance are defined."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Feature Specification: Phase 013 Capability-Evidence Unblock

<!-- SPECKIT_LEVEL: 2 -->

---

## EXECUTIVE SUMMARY

The shipped DeepSeek preset marks temperature-control and thinking-control `unknown`, so `compilePromptControls` returns unsupported and the reference-like profile returns exact-original before the model is ever called. Temperature, thinking, and tier tuning are therefore unreachable through the shipped path. This phase captures and records a fresh, dated capability-evidence profile so the controls compile as supported, while keeping the fail-closed behavior on any unknown or stale fact.

**Key decision:** unblock by supplying evidence, never by assuming a control is active when the compiler says unknown.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Planned |
| **Created** | 2026-08-13 |
| **Branch** | Current worktree |
| **Parent Spec** | `../spec.md` |
| **Phase** | 13 of 13 |
| **Predecessor** | `012-no-op-rejection` |
| **Successor** | Parent packet decision |
| **Handoff Criteria** | Fresh dated evidence makes temperature and thinking controls compile as supported and reach transport, while missing, contradictory, or stale evidence still fails closed before transport. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This planned phase makes provider control settings reachable through recorded evidence rather than assumptions.

**Scope boundary**: Supply and test a dated capability snapshot through the existing merge and control compiler; do not weaken fail-closed logic or choose a model tier.

**Dependencies**:

- Current provider documentation or observed capability evidence
- Existing `mergeCapabilitySnapshot` and `compilePromptControls` paths
- Phase 009 is complementary for prompt quality but not required

**Deliverables**:

- Dated capability-evidence profile
- Evaluation-strata record
- Supported-path reachability and stale/missing reversal tests
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

- `compilePromptControls` fails closed unless capability, mapping, freshness, and control evidence are confirmed. [SOURCE: packages/cli-communication-projection/src/providers/controls.ts:29-116]
- The DeepSeek preset marks the relevant control facts unknown, so the profile returns exact-original before transport. [SOURCE: packages/cli-communication-projection/src/providers/presets.ts:171-179] [SOURCE: packages/cli-communication-projection/src/providers/executor.ts:150-185]
- The live smoke's capability-evidence profile is not checked into the package, so the smoke is not reproducible.

### Purpose

Make supported provider controls reproducibly reachable with fresh evidence while preserving exact-original-before-transport for unknown, missing, contradictory, or stale facts.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Capture a fresh, dated capability-evidence profile for the chosen preset(s) that confirms temperature/thinking control mappings.
- Record the evidence profile alongside the evaluation strata so a dispatch reaches transport rather than exact-original-before-call.
- Preserve fail-closed behavior on any unknown, missing, contradictory, or stale fact.

### Out of Scope

- Assuming any control is active without confirmed evidence.
- Weakening the fail-closed control gate.
- Choosing a model tier (that is the separate paired experiment).

### Technical Approach

Author a dated capability snapshot for the preset, applied through the existing `mergeCapabilitySnapshot`/controls path; record it with the strata; verify reachability and the fail-closed reversal.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `packages/cli-communication-projection/src/providers/presets.ts` | Modify if required | Reference the recorded evidence without replacing unknown facts by assumption |
| `packages/cli-communication-projection/src/providers/controls.ts` | Verify/Modify if required | Consume the snapshot through the existing fail-closed compiler |
| `packages/cli-communication-projection/test/fixtures/` | Create/Modify | Store the dated capability snapshot and evaluation strata |
| `packages/cli-communication-projection/test/` | Modify | Cover supported reachability and missing/stale/contradictory reversal |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Confirm temperature-control evidence. | The chosen preset compiles temperature controls as supported only with the recorded fresh mapping evidence. |
| REQ-002 | Confirm thinking-control evidence. | The chosen preset compiles thinking controls as supported only with the recorded fresh mapping evidence. |
| REQ-003 | Reach provider transport. | With fresh evidence present, dispatch no longer returns exact-original before the model call. |
| REQ-004 | Preserve fail-closed reversal. | Missing, stale, contradictory, or unknown evidence returns exact-original before transport. |
| REQ-005 | Date and record the evidence. | The snapshot carries observation and expiry dates and is stored with the evaluation strata. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Fresh evidence makes temperature and thinking controls compile as supported for the chosen preset.
- **SC-002**: A dispatch with that evidence reaches transport.
- **SC-003**: Removing, staling, contradicting, or making evidence unknown restores exact-original-before-transport.

### Acceptance Scenarios

1. **Given** a fresh dated snapshot confirming temperature mapping, **When** controls compile, **Then** temperature is supported for the chosen preset.
2. **Given** a fresh dated snapshot confirming thinking mapping, **When** controls compile, **Then** thinking is supported for the chosen preset.
3. **Given** the full fresh snapshot, **When** a dispatch runs, **Then** it reaches provider transport instead of returning exact-original before the call.
4. **Given** missing, stale, contradictory, or unknown evidence, **When** the same dispatch runs, **Then** it fails closed to exact-original before transport.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Fresh provider capability evidence | High | Record observation, source, mapping, and expiry; block when stale. |
| Risk | Evidence claims a control the provider ignores | High | Require reproducible transport observation beside documentation. |
| Risk | Snapshot silently outlives the provider contract | High | Enforce expiry and reversal tests. |
| Related phase | Phase 009 prompt token contract | Medium | Evaluate combined tuning only after each phase passes independently. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance

- **NFR-P01**: Capability merge and control compilation must remain deterministic and local.

### Security and Privacy

- **NFR-S01**: The evidence fixture must contain capability facts only, never credentials or message content.

### Reliability

- **NFR-R01**: Expired, contradictory, missing, or unknown facts must always select exact-original-before-transport.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Temperature is confirmed while thinking remains unknown.
- Observation is current but expiry is missing or in the past.
- Documentation and live observation contradict each other.
- A snapshot targets a different provider, model, or preset version.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 16/25 | Evidence fixture, merge/compiler reachability, and tests |
| Risk | 20/25 | Fail-closed provider controls and external fact freshness |
| Research | 14/20 | Capability facts require fresh source or observed evidence |
| **Total** | **50/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

No unresolved question blocks planning. Model-tier selection remains outside this phase.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: `plan.md`
- **Task Breakdown**: `tasks.md`
- **Verification Checklist**: `checklist.md`
- **Parent Packet**: `../spec.md`
