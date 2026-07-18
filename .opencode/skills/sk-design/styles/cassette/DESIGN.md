# Cassette — Style Reference
> Neon cassette on black velvet. A single hi-vis yellow burns against a warm-black void, the way a tape label glows under a single bulb in a dark room.

**Theme:** dark

Cassette is a music curation agency site that reads like a single-color risograph print: near-black canvas, one electric yellow doing all the work, and a mono/sans typography pair that feels like liner notes and stage signage. The visual system is deliberately austere — no gradients, no shadows, no decorative secondary hues — so the yellow wordmark, pill buttons, and equalizer bars hit with amplifier-level intensity against the dark ground. Layout is editorial and collage-driven: oversized type, asymmetric image stacks, and bordered logo grids. Components are flat, fully rounded (900px pills), and bordered rather than elevated, with a pervasive grain/noise texture that gives even flat color a tactile, photocopied quality.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Hi-Vis Yellow | `#f0e226` | `--color-hi-vis-yellow` | Primary action buttons, wordmark, navigation pill borders, section badges, equalizer bars, brand asterisk, highlight underlines — the only chromatic color in the system, carrying 100% of brand voice and functional energy |
| Ink Black | `#19181a` | `--color-ink-black` | Primary page background — a warm near-black that sits behind every screen, softer than pure black and warmer against the yellow |
| Pure Black | `#000000` | `--color-pure-black` | Hard borders, image outlines, logo grid dividers, text on yellow fills — the structural ink that gives the system its edges |
| Bone | `#f5f4f0` | `--color-bone` | Primary text color, body copy, headings, client logos, light surface fills — a warm off-white that reads as paper against the warm-black ground |
| Charcoal | `#272727` | `--color-charcoal` | Subtle dividers, secondary borders, low-contrast structural lines between grid cells |
| Sand | `#d9d7ce` | `--color-sand` | Muted helper text, secondary descriptive copy, low-emphasis labels |

## Tokens — Typography

### Apercu Pro — Display and body sans-serif — carries the CASSETTE wordmark at 56–60px, section headings at 37px, and body text at 15px. The single weight (400) used across all sizes is deliberate: hierarchy comes from size jumps, not weight shifts, giving the type a calm, even voice. · `--font-apercu-pro`
- **Substitute:** Inter, Söhne, or Neue Haas Grotesk
- **Weights:** 400
- **Sizes:** 15px, 37px, 56px, 60px
- **Line height:** 1.08 (display/headings), 1.20 (body)
- **Role:** Display and body sans-serif — carries the CASSETTE wordmark at 56–60px, section headings at 37px, and body text at 15px. The single weight (400) used across all sizes is deliberate: hierarchy comes from size jumps, not weight shifts, giving the type a calm, even voice.

### Apercu Mono Pro — Monospace workhorse for all UI chrome: navigation pills, section badges, city labels, button text, footer, and small body annotations. The monospace proportions give every interactive element a technical, label-like quality — the chrome feels like equipment markings rather than marketing type. · `--font-apercu-mono-pro`
- **Substitute:** JetBrains Mono, IBM Plex Mono, or Berkeley Mono
- **Weights:** 400
- **Sizes:** 13px, 14px
- **Line height:** 1.00 (tight badges), 1.16 (UI), 1.30 (small body)
- **Role:** Monospace workhorse for all UI chrome: navigation pills, section badges, city labels, button text, footer, and small body annotations. The monospace proportions give every interactive element a technical, label-like quality — the chrome feels like equipment markings rather than marketing type.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 13px | 1.16 | — | `--text-caption` |
| body | 15px | 1.2 | — | `--text-body` |
| heading | 37px | 1.08 | — | `--text-heading` |
| display | 56px | 1.08 | — | `--text-display` |

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
| 32 | 32px | `--spacing-32` |
| 48 | 48px | `--spacing-48` |
| 64 | 64px | `--spacing-64` |
| 128 | 128px | `--spacing-128` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 0px |
| badges | 900px |
| images | 0px |
| buttons | 900px |

### Layout

- **Page max-width:** 1440px
- **Section gap:** 80px
- **Card padding:** 24px
- **Element gap:** 8px

## Components

### Pill Button — Filled
**Role:** Primary action call-to-action

Fully rounded (900px radius) pill button. Background: #f0e226 Hi-Vis Yellow. Text: #000000 Pure Black, Apercu Mono Pro 13–14px weight 400, uppercase, 5px horizontal padding, 4px vertical padding. No border. The yellow-on-black contrast (15.6:1) makes every filled button feel switched on.

### Pill Button — Outlined
**Role:** Navigation link, secondary action

Same 900px radius and 13px/4px padding as the filled variant. Transparent background, 1px solid #f0e226 border, text in #f0e226. Used for the persistent nav cluster (ABOUT, CLIENTS, TEAM, SERVICES, CONTACT, WHY). The outlined form keeps the yellow energy without doubling the filled accent weight.

### Section Badge
**Role:** Section identifier label

Small pill (900px radius) placed above section headings. 1px solid #f0e226 border, transparent fill, text in #f0e226, Apercu Mono Pro 13px. Two-line stacked format: section name on top, descriptor below (e.g. "ABOUT CASSETTE / A MUSIC CURATION AGENCY"). Functions like a stamp or label on a record sleeve.

### Display Wordmark
**Role:** Primary brand identity element

The "CASSETTE" text set in Apercu Pro at 56–60px weight 400, letter-spacing normal, color #f0e226. Stretches edge-to-edge of the viewport. No shadow, no gradient — flat yellow on black. A grain/noise texture overlay softens the fill so it reads like a screen-printed poster rather than a digital render.

### Brand Asterisk
**Role:** Logo mark, favicon, decorative icon

A six-pointed asterisk/flower glyph in #f0e226, used as the site logo. Appears in the nav cluster, as a favicon, and as a repeated motif. Flat fill, no border, no effects.

### Audio Equalizer Bars
**Role:** Decorative hero/footer graphic

Horizontal rectangular bars in #f0e226 arranged in a spectrum-equalizer pattern across the full viewport width. Each bar is ~8px tall with small gaps. A grain/noise texture is applied across the entire group, giving the yellow a risograph-printed, slightly degraded quality. Functions as a visual metronome for the music-agency concept.

### Navigation Pill Cluster
**Role:** Primary site navigation

A horizontal group of 6 outlined pill buttons (ABOUT, CLIENTS, TEAM, SERVICES, CONTACT, WHY) wrapping in 2 rows. Fixed/sticky in the top-left area. Each pill: 900px radius, 1px #f0e226 border, #f0e226 text, Apercu Mono Pro 13px. The brand asterisk sits to the left of the cluster.

### City Label Row
**Role:** Geographic presence indicator

Four location names (LOS ANGELES, NEW YORK, LONDON, PARIS) in Apercu Mono Pro 13px, #f5f4f0, uppercase, distributed across the full viewport width directly beneath the CASSETTE wordmark. No dividers, no markers — the spatial distribution itself communicates the global presence.

### Section Heading
**Role:** Page section title

Apercu Pro 37px weight 400, color #f5f4f0 Bone, line-height 1.08. Appears left-aligned above body text. The first heading on the about page includes a #f0e226 underline highlight beneath the key phrase. No drop cap, no decoration beyond the optional highlight stroke.

### Body Text Block
**Role:** Paragraph content

Apercu Pro 15px weight 400, color #f5f4f0 with occasional #d9d7ce Sand for sub-labels, line-height 1.20. All-caps formatting is common, reinforcing the editorial/label-print feel. Paragraphs are short — typically 1–3 sentences — with generous breathing room between them.

### Logo Grid Cell
**Role:** Client logo display

Individual cell in a 4-column logo grid. 1px solid #272727 Charcoal border on all sides (no gap between cells — borders share edges). Cell content: client logo in #f5f4f0, centered, at roughly 60% cell width. Logos are predominantly typographic; icon+wordmark logos appear at smaller scale. The grid spans the full content width with no outer border.

### Image Collage
**Role:** Mixed-media visual storytelling

Asymmetric arrangement of photographs and textured surfaces on the left side of content sections. Images have 0px radius (sharp corners), slight overlapping, and 1px borders. Content includes sky/cloud photography, product shots (cassette tape on blue sky), and textured surfaces in accent colors (pink, coral, green). No shadows — the collage relies on layering and color contrast for depth.

## Do's and Don'ts

### Do
- Use #f0e226 Hi-Vis Yellow for every interactive element and brand mark — it is the only chromatic color and must carry all functional energy
- Set all buttons, badges, and tags to 900px border-radius for a fully pill-shaped silhouette
- Use Apercu Mono Pro for all UI chrome (nav, badges, buttons, labels) and Apercu Pro for display type and body copy
- Apply grain/noise texture overlays to large yellow fills to maintain the risograph-printed analog feel
- Keep backgrounds flat — use #19181a as the canvas, never add gradients, shadows, or background images to UI surfaces
- Use 1px solid borders in #f0e226 or #272727 to create structure and grid cells instead of relying on spacing alone
- Set section headings at 37px and body text at 15px — the 2.5× size jump creates hierarchy without needing weight variation

### Don't
- Never introduce a second chromatic color — the system is monochrome + yellow, period
- Never use rounded corners smaller than 900px on interactive elements — partial rounding breaks the pill language
- Never use drop shadows, glows, or blur effects — the system is flat and printed
- Never use font weights other than 400 — hierarchy comes from size, not weight
- Never place #f0e226 text on a light background without sufficient contrast testing — it is designed for dark surfaces
- Never use multi-color gradients, even subtle ones — the color palette is strictly flat
- Never add decorative icon colors beyond #f0e226 and #f5f4f0 — icons should be mono-colored to match the system restraint

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Ink Black Canvas | `#19181a` | Primary page background across all sections |
| 2 | Bone Surface | `#f5f4f0` | Inverse surface — text and logo fills sitting on the dark canvas |
| 3 | Hi-Vis Accent | `#f0e226` | Functional accent surface for pills, badges, and active marks |

## Elevation

The system is intentionally shadowless. Depth and hierarchy are achieved through color contrast (yellow on black), border weight (1px hairlines in #272727 or #f0e226), and size jumps in typography — never through drop shadows or blur. Flat color and sharp edges give the site a printed, analog quality that matches the cassette/music-curation concept.

## Imagery

Mixed-media collage: full-color photography (sky, product shots, textured surfaces) layered with grainy yellow graphic elements. Images are sharp-cornered (0px radius), often 1px-bordered, and arranged in asymmetric overlapping stacks. Photography is high-key and saturated — blue sky, pink stucco, green foliage — chosen to pop against the black canvas. The yellow graphic elements (equalizer bars, wordmark) carry a uniform noise/grain texture that mimics risograph printing or photocopied zines. Client logos are predominantly typographic, rendered in #f5f4f0 on the dark background. No lifestyle or staged photography — the objects and surfaces are presented raw, as if scanned directly from a mood board.

## Layout

Full-bleed dark canvas with no max-width constraint on the background. Content is contained within a centered ~1440px column, but the yellow graphic elements (wordmark, equalizer bars, nav cluster) break beyond the content column to the viewport edges. Hero: oversized CASSETTE wordmark spanning full viewport width, city names distributed across the width beneath it, nav cluster fixed top-left, hero headline right-aligned, equalizer bars anchored to the bottom. Content sections: asymmetric two-column splits — left column holds image collage, right column holds badge + heading + body + CTA. The clients section is a 4-column × 4-row logo grid with shared 1px borders forming a continuous lattice. Vertical rhythm: generous 80px section gaps, sections separated by the dark background alone with no dividers or color bands. Navigation is a sticky pill cluster in the top-left corner that persists across all sections.

## Agent Prompt Guide

## Quick Color Reference
- text: #f5f4f0 (Bone)
- background: #19181a (Ink Black)
- border: #f0e226 (Hi-Vis Yellow)
- accent: #f0e226 (Hi-Vis Yellow)
- primary action: #f0e226 (filled action)

## Example Component Prompts

1. **Create a pill button (filled):** 900px border-radius, background #f0e226, text #000000, Apercu Mono Pro 13px weight 400 uppercase, padding 4px 13px, no border. The yellow fill should be flat with a subtle noise/grain texture overlay.

2. **Create a pill button (outlined):** 900px border-radius, background transparent, 1px solid #f0e226 border, text #f0e226, Apercu Mono Pro 13px weight 400 uppercase, padding 4px 13px.

3. **Create a section badge:** 900px border-radius, background transparent, 1px solid #f0e226 border, text #f0e226, Apercu Mono Pro 13px weight 400, two lines stacked. Place above section headings with 24px gap below.

4. **Create a display wordmark:** Apercu Pro 56px weight 400, color #f0e226, letter-spacing normal, stretching full viewport width. Apply a grain/noise texture overlay at 10–15% opacity for a risograph print effect.

5. **Create a logo grid cell:** 1px solid #272727 border on all sides (shared edges with adjacent cells), background #19181a, content centered — a client logo in #f5f4f0 at ~60% cell width. 4-column grid spanning the full content width.

## Similar Brands

- **Golf Wang** — Same high-contrast single-accent color treatment — bright yellow wordmark on black with mono-typographic UI
- **Aries (fashion brand)** — Editorial collage layout with sharp-cornered image stacks and a mono/sans type pair, mixed-media photography
- **NTS Radio** — Dark-canvas music platform with pill-shaped navigation and mono labels, communal/waveform visual language
- **Wieden+ Kennedy** — Agency site with oversized type, asymmetric image-text splits, and a restrained monochromatic palette with one accent

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-hi-vis-yellow: #f0e226;
  --color-ink-black: #19181a;
  --color-pure-black: #000000;
  --color-bone: #f5f4f0;
  --color-charcoal: #272727;
  --color-sand: #d9d7ce;

  /* Typography — Font Families */
  --font-apercu-pro: 'Apercu Pro', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-apercu-mono-pro: 'Apercu Mono Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 13px;
  --leading-caption: 1.16;
  --text-body: 15px;
  --leading-body: 1.2;
  --text-heading: 37px;
  --leading-heading: 1.08;
  --text-display: 56px;
  --leading-display: 1.08;

  /* Typography — Weights */
  --font-weight-regular: 400;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-128: 128px;

  /* Layout */
  --page-max-width: 1440px;
  --section-gap: 80px;
  --card-padding: 24px;
  --element-gap: 8px;

  /* Border Radius */
  --radius-full: 900px;

  /* Named Radii */
  --radius-cards: 0px;
  --radius-badges: 900px;
  --radius-images: 0px;
  --radius-buttons: 900px;

  /* Surfaces */
  --surface-ink-black-canvas: #19181a;
  --surface-bone-surface: #f5f4f0;
  --surface-hi-vis-accent: #f0e226;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-hi-vis-yellow: #f0e226;
  --color-ink-black: #19181a;
  --color-pure-black: #000000;
  --color-bone: #f5f4f0;
  --color-charcoal: #272727;
  --color-sand: #d9d7ce;

  /* Typography */
  --font-apercu-pro: 'Apercu Pro', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-apercu-mono-pro: 'Apercu Mono Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 13px;
  --leading-caption: 1.16;
  --text-body: 15px;
  --leading-body: 1.2;
  --text-heading: 37px;
  --leading-heading: 1.08;
  --text-display: 56px;
  --leading-display: 1.08;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-128: 128px;

  /* Border Radius */
  --radius-full: 900px;
}
```
