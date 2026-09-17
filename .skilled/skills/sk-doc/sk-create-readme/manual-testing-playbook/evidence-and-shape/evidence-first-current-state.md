---
title: "RME-001 -- Evidence-first current-state README"
description: "This scenario validates reading local evidence before documenting current files, commands, features and expected output."
version: 1.1.0.3
---

# RME-001 -- Evidence-first current-state README

This document captures the evidence-first README authoring contract.

---

## 1. OVERVIEW

This scenario validates current-state documentation for `RME-001`. It focuses on local evidence, tested commands and honest examples.

### Why This Matters

A README is a claim about the folder readers will use. The mode requires the target folder, nearby docs, package files, config files and existing commands to be read before drafting. This prevents stale paths and invented capabilities.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `RME-001`.

- Objective: refresh a README from current local evidence and test its documented commands when feasible.
- Realistic user request: `Refresh this folder README from the current files. Do not document a command or feature unless you can confirm it locally.`
- Prompt: `Refresh this folder README from the current files. Do not document a command or feature unless you can confirm it locally.`
- Expected execution process: inspect the target and nearby files, choose the README shape, test commands and mark untested examples clearly.
- Expected signals: every file path and command has a source, verification commands show expected output and no temporary planning label appears in the README.
- Desired user-visible outcome: the README describes what exists now and gives the reader checks they can run.
- Pass/fail: PASS if claims are evidence-backed and commands are tested or marked as examples. FAIL if the draft invents a command, path or metric.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Refresh this folder README from the current files. Do not document a command or feature unless you can confirm it locally.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| RME-001 | Evidence-first current-state README | Ground README claims in current files and tested commands | `Refresh this folder README from the current files. Do not document a command or feature unless you can confirm it locally.` | 1. `agent: Read SKILL.md Section 4 and list the local evidence sources` -> 2. `agent: Inspect the target folder, nearby docs, package files, config and commands` -> 3. `agent: Test each documented command or mark it as an example` -> 4. `bash: python3 .opencode/skills/sk-doc/sk-create-readme/scripts/audit_readmes.py --repo-root . --validator .opencode/skills/sk-doc/shared/scripts/validate_document.py` | Step 1: all evidence classes are named. Step 2: the inventory is captured. Step 3: each command is tested or labeled. Step 4: audit output and exit status are captured | The prompt, evidence list, target inventory, command results, expected output blocks and audit transcript | PASS if each claim has local evidence and the audit is read. FAIL if an unconfirmed path, command or metric is documented | 1. Compare claims with the inventory. 2. Run any command that was marked tested. 3. Remove claims whose source cannot be found |

### Commands

1. `agent: Read SKILL.md Section 4 and list the local evidence sources`
2. `agent: Inspect the target folder, nearby docs, package files, config and commands`
3. `agent: Test each documented command or mark it as an example`
4. `bash: python3 .opencode/skills/sk-doc/sk-create-readme/scripts/audit_readmes.py --repo-root . --validator .opencode/skills/sk-doc/shared/scripts/validate_document.py`

### Expected

Step 1 names the evidence sources. Step 2 records what exists. Step 3 separates tested commands from examples. Step 4 gives a repository audit receipt.

### Evidence

Capture the prompt, evidence list, target inventory, command outputs, expected output blocks and audit output with its exit status.

### Pass / Fail

- **Pass**: every claim is tied to local evidence and every command is tested or marked as an example.
- **Fail**: the README contains an unconfirmed file, command, feature or metric.

### Failure Triage

1. Trace every claim to a file or user-provided fact.
2. Re-run commands marked as tested.
3. Remove any unsupported claim and re-run the audit.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [`../manual-testing-playbook.md`](../manual-testing-playbook.md) | Root directory and scenario summary |
| No feature-catalog entry | This package has no feature catalog |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [`../../SKILL.md`](../../SKILL.md) | Evidence-first README workflow |
| [`../../references/readme/quality-and-checklist.md`](../../references/readme/quality-and-checklist.md) | README quality checks |
| [`../../scripts/audit_readmes.py`](../../scripts/audit_readmes.py) | Repository README inventory |

---

## 5. SOURCE METADATA

- Group: EVIDENCE AND SHAPE
- Playbook ID: RME-001
- Canonical root source: [`../manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `evidence-and-shape/evidence-first-current-state.md`
