# Glyphy — Style Reference
> buttercream specimen sheet beneath sunset bands. A warm cream page sliced by yellow-to-plum horizontal stripes, anchored by an oversized neo-grotesque wordmark and tiny pixel Japanese eyebrows.

**Theme:** light

Glyphy is a warm-cream canvas cut by horizontal sunset bands: yellow, orange, red, burgundy, plum stacked top-to-bottom like a heat map. The interface stays almost entirely achromatic (ink on buttercream) with chromatic color appearing only as full-width category strips. Typography carries the personality: a monumental neo-grotesque display face (Neue Machina) anchors the wordmark at 120px with line-height 0.75, paired with pixel-accurate Japanese eyebrows and a clean system sans for everything else. Components are pill-shaped and minimal — outlined ghost buttons on colored bands, flat dark or cream cards with 14px corners, and dense symbol grids that feel like a typographic specimen book.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Buttercream | `#fef9e6` | `--color-buttercream` | Page canvas, card surfaces, light text on dark — the warm cream ground that unifies the entire site |
| Ink | `#000000` | `--color-ink` | Primary text, hairlines, card borders, outlined button borders, link strokes — the only structural non-cream color in the neutral stack |
| Carbon | `#060606` | `--color-carbon` | Near-black surface for dark cards, filled button background, nav strip — slightly softer than pure ink for large fills |
| Driftwood | `#c7c3b4` | `--color-driftwood` | Muted hairline borders on cards and lists, warm gray that sits between buttercream and ink without breaking the warmth |
| Stone | `#8d8b80` | `--color-stone` | Secondary card text and tertiary borders — the warm mid-gray for de-emphasized copy |
| Amber Pulse | `#fdc331` | `--color-amber-pulse` | First sunset band (Font Generator) — warm yellow stripe signaling the start of the category stack |
| Ember Glow | `#fe5722` | `--color-ember-glow` | Second sunset band (Cool Symbols) — saturated orange that pushes the stack hotter |
| Signal Red | `#f0353c` | `--color-signal-red` | Third sunset band (Name Generator) — true red midway through the gradient |
| Merlot Depth | `#b4213d` | `--color-merlot-depth` | Fourth sunset band (Emoticons) — deep crimson cooling the stack |
| Plum Shadow | `#671c3b` | `--color-plum-shadow` | Fifth sunset band (PFP Maker) — the darkest plum, the bottom of the heat-map |

## Tokens — Typography

### Arial — Arial — detected in extracted data but not described by AI · `--font-arial`
- **Weights:** 400
- **Sizes:** 32px, 64px
- **Line height:** 1, 1.33
- **Role:** Arial — detected in extracted data but not described by AI

### Neue Machina — Display and wordmark only — the 120px hero at line-height 0.75 creates the condensed, monumental block that defines the brand. Tighter than default, almost stack-cut. Used for the GL YPHY logotype and section display headlines. · `--font-neue-machina`
- **Substitute:** Space Grotesk (700) or any wide geometric grotesque
- **Weights:** 400, 700, 800
- **Sizes:** 21px, 64px, 120px
- **Line height:** 0.75, 1.00
- **Role:** Display and wordmark only — the 120px hero at line-height 0.75 creates the condensed, monumental block that defines the brand. Tighter than default, almost stack-cut. Used for the GL YPHY logotype and section display headlines.

### System85 — Primary UI and body sans — handles nav links, button labels, card text, section headers, and list items. The workhorse family covering 90% of text. · `--font-system85`
- **Substitute:** Inter or Söhne
- **Weights:** 400, 700
- **Sizes:** 14px, 16px, 18px, 24px, 32px, 40px
- **Line height:** 1.00, 1.20
- **Role:** Primary UI and body sans — handles nav links, button labels, card text, section headers, and list items. The workhorse family covering 90% of text.

### Pixel M Plus 10 — Japanese pixel-font eyebrows above English headlines (フォント, シンボル, グリフィー) and occasional decorative bits — a deliberate retro-arcade accent that contrasts the modern grotesque body face · `--font-pixel-m-plus-10`
- **Substitute:** Press Start 2P or Misaki Gothic pixel
- **Weights:** 400, 700
- **Sizes:** 12px, 14px, 18px, 24px, 64px
- **Line height:** 1.00, 1.33
- **Role:** Japanese pixel-font eyebrows above English headlines (フォント, シンボル, グリフィー) and occasional decorative bits — a deliberate retro-arcade accent that contrasts the modern grotesque body face

### System85 Mono — Card labels and small metadata (Font Generator, Instagram Fonts captions) — monospace signals data/specimen identity · `--font-system85-mono`
- **Substitute:** JetBrains Mono or IBM Plex Mono
- **Weights:** 400
- **Sizes:** 14px
- **Line height:** 1.00
- **Role:** Card labels and small metadata (Font Generator, Instagram Fonts captions) — monospace signals data/specimen identity

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1 | — | `--text-caption` |
| body-sm | 14px | 1 | — | `--text-body-sm` |
| body | 16px | 1.2 | — | `--text-body` |
| subheading | 18px | 1.2 | — | `--text-subheading` |
| heading-sm | 24px | 1.2 | — | `--text-heading-sm` |
| heading | 32px | 1.2 | — | `--text-heading` |
| heading-lg | 40px | 1.2 | — | `--text-heading-lg` |
| display | 64px | 1 | — | `--text-display` |
| hero | 120px | 0.75 | — | `--text-hero` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** spacious

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 8 | 8px | `--spacing-8` |
| 12 | 12px | `--spacing-12` |
| 16 | 16px | `--spacing-16` |
| 24 | 24px | `--spacing-24` |
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 80 | 80px | `--spacing-80` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 14px |
| body | 14px |
| cards | 14px |
| buttons | 28px |

### Layout

- **Section gap:** 32px
- **Card padding:** 27px
- **Element gap:** 24px

## Components

### Category Band Row
**Role:** Full-bleed horizontal entry for each major tool (Font Generator, Cool Symbols, Name Generator, Emoticons, PFP Maker)

Full-width strip filled with one of the five sunset colors (Amber Pulse, Ember Glow, Signal Red, Merlot Depth, Plum Shadow). Left-aligned category name in 32px Ink/Butttercream. Right-aligned pill button. No rounded corners on the band itself — the color bleeds to viewport edges. Vertical padding ~40px.

### Pill Ghost Button
**Role:** Primary action on category bands and specimen cards

28px border-radius pill, 1px Ink border, Buttercream/white fill, 24px vertical padding, 27px horizontal padding. Label in 14-18px System85 weight 400 Ink, with right-arrow → icon. Transparent interior on colored bands, opaque on cream sections.

### Dark Specimen Card
**Role:** Font preview tile in the Popular Font Generators grid

Carbon (#060606) background, 14px radius, ~27px padding. Large display font sample centered (Instagram, GLITCH, Fansy, etc.) in Buttercream. Top-left label 'Font Generator' in 14px Mono Buttercream. Top-right pill 'VIEW →' button with 1px Buttercream border.

### Light Specimen Card
**Role:** Alternating specimen tile in the font grid

Buttercream background, 14px radius, 1px Ink or Driftwood border, 27px padding. Display font sample in Ink. Same label and VIEW button pattern as dark variant, with Ink text/border.

### Top Nav Bar
**Role:** Sticky header with brand mark and tool links

Carbon (#060606) background full-width. Left: GLYPHY wordmark in System85 weight 700 Buttercream. Center-left: nav links (Font Generator, Cool Symbols, Name Generator, Emoticons, Blog) in 14px System85 Buttercream with 32px horizontal padding and 4-8px gaps. Right: language toggle. 14px radius on any nested containers.

### Symbol Grid Cell
**Role:** Individual symbol tile in the Browse Cool Symbols grid

Square cell on Buttercream canvas, separated by 1px Driftwood/ink hairlines forming a continuous grid. Single glyph centered in Ink, ~32-40px display size. No padding beyond the implicit cell margins. The grid is the visual — no card containers, just lines.

### Hero Wordmark Block
**Role:** The brand's signature opening element

Tiny pixel Japanese eyebrow (グリフィー) in Pixel M Plus at 14-18px Buttercream. Below: GL YPHY in Neue Machina weight 700-800 at 120px, line-height 0.75, Ink on Buttercream. Right-aligned tagline 'Copy & paste fancy fonts + cool symbols' in 18px System85. Spans the full cream canvas with generous 40-80px top/bottom padding.

### Section Header
**Role:** Section titles for content blocks (POPULAR FONT GENERATORS, BROWSE COOL SYMBOLS)

Pixel Japanese eyebrow label in 14-18px Pixel M Plus Buttercream/Stone above. English display headline in 40px Neue Machina or System85 weight 700, Ink, left-aligned. Tight 4-8px gap between eyebrow and headline.

### Font Card Meta Strip
**Role:** Sub-label below each specimen card

Small 14px Mono caption in Stone (e.g. 'Instagram Fonts', 'Glitch Text', 'Discord Fonts') — identifies the font style category underneath each preview.

## Do's and Don'ts

### Do
- Stack the five sunset colors (Amber Pulse → Ember Glow → Signal Red → Merlot Depth → Plum Shadow) in that exact order as full-width category bands — do not reorder or substitute hues
- Use Neue Machina at 120px with line-height 0.75 for the hero wordmark and any 64px+ display headlines — the condensed line-height is what makes it monumental
- Pair every English section title with a tiny Pixel M Plus Japanese eyebrow (12-14px) sitting 4-8px above it
- Use 28px border-radius for all pill buttons and 14px for all cards, nav, and body containers — the two-radius system is the only rounding vocabulary
- Set card padding to 27px horizontal and 24-40px vertical — generous, never tight, matching the spacious density
- Separate symbol grid cells with 1px Driftwood (#c7c3b4) hairlines forming a continuous grid — never add card containers or gaps that break the specimen-sheet feel
- Use 1px Ink borders at 14px radius for all card and button outlines — flat, no shadows, no fills beyond the cream canvas or the five band colors

### Don't
- Do not add drop shadows, elevation, or blur effects — the design is deliberately flat and relies only on hairlines and color bands for separation
- Do not introduce additional chromatic colors outside the five-band sunset palette — the site is 99% achromatic, with color appearing only as those full-width category stripes
- Do not use System85 or Arial for display sizes above 40px — Neue Machina owns everything 64px+; mixing faces at display sizes breaks the monumentality
- Do not round card corners to anything other than 14px — 28px on cards would look like buttons, 0px would clash with the pill button vocabulary
- Do not use any background color other than Buttercream (#fef9e6) on the page canvas — even 'white' breaks the warm-tone system
- Do not center-align category band content — left-aligned name + right-aligned pill button is the signature rhythm
- Do not use line-height above 1.2 for body or 1.0 for display — the tight tracking is part of the visual identity

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Canvas | `#fef9e6` | Page background — the warm cream ground |
| 2 | Category Band | `#fdc331` | Full-width colored stripe for category entry |
| 3 | Dark Card | `#060606` | Inverted specimen cards with buttercream text |
| 4 | Light Card | `#fef9e6` | Same as canvas but with driftwood/ink border to define card edge |

## Elevation

Flat by design — no shadows anywhere. The only depth cues are 1px hairline borders in ink or driftwood, and full-bleed color bands that create rhythm without shadow lift. Cards sit on the same plane as their surroundings.

## Imagery

No photography, no illustrations, no product screenshots. The site is a pure typographic specimen system: the 'imagery' is the display fonts themselves (Instagram, GLITCH, Fansy, Discord, Zaigo, Stylish) rendered at large size inside specimen cards, and the symbol grid where hundreds of unicode glyphs are arranged in a continuous grid. Japanese pixel-font eyebrows add a retro-arcade decorative layer. The sunset color bands serve as the only atmospheric/decorative visual element.

## Layout

Full-bleed layout with no max-width constraint — content extends to viewport edges. The page reads as a vertical stack of horizontal bands: dark nav strip → cream hero with oversized wordmark → five colored category bands (yellow to plum) → cream content sections with card grids → footer. Card grids use a 3-column layout on desktop for font previews. The symbol browser is a dense continuous grid with hairline dividers, no card containers. Navigation is a single horizontal dark bar at the top with inline links. All vertical rhythm is generous (40-80px section padding) while card-internal padding is tighter (24-27px).

## Agent Prompt Guide

**Quick Color Reference**
- text: #000000 (Ink)
- background: #fef9e6 (Buttercream)
- border: #c7c3b4 (Driftwood) or #000000 (Ink)
- accent/band colors: #fdc331, #fe5722, #f0353c, #b4213d, #671c3b (sunset stack)
- dark surface: #060606 (Carbon)
- primary action: #060606 (filled action)

**3-5 Example Component Prompts**

1. *Category Band Row*: Full-width horizontal band, background #fdc331 (Amber Pulse). Left-aligned 'Font Generator' in 32px System85 weight 700 #fef9e6. Right-aligned ghost pill button: 1px #fef9e6 border, transparent fill, 28px radius, 24px/27px padding, label 'TRY NOW →' in 14px System85 weight 400 #fef9e6. Vertical padding 40px.

2. *Hero Wordmark*: Buttercream (#fef9e6) canvas. Eyebrow 'グリフィー' in 18px Pixel M Plus weight 400 #8d8b80. Wordmark 'GLYPHY' below in 120px Neue Machina weight 800, line-height 0.75, color #000000. Right-aligned tagline 'Copy & paste fancy fonts + cool symbols' in 18px System85 weight 400 #000000. 80px top padding.

3. *Dark Specimen Card*: 14px radius, background #060606, 27px padding. Centered font sample 'Instagram' in 64px display weight 700 #fef9e6. Top-left label 'Font Generator' in 14px System85 Mono #fef9e6. Top-right ghost pill: 1px #fef9e6 border, transparent fill, 28px radius, label 'VIEW →' in 14px System85 Mono #fef9e6.

4. *Symbol Grid Cell*: Square cell on continuous #fef9e6 canvas. 1px #c7c3b4 hairline borders forming unbroken grid lines. Single glyph centered in 32px display weight 400 #000000. No padding beyond cell bounds, no card container.

5. *Section Header*: 14px Pixel M Plus eyebrow 'フォント' in #8d8b80, 8px below it a 40px System85 weight 700 #000000 headline 'POPULAR FONT GENERATORS', left-aligned on Buttercream canvas.

## Similar Brands

- **Cool Symbol / Lingojam** — Same specimen-sheet symbol grid approach with continuous hairlines and cream canvas
- **Yatopia / Lapa Ninja** — Full-bleed horizontal color bands as navigation/entry pattern, pill ghost buttons on colored grounds
- **Typewolf specimen pages** — Typography-first layouts where display type IS the visual content inside bordered specimen cards
- **Pinterest (old grid)** — Continuous grid with hairline dividers and no card padding for dense visual browsing

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-buttercream: #fef9e6;
  --color-ink: #000000;
  --color-carbon: #060606;
  --color-driftwood: #c7c3b4;
  --color-stone: #8d8b80;
  --color-amber-pulse: #fdc331;
  --color-ember-glow: #fe5722;
  --color-signal-red: #f0353c;
  --color-merlot-depth: #b4213d;
  --color-plum-shadow: #671c3b;

  /* Typography — Font Families */
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-neue-machina: 'Neue Machina', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-system85: 'System85', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-pixel-m-plus-10: 'Pixel M Plus 10', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-system85-mono: 'System85 Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1;
  --text-body-sm: 14px;
  --leading-body-sm: 1;
  --text-body: 16px;
  --leading-body: 1.2;
  --text-subheading: 18px;
  --leading-subheading: 1.2;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.2;
  --text-heading: 32px;
  --leading-heading: 1.2;
  --text-heading-lg: 40px;
  --leading-heading-lg: 1.2;
  --text-display: 64px;
  --leading-display: 1;
  --text-hero: 120px;
  --leading-hero: 0.75;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-bold: 700;
  --font-weight-extrabold: 800;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-80: 80px;

  /* Layout */
  --section-gap: 32px;
  --card-padding: 27px;
  --element-gap: 24px;

  /* Border Radius */
  --radius-xl: 14px;
  --radius-3xl: 28px;

  /* Named Radii */
  --radius-nav: 14px;
  --radius-body: 14px;
  --radius-cards: 14px;
  --radius-buttons: 28px;

  /* Surfaces */
  --surface-canvas: #fef9e6;
  --surface-category-band: #fdc331;
  --surface-dark-card: #060606;
  --surface-light-card: #fef9e6;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-buttercream: #fef9e6;
  --color-ink: #000000;
  --color-carbon: #060606;
  --color-driftwood: #c7c3b4;
  --color-stone: #8d8b80;
  --color-amber-pulse: #fdc331;
  --color-ember-glow: #fe5722;
  --color-signal-red: #f0353c;
  --color-merlot-depth: #b4213d;
  --color-plum-shadow: #671c3b;

  /* Typography */
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-neue-machina: 'Neue Machina', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-system85: 'System85', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-pixel-m-plus-10: 'Pixel M Plus 10', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-system85-mono: 'System85 Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1;
  --text-body-sm: 14px;
  --leading-body-sm: 1;
  --text-body: 16px;
  --leading-body: 1.2;
  --text-subheading: 18px;
  --leading-subheading: 1.2;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.2;
  --text-heading: 32px;
  --leading-heading: 1.2;
  --text-heading-lg: 40px;
  --leading-heading-lg: 1.2;
  --text-display: 64px;
  --leading-display: 1;
  --text-hero: 120px;
  --leading-hero: 0.75;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-80: 80px;

  /* Border Radius */
  --radius-xl: 14px;
  --radius-3xl: 28px;
}
```
