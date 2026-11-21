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

- [x] T004 Run the iteration loop to convergence or ten iterations (`research/iterations/`). Verify: `ls research/iterations | wc -l` prints the iteration count. Done 2026-11-17, rechecked 2026-11-21: This generation 1 run moved to `research_archive/20261117T103614Z/` when generation 2 began, so the Verify paths read there. `ls research_archive/20261117T103614Z/iterations | wc -l` prints 7, and the state log's `synthesis_complete` row records `stopReason: converged` with `totalIterations: 7`.
- [x] T005 Emit the resource map (`research/resource-map.md`). Verify: `ls research/resource-map.md` lists it. Done 2026-11-17, rechecked 2026-11-21: `ls research_archive/20261117T103614Z/resource-map.md` lists it.
- [x] T006 Compile the synthesis (`research/research.md`). Verify: `rg -n 'Convergence Report' research/research.md` prints one line. Done 2026-11-17, rechecked 2026-11-21: on `research_archive/20261117T103614Z/research.md` it prints one line, `349:## 17. Convergence Report`.
- [x] T007 Write the bounded findings fence back into `spec.md`. Verify: `rg -c 'deep-research/spec-findings' spec.md` prints 2. Done 2026-11-17, rechecked 2026-11-21: prints 2.

<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
<!-- FILL: Write one verification task per requirement. Each one runs a command. GOOD: T003 Run both invocations. Verify: `ls logs/archive | wc -l` prints 3 and 10. WEAK: T003 Test everything. -->

- [x] T008 Check each iteration with the verifier (`research/iterations/`). Verify: `verify-iteration.cjs --loop-type research` exits 0 for every run. Done 2026-11-21: `verify-iteration.cjs --loop-type research --artifact-dir research_archive/20261117T103614Z --iteration N` exits 0 with `ok: true` for N = 1 to 7. Each run warns that route proof came from the delta file, not the state row.
- [x] T009 Confirm the synthesis answers all seven key questions (`research/research.md`). Verify: each question has a cited answer section. Done 2026-11-21 on `research_archive/20261117T103614Z/research.md`: Q1 to Q6 have sections 4 to 8 and 10, and Q7 is answered in the executive summary and the D2 row of section 13, with `dispatch-iteration.cjs` line citations. The strategy file ticks all seven.
- [x] T010 Validate the packet (`spec.md`). Verify: `validate.sh <this packet> --strict` prints `RESULT: PASSED`. Evidence 2026-11-21: at `79fd6666d33`, `validate.sh <this packet> --strict --recursive` prints `RESULT: PASSED` for all 16 folders and `RESULT: FAILED` for none, with 0 errors. The metadata failures seen earlier that day cleared once the commit hook re-minted the generated metadata.

<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
<!-- FILL: Keep the three completion lines and add the one artifact that proves the phase is done. GOOD: `--keep 3` leaves 3 archives and the suite passes. WEAK: Work is complete. -->

- [x] All tasks marked `[x]` Evidence 2026-11-21: T001 to T010 are `[x]`.
- [x] No `[B]` blocked tasks remaining Evidence 2026-11-21: no task is `[B]`.
- [x] Manual verification passed Evidence 2026-11-21: T008 ran the verifier on all seven archived iterations, and T009 read each key question's answer section in the archived synthesis.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
<!-- FILL: Name the spec and plan files. Add the decision record when the packet has one. GOOD: Specification: `spec.md`. Plan: `plan.md`. WEAK: See the other docs. -->

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---



