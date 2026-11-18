---
title: "DLR-065 -- frontier-admit.cjs"
description: "This scenario validates the frontier-admit.cjs CLI: seed writes depth-1 nodes and reports the budget, admit prunes a proposal with its reason, close appends a status row, and a pruned node cannot be closed as live, for `DLR-065`."
version: 1.0.0.0
---

# DLR-065 -- frontier-admit.cjs

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DLR-065`.

---

## 1. OVERVIEW

This scenario validates the `frontier-admit.cjs` command line. It focuses on the `seed`, `admit` and `close` commands and on the refusal to revive a pruned node.

### Why This Matters

The expansive workflows reach the frontier node store only through this script. A drift in its output, its exit codes or its close rule would let a pruned proposal count as live work and hold a run open, or let the seed step report a budget the run never uses.

---

## 2. SCENARIO CONTRACT

Operators run the exact commands below against a scratch directory and confirm each output and exit status.

- Objective: Confirm that `seed` admits depth-1 nodes and prints the budget notice, that `admit` admits a proposal with evidence and prunes one without as `relevance`, that `close` appends a row, and that closing a pruned node as `answered` exits 2.
- Real user request: Show me the frontier store CLI doing a seed, an admission with a prune and a close, and prove a pruned node cannot be brought back.
- Prompt: `Validate frontier-admit.cjs: seed two nodes, admit one proposal and prune one, close the admitted node, and try to close the pruned one. Return a PASS or FAIL verdict with the reason.`
- Expected execution process: Run the unit suites by file stem, then run the CLI sequence in a scratch directory and read each output.
- Expected signals: `seed` prints `[frontier-admit] budget after seed 10 iterations, 3 growth slots` on stderr and admits `F-1-001` and `F-1-002`. `admit` admits `F-2-003` and prunes `F-2-004` with reason `relevance`. `close` prints the `F-2-003` row with status `answered`. The close of `F-2-004` prints `[frontier-admit] frontier node F-2-004 was pruned; it cannot be closed as answered` and exits 2.
- Desired user-visible outcome: The operator can say the store records every outcome, and a pruned node stays pruned.
- Pass/fail: PASS if the suites pass and every CLI step prints its expected output and exit status; FAIL if a step differs, or the pruned close succeeds.

---

## 3. TEST EXECUTION

### Prerequisites

- Working directory is the repository root.
- The `runtime/` vitest suites are installed under `.skilled/skills/system-deep-loop/runtime`.
- A scratch directory `<tmp>` outside the repository, holding `seed.json` and `delta.jsonl` as below.

`seed.json`:

```json
[{"question":"Which module owns admission?","scope":"runtime/lib","evidence":"runtime/lib/a.ts:10"},
 {"question":"Which caps does admission read?","scope":"runtime/lib","evidence":"runtime/lib/b.ts:4"}]
```

`delta.jsonl`, one row with evidence and one without:

```json
{"type":"frontier_proposal","parentId":"F-1-001","question":"Which file holds the cycle check?","scope":"runtime/lib","evidence":"runtime/lib/c.ts:7"}
{"type":"frontier_proposal","parentId":"F-1-001","question":"Which file holds the depth check?","scope":"runtime/lib","evidence":""}
```

### Prompt

- Prompt: `Validate frontier-admit.cjs: seed two nodes, admit one proposal and prune one, close the admitted node, and try to close the pruned one. Return a PASS or FAIL verdict with the reason.`

### Commands

1. `cd .skilled/skills/system-deep-loop/runtime && npx vitest run frontier-admit.vitest frontier-admit-review.vitest`
2. `node .skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs seed --artifact-dir <tmp> --input <tmp>/seed.json --iteration 0`
3. `node .skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs admit --artifact-dir <tmp> --input <tmp>/delta.jsonl --iteration 1`
4. `node .skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs close --artifact-dir <tmp> --node-id F-2-003 --status answered --iteration 2`
5. `node .skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs close --artifact-dir <tmp> --node-id F-2-004 --status answered --iteration 2`

### Expected

Command 1 exits 0 with every case passing. Command 2 prints the budget notice on stderr and `{"admitted":["F-1-001","F-1-002"],"pruned":[],"derivedMaxIterations":10,"growthSlots":3}` on stdout, exit 0. Command 3 prints `{"admitted":["F-2-003"],"pruned":[{"nodeId":"F-2-004","reason":"relevance"}]}`, exit 0. Command 4 prints the `F-2-003` row with `"status":"answered"`, exit 0. Command 5 prints the pruned-node refusal on stderr and exits 2. `<tmp>/frontier-nodes.jsonl` then holds five rows: two seeds, the admitted node, the pruned node and the close.

### Evidence

- The vitest summary line and exit status for command 1.
- The stdout, stderr and exit status of commands 2 to 5.
- The row count of `<tmp>/frontier-nodes.jsonl` after command 5.

### Pass / Fail

- **Pass**: Every command prints its expected output and exit status, and the store holds five rows.
- **Fail**: A step's output or exit status differs, the pruned close succeeds, or any unit case fails.

### Failure Triage

- The pruned close succeeds: check that `closeNode` reads the node's current status before it appends.
- The proposal without evidence is admitted: check the relevance check's evidence test in `checkProposal`.
- The budget notice is missing: check the `seed` branch of `runCli` and `seedBudget`.

---

## 4. SOURCE FILES

### Implementation

| File | Role |
|---|---|
| `.skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs` | The CLI, `seedNodes`, `admitProposals`, `checkProposal`, `closeNode` and `seedBudget` |

### Validation

| File | Role |
|---|---|
| `frontier-admit.vitest` | Check order and prune reasons, seeding, close and the pruned-close refusal, and the CLI commands |
| `frontier-admit-review.vitest` | Review relevance, seeding and the review CLI |

---

## 5. SOURCE METADATA

- Group: SCRIPT ENTRY POINTS
- Playbook ID: DLR-065
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `script-entry-points/frontier-admit-script.md`
- Feature catalog status: `feature-catalog/script-entry-points/frontier-admit-script.md` covers this scenario.
