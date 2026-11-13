---
title: "Tasks: Phase 12: session-name-carry"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "session name carry tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 12: session-name-carry

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

**Task variables**: `SR` is `.skilled/hooks/session-relaunch`. `TESTS` is `.skilled/hooks/session-relaunch/tests`. `WRAP` is `.skilled/bin/skilled-loop`. `PHASE` is `specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/012-session-name-carry`.

**Test environment**: run the suites as `env -u AI_SESSION_CHILD node --test <file>`. The claim guard treats a dispatched child as silent, so a test process that inherits the marker fails the claim cases for that reason alone.

**Hold**: no task runs before the operator's greenlight.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 With the operator present, start one scratch Claude session with `claude --name probe-name`, send one prompt, exit, and read its log by entry type only, then record the answer and the entry list in `goal.md` section 4 (`PHASE/goal.md`). Verify: `node -e` over the log prints the entry types in order, and `rg -n 'custom-title on a launch name' PHASE/goal.md` prints 1 line that says yes or no.
- [ ] T002 Confirm phase 011 is built (`../011-permission-mode-carry/acceptance-criteria.md`). Verify: `rg -n 'Closeable:\*\* Yes' specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/011-permission-mode-carry/acceptance-criteria.md` prints 1 line.
- [ ] T003 Record the relaunch suite baseline on the post-011 tree (`TESTS`). Verify: `env -u AI_SESSION_CHILD node --test .skilled/hooks/session-relaunch/tests/*.test.cjs` exits 0 with `fail 0`, and the pass count is written to `PHASE/scratch/baseline.txt`.
- [ ] T004 Record the source anchors, since 011 may have moved the lines (`SR/bin/session-relaunch.cjs`, `WRAP`). Verify: `rg -n -F -e 'name: process.env.SKILLED_LOOP_NAME' -e "for (const key of ['model'" -e 'launch_arguments+=(--name' -e 'SKILLED_LOOP_HOPS=$((10#' .skilled/hooks/session-relaunch/bin/session-relaunch.cjs .skilled/bin/skilled-loop` prints 5 lines.
- [ ] T005 Time `prepare` on a 16 MiB Claude log with no title, before any edit (`PHASE/scratch/perf.txt`). Verify: `/usr/bin/time -p` output for the prepare test helper run is saved in `PHASE/scratch/perf.txt`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T006 Add `readClaudeSettings returns the last custom title`, `readClaudeSettings finds a custom title past the default tail` and `readClaudeSettings returns an empty name when the log holds no title`, the first two failing first (`TESTS/context-usage.test.cjs`). Verify: `node --test --test-name-pattern 'custom title' .skilled/hooks/session-relaunch/tests/context-usage.test.cjs` exits 1 with `undefined` in the failure.
- [ ] T007 Return `name` from `readClaudeSettings`, the last non-empty `customTitle`, using the widening tail reader (`SR/lib/context-usage.cjs`). Verify: `node --test .skilled/hooks/session-relaunch/tests/context-usage.test.cjs` exits 0 with `fail 0`.
- [ ] T008 Add `prepare records the Claude custom title over SKILLED_LOOP_NAME` and `prepare keeps SKILLED_LOOP_NAME when the log holds no title`, the first failing first (`TESTS/session-relaunch-cli.test.cjs`). Verify: `env -u AI_SESSION_CHILD node --test --test-name-pattern 'custom title over SKILLED_LOOP_NAME' .skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs` exits 1 with `launch` in the failure.
- [ ] T009 Carry `name` through `resolveSessionSettings`, with `name: ''` on every path that proves nothing (`SR/lib/relaunch-core.cjs`). Verify: `node --test .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` exits 0 with `fail 0`.
- [ ] T010 Record `settings.name` before `SKILLED_LOOP_NAME` in `prepare` (`SR/bin/session-relaunch.cjs`). Verify: `env -u AI_SESSION_CHILD node --test --test-name-pattern 'custom title over SKILLED_LOOP_NAME|keeps SKILLED_LOOP_NAME' .skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs` exits 0 with `fail 0`.
- [ ] T011 Add `consume reports the record name`, which must fail first (`TESTS/session-relaunch-cli.test.cjs`). Verify: `node --test --test-name-pattern 'consume reports the record name' .skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs` exits 1 with `name` in the failure.
- [ ] T012 Add `name` to the keys `consume` prints when non-empty (`SR/bin/session-relaunch.cjs`). Verify: `node --test --test-name-pattern 'consume reports' .skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs` exits 0 with `fail 0`.
- [ ] T013 Let the stub record take `RECORD_NAME` in place of `SKILLED_LOOP_NAME` (`TESTS/skilled-loop-wrapper-harness.cjs`). Verify: `env -u AI_SESSION_CHILD node --test .skilled/hooks/session-relaunch/tests/skilled-loop-wrapper-launch-arguments.test.cjs` exits 0 with `fail 0`.
- [ ] T014 Add the six hop-name tests of `REQ-005` and the manual test of `REQ-006`, all failing first (`TESTS/skilled-loop-wrapper-launch-arguments.test.cjs`). Verify: `env -u AI_SESSION_CHILD node --test --test-name-pattern 'numbers the replayed name|live name with the next number|instead of stacking|ends in another number|fails the check falls back|name stem without a number' .skilled/hooks/session-relaunch/tests/skilled-loop-wrapper-launch-arguments.test.cjs` exits 1 with 7 failures or fewer, and `scratch/red.txt` names each failing test.
- [ ] T015 Read `name` from consume, check it, compute the stem, export it and replay `<stem> (H+1)` in hop mode only (`WRAP`). Verify: the T014 command exits 0 with `fail 0`.
- [ ] T016 Amend the five guards of `REQ-008` to expect the numbered hop name, with no other assertion changed (`TESTS/skilled-loop-wrapper-launch-arguments.test.cjs`, `TESTS/skilled-loop-wrapper-claim-goal.test.cjs`, `TESTS/skilled-loop-wrapper-decline-manual.test.cjs`). Verify: `env -u AI_SESSION_CHILD node --test .skilled/hooks/session-relaunch/tests/skilled-loop-wrapper-*.test.cjs` exits 0 with `fail 0`.
- [ ] T017 Correct the comments above the option lists at the two anchors of `REQ-007` (`WRAP`). Verify: `rg -n 'no name flag' .skilled/bin/skilled-loop` prints 2 lines.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T018 Run every relaunch suite (`TESTS`). Verify: `env -u AI_SESSION_CHILD node --test .skilled/hooks/session-relaunch/tests/*.test.cjs` exits 0 with `fail 0`, and the pass count is the baseline plus the new tests.
- [ ] T019 Repeat the T005 timing after the edit (`PHASE/scratch/perf.txt`). Verify: the after number is within 200 ms of the before number.
- [ ] T020 Confirm the phase touched only the ten named files (`SR`, `WRAP`). Verify: `git diff --name-only -- .skilled/hooks/session-relaunch .skilled/bin` prints only the ten files in the `spec.md` table.
- [ ] T021 Confirm no ephemeral label landed in a code comment (`SR`, `WRAP`). Verify: `git diff -U0 -- .skilled/hooks/session-relaunch .skilled/bin` prints no added line matching `specs/`, `REQ-` or `012-`.
- [ ] T022 Run strict validation on the packet (`PHASE`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/012-session-name-carry --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed: `goal.md` records the T001 answer
- [ ] Every row of `acceptance-criteria.md` is `Met`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Research**: `../research/research.md` section 4 and section 9 ranks 6, 9 and 11
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

A blocked task is marked `[B]` with its reason in `goal.md` section 4, and the phase does not close while one remains.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Requirements documented in spec.md. Verify: `rg -c '^\| REQ-' spec.md` prints 9.
- [ ] CHK-002 [P0] The open point has an answer. Verify: `rg -n 'custom-title on a launch name' goal.md` prints 1 line.
- [ ] CHK-003 [P1] Phase 011 is built. Verify: `rg -n 'Closeable:\*\* Yes' ../011-permission-mode-carry/acceptance-criteria.md` prints 1 line.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] The changed sources parse. Verify: `node --check .skilled/hooks/session-relaunch/lib/context-usage.cjs` and `node --check .skilled/hooks/session-relaunch/bin/session-relaunch.cjs` exit 0, and `bash -n .skilled/bin/skilled-loop` exits 0.
- [ ] CHK-011 [P0] No console output is added to the changed library files. Verify: `git diff -U0 -- .skilled/hooks/session-relaunch/lib` prints no added `console.` line.
- [ ] CHK-012 [P1] A refused consumed name warns on stderr. Verify: `node --test --test-name-pattern 'fails the check falls back' .skilled/hooks/session-relaunch/tests/skilled-loop-wrapper-launch-arguments.test.cjs` exits 0 with `fail 0`.
- [ ] CHK-013 [P1] The stem rule keeps its WHY in a comment. Verify: `rg -n 'stack' .skilled/bin/skilled-loop` prints at least 1 line.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] Every acceptance row is `Met`. Verify: `rg -c '\| Met \|' acceptance-criteria.md` prints 9.
- [ ] CHK-021 [P0] The relaunch suites exit 0. Verify: `env -u AI_SESSION_CHILD node --test .skilled/hooks/session-relaunch/tests/*.test.cjs` exits 0 with `fail 0`.
- [ ] CHK-022 [P1] Each new must-fail test holds a red run. Verify: `rg -c '^not ok' scratch/red.txt` prints at least 11.
- [ ] CHK-023 [P1] The no-stack case passes. Verify: `node --test --test-name-pattern 'instead of stacking' .skilled/hooks/session-relaunch/tests/skilled-loop-wrapper-launch-arguments.test.cjs` exits 0 with `fail 0`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [ ] CHK-FIX-001 [P0] Each finding carries one class in `plan.md`. Verify: `rg -n 'cross-consumer|instance-only|matrix/evidence' plan.md` prints the class list.
- [ ] CHK-FIX-002 [P0] The same-class producer inventory ran. Verify: `rg -n 'SKILLED_LOOP_NAME' .skilled/bin/skilled-loop .skilled/hooks/session-relaunch/bin .skilled/hooks/session-relaunch/lib` lists every writer and reader.
- [ ] CHK-FIX-003 [P0] The consumer inventory ran for the changed helpers. Verify: `rg -n 'readClaudeSettings|resolveSessionSettings' .skilled .opencode/plugins --glob '!**/node_modules/**'` lists the callers.
- [ ] CHK-FIX-004 [P0] The adversarial name cases exist. Verify: `rg -n "'-x'|\\\\n|Phase \(7\)" .skilled/hooks/session-relaunch/tests/skilled-loop-wrapper-launch-arguments.test.cjs` prints at least 3 lines.
- [ ] CHK-FIX-005 [P1] The matrix axes are listed before completion is claimed. Verify: `rg -n 'Matrix axes' plan.md` prints 1 line.
- [ ] CHK-FIX-006 [P1] The hostile env variant ran: a consumed name that starts with `-`. Verify: `node --test --test-name-pattern 'fails the check falls back' .skilled/hooks/session-relaunch/tests/skilled-loop-wrapper-launch-arguments.test.cjs` exits 0 with `fail 0`.
- [ ] CHK-FIX-007 [P1] The evidence is pinned to a commit. Verify: `git rev-parse HEAD` prints the phase commit at close.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secret is added. Verify: `git diff -U0` prints no added line matching `api_key`, `password` or `secret`.
- [ ] CHK-031 [P0] A consumed name cannot become an option. Verify: `node --test --test-name-pattern 'fails the check falls back' .skilled/hooks/session-relaunch/tests/skilled-loop-wrapper-launch-arguments.test.cjs` exits 0 with `fail 0`.
- [ ] CHK-032 [P1] The T001 log read prints entry types and key names only, never message content. Verify: the T001 entry in `goal.md` lists types only.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec, plan, tasks, criteria and goal name the same wrapper file. Verify: `rg -l 'skilled-loop' spec.md plan.md tasks.md acceptance-criteria.md goal.md` lists 5 files.
- [ ] CHK-041 [P1] The two option comments are corrected. Verify: `rg -n 'no name flag' .skilled/bin/skilled-loop` prints 2 lines.
- [ ] CHK-042 [P2] The README is untouched, because phase 017 owns it. Verify: `git diff --name-only -- .skilled/hooks/session-relaunch/README.md` prints nothing.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] scratch holds the run logs. Verify: `ls scratch` lists `baseline.txt`, `perf.txt`, `red.txt` and `green.txt`.
- [ ] CHK-051 [P1] No new file lands outside the packet and the ten named files. Verify: `git status --short --untracked-files=all` lists no path outside them.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 0/12 |
| P1 Items | 13 | 0/13 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-11-13
<!-- /ANCHOR:summary -->

---
