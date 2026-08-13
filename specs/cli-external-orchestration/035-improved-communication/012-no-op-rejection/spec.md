---
title: "Feature Specification: Phase 012 No-Op Rejection"
description: "Stop rewarding the unchanged echo: treat a verbatim or near-verbatim candidate as no improvement and fall back to deterministic formatting instead of accepting it as a projection."
trigger_phrases:
  - "no-op-rejection"
  - "no op rejection"
  - "unchanged echo acceptance"
  - "projection quality"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/035-improved-communication/012-no-op-rejection"
    last_updated_at: "2026-08-13T00:00:00.000Z"
    last_updated_by: "claude"
    recent_action: "Authored the phase spec from deep-research priority D."
    next_safe_action: "Plan the no-improvement outcome and its minimal edit-distance threshold."
    blockers: []
    key_files:
      - "spec.md"
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
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Feature Specification: Phase 012 No-Op Rejection

<!-- SPECKIT_LEVEL: 2 -->

---

## EXECUTIVE SUMMARY

The validator only runs its Markdown-structure and semantic-veto stages when the restored candidate differs from the source; a verbatim echo skips every check and is accepted. So a barely-changed rewrite is rewarded, not detected — exactly the near-echo the smoke produced on already-clean lines. This phase makes a verbatim or near-verbatim candidate an explicit no-improvement outcome that falls back to deterministic formatting or exact-original, so a projection is never silently identical to the original.

**Key decision:** this is a product-policy outcome, not a change to the fidelity boundary.

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
| **Phase** | 12 of 13 |
| **Predecessor** | `011-meaning-judge-wiring` |
| **Successor** | `013-capability-evidence-unblock` |
| **Handoff Criteria** | Unchanged and threshold-defined near-echo candidates produce an explicit no-improvement reason and deterministic or exact-original fallback without changing fidelity or privacy behavior. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This planned phase makes unchanged and near-unchanged provider output an explicit product-policy outcome.

**Scope boundary**: Change only the acceptance policy after restoration; do not change fidelity, restoration, privacy, or meaning-judge responsibilities.

**Dependencies**:

- Existing restored-candidate comparison and render fallback
- Phase 011 is complementary but independent

**Deliverables**:

- Explicit no-improvement outcome
- Configured minimal edit-distance threshold
- Deterministic formatting or exact-original fallback with a reason code
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

- The validator short-circuits when `restored.text === sourceText`, accepting the echo without running structure or semantic stages. [SOURCE: packages/cli-communication-projection/src/fidelity/validator.ts:183-222]
- Confirmed empirically: a near-echo dependency-install line passed as a projection with only a capitalization change.

### Purpose

Prevent unchanged or threshold-defined near-echo candidates from being presented as successful projections.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Treat `restored.text === sourceText` (and candidates below a minimal edit-distance threshold) as a distinct "no improvement" outcome.
- Route that outcome to deterministic formatting or exact-original instead of presenting it as a projection.
- Keep the outcome explicit and observable (a reason code), not a silent acceptance.

### Out of Scope

- Any change to fidelity/restoration checks or the privacy boundary.
- Scoring prose quality (that is the meaning judge's separate concern).

### Technical Approach

Replace the `restored.text === sourceText` short-circuit acceptance with a no-improvement branch; add a configurable minimal edit-distance check; route to deterministic/exact-original with a reason code.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `packages/cli-communication-projection/src/fidelity/validator.ts` | Modify | Replace unchanged-candidate acceptance with explicit no-improvement classification |
| `packages/cli-communication-projection/src/render/` | Modify if required | Route no-improvement to deterministic formatting or exact-original |
| `packages/cli-communication-projection/src/contracts/` | Modify if required | Add the typed reason code and threshold configuration |
| `packages/cli-communication-projection/test/` | Modify | Cover unchanged, near-echo, boundary, terse, and fallback cases |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Reject unchanged candidates as no improvement. | `restored.text === sourceText` yields no-improvement, not accepted projection. |
| REQ-002 | Reject threshold-defined near echoes. | Candidates below the configured minimal edit-distance threshold yield no-improvement. |
| REQ-003 | Use a safe fallback. | No-improvement selects deterministic formatting or exact-original, never the candidate as a projection. |
| REQ-004 | Make the outcome explicit. | A distinct typed reason code is emitted and testable. |
| REQ-005 | Preserve existing boundaries. | Fidelity, restoration, privacy, and meaning-judge behavior remain unchanged. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Verbatim candidates are not presented as projections.
- **SC-002**: Near echoes below the approved threshold select a safe fallback.
- **SC-003**: The no-improvement reason is typed, observable, and content-free.

### Acceptance Scenarios

1. **Given** a restored candidate identical to source text, **When** validation runs, **Then** it returns no-improvement rather than accepted projection.
2. **Given** a candidate below the configured edit-distance threshold, **When** validation runs, **Then** it selects deterministic formatting or exact-original.
3. **Given** a legitimately terse rewrite above the approved boundary, **When** validation runs, **Then** no-improvement policy alone does not reject it.
4. **Given** any no-improvement outcome, **When** evidence is emitted, **Then** the distinct reason code contains no source or candidate content.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Approved minimal edit-distance threshold | High | Calibrate against verbatim, capitalization-only, terse-valid, and substantive fixtures. |
| Risk | Threshold rejects legitimately terse rewrites | High | Seed boundary cases and keep the threshold configurable. |
| Risk | No-improvement becomes a fidelity rule | Medium | Keep classification in product policy after restoration. |
| Related phase | Phase 011 meaning judge | Low | Keep no-change and meaning-loss responsibilities separate. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance

- **NFR-P01**: Edit-distance classification must remain bounded by the existing message-size limits.

### Security and Privacy

- **NFR-S01**: The no-improvement reason code and telemetry must contain no source or candidate text.

### Reliability

- **NFR-R01**: The same normalized source/candidate pair and threshold must produce the same classification.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty, whitespace-only, and punctuation-only candidates.
- Capitalization-only and formatting-only changes.
- Very short source messages where one character is a large relative change.
- Protected markers that dominate the candidate while prose changes minimally.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 16/25 | Validator policy, typed reason, render fallback, and tests |
| Risk | 18/25 | Threshold false positives and product semantics |
| Research | 11/20 | Boundary calibration needs fixture evidence |
| **Total** | **45/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

What minimal edit-distance threshold separates a real projection from a near-echo without rejecting legitimately-terse-but-clear rewrites?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: `plan.md`
- **Task Breakdown**: `tasks.md`
- **Verification Checklist**: `checklist.md`
- **Parent Packet**: `../spec.md`
