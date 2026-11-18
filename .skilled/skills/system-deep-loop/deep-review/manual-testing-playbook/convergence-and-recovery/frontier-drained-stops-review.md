---
title: "DRV-083 -- Drained frontier forms a review stop candidate"
description: "This scenario validates that under the expansive mode a review whose frontier holds no open or active node and at least one answered node forms the frontier_drained hard stop candidate, and that the legal-stop gates and every earlier stop rule still decide it, for `DRV-083`."
version: 1.0.0.0
---

# DRV-083 -- Drained frontier forms a review stop candidate

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DRV-083`.

---

## 1. OVERVIEW

This scenario validates the `frontier_drained` stop candidate in the review stop decision for `DRV-083`. The objective is to confirm that a drained frontier forms a stop candidate when neither the clean stop nor the composite vote does, that the legal-stop gates still decide it, and that it never forms on a default run or on a frontier that closed with nothing answered.

### Why This Matters

An expansive review can answer every frontier node while one active P1 keeps the clean stop off and the composite vote stays under its cutoff. Without this candidate, such a run goes to its iteration cap after its frontier work is done. The candidate must still pass the legal-stop gates, or a drained frontier could end a review that has an open P0.

---

## 2. SCENARIO CONTRACT

Operators run the commands below and confirm the drained-frontier table, the workflow stop order and the candidate line in the stop decision.

- Objective: Confirm that `frontier_drained` forms only under the expansive mode, once the frontier holds at least one node, none open or active, and at least one answered, that the legal-stop gates and the graph decision still decide it, that the cap, the floor, stuck recovery, consecutive failures, convergence off and the max-iterations policy keep their own decisions, and that the clean stop ranks first.
- Real user request: Every frontier node in my review is closed and one was answered, but a P1 is still active. Why did the review stop, and what would have kept it going?
- Prompt: `Check that under expansive depth mode a review whose frontier holds no open or active node and at least one answered node forms the frontier_drained stop candidate, that the legal-stop gates still decide it, and that a default run or a frontier closed with nothing answered forms no candidate. Return a PASS or FAIL verdict with the reason.`
- Expected execution process: Run the drained-frontier cases and the workflow stop-order cases by file stem, then read the line in the stop decision that forms the candidate.
- Expected signals: All 21 drained-frontier cases pass. The headline case returns `STOP` with stop reason `converged`, `frontier_drained` and no blocking gate. A failed hotspot gate, an active P0 and unsettled traceability each block the stop, with the named gate as the reason. An open node, an empty partition, a missing node count, a frontier with no answered node, a missing answered count and a default run each return `CONTINUE` with `noStopCandidate`. The earlier stop rules keep their own decisions. The clean stop outranks the drained candidate. The workflow prose lists `frontier_drained` after `composite_converged` and before the floor and the gates, and the research stop order does not name it.
- Desired user-visible outcome: The operator can say a drained expansive review stops without waiting for the cap, and only when the legal-stop gates allow it.
- Pass/fail: PASS if the table, the workflow cases and the candidate line all pass or print as described; FAIL if the candidate forms with an open node or nothing answered, a failed gate lets it through, or a default run forms it.

---

## 3. TEST EXECUTION

### Prerequisites

- Working directory is the repository root.
- The `runtime/` vitest suites are installed under `.skilled/skills/system-deep-loop/runtime`.

### Prompt

- Prompt: `Check that under expansive depth mode a review whose frontier holds no open or active node and at least one answered node forms the frontier_drained stop candidate, that the legal-stop gates still decide it, and that a default run or a frontier closed with nothing answered forms no candidate. Return a PASS or FAIL verdict with the reason.`

### Commands

1. `cd .skilled/skills/system-deep-loop/runtime && npx vitest run stop-decision.vitest -t "review frontier_drained candidate" --reporter=verbose`
2. `cd .skilled/skills/system-deep-loop/runtime && npx vitest run stop-decision-yaml-contract.vitest -t "drained-frontier candidate" --reporter=verbose`
3. `rg -n -F "reasonDetail: 'frontier_drained'" .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs`

### Expected

Command 1 prints `Tests  21 passed` (the rest of the file skipped). The fixture case `the fixture forms no other candidate` returns `CONTINUE` with `noStopCandidate` once the expansive flag is removed, which shows that only the drained frontier forms the stop. The case `stops a drained lineage whose gates all pass` returns `STOP` with stop reason `converged`, `frontier_drained`, graph decision `STOP_ALLOWED` and an empty `blockedBy`. The table rows name each gate, guard and earlier rule, and the row `an open node keeps the lineage running` returns `CONTINUE` with `noStopCandidate`, since the candidate does not form while a node is open. The case `ranks after the clean candidate` returns `all_dimensions_clean`. The case `counts every frontier node as the partition size` asserts that the stop input counts answered, pruned and exhausted nodes toward the node total, with one answered and none open.

Command 2 prints `Tests  2 passed` (the rest of the file skipped). One case asserts that the review stop-order prose lists `frontier_drained` after `composite_converged` and before `minIterationsNotReached` and the legal-stop gates. The other asserts that the research stop order does not contain it.

Command 3 prints the review branch line that forms the candidate as a hard stop.

The table covers the hotspot, P0 and traceability gates only. It makes no claim about the other legal-stop gates or about pause.

### Evidence

- The verbose case lines and summary line from commands 1 and 2, with each exit status.
- The line from command 3, read from the current `convergence.cjs`.

### Pass / Fail

- **Pass**: Commands 1 and 2 exit 0 with the expected pass count and no failed count, and command 3 prints the candidate line.
- **Fail**: The candidate forms with an open node or with nothing answered, a failed gate lets it through, a default run forms it, an earlier stop rule loses to it, or command 3 prints nothing.

### Failure Triage

1. The candidate forms with an open node or with nothing answered: check the conditions on the review branch, which need the expansive flag, a node total of at least one, no open node and at least one answered node.
2. A failed gate lets it through: check that the candidate is a hard stop, so the legal-stop gates run on it after the floor.
3. A default run forms it: check that the branch reads `depthMode` as `expansive` before it reads any frontier count.
4. The node total is wrong: check that the stop input counts every frontier node in the registry, not only the open ones.

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
| `.skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs` | The `frontier_drained` branch after the clean and composite candidates, and the node counts in the review stop input |
| `.skilled/commands/deep/assets/deep-review.yaml` | The review stop-order prose that lists `frontier_drained` with the candidates |
| `stop-decision.vitest` | The drained-frontier table, the clean-stop rank case and the node count case |
| `stop-decision-yaml-contract.vitest` | The stop-order case for review and the absence case for research |

---

## 5. SOURCE METADATA

- Group: CONVERGENCE AND RECOVERY
- Playbook ID: DRV-083
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `convergence-and-recovery/frontier-drained-stops-review.md`
