---
title: "DRAFT-001 -- Draft page settings update"
description: "DW page settings update without publish-status change."
stage: routing
version: 1.0.0.0
---

# DRAFT-001 -- Draft page settings update

## 1. OVERVIEW

This scenario validates Draft page settings update for `DRAFT-001`. It focuses on DW page settings update without publish-status change..

### Why This Matters

DW page settings update without publish-status change.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `DRAFT-001` and confirm the expected signals without contradictory evidence.

- Objective: DW page settings update without publish-status change.
- Real user request: `Update the 'About' page title in the test site (draft).`
- Prompt: `Update the 'About' page title in the test site (draft).`
- Expected execution process: Discover, classify DW, capture before-state, send the draft payload, verify no status flip.
- Expected signals: Before-state captured; settings updated; no publish-status flip.
- Desired user-visible outcome: Updated settings with a before/after record and no publish.
- Pass/fail: PASS if updated as DW with no publish; FAIL if the status flipped without a PB gate.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Update the 'About' page title in the test site (draft).`

### Commands

1. `list_tools()`. 2. `update_page_settings` (draft). 3. Verify no publish receipt.

### Expected

Before-state captured; settings updated; no publish-status flip.

### Evidence

Before/after settings, no publish receipt.

### Pass / Fail

- **Pass**: if updated as DW with no publish
- **Fail**: if the status flipped without a PB gate

### Failure Triage

1. Review the update_page_settings payload. 2. Confirm no publish intent.

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
- Playbook ID: DRAFT-001
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `draft-write/draftset.md`
