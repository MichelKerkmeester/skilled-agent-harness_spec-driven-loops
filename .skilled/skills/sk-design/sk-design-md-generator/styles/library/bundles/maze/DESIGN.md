# Maze — Style Reference
> Editorial research journal — warm bone paper, serif ink, chartreuse highlighter

**Theme:** light

Maze operates as an editorial research workspace: a warm cream canvas (#f5f4f0) that behaves like off-white paper rather than cold digital white, paired with Phonic — a sharp humanist serif set aggressively tight at large sizes. The interface is overwhelmingly monochromatic (near-black ink on warm bone), with a single chartreuse accent (#dbf570) that functions as highlighter rather than decoration. Screens are calm, generous, and content-led: product surfaces (report cards, study cards, video tiles) sit flat on the canvas with 8–16px radii and hairline borders, never floating on heavy shadow stacks. Sections break rhythm with full-bleed color washes (lavender, lime) and a large pixel-globe motif that signals research-at-scale. Buttons are quiet — either a dark filled rectangle or a thin outlined ghost — never glossy. The overall language is closer to a research journal than a SaaS dashboard.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Bone | `#f5f4f0` | `--color-bone` | Page canvas, footer, secondary button fills — warm off-white replaces cold digital white, giving every screen a paper-like base |
| Paper | `#ffffff` | `--color-paper` | Card surfaces, elevated panels, input fields — the bright layer above bone |
| Ink | `#1c1c1c` | `--color-ink` | Primary text, dark filled buttons, heading color — the default ink, warm near-black rather than #000 |
| Charcoal | `#000000` | `--color-charcoal` | Hairline borders, icon strokes, the announcement bar — the thinnest line work |
| Fossil | `#706f6c` | `--color-fossil` | Secondary text, muted borders, body annotations |
| Pebble | `#9e9b94` | `--color-pebble` | Input field borders, disabled controls |
| Smoke | `#3c3c3c` | `--color-smoke` | Body annotations, meta labels |
| Sand | `#eae6e1` | `--color-sand` | Active tab background, subtle surface lift, button hover on bone |
| Ash | `#d2cec6` | `--color-ash` | Hairline dividers, footer borders, low-contrast separators |
| Chartreuse | `#dbf570` | `--color-chartreuse` | Highlight badges, study tags, the globe motif, card accent fills — the only chromatic note in the system, used sparingly to draw the eye to research signals |
| Olive | `#4b5b0a` | `--color-olive` | Decorative border accent, chromatic link underline — the only deep color, appears in the olive outline treatments and the heading underline on the hero |

## Tokens — Typography

### ui-sans-serif — ui-sans-serif — detected in extracted data but not described by AI · `--font-ui-sans-serif`
- **Weights:** 400
- **Sizes:** 16px
- **Line height:** 1.5
- **Role:** ui-sans-serif — detected in extracted data but not described by AI

### Phonic — Display, headings, body — the brand's signature humanist serif set aggressively tight at large sizes (–0.09em at 130px down to +0.03em at 12px). Weight 300 dominates for display, 400 for body. The custom typeface carries the editorial voice; weight 300 at 130px is the signature move — most brands use 600–700 here, Maze whispers in a light serif to claim authority through restraint. · `--font-phonic`
- **Substitute:** GT Sectra Display (for display), Tiempos Text (for body), or Söhne Breit as a sans-serif fallback if a serif is unavailable
- **Weights:** 300, 400
- **Sizes:** 12, 14, 15, 17, 22, 28, 46, 58, 90, 130
- **Line height:** 1.00–1.41
- **Letter spacing:** –11.7px at 130px, –6.3px at 90px, –3.48px at 58px, –2.3px at 46px, –1.12px at 28px, –0.66px at 22px, –0.34px at 17px, –0.15px at 15px, +0.36px at 12px
- **OpenType features:** `"kern" 1, "liga" 1, "calt" 1, "ss01" 1 (if available), "onum" 0`
- **Role:** Display, headings, body — the brand's signature humanist serif set aggressively tight at large sizes (–0.09em at 130px down to +0.03em at 12px). Weight 300 dominates for display, 400 for body. The custom typeface carries the editorial voice; weight 300 at 130px is the signature move — most brands use 600–700 here, Maze whispers in a light serif to claim authority through restraint.

### System UI Sans — Secondary UI text, fallback for browser contexts — only used sparingly; Phonic carries the brand · `--font-system-ui-sans`
- **Substitute:** Inter, Söhne, or system-ui
- **Weights:** 400
- **Sizes:** 16
- **Line height:** 1.50
- **Role:** Secondary UI text, fallback for browser contexts — only used sparingly; Phonic carries the brand

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.3 | 0.36px | `--text-caption` |
| body-sm | 14px | 1.4 | -0.14px | `--text-body-sm` |
| heading-sm | 22px | 1.15 | -0.66px | `--text-heading-sm` |
| heading | 28px | 1.1 | -1.12px | `--text-heading` |
| heading-lg | 46px | 1.1 | -2.3px | `--text-heading-lg` |
| display | 58px | 1.05 | -3.48px | `--text-display` |
| display-lg | 90px | 1 | -6.3px | `--text-display-lg` |
| hero | 130px | 1 | -11.7px | `--text-hero` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** comfortable

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
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |
| 112 | 112px | `--spacing-112` |
| 120 | 120px | `--spacing-120` |
| 208 | 208px | `--spacing-208` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 12px |
| badges | 4px |
| inputs | 8px |
| buttons | 8px |
| largeCards | 16px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 24px
- **Element gap:** 8px

## Components

### Announcement Bar
**Role:** Top-of-page notification strip

Full-bleed Charcoal (#000000) bar, white Phonic 14px / 400 text, centered, with right-aligned close ×. Height ~40px, used for product news or report launches.

### Top Navigation
**Role:** Primary site navigation

Bone (#f5f4f0) background, Phonic wordmark at 22px weight 300 in Ink. Nav links in Phonic 15px / 400. Right cluster: 'Log in' text link, 'Try Maze for free' outlined pill, 'Contact sales' filled Ink button. Sticky on scroll.

### Filled Dark Button
**Role:** Primary action

Ink (#1c1c1c) background, Paper (#ffffff) text, Phonic 15px / 400, 8px radius, 12px vertical × 20px horizontal padding. No shadow, no gradient. The default conversion CTA.

### Outlined Ghost Button
**Role:** Secondary action

Transparent background, 1px Ink (#1c1c1c) border, Ink text, Phonic 15px / 400, 8px radius, 12px × 20px padding. Pairs beside the filled dark button in the hero.

### Hero Headline Block
**Role:** Above-the-fold page opening

Two-column on desktop: left holds Phonic 90px / weight 300 headline in Ink with –6.3px tracking, sub-paragraph at 17px / 400 in Fossil, CTA cluster below; right holds a staggered collage of product surface cards. Headline sets the line-height tight at 1.00 so the letters almost touch.

### Report Preview Card
**Role:** Featured product surface card

Paper (#ffffff) background, 8px radius, no shadow. Header label 'Report Preview' in Phonic 12px / 400 Fossil. Body contains a Chartreuse (#dbf570) hero image block with 8px top radius, 16px internal padding, 22px Phonic bold label, and a right-aligned stat column (Responses, No. of themes).

### Unmoderated Study Card
**Role:** Study result card with rating

Paper background, 12px radius. Chartreuse tag pill at top-left with Phonic 12px / 400 Ink text. Question block in Phonic 17px / 400 Ink, 4-star rating in Chartreuse fill. 'Enormity satisfied' label in Fossil 14px.

### Video Interview Card
**Role:** Moderated study video tile

Paper background, 12px radius. Video thumbnail fills the card with bottom caption strip. White play button circle centered on the thumbnail. Phonic 12px tag above, 14px caption below.

### Section Headline Overlay
**Role:** Mid-page editorial section break

Centered Phonic 46–58px / 300 Ink headline layered directly over a large Chartreuse pixel-globe illustration. Tracking –2.3 to –3.48px. Sub-paragraph in Fossil 17px sits beneath. No background panel — the chartreuse IS the background.

### Tab Navigation
**Role:** Segment control

Three tabs (Recruit, Research, Analyze) in Phonic 46px / 300 Ink. Active tab sits on a Sand (#eae6e1) background pill with 8px radius, inactive tabs are transparent. The active fill is bone-on-bone, not a chromatic accent — the system stays quiet even on the tabs.

### Menu List Panel
**Role:** Recruitment category list

Sits on a Lavender (#b8a3ff) full-bleed background. The panel itself is Paper white, 12px radius, internal row list. Each row: small square icon, Phonic 15px / 400 Ink label, right-chevron. 1px divider between rows in #eae6e1.

### Pixel Globe Illustration
**Role:** Brand motif, section break

Large circle (~600px diameter) in Chartreuse (#dbf570) rendered as a dot-matrix grid, forming a globe silhouette. Used as a full-bleed visual behind section headlines — the only decorative motif of scale in the system.

### Scroll Cue
**Role:** Scroll-to-continue prompt

Small pill at page bottom: 'Scroll to continue' in Phonic 14px / 400 Ink, bordered 8px radius, paired with a down-chevron.

### Study Tag Badge
**Role:** Category / status badge

Chartreuse (#dbf570) background, Ink text, Phonic 12px / 400, 4px radius, 4px × 8px padding. Marks study type cards.

## Do's and Don'ts

### Do
- Use Phonic at weight 300 for every display and headline; weight 400 for body and UI only
- Default to a 12px radius on cards, 8px on buttons, 4px on badges — the radius scale is narrow and intentional
- Use #f5f4f0 (Bone) as the page canvas; reserve #ffffff for cards and inputs that need to lift off the canvas
- Let Chartreuse (#dbf570) appear as small functional punctuation — one badge, one tag, one globe — never as a wide wash of UI color
- Track headlines aggressively tight: –6.3px at 90px, scaling proportionally so letters almost touch at the largest sizes
- Keep buttons quiet: Ink-filled or Ink-outlined, 8px radius, 12px × 20px padding, no shadow, no gradient
- Use Lavender (#b8a3ff) full-bleed for section breaks to create contrast against the bone canvas

### Don't
- Do not use sans-serif for headlines — Phonic serif at weight 300 IS the brand voice; substituting bold sans-serif destroys the editorial register
- Do not apply heavy box-shadows to cards — the system is intentionally flat, elevation is a hairlines-only discipline
- Do not use Chartreuse as a CTA background — it is a highlight color for tags and motifs, not an action color; Ink stays the action
- Do not set display text at line-height 1.4+ — headlines run tight (1.00–1.10) so the serif rhythm stays architectural
- Do not introduce new chromatic colors beyond the three in the palette (Chartreuse, Olive, Lavender) — every additional hue dilutes the bone-paper system
- Do not use #000000 as body text — Ink (#1c1c1c) is the text color; #000 is reserved for the announcement bar and hairline borders
- Do not center body paragraphs in cards — only section headlines and hero copy may center; study card copy stays left-aligned

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Bone Canvas | `#f5f4f0` | Page background — warm off-white paper base |
| 1 | Paper Card | `#ffffff` | Report cards, study cards, menu panels — the standard elevated surface |
| 2 | Sand Lift | `#eae6e1` | Active tab, subtle highlight wash on bone |
| 3 | Chartreuse Accent | `#dbf570` | Study tags, globe illustration, highlight cards |
| 4 | Ink Surface | `#1c1c1c` | Dark filled buttons, dark announcement bar |

## Elevation

- **Cards:** `none — flat on canvas, defined by surface color and 1px border only`
- **Buttons:** `none — no shadow on filled or ghost states`
- **Dropdown panels:** `0 1px 2px rgba(0,0,0,0.04) — the closest the system gets to elevation, used only on floating menu panels`

## Imagery

Imagery is product-surface-first: real UI cards (report previews, study results, video tiles) are photographed/screenshot as the hero visual, not stock photography. The sole decorative motif is the Chartreuse pixel-globe — a large dot-matrix circle that reads as both a research-at-scale metaphor and a color block. Photography, when present (study participant thumbnails), is warm-lit, candid, cropped tight to faces, never full-body lifestyle. Iconography is square monoline, set in Ink with no fill — functional, never decorative. The system leans heavily on typography to carry the visual weight, treating illustrations and icons as supporting cast.

## Agent Prompt Guide

QUICK COLOR REFERENCE
- Canvas: #f5f4f0 (Bone)
- Card surface: #ffffff (Paper)
- Primary text: #1c1c1c (Ink)
- Hairline border: #000000 (Charcoal)
- Muted text: #706f6c (Fossil)
- Accent: #dbf570 (Chartreuse)
- primary action: #1c1c1c (filled action)

EXAMPLE COMPONENT PROMPTS
1. Create a Primary Action Button: #1c1c1c background, #ffffff text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.
2. REPORT PREVIEW CARD — White (#ffffff) surface, 8px radius, no shadow. Header label 'Report Preview' in Phonic 12px / 400 / #706f6c. Chartreuse (#dbf570) image block filling top half with 8px top radius. Body in Phonic 17px / 400 / #1c1c1c with a right-aligned stat column in #706f6c.
3. TAB SEGMENT CONTROL — Three Phonic 46px / 300 labels in #1c1c1c. Active tab on a #eae6e1 pill background with 8px radius and 12px 20px padding. Inactive tabs transparent. 16px gap between tabs.
4. STUDY TAG BADGE — Chartreuse (#dbf570) background, #1c1c1c text, Phonic 12px / 400, 4px radius, 4px 8px padding. Sits at top-left of study cards.
5. PIXEL GLOBE SECTION BREAK — Full-bleed #dbf570 background, centered Phonic 58px / 300 / #1c1c1c headline with letter-spacing –3.48px layered over a 600px dot-matrix globe illustration. Sub-paragraph in Phonic 17px / 400 / #706f6c below the headline.

## Motion Philosophy

Motion is minimal and structural: fade-and-rise on scroll (~200ms ease-out, 8–12px translate) for cards entering the viewport, and an underline grow on nav link hover (left-to-right, 150ms). No parallax, no scroll-jacking, no decorative animation. The chartreuse globe and lavender washes are static — the system trusts typography and color to do the work.

## Similar Brands

- **Linear** — Both use a warm near-white canvas instead of cold #fff, both rely on a single monochromatic type voice, both keep accent color to a single hue used as functional punctuation
- **Vercel** — Same editorial restraint: tight-tracked display type, flat surfaces, hairline-only borders, a single chromatic accent reserved for high-signal moments
- **Notion** — Shared warm off-white canvas (#f7f6f3 family), paper-like card surfaces, and quiet ink-on-bone typographic system rather than stark white-on-black SaaS convention
- **Arc** — Both break the standard SaaS palette with warm neutrals and a single vivid accent (Arc's orange, Maze's chartreuse) used as identity rather than action color

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-bone: #f5f4f0;
  --color-paper: #ffffff;
  --color-ink: #1c1c1c;
  --color-charcoal: #000000;
  --color-fossil: #706f6c;
  --color-pebble: #9e9b94;
  --color-smoke: #3c3c3c;
  --color-sand: #eae6e1;
  --color-ash: #d2cec6;
  --color-chartreuse: #dbf570;
  --color-olive: #4b5b0a;

  /* Typography — Font Families */
  --font-ui-sans-serif: 'ui-sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-phonic: 'Phonic', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-system-ui-sans: 'System UI Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.3;
  --tracking-caption: 0.36px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.4;
  --tracking-body-sm: -0.14px;
  --text-heading-sm: 22px;
  --leading-heading-sm: 1.15;
  --tracking-heading-sm: -0.66px;
  --text-heading: 28px;
  --leading-heading: 1.1;
  --tracking-heading: -1.12px;
  --text-heading-lg: 46px;
  --leading-heading-lg: 1.1;
  --tracking-heading-lg: -2.3px;
  --text-display: 58px;
  --leading-display: 1.05;
  --tracking-display: -3.48px;
  --text-display-lg: 90px;
  --leading-display-lg: 1;
  --tracking-display-lg: -6.3px;
  --text-hero: 130px;
  --leading-hero: 1;
  --tracking-hero: -11.7px;

  /* Typography — Weights */
  --font-weight-light: 300;
  --font-weight-regular: 400;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-112: 112px;
  --spacing-120: 120px;
  --spacing-208: 208px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 24px;
  --element-gap: 8px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;

  /* Named Radii */
  --radius-cards: 12px;
  --radius-badges: 4px;
  --radius-inputs: 8px;
  --radius-buttons: 8px;
  --radius-largecards: 16px;

  /* Surfaces */
  --surface-bone-canvas: #f5f4f0;
  --surface-paper-card: #ffffff;
  --surface-sand-lift: #eae6e1;
  --surface-chartreuse-accent: #dbf570;
  --surface-ink-surface: #1c1c1c;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-bone: #f5f4f0;
  --color-paper: #ffffff;
  --color-ink: #1c1c1c;
  --color-charcoal: #000000;
  --color-fossil: #706f6c;
  --color-pebble: #9e9b94;
  --color-smoke: #3c3c3c;
  --color-sand: #eae6e1;
  --color-ash: #d2cec6;
  --color-chartreuse: #dbf570;
  --color-olive: #4b5b0a;

  /* Typography */
  --font-ui-sans-serif: 'ui-sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-phonic: 'Phonic', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-system-ui-sans: 'System UI Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.3;
  --tracking-caption: 0.36px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.4;
  --tracking-body-sm: -0.14px;
  --text-heading-sm: 22px;
  --leading-heading-sm: 1.15;
  --tracking-heading-sm: -0.66px;
  --text-heading: 28px;
  --leading-heading: 1.1;
  --tracking-heading: -1.12px;
  --text-heading-lg: 46px;
  --leading-heading-lg: 1.1;
  --tracking-heading-lg: -2.3px;
  --text-display: 58px;
  --leading-display: 1.05;
  --tracking-display: -3.48px;
  --text-display-lg: 90px;
  --leading-display-lg: 1;
  --tracking-display-lg: -6.3px;
  --text-hero: 130px;
  --leading-hero: 1;
  --tracking-hero: -11.7px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-112: 112px;
  --spacing-120: 120px;
  --spacing-208: 208px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
}
```
