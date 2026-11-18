---
title: "DR-073 -- Fan-out deals seeded frontier nodes round-robin"
description: "This scenario validates that a fan-out run under the expansive mode deals the seeded depth-one nodes round-robin across its lineages, writes each lineage store before spawn and fails the merge guard when a partitioned node is missing, for `DR-073`."
version: 1.16.3.0
---

# DR-073 -- Fan-out deals seeded frontier nodes round-robin

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DR-073`.

---

## 1. OVERVIEW

This scenario validates how the expansive frontier crosses a fan-out run. The objective is to confirm that the seeded nodes are dealt across the lineages before any lineage spawns, and that the merge reports a node that no lineage holds.

### Why This Matters

Each lineage works only the nodes it holds. A node that no lineage receives is never worked, and its question stays open for the whole run. The guard makes that loss visible at merge time.

---

## 2. SCENARIO CONTRACT

Operators run the exact commands below and confirm the partition, the store write before spawn, the merge guard and the default path.

- Objective: Confirm that the depth-one nodes are dealt round-robin, that each lineage dealt at least one node has its store before it spawns, that the merge guard fails on a missing partitioned node and that a default run writes no lineage store.
- Real user request: Split this research across three lineages, and tell me whether every seeded sub-question reached one of them.
- Prompt: `Check that a fan-out research run under expansive depth mode deals the seeded depth-one nodes round-robin across its lineages, writes each lineage store before spawn, and fails the merge guard when a partitioned node is missing. Return a PASS or FAIL verdict with the reason.`
- Expected execution process: Run the partition, store-before-spawn, default-path and merge-guard cases by file stem, then read the partition helpers in the fan-out runner.
- Expected signals: The round-robin case passes. The store-before-spawn case passes. The default-path case passes and shows no lineage store. The merge guard passes when every partitioned node is reported, and fails when one is missing from every lineage. The runner writes `frontier_scope:` only under the expansive flag.
- Desired user-visible outcome: The operator can say each seeded sub-question went to one lineage before spawn, and a missing one would be named at merge.
- Pass/fail: PASS if all four named cases pass and the runner shows the partition and store helpers; FAIL if a seeded node is dealt to no lineage, a store is written after spawn or a default run writes a store.

---

## 3. TEST EXECUTION

### Prerequisites

- Working directory is the repository root.
- The `runtime/` vitest suites are installed under `.skilled/skills/system-deep-loop/runtime`.

### Prompt

- Prompt: `Check that a fan-out research run under expansive depth mode deals the seeded depth-one nodes round-robin across its lineages, writes each lineage store before spawn, and fails the merge guard when a partitioned node is missing. Return a PASS or FAIL verdict with the reason.`

### Commands

1. `cd .skilled/skills/system-deep-loop/runtime && npx vitest run fanout-run.vitest -t "round-robin" --reporter=verbose`
2. `cd .skilled/skills/system-deep-loop/runtime && npx vitest run fanout-run.vitest -t "writes the lineage store before spawn" --reporter=verbose`
3. `cd .skilled/skills/system-deep-loop/runtime && npx vitest run fanout-run.vitest -t "default depth mode" --reporter=verbose`
4. `cd .skilled/skills/system-deep-loop/runtime && npx vitest run fanout-merge.vitest -t "partitioned node" --reporter=verbose`
5. `rg -n "frontier_scope|partitionFrontierNodes|writeLineageFrontierStore" .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs`

### Expected

Command 1 prints `Tests  2 passed` (the rest of the file skipped), with the cases `deals open depth-1 nodes round-robin in node-id order` and `deals seven review frontier nodes over three seats round-robin` passing. Command 2 prints `Tests  1 passed` (the rest of the file skipped), with the case `writes the lineage store before spawn and records the partition` passing. Command 3 prints `Tests  1 passed` (the rest of the file skipped), with the case `a default depth mode writes no lineage store and records no partition` passing. Command 4 prints `Tests  4 passed` (the rest of the file skipped), with the cases `passes the guard when every partitioned node is reported` and `fails the guard when a partitioned node is missing from every lineage` passing under both the research and the review frontier merge. Command 5 prints the partition helper, the store writer and the `frontier_scope` binding.

### Evidence

- The verbose case lines and summary lines from commands 1 to 4, with each exit status.
- The `rg` lines from command 5, read from the current source.

### Pass / Fail

- **Pass**: All four commands exit 0 with the expected counts, and command 5 shows the partition and store helpers.
- **Fail**: A seeded node goes to no lineage, a store is written after spawn, a default run writes a store, or the merge guard passes a missing node.

### Failure Triage

- A seeded node goes to no lineage: check the round-robin deal over node-id order in the partition helper.
- A store appears after spawn: check that the store writer runs in the lineage worker before the prompt is built and spawned.
- The merge guard passes a missing node: check that the guard reads the partition recorded in the orchestration summary.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | `partitionFrontierNodes`, `writeLineageFrontierStore`, the `frontier_scope` binding and the recorded partition |
| `.skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs` | `mergeResearchFrontier` and the partition guard |
| `fanout-run.vitest` | Round-robin deal, store before spawn, default path with no store |
| `fanout-merge.vitest` | Guard passes when every node is reported and fails when one is missing |

---

## 5. SOURCE METADATA

- Group: FAN-OUT
- Playbook ID: DR-073
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `fanout/fanout-frontier-partition-round-robin.md`
- Feature catalog status: `feature-catalog/convergence/expansive-depth-mode.md` covers the fan-out frontier partition in its Fan-Out section.
