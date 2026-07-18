# MANNA — Style Reference
> Architecture monograph at golden hour — warm bone pages, rust accent panels, and oversized grotesk display type floating over full-bleed photography.

**Theme:** light

MANNA operates as an architecture monograph laid flat on the screen: expansive photography commands the canvas, typography arrives in two scales (whisper and shout), and the page alternates between warm bone and terracotta rust like rooms in a sunlit house. There is almost no UI chrome — no buttons, no cards, no rounded containers — instead images sit edge-to-edge framed by hairline black rules, and captions float in the gutter beneath. The palette is brutally disciplined: a single chromatic accent (rust orange) used only for full-bleed section panels, everything else is bone white, black ink, and photography. Type is editorial: a geometric grotesk at weight 300 or 500 for monumental display words, a humanist sans for image captions and quiet running text. The result feels less like a website and more like the opening spread of an architecture book.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Bone | `#f2edde` | `--color-bone` | Primary canvas, page background, footer surface — warm off-white that reads as paper, not screen |
| Rust | `#af6446` | `--color-rust` | Full-bleed section panels, footer band — terracotta accent that anchors the page in earthy materiality |
| Ink | `#000000` | `--color-ink` | All text, image borders, hairline rules — pure black for maximum contrast against bone |

## Tokens — Typography

### Scto Grotesk A — Display and heading type. Weight 500 at ~60px for monumental section labels (MANNA, ABOUT) that anchor the bottom of the viewport; weight 300 for softer subheadings. The geometric grotesk proportions with high x-height give the display words architectural weight without becoming decorative. · `--font-scto-grotesk-a`
- **Substitute:** Space Grotesk
- **Weights:** 300, 500
- **Sizes:** 14px, 60px
- **Line height:** 1.29
- **Letter spacing:** normal
- **Role:** Display and heading type. Weight 500 at ~60px for monumental section labels (MANNA, ABOUT) that anchor the bottom of the viewport; weight 300 for softer subheadings. The geometric grotesk proportions with high x-height give the display words architectural weight without becoming decorative.

### Merlo — Body text, image captions, running copy. The humanist warmth of Merlo softens the grotesk display type and reads as editorial annotation — the voice of the architect narrating over the work. 26px for intro paragraphs, 16px for captions and metadata. · `--font-merlo`
- **Substitute:** Söhne or Inter
- **Weights:** 400
- **Sizes:** 16px, 26px
- **Line height:** 1.23–1.50
- **Role:** Body text, image captions, running copy. The humanist warmth of Merlo softens the grotesk display type and reads as editorial annotation — the voice of the architect narrating over the work. 26px for intro paragraphs, 16px for captions and metadata.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 14px | 1.29 | — | `--text-caption` |
| body-sm | 16px | 1.5 | — | `--text-body-sm` |
| subheading | 26px | 1.23 | — | `--text-subheading` |
| display | 60px | 1.29 | — | `--text-display` |

## Tokens — Spacing & Shapes

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 10 | 10px | `--spacing-10` |
| 12 | 12px | `--spacing-12` |
| 20 | 20px | `--spacing-20` |

### Border Radius

| Element | Value |
|---------|-------|
| images | 0px |
| buttons | 0px |
| containers | 0px |

### Layout

- **Section gap:** 60px
- **Card padding:** 0px
- **Element gap:** 12-20px

## Components

### Full-Bleed Photograph
**Role:** Primary content unit — every project image fills its column edge-to-edge

No border-radius. Surrounded by 1px solid #000000 hairline border. Caption sits below in 14px Merlo, separated by 10px margin-bottom. Images are uncropped, uncaptioned within the frame — the photograph IS the component.

### Image Caption
**Role:** Annotation beneath each project photograph

14px Merlo weight 400, #000000. Left-aligned to image edge. 10px margin-bottom from image. No italic, no bold — treated as quiet editorial footnote.

### Display Word Marker
**Role:** Anchors the bottom of a section like a section title in a book chapter

60px Scto Grotesk A weight 500, #000000, left-aligned at viewport edge. These are the largest type elements on the page (MANNA, ABOUT) and they function as wayfinding without navigation chrome.

### Rust Section Panel
**Role:** Full-bleed colored band that divides the page like a room transition

Background #af6446, no padding override, no border. Contains text and images at standard black-on-rust contrast (4.7:1, AA). Functions as accent — appears sparingly, never as CTA fill.

### Bone Section Panel
**Role:** Default page surface

Background #f2edde, no border, no radius. The neutral ground on which photography and type rest.

### Horizontal Image Row
**Role:** 3-column or 2-column image grid at section top

Images arranged side-by-side at full height of the row, equal columns, 0px gap. Each image has its own 1px black border and its own caption. Reads as a contact sheet.

### Footer Band
**Role:** Page footer with contact and credits

Background #f2edde or #af6446, 20px padding on all sides. Merlo 16px text. No dividers, no links styled as buttons — plain text links in #000000.

## Do's and Don'ts

### Do
- Use 0px border-radius on every image, container, and surface — this is an editorial system, not a product UI
- Frame every photograph with 1px solid #000000 hairline border
- Set display type at 60px Scto Grotesk A weight 500, anchored to the viewport edge (left or right) as wayfinding markers
- Use 14px Merlo for all image captions, separated by 10px from the image bottom
- Apply #af6446 rust only as full-bleed section backgrounds — never as button fills, badges, or icon tints
- Maintain comfortable density: 12-20px gaps between elements, 60px between major sections
- Let photography be the content — avoid decorative overlays, gradients, or cards wrapping images

### Don't
- Do not introduce rounded corners on any element — the 0px radius is non-negotiable for the editorial feel
- Do not use #af6446 as a CTA or button background — it is a section panel color, not an action color
- Do not add drop shadows, elevation, or z-depth — surfaces are flat planes
- Do not mix more than two type sizes within a single section — the system runs on whisper (14px) and shout (60px)
- Do not apply letter-spacing, text-transform, or font-feature decorations to display type — it speaks at default grotesk proportions
- Do not fill icons or UI elements with the rust color — it belongs only on full-bleed backgrounds
- Do not add navigation buttons, hamburger menus, or overlay UI — the page is the navigation

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Bone Canvas | `#f2edde` | Default page background — warm paper-white ground for photography and text |
| 1 | Rust Panel | `#af6446` | Full-bleed accent section — provides chromatic punctuation and room-transition rhythm |

## Elevation

The system is deliberately flat — no drop shadows, no blur, no z-depth. Spatial separation is achieved through full-bleed color shifts (bone → rust), hairline 1px black borders around images, and generous whitespace. The only 'elevation' is the literal photographic subject rising from the flat plane.

## Imagery

Photography is the entire content system. Full-bleed architectural photographs dominate every section — tight crops of materials, trees, grasses, interior details, and building exteriors. Treatment is naturalistic and high-fidelity: no filters, no duotone, no color grading that departs from documentary realism. Images are framed by 1px black hairline borders and arranged in horizontal contact-sheet rows (2–3 columns at full viewport height). No illustration, no icons, no abstract graphics — the architecture itself provides all visual interest. Photography occupies 70-80% of viewport space; text floats in the remaining space as caption, heading, or section marker.

## Layout

Full-bleed page model with no max-width container. Sections flow vertically as alternating bone and rust bands. The hero pattern is a horizontal row of 2–3 full-height photographs side by side, each with a small caption beneath, followed by a large display word marker (60px grotesk) anchored to a viewport corner that labels the section. Navigation is minimal — likely a small text logo top-left. The layout reads as a vertical scroll through an architecture portfolio: image row → display word → image row → display word. No card grids, no pricing tables, no feature blocks — just photography and oversized type alternating with rust accent panels. Content density is spacious: each section breathes with 60px+ vertical gap.

## Agent Prompt Guide

Quick Color Reference:
- text: #000000
- background: #f2edde (bone canvas)
- border: #000000 (1px hairlines on images)
- accent: #af6446 (rust section panels only)
- primary action: no distinct CTA color

Example Component Prompts:

1. Create a 3-column image row: each image fills its column at full viewport height, 0px gap between columns. Every image has a 1px solid #000000 border. Below each image, a caption in 14px Merlo weight 400, #000000, separated by 10px margin-bottom.

2. Create a full-bleed section marker: 60px Scto Grotesk A weight 500 in #000000, left-aligned to viewport left edge with 20px padding. No background, no border — type sits directly on the #f2edde bone canvas.

3. Create a rust accent band: full-bleed background #af6446, 0px border-radius, 60px vertical padding. Content inside is 16px Merlo weight 400 in #000000. No buttons, no cards — text only.

4. Create a project page layout: hero is a single full-bleed photograph with 1px #000000 border, no caption. Below at 60px gap, the project title in 60px Scto Grotesk A weight 500 #000000. Below at 20px gap, a 26px Merlo intro paragraph in #000000. Below at 60px gap, a 2-column image grid with 1px borders and 14px Merlo captions.

5. Create a footer: background #f2edde, 20px padding all sides, 16px Merlo text in #000000. Contact details and credits as plain text links — no button styling, no rounded containers, no icons.

## Two-Color Discipline

The entire visual system operates on exactly two surface colors (bone #f2edde and rust #af6446) plus black ink. This is a constraint, not a limitation. Any new page or component must reuse these two surfaces — never introduce grays, off-whites, or additional chromatic tones. Rust is rationed: it appears only as full-bleed section panels, never as a fill on buttons, icons, borders, or text. If you need a visual division, shift the full section to rust rather than introducing a third color.

## Typography Voice

The site has exactly two typographic voices: Scto Grotesk A at weight 500 for monumental display (project names, section markers at 60px) and Merlo at weight 400 for everything else (captions at 14px, body at 16px, intros at 26px). The contrast between a geometric grotesk display and a humanist body sans is the entire typographic system. Do not add a third typeface. Do not introduce italic, bold, or decorative weights beyond 300 and 500 in Scto Grotesk A.

## Similar Brands

- **Studio Mumbai** — Same architecture-monograph approach — photography-dominant pages, minimal UI, warm earthy palette, and editorial display type
- **Edition Office** — Full-bleed architectural photography, hairline-framed images, warm neutral canvas, and oversized grotesk section markers
- **Neri&Hu** — Editorial architecture portfolio with restrained palette, large-scale type as wayfinding, and photography as the primary interface
- **David Chipperfield Architects** — Monograph-style web presence with generous whitespace, flat surfaces, and text-as-architecture rather than UI elements

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-bone: #f2edde;
  --color-rust: #af6446;
  --color-ink: #000000;

  /* Typography — Font Families */
  --font-scto-grotesk-a: 'Scto Grotesk A', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-merlo: 'Merlo', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.29;
  --text-body-sm: 16px;
  --leading-body-sm: 1.5;
  --text-subheading: 26px;
  --leading-subheading: 1.23;
  --text-display: 60px;
  --leading-display: 1.29;

  /* Typography — Weights */
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-medium: 500;

  /* Spacing */
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-20: 20px;

  /* Layout */
  --section-gap: 60px;
  --card-padding: 0px;
  --element-gap: 12-20px;

  /* Named Radii */
  --radius-images: 0px;
  --radius-buttons: 0px;
  --radius-containers: 0px;

  /* Surfaces */
  --surface-bone-canvas: #f2edde;
  --surface-rust-panel: #af6446;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-bone: #f2edde;
  --color-rust: #af6446;
  --color-ink: #000000;

  /* Typography */
  --font-scto-grotesk-a: 'Scto Grotesk A', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-merlo: 'Merlo', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.29;
  --text-body-sm: 16px;
  --leading-body-sm: 1.5;
  --text-subheading: 26px;
  --leading-subheading: 1.23;
  --text-display: 60px;
  --leading-display: 1.29;

  /* Spacing */
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-20: 20px;
}
```
