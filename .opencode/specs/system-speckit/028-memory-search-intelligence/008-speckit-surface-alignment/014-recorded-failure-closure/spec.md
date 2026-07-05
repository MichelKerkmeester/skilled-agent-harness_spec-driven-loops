---
title: "Feature Specification: Recorded-Failure Closure"
description: "Close the recorded-but-unactioned detector class through cap reconciliation, a constitutional routing rule, and a surfacer with RED/GREEN coverage."
trigger_phrases:
  - "recorded failure closure"
  - "detector fired nobody acted"
  - "unactioned recorded failure"
  - "deep research cap reconciliation"
importance_tier: "normal"
contextType: "implementation"
parent: "../spec.md"
predecessor: "013-deep-research-loop-instrumentation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/008-speckit-surface-alignment/014-recorded-failure-closure"
    last_updated_at: "2026-07-05T00:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Ship recorded-failure closure route"
    next_safe_action: "Run strict validation for the closure phase"
    blockers: []
    key_files:
      - ".opencode/specs/system-speckit/028-memory-search-intelligence/008-speckit-surface-alignment/014-recorded-failure-closure/spec.md"
      - ".opencode/specs/system-speckit/028-memory-search-intelligence/008-speckit-surface-alignment/014-recorded-failure-closure/implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "recorded-failure-closure"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: Recorded-Failure Closure

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
| **Predecessor** | 013-deep-research-loop-instrumentation |
| **Successor** | None |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Several audit findings were about detectors that fired and were recorded, but nobody acted. Governance scenario 063 recorded feature-flag-catalog drift, and deep-research iteration 017 recorded an iteration-cap contradiction for follow-up without closure.

### Purpose

Close the recorded-but-unactioned detector class by documenting the shipped cap reconciliation, constitutional routing rule, surfacer, and RED/GREEN test evidence.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Record the distinction between missing detection and unactioned recorded failure.
- Document the cap reconciliation exemplar.
- Document the shipped constitutional rule, surfacer, and tests.

### Out of Scope

- Editing the constitutional rule, surfacer, tests, or review report in this remediation pass.
- Claiming perfect detection coverage for all possible recorded failures.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `spec.md` | Modify | Bring shipped closure facts under the Level-2 spec contract. |
| `plan.md` | Existing | Plan and delivered notes for recorded-failure closure. |
| `tasks.md` | Existing | Task ledger for cap reconciliation and closure route. |
| `checklist.md` | Existing | Verification checklist for the closure route. |
| `implementation-summary.md` | Existing | Evidence summary for rule, surfacer, and tests. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The recorded-failure class is documented. | `spec.md` distinguishes recorded-but-unactioned failures from missing detectors. |
| REQ-002 | The exemplar cap reconciliation is documented. | `implementation-summary.md:40` cites the reconciled strategy cap lines. |
| REQ-003 | The closure route is documented. | `implementation-summary.md:41-46` cites the constitutional rule, surfacer, and tests. |
| REQ-004 | Checklist evidence records the shipped RED/GREEN coverage. | `checklist.md:54-59` cites unrouted, routed, contradiction-routed, and clean-test evidence. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | The phase validates under the strict system-spec-kit gate. | Parent recursive strict validation returns `RESULT: PASSED`. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The docs do not confuse detector absence with unactioned detector output.
- **SC-002**: The shipped closure route has checklist evidence.
- **SC-003**: Recursive strict validation passes for the parent packet.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Overstating surfacer coverage | Could imply complete semantic detection | The docs state the route exists, not perfect coverage. |
| Dependency | Existing shipped rule and tests | Needed for accurate evidence | `implementation-summary.md` records file-line evidence and test coverage. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Evidence Quality

- **NFR-E01**: Shipped claims must cite the rule, surfacer, and tests.
- **NFR-E02**: Limitations must remain visible.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- **Recorded marker with nearby remediation route**: Should clear.
- **Recorded marker without nearby remediation route**: Should flag.
- **Clean text**: Should not flag.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->
