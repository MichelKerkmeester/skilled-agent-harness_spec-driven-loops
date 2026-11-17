---
title: "Tasks: Phase 13: fix-review-findings-in-json-entry-set-restore"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "fix review findings in json entry set restore tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 13: fix-review-findings-in-json-entry-set-restore

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
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

`R` is the worktree root. `P` is this phase's `scratch/dispatch` folder.

- [x] T001 Record the baseline. Verify: `node --test .skilled/commands/doctor/scripts/tests` printed tests 1204, pass 1204, fail 0.
- [x] T002 Prototype all seven fixes and ten tests, then save them to the scratchpad and put `.skilled` back to HEAD. Verify: the prototype printed tests 1214, fail 0, and `git status --short .skilled` printed nothing after the revert.
- [x] T003 Write briefs 01 to 07 and their OLD/NEW pair files (`P`). Verify: applying every engine pair to the original reproduces the prototype engine byte for byte.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Brief 01, eight sync tests (`overlay-engine-sync.test.cjs`). Verify: Luna's check printed tests 49, pass 43, fail 6, and the file matches the prototype byte for byte.
- [x] T005 Brief 02, two re-pin tests (`overlay-engine-repin.test.cjs`). Verify: tests 30, pass 28, fail 2, and the file matches byte for byte.
- [x] T006 Brief 03, the restore helpers (`overlay-engine.cjs`). Verify: `node --check` passes and the file matches the original plus the 03 pair.
- [x] T007 Brief 04, the pinned-copy reader, `onSet`, the re-pin reader and the check before the backup (`overlay-engine.cjs`). Verify: the file matches the original plus pairs 03 and 04.
- [x] T008 Brief 05, the `cannot-apply` state (`overlay-engine.cjs`). Verify: the two test files print tests 79, fail 0, and the engine matches the prototype.
- [x] T009 Brief 06, the overlay reference (`overlays.md`). Verify: the file matches the prototype.
- [x] T010 Brief 07, the command assets (`_routes.yaml`, `assets/doctor-overlay-*`). Verify: each file matches the prototype.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Run the whole doctor test folder. Verify: tests 1214, pass 1214, fail 0.
- [x] T012 Rerun the review's probes p01 to p06 against the built engine. Verify: none shows its finding.
- [x] T013 Run the repository quality gate. Verify: `sk-code-setup-check.cjs` ends `STATUS=OK`.
- [x] T014 Fresh review of the diff. Verify: an Opus review reported 2 P1 and 2 P2 findings, and all 4 reproduced with its probes.
- [x] T015 Prototype the four review fixes with three new tests, and update this phase's three message checks. Verify: the doctor test folder printed tests 1217, pass 1217, fail 0, and the three new tests fail on the round-one engine.
- [x] T016 Brief 09, the tests. Verify: Luna's check printed tests 82, pass 76, fail 6, and the files match the prototype.
- [x] T017 Brief 08, the engine. Verify: tests 82, fail 0, and the engine matches the prototype.
- [x] T018 Brief 10, `overlays.md`. Verify: the file matches the prototype.
- [x] T019 Rerun the whole doctor test folder and the quality gate. Verify: tests 1217, fail 0, and `STATUS=OK`. Printed tests 1217, pass 1217, fail 0, exit 0, and `STATUS=OK legs=9`.
- [x] T020 Second fresh review of the round-two diff. Verify: an Opus review reported 3 P1 and 2 P2 findings, all reproduced. The operator chose to fix the three P1s and document the two P2s.
- [x] T021 Prototype round three with three new tests and two doc limits. Verify: the doctor test folder printed tests 1220, pass 1220, fail 0, and the three new tests fail on the round-two engine.
- [x] T022 Briefs 11 to 13 on Luna. Verify: each file matches prototype 3 byte for byte. All three matched.
- [x] T023 Rerun the whole doctor test folder and the quality gate. Verify: tests 1220, fail 0, and `STATUS=OK`. Printed tests 1220, pass 1220, fail 0, exit 0, and `STATUS=OK legs=9`.
- [x] T024 Short third review of the round-three diff. Verify: no reproduced finding, or each one is fixed or recorded. An Opus review printed APPROVED with no findings and tests 170, pass 170, fail 0 on the overlay test files.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] `validate.sh --strict` on this folder prints `RESULT: PASSED`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Decisions**: See `decision-record.md`
<!-- /ANCHOR:cross-refs -->

---



