---
title: "MTP-002 -- Leave a one-off check alone"
description: "This scenario validates the lightweight-workflow boundary for `MTP-002`. It focuses on a one-off check that does not need a reusable playbook corpus."
version: 1.0.0.0
---

# MTP-002 -- Leave a one-off check alone

This document captures the operator contract for `MTP-002`.

---

## 1. OVERVIEW

This scenario validates the mode's boundary for one-off or experimental checks. It tests whether the mode leaves a small task in a checklist or spec workflow instead of creating a package that will not be reused.

### Why This Matters

The mode is for reusable manual validation. A full package adds categories, index links, evidence rules and result storage. Those files do not earn their cost when a single operator will run one check once.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `MTP-002` and compare the response with the stated boundary.

- Objective: decline a full playbook for a one-off check and route the work to a simpler checklist or spec task
- Realistic user request: `I need to check one markdown change once. Add a full playbook package for it.`
- Prompt: `I need to check one markdown change once. Add a full playbook package for it.`
- Expected execution process: read the mode's when-not-to-use boundary, identify the one-off scope, explain why a reusable package is not warranted and suggest a checklist or spec task without creating playbook files.
- Expected signals: the response names the one-off condition, recommends the simpler workflow and declines the package request. No playbook package is authored.
- Desired user-visible outcome: one clear check with no unused package structure.
- Pass/fail: PASS if the full package is declined with the boundary named. FAIL if the mode creates root or category files or if it calls a full package necessary without a repeatable evidence need.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `I need to check one markdown change once. Add a full playbook package for it.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| MTP-002 | Leave a one-off check alone | Decline a full playbook for a one-off check and route it to a simpler workflow | `I need to check one markdown change once. Add a full playbook package for it.` | 1. `agent: Read the when-not-to-use boundary in SKILL.md` -> 2. `agent: Classify the request as one-off or reusable` -> 3. `agent: Recommend a checklist or spec task and make no playbook files` | Step 1: the one-off boundary is found. Step 2: the request is classified as one-off. Step 3: the response declines the package and names the simpler workflow | The exact prompt, the cited boundary, the classification, the recommendation and the scoped working-tree state | PASS if the package is declined and no playbook file is created. FAIL if the mode creates a root or category file or treats one execution as reusable release evidence | 1. Check whether the request names repeated execution or release evidence. 2. Re-read the decision rule for a small test. 3. Confirm no package path was added to the scoped tree |

### Commands

1. `agent: Read the when-not-to-use boundary in SKILL.md`
2. `agent: Classify the request as one-off or reusable`
3. `agent: Recommend a checklist or spec task and make no playbook files`

### Expected

Step 1 identifies that a one-off or experimental test belongs in a simpler document checklist. Step 2 classifies this request as one-off because it names one markdown change and one execution. Step 3 declines the package and does not create a root, category or scenario file.

### Evidence

Capture the prompt, the boundary text, the classification, the recommendation and the final scoped working-tree state.

### Pass / Fail

- **Pass**: the package request is declined with the one-off boundary named and no playbook file is created.
- **Fail**: any playbook artifact is created or the response claims a reusable corpus is needed without repeated execution or release evidence.

### Failure Triage

1. Check the number of features and expected runs in the request.
2. Check whether release readiness or shared evidence is actually required.
3. Verify the scoped tree has no new playbook file.

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
| [`SKILL.md`](../../SKILL.md) | When-not-to-use boundary and decision rule |
| [`references/README.md`](../../references/README.md) | Resource map for the playbook authoring workflow |

---

## 5. SOURCE METADATA

- Group: PACKAGE AUTHORING
- Playbook ID: MTP-002
- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `package-authoring/leave-one-off-check-alone.md`
