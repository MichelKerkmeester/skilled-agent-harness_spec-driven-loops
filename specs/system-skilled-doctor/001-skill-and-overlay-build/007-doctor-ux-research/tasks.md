---
title: "Tasks: Phase 7: doctor-ux-research"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "doctor ux research tasks"
importance_tier: "normal"
contextType: "research"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 7: doctor-ux-research

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

- [x] T001 Create the worktree and phase folder (`007-doctor-ux-research/`). Verify: `ls research/` lists the state files. Evidence: config, state log, strategy and registry written.
- [x] T002 Open the run through the append gateway (`research/deep-research-state.jsonl`). Verify: the gateway exits 0. Evidence: `run-initialized` receipt, sequence 1.
- [x] T003 Validate the executor (`deep-research-config.json`). Verify: `parseExecutorConfig` accepts cli-devin `deepseek-v4-1-flash-max`. Evidence: parsed without error.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
<!-- FILL: Write one implementation task per file change. Add a `Verify:` line with the command and its expected output. GOOD: T002 Add the `--keep <n>` branch. Verify: `--keep 3` leaves 3 archives. WEAK: T002 Implement the feature. -->

- [x] T004 Run iterations 1 to 5 (`research/iterations/`). Verify: `verify-iteration.cjs` prints OK for each. Evidence: OK for 1 to 5, ratios 0.72, 0.78, 0.74, 0.76, 0.60.
- [x] T005 Reduce state after each iteration (`findings-registry.json`). Verify: reducer exits 0. Evidence: dashboard and strategy refreshed.
- [x] T006 Synthesize (`research/research.md`). Verify: the file exists with ranked tiers. Evidence: 22 recommendations in three tiers.
- [x] T007 Check Tier 1 findings against the code (`research/research.md` §3). Verify: each row says Confirmed or Unconfirmed. Evidence: 7 confirmed, 1 unconfirmed.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
<!-- FILL: Write one verification task per requirement. Each one runs a command. GOOD: T003 Run both invocations. Verify: `ls logs/archive | wc -l` prints 3 and 10. WEAK: T003 Test everything. -->

- [x] T008 Confirm no writes outside `research/`. Verify: write containment reports no violations. Evidence: no advisory lines in any iteration log.
- [x] T009 Write findings back into `spec.md`. Verify: `rg -n 'BEGIN GENERATED: deep-research/spec-findings' spec.md` prints one line.
- [x] T010 Validate the packet (`007-doctor-ux-research/`). Verify: `validate.sh --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
<!-- FILL: Keep the three completion lines and add the one artifact that proves the phase is done. GOOD: `--keep 3` leaves 3 archives and the suite passes. WEAK: Work is complete. -->

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
<!-- FILL: Name the spec and plan files. Add the decision record when the packet has one. GOOD: Specification: `spec.md`. Plan: `plan.md`. WEAK: See the other docs. -->

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---



