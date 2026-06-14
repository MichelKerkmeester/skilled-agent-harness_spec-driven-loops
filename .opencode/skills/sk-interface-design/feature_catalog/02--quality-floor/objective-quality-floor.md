---
title: "Objective quality floor"
description: "The objective floor of accessibility, motion, touch, responsive, forms, and chart rules that every interface must clear."
trigger_phrases:
  - "objective quality floor"
  - "accessibility motion touch responsive forms charts gate"
  - "ux quality reference"
  - "design pass fail gate"
---

# Objective quality floor

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

The objective floor of accessibility, motion, touch, responsive, forms, and chart rules that every interface must clear.

This is the pass or fail gate applied after the aesthetic direction is set. Where the design principles decide what the interface is, the quality floor confirms it does not break for real users, and when a rule and an aesthetic choice collide the rule wins. It is distilled from the highest-severity rows of the adopted data sets.

## 2. HOW IT WORKS

### Accessibility, motion, and input

The accessibility floor requires WCAG AA contrast verified rather than eyeballed, never encoding meaning in color alone, alt text on every image, accessible names on interactive elements including icon-only buttons, full keyboard operability with a visible focus ring, and real form labels with announced, specific errors. The motion floor honors the reduced-motion setting, avoids scattered animation in favor of one orchestrated moment, and makes loading states explicit. Touch targets are at least 44 by 44 pixels with adequate spacing and do not depend on hover for primary actions.

### Responsive, forms, and charts

The responsive floor sets the viewport meta tag, designs from mobile up, avoids unintended horizontal scroll, and keeps a readable body font floor around 16 pixels. Forms keep labels visible and persistent with immediate, specific feedback placed next to the field. Charts match the chart type to the data shape, differentiate series by more than color, provide a data-table or CSV fallback, and respect data-volume thresholds. React implementation performance is explicitly deferred to `sk-code` rather than pulled into this floor.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `references/ux_quality_reference.md` | Shared | Defines the full quality floor across accessibility, motion, touch, responsive, forms, and charts, plus the React-performance deferral. |
| `assets/data/ux-guidelines.csv` | Shared | Backs the accessibility, motion, and responsive rows the floor is distilled from. |
| `assets/data/app-interface.csv` | Shared | Backs the application-interface usability rows behind the floor. |
| `assets/data/charts.csv` | Shared | Backs the data-visualization rules including chart-type fit, a11y grade, and fallbacks. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `SKILL.md` | Manual playbook | Sections 4 and 6 require the floor (responsive, visible focus, reduced motion respected) before a design is ready. |

---

## 4. SOURCE METADATA

- Group: Quality floor
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `02--quality-floor/objective-quality-floor.md`

Related references:
- [../01--design-process/build-and-self-critique.md](../01--design-process/build-and-self-critique.md) - Build and self-critique
- [../03--critique-against-data-inventory/critique-against-inventory.md](../03--critique-against-data-inventory/critique-against-inventory.md) - Critique-against inventory framing
