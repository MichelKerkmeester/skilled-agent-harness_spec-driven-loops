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

`S` is `.skilled/skills/system-deep-loop`. `I` is `S/runtime/tests/integration`. `U` is `S/runtime/tests/unit`. Every vitest command runs from `S/runtime`, where the only Vitest config lives.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Record the baseline of the three suites (`I/`, `U/`). Verify: `cd S/runtime && npx vitest run tests/integration/review-depth-convergence.vitest.ts tests/integration/review-stop-path-replay.vitest.ts tests/unit/stop-decision.vitest.ts` exits 0 and its pass count is written in `goal.md` §4.
- [ ] T002 Record the baseline of the full runtime suite (`S/runtime`). Verify: `cd S/runtime && npx vitest run` prints its pass and fail counts, written in `goal.md` §4.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Write the configured-floor case: `minIterations: 3`, stop candidate at iteration 2 (`I/review-depth-convergence.vitest.ts`). Verify: the case fails on the current code because the decision is not `minIterationsNotReached`.
- [ ] T008 Invert the case "does not apply the iteration floor to review" so it expects `CONTINUE` with `minIterationsNotReached`, and rename it to match (`U/stop-decision.vitest.ts:905-913`). Verify: the inverted case fails on the current code.
- [ ] T004 Drop the research-only condition from the floor check (`S/runtime/scripts/convergence.cjs`). Verify: `grep -n "loopType === 'research' && minIterations" S/runtime/scripts/convergence.cjs` prints nothing, and the T003 and T008 cases pass.
- [ ] T005 Extend the case to iteration 3 (`I/review-depth-convergence.vitest.ts`). Verify: at iteration 3 the decision reason is no longer `minIterationsNotReached`.
- [ ] T009 Add the floor to the fixed stop order in `step_check_convergence`, after candidate line 4 and before the gates in line 5 (`.skilled/commands/deep/assets/deep-review.yaml:1017-1030`), and state the floor after the `antiConvergence.minIterations` sentence (`S/deep-review/README.md:155`). Verify: `grep -n 'minIterationsNotReached' .skilled/commands/deep/assets/deep-review.yaml` prints the stop-order line and `grep -n 'minIterations' S/deep-review/README.md` prints the new sentence.
- [ ] T010 Regenerate the review compiled contract as the last implementation task (`.skilled/commands/deep/assets/compiled/deep-review.contract.markdown`). Verify: `node S/runtime/scripts/compile-command-contracts.cjs --command deep/review --write` exits 0, then `node S/runtime/scripts/check-contract-drift.cjs --command deep/review` exits 0.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T006 Rerun the stop-path replay with the shipped floor (`I/review-stop-path-replay.vitest.ts`). Verify: it passes with no fixture change, and `git diff --stat` lists no fixture file under `S/runtime/tests/`.
- [ ] T007 Run the full runtime vitest suite from the final state (`S/runtime`). Verify: `cd S/runtime && npx vitest run` shows one existing case changed (T008), N cases added and no failure absent from the T002 baseline.
- [ ] T011 Write the playbook scenario through `/create:manual-testing-playbook system-deep-loop update --path S/deep-review/manual-testing-playbook`, landing under `convergence-and-recovery/`, then walk it. No hand edit to the package. Verify: the package index lists the new scenario, and the walk shows a `minIterations: 3` review run does not stop before iteration 3.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] The configured-floor and inverted cases pass, the shipped-floor replay is unchanged, the review contract shows no drift, and the playbook scenario exists
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Research**: `../research/research.md` §13 D3, §15 and §20 Slice C; `../scratch/opus-verification-log.md` F3
<!-- /ANCHOR:cross-refs -->

---
