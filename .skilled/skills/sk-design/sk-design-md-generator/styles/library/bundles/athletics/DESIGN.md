# Athletics — Style Reference
> monograph on black velvet

**Theme:** dark

Athletics operates as a gallery-grade creative studio: the entire experience sits on a dark canvas, letting enormous light-weight serif display type breathe against deep charcoal and pure black. The system is ruthlessly monochromatic — zero chromatic color across the interface, with warmth and saturation living exclusively inside editorial photography and the brand mark. Typography does the heavy lifting: a high-contrast pairing of a delicate serif display (Feature Deck at 300 weight, 72–116px) against a quiet grotesque (Söhne at 300/400 for everything functional). The layout is full-bleed, generous, and editorial — wide section gaps of 128–144px, asymmetric two-column blocks, and a vertical service index annotated with A/B/C/D letter labels that evoke a printed specimen sheet. Components are minimal: pill-shaped tags, hairline borders, no shadows, no gradients, no elevation. It reads as confident, restrained, and considered — the design equivalent of a well-typeset monograph.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Obsidian | `#000000` | `--color-obsidian` | Page canvas, deepest section backgrounds, hairline borders on text |
| Charcoal | `#1d1d1d` | `--color-charcoal` | Elevated section surfaces, card backgrounds, input fields — the middle layer between pure black and white |
| Paper White | `#ffffff` | `--color-paper-white` | Primary display and body text on dark surfaces, default borders, icon strokes, form controls |
| Ash | `#d6d5d0` | `--color-ash` | Hairline borders, dividers, input outlines, and card edges on light surfaces. |

## Tokens — Typography

### Feature Deck — Display and heading type — used exclusively for the largest editorial moments: hero headline, section openers, and the service index. The 300 weight (light/thin) with tight negative tracking is the signature move: most display serifs default to 400–700, so the whisper-weight conveys authority through restraint rather than volume. Letter-spacing tightens from -0.009em at 82px to -0.018em at 116px. · `--font-feature-deck`
- **Substitute:** GT Sectra Display Light, Canela, Domaine Display Thin
- **Weights:** 300
- **Sizes:** 72px, 82px, 116px
- **Line height:** 1.05–1.10
- **Letter spacing:** -0.0090em at 82px, -0.0180em at 116px
- **Role:** Display and heading type — used exclusively for the largest editorial moments: hero headline, section openers, and the service index. The 300 weight (light/thin) with tight negative tracking is the signature move: most display serifs default to 400–700, so the whisper-weight conveys authority through restraint rather than volume. Letter-spacing tightens from -0.009em at 82px to -0.018em at 116px.

### Söhne — All functional and body type — navigation, links, body copy, list items, input fields, buttons, footer. Weight 300 for secondary labels and 400 for body. A neo-grotesque with humanist warmth that stays invisible so the serif can speak. · `--font-shne`
- **Substitute:** Inter, Neue Haas Grotesk, Untitled Sans
- **Weights:** 300, 400
- **Sizes:** 16px, 17px, 22px
- **Line height:** 1.30–1.50
- **Role:** All functional and body type — navigation, links, body copy, list items, input fields, buttons, footer. Weight 300 for secondary labels and 400 for body. A neo-grotesque with humanist warmth that stays invisible so the serif can speak.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| body-sm | 16px | 1.5 | — | `--text-body-sm` |
| subheading | 22px | 1.3 | — | `--text-subheading` |
| heading | 72px | 1.1 | -0.65px | `--text-heading` |
| heading-lg | 82px | 1.05 | -0.74px | `--text-heading-lg` |
| display | 116px | 1.05 | -2.09px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 8px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 16 | 16px | `--spacing-16` |
| 24 | 24px | `--spacing-24` |
| 32 | 32px | `--spacing-32` |
| 48 | 48px | `--spacing-48` |
| 64 | 64px | `--spacing-64` |
| 128 | 128px | `--spacing-128` |
| 144 | 144px | `--spacing-144` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 9999px |
| cards | 8px |
| buttons | 9999px |

### Layout

- **Page max-width:** 1440px
- **Section gap:** 128-144px
- **Card padding:** 24px
- **Element gap:** 24-32px

## Components

### Top Navigation Bar
**Role:** Site-wide navigation

Transparent or black background, no visible border or shadow. Wordmark 'Athletics' at far left in 16px Söhne 400 white. Right-aligned nav links ('Work', 'About', 'Approach', 'Careers', 'Contact') in 16px Söhne 400 white with 16px column gap. No background fill, no border, no underline — links are identified by position and tracking alone.

### Hero Mark + Display Headline
**Role:** Opening brand statement

Centered layout on #000000. A large editorial mark (the 'A' logogram filled with a photographic image) sits above a 116px Feature Deck 300 headline in white, letter-spacing -0.018em. The image-fill inside the mark is the only source of chromatic color on the page — typically a moody, red-tinted editorial photograph cropped to the letterform.

### Section Opener (Two-Column)
**Role:** Editorial section introduction

Charcoal (#1d1d1d) background. Left column: small uppercase Söhne 400 white label (e.g. 'What we do') above a 72px Feature Deck 300 white headline. Right column: body copy in 17px Söhne 400 white, max-width ~480px, generous line-height 1.5. Large vertical gap (128–144px) between label/headline and body.

### Specialty Tag (Pill)
**Role:** Category label for services

Pill shape, 9999px border-radius. White background (#ffffff), black text (#000000) in 16px Söhne 400. Minimal padding ~8px 16px. No border, no shadow. Functions as a quiet chip floating on the dark surface.

### Service Index List
**Role:** Vertical enumeration of capabilities

Stacked list of service names in 82px Feature Deck 300 white, each line at 1.05 line-height creating near-touching rows. A single uppercase letter (A, B, C, D) in 16px Söhne 400 white sits flush-left as an index marker, vertically aligned to each entry. No dividers, no bullets — the letter is the only annotation.

### Hairline Divider
**Role:** Structural separation

1px solid #d6d5d0 line. Used sparingly to mark zone transitions (e.g. between 'Our specialties' and 'How we do it' sections). The warm off-white tone distinguishes structural borders from text-white (#ffffff) — subtle but critical for visual hierarchy.

### Pill Button
**Role:** Interactive action

9999px border-radius, white background (#ffffff), black text (#000000) in 16px Söhne 400. Padding 12px 24px. No border, no shadow. The pill geometry is the only interactive shape in the system — everything else is rectangular or borderless.

### Form Input
**Role:** Text entry field

Transparent or #1d1d1d background on dark sections. Bottom border only, 1px #d6d5d0. White placeholder text, white input text in 16px Söhne 400. No box, no fill — the underline is the affordance.

## Do's and Don'ts

### Do
- Use #000000 as the base canvas and #1d1d1d for elevated section bands — never invert to a light theme.
- Set display headlines at 72–116px in Feature Deck 300 with -0.009em to -0.018em letter-spacing; this negative tracking is non-negotiable for the editorial feel.
- Use 9999px radius exclusively for tags and buttons; use 8px only for rectangular cards or image containers.
- Apply 128–144px vertical padding for major section breaks; this generous air is what makes the system feel considered rather than dense.
- Annotate lists with uppercase single letters (A, B, C, D) flush-left in Söhne 400 when the list functions as a specimen or index.
- Restrict all chromatic color to inside the brand mark or editorial photography; the interface itself must remain pure monochrome.
- Pair large serif Feature Deck headlines with small uppercase Söhne 400 labels above them — the size contrast (116px vs 16px) is the primary hierarchy signal.

### Don't
- Do not introduce any chromatic interface color — no blues, greens, reds, or warm tints in UI elements. Color belongs only in imagery.
- Do not use Feature Deck (the serif) for body copy, navigation, or functional text; it is display-only at 72px+.
- Do not apply box-shadows or drop-shadows to any element; the system uses flat surfaces and hairline borders for all separation.
- Do not set display headlines at weight 400 or above in the serif — the light/thin weight is the signature; heavier weights break the whisper-quiet authority.
- Do not use gradients, glows, or colored backgrounds behind text blocks; sections are always flat #000000 or #1d1d1d.
- Do not use #d6d5d0 for text — it is a border/divider color with insufficient contrast for reading; use #ffffff for all readable text.
- Do not add background fills to navigation or header areas; the top bar is always transparent against the dark canvas.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Obsidian Canvas | `#000000` | Base page background, hero sections, footer |
| 2 | Charcoal Surface | `#1d1d1d` | Alternate section bands, content blocks, elevated cards, input fields |
| 3 | Hairline Layer | `#d6d5d0` | Structural borders and dividers separating content zones |

## Elevation

The system intentionally avoids shadows and elevation effects entirely. All surface separation is achieved through flat color shifts (#000000 → #1d1d1d) and hairline #d6d5d0 borders. This creates a print-like, two-dimensional quality where the only 'depth' is typographic — the massive serif headlines appear to float forward simply because nothing else competes for attention.

## Imagery

The visual system is photography-led but extremely restrained. The brand mark (a large 'A' logogram) is filled with a tightly cropped, red/magenta-tinted editorial photograph — typically a detail shot of an object (sunglasses, a product, a face fragment) — that bleeds to the edges of the letterform. This is the only place saturated color appears, and it functions as a signature device. Elsewhere, photography is large-scale, full-bleed, and treated with moody, low-key lighting. No decorative illustration, no abstract graphics, no icons beyond minimal text-based markers. The page is overwhelmingly text-dominant: imagery is reserved for hero moments and project case studies, never used as decoration between sections.

## Layout

Full-bleed dark layout with no visible page container. The hero is a centered stack: brand mark above oversized headline, with maximum vertical breathing room. Section rhythm alternates between two patterns: (1) two-column editorial blocks with a small label + large serif headline on the left and constrained-width body copy on the right, separated by 128–144px vertical gaps; (2) full-width single-column displays like the service index, where massive serif text fills the viewport width. Navigation is a minimal top bar — wordmark left, five text links right, no background or border. Content density is extremely low: each section is given the full viewport or more, and the design relies on negative space and type scale contrast rather than grids or card stacks. The A/B/C/D letter annotations on the service list function as a navigational device, evoking a printed table of contents.

## Agent Prompt Guide

**Quick Color Reference**
- text: #ffffff
- background: #000000
- elevated surface: #1d1d1d
- border: #d6d5d0
- accent: none observed
- primary action: no distinct CTA color

**Example Component Prompts**

No distinct primary action color was observed; use the extracted neutral button treatments instead of inventing a filled CTA color.

2. **Two-Column Section Opener**: Background #1d1d1d. Left column at 60% width: small uppercase label 'What we do' at 16px Söhne 400 #ffffff, then headline at 72px Feature Deck 300 #ffffff, letter-spacing -0.65px. Right column at 35% width: body copy at 17px Söhne 400 #ffffff, line-height 1.5, max-width 480px. 144px padding-top and padding-bottom.

3. **Service Index List**: Background #000000. Four stacked rows. Each row: single uppercase letter (A, B, C, D) at 16px Söhne 400 #ffffff flush-left, then service name at 82px Feature Deck 300 #ffffff, letter-spacing -0.74px, line-height 1.05. 64px row gap between entries.

4. **Specialty Tag**: White (#ffffff) pill, 9999px radius, padding 8px 16px. Text inside: 16px Söhne 400 #000000. Floats on a #1d1d1d surface. No border, no shadow.

5. **Pill Button**: 9999px border-radius, #ffffff background, 16px Söhne 400 #000000 text, padding 12px 24px. No border, no hover state with color change — keep it monochrome and flat.

## Similar Brands

- **Pentagram** — Same dark-canvas editorial approach with oversized serif display type and zero chromatic interface color — both treat the page as a printed specimen sheet.
- **Collins** — Identical pairing of light-weight serif headlines against a monochrome dark background, with generous section gaps and asymmetric two-column text blocks.
- **Mucca** — Same restrained monochromatic palette, massive serif typography at thin weight, and the typographic confidence that comes from doing almost nothing visually.
- **Order Design** — Shares the hairline-border approach to section separation, warm off-white divider tone, and the 'monograph on black' editorial atmosphere.

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-obsidian: #000000;
  --color-charcoal: #1d1d1d;
  --color-paper-white: #ffffff;
  --color-ash: #d6d5d0;

  /* Typography — Font Families */
  --font-feature-deck: 'Feature Deck', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-shne: 'Söhne', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-body-sm: 16px;
  --leading-body-sm: 1.5;
  --text-subheading: 22px;
  --leading-subheading: 1.3;
  --text-heading: 72px;
  --leading-heading: 1.1;
  --tracking-heading: -0.65px;
  --text-heading-lg: 82px;
  --leading-heading-lg: 1.05;
  --tracking-heading-lg: -0.74px;
  --text-display: 116px;
  --leading-display: 1.05;
  --tracking-display: -2.09px;

  /* Typography — Weights */
  --font-weight-light: 300;
  --font-weight-regular: 400;

  /* Spacing */
  --spacing-unit: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-128: 128px;
  --spacing-144: 144px;

  /* Layout */
  --page-max-width: 1440px;
  --section-gap: 128-144px;
  --card-padding: 24px;
  --element-gap: 24-32px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-full: 9999px;

  /* Named Radii */
  --radius-tags: 9999px;
  --radius-cards: 8px;
  --radius-buttons: 9999px;

  /* Surfaces */
  --surface-obsidian-canvas: #000000;
  --surface-charcoal-surface: #1d1d1d;
  --surface-hairline-layer: #d6d5d0;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-obsidian: #000000;
  --color-charcoal: #1d1d1d;
  --color-paper-white: #ffffff;
  --color-ash: #d6d5d0;

  /* Typography */
  --font-feature-deck: 'Feature Deck', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-shne: 'Söhne', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-body-sm: 16px;
  --leading-body-sm: 1.5;
  --text-subheading: 22px;
  --leading-subheading: 1.3;
  --text-heading: 72px;
  --leading-heading: 1.1;
  --tracking-heading: -0.65px;
  --text-heading-lg: 82px;
  --leading-heading-lg: 1.05;
  --tracking-heading-lg: -0.74px;
  --text-display: 116px;
  --leading-display: 1.05;
  --tracking-display: -2.09px;

  /* Spacing */
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-128: 128px;
  --spacing-144: 144px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-full: 9999px;
}
```
