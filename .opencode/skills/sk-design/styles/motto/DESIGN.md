# Motto® — Style Reference
> Typographic monolith on paper — a single confident voice announcing itself on bone-white stock.

**Theme:** light

Motto® speaks in pure typographic voice: a light gray canvas, no chromatic accents, no shadows, and no decorative graphics — only two typefaces, generous whitespace, and the confidence to let a 154px headline carry an entire screen. Weight 500 is used everywhere; nothing is bold, nothing is light, so hierarchy comes from size, tracking, and whitespace rather than visual weight. Interaction is reduced to underlined text and pill-shaped controls (9999px radius), and the ® mark and asterisk-burst function as the only brand motifs. The result is a site that reads like an editorial spread rather than a product page — monochrome, declarative, and structurally disciplined.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Motto Ink | `#000000` | `--color-motto-ink` | Primary text, headlines, logo wordmark, borders, decorative marks — the only ink in the system |
| Soft Carbon | `#1b1b1c` | `--color-soft-carbon` | Supporting neutral for secondary UI, dividers, and muted labels. Do not promote it to the primary CTA color |
| Bone Paper | `#ffffff` | `--color-bone-paper` | Card surfaces, testimonial panels, text on dark fills, inverted nav state |
| Parchment | `#f2f2f2` | `--color-parchment` | Page canvas — the default background; sections sit on this without a card wrapper |
| Ash Rule | `#d8d8d8` | `--color-ash-rule` | Hairline dividers between sections, subtle separators, secondary surface |
| Slate | `#717476` | `--color-slate` | Body secondary text, helper copy, muted annotations |
| Graphite | `#4d5153` | `--color-graphite` | Body text on inverted or elevated surfaces, slightly stronger than Slate |
| Smoke | `#848484` | `--color-smoke` | Disabled nav items, list bullets, low-priority metadata, scroll cues |
| Fog Border | `#c8cacd` | `--color-fog-border` | Input field borders, form control edges |
| Pewter | `#666666` | `--color-pewter` | Tertiary text, footnote-level annotations |

## Tokens — Typography

### disp (custom display face) — Reserved exclusively for hero statements and display headlines. The display face operates at 61–154px with line-height locked near 1.0–1.1, so lines almost touch and the type forms a wall. Weight 500 here is anti-convention — most display faces use 700–900; this medium weight gives the headlines editorial gravity without the shouting, which is the signature move of the system. · `--font-disp-custom-display-face`
- **Substitute:** Bricolage Grotesque
- **Weights:** 500
- **Sizes:** 61px, 99px, 138px, 139px, 154px
- **Line height:** 1.00–1.10
- **Letter spacing:** normal
- **Role:** Reserved exclusively for hero statements and display headlines. The display face operates at 61–154px with line-height locked near 1.0–1.1, so lines almost touch and the type forms a wall. Weight 500 here is anti-convention — most display faces use 700–900; this medium weight gives the headlines editorial gravity without the shouting, which is the signature move of the system.

### sans (custom sans face) — Used for all body copy, navigation, buttons, labels, captions, card content, and footers. A single weight — 500 — runs through the entire secondary type system, so visual hierarchy comes from size and leading, never from bold or light. This creates an evenness that lets the display font dominate without competition. · `--font-sans-custom-sans-face`
- **Substitute:** Inter
- **Weights:** 500
- **Sizes:** 9px, 14px, 15px, 17px, 18px, 20px, 25px, 34px, 48px
- **Line height:** 1.14–1.60
- **Letter spacing:** normal
- **Role:** Used for all body copy, navigation, buttons, labels, captions, card content, and footers. A single weight — 500 — runs through the entire secondary type system, so visual hierarchy comes from size and leading, never from bold or light. This creates an evenness that lets the display font dominate without competition.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 14px | 1.4 | — | `--text-caption` |
| body-lg | 18px | 1.6 | — | `--text-body-lg` |
| subheading | 20px | 1.3 | — | `--text-subheading` |
| heading-sm | 25px | 1.3 | — | `--text-heading-sm` |
| heading | 34px | 1.26 | — | `--text-heading` |
| heading-lg | 48px | 1.14 | — | `--text-heading-lg` |
| display-sm | 61px | 1.1 | — | `--text-display-sm` |
| display | 99px | 1 | — | `--text-display` |
| display-lg | 154px | 1 | — | `--text-display-lg` |

## Tokens — Spacing & Shapes

**Density:** spacious

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 8 | 8px | `--spacing-8` |
| 15 | 15px | `--spacing-15` |
| 19 | 19px | `--spacing-19` |
| 21 | 21px | `--spacing-21` |
| 23 | 23px | `--spacing-23` |
| 24 | 24px | `--spacing-24` |
| 29 | 29px | `--spacing-29` |
| 38 | 38px | `--spacing-38` |
| 48 | 48px | `--spacing-48` |
| 58 | 58px | `--spacing-58` |
| 67 | 67px | `--spacing-67` |
| 70 | 70px | `--spacing-70` |
| 77 | 77px | `--spacing-77` |
| 96 | 96px | `--spacing-96` |
| 158 | 158px | `--spacing-158` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 9999px |
| cards | 0px |
| pills | 9999px |
| inputs | 0px |
| avatars | 9999px |
| buttons | 9999px |

### Layout

- **Page max-width:** 1280px
- **Section gap:** 77px
- **Card padding:** 29px
- **Element gap:** 19px

## Components

### Display Headline
**Role:** Hero and section-defining statements

Set in disp at 99–154px, weight 500, line-height 1.0–1.1. Color: Motto Ink (#000000). The ® mark and asterisk-burst symbol sit inline at the same size — they are typographic marks, not icons.

### Section Heading
**Role:** Mid-page section titles (e.g. 'PRAISE FROM CLIENTS')

Set in disp at 61–99px, weight 500, line-height 1.1. Color: Motto Ink. Left-aligned, no underline, no ornament.

### Pill Button (primary)
**Role:** Primary call-to-action

9999px border-radius. Fill: Soft Carbon (#1b1b1c). Text: Bone Paper (#ffffff), sans 500 at 15–17px. Padding: 19px horizontal, 15px vertical. No border, no shadow, no hover lift — color may shift to pure black on interaction.

### Pill Button (outlined/ghost)
**Role:** Secondary action

9999px border-radius. Fill: transparent. Border: 1px Motto Ink (#000000). Text: Motto Ink, sans 500 at 15–17px. Same padding as primary pill.

### Underlined Text Link
**Role:** In-content navigation (e.g. 'Work with us', 'Here's how we can help')

No color change from surrounding text — always Motto Ink. A 1px solid underline sits at the baseline. Font: sans 500 at 17–18px. This is the system's universal link treatment; the underline is the affordance, not the color.

### Top Navigation Bar
**Role:** Primary site navigation

Full-width, transparent over Parchment (#f2f2f2). Logo wordmark 'Motto®' left, nav items centered, 'Work with us' right — all in sans 500. Nav items are spaced ~38–70px apart. Inverted/scrolled state: items dim to Smoke (#848484) when inactive.

### Testimonial Card
**Role:** Client quote panel

Fill: Bone Paper (#ffffff), sitting on the Parchment canvas. No border, no shadow, no radius. Padding: ~29px on all sides. Layout: circular avatar (9999px) at top-left, name in sans 500, company in Slate (#717476) below, then quote in sans 500 body text. Cards are placed in a 3-column grid with ~23–24px gap.

### Avatar Circle
**Role:** Client or person identifier

9999px border-radius. Diameter ~34–48px. Fill: Ash Rule (#d8d8d8) or similar neutral. Single letter or initial centered in Motto Ink. No border.

### Service Tag Cluster
**Role:** Capability label groupings (e.g. 'BUSINESS STRATEGY • BRAND POSITIONING')

Sans 500 at 14–15px, uppercase, letters spaced slightly. Separators are bullet points (•) in Motto Ink. No background, no border — just typographic strings centered on the canvas.

### Hero Scroll Indicator
**Role:** Inviting the reader down the page

A simple downward arrow (↓) in Motto Ink, displayed at 34–48px. Paired with a small underlined text link ('(SCROLL)') in sans 500 in Smoke (#848484) on the right. Sits in the lower hero region.

### Asterisk Mark
**Role:** Decorative typographic punctuation

A six-pointed asterisk/burst character set inline with display text, at the same size. Functions as a visual exclamation, a logo sub-mark, and a brand signature.

### Registered Mark (®)
**Role:** Brand device woven into headlines and logo

A circled-R glyph at 25–30% of the surrounding display type size, set as a superscript after key words ('Motto®', 'IDEAS WORTH RALLYING AROUND®'). Drawn or rendered as a thin-stroked circle with an R inside — not the default typographic glyph. Functions as the system's only consistent brand emblem.

### Footer
**Role:** Page footer / dark surface

Fill: Soft Carbon (#1b1b1c) or Motto Ink (#000000). Text: Bone Paper, sans 500. Contains site links, legal copy, and the Motto® wordmark.

## Do's and Don'ts

### Do
- Use weight 500 — never 400, 600, 700, or 800 — for every typographic element in the system
- Set the display face at 99px or larger for hero statements; the system is designed to be read at architectural scale
- Use 9999px border-radius for every pill button, tag, and avatar — the system has exactly one radius for interactive elements
- Underline text links with a 1px Motto Ink rule — do not change link color to communicate affordance
- Place white cards directly on the Parchment (#f2f2f2) canvas with zero shadow and zero border — contrast is the elevation
- Pair the ® mark and the asterisk-burst with display headlines to create brand moments; they are type, not icons
- Use 19–24px for element gaps and 67–77px for section gaps to preserve the spacious editorial rhythm

### Don't
- Do not introduce any chromatic color — no blues, no greens, no reds; the system is intentionally monochrome
- Do not apply box-shadow to cards, buttons, or any component — the canvas/card contrast is the only depth device
- Do not use bold (700+) or light (300-) weights — the system is calibrated entirely to medium (500)
- Do not round card corners — cards, panels, and surfaces are square-edged; only pills get the 9999px radius
- Do not color text links differently from surrounding body text — the underline is the affordance, not the hue
- Do not set the display face below 61px — it loses its editorial presence and competes with the sans
- Do not use the ® mark or asterisk as a separate icon asset — they are typographic characters and must be set in type

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Parchment | `#f2f2f2` | Page canvas — the default light gray field every section sits on |
| 1 | Bone Paper | `#ffffff` | Card and testimonial surfaces — the only elevated layer in the system |
| 2 | Ash Rule | `#d8d8d8` | Secondary surface, dividers, rule lines |
| 3 | Soft Carbon | `#1b1b1c` | Inverted surface for footer and dark sections |

## Elevation

The system intentionally uses zero shadows. Cards are distinguished from the canvas by a white fill against the light gray background, not by elevation. This is a deliberate flatness — the discipline mirrors the editorial confidence of the typography: nothing decorative stands between the reader and the message.

## Imagery

The site is essentially imageless. There is no photography, no product imagery, no abstract graphics, no illustration. The only visual content is typography, the ® mark, the asterisk-burst glyph, and a single downward arrow. The strategy: let the display type and the canvas contrast carry every screen, with white-on-gray card panels introducing the only compositional rhythm.

## Layout

The page is full-width, running edge to edge on a Parchment canvas with no centered max-width container. The hero is a free-typographic statement: a massive display headline centered in the viewport, with a small body paragraph tucked at the upper-left and a scroll indicator at the lower-left. Sections flow in alternating left-aligned display headings and supporting body copy, separated by hairline rules. The testimonial grid is a 3-column card layout with white panels on the gray canvas. The footer is a full-bleed dark band. Vertical rhythm is generous — 67–77px between sections — creating an editorial-spread pacing rather than a product-page density.

## Agent Prompt Guide

Quick Color Reference
- Background: #f2f2f2 (Parchment canvas)
- Card surface: #ffffff (Bone Paper)
- Text: #000000 (Motto Ink)
- Muted text: #717476 (Slate) / #848484 (Smoke)
- Border: #d8d8d8 (Ash Rule) / #c8cacd (Fog Border)
- Inverted surface: #1b1b1c (Soft Carbon)
- primary action: no distinct CTA color

Example Component Prompts
1. Build a display headline block: canvas #f2f2f2, text in Bricolage Grotesque weight 500 at 120px, color #000000, line-height 1.0, centered. Add an inline ® superscript at 35% size with a 1px-stroked circle around an R, and a six-point asterisk glyph at the same size as a visual prefix.
No distinct primary action color was observed; use the extracted neutral button treatments instead of inventing a filled CTA color.
3. Build a testimonial card: fill #ffffff, padding 29px on all sides, no border, no shadow, sitting on a #f2f2f2 canvas. 40px circular avatar top-left (9999px radius, #d8d8d8 fill, black initial). Name in Inter 500 17px #000000, company below in Inter 500 15px #717476. Quote body in Inter 500 17px #000000 with 1.5 line-height.
4. Build a top navigation bar: full-width, transparent over #f2f2f2. Left: 'Motto®' wordmark in Inter 500 18px #000000. Center: nav items in Inter 500 15px #000000, spaced 60px apart. Right: 'Work with us' underlined link in Inter 500 15px #000000 with a 1px underline.
5. Build a text link inside a paragraph: Inter 500 17px #000000, with a 1px solid #000000 underline — do not change the text color from the surrounding body.

## Signature Devices

Two motifs are non-negotiable: (1) The registered trademark ® — drawn as a thin-stroked circle with a serif R, set as a superscript, appears after 'Motto' and after selected display phrases. (2) The asterisk-burst — a six-pointed star character, set inline with display text, functions as visual exclamation and brand signature. Both are set as type, never as image assets, and they belong in display-size contexts only.

## Similar Brands

- **Bureau Cool** — Same monochrome editorial approach — light gray canvas, massive serif/grotesque display headlines, pill buttons, zero color accents
- **Manual (manuallab.com)** — Same typographic-first agency site: display weight 500 headlines, underlined links, no shadows, editorial spacing
- **Pentagram** — Same monochrome restraint and confidence in letting oversized type do all the work; similar grid discipline
- **Guts & Glory** — Same flat-light, no-shadow aesthetic with pill buttons and typographic hero statements
- **DIA Studio** — Same editorial-spread pacing with black display type on near-white canvas and square-edged white card surfaces

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-motto-ink: #000000;
  --color-soft-carbon: #1b1b1c;
  --color-bone-paper: #ffffff;
  --color-parchment: #f2f2f2;
  --color-ash-rule: #d8d8d8;
  --color-slate: #717476;
  --color-graphite: #4d5153;
  --color-smoke: #848484;
  --color-fog-border: #c8cacd;
  --color-pewter: #666666;

  /* Typography — Font Families */
  --font-disp-custom-display-face: 'disp (custom display face)', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-sans-custom-sans-face: 'sans (custom sans face)', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.4;
  --text-body-lg: 18px;
  --leading-body-lg: 1.6;
  --text-subheading: 20px;
  --leading-subheading: 1.3;
  --text-heading-sm: 25px;
  --leading-heading-sm: 1.3;
  --text-heading: 34px;
  --leading-heading: 1.26;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.14;
  --text-display-sm: 61px;
  --leading-display-sm: 1.1;
  --text-display: 99px;
  --leading-display: 1;
  --text-display-lg: 154px;
  --leading-display-lg: 1;

  /* Typography — Weights */
  --font-weight-medium: 500;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-15: 15px;
  --spacing-19: 19px;
  --spacing-21: 21px;
  --spacing-23: 23px;
  --spacing-24: 24px;
  --spacing-29: 29px;
  --spacing-38: 38px;
  --spacing-48: 48px;
  --spacing-58: 58px;
  --spacing-67: 67px;
  --spacing-70: 70px;
  --spacing-77: 77px;
  --spacing-96: 96px;
  --spacing-158: 158px;

  /* Layout */
  --page-max-width: 1280px;
  --section-gap: 77px;
  --card-padding: 29px;
  --element-gap: 19px;

  /* Border Radius */
  --radius-lg: 8.64px;
  --radius-full: 9999px;

  /* Named Radii */
  --radius-tags: 9999px;
  --radius-cards: 0px;
  --radius-pills: 9999px;
  --radius-inputs: 0px;
  --radius-avatars: 9999px;
  --radius-buttons: 9999px;

  /* Surfaces */
  --surface-parchment: #f2f2f2;
  --surface-bone-paper: #ffffff;
  --surface-ash-rule: #d8d8d8;
  --surface-soft-carbon: #1b1b1c;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-motto-ink: #000000;
  --color-soft-carbon: #1b1b1c;
  --color-bone-paper: #ffffff;
  --color-parchment: #f2f2f2;
  --color-ash-rule: #d8d8d8;
  --color-slate: #717476;
  --color-graphite: #4d5153;
  --color-smoke: #848484;
  --color-fog-border: #c8cacd;
  --color-pewter: #666666;

  /* Typography */
  --font-disp-custom-display-face: 'disp (custom display face)', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-sans-custom-sans-face: 'sans (custom sans face)', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.4;
  --text-body-lg: 18px;
  --leading-body-lg: 1.6;
  --text-subheading: 20px;
  --leading-subheading: 1.3;
  --text-heading-sm: 25px;
  --leading-heading-sm: 1.3;
  --text-heading: 34px;
  --leading-heading: 1.26;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.14;
  --text-display-sm: 61px;
  --leading-display-sm: 1.1;
  --text-display: 99px;
  --leading-display: 1;
  --text-display-lg: 154px;
  --leading-display-lg: 1;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-15: 15px;
  --spacing-19: 19px;
  --spacing-21: 21px;
  --spacing-23: 23px;
  --spacing-24: 24px;
  --spacing-29: 29px;
  --spacing-38: 38px;
  --spacing-48: 48px;
  --spacing-58: 58px;
  --spacing-67: 67px;
  --spacing-70: 70px;
  --spacing-77: 77px;
  --spacing-96: 96px;
  --spacing-158: 158px;

  /* Border Radius */
  --radius-lg: 8.64px;
  --radius-full: 9999px;
}
```
