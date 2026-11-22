---
title: "MTP-005 -- Persist the scenario result"
description: "Validates that a finished manual run saves its verdict, reason and evidence path into the owning skill's benchmark folder through record-playbook-run.cjs."
version: 1.2.1.0
---

# MTP-005 -- Persist the scenario result

This document captures the operator contract for `MTP-005`.

---

## 1. OVERVIEW

This scenario validates the result-storage contract for a completed manual scenario. It checks that the verdict, reason and evidence path reach the owning skill's `benchmark/reports/` through `scripts/record-playbook-run.cjs`, the one writer for run folders, instead of a report written by hand.

### Why This Matters

A playbook run has no durable value if its outcome stays in chat. The recorder checks each verdict against the playbook, writes the dated run folder and adds the run to the folder index, so a later operator can find it.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `MTP-005` and confirm that the result record is durable.

- Objective: save a PASS outcome for MTP-004 through the recorder with its evidence path
- Realistic user request: `The operator ran MTP-004. Record its PASS result with the evidence path so the run can be audited later.`
- Prompt: `The operator ran MTP-004. Record its PASS result with the evidence path so the run can be audited later.`
- Expected execution process: write a one-row verdict CSV, run the recorder against this mode's playbook, then read the new run folder and the index row it added.
- Expected signals: the recorder exits zero, the run folder holds `results.csv`, `README.md` and `source.md`, and the index lists the run first.
- Desired user-visible outcome: a later operator can find the verdict, reason and evidence path in the run folder.
- Pass/fail: PASS if the recorder saves the outcome and the index row. FAIL if the result remains only in the conversation, the recorder refuses a valid row or a run folder is written by hand.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `The operator ran MTP-004. Record its PASS result with the evidence path so the run can be audited later.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| MTP-005 | Persist the scenario result | Save a PASS outcome through the recorder with its evidence path | `The operator ran MTP-004. Record its PASS result with the evidence path so the run can be audited later.` | 1. `bash: printf 'scenario_id,verdict,reason,evidence\nMTP-004,PASS,operator contract validator passed,<evidence file>\n' > <scratch>/verdicts.csv` -> 2. `bash: node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/record-playbook-run.cjs --playbook .skilled/skills/sk-doc/sk-create-manual-testing-playbook/manual-testing-playbook --results <scratch>/verdicts.csv --label manual-testing-playbook--operator-contract --executor "<runtime and model>"` -> 3. `bash: ls .skilled/skills/sk-doc/sk-create-manual-testing-playbook/benchmark/reports/ && grep -m1 -n -- '--manual-testing-playbook--' .skilled/skills/sk-doc/sk-create-manual-testing-playbook/benchmark/reports/README.md` | Step 1: the CSV holds one MTP-004 row. Step 2: the recorder prints `wrote` lines and exits zero. Step 3: the new dated folder is listed and the index names it first | The exact prompt, the CSV, the recorder output and exit status and the new folder's three files | PASS if the recorder saves the PASS row and the index row. FAIL if it refuses the row, writes nothing or a run folder is written by hand | 1. Read the recorder's `refused:` line. 2. Confirm `MTP-004` is a scenario id in this playbook. 3. Pick a new `--label` when the folder already exists |

### Commands

1. `bash: printf 'scenario_id,verdict,reason,evidence\nMTP-004,PASS,operator contract validator passed,<evidence file>\n' > <scratch>/verdicts.csv`
2. `bash: node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/record-playbook-run.cjs --playbook .skilled/skills/sk-doc/sk-create-manual-testing-playbook/manual-testing-playbook --results <scratch>/verdicts.csv --label manual-testing-playbook--operator-contract --executor "<runtime and model>"`
3. `bash: ls .skilled/skills/sk-doc/sk-create-manual-testing-playbook/benchmark/reports/ && grep -m1 -n -- '--manual-testing-playbook--' .skilled/skills/sk-doc/sk-create-manual-testing-playbook/benchmark/reports/README.md`

### Expected

Step 1 writes the verdict record. Step 2 checks it against the playbook and saves the run folder and its index row. Step 3 shows the folder where a later operator will look.

### Evidence

Capture the exact prompt, the CSV, the recorder transcript, its exit status, the run folder and the index row.

### Pass / Fail

- **Pass**: the recorder saves the PASS outcome with its reason and evidence path, and the index lists the run.
- **Fail**: the result remains only in chat, the recorder refuses a valid row or a run folder is written by hand.

### Failure Triage

1. Read the recorder's `refused:` lines, which name every problem at once.
2. Check the CSV header is `scenario_id,verdict,reason,evidence`.
3. Remove the run folder this scenario created, and its row in `benchmark/reports/README.md`, once the evidence is captured, unless it is the real record of a run.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [`manual-testing-playbook.md`](../manual-testing-playbook.md) | Root package policy and scenario index |
| No feature-catalog entry | This package has no feature catalog |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [`SKILL.md`](../../SKILL.md) | Results storage contract and evidence classes |
| [`scripts/record-playbook-run.cjs`](../../scripts/record-playbook-run.cjs) | The one writer for run folders |
| [`scripts/validate-playbook-package.cjs`](../../scripts/validate-playbook-package.cjs) | Package contract validator |

---

## 5. SOURCE METADATA

- Group: OPERATOR CONTRACT
- Playbook ID: MTP-005
- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `operator-contract/persist-scenario-result.md`
