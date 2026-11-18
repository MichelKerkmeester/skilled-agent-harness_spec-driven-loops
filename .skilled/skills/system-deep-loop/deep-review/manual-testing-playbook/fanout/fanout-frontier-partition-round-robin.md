---
title: "DRV-082 -- Review fan-out deals seeded frontier nodes round-robin"
description: "This scenario validates that a review fan-out run under the expansive mode deals its seeded depth-one nodes round-robin across its lineages, writes each lineage store without an inbox and reports a missing node through the merge guard, for `DRV-082`."
version: 1.13.4.0
---

# DRV-082 -- Review fan-out deals seeded frontier nodes round-robin

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DRV-082`.

---

## 1. OVERVIEW

This scenario validates how a review fan-out run splits its depth-one nodes across lineages and checks the split at merge time for `DRV-082`. It focuses on the round-robin deal in node-id order, on each lineage's node store, which is written before the lineage spawns and carries no inbox, and on the merge guard that names a dealt node no lineage reports.

### Why This Matters

A fan-out review that drops a sub-target without saying so looks complete. The partition makes each node belong to one lineage, and the guard makes a lost node visible at merge time instead of letting the merged frontier look finished.

---

## 2. SCENARIO CONTRACT

Operators run the commands below and confirm that the deal is round-robin, that each lineage store is written before spawn, that a default run deals nothing and that the merge guard names a missing node.

- Objective: Confirm that depth-one nodes are dealt round-robin in node-id order across lineages, that each lineage store is written with no inbox, that a default lineage prompt gains no depth-mode bytes and that the merge guard fails and names a dealt node that no lineage reports.
- Real user request: Split the review across lineages and show me that no sub-target is dropped.
- Prompt: `Check that a review fan-out run under expansive depth mode deals its depth-one nodes round-robin across its lineages, writes each lineage store without an inbox and fails the merge guard when a dealt node reaches no lineage. Return a PASS or FAIL verdict with the reason.`
- Expected execution process: Run the review fan-out cases by file stem, run the review merge cases by describe name, then read the partition helper, the store writer and the guard line in the fan-out and merge scripts.
- Expected signals: Seven nodes deal to the three lineages as left `F-1-001`, `F-1-004`, `F-1-007`, center `F-1-002`, `F-1-005` and right `F-1-003`, `F-1-006`. The lineage store lands at the lineage directory root with no `inbox.jsonl` file. The default lineage prompt gains no depth-mode bytes. The merge guard passes when every dealt node is reported. It fails with the missing identifier when one is not reported, and with every dealt id when a partition was recorded and no review lineage reports a frontier. The merge output carries `frontier_partition_guard`.
- Desired user-visible outcome: The operator can say every seeded sub-target reached a lineage, or the merge names the one that did not.
- Pass/fail: PASS if the fan-out cases, the merge cases and the guard line pass or print; FAIL if the deal is not round-robin, a lineage store is missing before spawn, an inbox appears for a review lineage, or a missing node passes the guard.

---

## 3. TEST EXECUTION

### Prerequisites

- Working directory is the repository root.
- The `runtime/` vitest suites are installed under `.skilled/skills/system-deep-loop/runtime`.

### Prompt

- Prompt: `Check that a review fan-out run under expansive depth mode deals its depth-one nodes round-robin across its lineages, writes each lineage store without an inbox and fails the merge guard when a dealt node reaches no lineage. Return a PASS or FAIL verdict with the reason.`

### Commands

1. `cd .skilled/skills/system-deep-loop/runtime && npx vitest run fanout-run.vitest -t "deals seven review frontier nodes|writes a review lineage store without an inbox|binds a review frontier scope|adds no depth-mode bytes to a default review lineage prompt" --reporter=verbose`
2. `cd .skilled/skills/system-deep-loop/runtime && npx vitest run fanout-merge.vitest -t "review frontier merge" --reporter=verbose`
3. `rg -n "partitionFrontierNodes|writeLineageFrontierStore|frontier_scope" .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs`
4. `rg -n -F "frontier_partition_guard_failed" .skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs`

### Expected

Command 1 prints `Tests  4 passed` (the rest of the file skipped). The round-robin case asserts the deal above, the store case asserts a `frontier-nodes.jsonl` file at the lineage directory root with no `inbox.jsonl`, the scope case asserts the `frontier_scope` binding beside `review_focus`, and the default case asserts no depth-mode bytes in the lineage prompt. Command 2 prints `Tests  6 passed` (the rest of the file skipped). Its cases pass the guard when every dealt node is reported, fail it with `missing: ['F-1-004']` when one is not, fail it with every dealt id when a partition was recorded but no review lineage reports a frontier, merge each lineage frontier with its label, give every merged node a lineage-qualified id when lineages number their children alike and add no frontier key when no review lineage has one. Command 3 prints the partition helper, the store writer, the `frontier_scope` prompt bindings and the store call, which passes `inbox: false` for a review lineage. Command 4 prints one line, which writes the `frontier_partition_guard_failed` warning with the missing identifiers.

### Evidence

- The verbose case lines and summary lines from commands 1 and 2, with each exit status.
- The `rg` lines from commands 3 and 4, read from the current scripts.

### Pass / Fail

- **Pass**: Commands 1 and 2 exit 0 with the expected counts, and commands 3 and 4 print their lines.
- **Fail**: The deal is not round-robin in node-id order, a review lineage gets an inbox, a missing node passes the guard, or command 4 prints nothing.

### Failure Triage

1. The deal differs from the round-robin order: check the partition helper, which must take the open or active depth-one nodes, sort them by node id and then deal them across the labels in turn.
2. A lineage store lands in the wrong place or appears with an inbox: the lineage store belongs at `lineages/<label>/frontier-nodes.jsonl`, and a review lineage must not receive an inbox.
3. The merge guard stays silent on a missing node: check that the guard reads the recorded partition from the orchestration summary, and that the merged output carries `frontier_partition_guard`.

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
| `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | The partition helper, the lineage store writer, the `frontier_scope` binding and the recorded `frontier_partition` |
| `.skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs` | The review merge of lineage frontiers, the partition guard and the `frontier_partition_guard_failed` warning |
| `fanout-run.vitest` | The round-robin deal, the lineage store without an inbox, the frontier scope binding and the default lineage prompt |
| `fanout-merge.vitest` | The review frontier merge and the guard cases |

---

## 5. SOURCE METADATA

- Group: FAN-OUT
- Playbook ID: DRV-082
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `fanout/fanout-frontier-partition-round-robin.md`
