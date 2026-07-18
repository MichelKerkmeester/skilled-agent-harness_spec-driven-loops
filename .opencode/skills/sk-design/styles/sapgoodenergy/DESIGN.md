# SAPGOODENERGY — Style Reference
> marathon finish line in a cleanroom

**Theme:** light

SAP Good Energy operates on a brutalist split personality: a full-bleed race-day video hero crashes into a clinical white product stage where a single silver packet floats alone in negative space. The palette is essentially monochrome — warm white canvas, near-black ink, and one vivid orange that appears only as functional punctuation (a vertical side tab, isolated CTA fills). Typography pairs a compressed neo-grotesque display face with aggressive negative tracking for headlines against a precise utility sans for body and navigation copy, both set tight and never shouting. Components are almost invisible — the product IS the hero on white screens, the race atmosphere IS the hero above the fold, and almost everything in between is empty air with hairline rules.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Fuel Orange | `#ff7840` | `--color-fuel-orange` | Side tab accent, occasional filled action — a single warm orange against clinical white acts as the only chromatic signal in an otherwise achromatic system, reading as urgency without aggression |
| Ink Black | `#000000` | `--color-ink-black` | Primary text, filled CTA buttons, strongest borders — the hard stop in a system that otherwise lives in warm grays |
| Graphite | `#303030` | `--color-graphite` | Dominant text color, card and nav borders, icon strokes — softer than pure black for sustained reading while still reading as ink |
| Sterling | `#707070` | `--color-sterling` | Muted helper text, secondary headings, subdued borders |
| Silversmith | `#c0c0c0` | `--color-silversmith` | Quiet dividers, decorative heading borders |
| Bone | `#e7e7e7` | `--color-bone` | Card surfaces, soft fills, decorative icon backgrounds — the step between canvas and card |
| Lab White | `#fffffb` | `--color-lab-white` | Page canvas, the slightly warm white that makes the product photograph read as clinical rather than sterile |
| Pure White | `#ffffff` | `--color-pure-white` | Card surfaces, button fills, highlighted text — the cleanest tone, used where maximum contrast against graphite is needed |

## Tokens — Typography

### GT Pressura LC Standard — Workhorse for all utility, body, navigation, button, and small-headline copy. The slightly compressed, technical character set gives every label a clinical-instrument feel; sizes stay small (10–24px) and line-heights tight, reinforcing the system’s compact density. · `--font-gt-pressura-lc-standard`
- **Substitute:** Inter, IBM Plex Sans, or Söhne
- **Weights:** 400, 500, 600, 700
- **Sizes:** 10, 13, 14, 16, 24
- **Line height:** 1.00–1.60
- **Role:** Workhorse for all utility, body, navigation, button, and small-headline copy. The slightly compressed, technical character set gives every label a clinical-instrument feel; sizes stay small (10–24px) and line-heights tight, reinforcing the system’s compact density.

### Helvetica Neue LT Std — Display and section-heading face. Used at 30–56px with weight 800 and aggressive negative tracking (−0.04em to −0.05em) so headlines compress into a dense, race-bib-like slab. Weight 500 covers the few mid-size emphasis moments. The signature choice is using the heaviest weight with the tightest tracking to create visual density without raising size — authority through compression. · `--font-helvetica-neue-lt-std`
- **Substitute:** Helvetica Now Display Bold, Inter Tight, or Neue Haas Grotesk Display
- **Weights:** 500, 800
- **Sizes:** 14, 18, 30, 38, 53, 56
- **Line height:** 1.00–1.60
- **Letter spacing:** -0.05em at 53–56px, -0.04em at 30–38px
- **Role:** Display and section-heading face. Used at 30–56px with weight 800 and aggressive negative tracking (−0.04em to −0.05em) so headlines compress into a dense, race-bib-like slab. Weight 500 covers the few mid-size emphasis moments. The signature choice is using the heaviest weight with the tightest tracking to create visual density without raising size — authority through compression.

### GTStandard-M — GTStandard-M — detected in extracted data but not described by AI · `--font-gtstandard-m`
- **Weights:** 500
- **Sizes:** 14px
- **Line height:** 1.5
- **Role:** GTStandard-M — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 10px | 1.6 | — | `--text-caption` |
| heading-sm | 18px | 1.11 | -0.72px | `--text-heading-sm` |
| heading | 24px | 1.14 | — | `--text-heading` |
| heading-lg | 30px | 1 | -1.2px | `--text-heading-lg` |
| display | 53px | 1 | -2.65px | `--text-display` |
| display-xl | 56px | 1 | -2.8px | `--text-display-xl` |

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
| 76 | 76px | `--spacing-76` |
| 100 | 100px | `--spacing-100` |
| 116 | 116px | `--spacing-116` |
| 120 | 120px | `--spacing-120` |
| 160 | 160px | `--spacing-160` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 18px |
| links | 7px |
| inputs | 7px |
| buttons | 7px |
| smallInteractive | 14px |

### Layout

- **Page max-width:** 1440px
- **Section gap:** 100px
- **Card padding:** 20-24px
- **Element gap:** 4-8px

## Components

### Floating Side Promotion Tab
**Role:** Persistant vertical call-to-action

Fixed-position vertical tab pinned to the left edge, #ff7840 background, white GT Pressura 11–12px text rotated 90°. Reads as a ticket-stub or race bib clipped to the viewport — the only sustained splash of color in the system.

### Minimal Top Navigation
**Role:** Site navigation bar

White background, no border or shadow. Three entries — brand mark in parens, SHOP, WHY SAP — and a cart count (0) in the far right. GT Pressura 13–14px weight 500, uppercase or small-caps, black on white. Anchored top, no background fill, maximum air.

### Full-Bleed Race Hero
**Role:** Above-the-fold brand video/image

100vw video or still photograph of race conditions, overlaid with a massive 53–56px Helvetica Neue weight 800 headline at near-zero letter-spacing sitting above the viewport frame. The headline bleeds off the top edge so only its lower half is visible, creating a marquee-banner effect. No gradient, no overlay tint — the raw image carries all mood.

### Centered Floating Product Stage
**Role:** Product hero on white canvas

White (#fffffb) background with a single product packet (silver gel sachet) floating dead-center at slight rotation. No surface, no card, no shadow platform — the product is photographed against pure canvas and presented as a specimen. Heading at 24–30px Helvetica Neue weight 500 sits to the left in a tight 2–3 line stack.

### Filled Black CTA Button
**Role:** Primary purchase action

#000000 fill, white text, GT Pressura 13–14px weight 500–600 uppercase, 7px border-radius, 16px vertical × 24px horizontal padding. Hard rectangular silhouette. This is the conversion workhorse — 'BUY SAP 25G' style labels.

### Ghost Outline Button
**Role:** Secondary or supporting action

Transparent fill, 1px #000000 or #303030 border, 7px radius, 16px × 24px padding, same type spec as the filled variant. Used for less critical actions.

### Hero Overlay Close Button
**Role:** Dismiss the full-bleed video hero

Small circular or square 32px button in the upper-left of the hero, white or black background depending on image exposure, single 'X' glyph in 16px weight 500.

### Hero Corner Shop Pill
**Role:** Persistent shop shortcut over the video

White rounded pill in the bottom-right of the hero, black 'SHOP' label in GT Pressura 12–13px, 14px radius, light box-shadow for legibility over moving imagery.

### Hairline Section Divider
**Role:** Structural separator

1px line in #c0c0c0 or #e7e7e7 spanning the content column, used to separate sparse text blocks on white canvas sections.

### Distance Marker Badge
**Role:** Editorial KPI callout on hero imagery

Cyan-blue (#7DDFFA range) rectangular sign placed in the environment of the photograph (visible in race signage at '21 KM' mark). Functions as editorial rhythm, not a UI component, but the type treatment is Helvetica Neue weight 800 white on cyan at ~80px — a borrowed visual language from real marathon signage.

### Cart Count Indicator
**Role:** Header utility

Plain numeric '0' in GT Pressura 13px black, right-aligned in nav, no badge background or pill — treated as a label not a notification.

## Do's and Don'ts

### Do
- Use #ff7840 sparingly — reserve for the vertical side tab and isolated filled CTAs only; let it function as a single accent, not a brand coat of paint
- Set display headlines in Helvetica Neue weight 800 with −0.04em to −0.05em letter-spacing at 38–56px so the wordforms compress into a slab
- Use GT Pressura at 13–16px weight 500 for all body, button, and navigation copy — never above 24px for this face
- Give the product at least 100px of vertical breathing room above and below; the white canvas is part of the product
- Use 7px border-radius on every button, link, and input; 18px only on cards; 14px is reserved for small floating pills
- Lean on 1px hairline borders in #e7e7e7 or #c0c0c0 instead of shadows to separate content on the white canvas
- Let the hero video or photograph fill 100vw with no overlay tint, gradient, or vignette — the raw image does the work

### Don't
- Do not introduce additional accent colors — the 0% colorfulness is the system; one orange is the entire chromatic vocabulary
- Do not set body copy in Helvetica Neue — reserve that face for 30px+ display moments only
- Do not use shadows, glows, or elevated cards on the white product sections; rely on whitespace and hairline rules
- Do not exceed 7px radius on buttons or 18px on cards — the radii are tightly defined and misusing them breaks the geometric rhythm
- Do not center long-form paragraphs; left-align body copy in a 480–640px measure
- Do not use gradient fills on backgrounds, buttons, or images — the system is strictly flat
- Do not add decorative icons, illustrations, or emoji to the white product pages; the product and copy alone carry meaning

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Lab White Canvas | `#fffffb` | The slightly warm page background that frames all white-canvas product sections |
| 1 | Pure White Card | `#ffffff` | Card surfaces and button fills where maximum contrast against the canvas is needed |
| 2 | Bone Surface | `#e7e7e7` | Quiet secondary fills and decorative icon backgrounds, one step above the card |

## Elevation

The system intentionally avoids drop shadows. Separation comes from hairline 1px borders in #e7e7e7 or #c0c0c0 against the warm white canvas, plus generous negative space. The only allowed shadow is a soft offset on floating UI elements (like the hero SHOP pill) that need legibility over photographic imagery.

## Imagery

Hero photography and video are documentary race-day imagery — desaturated winter light, urban marathon settings, a lone runner, signage, barriers. No studio photography, no lifestyle, no models. On white-canvas sections, the only imagery is a single product packet photographed against seamless white with subtle environmental shadows, rotated slightly in the frame. The visual language is split: raw athletic chaos above the fold, clinical product isolation below.

## Agent Prompt Guide

**Quick Color Reference**
- text: #303030
- background: #fffffb
- surface/card: #ffffff
- border: #e7e7e7
- accent: #ff7840
- primary action: #ff7840 (filled action)

**Example Component Prompts**

1. Create a Primary Action Button: #ff7840 background, #000000 text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.

2. *Top navigation bar*: White background, no border, no shadow. Left: '( SAP )' in GT Pressura 14px weight 500, #303030. Center: 'SHOP' and 'WHY SAP' in same spec, separated by 240px gaps. Far right: cart count '0' in same spec. No background fill, no sticky offset, full viewport width.

3. *Full-bleed race hero*: 100vw × 100vh video element with autoplay, muted, loop, no overlay. Over it, a 53px Helvetica Neue weight 800 headline at letter-spacing -2.65px, positioned so only the bottom third of the letters is visible at the top edge, #303030 or white depending on exposure. Bottom-right floating pill: white #ffffff background, 14px radius, 'SHOP' in GT Pressura 12px weight 500 #000000, 16px 20px padding, soft 0 2px 8px rgba(0,0,0,0.15) shadow.

4. *Side promotion tab*: Fixed to left edge, vertically centered. #ff7840 background, full height of the visible area, 40px wide. White 'WANT 10 OFF FIRST ORDER?' text rotated 90°, GT Pressura 12px weight 600, letter-spacing 0.04em, 16px padding from each edge.

5. *Hairline section divider*: A single 1px line in #c0c0c0 spanning 100% of the 1440px max-width content column, with 64px vertical margin above and below. No label, no decoration — pure structural pause.

## Similar Brands

- **On Running** — Same split-personality approach — raw race-day imagery above the fold, clinical white product isolation below; single warm accent against monochrome
- **Huel** — Clinical white canvas with a single product floating center-stage and ultra-precise utility typography; the product is presented as a specimen, not a lifestyle object
- **Mast Brothers** — Dense negative tracking on display headlines, almost laboratory-clean product photography, and a single warm accent color used as punctuation rather than as coat-of-paint branding
- **Gymshark66** — Compressed neo-grotesque display type at extreme sizes with tight letter-spacing, paired with a quiet utilitarian body face for functional copy

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-fuel-orange: #ff7840;
  --color-ink-black: #000000;
  --color-graphite: #303030;
  --color-sterling: #707070;
  --color-silversmith: #c0c0c0;
  --color-bone: #e7e7e7;
  --color-lab-white: #fffffb;
  --color-pure-white: #ffffff;

  /* Typography — Font Families */
  --font-gt-pressura-lc-standard: 'GT Pressura LC Standard', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-helvetica-neue-lt-std: 'Helvetica Neue LT Std', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-gtstandard-m: 'GTStandard-M', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.6;
  --text-heading-sm: 18px;
  --leading-heading-sm: 1.11;
  --tracking-heading-sm: -0.72px;
  --text-heading: 24px;
  --leading-heading: 1.14;
  --text-heading-lg: 30px;
  --leading-heading-lg: 1;
  --tracking-heading-lg: -1.2px;
  --text-display: 53px;
  --leading-display: 1;
  --tracking-display: -2.65px;
  --text-display-xl: 56px;
  --leading-display-xl: 1;
  --tracking-display-xl: -2.8px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  --font-weight-extrabold: 800;

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
  --spacing-76: 76px;
  --spacing-100: 100px;
  --spacing-116: 116px;
  --spacing-120: 120px;
  --spacing-160: 160px;

  /* Layout */
  --page-max-width: 1440px;
  --section-gap: 100px;
  --card-padding: 20-24px;
  --element-gap: 4-8px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-md-2: 7px;
  --radius-xl: 14px;
  --radius-2xl: 18px;

  /* Named Radii */
  --radius-cards: 18px;
  --radius-links: 7px;
  --radius-inputs: 7px;
  --radius-buttons: 7px;
  --radius-smallinteractive: 14px;

  /* Surfaces */
  --surface-lab-white-canvas: #fffffb;
  --surface-pure-white-card: #ffffff;
  --surface-bone-surface: #e7e7e7;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-fuel-orange: #ff7840;
  --color-ink-black: #000000;
  --color-graphite: #303030;
  --color-sterling: #707070;
  --color-silversmith: #c0c0c0;
  --color-bone: #e7e7e7;
  --color-lab-white: #fffffb;
  --color-pure-white: #ffffff;

  /* Typography */
  --font-gt-pressura-lc-standard: 'GT Pressura LC Standard', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-helvetica-neue-lt-std: 'Helvetica Neue LT Std', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-gtstandard-m: 'GTStandard-M', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.6;
  --text-heading-sm: 18px;
  --leading-heading-sm: 1.11;
  --tracking-heading-sm: -0.72px;
  --text-heading: 24px;
  --leading-heading: 1.14;
  --text-heading-lg: 30px;
  --leading-heading-lg: 1;
  --tracking-heading-lg: -1.2px;
  --text-display: 53px;
  --leading-display: 1;
  --tracking-display: -2.65px;
  --text-display-xl: 56px;
  --leading-display-xl: 1;
  --tracking-display-xl: -2.8px;

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
  --spacing-76: 76px;
  --spacing-100: 100px;
  --spacing-116: 116px;
  --spacing-120: 120px;
  --spacing-160: 160px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-md-2: 7px;
  --radius-xl: 14px;
  --radius-2xl: 18px;
}
```
