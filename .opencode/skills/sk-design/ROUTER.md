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

# sk-design — stage two

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
a surface against values, and reading values back off a surface that already exists all load
different things.

```python
INTENT_SIGNALS = {
    "VALUES": {"weight": 4, "keywords": ["padding", "spacing", "margin", "gutter", "type scale", "typography", "font size", "colour", "color", "contrast", "contrast ratio", "radius", "corner radius", "elevation", "shadow", "hierarchy", "visual hierarchy", "what should this look like"]},
    "REVIEW": {"weight": 4, "keywords": ["design review", "does this look right", "critique this", "visual audit", "ux laws", "accessibility contrast", "review this screen", "why does this look wrong"]},
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
        "sk-create-chart/references/catalog.md",
        "sk-create-chart/references/color-system.md",
        "sk-create-chart/references/template-contract.md"
    ],
    "FLOWCHART": [
        "sk-create-diagram/assets/ascii-patterns/simple-workflow.md",
        "sk-create-diagram/assets/ascii-patterns/decision-tree-flow.md"
    ],
    "EXTRACT": [
        "sk-design-md-generator/references/extraction-workflow.md",
        "sk-design-md-generator/references/design-md-format.md",
        "sk-design-md-generator/references/quality-checklist.md",
    ],
}
```

---

## 3. HOW TO READ THIS

A mode is chosen by `hub-router.json`, not here. This document only answers what that mode loads.
A mode entry is loaded because the registry named the mode, not from here. This map lists leaves,
which is why no `SKILL.md` appears in it. Load what a row resolves and nothing more; a resource
already in context is not re-read.
