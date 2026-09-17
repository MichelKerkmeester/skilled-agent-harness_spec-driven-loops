# Stocketa — Style Reference
> Neon aurora on frosted glass — a light, weightless interface floating beneath a prism-washed sky.

**Theme:** light

Stocketa floats its product on a dreamy light canvas washed with a soft radial aurora — green, teal, purple, and pink bleeding from the top — where the color is felt as atmosphere rather than seen as decoration. The interface below stays calm and almost achromatic: white cards, hairline borders, and a signature three-layer shadow (a faint blue-tinted outer drop, a 1px white inner highlight, and a barely-there navy inset) that whispers elevation instead of declaring it. A single vivid magenta (#995bb9) does all the emotional work — painting headlines as a left-to-right gradient, filling icons, and pulling the eye through each section. Typography is a custom geometric sans (averta standard) cut for very tight negative tracking at display sizes up to 98px, giving even the biggest headlines a compressed, confident posture. The phone mockup is the hero: it sits at the visual center of every section, turning the product itself into the brand's primary visual asset.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Aurora Magenta | `#995bb9` | `--color-aurora-magenta` | Headline gradient start, icon fills, decorative brand strokes — the single chromatic voice of the system, used as gradient text on display headings and as fill on small icon badges |
| Deep Iris | `#5b638c` | `--color-deep-iris` | Muted violet used for decorative SVG strokes and secondary graphic outlines — sits behind the magenta as the system-wide line color |
| Midnight Ink | `#1d2630` | `--color-midnight-ink` | Primary body and heading text on light surfaces — slightly warmer than pure black, reads softer at large sizes while keeping AAA contrast |
| Obsidian | `#000000` | `--color-obsidian` | Highest-weight text and the densest border color — used where maximum contrast is required against the near-white canvas |
| Lavender Mist | `#e0dde2` | `--color-lavender-mist` | Page canvas and subtle surface tint — the entire site reads on this near-white, giving the aurora gradient something warm to land on |
| Paper White | `#ffffff` | `--color-paper-white` | Card and elevated surface fill — floats above Lavender Mist as the base for product cards, phone screen, and feature panels |
| Frost Shadow | `#f0f0f0` | `--color-frost-shadow` | Shadow tone used in the multi-layer card elevation — too light to be a border, present only as the ambient outer blur |
| Pebble | `#9aa1b2` | `--color-pebble` | Mid-neutral for muted body text and link borders — the default text color for descriptions and the border for inline link affordances |
| Silver Lining | `#a5afcb` | `--color-silver-lining` | Light hairline border and secondary muted text — used on card edges and quiet metadata rows |
| Cloud Veil | `#abbdcf` | `--color-cloud-veil` | Softest neutral for decorative SVG fills and ambient accents — supports the aurora without competing with the magenta |
| Tidewater Navy | `#3a4766` | `--color-tidewater-navy` | Violet accent for outlined action borders, linked labels, and lightweight interactive emphasis. Do not promote it to the primary CTA color |
| Aurora Green | `radial-gradient(140% 119% at 50% 0%, rgba(105, 201, 102, 0.4) 14%, rgba(39, 187, 219, 0.33) 36%, rgba(139, 71, 206, 0.2) 52%, rgba(218, 64, 134, 0.1) 70%, rgba(255, 149, 116, 0) 82%, rgba(0, 0, 0, 0) 100%)` | `--color-aurora-green` | Gradient stop in the page-level aurora and accent on positive chart lines inside the phone mockup |

## Tokens — Typography

### averta standard — Sole typeface across the system. Custom geometric sans with humanist warmth — the slightly rounded terminals soften what would otherwise be a cold fintech voice. · `--font-averta-standard`
- **Substitute:** Inter, General Sans, or DM Sans
- **Weights:** 400, 500, 600, 700, 800
- **Sizes:** 14px, 15px, 16px, 17px, 19px, 27px, 28px, 50px, 53px, 62px, 98px
- **Line height:** 1.0–1.4 (tighter as size increases)
- **Letter spacing:** Tightens with size: -0.018em at 14px, -0.016em at 15px, -0.011em at 16px, -0.006em at 17px, -0.003em at 19px
- **OpenType features:** `tnum on for numeric tables and price displays`
- **Role:** Sole typeface across the system. Custom geometric sans with humanist warmth — the slightly rounded terminals soften what would otherwise be a cold fintech voice.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 14px | 1.4 | -0.25px | `--text-caption` |
| heading-sm | 19px | 1.25 | -0.06px | `--text-heading-sm` |
| heading | 27px | 1.2 | -0.49px | `--text-heading` |
| heading-lg | 53px | 1.15 | -0.95px | `--text-heading-lg` |
| display | 98px | 1 | -1.76px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 8px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 8 | 8px | `--spacing-8` |
| 16 | 16px | `--spacing-16` |
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 88 | 88px | `--spacing-88` |
| 96 | 96px | `--spacing-96` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 18px |
| buttons | 100px |
| asymmetric | 34px |
| decorative | 22px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| md | `rgba(97, 110, 124, 0.114) 0px 4px 15px 0px, rgba(255, 255...` | `--shadow-md` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 16px
- **Element gap:** 16px

## Components

### Aurora Hero Background
**Role:** Page-level atmospheric wash

Radial gradient (140% 119% at 50% 0%) flowing from translucent green (rgba(105,201,102,0.4)) through teal and violet to transparent pink, fading to zero at the bottom. Sits behind all page content and is the only background treatment allowed at the section level.

### Gradient Text Headline
**Role:** Hero and section H1

Display text at 50–98px, weight 700, filled with a linear gradient left-to-right from Aurora Magenta (#995bb9) through Deep Iris to Tidewater Navy. Tracking is extremely tight (-0.95 to -1.76px). Always left-aligned, never centered.

### Filled Primary Button
**Role:** Single primary action per screen

Pill shape at 100px radius, background Tidewater Navy (#3a4766) with Paper White text, weight 600, 15–16px, padding 14px 30px. No drop shadow — the dark fill against Lavender Mist is the elevation.

### Outlined Ghost Button
**Role:** Secondary action

Pill shape at 100px radius, 1px border in Pebble (#9aa1b2) or Tidewater Navy, transparent fill, Midnight Ink text, weight 500, 15–16px, padding 14px 30px. Sits to the right of the primary with 16px gap.

### Feature List Item
**Role:** Vertical feature list (Transaction details, Widgets, etc.)

Horizontal row with a 24–28px icon in a soft tinted square (Silver Lining fill, Aurora Magenta icon at 60% opacity), bold heading at 17px weight 600 in Midnight Ink, and description at 15px weight 400 in Pebble. 40px vertical gap between items.

### Floating Stock Ticker Card
**Role:** Decorative product proof

White card at 22px radius, ~16px padding, soft three-layer shadow, containing a 3-letter ticker label and a 1-stroke sparkline chart. Two size variants: small (TSLA/SQ at ~60px wide) and large (AAPL at ~100px wide). Scattered around the phone mockup at 15–20° rotations.

### Phone Mockup Frame
**Role:** Product hero element

iPhone-shaped frame at 300×620px with a subtle 1px Cloud Veil border and the three-layer shadow stack. Rounded to 44px to mimic device corners. Contains the in-app holdings screen. Anchored to the right column on desktop, full-bleed centered on mobile.

### App Holdings Card
**Role:** In-app content card (white surface inside phone mockup)

White card, 18px radius, 16px padding, hairline Silver Lining bottom border. Contains ticker symbol (17px weight 700), company name (14px weight 400 in Pebble), current price (right-aligned, 17px weight 600), daily change in small Aurora Green or warm red text, and a 60px-tall sparkline chart.

### In-App Time Tab Bar
**Role:** Chart period selector

Horizontal row of time period chips (1D, 1M, 6M, 1Y, 5Y) at 14px weight 500. Active tab gets an Aurora Magenta fill at 10% opacity with Aurora Magenta text; inactive tabs are Pebble. Chips are pill-shaped at 100px radius, 4px 12px padding.

### Holdings Summary Header
**Role:** In-app portfolio total

Top of the holdings list inside the phone. 'Holdings' label at 15px weight 500 in Pebble, total value at 27px weight 700 in Midnight Ink, and a 'Daily change' delta line in small Aurora Green text. Bottom hairline border in Silver Lining.

### Gradient Brand Icon
**Role:** App icon and small logo mark

Rounded square (8px radius) filled with the same left-to-right magenta-to-navy linear gradient as the headline text. Contains a white chart-stroke glyph. Used as the app icon next to the wordmark and as small decorative marks.

### Section Container
**Role:** Wrapping container for each content band

Max-width 1200px centered, 80px vertical padding top and bottom. No visible border. Background is always the canvas color — sections are separated by space, not lines or alternating fills.

## Do's and Don'ts

### Do
- Use the aurora radial gradient as the only page-level background — never overlay it with a solid color or another gradient
- Apply the magenta-to-navy linear gradient only to display headlines (50px+) and the brand icon — never to body text or UI controls
- Use 100px pill radius for every button and chip — no exceptions for size, even on small icon buttons
- Keep the three-layer shadow stack (blue-tinted drop, white inner highlight, 1px navy inset) reserved for floating elements — never apply it to inline cards or list rows
- Set the type scale to negative tracking as sizes grow: -0.25px at caption, tightening to -1.76px at display — this compression is the system's voice
- Anchor the phone mockup to the right column on every section that features it — never let it drift center or stack below the headline on desktop
- Use Tidewater Navy (#3a4766) for the single filled primary button per screen, and pair it with an outlined ghost button using a Pebble or Navy border

### Don't
- Don't introduce green or red as semantic UI colors — they only appear inside the phone mockup's chart strokes and must not bleed into badges, alerts, or form states
- Don't use solid #ffffff as the page background — always use Lavender Mist (#e0dde2) so the aurora has warmth to land on
- Don't add visible card borders on white surfaces — rely on the shadow stack and the Lavender Mist canvas for separation
- Don't use corners sharper than 18px on product cards or 22px on decorative elements — the system requires consistent softness
- Don't set type below 14px or above 98px — the scale is intentionally narrow
- Don't apply the Aurora Magenta as a flat fill on large areas — it must always be expressed as a gradient or as a small icon/heading accent
- Don't center the hero headline — the magenta gradient text is left-aligned by design, anchored to the same gridline as the body copy below it

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#e0dde2` | Page background, washed with the aurora radial gradient near the top |
| 1 | Card | `#ffffff` | Feature panels, in-phone UI, and product screenshots |
| 2 | Elevated | `#ffffff` | Floating stock ticker cards and phone mockup, lifted with the three-layer shadow stack |

## Elevation

- **Floating card (stock ticker, phone mockup):** `0px 4px 15px 0px rgba(97, 110, 124, 0.114), inset 0px 1px 1px 0px rgba(255, 255, 255, 0.39), 0px 1px 1px 0px rgba(34, 50, 94, 0.08)`

## Imagery

The site is overwhelmingly text-and-UI driven. The only recurring visual asset is the iPhone mockup of the app itself, which functions as both product proof and decorative centerpiece — it appears at full opacity in the right column and is reinforced by three floating stock ticker cards (TSLA, AAPL, SQ) scattered around it with 1-stroke sparkline charts. No photography, no illustrations, no abstract graphics beyond the aurora gradient and the magenta-to-navy linear gradient. Icons are uniformly small (24–28px), single-color, and filled with Aurora Magenta at full or 60% opacity — no outline icons, no multicolor glyphs.

## Layout

Two-column desktop layout, max-width 1200px centered. Left column (roughly 45%) holds all text content: the gradient headline, supporting paragraph, button row, and the full feature list. Right column (roughly 45%) is anchored by the phone mockup, which stays pinned to the same vertical position across every section. Hero is NOT full-bleed — it inherits the aurora-washed canvas and uses a 1200px container. Sections stack vertically with 80px gaps, no alternating dark/light bands, no dividers. The feature list is a single vertical column of rows (icon + heading + description) with 40px between items. Navigation is minimal — just the wordmark and small CTA in the top-left, no mega-menu, no sticky header. The right column has a slight staggered effect: the phone mockup is static while the floating ticker cards are positioned at irregular offsets to create visual rhythm.

## Agent Prompt Guide

Quick Color Reference:
- text: #1d2630 (Midnight Ink) for body and headings, #000000 for highest-weight text
- background: #e0dde2 (Lavender Mist) for page canvas, #ffffff (Paper White) for cards
- border: #a5afcb (Silver Lining) for hairlines, #9aa1b2 (Pebble) for link borders
- accent: #995bb9 (Aurora Magenta) for gradient text, icons, and the only chromatic voice
- primary action: #3a4766 (outlined action border)

Example Component Prompts:
1. Build a hero section: Lavender Mist (#e0dde2) canvas with the aurora radial gradient overlay. Left-aligned display headline at 53px, weight 700, filled with the magenta-to-navy linear gradient (rgb(149,91,185) → rgb(91,99,140) → rgb(58,71,102)), letter-spacing -0.95px. Supporting text at 16px weight 400 in Midnight Ink (#1d2630). Two buttons: filled pill at 100px radius with Tidewater Navy (#3a4766) background, Paper White text, 14px 30px padding; and an outlined pill at 100px radius with 1px Pebble (#9aa1b2) border, Midnight Ink text.
2. Create a feature list row: 24px Aurora Magenta (#995bb9) icon in a 40px square with Silver Lining (#a5afcb) fill at 30% opacity. Bold heading at 17px weight 600 in Midnight Ink. Description at 15px weight 400 in Pebble (#9aa1b2). 40px vertical gap between rows.
3. Build a floating stock ticker card: 22px radius, white fill, 16px padding, three-layer shadow (rgba(97,110,124,0.114) 0 4px 15px, inset 0 1px 1px rgba(255,255,255,0.39), 0 1px 1px rgba(34,50,94,0.08)). 3-letter ticker at 14px weight 700 in Midnight Ink and a 40px-tall sparkline in Tidewater Navy.
4. Create the in-app holdings card (white card inside the phone mockup): 18px radius, 16px padding, Silver Lining bottom border. Ticker symbol at 17px weight 700, company name at 14px weight 400 in Pebble, current price right-aligned at 17px weight 600, daily change at 13px weight 500 in Aurora Green. 60px sparkline at the bottom.
5. Build a section container: max-width 1200px centered, 80px padding top and bottom, Lavender Mist background. Two-column grid with 45%/45% split and 10% gap, phone mockup pinned in the right column.

## Gradient System

Three gradients carry the entire visual identity. (1) The page aurora — a radial from translucent green through teal and violet to transparent pink, anchored at 50% 0% and fading to nothing before reaching the fold midpoint. This is the only background treatment allowed and must be applied at the page level, not on cards. (2) The headline gradient — a linear sweep from Aurora Magenta (#995bb9) through Deep Iris (#5b638c) to Tidewater Navy (#3a4766), applied only as a background-clip text fill on display headlines and the brand icon. Never use it on body copy, buttons, or borders. (3) The phone fade — a linear gradient from rgba(132,161,208,0.33) to transparent, used to soften the bottom edge of the phone mockup and make it feel like it dissolves into the canvas.

## Shadow Philosophy

Elevation is a three-part conversation, not a single drop shadow. The outer blur (rgba(97,110,124,0.114) at 0 4px 15px) does the heavy lifting with a barely-there blue tint that reads as ambient light, not as a hard edge. The inner highlight (inset rgba(255,255,255,0.39) at 0 1px 1px) is the signature: it suggests a light source from above and gives every floating surface a glassy, neumorphic quality. The 1px navy inset line (rgba(34,50,94,0.08)) is almost invisible alone but adds depth by simulating the way real glass catches a dark edge. Use this exact stack on every floating element; do not decompose it or substitute a flat drop shadow.

## Similar Brands

- **Robinhood** — Same clean white card surfaces, same pill-shaped CTA buttons, and the same habit of letting the app UI do the visual heavy lifting while the marketing page stays almost monochrome
- **Linear** — Same tight negative tracking on large display type, same restraint with color (a single accent against near-white), and the same neumorphic-feeling soft shadows on floating panels
- **Acorns** — Same product-as-hero layout with a phone mockup anchored in the right column, same friendly geometric sans-serif voice, and the same aurora-like background washes on a light canvas
- **Mercury** — Same Tidewater-leaning navy as the primary action color, same hairline borders over soft shadows, and the same willingness to let a single gradient headline do the emotional work of the whole page

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-aurora-magenta: #995bb9;
  --color-deep-iris: #5b638c;
  --color-midnight-ink: #1d2630;
  --color-obsidian: #000000;
  --color-lavender-mist: #e0dde2;
  --color-paper-white: #ffffff;
  --color-frost-shadow: #f0f0f0;
  --color-pebble: #9aa1b2;
  --color-silver-lining: #a5afcb;
  --color-cloud-veil: #abbdcf;
  --color-tidewater-navy: #3a4766;
  --color-aurora-green: #69c966;
  --gradient-aurora-green: radial-gradient(140% 119% at 50% 0%, rgba(105, 201, 102, 0.4) 14%, rgba(39, 187, 219, 0.33) 36%, rgba(139, 71, 206, 0.2) 52%, rgba(218, 64, 134, 0.1) 70%, rgba(255, 149, 116, 0) 82%, rgba(0, 0, 0, 0) 100%);

  /* Typography — Font Families */
  --font-averta-standard: 'averta standard', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.4;
  --tracking-caption: -0.25px;
  --text-heading-sm: 19px;
  --leading-heading-sm: 1.25;
  --tracking-heading-sm: -0.06px;
  --text-heading: 27px;
  --leading-heading: 1.2;
  --tracking-heading: -0.49px;
  --text-heading-lg: 53px;
  --leading-heading-lg: 1.15;
  --tracking-heading-lg: -0.95px;
  --text-display: 98px;
  --leading-display: 1;
  --tracking-display: -1.76px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  --font-weight-extrabold: 800;

  /* Spacing */
  --spacing-unit: 8px;
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-88: 88px;
  --spacing-96: 96px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 16px;
  --element-gap: 16px;

  /* Border Radius */
  --radius-2xl: 18px;
  --radius-2xl-2: 22px;
  --radius-3xl: 34px;
  --radius-full: 100px;

  /* Named Radii */
  --radius-cards: 18px;
  --radius-buttons: 100px;
  --radius-asymmetric: 34px;
  --radius-decorative: 22px;

  /* Shadows */
  --shadow-md: rgba(97, 110, 124, 0.114) 0px 4px 15px 0px, rgba(255, 255, 255, 0.39) 0px 1px 1px 0px inset, rgba(34, 50, 94, 0.08) 0px 1px 1px 0px;

  /* Surfaces */
  --surface-canvas: #e0dde2;
  --surface-card: #ffffff;
  --surface-elevated: #ffffff;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-aurora-magenta: #995bb9;
  --color-deep-iris: #5b638c;
  --color-midnight-ink: #1d2630;
  --color-obsidian: #000000;
  --color-lavender-mist: #e0dde2;
  --color-paper-white: #ffffff;
  --color-frost-shadow: #f0f0f0;
  --color-pebble: #9aa1b2;
  --color-silver-lining: #a5afcb;
  --color-cloud-veil: #abbdcf;
  --color-tidewater-navy: #3a4766;
  --color-aurora-green: #69c966;

  /* Typography */
  --font-averta-standard: 'averta standard', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.4;
  --tracking-caption: -0.25px;
  --text-heading-sm: 19px;
  --leading-heading-sm: 1.25;
  --tracking-heading-sm: -0.06px;
  --text-heading: 27px;
  --leading-heading: 1.2;
  --tracking-heading: -0.49px;
  --text-heading-lg: 53px;
  --leading-heading-lg: 1.15;
  --tracking-heading-lg: -0.95px;
  --text-display: 98px;
  --leading-display: 1;
  --tracking-display: -1.76px;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-88: 88px;
  --spacing-96: 96px;

  /* Border Radius */
  --radius-2xl: 18px;
  --radius-2xl-2: 22px;
  --radius-3xl: 34px;
  --radius-full: 100px;

  /* Shadows */
  --shadow-md: rgba(97, 110, 124, 0.114) 0px 4px 15px 0px, rgba(255, 255, 255, 0.39) 0px 1px 1px 0px inset, rgba(34, 50, 94, 0.08) 0px 1px 1px 0px;
}
```
