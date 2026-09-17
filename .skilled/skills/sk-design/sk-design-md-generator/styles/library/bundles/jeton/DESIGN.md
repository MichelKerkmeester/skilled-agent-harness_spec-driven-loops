# Jeton — Style Reference
> Editorial fintech on warm marble

**Theme:** light

Jeton operates as a fintech operating system on a near-blank canvas: vast white space, one searing orange-red accent, and typography that does all the talking. The interface is deliberately flat — no heavy elevations, no decorative borders — relying on generous whitespace, rounded geometric cards, and a single warm hue (#f73b20) to create visual punctuation. Headlines are oversized and tight-set (line-height 0.9–1.0 at 100+px), giving the page a confident, editorial rhythm rather than a dense SaaS feel. Color appears sparingly: orange for brand voice, near-black brown (#360802) for body text, and the occasional pastel wash for feature cards. The result reads like a magazine spread for financial infrastructure — restrained, spacious, and unmistakably bold.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Signal Orange | `#f73b20` | `--color-signal-orange` | Brand accent for headings, links, icons, and key emphasis — the sole chromatic voice on an otherwise monochrome page |
| Brand Orange Tint | `#f84d35` | `--color-brand-orange-tint` | Subtle orange surface variant for small UI moments like nav indicators |
| Ink Roast | `#360802` | `--color-ink-roast` | Primary body and input text — a warm near-black that ties body copy to the orange accent family |
| Paper White | `#ffffff` | `--color-paper-white` | Page canvas and card surfaces — dominant background across all sections |
| Carbon Black | `#000000` | `--color-carbon-black` | Secondary text and utility icons — used sparingly for currency labels and meta information |
| Ash Grey | `#ababab` | `--color-ash-grey` | Disabled states, placeholder text, and low-emphasis dividers |
| Sand Wash | `#e7dcdb` | `--color-sand-wash` | Tinted neutral surface for subtle section differentiation |
| Linen Blush | `#fdedea` | `--color-linen-blush` | Ultra-light orange-tinted surface — warm card or row background |
| Citrus Wash | `#f5ffbb` | `--color-citrus-wash` | Pale yellow-green surface tint for feature highlights |
| Mint Wash | `#bcffbb` | `--color-mint-wash` | Green wash for highlight backgrounds, decorative bands, and soft emphasis behind content |
| Coral Red | `#fb2d54` | `--color-coral-red` | Card accent and section heading for Exchange/currency category — secondary chromatic |
| Cobalt Blue | `#477ee9` | `--color-cobalt-blue` | Card accent and section heading for Send category — secondary chromatic |
| Emerald Green | `#34c771` | `--color-emerald-green` | Card accent and section heading for Add/funding category — secondary chromatic |

## Tokens — Typography

### Sequel Sans — Sole typeface across all contexts — a custom geometric grotesque that carries the entire brand voice. Weight 500 is used universally even at 155px display sizes; the weight stays constant because the size and tight line-height carry the hierarchy, not boldness. Letter-spacing is microscopic positive tracking (0.01em at display, 0.03em at small caps/nav) which keeps the geometric forms crisp at every scale. · `--font-sequel-sans`
- **Substitute:** Inter, Manrope, or DM Sans
- **Weights:** 400, 450, 500
- **Sizes:** 12, 14, 16, 23, 33, 44, 72, 106, 110, 155
- **Line height:** 0.90 / 1.00 / 1.20 / 1.25 / 1.40 / 1.50
- **Letter spacing:** 0.0100em at display/heading (72–155px), 0.0300em at small text (12–14px nav, labels, buttons)
- **Role:** Sole typeface across all contexts — a custom geometric grotesque that carries the entire brand voice. Weight 500 is used universally even at 155px display sizes; the weight stays constant because the size and tight line-height carry the hierarchy, not boldness. Letter-spacing is microscopic positive tracking (0.01em at display, 0.03em at small caps/nav) which keeps the geometric forms crisp at every scale.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.5 | 0.36px | `--text-caption` |
| body-sm | 14px | 1.4 | 0.42px | `--text-body-sm` |
| body | 16px | 1 | — | `--text-body` |
| subheading | 23px | 1.2 | 0.23px | `--text-subheading` |
| heading-sm | 33px | 1.2 | 0.33px | `--text-heading-sm` |
| heading | 44px | 1.2 | 0.44px | `--text-heading` |
| heading-lg | 72px | 1 | 0.72px | `--text-heading-lg` |
| display | 106px | 1 | — | `--text-display` |

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
| 48 | 48px | `--spacing-48` |
| 56 | 56px | `--spacing-56` |
| 160 | 160px | `--spacing-160` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 84px |
| cards | 16px |
| links | 8px |
| pills | 9999px |
| inputs | 16px |
| buttons | 12px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| lg | `rgba(247, 59, 32, 0.1) 0px 8px 24px 0px, rgba(247, 59, 32...` | `--shadow-lg` |
| md | `rgba(0, 0, 0, 0.05) 0px -4px 16px 0px` | `--shadow-md` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 16px
- **Element gap:** 8px

## Components

### Primary Pill Button
**Role:** Main call-to-action control

Filled #f73b20 background, white text, 12px border-radius, 8px vertical / 16px horizontal padding. Sets at 14px Sequel Sans weight 450 with 0.03em tracking. Used for the principal action on each screen.

### Ghost Text Link
**Role:** Inline navigation and secondary actions

No background, #f73b20 text, 8px border-radius, 8px padding. Sits inline within body copy or as a standalone link with an arrow indicator.

### White Ghost Button
**Role:** Action button on light surfaces

Transparent background, #ffffff text with 1px white border, 84px border-radius for pill shape. 16px horizontal padding. Used in nav context.

### Outline Brand Button
**Role:** Secondary action with brand emphasis

Transparent background, #f73b20 text, 1px #f73b20 border, no radius, zero padding. Pure underlined-text treatment for inline CTAs like 'Get Started' and 'Learn more'.

### Utility Icon Button
**Role:** Compact control for toggles or currency selection

Transparent background, #000000 text, 16px border-radius, 12px all-side padding. Houses small icon or short label like 'EUR' / 'GBP'.

### Frosted Glass Card
**Role:** Translucent surface card for floating panels

rgba(255,255,255,0.1) background, 16px border-radius, 16px all-side padding, backdrop-filter blur(20px–40px). Rises above the hero with subtle depth.

### Feature Category Card
**Role:** Category tiles for actions like Exchange, Send, Add

Colored pastel-tinted background (rgba(247,59,32,0.05) or accent color), 16px border-radius, variable padding. Houses a large colored icon and category heading.

### Floating Input Field
**Role:** Form input with generous left padding for icons

rgba(247,59,32,0.05) background, #360802 text, 16px border-radius, 17.6px top / 6.4px bottom / 48px left padding. Warm tint ties input to brand without using a heavy focus border.

### Bordered Content Card
**Role:** Content card with upward shadow lift

White background, 16px border-radius, 16px padding, box-shadow rgba(0,0,0,0.05) 0px -4px 16px 0px — a distinctive inverted shadow that lifts the card from below rather than casting downward.

### Orange-Tinted Card
**Role:** Highlighted content or promotional card

rgba(247,59,32,0.05) background, 16px border-radius. Subtle warmth differentiates it from standard white cards without a heavy border.

### Scroll Indicator
**Role:** Vertical step indicator showing process progress

Numbered list (01, 02, 03, 04) with label, rendered in Sequel Sans at small sizes. Anchors navigation or onboarding flow.

### Top Navigation Bar
**Role:** Primary site navigation

White or transparent background with backdrop blur, nav links in Sequel Sans 14–16px weight 400–450. Right-aligned with 'Personal | Business' toggle and language selector. Pill-shaped outlined button at far right.

## Do's and Don'ts

### Do
- Set display headlines at 72–155px with line-height 0.9–1.0 — the tight leading is non-negotiable and creates the editorial feel.
- Use #f73b20 as the sole chromatic voice across the page; reserve other accent colors (blue, green, coral) exclusively for category-coded feature cards.
- Apply 16px border-radius to cards, inputs, and most containers; use 9999px only for true pill elements like tags or circular controls.
- Pair warm-tinted backgrounds (rgba(247,59,32,0.05)) with #360802 text to create tonal harmony between surface and content.
- Use the inverted shadow pattern (rgba(0,0,0,0.05) 0px -4px 16px) for card lift — it defines the float-from-below aesthetic.
- Maintain letter-spacing of 0.03em on small text (12–14px) and 0.01em on display sizes to keep the geometric grotesque crisp.
- Keep the page canvas #ffffff and let sections separate through whitespace alone rather than alternating background colors.

### Don't
- Don't introduce a secondary typeface — Sequel Sans carries the entire voice at every size and weight.
- Don't use bold weights (600+) — the system stays at 400/450/500 and achieves hierarchy through size, not weight.
- Don't add drop shadows on text or buttons — elevation is expressed only through the two shadow tokens documented.
- Don't use #000000 for body text — #360802 (Ink Roast) is the body color and ties copy to the orange family.
- Don't multiply chromatic accents — if orange appears on a card heading, don't also color the body text or icon in a competing hue.
- Don't set line-height above 1.2 on display sizes — tight leading is a defining feature, not a default.
- Don't use sharp corners (0px radius) on interactive surfaces — even utility buttons maintain 8–16px rounding.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#ffffff` | Page background, dominant surface |
| 1 | Card Surface | `#ffffff` | White card backgrounds with subtle inverted shadow for lift |
| 2 | Orange Tint | `#fdedea` | Warm-tinted surface for highlighted content and input fields |
| 3 | Frosted Glass | `#ffffff1a` | Translucent overlay for floating panels above hero imagery |
| 4 | Category Tint | `#f73b200d` | Subtle brand-tinted background for feature category cards |

## Elevation

- **Content Card:** `rgba(0, 0, 0, 0.05) 0px -4px 16px 0px`
- **Floating Glass Panel:** `rgba(247, 59, 32, 0.1) 0px 8px 24px 0px, rgba(247, 59, 32, 0.05) 0px 2px 8px 0px`

## Imagery

The page relies primarily on typography and geometric UI elements rather than photography. The hero features large editorial headlines in Sequel Sans with generous whitespace. Category icons are simple geometric shapes — circles and rounded forms in accent colors. The brain visualization (seen in reference imagery) is a 3D particle-construct forming an organic shape, representing collective intelligence. Product imagery when present uses tight crops with warm color grading (sepia/hue-rotate filter applied to certain assets: sepia(0.4) hue-rotate(329deg) contrast(1.1) saturate(2.2)). No lifestyle photography — the visual language is abstract, geometric, and editorial.

## Layout

Full-bleed sections with centered max-width content (1200px container). The hero is a massive editorial headline left-aligned with extreme vertical breathing room (155px type with 0.9 line-height). Sections alternate between white canvases and subtle pastel-tinted backgrounds, separated by 80px+ vertical gaps. Navigation is a minimal top bar with logo left, primary nav center, and Personal/Business toggle plus CTA right. Content blocks use generous left-aligned text with supporting visuals positioned to the right or full-width. Card grids appear in feature sections but maintain spacious 2–3 column layouts rather than dense matrices. The overall rhythm is magazine-like: large headlines, brief supporting copy, breathing space, repeat.

## Agent Prompt Guide

**Quick Color Reference**
- Text: #360802 (body), #f73b20 (brand emphasis), #000000 (utility)
- Background: #ffffff (canvas), #fdedea (warm tint), rgba(247,59,32,0.05) (brand tint)
- Border: #e7dcdb (neutral), rgba(247,59,32,0.1) (brand glass)
- Accent: #f73b20 (primary), #477ee9 (send), #34c771 (add), #fb2d54 (exchange)
- primary action: no distinct CTA color

**3-5 Example Component Prompts**

1. **Hero Section**: White #ffffff background. Massive headline 'Unlock collective wisdom.' at 106px Sequel Sans weight 500, #360802 color, line-height 1.0, letter-spacing 0.01em. Subtext at 23px weight 500, #360802, 0.01em tracking. Ghost text link 'Get Started' in #f73b20 with 8px padding and arrow indicator.

2. **Feature Category Card**: Background rgba(247,59,32,0.05), 16px border-radius, 24px padding. Category icon in #f73b20, heading 'Exchange' at 33px Sequel Sans weight 500, #360802, line-height 1.2.

3. **Floating Input Field**: Background rgba(247,59,32,0.05), text #360802, 16px border-radius, padding 17.6px top / 6.4px bottom / 48px left. Placeholder at 23px Sequel Sans weight 500 with 0.01em tracking.

4. **Navigation Bar**: White background with backdrop-filter blur(20px). Logo left, nav links center in 16px Sequel Sans weight 400 #360802, Personal/Business toggle right with outlined pill button (84px radius, 1px #ffffff border, 16px horizontal padding).

5. **Content Card with Inverted Shadow**: White background, 16px border-radius, 16px padding, box-shadow rgba(0,0,0,0.05) 0px -4px 16px 0px. Heading at 44px weight 500 #360802, line-height 1.2.

## Similar Brands

- **Wise** — Same editorial fintech approach with oversized headlines, generous whitespace, and a single warm accent color (green/teal) punctuating an otherwise monochrome page
- **Revolut** — Similar flat card-based layout with category-coded feature tiles and a single dominant brand color against white surfaces
- **Stripe** — Shares the restrained typography-driven hierarchy, generous section gaps, and minimal elevation philosophy — though Stripe uses purple, Jeton uses orange
- **Mercury** — Same confident single-accent approach with warm-tinted input fields and large editorial headlines on white canvases

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-signal-orange: #f73b20;
  --color-brand-orange-tint: #f84d35;
  --color-ink-roast: #360802;
  --color-paper-white: #ffffff;
  --color-carbon-black: #000000;
  --color-ash-grey: #ababab;
  --color-sand-wash: #e7dcdb;
  --color-linen-blush: #fdedea;
  --color-citrus-wash: #f5ffbb;
  --color-mint-wash: #bcffbb;
  --color-coral-red: #fb2d54;
  --color-cobalt-blue: #477ee9;
  --color-emerald-green: #34c771;

  /* Typography — Font Families */
  --font-sequel-sans: 'Sequel Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --tracking-caption: 0.36px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.4;
  --tracking-body-sm: 0.42px;
  --text-body: 16px;
  --leading-body: 1;
  --text-subheading: 23px;
  --leading-subheading: 1.2;
  --tracking-subheading: 0.23px;
  --text-heading-sm: 33px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: 0.33px;
  --text-heading: 44px;
  --leading-heading: 1.2;
  --tracking-heading: 0.44px;
  --text-heading-lg: 72px;
  --leading-heading-lg: 1;
  --tracking-heading-lg: 0.72px;
  --text-display: 106px;
  --leading-display: 1;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-w450: 450;
  --font-weight-medium: 500;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-160: 160px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 16px;
  --element-gap: 8px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-2xl-2: 19.255px;
  --radius-2xl-3: 21.66px;
  --radius-3xl: 24px;
  --radius-full: 60px;
  --radius-full-2: 84px;
  --radius-full-3: 112px;
  --radius-full-4: 150px;
  --radius-full-5: 9999px;

  /* Named Radii */
  --radius-nav: 84px;
  --radius-cards: 16px;
  --radius-links: 8px;
  --radius-pills: 9999px;
  --radius-inputs: 16px;
  --radius-buttons: 12px;

  /* Shadows */
  --shadow-lg: rgba(247, 59, 32, 0.1) 0px 8px 24px 0px, rgba(247, 59, 32, 0.05) 0px 2px 8px 0px;
  --shadow-md: rgba(0, 0, 0, 0.05) 0px -4px 16px 0px;

  /* Surfaces */
  --surface-canvas: #ffffff;
  --surface-card-surface: #ffffff;
  --surface-orange-tint: #fdedea;
  --surface-frosted-glass: #ffffff1a;
  --surface-category-tint: #f73b200d;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-signal-orange: #f73b20;
  --color-brand-orange-tint: #f84d35;
  --color-ink-roast: #360802;
  --color-paper-white: #ffffff;
  --color-carbon-black: #000000;
  --color-ash-grey: #ababab;
  --color-sand-wash: #e7dcdb;
  --color-linen-blush: #fdedea;
  --color-citrus-wash: #f5ffbb;
  --color-mint-wash: #bcffbb;
  --color-coral-red: #fb2d54;
  --color-cobalt-blue: #477ee9;
  --color-emerald-green: #34c771;

  /* Typography */
  --font-sequel-sans: 'Sequel Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --tracking-caption: 0.36px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.4;
  --tracking-body-sm: 0.42px;
  --text-body: 16px;
  --leading-body: 1;
  --text-subheading: 23px;
  --leading-subheading: 1.2;
  --tracking-subheading: 0.23px;
  --text-heading-sm: 33px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: 0.33px;
  --text-heading: 44px;
  --leading-heading: 1.2;
  --tracking-heading: 0.44px;
  --text-heading-lg: 72px;
  --leading-heading-lg: 1;
  --tracking-heading-lg: 0.72px;
  --text-display: 106px;
  --leading-display: 1;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-160: 160px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-2xl-2: 19.255px;
  --radius-2xl-3: 21.66px;
  --radius-3xl: 24px;
  --radius-full: 60px;
  --radius-full-2: 84px;
  --radius-full-3: 112px;
  --radius-full-4: 150px;
  --radius-full-5: 9999px;

  /* Shadows */
  --shadow-lg: rgba(247, 59, 32, 0.1) 0px 8px 24px 0px, rgba(247, 59, 32, 0.05) 0px 2px 8px 0px;
  --shadow-md: rgba(0, 0, 0, 0.05) 0px -4px 16px 0px;
}
```
