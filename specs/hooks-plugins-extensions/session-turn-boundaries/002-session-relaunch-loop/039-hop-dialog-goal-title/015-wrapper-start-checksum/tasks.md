---
title: "Tasks: Phase 15: wrapper-start-checksum"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "wrapper start checksum tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 15: wrapper-start-checksum

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

- [x] T001 Take the suite baseline before any edit (`RL/tests`). Verify: `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/*.test.cjs` exits 0, and its `tests`, `pass` and `fail` lines and the exit status are saved in `PHASE/scratch/baseline.txt`. Observed: the orchestrator took the baseline on this tree (main `99d197475d` plus the plan commit) before the build: `ℹ tests 1550` at `scratch/baseline.txt:1562`, `ℹ pass 1550` at `:1564`, `ℹ fail 0` at `:1565`, exit 0. Not rerun, per the dispatch.
- [x] T002 Confirm the guard tests the hop value only (`.skilled/bin/skilled-loop`). Verify: `rg -n 'started_wrapper_checksum' .skilled/bin/skilled-loop` prints line 1208 and line 1472, and line 1472 holds `-n "$hop_wrapper_checksum"` and no `-n "$started_wrapper_checksum"`. Observed before the edit: the search printed 1208 and 1472, and 1472 held `-n "$hop_wrapper_checksum"` with no start-checksum test.
- [x] T003 Confirm one line calls `cksum` (`.skilled/bin/skilled-loop`). Verify: `rg -c '\bcksum\b' .skilled/bin/skilled-loop` prints 1. Observed: printed 1, exit 0, so the stub reaches only the checksum reads.

<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add the test `a hop prints and logs nothing when the wrapper file could not be read at loop start`. It resolves the real `cksum` with `command -v cksum`, writes a stub into `sandbox.binDir` that exits 1 with no output on its first call and runs the real `cksum` on later calls, and asserts two runtime invocations, no `changed on disk` line and no `wrapper-changed` log line (`RL/tests/skilled-loop-wrapper-launch-arguments.test.cjs`). Verify: `node --check .skilled/hooks/session-relaunch/tests/skilled-loop-wrapper-launch-arguments.test.cjs` exits 0. Observed: `node --check` exited 0 and the test begins at `.skilled/hooks/session-relaunch/tests/skilled-loop-wrapper-launch-arguments.test.cjs:357`.
- [x] T005 Run the red test before the source edit (`PHASE/scratch/red.txt`). Verify: `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test --test-name-pattern='wrapper file' .skilled/hooks/session-relaunch/tests/skilled-loop-wrapper-launch-arguments.test.cjs` exits 1 with `tests 5`, `pass 4` and `fail 1`, and the failing line names the new test with the false note in its message. A red run that passes stops the build, because the stub then did not reach the start read. Observed: `scratch/red.txt` prints `✖` for the new test at `:5`, `ℹ tests 5` at `:7`, `ℹ pass 4` at `:9`, `ℹ fail 1` at `:10` and `exit=1` at `:39`; the assertion message quotes `note: skilled-loop changed on disk after this loop started`, so the stub did reach the start read.
- [x] T006 Require the start checksum in the comparison (`.skilled/bin/skilled-loop`). Verify: `rg -n -o 'if \[\[ -n "\$started_wrapper_checksum" && -n "\$hop_wrapper_checksum"' .skilled/bin/skilled-loop` prints one line. Observed: printed one line at `.skilled/bin/skilled-loop:1473`, with the comparison continuing on `:1474`.
- [x] T007 Rewrite the comment above the comparison so it names both reads (`.skilled/bin/skilled-loop`). Verify: `git diff -- .skilled/bin/skilled-loop` shows the changed comment lines and the changed condition only, and no added line names a packet, phase, task or finding number. Observed: the diff shows the three-line comment at `:1469` to `:1471` and the condition at `:1473` to `:1474`, nothing else, and no added line carries such a number.
- [x] T008 Check the README sentence on an empty checksum against the fixed block (`RL/README.md`). Verify: `rg -n -o 'A checksum that comes back empty[^.]*' .skilled/hooks/session-relaunch/README.md` prints line 112 and the sentence reads true for an empty read at loop start and at the hop. Edit it only if it does not, and record the result in `goal.md`. Observed: printed `112:A checksum that comes back empty, because a checkout replaced the file for a moment, is not a change and prints and logs nothing`. The fixed block treats an empty read on either side as unknown and silent, so the sentence is true; no edit was made and `goal.md` records it.

<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Run the five tests the name pattern selects (`RL/tests/skilled-loop-wrapper-launch-arguments.test.cjs`). Verify: the command of T005 exits 0 with `tests 5`, `pass 5` and `fail 0`, saved to `PHASE/scratch/green.txt`. Observed: `scratch/green.txt` prints `✔` for all five at `:2` to `:6`, `ℹ tests 5` at `:7`, `ℹ pass 5` at `:9`, `ℹ fail 0` at `:10` and `exit=0` at `:15`.
- [x] T010 Run the relaunch and OpenCode plugin suites (`RL/tests` and `.opencode/plugins/tests`). Verify: the command of T001 exits 0 with `fail 0` and a `tests` count one above the one in `PHASE/scratch/baseline.txt`, saved to `PHASE/scratch/final-suite.txt`. Observed: `scratch/final-suite.txt` prints `ℹ tests 1551` at `:1564`, `ℹ pass 1551` at `:1566`, `ℹ fail 0` at `:1567` and `exit=0` at `:1572`, one above the 1550 baseline.
- [x] T011 Check the wrapper parses (`.skilled/bin/skilled-loop`). Verify: `bash -n .skilled/bin/skilled-loop` exits 0. Observed: exited 0.
- [ ] T012 Check that the fix adds no file and no record key (`FIX`). Verify: `git show --stat FIX` lists the wrapper and the test file, plus the README only when T008 changed it, and `git show FIX | rg -c '^new file'` prints nothing with exit 1. Deferred: the orchestrator runs this against the fix commit after committing, per the dispatch. Working-tree evidence: `git diff --stat` lists `.skilled/bin/skilled-loop` and the test file only, both modifications, and adds no file.
- [x] T013 Validate the phase folder (`PHASE`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/015-wrapper-start-checksum --strict` prints `RESULT: PASSED`. Observed 2026-11-14: Errors 0, Warnings 0, `RESULT: PASSED`, exit 0, after `repair-derived.cjs --apply` rewrote the generated metadata.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Every task is resolved: T001 to T011 and T013 are complete, and T012 is deferred to the orchestrator, which runs it against the fix commit after committing.
- [x] No `[B]` blocked tasks remaining: no task is blocked.
- [x] Manual verification passed: `scratch/red.txt` shows the new test failing (tests 5, pass 4, fail 1, exit 1) and `scratch/green.txt` shows 5 of 5 (tests 5, pass 5, fail 0, exit 0).
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
- **The notice and the log line this guards**: `../004-wrapper-change-notice/` and `../012-wrapper-notice-log/`
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

A blocked task is marked `[B]` with its reason in `goal.md`. A `[B]` on T001 blocks every implementation task, because the count in T010 is read against the baseline.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md: `rg -c '^\| REQ-' spec.md` prints 6. Observed 6.
- [x] CHK-002 [P0] Technical approach defined in plan.md: `rg -c '^## 3. ARCHITECTURE' plan.md` prints 1. Observed 1.
- [x] CHK-003 [P1] The baseline count is saved before the first edit (T001). `scratch/baseline.txt` was written by the orchestrator before the test edit, and T001 records its count.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `bash -n` exits 0 on the wrapper and `node --check` exits 0 on the test file (T011, T004): both observed exit 0.
- [x] CHK-011 [P0] The hop goes ahead in every row: each wrapper-file test asserts two runtime invocations. The five selected tests each assert two launch records, and all pass in `scratch/green.txt:2` to `:6`.
- [x] CHK-012 [P1] The change adds no helper function, no variable and no harness option: the wrapper reuses the existing `started_wrapper_checksum` and adds no function, the test's stub and its counter live inside the one new test, and the harness is untouched.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] AC-001 and AC-002 pass with their commands. `scratch/red.txt:5` and `scratch/green.txt:5` bracket the change, and `scratch/green.txt:2` to `:6` prints `✔` for all five selected tests.
- [x] CHK-021 [P0] The new test failed before the edit (`scratch/red.txt`). `scratch/red.txt:5` prints `✖` and `:10` prints `ℹ fail 1`.
- [x] CHK-022 [P1] The changed-file tests still print the note once and log one `wrapper-changed` line (`scratch/green.txt`). `scratch/green.txt:2` and `:3` print `✔` for both, and each asserts one notice and one log line.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] The finding class is `instance-only`: line 1473 is the one place the wrapper compares its checksum. `rg -n 'wrapper_checksum' .skilled/bin/skilled-loop` prints the definition at 34, the start read at 1208 and the hop read at 1472, and only `:1473` compares.
- [x] CHK-FIX-002 [P0] Same-class producer inventory: `rg -n 'wrapper_checksum' .skilled/bin/skilled-loop` prints the definition, the start read and the hop read, and only the hop read compares. Observed at lines 34, 1208 and 1472, with the comparison at 1473.
- [x] CHK-FIX-003 [P0] Consumer inventory: `rg -n 'started_wrapper_checksum' .skilled .opencode` lists the wrapper only. Observed at `.skilled/bin/skilled-loop:1208`, `:1473` and `:1474`; no other file matches.
- [x] CHK-FIX-004 [P0] N/A: no security, path, parser or redaction fix. The invariant is that a change is reported only when both checksums were read and differ: the condition now tests both values before it compares them.
- [x] CHK-FIX-005 [P1] Matrix axes listed in plan.md: start read crossed with hop read, with the row each test covers. Plan section FIX ADDENDUM lists the six rows; the new test pins the empty start read with a hop read that succeeds.
- [x] CHK-FIX-006 [P1] The tests run with `AI_SESSION_CHILD` and `OPENCODE_DB` unset. Every recorded run in `scratch/red.txt`, `scratch/green.txt` and `scratch/final-suite.txt` starts with `env -u AI_SESSION_CHILD -u OPENCODE_DB`.
- [x] CHK-FIX-007 [P1] Evidence is pinned to the fix commit, named in `goal.md` section 4. The goal log names the tree state this work started from; the fix commit is the orchestrator's to land, and T012 pins the commit-scoped evidence to it.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets: the change reads no credential. The block reads the wrapper file and the loop id only.
- [x] CHK-031 [P0] The `cksum` stub is written only inside the test sandbox and removed with it. It lands in `sandbox.binDir`, and `createSandbox` removes the whole root on teardown.
- [x] CHK-032 [P1] N/A: no auth surface. No auth code is touched.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] `spec.md`, `plan.md` and `tasks.md` all name the empty start read and the stub. Each document describes both, and this one records the runs.
- [x] CHK-041 [P1] The changed comment says why an empty read on either side is not a change, with no packet, phase or task number in it (T007). The three comment lines name only the cause.
- [x] CHK-042 [P2] The README sentence at line 112 is checked against the fixed code (T008). `rg -n -o 'A checksum that comes back empty[^.]*'` printed line 112, and the sentence still holds.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Test runs live under `scratch/` only. `scratch/baseline.txt`, `scratch/red.txt`, `scratch/green.txt` and `scratch/final-suite.txt` hold every run.
- [x] CHK-051 [P1] No temporary file is left outside `scratch/`. The changed files are the wrapper and the test; no scratch file sits outside the packet.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 11 | 11/11 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-11-14. Every row above was checked from a recorded run or a searched source. T012 is the one deferral: it needs the fix commit, which the orchestrator lands after the build.
<!-- /ANCHOR:summary -->

---
