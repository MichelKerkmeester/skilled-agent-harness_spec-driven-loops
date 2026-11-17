---
title: "DRV-072 -- Review run holds below its minIterations floor"
description: "This scenario validates that a review run never stops before its configured minIterations floor for `DRV-072`. It focuses on a stop candidate below the floor returning CONTINUE with minIterationsNotReached."
version: 1.0.0.0
---

# DRV-072 -- Review run holds below its minIterations floor

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DRV-072`.

---

## 1. OVERVIEW

This scenario validates the minimum-iteration floor for `DRV-072`. It focuses on a review run whose stop candidate arrives before its configured `minIterations`: the convergence check must return `CONTINUE` with reason `minIterationsNotReached`, and the run may release only once the floor is reached.

### Why This Matters

The floor used to apply to research runs only. A review that reached a stop candidate at iteration 2 with a floor of 3 could stop one iteration early, before the reviewer had the second full pass the floor exists to guarantee. The shipped floor of 2 is unchanged, so only an operator who sets a higher floor sees the change.

---

## 2. SCENARIO CONTRACT

Operators run this as a single check of the convergence decision with a floor set above the stop candidate, so the outcome comes from the floor and not from the default.

- Objective: Confirm that a review stop candidate below `minIterations` returns `CONTINUE` with `minIterationsNotReached`, and that the same run releases at the floor.
- Real user request: I set a review to run at least three iterations. Do not let it stop at two, even if it looks converged.
- Prompt: `Stop a deep-review run that reaches a stop candidate at iteration 2 with minIterations set to 3, and confirm the run continues with minIterationsNotReached and releases only at iteration 3.`
- Expected execution process: Read the floor check in the convergence script, read the stop-order item in the review workflow, then run the convergence and stop-decision tests that drive a real review loop state through the floor.
- Expected signals: The floor check returns `CONTINUE` with reason `minIterationsNotReached` at iteration 2, the same loop state releases at iteration 3, the shipped floor of 2 still passes its replay, the review workflow names the floor as stop-order item `4a`, and the stop-decision case reads that a review run gets the floor.
- Desired user-visible outcome: The user is told the review will not stop before its configured minimum, and why it continued.
- Pass/fail: PASS if the iteration-2 candidate continues with `minIterationsNotReached`, the iteration-3 candidate releases, and the replay and parity suites pass; FAIL if a review releases below its floor or the floor applies to research only.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Stop a deep-review run that reaches a stop candidate at iteration 2 with minIterations set to 3, and confirm the run continues with minIterationsNotReached and releases only at iteration 3.`

### Commands

1. `rg -n 'minIterationsNotReached' .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs`
2. `rg -n '4a\. if iteration_count' .skilled/commands/deep/assets/deep-review.yaml`
3. `cd .skilled/skills/system-deep-loop/runtime && npx vitest run tests/integration/review-depth-convergence.vitest.ts tests/unit/stop-decision.vitest.ts tests/integration/review-stop-path-replay.vitest.ts tests/unit/stop-policy-yaml-parity.vitest.ts`

### Expected

Command 1 prints the floor's `CONTINUE` return with `minIterationsNotReached`. Command 2 prints stop-order item `4a`. Command 3 exits 0 with no failed test. The `review-depth-convergence` case shows `CONTINUE` at iteration 2 and a release at iteration 3 from the same loop state.

### Evidence

Capture the command 1 and 2 matches, and the command 3 summary with the named cases.

### Pass / Fail

- **Pass**: The iteration-2 candidate returns `CONTINUE` with `minIterationsNotReached`, the iteration-3 candidate releases, the replay still passes at the shipped floor, and the YAML parity suite passes.
- **Fail**: A review releases below its floor, the reason is missing or wrong, the replay fails at the shipped floor, or the stop-order item is absent from the workflow.

### Failure Triage

If the run releases at iteration 2, check that the floor check in `convergence.cjs` runs on the candidate before the legal-stop gates and no longer depends on the loop type. If the shipped replay fails, the floor value has changed, since the shipped floor of 2 must stay as it is.

### Optional Supplemental Checks

- Shipped floor: run the stop-path replay with its fixtures unchanged and confirm the outcome matches its recorded expectation.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `feature-catalog/` | No dedicated convergence catalog entry exists for `deep-review` floor behavior yet; the implementation anchors below are the contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs` | Floor check, now applied to review runs before the legal-stop gates |
| `.skilled/commands/deep/assets/deep-review.yaml` | Stop-order item `4a` in `step_check_convergence` |
| `.skilled/skills/system-deep-loop/runtime/tests/integration/review-depth-convergence.vitest.ts` | Floor of 3 from real loop state: CONTINUE at iteration 2, released at iteration 3 |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/stop-decision.vitest.ts` | The inverted and renamed review floor case |
| `.skilled/skills/system-deep-loop/runtime/tests/integration/review-stop-path-replay.vitest.ts` | Shipped-floor replay with fixtures untouched |

---

## 5. SOURCE METADATA

- Group: CONVERGENCE AND RECOVERY
- Playbook ID: DRV-072
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `convergence-and-recovery/review-min-iterations-floor.md`
