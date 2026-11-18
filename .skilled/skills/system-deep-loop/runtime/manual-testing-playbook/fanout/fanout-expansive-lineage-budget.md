---
title: "DLR-066 -- Fan-out sizes each expansive lineage from its seed share"
description: "This scenario validates that under expansive depth a fan-out lineage with no matrix iterations is sized from its own seed share, that a lineage dealt no seed node runs at its loop default, and that the stderr notes name each budget and warn when lineages outnumber the open seeds, for `DLR-066`."
version: 1.0.0.0
---

# DLR-066 -- Fan-out sizes each expansive lineage from its seed share

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DLR-066`.

---

## 1. OVERVIEW

This scenario validates the per-lineage budget `fanout-run.cjs` sets under `--depth-mode expansive`. It focuses on the seed-share budget, the loop-default floor and the notes the operator sees.

### Why This Matters

Each lineage of an expansive fan-out funds only the nodes it was dealt. A lineage sized from the whole seed would overspend, and one with no nodes would wait on work it does not hold. When there are more lineages than open seed nodes, the operator needs to know some lineages run without a frontier.

---

## 2. SCENARIO CONTRACT

Operators run the exact commands below and confirm the four budget cases and the source behind them.

- Objective: Confirm that a lineage with no matrix `iterations` value gets a budget from its own seed share, that a matrix value is kept, that a lineage dealt no seed node runs at its loop default (12 native, the workflow default for a CLI lineage), and that the notes name each derived budget and warn once when lineages outnumber the open seeds.
- Real user request: I fanned out an expansive run with three lineages and two seed nodes. Tell me what budget each lineage got, and why one runs at its default.
- Prompt: `Check that an expansive fan-out sizes each lineage from its own seed share, keeps a matrix iterations value, runs a lineage with no seed share at its loop default, and names each budget on stderr. Return a PASS or FAIL verdict with the reason.`
- Expected execution process: Run the per-lineage budget cases by name, then read the budget and note functions in the fan-out runner.
- Expected signals: The four cases pass. A research matrix of four lineages gets `[12, 10, 12, 5]`. A review lineage dealt two nodes gets 24 and one dealt none gets 7. The notes read `[fanout-run] 3 lineages share 1 open seed node, so 2 lineages get no seed share`, then one line per lineage the matrix did not size.
- Desired user-visible outcome: The operator can say each lineage's budget comes from its own share, and which lineages run at their default and why.
- Pass/fail: PASS if the cases pass and the source shows the seed-share budget with the named default; FAIL if a lineage is sized from the whole seed, a matrix value is overridden, or a lineage with no share runs at anything but its loop default.

---

## 3. TEST EXECUTION

### Prerequisites

- Working directory is the repository root.
- The `runtime/` vitest suites are installed under `.skilled/skills/system-deep-loop/runtime`.

### Prompt

- Prompt: `Check that an expansive fan-out sizes each lineage from its own seed share, keeps a matrix iterations value, runs a lineage with no seed share at its loop default, and names each budget on stderr. Return a PASS or FAIL verdict with the reason.`

### Commands

1. `cd .skilled/skills/system-deep-loop/runtime && npx vitest run fanout-run.vitest -t "per-lineage expansive budget" --reporter=verbose`
2. `rg -n "DEFAULT_LINEAGE_ITERATIONS|function expansiveLineageBudgets|function expansiveLineageBudgetNotes" .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs`

### Expected

Command 1 prints `Tests  4 passed` with the rest of the file skipped. The cases are `sizes each research lineage from its own share of the seed`, `scales a review lineage by the four dimensions it reviews and stops at the ceiling`, `names an empty seed share and warns once when lineages outnumber the open seeds` and `runs a lineage with no seed share at its loop default`. Command 2 prints the named default of 12, the budget function that keeps a matrix value and sizes the rest through `expansiveBudget`, and the note function.

### Evidence

- The verbose case lines and the summary line from command 1, with its exit status.
- The `rg` lines from command 2, read from the current source.

### Pass / Fail

- **Pass**: Command 1 exits 0 with the four cases passing, and command 2 shows the seed-share budget and the named default.
- **Fail**: A lineage is sized from the whole seed, a matrix value is overridden, a lineage with no share gets a derived budget, or any named case fails.

### Failure Triage

- A lineage is sized from the whole seed: check that the budget reads the lineage's own entry in the partition.
- A lineage with no share gets a derived budget: check that `expansiveBudget` returns the floor for zero seeded nodes.
- The warning repeats or is missing: check the count of open seed nodes in the note function.

---

## 4. SOURCE FILES

### Implementation

| File | Role |
|---|---|
| `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | `expansiveLineageBudgets`, `expansiveLineageBudgetNotes` and `DEFAULT_LINEAGE_ITERATIONS` |
| `.skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs` | `expansiveBudget` and `LOOP_DEFAULT_MAX_ITERATIONS` |

### Validation

| File | Role |
|---|---|
| `fanout-run.vitest` | The per-lineage expansive budget cases |

---

## 5. SOURCE METADATA

- Group: FAN-OUT
- Playbook ID: DLR-066
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `fanout/fanout-expansive-lineage-budget.md`
- Feature catalog status: `feature-catalog/fanout/fanout-run.md` covers the lineage budget.
