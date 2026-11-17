---
title: "Tasks: Expansive-depth sub-mode for deep-research and deep-review"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "expansive depth mode tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Expansive-depth sub-mode for deep-research and deep-review

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
<!-- FILL: Replace the sample tasks with the real setup steps. Each task names a file and a verify command. GOOD: T001 Confirm `logs/archive/` holds 10 archives. Verify: `ls logs/archive | wc -l` prints 10. WEAK: T001 Set up the project. -->

- [x] T001 Initialize the research packet (`research/`). Verify: `ls research/deep-research-config.json research/deep-research-strategy.md` lists both.
- [x] T002 Seed Level 1 packet docs with DR seed markers (`spec.md`). Verify: `rg -c 'DR-SEED' spec.md` prints 2.
- [x] T003 Open the run in the ledger (`research/deep-research-state.jsonl`). Verify: `head -1 research/deep-research-state.jsonl` shows a `config` row.

<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
<!-- FILL: Write one implementation task per file change. Add a `Verify:` line with the command and its expected output. GOOD: T002 Add the `--keep <n>` branch. Verify: `--keep 3` leaves 3 archives. WEAK: T002 Implement the feature. -->

- [ ] T004 Run the iteration loop to convergence or ten iterations (`research/iterations/`). Verify: `ls research/iterations | wc -l` prints the iteration count.
- [ ] T005 Emit the resource map (`research/resource-map.md`). Verify: `ls research/resource-map.md` lists it.
- [ ] T006 Compile the synthesis (`research/research.md`). Verify: `rg -n 'Convergence Report' research/research.md` prints one line.
- [ ] T007 Write the bounded findings fence back into `spec.md`. Verify: `rg -c 'deep-research/spec-findings' spec.md` prints 2.

<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
<!-- FILL: Write one verification task per requirement. Each one runs a command. GOOD: T003 Run both invocations. Verify: `ls logs/archive | wc -l` prints 3 and 10. WEAK: T003 Test everything. -->

- [ ] T008 Check each iteration with the verifier (`research/iterations/`). Verify: `verify-iteration.cjs --loop-type research` exits 0 for every run.
- [ ] T009 Confirm the synthesis answers all seven key questions (`research/research.md`). Verify: each question has a cited answer section.
- [ ] T010 Validate the packet (`spec.md`). Verify: `validate.sh <this packet> --strict` prints `RESULT: PASSED`.

<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
<!-- FILL: Keep the three completion lines and add the one artifact that proves the phase is done. GOOD: `--keep 3` leaves 3 archives and the suite passes. WEAK: Work is complete. -->

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
<!-- FILL: Name the spec and plan files. Add the decision record when the packet has one. GOOD: Specification: `spec.md`. Plan: `plan.md`. WEAK: See the other docs. -->

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---



