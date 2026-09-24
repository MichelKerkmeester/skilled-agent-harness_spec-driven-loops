---
title: "Feature Specification: Phase 62: v4 parent data repairs"
description: "The v4 parent's phase map had no row for 039, a blank line that ended the table after row 38 and hid every later row from readers and tools, a stale row 018, a row 041 claiming completion its children contradict, and no rows for phases 56 to 62."
trigger_phrases:
  - "v4 parent data repairs"
  - "phase documentation map repair"
  - "v4 phase map blank line"
  - "missing phase map rows"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 62: v4 parent data repairs

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-09-24 |
| **Branch** | `worktrees/064-save-writer-continuity-fields` |
| **Parent Spec** | ../spec.md |
| **Phase** | 62 of 62 |
| **Predecessor** | 061-worktree-build-provisioning |
| **Successor** | None |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 62** of the system-spec-kit v4 specification, the last of the fix phases planned after phase 051 shipped. It repairs the parent's own data, which phase 059's tool now reports but deliberately does not rewrite.

**Scope Boundary**: the Phase Documentation Map in the v4 parent's `spec.md`, and a record of the simplification-research goal trim. No child packet's own documents change.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A dry run of the phase-map sync tool on the v4 parent reported a blank line at `spec.md:148` that ended the map after row 38, so rows 40 onward rendered as a paragraph and no tool read them; no row for 039; row 018 still marked draft although its implementation summary records completion; and no rows for the phases added since 055. Once the table was whole, the same dry run showed row 041 marked complete while three of its children are in progress or planned.

The plan also listed shortening the simplification-research packet's `goal.md` below the 4,000-character limit on a parent goal.

### Purpose
The map lists every child once, in one table, with a status its child's own data supports.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The blank line removed and row 39 added in its place.
- Row 018 set to complete; row 041 set to in progress.
- Rows 56 to 62 added.
- A record that the goal trim already landed on main.

### Out of Scope
- 041's own `spec.md`, which still says Draft; it has active and planned children and is not this phase's to edit.
- 018's own `spec.md`, which still says Draft beside a completed summary.
- The 31 `completion_pct` mismatches the tool reports, which no reader uses.
- Handoff-table rows for the new phases.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `specs/system-speckit/033-system-speckit-v4/spec.md` | Modify | Phase Documentation Map repairs |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The map is one table that lists every child. | The sync tool's dry run reports no blank-line warning and no child without a row. |
| REQ-002 | The parent still validates. | Recursive strict validation of the v4 parent passes with no new errors or warnings against its baseline. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Each corrected row matches its child's data. | Row 018 matches its completed summary; row 041 matches its children and its generated status. |
| REQ-004 | The goal item is settled. | The simplification-research goal's durable slice is under 4,000 characters. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The dry run's only remaining row change is 041, whose own `spec.md` is the stale side.
- **SC-002**: Recursive strict validation passes.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Another session edits the same map | Medium | The edit is made on the tip of main and pushed straight after validation |
| Risk | Row 041's status is a judgment between two stale sources | Low | It follows 041's children and its generated status, and the report names 041's own `spec.md` for its owner |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should 041's and 018's own `spec.md` statuses be corrected by their owners? Reported to the operator; not this phase's to change.
<!-- /ANCHOR:questions -->

---
