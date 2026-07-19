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

The inventory is grouped by owner. Shared owns `polish-gate-orchestration.md`. Interface owns `aesthetic-direction.md`, `deck-direction-spec.md`, `discovery-question-round.md`, `prototype-flow-spec.md`, `variation-set.md`, and `wireframe-exploration.md`. Foundations owns `component-system-inventory.md`, `hierarchy-rhythm-review.md`, and `tweakable-design-controls.md`.

Motion owns `interaction-states-pass.md`. Audit owns `accessibility-audit.md` and `ai-slop-check.md`. Md-generator owns `design-system-extraction.md`, the only card attached to the mutating design mode.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/sk-design/shared/procedures/polish-gate-orchestration.md` | Shared | Cross-mode final polish orchestration. |
| `.opencode/skills/sk-design/design-interface/procedures/*.md` | Shared | Six interface procedure cards. |
| `.opencode/skills/sk-design/design-foundations/procedures/*.md` | Shared | Three foundations procedure cards. |
| `.opencode/skills/sk-design/design-motion/procedures/interaction-states-pass.md` | Shared | One motion procedure card. |
| `.opencode/skills/sk-design/design-audit/procedures/*.md` | Shared | Two audit procedure cards. |
| `.opencode/skills/sk-design/design-md-generator/procedures/design-system-extraction.md` | Shared | One md-generator procedure card. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/sk-design/shared/procedure-card-schema.md` | Manual playbook | Defines the required-field lint used to review every card in the inventory. |

---

## 4. SOURCE METADATA

- Group: Procedure Card System
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `procedure-card-system/procedure-card-inventory.md`

Related references:
- [procedure-card-schema-and-selection.md](../procedure-card-system/procedure-card-schema-and-selection.md) - Schema and route-after-mode selection rules.
- [../manager-shell/proof-gates-and-verifier-cadence.md](../manager-shell/proof-gates-and-verifier-cadence.md) - Proof line where selected cards are cited.
