---
title: Layout And Responsive System
description: Spacing, rhythm, hierarchy, grid, density, responsive adaptation, input method, safe-area, and platform-context guidance.
trigger_phrases:
  - "layout rhythm"
  - "spacing system"
  - "responsive adaptation"
  - "container queries"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Layout And Responsive System

Spacing, rhythm, hierarchy, grid, density, responsive adaptation, input method, safe-area, and platform-context guidance.

---

## 1. OVERVIEW

### Core Principle

Space is a design material. Fix structure before adding more visual effects.

### When to Use

- Establishing a spacing scale and visual rhythm before adding containers.
- Choosing grid or flex layout by structural need.
- Adapting an experience across phone, tablet, desktop, and print contexts.
- Handling input method, safe areas, and content-driven breakpoints.

---

## 2. SPACING SYSTEM

Use a defined scale, not arbitrary one-off values. A 4-point base is flexible enough for dense and airy surfaces: `4, 8, 12, 16, 24, 32, 48, 64, 96`.

The canonical baseline rhythm row lives in the [`token-starter.md` spacing scale](../../assets/token-starter.md#4-spacing-scale): `--baseline` is the vertical-rhythm unit that spacing tokens and body line-height resolve to.

Rules:
- Tight gaps group related elements: usually `8-12px`.
- Generous gaps separate sections: often `48-96px`.
- Use `gap` for sibling rhythm instead of margin chains.
- Use semantic custom properties (`--space-xs`, `--space-section`) when defining tokens.
- Use `clamp()` for fluid space that breathes on large screens without exploding on mobile.

### Density Modes

Use one canonical spacing scale, then express density as a multiplier or named token set. Comfortable mode can use the scale as written; compact mode should step selected layout gaps down one notch (`--space-md` to `--space-sm`) or apply a clear multiplier such as `0.75`, while preserving touch targets, focus rings, and readable row height.

### Concentric Radius

When a rounded element nests inside another rounded surface, keep the radii concentric: the outer radius should equal the inner radius plus the padding or inset between them. A `12px` inner radius inside `8px` of padding wants about a `20px` outer radius.

This matters most when the surfaces sit close together. Once the gap is larger than about `24px`, treat the layers as separate surfaces and choose each radius independently. Mismatched nested radii are one of the fastest ways to make an otherwise careful UI feel slightly off.

---

## 3. HIERARCHY AND RHYTHM

Run the squint test: the primary element, secondary element, and group boundaries should remain visible. If everything has equal padding, equal cards, and equal heading weights, the hierarchy is flat.

Preferred hierarchy tools:
1. Proximity and separation.
2. Size and weight.
3. Position in reading flow.
4. Color only when needed.
5. Containers only when proximity is insufficient.

---

## 4. GRID AND STRUCTURE

- Use flexbox for one-dimensional rows, nav bars, button groups, and component internals.
- Use grid for dashboards, page-level composition, and coordinated rows plus columns.
- Use named grid areas for complex page layouts that change at breakpoints.
- Avoid identical card grids everywhere. Cards are for distinct actionable units, not every piece of content.
- Never nest cards inside cards; use spacing, headings, dividers, or common regions.

### Grid Contract

Define the page grid as a contract before placing content. A typical product grid uses `4` columns on phones, `8` on tablets, and `12` on desktop, with gutters and page margins from the spacing scale (`16px` mobile margins, `24-32px` tablet, `32-64px` desktop). Name what owns each region: navigation may reserve fixed columns, primary work content should own the widest continuous span, secondary panels get a predictable side span, and metadata or tools should not steal columns from the main task.

### Breakpoint-Free Tile Grids

For card or tile grids where each item can share the available row width, use an intrinsic grid before adding media queries:

```css
.tile-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--space-md);
}
```

This lets tiles reflow as space appears, keeps the minimum readable width explicit, and avoids breakpoint churn for simple gallery, card, and metric grids.

### Containment Restraint

Containment has to earn its border, fill, or elevation. If proximity, alignment, a heading, or a divider already separates a group, keep the region flat; reserve bordered or raised containers for interactive objects, modal focus, mixed backgrounds, or groups that would collapse without a boundary.

### Container Queries

Use container queries for components, viewport/media queries for page layouts. A card in a narrow sidebar can stay compact while the same card in a main content area expands automatically, because it responds to its own container width rather than the viewport.

```css
.card-container { container-type: inline-size; }
.card { display: grid; gap: var(--space-md); }

@container (min-width: 400px) {
  .card { grid-template-columns: 120px 1fr; }
}
```

Reach for container queries when the same component appears in differently sized regions; keep viewport/media queries for top-level page structure.

---

## 5. RESPONSIVE ADAPTATION

Adaptation means rethinking the experience for context, not scaling pixels.

| Context | Typical adaptation |
| --- | --- |
| Phone | single column, bottom-reachable actions, larger tap targets, progressive disclosure |
| Tablet | two-column or master-detail, touch plus pointer support, orientation-aware panels |
| Desktop | more simultaneous information, visible side navigation, keyboard shortcuts, max-width constraints |
| Print/email | remove interaction, simplify layout, expose hidden content when needed |

Use content-driven breakpoints. Stretch from narrow width until the design breaks, then add a breakpoint there. Three common breakpoints are often enough, but content wins.

---

## 6. INPUT METHOD AND SAFE AREAS

Use feature queries for input behavior:

```css
@media (pointer: coarse) {
  .control { min-height: 44px; }
}

@media (hover: none) {
  .hover-only-detail { display: none; }
}
```

Fixed elements must account for notches and home indicators:

```css
.bottom-bar {
  padding-bottom: max(1rem, env(safe-area-inset-bottom));
}
```

---

## 7. OPTICAL ADJUSTMENTS

- Icons may need optical centering; only adjust when visibly wrong.
- Text at geometric zero can look inset because of glyph whitespace.
- Touch targets can be expanded with pseudo-elements while the visible icon stays small.

---

## 8. VERIFICATION

- Primary action is visible within two seconds.
- Related elements are closer to each other than to unrelated elements.
- Spacing values come from the scale.
- No horizontal scroll at narrow widths.
- Touch targets are at least 44 by 44 pixels when touch is possible.
- The layout survives portrait, landscape, and very wide screens without stretching content absurdly.
