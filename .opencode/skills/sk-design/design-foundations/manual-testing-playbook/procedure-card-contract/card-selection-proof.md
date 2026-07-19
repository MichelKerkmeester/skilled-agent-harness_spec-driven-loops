---
title: Foundations Procedure Card Selection Proof Scenario
description: Manual scenario verifying foundations selects the correct private procedure card across all owned request shapes.
trigger_phrases:
  - "test foundations procedure cards"
importance_tier: normal
contextType: reference
version: 1.0.0.0
expected_intent: PROCEDURE_CARD_SELECTION
expected_resources:
  - SKILL.md
  - procedures/tweakable-design-controls.md
  - procedures/component-system-inventory.md
  - procedures/hierarchy-rhythm-review.md
---

**Exact prompt**

```text
foundations: for controls, component inventory, and hierarchy/rhythm variants, state the public mode, selected private procedure card, and proof line before system decisions.
```

# FOUND-PROCCARD-001 | Foundations Procedure Card Selection Proof

## 1. OVERVIEW

This scenario validates `design-foundations/SKILL.md` section `Procedure Card Selection` across all three foundations-owned cards: `tweakable-design-controls.md`, `component-system-inventory.md`, and `hierarchy-rhythm-review.md`.

## 2. SCENARIO CONTRACT

- Objective: Confirm each foundations request shape selects the matching card and cites the proof line before token, scale, hierarchy, or component-system decisions.
- Real user request: `I need foundations help with tweakable controls, component inventory, and hierarchy/rhythm review.`
- Prompt: `foundations: for controls, component inventory, and hierarchy/rhythm variants, state the public mode, selected private procedure card, and proof line before system decisions.`
- Expected execution process: Read `SKILL.md`; run three variants; record selected card, proof to cite, loaded references, and no bulk-loading behavior.
- Expected signals: controls variant selects `procedures/tweakable-design-controls.md`; component inventory variant selects `procedures/component-system-inventory.md`; hierarchy/rhythm variant selects `procedures/hierarchy-rhythm-review.md`.
- Desired user-visible outcome: A card-selection matrix with proof lines and no public micro-route leakage.
- Pass/fail: PASS if all three owned cards are selected for matching variants; FAIL if a card is omitted, invented, or presented as public route.

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| FOUND-PROCCARD-001 | Foundations card selection | Cover all foundations-owned card rows | `foundations: for controls, component inventory, and hierarchy/rhythm variants, state the public mode, selected private procedure card, and proof line before system decisions.` | grep `Procedure Card Selection` in `SKILL.md` -> agent: run controls, inventory, and hierarchy/rhythm variants -> inspect selected card lines | All three owned cards named exactly; no all-card loading; public mode remains `foundations` | Transcript, variant prompts, selected-card matrix, proof lines | PASS if all owned rows are covered with correct proof; FAIL on omitted/wrong/private-public route | 1. Re-read `SKILL.md` table; 2. Check variant terms; 3. Confirm selected card count is one primary card per variant |

## 4. SOURCE FILES

| File | Role |
|---|---|
| `../manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../SKILL.md` | Procedure table and proof contract |
| `../../procedures/tweakable-design-controls.md` | User-adjustable controls procedure |
| `../../procedures/component-system-inventory.md` | Component inventory procedure |
| `../../procedures/hierarchy-rhythm-review.md` | Hierarchy/rhythm procedure |

## 5. SOURCE METADATA

- Group: Procedure Card Contract
- Playbook ID: FOUND-PROCCARD-001
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `procedure-card-contract/card-selection-proof.md`
