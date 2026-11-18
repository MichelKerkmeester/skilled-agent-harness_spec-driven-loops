---
title: "DRV-077 -- Expansive seed writes depth-one nodes before iteration one"
description: "This scenario validates that an expansive review run decomposes its target into depth-one sub-target nodes before iteration one, on a plain run and before fan-out spawns on a fan-out run, and that the seed writes no inbox, for `DRV-077`."
version: 1.13.2.0
---

# DRV-077 -- Expansive seed writes depth-one nodes before iteration one

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DRV-077`.

---

## 1. OVERVIEW

This scenario validates the review seed step for `DRV-077`. It focuses on the depth-one nodes the seed writes into the review node store before any iteration runs, and on where the seed sits in the workflow.

### Why This Matters

A review that starts with no sub-target nodes has nothing for the frontier to steer toward. The seed decides the first set of nodes. A seed that runs late, or that writes an inbox nothing reads, would leave the first iteration with an empty frontier.

---

## 2. SCENARIO CONTRACT

Operators run the commands below and confirm that the seed admits open depth-one nodes, that the seed runs in the right place and that no inbox file is created.

- Objective: Confirm that the review seed writes open depth-one nodes with a scope and a question, runs before iteration one and before fan-out spawns, and writes no inbox.
- Real user request: Start an expansive review and show me the sub-targets it will work through before the first pass.
- Prompt: `Check that an expansive deep-review run writes its depth-one sub-target nodes before iteration one, on a plain run and on a fan-out run, and that the seed creates no inbox file. Return a PASS or FAIL verdict with the reason.`
- Expected execution process: Run the seed case that admits open depth-one rows and writes no inbox, run the two workflow-placement cases for the seed, then read the seed step lines in the review workflow.
- Expected signals: The seed case passes with two open rows at depth one and no `inbox.jsonl` file. The placement case for the single-executor run passes, and the placement case for the fan-out run passes with the seed ahead of the fan-out spawn. The workflow seed step runs `frontier-admit.cjs seed --target review`.
- Desired user-visible outcome: The operator sees the depth-one sub-targets in the review node store before the first iteration starts, and no inbox file appears.
- Pass/fail: PASS if the three commands pass and the seed step names the review target; FAIL if a seeded node is missing its depth, an inbox file appears, or the seed runs after iteration one or after fan-out spawns.

---

## 3. TEST EXECUTION

### Prerequisites

- Working directory is the repository root.
- The `runtime/` vitest suites are installed under `.skilled/skills/system-deep-loop/runtime`.

### Prompt

- Prompt: `Check that an expansive deep-review run writes its depth-one sub-target nodes before iteration one, on a plain run and on a fan-out run, and that the seed creates no inbox file. Return a PASS or FAIL verdict with the reason.`

### Commands

1. `cd .skilled/skills/system-deep-loop/runtime && npx vitest run frontier-admit-review.vitest -t "seeds a review run" --reporter=verbose`
2. `cd .skilled/skills/system-deep-loop/runtime && npx vitest run stop-decision-yaml-contract.vitest -t "seeds the review frontier before fan-out spawns|seeds the single-executor review frontier right after the config exists" --reporter=verbose`
3. `rg -n "step_frontier_seed:" .skilled/commands/deep/assets/deep-review.yaml`

### Expected

Command 1 prints `Tests  1 passed` (the rest of the file skipped), and the case `seeds a review run, settling a candidate that carries its own prune reason` passes. That case asserts two open rows at depth one and no inbox file. Command 2 prints `Tests  2 passed` (the rest of the file skipped), with the fan-out placement case and the single-executor placement case both passing. Command 3 prints two lines: first the fan-out seed step that runs before any lineage spawns, then the single-executor seed step that runs right after the config is created so iteration one already has open nodes.

### Evidence

- The verbose case lines and summary lines from commands 1 and 2, with each exit status.
- The two `rg` lines from command 3, read from the current workflow.

### Pass / Fail

- **Pass**: Commands 1 and 2 exit 0 with the expected counts, and command 3 prints both seed steps.
- **Fail**: A seeded node has no depth, an `inbox.jsonl` file appears, a placement case fails, or command 3 prints no seed step.

### Failure Triage

1. Command 1 fails on a row count or a depth: check that the seed writes its rows at depth one, with the parent set to the root.
2. Command 1 finds an inbox file: the review seed must write only the node store, because a review run has no inbox reader.
3. Command 2 fails: the seed moved relative to the config step or the fan-out spawn. Read the workflow order in `deep-review.yaml` before judging the seed.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs` | The `seed` command, which writes the depth-one rows for the review target |
| `.skilled/commands/deep/assets/deep-review.yaml` | The `step_frontier_seed` steps: the single-executor seed after the config, and the fan-out seed before any lineage spawns |
| `frontier-admit-review.vitest` | The review seed case: open rows at depth one, no inbox |
| `stop-decision-yaml-contract.vitest` | The placement cases for the seed on both runs |

---

## 5. SOURCE METADATA

- Group: INITIALIZATION AND STATE SETUP
- Playbook ID: DRV-077
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `initialization-and-state-setup/expansive-seed-writes-depth-one-nodes.md`
