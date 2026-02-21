---
description: "9 pre-delivery quality checks for visual-explainer HTML output"
---
# Success Criteria

These 9 checks must ALL pass before a file is delivered. Run them in order — earlier checks catch issues that would corrupt later checks. If any check fails, fix the issue and re-run from check 1.

Do not claim completion until every check is marked passing.

---

## Check 1: Squint Test

**What:** Blur your mental model of the page. Is the information hierarchy legible at low resolution?

**How to verify:**
- Heading sizes create obvious visual hierarchy (H1 >> H2 >> body)
- Sections are visually distinct from each other
- The most important information sits at the top-left of each section (F-pattern reading)
- A user skimming at 10% attention can identify the topic of each section

**Common failures:** All text the same size, sections blending together, accent color applied uniformly (no hierarchy signal).

**Fix:** Increase heading size differential, add section dividers or background color shifts, reduce accent color usage to only the highest-priority elements.

---

## Check 2: Swap Test

**What:** Would this page look wrong if a completely different theme were applied to it? It should — because the current aesthetic should be integral to the content.

**How to verify:**
- The font pairing reflects the content's tone (a monospace terminal font should not appear on an editorial plan review)
- The color palette is specific and non-generic (not "blue and grey" corporate defaults)
- Background texture or atmosphere is present and intentional
- The visual style would look mismatched on a different type of content

**Common failures:** Using default CSS resets with no aesthetic decisions, applying generic blue-on-white with no character.

**Fix:** Confirm the aesthetic profile selected in Phase 1 is actually reflected in the output. Check that font pairing is from the curated list, not fallback system fonts.

---

## Check 3: Both Themes

**What:** Light AND dark mode must look intentional — not like an afterthought.

**How to verify:**
- Switch `prefers-color-scheme` to both `light` and `dark` (use browser DevTools or OS setting)
- In both modes: text contrast is >= 4.5:1, surfaces have visible separation, accent color reads clearly
- Dark mode is not just "inverted light mode" — it should use a calibrated dark palette
- Diagrams (Mermaid, Chart.js) update their colors correctly in both modes

**Common failures:** Dark mode has invisible borders (dark border on dark background), Chart.js hardcoded colors ignore theme, Mermaid uses a built-in theme that doesn't respond to CSS variables.

**Fix:** Ensure all `--ve-*` variables are redefined in the `prefers-color-scheme: light` block. Verify Chart.js color values reference CSS variables or are defined per theme in JS.

---

## Check 4: Information Completeness

**What:** Every piece of data from the source material must be present in the output. Nothing should be silently omitted.

**How to verify:**
- Open the source material alongside the HTML output
- Scan every section, row, node, and label
- Confirm all entities, relationships, steps, or data points from the source appear in the output
- If source data was summarized or condensed, it was done intentionally with a disclosure note

**Common failures:** Mermaid diagram omitting nodes due to complexity cap (15-node limit), table rows dropped to fit layout, plan sections skipped without notice.

**Fix:** If content genuinely exceeds capacity, add a "Truncated for readability — see source for full detail" note with a file path reference. Do not silently drop data.

---

## Check 5: No Overflow

**What:** No content spills outside its container. No horizontal scrollbar on the page body. No text clipped by overflow hidden.

**How to verify:**
- Resize browser viewport to 320px width (mobile minimum)
- Check that all text wraps correctly — no single-word lines from excessive wrapping, no overflow blowout from long strings
- Inspect flex/grid containers: all direct children have `min-width: 0`
- Long strings (URLs, file paths, package names, code identifiers) are either wrapped (`overflow-wrap: break-word`) or truncated with ellipsis

**Common failures:** Mermaid diagram wider than viewport with no scroll container, table columns with long code strings that blow out layout, flex children without `min-width: 0`.

**Fix:**
```css
/* Flex/grid children */
.container > * { min-width: 0; }

/* Text content */
p, td, li, code { overflow-wrap: break-word; word-break: break-word; }

/* Mermaid wrapper */
.mermaid-wrap { overflow-x: auto; max-width: 100%; }
```

---

## Check 6: Mermaid Zoom Controls

**What:** Every Mermaid diagram must have interactive zoom controls: +/- buttons, reset button, Ctrl+scroll zoom, and drag-to-pan.

**How to verify:**
- Each `.mermaid-wrap` element has visible +/-/reset buttons
- Ctrl+scroll (or pinch-zoom on trackpad) zooms the diagram
- Click-and-drag pans the diagram when zoomed in
- Reset button returns to 100% zoom and center position
- Controls are visible in both light and dark mode

**Common failures:** Mermaid diagram with no zoom controls — unreadable for complex diagrams. Controls added but not wired to correct SVG element.

**Fix:** Wrap each Mermaid diagram in a container with JS-powered zoom:

```javascript
function initMermaidZoom(wrapEl) {
  let scale = 1, tx = 0, ty = 0;
  const svg = wrapEl.querySelector('svg');
  wrapEl.querySelector('.zoom-in').addEventListener('click', () => {
    scale = Math.min(scale * 1.2, 5);
    applyTransform(svg, scale, tx, ty);
  });
  wrapEl.querySelector('.zoom-out').addEventListener('click', () => {
    scale = Math.max(scale / 1.2, 0.3);
    applyTransform(svg, scale, tx, ty);
  });
  wrapEl.querySelector('.zoom-reset').addEventListener('click', () => {
    scale = 1; tx = 0; ty = 0;
    applyTransform(svg, scale, tx, ty);
  });
  wrapEl.addEventListener('wheel', (e) => {
    if (!e.ctrlKey && !e.metaKey) return;
    e.preventDefault();
    scale = e.deltaY < 0 ? Math.min(scale * 1.1, 5) : Math.max(scale / 1.1, 0.3);
    applyTransform(svg, scale, tx, ty);
  }, { passive: false });
}
function applyTransform(el, s, x, y) {
  el.style.transform = `scale(${s}) translate(${x}px,${y}px)`;
}
```

---

## Check 7: File Opens Cleanly

**What:** The HTML file must open without errors, flashes, or layout shifts.

**How to verify:**
- Open the file directly in Chrome/Firefox by double-clicking (no local server)
- Open browser DevTools Console — zero errors, zero warnings
- Page renders completely within 2 seconds with no visible layout shift after load
- No FOUT (Flash of Unstyled Text) — fonts load without jarring text swap

**Common failures:** Mermaid script throws because the CDN URL is wrong, `const` variable declared twice in `<script>`, Google Font URL missing `display=swap`.

**Fix:** Verify CDN URLs from `nodes/integration-points.md`. Run HTML through a validator. Check for duplicate variable names in script blocks.

---

## Check 8: Accessibility

**What:** The page must be usable by people with visual impairments and must not rely on color alone to convey information.

**How to verify:**
- Use browser DevTools Accessibility panel or check color pairs manually
- Body text on background: contrast ratio >= 4.5:1 (WCAG AA)
- Heading text on background: contrast ratio >= 4.5:1
- Accent color on background (used for status, labels): >= 4.5:1
- No information encoded only by color (e.g., "red = error" without a label or icon)
- All images and diagrams have `alt` text or `aria-label`

**Common failures:** Muted `--ve-text-dim` color falls below 4.5:1 on light backgrounds. Status badges using only color to indicate state (no text label).

**Fix:** Test specific color pairs:
- Background: `--ve-bg`, Text: `--ve-text` — must be >= 4.5:1
- Surface: `--ve-surface`, Text: `--ve-text-dim` — must be >= 4.5:1
- Always pair color signals with text: `<span class="badge error">Error</span>`, not just a red dot.

---

## Check 9: Reduced Motion

**What:** The page must work correctly — not just "not crash" — when the user has `prefers-reduced-motion: reduce` set.

**How to verify:**
- Enable reduced motion in OS accessibility settings or via browser DevTools (Rendering > Emulate CSS media feature)
- All entrance animations (`fadeUp`, `slideIn`, etc.) must either not play at all, or play as instant transitions
- Mermaid diagrams still render (they don't animate by default, but confirm)
- Page is fully usable — no UI elements hidden behind animations that never complete

**Common failures:** `@keyframes fadeUp` is defined but the `prefers-reduced-motion` block only sets `animation: none` on some elements, missing others. anime.js animations still run because the JS doesn't check the media query.

**Fix:**

CSS fallback:
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

anime.js fallback:
```javascript
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!reducedMotion) {
  anime({ targets: '.card', opacity: [0, 1], translateY: [20, 0], delay: anime.stagger(80) });
} else {
  document.querySelectorAll('.card').forEach(el => { el.style.opacity = 1; });
}
```

---

## Delivery Checklist

Before saving the file, confirm:

```
[ ] Check 1: Squint test — hierarchy visible when blurred
[ ] Check 2: Swap test — page is NOT generic
[ ] Check 3: Both themes — light AND dark look intentional
[ ] Check 4: Information completeness — no data silently omitted
[ ] Check 5: No overflow — all widths tested, overflow protected
[ ] Check 6: Mermaid zoom controls — every diagram has +/-/reset + Ctrl+scroll
[ ] Check 7: File opens cleanly — no console errors, no layout shifts
[ ] Check 8: Accessibility — contrast >= 4.5:1, no color-only encoding
[ ] Check 9: Reduced motion — works with prefers-reduced-motion: reduce
```

Only after all 9 boxes are checked: save to `.opencode/output/visual/` and report the file path.

---

## Cross References
- [[rules]] — ALWAYS rule 6 mandates running these checks
- [[how-it-works]] — Phase 4 (Deliver) is where checks are run
- [[integration-points]] — CDN URLs for Mermaid/Chart.js/anime.js referenced in checks 6 and 9
