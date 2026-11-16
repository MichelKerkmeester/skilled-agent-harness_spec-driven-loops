---
title: "Tasks: Phase 11: restore-pinned-value-when-json-entry-set-leaves-overlay"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "restore pinned value when json entry set leaves overlay tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 11: restore-pinned-value-when-json-entry-set-leaves-overlay

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation
<!-- FILL: Keep the prefix table and add the two shell variables this task list uses. GOOD: `R` is `scripts/rotate-logs.sh`. `A` is `logs/archive/`. WEAK: Variables are defined below. -->

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

`E` is `.skilled/commands/doctor/scripts/overlay-engine.cjs`. `T` is `.skilled/commands/doctor/scripts/tests`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
<!-- FILL: Replace the sample tasks with the real setup steps. Each task names a file and a verify command. GOOD: T001 Confirm `logs/archive/` holds 10 archives. Verify: `ls logs/archive | wc -l` prints 10. WEAK: T001 Set up the project. -->

- [x] T001 Capture the test baseline (`T`). Verify: `node --test T` prints `pass 1175` and `fail 0`. Evidence: 2026-11-16, `pass 1175`, `fail 0`.
- [x] T002 Add a test that applies a `set`, applies again without it and expects the pin's value (`T/overlay-engine-sync.test.cjs`). Verify: `node --test T/overlay-engine-sync.test.cjs` prints `fail 1`, on the new test. Evidence: run 01, `pass 21`, `fail 1`, on the new test.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
<!-- FILL: Write one implementation task per file change. Add a `Verify:` line with the command and its expected output. GOOD: T002 Add the `--keep <n>` branch. Verify: `--keep 3` leaves 3 archives. WEAK: T002 Implement the feature. -->

- [x] T003 Report each applied `set` through an `onSet` callback, with its path, its value and whether the key was added (`E`). Verify: `rg -n 'onSet' E` prints the call in `planOperation` and the collector in `planJsonOverlay`. Evidence: runs 02 and 03. `rg -n 'onSet' E` prints the report in `planOperation` and the collector in `planJsonOverlay`.
- [x] T004 Read and write the `sets` key in `loadState`, `writeStateIfChanged`, the state `apply` builds and the state a capture passes through (`E`). Verify: `git stash` of the change then `apply` on a state file that carries `sets` exits 0, and `rg -n 'sets' E` prints all four places. Evidence: run 04. The engine at `5e6589083e1` ran `apply` on a state file that carries `sets` and exited 0 with `0 changed`.
- [x] T005 Add `restoreDroppedSets` and call it in `applyJsonOperations` before the entry set runs (`E`). Verify: `node --test T/overlay-engine-sync.test.cjs` prints `fail 0`. Evidence: run 05, `pass 22`, `fail 0`.
- [x] T006 Add tests for the deleted key, the refused edit, the changed value, the older state file and a restore across a changed pin (`T/overlay-engine-sync.test.cjs`). Verify: each new test fails with T005 reverted and passes with it applied. Evidence: run 06, `pass 29`, `fail 0`. Against an engine without T005, six of the eight new tests fail. The changed-value test needs the record and not the restore, and the older-state test is a guard that passes on every engine.
- [x] T007 Describe the `sets` record in the paragraph that names `links` and `items` (`.skilled/skills/system-skilled-doctor/references/overlays.md`). Verify: `rg -n 'sets' .skilled/skills/system-skilled-doctor/references/overlays.md` prints that paragraph. Evidence: run 07. `rg -c 'sets'` prints 1, the paragraph that names `links` and `items`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
<!-- FILL: Write one verification task per requirement. Each one runs a command. GOOD: T003 Run both invocations. Verify: `ls logs/archive | wc -l` prints 3 and 10. WEAK: T003 Test everything. -->

- [x] T008 Run the whole engine test folder (`T`). Verify: `node --test T` prints `fail 0` and a pass count above 1175. Evidence: `tests 1183`, `pass 1183`, `fail 0`.
- [x] T009 Run the sk-code setup check (`.skilled/skills/sk-code`). Verify: `sk-code-setup-check.cjs` ends `STATUS=OK legs=9`. Evidence: `STATUS=OK legs=9`, exit 0.
- [x] T010 Write what the vendoring project removes, and after which `apply` (`handover-to-barter.md`). Verify: `rg -c 'set' handover-to-barter.md` prints a number above 0. Evidence: `handover-to-barter.md` is in this folder.
- [x] T011 Validate the packet (`spec.md`). Verify: `validate.sh <this folder> --strict --quiet` prints `RESULT: PASSED`. Evidence: `RESULT: PASSED (errors=0 warnings=2)`. Both warnings are about `decision-record.md` and were there before the build.
- [x] T012 Review the engine change with a fresh session and reproduce what it finds (`E`). Verify: the review file lists its findings and a script reproduces each one acted on. Evidence: a Fable 5.2 review of `cb31e584730` listed nine findings. Findings 1 to 5 were reproduced on the function.
- [x] T013 Add six tests for the review fix (`T/overlay-engine-sync.test.cjs`). Verify: `node --test T/overlay-engine-sync.test.cjs` prints `fail 3`, on three of the new tests. Evidence: run 08, `pass 32`, `fail 3`.
- [x] T014 Refuse a restore through an array index when the arrays do not line up with the pin (`E`). Verify: the same file prints `fail 2`. Evidence: run 09, `pass 33`, `fail 2`.
- [x] T015 Delete a key the pin does not hold while it carries the recorded value, whatever the `added` flag says (`E`). Verify: the same file prints `fail 1`. Evidence: run 10, `pass 34`, `fail 1`.
- [x] T016 Keep one record per path when two `set` operations name it (`E`). Verify: the same file prints `fail 0`. Evidence: run 11, `pass 35`, `fail 0`.
- [x] T017 Correct the `sets` sentences in the reference (`.skilled/skills/system-skilled-doctor/references/overlays.md`). Verify: `rg -c 'restore the value by hand'` on that file prints 1. Evidence: run 12, the count is 1 and the file equals the text the brief gave.
- [x] T018 Add a test that runs a whole re-pin after a `set` left the entry set (`.skilled/commands/doctor/scripts/tests/overlay-engine-repin.test.cjs`). Verify: `node --test` on that file prints `fail 0` with one more test. Evidence: run 13, `export.json` records `exit_code` 0 and `outcome` `finished`, the file equals the text the brief gave, and my rerun printed `tests 28`, `pass 28`, `fail 0`. On a scratch copy with the engine from before this phase the same test printed `fail 1`.
- [x] T019 Add three failing tests from the second review: a string array index, an index past the end of the array and two records for one path in an older state file (`overlay-engine-sync.test.cjs`). Verify: the file prints `pass 35`, `fail 3`. Evidence: run 14, `exit_code` 0, `outcome` `finished`, bytes matched, my rerun printed `pass 35`, `fail 3`.
- [x] T020 Read an index from the document and not from the step's type, refuse a path that no longer resolves through an array, clear once the array equals the pin's and read one record per path (`overlay-engine.cjs`). Verify: the same file prints `fail 0`. Evidence: run 15, `exit_code` 0, `outcome` `finished`, bytes matched, my rerun printed `tests 38`, `pass 38`, `fail 0`. The whole folder printed `tests 1201`, `pass 1201`, `fail 0`.
- [x] T021 Correct the array sentences in the reference (`overlays.md`). Verify: `rg -c 'however the entry set spells it'` on that file prints 1. Evidence: run 16, bytes matched, the count is 1.
- [x] T022 Let a key that is gone leave quietly once the array indexes line up, after the recheck showed safe cases refused (`overlay-engine.cjs`, tests first). Verify: the sync test file prints `fail 0`. Evidence: runs 17 to 19, each `exit_code` 0, `outcome` `finished`, bytes matched. My reruns printed `pass 38`, `fail 2` after the tests and `tests 40`, `pass 40`, `fail 0` after the engine.
- [x] T023 Make the check after the write read the set records the run keeps, after two rechecks showed an `apply` that wrote the file and then exited 1 (`overlay-engine.cjs`, tests first). Verify: the sync test file prints `fail 0` and the whole folder prints `fail 0`. Evidence: runs 20 to 22, each `exit_code` 0, `outcome` `finished`, bytes matched. My reruns printed `pass 39`, `fail 2` after the tests, `tests 41`, `pass 41`, `fail 0` after the engine and `tests 1204`, `pass 1204`, `fail 0` for the folder. One test from run 17 was rewritten in run 20, because the case it refused now ends clean.
- [x] T024 Correct the sentence on how a refused array path clears (`overlays.md`). Verify: `rg -c 'then add the operations back'` on that file prints 1. Evidence: run 23, bytes matched, the count is 1.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
<!-- FILL: Keep the three completion lines and add the one artifact that proves the phase is done. GOOD: `--keep 3` leaves 3 archives and the suite passes. WEAK: Work is complete. -->

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
- [x] `scratch/repro-removed-set.cjs`, run with a recorded `set`, prints the pin's value after the removal
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
<!-- FILL: Name the spec and plan files. Add the decision record when the packet has one. GOOD: Specification: `spec.md`. Plan: `plan.md`. WEAK: See the other docs. -->

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---



