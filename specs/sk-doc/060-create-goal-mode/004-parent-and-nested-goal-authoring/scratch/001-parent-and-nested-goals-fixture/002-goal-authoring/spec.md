---
title: "Feature Specification: Phase 2: goal-authoring"
description: "Authors three child goals from their own specifications and acceptance criteria, with no child binding sections."
trigger_phrases:
  - "phase goal authoring"
  - "nested child goals"
  - "fixture goal criteria"
importance_tier: "important"
contextType: "specification"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 2: goal-authoring

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-09-25 |
| **Branch** | `fixture` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 2 of 3 |
| **Predecessor** | 001-source-audit |
| **Successor** | 003-binding-check |
| **Handoff Criteria** | All three child goals use their own sources and contain three to five phase-local criteria. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the parent and nested goal fixture.

**Scope Boundary**: Author one goal in each child folder from that child's own specification and acceptance criteria. Keep parent binding out of child goals.

**Dependencies**:
- Phase 1 confirms the phase map and child source files are present.
- The system-spec-kit goal template and sk-create-goal authoring standards define the goal shape.

**Deliverables**:
- Three child goals with one objective sentence, decisions and three to five criteria.
- No binding section in any child goal.

**Changelog**:
- This fixture has no packet-local changelog. The proof remains in its spec and acceptance criteria.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

A child goal can drift from its phase if it copies a parent summary or another phase's criteria. A binding table in a child would also give parent-level authority to the wrong file.

### Purpose
Author three short child goals from their own phase sources and keep parent binding in the parent goal only.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Derive each child objective, decisions and completion criteria from its own `spec.md` and `acceptance-criteria.md`.
- Use three to five checkable criteria per child goal.
- Keep the binding section out of every child goal.

### Out of Scope
- Editing the parent goal. Phase 3 owns the parent binding check.
- Changing the shared goal template, runtime goal state or files outside this fixture.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `spec.md` | Modify | Record phase-local goal requirements and boundaries. |
| `plan.md` | Modify | Describe the source-derived authoring method. |
| `tasks.md` | Modify | Record completed child-goal tasks and checks. |
| `acceptance-criteria.md` | Modify | Close child goal outcomes with line citations. |
| `goal.md` | Modify | State the goal-authoring objective and local criteria. |
| `implementation-summary.md` | Modify | Summarize the three authored child goals. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Author each child goal from that child's own specification and acceptance criteria. |
| REQ-002 | Give each child goal one purpose sentence, frozen decisions and three to five self-contained completion criteria. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | Keep the binding section only in the phase-parent goal. |
| REQ-004 | Cite each closed acceptance criterion with a backticked path and one line number. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Each child goal has one purpose-led objective sentence and a decisions table.
- **SC-002**: Each child goal has three to five phase-local completion criteria.
- **SC-003**: No child goal contains a binding section.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Child specifications and criteria | Missing sources make a goal speculative | Stop and identify the missing source. |
| Risk | Reusing criteria across phases | Goals stop describing their own phase | Compare each goal with its own source pair. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: No runtime performance target applies to this documentation-only phase.

### Security
- **NFR-S01**: Do not change executable behavior or session goal state.

### Reliability
- **NFR-R01**: Keep each goal's criteria checkable and phase-local.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty acceptance criteria: stop before authoring a goal.
- Fewer than three or more than five phase criteria: revise the goal before closing.
- A criterion depends on a different phase: keep it out of this goal.

### Error Scenarios
- Source documents disagree: report the conflict instead of choosing silently.
- A rendered child goal contains a binding section: remove it while preserving the template structure.

### State Transitions
- Partial authoring: keep the packet open until all three goals are present.
- Resumed authoring: reread the affected child's own source pair before revising its goal.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 5/25 | Three child goals use six phase-local sources. |
| Risk | 4/25 | A misplaced binding or copied criterion blurs phase authority. |
| Research | 3/20 | Each source pair must be read before authoring. |
| **Total** | **12/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None. The three child source pairs define the phase-local goal work.
<!-- /ANCHOR:questions -->

---
