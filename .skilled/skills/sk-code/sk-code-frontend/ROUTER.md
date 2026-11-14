---
title: "Frontend Surface Router"
description: "Intent signals and resource map for the stack-agnostic frontend evidence surface."
trigger_phrases:
  - "frontend web surface routing"
  - "figma to code routing"
importance_tier: normal
contextType: general
version: 1.1.1.0
router_state: active
skill_pointer: SKILL.md
---

# Frontend Surface Router

The machine router for [`SKILL.md`](./SKILL.md). The core reference is the default resource; each intent adds the web layer or Figma check it needs.

## 1. OVERVIEW

This surface holds the core in `references/frontend-practice.md`, the web layer in `references/web-markup-and-css.md`, nine web topic files, the starter token file `assets/tokens.css`, and the five-pass Figma check in `references/figma-to-code.md`. Every intent loads the core and the matching web or Figma-to-code layer. Topic files load when the request touches their listed concern.

### Web Topic Files

| Topic | File | Load when |
|---|---|---|
| Elements and attributes | [web-elements-and-attributes.md](references/web-elements-and-attributes.md) | Adding or changing a dialog, popover, disclosure, form-control attribute, or resource hint |
| Cascade and selectors | [web-cascade-and-selectors.md](references/web-cascade-and-selectors.md) | Changing selector reach, cascade layers, specificity, or component style boundaries |
| Layout and sizing | [web-layout-and-sizing.md](references/web-layout-and-sizing.md) | Changing stacking, containing blocks, intrinsic sizing, container queries, or scrolling |
| Accessibility patterns | [web-accessibility-patterns.md](references/web-accessibility-patterns.md) | Changing a widget pattern, accessible name, focus behavior, live region, browser preference, or form validation and error messaging |
| Performance and loading | [web-performance-and-loading.md](references/web-performance-and-loading.md) | Changing vitals, resource loading, image delivery, fonts, or main-thread work |
| Internationalization | [web-internationalization.md](references/web-internationalization.md) | Changing locale, direction, bidirectional text, formatting, or translation tolerance |
| Visual values | [web-visual-values.md](references/web-visual-values.md) | Choosing a spacing, type, weight, colour, shadow, radius or opacity value, or building a palette or token set |
| Visual hierarchy and review | [web-visual-hierarchy.md](references/web-visual-hierarchy.md) | Fixing a screen that looks wrong, starting a new screen, applying UX laws, or reviewing a screen's visual quality |
| Motion and interaction | [web-motion-and-interaction.md](references/web-motion-and-interaction.md) | Adding or tuning animation, or deciding input, touch, state and feedback behavior |

---

## 2. INTENT MODEL

- **`FRONTEND_WEB`** fires on `semantic html markup`. It loads `references/frontend-practice.md` and `references/web-markup-and-css.md`.
- **`WEB_ELEMENTS`** fires on `html form autocomplete`, `dialog element`, or `popover attribute`. It loads `references/frontend-practice.md`, `references/web-markup-and-css.md`, and `references/web-elements-and-attributes.md`.
- **`WEB_CASCADE`** fires on `css cascade layers` or `css specificity conflict`. It loads `references/frontend-practice.md`, `references/web-markup-and-css.md`, and `references/web-cascade-and-selectors.md`.
- **`WEB_LAYOUT`** fires on `container query layout` or `css stacking context`. It loads `references/frontend-practice.md`, `references/web-markup-and-css.md`, and `references/web-layout-and-sizing.md`.
- **`WEB_A11Y`** fires on `web accessibility pattern`, `focus visible styling`, `keyboard focus`, `broken tab order`, `accessible name`, `aria live region`, `focus ring accessibility`, `focus outline removed`, `screen reader support`, `aria label missing`, `alt text missing`, or `wcag audit`. It loads `references/frontend-practice.md`, `references/web-markup-and-css.md`, and `references/web-accessibility-patterns.md`.
- **`WEB_PERF`** fires on `web font loading` or `largest contentful paint`. It loads `references/frontend-practice.md`, `references/web-markup-and-css.md`, and `references/web-performance-and-loading.md`.
- **`WEB_I18N`** fires on `right to left layout` or `bidirectional text`. It loads `references/frontend-practice.md`, `references/web-markup-and-css.md`, and `references/web-internationalization.md`.
- **`WEB_VISUAL_VALUES`** fires on `what padding should this have`, `how much padding`, `what font size should this be`, `spacing between elements`, `spacing scale`, `type scale`, `build a color palette`, `shade ramp`, `box shadow elevation`, `border radius consistency`, `contrast ratio failure`, `grey text on colored background`, `dark mode palette`, `concentric border radius`, `layered shadows`, `shadow color on dark surface`, `tabular numbers`, `what should this button look like`, `colour decision`, `color decision`, `padding`, `type scale for`, `font size`, `colour palette`, `color palette`, `contrast ratio`, `corner radius`, `box shadow`, `contrast of`, `check the contrast`, `colour contrast`, `color contrast`, `muted text`, or `spacing between`. It loads `references/frontend-practice.md` and `references/web-visual-values.md`.
- **`WEB_VISUAL_HIERARCHY`** fires on `ui looks off`, `looks amateur`, `feels cluttered`, `make this look better`, `make this ui look designed`, `visual hierarchy`, `no visual hierarchy`, `nothing draws the eye`, `everything competes for attention`, `everything looks the same`, `emphasize by de-emphasizing`, `how to style a destructive button`, `this page feels overwhelming`, `where do i start designing`, `design a new screen from scratch`, `how much white space`, `why does this look wrong`, `does this look right`, `critique this design`, `design critique`, `visual audit`, `design review findings`, `design review`, `review this design`, `review this screen`, `ux laws`, `cognitive load`, `progressive disclosure`, `empty state design`, `look wrong`, `looks wrong`, `looks off`, `type hierarchy`, or `visual review`. It loads `references/frontend-practice.md`, `references/web-visual-hierarchy.md`, `references/web-visual-values.md`, and `references/web-accessibility-patterns.md`.
- **`WEB_MOTION`** fires on `animation duration`, `transition duration`, `easing curve`, `spring versus easing`, `twelve principles of animation`, `when not to animate`, `response time budget`, `touch target size`, `hover state`, `active pressed state`, `disabled state styling`, `button states`, `animation`, `transition timing`, `hover`, `focus-visible`, `interaction states`, or `easing`. It loads `references/frontend-practice.md` and `references/web-motion-and-interaction.md`.
- **`FIGMA_TO_CODE`** fires on `figma to code`, `check built screen against figma`, `compare build with figma frame`, `figma frame`, `figma frame check`, or `implement a figma design`. It loads `references/figma-to-code.md` and `references/frontend-practice.md`.

---

## 3. MACHINE ROUTER

```python
DEFAULT_RESOURCE = ["references/frontend-practice.md"]

INTENT_SIGNALS = {
    "FRONTEND_WEB": {"weight": 4, "keywords": ["semantic html markup", "with css", "the stylesheet", "css file", "ui component", "frontend component", "form inputs", "form styling", "style the form"]},
    "WEB_ELEMENTS": {"weight": 4, "keywords": ["html form autocomplete", "dialog element", "popover attribute", "modal dialog"]},
    "WEB_CASCADE": {"weight": 4, "keywords": ["css cascade layers", "css specificity conflict"]},
    "WEB_LAYOUT": {"weight": 4, "keywords": ["container query layout", "css stacking context", "responsive layout", "responsive grid", "css grid", "flexbox layout", "sticky header", "sticky navbar", "navbar sticky", "center a div", "vertically center", "center vertically", "scroll horizontally", "horizontal scroll", "mobile viewport", "media query"]},
    "WEB_A11Y": {"weight": 4, "keywords": ["web accessibility pattern", "focus visible styling", "keyboard focus", "broken tab order", "accessible name", "aria live region", "focus ring accessibility", "focus outline removed", "screen reader support", "aria label missing", "alt text missing", "wcag audit", "focus trap", "accessibility issues", "accessibility review"]},
    "WEB_PERF": {"weight": 4, "keywords": ["web font loading", "largest contentful paint", "improve lcp", "lcp regression", "core web vitals", "cumulative layout shift", "interaction to next paint", "lazy load images", "optimize images", "image optimization"]},
    "WEB_I18N": {"weight": 4, "keywords": ["right to left layout", "bidirectional text", "rtl languages", "rtl layout", "rtl support", "i18n support"]},
    "WEB_VISUAL_VALUES": {"weight": 4, "keywords": ["what padding should this have", "how much padding", "what font size should this be", "spacing between elements", "spacing scale", "type scale", "build a color palette", "shade ramp", "box shadow elevation", "border radius consistency", "contrast ratio failure", "grey text on colored background", "dark mode palette", "concentric border radius", "layered shadows", "shadow color on dark surface", "tabular numbers", "what should this button look like", "colour decision", "color decision", "type scale for", "font size", "colour palette", "color palette", "contrast ratio", "corner radius", "box shadow", "spacing between", "contrast of", "check the contrast", "colour contrast", "color contrast", "muted text", "dark mode toggle", "dark mode", "poor contrast", "low contrast", "text contrast"]},
    "WEB_VISUAL_HIERARCHY": {"weight": 4, "keywords": ["ui looks off", "looks amateur", "feels cluttered", "make this look better", "make this ui look designed", "visual hierarchy", "no visual hierarchy", "nothing draws the eye", "everything competes for attention", "everything looks the same", "emphasize by de-emphasizing", "how to style a destructive button", "this page feels overwhelming", "where do i start designing", "design a new screen from scratch", "how much white space", "why does this look wrong", "does this look right", "critique this design", "design critique", "visual audit", "design review findings", "design review", "review this design", "review this screen", "ux laws", "cognitive load", "progressive disclosure", "empty state design", "look wrong", "looks wrong", "looks off", "visual review", "type hierarchy"]},
    "WEB_MOTION": {"weight": 4, "keywords": ["animation duration", "transition duration", "easing curve", "spring versus easing", "twelve principles of animation", "when not to animate", "response time budget", "touch target size", "hover state", "active pressed state", "disabled state styling", "button states", "transition timing", "focus-visible", "interaction states", "css animation", "css transition", "loading spinner", "hover animation", "hover effect"]},
    "FIGMA_TO_CODE": {"weight": 4, "keywords": ["figma to code", "check built screen against figma", "compare build with figma frame", "figma frame", "figma frame check", "implement a figma design", "figma file", "from figma"]},
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
    "WEB_VISUAL_VALUES": [
        "references/frontend-practice.md",
        "references/web-visual-values.md",
    ],
    "WEB_VISUAL_HIERARCHY": [
        "references/frontend-practice.md",
        "references/web-visual-hierarchy.md",
        "references/web-visual-values.md",
        "references/web-accessibility-patterns.md",
    ],
    "WEB_MOTION": [
        "references/frontend-practice.md",
        "references/web-motion-and-interaction.md",
    ],
    "FIGMA_TO_CODE": [
        "references/figma-to-code.md",
        "references/frontend-practice.md",
    ],
}
```
