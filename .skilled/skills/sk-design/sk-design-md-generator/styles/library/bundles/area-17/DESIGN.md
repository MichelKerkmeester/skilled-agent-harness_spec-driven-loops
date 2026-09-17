# AREA 17 — Style Reference
> Monochrome editorial struck yellow — a typographic monolith on white marble interrupted by a single flash of electric yellow.

**Theme:** light

AREA 17 operates as a monochrome editorial canvas with typographic confidence as its primary visual language. The system is deliberately austere: near-black text on pure white, hairline borders, flat surfaces, and almost no color — just one electric yellow that appears as a single bright accent against the grayscale field. Headlines do the heavy lifting through scale and tight tracking, using Suisse Intl at display sizes to create an editorial, almost magazine-like voice. Layout breathes with generous whitespace punctuated by full-bleed cinematic content blocks that break the typographic grid. The aesthetic reads as a design agency's own portfolio: restrained, opinionated, and confident enough to leave most of the page empty.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Pure White | `#ffffff` | `--color-pure-white` | Page canvas, input fields, inverse text on dark surfaces |
| Graphite | `#1a1a1a` | `--color-graphite` | Primary text, headlines, body copy, nav links — near-black warmth over pure black |
| True Black | `#000000` | `--color-true-black` | Logo mark fill, select borders, deep shadow tone |
| Hairline | `#e6e6e6` | `--color-hairline` | Borders, dividers, outlined control strokes, card edges |
| Fog | `#f2f2f2` | `--color-fog` | Secondary card surfaces, disabled button fills, subtle elevation layers |
| Cream Stone | `#f2ede9` | `--color-cream-stone` | Warm accent card surface — the only chromatic neutral, used for editorial feature cards |
| Muted | `#949494` | `--color-muted` | Secondary link color, meta text, subdued captions |
| Dim | `#757575` | `--color-dim` | Tertiary text, low-priority helper copy |
| Disabled | `#cccccc` | `--color-disabled` | Disabled button backgrounds, inactive control fills |
| Electric Yellow | `#fdf313` | `--color-electric-yellow` | Announcement bar, single chromatic accent across the system — the only color permitted to break monochrome |

## Tokens — Typography

### ui-sans-serif — ui-sans-serif — detected in extracted data but not described by AI · `--font-ui-sans-serif`
- **Weights:** 400
- **Sizes:** 16px
- **Line height:** 1.5
- **Role:** ui-sans-serif — detected in extracted data but not described by AI

### Suisse Intl — Primary brand typeface for headlines, navigation, body, and UI. The 55px display at line-height 1.10 with -0.015em tracking is the signature voice — editorial weight, magazine-tight rhythm. Weight 500 is reserved for nav links and select emphasis. · `--font-suisse-intl`
- **Substitute:** Inter, Söhne, or GT America for paid alternatives; Manrope as a free editorial-adjacent substitute
- **Weights:** 400, 500
- **Sizes:** 16px, 20px, 32px, 42px, 55px
- **Line height:** 1.10 / 1.15 / 1.40
- **Letter spacing:** -0.015em at 55px, -0.014em at 42px, -0.013em at 32px, 0.004em at small sizes
- **Role:** Primary brand typeface for headlines, navigation, body, and UI. The 55px display at line-height 1.10 with -0.015em tracking is the signature voice — editorial weight, magazine-tight rhythm. Weight 500 is reserved for nav links and select emphasis.

### System Sans-Serif — Secondary UI text, system fallbacks, form labels. Used sparingly — Suisse Intl is the workhorse. System stack appears for form fields and accessibility fallbacks where neutral rendering matters. · `--font-system-sans-serif`
- **Substitute:** system-ui, -apple-system, Segoe UI, Roboto, sans-serif
- **Weights:** 400
- **Sizes:** 
- **Line height:** 1.50
- **Role:** Secondary UI text, system fallbacks, form labels. Used sparingly — Suisse Intl is the workhorse. System stack appears for form fields and accessibility fallbacks where neutral rendering matters.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 16px | 1.5 | 0.06px | `--text-caption` |
| subheading | 20px | 1.4 | -0.28px | `--text-subheading` |
| heading-sm | 32px | 1.15 | -0.42px | `--text-heading-sm` |
| heading | 42px | 1.15 | -0.59px | `--text-heading` |
| display | 55px | 1.1 | -0.82px | `--text-display` |

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
| 128 | 128px | `--spacing-128` |
| 192 | 192px | `--spacing-192` |
| 232 | 232px | `--spacing-232` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 4px |
| cards | 8px |
| pills | 9999px |
| images | 8px |
| inputs | 8px |
| buttons | 8px |

### Layout

- **Page max-width:** 1440px
- **Section gap:** 80-192px
- **Card padding:** 16-24px
- **Element gap:** 8-16px

## Components

### Announcement Bar
**Role:** Sticky bottom notification strip — the system's sole chromatic element

Fixed to viewport bottom, full-width. Background #fdf313 Electric Yellow, text #1a1a1a in Suisse Intl 16px/1.5. Single line of text with optional arrow/link. Height approximately 40-48px, padding 12px 24px. This bar is the brand's signature: one flash of color in an otherwise monochrome system.

### Top Navigation
**Role:** Minimal horizontal nav bar with logo left, links right

Transparent or white background, no border. Logo 'A/' at left in True Black, Suisse Intl bold (custom logotype, not a font glyph). Right-aligned links in Suisse Intl 16px weight 500, color #1a1a1a. Nav height approximately 64-84px, horizontal padding 24-48px. No background fill — the nav sits directly on the white canvas.

### Editorial Headline
**Role:** Large display text that carries the brand voice

Suisse Intl 55px / 42px at line-height 1.10-1.15, weight 400, color #1a1a1a, letter-spacing -0.015em. Left-aligned, max-width approximately 900px. No underline, no decorative elements — the typography IS the design. Often appears in two-to-three line stacks with natural sentence breaks.

### Ghost Text Link
**Role:** Standard inline link and nav link treatment

No background, no border. Text in Suisse Intl 16px weight 500, color #1a1a1a. Hover state: color shifts to #949494 Muted or underline appears. This is the dominant interactive element — the system avoids filled buttons in favor of typographic links.

### Outlined Button
**Role:** Secondary action with hairline border

Background transparent, border 1px solid #1a1a1a, radius 8px. Text in Suisse Intl 16px weight 500, color #1a1a1a. Padding 16px top/bottom, 24px left/right. Hover: inverts to #1a1a1a background with #ffffff text.

### Solid Neutral Button
**Role:** Primary action button using Fog surface

Background #f2f2f2, border none, radius 8px. Text in Suisse Intl 16px weight 500, color #1a1a1a. Padding 16px 24px. The system avoids heavy chromatic buttons — primary actions are quiet, almost ghosted.

### Fog Card
**Role:** Quiet elevated content block

Background #f2f2f2, border none, radius 8px. Padding 16-24px. No shadow — the system uses surface color shifts instead of elevation. Contains text, links, or media at a lower visual weight than the canvas.

### Cream Feature Card
**Role:** Editorial accent card with warm tone

Background #f2ede9 Cream Stone, border none, radius 8px. Padding 24px. Used sparingly for featured content blocks — the warm tone is the only chromatic neutral and signals editorial importance. No shadow.

### Text Input
**Role:** Minimal form field

Background #ffffff, border 1px solid #e6e6e6 Hairline, radius 8px. Padding 12px 16px. Text in Suisse Intl 16px weight 400, color #1a1a1a. Placeholder color #949494. Focus state: border darkens to #1a1a1a. No floating labels, no decorative icons.

### Full-Bleed Video Block
**Role:** Cinematic content section breaking the typographic grid

Edge-to-edge media, no border, no radius — bleeds to viewport edges. Aspect ratio 16:9 or wider. No overlay text, no captions inside the frame. Functions as a visual exhale between typographic sections. Content is documentary/cinematic photography or video, not stock imagery.

### Pill Element
**Role:** Occasional rounded tag or status indicator

Radius 9999px (full pill). Background #f2f2f2 or transparent, text Suisse Intl 16px weight 500. Rarely used — the system prefers square 8px corners. Pills appear only for status indicators or tag-like metadata.

### Footer
**Role:** Minimal closing block with links and meta

White or #f2f2f2 background, no heavy decoration. Links in Suisse Intl 16px weight 500, color #1a1a1a. Generous padding (128px+ top/bottom) to create visual closure. Same nav links may repeat; copyright text in #949494 Muted.

## Do's and Don'ts

### Do
- Use Suisse Intl at 55px/1.10 with -0.015em tracking for editorial headlines — the tight rhythm is the signature
- Maintain the monochrome palette across all pages; #fdf313 Electric Yellow is the only chromatic color and must appear as a singular accent, not decoration
- Use 8px radius as the default for cards, buttons, and inputs — it's the system's geometric constant
- Use #e6e6e6 Hairline for all borders and dividers; never use heavier borders or decorative strokes
- Let the layout breathe with section gaps of 80px-192px; whitespace is a design element, not empty space
- Use ghost text links and outlined buttons for most interactions; reserve filled buttons for primary actions only
- Left-align editorial headlines and body copy; the system reads as a publication, not a centered marketing page

### Don't
- Never add chromatic colors beyond #fdf313 Electric Yellow; the system is intentionally 0% colorful outside the accent bar
- Never use shadows, glows, or blur effects for elevation; use surface color shifts (#ffffff → #f2f2f2) instead
- Never use system-ui as the primary typeface; Suisse Intl is the workhorse and defines the brand voice
- Never center-align body text or headlines; left-alignment is non-negotiable
- Never use border-radius values other than 4px (nav), 8px (default), or 9999px (pills); the system avoids 12px, 16px, or custom radii on interactive elements
- Never fill pages with imagery; full-bleed content blocks are cinematic punctuation, not wallpaper
- Never use letter-spacing values looser than normal on body text; Suisse Intl wants tight tracking at all sizes, with 0.004em as the loosest allowed

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Canvas | `#ffffff` | Primary page background |
| 2 | Fog Surface | `#f2f2f2` | Secondary card backgrounds, quiet elevated panels |
| 3 | Cream Surface | `#f2ede9` | Warm editorial card — the only chromatic neutral surface |
| 4 | Yellow Accent | `#fdf313` | Announcement bar, the system's sole chromatic surface |
| 5 | Graphite | `#1a1a1a` | Dark inverse surface (not used as a page background — reserved for dark text only) |

## Imagery

Full-bleed cinematic photography and video dominate the visual storytelling — documentary-style stills, wide environmental shots, and high-production film content that bleeds to viewport edges. The hero uses a full-bleed film or photograph with no overlay text, no rounded corners, no decorative framing. Imagery serves as visual exhalation between typographic sections: the page alternates between dense editorial text and immersive moving-image moments. The photography style is cinematic, naturalistic, and human-centered — not product shots, not stock imagery, not illustrations. No iconography beyond minimal text-based marks.

## Layout

Full-bleed edge-to-edge sections with no max-width container on media blocks. The typographic sections use an implicit left-aligned grid with max-width around 900px for text blocks. The hero pattern is a large left-aligned editorial headline (3 lines) followed by generous whitespace, then a full-bleed video/photography block. Section rhythm alternates: quiet white space → typographic headline → full-bleed media → whitespace. The navigation is a minimal top bar with logo left and 5-6 text links right — no background, no border, no hamburger. The announcement bar is fixed to the viewport bottom. Content density is low; the page favors breathing room and single-column reading over multi-column grids or card matrices.

## Agent Prompt Guide

**Quick Color Reference**
- Text: #1a1a1a
- Background: #ffffff
- Surface (secondary): #f2f2f2
- Border/hairline: #e6e6e6
- Accent: #fdf313
- Muted text: #949494
- primary action: no distinct CTA color

**Example Component Prompts**
1. Editorial hero headline: Suisse Intl 55px, weight 400, line-height 1.10, color #1a1a1a, letter-spacing -0.015em. Left-aligned, max-width 900px, sitting on #ffffff canvas with 192px top padding.

2. Ghost text link in body: No background, no border. Suisse Intl 16px weight 500, color #1a1a1a. On hover, color shifts to #949494. Inline with body text, 16px line-height 1.5.

3. Fog surface card: Background #f2f2f2, border none, border-radius 8px. Padding 24px. Contains a Suisse Intl 20px subheading (weight 500, #1a1a1a, letter-spacing -0.014em) and 16px body text below. No shadow.

4. Outlined action button: Background transparent, border 1px solid #1a1a1a, border-radius 8px. Text Suisse Intl 16px weight 500, color #1a1a1a. Padding 16px vertical, 24px horizontal. Hover state inverts to #1a1a1a background with #ffffff text.

5. Sticky announcement bar: Fixed to viewport bottom, full width. Background #fdf313, padding 12px 24px. Single line of text in Suisse Intl 16px weight 500, color #1a1a1a, with a trailing arrow link.

## Typographic Identity

The 'A/' logotype is set in a custom geometric sans (bolder than Suisse Intl's display cuts) with a forward-slash terminal. It functions as both logo and punctuation. The system treats type as the primary visual asset: there are no decorative icons, no graphic flourishes, no color washes — the typographic system carries 90% of the visual identity. Suisse Intl's slightly humanist proportions and tight tracking give the page a confident, editorial feel that distinguishes it from generic system-font SaaS sites.

## Elevation Philosophy

The system uses zero shadows. Elevation is communicated entirely through surface color shifts: #ffffff (base) → #f2f2f2 (card) → #f2ede9 (warm accent). The absence of shadows is deliberate — it keeps the page flat, editorial, and print-like. No element should have a box-shadow, drop-shadow, or blur. Depth comes from the warm cream surface (#f2ede9) acting as a subtle warm island against the cool gray (#f2f2f2) and white (#ffffff) system.

## Similar Brands

- **Pentagram** — Same agency-as-publisher ethos: monochromatic canvas, oversized editorial headlines, typographic confidence, and full-bleed project imagery breaking the grid
- **Instrument** — Shares the restrained monochrome aesthetic with one strong accent color used sparingly, plus oversized left-aligned headlines and full-bleed visual storytelling
- **Locomotive** — Editorial agency layout language — generous whitespace, large confident type, content blocks that alternate between typographic and full-bleed media
- **Resn** — Experimental creative agency aesthetic with typographic identity, monochrome restraint, and willingness to let one bold element (here, the yellow bar) carry all the color
- **Manual** — Design agency portfolio that treats typography as hero, uses flat surfaces without shadows, and relies on full-bleed visual content to punctuate typographic sections

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-pure-white: #ffffff;
  --color-graphite: #1a1a1a;
  --color-true-black: #000000;
  --color-hairline: #e6e6e6;
  --color-fog: #f2f2f2;
  --color-cream-stone: #f2ede9;
  --color-muted: #949494;
  --color-dim: #757575;
  --color-disabled: #cccccc;
  --color-electric-yellow: #fdf313;

  /* Typography — Font Families */
  --font-ui-sans-serif: 'ui-sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-suisse-intl: 'Suisse Intl', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-system-sans-serif: 'System Sans-Serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 16px;
  --leading-caption: 1.5;
  --tracking-caption: 0.06px;
  --text-subheading: 20px;
  --leading-subheading: 1.4;
  --tracking-subheading: -0.28px;
  --text-heading-sm: 32px;
  --leading-heading-sm: 1.15;
  --tracking-heading-sm: -0.42px;
  --text-heading: 42px;
  --leading-heading: 1.15;
  --tracking-heading: -0.59px;
  --text-display: 55px;
  --leading-display: 1.1;
  --tracking-display: -0.82px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;

  /* Spacing */
  --spacing-unit: 8px;
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-128: 128px;
  --spacing-192: 192px;
  --spacing-232: 232px;

  /* Layout */
  --page-max-width: 1440px;
  --section-gap: 80-192px;
  --card-padding: 16-24px;
  --element-gap: 8-16px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-2xl: 16px;
  --radius-full: 9999px;

  /* Named Radii */
  --radius-nav: 4px;
  --radius-cards: 8px;
  --radius-pills: 9999px;
  --radius-images: 8px;
  --radius-inputs: 8px;
  --radius-buttons: 8px;

  /* Surfaces */
  --surface-canvas: #ffffff;
  --surface-fog-surface: #f2f2f2;
  --surface-cream-surface: #f2ede9;
  --surface-yellow-accent: #fdf313;
  --surface-graphite: #1a1a1a;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-pure-white: #ffffff;
  --color-graphite: #1a1a1a;
  --color-true-black: #000000;
  --color-hairline: #e6e6e6;
  --color-fog: #f2f2f2;
  --color-cream-stone: #f2ede9;
  --color-muted: #949494;
  --color-dim: #757575;
  --color-disabled: #cccccc;
  --color-electric-yellow: #fdf313;

  /* Typography */
  --font-ui-sans-serif: 'ui-sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-suisse-intl: 'Suisse Intl', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-system-sans-serif: 'System Sans-Serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 16px;
  --leading-caption: 1.5;
  --tracking-caption: 0.06px;
  --text-subheading: 20px;
  --leading-subheading: 1.4;
  --tracking-subheading: -0.28px;
  --text-heading-sm: 32px;
  --leading-heading-sm: 1.15;
  --tracking-heading-sm: -0.42px;
  --text-heading: 42px;
  --leading-heading: 1.15;
  --tracking-heading: -0.59px;
  --text-display: 55px;
  --leading-display: 1.1;
  --tracking-display: -0.82px;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-128: 128px;
  --spacing-192: 192px;
  --spacing-232: 232px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-2xl: 16px;
  --radius-full: 9999px;
}
```
