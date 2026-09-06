# Caldera — Style Reference
> forge fire on warm limestone. The canvas is raw warm plaster, and every orange element reads as glowing embers pressed into the surface.

**Theme:** light

Caldera runs on a warm limestone canvas flooded with molten orange. The interface is flat and unshadowed, letting ultrabold compressed type at near-architectural scale (up to 189px) carry all structural weight. A single vivid orange (#fc5000) acts as the only aggressive chromatic accent against monochrome warm grays, with a violet plasma reserved for the hero halftone and a sulfur yellow for tags. The visual language is volcanic: condensed heavy letterforms, halftone dot patterns, 40px radii on cards and buttons, and 800px pill controls — heat contained within a soft, paper-like surface.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Ember | `#fc5000` | `--color-ember` | Primary action buttons, featured stat cards, key visual highlights — the only aggressive chromatic accent; its vivid saturation against warm grays creates urgency without needing supporting decorative weight |
| Plasma Violet | `#524ae9` | `--color-plasma-violet` | Hero halftone gradient base, single secondary card surface — appears almost exclusively in the hero dot pattern and one standout card; never used for controls |
| Sulfur | `#f5f28e` | `--color-sulfur` | Tag and category badge backgrounds, small highlight washes — the soft yellow that labels blog post categories and program announcements |
| Limestone | `#f7f6f2` | `--color-limestone` | Card surfaces, content block backgrounds, secondary button fills — the lighter warm off-white that lifts elements off the page canvas |
| Pumice | `#e2e2df` | `--color-pumice` | Page canvas, dominant background — the warm medium-gray that grounds every section; slightly darker than card surfaces to create subtle figure/ground separation without shadows |
| Obsidian | `#070607` | `--color-obsidian` | Primary text, headings, link text, button borders — near-black with a barely-warm cast matching the canvas warmth |
| Chalk | `#ffffff` | `--color-chalk` | Dark-section text, input text on dark backgrounds, high-contrast overlays — pure white used only where maximum contrast against dark surfaces is required |

## Tokens — Typography

### PP Neue Corp Compact — All headings and display text. A custom condensed ultrabold face that gives headlines an industrial, sign-painted weight. The 189px display size in the hero is the signature — compressed, almost structural rather than typographic. Feature settings "ss06" and "ss10" activate alternate letterforms and spacing for a more aggressive condensed rhythm. Positive tracking (+0.02em) is unusual for display sizes and keeps the heavy strokes from feeling claustrophobic at 80–189px. · `--font-pp-neue-corp-compact`
- **Substitute:** Bebas Neue, Anton, Druk Wide Bold
- **Weights:** 400 (Ultrabold cut)
- **Sizes:** 26px, 32px, 40px, 48px, 56px, 64px, 80px, 96px, 189px
- **Line height:** 0.94–1.20
- **Letter spacing:** 0.64px at 32px (0.02em), scaling proportionally to ~3.78px at display 189px
- **OpenType features:** `"ss06", "ss10"`
- **Role:** All headings and display text. A custom condensed ultrabold face that gives headlines an industrial, sign-painted weight. The 189px display size in the hero is the signature — compressed, almost structural rather than typographic. Feature settings "ss06" and "ss10" activate alternate letterforms and spacing for a more aggressive condensed rhythm. Positive tracking (+0.02em) is unusual for display sizes and keeps the heavy strokes from feeling claustrophobic at 80–189px.

### DM Sans — Body copy, nav links, button labels, supporting headings up to 30px. Medium weight throughout is deliberate — Regular would feel too thin against the ultrabold display type, and Bold would compete with it. DM Sans provides a humanist, slightly geometric counterpoint to the industrial display face. · `--font-dm-sans`
- **Substitute:** Inter, Manrope
- **Weights:** 500 (Medium only — never Regular or Bold)
- **Sizes:** 14px, 16px, 18px, 30px
- **Line height:** 1.20–1.55
- **Role:** Body copy, nav links, button labels, supporting headings up to 30px. Medium weight throughout is deliberate — Regular would feel too thin against the ultrabold display type, and Bold would compete with it. DM Sans provides a humanist, slightly geometric counterpoint to the industrial display face.

### System sans-serif — Captions, meta text, dates, micro-labels. Only used at 12px where weight and brand presence matter less than size economy. · `--font-system-sans-serif`
- **Weights:** 400
- **Sizes:** 12px
- **Line height:** 1.20
- **Role:** Captions, meta text, dates, micro-labels. Only used at 12px where weight and brand presence matter less than size economy.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.2 | — | `--text-caption` |
| body-sm | 14px | 1.2 | — | `--text-body-sm` |
| body | 16px | 1.55 | — | `--text-body` |
| subheading | 26px | 1.2 | — | `--text-subheading` |
| heading-sm | 30px | 1.5 | — | `--text-heading-sm` |
| heading | 32px | 1 | 0.64px | `--text-heading` |
| heading-lg | 48px | 1 | — | `--text-heading-lg` |
| heading-2xl | 80px | 1.1 | — | `--text-heading-2xl` |
| heading-3xl | 96px | 0.95 | — | `--text-heading-3xl` |
| display | 189px | 0.94 | — | `--text-display` |

## Tokens — Spacing & Shapes

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 8 | 8px | `--spacing-8` |
| 9 | 9px | `--spacing-9` |
| 10 | 10px | `--spacing-10` |
| 12 | 12px | `--spacing-12` |
| 16 | 16px | `--spacing-16` |
| 18 | 18px | `--spacing-18` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 56 | 56px | `--spacing-56` |
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |
| 92 | 92px | `--spacing-92` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 40px |
| pills | 800px |
| small | 16px |
| inputs | 100px |
| medium | 20px |
| buttons | 40px |

### Layout

- **Page max-width:** 1280px
- **Section gap:** 80px
- **Card padding:** 40px
- **Element gap:** 16px

## Components

### Primary CTA Button
**Role:** Main conversion action

Filled Ember (#fc5000) with Obsidian (#070607) text. 800px border-radius (full pill). Padding 12px vertical, 24px horizontal. DM Sans 500 weight at 16px. No shadow. The pill shape is the most distinctive control shape in the system — never rectangular.

### Secondary Pill Button
**Role:** Alternative action or paired CTA

Transparent background, 1.5px Obsidian (#070607) border, Obsidian text. 40px border-radius. Padding 16px all sides. DM Sans 500 at 16px. Border style is solid here, not dotted. Sits beside the primary CTA as the quieter counterpart.

### Outlined Ghost Link
**Role:** Low-emphasis text link or nav item

Transparent background, no visible border, Obsidian text. 800px pill radius. Padding 0 vertical, 12px horizontal. DM Sans 500 at 16px. Used for nav items and inline links — relies on color and position rather than container weight.

### Stat Feature Card
**Role:** Highlight key metrics (TVL, transactions, etc.)

Ember (#fc5000) solid background, Chalk (#ffffff) text. 40px border-radius. Padding 40px on all sides. No shadow. The large metric number uses PP Neue Corp Compact at 80px+; the label above uses DM Sans 500 at 14–16px. These cards are the system’s most visually dominant elements after the hero.

### Content Card
**Role:** Blog posts, announcements, program entries

Limestone (#f7f6f2) background, no border, no shadow. 40px border-radius. Padding 40px all sides. Contains a category tag, headline (PP Neue Corp Compact 26–32px in Obsidian), and date metadata. The image area at the top can be a halftone or solid Ember block.

### Plasma Hero Card
**Role:** Single standout content surface

Plasma Violet (#524ae9) background with white halftone dot pattern overlay. 40px border-radius. Used sparingly — appears once as a signature visual anchor. No shadow.

### Category Tag Badge
**Role:** Label blog posts and announcements

Sulfur (#f5f28e) background, Obsidian (#070607) text. Pill shape (800px radius). DM Sans 500 at 12–14px. Padding approximately 3–4px vertical, 8–10px horizontal. Small, bright, and functionally pure — the only yellow element in the system.

### Navigation Bar
**Role:** Top-level site navigation

Pumice (#e2e2df) page background continues through. Nav items are Obsidian text in DM Sans 500 at 16px, separated by 9px gaps. The entire nav row can sit inside a Limestone (#f7f6f2) pill container with 800px radius — a signature element. Logo lockup (mountain icon + wordmark) sits left, social icons and CTA right.

### Hero Halftone Block
**Role:** Hero section visual centerpiece

Large rounded rectangle filled with a Plasma Violet (#524ae9) to Ember (#fc5000) gradient overlaid with an orange halftone dot pattern. 40px border-radius. Dimensions are hero-scale (roughly 50% of viewport width). The halftone effect is the system’s most distinctive visual signature — pixel-art-like, high-density dot grid that fades to solid orange at the top right.

### Input Field
**Role:** Form input on dark sections

Transparent background, 1.5px Chalk (#ffffff) border. 100px border-radius (pill). Padding 24px vertical, 32px left, 64px right. Chalk text. DM Sans 500. Used in dark/contrast sections only.

### Partner Logo Strip
**Role:** Display ecosystem partners or integrations

Limestone (#f7f6f2) background card, 40px radius, 40px padding. Logos arranged in a single row with consistent height, separated by vertical 1.5px Obsidian dotted dividers. No individual logo containers — flat inline treatment.

### Dotted Divider
**Role:** Section separator and decorative detail

1.5px dotted line in Obsidian (#070607). Used as vertical dividers in nav and partner strips, and occasionally as horizontal section breaks. The dotted (not dashed, not solid) style is a small but consistent signature detail.

## Do's and Don'ts

### Do
- Use PP Neue Corp Compact at 48px or larger for any heading that needs to feel structural — below 40px the ultrabold weight overwhelms and loses its industrial character
- Apply 40px border-radius to all cards, content blocks, and non-pill buttons as the default surface radius
- Use 800px border-radius (full pill) for all buttons, tags, nav containers, and small interactive elements
- Set primary CTAs to Ember (#fc5000) with Obsidian (#070607) text, sized at 12px/24px padding — never rectangular, always pill-shaped
- Keep body text at DM Sans 500 (Medium) — never drop to Regular weight, which reads as anemic against the ultrabold display type
- Use the halftone dot pattern (orange dots on violet) as the hero/signature visual treatment — it is the system’s most recognizable motif
- Layer surfaces using color contrast (Pumice canvas → Limestone cards → Ember features) rather than shadows or borders

### Don't
- Do not add drop shadows to any element — the system is intentionally flat; shadows would undermine the paper-like warmth
- Do not use rectangular (low-radius) buttons — the pill/40px-radius treatment is non-negotiable
- Do not introduce additional accent colors beyond Ember, Plasma Violet, and Sulfur — the palette is deliberately constrained to three chromatic tones
- Do not use Regular or Bold weights of DM Sans for body — Medium (500) is the only correct weight
- Do not set headings below 26px or above 189px — the display type only works at architectural scale
- Do not use Plasma Violet for buttons or controls — it is reserved for the hero halftone and a single accent card
- Do not apply negative letter-spacing to PP Neue Corp Compact — the +0.02em positive tracking is intentional at display sizes to prevent stroke collision

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Pumice Canvas | `#e2e2df` | Page background — warm medium-gray that grounds all content |
| 1 | Limestone Surface | `#f7f6f2` | Cards, content blocks, secondary buttons — lighter warm off-white |
| 2 | Ember Feature | `#fc5000` | Featured stat cards and emphasis surfaces — the only chromatic surface elevation |
| 3 | Plasma Hero | `#524ae9` | Hero halftone block — reserved for the homepage hero gradient overlay |

## Elevation

Deliberately shadowless. The design relies on color contrast (warm gray vs lighter off-white vs vivid orange) and generous 40px corner radii to create surface hierarchy. No element casts a shadow anywhere in the system — the flatness keeps the heavy type and bold orange from feeling overwrought.

## Imagery

Imagery is minimal and deliberate. The hero uses an abstract halftone dot pattern (orange dots on a violet-to-orange gradient) rather than photography — it functions as brand artwork, not decoration. Product and announcement cards use either solid Ember blocks or the Plasma Violet halftone as image-area fills, keeping a consistent graphic system. Partner/integration logos are rendered as monochrome marks on light backgrounds. No photography, no 3D renders, no lifestyle imagery anywhere. Icons are small, monochrome, and minimal — Discord, X, and Telegram sit in the nav as simple glyphs. The visual language is graphic and editorial, not photographic: think poster design, not stock imagery.

## Agent Prompt Guide

## Quick Color Reference
- Page background: #e2e2df (Pumice)
- Card/content surface: #f7f6f2 (Limestone)
- Primary text/headings: #070607 (Obsidian)
- primary action: #fc5000 (filled action)
- Accent: #524ae9 (Plasma Violet) — hero halftone only
- Tag/badge: #f5f28e (Sulfur)
- Input border (dark sections): #ffffff (Chalk)

## 3-5 Example Component Prompts
1. Create a Primary Action Button: #fc5000 background, #000000 text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.

2. **Stat Row**: Four Ember (#fc5000) cards in a row, each 40px radius, 40px padding. Label in DM Sans 500 at 14px, Chalk (#ffffff) text. Metric value in PP Neue Corp Compact at 80px weight 400, Chalk text, line-height 1.1.

3. **Content Card**: Limestone (#f7f6f2) background, 40px radius, 40px padding. Sulfur (#f5f28e) pill tag at top with DM Sans 500 12px Obsidian text, 800px radius. Headline at 32px PP Neue Corp Compact, Obsidian, letter-spacing 0.64px. Date at 12px system sans-serif, Obsidian.


5. **Dark Input Section**: Obsidian (#070607) background. Chalk (#ffffff) pill input with 100px radius, 24px/32px padding, 1.5px Chalk border. DM Sans 500 16px Chalk text. Submit button: Ember fill, 800px radius, 12px/24px padding.

## Signature Motifs

Three visual signatures define Caldera’s identity and should be reused across new pages: (1) The halftone dot pattern — orange dots on a violet-to-orange gradient, always at hero scale with 40px radius, is the most recognizable motif. (2) The 189px display headline — ultrabold compressed type at near-architectural scale, with tight 0.94 line-height, signals the page is a Caldera page. (3) The triple-radius system — 100px for inputs, 40px for cards and rectangular buttons, 800px for pills — creates a consistent roundness without monotony.

## Similar Brands

- **Berachain** — Similar crypto/web3 site language with warm off-white canvas, massive condensed display type, and a single bold accent color dominating featured surfaces
- **Monad** — Matching approach of ultrabold compressed headlines at near-architectural scale, flat no-shadow surfaces, and pill-shaped controls with aggressive border-radius
- **Dymension** — Shared visual DNA of warm neutral canvas, single vivid accent color for CTAs and stat cards, and condensed industrial display typography
- **Blast** — Same flat-design philosophy on warm background, pill buttons in one dominant accent color, and oversized compressed headlines as structural anchors
- **Arbitrum** — Comparable crypto ecosystem site pattern with generous 40px surface radii, warm light canvas, and medium-weight body sans against heavy display type

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-ember: #fc5000;
  --color-plasma-violet: #524ae9;
  --color-sulfur: #f5f28e;
  --color-limestone: #f7f6f2;
  --color-pumice: #e2e2df;
  --color-obsidian: #070607;
  --color-chalk: #ffffff;

  /* Typography — Font Families */
  --font-pp-neue-corp-compact: 'PP Neue Corp Compact', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-dm-sans: 'DM Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-system-sans-serif: 'System sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.2;
  --text-body-sm: 14px;
  --leading-body-sm: 1.2;
  --text-body: 16px;
  --leading-body: 1.55;
  --text-subheading: 26px;
  --leading-subheading: 1.2;
  --text-heading-sm: 30px;
  --leading-heading-sm: 1.5;
  --text-heading: 32px;
  --leading-heading: 1;
  --tracking-heading: 0.64px;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1;
  --text-heading-2xl: 80px;
  --leading-heading-2xl: 1.1;
  --text-heading-3xl: 96px;
  --leading-heading-3xl: 0.95;
  --text-display: 189px;
  --leading-display: 0.94;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-9: 9px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-18: 18px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-92: 92px;

  /* Layout */
  --page-max-width: 1280px;
  --section-gap: 80px;
  --card-padding: 40px;
  --element-gap: 16px;

  /* Border Radius */
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-3xl: 24px;
  --radius-3xl-2: 32px;
  --radius-3xl-3: 40px;
  --radius-full: 100px;
  --radius-full-2: 800px;

  /* Named Radii */
  --radius-cards: 40px;
  --radius-pills: 800px;
  --radius-small: 16px;
  --radius-inputs: 100px;
  --radius-medium: 20px;
  --radius-buttons: 40px;

  /* Surfaces */
  --surface-pumice-canvas: #e2e2df;
  --surface-limestone-surface: #f7f6f2;
  --surface-ember-feature: #fc5000;
  --surface-plasma-hero: #524ae9;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-ember: #fc5000;
  --color-plasma-violet: #524ae9;
  --color-sulfur: #f5f28e;
  --color-limestone: #f7f6f2;
  --color-pumice: #e2e2df;
  --color-obsidian: #070607;
  --color-chalk: #ffffff;

  /* Typography */
  --font-pp-neue-corp-compact: 'PP Neue Corp Compact', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-dm-sans: 'DM Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-system-sans-serif: 'System sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.2;
  --text-body-sm: 14px;
  --leading-body-sm: 1.2;
  --text-body: 16px;
  --leading-body: 1.55;
  --text-subheading: 26px;
  --leading-subheading: 1.2;
  --text-heading-sm: 30px;
  --leading-heading-sm: 1.5;
  --text-heading: 32px;
  --leading-heading: 1;
  --tracking-heading: 0.64px;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1;
  --text-heading-2xl: 80px;
  --leading-heading-2xl: 1.1;
  --text-heading-3xl: 96px;
  --leading-heading-3xl: 0.95;
  --text-display: 189px;
  --leading-display: 0.94;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-9: 9px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-18: 18px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-92: 92px;

  /* Border Radius */
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-3xl: 24px;
  --radius-3xl-2: 32px;
  --radius-3xl-3: 40px;
  --radius-full: 100px;
  --radius-full-2: 800px;
}
```
