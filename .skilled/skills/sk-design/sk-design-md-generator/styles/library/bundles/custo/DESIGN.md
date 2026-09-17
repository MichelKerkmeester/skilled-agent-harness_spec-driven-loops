# Custo — Style Reference
> Gunmetal gallery with monolithic type. A muted gray-green showroom where a single dark object and 57px type do all the talking.

**Theme:** light

Custo operates as an industrial product gallery: a warm gunmetal canvas hosts the physical product while oversized display typography serves as the primary visual ornament. The system is rigorously achromatic — zero chromatic colors — letting the dark anodized mailbox and the geometric weight of a single sans-serif carry all brand personality. Every screen balances generous negative space against one monumental typographic statement, with the brand wordmark recurring as a near-architectural element. Surfaces are flat and matte; depth is implied by the product's own reflectivity rather than drop shadows or gradients.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Canvas Gunmetal | `#9ea29f` | `--color-canvas-gunmetal` | Hero and feature-section background — the warm gray-green tint distinguishes Custo from generic white SaaS canvases and reads as architectural concrete rather than digital surface |
| Obsidian | `#000000` | `--color-obsidian` | Primary text, hairline borders, icon strokes — the highest-contrast ink in the system, used for headings and structural dividers |
| Paper White | `#ffffff` | `--color-paper-white` | Body section backgrounds, reversed text on gunmetal canvas, text on the dark product photography |
| Anodized Graphite | `#4b514d` | `--color-anodized-graphite` | Dark surface for product photography, secondary headings, and elevated text — echoes the mailbox finish so the UI and product share a material |
| Brushed Steel | `#8e9194` | `--color-brushed-steel` | Muted body text, list dividers, secondary icon strokes — sits between Paper White and Obsidian for inline metadata and subdued links |
| Linen Mist | `#a7aaad` | `--color-linen-mist` | Light border and divider color for headings and section rules — a hairline tone that never competes with Obsidian structural lines |
| Aluminum Hairline | `#d8d8d8` | `--color-aluminum-hairline` | Input field borders, footer separators, the lightest structural line — appears only where a near-invisible boundary is needed |

## Tokens — Typography

### PP Neue Montreal — Single-family type system used for everything from body copy to 57px display statements — the geometric uniformity across weights is the signature choice, avoiding any secondary or display-specific font so the wordmark 'CUSTO®' set at 57px reads as the same typographic family as a 15px form input label · `--font-pp-neue-montreal`
- **Substitute:** Inter, Manrope, or DM Sans at matching optical sizes
- **Weights:** 400 (Medium)
- **Sizes:** 15px, 16px, 19px, 20px, 30px, 38px, 57px
- **Line height:** 1.00–1.62 (tighter as size grows; 1.00 at 57px, 1.62 at 15–16px)
- **Letter spacing:** normal across the entire scale
- **OpenType features:** `"kern" on, "liga" on`
- **Role:** Single-family type system used for everything from body copy to 57px display statements — the geometric uniformity across weights is the signature choice, avoiding any secondary or display-specific font so the wordmark 'CUSTO®' set at 57px reads as the same typographic family as a 15px form input label

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 15px | 1.43 | — | `--text-caption` |
| subheading | 20px | 1.38 | — | `--text-subheading` |
| heading-sm | 30px | 1.25 | — | `--text-heading-sm` |
| heading | 38px | 1.15 | — | `--text-heading` |
| display | 57px | 1 | — | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 28 | 28px | `--spacing-28` |
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 76 | 76px | `--spacing-76` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 8px |
| images | 8px |
| inputs | 8px |
| buttons | 31.35px (pill) for primary action; 8px for secondary |

### Layout

- **Page max-width:** 1280px
- **Section gap:** 110px
- **Card padding:** 20px
- **Element gap:** 24px

## Components

### Ghost Pill Button (Primary Action)
**Role:** Hero and feature-section call-to-action — 'Order now', 'Discover our smart mailbox'

Transparent background, 1px white border on gunmetal canvas or 1px Obsidian border on white sections, Paper White or Obsidian text, 31.35px pill radius, ~16px vertical / ~28px horizontal padding, PP Neue Montreal at 16px / 1.62. No fill state; hover inverts fill and text color.

### Text Link with Arrow
**Role:** Inline section CTA that bridges body copy to the next scroll position

Underlined text link in Obsidian or Paper White (reversed on gunmetal) with a right-arrow glyph. 15–16px PP Neue Montreal, 1.43–1.62 line-height, 15px padding-bottom for the underline to breathe.

### Display Wordmark
**Role:** Hero-scale brand statement — the CUSTO® lockup at architectural size

57px PP Neue Montreal Medium, line-height 1.00, set in Paper White on the gunmetal hero so it bleeds into the product silhouette. Registered-trademark glyph sits to the right as a circle-stroke mark.

### Product Image Card
**Role:** Horizontal scroll/grid of mailbox photography — lifestyle, close-up, in-situ

8px border-radius, Paper White or transparent surface, 1px Linen Mist border optional, full-bleed photograph with no overlay text. Three-up grid on desktop, single column on mobile.

### Two-Column Text Block
**Role:** Content sections pairing a small caption heading on the left with body copy on the right

Left column: 15–16px caption label in Obsidian. Right column: 30–38px heading in Obsidian, 19px body in Obsidian, line-height 1.42. 24px column gap, 110px vertical section gap.

### Top Navigation Bar
**Role:** Persistent header across all pages

Transparent over hero, becomes Paper White on scroll. Wordmark 'CUSTO®' left in 15–16px PP Neue Montreal, nav links centered (Smart mailboxes, How it works, The app, About) at 15–16px, Order now pill button right. 32px vertical padding.

### Text Input Field
**Role:** Form input for email capture, delivery address, or app registration

1px Aluminum Hairline (#d8d8d8) border, 8px radius, 16px vertical / 32px horizontal padding, 15–16px PP Neue Montreal placeholder in Brushed Steel. No visible focus ring; active state deepens border to Obsidian.

### Feature Heading (Hero Scale)
**Role:** Second-tier display statement — 'Receive the world at your doorstep.'

38px PP Neue Montreal, line-height 1.15, Paper White on gunmetal hero or Obsidian on white sections. Two-line wrap at 30–38 character column.

### Section Caption Label
**Role:** Small kicker text introducing each content block — 'Never let a parcel delivery rule your entire schedule again.'

15–16px PP Neue Montreal, line-height 1.43, Obsidian, max-width ~280px, left-aligned to mark the start of a section before the larger heading arrives.

### Award Badge
**Role:** Third-party trust mark — CES Innovation Awards 2024

Fixed bottom-right floater, ~56px square, full-color source artwork preserved (blue/yellow), 4px radius. No border or shadow; acts as a single decorative punctuation mark.

### Footer
**Role:** Minimal site footer

Paper White background, 1px Linen Mist top border, 15px PP Neue Montreal body text in Brushed Steel, single row of links. No social icons, no logo repeat, no newsletter form.

## Do's and Don'ts

### Do
- Set the 57px display wordmark in Paper White directly on the Canvas Gunmetal #9ea29f hero so the type reads as part of the product silhouette rather than floating above it
- Use a single 1px border in Obsidian #000000 or Paper White #ffffff for all interactive elements — never introduce fills, gradients, or shadows on buttons or cards
- Apply 31.35px pill radius exclusively to the primary action button ('Order now'); use 8px radius for every other input, card, and secondary button
- Maintain the 110px vertical section gap between content bands and alternate between Canvas Gunmetal and Paper White to create the gallery rhythm
- Keep body text at 19px / 1.42 and reserve 30px+ sizes for actual section headings — never use the display scale for body copy or UI labels
- Source product photography on Anodized Graphite #4b514d backgrounds so the mailbox material and the UI surface share the same value
- Enable "kern" and "liga" OpenType features on all PP Neue Montreal text to preserve the geometric spacing at large display sizes

### Don't
- Do not introduce any chromatic color — no blues, reds, greens, or purples for buttons, accents, or status states; the system is intentionally achromatic
- Do not use drop shadows, inner shadows, or glow effects on cards, buttons, or images; depth comes from the gunmetal/white alternation only
- Do not set the 57px display type in a condensed, italic, or different font family — PP Neue Montreal Medium at 400 is the only display voice
- Do not use borders thicker than 1px; the entire system relies on hairline structure and thicker rules would break the gallery feel
- Do not place the primary action button as a filled solid — all CTAs remain ghost/outlined so the gunmetal canvas stays visible
- Do not use background colors other than Canvas Gunmetal, Paper White, or Anodized Graphite for full-bleed sections
- Do not break the 4px spacing base; pad and gap values must snap to multiples of 4 (18, 20, 24, 32, 40)

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Gunmetal Hero Canvas | `#9ea29f` | Full-bleed hero and key feature band backgrounds |
| 2 | Paper White | `#ffffff` | Default content section background — body copy, text-image rows, footer |
| 3 | Anodized Graphite | `#4b514d` | Dark elevated surface, product photography backdrop, reversed heading text |

## Elevation

Custo avoids shadows entirely. Depth is communicated through three flat surface values (Canvas Gunmetal → Paper White → Anodized Graphite) and the product's own photographic reflectivity. This is a deliberate material decision — the UI behaves like a printed catalog spread, not a digital app.

## Imagery

Imagery is exclusively product photography of the Custo mailbox, shot in three modes: full-body hero portrait on the gunmetal canvas, lifestyle shots showing a person interacting with the unit, and extreme close-ups of the scanning interface and LED ring. All photography shares a desaturated, high-key treatment with the mailbox's matte black finish as the consistent visual anchor. No illustrations, no abstract graphics, no stock photography. Photographs are contained within 8px-radius cards or used full-bleed behind the 57px display wordmark. The CES award badge is the only piece of multicolor artwork on the entire site.

## Layout

The page model is a vertically stacked single column with a max content width of ~1280px centered in the viewport. The hero breaks full-bleed as Canvas Gunmetal #9ea29f from edge to edge, with the mailbox photograph centered-right and the 57px CUSTO® wordmark anchoring the bottom. Below the hero, sections alternate: a 2-column text block (small caption left, large heading right), followed by a horizontal 3-card product image grid, then 2-column text-image rows where body copy alternates sides. Section gaps are 110px, creating strong vertical breathing room. Navigation is a single transparent top bar that becomes Paper White on scroll. The CES badge is a fixed bottom-right floater. The overall rhythm is gallery-like: few elements per section, large type, wide gaps, and the product photograph as the visual punctuation between text bands.

## Agent Prompt Guide

**Quick Color Reference**
- background: Canvas Gunmetal #9ea29f (hero) / Paper White #ffffff (content)
- text: Obsidian #000000 (primary) / Brushed Steel #8e9194 (muted)
- border: Obsidian #000000 (structural) / Aluminum Hairline #d8d8d8 (inputs)
- accent: Anodized Graphite #4b514d (dark surface, product photography)
- primary action: no distinct CTA color

**Example Component Prompts**
1. **Hero Section** — Full-bleed Canvas Gunmetal #9ea29f background. Display wordmark 'CUSTO®' at 57px PP Neue Montreal Medium weight 400, line-height 1.00, color Paper White #ffffff, positioned bottom-center to overlap a centered product photograph. Secondary headline 'Receive the world at your doorstep.' at 38px / 1.15 in Paper White, top-left. Ghost pill button 'Order now' at 16px PP Neue Montreal, 1px Paper White border, 31.35px radius, 16px 28px padding.
No distinct primary action color was observed; use the extracted neutral button treatments instead of inventing a filled CTA color.
3. **Product Image Card Grid** — Three cards in a row, each 8px border-radius, 1px Linen Mist #a7aaad border, Paper White background padding 20px around a full-bleed product photograph. 24px column gap, 110px vertical gap from the preceding text block.
4. **Two-Column Content Row** — Left column 280px wide: 15px PP Neue Montreal caption label in Obsidian #000000. Right column flex: 38px heading (1.15 line-height) followed by 19px body copy (1.42 line-height) in Obsidian #000000. 24px column gap, 110px section gap top and bottom, Paper White #ffffff background.
5. **Email Input Field** — 1px Aluminum Hairline #d8d8d8 border, 8px radius, 16px vertical / 32px horizontal padding. Placeholder text 'Your email address' in 15px PP Neue Montreal, color Brushed Steel #8e9194. Active state deepens border to Obsidian #000000.

## Similar Brands

- **Teenage Engineering** — Same product-gallery presentation — large wordmark overlapping a single dark product photo, achromatic palette, oversized geometric sans-serif as the primary visual device
- **Nothing.tech** — Shared achromatic industrial product language with the display wordmark treated as a graphic element rather than just a brand mark, monochrome hero with a single physical object
- **Dyson** — Product-as-hero photography on a muted neutral background with a tall display headline and minimal UI chrome — the product's own material finish drives the visual system
- **Bowers & Wilkins** — Same restrained typographic scale, gunmetal-and-white alternation, and the wordmark deployed at architectural size as a near-watermark across hero sections
- **Bang & Olufsen** — Premium hardware brand that lets the product photograph and one oversized display type carry the entire page — no decorative UI elements, no chromatic accents

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-canvas-gunmetal: #9ea29f;
  --color-obsidian: #000000;
  --color-paper-white: #ffffff;
  --color-anodized-graphite: #4b514d;
  --color-brushed-steel: #8e9194;
  --color-linen-mist: #a7aaad;
  --color-aluminum-hairline: #d8d8d8;

  /* Typography — Font Families */
  --font-pp-neue-montreal: 'PP Neue Montreal', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 15px;
  --leading-caption: 1.43;
  --text-subheading: 20px;
  --leading-subheading: 1.38;
  --text-heading-sm: 30px;
  --leading-heading-sm: 1.25;
  --text-heading: 38px;
  --leading-heading: 1.15;
  --text-display: 57px;
  --leading-display: 1;

  /* Typography — Weights */
  --font-weight-regular: 400;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-76: 76px;

  /* Layout */
  --page-max-width: 1280px;
  --section-gap: 110px;
  --card-padding: 20px;
  --element-gap: 24px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-3xl: 31.35px;

  /* Named Radii */
  --radius-cards: 8px;
  --radius-images: 8px;
  --radius-inputs: 8px;
  --radius-buttons: 31.35px (pill) for primary action; 8px for secondary;

  /* Surfaces */
  --surface-gunmetal-hero-canvas: #9ea29f;
  --surface-paper-white: #ffffff;
  --surface-anodized-graphite: #4b514d;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-canvas-gunmetal: #9ea29f;
  --color-obsidian: #000000;
  --color-paper-white: #ffffff;
  --color-anodized-graphite: #4b514d;
  --color-brushed-steel: #8e9194;
  --color-linen-mist: #a7aaad;
  --color-aluminum-hairline: #d8d8d8;

  /* Typography */
  --font-pp-neue-montreal: 'PP Neue Montreal', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 15px;
  --leading-caption: 1.43;
  --text-subheading: 20px;
  --leading-subheading: 1.38;
  --text-heading-sm: 30px;
  --leading-heading-sm: 1.25;
  --text-heading: 38px;
  --leading-heading: 1.15;
  --text-display: 57px;
  --leading-display: 1;

  /* Spacing */
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-76: 76px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-3xl: 31.35px;
}
```
