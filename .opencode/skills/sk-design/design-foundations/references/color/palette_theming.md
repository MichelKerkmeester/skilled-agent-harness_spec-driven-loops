---
title: Palette And Theming
description: Color strategy, semantic roles, tinted neutrals, dark-mode surfaces, and token layering for static design systems.
trigger_phrases:
  - "palette strategy"
  - "semantic colors"
  - "dark mode surfaces"
  - "theme tokens"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Palette And Theming

Color strategy, semantic roles, tinted neutrals, dark-mode surfaces, and token layering for static design systems.

---

## 1. OVERVIEW

### Core Principle

Color is system behavior, not decoration. Choose the dosage, assign roles, then implement tokens.

### When to Use

- Choosing a color register for a product, brand, or editorial surface.
- Assigning semantic roles and building primitive/semantic token layers.
- Designing a dark-mode surface system instead of inverting a light palette.
- Verifying that every hue carries a role and meaning never rests on color alone.

---

## 2. CHOOSE THE REGISTER

Before choosing light, dark, restrained, or drenched, write one sentence describing the physical scene: who uses this, where they are, the ambient light, and the mood the surface should create. If that sentence does not force a direction, add detail until it does.

| Register | Best for | Color behavior |
| --- | --- | --- |
| Restrained | product UI, admin, transactional flows | One accent for primary action, selection, focus, and important states. |
| Committed | brand-heavy pages and memorable surfaces | Dominant hue owns large areas; secondary color supports hierarchy. |
| Full palette | editorial, education, category-rich surfaces | Multiple hues carry meaning, but each gets a stable role. |
| Drenched | expressive campaign or art-directed surfaces | Color becomes the environment; contrast and readability still win. |

A restrained surface usually follows the 60-30-10 rule, which is about visual weight, not pixel count: roughly 60 percent neutral backgrounds and base surfaces, 30 percent secondary color in text, borders, and inactive states, and 10 percent accent for calls to action, highlights, and focus states. Accent works because it is rare; spending it everywhere kills its power.

Product surfaces usually stay restrained. Brand surfaces may exceed the 10 percent accent rule when the brief earns it.

---

## 3. TOKEN LAYERS

Use two layers:
- Primitive tokens describe values: `--blue-500`, `--neutral-950`.
- Semantic tokens describe jobs: `--color-action`, `--color-text-primary`, `--color-surface-raised`.

Dark mode should redefine semantic tokens, not primitive names. This keeps implementation stable while roles change.

---

## 4. PALETTE ROLES

The canonical color roles are primary/accent, neutral, semantic, surface, border, and text. Action, selection, and focus are states of the primary/accent role, not separate roles.

| Role | Purpose | Checks |
| --- | --- | --- |
| Primary/accent | brand and key action, including action, selection, and focus states | Rare enough to remain meaningful; contrast against background and surface. |
| Neutral | backgrounds and borders | Tint slightly toward brand when useful; avoid default warm cream unless grounded. |
| Text | body, heading, and helper text | Meets target contrast on every surface it sits on; never rely on color alone. |
| Semantic | success, error, warning, info | Color plus icon/text/pattern; never color alone. |
| Surface | cards, modals, overlays | Supports depth and grouping without nested-card clutter. |
| Border/stroke | separation | Prefer hairline full borders over decorative side stripes. |

Semantically loaded colors may need locale-aware review when status, ritual, political, or cultural meaning could change by market.

Avoid dangerous meaning pairs: red/green, blue/red, and yellow/white are common failure points for contrast, vibration, and color-vision differences. Roughly `8%` of men have a color-vision deficiency, so never encode meaning by hue alone; pair hue with text, icon shape, pattern, position, or state copy.

---

## 5. TINTED NEUTRALS

Pure gray can feel detached from a brand palette. A tiny OKLCH chroma value can align neutrals with the brand hue. Keep it subtle, usually `C 0.005` to `0.015`, and choose the hue from the project, not from a generic warm/cool formula.

---

## 6. DARK MODE

Dark mode is not inverted light mode.

| Light mode | Dark mode |
| --- | --- |
| Shadows can imply depth | Surface lightness implies depth |
| Dark text on light | Light text on deep surfaces, often slightly lighter weight |
| Vibrant accents | Slightly desaturated accents to reduce glare |
| White canvas | Deep brand-tinted canvas or black when the brand supports it |

Build a three-step dark surface scale where raised surfaces get lighter, such as `L 0.15`, `0.20`, `0.25`, with consistent hue/chroma. Reduce body text weight slightly in dark mode (e.g. 350 vs 400), because light text on a dark surface reads as heavier than dark text on light.

### Optical Separators And Depth

- Give images a `1px` inset outline as an optical separator: `rgba(0,0,0,0.1)` in light mode and `rgba(255,255,255,0.1)` in dark mode, with `outline-offset: -1px` so it does not affect layout. This is an exception to tinted neutrals: a tinted image outline picks up the surrounding surface color and reads as dirt on the image edge.
- Image-edge outlines are not semantic border tokens, accent rings, or layout-affecting borders.
- For a raised control, card, container, or overlay that needs depth, a transparent layered shadow ring may replace a decorative depth border. It must not coexist with a solid `1px` border plus a wide shadow on the same element; that combination is the existing ghost-card AI tell and stays a defect.
- Dividers, table cell boundaries, and form-input outlines remain real borders.
- In dark mode, a single low-opacity white ring can work as an optical separator or state/focus ring. It is not the primary elevation system; dark-mode depth should come from lightness steps, not stacked shadows.

### Theme-Specific Media

Verify logos, illustrations, screenshots, maps, charts, and embedded media in every supported theme. Some assets need separate light/dark files; others need a theme-specific matte, crop, or contrast treatment so the image content still reads and the brand mark does not disappear into the surface.

---

## 7. DOSAGE RULES

- Accent colors work because they are rare on product surfaces.
- Semantic colors must mean the same thing across the application.
- A colored background needs foreground tokens chosen for that color, not default gray text.
- Gradients must explain a real material, brand, or hierarchy purpose; generic purple-blue gradients are a slop smell.
- Avoid alpha-heavy palettes. If an overlay is common, make an explicit overlay token.

---

## 8. VERIFICATION

Check:
- All text pairs meet target contrast.
- Color never carries meaning alone.
- Dark mode has its own surface and text pairs.
- Every non-neutral hue has a role.
- The palette would still be understandable if saturation were reduced.
