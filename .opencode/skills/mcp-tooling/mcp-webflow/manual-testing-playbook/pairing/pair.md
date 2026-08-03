---
title: "PAIR-001 -- Designer-family change pairs with sk-design"
description: "Designer-family changes route through sk-design before execution."
stage: routing
version: 1.0.0.0
---

# PAIR-001 -- Designer-family change pairs with sk-design

## 1. OVERVIEW

This scenario validates Designer-family change pairs with sk-design for `PAIR-001`. It focuses on Designer-family changes route through sk-design before execution..

### Why This Matters

Designer-family changes route through sk-design before execution.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `PAIR-001` and confirm the expected signals without contradictory evidence.

- Objective: Designer-family changes route through sk-design before execution.
- Real user request: `Set the hero heading level to H1 in the test site.`
- Prompt: `Set the hero heading level to H1 in the test site.`
- Expected execution process: Load sk-design first, discover, classify DW, execute the Designer-family call.
- Expected signals: sk-design loaded before the Designer-family call; class DW.
- Desired user-visible outcome: A Designer change made under sk-design judgment.
- Pass/fail: PASS if sk-design precedes the Designer call; FAIL otherwise.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Set the hero heading level to H1 in the test site.`

### Commands

1. Load `sk-design`. 2. `list_tools()`. 3. Designer-family call.

### Expected

sk-design loaded before the Designer-family call; class DW.

### Evidence

sk-design load record, tool call order.

### Pass / Fail

- **Pass**: if sk-design precedes the Designer call
- **Fail**: otherwise

### Failure Triage

1. Confirm the operation is Designer-family. 2. Load sk-design first.

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

- Group: Judgment Pairing
- Playbook ID: PAIR-001
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `pairing/pair.md`
