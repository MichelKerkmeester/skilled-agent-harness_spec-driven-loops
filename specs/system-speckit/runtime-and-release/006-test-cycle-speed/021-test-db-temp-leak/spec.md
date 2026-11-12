---
title: "Feature Specification: Phase 21: test-db-temp-leak"
description: "Each spec-kit vitest lane left three empty speckit-test-db folders in the OS temp folder on every run, because vitest runs no afterAll hook for a file whose tests are all skipped."
trigger_phrases:
  - "test db temp leak"
  - "phase 21 test db temp leak"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 21: test-db-temp-leak

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | In Progress |
| **Created** | 2026-11-12 |
| **Branch** | `worktrees/359-test-db-temp-leak` |
| **Parent Spec** | ../spec.md |
| **Phase** | 21 of 21 |
| **Predecessor** | 020-test-speed-followups |
| **Successor** | None |
| **Handoff Criteria** | A full spec-kit `npm test` leaves no new `speckit-test-db` folder and every pull request check passes |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 21** of the Test Cycle Speed specification.

**Scope Boundary**: The scratch database folder that the spec-kit vitest setup file creates per test file. No test changes.

**Dependencies**:
- Phase 20, which measured three leftover folders per lane and did not trace them.

**Deliverables**:
- The cause of the leak, named by test file.
- A run-level setup that removes every scratch folder when the run ends.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The spec-kit vitest setup file creates a scratch database folder per test file and removes it in an `afterAll` hook. Six test files still left their folder behind on every run, three per lane, and the OS temp folder held 3,350 of them. A full temp folder is what made one test file take 370 s in phase 19.

### Purpose
A spec-kit test run leaves no scratch database folder behind.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
(setup file marked each scratch folder with its test file, then both lanes ran; folders left afterwards)
speckit-test-db-1USbOi 0 runtime/tests/copilot-compact-cycle.vitest.ts
speckit-test-db-kHo9qD 0 runtime/tests/remediation-008-docs.vitest.ts
speckit-test-db-NfH5I8 0 runtime/tests/copilot-user-prompt-submit-hook.vitest.ts
speckit-test-db-Mi5MX2 0 runtime/cli/tests/graph-aware-stop.vitest.ts
speckit-test-db-vv1yQQ 0 runtime/cli/tests/workflow-session-id.vitest.ts
speckit-test-db-Z4Ybvx 0 runtime/cli/tests/normalizer-lint.vitest.ts

$ npx vitest run tests/copilot-compact-cycle.vitest.ts tests/remediation-008-docs.vitest.ts
 Test Files  2 skipped (2)
      Tests  4 skipped (4)
before=3352 after=3354
```
The second column is the number of entries in the folder. Every leftover folder is empty and belongs to a file that vitest reports as skipped. Vitest runs no `afterAll` hook for such a file, so the setup file's cleanup never ran.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add a run-level vitest setup that creates one root folder, names it in `SPECKIT_TEST_DB_ROOT` and removes it when the run ends. Without it a skipped file's folder has no owner.
- Create each scratch folder inside that root.
- Register the run-level setup in the runtime config and in both projects of the package config.

### Out of Scope
- Un-skipping the six files - why each is skipped is a separate question.
- Folders left by a run that is killed - the run-level teardown does not run then, and one root folder stays in place of many.
- The other suites' temp folders - phase 20 lists them.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/tests/_support/vitest-global-setup.ts` | Create | Creates the root folder and removes it at the end of the run |
| `.skilled/skills/system-spec-kit/runtime/tests/_support/vitest-setup.ts` | Modify | Creates the scratch folder inside the root |
| `.skilled/skills/system-spec-kit/runtime/vitest.config.ts` | Modify | Registers the run-level setup |
| `.skilled/skills/system-spec-kit/vitest.config.ts` | Modify | Registers it in the `root` and `cli` projects |
| `.skilled/skills/system-spec-kit/runtime/tests/_support/README.md` | Modify | Lists the new file |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The six files that leaked leave no folder | The count of `speckit-test-db-*` entries in the OS temp folder is the same before and after they run |
| REQ-002 | The whole suite still passes | `npm test` in the spec-kit runtime folder exits 0 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | A full run leaves no new scratch folder | `find <tmp> -maxdepth 1 -name 'speckit-test-db-*' -newer <stamp>` prints nothing after `npm test` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Zero new `speckit-test-db` entries after a full `npm test`.
- **SC-002**: Every check on the pull request passes.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Worker processes inherit the environment of the vitest main process | Without it the root is unknown to the setup file | The setup file falls back to the OS temp folder, which is the old behaviour |
| Risk | A test expects its scratch folder directly under the OS temp folder | Low: no test failed in the full run | The full suite ran from the final state |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---
