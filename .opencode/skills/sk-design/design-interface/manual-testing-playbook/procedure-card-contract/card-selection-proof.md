---
title: "ID-018 -- Interface procedure-card selection proof"
description: "This scenario validates that interface selects the correct private procedure card across all owned request shapes before recommendations."
contextType: reference
version: 1.0.0.0
id: ID-018
expected_intent: PROCEDURE_CARD_SELECTION
expected_resources:
  - SKILL.md
  - procedures/discovery-question-round.md
  - procedures/aesthetic-direction.md
  - procedures/wireframe-exploration.md
  - procedures/variation-set.md
  - procedures/prototype-flow-spec.md
  - procedures/deck-direction-spec.md
  - ../shared/procedures/polish-gate-orchestration.md
---

# ID-018 -- Interface procedure-card selection proof

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `ID-018`.

**Exact prompt**

```text
For each interface request shape, state the public mode, selected private procedure card, and proof line before giving design advice.
```

---

## 1. OVERVIEW

This scenario validates `design-interface/SKILL.md` section `Procedure Card Selection`. It covers all six interface-owned cards: `discovery-question-round.md`, `aesthetic-direction.md`, `wireframe-exploration.md`, `variation-set.md`, `prototype-flow-spec.md`, and `deck-direction-spec.md`. It also confirms the shared `polish-gate-orchestration.md` is cited only for final polish, not duplicated as an interface-owned card.

### Why This Matters

The public mode remains `interface`; private cards only structure the work after mode selection. If card selection is skipped, users cannot verify why a direction, wireframe, variation set, prototype flow, or deck plan was chosen.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm interface selects at most one matching private card per request shape and cites the proof line before recommendations.
- Real user request: `I need interface help across missing brief facts, visual direction, wireframes, high-fidelity alternatives, a prototype flow, and a presentation deck.`
- Prompt: `For each interface request shape, state the public mode, selected private procedure card, and proof line before giving design advice.`
- Expected execution process: Load `SKILL.md`; inspect the `Procedure Card Selection` table; run six prompt variants, one for each owned card; capture the public mode, selected card, and proof line for each.
- Expected signals: Each variant resolves public mode `interface`; each selected card matches its request-shape row; no variant loads every card by default; final-polish variant routes to the shared card with owner mapping.
- Desired user-visible outcome: A concise matrix mapping each request shape to the correct card and proof to cite.
- Pass/fail: PASS if all six owned cards are selected for their matching variants and the shared polish card remains shared-only; FAIL if a card is omitted, multiple cards are selected without justification, or a private card is presented as a public mode.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Re-read `SKILL.md` section `Procedure Card Selection`.
2. Run six focused variants that trigger each owned card.
3. Capture selected card, proof line, loaded resources, and any no-card fallback.
4. Run one final-polish variant and confirm it cites `../shared/procedures/polish-gate-orchestration.md` as shared.
5. Return PASS only when all card rows are covered without public-route leakage.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| ID-018 | Interface procedure-card selection proof | Cover all interface-owned card rows and the shared final-polish row | `For each interface request shape, state the public mode, selected private procedure card, and proof line before giving design advice.` | grep `Procedure Card Selection` in `SKILL.md` -> agent: run variants for missing facts, greenfield direction, wireframe, variations, prototype flow, and deck direction -> agent: run final-polish variant | Step 1: table rows found. Step 2: each variant resolves interface. Step 3: selected cards are discovery_question_round, aesthetic_direction, wireframe_exploration, variation_set, prototype_flow_spec, and deck_direction_spec. Step 4: final polish cites shared polish card only | Transcript of table read, variant prompts, card selections, proof lines, and final verdict | PASS if every owned row is covered and no private card becomes public; FAIL if any owned row lacks selection proof or the shared card is duplicated as mode-local | 1. Re-read `SKILL.md` rows 155-165; 2. Check prompt vocabulary against request-shape cells; 3. Confirm only one primary card is selected per variant |

---

## 4. SOURCE FILES

| File | Role |
|---|---|
| `../manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../SKILL.md` | Interface procedure-card table and fallback/direct proof contract |
| `../../procedures/discovery-question-round.md` | Missing brief facts procedure |
| `../../procedures/aesthetic-direction.md` | Greenfield direction procedure |
| `../../procedures/wireframe-exploration.md` | Low-fidelity structure procedure |
| `../../procedures/variation-set.md` | High-fidelity alternatives procedure |
| `../../procedures/prototype-flow-spec.md` | Stateful prototype flow procedure |
| `../../procedures/deck-direction-spec.md` | Presentation deck procedure |
| `../../../shared/procedures/polish-gate-orchestration.md` | Shared final-polish procedure, not interface-owned |

---

## 5. SOURCE METADATA

- Group: Procedure Card Contract
- Playbook ID: ID-018
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `procedure-card-contract/card-selection-proof.md`
