---
title: "Feature Specification: Phase 1: removal-plan"
description: "Deem reaches about 209 live files, mixed with the English word deem. This phase names each real reference with the phase that removes it and records the removal decisions before anything changes."
trigger_phrases:
  - "deem removal inventory"
  - "deem reference owner"
  - "removal decision record"
  - "one-mode hub rule"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 1: removal-plan

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-02 |
| **Branch** | `worktrees/071-cli-jev-sk-alignment` |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 4 |
| **Predecessor** | None |
| **Successor** | 002-scorer-deem-arms |
| **Handoff Criteria** | The completion criteria in `goal.md` each pass from the final state |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the Deem deprecation, phase 046 of the cli-jev workflow integration.

**Scope Boundary**: One inventory and four decisions that phases 002 to 004 work from.

**Dependencies**:
- The operator's request of 2026-10-02 to remove Deem and keep Jev.
- `../001-removal-plan/inventory.md` for every phase after 001.

**Deliverables**:
- An inventory row per matching file, with owner and action
- The suites that cover those files, with baselines
- ADR-001 to ADR-004 in `decision-record.md`
- The rules that bound a hub's mode count, with `file:line`

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Deem reaches about 209 files outside `specs/`, and many matches are the English word (`deems`, `deemed`). Removing by search alone would either miss real references or edit prose that has nothing to do with the backend. Phases 002 to 004 need one list that says who removes what.

### Purpose
One inventory and four decisions that phases 002 to 004 work from.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- An inventory row per matching file, with owner and action
- The suites that cover those files, with baselines
- ADR-001 to ADR-004 in `decision-record.md`
- The rules that bound a hub's mode count, with `file:line`

### Out of Scope
- Any edit outside this folder
- `specs/` history and released changelog entries

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `inventory.md` | Create | Every real reference, its owner and action |
| `decision-record.md` | Create | ADR-001 to ADR-004 |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Every file the inventory command prints has one row with an owner and an action |
| REQ-002 | ADR-001 to ADR-004 are recorded and Accepted |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | The mode-count rules are cited with `file:line`, and the hub check exits 0 on the unchanged hub |
| REQ-004 | Each covering suite is named with its baseline |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Phases 002 to 004 can each list their files from `inventory.md` alone.
- **SC-002**: No reference outside history is left without an owner.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A real reference is marked as the English word | Med | The session rereads every keep row |
| Risk | A hub rule needs two modes | Med | REQ-003 finds it before 003 starts |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Security
- **NFR-S01**: No file holds, reads or prints a credential, and no worker opens a `.env` file.

### Reliability
- **NFR-R01**: Each change is a path-scoped commit that `git revert` undoes on its own.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A match on the English word `deem` is kept, and the inventory marks it keep.

### Error Scenarios
- A suite that fails after an edit blocks that edit's commit until it passes or the edit is reverted.

### State Transitions
- Not applicable. No runtime state changes.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | Bounded by the inventory |
| Risk | 6/25 | Removal behind suites and byte diffs |
| Research | 4/20 | 001 maps the references |
| **Total** | **20/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. The operator set the scope on 2026-10-02.
<!-- /ANCHOR:questions -->

---
