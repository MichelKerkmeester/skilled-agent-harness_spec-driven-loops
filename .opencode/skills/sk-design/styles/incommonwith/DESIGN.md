# Incommonwith — Style Reference
> Editorial atelier in oxblood ink — warm cream pages, sunlit interior photography, and a single deep burgundy ink that carries every word, border, and link like fine letterpress.

**Theme:** light

In Common With operates as a printed design quarterly, not a storefront: warm cream-white paper (#fafaf9) is the canvas, full-bleed golden-hour interior photography carries visual weight, and a single deep oxblood ink (#4a0a05) serves as every text element, border, and link. The type system pairs a classical Caslon Ionic serif at 24px for headlines with a neo-grotesque Mier A sans for body, navigation, and UI — a literary tension that recurs across hero overlays, category names, and journal titles. Layout is unhurried: full-bleed hero, sidebar date stamps, horizontal product carousels, and generous negative space let the photography lead. Surfaces are flat, corners are sharp, shadows are absent — depth comes from photography and warm color temperature, never from elevation.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Oxblood Ink | `#4a0a05` | `--color-oxblood-ink` | All body text, headings, links, borders, outlined actions, and footer type — the singular chromatic voice; warmth and gravity without aggression |
| Cream Paper | `#fafaf9` | `--color-cream-paper` | Primary page background; the warm off-white that gives the site its paper-stock feel |
| Aged Linen | `#f8f7f1` | `--color-aged-linen` | Secondary surface, subtle card backgrounds, and pill-tag fills — slightly greener/warmer than the page, used for soft differentiation |
| Warm Stone | `#bcb6a6` | `--color-warm-stone` | Muted background wash and tertiary surface — the only mid-tone neutral, used sparingly for section backgrounds |
| Dusty Clay | `#a2827f` | `--color-dusty-clay` | Muted captions, helper text, and de-emphasized UI labels. Do not promote it to the primary CTA color |

## Tokens — Typography

### Mier A — Primary UI and body sans — used for navigation, body copy, captions, dates, links, and all functional text. Weight 400 only; the system trusts size and color contrast to carry hierarchy, never weight. Substitute: Inter or Untitled Sans (free: Inter). · `--font-mier-a`
- **Substitute:** Inter
- **Weights:** 400
- **Sizes:** 13px, 14px, 18px, 26px
- **Line height:** 1.20
- **Letter spacing:** normal
- **Role:** Primary UI and body sans — used for navigation, body copy, captions, dates, links, and all functional text. Weight 400 only; the system trusts size and color contrast to carry hierarchy, never weight. Substitute: Inter or Untitled Sans (free: Inter).

### Caslon Ionic — Sole serif — reserved exclusively for category names, journal headlines, and brand wordmark at 24px. The single appearance of a classical letterform creates a literary counterpoint to the neo-grotesque UI. Substitute: Cormorant Garamond or Libre Caslon Text. · `--font-caslon-ionic`
- **Substitute:** Cormorant Garamond
- **Weights:** 400
- **Sizes:** 24px
- **Line height:** 1.20
- **Letter spacing:** normal
- **Role:** Sole serif — reserved exclusively for category names, journal headlines, and brand wordmark at 24px. The single appearance of a classical letterform creates a literary counterpoint to the neo-grotesque UI. Substitute: Cormorant Garamond or Libre Caslon Text.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 13px | 1.2 | — | `--text-caption` |
| body | 18px | 1.2 | — | `--text-body` |
| subheading | 24px | 1.2 | — | `--text-subheading` |
| heading | 26px | 1.2 | — | `--text-heading` |

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
| 28 | 28px | `--spacing-28` |
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 56 | 56px | `--spacing-56` |
| 60 | 60px | `--spacing-60` |
| 80 | 80px | `--spacing-80` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 9999px |
| cards | 0px |
| pills | 9999px |
| images | 0px |
| buttons | 0px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 64px
- **Card padding:** 0px
- **Element gap:** 12px

## Components

### Editorial Top Navigation
**Role:** Primary site navigation

Transparent background, no border. Left: 'Shop' at 14px Mier A, #4a0a05. Center: 'Collections', 'Showroom' at 14px Mier A, #4a0a05. Right: 'Info', 'Trade', 'Search', 'Sign In', 'Cart (0)' at 14px Mier A, #4a0a05. 12px gap between items. No fill, no shadow, no logo container — the wordmark appears separately in content.

### Full-Bleed Hero with Overlaid Headline
**Role:** Landing page hero

Full-viewport-width interior photograph as background. Headline 'In Common With' in white, 24px Caslon Ionic, positioned lower-left at ~30% from top. Subtitle 'A dialogue between light, material, and form' in white, 13px Mier A, directly below. 'Explore Outdoor' as a white text link at 14px Mier A below the subtitle. No button — just a text-link entry point.

### Product Category Card
**Role:** Catalog category tile

Full-bleed interior photograph filling the card edge-to-edge (0px radius, 0px padding). Below image: category name at 24px Caslon Ionic, #4a0a05, with a small superscript count number (e.g. 'Floor Lamps⁵'). 'Shop' text link at 14px Mier A, #4a0a05, with a 1px #4a0a05 underline, positioned 8px below the name. White (#fafaf9) background. No border, no shadow.

### Journal Editorial Card
**Role:** Editorial/press content card

Full-bleed editorial photograph (0px radius, 0px padding). Date stamp at 13px Mier A, #4a0a05, positioned 12px above the image. Headline at 24px Caslon Ionic, #4a0a05, positioned 12px below the image. 'Read More' text link at 14px Mier A, #4a0a05, underlined, 12px below headline. White (#fafaf9) background. No border, no shadow.

### Text Link / Outlined Action
**Role:** Primary interactive element

No fill, no large button shape. 14px Mier A, #4a0a05, with a 1px #4a0a05 bottom border acting as underline. Padding: 0px vertical, 0px horizontal — the text is the control. On hover: border-color darkens or thickens to 1.5px. This is the site's only action style; there are no filled buttons.

### Sidebar Section Label
**Role:** Section identifier

Small text at 14px Mier A, #4a0a05, left-aligned in a narrow ~120px column at the far left of the page width. Labels include 'Our Catalog', 'Lathely', 'Featured', product names like 'Verso Surface Mount'. No border, no background — just text in a separate column from main content, connected by a thin horizontal rule (#4a0a05, 1px).

### Horizontal Scroll Carousel
**Role:** Product category browser

Row of Product Category Cards with 12px column gap. Arrow controls (← →) at the right edge, rendered as 14px Mier A, #4a0a05, no background. Cards scroll horizontally; no pagination dots. A thin 1px #4a0a05 line above the carousel acts as a section rule.

### Section Divider
**Role:** Vertical rhythm separator

Thin 1px horizontal line, #4a0a05 or #bcb6a6, spanning the full content width. Used to separate catalog sections, journal sections, and footer. No vertical dividers, no decorative elements — just a hairline.

### Pill Tag
**Role:** Category or filter label

9999px border-radius. Background: #f8f7f1. Text: 13px Mier A, #4a0a05. Padding: 4px 12px. No border. Used sparingly for product tags or filters.

### Multi-Column Footer
**Role:** Site footer with contact and navigation

White (#fafaf9) background, 1px #4a0a05 top border. Multi-column text links at 13px Mier A, #4a0a05. Columns: brand info, showroom addresses, contact email. No social icons (text links only), no newsletter form. Generous vertical padding (40-64px).

## Do's and Don'ts

### Do
- Use #4a0a05 oxblood for all text, borders, and links — it is the only chromatic color and must carry every word, rule, and interactive element
- Pair Caslon Ionic serif at 24px for category names, journal headlines, and the wordmark with Mier A sans at 13-18px for all body, nav, and UI text
- Let photography fill its container edge-to-edge with 0px border-radius and 0px padding — images are full-bleed, never framed or rounded
- Use 12px gaps in navigation rows and between related elements; 64px between major sections to let photography breathe
- Set page backgrounds to #fafaf9 warm cream — never pure #ffffff; the warm off-white is essential to the paper-stock feel
- Use horizontal scroll carousels with small arrow controls for product categories rather than paginated grids or filters
- Date-stamp journal cards with small sidebar labels in a separate column, not badges or pills overlaid on images

### Don't
- Don't use filled colored buttons — the system is entirely text-link driven; an outlined/underlined text link in #4a0a05 is the only action style
- Don't apply border-radius to images, cards, or panels — only pill tags at 9999px may be rounded; everything else is sharp
- Don't use drop shadows for elevation — depth comes from photography and warm color temperature, never from box-shadow
- Don't use pure white (#ffffff) backgrounds — always use #fafaf9 or #f8f7f1; the warmth is the brand
- Don't introduce accent colors beyond oxblood — the palette is intentionally narrow; adding blue, green, or other hues breaks the editorial coherence
- Don't use system fonts or substitute the Caslon/Mier pairing — the serif-sans tension is the brand's typographic identity
- Don't center-align body text or use large display headlines — the system is left-aligned and restrained; headlines are 24px, not 48px+

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Cream Paper | `#fafaf9` | Page background; the default canvas for all editorial content |
| 1 | Aged Linen | `#f8f7f1` | Subtle surface lift for tags, secondary panels, and quiet differentiation |
| 2 | Warm Stone | `#bcb6a6` | Mid-tone wash for section backgrounds or accent surfaces |

## Elevation

No shadows. Depth and hierarchy are created through warm color temperature, full-bleed photography, and generous negative space. Elements sit on the same flat plane; the eye moves between them through contrast in color temperature and scale, not elevation. This is a deliberate editorial choice — the design reads as printed paper, not a screen UI.

## Imagery

Full-bleed interior photography dominates the visual field. All images are atmospheric, warm-toned scenes of rooms and objects in context — golden-hour light, candlelit interiors, textured walls, no people, no isolated product shots on white. Images have no border-radius, no padding around them, no visible frames; they sit flush against the cream page. Color treatment is consistently warm: amber, terracotta, deep shadow, muted greens from plants. Photography serves as both content and atmosphere — it IS the page chrome. No illustrations, no icons, no decorative graphics; the wordmark and category names do the work of branding.

## Layout

Full-bleed hero with overlaid serif headline positioned lower-left. Below the fold: centered max-width content (~1200px) with a persistent narrow left sidebar column for section labels ('Our Catalog', 'Lathely', 'Featured'). Horizontal scroll product carousel with small arrow controls at the right edge. Two-column side-by-side journal cards with date stamps. Footer with multi-column text links. The layout rhythm alternates between full-bleed photographic moments and quiet, text-driven editorial pages — photography is the punctuation, text is the prose. Navigation is a single thin top bar of text links, no background fill, no border.

## Agent Prompt Guide

## Quick Color Reference
- Text: #4a0a05
- Background: #fafaf9
- Surface/secondary: #f8f7f1
- Border: #4a0a05
- Accent: #4a0a05
- primary action: #4a0a05 (outlined action border)

## Example Component Prompts

1. **Full-bleed hero with overlaid headline**: Full-viewport-width warm interior photograph. White serif headline 'In Common With' at 24px Caslon Ionic, left-aligned, positioned at ~30% from top. White sans subtitle 'A dialogue between light, material, and form' at 13px Mier A directly below. White text link 'Explore Outdoor' at 14px Mier A with 1px white underline, 8px below subtitle. No button shapes.

2. **Product category card**: Full-bleed interior photograph (0px border-radius, 0px padding). Category name 'Floor Lamps' at 24px Caslon Ionic, #4a0a05, with superscript count '5'. 'Shop' text link at 14px Mier A, #4a0a05, with 1px #4a0a05 underline, 8px below the name. White #fafaf9 card background, no border, no shadow.

3. **Journal editorial card**: Full-bleed editorial photograph. Date stamp 'May 13, 2024' at 13px Mier A, #4a0a05, 12px above image. Headline 'Welcome to Quarters' at 24px Caslon Ionic, #4a0a05, 12px below image. 'Read More' text link at 14px Mier A, #4a0a05, underlined, 12px below headline. White #fafaf9 background.

4. **Top navigation bar**: Transparent background, no border. Left: 'Shop' at 14px Mier A, #4a0a05. Center: 'Collections', 'Showroom' at 14px Mier A, #4a0a05. Right: 'Info', 'Trade', 'Search', 'Sign In', 'Cart (0)' at 14px Mier A, #4a0a05. 12px gap between items. No logo in nav — the wordmark appears in content.

5. **Sidebar section label with content**: Narrow ~120px left column with 'Our Catalog' at 14px Mier A, #4a0a05, left-aligned. Thin 1px #4a0a05 horizontal rule extending right from the label across the full content width. Main content begins to the right of the sidebar column.

## Similar Brands

- **Hem** — Same warm minimal furniture aesthetic with photography-driven product presentation and text-link commerce
- **Menu Space** — Same lighting category with warm interior photography, restrained typography, and minimal UI chrome
- **Allied Maker** — Same editorial layout language with serif headlines over sans body, full-bleed product photography, and oxblood/dark text on warm white
- **Workstead** — Same warm interior photography, narrow sans-serif UI, and serif accent on category and journal titles
- **Apparatus Studio** — Same lighting brand aesthetic with moody warm photography, text-link navigation, and a single dark accent color on cream backgrounds

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-oxblood-ink: #4a0a05;
  --color-cream-paper: #fafaf9;
  --color-aged-linen: #f8f7f1;
  --color-warm-stone: #bcb6a6;
  --color-dusty-clay: #a2827f;

  /* Typography — Font Families */
  --font-mier-a: 'Mier A', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-caslon-ionic: 'Caslon Ionic', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 13px;
  --leading-caption: 1.2;
  --text-body: 18px;
  --leading-body: 1.2;
  --text-subheading: 24px;
  --leading-subheading: 1.2;
  --text-heading: 26px;
  --leading-heading: 1.2;

  /* Typography — Weights */
  --font-weight-regular: 400;

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
  --spacing-56: 56px;
  --spacing-60: 60px;
  --spacing-80: 80px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 64px;
  --card-padding: 0px;
  --element-gap: 12px;

  /* Border Radius */
  --radius-full: 9999px;

  /* Named Radii */
  --radius-tags: 9999px;
  --radius-cards: 0px;
  --radius-pills: 9999px;
  --radius-images: 0px;
  --radius-buttons: 0px;

  /* Surfaces */
  --surface-cream-paper: #fafaf9;
  --surface-aged-linen: #f8f7f1;
  --surface-warm-stone: #bcb6a6;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-oxblood-ink: #4a0a05;
  --color-cream-paper: #fafaf9;
  --color-aged-linen: #f8f7f1;
  --color-warm-stone: #bcb6a6;
  --color-dusty-clay: #a2827f;

  /* Typography */
  --font-mier-a: 'Mier A', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-caslon-ionic: 'Caslon Ionic', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 13px;
  --leading-caption: 1.2;
  --text-body: 18px;
  --leading-body: 1.2;
  --text-subheading: 24px;
  --leading-subheading: 1.2;
  --text-heading: 26px;
  --leading-heading: 1.2;

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
  --spacing-56: 56px;
  --spacing-60: 60px;
  --spacing-80: 80px;

  /* Border Radius */
  --radius-full: 9999px;
}
```
