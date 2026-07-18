# Outsource Consultants — Style Reference
> Architectural broadsheet on bone paper. A monograph aesthetic where one violent indigo section interrupts an otherwise warm, typographically maximalist grid.

**Theme:** light

Outsource Consultants operates on a stark editorial-architectural system: a warm bone-gray canvas, a single vivid indigo that detonates across full-bleed sections, and typography that swings between a grotesque sans at 160px and a mono micro-label at 10px. The aesthetic borrows from Swiss broadsides and architecture plates — large type does the heavy lifting while information is compressed into monospaced metadata. Layouts are asymmetric and generous, with sections alternating between bone and indigo rather than stacking on white. Components are borderless, almost flat, relying on scale and the indigo-on-bone contrast to create hierarchy rather than elevation, shadows, or fills. The system feels less like a SaaS dashboard and more like a printed monograph for a technical practice.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Indigo Strike | `#1925aa` | `--color-indigo-strike` | Brand mark, full-bleed section backgrounds, large headlines, icon strokes, nav borders — the singular chromatic voice of the system, used as a sudden tonal shift rather than a decorative accent |
| Bone | `#e8e6e0` | `--color-bone` | Page canvas and card surface — a warm off-white that reads as paper rather than screen, providing the neutral ground against which indigo gains force |
| Ink | `#000000` | `--color-ink` | Body copy, small labels, standard text — used for dense information layers that must stay recessive against the bone canvas |
| Paper | `#ffffff` | `--color-paper` | Light supporting surface for subtle backgrounds and section separation. Do not promote it to the primary CTA color |
| Deep Indigo | `#0d1355` | `--color-deep-indigo` | Logo and brand-mark fill — a near-black violet that grounds the wordmark against the brighter Indigo Strike used in UI contexts |

## Tokens — Typography

### GT America Mono — Micro-metadata and technical labels — nav identifiers, menu button text, accordion descriptions, footer tags. The mono face signals 'technical / regulatory / specification' and is kept under 14px so it reads as annotation rather than content. Negative tracking at 10px tightens the monospace grid; the slight positive tracking at 14px opens it for legibility. This pairing of editorial sans + technical mono is the system's core typographic gesture. · `--font-gt-america-mono`
- **Substitute:** JetBrains Mono, IBM Plex Mono, or Space Mono
- **Weights:** 400, 500
- **Sizes:** 10, 12, 14px
- **Line height:** 1.00, 1.30, 1.33, 1.50
- **Letter spacing:** -0.05em at 10px, +0.02em at 14px
- **Role:** Micro-metadata and technical labels — nav identifiers, menu button text, accordion descriptions, footer tags. The mono face signals 'technical / regulatory / specification' and is kept under 14px so it reads as annotation rather than content. Negative tracking at 10px tightens the monospace grid; the slight positive tracking at 14px opens it for legibility. This pairing of editorial sans + technical mono is the system's core typographic gesture.

### PP Neue Montreal — Display and editorial type — carries the massive hero headline at 160px (line-height 0.94, so letters nearly touch), subheadings at 36–46px, and body at 18px. The grotesque geometry and tight line-height at scale create a poster-like voice; the same family steps down to 12–16px for nav links and service titles. Using one sans family from 12px to 160px (an extreme ratio) is a signature choice — it means hierarchy is built by size alone, not by weight or family switching. · `--font-pp-neue-montreal`
- **Substitute:** Inter, Söhne, or General Sans
- **Weights:** 400, 500
- **Sizes:** 12, 16, 18, 24, 30, 36, 46, 160px
- **Line height:** 0.94, 1.00, 1.50
- **Role:** Display and editorial type — carries the massive hero headline at 160px (line-height 0.94, so letters nearly touch), subheadings at 36–46px, and body at 18px. The grotesque geometry and tight line-height at scale create a poster-like voice; the same family steps down to 12–16px for nav links and service titles. Using one sans family from 12px to 160px (an extreme ratio) is a signature choice — it means hierarchy is built by size alone, not by weight or family switching.

### ui-sans-serif — ui-sans-serif — detected in extracted data but not described by AI · `--font-ui-sans-serif`
- **Weights:** 400
- **Sizes:** 16px
- **Line height:** 1.5
- **Role:** ui-sans-serif — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 10px | 1.5 | -0.5px | `--text-caption` |
| body | 16px | 1.5 | — | `--text-body` |
| body-lg | 18px | 1.5 | — | `--text-body-lg` |
| subheading | 24px | 1.3 | — | `--text-subheading` |
| heading-sm | 30px | 1.2 | — | `--text-heading-sm` |
| heading | 36px | 1.1 | — | `--text-heading` |
| heading-lg | 46px | 1.05 | — | `--text-heading-lg` |
| display | 160px | 0.94 | -0.8px | `--text-display` |

## Tokens — Spacing & Shapes

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 6 | 6px | `--spacing-6` |
| 10 | 10px | `--spacing-10` |
| 11 | 11px | `--spacing-11` |
| 12 | 12px | `--spacing-12` |
| 15 | 15px | `--spacing-15` |
| 16 | 16px | `--spacing-16` |
| 17 | 17px | `--spacing-17` |
| 18 | 18px | `--spacing-18` |
| 20 | 20px | `--spacing-20` |
| 22 | 22px | `--spacing-22` |
| 24 | 24px | `--spacing-24` |
| 25 | 25px | `--spacing-25` |
| 26 | 26px | `--spacing-26` |
| 28 | 28px | `--spacing-28` |
| 30 | 30px | `--spacing-30` |
| 46 | 46px | `--spacing-46` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 0px |
| cards | 0px |
| inputs | 0px |
| buttons | 0px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 20px
- **Element gap:** 15px

## Components

### Brand Header Bar
**Role:** Sticky top navigation

Left-aligned logo wordmark ('Outsource Consultants Inc.') set in GT America Mono 10px in Deep Indigo, preceded by a small square brand mark in Deep Indigo. Right-aligned secondary nav links in GT America Mono 10px tracking +0.02em. The header sits directly on the bone canvas with no background fill and no shadow — its presence is defined by content density rather than a container.

### Menu Toggle Button
**Role:** Navigation trigger

A square Paper (#ffffff) button containing the word 'MENU' in GT America Mono 10px tracking +0.02em in Ink, with a flush-right 1:1 Indigo Strike square containing a white '/' glyph. Zero radius, no border, no shadow. The pairing of neutral button + chromatic icon is the only place where indigo acts as a small functional mark — it reads as a light switch rather than a CTA.

### Hero Display Headline
**Role:** Section anchor / brand statement

PP Neue Montreal 160px weight 400, line-height 0.94, color Bone (#e8e6e0) when on the indigo full-bleed, or Ink when on bone canvas. The extreme line-height is intentional — letters at 160px nearly touch vertically, creating a dense block of type. Sits flush-left, bleeding to the page edge, with no accompanying image or illustration.

### Vertical Side Label
**Role:** Section annotation

Short caption (2–4 words) rotated 90° counter-clockwise, set in PP Neue Montreal 18px weight 400 in Bone, positioned in the right margin. Acts as a printed-margin annotation — a signature editorial device borrowed from broadsheet layout.

### Full-Bleed Indigo Section
**Role:** Alternating tonal band

Edge-to-edge Indigo Strike (#1925aa) background with a large multi-line headline in PP Neue Montreal 46px weight 400 in Bone, and supporting body copy in 18px Bone. The section is a complete inversion of the bone canvas — same typography, reversed tonal relationship. Used sparingly, once per page, to break monotony.

### Service Accordion Item — Collapsed
**Role:** Expandable list row

Full-width row, PP Neue Montreal 24px weight 500 in Indigo Strike, flush-left, with a '+' glyph in PP Neue Montreal 24px in Indigo Strike flush-right. Separated from the next row by a 1px hairline border in Ink at 10–15% opacity. Zero padding-top/bottom asymmetry — the row is the unit of rhythm.

### Service Accordion Item — Expanded
**Role:** Open accordion panel

Same row treatment as collapsed state but with a '×' glyph replacing '+', and a description block below in GT America Mono 10px tracking -0.05em in Indigo Strike, followed by a '[ LEARN MORE → ]' link in the same mono micro-label style. The expanded description sits indented to align with the title baseline, not flush-left, creating a subtle hanging indent.

### Section Heading Pair
**Role:** Two-part section title

Two words placed at opposite horizontal extremes of the section — e.g. 'Our' flush-left and 'Services' flush-right — both in PP Neue Montreal 160px weight 400 in Indigo Strike. A 1px vertical hairline in Ink at low opacity bisects the section between them. This split-heading pattern is a signature device for introducing multi-part content.

### Centered Body Caption
**Role:** Editorial block

Short paragraph (2–4 lines) in GT America Mono 10px tracking +0.02em, all-caps, centered, in Indigo Strike. Used as a transitional element between sections — reads as a caption beneath an architectural plate.

## Do's and Don'ts

### Do
- Let PP Neue Montreal do the work — push display sizes to 46–160px and use line-height 0.94–1.10 at those scales; do not add weight to compensate for small size.
- Use GT America Mono exclusively for labels, captions, nav items, and accordion descriptions; keep it at 10–14px with tracking -0.05em (tight) at 10px and +0.02em (open) at 14px.
- Alternate between the bone canvas and the Indigo Strike full-bleed to create section rhythm — do not stack multiple bone sections without an indigo interruption.
- Treat borders as hairlines: 1px Ink at low opacity for dividers between accordion rows and section bisectors; never use borders for cards or containers.
- Use vertical rotated text in the right margin (18px PP Neue Montreal) as a section annotation device.
- Anchor every section with a flush-left display headline in the body color (Ink on bone, Bone on indigo); keep headlines full-width and uncontained.
- Keep all corners sharp — 0px radius on every element including buttons, cards, and tags.

### Don't
- Do not introduce shadows, glows, blurs, or any form of drop elevation — the system is deliberately flat.
- Do not use indigo as a button background fill — the Menu button is white with an indigo icon square; indigo is a surface, not an action color.
- Do not add a second accent color — the system is bone + ink + a single indigo; any new chromatic role will dilute the editorial tension.
- Do not use PP Neue Montreal below 12px — the grotesque loses character at small sizes; switch to GT America Mono for anything sub-14px.
- Do not center headlines or wrap them — display type stays flush-left and bleeds toward the page edge.
- Do not use cards with backgrounds, padding, or radius — content sits directly on the bone canvas divided only by hairlines.
- Do not use a system font fallback for hero type — if PP Neue Montreal is unavailable, substitute with a grotesque (Inter or Söhne), not a humanist sans.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Bone Canvas | `#e8e6e0` | Base page background — the warm off-white that defines the system's paper-like quality |
| 1 | Paper | `#ffffff` | Menu button fill and any element that needs to visually punch through the bone canvas |
| 2 | Indigo Field | `#1925aa` | Full-bleed section background — the only chromatic surface, used for tonal punctuation between bone sections |

## Elevation

No shadows, no blur, no glow. The system treats elevation as a tonal problem rather than a depth problem: hierarchy is created by switching between bone, paper, and indigo surfaces, and by using borderless dividers (1px hairline rules) rather than drop-shadows. This flatness is a deliberate editorial choice — the page should read as a printed plate, not a glassy app.

## Imagery

No photography, illustration, or product imagery. The system is pure typography on flat color — the page reads as a printed document. The only graphical element is the small square brand mark in the header and the '/' icon glyph in the menu button, both flat single-color. Visual richness comes entirely from typographic scale and the bone/indigo tonal alternation.

## Layout

Asymmetric editorial layout. The page is not a max-width centered column — it is a series of full-bleed horizontal bands (bone or indigo) with content anchored to the left edge and occasional vertical annotations in the right margin. The hero is a 160px flush-left display headline with a rotated side label, spanning the full viewport. Section transitions use the split-heading device (one word left, one word right, hairline bisector). Service lists are full-width accordions, not card grids. Navigation is a minimal single-line header with no dropdowns visible — menu access is gated by the Menu button. The overall rhythm is slow and poster-like: few elements per viewport, large vertical breathing room (80px section gaps), and tonal shifts doing the work that cards and grids do in conventional SaaS layouts.

## Agent Prompt Guide

Quick Color Reference:
- text: #000000 (Ink) on bone, #e8e6e0 (Bone) on indigo
- background: #e8e6e0 (Bone canvas)
- border: 1px Ink at ~10% opacity for hairlines
- accent: #1925aa (Indigo Strike) — used for headlines, icons, and full-bleed section backgrounds, not for button fills
- primary action: no distinct CTA color

Example Component Prompts:

1. Service Accordion Row (collapsed): Full-width row on Bone canvas (#e8e6e0). Title in PP Neue Montreal 24px weight 500, color #1925aa, flush-left. '+' glyph in PP Neue Montreal 24px weight 400, color #1925aa, flush-right. 1px hairline border-bottom in #000000 at 10% opacity. Zero padding-radius. No background fill.

2. Hero Display Headline: PP Neue Montreal 160px weight 400, line-height 0.94, color #000000 (on bone) or #e8e6e0 (on indigo), flush-left, bleeding to the left page edge. Paired with a rotated 18px PP Neue Montreal caption in #e8e6e0 positioned in the right margin.

3. Menu Toggle Button: Square button, 40×40px, background #ffffff, containing 'MENU' in GT America Mono 10px tracking +0.02em in #000000, with a flush-right 40×40px #1925aa square containing a white '/' glyph. Zero radius, no border.

4. Full-Bleed Indigo Section: Background #1925aa spanning full viewport width. Headline in PP Neue Montreal 46px weight 400 line-height 1.05, color #e8e6e0, flush-left. Body copy in PP Neue Montreal 18px weight 400, color #e8e6e0.

5. Section Heading Pair: Two words (e.g. 'Our' and 'Services') in PP Neue Montreal 160px weight 400 color #1925aa, placed at opposite horizontal edges of the section (one flush-left, one flush-right). A 1px vertical hairline in #000000 at 10% opacity bisects the section between them.

## Typographic Philosophy

The system uses a single grotesque sans (PP Neue Montreal) from 12px to 160px, creating an extreme type ratio of ~13:1 between body and display. This is unusual — most sites cap display at 3–4× body size. The result is that headlines behave like posters rather than headings: they dominate the viewport and force the page to scroll vertically through them. Pairing this with a monospaced micro-face (GT America Mono) at 10–14px creates a two-register system: monumental statements and technical annotations. There is no middle-weight voice. Body text at 16–18px is the quietest register, which is counterintuitive but intentional — the system privileges the dramatic and the granular over the conversational.

## Similar Brands

- **Pentagram** — Same editorial-broadsheet approach: full-bleed single-color sections, grotesque sans at extreme display sizes, minimal nav, and typography doing all the compositional work
- **Studio Dumbar** — Single-accent chromatic interruption against a neutral canvas, rotated side labels as annotation devices, and poster-scale type used in place of imagery
- **Werkplaats Typografie archive** — Architectural/technical aesthetic with mono micro-labels, hairline dividers, and a bone-paper feel — type as the primary visual element
- **Hofmann & Brand (or similar Swiss editorial agencies)** — Split two-word headings bisected by hairlines, generous asymmetric whitespace, and a single indigo/blue that detonates against warm off-white

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-indigo-strike: #1925aa;
  --color-bone: #e8e6e0;
  --color-ink: #000000;
  --color-paper: #ffffff;
  --color-deep-indigo: #0d1355;

  /* Typography — Font Families */
  --font-gt-america-mono: 'GT America Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-pp-neue-montreal: 'PP Neue Montreal', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-ui-sans-serif: 'ui-sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.5;
  --tracking-caption: -0.5px;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-body-lg: 18px;
  --leading-body-lg: 1.5;
  --text-subheading: 24px;
  --leading-subheading: 1.3;
  --text-heading-sm: 30px;
  --leading-heading-sm: 1.2;
  --text-heading: 36px;
  --leading-heading: 1.1;
  --text-heading-lg: 46px;
  --leading-heading-lg: 1.05;
  --text-display: 160px;
  --leading-display: 0.94;
  --tracking-display: -0.8px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;

  /* Spacing */
  --spacing-6: 6px;
  --spacing-10: 10px;
  --spacing-11: 11px;
  --spacing-12: 12px;
  --spacing-15: 15px;
  --spacing-16: 16px;
  --spacing-17: 17px;
  --spacing-18: 18px;
  --spacing-20: 20px;
  --spacing-22: 22px;
  --spacing-24: 24px;
  --spacing-25: 25px;
  --spacing-26: 26px;
  --spacing-28: 28px;
  --spacing-30: 30px;
  --spacing-46: 46px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 20px;
  --element-gap: 15px;

  /* Named Radii */
  --radius-tags: 0px;
  --radius-cards: 0px;
  --radius-inputs: 0px;
  --radius-buttons: 0px;

  /* Surfaces */
  --surface-bone-canvas: #e8e6e0;
  --surface-paper: #ffffff;
  --surface-indigo-field: #1925aa;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-indigo-strike: #1925aa;
  --color-bone: #e8e6e0;
  --color-ink: #000000;
  --color-paper: #ffffff;
  --color-deep-indigo: #0d1355;

  /* Typography */
  --font-gt-america-mono: 'GT America Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-pp-neue-montreal: 'PP Neue Montreal', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-ui-sans-serif: 'ui-sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.5;
  --tracking-caption: -0.5px;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-body-lg: 18px;
  --leading-body-lg: 1.5;
  --text-subheading: 24px;
  --leading-subheading: 1.3;
  --text-heading-sm: 30px;
  --leading-heading-sm: 1.2;
  --text-heading: 36px;
  --leading-heading: 1.1;
  --text-heading-lg: 46px;
  --leading-heading-lg: 1.05;
  --text-display: 160px;
  --leading-display: 0.94;
  --tracking-display: -0.8px;

  /* Spacing */
  --spacing-6: 6px;
  --spacing-10: 10px;
  --spacing-11: 11px;
  --spacing-12: 12px;
  --spacing-15: 15px;
  --spacing-16: 16px;
  --spacing-17: 17px;
  --spacing-18: 18px;
  --spacing-20: 20px;
  --spacing-22: 22px;
  --spacing-24: 24px;
  --spacing-25: 25px;
  --spacing-26: 26px;
  --spacing-28: 28px;
  --spacing-30: 30px;
  --spacing-46: 46px;
}
```
