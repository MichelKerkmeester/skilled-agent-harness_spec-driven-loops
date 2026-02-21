---
description: "Command cheat sheet, CDN snippets, and font pairings for quick access during sk-visual-explainer generation"
---

# Visual Explainer — Quick Reference

> LOAD PRIORITY: ALWAYS — loaded at skill invocation regardless of command.

---

## Command Cheat Sheet

| Command | Usage |
|---------|-------|
| `generate` | `/visual-explainer:generate [topic] [--type TYPE] [--style STYLE]` — Generate visual HTML page |
| `diff-review` | `/visual-explainer:diff-review [branch|commit|PR#]` — Visual diff/PR review |
| `plan-review` | `/visual-explainer:plan-review [plan-file-path]` — Visual plan analysis |
| `recap` | `/visual-explainer:recap [time-window]` — Visual progress recap |
| `fact-check` | `/visual-explainer:fact-check [html-file-path]` — Verify HTML accuracy against source |

---

## Command → Diagram → Aesthetic Mapping

| Command | Default Diagram | Default Aesthetic | Template |
|---------|----------------|-------------------|----------|
| `generate` | Auto-detect | Auto-detect | Varies |
| `diff-review` | Architecture/Flowchart | Blueprint | `architecture.html` |
| `plan-review` | Architecture/Table | Editorial | `architecture.html` |
| `recap` | Dashboard/Timeline | Data-dense | `data-table.html` |
| `fact-check` | N/A (re-verify) | N/A | N/A |

---

## CDN Snippet Block

Always use these exact CDN references:

```html
<!-- Mermaid v11 (ESM import — must go at bottom of <body>) -->
<script type="module">
  import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs';
  import elkLayouts from 'https://cdn.jsdelivr.net/npm/@mermaid-js/layout-elk/dist/mermaid-layout-elk.esm.min.mjs';
  mermaid.registerLayoutLoaders(elkLayouts);
  // ... mermaid.initialize({ ... }) goes here
</script>

<!-- Chart.js v4 -->
<script src="https://cdn.jsdelivr.net/npm/chart.js@4"></script>

<!-- anime.js v3.2.2 -->
<script src="https://cdn.jsdelivr.net/npm/animejs@3.2.2/lib/anime.min.js"></script>
```

---

## Google Font Pairings (13 Options)

> **Single source of truth:** `references/library_guide.md` — "Google Fonts — 13 Pairings" section. This table is a summary. For Google Fonts URL parameters and loading code, see library_guide.md.

| # | Body Font | Mono Font | Feel |
|---|-----------|-----------|------|
| 1 | Bricolage Grotesque | Fragment Mono | Technical, modern |
| 2 | Instrument Serif | JetBrains Mono | Editorial, refined |
| 3 | IBM Plex Sans | IBM Plex Mono | Corporate, systematic |
| 4 | Space Grotesk | Space Mono | Geometric, futuristic |
| 5 | Sora | Fira Code | Clean, developer-friendly |
| 6 | DM Sans | DM Mono | Neutral, versatile |
| 7 | Plus Jakarta Sans | Source Code Pro | Contemporary, balanced |
| 8 | Archivo | Roboto Mono | Bold, industrial |
| 9 | Outfit | Inconsolata | Rounded, approachable |
| 10 | Satoshi | Cascadia Code | Premium, modern |
| 11 | Work Sans | Azeret Mono | Practical, editorial |
| 12 | General Sans | Martian Mono | Distinctive, technical |
| 13 | Manrope | Anonymous Pro | Humanist, readable |

Always use `display=swap` in the Google Fonts URL. Define as CSS variables:
```css
--font-body: 'Bricolage Grotesque', system-ui, sans-serif;
--font-mono: 'Fragment Mono', 'SF Mono', Consolas, monospace;
```

**Avoid:** Inter, Roboto, Arial, or system-ui as the primary display/body font choice. These are overused and generic.

---

## Output Directory Convention

```
.opencode/output/visual/{command}-{desc}-{timestamp}.html
```

Examples:
- `.opencode/output/visual/generate-auth-flow-20241215-143022.html`
- `.opencode/output/visual/diff-review-pr-42-20241215-150311.html`
- `.opencode/output/visual/recap-week-48-20241215-160000.html`

---

## Quality Checklist (Quick Version)

Before delivering any HTML output, verify all 9 checks pass:

1. **Squint Test** — Visual hierarchy visible when squinting
2. **Swap Test** — Design looks wrong with a different theme (it's content-specific)
3. **Both Themes** — Light and dark mode both look intentional
4. **Information Completeness** — All source data is represented
5. **No Overflow** — No horizontal scroll or clipped text at any viewport width
6. **Mermaid Zoom Controls** — +/- buttons, reset, Ctrl+scroll, drag-to-pan
7. **File Opens Cleanly** — No console errors on `file://` protocol
8. **Accessibility** — WCAG AA contrast, no color-only indicators
9. **Reduced Motion** — All animations disabled when `prefers-reduced-motion: reduce`

> Full details for each check: `references/quality_checklist.md`
