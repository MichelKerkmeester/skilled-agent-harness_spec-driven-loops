---
title: "Context Adaptation Matrix"
description: "Current-state reference for design-foundations device, input, and context adaptation across phone, tablet, desktop, print, and constrained surfaces."
trigger_phrases:
  - "context adaptation matrix"
  - "design-foundations responsive adaptation"
  - "device input context adaptation"
  - "phone tablet desktop print adaptation"
version: 1.0.0.0
---

# Context Adaptation Matrix

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

`design-foundations` adapts a design across device, input method, connection, and posture by rethinking the experience per context rather than scaling pixels.

Adaptation reads four dimensions before deciding what changes: device and viewport, input method, connection and capability, and usage posture. Screen width alone is treated as a weak proxy for input method.

---

## 2. HOW IT WORKS

Each context rethinks four things: layout, interaction, content, and navigation. Phone gets single-column stacking with thumb-reach controls and progressive disclosure; tablet gets two-column or master-detail panels that follow orientation; desktop gets multi-column layout with a max-width cap and hover-carried secondary detail; print removes all interaction and expands collapsed content with page numbers; constrained surfaces (watches, embedded panels, TV remotes, in-car displays, email) get one focused task and forgiving hit targets.

### Input Detection Over Width Inference

Capability is detected with feature queries (`pointer: coarse`, `hover: hover`, `hover: none`) rather than inferred from viewport width, since a laptop with a touchscreen and a tablet with a keyboard both prove that width does not reveal input method. Functionality is never placed behind hover alone, and safe-area insets protect fixed bars on notched devices.

### What Must Not Change

Core functionality stays available in every context, one information architecture holds across contexts, platform expectations stay intact, and meaning never rests on hover-only or color-only channels.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/sk-design/design-foundations/references/layout/adaptation-matrix.md` | Shared | Defines the four adaptation dimensions, the context matrix, and input-detection rules. |
| `.opencode/skills/sk-design/design-foundations/references/layout/layout-responsive.md` | Shared | Defines the underlying spacing, rhythm, and responsive base the matrix extends. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/sk-design/design-foundations/manual-testing-playbook/manual-testing-playbook.md` | Manual playbook | Exercises context-adaptation scenarios against the live mode. |

---

## 4. SOURCE METADATA

- Group: Adaptation And Data
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `adaptation-and-data/context-adaptation-matrix.md`

Related references:
- [data-visualization-discipline.md](../adaptation-and-data/data-visualization-discipline.md) - Chart and table adaptation for small screens and assistive technology.
- [../token-system/typography-and-spacing-scale.md](../token-system/typography-and-spacing-scale.md) - Spacing scale the matrix rethinks per context.
