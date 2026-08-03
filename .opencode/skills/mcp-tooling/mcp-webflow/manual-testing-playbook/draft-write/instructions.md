---
title: "INSTRUCTIONS-001 -- Agent Instructions draft-write"
description: "Agent Instruction create/update are DW; delete is DS (cascading)."
stage: routing
version: 1.0.0.0
---

# INSTRUCTIONS-001 -- Agent Instructions draft-write

## 1. OVERVIEW

This scenario validates Agent Instructions draft-write for `INSTRUCTIONS-001`. It focuses on Agent Instruction create/update are DW; delete is DS (cascading)..

### Why This Matters

Agent Instruction create/update are DW; delete is DS (cascading).

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `INSTRUCTIONS-001` and confirm the expected signals without contradictory evidence.

- Objective: Agent Instruction create/update are DW; delete is DS (cascading).
- Real user request: `Create a rule 'publish staging only' on the test site.`
- Prompt: `Create a rule 'publish staging only' on the test site.`
- Expected execution process: Discover, classify create as DW, review content, write; classify delete as DS.
- Expected signals: Create executes DW; delete requires confirmation with the cascade note.
- Desired user-visible outcome: A created rule; a gated delete path.
- Pass/fail: PASS if create/update run ungated and delete is gated; FAIL otherwise.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Create a rule 'publish staging only' on the test site.`

### Commands

1. `list_tools()`. 2. `create_instruction`. 3. Attempt `delete_instruction` -> confirmation.

### Expected

Create executes DW; delete requires confirmation with the cascade note.

### Evidence

Instruction content reviewed; delete confirmation record.

### Pass / Fail

- **Pass**: if create/update run ungated and delete is gated
- **Fail**: otherwise

### Failure Triage

1. Verify path grammar (kind). 2. Review the markdown content.

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

- Group: Draft-Write
- Playbook ID: INSTRUCTIONS-001
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `draft-write/instructions.md`
