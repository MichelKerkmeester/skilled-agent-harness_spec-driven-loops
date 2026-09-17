# 70Materia — Style Reference
> Architectural sample board on white paper — the UI is the mount, never the artwork.

**Theme:** light

70Materia is a neutral frame built to disappear around its content — a curated material library where the UI chrome is deliberately invisible so stone, terrazzo, and pigment samples can dominate. Every typographic element sits at weight 400 in a single sans family (Matter), with a monospace companion (Matter Mono) used for labels, navigation, and small UI controls. Letter-spacing on the mono (0.02em–0.04em) plus tabular numerals gives the interface a spec-sheet, architectural-drawing quality — as if the page itself is a technical sample board. The palette is strictly achromatic: black text, white surfaces, and a warm mid-gray canvas (#bababa) that recedes behind the photography. Buttons are thin, square, and outlined; the only filled surface is a near-black (#1e1e1e) for select actions and the footer. No accent color exists in the system — all chromatic energy is outsourced to the product photography.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Obsidian | `#000000` | `--color-obsidian` | Primary text, hairline borders, navigation outlines — the structural ink |
| Bone | `#ffffff` | `--color-bone` | Page highlights, card surfaces, text on dark surfaces, button outlines |
| Graphite | `#1e1e1e` | `--color-graphite` | Filled button background, footer surface, dark UI blocks — warm near-black replacing pure black for non-text surfaces |
| Ash | `#bababa` | `--color-ash` | Dominant page canvas, muted dividers, secondary surface tone |

## Tokens — Typography

### Matter — Primary text family for headings, body, hero captions, and links. Used exclusively at weight 400 — no bold variation exists in the system, which forces hierarchy through size and placement rather than weight. Custom font with tabular numerals ("tnum") baked in, so numbers in body copy align like a price list. · `--font-matter`
- **Substitute:** Inter, Söhne, or Untitled Sans at weight 400
- **Weights:** 400
- **Sizes:** 15px, 19px, 20px
- **Line height:** 1.20
- **OpenType features:** `"tnum"`
- **Role:** Primary text family for headings, body, hero captions, and links. Used exclusively at weight 400 — no bold variation exists in the system, which forces hierarchy through size and placement rather than weight. Custom font with tabular numerals ("tnum") baked in, so numbers in body copy align like a price list.

### Matter Mono — Micro-label and UI chrome family — navigation items, button text, section labels, product codes (AT.OLO). Letter-spacing of 0.02em–0.04em widens the mono into a uppercase-leaning technical readout. This font carries the brand's architectural-drawing personality; without it the page reads as a generic minimalist site. · `--font-matter-mono`
- **Substitute:** JetBrains Mono, IBM Plex Mono, or Berkeley Mono
- **Weights:** 400
- **Sizes:** 10px, 12px
- **Line height:** 1.20–1.30
- **Letter spacing:** 0.02em (12px) and 0.04em (10px)
- **OpenType features:** `"tnum"`
- **Role:** Micro-label and UI chrome family — navigation items, button text, section labels, product codes (AT.OLO). Letter-spacing of 0.02em–0.04em widens the mono into a uppercase-leaning technical readout. This font carries the brand's architectural-drawing personality; without it the page reads as a generic minimalist site.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 10px | 1.3 | 0.4px | `--text-caption` |
| body | 15px | 1.2 | — | `--text-body` |
| subheading | 19px | 1.2 | — | `--text-subheading` |

## Tokens — Spacing & Shapes

**Base unit:** 8px

**Density:** compact

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 8 | 8px | `--spacing-8` |
| 12 | 12px | `--spacing-12` |
| 24 | 24px | `--spacing-24` |
| 100 | 100px | `--spacing-100` |
| 180 | 180px | `--spacing-180` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 0px |
| cards | 0px |
| inputs | 0px |
| buttons | 3px |

### Layout

- **Page max-width:** 960px
- **Section gap:** 100-180px
- **Card padding:** 24px
- **Element gap:** 8px

## Components

### Primary Outlined Button
**Role:** Default action trigger (DISCOVER MORE, DISCOVER THE SHOWROOM, SUBSCRIBE TO OUR NEWSLETTER)

1px solid #000000 border on transparent background, 3px corner radius, 8px vertical × 24px horizontal padding. Label set in Matter Mono 12px, weight 400, letter-spacing 0.02em, uppercase, #000000. No hover fill — the button stays an outline at all times, reading more like a tagged label than a CTA.

### Filled Dark Button
**Role:** Secondary emphasis action, used sparingly

Background #1e1e1, white Matter Mono 12px label, 3px radius, 8px × 24px padding. Reserved for high-intent actions; the rest of the system is outlined.

### Top Navigation Bar
**Role:** Primary site navigation

Transparent over the hero image, single row, logo '70Materia' left in Matter 20px, nav items right (MATERIALS, APPLICATIONS, PRODUCTS, PROJECTS, JOURNAL, COMPANY, NEWS, CONTACTS) in Matter Mono 10px uppercase, letter-spacing 0.04em, #000000. No background fill, no shadow — the nav floats on the image.

### Full-Bleed Hero Image
**Role:** Opening visual statement

Edge-to-edge photograph, no overlay, no gradient, no text within the image area. The first screen of the site is 100% photography — the UI only appears as nav chrome on top.

### Two-Column Showcase Section
**Role:** Editorial content blocks (project highlights, newsletter CTA)

Two equally weighted columns, each containing a full-bleed image, a Matter Mono 10px label (e.g. VISIT OUR SHOWROOM), a Matter 15px description paragraph in #000000, and an outlined button beneath. 24px row gap between elements, columns separated by the page canvas, not a divider.

### Product Caption Tag
**Role:** Persistent product identification overlay

Bottom-left of the viewport, Matter Mono 10px, uppercase, letter-spacing 0.04em (e.g. 'AT.OLO'). Functions as a museum-style object label — the same piece of furniture/material gets identified regardless of which section you're viewing.

### Footer
**Role:** Site closure

Dark band, background #1e1e1, text #ffffff in Matter Mono 10–12px. Minimal — links, address, and legal. The only place the page drops below the gray canvas into a defined dark block.

### Image Card
**Role:** Contained photography in mixed sections

Zero radius, no border, no shadow. Images sit directly on the #bababa canvas or on a white (#ffffff) panel. The corner is always sharp — the materials themselves provide the visual interest, not the frame.

### Newsletter Input Row
**Role:** Email capture

Underlined text input (1px #000000 bottom border only) with a SUBSCRIBE button to the right. No filled input field, no rounded corners — the underline is the entire affordance.

## Do's and Don'ts

### Do
- Set every heading and body run in Matter at weight 400 — never introduce a bold weight to create hierarchy; use size and space instead.
- Use Matter Mono 10–12px with letter-spacing 0.02em–0.04em for all labels, nav items, button text, and product codes.
- Let product photography fill the viewport edge-to-edge; never crop, frame, or overlay UI on hero images.
- Build buttons as 1px outlined rectangles with 3px radius and 8px × 24px padding — the default action style.
- Use #bababa as the page canvas and let white (#ffffff) appear only as inset paper or dark text on dark surfaces.
- Keep the corner radius at 3px for buttons and 0px for everything else; the system is fundamentally sharp-edged.
- Apply tabular numerals ("tnum") on all text containing numbers so they align vertically across the page.

### Don't
- Do not introduce any chromatic accent color — orange, blue, green, red. The palette is permanently achromatic; color is the photography's job.
- Do not use drop shadows, gradients, or glow effects — the depth model is light surface → mid-gray canvas → dark footer, nothing more.
- Do not round card corners, image corners, or section containers — only buttons get a 3px radius; everything else is sharp.
- Do not use a bold or semibold weight from Matter; weight 400 is the only weight in the system.
- Do not place colored text, colored icons, or colored borders on functional UI — keep all chrome black, white, or gray.
- Do not center body copy in editorial sections; left-align descriptions and labels in the two-column showcase layout.
- Do not use a filled white input field with a visible border — form fields are defined by a single bottom underline only.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Canvas | `#bababa` | Dominant page background — the warm gray field on which all content sits |
| 2 | Paper | `#ffffff` | Inset cards, text panels, and high-contrast image surrounds |
| 3 | Lacquer | `#1e1e1` | Footer and filled button surfaces — the deepest UI layer |

## Elevation

The design intentionally avoids all shadow-based elevation. Depth is communicated exclusively through surface tone: #bababa canvas recedes behind #ffffff paper panels, and #1e1e1 footer sits as the deepest layer. Components never cast shadows, never float, never feel detached from the surface — they are drawn, not lifted.

## Imagery

Photography is the entire visual identity. Images are tight, material-focused crops of finished surfaces — terrazzo tables, stone slabs, pigment samples, furnished interiors — presented as full-bleed objects with no lifestyle context. The subject is always the material itself, isolated against neutral concrete or white walls, lit with soft natural light. No illustration, no abstract graphics, no icons except tiny mono-style UI labels. Color treatment is true-to-life — the system trusts the materials to be chromatic. The visual density is overwhelmingly image-heavy: one photograph typically occupies 60–100% of the viewport, with text and UI chrome compressed into small 10–12px labels that read as documentation rather than design.

## Layout

The page is a vertical sequence of full-bleed editorial moments, each consisting of either a single full-width image or a two-column image+text block. The hero opens with an edge-to-edge photograph and the nav floats on top; no centered headline, no gradient overlay. After the hero, sections appear as centered two-column grids with a max content width of ~960px, where each column contains an image stacked above a mono label, a short body paragraph, and an outlined button. Section spacing is generous (100–180px vertical padding), creating a slow museum-walk rhythm between content blocks. There is no sidebar, no card grid, no pricing table — the layout is always image-then-text, never the reverse. Navigation is a single transparent top bar; the footer is a dark band that closes the page.

## Agent Prompt Guide

## Quick Color Reference
- background: #bababa (page canvas)
- surface: #ffffff (inset paper, text panels)
- text: #000000 (primary), #ffffff (on dark)
- border: #000000 (1px hairlines)
- primary action: #1e1e1e (filled action)
- dark surface: #1e1e1e (filled button, footer)

## Example Component Prompts

1. **Outlined Action Button** — "Create a DISCOVER THE SHOWROOM button. 1px solid #000000 border, transparent background, 3px corner radius, 8px vertical × 24px horizontal padding. Label in Matter Mono 12px weight 400, letter-spacing 0.02em, uppercase, color #000000. No hover fill, no shadow."

2. **Two-Column Editorial Section** — "Build a centered two-column block at max-width 960px on a #bababa canvas. Left column: full-bleed photograph with no border or radius. Below the image, a Matter Mono 10px uppercase label 'VISIT OUR SHOWROOM' in #000000, then a Matter 15px paragraph in #000000, then an outlined button (see prompt 1). Right column mirrors the same structure with label 'ENTER THE WORLD OF 70MATERIA'."

3. **Full-Bleed Hero with Floating Nav** — "Render a full-viewport photograph edge-to-edge with no overlay. Top nav bar floats over the image: logo '70Materia' in Matter 20px #000000 on the left; nav items (MATERIALS, APPLICATIONS, PRODUCTS, PROJECTS, JOURNAL, COMPANY, NEWS, CONTACTS) in Matter Mono 10px uppercase, letter-spacing 0.04em, #000000, right-aligned. No background on the nav."

4. **Persistent Product Caption** — "Place a fixed label in the bottom-left corner of the viewport: Matter Mono 10px uppercase, letter-spacing 0.04em, #000000, e.g. 'AT.OLO'. No background, no border — the label sits directly on the image as if it were a museum object tag."

5. **Newsletter Underline Input** — "Create an email capture row: a single-line text input with no background and no border except a 1px #000000 bottom border, placeholder 'Your email' in Matter 15px #000000, followed by an outlined SUBSCRIBE button (see prompt 1). The input has 0px radius."

## Similar Brands

- **Dzek (dzekdzek.com)** — Same material-library editorial approach — achromatic UI, full-bleed stone and surface photography, mono-style small labels, and outlined ghost buttons that defer to the materials
- **Studio Zhu Pei** — Architectural practice websites that use the same neutral-canvas + large-format photography + tiny mono label pattern, with buttons as thin-outlined rectangles
- **Salvatori** — Italian stone brand that pairs a mid-gray or white page canvas with large hero photography and minimal outlined UI chrome
- **Mutina (mutina.it)** — Surface/tile brand using a similar spec-sheet sensibility — mono labels with letter-spacing, matter-of-fact body type at 400, and a palette that stays achromatic so the tile photography carries the color

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-obsidian: #000000;
  --color-bone: #ffffff;
  --color-graphite: #1e1e1e;
  --color-ash: #bababa;

  /* Typography — Font Families */
  --font-matter: 'Matter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-matter-mono: 'Matter Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.3;
  --tracking-caption: 0.4px;
  --text-body: 15px;
  --leading-body: 1.2;
  --text-subheading: 19px;
  --leading-subheading: 1.2;

  /* Typography — Weights */
  --font-weight-regular: 400;

  /* Spacing */
  --spacing-unit: 8px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-24: 24px;
  --spacing-100: 100px;
  --spacing-180: 180px;

  /* Layout */
  --page-max-width: 960px;
  --section-gap: 100-180px;
  --card-padding: 24px;
  --element-gap: 8px;

  /* Border Radius */
  --radius-sm: 3px;

  /* Named Radii */
  --radius-tags: 0px;
  --radius-cards: 0px;
  --radius-inputs: 0px;
  --radius-buttons: 3px;

  /* Surfaces */
  --surface-canvas: #bababa;
  --surface-paper: #ffffff;
  --surface-lacquer: #1e1e1;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-obsidian: #000000;
  --color-bone: #ffffff;
  --color-graphite: #1e1e1e;
  --color-ash: #bababa;

  /* Typography */
  --font-matter: 'Matter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-matter-mono: 'Matter Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.3;
  --tracking-caption: 0.4px;
  --text-body: 15px;
  --leading-body: 1.2;
  --text-subheading: 19px;
  --leading-subheading: 1.2;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-24: 24px;
  --spacing-100: 100px;
  --spacing-180: 180px;

  /* Border Radius */
  --radius-sm: 3px;
}
```
