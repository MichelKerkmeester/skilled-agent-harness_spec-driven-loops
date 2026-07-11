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
version: 1.0.0.5
---

# Feature extractors (six detectors)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Six per-feature detectors that run inline during the extraction phase, each targeting a specific design-system dimension. They enrich the extraction output with structured metadata that the write and validate phases consume. Each detector writes into its own field of the output schema and reports findings even when none are found: a detector that captures no data records the absence rather than fabricating values. Five detectors write into `tokens.json` (`a11yTokens`, `darkMode`, `meta.framework`, `iconSystem`, `motionSystem`); the design-boundary detector writes into the sibling `extraction-report.json` (`designBoundary`) and feeds the L3/L4 stability classification. The detectors are the source of truth for the v3 Style Reference sections that depend on conditional data: dark mode, accessibility, icons, motion, and the framework markers in the file header.

---

## 2. HOW IT WORKS

### Accessibility detector (a11y-extract.ts)

Samples text/background color pairs from heading, body, button, link, and input elements. Calculates WCAG 2.1 contrast ratios for each pair. Records observed focus-ring styles (`outline`, `box-shadow` focus indicators), touch-target dimensions (minimum button height, minimum link padding), and ARIA attribute patterns (`aria-label`, `aria-expanded`, `aria-disabled`, `aria-live`). A per-page async pass also fills page language (`langAttribute`), skip-link presence (`skipLinkDetected`), tab order (`tabOrder`), alt-text coverage (`altTextCoverage`), and reduced-motion support — fields that were previously null. The focus indicator carries an honest `captured` boolean: when no focus styles were captured it reports `captured: false` and `consistent: false` rather than fabricating a consistent result on empty data. Writes into `tokens.json` `a11yTokens` with contrast-ratio table, focus-indicator CSS (plus its `captured`/`consistent` flags), touch-target px measurements, the async page-level a11y fields, and ARIA-usage flags.

### Dark-mode detector (dark-mode-detect.ts)

Probes three dark-mode triggers: `prefers-color-scheme: dark` media queries in stylesheets, `.dark` class on `<html>` or `<body>`, and `data-theme="dark"` attribute patterns. When dark mode is detected, captures the variable-value diffs between light and dark modes for every CSS custom property that changes. Records the detection method, trigger mechanism, and transition behavior. Writes into `tokens.json` `darkMode` with a `supported` boolean, variable-diff table, and detection-source notes. When no dark mode is detected, `supported` is `false` and the DESIGN.md dark-mode section is omitted.

### Framework detector (framework-detect.ts)

Scans for CSS framework markers: Tailwind utility class prefixes (`bg-`, `text-`, `p-`, `m-`, `flex`, `grid`), Bootstrap component classes (`btn`, `card`, `navbar`, `container`), and custom CSS variable systems (variable count, prefix conventions). Identifies the dominant framework and writes into `tokens.json` `meta.framework`. The detection result appears in the DESIGN.md file header comment.

### Icon detector (icon-detect.ts)

Inspects SVG elements and icon-font markup to identify the icon library. Matches library signatures: Heroicons v2 (24px viewBox with 1.5px stroke), Lucide (24px viewBox with specific path patterns), Font Awesome (class prefix `fa-`), custom SVG. Records stroke weight, grid size, and style (outlined, filled, duo-tone). Measures icon sizing distribution with frequency counts. Writes into `tokens.json` `iconSystem` (null when fewer than 3 SVGs are found).

### Motion detector (motion-extract.ts)

Reads `transition` and `animation` computed properties from sampled interactive elements: buttons, links, cards, modals, dropdowns. Records duration values (ms), easing functions (cubic-bezier or keyword), and element-specific choreography (fade-in, translate, scale). Captures `prefers-reduced-motion` media query presence. Writes into `tokens.json` `motionSystem` with duration scale, easing-function list, enter/exit pattern descriptions, and reduced-motion support flag (null when no transitions or animations exist).

### Design-boundary detector (design-boundary-detect.ts)

Distinguishes stable design-system tokens from content-level, image-derived, and one-off values. Analyzes token occurrence patterns across pages and viewports: tokens with high frequency and low variance across pages are classified as system-level; tokens appearing on a single page or tied to image content are flagged as content-level. Writes the `designBoundary` summary (`relationship`, `overallSimilarity`, `dimensionScores`) into the sibling `extraction-report.json` — not `tokens.json` — and feeds the L3/L4 stability classification in the cluster phase.

### Absence reporting

Every detector that finds no data records a minimal "not detected" result in its output field (a null `iconSystem` / `motionSystem`, `darkMode.supported = false`, and so on). The DESIGN.md write phase reads these results and produces honest absence notes (e.g., "No icon system was detected in the extraction data") rather than omitting sections or inventing values.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `backend/scripts/a11y-extract.ts` | Script | Contrast-ratio calculator, focus-indicator capture, touch-target measurement, ARIA detection |
| `backend/scripts/dark-mode-detect.ts` | Script | Media-query probe, class/attribute toggle detection, variable-diff recorder |
| `backend/scripts/framework-detect.ts` | Script | CSS framework class scanning, custom-variable analysis |
| `backend/scripts/icon-detect.ts` | Script | SVG inspection, library-signature matching, stroke-weight and grid-size capture |
| `backend/scripts/motion-extract.ts` | Script | Transition/animation reading, easing-function capture, choreography detection, reduced-motion check |
| `backend/scripts/design-boundary-detect.ts` | Script | System-vs-content token classification, cross-page frequency analysis |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `../../manual_testing_playbook/dark-mode/dark-mode-gate.md` | Manual playbook | Dark-mode gate scenario — confirms section 2.5 appears only when a dark palette is detected and is never fabricated |
| (no automated test) | Automated test | Covered by the manual playbook scenario |

---

## 4. SOURCE METADATA

- Group: FEATURE EXTRACTORS
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `feature-extractors/feature-extractors.md`

Related references:
- [extract.md](../extract/extract.md) — the extraction phase where these detectors run inline
- [cluster-classify.md](../cluster-classify/cluster-classify.md) — the stability classification that consumes design-boundary output
- [write-design-md.md](../write-design-md/write-design-md.md) — the write phase that gates sections on detector output (dark mode, a11y, icons, motion)
