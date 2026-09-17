# Aker — Style Reference
> darkroom gallery wall
Monumental type floats over muted landscape photography like exhibit labels in a high-end architectural gallery — white walls, warm terracotta spotlights, everything else recedes.

**Theme:** light

Aker speaks in the visual vocabulary of a premium real-estate developer: dramatic full-bleed photography anchoring each section, a single warm terracotta accent cutting through near-monochrome layouts, and typography that oscillates between whisper-light and monumental. The interface trusts white space and dark imagery to do the heavy lifting — chrome is minimal, borders are hairlines, and interactive elements are reduced to text-and-arrow pairs or subtly filled dark pills. The single most distinctive choice is the contrast between the 168px Proxima Nova at weight 300 for the brand mark and the 15–18px body copy at the same family — the same typeface carries both the shouting and the whispering, which makes the voice feel unified rather than hybrid.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Ink | `#000000` | `--color-ink` | Primary text, hairline borders, icon strokes, link text on light surfaces |
| Paper | `#ffffff` | `--color-paper` | Page canvas, card surfaces, text on dark photography and dark surfaces |
| Char | `#1c1c1c` | `--color-char` | Dark surface panels, navigation pill background, elevated dark cards |
| Midnight | `#070707` | `--color-midnight` | Deepest surface for dark feature cards and modal backgrounds |
| Iron | `#262626` | `--color-iron` | Mid-dark panel surface, secondary dark backgrounds behind photography |
| Slate | `#38464a` | `--color-slate` | Cool-tinted dark surface, used for subtle contrast against warmer darks |
| Mist | `#e5e4e4` | `--color-mist` | Light card surfaces, hairline borders on white, image overlay tints |
| Smoke | `#8d8d8d` | `--color-smoke` | Muted helper text, secondary borders, inactive metadata |
| Pewter | `#666666` | `--color-pewter` | Secondary body text, body-emphasis borders |
| Ember | `#b75928` | `--color-ember` | Link text, brand accent, warm highlight on muted cards — single chromatic accent that warms an otherwise neutral system |
| Pine | `#193f32` | `--color-pine` | Dark green surface for feature cards and link backgrounds on light |
| Tide | `#002934` | `--color-tide` | Deep teal-dark surface for link and card backgrounds, complements Pine in the cool brand register |
| Driftwood | `#537179` | `--color-driftwood` | Decorative stroke and fill for illustrations and icon-line work, soft cool gray with depth |
| Cedar | `#776157` | `--color-cedar` | Warm brown card surface, earth-toned card variant |
| Coral | `#df6a6b` | `--color-coral` | Warm-pink card surface, used as an occasional warm-tinted card variant |
| Primary Action Fill | `#494949` | `--color-primary-action-fill` | Neutral button treatment for secondary actions and selected controls. Use as the primary filled action background |

## Tokens — Typography

### Proxima Nova — Primary typeface across all UI. Weight 300 carries the brand wordmark at 168px and large section headings (62–80px) — the whisper-weight at display sizes is anti-convention, creating authority through restraint instead of shouting with bold. Weight 400–500 handles body, labels, and UI. Weight 600 appears only for emphasis labels. Sizes range from 8px micro-labels to 168px display, a 21:1 ratio that produces a museum-label-to-billboard scale. · `--font-proxima-nova`
- **Substitute:** Montserrat or Nunito Sans
- **Weights:** 300, 400, 500, 600
- **Sizes:** 8, 12, 13, 14, 15, 16, 18, 20, 22, 30, 36, 62, 80, 168
- **Line height:** 0.80–1.50
- **Letter spacing:** -0.0250em at display (168px, 80px, 62px), -0.0200em at mid headings (36–22px), 0.0100em at body and small text
- **Role:** Primary typeface across all UI. Weight 300 carries the brand wordmark at 168px and large section headings (62–80px) — the whisper-weight at display sizes is anti-convention, creating authority through restraint instead of shouting with bold. Weight 400–500 handles body, labels, and UI. Weight 600 appears only for emphasis labels. Sizes range from 8px micro-labels to 168px display, a 21:1 ratio that produces a museum-label-to-billboard scale.

### Lora — Serif accent for body passages and editorial copy. Used sparingly to break the all-sans rhythm — a single serif paragraph next to Proxima Nova body creates an editorial-press feel. Letter-spacing 0.0110em gives it slight breathing room. · `--font-lora`
- **Substitute:** Lora (Google Fonts)
- **Weights:** 400
- **Sizes:** 15, 18
- **Line height:** 1.35–1.50
- **Letter spacing:** 0.0110em
- **Role:** Serif accent for body passages and editorial copy. Used sparingly to break the all-sans rhythm — a single serif paragraph next to Proxima Nova body creates an editorial-press feel. Letter-spacing 0.0110em gives it slight breathing room.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| body | 15px | 1.5 | 0.15px | `--text-body` |
| subheading | 18px | 1.5 | 0.18px | `--text-subheading` |
| heading-sm | 22px | 1.25 | -0.44px | `--text-heading-sm` |
| heading | 36px | 1.2 | -0.72px | `--text-heading` |
| heading-lg | 62px | 1.1 | -1.55px | `--text-heading-lg` |
| display | 168px | 0.8 | -4.2px | `--text-display` |

## Tokens — Spacing & Shapes

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 5 | 5px | `--spacing-5` |
| 6 | 6px | `--spacing-6` |
| 8 | 8px | `--spacing-8` |
| 10 | 10px | `--spacing-10` |
| 12 | 12px | `--spacing-12` |
| 13 | 13px | `--spacing-13` |
| 14 | 14px | `--spacing-14` |
| 16 | 16px | `--spacing-16` |
| 19 | 19px | `--spacing-19` |
| 20 | 20px | `--spacing-20` |
| 22 | 22px | `--spacing-22` |
| 24 | 24px | `--spacing-24` |
| 32 | 32px | `--spacing-32` |
| 48 | 48px | `--spacing-48` |
| 64 | 64px | `--spacing-64` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 8px |
| small | 3.2px |
| badges | 1584px |
| images | 8px |
| buttons | 80px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 16px
- **Element gap:** 16px

## Components

### Brand Wordmark
**Role:** Primary brand identifier displayed at extreme scale

Proxima Nova weight 300 at 168px, line-height 0.80, letter-spacing -4.2px (-0.0250em). Color Paper (#ffffff) when overlaid on dark photography, Ink (#000000) on light sections. Functions as the page's hero anchor — its 21:1 size ratio against 15px body text is the single most signature-defining choice in the system.

### Navigation Pill
**Role:** Compact dark mode-switcher/trigger in the top-right corner

Char (#1c1c1c) background, fully rounded (1584px radius), ~13px padding vertical with brand label "AKER" + hamburger icon in Paper. Width fits content, height ~32px. Sits as a floating dark element against both light and dark hero photography.

### Navigation Card
**Role:** Menu items revealed from the navigation pill, presented as visual cards

Char (#1c1c1c) background, 8px radius, contains a 4:3 image on the left and a text block on the right. Title 15px Proxima Nova weight 400 Paper, description 12px weight 400 Mist (#e5e4e4), right-arrow icon 14px Paper. Two cards per row in the open nav state.

### Text-Arrow Button
**Role:** Primary action affordance — used for "Contact us", "Let's chat", "Our team"

Ghost style: no fill, no border. Label 13–15px Proxima Nova weight 400. Color varies — Paper on dark photography, Ink on light surfaces. Trailing right-arrow (→) at 16px. Contained in a 80px-radius pill outline for emphasized variants, or bare text for inline. Horizontal padding 19px vertical, 16px horizontal in the pill variant.

### Filled Dark Button
**Role:** Secondary emphasized action on light surfaces

Char (#1c1c1c) fill, 80px radius, Paper text 13px weight 500, 19px vertical padding, 16px horizontal padding. Used sparingly — most actions are ghost/text.

### Section Label
**Role:** Overline label preceding section headings (e.g. "Core business areas")

12px Proxima Nova weight 400, Smoke (#8d8d8d) or Pewter (#666666), letter-spacing 0.12px. Positioned above the heading with 6–8px gap. Sits left-aligned, not centered.

### Section Heading
**Role:** Primary heading for content sections

Proxima Nova weight 300 or 400, 36–62px, line-height 1.10–1.20, letter-spacing -0.0200em. Ink (#000000) on light sections, Paper on dark. Weight 300 at 62px for the largest section headings is the recurring signature.

### Two-Column Feature Card
**Role:** Large editorial cards for "Invest with Aker" / "We're open to collaborate"

Two equal-width cards in a 2-column grid. Left card: Mist (#e5e4e4) background, 8px radius, small overline label + large heading (Proxima Nova weight 300, 36–48px) + bottom-left text-arrow button + bottom-right decorative brand mark. Right card: full-bleed photo (landscape or cityscape), 8px radius, overline + heading in Paper overlaid on the image.

### Full-Bleed Hero Section
**Role:** Opening visual statement

100vw photography (landscape/cityscape/mountain), no border-radius, occupies full viewport height. Brand wordmark in Paper overlaid bottom-left, small intro paragraph (15px Proxima Nova, Paper, 6–8 line max) top-left, navigation pill top-right. Dark filter implied by subject matter rather than explicit overlay.

### Body Text Block
**Role:** Editorial paragraph copy in light sections

Proxima Nova weight 400, 15–18px, line-height 1.50, Ink (#000000). Max-width ~600px, left-aligned. For the brand statement, Lora 15–18px is used as the serif variant.

### Numbered List Item
**Role:** Numbered entries for "What we do" lists ("01 Invest")

Two-digit number (01, 02) in Smoke (#8d8d8d) at 12px Proxima Nova, label 18px Proxima Nova weight 400 Ink, positioned with 6px row gap, separated by a 1px Mist (#e5e4e4) hairline divider above each item.

### Pill Badge / Tag
**Role:** Category labels, overline tags

Fully rounded (1584px radius), 6–8px vertical padding, 14px horizontal padding. Mist (#e5e4e4) background with Ink text, or transparent with Paper text on dark. 12px Proxima Nova weight 500.

### Image Thumbnail Card
**Role:** Small photo+label tiles within the expanded navigation

8px radius, 4:3 image aspect ratio, dark overlay. Title 15px Paper, subtitle 12px Mist. Functions as a visual menu item — each section gets represented by its hero photograph.

## Do's and Don'ts

### Do
- Use Proxima Nova weight 300 at 62px+ for any section heading that needs to feel premium — the whisper-weight at large sizes is the system's voice.
- Default to text-arrow buttons (no fill, trailing →) for all primary actions; reserve filled dark buttons for moments of high emphasis.
- Apply 80px border-radius to any button or pill-shaped container — this is the system's signature curve, not 4px or 8px.
- Anchor every section opener with a full-bleed photograph at 100vw, then transition to white-canvas content below.
- Use Ember (#b75928) as the sole chromatic accent — for link text, one warm highlight per section maximum.
- Set display-size letter-spacing to -0.0250em and body letter-spacing to 0.0100em; the 4.2px negative at 168px is what makes the wordmark feel carved rather than set.
- Use the 8px radius for all card surfaces and image containers — do not flatten to 0px or round to 16px.

### Don't
- Do not use weight 600 or 700 at display sizes — the system speaks at weight 300 even when shouting.
- Do not introduce additional accent hues beyond Ember; the cool brand colors (Pine, Tide) are for card surfaces, not for text or buttons.
- Do not use drop shadows for elevation — depth comes from photography and surface color contrast, not box-shadow.
- Do not center-align body paragraphs — editorial sections are strictly left-aligned at ~600px max-width.
- Do not use gradients — the system is flat by design, with tone shifts achieved through surface color and photography.
- Do not use the 1584px pill radius on cards or images — that radius is reserved exclusively for navigation pills, badges, and tags.
- Do not pair Lora with Proxima Nova headings; Lora is a body-text accent only, and should never appear at sizes above 18px.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Paper | `#ffffff` | Base page canvas for content sections |
| 2 | Mist | `#e5e4e4` | Light card surface floating on Paper |
| 3 | Pine | `#193f32` | Dark green feature card for tonal variety |
| 4 | Tide | `#002934` | Deep teal card surface, darker than Pine |
| 5 | Char | `#1c1c1c` | Navigation pill, modal panels, and dark elevated surfaces |
| 6 | Midnight | `#070707` | Darkest surface for photography overlays and premium dark cards |

## Elevation

Elevation is achieved through photography and surface color layering, never through drop shadows. Dark cards on white canvas, white cards on dark photography, and Mist (#e5e4e4) cards on white create the perception of depth. The only shadow-like effect in the system is the implicit vignette of full-bleed hero photography — the site treats the photograph itself as the elevation tool.

## Imagery

Photography is the dominant visual element, occupying 50–70% of viewport space in section openers. Style: muted, slightly desaturated landscape and cityscape photography — mountains, coastal terrain, aerial city views, residential community shots. Treatment: full-bleed (100vw), no border-radius in hero contexts, 8px radius in card contexts. Color treatment leans cool and desaturated rather than vibrant, with the terracotta Ember accent occasionally present in subjects (terracotta rooftops, earth tones) to tie the photography into the brand palette. No illustrations, no abstract graphics, no 3D renders — photography is the only imagery language.

## Layout

Page model: max-width 1200px centered for content, with full-bleed 100vw sections at section transitions. Hero pattern: full-viewport landscape photograph with massive 168px brand wordmark overlaid bottom-left and small intro paragraph top-left. Section rhythm: alternates between full-bleed dark photography bands and max-width white canvas content sections, with ~80px vertical gaps between bands. Content arrangement: 2-column feature card grids for primary CTAs, left-aligned single-column text blocks (max-width ~600px) for editorial copy, no centered stacks. Navigation: minimal — a single compact dark pill in the top-right corner opens to reveal a 2-column card-based menu with photographic thumbnails.

## Agent Prompt Guide

**Quick Color Reference**
- text: #000000 (on light), #ffffff (on dark photography)
- background: #ffffff (canvas), #1c1c1c (dark surface)
- border: #e5e4e4 (light), #000000 (dark)
- accent: #b75928 (Ember — links, warm highlights only)
- primary action: #494949 (filled action)

**3–5 Example Component Prompts**

1. **Full-bleed hero section**: Background is a muted landscape photograph at 100vw, full viewport height. Brand wordmark "AKER" in Proxima Nova weight 300 at 168px, line-height 0.80, letter-spacing -4.2px, color #ffffff, positioned bottom-left with 40px padding. Intro paragraph top-left: Proxima Nova weight 400, 15px, line-height 1.50, color #ffffff, max-width 400px.

2. **Section with label + heading + body**: White #ffffff background, max-width 600px left-aligned. Overline label "Core business areas" in Proxima Nova weight 400, 12px, color #8d8d8d. Heading "What we do" in Proxima Nova weight 300, 36px, line-height 1.20, letter-spacing -0.72px, color #000000. Body paragraph in Proxima Nova weight 400, 15px, line-height 1.50, color #000000. 24px gap between elements.

3. **Two-column feature card row**: Two equal-width cards in a 2-column grid with 16px gap. Left card: #e5e4e5 background, 8px border-radius, 24px padding. Overline label 12px #8d8d8d. Heading "Invest with Aker" in Proxima Nova weight 300, 36px, #000000. Bottom-left ghost button: 15px Proxima Nova weight 400 #000000 text + 16px → arrow. Bottom-right decorative brand mark in #000000. Right card: full-bleed cityscape photograph with no visible border-radius (or 8px), white overline and heading overlaid on the image, same ghost button bottom-left in #ffffff.

4. **Navigation pill (closed state)**: 32px height, auto width with 13px horizontal padding, 1584px border-radius, background #1c1c1c. Brand text "AKER" in Proxima Nova weight 500, 12px, letter-spacing 0.12px, color #ffffff, followed by a hamburger icon (three horizontal lines, 16px, #ffffff). Positioned fixed top-right with 24px margin from viewport edge.

5. **Numbered list item**: Two-column layout per row with a 1px hairline divider in #e5e4e5 above. Left: two-digit number "01" in Proxima Nova weight 400, 12px, color #8d8d8d. Right: label "Invest" in Proxima Nova weight 400, 18px, color #000000. 6px row gap, 24px padding vertical.

## Similar Brands

- **Aman Resorts** — Same full-bleed muted landscape photography, whisper-weight large display type, and near-monochrome palette with a single warm accent — luxury through restraint
- **Vipp** — Same dark-on-white typographic hierarchy, ghost text-arrow buttons, and 2-column large feature cards with photographic and solid variants
- **Taschen books** — Same editorial-gallery layout — white walls, dramatic full-bleed imagery, and oversized serif-adjacent sans-serif at near-weight-300 for brand voice
- **Patagonia Worn Wear** — Same earth-toned landscape photography strategy, minimalist navigation, and section-by-section full-bleed photo bands
- **Heatherwick Studio** — Same architectural-portfolio language — massive type, photography as the primary content, and minimal UI chrome that lets the work speak

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-ink: #000000;
  --color-paper: #ffffff;
  --color-char: #1c1c1c;
  --color-midnight: #070707;
  --color-iron: #262626;
  --color-slate: #38464a;
  --color-mist: #e5e4e4;
  --color-smoke: #8d8d8d;
  --color-pewter: #666666;
  --color-ember: #b75928;
  --color-pine: #193f32;
  --color-tide: #002934;
  --color-driftwood: #537179;
  --color-cedar: #776157;
  --color-coral: #df6a6b;
  --color-primary-action-fill: #494949;

  /* Typography — Font Families */
  --font-proxima-nova: 'Proxima Nova', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-lora: 'Lora', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-body: 15px;
  --leading-body: 1.5;
  --tracking-body: 0.15px;
  --text-subheading: 18px;
  --leading-subheading: 1.5;
  --tracking-subheading: 0.18px;
  --text-heading-sm: 22px;
  --leading-heading-sm: 1.25;
  --tracking-heading-sm: -0.44px;
  --text-heading: 36px;
  --leading-heading: 1.2;
  --tracking-heading: -0.72px;
  --text-heading-lg: 62px;
  --leading-heading-lg: 1.1;
  --tracking-heading-lg: -1.55px;
  --text-display: 168px;
  --leading-display: 0.8;
  --tracking-display: -4.2px;

  /* Typography — Weights */
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-5: 5px;
  --spacing-6: 6px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-13: 13px;
  --spacing-14: 14px;
  --spacing-16: 16px;
  --spacing-19: 19px;
  --spacing-20: 20px;
  --spacing-22: 22px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-48: 48px;
  --spacing-64: 64px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 16px;
  --element-gap: 16px;

  /* Border Radius */
  --radius-md: 3.2px;
  --radius-lg: 8px;
  --radius-full: 80px;
  --radius-full-2: 160px;
  --radius-full-3: 800px;
  --radius-full-4: 1584px;

  /* Named Radii */
  --radius-cards: 8px;
  --radius-small: 3.2px;
  --radius-badges: 1584px;
  --radius-images: 8px;
  --radius-buttons: 80px;

  /* Surfaces */
  --surface-paper: #ffffff;
  --surface-mist: #e5e4e4;
  --surface-pine: #193f32;
  --surface-tide: #002934;
  --surface-char: #1c1c1c;
  --surface-midnight: #070707;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-ink: #000000;
  --color-paper: #ffffff;
  --color-char: #1c1c1c;
  --color-midnight: #070707;
  --color-iron: #262626;
  --color-slate: #38464a;
  --color-mist: #e5e4e4;
  --color-smoke: #8d8d8d;
  --color-pewter: #666666;
  --color-ember: #b75928;
  --color-pine: #193f32;
  --color-tide: #002934;
  --color-driftwood: #537179;
  --color-cedar: #776157;
  --color-coral: #df6a6b;
  --color-primary-action-fill: #494949;

  /* Typography */
  --font-proxima-nova: 'Proxima Nova', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-lora: 'Lora', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-body: 15px;
  --leading-body: 1.5;
  --tracking-body: 0.15px;
  --text-subheading: 18px;
  --leading-subheading: 1.5;
  --tracking-subheading: 0.18px;
  --text-heading-sm: 22px;
  --leading-heading-sm: 1.25;
  --tracking-heading-sm: -0.44px;
  --text-heading: 36px;
  --leading-heading: 1.2;
  --tracking-heading: -0.72px;
  --text-heading-lg: 62px;
  --leading-heading-lg: 1.1;
  --tracking-heading-lg: -1.55px;
  --text-display: 168px;
  --leading-display: 0.8;
  --tracking-display: -4.2px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-5: 5px;
  --spacing-6: 6px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-13: 13px;
  --spacing-14: 14px;
  --spacing-16: 16px;
  --spacing-19: 19px;
  --spacing-20: 20px;
  --spacing-22: 22px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-48: 48px;
  --spacing-64: 64px;

  /* Border Radius */
  --radius-md: 3.2px;
  --radius-lg: 8px;
  --radius-full: 80px;
  --radius-full-2: 160px;
  --radius-full-3: 800px;
  --radius-full-4: 1584px;
}
```
