---
title: "Tasks: Phase 4: wrapper-change-notice"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "wrapper change notice tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 4: wrapper-change-notice

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

**Task variables**: `W` is `.skilled/bin/skilled-loop`. `RL` is `.skilled/hooks/session-relaunch`. `PHASE` is this phase folder. `FIX` is commit `89e246760e`.

**Test environment**: run the suites as `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test <file>`, because a dispatched child marker and an inherited database path both change how the relaunch tests behave.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm the wrapper held no check of its own file before the change (`W`). Verify: `git show 89e246760e^:.skilled/bin/skilled-loop | rg -n 'cksum|checksum|changed on disk'` prints nothing with exit 1, and `git show 89e246760e^:.skilled/bin/skilled-loop | rg -n '^while true; do'` prints line 1199.
  - **Evidence:** both commands ran on 2026-11-14 with those results. The output is quoted in `spec.md` Measured Behavior.
- [x] T002 Confirm the harness can install a wrapper copy the test may edit (`RL/tests/skilled-loop-wrapper-harness.cjs`). Verify: `rg -n 'installWrapperCopy' .skilled/hooks/session-relaunch/tests/skilled-loop-wrapper-harness.cjs` prints the definition at line 377 and the export at line 611.
  - **Evidence:** `installWrapperCopy` is imported by the new test at `RL/tests/skilled-loop-wrapper-launch-arguments.test.cjs:16`. Its body was not read by this author, so what it copies is taken from the test passing.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Add the harness switch that appends to the wrapper copy while the stub runs (`RL/tests/skilled-loop-wrapper-harness.cjs`). Verify: `rg -n 'WRAPPER_APPEND' .skilled/hooks/session-relaunch/tests/skilled-loop-wrapper-harness.cjs` prints lines 213 and 215.
  - **Evidence:** both lines printed on 2026-11-14. The append runs when the invocation number equals `WRAPPER_APPEND_ON_INVOCATION`, onto `WRAPPER_APPEND_PATH`.
- [x] T004 Add the changed-file test and the unchanged-file test (`RL/tests/skilled-loop-wrapper-launch-arguments.test.cjs`). Verify: `PHASE/scratch/red.txt` prints `tests 2`, `pass 1` and `fail 1`.
  - **Evidence:** `scratch/red.txt:2` shows the changed-file test failing and `scratch/red.txt:3` shows the unchanged-file test passing. The unchanged test guards behaviour that already held, so it could not fail first.
- [x] T005 Add `wrapper_checksum` (`W`). Verify: `rg -n 'wrapper_checksum\(\) \{' .skilled/bin/skilled-loop` prints line 34, and `bash -n .skilled/bin/skilled-loop` exits 0.
  - **Evidence:** line 34 printed and `bash -n` exited 0 on 2026-11-14. The body is `{ cksum < "$script_path"; } 2>/dev/null || true`.
- [x] T006 Take the start checksum before the loop (`W`). Verify: `rg -n 'started_wrapper_checksum=' .skilled/bin/skilled-loop` prints line 1208, which sits before the loop's `while true; do`.
  - **Evidence:** line 1208 printed. The loop's `while true; do` follows it.
- [x] T007 Print the note at the end of the hop branch when the checksum differs (`W`). Verify: `PHASE/scratch/green.txt` prints `✔ a hop says so when the wrapper file changed after the loop started`, and `rg -n 'changed on disk' .skilled/bin/skilled-loop` prints line 1471.
  - **Evidence:** `scratch/green.txt:2` and the line 1471 hit. The note is written with `printf` to stderr and nothing after it stops the hop.
- [x] T008 Describe the note and the restart in the README (`RL/README.md`). Verify: `rg -n 'changed on disk' .skilled/hooks/session-relaunch/README.md` prints line 112.
  - **Evidence:** line 112 printed. The paragraph follows the linking-repository paragraph, as `git show 89e246760e -- .skilled/hooks/session-relaunch/README.md` shows.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Run the two new tests (`RL/tests`). Verify: `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test --test-name-pattern='wrapper file' .skilled/hooks/session-relaunch/tests/skilled-loop-wrapper-launch-arguments.test.cjs` exits 0 with `tests 2`, `pass 2` and `fail 0`.
  - **Evidence:** `scratch/green.txt:4` to `scratch/green.txt:7`. The commit message records the same, 1 of 2 failed before and 2 of 2 after.
- [x] T010 Run the relaunch and OpenCode plugin suites (`RL/tests`). Verify: `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/*.test.cjs` exits 0 with every test passing.
  - **Evidence:** the commit message records 1538 of 1538 on its tree, from 1536 before. This author reran the command at the current branch head on 2026-11-14 and it exited 0 with 1548 of 1548, the extra tests coming from commits made after the change.
- [x] T011 Check that the change adds no file and touches no hook source (`FIX`). Verify: `git show --stat 89e246760e` lists four files with `.skilled/bin/skilled-loop` the only source outside `tests/`, and `git show 89e246760e | rg -c '^new file'` prints nothing.
  - **Evidence:** the stat listed the wrapper, the README, the harness and the wrapper test file. The new-file count printed nothing with exit 1.
- [x] T012 Check the changed sources parse (`W` and `RL/tests`). Verify: `bash -n .skilled/bin/skilled-loop` and `node --check` on the harness and the wrapper test file exit 0 for each.
  - **Evidence:** all three exited 0 on 2026-11-14.
- [x] T013 Validate the phase folder (`PHASE`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/004-wrapper-change-notice --strict` prints `RESULT: PASSED`.
  - **Evidence:** recorded in `goal.md` section 4.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed: `scratch/red.txt` shows one of the two new tests failing and `scratch/green.txt` shows 2 of 2
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
- **The research that asked for this**: `../research/research.md` section 3, section 9 rank 2 and section 11 recommendation 2
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

A blocked task is marked `[B]` with its reason in `goal.md`. A `[B]` on T001 blocks every implementation task.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md: `rg -c '^\| REQ-' spec.md` prints 6
- [x] CHK-002 [P0] Technical approach defined in plan.md, with the rejected alternatives in `implementation-summary.md`
- [x] CHK-003 [P1] The pre-change gap is confirmed from the parent commit (T001)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `bash -n .skilled/bin/skilled-loop` exits 0 (T012)
- [x] CHK-011 [P0] The changed-file test asserts exactly one note line and a second launch record, so the hop is proved to go ahead
- [x] CHK-012 [P1] An unreadable wrapper file does not stop the wrapper, by inspection of `{ cksum < "$script_path"; } 2>/dev/null || true` at `W:35`
- [x] CHK-013 [P1] The two checksums come from the one function, so they cannot be taken differently
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] AC-001 and AC-002 pass with their commands
- [x] CHK-021 [P0] The changed-file test failed before the edit (`scratch/red.txt:2`)
- [x] CHK-022 [P1] An unchanged wrapper prints no note (`scratch/green.txt:3`)
- [x] CHK-023 [P1] Nothing forces the checksum read to fail, so that path is covered by inspection only
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] The finding class is `instance-only`: the wrapper is the one place a running loop's code is held, and it gains the one check.
- [x] CHK-FIX-002 [P0] Same-class producer inventory: `rg -l 'skilled-loop changed on disk' .skilled` prints the wrapper, the README and the wrapper test file, and only the wrapper prints the note.
- [x] CHK-FIX-003 [P0] Consumer inventory: the checksum variables are read only inside the wrapper, and no hook source or record key changed, by T011.
- [x] CHK-FIX-004 [P0] N/A: no security, path, parser or redaction fix. The note text is fixed.
- [x] CHK-FIX-005 [P1] Matrix axes listed in plan.md: the wrapper file unchanged or appended during the first launch.
- [x] CHK-FIX-006 [P1] The suites run with `AI_SESSION_CHILD` and `OPENCODE_DB` unset.
- [x] CHK-FIX-007 [P1] Evidence is pinned to change commit `89e246760e`.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets: the wrapper reads its own file and no credential
- [x] CHK-031 [P0] The note text is a fixed literal and carries no value from a file or the environment
- [x] CHK-032 [P1] N/A: no auth surface
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] `spec.md`, `plan.md` and `tasks.md` all name `wrapper_checksum` and `started_wrapper_checksum`
- [x] CHK-041 [P1] The wrapper carries a comment on each addition that says why, and the comments hold no packet label
- [x] CHK-042 [P2] The session-relaunch README describes the note and the restart (T008)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Test runs live under `scratch/` only
- [x] CHK-051 [P1] No temporary file was left outside `scratch/`
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-11-14
<!-- /ANCHOR:summary -->

---
