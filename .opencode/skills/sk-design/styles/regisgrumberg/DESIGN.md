# Regisgrumberg — Style Reference
> Orbital type on a black void — a typographic planetarium where Anton orbits a single white dot.

**Theme:** dark

A stark monochromatic portfolio built on a pure black void where typography is the only object. The signature is a circular orbital type composition — concentric rings of type rotating around a central 'ENTER' button — that treats the page as a kinetic poster rather than a website. Anton at extreme sizes (90–150px) does all the visual work; everything else is white-on-black sans-serif body text and hairline gray rules. There is no color, no imagery, no shadows, no gradients, no rounded corners of consequence (2px maximum). The aesthetic is closer to a Bauhaus broadside or a black-box art installation than a typical portfolio — every element earns its place through scale and silence.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Obsidian | `#000000` | `--color-obsidian` | Page canvas, full-bleed background, link text — the default surface for every screen; nothing sits on a lighter background |
| Pure White | `#ffffff` | `--color-pure-white` | Display type, body text, button fills, hairline borders — the only ink color, used at full saturation with zero tints |
| Concrete | `#c4c4c4` | `--color-concrete` | Secondary borders, muted list rules, subdued dividers — the single mid-tone for de-emphasized structure |
| Charcoal | `#363636` | `--color-charcoal` | Elevated nav surfaces and secondary panels — the only step off pure black for distinct UI layers |

## Tokens — Typography

### monospace — Small technical UI text — system monospace at fixed 13px for tags, metadata, or any content that needs a typewriter feel against the sans-serif body · `--font-monospace`
- **Substitute:** JetBrains Mono, IBM Plex Mono, ui-monospace
- **Weights:** 400
- **Sizes:** 13px
- **Line height:** 1.0, 1.2
- **Role:** Small technical UI text — system monospace at fixed 13px for tags, metadata, or any content that needs a typewriter feel against the sans-serif body

### Anton — Display and orbital type — the only voice for headings, hero text, and the signature circular compositions. Anton's condensed grotesque geometry lets words like 'BELIEVE' and 'THINKING' become architectural forms; the heavy 500 weight at 90–150px is the design's entire visual identity · `--font-anton`
- **Substitute:** Oswald, Bebas Neue, Archivo Black
- **Weights:** 500
- **Sizes:** 18px, 24px, 48px, 90px, 150px
- **Line height:** 1.0, 1.2
- **Role:** Display and orbital type — the only voice for headings, hero text, and the signature circular compositions. Anton's condensed grotesque geometry lets words like 'BELIEVE' and 'THINKING' become architectural forms; the heavy 500 weight at 90–150px is the design's entire visual identity

### Montserrat — Body copy, navigation, button labels, list items, subheadings. The 2.78 line-height on the 18px size signals intentional airy rhythm in body blocks; 600 weight reserved for nav emphasis and small heading accents · `--font-montserrat`
- **Substitute:** Inter, Work Sans, DM Sans
- **Weights:** 400, 600
- **Sizes:** 11px, 14px, 18px, 24px, 30px, 36px
- **Line height:** 1.0, 1.2, 2.78
- **Role:** Body copy, navigation, button labels, list items, subheadings. The 2.78 line-height on the 18px size signals intentional airy rhythm in body blocks; 600 weight reserved for nav emphasis and small heading accents

### Times — Times — detected in extracted data but not described by AI · `--font-times`
- **Weights:** 400
- **Sizes:** 
- **Line height:** 1
- **Role:** Times — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 11px | 1.2 | — | `--text-caption` |
| body-lg | 18px | 2.78 | — | `--text-body-lg` |
| subheading | 24px | 1.2 | — | `--text-subheading` |
| heading-sm | 30px | 1.2 | — | `--text-heading-sm` |
| heading | 36px | 1.2 | — | `--text-heading` |
| heading-lg | 48px | 1.2 | — | `--text-heading-lg` |
| display | 90px | 1 | — | `--text-display` |
| display-xl | 150px | 1 | — | `--text-display-xl` |

## Tokens — Spacing & Shapes

**Base unit:** 6px

**Density:** spacious

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 12 | 12px | `--spacing-12` |
| 23 | 23px | `--spacing-23` |
| 42 | 42px | `--spacing-42` |
| 54 | 54px | `--spacing-54` |
| 108 | 108px | `--spacing-108` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 2px |
| cards | 2px |
| inputs | 2px |
| buttons | 2px |
| default | 2px |

### Layout

- **Section gap:** 54px
- **Card padding:** 23px
- **Element gap:** 23px

## Components

### Orbital Type Composition
**Role:** Signature hero element — concentric rings of Anton 48–90px type rotating around a central focal point

The page-defining element. Multiple text strings (e.g. 'BELIEVE IN THINKING DIFFERENT', 'PORTFOLIO', author name) are arranged in full circles at varying radii using CSS transforms. Type is Anton 500 at 48–90px, #ffffff on #000000, tracking normal, with each character precisely positioned along the circular path. The composition is perfectly centered, both horizontally and vertically, in the viewport. Padding around the composition uses the 42–54px scale to maintain generous breathing room.

### Enter Dot Button
**Role:** Central focal point and primary navigation trigger

A small #ffffff filled circle (roughly 50–60px diameter) positioned at the exact center of the orbital composition. Contains the word 'ENTER' in monospace or Montserrat 11–13px, #000000, centered. 2px radius (essentially perfectly round at small size, or sharp-edged if larger). No border, no shadow, no hover transition — the inversion of white-on-black is the entire affordance.

### Nav Border Rule
**Role:** Thin horizontal hairline that separates nav from content

A 1px line in #ffffff or #c4c4c4 spanning the full width of the viewport, positioned directly below the nav row. 0 padding above/below the rule itself. Anchors the navigation zone without using a filled background.

### Nav Link
**Role:** Top-level navigation item

Montserrat 600 at 11–14px, #ffffff, normal letter-spacing, transparent background, no underline. Active state adds a #ffffff bottom border 2px thick. Horizontal gap between items is 23–42px. No hover background fill — only color shift if any.

### Hairline List Divider
**Role:** Separates entries in stacked content lists (project index, links)

1px solid #c4c4c4 or #ffffff border between list items. No padding beyond the item's own vertical padding (23px). The list itself is unstyled — no bullets, no indentation — just rows separated by rules.

### Ghost Outline Button
**Role:** Secondary action — outlined, not filled

Transparent background, 1px #ffffff border, Montserrat 400–600 at 11–14px, #ffffff text, 23px horizontal padding, 12px vertical padding, 2px radius. No hover fill — type remains white on transparent. Used for non-primary actions where a filled button would be too loud.

### Inverted Filled Button
**Role:** Primary action in inverted contexts

#ffffff background, #000000 text, Montserrat 600 at 11–14px, 23px horizontal padding, 12px vertical padding, 2px radius. The inverse of the canvas — only used sparingly, typically on dark panels or the rare light surface. No shadow, no gradient.

### Section Heading
**Role:** Major section title

Anton 500 at 48–90px, #ffffff, line-height 1.0–1.2, normal tracking. Often appears alone, centered or left-aligned, with 42–54px of space above and 23px below. No underline, no decoration — the size and weight carry all the hierarchy.

### Body Text Block
**Role:** Paragraph content

Montserrat 400 at 18px, #ffffff, line-height 2.78 (the airy rhythm is deliberate — generous vertical space between lines creates a typographic breathing effect). Max width implied around 600–700px. Left-aligned, no first-line indent.

### Monospace Tag
**Role:** Metadata, dates, category labels

System monospace at 13px, #c4c4c4, line-height 1.0–1.2. Inline or stacked. The only place monospace appears — its mechanical character contrasts with the display Anton and body Montserrat.

### Footer Rule
**Role:** Bottom-of-page divider

1px #ffffff or #c4c4c4 horizontal line at the very bottom of the viewport, mirroring the nav rule. Footer content sits above it in Montserrat 11–14px #c4c4c4.

## Do's and Don'ts

### Do
- Use Anton 500 at 48px or larger for any display heading — Anton under 30px loses its architectural impact and should be swapped for Montserrat 600
- Maintain a 4-color palette only: #000000, #ffffff, #c4c4c4, #363636 — any other color breaks the void-poster language
- Keep all border radii at 2px — the near-zero radius is part of the signature; pill shapes or large radii look out of system
- Center hero compositions both horizontally and vertically in the viewport — the design language assumes centered, symmetric tension
- Use hairline 1px borders (#c4c4c4 or #ffffff) for all separators — never use heavy blocks of color to divide sections
- Apply the 2.78 line-height on 18px Montserrat body text to preserve the airy typographic rhythm
- Treat the monospace 13px as the only technical voice — reserve it for metadata, dates, and tags, not for body content

### Don't
- Do not introduce any color beyond the four neutrals — no accent, no brand hue, no gradients, no hover color shifts
- Do not add drop shadows, glows, or blur effects — elevation is expressed through tonal steps, not depth
- Do not use photography, illustrations, or icons as primary content — type is the only visual subject
- Do not apply large border radii (8px+) — the 2px maximum is a deliberate anti-pattern against soft, friendly SaaS conventions
- Do not mix multiple display-weight sans-serifs — Anton owns display, Montserrat owns text, monospace owns metadata; no fourth voice
- Do not use filled backgrounds on list items or rows — use hairline #c4c4c4 borders only
- Do not break the centered, symmetric layout with asymmetric or left-aligned hero compositions unless the page is a content page below the fold

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Obsidian Canvas | `#000000` | Full-bleed page background |
| 1 | Charcoal Panel | `#363636` | Elevated nav and secondary surface |
| 2 | Pure White Mark | `#ffffff` | Inverted surfaces (the ENTER button, any inverted panel) |

## Elevation

No shadows. Elevation is expressed purely through tonal steps: #000000 → #363636 → #ffffff. A surface is 'raised' by being lighter, not by casting a shadow. This is a flat, printed-poster design language that refuses skeuomorphic depth.

## Imagery

No photography, no illustrations, no icons, no decorative graphics. The design is pure typography on a black field. The only visual content is type — Anton at large sizes forming the orbital hero, Montserrat at body sizes forming text blocks, and the occasional monospace tag. If the brief requires a visual asset, it should be a type specimen or a typographic composition, never a photograph or illustration.

## Agent Prompt Guide

**Quick Color Reference**
- background: #000000
- text: #ffffff
- border: #c4c4c4 (secondary) or #ffffff (primary)
- elevated surface: #363636
- accent: none observed (use inverted white-on-black)
- primary action: no distinct CTA color

**Example Component Prompts**

1. *Orbital Type Composition*: Full-viewport #000000 canvas. Three concentric rings of type in Anton 500 weight at 90px, #ffffff, letter-spacing normal, line-height 1.0. Outer ring: 'BELIEVE IN THINKING DIFFERENT' at radius ~280px. Middle ring: 'PORTFOLIO' at radius ~200px. Inner ring: author name in Montserrat 400 at 18px at radius ~120px. All rings perfectly centered both axes. 2.78 line-height on inner text.

2. *Enter Dot Button*: Position at exact center of viewport. 56px diameter circle, #ffffff fill, 2px radius. Contains 'ENTER' in monospace 400 at 13px, #000000, centered both axes, line-height 1.0. No border, no shadow, no hover state.

3. *Ghost Outline Button*: Transparent background, 1px solid #ffffff border, 2px radius. Padding 12px vertical, 23px horizontal. Text: Montserrat 600 at 14px, #ffffff, normal tracking. No fill on hover.

4. *Section Heading*: Anton 500 at 90px, #ffffff, line-height 1.0, normal tracking, left-aligned with 54px margin-top and 23px margin-bottom. No decoration, no underline.

5. *Body Text Block*: Montserrat 400 at 18px, #ffffff, line-height 2.78, max-width 680px, left-aligned. Followed by 23px margin to next block.

## Similar Brands

- **Pentagram (pentagram.com)** — Same type-as-hero philosophy with large-scale display typography on minimal backgrounds and near-zero color palette
- **Massimo Vignelli's NYC Subway signs** — Shared monochromatic rigor, bold geometric type, hairline rules, and 2px-or-zero radii — modernist restraint at every level
- **Studio Dumbar (studio-dumbar.com)** — Identical approach of using one display face at extreme scale as the entire visual identity, monochrome backgrounds, hairline structure
- **Bauhaus 100 (bauhaus100.de)** — Circular typographic compositions, pure black canvas, condensed display sans (Anton's spiritual ancestor Futura), no decorative imagery
- **David Carson experimental portfolio sites** — Deconstructivist layout where type arrangement and scale replace imagery as the primary visual content

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-obsidian: #000000;
  --color-pure-white: #ffffff;
  --color-concrete: #c4c4c4;
  --color-charcoal: #363636;

  /* Typography — Font Families */
  --font-monospace: 'monospace', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-anton: 'Anton', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-montserrat: 'Montserrat', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-times: 'Times', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.2;
  --text-body-lg: 18px;
  --leading-body-lg: 2.78;
  --text-subheading: 24px;
  --leading-subheading: 1.2;
  --text-heading-sm: 30px;
  --leading-heading-sm: 1.2;
  --text-heading: 36px;
  --leading-heading: 1.2;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.2;
  --text-display: 90px;
  --leading-display: 1;
  --text-display-xl: 150px;
  --leading-display-xl: 1;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;

  /* Spacing */
  --spacing-unit: 6px;
  --spacing-12: 12px;
  --spacing-23: 23px;
  --spacing-42: 42px;
  --spacing-54: 54px;
  --spacing-108: 108px;

  /* Layout */
  --section-gap: 54px;
  --card-padding: 23px;
  --element-gap: 23px;

  /* Border Radius */
  --radius-sm: 2px;

  /* Named Radii */
  --radius-tags: 2px;
  --radius-cards: 2px;
  --radius-inputs: 2px;
  --radius-buttons: 2px;
  --radius-default: 2px;

  /* Surfaces */
  --surface-obsidian-canvas: #000000;
  --surface-charcoal-panel: #363636;
  --surface-pure-white-mark: #ffffff;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-obsidian: #000000;
  --color-pure-white: #ffffff;
  --color-concrete: #c4c4c4;
  --color-charcoal: #363636;

  /* Typography */
  --font-monospace: 'monospace', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-anton: 'Anton', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-montserrat: 'Montserrat', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-times: 'Times', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.2;
  --text-body-lg: 18px;
  --leading-body-lg: 2.78;
  --text-subheading: 24px;
  --leading-subheading: 1.2;
  --text-heading-sm: 30px;
  --leading-heading-sm: 1.2;
  --text-heading: 36px;
  --leading-heading: 1.2;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.2;
  --text-display: 90px;
  --leading-display: 1;
  --text-display-xl: 150px;
  --leading-display-xl: 1;

  /* Spacing */
  --spacing-12: 12px;
  --spacing-23: 23px;
  --spacing-42: 42px;
  --spacing-54: 54px;
  --spacing-108: 108px;

  /* Border Radius */
  --radius-sm: 2px;
}
```
