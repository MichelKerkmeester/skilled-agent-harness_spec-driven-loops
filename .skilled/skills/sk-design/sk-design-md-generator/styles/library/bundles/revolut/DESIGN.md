# Revolut — Style Reference
> Monochrome editorial banking on cloud photography — white ink, pill buttons, one blue ribbon of color in an otherwise grayscale world.

**Theme:** light

Revolut runs an editorial-monochrome banking language: the product UI is nearly entirely achromatic — white surfaces, #1f1f1f ink, hairline #c9c9cd dividers — and the entire color budget is outsourced to full-bleed sky photography that washes across hero sections. Aeonik Pro at weight 500 carries every display moment with aggressively tightened tracking (-0.024em at 88px), while Inter at 16px handles all UI density. Controls are exclusively pill-shaped (9999px) in four restrained variants, and the only chromatic element in the entire system is a single blue gradient reserved for the promotional bar. Surfaces prefer to float without shadows — edges do the work that elevation usually would.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Ink | `#1f1f1f` | `--color-ink` | Primary text, footer background, filled dark buttons. The near-black that carries all body and display copy |
| Pure Black | `#000000` | `--color-pure-black` | Button text on light surfaces, pure-black background blocks. Used where maximum contrast is required |
| Bone | `#ffffff` | `--color-bone` | Page canvas, card surfaces, button text on dark fills, button borders on light fills. The dominant surface color across all sections |
| Ash Grey | `#c9c9cd` | `--color-ash-grey` | Hairline borders, disabled dividers, and the dominant link color at 80 occurrences. The neutral that defines edge separation without shadow |
| Mist | `#f7f7f7` | `--color-mist` | List and grouped-background fills — the recessed surface beneath cards, tables, and secondary containers |
| Slate | `#717173` | `--color-slate` | Neutral form states, badge text, and quiet UI feedback where color should stay understated. |
| Graphite | `#4c4c4c` | `--color-graphite` | Tertiary body text, inline badge copy, and minor muted surfaces between true ink and slate |
| Cobalt Wash | `linear-gradient(to right, rgb(18, 39, 253), rgb(111, 160, 255))` | `--color-cobalt-wash` | Promotional bar gradient start. The single chromatic accent in the entire system — only ever appears as part of the blue gradient on top-of-page offer strips |

## Tokens — Typography

### Aeonik Pro — Marketing display and heading face. Weight 500 across the entire scale — never heavier. Used for hero headlines ('Banking & Beyond' at 88px), section headings, and emphasis paragraphs. The signature choice is that no heading goes bolder than 500: authority comes from size and tracking, not weight. · `--font-aeonik-pro`
- **Substitute:** Inter, DM Sans, or Manrope at matching weights
- **Weights:** 400, 500
- **Sizes:** 16, 18, 24, 32, 40, 52, 88
- **Line height:** 1.00, 1.17, 1.19, 1.20, 1.33, 1.38
- **Letter spacing:** -0.0240em at 88px → -0.0120em at 52px → -0.0100em at 40-24px
- **Role:** Marketing display and heading face. Weight 500 across the entire scale — never heavier. Used for hero headlines ('Banking & Beyond' at 88px), section headings, and emphasis paragraphs. The signature choice is that no heading goes bolder than 500: authority comes from size and tracking, not weight.

### Inter — Product UI and body face. Carries all buttons, form labels, navigation, badges, and the 16px default body copy. Uppercase 12px labels open to +0.0150em — the only positive tracking in the system, reserved for micro-tags and button labels to add breathing room at small sizes. · `--font-inter`
- **Substitute:** System UI sans (already in the design tokens as fallback)
- **Weights:** 400, 600, 700
- **Sizes:** 12, 14, 16
- **Line height:** 1.20, 1.50, 1.57
- **Letter spacing:** -0.0100em to -0.0050em for body, +0.0150em for uppercase 12px labels
- **Role:** Product UI and body face. Carries all buttons, form labels, navigation, badges, and the 16px default body copy. Uppercase 12px labels open to +0.0150em — the only positive tracking in the system, reserved for micro-tags and button labels to add breathing room at small sizes.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 18 | 0.18px | `--text-caption` |
| body-sm | 14px | 22 | -0.07px | `--text-body-sm` |
| body | 16px | 19.2 | — | `--text-body` |
| subheading | 18px | 24 | — | `--text-subheading` |
| heading-sm | 24px | 28 | -0.24px | `--text-heading-sm` |
| heading | 32px | 38 | -0.32px | `--text-heading` |
| heading-lg | 40px | 48 | -0.4px | `--text-heading-lg` |
| display | 52px | 52 | -0.624px | `--text-display` |
| display-xl | 88px | 88 | -2.112px | `--text-display-xl` |

## Tokens — Spacing & Shapes

**Base unit:** 8px

**Density:** compact

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 8 | 8px | `--spacing-8` |
| 16 | 16px | `--spacing-16` |
| 24 | 24px | `--spacing-24` |
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 56 | 56px | `--spacing-56` |
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |
| 232 | 232px | `--spacing-232` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 9999px |
| cards | 22.5px |
| lists | 20px |
| buttons | 9999px |
| smallControls | 12px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 24px
- **Element gap:** 8px

## Components

### Pill Button (Light)
**Role:** Primary button on light surfaces and hero sections

White background, #1f1f1f text, #1f1f1f 2px border, 9999px radius, 10px 24px padding. 16px Inter weight 600. The 'Explore Savings' and 'Sign up' variant.

### Pill Button (Dark)
**Role:** Primary button on photo and light hero contexts

#1f1f1f background, white text, 9999px radius, 0px 20px padding with vertical centering. The 'Download the app' CTA — appears as a solid dark pill that photographs cleanly against sky imagery.

### Pill Button (Ghost on Photo)
**Role:** Secondary action over photographic backgrounds

rgba(255,255,255,0.1) background, white text, white 1px border, 9999px radius, 10px 24px padding. Glassmorphic treatment for buttons sitting on top of hero photography.

### Pill Button (Text Link)
**Role:** Inline interactive link styled as a button

Transparent background, #1f1f1f at 80% opacity text, 12px radius, no padding. Smaller interactive elements inside body copy.

### Promo Gradient Bar
**Role:** Top-of-page offer strip

linear-gradient(to right, #1227fd, #6fa0ff), 16px Inter weight 400 white text, centered. The only chromatic surface in the entire design system. 32-40px tall. Contains an underlined white link.

### Navigation Header
**Role:** Primary site navigation

Dark #1f1f1f band across the top. White 'Revolut' wordmark left, 16px Inter nav items centered, 'Log in' text + 'Sign up' pill right. Sits above photo heroes without competing with them.

### Location Selector Pill
**Role:** Country/region switcher in the top utility bar

White background, 9999px radius, country flag emoji + label, 12-16px Inter. Sits inside a white utility strip above the dark nav.

### Phone Preview Card
**Role:** Product screenshot overlay on hero sections

22.5px top-left/top-right radius, 0px bottom radius. Full-bleed photo behind it, white card overlapping the photo bottom. Internal product UI shows on a clean white surface with a pill label like 'Accounts'.

### Pricing Tier Card
**Role:** Three-column plan comparison on dark background

White background, 22.5px radius, 24-40px internal padding. Tier name (Aeonik Pro 24px weight 500), price (Aeonik Pro 32px weight 500), description body. Sits on a #1f1f1f section background to maximize card contrast.

### Trust Badge Block
**Role:** Award/social-proof cell in the social proof grid

Transparent background, centered logo or icon, 12-14px Inter caption below in #717173. Arranged in 3-column or 4-column grids separated by 40-80px gaps.

### Section Header (Muted)
**Role:** Section-level subheading above gridded content

24-40px Aeonik Pro weight 500, color #717173 (not #1f1f1f). The choice to use slate for section titles instead of ink is deliberate — it creates a calm editorial rhythm between hero and content.

### List Container
**Role:** Grouped content rows (feature lists, FAQ items)

#f7f7f7 background, 20px radius, 16-24px internal padding. The recessed surface that sits one step below card white.

## Do's and Don'ts

### Do
- Use 9999px radius for every button, tag, and input — pill geometry is the signature.
- Keep display headlines at Aeonik Pro weight 500, never heavier — authority comes from size, not weight.
- Reserve #1227fd→#6fa0ff gradient exclusively for the top promotional bar; never use it on buttons, cards, or section backgrounds.
- Use #c9c9cd hairlines (1-2px) instead of shadows to separate cards and lists from the page canvas.
- Let full-bleed photography carry all color and atmosphere — keep UI surfaces #ffffff, #f7f7f7, or #1f1f1f.
- Apply tightening tracking at every display size: -0.024em at 88px through -0.010em at 24px, opening only at 12px uppercase (+0.015em).
- Place pricing and conversion sections on #1f1f1f backgrounds with white cards — the dark/light flip is the pricing module's signature.

### Don't
- Don't introduce new chromatic colors — the palette is 7 neutrals and one blue gradient, and that's the whole system.
- Don't apply shadows to cards or buttons — separation is achieved with #c9c9cd borders and surface color shifts, not elevation.
- Don't use a heading weight above 500 on Aeonik Pro — going to 600/700 breaks the editorial calm.
- Don't place the promo gradient on hero sections, buttons, or product cards — it loses its meaning if it appears more than once per page.
- Don't use square or slightly-rounded corners on primary actions — pills (9999px) are the only acceptable control shape.
- Don't mix Inter and Aeonik Pro at the same size — Aeonik Pro owns 18px and above, Inter owns 16px and below.
- Don't use color to indicate state on neutral surfaces — use opacity shifts and border weight instead (e.g. #1f1f1f at 80% vs 100%).

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#ffffff` | Default page background for all editorial and content sections |
| 1 | Recessed | `#f7f7f7` | List groups, grouped backgrounds, secondary containers below cards |
| 2 | Edge | `#c9c9cd` | Hairline dividers and disabled-state borders, not a background |
| 3 | Card | `#ffffff` | Card and pricing tier surfaces (visually identical to canvas but defined by radius and border) |
| 4 | Inverted | `#1f1f1f` | Dark section bands, footer, navigation, and filled dark buttons |

## Elevation

Revolut's design system deliberately avoids elevation shadows on standard cards and buttons. Surface separation is achieved through three mechanisms instead: (1) color shifts from #ffffff canvas to #f7f7f7 recessed, (2) hairline #c9c9cd 1-2px borders, and (3) full-bleed dark-to-light section bands (#1f1f1f pricing footer under white content). The shadow tokens exist in the system for popovers and modals only.

## Imagery

Photography is the primary color source. Hero sections use full-bleed, high-key sky-and-cloud photography — pale blues, whites, and warm skin tones — that acts as the canvas for white display headlines. People are shot close-up, looking off-camera, in soft natural light, with a candid editorial feel rather than staged commercial poses. No decorative graphics, no 3D renders, no illustrations. Icons throughout the product are monochrome line icons at 1.5-2px stroke weight, neutral-colored, never filled with brand color. Award logos in the trust section are full-color third-party brand marks on white. Product UI is shown via iPhone-frame overlays with 22.5px top radius, never as flat screenshots.

## Agent Prompt Guide

**Quick Color Reference**
- text: #1f1f1f
- background: #ffffff
- border: #c9c9cd
- muted text: #717173
- recessed surface: #f7f7f7
- dark surface: #1f1f1f
- primary action: #1f1f1f (filled action)
- promo accent: linear-gradient(to right, #1227fd, #6fa0ff)

**Example Component Prompts**

1. **Hero headline overlay**: Full-bleed sky photograph as background. Display headline at 88px Aeonik Pro weight 500, white, letter-spacing -2.112px. Subtext at 18px Aeonik Pro weight 400, white, line-height 24px. Dark pill button below: #1f1f1f background, white text, 9999px radius, 10px 24px padding, 16px Inter weight 600.

2. **Pricing tier card**: Three cards on a #1f1f1f section background. Each card: white background, 22.5px radius, 32px padding. Tier name at 24px Aeonik Pro weight 500 #1f1f1f, price at 32px Aeonik Pro weight 500 #1f1f1f, description at 16px Inter weight 400 #4c4c4c.

3. **Promotional bar**: linear-gradient(to right, #1227fd, #6fa0ff) background, 40px tall, centered. Text: 16px Inter weight 400 white. Underlined white link inline.

4. **Trust badge grid cell**: Transparent background, 40-80px gap to neighboring cells. Logo or icon centered, 12-14px Inter caption below in #717173.

5. **Section header**: 24-40px Aeonik Pro weight 500, color #717173 (not #1f1f1f), centered, max-width 800px. This slate color for section titles is the system's calm editorial signature.

## Photography Direction

Full-bleed sky and cloud photography is the only color source in the system. Treatments should follow three rules: (1) high-key, overexposed skies with soft cumulus clouds — never moody or dark, (2) human subjects shot in editorial close-up, looking off-camera, in warm natural daylight, candid rather than posed, (3) crops that leave generous negative space in the upper portion of the frame so white display headlines can sit cleanly on top without competing with the subject. Product UI is never shown as a flat screenshot — it is always inside a white iPhone-frame card with 22.5px top radius, overlapping the bottom edge of the photograph.

## Similar Brands

- **Apple** — Same full-bleed sky/cloud photography with massive light-weight display headlines overlaid, and the same near-black-on-white editorial restraint
- **Wise (TransferWise)** — Same monochrome fintech language with a single accent color, pill-shaped buttons, and oversized Aeonik-style display type
- **N26** — Same achromatic banking palette and pill-button geometry, though N26 tends to use deeper blacks and heavier contrast
- **Cash App** — Same editorial monochrome approach with full-bleed photography carrying all the color, though Cash App uses green as a brand accent where Revolut uses blue

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-ink: #1f1f1f;
  --color-pure-black: #000000;
  --color-bone: #ffffff;
  --color-ash-grey: #c9c9cd;
  --color-mist: #f7f7f7;
  --color-slate: #717173;
  --color-graphite: #4c4c4c;
  --color-cobalt-wash: #1227fd;
  --gradient-cobalt-wash: linear-gradient(to right, rgb(18, 39, 253), rgb(111, 160, 255));

  /* Typography — Font Families */
  --font-aeonik-pro: 'Aeonik Pro', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 18;
  --tracking-caption: 0.18px;
  --text-body-sm: 14px;
  --leading-body-sm: 22;
  --tracking-body-sm: -0.07px;
  --text-body: 16px;
  --leading-body: 19.2;
  --text-subheading: 18px;
  --leading-subheading: 24;
  --text-heading-sm: 24px;
  --leading-heading-sm: 28;
  --tracking-heading-sm: -0.24px;
  --text-heading: 32px;
  --leading-heading: 38;
  --tracking-heading: -0.32px;
  --text-heading-lg: 40px;
  --leading-heading-lg: 48;
  --tracking-heading-lg: -0.4px;
  --text-display: 52px;
  --leading-display: 52;
  --tracking-display: -0.624px;
  --text-display-xl: 88px;
  --leading-display-xl: 88;
  --tracking-display-xl: -2.112px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 8px;
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-56: 56px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-232: 232px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 24px;
  --element-gap: 8px;

  /* Border Radius */
  --radius-xl: 12px;
  --radius-2xl: 20px;
  --radius-2xl-2: 22.5px;
  --radius-full: 50px;
  --radius-full-2: 9999px;

  /* Named Radii */
  --radius-tags: 9999px;
  --radius-cards: 22.5px;
  --radius-lists: 20px;
  --radius-buttons: 9999px;
  --radius-smallcontrols: 12px;

  /* Surfaces */
  --surface-canvas: #ffffff;
  --surface-recessed: #f7f7f7;
  --surface-edge: #c9c9cd;
  --surface-card: #ffffff;
  --surface-inverted: #1f1f1f;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-ink: #1f1f1f;
  --color-pure-black: #000000;
  --color-bone: #ffffff;
  --color-ash-grey: #c9c9cd;
  --color-mist: #f7f7f7;
  --color-slate: #717173;
  --color-graphite: #4c4c4c;
  --color-cobalt-wash: #1227fd;

  /* Typography */
  --font-aeonik-pro: 'Aeonik Pro', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 18;
  --tracking-caption: 0.18px;
  --text-body-sm: 14px;
  --leading-body-sm: 22;
  --tracking-body-sm: -0.07px;
  --text-body: 16px;
  --leading-body: 19.2;
  --text-subheading: 18px;
  --leading-subheading: 24;
  --text-heading-sm: 24px;
  --leading-heading-sm: 28;
  --tracking-heading-sm: -0.24px;
  --text-heading: 32px;
  --leading-heading: 38;
  --tracking-heading: -0.32px;
  --text-heading-lg: 40px;
  --leading-heading-lg: 48;
  --tracking-heading-lg: -0.4px;
  --text-display: 52px;
  --leading-display: 52;
  --tracking-display: -0.624px;
  --text-display-xl: 88px;
  --leading-display-xl: 88;
  --tracking-display-xl: -2.112px;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-56: 56px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-232: 232px;

  /* Border Radius */
  --radius-xl: 12px;
  --radius-2xl: 20px;
  --radius-2xl-2: 22.5px;
  --radius-full: 50px;
  --radius-full-2: 9999px;
}
```
