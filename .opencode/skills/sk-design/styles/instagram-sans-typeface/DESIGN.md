# Instagram Sans Typeface — Style Reference
> Living type museum. Oversized black letterforms on slabs of neon, displayed like sculpture in a white room.

**Theme:** mixed

Instagram's brand/type page treats the custom Instagram Sans typeface as a physical specimen on display, not as interface chrome. The visual system alternates between two modes: full-bleed solid color panels (hot magenta and lavender) where oversized black letterforms act as both content and hero artwork, and white gallery-style text blocks with warm near-black type at comfortable sizes. The Instagram brand gradient — signal pink through plasma magenta into ultraviolet — appears once or twice as the sole decorative mark, never as a background wash. Everything breathes: 51px lateral gutters, 48–64px vertical section padding, and a 4px base unit enforce generous spacing. The design language is confident, editorial, and monochromatic where it isn't loud — color is deployed as full-bleed band, never as tint or wash.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Signal Pink | `#ff0169` | `--color-signal-pink` | Gradient origin — Instagram brand gradient start point, the chromatic anchor in the system |
| Plasma Magenta | `#d300c5` | `--color-plasma-magenta` | Gradient midpoint — bridges hot pink into ultraviolet, used in the brand gradient only |
| Ultraviolet | `#7638fa` | `--color-ultraviolet` | Gradient terminus — deep violet end of the Instagram brand gradient, the cool counterweight |
| Hot Magenta | `#f689ff` | `--color-hot-magenta` | Full-bleed color panel — left half of the hero split, the loudest single surface in the system |
| Lavender Mist | `#c4a4f7` | `--color-lavender-mist` | Full-bleed accent band — right half of the hero split and secondary color sections, softens the magenta |
| Graphite | `#1c1e21` | `--color-graphite` | Body text, button borders, list dividers, nav borders — the primary near-black for all text and hairline rules |
| Pure Black | `#000000` | `--color-pure-black` | Specimen letterforms, Instagram camera icon outlines, high-contrast graphic moments — flat black with no warmth |
| Paper White | `#ffffff` | `--color-paper-white` | Content canvas, text on color panels, button text, input backgrounds — the neutral ground that lets color panels pop |
| Hairline Gray | `#cccccc` | `--color-hairline-gray` | Subtle button borders and disabled-state rules |
| Link Indigo | `#385898` | `--color-link-indigo` | Violet accent for outlined action borders, linked labels, and lightweight interactive emphasis. Do not promote it to the primary CTA color |

## Tokens — Typography

### Instagram Sans — The brand's custom geometric sans. Used for everything from 12px captions to 389px specimen hero letterforms. Single weight 400 across the entire scale — the typeface achieves personality through geometry and tight negative tracking rather than weight contrast. Letter-spacing tightens as size grows: -0.02em at body, -0.03em at 32–46px, -0.035em at 62px and above. · `--font-instagram-sans`
- **Substitute:** DM Sans, Inter, or Nunito Sans
- **Weights:** 400
- **Sizes:** 12px, 16px, 24px, 32px, 40px, 46px, 62px, 72px, 121px, 205px, 224px, 389px
- **Line height:** 1.00, 1.05, 1.20, 1.34
- **Letter spacing:** -0.02em at 16px → -0.03em at 32–46px → -0.035em at 62px+
- **Role:** The brand's custom geometric sans. Used for everything from 12px captions to 389px specimen hero letterforms. Single weight 400 across the entire scale — the typeface achieves personality through geometry and tight negative tracking rather than weight contrast. Letter-spacing tightens as size grows: -0.02em at body, -0.03em at 32–46px, -0.035em at 62px and above.

### Instagram Sans Headline — Distinct variant for the 468px mega-specimen display — looser tracking (-0.006em) than the base family because at 468px the tight tracking would close letter apertures. Used only for the largest type specimen on the page. · `--font-instagram-sans-headline`
- **Substitute:** DM Sans Display or Inter Display
- **Weights:** 400
- **Sizes:** 468px
- **Line height:** 1.00
- **Letter spacing:** -0.006em at 468px
- **Role:** Distinct variant for the 468px mega-specimen display — looser tracking (-0.006em) than the base family because at 468px the tight tracking would close letter apertures. Used only for the largest type specimen on the page.

### Helvetica — System fallback appearing at 12px (likely OS-rendered small text) and 224px (possible secondary specimen). Treat as fallback only — Instagram Sans is the intended primary at all sizes. · `--font-helvetica`
- **Substitute:** Arial, Helvetica Neue
- **Weights:** 400
- **Sizes:** 12px, 224px
- **Line height:** 1.20, 1.34
- **Role:** System fallback appearing at 12px (likely OS-rendered small text) and 224px (possible secondary specimen). Treat as fallback only — Instagram Sans is the intended primary at all sizes.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.34 | — | `--text-caption` |
| body | 16px | 1.34 | -0.32px | `--text-body` |
| subheading | 24px | 1.2 | -0.48px | `--text-subheading` |
| heading-sm | 32px | 1.2 | -0.96px | `--text-heading-sm` |
| heading | 40px | 1.2 | -1.2px | `--text-heading` |
| display | 62px | 1.05 | -2.17px | `--text-display` |
| display-lg | 72px | 1.05 | -2.52px | `--text-display-lg` |
| display-xl | 121px | 1.05 | -4.24px | `--text-display-xl` |
| specimen | 224px | 1 | -7.84px | `--text-specimen` |
| specimen-mega | 389px | 1 | -13.62px | `--text-specimen-mega` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** spacious

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 8 | 8px | `--spacing-8` |
| 16 | 16px | `--spacing-16` |
| 24 | 24px | `--spacing-24` |
| 48 | 48px | `--spacing-48` |
| 64 | 64px | `--spacing-64` |
| 88 | 88px | `--spacing-88` |
| 104 | 104px | `--spacing-104` |
| 160 | 160px | `--spacing-160` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 16px |
| buttons | 3px |
| specimen-panels | 0px |

### Layout

- **Section gap:** 64px
- **Card padding:** 24px
- **Element gap:** 24px

## Components

### Hero Split Panel
**Role:** Full-bleed 50/50 split, left panel Hot Magenta (#f689ff), right panel Lavender Mist (#c4a4f7), no border, no radius

The opening section is two full-viewport-height color blocks side by side. Left panel carries a large white specimen headline (62–72px Instagram Sans). Right panel carries a 389px black glyph specimen with pink construction-line overlays. No padding constraints — type sits at the panel edges with 51px L/R breathing room from viewport edges. The split is the hero; there is no nav bar above it.

### Glyph Specimen with Construction Overlay
**Role:** Oversized black letterform on color ground, overlaid with Bézier curve construction lines in Hot Magenta

A 224–389px black Instagram Sans glyph sits on the Lavender Mist or Hot Magenta panel. Overlaid are pink circles (anchor points) connected by thin pink lines (Bézier handles) — the typeface's design geometry made visible. The glyph is the visual; the construction lines are annotation. No border or radius on the specimen itself.

### White Content Section
**Role:** Body text block on white canvas between color panels

White (#ffffff) background with Graphite (#1c1e21) body text at 16px/1.34. 51px paddingLeft and paddingRight from viewport edges. 48px paddingTop and paddingBottom creating generous air. The Instagram gradient camera logo anchors the top-right corner. These sections are the quiet connective tissue between loud specimen panels.

### Lavender Accent Band
**Role:** Full-bleed Lavender Mist section carrying a large black icon

Secondary color panel using Lavender Mist (#c4a4f7) as background, carrying a centered or left-aligned oversized black Instagram camera icon (200px+ range, Pure Black, no fill). Functions as visual punctuation between white content sections — never the dominant surface, always the accent.

### Instagram Gradient Camera Logo
**Role:** Brand mark in top-right of white content sections

The Instagram camera glyph rendered with the brand gradient (Signal Pink → Plasma Magenta → Ultraviolet) at 72.44deg. Small, functional, never decorative. Appears as a single placement anchor per white content section.

### Text Link
**Role:** Inline link within body copy

Link Indigo (#385898) text, 1px solid Link Indigo border-bottom, 16px Instagram Sans weight 400. The 1px underline is the primary affordance — the color reinforces. No background fill, no pill shape.

### Download/Action Button (outlined)
**Role:** Secondary action — downloading the typeface, viewing glyphs

Transparent or white background, 1px solid Graphite (#1c1e21) border, 3px border-radius, 16px 24px padding, Graphite text at 16px Instagram Sans. Weight 400, no fill. The system uses outlined buttons as its primary action shape — never a filled solid-color button.

### Section Label
**Role:** Small all-caps or sentence-case label above a section

12px Instagram Sans weight 400, Graphite or white depending on ground. Used sparingly to mark transitions between color bands and content blocks. May include a small downward arrow (↓) glyph as a scroll affordance.

## Do's and Don'ts

### Do
- Use Instagram Sans at 400 weight only — the typeface has no weight variants, so do not fake bold or light with CSS
- Apply 51px paddingLeft and paddingRight on all content sections to match the lateral breathing room of the specimen panels
- Tighten letter-spacing as type grows: -0.02em at 16px, -0.03em at 32–46px, -0.035em at 62px and above
- Use the Instagram brand gradient only as a full asset (the camera logo) or as a 72.44deg linear gradient — never rotate, never recolor, never reverse the stop order
- Render specimen letterforms in Pure Black (#000000) with 0px radius — the sharp edges of the glyph geometry are the point
- Place oversized construction-line overlays (pink circles + lines) on glyph specimens to reveal typeface design intent
- Alternate full-bleed color bands (Hot Magenta, Lavender Mist) with white content sections to create editorial rhythm

### Don't
- Do not use filled solid-color CTA buttons — the system expresses action through outlined Ghost buttons with Graphite borders
- Do not apply the brand gradient as a background wash, overlay, or card fill — it is reserved for the camera logo and the single signature gradient instance
- Do not use #385898 (Link Indigo) for buttons, fills, or large surface areas — it is a text-link color only
- Do not use font-weight 600+ or italic in Instagram Sans — the family ships weight 400 only
- Do not add drop shadows to specimen letterforms, cards, or panels — the system is flat, shadowless, and relies on scale contrast
- Do not use the Hot Magenta (#f689ff) as a text or small-icon color — it is a full-bleed surface panel color only
- Do not introduce additional typefaces — Helvetica appears only as a system fallback, never as an intentional design choice

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Paper White | `#ffffff` | Primary content canvas — body text, inline specimen captions, white-space ground between color panels |
| 1 | Lavender Mist | `#c4a4f7` | Full-bleed accent band — carries black icon specimens, second-most prominent color surface |
| 2 | Hot Magenta | `#f689ff` | Hero color panel — the loudest surface, occupies the left half of the opening split |
| 3 | Graphite | `#1c1e21` | Text and rule surface — appears as text color and border color, not a fill surface |
| 4 | Pure Black | `#000000` | Specimen and icon surface — large black letterforms and camera icon occupy their own visual plane |

## Elevation

The system is intentionally flat. No drop shadows, no elevation, no z-axis depth. Visual hierarchy is created through scale contrast (389px specimens next to 16px body text), color contrast (Hot Magenta next to Paper White), and lateral breathing room (51px gutters). Depth is implied by typographic scale, not by box-shadow stacks.

## Imagery

No photography, no illustration, no product renders. The visual content IS typography — oversized Instagram Sans letterforms rendered as flat black shapes on solid color panels. The only 'imagery' beyond type is the Instagram gradient camera logo (a brand mark, not a photo) and the pink Bézier construction lines overlaid on glyph specimens, which are technical annotations rather than decorative graphics. The aesthetic is a type foundry specimen page: the letterform is the hero, the construction grid reveals its geometry, and white space frames both.

## Layout

Full-bleed sections with no max-width container — the viewport edge is the design edge. The page rhythm alternates between two section types: (1) full-bleed color panels (Hot Magenta left / Lavender Mist right in a 50/50 split, or single-color Lavender Mist bands) carrying oversized black glyph specimens with construction-line overlays, and (2) white content sections with 51px lateral padding, Graphite body text at comfortable sizes, and the Instagram gradient logo anchored top-right. There is no persistent nav bar above the hero — navigation is minimal and the hero IS the first screen. Section vertical rhythm is 48px internal padding and ~64px between major section types. The page reads top-to-bottom as: hero split → white text block → lavender band → white text block → lavender band → type specimen gallery.

## Agent Prompt Guide

**Quick Color Reference**
- text: #1c1e21
- background: #ffffff
- color panel surface: #f689ff (left) / #c4a4f7 (right)
- border: #1c1e21
- accent: brand gradient (#ff0169 → #d300c5 → #7638fa at 72.44deg)
- link: #385898
- primary action: #385898 (outlined action border)

**Example Component Prompts**
1. *Create a hero split panel*: Left half background #f689ff, right half background #c4a4f7, full-bleed (no max-width). Left side: white Instagram Sans weight 400 at 62px, letter-spacing -2.17px, line-height 1.05, text 'Hello Instagram Sans'. Right side: a single black Instagram Sans glyph at 389px, letter-spacing -13.62px, line-height 1.00, overlaid with 1px solid #f689ff construction lines connecting pink circle anchor points.
2. *Create a white content section*: Background #ffffff, padding 48px 51px. Body text in Instagram Sans weight 400 at 16px, line-height 1.34, letter-spacing -0.32px, color #1c1e21. Instagram gradient camera logo (72.44deg, #ff0169 → #d300c5 → #7638fa) anchored top-right at 48px size.
3. *Create an outlined download button*: Background transparent, border 1px solid #1c1e21, border-radius 3px, padding 16px 24px, text 'Download' in Instagram Sans weight 400 at 16px, color #1c1e21.
4. *Create a lavender accent band*: Full-bleed background #c4a4f7, padding 48px 51px, centered Pure Black (#000000) Instagram camera icon outline at 200px, no fill, 0px radius.
5. *Create a text link*: 16px Instagram Sans weight 400, color #385898, border-bottom 1px solid #385898, no background, inline within body text.

## Similar Brands

- **Klim Type Foundry** — Specimen-page typographic showcase with oversized glyph displays, construction-line annotations, and white gallery space — same 'type as art object' approach
- **Spotify Brand Guidelines** — Gradient brand mark as the sole chromatic anchor against stark white documentation pages with generous spacing
- **Apple AirPods Pro product pages** — Full-bleed solid color panel sections alternating with white product detail blocks — the banded color rhythm
- **Notion Brand page** — Custom typeface presentation with split-screen color panels and oversized letterform specimens as the hero content

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-signal-pink: #ff0169;
  --color-plasma-magenta: #d300c5;
  --color-ultraviolet: #7638fa;
  --color-hot-magenta: #f689ff;
  --color-lavender-mist: #c4a4f7;
  --color-graphite: #1c1e21;
  --color-pure-black: #000000;
  --color-paper-white: #ffffff;
  --color-hairline-gray: #cccccc;
  --color-link-indigo: #385898;

  /* Typography — Font Families */
  --font-instagram-sans: 'Instagram Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-instagram-sans-headline: 'Instagram Sans Headline', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-helvetica: 'Helvetica', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.34;
  --text-body: 16px;
  --leading-body: 1.34;
  --tracking-body: -0.32px;
  --text-subheading: 24px;
  --leading-subheading: 1.2;
  --tracking-subheading: -0.48px;
  --text-heading-sm: 32px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -0.96px;
  --text-heading: 40px;
  --leading-heading: 1.2;
  --tracking-heading: -1.2px;
  --text-display: 62px;
  --leading-display: 1.05;
  --tracking-display: -2.17px;
  --text-display-lg: 72px;
  --leading-display-lg: 1.05;
  --tracking-display-lg: -2.52px;
  --text-display-xl: 121px;
  --leading-display-xl: 1.05;
  --tracking-display-xl: -4.24px;
  --text-specimen: 224px;
  --leading-specimen: 1;
  --tracking-specimen: -7.84px;
  --text-specimen-mega: 389px;
  --leading-specimen-mega: 1;
  --tracking-specimen-mega: -13.62px;

  /* Typography — Weights */
  --font-weight-regular: 400;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-88: 88px;
  --spacing-104: 104px;
  --spacing-160: 160px;

  /* Layout */
  --section-gap: 64px;
  --card-padding: 24px;
  --element-gap: 24px;

  /* Border Radius */
  --radius-sm: 3px;
  --radius-2xl: 16px;
  --radius-3xl: 36.3636px;

  /* Named Radii */
  --radius-cards: 16px;
  --radius-buttons: 3px;
  --radius-specimen-panels: 0px;

  /* Surfaces */
  --surface-paper-white: #ffffff;
  --surface-lavender-mist: #c4a4f7;
  --surface-hot-magenta: #f689ff;
  --surface-graphite: #1c1e21;
  --surface-pure-black: #000000;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-signal-pink: #ff0169;
  --color-plasma-magenta: #d300c5;
  --color-ultraviolet: #7638fa;
  --color-hot-magenta: #f689ff;
  --color-lavender-mist: #c4a4f7;
  --color-graphite: #1c1e21;
  --color-pure-black: #000000;
  --color-paper-white: #ffffff;
  --color-hairline-gray: #cccccc;
  --color-link-indigo: #385898;

  /* Typography */
  --font-instagram-sans: 'Instagram Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-instagram-sans-headline: 'Instagram Sans Headline', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-helvetica: 'Helvetica', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.34;
  --text-body: 16px;
  --leading-body: 1.34;
  --tracking-body: -0.32px;
  --text-subheading: 24px;
  --leading-subheading: 1.2;
  --tracking-subheading: -0.48px;
  --text-heading-sm: 32px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -0.96px;
  --text-heading: 40px;
  --leading-heading: 1.2;
  --tracking-heading: -1.2px;
  --text-display: 62px;
  --leading-display: 1.05;
  --tracking-display: -2.17px;
  --text-display-lg: 72px;
  --leading-display-lg: 1.05;
  --tracking-display-lg: -2.52px;
  --text-display-xl: 121px;
  --leading-display-xl: 1.05;
  --tracking-display-xl: -4.24px;
  --text-specimen: 224px;
  --leading-specimen: 1;
  --tracking-specimen: -7.84px;
  --text-specimen-mega: 389px;
  --leading-specimen-mega: 1;
  --tracking-specimen-mega: -13.62px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-88: 88px;
  --spacing-104: 104px;
  --spacing-160: 160px;

  /* Border Radius */
  --radius-sm: 3px;
  --radius-2xl: 16px;
  --radius-3xl: 36.3636px;
}
```
