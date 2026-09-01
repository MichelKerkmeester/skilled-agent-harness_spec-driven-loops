---
title: "RMI-001 -- Five-phase install flow"
description: "This scenario validates the five-phase install-guide flow, checkpoints, STOP conditions and actionable troubleshooting."
version: 1.0.0.0
---

# RMI-001 -- Five-phase install flow

This document captures the multi-step install-guide contract.

---

## 1. OVERVIEW

This scenario validates install-guide authoring for `RMI-001`. It focuses on prerequisites, installation, initialization, configuration and end-to-end verification.

### Why This Matters

An install guide is a sequence of state changes. Each phase needs a validation checkpoint and a STOP condition when that checkpoint fails. The guide also needs an AI-first prompt, expected output and actionable troubleshooting.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `RMI-001`.

- Objective: author a five-phase install guide with a checkpoint after every phase.
- Realistic user request: `Create an install guide for this tool. It needs prerequisites, installation, initialization, configuration and end-to-end verification.`
- Prompt: `Create an install guide for this tool. It needs prerequisites, installation, initialization, configuration and end-to-end verification.`
- Expected execution process: read the install-guide references, copy the install template and fill only tool-specific details confirmed from local evidence.
- Expected signals: sections 0 through 10 use the required shape, checkpoints are named `phase_1_complete` through `phase_5_complete`, every failing checkpoint has a STOP block and troubleshooting has at least five actionable rows.
- Desired user-visible outcome: an operator can install the tool one phase at a time and diagnose common errors.
- Pass/fail: PASS if all required sections and checkpoints are present with expected output. FAIL if a phase lacks a checkpoint, STOP block or tool-specific evidence.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Create an install guide for this tool. It needs prerequisites, installation, initialization, configuration and end-to-end verification.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| RMI-001 | Five-phase install flow | Author a checkpointed install guide for a multi-step tool setup | `Create an install guide for this tool. It needs prerequisites, installation, initialization, configuration and end-to-end verification.` | 1. `agent: Read references/install-guide/section-examples.md and state the opening shape` -> 2. `agent: Read references/install-guide/quality-and-standards.md and list the minimum requirements` -> 3. `agent: Map phases one through five to checkpoints and STOP blocks` -> 4. `bash: python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py .opencode/skills/sk-doc/sk-create-readme/SKILL.md` | Step 1: AI-first prompt and Core Principle blockquote are named. Step 2: section and troubleshooting requirements are listed. Step 3: five checkpoints, STOP blocks and expected output are mapped. Step 4: validator output and exit status are captured | The prompt, reference excerpts, phase map, checkpoint list and validator transcript | PASS if the guide shape includes all required phase checks and troubleshooting rows. FAIL if any phase lacks its checkpoint or STOP block | 1. Count checkpoints from one through five. 2. Confirm every checkpoint has a STOP instruction. 3. Check troubleshooting fixes name concrete actions |

### Commands

1. `agent: Read references/install-guide/section-examples.md and state the opening shape`
2. `agent: Read references/install-guide/quality-and-standards.md and list the minimum requirements`
3. `agent: Map phases one through five to checkpoints and STOP blocks`
4. `bash: python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py .opencode/skills/sk-doc/sk-create-readme/SKILL.md`

### Expected

Step 1 establishes the AI-first opening and Core Principle. Step 2 supplies the minimum guide requirements. Step 3 maps each phase to a checkpoint and STOP condition. Step 4 records a structural check on the mode contract.

### Evidence

Capture the prompt, opening rules, minimum requirements, phase map, checkpoint list and validator output with its exit status.

### Pass / Fail

- **Pass**: all five phases have named checkpoints, STOP conditions, expected output and tool-specific evidence.
- **Fail**: a phase is missing a check, a STOP block is absent or troubleshooting gives a vague action.

### Failure Triage

1. Compare the draft with the five-phase table.
2. Inspect each checkpoint for an adjacent STOP block.
3. Replace vague troubleshooting fixes with concrete commands or file edits.

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
| [`../../SKILL.md`](../../SKILL.md) | Five-phase install-guide workflow |
| [`../../assets/install-guide-template.md`](../../assets/install-guide-template.md) | Install-guide scaffold |
| [`../../references/install-guide/section-examples.md`](../../references/install-guide/section-examples.md) | Opening and checkpoint examples |
| [`../../references/install-guide/quality-and-standards.md`](../../references/install-guide/quality-and-standards.md) | Minimum requirements and troubleshooting |

---

## 5. SOURCE METADATA

- Group: INSTALL GUIDE
- Playbook ID: RMI-001
- Canonical root source: [`../manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `install-guide/five-phase-install-flow.md`
