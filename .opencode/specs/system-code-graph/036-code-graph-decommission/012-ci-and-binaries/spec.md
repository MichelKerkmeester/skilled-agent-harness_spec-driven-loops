---
title: "Feature Specification: Phase 12: ci-and-binaries"
description: "Delete the launcher, the CLI shim, and their tests; remove the CI isolation job that existed only to police the code-graph import boundary; and clear the gitignore patterns for artifacts that will no longer be produced."
trigger_phrases:
  - "mk-code-index launcher deletion"
  - "code-index.cjs removal"
  - "isolation-check workflow removal"
  - "code graph gitignore patterns"
  - "036 ci and binaries"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-code-graph/036-code-graph-decommission/012-ci-and-binaries"
    last_updated_at: "2026-07-27T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Scaffolded the decommission phase child"
    next_safe_action: "Populate requirements from the touchpoint research synthesis"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-27-036-012-ci-and-binaries"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 12: ci-and-binaries

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Not Started |
| **Created** | 2026-07-27 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 12 of 15 |
| **Predecessor** | 011-doctrine-and-docs |
| **Successor** | 013-skill-deletion-and-daemon-reap |
| **Handoff Criteria** | No binary, shim, test, or CI job remains that targets the subsystem, and the remaining CI suite is green |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 12** of the code graph decommission specification.

**Scope Boundary**: `.opencode/bin/**`, CI workflows, and repository ignore rules.

**Dependencies**:
- Phases 003 through 011 removed every caller, so deleting the launcher breaks nothing still in use.

**Deliverables**:
- The launcher, the CLI shim, the IPC bridge library, and their vitest suites deleted.
- Smoke-test scripts updated to drop the removed CLI.
- The sibling spec-memory launcher's canonical-database references removed.
- The isolation-check CI workflow deleted.
- Gitignore patterns for the subsystem's artifacts removed.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The launcher is the single largest artifact outside the skill itself, and it is the piece every runtime registration pointed at. It also hard-fails by design when the skill directory is absent, which makes it the loudest possible failure mode if it survives deletion. Alongside it sit a CLI shim, an IPC bridge, six launcher test suites, two smoke scripts, and a CI job whose entire purpose is to forbid source-level imports across the spec-kit boundary — a guard with nothing left to guard.

### Purpose
Remove the executable surface and its supporting CI so that nothing in the repository can attempt to start, test, or police a subsystem that is about to be deleted.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Deleting the launcher, the CLI shim, the IPC bridge library, and the six launcher vitest suites.
- Updating the offline and exit-taxonomy smoke scripts.
- Removing canonical-database references from the spec-memory launcher.
- Deleting the isolation-check workflow.
- Removing the post-commit invalidation test script.
- Clearing gitignore patterns for the subsystem's database and build artifacts.

### Out of Scope
- Deleting the skill folder itself — phase 013.
- Consumer code in the skills — phases 005 through 008.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/bin/mk-code-index-launcher.cjs` | Delete | Registered launcher for the removed server |
| `.opencode/bin/mk-code-index-launcher-*.vitest.ts` | Delete | Six suites covering the launcher |
| `.opencode/bin/code-index.cjs` | Delete | CLI front door |
| `.opencode/bin/lib/launcher-ipc-bridge.cjs` | Delete | IPC bridge for the removed daemon |
| `.opencode/bin/cli-*-smoke*.cjs` | Modify | Drop the removed CLI from the smoke matrix |
| `.opencode/bin/mk-spec-memory-launcher.cjs` | Modify | Remove canonical database references |
| `.github/workflows/isolation-check.yml` | Delete | Guards a boundary that no longer exists |
| `.gitignore` | Modify | Remove artifact patterns |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | No executable targeting the subsystem remains | The bin directory contains no launcher, shim, or bridge for it |
| REQ-002 | Remaining CI is green | The workflow suite passes without the deleted job |
| REQ-003 | The spec-memory launcher starts cleanly | It no longer resolves a canonical database inside the removed folder |
| REQ-004 | Smoke scripts pass | The offline and exit-taxonomy smokes run without the removed CLI |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Gitignore carries no orphan pattern | No ignore rule points inside the removed folder |
| REQ-006 | The removed guard is documented | The decision record notes the coupling pattern that should not return |
| REQ-007 | No test references a deleted binary | The suite has no unresolved path |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: CI passes with the isolation job absent and no other job newly failing.
- **SC-002**: Both surviving daemons start and serve after the shared launcher changes.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Spec-memory launcher shares code with the deleted one | Sibling daemon breaks | Change only the code-graph references; start the daemon to verify |
| Risk | Deleting CI reduces coverage silently | A future regression goes unnoticed | Record the removed guard in the decision record |
| Dependency | Phases 003–011 | A surviving caller would break on deletion | Sequence after all decoupling |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Do the smoke scripts retain value with one fewer CLI, or should their matrices be restructured?
<!-- /ANCHOR:questions -->

---

<!-- SCAFFOLD_VALIDATION_COUNTS:
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->
