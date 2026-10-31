---
title: "Feature Specification: Phase 17: doctor-playbook-git"
description: "The sk-git playbook has no scenario for /doctor:git, so saving a hook gate setting or changing a commit, PR or branch rule in .sk-git/ has no manual test."
trigger_phrases:
  - "doctor playbook git"
  - "doctor git hooks standards scenarios"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 17: doctor-playbook-git

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
| **Phase** | 17 of 17 |
| **Predecessor** | 016-doctor-playbook-deep-loop |
| **Successor** | None |
| **Handoff Criteria** | Every listed scenario file exists, the root index lists it and the playbook validator passes |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 17** of the doctor audit follow-ups. It gives `/doctor:git` manual testing scenarios in the `sk-git` playbook, the skill the command checks.

**Scope Boundary**: `.skilled/skills/sk-git/manual-testing-playbook` only: the `doctor-commands/` category, its README and the root playbook index.

**Dependencies**:
- The command contracts: `.skilled/commands/doctor/git.md`, `.skilled/commands/doctor/assets/doctor-git-hooks.yaml`, `.skilled/commands/doctor/assets/doctor-git-standards.yaml`
- The scenario contract in `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/SKILL.md` and its snippet template

**Deliverables**:
- 6 new scenario files, each with a unique DOC- ID
- Root index rows and a category README for the doctor scenarios

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`/doctor:git hooks` and `/doctor:git standards` change git config and the repository's `.sk-git/` templates, but the sk-git playbook has no scenario for either, nor for the menu shown when no target is given.

### Purpose
An operator can test every target of `/doctor:git` by following a scenario with an exact prompt, commands, expected signals and a PASS, FAIL or SKIP verdict.
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
| `doctor-commands/doctor-git-hooks-list.md` | Create | DOC-369: `hooks` lists each gate with its local, global and effective value and the install state |
| `doctor-commands/doctor-git-hooks-switch-gate.md` | Create | DOC-370: `hooks` changes one gate only after showing the exact git config command and getting a yes |
| `doctor-commands/doctor-git-standards-copy-once.md` | Create | DOC-371: `standards` copies the shipped templates into `.sk-git/` once and never overwrites them |
| `doctor-commands/doctor-git-standards-change-rule.md` | Create | DOC-372: `standards` changes or removes one rule and points out prose that still describes the old rule |
| `doctor-commands/doctor-git-standards-refuse-invalid.md` | Create | DOC-373: `standards` refuses a change the hooks would reject |
| `doctor-commands/doctor-git-target-menu.md` | Create | DOC-374: a missing target shows the menu and waits, and `--dry-run` writes nothing |
| `.skilled/skills/sk-git/manual-testing-playbook/doctor-commands/README.md` | Create | Category notes and ID list |
| `.skilled/skills/sk-git/manual-testing-playbook/manual-testing-playbook.md` | Modify | Index rows for the doctor scenarios |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every target of `/doctor:git` has a scenario | Each row in the files table exists and its root index row links it |
| REQ-002 | Each scenario states only behavior the command contract defines | Every expected signal traces to the command doc or its YAML asset |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | The playbook stays fail-closed clean | `validate-playbook-package.cjs --package .skilled/skills/sk-git/manual-testing-playbook` exits 0 |
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

