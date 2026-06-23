---
title: "Objective quality floor"
description: "The objective floor of accessibility, motion, touch, responsive, forms, and chart rules that every interface must clear."
trigger_phrases:
  - "objective quality floor"
  - "accessibility motion touch responsive forms charts gate"
  - "ux quality reference"
  - "design pass fail gate"
version: 1.5.0.4
---

# Objective quality floor

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

The objective floor of accessibility, motion, touch, responsive, forms, and chart rules that every interface must clear.

This is the pass or fail gate applied after the aesthetic direction is set. Where the design principles decide what the interface is, the quality floor confirms it does not break for real users, and when a rule and an aesthetic choice collide the rule wins. It is the authored floor, a distilled set of paraphrased accessibility, motion, touch, responsive, forms, and data-visualization facts kept in `ux_quality_reference.md`.

## 2. HOW IT WORKS

### Accessibility, motion, and input

The accessibility floor requires WCAG AA contrast verified rather than eyeballed, never encoding meaning in color alone, alt text on every image, accessible names on interactive elements including icon-only buttons, full keyboard operability with a visible focus ring, and real form labels with announced, specific errors. The motion floor honors the reduced-motion setting, avoids scattered animation in favor of one orchestrated moment, and makes loading states explicit. Touch targets are at least 44 by 44 pixels with adequate spacing and do not depend on hover for primary actions.

### Responsive, forms, and data visualization

The responsive floor sets the viewport meta tag, designs from mobile up, avoids unintended horizontal scroll, and keeps a readable body font floor around 16 pixels. Forms keep labels visible and persistent with immediate, specific feedback placed next to the field. Data visualization matches the chart type to the data shape, differentiates series by more than color, provides a data-table fallback, and respects data-volume thresholds. React implementation performance is explicitly deferred to `sk-code` rather than pulled into this floor.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `references/design-process/ux_quality_reference.md` | Shared | Defines the full authored quality floor across accessibility, motion, touch, responsive, forms, and data visualization, plus the React-performance deferral. |

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
- [../03--design-grounding/design-system-grounding.md](../03--design-grounding/design-system-grounding.md) - Design-system grounding
