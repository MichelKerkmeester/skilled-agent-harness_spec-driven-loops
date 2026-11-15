---
title: "Feature Specification: Phase 37: relaunch-test-speed"
description: "The relaunch suite took 130 seconds because `skilled-loop.test.cjs` alone ran for about 123 seconds and `node --test` waits for its slowest file. One nudge test also failed when the suite ran from inside a looped session, because it read the session's own loop id."
trigger_phrases:
  - "relaunch test speed"
  - "phase 37 relaunch test speed"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 37: relaunch-test-speed

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-11-12 |
| **Branch** | `worktrees/356-relaunch-test-speed` |
| **Parent Spec** | ../spec.md |
| **Phase** | 37 of 37 |
| **Predecessor** | 036-review-remediation |
| **Successor** | None |
| **Handoff Criteria** | The relaunch suite passes with the same 868 tests and its wall time is measured |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 37** of the session relaunch loop specification. It changes tests and the documents that name them, and no shipped code.

**Scope Boundary**: The wrapper test file, one nudge test and the documents that name the wrapper test file. No test is added, removed or reworded.

**Dependencies**:
- Phase 036, which added the nudge test this phase makes independent of the shell

**Deliverables**:
- Four wrapper test files and one shared harness in place of `skilled-loop.test.cjs`
- A nudge test that passes inside a looped session
- Five documents that name the new files
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The relaunch suite took 130 seconds because `skilled-loop.test.cjs` alone ran for about 123 seconds and `node --test` waits for its slowest file. One nudge test also failed when the suite ran from inside a looped session, because it read the session's own loop id.

### Purpose
The relaunch suite runs the same 868 tests in about a third of the time and passes whatever loop variables the shell carries.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ node --test .skilled/hooks/session-relaunch/tests/*.test.cjs    (loop variables unset, before this phase)
ℹ tests 868
ℹ pass 868
ℹ fail 0
ℹ duration_ms 130123.294583

$ node --test --test-reporter=tap .skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs
185 tests, sum of test time 133.5 s

$ node --test .skilled/hooks/session-relaunch/tests/nudge.test.cjs    (inside a looped session)
✖ a nudge state file behind a symlinked state directory reads as empty
+   reason: 'threshold'
-   reason: 'outside-loop'
ℹ pass 74
ℹ fail 1
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Split `skilled-loop.test.cjs` into four files at statement boundaries, each about a quarter of its run time.
- Move the sandbox and stub helpers the four files share into `skilled-loop-wrapper-harness.cjs`. Without it each file would carry its own copy of 600 lines.
- Set an empty loop id in the one nudge test that expects an outside-loop decision.
- Replace the old file name in the tests README, the feature catalog and three playbooks.

### Out of Scope
- Running tests inside one file side by side - the tests kill processes and race deadlines, and a parallel trial on the advisor suite was reverted for flakiness.
- Merging or removing tests - no test was read for redundancy in this phase.
- Splitting `killer.test.cjs` - at about 38 seconds it now sets the wait, and it is the next candidate.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs` | Delete | Replaced by the four files and the harness |
| `.skilled/hooks/session-relaunch/tests/skilled-loop-wrapper-harness.cjs` | Create | Sandbox, runtime stubs and constants shared by the four files |
| `.skilled/hooks/session-relaunch/tests/skilled-loop-wrapper-launch-arguments.test.cjs` | Create | First launch and replayed hop arguments |
| `.skilled/hooks/session-relaunch/tests/skilled-loop-wrapper-model-effort.test.cjs` | Create | Model, effort and runtime options carried between hops |
| `.skilled/hooks/session-relaunch/tests/skilled-loop-wrapper-decline-manual.test.cjs` | Create | Exit codes, declined hops and the manual command |
| `.skilled/hooks/session-relaunch/tests/skilled-loop-wrapper-claim-goal.test.cjs` | Create | Claim state, withdrawn hand-overs and goal packets |
| `.skilled/hooks/session-relaunch/tests/nudge.test.cjs` | Modify | One test sets an empty loop id |
| `.skilled/hooks/session-relaunch/tests/README.md` | Modify | Lists the four files and the harness |
| `.skilled/skills/system-spec-kit/feature-catalog/context-preservation/session-relaunch-loop.md` | Modify | Names the new files |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-claude.md` | Modify | Names the new files |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-command-runtimes.md` | Modify | Names the new files |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-pi-opencode.md` | Modify | Names the new files |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The four wrapper files run exactly the tests the old file ran. | `node --test --test-reporter=tap` on the four files reports 185 tests, 185 pass, and the sorted test titles equal those of the old file. |
| REQ-002 | The relaunch suite still passes in full. | `node --test .skilled/hooks/session-relaunch/tests/*.test.cjs` with the loop variables unset exits 0 with 868 tests, 868 pass. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | The suite passes from inside a looped session. | The same command with the session's loop variables left in place exits 0 with 868 pass. |
| REQ-004 | No document names the old file. | `rg -n 'skilled-loop\.test' .skilled -g '*.md' -g '!**/changelog/**'` prints no line. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The relaunch suite's wall time falls from 130 seconds to under 60 seconds on the same machine.
- **SC-002**: The count of tests stays 868 and no test title changes.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `node --test` runs files side by side | Without that the split saves nothing | Checked with three timed runs after the split |
| Risk | A test is lost or changed while the file is cut | Med | The split is done by a parser at statement boundaries, and the titles before and after are compared |
| Risk | Four files that spawn bash at once make a timing test flaky | Med | Three clean runs and one ambient run, all 868 pass |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None
<!-- /ANCHOR:questions -->

---


