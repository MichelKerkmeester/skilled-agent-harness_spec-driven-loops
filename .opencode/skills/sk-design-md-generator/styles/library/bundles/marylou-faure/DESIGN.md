# Marylou Faure — Style Reference
> white gallery wall for fearless color

**Theme:** light

Marylou Faure is a gallery wall, not a website. The interface strips itself to a bare white canvas with hairline borders and near-microscopic UI chrome, so the illustrations — vivid reds, bubblegum pinks, electric blues, acid greens — can detonate against it. Typography is a quiet geometric sans (Helvetica Now) that never competes with the artwork; body text lives at 12-16px in near-black, nav links sit in a thin uppercase row, and the only typographic shout is the project title. The system follows one rule: the UI must be the quietest element on every page, so the art is the only thing with a voice.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Ink | `#000000` | `--color-ink` | All text, hairline borders, nav dividers, the structural skeleton of the page |
| Ash | `#737373` | `--color-ash` | Email link, secondary metadata text |
| Paper | `#ffffff` | `--color-paper` | Page background, card surfaces — the unbroken gallery wall |
| Crimson Pop | `#ff0000` | `--color-crimson-pop` | Red wash for highlight backgrounds, decorative bands, and soft emphasis behind content. Do not promote it to the primary CTA color |
| Bubblegum | `#ffbbff` | `--color-bubblegum` | Illustration surface — flat shapes and product packaging accents |
| Cotton Candy | `#f7b2de` | `--color-cotton-candy` | Illustration surface — character skin, hair, soft fills |
| Sour Grape | `#ffa3fe` | `--color-sour-grape` | Illustration surface and link hover highlight — bright magenta accent within artwork |
| Pool Blue | `#72c2f2` | `--color-pool-blue` | Illustration surface — ice, sky, cooling tones in product photography context |
| Ice Blue | `#96d6ff` | `--color-ice-blue` | Illustration surface — soft blue fills, atmospheric tones |
| Acid Green | `#32c24d` | `--color-acid-green` | Illustration accent — rare punctuation green in character and product art |

## Tokens — Typography

### Helvetica Now — The single typeface for everything: nav links, body, project titles, labels. The 600 weight appears only for project section headers; everything else stays at 400. The uppercase letter-spacing (0.0420em) is reserved for the smallest caption-like text — it reads as a label tag, not body copy · `--font-helvetica-now`
- **Substitute:** Inter, Neue Haas Grotesk, or system-ui as fallback
- **Weights:** 400, 600
- **Sizes:** 12, 16, 20, 22, 40
- **Line height:** 1.20, 1.25, 1.35, 1.38, 1.50
- **Letter spacing:** 0.0230em at 12px, 0.0310em at 20px, 0.0420em at 12px (uppercase labels)
- **Role:** The single typeface for everything: nav links, body, project titles, labels. The 600 weight appears only for project section headers; everything else stays at 400. The uppercase letter-spacing (0.0420em) is reserved for the smallest caption-like text — it reads as a label tag, not body copy

### GTStandard-M — GTStandard-M — detected in extracted data but not described by AI · `--font-gtstandard-m`
- **Weights:** 400
- **Sizes:** 12px
- **Line height:** 1.5
- **Letter spacing:** 0.042
- **Role:** GTStandard-M — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.5 | 0.5px | `--text-caption` |
| body | 16px | 1.35 | — | `--text-body` |
| subheading | 20px | 1.25 | — | `--text-subheading` |
| heading | 22px | 1.2 | — | `--text-heading` |
| display | 40px | 0.8 | — | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 8px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 8 | 8px | `--spacing-8` |
| 9 | 9px | `--spacing-9` |
| 10 | 10px | `--spacing-10` |
| 12 | 12px | `--spacing-12` |
| 13 | 13px | `--spacing-13` |
| 15 | 15px | `--spacing-15` |
| 16 | 16px | `--spacing-16` |
| 30 | 30px | `--spacing-30` |
| 33 | 33px | `--spacing-33` |
| 50 | 50px | `--spacing-50` |
| 159 | 159px | `--spacing-159` |
| 188 | 188px | `--spacing-188` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 0px |
| images | 0px |
| buttons | 8px |

### Layout

- **Section gap:** 33px
- **Card padding:** 30px
- **Element gap:** 15px

## Components

### Top Navigation Bar
**Role:** Site-wide navigation

Full-width white bar with 1px black bottom border. Left: brand name 'Marylou Faure' at 12px, weight 400, black, letter-spacing 0.0420em (uppercase visual weight). Right: nav links (Projects, Personal, About, Shop) inline at 12-16px black, no separators, with a small bag/cart icon at the far right. No background fill change, no shadow, no logo image — the border is the only structural element.

### Bio Block
**Role:** Introduction section beneath nav

Two-column flex layout: left side contains a short artist bio (16px body, weight 400, black) plus 'Email' label and email address link, and 'Select Clients' caption above a logo strip. Right side shows two small thumbnail images labeled 'Personal work' and 'Shop prints & figurines'. Sections separated by 1px horizontal black lines, not colored cards.

### Client Logo Strip
**Role:** Social proof band

Single horizontal row of monochrome client logos (Nike, Kiehl's, Netflix, Apple, Instagram, NYT, Spotify, YouTube, etc.) at uniform height, all rendered in black on white, evenly spaced. Labeled 'Select Clients' in the same 12px uppercase caption style. No background, no cards, no borders around logos.

### Project Section Header
**Role:** Title for each project gallery

Large left-aligned display text at 40px, weight 600, black, line-height 0.80, sitting directly above a multi-image grid. No subtitle, no metadata, no decorative element — just the client/project name as the door into the visual work below.

### Project Image Grid
**Role:** Primary content display for portfolio work

CSS grid of 2-3 columns at full width, images flush against each other with 1px black gridlines or 0px gap. Images are sharp-edged (no border-radius), full-bleed within their cells, and show the artist's illustrations or product photography at native aspect ratios. No captions, no hover overlays, no lightbox chrome visible at rest.

### Hero Project Image
**Role:** First image in each project section

Full-width or 2-column-spanning illustration/photograph that establishes the project's color story. The image itself carries the brand's chromatic energy (red backgrounds, pink fills, etc.) — the UI around it stays pure white and black.

### Email Link
**Role:** Contact mechanism

Plain inline text link at 16px, weight 400, color #000000 with 1px black underline border, no background. Sits directly under the 'Email' label caption.

### Page Footer
**Role:** Minimal site closure

Continuation of the bordered grid pattern — projects scroll until the bottom, separated by 1px black horizontal lines. No dedicated footer block, no social icons row, no newsletter form.

## Do's and Don'ts

### Do
- Keep the page background #ffffff and all structural text #000000 — the interface is monochrome by design
- Use 1px solid #000000 borders as the primary structural element; they replace shadows, cards, and color fills
- Set border-radius to 0 on all images and project grids; only the cart button uses 8px radius
- Set the project title at 40px weight 600 as the only typographic emphasis on the page
- Let illustration imagery carry all chromatic color — never add a colored UI element that competes with the artwork
- Use letter-spacing 0.0420em on the 12px uppercase labels (nav brand, 'Select Clients', 'Personal work', etc.) to give them label-tag presence
- Maintain generous whitespace: 15px between inline elements, 30px padding inside project sections, 33px between major content blocks

### Don't
- Do not add shadows, gradients, or colored backgrounds to UI containers — the flat hairline-border aesthetic is the signature
- Do not use any chromatic color as a CTA, button fill, or active state — the reds/pinks/blues belong inside illustrations only
- Do not apply border-radius to images, project cards, or thumbnails — only the 8px cart button breaks from sharp edges
- Do not introduce a second typeface or a decorative display font; Helvetica Now at two weights is the whole system
- Do not add hover overlays, zoom effects, or transition animations to project images — they should present flat and direct
- Do not use colored dividers, tinted section backgrounds, or alternating band colors between projects
- Do not add a hero headline, tagline, or marketing block above the fold — the top nav and bio block are the entire intro

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Paper | `#ffffff` | Unbroken page background — the gallery wall |
| 2 | Ink Rule | `#000000` | 1px hairline dividers between every section, acting as the only structural border |

## Elevation

The design uses no shadows or elevation. Structure is communicated entirely through 1px solid #000000 borders and whitespace. This flat treatment is deliberate: shadows would feel heavy against the white gallery wall and compete with the flat, poster-like quality of the illustrations.

## Imagery

Illustration and product photography dominate the page. The artwork style is flat vector character illustration with bold black outlines, saturated flat color fills (crimson red, bubblegum pink, electric blue, acid green), and graphic compositions featuring stylized figures, flowers, and abstract shapes. Product photography appears in the Coca-Cola section — tight crops of illustrated cans resting on crushed ice with shallow depth of field. All imagery is sharp-edged (no border-radius), full-bleed within grid cells, and rendered without overlays, vignettes, or color treatment. The illustrations themselves do the brand work: there are no decorative backgrounds, abstract graphics, or stock photography separate from the portfolio work.

## Layout

Full-width single-column page with no max-width container — content stretches edge-to-edge. The top nav is a thin row with a 1px bottom border. Below it, a bio block uses a flex two-column layout (text left, thumbnails right) followed by a single-row client logo strip. Each project then takes a full-width section: a large 40px project title sits flush left, followed immediately by a 2-3 column image grid that fills the viewport width. Images are flush against each other with 1px black gridlines. Sections are separated by full-width 1px black horizontal rules. The page scrolls as a single long document — no sticky navigation, no sidebar, no modal overlays, no pagination. Navigation between project categories (Projects, Personal, About, Shop) likely triggers page transitions rather than scroll-to-section jumps.

## Agent Prompt Guide

**Quick Color Reference**
- text: #000000
- background: #ffffff
- border: #000000 (1px)
- secondary text: #737373
- primary action: no distinct CTA color

**Example Component Prompts**

1. *Top Navigation Bar*: Full-width white bar, 1px solid #000000 bottom border. Left: 'Marylou Faure' at 12px Helvetica Now weight 400, color #000000, letter-spacing 0.5px. Right: nav links 'Projects', 'Personal', 'About', 'Shop' inline at 12-16px, weight 400, black, no separators, plus a small bag icon at the far right edge. Total height ~40px. No background fill, no shadow.

2. *Project Section Header*: 'Coca-Cola' at 40px Helvetica Now weight 600, color #000000, line-height 0.80, left-aligned. No subtitle, no metadata, no decorative element. Sits directly above the image grid with 15px gap.

3. *Project Image Grid*: Full-width CSS grid, 2-3 columns depending on viewport, images flush against each other with 0px gap and 1px solid #000000 dividers. Images are sharp-edged (border-radius 0), no captions, no hover overlays. Grid fills the entire viewport width edge-to-edge.

4. *Bio Block*: Two-column flex layout. Left column: bio paragraph at 16px weight 400 #000000, then 'Email' caption at 12px uppercase letter-spacing 0.5px, then email address as plain text link with 1px black underline. Right column: two thumbnail images (~150px wide) labeled above with 'Personal work' and 'Shop prints & figurines' in 12px uppercase style. Columns separated by a 1px vertical black rule.

5. *Client Logo Strip*: Single horizontal row, full-width, all logos rendered in monochrome black on white at uniform ~30px height, evenly spaced. Caption 'Select Clients' in 12px uppercase letter-spacing 0.5px sits above the row, left-aligned. No borders, no background, no padding around individual logos.

## Similar Brands

- **Buck (buck.co)** — Same gallery-wall approach — white background, hairline dividers, monochrome type, and letting the project imagery and motion work carry all the color
- **Studio Brasch (studiobrasch.com)** — Identical portfolio structure: minimal nav, large project titles, edge-to-edge image grids, no card backgrounds or shadows, the work IS the design
- **Heydays (heydays.no)** — Same flat-hairline-border aesthetic with monochrome UI and vibrant illustration/photography as the only color source
- **Anton & Irene (antonandirene.com)** — Portfolio sites that use 1px black rules and white space as the entire structural system, with project imagery filling edge-to-edge

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-ink: #000000;
  --color-ash: #737373;
  --color-paper: #ffffff;
  --color-crimson-pop: #ff0000;
  --color-bubblegum: #ffbbff;
  --color-cotton-candy: #f7b2de;
  --color-sour-grape: #ffa3fe;
  --color-pool-blue: #72c2f2;
  --color-ice-blue: #96d6ff;
  --color-acid-green: #32c24d;

  /* Typography — Font Families */
  --font-helvetica-now: 'Helvetica Now', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-gtstandard-m: 'GTStandard-M', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --tracking-caption: 0.5px;
  --text-body: 16px;
  --leading-body: 1.35;
  --text-subheading: 20px;
  --leading-subheading: 1.25;
  --text-heading: 22px;
  --leading-heading: 1.2;
  --text-display: 40px;
  --leading-display: 0.8;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-semibold: 600;

  /* Spacing */
  --spacing-unit: 8px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-9: 9px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-13: 13px;
  --spacing-15: 15px;
  --spacing-16: 16px;
  --spacing-30: 30px;
  --spacing-33: 33px;
  --spacing-50: 50px;
  --spacing-159: 159px;
  --spacing-188: 188px;

  /* Layout */
  --section-gap: 33px;
  --card-padding: 30px;
  --element-gap: 15px;

  /* Border Radius */
  --radius-lg: 8px;

  /* Named Radii */
  --radius-cards: 0px;
  --radius-images: 0px;
  --radius-buttons: 8px;

  /* Surfaces */
  --surface-paper: #ffffff;
  --surface-ink-rule: #000000;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-ink: #000000;
  --color-ash: #737373;
  --color-paper: #ffffff;
  --color-crimson-pop: #ff0000;
  --color-bubblegum: #ffbbff;
  --color-cotton-candy: #f7b2de;
  --color-sour-grape: #ffa3fe;
  --color-pool-blue: #72c2f2;
  --color-ice-blue: #96d6ff;
  --color-acid-green: #32c24d;

  /* Typography */
  --font-helvetica-now: 'Helvetica Now', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-gtstandard-m: 'GTStandard-M', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --tracking-caption: 0.5px;
  --text-body: 16px;
  --leading-body: 1.35;
  --text-subheading: 20px;
  --leading-subheading: 1.25;
  --text-heading: 22px;
  --leading-heading: 1.2;
  --text-display: 40px;
  --leading-display: 0.8;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-9: 9px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-13: 13px;
  --spacing-15: 15px;
  --spacing-16: 16px;
  --spacing-30: 30px;
  --spacing-33: 33px;
  --spacing-50: 50px;
  --spacing-159: 159px;
  --spacing-188: 188px;

  /* Border Radius */
  --radius-lg: 8px;
}
```
