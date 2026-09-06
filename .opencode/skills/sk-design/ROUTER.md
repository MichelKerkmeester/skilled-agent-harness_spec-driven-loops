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

Two intents today, both owned by `sk-design-fundamentals`. The split is real rather than
decorative: deciding a value and judging an existing surface load different things.

```python
INTENT_SIGNALS = {
    "VALUES": {"weight": 4, "keywords": ["padding", "spacing", "margin", "gutter", "type scale", "typography", "font size", "colour", "color", "contrast", "contrast ratio", "radius", "corner radius", "elevation", "shadow", "hierarchy", "visual hierarchy", "what should this look like"]},
    "REVIEW": {"weight": 4, "keywords": ["design review", "does this look right", "critique this", "visual audit", "ux laws", "accessibility contrast", "review this screen", "why does this look wrong"]},
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
}
```

---

## 3. HOW TO READ THIS

A mode is chosen by `hub-router.json`, not here. This document only answers what that mode loads.
A mode entry is loaded because the registry named the mode, not from here. This map lists leaves,
which is why no `SKILL.md` appears in it. Load what a row resolves and nothing more; a resource
already in context is not re-read.
