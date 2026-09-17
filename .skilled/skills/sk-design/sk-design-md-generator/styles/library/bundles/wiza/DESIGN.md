# Wiza — Style Reference
> Twilight prospecting observatory bathed in lavender mist

**Theme:** light

Wiza operates in a light-mode universe where deep violet ink commands attention against a soft lavender atmosphere. The brand lives between a confident enterprise tool and an approachable consumer product—white surfaces, thin borders, and compact Inter type for dense data interfaces, paired with Britti Sans display headlines that feel geometric and assured. The signature move is the gradient wash: pale lavender backgrounds bleeding white-to-violet-to-peach, making even a sprawling data table feel sunlit. Purple is reserved for authority—headlines, logo, filled actions—while the rest of the UI stays in quiet neutrals, letting contact data breathe.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Deep Iris | `#26114a` | `--color-deep-iris` | Violet supporting accent for decorative details and low-frequency emphasis. Do not promote it to the primary CTA color |
| Plum Velvet | `#312749` | `--color-plum-velvet` | Navigation text, secondary headings, card titles, footer copy — slightly lighter companion to Deep Iris |
| Royal Amethyst | `#3e0079` | `--color-royal-amethyst` | Links, input focus rings, accent strokes, icon highlights — the most saturated violet |
| Mist Violet | `#edecff` | `--color-mist-violet` | Soft highlight washes, tinted section backgrounds, decorative blurs — the lavender atmosphere |
| Lavender Wash | `linear-gradient(90deg, rgb(185, 154, 255), rgb(125, 67, 255) 10%, rgba(125, 67, 255, 0))` | `--color-lavender-wash` | Decorative gradient stops and hero atmosphere |
| Twilight Beam | `linear-gradient(to right, rgb(207, 138, 255), rgb(255, 102, 193), rgb(255, 173, 116), rgb(170, 129, 255))` | `--color-twilight-beam` | Multi-stop decorative gradient for hero glow effects |
| Canvas | `#ffffff` | `--color-canvas` | Page background, card surfaces, input fields, button text on dark fills |
| Paper | `#f6f7fa` | `--color-paper` | Subtle surface lift, table row alternation, secondary card backgrounds |
| Mist | `#e6e2e3` | `--color-mist` | Hairline borders, dividers, subtle separators |
| Smoke | `#c1c7cf` | `--color-smoke` | Disabled states, skeleton placeholders, muted background blocks |
| Ash | `#9491a1` | `--color-ash` | Muted helper text, placeholder copy, secondary metadata |
| Slate | `#615e6e` | `--color-slate` | Secondary body text, descriptions, table metadata |
| Charcoal | `#333333` | `--color-charcoal` | Body text, link text, icon strokes in neutral contexts |
| Carbon | `#222222` | `--color-carbon` | Dark UI elements, near-black accents |
| Ink | `#000000` | `--color-ink` | Maximum contrast text and borders in specific dark UI elements |

## Tokens — Typography

### Britti Sans — Display and heading typeface used exclusively at 24–64px, always weight 500. The 1.0 line-height is distinctive — headings sit tight with no leading slack, creating geometric, almost architectural presence. Substitute with Plus Jakarta Sans (500) or General Sans (500) for closest geometric match. · `--font-britti-sans`
- **Substitute:** Plus Jakarta Sans
- **Weights:** 500
- **Sizes:** 24px, 32px, 40px, 56px, 64px
- **Line height:** 1.00
- **Role:** Display and heading typeface used exclusively at 24–64px, always weight 500. The 1.0 line-height is distinctive — headings sit tight with no leading slack, creating geometric, almost architectural presence. Substitute with Plus Jakarta Sans (500) or General Sans (500) for closest geometric match.

### Inter — Workhorse UI and body typeface. Weight 400 for body, 500 for buttons/nav/table headers, 700 for emphasized labels. The tight size range (12–16px) and compact line-heights signal a data-dense product, not a marketing site. Substitute with Inter directly or IBM Plex Sans. · `--font-inter`
- **Substitute:** Inter
- **Weights:** 400, 500, 700
- **Sizes:** 12px, 14px, 16px
- **Line height:** 1.30–1.50
- **Role:** Workhorse UI and body typeface. Weight 400 for body, 500 for buttons/nav/table headers, 700 for emphasized labels. The tight size range (12–16px) and compact line-heights signal a data-dense product, not a marketing site. Substitute with Inter directly or IBM Plex Sans.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.3 | — | `--text-caption` |
| body-sm | 14px | 1.4 | — | `--text-body-sm` |
| body | 16px | 1.5 | — | `--text-body` |
| subheading | 24px | 1 | — | `--text-subheading` |
| heading-sm | 32px | 1 | — | `--text-heading-sm` |
| heading | 40px | 1 | — | `--text-heading` |
| heading-lg | 56px | 1 | — | `--text-heading-lg` |
| display | 64px | 1 | — | `--text-display` |

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
| 48 | 48px | `--spacing-48` |
| 56 | 56px | `--spacing-56` |
| 64 | 64px | `--spacing-64` |
| 96 | 96px | `--spacing-96` |
| 104 | 104px | `--spacing-104` |
| 216 | 216px | `--spacing-216` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 8px |
| icons | 8px |
| large | 24px |
| pills | 1440px |
| inputs | 8px |
| buttons | 8px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| sm | `rgba(18, 55, 105, 0.08) 0px 2px 4px 0px, rgba(18, 55, 105...` | `--shadow-sm` |
| lg | `rgba(14, 59, 101, 0.06) 0px 32px 24px -12px, rgba(14, 59,...` | `--shadow-lg` |
| lg-2 | `rgba(114, 49, 255, 0.32) 0px -6px 20px 0px inset, rgba(47...` | `--shadow-lg-2` |
| sm-2 | `rgba(18, 55, 105, 0.08) 0px 2px 4px 0px, rgba(18, 55, 105...` | `--shadow-sm-2` |
| sm-3 | `rgba(47, 1, 151, 0.01) 0px 11px 4px 0px, rgba(47, 1, 151,...` | `--shadow-sm-3` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 64-80px
- **Card padding:** 16-24px
- **Element gap:** 8px

## Components

### Filled Brand Button
**Role:** Primary action trigger in hero and CTA blocks

Background #26114a, text #ffffff, 8px radius, 16px vertical / 24px horizontal padding, Inter 500 at 16px. Carries the brand weight — only used for the most important conversion per screen.

### Ghost Outlined Button
**Role:** Secondary action paired beside a filled button

Background transparent, border 1px #26114a, text #26114a, 8px radius, 16px/24px padding, Inter 500 at 16px. Matches the filled button's exact dimensions for optical pairing.

### Pill Navigation Button
**Role:** Top-level nav items in the floating header

1440px radius, 8px/16px padding, Inter 500 at 14px, text #312749. Active state may use #edecff background. The full-pill shape is distinctive — not rounded rectangles, but true capsules.

### Logo Lockup
**Role:** Brand identity in header and footer

Purple triangular icon mark paired with 'wiza' wordmark in Britti Sans 500 or Inter 700. Icon uses a gradient from #b99aff to #7d43ff. Appears in a white pill container with 8px radius and subtle shadow.

### Product Screenshot Frame
**Role:** Hero product demonstration and feature illustrations

White surface with 8px radius, surrounded by the deep layered shadow stack (rgba(14,59,101,0.06) large blur). Floats over the lavender gradient background, creating depth without borders.

### Data Table Row
**Role:** Contact/prospect list display in product mockups

Alternating #ffffff and #f6f7fa backgrounds, 1px #e6e2e3 bottom border, 12px/16px cell padding, Inter 400 at 14px for data, Inter 500 for headers. Dense, compact rows with colored status dots.

### Logo Cloud Bar
**Role:** Social proof — client brand logos

Monochrome (Charcoal #333333) logo strip on white background, centered, with consistent 40–60px height per logo. No colorful logos — all desaturated for visual calm.

### Rating Badge Pair
**Role:** Third-party validation scores (G2, Chrome Web Store)

White pill cards (1440px radius), Inter 500 at 14px for score, 12px for platform name. Star icon in #3e0079 or #f5b800. Displayed in a centered pair with 24px gap.

### Section Heading Block
**Role:** Intro text for content sections

Optional pill tag above (Mist Violet #edecff background, Royal Amethyst #3e0079 text, 1440px radius, Inter 500 12px, 4px/12px padding). Main heading in Britti Sans 500 at 40–56px, Deep Iris #26114a. Subtext in Inter 400 at 16–18px, Slate #615e6e.

### Profile Card (Magic Wand Feature)
**Role:** Contact preview cards in feature illustrations

White surface, 8px radius, subtle border, 12px/16px padding. Contains circular avatar (32px), name in Inter 500 14px #26114a, title in Inter 400 12px #615e6, company in Inter 400 12px #9491a1. Arranged in 3-column grid with 16px gaps.

### Floating Navigation Bar
**Role:** Sticky header container

White background with 8px radius, floats over hero with the layered shadow. Contains logo, nav links (Pill Navigation Button style), and login/signup actions. Max-width contained with side padding.

### Tag/Badge (Pill)
**Role:** Feature labels, job titles, status indicators

1440px radius, 4px/12px padding, Inter 500 at 12px. Variants: #edecff bg with #3e0079 text (accent tags), #f6f7fa bg with #615e6 text (neutral tags), or status-specific colors.

### Input Field
**Role:** Search and form inputs in product UI

1px #e6e2e3 border, 8px radius, 10px/14px padding, Inter 400 at 14px, placeholder in Ash #9491a1. Focus state uses 2px Royal Amethyst #3e0079 border ring.

### Feature Icon Tile
**Role:** Small decorative icon containers in section intros

16px or 24px square tiles with 8px radius, Mist Violet #edecff background, purple stroke icon inside. Used sparingly to mark section types.

## Do's and Don'ts

### Do
- Use 8px radius for all rectangular UI surfaces — cards, buttons, inputs, icon containers. The 8px is the signature, not 4px or 12px.
- Use 1440px radius exclusively for pills, tags, and capsule-shaped nav items — never for cards or panels.
- Set Britti Sans headings to line-height 1.0 exactly. The tight leading is what makes the type feel architectural.
- Use Deep Iris #26114a for headlines and filled button backgrounds. Never use it for body text larger than 24px — it overwhelms at small sizes.
- Pair every filled button with an adjacent ghost button of identical dimensions for the hero CTA pattern.
- Anchor section intros with a small pill tag above the heading in Mist Violet + Royal Amethyst.
- Use the Lavender Wash gradient on hero and feature section backgrounds — it defines the atmosphere.
- Keep Inter at 12–16px for all UI text. The compact size range signals a data-dense product.

### Don't
- Do not use Royal Amethyst #3e0079 for body text — it vibrates uncomfortably at small sizes; reserve it for links, icons, and accent strokes.
- Do not apply 4px or 12px radius to cards — the 8px is non-negotiable for visual consistency.
- Do not use line-height above 1.0 for Britti Sans headings — the tightness is the point.
- Do not introduce new chromatic colors outside the violet family — the palette is deliberately monochromatic-violet.
- Do not use heavy drop shadows. The blue-tinted shadows are subtle (max 32px blur at 6% opacity).
- Do not center body text in multi-line paragraphs — only headlines and short intros get center alignment.
- Do not place dark text directly on the lavender gradient — use a white surface card between them for legibility.
- Do not use rounded images or photos in feature illustrations — the design is iconographic, not photographic.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#ffffff` | Page background, outermost layer |
| 1 | Paper | `#f6f7fa` | Card surfaces, table containers, subtle lifts |
| 2 | Mist Violet | `#edecff` | Tinted highlight sections, gradient start point |
| 3 | Lavender Glow | `#b99aff` | Hero gradient stops, atmospheric overlays |

## Elevation

- **Cards and elevated panels:** `rgba(14, 59, 101, 0.06) 0px 32px 24px -12px, rgba(14, 59, 101, 0.01) 0px 11px 4px 0px, rgba(14, 59, 101, 0.02) 0px 6px 4px 0px, rgba(14, 59, 101, 0.03) 0px 3px 3px 0px, rgba(14, 59, 101, 0.04) 0px 1px 1px 0px`
- **Buttons and nav items:** `rgba(18, 55, 105, 0.08) 0px 2px 4px 0px, rgba(18, 55, 105, 0.04) 0px 1px 1px 0px, rgba(18, 55, 105, 0.08) 0px 0px 0px 1px`
- **Product feature highlights:** `rgba(114, 49, 255, 0.32) 0px -6px 20px 0px inset, rgba(47, 1, 151, 0.12) 0px 11px 12px 0px, rgba(47, 1, 151, 0.12) 0px 3px 3px 0px, rgba(47, 1, 151, 0.12) 0px 1px 1px 0px, rgba(47, 1, 151, 0.08) 0px 0px 0px 1px`

## Imagery

The visual language is almost entirely product-screenshot and iconographic — no lifestyle photography, no stock imagery, no people in context. Product mockups show a contact-prospecting data table with purple status indicators, person avatars, and company logos. Decorative visuals use soft purple gradient washes with floating profile cards arranged in grid patterns. Icons are simple, single-stroke, geometric shapes (a triangle logo, outlined feature icons). Logos in the trust bar are desaturated to monochrome. The overall feel is that of a polished SaaS dashboard screenshot rather than a marketing site with imagery.

## Layout

Centered, max-width 1200px container with generous vertical breathing room (64–80px section gaps). The hero is a full-bleed lavender-to-white gradient with a centered headline stack and dual CTA buttons, followed by a floating product screenshot that breaks the container edge slightly. Below the fold, content alternates between white surface sections and light lavender tinted sections. The logo cloud is a single centered row. Feature sections use centered heading blocks followed by 2-column or 3-column card grids. A sticky floating navigation bar (pill-shaped, centered) sits over the hero.

## Agent Prompt Guide

primary action: no distinct CTA color
**Quick Color Reference**
- text (primary): #26114a
- text (secondary): #615e6e
- text (muted): #9491a1
- background: #ffffff
- surface: #f6f7fa
- border: #e6e2e3
- brand/accent: #3e0079
- filled button background: #26114a

**Example Component Prompts**

1. **Hero Section**: White-to-lavender gradient background (linear-gradient from #ffffff to #edecff). Centered headline 'Find verified emails and phone numbers' in Britti Sans weight 500 at 56px, color #26114a, line-height 1.0. Subtext in Inter 400 at 18px, color #615e6e. Two buttons side by side: filled button (background #26114a, text #ffffff, 8px radius, 16px/24px padding, Inter 500 16px) and ghost button (border 1px #26114a, text #26114a, same dimensions). Below: a product screenshot framed in a white card with 8px radius and the deep blue-tinted shadow.

2. **Data Table Card**: White surface card, 8px radius, 1px #e6e2e3 border, 16px/24px padding. Table header row in Inter 500 at 12px, color #615e6e, uppercase, with 1px #e6e2e3 bottom border. Data rows alternate #ffffff and #f6f7fa backgrounds, Inter 400 at 14px, color #26114a. Action buttons in each row: small pill tags with 1440px radius, #edecff background, #3e0079 text, Inter 500 at 12px.

3. **Section Heading with Pill Tag**: Optional pill tag above heading: 1440px radius, #edecff background, #3e0079 text, Inter 500 at 12px, 4px/12px padding. Main heading in Britti Sans 500 at 40px, #26114a, line-height 1.0. Subtext in Inter 400 at 16px, #615e6e. All centered.

4. **Profile Preview Card**: White surface, 8px radius, 1px #e6e2e3 border, 12px/16px padding. 32px circular avatar at top-left. Name in Inter 500 at 14px, #26114a. Title in Inter 400 at 12px, #615e6e. Company in Inter 400 at 12px, #9491a1. Arranged in 3-column grid with 16px gaps, centered in section.

5. **Trust Logo Bar**: Single horizontal row of 6 client logos, all rendered in monochrome #333333, centered, each logo 40–50px height. White background, 64px vertical padding above and below. Below: two rating badge pills (1440px radius, white bg, subtle border) with star icon and score in Inter 500 14px, platform name in Inter 400 12px #615e6e.

## Gradient System

The lavender atmosphere is built from three gradient layers:
- **Hero wash**: linear-gradient(90deg, #b99aff, #7d43ff 10%, transparent) — fades right, creating a directional glow
- **Decorative multi-stop**: linear-gradient(to right, #cf8aff, #ff66c1, #ffad74, #ff63d1, #aa81ff) — used sparingly for special highlights
- **Section tint**: subtle white-to-#edecff vertical fade for alternating content sections
Gradients should always sit behind white content surfaces — never behind text directly.

## Similar Brands

- **Apollo.io** — Same deep-violet brand color, similar data-prospecting product, and comparable lavender gradient hero treatment
- **Lusha** — Shared violet/indigo palette, compact data table UI, and light-mode product-first layout
- **Clearbit** — Similar light-mode SaaS with subtle gradient backgrounds and confident sans-serif display type
- **ZoomInfo** — Enterprise data product with dense tabular UI, compact Inter type, and restrained brand color usage
- **Cognism** — Purple-tinted brand identity with soft gradient hero sections and data-table product showcases

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-deep-iris: #26114a;
  --color-plum-velvet: #312749;
  --color-royal-amethyst: #3e0079;
  --color-mist-violet: #edecff;
  --color-lavender-wash: #b99aff;
  --gradient-lavender-wash: linear-gradient(90deg, rgb(185, 154, 255), rgb(125, 67, 255) 10%, rgba(125, 67, 255, 0));
  --color-twilight-beam: #cf8aff;
  --gradient-twilight-beam: linear-gradient(to right, rgb(207, 138, 255), rgb(255, 102, 193), rgb(255, 173, 116), rgb(170, 129, 255));
  --color-canvas: #ffffff;
  --color-paper: #f6f7fa;
  --color-mist: #e6e2e3;
  --color-smoke: #c1c7cf;
  --color-ash: #9491a1;
  --color-slate: #615e6e;
  --color-charcoal: #333333;
  --color-carbon: #222222;
  --color-ink: #000000;

  /* Typography — Font Families */
  --font-britti-sans: 'Britti Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.3;
  --text-body-sm: 14px;
  --leading-body-sm: 1.4;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 24px;
  --leading-subheading: 1;
  --text-heading-sm: 32px;
  --leading-heading-sm: 1;
  --text-heading: 40px;
  --leading-heading: 1;
  --text-heading-lg: 56px;
  --leading-heading-lg: 1;
  --text-display: 64px;
  --leading-display: 1;

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
  --spacing-56: 56px;
  --spacing-64: 64px;
  --spacing-96: 96px;
  --spacing-104: 104px;
  --spacing-216: 216px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 64-80px;
  --card-padding: 16-24px;
  --element-gap: 8px;

  /* Border Radius */
  --radius-sm: 2px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-3xl: 24px;
  --radius-3xl-2: 28px;
  --radius-3xl-3: 40px;
  --radius-full: 56px;
  --radius-full-2: 1440px;

  /* Named Radii */
  --radius-cards: 8px;
  --radius-icons: 8px;
  --radius-large: 24px;
  --radius-pills: 1440px;
  --radius-inputs: 8px;
  --radius-buttons: 8px;

  /* Shadows */
  --shadow-sm: rgba(18, 55, 105, 0.08) 0px 2px 4px 0px, rgba(18, 55, 105, 0.04) 0px 1px 1px 0px, rgba(18, 55, 105, 0.08) 0px 0px 0px 1px;
  --shadow-lg: rgba(14, 59, 101, 0.06) 0px 32px 24px -12px, rgba(14, 59, 101, 0.01) 0px 11px 4px 0px, rgba(14, 59, 101, 0.02) 0px 6px 4px 0px, rgba(14, 59, 101, 0.03) 0px 3px 3px 0px, rgba(14, 59, 101, 0.04) 0px 1px 1px 0px;
  --shadow-lg-2: rgba(114, 49, 255, 0.32) 0px -6px 20px 0px inset, rgba(47, 1, 151, 0.12) 0px 11px 12px 0px, rgba(47, 1, 151, 0.12) 0px 3px 3px 0px, rgba(47, 1, 151, 0.12) 0px 1px 1px 0px, rgba(47, 1, 151, 0.08) 0px 0px 0px 1px;
  --shadow-sm-2: rgba(18, 55, 105, 0.08) 0px 2px 4px 0px, rgba(18, 55, 105, 0.04) 0px 1px 1px 0px;
  --shadow-sm-3: rgba(47, 1, 151, 0.01) 0px 11px 4px 0px, rgba(47, 1, 151, 0.04) 0px 6px 4px 0px, rgba(47, 1, 151, 0.06) 0px 3px 3px 0px, rgba(47, 1, 151, 0.08) 0px 1px 1px 0px, rgba(47, 1, 151, 0.08) 0px 0px 0px 1px;

  /* Surfaces */
  --surface-canvas: #ffffff;
  --surface-paper: #f6f7fa;
  --surface-mist-violet: #edecff;
  --surface-lavender-glow: #b99aff;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-deep-iris: #26114a;
  --color-plum-velvet: #312749;
  --color-royal-amethyst: #3e0079;
  --color-mist-violet: #edecff;
  --color-lavender-wash: #b99aff;
  --color-twilight-beam: #cf8aff;
  --color-canvas: #ffffff;
  --color-paper: #f6f7fa;
  --color-mist: #e6e2e3;
  --color-smoke: #c1c7cf;
  --color-ash: #9491a1;
  --color-slate: #615e6e;
  --color-charcoal: #333333;
  --color-carbon: #222222;
  --color-ink: #000000;

  /* Typography */
  --font-britti-sans: 'Britti Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.3;
  --text-body-sm: 14px;
  --leading-body-sm: 1.4;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 24px;
  --leading-subheading: 1;
  --text-heading-sm: 32px;
  --leading-heading-sm: 1;
  --text-heading: 40px;
  --leading-heading: 1;
  --text-heading-lg: 56px;
  --leading-heading-lg: 1;
  --text-display: 64px;
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
  --spacing-96: 96px;
  --spacing-104: 104px;
  --spacing-216: 216px;

  /* Border Radius */
  --radius-sm: 2px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-3xl: 24px;
  --radius-3xl-2: 28px;
  --radius-3xl-3: 40px;
  --radius-full: 56px;
  --radius-full-2: 1440px;

  /* Shadows */
  --shadow-sm: rgba(18, 55, 105, 0.08) 0px 2px 4px 0px, rgba(18, 55, 105, 0.04) 0px 1px 1px 0px, rgba(18, 55, 105, 0.08) 0px 0px 0px 1px;
  --shadow-lg: rgba(14, 59, 101, 0.06) 0px 32px 24px -12px, rgba(14, 59, 101, 0.01) 0px 11px 4px 0px, rgba(14, 59, 101, 0.02) 0px 6px 4px 0px, rgba(14, 59, 101, 0.03) 0px 3px 3px 0px, rgba(14, 59, 101, 0.04) 0px 1px 1px 0px;
  --shadow-lg-2: rgba(114, 49, 255, 0.32) 0px -6px 20px 0px inset, rgba(47, 1, 151, 0.12) 0px 11px 12px 0px, rgba(47, 1, 151, 0.12) 0px 3px 3px 0px, rgba(47, 1, 151, 0.12) 0px 1px 1px 0px, rgba(47, 1, 151, 0.08) 0px 0px 0px 1px;
  --shadow-sm-2: rgba(18, 55, 105, 0.08) 0px 2px 4px 0px, rgba(18, 55, 105, 0.04) 0px 1px 1px 0px;
  --shadow-sm-3: rgba(47, 1, 151, 0.01) 0px 11px 4px 0px, rgba(47, 1, 151, 0.04) 0px 6px 4px 0px, rgba(47, 1, 151, 0.06) 0px 3px 3px 0px, rgba(47, 1, 151, 0.08) 0px 1px 1px 0px, rgba(47, 1, 151, 0.08) 0px 0px 0px 1px;
}
```
