---
title: "Feature Specification: Provision a nested npm package even when an ancestor installed a same-named dependency"
description: "Worktree provisioning skipped system-spec-kit's npm install because its first dependency was already in an ancestor's node_modules, so four builds failed in every new worktree."
trigger_phrases:
  - "provision dev dependencies"
  - "worktree provisioning skips nested lockfile package"
  - "system-spec-kit missing dev dependencies in worktree"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Provision a nested npm package even when an ancestor installed a same-named dependency

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-24 |
| **Branch** | `worktrees/536-provision-dev-dependencies` |
| **Predecessor** | `../003-worktree-dependency-provisioning` (built the provisioning step this packet fixes) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`worktree-naming.sh create` skipped the npm install for `.skilled/skills/system-spec-kit`. To decide whether a package is installed, the provisioner looks for the package's first dependency in `node_modules`, walking up to the worktree root. system-spec-kit's first dependency is `@types/node`, and `.skilled`, provisioned earlier in the same run, had already installed its own `@types/node` into `.skilled/node_modules`. So the walk found it there, and system-spec-kit's own `npm ci` never ran. `typescript` was then missing, and the spec-kit runtime, the spec-kit CLI, the session-handover history and the skill-advisor runtime builds all failed.

### Purpose
A package with its own `package-lock.json` counts as installed only when its dependency is under its own install root, so every new worktree provisions with no failed build.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ bash .skilled/skills/sk-git/scripts/worktree-naming.sh create provision-dev-dependencies
  provisioning .skilled (npm ci)
  provisioning .opencode (npm ci)
  provisioning .skilled/skills/system-spec-kit/shared (npm install)
  building .skilled/skills/system-spec-kit/runtime
  FAILED: .skilled/skills/system-spec-kit/runtime build
  building .skilled/skills/system-spec-kit/runtime/cli
  FAILED: .skilled/skills/system-spec-kit/runtime/cli build
  building .skilled/hooks/session-handover/history
  FAILED: .skilled/hooks/session-handover/history build
  provisioning .skilled/skills/system-skill-advisor/runtime (npm ci)
  building .skilled/skills/system-skill-advisor/runtime
  FAILED: .skilled/skills/system-skill-advisor/runtime build
provisioned: 10 installed, 1 built, 4 already present, 4 failed

$ ls -d .skilled/node_modules/@types/node .skilled/skills/system-spec-kit/node_modules/typescript
ls: .skilled/skills/system-spec-kit/node_modules/typescript: No such file or directory
.skilled/node_modules/@types/node
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Stop the npm dependency walk at the package's install root, the nearest folder from the package up to the worktree root that holds a `package-lock.json`.
- Add a regression case: a nested lockfile package installs even when an ancestor already holds the same dependency, and a workspace member with no lockfile still counts its workspace root's install.

### Out of Scope
- Checking every dependency instead of the first one. The first-dependency probe is right once the walk stops at the right root.
- The bun path, which already bounds its walk at the package itself.
- The two shellcheck warnings in `worktree-naming.sh`. They exist at HEAD unchanged.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-git/scripts/worktree-naming.sh` | Modify | Add `_wn_npm_install_root` and use it as the npm walk boundary |
| `.skilled/skills/sk-git/scripts/tests/worktree-naming.test.sh` | Modify | Add the nested-lockfile regression case |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A package with its own `package-lock.json` installs when only an ancestor holds its first dependency | The new test case logs one `npm ci` for the nested package; without the fix it fails with `exp='1' got='0'` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | A workspace member with no lockfile still counts its workspace root's install | The new test case logs no npm call for the member |
| REQ-003 | A real worktree provisions with no failed build | `worktree-naming.sh provision` on worktree 536 prints `0 failed` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `bash .skilled/skills/sk-git/scripts/tests/worktree-naming.test.sh` prints `PASS=178 FAIL=0`.
- **SC-002**: Re-provisioning worktree 536 prints `provisioned: 1 installed, 4 built, 13 already present, 0 failed`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | npm installs into the folder holding the lockfile | Low | The boundary follows that rule, and a workspace member has no lockfile of its own |
| Risk | A package that used to be skipped now runs `npm ci` once | Low | That install was missing; a second provision finds it and skips |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---
