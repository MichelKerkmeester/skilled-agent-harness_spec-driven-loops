---
title: "Tasks: Phase 12: fix-barter-022-handover-items-for-doctor-scripts"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "fix barter 022 handover items for doctor scripts tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 12: fix-barter-022-handover-items-for-doctor-scripts

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

`S` is `.skilled/commands/doctor/scripts`. `T` is `.skilled/commands/doctor/scripts/tests`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
<!-- FILL: Replace the sample tasks with the real setup steps. Each task names a file and a verify command. GOOD: T001 Confirm `logs/archive/` holds 10 archives. Verify: `ls logs/archive | wc -l` prints 10. WEAK: T001 Set up the project. -->

- [x] T001 Capture the test baseline (`T`). Verify: `node --test T` prints `fail 0` and the pass count is written to `goal.md` section 4. Evidence: the orchestrator's whole-folder run on HEAD printed `tests 1183, pass 1183, fail 0`. The three target files printed 83/83, 17/17 and 26/26. Recorded here and in `implementation-summary.md`, not in `goal.md`, which this build leaves alone.
- [x] T002 Find the reference that describes `skilled.omitHook`, or name where `skilled.hostHook` will be described (`goal.md`). Verify: `goal.md` section 4 holds the path. Evidence: `rg -ln omitHook . -g '!specs/**'` finds one non-changelog doc, `.skilled/commands/doctor/assets/doctor-git-setup.yaml` line 49. That file is the T010 target.
- [x] T003 Add a test where a live re-pin's regenerate step rewrites a file an overlay owns (`T/overlay-engine-repin.test.cjs`). Verify: the test fails, and the line the engine prints today is written to `goal.md` section 4. Evidence: the new test failed on HEAD. The engine printed `upstream-moved .skilled/skills/hub/SKILL.md  (overlay: skilled-overlays/files/SKILL.md)  fix: resolve ...` and `RESULT: FAILED`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
<!-- FILL: Write one implementation task per file change. Add a `Verify:` line with the command and its expected output. GOOD: T002 Add the `--keep <n>` branch. Verify: `--keep 3` leaves 3 archives. WEAK: T002 Implement the feature. -->

- [x] T004 Add failing tests for a listed host hook, an unlisted one and a value in global scope (`T/git-setup-check.test.cjs`). Verify: `node --test T/git-setup-check.test.cjs` prints `fail 1`, on the listed host hook. Evidence: vibe brief 01, then `node --test T/git-setup-check.test.cjs` printed `tests 86, pass 85, fail 1`, the failing test being the listed host hook.
- [x] T005 Read `skilled.hostHook` in `checkHooks` and note each hook it passes (`S/git-setup-check.cjs`). Verify: `node --test T/git-setup-check.test.cjs` prints `fail 0`. Evidence: vibe brief 02, then the same command printed `tests 86, pass 86, fail 0`.
- [x] T006 Add failing tests for an adopt under `repin.exclude`, with and without an overlay source (`T/overlay-engine-strict-writes.test.cjs`). Verify: the test with a source fails and the test without one passes. Evidence: vibe brief 03, then `node --test T/overlay-engine-strict-writes.test.cjs` printed `tests 19, pass 17, fail 2`. Both new tests failed, because the no-source test also asserts the new refusal text.
- [x] T007 Accept an excluded path with an overlay source in `adoptUnderLock` (`S/overlay-engine.cjs`). Verify: `node --test T/overlay-engine-strict-writes.test.cjs` prints `fail 0`. Evidence: vibe brief 04, then the same command printed `tests 19, pass 19, fail 0`.
- [x] T008 Name the regenerate step in the problem line for a file it rewrote (`S/overlay-engine.cjs`). Verify: `node --test T/overlay-engine-repin.test.cjs` prints `fail 0`, with T003's test in the count. Evidence: vibe brief 05 printed `tests 27, pass 26, fail 1`. After vibe brief 06, `node --test T/overlay-engine-repin.test.cjs` printed `tests 27, pass 27, fail 0`.
- [x] T009 Describe the adopt rule and the new problem line (`.skilled/skills/system-skilled-doctor/references/overlays.md`). Verify: `rg -n 'repin.exclude' .skilled/skills/system-skilled-doctor/references/overlays.md` prints the adopt paragraph. Evidence: vibe brief 07. `rg -n 'only from its copy in the overlay folder|regenerated <path>'` on the reference printed lines 155 and 210.
- [x] T010 Describe `skilled.hostHook` (the path T002 recorded). Verify: `rg -n 'hostHook' <that path>` prints one line. Evidence: vibe brief 08. `rg -c 'skilled.hostHook'` on `doctor-git-setup.yaml` printed 1, and `yaml.safe_load` printed `yaml ok`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
<!-- FILL: Write one verification task per requirement. Each one runs a command. GOOD: T003 Run both invocations. Verify: `ls logs/archive | wc -l` prints 3 and 10. WEAK: T003 Test everything. -->

- [x] T011 Run the whole doctor script test folder (`T`). Verify: `node --test T` prints `fail 0` and a pass count above T001's. Evidence: `node --test T` printed `tests 1191, pass 1191, fail 0`, exit 0. Six of the eight new tests are this packet's.
- [x] T012 Run the sk-code setup check (`.skilled/skills/sk-code`). Verify: `sk-code-setup-check.cjs` ends `STATUS=OK legs=9`. Evidence: `node .skilled/commands/doctor/scripts/sk-code-setup-check.cjs` ended `STATUS=OK legs=9`, exit 0.
- [x] T013 Write what the vendoring project changes: the config value, the hand-written entries it may adopt (`handover-to-barter.md`). Verify: `rg -c 'hostHook' handover-to-barter.md` prints a number above 0. Evidence: `handover-to-barter.md` names `skilled.hostHook` and the adopt steps. `rg -c hostHook handover-to-barter.md` printed 7.
- [x] T014 Validate the packet (`spec.md`). Verify: `validate.sh <this folder> --strict --quiet` prints `RESULT: PASSED`. Evidence: `RESULT: PASSED (errors=0 warnings=2)` on 2026-11-16.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
<!-- FILL: Keep the three completion lines and add the one artifact that proves the phase is done. GOOD: `--keep 3` leaves 3 archives and the suite passes. WEAK: Work is complete. -->

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
- [x] `handover-to-barter.md` exists in this folder
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
<!-- FILL: Name the spec and plan files. Add the decision record when the packet has one. GOOD: Specification: `spec.md`. Plan: `plan.md`. WEAK: See the other docs. -->

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---



