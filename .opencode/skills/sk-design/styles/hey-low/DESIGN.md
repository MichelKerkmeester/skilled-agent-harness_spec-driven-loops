# Hey Low — Style Reference
> botanical field journal on cream paper — Measured, organic, and mostly silent, with one lime-green note singing on the page.

**Theme:** light

Hey Low is an ecological field journal rendered as a website: white paper, forest-ink typography, and a single sprig of chartreuse that makes actions feel alive. The composition is generous and unhurried — most of the canvas stays quiet and near-white, with dark evergreen as the structural color and pale lime appearing only where a system needs to pulse. Headlines are set in a tight, geometric sans with aggressive negative tracking at large sizes, then punctuated by a hand-set italic serif accent that injects warmth into otherwise clinical copy. Cards, buttons, and project tiles are flat and low-elevation; visual weight comes from type contrast and illustration, not shadows or gradients. Everything should feel like a studio that designs for the planet — restrained, botanical, and deliberately spare.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Forest Ink | `#003329` | `--color-forest-ink` | Headlines, body copy, navigation text, illustration strokes, link color — the structural color that carries every page |
| Chartreuse Sprig | `#e6ffa3` | `--color-chartreuse-sprig` | Primary CTA button fill, feature card surfaces, highlight washes — the single accent that makes interactive elements feel switched on |
| Deep Moss | `#042725` | `--color-deep-moss` | Secondary action button, hover or pressed states where a darker counterweight to the lime CTA is needed |
| Vivid Lime | `#9bff48` | `--color-vivid-lime` | Decorative high-energy accent inside illustrations, hover halos, or emphasis marks — louder sibling of Chartreuse Sprig |
| Mist Paper | `#e5e7eb` | `--color-mist-paper` | Page canvas, hairline borders across cards/links/images, subtle section backgrounds — the surface that the design breathes on |
| White Sheet | `#ffffff` | `--color-white-sheet` | Card surfaces, elevated tiles, button backgrounds, inverse text on dark fills |
| Graphite | `#000000` | `--color-graphite` | Occasional true-black fills for SVG details and one dark button variant |
| Sage Dust | `#52756e` | `--color-sage-dust` | Muted helper text, secondary descriptions, caption-level copy where full Forest Ink would compete with the headline |
| Pine Shadow | `#33544c` | `--color-pine-shadow` | Tertiary text, subdued labels, low-priority annotations |

## Tokens — Typography

### UntitledSans — Primary interface typeface — UI controls, body, navigation, and display headings. The aggressively negative tracking at large sizes (up to -0.064em) tightens the letterforms into a near-poster density that makes even short headlines feel like brand statements. A 600 weight is reserved for emphasis and CTA labels. · `--font-untitledsans`
- **Substitute:** Inter (closest open match — same geometric grotesque with broad weight range)
- **Weights:** 400, 600
- **Sizes:** 9, 10, 11, 12, 14, 16, 17, 24, 30, 36, 43, 52, 62
- **Line height:** 0.80, 0.90, 1.00, 1.10, 1.13, 1.14, 1.20, 1.40, 1.50, 1.53, 1.60, 1.61
- **Letter spacing:** -3.97px at 62px, -3.07px at 52px, -2.19px at 43px, -1.40px at 36px, -0.93px at 30px, -0.60px at 24px, -0.34px at 17px, -0.26px at 16px, +0.35px at 14px, +0.67px at 12px
- **Role:** Primary interface typeface — UI controls, body, navigation, and display headings. The aggressively negative tracking at large sizes (up to -0.064em) tightens the letterforms into a near-poster density that makes even short headlines feel like brand statements. A 600 weight is reserved for emphasis and CTA labels.

### BoogyBrutPoster — Decorative italic-display accent used for the hand-lettered-feel phrases that ride alongside the geometric headline ('for You & the Planet', 'Fast by nature', '& love'). The contrast between this organic, almost-calligraphic display and UntitledSans's clinical geometry is the site's signature typographic move. · `--font-boogybrutposter`
- **Substitute:** Recoleta Italic or DM Serif Display Italic
- **Weights:** 400
- **Sizes:** 52, 62, 68
- **Line height:** 0.82, 0.83
- **Role:** Decorative italic-display accent used for the hand-lettered-feel phrases that ride alongside the geometric headline ('for You & the Planet', 'Fast by nature', '& love'). The contrast between this organic, almost-calligraphic display and UntitledSans's clinical geometry is the site's signature typographic move.

### sans-serif — sans-serif — detected in extracted data but not described by AI · `--font-sans-serif`
- **Weights:** 400
- **Sizes:** 20px
- **Line height:** 1.5
- **Role:** sans-serif — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.2 | 0.67px | `--text-caption` |
| body-sm | 14px | 1.5 | 0.35px | `--text-body-sm` |
| body-lg | 17px | 1.5 | -0.34px | `--text-body-lg` |
| subheading | 24px | 1.13 | -0.6px | `--text-subheading` |
| heading-sm | 36px | 1 | -1.4px | `--text-heading-sm` |
| heading | 43px | 0.9 | -2.19px | `--text-heading` |
| heading-lg | 52px | 0.83 | -3.07px | `--text-heading-lg` |
| display | 62px | 0.8 | -3.97px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 8 | 8px | `--spacing-8` |
| 12 | 12px | `--spacing-12` |
| 24 | 24px | `--spacing-24` |
| 28 | 28px | `--spacing-28` |
| 32 | 32px | `--spacing-32` |
| 56 | 56px | `--spacing-56` |
| 64 | 64px | `--spacing-64` |
| 128 | 128px | `--spacing-128` |
| 160 | 160px | `--spacing-160` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 8px |
| badges | 9999px |
| buttons | 8px |
| decorative | 13.89px |
| projectImages | 8px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 56-80px
- **Card padding:** 28px
- **Element gap:** 7-14px

## Components

### Top Navigation Bar
**Role:** Site-wide header with brand mark, nav links, and contact CTA

White Sheet (#ffffff) background, full-bleed, 28px vertical padding. Logo 'hey low' set left in Forest Ink at 17px weight 600, tracking -0.34px. Center/right cluster holds text nav (Work, About, Blog) in Forest Ink 14px weight 400 with 21px horizontal gaps, followed by a 'Contact' pill button (White Sheet fill, Mist Paper 1px border, 8px radius, 12px 21px padding, Forest Ink text 14px). No shadow, no sticky elevation.

### Primary CTA Button — Chartreuse Fill
**Role:** Filled action button for the single most important next step on a section

Background #e6ffa3, text Forest Ink (#003329), UntitledSans 14px weight 600, tracking 0.35px. Padding 12px 21px, radius 8px. No border, no shadow. Reads as a friendly confident accent against the white canvas.

### Secondary Ghost Button
**Role:** Quiet alternative action beneath or beside the primary CTA

Transparent background, Forest Ink text 14px, leading arrow glyph in same color, no border, no background. Underline-free, 7px vertical padding. Used for 'Our work', 'Learn More' type links.

### Section Eyebrow Label
**Role:** Tiny pre-headline marker that introduces each major section

Forest Ink 12px weight 400, tracking 0.67px, prefixed by a small filled dot. Examples: '• The websites we design & build', '• Explore our work'. Sits 7-14px above the headline.

### Hero Headline with Italic Accent
**Role:** Primary page-level statement mixing geometric and calligraphic voices

First line in UntitledSans 62px weight 600, tracking -3.97px, line-height 0.80, Forest Ink. Second line in BoogyBrutPoster italic 62px, tracking normal, line-height 0.83, Forest Ink. The pairing of tight grotesque with flowing italic poster face is the page's signature typographic gesture.

### Feature Card (Chartreuse)
**Role:** Tiled value proposition card used in the 3-column grid for sustainability/fast/beautiful claims

Background #e6ffa3, padding 28px on all sides, radius 8px. Title in UntitledSans 24px weight 600 tracking -0.6px, Forest Ink. Body in Forest Ink 14px weight 400. Small Forest Ink icon (18-20px) positioned in the top-right corner. No shadow, no border. Cards tile in a 3-column grid with 7-14px gaps.

### Project Showcase Card
**Role:** Featured work tile with image, metadata, and performance metrics

White Sheet background, 8px radius, no border, no shadow. Top holds a large preview image (rounded 8px) filling the card width. Below image: project name in UntitledSans 17px weight 600 Forest Ink, then 1-2 line description in 14px Sage Dust (#52756e). Bottom-right cluster holds a circular Carbon Rating badge (lime fill, Forest Ink letter grade) and a Speed Index label in Sage Dust 12px. A 'See our case study' Forest Ink 14px link closes the card. 28px internal padding, 24px gap between image and text block.

### Carbon Rating Badge
**Role:** Pill badge showing the carbon performance grade of a shipped project

Circular or pill shape, Chartreuse Sprig (#e6ffa3) fill, Forest Ink 12px weight 600 letter, 9999px radius. Sits inline with the Speed Index metric in the project card metadata row.

### Client Logo Strip
**Role:** Horizontal band of partner/client wordmarks near the top of the page

Mist Paper (#e5e7eb) background, full-bleed band, 28-32px vertical padding. Logos rendered in a single row, evenly distributed, each treated as a flat Forest Ink or grayscale mark at roughly 24-30px height. No labels, no dividers between logos — the whitespace is the separator.

### Hero Botanical Illustration
**Role:** Hand-drawn nature composition anchoring the hero composition

A semicircular arrangement of butterflies, leaves, moths, and seed pods in Forest Ink (#003329) on White Sheet. Linework is organic, hand-inked, with occasional Vivid Lime (#9bff48) accents on individual wing or leaf details. Lives to the left of the hero text block, floats without a container, ~480px diameter.

### Decorative Organic Shape
**Role:** Large-radius curved form used as background interest in featured project tiles

Some project card image areas use extreme border-radius values (110px, 600px) to create lens-like or pebble-like crops around screenshots. These asymmetric radii are intentional — they break the grid and signal 'this is a portfolio piece, not a product UI'.

## Do's and Don'ts

### Do
- Set primary headlines in UntitledSans 600 at 43-62px with tracking between -2.19 and -3.97px so the letterforms read as a tight block, not loose type.
- Pair every geometric headline with one italic BoogyBrutPoster accent line at matching size — this contrast is the site's typographic signature.
- Use Chartreuse Sprig (#e6ffa3) as the filled CTA background with Forest Ink text; never reverse it (dark fill with lime text reads as off-brand urgency).
- Keep cards, buttons, and tiles at 8px radius — do not round to 12px or 16px, the slight crispness is what keeps the design feeling like a field guide rather than a SaaS dashboard.
- Lay major sections out at 56-80px vertical gaps and let white space do the structural work; avoid dividers, lines, or colored bands between sections.
- Use the Vivid Lime (#9bff48) only as illustration fill or hover halo, never as a UI surface — it is too loud for interface chrome.
- Anchor every section with the 12px Forest Ink eyebrow label prefixed by a dot; this is the consistent navigation rhythm across the page.

### Don't
- Do not apply box-shadows to cards or buttons — the design is intentionally flat, and any elevation will fight the botanical paper aesthetic.
- Do not introduce gradients anywhere; the palette is deliberately flat and the only 'color movement' should come from the hand-drawn illustration.
- Do not use Sage Dust (#52756e) or Pine Shadow (#33544c) for headlines or navigation — those are muted body-text colors only and will look washed out at large sizes.
- Do not place more than one Chartreuse Sprig CTA per visible section; the accent loses its function if it repeats.
- Do not round the hero illustration container with a standard radius — the organic shapes should float free, not be clipped into a circle or rounded square.
- Do not use a sans-serif for the italic accent phrases; the BoogyBrutPoster/serif italic is the contrast that makes the geometric headlines feel intentional.
- Do not center body paragraphs wider than 480px — the long-line lockup is a magazine reading rhythm, not a web content width.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Mist Paper | `#e5e7eb` | Page-level canvas and section separators |
| 1 | White Sheet | `#ffffff` | Default card and elevated component background |
| 2 | Chartreuse Sprig | `#e6ffa3` | Highlighted feature cards and CTA surfaces |

## Elevation

The design is intentionally shadowless. Visual hierarchy is built through type scale, whitespace, and the single chartreuse accent — not through elevation. Components sit on the page like pressed leaves on paper; any drop shadow would break that flatness and reintroduce the SaaS product feel the brand is explicitly avoiding.

## Imagery

The visual language blends two registers: hand-inked botanical illustration and clean product photography. The hero and decorative moments are dominated by line-drawn butterflies, moths, leaves, and seed pods rendered in Forest Ink with occasional Vivid Lime accents — loose, organic, slightly imperfect linework that signals craft over polish. Project showcase cards switch to tight product photography (screenshots of shipped websites) cropped inside the card frame, sometimes with extreme asymmetric border-radii (110-600px) that turn screenshots into pebble-shaped or lens-shaped vignettes. Icons throughout the UI are tiny, single-weight line marks in Forest Ink, 18-20px, used as card top-right markers. The overall density is low — imagery is reserved and editorial, never busy, and the page reads as text-and-illustration first, photography second.

## Layout

The page is centered and max-width-contained at roughly 1200px, with full-bleed bands for the client logo strip. The hero uses an asymmetric split: a semicircular botanical illustration anchored left, headline-and-CTA block floating right with generous left margin — not a 50/50 split, closer to 45/55. Below the hero, the client logo strip runs full-bleed as a Mist Paper band. The value-props section centers a single headline stack, then drops into a 3-column equal-width card grid with 7-14px gaps. The work showcase shifts to a 2-column grid of large project cards, each card significantly taller than the feature cards, creating a clear rhythm change between the two sections. Section-to-section flow uses 56-80px vertical breathing room with no dividers — the whitespace is the only separator. Navigation is a single thin top bar, not sticky, not shadowed.

## Agent Prompt Guide

Quick Color Reference:
- text: #003329
- background: #ffffff
- canvas: #e5e7eb
- border: #e5e7eb
- accent: #e6ffa3
- primary action: #e6ffa3 (filled action)

Example Component Prompts:

1. Create a hero section: White Sheet (#ffffff) background. Headline 'Websites designed' in UntitledSans 62px weight 600, #003329, letter-spacing -3.97px, line-height 0.80. Below it, italic accent line in BoogyBrutPoster 62px, #003329, normal tracking, line-height 0.83. Subtext paragraph in UntitledSans 17px weight 400, #52756e, 1.5 line-height, max-width 420px. Primary CTA button: #e6ffa3 fill, #003329 text 14px weight 600, 8px radius, 12px 21px padding. Secondary action below as ghost text link with leading arrow in #003329 14px.

2. Create a feature card: #e6ffa3 background, 8px radius, 28px padding on all sides. Title in UntitledSans 24px weight 600, #003329, letter-spacing -0.6px. Body in UntitledSans 14px weight 400, #003329, line-height 1.5. Small 20px line icon in #003329 positioned top-right corner. No border, no shadow.

3. Create a project showcase card: #ffffff background, 8px radius, no border, no shadow. Top holds a large preview image filling card width with 8px radius. Below image (24px gap): project name in UntitledSans 17px weight 600, #003329, letter-spacing -0.34px. Description in UntitledSans 14px weight 400, #52756e, line-height 1.5. Bottom-right metadata row: circular Carbon Rating badge (#e6ffa3 fill, #003329 12px weight 600 letter, 9999px radius) beside a 'Speed Index' label in UntitledSans 12px, #52756e. Closing 'See our case study' link in UntitledSans 14px, #003329. 28px card padding.

4. Create a section eyebrow + headline block: Centered, 14px gap between eyebrow and headline. Eyebrow in UntitledSans 12px weight 400, #003329, letter-spacing 0.67px, prefixed by a small filled dot. Headline in UntitledSans 43px weight 600, #003329, letter-spacing -2.19px, line-height 0.90, followed by an italic accent in BoogyBrutPoster 43px, #003329.

5. Create the navigation bar: Full-width, #ffffff background, 28px vertical padding. Left: logo 'hey low' in UntitledSans 17px weight 600, #003329, letter-spacing -0.34px. Right cluster with 21px horizontal gap between items: 'Work', 'About', 'Blog' in UntitledSans 14px weight 400, #003329, followed by a 'Contact' pill button — #ffffff fill, #e5e7eb 1px border, 8px radius, 12px 21px padding, #003329 text 14px.

## Botanical Illustration System

Hand-drawn linework is a first-class component, not decoration. Style rules: single-weight 1.5-2px strokes, organic curves with visible hand wobble, Forest Ink (#003329) as the default fill with white negative space, Vivid Lime (#9bff48) used sparingly on one or two wing/leaf details per composition. Motif library: butterflies (symmetric wings, antennae), moths (feathered antennae, heavier bodies), leaves (asymmetric, 3-7 lobes), seed pods (oval, vein lines), fern fronds. Compositions should feel arranged, not scattered — typically grouped in semicircular or arc formations to read as a cohesive bouquet rather than floating elements. Never use solid fills, never use gradients, never use multiple stroke weights within one illustration.

## Similar Brands

- **Cargo (cargocollective.com)** — Same field-guide typographic approach — a tight geometric sans paired with an italic serif display accent, and a near-monochrome canvas with one bright color used as functional punctuation
- **Apt Studio** — Independent creative agencies that use flat 8px-radius cards on white with a single botanical or organic illustration as the hero anchor
- **Pentagram** — Editorial-style studio sites that rely on aggressive type tracking and asymmetric hero compositions rather than decorative chrome
- **Resn** — Playful agency sites that mix hand-inked nature motifs with crisp UI components and a single lime/green accent

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-forest-ink: #003329;
  --color-chartreuse-sprig: #e6ffa3;
  --color-deep-moss: #042725;
  --color-vivid-lime: #9bff48;
  --color-mist-paper: #e5e7eb;
  --color-white-sheet: #ffffff;
  --color-graphite: #000000;
  --color-sage-dust: #52756e;
  --color-pine-shadow: #33544c;

  /* Typography — Font Families */
  --font-untitledsans: 'UntitledSans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-boogybrutposter: 'BoogyBrutPoster', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-sans-serif: 'sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.2;
  --tracking-caption: 0.67px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --tracking-body-sm: 0.35px;
  --text-body-lg: 17px;
  --leading-body-lg: 1.5;
  --tracking-body-lg: -0.34px;
  --text-subheading: 24px;
  --leading-subheading: 1.13;
  --tracking-subheading: -0.6px;
  --text-heading-sm: 36px;
  --leading-heading-sm: 1;
  --tracking-heading-sm: -1.4px;
  --text-heading: 43px;
  --leading-heading: 0.9;
  --tracking-heading: -2.19px;
  --text-heading-lg: 52px;
  --leading-heading-lg: 0.83;
  --tracking-heading-lg: -3.07px;
  --text-display: 62px;
  --leading-display: 0.8;
  --tracking-display: -3.97px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-semibold: 600;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-56: 56px;
  --spacing-64: 64px;
  --spacing-128: 128px;
  --spacing-160: 160px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 56-80px;
  --card-padding: 28px;
  --element-gap: 7-14px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 13.8896px;
  --radius-full: 110px;
  --radius-full-2: 600px;
  --radius-full-3: 9000px;
  --radius-full-4: 999999px;

  /* Named Radii */
  --radius-cards: 8px;
  --radius-badges: 9999px;
  --radius-buttons: 8px;
  --radius-decorative: 13.89px;
  --radius-projectimages: 8px;

  /* Surfaces */
  --surface-mist-paper: #e5e7eb;
  --surface-white-sheet: #ffffff;
  --surface-chartreuse-sprig: #e6ffa3;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-forest-ink: #003329;
  --color-chartreuse-sprig: #e6ffa3;
  --color-deep-moss: #042725;
  --color-vivid-lime: #9bff48;
  --color-mist-paper: #e5e7eb;
  --color-white-sheet: #ffffff;
  --color-graphite: #000000;
  --color-sage-dust: #52756e;
  --color-pine-shadow: #33544c;

  /* Typography */
  --font-untitledsans: 'UntitledSans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-boogybrutposter: 'BoogyBrutPoster', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-sans-serif: 'sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.2;
  --tracking-caption: 0.67px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --tracking-body-sm: 0.35px;
  --text-body-lg: 17px;
  --leading-body-lg: 1.5;
  --tracking-body-lg: -0.34px;
  --text-subheading: 24px;
  --leading-subheading: 1.13;
  --tracking-subheading: -0.6px;
  --text-heading-sm: 36px;
  --leading-heading-sm: 1;
  --tracking-heading-sm: -1.4px;
  --text-heading: 43px;
  --leading-heading: 0.9;
  --tracking-heading: -2.19px;
  --text-heading-lg: 52px;
  --leading-heading-lg: 0.83;
  --tracking-heading-lg: -3.07px;
  --text-display: 62px;
  --leading-display: 0.8;
  --tracking-display: -3.97px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-56: 56px;
  --spacing-64: 64px;
  --spacing-128: 128px;
  --spacing-160: 160px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 13.8896px;
  --radius-full: 110px;
  --radius-full-2: 600px;
  --radius-full-3: 9000px;
  --radius-full-4: 999999px;
}
```
