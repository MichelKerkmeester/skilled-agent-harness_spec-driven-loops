---
title: "Feature Specification: Phase 15: doctor-playbook-skill-advisor"
description: "The system-skill-advisor playbook has no doctor scenarios, and the one /doctor:skill-advisor scenario that exists sits in the system-spec-kit playbook and covers only rebuild."
trigger_phrases:
  - "doctor playbook skill-advisor"
  - "doctor skill-advisor scenarios"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 15: doctor-playbook-skill-advisor

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
| **Phase** | 15 of 15 |
| **Predecessor** | 014-doctor-playbook-spec-kit |
| **Successor** | None |
| **Handoff Criteria** | Every listed scenario file exists, the root index lists it and the playbook validator passes |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 15** of the doctor audit follow-ups. It gives `/doctor:skill-advisor` manual testing scenarios in the `system-skill-advisor` playbook, the skill the command checks.

**Scope Boundary**: `.skilled/skills/system-skill-advisor/manual-testing-playbook` only: the `doctor-commands/` category, the root playbook index and its inventory test.

**Dependencies**:
- The command contracts: `.skilled/commands/doctor/skill-advisor.md`, `.skilled/commands/doctor/assets/`
- The scenario contract in `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/SKILL.md` and its snippet template

**Deliverables**:
- 6 new scenario files and 1 moved scenario files, each with a unique DOC- ID
- Root index rows and category notes for the doctor scenarios

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`/doctor:skill-advisor` has six targets and a menu for a missing target, but only `rebuild` has a scenario, and that scenario lives in the system-spec-kit playbook rather than with the skill it checks.

### Purpose
An operator can test every target of `/doctor:skill-advisor` by following a scenario with an exact prompt, commands, expected signals and a PASS, FAIL or SKIP verdict.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- One scenario file per row below, written to the operator-scenario contract
- Root playbook index rows, with the category notes in the root section, because the inventory test counts every Markdown file in a category folder as a scenario
- The playbook inventory test's hardcoded counts, which must match the corpus

### Out of Scope
- Running the scenarios and recording results - a run is a separate benchmark report
- Changing the doctor commands - a scenario that finds a defect records it, it does not fix it

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `doctor-commands/doctor-skill-advisor-rebuild.md` | Move from system-spec-kit | DOC-348: `rebuild` backs up the graph, rebuilds it and restores it on failure |
| `doctor-commands/doctor-skill-advisor-tune.md` | Create | DOC-362: `tune` re-tunes the scoring lanes after a per-skill review |
| `doctor-commands/doctor-skill-advisor-graph-freshness.md` | Create | DOC-363: `skill-graph-freshness` audits the graph against the checked-in metadata and writes nothing |
| `doctor-commands/doctor-skill-advisor-router-reach.md` | Create | DOC-364: `router-reach` audits which resources a hub's router can reach and writes nothing |
| `doctor-commands/doctor-skill-advisor-skill-budget.md` | Create | DOC-365: `skill-budget` audits skill size budgets and writes nothing |
| `doctor-commands/doctor-skill-advisor-parent-skill.md` | Create | DOC-366: `parent-skill` audits a parent hub's structure and writes nothing |
| `doctor-commands/doctor-skill-advisor-target-menu.md` | Create | DOC-367: a missing target shows the menu and waits, without guessing a target |
| `.skilled/skills/system-skill-advisor/manual-testing-playbook/manual-testing-playbook.md` | Modify | Index rows for the doctor scenarios |
| `.skilled/skills/system-skill-advisor/runtime/tests/manual-testing-playbook.vitest.ts` | Modify | Inventory counts for the new category; the test already expected 49 files against 47 on disk |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every target of `/doctor:skill-advisor` has a scenario | Each row in the files table exists and its root index row links it |
| REQ-002 | Each scenario states only behavior the command contract defines | Every expected signal traces to the command doc or its YAML asset |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | The playbook stays fail-closed clean | `validate-playbook-package.cjs --package .skilled/skills/system-skill-advisor/manual-testing-playbook` exits 0 |
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

