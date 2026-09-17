# T1 Energy — Style Reference
> Factory floor blueprint on warm vellum — a quiet, monochromatic stage where industrial scale and whisper-light typography carry the entire brand.

**Theme:** light

T1 Energy speaks the visual language of precision manufacturing: a warm cream canvas, charcoal typography rendered in whisper-light weight, and rounded geometry that softens industrial subject matter. The interface is nearly colorless by design — every element earns its presence through scale, spacing, and shape rather than hue. Navigation floats as a dark pill against the pale surface, imagery uses dramatically rounded 80px corners that echo engineered curves, and content sections breathe with generous 48px gaps. The overall feel is that of a technical specification sheet rendered as a website — precise, confident, and unadorned.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Vellum | `#f0efe9` | `--color-vellum` | Page canvas, section backgrounds — the warm off-white that defines the entire surface treatment |
| Paper White | `#ffffff` | `--color-paper-white` | Hairline borders, dividers, input outlines, and card edges on light surfaces. Do not promote it to the primary CTA color |
| Carbon Warm | `#322d2a` | `--color-carbon-warm` | Dark borders and separators for elevated surfaces and inverted UI. Do not promote it to the primary CTA color |
| Onyx Depth | `#0f0e12` | `--color-onyx-depth` | Footer surface, deepest elevation layer, darkest UI containers |
| Mercury | `#8b8b8b` | `--color-mercury` | Muted secondary text, disabled states, subtle surface layering |
| Pure Black | `#000000` | `--color-pure-black` | SVG icon fills, monochrome graphic elements only — never used for text or backgrounds |

## Tokens — Typography

### T1 Sans — The sole typeface across all surfaces. Weight 300 is used at 52px for hero and section display headlines — an anti-convention choice that makes industrial copy feel architectural rather than assertive. Weight 400 at 14px handles body, labels, and navigation. The custom geometric construction carries a technical-instrument quality that system sans-serifs cannot replicate. The 1.0 line-height on display creates tight headline blocks; the 1.3 on body gives reading comfort. Substitute with Inter or Söhne for similar geometric neutrality. · `--font-t1-sans`
- **Substitute:** Inter or Söhne
- **Weights:** 300, 400
- **Sizes:** 14px, 52px
- **Line height:** 1.00 (display), 1.30 (body)
- **Letter spacing:** 0.01em universally (~0.52px at 52px, ~0.14px at 14px) — barely open, just enough to prevent the light weight from feeling cramped
- **OpenType features:** `No special features detected; rely on default contextual alternates`
- **Role:** The sole typeface across all surfaces. Weight 300 is used at 52px for hero and section display headlines — an anti-convention choice that makes industrial copy feel architectural rather than assertive. Weight 400 at 14px handles body, labels, and navigation. The custom geometric construction carries a technical-instrument quality that system sans-serifs cannot replicate. The 1.0 line-height on display creates tight headline blocks; the 1.3 on body gives reading comfort. Substitute with Inter or Söhne for similar geometric neutrality.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| label | 12px | 1.3 | 0.12px | `--text-label` |
| body-sm | 14px | 1.3 | 0.14px | `--text-body-sm` |
| body | 16px | 1.4 | 0.16px | `--text-body` |
| subheading | 22px | 1.3 | 0.22px | `--text-subheading` |
| heading | 32px | 1.2 | 0.32px | `--text-heading` |
| display | 52px | 1 | 0.52px | `--text-display` |

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
| 24 | 24px | `--spacing-24` |
| 36 | 36px | `--spacing-36` |
| 48 | 48px | `--spacing-48` |
| 60 | 60px | `--spacing-60` |
| 96 | 96px | `--spacing-96` |
| 120 | 120px | `--spacing-120` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 16px |
| body | 12px |
| cards | 80px |
| pills | 100px |
| small | 8px |
| buttons | 16px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 48px
- **Card padding:** 22px
- **Element gap:** 8px

## Components

### Pill Navigation Bar
**Role:** Primary site navigation — floats as a dark horizontal pill anchored top-right

Dark Carbon Warm (#322d2a) background, 16px border-radius, 36px vertical padding, 24px horizontal padding. White (#ffffff) link text at 14px weight 400, separated by 24px gaps. Logo T1 mark appears to the left within the same pill or adjacent. Sits over page content with no visible shadow — the contrast difference alone separates it from the vellum canvas.

### Logo Mark
**Role:** Brand identifier in navigation

Geometric 'T1' wordmark in white when on dark navigation surface. Simple constructed letterforms with the '1' sharing the 'T' crossbar. No tagline, no decorative element.

### Filled Primary Button
**Role:** Primary action trigger (e.g., 'Discover')

Carbon Warm (#322d2a) background, white text at 14px weight 400, 18px vertical / 22px horizontal padding, 100px border-radius (full pill). No border, no shadow. The pill shape and dark fill make it the highest-weight interactive element on any page.

### Ghost Outlined Button
**Role:** Secondary action trigger (e.g., 'Learn More')

Transparent background, 1px Carbon Warm (#322d2a) border, Carbon Warm text at 14px weight 400, 18px vertical / 22px horizontal padding, 100px border-radius (full pill). The outlined pill mirrors the filled button's geometry, differing only in fill — the two are a matched pair.

### Section Label
**Role:** Tiny uppercase section identifier (e.g., 'MISSION', 'TECHNOLOGY', 'CASE STUDY')

A small solid square (4px × 4px) in Carbon Warm precedes the label text. Label rendered at ~11–12px weight 400, uppercase, letter-spacing ~0.12em, Carbon Warm color. The square indicator is a signature device — it replaces the conventional dot or icon and gives the labels a machined, dial-like quality.

### Display Headline
**Role:** Hero and section-level headlines

T1 Sans weight 300, 52px, line-height 1.0, letter-spacing 0.52px, Carbon Warm color. The ultra-light weight is the single most distinctive typographic choice on the site — it makes large headlines feel like etched specifications rather than shouted declarations.

### Case Study Card
**Role:** Compact overlay card on hero image — promotes a featured case study

Carbon Warm (#322d2a) dark surface, 12px border-radius, ~16px padding. Contains a 'CASE STUDY' label in white at 12px, a short white headline at 14px weight 400, and a small map thumbnail image on the right side. The dark card on a photographic background creates a film-still caption effect.

### Image Card
**Role:** Full-bleed image containers in content sections

Image fills the container edge-to-edge. Container border-radius is 80px — the most dramatic radius on the site, making rectangular photos feel almost circular. No caption, no border, no shadow; the image is the entire content.

### Accordion Item
**Role:** Expandable technology breakdown (e.g., TOPCon layer stack)

Full-width row with Carbon Warm text label at ~18–22px weight 400 on the left, circular expand/collapse icon button on the right. The icon button is 40px diameter, 100px border-radius, Carbon Warm 1px border, white background. Active/expanded item shows a minus (−) icon; collapsed items show a plus (+). Rows are separated by 1px Carbon Warm hairlines. The active item's description text appears in smaller weight below the label.

### Hero Overlay
**Role:** Full-viewport photographic background with text overlay

Full-bleed industrial/factory photograph with a large display headline (52px weight 300, white) positioned bottom-left. A filled primary button sits below the headline. No gradient, no darkening overlay — the text relies on the photographic tonal range for legibility. The image extends to all viewport edges.

### Footer
**Role:** Site footer with darkest surface treatment

Onyx Depth (#0f0e12) background, 30px bottom padding, white text at 14px weight 400. The near-black footer is the only place a dark surface appears at full width, giving the page a definitive terminator.

## Do's and Don'ts

### Do
- Use T1 Sans weight 300 at 52px for all display headlines — the light weight is the brand's typographic signature and should not be replaced by 600/700 bold.
- Set border-radius to 80px on all image containers and 100px on all interactive buttons to maintain the pill-and-orb geometry.
- Use Carbon Warm (#322d2a) for all borders, text, and filled interactive elements — never use pure black #000000 for text or backgrounds.
- Maintain section gaps of 48px and card padding of 22px to preserve the breathing, specification-sheet rhythm.
- Prefix every section label with the 4px solid square indicator in Carbon Warm before the uppercase label text.
- Keep the palette to vellum canvas, white surfaces, and carbon text — the absence of color is the design.
- Set display headline line-height to exactly 1.0 so the large 52px text forms a tight, architectural block.

### Don't
- Do not introduce accent colors, gradients, or decorative hues — the 1% colorfulness is intentional and breaking it will shatter the engineered restraint.
- Do not use pure black (#000000) for text, backgrounds, or borders — always warm it to Carbon Warm (#322d2a) or cool it to Onyx (#0f0e12).
- Do not apply box-shadows to cards, buttons, or navigation — the design relies on flat tonal layering (vellum → white → carbon), not elevation.
- Do not set border-radius below 8px on any container — the system is built on generous rounding, and sharp corners will feel out of place.
- Do not use bold or semibold weights for headlines — T1 Sans only ships 300 and 400, and the whisper-light display is the whole point.
- Do not add icons, illustrations, or emoji to section labels or body copy — the square indicator and typography carry all visual signaling.
- Do not break the full-bleed image pattern with borders, frames, or padding around photographs — images should float directly on the vellum canvas with their 80px radius.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Vellum Canvas | `#f0efe9` | Base page background and the majority of content sections |
| 1 | Paper White | `#ffffff` | Elevated cards, floating panels, content wells above the vellum canvas |
| 2 | Carbon Warm | `#322d2a` | Navigation pill, filled buttons, case study card, footer-adjacent dark surfaces |
| 3 | Onyx Depth | `#0f0e12` | Footer terminator, darkest elevation layer |

## Elevation

The design is deliberately shadowless. All visual hierarchy is achieved through tonal layering (vellum → white → carbon → onyx) and generous spacing, never through drop shadows. This keeps the interface feeling flat, precise, and instrument-like rather than skeuomorphic or app-like.

## Imagery

Photography is full-bleed industrial documentary — factory floors, robotic arms, solar cell production lines — presented without overlays, duotones, or color treatment. Images are cropped to fill their containers edge-to-edge with 80px border-radius, making them feel like circular portholes into the manufacturing process. No lifestyle photography, no abstract graphics, no illustrations. Product renders (e.g., the TOPCon solar cell 3D model) appear as isolated objects on the vellum canvas, center-left of their section, with no background treatment. The imagery carries the brand's industrial credibility directly — it is the only source of visual richness in an otherwise austere interface.

## Layout

Max-width 1200px centered content, with hero sections breaking out to full-bleed. The hero is a full-viewport industrial photograph with bottom-left headline overlay. Below the hero, content alternates in single-column stacks and two-column splits (text-left/image-right). Image cards use 80px corner radius and sit side-by-side as a two-column pair. The technology section uses a split layout: 3D product render on the left, accordion stack on the right. Vertical rhythm is controlled by 48px section gaps with generous internal breathing room. Navigation is a floating dark pill anchored to the top of the viewport, not a full-width bar. No sidebar, no mega-menu, no sticky elements beyond the nav.

## Agent Prompt Guide

## Quick Color Reference
- text: #322d2a (Carbon Warm)
- background: #f0efe9 (Vellum)
- surface: #ffffff (Paper White)
- border: #322d2a
- accent: none — the system is monochromatic
- primary action: no distinct CTA color

## Example Component Prompts

1. **Hero with overlay text**: Full-bleed industrial photograph filling the viewport. Bottom-left display headline: T1 Sans weight 300, 52px, line-height 1.0, letter-spacing 0.52px, color #ffffff. Below it a filled button: Carbon Warm (#322d2a) background, white text at 14px weight 400, 18px vertical and 22px horizontal padding, 100px border-radius. No overlay, no shadow.

2. **Section with label and body**: Vellum (#f0efe9) background. Top-left section label: a 4px solid square in #322d2a followed by uppercase text at 12px weight 400, letter-spacing 0.12em, color #322d2a. Below, body text in T1 Sans weight 400, 16px, line-height 1.4, color #322d2a. A ghost button at the bottom: transparent background, 1px #322d2a border, text color #322d2a, 18px/22px padding, 100px border-radius.

3. **Two-column image pair**: Two images side by side on vellum canvas, each filling its container edge-to-edge with 80px border-radius. No captions, no borders, no gaps between the images and the vellum background.

4. **Accordion list**: Full-width rows on vellum canvas. Each row has a label on the left in T1 Sans weight 400, ~20px, color #322d2a. On the right, a circular icon button: 40px diameter, 100px border-radius, 1px #322d2a border, white (#ffffff) background, containing either a + or − character. Rows separated by 1px #322d2a hairline dividers.

5. **Navigation pill**: Dark Carbon Warm (#322d2a) pill at the top of the page, 16px border-radius, 36px vertical padding, 24px horizontal padding. White (#ffffff) text links at 14px weight 400 separated by 24px gaps. T1 logo mark on the left in white. No shadow — the tonal contrast against the vellum canvas is sufficient.

## Signature Design Choices

Three choices define this system more than any other: (1) Weight 300 at 52px for all display headlines — an anti-convention whisper-weight that makes industrial copy feel architectural; (2) The 4px solid square preceding every section label — a machined dial-indicator replacing the conventional bullet or icon; (3) 80px border-radius on all image containers — turning rectangular photographs into soft portholes that contrast with the otherwise flat, technical interface. Together these create a visual language that is simultaneously industrial and gentle, precise and breathable.

## Similar Brands

- **Crusoe Energy** — Same ultra-minimal monochromatic approach with warm neutrals, large whisper-light headlines, and full-bleed industrial photography
- **Commonwealth Fusion Systems** — Deep-tech manufacturing brand using a nearly colorless palette, dark pill navigation, and generous rounded image containers
- **Form Energy** — Clean industrial energy company with flat tonal layering, no shadows, and dramatic corner radii on media containers
- **Hadrian** — American advanced-manufacturing brand using warm off-white canvas, charcoal text, and pill-shaped navigation as the sole chromatic gesture
- **Sila** — Battery technology company with the same specification-sheet aesthetic — flat surfaces, monospaced-feeling geometry, and full-bleed factory photography

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-vellum: #f0efe9;
  --color-paper-white: #ffffff;
  --color-carbon-warm: #322d2a;
  --color-onyx-depth: #0f0e12;
  --color-mercury: #8b8b8b;
  --color-pure-black: #000000;

  /* Typography — Font Families */
  --font-t1-sans: 'T1 Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-label: 12px;
  --leading-label: 1.3;
  --tracking-label: 0.12px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.3;
  --tracking-body-sm: 0.14px;
  --text-body: 16px;
  --leading-body: 1.4;
  --tracking-body: 0.16px;
  --text-subheading: 22px;
  --leading-subheading: 1.3;
  --tracking-subheading: 0.22px;
  --text-heading: 32px;
  --leading-heading: 1.2;
  --tracking-heading: 0.32px;
  --text-display: 52px;
  --leading-display: 1;
  --tracking-display: 0.52px;

  /* Typography — Weights */
  --font-weight-light: 300;
  --font-weight-regular: 400;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-36: 36px;
  --spacing-48: 48px;
  --spacing-60: 60px;
  --spacing-96: 96px;
  --spacing-120: 120px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 48px;
  --card-padding: 22px;
  --element-gap: 8px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-full: 80px;
  --radius-full-2: 100px;

  /* Named Radii */
  --radius-nav: 16px;
  --radius-body: 12px;
  --radius-cards: 80px;
  --radius-pills: 100px;
  --radius-small: 8px;
  --radius-buttons: 16px;

  /* Surfaces */
  --surface-vellum-canvas: #f0efe9;
  --surface-paper-white: #ffffff;
  --surface-carbon-warm: #322d2a;
  --surface-onyx-depth: #0f0e12;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-vellum: #f0efe9;
  --color-paper-white: #ffffff;
  --color-carbon-warm: #322d2a;
  --color-onyx-depth: #0f0e12;
  --color-mercury: #8b8b8b;
  --color-pure-black: #000000;

  /* Typography */
  --font-t1-sans: 'T1 Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-label: 12px;
  --leading-label: 1.3;
  --tracking-label: 0.12px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.3;
  --tracking-body-sm: 0.14px;
  --text-body: 16px;
  --leading-body: 1.4;
  --tracking-body: 0.16px;
  --text-subheading: 22px;
  --leading-subheading: 1.3;
  --tracking-subheading: 0.22px;
  --text-heading: 32px;
  --leading-heading: 1.2;
  --tracking-heading: 0.32px;
  --text-display: 52px;
  --leading-display: 1;
  --tracking-display: 0.52px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-36: 36px;
  --spacing-48: 48px;
  --spacing-60: 60px;
  --spacing-96: 96px;
  --spacing-120: 120px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-full: 80px;
  --radius-full-2: 100px;
}
```
