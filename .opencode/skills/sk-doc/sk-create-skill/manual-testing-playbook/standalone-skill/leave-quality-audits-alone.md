---
title: "SKL-003 -- Leave quality audits alone"
description: "This scenario validates the quality-control handoff for `SKL-003`. It focuses on existing-document review and no new skill scaffold."
version: 1.2.0.1
---

# SKL-003 -- Leave quality audits alone

This document captures the operator contract for `SKL-003`.

---

## 1. OVERVIEW

This scenario validates the boundary between skill authoring and existing-document quality control. It checks that an audit request does not become a new scaffold request.

### Why This Matters

Skill creation builds artifacts. Quality control reads and optionally improves an existing document. Mixing the two can create a new root when the user asked for a report on a file that already exists.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `SKL-003` and confirm that the request is handed to quality control.

- Objective: decline an existing-document quality audit and route it to `sk-create-quality-control`
- Realistic user request: `Please audit the existing invoice-review SKILL.md for DQI and human voice issues. Do not create anything.`
- Prompt: `Audit the existing invoice-review SKILL.md for DQI and human voice issues. Do not create anything.`
- Expected execution process: identify the existing target and audit intent, read the create-skill when-not-to-use boundary, route to `sk-create-quality-control` and create no new root or package.
- Expected signals: the response names the existing-document boundary and the quality-control handoff. No scaffold command runs.
- Desired user-visible outcome: a quality report for the existing file.
- Pass/fail: PASS if the request is handed off with no new skill artifact. FAIL if the mode initializes a folder, packages the existing file as a new skill or skips the handoff.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Audit the existing invoice-review SKILL.md for DQI and human voice issues. Do not create anything.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| SKL-003 | Leave quality audits alone | Decline an existing-document quality audit and route it to quality control | `Audit the existing invoice-review SKILL.md for DQI and human voice issues. Do not create anything.` | 1. `agent: Read the create-skill when-not-to-use boundary` -> 2. `agent: Confirm that invoice-review SKILL.md already exists` -> 3. `agent: Route the request to sk-create-quality-control and run no scaffold command` -> 4. `bash: git status --porcelain .opencode/skills/invoice-review` | Step 1: quality auditing is outside create-skill. Step 2: the target is existing. Step 3: the handoff is named and no scaffold command runs. Step 4: no new create-skill artifact appears | The exact prompt, boundary text, target check, handoff statement and status output with exit status | PASS if the existing audit is handed to quality control and no new artifact is created. FAIL if create-skill initializes or packages anything | 1. Confirm the target exists before routing. 2. Re-read the quality-control boundary. 3. Inspect status for a newly created root or archive |

### Commands

1. `agent: Read the create-skill when-not-to-use boundary`
2. `agent: Confirm that invoice-review SKILL.md already exists`
3. `agent: Route the request to sk-create-quality-control and run no scaffold command`
4. `bash: git status --porcelain .opencode/skills/invoice-review`

### Expected

Step 1 identifies quality audit as another packet's work. Step 2 confirms this is not a new artifact request. Step 3 hands the task to quality control. Step 4 shows no create-skill change.

### Evidence

Capture the prompt, boundary text, target confirmation, handoff statement and status output with its exit status.

### Pass / Fail

- **Pass**: the existing-document audit is handed to quality control and create-skill writes nothing.
- **Fail**: create-skill scaffolds a new root, packages the existing file or reports a creation result.

### Failure Triage

1. Confirm the request names an existing file.
2. Check the create-skill when-not-to-use list.
3. Check the scoped status for new files or archives.

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
| [`SKILL.md`](../../SKILL.md) | Creation boundary and handoff rule |
| [`../../../sk-create-quality-control/SKILL.md`](../../../sk-create-quality-control/SKILL.md) | Existing-document quality workflow |

---

## 5. SOURCE METADATA

- Group: STANDALONE SKILL
- Playbook ID: SKL-003
- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `standalone-skill/leave-quality-audits-alone.md`
