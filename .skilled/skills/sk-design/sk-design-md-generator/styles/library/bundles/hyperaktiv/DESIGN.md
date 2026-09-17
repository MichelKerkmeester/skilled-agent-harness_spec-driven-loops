# HyperAktiv — Style Reference
> Swiss editorial broadsheet. Black display type at 90px on white, with electric blue as the only chromatic note.

**Theme:** light

HyperAktiv operates as a Swiss editorial poster: pure white canvas, oversized black display type, and one electric blue (#0000ff) that fires only on action and footer surfaces. Headlines dominate at 72–90px with line-heights tightened to 0.89–1.0, collapsing the page into a vertical column of massive typographic statements. Layouts alternate between full-bleed photography and asymmetric 50/50 splits, treating the interior photos as raw documentation rather than styled artwork. Everything is sharp-cornered except a single 20px button radius, and the only shadows are the ones baked into the photography — the interface itself stays flat, binary, and graphic.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Pure White | `#ffffff` | `--color-pure-white` | Page background, card surfaces, text on dark/action backgrounds |
| Absolute Black | `#000000` | `--color-absolute-black` | Body text, headings, icon strokes, hairline borders, image overlays |
| Mid Graphite | `#333333` | `--color-mid-graphite` | Input text, secondary text content |
| Light Silver | `#cccccc` | `--color-light-silver` | Input borders, subtle form dividers |
| Hyper Blue | `#0000ff` | `--color-hyper-blue` | Filled action buttons, footer background, interactive accent — the single chromatic punctuation against an otherwise achromatic system |

## Tokens — Typography

### Studiofeixensans — Display and heading typeface. Used uppercase at 72–90px with line-heights compressed to 0.89–1.0 so massive headlines stack into dense typographic blocks. Weights 400 and 700 — the lighter weight carries sub-headlines, 700 owns the display statements. Custom font; substitute with Archivo or Space Grotesk for its tight, geometric, slightly condensed character. · `--font-studiofeixensans`
- **Substitute:** Archivo or Space Grotesk
- **Weights:** 400, 700
- **Sizes:** 14, 16, 20, 22, 25, 28, 42, 72, 80, 90px
- **Line height:** 0.89, 1.00, 1.20, 1.22, 1.43, 1.50, 2.00
- **Letter spacing:** normal across all sizes — the visual tightness comes from line-height compression, not tracking
- **Role:** Display and heading typeface. Used uppercase at 72–90px with line-heights compressed to 0.89–1.0 so massive headlines stack into dense typographic blocks. Weights 400 and 700 — the lighter weight carries sub-headlines, 700 owns the display statements. Custom font; substitute with Archivo or Space Grotesk for its tight, geometric, slightly condensed character.

### DM Sans — Body and interface text. Single weight 400 across 14–20px. Used for form labels, card body copy, navigation, and supporting paragraphs. DM Sans stays quiet so Studiofeixensans can dominate at the top of the hierarchy. · `--font-dm-sans`
- **Substitute:** Inter or system-ui sans-serif
- **Weights:** 400
- **Sizes:** 14, 16, 20px
- **Line height:** 1.25, 1.43
- **Role:** Body and interface text. Single weight 400 across 14–20px. Used for form labels, card body copy, navigation, and supporting paragraphs. DM Sans stays quiet so Studiofeixensans can dominate at the top of the hierarchy.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 14px | 1.43 | — | `--text-caption` |
| body | 16px | 1.43 | — | `--text-body` |
| subheading | 20px | 1.25 | — | `--text-subheading` |
| heading-sm | 25px | 1.22 | — | `--text-heading-sm` |
| heading | 42px | 1.2 | — | `--text-heading` |
| heading-lg | 72px | 1 | — | `--text-heading-lg` |
| display | 90px | 0.89 | — | `--text-display` |

## Tokens — Spacing & Shapes

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 5 | 5px | `--spacing-5` |
| 7 | 7px | `--spacing-7` |
| 8 | 8px | `--spacing-8` |
| 9 | 9px | `--spacing-9` |
| 10 | 10px | `--spacing-10` |
| 11 | 11px | `--spacing-11` |
| 12 | 12px | `--spacing-12` |
| 15 | 15px | `--spacing-15` |
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 25 | 25px | `--spacing-25` |
| 30 | 30px | `--spacing-30` |
| 36 | 36px | `--spacing-36` |
| 45 | 45px | `--spacing-45` |
| 50 | 50px | `--spacing-50` |
| 60 | 60px | `--spacing-60` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 0px |
| cards | 0px |
| inputs | 0px |
| buttons | 20px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 30px
- **Card padding:** 15px
- **Element gap:** 10px

## Components

### Full-Bleed Hero Photograph
**Role:** Opening visual statement

Edge-to-edge photographic image (train station, cityscape) filling the viewport width. No border-radius, no overlay tint, no gradient mask. The image carries its own natural depth and contrast against the white margins above and below.

### Display Headline
**Role:** Section title

Studiofeixensans weight 700, uppercase, 72–90px, line-height 0.89–1.0, color #000000 on #ffffff. The defining element of the system — these headlines are 5–6x larger than body text and define the vertical rhythm of every page.

### Split Section (50/50 Image + Text)
**Role:** Primary content block

Two-column layout, image on one side (no padding, edge-to-edge), text on the other with ~30px internal padding. Used for concept, venue showcase, and reservation sections. Text column max-width ~480px, vertically centered.

### Primary Filled Button
**Role:** Call-to-action

Background #0000ff, text #ffffff, Studiofeixensans weight 400 uppercase, 14–16px, padding 10px 20px, border-radius 20px (the only rounded element in the system). No border, no shadow. The blue fill against the black/white surroundings makes it the only element that demands attention.

### Text Input
**Role:** Form field

Border 1px solid #cccccc (Light Silver), no border-radius, padding 8–12px vertical / 10–12px horizontal. Text color #333333 (Mid Graphite), 14–16px. Placeholder inherits lighter weight. Underlined or boxed, never rounded — consistent with the flat, editorial tone.

### Feature Bullet List
**Role:** Amenity/specification listing

Studiofeixensans weight 400, uppercase, 16–20px, line-height 1.43, color #000000. Items separated by a filled circle bullet (●) as inline character — no extra padding or decoration. Tight horizontal rhythm creates a dense, catalog-like feel.

### Image Grid (Events)
**Role:** Multi-image gallery block

Horizontal row of rectangular photographs, no gap or 5–10px gap, no border-radius, no captions. Each image bleeds to the section edge. Functions as visual proof-of-work for the venue.

### Marquee Headline
**Role:** Animated brand repetition

Studiofeixensans weight 700, uppercase, 80–90px, repeating the brand name 'HyperAktiv.' across the viewport. Tight letter-spacing, line-height 1.0, black on white. The trailing period is part of the wordmark identity.

### Chat Widget Bubble
**Role:** Persistent contact CTA

Fixed bottom-right, white card with subtle 1px border, rounded ~12px, containing avatar thumbnail, bold name 'Olivia', timestamp, and message preview. Green circular WhatsApp-style icon button adjacent. The only element that introduces any softness into the system.

### Footer
**Role:** Site footer

Full-bleed #0000ff background, white text, Studiofeixensans weight 400 uppercase, generous padding (40–60px vertical). Navigation links, legal text, and contact info all white on blue. The blue ground is the chromatic bookend to the white page.

### Pricing Statement
**Role:** Rate display

Studiofeixensans weight 400, uppercase, 42px, line-height 1.20, color #000000. Format: 'DÈS CHF 1000/JOURNÉE' — a single, declarative typographic moment, not a styled badge or card.

## Do's and Don'ts

### Do
- Use #0000ff exclusively for filled action buttons and the footer — it is the only chromatic surface allowed
- Set display headlines to 72–90px in Studiofeixensans 700 uppercase with line-height 0.89–1.0
- Use 20px border-radius on buttons and 0px on everything else (cards, inputs, images, tags)
- Let photographs run edge-to-edge with no border-radius and no overlay treatment
- Use the 50/50 split layout as the default for content sections — image on one side, text on the other
- Keep all body and interface text in DM Sans 400 at 14–20px — never let it compete with the display face
- Use uppercase for all headings, sub-headings, button labels, and feature lists in Studiofeixensans

### Don't
- Never introduce additional accent colors — the system is binary (black/white) plus one blue
- Never apply drop shadows, glows, or blurred surfaces to UI components — keep it flat
- Never use rounded corners on cards, inputs, or images — only buttons get the 20px radius
- Never set body or display line-height above 1.5 for body and below 0.9 for display — the compression is the signature
- Never use a chromatic color for text other than the white text on the blue footer
- Never add gradients, glassmorphism, or noise textures — surfaces are either solid white or solid blue
- Never use a serif, script, or decorative typeface — the system is two sans-serifs only

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Paper | `#ffffff` | Primary page background — the dominant canvas |
| 2 | Hyper Blue Ground | `#0000ff` | Footer and action surface — the only chromatic surface in the system |

## Elevation

The interface is intentionally flat. No drop shadows, no glows, no blurred surfaces. Depth is communicated only through full-bleed photography and typographic scale — the UI stays graphic, not skeuomorphic. If a component seems to need a shadow, it probably needs a border or a background swap instead.

## Imagery

Photographic documentation only — no illustration, no abstract graphics, no icons beyond the chat widget. Photography is documentary in tone: train platforms, empty interior rooms, architectural details, candid venue shots. Full-bleed at hero scale, contained at ~480px width in split sections. No filters, no duotone treatment, no rounded corners. Images carry the natural contrast and color of Swiss urban/architectural photography and are left to speak unprocessed. The visual language of a venue portfolio, not a lifestyle brand.

## Layout

Max-width ~1200px centered, but content frequently breaks the container to full-bleed for hero and footer. The page is a vertical sequence of full-width bands: full-bleed hero photo → marquee text → 50/50 split (concept text) → 50/50 split (venue image + text) → image grid → 50/50 split (reservation form). No sidebar, no card grid for features. Navigation is minimal — likely a thin top bar or hidden behind a menu trigger. Section rhythm is driven by 30px+ vertical gaps between bands and the dramatic scale shift between 90px display type and 16px body text. The 50/50 split is the workhorse layout pattern, used 3+ times per page.

## Agent Prompt Guide

## Quick Color Reference
- text: #000000
- background: #ffffff
- border: #000000 (hairline) or #cccccc (input)
- accent: #0000ff (Hyper Blue — action and footer only)
- primary action: #0000ff (filled action)

## Example Component Prompts

1. **Display Headline Block**: 'NOUS ACCUEILLONS VOS AMAZING EVENTS DEPUIS 2016!' in Studiofeixensans weight 700, uppercase, 90px, line-height 0.89, color #000000 on #ffffff background. Full viewport width, 30px top/bottom margin.

2. **50/50 Split Section (Image + Text)**: Left column: full-bleed interior photograph of a venue space, no border-radius, no overlay. Right column: 30px padding, Studiofeixensans weight 700 uppercase 72px heading 'ALIVE' in #000000, followed by DM Sans 400 16px body text in #333333, line-height 1.43. Below: Studiofeixensans 400 uppercase 16px feature list with ● separators.

3. **Primary Filled Button**: 'DÈS CHF 1000/JOURNÉE' link styled as a button: background #0000ff, text #ffffff, Studiofeixensans weight 400, uppercase, 16px, padding 10px 20px, border-radius 20px, no border, no shadow. Inline, left-aligned within its text column.

4. **Text Input Field**: 1px solid #cccccc border, 0px border-radius, padding 10px 12px, width 100% of column. Label above in DM Sans 400 14px #000000. Placeholder text in #333333. No focus glow — use a 2px #000000 border on focus instead.

5. **Full-Bleed Hero Photograph**: Edge-to-edge image filling 100vw width and ~60vh height. No overlay, no border-radius, no caption. White margin above and below (30px each). Followed immediately by the marquee headline block.

## Typography Philosophy

The typographic system is the product. Two typefaces, one job each: Studiofeixensans (custom) for everything that should be read from across the room, DM Sans for everything read at arm's length. The extreme display sizes (72–90px) with line-heights compressed to 0.89–1.0 are not a bug — they are the signature. They force headlines to stack into dense, poster-like blocks that anchor each section. Body text stays small (14–20px) and quiet (DM Sans, no bold, single weight 400). The contrast between these two registers is what gives the page its visual rhythm.

## Similar Brands

- **Studio Raphaël Lutz** — Parent studio — shares the same custom display typeface (Studiofeixensans) and Swiss editorial typographic system
- **Vitra** — Same oversized sans-serif headlines on white with full-bleed architectural photography and zero chromatic noise
- **Atelier Bingo** — Editorial broadsheet layout with massive display type and monochrome palette punctuated by single accent moments
- **Haltbar** — Swiss branding studio aesthetic — pure black/white with one electric accent, flat components, no shadows
- **Sagmeister & Walsh** — Poster-scale typography, full-bleed documentary photography, and binary color discipline

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-pure-white: #ffffff;
  --color-absolute-black: #000000;
  --color-mid-graphite: #333333;
  --color-light-silver: #cccccc;
  --color-hyper-blue: #0000ff;

  /* Typography — Font Families */
  --font-studiofeixensans: 'Studiofeixensans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-dm-sans: 'DM Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.43;
  --text-body: 16px;
  --leading-body: 1.43;
  --text-subheading: 20px;
  --leading-subheading: 1.25;
  --text-heading-sm: 25px;
  --leading-heading-sm: 1.22;
  --text-heading: 42px;
  --leading-heading: 1.2;
  --text-heading-lg: 72px;
  --leading-heading-lg: 1;
  --text-display: 90px;
  --leading-display: 0.89;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-5: 5px;
  --spacing-7: 7px;
  --spacing-8: 8px;
  --spacing-9: 9px;
  --spacing-10: 10px;
  --spacing-11: 11px;
  --spacing-12: 12px;
  --spacing-15: 15px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-25: 25px;
  --spacing-30: 30px;
  --spacing-36: 36px;
  --spacing-45: 45px;
  --spacing-50: 50px;
  --spacing-60: 60px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 30px;
  --card-padding: 15px;
  --element-gap: 10px;

  /* Border Radius */
  --radius-2xl: 20px;

  /* Named Radii */
  --radius-tags: 0px;
  --radius-cards: 0px;
  --radius-inputs: 0px;
  --radius-buttons: 20px;

  /* Surfaces */
  --surface-paper: #ffffff;
  --surface-hyper-blue-ground: #0000ff;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-pure-white: #ffffff;
  --color-absolute-black: #000000;
  --color-mid-graphite: #333333;
  --color-light-silver: #cccccc;
  --color-hyper-blue: #0000ff;

  /* Typography */
  --font-studiofeixensans: 'Studiofeixensans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-dm-sans: 'DM Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.43;
  --text-body: 16px;
  --leading-body: 1.43;
  --text-subheading: 20px;
  --leading-subheading: 1.25;
  --text-heading-sm: 25px;
  --leading-heading-sm: 1.22;
  --text-heading: 42px;
  --leading-heading: 1.2;
  --text-heading-lg: 72px;
  --leading-heading-lg: 1;
  --text-display: 90px;
  --leading-display: 0.89;

  /* Spacing */
  --spacing-5: 5px;
  --spacing-7: 7px;
  --spacing-8: 8px;
  --spacing-9: 9px;
  --spacing-10: 10px;
  --spacing-11: 11px;
  --spacing-12: 12px;
  --spacing-15: 15px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-25: 25px;
  --spacing-30: 30px;
  --spacing-36: 36px;
  --spacing-45: 45px;
  --spacing-50: 50px;
  --spacing-60: 60px;

  /* Border Radius */
  --radius-2xl: 20px;
}
```
