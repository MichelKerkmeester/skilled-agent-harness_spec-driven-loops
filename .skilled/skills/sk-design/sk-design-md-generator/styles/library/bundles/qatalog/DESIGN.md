# Qatalog — Style Reference
> ink on paper with two violet sparks

**Theme:** light

Qatalog operates as a near-monochrome productivity canvas: white background, dark slate ink, and a restrained two-violet accent system that appears as small functional punctuation rather than broad washes. Typography is compact and confident — Plus Jakarta Sans at weights 650-700 carries headlines with tight negative tracking, while Inter handles body and UI chrome at smaller sizes. Surfaces stay flat; depth comes from dark filled cards and 9px radii, never from drop shadows. The single vivid moment is a rainbow gradient that crowns the final dark CTA section, acting as the only chromatic release across an otherwise quiet, architectural layout.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Ink | `#292d34` | `--color-ink` | Primary text, dark surface fills, structural borders — cool near-black that reads as the dominant ink across the system |
| Pure White | `#ffffff` | `--color-pure-white` | Page canvas, card surfaces, text on dark fills |
| Slate | `#646464` | `--color-slate` | Secondary text, link borders, muted UI chrome — the mid-gray that carries nav, list borders, and body annotations |
| Charcoal | `#202020` | `--color-charcoal` | Dark filled button backgrounds, dark card surfaces, deep accent panels |
| Black | `#000000` | `--color-black` | Icon fills, pure dark accents, maximum-contrast text on light surfaces |
| Ash | `#838383` | `--color-ash` | Muted helper text, badge borders, disabled-state borders |
| Fog | `#e8e8e8` | `--color-fog` | Hairline dividers, subtle surface separation |
| Mist | `#f0f0f0` | `--color-mist` | Subtle surface tint behind nav and ghost buttons |
| Iris | `#7b68ee` | `--color-iris` | Primary accent — link text, interactive borders, feature labels, eyebrow text; vivid violet used sparingly as a signal color |
| Aubergine | `#514b81` | `--color-aubergine` | Deep accent — section dividers, secondary violet border, paired with Iris for two-tone violet treatments |
| Prism | `linear-gradient(250deg, rgba(0,0,0,0) calc(50% - 36.1353px), #0091ff, #a43cb4, #f100e3, #0091ff, #a43cb4, rgba(0,0,0,0) calc(50% + 36.1353px))` | `--color-prism` | Anchor color of the signature rainbow gradient sweep (with cyan #0091ff and magenta #f100e3) |

## Tokens — Typography

### Plus Jakarta Sans — Display and heading face — carries hero (60px), section headings (40-48px), and bold subheads (34px) at weights 650-700; the tight -0.035em to -0.047em tracking at 40-60px gives headlines a dense, engineered quality rather than airy SaaS default. Weight 400 is reserved for occasional body-large passages. Substitute: Inter, Manrope · `--font-plus-jakarta-sans`
- **Substitute:** Inter, Manrope
- **Weights:** 400, 650, 700
- **Sizes:** 16, 34, 40, 48, 60
- **Line height:** 1.10–1.50
- **Letter spacing:** -0.047em at 60px, -0.040em at 48px, -0.035em at 40px
- **OpenType features:** `"calt" 0`
- **Role:** Display and heading face — carries hero (60px), section headings (40-48px), and bold subheads (34px) at weights 650-700; the tight -0.035em to -0.047em tracking at 40-60px gives headlines a dense, engineered quality rather than airy SaaS default. Weight 400 is reserved for occasional body-large passages. Substitute: Inter, Manrope

### Inter — UI and body face — navigation, button labels, body copy, captions, and small numeric labels. Weight 650 is the button/badge weight; 500-600 for nav and labels; 400 for body. Tracking is subtly negative even at 14-16px, giving text a tight, considered feel. Substitute: system-ui, -apple-system · `--font-inter`
- **Substitute:** system-ui, -apple-system
- **Weights:** 400, 500, 600, 650
- **Sizes:** 8, 12, 14, 16, 18
- **Line height:** 1.00–1.50
- **Letter spacing:** -0.020em at 18px, -0.018em at 16px, -0.014em at 14px, -0.011em at 12px, -0.010em at 8px
- **OpenType features:** `"calt" 0, "clig" 0, "liga" 0`
- **Role:** UI and body face — navigation, button labels, body copy, captions, and small numeric labels. Weight 650 is the button/badge weight; 500-600 for nav and labels; 400 for body. Tracking is subtly negative even at 14-16px, giving text a tight, considered feel. Substitute: system-ui, -apple-system

### Sometype Mono — Eyebrow and badge accent — uppercase mono labels for section tags and feature eyebrows, adding a technical/editorial counterpoint to the sans-serif system. Substitute: JetBrains Mono, IBM Plex Mono · `--font-sometype-mono`
- **Substitute:** JetBrains Mono, IBM Plex Mono
- **Weights:** 500
- **Sizes:** 14, 16
- **Line height:** 1.25–1.29
- **Role:** Eyebrow and badge accent — uppercase mono labels for section tags and feature eyebrows, adding a technical/editorial counterpoint to the sans-serif system. Substitute: JetBrains Mono, IBM Plex Mono

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| badge | 12px | 1.14 | -0.132px | `--text-badge` |
| body-sm | 14px | 1.43 | -0.196px | `--text-body-sm` |
| body | 16px | 1.5 | -0.288px | `--text-body` |
| subheading | 18px | 1.38 | -0.36px | `--text-subheading` |
| heading-sm | 34px | 1.2 | -1.19px | `--text-heading-sm` |
| heading | 40px | 1.15 | -1.4px | `--text-heading` |
| heading-lg | 48px | 1.15 | -1.92px | `--text-heading-lg` |
| display | 60px | 1.1 | -2.82px | `--text-display` |

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
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 52 | 52px | `--spacing-52` |
| 160 | 160px | `--spacing-160` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 9px |
| cards | 18px |
| links | 9px |
| images | 18-30px |
| buttons | 9px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80-120px
- **Card padding:** 32-48px
- **Element gap:** 8-16px

## Components

### Primary Dark Button
**Role:** Filled CTA for conversion actions

Dark filled button with #202020 background, white text, 9px border-radius, 9px vertical and 20px horizontal padding. Inter weight 650, 16px, tracking -0.288px. Used for 'Get started' and signup actions. No drop shadow; depth comes from the dark fill against white canvas.

### Ghost / Text Link
**Role:** Secondary navigation and inline links

Borderless text link in Iris #7b68ee at Inter 16px weight 500-650, with a 9px-radius underline or pill affordance on hover. Frequently paired with an arrow glyph. Acts as the primary chromatic punctuation across the page.

### Outlined Action Border
**Role:** Accent border treatment for cards and feature highlights

1px border in Iris #7b68ee (or Aubergine #514b81 for secondary), 9px radius. Applied to feature cards and interactive surfaces that need accent emphasis without a filled background.

### Navigation Bar
**Role:** Top-level site navigation

White background, horizontal flex layout with logo left, nav items center, CTAs right. Nav text in Inter 14-16px weight 500, Slate #646464 for inactive, Ink #292d34 for active/hover. 9px-radius pill affordance for dropdown triggers. 12px vertical padding, 20px horizontal.

### Hero Card (Dark Product Preview)
**Role:** Dark surface that showcases the product UI

Large rounded panel with Ink #292d34 or Charcoal #202020 background, 18px border-radius, 32-48px internal padding. Contains product UI mockups (search bar, app grid) rendered in white/light tones against the dark surface. This is the page's signature component — a dark island floating on white.

### Feature Grid Card
**Role:** Two-column feature highlight blocks

Minimal card with no background or border by default. Iris #7b68ee title at Inter 16-18px weight 650, body copy in Slate #646464 at 14-16px. Cards sit in a 2-column grid with 30-48px row gap and no visible card chrome — the typography itself defines the unit.

### Eyebrow Label
**Role:** Section preamble text

Uppercase or sentence-case label in Sometype Mono or Inter weight 650, Iris #7b68ee or Slate #646464, 12-14px. Sits 16-24px above the heading it qualifies.

### Gradient CTA Panel
**Role:** Final conversion section with chromatic release

Dark Charcoal #202020 background panel with 18px radius, containing white headline text and a white 'Get started' button. The signature rainbow gradient (cyan #0091ff → magenta #a43cb4 → hot pink #f100e3) appears as a thin luminous band or edge highlight, providing the page's only multi-chromatic moment.

### Trust Logo Strip
**Role:** Social proof row of customer logos

Single horizontal row of grayscale partner logos (Dish, Deloitte, Pfizer, Adobe, American, NBCUniversal) on white background, separated by even 30-40px gaps. Logos rendered in Slate #646464, never in brand color.

### Search / Product Input
**Role:** In-product input affordance shown in mockups

Dark surface input with white placeholder text 'Search or Ask' in Inter 16-18px, full-width within the dark card, no visible border — defined by the dark surface beneath. Includes a + icon affordance and a dropdown of integration icons.

### Footer Link Column
**Role:** Multi-column site footer

White background, 5-column grid of link lists. Column headers in Ink #292d34 Inter 16px weight 650; links in Slate #646464 Inter 14px weight 400, 5-8px row gap. Logo sits above the first column.

### App Icon Tile
**Role:** Decorative product icon cluster in hero

Small rounded square tiles (9-12px radius) in white or light surface with colorful brand icons inside, arranged in a loose grid behind the dark search card. Rounded but not pill-shaped; flat color fills, no shadows.

### Star Rating Badge
**Role:** Social proof rating display

Row of small gold star icons followed by review count text in Inter 12-14px Slate #646464. Inline horizontal layout, no border or background.

## Do's and Don'ts

### Do
- Use #292d34 Ink for all primary text and dark surface fills; never introduce a third near-black shade
- Reserve Iris #7b68ee exclusively for interactive text links, feature labels, and accent borders — never as a background fill or large headline color
- Set border-radius to 9px for all buttons, nav pills, and inline links; use 18px only for cards and large image containers
- Apply -0.035em to -0.047em letter-spacing on all Plus Jakarta Sans headlines at 40px and above; this tight tracking is signature
- Use Sometype Mono (or a mono substitute) for uppercase eyebrow labels at 12-14px, never for body copy
- Keep the page background pure white #ffffff; introduce surface tint only as #f0f0f0 Mist behind ghost controls or nav wells
- Let the dark Hero Card and Gradient CTA Panel be the only dark surfaces on a page; everything else stays light

### Don't
- Do not use Iris #7b68ee or Aubergine #514b81 as a filled button background — buttons are always Charcoal #202020 or ghost
- Do not add drop shadows to cards or buttons; the system is flat — depth comes from dark surface contrast only
- Do not use rounded corners above 30px anywhere; the 9px/18px pair is the system
- Do not introduce a third accent hue; the two-violet system (Iris + Aubergine) is the full chromatic vocabulary, plus the gradient panel
- Do not use serif, display, or decorative fonts; Plus Jakarta Sans and Inter carry the entire type system
- Do not use color for body copy other than Ink #292d34 (primary) and Slate #646464 (secondary); Ash #838383 is the floor for muted text
- Do not break the compact spacing rhythm with generous 60-80px element gaps; internal UI stays at 4-20px, with 80-120px reserved for inter-section breaks

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Canvas | `#ffffff` | Default page background, occupies the majority of screen real estate |
| 2 | Mist Well | `#f0f0f0` | Subtle tint behind ghost controls and nav wells |
| 3 | Dark Card | `#202020` | Hero product preview card and gradient CTA panel — the system's only dark surface tier |
| 4 | Ink Panel | `#292d34` | Secondary dark surface for product mockups and structural dark sections |

## Elevation

The system is intentionally shadowless. Depth is communicated through surface color contrast (white canvas → dark filled cards) and 9px/18px corner radii, never through drop shadows. This keeps the interface flat, fast, and print-like.

## Imagery

Imagery is restrained and product-focused. The hero features a dark product preview card containing a search bar and a loose grid of colorful third-party app icons (Google Drive, Slack, Notion, etc.) as soft, slightly blurred decorative tiles behind the search affordance. A secondary image shows a dense field of glowing app icons on a near-black background, used as a decorative panel beside feature text. Photography is absent — all visual content is product UI mockups, icon clusters, and the one signature rainbow gradient. Icons are filled, brand-colored, and tightly cropped. Imagery occupies roughly 30% of the page, serving as demonstration rather than atmosphere.

## Layout

Max-width ~1200px centered container with generous outer margins. The page follows a vertical rhythm of alternating white bands and dark surface islands: a light hero with a dark product card on the right, a white two-column feature section with text-left/image-right, a full-width dark gradient CTA panel, then a dense multi-column footer. Section gaps are 80-120px, internal element gaps stay compact at 8-20px. Navigation is a single top bar, non-sticky, with logo left, links center, and two text CTAs right. Grids are conservative — 2-column feature rows, 5-column footer, single-row trust strip. The layout prioritizes whitespace and typographic hierarchy over visual density.

## Agent Prompt Guide

**Quick Color Reference**
- text (primary): #292d34 Ink
- text (secondary): #646464 Slate
- background: #ffffff
- border: #646464 Slate (links) / #7b68ee Iris (accent)
- accent: #7b68ee Iris (links, eyebrows, feature labels)
- primary action: #202020 (filled action)

**Example Component Prompts**
1. Build a hero: white #ffffff background, eyebrow 'STRENGTHENING THE CONVERGED AI WORKSPACE' in Sometype Mono 12px uppercase #646464, headline 'ClickUp has acquired Qatalog' in Plus Jakarta Sans 60px weight 700 #292d34 letter-spacing -2.82px, body at Inter 16px #646464, and a dark filled button '→ Get started' with #202020 background, white text, 9px radius, 9px 20px padding, Inter 16px weight 650.
2. Build a dark product preview card: #202020 background, 18px radius, 32px padding, containing a search input 'Search or Ask' in white Inter 18px, a + icon button in a 9px-radius dark #292d34 pill, and a row of 9px-radius white icon tiles below.
3. Build a two-column feature block: left column has four mini-cards, each with an Iris #7b68ee title in Inter 16px weight 650 and Slate #646464 body in Inter 14px; right column is a full-bleed image with 18px radius.
4. Build a gradient CTA panel: #202020 background, 18px radius, 48px padding, with a thin horizontal rainbow gradient band (linear-gradient(90deg, #0091ff, #a43cb4, #f100e3)) along the top edge as a 4px-tall accent, white headline in Plus Jakarta Sans 48px weight 700, and a white 'Get started' button with 1px white border, 9px radius.
5. Build a footer: 5-column grid on white #ffffff, column headers in Ink #292d34 Inter 16px weight 650, links in Slate #646464 Inter 14px weight 400 with 5px row gap; ClickUp logo in 9px-radius tile above the first column.

## Similar Brands

- **Linear** — Same compact monochrome foundation with a single accent hue used only for interactive signals; identical 8-10px radii and shadowless flat surfaces
- **Vercel** — Shared near-white canvas, tight typographic tracking, and dark-only product preview cards as the page's primary visual device
- **Notion** — Restrained two-color accent system (violet equivalents), generous whitespace, and typography-driven feature sections over heavy illustration
- **Stripe** — Architectural layout rhythm with alternating light/dark bands, plus Jakarta/Inter-adjacent sans-serif pairing, and minimal shadow reliance

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-ink: #292d34;
  --color-pure-white: #ffffff;
  --color-slate: #646464;
  --color-charcoal: #202020;
  --color-black: #000000;
  --color-ash: #838383;
  --color-fog: #e8e8e8;
  --color-mist: #f0f0f0;
  --color-iris: #7b68ee;
  --color-aubergine: #514b81;
  --color-prism: #a43cb4;
  --gradient-prism: linear-gradient(250deg, rgba(0,0,0,0) calc(50% - 36.1353px), #0091ff, #a43cb4, #f100e3, #0091ff, #a43cb4, rgba(0,0,0,0) calc(50% + 36.1353px));

  /* Typography — Font Families */
  --font-plus-jakarta-sans: 'Plus Jakarta Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-sometype-mono: 'Sometype Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-badge: 12px;
  --leading-badge: 1.14;
  --tracking-badge: -0.132px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.43;
  --tracking-body-sm: -0.196px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.288px;
  --text-subheading: 18px;
  --leading-subheading: 1.38;
  --tracking-subheading: -0.36px;
  --text-heading-sm: 34px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -1.19px;
  --text-heading: 40px;
  --leading-heading: 1.15;
  --tracking-heading: -1.4px;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.15;
  --tracking-heading-lg: -1.92px;
  --text-display: 60px;
  --leading-display: 1.1;
  --tracking-display: -2.82px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-w650: 650;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-52: 52px;
  --spacing-160: 160px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80-120px;
  --card-padding: 32-48px;
  --element-gap: 8-16px;

  /* Border Radius */
  --radius-lg: 9px;
  --radius-xl: 12px;
  --radius-2xl: 18px;
  --radius-3xl: 30px;

  /* Named Radii */
  --radius-nav: 9px;
  --radius-cards: 18px;
  --radius-links: 9px;
  --radius-images: 18-30px;
  --radius-buttons: 9px;

  /* Surfaces */
  --surface-canvas: #ffffff;
  --surface-mist-well: #f0f0f0;
  --surface-dark-card: #202020;
  --surface-ink-panel: #292d34;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-ink: #292d34;
  --color-pure-white: #ffffff;
  --color-slate: #646464;
  --color-charcoal: #202020;
  --color-black: #000000;
  --color-ash: #838383;
  --color-fog: #e8e8e8;
  --color-mist: #f0f0f0;
  --color-iris: #7b68ee;
  --color-aubergine: #514b81;
  --color-prism: #a43cb4;

  /* Typography */
  --font-plus-jakarta-sans: 'Plus Jakarta Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-sometype-mono: 'Sometype Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-badge: 12px;
  --leading-badge: 1.14;
  --tracking-badge: -0.132px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.43;
  --tracking-body-sm: -0.196px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.288px;
  --text-subheading: 18px;
  --leading-subheading: 1.38;
  --tracking-subheading: -0.36px;
  --text-heading-sm: 34px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -1.19px;
  --text-heading: 40px;
  --leading-heading: 1.15;
  --tracking-heading: -1.4px;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.15;
  --tracking-heading-lg: -1.92px;
  --text-display: 60px;
  --leading-display: 1.1;
  --tracking-display: -2.82px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-52: 52px;
  --spacing-160: 160px;

  /* Border Radius */
  --radius-lg: 9px;
  --radius-xl: 12px;
  --radius-2xl: 18px;
  --radius-3xl: 30px;
}
```
