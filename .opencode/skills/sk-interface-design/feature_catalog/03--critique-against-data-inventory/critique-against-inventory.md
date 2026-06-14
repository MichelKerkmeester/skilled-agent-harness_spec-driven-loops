---
title: "Critique-against inventory framing"
description: "Frames the design data sets as common expected patterns to deviate from, never as an auto-recommend chooser."
trigger_phrases:
  - "critique-against inventory framing"
  - "common patterns to deviate from"
  - "design inventory is not a chooser"
  - "what everyone else does"
---

# Critique-against inventory framing

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Frames the design data sets as common expected patterns to deviate from, never as an auto-recommend chooser.

This framing is what makes the design data safe to use inside a skill whose core principle is to avoid templated defaults. The inventory names the expected look for a brief so a designer can push against it deliberately, and it sets hard rules that keep the data out of any generator or auto-recommend role.

## 2. HOW IT WORKS

### How it plugs into the process

The inventory plugs into the critique step of the process. After the subject and plan are set, it is queried for the expected pattern for that product type or mood, that pattern is written down in one line as a constraint, and the designer takes a justified aesthetic risk away from it while keeping the quality floor. When a brief pins the direction, the brief wins even if it asks for the expected look.

### Hard rules

Four rules hold. The data is never wired into an auto-recommend or generator flow, which is why the upstream design-system generator and its persistence modes were not adopted. A catalog recommendation is never presented as the design decision, since the decision comes from the subject and the brief. The quality floor still applies, so a deviation that breaks contrast, touch targets, or motion sensitivity is a defect rather than a bold choice. The semantic token schema and WCAG pairings from the color data are the one exception, adopted directly because they are quality rather than taste.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `references/design_inventory.md` | Shared | Defines the critique-against framing, the process plug-in, the per-file read-it-as guidance, and the hard rules. |
| `references/design_principles.md` | Shared | Section 4 owns the authority that the inventory defers to during the critique. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `SKILL.md` | Manual playbook | Section 5 reference notes require the data to be treated as common patterns to critique against, never a chooser. |

---

## 4. SOURCE METADATA

- Group: Critique-against data inventory
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `03--critique-against-data-inventory/critique-against-inventory.md`

Related references:
- [design-data-sets.md](design-data-sets.md) - Design data sets
- [design-data-search.md](design-data-search.md) - Design data search
