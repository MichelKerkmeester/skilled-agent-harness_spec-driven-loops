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

- [ ] T001 Write the reproduction: the scan and the capture in one command, a second capture a minute later, one result line (`S/repro-capture-after-scan.sh`). Verify: one run appends one line to `S/repro-results.txt` that reads `same` or `differs <row id>`.
- [ ] T002 Run it ten times. Before five of the scans, flip one intent keyword that decides a baseline row and run `generate-router-intent-signals.cjs --write`, then restore both afterwards (`S/repro-results.txt`). Verify: `wc -l S/repro-results.txt` prints 10 or more, and `git status --short` prints nothing afterwards.
- [ ] T003 On a differing run, hash every input the capture reads at both moments (`S/inputs-at-capture.txt`). Verify: the file names the input whose hash changed, or says every input held the same hash.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
<!-- FILL: Write one implementation task per file change. Add a `Verify:` line with the command and its expected output. GOOD: T002 Add the `--keep <n>` branch. Verify: `--keep 3` leaves 3 archives. WEAK: T002 Implement the feature. -->

- [ ] T004 Name the cause with the command that shows it, or record that ten runs printed `same` (`goal.md`). Verify: `rg -n 'Cause:|Not reproduced:' goal.md` prints one line.
- [ ] T005 Only when T004 names a cause in this repository: add a test that fails on it (the advisor's vitest suite). Verify: the suite prints one failure, on the new test.
- [ ] T006 Only when T004 names a cause in this repository: fix it where the stale value is produced (the file T004 names). Verify: the new test passes and `S/repro-capture-after-scan.sh` prints `same` in ten runs.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
<!-- FILL: Write one verification task per requirement. Each one runs a command. GOOD: T003 Run both invocations. Verify: `ls logs/archive | wc -l` prints 3 and 10. WEAK: T003 Test everything. -->

- [ ] T007 Only when T006 ran: run the advisor's whole vitest suite (`.skilled/skills/system-skill-advisor/runtime`). Verify: the suite's summary prints 0 failed.
- [ ] T008 Tell the vendoring project the result, and what to record at the next occurrence when it was not reproduced (`handover-to-barter.md`). Verify: `ls handover-to-barter.md` prints the path.
- [ ] T009 Add a failing test for a host's captured values, then build the chosen form (`.skilled/skills/system-skill-advisor/runtime/tests/command-routing-slice.vitest.ts`). Verify: the new test fails first, then the suite's summary prints 0 failed.
- [ ] T010 Validate the packet (`spec.md`). Verify: `validate.sh <this folder> --strict --quiet` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
<!-- FILL: Keep the three completion lines and add the one artifact that proves the phase is done. GOOD: `--keep 3` leaves 3 archives and the suite passes. WEAK: Work is complete. -->

- [ ] All tasks marked `[x]`, or marked skipped with the T004 outcome that skips them
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] `S/repro-results.txt` holds ten result lines or more
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
<!-- FILL: Name the spec and plan files. Add the decision record when the packet has one. GOOD: Specification: `spec.md`. Plan: `plan.md`. WEAK: See the other docs. -->

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---



