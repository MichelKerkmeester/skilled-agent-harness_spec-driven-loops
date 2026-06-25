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

| Role | Purpose | Checks |
| --- | --- | --- |
| Primary/accent | brand and key action | Rare enough to remain meaningful; contrast against canvas and surface. |
| Neutral | text, background, borders | Tint slightly toward brand when useful; avoid default warm cream unless grounded. |
| Semantic | success, error, warning, info | Color plus icon/text/pattern; never color alone. |
| Surface | cards, modals, overlays | Supports depth and grouping without nested-card clutter. |
| Border/stroke | separation | Prefer hairline full borders over decorative side stripes. |

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
