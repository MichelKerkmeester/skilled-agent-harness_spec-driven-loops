---
title: "Feature Specification: Phase 14: doctor-playbook-spec-kit"
description: "The system-spec-kit playbook has no scenario for /doctor:speckit, /doctor:runtime-mirrors, /doctor:env or /doctor:update, and still holds the deep-loop and skill-advisor doctor scenarios that now belong to other skills."
trigger_phrases:
  - "doctor playbook spec-kit"
  - "doctor speckit scenarios"
  - "doctor update manual test"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 14: doctor-playbook-spec-kit

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
| **Phase** | 14 of 14 |
| **Predecessor** | 013-doctor-docs-and-ci-fix |
| **Successor** | None |
| **Handoff Criteria** | Every listed scenario file exists, the root index lists it and the playbook validator passes |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 14** of the doctor audit follow-ups. It gives `/doctor:speckit`, `/doctor:runtime-mirrors`, `/doctor:env`, `/doctor:update` manual testing scenarios in the `system-spec-kit` playbook, the skill the command checks.

**Scope Boundary**: `.skilled/skills/system-spec-kit/manual-testing-playbook` only: the `doctor-commands/` category, its README and the root playbook index, plus the feature-catalog category overview that links the moved scenarios.

**Dependencies**:
- The command contracts: `.skilled/commands/doctor/speckit.md`, `.skilled/commands/doctor/runtime-mirrors.md`, `.skilled/commands/doctor/env.md`, `.skilled/commands/doctor/update.md`, `.skilled/commands/doctor/assets/`
- The scenario contract in `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/SKILL.md` and its snippet template

**Deliverables**:
- 13 new scenario files, each with a unique DOC- ID
- Root index rows and a category README for the doctor scenarios

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The system-spec-kit playbook's doctor category tests only `/doctor:deep-loop` and `/doctor:skill-advisor rebuild`, which other skills now own. None of the four commands this skill owns has a scenario, so a change to retrieval, mirror, environment or update behavior has no manual test.

### Purpose
An operator can test every target of `/doctor:speckit`, `/doctor:runtime-mirrors`, `/doctor:env`, `/doctor:update` by following a scenario with an exact prompt, commands, expected signals and a PASS, FAIL or SKIP verdict.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- One scenario file per row below, written to the operator-scenario contract
- Root playbook index rows and the `doctor-commands/README.md` category notes
- Remove the four deep-loop and skill-advisor scenarios once phases 015 and 016 hold them

### Out of Scope
- Running the scenarios and recording results - a run is a separate benchmark report
- Changing the doctor commands - a scenario that finds a defect records it, it does not fix it

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `doctor-commands/doctor-speckit-retrieval-healthy.md` | Create | DOC-349: `/doctor:speckit` on a fresh index reports the index, lookup and recipes healthy and writes nothing |
| `doctor-commands/doctor-speckit-stale-index.md` | Create | DOC-350: `/doctor:speckit` on a stale index names the regeneration command |
| `doctor-commands/doctor-speckit-legacy-target.md` | Create | DOC-351: an old target such as `/doctor:speckit deep-loop` names the command that owns it now |
| `doctor-commands/doctor-runtime-mirrors-in-sync.md` | Create | DOC-352: `/doctor:runtime-mirrors` reports every mirror in sync and writes nothing |
| `doctor-commands/doctor-runtime-mirrors-drift.md` | Create | DOC-353: a drifted mirror is reported with its repair command |
| `doctor-commands/doctor-env-inspect.md` | Create | DOC-354: `/doctor:env list` and `/doctor:env <VARIABLE>` show defaults and where a switch is set, by name only |
| `doctor-commands/doctor-env-save-preference.md` | Create | DOC-355: a preference is saved only after the exact line and a yes, and `--dry-run` writes nothing |
| `doctor-commands/doctor-env-secret-and-per-invocation.md` | Create | DOC-356: a secret is never asked for or saved, and a per-invocation switch is shown as a prefix only |
| `doctor-commands/doctor-update-check.md` | Create | DOC-357: `/doctor:update check` reports where the checkout stands and writes nothing |
| `doctor-commands/doctor-update-align.md` | Create | DOC-358: `/doctor:update align` records a decision for each changed part |
| `doctor-commands/doctor-update-apply.md` | Create | DOC-359: `/doctor:update apply` shows its plan, asks once, acts only on decided parts and keeps a rollback record |
| `doctor-commands/doctor-update-rollback.md` | Create | DOC-360: `/doctor:update rollback` restores the checkout from the apply record |
| `doctor-commands/doctor-update-record-base.md` | Create | DOC-361: `/doctor:update record-base` records the starting point of a copied tree once |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands/README.md` | Modify | Category notes and ID list |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/manual-testing-playbook.md` | Modify | Index rows for the doctor scenarios |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every target of `/doctor:speckit`, `/doctor:runtime-mirrors`, `/doctor:env`, `/doctor:update` has a scenario | Each row in the files table exists and its root index row links it |
| REQ-002 | Each scenario states only behavior the command contract defines | Every expected signal traces to the command doc or its YAML asset |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | The playbook stays fail-closed clean | `validate-playbook-package.cjs --package .skilled/skills/system-spec-kit/manual-testing-playbook` exits 0 |
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

