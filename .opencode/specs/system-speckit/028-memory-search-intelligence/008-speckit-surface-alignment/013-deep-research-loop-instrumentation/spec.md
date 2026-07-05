---
title: "Feature Specification: Deep-Research Loop Instrumentation"
description: "Ship the inert newInfoRatio warning and evidence-label cleanup path for the deep-research loop instrumentation finding."
trigger_phrases:
  - "deep research loop instrumentation"
  - "newInfoRatio inert"
  - "novelty signal inert"
  - "deep research evidence labels"
importance_tier: "normal"
contextType: "implementation"
parent: "../spec.md"
predecessor: "012-stress-and-skillmd-audit"
successor: "014-recorded-failure-closure"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/008-speckit-surface-alignment/013-deep-research-loop-instrumentation"
    last_updated_at: "2026-07-05T00:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Ship inert novelty detector instrumentation"
    next_safe_action: "Run strict validation for the instrumentation phase"
    blockers: []
    key_files:
      - ".opencode/specs/system-speckit/028-memory-search-intelligence/008-speckit-surface-alignment/013-deep-research-loop-instrumentation/spec.md"
      - ".opencode/specs/system-speckit/028-memory-search-intelligence/008-speckit-surface-alignment/013-deep-research-loop-instrumentation/implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "deep-research-loop-instrumentation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: Deep-Research Loop Instrumentation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-05 |
| **Branch** | Current worktree, no commit requested |
| **Parent Spec** | ../spec.md |
| **Predecessor** | 012-stress-and-skillmd-audit |
| **Successor** | 014-recorded-failure-closure |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Across all 20 iterations of the surface-alignment deep-research run, the emitted `newInfoRatio` was exactly `1.0` in every state record, including iterations that repeated earlier findings. The convergence and novelty signal never engaged, yet the synthesis cited full novelty as evidence the loop was still productive.

### Purpose

Ship an unambiguous reducer-side warning for the inert novelty signal so operators cannot treat a flat-high self-assessment as convergence evidence.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Document the inert `newInfoRatio` failure mode from the Fable review.
- Record the shipped `novelty_signal_inert` warning behavior.
- Preserve the optional stronger deterministic source-novelty recompute as a follow-up.

### Out of Scope

- Editing reducer code or tests in this remediation pass.
- Claiming the optional deterministic recompute shipped.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `spec.md` | Modify | Bring shipped instrumentation facts under the Level-2 spec contract. |
| `plan.md` | Existing | Plan and delivered notes for the shipped reducer warning. |
| `tasks.md` | Existing | Task ledger for the shipped instrumentation. |
| `checklist.md` | Existing | Verification checklist for the shipped behavior. |
| `implementation-summary.md` | Existing | Evidence summary for reducer behavior and tests. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The inert novelty failure mode is documented. | `spec.md` records the flat-high `newInfoRatio` problem and why it made convergence claims untrustworthy. |
| REQ-002 | The shipped warning behavior is documented. | `implementation-summary.md:40-46` records `novelty_signal_inert`, warning severity, and focused tests. |
| REQ-003 | The optional stronger recompute remains separate. | `implementation-summary.md:98-100` records the deterministic recompute as a follow-up, not shipped scope. |
| REQ-004 | Checklist evidence records the shipped RED/GREEN coverage. | `checklist.md:54-59` cites flat-high, flat-low, varied, and reducer-suite evidence. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | The phase validates under the strict system-spec-kit gate. | Parent recursive strict validation returns `RESULT: PASSED`. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The shipped warning is distinguishable from the optional deterministic recompute.
- **SC-002**: Checklist evidence cites the reducer behavior and RED/GREEN tests.
- **SC-003**: Recursive strict validation passes for the parent packet.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Overstating the shipped scope | Could imply deterministic recompute exists | The follow-up is labeled optional and not shipped. |
| Dependency | Existing reducer evidence | Needed for accurate documentation | `implementation-summary.md` records file-line evidence and test evidence. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Evidence Quality

- **NFR-E01**: Shipped claims must cite reducer and test evidence.
- **NFR-E02**: Optional follow-up claims must not be presented as complete.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- **Flat-low ratio**: Remains a plain advisory because it can represent legitimate stuck detection.
- **Varied ratio**: Emits no flatline event.
- **Flat-high ratio**: Emits `novelty_signal_inert` with warning severity.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->
