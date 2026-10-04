---
title: "Feature Specification: Phase 16: doctor-playbook-deep-loop"
description: "The /doctor:deep-loop scenarios sit in the system-spec-kit playbook instead of the system-deep-loop playbook, and none tests the --scope argument."
trigger_phrases:
  - "doctor playbook deep-loop"
  - "doctor deep-loop scenarios"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 16: doctor-playbook-deep-loop

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-04 |
| **Branch** | `worktrees/079-doctor-command-audit` |
| **Parent Spec** | ../spec.md |
| **Phase** | 16 of 16 |
| **Predecessor** | 015-doctor-playbook-skill-advisor |
| **Successor** | None |
| **Handoff Criteria** | Every listed scenario file exists, the root index lists it and the playbook validator passes |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 16** of the doctor audit follow-ups. It gives `/doctor:deep-loop` manual testing scenarios in the `system-deep-loop` playbook, the skill the command checks.

**Scope Boundary**: `.skilled/skills/system-deep-loop/manual-testing-playbook` only: the `doctor-commands/` category, its README and the root playbook index.

**Dependencies**:
- The command contracts: `.skilled/commands/doctor/deep-loop.md`, `.skilled/commands/doctor/assets/doctor-deep-loop.yaml`
- The scenario contract in `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/SKILL.md` and its snippet template

**Deliverables**:
- 1 new scenario files and 3 moved scenario files, each with a unique DOC- ID
- Root index rows and a category README for the doctor scenarios

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The three `/doctor:deep-loop` scenarios live in the system-spec-kit playbook, away from the skill they check, and none of them tests how `--scope` selects the research, review or council graphs.

### Purpose
An operator can test every target of `/doctor:deep-loop` by following a scenario with an exact prompt, commands, expected signals and a PASS, FAIL or SKIP verdict.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- One scenario file per row below, written to the operator-scenario contract
- Root playbook index rows and the `doctor-commands/README.md` category notes

### Out of Scope
- Running the scenarios and recording results - a run is a separate benchmark report
- Changing the doctor commands - a scenario that finds a defect records it, it does not fix it

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `doctor-commands/doctor-deep-loop-lazy-init.md` | Move from system-spec-kit | DOC-331: lazy-init availability |
| `doctor-commands/doctor-deep-loop-empty-no-source.md` | Move from system-spec-kit | DOC-332: empty-graph refusal |
| `doctor-commands/doctor-deep-loop-convergence.md` | Move from system-spec-kit | DOC-333: convergence gold battery |
| `doctor-commands/doctor-deep-loop-scope.md` | Create | DOC-368: `--scope` selects the research, review or council graphs and refuses an unknown value |
| `.skilled/skills/system-deep-loop/manual-testing-playbook/doctor-commands/README.md` | Create | Category notes and ID list |
| `.skilled/skills/system-deep-loop/manual-testing-playbook/manual-testing-playbook.md` | Modify | Index rows for the doctor scenarios |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every target of `/doctor:deep-loop` has a scenario | Each row in the files table exists and its root index row links it |
| REQ-002 | Each scenario states only behavior the command contract defines | Every expected signal traces to the command doc or its YAML asset |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | The playbook stays fail-closed clean | `validate-playbook-package.cjs --package .skilled/skills/system-deep-loop/manual-testing-playbook` exits 0 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: An operator can run any listed scenario from its file alone.
- **SC-002**: A scenario that mutates state runs in a disposable copy and names its recovery step.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A scenario invents behavior the command lacks | High | Each signal is checked against the command doc before the phase closes |
| Dependency | Delegated authoring | Med | Every delegated file is validated and reviewed before it is committed |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---

