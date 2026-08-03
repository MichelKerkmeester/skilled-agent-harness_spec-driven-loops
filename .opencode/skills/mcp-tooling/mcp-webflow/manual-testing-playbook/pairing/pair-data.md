---
title: "PAIR-DATA-001 -- Data-family runs transport-only"
description: "Data-family operations run transport-only (negative pairing check)."
stage: routing
version: 1.0.0.0
---

# PAIR-DATA-001 -- Data-family runs transport-only

## 1. OVERVIEW

This scenario validates Data-family runs transport-only for `PAIR-DATA-001`. It focuses on Data-family operations run transport-only (negative pairing check)..

### Why This Matters

Data-family operations run transport-only (negative pairing check).

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `PAIR-DATA-001` and confirm the expected signals without contradictory evidence.

- Objective: Data-family operations run transport-only (negative pairing check).
- Real user request: `Create a draft CMS item in the 'Blog' collection.`
- Prompt: `Create a draft CMS item in the 'Blog' collection.`
- Expected execution process: Discover, classify DW, execute without sk-design.
- Expected signals: Draft-write executes without sk-design; Designer prompts still pair.
- Desired user-visible outcome: A draft CMS item created transport-only.
- Pass/fail: PASS if the data-family op runs transport-only; FAIL if sk-design is forced or skipped where required.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Create a draft CMS item in the 'Blog' collection.`

### Commands

1. `list_tools()`. 2. `create_collection_items` (draft).

### Expected

Draft-write executes without sk-design; Designer prompts still pair.

### Evidence

Tool call order; no forced sk-design load.

### Pass / Fail

- **Pass**: if the data-family op runs transport-only
- **Fail**: if sk-design is forced or skipped where required

### Failure Triage

1. Confirm the class (DW). 2. Verify pairing boundary both ways.

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
- Playbook ID: PAIR-DATA-001
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `pairing/pair-data.md`
