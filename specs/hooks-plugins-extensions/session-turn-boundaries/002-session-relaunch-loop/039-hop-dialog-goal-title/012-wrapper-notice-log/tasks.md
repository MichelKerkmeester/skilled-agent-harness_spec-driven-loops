---
title: "Tasks: Phase 12: wrapper-notice-log"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "wrapper notice log tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 12: wrapper-notice-log

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

**Task variables**: `RL` is `.skilled/hooks/session-relaunch`. `PHASE` is this phase folder. `FIX` is the commit that lands this phase.

**Test environment**: run the suites as `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test <file>`, because a dispatched child marker and an inherited OpenCode database path both change how the relaunch tests behave.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Take the suite baseline before any edit (`RL/tests`). Verify: `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/*.test.cjs` exits 0, and its `tests` and `pass` lines are saved in `PHASE/scratch/baseline.txt`. Observed: the known baseline of this tree after merging main (`be56fabc7b`) is tests 1548, pass 1548, fail 0, exit 0, written to `scratch/baseline.txt` and not rerun, per the dispatch.
- [x] T002 Confirm the notice block and the missing log event (`.skilled/bin/skilled-loop`). Verify: `sed -n '1469,1472p' .skilled/bin/skilled-loop` prints the comparison and the note, and `rg -c 'wrapper-changed' .skilled/bin/skilled-loop .skilled/hooks/session-relaunch/lib .skilled/hooks/session-relaunch/bin .skilled/hooks/session-relaunch/tests` prints nothing with exit 1. Observed 2026-11-14: the comparison and the note printed, and the search exited 1 with no output.
- [x] T003 Confirm how the wrapper calls the core and that `appendLog` is exported (`RL/lib/relaunch-core.cjs`). Verify: `rg -c -- '-- "\$relaunch_core"' .skilled/bin/skilled-loop` prints 5, and `node -e 'console.log(typeof require("./.skilled/hooks/session-relaunch/lib/relaunch-core.cjs").appendLog)'` prints `function`. Observed: the count printed 5 and the probe printed `function`.

<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add the test that reads `relaunch.log` after a hop under a changed wrapper (`RL/tests/skilled-loop-wrapper-launch-arguments.test.cjs`). Verify: the red run saved in `PHASE/scratch/red.txt` prints `✖ a hop logs wrapper-changed when the wrapper file changed after the loop started`. Observed: `scratch/red.txt:7` prints that `✖` line before the source edit.
- [x] T005 Add a stub option that makes the wrapper copy unreadable on the first runtime invocation, beside `WRAPPER_APPEND_ON_INVOCATION` (`RL/tests/skilled-loop-wrapper-harness.cjs`). Verify: `node --check .skilled/hooks/session-relaunch/tests/skilled-loop-wrapper-harness.cjs` exits 0, and the existing test `a hop says so when the wrapper file changed after the loop started` still passes. Observed: `node --check` exited 0 (`scratch/red.txt:2`), and that existing test printed `✔` at `scratch/red.txt:6` and `scratch/green.txt:2`.
- [x] T006 Add the test for a wrapper file that cannot be read at the hop (`RL/tests/skilled-loop-wrapper-launch-arguments.test.cjs`). Verify: `PHASE/scratch/red.txt` prints `✖ a hop prints and logs nothing when the wrapper file cannot be read`, `ℹ tests 4`, `ℹ pass 2` and `ℹ fail 2`. Observed: `scratch/red.txt:8` prints the `✖` line, with `ℹ tests 4` at `:10`, `ℹ pass 2` at `:12` and `ℹ fail 2` at `:13`.
- [x] T007 Assert in the unchanged-wrapper test that the log holds no `wrapper-changed` line (`RL/tests/skilled-loop-wrapper-launch-arguments.test.cjs`). Verify: `PHASE/scratch/red.txt` prints `✔ a hop prints no change notice when the wrapper file is unchanged`. Observed: that test printed `✔` at `scratch/red.txt:9` with the new log assertion in place, and again at `scratch/green.txt:5`.
- [x] T008 Read the checksum once, skip an empty one and append the log line after the note (`.skilled/bin/skilled-loop`). Verify: `rg -c 'wrapper-changed' .skilled/bin/skilled-loop` prints 1, and `PHASE/scratch/green.txt` prints `ℹ tests 4`, `ℹ pass 4` and `ℹ fail 0`. Observed: the count printed 1, and `scratch/green.txt:6` to `:9` shows `ℹ tests 4`, `ℹ pass 4`, `ℹ fail 0`, with `exit=0` at `:14`.
- [x] T009 Comment why an empty checksum is not a change (`.skilled/bin/skilled-loop`). Verify: `git show FIX -- .skilled/bin/skilled-loop | rg -c '^\+\s*#'` prints 1 or more, and the added comment names no packet, phase or task number. Observed: the working-tree diff adds two comment lines; the commit-scoped count waits on the fix commit, which is the orchestrator's T014. The comment names no packet, phase or task number.
- [x] T010 Name the log line beside the note sentence (`RL/README.md`). Verify: `rg -c 'wrapper-changed' .skilled/hooks/session-relaunch/README.md` prints 1. Observed: the count printed 1.

<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Run the four tests the name pattern selects (`RL/tests/skilled-loop-wrapper-launch-arguments.test.cjs`). Verify: `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test --test-name-pattern='wrapper file' .skilled/hooks/session-relaunch/tests/skilled-loop-wrapper-launch-arguments.test.cjs` exits 0 with `tests 4`, `pass 4` and `fail 0`. Observed: `scratch/green.txt` shows `ℹ tests 4` at `:6`, `ℹ pass 4` at `:8`, `ℹ fail 0` at `:9` and `exit=0` at `:14`.
- [x] T012 Run the relaunch and OpenCode plugin suites (`RL/tests` and `.opencode/plugins/tests`). Verify: `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/*.test.cjs` exits 0 with `fail 0` and a `tests` count two above the one in `PHASE/scratch/baseline.txt`. Observed: `scratch/final-suite.txt` shows `ℹ tests 1550`, `ℹ pass 1550`, `ℹ fail 0` and `exit=0`, two above the 1548 baseline.
- [x] T013 Check the wrapper parses (`.skilled/bin/skilled-loop`). Verify: `bash -n .skilled/bin/skilled-loop` exits 0. Observed: `bash -n` exited 0.
- [x] T014 Check that the fix adds no file and no record key (`FIX`). Verify: `git show --stat FIX` lists four files, and `git show FIX | rg -c '^new file'` prints nothing with exit 1. Observed: commit `94e83013fa` (`Commit-Id` 0013978) lists four files and adds no new file.
- [x] T015 Validate the phase folder (`PHASE`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/012-wrapper-notice-log --strict` prints `RESULT: PASSED`. Observed 2026-11-14: Summary Errors 0, Warnings 0 and `RESULT: PASSED`, exit 0, after `repair-derived.cjs --apply` rewrote the graph metadata.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`: T014 was run by the orchestrator against the fix commit; every task is `[x]`.
- [x] No `[B]` blocked tasks remaining: no task is blocked.
- [x] Manual verification passed: `scratch/red.txt` shows two of the four selected tests failing and `scratch/green.txt` shows 4 of 4: red is tests 4, pass 2, fail 2; green is tests 4, pass 4, fail 0.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
- **The notice this extends**: `../004-wrapper-change-notice/`
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

A blocked task is marked `[B]` with its reason in `goal.md`. A `[B]` on T001 blocks every implementation task, because the count in T012 is read against the baseline.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md: `rg -c '^\| REQ-' spec.md` prints 6: observed 6.
- [x] CHK-002 [P0] Technical approach defined in plan.md: `rg -c '^## 3. ARCHITECTURE' plan.md` prints 1: observed 1.
- [x] CHK-003 [P1] The baseline count is saved before the first edit (T001): `scratch/baseline.txt` was written before any test or source edit.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `bash -n` exits 0 on the wrapper and `node --check` exits 0 on the harness (T013, T005): both observed exit 0.
- [x] CHK-011 [P0] The hop goes ahead in all three rows: each of the three tests asserts two runtime invocations: the changed test, the unreadable test and the unchanged test each assert two launch records, and all pass in `scratch/green.txt`.
- [x] CHK-012 [P1] A failed log write is ignored: `rg -n 'wrapper-changed' -A 2 .skilled/bin/skilled-loop` shows the call ending in `|| true`: observed on the line after the `appendLog` line (`.skilled/bin/skilled-loop:1479`).
- [x] CHK-013 [P1] The log call takes the `node -e ... -- "$relaunch_core"` form of the five existing calls and adds no helper function: the call passes the core path and loop id after `--` and adds no function.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] AC-001 and AC-002 pass with their commands: `scratch/green.txt:3` and `:4` print `✔`, with exit 0.
- [x] CHK-021 [P0] Both new tests failed before the edit (`scratch/red.txt`): `scratch/red.txt:7` and `:8` print `✖`, with `ℹ fail 2`.
- [x] CHK-022 [P1] The existing notice test still prints the stderr note exactly once (`scratch/green.txt`): `scratch/green.txt:2` prints `✔` and that test asserts one notice line.
- [x] CHK-023 [P1] The unchanged-wrapper test asserts an empty match for `wrapper-changed` in the log (T007): the assertion is in the test and it passes.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] The finding class is `instance-only`: the notice block is the one place the wrapper compares its checksum. `rg -n 'wrapper_checksum' .skilled/bin/skilled-loop` prints the definition, the start read and the hop read, and only the hop read compares.
- [x] CHK-FIX-002 [P0] Same-class producer inventory: `rg -n 'wrapper_checksum' .skilled/bin/skilled-loop` prints the definition, the start read and the hop read, and only the hop read compares. Observed at lines 34, 1208 and 1471, with the comparison at 1472.
- [x] CHK-FIX-003 [P0] Consumer inventory: `rg -n 'wrapper-changed' .skilled .opencode` lists the wrapper, the test file and the README and no reader of the log. The search lists the wrapper, the test file and the README only; no log reader matches.
- [x] CHK-FIX-004 [P0] N/A: no security, path, parser or redaction fix. The loop id is passed to `node` as an argument. The loop id reaches `process.argv` and never the script text.
- [x] CHK-FIX-005 [P1] Matrix axes listed in plan.md: the hop-time checksum equal, different or empty, each with a test. The three rows are the unchanged, changed and unreadable tests.
- [x] CHK-FIX-006 [P1] The tests run with `AI_SESSION_CHILD` and `OPENCODE_DB` unset. Every recorded run in `scratch/` starts with `env -u AI_SESSION_CHILD -u OPENCODE_DB`.
- [x] CHK-FIX-007 [P1] Evidence is pinned to the fix commit, named in `goal.md` section 4. The goal log names the tree state `be56fabc7b` this work started from; the fix commit is the orchestrator's to land, and T014 pins the evidence to it.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets: the change reads no credential: the new call reads only the core path and the loop id from `argv`.
- [x] CHK-031 [P0] The loop id reaches `node` through `process.argv` and is never spliced into the script text: the script text is a fixed string and the loop id follows `--`.
- [x] CHK-032 [P1] N/A: no auth surface: no auth code is touched.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] `spec.md`, `plan.md` and `tasks.md` all name the `wrapper-changed` line and the empty checksum: each document describes both, and this one records the runs.
- [x] CHK-041 [P1] The changed block carries a comment on why an empty checksum is not a change, with no packet, phase or task number in it (T009): the two comment lines name only the cause.
- [x] CHK-042 [P2] The session-relaunch README names the log line (T010): `rg -c 'wrapper-changed'` printed 1 for the README.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Test runs live under `scratch/` only: `scratch/baseline.txt`, `scratch/red.txt`, `scratch/green.txt` and `scratch/final-suite.txt` hold every run.
- [x] CHK-051 [P1] No temporary file is left outside `scratch/`: the four changed files are the two sources, the harness and the test; no scratch file sits outside the packet.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 12 | 12/12 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-11-14. Every row above was checked from a recorded run or a searched source. The scaffold listed 13 P1 items; the checklist itself holds 12, and all 12 are verified.
<!-- /ANCHOR:summary -->

---
