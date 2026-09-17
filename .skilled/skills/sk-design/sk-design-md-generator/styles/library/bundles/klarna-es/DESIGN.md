# Klarna ES — Style Reference
> midnight gallery with candy accents — a near-black plum void opens onto a warm bone-white floor scattered with vibrant product cards, anchored by oversized geometric type and pill-shaped controls.

**Theme:** light

Klarna's visual system is a confident dark-meets-light duality: a near-black plum (#0b051d) anchors brand presence across the hero and display type, set against a warm bone-white canvas (#f9f8f5) that keeps content sections approachable rather than clinical. Oversized custom display typography at 90px commands the hero, while compact body text at 16px stays quiet and legible. Playful accent colors — bubblegum pink, lavender, lime, deep plum — appear as small punctuation on cards and CTAs, never as structural or background elements. Generous rounded corners (16-32px on cards, pill-shaped buttons), near-zero shadows, and hairline borders create a premium, almost gallery-like feel where depth comes from color contrast and scale, not from elevation.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Midnight Plum | `#0b051d` | `--color-midnight-plum` | Violet supporting accent for decorative details and low-frequency emphasis. |
| Deep Plum | `#2c2242` | `--color-deep-plum` | Accent card background — a slightly lifted version of Midnight Plum, used for dark-themed product/feature cards to create tonal variation within the dark family |
| Lavender Mist | `#aa89f2` | `--color-lavender-mist` | Violet supporting accent for decorative details and low-frequency emphasis |
| Lime Sherbet | `#e6ffa9` | `--color-lime-sherbet` | Accent card background — high-key lime used as a rotating card surface color. High contrast against Midnight Plum text makes it ideal for dark-on-light product cards |
| Bubblegum Pink | `#ffa8cd` | `--color-bubblegum-pink` | Red supporting accent for decorative details and low-frequency emphasis. Do not promote it to the primary CTA color |
| Warm Bone | `#f9f8f5` | `--color-warm-bone` | Page canvas — the warm off-white that fills the body of every content section. Slightly cream-toned to feel inviting rather than clinical |
| Pure White | `#ffffff` | `--color-pure-white` | Card surfaces and nav background — used for elevated cards on the Warm Bone canvas, and for the sticky top navigation bar |
| Silver Mist | `#e2e2e7` | `--color-silver-mist` | Hairline borders, input outlines, and card edge definition. Also functions as the inset shadow color on buttons (rgb(228, 227, 223) inset ring) |
| Storm Gray | `#615f6d` | `--color-storm-gray` | Primary muted text — body copy, nav links, secondary descriptions. Near-gray with a slight cool violet undertone matching the brand |
| Slate Gray | `#75727f` | `--color-slate-gray` | Secondary text — captions, helper text, fine print, and less prominent body copy |
| Charcoal Plum | `#373544` | `--color-charcoal-plum` | Dark UI text and button borders — used on pill buttons and nav controls where a softer dark than Midnight Plum is needed |
| Ash Gray | `#999999` | `--color-ash-gray` | Tertiary neutral — placeholder text, disabled states, and very low-emphasis UI elements |

## Tokens — Typography

### Klarna Title — Custom display font used exclusively for headings and hero text. Sizes escalate dramatically (40→58→90px) with tight 1.05-1.10 line-height — the 90px hero weight is a signature: oversized geometric type that commands the viewport. Normal letter-spacing at these sizes lets the letterforms breathe at their natural width. · `--font-klarna-title`
- **Substitute:** Inter, system-ui, -apple-system
- **Weights:** 500, 700
- **Sizes:** 40px, 41px, 52px, 58px, 90px
- **Line height:** 1.05, 1.06, 1.10
- **Letter spacing:** normal
- **Role:** Custom display font used exclusively for headings and hero text. Sizes escalate dramatically (40→58→90px) with tight 1.05-1.10 line-height — the 90px hero weight is a signature: oversized geometric type that commands the viewport. Normal letter-spacing at these sizes lets the letterforms breathe at their natural width.

### Klarna Text — Custom UI/body font for navigation labels, input text, and smaller headings. Slight negative tracking (-0.01em) tightens display usage; -0.003em for body keeps text compact without feeling cramped. Weight 500 for nav, 700 for subheadings, 400 for body. · `--font-klarna-text`
- **Substitute:** Inter, system-ui, -apple-system
- **Weights:** 400, 500, 700
- **Sizes:** 14px, 16px, 20px
- **Line height:** 1.05, 1.20, 1.30
- **Letter spacing:** -0.0100em, -0.0030em
- **Role:** Custom UI/body font for navigation labels, input text, and smaller headings. Slight negative tracking (-0.01em) tightens display usage; -0.003em for body keeps text compact without feeling cramped. Weight 500 for nav, 700 for subheadings, 400 for body.

### -apple-system — System font fallback for body text, links, buttons, and general UI at 12-20px. Tighter line-heights (1.14-1.20) for compact UI elements, relaxed 1.43-1.50 for readable body paragraphs. · `--font-apple-system`
- **Substitute:** -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif
- **Weights:** 400, 500
- **Sizes:** 12px, 14px, 16px, 20px
- **Line height:** 1.00, 1.05, 1.14, 1.20, 1.25, 1.43, 1.50
- **Letter spacing:** -0.0030em
- **Role:** System font fallback for body text, links, buttons, and general UI at 12-20px. Tighter line-heights (1.14-1.20) for compact UI elements, relaxed 1.43-1.50 for readable body paragraphs.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.5 | — | `--text-caption` |
| body-sm | 14px | 1.43 | -0.003px | `--text-body-sm` |
| body | 16px | 1.5 | -0.003px | `--text-body` |
| subheading | 20px | 1.25 | — | `--text-subheading` |
| heading-sm | 40px | 1.1 | — | `--text-heading-sm` |
| heading | 52px | 1.06 | — | `--text-heading` |
| heading-lg | 58px | 1.05 | — | `--text-heading-lg` |
| display | 90px | 1.05 | — | `--text-display` |

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
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 20px |
| cards | 16px |
| pills | 999px |
| images | 32px |
| inputs | 20px |
| buttons | 100px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| sm | `rgba(0, 0, 0, 0.1) 0px 2px 4px 0px` | `--shadow-sm` |
| subtle | `rgb(228, 227, 223) 0px 0px 0px 1px inset` | `--shadow-subtle` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 48px
- **Card padding:** 24px
- **Element gap:** 16px

## Components

### Top Navigation Bar
**Role:** Sticky header with logo, nav links, search, and sign-in

White (#ffffff) background, full-width, ~64px height. Klarna wordmark left in Midnight Plum, nav links centered in Storm Gray with 500 weight, search icon and dark 'Inicio de sesión' pill button right. Nav links: 'Descubre Klarna', 'Compra', 'App de Klarna', 'Ayuda'. Top utility row above in small text.

### Pink Accent CTA Button
**Role:** Primary action call-to-action in hero and feature areas

Pill-shaped (100px border-radius), Bubblegum Pink (#ffa8cd) background, Midnight Plum (#0b051d) text at 16px weight 500, padding ~10px 20px. This is the playful action color — warm and inviting. Use sparingly, one per screen at most.

### Dark Sign-in Pill Button
**Role:** Navigation sign-in / login action

Pill-shaped (100px radius), Midnight Plum (#0b051d) background, white text, 16px weight 500, 10px 20px padding. Contrasts with the pink CTA as the 'serious' counterpart action in the nav bar.

### Ghost Text Link with Arrow
**Role:** Secondary navigation link under feature cards

No background or border, Storm Gray (#615f6d) text at 16px, right-arrow icon (→) inlined. Text: 'Más información' or 'Descarga la app'. Underlined on hover.

### Dark Hero Section
**Role:** Full-bleed opening section with headline and product visual

Full-width Midnight Plum (#0b051d) background, ~560px height. Left: 90px display headline in white. Right: phone mockup image with 32px border-radius. Below headline: body text in lighter gray with a pink CTA button. The dark hero is a signature — it sets a premium, gallery-like tone before transitioning to the warm light canvas.

### White Feature Card
**Role:** Light card in the feature grid with product image

White (#ffffff) background, 16px border-radius, image area with 32px radius, 24px padding. Card title in 20px Midnight Plum weight 700, 'Más información →' text link below. Subtle drop shadow: rgba(0,0,0,0.1) 0 2px 4px.

### Accent Feature Card (Colored)
**Role:** Vibrant product/feature card with colored background

Full-bleed colored background — rotating between Lavender Mist (#aa89f2), Lime Sherbet (#e6ffa9), Deep Plum (#2c2242). 16px border-radius, product image or illustration fills the card. Title in 20px weight 700, link arrow below. These cards bring the 'candy' to the gallery — they should be scattered, not grouped, for visual rhythm.

### Section Heading Block
**Role:** Large section title introducing a content area

Left-aligned, 40-58px Klarna Title weight 500-700, Midnight Plum text, no subtitle. Tight line-height (1.05-1.10). Typically sits above a card grid or feature row with 48px gap below.

### Search Input
**Role:** Rounded search field in the nav bar

Circular/pill input, Warm Bone (#f9f8f5) background, Silver Mist (#e2e2e7) 1px inset border, search icon left, placeholder text in Ash Gray. 20px+ border-radius for pill shape.

### App Rating Badge
**Role:** Social proof indicator in the hero

Small inline element: star icon (★) + rating text in white, '4,8/5 en el App Store'. No background or border, sits inline with hero description text.

### Legal Disclaimer Block
**Role:** Fine print and regulatory text

Full-width below feature cards, Storm Gray (#615f6d) text at 12-14px, tight line-height, with underlined links. Multi-paragraph, separated by superscript markers (1, 2, 3). Uses the system font, not Klarna Text.

### Phone Mockup Visual
**Role:** Hero product screenshot showing the Klarna app

Large image of a hand holding a phone, phone screen showing payment options. 32px border-radius on the phone frame. Takes up roughly 40% of the hero width. The human hand (with neon green sleeve, gold rings, yellow nails) adds warmth and lifestyle context — this is the only photography in the system.

## Do's and Don'ts

### Do
- Use Midnight Plum (#0b051d) for all display headlines, hero backgrounds, and primary text — it's the signature brand color
- Set page background to Warm Bone (#f9f8f5) for all content sections; reserve Midnight Plum for full-bleed dark sections only
- Scale Klarna Title aggressively: 40px for section headings, 58px for major, 90px for hero — tight line-height (1.05-1.10) is essential
- Use pill-shaped buttons (100px border-radius) for all interactive controls; pink (#ffa8cd) for accent CTAs, Midnight Plum for serious actions
- Place accent cards (lavender, lime, deep plum) as individual scattered items, never in consecutive pairs — rhythm requires breathing room
- Use 16px border-radius for cards and 32px for images/visuals; avoid 4-8px radii which would feel too sharp for this system
- Keep shadows minimal: a single rgba(0,0,0,0.1) 0 2px 4px on cards, and 1px inset #e2e2e7 borders on buttons — never stack or blur shadows

### Don't
- Don't use gray or neutral backgrounds for CTA buttons — pink (#ffa8cd) and Midnight Plum (#0b051d) are the only button fills
- Don't use small heading sizes — the system requires 40px+ for any heading-level text; 16-20px is body/UI only
- Don't add heavy drop shadows, glows, or glassmorphism — the design relies on flat color contrast for depth
- Don't use pure black (#000000) — always use Midnight Plum (#0b051d) for dark elements to maintain the violet undertone
- Don't group accent cards together (lavender next to lime next to plum) — intersperse with white cards for visual rest
- Don't use line-heights above 1.20 for display type — the tight 1.05-1.10 line-height is what makes the oversized headlines feel controlled
- Don't use system fonts for display headings — Klarna Title at 40px+ is the signature and must not be replaced with generic sans-serif

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Page Canvas | `#f9f8f5` | Warm off-white body background filling all content sections |
| 1 | Card Surface | `#ffffff` | White cards sitting on the Warm Bone canvas, and the top nav bar |
| 2 | Accent Card Surfaces | `#aa89f2` | Vibrant rotating card backgrounds (lavender, lime, deep plum) for feature/product showcases |
| 3 | Dark Hero Surface | `#0b051d` | Full-bleed dark hero section and dark-themed product cards |

## Elevation

- **Card:** `rgba(0, 0, 0, 0.1) 0px 2px 4px 0px`
- **Button (inset border):** `rgb(228, 227, 223) 0px 0px 0px 1px inset`

## Imagery

Imagery is minimal but intentional. The hero features a single large lifestyle photograph: a hand with neon green sleeve, gold rings, and yellow-painted nails holding a phone displaying the Klarna app. This is the only photography in the system and it carries significant weight — the hand's bold styling mirrors the playful accent palette. Product screenshots appear in feature cards, shown on phone frames with 32px corner radius. No illustrations, no abstract graphics, no 3D renders. The visual language is: one warm human moment, surrounded by colorful product cards, set against generous white space.

## Layout

The page uses a max-width 1200px centered container with full-bleed dark hero. The hero is a split layout: oversized left-aligned headline (occupying ~45% width) paired with a right-aligned phone mockup (~40% width). Below the hero, the page flows in single full-width bands of Warm Bone (#f9f8f5) canvas, each containing centered content. The primary content pattern is a 4-column card grid (gap: 24px) with a section heading above. Cards alternate between white and accent-colored backgrounds for visual rhythm. Navigation is a sticky white top bar with centered links, search icon, and dark sign-in pill button right-aligned. Vertical rhythm is generous: 48px section gaps, 16px element gaps, 24px card padding. The overall page reads as: dark dramatic opening → light airy content with colorful product cards → quiet legal disclaimer band.

## Agent Prompt Guide

primary action: no distinct CTA color
**Quick Color Reference**
- text: #0b051d (Midnight Plum)
- background: #f9f8f5 (Warm Bone)
- surface/card: #ffffff (Pure White)
- border: #e2e2e7 (Silver Mist)
- muted text: #615f6d (Storm Gray)
No distinct primary action color was observed; use the extracted neutral button treatments instead of inventing a filled CTA color.

**3-5 Example Component Prompts**


2. **Feature Card Grid Row**: 4-column grid on Warm Bone (#f9f8f5) background, 24px gap. Each card: 16px border-radius, 24px padding. Alternating card styles: Card 1 white with product image, Card 2 Lavender Mist (#aa89f2) with dark product image, Card 3 Deep Plum (#2c2242) with white text, Card 4 Lime Sherbet (#e6ffa9) with dark product. Card title: 20px weight 700, Midnight Plum. 'Más información →' text link below in Storm Gray.

3. **Section Heading**: 48px Klarna Title weight 500, Midnight Plum, line-height 1.10, left-aligned on Warm Bone canvas. 48px gap below to the content grid.

4. **Pill Accent Button**: Bubblegum Pink (#ffa8cd) background, Midnight Plum (#0b051d) text, 16px weight 500, 10px 20px padding, 100px border-radius. Use as the playful action button in hero or feature areas.


## Accent Card System

Klarna's signature visual rhythm comes from a rotating set of four accent card backgrounds: Lavender Mist (#aa89f2), Lime Sherbet (#e6ffa9), Deep Plum (#2c2242), and the default white surface. These appear in 4-column feature grids and are never used as page backgrounds. The key rule: never place two accent cards adjacent to each other — always intersperse with white cards. This creates a breathing rhythm where color appears as punctuation, not as a wall. Deep Plum (#2c2242) should be treated as a 'dark accent' — it uses white text and mirrors the Midnight Plum hero tonally, creating a bridge between light and dark sections.

## Similar Brands

- **Revolut** — Same dark-on-light duality with a deep near-black brand color, oversized geometric headlines, and rounded card components in a fintech context
- **N26** — Similar premium fintech visual language with generous border-radius, pill-shaped controls, and a restrained palette with single vibrant accent moments
- **Cash App** — Shares the playful approach to fintech with vibrant accent colors (pink/lime) scattered across cards on a light canvas, though Cash App leans more saturated
- **Wise** — Same warm off-white canvas treatment, oversized custom display typography, and minimal shadow philosophy where depth comes from color contrast
- **Spotify** — Similar confident use of oversized display type, dark hero-to-light-content transition, and a restrained base palette that lets accent colors pop on cards

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-midnight-plum: #0b051d;
  --color-deep-plum: #2c2242;
  --color-lavender-mist: #aa89f2;
  --color-lime-sherbet: #e6ffa9;
  --color-bubblegum-pink: #ffa8cd;
  --color-warm-bone: #f9f8f5;
  --color-pure-white: #ffffff;
  --color-silver-mist: #e2e2e7;
  --color-storm-gray: #615f6d;
  --color-slate-gray: #75727f;
  --color-charcoal-plum: #373544;
  --color-ash-gray: #999999;

  /* Typography — Font Families */
  --font-klarna-title: 'Klarna Title', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-klarna-text: 'Klarna Text', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-apple-system: '-apple-system', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --text-body-sm: 14px;
  --leading-body-sm: 1.43;
  --tracking-body-sm: -0.003px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.003px;
  --text-subheading: 20px;
  --leading-subheading: 1.25;
  --text-heading-sm: 40px;
  --leading-heading-sm: 1.1;
  --text-heading: 52px;
  --leading-heading: 1.06;
  --text-heading-lg: 58px;
  --leading-heading-lg: 1.05;
  --text-display: 90px;
  --leading-display: 1.05;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 8px;
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-80: 80px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 48px;
  --card-padding: 24px;
  --element-gap: 16px;

  /* Border Radius */
  --radius-sm: 2px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-3xl: 24px;
  --radius-3xl-2: 28px;
  --radius-3xl-3: 32px;
  --radius-full: 100px;
  --radius-full-2: 999px;

  /* Named Radii */
  --radius-nav: 20px;
  --radius-cards: 16px;
  --radius-pills: 999px;
  --radius-images: 32px;
  --radius-inputs: 20px;
  --radius-buttons: 100px;

  /* Shadows */
  --shadow-sm: rgba(0, 0, 0, 0.1) 0px 2px 4px 0px;
  --shadow-subtle: rgb(228, 227, 223) 0px 0px 0px 1px inset;

  /* Surfaces */
  --surface-page-canvas: #f9f8f5;
  --surface-card-surface: #ffffff;
  --surface-accent-card-surfaces: #aa89f2;
  --surface-dark-hero-surface: #0b051d;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-midnight-plum: #0b051d;
  --color-deep-plum: #2c2242;
  --color-lavender-mist: #aa89f2;
  --color-lime-sherbet: #e6ffa9;
  --color-bubblegum-pink: #ffa8cd;
  --color-warm-bone: #f9f8f5;
  --color-pure-white: #ffffff;
  --color-silver-mist: #e2e2e7;
  --color-storm-gray: #615f6d;
  --color-slate-gray: #75727f;
  --color-charcoal-plum: #373544;
  --color-ash-gray: #999999;

  /* Typography */
  --font-klarna-title: 'Klarna Title', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-klarna-text: 'Klarna Text', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-apple-system: '-apple-system', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --text-body-sm: 14px;
  --leading-body-sm: 1.43;
  --tracking-body-sm: -0.003px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.003px;
  --text-subheading: 20px;
  --leading-subheading: 1.25;
  --text-heading-sm: 40px;
  --leading-heading-sm: 1.1;
  --text-heading: 52px;
  --leading-heading: 1.06;
  --text-heading-lg: 58px;
  --leading-heading-lg: 1.05;
  --text-display: 90px;
  --leading-display: 1.05;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-80: 80px;

  /* Border Radius */
  --radius-sm: 2px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-3xl: 24px;
  --radius-3xl-2: 28px;
  --radius-3xl-3: 32px;
  --radius-full: 100px;
  --radius-full-2: 999px;

  /* Shadows */
  --shadow-sm: rgba(0, 0, 0, 0.1) 0px 2px 4px 0px;
  --shadow-subtle: rgb(228, 227, 223) 0px 0px 0px 1px inset;
}
```
