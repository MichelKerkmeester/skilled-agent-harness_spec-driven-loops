---
description: "Detailed pass/fail verification procedure for all 9 pre-delivery quality checks with step-by-step instructions"
---

# Visual Explainer — Quality Checklist

> LOAD PRIORITY: ON_DEMAND — load when verifying completed HTML output or debugging quality issues.

Detailed pass/fail criteria for 9 core quality checks plus hardening signals. Run every check before delivering any sk-visual-explainer output.

---

## 1. OVERVIEW

Use this checklist as the final verification gate before delivering any visual-explainer HTML file.

Each check includes purpose, pass/fail criteria, common failure modes, and concrete remediations.

---

## How to Use This Checklist

Before marking an HTML file as complete, work through each check in order. If any check **fails**, fix the issue and re-verify that check before moving on. Checks 1-2 are design quality. Checks 3-7 are technical correctness. Checks 8-9 are accessibility requirements.

**Minimum bar:** All core checks and hardening checks must pass. There is no partial credit.

---

## Check 1: Squint Test

**Purpose:** Verify the page has clear visual hierarchy.

**How to run:**
- Blur the page by squinting at it, or use your browser's CSS to set `filter: blur(4px)` on `body`.
- Look at the page from arm's length.
- Can you identify: the main heading, where sections start and end, which elements are most important?

**Pass:** Clear visual hierarchy is visible even when blurred. Headings, sections, and primary content are distinguishable as distinct bands or regions.

**Fail:** Everything blends into a uniform block of similar-sized, similar-colored content. No clear focal points.

**Fix:**
- Increase heading font size (aim for 28-38px for `h1`, 20-24px for `h2`)
- Add more whitespace between sections (`margin-bottom: 40px` between major sections)
- Use background color or border differentiation between section types
- Ensure at least a 3x size difference between body text and the main heading
- Use `--ve-surface2` or `--ve-surface-elevated` to visually separate card groups

---

## Check 2: Swap Test

**Purpose:** Verify the design is specific to the content, not a generic template.

**How to run:**
- Mentally replace the current color palette with a completely different one (e.g., if it's teal, imagine violet).
- Mentally replace the font pairing with a different personality (e.g., if it's editorial serif, imagine monospace).
- Ask: "Would this aesthetic make sense for different content?"

**Pass:** The page would look **wrong** with a different theme. The color choices, font personality, and layout feel like they were made for this specific content and audience.

**Fail:** It's a generic template that could hold any content. The colors are arbitrary, the typography is default, and nothing about the design signals what the content is about.

**Fix:**
- Choose a palette that responds to the content's mood (e.g., warm terracotta for legacy systems, cold teal for real-time data, rose for audit/review, violet for architecture)
- Choose a font pairing that matches the content's audience (see `quick_reference.md` pairings)
- Add at least one content-specific design decision (e.g., dot grid for technical blueprints, radial gradient for creative work, diagonal lines for infrastructure)
- Customize the accent color to visually encode the content's primary concept

---

## Check 3: Both Themes

**Purpose:** Verify light and dark mode both look intentional and complete.

**How to run:**
- Toggle your OS appearance setting between Light and Dark
- Or use browser DevTools: DevTools > Rendering > Emulate CSS media feature `prefers-color-scheme`

**Pass:** Both modes look intentionally designed. Colors have good contrast in both modes. No element looks like an afterthought. The page is fully readable and visually balanced in both modes.

**Fail:** One mode (usually dark) looks washed out, has unreadable low-contrast text, incorrect background colors, or missing color variable overrides.

**Common failure points:**
- Forgetting to define `--ve-accent-dim` in dark mode (transparent accents often look wrong)
- Hardcoded `rgba(0,0,0,0.07)` for borders that become invisible on dark backgrounds
- Missing `background-image` gradient in the dark mode override
- Chart.js colors defined outside the `isDark` conditional

**Fix:**
- Ensure `@media (prefers-color-scheme: dark)` block defines ALL `--ve-*` variables
- Ensure `<meta name=\"color-scheme\" content=\"light dark\">` exists in `<head>`
- Add `@media (prefers-contrast: more)` and `@media (forced-colors: active)` fallback rules for critical text/UI
- Replace hardcoded color values with CSS variables
- Re-test Chart.js initialization: `const isDark = window.matchMedia('(...)').matches`
- Check that `--ve-border` and `--ve-border-bright` are defined for dark mode

---

## Check 4: Information Completeness

**Purpose:** Verify all source data is represented in the HTML output.

**How to run:**
- Open the source material (spec, plan file, PR diff, git log, etc.) alongside the HTML output
- Make a list of every distinct data point, relationship, and key concept in the source
- Check each item against the HTML — is it present?

**Pass:** All data points, relationships, and key information from the source material are represented in the HTML. Nothing has been silently omitted.

**Fail:** Missing sections, missing data points, missing relationships, or oversimplification that removes meaningful nuance.

**Common omissions:**
- Edge cases or failure paths in flowcharts
- Status indicators for partial/warning states (only showing pass/fail, not partial)
- File paths or code references that the source explicitly mentioned
- Callout notes or caveats that provide important context
- Timestamps or metadata that anchors the content to a point in time

**Fix:**
- Return to the source material and systematically compare each section
- Add a `<details class="collapsible">` block for supplementary information that doesn't fit in the main layout
- Use the `callout` pattern for important caveats that don't need their own section

---

## Check 5: No Overflow

**Purpose:** Verify no content overflows its container at any viewport width.

**How to run:**
- Open the HTML file in a browser
- Resize the viewport from 320px wide to 2560px wide (use DevTools responsive mode)
- At every width, check: Is there a horizontal scrollbar on `body`? Is any text clipped? Does any layout break?

**Pass:** No horizontal scrollbars appear on `<body>` (except intentional `overflow-x: auto` on `.table-scroll` or `.pipeline`). No text is clipped. Layout remains readable at all widths.

**Fail:** Horizontal scrollbar appears on `body`. Text overflows cards. Flex/grid children escape their containers. Content is clipped by `overflow: hidden` on a parent.

**Common causes:**
- Flex children without `min-width: 0` (the #1 cause)
- Long `code` or `pre` blocks without `overflow-x: auto`
- Fixed pixel widths on elements inside fluid containers
- `white-space: nowrap` on text that should wrap
- Missing `max-width` on wide content inside narrow containers

**Fix:**
```css
/* Always add to flex/grid children */
.flex-child, .grid-child { min-width: 0; }

/* Long text in code elements */
code { overflow-wrap: break-word; word-break: break-all; }

/* Code blocks */
pre { overflow-x: auto; }

/* Add responsive breakpoints for grid columns */
@media (max-width: 768px) {
  .arch-grid, .three-col, .compare-grid {
    grid-template-columns: 1fr;
  }
}
```

---

## Check 6: Mermaid Zoom Controls

**Purpose:** Verify every Mermaid diagram is navigable.

**How to run:**
- Locate every `.mermaid-wrap` element in the HTML
- For each one, verify:
  - There is a `+` (zoom in) button
  - There is a `-` (zoom out) button
  - There is a reset button (↺ or similar)
  - Holding Ctrl (or Cmd on Mac) and scrolling the mouse wheel zooms in/out
  - When zoomed in, clicking and dragging pans the diagram

**Pass:** All five interactions work correctly for every Mermaid diagram. Zoom state is maintained within the session (zooming in on one diagram does not affect others).

**Fail:** Missing buttons, broken JavaScript, zoom state shared across diagrams, or Ctrl+scroll not intercepted.

**Fix:** Include the complete zoom control snippet from `library_guide.md`. Ensure:
1. `.mermaid-wrap` has `position: relative; overflow: auto;`
2. `.mermaid` (the pre element) has `transform-origin: top center;`
3. `zoomDiagram()`, `resetZoom()`, and the `wheel` + `mousedown` event listeners are all present
4. Each `.mermaid-wrap` has its own independent zoom state via `target.dataset.zoom`

---

## Check 7: File Opens Cleanly

**Purpose:** Verify the HTML file works when opened directly from the filesystem (no server required).

**How to run:**
- In your browser, press Ctrl+O (or Cmd+O on Mac) and open the `.html` file directly
- The URL in the browser bar should start with `file://`
- Open DevTools (F12) → Console tab
- Reload the page and watch for any errors

**Pass:** No errors in the console. No visible layout shift after fonts load. All CDN resources (Mermaid, Chart.js, anime.js, Google Fonts) load correctly. The page is fully rendered within 3 seconds on a normal connection.

**Fail:** JavaScript errors (often `Uncaught ReferenceError`, `Failed to fetch`, or `is not a function`). FOUC (flash of unstyled content — fonts render in system fallback then jump). Missing icons or broken images.

**Common failure causes:**
- Missing `display=swap` in Google Fonts URL (causes FOUC)
- Incorrect CDN URL (typo, wrong version)
- Mermaid initialized without hardened limits (`securityLevel`, `maxTextSize`, `maxEdges`, `deterministicIds`)
- Script that depends on DOM elements before they exist (fix: move script to bottom of `<body>`)
- `type="module"` scripts running before non-module scripts they depend on
- `file://` protocol blocked by CORS for certain CDN providers (try JSDelivr as it allows `file://`)

**Fix:**
```html
<!-- Correct order in <head> -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=...&display=swap" rel="stylesheet">

<!-- Non-module scripts before </body> -->
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.5.1/dist/chart.umd.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/animejs@4.3.6/lib/anime.min.js"></script>

<!-- Module script (Mermaid) LAST -->
<script type="module">
  import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@11.12.3/dist/mermaid.esm.min.mjs';
  ...
</script>
```

---

## Check 8: Accessibility

**Purpose:** Verify the page is usable by people with visual impairments or color vision deficiencies.

**How to run:**
- Use a contrast checker tool (e.g., WebAIM Contrast Checker at webaim.org/resources/contrastchecker/)
- Test each text color + background color combination
- Check status badges and indicators: do they convey meaning without color alone?

**Pass:**
- All body text (13-16px): minimum 4.5:1 contrast ratio (WCAG AA)
- All large text (18px+ or 14px+ bold): minimum 3:1 contrast ratio
- Every status badge has a text label (not just a color dot)
- All interactive elements (buttons, links) are distinguishable without color

**Fail:**
- `--ve-text-dim` on `--ve-surface2` falls below 4.5:1 (common with light themes)
- Status badges where the only distinction is red vs. green with no text label
- Links that are only identifiable by color (no underline, no icon)
- Icons without accessible labels

**Fix:**
```html
<!-- Add aria-label to icon-only buttons -->
<button aria-label="Zoom in">+</button>

<!-- Status badges always have text, not just dots -->
<!-- GOOD: -->
<span class="status status--match">Match</span>
<!-- BAD: -->
<span class="status status--match"></span>

<!-- For color-coded table rows, add a text label -->
<td><span class="status status--gap">Gap</span></td>
```

For contrast issues, darken `--ve-text-dim` or lighten `--ve-surface2` until the ratio passes. Test both light and dark modes independently.

Also verify high-contrast support:
- `@media (prefers-contrast: more)` increases contrast for low-emphasis tokens.
- `@media (forced-colors: active)` keeps controls and labels visible with system palette overrides.

---

## Check 9: Reduced Motion

**Purpose:** Verify the page is fully usable when the user has `prefers-reduced-motion: reduce` set.

**How to run:**
- In browser DevTools → Rendering → Emulate CSS media feature: `prefers-reduced-motion: reduce`
- Reload the page
- Verify: Does the page content appear immediately without animated entry? Do all elements remain visible? Is the page usable?

**Pass:** All animated elements are immediately visible (no fade-in, no slide-in). The page layout is complete and readable without any animations. Scroll spy and interactive features still work (they are not animations).

**Fail:** Elements that were supposed to fade in never appear (remain invisible). Animated count-up numbers stay at 0. Page looks incomplete or broken.

**Root cause:** This happens when animation is the only mechanism making content visible (e.g., `opacity: 0` set on elements with no fallback).

**Fix — CSS:**
```css
/* This block is MANDATORY — always include at the bottom of your stylesheet */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-delay: 0ms !important;
    transition-duration: 0.01ms !important;
  }
  /* Ensure animated elements are visible immediately */
  .animate { opacity: 1; transform: none; }
}
```

**Fix — JavaScript (anime.js and count-up):**
```javascript
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Gate all animations
if (!prefersReduced) {
  anime({ targets: '.animate', opacity: [0, 1], translateY: [20, 0], ... });
}

// Count-up: show final value immediately if reduced motion
document.querySelectorAll('[data-count]').forEach(el => {
  if (prefersReduced) {
    el.innerHTML = el.dataset.count;
    return;
  }
  anime({ targets: el, innerHTML: [0, parseInt(el.dataset.count)], ... });
});
```

---

## Check 10: SpecKit Metadata Contract

**Purpose:** Ensure SpecKit-aware outputs are machine-detectable and traceable.

**How to run:**
- Inspect `<head>` for `ve-artifact-type`.
- If present, verify all metadata keys exist:
  - `ve-artifact-type`
  - `ve-source-doc`
  - `ve-speckit-level`
  - `ve-view-mode`

**Pass:** All four tags exist and values are valid (`ve-view-mode` is `artifact-dashboard` or `traceability-board`).

**Fail:** Missing any metadata key, invalid level value, or empty source doc.

**Fix:**
```html
<meta name="ve-artifact-type" content="plan">
<meta name="ve-source-doc" content="specs/042/plan.md">
<meta name="ve-speckit-level" content="2">
<meta name="ve-view-mode" content="artifact-dashboard">
```

---

## Check 11: Artifact Section and Anchor Coverage

**Purpose:** Verify the rendered view covers required sections for the detected artifact profile.

**How to run:**
- Load expected profile from `artifact_profiles.md` or `user_guide_profiles.md`.
- Compare required sections and anchors with rendered panels/labels.

**Pass:** Required section coverage and anchor coverage are explicitly represented and scored.

**Fail:** Missing required artifact areas (for example checklist evidence panel or plan phase dependency view).

**Fix:**
- Add missing profile modules.
- Report section/anchor coverage percentages directly in the output.

---

## Check 12: Placeholder Leakage

**Purpose:** Prevent template placeholders from leaking into final deliverables.

**How to run:**
- Search final HTML for placeholder tokens:
  - `[YOUR_VALUE_HERE`
  - `[PLACEHOLDER]`
  - unresolved template brackets from copied docs

**Pass:** No placeholder tokens are present.

**Fail:** Any unresolved placeholder appears in copy, labels, or metadata.

**Fix:**
- Replace all placeholders with resolved values before delivery.
- Re-run fact-check with explicit source file.

---

## Check 13: Cross-Doc Link Integrity

**Purpose:** Ensure SpecKit artifact relationships are represented and internally consistent.

**How to run:**
- For SpecKit docs, verify links among `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `implementation-summary.md`.
- For traceability mode, verify graph and matrix sections both reflect current links.

**Pass:** Cross-doc relationships are represented with no missing expected links.

**Fail:** Required links are absent or contradict source docs.

**Fix:**
- Add missing links to matrix/diagnostics sections.
- Include remediation notes for unresolved links.

---

## Quick Reference — All 13 Checks

| # | Check | Method | Pass Criterion |
|---|-------|--------|----------------|
| 1 | Squint Test | Blur the page | Clear hierarchy visible |
| 2 | Swap Test | Mental aesthetic swap | Design looks wrong with different theme |
| 3 | Both Themes | Toggle OS appearance | Both modes look intentional |
| 4 | Information Completeness | Compare vs. source | All data points present |
| 5 | No Overflow | Resize 320px–2560px | No body scrollbar, no clipped content |
| 6 | Mermaid Zoom | Manual interaction test | +/−/reset/Ctrl+scroll/drag all work |
| 7 | File Opens Cleanly | Open via file:// | Zero console errors, no FOUC |
| 8 | Accessibility | Contrast checker | WCAG AA, no color-only indicators |
| 9 | Reduced Motion | DevTools emulation | All content visible, no broken layout |
| 10 | SpecKit Metadata Contract | Check `<meta name=\"ve-*\">` | All 4 metadata keys present and valid |
| 11 | Artifact Section Coverage | Compare to profile rules | Required sections/anchors represented |
| 12 | Placeholder Leakage | Search for placeholder tokens | No unresolved placeholder strings |
| 13 | Cross-Doc Link Integrity | Graph/matrix vs source docs | Required links present and consistent |
