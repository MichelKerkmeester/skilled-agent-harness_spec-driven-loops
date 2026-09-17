---
title: "CMI-002 -- Complete auto and confirm modes"
description: "This scenario validates that advertised auto and confirm modes have complete targets and the correct execution pace."
version: 1.0.0.3
---

# CMI-002 -- Complete auto and confirm modes

This document captures the mode-completeness contract for a command with two execution paces.

---

## 1. OVERVIEW

This scenario validates `CMI-002`. It focuses on the relationship between the argument hint, mode table, workflow assets and execution targets.

### Why This Matters

An advertised mode is part of the user contract. `:auto` must self-validate and `:confirm` must pause at meaningful checkpoints. A hint without a target sends the user into an incomplete path.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CMI-002`.

- Objective: verify that every advertised mode maps to a real target and preserves its execution pace.
- Realistic user request: `Create a command with :auto and :confirm modes. Auto should self-validate and confirm should pause for approval at meaningful checkpoints.`
- Prompt: `Create a command with :auto and :confirm modes. Auto should self-validate and confirm should pause for approval at meaningful checkpoints.`
- Expected execution process: read the mode reference, inspect the hint and mode table, resolve both workflow assets and compare their behaviors.
- Expected signals: `:auto` has an auto target, `:confirm` has a confirm target, the prompt mode asks the user to choose and no advertised mode is left unresolved.
- Desired user-visible outcome: every visible invocation has a complete execution path.
- Pass/fail: PASS if the hint, targets and behavior agree. FAIL if a mode is advertised without an asset or if auto and confirm behave the same.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Create a command with :auto and :confirm modes. Auto should self-validate and confirm should pause for approval at meaningful checkpoints.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CMI-002 | Complete auto and confirm modes | Match every advertised mode to a target and its execution pace | `Create a command with :auto and :confirm modes. Auto should self-validate and confirm should pause for approval at meaningful checkpoints.` | 1. `agent: Read references/argument-hints-and-modes.md and state the mode behavior` -> 2. `agent: Compare the argument hint with the mode routing table` -> 3. `agent: Check that each advertised mode has a workflow or direct execution target` -> 4. `bash: python3 -m json.tool .opencode/skills/sk-doc/sk-create-command/assets/command-contract.json` | Step 1: auto and confirm behaviors are distinct. Step 2: the hint and routing table list the same modes. Step 3: each mode resolves to a target. Step 4: the command contract JSON parses and its output and exit status are captured | The prompt, mode rule, hint and routing comparison, target map and JSON validation transcript | PASS if every advertised mode has a target and the two paces differ. FAIL if a mode has no target or the hint advertises an unwired mode | 1. Check the hint for each suffix. 2. Follow each suffix into the execution-target table. 3. Confirm a missing workflow asset is reported rather than inferred |

### Commands

1. `agent: Read references/argument-hints-and-modes.md and state the mode behavior`
2. `agent: Compare the argument hint with the mode routing table`
3. `agent: Check that each advertised mode has a workflow or direct execution target`
4. `bash: python3 -m json.tool .opencode/skills/sk-doc/sk-create-command/assets/command-contract.json`

### Expected

Step 1 distinguishes autonomous execution from approval checkpoints. Step 2 checks the visible hint against the route. Step 3 checks target completeness. Step 4 validates the machine-readable family contract.

### Evidence

Capture the prompt, mode rules, hint, routing table, target paths and JSON parser output with its exit status.

### Pass / Fail

- **Pass**: each advertised mode maps to a target and the target behavior matches its name.
- **Fail**: a mode is only reachable by text, a target is missing or auto and confirm share one pace.

### Failure Triage

1. List every advertised mode from the hint.
2. Match each one to an execution target.
3. Re-read the mode table when two targets have identical behavior.

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
| [`../../SKILL.md`](../../SKILL.md) | Mode routing and completeness rule |
| [`../../references/argument-hints-and-modes.md`](../../references/argument-hints-and-modes.md) | Auto and confirm behavior |
| [`../../assets/command-contract.json`](../../assets/command-contract.json) | Machine-readable command family contract |

---

## 5. SOURCE METADATA

- Group: INPUT AND MODES
- Playbook ID: CMI-002
- Canonical root source: [`../manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `input-and-modes/complete-auto-and-confirm-modes.md`
