# LogoArchive — Style Reference
> midnight gallery of iconic marks

**Theme:** dark

LogoArchive uses a midnight-gallery language: a near-black canvas, hairline white borders, and Swiss-precision typography (Suisse International) that alternates upright and italic weights to mark emphasis. The entire interface is monochromatic — black, three shades of charcoal, and white — with a single vivid yellow (#fde533) used as functional punctuation for primary actions, badges, and the logo book mark. Surfaces are flat with no shadows; depth comes from tonal layering between #18181b, #27272a, and #343538. Components are pill-shaped or generously rounded, compactly spaced, and always low-weight. The aesthetic reads as a curated archive or design museum after hours — quiet, authoritative, slightly editorial.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Canvas Charcoal | `#27272a` | `--color-canvas-charcoal` | Page background, primary canvas surface |
| Elevated Ink | `#18181b` | `--color-elevated-ink` | Card surfaces, product window backgrounds, logo tiles — one step deeper than canvas for contrast |
| Slate Surface | `#343538` | `--color-slate-surface` | Dark borders and separators for elevated surfaces and inverted UI. Do not promote it to the primary CTA color |
| Deep Void | `#000000` | `--color-deep-void` | Nav fills, deepest surface tone, pure black accents |
| Near Black | `#0c0c0e` | `--color-near-black` | List borders, hairline dividers, subtle structural edges |
| Pure White | `#ffffff` | `--color-pure-white` | Primary text, icons, borders, high-contrast elements — the dominant interface color |
| Fog Gray | `#a8afb7` | `--color-fog-gray` | Muted body text, secondary headings, subtle borders — readable but recessive |
| Mist Gray | `#dadee4` | `--color-mist-gray` | Light borders, disabled-state text, very subtle dividers |
| Dim Stone | `#8c8c8d` | `--color-dim-stone` | Placeholder/disabled surfaces, inactive list backgrounds |
| Signal Yellow | `#fde533` | `--color-signal-yellow` | Yellow outline accent for tags, dividers, and focused UI edges. Do not promote it to the primary CTA color |

## Tokens — Typography

### Suisse International — Primary typeface for all UI text, body, navigation, buttons, and most headings · `--font-suisse-international`
- **Substitute:** Inter, Söhne, Neue Haas Grotesk
- **Weights:** 400, 500
- **Sizes:** 12, 14, 16, 18, 19, 24, 28, 65, 96
- **Line height:** 0.9–1.75
- **Role:** Primary typeface for all UI text, body, navigation, buttons, and most headings

### Suisse Works Book — Italic display emphasis in hero and section headlines · `--font-suisse-works-book`
- **Substitute:** Söhne Buch Italic, GT Sectra Italic
- **Weights:** 400
- **Sizes:** 65, 96
- **Line height:** 1.0–1.2
- **Role:** Italic display emphasis in hero and section headlines

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.5 | — | `--text-caption` |
| body-sm | 14px | 1.75 | — | `--text-body-sm` |
| body | 16px | 1.75 | — | `--text-body` |
| subheading | 19px | 1.2 | — | `--text-subheading` |
| heading-sm | 24px | 1.2 | — | `--text-heading-sm` |
| heading | 28px | 1 | — | `--text-heading` |
| display | 65px | 1 | — | `--text-display` |
| display-lg | 96px | 0.9 | — | `--text-display-lg` |

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
| 32 | 32px | `--spacing-32` |
| 36 | 36px | `--spacing-36` |
| 40 | 40px | `--spacing-40` |
| 80 | 80px | `--spacing-80` |
| 100 | 100px | `--spacing-100` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 28px |
| large | 40px |
| tiles | 20px |
| badges | 999px |
| subtle | 4px |
| buttons | 999px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 64px
- **Card padding:** 32px
- **Element gap:** 8px

## Components

### Primary CTA Button
**Role:** Main call-to-action for conversion (pricing, signup)

Pill-shaped, 999px radius. Background #fde533, text #000000. Padding 10px 16px. Font: Suisse International 14px weight 500. No border. The yellow against charcoal creates high contrast that makes the action feel urgent but not aggressive — it's editorial, not e-commerce.

### Secondary Button
**Role:** Secondary actions (pricing, learn more)

Pill-shaped, 999px radius. Background #343538 or #27272a, text #ffffff. Padding 10px 16px. Font: Suisse International 14px weight 500. Sits quietly next to the primary CTA — a supporting voice.

### Ghost Nav Button
**Role:** Top-right utility actions (Log in)

Pill-shaped, 999px radius. Transparent or #27272a background, 1px #343538 border, text #ffffff. Padding 4px 12px. Font: Suisse International 12px. Minimal weight — almost disappears into the nav bar.

### Feature Badge
**Role:** Pill label above section headings (e.g., 'A new format of logo inspiration')

Pill-shaped, 999px radius. Background #fde533, text #000000. Padding 4px 8px. Font: Suisse International 12px weight 500. Centered above the section headline — signals 'new' or 'featured' without using color words.

### Logo Tile Card
**Role:** Individual logo display in the product grid

Rounded rectangle, 20px radius. Background #18181b, 1px #27272a border. White logo icon centered. Padding 32px. Represents the product's core unit — each logo is presented as a museum specimen on a dark plinth.

### Product Window Frame
**Role:** Desktop app screenshot container

macOS-style window chrome with traffic-light dots. Background #18181b interior, #27272a frame. 20px radius. Contains the product UI mockup. The window itself is part of the visual language — showing the product 'in context'.

### Mobile Device Frame
**Role:** Mobile app screenshot container

Phone-shaped frame with rounded corners (~40px). Dark interior #18181b. Overlaps or sits beside the desktop frame to show responsive design. Behaves like a secondary product specimen.

### Nav Bar
**Role:** Top navigation, site-wide

Full-width, 64px height. Background #000000 or transparent over canvas. Logo mark at far left (white LA monogram), utility button at far right. No centered nav links — minimal and directional.

### Hero Headline
**Role:** Primary page headline

Suisse International 65–96px, weight 400 (regular) for body of headline, weight 500 for bold fragments, Suisse Works Book italic for emphasis words. Text #ffffff. Line-height 0.9–1.0 for display. The typographic mix of roman + bold + italic is the signature.

### Subtext Paragraph
**Role:** Supporting copy below headlines or CTAs

Suisse International 14–16px weight 400. Color #a8afb7 (Fog Gray). Line-height 1.75. Centered in hero contexts. Recessive — never competes with the headline.

### Pricing Card
**Role:** Subscription tier display

Rounded card, 28px radius. Background #18181b, 1px #27272a border. Padding 32px. Contains tier name (24px weight 500 white), price (display size yellow), feature list (14px #a8afb7), and CTA button. The card is a dark showcase box — price glows yellow.

### Feature List Row
**Role:** Checklist item in pricing or feature sections

Horizontal row with small icon (white) and text (14px #ffffff). 8px gap between icon and text. 4–8px vertical padding. No background or border — just a clean row.

## Do's and Don'ts

### Do
- Use #fde533 only for primary CTAs, badges, and the logo mark — never for body text, icons, or decorative elements
- Pair Suisse International roman (400) with italic (Suisse Works Book) for editorial emphasis in display copy
- Use 999px border-radius for all buttons, badges, and interactive pills
- Layer surfaces using the tonal stack: #000000 → #0c0c0 → #18181b → #27272a → #343538
- Set body text to #a8afb7 at 14–16px with 1.75 line-height for readable, recessive supporting copy
- Keep all borders 1px and use #27272a or #343538 — never thicker, never chromatic
- Center-align hero and section headlines; left-align body and list content

### Don't
- Don't introduce a second accent color — the system is monochromatic with one yellow signal
- Don't use box-shadow for elevation — rely on tonal surface contrast only
- Don't use display sizes below 65px for headlines — the scale jumps from 28px to 65px intentionally
- Don't use system fonts or non-Swiss grotesques — the typographic identity is precise and mechanical
- Don't add gradients — the system is fully flat
- Don't use light-theme colors or white backgrounds — the system is dark-first
- Don't use borders thicker than 1px or with high contrast — borders are always hairline and subtle

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Deep Void | `#000000` | Nav bar, deepest layered surfaces |
| 1 | Near Black | `#0c0c0` | Structural borders and dividers |
| 2 | Elevated Ink | `#18181b` | Logo tiles, product window interiors |
| 3 | Canvas Charcoal | `#27272a` | Main page canvas, default surface |
| 4 | Slate Surface | `#343538` | Ghost buttons, secondary cards, subtle elevation |

## Elevation

- **Card on canvas:** `none — depth via tonal contrast (#18181b on #27272a), not shadow`
- **Button on card:** `none — flat fill distinguishes the button`

## Imagery

Imagery is minimal and product-focused. The primary visual content is the product itself — screenshots of the desktop and mobile apps showing the logo grid are the hero visuals. The logo grid is presented as specimens on dark tiles (like museum cards). No lifestyle photography, no illustrations, no decorative graphics. Icons are line-style, white, 1px stroke, used sparingly for nav and feature lists. The 'LA' monogram in the top-left is the only persistent brand mark.

## Layout

Full-bleed dark canvas, max-width ~1200px for content. Hero is a centered text block (not split) with a single headline, subtext, and dual CTA. Sections alternate between centered text and product showcase compositions — the product screenshots are the visual breaks between text blocks. Navigation is a minimal top bar with logo left and single utility button right (no horizontal nav links). Content density is compact but breathing — sections separated by 64px+ vertical gaps, with generous internal padding. The overall rhythm is: centered headline → product visual → centered headline → product visual, creating a museum-exhibit cadence.

## Agent Prompt Guide

Quick Color Reference:
- background (canvas): #27272a
- elevated surface: #18181b
- primary text: #ffffff
- muted text: #a8afb7
- border: #27272a or #343538
- accent / primary action: #27272a (filled action)

Example Component Prompts:

1. Create a Primary Action Button: #27272a background, #ffffff text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.

2. Pricing card: Background #18181b, 1px #27272a border, 28px radius, 32px padding. Tier name at 24px weight 500 in #ffffff. Price at 65px weight 400 in #fde533. Feature list rows: 14px #ffffff text, 8px gap from checkmark icon, 4px vertical padding. CTA button at bottom: #fde533 filled pill.

3. Feature badge: Pill shape, 999px radius, 4px 8px padding, #fde533 background, #000000 text, 12px Suisse International weight 500. Centered above a section headline.

4. Logo grid tile: Background #18181b, 20px radius, 1px #27272a border, 32px padding. White logo icon centered. Arranged in a 6-column grid with 16px gaps.

5. Nav bar: Full-width, 64px height, background #000000 or transparent. White 'LA' monogram at far left, ghost pill button (1px #343538 border, #ffffff text, 999px radius) at far right.

## Typography Signature

The defining typographic move is mixing three voices in a single headline: Suisse International roman (400) for the main statement, Suisse International bold (500) for supporting clauses, and Suisse Works Book italic for one or two key words. This creates an editorial cadence — the headline reads like a pull quote from a design magazine, not a SaaS product page. Italic is reserved exclusively for display-size copy; body text never italicizes.

## Similar Brands

- **Are.na** — Same dark-canvas, hairline-border, minimal-CTA approach with monochromatic palette and editorial restraint
- **Read.cv** — Dark mode, single accent color, pill-shaped buttons, Swiss-grotesk typography, and zero decorative imagery
- **Pitch** — Dark UI with compact density, rounded components, and a single vivid accent color against charcoal surfaces
- **Linear** — Dark-first interface, tonal surface layering without shadows, precise grotesque typography
- **Krea AI** — Dark gallery aesthetic with product-as-hero layout, minimal chrome, and one signal color for actions

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-canvas-charcoal: #27272a;
  --color-elevated-ink: #18181b;
  --color-slate-surface: #343538;
  --color-deep-void: #000000;
  --color-near-black: #0c0c0e;
  --color-pure-white: #ffffff;
  --color-fog-gray: #a8afb7;
  --color-mist-gray: #dadee4;
  --color-dim-stone: #8c8c8d;
  --color-signal-yellow: #fde533;

  /* Typography — Font Families */
  --font-suisse-international: 'Suisse International', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-suisse-works-book: 'Suisse Works Book', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --text-body-sm: 14px;
  --leading-body-sm: 1.75;
  --text-body: 16px;
  --leading-body: 1.75;
  --text-subheading: 19px;
  --leading-subheading: 1.2;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.2;
  --text-heading: 28px;
  --leading-heading: 1;
  --text-display: 65px;
  --leading-display: 1;
  --text-display-lg: 96px;
  --leading-display-lg: 0.9;

  /* Typography — Weights */
  --font-weight-regular: 400;
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
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-80: 80px;
  --spacing-100: 100px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 64px;
  --card-padding: 32px;
  --element-gap: 8px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-2xl: 20px;
  --radius-3xl: 28px;
  --radius-3xl-2: 40px;
  --radius-full: 999px;

  /* Named Radii */
  --radius-cards: 28px;
  --radius-large: 40px;
  --radius-tiles: 20px;
  --radius-badges: 999px;
  --radius-subtle: 4px;
  --radius-buttons: 999px;

  /* Surfaces */
  --surface-deep-void: #000000;
  --surface-near-black: #0c0c0;
  --surface-elevated-ink: #18181b;
  --surface-canvas-charcoal: #27272a;
  --surface-slate-surface: #343538;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-canvas-charcoal: #27272a;
  --color-elevated-ink: #18181b;
  --color-slate-surface: #343538;
  --color-deep-void: #000000;
  --color-near-black: #0c0c0e;
  --color-pure-white: #ffffff;
  --color-fog-gray: #a8afb7;
  --color-mist-gray: #dadee4;
  --color-dim-stone: #8c8c8d;
  --color-signal-yellow: #fde533;

  /* Typography */
  --font-suisse-international: 'Suisse International', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-suisse-works-book: 'Suisse Works Book', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --text-body-sm: 14px;
  --leading-body-sm: 1.75;
  --text-body: 16px;
  --leading-body: 1.75;
  --text-subheading: 19px;
  --leading-subheading: 1.2;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.2;
  --text-heading: 28px;
  --leading-heading: 1;
  --text-display: 65px;
  --leading-display: 1;
  --text-display-lg: 96px;
  --leading-display-lg: 0.9;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-80: 80px;
  --spacing-100: 100px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-2xl: 20px;
  --radius-3xl: 28px;
  --radius-3xl-2: 40px;
  --radius-full: 999px;
}
```
