---
title: "Md-Generator Procedure Card Inventory"
description: "Current-state inventory of the one private design-md-generator procedure card and its mutating-mode tool boundary."
trigger_phrases:
  - "md-generator procedure card inventory"
  - "design system extraction card"
  - "design-md-generator private card"
  - "measured extraction card"
version: 1.0.0.0
---

# Md-Generator Procedure Card Inventory

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

`design-md-generator` has one private procedure card selected after the public mode is chosen: `design_system_extraction.md`.

It is the only card in the `sk-design` family attached to a mutating mode, since `design-md-generator` is the sole design mode with an existing extraction pipeline.

---

## 2. HOW IT WORKS

The card adapts measured source design data into a faithful Style Reference workflow when the user asks to extract tokens, capture CSS, generate `DESIGN.md`, or ground future work in a live site, source design system, screenshot, or brand reference. It produces a measured extraction plan or generated reference containing colors, typography, spacing, radii, shadows, additional tokens, source list, gaps, and inconsistencies, and every reported value traces to source evidence or is explicitly labeled absent.

### Tool Boundary

The card grants no additional permission beyond the mode's existing extraction pipeline; it does not grant Write, Edit, or Bash to the four read-only advisory modes (`interface`, `foundations`, `motion`, `audit`). When no measurable source exists and the user wants a new direction from a brief instead, the card routes to `design-interface/procedures/aesthetic_direction.md`.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/sk-design/design-md-generator/procedures/design_system_extraction.md` | Shared | Design-system-extraction card: purpose, tool boundary, procedure, and conflict rule. |
| `.opencode/skills/sk-design/shared/procedure_card_schema.md` | Shared | Defines the required-field schema this card follows. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/sk-design/design-md-generator/manual_testing_playbook/manual_testing_playbook.md` | Manual playbook | Exercises measured extraction scenarios against the live mode. |

---

## 4. SOURCE METADATA

- Group: Procedure Cards
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `08--procedure-cards/md-generator-procedure-card-inventory.md`

Related references:
- [../01--extract/extract.md](../01--extract/extract.md) - Extraction pipeline the card's tool boundary is scoped to.
- [../04--validate/validate.md](../04--validate/validate.md) - Validation gate the card's output must still pass.
