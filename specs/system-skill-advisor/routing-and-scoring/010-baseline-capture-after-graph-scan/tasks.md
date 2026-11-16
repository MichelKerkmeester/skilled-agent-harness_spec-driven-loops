---
title: "Tasks: Find why a command routing baseline capture run straight after a skill graph scan reads the state from before the scan"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "baseline capture after graph scan tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Find why a command routing baseline capture run straight after a skill graph scan reads the state from before the scan

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

`C` is `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/capture-command-routing-baseline.mjs`. `S` is `scratch` in this folder.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
<!-- FILL: Replace the sample tasks with the real setup steps. Each task names a file and a verify command. GOOD: T001 Confirm `logs/archive/` holds 10 archives. Verify: `ls logs/archive | wc -l` prints 10. WEAK: T001 Set up the project. -->

- [x] T001 Write the reproduction: the scan and the capture in one command, a second capture a minute later, one result line (`S/repro-capture-after-scan.sh`). Verify: one run appends one line to `S/repro-results.txt` that reads `same` or `differs <row id>`. Evidence: one dry run appended one line to a scratch results file (`run=1 mode=flip ... result=same`). The script runs against a private copy of the tree and refuses a git checkout.
- [x] T002 Run it ten times. Before five of the scans, flip one intent keyword that decides a baseline row and run `generate-router-intent-signals.cjs --write`, then restore both afterwards (`S/repro-results.txt`). Verify: `wc -l S/repro-results.txt` prints 10 or more, and `git status --short` prints nothing afterwards. Evidence: `wc -l scratch/repro-results.txt` printed 10. Runs 2, 4, 6, 7 and 9 removed `"the stylesheet"` from sk-code's `ROUTER.md` and ran `generate-router-intent-signals.cjs --write`, which moves `cmd-design-extract-plain-holdout-01` from sk-code to sk-doc. Runs 1, 3, 4, 7 and 10 started a fresh daemon. All ten printed `result=same`. The runs used a private copy, so they never touched the checkout. Its `git status --short` cannot print nothing, because other builders work in it.
- [x] T003 On a differing run, hash every input the capture reads at both moments (`S/inputs-at-capture.txt`). Verify: the file names the input whose hash changed, or says every input held the same hash. Evidence: no run differed, so the hashes were taken on every run instead. `scratch/inputs-at-capture.txt` lists 344 traced inputs plus the generation file at five moments per run. For all ten runs it prints `the wait changed: nothing` and `capture 2 changed: nothing`. Only the scan's generation file changed after the regenerate step.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
<!-- FILL: Write one implementation task per file change. Add a `Verify:` line with the command and its expected output. GOOD: T002 Add the `--keep <n>` branch. Verify: `--keep 3` leaves 3 archives. WEAK: T002 Implement the feature. -->

- [x] T004 Name the cause with the command that shows it, or record that ten runs printed `same` (`goal.md`). Verify: `rg -n 'Cause:|Not reproduced:' goal.md` prints one line. Evidence: the outcome row in goal.md section 4 reads `Not reproduced:`. `rg -n 'Cause:|Not reproduced:' goal.md` prints two lines, not one: line 59 is the completion criterion matching its own text, and line 81 is the outcome.
- [x] T005 Only when T004 names a cause in this repository: add a test that fails on it (the advisor's vitest suite). Verify: the suite prints one failure, on the new test. Skipped: T004 named no cause.
- [x] T006 Only when T004 names a cause in this repository: fix it where the stale value is produced (the file T004 names). Verify: the new test passes and `S/repro-capture-after-scan.sh` prints `same` in ten runs. Skipped: T004 named no cause.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
<!-- FILL: Write one verification task per requirement. Each one runs a command. GOOD: T003 Run both invocations. Verify: `ls logs/archive | wc -l` prints 3 and 10. WEAK: T003 Test everything. -->

- [x] T007 Only when T006 ran: run the advisor's whole vitest suite (`.skilled/skills/system-skill-advisor/runtime`). Verify: the suite's summary prints 0 failed. Skipped: T006 did not run. The whole suite was run once for T009: `Tests 9 failed | 1705 passed | 8 skipped (1722)`, all nine in five files this packet did not touch. Rerun alone they printed `4 failed | 7 passed (11)`. No whole-suite count from HEAD exists, so calling them not ours is inference. See implementation-summary.md.
- [x] T008 Tell the vendoring project the result, and what to record at the next occurrence when it was not reproduced (`handover-to-barter.md`). Verify: `ls handover-to-barter.md` prints the path. Evidence: `ls handover-to-barter.md` prints the path.
- [x] T009 Add a failing test for a host's captured values, then build the chosen form (`.skilled/skills/system-skill-advisor/runtime/tests/command-routing-slice.vitest.ts`). Verify: the new test fails first, then the suite's summary prints 0 failed. Evidence: brief 01 made the two new tests fail with `ReferenceError: capturePath is not defined` (`Tests 2 failed | 4 passed (6)`). After briefs 02 and 03 the two fixture tests print `Tests 15 passed (15)`. `scratch/host-capture-check.sh` on a private copy printed 15 passed with upstream vocabulary, `2 failed | 13 passed` with a host vocabulary and no host capture, 15 passed with host capture files, and `2 failed | 13 passed` against the host files after a later vocabulary change.
- [x] T010 Validate the packet (`spec.md`). Verify: `validate.sh <this folder> --strict --quiet` prints `RESULT: PASSED`. Evidence: `RESULT: PASSED (errors=0 warnings=1)` on 2026-11-16.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
<!-- FILL: Keep the three completion lines and add the one artifact that proves the phase is done. GOOD: `--keep 3` leaves 3 archives and the suite passes. WEAK: Work is complete. -->

- [x] All tasks marked `[x]`, or marked skipped with the T004 outcome that skips them
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
- [x] `S/repro-results.txt` holds ten result lines or more
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
<!-- FILL: Name the spec and plan files. Add the decision record when the packet has one. GOOD: Specification: `spec.md`. Plan: `plan.md`. WEAK: See the other docs. -->

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---



