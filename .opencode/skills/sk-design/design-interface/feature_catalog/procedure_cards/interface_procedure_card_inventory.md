---
title: "Interface Procedure Card Inventory"
description: "Current-state inventory of six private design-interface procedure cards and their read-only boundaries."
trigger_phrases:
  - "interface procedure card inventory"
  - "aesthetic direction card"
  - "wireframe variation prototype cards"
  - "deck direction spec"
version: 1.0.0.0
---

# Interface Procedure Card Inventory

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

`design-interface` has six private procedure cards selected after the public interface mode is chosen.

The cards cover discovery questions, aesthetic direction, low-fidelity wireframes, materially distinct variations, stateful prototype specs, and deck direction planning.

---

## 2. HOW IT WORKS

The mode chooses at most one primary card based on request shape, cites the selected card or a no-procedure fallback, and keeps operation read-only. Cards produce plans, questions, specs, options, and handoffs; they do not make `design-interface` a builder mode.

The card files are `discovery_question_round.md`, `aesthetic_direction.md`, `wireframe_exploration.md`, `variation_set.md`, `prototype_flow_spec.md`, and `deck_direction_spec.md`.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/sk-design/design-interface/SKILL.md` | Shared | Defines procedure selection table and proof line requirement. |
| `.opencode/skills/sk-design/design-interface/procedures/*.md` | Shared | Six private card definitions and read-only compatibility rules. |
| `.opencode/skills/sk-design/shared/procedure_card_schema.md` | Shared | Defines schema and required-field lint for private cards. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/sk-design/shared/procedure_card_schema.md` | Manual playbook | Local lint and publication checklist for card structure. |

---

## 4. SOURCE METADATA

- Group: Procedure Cards
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `procedure-cards/interface-procedure-card-inventory.md`

Related references:
- [../aesthetic-direction-process/two-pass-grounding-and-critique.md](../aesthetic-direction-process/two-pass-grounding-and-critique.md) - Baseline interface workflow cards support.
- [../delivery-gates/mechanical-delivery-gates.md](../delivery-gates/mechanical-delivery-gates.md) - Delivery proof after card use.
