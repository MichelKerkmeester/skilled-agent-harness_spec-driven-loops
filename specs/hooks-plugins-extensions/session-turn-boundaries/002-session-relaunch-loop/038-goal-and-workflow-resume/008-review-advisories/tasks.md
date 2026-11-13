---
title: "Tasks: Phase 8: review-advisories"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "review advisories tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 8: review-advisories

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

**Task variables**: `SR` is `.skilled/hooks/session-relaunch`. `TESTS` is `.skilled/hooks/session-relaunch/tests`. `PLUGIN` is `.opencode/plugins`. `PLUGIN_TESTS` is `.opencode/plugins/tests`.

**Test environment**: run the suites with `AI_SESSION_CHILD` unset, as `env -u AI_SESSION_CHILD node --test <file>`. The claim guard treats a dispatched child as silent, so a test process that inherits the marker fails the claim cases for that reason alone.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Record the baseline of the four test files before any edit (`TESTS`, `PLUGIN_TESTS`). Verify: `env -u AI_SESSION_CHILD node --test .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs .skilled/hooks/session-relaunch/tests/nudge.test.cjs .opencode/plugins/tests/opencode-goal-lifecycle.test.cjs` exits 0 with `fail 0`.
- [x] T002 Confirm phases 001 to 007 are Complete (`../001-workflow-reentry-seed/acceptance-criteria.md` to `../007-goal-handover-docs/acceptance-criteria.md`). Verify: `rg -c 'Closeable:\*\* Yes' specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/0{01,02,03,04,05,06,07}-*/acceptance-criteria.md` prints 7 lines.
- [x] T003 Record the source anchors the findings name (`SR`, `PLUGIN`). Verify: `rg -n -F -e 'payloadEventName(payload' -e 'function recordGoalPacket' -e 'the active goal names no packet' -e 'session_id: ${sessionValue}' -e 'cwd: ${cwd}' -e 'return cliPath;' -e 'env?.SKILLED_LOOP_HOPS' -e 'await bindRelaunchGoal(sessionID' -e 'delete process.env[RELAUNCH_GOAL_PACKET_ENV];' -e 'after a compaction, `SessionStart`' .skilled/hooks/session-relaunch/claude/compact-pointer.mjs .skilled/hooks/session-relaunch/lib/relaunch-core.cjs .skilled/hooks/session-relaunch/lib/nudge.cjs .opencode/plugins/opencode-goal.js .skilled/hooks/session-relaunch/README.md` prints 12 lines.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add the start-claim event test, which must fail first (`TESTS/claude-adapters.test.cjs`). Verify: `env -u AI_SESSION_CHILD node --test --test-name-pattern 'names the SessionStart event on a start claim' .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs` exits 1 with `SessionStart` in the failure.
- [x] T005 Emit the literal `SessionStart` from `claimAfterGoalStart` (`SR/claude/compact-pointer.mjs`). Verify: `env -u AI_SESSION_CHILD node --test --test-name-pattern 'names the SessionStart event on a start claim' .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs` exits 0 with `fail 0`.
- [x] T006 Add the claimed-note test, which must fail first (`TESTS/relaunch-core.test.cjs`). Verify: `node --test --test-name-pattern 'recordGoalPacket leaves a note that is not open' .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` exits 1 with the unchanged-bytes assertion in the failure.
- [x] T007 Guard `recordGoalPacket` on `frontmatter.status` inside the lock (`SR/lib/relaunch-core.cjs`). Verify: `node --test --test-name-pattern 'recordGoalPacket leaves a note that is not open' .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` exits 0 with `fail 0`.
- [x] T008 Add the empty-goal reason test, which must fail first (`TESTS/relaunch-core.test.cjs`). Verify: `node --test --test-name-pattern 'active goal with no text names the empty goal' .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` exits 1 with the old reason in the failure.
- [x] T009 Return the empty-text reason before the candidate and headline searches (`SR/lib/relaunch-core.cjs`). Verify: `node --test --test-name-pattern 'active goal with no text names the empty goal' .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` exits 0 with `fail 0`.
- [x] T010 Add the control-character test, which must fail first (`TESTS/nudge.test.cjs`). Verify: `node --test --test-name-pattern 'strips control characters from the session id and the cwd' .skilled/hooks/session-relaunch/tests/nudge.test.cjs` exits 1 with a second `session_id:` line in the failure.
- [x] T011 Strip every C0 control character and DEL from the session id and the cwd in `handoffText` (`SR/lib/nudge.cjs`). Verify: `node --test --test-name-pattern 'strips control characters from the session id and the cwd' .skilled/hooks/session-relaunch/tests/nudge.test.cjs` exits 0 with `fail 0`.
- [x] T012 Add the command prefix test, which must fail first (`TESTS/nudge.test.cjs`). Verify: `node --test --test-name-pattern 'quotes a node command that carries more than one argument' .skilled/hooks/session-relaunch/tests/nudge.test.cjs` exits 1 with the unquoted value in the failure.
- [x] T013 Restrict the unchanged `node ` form and quote every other value as one path (`SR/lib/nudge.cjs`). Verify: `node --test --test-name-pattern 'quotes a node command that carries more than one argument' .skilled/hooks/session-relaunch/tests/nudge.test.cjs` exits 0 with `fail 0`.
- [x] T014 Add the invalid hop count test, which must fail first (`TESTS/nudge.test.cjs`). Verify: `node --test --test-name-pattern 'treats an unusable hop count as the limit reached' .skilled/hooks/session-relaunch/tests/nudge.test.cjs` exits 1 with `false` in the failure.
- [x] T015 Treat a set, non-empty and invalid `SKILLED_LOOP_HOPS` as the limit reached (`SR/lib/nudge.cjs`). Verify: `node --test --test-name-pattern 'treats an unusable hop count as the limit reached' .skilled/hooks/session-relaunch/tests/nudge.test.cjs` exits 0 with `fail 0`.
- [x] T016 Add the throwing-bind test, which must fail first (`PLUGIN_TESTS/opencode-goal-lifecycle.test.cjs`). Verify: `node --test --test-name-pattern 'throwing hand-over bind still deletes the packet variable' .opencode/plugins/tests/opencode-goal-lifecycle.test.cjs` exits 1 with `SESSION_RELAUNCH_GOAL_PACKET` in the failure.
- [x] T017 Put the bind in `try` and the delete in `finally` (`PLUGIN/opencode-goal.js`). Verify: `node --test --test-name-pattern 'throwing hand-over bind still deletes the packet variable' .opencode/plugins/tests/opencode-goal-lifecycle.test.cjs` exits 0 with `fail 0`.
- [x] T018 Add the plugin-to-core contract test, which may pass at once (`PLUGIN_TESTS/opencode-goal-lifecycle.test.cjs`). Verify: `node --test --test-name-pattern 'plugin record path is the one the relaunch core reads' .opencode/plugins/tests/opencode-goal-lifecycle.test.cjs` exits 0 with `fail 0`.
- [x] T019 Rewrite the one README sentence on line 19 to name both uses of `SessionStart` (`SR/README.md`). Verify: `rg -n 'at startup for the claim of a hop whose start prompt is the goal command' .skilled/hooks/session-relaunch/README.md` prints 1 line on line 19.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T020 Run the Claude claim and core suites (`TESTS/claude-adapters.test.cjs`, `TESTS/relaunch-core.test.cjs`). Verify: `env -u AI_SESSION_CHILD node --test .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` exits 0 with `fail 0`.
- [x] T021 Run the nudge suite (`TESTS/nudge.test.cjs`). Verify: `node --test .skilled/hooks/session-relaunch/tests/nudge.test.cjs` exits 0 with `fail 0`.
- [x] T022 Run the OpenCode lifecycle suite (`PLUGIN_TESTS/opencode-goal-lifecycle.test.cjs`). Verify: `node --test .opencode/plugins/tests/opencode-goal-lifecycle.test.cjs` exits 0 with `fail 0`.
- [x] T023 Run every relaunch and plugin suite (`SR/tests`, `PLUGIN_TESTS`). Verify: `env -u AI_SESSION_CHILD node --test .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/*.test.cjs` exits 0 with `fail 0`.
- [x] T024 Run the named guard tests by title (`TESTS`, `PLUGIN_TESTS`). Verify: `env -u AI_SESSION_CHILD node --test --test-name-pattern 'compact-pointer delivers the start claim|compact-pointer delivers the claim at the start|compact-pointer points a compacted session|recordGoalPacket writes|resolver result carries|goal headline outside|handoff text|hopLimitReached|hand-over packet variable' .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs .skilled/hooks/session-relaunch/tests/nudge.test.cjs .opencode/plugins/tests/opencode-goal-lifecycle.test.cjs` exits 0 with `fail 0`.
- [x] T025 Confirm the phase touched only the nine named files (`SR`, `PLUGIN`). Verify: `git diff --name-only -- .skilled/hooks/session-relaunch .opencode/plugins` prints only the nine files named in `spec.md`.
- [x] T026 Run strict validation on the packet (`spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md`, `goal.md`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/008-review-advisories --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
- [x] Every row of `acceptance-criteria.md` is `Met`
- [x] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/008-review-advisories --strict` prints `RESULT: PASSED`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
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

- [x] CHK-001 [P0] Requirements documented in spec.md. Verify: `rg -c '^\| REQ-' spec.md` prints 10.
- [x] CHK-002 [P0] Technical approach defined in plan.md. Verify: `rg -n '^## 4. IMPLEMENTATION PHASES' plan.md` prints 1 line.
- [x] CHK-003 [P1] Phases 001 to 007 are Complete. Verify: `rg -c 'Closeable:\*\* Yes' specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/0{01,02,03,04,05,06,07}-*/acceptance-criteria.md` prints 7 lines.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] The changed CommonJS and ESM sources parse. Verify: `node --check .skilled/hooks/session-relaunch/lib/relaunch-core.cjs .skilled/hooks/session-relaunch/lib/nudge.cjs .skilled/hooks/session-relaunch/claude/compact-pointer.mjs` exits 0.
- [x] CHK-011 [P0] No console output is added to the changed source files. Verify: `git diff -U0 -- .skilled/hooks/session-relaunch/lib .skilled/hooks/session-relaunch/claude .opencode/plugins/opencode-goal.js` prints no added `console.` line.
- [x] CHK-012 [P1] The changed source files carry no spec path, finding id, work package or task id in a comment. Verify: `git diff -U0 -- .skilled/hooks/session-relaunch/lib .skilled/hooks/session-relaunch/claude .opencode/plugins/opencode-goal.js` prints no added line matching `specs/`, `R1-`, `R2-`, `R3-` or `WP-`.
- [x] CHK-013 [P1] The control-character strip keeps the durable WHY in its comment. Verify: `rg -n 'frontmatter' .skilled/hooks/session-relaunch/lib/nudge.cjs` prints at least 1 line.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] Every acceptance row is `Met`. Verify: `rg -c '\| Met \|' acceptance-criteria.md` prints 10.
- [x] CHK-021 [P0] The four test files exit 0. Verify: `env -u AI_SESSION_CHILD node --test .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs .skilled/hooks/session-relaunch/tests/nudge.test.cjs .opencode/plugins/tests/opencode-goal-lifecycle.test.cjs` exits 0 with `fail 0`.
- [x] CHK-022 [P0] The full relaunch and plugin suites exit 0. Verify: `env -u AI_SESSION_CHILD node --test .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/*.test.cjs` exits 0 with `fail 0`.
- [x] CHK-023 [P1] Each of the seven must-fail tests holds a red run. Verify: `rg -c '^not ok' scratch/red.txt` prints 7.
- [x] CHK-024 [P1] Each package holds a green run. Verify: `rg -c '^# fail 0' scratch/green.txt` prints 7.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] Each finding carries one class in `plan.md`. Verify: `rg -n 'instance-only|class-of-bug|cross-consumer|test-isolation|matrix/evidence' plan.md` prints the class list.
- [x] CHK-FIX-002 [P0] The same-class producer inventory ran for the frontmatter values and the command prefix. Verify: `rg -n 'session_id: |cwd: |commandPrefix' .skilled/hooks/session-relaunch/lib/nudge.cjs` lists the two template lines and the one prefix function.
- [x] CHK-FIX-003 [P0] The consumer inventory ran for the packet variable and the changed helpers. Verify: `rg -n 'RELAUNCH_GOAL_PACKET_ENV|recordGoalPacket|hopLimitReached' .skilled/hooks/session-relaunch .opencode/plugins` lists the plugin, the core and the nudge callers.
- [x] CHK-FIX-004 [P0] The adversarial cases exist for the line break, the joined command and the invalid hop count. Verify: `rg -n 'line break|echo hi|abc' .skilled/hooks/session-relaunch/tests/nudge.test.cjs` prints 3 lines.
- [x] CHK-FIX-005 [P1] The matrix axes are listed before completion is claimed. Verify: `rg -n 'Matrix axes' plan.md` prints 1 line.
- [x] CHK-FIX-006 [P1] The hostile env variant ran. Verify: `node --test --test-name-pattern 'treats an unusable hop count' .skilled/hooks/session-relaunch/tests/nudge.test.cjs` exits 0 with `fail 0`.
- [x] CHK-FIX-007 [P1] The evidence is pinned to a commit, not a moving range. Verify: `git rev-parse HEAD` prints the package commit at close.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secret is added. Verify: `git diff -U0` prints no added line matching `api_key`, `password` or `secret`.
- [x] CHK-031 [P0] A session id or cwd with a line break cannot add a frontmatter line. Verify: `node --test --test-name-pattern 'strips control characters' .skilled/hooks/session-relaunch/tests/nudge.test.cjs` exits 0 with `fail 0`.
- [x] CHK-032 [P1] An unsafe `node ` value is quoted as one path. Verify: `node --test --test-name-pattern 'quotes a node command' .skilled/hooks/session-relaunch/tests/nudge.test.cjs` exits 0 with `fail 0`.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan, tasks, criteria and goal name the same nine files. Verify: `rg -l 'compact-pointer\.mjs' spec.md plan.md tasks.md acceptance-criteria.md goal.md` lists 5 files.
- [x] CHK-041 [P1] README line 19 names both uses of `SessionStart`. Verify: `rg -n 'at startup for the claim of a hop whose start prompt is the goal command' .skilled/hooks/session-relaunch/README.md` prints 1 line.
- [x] CHK-042 [P2] The README diff is one removed line and one added line. Verify: `git diff --numstat -- .skilled/hooks/session-relaunch/README.md` prints `1 1`.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] scratch holds the brief and the two run logs. Verify: `ls scratch` lists `finding.md`, `red.txt` and `green.txt`.
- [x] CHK-051 [P1] No new file lands outside the packet and the nine named files. Verify: `git status --short --untracked-files=all` lists no path outside them.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 13 | 0/13 |
| P1 Items | 13 | 0/13 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-11-13
<!-- /ANCHOR:summary -->

---
