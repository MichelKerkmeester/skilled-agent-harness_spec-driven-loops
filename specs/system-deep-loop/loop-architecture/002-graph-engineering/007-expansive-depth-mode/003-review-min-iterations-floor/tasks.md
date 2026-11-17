---
title: "Tasks: Apply the configured review minIterations floor in convergence"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "review min iterations floor tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Apply the configured review minIterations floor in convergence

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

`S` is `.skilled/skills/system-deep-loop`. `I` is `S/runtime/tests/integration`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Record the baseline of the two review suites (`I/`). Verify: `cd S && npx vitest run runtime/tests/integration/review-depth-convergence.vitest.ts runtime/tests/integration/review-stop-path-replay.vitest.ts` exits 0 and its pass count is written in `goal.md` §4.
- [ ] T002 Record the baseline of the full system-deep-loop suite (`S/`). Verify: `cd S && npx vitest run` exits 0 and its pass count is written in `goal.md` §4.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Write the configured-floor case: `minIterations: 3`, stop candidate at iteration 2 (`I/review-depth-convergence.vitest.ts`). Verify: the case fails on the current code because the decision is not `minIterationsNotReached`.
- [ ] T004 Drop the research-only condition from the floor check (`S/runtime/scripts/convergence.cjs`). Verify: `grep -n "loopType === 'research' && minIterations" S/runtime/scripts/convergence.cjs` prints nothing and the T003 case passes.
- [ ] T005 Extend the case to iteration 3 (`I/review-depth-convergence.vitest.ts`). Verify: at iteration 3 the decision reason is no longer `minIterationsNotReached`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T006 Rerun the stop-path replay with the shipped floor (`I/review-stop-path-replay.vitest.ts`). Verify: it passes with no fixture change, and `git diff --stat` lists no fixture file under `S/runtime/tests/`.
- [ ] T007 Run the full system-deep-loop vitest suite from the final state (`S/`). Verify: `cd S && npx vitest run` exits 0 and its pass count equals the baseline plus the new cases.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] The configured-floor case passes and the shipped-floor replay is unchanged
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Research**: `../research/research.md` §13 D3, §15 and §20 Slice C; `../scratch/opus-verification-log.md` F3
<!-- /ANCHOR:cross-refs -->

---
