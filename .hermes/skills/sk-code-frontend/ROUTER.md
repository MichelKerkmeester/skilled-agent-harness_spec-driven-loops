---
title: "Frontend Surface Router"
description: "Intent signals and resource map for the stack-agnostic frontend evidence surface."
trigger_phrases:
  - "frontend web surface routing"
  - "figma to code routing"
importance_tier: normal
contextType: general
version: 1.0.3.0
router_state: active
skill_pointer: SKILL.md
---

# Frontend Surface Router

The machine router for [`SKILL.md`](../../../.skilled/skills/sk-code/sk-code-frontend/SKILL.md). The core reference is the default resource; each intent adds the web layer or Figma check it needs.

## 1. OVERVIEW

This surface holds the core in `references/frontend-practice.md`, the web layer in `references/web-markup-and-css.md`, six web topic files, and the five-pass Figma check in `references/figma-to-code.md`. Every intent loads the core and the matching web or Figma-to-code layer. Topic files load when the request touches their listed concern.

### Web Topic Files

| Topic | File | Load when |
|---|---|---|
| Elements and attributes | [web-elements-and-attributes.md](../../../.skilled/skills/sk-code/sk-code-frontend/references/web-elements-and-attributes.md) | Adding or changing a dialog, popover, disclosure, form-control attribute, or resource hint |
| Cascade and selectors | [web-cascade-and-selectors.md](../../../.skilled/skills/sk-code/sk-code-frontend/references/web-cascade-and-selectors.md) | Changing selector reach, cascade layers, specificity, or component style boundaries |
| Layout and sizing | [web-layout-and-sizing.md](../../../.skilled/skills/sk-code/sk-code-frontend/references/web-layout-and-sizing.md) | Changing stacking, containing blocks, intrinsic sizing, container queries, or scrolling |
| Accessibility patterns | [web-accessibility-patterns.md](../../../.skilled/skills/sk-code/sk-code-frontend/references/web-accessibility-patterns.md) | Changing a widget pattern, accessible name, focus behavior, live region, browser preference, or form validation and error messaging |
| Performance and loading | [web-performance-and-loading.md](../../../.skilled/skills/sk-code/sk-code-frontend/references/web-performance-and-loading.md) | Changing vitals, resource loading, image delivery, fonts, or main-thread work |
| Internationalization | [web-internationalization.md](../../../.skilled/skills/sk-code/sk-code-frontend/references/web-internationalization.md) | Changing locale, direction, bidirectional text, formatting, or translation tolerance |

---

## 2. INTENT MODEL

- **`FRONTEND_WEB`** fires on `semantic html markup`. It loads `references/frontend-practice.md` and `references/web-markup-and-css.md`.
- **`WEB_ELEMENTS`** fires on `html form autocomplete`, `dialog element`, or `popover attribute`. It loads `references/frontend-practice.md`, `references/web-markup-and-css.md`, and `references/web-elements-and-attributes.md`.
- **`WEB_CASCADE`** fires on `css cascade layers` or `css specificity conflict`. It loads `references/frontend-practice.md`, `references/web-markup-and-css.md`, and `references/web-cascade-and-selectors.md`.
- **`WEB_LAYOUT`** fires on `container query layout` or `css stacking context`. It loads `references/frontend-practice.md`, `references/web-markup-and-css.md`, and `references/web-layout-and-sizing.md`.
- **`WEB_A11Y`** fires on `web accessibility pattern`, `focus visible styling`, `keyboard focus`, `broken tab order`, `accessible name`, or `aria live region`. It loads `references/frontend-practice.md`, `references/web-markup-and-css.md`, and `references/web-accessibility-patterns.md`.
- **`WEB_PERF`** fires on `web font loading` or `largest contentful paint`. It loads `references/frontend-practice.md`, `references/web-markup-and-css.md`, and `references/web-performance-and-loading.md`.
- **`WEB_I18N`** fires on `right to left layout` or `bidirectional text`. It loads `references/frontend-practice.md`, `references/web-markup-and-css.md`, and `references/web-internationalization.md`.
- **`FIGMA_TO_CODE`** fires on `figma to code`, `check built screen against figma`, `compare build with figma frame`, `figma frame`, `figma frame check`, or `implement a figma design`. It loads `references/figma-to-code.md` and `references/frontend-practice.md`.

---

## 3. MACHINE ROUTER

```python
DEFAULT_RESOURCE = ["references/frontend-practice.md"]

INTENT_SIGNALS = {
    "FRONTEND_WEB": {"weight": 4, "keywords": ["semantic html markup"]},
    "WEB_ELEMENTS": {"weight": 4, "keywords": ["html form autocomplete", "dialog element", "popover attribute"]},
    "WEB_CASCADE": {"weight": 4, "keywords": ["css cascade layers", "css specificity conflict"]},
    "WEB_LAYOUT": {"weight": 4, "keywords": ["container query layout", "css stacking context"]},
    "WEB_A11Y": {"weight": 4, "keywords": ["web accessibility pattern", "focus visible styling", "keyboard focus", "broken tab order", "accessible name", "aria live region"]},
    "WEB_PERF": {"weight": 4, "keywords": ["web font loading", "largest contentful paint"]},
    "WEB_I18N": {"weight": 4, "keywords": ["right to left layout", "bidirectional text"]},
    "FIGMA_TO_CODE": {"weight": 4, "keywords": ["figma to code", "check built screen against figma", "compare build with figma frame", "figma frame", "figma frame check", "implement a figma design"]},
}

RESOURCE_MAP = {
    "FRONTEND_WEB": [
        "references/frontend-practice.md",
        "references/web-markup-and-css.md",
    ],
    "WEB_ELEMENTS": [
        "references/frontend-practice.md",
        "references/web-markup-and-css.md",
        "references/web-elements-and-attributes.md",
    ],
    "WEB_CASCADE": [
        "references/frontend-practice.md",
        "references/web-markup-and-css.md",
        "references/web-cascade-and-selectors.md",
    ],
    "WEB_LAYOUT": [
        "references/frontend-practice.md",
        "references/web-markup-and-css.md",
        "references/web-layout-and-sizing.md",
    ],
    "WEB_A11Y": [
        "references/frontend-practice.md",
        "references/web-markup-and-css.md",
        "references/web-accessibility-patterns.md",
    ],
    "WEB_PERF": [
        "references/frontend-practice.md",
        "references/web-markup-and-css.md",
        "references/web-performance-and-loading.md",
    ],
    "WEB_I18N": [
        "references/frontend-practice.md",
        "references/web-markup-and-css.md",
        "references/web-internationalization.md",
    ],
    "FIGMA_TO_CODE": [
        "references/figma-to-code.md",
        "references/frontend-practice.md",
    ],
}
```
