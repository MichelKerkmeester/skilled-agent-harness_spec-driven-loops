---
title: "MTP-005 -- Persist the scenario result"
description: "Retired: the wrapper this scenario validated went with its benchmark lane. Kept as the contract a replacement must satisfy, not a runnable sequence."
version: 1.1.0.0
---

# MTP-005 -- Persist the scenario result

> **This scenario has no runner.** The wrapper it validates was built on a benchmark lane
> that has since been retired, and it depended on that lane's core rather than merely living
> beside it, so it could not be rehomed as it stood. Until a replacement exists, the
> obligation stands without its automation: record a scenario's `PASS`, `FAIL` or `SKIP`
> verdict, its reason and its evidence path into the owning skill's dated report folder by
> hand. What the scenario below describes is the contract a replacement must satisfy, not a
> sequence an operator can run today.
>
> The failure this note prevents: an operator following a command sequence whose binary is
> gone, and reading the resulting error as their own mistake.

This document captures the operator contract for `MTP-005`.

---

## 1. OVERVIEW

This scenario validates the result-storage contract for a completed manual scenario. It checks that the canonical wrapper receives the verdict, reason, stage and durable evidence instead of a report being written by hand.

### Why This Matters

A playbook run has no durable value if its outcome stays in chat. The wrapper creates the dated report folder, records execution metadata and lets the renderer own report Markdown. Hand-authored report files can drift from the run record.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `MTP-005` and confirm that the result record is durable.

- Objective: persist a PASS outcome through the canonical manual-playbook wrapper with evidence metadata
- Realistic user request: `The operator ran MTP-004. Record its PASS result with the evidence path so the run can be audited later.`
- Prompt: `The operator ran MTP-004. Record its PASS result with the evidence path so the run can be audited later.`
- Expected execution process: capture a durable evidence file, run the retired scenario-persistence wrapper with the skill, scenario, variant, verdict, reason, stage and outcome JSON, then inspect the generated JSON and report files without editing renderer output.
- Expected signals: the wrapper exits zero, the run folder contains a persisted PASS outcome, the evidence path is beneath the evidence root and generated Markdown is treated as renderer-owned.
- Desired user-visible outcome: a later operator can find the verdict, reason and evidence path in the run folder.
- Pass/fail: PASS if the wrapper stores the outcome and evidence metadata. FAIL if the result remains only in the conversation, the evidence is not durable or report Markdown is authored by hand.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `The operator ran MTP-004. Record its PASS result with the evidence path so the run can be audited later.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| MTP-005 | Persist the scenario result | Persist a PASS outcome through the canonical wrapper with durable evidence | `The operator ran MTP-004. Record its PASS result with the evidence path so the run can be audited later.` | 1. `agent: Create one durable evidence file under the controlled evidence root` -> 2. `bash: node the retired scenario-persistence wrapper --skill sk-create-manual-testing-playbook --scenario MTP-004 --variant operator-contract --verdict PASS --reason "Operator contract validator passed" --stage operator-contract --evidence evidence/operator-contract.txt` -> 3. `agent: Inspect the generated JSON and report Markdown without editing renderer-owned files` | Step 1: the evidence file is a regular file under the evidence root. Step 2: the wrapper records PASS and exits zero. Step 3: the run folder contains the outcome, reason, evidence path, byte count and hash | The exact prompt, evidence path, wrapper command, wrapper output and exit status and the generated report paths | PASS if the wrapper persists the PASS result and evidence metadata. FAIL if the result is not written, the evidence path is outside the evidence root or report Markdown is hand-edited | 1. Confirm the evidence path resolves beneath the controlled root and is not a symlink. 2. Check the wrapper received the exact scenario ID and verdict. 3. Compare the generated Markdown with the JSON record and report any hand edit |

### Commands

1. `agent: Create one durable evidence file under the controlled evidence root`
2. `bash: node the retired scenario-persistence wrapper --skill sk-create-manual-testing-playbook --scenario MTP-004 --variant operator-contract --verdict PASS --reason "Operator contract validator passed" --stage operator-contract --evidence evidence/operator-contract.txt`
3. `agent: Inspect the generated JSON and report Markdown without editing renderer-owned files`

### Expected

Step 1 creates the evidence input for the wrapper. Step 2 persists the outcome and records durable evidence metadata. Step 3 reads the generated record and leaves renderer-owned Markdown untouched.

### Evidence

Capture the exact prompt, evidence path, wrapper transcript, exit status, run folder, JSON record and generated report paths.

### Pass / Fail

- **Pass**: the wrapper persists the PASS outcome with reason and evidence metadata and the report is derived from the record.
- **Fail**: the result remains only in chat, evidence is outside the controlled root, the wrapper command is incomplete or generated Markdown is hand-authored.

### Failure Triage

1. Inspect the wrapper command for the scenario, verdict, reason, stage and evidence arguments.
2. Resolve the evidence path and confirm it is a regular file under the controlled evidence root.
3. Read the JSON record before comparing generated Markdown.

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
| [`scripts/validate-playbook-package.cjs`](../../scripts/validate-playbook-package.cjs) | Package contract validator |
| the retired scenario-persistence wrapper | Canonical result wrapper |

---

## 5. SOURCE METADATA

- Group: OPERATOR CONTRACT
- Playbook ID: MTP-005
- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `operator-contract/persist-scenario-result.md`
