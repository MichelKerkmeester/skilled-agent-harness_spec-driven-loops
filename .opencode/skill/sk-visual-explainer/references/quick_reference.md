---
description: "Command cheat sheet, pinned CDN snippets, and delivery checklist for sk-visual-explainer"
---

# Visual Explainer — Quick Reference

> LOAD PRIORITY: ALWAYS — loaded at skill invocation regardless of command.

---

## 1. OVERVIEW

Fast lookup for command mappings, pinned CDN snippets, version matrix linkage, and delivery checks.

---

## Command Cheat Sheet

| Command | Usage |
|---------|-------|
| `generate` | `/create:visual_html <topic-or-source> --mode generate [--artifact auto\|spec\|plan\|tasks\|checklist\|implementation-summary\|research\|decision-record\|readme\|install-guide] [--source-file PATH] [--traceability] [--type TYPE] [--style STYLE]` |
| `diff-review` | `/create:visual_html [branch\|commit\|PR#] --mode diff-review [--spec-folder PATH] [--include-doc-impact]` |
| `plan-review` | `/create:visual_html <doc-file-path> --mode plan-review [--artifact auto\|...] [--traceability]` |
| `recap` | `/create:visual_html [time-window] --mode recap [--spec-folder PATH] [--include-doc-health]` |
| `fact-check` | `/create:visual_html [html-file-path] --mode fact-check [--source-file PATH] [--spec-folder PATH] [--artifact auto\|...]` |

---

## Common SpecKit Flags

| Flag | Purpose |
|---|---|
| `--artifact <type>` | Force artifact profile selection instead of auto-detection |
| `--source-file <path>` | Set explicit source-of-truth document |
| `--traceability` | Switch output to `ve-view-mode=traceability-board` |
| `--spec-folder <path>` | Load sibling SpecKit docs for doc-health or impact analysis |

---

## Canonical Version Matrix

Machine source of truth: `assets/library_versions.json`

| Library | Version | CDN |
|---------|---------|-----|
| Mermaid.js | `11.12.3` | `https://cdn.jsdelivr.net/npm/mermaid@11.12.3/dist/mermaid.esm.min.mjs` |
| @mermaid-js/layout-elk | `0.2.0` | `https://cdn.jsdelivr.net/npm/@mermaid-js/layout-elk@0.2.0/dist/mermaid-layout-elk.esm.min.mjs` |
| Chart.js | `4.5.1` | `https://cdn.jsdelivr.net/npm/chart.js@4.5.1/dist/chart.umd.min.js` |
| anime.js (optional) | `4.3.6` | `https://cdn.jsdelivr.net/npm/animejs@4.3.6/lib/anime.min.js` |

---

## CDN Snippet Block (Pinned)

```html
<!-- Mermaid + ELK (ESM, keep near end of body) -->
<script type="module">
  import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@11.12.3/dist/mermaid.esm.min.mjs';
  import elkLayouts from 'https://cdn.jsdelivr.net/npm/@mermaid-js/layout-elk@0.2.0/dist/mermaid-layout-elk.esm.min.mjs';

  mermaid.registerLayoutLoaders(elkLayouts);
  mermaid.initialize({
    startOnLoad: true,
    theme: 'base',
    layout: 'elk',
    securityLevel: 'strict',
    deterministicIds: true,
    maxTextSize: 50000,
    maxEdges: 200,
  });
</script>

<!-- Chart.js -->
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.5.1/dist/chart.umd.min.js"></script>

<!-- anime.js (optional advanced motion) -->
<script src="https://cdn.jsdelivr.net/npm/animejs@4.3.6/lib/anime.min.js"></script>
```

---

## Accessibility and Compatibility Signals

Always include:
- `<meta name="color-scheme" content="light dark">`
- `@media (prefers-reduced-motion: reduce)`
- `@media (prefers-contrast: more)`
- `@media (forced-colors: active)`
- `prefers-color-scheme` dark override

For icon-only controls:
- Add `aria-label` (for example zoom controls).

For chart canvases:
- Provide text fallback in `<figcaption>` or nearby summary.

---

## Motion Contract

Default: CSS-first stagger (`--i` delay variable) with reduced-motion fallback.

Optional advanced path: anime.js `4.3.6` only when interaction complexity requires it.

---

## Output Convention

```
.opencode/output/visual/{command}-{desc}-{timestamp}.html
```

SpecKit-aligned outputs must include:

```html
<meta name="ve-artifact-type" content="<artifact>">
<meta name="ve-source-doc" content="<workspace-relative-path>">
<meta name="ve-speckit-level" content="<1|2|3|3+|n/a>">
<meta name="ve-view-mode" content="<artifact-dashboard|traceability-board>">
```

---

## Quick Delivery Checklist

1. Theme and hierarchy are intentional.
2. Light and dark are both readable.
3. No overflow at mobile and desktop widths.
4. `validate-html-output.sh` exits `0`.
5. `check-version-drift.sh` exits `0` after library edits.
