---
title: "DRV-075 -- Covered custom dimension reaches the all-dimensions-clean stop"
description: "This scenario validates that a configured custom review dimension, once covered, lets the review reach its clean stop for `DRV-075`. It focuses on the all_dimensions_clean reason and on the review pivot seeding no unswept-dimension for the covered name."
version: 1.0.2.0
---

# DRV-075 -- Covered custom dimension reaches the all-dimensions-clean stop

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DRV-075`.

---

## 1. OVERVIEW

This scenario validates the clean-stop gate for a custom review dimension for `DRV-075`. It focuses on a review run configured with `correctness` and `performance`: once `performance` is covered, the convergence check must stop the run with `all_dimensions_clean`, and the review pivot must not hold a candidate for `performance` open.

### Why This Matters

A custom dimension that the reducer tracks but never marks covered keeps the stop gate open for the whole run. The run then reaches no clean stop, and the pivot seeds an `unswept-dimension` candidate that never closes. The operator sees a review that never finishes even though every configured dimension was checked.

---

## 2. SCENARIO CONTRACT

Operators run this as a convergence check on a review loop state that covers the custom dimension. The outcome must come from the coverage the reducer records, not from the default four-dimension path.

- Objective: Confirm that a configured custom dimension, once covered, lets the review stop with `all_dimensions_clean`, and that the pivot seeds no `unswept-dimension` candidate for it.
- Real user request: I added performance to the review. Once a pass has checked it, the review should finish cleanly and not keep waiting on it.
- Prompt: `Run a deep review with review_dimensions: correctness,performance, cover performance on one iteration, and confirm the run stops with all_dimensions_clean rather than holding open on a missing performance dimension.`
- Expected execution process: Run the convergence integration case that records a custom dimension as covered and checks the stop reason, then run the review pivot case for the same covered dimension, then read the line in the convergence script that sets the clean-stop reason.
- Expected signals: The convergence case stops clean with `performance` covered, and its stop decision does not list `performance` as missing. The pivot case accepts the clean-stop trigger and seeds no `unswept-dimension` candidate for `performance`. The convergence script sets the `all_dimensions_clean` reason on the clean-stop candidate.
- Desired user-visible outcome: The operator is told the review finished because every configured dimension, including performance, was covered.
- Pass/fail: PASS if the convergence case and the pivot case pass and the clean-stop line is present; FAIL if the run holds open on `performance`, stops with a different reason, or the pivot seeds an `unswept-dimension` candidate for `performance`.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Run a deep review with review_dimensions: correctness,performance, cover performance on one iteration, and confirm the run stops with all_dimensions_clean rather than holding open on a missing performance dimension.`

### Commands

1. `cd .skilled/skills/system-deep-loop/runtime && npx vitest run review-depth-convergence.vitest -t "custom dimension"`
2. `cd .skilled/skills/system-deep-loop/runtime && npx vitest run divergent-pivot.vitest -t "custom dimension"`
3. `rg -n "reasonDetail: 'all_dimensions_clean'" .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs`

### Expected

Command 1 exits 0 with `stops clean when the reducer records the configured custom dimension as covered` reported as passed and no failed test. Command 2 exits 0 with `accepts the clean-stop trigger and seeds no unswept-dimension for a covered custom dimension` reported as passed and no failed test. Command 3 prints one line, the clean-stop candidate assignment that sets `reasonDetail` to `all_dimensions_clean`.

### Evidence

Capture the pass lines from command 1 and command 2 with their case names, and the command 3 line that sets the clean-stop reason.

### Pass / Fail

- **Pass**: Commands 1 and 2 exit 0 with their named cases passing, and command 3 prints the clean-stop assignment.
- **Fail**: A named case fails, the run stops with a reason other than `all_dimensions_clean` once `performance` is covered, the pivot seeds an `unswept-dimension` for `performance`, or command 3 prints nothing.

### Failure Triage

If command 1 fails, check that the reducer marks the configured custom name as covered in the dimension coverage map, since the stop gate reads that map and the canonical four alone do not satisfy it. If command 2 fails, check the pivot's unswept-dimension candidates for the covered custom name, since a covered dimension must not seed one. If command 3 prints nothing, the clean-stop assignment has moved, so find the new location of `all_dimensions_clean` in `convergence.cjs` before judging the stop.

### Optional Supplemental Checks

- Whole-file stop path: run `cd .skilled/skills/system-deep-loop/runtime && npx vitest run review-depth-convergence.vitest` without a name filter. It must exit 0 with no failed test, so the canonical stop cases in the same file still pass beside the custom-dimension case.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `feature-catalog/` | `feature-catalog/review-dimensions/custom-review-dimensions.md` covers custom review dimensions; the implementation anchors below are the contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs` | The clean-stop candidate that sets `all_dimensions_clean` |
| `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs` | The dimension coverage map the stop gate reads |
| `.skilled/skills/system-deep-loop/runtime/tests/integration/review-depth-convergence.vitest.ts` | The custom-dimension stop path: performance covered, run stops clean |
| `.skilled/skills/system-deep-loop/runtime/tests/integration/divergent-pivot.vitest.ts` | The pivot case: a covered custom dimension seeds no unswept-dimension |

---

## 5. SOURCE METADATA

- Group: REVIEW-DEPTH V2 ROLLOUT
- Playbook ID: DRV-075
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `review-depth-v2-rollout/stop-gate-custom-dimension-coverage.md`
