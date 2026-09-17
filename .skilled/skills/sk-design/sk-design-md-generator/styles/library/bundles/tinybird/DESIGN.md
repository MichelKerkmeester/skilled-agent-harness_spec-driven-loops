# Tinybird — Style Reference
> developer terminal at midnight — black void, one electric green cursor, monospace whispers

**Theme:** dark

Tinybird is a dark-mode developer console aesthetic: near-black canvas, one electric green accent that acts as the only chromatic voice on screen, and a strict division between humanist Roboto for prose and monospaced Roboto Mono for tags, labels, and code. The interface reads as terminal-grade — monospace badges sit inside square brackets like log entries, and the green accent behaves like a blinking cursor rather than a brand color, used sparingly for CTAs, links, and the occasional inline highlight. Surfaces are flat, borders are hairline, and elevation is achieved through subtle dark-to-darker layering rather than shadows. The result is a product page that feels engineered rather than marketed, confident in its restraint.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Cursor Green | `#27f795` | `--color-cursor-green` | Green supporting accent for decorative details and low-frequency emphasis. Do not promote it to the primary CTA color |
| Hover Green | `#008060` | `--color-hover-green` | Green supporting accent for decorative details and low-frequency emphasis. Do not promote it to the primary CTA color |
| Terminal Red | `#800000` | `--color-terminal-red` | Red supporting accent for decorative details and low-frequency emphasis. Use as a supporting accent, not as a status color |
| Pure White | `#ffffff` | `--color-pure-white` | Primary text and headlines. Maximum contrast against the near-black canvas for immediate legibility |
| Void Black | `#000000` | `--color-void-black` | Deepest surface layer for hero backgrounds and video poster frames, one step darker than the page canvas |
| Console Black | `#0a0a0a` | `--color-console-black` | Primary page canvas — the dominant background of every screen. A hair above true black to soften OLED contrast |
| Panel Charcoal | `#151515` | `--color-panel-charcoal` | First elevated surface — used for embedded media frames and video containers that need to sit above the page canvas |
| Card Graphite | `#262626` | `--color-card-graphite` | Testimonial and content card backgrounds. Two steps above the canvas, enough lift to separate without casting shadow |
| Border Smoke | `#353535` | `--color-border-smoke` | Hairline borders, input fields, and dividers. Defines component edges without competing with content |
| Muted Ash | `#8d8d8d` | `--color-muted-ash` | Secondary body text, descriptions, and sub-labels — the voice for anything supporting but not starring in the hierarchy |
| Tertiary Fog | `#999999` | `--color-tertiary-fog` | Tertiary text and disabled-state labels. The faintest human voice before falling into silence |
| Highlight Mist | `#d9d9d9` | `--color-highlight-mist` | Bright border accent used on emphasized outlined elements like the active workflow step |

## Tokens — Typography

### Roboto — Prose and headlines. Weight 400 for body and descriptions, weight 600 for primary CTA button text, weight 700 reserved for the 64px display headline. The tight negative tracking at 64px tightens the headline into a single confident block. · `--font-roboto`
- **Substitute:** Inter, system-ui, sans-serif
- **Weights:** 400, 600, 700
- **Sizes:** 12, 14, 16, 18, 24, 64
- **Line height:** 1.13, 1.33, 1.50, 1.57, 1.67, 1.78
- **Letter spacing:** -0.0200em at 64px (display), -0.0130em at 24px (heading)
- **Role:** Prose and headlines. Weight 400 for body and descriptions, weight 600 for primary CTA button text, weight 700 reserved for the 64px display headline. The tight negative tracking at 64px tightens the headline into a single confident block.

### Roboto Mono — Tags, badges, code labels, workflow step indicators, and monospaced stat figures. The extreme -0.084em tracking at 56px is anti-convention — monospace usually stays loose, but this tightens the digits into a dense data block that feels engineered, not displayed. · `--font-roboto-mono`
- **Substitute:** JetBrains Mono, IBM Plex Mono, monospace
- **Weights:** 400
- **Sizes:** 12, 14, 16, 56
- **Line height:** 1.00, 1.50, 1.57, 1.67
- **Letter spacing:** -0.0840em
- **Role:** Tags, badges, code labels, workflow step indicators, and monospaced stat figures. The extreme -0.084em tracking at 56px is anti-convention — monospace usually stays loose, but this tightens the digits into a dense data block that feels engineered, not displayed.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.57 | — | `--text-caption` |
| body-sm | 14px | 1.57 | — | `--text-body-sm` |
| body | 16px | 1.67 | — | `--text-body` |
| subheading | 18px | 1.5 | — | `--text-subheading` |
| heading-sm | 24px | 1.33 | -0.31px | `--text-heading-sm` |
| stat-figure | 56px | 1 | -4.7px | `--text-stat-figure` |
| display | 64px | 1.13 | -1.28px | `--text-display` |

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
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 56 | 56px | `--spacing-56` |
| 64 | 64px | `--spacing-64` |
| 72 | 72px | `--spacing-72` |
| 152 | 152px | `--spacing-152` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 4px |
| cards | 8px |
| buttons | 4px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 24px
- **Element gap:** 16px

## Components

### Primary CTA Button
**Role:** Filled button for the single most important action on a screen

Background #27f795 (Cursor Green), text #000000 or #0a0a0a, Roboto weight 600 at 16px, 4px radius, 12px vertical and 24px horizontal padding. This is the only filled button in the system — every other interactive element is ghost or text. The green fill is the visual equivalent of a blinking cursor.

### Ghost Link Button
**Role:** Secondary action that sits beside the primary CTA

No background, text #27f795, Roboto weight 400 at 16px, no border, no radius. Reads as a text link with cursor affordance — a quieter companion to the filled CTA.

### Navigation Header
**Role:** Persistent top bar with product links and auth actions

Transparent background over the #0a0a0a canvas. Logo (bird mark + 'tinybird' wordmark) on the left in white at 14px weight 700. Center nav items in white at 14px weight 400. Right side: ghost 'Sign in' text link in #27f795, followed by a filled 'Sign up' button using the Primary CTA style at compact 10px vertical and 16px horizontal padding.

### Bracket Workflow Tag
**Role:** Step indicator in workflow sequences

No background, Roboto Mono weight 400 at 12px, color #27f795 for active step and #8d8d8d for inactive steps. Wrapped in literal square brackets: [Get Started] [Develop] [Ingest] [Query] [Monitor] [Iterate]. Pipe characters separate steps. This is the signature micro-component — it makes the interface feel like a log output.

### Category Tag
**Role:** Topical classification badge

1px border in #353535 (Border Smoke), transparent background, Roboto Mono weight 400 at 12px, text #d9d9d9, 4px radius, 4px vertical and 12px horizontal padding. Used in the hero to categorize use cases like 'SaaS / Dashboards', 'Observability', 'AI Analytics'.

### Stat Card
**Role:** Hero metric display

Large Roboto Mono figure at 56px weight 400 in #27f795, tracked at -0.084em to compress digits into a dense block. Adjacent label in Roboto Mono at 12px in #8d8d8d, uppercase. No card chrome — sits directly on the canvas.

### Testimonial Card
**Role:** Social proof block in 3-column grid

Background #262626 (Card Graphite), 8px radius, 24px padding all sides. 40px circular avatar at top-left, name in Roboto weight 600 at 14px in #ffffff, title and company in #8d8d8d at 12px. Quote body in Roboto weight 400 at 14px in #d9d9d9. 1px border in #353535 for definition against the slightly lighter card surface.

### Hero Section
**Role:** Above-the-fold headline and CTA

Centered layout on #0a0a0a. Headline at 64px Roboto weight 700 in #ffffff, tracked at -0.020em, line-height 1.13. Subtext at 18px Roboto weight 400 in #8d8d8d. Primary CTA and ghost link side by side with 16px gap. Category tags below with 8px gap.

### Logo Bar
**Role:** Partner or customer logo strip

Single row of 7–8 grayscale logos centered, separated by 40px gap, inside a card with #262626 background and 1px #353535 border. Logos rendered in #8d8d8d to recede — they are evidence, not heroes.

### Video Embed Frame
**Role:** Full-width media container for demos

Background #151515 (Panel Charcoal), 1px border in #353535, no radius. Circular play button centered at 64px diameter, #353535 fill with white triangle icon. Frame extends edge-to-edge within its container with no internal padding — the video is the content.

### Data Hero Band
**Role:** Promotional strip combining social proof and live metrics

Inline composition on the canvas: partner attribution (small avatar + name) in #8d8d8d, followed by a description sentence with the phrase '30M requests/day' highlighted in #27f795. Below, a two-column split: left column has stacked stat figures in Cursor Green, right column has a white-quote testimonial block.

## Do's and Don'ts

### Do
- Use #27f795 fill only for the single most important action per screen — one filled CTA, everything else ghost or text.
- Wrap workflow steps and inline labels in square brackets rendered in Roboto Mono to maintain the terminal-log aesthetic.
- Use Roboto Mono for all numerics, stats, and tag labels; use Roboto only for prose, descriptions, and headlines.
- Set headline tracking to -0.020em at 64px and stat-figure tracking to -0.084em at 56px to compress type into dense, confident blocks.
- Build surface hierarchy through four levels of charcoal (0a0a0a → 151515 → 262626 → 353535) rather than drop shadows.
- Keep all borders at exactly 1px in #353535 — the system is defined by hairline edges, not weight.
- Use 4px radius for buttons and 8px radius for cards — no larger radii anywhere.

### Don't
- Do not introduce any color outside the palette — the system is achromatic plus one green, and adding a second chromatic voice breaks the terminal metaphor.
- Do not use filled buttons with neutral or white backgrounds — the only fill color is #27f795, and only for primary actions.
- Do not use Roboto for tags, labels, or code — these must stay in Roboto Mono to preserve the developer-tool identity.
- Do not use shadows or glows to create elevation — the design achieves layering through surface darkness, never drop shadows.
- Do not use radii larger than 8px — anything rounder would feel consumer-friendly and break the engineered feel.
- Do not use the red #800000 as an error state — it is a quiet inline accent, not a semantic signal.
- Do not left-align hero content — the centered headline with tight tracking is the signature opener.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Void | `#000000` | Deepest surface for hero bands and full-bleed media frames |
| 1 | Console | `#0a0a0a` | Primary page canvas across all sections |
| 2 | Panel | `#151515` | Embedded media containers, video posters |
| 3 | Card | `#262626` | Testimonial and content card backgrounds |
| 4 | Edge | `#353535` | Borders, input fields, subtle dividers |

## Elevation

- **Card on Canvas:** `none — achieved through #262626 surface against #0a0a0a canvas`
- **Testimonial Card:** `none — 1px #353535 border on #262626 surface`
- **Video Frame:** `none — 1px #353535 border on #151515 surface`

## Imagery

Visuals are minimal and functional. The only photographic content is small circular avatar portraits in testimonial cards (40px, tightly cropped to face). The primary visual artifact is a full-bleed video demo frame rendered as a flat charcoal panel with a centered play button — no thumbnail, no preview. Partner logos in the logo bar are desaturated to #8d8d8d monochrome, presenting social proof as evidence rather than endorsement. No illustrations, no 3D renders, no decorative graphics. The green accent does the visual work that ornament would do elsewhere.

## Layout

Max-width 1200px centered content on a full-bleed #0a0a0a canvas. The page follows a vertical rhythm of full-width sections separated by 80px gaps, with no alternating light/dark bands — every section shares the same dark canvas. Each section is centered text-first, with the hero using a centered stack (headline → subtext → CTA pair → tag row) and subsequent sections alternating between centered text blocks and 3-column card grids. Navigation is a minimal transparent top bar with no sticky shadow. Content density is comfortable rather than dense — large vertical breathing room and centered compositions create a stage for the single green accent.

## Agent Prompt Guide

## Quick Color Reference

- text: #ffffff (primary), #8d8d8d (secondary), #999999 (tertiary)
- background: #0a0a0a (page canvas), #262626 (cards), #151515 (panels)
- border: #353535 (hairline), #d9d9d9 (emphasis)
- accent: #27f795 (Cursor Green — links, tags, highlights)
- primary action: no distinct CTA color

## 3 Example Component Prompts

No distinct primary action color was observed; use the extracted neutral button treatments instead of inventing a filled CTA color.

2. **Create a testimonial grid**: 3-column grid on #0a0a0a canvas, 24px column gap, 40px row gap. Each card: #262626 background, 8px radius, 1px #353535 border, 24px padding. 40px circular avatar top-left. Name in Roboto weight 600 14px #ffffff, title in 12px #8d8d8d, quote in 14px #d9d9d9. Section gap above: 80px.

3. **Create a stat display**: Two-column layout on #0a0a0a. Left column: stacked stat figures in Roboto Mono 56px weight 400, #27f795, letter-spacing -4.7px, line-height 1.00. Adjacent labels in Roboto Mono 12px uppercase, #8d8d8d. Right column: quote block with 1px left border in #27f795, body text in Roboto 16px #d9d9d9.

## Similar Brands

- **Vercel** — Same black-canvas developer-tool aesthetic with a single chromatic accent and geometric sans-serif headlines, though Vercel uses white accents where Tinybird uses green
- **Railway** — Dark-mode infrastructure product page with monospace labels and flat surface layering, though Railway leans more purple than green
- **PlanetScale** — Terminal-grade dark interface with monospace stat figures and flat card hierarchy, though PlanetScale uses a broader gradient palette
- **Supabase** — Dark developer-tool product page with a single vivid accent color (green for Supabase) and monospace tag badges

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-cursor-green: #27f795;
  --color-hover-green: #008060;
  --color-terminal-red: #800000;
  --color-pure-white: #ffffff;
  --color-void-black: #000000;
  --color-console-black: #0a0a0a;
  --color-panel-charcoal: #151515;
  --color-card-graphite: #262626;
  --color-border-smoke: #353535;
  --color-muted-ash: #8d8d8d;
  --color-tertiary-fog: #999999;
  --color-highlight-mist: #d9d9d9;

  /* Typography — Font Families */
  --font-roboto: 'Roboto', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-roboto-mono: 'Roboto Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.57;
  --text-body-sm: 14px;
  --leading-body-sm: 1.57;
  --text-body: 16px;
  --leading-body: 1.67;
  --text-subheading: 18px;
  --leading-subheading: 1.5;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.33;
  --tracking-heading-sm: -0.31px;
  --text-stat-figure: 56px;
  --leading-stat-figure: 1;
  --tracking-stat-figure: -4.7px;
  --text-display: 64px;
  --leading-display: 1.13;
  --tracking-display: -1.28px;

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
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-64: 64px;
  --spacing-72: 72px;
  --spacing-152: 152px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 24px;
  --element-gap: 16px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;

  /* Named Radii */
  --radius-tags: 4px;
  --radius-cards: 8px;
  --radius-buttons: 4px;

  /* Surfaces */
  --surface-void: #000000;
  --surface-console: #0a0a0a;
  --surface-panel: #151515;
  --surface-card: #262626;
  --surface-edge: #353535;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-cursor-green: #27f795;
  --color-hover-green: #008060;
  --color-terminal-red: #800000;
  --color-pure-white: #ffffff;
  --color-void-black: #000000;
  --color-console-black: #0a0a0a;
  --color-panel-charcoal: #151515;
  --color-card-graphite: #262626;
  --color-border-smoke: #353535;
  --color-muted-ash: #8d8d8d;
  --color-tertiary-fog: #999999;
  --color-highlight-mist: #d9d9d9;

  /* Typography */
  --font-roboto: 'Roboto', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-roboto-mono: 'Roboto Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.57;
  --text-body-sm: 14px;
  --leading-body-sm: 1.57;
  --text-body: 16px;
  --leading-body: 1.67;
  --text-subheading: 18px;
  --leading-subheading: 1.5;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.33;
  --tracking-heading-sm: -0.31px;
  --text-stat-figure: 56px;
  --leading-stat-figure: 1;
  --tracking-stat-figure: -4.7px;
  --text-display: 64px;
  --leading-display: 1.13;
  --tracking-display: -1.28px;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-64: 64px;
  --spacing-72: 72px;
  --spacing-152: 152px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
}
```
