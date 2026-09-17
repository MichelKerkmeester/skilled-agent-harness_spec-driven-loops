# How Many Plants — Style Reference
> Golden botanical broadside on cream paper — a illustrated shelf system where the page title sits inside bands of potted plants and brass instruments.

**Theme:** light

How Many Plants is a warm botanical editorial — a cream-paper broadside where a single golden-olive hue carries every illustration, banner, and accent. The hero is built from horizontal illustrated shelves in mustard that interlock with oversized display type, turning the page title into a shelf of plant pots, books, and vases. Surfaces are flat and paper-like; shadows are hard 6px offsets in the mustard itself, not soft drops, giving every decorated element the look of a cut-and-paste collage. The palette is ruthlessly small — cream canvas, black ink, one saturated gold, one dusty lavender, one dark teal — and that constraint IS the identity. Typography mixes a chunky geometric display face with a typewriter secondary, so headings feel poster-like while body copy stays intimate and typewritten.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Cream Paper | `#f9f5f1` | `--color-cream-paper` | Page background, card surfaces, section bands — the warm off-white that reads as uncoated stock rather than digital white |
| Ink Black | `#222222` | `--color-ink-black` | Primary text, illustration outlines, large display letters, image borders — near-black that feels like a drafting pen rather than pure black |
| Golden Olive | `#bfb33b` | `--color-golden-olive` | Signature illustration color, hero shelf bands, decorative borders, hard offset shadows, icon fills — the only saturated hue in the system and the brand's defining mark |
| Dusty Lavender | `#e8d1eb` | `--color-dusty-lavender` | Tab backgrounds, tag pills, soft surface accents — desaturated lilac that cools the warm cream without competing with the gold |
| Deep Teal | `#025050` | `--color-deep-teal` | Secondary text and accent on lavender surfaces, occasional icon detail — the only dark chromatic in the palette, used sparingly for contrast against light washes |

## Tokens — Typography

### Chromatica — Primary display and body face — the chunky geometric letterforms spell out the brand in the hero and carry all body copy. The extremely tight 0.89 leading at 36px is what makes display letters stack into compact shelf-height bands rather than airy headlines. · `--font-chromatica`
- **Substitute:** Druk Wide, Recoleta, or GT Super
- **Weights:** 400, 500
- **Sizes:** 14, 16, 20, 24, 36px
- **Line height:** 0.89, 1.33, 1.43, 1.6, 2.0
- **Role:** Primary display and body face — the chunky geometric letterforms spell out the brand in the hero and carry all body copy. The extremely tight 0.89 leading at 36px is what makes display letters stack into compact shelf-height bands rather than airy headlines.

### Hellenictypewriter — Secondary typewriter face for section headings, navigation labels, and editorial accents — its mechanical rhythm contrasts with Chromatica's geometry to create a handmade-meets-typeset feel · `--font-hellenictypewriter`
- **Substitute:** JetBrains Mono, IBM Plex Mono, or Special Elite
- **Weights:** 400, 500
- **Sizes:** 16, 20, 28, 36px
- **Line height:** 1.14, 1.25, 1.33, 1.6
- **Role:** Secondary typewriter face for section headings, navigation labels, and editorial accents — its mechanical rhythm contrasts with Chromatica's geometry to create a handmade-meets-typeset feel

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 14px | 1.6 | — | `--text-caption` |
| body | 16px | 1.6 | — | `--text-body` |
| subheading | 20px | 1.43 | — | `--text-subheading` |
| heading-sm | 24px | 1.33 | — | `--text-heading-sm` |
| heading | 28px | 1.25 | — | `--text-heading` |
| heading-lg | 36px | 1.14 | — | `--text-heading-lg` |

## Tokens — Spacing & Shapes

**Base unit:** 8px

**Density:** spacious

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 16 | 16px | `--spacing-16` |
| 32 | 32px | `--spacing-32` |
| 48 | 48px | `--spacing-48` |
| 64 | 64px | `--spacing-64` |
| 152 | 152px | `--spacing-152` |

### Border Radius

| Element | Value |
|---------|-------|
| tabs | 0px |
| tags | 0px |
| images | 0px |
| buttons | 0px |
| shelves | 0px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| subtle | `rgb(191, 179, 59) 6px 6px 0px 0px` | `--shadow-subtle` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 64px
- **Card padding:** 48px
- **Element gap:** 16px

## Components

### Illustrated Hero Shelf
**Role:** Full-width horizontal band that spells out brand letters inside botanical still-life illustrations

Golden Olive (#bfb33b) rectangle spanning full page width, 100-150px tall, filled with flat plant/vase/book illustrations in black line art. Oversized Ink Black display letters (Chromatica 36px, 0.89 leading) overlap the band. Hard 6px 6px 0px Golden Olive offset shadow below. 0px radius. Stacks vertically to form the full brand wordmark.

### Top Announcement Banner
**Role:** Slim marquee strip above the navigation

Cream (#f9f5f1) background, centered Hellenictypewriter 14-16px italic text in Ink Black, flanked by small leaf icons. No border, no padding beyond 8px vertical. The text itself is a handwritten-style announcement.

### Primary Navigation Bar
**Role:** Top-level site navigation with centered logo

Cream canvas, 64px vertical padding. Logo 'HOW MANY PLANTS' centered in Hellenictypewriter 16-20px weight 500. Left-aligned nav links (Guides, Care, About) in Chromatica 16px, with wavy Dusty Lavender (#e8d1eb) underlines on hover/active. Right-aligned utility buttons.

### Nav Utility Button (Ghost)
**Role:** Right-side navigation actions like Plant Club and Search

No background fill. 1px Ink Black (#222222) border, 0px radius, 12px vertical and 48px horizontal padding. Chromatica 16px uppercase text. The Plant Club variant adds a heart icon; Search adds a magnifier icon.

### Wavy Underline Link
**Role:** Inline navigation and body links

Chromatica or Hellenictypewriter text in Ink Black with a Dusty Lavender (#e8d1eb) wavy SVG underline beneath. The wavy line — not straight — is the signature link treatment and replaces standard text-decoration: underline.

### Vertical Side Tab
**Role:** Rotated category labels floating along the left edge of the hero

Lavender (#e8d1eb) background, Ink Black Chromatica 14px uppercase text, 0px radius, ~44px wide, rotated 90° counter-clockwise. Acts as a decorative category index, not an active navigation pattern.

### Category Label Card
**Role:** Small stacked text blocks embedded in the illustration (e.g. 'PLANT CARE 101', 'HOUSEPLANTS A-Z')

No background. Stacked lines of Chromatica 16px Ink Black text, left-aligned, with a thin 1px Ink Black top border on the first line. Appears as a printed index inside the illustrated shelves.

### Editorial Content Section
**Role:** Text-led content blocks below the hero (e.g. 'Get to know your plants')

Cream canvas, max-width ~1200px centered. Two-column layout: illustration on left, heading + body on right. Heading uses Hellenictypewriter 28-36px weight 500, body uses Chromatica 16-20px. 64px section padding, 32px gap between heading and body.

### Illustrated Plant with Speech Bubble
**Role:** Botanical illustration paired with a handwritten caption

Flat Chromatica-style plant illustration in green and black line art on cream. Adjacent hand-drawn arrow points to a speech-bubble-shaped text annotation in Chromatica 14-16px italic. No borders, no background — the illustration IS the visual.

### Footer Category Link List
**Role:** Stacked text links in the footer (e.g. 'BEST LAID PLANTS', 'MY PLANT BABIES')

Chromatica 16px Ink Black, left-aligned, stacked vertically with 12px row gap. Each link has a wavy Dusty Lavender underline. Functions as a printed table-of-contents style index.

## Do's and Don'ts

### Do
- Use Golden Olive (#bfb33b) as the sole saturated brand color — never introduce a second vivid hue into illustrations, borders, or shadows
- Apply the hard 6px 6px 0px Golden Olive offset shadow to every mustard-bordered element; do not substitute a blurred drop shadow
- Set display type at 36px with 0.89 line-height in Chromatica so letters stack into compact shelf-height bands, not airy headlines
- Underline links with a Dusty Lavender (#e8d1eb) wavy SVG stroke, never with text-decoration: underline
- Keep all radii at 0px — the system is sharp-edged paper, not rounded digital surfaces
- Maintain 64px section padding and 32px inter-section gaps to preserve the spacious editorial rhythm
- Pair Chromatica (geometric display) with Hellenictypewriter (mechanical secondary) for heading-to-body contrast

### Don't
- Do not add soft drop shadows, blur effects, or gradient overlays to any element
- Do not use rounded corners on cards, buttons, tabs, or images — 0px radius is non-negotiable
- Do not introduce a second saturated chromatic color; the palette is cream, black, gold, lavender, teal — nothing more
- Do not set display type with generous line-height (1.2+); the 0.89 leading is what makes letters interlock with the illustration
- Do not use straight underlines on links — always the wavy lavender treatment
- Do not fill the canvas with pure white (#ffffff); the warm cream (#f9f5f1) is the background and must be visible
- Do not place illustrations on white or neutral gray panels — illustrations always sit directly on the cream canvas

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Cream Canvas | `#f9f5f1` | Full-page background, the base paper stock |
| 1 | Lavender Wash | `#e8d1eb` | Tab and tag backgrounds that sit on the cream canvas |
| 2 | Golden Shelf | `#bfb33b` | Illustrated hero bands and decorative banners — the only mid-saturation surface in the system |

## Elevation

- **Golden shelf bands and mustard-bordered cards:** `rgb(191, 179, 59) 6px 6px 0px 0px`

## Imagery

Illustration is the dominant visual language — flat, 2D, hand-drawn botanical still lifes composed of potted plants, vases, books, frames, brass instruments, and household objects. All illustrations use a two-color treatment: Golden Olive (#bfb33b) fills with Ink Black (#222222) line work, or pure black line art on cream. No photography, no gradients, no 3D, no shadows within illustrations. Icons are line-art matching the illustration style. Illustrations always sit directly on the cream canvas with no containers or frames — the object IS the frame. The hero illustration integrates oversized display type as compositional elements, with letters overlapping and interlocking with the illustrated objects rather than sitting in separate text blocks.

## Layout

Full-bleed hero composed of stacked horizontal illustrated shelf bands (4-5 bands, each 100-150px tall) that span edge to edge and contain the full brand wordmark. Below the hero, content shifts to a centered max-width ~1200px layout with two-column text+illustration sections at 64px vertical padding. Vertical side tabs float along the left edge of the hero as decorative category indices. Navigation is a single top bar with centered logo and ghost-outline utility buttons. No sidebar, no grid of feature cards — the site reads as a vertical scroll through editorial spreads rather than a product dashboard. Generous whitespace between sections (64px) creates a slow, magazine-like rhythm.

## Agent Prompt Guide

**Quick Color Reference**
- text: #222222 (Ink Black)
- background: #f9f5f1 (Cream Paper)
- border / illustration outline: #222222 (Ink Black) for structural, #bfb33b (Golden Olive) for decorative
- accent (illustration + decorative shadows): #bfb33b (Golden Olive)
- soft surface (tabs, tags): #e8d1eb (Dusty Lavender)
- primary action: no distinct CTA color

**Example Component Prompts**

1. *Illustrated Hero Shelf Band*: Full-bleed Golden Olive (#bfb33b) rectangle, 120px tall. Fill with flat botanical illustration in Ink Black (#222222) line art — potted plants, vases, books. Overlay a single Chromatica 36px weight 500 Ink Black display letter at 0.89 line-height, centered vertically. Hard 6px 6px 0px Golden Olive offset shadow below the band. 0px radius.

2. *Ghost Navigation Button*: No background. 1px Ink Black (#222222) border, 0px radius, 12px vertical padding, 48px horizontal padding. Chromatica 16px uppercase Ink Black text. Optional heart or magnifier icon in Ink Black to the left of the label.

3. *Wavy Underline Link*: Chromatica 16px weight 400 Ink Black (#222222) text. Beneath the text, a 2px tall Dusty Lavender (#e8d1eb) wavy SVG stroke spanning the full text width with 4 wave cycles. No background, no border.

4. *Vertical Side Tab*: Dusty Lavender (#e8d1eb) background, 44px wide × 160px tall, 0px radius. Chromatica 14px uppercase Ink Black text, rotated 90° counter-clockwise, centered. Floats at the left edge of the hero section, vertically centered within its band.

5. *Editorial Content Block*: Cream (#f9f5f1) canvas, max-width 1200px centered, 64px vertical padding. Two columns at 32px gap: left column is a flat botanical illustration in Golden Olive and Ink Black on cream; right column has a Hellenictypewriter 28px weight 500 Ink Black heading, 32px gap, then Chromatica 16px line-height 1.6 Ink Black body copy.

## Shadow System

There is exactly one shadow in the entire system: rgb(191, 179, 59) 6px 6px 0px 0px — a hard offset in Golden Olive with zero blur. It is applied to Golden Olive-bordered elements (hero shelf bands, mustard-bordered cards) to create a cut-paper collage depth. No element ever uses a soft, blurred, or colored drop shadow. Ink Black-bordered elements rely on the border alone with no shadow. The hard-offset shadow IS the elevation language.

## Typography Pairing Logic

Chromatica carries the brand's geometric confidence — display letters, body copy, and inline links. Hellenictypewriter enters only for section headings, navigation labels, and editorial annotations where its mechanical rhythm creates contrast with Chromatica's solidity. The pair works because Chromatica is dense and sculptural while Hellenictypewriter is thin and rhythmic — together they read as poster + caption, not two competing display faces.

## Similar Brands

- **The New Yorker** — Same editorial-broadside energy where illustration and display typography are the primary content, not decoration
- **Beverly (editorial plant brand)** — Shared botanical illustration language with two-color flat fills and hand-drawn still lifes
- **Aesop (brand site)** — Restrained two-or-three-color palette, generous whitespace, and editorial typography that treats the page like printed matter
- **Pithitude** — Custom display typefaces with extremely tight leading used as compositional elements rather than just headings

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-cream-paper: #f9f5f1;
  --color-ink-black: #222222;
  --color-golden-olive: #bfb33b;
  --color-dusty-lavender: #e8d1eb;
  --color-deep-teal: #025050;

  /* Typography — Font Families */
  --font-chromatica: 'Chromatica', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-hellenictypewriter: 'Hellenictypewriter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.6;
  --text-body: 16px;
  --leading-body: 1.6;
  --text-subheading: 20px;
  --leading-subheading: 1.43;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.33;
  --text-heading: 28px;
  --leading-heading: 1.25;
  --text-heading-lg: 36px;
  --leading-heading-lg: 1.14;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;

  /* Spacing */
  --spacing-unit: 8px;
  --spacing-16: 16px;
  --spacing-32: 32px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-152: 152px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 64px;
  --card-padding: 48px;
  --element-gap: 16px;

  /* Named Radii */
  --radius-tabs: 0px;
  --radius-tags: 0px;
  --radius-images: 0px;
  --radius-buttons: 0px;
  --radius-shelves: 0px;

  /* Shadows */
  --shadow-subtle: rgb(191, 179, 59) 6px 6px 0px 0px;

  /* Surfaces */
  --surface-cream-canvas: #f9f5f1;
  --surface-lavender-wash: #e8d1eb;
  --surface-golden-shelf: #bfb33b;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-cream-paper: #f9f5f1;
  --color-ink-black: #222222;
  --color-golden-olive: #bfb33b;
  --color-dusty-lavender: #e8d1eb;
  --color-deep-teal: #025050;

  /* Typography */
  --font-chromatica: 'Chromatica', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-hellenictypewriter: 'Hellenictypewriter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.6;
  --text-body: 16px;
  --leading-body: 1.6;
  --text-subheading: 20px;
  --leading-subheading: 1.43;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.33;
  --text-heading: 28px;
  --leading-heading: 1.25;
  --text-heading-lg: 36px;
  --leading-heading-lg: 1.14;

  /* Spacing */
  --spacing-16: 16px;
  --spacing-32: 32px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-152: 152px;

  /* Shadows */
  --shadow-subtle: rgb(191, 179, 59) 6px 6px 0px 0px;
}
```
