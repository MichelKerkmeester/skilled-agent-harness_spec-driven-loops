---
title: sk-design Surface Router — per-intent leaf sets
description: Stage-two router at the sk-design hub root. hub-router.json selects the workflow mode; this document maps a design intent to the exact mode-local leaf resources that mode should load, so a request loads what it needs rather than a directory.
trigger_phrases:
  - "sk-design surface router"
  - "design resource map"
  - "design intent routing"
importance_tier: important
contextType: implementation
version: 1.0.0.0
router_state: active
skill_pointer: SKILL.md
---

# sk-design Surface Router — per-intent leaf sets

## 1. OVERVIEW

`SKILL.md` picks the mode. This document picks what that mode loads.

`hub-router.json` selects the workflow mode from a request. This router then maps the design intent
inside that request to the exact mode-local resources worth loading, so a request pulls what it
needs rather than a directory. Every `RESOURCE_MAP` path resolves on disk and dual-reads to a
canonical typed pair through `leaf-manifest.json`.

An intent that matches nothing here is a gap to report, not a reason to load everything.

---

## 2. INTENT MODEL

Five intents across four modes. The split is real rather than decorative: deciding a value, judging
a surface against values, authoring a chart canvas, authoring a diagram canvas, and reading values
back off a surface that already exists all load different things.

| Intent | Mode | What the request is asking for |
|--------|------|-------------------------------|
| `VALUES` | `sk-design-fundamentals` | Decide a value for something that does not exist yet |
| `REVIEW` | `sk-design-fundamentals` | Judge a surface that does exist against those values |
| `CHART` | `sk-design-chart` | Author a data canvas: one file, one question a reader answers by looking |
| `FLOWCHART` | `sk-design-diagram` | Author a process canvas, in markup or in text characters |
| `EXTRACT` | `sk-design-md-generator` | Read values back off a surface that already exists |

`VALUES` and `REVIEW` share a mode because they share its references; they stay separate intents
because they load different ones.

---

## 3. MACHINE-READABLE ROUTER (replay / benchmark source)

The single machine-readable projection of the intent model above. The prose is the human-facing
contract; this block is the byte-for-byte source the deterministic router-replay parses. Keep them in
sync: when a map row changes above, update the matching `RESOURCE_MAP` entry here. Every
`RESOURCE_MAP` path resolves on disk and is registered in `leaf-manifest.json`, so each dual-reads to
a canonical typed pair.

```python
# No always-loaded preamble: a design request loads only the selected mode's
# leaves, so the hub default route stays minimal and a no-match disambiguates
# rather than pulling four modes' references into context.
DEFAULT_RESOURCE = []

INTENT_SIGNALS = {
    "VALUES": {"weight": 4, "keywords": ["padding", "spacing", "margin", "gutter", "type scale", "typography", "font size", "colour", "color", "contrast", "contrast ratio", "radius", "corner radius", "elevation", "shadow", "hierarchy", "visual hierarchy", "what should this look like", "slide deck design", "slide layout", "presentation design", "deck spacing", "how should this slide be laid out", "print layout", "printed page design", "margins for a print layout", "type scale for a printed report", "document layout", "document layout hierarchy", "report layout", "long-form layout", "poster layout"]},
    "REVIEW": {"weight": 4, "keywords": ["design review", "does this look right", "critique this", "visual audit", "ux laws", "accessibility contrast", "review this screen", "why does this look wrong", "design review of this slide deck", "review this deck", "review this layout"]},
    "CHART": {"weight": 4, "keywords": ["create a chart", "make a chart", "chart this data", "chart the data", "plot the data", "plot this data", "standalone html chart", "chart catalog", "which chart type", "chart template", "chart color system", "chart colour system", "data visualization", "data visualisation", "data viz", "bar chart of", "line chart of", "scatter plot of", "treemap", "waterfall chart", "heat matrix", "heatmap", "heat map", "calendar heatmap", "box plot", "candlestick chart", "stacked area chart", "stacked bar chart", "grouped bar chart", "donut chart", "waffle chart", "histogram", "parallel coordinates"]},
    "FLOWCHART": {"weight": 4, "keywords": ["flowchart", "ascii", "text diagram", "text characters", "decision tree", "decision branch", "process diagram", "flow diagram", "diagram the", "as a diagram"]},
    "EXTRACT": {"weight": 4, "keywords": ["extract", "design.md", "style reference", "design tokens", "measure this surface", "from a url", "from a site", "css extraction", "validate design.md", "style guide from"]},
}

RESOURCE_MAP = {
    "VALUES": [
        "sk-design-fundamentals/references/hierarchy.md",
        "sk-design-fundamentals/references/color-system.md",
        "sk-design-fundamentals/assets/token-starter-set.md",
    ],
    "REVIEW": [
        "sk-design-fundamentals/references/review-checklist.md",
        "sk-design-fundamentals/references/ux-laws.md",
        "sk-design-fundamentals/references/diagnosis-table.md",
    ],
    "CHART": [
        "sk-design-chart/references/catalog.md",
        "sk-design-chart/references/color-system.md",
        "sk-design-chart/references/template-contract.md"
    ],
    "FLOWCHART": [
        "sk-design-diagram/assets/ascii-patterns/simple-workflow.md",
        "sk-design-diagram/assets/ascii-patterns/decision-tree-flow.md"
    ],
    "EXTRACT": [
        "sk-design-md-generator/references/extraction-workflow.md",
        "sk-design-md-generator/references/design-md-format.md",
        "sk-design-md-generator/references/quality-checklist.md",
    ],
}
```

---

## 4. HOW TO READ THIS

- A mode is chosen by `hub-router.json`, not here. This document only answers what that mode loads.
- One dominant intent routes to one mode's leaf set.
- Two near-tied intents (within the ambiguity delta) route to both leaf sets; the union is deduped by
  canonical pair and capped at the selected-map union limit. `CHART` and `FLOWCHART` are the pair most
  likely to tie, because a request to visualise something rarely says which canvas it wants.
- `VALUES` and `REVIEW` resolve to the same mode. A tie between them is not ambiguity to escalate; it
  is one mode loading both leaf sets.
- This map lists leaves, which is why no `SKILL.md` appears in it. A mode entry is loaded because the
  registry named the mode, not from here.
- Load what a row resolves and nothing more; a resource already in context is not re-read.
- No keyword match is the hub's UNKNOWN fallback: report the gap and confirm the target mode before
  loading anything. An intent that matches nothing here is a gap to report, not a reason to load
  everything.
