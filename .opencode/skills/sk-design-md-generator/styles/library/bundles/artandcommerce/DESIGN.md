# Artandcommerce — Style Reference
> art book spread on bone paper

**Theme:** light

Art+Commerce is a quiet editorial gallery on bone paper: a near-monochrome canvas where large-format commissioned photography and magazine covers become the entire visual system. The type pairing is the signature — Adobe Garamond in weight 400 whispers editorial luxury while Akzidenz Grotesk in small, widely-tracked uppercase provides mechanical, gallery-label clarity. There is no brand color, no gradient, no shadow, no radius; hierarchy is built from a single black ink, generous white space, and a disciplined 56px display line. Density is sparse and the page breathes like an art book spread — images sit full-bleed, metadata hovers in tiny tracked caps at the edges, and every UI element defers to the artwork.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Ink | `#000000` | `--color-ink` | Primary text, navigation labels, logo, link borders, footer type — the single graphic ink of the system. Every stroke, border, and character mark across the site |
| Bone | `#e7e7e7` | `--color-bone` | Page canvas, card surface, elevated surface — the warm near-white that holds all imagery and text |
| Charcoal | `#121212` | `--color-charcoal` | Secondary text and deep surface tone where slightly softer black is needed against bone |

## Tokens — Typography

### Adobe Garamond — Editorial display and body serif. The single weight (400) does all the talking — no bold, no italic reliance. Used at 56px for display headlines (artwork titles, hero captions) with tight tracking -0.018em and 1.10 line-height, at 20px for introductory text and at 16px for body. The restraint of a single weight Garamond at display sizes creates an old-master gravitas: authority through historical type, not weight. · `--font-adobe-garamond`
- **Substitute:** EB Garamond, Cormorant Garamond
- **Weights:** 400
- **Sizes:** 16px, 20px, 56px
- **Line height:** 1.10, 1.30
- **Letter spacing:** -0.018em consistently
- **Role:** Editorial display and body serif. The single weight (400) does all the talking — no bold, no italic reliance. Used at 56px for display headlines (artwork titles, hero captions) with tight tracking -0.018em and 1.10 line-height, at 20px for introductory text and at 16px for body. The restraint of a single weight Garamond at display sizes creates an old-master gravitas: authority through historical type, not weight.

### Akzidenz Grotesk — Functional sans-serif for all UI, navigation, labels, and metadata. Rendered almost exclusively in uppercase at 8-10px with aggressive positive tracking (+0.027 to +0.038em) — the effect is that of gallery wall labels, museum credits, and colophon text. Weight 500 highlights active nav, 700 for emphasis labels, 400 default. The grotesk never competes with Garamond for the reader's attention; it serves. · `--font-akzidenz-grotesk`
- **Substitute:** Inter, Helvetica Neue, Neue Haas Grotesk
- **Weights:** 400, 500, 700
- **Sizes:** 8px, 10px, 16px
- **Line height:** 1.00, 1.25, 1.30
- **Letter spacing:** 0.027-0.038em in uppercase contexts
- **Role:** Functional sans-serif for all UI, navigation, labels, and metadata. Rendered almost exclusively in uppercase at 8-10px with aggressive positive tracking (+0.027 to +0.038em) — the effect is that of gallery wall labels, museum credits, and colophon text. Weight 500 highlights active nav, 700 for emphasis labels, 400 default. The grotesk never competes with Garamond for the reader's attention; it serves.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| micro | 10px | 1 | 0.33px | `--text-micro` |
| body | 16px | 1.3 | -0.29px | `--text-body` |
| subheading | 20px | 1.3 | -0.36px | `--text-subheading` |
| display | 56px | 1.1 | -1px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 8 | 8px | `--spacing-8` |
| 12 | 12px | `--spacing-12` |
| 16 | 16px | `--spacing-16` |
| 24 | 24px | `--spacing-24` |
| 32 | 32px | `--spacing-32` |
| 36 | 36px | `--spacing-36` |
| 44 | 44px | `--spacing-44` |
| 60 | 60px | `--spacing-60` |
| 80 | 80px | `--spacing-80` |
| 160 | 160px | `--spacing-160` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 0px |
| badges | 0px |
| images | 0px |
| buttons | 0px |

### Layout

- **Page max-width:** 1440px
- **Section gap:** 44px
- **Card padding:** 16px
- **Element gap:** 12px

## Components

### Site Header / Nav Bar
**Role:** Minimal top-bar navigation

Full-width row on bone (#e7e7e7) background, ~44px tall, 16px horizontal padding. Logo 'art+commerce' in Adobe Garamond 400 at 16px sits flush left in Ink (#000000). Nav items (ARTISTS, IMAGE ARCHIVE, PROD., NEW LIGHT FILMS, EDITIONS, ABOUT, SHOP) in Akzidenz Grotesk 500 uppercase at ~10px, letter-spacing 0.033em, flush right with ~16-23px gap between items. A small search icon at the far right. No background fill, no border-bottom, no shadow — the header dissolves into the canvas.

### Full-Bleed Editorial Image
**Role:** Hero / feature artwork display

Edge-to-edge image filling the viewport width, no margin, no padding, no border-radius (0px). Images bleed to all four sides. No overlay, no caption box — metadata sits outside the image frame on bone canvas.

### Image Credit Caption
**Role:** Attribution line below full-bleed images

Two-part caption on bone background. Left side: artist name + title in Adobe Garamond 400 at 16px, Ink. Right side: publication/event + year in Akzidenz Grotesk 500 uppercase at ~10px, tracking 0.033em, Ink. Separated by the full row width — asymmetric left/right alignment with no visible divider.

### Magazine Cover Card
**Role:** Featured publication / project cover

A single magazine or project cover centered on bone canvas with generous top/bottom whitespace (~44px section gap). No border, no shadow, no radius. The cover image IS the component — type and layout on the cover is the cover designer's work, not the system. The card itself is a transparent container with no chrome.

### Navigation Link
**Role:** Header nav item / inline link

Akzidenz Grotesk 500 uppercase, ~10px, letter-spacing 0.033em, color Ink (#000000). No underline by default; on hover/active, a 1px Ink bottom border appears (border-bottom). The border-color data shows 372 link/inline border instances — the system uses borders to denote interactivity, not fills or color shifts.

### Footer
**Role:** Site footer with secondary nav and credits

Full-width bone background, no top border or shadow. Content arranged in a single row with the same Garamond/Grotesk pairing as the header. Small Grotesk uppercase metadata (copyright, legal, social) with 12-16px gaps. Minimal — the footer does not assert itself.

### Artwork Title
**Role:** Large display heading for project or feature

Adobe Garamond 400 at 56px, line-height 1.10, letter-spacing -0.018em (-1.0px tracking), color Ink. This is the largest type in the system. Never bold, never italic. The tight tracking at 56px (-1px) pulls the Garamond forms together so the headline reads as a single shape rather than a string of letters.

### Section Label
**Role:** Uppercase category / context label

Akzidenz Grotesk 700 uppercase at 8-10px, letter-spacing 0.038em (widest tracking in the system), color Ink. Used as gallery-section markers, breadcrumb-like indicators, and metadata tags. The extra weight + extra tracking makes these labels read as stamps or printed colophons.

## Do's and Don'ts

### Do
- Use only #000000, #e7e7e7, and #121212 — no other colors, no tints, no accents
- Set display headlines in Adobe Garamond 400 at 56px with letter-spacing -1.0px and line-height 1.10
- Render all UI labels, nav, and metadata in Akzidenz Grotesk uppercase with letter-spacing 0.027-0.038em
- Keep all border-radius at 0px — every card, image, button, and badge is sharp-edged
- Use 12px and 16px as the dominant element gaps; 44px as the standard section gap
- Let images bleed edge-to-edge with no borders, shadows, or rounded corners
- Use a 1px Ink (#000000) border-bottom to denote hover and active states on links and nav

### Don't
- Do not introduce any color — no brand accent, no CTA fill, no gradient, no status hues
- Do not use Garamond bold or italic; the serif speaks only at weight 400
- Do not apply border-radius to any element; the design is rigorously rectilinear
- Do not add box-shadows or drop-shadows — elevation is expressed through whitespace alone
- Do not mix sentence case into nav and labels; all Grotesk UI is uppercase
- Do not center body text or nav; the layout is flush-left with content anchored to the left edge
- Do not use display sizes below 56px or body sizes above 20px for Garamond — the scale is deliberately compressed

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Bone Canvas | `#e7e7e7` | Page background — all content sits on this single warm-white surface |
| 2 | Ink Layer | `#000000` | All type, borders, and graphic marks on the bone canvas |

## Elevation

The design has no shadows and no elevation tokens. Hierarchy is achieved exclusively through scale (56px display vs 10px metadata), tracking (Garamond -1.0px vs Grotesk +0.38em), and whitespace (44px section gaps). Adding any shadow or fill would break the editorial-gallery language.

## Imagery

The site is image-dominant — large commissioned photography and magazine covers are the primary content. Treatment: full-bleed, edge-to-edge, no cropping frames, no overlays, no rounded corners. Photography is high-production editorial work (floral compositions, portrait, fashion) presented raw and uncropped. No illustration, no icons beyond a small search glyph. The images are always editorial fine-art photography; the system does not need to support product shots, lifestyle, or stock imagery.

## Layout

Full-bleed layout with a 1440px max-width container. The header is a single thin row (logo left, nav right) sitting directly on the bone canvas with no border. The hero pattern is a full-viewport-width editorial image with no text overlay — the image IS the hero. Below the hero, a single-line caption row spans the same width with artist name flush left, publication/year flush right. Subsequent sections use centered single-image blocks (magazine covers) on bone with ~44px vertical breathing room. No multi-column grids, no card grids, no sidebars. The entire page reads as a vertical scroll through a curated gallery — one artwork per screen, generous whitespace between.

## Agent Prompt Guide

**Quick Color Reference:**
- text: #000000
- background: #e7e7e7
- border: #000000
- accent: none (monochrome only)
- primary action: no distinct CTA color

**Example Component Prompts:**
1. Build a full-bleed hero image section: edge-to-edge image on #e7e7e7 canvas, 0px radius, no shadow, no border. Below the image, a caption row spanning the full width: left-aligned artist credit in Adobe Garamond 400 16px #000000, right-aligned project tag in Akzidenz Grotesk 500 uppercase 10px #000000 letter-spacing 0.033em. 44px vertical gap above the caption.

2. Build a centered magazine cover card: single image centered horizontally on #e7e7e7, no border, no shadow, 0px radius, 44px top and bottom padding. No text overlays on the card itself — the cover is the content.

3. Build a site header nav bar: #e7e7e7 background, full-width, 16px horizontal padding, ~44px tall. Logo 'art+commerce' in Adobe Garamond 400 16px #000000 flush left. Nav items (ARTISTS, IMAGE ARCHIVE, PROD, NEW LIGHT FILMS, EDITIONS, ABOUT, SHOP) in Akzidenz Grotesk 500 uppercase 10px #000000 letter-spacing 0.033em, 16-23px gaps, flush right. 1px #000000 bottom border on hover only.

4. Build a section label: Akzidenz Grotesk 700 uppercase 8px #000000, letter-spacing 0.38em, 12px bottom margin. Reads as a printed colophon stamp.

5. Build a display headline: Adobe Garamond 400 56px #000000, line-height 1.10, letter-spacing -1.0px, flush left. No bold, no italic. Sits on #e7e7e7 with 44px breathing room above and below.

## Similar Brands

- **Aperture Foundation** — Same editorial-gallery layout: full-bleed photography, minimal sans-serif nav uppercase, generous bone-white canvas, Garamond/serif display, no decorative color
- **Magnum Photos** — Photography agency with monochrome palette, large uncropped imagery, tiny tracked uppercase metadata, and type hierarchy built from serif display + grotesque labels
- **MACK Books** — Art book publisher with same quiet-bone aesthetic, no CTAs, no shadows, sharp edges, editorial Garamond paired with grotesk metadata
- **Atelier Bingo** — Creative studio with art-book feel: generous whitespace, monochrome palette, serif display headlines, minimal uppercase nav

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-ink: #000000;
  --color-bone: #e7e7e7;
  --color-charcoal: #121212;

  /* Typography — Font Families */
  --font-adobe-garamond: 'Adobe Garamond', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-akzidenz-grotesk: 'Akzidenz Grotesk', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-micro: 10px;
  --leading-micro: 1;
  --tracking-micro: 0.33px;
  --text-body: 16px;
  --leading-body: 1.3;
  --tracking-body: -0.29px;
  --text-subheading: 20px;
  --leading-subheading: 1.3;
  --tracking-subheading: -0.36px;
  --text-display: 56px;
  --leading-display: 1.1;
  --tracking-display: -1px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-36: 36px;
  --spacing-44: 44px;
  --spacing-60: 60px;
  --spacing-80: 80px;
  --spacing-160: 160px;

  /* Layout */
  --page-max-width: 1440px;
  --section-gap: 44px;
  --card-padding: 16px;
  --element-gap: 12px;

  /* Named Radii */
  --radius-cards: 0px;
  --radius-badges: 0px;
  --radius-images: 0px;
  --radius-buttons: 0px;

  /* Surfaces */
  --surface-bone-canvas: #e7e7e7;
  --surface-ink-layer: #000000;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-ink: #000000;
  --color-bone: #e7e7e7;
  --color-charcoal: #121212;

  /* Typography */
  --font-adobe-garamond: 'Adobe Garamond', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-akzidenz-grotesk: 'Akzidenz Grotesk', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-micro: 10px;
  --leading-micro: 1;
  --tracking-micro: 0.33px;
  --text-body: 16px;
  --leading-body: 1.3;
  --tracking-body: -0.29px;
  --text-subheading: 20px;
  --leading-subheading: 1.3;
  --tracking-subheading: -0.36px;
  --text-display: 56px;
  --leading-display: 1.1;
  --tracking-display: -1px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-36: 36px;
  --spacing-44: 44px;
  --spacing-60: 60px;
  --spacing-80: 80px;
  --spacing-160: 160px;
}
```
