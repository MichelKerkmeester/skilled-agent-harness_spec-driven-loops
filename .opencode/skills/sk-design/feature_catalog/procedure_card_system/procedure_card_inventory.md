---
title: "Procedure Card Inventory"
description: "Current-state inventory of the 14 private procedure cards owned by the sk-design hub and mode packets."
trigger_phrases:
  - "procedure card inventory"
  - "sk-design private cards"
  - "design mode procedure cards"
  - "polish gate orchestration"
version: 1.0.0.0
---

# Procedure Card Inventory

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

The `sk-design` family currently ships 14 private procedure cards across the shared base and five mode packets.

The cards are not public routes. They support narrower evidence, plan, handoff, or proof shapes after the hub has already selected the public mode.

---

## 2. HOW IT WORKS

The inventory is grouped by owner. Shared owns `polish_gate_orchestration.md`. Interface owns `aesthetic_direction.md`, `deck_direction_spec.md`, `discovery_question_round.md`, `prototype_flow_spec.md`, `variation_set.md`, and `wireframe_exploration.md`. Foundations owns `component_system_inventory.md`, `hierarchy_rhythm_review.md`, and `tweakable_design_controls.md`.

Motion owns `interaction_states_pass.md`. Audit owns `accessibility_audit.md` and `ai_slop_check.md`. Md-generator owns `design_system_extraction.md`, the only card attached to the mutating design mode.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/sk-design/shared/procedures/polish_gate_orchestration.md` | Shared | Cross-mode final polish orchestration. |
| `.opencode/skills/sk-design/design-interface/procedures/*.md` | Shared | Six interface procedure cards. |
| `.opencode/skills/sk-design/design-foundations/procedures/*.md` | Shared | Three foundations procedure cards. |
| `.opencode/skills/sk-design/design-motion/procedures/interaction_states_pass.md` | Shared | One motion procedure card. |
| `.opencode/skills/sk-design/design-audit/procedures/*.md` | Shared | Two audit procedure cards. |
| `.opencode/skills/sk-design/design-md-generator/procedures/design_system_extraction.md` | Shared | One md-generator procedure card. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/sk-design/shared/procedure_card_schema.md` | Manual playbook | Defines the required-field lint used to review every card in the inventory. |

---

## 4. SOURCE METADATA

- Group: Procedure Card System
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `procedure-card-system/procedure-card-inventory.md`

Related references:
- [procedure-card-schema-and-selection.md](../procedure_card_system/procedure_card_schema_and_selection.md) - Schema and route-after-mode selection rules.
- [../manager-shell/proof-gates-and-verifier-cadence.md](../manager_shell/proof_gates_and_verifier_cadence.md) - Proof line where selected cards are cited.
