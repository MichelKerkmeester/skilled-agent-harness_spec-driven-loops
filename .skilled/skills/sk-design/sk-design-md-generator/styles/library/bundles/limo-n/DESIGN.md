# Limón — Style Reference
> moody brasserie under candlelight

**Theme:** dark

Limón runs on the visual grammar of an evening brasserie: deep olive-black canvases under warm overhead light, food photographed as editorial still-life, and a single flash of saturated lemon yellow that reads as accent illumination rather than decoration. Typography carries unusually wide positive tracking — almost hand-stenciled — which makes the brand name and display lines feel pressed onto glass or neon. The palette is deliberately minimal: one near-black, one forest-deep green, one electric yellow, and one warm cream for the breathing sections. Cards and images are heavy; chrome (buttons, borders, dividers) is feather-light with essentially zero corner radius, giving the whole site a confident, unsoftened edge.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Black Olive | `#1d0b0d` | `--color-black-olive` | Page background, hero canvas, primary text on light sections — the dominant surface that makes the yellow accent feel like lit signage |
| Forest Ink | `#103b15` | `--color-forest-ink` | Headings, body text, list dividers, link color — the deep green gives the dark-mode typography a botanical, not corporate, character |
| Lemon Zest | `#f7ea48` | `--color-lemon-zest` | Filled CTA buttons, large display headlines, accent links, highlight washes — the only chromatic note in the system, used sparingly to ignite dark sections |
| Warm Cream | `#fcf9f0` | `--color-warm-cream` | Light section backgrounds, card surfaces, off-white content panels — a paper-stock warmth that softens the dark hero without going clinical |
| Sage Mist | `#dbe2dc` | `--color-sage-mist` | Hairline dividers, subtle borders, muted accents — a desaturated green-gray that holds the system together without competing with the two brand greens |
| Pure White | `#ffffff` | `--color-pure-white` | Icon strokes, button borders, negative-space punctuation inside the dark canvas |

## Tokens — Typography

### VenusCom — Primary typeface across all UI — the signature choice is positive tracking that scales with size (0.06em at 75px down to 0.04em at body), giving display lines a wide-set, almost neon-sign feel and keeping small body text compact · `--font-venuscom`
- **Substitute:** DM Sans, Outfit, or Plus Jakarta Sans
- **Weights:** 300, 400, 500, 600, 700
- **Sizes:** 14, 16, 19, 20, 26, 30, 36, 46, 54, 68, 75px
- **Line height:** 1.00, 1.01, 1.15, 1.20, 1.25, 1.30, 1.35, 1.37, 1.40, 1.45, 1.60
- **Letter spacing:** 0.02em at 26px, 0.03em at 30–36px, 0.04em at 46px, 0.06em at 54–75px
- **Role:** Primary typeface across all UI — the signature choice is positive tracking that scales with size (0.06em at 75px down to 0.04em at body), giving display lines a wide-set, almost neon-sign feel and keeping small body text compact

### Font Awesome 6 Free — Icon system — solid-fill glyphs inheriting the wide letter-spacing for UI micro-elements (arrows, social marks) · `--font-font-awesome-6-free`
- **Weights:** 900
- **Sizes:** 14, 16px
- **Line height:** 1.00
- **Letter spacing:** 0.04em, 0.06em
- **Role:** Icon system — solid-fill glyphs inheriting the wide letter-spacing for UI micro-elements (arrows, social marks)

### Font Awesome 6 Brands — Brand/social icons rendered larger for footer or badge contexts · `--font-font-awesome-6-brands`
- **Weights:** 400
- **Sizes:** 36px
- **Line height:** 1.00
- **Role:** Brand/social icons rendered larger for footer or badge contexts

### Times — Times — detected in extracted data but not described by AI · `--font-times`
- **Weights:** 400
- **Sizes:** 19px
- **Line height:** 1.01
- **Role:** Times — detected in extracted data but not described by AI

### Helvetica — Helvetica — detected in extracted data but not described by AI · `--font-helvetica`
- **Weights:** 400
- **Sizes:** 15px
- **Line height:** 1.5
- **Letter spacing:** 0.007
- **Role:** Helvetica — detected in extracted data but not described by AI

### FreeSans — FreeSans — detected in extracted data but not described by AI · `--font-freesans`
- **Weights:** 400
- **Sizes:** 19px
- **Line height:** 1.01
- **Letter spacing:** -0.312
- **Role:** FreeSans — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 14px | 1.45 | 0.84px | `--text-caption` |
| body-sm | 16px | 1.37 | 0.64px | `--text-body-sm` |
| body-lg | 20px | 1.25 | 0.4px | `--text-body-lg` |
| subheading | 26px | 1.2 | 0.52px | `--text-subheading` |
| heading-sm | 30px | 1.15 | 0.9px | `--text-heading-sm` |
| heading | 36px | 1.15 | 1.08px | `--text-heading` |
| heading-lg | 46px | 1.1 | 1.84px | `--text-heading-lg` |
| display | 68px | 1.01 | 4.08px | `--text-display` |
| display-xl | 75px | 1 | 4.5px | `--text-display-xl` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 8 | 8px | `--spacing-8` |
| 12 | 12px | `--spacing-12` |
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 120 | 120px | `--spacing-120` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 0px |
| badges | 1px |
| inputs | 1px |
| buttons | 1px |
| circular | 40px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 60px
- **Card padding:** 30px
- **Element gap:** 15-20px

## Components

### Top Navigation Bar
**Role:** Site-wide header with centered logo and split link groups

Dark olive (#1d0b0d) background, full-bleed, ~80px tall. Two-column nav link groups (HOME, MENU, ABOUT US, FAQ, CONTACT on left; FOLLOW US ON INSTAGRAM on right) set in VenusCom 16px weight 400 letter-spacing 0.04em uppercase in Warm Cream (#fcf9f0). The 'HOME' item uses a 1px white border outline. Wordmark 'LIMÓN' centered at ~46px weight 500, letter-spacing ~1.84px, in Warm Cream. Vertical separators between nav items are implied by spacing rather than drawn.

### Filled CTA Button (Lemon)
**Role:** Primary action — ordering, reservations

Background: Lemon Zest (#f7ea48). Text: Black Olive (#1d0b0d) at 16px weight 600 letter-spacing 0.04em uppercase. Padding: 12px 16px. Border-radius: 1px (near-square). No border, no shadow. The flat saturated rectangle against the dark canvas is the system's loudest functional element — used sparingly so it stays loud.

### Ghost / Outlined Navigation Item
**Role:** Active or current-section indicator in the nav bar

Transparent background, 1px solid white (#ffffff) border, 1px radius. VenusCom 16px weight 400 uppercase Warm Cream text with 5–6px horizontal padding. Mirrors the filled CTA's letter-spacing.

### Hero Overlay Display Text
**Role:** Large editorial wordmark floating over hero photography

Lemon Zest (#f7ea48) at 75px weight 400 line-height 1.00, letter-spacing 4.5px (0.06em). Sits as two words on different lines with generous vertical breathing. Slightly transparent or overlaid on the food photography without a background plate — the text and image share the dark canvas.

### Hero Sub-Line
**Role:** Supporting hero text under the display wordmark

Warm Cream (#fcf9f0) at 20px weight 400, letter-spacing 0.4px. Plain sentence case, not uppercase. Sits below the display line at ~20px gap.

### Food Card (3-Column Grid)
**Role:** Menu item tile in the cream section's three-up grid

Square or near-square food photograph as the only visual element — no card chrome, no border, no shadow. Caption sits 30px below the image: VenusCom 20px body in Black Olive or Forest Ink (#103b15), followed by descriptive body copy at 19px, then an 'ORDER NOW' ghost link with right-arrow. Grid gap is ~30px horizontal and ~40px vertical.

### Ghost Link Button (ORDER NOW)
**Role:** Tertiary action — per-item ordering, inline CTAs in card descriptions

No background, no border. VenusCom 16px weight 500 uppercase, letter-spacing 0.04em, in Forest Ink (#103b15) or Black Olive depending on section. A right-arrow glyph (Font Awesome 6 Free solid) sits inline at 14px. 4px gap between text and arrow. Underline appears on hover only.

### Back-to-Top Circular Button
**Role:** Floating utility control after scroll

40px diameter circle, Forest Ink (#103b15) background, Warm Cream (#fcf9f0) upward chevron icon centered. Position: fixed bottom-right with ~24px inset. Zero shadow, zero border.

### Featured Dish Banner (Poke/Featured Section)
**Role:** Full-bleed editorial food section with oversized photography

Warm Cream (#fcf9f0) section background. A single large food photograph offset to the right (roughly right-half of the container, ~55% width), no card or frame. Text and CTA stack to the left at 30–40px gap, with heading at 30–36px and body at 19px.

### Section Heading Block
**Role:** Standard heading + intro copy used between sections

Centered or left-aligned. Heading in VenusCom 30–36px weight 500, letter-spacing ~1px, in Forest Ink (#103b15) on cream or Warm Cream on dark. Body intro at 19px weight 400. 20–30px margin-bottom between heading and body.

### Body Paragraph
**Role:** Default readable copy block in menu descriptions and content sections

VenusCom 19px weight 400 line-height 1.30 letter-spacing 0.57px. Color: Forest Ink (#103b15) on cream, or Warm Cream (#fcf9f0) on dark. Max-width ~640px to maintain measure.

## Do's and Don'ts

### Do
- Use Lemon Zest (#f7ea48) as a filled button background only — never as a text color on a yellow background, and never diluted as a tint.
- Set display headlines (46px and above) with 0.04–0.06em positive letter-spacing; collapse to 0.02–0.04em at body sizes 14–20px.
- Keep corner radius at 1px (or 0px) for all buttons, cards, inputs, and badges — the system is intentionally unsoftened. Reserve 40px radius exclusively for the circular back-to-top button.
- Lay food photography full-bleed or as large edge-to-edge tiles — avoid thin framed images or small thumbnails.
- Use Black Olive (#1d0b0d) as the default canvas for hero and dark sections; switch to Warm Cream (#fcf9f0) only for content-light breathing sections.
- Pair the filled Lemon Zest CTA with a ghost Forest Ink 'ORDER NOW' inline link in the same flow — the system relies on that filled/ghost contrast to establish hierarchy without color overload.
- Keep section padding between 30–60px vertically; 15px is the standard element gap inside a card or list.

### Don't
- Don't introduce new accent hues — the system is one near-black, one deep green, one lemon yellow, and cream. Any additional color breaks the candlelight metaphor.
- Don't soften corners with 8–12px radii. The 1px (near-zero) radius is a signature choice; rounding destroys the editorial feel.
- Don't use tight or negative letter-spacing on display text. VenusCom's signature is wide positive tracking; tightening it makes headlines generic.
- Don't place the Lemon Zest CTA on a Warm Cream background — the yellow loses all contrast and visual energy. The CTA belongs on dark.
- Don't add drop shadows, glows, or gradients to cards, buttons, or images. The system is flat and confident; elevation comes from color contrast and scale, not depth effects.
- Don't use Forest Ink (#103b15) as a button background — it is a text/link/border color only. The deep green on dark olive disappears.
- Don't reduce the size of display headlines below 46px or pad the wordmark too tightly — the generous tracking and large scale is what makes the brand name feel like signage.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Black Olive Canvas | `#1d0b0d` | Page background, hero canvas, footer — the dominant dark surface |
| 2 | Warm Cream Panel | `#fcf9f0` | Light content sections, food card backgrounds, editorial body sections |
| 3 | Forest Ink Surface | `#103b15` | Headline plates, dark accent surfaces, floating circular utility buttons |
| 4 | Lemon Zest Accent | `#f7ea48` | Call-to-action fill, display text overlay, highlight washes on dark |

## Elevation

The system deliberately avoids shadows, gradients, and stacked depth. Visual hierarchy is built entirely through color contrast (dark olive vs cream vs lemon yellow), scale (75px display vs 16px body), and positive letter-spacing — never through drop shadows or z-axis elevation. Flatness is a core brand choice: the food photography is the only thing with physical presence, and the UI chrome must recede beside it.

## Imagery

Food photography is the hero. Images are editorial, high-saturation, tightly cropped overhead or three-quarter views of plated dishes (poke bowls, salads, wraps, tortilla chips) on warm-toned surfaces — terracotta, terracotta, peach, mauve. Photography is treated as edge-to-edge tiles with no frames, no rounded corners, no drop shadows. The 'cards' in the grid are essentially unchromised photographs. No people, no lifestyle context, no abstract graphics — the food IS the visual identity. Icons are solid-fill Font Awesome glyphs at 14–16px, inheriting the wide letter-spacing of the type system.

## Agent Prompt Guide

Quick Color Reference
- text (primary): #1d0b0d on light, #fcf9f0 on dark
- text (accent/brand): #103b15 on light, #f7ea48 on dark
- background (canvas): #1d0b0d
- background (light section): #fcf9f0
- border/hairline: #dbe2dc or #103b15
- primary action: #f7ea48 (filled action)

Example Component Prompts
1. Create a filled CTA button: background #f7ea48, text #1d0b0d, padding 12px 16px, border-radius 1px, font VenusCom 16px weight 600 uppercase letter-spacing 0.64px. No border, no shadow.
2. Create a food card in a three-column grid: full-bleed square photograph with no border or radius, VenusCom 20px weight 500 heading in #103b15 30px below the image, 19px body copy in #103b15, then a ghost 'ORDER NOW' link with a 14px right-arrow icon at 15px gap. Grid gap 30px.
3. Create a hero display headline: text in #f7ea48, font VenusCom 75px weight 400 line-height 1.00, letter-spacing 4.5px, overlaid directly on a dark olive (#1d0b0d) background with food photography, no background plate. A 20px sub-line in #fcf9f0 at 20px below.
4. Create a back-to-top circular button: 40px diameter, background #103b15, centered upward chevron icon in #fcf9f0, fixed bottom-right with 24px inset. No shadow.
5. Create a top navigation bar: full-bleed #1d0b0d background, centered 46px VenusCom wordmark in #fcf9f0, two groups of nav links in 16px uppercase letter-spacing 0.64px flanking the logo. Active nav item uses a 1px white border outline.

## Similar Brands

- **Nobu Restaurants** — Same near-black canvas with a single vivid accent and oversized editorial display type over food photography
- **Sweetgreen** — Same flat food-first photography aesthetic with minimal chrome, no shadows, and a single high-contrast accent
- **Soho House** — Same dark olive/forest palette with warm cream content sections and wide-tracked display typography
- **Oleada Studio** — Same editorial dark-canvas hero with display text floating over photography and lemon-yellow accent punctuation
- **Fucina (restaurant sites)** — Same near-square button radius, flat surfaces, and food-photography-as-hero approach with no decorative elevation

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-black-olive: #1d0b0d;
  --color-forest-ink: #103b15;
  --color-lemon-zest: #f7ea48;
  --color-warm-cream: #fcf9f0;
  --color-sage-mist: #dbe2dc;
  --color-pure-white: #ffffff;

  /* Typography — Font Families */
  --font-venuscom: 'VenusCom', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-font-awesome-6-free: 'Font Awesome 6 Free', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-font-awesome-6-brands: 'Font Awesome 6 Brands', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-times: 'Times', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-helvetica: 'Helvetica', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-freesans: 'FreeSans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.45;
  --tracking-caption: 0.84px;
  --text-body-sm: 16px;
  --leading-body-sm: 1.37;
  --tracking-body-sm: 0.64px;
  --text-body-lg: 20px;
  --leading-body-lg: 1.25;
  --tracking-body-lg: 0.4px;
  --text-subheading: 26px;
  --leading-subheading: 1.2;
  --tracking-subheading: 0.52px;
  --text-heading-sm: 30px;
  --leading-heading-sm: 1.15;
  --tracking-heading-sm: 0.9px;
  --text-heading: 36px;
  --leading-heading: 1.15;
  --tracking-heading: 1.08px;
  --text-heading-lg: 46px;
  --leading-heading-lg: 1.1;
  --tracking-heading-lg: 1.84px;
  --text-display: 68px;
  --leading-display: 1.01;
  --tracking-display: 4.08px;
  --text-display-xl: 75px;
  --leading-display-xl: 1;
  --tracking-display-xl: 4.5px;

  /* Typography — Weights */
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  --font-weight-black: 900;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-120: 120px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 60px;
  --card-padding: 30px;
  --element-gap: 15-20px;

  /* Border Radius */
  --radius-sm: 1px;
  --radius-3xl: 40px;

  /* Named Radii */
  --radius-cards: 0px;
  --radius-badges: 1px;
  --radius-inputs: 1px;
  --radius-buttons: 1px;
  --radius-circular: 40px;

  /* Surfaces */
  --surface-black-olive-canvas: #1d0b0d;
  --surface-warm-cream-panel: #fcf9f0;
  --surface-forest-ink-surface: #103b15;
  --surface-lemon-zest-accent: #f7ea48;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-black-olive: #1d0b0d;
  --color-forest-ink: #103b15;
  --color-lemon-zest: #f7ea48;
  --color-warm-cream: #fcf9f0;
  --color-sage-mist: #dbe2dc;
  --color-pure-white: #ffffff;

  /* Typography */
  --font-venuscom: 'VenusCom', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-font-awesome-6-free: 'Font Awesome 6 Free', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-font-awesome-6-brands: 'Font Awesome 6 Brands', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-times: 'Times', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-helvetica: 'Helvetica', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-freesans: 'FreeSans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.45;
  --tracking-caption: 0.84px;
  --text-body-sm: 16px;
  --leading-body-sm: 1.37;
  --tracking-body-sm: 0.64px;
  --text-body-lg: 20px;
  --leading-body-lg: 1.25;
  --tracking-body-lg: 0.4px;
  --text-subheading: 26px;
  --leading-subheading: 1.2;
  --tracking-subheading: 0.52px;
  --text-heading-sm: 30px;
  --leading-heading-sm: 1.15;
  --tracking-heading-sm: 0.9px;
  --text-heading: 36px;
  --leading-heading: 1.15;
  --tracking-heading: 1.08px;
  --text-heading-lg: 46px;
  --leading-heading-lg: 1.1;
  --tracking-heading-lg: 1.84px;
  --text-display: 68px;
  --leading-display: 1.01;
  --tracking-display: 4.08px;
  --text-display-xl: 75px;
  --leading-display-xl: 1;
  --tracking-display-xl: 4.5px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-120: 120px;

  /* Border Radius */
  --radius-sm: 1px;
  --radius-3xl: 40px;
}
```
