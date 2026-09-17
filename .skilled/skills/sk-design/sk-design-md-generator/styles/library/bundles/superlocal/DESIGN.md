# Superlocal — Style Reference
> Cream risograph poster under cobalt sky — a single sheet of eggshell paper, one bolt of electric blue, and a sharp geometric face that feels printed not designed.

**Theme:** light

Superlocal reads as a printed festival poster translated to the web. The canvas is a warm eggshell cream (#fbf5e7), never clinical white — every default surface carries that risograph paper warmth. A single full-bleed electric cobalt band (#1673ff) detonates the first screen and acts as the brand's signature anchor, while a deep coffee-brown band (#3d2800) carries schedule content. Typography is dominated by a custom geometric display face (RST Reactor) that swings from a massive 172px headline with brutally tight -0.06em tracking down to 14-17px body, then jumps to positively-tracked uppercase eyebrows for the nav and captions. Controls are flat pill shapes (99px radius), the sponsor system is a sharp-cornered 6-column grid divided by hairlines, and color is rationed: most screens stay cream and monochrome, letting blue and orange erupt only on the hero and the single sunburst illustration.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Electric Cobalt | `#1673ff` | `--color-electric-cobalt` | Full-bleed hero backgrounds, section anchors — the single saturated chord of the system, reserved for the opening band and any screen that needs to shout over the cream |
| Coffee Bean | `#3d2800` | `--color-coffee-bean` | Dark schedule bands, body text on cream, logo lockup wordmark — a warm near-black that reads as ink, not charcoal |
| Tangerine Burn | `#ff7b02` | `--color-tangerine-burn` | Sunburst illustration accent, flower petal rays — the warm counterweight to cobalt, appears only inside the hero graphic |
| Eggshell Cream | `#fbf5e7` | `--color-eggshell-cream` | Page canvas, card surfaces, sponsor grid background, section fills — the warm default that replaces white everywhere |
| Ink Black | `#000000` | `--color-ink-black` | Primary body text, logo monogram strokes, illustration line work, hairline dividers, iconography |
| Pale Ash | `#c4c4c4` | `--color-pale-ash` | Secondary surface tint, disabled or inactive background fills, tertiary section background when cream needs a sibling |
| Mocha | `#604106` | `--color-mocha` | Yellow supporting accent for decorative details and low-frequency emphasis. Do not promote it to the primary CTA color |

## Tokens — Typography

### RST Reactor — Primary display and body face across the entire system. Drives the 172px hero headline, 64px section headings, 14-17px body, and 10-12px tracked eyebrows. Its brutal tracking swing — from -0.06em on display to +0.05em on micro text — IS the brand's typographic signature. Use for everything except rare utility contexts. · `--font-rst-reactor`
- **Substitute:** Space Grotesk (closest free geometric grotesque with similar optical qualities) or Sora
- **Weights:** 400, 500 (Medium variant used for select headings at 64px)
- **Sizes:** 10px, 12px, 14px, 16px, 17px, 64px, 172px
- **Line height:** 0.90 (64px heading), 1.00 (172px display), 1.20 (10-12px), 1.30 (16px), 1.41 (17px), 1.50 (17px body)
- **Letter spacing:** -0.06em at 172px, -0.05em at 64px, -0.04em at 17px, -0.02em at 14-16px, +0.022em at 12px, +0.05em at 10px
- **OpenType features:** `"blwf", "cv03", "cv04", "cv09", "cv11"`
- **Role:** Primary display and body face across the entire system. Drives the 172px hero headline, 64px section headings, 14-17px body, and 10-12px tracked eyebrows. Its brutal tracking swing — from -0.06em on display to +0.05em on micro text — IS the brand's typographic signature. Use for everything except rare utility contexts.

### Inter — Long-form body fallback. Used for extended paragraphs where RST Reactor's geometric character would compete with readability. Quiet, neutral, disappears into the page. · `--font-inter`
- **Substitute:** Inter (Google Font) or IBM Plex Sans
- **Weights:** 400
- **Sizes:** 16px
- **Line height:** 1.60
- **Letter spacing:** -0.02em
- **OpenType features:** `"blwf", "cv03", "cv04", "cv09", "cv11"`
- **Role:** Long-form body fallback. Used for extended paragraphs where RST Reactor's geometric character would compete with readability. Quiet, neutral, disappears into the page.

### System sans-serif — Micro utility text — timestamps, badges, and any element too small for RST Reactor to retain character · `--font-system-sans-serif`
- **Substitute:** Any platform system stack (-apple-system, Segoe UI, sans-serif)
- **Weights:** 400
- **Sizes:** 12px
- **Line height:** 1.20
- **Letter spacing:** normal
- **Role:** Micro utility text — timestamps, badges, and any element too small for RST Reactor to retain character

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| micro | 10px | 1.2 | 0.5px | `--text-micro` |
| eyebrow | 12px | 1.2 | 0.264px | `--text-eyebrow` |
| caption | 14px | 1.41 | -0.28px | `--text-caption` |
| body-sm | 16px | 1.6 | -0.32px | `--text-body-sm` |
| heading | 64px | 0.9 | -3.2px | `--text-heading` |
| display | 172px | 1 | -10.32px | `--text-display` |

## Tokens — Spacing & Shapes

**Density:** compact

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 5 | 5px | `--spacing-5` |
| 7 | 7px | `--spacing-7` |
| 8 | 8px | `--spacing-8` |
| 10 | 10px | `--spacing-10` |
| 16 | 16px | `--spacing-16` |
| 17 | 17px | `--spacing-17` |
| 23 | 23px | `--spacing-23` |
| 24 | 24px | `--spacing-24` |
| 32 | 32px | `--spacing-32` |
| 48 | 48px | `--spacing-48` |
| 57 | 57px | `--spacing-57` |
| 78 | 78px | `--spacing-78` |
| 80 | 80px | `--spacing-80` |
| 104 | 104px | `--spacing-104` |
| 112 | 112px | `--spacing-112` |
| 200 | 200px | `--spacing-200` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 30px |
| cards | 0px |
| pills | 99px |
| buttons | 50px |

### Layout

- **Section gap:** 57-78px
- **Card padding:** 16-24px
- **Element gap:** 10-16px

## Components

### Cobalt Hero Band
**Role:** Opening screen — the system's signature moment

Full-viewport #1673ff band. Logo wordmark 'superlocal' in Eggshell Cream at top-left (RST Reactor 17px, -0.02em). Nav links (INICIO, LINEUP, CRONOGRAMA, CONTACTO) in cream at 12px tracked +0.264px, top-right. Centered illustration occupies the full visual field. Bottom-left carries a 12px cream caption (LA CONFERENCIA DE DISEÑO / INTERNACIONAL DEL URUGUAY). No padding from viewport edges — graphic bleeds to all four sides.

### Reservar Pill Button
**Role:** Primary floating action on the hero

Eggshell Cream (#fbf5e7) pill, 99px radius, sits at bottom-right of the hero. Contains a 32×32 circular white inset with a miniature tangerine sunburst icon, the label 'RESERVAR ACTIVIDADES' in Coffee Bean at 12px tracked +0.264px, and a right-arrow glyph. Padding 8px vertical, 16px horizontal. No shadow — flat against the cobalt.

### Top Navigation Bar
**Role:** Minimal global navigation

Transparent, no background. Logo at top-left, nav cluster at top-right. Items are 12px RST Reactor, tracked +0.264px, uppercase, Ink Black on cream sections and Eggshell Cream on the cobalt hero. Spacing between items: 24px. No underline, no active state decoration beyond color shift.

### Eggshell Content Section
**Role:** Default body surface

Full-bleed #fbf5e7 background. No border, no shadow, no radius. Internal content uses generous edge padding (48-78px vertical, fluid horizontal). Headlines sit at 64-172px in Coffee Bean. Body in Ink Black at 17px. The cream itself provides the warmth — no decorative treatment needed.

### Sponsor Grid Cell
**Role:** Single sponsor brand slot in the 6-column grid

Zero radius, Eggshell Cream background, bordered on all four sides by a 1px Ink Black hairline. Sponsor logo centered both axes, 60% of cell width. Cell aspect roughly 1:1.5 portrait. No padding override — logo floats in the negative space.

### Sponsor Grid
**Role:** 6-column × 2-row partner wall

Six equal columns, two rows, gap 0. The grid IS the divider system — each cell's borders compose the full grid lines. Background is Eggshell Cream. The grid sits inside a content section with edge padding equal to one cell width on each side, so the outermost borders align with the section's content edge.

### Coffee Schedule Band
**Role:** Dark inverted band for schedule / timeline content

Full-bleed #3d2800 background. Headlines 'Cronograma 2025' sit at 64px RST Reactor Medium, Eggshell Cream, -3.2px tracking, line-height 0.90 (the line-height <1 is a deliberate editorial squeeze — the descenders kiss the next line). Body explanation text in Eggshell Cream at 14px. Spacing between heading pair and body: 48px. Schedule rows below use 12px cream text on 0px gap (tight rows).

### Schedule Row
**Role:** Single time slot in the cronograma

Three-column flex within the Coffee Band: date stamp (left, 12px cream, +0.264px tracking), title block (center, 17px Eggshell Cream, -0.68px tracking), meta line (right, 12px cream). Row height ~32px, separated by a 1px #604106 hairline. No hover state — static editorial table.

### Section Caption
**Role:** Eyebrow / small context label

10-12px RST Reactor, uppercase, +0.5px or +0.264px tracking, Coffee Bean on cream sections, Eggshell Cream on the cobalt hero. Single line, sits 32px above the headline it labels.

### Sunburst Illustration
**Role:** Hero centerpiece graphic

Large stylized flower/sonnenblume: eight Eggshell Cream rounded petals around a black-and-white optical-ring center with a Tangerine Burn sunburst burst between the center and petals. Pure flat shapes, no gradients, no shadows. Centered on the cobalt band, scale ~60% of viewport height. Functions as a logo-as-poster, not a decorative flourish.

### Footer Wordmark
**Role:** Closing identity lockup

Abbreviated 'splcl' wordmark in Coffee Bean at 14px, top-left of an Eggshell section, acting as a recurring signpost. No rules, no background — just type breathing on the cream.

## Do's and Don'ts

### Do
- Use #fbf5e7 as the default canvas for every body section. Pure white is a violation of the paper-warm system.
- Reserve #1673ff for full-bleed hero bands and the single moment that needs to detonate. Never use it as a small button fill or chip.
- Set buttons and tags to 99px radius. The pill silhouette is the system's recurring punctuation mark.
- Use -0.05em or tighter tracking on any display size 64px and above. Positive tracking belongs only on 10-12px eyebrow and caption text.
- Use the 6-column hairline grid for any partner, sponsor, or logo wall. Zero cell gap, 1px black dividers, no card shadows.
- Anchor every section with either cream or coffee-brown as the surface. Do not introduce a third dark or light tone.
- Pair the sunburst illustration with a 12-32px cream or black circular badge when it appears at small sizes (e.g., inside the Reservar button).

### Don't
- Don't drop shadows anywhere. The system reads as flat-printed matter, not as a layered UI.
- Don't use #1673ff as a link color, icon tint, or text accent. It is a wall, not a highlight.
- Don't set body text larger than 17px in RST Reactor. The face is designed for tension between tiny tracked labels and massive display — body should stay in the 14-17px window.
- Don't use 0px radius for buttons. The pill is the system's recurring motif; squared buttons break the rhythm.
- Don't introduce a new accent hue. The brand's chromatic vocabulary is exactly three: Cobalt, Coffee, Tangerine.
- Don't set line-height above 1.0 on the 64px and 172px display sizes. The near-touching lines are intentional.
- Don't place a colored button on a surface of the same hue. The Reservar button is cream on cobalt — contrast is structural.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Hero Cobalt | `#1673ff` | Full-bleed first screen, sets the brand's electric register |
| 1 | Eggshell Canvas | `#fbf5e7` | Default body surface across all content sections |
| 2 | Ash Tint | `#c4c4c4` | Subtle alternation within cream content blocks |
| 3 | Coffee Band | `#3d2800` | Dark schedule and footer band, inverted type surface |

## Elevation

The system is deliberately flat. No drop shadows, no glows, no raised surfaces. Hierarchy comes from color contrast (cream → coffee → cobalt), type scale, and the negative space of full-bleed bands — never from z-axis elevation. A pill button on the cobalt hero is the same flat plane as the surface behind it, distinguished only by its 99px radius and inverted fill.

## Imagery

Imagery is graphic, not photographic. The entire visual identity rests on a single flat-vector sunburst/flower illustration in the hero — eight cream petals, tangerine rays, black-and-white optical center. No photography appears anywhere on the site. Sponsor marks are the only secondary visual content, presented as monochrome black wordmarks on cream cells. Icons are minimal: a tiny circular tangerine sunburst, a right-arrow glyph, and clean geometric utility marks. The aesthetic is risograph-printed-poster — bold flat shapes, tight ink coverage, and a single saturated burst of color as the visual exclamation point.

## Layout

The page model is full-bleed with no max-width container — every section paints its own color edge to edge. The hero is a single 100vh cobalt band with the illustration centered and floating type at the four corners. Below the hero, content lives in cream sections that alternate with one dark coffee-brown band for the schedule. Vertical rhythm is 57-78px between sections. The sponsor wall is a 6-column × 2-row grid with zero cell gap and no card radius — the cell borders compose the grid lines. Text sections use a single wide column rather than multi-column body text. Navigation is a transparent top bar with logo left and four links right; no sticky behavior, no hamburger, no sidebar. The overall feel is closer to a printed broadsheet than a SaaS dashboard — sections stack vertically like pages of a program.

## Agent Prompt Guide

**Quick Color Reference**
- canvas: #fbf5e7 (Eggshell Cream)
- surface dark: #3d2800 (Coffee Bean)
- hero band: #1673ff (Electric Cobalt)
- text primary: #000000 (Ink Black)
- text on dark: #fbf5e7 (Eggshell Cream)
- accent illustration: #ff7b02 (Tangerine Burn)
- primary action: no distinct CTA color

**3-5 Example Component Prompts**
1. Build a full-bleed hero band: #1673ff background, no padding from viewport. Center a flat sunburst illustration (eight #fbf5e7 rounded petals, #ff7b02 ray burst, #000000-and-#fbf5e7 optical center, 60% of viewport height). 'superlocal' wordmark top-left in #fbf5e7 at 17px RST Reactor tracking -0.02em. Four uppercase nav links (INICIO, LINEUP, CRONOGRAMA, CONTACTO) top-right at 12px RST Reactor tracking +0.264px, color #fbf5e7. Bottom-left eyebrow caption at 12px #fbf5e7 tracking +0.264px.
2. Build a sponsor grid: #fbf5e7 background, 6 equal columns × 2 rows, gap 0, 1px #000000 hairline borders on every cell, zero radius. Each cell holds one monochrome black wordmark centered at 60% cell width. Outer section padding equal to one cell width on left/right so the outer borders align flush with the content edge.
3. Build a dark schedule band: full-bleed #3d2800 background. Heading 'Cronograma 2025' in #fbf5e7 RST Reactor at 64px, tracking -3.2px, line-height 0.90. Body description in #fbf5e7 at 14px. Below: schedule rows, each with 12px #fbf5e7 uppercase date stamp (tracking +0.264px), 17px #fbf5e7 title (tracking -0.68px), 12px #fbf5e7 meta line — row height 32px, separated by 1px #604106 hairlines.
4. Build a pill floating action: 99px radius, #fbf5e7 background, padding 8px 16px. Contains a 32×32 white circle holding a miniature tangerine sunburst icon, the label 'RESERVAR ACTIVIDADES' in #3d2800 at 12px tracking +0.264px, and a right-arrow glyph. No shadow. Sits at bottom-right of the hero with 32px edge inset.
5. Build a footer wordmark: abbreviated 'splcl' in #3d2800 RST Reactor at 14px, top-left of an #fbf5e7 section, 48px top padding, no background, no rules.

## Similar Brands

- **Awwwards Conference sites** — Same editorial full-bleed band structure — one saturated color detonates the hero, then a quiet cream/dark rhythm carries the program, with type that swings from tracked uppercase nav to massive geometric display
- **Apple Keynote event pages** — Single full-bleed color hero, a centered graphic as the visual anchor, and a near-monochrome content body below — Superlocal adopts the same architectural restraint but swaps Apple's glass-blue for electric cobalt and white for cream
- **It's Nice That features** — Cream-canvas editorial surfaces, hairline-bordered grid walls for partners, and a custom geometric face used at extreme size contrast — both treat the page as a printed sheet
- **Dropbox Design Open** — Festival-style schedule band in a deep brand color, massive stacked heading pairs ('Cronograma / 2025' mirrors 'Design / Open'), and the editorial use of negative space as the primary layout device

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-electric-cobalt: #1673ff;
  --color-coffee-bean: #3d2800;
  --color-tangerine-burn: #ff7b02;
  --color-eggshell-cream: #fbf5e7;
  --color-ink-black: #000000;
  --color-pale-ash: #c4c4c4;
  --color-mocha: #604106;

  /* Typography — Font Families */
  --font-rst-reactor: 'RST Reactor', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-system-sans-serif: 'System sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-micro: 10px;
  --leading-micro: 1.2;
  --tracking-micro: 0.5px;
  --text-eyebrow: 12px;
  --leading-eyebrow: 1.2;
  --tracking-eyebrow: 0.264px;
  --text-caption: 14px;
  --leading-caption: 1.41;
  --tracking-caption: -0.28px;
  --text-body-sm: 16px;
  --leading-body-sm: 1.6;
  --tracking-body-sm: -0.32px;
  --text-heading: 64px;
  --leading-heading: 0.9;
  --tracking-heading: -3.2px;
  --text-display: 172px;
  --leading-display: 1;
  --tracking-display: -10.32px;

  /* Typography — Weights */
  --font-weight-regular: 400;

  /* Spacing */
  --spacing-5: 5px;
  --spacing-7: 7px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-16: 16px;
  --spacing-17: 17px;
  --spacing-23: 23px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-48: 48px;
  --spacing-57: 57px;
  --spacing-78: 78px;
  --spacing-80: 80px;
  --spacing-104: 104px;
  --spacing-112: 112px;
  --spacing-200: 200px;

  /* Layout */
  --section-gap: 57-78px;
  --card-padding: 16-24px;
  --element-gap: 10-16px;

  /* Border Radius */
  --radius-3xl: 30px;
  --radius-full: 50px;
  --radius-full-2: 99px;
  --radius-full-3: 9999px;

  /* Named Radii */
  --radius-tags: 30px;
  --radius-cards: 0px;
  --radius-pills: 99px;
  --radius-buttons: 50px;

  /* Surfaces */
  --surface-hero-cobalt: #1673ff;
  --surface-eggshell-canvas: #fbf5e7;
  --surface-ash-tint: #c4c4c4;
  --surface-coffee-band: #3d2800;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-electric-cobalt: #1673ff;
  --color-coffee-bean: #3d2800;
  --color-tangerine-burn: #ff7b02;
  --color-eggshell-cream: #fbf5e7;
  --color-ink-black: #000000;
  --color-pale-ash: #c4c4c4;
  --color-mocha: #604106;

  /* Typography */
  --font-rst-reactor: 'RST Reactor', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-system-sans-serif: 'System sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-micro: 10px;
  --leading-micro: 1.2;
  --tracking-micro: 0.5px;
  --text-eyebrow: 12px;
  --leading-eyebrow: 1.2;
  --tracking-eyebrow: 0.264px;
  --text-caption: 14px;
  --leading-caption: 1.41;
  --tracking-caption: -0.28px;
  --text-body-sm: 16px;
  --leading-body-sm: 1.6;
  --tracking-body-sm: -0.32px;
  --text-heading: 64px;
  --leading-heading: 0.9;
  --tracking-heading: -3.2px;
  --text-display: 172px;
  --leading-display: 1;
  --tracking-display: -10.32px;

  /* Spacing */
  --spacing-5: 5px;
  --spacing-7: 7px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-16: 16px;
  --spacing-17: 17px;
  --spacing-23: 23px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-48: 48px;
  --spacing-57: 57px;
  --spacing-78: 78px;
  --spacing-80: 80px;
  --spacing-104: 104px;
  --spacing-112: 112px;
  --spacing-200: 200px;

  /* Border Radius */
  --radius-3xl: 30px;
  --radius-full: 50px;
  --radius-full-2: 99px;
  --radius-full-3: 9999px;
}
```
