---
title: "DRV-078 -- Frontier admission prunes each proposal with its reason"
description: "This scenario validates that each failing admission check prunes a review proposal with that check's own reason, that a seed candidate arrives settled with its prune reason, and that the review workflow names `merge-no-own-diff` and `generated-artifact` as seed prune reasons, for `DRV-078`."
version: 1.13.4.0
---

# DRV-078 -- Frontier admission prunes each proposal with its reason

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DRV-078`.

---

## 1. OVERVIEW

This scenario validates the admission gate of the review frontier for `DRV-078`. It focuses on the seven checks in their fixed order (relevance, dedupe, depth, fanout, node-cap, budget and cycle), on the reason each one records when it prunes, and on the seed path, where a candidate that already carries a prune reason is settled without an admission check.

### Why This Matters

A pruned proposal that loses its reason looks like a lost sub-target. The reason tells the operator whether the review skipped a sub-target on purpose. A merge commit with no diff of its own, a generated index rebuild and a proposal that repeats a node the frontier already holds all look the same without it.

---

## 2. SCENARIO CONTRACT

Operators run the commands below and confirm that each failing check names its own reason, and that the seed records a settled sub-target with the reason the workflow gives it.

- Objective: Confirm that the first failing admission check prunes a proposal under that check's own reason, and that a seed candidate carrying a prune reason is recorded as pruned with that reason and admits nothing else.
- Real user request: Show me why the review skipped a sub-target, and whether the skip was on purpose.
- Prompt: `Check that each failing deep-review admission check prunes its proposal with that check's own reason, and that a seed candidate with a prune reason is recorded as pruned with that reason. Return a PASS or FAIL verdict with the reason.`
- Expected execution process: Run the per-check prune cases by file stem, run the seed-settlement case and the root-cap case, then read the two workflow lines that name the seed prune reasons and the line in the admit script that reads a candidate's prune reason.
- Expected signals: Seven prune cases pass, one for each of relevance (twice), dedupe, depth, fanout, budget and cycle. The root-cap case prunes a child past the run-wide cap as `node-cap`. The seed case passes with one candidate pruned as `merge-no-own-diff` and two admitted. The workflow names `merge-no-own-diff` and `generated-artifact`. The admit script reads `pruneReason` only from a review candidate.
- Desired user-visible outcome: The operator can say which check stopped each proposal, and whether a seed sub-target was settled on purpose or left out by mistake.
- Pass/fail: PASS if the prune cases, the seed case, the root-cap case and the workflow lines all pass or print; FAIL if a check prunes under another check's reason, or a settled seed candidate is admitted.

---

## 3. TEST EXECUTION

### Prerequisites

- Working directory is the repository root.
- The `runtime/` vitest suites are installed under `.skilled/skills/system-deep-loop/runtime`.

### Prompt

- Prompt: `Check that each failing deep-review admission check prunes its proposal with that check's own reason, and that a seed candidate with a prune reason is recorded as pruned with that reason. Return a PASS or FAIL verdict with the reason.`

### Commands

1. `cd .skilled/skills/system-deep-loop/runtime && npx vitest run frontier-admit-review.vitest -t "prunes with" --reporter=verbose`
2. `cd .skilled/skills/system-deep-loop/runtime && npx vitest run frontier-admit-review.vitest -t "seeds a review run, settling a candidate" --reporter=verbose`
3. `rg -n "generated-artifact" .skilled/commands/deep/assets/deep-review.yaml`
4. `rg -n -F "candidate.pruneReason" .skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs`
5. `cd .skilled/skills/system-deep-loop/runtime && npx vitest run frontier-admit-review.vitest -t "admits every depth-1 seed under the root cap" --reporter=verbose`

### Expected

Command 1 prints `Tests  7 passed` (the rest of the file skipped), with one passing case for each of relevance (twice), dedupe, depth, fanout, budget and cycle. Command 2 prints `Tests  1 passed` (the rest of the file skipped), and the case `seeds a review run, settling a candidate that carries its own prune reason` passes. Command 3 prints two lines that each name `{"pruneReason":"generated-artifact"}`. Command 4 prints one line, which reads the candidate's `pruneReason` only when the target is the review. Command 5 prints `Tests  1 passed` (the rest of the file skipped), and the case admits every depth-1 seed under the root cap, then prunes the next child as `node-cap`.

No case names `generated-artifact` itself. The seed accepts any non-empty reason, so `generated-artifact` takes the same path as `merge-no-own-diff`, which command 2 covers. The verdict does not claim a unit case for `generated-artifact`.

### Evidence

- The verbose case lines and summary lines from commands 1, 2 and 5, with each exit status.
- The `rg` lines from commands 3 and 4, read from the current workflow and script.

### Pass / Fail

- **Pass**: Commands 1, 2 and 5 exit 0 with the expected counts, and commands 3 and 4 each print their lines.
- **Fail**: A check prunes under another check's reason, the settled seed candidate is admitted, or the workflow no longer names a seed prune reason.

### Failure Triage

1. A check prunes under another check's reason: the first failing check must set the reason. Compare the failing field in that case with the reason the check returned.
2. Command 2 shows no pruned row: the seed reads the candidate's `pruneReason` only under the review target, so check that the seed call passes `--target review`.
3. Command 3 prints no line: the workflow changed its reason spelling. Update this scenario and the seed step together, so they name the same reasons.

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
| `.skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs` | The seven admission checks, each returning its own reason, and the seed branch that settles a candidate with `pruneReason` |
| `.skilled/commands/deep/assets/deep-review.yaml` | The `step_frontier_seed` instruction that names `merge-no-own-diff` and `generated-artifact` |
| `frontier-admit-review.vitest` | The per-check prune cases for the review target and the seed settlement case |
| `frontier-admit.vitest` | The same per-check prune table on the shared admission function |

---

## 5. SOURCE METADATA

- Group: ITERATION EXECUTION AND STATE DISCIPLINE
- Playbook ID: DRV-078
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `iteration-execution-and-state-discipline/frontier-admission-prunes-with-reasons.md`
