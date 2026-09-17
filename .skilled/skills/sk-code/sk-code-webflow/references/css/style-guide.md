---
title: "Webflow CSS Style Guide"
description: "CSS naming (BEM with kebab-case), custom property prefixes (font, vw, component, state, global), attribute-selector case-insensitivity, animation property restrictions, and file organization for the Webflow stack."
trigger_phrases:
  - "webflow css style guide"
  - "bem kebab case naming"
  - "css custom property prefixes"
  - "css attribute selector flag"
  - "css animation properties webflow"
importance_tier: normal
contextType: implementation
version: 3.5.0.2
---

# Webflow CSS Style Guide

CSS-specific style conventions for Webflow — BEM naming, custom properties, attribute selectors, and animation CSS. Rules shared across all languages live in [`../shared/cross-language-rules.md`](../shared/cross-language-rules.md).

---

## 1. OVERVIEW

### Purpose

Defines CSS naming (BEM with kebab-case), custom property prefixes, attribute selector conventions, animation property restrictions, and file organization for the Webflow stack.

### When to Use

- Writing new CSS files for Webflow projects
- Reviewing CSS for naming and animation-property compliance
- Adding custom properties or attribute selectors to Webflow markup

### Core Principle

BEM naming + GPU-only animations + case-insensitive attribute selectors prevent the most common Webflow CSS regressions.

---

## 2. NAMING (BEM WITH KEBAB-CASE)

```css
.hero { }                    /* Block */
.hero--title { }             /* Element (double-dash) */
.hero--overlay { }           /* Element */
.hero-featured { }           /* Modifier (single-dash) */
.btn { }                     /* Block */
.btn--icon { }               /* Element */
.btn-primary { }             /* Modifier */
```

**Note:** CSS files use snake_case for filenames per [`../shared/cross-language-rules.md`](../shared/cross-language-rules.md) §2 FILE NAMING — but class names use BEM with kebab-case as shown here.

---

## 3. CUSTOM PROPERTY NAMING

Use prefixes to indicate scope and purpose:

| Prefix          | Scope                 | Example                           |
| --------------- | --------------------- | --------------------------------- |
| `--font-*`      | Typography variables  | `--font-from`, `--font-to`        |
| `--vw-*`        | Viewport calculations | `--vw-from`, `--vw-to`            |
| `--component-*` | Component-specific    | `--hero-padding`, `--card-radius` |
| `--state-*`     | Interactive states    | `--state-hover-opacity`           |
| `--global-*`    | Site-wide values      | `--global-max-width`              |

**Production example from fluid_responsive.css:**

```css
:root {
  --font-from: 18;
  --font-to: 18;
  --vw-from: calc(5120 / 100);
  --vw-to: calc(7680 / 100);
  --coefficient: calc((var(--font-to) - var(--font-from)) / (var(--vw-to) - var(--vw-from)));
  --base: calc((var(--font-from) - var(--vw-from) * var(--coefficient)) / 16);
}
```

---

## 4. ATTRIBUTE SELECTORS (CASE-INSENSITIVITY)

**Always use the case-insensitivity flag `i` for custom data attributes:**

```css
/* Correct: Case-insensitive (matches "Base", "base", "BASE") */
[data-render-content="base" i] {
  content-visibility: auto;
}

/* Incorrect: Case-sensitive (only matches exact "base") */
[data-render-content="base"] {
  content-visibility: auto;
}
```

**Why this matters:**
- Webflow attribute panel may produce inconsistent casing
- Users may type "Base" instead of "base"
- Prevents silent CSS selector failures
- Browser support: Chrome 49+, Firefox 47+, Safari 9+, Edge 79+

---

## 5. ANIMATION CSS

### GPU-Accelerated Properties Only

```css
.animated-element {
  /* GPU-accelerated - USE THESE */
  transform: translateY(0);
  opacity: 1;
  scale: 1;

  /* Layout properties - AVOID ANIMATING */
  /* width, height, top, left, padding, margin */
}
```

### will-change Management

```css
/* Set via JavaScript BEFORE animation starts */
.animating {
  will-change: transform, opacity;
}

/* Reset after animation completes (via JavaScript) */
.animation-complete {
  will-change: auto;
}
```

> **Note:** The dynamic-set pattern (setting `will-change` via JavaScript before animation, resetting after) is detailed in [`quality-standards/patterns-and-naming-enforcement.md`](quality-standards/patterns-and-naming-enforcement.md).

### Easing Standards (Aligned with Motion.dev)

```css
/* General purpose - smooth deceleration */
transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);

/* Dramatic entrances - strong deceleration */
transition: opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1);
```

---

## 6. FILE ORGANIZATION

**One file per component type, grouped by category:**

```
src/1_css/
├── animations/          # Reusable animation classes
├── button/              # Button variants (btn_primary.css, btn_secondary.css)
├── card/                # Card layouts
├── form/                # Form elements
├── global/              # Site-wide styles (fluid_responsive.css, reset.css)
├── label/               # Label styles
├── link/                # Link styles
├── menu/                # Navigation menus
├── slider/              # Carousel/slider styles
├── text/                # Typography components
└── video/               # Video player styles
```

**Naming conventions:**
- Files: `component_variant.css` (snake_case)
- Classes: `.component--element` (BEM with double-dash for elements)
- Modifiers: `.component-modifier` (single-dash for modifiers)

---

## 7. COMMENTS & SECTION HEADERS (CSS-SPECIFIC)

> Cross-language commenting principles (WHY-not-WHAT, no commented-out code, platform prefixes) live in [`../shared/cross-language-rules.md`](../shared/cross-language-rules.md). This section covers CSS-specific comment LAYOUT, FREQUENCY, and CONTENT patterns observed in production.

### File Header Banner

Every CSS file opens with a 3-line banner using `/* */` multi-line comment:

```css
/* ───────────────────────────────────────────────────────────────
   VIDEO (HLS) - BACKGROUND PLAYER
─────────────────────────────────────────────────────────────── */
```

**Specifications** (matches `anobel.com/src/1_css/video/video_hls_background.css`):
- Opening line: `/* ─` followed by 63 `─` characters
- Title line: 3-space indent, ALL CAPS, may include parentheses for sub-categorization (e.g. `VIDEO (HLS) - BACKGROUND PLAYER`, `FORM: STYLING`), uses ` - ` or `:` as the category-name separator
- Closing line: 63 `─` characters followed by **a space, then `*/`** (`─────────────────────────────────────────────────────────────── */`)

**Key difference from JS section headers:** CSS file headers have a SPACE before `*/`. JS section headers glue `*/` to the dashes (`────*/`). Both formats are correct for their respective contexts.

### Section Headers (Numbered)

Within a CSS file, group rules into numbered sections with the same banner shape as the file header:

```css
/* ───────────────────────────────────────────────────────────────
   1. BASE ANIMATIONS
─────────────────────────────────────────────────────────────── */
[data-bunny-background-init] :is(.video--thumbnail, .video--loader) {
  transition: opacity 0.3s linear, visibility 0.3s linear;
}

/* ───────────────────────────────────────────────────────────────
   2. PLACEHOLDER STATES
─────────────────────────────────────────────────────────────── */
/* Hide placeholder when video is playing, paused, or ready after activation */
[data-bunny-background-init][data-player-status="playing"] .video--thumbnail,
[data-bunny-background-init][data-player-status="paused"] .video--thumbnail {
  opacity: 0;
  visibility: hidden;
}
```

### Sub-numbered Sections (e.g. `1.1`)

When a section has a fine-grained sub-state worth calling out, use decimal sub-numbering and let the section header itself explain the WHY:

```css
/* ───────────────────────────────────────────────────────────────
   1.1 MOBILE: DISABLE TRANSITIONS TO PREVENT SCROLL FLICKERING
   Touch devices trigger rapid IntersectionObserver callbacks during
   momentum scroll. The 0.3s transition causes visible flickering when
   state changes faster than the animation can complete.
─────────────────────────────────────────────────────────────── */
@media (hover: none),
(pointer: coarse) {
  [data-bunny-background-init] :is(.video--thumbnail, .video--loader) {
    transition: none;
  }
}
```

**When the section's intent is non-obvious, use a multi-line title block** — the explanation goes INSIDE the banner (after the title line, indented 3 spaces, no separator). The closing `─────────... */` line still terminates normally.

### Inline Comments (Single-Line, Above the Selector Group)

Drop a `/* WHY-comment */` immediately above a selector group when the rule's purpose isn't obvious from the selector alone:

```css
/* Hide placeholder when video is playing, paused, or ready after activation */
[data-bunny-background-init][data-player-status="playing"] .video--thumbnail,
[data-bunny-background-init][data-player-status="paused"] .video--thumbnail,
[data-bunny-background-init][data-player-activated="true"][data-player-status="ready"] .video--thumbnail {
  opacity: 0;
  visibility: hidden;
}

/* Show loading spinner during buffer/load */
[data-bunny-background-init][data-player-status="loading"] .video--loader {
  opacity: 1;
  visibility: visible;
}
```

**Rule of thumb:** if the selector chain is 3+ data-attribute states deep, add a comment explaining when the rule applies.

### Comment Density (CSS)

Sparser than JS — production CSS comments only at:
1. File header (always)
2. Section headers (every section)
3. Sub-section headers when intent is non-obvious (sometimes)
4. Above complex selector groups (when 3+ data-attribute states or non-obvious intent)

Avoid commenting every property — the property name is usually self-evident. Comment the GROUP or the SELECTOR, not the individual `opacity: 0;`.

### Indentation: 2 Spaces (preferred)

Production has drift between 2-space and 4-space indentation across files. **Standard going forward: 2 spaces.** Existing 4-space files (`form_styling.css`) are tolerated until a maintenance pass updates them.

```css
/* Preferred: 2-space indent */
.card {
  display: block;
  padding: 1rem;
}

/* Tolerated legacy: 4-space indent */
.card {
    display: block;
    padding: 1rem;
}
```

---

## RELATED RESOURCES

- [`patterns/tokens-state-machine-and-triggers.md`](patterns/tokens-state-machine-and-triggers.md) — comprehensive CSS patterns: Webflow token system, state machines, hover/focus/form triggers, accessibility, mobile/browser-specific patterns
- [`../shared/cross-language-rules.md`](../shared/cross-language-rules.md) — file naming, comment principles, file-header banner shape
- [`quality-standards/patterns-and-naming-enforcement.md`](quality-standards/patterns-and-naming-enforcement.md) — CSS quality patterns (will-change management, GPU-accelerated properties, easing standards, fluid typography) and CSS enforcement (custom property naming enforcement, attribute selector enforcement, BEM naming enforcement, animation property enforcement)
- [`./quick-reference.md`](./quick-reference.md) — Webflow tokens (read-only reference), form validation classes, reduced motion (MANDATORY), focus detection
- [`../shared/enforcement.md`](../shared/enforcement.md) — pre-completion gate workflow

### Copy-paste template

- [`../../../assets/webflow/templates/component-template.css`](../../assets/templates/component-template.css) — production-style annotated CSS template implementing every convention in this guide (file header, numbered sections, BEM naming, custom properties, attribute selectors, GPU-only animations, prefers-reduced-motion override, sub-numbered breakpoint sections)

### Production reference files (for copying conventions verbatim)

- `anobel.com/src/1_css/video/video_hls_background.css` — file header, numbered sections, sub-numbered (`1.1`) state-specific sections with multi-line description blocks
- `anobel.com/src/1_css/form/form_styling.css` — minimal file header + inline group-comment style
