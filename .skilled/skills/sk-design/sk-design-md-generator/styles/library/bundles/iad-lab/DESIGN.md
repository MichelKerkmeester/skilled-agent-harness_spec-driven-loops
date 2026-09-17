# Iad-lab — Style Reference
> art-school exhibition on charcoal

**Theme:** dark

Iad-lab operates as a digital exhibition wall rather than a conventional website: a near-black canvas interrupted by full-bleed photographic panels and two colossal display words that bleed past the viewport edges. The palette is essentially binary — off-white on charcoal — with zero chromatic decoration, letting the photography carry all emotional and visual weight. Navigation is reduced to three floating dots on the right margin; there is no header bar, no menu, no buttons. Typography does the structural work: a single grotesk family at restrained sizes handles all UI copy while an enormous, rounded display face delivers program titles at architectural scale. The rhythm is gallery-like: wide quiet sections, then sudden full-bleed visual ruptures, then quiet again.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Charcoal Canvas | `#222222` | `--color-charcoal-canvas` | Page background, the dominant surface across all sections and the base layer behind full-bleed photography |
| Bone | `#f8f8f8` | `--color-bone` | All body text, meta labels, navigation dots, and the dominant hairline border color — serves as the single foreground tone in this near-monochrome system |
| Graphite | `#2a2b2d` | `--color-graphite` | Secondary icon strokes, subtle list dividers, and muted fill details — sits one step darker than the canvas for low-contrast decoration |
| Ash | `#757577` | `--color-ash` | Inactive or resting state for navigation dots and quiet UI affordances |

## Tokens — Typography

### Neue Haas Unica — The sole text family for all UI copy: meta labels at 16px, body at 18px, list/links at 24px, subheadings at 27px, section headings at 36px. Weight 400 is default; 700 is reserved for emphasis in the meta block and active labels. The 1.10 lineHeight on 36px headings creates tight, architectural vertical rhythm. · `--font-neue-haas-unica`
- **Substitute:** Neue Haas Grotesk Display Pro, Inter, Helvetica Neue
- **Weights:** 400, 700
- **Sizes:** 16px, 18px, 24px, 27px, 36px
- **Line height:** 1.10, 1.25, 1.30, 1.35
- **Letter spacing:** normal
- **Role:** The sole text family for all UI copy: meta labels at 16px, body at 18px, list/links at 24px, subheadings at 27px, section headings at 36px. Weight 400 is default; 700 is reserved for emphasis in the meta block and active labels. The 1.10 lineHeight on 36px headings creates tight, architectural vertical rhythm.

### Display (custom or system fallback) — Reserved exclusively for the two program words ('IMAGINE', 'PROGRAM') that span the full viewport width and bleed past both edges. This face is wide, heavy, with rounded terminals — it is the visual signature of the entire site and carries the brand's identity more than any other element. When recreating, use a heavy extended grotesque (e.g. Obviously Wide Black, Neue Machina Black) at a size that forces letter cropping at the viewport edges. · `--font-display-custom-or-system-fallback`
- **Substitute:** Obviously Wide Black, Neue Machina Pop, Cooper Black Extended
- **Weights:** 900 (Black/Heavy)
- **Sizes:** 
- **Line height:** 0.85
- **Role:** Reserved exclusively for the two program words ('IMAGINE', 'PROGRAM') that span the full viewport width and bleed past both edges. This face is wide, heavy, with rounded terminals — it is the visual signature of the entire site and carries the brand's identity more than any other element. When recreating, use a heavy extended grotesque (e.g. Obviously Wide Black, Neue Machina Black) at a size that forces letter cropping at the viewport edges.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 16px | 1.3 | — | `--text-caption` |
| body | 18px | 1.35 | — | `--text-body` |
| subheading | 24px | 1.3 | — | `--text-subheading` |
| heading-sm | 27px | 1.25 | — | `--text-heading-sm` |
| heading | 36px | 1.1 | — | `--text-heading` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 40 | 40px | `--spacing-40` |
| 60 | 60px | `--spacing-60` |
| 80 | 80px | `--spacing-80` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 20px |
| cards | 20px |
| inputs | 20px |
| buttons | 20px |

### Layout

- **Section gap:** 40px
- **Card padding:** 24px
- **Element gap:** 24px

## Components

### Full-Bleed Program Word
**Role:** Brand-defining display heading

The two largest typographic elements on the site. Set in a heavy, wide, rounded display face at 200px+ (fluid). Sized to overflow the viewport horizontally — 'IMAGINE' and 'PROGRAM' are both intentionally cropped at left and right edges. Color is always #f8f8f8. No padding, no margin — sits flush against the viewport top. This is not a heading; it is an architectural element.

### Meta Label Block
**Role:** Contextual site identity

Fixed top-left cluster: four lines of text reading 'Interaction / Design / Lab / Bern — 25'. Set in Neue Haas Unica 16px weight 400, line-height 1.30, color #f8f8f8. No background, no border, no container — text floats directly on the dark canvas or photography. Sits at approximately 16px from the left edge and 16px from the top.

### Section Navigation Dots
**Role:** Sole navigation control

Three small circles vertically stacked on the right margin, approximately 24px from the right edge and vertically centered. Active dot is filled #f8f8f8 (8px diameter), inactive dots are outlined #f8f8f8 with transparent fill. This is the only navigation — no menu bar, no hamburger, no links bar.

### Full-Bleed Photographic Panel
**Role:** Visual content section

Edge-to-edge image or video panels that span 100vw with no border-radius, no padding, no margin. Images are abstract, high-saturation, large-scale (pink petal, amber paper, red 3D). The panel height varies but typically fills 70-100vh. The dark charcoal canvas (#222222) is only visible between panels as breathing space.

### List Item with Hairline Border
**Role:** Content links or project entries

Each list item separated by a 1px solid #f8f8f8 bottom border (used 248 times in the data — the dominant border usage). Text in #f8f8f8, Neue Haas Unica 24px weight 400. No background, no hover fill change indicated. 20px border-radius available for interactive containers but not applied to border lines themselves.

### Rounded Interactive Surface
**Role:** Buttons, tags, or clickable chips

When interactive elements appear, they use 20px border-radius — the dominant radius token. On the dark canvas, these would be transparent fills with 1px #f8f8f8 borders (the 'neutral-action-border-not-distinct-CTA' pattern). 16-24px horizontal padding, 10-15px vertical padding. No drop shadows, no gradients.

### Quiet Text Section
**Role:** Interstitial content between visual panels

Blocks of body text on the bare #222222 canvas with no container. Max-width is unrestricted (full-bleed layout), so text columns are short — likely 4-6 words per line. Neue Haas Unica 18-24px, line-height 1.30-1.35, color #f8f8f8. The emptiness around the text is as important as the text itself.

## Do's and Don'ts

### Do
- Use #f8f8f8 for all text and borders; #222222 is the only background. This binary is the system.
- Apply 20px border-radius to any rounded element — buttons, tags, chips, containers. Never use sharp corners on interactive surfaces.
- Set the display heading to overflow the viewport. The wordmark must bleed past both left and right edges — if all letters are fully visible, it is too small.
- Use Neue Haas Unica weight 400 as default; reserve weight 700 for active or emphasized labels only. Do not mix intermediate weights.
- Separate list items with 1px solid #f8f8f8 bottom borders. This hairline divider is the primary structural separator in the system.
- Use 24px as the default element gap and 16px as the tight gap. Maintain the 4px base unit for all spacing decisions.
- Let photography fill 100vw with zero padding or border-radius. Full-bleed is non-negotiable for visual panels.

### Don't
- Do not introduce any color beyond the four neutrals (#222222, #f8f8f8, #2a2b2d, #757577). Chromatic accents are forbidden.
- Do not add drop shadows, gradients, or glow effects. Elevation is communicated through photography scale, not CSS shadows.
- Do not add a traditional navigation bar, header, or footer chrome. The meta label and dot navigation are the entire structural frame.
- Do not center text in narrow columns. Text should be short, left-aligned, and surrounded by generous negative space.
- Do not use border-radius values other than 15px or 20px. Avoid 4px, 8px, or fully rounded (9999px) — neither matches the system's geometric language.
- Do not set the display heading at a size where all letters fit within the viewport. The cropping is intentional and defines the visual identity.
- Do not use line-height above 1.35 for body text or below 1.10 for headings. The tight heading leading creates the architectural feel.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Charcoal Canvas | `#222222` | The base layer — page background and the surface visible between photographic panels |
| 2 | Photographic Surface | `#222222` | Full-bleed image/video panels that replace the canvas at section boundaries. Same hex but visually distinct due to content. |
| 3 | Text Surface | `#222222` | No actual elevated surface — text sits directly on the canvas or photography. The 'elevation' is purely typographic scale. |

## Elevation

The system has no elevation. There are no card surfaces, no floating panels, no modals, no tooltips with shadows. Hierarchy is achieved entirely through typographic scale, photographic scale, and the hairline 1px #f8f8f8 border. A surface either IS the full viewport (photography) or it IS the canvas (text). There is no middle layer.

## Imagery

Full-bleed abstract photography dominates the visual language. Images are large-scale, high-saturation, and fill 100vw with no padding or border-radius. The subject matter is abstract and material: close-up flower petals in pink/magenta, folded paper or fabric in amber/orange, a 3D geometric form in deep red. No people, no products, no UI screenshots. The images function as environmental mood rather than informational content — they set emotional temperature between quiet text sections. Treatment is raw, unedited, with natural lighting and shallow depth of field. The photography is the only source of color in the entire system.

## Layout

Full-bleed, edge-to-edge layout with no max-width container. The page reads as a vertical sequence of full-viewport sections: display wordmark → meta text → full-bleed photo → dark interstitial text → full-bleed photo → next display wordmark. The two program words ('IMAGINE', 'PROGRAM') are each given their own full-viewport section with the text bleeding past the edges. Navigation is three vertical dots on the right margin — no header bar, no hamburger menu, no footer. Content is positioned with precise edge alignment: meta text at 16px from top-left, nav dots at 24px from right edge, vertically centered. The grid is invisible — there is no column system, only viewport-edge alignment and generous negative space.

## Agent Prompt Guide

**Quick Color Reference**
- text: #f8f8f8
- background: #222222
- border: #f8f8f8 (1px hairline)
- muted: #2a2b2d
- inactive: #757577
- primary action: no distinct CTA color

**Example Component Prompts**

1. Create a full-bleed display wordmark: a single word at 200px+ in a heavy, wide, rounded display face (weight 900), color #f8f8f8, positioned flush to the viewport top, intentionally overflowing left and right edges. No padding, no background. On a #222222 canvas.

2. Create a meta label block: four stacked lines of text at 16px Neue Haas Unica weight 400, line-height 1.30, color #f8f8f8, positioned 16px from the top-left corner. No container, no border. Reads as floating text on the dark canvas.

3. Create a section navigation indicator: three 8px circles vertically stacked at 24px from the right viewport edge, vertically centered. First circle filled #f8f8f8 (active state), remaining two are 1px outlined #f8f8f8 with transparent fill.

4. Create a full-bleed photographic panel: a single image filling 100vw and ~80vh with zero padding, zero border-radius, and no border. The image is abstract, high-saturation, large-scale material subject (petal, paper, 3D form). Edges are hard — no gradient fade to canvas.

5. Create a list of linked items: each item is a single line of text in Neue Haas Unica 24px weight 400, color #f8f8f8, separated by a 1px solid #f8f8f8 bottom border. No padding between items beyond 24px vertical gap. No background on items. Full-bleed width — items span edge to edge.

## Similar Brands

- **Pentagram** — Same editorial-agency approach: massive display type, zero navigation chrome, photography as structural element, dark or neutral canvas with full-bleed sections
- **Bauhaus Archive Berlin** — Same art-institution restraint — display typography that functions as architecture, photography at viewport scale, and a near-monochrome palette that lets content carry weight
- **Tate Modern exhibition pages** — Same gallery catalog rhythm: quiet text sections punctuated by full-bleed visual panels, minimal UI chrome, type-led hierarchy
- **Studio Dumbar** — Same Dutch design-school discipline: single grotesk family, tight heading leading, generous negative space, and the confidence to leave screens mostly empty

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-charcoal-canvas: #222222;
  --color-bone: #f8f8f8;
  --color-graphite: #2a2b2d;
  --color-ash: #757577;

  /* Typography — Font Families */
  --font-neue-haas-unica: 'Neue Haas Unica', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-display-custom-or-system-fallback: 'Display (custom or system fallback)', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 16px;
  --leading-caption: 1.3;
  --text-body: 18px;
  --leading-body: 1.35;
  --text-subheading: 24px;
  --leading-subheading: 1.3;
  --text-heading-sm: 27px;
  --leading-heading-sm: 1.25;
  --text-heading: 36px;
  --leading-heading: 1.1;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-40: 40px;
  --spacing-60: 60px;
  --spacing-80: 80px;

  /* Layout */
  --section-gap: 40px;
  --card-padding: 24px;
  --element-gap: 24px;

  /* Border Radius */
  --radius-xl: 15px;
  --radius-2xl: 20px;

  /* Named Radii */
  --radius-tags: 20px;
  --radius-cards: 20px;
  --radius-inputs: 20px;
  --radius-buttons: 20px;

  /* Surfaces */
  --surface-charcoal-canvas: #222222;
  --surface-photographic-surface: #222222;
  --surface-text-surface: #222222;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-charcoal-canvas: #222222;
  --color-bone: #f8f8f8;
  --color-graphite: #2a2b2d;
  --color-ash: #757577;

  /* Typography */
  --font-neue-haas-unica: 'Neue Haas Unica', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-display-custom-or-system-fallback: 'Display (custom or system fallback)', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 16px;
  --leading-caption: 1.3;
  --text-body: 18px;
  --leading-body: 1.35;
  --text-subheading: 24px;
  --leading-subheading: 1.3;
  --text-heading-sm: 27px;
  --leading-heading-sm: 1.25;
  --text-heading: 36px;
  --leading-heading: 1.1;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-40: 40px;
  --spacing-60: 60px;
  --spacing-80: 80px;

  /* Border Radius */
  --radius-xl: 15px;
  --radius-2xl: 20px;
}
```
