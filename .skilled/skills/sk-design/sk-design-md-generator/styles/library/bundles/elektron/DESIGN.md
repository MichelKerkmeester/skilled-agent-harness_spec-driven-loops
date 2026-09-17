# Elektron — Style Reference
> Hardware control panel at midnight — a near-black canvas where product photography glows and the interface stays almost invisible.

**Theme:** dark

Elektron's interface is essentially a darkroom for showcasing hardware: a #222222 canvas with #151515 surfaces and #eeeef2 type, where the product photography — cinematic, near-black close-ups of synthesizers with blue LCD glow — does all the emotional work. The UI itself is brutally compact (4px base unit, 7px input radius, 0px everywhere else) and refuses every soft modern signal: no gradients, no shadows, no rounded buttons, no colored accents in chrome. Typography is a single custom geometric grotesque (Neue Haas Grotesk) in weight 400 only for body, with a display cut at 450/500 for headlines; a secondary dot-matrix face echoes the LCD readouts on the products themselves. All body text carries positive tracking (0.013–0.042em) that reads as industrial specification-sheet rather than marketing. The whole system feels like the printed silkscreen on a Eurorack module: monochrome, functional, hardware-obsessed.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Page Canvas | `#222222` | `--color-page-canvas` | Page background, full-bleed canvas behind all product imagery and content bands |
| Deep Surface | `#151515` | `--color-deep-surface` | Dark supporting neutral for text, icons, and strong contrast. Do not promote it to the primary CTA color |
| Void | `#000000` | `--color-void` | Deepest layer — button cores, icon fills, the negative space inside navigation controls |
| Platinum | `#eeeef2` | `--color-platinum` | Primary text, icons, link body, badges, footer text — the only light-on-dark workhorse |
| Pure White | `#ffffff` | `--color-pure-white` | Selected link states, rare icon contrast points on dark surfaces |
| Iron | `#333337` | `--color-iron` | Input field surface — one subtle step above canvas for form wells |
| Ash | `#b4b4b8` | `--color-ash` | Input placeholder and helper text — low-contrast gray on the dark input field |

## Tokens — Typography

### Neue Haas Grotesk Text Pro — Body, navigation, labels, product names, mid-size headings — the workhorse text face used in 95% of the UI · `--font-neue-haas-grotesk-text-pro`
- **Substitute:** Inter, Helvetica Neue, Neue Haas Grotesk (free tier), or Suisse Int'l
- **Weights:** 400
- **Sizes:** 11px, 14px, 16px, 18px, 28px, 35px
- **Line height:** 1.20, 1.50
- **Letter spacing:** 0.013em to 0.042em (positive tracking throughout — 0.042em at 11px caption, ~0.04em at 14px, ~0.033em at 16px, tapering to 0.013–0.017em at 28–35px)
- **Role:** Body, navigation, labels, product names, mid-size headings — the workhorse text face used in 95% of the UI

### Neue Haas Grotesk Display Pro — Display headlines and section titles — 64px for hero statements, 31px for section headings, 24px for emphasized links/labels; the 450 weight is the headline sweet spot between Helvetica Regular and Medium · `--font-neue-haas-grotesk-display-pro`
- **Substitute:** Neue Haas Grotesk Display, Inter Display, or Suisse Int'l Medium
- **Weights:** 400, 450, 500
- **Sizes:** 24px, 31px, 64px
- **Line height:** 0.95, 1.33, 1.50
- **Letter spacing:** -0.01em at 64px display; 0.04em at 24–31px (uppercase utility labels)
- **Role:** Display headlines and section titles — 64px for hero statements, 31px for section headings, 24px for emphasized links/labels; the 450 weight is the headline sweet spot between Helvetica Regular and Medium

### digi one v2 — Decorative dot-matrix accent — echoes the LCD readouts on Elektron hardware, used for tag labels and technical micro-copy; do not over-deploy, it's a signature flourish, not a workhorse · `--font-digi-one-v2`
- **Substitute:** Dot-Matrix (Google Fonts), or VT323 for the LCD effect
- **Weights:** 400
- **Sizes:** 14px
- **Line height:** 1.50
- **Letter spacing:** 0.033em
- **Role:** Decorative dot-matrix accent — echoes the LCD readouts on Elektron hardware, used for tag labels and technical micro-copy; do not over-deploy, it's a signature flourish, not a workhorse

### NHaasGroteskDSPro — Button and input labels — same family as the display face, used for control text only · `--font-nhaasgroteskdspro`
- **Substitute:** Neue Haas Grotesk Display Pro, Inter
- **Weights:** 400
- **Sizes:** 16px
- **Line height:** 1.00, 1.20
- **Letter spacing:** normal
- **Role:** Button and input labels — same family as the display face, used for control text only

### Analog One V2. — Analog One V2. — detected in extracted data but not described by AI · `--font-analog-one-v2`
- **Weights:** 400
- **Sizes:** 14px
- **Line height:** 1.25
- **Role:** Analog One V2. — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 11px | 1.5 | 0.46px | `--text-caption` |
| body-sm | 14px | 1.5 | 0.56px | `--text-body-sm` |
| body | 16px | 1.2 | 0.42px | `--text-body` |
| subheading | 18px | 1.5 | 0.31px | `--text-subheading` |
| heading-sm | 24px | 1.33 | 0.96px | `--text-heading-sm` |
| heading | 31px | 1.5 | 1.24px | `--text-heading` |
| heading-lg | 35px | 1.2 | 0.46px | `--text-heading-lg` |
| display | 64px | 0.95 | -0.64px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** compact

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 12 | 12px | `--spacing-12` |
| 16 | 16px | `--spacing-16` |
| 28 | 28px | `--spacing-28` |
| 60 | 60px | `--spacing-60` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 0px |
| cards | 0px |
| icons | 0px |
| inputs | 7px |
| buttons | 0px |

### Layout

- **Page max-width:** 1280px
- **Section gap:** 56-80px
- **Card padding:** 21px
- **Element gap:** 4-7px

## Components

### Top Navigation Bar
**Role:** Site-wide header

Full-bleed #222222 bar, ~64px tall, with left cluster (Catalog, Shop, Search), centered brand mark (small monochrome Elektron 'E' logo), and right cluster (Support, Account, Cart). Links in #eeeef2 at 14px Neue Haas Grotesk Text Pro weight 400 with 0.04em tracking; icons inline with labels. No background fill, no border — sits flush with the canvas.

### Outlined Ghost Button
**Role:** Primary call-to-action (FIND OUT MORE, DOWNLOAD, etc.)

1px solid #eeeef2 border, transparent fill, 0px radius, 11-14px horizontal padding, 7-11px vertical padding. Label in 16px NHaasGroteskDSPro / Neue Haas Grotesk Display Pro weight 400, all-caps, 0.04em tracking, #eeeef2. Square corners reinforce the industrial spec-sheet feel. No hover fill — invert to #eeeef2 background with #222222 text on interaction.

### Filled Dark Button
**Role:** Secondary action

0px radius, #000000 or #151515 background, #eeeef2 label, 1px solid #eeeef2 or transparent border. Used for compact icon-tile controls (account, cart, support) in the nav bar — roughly 32-40px square, icon centered.

### Product Carousel Card
**Role:** Accessory/merchandise display

#151515 background or transparent over #222222, 0px radius, product image flush at top (~280px tall), product name in 14-16px Neue Haas Grotesk Text Pro weight 400 #eeeef2 below at 21px padding. No border, no shadow. Optional left/right arrow overlays in #151515 with #eeeef2 chevron.

### Carousel Navigation Arrow
**Role:** Slider control

Square 40-48px button, #151515 background or #222222 with 1px #eeeef2 border, centered chevron icon in #eeeef2. 0px radius. Sits at vertical center of the product grid row.

### Hero Product Image
**Role:** Full-bleed product photography

Edge-to-edge cinematic product shot — no padding, no border, no caption overlay. Images are dark, high-contrast, blue-tinted (LCD glow), 16:9 or wider aspect. The photograph IS the hero; no headline, no button stack overlay.

### Version Release Banner
**Role:** Firmware/software update announcement

Two-part layout: top utility bar in #222222 with 14px #eeeef2 copy and a row of two ghost buttons (FIND OUT MORE / DOWNLOAD). Below sits the hero product photo, overlaid with a massive graffiti-style distressed headline in hot magenta/red (this is a photographic/typographic treatment, not a UI color). All UI chrome stays monochrome — the colored type is part of the image.

### Section Display Heading
**Role:** Major section title

64px Neue Haas Grotesk Display Pro weight 450, -0.01em letter-spacing, 0.95 line-height, #eeeef2. Left-aligned. A short red/orange underline accent (~80px wide, ~4px tall) sits to the left of the heading as the only chromatic punctuation in the system. Below, a single line of supporting copy in 18px weight 400 #eeeef2.

### Sound Pack Highlight Card
**Role:** Editorial spotlight block

Full-width or 2-column block, 0px radius. Left side: #eeeef2 heading at 24-31px Neue Haas Grotesk Display Pro weight 450 with the small red/orange accent underline. Right side: a solid-fill tile (red/coral) with the pack name set in oversized 35-64px Neue Haas Grotesk Display Pro weight 500, white, all-caps — a single loud chromatic moment amid the monochrome.

### Input Field
**Role:** Form control

#333337 background, 7px corner radius (the only radius in the entire system), 1px #eeeef2 border, 14px Neue Haas Grotesk Text Pro weight 400 input text in #eeeef2, 14px Ash #b4b4b8 placeholder. 14px vertical padding, 18px horizontal padding. No focus ring — border thickens or inverts on focus.

### Footer Link List
**Role:** Site footer / utility navigation

Horizontal list of links in 11-14px Neue Haas Grotesk Text Pro weight 400 #eeeef2, 0.033-0.042em tracking, separated by thin vertical 1px #eeeef2 dividers with 18px horizontal margin. No background — sits on the same #222222 canvas.

### Brand Mark (Elektron 'E')
**Role:** Logo

Small (~24px) monochrome wordmark/icon in #eeeef2, centered in the nav bar. The mark is a compact stylized 'E' with a horizontal slash — geometric, not ornamental.

### Decorative Dot-Matrix Tag
**Role:** Signature micro-label

14px digi one v2 weight 400 in #eeeef2, 0.033em tracking, 1.5 line-height. Used sparingly for version numbers, technical labels, or LCD-echo copy. Treat as an accent, not a default — overuse breaks the signature.

## Do's and Don'ts

### Do
- Keep the entire UI monochrome: text in #eeeef2, surfaces in #222222/#151515/#000000, borders in #eeeef2. Color is for product photography and one or two editorial accent tiles — never for chrome.
- Use Neue Haas Grotesk Text Pro weight 400 as the default. Reserve the Display cut (400/450/500) for headlines at 24px and above.
- Apply positive letter-spacing to all body and utility text: 0.04em at 11–14px, tapering to 0.013em at 28–35px. Use -0.01em only on the 64px display headlines.
- Use 0px corner radius on every component except inputs (7px). Square corners are the signature — the interface should read like silkscreened hardware.
- Base spacing on the 4px grid. Element gaps of 4–7px, card padding of 21px, section gaps of 56–80px. Stay compact; the density is the point.
- Deploy digi one v2 for at most 2–3 labels per screen — version numbers, LCD-echo technical copy. It's a flourish, not a body face.
- Treat product photography as the only color source. Let images bleed full-bleed with no borders, captions, or padding.

### Don't
- Don't add colored buttons, hover fills, or gradients — the system refuses soft modern signals. Buttons are outlined or filled-black only.
- Don't use drop shadows or elevation. The surface stack (#000000 → #151515 → #222222 → #333337) handles depth through value contrast, not shadow.
- Don't round corners on cards, buttons, tags, or images. The 7px radius is reserved for inputs only.
- Don't introduce a second body font. Neue Haas Grotesk Text Pro is the workhorse; digi one v2 is a decorative accent, not a substitute.
- Don't use weight 600 or above anywhere — the heaviest weight in the system is 500 on display headlines. Bolder weights break the whisper-thin hardware feel.
- Don't add icons with color. Icons inherit #eeeef2 from the text color; multi-color or accent-colored icons break the monochrome contract.
- Don't apply letter-spacing to display headlines unless you mean the uppercase utility style (0.04em at 24-31px). The 64px hero text wants the tight -0.01em tracking, not a loose feel.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#222222` | Full-bleed page background |
| 1 | Void | `#000000` | Deepest recessed layer for icon and button cores |
| 2 | Surface | `#151515` | Standard elevated card and component surface |
| 3 | Input | `#333337` | Form field surface, barely lifted off canvas |
| 4 | Text | `#eeeef2` | Foreground text and iconography |

## Imagery

Product photography is the dominant visual language and the only color source in the system. Shots are cinematic, close-cropped, near-black — synthesizers and drum machines photographed in low light with the LCD screen as the brightest element, casting blue-green glow onto knobs and panels. No lifestyle context, no hands, no studio softboxes visible: the hardware is the subject, shot almost like a product catalog from a luxury watchmaker. Edge-to-edge full-bleed, no rounded corners, no overlay text except in the version-release banners (where a graffiti-distressed magenta wordmark is composited onto the photo — this is part of the image asset, not a UI element). The only non-product imagery is the Sound Pack editorial blocks, which use a single solid-color tile (red/coral) with oversized white type as a graphic device.

## Layout

Full-bleed dark canvas at all times; the page is always edge-to-edge, with internal content constrained to a ~1280px max-width inside section bands. The hero is a full-viewport-width product photograph with no overlay chrome — the nav bar floats above it. Below the hero, content stacks as wide horizontal bands: a compact utility strip (ghost buttons + small text), then the product accessory carousel (4-up product cards in a single row with side arrows), then a large left-aligned display heading with a 2-column body block. Section gaps are 56-80px but individual element gaps are tight (4-7px) — the page breathes between sections, never within them. Navigation is a single minimal top bar with no sticky behavior, no mega-menu, no sidebar. The overall rhythm is: one big visual, one band of compact cards, one heading + body block, repeat.

## Agent Prompt Guide

**Quick Color Reference**
- Canvas: #222222
- Surface: #151515
- Deep surface: #000000
- Text / icon: #eeeef2
- Border / rule: #eeeef2 (1px)
- Input surface: #333337
- Placeholder: #b4b4b8
- primary action: no distinct CTA color

**Example Component Prompts**
1. **Outlined Ghost Button**: 1px solid #eeeef2 border, transparent background, 0px radius, 11px vertical padding × 24px horizontal padding, label in 16px Neue Haas Grotesk Display Pro weight 400 all-caps with 0.04em tracking, color #eeeef2. On hover, invert to #eeeef2 fill with #222222 text.

2. **Product Carousel Card**: transparent background over the #222222 canvas, 0px radius. Product image flush at top, ~280px tall, no border, no rounded corners. Product name below in 16px Neue Haas Grotesk Text Pro weight 400 #eeeef2 with 21px padding-top.

3. **Section Display Heading**: 64px Neue Haas Grotesk Display Pro weight 450, -0.01em letter-spacing, 0.95 line-height, #eeeef2, left-aligned. Preceded by an 80px-wide × 4px-tall red/coral (#e63946 or similar) horizontal accent rule sitting flush-left above the headline.

4. **Top Navigation Bar**: full-bleed #222222, 64px tall, no border. Left cluster at 14px Neue Haas Grotesk Text Pro weight 400 #eeeef2: 'Catalog', 'Shop', 'Search' with 18px gaps. Centered: 24px monochrome Elektron 'E' mark in #eeeef2. Right cluster: 'Support', 'Account', 'Cart' with matching type and 18px gaps. Icons may accompany each label.

5. **Input Field**: #333337 background, 7px corner radius, 1px solid #eeeef2 border, 14px vertical padding × 18px horizontal padding. Input text in 14px Neue Haas Grotesk Text Pro weight 400 #eeeef2, placeholder in 14px #b4b4b8. On focus, border thickens to 2px (no glow, no shadow).

## Elevation Philosophy

The system has no shadows. Depth is communicated exclusively through a value-based surface stack (#000000 → #151515 → #222222 → #333337 → #eeeef2) where darker values recede and lighter values advance. The page canvas is #222222 — intentionally not pure black — so the deepest UI elements (#000000 buttons, #000000 icon cores) read as 'punched through' the surface rather than sitting on it. This mirrors the physical product: dark anodized aluminum with deep-recessed OLED wells. Never introduce drop shadows, glows, or blurred elevation — they would break the industrial spec-sheet language.

## Dot-Matrix Accent

The digi one v2 typeface appears at 14px only and should be treated as a signature micro-label rather than a body face. Deploy it for: firmware version numbers ('3.40'), LCD-echo technical micro-copy, or one-off decorative tags. Cap usage at 2-3 instances per screen. The font exists to echo the LCD readouts on the Digitakt/Digitone/Tonverk hardware — it ties the web UI to the physical product's visual language. Do not use it for body paragraphs, button labels, or navigation.

## Similar Brands

- **Teenage Engineering** — Same hardware-product-first dark canvas with product photography as the only color source, and a custom geometric grotesque in single weight for UI chrome
- **1010music (Bitbox / Blackbox)** — Compact industrial UI with minimal-radius components, monochrome dark theme, and product imagery shot in near-black with glowing screens
- **Moog Music** — Same hardware-showcase approach: full-bleed cinematic product shots on near-black canvas, restrained typography, zero decorative UI color
- **Native Instruments** — Dark technical-instrument aesthetic with a single custom grotesque, product photography carrying the color, and compact dense card grids
- **Universal Audio** — Near-black canvas with cinematic hardware close-ups, tight typographic grid, square corners, and refusal of soft modern UI conventions

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-page-canvas: #222222;
  --color-deep-surface: #151515;
  --color-void: #000000;
  --color-platinum: #eeeef2;
  --color-pure-white: #ffffff;
  --color-iron: #333337;
  --color-ash: #b4b4b8;

  /* Typography — Font Families */
  --font-neue-haas-grotesk-text-pro: 'Neue Haas Grotesk Text Pro', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-neue-haas-grotesk-display-pro: 'Neue Haas Grotesk Display Pro', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-digi-one-v2: 'digi one v2', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-nhaasgroteskdspro: 'NHaasGroteskDSPro', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-analog-one-v2: 'Analog One V2.', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.5;
  --tracking-caption: 0.46px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --tracking-body-sm: 0.56px;
  --text-body: 16px;
  --leading-body: 1.2;
  --tracking-body: 0.42px;
  --text-subheading: 18px;
  --leading-subheading: 1.5;
  --tracking-subheading: 0.31px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.33;
  --tracking-heading-sm: 0.96px;
  --text-heading: 31px;
  --leading-heading: 1.5;
  --tracking-heading: 1.24px;
  --text-heading-lg: 35px;
  --leading-heading-lg: 1.2;
  --tracking-heading-lg: 0.46px;
  --text-display: 64px;
  --leading-display: 0.95;
  --tracking-display: -0.64px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-w450: 450;
  --font-weight-medium: 500;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-28: 28px;
  --spacing-60: 60px;

  /* Layout */
  --page-max-width: 1280px;
  --section-gap: 56-80px;
  --card-padding: 21px;
  --element-gap: 4-7px;

  /* Border Radius */
  --radius-md: 7px;

  /* Named Radii */
  --radius-tags: 0px;
  --radius-cards: 0px;
  --radius-icons: 0px;
  --radius-inputs: 7px;
  --radius-buttons: 0px;

  /* Surfaces */
  --surface-canvas: #222222;
  --surface-void: #000000;
  --surface-surface: #151515;
  --surface-input: #333337;
  --surface-text: #eeeef2;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-page-canvas: #222222;
  --color-deep-surface: #151515;
  --color-void: #000000;
  --color-platinum: #eeeef2;
  --color-pure-white: #ffffff;
  --color-iron: #333337;
  --color-ash: #b4b4b8;

  /* Typography */
  --font-neue-haas-grotesk-text-pro: 'Neue Haas Grotesk Text Pro', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-neue-haas-grotesk-display-pro: 'Neue Haas Grotesk Display Pro', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-digi-one-v2: 'digi one v2', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-nhaasgroteskdspro: 'NHaasGroteskDSPro', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-analog-one-v2: 'Analog One V2.', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.5;
  --tracking-caption: 0.46px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --tracking-body-sm: 0.56px;
  --text-body: 16px;
  --leading-body: 1.2;
  --tracking-body: 0.42px;
  --text-subheading: 18px;
  --leading-subheading: 1.5;
  --tracking-subheading: 0.31px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.33;
  --tracking-heading-sm: 0.96px;
  --text-heading: 31px;
  --leading-heading: 1.5;
  --tracking-heading: 1.24px;
  --text-heading-lg: 35px;
  --leading-heading-lg: 1.2;
  --tracking-heading-lg: 0.46px;
  --text-display: 64px;
  --leading-display: 0.95;
  --tracking-display: -0.64px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-28: 28px;
  --spacing-60: 60px;

  /* Border Radius */
  --radius-md: 7px;
}
```
