---
title: Foundations Worked Examples
description: Illustrative annotated foundations examples for a dense product dashboard and a generous brand landing, never reusable presets.
trigger_phrases:
  - "foundations worked examples"
  - "complete foundations answer"
  - "examples not presets"
importance_tier: normal
contextType: reference
version: 1.0.0.0
---

# Foundations Worked Examples

These examples are illustrative. They show answer shape and annotation density. They are not reusable presets, style menus or default recipes.

## 1. Dense Product Dashboard

### Brief

Admin analytics for a logistics team. The surface must fit high information density, quick scanning, dark mode and reliable chart reading.

### Register Read

- Posture: Product.
- Density: high, but grouped.
- Color dosage: restrained.
- Token goal: reduce ambiguity, not add decoration.

### Annotated Static System

| Layer | Example Decision | Why It Fits |
| --- | --- | --- |
| Color | `--color-surface-0: oklch(17% 0.015 230)` and `--color-surface-1: oklch(22% 0.018 230)` | Tinted neutrals keep dark mode from becoming flat gray |
| Accent | `--color-accent: oklch(68% 0.13 188)` | One teal family marks action and live status without competing with data |
| Semantic | Error, warning and success stay separate from brand accent | Operational states must be readable at a glance |
| Type | Tabular numerals for metrics, compact body and heavier section labels | Numeric scan beats expressive type here |
| Layout | 4 px micro step, 8 px base and 24 px group gap | Small rhythm supports dense tables without one-off spacing |
| Data | Sequential scale for throughput and diverging scale only for delta | Color answers the chart question, not the category count |

### Example Output Fragment

```text
System role: product data UI
Color roles: tinted neutral surfaces, one teal action accent, separate semantic states
Type roles: compact body, tabular metric, label, section title
Spacing roles: 4 px micro, 8 px base, 16 px cluster, 24 px group
Breakpoint intent: preserve task columns until cards become unreadable, then convert charts before tables
Verification: contrast pairs, numeric alignment, chart scale legibility, dark-mode surface separation
```

### What Not To Copy

Do not copy the teal hue, dark palette or spacing values by default. Copy the reasoning pattern: product posture, dense grouping, semantic color separation, tabular numbers and verification tied to the task.

## 2. Generous Brand Landing

### Brief

Public launch page for a boutique travel editorial product. The surface needs a distinct mood, spacious pacing and a few conversion moments.

### Register Read

- Posture: Brand.
- Density: low to medium.
- Color dosage: higher than product, still role-bound.
- Token goal: make atmosphere repeatable without freezing it into a preset.

### Annotated Static System

| Layer | Example Decision | Why It Fits |
| --- | --- | --- |
| Color | `--color-paper: oklch(96% 0.018 82)` and `--color-ink: oklch(22% 0.03 70)` | Warm paper and ink carry editorial mood without relying on decoration |
| Accent | `--color-coral: oklch(70% 0.14 32)` | One warmer action color can carry signup, quotes and small wayfinding marks |
| Type | High-contrast display face with restrained use, humanist body face | Display type creates identity, body type protects reading |
| Layout | Wide hero, editorial column and asymmetric media rhythm | Space becomes the brand signal rather than many cards |
| Spacing | 12 px base, 32 px section cluster and 96 px chapter gap | Generous rhythm separates story beats |
| Responsive | Preserve the chapter order, reduce media crop drama and keep signup visible | Mobile keeps the story intact instead of hiding the conversion path |

### Example Output Fragment

```text
System role: brand landing surface
Color roles: warm paper, ink, coral action, muted rule and soft surface
Type roles: display, chapter heading, body, caption, utility label
Spacing roles: 12 px base, 32 px cluster, 96 px chapter gap
Breakpoint intent: keep story order, simplify media rhythm and keep signup reachable
Verification: action contrast, readable measure, content order, mobile signup access
```

### What Not To Copy

Do not copy the warm paper, coral accent or chapter gaps by default. Copy the reasoning pattern: brand posture, atmosphere with roles, spacious rhythm, restrained display type and responsive preservation of the story.

## 3. How To Use These Examples

- Use them to calibrate completeness.
- Replace every value with values grounded in the current brief.
- Keep role names before raw values.
- Explain what the system must preserve before handing off to implementation.
