# Advene — Style Reference
> editorial fashion spread on warm parchment — a gallery catalog that happens to sell handbags

**Theme:** light

Advene reads as an art-gallery catalog printed on warm parchment: a luxury accessories brand whose interface behaves like an editorial spread rather than a storefront. The canvas is a muted stone-warm gray (#dfe0db) rather than clinical white, and the entire palette is pulled from natural pigments — oxblood, olive, sage, buttercream — with a single unexpected electric blue for outlined actions. Typography is a single humanist serif (Signifier) at restrained sizes, paired with a widely-tracked monospace (Pitch) for micro-labels, creating a tension between book-like body text and almost architectural small caps. Layout is full-bleed and split-screen, sections are separated by generous air rather than dividers, and imagery is treated as artwork — halftone dots, oversized letterforms, and tight portrait crops that bleed edge-to-edge. The overall effect is restrained, expensive, and deliberate: nothing is decorative, everything earns its space.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Parchment Stone | `#dfe0db` | `--color-parchment-stone` | Primary page canvas — the warm stone-gray ground that replaces clinical white throughout the entire site |
| Bone White | `#eeefea` | `--color-bone-white` | Elevated card and section surface, one step lighter than the canvas |
| Pure White | `#ffffff` | `--color-pure-white` | Nav background, pill button fills, card surfaces needing maximum contrast against the stone canvas |
| Carbon | `#000000` | `--color-carbon` | Primary text, hairline borders, icon strokes — the dominant ink of the system |
| Graphite | `#3c3c3b` | `--color-graphite` | Nav text, secondary text where pure black feels too heavy |
| Ash | `#808080` | `--color-ash` | Muted body text, inactive states, dividers and borders at lower hierarchy |
| Inkstone | `#121212` | `--color-inkstone` | Deep surface for inverted sections and dark text on light cream backgrounds |
| Oxblood | `#66040c` | `--color-oxblood` | Red accent for outlined action borders, linked labels, and lightweight interactive emphasis. |
| Olive Khaki | `#9a9260` | `--color-olive-khaki` | Secondary accent for borders and subdued interactive elements where oxblood would overpower |
| Sage Stone | `#c1c19f` | `--color-sage-stone` | Earthy neutral surface for product swatches and muted backgrounds — sits between canvas and accent |
| Buttercream | `#f7dc99` | `--color-buttercream` | Soft champagne surface for the announcement bar and decorative letterform washes |
| Pale Buttercream | `#f8e9ac` | `--color-pale-buttercream` | Lightest cream tint for subtle washes and hover states on yellow surfaces |
| Cobalt Outline | `#007aff` | `--color-cobalt-outline` | Outlined action border only — the one break in the earth-tone palette, used for ghost pill buttons that need to read as interactive without filling |

## Tokens — Typography

### Signifier — Primary serif for all body text, headlines, nav links, and product names. Used at 14px for UI labels and body, 18px for reading copy and about-section paragraphs, 24px for subheadings and feature titles. The single typeface carrying the entire brand voice — its humanist warmth prevents the editorial layout from feeling cold or corporate · `--font-signifier`
- **Substitute:** GT Super, National 2, Tiempos Text, Lora
- **Weights:** 400
- **Sizes:** 14px, 18px, 24px
- **Line height:** 1.20–1.67
- **Role:** Primary serif for all body text, headlines, nav links, and product names. Used at 14px for UI labels and body, 18px for reading copy and about-section paragraphs, 24px for subheadings and feature titles. The single typeface carrying the entire brand voice — its humanist warmth prevents the editorial layout from feeling cold or corporate

### Pitch — Monospace micro-label for announcement bar text, footer notes, and editorial captions. The wide tracking (0.064em) gives it an almost architectural, typeset feel — it reads as 'this is a label, not a sentence'. Bold weight 700 for emphasis within labels · `--font-pitch`
- **Substitute:** JetBrains Mono, IBM Plex Mono, Söhne Mono
- **Weights:** 400, 700
- **Sizes:** 11px
- **Line height:** 1.60–1.70
- **Letter spacing:** 0.0640em
- **Role:** Monospace micro-label for announcement bar text, footer notes, and editorial captions. The wide tracking (0.064em) gives it an almost architectural, typeset feel — it reads as 'this is a label, not a sentence'. Bold weight 700 for emphasis within labels

### Arial — System fallback for icon glyphs and button icons only — not used for prose · `--font-arial`
- **Substitute:** system-ui sans-serif
- **Weights:** 400
- **Sizes:** 13px
- **Line height:** 1.20
- **Role:** System fallback for icon glyphs and button icons only — not used for prose

### GTStandard-M — Secondary body face appearing in isolated content blocks — same humanist register as Signifier but used for distinction in long-form passages · `--font-gtstandard-m`
- **Weights:** 400
- **Sizes:** 18px
- **Line height:** 1.50
- **Role:** Secondary body face appearing in isolated content blocks — same humanist register as Signifier but used for distinction in long-form passages

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 11px | 1.7 | 0.7px | `--text-caption` |
| body-sm | 14px | 1.67 | — | `--text-body-sm` |
| body | 18px | 1.5 | — | `--text-body` |
| subheading | 24px | 1.3 | — | `--text-subheading` |
| heading-sm | 28px | 1.2 | 0.5px | `--text-heading-sm` |
| heading | 36px | 1.15 | 0.8px | `--text-heading` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** compact

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 8 | 8px | `--spacing-8` |
| 12 | 12px | `--spacing-12` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 40 | 40px | `--spacing-40` |
| 60 | 60px | `--spacing-60` |
| 120 | 120px | `--spacing-120` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 0px |
| links | 20px |
| pills | 41px |
| buttons | 20px |

### Layout

- **Page max-width:** 1440px
- **Section gap:** 80-120px
- **Card padding:** 40px
- **Element gap:** 12px

## Components

### Announcement Bar
**Role:** Top-of-page site-wide message strip

Full-width band with Buttercream (#f7dc99) background, centered Pitch monospace at 11px with 0.064em tracking in Carbon (#000000). Right-aligned close (×) glyph. Height ~36px. No border, no shadow — sits flush against the nav below.

### Header Navigation
**Role:** Primary site navigation with centered wordmark

White (#ffffff) background, 1px Carbon (#000000) bottom border. Layout: left-aligned nav links ('Shop', 'About') at 14px Signifier; centered spaced-caps logotype 'ADVENE' at ~18px with wide tracking; right-aligned utility links ('Account', 'EUR €', 'Cart') at 14px. Nav text in Graphite (#3c3c3b). Height ~60px.

### Split Hero Panel
**Role:** Full-viewport editorial opening image

Full-bleed 50/50 split. Left and right panels each contain an edge-to-edge photograph (tight crop of model with product, or model with large decorative letterform). No padding, no gutters between panels. Images bleed to all viewport edges. The right panel may contain an oversized flat color letterform (buttercream 'A') that overlaps the photograph as a graphic layer.

### Shop CTA Pill Button
**Role:** Primary call-to-action overlaid on hero

Positioned bottom-left of hero, white (#ffffff) background, 1px Carbon (#000000) border, 41px border-radius (full pill). Text 'Shop Advene →' at 14px Signifier in Carbon. Padding 10px 24px. The 41px radius is the signature shape — more generous than standard pills, creating a 'pebble' silhouette.

### Outlined Action Button
**Role:** Secondary interactive element with chromatic border

Transparent background, 1px Cobalt Outline (#007aff) border, 20px border-radius. Text in Cobalt. The single break in the earth-tone palette — used sparingly for actions that need to feel 'switched on' without filling with color. Padding 10px 20px.

### Halftone Image Treatment
**Role:** Artistic image processing for editorial sections

Photograph converted to coarse halftone dot pattern in a single warm tone (sage or olive). Applied to a ~400px wide portrait or product image. Creates a print/risograph aesthetic that distinguishes editorial photography from product photography.

### About Section
**Role:** Brand story with image + text composition

Two-column layout: left column has a halftone-treated image (~400px wide), right column has body text in 18px Signifier at 1.5 line-height in Carbon. A small decorative 'A' monogram (olive or oxblood) and a grid/dots icon appear as ornamental elements. A 'Read more About →' link in 14px Signifier with arrow appears below the text block.

### Press List
**Role:** Media mentions and pull quote

Two-column layout. Left column: vertical list of publication names (Forbes, Vogue, Harper's Bazaar, Wallpaper*, Marie Claire) in 14px Signifier, each followed by a colon. Active/selected item (e.g. 'Wallpaper*:') in Carbon; others in Ash (#808080). Right column: pull quote in 18px Signifier with em-dash and attribution. A thin olive (#9a9260) underline marks the active publication.

### Product Feature Section
**Role:** Hero product showcase with editorial heading

Full-bleed image (left, ~50% width) of a model/product portrait with desaturated/monochrome treatment. Right column: heading in mixed roman + italic Signifier (e.g. 'The Age Bag:' in regular, 'Our Award-Winning Classic' in italic) at 28-36px. The italic+roman pairing within a single heading is a signature editorial device.

### Vertical Side Tab
**Role:** Fixed edge navigation for section discovery

Thin vertical strip on the right viewport edge, ~30px wide, containing vertically rotated text ('Discover') in Pitch monospace at 11px. Oxblood (#66040c) text on parchment background. Functions as a section anchor rather than a primary nav.

### Arrow Link
**Role:** Inline text link with directional indicator

14px Signifier text in Carbon, followed by a thin arrow glyph (→). No underline by default; underline or color shift on hover. Used for 'Read more', 'Shop Advene', and all editorial CTAs. The arrow is the system's universal 'continue reading' signal.

## Do's and Don'ts

### Do
- Set the page background to Parchment Stone (#dfe0db) — never use pure white as the base canvas; the warm gray is what makes the palette feel editorial
- Use Signifier at 18px with 1.5 line-height for all body prose; 14px is for UI labels only
- Apply the 41px pill radius to primary hero CTAs and the 20px radius to secondary outlined buttons — the two-radius system creates a clear visual hierarchy
- Pair roman and italic weights within a single heading (e.g. 'The Age Bag: / Our Award-Winning Classic') for editorial section titles
- Use Pitch at 11px with 0.064em letter-spacing for all micro-labels, captions, and the announcement bar — the monospace is what makes small text feel typeset rather than default
- Treat photographs as full-bleed edge-to-edge panels in the hero, not as contained cards with padding
- Apply the halftone dot filter to editorial/storytelling images, not to product catalog shots

### Don't
- Do not add drop shadows to cards, buttons, or nav — depth comes from surface color shifts only
- Do not use Cobalt (#007aff) as a filled background; it is an outlined-action border color only
- Do not use bold (700) weight in Signifier for body text or headlines — weight 400 with italic is the system's emphasis mechanism
- Do not introduce a second serif or sans-serif body face; the entire prose system runs on Signifier at three sizes
- Do not place product images inside rounded containers; product photography is always sharp-cornered and full-bleed
- Do not use Ash (#808080) for primary text — it is for inactive states and de-emphasized metadata only
- Do not separate sections with visible dividers or rules; rely on generous whitespace and surface color changes

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Parchment Canvas | `#dfe0db` | Base page background — the warm stone ground |
| 1 | Bone Card | `#eeefea` | First elevation above canvas, used for section panels |
| 2 | White Card | `#ffffff` | Highest elevation for nav, buttons, and product cards needing maximum contrast |
| 3 | Buttercream Wash | `#f7dc99` | Chromatic surface for announcement bar and decorative letterform overlays |

## Elevation

The design deliberately avoids drop shadows and material elevation. Depth is achieved exclusively through surface color shifts (canvas → bone → white) and generous whitespace. This flat, print-like treatment reinforces the editorial catalog metaphor — pages are printed sheets, not floating cards on glass.

## Imagery

Photography is editorial fashion-shoot quality: tight portrait crops of models holding or wearing Advene accessories, often cropped at the face or torso to keep the product as the focal point. The split-hero pairs a black-clad model holding a chartreuse bag with a white-dressed model against a neutral backdrop — high contrast between dark/light and between product color/scene. Imagery is treated as fine art: full-bleed panels that bleed to viewport edges, halftone dot processing on storytelling images (about section), and occasional desaturated/monochrome treatment on product feature sections. A large flat-color letterform (the 'A' monogram in buttercream) acts as a graphic overlay, blending product photography with print design. No icons in the conventional sense — all small glyphs are thin-line and monochrome.

## Layout

Full-bleed page model with no centered max-width container constraining the hero. The hero is a 50/50 split-screen occupying the full viewport height, with edge-to-edge photography on both halves. Below the hero, sections follow a two-column text+image pattern, each column occupying roughly 40-50% of the viewport width with generous gutters. The about section uses left-image/right-text; the press section uses left-list/right-quote. Section transitions are seamless — no visible dividers, just surface color shifts from Parchment Stone to Bone White, or generous vertical air (80-120px). Navigation is a thin top bar (white background, 1px bottom border) with a centered spaced-caps wordmark. A vertical side tab on the right edge provides section anchoring. The overall rhythm is slow and generous — sections breathe with 80-120px vertical gaps, and content columns never feel cramped.

## Agent Prompt Guide

## Quick Color Reference
- Canvas: #dfe0db (Parchment Stone)
- Surface: #eeefea (Bone White)
- Text: #000000 (Carbon)
- Border: #000000 (Carbon) at 1px
- Brand accent: #66040c (Oxblood) for links and critical accents
- primary action: #007aff (outlined action border)

## Example Component Prompts

1. **Split Hero Panel**: Full-viewport height, 50/50 split. Left panel: edge-to-edge photograph of model in black holding chartreuse handbag. Right panel: edge-to-edge photograph of model in white dress with oversized buttercream (#f7dc99) 'A' letterform overlaid as a flat graphic. Bottom-left of left panel: white pill button, 41px radius, 1px Carbon border, 10px 24px padding, text 'Shop Advene →' in 14px Signifier #000000.

2. **Announcement Bar**: Full-width strip, ~36px height, background #f7dc99. Centered text 'Free shipping worldwide from New York' in Pitch 11px, letter-spacing 0.7px, color #000000. Right-aligned × close glyph in Carbon.

3. **Press List Section**: Two-column layout, Parchment canvas background. Left column: vertical list of publication names in 14px Signifier — 'Forbes:', 'Vogue:', 'Harper's Bazaar:', 'Wallpaper*:', 'Marie Claire:' — with 'Wallpaper*:' active in Carbon, others in #808080 Ash. Each name followed by a thin #9a9260 underline for the active item. Right column: pull quote in 18px Signifier Carbon, with em-dash and italicized attribution.

4. **Product Feature Heading**: 28px Signifier, left-aligned, color Carbon. Set 'The Age Bag:' in roman weight 400, then 'Our Award-Winning Classic' in italic weight 400 on the next line. 36px vertical space below heading before body content.

5. **About Section with Halftone Image**: Left column ~400px wide: portrait photograph processed with coarse halftone dot pattern in olive (#9a9260) tone, sharp corners, no border. Right column: body text in 18px Signifier Carbon, line-height 1.5, max-width ~520px. Below text: 'Read more About →' link in 14px Signifier Carbon with arrow glyph. 60px vertical gap above and below the section.

## Shape Language

The system operates on exactly two radius values: 20px for secondary buttons and links, and 41px for primary hero CTAs. The 41px pill is a signature shape — it's more generous than a standard 9999px stadium pill, creating a distinct 'pebble' silhouette that reads as handcrafted rather than utility. Cards and images are always sharp-cornered (0px radius). There are no rounded containers in the system — the pill is the only rounded element. This binary shape system (pill vs. sharp) creates a clear visual distinction between interactive elements and content.

## Diagonal Split Gradient

A distinctive 45-degree hard-edge gradient (not a smooth blend) appears on decorative dividers: `linear-gradient(45deg, [warm tone] 0%, [warm tone] 49%, [contrast] 50%, [contrast] 100%)`. The hard 50% split with no transition zone is a print/editorial device — it mimics a torn edge or a color-block layout in a magazine spread. Use warm-to-black for dark mode dividers, warm-to-white for light mode. Never use smooth gradient transitions.

## Similar Brands

- **The Row** — Same editorial-catalog treatment: warm neutral palette, serif-only typography, full-bleed photography, and an almost complete absence of UI chrome — the products and art direction do all the work
- **Aesop** — Same earthy, muted color palette with unexpected chromatic accents, generous whitespace between sections, and a restrained approach to UI elements that feels more like a design publication than a store
- **Toteme** — Same split-screen hero composition with edge-to-edge photography, centered wordmark navigation, and a single serif typeface carrying the entire brand voice
- **Bottega Veneta** — Same luxury restraint: warm neutral canvas, pill-shaped outlined CTAs, oversized decorative typography elements, and a palette drawn entirely from natural pigments with no neon or synthetic hues
- **Maison Margiela** — Same print-catalog aesthetic with monospace micro-labels, editorial section headings mixing roman and italic, and a design that prioritizes art direction over e-commerce conventions

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-parchment-stone: #dfe0db;
  --color-bone-white: #eeefea;
  --color-pure-white: #ffffff;
  --color-carbon: #000000;
  --color-graphite: #3c3c3b;
  --color-ash: #808080;
  --color-inkstone: #121212;
  --color-oxblood: #66040c;
  --color-olive-khaki: #9a9260;
  --color-sage-stone: #c1c19f;
  --color-buttercream: #f7dc99;
  --color-pale-buttercream: #f8e9ac;
  --color-cobalt-outline: #007aff;

  /* Typography — Font Families */
  --font-signifier: 'Signifier', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-pitch: 'Pitch', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-gtstandard-m: 'GTStandard-M', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.7;
  --tracking-caption: 0.7px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.67;
  --text-body: 18px;
  --leading-body: 1.5;
  --text-subheading: 24px;
  --leading-subheading: 1.3;
  --text-heading-sm: 28px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: 0.5px;
  --text-heading: 36px;
  --leading-heading: 1.15;
  --tracking-heading: 0.8px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-40: 40px;
  --spacing-60: 60px;
  --spacing-120: 120px;

  /* Layout */
  --page-max-width: 1440px;
  --section-gap: 80-120px;
  --card-padding: 40px;
  --element-gap: 12px;

  /* Border Radius */
  --radius-2xl: 20px;
  --radius-3xl: 41px;

  /* Named Radii */
  --radius-cards: 0px;
  --radius-links: 20px;
  --radius-pills: 41px;
  --radius-buttons: 20px;

  /* Surfaces */
  --surface-parchment-canvas: #dfe0db;
  --surface-bone-card: #eeefea;
  --surface-white-card: #ffffff;
  --surface-buttercream-wash: #f7dc99;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-parchment-stone: #dfe0db;
  --color-bone-white: #eeefea;
  --color-pure-white: #ffffff;
  --color-carbon: #000000;
  --color-graphite: #3c3c3b;
  --color-ash: #808080;
  --color-inkstone: #121212;
  --color-oxblood: #66040c;
  --color-olive-khaki: #9a9260;
  --color-sage-stone: #c1c19f;
  --color-buttercream: #f7dc99;
  --color-pale-buttercream: #f8e9ac;
  --color-cobalt-outline: #007aff;

  /* Typography */
  --font-signifier: 'Signifier', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-pitch: 'Pitch', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-gtstandard-m: 'GTStandard-M', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.7;
  --tracking-caption: 0.7px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.67;
  --text-body: 18px;
  --leading-body: 1.5;
  --text-subheading: 24px;
  --leading-subheading: 1.3;
  --text-heading-sm: 28px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: 0.5px;
  --text-heading: 36px;
  --leading-heading: 1.15;
  --tracking-heading: 0.8px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-40: 40px;
  --spacing-60: 60px;
  --spacing-120: 120px;

  /* Border Radius */
  --radius-2xl: 20px;
  --radius-3xl: 41px;
}
```
