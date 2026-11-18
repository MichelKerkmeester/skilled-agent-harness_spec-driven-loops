---
title: "DRV-079 -- Frontier focus and per-node dimension coverage"
description: "This scenario validates that an open review node is answered only after every configured dimension is covered for it, that the active node's next uncovered dimension steers the iteration and that the dashboard reports the frontier metrics, for `DRV-079`."
version: 1.13.1.0
---

# DRV-079 -- Frontier focus and per-node dimension coverage

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DRV-079`.

---

## 1. OVERVIEW

This scenario validates how a review frontier node moves from open to answered, and how the active node steers the next iteration for `DRV-079`. It focuses on per-node dimension coverage, on the next uncovered dimension that the active node hands to the iteration, and on the frontier metrics the dashboard shows.

### Why This Matters

A sub-target that counts as answered after one dimension would be closed before the review checked it. The operator would see a clean sub-target that only one lens ever reviewed. Steering by the active node's next uncovered dimension keeps each sub-target on the lenses it still lacks.

---

## 2. SCENARIO CONTRACT

Operators run the commands below and confirm that a node stays open until all of its dimensions are covered, that the iteration takes its dimension from the active node, and that the dashboard shows the frontier metrics.

- Objective: Confirm that a node with two of four dimensions covered stays open and answers at four, that Next Focus names the active node and its uncovered dimension, that the flag-gated steering reads the active node's next dimension, and that the dashboard reports frontier size, pruned nodes, revisits and budget per depth.
- Real user request: Show me which sub-target the review is on, which dimension it checks next and how much of the budget each depth band has spent.
- Prompt: `Check that an open deep-review frontier node with two of four dimensions covered stays open, that the next uncovered dimension of the active node steers the next iteration, and that the dashboard reports the frontier metrics. Return a PASS or FAIL verdict with the reason.`
- Expected execution process: Run the reducer cases for coverage, focus and the dashboard, run the steering case in the stop-decision workflow contract, then read the line that carries the active node's dimension into the reducer output.
- Expected signals: The coverage case passes: the node stays open at two of four covered and answers at four. The focus case passes: Next Focus names the active node, and the pivot and blocked-stop overrides still come first. The steering case passes: the review takes its next dimension from the active node under the expansive mode. The dashboard case passes with the frontier metrics.
- Desired user-visible outcome: The operator can say which sub-target the review is on, which dimension it checks next and how much budget each depth band has spent.
- Pass/fail: PASS if the three commands pass and the reducer line carries the active dimension; FAIL if a node answers before its last dimension, Next Focus names a different node than the active one, or the dashboard omits a frontier metric.

---

## 3. TEST EXECUTION

### Prerequisites

- Working directory is the repository root.
- The `runtime/` vitest suites are installed under `.skilled/skills/system-deep-loop/runtime`.

### Prompt

- Prompt: `Check that an open deep-review frontier node with two of four dimensions covered stays open, that the next uncovered dimension of the active node steers the next iteration, and that the dashboard reports the frontier metrics. Return a PASS or FAIL verdict with the reason.`

### Commands

1. `cd .skilled/skills/system-deep-loop/runtime && npx vitest run deep-review-state-reducer.vitest -t "keeps a node open with two of four dimensions|hands next focus to the active frontier node|reports frontier size" --reporter=verbose`
2. `cd .skilled/skills/system-deep-loop/runtime && npx vitest run stop-decision-yaml-contract.vitest -t "takes the next dimension from the active frontier node" --reporter=verbose`
3. `rg -n "activeNextDimension" .skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs`

### Expected

Command 1 prints `Tests  3 passed` (the rest of the file skipped). Its three passing cases are `keeps a node open with two of four dimensions covered and answers it at four`, `hands next focus to the active frontier node, and keeps the pivot and blocked-stop overrides ahead of it` and `reports frontier size, pruned nodes, revisits and per-band budget on the dashboard`. Command 2 prints `Tests  1 passed` (the rest of the file skipped), and the case `takes the next dimension from the active frontier node under expansive depth` passes. That case checks that `next_dimension` reads `registry.frontier.activeNextDimension` and falls back to the next uncovered dimension in the dimension queue. Command 3 prints three lines: the projection field, then the Next Focus text, then the dashboard active-node line.

### Evidence

- The verbose case lines and summary lines from commands 1 and 2, with each exit status.
- The three `rg` lines from command 3, read from the current reducer.

### Pass / Fail

- **Pass**: Commands 1 and 2 exit 0 with the expected counts, and command 3 prints the three lines.
- **Fail**: A node answers before its last dimension, Next Focus names a node other than the active one, the dashboard drops a frontier metric, or the steering case fails.

### Failure Triage

1. A node answers before its last dimension: check the per-node coverage map in the reducer, since a node answers only when every configured dimension has evidence behind it.
2. Next Focus names a different node: check the precedence. The blocked-stop text comes first, then the pivot, then the active node, then the leaf's own focus and finally the first uncovered dimension.
3. The steering case fails: check that the review reads its next dimension from the active node only under the expansive flag, so a default run keeps its own rule.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs` | The frontier projection with `activeNextDimension`, the Next Focus text and the dashboard active-node line |
| `.skilled/commands/deep/assets/deep-review.yaml` | The `active_frontier_node` and `next_dimension` extracts, which read `registry.frontier.activeNodeId` and `registry.frontier.activeNextDimension` and fall back to the dimension queue |
| `deep-review-state-reducer.vitest` | The coverage, focus and dashboard cases for the frontier |
| `stop-decision-yaml-contract.vitest` | The flag-gated `next_dimension` case in the workflow contract |

---

## 5. SOURCE METADATA

- Group: ITERATION EXECUTION AND STATE DISCIPLINE
- Playbook ID: DRV-079
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `iteration-execution-and-state-discipline/frontier-focus-and-node-dimension-coverage.md`
