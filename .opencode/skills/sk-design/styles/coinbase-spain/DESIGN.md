# Coinbase Spain — Style Reference
> Digital Trust, Blueprinted. A system built on the clarity of an architectural plan, energized by a single, electric blue neuron.

**Theme:** light

The design system establishes a feeling of digital-native trust, grounded in a high-contrast, minimalist palette. A precise foundation of pure white (#ffffff) and near-black (#0a0b0d) creates an environment of clarity and focus. The system's entire personality is injected through a single, electric `Coinbase Blue` (#0052ff), which is reserved exclusively for primary actions and brand marks, acting as a confident guide. A suite of custom fonts (Coinbase Display, Sans, Text) provides a unique and cohesive typographic voice across all scales. Depth is achieved not with shadows but with bold, full-width color blocks, alternating between bright white and deep midnight sections, creating a clean, architectural rhythm.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Coinbase Blue | `#0052ff` | `--color-coinbase-blue` | Primary CTAs, logos, active states — the core brand identifier. |
| Interactive Blue | `#578bfa` | `--color-interactive-blue` | Secondary links and interactive elements. |
| Pure White | `#ffffff` | `--color-pure-white` | Primary page background, text on dark surfaces. |
| Midnight | `#0a0b0d` | `--color-midnight` | Dark section backgrounds, primary text. |
| Slate | `#5b616` | `--color-slate` | Body text, secondary headings, footer links. |
| Ash | `#8a919` | `--color-ash` | Helper text, disabled states, subtle UI text. |
| Frost | `#f7f8f9` | `--color-frost` | Subtle light backgrounds, like the footer area. |
| Cloud | `#eef0f3` | `--color-cloud` | Light background dividers or button hover states. |
| Pewter | `#dedfe2` | `--color-pewter` | Borders between light sections. |
| Charcoal | `#141519` | `--color-charcoal` | Alternative dark section background surface. |
| Positive Green | `#27ad75` | `--color-positive-green` | Price increases, success messages. |
| Negative Red | `#f0616d` | `--color-negative-red` | Price decreases, error messages. |

## Tokens — Typography

### CoinbaseDisplay — Used exclusively for large, impactful headlines (H1/H2). Its clean, slightly wide geometry gives headlines a declarative, confident presence. · `--font-coinbasedisplay`
- **Substitute:** Manrope
- **Weights:** 400
- **Sizes:** 44px, 52px, 64px, 80px
- **Line height:** 1.0-1.09
- **Role:** Used exclusively for large, impactful headlines (H1/H2). Its clean, slightly wide geometry gives headlines a declarative, confident presence.

### CoinbaseSans — The primary workhorse font for subheadings, buttons, and some body copy. The 600 weight is used for emphasis and smaller headings. · `--font-coinbasesans`
- **Substitute:** Inter
- **Weights:** 400, 600
- **Sizes:** 13px, 16px, 18px, 20px, 28px, 36px, 64px
- **Line height:** 1.11-1.50
- **Role:** The primary workhorse font for subheadings, buttons, and some body copy. The 600 weight is used for emphasis and smaller headings.

### CoinbaseText — Optimized for readability in dense UI and long-form text blocks. Its generous line-height makes paragraphs breathable. · `--font-coinbasetext`
- **Substitute:** Inter
- **Weights:** 400, 700
- **Sizes:** 13px, 16px, 18px
- **Line height:** 1.50-1.56
- **Role:** Optimized for readability in dense UI and long-form text blocks. Its generous line-height makes paragraphs breathable.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 13px | 1.54 | — | `--text-caption` |
| body | 16px | 1.5 | — | `--text-body` |
| subheading | 18px | 1.56 | — | `--text-subheading` |
| heading-sm | 28px | 1.25 | — | `--text-heading-sm` |
| heading | 44px | 1.09 | — | `--text-heading` |
| heading-lg | 64px | 1 | — | `--text-heading-lg` |
| display | 80px | 1 | — | `--text-display` |

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
| 48 | 48px | `--spacing-48` |
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 100000px |
| cards | 24px |
| inputs | 8px |
| buttons | 56px |

### Layout

- **Page max-width:** 1200px
- **Card padding:** 24px

## Components

### Primary CTA Button
**Role:** The main call-to-action on any page.

Background: `Coinbase Blue` (#0052ff). Text: `Pure White` (#ffffff). Padding: 16px 32px. Radius: a distinctive elongated pill shape at 56px.

### Secondary Pill Button
**Role:** Secondary action, often on a dark background.

Background: `Pure White` (#ffffff). Text: `Midnight` (#0a0b0d). Padding: 12px 24px. Radius: a perfect pill shape at 100000px.

### Ghost Link
**Role:** Inline, text-style interactive elements.

Background: transparent. Text: `Interactive Blue` (#578bfa). No padding or border. Used for tertiary actions like 'Learn more'.

### Header Nav Link
**Role:** Top-level navigation items.

Background: transparent. Text: `Midnight` (#0a0b0d). No padding. Font: CoinbaseSans 16px.

### Filter Tag
**Role:** Toggleable filter in data views.

Background: typically transparent with a subtle border, or a light fill on hover/active. Text: `Slate` (#5b616e). Padding: 12px 24px. Radius: 100000px.

### Footer Link
**Role:** Tertiary navigation links in the page footer.

Background: transparent. Text: `Slate` (#5b616e). Font: CoinbaseText 16px. No underline until hover.

### Large Headline
**Role:** The primary heading for a page or hero section.

Font: CoinbaseDisplay, 64px. Color: `Midnight` (#0a0b0d).

## Do's and Don'ts

### Do
- Use `Coinbase Blue` (#0052ff) exclusively for primary CTAs and the brand logo.
- Define primary buttons with the signature 56px border-radius.
- Construct all major page headlines using the `CoinbaseDisplay` font.
- Create visual hierarchy by alternating full-width #ffffff and #0a0b0d sections.
- Reserve `Slate` (#5b616e) for all secondary body copy and footer links.
- Set body text at 16px with `CoinbaseSans` or `CoinbaseText` for optimal readability.
- Apply a 24px radius to all larger content cards.

### Don't
- Don't use shadows on any element; rely on color blocking for depth.
- Don't use `Coinbase Blue` (#0052ff) for text or non-interactive elements.
- Don't use multiple saturated colors in one section; stick to the neutral palette with one blue accent.
- Don't use sharp corners for buttons or tags; they must be rounded (56px or 100000px).
- Don't use system fonts; the custom Coinbase font suite is essential to the brand identity.
- Don't create visual dividers with lines; use negative space and background color changes.
- Don't make footer links any color other than `Slate` (#5b616e).

## Elevation

The design intentionally avoids shadows. Depth and hierarchy are created through color blocking, contrasting light backgrounds (#ffffff) with distinct dark sections (#0a0b0d).

## Imagery

Visuals are dominated by abstract vector illustrations and clean product UI screenshots. Illustrations use a flat-color, geometric style featuring brand colors, making complex financial concepts feel approachable and modern. They are always contained within layout blocks, reinforcing the structured, grid-based feel of the page. Photography is absent, placing the focus squarely on the product's interface and stylized brand graphics.

## Layout

The layout is a centered, max-width container (approx. 1200px) providing a stable reading experience. A key pattern is the rhythmic alternation between a white-background hero (split-column text/visual) and a full-bleed dark feature section. This creates dramatic contrast and pacing. Content is organized in simple, clear structures like 2-column feature blocks and multi-column card grids. Generous vertical spacing (64px+) between sections ensures each message has room to breathe.

## Agent Prompt Guide

### Quick Color Reference
- **Text:** `#0a0b0d`
- **Background:** `#ffffff`
- **CTA Button:** `#0052ff`
- **Dark Section BG:** `#0a0b0d`
- **Secondary Text:** `#5b616e`
- **Link:** `#578bfa`

### Example Component Prompts
1. **Hero Section:** "Create a two-column hero on a `#ffffff` background. Left column: headline 'Hello, Spain!' at 64px CoinbaseDisplay weight 400 in `#0a0b0d`. Subtext 'Coinbase is the world's safest platform...' at 18px CoinbaseSans weight 400 in `#5b616e`. Primary button 'Sign up' with `#0052ff` background, `#ffffff` text, 16px 32px padding, and 56px border-radius."
2. **Dark Promo Section:** "Create a full-width section with a `#0a0b0d` background and 80px vertical padding. Inside, place a centered headline 'Earn up to 14% APY on your crypto' at 36px CoinbaseSans weight 600 in `#ffffff`. Add a subtext below it. Below that, add a secondary pill button 'Explore staking options' with a `#ffffff` background, `#0a0b0d` text, 12px 24px padding, and 100000px radius."
3. **Footer:** "Design a footer on a `#f7f8f9` background. Create four columns. Each column has a heading like 'Company' or 'Learn' using 16px CoinbaseSans weight 600 in `#0a0b0d`. List links below each heading like 'About' or 'Blog' using 16px CoinbaseText weight 400 in `#5b616e`."

## Similar Brands

- **Stripe** — Shared aesthetic of high-contrast typography, a single strong brand color, and a clean, developer-friendly feel.
- **Robinhood** — Similar goal of simplifying finance with a clean, mobile-first design and a dominant, optimistic brand color.
- **Intercom** — Uses a similar strategy of a strong blue brand color, custom illustrations, and ample white space.
- **Wealthsimple** — Also combines a trustworthy-but-not-stodgy feel with clean typography and approachable graphics.

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-coinbase-blue: #0052ff;
  --color-interactive-blue: #578bfa;
  --color-pure-white: #ffffff;
  --color-midnight: #0a0b0d;
  --color-slate: #5b616;
  --color-ash: #8a919;
  --color-frost: #f7f8f9;
  --color-cloud: #eef0f3;
  --color-pewter: #dedfe2;
  --color-charcoal: #141519;
  --color-positive-green: #27ad75;
  --color-negative-red: #f0616d;

  /* Typography — Font Families */
  --font-coinbasedisplay: 'CoinbaseDisplay', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-coinbasesans: 'CoinbaseSans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-coinbasetext: 'CoinbaseText', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 13px;
  --leading-caption: 1.54;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 18px;
  --leading-subheading: 1.56;
  --text-heading-sm: 28px;
  --leading-heading-sm: 1.25;
  --text-heading: 44px;
  --leading-heading: 1.09;
  --text-heading-lg: 64px;
  --leading-heading-lg: 1;
  --text-display: 80px;
  --leading-display: 1;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 8px;
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-80: 80px;

  /* Layout */
  --page-max-width: 1200px;
  --card-padding: 24px;

  /* Border Radius */
  --radius-xl: 12px;
  --radius-3xl: 24px;
  --radius-3xl-2: 40px;
  --radius-full: 56px;
  --radius-full-2: 100000px;

  /* Named Radii */
  --radius-tags: 100000px;
  --radius-cards: 24px;
  --radius-inputs: 8px;
  --radius-buttons: 56px;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-coinbase-blue: #0052ff;
  --color-interactive-blue: #578bfa;
  --color-pure-white: #ffffff;
  --color-midnight: #0a0b0d;
  --color-slate: #5b616;
  --color-ash: #8a919;
  --color-frost: #f7f8f9;
  --color-cloud: #eef0f3;
  --color-pewter: #dedfe2;
  --color-charcoal: #141519;
  --color-positive-green: #27ad75;
  --color-negative-red: #f0616d;

  /* Typography */
  --font-coinbasedisplay: 'CoinbaseDisplay', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-coinbasesans: 'CoinbaseSans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-coinbasetext: 'CoinbaseText', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 13px;
  --leading-caption: 1.54;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 18px;
  --leading-subheading: 1.56;
  --text-heading-sm: 28px;
  --leading-heading-sm: 1.25;
  --text-heading: 44px;
  --leading-heading: 1.09;
  --text-heading-lg: 64px;
  --leading-heading-lg: 1;
  --text-display: 80px;
  --leading-display: 1;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-80: 80px;

  /* Border Radius */
  --radius-xl: 12px;
  --radius-3xl: 24px;
  --radius-3xl-2: 40px;
  --radius-full: 56px;
  --radius-full-2: 100000px;
}
```
