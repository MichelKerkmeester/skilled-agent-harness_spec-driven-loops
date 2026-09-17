# Hyperstudio — Style Reference
> blueprint scratched into obsidian. Type and hairline borders carve white space from pure black, with the occasional gold compass-mark to show the way.

**Theme:** dark

Hyperstudio runs on a near-black canvas where everything is carved out by light. The aesthetic is editorial-tech: a deep matte black background (#101010), crisp off-white type (#f3f3f3), hairline 1px borders (#212121), and the occasional warm gold or signal-green dot for punctuation. Typography does the heavy lifting — oversized 400-weight headlines with aggressive negative tracking create a quiet, confident voice, never shouting. Components are reduced to their skeleton: outlined buttons, ghost pills, thin dividers, no shadows, no fills beyond a single white pill for primary actions. The whole system feels like a wireframe rendered in light on obsidian — restrained, precise, and deliberate.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Obsidian | `#101010` | `--color-obsidian` | Page canvas, full-bleed dark background |
| Carbon | `#080808` | `--color-carbon` | Deepest surface level, hero band, and overlay backgrounds |
| Chalk | `#f3f3f3` | `--color-chalk` | Primary text, headings, and body copy on dark surfaces |
| Smoke | `#9c9c9c` | `--color-smoke` | Secondary muted text, captions, helper labels |
| Ash | `#c1c1c1` | `--color-ash` | Mid-weight borders, subtle dividers, tertiary text |
| Graphite | `#212121` | `--color-graphite` | Primary 1px border color for cards, grids, and section dividers — the structural line work |
| Iron | `#474747` | `--color-iron` | Secondary border and stroke detail |
| Signal White | `#ffffff` | `--color-signal-white` | Filled pill buttons (LET'S CHAT, START NOW), inverted text on light surfaces, icon strokes — the single high-contrast action color |
| Compass Gold | `#6f6759` | `--color-compass-gold` | Outlined icon strokes in service and portfolio sections — warm metallic against the cool dark |
| Card Slate | `#3b3d45` | `--color-card-slate` | Card and panel border accent on elevated sections |

## Tokens — Typography

### Aeonik — Primary typeface for everything — display headlines, body, buttons, links. Weight 400 across all sizes is signature: no bold shouting, authority through scale and tracking alone. · `--font-aeonik`
- **Substitute:** Inter, Satoshi, or General Sans
- **Weights:** 400, 700
- **Sizes:** 13px, 14px, 16px, 17px, 18px, 21px, 23px, 34px, 44px, 63px
- **Line height:** 0.95–1.43 (tight at display sizes, breathing at body)
- **Letter spacing:** -0.0110em at 63px, -0.0070em at 44px, default at body
- **OpenType features:** `'ss01' on, 'cv11' on`
- **Role:** Primary typeface for everything — display headlines, body, buttons, links. Weight 400 across all sizes is signature: no bold shouting, authority through scale and tracking alone.

### Input — Secondary typeface for meta text, labels, and small captions. Tighter tracking (-0.037em at 8px, -0.022em at 18px) gives it a utilitarian, almost monospace feel — used for status pills, section metadata, and fine print. · `--font-input`
- **Substitute:** IBM Plex Mono, JetBrains Mono, or Space Mono
- **Weights:** 400
- **Sizes:** 8px, 13px, 14px, 16px, 17px, 18px
- **Line height:** 1.20–1.54
- **Letter spacing:** -0.0370em, -0.0220em
- **Role:** Secondary typeface for meta text, labels, and small captions. Tighter tracking (-0.037em at 8px, -0.022em at 18px) gives it a utilitarian, almost monospace feel — used for status pills, section metadata, and fine print.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 13px | 2.69 | — | `--text-caption` |
| body | 16px | 1.25 | — | `--text-body` |
| heading-xs | 18px | 1.31 | — | `--text-heading-xs` |
| subheading | 21px | 0.95 | — | `--text-subheading` |
| heading-sm | 23px | 1.07 | — | `--text-heading-sm` |
| heading | 34px | 1.03 | — | `--text-heading` |
| heading-lg | 44px | 1.07 | -0.31px | `--text-heading-lg` |
| display | 63px | 1.05 | -0.69px | `--text-display` |

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
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 40 | 40px | `--spacing-40` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 4px |
| cards | 8px |
| icons | 99px |
| buttons | 9999px (pills) |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 120-210px
- **Card padding:** 32-48px
- **Element gap:** 20-24px

## Components

### White Pill Button (Primary Action)
**Role:** Filled button for highest-priority CTAs like START NOW and LET'S CHAT

Solid white (#ffffff) fill, Obsidian (#101010) text, 9999px border-radius, 12px 24px padding, Aeonik 14px weight 400 uppercase. Small icon or arrow glyph right-aligned. No shadow — contrast alone creates elevation.

### Ghost Outline Button (Secondary)
**Role:** Secondary CTA placed beside primary actions

Transparent background, 1px white (#ffffff) border, white text, 8px radius (not fully pill), 10px 20px padding, Aeonik 14px weight 400 uppercase. Used for VIEW WORK and similar secondary flows.

### Status Badge (Pill)
**Role:** Inline availability/scarcity indicator (e.g. '2/5 SPOTS LEFT FOR JULY')

Dark card background (#1a1a1a), 1px Graphite (#212121) border, 4px radius, 8px 14px padding. Small Pulse Green (#98ff38) dot prefix. Text in Aeonik 12px weight 400, Smoke (#9c9c9c) color, uppercase tracking.

### Service Card (2×2 Grid Cell)
**Role:** Displays a single service offering in the services section

Transparent background, 1px Graphite (#212121) border on bottom and sides (no top border to merge with section divider). Compass Gold (#6f6759) outlined icon at top-left, 32px. Heading in Aeonik 14px weight 400 uppercase Chalk (#f3f3f3), body in Aeonik 14px weight 400 Smoke (#9c9c9c). 48px padding all sides.

### Portfolio Card
**Role:** Showcases a client project thumbnail in the portfolio grid

No background fill, 1px Graphite (#212121) border or divider line, 8px radius. Small outlined client icon centered, client name in Aeonik 16px weight 400 Chalk, category label in Input 13px uppercase Smoke. Tight vertical padding 24px.

### Section Divider Line
**Role:** Separates page sections horizontally

1px solid Graphite (#212121) stroke spanning full content width. The single most repeated visual element — it IS the page structure. No gradients, no fades, no decorative breaks.

### Top Navigation Bar
**Role:** Persistent site header with brand, nav links, and CTA

Transparent background floating over Obsidian canvas. Left: 'Hyperstudio' wordmark in Aeonik 18px weight 400 Chalk. Center-left: nav links (SERVICES, PORTFOLIO, PROCESS) in Aeonik 14px weight 400 uppercase Smoke with 24px gaps. Right: outlined 'LET'S CHAT' pill button. 1px Graphite bottom border.

### Headline Display Block
**Role:** Hero and section opener typography

Aeonik 63px weight 400 Chalk (#f3f3f3), line-height 1.05, letter-spacing -0.69px. Centered or left-aligned. No color, no decoration — the size and tracking do all the work. Followed by a compact sub-headline in Aeonik 21px weight 400 Smoke.

### Dot-Map World Graphic
**Role:** Decorative hero visual — a pixelated globe rendered in white dots

Full-width illustration of a world map composed of small white (#f3f3f3) circular dots on the Obsidian canvas. No stroke, no fill — just dot density defining continents. Serves as atmospheric proof of global reach without literal photography.

### Manifesto Text Block
**Role:** Centered narrative text in the 'Why Hyperstudio?' section

Max-width 600px centered. Aeonik 23px weight 400 Chalk for the section title, Aeonik 16px weight 400 Smoke for body paragraphs, generous 24px line-height. Ghost outline 'READ MANIFESTO' button below.

### Outlined Icon Set
**Role:** All UI icons across the page

1.5px stroke, no fill, Compass Gold (#6f6759) or Chalk (#f3f3f3) color, 24–32px size. Geometric and minimal — pen nib, open book, monitor, waveform. The gold tint against black gives them a compass-rose quality.

### Footer / Bottom Bar
**Role:** Closes the page with contact or site info

1px Graphite top border, transparent background. Small Aeonik 14px Chalk text for email (hello@hyperstudio.org), Input 13px Smoke for secondary links. No background fill, no padding beyond 32px vertical.

## Do's and Don'ts

### Do
- Use weight 400 for all headings — never bold. Scale and tracking carry hierarchy, not weight.
- Separate every section with a 1px #212121 hairline rule. No background color shifts between sections.
- Use 9999px radius only on filled white pill buttons. Everything else stays at 4px or 8px.
- Set display type at 63px Aeonik weight 400 with letter-spacing -0.69px. This is the voice of the system.
- Use #6f6759 Compass Gold exclusively for icon strokes — never for text or backgrounds.
- Apply a Pulse Green (#98ff38) dot only for live/active status indicators like availability counts.
- Keep all body text in #9c9c9c Smoke. Never use pure #808080 — the slight warm tilt matters.

### Don't
- Never add drop shadows. Elevation comes from hairline borders and color contrast alone.
- Never use bold or semibold weight on display type. Weight 400 at 63px IS the headline.
- Never use a colored fill behind text. The canvas stays Obsidian or Carbon throughout.
- Never use fully rounded corners on cards. 8px maximum — the system is architectural, not soft.
- Never place icons in any color other than Compass Gold or Chalk. No blue, no green, no multicolor.
- Never use photography as hero or section content. Dot-maps, icons, and type are the only visuals.
- Never break the 1200px content column. Full-bleed is reserved for the canvas and the dot-map graphic.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Obsidian Canvas | `#101010` | Base page background — the default state |
| 1 | Carbon Depth | `#080808` | Hero band, card surface elevation, overlay depth |
| 2 | Hairline Grid | `#212121` | 1px border lines that define cards, sections, and structure |

## Elevation

No drop shadows. Elevation is achieved through a single mechanism: hairline 1px Graphite (#212121) borders that trace the perimeter of every container. The only 'lift' on the page is a white-filled pill button — and that lift comes from color contrast, not shadow. This keeps the system flat, architectural, and fast.

## Imagery

Near-zero photography. The only imagery is the dot-matrix world map on the hero — white circular dots on black forming continents through density alone. No product shots, no team photos, no client logos as photography. Icons are the only recurring graphic motif: thin 1.5px outlined strokes in Compass Gold or Chalk, geometric and minimal (pen, book, monitor, waveform). The visual system treats whitespace and type as the primary content; imagery is decorative atmosphere, not explanatory.

## Layout

Full-bleed Obsidian canvas, content constrained to a 1200px max-width centered column. Hero is a centered headline stack with a dot-map world graphic spanning the full viewport width below. Sections are separated exclusively by 1px Graphite horizontal dividers — no alternating bands, no background shifts. The services section uses a 2×2 grid inside a bordered frame. The 'Why Hyperstudio?' block is a narrow centered column. Navigation is a transparent top bar with no sticky behavior visible. Spacing is generous — 120–210px between sections — creating a slow, editorial vertical rhythm rather than a dense product layout.

## Agent Prompt Guide

primary action: no distinct CTA color
## Quick Color Reference
- Canvas: #101010
- Primary text: #f3f3f3
- Muted text: #9c9c9c
- Border: #212121
- Icon stroke: #6f6759
- Primary action (filled pill): #ffffff background with #101010 text

## Example Component Prompts
1. **Hero headline block**: Obsidian (#101010) background. Headline at 63px Aeonik weight 400, color #f3f3f3, letter-spacing -0.69px, line-height 1.05. Below it a filled white pill button (#ffffff fill, #101010 text, 9999px radius, 12px 24px padding, Aeonik 14px uppercase) labeled 'START NOW ↗'.

2. **Service grid cell**: Transparent background, 1px bottom border in #212121. Compass Gold (#6f6759) outlined icon at 32px top-left. Heading in Aeonik 14px weight 400 uppercase #f3f3f3, 16px margin-top. Body in Aeonik 14px #9c9c9c, 8px line-height increase.

3. **Status pill badge**: Background #1a1a1a, 1px #212121 border, 4px radius, 8px 14px padding. Pulse Green (#98ff38) 6px dot prefix. Text in Aeonik 12px uppercase #9c9c9c, letter-spacing 0.5px.

4. **Section divider**: Full-width 1px solid #212121 line, 0 margin top and bottom — the line IS the layout.

5. **Manifesto block**: Centered, max-width 600px. Title at 23px Aeonik weight 400 #f3f3f3. Body at 16px Aeonik weight 400 #9c9c9c, line-height 1.5. Ghost outline button below: transparent fill, 1px #ffffff border, 8px radius, #ffffff text, Aeonik 14px uppercase.

## Similar Brands

- **Resn** — Same near-black canvas with large-weight-400 type and the world-is-our-canvas dot/illustration energy
- **Active Theory** — Dark-mode studio site with oversized quiet headlines, minimal UI chrome, and editorial section spacing
- **Locomotive (studio)** — Obsidian background, Aeonik-adjacent geometric sans, ghost-outline buttons, and the 'wireframe in light' visual philosophy
- **Pentagram** — Editorial typography discipline — weight 400 at 63px, aggressive negative tracking, sections divided by hairline rules rather than color bands
- **Ueno** — Dark agency site with single-color icon system, generous section gaps, and type as the dominant visual element

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-obsidian: #101010;
  --color-carbon: #080808;
  --color-chalk: #f3f3f3;
  --color-smoke: #9c9c9c;
  --color-ash: #c1c1c1;
  --color-graphite: #212121;
  --color-iron: #474747;
  --color-signal-white: #ffffff;
  --color-compass-gold: #6f6759;
  --color-card-slate: #3b3d45;

  /* Typography — Font Families */
  --font-aeonik: 'Aeonik', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-input: 'Input', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 13px;
  --leading-caption: 2.69;
  --text-body: 16px;
  --leading-body: 1.25;
  --text-heading-xs: 18px;
  --leading-heading-xs: 1.31;
  --text-subheading: 21px;
  --leading-subheading: 0.95;
  --text-heading-sm: 23px;
  --leading-heading-sm: 1.07;
  --text-heading: 34px;
  --leading-heading: 1.03;
  --text-heading-lg: 44px;
  --leading-heading-lg: 1.07;
  --tracking-heading-lg: -0.31px;
  --text-display: 63px;
  --leading-display: 1.05;
  --tracking-display: -0.69px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-40: 40px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 120-210px;
  --card-padding: 32-48px;
  --element-gap: 20-24px;

  /* Border Radius */
  --radius-md: 4.5px;
  --radius-lg: 8px;
  --radius-2xl: 20px;
  --radius-full: 99px;

  /* Named Radii */
  --radius-tags: 4px;
  --radius-cards: 8px;
  --radius-icons: 99px;
  --radius-buttons: 9999px (pills);

  /* Surfaces */
  --surface-obsidian-canvas: #101010;
  --surface-carbon-depth: #080808;
  --surface-hairline-grid: #212121;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-obsidian: #101010;
  --color-carbon: #080808;
  --color-chalk: #f3f3f3;
  --color-smoke: #9c9c9c;
  --color-ash: #c1c1c1;
  --color-graphite: #212121;
  --color-iron: #474747;
  --color-signal-white: #ffffff;
  --color-compass-gold: #6f6759;
  --color-card-slate: #3b3d45;

  /* Typography */
  --font-aeonik: 'Aeonik', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-input: 'Input', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 13px;
  --leading-caption: 2.69;
  --text-body: 16px;
  --leading-body: 1.25;
  --text-heading-xs: 18px;
  --leading-heading-xs: 1.31;
  --text-subheading: 21px;
  --leading-subheading: 0.95;
  --text-heading-sm: 23px;
  --leading-heading-sm: 1.07;
  --text-heading: 34px;
  --leading-heading: 1.03;
  --text-heading-lg: 44px;
  --leading-heading-lg: 1.07;
  --tracking-heading-lg: -0.31px;
  --text-display: 63px;
  --leading-display: 1.05;
  --tracking-display: -0.69px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-40: 40px;

  /* Border Radius */
  --radius-md: 4.5px;
  --radius-lg: 8px;
  --radius-2xl: 20px;
  --radius-full: 99px;
}
```
