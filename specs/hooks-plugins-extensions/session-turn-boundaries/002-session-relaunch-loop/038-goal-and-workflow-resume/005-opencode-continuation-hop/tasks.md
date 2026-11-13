---
title: "Tasks: Phase 5: opencode-continuation-hop"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "opencode continuation hop tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 5: opencode-continuation-hop

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

**Paths**: `P` is `.opencode/plugins/opencode-goal.js`. `T` is `.opencode/plugins/tests/opencode-goal-lifecycle.test.cjs`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Confirm the mirror path points at the plugin (`.skilled/hooks/goal/opencode/opencode-goal.js`). Verify: `readlink .skilled/hooks/goal/opencode/opencode-goal.js` prints `../../../../.opencode/plugins/opencode-goal.js`.
- [ ] T002 Record the lifecycle pass count before any edit (`.opencode/plugins/tests/opencode-goal-lifecycle.test.cjs`). Verify: `node --test .opencode/plugins/tests/opencode-goal-lifecycle.test.cjs` exits 0.
- [ ] T003 Add the suppression test (`.opencode/plugins/tests/opencode-goal-lifecycle.test.cjs`). Verify: `node --test --test-name-pattern='pending relaunch record' .opencode/plugins/tests/opencode-goal-lifecycle.test.cjs` exits 1 and the failure shows `fired`.
- [ ] T004 Add the variable-deletion test (`.opencode/plugins/tests/opencode-goal-lifecycle.test.cjs`). Verify: `node --test --test-name-pattern='packet variable is deleted' .opencode/plugins/tests/opencode-goal-lifecycle.test.cjs` exits 1 and the failure names `SESSION_RELAUNCH_GOAL_PACKET`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Add the relaunch record check to `maybeContinueGoal` (`P`). Verify: `node --test --test-name-pattern='pending relaunch record' .opencode/plugins/tests/opencode-goal-lifecycle.test.cjs` exits 0.
- [ ] T006 Delete the packet variable after the one bind attempt (`P`). Verify: `node --test --test-name-pattern='packet variable is deleted' .opencode/plugins/tests/opencode-goal-lifecycle.test.cjs` exits 0.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T007 Run the guard suites (`.opencode/plugins/tests/opencode-goal-lifecycle.test.cjs`, `.opencode/plugins/tests/opencode-goal-handover.test.cjs`, `.opencode/plugins/tests/session-relaunch.test.cjs`). Verify: `node --test .opencode/plugins/tests/opencode-goal-lifecycle.test.cjs .opencode/plugins/tests/opencode-goal-handover.test.cjs .opencode/plugins/tests/session-relaunch.test.cjs` exits 0.
- [ ] T008 Run the relaunch core suite (`.skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs`). Verify: `node --test .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` exits 0.
- [ ] T009 Run strict validation on the packet (`specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/005-opencode-continuation-hop`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/005-opencode-continuation-hop --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] The lifecycle suite names both new tests and exits 0
- [ ] Every row of `acceptance-criteria.md` is `Met`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] `spec.md` holds REQ-001 to REQ-003. Verify: `rg -c '^\| REQ-' spec.md` prints 3.
- [ ] CHK-002 [P0] `tasks.md` holds the three phases. Verify: `rg -c '^## Phase' tasks.md` prints 3.
- [ ] CHK-003 [P1] The relaunch core exports the record read. Verify: `rg -n 'readRelaunchFile' .skilled/hooks/session-relaunch/lib/relaunch-core.cjs` prints a line.
- [ ] CHK-004 [P0] Both new tests failed before the change. Verify: the recorded runs show `# fail 1` for each `--test-name-pattern` case.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] The plugin parses. Verify: `node --check .opencode/plugins/opencode-goal.js` exits 0.
- [ ] CHK-011 [P0] The lifecycle suite passes. Verify: `node --test .opencode/plugins/tests/opencode-goal-lifecycle.test.cjs` exits 0.
- [ ] CHK-012 [P1] No new module or record field lands. Verify: `git diff --stat` names the plugin and the lifecycle suite only.
- [ ] CHK-013 [P1] The guard reads the record through the existing core. Verify: `rg -n 'readRelaunchFile' .opencode/plugins/opencode-goal.js` prints one import and one call.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] AC-001 passes. Verify: `node --test --test-name-pattern='pending relaunch record' .opencode/plugins/tests/opencode-goal-lifecycle.test.cjs` exits 0.
- [ ] CHK-021 [P0] AC-002 passes. Verify: `node --test --test-name-pattern='packet variable is deleted' .opencode/plugins/tests/opencode-goal-lifecycle.test.cjs` exits 0.
- [ ] CHK-022 [P0] AC-003 passes. Verify: `node --test .opencode/plugins/tests/opencode-goal-lifecycle.test.cjs .opencode/plugins/tests/opencode-goal-handover.test.cjs .opencode/plugins/tests/session-relaunch.test.cjs` exits 0.
- [ ] CHK-023 [P1] A continuation with no record still fires. Verify: `node --test --test-name-pattern='resume clears a suppression' .opencode/plugins/tests/opencode-goal-lifecycle.test.cjs` exits 0.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [ ] CHK-FIX-001 [P0] Each finding names one class. N1 is `cross-consumer` and N3 is `cross-consumer`.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory is complete. Verify: `rg -n 'SESSION_RELAUNCH_GOAL_PACKET|SKILLED_LOOP_ID' .opencode/plugins .skilled/hooks/goal` names every read and write.
- [ ] CHK-FIX-003 [P0] Consumer inventory is complete. Verify: `rg -n 'maybeContinueGoal|bindRelaunchGoal' .opencode/plugins .skilled/hooks/goal` names every caller.
- [ ] CHK-FIX-004 [P0] N/A: the change adds no security, path, parser or redaction rule. It reads one existing validated path.
- [ ] CHK-FIX-005 [P1] The matrix axes in `plan.md` are listed before completion. Verify: `rg -n 'Matrix axes' plan.md` prints one line.
- [ ] CHK-FIX-006 [P1] The new test restores `SKILLED_LOOP_ID` and `XDG_RUNTIME_DIR`. Verify: the suite exits 0 and the next case starts with both unset.
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a commit. Verify: `git rev-parse HEAD` matches the SHA in `implementation-summary.md`.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] N/A: no credential is added. The change reads one local record and one environment variable.
- [ ] CHK-031 [P0] N/A: no request input is parsed. The record read keeps the existing path validation.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] `spec.md`, `plan.md` and `tasks.md` name the same two behaviors. Verify: `rg -n 'suppressed|SESSION_RELAUNCH_GOAL_PACKET' spec.md plan.md tasks.md` prints in all three.
- [ ] CHK-041 [P1] No spec path or finding id sits in a planned code comment. Verify: `rg -n '^\s*//.*(specs/|N1|N3)' .opencode/plugins/opencode-goal.js` prints no line.
- [ ] CHK-042 [P2] N/A: the README and flags change belongs to phase 007.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] No file outside the packet changes during planning. Verify: `git status --short` lists no path outside the packet folder.
- [ ] CHK-051 [P1] `scratch/` holds the finding only. Verify: `ls scratch` prints `finding.md`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 14 | 0/14 |
| P1 Items | 11 | 0/11 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-11-12
<!-- /ANCHOR:summary -->

---
