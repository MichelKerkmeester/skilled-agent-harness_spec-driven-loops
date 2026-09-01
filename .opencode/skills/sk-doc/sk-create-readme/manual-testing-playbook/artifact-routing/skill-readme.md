---
title: "RMR-001 -- Skill README"
description: "This scenario validates routing a skill folder to a general README with orientation first and evidence-backed reference detail."
version: 1.0.0.0
---

# RMR-001 -- Skill README

This document captures the general skill README routing contract.

---

## 1. OVERVIEW

This scenario validates README artifact routing for `RMR-001`. It focuses on a skill folder, its audience and its general README shape.

### Why This Matters

A skill README serves people who need to understand the skill. The mode requires orientation first, progressive detail and evidence from the target folder. Choosing a code-folder template for a skill root changes the reader experience.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `RMR-001`.

- Objective: choose a general skill README and place orientation before reference detail.
- Realistic user request: `Write a README for this skill folder so a new contributor can understand what it does and how to use it.`
- Prompt: `Write a README for this skill folder so a new contributor can understand what it does and how to use it.`
- Expected execution process: inspect the skill folder, identify the audience and use `assets/readme-template.md` as the scaffold.
- Expected signals: the artifact is `README.md`, the H1 has a tagline, the overview explains purpose and audience and no unconfirmed feature is added.
- Desired user-visible outcome: a new contributor can decide relevance and find the first useful action.
- Pass/fail: PASS if a general skill README is selected from local evidence. FAIL if a code-folder or install-guide shape is used without evidence.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Write a README for this skill folder so a new contributor can understand what it does and how to use it.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| RMR-001 | Skill README | Route a skill folder to a general README with orientation first | `Write a README for this skill folder so a new contributor can understand what it does and how to use it.` | 1. `agent: Read SKILL.md Section 2 and identify the README artifact type` -> 2. `agent: Inspect the target skill folder and nearby documentation` -> 3. `agent: Draft from assets/readme-template.md with a tagline and overview` -> 4. `bash: python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py .opencode/skills/sk-doc/sk-create-readme/SKILL.md` | Step 1: a general skill README is selected. Step 2: local files and audience are recorded. Step 3: orientation appears before detail. Step 4: validator output and exit status are captured | The prompt, target inventory, selected template, draft shape and validator transcript | PASS if the artifact type and evidence-first structure match the skill folder. FAIL if a code-folder or install-guide shape is chosen without evidence | 1. Confirm the target is a skill folder. 2. Check the audience before reviewing sections. 3. Remove any claim not supported by the target files |

### Commands

1. `agent: Read SKILL.md Section 2 and identify the README artifact type`
2. `agent: Inspect the target skill folder and nearby documentation`
3. `agent: Draft from assets/readme-template.md with a tagline and overview`
4. `bash: python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py .opencode/skills/sk-doc/sk-create-readme/SKILL.md`

### Expected

Step 1 chooses a general README for a skill. Step 2 records local evidence. Step 3 puts the reader's orientation first. Step 4 records a structural check on the mode contract.

### Evidence

Capture the prompt, target inventory, audience, selected template, draft outline and validator output with its exit status.

### Pass / Fail

- **Pass**: the target receives a general skill README shape grounded in local evidence.
- **Fail**: the mode selects a code-folder or install-guide shape without a matching target or invents commands.

### Failure Triage

1. Confirm the target folder and audience.
2. Compare the selected template with the artifact routing table.
3. Check every command and feature claim against local files.

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
| [`../../SKILL.md`](../../SKILL.md) | Artifact routing and README workflow |
| [`../../assets/readme-template.md`](../../assets/readme-template.md) | General README scaffold |
| [`../../references/readme/types-and-voice.md`](../../references/readme/types-and-voice.md) | Skill README audience and voice |

---

## 5. SOURCE METADATA

- Group: ARTIFACT ROUTING
- Playbook ID: RMR-001
- Canonical root source: [`../manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `artifact-routing/skill-readme.md`
