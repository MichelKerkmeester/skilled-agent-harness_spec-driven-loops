---
title: "Tasks: Keep a packet's core purpose across handovers and compactions"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "purpose retention across handovers tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Keep a packet's core purpose across handovers and compactions

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

`P` is this packet folder, `specs/system-speckit/spec-authoring-and-continuity/006-purpose-retention-across-handovers`. `R` is `P/research/research.md`.

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
<!-- FILL: Replace the sample tasks with the real setup steps. Each task names a file and a verify command. GOOD: T001 Confirm `logs/archive/` holds 10 archives. Verify: `ls logs/archive | wc -l` prints 10. WEAK: T001 Set up the project. -->

- [x] T001 Confirm the five research questions are in the packet (`P/spec.md`). Verify: `rg -c '^[1-5]\. ' P/spec.md` prints 5.
- [x] T002 Start `/deep:research` with two `cli-deepseek-harness` lineages at 5 iterations each (`P/research/lineages/`). Verify: `ls P/research/lineages` lists two lineage folders. Evidence: the fan-out runner exited 0, `ls P/research/lineages` lists `deepseek-1` and `deepseek-2`, and each holds 5 iteration files and a state log with 5 iteration rows.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
<!-- FILL: Write one implementation task per file change. Add a `Verify:` line with the command and its expected output. GOOD: T002 Add the `--keep <n>` branch. Verify: `--keep 3` leaves 3 archives. WEAK: T002 Implement the feature. -->

- [x] T003 [P] Answer Q1, where the problem, purpose and user need are written per level and for a phase parent, and which places are required and validated (`R`). Verify: the Q1 answer in `R` cites each template and validator rule as `[SOURCE: path:line]`. Evidence: `R` section 4.
- [x] T004 [P] Answer Q2, what each hop surface reads and emits and whether the purpose travels (`R`). Verify: the Q2 answer in `R` has one cited row per surface named in `spec.md` Q2. Evidence: `R` section 5.
- [x] T005 [P] Answer Q3, whether real packets with a `handover.md` or several continuity saves restate, shorten or drop the purpose, and whether phase children drift from the parent (`R`). Verify: the Q3 answer in `R` cites each sampled packet as `[SOURCE: path:line]`. Evidence: `R` section 6. The corpus counts are lineage-reported and two were not reproduced exactly, see `R` section 9.
- [x] T006 Answer Q4, which candidate change closes the measured gap at the lowest cost (`R`). Verify: `R` names one recommended change with its cost and how to validate it. Evidence: `R` section 7 and the adjudication in section 10. The two lineages disagreed, and the recommendation is the judgment of the orchestrating session.
- [x] T007 Answer Q5, what is ruled out and why (`R`). Verify: `R` holds a ruled-out list with one reason per item. Evidence: `R` section 8 and Eliminated Alternatives.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
<!-- FILL: Write one verification task per requirement. Each one runs a command. GOOD: T003 Run both invocations. Verify: `ls logs/archive | wc -l` prints 3 and 10. WEAK: T003 Test everything. -->

- [x] T008 Open a sample of the citations in `R` from the orchestrating session (`R`). Verify: each opened `[SOURCE: path:line]` shows the cited text at that line. Evidence: `R` section 9 lists each opened citation. Two line numbers were corrected.
- [x] T009 Confirm the run wrote nothing outside the packet (`P/research/`). Verify: `git status --short` lists no path outside `P`. Evidence: the runner reported 0 containment advisories. `git status --short` also lists the sub-track `graph-metadata.json`, which `create.sh` wrote when it registered this packet before the run.
- [x] T010 Validate the packet (`P`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh P --strict` prints `RESULT: PASSED`. Evidence: `RESULT: PASSED` with Errors 0. The warnings are listed in `implementation-summary.md`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
<!-- FILL: Keep the three completion lines and add the one artifact that proves the phase is done. GOOD: `--keep 3` leaves 3 archives and the suite passes. WEAK: Work is complete. -->

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
- [x] `R` answers the five questions and names one recommended change
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
<!-- FILL: Name the spec and plan files. Add the decision record when the packet has one. GOOD: Specification: `spec.md`. Plan: `plan.md`. WEAK: See the other docs. -->

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---



