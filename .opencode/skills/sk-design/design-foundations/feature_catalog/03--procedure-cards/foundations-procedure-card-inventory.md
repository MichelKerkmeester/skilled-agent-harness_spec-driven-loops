---
title: "Foundations Procedure Card Inventory"
description: "Current-state inventory of three private design-foundations procedure cards and their read-only boundaries."
trigger_phrases:
  - "foundations procedure card inventory"
  - "component system inventory card"
  - "hierarchy rhythm review card"
  - "tweakable design controls card"
version: 1.0.0.0
---

# Foundations Procedure Card Inventory

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

`design-foundations` has three private procedure cards selected after the public foundations mode is chosen.

The cards cover component/system inventory extraction, hierarchy and rhythm review, and tweakable design-control specification.

---

## 2. HOW IT WORKS

The mode chooses at most one primary card when a trigger matches, cites it in the plan or proof line, and preserves read-only operation with Read, Glob, and Grep only. `component_system_inventory.md` groups a finished or near-finished design into foundations/atoms/molecules/organisms/templates with variants, states, and gaps. `hierarchy_rhythm_review.md` reviews scan path, spacing, type scale, repetition, variation, and alignment for a design that feels flat or chaotic. `tweakable_design_controls.md` specifies 3 to 8 live-adjustable controls mapped to tokens or state, each with a default and hidden-when-off behavior.

Each card names a conflict rule that routes elsewhere when the request does not match: measured extraction from a live site routes to `design-md-generator/procedures/design_system_extraction.md`, and generic-template smells route to `design-audit/procedures/ai_slop_check.md`.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/sk-design/design-foundations/procedures/component_system_inventory.md` | Shared | Component/system inventory card: purpose, procedure, and conflict rule. |
| `.opencode/skills/sk-design/design-foundations/procedures/hierarchy_rhythm_review.md` | Shared | Hierarchy and rhythm review card: procedure and related cards. |
| `.opencode/skills/sk-design/design-foundations/procedures/tweakable_design_controls.md` | Shared | Tweakable design-control card: procedure and related cards. |
| `.opencode/skills/sk-design/shared/procedure_card_schema.md` | Shared | Defines the required-field schema every card in this inventory follows. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/sk-design/shared/procedure_card_schema.md` | Manual playbook | Local lint used to review card structure against the required-field schema. |

---

## 4. SOURCE METADATA

- Group: Procedure Cards
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `03--procedure-cards/foundations-procedure-card-inventory.md`

Related references:
- [../01--token-system/oklch-color-and-token-system.md](../01--token-system/oklch-color-and-token-system.md) - Token decisions the component-inventory card traces to.
- [../02--adaptation-and-data/context-adaptation-matrix.md](../02--adaptation-and-data/context-adaptation-matrix.md) - Adaptation work the hierarchy/rhythm card can review.
