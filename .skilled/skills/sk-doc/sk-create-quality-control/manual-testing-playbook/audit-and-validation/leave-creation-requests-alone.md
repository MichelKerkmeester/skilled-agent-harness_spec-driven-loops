---
title: "QC-003 -- Leave creation requests alone"
description: "This scenario validates the creation boundary for `QC-003`. It focuses on routing a new skill request to creation instead of inventing an existing target."
version: 1.0.0.3
---

# QC-003 -- Leave creation requests alone

This document captures the operator contract for `QC-003`.

---

## 1. OVERVIEW

This scenario validates the quality mode's when-not-to-use boundary. It checks that a request for a brand-new skill is handed to `sk-create-skill` and does not become an audit of an absent document.

### Why This Matters

Quality control evaluates existing markdown. Creation needs a different contract for scaffolding, metadata, resources and packaging. Running extraction on an absent target produces no useful quality evidence.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `QC-003` and confirm that the creation request is left to the creation packet.

- Objective: decline a new-skill creation request and route it to the skill-authoring workflow
- Realistic user request: `I have an idea for a new OpenCode skill. Create it and package it for distribution.`
- Prompt: `Create a new OpenCode skill from this idea and package it for distribution.`
- Expected execution process: read the quality mode's when-not-to-use list, identify that no existing target exists, route to `sk-create-skill` and create no artifact from quality control.
- Expected signals: the response names the creation boundary and the handoff target. No DQI score is reported for an absent document.
- Desired user-visible outcome: the request reaches the correct creation workflow.
- Pass/fail: PASS if quality control declines the creation task and no artifact is created. FAIL if it invents a target, reports a score or creates a new skill.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Create a new OpenCode skill from this idea and package it for distribution.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| QC-003 | Leave creation requests alone | Decline a new-skill creation request and route it to the skill-authoring workflow | `Create a new OpenCode skill from this idea and package it for distribution.` | 1. `agent: Read the quality packet when-not-to-use boundary` -> 2. `agent: Confirm that no existing markdown target was supplied` -> 3. `agent: Route the request to sk-create-skill and make no artifact from quality control` | Step 1: the creation boundary is found. Step 2: the absent target is explicit. Step 3: the handoff target is named and no artifact is created | The exact prompt, the boundary text, the target check, the handoff statement and the final scoped working-tree state | PASS if the request is handed to `sk-create-skill` with no quality artifact. FAIL if quality control invents a file, reports DQI or creates a new skill | 1. Check whether an existing target path was supplied. 2. Re-read the creation boundary in SKILL.md. 3. Confirm no quality-control artifact was added |

### Commands

1. `agent: Read the quality packet when-not-to-use boundary`
2. `agent: Confirm that no existing markdown target was supplied`
3. `agent: Route the request to sk-create-skill and make no artifact from quality control`

### Expected

Step 1 identifies creation as an out-of-scope request. Step 2 confirms there is no existing document to read. Step 3 routes the request to the creation workflow and leaves the quality packet unchanged.

### Evidence

Capture the prompt, the cited boundary, the target check, the handoff statement and the final scoped working-tree state.

### Pass / Fail

- **Pass**: quality control declines creation and routes to `sk-create-skill` without creating or scoring a document.
- **Fail**: it invents a target, reports DQI or creates a new artifact.

### Failure Triage

1. Check whether the prompt names an existing file or folder.
2. Check the quality packet's when-not-to-use list.
3. Confirm the final status has no quality-created artifact.

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
| [`SKILL.md`](../../SKILL.md) | When-not-to-use boundary |
| [`../../../sk-create-skill/SKILL.md`](../../../sk-create-skill/SKILL.md) | Creation workflow handoff target |

---

## 5. SOURCE METADATA

- Group: AUDIT AND VALIDATION
- Playbook ID: QC-003
- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `audit-and-validation/leave-creation-requests-alone.md`
