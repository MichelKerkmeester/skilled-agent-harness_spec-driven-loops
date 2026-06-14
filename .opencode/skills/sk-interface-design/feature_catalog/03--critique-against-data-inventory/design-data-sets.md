---
title: "Design data sets"
description: "Nine MIT-licensed CSV data sets covering styles, palettes, type pairings, product reasoning, landing flows, and quality rules."
trigger_phrases:
  - "design data sets"
  - "styles colors typography products csv"
  - "MIT design data inventory"
  - "assets data csv files"
---

# Design data sets

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Nine MIT-licensed CSV data sets covering styles, palettes, type pairings, product reasoning, landing flows, and quality rules.

These are the raw data behind both the critique-against inventory and the objective quality floor. They are adopted from the MIT-licensed `ui-ux-pro-max` repository, with all counts measured from the CSVs rather than upstream marketing figures.

## 2. HOW IT WORKS

### Critique-against data

Five of the data sets supply expected patterns to deviate from. `styles.csv` holds named looks with their effects, best-for, and contraindications. `colors.csv` holds semantic token sets with WCAG-pair notes, where the token schema and contrast discipline are adopted directly while the specific palettes are starting points to shift off. `typography.csv` holds conventional heading and body pairings by mood. `products.csv` and `ui-reasoning.csv` hold per-product-type recommendations whose `Recommended_Pattern` fields are read as the cliche to subvert and whose `Anti_Patterns` fields are mined for what to avoid. `landing.csv` holds conventional section orders and CTA placements.

### Quality-floor data

Three of the data sets back the objective quality floor. `ux-guidelines.csv` carries accessibility, motion, and responsive rules, `app-interface.csv` carries application-interface usability rules, and `charts.csv` carries data-visualization rules including chart-type fit and accessibility fallbacks. The skill deliberately did not adopt `react-performance.csv`, since React implementation performance belongs to `sk-code`.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `assets/data/styles.csv` | Shared | Named UI styles with effects, best-for, and contraindications. |
| `assets/data/colors.csv` | Shared | Semantic color token sets with WCAG-pair notes. |
| `assets/data/typography.csv` | Shared | Heading and body font pairings by mood. |
| `assets/data/products.csv` | Shared | Per-product-type style, landing, dashboard, and palette recommendations. |
| `assets/data/ui-reasoning.csv` | Shared | Per-product-type recommended pattern, decision rules, and anti-patterns. |
| `assets/data/landing.csv` | Shared | Conventional landing section orders and CTA placements. |
| `assets/data/ux-guidelines.csv` | Shared | Accessibility, motion, and responsive rules behind the quality floor. |
| `assets/data/app-interface.csv` | Shared | Application-interface usability rules behind the quality floor. |
| `assets/data/charts.csv` | Shared | Data-visualization rules including chart-type fit and a11y fallbacks. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `references/design_inventory.md` | Manual playbook | Documents the measured row counts and the read-it-as guidance for each data set. |
| `references/ux_quality_reference.md` | Manual playbook | Confirms which data sets back the quality floor and records the react-performance deferral. |

---

## 4. SOURCE METADATA

- Group: Critique-against data inventory
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `03--critique-against-data-inventory/design-data-sets.md`

Related references:
- [critique-against-inventory.md](critique-against-inventory.md) - Critique-against inventory framing
- [design-data-search.md](design-data-search.md) - Design data search
