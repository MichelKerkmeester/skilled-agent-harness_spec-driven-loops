---
title: "Feature extractors"
description: "Per-feature detection run inline during extraction: accessibility, dark mode, CSS framework, icon system, motion tokens, and design boundary."
trigger_phrases:
  - "feature extractor"
  - "accessibility detection"
  - "dark mode detection"
  - "icon system detection"
  - "framework detection"
  - "motion token extraction"
importance_tier: "normal"
---

# Feature extractors (six detectors)

## 1. OVERVIEW

Six per-feature detectors that run inline during the extraction phase, each targeting a specific design-system dimension. They enrich `tokens.json` with structured metadata that the write and validate phases consume. Each detector writes into its own section of the token schema and reports findings even when none are found: a detector that captures no data records the absence rather than fabricating values. The detectors are the source of truth for DESIGN.md sections that depend on conditional data: dark mode (section 2.5), accessibility (section 9), icons (section 12), motion (section 6.5), and framework markers in the file header.

---

## 2. HOW IT WORKS

### Accessibility detector (a11y-extract.ts)

Samples text/background color pairs from heading, body, button, link, and input elements. Calculates WCAG 2.1 contrast ratios for each pair. Records observed focus-ring styles (`outline`, `box-shadow` focus indicators), touch-target dimensions (minimum button height, minimum link padding), and ARIA attribute patterns (`aria-label`, `aria-expanded`, `aria-disabled`, `aria-live`). Writes into `tokens.a11y` with contrast-ratio table, focus-indicator CSS, touch-target px measurements, and ARIA-usage flags.

### Dark-mode detector (dark-mode-detect.ts)

Probes three dark-mode triggers: `prefers-color-scheme: dark` media queries in stylesheets, `.dark` class on `<html>` or `<body>`, and `data-theme="dark"` attribute patterns. When dark mode is detected, captures the variable-value diffs between light and dark modes for every CSS custom property that changes. Records the detection method, trigger mechanism, and transition behavior. Writes into `tokens.darkMode` with a `supported` boolean, variable-diff table, and detection-source notes. When no dark mode is detected, `supported` is `false` and DESIGN.md section 2.5 is omitted.

### Framework detector (framework-detect.ts)

Scans for CSS framework markers: Tailwind utility class prefixes (`bg-`, `text-`, `p-`, `m-`, `flex`, `grid`), Bootstrap component classes (`btn`, `card`, `navbar`, `container`), and custom CSS variable systems (variable count, prefix conventions). Identifies the dominant framework and writes into `tokens.framework`. The detection result appears in the DESIGN.md file header comment.

### Icon detector (icon-detect.ts)

Inspects SVG elements and icon-font markup to identify the icon library. Matches library signatures: Heroicons v2 (24px viewBox with 1.5px stroke), Lucide (24px viewBox with specific path patterns), Font Awesome (class prefix `fa-`), custom SVG. Records stroke weight, grid size, and style (outlined, filled, duo-tone). Measures icon sizing distribution with frequency counts. Writes into `tokens.icons`.

### Motion detector (motion-extract.ts)

Reads `transition` and `animation` computed properties from sampled interactive elements: buttons, links, cards, modals, dropdowns. Records duration values (ms), easing functions (cubic-bezier or keyword), and element-specific choreography (fade-in, translate, scale). Captures `prefers-reduced-motion` media query presence. Writes into `tokens.motion` with duration scale, easing-function list, enter/exit pattern descriptions, and reduced-motion support flag.

### Design-boundary detector (design-boundary-detect.ts)

Distinguishes stable design-system tokens from content-level, image-derived, and one-off values. Analyzes token occurrence patterns across pages and viewports: tokens with high frequency and low variance across pages are classified as system-level; tokens appearing on a single page or tied to image content are flagged as content-level. Feeds into the L3/L4 stability classification in the cluster phase.

### Absence reporting

Every detector that finds no data writes a minimal "not detected" record into its token-schema section. The DESIGN.md write phase reads these records and produces honest absence notes (e.g., "No icon system was detected in the extraction data") rather than omitting sections or inventing values.

---

## 3. SOURCE FILES

- `tool/scripts/a11y-extract.ts` -- contrast-ratio calculator, focus-indicator capture, touch-target measurement, ARIA detection
- `tool/scripts/dark-mode-detect.ts` -- media-query probe, class/attribute toggle detection, variable-diff recorder
- `tool/scripts/framework-detect.ts` -- CSS framework class scanning, custom-variable analysis
- `tool/scripts/icon-detect.ts` -- SVG inspection, library-signature matching, stroke-weight and grid-size capture
- `tool/scripts/motion-extract.ts` -- transition/animation reading, easing-function capture, choreography detection, reduced-motion check
- `tool/scripts/design-boundary-detect.ts` -- system-vs-content token classification, cross-page frequency analysis

---

## 4. SOURCE METADATA

- Group: sk-design-md-generator
- Catalog source: `feature_catalog.md`
- Feature file: `06--feature-extractors/feature-extractors.md`

Related references:
- [extract.md](../01--extract/extract.md) -- the extraction phase where these detectors run inline
- [cluster-classify.md](../02--cluster-classify/cluster-classify.md) -- the stability classification that consumes design-boundary output
- [write-design-md.md](../03--write-design-md/write-design-md.md) -- the write phase that gates sections on detector output (dark mode, a11y, icons, motion)
