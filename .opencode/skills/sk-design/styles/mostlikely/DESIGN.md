# mostlikely — Style Reference
> Inked archways on bone-white vellum

**Theme:** light

A strict two-color monochrome system — pure ink black and bone white with zero chromatic accent. The signature is the monumental arch: tall vertical forms capped with full semicircular rounding that read as cathedral portals, mausoleum doorways, or architect's drafting silhouettes. Typography is a single custom display face (Rondelle) used at exactly one weight (400) and only two sizes, so hierarchy comes from scale and whitespace rather than weight, color, or decoration. Navigation is a whisper-thin hairline rule across the top with widely-spaced text links. The system is brutally restrained: no shadows, no gradients, no borders other than 1px hairlines, no color punctuation — the arch shape itself does all the emotional work.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Ink Black | `#000000` | `--color-ink-black` | Page text, all border rules, signature arch fills — the entire graphical language. The 21:1 contrast against white is the system's only expressive tool |
| Bone White | `#ffffff` | `--color-bone-white` | Canvas, card surfaces, and all negative space — the field against which ink shapes register as architecture |

## Tokens — Typography

### Rondelle — Sole typeface for navigation links, body copy, and headings. Used at exactly one weight (400) across the entire site — the flat weight is deliberate; hierarchy is created by jumping from 14px to 30px (a 2.14× ratio) rather than by weight contrast. The custom face has architectural proportions: tall x-height, geometric construction, even stroke — it reads as drawn rather than typed. Substitute with a geometric humanist sans like 'Söhne' or 'Inter' if Rondelle is unavailable. · `--font-rondelle`
- **Substitute:** Söhne, Inter, Untitled Sans
- **Weights:** 400
- **Sizes:** 14px, 30px
- **Line height:** 1.40
- **Letter spacing:** normal
- **Role:** Sole typeface for navigation links, body copy, and headings. Used at exactly one weight (400) across the entire site — the flat weight is deliberate; hierarchy is created by jumping from 14px to 30px (a 2.14× ratio) rather than by weight contrast. The custom face has architectural proportions: tall x-height, geometric construction, even stroke — it reads as drawn rather than typed. Substitute with a geometric humanist sans like 'Söhne' or 'Inter' if Rondelle is unavailable.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| body-sm | 14px | 19.6 | — | `--text-body-sm` |
| heading | 30px | 42 | — | `--text-heading` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 5 | 5px | `--spacing-5` |
| 10 | 10px | `--spacing-10` |
| 20 | 20px | `--spacing-20` |
| 55 | 55px | `--spacing-55` |
| 70 | 70px | `--spacing-70` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 0px |
| cards | 0px |
| arches | 50% (full semicircle on tall vertical forms) |
| buttons | 0px |

### Layout

- **Section gap:** 55-70px
- **Card padding:** 20px
- **Element gap:** 10px

## Components

### Hairline Navigation Bar
**Role:** Top-level site navigation

Full-width 1px solid #000000 border-bottom, white background. 5px top/bottom padding, 20px horizontal padding. Links are Rondelle 400 at 14px, #000000, 10px column gap between items. No background, no underline, no active state indicator — selected page is implicit through context or position. The nav floats on white like a single drawn rule across the top of the page.

### Arch Pillar (Signature Shape)
**Role:** Hero visual element and section divider

Tall vertical rectangle filled solid #000000 with the top edge rounded to a full semicircle (border-top-left-radius and border-top-right-radius equal to 50% of the element's width). The shape extends downward off the visible viewport or to the section floor — its height is never fully revealed at once, giving it a monumental, architectural presence. Width is typically 15-25% of the viewport. No border, no shadow, no gradient. This is the single most identifiable element of the system.

### Arch Cluster
**Role:** Compositional grouping of signature shapes

Two or more Arch Pillars placed side by side with generous white space between them, creating a rhythm of black portals against white field. Even number (usually two) for symmetry. Total width of the cluster occupies the center 50-60% of the viewport; outer margins are wide and white.

### Text Link
**Role:** Inline and navigation hyperlinks

Rondelle 400 at 14px, #000000, no underline by default. No hover state changes color or weight — the link is already the same as surrounding text; context (position in nav, surrounding punctuation) signals interactivity. No focus ring beyond the browser default.

### Section Heading
**Role:** Top-level page or section title

Rondelle 400 at 30px, #000000, line-height 42px. No bold, no italic, no decoration. Sits in generous white space (55-70px top padding above). The single weight and size make it read as a quiet declaration rather than a shout — the 2.14× size jump from 14px body is the only hierarchy signal.

### Body Text Block
**Role:** Paragraphs and descriptive copy

Rondelle 400 at 14px, #000000, line-height 19.6px. No paragraph spacing beyond 1em. Left-aligned. Maximum measure implied at ~70-80 characters though no hard container is observed.

### Full-Bleed White Section
**Role:** Primary canvas for content

#ffffff background, no borders, no internal padding constraint. Content sits within generous white margins (70px left/right). Sections are separated by whitespace rather than dividers — the transition from one section to the next is marked by a 55px top padding and a new visual element (arch, text, image).

### Image Frame
**Role:** Photographic or illustrative content container

1px solid #000000 border around rectangular image containers. No border-radius (0px). Images sit flush within the frame; the hairline border makes them read as printed plates or archival photographs rather than digital content.

## Do's and Don'ts

### Do
- Use only #000000 and #ffffff. The two-color constraint is the design — any chromatic addition breaks the system.
- Use border-radius equal to 50% of element width to create the arch shape. This is the system's only decorative vocabulary.
- Set all borders to 1px solid #000000. No thicker rules, no dotted, no dashed.
- Apply Rondelle at weight 400 only. Do not introduce 500, 600, or 700 — the flat weight is signature.
- Use 55-70px top padding to separate sections. Whitespace is the only section divider.
- Let arch shapes bleed off the bottom of the viewport to create implied monumentality.
- Maintain 10px column gap between navigation links and 20px horizontal padding on the nav bar.

### Don't
- Do not introduce any color other than #000000 and #ffffff. No grays, no accents, no semantic state colors.
- Do not use font-weight values other than 400. Bold, medium, and semibold are absent from the system.
- Do not add box-shadow, text-shadow, or drop-shadow. The system is completely flat.
- Do not use border-radius on cards, buttons, tags, or images. All non-arch elements are sharp-cornered (0px).
- Do not add gradients of any kind. Solid fills only.
- Do not use multiple font families. Rondelle (or its substitute) is the only face.
- Do not add icons, emoji, or decorative glyphs. The arch shape and typography are the only graphic elements.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Bone White Canvas | `#ffffff` | Full-page background; the field that receives all ink. |
| 1 | Ink Black Surface | `#000000` | Arch pillars, solid graphic elements — the only non-white surface in the system. |

## Elevation

The system uses zero elevation. No shadows, no layered surfaces, no floating panels. Depth is created entirely through the silhouette of the arch shape against white space — the 2D contrast between black fill and white field does the perceptual work that shadows do in other systems.

## Imagery

Photography appears only inside 1px hairline-bordered frames, reading as archival plates or fine-art prints. The primary visual content is not photography but the arch shape itself — large-scale solid-black geometric forms that function as both composition and content. When photography is present, it is documentary and architectural: buildings, materials, spatial details. No lifestyle imagery, no people-centric photography, no stock imagery. The arch is the hero; everything else is supporting documentation.

## Layout

Full-bleed page with no max-width container — the arch shapes require unconstrained horizontal space to maintain their monumental proportion. Navigation is a single horizontal rule across the top with four widely-spaced text links (Mostlikely, Architecture, Design, Research). Below the nav, content begins directly on the white canvas. The first viewport is typically dominated by one or two tall arch pillars centered or slightly offset, with their tops reaching into the upper third of the screen. Sections are separated by 55-70px of vertical whitespace, not by dividers or alternating background colors. Text blocks are narrow and left-aligned, sitting in generous right-side white space. The overall rhythm is: whitespace → arch → whitespace → text → whitespace → image frame → whitespace.

## Agent Prompt Guide

**Quick Color Reference**
- text: #000000
- background: #ffffff
- border: #000000 (1px hairline)
- accent: #000000 (arch fills are the only accent)
- primary action: no distinct CTA color

**Example Component Prompts**

1. **Build the top navigation**: Full-width white bar with 1px solid #000000 border-bottom. 5px top/bottom padding, 20px left/right padding. Four text links ('Mostlikely', 'Architecture', 'Design', 'Research') in Rondelle 400, 14px, #000000, 10px gap between items. No underlines, no active states, no background changes.

2. **Build the signature arch pillar**: A tall vertical rectangle, 20% of viewport width, filled solid #000000. Set border-top-left-radius and border-top-right-radius to 50% so the top edge forms a full semicircle. No border, no shadow. The element extends below the visible viewport — give it height: 120vh or overflow the parent container.

3. **Build a section heading**: Rondelle 400 at 30px, #000000, line-height 42px. Left-aligned. No bold, no italic. Sit it with 55px padding-top above and generous white space to the right.

4. **Build an image frame**: 1px solid #000000 border around a rectangular image container. border-radius 0px. Image fills the frame edge-to-edge. No caption inside the frame; text lives outside in the surrounding white space.

5. **Build a body text block**: Rondelle 400 at 14px, #000000, line-height 19.6px. Left-aligned. No paragraph indent. One blank line (1em) between paragraphs. Max measure ~70 characters.

## Similar Brands

- **Bureau Cool** — Same single-weight typography discipline and arch/architectural geometric vocabulary on stark white.
- **Aesop** — Identical restraint — single typeface, generous whitespace, no color beyond black and white, hairline dividers.
- **Perron-Roettinger** — Same editorial-architect feel with large-scale geometric forms and minimal text on white.
- **NORM Architects** — Monochrome palette with monumental geometric shapes functioning as both composition and identity.
- **AnOther Magazine** — Same typographic confidence — one weight, two sizes, hierarchy through scale alone, on pure white.

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-ink-black: #000000;
  --color-bone-white: #ffffff;

  /* Typography — Font Families */
  --font-rondelle: 'Rondelle', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-body-sm: 14px;
  --leading-body-sm: 19.6;
  --text-heading: 30px;
  --leading-heading: 42;

  /* Typography — Weights */
  --font-weight-regular: 400;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-5: 5px;
  --spacing-10: 10px;
  --spacing-20: 20px;
  --spacing-55: 55px;
  --spacing-70: 70px;

  /* Layout */
  --section-gap: 55-70px;
  --card-padding: 20px;
  --element-gap: 10px;

  /* Named Radii */
  --radius-tags: 0px;
  --radius-cards: 0px;
  --radius-arches: 50% (full semicircle on tall vertical forms);
  --radius-buttons: 0px;

  /* Surfaces */
  --surface-bone-white-canvas: #ffffff;
  --surface-ink-black-surface: #000000;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-ink-black: #000000;
  --color-bone-white: #ffffff;

  /* Typography */
  --font-rondelle: 'Rondelle', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-body-sm: 14px;
  --leading-body-sm: 19.6;
  --text-heading: 30px;
  --leading-heading: 42;

  /* Spacing */
  --spacing-5: 5px;
  --spacing-10: 10px;
  --spacing-20: 20px;
  --spacing-55: 55px;
  --spacing-70: 70px;
}
```
