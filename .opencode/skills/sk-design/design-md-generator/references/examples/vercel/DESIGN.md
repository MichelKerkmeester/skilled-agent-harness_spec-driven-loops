---
title: Vercel Style Reference Example
description: Gold-standard light v3 Style Reference example for studying measured Vercel design tokens, typography, surfaces, and component prose.
trigger_phrases:
  - Vercel DESIGN.md example
  - light developer style reference example
  - study Vercel design tokens
importance_tier: normal
contextType: reference
version: 1.0.0.0
---

# Vercel — Style Reference
> Developer infrastructure made invisible — an achromatic field where a hairline `#ebebeb` box-shadow does the work a border would.

**Theme:** light

The canvas is Snow (`#ffffff`), and Obsidian (`#171717`) carries text, borders, and backgrounds as a deep near-black that stops short of pure `#000000`. Geist and Geist Mono run the page: display type reaches 48px at -2.88px tracking against a 14px UI body, so hierarchy is built from scale and compression, not from heavy weights — nothing exceeds weight 600. Colour is rationed hard — the field is neutral gray (Graphite, Slate, Steel) with Azure (`#0068d6`) reserved for badges and interactive accents, and a wide chromatic reserve (Magenta, Crimson, Teal, Voltage, Ember) that surfaces only in icons and decorative gradients, never as page chrome. Buttons and pills round to a 9999px full-pill, while cards and inputs sit at a 6px corner. Depth is real but quiet: 14 shadow tokens, most of them a 1px `#ebebeb` ring standing in for a border, with whitespace at 96px-plus section gaps doing the rest. Layout runs full-width at 100% max, collapsing through a dominant `960px` breakpoint.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Obsidian | `#171717` | `--color-obsidian` | borders, text, backgrounds — a deep near-black |
| Graphite | `#4d4d4d` | `--color-graphite` | borders, text — a dark gray |
| Linen | `#ebebeb` | `--color-linen` | borders, gradients, backgrounds — a soft off-white |
| Slate | `#666666` | `--color-slate` | borders, text, backgrounds — a mid gray |
| Ink | `#000000` | `--color-ink` | borders, text, icons — a near-black |
| Slate 2 | `#808080` | `--color-slate-2` | borders, text — a mid gray |
| Snow | `#ffffff` | `--color-snow` | borders, backgrounds, text — a near-white |
| Steel | `#8f8f8f` | `--color-steel` | text, borders, backgrounds — a light gray |
| Steel 2 | `#a8a8a8` | `--color-steel-2` | borders, text — a light gray |
| Azure | `#0068d6` | `--color-azure` | borders, text, backgrounds — a blue |
| Magenta | `#bd2864` | `--color-magenta` | borders, text — a magenta |
| Azure 2 | `#52aeff` | `--color-azure-2` | borders, text, backgrounds — a blue |
| Crimson | `#e5484d` | `--color-crimson` | borders, text, icons — a red |
| Teal | `#45dec5` | `--color-teal` | borders, text, icons — a teal |
| Ember | `#ffb224` | `--color-ember` | borders, text — a orange |
| Sage | `#297a3a` | `--color-sage` | borders, text — a green-gray |
| Light Teal | `#d4eef7` | `--color-light-teal` | gradients, backgrounds — a light teal |
| Light Voltage | `#c7f5e2` | `--color-light-voltage` | gradients — a light green |
| Light Ember | `#f7ead4` | `--color-light-ember` | gradients — a light orange |
| Azure 3 | `#006bff` | `--color-azure-3` | borders — a blue |
| Indigo | `#7820bc` | `--color-indigo` | borders, text, backgrounds — a indigo |
| Steel 3 | `#999999` | `--color-steel-3` | text, borders — a light gray |
| Light Azure | `#ebf5ff` | `--color-light-azure` | backgrounds — a light blue |
| Ember 2 | `#ff990a` | `--color-ember-2` | backgrounds, icons — a orange |
| Crimson 2 | `#ff0000` | `--color-crimson-2` | icons — a red |
| Voltage | `#00dc82` | `--color-voltage` | icons — a green |
| Crimson 3 | `#ff3e00` | `--color-crimson-3` | icons — a red |
| Sage 2 | `#398e4a` | `--color-sage-2` | backgrounds — a green-gray |
| Sage 3 | `#45a557` | `--color-sage-3` | backgrounds — a green-gray |
| Indigo 2 | `#bf89ec` | `--color-indigo-2` | backgrounds — a indigo |
| Magenta 2 | `#ea3e83` | `--color-magenta-2` | backgrounds — a magenta |
| Teal 2 | `#067a6e` | `--color-teal-2` | backgrounds — a teal |
| Voltage 2 | `#6cda75` | `--color-voltage-2` | backgrounds — a green |
| Linen 2 | `#d9d9d9` | `--color-linen-2` | icons — a soft off-white |
| Azure 4 | `#0078d4` | `--color-azure-4` | icons — a blue |
| Crimson 4 | `#e24329` | `--color-crimson-4` | icons — a red |
| Ember 3 | `#fc6d26` | `--color-ember-3` | icons — a orange |
| Azure 5 | `#2684ff` | `--color-azure-5` | icons — a blue |
| Teal 3 | `#149eca` | `--color-teal-3` | icons — a teal |
| Citron | `#eec32d` | `--color-citron` | gradients — a yellow |
| Azure 6 | `#709ab9` | `--color-azure-6` | gradients — a blue |
| Voltage 3 | `#4dffbf` | `--color-voltage-3` | gradients — a green |

## Tokens — Typography

### Geist — Primary UI and display typeface, geometric sans-serif · `--font-geist`
- **Substitute:** Inter, system-ui, sans-serif
- **Weights:** 400, 500, 600
- **Sizes:** 12px, 13px, 14px, 16px, 18px, 20px, 24px, 32px, 40px, 48px
- **Line height:** 12px through 56px, with `normal` on the smallest UI sizes
- **Letter spacing:** normal up to 20px; tightening to -0.96px at 24px, -1.28px at 32px, -2.4px at 40px, and -2.88px at 48px
- **Role:** Carries every UI surface — body copy, navigation, buttons, badges, and the full heading-to-display ramp. The negative tracking is reserved for the large end of the scale, so headlines read as compressed while body stays at normal spacing.

### Geist Mono — Code, technical labels, and inline command text · `--font-geist-mono`
- **Substitute:** ui-monospace, SFMono-Regular, monospace
- **Weights:** 400, 500
- **Sizes:** 13px (the captured code/`pre` level)
- **Role:** The monospaced counterpart used where command snippets and code samples appear, set at 13px with a 20px line-height for dense technical lines.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 16px | normal | `--text-caption` |
| body-sm | 13px | 20px | normal | `--text-body-sm` |
| body | 14px | 20px | normal | `--text-body` |
| body-lg | 16px | 24px | normal | `--text-body-lg` |
| subheading | 18px | 27.36px | normal | `--text-subheading` |
| heading-sm | 20px | 36px | normal | `--text-heading-sm` |
| heading | 24px | 32px | -0.96px | `--text-heading` |
| heading-lg | 32px | 40px | -1.28px | `--text-heading-lg` |
| display | 40px | 48px | -2.4px | `--text-display` |
| hero | 48px | 56px | -2.88px | `--text-hero` |

Tracking compresses with scale: it stays `normal` through the 20px heading-sm level, then tightens monotonically from -0.96px at 24px to -2.88px at the 48px hero — the larger the type, the tighter the set. The smallest measured levels (6px through 10px) are sub-caption micro-text and decorative numerals that sit below the semantic scale; they are not reading sizes.

## Tokens — Spacing & Shapes

**Base unit:** 4px
**Density:** spacious

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 8 | 8px | `--spacing-8` |
| 12 | 12px | `--spacing-12` |
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 32 | 32px | `--spacing-32` |
| 36 | 36px | `--spacing-36` |
| 40 | 40px | `--spacing-40` |
| 44 | 44px | `--spacing-44` |
| 48 | 48px | `--spacing-48` |
| 64 | 64px | `--spacing-64` |
| 96 | 96px | `--spacing-96` |

### Border Radius

| Element | Value |
|---------|-------|
| div | 4px |
| a | 6px |
| button | 9999px |
| span | 50% |
| a | 100px |
| li | 8px |
| div | 2px |
| button | 64px |
| a | 100% |
| img | 12px 12px 0px 0px |
| div | 32px |
| div | 99px |
| div | 16px |
| img | 12px |
| div | 8px 8px 0px 0px |
| button | 3.35544e+07px |
| div | 30px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| 1 | `rgba(0, 0, 0, 0.04) 0px 1px 2px 0px` | `--shadow-1` |
| 2 | `rgba(0, 0, 0, 0.04) 0px 2px 2px 0px` | `--shadow-2` |
| 3 | `rgb(235, 235, 235) 0px 0px 0px 1px` | `--shadow-3` |
| 4 | `rgba(0, 0, 0, 0.08) 0px 0px 0px 1px` | `--shadow-4` |
| 5 | `rgba(0, 0, 0, 0.08) 0px 0px 0px 1px, rgba(0, 0, 0, 0.04) 0px 2px 2px 0px, rgb(250, 250, 250) 0px 0px 0px 1px` | `--shadow-5` |
| 6 | `rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px, rgba(0, 0, 0, 0.04) 0px 2px 2px 0px, rgba(0, 0, 0, 0.04) 0px 8px 8px -8px, rgb(250, 250, 250) 0px 0px 0px 1px` | `--shadow-6` |
| 7 | `rgb(234, 234, 234) 0px -1px 0px 0px inset` | `--shadow-7` |
| 8 | `rgba(0, 0, 0, 0.08) 0px 0px 0px 1px, rgb(250, 250, 250) 0px 0px 0px 1px` | `--shadow-8` |
| 9 | `rgb(235, 235, 235) 0px 0px 0px 1px, rgba(0, 0, 0, 0.05) 0px 1px 2px 0px` | `--shadow-9` |
| 10 | `rgba(0, 0, 0, 0.1) 0px 1px 0px 0px` | `--shadow-10` |
| 11 | `rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, lab(0 0 0 / 0.08) 0px 0px 0px 1px` | `--shadow-11` |
| 12 | `rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, lab(92.692 0 0) 0px 0px 0px 1px` | `--shadow-12` |
| 13 | `rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px, rgba(0, 0, 0, 0.04) 0px 2px 2px 0px, lab(98.144 0 -0.0000119209) 0px 0px 0px 1px` | `--shadow-13` |
| 14 | `rgba(0, 0, 0, 0.08) 0px 0px 0px 1px, lab(98.144 0 -0.0000119209) 0px 0px 0px 1px` | `--shadow-14` |

### Layout
- **Page max-width:** 100%

## Components

### Primary CTA
**Role:** Primary action pill — a near-white fill with Obsidian text, used for the Send and Resources action buttons.

A full-pill button at 9999px radius. Geist 14px weight 400, padding 8px 12px. Fill is the captured near-white surface against Obsidian (`#171717`) text. Transition: `color, background`. No border, no shadow.

### Secondary Button
**Role:** Outline-style action — Snow fill with Obsidian text and a hairline ring, used for the Ask AI control.

Background `#ffffff`, text `#171717`, Geist 14px weight 500, border-radius 6px, padding 0px 6px. The border is a shadow-as-border ring: `rgb(235, 235, 235) 0px 0px 0px 1px` — a 1px Linen hairline, no CSS border. Transition: `border-color 0.15s, background 0.15s, color 0.15s, transform 0.15s, box-shadow 0.15s`.

### Ghost Button
**Role:** Top-nav pill trigger — transparent fill with Graphite text, used for the Products, Resources, and Solutions menus.

Background transparent, text `#4d4d4d` (Graphite), Geist 14px weight 400, border-radius 9999px, padding 8px 12px. No border, no shadow. Transition: `color 0.09s, background 0.09s` — the fastest transition in the system at 90ms.

### Ghost Link
**Role:** Inline text link and the dominant interactive element — Obsidian text on transparent fill, by far the most frequent component.

Background transparent, text `#171717`, Geist 16px weight 400, border-radius 0px, 0px padding. Transition: `all`. No captured hover, focus, or active state.

### Badge — Primary
**Role:** Status/category pill — Light Azure fill with Azure text, the system's main accent surface.

Background `#ebf5ff` (Light Azure), text `#0068d6` (Azure), Geist 12px weight 500, border-radius 9999px (full pill), padding 0px 10px. Transition: `all`. This is the one place Azure reads as a filled surface rather than an icon stroke.

### Badge — Secondary
**Role:** Neutral pill — Snow fill with Obsidian text and a two-layer hairline shadow.

Background `#ffffff`, text `#171717`, Geist 14px weight 400, border-radius 9999px, 0px padding. Shadow: `rgb(235, 235, 235) 0px 0px 0px 1px, rgba(0, 0, 0, 0.05) 0px 1px 2px 0px` — the Linen ring plus a faint 2px drop. Transition: `all`.

### Nav Item
**Role:** Header navigation link — Obsidian text on transparent fill.

Background transparent, text `#171717`, Geist 16px weight 400, border-radius 0px, 0px padding. Transition: `box-shadow 0.2s, background-color 0.2s`. The scrolled-header variant adds a single bottom hairline: `rgba(0, 0, 0, 0.1) 0px 1px 0px 0px`.

### Footer Heading
**Role:** Oversized footer link — Obsidian text set at display scale.

Background transparent, text `#171717`, Geist 48px weight 600, border-radius 0px, 0px padding. Transition: `all`. This is the only place the 48px hero size is used as an interactive link rather than a headline.

### Input
**Role:** Text field — Snow fill with Ink text and a hairline ring.

Background `#ffffff`, text `#000000` (Ink), Geist 14px weight 400, border-radius 6px, padding 10px 12px. Border is a shadow ring at `rgba(0, 0, 0, 0.08) 0px 0px 0px 1px`. Transition: `0.15s cubic-bezier(0.4, 0, 0.2, 1)`.

## Do's and Don'ts

### Do
- Use `#171717` (Obsidian) for primary text and `#ffffff` (Snow) as the canvas — that pairing measures 17.93:1 contrast, AAA.
- Use the shadow-as-border ring `rgb(235, 235, 235) 0px 0px 0px 1px` instead of a CSS `border` for buttons, badges, and cards — Linen hairlines carry the structure.
- Ration Azure (`#0068d6`) to badges and interactive accents; use Light Azure (`#ebf5ff`) as its only filled surface.
- Round buttons, pills, and badges to 9999px and reserve the 6px radius for inputs and secondary buttons — the system distinguishes pills from fields by corner.
- Use the 90ms / `color 0.09s, background 0.09s` transition for nav pills and the 160ms `cubic-bezier(0.4, 0, 0.2, 1)` for inputs — micro for hover feedback, small for field focus.
- Lean on whitespace for hierarchy: section spacing runs from 48px up past 96px to 224px, with full-width 100% content.

### Don't
- Don't reach for `#000000` (Ink) as your default text colour — Obsidian (`#171717`) is the system text, and Ink is held back for icons and the input field.
- Don't add coloured drop shadows for elevation — the shadow tokens are neutral `rgba(0,0,0,0.04–0.08)` rings and `#ebebeb`/`#fafafa` hairlines; a tinted shadow breaks the achromatic depth.
- Don't place Graphite (`#4d4d4d`) text on a transparent/white ground for anything that must pass AA — it measures 2.48:1; drop to Slate 2 (`#808080`) at 5.32:1 or darker for body-level contrast.
- Don't promote the chromatic reserve (Magenta, Crimson, Teal, Voltage, Ember) to page chrome — those hues are measured only in icons and decorative gradients, never as backgrounds or borders on UI.
- Don't treat the multi-colour conic and linear gradients as a depth system — they are decorative surface washes, not z-axis layering.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#ffffff` | Full-bleed page background |
| 1 | Light Azure | `#ebf5ff` | Surface / panel |
| 2 | Linen | `#ebebeb` | Surface / panel |
| 3 | Light Teal | `#d4eef7` | Surface / panel |

## Elevation

Depth is a stack of 14 shadow tokens, and most of them are borders in disguise. The base of the system is the 1px Linen ring `rgb(235, 235, 235) 0px 0px 0px 1px` (`--shadow-3`) and its companion `rgba(0, 0, 0, 0.08) 0px 0px 0px 1px` (`--shadow-4`) — zero-blur rings that stand in for a CSS border without participating in the box model. Above that sit the genuine drop shadows: `rgba(0, 0, 0, 0.04) 0px 1px 2px 0px` (`--shadow-1`) and `rgba(0, 0, 0, 0.04) 0px 2px 2px 0px` (`--shadow-2`) for the faintest lift, climbing to the layered card stack `rgba(0, 0, 0, 0.08) 0px 0px 0px 1px, rgba(0, 0, 0, 0.04) 0px 2px 2px 0px, rgb(250, 250, 250) 0px 0px 0px 1px` (`--shadow-5`) — ring plus drop plus an inner `#fafafa` glow ring. The fullest token, `--shadow-6`, extends that with a `rgba(0, 0, 0, 0.04) 0px 8px 8px -8px` ambient-distance layer. The remaining tokens carry the same vocabulary in lab-encoded form (`--shadow-11` through `--shadow-14`), plus an inset bottom hairline `rgb(234, 234, 234) 0px -1px 0px 0px inset` (`--shadow-7`) for divider edges. Every layer is neutral — no hue ever enters the shadow stack.

## Imagery

No structured imagery dataset was extracted beyond the icon system (326 icons) and the gradient set. The dominant decorative treatment is gradients: 13 tokens, led by a multi-stop conic `conic-gradient(from 180deg at 50% 70%, ...)` that cycles Citron, Crimson, Azure 6, and Voltage 3 around a transparent center, alongside linear washes in Light Teal, Light Voltage, and Light Ember. These are full-colour decorative surfaces — the only place the chromatic reserve appears at scale — and they sit behind content rather than carrying depth.

## Layout

Full-width fluid layout: content max-width is 100% with full-width alignment and `0px` page padding handled by inner cells. Section spacing is a wide ladder — 48px and 50px for tight stacks, 90px and 96px for standard section breaks, then 135px, 161px, 165px, and 224px for major separations, with whitespace doing the framing work that borders and fills do not. Column grids span 1, 2, 3, 6, and 12 tracks. The responsive system pivots on a dominant `960px` max-width breakpoint (263 rules), with secondary breaks at `1150px` and a `1151px` min-width, plus `(hover:hover) and (pointer:fine)` and `prefers-reduced-motion: reduce` queries — the layout adapts to input capability, not just viewport. Motion runs on `ease` as the primary timing function across a 90ms / 160ms / 350ms / 500ms duration ladder.

## Agent Prompt Guide

### Quick Color Reference
- background: `#ffffff` (Snow)
- text (primary): `#171717` (Obsidian)
- text (muted): `#4d4d4d` (Graphite)
- border (hairline): `#ebebeb` (Linen, applied as a 0px-blur box-shadow ring)
- accent / interactive: `#0068d6` (Azure), filled as `#ebf5ff` (Light Azure)

### Example Component Prompts

1. Create a primary badge pill: background `#ebf5ff`, text `#0068d6`, Geist (fallback Inter) 12px weight 500, border-radius 9999px, padding 0px 10px. Transition `all`. No border, no shadow.

2. Create a secondary outline button: background `#ffffff`, text `#171717`, Geist 14px weight 500, border-radius 6px, padding 0px 6px. Use no CSS border — instead apply box-shadow `rgb(235, 235, 235) 0px 0px 0px 1px`. Transition `border-color 0.15s, background 0.15s, color 0.15s, transform 0.15s, box-shadow 0.15s`.

3. Create a ghost nav pill: background transparent, text `#4d4d4d`, Geist 14px weight 400, border-radius 9999px, padding 8px 12px. Transition `color 0.09s, background 0.09s`. No border, no shadow.

4. Create a text input: background `#ffffff`, text `#000000`, Geist 14px weight 400, border-radius 6px, padding 10px 12px. Border via box-shadow `rgba(0, 0, 0, 0.08) 0px 0px 0px 1px`. Transition `0.15s cubic-bezier(0.4, 0, 0.2, 1)`.

5. Create an elevated card: background `#ffffff`, no CSS border. Shadow stack `rgba(0, 0, 0, 0.08) 0px 0px 0px 1px, rgba(0, 0, 0, 0.04) 0px 2px 2px 0px, rgb(250, 250, 250) 0px 0px 0px 1px` — keep the inner `#fafafa` ring, it is the glow that makes the elevation read. Title at Geist 24px weight 600, letter-spacing -0.96px, color `#171717`. Body at 16px weight 400, color `#4d4d4d`.

## Similar Brands

- **Linear** — Same achromatic neutral scale with a single blue accent and shadow-as-border hairlines; depth carried by 1px rings rather than coloured elevation.
- **Stripe** — Shares the near-black-on-white discipline and Geist-adjacent geometric type, though Stripe tints its shadows where Vercel keeps them neutral.
- **GitHub** — Comparable restraint in UI chrome: gray neutrals, blue interactive accents, full-pill badges, and chromatic colour reserved for status and icons.
- **Raycast** — Same monospace-plus-sans pairing for technical surfaces, full-pill controls, and a tight, compressed display scale.

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-obsidian: #171717;
  --color-graphite: #4d4d4d;
  --color-linen: #ebebeb;
  --color-slate: #666666;
  --color-ink: #000000;
  --color-slate-2: #808080;
  --color-snow: #ffffff;
  --color-steel: #8f8f8f;
  --color-steel-2: #a8a8a8;
  --color-azure: #0068d6;
  --color-magenta: #bd2864;
  --color-azure-2: #52aeff;
  --color-crimson: #e5484d;
  --color-teal: #45dec5;
  --color-ember: #ffb224;
  --color-sage: #297a3a;
  --color-light-teal: #d4eef7;
  --color-light-voltage: #c7f5e2;
  --color-light-ember: #f7ead4;
  --color-azure-3: #006bff;
  --color-indigo: #7820bc;
  --color-steel-3: #999999;
  --color-light-azure: #ebf5ff;
  --color-ember-2: #ff990a;
  --color-crimson-2: #ff0000;
  --color-voltage: #00dc82;
  --color-crimson-3: #ff3e00;
  --color-sage-2: #398e4a;
  --color-sage-3: #45a557;
  --color-indigo-2: #bf89ec;
  --color-magenta-2: #ea3e83;
  --color-teal-2: #067a6e;
  --color-voltage-2: #6cda75;
  --color-linen-2: #d9d9d9;
  --color-azure-4: #0078d4;
  --color-crimson-4: #e24329;
  --color-ember-3: #fc6d26;
  --color-azure-5: #2684ff;
  --color-teal-3: #149eca;
  --color-citron: #eec32d;
  --color-azure-6: #709ab9;
  --color-voltage-3: #4dffbf;
  /* Typography — Scale */
  --text-t0: 6px;
  --leading-t0: normal;
  --text-t1: 7px;
  --leading-t1: 7px;
  --text-t2: 8px;
  --leading-t2: normal;
  --text-t3: 8px;
  --leading-t3: 8px;
  --text-t4: 10px;
  --leading-t4: normal;
  --text-t5: 12px;
  --leading-t5: 16px;
  --text-t6: 12px;
  --leading-t6: 16px;
  --text-t7: 12px;
  --leading-t7: normal;
  --text-h2: 12px;
  --leading-h2: 12px;
  --text-t9: 13px;
  --leading-t9: 20px;
  --text-t10: 13px;
  --leading-t10: 20px;
  --text-t11: 14px;
  --leading-t11: 20px;
  --text-t12: 14px;
  --leading-t12: 20px;
  --text-t13: 14px;
  --leading-t13: 20px;
  --text-t14: 16px;
  --leading-t14: normal;
  --text-t15: 16px;
  --leading-t15: normal;
  --text-t16: 16px;
  --leading-t16: 24px;
  --text-t17: 16px;
  --leading-t17: 24px;
  --text-t18: 18px;
  --leading-t18: 27.36px;
  --text-t19: 20px;
  --leading-t19: 36px;
  --text-h3: 24px;
  --leading-h3: 32px;
  --text-t21: 24px;
  --leading-t21: 32px;
  --text-t22: 32px;
  --leading-t22: 48px;
  --text-h3: 32px;
  --leading-h3: 40px;
  --text-h2: 40px;
  --leading-h2: 48px;
  --text-h1: 48px;
  --leading-h1: 56px;
  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-44: 44px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-96: 96px;
  /* Layout */
  --page-max-width: 100%;
  /* Border Radius */
  --radius-div: 4px;
  --radius-a: 6px;
  --radius-button: 9999px;
  --radius-span: 50%;
  --radius-a: 100px;
  --radius-li: 8px;
  --radius-div: 2px;
  --radius-button: 64px;
  --radius-a: 100%;
  --radius-img: 12px 12px 0px 0px;
  --radius-div: 32px;
  --radius-div: 99px;
  --radius-div: 16px;
  --radius-img: 12px;
  --radius-div: 8px 8px 0px 0px;
  --radius-button: 3.35544e+07px;
  --radius-div: 30px;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-obsidian: #171717;
  --color-graphite: #4d4d4d;
  --color-linen: #ebebeb;
  --color-slate: #666666;
  --color-ink: #000000;
  --color-slate-2: #808080;
  --color-snow: #ffffff;
  --color-steel: #8f8f8f;
  --color-steel-2: #a8a8a8;
  --color-azure: #0068d6;
  --color-magenta: #bd2864;
  --color-azure-2: #52aeff;
  --color-crimson: #e5484d;
  --color-teal: #45dec5;
  --color-ember: #ffb224;
  --color-sage: #297a3a;
  --color-light-teal: #d4eef7;
  --color-light-voltage: #c7f5e2;
  --color-light-ember: #f7ead4;
  --color-azure-3: #006bff;
  --color-indigo: #7820bc;
  --color-steel-3: #999999;
  --color-light-azure: #ebf5ff;
  --color-ember-2: #ff990a;
  --color-crimson-2: #ff0000;
  --color-voltage: #00dc82;
  --color-crimson-3: #ff3e00;
  --color-sage-2: #398e4a;
  --color-sage-3: #45a557;
  --color-indigo-2: #bf89ec;
  --color-magenta-2: #ea3e83;
  --color-teal-2: #067a6e;
  --color-voltage-2: #6cda75;
  --color-linen-2: #d9d9d9;
  --color-azure-4: #0078d4;
  --color-crimson-4: #e24329;
  --color-ember-3: #fc6d26;
  --color-azure-5: #2684ff;
  --color-teal-3: #149eca;
  --color-citron: #eec32d;
  --color-azure-6: #709ab9;
  --color-voltage-3: #4dffbf;
  /* Typography — Scale */
  --text-t0: 6px;
  --leading-t0: normal;
  --text-t1: 7px;
  --leading-t1: 7px;
  --text-t2: 8px;
  --leading-t2: normal;
  --text-t3: 8px;
  --leading-t3: 8px;
  --text-t4: 10px;
  --leading-t4: normal;
  --text-t5: 12px;
  --leading-t5: 16px;
  --text-t6: 12px;
  --leading-t6: 16px;
  --text-t7: 12px;
  --leading-t7: normal;
  --text-h2: 12px;
  --leading-h2: 12px;
  --text-t9: 13px;
  --leading-t9: 20px;
  --text-t10: 13px;
  --leading-t10: 20px;
  --text-t11: 14px;
  --leading-t11: 20px;
  --text-t12: 14px;
  --leading-t12: 20px;
  --text-t13: 14px;
  --leading-t13: 20px;
  --text-t14: 16px;
  --leading-t14: normal;
  --text-t15: 16px;
  --leading-t15: normal;
  --text-t16: 16px;
  --leading-t16: 24px;
  --text-t17: 16px;
  --leading-t17: 24px;
  --text-t18: 18px;
  --leading-t18: 27.36px;
  --text-t19: 20px;
  --leading-t19: 36px;
  --text-h3: 24px;
  --leading-h3: 32px;
  --text-t21: 24px;
  --leading-t21: 32px;
  --text-t22: 32px;
  --leading-t22: 48px;
  --text-h3: 32px;
  --leading-h3: 40px;
  --text-h2: 40px;
  --leading-h2: 48px;
  --text-h1: 48px;
  --leading-h1: 56px;
  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-44: 44px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-96: 96px;
  /* Border Radius */
  --radius-div: 4px;
  --radius-a: 6px;
  --radius-button: 9999px;
  --radius-span: 50%;
  --radius-a: 100px;
  --radius-li: 8px;
  --radius-div: 2px;
  --radius-button: 64px;
  --radius-a: 100%;
  --radius-img: 12px 12px 0px 0px;
  --radius-div: 32px;
  --radius-div: 99px;
  --radius-div: 16px;
  --radius-img: 12px;
  --radius-div: 8px 8px 0px 0px;
  --radius-button: 3.35544e+07px;
  --radius-div: 30px;
}
```
