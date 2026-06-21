---
title: "Extract"
description: "Crawl a live URL across five viewports with Playwright, collect computed CSS values, run per-feature detectors, and emit verbatim tokens.json."
trigger_phrases:
  - "extract design tokens"
  - "crawl website for css"
  - "npx ts-node scripts/extract.ts"
  - "run extraction phase"
  - "tokens.json from url"
importance_tier: "normal"
---

# Extract (extract.ts / crawl.ts)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Crawls a live URL across five responsive viewports, collects every computed CSS value the page actually renders, and writes `tokens.json`. This is the entry point of the three-phase pipeline: everything downstream depends on a clean, full extraction. The extractor runs Playwright with Chromium, reads `getComputedStyle` on sampled elements, and tags each token with its source viewport, DOM selector path, and pixel context. Six per-feature detectors run inline during the crawl to enrich the token set with accessibility data, dark-mode information, framework markers, icon-system signatures, motion tokens, and design-boundary classifications.

---

## 2. HOW IT WORKS

### Crawl orchestration

The orchestrator (`extract.ts`) accepts a URL and dispatch flags, then hands off to the crawl engine (`crawl.ts`). Playwright launches headless Chromium and navigates the target URL. The crawl spiders sub-pages from the same origin (5 pages at 8 concurrency with `--fast`; configurable via `--max-pages` and `--concurrency`). Each page is sampled at five viewport widths: 375px, 640px, 768px, 1024px, and 1440px. At each viewport, the DOM collector walks the rendered element tree and triggers `dom-collector.ts`.

### DOM collection and CSS analysis

`dom-collector.ts` identifies elements that carry design-significant computed styles: headings, buttons, cards, inputs, navigation, badges, icons, and distinct structural containers. For each selected element, it passes the computed `CSSStyleDeclaration` to `css-analyzer.ts`. The CSS analyzer extracts the values used downstream:

- **Colors**: `color`, `background-color`, `border-color`, `box-shadow` rgba values, gradient endpoints.
- **Typography**: `font-family`, `font-size`, `font-weight`, `line-height`, `letter-spacing`.
- **Shadows**: `box-shadow` with rgba breakdown.
- **Radii**: `border-radius`.
- **Spacing**: `padding`, `margin`, `gap`.
- **CSS custom properties**: all `--*` variables reachable from `getComputedStyle`.

All values are recorded verbatim from the computed style -- no rounding, no normalization.

### Per-feature detectors

During the crawl, six detectors run inline and write their findings into the token structure:

- `a11y-extract.ts` calculates contrast ratios between sampled text/background pairs, records focus-ring styles, and measures touch-target dimensions.
- `dark-mode-detect.ts` probes `prefers-color-scheme` media queries, looks for `.dark` / `[data-theme="dark"]` class/attribute toggles, and records variable-value diffs between light and dark modes.
- `framework-detect.ts` scans for Tailwind class prefixes, Bootstrap grid markers, and custom CSS variable systems.
- `icon-detect.ts` inspects SVG elements and icon-font usage to identify library signatures (Heroicons v2, Lucide, Font Awesome, custom SVG) and records stroke weights and grid sizes.
- `motion-extract.ts` reads `transition` and `animation` computed properties and records durations, easing functions, and element-specific choreography.
- `design-boundary-detect.ts` distinguishes stable design-system tokens from image-derived, hero-gradient, and one-off content values.

### Output

The extraction writes `output/<domain>/tokens.json` (a flat JSON file with structured token arrays), plus viewport screenshots and an extraction report. The JSON is the single source of truth for the WRITE and VALIDATE phases.

### Failure modes

If Playwright cannot reach the URL, JavaScript rendering times out, or the page emits no measurable CSS, the extractor exits with an error. Do not retry in a loop; escalate the specific error, the URL, and whether the site requires authentication or blocks crawlers.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `tool/scripts/extract.ts` | Script | Orchestrator entry point, dispatch flags, phase sequencing |
| `tool/scripts/crawl.ts` | Script | Playwright crawl engine, viewport sampling, page spidering |
| `tool/scripts/dom-collector.ts` | Script | DOM tree walker, element selection, computed-style readout |
| `tool/scripts/css-analyzer.ts` | Script | Computed CSS parsing, value extraction, token assignment |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `../../manual_testing_playbook/01--extract/extract-001.md` | Manual playbook | Live extraction end-to-end scenario — confirms extract.ts produces a valid, non-empty tokens.json |
| `../../manual_testing_playbook/06--escalation/escalate-001.md` | Manual playbook | Anti-bot crawl escalation scenario — confirms blocked crawls never fabricate tokens |
| (no automated test) | Automated test | Covered by the manual playbook scenarios |

---

## 4. SOURCE METADATA

- Group: EXTRACT
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `01--extract/extract.md`

Related references:
- [references/extraction_workflow.md](../../references/extraction_workflow.md) — the three-phase operational guide
- [references/troubleshooting.md](../../references/troubleshooting.md) — failure modes and fixes
- [cluster-classify.md](../02--cluster-classify/cluster-classify.md) — the clustering and stability-classification phase that consumes extract output
