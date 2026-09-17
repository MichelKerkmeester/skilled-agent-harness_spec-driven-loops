# Altitude — Style Reference
> midnight financial editorial — a darkened trading floor printed on bone-white serif stock, lit only by thin borders and a single blue accent.

**Theme:** dark

Altitude operates in a midnight editorial register: near-black canvas, off-white serif headlines (Libre Baskerville), and razor-thin secondary type (Inter). The serif-on-dark pairing is the signature — most AI finance tools lean on geometric sans-serifs; Altitude borrows from financial print (WSJ, FT) to signal authority and discretion. Mountain ridge linework and painterly landscape photography replace the usual gradient meshes and 3D renders, grounding the AI product in a sense of summit and scale. Surfaces are stratified by barely-perceptible gray steps (#111 → #181 → #1f → #26 → #32), with hairline borders doing the structural work that shadows do elsewhere. Color is almost entirely absent from the interface — when it appears, it reads as functional punctuation rather than decoration. Components are tight, rectangular (4–8px radii), and content-forward.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Carbon Canvas | `#181818` | `--color-carbon-canvas` | Primary page background; the foundational dark surface that all sections sit on |
| Obsidian | `#111111` | `--color-obsidian` | Deepest layer — footer, contrast blocks, shadow wells |
| Graphite Card | `#1f1f1f` | `--color-graphite-card` | Card and input surfaces lifted one step above canvas |
| Slate Elevated | `#262626` | `--color-slate-elevated` | Elevated surfaces — table rows, hover states, secondary panels |
| Iron Peak | `#323232` | `--color-iron-peak` | Highest surface tier — dropdowns, popovers, selected list items |
| Bone | `#eeeeee` | `--color-bone` | Primary text and hairline borders — the dominant foreground tone |
| Ash | `#e4e4e4` | `--color-ash` | Secondary borders and card outlines |
| Fog | `#a4a19b` | `--color-fog` | Muted helper text, icon strokes, disabled labels |
| Smoke | `#5e5d59` | `--color-smoke` | Subtle dividers, badge backgrounds, low-emphasis text |
| Pewter | `#4b4b4b` | `--color-pewter` | Deep borders, table separators |
| Pure White | `#ffffff` | `--color-pure-white` | Icon glyphs, card backgrounds for light-section contrast blocks, max-emphasis text |
| Voltage Blue | `#2b7fff` | `--color-voltage-blue` | Sole chromatic accent — inline link highlights, selection, active state within data-dense terminal views; appears as the only color in an otherwise achromatic system |
| Mid Navy | `#1a365d` | `--color-mid-navy` | Decorative deep-blue tone used in heading borders and subtle heading tints — adds depth without breaking the monochromatic discipline |

## Tokens — Typography

### Libre Baskerville — Display headlines exclusively (hero, section openers). The serif choice on a dark canvas is the brand's most distinctive move — it borrows financial-print authority (FT, Barron's) and makes an AI product feel like a private journal rather than a dashboard. Always weight 400 or 500; never bold. Letter-spacing tightens at -0.025em to keep long phrases compact. · `--font-libre-baskerville`
- **Substitute:** Source Serif Pro, Lora, Crimson Text
- **Weights:** 400, 500
- **Sizes:** 36px, 48px, 72px
- **Line height:** 1.10, 1.15, 1.25
- **Letter spacing:** -0.0250em
- **Role:** Display headlines exclusively (hero, section openers). The serif choice on a dark canvas is the brand's most distinctive move — it borrows financial-print authority (FT, Barron's) and makes an AI product feel like a private journal rather than a dashboard. Always weight 400 or 500; never bold. Letter-spacing tightens at -0.025em to keep long phrases compact.

### Inter — All functional UI — body, nav, buttons, inputs, table cells, badges, captions. Weight 400 is the default; 500–600 for emphasis. The 8–11px range is used aggressively for data-dense terminal/table contexts, and the positive letter-spacing (0.025–0.05em) applies to small uppercase labels and badges to compensate for size. · `--font-inter`
- **Substitute:** system-ui, -apple-system, Segoe UI
- **Weights:** 400, 500, 600, 700
- **Sizes:** 8px, 9px, 10px, 11px, 12px, 13px, 14px, 16px, 18px, 28px
- **Line height:** 1.20, 1.25, 1.33, 1.38, 1.43, 1.50, 1.63
- **Letter spacing:** -0.0250em, 0.0250em, 0.0500em
- **Role:** All functional UI — body, nav, buttons, inputs, table cells, badges, captions. Weight 400 is the default; 500–600 for emphasis. The 8–11px range is used aggressively for data-dense terminal/table contexts, and the positive letter-spacing (0.025–0.05em) applies to small uppercase labels and badges to compensate for size.

### Fira Code — Monospaced contexts — code blocks, query inputs, and data identifiers within the terminal-style product UI. The +0.1em tracking is signature for code labels and command strings. · `--font-fira-code`
- **Substitute:** JetBrains Mono, IBM Plex Mono
- **Weights:** 400, 600
- **Sizes:** 10px, 14px, 16px
- **Line height:** 1.43, 1.50
- **Letter spacing:** 0.1000em
- **Role:** Monospaced contexts — code blocks, query inputs, and data identifiers within the terminal-style product UI. The +0.1em tracking is signature for code labels and command strings.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 10px | 1.5 | 0.5px | `--text-caption` |
| body | 14px | 1.5 | — | `--text-body` |
| heading-sm | 18px | 1.43 | -0.45px | `--text-heading-sm` |
| heading | 28px | 1.38 | -0.7px | `--text-heading` |
| heading-lg | 36px | 1.15 | -0.9px | `--text-heading-lg` |
| display | 72px | 1.1 | -1.8px | `--text-display` |

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
| 80 | 80px | `--spacing-80` |
| 96 | 96px | `--spacing-96` |
| 128 | 128px | `--spacing-128` |
| 136 | 136px | `--spacing-136` |
| 224 | 224px | `--spacing-224` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 8px |
| icons | 4px |
| badges | 4px |
| inputs | 4px |
| buttons | 4px |
| large_surfaces | 16px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| md | `rgba(51, 51, 51, 0.05) 0px 2px 15px 0px, rgba(51, 51, 51,...` | `--shadow-md` |
| subtle | `oklab(0 0 0 / 0.2) 0px 0px 0px 1px, rgba(51, 51, 51, 0.05...` | `--shadow-subtle` |
| subtle-2 | `oklab(0.999994 0.0000455678 0.0000200868 / 0.1) 0px 0px 0...` | `--shadow-subtle-2` |
| subtle-3 | `oklab(0.95 0 0 / 0.1) 0px 0px 0px 1px` | `--shadow-subtle-3` |
| subtle-4 | `rgb(232, 110, 88) 0px 0px 0px 2px, rgba(51, 51, 51, 0.05)...` | `--shadow-subtle-4` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 12px
- **Element gap:** 8px

## Components

### Ghost Button
**Role:** Primary CTA — used for 'Request a Demo' and navigation actions

Transparent background, 1px solid #eeeeee border, #eeeeee text at 14px Inter weight 500, 4px radius, 16px horizontal / 8px vertical padding. Hover lifts to #262626 background. The filled-inverse version (white bg, black text) is rare; the ghost is the default voice.

### Navigation Link
**Role:** Top nav items (Platform, Security, Blog)

No background, no border. Inter 14px weight 400 in #eeeeee. Active state: 1px #aeaeae bottom border acting as a thin underline marker. Sits in a 64px-tall bar with the wordmark left and Login right.

### Workflow Tile
**Role:** Feature card within the automated workflows grid

Off-white card (#e7e5e4 to #ffffff range) on the dark canvas, 8px radius, 24px padding. Centered icon (24px, 1.5px stroke) in #1a365d, label beneath in Inter 13px weight 500, #181818 text. Arranged in a 5-column grid with 12px gaps.

### Terminal Window
**Role:** Product screenshot / app frame overlay

Dark app chrome (#1f1f1f) with traffic-light dots (red/yellow/green) top-left, sidebar listing platform items in Inter 13px, and a main content area with Fira Code monospaced text. Rounded 8px on the container; the internal panes are square-cornered. Drops the heavy modal-level shadow when presented as a marketing screenshot.

### Serif Section Header
**Role:** Section openers (e.g. 'Sherpa — Your AI Analyst', 'Automated Workflows')

Libre Baskerville 48px weight 400, #eeeeee, line-height 1.15, letter-spacing -0.025em. No kicker label, no eyebrow — the serif does all the work. Subhead below in Inter 16px weight 400, #a4a19b.

### Hero Composition
**Role:** Above-the-fold hero block

Full-viewport #181818 canvas. Centered stack: display headline (Libre Baskerville 72px, #eeeeee, ls -0.025em), single-line subhead (Inter 18px, #a4a19b), ghost CTA below. A continuous mountain ridge line in 1px #a4a19b runs full-width near the bottom — the only decorative graphic on the page.

### Input Field
**Role:** Form inputs, search bars, query fields

Background #1f1f1f, 1px #323232 border, 4px radius, 12px padding, Inter 14px weight 400, #eeeeee text. Placeholder in #5e5d59. Focus ring: 2px #2b7fff outer glow.

### Badge / Status Pill
**Role:** Tags, status indicators, category labels

Background #5e5d59 or #323232, text Inter 11px weight 500 in #eeeeee, 4px radius, 6px 10px padding. Uppercase tracking +0.05em. No colored fill — status is always communicated through border weight or text, never hue.

### Data Table Row
**Role:** Row within terminal-style data tables

Background alternates between transparent and #262626; 1px #262626 bottom border; Inter 13px weight 400 in #eeeeee; 16px vertical padding. Header row uses Inter 11px weight 500 uppercase, tracking +0.05em, in #a4a19b.

### Product Feature Split
**Role:** Two-column section: copy left, product visual right

Max-width 1200px centered. Left column: 40% width, serif heading + body copy + text-link CTA ('Try Me →'). Right column: 60% width, product visual (terminal window over mountain landscape) with 8px container radius. Section gap 80px above and below.

### Footer
**Role:** Page footer

Background #111111, 64px vertical padding. Wordmark, nav links, and legal in Inter 13px weight 400, #a4a19b. 1px #1f1f1f top border separates from main content.

### Image Card / Hero Visual
**Role:** Photographic or illustrated visuals with rounded container

16px radius, 1px #262626 border, #1f1f1f fallback background behind image. Mountain landscape photography (painterly, blue-gray, atmospheric) is the primary visual — no abstract gradients, no 3D renders.

## Do's and Don'ts

### Do
- Use Libre Baskerville weight 400 at 36–72px for all section and display headlines; never substitute a sans-serif for these.
- Maintain the surface stack: #111 → #181 → #1f → #26 → #32, ascending by roughly 5–10% luminance steps.
- Use 4px radius for all buttons, inputs, and badges; 8px for cards; 16px only for large image containers.
- Keep body text in Inter 14px weight 400, #eeeeee, with #a4a19b for muted helper text and #5e5d59 for placeholders.
- Use 8px element gaps and 12px card padding as the baseline; scale section rhythm in 24/32/64/80px steps.
- Let the mountain ridge line graphic or landscape photography do the visual storytelling — no gradient meshes, no 3D orbs, no neon glows.
- Communicate status through weight, border, and tracking rather than color; reserve #2b7fff for inline links and the focus ring only.

### Don't
- Don't use bold weights (700) for headlines — Libre Baskerville at weight 400 is the voice; going heavier breaks the editorial register.
- Don't introduce new accent colors — the system is monochromatic with one blue; adding green/red/yellow for semantic states breaks the discipline.
- Don't use heavy drop shadows for cards or buttons; shadows here are 0.05 opacity whispers, not 0.3-opacity lifts.
- Don't round corners above 16px — the rectilinear 4–8px language is a signature; pill shapes (9999px) would look foreign.
- Don't use white (#ffffff) as body text — #eeeeee is softer and the right foreground tone against #181818.
- Don't pair Inter with another sans-serif for headings; the Inter/Baskerville duality is the only pairing the system uses.
- Don't apply gradients to UI surfaces — the one detected gradient is on a landscape image, not on any card or button.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Obsidian | `#111111` | Deepest base — footer wells, contrast blocks beneath cards |
| 1 | Carbon Canvas | `#181818` | Primary page background |
| 2 | Graphite Card | `#1f1f1f` | Cards, inputs, contained surfaces |
| 3 | Slate Elevated | `#262626` | Hover states, table rows, secondary panels |
| 4 | Iron Peak | `#323232` | Top elevation — popovers, dropdowns, active selections |

## Elevation

- **Card:** `0px 2px 15px 0px rgba(51,51,51,0.05), 0px 1px 2px -1px rgba(51,51,51,0.05)`
- **Button:** `0px 0px 0px 1px oklab(0 0 0 / 0.2), 0px 2px 15px 0px rgba(51,51,51,0.05), 0px 1px 2px -1px rgba(51,51,51,0.05)`
- **Modal / Overlay:** `0px 0px 0px 1px oklab(0.999994 0.0000455678 0.0000200868 / 0.1), 0px 8px 24px 0px rgba(0,0,0,0.3), 0px 2px 8px 0px rgba(0,0,0,0.2)`

## Imagery

Photography is the dominant visual medium — specifically painterly, atmospheric mountain landscapes in muted blue-grays that evoke summit, scale, and distance. These appear as full-bleed or large contained images behind product terminal screenshots, creating a 'looking through a window at the product' effect. A continuous single-line mountain ridge SVG runs across the hero, drawn in 1px #a4a19b — a minimalist line-art counterpoint to the photographic sections. Icons are outline-style, 1.5px stroke, monochrome in #1a365d or #a4a19b, never filled. No 3D renders, no abstract gradient art, no stock-style lifestyle photography. The imagery vocabulary is: landscape photography + thin line-art + product terminal screenshots.

## Layout

Max-width 1200px centered, full-bleed dark canvas. Hero is a centered single-column stack (display headline → subhead → ghost CTA) with the mountain ridge line running full-width at the bottom. Product sections alternate between two patterns: (1) a dark product-visual-right layout (40% copy left, 60% terminal-over-landscape right) and (2) a dark copy-right layout with a light off-white workflow card grid on the left. Section gaps are generous — 80px vertical rhythm separates each band. Navigation is a single 64px-tall top bar with the wordmark left, three nav links center, Login right; no sticky behavior, no hamburger. The page flows seamlessly from dark to dark with one light-section interruption (the workflow grid) for contrast.

## Agent Prompt Guide

**Quick Color Reference**
- text: #eeeeee
- background: #181818
- border: #262626
- accent: #2b7fff
- muted text: #a4a19b
- primary action: no distinct CTA color

**3-5 Example Component Prompts**

No distinct primary action color was observed; use the extracted neutral button treatments instead of inventing a filled CTA color.

2. **Serif section header + body**: Left-aligned Libre Baskerville 48px weight 400, #eeeeee, letter-spacing -1.2px. Subhead in Inter 16px weight 400, #a4a19b. Body copy in Inter 14px weight 400, #eeeeee, 1.5 line-height. 'Try Me →' text link in Inter 14px weight 500, #2b7fff.

3. **Workflow tile card**: Off-white #e7e5e4 background, 8px radius, 24px padding, 1px #e4e4e4 border. Centered 24px outline icon in #1a365d. Label beneath in Inter 13px weight 500, #181818. Arranged in a 5-column grid with 12px gaps on the #181818 canvas.

4. **Terminal window**: #1f1f1f background, 8px radius, 1px #262626 border. Top bar with three 10px traffic-light dots (red #ff5f57, yellow #febc20, green #28c840). Sidebar at 200px width with Inter 13px #eeeeee list items on #181818 background. Main pane with Fira Code 14px, #eeeeee text on #1f1f1f.

5. **Data table row**: Full-width row, 16px vertical padding, 1px #262626 bottom border. Inter 13px weight 400, #eeeeee. Alternating row background: transparent and #262626. Header row above: Inter 11px weight 500 uppercase, +0.5px tracking, #a4a19b.

## Similar Brands

- **Ramp** — Same near-black canvas with generous serif/sans pairing, monochromatic discipline, and ghost-button CTAs — though Ramp is lighter and more playful.
- **Plaid** — Dark-mode fintech surface with thin borders, hairline structural elements, and restrained color use; similar density and information-forward layout.
- **Linear** — Dark dense UI with the same five-step gray surface stack, 4–8px corner radius vocabulary, and the same 'chromatic accent only where functionally necessary' rule.
- **Bloomberg Terminal** — Shares the editorial-financial DNA — serif display, monospaced data, dark canvas, hairline grid lines, and zero tolerance for decorative color.

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-carbon-canvas: #181818;
  --color-obsidian: #111111;
  --color-graphite-card: #1f1f1f;
  --color-slate-elevated: #262626;
  --color-iron-peak: #323232;
  --color-bone: #eeeeee;
  --color-ash: #e4e4e4;
  --color-fog: #a4a19b;
  --color-smoke: #5e5d59;
  --color-pewter: #4b4b4b;
  --color-pure-white: #ffffff;
  --color-voltage-blue: #2b7fff;
  --color-mid-navy: #1a365d;

  /* Typography — Font Families */
  --font-libre-baskerville: 'Libre Baskerville', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-fira-code: 'Fira Code', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.5;
  --tracking-caption: 0.5px;
  --text-body: 14px;
  --leading-body: 1.5;
  --text-heading-sm: 18px;
  --leading-heading-sm: 1.43;
  --tracking-heading-sm: -0.45px;
  --text-heading: 28px;
  --leading-heading: 1.38;
  --tracking-heading: -0.7px;
  --text-heading-lg: 36px;
  --leading-heading-lg: 1.15;
  --tracking-heading-lg: -0.9px;
  --text-display: 72px;
  --leading-display: 1.1;
  --tracking-display: -1.8px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

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
  --spacing-80: 80px;
  --spacing-96: 96px;
  --spacing-128: 128px;
  --spacing-136: 136px;
  --spacing-224: 224px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 12px;
  --element-gap: 8px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-2xl: 16px;

  /* Named Radii */
  --radius-cards: 8px;
  --radius-icons: 4px;
  --radius-badges: 4px;
  --radius-inputs: 4px;
  --radius-buttons: 4px;
  --radius-largesurfaces: 16px;

  /* Shadows */
  --shadow-md: rgba(51, 51, 51, 0.05) 0px 2px 15px 0px, rgba(51, 51, 51, 0.05) 0px 1px 2px -1px;
  --shadow-subtle: oklab(0 0 0 / 0.2) 0px 0px 0px 1px, rgba(51, 51, 51, 0.05) 0px 2px 15px 0px, rgba(51, 51, 51, 0.05) 0px 1px 2px -1px;
  --shadow-subtle-2: oklab(0.999994 0.0000455678 0.0000200868 / 0.1) 0px 0px 0px 1px, rgba(0, 0, 0, 0.3) 0px 8px 24px 0px, rgba(0, 0, 0, 0.2) 0px 2px 8px 0px;
  --shadow-subtle-3: oklab(0.95 0 0 / 0.1) 0px 0px 0px 1px;
  --shadow-subtle-4: rgb(232, 110, 88) 0px 0px 0px 2px, rgba(51, 51, 51, 0.05) 0px 2px 15px 0px, rgba(51, 51, 51, 0.05) 0px 1px 2px -1px;

  /* Surfaces */
  --surface-obsidian: #111111;
  --surface-carbon-canvas: #181818;
  --surface-graphite-card: #1f1f1f;
  --surface-slate-elevated: #262626;
  --surface-iron-peak: #323232;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-carbon-canvas: #181818;
  --color-obsidian: #111111;
  --color-graphite-card: #1f1f1f;
  --color-slate-elevated: #262626;
  --color-iron-peak: #323232;
  --color-bone: #eeeeee;
  --color-ash: #e4e4e4;
  --color-fog: #a4a19b;
  --color-smoke: #5e5d59;
  --color-pewter: #4b4b4b;
  --color-pure-white: #ffffff;
  --color-voltage-blue: #2b7fff;
  --color-mid-navy: #1a365d;

  /* Typography */
  --font-libre-baskerville: 'Libre Baskerville', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-fira-code: 'Fira Code', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.5;
  --tracking-caption: 0.5px;
  --text-body: 14px;
  --leading-body: 1.5;
  --text-heading-sm: 18px;
  --leading-heading-sm: 1.43;
  --tracking-heading-sm: -0.45px;
  --text-heading: 28px;
  --leading-heading: 1.38;
  --tracking-heading: -0.7px;
  --text-heading-lg: 36px;
  --leading-heading-lg: 1.15;
  --tracking-heading-lg: -0.9px;
  --text-display: 72px;
  --leading-display: 1.1;
  --tracking-display: -1.8px;

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
  --spacing-80: 80px;
  --spacing-96: 96px;
  --spacing-128: 128px;
  --spacing-136: 136px;
  --spacing-224: 224px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-2xl: 16px;

  /* Shadows */
  --shadow-md: rgba(51, 51, 51, 0.05) 0px 2px 15px 0px, rgba(51, 51, 51, 0.05) 0px 1px 2px -1px;
  --shadow-subtle: oklab(0 0 0 / 0.2) 0px 0px 0px 1px, rgba(51, 51, 51, 0.05) 0px 2px 15px 0px, rgba(51, 51, 51, 0.05) 0px 1px 2px -1px;
  --shadow-subtle-2: oklab(0.999994 0.0000455678 0.0000200868 / 0.1) 0px 0px 0px 1px, rgba(0, 0, 0, 0.3) 0px 8px 24px 0px, rgba(0, 0, 0, 0.2) 0px 2px 8px 0px;
  --shadow-subtle-3: oklab(0.95 0 0 / 0.1) 0px 0px 0px 1px;
  --shadow-subtle-4: rgb(232, 110, 88) 0px 0px 0px 2px, rgba(51, 51, 51, 0.05) 0px 2px 15px 0px, rgba(51, 51, 51, 0.05) 0px 1px 2px -1px;
}
```
