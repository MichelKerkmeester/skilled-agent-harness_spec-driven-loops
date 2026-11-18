---
title: "DR-075 -- Frontier band budget closes spent bands and rolls down"
description: "This scenario validates that under the expansive mode a depth band that spends its share closes its open nodes as exhausted with reason budget, and that an unspent share rolls down to the next band but never up, for `DR-075`."
version: 1.0.0.0
---

# DR-075 -- Frontier band budget closes spent bands and rolls down

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DR-075`.

---

## 1. OVERVIEW

This scenario validates the depth-band budget the reducer applies to the frontier. It focuses on the close of a spent band and on where an unspent share goes.

### Why This Matters

An expansive run splits its iterations 50/35/15 across depths one, two and three. A band that has spent its share must stop holding the run open, or the frontier veto would keep the loop waiting on work it cannot fund. An unspent share that rolled up would let deep nodes starve shallow ones.

---

## 2. SCENARIO CONTRACT

Operators run the exact commands below and confirm the three budget cases and the source lines behind them.

- Objective: Confirm that a spent depth-1 band closes its open node as `exhausted` with reason `budget`, that an answered node stays answered, and that an unspent share rolls down to depth 2 only once depth 1 has no open node.
- Real user request: Explain why some frontier nodes closed as exhausted for budget, and where the iterations a finished band did not use went.
- Prompt: `Check that under expansive depth mode a spent depth band closes its open nodes as exhausted with reason budget, and that an unspent share rolls down to the next band but never up. Return a PASS or FAIL verdict with the reason.`
- Expected execution process: Run the budget cases by test name, then read the band loop in the research reducer.
- Expected signals: The three budget cases pass. The roll-down case reports a depth-2 allotment of 6.5, the never-up case closes the spent depth-1 node as `exhausted` with reason `budget`, and the answered-node case keeps both nodes answered with a depth-2 allotment of 7.5.
- Desired user-visible outcome: The operator can say a band closes its own open nodes once it spends its share, and a share left over moves only to deeper bands.
- Pass/fail: PASS if the cases pass and the reducer shows the close and the carry; FAIL if a spent band leaves a node open, an answered node is closed for budget, or a share rolls up.

---

## 3. TEST EXECUTION

### Prerequisites

- Working directory is the repository root.
- The `runtime/` vitest suites are installed under `.skilled/skills/system-deep-loop/runtime`.

### Prompt

- Prompt: `Check that under expansive depth mode a spent depth band closes its open nodes as exhausted with reason budget, and that an unspent share rolls down to the next band but never up. Return a PASS or FAIL verdict with the reason.`

### Commands

1. `cd .skilled/skills/system-deep-loop/runtime && npx vitest run deep-research-reduce-state.vitest -t "share" --reporter=verbose`
2. `rg -n "function applyFrontierBudget|carry = |reason: 'budget'" .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs`

### Expected

Command 1 prints `Tests  3 passed` with the rest of the file skipped. The three cases are `rolls an unspent depth-1 share down to depth 2`, `never rolls a share up: a spent depth-1 band closes its open node as budget-exhausted` and `keeps answered nodes answered and rolls their unspent depth-1 share down`. Command 2 prints the budget function, the carry assignment that passes a band's unspent share only when the band has no open node, and the `budget` close reason.

### Evidence

- The verbose case lines and the summary line from command 1, with its exit status.
- The `rg` lines from command 2, read from the current source.

### Pass / Fail

- **Pass**: Command 1 exits 0 with the three cases passing, and command 2 shows the close and the carry.
- **Fail**: A spent band leaves a node open, an answered node closes for budget, a share rolls up, or any named case fails.

### Failure Triage

- A spent band leaves a node open: check that the band close runs when the band's visits reach its allotment.
- A share rolls up or rolls down while the band is still open: check the carry assignment after each band.
- An answered node closes for budget: check that the answered set is applied before the band close.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs` | `applyFrontierBudget`: the band allotments, the budget close and the roll-down |
| `deep-research-reduce-state.vitest` | The roll-down, never-up and answered-node budget cases |

---

## 5. SOURCE METADATA

- Group: ITERATION EXECUTION AND STATE DISCIPLINE
- Playbook ID: DR-075
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `iteration-execution-and-state-discipline/frontier-band-budget-rolls-down.md`
- Feature catalog status: `feature-catalog/convergence/expansive-depth-mode.md` covers the band budget in its Budget And Dashboard section.
