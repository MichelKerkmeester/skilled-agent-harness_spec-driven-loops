---
title: Web Performance and Loading
description: Core Web Vitals, image and font loading, layout stability and main-thread scheduling.
trigger_phrases:
  - "web vitals loading strategy"
  - "lcp image priority"
  - "font metrics and layout shift"
importance_tier: important
contextType: implementation
version: 1.0.5.0
---

# Web Performance and Loading

How a page loads, paints and responds, measured by the Core Web Vitals.

---

## 1. OVERVIEW

### Purpose

This file covers Core Web Vitals, image and font loading, layout stability and main-thread scheduling.

### When to Use

- Improving the largest contentful paint of an image.
- Reserving layout space or matching font metrics to reduce layout shift.
- Reducing interaction latency or rendering work for offscreen content.
- Choosing responsive image sources, formats and loading hints.

### Boundaries

- **Baseline media rules.** The baseline media rules remain in [web-markup-and-css.md](web-markup-and-css.md).

---

## 2. FIELD METRICS AND LCP

### P1. Largest contentful paint resource

- **Rule:** Keep the likely LCP image eager, give that one image `fetchpriority="high"` and preload it when the initial markup cannot expose it early.
- **Why:** The LCP target is at most 2.5 seconds at the 75th percentile. TTFB helps diagnose server delay, while preload and priority address resource discovery and scheduling in the browser.
- **When not to:** Do not preload an image that is already discovered early or is not likely to become LCP.
- **Pitfall:** Marking several images high priority dilutes the signal, and lazy-loading the LCP image delays its request.
- **Support:** Judgment, no version gate.
- **See also:** [web.dev: Optimize LCP](https://web.dev/articles/optimize-lcp)

---

## 3. LAYOUT STABILITY AND FONTS

### P2. Cumulative layout shift

- **Rule:** Reserve the final box for images, embeds and asynchronous content before their dimensions are known.
- **Why:** The CLS target is at most 0.1 at the 75th percentile. A reserved box lets later content keep its position when a resource arrives.
- **When not to:** Skip a reserved box when the content is already in the initial layout and has a stable intrinsic size.
- **Pitfall:** Inserting a banner above existing content shifts every item below it even when the banner itself is small. Follow the web layer's [media sizing rule](web-markup-and-css.md#6-media).
- **Support:** Judgment, no version gate.
- **See also:** [web.dev: Optimize CLS](https://web.dev/articles/optimize-cls)

### P3. Font metrics and display strategy

- **Rule:** Start with a metric-matched fallback and `size-adjust`, then use ascent, descent and line-gap overrides only as a feature-detected enhancement.
- **Why:** Matching fallback glyph widths reduces line reflow before the web font loads. The override trio changes line-box metrics more directly, while `font-display: optional` favors avoiding late swaps and `swap` favors immediate text visibility.
- **When not to:** Use `swap` when showing the intended face matters more than avoiding a late metric change.
- **Pitfall:** Preloading a below-the-fold font can compete with the LCP resource.
- **Support:** Baseline: no web-features entry. Chrome 92 / Firefox 92 / Safari 17. Baseline limited availability (web-features `font-metric-overrides`). Chrome 87 / Firefox 89 / Safari unsupported.
- **See also:** [MDN: CSS @font-face](https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face)

---

## 4. INTERACTION AND OFFSCREEN CONTENT

### P4. Interaction to next paint

- **Rule:** Break long handlers into work-sized chunks and feature-detect `scheduler.yield()` before using it to return control to the browser. Keep chunking or a worker as the baseline path.
- **Why:** The INP target is at most 200 milliseconds at the 75th percentile. Yielding gives the browser a chance to process pending input and rendering before the handler continues.
- **When not to:** Keep a short synchronous handler together when it completes within the interaction budget.
- **Pitfall:** Yielding only after a long uninterrupted loop does not give input an earlier chance to run.
- **Support:** Baseline limited availability (web-features `scheduler`). Chrome 129 / Firefox 142 / Safari unsupported.
- **See also:** [MDN: Scheduler.yield()](https://developer.mozilla.org/en-US/docs/Web/API/Scheduler/yield)

### P5. Offscreen rendering with content visibility

- **Rule:** Apply `content-visibility: auto` to long offscreen sections and pair it with a realistic `contain-intrinsic-size`.
- **Why:** The browser can skip rendering work outside the viewport while the intrinsic size preserves a placeholder in layout.
- **When not to:** Avoid it on short pages or content whose immediate layout must be measured before it approaches the viewport.
- **Pitfall:** Without a placeholder size, the scrollbar can jump as skipped sections are rendered and measured. Some older Safari releases do not reveal skipped content through find-in-page, so keep searchable sections visible there.
- **Support:** Baseline newly available since 2025-09-15 (web-features `content-visibility`). Chrome 108 / Firefox 130 / Safari 26. Baseline widely available since 2026-03-18 (web-features `contain-intrinsic-size`). Chrome 83 / Firefox 107 / Safari 17.
- **See also:** [MDN: CSS content-visibility](https://developer.mozilla.org/en-US/docs/Web/CSS/content-visibility)

### P6. Containment boundaries

- **Rule:** Use `contain` only where the component can own the resulting layout, paint or size boundary.
- **Why:** Containment can create a containing block, stacking context or paint clip that changes descendants outside the component's apparent box.
- **When not to:** Avoid containment when descendants need to escape the box or depend on an ancestor's fixed or sticky positioning.
- **Pitfall:** Applying `contain: layout paint` to an ancestor of a fixed or sticky child changes its containing block and paint boundary. See [L1](web-layout-and-sizing.md#l1-ancestors-that-capture-fixed-positioning).
- **Support:** Baseline widely available since 2024-09-14 (web-features `contain`). Chrome 52 / Firefox 69 / Safari 15.4.
- **See also:** [MDN: CSS contain](https://developer.mozilla.org/en-US/docs/Web/CSS/contain)

### P7. Temporary will-change hints

- **Rule:** Add `will-change` shortly before the property starts animating and remove it when the animation ends.
- **Why:** The hint can prompt early rendering preparation, but it can also create a stacking context, containing block or extra graphics memory use.
- **When not to:** Do not add the hint when a measured animation does not benefit from preparation.
- **Pitfall:** Leaving `will-change: transform` on a permanent page shell can change fixed descendants and retain an unnecessary rendering layer.
- **Support:** Baseline widely available since 2022-07-15 (web-features `will-change`). Chrome 36 / Firefox 36 / Safari 9.1.
- **See also:** [MDN: CSS will-change](https://developer.mozilla.org/en-US/docs/Web/CSS/will-change)

### M29. GPU promotion and `will-change`

- **Rule:** Use `transform: translateZ(0)` sparingly as a fix for a measured problem, and toggle `will-change` on for the duration of an unperformant scroll animation and off afterwards.
- **Why:** Both promote a layer, and a permanent promotion costs memory and can change how text is rasterized.
- **When not to:** Leave the element unpromoted when the animation already holds its frame budget.
- **Pitfall:** A permanent `will-change` is its own leak.
- **Support:** Judgment, no version gate.
- **See also:** [web-performance-and-loading.md](web-performance-and-loading.md).

### P8. Main-thread long tasks

- **Rule:** Split, move or yield work that blocks the main thread for more than 50 milliseconds.
- **Why:** A long task delays input and rendering until the browser can run another task.
- **When not to:** Keep a bounded task together when it completes below the long-task threshold and does not delay an interaction.
- **Pitfall:** A third-party script can block input even when the app's own handlers are short.
- **Support:** Judgment, no version gate.
- **See also:** [web.dev: Optimize long tasks](https://web.dev/articles/optimize-long-tasks)

---

## 5. RESPONSIVE IMAGE DELIVERY

### P9. srcset and sizes selection

- **Rule:** Describe the image's rendered width in `sizes` when `srcset` uses width descriptors.
- **Why:** The browser multiplies the selected slot width by device pixel ratio to choose a source candidate. A 600-pixel slot at DPR 2 needs a candidate near 1200 pixels.
- **When not to:** Use density descriptors when the source set represents the same rendered dimensions at different pixel densities.
- **Pitfall:** Setting `sizes="100vw"` for a 600-pixel column can select a much larger image than the layout needs.
- **Support:** Baseline widely available since 2019-09-27 (web-features `srcset`). Chrome 38 / Firefox 38 / Safari 10.1.
- **See also:** [MDN: Responsive images](https://developer.mozilla.org/en-US/docs/Web/HTML/Guides/Responsive_images)

### P10. Picture formats and image hints

- **Rule:** List preferred AVIF and WebP sources before the JPEG `<img>` fallback, use loading, decoding and priority hints for their intended stages, and use `sizes="auto"` only as an enhancement.
- **Why:** The browser selects the first supported `<source>` in a `<picture>`.
  - `fetchpriority` guides scheduling.
  - `loading` changes fetch timing.
  - `decoding` guides display scheduling.
  - Explicit `sizes` values remain the baseline when `sizes="auto"` is unavailable.
- **When not to:** Use one `<img>` when there is no format, density or art-direction choice.
- **Pitfall:** Lazy-loading the LCP image fights its need to load early. Follow the [LCP rule](#p1-largest-contentful-paint-resource).
- **Support:**
  - `fetchpriority`: Baseline newly available since 2024-10-29 (web-features `fetch-priority`). Chrome 103 / Firefox 132 / Safari 17.2.
  - `loading`: Baseline widely available since 2026-06-19 (web-features `loading-lazy`). Chrome 77 / Firefox 121 / Safari 16.4.
  - `decoding`: Baseline: no web-features entry. Chrome 65 / Firefox 63 / Safari 11.1.
  - `sizes="auto"`: Baseline limited availability (web-features `sizes-auto`). Chrome 126 / Firefox 150 / Safari unsupported.
- **See also:** [MDN: HTML picture element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/picture)

---

## 6. SUPPORT

Support summaries show each feature's web-features Baseline classification and browser versions.

| Feature | Chrome | Firefox | Safari | Baseline |
|---|---:|---:|---:|---|
| `size-adjust` | 92 | 92 | 17 | Baseline: no web-features entry. |
| Font metric override trio | 87 | 89 | unsupported | limited availability (web-features `font-metric-overrides`) |
| `scheduler.yield()` | 129 | 142 | unsupported | limited availability (web-features `scheduler`) |
| `content-visibility: auto` | 108 | 130 | 26 | newly available since 2025-09-15 (web-features `content-visibility`) |
| `contain-intrinsic-size` | 83 | 107 | 17 | widely available since 2026-03-18 (web-features `contain-intrinsic-size`) |
| `contain` | 52 | 69 | 15.4 | widely available since 2024-09-14 (web-features `contain`) |
| `will-change` | 36 | 36 | 9.1 | widely available since 2022-07-15 (web-features `will-change`) |
| `srcset` | 38 | 38 | 10.1 | widely available since 2019-09-27 (web-features `srcset`) |
| `sizes` | 38 | 38 | 10.1 | widely available since 2019-09-27 (web-features `srcset`) |
| `fetchpriority` | 103 | 132 | 17.2 | newly available since 2024-10-29 (web-features `fetch-priority`) |
| `loading` | 77 | 121 | 16.4 | widely available since 2026-06-19 (web-features `loading-lazy`) |
| `decoding` | 65 | 63 | 11.1 | Baseline: no web-features entry. |
| `sizes="auto"` | 126 | 150 | unsupported | limited availability (web-features `sizes-auto`) |
