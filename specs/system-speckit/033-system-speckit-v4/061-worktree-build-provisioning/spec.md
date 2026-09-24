---
title: "Feature Specification: Phase 61: Worktree build provisioning"
description: "Two runtime test suites fail in any worktree that has not built two sibling packages, and fail as a missing module rather than as a missing build; worktree provisioning installed dependencies but never built anything and left one of the two packages off its list."
trigger_phrases:
  - "worktree build provisioning"
  - "provision builds missing outputs"
  - "communication projection dist missing"
  - "advisor policy plan dist missing"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 61: Worktree build provisioning

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
| **Phase** | 61 of 62 |
| **Predecessor** | 060-save-resume-pointer-truth |
| **Successor** | 062-v4-parent-data-repairs |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 61** of the system-spec-kit v4 specification, the sixth of the fix phases planned after phase 051 shipped. Phase 051's full runtime run failed two suites for a setup reason, not a code one; this phase makes the setup provide what they need and makes the failure say so.

**Scope Boundary**: sk-git's provisioning script, its path list and its test, and the two runtime test files. The packages themselves do not change.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`opencode-plugins-folder-purity.vitest.ts` imports every plugin under `.skilled/plugins/`, and one of them imports the build output of `sk-communication/cli-communication-projection`. `spec-gate-pi-extension.vitest.ts` imports the spec-gate core, which imports the build output of `system-skill-advisor/runtime` directly. Build outputs are gitignored, so a fresh worktree has neither, and both suites fail with "Cannot find module". `worktree-naming.sh provision`, which is how a worktree gets its dependencies, only installs packages, never builds one, and does not list the projection package at all.

### Purpose
Provisioning a worktree leaves it able to run both suites, and a checkout that has not been provisioned fails them with a message naming the command that fixes it.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- An optional build output per line of the provision path list, and a build step when that output is missing.
- The projection package added to the list; both packages given their output.
- A failure message naming the provision command in both suites.
- `provision` with no argument provisioning the worktree it runs in. Added during the phase: the first real run showed it provisioned the primary checkout instead, which defeats running it inside a worktree.
- Running provision in this worktree.

### Out of Scope
- Listing build outputs for spec-kit's own packages. Their compiled output is checked for freshness by `validate.sh`, which already fails with its own message.
- The launch-wrapper worktrees, which share the source checkout's builds.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-git/scripts/worktree-provision-paths.txt` | Modify | Optional build output per line; projection package added |
| `.skilled/skills/sk-git/scripts/worktree-naming.sh` | Modify | Build a package whose listed output is missing; default to the current worktree |
| `.skilled/skills/sk-git/scripts/tests/worktree-naming.test.sh` | Modify | Provisioning tests with npm stubbed |
| `.skilled/skills/system-spec-kit/runtime/tests/opencode-plugins-folder-purity.vitest.ts` | Modify | Name the fix when a plugin's build output is missing |
| `.skilled/skills/system-spec-kit/runtime/tests/spec-gate-pi-extension.vitest.ts` | Modify | Check for the advisor build before importing the core |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Provision builds a listed output that is missing. | A package whose output is absent is built once; one whose output exists is not. |
| REQ-002 | A build that writes nothing is a failure. | A build that exits 0 without its output makes provision exit non-zero. |
| REQ-003 | Provisioning this worktree lets both suites pass. | Both suites pass after `worktree-naming.sh provision`. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | An unprovisioned checkout says how to fix itself. | Each suite's failure names `worktree-naming.sh provision`. |
| REQ-005 | `provision` with no argument provisions the worktree it runs in. | Run from a linked worktree, it builds there and writes nothing at the primary checkout. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The new provisioning tests fail against the previous `provision_worktree`.
- **SC-002**: The sk-git naming suite passes, and both runtime suites pass after provisioning.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Every worktree uses this script | Medium | The build step runs only for lines that name an output, and only when that output is missing |
| Dependency | The advisor build compiles spec-kit's shared package through spec-kit's own `tsc` | Medium | The list installs spec-kit before the advisor, so its compiler is present when the advisor builds |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The operator approved the provisioning change and running it here.
<!-- /ANCHOR:questions -->

---
