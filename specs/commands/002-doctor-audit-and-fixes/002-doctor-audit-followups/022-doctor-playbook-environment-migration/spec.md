---
title: "Feature Specification: Phase 22: doctor-playbook-environment-migration"
description: "The doctor scenarios asked testers for throwaway copies and hand-made edits. Twenty-three scenarios now name one of the two local environments, start from a clean state and end with a reset, and a new scenario keeps the update fixture honest."
trigger_phrases:
  - "doctor playbook environment migration"
  - "doctor scenarios test environment"
  - "doctor update fixture scenarios"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 22: doctor-playbook-environment-migration

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
| **Phase** | 22 of 22 |
| **Predecessor** | 021-doctor-test-environments |
| **Successor** | None |
| **Handoff Criteria** | Every changed scenario validates, names its environment and ends with a reset that leaves git status empty |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 22** of the doctor audit follow-ups. Phase 021 built the update fixture and the current-code environment. This phase points the manual testing scenarios of five playbooks at them and documents both environments where testers start.

**Scope Boundary**: Doctor-command scenario files and the doctor-commands READMEs in the system-spec-kit, system-skill-advisor, system-deep-loop, sk-git and mcp-code-mode playbooks, plus the mcp-code-mode leaf manifests the new scenario made stale.

**Dependencies**:
- Both environments from `021-doctor-test-environments`
- The scenario validator in `sk-create-manual-testing-playbook`

**Deliverables**:
- A Test Environments section in the system-spec-kit doctor-commands README
- DOC-379, the update fixture scenario
- Twenty-three scenarios moved onto the environments

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The /doctor:update scenarios described units no checkout has, and the other suites rebuilt a throwaway copy for every run. Neither gave a repeatable starting state or a reset.

### Purpose
Scenarios a tester can run again and again against a known state, with the environment named in each file.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The README Test Environments guide, and How to Run pointers in the deep-loop, sk-git and mcp-code-mode doctor READMEs
- DOC-379 with the fixture rebuild steps
- Eleven scenarios on the current-code environment for spec-kit env, mirrors and speckit plus four skill-advisor scenarios
- Seven deep-loop, sk-git and mcp scenarios on the current-code environment
- Five /doctor:update scenarios on the fixture

### Out of Scope
- DOC-331 to DOC-333, which build their own deep-loop copy
- DOC-370, which needs a disposable clone because linked worktrees share `.git/config`
- DOC-369, DOC-374, DOC-378 and DOC-380, which never write and run in any working copy

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `system-spec-kit/.../doctor-commands/README.md` | Modify | Test Environments guide |
| `system-spec-kit/.../doctor-commands/doctor-update-test-environment.md` | Create | DOC-379 |
| 23 doctor scenario files across five playbooks | Modify | Environment preconditions, setup step, reset step, Environment guide link |
| `mcp-code-mode/leaf-manifest.json`, `leaf-aliases.json` | Modify | Regenerated for the new DOC-380 file |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Each changed scenario names its environment | Preconditions name `.worktrees/.doctor-test-environment` or `.worktrees/.doctor-update-test-environment` |
| REQ-002 | Each changed scenario resets | The last step restores changed files and confirms an empty `git status --porcelain` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Prompts stay fixed | The Prompt bullet, the Real user request bullet and the Prompt block match HEAD byte for byte |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Every changed scenario returns an empty validator result.
- **SC-002**: No changed scenario gains a voice blocker.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A dispatched rewrite gets a step reference wrong | Med | Every file was diffed by hand after its dispatch, and the rebuild scenario's off-by-one evidence steps were corrected |
| Risk | A scenario's engine claim is wrong for the fixture | Med | The fixture claims the update scenarios rely on were rerun against the fixture |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---

