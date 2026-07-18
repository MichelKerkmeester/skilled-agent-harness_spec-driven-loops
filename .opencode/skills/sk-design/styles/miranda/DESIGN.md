# Miranda — Style Reference
> Old-world broadsheet on warm cream — newspaper editorial for the digital age.

**Theme:** light

A vintage broadsheet portfolio rendered on warm parchment stock. Near-black ink dominates text, borders, and large editorial banners; the cream canvas stays quiet and matte, never clinical. Display type is the brand: enormous custom serifs (Canopee, Germgoth) with negative tracking and sub-1.0 line-heights so letters collide and bleed into one another, mimicking woodblock print and 19th-century poster lettering. One warm ember-orange accent appears sparingly — a stamp, a star icon — like a hand-stamped seal. Components stay flat and borderless; depth comes from contrast, not shadow. Layout reads like a zine or newspaper spread: oversized headline banners intercut with tight three-column project grids and full-bleed illustrations.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Parchment | `#e2dedb` | `--color-parchment` | Page background, image matte areas — the warm stock everything else is printed on |
| Bone Cream | `#cdc6be` | `--color-bone-cream` | Card surfaces, secondary panels, subtle inset backgrounds slightly darker than parchment |
| Ink Black | `#1d1d1b` | `--color-ink-black` | Body text, nav links, borders, large display banner fills, icon strokes — the near-black that carries every contrast-critical role |
| Charcoal | `#69645f` | `--color-charcoal` | Muted secondary text, subdued borders, quiet typographic accents |
| Pure Black | `#000000` | `--color-pure-black` | Card outline emphasis, deepest fills, highest-contrast border work on cream surfaces |
| Ember Orange | `#c03f13` | `--color-ember-orange` | Stamp illustrations, star icon accent, occasional seal/sticker color — the single chromatic punctuation in an otherwise monochrome system |

## Tokens — Typography

### Editorial New — Body text, nav, links, card descriptions, smaller headings — the workhorse serif · `--font-editorial-new`
- **Substitute:** Tiempos Text or Source Serif 4
- **Weights:** 300
- **Sizes:** 16px, 17px, 19px, 20px, 24px, 29px, 31px, 32px, 37px, 86px
- **Line height:** 0.93, 1.08, 1.11, 1.15, 1.16, 1.18, 1.20, 1.25, 1.27, 1.33, 1.36
- **Letter spacing:** -0.0400em to -0.0100em; tighter at larger sizes
- **Role:** Body text, nav, links, card descriptions, smaller headings — the workhorse serif

### Canopee — Display headlines and section titles — the signature font for oversize banners (MIRANDA, WEBSITE, INTERACTIVE ARTIST!) · `--font-canopee`
- **Substitute:** Migra or Bodoni Moda at heavy weight
- **Weights:** 400
- **Sizes:** 17px, 20px, 22px, 23px, 32px, 43px, 65px, 72px, 86px, 109px, 112px, 118px, 122px, 202px, 212px, 366px, 432px, 446px, 533px
- **Line height:** 0.71, 0.73, 0.77, 0.78, 0.79, 0.81, 0.91, 1.00, 1.25
- **Letter spacing:** -0.0890em to -0.0070em; extreme tightening at display sizes
- **Role:** Display headlines and section titles — the signature font for oversize banners (MIRANDA, WEBSITE, INTERACTIVE ARTIST!)

### Domaine Display — Mid-weight display headings, body emphasis, secondary hero text — bridges Editorial New's restraint and Canopee's drama · `--font-domaine-display`
- **Substitute:** Playfair Display or GT Super
- **Weights:** 500
- **Sizes:** 20px, 22px, 32px, 65px, 72px, 86px, 109px, 118px, 122px, 446px
- **Line height:** 0.73, 0.78, 0.79, 0.91, 1.00
- **Letter spacing:** -0.0600em to -0.0200em
- **Role:** Mid-weight display headings, body emphasis, secondary hero text — bridges Editorial New's restraint and Canopee's drama

### Germgoth — Rare gothic/blackletter accent — used for occasional impact moments that need medieval or poster-poster weight · `--font-germgoth`
- **Substitute:** Pirata One or IM Fell English
- **Weights:** 400
- **Sizes:** 158px
- **Line height:** normal
- **Letter spacing:** -0.0040em
- **Role:** Rare gothic/blackletter accent — used for occasional impact moments that need medieval or poster-poster weight

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 14px | 1.18 | -0.27px | `--text-caption` |
| body-sm | 16px | 1.27 | -0.16px | `--text-body-sm` |
| subheading | 22px | 1.18 | -0.55px | `--text-subheading` |
| heading-sm | 32px | 1.11 | -0.96px | `--text-heading-sm` |
| heading | 65px | 0.91 | -2.08px | `--text-heading` |
| heading-lg | 122px | 0.79 | -4.88px | `--text-heading-lg` |
| display | 446px | 0.73 | -22.3px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 7 | 7px | `--spacing-7` |
| 10 | 10px | `--spacing-10` |
| 12 | 12px | `--spacing-12` |
| 14 | 14px | `--spacing-14` |
| 17 | 17px | `--spacing-17` |
| 22 | 22px | `--spacing-22` |
| 28 | 28px | `--spacing-28` |
| 29 | 29px | `--spacing-29` |
| 36 | 36px | `--spacing-36` |
| 43 | 43px | `--spacing-43` |
| 58 | 58px | `--spacing-58` |
| 65 | 65px | `--spacing-65` |
| 115 | 115px | `--spacing-115` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 2.88px |
| cards | 11.52px |
| images | 0px |
| buttons | 2.88px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| sm | `rgba(29, 29, 27, 0.2) -4px 4px 6px 0px` | `--shadow-sm` |
| sm-2 | `rgba(29, 29, 27, 0.2) -5px 3px 6px 0px` | `--shadow-sm-2` |

### Layout

- **Page max-width:** 1440px
- **Section gap:** 43px
- **Card padding:** 24px
- **Element gap:** 14px

## Components

### Editorial Header Bar
**Role:** Top navigation strip

Full-width Parchment (#e2dedb) bar with location label left ('Amsterdam, NL'), centered brand name in Editorial New 19-20px weight 300, and hamburger icon right. 1px Ink Black border-bottom for hairline separation.

### Project Grid Card
**Role:** Work showcase tile

3-column grid card. Thumbnail image with 0px radius fills top. Below: project title in Editorial New 20px weight 300, a 2.88px-radius square NEW badge in Ember Orange (#c03f13) with white text, and a 2-3 line description in Editorial New 16-17px. No card border; separation comes from whitespace alone.

### Display Banner Block
**Role:** Hero/section divider

Full-width Ink Black (#1d1d1b) rectangle spanning the page with oversize Canopee text in Parchment (#e2dedb). Text sizes 202-533px, line-height 0.71-0.79 so letters nearly touch. Negative letter-spacing up to -0.089em. This is the system's most recognizable pattern.

### NEW Badge
**Role:** Project freshness tag

Small square 2.88px-radius tag, Ember Orange (#c03f13) background, Editorial New 12-14px weight 300 white text. Sits inline with project title.

### Portrait Illustration Card
**Role:** Large artwork showcase

Full-bleed digital illustration with tight cropping. No border, no radius. Caption sits below in Canopee or Domaine Display at 43-86px, line-height 0.91-0.79, weight 400-500. The illustration does the heavy lifting; type acts as a placard.

### Drop Cap Bio Block
**Role:** Author introduction

Two-column intro: left column opens with a large Canopee drop cap (the brand's first letter) at 86px+, then Editorial New body text. Right column holds a larger Canopee headline ('CREATIVE DEVELOPER BASED IN AMSTERDAM, NL.') at 65-72px. The drop cap is the only typographic flourish in body text.

### Stamp Seal Illustration
**Role:** Decorative editorial accent

Perforated-edge postage-stamp rectangle at 11.52px radius, off-white interior with Ember Orange sunburst graphic, handwritten signature line, and two metadata rows ('NAME', 'BIRTH') in tiny Editorial New caps. Functions as a signature mark, not a functional UI element.

### Three-Column Section Header
**Role:** Featured work intro

Left card: image. Center card: massive Canopee heading ('ALL WORK!') in 65-86px with short Editorial New subhead. Right card: image. Visual rhythm of image-type-image. Center column centered.

### Text Link with Underline
**Role:** Inline navigation/CTA

Editorial New 16-19px weight 300, Ink Black (#1d1d1b) color, 1px underline offset 3px. Hover darkens to Pure Black. No background fill, no button shape — editorial hyperlinks stay as text.

### Project Metadata Row
**Role:** Work card footer detail

Single-line row of Editorial New 14-16px caption text in Charcoal (#69645f) below project description, listing role/agency/year. Acts as a byline.

## Do's and Don'ts

### Do
- Use Canopee at 200px+ for any section-divider banner — display sizes below 122px lose the system's defining character
- Set line-height below 0.85 on all Canopee display text so letters crowd and nearly collide; this is the signature, not a bug
- Pair every project card with a 2.88px-radius square NEW badge in Ember Orange (#c03f13) — the badge is the only chromatic note in a monochrome page
- Use Editorial New weight 300 exclusively for body, nav, and small headings — heavier weights break the editorial restraint
- Let images bleed to the card edge with 0px radius; sharp corners are part of the broadsheet language
- Keep the page background Parchment (#e2dedb) and card surfaces Bone Cream (#cdc6be) — never introduce a white or cool gray
- Use negative letter-spacing on all Canopee and Domaine Display headings; positive tracking destroys the printed-poster feel

### Don't
- Do not introduce gradients, glassmorphism, or modern blur effects — this is a 1890s broadsheet, not 2024 SaaS
- Do not use border-radius above 12px on any element — sharp geometry defines the print aesthetic
- Do not add more than one chromatic accent — the Ember Orange only works because the rest is monochrome
- Do not center-align body text longer than two lines; flush-left only for paragraphs
- Do not use shadows for general depth; reserve the directional ink-color shadow for project cards only
- Do not substitute system sans-serifs (Inter, Helvetica) for any of the four custom faces — the serif/gothic mix is load-bearing
- Do not use line-height above 1.0 on display headings — open spacing kills the compressed woodblock feel

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Parchment | `#e2dedb` | Page background |
| 1 | Bone Cream | `#cdc6be` | Card and panel surface |
| 2 | Ink Black | `#1d1d1b` | Full-width display banner fill |
| 3 | Pure Black | `#000000` | Deepest card border emphasis |

## Elevation

- **Project Card:** `rgba(29, 29, 27, 0.2) -4px 4px 6px 0px`
- **Portrait Card:** `rgba(29, 29, 27, 0.2) -5px 3px 6px 0px`

## Imagery

Digital illustration dominates over photography. Portrait subjects are stylized semi-realistic digital paintings with dramatic lighting (rim-lit faces, saturated backgrounds, painterly texture). Project thumbnails lean toward moody interior photography (warm wood, cool blue retail spaces). Illustrations are tightly cropped, often filling the full card width, with no border or padding buffer. One Ember Orange graphic accent (stamp sunburst) appears as a decorative seal. The overall treatment feels like a curated magazine spread — every image is art-directed, never stock.

## Layout

Full-bleed page with max-width ~1440px centered. The top opens with a thin header bar, then a three-column 'featured work' strip (image, type, image). A full-width Ink Black display banner (MIRANDA) crashes through the middle, acting as a typographic section break. Below: alternating two-column and three-column blocks of project cards and portrait illustrations, each separated by generous 43px vertical rhythm. Another full-width banner (WEBSITE) punctuates the lower half. The footer is a simple two-column text block. Navigation is minimal — a single hamburger icon top-right, no persistent nav bar. The grid is consistent: always 3 equal columns at the top tier, breaking into 2 or 1 for illustrative sections. Vertical spacing is comfortable but not airy; the density feels curated, not sparse.

## Agent Prompt Guide

**Quick Color Reference**
- background: #e2dedb (Parchment)
- surface/card: #cdc6be (Bone Cream)
- text: #1d1d1b (Ink Black)
- border: #1d1d1b or #000000
- accent: #c03f13 (Ember Orange)
- primary action: #1d1d1b (filled action)

**Example Component Prompts**

1. *Full-width display banner*: Ink Black (#1d1d1b) rectangle spanning 1440px, height auto. Inside, the word 'MIRANDA' in Canopee 446px, weight 400, color #e2dedb, line-height 0.73, letter-spacing -22.3px. Letters should nearly touch.

2. *Project card*: Bone Cream (#cdc6be) surface, no visible border, 24px internal padding. Top: full-width image at 0px radius. Below: 'AVRO&KO' in Editorial New 20px weight 300 color #1d1d1b, followed by a 2.88px-radius square badge (background #c03f13, text 'NEW' in Editorial New 12px weight 300 color #e2dedb). Description in Editorial New 16px weight 300 color #1d1d1b, line-height 1.27.

3. *Portrait illustration block*: Two-column layout. Left: a vertical digital painting illustration filling the column, 0px radius. Right: 'DIGITAL ART DIRECTOR / INTERACTIVE DESIGNER' in Canopee 86px weight 400, color #1d1d1b, line-height 0.91, letter-spacing -2.08px.

4. *Editorial header bar*: Parchment (#e2dedb) background, 1px Ink Black (#1d1d1b) bottom border. Left: 'Amsterdam, NL' in Editorial New 19px weight 300. Center: 'The Niccolò Portfolio' in Editorial New 19px weight 300. Right: hamburger icon (3 horizontal Ink Black lines).

5. *Stamp seal accent*: 11.52px-radius perforated-edge rectangle, background #e2dedb, with an Ember Orange (#c03f13) sunburst icon, a signature line, and two tiny text rows ('NAME Niccolò Miranda' / 'BIRTH 18/10/1995') in Editorial New 11px.

## Similar Brands

- **Locomotive (locomotive.ca)** — Same broadsheet editorial typography with extreme display sizes and tight letter-spacing on a cream/warm background
- **Pentagram portfolio pages** — Newspaper-grid layouts, oversize serif headlines bleeding off cards, monochrome with single chromatic stamp accent
- **Rauno Freiberg (raunofreiberg.com)** — Custom display faces, sharp-cornered image cards, generous whitespace on warm neutral canvas
- **Resn (resn.co.nz)** — Playful experimental portfolio that uses oversize custom type as architectural elements rather than body copy
- **Frank Chimero** — Editorial portfolio tradition — broadsheet-inspired, serif-driven, monochrome with intentional restraint

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-parchment: #e2dedb;
  --color-bone-cream: #cdc6be;
  --color-ink-black: #1d1d1b;
  --color-charcoal: #69645f;
  --color-pure-black: #000000;
  --color-ember-orange: #c03f13;

  /* Typography — Font Families */
  --font-editorial-new: 'Editorial New', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-canopee: 'Canopee', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-domaine-display: 'Domaine Display', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-germgoth: 'Germgoth', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.18;
  --tracking-caption: -0.27px;
  --text-body-sm: 16px;
  --leading-body-sm: 1.27;
  --tracking-body-sm: -0.16px;
  --text-subheading: 22px;
  --leading-subheading: 1.18;
  --tracking-subheading: -0.55px;
  --text-heading-sm: 32px;
  --leading-heading-sm: 1.11;
  --tracking-heading-sm: -0.96px;
  --text-heading: 65px;
  --leading-heading: 0.91;
  --tracking-heading: -2.08px;
  --text-heading-lg: 122px;
  --leading-heading-lg: 0.79;
  --tracking-heading-lg: -4.88px;
  --text-display: 446px;
  --leading-display: 0.73;
  --tracking-display: -22.3px;

  /* Typography — Weights */
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-medium: 500;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-7: 7px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-14: 14px;
  --spacing-17: 17px;
  --spacing-22: 22px;
  --spacing-28: 28px;
  --spacing-29: 29px;
  --spacing-36: 36px;
  --spacing-43: 43px;
  --spacing-58: 58px;
  --spacing-65: 65px;
  --spacing-115: 115px;

  /* Layout */
  --page-max-width: 1440px;
  --section-gap: 43px;
  --card-padding: 24px;
  --element-gap: 14px;

  /* Border Radius */
  --radius-sm: 2.88px;
  --radius-lg: 7.2px;
  --radius-xl: 11.52px;

  /* Named Radii */
  --radius-tags: 2.88px;
  --radius-cards: 11.52px;
  --radius-images: 0px;
  --radius-buttons: 2.88px;

  /* Shadows */
  --shadow-sm: rgba(29, 29, 27, 0.2) -4px 4px 6px 0px;
  --shadow-sm-2: rgba(29, 29, 27, 0.2) -5px 3px 6px 0px;

  /* Surfaces */
  --surface-parchment: #e2dedb;
  --surface-bone-cream: #cdc6be;
  --surface-ink-black: #1d1d1b;
  --surface-pure-black: #000000;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-parchment: #e2dedb;
  --color-bone-cream: #cdc6be;
  --color-ink-black: #1d1d1b;
  --color-charcoal: #69645f;
  --color-pure-black: #000000;
  --color-ember-orange: #c03f13;

  /* Typography */
  --font-editorial-new: 'Editorial New', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-canopee: 'Canopee', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-domaine-display: 'Domaine Display', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-germgoth: 'Germgoth', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.18;
  --tracking-caption: -0.27px;
  --text-body-sm: 16px;
  --leading-body-sm: 1.27;
  --tracking-body-sm: -0.16px;
  --text-subheading: 22px;
  --leading-subheading: 1.18;
  --tracking-subheading: -0.55px;
  --text-heading-sm: 32px;
  --leading-heading-sm: 1.11;
  --tracking-heading-sm: -0.96px;
  --text-heading: 65px;
  --leading-heading: 0.91;
  --tracking-heading: -2.08px;
  --text-heading-lg: 122px;
  --leading-heading-lg: 0.79;
  --tracking-heading-lg: -4.88px;
  --text-display: 446px;
  --leading-display: 0.73;
  --tracking-display: -22.3px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-7: 7px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-14: 14px;
  --spacing-17: 17px;
  --spacing-22: 22px;
  --spacing-28: 28px;
  --spacing-29: 29px;
  --spacing-36: 36px;
  --spacing-43: 43px;
  --spacing-58: 58px;
  --spacing-65: 65px;
  --spacing-115: 115px;

  /* Border Radius */
  --radius-sm: 2.88px;
  --radius-lg: 7.2px;
  --radius-xl: 11.52px;

  /* Shadows */
  --shadow-sm: rgba(29, 29, 27, 0.2) -4px 4px 6px 0px;
  --shadow-sm-2: rgba(29, 29, 27, 0.2) -5px 3px 6px 0px;
}
```
