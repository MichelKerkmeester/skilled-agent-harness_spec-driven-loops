# TeePublic — Style Reference
> Indie creator marketplace on white paper. A clean gallery wall where artist designs sit on bright cards, one signature blue links it all together, and the whole thing moves at the speed of discovery.

**Theme:** light

TeePublic's design system is a creator-commerce platform that feels like a community marketplace with editorial polish. The interface rests on a bright white canvas with deep midnight (#151523) text, one saturated violet-blue accent (#4e64df) that activates links, buttons, and rating systems, and a scale of cool grays for hairline borders and quiet surfaces. Typography pairs a geometric grotesque (Roobert) for UI and body with a sharper display face (SharpGrotesk) for headings, creating a hierarchy where product content stays readable and bold. Components are compact, border-driven rather than shadow-heavy, and rounded at 12px to feel friendly without being childish. The visual rhythm is dense and grid-based — product cards, tag chips, and style selectors repeat at a fast cadence, with generous use of pill shapes (100px radius) for navigation and a subtle rainbow gradient reserved for celebratory or premium moments.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Midnight Ink | `#151523` | `--color-midnight-ink` | Primary text, heading strokes, dark borders — the structural color of the system, near-black with a cool blue undertone that matches the brand accent |
| Signature Violet | `#4e64df` | `--color-signature-violet` | Brand accent and primary action — CTA fills, link borders, active states, star ratings, icon highlights; the single chromatic voice in an otherwise achromatic system |
| Signal Red | `#ff0000` | `--color-signal-red` | Red action color for filled buttons, selected navigation states, and focused conversion moments. Use as a supporting accent, not as a status color |
| Periwinkle Tint | `#99a7f5` | `--color-periwinkle-tint` | Lighter violet for nav borders, hover states, and decorative accents — a diluted echo of the brand color for secondary emphasis |
| Lavender Mist | `#d0d6fb` | `--color-lavender-mist` | Card border tint and soft highlight surfaces — a very pale violet that adds warmth to otherwise cool gray cards |
| Deep Iris | `#6c7ee4` | `--color-deep-iris` | Icon fills and secondary link borders — a mid-violet that bridges the brand accent and its lighter tints |
| Graphite | `#49495a` | `--color-graphite` | Secondary text and muted body copy — sits between Midnight Ink and the light grays |
| Paper White | `#ffffff` | `--color-paper-white` | Page canvas, card surfaces, input fields, button text on dark fills — the dominant background across the entire system |
| Fog | `#e9e9ec` | `--color-fog` | Subtle surface elevation, soft dividers, secondary card backgrounds — the lightest gray for layering without shadows |
| Ash | `#d7d7db` | `--color-ash` | Input borders, form field outlines, and standard dividers — the default border color for structural elements |
| Stone | `#c7c7cb` | `--color-stone` | Shadow base — shadows in the system are cast in dark midnight at 0.2 opacity, not in gray, so this color appears only in button and card shadow tints |
| Steel | `#b9b9c1` | `--color-steel` | Medium-contrast borders, control outlines, and structural separators. Do not promote it to the primary CTA color |
| Lavender Wash | `#f1f3fe` | `--color-lavender-wash` | Tinted card backgrounds and soft surface lifts — a near-white violet that adds color temperature to elevated areas |

## Tokens — Typography

### Roobert — Body text, UI labels, captions, and small interactive elements — Roobert Medium carries the working voice of the interface, geometric and friendly with open apertures that keep dense product grids readable at 14-16px · `--font-roobert`
- **Substitute:** Inter, DM Sans, or Outfit
- **Weights:** 400, 500
- **Sizes:** 11px, 12px, 14px, 16px
- **Line height:** 1.20, 1.25, 1.33, 1.43, 1.50
- **Role:** Body text, UI labels, captions, and small interactive elements — Roobert Medium carries the working voice of the interface, geometric and friendly with open apertures that keep dense product grids readable at 14-16px

### Roobert — Button text, bold labels, badge copy, and emphasized body — the SemiBold weight adds authority to interactive elements without becoming shouty, keeping buttons compact at 14-16px · `--font-roobert`
- **Substitute:** Inter, DM Sans, or Outfit
- **Weights:** 600, 700
- **Sizes:** 12px, 13px, 14px, 16px, 18px, 20px
- **Line height:** 1.20, 1.25, 1.33, 1.43, 1.50, 1.56
- **Role:** Button text, bold labels, badge copy, and emphasized body — the SemiBold weight adds authority to interactive elements without becoming shouty, keeping buttons compact at 14-16px

### SharpGrotesk — Display headings and hero text — the sharper, more condensed grotesque creates clear hierarchy separation from the Roobert body voice, used sparingly so it retains impact at section headers · `--font-sharpgrotesk`
- **Substitute:** Space Grotesk, Manrope, or Sora
- **Weights:** 700
- **Sizes:** 20px, 24px, 28px, 32px
- **Line height:** 1.13, 1.14, 1.15, 1.20, 1.33
- **Role:** Display headings and hero text — the sharper, more condensed grotesque creates clear hierarchy separation from the Roobert body voice, used sparingly so it retains impact at section headers

### Arial — System fallback for email-like content or legacy form areas — appears minimally, only where third-party content forces it · `--font-arial`
- **Substitute:** system-ui sans-serif
- **Weights:** 400
- **Sizes:** 13px
- **Line height:** 1.20
- **Role:** System fallback for email-like content or legacy form areas — appears minimally, only where third-party content forces it

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 11px | 1.2 | — | `--text-caption` |
| body | 14px | 1.43 | — | `--text-body` |
| body-lg | 16px | 1.5 | — | `--text-body-lg` |
| subheading | 18px | 1.56 | — | `--text-subheading` |
| heading-sm | 20px | 1.2 | — | `--text-heading-sm` |
| heading | 24px | 1.15 | — | `--text-heading` |
| heading-lg | 28px | 1.14 | — | `--text-heading-lg` |
| display | 32px | 1.13 | — | `--text-display` |
| display-lg | 40px | 1.15 | — | `--text-display-lg` |

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
| 28 | 28px | `--spacing-28` |
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 80 | 80px | `--spacing-80` |
| 240 | 240px | `--spacing-240` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 100px |
| tags | 100px |
| cards | 12px |
| images | 20px |
| inputs | 8px |
| buttons | 12px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| sm | `rgba(21, 21, 35, 0.2) 0px 2px 4px 0px` | `--shadow-sm` |
| sm-2 | `rgba(0, 0, 0, 0.5) 0px 0px 4px 0px` | `--shadow-sm-2` |
| sm-3 | `rgba(0, 0, 0, 0.2) 0px 2px 6px 0px` | `--shadow-sm-3` |
| sm-4 | `rgba(21, 21, 35, 0.2) 0px 4px 8px 0px` | `--shadow-sm-4` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 48px
- **Card padding:** 16px
- **Element gap:** 8px

## Components

### Primary Violet Button
**Role:** Main call-to-action across product pages and forms

Filled with #4e64df, white text in Roobert 600 at 14px, 12px border-radius, 10px 20px padding, elevated with rgba(0,0,0,0.2) 0px 2px 6px shadow. The violet fill against the white canvas makes this the highest-emphasis element on any screen.

### Ghost / Outlined Button
**Role:** Secondary actions that share space with the primary CTA

White background with #151523 1px border, Midnight Ink text in Roobert 600 at 14px, 12px radius, 10px 20px padding. Shadow rgba(21,21,35,0.2) 0px 2px 4px provides subtle lift. Used for 'Login' beside 'Register' style pairings.

### Pill Navigation Button
**Role:** Category tabs and nav items

100px border-radius, 8px 16px padding, Roobert 500 at 14px. Active state gets a #4e64df border and text; inactive is Midnight Ink. The full pill radius makes nav feel playful and taps the marketplace's community energy.

### Product Card
**Role:** Grid item showing a t-shirt design

White background, 1px #d7d7db border, 20px radius on the image area, 12px radius on the card itself, 12px internal padding. Image fills the top, price and artist name sit below in Roobert 500 at 14px. Hover adds a subtle border tint toward #4e64df.

### Style Selector Chip
**Role:** T-shirt cut/style options (Classic, Heavyweight, etc.)

White background, 1px #d7d7db border, 8px radius, 8px 14px padding, Roobert 500 at 13px Midnight Ink. Selected state: #151523 background with white text. Arranged in a wrapping flex grid.

### Size Selector Chip
**Role:** Apparel size options (S, M, L, XL, 2XL…)

Same dimensions as the style selector but narrower content (8px 12px padding), maintaining the 8px radius. Active size gets a filled Midnight Ink background. Sizes arranged in a 5-column grid.

### Star Rating Display
**Role:** Product and seller rating indicators

Five stars in #4e64df fill, with numerical score (e.g. 4.9/5) in Roobert 600 at 14px Midnight Ink beside them. Stars are 14-16px filled icons. The violet star color ties ratings directly to the brand accent, making trust signals feel on-brand.

### Promo Banner Strip
**Role:** Top-bar announcement and promotional messages

Full-width #4e64df background, white text in Roobert 500 at 13px, centered, 8-12px vertical padding. Bold accent for free shipping thresholds, sale announcements. Sometimes has a white outlined pill button embedded.

### Quantity Stepper
**Role:** Product quantity input with +/- controls

White background, 1px #d7d7db border, 8px radius. Minus and plus buttons flank a numeric input. Input text in Roobert 500 at 14px Midnight Ink, centered. Buttons are 32px square with Ash (#b9b9c1) icon strokes.

### Search Bar
**Role:** Primary navigation search input

White background, 1px #d7d7db border, 8px radius, 40-44px height, 12-16px horizontal padding. Magnifying glass icon in #4e64df on the left. Placeholder text in #b9b9c1, Roobert 400 at 14px. On focus, border shifts to #4e64df.

### Icon Button
**Role:** Header utility actions (account, cart, favorites)

Circular or square 36-40px touch target, icon only in Midnight Ink (#151523). Cart icon may have a count badge in #ff0000 (Signal Red) with white text. No background fill by default.

### Form Input Field
**Role:** Text inputs, email fields, textareas

White background, 1px #d7d7db border, 8px radius, 40-44px height, 12-16px horizontal padding. Text in Roobert 400 at 14px Midnight Ink. Focus state: border transitions to #4e64df with no visible ring (border change is the indicator).

### Tag/Chip Badge
**Role:** Category labels, style tags, filter chips

100px border-radius, 6px 12px padding, Roobert 500 at 12px. White background with #d7d7db border and Midnight Ink text. Used densely in product detail areas for related categories.

### Social Proof Bar
**Role:** Trust strip with star ratings across platforms

Solid #4e64df background, white text. Contains platform name (Trustpilot, Zendesk, Google) in Roobert 600, star icons in white or gold, and score text at 14px. Full-width band with 32-48px vertical padding.

### Rainbow Gradient Accent
**Role:** Celebratory or premium feature highlight

linear-gradient(60deg, rgb(37,212,84), rgb(254,211,93), rgb(254,178,27), rgb(223,42,42), rgb(78,100,223), rgb(179,234,254), rgb(37,212,84)) used as a 2-3px border or background wash. Applied to featured products, special collections, or seller-spotlight elements where the single brand violet needs company.

## Do's and Don'ts

### Do
- Use #4e64df as the only chromatic accent for actionable elements — buttons, links, active states, stars, icons that need to draw the eye
- Set all text in Roobert: 400 for body, 500-600 for UI, and reserve SharpGrotesk 700 for headings at 20px and above
- Apply 12px border-radius to buttons, inputs, and cards as the default; use 8px only for compact inline elements like size chips
- Use 100px border-radius for all navigation pills, tags, and category chips to maintain the friendly marketplace feel
- Build forms with white backgrounds, 1px #d7d7db borders, and 8px radius; signal focus by changing the border to #4e64df rather than adding a shadow ring
- Keep sections separated by 48px vertical gaps with white or #f1f3fe backgrounds, never using heavy dividers
- Use Midnight Ink (#151523) for all primary text; reserve #4e64df exclusively for interactive or rated elements

### Don't
- Don't use #4e64df for large background fills or decorative blocks — the violet is an accent, not a surface color
- Don't apply shadows heavier than rgba(21,21,35,0.2) 0px 4px 8px — the system is border-driven, not depth-driven
- Don't use SharpGrotesk for body text or UI labels — its sharp character is reserved for display headings 20px+
- Don't mix border radii within a single component category — buttons are always 12px, inputs always 8px, nav always pill
- Don't introduce additional accent colors — the system's discipline comes from one violet voice against achromatic neutrals
- Don't use #ff0000 for decorative purposes — Signal Red is reserved for urgent alerts and high-emphasis attention buttons only
- Don't set body text below 14px in Roobert or above 16px — the type scale is tight by design for compact marketplace density

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Page Canvas | `#ffffff` | Primary page background and base surface |
| 1 | Card Surface | `#ffffff` | Product cards, style selectors, and content blocks sit directly on the canvas with border definition |
| 2 | Tinted Card | `#f1f3fe` | Softly elevated areas with a cool violet wash, used for feature highlights and grouped content |
| 3 | Muted Surface | `#e9e9ec` | Secondary backgrounds, subtle dividers, and form section backgrounds |

## Elevation

- **Raised button / link:** `rgba(21, 21, 35, 0.2) 0px 2px 4px 0px`
- **Primary CTA button:** `rgba(0, 0, 0, 0.2) 0px 2px 6px 0px`
- **Elevated card:** `rgba(21, 21, 35, 0.2) 0px 4px 8px 0px`

## Imagery

Product imagery dominates: t-shirt designs on models or flat-lays, presented as large square or 3:4 ratio images with 20px rounded corners. Imagery is bright, well-lit, and high-contrast against the white canvas — the designs themselves carry the color story, so the UI stays neutral. Icons are line-style, 1.5-2px stroke weight, in Midnight Ink or Signature Violet. No lifestyle photography beyond product shots. Illustrations are absent — the marketplace sells visual art (on apparel) rather than illustrated content. The rainbow gradient (green→yellow→orange→red→violet→cyan) appears rarely as a 2-3px accent border on featured or 'spotlight' elements, adding a burst of celebration without competing with the product imagery.

## Layout

Max-width 1200px centered container with a dark header bar (#151523 background) spanning full width. The header contains a centered search bar flanked by account/cart icons, with pill-shaped category nav below. Product pages use a two-column layout: large product image gallery on the left (60% width) and purchase controls on the right (40%), with style and size selectors stacking vertically as wrapping chip grids. Below the product fold, sections alternate between white and #4e64df accent bands — the colored bands serve as social proof and trust strips, while white bands host description, reviews, and related products in 3-4 column card grids. Content density is compact: 48px section gaps, 12-16px card padding, products in 3-4 column grids that fill the viewport without scrolling. Navigation is a top-bar with pill-shaped category tabs, no sidebar or mega-menu complexity.

## Agent Prompt Guide

Quick Color Reference:
- Text: #151523 (Midnight Ink)
- Background: #ffffff (Paper White)
- Border: #d7d7db (Ash)
- Accent: #4e64df (Signature Violet)
- primary action: #4e64df (filled action)
- Alert/Urgent: #ff0000 (Signal Red)

Example Component Prompts:

1. Create a product card: white background, 1px #d7d7db border, 20px radius on the image area (12px on card), 12px internal padding. Product image fills the top at 1:1 ratio. Below: price in Roobert 600 16px #151523, artist name in Roobert 400 12px #b9b9c1. Hover: border shifts to #4e64df.

2. Create a primary CTA button: #4e64df background, white text in Roobert 600 14px, 12px border-radius, 10px 20px padding, box-shadow rgba(0,0,0,0.2) 0px 2px 6px. No border.

3. Create a search bar: white background, 1px #d7d7db border, 8px radius, 44px height. Magnifying glass icon in #4e64df on the left. Placeholder in #b9b9c1 Roobert 400 14px. On focus: border becomes #4e64df.

4. Create a social proof bar: full-width #4e64df background, 32px vertical padding, white text. Three rating clusters horizontally: platform name in Roobert 600 14px, five stars in white, score text in Roobert 400 12px. Centered alignment.

5. Create a pill navigation tab: 100px border-radius, 8px 16px padding, Roobert 500 14px text. Active: #4e64df border 1px and #4e64df text. Inactive: transparent background, #151523 text.

## Similar Brands

- **Redbubble** — Same creator-marketplace density with white card grids, product-first imagery, and minimal accent color usage
- **Society6** — Similar product card grid structure and bright white canvas approach for showcasing artist-designed goods
- **Design By Humans** — Matching tee-commerce layout with a single bold accent color and compact product information density
- **Threadless** — Community-driven marketplace aesthetic with clean grid layouts and editorial product presentation
- **Etsy** — Same marketplace visual rhythm with product cards on white, minimal borders, and a single trust-building accent color

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-midnight-ink: #151523;
  --color-signature-violet: #4e64df;
  --color-signal-red: #ff0000;
  --color-periwinkle-tint: #99a7f5;
  --color-lavender-mist: #d0d6fb;
  --color-deep-iris: #6c7ee4;
  --color-graphite: #49495a;
  --color-paper-white: #ffffff;
  --color-fog: #e9e9ec;
  --color-ash: #d7d7db;
  --color-stone: #c7c7cb;
  --color-steel: #b9b9c1;
  --color-lavender-wash: #f1f3fe;

  /* Typography — Font Families */
  --font-roobert: 'Roobert', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-sharpgrotesk: 'SharpGrotesk', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.2;
  --text-body: 14px;
  --leading-body: 1.43;
  --text-body-lg: 16px;
  --leading-body-lg: 1.5;
  --text-subheading: 18px;
  --leading-subheading: 1.56;
  --text-heading-sm: 20px;
  --leading-heading-sm: 1.2;
  --text-heading: 24px;
  --leading-heading: 1.15;
  --text-heading-lg: 28px;
  --leading-heading-lg: 1.14;
  --text-display: 32px;
  --leading-display: 1.13;
  --text-display-lg: 40px;
  --leading-display-lg: 1.15;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-80: 80px;
  --spacing-240: 240px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 48px;
  --card-padding: 16px;
  --element-gap: 8px;

  /* Border Radius */
  --radius-sm: 3px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 20px;
  --radius-full: 100px;
  --radius-full-2: 800px;

  /* Named Radii */
  --radius-nav: 100px;
  --radius-tags: 100px;
  --radius-cards: 12px;
  --radius-images: 20px;
  --radius-inputs: 8px;
  --radius-buttons: 12px;

  /* Shadows */
  --shadow-sm: rgba(21, 21, 35, 0.2) 0px 2px 4px 0px;
  --shadow-sm-2: rgba(0, 0, 0, 0.5) 0px 0px 4px 0px;
  --shadow-sm-3: rgba(0, 0, 0, 0.2) 0px 2px 6px 0px;
  --shadow-sm-4: rgba(21, 21, 35, 0.2) 0px 4px 8px 0px;

  /* Surfaces */
  --surface-page-canvas: #ffffff;
  --surface-card-surface: #ffffff;
  --surface-tinted-card: #f1f3fe;
  --surface-muted-surface: #e9e9ec;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-midnight-ink: #151523;
  --color-signature-violet: #4e64df;
  --color-signal-red: #ff0000;
  --color-periwinkle-tint: #99a7f5;
  --color-lavender-mist: #d0d6fb;
  --color-deep-iris: #6c7ee4;
  --color-graphite: #49495a;
  --color-paper-white: #ffffff;
  --color-fog: #e9e9ec;
  --color-ash: #d7d7db;
  --color-stone: #c7c7cb;
  --color-steel: #b9b9c1;
  --color-lavender-wash: #f1f3fe;

  /* Typography */
  --font-roobert: 'Roobert', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-sharpgrotesk: 'SharpGrotesk', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.2;
  --text-body: 14px;
  --leading-body: 1.43;
  --text-body-lg: 16px;
  --leading-body-lg: 1.5;
  --text-subheading: 18px;
  --leading-subheading: 1.56;
  --text-heading-sm: 20px;
  --leading-heading-sm: 1.2;
  --text-heading: 24px;
  --leading-heading: 1.15;
  --text-heading-lg: 28px;
  --leading-heading-lg: 1.14;
  --text-display: 32px;
  --leading-display: 1.13;
  --text-display-lg: 40px;
  --leading-display-lg: 1.15;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-80: 80px;
  --spacing-240: 240px;

  /* Border Radius */
  --radius-sm: 3px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 20px;
  --radius-full: 100px;
  --radius-full-2: 800px;

  /* Shadows */
  --shadow-sm: rgba(21, 21, 35, 0.2) 0px 2px 4px 0px;
  --shadow-sm-2: rgba(0, 0, 0, 0.5) 0px 0px 4px 0px;
  --shadow-sm-3: rgba(0, 0, 0, 0.2) 0px 2px 6px 0px;
  --shadow-sm-4: rgba(21, 21, 35, 0.2) 0px 4px 8px 0px;
}
```
