---
title: "Frontend Surface Router"
description: "Intent signals and resource map for the stack-agnostic frontend evidence surface."
trigger_phrases:
  - "frontend web surface routing"
  - "frontend native surface routing"
  - "figma to code routing"
importance_tier: normal
contextType: general
version: 1.0.0.0
router_state: active
skill_pointer: SKILL.md
---

# Frontend Surface Router

The machine router for [`SKILL.md`](./SKILL.md). The core reference is the default resource; each intent adds the stack layer or Figma check it needs.

## 1. OVERVIEW

This surface holds the cross-stack core in `references/frontend-practice.md`, the web and native stack layers in `references/web-markup-and-css.md` and `references/react-native-layout-and-a11y.md`, six web topic files, five native topic files, and the five-pass Figma check in `references/figma-to-code.md`. Every intent loads the core and the matching web, native, or Figma-to-code layer. Topic files load when the request touches their listed concern.

### Web Topic Files

| Topic | File | Load when |
|---|---|---|
| Elements and attributes | [web-elements-and-attributes.md](references/web-elements-and-attributes.md) | Adding or changing a dialog, popover, disclosure, form-control attribute, or resource hint |
| Cascade and selectors | [web-cascade-and-selectors.md](references/web-cascade-and-selectors.md) | Changing selector reach, cascade layers, specificity, or component style boundaries |
| Layout and sizing | [web-layout-and-sizing.md](references/web-layout-and-sizing.md) | Changing stacking, containing blocks, intrinsic sizing, container queries, or scrolling |
| Accessibility patterns | [web-accessibility-patterns.md](references/web-accessibility-patterns.md) | Changing a widget pattern, accessible name, focus behavior, live region, browser preference, or form validation and error messaging |
| Performance and loading | [web-performance-and-loading.md](references/web-performance-and-loading.md) | Changing vitals, resource loading, image delivery, fonts, or main-thread work |
| Internationalization | [web-internationalization.md](references/web-internationalization.md) | Changing locale, direction, bidirectional text, formatting, or translation tolerance |

### Native Topic Files

| Topic | File | Load when |
|---|---|---|
| Accessibility | [native-accessibility.md](references/native-accessibility.md) | Changing accessibility aliases, announcements, focus containment, hiding, or touch bounds |
| Layout and text | [native-layout-and-text.md](references/native-layout-and-text.md) | Changing Yoga sizing, text scaling, line limits, or native layout geometry |
| Inputs and keyboard | [native-inputs-and-keyboard.md](references/native-inputs-and-keyboard.md) | Changing text input props, keyboard avoidance, focus chaining, or autofill |
| Lists and motion | [native-lists-and-motion.md](references/native-lists-and-motion.md) | Changing virtualized rows, FlashList recycling, animation, or reduced-motion behavior |
| Platform differences | [native-platform-differences.md](references/native-platform-differences.md) | Changing behavior that differs between iOS and Android |

---

## 2. INTENT MODEL

- **`FRONTEND_WEB`** fires on `semantic html markup`. It loads `references/frontend-practice.md` and `references/web-markup-and-css.md`.
- **`WEB_ELEMENTS`** fires on `html form autocomplete`, `dialog element`, or `popover attribute`. It loads `references/frontend-practice.md`, `references/web-markup-and-css.md`, and `references/web-elements-and-attributes.md`.
- **`WEB_CASCADE`** fires on `css cascade layers` or `css specificity conflict`. It loads `references/frontend-practice.md`, `references/web-markup-and-css.md`, and `references/web-cascade-and-selectors.md`.
- **`WEB_LAYOUT`** fires on `container query layout` or `css stacking context`. It loads `references/frontend-practice.md`, `references/web-markup-and-css.md`, and `references/web-layout-and-sizing.md`.
- **`WEB_A11Y`** fires on `web accessibility pattern`, `focus visible styling`, or `aria live region`. It loads `references/frontend-practice.md`, `references/web-markup-and-css.md`, and `references/web-accessibility-patterns.md`.
- **`WEB_PERF`** fires on `web font loading` or `largest contentful paint`. It loads `references/frontend-practice.md`, `references/web-markup-and-css.md`, and `references/web-performance-and-loading.md`.
- **`WEB_I18N`** fires on `right to left layout` or `bidirectional text`. It loads `references/frontend-practice.md`, `references/web-markup-and-css.md`, and `references/web-internationalization.md`.
- **`FRONTEND_NATIVE`** fires on `react native layout`. It loads `references/frontend-practice.md` and `references/react-native-layout-and-a11y.md`.
- **`NATIVE_A11Y`** fires on `react native accessibility`. It loads `references/frontend-practice.md`, `references/react-native-layout-and-a11y.md`, and `references/native-accessibility.md`.
- **`NATIVE_LAYOUT_TEXT`** fires on `react native text scaling`. It loads `references/frontend-practice.md`, `references/react-native-layout-and-a11y.md`, and `references/native-layout-and-text.md`.
- **`NATIVE_INPUTS`** fires on `react native keyboard avoidance`. It loads `references/frontend-practice.md`, `references/react-native-layout-and-a11y.md`, and `references/native-inputs-and-keyboard.md`.
- **`NATIVE_LISTS_MOTION`** fires on `react native scroll performance` or `react native reduced motion`. It loads `references/frontend-practice.md`, `references/react-native-layout-and-a11y.md`, and `references/native-lists-and-motion.md`.
- **`NATIVE_PLATFORM`** fires on `ios android platform difference`. It loads `references/frontend-practice.md`, `references/react-native-layout-and-a11y.md`, and `references/native-platform-differences.md`.
- **`FIGMA_TO_CODE`** fires on `figma to code`, `check built screen against figma`, `compare build with figma frame`, `figma frame check`, or `implement a figma design`. It loads `references/figma-to-code.md` and `references/frontend-practice.md`.

---

## 3. MACHINE ROUTER

```python
DEFAULT_RESOURCE = ["references/frontend-practice.md"]

INTENT_SIGNALS = {
    "FRONTEND_WEB": {"weight": 4, "keywords": ["semantic html markup"]},
    "WEB_ELEMENTS": {"weight": 4, "keywords": ["html form autocomplete", "dialog element", "popover attribute"]},
    "WEB_CASCADE": {"weight": 4, "keywords": ["css cascade layers", "css specificity conflict"]},
    "WEB_LAYOUT": {"weight": 4, "keywords": ["container query layout", "css stacking context"]},
    "WEB_A11Y": {"weight": 4, "keywords": ["web accessibility pattern", "focus visible styling", "aria live region"]},
    "WEB_PERF": {"weight": 4, "keywords": ["web font loading", "largest contentful paint"]},
    "WEB_I18N": {"weight": 4, "keywords": ["right to left layout", "bidirectional text"]},
    "FRONTEND_NATIVE": {"weight": 4, "keywords": ["react native layout"]},
    "NATIVE_A11Y": {"weight": 4, "keywords": ["react native accessibility"]},
    "NATIVE_LAYOUT_TEXT": {"weight": 4, "keywords": ["react native text scaling"]},
    "NATIVE_INPUTS": {"weight": 4, "keywords": ["react native keyboard avoidance"]},
    "NATIVE_LISTS_MOTION": {"weight": 4, "keywords": ["react native scroll performance", "react native reduced motion"]},
    "NATIVE_PLATFORM": {"weight": 4, "keywords": ["ios android platform difference"]},
    "FIGMA_TO_CODE": {"weight": 4, "keywords": ["figma to code", "check built screen against figma", "compare build with figma frame", "figma frame check", "implement a figma design"]},
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
    "FRONTEND_NATIVE": [
        "references/frontend-practice.md",
        "references/react-native-layout-and-a11y.md",
    ],
    "NATIVE_A11Y": [
        "references/frontend-practice.md",
        "references/react-native-layout-and-a11y.md",
        "references/native-accessibility.md",
    ],
    "NATIVE_LAYOUT_TEXT": [
        "references/frontend-practice.md",
        "references/react-native-layout-and-a11y.md",
        "references/native-layout-and-text.md",
    ],
    "NATIVE_INPUTS": [
        "references/frontend-practice.md",
        "references/react-native-layout-and-a11y.md",
        "references/native-inputs-and-keyboard.md",
    ],
    "NATIVE_LISTS_MOTION": [
        "references/frontend-practice.md",
        "references/react-native-layout-and-a11y.md",
        "references/native-lists-and-motion.md",
    ],
    "NATIVE_PLATFORM": [
        "references/frontend-practice.md",
        "references/react-native-layout-and-a11y.md",
        "references/native-platform-differences.md",
    ],
    "FIGMA_TO_CODE": [
        "references/figma-to-code.md",
        "references/frontend-practice.md",
    ],
}
```
