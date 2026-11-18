---
title: "DR-074 -- Frontier graph mirror closes unanswered nodes as claims"
description: "This scenario validates that under the expansive mode the frontier node store is mirrored into the coverage graph, that a pruned node never reaches the graph, and that a node closed without an answer is re-kinded from QUESTION to a closed CLAIM, for `DR-074`."
version: 1.0.0.0
---

# DR-074 -- Frontier graph mirror closes unanswered nodes as claims

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DR-074`.

---

## 1. OVERVIEW

This scenario validates the step that mirrors the expansive frontier into the coverage graph. The objective is to confirm that `frontier-admit.cjs graph` projects the node store into graph events, that `upsert.cjs` accepts them, and that a node closed without an answer stops counting as an open question.

### Why This Matters

Question coverage and source diversity divide by every QUESTION node in the graph. A node that closed exhausted, blocked or abstained would hold both signals down for the rest of the run if it stayed a QUESTION. The mirror re-kinds such a node to a CLAIM marked closed, so the graph signals reflect the work that is still open.

---

## 2. SCENARIO CONTRACT

Operators run the commands below and confirm the projection rules, the workflow wiring and the end-to-end upsert.

- Objective: Confirm that a pruned node is never written, that an open node stays a QUESTION, that an exhausted node becomes a closed CLAIM that leaves coverage and source diversity at their base values, that a child links to its parent by `DERIVED_FROM`, and that the workflow step runs both commands and skips the upsert when no node is projected.
- Real user request: Show me that the frontier reaches the coverage graph, and that a sub-question the run gave up on no longer drags the coverage numbers down.
- Prompt: `Check that under expansive depth mode the frontier node store is mirrored into the coverage graph, that a pruned node never reaches the graph, that a node closed without an answer becomes a closed CLAIM instead of a QUESTION, and that the upsert is skipped when no node is projected. Return a PASS or FAIL verdict with the reason.`
- Expected execution process: Run the projection cases, the workflow order case and the end-to-end mirror case by file stem, then read the closed status set in the admission helper and the skip condition on the workflow step.
- Expected signals: The five projection cases pass. The workflow case finds the mirror step right after `step_graph_upsert`, running `frontier-admit.cjs graph` and `upsert.cjs`. The end-to-end case inserts two nodes and one edge from an open node and an exhausted child. The closed status set names `blocked`, `exhausted` and `abstained`. The step skips its second command when the first one reports no nodes.
- Desired user-visible outcome: The operator can say the frontier reaches the graph on every expansive iteration, and that a node closed without an answer no longer lowers question coverage or source diversity.
- Pass/fail: PASS if every command passes or prints as described; FAIL if a pruned node reaches the graph, a closed unanswered node stays a QUESTION, or the step runs the upsert with no nodes to write.

---

## 3. TEST EXECUTION

### Prerequisites

- Working directory is the repository root.
- The `runtime/` vitest suites are installed under `.skilled/skills/system-deep-loop/runtime`.

### Prompt

- Prompt: `Check that under expansive depth mode the frontier node store is mirrored into the coverage graph, that a pruned node never reaches the graph, that a node closed without an answer becomes a closed CLAIM instead of a QUESTION, and that the upsert is skipped when no node is projected. Return a PASS or FAIL verdict with the reason.`

### Commands

1. `cd .skilled/skills/system-deep-loop/runtime && npx vitest run frontier-admit.vitest -t "frontier graph close rule" --reporter=verbose`
2. `cd .skilled/skills/system-deep-loop/runtime && npx vitest run stop-decision-yaml-contract.vitest -t "mirrors the frontier into the graph after the leaf graph upsert" --reporter=verbose`
3. `cd .skilled/skills/system-deep-loop/runtime && npx vitest run workflow-restart-lifecycle.vitest -t "upserts every node and edge of a multi-node frontier" --reporter=verbose`
4. `rg -n -A3 "UNANSWERED_CLOSE_STATUSES = new Set" .skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs`
5. `rg -n -F 'skip_second_command_when: "the first command prints nodes 0"' .skilled/commands/deep/assets/deep-research.yaml`

### Expected

Command 1 prints `Tests  5 passed` (the rest of the file skipped). The cases are `never writes a pruned node`, `an open frontier QUESTION lowers coverage until it closes`, `an exhausted node is re-kinded so coverage and source diversity return to the base values`, `links a child to its parent with DERIVED_FROM` and `the graph CLI writes one JSON array the graph upsert can parse`. The re-kinded case asserts kind `CLAIM` with `verification_status` set to `closed`. The CLI case asserts a JSON summary whose `nodes` is 1 and an events file that holds one JSON array.

Command 2 prints `Tests  1 passed` (the rest of the file skipped). That case asserts that `step_frontier_graph_upsert` comes right after `step_graph_upsert` and that its command holds both `frontier-admit.cjs graph` and `upsert.cjs`.

Command 3 prints `Tests  1 passed` (the rest of the file skipped). That case renders the workflow step and runs both commands against a temp graph database. It asserts `insertedNodes` 2 and `insertedEdges` 1: one QUESTION, one closed CLAIM and the `DERIVED_FROM` edge between them.

Command 4 prints the set that the projection treats as closed without an answer, with the three statuses `blocked`, `exhausted` and `abstained`. Command 5 prints the skip condition on the mirror step. The graph command prints a JSON summary, so a projection with no nodes reports `nodes` as 0 and the upsert does not run.

The tests re-kind only an `exhausted` node. The `blocked` and `abstained` statuses come from the code read in command 4. No test runs the zero-node skip, so command 5 is a read of the workflow contract, not a run.

### Evidence

- The verbose case lines and summary line from commands 1 to 3, with each exit status.
- The lines from commands 4 and 5, read from the current files.

### Pass / Fail

- **Pass**: Commands 1 to 3 exit 0 with the expected pass count and no failed count, command 4 names all three closed statuses, and command 5 prints the skip condition.
- **Fail**: A pruned node reaches the graph, a closed unanswered node stays a QUESTION, the mirror step moves away from the leaf graph upsert, or command 4 or 5 prints nothing.

### Failure Triage

1. A pruned node reaches the graph: check that the projection skips a row whose status is `pruned` before it writes a node event.
2. A closed unanswered node stays a QUESTION: check that its status is in the closed set from command 4, and that the projection reads that set when it picks the node kind.
3. The upsert rejects the events file: check that the graph command writes one JSON array, since the upsert parses the file as a single JSON value.
4. The upsert runs with no nodes: check the skip condition from command 5 and the `nodes` count in the graph command's summary.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `feature-catalog/` | `feature-catalog/convergence/expansive-depth-mode.md` covers the frontier graph mirror; the implementation anchors below are the contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs` | `buildFrontierGraphEvents`, the closed status set and the `graph` command that writes the events file |
| `.skilled/commands/deep/assets/deep-research.yaml` | `step_frontier_graph_upsert`, its two commands and the skip condition on the second one |
| `frontier-admit.vitest` | The projection cases: pruned, open, exhausted, the parent edge and the CLI output |
| `stop-decision-yaml-contract.vitest` | The workflow case that places the mirror step after the leaf graph upsert |
| `workflow-restart-lifecycle.vitest` | The end-to-end case that runs both commands against a temp graph database |

---

## 5. SOURCE METADATA

- Group: ITERATION EXECUTION AND STATE DISCIPLINE
- Playbook ID: DR-074
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `iteration-execution-and-state-discipline/frontier-graph-mirror-closes-unanswered-nodes.md`
- Feature catalog status: `feature-catalog/convergence/expansive-depth-mode.md` covers the frontier graph mirror under expansive depth mode.
