# VALIENTE BRANDS — Style Reference
> Signal flare on sun-baked clay. A single urgent red-orange screaming across a warm matte peach field, held together by a monolithic neo-grotesque and almost nothing else.

**Theme:** light

Valiente Brands is a brutalist broadcast — a single chromatic signal (vivid red-orange) fired across a sun-warmed clay canvas, with almost no UI surface treatment at all. The page is a vertical scroll of oversized monospace-feeling type, corner-pinned navigation labels, full-bleed cinematic video stills, and portrait grids. The aesthetic borrows from emergency signage and typesetter's proof sheets: everything is uppercase, aggressively tracked-negative at display sizes, and stripped of decoration. There are no cards, no shadows, no gradients, no rounded corners — the whole interface reads like a single printed broadside where one color does all the work. White space and type scale do the hierarchy, not containers or elevation.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Signal Flare | `#ff1a00` | `--color-signal-flare` | The only chromatic color in the system — used for logo, all navigation, body text, headings, icons, borders, and the video play affordance. Functions as both brand mark and foreground text color simultaneously |
| Sun-Baked Canvas | `#e7a196` | `--color-sun-baked-canvas` | Page background — a warm, muted clay-peach that softens the intensity of the red and gives the whole site its heat-shimmer atmosphere. Every default surface sits on this tone |
| Midnight Frame | `#0a0a0a` | `--color-midnight-frame` | Reserved for full-bleed video and photography sections only — appears as the dark frame around embedded media, never as a UI surface or text color |

## Tokens — Typography

### GT Pressura — The single workhorse typeface — carries everything from 12px footer labels to 245px display headlines. Its neo-grotesque character with slight mechanical tension makes it read almost monospace at small sizes and almost posterized at display sizes. Weight stays at 400 across the entire system; hierarchy is built through size, never weight. · `--font-gt-pressura`
- **Substitute:** Space Grotesk, IBM Plex Mono, JetBrains Mono
- **Weights:** 400
- **Sizes:** 12, 14, 16, 18, 20, 24, 48, 95, 128, 190, 245
- **Line height:** 0.80, 0.82, 1.00, 1.20
- **Letter spacing:** Tracking tightens dramatically with size: -0.005em at 12-18px (nearly closed), -0.025em at 20-24px, -0.030em at 48px, -0.037em at 95px, -0.040em at 128px, -0.043em at 190px, and -0.050em at 245px — display sizes squeeze letters until they almost touch
- **OpenType features:** `"tnum" on, "ss01" on`
- **Role:** The single workhorse typeface — carries everything from 12px footer labels to 245px display headlines. Its neo-grotesque character with slight mechanical tension makes it read almost monospace at small sizes and almost posterized at display sizes. Weight stays at 400 across the entire system; hierarchy is built through size, never weight.

### Monument Grotesk — Reserved for one purpose: the primary 48px statement headline ("IMPACT-LED BRAND CONSULTANCY"). A wider, more humanist grotesque that contrasts GT Pressura's mechanical quality with a slightly warmer proportion. Only appears once per page at this exact size. · `--font-monument-grotesk`
- **Substitute:** Inter, Manrope, General Sans
- **Weights:** 400
- **Sizes:** 48
- **Line height:** 1.00
- **Letter spacing:** -0.0400em
- **Role:** Reserved for one purpose: the primary 48px statement headline ("IMPACT-LED BRAND CONSULTANCY"). A wider, more humanist grotesque that contrasts GT Pressura's mechanical quality with a slightly warmer proportion. Only appears once per page at this exact size.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.2 | -0.06px | `--text-caption` |
| body-sm | 14px | 1.2 | -0.07px | `--text-body-sm` |
| body | 16px | 1.2 | -0.08px | `--text-body` |
| subheading | 18px | 1.2 | -0.09px | `--text-subheading` |
| subheading-lg | 20px | 1.2 | -0.5px | `--text-subheading-lg` |
| heading | 48px | 1 | -1.44px | `--text-heading` |
| heading-lg | 95px | 0.82 | -3.52px | `--text-heading-lg` |
| display-sm | 128px | 0.82 | -5.12px | `--text-display-sm` |
| display | 190px | 0.8 | -8.17px | `--text-display` |
| display-xl | 245px | 0.8 | -12.25px | `--text-display-xl` |

## Tokens — Spacing & Shapes

**Base unit:** 6px

**Density:** compact

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 12 | 12px | `--spacing-12` |
| 24 | 24px | `--spacing-24` |
| 30 | 30px | `--spacing-30` |
| 60 | 60px | `--spacing-60` |
| 120 | 120px | `--spacing-120` |
| 138 | 138px | `--spacing-138` |
| 150 | 150px | `--spacing-150` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 0px |
| cards | 0px |
| media | 0px |
| inputs | 0px |
| buttons | 0px |

### Layout

- **Page max-width:** 1440px
- **Section gap:** 120-160px
- **Card padding:** 0px
- **Element gap:** 20px

## Components

### Corner Navigation
**Role:** Primary site navigation

Vertical text stack pinned to the top-left edge of the viewport. 12px GT Pressura, uppercase, color #ff1a00, letter-spacing -0.005em. Items separated by 5px vertical gap. No background, no border, no hover indicator beyond the existing red — the position and color are the entire affordance.

### Corner Badge (Top-Right)
**Role:** Location / establishment marker

Two lines stacked in the top-right corner: "EST. IN TN" in 12px uppercase #ff1a00, paired with a 40px circular outlined icon (also #ff1a00, 1px stroke) below. Functions as a permanent site signature in the corner, mirroring the nav block on the opposite side.

### Centered Logo Lockup
**Role:** Brand identity at the top of the page

Wordmark "VALIENTE" in Monument Grotesk or GT Pressura at ~48px, color #ff1a00, centered horizontally in the header. The final E is replaced with a geometric mark — a modified B-glyph that breaks the wordmark's rhythm. Sits alone with no tagline or supporting text.

### Statement Headline
**Role:** Hero-level messaging

48px GT Pressura (or Monument Grotesk for the single hero statement), weight 400, color #ff1a00, line-height 1.0, letter-spacing -1.92px (Monument) or -1.44px (GT Pressura). Centered horizontally, flanked by a long em-dash on the left to suggest a continuation or broadcast signal.

### Display Type Block
**Role:** Oversized section markers and alphanumeric strings

GT Pressura at 128-245px, weight 400, line-height 0.80-0.82, color #ff1a00, uppercase, tracked to near-contact (-0.040em to -0.050em). Used for monospace-feeling alphanumeric strings ("WFBCGLZU", "DJCTUVOCI...") that act as visual texture rather than readable content. The negative tracking at this size is the signature — letters compress until they almost merge.

### Footer Bar
**Role:** Page-bottom metadata strip

Three-column row at the bottom of the first screen: left label (e.g. "BRAVERY IN PRACTICE"), center scroll prompt ("SCROLL TO VIEW MORE ↓"), right copyright ("©2026"). All 12px GT Pressura, uppercase, #ff1a00, separated by the full viewport width. No background, no border — the warmth of the canvas holds the whole strip.

### Full-Bleed Video Frame
**Role:** Cinematic media sections

Edge-to-edge video or still image filling the full viewport width and ~40% of the viewport height. The play control is a 64px circle outlined in #ff1a00 (1.5px stroke) with a centered triangle play glyph, positioned over the center of the media. No rounded corners, no overlay chrome.

### Section Label Pair
**Role:** Metadata flanking media blocks

Two small 12px uppercase GT Pressura labels in #ff1a00, pinned to the left and right edges of a thin band directly below a full-bleed media section. Left label describes scope ("WORLDWIDE BASED"), right label describes date or status ("EST (2025)"). No divider, no background — the canvas color is the only separator from the media above.

### Portrait Grid
**Role:** Team or contributor showcase

Three-column grid of square or near-square portrait photographs, edge-to-edge with no gutter and no border. Portraits are full-bleed, no captions inside the image, no overlays. The grid sits directly on the warm canvas — the photographs provide the only tonal contrast in the section.

### Scroll Prompt
**Role:** Vertical wayfinding cue

A short text indicator ("SCROLL TO VIEW MORE ↓") in 12px GT Pressura uppercase, #ff1a00, with a downward arrow glyph. Centered in the footer bar or directly below content blocks. The arrow is the only iconography in the system besides the play control and the corner badge circle.

## Do's and Don'ts

### Do
- Use GT Pressura at weight 400 for all UI text — never introduce bold or light weights, hierarchy comes from size alone
- Apply #ff1a00 as the single chromatic color for every text, border, and icon element; let the warm #e7a196 canvas carry the atmosphere
- Push display headlines to 128px or larger with letter-spacing between -0.040em and -0.050em — the near-contact tracking is the signature
- Pin navigation and metadata to the four corners of the viewport (top-left links, top-right badge, bottom-left label, bottom-right copyright) rather than building a traditional header bar
- Use full-bleed edge-to-edge media (video, photography) with no rounding and no overlay chrome — let the canvas be the only frame
- Maintain line-height at 0.80-0.82 for display sizes and 1.0-1.2 for body text — never set a looser line-height than 1.2
- Keep all text uppercase; the system has no mixed-case or sentence-case type

### Don't
- Do not introduce shadows, gradients, borders with radius, or any container-based elevation — the page is flat print, not stacked surfaces
- Do not use a CTA button fill color; the system has no filled buttons, only text links and outlined play controls
- Do not add secondary or tertiary text colors — #ff1a00 against #e7a196 is the only contrast pair in the system
- Do not use card padding, gutters, or rounded corners on any media or content block
- Do not mix multiple type families; GT Pressura handles everything except the single Monument Grotesk hero headline
- Do not use weight 600 or 700 to create emphasis — increase size instead
- Do not set display letter-spacing looser than -0.025em; the compressed tracking is what makes the type feel broadcast-loud

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Sun-Baked Canvas | `#e7a196` | Default page background — every text section, navigation layer, and content block sits on this warm clay-peach field |
| 2 | Midnight Frame | `#0a0a0a` | Full-bleed video and photography sections only — the only departure from the warm canvas, used to frame embedded media |

## Elevation

No shadows, no elevation system, no z-depth. Hierarchy is built entirely through type scale, color contrast, and whitespace. Elements sit flat on the canvas like print on paper — the page behaves as a single surface that scrolls vertically rather than a stack of cards.

## Imagery

Photography and video carry the entire emotional weight — there are no illustrations, no product mockups, no abstract graphics, and almost no iconography. Imagery is cinematic and dark: moody full-bleed video stills (a boxer in a ring, shot through a teal-green color grade), and tight square portrait crops of individuals against varied backgrounds (warm interiors, daylight windows). Treatment is always full-bleed, edge-to-edge, with no rounded corners, no masks, and no overlay text. The dark photographic sections are the only departure from the warm peach canvas — they read as windows cut into a printed page. The color contrast between the warm clay background and the cool-dark media is itself a design device. Icons are restricted to three marks total: a hamburger bar in the top-left, a circular badge with a glyph in the top-right, and a downward scroll arrow — all stroke-only outlines in #ff1a00.

## Layout

The page is a vertical scroll with no horizontal constraints beyond a ~1440px max-width on text content. The first screen is a near-empty warm canvas with only four corner elements (nav, logo, badge, footer) and one centered statement — then a full-bleed dark video section, then a metadata band, then a block of large monospace-feeling display text, then a three-column portrait grid. The rhythm is: empty warm canvas → dark full-bleed media → warm text block → dark media → warm text block → photography grid. There is no alternating light/dark band system — instead, the warm canvas is the default and full-bleed media punctures it. Section gaps are very large (120-160px), with text left-aligned in blocks and centered for hero statements. The grid is strict: three columns for portraits, full-width for video, max-width centered for text blocks. Navigation is minimal — just a vertical text stack in the top-left corner with no background container.

## Agent Prompt Guide

**Quick Color Reference**
- text: #ff1a00
- background: #e7a196
- border / icon stroke: #ff1a00
- accent (play control, badge circle): #ff1a00
- media frame: #0a0a0a
- primary action: no distinct CTA color

**Example Component Prompts**
1. Build the hero statement headline: 48px Monument Grotesk weight 400, #ff1a00, line-height 1.0, letter-spacing -1.92px, centered on a #e7a196 canvas, with a long em-dash (—) preceding the text to the left.
2. Build a corner navigation block: vertical stack of uppercase GT Pressura links (ABOUT, SERVICES, WORK, VALUES, TEAM, CONTACT, ESTIMATION) at 12px weight 400, #ff1a00, letter-spacing -0.005em, separated by 5px row-gap, pinned to the top-left of the viewport with no background.
3. Build the full-bleed video frame: edge-to-edge media block with a 64px circle centered on the image, 1.5px stroke in #ff1a00, containing a filled play triangle in #ff1a00.
4. Build a display type block: GT Pressura 190px weight 400, #ff1a00, line-height 0.80, letter-spacing -8.17px, uppercase, left-aligned, used for monospace-feeling alphanumeric strings.
5. Build the footer bar: single row at the bottom of the first screen, three items spread across the full width (left: "BRAVERY IN PRACTICE", center: "SCROLL TO VIEW MORE ↓", right: "©2026"), all 12px GT Pressura uppercase #ff1a00, sitting directly on the #e7a196 canvas with no border or background.

## Similar Brands

- **STUDIO BRAD** — Same single-color brutalist agency aesthetic — one vivid chromatic color (often red) screaming across a minimal canvas, with oversized uppercase type and almost no UI chrome
- **&Walsh** — Brand consultancy with a portfolio site that uses one display family aggressively tracked-negative, corner-pinned navigation, and flat full-bleed media with no card containers
- **COLLINS** — Brand identity studio whose site treats type as the entire interface — large monospace-feeling grotesque at display sizes, minimal color, and full-bleed photography as the only visual counterpoint
- **Locomotive** — Canadian agency that uses a warm off-white canvas, oversized uppercase neo-grotesque type, and bold red-orange as a singular chromatic accent for everything interactive and textual

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-signal-flare: #ff1a00;
  --color-sun-baked-canvas: #e7a196;
  --color-midnight-frame: #0a0a0a;

  /* Typography — Font Families */
  --font-gt-pressura: 'GT Pressura', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-monument-grotesk: 'Monument Grotesk', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.2;
  --tracking-caption: -0.06px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.2;
  --tracking-body-sm: -0.07px;
  --text-body: 16px;
  --leading-body: 1.2;
  --tracking-body: -0.08px;
  --text-subheading: 18px;
  --leading-subheading: 1.2;
  --tracking-subheading: -0.09px;
  --text-subheading-lg: 20px;
  --leading-subheading-lg: 1.2;
  --tracking-subheading-lg: -0.5px;
  --text-heading: 48px;
  --leading-heading: 1;
  --tracking-heading: -1.44px;
  --text-heading-lg: 95px;
  --leading-heading-lg: 0.82;
  --tracking-heading-lg: -3.52px;
  --text-display-sm: 128px;
  --leading-display-sm: 0.82;
  --tracking-display-sm: -5.12px;
  --text-display: 190px;
  --leading-display: 0.8;
  --tracking-display: -8.17px;
  --text-display-xl: 245px;
  --leading-display-xl: 0.8;
  --tracking-display-xl: -12.25px;

  /* Typography — Weights */
  --font-weight-regular: 400;

  /* Spacing */
  --spacing-unit: 6px;
  --spacing-12: 12px;
  --spacing-24: 24px;
  --spacing-30: 30px;
  --spacing-60: 60px;
  --spacing-120: 120px;
  --spacing-138: 138px;
  --spacing-150: 150px;

  /* Layout */
  --page-max-width: 1440px;
  --section-gap: 120-160px;
  --card-padding: 0px;
  --element-gap: 20px;

  /* Named Radii */
  --radius-tags: 0px;
  --radius-cards: 0px;
  --radius-media: 0px;
  --radius-inputs: 0px;
  --radius-buttons: 0px;

  /* Surfaces */
  --surface-sun-baked-canvas: #e7a196;
  --surface-midnight-frame: #0a0a0a;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-signal-flare: #ff1a00;
  --color-sun-baked-canvas: #e7a196;
  --color-midnight-frame: #0a0a0a;

  /* Typography */
  --font-gt-pressura: 'GT Pressura', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-monument-grotesk: 'Monument Grotesk', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.2;
  --tracking-caption: -0.06px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.2;
  --tracking-body-sm: -0.07px;
  --text-body: 16px;
  --leading-body: 1.2;
  --tracking-body: -0.08px;
  --text-subheading: 18px;
  --leading-subheading: 1.2;
  --tracking-subheading: -0.09px;
  --text-subheading-lg: 20px;
  --leading-subheading-lg: 1.2;
  --tracking-subheading-lg: -0.5px;
  --text-heading: 48px;
  --leading-heading: 1;
  --tracking-heading: -1.44px;
  --text-heading-lg: 95px;
  --leading-heading-lg: 0.82;
  --tracking-heading-lg: -3.52px;
  --text-display-sm: 128px;
  --leading-display-sm: 0.82;
  --tracking-display-sm: -5.12px;
  --text-display: 190px;
  --leading-display: 0.8;
  --tracking-display: -8.17px;
  --text-display-xl: 245px;
  --leading-display-xl: 0.8;
  --tracking-display-xl: -12.25px;

  /* Spacing */
  --spacing-12: 12px;
  --spacing-24: 24px;
  --spacing-30: 30px;
  --spacing-60: 60px;
  --spacing-120: 120px;
  --spacing-138: 138px;
  --spacing-150: 150px;
}
```
