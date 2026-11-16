---
title: "Tasks: Add the Mistral Vibe and DSH runtimes to the doctor link manifest and its runtime lists"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "symlink vibe and dsh runtimes tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Add the Mistral Vibe and DSH runtimes to the doctor link manifest and its runtime lists

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

`D` is `.skilled/commands/doctor`. `T` is `.skilled/commands/doctor/scripts/tests`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
<!-- FILL: Replace the sample tasks with the real setup steps. Each task names a file and a verify command. GOOD: T001 Confirm `logs/archive/` holds 10 archives. Verify: `ls logs/archive | wc -l` prints 10. WEAK: T001 Set up the project. -->

- [ ] T001 Capture the test baseline (`T`). Verify: `node --test T` prints `fail 0`, and the pass count is written to `goal.md` section 4.
- [ ] T002 Read `.vibe` and `.dsh` for a file that must stay per project (`goal.md`). Verify: `goal.md` section 4 lists each file found, or says none.
- [ ] T003 Add one failing test per runtime that links its folder into a fixture (`T/symlink-engine.test.cjs`). Verify: `node --test T/symlink-engine.test.cjs` prints `fail 2`, on the new tests.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
<!-- FILL: Write one implementation task per file change. Add a `Verify:` line with the command and its expected output. GOOD: T002 Add the `--keep <n>` branch. Verify: `--keep 3` leaves 3 archives. WEAK: T002 Implement the feature. -->

- [ ] T004 Add the `vibe` and `dsh` entries (`D/assets/symlink-manifest.json`). Verify: `node --test T/symlink-engine.test.cjs` prints `fail 0`.
- [ ] T005 Name both runtimes in the `--runtimes` rows (`D/symlink.md`, `D/install.md`). Verify: `rg -c 'vibe' D/symlink.md D/install.md` prints a count for each file.
- [ ] T006 Name both runtimes in the four assets (`D/assets/doctor-symlink-link.yaml`, `D/assets/doctor-symlink-check.yaml`, `D/assets/doctor-install.yaml`, `D/assets/doctor-install-presentation.txt`). Verify: `rg -c 'vibe' D/assets` prints a count for each of the four.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
<!-- FILL: Write one verification task per requirement. Each one runs a command. GOOD: T003 Run both invocations. Verify: `ls logs/archive | wc -l` prints 3 and 10. WEAK: T003 Test everything. -->

- [ ] T007 Run the doctor script tests (`T`). Verify: `node --test T` prints `fail 0` and a pass count two above T001's.
- [ ] T008 Link a scratch project with `--runtimes vibe,dsh` and start one session per runtime that is installed (`goal.md`). Verify: `goal.md` section 4 says which runtime was tried and what it loaded, or that it was not installed.
- [ ] T009 Validate the packet (`spec.md`). Verify: `validate.sh <this folder> --strict --quiet` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
<!-- FILL: Keep the three completion lines and add the one artifact that proves the phase is done. GOOD: `--keep 3` leaves 3 archives and the suite passes. WEAK: Work is complete. -->

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] `symlink-engine.cjs check --runtimes vibe,dsh` prints no `unknown runtime` line
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
<!-- FILL: Name the spec and plan files. Add the decision record when the packet has one. GOOD: Specification: `spec.md`. Plan: `plan.md`. WEAK: See the other docs. -->

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---



