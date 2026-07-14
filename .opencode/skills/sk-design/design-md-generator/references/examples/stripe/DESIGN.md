---
title: Stripe Style Reference Example
description: Gold-standard light v3 Style Reference example for studying measured Stripe design tokens, typography, surfaces, and component prose.
trigger_phrases:
  - Stripe DESIGN.md example
  - light style reference example
  - study Stripe design tokens
importance_tier: normal
contextType: reference
version: 1.0.0.0
---

# Stripe — Style Reference
> Indigo-violet rationed against a white field — borders carry the structure, one saturated blue carries the brand.

**Theme:** light

The canvas is pure Snow (`#ffffff`), and the system is built almost entirely from borders rather than fills — Ink (`#000000`) and a deep navy family draw nearly every line, frame, and divider on the page. A single saturated blue-violet, Azure (`#533afd`), is the brand signal: it owns link text, the primary CTA fill, and brand border accents, and almost nothing else competes with it. Body and UI text run in slate-blue tones (`#50617a`, `#64748d`) and deep navy (`#061b31`) rather than flat black, keeping the page tonal rather than high-contrast. Type is set in sohne-var across a wide variable range, with hierarchy carried by scale — a 56px display against a 16px body — and tightening letter-spacing as size grows. Depth is real but quiet: three shadow tokens, two of them tinted with the brand's own navy, give cards a soft chromatic lift instead of a hard drop shadow. Layout caps at 1266px on a spacious 4px-based rhythm, with section gaps stepping from 48px to 96px.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Ink | `#000000` | `--color-ink` | borders, text, icons — a near-black |
| Azure | `#533afd` | `--color-azure` | borders, text, backgrounds — a blue |
| Azure 2 | `#50617a` | `--color-azure-2` | borders, text — a blue |
| Deep Azure | `#061b31` | `--color-deep-azure` | borders, text, backgrounds — a deep blue |
| Snow | `#ffffff` | `--color-snow` | borders, text, backgrounds — a near-white |
| Azure 3 | `#64748d` | `--color-azure-3` | borders, text, icons — a blue |
| Azure 4 | `#0000ee` | `--color-azure-4` | borders, text — a blue |
| Azure 5 | `#3c4f69` | `--color-azure-5` | borders, text, icons — a blue |
| Deep Azure 2 | `#273951` | `--color-deep-azure-2` | borders, text, icons — a deep blue |
| Light Azure | `#e5edf5` | `--color-light-azure` | borders, backgrounds, gradients — a light blue |
| Ember | `#ff6118` | `--color-ember` | borders, text, icons — a orange |
| Deep Azure 3 | `#1a2c44` | `--color-deep-azure-3` | borders, text, icons — a deep blue |
| Azure 6 | `#7389ff` | `--color-azure-6` | borders, text, gradients — a blue |
| Azure 7 | `#7d8ba4` | `--color-azure-7` | borders, text — a blue |
| Light Azure 2 | `#b9b9f9` | `--color-light-azure-2` | borders — a light blue |
| Light Azure 3 | `#d6d9fc` | `--color-light-azure-3` | borders, gradients — a light blue |
| Azure 8 | `#839bc8` | `--color-azure-8` | borders, text — a blue |
| Azure 9 | `#7f7dfc` | `--color-azure-9` | borders, text, gradients — a blue |
| Azure 10 | `#a3b5d6` | `--color-azure-10` | borders, text — a blue |
| Ink 2 | `#101010` | `--color-ink-2` | borders, text — a near-black |
| Light Azure 4 | `#e2e4ff` | `--color-light-azure-4` | borders, backgrounds, gradients — a light blue |
| Voltage | `#81b81a` | `--color-voltage` | borders, text, icons — a green |
| Azure 11 | `#000eff` | `--color-azure-11` | borders, text — a blue |
| Azure 12 | `#2d2564` | `--color-azure-12` | borders, text — a blue |
| Magenta | `#f44bcc` | `--color-magenta` | gradients — a magenta |
| Deep Azure 4 | `#182659` | `--color-deep-azure-4` | borders, gradients — a deep blue |
| Indigo | `#da4bfe` | `--color-indigo` | gradients — a indigo |
| Obsidian | `#171717` | `--color-obsidian` | icons — a deep near-black |
| Light Ember | `#ffe0d1` | `--color-light-ember` | backgrounds — a light orange |
| Azure 13 | `#32325d` | `--color-azure-13` | decorative use — a blue |
| Light Azure 5 | `#d4dee9` | `--color-light-azure-5` | borders, icons — a light blue |
| Deep Azure 5 | `#031323` | `--color-deep-azure-5` | backgrounds, icons — a deep blue |
| Ember 2 | `#ffcf5e` | `--color-ember-2` | gradients — a orange |
| Indigo 2 | `#4304ea` | `--color-indigo-2` | gradients — a indigo |
| Light Azure 6 | `#b4d8ff` | `--color-light-azure-6` | gradients — a light blue |
| Crimson | `#ff8c6c` | `--color-crimson` | gradients — a red |
| Ember 3 | `#fbbc04` | `--color-ember-3` | icons — a orange |
| Light Ember 2 | `#faf1e5` | `--color-light-ember-2` | icons, gradients — a light orange |
| Indigo 3 | `#c489ff` | `--color-indigo-3` | gradients — a indigo |
| Ember 4 | `#ffc977` | `--color-ember-4` | gradients — a orange |
| Azure 14 | `#715cff` | `--color-azure-14` | gradients — a blue |
| Voltage 2 | `#00d66f` | `--color-voltage-2` | backgrounds — a green |
| Deep Teal | `#0b3b45` | `--color-deep-teal` | backgrounds — a deep teal |
| Azure 15 | `#4285f4` | `--color-azure-15` | icons — a blue |
| Sage | `#34a853` | `--color-sage` | icons — a green-gray |
| Crimson 2 | `#ea4335` | `--color-crimson-2` | icons — a red |
| Teal | `#047ab1` | `--color-teal` | icons — a teal |
| Crimson 3 | `#d42d06` | `--color-crimson-3` | icons — a red |
| Light Magenta | `#ffa8cd` | `--color-light-magenta` | icons — a light magenta |
| Voltage 3 | `#00d64f` | `--color-voltage-3` | icons — a green |
| Crimson 4 | `#ff0033` | `--color-crimson-4` | icons — a red |
| Voltage 4 | `#009f41` | `--color-voltage-4` | icons — a green |
| Azure 16 | `#008cd5` | `--color-azure-16` | icons — a blue |
| Citron | `#ffd100` | `--color-citron` | icons — a yellow |
| Voltage 5 | `#0aad0a` | `--color-voltage-5` | icons — a green |
| Magenta 2 | `#f363f3` | `--color-magenta-2` | gradients — a magenta |
| Indigo 4 | `#7232f1` | `--color-indigo-4` | gradients — a indigo |
| Magenta 3 | `#fb76fa` | `--color-magenta-3` | gradients — a magenta |
| Azure 17 | `#486ffd` | `--color-azure-17` | gradients — a blue |
| Light Indigo | `#dac0ff` | `--color-light-indigo` | gradients — a light indigo |
| Light Magenta 2 | `#ff90b9` | `--color-light-magenta-2` | gradients — a light magenta |
| Light Ember 3 | `#ffd79b` | `--color-light-ember-3` | gradients — a light orange |
| Azure 18 | `#0071c1` | `--color-azure-18` | gradients — a blue |
| Azure 19 | `#60a8e2` | `--color-azure-19` | gradients — a blue |
| Ember 5 | `#ffb451` | `--color-ember-5` | gradients — a orange |
| Ember 6 | `#ffa577` | `--color-ember-6` | gradients — a orange |
| Light Crimson | `#ff90a1` | `--color-light-crimson` | gradients — a light red |
| Light Indigo 2 | `#ddadff` | `--color-light-indigo-2` | gradients — a light indigo |
| Light Indigo 3 | `#ecd8ff` | `--color-light-indigo-3` | gradients — a light indigo |
| Azure 20 | `#6763e4` | `--color-azure-20` | gradients — a blue |
| Azure 21 | `#453bb3` | `--color-azure-21` | gradients — a blue |
| Azure 22 | `#29227d` | `--color-azure-22` | gradients — a blue |
| Deep Azure 6 | `#141e4b` | `--color-deep-azure-6` | gradients — a deep blue |
| Magenta 4 | `#f72df3` | `--color-magenta-4` | gradients — a magenta |
| Ember 7 | `#ffad00` | `--color-ember-7` | gradients — a orange |
| Ember 8 | `#ff7600` | `--color-ember-8` | gradients — a orange |

## Tokens — Typography

### sohne-var — Primary typeface across the entire page · `--font-sohne-var`
- **Substitute:** Inter Variable, system sans-serif
- **Weights:** variable axis 1–1000; observed at 300, 400, and 600
- **Sizes:** 8px through 56px (see Type Scale)
- **Line height:** tight at display (57.68px on 56px) loosening proportionally toward body (16–20px on 12–16px)
- **Letter spacing:** negative and scaling with size — `-1.4px` at 56px display, `-0.88px` at 44px, `-0.64px` at 32px, easing to `normal` at body sizes
- **Role:** The single workhorse typeface — headlines, body, navigation, buttons, and captions all set in sohne-var. Weight 300 carries the large display and heading sizes (a light, confident headline voice), 400 carries body and reading text, and 600 is reserved for buttons and emphasis labels.

A second face, **SourceCodePro** (weight 500), is loaded for monospaced contexts such as inline code and numeric snippets; it never appears in the prose type scale.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 16px | 0.036px | `--text-caption` |
| body-sm | 14px | 14px | normal | `--text-body-sm` |
| body | 16px | 20px | normal | `--text-body` |
| body-lg | 18px | 25.2px | normal | `--text-body-lg` |
| subheading | 22px | 24.2px | -0.22px | `--text-subheading` |
| heading-sm | 26px | 29.12px | -0.26px | `--text-heading-sm` |
| heading | 32px | 35.2px | -0.64px | `--text-heading` |
| heading-lg | 44px | 50.6px | -0.88px | `--text-heading-lg` |
| display | 48px | 49.44px | -0.96px | `--text-display` |
| hero | 56px | 57.68px | -1.4px | `--text-hero` |

Letter-spacing tightens monotonically as size grows: body sits at `normal`, the subheading pulls to `-0.22px`, and the hero compresses to `-1.4px`. The smallest measured levels (8–11px) are sub-caption micro-text — legal lines and dense footer labels — and are not part of the working scale.

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
| 28 | 28px | `--spacing-28` |
| 32 | 32px | `--spacing-32` |
| 36 | 36px | `--spacing-36` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 52 | 52px | `--spacing-52` |
| 56 | 56px | `--spacing-56` |
| 60 | 60px | `--spacing-60` |
| 64 | 64px | `--spacing-64` |
| 72 | 72px | `--spacing-72` |
| 80 | 80px | `--spacing-80` |
| 96 | 96px | `--spacing-96` |

### Border Radius

| Element | Value |
|---------|-------|
| button | 4px |
| nav | 6px |
| div | 5px |
| div | 8px |
| div | 100% |
| div | 3px |
| div | 2px |
| div | 16px |
| div | 6px 6px 0px 0px |
| div | 0px 0px 6px 6px |
| div | 6px 0px 0px 6px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| 1 | `rgba(23, 23, 23, 0.08) 0px 15px 35px 0px` | `--shadow-1` |
| 2 | `rgba(50, 50, 93, 0.12) 0px 16px 32px 0px` | `--shadow-2` |
| 3 | `rgba(23, 23, 23, 0.06) 0px 3px 6px 0px` | `--shadow-3` |

### Layout
- **Page max-width:** 1266px

## Components

### Primary CTA
**Role:** The main call-to-action — "get started" / "contact sales" buttons in Azure.

Background `#533afd` (Azure), text `#ffffff` (Snow), sohne-var weight 600 at 14px, border-radius 4px, asymmetric padding `11.5px 20px 14.5px 20px`. No border. Transition: `background-color 0.3s cubic-bezier(0.25, 1, 0.5, 1)` plus matched `color` and `border` transitions. No hover or focus styling was captured. White-on-Azure measures 3.39:1 — below AA for small text.

### Secondary Button
**Role:** Outline-style secondary action — used for the federated "sign up with" action.

Background `rgba(255, 255, 255, 0.65)` (translucent Snow), text `#533afd` (Azure), sohne-var weight 600 at 16px, border-radius 4px, padding `14.5px 24px 15.5px 24px`, 1px solid `#b9b9f9` (Light Azure 2) border. Transition: `background-color 0.3s cubic-bezier(0.25, 1, 0.5, 1)` with matched color and border transitions.

### Ghost Button
**Role:** Top-nav menu triggers — the primary navigation buttons ("Products", "Solutions", "Developers").

Background transparent, text `#061b31` (Deep Azure), sohne-var weight 600 at 14px, border-radius 4px, vertical padding `12px 0px`. Transition: `background-color 0.3s cubic-bezier(0.25, 1, 0.5, 1)` with matched color and border transitions.

### Ghost Link
**Role:** Inline brand link — pricing and sign-in text links in the brand blue.

Background transparent, text `#533afd` (Azure), sohne-var weight 600 at 16px, border-radius 0px, 0px padding. Transition: `opacity 0.24s cubic-bezier(0.45, 0.05, 0.55, 0.95)` — the link fades on interaction rather than recolouring.

### Nav Item
**Role:** The top navigation row container — Ink text on a transparent bar with a 6px-rounded hit area.

Background transparent, text `#000000` (Ink), sohne-var weight 400 at 16px, border-radius 6px, padding `10px 16px`. Transition: `all`. No hover or focus state was captured.

### Footer Link
**Role:** Footer navigation and link columns — Ink text at reading size.

Background transparent, text `#000000` (Ink), sohne-var weight 400 at 16px, border-radius 0px, 0px padding (the primary footer block uses `0px 16px` horizontal padding). Transition: `all`.

## Do's and Don'ts

### Do
- Use `#ffffff` (Snow) as the page canvas — every surface and card sits on white, and structure comes from borders, not fills.
- Use `#000000` (Ink) and the deep-navy family (`#061b31`, `#273951`, `#1a2c44`) for borders and dividers — borders, not shadows, do most of the structural work here.
- Reserve `#533afd` (Azure) for the brand signal: link text, the primary CTA fill, and brand border accents. It is the one saturated colour in the system.
- Use slate-blue text (`#50617a`, `#64748d`) and Deep Azure (`#061b31`) for body and secondary copy instead of flat black — the page is tonal, not maximum-contrast.
- Set headlines in sohne-var weight 300 — the large 44–56px sizes are light, not bold; weight 600 is for buttons and labels only.
- Tighten letter-spacing as type scales up (`-0.64px` at 32px, `-1.4px` at 56px) and leave body at `normal`.
- Use a 4px radius (`--radius-button`) on buttons and a 6px radius on the nav hit area — controls and the nav bar are distinguished by corner.

### Don't
- Don't set small white text on `#533afd` (Azure) and assume it passes — the measured contrast is 3.39:1, below AA; reserve the Azure-on-white CTA for large or weight-600 labels.
- Don't reach for a heavy headline weight — weight 300 is the display voice; 600 on a 44px headline breaks the brand's light-headline character.
- Don't treat the 19 gradient tokens as a depth system — they are decorative radial washes on cards and sections, not z-axis layering. Depth comes from the three shadow tokens.
- Don't substitute a neutral black drop shadow for the navy-tinted `rgba(50, 50, 93, 0.12)` elevation shadow — the chromatic tint is the system's depth signature.
- Don't rely on focus indicators — focus styling was not captured for any component, so do not assume a consistent focus ring exists; add one explicitly if you need keyboard affordance.
- Don't cap the page below 1266px — that is the measured `--page-max-width`; the layout is built to fill up to it.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#ffffff` | Full-bleed page background |
| 1 | Light Azure 4 | `#e2e4ff` | Surface / panel |
| 2 | Light Azure | `#e5edf5` | Surface / panel |
| 3 | Light Ember | `#ffe0d1` | Surface / panel |

## Elevation

Three shadow tokens carry all real depth, and two of them are chromatically tinted rather than neutral. The signature elevation shadow is `rgba(50, 50, 93, 0.12) 0px 16px 32px 0px` (`--shadow-2`) — a deep blue-gray that echoes the navy palette, so cards lift off the white canvas with a brand-coloured soft shadow rather than a generic black one. The two near-black tokens — `rgba(23, 23, 23, 0.08) 0px 15px 35px 0px` (`--shadow-1`) for a large ambient lift and `rgba(23, 23, 23, 0.06) 0px 3px 6px 0px` (`--shadow-3`) for a tight close shadow — use warm-tinted `#171717` (Obsidian) at very low opacity, never pure black. The system pairs a large soft offset (15–16px down, 32–35px blur) with the tight 3px close shadow to build a two-step lift; the 19 radial gradient tokens are decorative card and section washes, not part of this elevation model.

## Imagery

No structural imagery dataset (alt-text coverage, crop, or aspect ratios) was extracted. The dominant non-photographic visual treatment is gradient: 19 gradient tokens, almost all radial, used as decorative washes on cards and sections — for example a `radial-gradient(50% 50%, rgba(83, 58, 253, 0.8) 62.5%, rgba(83, 58, 253, 0) 100%)` Azure glow on cards and multi-stop indigo-to-magenta radials (`rgb(127, 125, 252)` → `rgb(244, 75, 204)` → `rgb(229, 237, 245)`). The icon set is large — 183 icons at fixed colour, sized at 10px, 16px, and a 142px hero scale — with no detected icon library.

## Layout

Content caps at a 1266px max-width on a full-width alignment, sitting on a 4px base spacing unit with a spacious rhythm. Section gaps step through a measured ladder of 48px, 60px, 64px, 71px, 80px, and 96px, framing each block with room. Column grids run 1, 2, 3, 4, 8, and 12 columns — the 12-column base subdividing into the narrower counts. Breakpoints fire as min-width queries at 600px, 640px, and 940px (with the heaviest rule counts at 640px and 940px), plus a 1300px wide-desktop tier; the system also honours `prefers-reduced-motion: reduce` and `hover: hover` queries. Motion is restrained to five durations — a 1ms instant, 150ms small, 300ms medium (the most common), 600ms large, and a 2000ms ambient duration — on a primary `ease` timing function.

## Agent Prompt Guide

### Quick Color Reference
- background: `#ffffff` (Snow)
- text (primary): `#000000` (Ink); secondary body `#50617a` / `#64748d`; dark headings `#061b31` (Deep Azure)
- border (default): `#000000` (Ink) and deep-navy `#061b31`
- accent / primary action: `#533afd` (Azure)

### Example Component Prompts

1. Create a primary CTA button: background `#533afd`, text `#ffffff`, sohne-var weight 600 at 14px, border-radius 4px, padding `11.5px 20px 14.5px 20px`, no border. Transition `background-color 0.3s cubic-bezier(0.25, 1, 0.5, 1)`. Use a weight-600 label large enough to read, since white-on-`#533afd` is 3.39:1.

2. Create a secondary outline button: background `rgba(255, 255, 255, 0.65)`, text `#533afd`, 1px solid `#b9b9f9` border, sohne-var weight 600 at 16px, border-radius 4px, padding `14.5px 24px 15.5px 24px`. Transition `background-color 0.3s cubic-bezier(0.25, 1, 0.5, 1)`.

3. Create an inline brand text link: color `#533afd`, sohne-var weight 600 at 16px, border-radius 0, no padding. Transition `opacity 0.24s cubic-bezier(0.45, 0.05, 0.55, 0.95)` so it fades on interaction.

4. Create an elevated card on a white page: background `#ffffff`, border-radius 8px, box-shadow `rgba(50, 50, 93, 0.12) 0px 16px 32px 0px, rgba(23, 23, 23, 0.06) 0px 3px 6px 0px` (navy-tinted lift plus a tight close shadow). Title in sohne-var weight 300 at 32px, letter-spacing `-0.64px`, color `#061b31`. Body in sohne-var weight 400 at 16px, line-height 20px, color `#50617a`.

5. Create a top navigation item: background transparent, text `#000000`, sohne-var weight 400 at 16px, border-radius 6px, padding `10px 16px`. Place it on a full-bleed white bar that caps its content at 1266px.

## Similar Brands

- **Linear** — Same single-saturated-accent discipline (one blue-violet against a near-neutral field), variable sans-serif at a wide weight range, and restrained motion.
- **Vercel** — White canvas with structure carried by hairline borders rather than fills, light-weight display type, and tonal grays over flat black.
- **Mercury** — Banking-grade restraint with a navy-and-blue palette, tonal body text, and chromatic (not neutral) soft shadows on cards.
- **Plaid** — Fintech sibling with a deep-navy-plus-bright-blue system, large light-weight headlines, and gradient washes used decoratively rather than for depth.

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-ink: #000000;
  --color-azure: #533afd;
  --color-azure-2: #50617a;
  --color-deep-azure: #061b31;
  --color-snow: #ffffff;
  --color-azure-3: #64748d;
  --color-azure-4: #0000ee;
  --color-azure-5: #3c4f69;
  --color-deep-azure-2: #273951;
  --color-light-azure: #e5edf5;
  --color-ember: #ff6118;
  --color-deep-azure-3: #1a2c44;
  --color-azure-6: #7389ff;
  --color-azure-7: #7d8ba4;
  --color-light-azure-2: #b9b9f9;
  --color-light-azure-3: #d6d9fc;
  --color-azure-8: #839bc8;
  --color-azure-9: #7f7dfc;
  --color-azure-10: #a3b5d6;
  --color-ink-2: #101010;
  --color-light-azure-4: #e2e4ff;
  --color-voltage: #81b81a;
  --color-azure-11: #000eff;
  --color-azure-12: #2d2564;
  --color-magenta: #f44bcc;
  --color-deep-azure-4: #182659;
  --color-indigo: #da4bfe;
  --color-obsidian: #171717;
  --color-light-ember: #ffe0d1;
  --color-azure-13: #32325d;
  --color-light-azure-5: #d4dee9;
  --color-deep-azure-5: #031323;
  --color-ember-2: #ffcf5e;
  --color-indigo-2: #4304ea;
  --color-light-azure-6: #b4d8ff;
  --color-crimson: #ff8c6c;
  --color-ember-3: #fbbc04;
  --color-light-ember-2: #faf1e5;
  --color-indigo-3: #c489ff;
  --color-ember-4: #ffc977;
  --color-azure-14: #715cff;
  --color-voltage-2: #00d66f;
  --color-deep-teal: #0b3b45;
  --color-azure-15: #4285f4;
  --color-sage: #34a853;
  --color-crimson-2: #ea4335;
  --color-teal: #047ab1;
  --color-crimson-3: #d42d06;
  --color-light-magenta: #ffa8cd;
  --color-voltage-3: #00d64f;
  --color-crimson-4: #ff0033;
  --color-voltage-4: #009f41;
  --color-azure-16: #008cd5;
  --color-citron: #ffd100;
  --color-voltage-5: #0aad0a;
  --color-magenta-2: #f363f3;
  --color-indigo-4: #7232f1;
  --color-magenta-3: #fb76fa;
  --color-azure-17: #486ffd;
  --color-light-indigo: #dac0ff;
  --color-light-magenta-2: #ff90b9;
  --color-light-ember-3: #ffd79b;
  --color-azure-18: #0071c1;
  --color-azure-19: #60a8e2;
  --color-ember-5: #ffb451;
  --color-ember-6: #ffa577;
  --color-light-crimson: #ff90a1;
  --color-light-indigo-2: #ddadff;
  --color-light-indigo-3: #ecd8ff;
  --color-azure-20: #6763e4;
  --color-azure-21: #453bb3;
  --color-azure-22: #29227d;
  --color-deep-azure-6: #141e4b;
  --color-magenta-4: #f72df3;
  --color-ember-7: #ffad00;
  --color-ember-8: #ff7600;
  /* Typography — Scale */
  --text-t0: 8px;
  --leading-t0: 8.96px;
  --text-t1: 8px;
  --leading-t1: 8.56px;
  --text-t2: 9px;
  --leading-t2: normal;
  --text-t3: 9px;
  --leading-t3: 10.8px;
  --text-t4: 10px;
  --leading-t4: 11.5px;
  --text-t5: 10px;
  --leading-t5: 11.5px;
  --text-t6: 11px;
  --leading-t6: 16px;
  --text-t7: 12px;
  --leading-t7: normal;
  --text-t8: 12px;
  --leading-t8: 16px;
  --text-t9: 14px;
  --leading-t9: 14px;
  --text-t10: 14px;
  --leading-t10: normal;
  --text-t11: 14px;
  --leading-t11: 14px;
  --text-t12: 16px;
  --leading-t12: normal;
  --text-t13: 16px;
  --leading-t13: 16px;
  --text-t14: 16px;
  --leading-t14: 20px;
  --text-t15: 18px;
  --leading-t15: 25.2px;
  --text-t16: 18px;
  --leading-t16: 25.2px;
  --text-h3: 22px;
  --leading-h3: 24.2px;
  --text-t18: 26px;
  --leading-t18: normal;
  --text-h3: 26px;
  --leading-h3: 29.12px;
  --text-h2: 32px;
  --leading-h2: 35.2px;
  --text-h1: 44px;
  --leading-h1: 50.6px;
  --text-t22: 48px;
  --leading-t22: 49.44px;
  --text-t23: 48px;
  --leading-t23: 48px;
  --text-h2: 56px;
  --leading-h2: 57.68px;
  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-52: 52px;
  --spacing-56: 56px;
  --spacing-60: 60px;
  --spacing-64: 64px;
  --spacing-72: 72px;
  --spacing-80: 80px;
  --spacing-96: 96px;
  /* Layout */
  --page-max-width: 1266px;
  /* Border Radius */
  --radius-button: 4px;
  --radius-nav: 6px;
  --radius-div: 5px;
  --radius-div: 8px;
  --radius-div: 100%;
  --radius-div: 3px;
  --radius-div: 2px;
  --radius-div: 16px;
  --radius-div: 6px 6px 0px 0px;
  --radius-div: 0px 0px 6px 6px;
  --radius-div: 6px 0px 0px 6px;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-ink: #000000;
  --color-azure: #533afd;
  --color-azure-2: #50617a;
  --color-deep-azure: #061b31;
  --color-snow: #ffffff;
  --color-azure-3: #64748d;
  --color-azure-4: #0000ee;
  --color-azure-5: #3c4f69;
  --color-deep-azure-2: #273951;
  --color-light-azure: #e5edf5;
  --color-ember: #ff6118;
  --color-deep-azure-3: #1a2c44;
  --color-azure-6: #7389ff;
  --color-azure-7: #7d8ba4;
  --color-light-azure-2: #b9b9f9;
  --color-light-azure-3: #d6d9fc;
  --color-azure-8: #839bc8;
  --color-azure-9: #7f7dfc;
  --color-azure-10: #a3b5d6;
  --color-ink-2: #101010;
  --color-light-azure-4: #e2e4ff;
  --color-voltage: #81b81a;
  --color-azure-11: #000eff;
  --color-azure-12: #2d2564;
  --color-magenta: #f44bcc;
  --color-deep-azure-4: #182659;
  --color-indigo: #da4bfe;
  --color-obsidian: #171717;
  --color-light-ember: #ffe0d1;
  --color-azure-13: #32325d;
  --color-light-azure-5: #d4dee9;
  --color-deep-azure-5: #031323;
  --color-ember-2: #ffcf5e;
  --color-indigo-2: #4304ea;
  --color-light-azure-6: #b4d8ff;
  --color-crimson: #ff8c6c;
  --color-ember-3: #fbbc04;
  --color-light-ember-2: #faf1e5;
  --color-indigo-3: #c489ff;
  --color-ember-4: #ffc977;
  --color-azure-14: #715cff;
  --color-voltage-2: #00d66f;
  --color-deep-teal: #0b3b45;
  --color-azure-15: #4285f4;
  --color-sage: #34a853;
  --color-crimson-2: #ea4335;
  --color-teal: #047ab1;
  --color-crimson-3: #d42d06;
  --color-light-magenta: #ffa8cd;
  --color-voltage-3: #00d64f;
  --color-crimson-4: #ff0033;
  --color-voltage-4: #009f41;
  --color-azure-16: #008cd5;
  --color-citron: #ffd100;
  --color-voltage-5: #0aad0a;
  --color-magenta-2: #f363f3;
  --color-indigo-4: #7232f1;
  --color-magenta-3: #fb76fa;
  --color-azure-17: #486ffd;
  --color-light-indigo: #dac0ff;
  --color-light-magenta-2: #ff90b9;
  --color-light-ember-3: #ffd79b;
  --color-azure-18: #0071c1;
  --color-azure-19: #60a8e2;
  --color-ember-5: #ffb451;
  --color-ember-6: #ffa577;
  --color-light-crimson: #ff90a1;
  --color-light-indigo-2: #ddadff;
  --color-light-indigo-3: #ecd8ff;
  --color-azure-20: #6763e4;
  --color-azure-21: #453bb3;
  --color-azure-22: #29227d;
  --color-deep-azure-6: #141e4b;
  --color-magenta-4: #f72df3;
  --color-ember-7: #ffad00;
  --color-ember-8: #ff7600;
  /* Typography — Scale */
  --text-t0: 8px;
  --leading-t0: 8.96px;
  --text-t1: 8px;
  --leading-t1: 8.56px;
  --text-t2: 9px;
  --leading-t2: normal;
  --text-t3: 9px;
  --leading-t3: 10.8px;
  --text-t4: 10px;
  --leading-t4: 11.5px;
  --text-t5: 10px;
  --leading-t5: 11.5px;
  --text-t6: 11px;
  --leading-t6: 16px;
  --text-t7: 12px;
  --leading-t7: normal;
  --text-t8: 12px;
  --leading-t8: 16px;
  --text-t9: 14px;
  --leading-t9: 14px;
  --text-t10: 14px;
  --leading-t10: normal;
  --text-t11: 14px;
  --leading-t11: 14px;
  --text-t12: 16px;
  --leading-t12: normal;
  --text-t13: 16px;
  --leading-t13: 16px;
  --text-t14: 16px;
  --leading-t14: 20px;
  --text-t15: 18px;
  --leading-t15: 25.2px;
  --text-t16: 18px;
  --leading-t16: 25.2px;
  --text-h3: 22px;
  --leading-h3: 24.2px;
  --text-t18: 26px;
  --leading-t18: normal;
  --text-h3: 26px;
  --leading-h3: 29.12px;
  --text-h2: 32px;
  --leading-h2: 35.2px;
  --text-h1: 44px;
  --leading-h1: 50.6px;
  --text-t22: 48px;
  --leading-t22: 49.44px;
  --text-t23: 48px;
  --leading-t23: 48px;
  --text-h2: 56px;
  --leading-h2: 57.68px;
  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-52: 52px;
  --spacing-56: 56px;
  --spacing-60: 60px;
  --spacing-64: 64px;
  --spacing-72: 72px;
  --spacing-80: 80px;
  --spacing-96: 96px;
  /* Border Radius */
  --radius-button: 4px;
  --radius-nav: 6px;
  --radius-div: 5px;
  --radius-div: 8px;
  --radius-div: 100%;
  --radius-div: 3px;
  --radius-div: 2px;
  --radius-div: 16px;
  --radius-div: 6px 6px 0px 0px;
  --radius-div: 0px 0px 6px 6px;
  --radius-div: 6px 0px 0px 6px;
}
```
