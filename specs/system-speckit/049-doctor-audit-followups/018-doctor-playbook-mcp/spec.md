---
title: "Feature Specification: Phase 18: doctor-playbook-mcp"
description: "The mcp-code-mode playbook has no scenario for /doctor:mcp install or debug, so setting up or diagnosing Code Mode through the doctor has no manual test."
trigger_phrases:
  - "doctor playbook mcp"
  - "doctor mcp install debug scenarios"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 18: doctor-playbook-mcp

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
| **Phase** | 18 of 18 |
| **Predecessor** | 017-doctor-playbook-git |
| **Successor** | None |
| **Handoff Criteria** | Every listed scenario file exists, the root index lists it and the playbook validator passes |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 18** of the doctor audit follow-ups. It gives `/doctor:mcp` manual testing scenarios in the `mcp-code-mode` playbook, the skill the command checks.

**Scope Boundary**: `.skilled/skills/mcp-code-mode/manual-testing-playbook` only: the `doctor-commands/` category, its README and the root playbook index, plus the mcp sub-routes in `.skilled/commands/doctor/_routes.yaml`.

**Dependencies**:
- The command contracts: `.skilled/commands/doctor/mcp.md`, `.skilled/commands/doctor/assets/doctor-mcp-install.yaml`, `.skilled/commands/doctor/assets/doctor-mcp-debug.yaml`
- The scenario contract in `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/SKILL.md` and its snippet template

**Deliverables**:
- 4 new scenario files, each with a unique DOC- ID
- Root index rows and a category README for the doctor scenarios

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`/doctor:mcp install` builds Code Mode and writes runtime configs, and `/doctor:mcp debug` diagnoses it, but the mcp-code-mode playbook has no scenario for either, for `--fix` or for the menu shown when no target is given.

### Purpose
An operator can test every target of `/doctor:mcp` by following a scenario with an exact prompt, commands, expected signals and a PASS, FAIL or SKIP verdict.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- One scenario file per row below, written to the operator-scenario contract
- Root playbook index rows and the `doctor-commands/README.md` category notes
- The stale `--server` flag in the mcp sub-routes of `_routes.yaml`

### Out of Scope
- Running the scenarios and recording results - a run is a separate benchmark report
- Changing the doctor commands, except the route manifest drift found while writing DOC-378: `_routes.yaml` still listed `--server` for both mcp sub-actions after the router dropped it

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `doctor-commands/doctor-mcp-install.md` | Create | DOC-375: `install` builds Code Mode, configures `.utcp_config.json` and registers it, each write after its own approval |
| `doctor-commands/doctor-mcp-debug.md` | Create | DOC-376: `debug` reports PASS, WARN or FAIL per check and writes nothing |
| `doctor-commands/doctor-mcp-debug-fix.md` | Create | DOC-377: `debug --fix` repairs a failing check only after approval |
| `doctor-commands/doctor-mcp-target-menu.md` | Create | DOC-378: a missing target shows the menu and waits, and the removed `--server` option is refused |
| `.skilled/skills/mcp-code-mode/manual-testing-playbook/doctor-commands/README.md` | Create | Category notes and ID list |
| `.skilled/skills/mcp-code-mode/manual-testing-playbook/manual-testing-playbook.md` | Modify | Index rows for the doctor scenarios |
| `.skilled/commands/doctor/_routes.yaml` | Modify | Drop the `--server` flag the router no longer accepts from both mcp sub-routes, and describe the Code Mode write locations |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every target of `/doctor:mcp` has a scenario | Each row in the files table exists and its root index row links it |
| REQ-002 | Each scenario states only behavior the command contract defines | Every expected signal traces to the command doc or its YAML asset |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | The playbook stays fail-closed clean | `validate-playbook-package.cjs --package .skilled/skills/mcp-code-mode/manual-testing-playbook` exits 0 |
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

