---
title: "Feature Specification: Phase 2: scorer-deem-arms"
description: "Twenty scorers carry a --deem arm with its own tests and docs. This phase removes each arm so every scorer's default run and --jev arm behave exactly as before."
trigger_phrases:
  - "remove scorer deem arm"
  - "scorer --deem removal"
  - "jev only scorer"
  - "deem arm tests"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 2: scorer-deem-arms

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
| **Phase** | 2 of 4 |
| **Predecessor** | 001-removal-plan |
| **Successor** | 003-cli-deem-mode-removal |
| **Handoff Criteria** | The completion criteria in `goal.md` each pass from the final state |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the Deem deprecation, phase 046 of the cli-jev workflow integration.

**Scope Boundary**: No scorer offers a Deem arm, and nothing else about any scorer changes.

**Dependencies**:
- The operator's request of 2026-10-02 to remove Deem and keep Jev.
- `../001-removal-plan/inventory.md` for every phase after 001.

**Deliverables**:
- Each scorer's `--deem` switch, arm, helpers and usage text
- Its Deem-only tests and the Deem half of mixed tests
- The scorer's own docs that describe the arm

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Twenty scorers accept `--deem`, and each arm has tests, docs and in two cases a side-by-side comparison with Jev. Left in place, they promise a backend the operator retired.

### Purpose
No scorer offers a Deem arm, and nothing else about any scorer changes.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Each scorer's `--deem` switch, arm, helpers and usage text
- Its Deem-only tests and the Deem half of mixed tests
- The scorer's own docs that describe the arm

### Out of Scope
- The default run and `--jev` arm
- Hub, routing and catalog files, which are 003 and 004
- `specs/` and released changelog entries

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| Scorer scripts the inventory assigns to 002 | Modify | Remove the Deem arm |
| Their tests | Modify, Delete | Remove Deem cases |
| Their docs | Modify | Drop the arm from usage and examples |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | No scorer keeps a Deem switch, arm or helper |
| REQ-002 | Each scorer's default stdout differs before and after only in removed Deem lines or fields |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | Every covering suite passes with 0 failing |
| REQ-004 | `--deem` exits non-zero through the unknown-flag path |
| REQ-005 | One cross-family review: P0 and P1 fixed, P2 recorded |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The 20 scorers offer only the default run and `--jev`.
- **SC-002**: No default output changes.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A removal changes default output | High | Byte diff per scorer before commit |
| Risk | 023 and 027 compare both arms in one report | Med | Luna takes them, and the report keeps its Jev fields |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

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

## 10. OPEN QUESTIONS

- None. The operator set the scope on 2026-10-02.
<!-- /ANCHOR:questions -->

---
