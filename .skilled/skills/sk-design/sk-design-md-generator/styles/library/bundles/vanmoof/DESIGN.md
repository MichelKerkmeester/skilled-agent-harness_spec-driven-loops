# Vanmoof — Style Reference
> cinematic monochrome showroom

**Theme:** mixed

Vanmoof operates on radical monochromatic discipline: a black, white, and gray system where the only visual loudness comes from 280px product-letter typography and full-bleed dark product photography. The interface itself is almost invisible — thin 1px borders at #e5e7eb, ghost controls, no accent color, no decorative gradients, no brand fills. The page alternates between dark cinematic hero panels (where the product IS the color) and white editorial sections with quiet 4-column feature grids. Every chrome decision prioritizes negative space and typographic confidence over UI density. Components feel like museum labels next to sculpture, not a software dashboard. The 2px radius on buttons and 8px on cards keep geometry sharp and architectural, reinforcing a premium industrial-product language rather than a consumer-app softness.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Carbon | `#222222` | `--color-carbon` | Navigation bar, dark surface panels, primary text on light, logo wordmark fill — the near-black anchor of the system, softer than pure #000 for reduced eye strain on large surfaces |
| Obsidian | `#000000` | `--color-obsidian` | Body text, headline text on light surfaces, footer text — reserved for highest-emphasis type where absolute black is needed for maximum contrast (21:1 on white) |
| Graphite | `#313131` | `--color-graphite` | Secondary text, link text on light, button labels on light surfaces — the mid-dark step between Carbon and Obsidian for hierarchy without a hue shift |
| Frost | `#ffffff` | `--color-frost` | Page canvas for content sections, card surfaces, icon fills on dark hero, button text on dark fills |
| Paper | `#f7f7f7` | `--color-paper` | Subtle surface tint alternating with pure white for section banding, elevated card backgrounds when pure white feels too sharp |
| Mist | `#e5e7eb` | `--color-mist` | Hairline borders, dividers, nav separator lines, input borders, card outlines — the most-used color in the system by frequency (1231 occurrences), defining structural edges without visual weight |
| Ash | `#e0e0e0` | `--color-ash` | Secondary surface fills, muted background panels, subtle hover states — one step deeper than Mist for surfaces that need slightly more presence |

## Tokens — Typography

### Unica77LLWeb — Primary typeface for all UI and editorial text. Weight 400 for body and navigation, weight 600 for subheadings and button labels, weight 700 for product-name hero displays (S6, A5 at 280px) and section headings. The geometric humanist character with its tall x-height carries authority at massive sizes while remaining legible at 12px. The 280px step is the signature — product names function as graphic objects, not text. · `--font-unica77llweb`
- **Substitute:** Inter, or DM Sans for geometric humanist fallback
- **Weights:** 400, 600, 700
- **Sizes:** 12, 14, 16, 18, 24, 32, 48, 80, 280px
- **Line height:** 1.00–1.56 (display sizes use tight 1.0–1.1; body uses 1.43–1.56)
- **Role:** Primary typeface for all UI and editorial text. Weight 400 for body and navigation, weight 600 for subheadings and button labels, weight 700 for product-name hero displays (S6, A5 at 280px) and section headings. The geometric humanist character with its tall x-height carries authority at massive sizes while remaining legible at 12px. The 280px step is the signature — product names function as graphic objects, not text.

### Unica77Mono — Monospaced companion for technical metadata, spec labels, navigation micro-text, and any data-adjacent content (dimensions, weights, delivery estimates) where tabular alignment matters · `--font-unica77mono`
- **Substitute:** JetBrains Mono, or IBM Plex Mono
- **Weights:** 400
- **Sizes:** 14px
- **Line height:** 1.20
- **Role:** Monospaced companion for technical metadata, spec labels, navigation micro-text, and any data-adjacent content (dimensions, weights, delivery estimates) where tabular alignment matters

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.5 | — | `--text-caption` |
| body-sm | 14px | 1.43 | — | `--text-body-sm` |
| body | 16px | 1.5 | — | `--text-body` |
| subheading | 18px | 1.56 | — | `--text-subheading` |
| heading-sm | 24px | 1.33 | — | `--text-heading-sm` |
| heading | 32px | 1.25 | — | `--text-heading` |
| heading-lg | 48px | 1.1 | — | `--text-heading-lg` |
| display | 80px | 1 | — | `--text-display` |
| hero-product | 280px | 1 | — | `--text-hero-product` |

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
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 2px |
| cards | 8px |
| links | 8px |
| pills | 9999px |
| buttons | 2px |

### Layout

- **Page max-width:** 1440px
- **Section gap:** 64px
- **Card padding:** 24px
- **Element gap:** 8px

## Components

### Full-Bleed Dark Hero Panel
**Role:** Cinematic product showcase

Full-viewport dark photographic background (#222 to near-black gradient from the bike imagery), product name overlaid at 280px Unica77 weight 700 in #ffffff positioned left-third, supporting headline + ghost CTA positioned right-third at ~32% from right edge. The hero text never centers — it anchors left to create editorial tension with the right-aligned description. No overlay tint needed; the product photography provides its own darkness.

### Product Name Display
**Role:** Hero typographic element

Model identifier (S6, A5) rendered at 280px Unica77LLWeb weight 700, #ffffff on dark hero, letter-spacing normal, line-height 1.0. Functions as a graphic object — occupies the left portion of the hero at roughly 50% of viewport height. The single accent element in the entire visual system (a small red reflector/light on the bike itself) is part of the product, not the UI.

### Ghost CTA Button
**Role:** Primary call-to-action

Transparent background with 1px border in #ffffff (on dark hero) or #222222 (on light sections), 2px radius, 12px 24px padding, label in Unica77 weight 600 at 14px. Icon prefix (arrow ↗) in 12px before label. No fill state — these are always outline. Padding: 8px vertical, 24px horizontal.

### Top Navigation Bar
**Role:** Primary site navigation

Fixed/sticky top bar with #222222 background, #ffffff text, 64px height, horizontal flex layout. Left: hamburger menu icon (☰). Center: VANMOOF logo in outlined pill badge. Right: shopping bag icon. Separated from page content by a 1px #e5e7eb bottom border that only appears when content scrolls beneath.

### VANMOOF Logo Pill Badge
**Role:** Brand mark in navigation

Oval/pill shape with 9999px radius, 1px stroke border in #ffffff, transparent fill, VANMOOF text inside in Unica77 weight 700 at 12px tracking +0.1em uppercase, #ffffff. Functions as the wordmark container — the text alone would feel too small to anchor the nav.

### Country Selector Bar
**Role:** Localization prompt

Thin top bar above main nav, #ffffff background, 1px bottom border in #e5e7eb. Body text in Unica77 14px #000000 with bold weight on the country name. Inline 'Select country' button: #222222 background, #ffffff text, 2px radius, 8px 16px padding, 14px weight 600. Dismiss '×' icon right-aligned.

### Feature Card Grid Item
**Role:** App/feature section content card

4-column grid item on white background, no card surface (flat layout). Icon at 32px line-art in #222222 at top, heading in Unica77 weight 600 at 18px #000000 below icon, description in Unica77 weight 400 at 14px #313131. Vertical gap of 12px between icon, heading, and body. No border, no shadow, no background — pure typographic structure.

### App Feature Icon
**Role:** Visual identifier for feature cards

Monochromatic line-art icon in #222222, 32px size, 1.5px stroke weight, geometric and minimal. No fill, no color — always outlined. Aligned to start (left) of its card column.

### Section Header
**Role:** Editorial section title

Centered or left-aligned section title in Unica77 weight 600 at 32–48px #000000, with optional sub-description in 16px #313131 weight 400 below. Generous 64px padding-top from previous section. No dividers or decorative elements between sections — whitespace is the separator.

### Award Badge (iF Design Gold)
**Role:** Trust/credential marker

Small square badge ~48px in the bottom-left of the hero, gold/yellow background with iF logo and 'GOLD AWARD 2025' text in dark type. Positioned absolutely over the hero image. The only non-monochrome UI element permitted — a third-party credential, not a brand color choice.

### Hero Support Text Block
**Role:** Hero secondary messaging

Right-aligned text block in the hero: headline in Unica77 weight 400 at 16px #ffffff line-height 1.5, followed by the Ghost CTA Button with 16px vertical gap. Positioned at approximately 30% from right, 50% vertical. Maximum width ~280px.

### Delivery/Reservation Footer Link
**Role:** Micro-CTA at hero base

Small text link at bottom-right of hero: 'Reserve now →' or 'Delivery within 7 days →' in Unica77 14px #ffffff weight 400 with right-arrow glyph, positioned 24px from bottom-right corner. Functions as the secondary conversion path below the main ghost CTA.

## Do's and Don'ts

### Do
- Use 280px Unica77LLWeb weight 700 in #ffffff for all hero product names — this is the single most recognizable typographic signature
- Set button and nav radius to 2px; set card and link radius to 8px; use 9999px only for the VANMOOF logo pill — the geometric sharpness is intentional, not lazy default rounding
- Maintain 8px as the base spacing unit; snap all padding, margins, and gaps to multiples of 4px
- Render all icons as 1.5px stroke line-art in #222222 — no filled icons, no multicolor iconography, no emoji-style pictograms
- Use #e5e7eb for all structural dividers and borders; never use a heavier border weight than 1px
- Let product photography provide all color and atmosphere in hero sections — never add background tints, overlays, or gradients to UI chrome
- Alternate between #ffffff and #f7f7f7 for section banding in content areas to create rhythm without borders

### Don't
- Do not introduce any chromatic color (red, blue, green, purple) to the UI system — the monochromatic discipline IS the brand identity
- Do not use drop shadows, elevation, or blur effects on cards or buttons — flat surfaces only, separated by whitespace and hairlines
- Do not center hero text — always anchor product names left and supporting text right for editorial tension
- Do not set body text below 14px or above 18px; do not set display text below 80px (except the 280px hero step)
- Do not use border-radius values other than 2px (controls), 8px (containers), or 9999px (logo pill) — no 4px, 6px, 12px, 16px, or 24px radii
- Do not add background colors, patterns, or decorative graphics to white content sections — the product and typography carry the visual weight
- Do not use the Gold Award badge color (#FFD700 or similar) as a brand accent — it is a third-party credential, not a design system token

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Hero Panel | `#222222` | Full-bleed dark photographic background for product heroes — the darkest surface in the system |
| 1 | Canvas | `#ffffff` | Primary page background for content sections, feature grids, editorial blocks |
| 2 | Section Band | `#f7f7f7` | Alternating section tint to create visual rhythm between white content blocks |
| 3 | Muted Surface | `#e0e0e0` | Subtle background for inactive states, placeholder fills, or tertiary panels |
| 4 | Structural Line | `#e5e7eb` | Hairline border and divider color — defines edges without surface weight |

## Imagery

Imagery is the sole source of color and atmosphere in this system. Hero panels use full-bleed, high-contrast product photography — tight crops on bicycle frames, handlebars, lights, and wheels against dark studio backgrounds with no lifestyle context. The bike IS the subject; the photography eliminates all background noise, leaving the product to occupy the entire visual field. No people, no environments, no props. Lower sections transition to white-background product shots and UI mockups (app screens, dashboard tiles). The treatment is editorial-commerce: think automotive launch photography, not lifestyle cycling. Images are always rectangular with sharp corners (no rounding), overlapping the navigation boundary, and frequently full-bleed edge-to-edge. The 280px product name sits as a typographic overlay on the left, never centered, creating an asymmetric balance with the product imagery occupying the right and center.

## Layout

Page model is full-bleed with no max-width constraint on hero panels — dark cinematic imagery spans the entire viewport. Content sections after the hero use a centered max-width of ~1200–1440px with generous 24–64px horizontal gutters. The hero pattern is a single full-viewport dark panel per product, stacking vertically as the user scrolls (S6 hero, then A5 hero, then app section). Each hero is a split: oversized left-anchored product name (280px) + right-aligned supporting text with ghost CTA. Navigation is a fixed top bar with centered logo. Section rhythm alternates between dark full-bleed hero bands and white content sections, creating high-contrast vertical pulses. Content arrangement uses 4-column symmetric grids for feature cards (track, configure, share, unlock) with equal gutters. No sidebar, no mega-menu — the hamburger is the only nav trigger. Density is extremely sparse: each section gets 64–80px vertical padding, and the page never exceeds 5–6 content blocks above the fold of any given product.

## Agent Prompt Guide

**Quick Color Reference:**
- text: #000000
- background: #ffffff
- surface dark: #222222
- border: #e5e7eb
- secondary text: #313131
- primary action: no distinct CTA color

**Example Component Prompts:**

1. **Full-Bleed Dark Hero Section:** Full-viewport background of #222222 with a product photograph filling the frame. Left-aligned product name at 280px Unica77LLWeb weight 700, color #ffffff, positioned 8% from left, vertically centered. Right-aligned support text at 16px Unica77 weight 400 #ffffff, max-width 280px, positioned 30% from right, with a ghost outline button below (1px #ffffff border, 2px radius, 8px 24px padding, 14px weight 600 label, arrow icon prefix).

2. **Feature Card Grid (4-column):** White #ffffff background, 4 equal columns with 24px gaps. Each card: 32px line-art icon in #222222 at top-left, 18px Unica77 weight 600 heading in #000000 below with 12px gap, 14px Unica77 weight 400 description in #313131 below heading with 8px gap. No card background, no border, no shadow — pure typographic structure on white.

3. **Ghost Outline Button (light variant):** Transparent background, 1px solid border in #222222, 2px border-radius, 8px vertical 24px horizontal padding. Label in Unica77 weight 600 at 14px in #222222, followed by a 12px right-arrow icon (↗) in the same color. No hover fill — border darkens to #000000 on hover.

4. **Top Navigation Bar:** Fixed position, 64px height, background #222222. Flexbox with three zones: left (hamburger ☰ icon in #ffffff 20px), center (VANMOOF text in Unica77 weight 700 at 12px tracking +0.1em uppercase, #ffffff, inside a 9999px-radius pill with 1px #ffffff border and 6px 20px padding), right (shopping bag icon in #ffffff 20px). Bottom border: 1px solid #e5e7eb when scrolled.

5. **Editorial Content Section:** Background #ffffff, max-width 1200px centered, 64px vertical padding. Section heading centered in Unica77 weight 600 at 32px #000000, with 16px sub-description in #313131 below at 16px weight 400, 24px gap. Followed by 4-column feature grid with 32px row gap between heading block and grid.

## Typographic Signature

The 280px product-name display is the single most defining visual choice in this system. At this scale, the model identifier (S6, A5) stops being text and becomes a graphic object — it competes with the product photography for visual dominance rather than supporting it. This is an anti-convention approach: most product pages use large photography with moderate headlines (48–80px). Vanmoof inverts this by making the type itself monumental. The weight 700 at this size creates architectural weight without the need for a chromatic brand color. The line-height 1.0 eliminates any air above/below, allowing the letters to sit as solid shapes against the dark hero. Any new page in this system must include at least one element at this scale or above to maintain the signature.

## Flatness Philosophy

This system intentionally avoids all elevation devices — no drop shadows, no box-shadow, no blurs, no gradient backgrounds, no overlay tints on UI chrome. Spatial hierarchy is achieved exclusively through: (1) scale contrast (280px vs 14px), (2) value contrast (#000 vs #fff), (3) whitespace, and (4) the 1px #e5e7eb hairline. This flatness is deliberate: it positions the interface as a frame for the product, not as a competing visual layer. The product photography provides all the depth and atmosphere. When the UI itself adds depth, it competes with the product and breaks the editorial-showroom feel.

## Similar Brands

- **Apple (apple.com)** — Same monumental display typography over full-bleed dark product photography, same monochromatic discipline with zero accent color, same editorial whitespace-driven layout, same ghost outline button language
- **Nothing (nothing.tech)** — Same ultra-minimal interface with massive product-name typography, same hairline border restraint, same refusal to use color as brand identity — the product and type carry all visual weight
- **Teenage Engineering** — Same industrial-product-as-luxury-object treatment, same generous whitespace, same typographic confidence without decorative UI chrome, same monochromatic palette with product photography providing all atmosphere
- **Arc'teryx (arcteryx.com)** — Same premium-product editorial layout with full-bleed dark hero photography, same hairline border restraint, same ghost CTA pattern, same discipline of letting product imagery dominate over UI

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-carbon: #222222;
  --color-obsidian: #000000;
  --color-graphite: #313131;
  --color-frost: #ffffff;
  --color-paper: #f7f7f7;
  --color-mist: #e5e7eb;
  --color-ash: #e0e0e0;

  /* Typography — Font Families */
  --font-unica77llweb: 'Unica77LLWeb', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-unica77mono: 'Unica77Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --text-body-sm: 14px;
  --leading-body-sm: 1.43;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 18px;
  --leading-subheading: 1.56;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.33;
  --text-heading: 32px;
  --leading-heading: 1.25;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.1;
  --text-display: 80px;
  --leading-display: 1;
  --text-hero-product: 280px;
  --leading-hero-product: 1;

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
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-80: 80px;

  /* Layout */
  --page-max-width: 1440px;
  --section-gap: 64px;
  --card-padding: 24px;
  --element-gap: 8px;

  /* Border Radius */
  --radius-sm: 2px;
  --radius-lg: 8px;

  /* Named Radii */
  --radius-nav: 2px;
  --radius-cards: 8px;
  --radius-links: 8px;
  --radius-pills: 9999px;
  --radius-buttons: 2px;

  /* Surfaces */
  --surface-hero-panel: #222222;
  --surface-canvas: #ffffff;
  --surface-section-band: #f7f7f7;
  --surface-muted-surface: #e0e0e0;
  --surface-structural-line: #e5e7eb;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-carbon: #222222;
  --color-obsidian: #000000;
  --color-graphite: #313131;
  --color-frost: #ffffff;
  --color-paper: #f7f7f7;
  --color-mist: #e5e7eb;
  --color-ash: #e0e0e0;

  /* Typography */
  --font-unica77llweb: 'Unica77LLWeb', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-unica77mono: 'Unica77Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --text-body-sm: 14px;
  --leading-body-sm: 1.43;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 18px;
  --leading-subheading: 1.56;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.33;
  --text-heading: 32px;
  --leading-heading: 1.25;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.1;
  --text-display: 80px;
  --leading-display: 1;
  --text-hero-product: 280px;
  --leading-hero-product: 1;

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
  --radius-lg: 8px;
}
```
