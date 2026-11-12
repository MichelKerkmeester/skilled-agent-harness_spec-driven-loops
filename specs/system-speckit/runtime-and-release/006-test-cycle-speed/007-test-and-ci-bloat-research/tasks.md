---
title: "Tasks: Phase 7: test-and-ci-bloat-research"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "test and ci bloat research tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 7: test-and-ci-bloat-research

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

- [x] T001 Scaffold the phase folder (`007-test-and-ci-bloat-research/`). Verify: `ls specs/system-speckit/runtime-and-release/006-test-cycle-speed/007-test-and-ci-bloat-research` lists `spec.md`.
- [x] T002 Record the test and workflow inventory in the Measured Behavior block (`spec.md`). Verify: `rg -c 'Spec-Kit Check' spec.md` prints 1.
- [x] T003 Confirm both providers list the model (`.pi/models.json`). Verify: `pi --list-models` prints a `llmgateway  deepseek-v4.1-flash-1017` row and `opencode models --standalone` prints `opencode-go/deepseek-v4.1-flash`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
<!-- FILL: Write one implementation task per file change. Add a `Verify:` line with the command and its expected output. GOOD: T002 Add the `--keep <n>` branch. Verify: `--keep 3` leaves 3 archives. WEAK: T002 Implement the feature. -->

- [x] T004 Run the two-lineage fan-out at forced depth (`research/`). Verify: `ls research/lineages/*/iterations/iteration-*.md | wc -l` prints 20.
- [x] T005 Merge the lineage registries (`research/`). Verify: `fanout-merge.cjs --loop-type research` exits 0.
- [x] T006 Write the ranked synthesis (`research/research.md`). Verify: `ls research/research.md` prints one path.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
<!-- FILL: Write one verification task per requirement. Each one runs a command. GOOD: T003 Run both invocations. Verify: `ls logs/archive | wc -l` prints 3 and 10. WEAK: T003 Test everything. -->

- [x] T007 Check the top recommendations against the repository (`research/research.md`). Verify: each top recommendation carries a confirmed or inferred label.
- [x] T008 Write what the research found (`implementation-summary.md`). Verify: `rg -c "What Was Built" implementation-summary.md` prints 1 and no fill token remains.
- [x] T009 Validate the packet (`spec.md`). Verify: `validate.sh <folder> --strict --quiet` prints `RESULT: PASSED`.
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



