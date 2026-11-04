---
title: Web Layout and Sizing
description: Stacking contexts, containing blocks, intrinsic sizing, grid tracks, containers and scrolling behavior.
trigger_phrases:
  - "css containing block behavior"
  - "grid intrinsic sizing"
  - "container query layout"
importance_tier: important
contextType: implementation
version: 1.0.4.0
---

# Web Layout and Sizing

The CSS layout mechanics behind stacking, sizing, containers and scrolling.

---

## 1. OVERVIEW

### Purpose

This file covers stacking contexts, containing blocks, intrinsic sizing, grid tracks, containers and scrolling behavior.

### When to Use

- Changing how a fixed, sticky or stacked element is positioned.
- Sizing flex or grid tracks, or a container query, around intrinsic content.
- Handling media ratio, scrollbar space, scroll chaining or viewport height units.
- Adding a content-sized control or an intrinsic-size animation.

### Boundaries

- **Baseline flow and responsive rules.** The baseline flow and responsive rules remain in [web-markup-and-css.md](web-markup-and-css.md).

---

## 2. STACKING AND CONTAINING BLOCKS

### L1. Ancestors that capture fixed positioning

- **Rule:** Keep transforms, filters, perspective, paint or layout containment, relevant `will-change` values and `container-type` off ancestors of viewport-fixed headers or bars.
- **Why:** These properties can make an ancestor the containing block for a fixed descendant, so the descendant moves with that ancestor instead of the viewport. Transform, filter and containment behavior is longstanding.
- **When not to:** Scope a fixed child to an ancestor only when it is meant to remain fixed inside that component.
- **Pitfall:** Adding `will-change: transform` to smooth an ancestor can silently change where a fixed child is positioned.
- **Support:** Baseline widely available since 2025-08-14 (web-features `container-queries`). Chrome 105 / Firefox 110 / Safari 16.
- **See also:** [MDN: CSS containing block](https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block)

### L2. Stacking context triggers

- **Rule:** Inspect the ancestor chain for a stacking context before increasing a `z-index` value.
- **Why:** A stacking context is painted as one unit, so a descendant cannot out-rank content in a different context. Top-layer elements paint above ordinary stacking contexts. Triggers include:
  - the root, positioned elements with non-auto `z-index`, fixed or sticky positioning, and flex or grid items with `z-index`
  - opacity below one, blend modes, `transform`, `translate`, `rotate`, `scale`, filters and perspective
  - clipping, masks, `isolation: isolate`, `contain: layout`, `contain: paint`, `contain: strict`, `contain: content`, `container-type`, `content-visibility: auto` and `will-change` naming one of these properties
- **When not to:** Raise a local `z-index` when the elements already share the same stacking context and the order alone is wrong.
- **Pitfall:** An opacity such as `0.999` creates a stacking context, while `isolation: isolate` creates one without changing opacity or clipping paint.
- **Support:** Judgment, no version gate.
- **See also:** [MDN: CSS stacking context](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_positioned_layout/Stacking_context)

### L3. Flow root without clipping

- **Rule:** Use `display: flow-root` to contain floats or stop margin collapse when clipping is not required.
- **Why:** A flow root establishes a block formatting context without turning overflow into a clipping or scrolling rule.
- **When not to:** Use an overflow value when clipping is an intentional part of the component.
- **Pitfall:** `overflow: hidden` can clip content and prevent sticky descendants from sticking to their scrollport.
- **Support:** Judgment, no version gate.
- **See also:** [MDN: CSS block formatting context](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_display/Block_formatting_context)

---

## 3. INTRINSIC, GRID AND CONTAINER SIZING

### L4. Automatic minimum on flex and grid items

- **Rule:** Set `min-width: 0` or `min-inline-size: 0` on a flex or grid child that must shrink below its min-content size.
- **Why:** The automatic minimum can preserve the longest unbreakable content width, so the item refuses to shrink to the available track.
- **When not to:** Keep the automatic minimum when the item's content must set a lower bound on its track.
- **Pitfall:** Setting `overflow: hidden` may hide the overflow while leaving the sizing constraint in place.
- **Support:** Judgment, no version gate.
- **See also:** [MDN: CSS min-width](https://developer.mozilla.org/en-US/docs/Web/CSS/min-width)

### L5. Grid tracks, subgrid and auto repetition

- **Rule:** Use `minmax(0, 1fr)` when long content must not widen a flexible track, use subgrid when nested items must share parent tracks, and choose `auto-fit` or `auto-fill` by whether empty tracks should collapse.
- **Why:** A bare `1fr` has an automatic minimum. Subgrid reuses the parent grid tracks. `auto-fit` collapses empty repeated tracks, while `auto-fill` preserves them.
- **When not to:** Keep the intrinsic minimum when content must determine the track size, or use independent tracks when nested columns should not align with the parent.
- **Pitfall:** One unbreakable string can widen a grid whose flexible track still has an automatic minimum.
- **Support:** Judgment, no version gate.
- **See also:** [MDN: CSS subgrid](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout/Subgrid)

### L6. Container queries and container units

- **Rule:** Put query containment on a wrapper and query from its descendants, then use container units such as `cqi` or `cqw` where sizing should follow that wrapper.
- **Why:** A query container cannot use its own size query to style itself. `container-type: inline-size` also establishes containment that can affect fixed descendants and stacking.
- **When not to:** Use a viewport media query when the layout decision depends on the viewport rather than the component's available size.
- **Pitfall:** Adding `container-type` to the styled component itself does not make that component respond to its own size.
- **Support:** Baseline widely available since 2025-08-14 (web-features `container-queries`). Chrome 105 / Firefox 110 / Safari 16.
- **See also:** [MDN: CSS container size and style queries](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment/Container_size_and_style_queries)

---

## 4. MEDIA AND SCROLL GEOMETRY

### L7. Intrinsic media ratio

- **Rule:** Keep an image's or video's intrinsic `width` and `height` attributes consistent with its CSS `aspect-ratio`.
- **Why:** The attributes give the browser a ratio before media loads, while CSS controls the rendered box after styles apply.
- **When not to:** Let intrinsic ratio determine the box when the media is not constrained by a fixed layout slot.
- **Pitfall:** A conflicting CSS ratio can reserve one shape before load and display another after load.
- **Support:** Baseline widely available since 2024-03-20 (web-features `aspect-ratio`). Chrome 88 / Firefox 89 / Safari 15.
- **See also:** [MDN: CSS aspect-ratio](https://developer.mozilla.org/en-US/docs/Web/CSS/aspect-ratio)

### L8. Stable scrollbar space

- **Rule:** Apply `scrollbar-gutter: stable` to the element that owns scrolling when content changes would shift its inline layout.
- **Why:** The stable gutter reserves space for a classic scrollbar before overflow appears.
- **When not to:** Skip it when the platform uses overlay scrollbars and reserving space would add unwanted width.
- **Pitfall:** `stable both-edges` reserves space on both sides and can make a narrow pane needlessly smaller. Without a stable gutter, a classic scrollbar can shift the inline layout.
- **Support:** Baseline newly available since 2024-12-11 (web-features `scrollbar-gutter`). Chrome 94 / Firefox 97 / Safari 18.2.
- **See also:** [MDN: CSS scrollbar-gutter](https://developer.mozilla.org/en-US/docs/Web/CSS/scrollbar-gutter)

### L9. Scroll chaining and snap points

- **Rule:** Use `overscroll-behavior: contain` on an inner pane that must stop scroll chaining, and use scroll snap only when a destination should settle at defined positions.
- **Why:** The contain value keeps overscroll from propagating to an ancestor. Scroll snap adjusts the final scroll position toward configured snap areas.
- **When not to:** Keep normal chaining when users should continue scrolling the page after reaching the end of a pane.
- **Pitfall:** The `chain` value is unavailable in some browsers. Feature-detect it and keep the default or `contain` path.
- **Support:** Baseline limited availability (web-features `overscroll-behavior`). Chrome 144 / Firefox 150 / Safari unsupported. Baseline widely available since 2022-07-15 (web-features `scroll-snap`). Chrome 69 / Firefox 68 / Safari 11.
- **See also:** [MDN: CSS overscroll-behavior](https://developer.mozilla.org/en-US/docs/Web/CSS/overscroll-behavior)

### L10. Small, large and dynamic viewport heights

- **Rule:** Choose `svh` for the small visible viewport, `lvh` for the largest viewport and `dvh` when the layout should track browser chrome changes.
- **Why:** Mobile browser controls make the visible viewport change. The legacy `vh` behavior corresponds to the large viewport and can extend behind visible browser chrome.
- **When not to:** Use a content-driven height when the section should grow with its contents rather than fill a viewport.
- **Pitfall:** A `dvh` panel can resize while scrolling, while `lvh` can extend beyond the currently visible area.
- **Support:** Judgment, no version gate.
- **See also:** [MDN: Viewport-percentage length units](https://developer.mozilla.org/en-US/docs/Web/CSS/length#relative_length_units_based_on_viewport)

---

## 5. INTRINSIC SIZE ENHANCEMENTS

### L11. Content-sized controls and intrinsic-size animation

- **Rule:** Feature-detect `field-sizing: content` as an enhancement, and feature-detect `interpolate-size` or `calc-size()` as optional animation enhancements.
- **Why:** `field-sizing` lets supported controls size from their content. Intrinsic-size interpolation extends animation beyond numeric lengths and remains unavailable in several browsers.
- **When not to:** Use a stable row count when a control must keep a fixed editing area, or omit the animation when an instant state change is clear.
- **Pitfall:** Shipping either feature as the only layout or interaction path leaves browsers without it with a fixed default size or no transition.
- **Support:**
  - `field-sizing`: Baseline newly available since 2026-06-16 (web-features `field-sizing`). Chrome 123 / Firefox 152 / Safari 26.2.
  - `interpolate-size`: Baseline limited availability (web-features `interpolate-size`). Chrome 129 / Firefox unsupported / Safari unsupported.
  - `calc-size()`: Baseline limited availability (web-features `calc-size`). Chrome 129 / Firefox unsupported / Safari unsupported.
- **See also:** [MDN: CSS field-sizing](https://developer.mozilla.org/en-US/docs/Web/CSS/field-sizing)

---

## 6. LOGICAL PROPERTIES

For right-to-left direction and writing-mode mapping, follow [I4 in web-internationalization.md](web-internationalization.md#i4-logical-properties-and-writing-modes).

---

## 7. SUPPORT

Support summaries show each feature's web-features Baseline classification and browser versions.

| Feature | Chrome | Firefox | Safari | Baseline |
|---|---:|---:|---:|---|
| `container-type` | 105 | 110 | 16 | widely available since 2025-08-14 (web-features `container-queries`) |
| `aspect-ratio` | 88 | 89 | 15 | widely available since 2024-03-20 (web-features `aspect-ratio`) |
| `scrollbar-gutter` | 94 | 97 | 18.2 | newly available since 2024-12-11 (web-features `scrollbar-gutter`) |
| `overscroll-behavior: contain` | 144 | 150 | unsupported | limited availability (web-features `overscroll-behavior`) |
| `overscroll-behavior: chain` | 144 | 150 | unsupported | limited availability (web-features `overscroll-behavior`) |
| Scroll snap | 69 | 68 | 11 | widely available since 2022-07-15 (web-features `scroll-snap`) |
| `field-sizing` | 123 | 152 | 26.2 | newly available since 2026-06-16 (web-features `field-sizing`) |
| `interpolate-size` and `calc-size()` | 129 | unsupported | unsupported | limited availability (web-features `interpolate-size`); limited availability (web-features `calc-size`) |
