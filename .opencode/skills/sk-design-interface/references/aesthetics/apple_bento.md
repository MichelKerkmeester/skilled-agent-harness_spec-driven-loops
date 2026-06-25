---
title: Apple Bento Preset
description: Visual-direction preset for Apple-style bento layouts with zero-gap cards, a restrained palette, and dense screenshot-ready metrics.
trigger_phrases:
  - "apple bento preset"
  - "bento grid layout"
  - "kpi card presentation"
  - "launch report layout"
  - "screenshot ready dashboard"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Apple Bento Preset

A compact visual-direction cue for screenshot-ready presentation layouts with Apple-like density and restraint.

---

## 1. OVERVIEW

### Purpose

Use for visual summaries, launch reports, KPI cards, and screenshot-ready presentation layouts with Apple-like density and restraint.

### Usage

Apply this preset as a citeable starting cue, then adapt it to the product context instead of treating it as a fixed template. Use one preset as the dominant aesthetic per direction; if combining cues, name this as the primary preset and keep borrowed cues sparse.

---

## 2. PALETTE

- Light theme: page `#f5f5f7`, cards `#ffffff`, primary text `#1d1d1f`, secondary `#86868b`, tertiary `#aeaeb2`.
- Dark theme: page `#000000`, cards `#1a1a1a` or `linear-gradient(145deg, #1a1a1a, #0d0d0d)`, primary text `#f5f5f7`.
- Limit accents to three or four: blue `#0071e3` / `#2997ff`, cyan `#00b4d8` / `#64d2ff`, coral `#ff6b6b` / `#ff453a`, green `#34d399` / `#30d158`.

---

## 3. TYPE

- Display numbers and headlines use Sora at heavy weights, tight tracking around `-0.03em`, and compact line height.
- Body labels, pills, captions, and descriptions use DM Sans with medium or semibold weights.
- Keep labels short; abbreviate long numbers before reducing clarity.

---

## 4. SHAPE AND LAYOUT

- Use a zero-gap bento grid: 6px gaps, occupied cells, default stretch alignment, and locked aspect ratios for landscape layouts.
- Common widths: 1200px for 4-column, 1100px for 3-column, 600px for 2-column vertical.
- Cards use 18px to 20px radii, compact padding, soft 1px shadows in light mode, and gradient depth in dark mode.

---

## 5. MOTION AND TEXTURE

- This preset is mostly static and screenshot-oriented; prioritize clean composition over interaction.
- Optional crosshatch or subtle texture may sit behind light cards at very low opacity.
- Verification cue: no empty-feeling cards, no orphan pill rows, no broken grid gaps, and no clipped screenshot edges.
