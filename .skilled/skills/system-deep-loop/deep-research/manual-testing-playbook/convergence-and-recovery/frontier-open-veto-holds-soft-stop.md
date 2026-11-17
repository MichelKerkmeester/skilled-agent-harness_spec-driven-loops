---
title: "DR-072 -- Frontier open veto holds a soft stop"
description: "This scenario validates that under the expansive mode an open frontier node turns a composite convergence stop into CONTINUE, and that the cap, the floor, stuck recovery, convergence off and the max-iterations policy still decide first, for `DR-072`."
version: 1.16.0.0
---

# DR-072 -- Frontier open veto holds a soft stop

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DR-072`.

---

## 1. OVERVIEW

This scenario validates the `frontierOpen` veto in the stop decision. The objective is to confirm that a soft stop waits while frontier nodes stay open, and that every hard rule keeps its precedence.

### Why This Matters

A research run that answers its init questions narrowly looks converged. The veto keeps the run going while the frontier still holds open work. It must never outrank a hard limit, or a run could loop past its budget.

---

## 2. SCENARIO CONTRACT

Operators run the exact commands below and confirm the veto precedence table and the unchanged input echo.

- Objective: Confirm that an open node vetoes a composite convergence stop only under the expansive mode, and that the cap, the floor, stuck recovery, convergence off and the max-iterations policy keep their own decisions.
- Real user request: Explain why the run did not stop when it looked converged, and show that the hard limits still stop it.
- Prompt: `Check that under expansive depth mode a composite convergence stop continues while frontier nodes are open, and that the cap, the floor, stuck recovery, convergence off and the max-iterations policy still decide first. Return a PASS or FAIL verdict with the reason.`
- Expected execution process: Run the veto table by file stem, run the input echo case, then read the veto branch and the research facts in the stop-decision script.
- Expected signals: The veto table passes all eight rows. The row for open nodes returns `CONTINUE` with `frontierOpen`. The row for an empty frontier returns `STOP` with `composite_converged`. The cap, the floor, stuck recovery, convergence off and max-iterations rows keep their own decisions. The echo case passes unedited.
- Desired user-visible outcome: The operator can say a soft stop waits for open frontier nodes, and the hard limits still stop the run on time.
- Pass/fail: PASS if the table and the echo case pass and the script shows the veto after the floor; FAIL if an open node lets a stop through, or a hard limit loses to the veto.

---

## 3. TEST EXECUTION

### Prerequisites

- Working directory is the repository root.
- The `runtime/` vitest suites are installed under `.skilled/skills/system-deep-loop/runtime`.

### Prompt

- Prompt: `Check that under expansive depth mode a composite convergence stop continues while frontier nodes are open, and that the cap, the floor, stuck recovery, convergence off and the max-iterations policy still decide first. Return a PASS or FAIL verdict with the reason.`

### Commands

1. `cd .skilled/skills/system-deep-loop/runtime && npx vitest run stop-decision.vitest -t "frontierOpen veto" --reporter=verbose`
2. `cd .skilled/skills/system-deep-loop/runtime && npx vitest run stop-decision.vitest -t "echoes the input unchanged" --reporter=verbose`
3. `rg -n "frontierOpen" .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs`

### Expected

Command 1 prints `Tests  15 passed | 64 skipped (79)`. Those cases include the eight rows of the veto table, each named `expansive composite candidate: <row label>`, and every row passes. Command 2 prints `Tests  1 passed | 78 skipped (79)`, and the case `echoes the input unchanged` passes without edits. Command 3 prints the veto branch that returns `CONTINUE` with `frontierOpen`, and the research facts line that counts open and active nodes.

### Evidence

- The verbose case lines and summary line from commands 1 and 2, with each exit status.
- The `rg` lines from command 3, read from the current source.

### Pass / Fail

- **Pass**: Commands 1 and 2 exit 0 with the expected counts, and command 3 shows the veto after the floor check.
- **Fail**: An open node lets a stop through, a hard limit loses to the veto, or the echo case fails.

### Failure Triage

- An open node lets a stop through: check that the veto reads the expansive flag and the `frontierOpen` count from the research facts.
- A hard limit loses to the veto: check the order of the veto and the cap, floor and stuck checks in the decision.
- The echo case fails: check that the stop-decision config echo adds `depthMode` only for an expansive run.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs` | The `frontierOpen` veto after the minimum-iteration floor, and the research facts that count open nodes |
| `stop-decision.vitest` | The veto table, the empty-frontier case and the echo case |
| `stop-decision-yaml-contract.vitest` | The depth-mode argument on the stop-decision call |

---

## 5. SOURCE METADATA

- Group: CONVERGENCE AND RECOVERY
- Playbook ID: DR-072
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `convergence-and-recovery/frontier-open-veto-holds-soft-stop.md`
- Feature catalog status: No entry in `feature-catalog/` covers the frontier veto yet, so this scenario cites none.
