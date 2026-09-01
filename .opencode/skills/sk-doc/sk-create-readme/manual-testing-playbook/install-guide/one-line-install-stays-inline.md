---
title: "RMI-002 -- One-line install stays inline"
description: "This scenario validates leaving a one-command setup in the README or official documentation instead of creating a full install guide."
version: 1.0.0.0
---

# RMI-002 -- One-line install stays inline

This document captures the negative install-guide routing contract.

---

## 1. OVERVIEW

This scenario validates the proportionality boundary for `RMI-002`. It focuses on a tool with clear official documentation and no project-specific setup.

### Why This Matters

The mode creates an install guide when setup needs platform configuration, project settings or several steps. A one-line install should remain inline or link to official docs. A full guide would add sections that the tool does not need.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `RMI-002`.

- Objective: leave a one-command install outside the five-phase guide shape.
- Realistic user request: `This tool has clear official documentation and needs one install command with no project settings. Should I write a five-phase guide?`
- Prompt: `This tool has clear official documentation and needs one install command with no project settings. Should I write a five-phase guide?`
- Expected execution process: read the install decision tree, confirm the setup has one command and no project-specific configuration and decline the full guide.
- Expected signals: the answer links to official docs or gives the one-line command inline and does not create phase checkpoints.
- Desired user-visible outcome: the documentation stays proportional to the real setup.
- Pass/fail: PASS if no install guide is proposed. FAIL if the mode creates a five-phase guide without multi-step or project-specific setup.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `This tool has clear official documentation and needs one install command with no project settings. Should I write a five-phase guide?`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| RMI-002 | One-line install stays inline | Leave a one-command setup in inline documentation or official docs | `This tool has clear official documentation and needs one install command with no project settings. Should I write a five-phase guide?` | 1. `agent: Read SKILL.md Section 2 and state the install-guide decision tree` -> 2. `agent: Check whether project settings, platform configuration or multiple steps are required` -> 3. `agent: Return the inline command or official-docs link without proposing a guide` -> 4. `bash: python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py .opencode/skills/sk-doc/sk-create-readme/SKILL.md` | Step 1: the one-line branch is stated. Step 2: no project-specific setup is found. Step 3: inline documentation or official docs is selected. Step 4: validator output and exit status are captured | The prompt, decision tree, setup assessment, inline or link recommendation and validator transcript | PASS if the full guide is declined with the setup reason. FAIL if five-phase sections or checkpoints are proposed without a need | 1. Confirm the tool has a real official documentation link. 2. Check whether any project-specific setting was overlooked. 3. Verify the recommendation does not invent a multi-step setup |

### Commands

1. `agent: Read SKILL.md Section 2 and state the install-guide decision tree`
2. `agent: Check whether project settings, platform configuration or multiple steps are required`
3. `agent: Return the inline command or official-docs link without proposing a guide`
4. `bash: python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py .opencode/skills/sk-doc/sk-create-readme/SKILL.md`

### Expected

Step 1 identifies the short-install branch. Step 2 confirms there is no multi-step or project-specific setup. Step 3 keeps the install inline or points to official docs. Step 4 records the structural check.

### Evidence

Capture the prompt, decision tree, setup assessment, recommendation and validator output with its exit status.

### Pass / Fail

- **Pass**: the mode declines a full guide and gives an inline command or official-docs link.
- **Fail**: the mode proposes five phases without a real setup need or invents configuration steps.

### Failure Triage

1. Confirm the setup step count.
2. Check for project-specific configuration requirements.
3. Compare the recommendation with the install-guide decision tree.

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
| [`../../SKILL.md`](../../SKILL.md) | Install-guide decision tree |
| [`../../references/install-guide/quality-and-standards.md`](../../references/install-guide/quality-and-standards.md) | Install-guide minimum requirements |

---

## 5. SOURCE METADATA

- Group: INSTALL GUIDE
- Playbook ID: RMI-002
- Canonical root source: [`../manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `install-guide/one-line-install-stays-inline.md`
