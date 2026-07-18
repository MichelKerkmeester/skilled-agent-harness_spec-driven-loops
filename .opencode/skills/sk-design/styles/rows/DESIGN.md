# Rows — Style Reference
> blank spreadsheet at dawn — calm, precise, one warm spark on cold white

**Theme:** light

Rows presents a near-monochrome workspace where black type on a vast white canvas does almost all the work, and a single warm marigold accent (used once per screen, never as fill) signals where attention belongs. The interface feels like a spreadsheet that learned to be a product: tabular density, hairline dividers, compact 8px gaps, and typographic restraint rather than chrome to organize information. Components are nearly borderless — the visual structure comes from whitespace, alignment, and the occasional thin 1px rule. Color never decorates; it only points. The single gradient (coral to marigold) exists as a brand mark, not as surface treatment.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Ink | `#1a1a1a` | `--color-ink` | Supporting neutral for secondary UI, dividers, and muted labels. Do not promote it to the primary CTA color |
| Paper | `#ffffff` | `--color-paper` | Page canvas, card surfaces, button text on dark fills |
| Mist | `#f7f7f7` | `--color-mist` | Subtle surface lift for inset panels, hover states, secondary card backgrounds |
| Ash | `#eaeaea` | `--color-ash` | Hairline borders, dividers, tag outlines, input default border |
| Smoke | `#e1e1e1` | `--color-smoke` | Table row dividers, secondary borders, icon outlines in inactive state |
| Graphite | `#838383` | `--color-graphite` | Tertiary text, placeholder copy, disabled icon color |
| Steel | `#989898` | `--color-steel` | Secondary text, helper labels, subdued metadata |
| Slate | `#6f6f6f` | `--color-slate` | Body text secondary, link text in resting state, breadcrumb text |
| Marigold | `#ffb84d` | `--color-marigold` | Accent stroke on the primary input — a single warm spark that signals focus, never fills a surface |
| Buttercream | `#ffe480` | `--color-buttercream` | Yellow supporting accent for decorative details and low-frequency emphasis. Do not promote it to the primary CTA color |
| Cream | `#fff6d4` | `--color-cream` | Very pale accent wash for soft highlight backgrounds behind marigold borders |

## Tokens — Typography

### Output Sans — Single-family type system: 24px/700 for the page heading, 18px/400 for the hero greeting and primary links, 14px/400–700 for body, controls, and template labels, 10px/400 for micro-labels and column headers. The tight negative tracking at 18–24px (-0.043em) tightens the headline and greeting into a compact, spreadsheet-like block, while positive tracking on 10–14px caps and labels adds quiet authority to tiny type. · `--font-output-sans`
- **Substitute:** Inter
- **Weights:** 400, 700
- **Sizes:** 10, 14, 18, 24
- **Line height:** 1.00–1.45
- **Letter spacing:** −0.043em at 24px; +0.008–0.021em at 10–14px
- **OpenType features:** `"tnum" on, "ss01" on`
- **Role:** Single-family type system: 24px/700 for the page heading, 18px/400 for the hero greeting and primary links, 14px/400–700 for body, controls, and template labels, 10px/400 for micro-labels and column headers. The tight negative tracking at 18–24px (-0.043em) tightens the headline and greeting into a compact, spreadsheet-like block, while positive tracking on 10–14px caps and labels adds quiet authority to tiny type.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 10px | 1 | 0.21px | `--text-caption` |
| heading-sm | 18px | 1.45 | -0.774px | `--text-heading-sm` |
| heading | 24px | 1 | -1.032px | `--text-heading` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** compact

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
| 44 | 44px | `--spacing-44` |
| 52 | 52px | `--spacing-52` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 4px |
| cards | 8px |
| inputs | 4px |
| buttons | 4px |

### Layout

- **Page max-width:** 1080px
- **Section gap:** 48-64px
- **Card padding:** 16-24px
- **Element gap:** 8px

## Components

### Top Bar
**Role:** Minimal app chrome

Full-bleed white bar, 1px Ash (#eaeaea) bottom border. Left: small workspace name at 14px/700 Ink with a subtle back chevron icon. Right: 'Log in' as 14px/400 Steel ghost text and 'Free sign up' as 14px/400 Ink inside a 1px Ink border, 4px radius, 6px vertical / 12px horizontal padding. No shadow, no fill on the bar itself.

### Primary Input
**Role:** Prompt field

Full-width within content column (max ~960px), 1px Marigold (#ffb84d) border, 4px radius, generous vertical padding (16–20px). Placeholder text 18px/400 in Graphite. A trailing action cluster on the right (send/attach icons at 18px Slate). On hover, border stays marigold; on focus, a 1px cream (#fff6d4) glow halo. This is the only chromatic border on the screen.

### Template Grid
**Role:** Discovery surface

4-column grid with 24px column gap, 8px row gap. Each cell is a clickable row, not a card: no border, no fill, no radius. The structure is implied by alignment alone. Column headers ('Import', 'Marketing Dashboard', etc.) at 10px/700 Graphite, positively tracked, uppercase-style restraint.

### Template Item
**Role:** Template entry

Single horizontal row: 6px colored dot (category color) + 14px/400 Ink label, 8px gap between dot and text, 12px vertical padding. No hover state beyond subtle text color shift to Ink-from-Slate. No background, no underline, no card chrome.

### Category Color Dots
**Role:** Template iconography

6px solid circles in muted category colors (soft pink, sky blue, mint, amber, violet). They are the ONLY chromatic elements across the entire grid — a quiet, functional wayfinding system that avoids icon complexity.

### Ghost Link Button
**Role:** Inline action

14px/400 Slate text with trailing arrow glyph (→), no border, no fill. On hover, text shifts to Ink. Used for 'Start from blank →' and similar low-emphasis actions.

### Outlined Button
**Role:** Secondary action

1px Ink border, 4px radius, 6px vertical / 12px horizontal padding, 14px/400 Ink text. No fill in resting state. Used for 'Free sign up' in the top bar.

### Filled Button
**Role:** Primary action

Ink (#1a1a1a) background, Paper (#ffffff) text, 14px/700, 4px radius, 8–10px vertical / 16–20px horizontal padding. Reserved for the most important single action on a screen. No shadow, no gradient fill.

### Footer Link
**Role:** Minimal footer

Centered row at the bottom of the canvas, 14px/400 Slate text links separated by 16–24px gap. No border, no fill, no logo lockup — just text on white.

## Do's and Don'ts

### Do
- Use Ink (#1a1a1a) for all primary text and filled button backgrounds; never substitute a lighter gray for emphasis.
- Reserve Marigold (#ffb84d) for the single most important interactive border per screen — the prompt input or one focused control — and never use it as a fill.
- Use 4px radius for buttons and inputs, 8px for cards; never exceed 8px or reach for pill shapes.
- Use Output Sans at 24px/700 with -0.043em tracking for the page heading and 18px/400 with the same negative tracking for the hero greeting; this negative spacing at large sizes is the signature.
- Separate template/entry items with whitespace and 8px row gaps — no borders, no card backgrounds, no hover fills beyond a subtle Ink color shift.
- Use the 6px colored dot convention for categorical iconography instead of full icons when the label is already present.
- Anchor all micro-labels (column headers, tags) at 10px/700 with +0.021em positive tracking to create the spreadsheet-like precision.

### Don't
- Don't introduce any chromatic fill color on buttons, cards, or surfaces — color belongs on borders and dots only.
- Don't add box-shadows or elevation to cards or inputs; the design is flat and relies on 1px borders.
- Don't use letter-spacing of 0 or positive values on headings 18px and above — the negative tracking is non-negotiable.
- Don't use more than one marigold element per viewport; its power comes from scarcity.
- Don't use a system font fallback that changes the geometric proportions; Output Sans / Inter are the only acceptable families.
- Don't wrap template items in bordered or filled cards — the grid is defined by alignment, not containers.
- Don't use the coral-to-marigold gradient as a background or button fill; it is a brand mark only, never a surface.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Paper | `#ffffff` | Page canvas — the dominant surface, occupying 80%+ of the viewport |
| 1 | Mist | `#f7f7f7` | Subtle inset panels and secondary card backgrounds for low-elevation distinction |
| 2 | Cream | `#fff6d4` | Accent wash behind the marigold-bordered input or highlighted selection |

## Elevation

No shadows. The design is intentionally flat: all spatial hierarchy comes from 1px hairline borders in Ash (#eaeaea) and Smoke (#e1e1e1), and from generous whitespace. Elevation is conveyed by Ink fill, not by drop shadow.

## Imagery

No photography, no illustration, no product screenshots. The visual language is pure UI: type, dots, lines, and one bordered input. When visuals are needed, they appear as the 6px colored category dots — flat, solid, never gradient or photographic. Density is overwhelmingly text-dominant.

## Layout

Centered, max-width ~1080px content column on a full-bleed white canvas. Hero is a vertically stacked composition: small top bar, then ~15% vertical breathing room, then a single-line 24px heading, then the full-width marigold-bordered prompt input, then a 4-column template grid with 24px column gaps, then a right-aligned 'Start from blank →' link, then deep white space, then a centered two-link footer. No sidebar, no mega-menu, no sticky elements beyond the top bar. Navigation is minimal — a back chevron and a workspace name on the left, two text-level actions on the right.

## Agent Prompt Guide

**Quick Color Reference**
- text: #1a1a1a (Ink)
- background: #ffffff (Paper)
- border: #eaeaea (Ash) for hairlines, #1a1a1a (Ink) for outlined buttons
- accent: #ffb84d (Marigold) — border-only, never fill
- primary action: no distinct CTA color
- secondary text: #6f6f6f (Slate)

**Example Component Prompts**
1. *Hero prompt screen*: White (#ffffff) canvas, centered. Greeting 'Hi, what do you want to build?' in Output Sans 24px/700, #1a1a1a, letter-spacing -0.043em. Below it, a full-width input (~960px) with 1px #ffb84d border, 4px radius, 18px placeholder in #838383, 16px vertical padding.
2. *Template grid row*: Four columns, 24px gap, no borders. Column header in 10px/700 #6f6f6f with +0.021em tracking. Each item: 6px solid colored dot + 8px gap + 14px/400 #1a1a1a label, 12px vertical padding, no hover background.
3. *Outlined secondary button*: 1px #1a1a1a border, 4px radius, 6px/12px padding, 14px/400 #1a1a1a label, transparent background. For 'Free sign up' in the top bar.
4. *Ghost link action*: 14px/400 #6f6f6f text with a trailing → arrow, no border, no fill. On hover, color shifts to #1a1a1a. For 'Start from blank'.
5. *Top bar*: Full-width white, 1px #eaeaea bottom border. Left: 14px/700 #1a1a1a workspace name with a left chevron icon in #838383. Right: 'Log in' as 14px/400 #6f6f6f ghost text, then an outlined 'Free sign up' button.

## Color Rarity System

Rows treats color as a scarce resource. The entire interface is achromatic; Marigold (#ffb84d) appears at most once per viewport, always as a 1px border on the single most important interactive element. The 6px category dots are the only other chromatic elements, and they use a muted, desaturated palette. The coral→marigold gradient is reserved as a brand mark and never used as a surface. This scarcity is the design's most distinctive behavioral rule — adding more color breaks the system.

## Similar Brands

- **Linear** — Same extreme monochrome discipline with a single accent color, compact 14px type, and 4–8px radii on a flat, shadowless surface
- **Notion** — Same near-grayscale palette, hairline Ash borders, text-dominant layouts, and the feeling of a document/workspace rather than a marketing site
- **Causal** — Same spreadsheet-adjacent minimalism: white canvas, tiny colored dots for category iconography, typographic restraint over chrome
- **Vercel** — Same flat hierarchy with no shadows, 4–8px radii, and a single warm accent used sparingly for focus indication

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-ink: #1a1a1a;
  --color-paper: #ffffff;
  --color-mist: #f7f7f7;
  --color-ash: #eaeaea;
  --color-smoke: #e1e1e1;
  --color-graphite: #838383;
  --color-steel: #989898;
  --color-slate: #6f6f6f;
  --color-marigold: #ffb84d;
  --color-buttercream: #ffe480;
  --color-cream: #fff6d4;

  /* Typography — Font Families */
  --font-output-sans: 'Output Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1;
  --tracking-caption: 0.21px;
  --text-heading-sm: 18px;
  --leading-heading-sm: 1.45;
  --tracking-heading-sm: -0.774px;
  --text-heading: 24px;
  --leading-heading: 1;
  --tracking-heading: -1.032px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-44: 44px;
  --spacing-52: 52px;

  /* Layout */
  --page-max-width: 1080px;
  --section-gap: 48-64px;
  --card-padding: 16-24px;
  --element-gap: 8px;

  /* Border Radius */
  --radius-sm: 1px;
  --radius-md: 4px;
  --radius-lg: 8px;

  /* Named Radii */
  --radius-tags: 4px;
  --radius-cards: 8px;
  --radius-inputs: 4px;
  --radius-buttons: 4px;

  /* Surfaces */
  --surface-paper: #ffffff;
  --surface-mist: #f7f7f7;
  --surface-cream: #fff6d4;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-ink: #1a1a1a;
  --color-paper: #ffffff;
  --color-mist: #f7f7f7;
  --color-ash: #eaeaea;
  --color-smoke: #e1e1e1;
  --color-graphite: #838383;
  --color-steel: #989898;
  --color-slate: #6f6f6f;
  --color-marigold: #ffb84d;
  --color-buttercream: #ffe480;
  --color-cream: #fff6d4;

  /* Typography */
  --font-output-sans: 'Output Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1;
  --tracking-caption: 0.21px;
  --text-heading-sm: 18px;
  --leading-heading-sm: 1.45;
  --tracking-heading-sm: -0.774px;
  --text-heading: 24px;
  --leading-heading: 1;
  --tracking-heading: -1.032px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-44: 44px;
  --spacing-52: 52px;

  /* Border Radius */
  --radius-sm: 1px;
  --radius-md: 4px;
  --radius-lg: 8px;
}
```
