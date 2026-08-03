---
title: "NONWEBFLOW-001 -- Non-Webflow intent defers"
description: "Off-topic requests never route to webflow tools."
stage: negative
version: 1.0.0.0
---

# NONWEBFLOW-001 -- Non-Webflow intent defers

## 1. OVERVIEW

This scenario validates Non-Webflow intent defers for `NONWEBFLOW-001`. It focuses on Off-topic requests never route to webflow tools..

### Why This Matters

Off-topic requests never route to webflow tools.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `NONWEBFLOW-001` and confirm the expected signals without contradictory evidence.

- Objective: Off-topic requests never route to webflow tools.
- Real user request: `Review the auth module code; search refero for web product styles.`
- Prompt: `Review the auth module code; search refero for web product styles.`
- Expected execution process: Route via hub signals; defer non-hub intent; route sibling intent to its mode.
- Expected signals: Non-hub intent defers; sibling intent routes to the sibling mode; zero webflow calls.
- Desired user-visible outcome: Zero webflow activation on both prompts.
- Pass/fail: PASS if zero webflow calls occur on both prompts; FAIL if webflow activates.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Review the auth module code; search refero for web product styles.`

### Commands

1. Hub routing probe for both prompts. 2. Verify zero webflow calls.

### Expected

Non-hub intent defers; sibling intent routes to the sibling mode; zero webflow calls.

### Evidence

Routing verdicts (benchmark replay 12/12).

### Pass / Fail

- **Pass**: if zero webflow calls occur on both prompts
- **Fail**: if webflow activates

### Failure Triage

1. Check hub-router signals. 2. Verify the deferral path.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../feature-catalog/feature-catalog.md` | Feature-catalog source describing the implementation contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/action-reference.md` | Action inventory with classes |
| `../../SKILL.md` | Frozen classes and gates |

---

## 5. SOURCE METADATA

- Group: Negative
- Playbook ID: NONWEBFLOW-001
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `negative/non-webflow.md`
