# The Beams — Style Reference
> overlapping ink on white paper

**Theme:** light

The Beams is an editorial monolith: pure black ink on pure white paper, where typography does all the heavy lifting. A single weight 400 sans-serif scales from 19px body copy to 160px display, with line-heights that compress dramatically at large sizes (0.90 at display) to let letterforms overlap and collide — the signature visual. No shadows, no rounded corners, no gradients, no accent color: the design system strips UI to ink, paper, and an occasional full-bleed photograph. Density is generous and unhurried, sections separated by vast whitespace rather than dividers. The only interaction is text on text, cursor on canvas — a cultural venue that presents itself as a magazine spread rather than a website.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Ink | `#000000` | `--color-ink` | Primary text, all borders, structural rules, button text and outlines — the only chromatic signal in the system |
| Paper | `#ffffff` | `--color-paper` | Page canvas, surface backgrounds, button interiors, inverse text on dark photography |

## Tokens — Typography

### NeueHaas-web — Sole typeface across every role: 19px body, 29px subheading, 38px secondary heading, 95px hero display, 160px editorial display. Weight stays at 400 (regular) even at maximum scale — the system derives hierarchy from size and line-height compression, never from boldness. Tracking tightens to -0.03em universally. At display scale (160px), line-height drops to 0.90 so lines physically overlap, creating layered typographic compositions rather than stacked headlines. · `--font-neuehaas-web`
- **Substitute:** Neue Haas Grotesk Display Pro, Inter (weight 400), Helvetica Neue
- **Weights:** 400
- **Sizes:** 19px, 29px, 38px, 95px, 160px
- **Line height:** 0.90, 1.00, 1.10, 1.95, 2.90
- **Letter spacing:** -0.03em at all sizes
- **Role:** Sole typeface across every role: 19px body, 29px subheading, 38px secondary heading, 95px hero display, 160px editorial display. Weight stays at 400 (regular) even at maximum scale — the system derives hierarchy from size and line-height compression, never from boldness. Tracking tightens to -0.03em universally. At display scale (160px), line-height drops to 0.90 so lines physically overlap, creating layered typographic compositions rather than stacked headlines.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| body | 19px | 2.9 | -0.57px | `--text-body` |
| subheading | 29px | 1.95 | -0.87px | `--text-subheading` |
| heading-sm | 38px | 1.1 | -1.14px | `--text-heading-sm` |
| display | 160px | 0.9 | -4.8px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 6px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 6 | 6px | `--spacing-6` |
| 11 | 11px | `--spacing-11` |
| 19 | 19px | `--spacing-19` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 0px |
| cards | 0px |
| images | 0px |
| inputs | 0px |
| buttons | 0px |

### Layout

- **Section gap:** 120px
- **Card padding:** 19px
- **Element gap:** 19px

## Components

### Editorial Display Headline
**Role:** Hero typographic statement

160px NeueHaas-web weight 400, line-height 0.90, letter-spacing -0.03em, color #000000 on #ffffff. Lines overlap intentionally — multiple phrases layered at the same position create a typographic texture rather than a stacked headline. No margin or padding around the composition; it bleeds to container edges.

### Outlined Action Button
**Role:** Primary call-to-action (e.g. SIGN UP)

1px solid #000000 border, transparent background, #000000 text. Padding 11px top/bottom, 19px left/right (matches base unit). Typography: 19px NeueHaas-web weight 400. No radius. No fill state changes. A trailing arrow glyph (↗) sits inside the button as part of the text label.

### Minimal Top Navigation
**Role:** Site header

White background, no border, no background fill. Brand mark "BEAMS" in 19px weight 400 left-aligned. Center title in same weight, sentence-case. Right-side single-character icon ("+") as the only interactive element. No sticky behavior implied; sits at the very top of the page.

### Two-Column Body Block
**Role:** Narrative text pair

Two equal columns separated by whitespace (no divider, no gutter rule). Each column: 29px NeueHaas-web weight 400, line-height 1.95, #000000, -0.03em tracking. Left column carries the lead statement in shorter form; right column expands with supporting prose. Generous vertical breathing room (120px+) above and below.

### Full-Bleed Photographic Section
**Role:** Atmospheric content moment

Edge-to-edge image (no border-radius, no margin, no frame). Overlays sit as text directly on the photograph. The button variant anchored to the top-right corner uses the Outlined Action Button style but in white outline + white text against the dark photographic area. A "Sound on/off" toggle in the bottom-left uses 19px body type, no background, no border — just text.

### Body Paragraph
**Role:** Standard running text

19px NeueHaas-web weight 400, line-height 2.90 (extremely generous), color #000000, letter-spacing -0.03em. No first-line indent, no paragraph spacing beyond line-height. The 2.9 ratio on 19px produces ~55px line height — an editorial luxury-magazine measure.

### Inline Link
**Role:** Navigable text

Inherits body typography. No underline by default, no color change — the only signal is the 1px bottom border in #000000 applied directly to the text. Border sits tight to the baseline rather than the descender.

### List Item
**Role:** Navigation or content list

19px body type, 1px solid #000000 bottom border per item. Vertical padding 11px. No bullets, no markers — the border itself provides structure. Stacked items read as a typographic index.

### Form Input
**Role:** Text entry field

Transparent or #ffffff background, 1px solid #000000 bottom border only (no full border box), 19px body type, no placeholder color treatment beyond a lighter opacity. Padding 6px vertical. No focus ring, no box-shadow on focus — the existing border thickens or color inverts.

### Footer Block
**Role:** Closing content area

White background, no border. Body text and list items in 19px weight 400. 46px top margin separates footer from preceding content. 19px column gap between footer items. Structure: text columns rather than a framed panel.

## Do's and Don'ts

### Do
- Use only #000000 and #ffffff — no gray, no accent, no tint. Every element must commit to full black or full white.
- Set every text element to weight 400; derive hierarchy from size and line-height compression, never from boldness.
- Set letter-spacing to -0.03em on all text regardless of size.
- Compress line-height at display sizes (0.90–1.00 at 95px and above) to let lines overlap and form typographic compositions.
- Use 1px solid #000000 borders for all structural elements — dividers, button outlines, input underlines, list separators.
- Set border-radius to 0 on every component — buttons, inputs, images, cards. Sharp corners only.
- Bleed photographs and display text edge-to-edge. Never frame an image with a border, shadow, or margin.

### Don't
- Never introduce a chromatic color, gradient, or shadow — the system is strictly binary.
- Never use font-weight above 400; no bold, no medium, no semibold variants.
- Never round corners on any element — buttons, cards, inputs, and images stay perfectly square.
- Never use a color or background highlight to indicate hover or active states — change nothing, or thicken the existing border.
- Never stack display headlines with generous line-height; the overlap at 0.90 is the signature, not a bug.
- Never add padding or margin to display text; let the 160px type bleed to its container edges.
- Never add decorative elements — no icons beyond single glyphs, no illustrations, no patterns, no dividers beyond 1px rules.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Paper | `#ffffff` | Page canvas, the only surface in the system |

## Elevation

The system uses zero elevation. No shadows, no glows, no z-axis depth. Dimensionality comes entirely from typographic overlap at display scale and from full-bleed photography replacing flat surface. Every element sits flush on the paper.

## Imagery

Photography is the sole non-typographic visual element. Treatment is full-bleed, edge-to-edge, uncropped, no border-radius. Imagery carries dramatic, atmospheric content — long-exposure light trails, warm amber beams cutting through dark interiors — and acts as emotional punctuation between white typographic sections. No icons, no illustrations, no decorative graphics. Image-to-text ratio is low: one or two photographs per page, each large enough to dominate its section.

## Layout

Full-bleed, edge-to-edge composition with no max-width container. The hero is a centered overlapping typographic block with no supporting visual; subsequent sections alternate between full-bleed photography and white-text-only blocks. Content below photography uses a two-column layout (split roughly 1:1) with no gutter rule — separation is whitespace alone. Navigation is a single thin top bar with three text elements left/center/right. No sidebar, no grid of cards, no pricing table. The page reads as a vertical sequence of full-width sections separated by 100–120px of white space. No sticky elements, no floating UI.

## Agent Prompt Guide

**Quick Color Reference**
- text: #000000
- background: #ffffff
- border: #000000
- primary action: no distinct CTA color

**Example Component Prompts**

1. *Editorial hero headline:* Render "Centre For New Culture" at 160px NeueHaas-web weight 400, color #000000, line-height 0.90, letter-spacing -0.03em on a #ffffff background. Layer two additional instances of the same phrase at the same size and position with slight vertical offset to create an overlapping typographic composition. No padding, no margin — bleed to container edges.

2. *Outlined action button:* Build a button with transparent background, 1px solid #000000 border, #000000 text reading "SIGN UP ↗" in 19px NeueHaas-web weight 400, letter-spacing -0.03em. Padding 11px vertical, 19px horizontal. Border-radius 0. Position top-right of a full-bleed dark photographic section; invert the border and text to #ffffff against the dark image.

3. *Two-column narrative block:* Two equal-width columns of 29px NeueHaas-web weight 400 body text, line-height 1.95, color #000000, letter-spacing -0.03em on #ffffff. No visible divider between columns — 60–80px of whitespace separates them. Left column: 6–8 word lead statement. Right column: 2–3 sentences of supporting prose. 120px white space above and below the block.

4. *Full-bleed atmospheric photograph:* Edge-to-edge image filling the full viewport width, no border, no border-radius, no margin. A short text overlay in 19px weight 400 sits in the bottom-left ("Sound on/off"); an outlined action button sits in the top-right. The photograph should carry dramatic directional light (beams, rays, shafts) in warm amber/orange tones against a dark interior.

5. *Minimal top navigation:* A single horizontal bar, 19px NeueHaas-web weight 400, #000000 on #ffffff, no border, no background fill. Left: "BEAMS". Center: page title in sentence case. Right: a single "+" glyph. No hover states, no dropdowns, no sticky behavior.

## Typographic Composition Rules

The system produces visual interest through three typographic moves that should be used deliberately:

1. **Overlap at display scale** — when text exceeds 95px, the 0.90–1.00 line-height causes lines to physically touch and overlap. Use this for hero and section-opening headlines, never for body or subheading.

2. **Layered repetition** — a phrase repeated at the same position with slight offset creates texture and emphasis without adding a second visual element. This is the system's only form of typographic emphasis.

3. **Uniform tracking** — -0.03em applies at all sizes. The visual tightness is consistent from 19px body to 160px display, which is what makes the system feel cohesive despite the extreme size range.

## Similar Brands

- **Vitra** — Same editorial minimalism — near-zero UI chrome, photography as atmosphere, and typography-as-hero at extreme display scale.
- **Apple iPhone Pro (product page)** — Full-bleed dark photography punctuated by stark white type, no borders or shadows, single-weight display type.
- **Magazine Antidote (creative agency)** — Overlapping display headlines on white, binary black/white palette, and a magazine-spread approach to web layout.
- **Galerie Kreo** — Cultural/gallery presentation with zero decorative UI, weight 400 display type at enormous scale, and full-bleed imagery.

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-ink: #000000;
  --color-paper: #ffffff;

  /* Typography — Font Families */
  --font-neuehaas-web: 'NeueHaas-web', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-body: 19px;
  --leading-body: 2.9;
  --tracking-body: -0.57px;
  --text-subheading: 29px;
  --leading-subheading: 1.95;
  --tracking-subheading: -0.87px;
  --text-heading-sm: 38px;
  --leading-heading-sm: 1.1;
  --tracking-heading-sm: -1.14px;
  --text-display: 160px;
  --leading-display: 0.9;
  --tracking-display: -4.8px;

  /* Typography — Weights */
  --font-weight-regular: 400;

  /* Spacing */
  --spacing-unit: 6px;
  --spacing-6: 6px;
  --spacing-11: 11px;
  --spacing-19: 19px;

  /* Layout */
  --section-gap: 120px;
  --card-padding: 19px;
  --element-gap: 19px;

  /* Named Radii */
  --radius-tags: 0px;
  --radius-cards: 0px;
  --radius-images: 0px;
  --radius-inputs: 0px;
  --radius-buttons: 0px;

  /* Surfaces */
  --surface-paper: #ffffff;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-ink: #000000;
  --color-paper: #ffffff;

  /* Typography */
  --font-neuehaas-web: 'NeueHaas-web', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-body: 19px;
  --leading-body: 2.9;
  --tracking-body: -0.57px;
  --text-subheading: 29px;
  --leading-subheading: 1.95;
  --tracking-subheading: -0.87px;
  --text-heading-sm: 38px;
  --leading-heading-sm: 1.1;
  --tracking-heading-sm: -1.14px;
  --text-display: 160px;
  --leading-display: 0.9;
  --tracking-display: -4.8px;

  /* Spacing */
  --spacing-6: 6px;
  --spacing-11: 11px;
  --spacing-19: 19px;
}
```
