---
title: "CMR-002 -- Direct dispatch without YAML"
description: "This scenario validates that a direct-dispatch command does not receive unused workflow YAML assets."
version: 1.0.0.1
---

# CMR-002 -- Direct dispatch without YAML

This document captures the command-family topology boundary for direct dispatch.

---

## 1. OVERVIEW

This scenario validates `CMR-002`. It focuses on selecting the direct-dispatch topology and leaving workflow YAML out when no workflow assets are used.

### Why This Matters

The command contract distinguishes direct dispatch from workflow-YAML-backed routing. A router split does not by itself require auto and confirm files. Extra assets obscure the real execution path and create files the family does not own.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CMR-002`.

- Objective: keep a direct-dispatch command limited to its real targets.
- Realistic user request: `This command dispatches directly to a script. Do I need auto and confirm YAML files just because it has a router?`
- Prompt: `This command dispatches directly to a script. Do I need auto and confirm YAML files just because it has a router?`
- Expected execution process: read the command contract, identify the direct-dispatch family and inspect the owned-assets shape before answering.
- Expected signals: direct dispatch is named, workflow YAML is not required unless the family routes through it and no extra asset is proposed.
- Desired user-visible outcome: the package matches its topology and stays small.
- Pass/fail: PASS if the answer leaves unused YAML out. FAIL if it adds auto or confirm assets without a workflow target.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `This command dispatches directly to a script. Do I need auto and confirm YAML files just because it has a router?`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CMR-002 | Direct dispatch without YAML | Keep direct-dispatch assets limited to the real execution targets | `This command dispatches directly to a script. Do I need auto and confirm YAML files just because it has a router?` | 1. `agent: Read assets/command-contract.json and identify the direct-dispatch topology` -> 2. `agent: Read SKILL.md Step 11 and list the assets required for that topology` -> 3. `agent: State whether auto and confirm YAML files are needed for a direct script target` -> 4. `bash: python3 -m json.tool .opencode/skills/sk-doc/sk-create-command/assets/command-contract.json` | Step 1: direct dispatch is distinguished from mode-pair routing. Step 2: the owned asset list matches the topology. Step 3: unused YAML is declined. Step 4: the contract JSON parses and its output and exit status are captured | The prompt, topology decision, asset list, direct-dispatch answer and JSON parser transcript | PASS if the answer declines unused YAML and names the topology rule. FAIL if a workflow asset is added without a workflow target | 1. Confirm the family entry rather than assuming every router is mode-pair. 2. Check for actual workflow targets before adding YAML. 3. Compare the answer with the owned-assets table |

### Commands

1. `agent: Read assets/command-contract.json and identify the direct-dispatch topology`
2. `agent: Read SKILL.md Step 11 and list the assets required for that topology`
3. `agent: State whether auto and confirm YAML files are needed for a direct script target`
4. `bash: python3 -m json.tool .opencode/skills/sk-doc/sk-create-command/assets/command-contract.json`

### Expected

Step 1 identifies the family topology from the machine-readable contract. Step 2 lists the assets that topology owns. Step 3 declines unused YAML. Step 4 confirms the contract file is valid JSON.

### Evidence

Capture the prompt, topology entry, asset list, decision and JSON parser output with its exit status.

### Pass / Fail

- **Pass**: direct dispatch is selected and no unused workflow YAML is proposed.
- **Fail**: the answer adds auto or confirm YAML without a workflow target or treats every router as a mode-pair.

### Failure Triage

1. Re-read the topology entry in `assets/command-contract.json`.
2. Check whether the command has actual workflow targets.
3. Remove any asset that cannot be reached from the selected topology.

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
| [`../../SKILL.md`](../../SKILL.md) | Router variants and topology rule |
| [`../../assets/command-contract.json`](../../assets/command-contract.json) | Machine-readable family contract |
| [`../../references/common-pitfalls.md`](../../references/common-pitfalls.md) | Workflow YAML scope |

---

## 5. SOURCE METADATA

- Group: ROUTER CONTRACT
- Playbook ID: CMR-002
- Canonical root source: [`../manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `router-contract/direct-dispatch-without-yaml.md`
