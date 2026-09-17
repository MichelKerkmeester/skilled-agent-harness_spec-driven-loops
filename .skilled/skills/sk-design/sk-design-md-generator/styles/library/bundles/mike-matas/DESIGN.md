# Mike Matas — Style Reference
> Ink on fresh snow. A personal page reduced to one whisper-thin display headline floating in vast white space, with product photography as the only color.

**Theme:** light

Mike Matas's site is a typographic portrait gallery: an almost-empty white canvas where a single thin-weight display headline, a tiny right-aligned link list, and photographic device mockups carry the entire visual load. The system refuses decoration — no brand color, no shadows, no gradients, no borders, no radii — letting Lab Grotesque's geometry and the negative space between elements create all the rhythm. Density is paradoxically spacious: huge horizontal margins (135px) push content into a narrow corridor while element-level gaps stay tight (9px), producing a layout that breathes vertically and focuses horizontally. The only visual material outside type and whitespace is photography of products inside MacBook and iPhone bezels, which becomes the only chromatic content on the page.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Ink Black | `#000000` | `--color-ink-black` | All text — display headlines, body copy, navigation links, and icon strokes |
| Ash Gray | `#999999` | `--color-ash-gray` | Secondary and supporting text — link hover or muted labels where visual weight must recede |

## Tokens — Typography

### Lab Grotesque — Sole typeface for the entire site. Weight 100 at 40px is the signature display treatment for the owner name and year — a near-ultralight stroke that reads as quietly confident against the white void. Weight 400 at 18px handles body and link text. Weight 600 at 20px gives nav links a subtle mechanical weight without crossing into bold territory. No other families appear. · `--font-lab-grotesque`
- **Substitute:** Inter, Söhne, or Neue Haas Grotesk — any geometric grotesque with a true thin weight
- **Weights:** 100, 400, 600
- **Sizes:** 18px, 20px, 40px
- **Line height:** 1.20
- **Letter spacing:** normal at all sizes
- **Role:** Sole typeface for the entire site. Weight 100 at 40px is the signature display treatment for the owner name and year — a near-ultralight stroke that reads as quietly confident against the white void. Weight 400 at 18px handles body and link text. Weight 600 at 20px gives nav links a subtle mechanical weight without crossing into bold territory. No other families appear.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| body-sm | 18px | 1.2 | — | `--text-body-sm` |
| subheading | 20px | 1.2 | — | `--text-subheading` |
| display | 40px | 1.2 | — | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 8px

**Density:** spacious

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 9 | 9px | `--spacing-9` |
| 25 | 25px | `--spacing-25` |
| 32 | 32px | `--spacing-32` |
| 36 | 36px | `--spacing-36` |
| 54 | 54px | `--spacing-54` |
| 63 | 63px | `--spacing-63` |
| 68 | 68px | `--spacing-68` |
| 72 | 72px | `--spacing-72` |
| 135 | 135px | `--spacing-135` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 0px |
| cards | 0px |
| images | 0px |
| buttons | 0px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 135px
- **Card padding:** 0px
- **Element gap:** 9px

## Components

### Display Name Headline
**Role:** The site owner identity at the top of the page

40px Lab Grotesque weight 100, #000000, line-height 1.20. Two lines stacked: first name on line one, year on line two. No decoration, no period, no mark. The ultralight weight at 40px is the entire brand voice.

### Navigation Link List
**Role:** Top-right utility links

20px Lab Grotesque weight 600, #000000, stacked vertically. Three items: About, Twitter, Instagram. No underlines, no bullets, no separators — the line-break itself is the divider. Right-aligned to the page edge.

### Device Mockup — MacBook
**Role:** Showcase for desktop product work

Photographic render of a MacBook with a screenshot of the project filling the screen. No border, no shadow, no padding — sits directly on the white page. The device is the frame; the UI inside is the content.

### Device Mockup — iPhone
**Role:** Showcase for mobile product work

Photographic render of an iPhone with article or app content filling the screen. Same treatment as the MacBook: raw photographic asset, no overlay, no caption, no border.

### Project Row
**Role:** Horizontal band of device mockups forming a project entry

One MacBook or one-to-two iPhones arranged in a horizontal row, aligned to the left content column. No card background, no border, no project title visible — the work is self-explanatory through imagery.

## Do's and Don'ts

### Do
- Set the display headline at 40px Lab Grotesque weight 100 — the ultralight cut is non-negotiable and defines the site's voice.
- Push horizontal margins to 135px on the outer column to create the narrow-corridor layout that makes the page feel curated.
- Use only two colors: #000000 for all text and #ffffff for all backgrounds. Do not introduce a brand accent.
- Keep element gaps tight at 9px between stacked nav items and related labels — contrast against the 135px section margins.
- Present work as photographic device renders (MacBook, iPhone) on the white canvas. The product UI inside the screen is the only chromatic content.
- Set body and link text at 18px Lab Grotesque weight 400, line-height 1.20. Larger sizes (20px) are reserved for nav.
- Let the page title and year carry identity. Do not add a logo, mark, avatar, or favicon beyond the type itself.

### Don't
- Do not apply any border-radius. All edges are sharp 0px — cards, images, buttons, tags, all of them.
- Do not add box-shadows, drop-shadows, or glow effects. Separation comes from whitespace, not elevation.
- Do not introduce a CTA button, filled background, or accent color. The system has no button component.
- Do not use any font other than Lab Grotesque (or its substitute). No serif, no mono, no display script.
- Do not add borders, dividers, or hairlines between sections. Vertical rhythm is carried by margin alone.
- Do not decorate the display headline with color, underline, background highlight, or punctuation marks.
- Do not add a project title, caption, or description beneath device mockups. The imagery is the only label needed.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Paper | `#ffffff` | Full-bleed page background — the only surface in the system |

## Elevation

No shadows. Elevation is expressed through photographic device bezels (MacBook and iPhone frames) containing app screenshots — physical depth, not digital drop-shadows. Any component that needs separation from the page uses whitespace alone, never box-shadow.

## Imagery

Imagery is the only chromatic content on the page: photographic device renders (MacBook and iPhone) with product UI or editorial content visible inside the screens. The plant-identification app on the laptop introduces the only greens and reds — coming from the product content itself, not from the design system. The iPhone shows an article layout with a hero image of a fly and a runner. All photography is treated as full-bleed content inside device bezels, not as standalone editorial images. No illustration, no abstract graphics, no icon system beyond the text-as-link nav.

## Layout

Two-column top zone: left-aligned name-and-year stack sits opposite a right-aligned vertical nav list, both floating in the upper third of the page with massive whitespace above and below. The body is a single wide project band — a MacBook on the left, one or two iPhones grouped to the right — all sharing the same baseline. Content is left-anchored to a ~1200px content corridor, but the page itself is full-width white. No alternating bands, no section dividers, no headers between project rows. Navigation is the only persistent element; the rest of the page is a single vertical scroll through device-mockup rows separated by ~135px of air.

## Agent Prompt Guide

**Quick Color Reference**
- text: #000000
- background: #ffffff
- secondary text: #999999
- border: none (no borders used)
- accent: none (no accent color)
- primary action: no distinct CTA color

**Example Component Prompts**
1. Display headline block: 40px Lab Grotesque weight 100, #000000, line-height 1.20. Two lines, left-aligned, no decoration. Owner name on line one, year on line two.
2. Nav link list: 20px Lab Grotesque weight 600, #000000. Three items stacked vertically with 9px gap, right-aligned to the page edge, no underlines or separators.
3. MacBook project mockup: full photographic render of a MacBook placed on the #ffffff page background. No border, no shadow, no padding. UI content visible inside the screen. Left-anchored to the content column.
4. iPhone project mockup: full photographic render of an iPhone showing article or app content. No border, no shadow. Positioned to the right of the MacBook in the same row.
5. Project row: one MacBook and one-to-two iPhones on a single horizontal line, separated only by whitespace. No project title, no caption, no card wrapping.

## Similar Brands

- **Craig Mod (craigmod.com)** — Same near-empty white canvas with a single thin-weight display headline and right-aligned link list — portfolio as a single printed page
- **Frank Chimero (frankchimero.com)** — Identical monochromatic restraint with large negative space and device-mockup project showcases replacing decorative UI
- **Rauno Freiberg (raunofreiberg.com)** — Same typographic-first portfolio with ultralight grotesque display type and photographic work samples on a white field
- **Jason Yuan (jasonyuan.com)** — Matching minimal-craft approach: sparse layout, one custom grotesque, no brand color, project work shown inside realistic device frames

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-ink-black: #000000;
  --color-ash-gray: #999999;

  /* Typography — Font Families */
  --font-lab-grotesque: 'Lab Grotesque', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-body-sm: 18px;
  --leading-body-sm: 1.2;
  --text-subheading: 20px;
  --leading-subheading: 1.2;
  --text-display: 40px;
  --leading-display: 1.2;

  /* Typography — Weights */
  --font-weight-thin: 100;
  --font-weight-regular: 400;
  --font-weight-semibold: 600;

  /* Spacing */
  --spacing-unit: 8px;
  --spacing-9: 9px;
  --spacing-25: 25px;
  --spacing-32: 32px;
  --spacing-36: 36px;
  --spacing-54: 54px;
  --spacing-63: 63px;
  --spacing-68: 68px;
  --spacing-72: 72px;
  --spacing-135: 135px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 135px;
  --card-padding: 0px;
  --element-gap: 9px;

  /* Named Radii */
  --radius-tags: 0px;
  --radius-cards: 0px;
  --radius-images: 0px;
  --radius-buttons: 0px;

  /* Surfaces */
  --surface-paper: #ffffff;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-ink-black: #000000;
  --color-ash-gray: #999999;

  /* Typography */
  --font-lab-grotesque: 'Lab Grotesque', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-body-sm: 18px;
  --leading-body-sm: 1.2;
  --text-subheading: 20px;
  --leading-subheading: 1.2;
  --text-display: 40px;
  --leading-display: 1.2;

  /* Spacing */
  --spacing-9: 9px;
  --spacing-25: 25px;
  --spacing-32: 32px;
  --spacing-36: 36px;
  --spacing-54: 54px;
  --spacing-63: 63px;
  --spacing-68: 68px;
  --spacing-72: 72px;
  --spacing-135: 135px;
}
```
