---
title: "DRV-073 -- Review Next Focus names the first uncovered dimension"
description: "This scenario validates that deep-review Next Focus, in the strategy and in the dashboard, names the first uncovered required dimension when the latest leaf's free text names no dimension, for `DRV-073`. It focuses on the review focus pick."
version: 1.11.1.0
---

# DRV-073 -- Review Next Focus names the first uncovered dimension

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DRV-073`.

---

## 1. OVERVIEW

This scenario validates that review Next Focus names the first uncovered required dimension when the latest leaf's free text names no dimension. It focuses on the single base pick that feeds both the strategy `11. NEXT FOCUS` block and the dashboard.

### Why This Matters

Free text from a leaf can describe a finding without naming a review dimension. If the next focus follows that text, the review can revisit covered ground and leave a required dimension unswept. Naming the first uncovered dimension keeps the rotation moving through the required set.

---

## 2. SCENARIO CONTRACT

Operators run the exact commands below and confirm that the review focus pick names an uncovered dimension.

- Objective: Confirm that a review run whose latest leaf names no dimension resolves Next Focus to the first uncovered required dimension, in both the strategy and the dashboard.
- Real user request: Make sure a review run keeps sweeping the required dimensions instead of following loose free text.
- Prompt: `Check that deep-review Next Focus names the first uncovered dimension when the latest leaf's free text names no dimension, in the strategy file and in the dashboard. Return a PASS or FAIL verdict with the reason.`
- Expected execution process: Run the review reducer suite by file stem, then read the single base pick and its two call sites in source.
- Expected signals: The named case passes. A leaf focus is kept only when it names an uncovered required dimension, or when every dimension is covered. Otherwise the base pick is the first uncovered dimension, and the strategy and the dashboard read the same pick.
- Desired user-visible outcome: The operator can say the next review round targets the first uncovered dimension, not the wording of a leaf's free text.
- Pass/fail: PASS if the named case passes and the source shows one base pick feeding both call sites; FAIL if the Next Focus of the strategy or the dashboard follows free text that names no uncovered dimension.

---

## 3. TEST EXECUTION

### Prerequisites

- Working directory is the repository root.
- The `runtime/` vitest suites are installed under `.skilled/skills/system-deep-loop/runtime`.

### Prompt

- Prompt: `Check that deep-review Next Focus names the first uncovered dimension when the latest leaf's free text names no dimension, in the strategy file and in the dashboard. Return a PASS or FAIL verdict with the reason.`

### Commands

1. `cd .skilled/skills/system-deep-loop/runtime && npx vitest run deep-review-state-reducer.vitest -t "first uncovered dimension"`
2. `cd .skilled/skills/system-deep-loop/runtime && npx vitest run deep-review-state-reducer.vitest`
3. `rg -n "function pickReviewBaseFocus" .skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs`
4. `rg -n "pickReviewBaseFocus\(" .skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs`

### Expected

Command 1 exits 0 with the first-uncovered-dimension case passing. Command 2 exits 0 with the whole reducer suite passing. Command 3 prints the base pick definition. Command 4 prints the definition and its two call sites, one for the strategy `11. NEXT FOCUS` block and one for the dashboard.

### Evidence

- The vitest summary line and exit status for commands 1 and 2.
- The `rg` line numbers for commands 3 and 4, read from the current source.

### Pass / Fail

- **Pass**: Commands 1 and 2 exit 0, and commands 3 and 4 show one base pick with both call sites.
- **Fail**: The strategy or the dashboard Next Focus follows free text that names no uncovered dimension, or the named case fails.

### Failure Triage

- The named case is missing or renamed: restore it in the reducer suite before trusting the verdict.
- The strategy and the dashboard disagree: compare the two call sites in command 4, since they must read the same base pick.
- Next Focus follows free text that names a covered dimension: check the keep rule in `pickReviewBaseFocus`.

---

## 4. SOURCE FILES

### Implementation

| File | Role |
|---|---|
| `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs` | `pickReviewBaseFocus` and its two call sites, the strategy block and the dashboard |

### Validation

| File | Role |
|---|---|
| `deep-review-state-reducer.vitest` | First uncovered dimension outranks free leaf text in the strategy and the dashboard |

---

## 5. SOURCE METADATA

- Group: ITERATION EXECUTION AND STATE DISCIPLINE
- Playbook ID: DRV-073
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `iteration-execution-and-state-discipline/review-next-focus-first-uncovered-dimension.md`
- Feature catalog status: `feature-catalog/state-management/focus-hijack-guard.md` covers this scenario.
