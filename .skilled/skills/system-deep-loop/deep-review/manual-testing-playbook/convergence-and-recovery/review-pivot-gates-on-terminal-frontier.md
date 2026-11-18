---
title: "DRV-081 -- Review pivot waits for a terminal frontier"
description: "This scenario validates that under the expansive mode the review divergent pivot refuses to run while a frontier node stays open, seeds one revisit direction per closed sub-target the frontier left uncovered and leaves a default run untouched, for `DRV-081`."
version: 1.13.3.0
---

# DRV-081 -- Review pivot waits for a terminal frontier

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DRV-081`.

---

## 1. OVERVIEW

This scenario validates the review divergent pivot gate for `DRV-081`. It focuses on the refusal while a frontier node is open, on the revisit directions the pivot seeds from sub-targets the frontier closed without covering every dimension, and on the default run, which keeps the pivot exactly as before.

### Why This Matters

The pivot reopens the review from a new angle. If it ran while a sub-target was still open, it would compete with the frontier for the same ground. If it ignored the sub-targets the frontier gave up on, those sub-targets would never get a second look.

---

## 2. SCENARIO CONTRACT

Operators run the commands below and confirm that the pivot waits for a terminal frontier, seeds a revisit for each closed sub-target it left uncovered, and leaves the default run alone.

- Objective: Confirm that the review pivot refuses to run while a frontier node is open, that it seeds one `frontier-unanswered` direction per closed sub-target the frontier left uncovered, and that a default run seeds no frontier direction even when its registry carries an open node.
- Real user request: Why did the review skip its divergent pivot, and does it still check the sub-targets it gave up on?
- Prompt: `Check that the deep-review divergent pivot refuses to run while a frontier node is open, seeds one revisit direction for each closed sub-target the frontier left uncovered, and leaves a default run untouched. Return a PASS or FAIL verdict with the reason.`
- Expected execution process: Run the review pivot cases by file stem, run the workflow case that gates the pivot on a terminal frontier, then read the line in the pivot script that labels a seed `frontier-unanswered`.
- Expected signals: The four pivot cases pass. The refusal case throws for an open node. The seed case creates one direction for the exhausted sub-target and none for the answered one. The default-run case keeps no frontier direction. The verb-scope case keeps a seed whose scope path names a mutation verb. The workflow gate case passes, and the pivot script labels the seed `frontier-unanswered`.
- Desired user-visible outcome: The operator can say the pivot waited until the frontier closed, and each sub-target the frontier gave up on got one revisit direction.
- Pass/fail: PASS if the pivot cases, the gate case and the seed label all pass or print; FAIL if the pivot runs while a node is open, an answered sub-target gets a revisit, or a default run seeds a frontier direction.

---

## 3. TEST EXECUTION

### Prerequisites

- Working directory is the repository root.
- The `runtime/` vitest suites are installed under `.skilled/skills/system-deep-loop/runtime`.

### Prompt

- Prompt: `Check that the deep-review divergent pivot refuses to run while a frontier node is open, seeds one revisit direction for each closed sub-target the frontier left uncovered, and leaves a default run untouched. Return a PASS or FAIL verdict with the reason.`

### Commands

1. `cd .skilled/skills/system-deep-loop/runtime && npx vitest run divergent-pivot.vitest -t "review divergent pivot under the expansive depth mode" --reporter=verbose`
2. `cd .skilled/skills/system-deep-loop/runtime && npx vitest run stop-decision-yaml-contract.vitest -t "gates the divergent pivot on a terminal review frontier" --reporter=verbose`
3. `rg -n "frontier-unanswered" .skilled/skills/system-deep-loop/deep-review/scripts/divergent-review-pivot.ts`

### Expected

Command 1 prints `Tests  4 passed` (the rest of the file skipped). Its four passing cases are `refuses a pivot while an open frontier node remains`, `seeds one frontier-unanswered direction per closed sub-target the frontier left uncovered`, `keeps a frontier seed whose scope path happens to name a mutation verb` and `leaves a default run untouched even when the registry still carries an open frontier node`. Command 2 prints `Tests  1 passed` (the rest of the file skipped), and the case `gates the divergent pivot on a terminal review frontier` passes. Command 3 prints one line, which sets the seed source to `frontier-unanswered`.

### Evidence

- The verbose case lines and summary lines from commands 1 and 2, with each exit status.
- The line from command 3, read from the current pivot script.

### Pass / Fail

- **Pass**: Commands 1 and 2 exit 0 with the expected counts, and command 3 prints the seed source line.
- **Fail**: The pivot runs while a node is open, an answered sub-target gets a revisit, a default run seeds a frontier direction, or command 3 prints nothing.

### Failure Triage

1. The pivot runs while a node is open: check the frontier gate in the review workflow, and count the open and active nodes in the registry it reads.
2. An answered sub-target gets a revisit: the seed must take only sub-targets the frontier closed without covering every dimension, so check the status filter in the pivot script.
3. A default run seeds a frontier direction: check that the frontier seed only runs under the expansive mode, so a default registry with a stray node stays untouched.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `feature-catalog/` | `feature-catalog/loop-lifecycle/expansive-depth-mode.md` covers the `deep-review` expansive depth mode; the implementation anchors below are the contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.skilled/skills/system-deep-loop/deep-review/scripts/divergent-review-pivot.ts` | The frontier gate, and the `frontier-unanswered` seed for closed sub-targets |
| `.skilled/commands/deep/assets/deep-review.yaml` | The `frontier_gate` on the divergent pivot, which allows it only on a terminal frontier |
| `divergent-pivot.vitest` | The refusal, the revisit seed and the default-run cases for the review pivot |
| `stop-decision-yaml-contract.vitest` | The workflow case that gates the pivot on a terminal review frontier |

---

## 5. SOURCE METADATA

- Group: CONVERGENCE AND RECOVERY
- Playbook ID: DRV-081
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `convergence-and-recovery/review-pivot-gates-on-terminal-frontier.md`
