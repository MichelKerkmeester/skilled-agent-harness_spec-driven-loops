---
title: "DRV-080 -- Frontier open veto holds a review stop, hard stops included"
description: "This scenario validates that under the expansive mode an open or active review frontier node turns a stop candidate into CONTINUE, hard stop candidates included, and that the cap, the floor, stuck recovery, convergence off and the max-iterations policy still decide first, for `DRV-080`."
version: 1.13.0.0
---

# DRV-080 -- Frontier open veto holds a review stop, hard stops included

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DRV-080`.

---

## 1. OVERVIEW

This scenario validates the `frontierOpen` veto in the review stop decision for `DRV-080`. The objective is to confirm that a review stop waits while frontier nodes stay open, that the veto covers the clean stop that counts as a hard stop, and that every hard limit keeps its precedence.

### Why This Matters

A review that has checked every configured dimension looks finished. The veto keeps the review going while a sub-target is still open. It must never outrank a hard limit, or a review could loop past its budget. It must also cover the clean stop, or the veto would hold back only the soft stops.

---

## 2. SCENARIO CONTRACT

Operators run the commands below and confirm the review veto table and the guard line that makes review candidates vetoable.

- Objective: Confirm that an open node vetoes a review stop candidate only under the expansive mode, that the veto covers `all_dimensions_clean`, which is a hard stop, and that the cap, the floor, stuck recovery, convergence off and the max-iterations policy keep their own decisions.
- Real user request: The review said it was clean, but it kept going. Why, and do the hard limits still stop it on time?
- Prompt: `Check that under expansive depth mode a review stop candidate continues while frontier nodes are open, including the clean stop, and that the cap, the floor, stuck recovery, convergence off and the max-iterations policy still decide first. Return a PASS or FAIL verdict with the reason.`
- Expected execution process: Run the review veto table and the composite case by file stem, read the guard line that marks review candidates vetoable, then read the veto branch that sits after the floor check.
- Expected signals: All eight table rows pass. The row for open nodes returns `CONTINUE` with `frontierOpen` for the clean stop. The row for an empty frontier returns `STOP` with `all_dimensions_clean`. The cap, floor, stuck recovery, convergence off and max-iterations rows keep their own decisions. The composite case returns `CONTINUE` with `frontierOpen` while nodes are open and `STOP` with `composite_converged` once they drain. The guard line makes every review candidate vetoable.
- Desired user-visible outcome: The operator can say a review waits for its open sub-targets, clean stop included, and the hard limits still stop the run on time.
- Pass/fail: PASS if the table, the composite case and the guard line all pass or print as described; FAIL if an open node lets a review stop through, or a hard limit loses to the veto.

---

## 3. TEST EXECUTION

### Prerequisites

- Working directory is the repository root.
- The `runtime/` vitest suites are installed under `.skilled/skills/system-deep-loop/runtime`.

### Prompt

- Prompt: `Check that under expansive depth mode a review stop candidate continues while frontier nodes are open, including the clean stop, and that the cap, the floor, stuck recovery, convergence off and the max-iterations policy still decide first. Return a PASS or FAIL verdict with the reason.`

### Commands

1. `cd .skilled/skills/system-deep-loop/runtime && npx vitest run stop-decision.vitest -t "expansive review candidate|vetoes a composite review stop while the frontier is open" --reporter=verbose`
2. `rg -n -F "loopType === 'review' || !candidate.hardStop" .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs`

### Expected

Command 1 prints `Tests  9 passed | 83 skipped (92)`. The eight table rows are named `expansive review candidate: <row label>`, and the composite case is `vetoes a composite review stop while the frontier is open`. The row `open nodes veto the clean stop` returns `CONTINUE` with `frontierOpen`, and the row `an empty frontier lets the clean stop through` returns `STOP` with `all_dimensions_clean`. Command 2 prints one line, 1191, which sets `vetoable` to true for every review loop and for any research candidate that is not a hard stop.

The table covers the cap, the floor, stuck recovery, convergence off and the max-iterations policy. It does not cover consecutive failures or pause, so this scenario makes no claim about those two.

### Evidence

- The verbose case lines and summary line from command 1, with its exit status.
- The line from command 2, read from the current `convergence.cjs`.

### Pass / Fail

- **Pass**: Command 1 exits 0 with its nine cases passing, and command 2 prints the guard line.
- **Fail**: An open node lets a review stop through, the clean stop escapes the veto, a hard limit loses to the veto, or command 2 prints nothing.

### Failure Triage

1. An open node lets a review stop through: check that the veto reads the expansive flag and the count of open or active nodes from the review facts.
2. The clean stop escapes the veto: check the guard on line 1191. A review loop must stay vetoable whatever the candidate's `hardStop` value.
3. A hard limit loses to the veto: check the order of the veto and the cap, floor and stuck checks in the decision, since the veto must come after the floor.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs` | The `frontierOpen` veto after the minimum-iteration floor, and the guard that makes review candidates vetoable |
| `stop-decision.vitest` | The review veto table, the composite case and the empty-frontier case |

---

## 5. SOURCE METADATA

- Group: CONVERGENCE AND RECOVERY
- Playbook ID: DRV-080
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `convergence-and-recovery/frontier-open-veto-holds-review-stop.md`
