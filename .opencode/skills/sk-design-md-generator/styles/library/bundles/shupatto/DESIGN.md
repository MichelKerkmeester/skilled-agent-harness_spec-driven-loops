# Shupatto — Style Reference
> Museum vitrine on white marble

**Theme:** light

Shupatto's digital presence operates like a quiet museum vitrine for a single physical product. The visual system is almost entirely achromatic — a canvas of white interrupted by hairline charcoal lines, generous negative space, and minuscule typography that whispers rather than shouts. Everything is set in uppercase with dramatically wide letter-spacing, transforming even body copy into editorial display text. The only chromatic note is a soft periwinkle blue that functions less as a brand color and more as a faint pressure point — a tag, a selected state, a small badge. The interface is a study in restraint: no shadows, no gradients, no rounded corners beyond 3px, no decorative imagery competing with the product. Line work and typographic rhythm do all the work.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Graphite | `#2d2d2d` | `--color-graphite` | Primary text, hairline borders, structural lines — the dominant neutral carrying all interface weight |
| Ink | `#000000` | `--color-ink` | Strongest text and most emphatic borders, logo dots, footer marks |
| Paper | `#ffffff` | `--color-paper` | Page canvas, card surfaces, nav backgrounds — the unbroken white field everything floats on |
| Fog | `#878887` | `--color-fog` | Muted helper text, secondary borders, dimmed metadata |
| Periwinkle | `#738ae5` | `--color-periwinkle` | Sole chromatic accent — selected nav state, badge fills, a rare pressure point in an otherwise colorless system |

## Tokens — Typography

### GillSansNova-Book — Primary typeface for body, headings, nav, links, and icon-adjacent text — carries the entire English typographic system at a medium weight with wide tracking · `--font-gillsansnova-book`
- **Substitute:** Jost, Outfit, or Avenir Next
- **Weights:** 500
- **Sizes:** 12px, 16px, 18px, 19px, 21px, 22px, 28px
- **Line height:** 1.00–1.33
- **Letter spacing:** 0.07–0.125em
- **OpenType features:** `"palt"`
- **Role:** Primary typeface for body, headings, nav, links, and icon-adjacent text — carries the entire English typographic system at a medium weight with wide tracking

### GillSansNova-SemiBold — Emphasis and key headings — the bolder weight creates hierarchy without size inflation; the 8px variant carries micro-labels and badge text · `--font-gillsansnova-semibold`
- **Substitute:** Jost Medium or Outfit SemiBold
- **Weights:** 800
- **Sizes:** 8px, 18px, 21px, 28px
- **Line height:** 1.00–2.50
- **Letter spacing:** 0.064–0.119em
- **OpenType features:** `"palt"`
- **Role:** Emphasis and key headings — the bolder weight creates hierarchy without size inflation; the 8px variant carries micro-labels and badge text

### 游ゴシック体 (Yu Gothic) — Japanese text rendering — sits at the same metric scale as the English system, ensuring bilingual visual parity · `--font-yu-gothic`
- **Substitute:** Noto Sans JP or Hiragino Sans
- **Weights:** 400
- **Sizes:** 18px
- **Line height:** 1.00
- **Letter spacing:** 0.1em
- **OpenType features:** `"palt"`
- **Role:** Japanese text rendering — sits at the same metric scale as the English system, ensuring bilingual visual parity

### CezannePro-DB — Micro-decorative and brand-specific marks — a secondary display face for labels that need a different visual texture from the main Gill system · `--font-cezannepro-db`
- **Substitute:** Italiana or Cinzel
- **Weights:** 600
- **Sizes:** 15px
- **Line height:** 1.00–1.33
- **Letter spacing:** 0.133em
- **OpenType features:** `"palt"`
- **Role:** Micro-decorative and brand-specific marks — a secondary display face for labels that need a different visual texture from the main Gill system

### GillSansNova-Medium — GillSansNova-Medium — detected in extracted data but not described by AI · `--font-gillsansnova-medium`
- **Weights:** 600
- **Sizes:** 10px, 17px
- **Line height:** 1, 1.41
- **Letter spacing:** 0.071, 0.18
- **OpenType features:** `"palt"`
- **Role:** GillSansNova-Medium — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| body | 16px | 1.29 | 1.28px | `--text-body` |
| subheading | 18px | 1.25 | 1.44px | `--text-subheading` |
| heading-sm | 21px | 1.22 | 2.52px | `--text-heading-sm` |
| heading-lg | 28px | 1 | 2.24px | `--text-heading-lg` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 5 | 5px | `--spacing-5` |
| 10 | 10px | `--spacing-10` |
| 14 | 14px | `--spacing-14` |
| 16 | 16px | `--spacing-16` |
| 17 | 17px | `--spacing-17` |
| 19 | 19px | `--spacing-19` |
| 21 | 21px | `--spacing-21` |
| 22 | 22px | `--spacing-22` |
| 23 | 23px | `--spacing-23` |
| 27 | 27px | `--spacing-27` |
| 60 | 60px | `--spacing-60` |

### Border Radius

| Element | Value |
|---------|-------|
| all | 3px |
| cards | 3px |
| badges | 3px |
| buttons | 3px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 24px
- **Element gap:** 16px

## Components

### Hairline-Bordered Card
**Role:** Universal content container

White surface with 1px #2d2d2d border, 3px radius, 24px internal padding. No shadow, no fill distinction from page — the border alone separates content from canvas. The dominant structural unit across the site.

### Text-Nav Link
**Role:** Navigation item

GillSansNova-SemiBold at 8–18px, uppercase, letter-spacing 0.1–0.119em, color #2d2d2d or #000000. No background, no border, no underline. Items separated by generous whitespace rather than dividers.

### Selected Nav Dot
**Role:** Active state indicator

A small filled circle in #000000 or the periwinkle #738ae5 placed adjacent to the active nav label — the only visual signal of selection. The periwinkle variant appears on badge/nav surfaces.

### Editorial Display Heading
**Role:** Page title and section headers

GillSansNova-Book or SemiBold at 21–28px, uppercase, letter-spacing 0.12–0.125em, color #2d2d2d. The wide tracking transforms mid-weight type into a display voice without needing a display weight or decorative treatment.

### Micro-Label Badge
**Role:** Category tags and product marks

GillSansNova-SemiBold at 8px, uppercase, letter-spacing 0.119em, 3px radius. Background either transparent (text only, #2d2d2d) or filled with #738ae5 (white text). Functions as a typographic stamp, not a pill.

### Product Grid Cell
**Role:** Catalog item

White card with 1px #2d2d2d border, 3px radius, no padding around the product image (which bleeds to the border). Caption text in GillSansNova-SemiBold 8px or GillSansNova-Book 12px sits below with 16–24px margin-top.

### Hairline Divider
**Role:** Section separator

1px solid #2d2d2d or #000000 horizontal line, full-width or content-width. The most common separator; no double-line, no dotted, no gradient fades.

### Ghost Body Link
**Role:** Inline text link

GillSansNova-Book 16–18px, color #000000 with 1px underline border. On hover or active, the underline thickens or shifts to #2d2d2d. No color change, no background change.

### Sparse Footer Mark
**Role:** Footer brand and meta

Minimalist footer with GillSansNova-SemiBold 8–18px, letter-spacing 0.119em, all caps. A single small #000000 dot serves as the brand mark or separator. Maximum restraint.

### Image Caption Label
**Role:** Photo or product caption

GillSansNova-Book 12px or CezannePro-DB 15px, uppercase, letter-spacing 0.133em, color #2d2d2d. Sits tightly below images with 3–10px gap, functioning as gallery wall text.

## Do's and Don'ts

### Do
- Use uppercase with letter-spacing ≥ 0.07em for all interface text — this tracking is the typographic signature, not the weight or size
- Separate content containers with 1px #2d2d2d or #000000 hairline borders, never with background fills or shadows
- Keep the 3px border-radius for every rounded element — a sharper, more architectural system than the common 8–16px
- Limit color to the neutrals plus periwinkle #738ae5; let the periwinkle appear on at most 1–2 elements per view as a quiet accent
- Set body text at 16–18px with 1.22–1.33 line-height and 0.07–0.1em letter-spacing for an editorial gallery feel
- Use GillSansNova-SemiBold (weight 800) at 8px with 0.119em tracking for all micro-labels, badges, and category stamps
- Apply the "palt" font-feature setting globally — it optimizes proportional alternates and is non-negotiable for the brand's typographic identity

### Don't
- Do not introduce shadows, gradients, or any form of elevation — the design system is flat by philosophy
- Do not add bright or saturated colors beyond #738ae5; even secondary accents should stay neutral
- Do not use border-radius above 3px; avoid pill shapes and large rounded corners
- Do not set type in mixed case or normal letter-spacing; everything reads as editorial display via tracking
- Do not fill cards or sections with tinted backgrounds; rely on hairline borders to create structure on the white canvas
- Do not use large display type below 28px or above 32px — the scale is deliberately compressed and quiet
- Do not add icons with weight above 1px stroke; icons are absent or drawn as the thinnest possible lines

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Paper | `#ffffff` | Base page canvas and card surface — there is no distinction between page and card backgrounds; everything sits on the same white field |
| 2 | Ink Hairline | `#2d2d2d` | Hairline borders at 1px define every container and divider; surfaces are carved out by line work, not by tonal layering |

## Imagery

Product photography is the only visual content — no lifestyle imagery, no illustrations, no abstract graphics. Product shots appear as tight, centered catalog images on white backgrounds, contained within hairline-bordered cells. The object itself is the hero; the surrounding frame is gallery-like. No overlapping, no masking, no decorative treatment. Imagery-to-text ratio is moderate, with product images occupying roughly 40–50% of viewport space on catalog pages. No icons are used as decorative elements — the system is image-free and icon-free, relying entirely on typography and line work.

## Layout

The page model is a single max-width column at ~1200px centered on a white canvas, with no full-bleed sections. The hero is a centered text statement ('BAGS DESIGNED TO FOLD WITH A SNAP') set in wide-tracked uppercase at ~21px, floating in vast negative space with no accompanying image. Navigation sits in the top-right corner as a single small text link. Sections flow vertically with generous 80px+ vertical gaps, separated by hairline rules. Content blocks alternate between text-only editorial statements and product grid cells. Product grids use 3–4 columns at desktop width. The overall rhythm is slow and contemplative — a museum walk-through rather than a commercial browse. Footer is a single hairline-bordered line of micro-text.

## Agent Prompt Guide

## Quick Color Reference
- Text: #2d2d2d (primary), #000000 (strongest), #878887 (muted)
- Background: #ffffff (all surfaces)
- Border: #2d2d2d (standard hairline), #000000 (emphatic)
- Accent: #738ae5 (periwinkle — selected states, badge fills only)
- primary action: no distinct CTA color

## Example Component Prompts
1. **Editorial Display Heading**: Set in GillSansNova-Book (sub: Jost) weight 500, 28px, uppercase, letter-spacing 0.08em, color #2d2d2d. No border, no background, sits on white canvas with 80px vertical breathing room above and below.

2. **Hairline-Bordered Product Card**: White surface, 1px solid #2d2d2d border, 3px border-radius, 0px internal padding (image bleeds to edge). Caption below: GillSansNova-SemiBold (sub: Jost) 8px, uppercase, letter-spacing 0.119em, color #2d2d2d, 16px margin-top.

3. **Micro-Label Badge**: GillSansNova-SemiBold (sub: Jost) 8px, uppercase, letter-spacing 0.119em, color #2d2d2d, transparent background, 3px radius, 4px 8px padding. For the accent variant: background #738ae5, color #ffffff.

4. **Ghost Nav Link**: GillSansNova-SemiBold (sub: Jost) 18px, uppercase, letter-spacing 0.1em, color #2d2d2d, no underline, no background. Active state: a 4px filled circle in #000000 sits to the right of the text.

5. **Section Divider**: 1px solid #2d2d2d horizontal line, full content width (max 1200px), no spacing above or below — sits flush between content blocks as a typographic mark.

## Elevation Philosophy

This design system intentionally avoids all box-shadow usage. Elevation is never communicated through depth, glow, or blur. Instead, structure is created through hairline borders (1px #2d2d2d or #000000) and generous negative space. When separation is needed, a line is drawn — not a shadow cast. This is a deliberate choice: the site treats the interface as a flat editorial layout, not a layered application surface. The single surface level (white) means every container must declare itself through stroke, not through tonal difference.

## Similar Brands

- **MUJI** — Same near-monochrome palette, hairline structural lines, and uppercase wide-tracked typography on white canvas — both treat the product as the only source of visual warmth
- **Issey Miyake** — Editorial Japanese design language with compressed type scale, museum-like negative space, and zero decorative chrome — the product is framed, not promoted
- **COS (cosstores.com)** — Wide letter-spaced uppercase headings, hairline borders defining product cells, and the same restrained gallery-presentation rhythm
- **Aesop** — Anti-shadow, anti-gradient approach with content defined by serif/grotesque typography and hairlines rather than by color or elevation

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-graphite: #2d2d2d;
  --color-ink: #000000;
  --color-paper: #ffffff;
  --color-fog: #878887;
  --color-periwinkle: #738ae5;

  /* Typography — Font Families */
  --font-gillsansnova-book: 'GillSansNova-Book', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-gillsansnova-semibold: 'GillSansNova-SemiBold', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-yu-gothic: '游ゴシック体 (Yu Gothic)', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-cezannepro-db: 'CezannePro-DB', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-gillsansnova-medium: 'GillSansNova-Medium', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-body: 16px;
  --leading-body: 1.29;
  --tracking-body: 1.28px;
  --text-subheading: 18px;
  --leading-subheading: 1.25;
  --tracking-subheading: 1.44px;
  --text-heading-sm: 21px;
  --leading-heading-sm: 1.22;
  --tracking-heading-sm: 2.52px;
  --text-heading-lg: 28px;
  --leading-heading-lg: 1;
  --tracking-heading-lg: 2.24px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-extrabold: 800;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-5: 5px;
  --spacing-10: 10px;
  --spacing-14: 14px;
  --spacing-16: 16px;
  --spacing-17: 17px;
  --spacing-19: 19px;
  --spacing-21: 21px;
  --spacing-22: 22px;
  --spacing-23: 23px;
  --spacing-27: 27px;
  --spacing-60: 60px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 24px;
  --element-gap: 16px;

  /* Border Radius */
  --radius-sm: 3px;

  /* Named Radii */
  --radius-all: 3px;
  --radius-cards: 3px;
  --radius-badges: 3px;
  --radius-buttons: 3px;

  /* Surfaces */
  --surface-paper: #ffffff;
  --surface-ink-hairline: #2d2d2d;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-graphite: #2d2d2d;
  --color-ink: #000000;
  --color-paper: #ffffff;
  --color-fog: #878887;
  --color-periwinkle: #738ae5;

  /* Typography */
  --font-gillsansnova-book: 'GillSansNova-Book', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-gillsansnova-semibold: 'GillSansNova-SemiBold', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-yu-gothic: '游ゴシック体 (Yu Gothic)', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-cezannepro-db: 'CezannePro-DB', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-gillsansnova-medium: 'GillSansNova-Medium', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-body: 16px;
  --leading-body: 1.29;
  --tracking-body: 1.28px;
  --text-subheading: 18px;
  --leading-subheading: 1.25;
  --tracking-subheading: 1.44px;
  --text-heading-sm: 21px;
  --leading-heading-sm: 1.22;
  --tracking-heading-sm: 2.52px;
  --text-heading-lg: 28px;
  --leading-heading-lg: 1;
  --tracking-heading-lg: 2.24px;

  /* Spacing */
  --spacing-5: 5px;
  --spacing-10: 10px;
  --spacing-14: 14px;
  --spacing-16: 16px;
  --spacing-17: 17px;
  --spacing-19: 19px;
  --spacing-21: 21px;
  --spacing-22: 22px;
  --spacing-23: 23px;
  --spacing-27: 27px;
  --spacing-60: 60px;

  /* Border Radius */
  --radius-sm: 3px;
}
```
