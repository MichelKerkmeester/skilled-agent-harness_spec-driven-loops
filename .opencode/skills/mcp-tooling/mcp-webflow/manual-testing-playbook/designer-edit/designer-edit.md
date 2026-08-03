---
title: "DRAFT-003 -- Designer edit loop is draft-only and sk-design-paired"
description: "DW Designer edit loop: snapshot, discover, focus, mutate with sk-design pairing, verify — no publish-status flip."
stage: routing
version: 1.0.0.0
---

# DRAFT-003 -- Designer edit loop is draft-only and sk-design-paired

## 1. OVERVIEW

This scenario validates the Designer edit loop for `DRAFT-003`. It focuses on DW Designer edit loop with snapshot, discover, focus, mutate (sk-design-paired), verify — and no publish-status flip.

### Why This Matters

Designer edits are the flagship MCP 2.0 surface but are draft-only until a separate gated publish: the edit loop must never flip publish status, and taste decisions must route through `sk-design`, never the transport.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `DRAFT-003` and confirm the expected signals without contradictory evidence.

- Objective: DW Designer edit loop with snapshot, discover, focus, mutate (sk-design-paired), verify — no publish-status flip.
- Real user request: `Style the hero heading in the test site with the Brand primary token (draft, keep it on staging).`
- Prompt: `Style the hero heading in the test site with the Brand primary token (draft, keep it on staging).`
- Expected execution process: Confirm canvas open (bridge state) → `get_element_snapshot` before-state → `query_elements` for the hero heading → `select_element` focus → load `sk-design` → ensure the style + variable mode exist (`create_style` / `set_style_variable_mode` as needed) → `set_style` on the element → snapshot verify → no publish.
- Expected signals: Before-state snapshot; sk-design loaded before any mutation; style/token binding confirmed; after-state snapshot; no publish receipt.
- Desired user-visible outcome: Hero heading restyled in the draft with a before/after snapshot record; publish status untouched.
- Pass/fail: PASS if the edit loop ran DW with sk-design pairing and no publish; FAIL if any mutation ran without sk-design, or the status flipped without a PB gate.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Style the hero heading in the test site with the Brand primary token (draft, keep it on staging).`

### Commands

1. `list_tools()`; confirm canvas-bound reads available (Bridge App connected). 2. `get_element_snapshot` (before). 3. `query_elements` → `select_element`. 4. Load `sk-design`; ensure style + variable mode (`create_style`, `set_style_variable_mode` if missing). 5. `set_style` (DW). 6. `get_element_snapshot` (after). 7. Verify no publish receipt.

### Expected

Before/after snapshots; sk-design loaded before mutation; no publish-status flip.

### Evidence

Snapshot pair, style/token binding record, no publish receipt.

### Pass / Fail

- **Pass**: if the edit loop ran DW with sk-design pairing and no publish
- **Fail**: if a mutation ran without sk-design, or the status flipped without a PB gate

### Failure Triage

1. Bridge App not connected → canvas-bound reads fail first; open the Designer and retry. 2. `set_style` references a missing style → create the style / verify `style_names` first. 3. Any publish intent → stop: Designer edits are draft-only; a PB gate is a separate confirmation.

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
| `../../references/designer-capabilities.md` | Designer canvas model and edit loop |
| `../../references/action-reference.md` | Action inventory with classes |
| `../../SKILL.md` | Frozen classes and gates; sk-design pairing rule |

---

## 5. SOURCE METADATA

- Group: Draft-Write
- Playbook ID: DRAFT-003
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `designer-edit/designer-edit.md`
