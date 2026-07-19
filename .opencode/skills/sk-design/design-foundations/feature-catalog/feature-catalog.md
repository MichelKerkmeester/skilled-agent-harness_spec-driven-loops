---
title: "design-foundations: Feature Catalog"
description: "Current-state inventory for design-foundations OKLCH color and token-system work, typography and spacing scales, context adaptation, data visualization discipline, and private procedure cards."
trigger_phrases:
  - "design-foundations feature catalog"
  - "foundations token system capabilities"
  - "context adaptation matrix"
  - "foundations procedure cards"
last_updated: "2026-07-06"
version: 1.0.0.0
---

# design-foundations: Feature Catalog

This catalog inventories the live `design-foundations` mode. The mode owns the static visual system of the `sk-design` family: color, type, layout, spacing, hierarchy, responsive adaptation, data visualization, and token vocabulary, then hands implementation to `sk-code`.

---

## 1. OVERVIEW

Use this catalog as the current-state inventory for foundations work: the register-gated OKLCH color and token system, the typography and spacing scale, the context adaptation matrix for responsive work, the data visualization discipline, and mode-local procedure cards.

---

## 2. TOKEN SYSTEM

### OKLCH Color And Token System

#### Description

Build a register-gated color system in OKLCH: primitives, semantic tokens, contrast pairs, surface scale, and dark-mode mapping.

#### Current Reality

The mode reads the shared Brand-vs-Product register first, because that call sets the color strategy and density everything else inherits, then builds OKLCH primitives and semantic token names (`primary/accent`, `neutral`, `semantic`, `surface`, `border`, `text`) before implementation values. Contrast is fixed by changing lightness first, dark mode is rebuilt as a separate surface system rather than an inverted palette, and high-chroma OKLCH values are clamped or wrapped with a fallback.

#### Source Files

See [`token-system/oklch-color-and-token-system.md`](token-system/oklch-color-and-token-system.md) for source anchors and the token starter scaffold.

---

### Typography And Spacing Scale

#### Description

Set type roles, pairing, measure, and a spacing scale so layout rhythm and hierarchy read as deliberate rather than accidental.

#### Current Reality

The mode sets display, heading, body, caption, and utility type roles before decorative type moves, and establishes a spacing scale with proximity-based grouping before adding containers, borders, or cards. Content drives breakpoints rather than fixed device sizes.

#### Source Files

See [`token-system/typography-and-spacing-scale.md`](token-system/typography-and-spacing-scale.md) for source anchors.

---

## 3. ADAPTATION AND DATA

### Context Adaptation Matrix

#### Description

Adapt a design across device, input method, connection, and posture by rethinking the experience per context rather than scaling pixels.

#### Current Reality

The adaptation matrix reads four dimensions, device and viewport, input method, connection, and posture, then rethinks layout, interaction, content, and navigation per target so a phone, a tablet, and a print export each get a deliberate treatment while core functionality survives every one. Input capability is detected rather than inferred from width.

#### Source Files

See [`adaptation-and-data/context-adaptation-matrix.md`](adaptation-and-data/context-adaptation-matrix.md) for the four adaptation dimensions and worked references.

---

### Data Visualization Discipline

#### Description

Treat chart and table encoding as design: match the chart to the question, keep one variable per visual channel, and align numeric tables for magnitude.

#### Current Reality

A chart type is chosen by the question rather than the dataset shape, every visual channel carries one variable, and color-for-data uses a sequential, diverging, or categorical scale chosen by the question and kept separate from brand color. Numeric tables right-align with tabular numerals so magnitude reads down the column.

#### Source Files

See [`adaptation-and-data/data-visualization-discipline.md`](adaptation-and-data/data-visualization-discipline.md) for chart-type selection and encoding rules.

---

## 4. PROCEDURE CARDS

### Foundations Procedure Card Inventory

#### Description

Three private cards support foundations-specific evidence gathering after the public mode is selected: component/system inventory, hierarchy/rhythm review, and tweakable design controls.

#### Current Reality

The mode chooses at most one primary card when a trigger matches, cites it in the plan or proof line, and preserves read-only operation with Read, Glob, and Grep only.

#### Source Files

See [`procedure-cards/foundations-procedure-card-inventory.md`](procedure-cards/foundations-procedure-card-inventory.md) for the card list and boundaries.
