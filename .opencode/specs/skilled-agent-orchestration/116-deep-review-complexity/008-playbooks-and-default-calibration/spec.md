---
title: "Feature Specification: 116/008 — Playbooks and Default Calibration"
description: "Add seeded manual playbooks and revisit deep-review defaults only after search-depth gates prove useful."
trigger_phrases:
  - "deep-review playbooks"
  - "review default calibration"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/116-deep-review-complexity/008-playbooks-and-default-calibration"
    last_updated_at: "2026-05-22T00:00:00Z"
    last_updated_by: "gpt-5.5"
    recent_action: "Scaffolded phase 008 planning packet."
    next_safe_action: "Create manual playbooks and evaluate defaults after phases 002-007."
    blockers: []
    key_files:
      - ".opencode/skills/deep-review/manual_testing_playbook/"
      - ".opencode/skills/deep-review/assets/deep_review_config.json"
    session_dedup:
      fingerprint: "sha256:1160080000000000000000000000000000000000000000000000000000000000"
      session_id: "116-008-playbooks-default-calibration"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Feature Specification: 116/008 — Playbooks and Default Calibration

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2/P1 rollout |
| **Status** | Planned |
| **Created** | 2026-05-22 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 8 of 8 |
| **Predecessor** | `../007-ledger-led-graph-vocabulary/spec.md` |
| **Successor** | None |
| **Handoff Criteria** | Manual seeded scenarios exist and defaults are changed only with measured search-depth benefit. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This phase turns the hardened workflow into operator-facing playbooks and revisits iteration/convergence defaults after behavior is measurable.

**Scope Boundary**: Manual playbooks, README/reference updates, and calibrated defaults if evidence supports them.

**Dependencies**:
- Phases 002-007.

**Deliverables**:
- Seeded manual playbook scenarios.
- Documentation for valid rich records and invalid shallow records.
- Optional default changes backed by test evidence.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
More iterations alone do not guarantee deeper review. Operators need scenarios that prove the search-depth gates catch shallow reviews before defaults are tuned.

### Purpose
Document and test seeded review-depth scenarios, then adjust defaults only if the hardened workflow shows measurable improvement.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Manual playbook scenarios for seeded bug classes.
- README/reference updates explaining v2 review-depth behavior.
- Optional defaults calibration after gates are proven.

### Out of Scope
- Making iteration-count changes the primary fix.
- Weakening validator or convergence gates for convenience.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/deep-review/manual_testing_playbook/` | Create/Modify | Seeded manual scenarios. |
| `.opencode/skills/deep-review/README.md` | Modify | Operator guidance. |
| `.opencode/skills/deep-review/references/quick_reference.md` | Modify | Quick reference updates. |
| `.opencode/skills/deep-review/assets/deep_review_config.json` | Modify if justified | Defaults calibration. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Add seeded manual scenarios. | Scenarios pass only when candidates are emitted, linked, ruled out, or blocked. |
| REQ-002 | Document v2 behavior. | Operator docs explain searchCoverage verdicts and ledger evidence. |
| REQ-003 | Calibrate defaults only after evidence. | Any defaults change cites before/after search-depth behavior. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- Manual playbooks include seeded bug targets.
- Invalid shallow records fail and valid rich records pass.
- Defaults remain unchanged unless tests justify adjustment.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Mitigation |
|------|------|------------|
| Risk | Defaults are changed without proving depth. | Treat defaults as supporting, not primary. |
| Dependency | Prior phases. | Start after validation, persistence, convergence, and graph behavior are stable. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

(none)
<!-- /ANCHOR:questions -->
