# Compound — Style Reference
> ink-on-paper wealth journal — a quiet editorial system where one font at one weight does all the work, and the only color is the cream ribbon at the top of the page.

**Theme:** light

Compound operates on near-total chromatic silence: one typeface (Monument Grotesk) at a single weight of 400, a fully achromatic palette, and shadows so faint they register as atmosphere rather than depth. Surfaces are nearly invisible — a white canvas, #e5e7eb hairline borders, and 20px rounded cards — so hierarchy is carried entirely by dramatic size jumps (14px body climbing to 60–72px display) and generous whitespace. The only chromatic note in the system is a warm cream announcement bar (#ffe9bf) flush at the very top edge. Interactive elements are deliberately quiet: a single near-black pill button and ghost underlined text links that read as typeset words more than UI chrome. The product preview card — with its subtle four-layer drop shadow and 20px radius — is the one moment of visual thickness in the layout, the only thing the eye can actually grasp as an object.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Ink | `#171717` | `--color-ink` | Primary text, filled pill buttons, navigation emphasis, logo wordmark — the only dark anchor in an otherwise white system |
| Paper | `#ffffff` | `--color-paper` | Page canvas, card surfaces, product preview background — the default ground for all content |
| Graphite Hairline | `#e5e7eb` | `--color-graphite-hairline` | All structural borders, dividers, card edges, input borders — the most-used color in the system by frequency, defining every container |
| Vellum | `#f3f3f3` | `--color-vellum` | Secondary surface fills, subtle hover washes, tertiary panel background — the lightest gray still distinct from white |
| Slate | `#6f6f6f` | `--color-slate` | Secondary body text, metadata, icon strokes, tab labels — the primary muted text voice |
| Pewter | `#5e5e5e` | `--color-pewter` | Helper text, descriptive captions, micro-copy — darker than Slate for emphasized secondary text |
| Ash | `#a0a0a0` | `--color-ash` | Tertiary text, disabled link color, placeholder text — the quietest readable gray |
| Carbon | `#222222` | `--color-carbon` | SVG fill and stroke for icons, 3D graphic elements — nearly identical to Ink but reserved for decorative vector work |
| Stone | `#c7c7c7` | `--color-stone` | Decorative fills, gradient endpoints, subtle background washes — never used for text or borders |
| Cream Notice | `#ffe9bf` | `--color-cream-notice` | Announcement bar background, the single warm accent in the entire system — used only for the top promotional strip |

## Tokens — Typography

### Monument Grotesk — The sole typeface for everything from 12px captions to 72px display headlines. No bold, no italic, no light — a single weight does all expressive work. The dramatic size jump from 18px subheading directly to 36px heading creates a distinctive editorial scale where display type towers over body text. Tight line-heights at display sizes (1.00–1.11) let large type stack into near-solid blocks. · `--font-monument-grotesk`
- **Substitute:** Inter or General Sans as free alternatives; Söhne if licensed — all are geometric grotesks with similar x-height and neutrality
- **Weights:** 400
- **Sizes:** 12, 13, 14, 16, 18, 36, 48, 58, 60, 72
- **Line height:** 1.00 / 1.10 / 1.11 / 1.25 / 1.33 / 1.38 / 1.43 / 1.50 / 1.56 / 1.71
- **OpenType features:** `"kern"`
- **Role:** The sole typeface for everything from 12px captions to 72px display headlines. No bold, no italic, no light — a single weight does all expressive work. The dramatic size jump from 18px subheading directly to 36px heading creates a distinctive editorial scale where display type towers over body text. Tight line-heights at display sizes (1.00–1.11) let large type stack into near-solid blocks.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.5 | — | `--text-caption` |
| body-sm | 14px | 1.43 | — | `--text-body-sm` |
| body | 16px | 1.5 | — | `--text-body` |
| subheading | 18px | 1.38 | — | `--text-subheading` |
| heading-sm | 36px | 1.25 | — | `--text-heading-sm` |
| heading | 48px | 1.11 | — | `--text-heading` |
| heading-lg | 60px | 1.1 | — | `--text-heading-lg` |
| display | 72px | 1 | — | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 8px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 8 | 8px | `--spacing-8` |
| 16 | 16px | `--spacing-16` |
| 24 | 24px | `--spacing-24` |
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 56 | 56px | `--spacing-56` |
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |
| 112 | 112px | `--spacing-112` |
| 128 | 128px | `--spacing-128` |
| 160 | 160px | `--spacing-160` |
| 176 | 176px | `--spacing-176` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 20px |
| icons | 9999px |
| buttons | 9999px |
| list-items | 28px |
| large-cards | 24px |
| small-cards | 8px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| xl | `rgba(0, 0, 0, 0.01) 0px 128px 51px 0px, rgba(0, 0, 0, 0.0...` | `--shadow-xl` |
| xl-2 | `rgba(194, 194, 194, 0.01) 0px 168px 67px 0px, rgba(194, 1...` | `--shadow-xl-2` |
| xl-3 | `rgba(207, 207, 207, 0.01) 0px 132px 53px 0px, rgba(207, 2...` | `--shadow-xl-3` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 24px
- **Element gap:** 8px

## Components

### Announcement Bar
**Role:** Top-of-page promotional strip

Full-bleed #ffe9bf background, centered #171717 text at 12–14px Monument Grotesk, vertical padding 7–8px. Contains a text message and a pill-shaped 'Read more' button with #171717 background and white text. Sits flush against the viewport top edge with no border or shadow.

### Top Navigation
**Role:** Primary site navigation

White background, no border or shadow. Wordmark 'compound' in #171717 at 18–20px left-aligned. Centered nav links at 14px in #171717 with 20px horizontal gap. Right side: 'Sign in' text link and a filled pill button (#171717, white text, 9999px radius, 16px horizontal padding).

### Filled Pill Button
**Role:** Primary action trigger (e.g., 'Get started')

#171717 background, white text, Monument Grotesk 14px, 9999px border-radius, 16px horizontal padding, 8–9px vertical padding. No border, no shadow. The only filled button in the system.

### Ghost Text Link
**Role:** Inline navigation, secondary actions

No background, no border, #171717 text at 14px Monument Grotesk with 1px underline. Hover may darken to #000000. Used for nav items, footer links, and inline references.

### Product Preview Card
**Role:** Embedded dashboard screenshot in hero

White (#ffffff) surface, 20px border-radius, 1px #e5e7eb border, four-layer soft drop shadow (rgba(207,207,207, 0.01→0.1) at distances 8–132px). Contains a full dashboard UI mockup. The only element with visible elevation in the system.

### Feature Service Card
**Role:** Service category tile in feature row

Transparent or #f3f3f3 background, no border, 20px radius. Contains a small purple/icon indicator (visible in data as chromatic accent), a 14–16px label in #171717, and a 12–14px description in #6f6f6f. Arranged in a 4-column row.

### Publication Logo Card
**Role:** Press feature showcase

#f3f3f3 background, 20px radius, no border, no shadow. Contains a centered brand logo (Y Combinator, Axios, InvestmentNews) at grayscale. Arranged in a 3-column row with a left-aligned 'featured in' label.

### Section Divider
**Role:** Section transition with label

Thin 1px #e5e7eb horizontal line spanning the content width, with a centered 14px #6f6f6f label (e.g., 'Our approach') sitting on the line as a break in the stroke.

### Hero Display Headline
**Role:** Primary page headline

60–72px Monument Grotesk weight 400, #171717, line-height 1.00–1.10, centered. Single sentence broken across two lines, never more than 12–14 words total. No subtitle or eyebrow — the headline stands alone.

### Circular Icon Container
**Role:** Icon wrapper for UI indicators

9999px border-radius, 32–40px diameter, #f3f3f3 or white background, contains a 16–20px monochrome icon. Used for feature icons, tab indicators, and chart markers.

### Stats Metric Row
**Role:** Performance data display

Inline row with a 12px #6f6f6f label (e.g., 'Projected net worth 2029') above a 24–36px #171717 value (e.g., '$16.2M'). Change indicators use a small green up-arrow icon — the only place a non-grayscale chromatic accent appears in product UI.

## Do's and Don'ts

### Do
- Use only Monument Grotesk at weight 400 — never introduce bold, italic, or a second typeface
- Use 9999px border-radius for all buttons, tags, and icon containers
- Use 20px border-radius for all cards and content containers
- Use #e5e7eb for all borders and dividers — never darker than #dbdbdb
- Space sections with 80px vertical gaps to let the whitespace carry hierarchy
- Keep the palette strictly achromatic — the only color is #ffe9bf for the announcement bar
- Use four-layer soft shadows with 0.01–0.10 opacity for any elevated element

### Don't
- Never introduce a chromatic accent color outside the cream announcement bar
- Never use a typeface other than Monument Grotesk or add a second weight
- Never use sharp corners on cards or buttons — all corners are rounded
- Never use heavy or dark drop shadows — opacity must stay below 0.10
- Never use background colors other than #ffffff, #f3f3f3, or #ffe9bf for full surfaces
- Never reduce section gaps below 64px — the whitespace is the hierarchy
- Never add decorative borders, outlines, or colored strokes to text or headings

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Page Canvas | `#ffffff` | Default page background, the ground all content sits on |
| 1 | Vellum Surface | `#f3f3f3` | Secondary panels, publication logo cards, subtle hover fills |
| 2 | Graphite Edge | `#e5e7eb` | Borders and dividers — the structural line between surfaces |
| 3 | Stone Accent | `#c7c7c7` | Decorative vector fills, gradient endpoints, depth without weight |
| 4 | Cream Notice | `#ffe9bf` | Announcement bar — the single warm chromatic surface, always at the very top |

## Elevation

- **Product Preview Card:** `rgba(207, 207, 207, 0.01) 0px 132px 53px 0px, rgba(207, 207, 207, 0.05) 0px 74px 44px 0px, rgba(207, 207, 207, 0.09) 0px 33px 33px 0px, rgba(207, 207, 207, 0.1) 0px 8px 18px 0px`
- **Link hover lift:** `rgba(0, 0, 0, 0.01) 0px 128px 51px 0px, rgba(0, 0, 0, 0.02) 0px 72px 43px 0px, rgba(0, 0, 0, 0.03) 0px 32px 32px 0px, rgba(0, 0, 0, 0.04) 0px 8px 18px 0px`
- **List container:** `rgba(194, 194, 194, 0.01) 0px 168px 67px 0px, rgba(194, 194, 194, 0.05) 0px 94px 57px 0px, rgba(194, 194, 194, 0.09) 0px 42px 42px 0px, rgba(194, 194, 194, 0.1) 0px 10px 23px 0px`

## Imagery

Imagery is restrained and editorial. The signature visual is a large translucent gray 3D helix/ribbon form floating behind the hero text — rendered in #c7c7c7 to #8f8f8f gradients, it acts as atmospheric depth rather than a literal object. The only product imagery is the embedded dashboard UI screenshot framed in a Product Preview Card. Publication logos (Y Combinator, Axios, InvestmentNews) appear in grayscale on Vellum cards. There is no photography, no lifestyle imagery, no human figures — the system communicates through typography and the abstract 3D form alone.

## Layout

The page follows a centered, max-width-contained layout at ~1200px. The hero is a single centered display headline (60–72px) with no eyebrow or subheading, positioned over a large translucent 3D graphic. A Product Preview Card sits centered below the hero. Below the fold, a 4-column row of service cards spans the width, followed by a 3-column row of publication logos. Sections are separated by 80px vertical gaps or thin divider lines with centered labels. Navigation is a single clean bar — wordmark left, centered links, action button right. The overall rhythm is vertical-stack with generous breathing room; no sidebar, no asymmetric compositions, no overlapping content.

## Agent Prompt Guide

**Quick Color Reference**
- text: #171717
- background: #ffffff
- border: #e5e7eb
- accent: #ffe9bf (announcement bar only)
- secondary surface: #f3f3f3
- primary action: #171717 (filled action)

**Example Component Prompts**

1. **Hero Section**: White (#ffffff) background. Centered headline at 72px Monument Grotesk weight 400, #171717, line-height 1.00. A translucent gray 3D ribbon graphic in #c7c7c7 to #8f8f8f gradient floats behind the text. A Product Preview Card (white, 20px radius, 1px #e5e7eb border, four-layer soft shadow) sits centered below the headline showing a dashboard mockup.

2. **Feature Service Card Row**: Four cards in a row. Each card has a #f3f3f3 background, 20px radius, no border, 24px padding. Contains a 14px #171717 label and a 12px #6f6f6f description below it. 16px gap between cards. Section sits between two 80px vertical gaps.

3. **Filled Pill Button**: #171717 background, white text, Monument Grotesk 14px weight 400, 9999px border-radius, 16px horizontal padding, 8px vertical padding. No border, no shadow. Use this for the single primary action on any page.

4. **Section Divider**: 1px #e5e7eb horizontal line spanning the content width (~1200px). A centered 14px #6f6f6f label sits on the line, breaking the stroke. 64px vertical padding above and below.

5. **Announcement Bar**: Full-bleed #ffe9bf background strip at viewport top. Centered #171717 text at 14px Monument Grotesk with a small filled pill button (#171717, white text, 9999px radius, 8px vertical padding). 7px vertical padding. No border, no shadow, sits flush against the top edge.

## Similar Brands

- **Wealthfront** — Same achromatic palette with a single dark CTA and generous whitespace; both treat wealth management as a quiet editorial product
- **Mercury** — Identical single-weight grotesque typography, white-canvas minimalism, and pill-shaped dark buttons as the only interactive color
- **Public.com** — Monochrome investing interface that relies on type size and whitespace for hierarchy rather than accent colors
- **Modern Treasury** — Same editorial financial-publication aesthetic with centered max-width layout, hairline borders, and 20px card radii

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-ink: #171717;
  --color-paper: #ffffff;
  --color-graphite-hairline: #e5e7eb;
  --color-vellum: #f3f3f3;
  --color-slate: #6f6f6f;
  --color-pewter: #5e5e5e;
  --color-ash: #a0a0a0;
  --color-carbon: #222222;
  --color-stone: #c7c7c7;
  --color-cream-notice: #ffe9bf;

  /* Typography — Font Families */
  --font-monument-grotesk: 'Monument Grotesk', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --text-body-sm: 14px;
  --leading-body-sm: 1.43;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 18px;
  --leading-subheading: 1.38;
  --text-heading-sm: 36px;
  --leading-heading-sm: 1.25;
  --text-heading: 48px;
  --leading-heading: 1.11;
  --text-heading-lg: 60px;
  --leading-heading-lg: 1.1;
  --text-display: 72px;
  --leading-display: 1;

  /* Typography — Weights */
  --font-weight-regular: 400;

  /* Spacing */
  --spacing-unit: 8px;
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-112: 112px;
  --spacing-128: 128px;
  --spacing-160: 160px;
  --spacing-176: 176px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 24px;
  --element-gap: 8px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-xl: 14px;
  --radius-2xl: 20px;
  --radius-3xl: 24px;
  --radius-3xl-2: 28px;
  --radius-full: 9999px;

  /* Named Radii */
  --radius-cards: 20px;
  --radius-icons: 9999px;
  --radius-buttons: 9999px;
  --radius-list-items: 28px;
  --radius-large-cards: 24px;
  --radius-small-cards: 8px;

  /* Shadows */
  --shadow-xl: rgba(0, 0, 0, 0.01) 0px 128px 51px 0px, rgba(0, 0, 0, 0.02) 0px 72px 43px 0px, rgba(0, 0, 0, 0.03) 0px 32px 32px 0px, rgba(0, 0, 0, 0.04) 0px 8px 18px 0px;
  --shadow-xl-2: rgba(194, 194, 194, 0.01) 0px 168px 67px 0px, rgba(194, 194, 194, 0.05) 0px 94px 57px 0px, rgba(194, 194, 194, 0.09) 0px 42px 42px 0px, rgba(194, 194, 194, 0.1) 0px 10px 23px 0px;
  --shadow-xl-3: rgba(207, 207, 207, 0.01) 0px 132px 53px 0px, rgba(207, 207, 207, 0.05) 0px 74px 44px 0px, rgba(207, 207, 207, 0.09) 0px 33px 33px 0px, rgba(207, 207, 207, 0.1) 0px 8px 18px 0px;

  /* Surfaces */
  --surface-page-canvas: #ffffff;
  --surface-vellum-surface: #f3f3f3;
  --surface-graphite-edge: #e5e7eb;
  --surface-stone-accent: #c7c7c7;
  --surface-cream-notice: #ffe9bf;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-ink: #171717;
  --color-paper: #ffffff;
  --color-graphite-hairline: #e5e7eb;
  --color-vellum: #f3f3f3;
  --color-slate: #6f6f6f;
  --color-pewter: #5e5e5e;
  --color-ash: #a0a0a0;
  --color-carbon: #222222;
  --color-stone: #c7c7c7;
  --color-cream-notice: #ffe9bf;

  /* Typography */
  --font-monument-grotesk: 'Monument Grotesk', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --text-body-sm: 14px;
  --leading-body-sm: 1.43;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 18px;
  --leading-subheading: 1.38;
  --text-heading-sm: 36px;
  --leading-heading-sm: 1.25;
  --text-heading: 48px;
  --leading-heading: 1.11;
  --text-heading-lg: 60px;
  --leading-heading-lg: 1.1;
  --text-display: 72px;
  --leading-display: 1;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-112: 112px;
  --spacing-128: 128px;
  --spacing-160: 160px;
  --spacing-176: 176px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-xl: 14px;
  --radius-2xl: 20px;
  --radius-3xl: 24px;
  --radius-3xl-2: 28px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-xl: rgba(0, 0, 0, 0.01) 0px 128px 51px 0px, rgba(0, 0, 0, 0.02) 0px 72px 43px 0px, rgba(0, 0, 0, 0.03) 0px 32px 32px 0px, rgba(0, 0, 0, 0.04) 0px 8px 18px 0px;
  --shadow-xl-2: rgba(194, 194, 194, 0.01) 0px 168px 67px 0px, rgba(194, 194, 194, 0.05) 0px 94px 57px 0px, rgba(194, 194, 194, 0.09) 0px 42px 42px 0px, rgba(194, 194, 194, 0.1) 0px 10px 23px 0px;
  --shadow-xl-3: rgba(207, 207, 207, 0.01) 0px 132px 53px 0px, rgba(207, 207, 207, 0.05) 0px 74px 44px 0px, rgba(207, 207, 207, 0.09) 0px 33px 33px 0px, rgba(207, 207, 207, 0.1) 0px 8px 18px 0px;
}
```
