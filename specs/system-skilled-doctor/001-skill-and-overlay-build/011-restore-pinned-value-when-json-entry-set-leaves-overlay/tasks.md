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

- [ ] T001 Capture the test baseline (`T`). Verify: `node --test T` prints `pass 1175` and `fail 0`.
- [ ] T002 Add a test that applies a `set`, applies again without it and expects the pin's value (`T/overlay-engine-sync.test.cjs`). Verify: `node --test T/overlay-engine-sync.test.cjs` prints `fail 1`, on the new test.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
<!-- FILL: Write one implementation task per file change. Add a `Verify:` line with the command and its expected output. GOOD: T002 Add the `--keep <n>` branch. Verify: `--keep 3` leaves 3 archives. WEAK: T002 Implement the feature. -->

- [ ] T003 Report each applied `set` through an `onSet` callback, with its path, its value and whether the key was added (`E`). Verify: `rg -n 'onSet' E` prints the call in `planOperation` and the collector in `planJsonOverlay`.
- [ ] T004 Read and write the `sets` key in `loadState`, `writeStateIfChanged`, the state `apply` builds and the state a capture passes through (`E`). Verify: `git stash` of the change then `apply` on a state file that carries `sets` exits 0, and `rg -n 'sets' E` prints all four places.
- [ ] T005 Add `restoreDroppedSets` and call it in `applyJsonOperations` before the entry set runs (`E`). Verify: `node --test T/overlay-engine-sync.test.cjs` prints `fail 0`.
- [ ] T006 Add tests for the deleted key, the refused edit, the changed value, the older state file and a restore across a changed pin (`T/overlay-engine-sync.test.cjs`). Verify: each new test fails with T005 reverted and passes with it applied.
- [ ] T007 Describe the `sets` record in the paragraph that names `links` and `items` (`.skilled/skills/system-skilled-doctor/references/overlays.md`). Verify: `rg -n 'sets' .skilled/skills/system-skilled-doctor/references/overlays.md` prints that paragraph.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
<!-- FILL: Write one verification task per requirement. Each one runs a command. GOOD: T003 Run both invocations. Verify: `ls logs/archive | wc -l` prints 3 and 10. WEAK: T003 Test everything. -->

- [ ] T008 Run the whole engine test folder (`T`). Verify: `node --test T` prints `fail 0` and a pass count above 1175.
- [ ] T009 Run the sk-code setup check (`.skilled/skills/sk-code`). Verify: `sk-code-setup-check.cjs` ends `STATUS=OK legs=9`.
- [ ] T010 Write what the vendoring project removes, and after which `apply` (`handover-to-barter.md`). Verify: `rg -c 'set' handover-to-barter.md` prints a number above 0.
- [ ] T011 Validate the packet (`spec.md`). Verify: `validate.sh <this folder> --strict --quiet` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
<!-- FILL: Keep the three completion lines and add the one artifact that proves the phase is done. GOOD: `--keep 3` leaves 3 archives and the suite passes. WEAK: Work is complete. -->

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] `scratch/repro-removed-set.cjs`, run with a recorded `set`, prints the pin's value after the removal
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
<!-- FILL: Name the spec and plan files. Add the decision record when the packet has one. GOOD: Specification: `spec.md`. Plan: `plan.md`. WEAK: See the other docs. -->

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---



