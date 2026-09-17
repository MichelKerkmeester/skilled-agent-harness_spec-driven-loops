# Intra — Style Reference
> white-walled gallery placard with one giant black eye

**Theme:** light

Intra is a brutally editorial cafe identity: a white canvas dominated by an oversized black eye-mark and gigantic sans-serif wordmarks that read like gallery wall text. Color is almost entirely suppressed — only black, near-black, white, and a single hairline gray — so that the bright packaging of its coffee bags (magenta, lime, terracotta) detonates against the monochrome page like curated art objects. Type is the interface: 95px Whyte at weight 400 does the heavy lifting that buttons and color would do on a conventional site, and every section breathes through generous 100px vertical padding and wide 50px gutters. The aesthetic borrows from Swiss editorial print, brutalist signage, and museum labeling — content is presented as a series of facts, images, and objects rather than wrapped in a product UI.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Paper White | `#ffffff` | `--color-paper-white` | Page canvas, card surfaces, type knocked out of black panels |
| Ink Black | `#212529` | `--color-ink-black` | Primary text, bold panels, the dominant non-white surface — carries a barely-perceptible cool tint that softens it from pure #000 |
| Pure Black | `#000000` | `--color-pure-black` | Button strokes, logo fill, and the heaviest typographic moments where absolute zero contrast is required |
| Hairline Gray | `#e4e4e4` | `--color-hairline-gray` | Dividers, card borders, image outlines, table rules — the only mid-tone in the system |

## Tokens — Typography

### Whyte — Single-weight type system. 95px display headlines for the wordmark and section titles carry the brand's editorial weight; 18–20px reads as body and meta; 16px as captions and link lists. The single weight (400) at all sizes is a signature choice — no bold, no light, the hierarchy is built through SIZE, not stroke. Substitute with Inter, Söhne, or Neue Haas Grotesk. · `--font-whyte`
- **Substitute:** Inter or Söhne
- **Weights:** 400
- **Sizes:** 16px, 18px, 20px, 95px
- **Line height:** 1.00 for display, 1.50 for body
- **Role:** Single-weight type system. 95px display headlines for the wordmark and section titles carry the brand's editorial weight; 18–20px reads as body and meta; 16px as captions and link lists. The single weight (400) at all sizes is a signature choice — no bold, no light, the hierarchy is built through SIZE, not stroke. Substitute with Inter, Söhne, or Neue Haas Grotesk.

### -apple-system — System fallback for environments where Whyte is unavailable; inherits macOS/iOS native rhythm. Use only as the last-resort stack, not the primary voice. · `--font-apple-system`
- **Substitute:** system-ui
- **Weights:** 400
- **Sizes:** 16px, 20px
- **Line height:** 1.50
- **Role:** System fallback for environments where Whyte is unavailable; inherits macOS/iOS native rhythm. Use only as the last-resort stack, not the primary voice.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| body | 16px | 1.5 | — | `--text-body` |
| subheading | 18px | 1.5 | — | `--text-subheading` |
| heading | 20px | 1.5 | — | `--text-heading` |
| display | 95px | 1 | — | `--text-display` |

## Tokens — Spacing & Shapes

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 6 | 6px | `--spacing-6` |
| 10 | 10px | `--spacing-10` |
| 15 | 15px | `--spacing-15` |
| 20 | 20px | `--spacing-20` |
| 40 | 40px | `--spacing-40` |
| 50 | 50px | `--spacing-50` |
| 78 | 78px | `--spacing-78` |
| 100 | 100px | `--spacing-100` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 0px |
| cards | 0px |
| images | 0px |
| buttons | 0px |

### Layout

- **Section gap:** 100px
- **Card padding:** 40px
- **Element gap:** 20px

## Components

### Eye Logo Lockup
**Role:** Primary brand mark — the most identifiable asset on the site

A large black oval with a centered circular pupil, stacked above the wordmark "INTRA" set in 95px Whyte. Used at full-bleed scale on the home page as a hero panel. Always 0px radius, always pure black on white, no color variants.

### Display Wordmark Section
**Role:** Editorial section header — replaces what a colored banner or card would do on a conventional site

One or two words (CAFE, HOURS, BUY IN-STORE) at 95px Whyte weight 400, line-height 1.0, color #212529 on #ffffff. The word IS the section header. No subhead, no decorative element. Let the size carry the page.

### Body Text Block
**Role:** Long-form copy describing the venue, menu philosophy, hours

16–18px Whyte weight 400, line-height 1.50, color #212529, max-width reads around 50–60 characters. Paragraph spacing roughly 20px. No drop caps, no pull quotes — the type speaks plainly.

### Hairline Divider
**Role:** Section separation

1px line in #e4e4e4 spanning the full column width. No drop shadow, no color fill, no decorative element — just a flat rule between blocks.

### Product Card (Coffee Bag)
**Role:** Showcase tile for available single-origin beans

Rectangular card with 0px radius, 1px #e4e4e4 border, no shadow. Contains a flat-color product photograph (magenta, lime, terracotta) on a #ffffff background, with origin name ("Ethiopia", "Honduras", "Staple") set large in 20px Whyte above the image. The bag photo provides the only chromatic moment on the page.

### Outlined Action Button
**Role:** Navigation and call-to-action control

1px #000000 border, 0px radius, 6px horizontal × 1px vertical padding, color #000000, text 16–20px Whyte weight 400. The minimal vertical padding (1px) creates a very thin, type-like bar — this button reads as underlined text with a stroke, not a conventional pill. Used for "BUY IN-STORE" and similar nav-style actions.

### Editorial Photo Block
**Role:** Documentary imagery of the venue and team

Full-bleed or column-width photograph with 0px radius, framed by 78px horizontal margins to let it sit within a 3-column grid. Treatment is unmanipulated, high-resolution, slightly desaturated to harmonize with the monochrome page.

### Metadata Row
**Role:** Hours, locations, and structured information

16–20px Whyte weight 400, color #212529, arranged in a left-aligned two-column or stacked list with 15px vertical padding per row. No icons, no color coding, no badges — just plain labels and values.

### Link List (Footer/Info)
**Role:** Secondary navigation and contact links

16px Whyte weight 400, color #212529 with #000000 underline, 15px vertical padding between items. No hover color change documented — the link is defined by the underline, not by a color shift.

### Black Panel Block
**Role:** Inverse section — the only large dark surface on the site

Full-width #212529 (or #000000) background with white type (#ffffff) at the same 95px display scale. Used sparingly as a counterpoint to the white canvas, often for the logo or a single statement word.

## Do's and Don'ts

### Do
- Use 95px Whyte weight 400 as the only display size — never split into bold/regular variants, let the SIZE carry hierarchy.
- Hold the page to four colors total: #ffffff canvas, #212529 ink, #000000 for the heaviest moments, #e4e4e4 hairlines.
- Use 0px border-radius on every component — cards, buttons, images, tags. Sharp corners are the brand.
- Set section padding to 100px top and bottom, with 50px horizontal gutters — the breathing room IS the layout.
- Let product photography supply color: when a colored element is needed, use a real product image rather than introducing a new brand color.
- Use 1px outlined buttons with 6px horizontal / 1px vertical padding — the bar should feel like a typographic underline, not a conventional CTA.
- Keep the body line-height at 1.50 and the display line-height at 1.00 — never let the giant headlines feel airy.

### Don't
- Don't introduce a chromatic accent color for buttons, links, badges, or icons — there is no brand color in this system, the packaging supplies the only saturation.
- Don't use drop shadows, gradients, or blur effects — surfaces are flat, defined only by hairline borders.
- Don't use rounded corners anywhere, even on tags or avatars — everything is a sharp rectangle.
- Don't use bold (weight 600+) or light (weight 300) cuts of Whyte — weight 400 is the only voice, all hierarchy is typographic scale.
- Don't add icons, emojis, or decorative glyphs to the UI — the eye mark and the wordmark are the only marks.
- Don't split the giant wordmark into multiple lines or hyphenate it — "CAFE", "HOURS", "INTRA" each occupy one line at 95px.
- Don't apply a hover color change to links — the underline is the affordance, not a color shift.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Paper | `#ffffff` | Page canvas — the dominant background, covering most of the viewport |
| 1 | Ink Panel | `#212529` | Inverse sections, logo plate, and the rare dark band that punctuates the white page |

## Elevation

Intra uses no shadow elevation at all. Depth is created by hairline 1px #e4e4e4 borders and by alternating white canvas with full-bleed #212529 panels. Components do not float — they sit on the page as printed elements.

## Imagery

Imagery is documentary and editorial: unmanipulated photographs of the two owners inside the venue, shot in available light with slightly desaturated tones that harmonize with the monochrome page. Product photography of the coffee bags is the chromatic event of the page — flat, high-contrast, full-bleed within a hairline-framed card, with vivid packaging colors (magenta #d92a8a-ish, lime #c5e63a-ish, terracotta) that become the only color on an otherwise achromatic site. No illustrations, no 3D renders, no abstract graphics. Icons are absent — the eye mark is the only iconography. Photography occupies roughly 30–40% of the page and is contained, never full-bleed, framed by 0px-radius edges and 78px gutters.

## Layout

Full-bleed multi-column grid that fills the viewport without a max-width container. The page is divided into roughly three vertical columns: a large left panel for the eye mark, a center column for display wordmarks and body text, and a right column for product cards and a secondary black panel. Section rhythm alternates white canvas with an occasional #212529 black panel rather than white/gray bands. The hero is a giant eye-mark on white with no headline or CTA — the mark itself is the hero. Section spacing is generous: 100px vertical padding between blocks creates a gallery-walk feel rather than a scrolling feed. Navigation is minimal — likely a top bar with simple text links rather than a sticky header. Cards are arranged in a vertical stack in the right rail, not a grid. The overall page model is editorial print more than SaaS dashboard.

## Agent Prompt Guide

Quick Color Reference:
- text: #212529
- background: #ffffff
- border/hairline: #e4e4e4
- accent: #000000 (logo fill, button strokes)
- primary action: no distinct CTA color

Example Component Prompts:

1. Create an editorial hero: full-bleed #ffffff canvas. Centered or left-aligned display wordmark "CAFE" at 95px Whyte weight 400, line-height 1.0, color #212529. 100px top and bottom padding. No background panel, no button, no subhead — the word IS the section.

No distinct primary action color was observed; use the extracted neutral button treatments instead of inventing a filled CTA color.

3. Create a metadata/hours row: two-column or stacked list. Labels in 16px Whyte weight 400 color #212529, values in 16px Whyte weight 400 color #212529, 15px vertical padding between rows. No icons, no dividers, no color coding.

4. Create an outlined navigation button: 1px #000000 border, 0px radius, 6px horizontal padding × 1px vertical padding. Text "BUY IN-STORE" at 16–20px Whyte weight 400 color #000000. Sits in the top bar, uppercase or title case, no fill, no shadow.

5. Create a black inverse panel: full-width #212529 background, 100px vertical padding. White (#ffffff) 95px display text centered or left-aligned, line-height 1.0. Use to punctuate the page and provide a visual counterweight to the white canvas.

## Typography Philosophy

Intra uses a single weight (400) of one typeface (Whyte) at radically different sizes. The 95px display scale is not decoration — it replaces the role that color, iconography, and buttons play on a conventional site. When a new section needs emphasis, scale the type up, never add a color, never add a weight, never add a graphic. This is a constraint, not a limitation: it forces the content to be the visual hierarchy.

## Color Source Rule

The UI itself never carries a chromatic color. If a screen needs warmth, vitality, or visual energy, it must come from photography of real objects (the coffee bags, the venue, the people). Never introduce a new brand hex for a button background, link hover, badge fill, or icon stroke. The packaging photography is the only palette the system ever needs.

## Similar Brands

- **Aesop** — Same restrained editorial typography at oversized scale, near-monochrome canvas, sharp 0px corners, and product photography as the sole source of color saturation
- **The Wing / Soho House site** — Similar gallery-walk layout with hairline dividers, document-style body copy, and type that reads as wall labels rather than web copy
- **Muji** — Shared brutalist restraint — flat surfaces, single weight sans-serif, 0px radii, and a refusal to decorate the UI with color or shadow
- **Kinfolk Magazine** — Same Swiss-print sensibility: oversized single-weight display type, generous 100px+ vertical breathing room, documentary photography, and near-achromatic palette

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-paper-white: #ffffff;
  --color-ink-black: #212529;
  --color-pure-black: #000000;
  --color-hairline-gray: #e4e4e4;

  /* Typography — Font Families */
  --font-whyte: 'Whyte', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-apple-system: '-apple-system', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 18px;
  --leading-subheading: 1.5;
  --text-heading: 20px;
  --leading-heading: 1.5;
  --text-display: 95px;
  --leading-display: 1;

  /* Typography — Weights */
  --font-weight-regular: 400;

  /* Spacing */
  --spacing-6: 6px;
  --spacing-10: 10px;
  --spacing-15: 15px;
  --spacing-20: 20px;
  --spacing-40: 40px;
  --spacing-50: 50px;
  --spacing-78: 78px;
  --spacing-100: 100px;

  /* Layout */
  --section-gap: 100px;
  --card-padding: 40px;
  --element-gap: 20px;

  /* Named Radii */
  --radius-tags: 0px;
  --radius-cards: 0px;
  --radius-images: 0px;
  --radius-buttons: 0px;

  /* Surfaces */
  --surface-paper: #ffffff;
  --surface-ink-panel: #212529;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-paper-white: #ffffff;
  --color-ink-black: #212529;
  --color-pure-black: #000000;
  --color-hairline-gray: #e4e4e4;

  /* Typography */
  --font-whyte: 'Whyte', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-apple-system: '-apple-system', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 18px;
  --leading-subheading: 1.5;
  --text-heading: 20px;
  --leading-heading: 1.5;
  --text-display: 95px;
  --leading-display: 1;

  /* Spacing */
  --spacing-6: 6px;
  --spacing-10: 10px;
  --spacing-15: 15px;
  --spacing-20: 20px;
  --spacing-40: 40px;
  --spacing-50: 50px;
  --spacing-78: 78px;
  --spacing-100: 100px;
}
```
