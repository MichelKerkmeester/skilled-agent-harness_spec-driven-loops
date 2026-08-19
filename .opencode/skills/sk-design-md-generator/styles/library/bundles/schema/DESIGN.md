# Schema — Style Reference
> Ink-black keynote stage with confetti-bright murals

**Theme:** mixed

Schema by Figma runs on a stark monochrome architecture punctured by bold flat-color geometric murals. The UI uses pure black, near-black, and white with hairline gray borders — no shadows, minimal radii, no chromatic accents in the interface itself. Color appears only as decorative art (circles, hexagons, rectangles in purple, teal, maroon, green, orange) and as solid-background speaker portraits. Typography is the loudest element: Figma's custom display face at 56–86px with extreme negative tracking (-0.02em) and tight 0.90 line-height makes headlines feel carved rather than typeset. The hero inverts convention with a black canvas and an oversized outlined Register button; content sections then alternate through full-bleed colored bands before resolving into a clean white speaker grid.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Obsidian | `#000000` | `--color-obsidian` | Hero canvas, heavy structural borders, icon strokes — sets the high-contrast keynote-stage mood for the opening fold |
| Ink | `#0f0f0f` | `--color-ink` | Body and heading text on light surfaces, dark section borders |
| Paper | `#ffffff` | `--color-paper` | Page background, speaker card surfaces, light-section text on dark hero |
| Ash | `#e2e2e2` | `--color-ash` | Hairline borders, subtle icon fills, structural dividers between UI regions |
| Mint Wash | `#c7f8fb` | `--color-mint-wash` | Teal wash for highlight backgrounds, decorative bands, and soft emphasis behind content. Do not promote it to the primary CTA color |
| Emerald Band | `#24cb71` | `--color-emerald-band` | Full-bleed accent section background — a bright green horizontal band that closes the hero composition |

## Tokens — Typography

### Source Sans Pro — Source Sans Pro — detected in extracted data but not described by AI · `--font-source-sans-pro`
- **Weights:** 400
- **Sizes:** 16px
- **Line height:** 1.2
- **Role:** Source Sans Pro — detected in extracted data but not described by AI

### Figma Sans Display — Headlines and display copy — used at 56–86px for hero ('Schema by Figma', 'Meet our speakers!') with tight leading (0.90–1.10) and -0.02em tracking that makes type feel carved from a block. Weight 400 carries the design; 700 is reserved for emphasis. · `--font-figma-sans-display`
- **Substitute:** Inter Tight or a custom variable sans like General Sans
- **Weights:** 400, 700
- **Sizes:** 16, 24, 32, 56, 72, 86
- **Line height:** 0.90–1.40
- **Letter spacing:** -0.02em at 72–86px, -0.01em at 24–32px, 0.03em for some 16px contexts
- **Role:** Headlines and display copy — used at 56–86px for hero ('Schema by Figma', 'Meet our speakers!') with tight leading (0.90–1.10) and -0.02em tracking that makes type feel carved from a block. Weight 400 carries the design; 700 is reserved for emphasis.

### Figma Sans Text — Body, nav, button labels, supporting text. The companion text face at modest sizes (13–18px) with weight 400 as default and 600 for buttons/labels. -0.02em at 13px prevents the small type from feeling loose; 0.03em at 18px gives labels air. · `--font-figma-sans-text`
- **Substitute:** Inter or Söhne
- **Weights:** 400, 600
- **Sizes:** 13, 16, 18
- **Line height:** 1.20–1.22
- **Letter spacing:** -0.02em at 13px, 0.03em at 18px
- **Role:** Body, nav, button labels, supporting text. The companion text face at modest sizes (13–18px) with weight 400 as default and 600 for buttons/labels. -0.02em at 13px prevents the small type from feeling loose; 0.03em at 18px gives labels air.

### Figma Mono — Code or metadata snippets — used sparingly at 16px with 0.03em tracking for an architectural, monospaced accent in a world of proportional text · `--font-figma-mono`
- **Substitute:** JetBrains Mono or IBM Plex Mono
- **Weights:** 400
- **Sizes:** 16
- **Line height:** 1.30–1.40
- **Letter spacing:** 0.03em
- **Role:** Code or metadata snippets — used sparingly at 16px with 0.03em tracking for an architectural, monospaced accent in a world of proportional text

### Figma VF-normal-700-75 — Figma VF-normal-700-75 — detected in extracted data but not described by AI · `--font-figma-vf-normal-700-75`
- **Weights:** 400
- **Sizes:** 24px
- **Line height:** 1.2
- **Role:** Figma VF-normal-700-75 — detected in extracted data but not described by AI

### Figma VF-normal-400-100 — Figma VF-normal-400-100 — detected in extracted data but not described by AI · `--font-figma-vf-normal-400-100`
- **Weights:** 400
- **Sizes:** 16px
- **Line height:** 1.2
- **Letter spacing:** 0.03
- **Role:** Figma VF-normal-400-100 — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 13px | 1.2 | -0.26px | `--text-caption` |
| body | 16px | 1.2 | — | `--text-body` |
| body-md | 18px | 1.22 | 0.54px | `--text-body-md` |
| subheading | 24px | 1.2 | -0.24px | `--text-subheading` |
| heading-sm | 32px | 1.1 | -0.32px | `--text-heading-sm` |
| heading | 56px | 1 | -1.12px | `--text-heading` |
| heading-lg | 72px | 0.9 | -1.44px | `--text-heading-lg` |
| display | 86px | 0.9 | -1.72px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 8px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 8 | 8px | `--spacing-8` |
| 16 | 16px | `--spacing-16` |
| 24 | 24px | `--spacing-24` |
| 32 | 32px | `--spacing-32` |
| 48 | 48px | `--spacing-48` |
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |
| 120 | 120px | `--spacing-120` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 0px |
| cards | 0px |
| buttons | 0px |
| speaker-images | 0px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 60px
- **Card padding:** 16px
- **Element gap:** 24px

## Components

### Top Navigation Bar
**Role:** Persistent header across all sections

Transparent on the black hero, Paper on light sections. Left: small monogram logo (32px square, Obsidian or Paper fill). Right: 2–4 text links (FAQ, Agenda) at 16px Figma Sans Text weight 400, tracking 0.03em. 16px horizontal padding, 20px vertical. No background fill, no border.

### Hero Outlined Register Button
**Role:** Primary action on the dark hero

Full-width on the hero, 56–64px tall. 1px Paper border, no fill, Paper text. 0px radius. Text at 18–24px Figma Sans Text weight 400, centered. On hover, fills to Paper with Obsidian text.

### Eyebrow Label
**Role:** Section pre-heading (VIRTUAL, SPEAKERS, REGISTER)

12–13px Figma Sans Text weight 400 or 600, uppercase via CSS, tracking 0.03em. Color is Ink on light sections, Paper on dark. Sits 16–24px above the headline.

### Display Headline
**Role:** Section hero titles ('Schema by Figma', 'Meet our speakers!', 'Join us virtually!')

Figma Sans Display weight 400, 56–86px, line-height 0.90–1.00, letter-spacing -0.02em. Ink color on light sections, Paper on dark hero. No max-width constraint — fills available column.

### Geometric Mural Banner
**Role:** Decorative full-bleed section divider between hero and content

Full viewport width, ~200–300px tall. Flat 2D art: circles, rectangles, hexagons, chevrons in saturated palette (indigo #4a4afc, lavender #b8b3ff, teal #c7f8fb, maroon #7a2e2, orange #ff6b2c, emerald #24cb71, yellow #ffe74a). No gradients, no shadows. Edges are hard/rectilinear where blocks meet the canvas.

### Speaker Portrait Card
**Role:** Speaker in the grid

Square portrait image, 0px radius, fills a 4-column grid. Each portrait sits on a solid background color (mint, emerald, indigo, lavender, orange, yellow). Below: name in Figma Sans Text weight 600 at 18px, title/role in Figma Sans Text weight 400 at 16px — both in Ink. 24px gap between portrait and text, 48px between cards vertically.

### Event Status Notice
**Role:** Inline status banner ('Event ended')

Centered or right-aligned block. Small triangular warning icon (~24px, Ink fill) above label. Label in Figma Sans Text weight 600 at 18–24px, subtext at 16px weight 400. Sits on the cyan Mint Wash band.

### Full-Bleed Color Section
**Role:** Horizontal content band with colored background

Edge-to-edge, ~200–400px tall, Paper or Ink text depending on contrast. Internal padding 60px top/bottom, 24–48px left/right. No border, no radius, no shadow.

### Date/Time Metadata Block
**Role:** Event date and time under hero headline

Two lines: bold date (16–18px Figma Sans Text weight 600) above time range (16–18px weight 400). Inherit text color from section (Paper on dark hero). 8–16px gap between lines.

### Grid Section Header
**Role:** Section title block above card grid (e.g., "Meet our speakers!")

Eyebrow label + display headline, left-aligned. 24px gap between label and headline. Sits 48–60px above the grid.

## Do's and Don'ts

### Do
- Use 0px border-radius on all cards, buttons, images, and tags — sharp corners are non-negotiable
- Pair the dark hero with a large outlined button (1px Paper border, no fill); fill it on hover
- Apply Figma Sans Display at 56–86px with -0.02em tracking and 0.90–1.00 line-height for any headline that needs to feel carved
- Reach 0.03em tracking on small labels (13–18px) to give uppercase eyebrows and nav links air
- Alternate full-bleed colored bands (Mint Wash #c7f8fb, Emerald Band #24cb71) between dark and light sections to create visual rhythm
- Use Ash (#e2e2e2) 1px borders for hairline separation; reserve Ink (#0f0f0f) borders for emphasis on light sections
- Keep the UI monochrome — let color appear only in decorative murals and speaker portrait backgrounds, never in controls

### Don't
- Don't add border-radius to any element — sharp corners define the system's poster-like character
- Don't use shadows, glows, or blur effects — flat is the only elevation language here
- Don't introduce a chromatic CTA color — the system is intentionally monochrome, actions are outlined or text-only
- Don't set body text below 16px; captions can go to 13px but never smaller
- Don't let display headlines exceed 0.90–1.00 line-height — tight leading is what makes them feel architectural
- Don't color-fill buttons with brand hues; outlined Paper-on-Obsidian is the only button pattern in the system
- Don't separate light sections with gray bands — use either full-bleed color or seamless Paper-to-Paper flow

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Dark Hero Canvas | `#000000` | Opening fold, sets editorial tone, contains Register CTA and decorative mural |
| 1 | Colored Band | `#c7f8fb` | Cyan section separating hero from content |
| 1 | Colored Band | `#24cb71` | Green section band |
| 2 | Paper | `#ffffff` | Main content canvas for speaker grid and text sections |

## Elevation

Shadowless flat design — separation is achieved through hard edges, color blocks, and 1px hairline borders in Ash (#e2e2e2) or Ink. The absence of shadow is a deliberate editorial choice: every element is printed flat onto the page like a poster, never floating above it.

## Imagery

The site uses bold flat-color geometric illustration as a hero divider: circles, rectangles, hexagons, chevrons, and dots in a saturated palette (indigo, lavender, teal, maroon, orange, emerald, yellow) with hard rectilinear edges and no gradients or shadows. Speaker portraits are desaturated or black-and-white photographs, each placed on a solid color background (mint, emerald, indigo, lavender, orange, yellow) to create a poster-grid effect. Icons are minimal and mono — a single triangular warning glyph is the only iconographic element visible. The overall treatment is editorial-poster: no soft photography, no lifestyle shots, no depth — everything is either flat color, flat type, or a flat photo on flat color.

## Layout

The page follows a top-to-bottom band model. It opens with a full-bleed black hero (centered or left-aligned content block, full-width outlined Register CTA) that bleeds into a ~250px-tall geometric mural banner spanning the viewport width. Below the mural, a light teal (Mint Wash) band holds the secondary 'Join us virtually!' CTA and an event status notice, followed by a bright green (Emerald Band) strip. The page then resolves into a max-width 1200px white content area with 60px vertical section gaps, opening with a left-aligned section header (eyebrow + display headline) above a 4-column grid of speaker cards. Navigation is a minimal top bar — logo left, 2 text links right, transparent on the dark hero and Paper on light sections. There is no sidebar, no sticky header beyond the nav, and no modal overlays.

## Agent Prompt Guide

**Quick Color Reference**
- text on light: #0f0f0f (Ink)
- text on dark hero: #ffffff (Paper)
- page background: #ffffff (Paper)
- hero background: #000000 (Obsidian)
- hairline borders: #e2e2e2 (Ash)
- accent section band 1: #c7f8fb (Mint Wash)
- accent section band 2: #24cb71 (Emerald Band)
- primary action: no distinct CTA color

**Example Component Prompts**

1. **Dark hero with outlined Register button**: Full-bleed Obsidian (#000000) background, left-aligned content with 60px horizontal padding. Eyebrow 'VIRTUAL' at 13px Figma Sans Text weight 400, uppercase, tracking 0.03em, Paper color. Headline 'Schema by Figma' at 72px Figma Sans Display weight 400, line-height 0.90, letter-spacing -1.44px, Paper. Date/time block at 18px Figma Sans Text, Paper, 16px gap between lines. Register button: full-width within content column, 64px tall, 1px Paper border, 0px radius, no fill, 'Register' at 24px Figma Sans Text weight 400 centered, Paper text.

2. **Speaker card in a 4-column grid**: 0px radius portrait image, 1:1 aspect ratio, placed on a solid lavender (#b8b3ff) background. 24px gap below portrait, then name 'Loredana Crisan' at 18px Figma Sans Text weight 600 in Ink, title 'Chief Design Officer / Figma' at 16px weight 400 in Ink with 4px line gap. Cards separated by 48px vertical and 24px horizontal gaps; grid sits inside a 1200px max-width container with 60px section padding above.

3. **Geometric mural divider**: Full-bleed, 250px tall, no padding. Layer flat shapes: 200px indigo (#4a4afc) circle bottom-left, 120px lavender (#b8b3ff) rectangle top-center, 80px maroon (#7a2e2e) hexagon right-center on a 120px mint (#c7f8fb) square, 60px orange (#ff6b2c) circle far right, 180px emerald (#24cb71) rectangle bottom-right. No gradients, no shadows, no border-radius.

4. **Light section header**: Paper background. Eyebrow 'SPEAKERS' at 13px Figma Sans Text weight 600, uppercase, tracking 0.03em, Ink color. 16px gap to headline 'Meet our speakers!' at 56px Figma Sans Display weight 400, line-height 1.00, letter-spacing -1.12px, Ink. 60px gap below to grid.

5. **Event status notice on colored band**: Mint Wash (#c7f8fb) full-bleed section, 60px vertical padding, right-aligned content block. 24px Ink triangular warning icon, 16px gap, label 'Event ended' at 18px Figma Sans Text weight 600 Ink, subtext 'This event has already ended.' at 16px weight 400 Ink.

## Similar Brands

- **Config (Figma's annual conference)** — Same Figma Sans Display typography at hero scale, same poster-mural art style, same monochrome UI with full-bleed colored bands
- **Apple Event pages** — Black hero with large outlined CTA, editorial display type at extreme scale, full-bleed color band transitions between sections
- **Figma Config 2022–2024 microsites** — Identical geometric flat-color illustration system and Figma Sans pairing, with speaker portraits on solid color backgrounds
- **Are.na event pages** — Editorial-poster layout, sharp 0px corners, monochrome UI punctuated by bold flat-color section bands
- **It's Nice That conference coverage** — Design-zine aesthetic with oversized display headlines, tight tracking, and full-bleed decorative color blocks

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-obsidian: #000000;
  --color-ink: #0f0f0f;
  --color-paper: #ffffff;
  --color-ash: #e2e2e2;
  --color-mint-wash: #c7f8fb;
  --color-emerald-band: #24cb71;

  /* Typography — Font Families */
  --font-source-sans-pro: 'Source Sans Pro', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-figma-sans-display: 'Figma Sans Display', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-figma-sans-text: 'Figma Sans Text', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-figma-mono: 'Figma Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-figma-vf-normal-700-75: 'Figma VF-normal-700-75', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-figma-vf-normal-400-100: 'Figma VF-normal-400-100', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 13px;
  --leading-caption: 1.2;
  --tracking-caption: -0.26px;
  --text-body: 16px;
  --leading-body: 1.2;
  --text-body-md: 18px;
  --leading-body-md: 1.22;
  --tracking-body-md: 0.54px;
  --text-subheading: 24px;
  --leading-subheading: 1.2;
  --tracking-subheading: -0.24px;
  --text-heading-sm: 32px;
  --leading-heading-sm: 1.1;
  --tracking-heading-sm: -0.32px;
  --text-heading: 56px;
  --leading-heading: 1;
  --tracking-heading: -1.12px;
  --text-heading-lg: 72px;
  --leading-heading-lg: 0.9;
  --tracking-heading-lg: -1.44px;
  --text-display: 86px;
  --leading-display: 0.9;
  --tracking-display: -1.72px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 8px;
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-120: 120px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 60px;
  --card-padding: 16px;
  --element-gap: 24px;

  /* Border Radius */
  --radius-2xl: 20px;

  /* Named Radii */
  --radius-tags: 0px;
  --radius-cards: 0px;
  --radius-buttons: 0px;
  --radius-speaker-images: 0px;

  /* Surfaces */
  --surface-dark-hero-canvas: #000000;
  --surface-colored-band: #c7f8fb;
  --surface-colored-band: #24cb71;
  --surface-paper: #ffffff;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-obsidian: #000000;
  --color-ink: #0f0f0f;
  --color-paper: #ffffff;
  --color-ash: #e2e2e2;
  --color-mint-wash: #c7f8fb;
  --color-emerald-band: #24cb71;

  /* Typography */
  --font-source-sans-pro: 'Source Sans Pro', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-figma-sans-display: 'Figma Sans Display', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-figma-sans-text: 'Figma Sans Text', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-figma-mono: 'Figma Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-figma-vf-normal-700-75: 'Figma VF-normal-700-75', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-figma-vf-normal-400-100: 'Figma VF-normal-400-100', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 13px;
  --leading-caption: 1.2;
  --tracking-caption: -0.26px;
  --text-body: 16px;
  --leading-body: 1.2;
  --text-body-md: 18px;
  --leading-body-md: 1.22;
  --tracking-body-md: 0.54px;
  --text-subheading: 24px;
  --leading-subheading: 1.2;
  --tracking-subheading: -0.24px;
  --text-heading-sm: 32px;
  --leading-heading-sm: 1.1;
  --tracking-heading-sm: -0.32px;
  --text-heading: 56px;
  --leading-heading: 1;
  --tracking-heading: -1.12px;
  --text-heading-lg: 72px;
  --leading-heading-lg: 0.9;
  --tracking-heading-lg: -1.44px;
  --text-display: 86px;
  --leading-display: 0.9;
  --tracking-display: -1.72px;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-120: 120px;

  /* Border Radius */
  --radius-2xl: 20px;
}
```
