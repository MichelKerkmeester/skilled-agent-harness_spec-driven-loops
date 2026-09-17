# Dropbox.com — Style Reference
> warm cream workspace — editorial confidence on paper

**Theme:** light

Dropbox reads as a warm editorial workspace rather than a cold productivity dashboard. The canvas is cream paper (#f7f5f2), not sterile white; text is a warm near-black (#1e1919), not pure ink. The brand speaks through one confident electric blue (#0061fe) that paints every action surface, paired with Sharp Grotesk headlines and Atlas Grotesk body copy — a custom Grotesk pairing that gives the system a proprietary, designed quality. Layouts are generous and breathing, built on a 6px base, with 2-column card grids, split text+visual heroes, and minimal elevation. Surfaces are flat with hairline borders; corners are soft (8–16px). The mood is approachable, considered, and quietly confident — the opposite of a sterile enterprise UI.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Dropbox Blue | `#0061fe` | `--color-dropbox-blue` | Violet supporting accent for decorative details and low-frequency emphasis. Do not promote it to the primary CTA color |
| Cream Paper | `#f7f5f2` | `--color-cream-paper` | Page canvas, section backgrounds, nav bar surface — warm off-white replaces sterile SaaS white to soften the system |
| Pure White | `#ffffff` | `--color-pure-white` | Elevated card surfaces, content panels, product mockup backgrounds — the only true white, reserved for surfaces that sit on the cream canvas |
| Warm Ink | `#1e1919` | `--color-warm-ink` | Primary text, dark nav button text, heading color — warm near-black reads softer than pure ink on cream backgrounds |
| Stone Gray | `#716b61` | `--color-stone-gray` | Secondary text, helper copy, muted icon strokes, footer metadata — warm desaturated gray that sits comfortably on cream |
| Sand Card | `#eee9e2` | `--color-sand-card` | Alternate card surface, subtle elevated panel — slightly darker cream for cards that need gentle separation from canvas |
| Magenta Accent | `#cd2f7b` | `--color-magenta-accent` | Decorative highlight, occasional link underline, brand illustration accent — provides chromatic variety without competing with primary blue |

## Tokens — Typography

### Times — Times — detected in extracted data but not described by AI · `--font-times`
- **Weights:** 400
- **Sizes:** 16px
- **Line height:** 1.2
- **Role:** Times — detected in extracted data but not described by AI

### Atlas Grotesk Web — Body copy, navigation links, UI labels, button text — Dropbox's primary interface typeface; geometric humanist sans with open apertures, optimized for dense UI reading at 14–16px · `--font-atlas-grotesk-web`
- **Substitute:** Inter, IBM Plex Sans, Söhne
- **Weights:** 400, 500, 700
- **Sizes:** 12px, 14px, 16px, 20px
- **Line height:** 1.20–1.57
- **Role:** Body copy, navigation links, UI labels, button text — Dropbox's primary interface typeface; geometric humanist sans with open apertures, optimized for dense UI reading at 14–16px

### Sharp Grotesk — Section headings and subheadings — medium weight (500) instead of bold creates editorial restraint; the tight, slightly compressed letterforms distinguish it from generic sans headings · `--font-sharp-grotesk`
- **Substitute:** Inter Tight, Manrope, Söhne Breit
- **Weights:** 500
- **Sizes:** 18px, 26px, 40px
- **Line height:** 1.20, 1.30
- **Role:** Section headings and subheadings — medium weight (500) instead of bold creates editorial restraint; the tight, slightly compressed letterforms distinguish it from generic sans headings

### Sharp Grotesk 23 — Display headings at 32px+ — regular weight (not bold) on large display type is an anti-convention choice that relies on size and letterform precision rather than weight to create impact · `--font-sharp-grotesk-23`
- **Substitute:** Inter Tight, Manrope
- **Weights:** 400
- **Sizes:** 32px
- **Line height:** 1.20
- **Role:** Display headings at 32px+ — regular weight (not bold) on large display type is an anti-convention choice that relies on size and letterform precision rather than weight to create impact

### Arial — Arial — detected in extracted data but not described by AI · `--font-arial`
- **Weights:** 400
- **Sizes:** 13px
- **Line height:** 1.2
- **Role:** Arial — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.2 | — | `--text-caption` |
| body-sm | 14px | 1.43 | — | `--text-body-sm` |
| body | 16px | 1.5 | — | `--text-body` |
| subheading | 20px | 1.57 | — | `--text-subheading` |
| heading-sm | 26px | 1.3 | — | `--text-heading-sm` |
| heading | 32px | 1.2 | — | `--text-heading` |
| heading-lg | 40px | 1.2 | — | `--text-heading-lg` |

## Tokens — Spacing & Shapes

**Base unit:** 6px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 12 | 12px | `--spacing-12` |
| 24 | 24px | `--spacing-24` |
| 48 | 48px | `--spacing-48` |
| 72 | 72px | `--spacing-72` |
| 84 | 84px | `--spacing-84` |
| 96 | 96px | `--spacing-96` |
| 120 | 120px | `--spacing-120` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 12px |
| cards | 8px |
| pills | 9999px |
| buttons | 16px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 72px
- **Card padding:** 24px
- **Element gap:** 12px

## Components

### Top Navigation Bar
**Role:** Persistent site navigation

White nav bar with Dropbox brand mark (blue box logo) on left, product/solution/enterprise/pricing links in Atlas Grotesk 14px, right-side secondary links (Contact sales, Get app, Sign up, Log in), and primary action button 'Get started' as solid blue (#0061fe) pill with white text, 16px radius, 8px 16px padding.

### Primary CTA Button (Filled)
**Role:** Main call-to-action on pages

Solid #0061fe background, white text in Atlas Grotesk 14px weight 500, 16px border-radius, 12px 24px padding, right-pointing arrow icon. No border. Used for 'Try Dropbox free' and 'Get started' actions.

### Outline/Secondary Button
**Role:** Secondary action, less visual weight

Transparent background with #1e1919 1px border, dark text, 16px border-radius, 12px 24px padding, optional arrow. Appears in centered CTA banners where a single button stands alone.

### Hero Section (Split Layout)
**Role:** Above-fold page introduction

Two-column layout: left column has H1 in Sharp Grotesk 40px weight 500, supporting body copy in Atlas Grotesk 16px, and primary CTA below. Right column displays product UI mockup on white card with 8px radius and subtle 1px border. Section padding approximately 96px vertical.

### Logo Carousel Strip
**Role:** Social proof — trusted brands

Horizontal row of partner/client logos (KATZ, Zoom, Lincoln Center, McLaren, Crunch, Cirque du Soleil) on cream background, evenly spaced, monochrome black or grayscale treatment. Paused by default, auto-scrolling.

### Centered CTA Banner
**Role:** Mid-page conversion prompt

Centered stack on cream canvas: small icon badge at top, H2 in Sharp Grotesk 26px weight 500, supporting text in Atlas Grotesk 16px, single outline button below. Vertical rhythm 48–72px between elements.

### Industry Solution Card (2-Column Grid)
**Role:** Use-case explanation in industry context section

Two-column grid of cards on cream background. Each card: square image (construction, education, etc.) on left in a 1:1 ratio with 8px radius, title in Atlas Grotesk 16px weight 500, description in 14px body, 'Learn more →' link in blue (#0061fe) weight 500. Cards are flat with no shadow, separated by 24px gutters.

### Product UI Mockup
**Role:** In-hero and feature illustrations

Composite screenshot showing Dropbox web app and mobile app interfaces side by side. White surface (#ffffff) with 8–12px corner radii, 1px hairline border (#eee9e2 or #d0ccc4), no drop shadow — floats on cream canvas.

### Nav Dropdown Link
**Role:** Product/Solutions submenu items

Text link in Atlas Grotesk 14px weight 500, #1e1919, with small downward chevron icon. 12px padding, no background. Underline or background fill on hover.

## Do's and Don'ts

### Do
- Use Cream Paper (#f7f5f2) as the base canvas for all page sections — never default to pure white for full-page backgrounds
- Reserve solid #0061fe fills exclusively for primary action buttons and active nav states
- Set heading weight to 500 (not 700) in Sharp Grotesk — the medium weight is signature
- Use 16px border-radius on all buttons and 8–12px on cards and product mockups
- Anchor layouts on a 6px spacing scale: 12/24/48/72/96px are the most common step values
- Pair Atlas Grotesk 16px body with Stone Gray (#716b61) for secondary/supporting text
- Use 2-column card grids with 24px gutters for solution/industry sections

### Don't
- Don't use pure white (#ffffff) as a page background — it breaks the warm paper aesthetic
- Don't use bold (700) or semibold (600) weights for headings — Sharp Grotesk at 500 is the standard
- Don't add drop shadows to cards or product mockups — separation comes from hairline borders and the cream-to-white surface shift
- Don't introduce secondary chromatic accents that compete with #0061fe blue
- Don't use Times serif as a design choice in headings or body — it appears only as a system fallback artifact
- Don't use fully rounded (9999px) pill buttons for primary CTAs — 16px is the canonical radius
- Don't mix the cream canvas with cool grays (#e5e7eb, #f3f4f6) — stick to warm neutrals in the #eee9e2 / #f7f5f2 family

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Page Canvas | `#f7f5f2` | Base background for all pages — warm cream paper |
| 1 | Card Surface | `#ffffff` | Content cards, product mockups, elevated panels |
| 2 | Alt Card | `#eee9e2` | Subtle card variant for visual rhythm in grids |
| 3 | Action Surface | `#0061fe` | Primary CTA fills, brand callouts |

## Elevation

- **Product UI Mockup:** `none — uses 1px hairline border on white surface`
- **Industry Cards:** `none — flat on cream canvas`
- **Nav Bar:** `none — flat white bar`

## Imagery

Imagery is used sparingly and always in service of content context. Industry/solution sections use 1:1 square photography — construction workers, office teams, students, factory scenes — in naturalistic, slightly warm color grading. Images sit flush-left in 2-column cards with 8px corner radius. No lifestyle overlays, no duotone treatments, no decorative full-bleed hero photography. The product UI mockup (composite of web + mobile app screens) does the heavy visual lifting in the hero. Icon style: thin-stroke line icons in #716b61 Stone Gray, geometric and utilitarian, no filled variants.

## Layout

Page model is centered max-width ~1200px with generous outer margins on cream canvas. Navigation is a fixed-height top bar (~64px) in white. The hero pattern is consistently a 2-column split: left-aligned text (headline + body + CTA) occupying ~40% width, right-side product visual occupying ~50% with white surface. Below the hero, a logo carousel strip provides social proof. Mid-page sections alternate between centered CTA banners and 2-column card grids (industry solutions, feature blocks). Section vertical rhythm is 72–96px. Navigation is minimal top-bar with dropdown chevrons; no sidebar, no mega-menu visible in the captured flow.

## Agent Prompt Guide

**Quick Color Reference**
- Background: #f7f5f2 (Cream Paper)
- Surface (card): #ffffff
- Text: #1e1919 (Warm Ink)
- Secondary text: #716b61 (Stone Gray)
- Border: #eee9e2 (Sand Card)
- primary action: no distinct CTA color

**3 Example Component Prompts**

No distinct primary action color was observed; use the extracted neutral button treatments instead of inventing a filled CTA color.

2. Create a 2-column industry solution grid on #f7f5f2 background. Each card has a 1:1 square image on the left (8px corner radius), title in Atlas Grotesk 16px weight 500 #1e1919, description in Atlas Grotesk 14px weight 400 #716b61, and a 'Learn more →' link in #0061fe weight 500. 24px gap between cards in each row.


## Similar Brands

- **Notion** — Similar restrained single-accent color approach (Notion's black/white with one ink color) and clean editorial typography at generous sizes
- **Figma** — Same split-hero pattern (text left, product mockup right) and warm-off-white canvas with minimal shadow reliance
- **Linear** — Custom Grotesk typeface pairing (Sharp Grotesk echoes Linear Sans Grotesk influence) and confident medium-weight headings
- **Miro** — Warm neutral canvas tone (Miro's #f5f5f5 leans cooler but same comfort-first density) with 2-column feature grids and single brand accent
- **Webflow** — Editorial confidence — large medium-weight display type, cream/off-white backgrounds, and one chromatic action color for CTAs

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-dropbox-blue: #0061fe;
  --color-cream-paper: #f7f5f2;
  --color-pure-white: #ffffff;
  --color-warm-ink: #1e1919;
  --color-stone-gray: #716b61;
  --color-sand-card: #eee9e2;
  --color-magenta-accent: #cd2f7b;

  /* Typography — Font Families */
  --font-times: 'Times', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-atlas-grotesk-web: 'Atlas Grotesk Web', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-sharp-grotesk: 'Sharp Grotesk', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-sharp-grotesk-23: 'Sharp Grotesk 23', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.2;
  --text-body-sm: 14px;
  --leading-body-sm: 1.43;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 20px;
  --leading-subheading: 1.57;
  --text-heading-sm: 26px;
  --leading-heading-sm: 1.3;
  --text-heading: 32px;
  --leading-heading: 1.2;
  --text-heading-lg: 40px;
  --leading-heading-lg: 1.2;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 6px;
  --spacing-12: 12px;
  --spacing-24: 24px;
  --spacing-48: 48px;
  --spacing-72: 72px;
  --spacing-84: 84px;
  --spacing-96: 96px;
  --spacing-120: 120px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 72px;
  --card-padding: 24px;
  --element-gap: 12px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;

  /* Named Radii */
  --radius-nav: 12px;
  --radius-cards: 8px;
  --radius-pills: 9999px;
  --radius-buttons: 16px;

  /* Surfaces */
  --surface-page-canvas: #f7f5f2;
  --surface-card-surface: #ffffff;
  --surface-alt-card: #eee9e2;
  --surface-action-surface: #0061fe;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-dropbox-blue: #0061fe;
  --color-cream-paper: #f7f5f2;
  --color-pure-white: #ffffff;
  --color-warm-ink: #1e1919;
  --color-stone-gray: #716b61;
  --color-sand-card: #eee9e2;
  --color-magenta-accent: #cd2f7b;

  /* Typography */
  --font-times: 'Times', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-atlas-grotesk-web: 'Atlas Grotesk Web', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-sharp-grotesk: 'Sharp Grotesk', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-sharp-grotesk-23: 'Sharp Grotesk 23', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.2;
  --text-body-sm: 14px;
  --leading-body-sm: 1.43;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 20px;
  --leading-subheading: 1.57;
  --text-heading-sm: 26px;
  --leading-heading-sm: 1.3;
  --text-heading: 32px;
  --leading-heading: 1.2;
  --text-heading-lg: 40px;
  --leading-heading-lg: 1.2;

  /* Spacing */
  --spacing-12: 12px;
  --spacing-24: 24px;
  --spacing-48: 48px;
  --spacing-72: 72px;
  --spacing-84: 84px;
  --spacing-96: 96px;
  --spacing-120: 120px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
}
```
