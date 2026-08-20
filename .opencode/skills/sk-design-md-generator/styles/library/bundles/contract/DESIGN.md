# Contract — Style Reference
> white-walled gallery catalogue

**Theme:** mixed

MDF Italia Contract uses an editorial Swiss-grid language: a pure white canvas interrupted by full-bleed photographic plates and stark black bands, with the only ornament coming from the type itself. Typography is the primary design material — a geometric sans (Plain) pushed to display sizes of 100px with aggressive negative tracking, creating a confident architectural voice that reads more like a design monograph than a product site. The palette is almost entirely achromatic: hairline #e5e7eb rules do all the structural work, replacing cards, boxes, and dividers with single-pixel lines; solid #000000 anchors headlines, nav text, and inverted panels. The sole chromatic accent is a single vivid blue used sparingly for link and active states, never for fills. Components are flat, borderless in the traditional sense, and almost shadowless — depth is communicated by alternating white-to-black bands rather than elevation. The result is a portfolio-grade editorial surface that treats furniture as fine art and lets the product photography carry all the warmth and color the chrome refuses to.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Pure White | `#ffffff` | `--color-pure-white` | Primary canvas, card surfaces, inverted text on black panels |
| Absolute Black | `#000000` | `--color-absolute-black` | Primary text, headings, navigation, inverted section bands, footer surfaces — the dominant ink of the system |
| Hairline Gray | `#e5e7eb` | `--color-hairline-gray` | Structural borders, dividers, card outlines, key-value grid frames — the load-bearing neutral of the entire layout system |
| Stone Gray | `#6b7280` | `--color-stone-gray` | Neutral form states, badge text, and quiet UI feedback where color should stay understated. Do not promote it to the primary CTA color |
| Ash | `#b3b3b3` | `--color-ash` | Muted body text, captions, placeholder and helper text — de-emphasized reading copy |
| Quartz | `#bbbbbb` | `--color-quartz` | Tertiary text, fine print |
| Signal Blue | `#2563eb` | `--color-signal-blue` | Active links, focus state, inline emphasis — the only chromatic note in an otherwise monochrome system, used for switching states on not for fills |

## Tokens — Typography

### Plain — Sole typeface for everything. Weight 300 carries the 100px display headlines — a whisper-weight giant that signals editorial confidence over commercial shouting. Weight 400 is the workhorse for body and navigation. Weight 500–600 reserved for micro-labels and emphasis. The aggressive negative tracking at large sizes (–5px at 100px, –2px at 50px) is signature: letters pull together as the type grows, creating a condensed, monumental feel. A neutral geometric sans (Inter, Söhne, or NB International Pro) is the closest free substitute. · `--font-plain`
- **Substitute:** Inter or Söhne
- **Weights:** 300, 400, 500, 600
- **Sizes:** 16px, 18px, 24px, 30px, 50px, 100px
- **Line height:** 1.00–1.75 by step
- **Letter spacing:** -0.0500em at 100px, -0.0400em at 50px, -0.0250em at 30px, -0.0020em at 24px, normal at 18px and below
- **Role:** Sole typeface for everything. Weight 300 carries the 100px display headlines — a whisper-weight giant that signals editorial confidence over commercial shouting. Weight 400 is the workhorse for body and navigation. Weight 500–600 reserved for micro-labels and emphasis. The aggressive negative tracking at large sizes (–5px at 100px, –2px at 50px) is signature: letters pull together as the type grows, creating a condensed, monumental feel. A neutral geometric sans (Inter, Söhne, or NB International Pro) is the closest free substitute.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| body | 16px | 1.56 | — | `--text-body` |
| subheading | 18px | 1.5 | — | `--text-subheading` |
| heading-sm | 24px | 1.25 | -0.05px | `--text-heading-sm` |
| heading | 30px | 1.13 | -0.75px | `--text-heading` |
| heading-lg | 50px | 1.08 | -2px | `--text-heading-lg` |
| display | 100px | 1 | -5px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** compact

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 8 | 8px | `--spacing-8` |
| 12 | 12px | `--spacing-12` |
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 32 | 32px | `--spacing-32` |
| 36 | 36px | `--spacing-36` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 100 | 100px | `--spacing-100` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 0px |
| images | 0px |
| inputs | 2px |
| buttons | 0px |

### Layout

- **Page max-width:** 1440px
- **Section gap:** 64-80px
- **Card padding:** 24-32px
- **Element gap:** 8-12px

## Components

### Editorial Display Headline
**Role:** Hero and section titles at 100px Plain weight 300

The signature element. 100px Plain at weight 300, line-height 1.00, letter-spacing -0.0500em (-5px). Always #000000 on white or #ffffff on black. Sets in tight, monumentally condensed blocks. No sentence case — use title case for editorial weight. Occupies full container width, often 2–3 lines tall.

### Section Label
**Role:** Small all-caps or title-case lead-in above a headline

Plain 16–18px weight 500, #000000. Tight tracking, no decoration. Functions like a magazine kicker — appears above section titles (e.g. 'Key values', 'Office').

### Hairline Section Divider
**Role:** Primary structural separator between content blocks

A 1px bottom border in #e5e7eb, full container width. No margin — sits directly beneath content with 24–32px padding above. Replaces cards, boxes, and panels throughout the system.

### Key Value Cell
**Role:** 4-column grid item with circular illustration and overlaid text

1px #e5e7eb border on all sides, 0px radius. Contains a thin-stroke circular line illustration centered, with large 30–50px Plain weight 300 text overlaid or breaking through the circle boundary. Equal cell widths across a 4-up grid. No padding inside the frame — the text sits hard against the border for an architectural, blueprint-like feel.

### Full-Bleed Image Plate
**Role:** Hero photography and atmospheric section images

Edge-to-edge, no border, 0px radius. Images carry 100% of the color and warmth the chrome refuses. Used for hospitality and interior photography. Often followed immediately by a black band.

### Inverted Black Band
**Role:** Section break using #000000 background

Full-width #000000 background, #ffffff text, 64–80px vertical padding. Used for catalogue/download sections and footer. All content inside (cards, book mockups, text) sits on the black ground with no additional chrome — the inversion is the elevation.

### Catalogue Card
**Role:** Two-column card for downloadable reference / contract books

Sits inside an Inverted Black Band. Left column: white book mockup image (centered, ~60% column width, 0px radius). Right column: white #ffffff headline at 30–50px weight 300, #b3b3b3 body text below, and an underlined #ffffff 'Download catalogue' link. 48–64px column gap.

### Text Input
**Role:** Form field in the contact or filtering interface

1px #6b7280 border, 2px radius (the only radius in the system). White #ffffff background, #000000 text, 8px vertical padding, 12px horizontal padding. Placeholder in #b3b3b3. No focus ring glow — the border simply darkens to #000000 on focus.

### Underlined Inline Link
**Role:** Text links within body copy and navigation

Plain 16–18px weight 400, color #000000 with a 1px #e5e7eb underline. Active or hover state shifts to #2563eb with a #2563eb underline. No button chrome — links are always typographic.

### Top Navigation Bar
**Role:** Minimal horizontal site navigation

White #ffffff background, 1px #e5e7eb bottom border. Logo left (Plain wordmark), nav links inline-right in Plain 16–18px weight 400 #000000 with generous 24–32px horizontal gap. No background fill change on scroll, no shadow — flat to the canvas.

### Footer
**Role:** Bottom utility area

1px #e5e7eb top border, white background, 32–48px vertical padding. Plain 16px #000000 links separated by 4–8px gaps, small #b3b3b3 copyright line below.

### Ghost CTA Link
**Role:** 'Show more', 'View all', and 'Download catalogue' actions

No button background, no border, no padding chrome. Pure typographic: Plain 16px weight 500, #000000 text with a 1px #000000 underline. Sits flush-left in its column. The system refuses filled buttons — every action reads as a text link.

## Do's and Don'ts

### Do
- Use 1px #e5e7eb borders for all structural separation — let the hairline carry the weight that shadows and fills would in a conventional UI.
- Set display headlines at 100px Plain weight 300 with -5px letter-spacing; the whisper-weight giant is the brand's most recognizable move.
- Alternate white and #000000 full-width bands for section transitions; inversion is the only elevation in the system.
- Keep all radii at 0px except inputs at 2px; sharp corners preserve the architectural, blueprint-like surface.
- Reserve #2563eb exclusively for active links and focus indicators — never as a fill, background, or decorative element.
- Use #000000 for all primary text, headings, and nav; introduce #b3b3b3 or #6b7280 only for de-emphasized body, captions, and helper text.
- Let photography carry all warmth and color; the chrome stays achromatic so the furniture and interiors do the chromatic work.

### Don't
- Do not use filled buttons, rounded pills, or colored backgrounds for any action — the system is buttonless; communicate actions through underlined typographic links only.
- Do not apply drop shadows, blurs, or multi-layer elevation stacks; depth comes from band inversion, not from z-axis effects.
- Do not introduce additional accent colors, gradients, or chromatic fills — the 1% colorfulness is the point.
- Do not use #2563eb for decorative purposes, hover-only flourishes, or any non-text use; it signals active/linked state and nothing else.
- Do not set body copy below 16px or above 24px; the type scale jumps in confident increments, never in incremental UI sizes.
- Do not use border-radius above 2px on any element; rounded corners break the editorial Swiss-grid discipline.
- Do not place #ffffff cards on white backgrounds — the system has no card surface; use a 1px #e5e7eb frame or a full black band instead.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | White Canvas | `#ffffff` | Base page background for all editorial content |
| 1 | Inverted Black | `#000000` | Full-width inverted bands for catalogue, download, and closing sections — the sole elevation shift |

## Elevation

The system intentionally avoids shadows and z-axis elevation entirely. Depth is communicated solely through horizontal band inversion (white → black → white) and through hairline 1px borders in #e5e7eb. No component casts a shadow, no card lifts from the surface. The flatness is deliberate: it treats the page as a printed catalogue spread rather than a software interface.

## Imagery

Imagery is photograph-only, full-bleed, and unframed. The site uses large editorial plates of contract-sector interiors (hospitality, office, residential) that occupy the entire viewport — the furniture and architecture ARE the visual content. Photographs are sharp, high-key, and naturally warm-toned (terracotta, oak, marble), providing the only color the achromatic chrome refuses to supply. No illustrations, no icons, no decorative graphics except a few thin-stroke circular line-art motifs that anchor the 'Key values' grid. Product shots (book mockups, catalogue covers) appear inside the black bands as centered white objects on dark — high contrast, almost like a still life. No duotone, no overlays, no image treatments.

## Layout

Max-width ~1440px centered, full-bleed bands within. Hero opens with a full-viewport hospitality photograph, no headline overlaid — the image leads alone. Below: editorial sections with massive 100px display headlines set flush-left, followed by short body paragraphs. The 'Key values' section uses a strict 4-column equal grid with 1px borders forming the entire structure. Catalogue section breaks to a full-width black band with a 2-column layout (book mockup left, text right). Navigation is a single minimal top bar with a hairline bottom border. The rhythm is generous — 64–80px between sections, wide horizontal gutters, and no sidebar or split content within sections. Everything reads top-to-bottom as a continuous editorial scroll.

## Agent Prompt Guide

**Quick Color Reference**
- text: #000000
- background: #ffffff
- inverted background: #000000
- border: #e5e7eb
- accent (links/active): #2563eb
- primary action: no distinct CTA color

**3–5 Example Component Prompts**
1. *Hero section*: Full-bleed hospitality photograph, no overlay text. Below the image, 80px vertical padding, then a 'Contract, according to mdf italia' headline at 100px Plain weight 300, #000000, letter-spacing -5px, line-height 1.0. Followed by a 18px Plain weight 400 body paragraph in #000000, max-width 800px.

2. *Key Values grid*: 4 equal columns, 1px #e5e7eb border on every cell, 0px radius. Each cell contains a thin-stroke circular SVG (1px #e5e7eb stroke, no fill, ~200px diameter) centered in the cell. Large 50px Plain weight 300 text overlays or wraps through the circle — the text breaks across the circle's edge, no padding inside the cell.

3. *Catalogue Band*: Full-width #000000 section, 80px vertical padding. Two-column 50/50 layout. Left: a white book-mockup image, centered, 0px radius, ~60% column width. Right: 'Contract book' at 50px Plain weight 300 #ffffff, letter-spacing -2px, followed by a 16px #b3b3b3 description, then an underlined #ffffff 'Download catalogue' link in Plain 16px weight 500 with a 1px #ffffff underline.

4. *Navigation bar*: #ffffff background, 1px #e5e7eb bottom border, 0px radius. Left: 'mdf italia' wordmark in Plain 18px weight 500 #000000. Right: nav links ('Contract', 'Hospitality', 'Office', 'Reference') in Plain 16px weight 400 #000000, 32px horizontal gap, each with a 1px #e5e7eb underline.

5. *Ghost inline link*: 'Show more' or 'View all' — no background, no border, no padding. Plain 16px weight 500 #000000 with a 1px #000000 underline. On hover, color and underline shift to #2563eb.

## Similar Brands

- **Vitra** — Same Swiss-editorial layout DNA — full-bleed interior photography, hairline rule dividers, oversized type as the primary design element, buttonless link-driven navigation
- **Carl Hansen & Søn** — Identical approach to product catalogues: white canvas, black inverted bands for download sections, massive serif/sans display headlines, furniture photography providing all the color
- **Hem** — Same monochrome chrome with photography-only color strategy, oversized type set flush-left, and the refusal of filled buttons in favor of underlined typographic actions
- **Kvadrat** — Similar editorial portfolio structure — alternating white and black bands, 1px structural borders, geometric sans at extreme display sizes with tight tracking

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-pure-white: #ffffff;
  --color-absolute-black: #000000;
  --color-hairline-gray: #e5e7eb;
  --color-stone-gray: #6b7280;
  --color-ash: #b3b3b3;
  --color-quartz: #bbbbbb;
  --color-signal-blue: #2563eb;

  /* Typography — Font Families */
  --font-plain: 'Plain', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-body: 16px;
  --leading-body: 1.56;
  --text-subheading: 18px;
  --leading-subheading: 1.5;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.25;
  --tracking-heading-sm: -0.05px;
  --text-heading: 30px;
  --leading-heading: 1.13;
  --tracking-heading: -0.75px;
  --text-heading-lg: 50px;
  --leading-heading-lg: 1.08;
  --tracking-heading-lg: -2px;
  --text-display: 100px;
  --leading-display: 1;
  --tracking-display: -5px;

  /* Typography — Weights */
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-100: 100px;

  /* Layout */
  --page-max-width: 1440px;
  --section-gap: 64-80px;
  --card-padding: 24-32px;
  --element-gap: 8-12px;

  /* Border Radius */
  --radius-sm: 2px;

  /* Named Radii */
  --radius-cards: 0px;
  --radius-images: 0px;
  --radius-inputs: 2px;
  --radius-buttons: 0px;

  /* Surfaces */
  --surface-white-canvas: #ffffff;
  --surface-inverted-black: #000000;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-pure-white: #ffffff;
  --color-absolute-black: #000000;
  --color-hairline-gray: #e5e7eb;
  --color-stone-gray: #6b7280;
  --color-ash: #b3b3b3;
  --color-quartz: #bbbbbb;
  --color-signal-blue: #2563eb;

  /* Typography */
  --font-plain: 'Plain', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-body: 16px;
  --leading-body: 1.56;
  --text-subheading: 18px;
  --leading-subheading: 1.5;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.25;
  --tracking-heading-sm: -0.05px;
  --text-heading: 30px;
  --leading-heading: 1.13;
  --tracking-heading: -0.75px;
  --text-heading-lg: 50px;
  --leading-heading-lg: 1.08;
  --tracking-heading-lg: -2px;
  --text-display: 100px;
  --leading-display: 1;
  --tracking-display: -5px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-100: 100px;

  /* Border Radius */
  --radius-sm: 2px;
}
```
