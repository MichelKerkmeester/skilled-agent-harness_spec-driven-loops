# Atlantic.vc — Style Reference
> Midnight observatory wireframe — electric blue and ice-white type on layered charcoal, traced with cool-white borders.

**Theme:** dark

Atlantic.vc operates as a midnight investment observatory: near-black canvas, cool-tinted ice-white typography, and a single electric blue (#1f58f2) that illuminates selected words inside otherwise neutral headlines like a tracer running through data. The design language is editorial and scientific — particle-cloud hero imagery, monospaced labels with wide tracking, and oversized display type (96px Monument) that occupies the full viewport. A single warm orange-red (#ff4105) breaks the cool palette exclusively for interactive states and the follow CTA, creating deliberate thermal contrast against the otherwise glacial system. Surfaces layer as concentric shades of charcoal (#000000 → #0d0d0f → #232529 → #2b2f33), with the signature cool-white #d8eaff doubling as text AND the dominant border color — a unified treatment that makes every outlined element feel like a wireframe drawn in light.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Ice White | `#d8eaff` | `--color-ice-white` | Primary text and dominant border color — cool blue-tinted white that doubles as hairline borders, card outlines, and link underlines, creating a wireframe-in-light effect across all surfaces |
| Void Black | `#000000` | `--color-void-black` | Deepest surface — page canvas and footer base |
| Carbon | `#0d0d0f` | `--color-carbon` | Card surface — sits one shade above void, used for elevated content blocks |
| Graphite | `#232529` | `--color-graphite` | Body background and footer border surface — mid-layer charcoal |
| Slate | `#2b2f33` | `--color-slate` | Card backgrounds and the most common elevated surface — the default panel |
| Iron | `#41464c` | `--color-iron` | Muted body text and subtle dividers — secondary text level |
| Steel | `#565e66` | `--color-steel` | Tertiary body text and low-emphasis borders |
| Fog | `#6c757f` | `--color-fog` | Helper text and low-contrast borders — the quietest readable neutral |
| Iron Edge | `#565657` | `--color-iron-edge` | Medium-contrast borders and link outlines |
| Electric Cobalt | `#1f58f2` | `--color-electric-cobalt` | Violet wash for highlight backgrounds, decorative bands, and soft emphasis behind content. Do not promote it to the primary CTA color |
| Signal Orange | `#ff4105` | `--color-signal-orange` | Orange outline accent for tags, dividers, and focused UI edges. Do not promote it to the primary CTA color |

## Tokens — Typography

### Monument — Display and heading type — custom geometric sans used exclusively at weight 400. Headlines reach 96px with line-height 1.00, letter-spacing -0.03em. This single-weight approach forces the type to command through size alone, not boldness — a whisper-loud philosophy. Body-level Monument at 16-24px handles secondary text and large UI labels. · `--font-monument`
- **Substitute:** Inter, Satoshi, or General Sans
- **Weights:** 400
- **Sizes:** 10px, 16px, 24px, 64px, 96px
- **Line height:** 1.00-1.50
- **Letter spacing:** -0.03em at 96px, -0.01em at 64px and below
- **OpenType features:** `"ss01" on, "ss02" on`
- **Role:** Display and heading type — custom geometric sans used exclusively at weight 400. Headlines reach 96px with line-height 1.00, letter-spacing -0.03em. This single-weight approach forces the type to command through size alone, not boldness — a whisper-loud philosophy. Body-level Monument at 16-24px handles secondary text and large UI labels.

### Mono — Micro-labels, nav items, and small-caps category tags — monospaced at 10-14px with extreme tracking (0.06-0.16em). The wide letter-spacing on uppercase labels creates a scientific-instrument read, like serial numbers on laboratory equipment. · `--font-mono`
- **Substitute:** JetBrains Mono, IBM Plex Mono, or Space Mono
- **Weights:** 400
- **Sizes:** 10px, 12px, 14px
- **Line height:** 0.80-1.50
- **Letter spacing:** 0.06em at 14px, 0.16em at 10-12px
- **Role:** Micro-labels, nav items, and small-caps category tags — monospaced at 10-14px with extreme tracking (0.06-0.16em). The wide letter-spacing on uppercase labels creates a scientific-instrument read, like serial numbers on laboratory equipment.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 10px | 1 | 1.6px | `--text-caption` |
| body | 14px | 1.5 | 0.84px | `--text-body` |
| heading-sm | 24px | 1.24 | -0.24px | `--text-heading-sm` |
| heading | 64px | 1.06 | -0.64px | `--text-heading` |
| display | 96px | 1 | -2.88px | `--text-display` |

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
| 80 | 80px | `--spacing-80` |
| 100 | 100px | `--spacing-100` |
| 148 | 148px | `--spacing-148` |
| 200 | 200px | `--spacing-200` |
| 240 | 240px | `--spacing-240` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 8px |
| cards | 16px |
| pills | 40.798px |
| buttons | 8px |
| largeCards | 24px |

### Layout

- **Page max-width:** 1400px
- **Section gap:** 100px
- **Card padding:** 32px
- **Element gap:** 16px

## Components

### Outlined Action Button
**Role:** Primary CTA — the 'FOLLOW ALONG' button and similar conversion points

Transparent background with a 1px #ff4105 border, 8px radius, 12-16px vertical padding, 16-24px horizontal padding. Label in Monument 12-14px weight 400, color #ff4105, letter-spacing 0.06em. The outlined-not-filled treatment is deliberate — the warm orange border glows against the dark canvas without filling the visual field with a solid color block.

### Navigation Link
**Role:** Top-nav items (HOME, APPROACH, TEAM, PORTFOLIO, STORIES, JOBS)

Mono 10-12px, uppercase, letter-spacing 0.16em, color #d8eaff for inactive, #ff4105 for active (with a small marker dot or underline). Horizontal flex row, 32px gap between items, aligned left in a 1400px max-width container with the logo on the far left and CTA on the far right.

### Brand Mark
**Role:** The Atlantic.vc wordmark + geometric glyph in the nav

The 'atlantic' wordmark in Monument weight 400 at ~16px, paired with a custom geometric square glyph. White (#d8eaff) on dark, no background, sits flush-left in the nav bar.

### Hero Headline
**Role:** Oversized editorial headline that fills the viewport

Monument weight 400 at 96px, line-height 1.00, letter-spacing -0.03em. Color #d8eaff for neutral words, #1f58f2 for accent words (e.g. 'unknown', 'inevitable'). Centered or left-aligned, 50px top padding from the nav. No subheadline below — the headline IS the hero statement.

### Particle Cloud Canvas
**Role:** Full-bleed animated particle visualization behind the hero

A canvas/WebGL element rendering thousands of #1f58f2 dots on the #0d0d0f background. Dots cluster into organic wave-like formations, creating depth and movement. Occupies 100% viewport height behind the hero text. No border, no radius — bleeds edge to edge.

### Editorial Statement Block
**Role:** Centered mission paragraph appearing below the hero word-cloud section

Monument 16-24px weight 400, color #6c757f (muted), max-width ~600px centered, 32px line-height. Single paragraph, no embellishment. The muted color makes it recede — it's context for the headline, not a competing element.

### Portfolio Card Grid
**Role:** 3-column grid of portfolio company logos (softr, Wandelbots, zenjob, etc.)

Grid of square cells, each cell is #0d0d0f or #2b2f33 background with 1px #d8eaff border at ~20% opacity, 16px radius. Company logos centered inside, white or monochrome. Grid has 32px row-gap and column-gap. Small uppercase Mono labels above the grid (e.g. 'THEY' / 'HAVE' / 'BECOME' / 'INEVITABLE').

### Pioneer Profile Card
**Role:** Portrait + bio cards in the 'Meet the pioneers' section

Portrait photograph with rounded bottom corners, overlaid or paired with Monument headline text. The blue asterisk/sparkle mark (#1f58f2) appears as a decorative accent to the left of the section headline. Cards sit in a horizontal scroll or 3-column grid.

### Decorative Sparkle Mark
**Role:** The hand-drawn asterisk/sparkle used as a section indicator

Six or eight-point star drawn in #1f58f2, approximately 40px diameter, sits to the left of section headlines. This is the signature decorative element — it marks the transition from one editorial section to the next.

### Bordered Container Frame
**Role:** The wireframe-style outlined boxes that appear throughout (e.g. the hero image carousel indicators)

Rectangular containers with 1px #d8eaff border, transparent background, 8px radius. Small blue dots (#1f58f2) mark the corners. Functions as a viewport/preview frame — implies looking into something rather than displaying it directly.

### Scroll Indicator
**Role:** Down-arrow chevron at the bottom of the hero viewport

Small square frame with 1px #d8eaff border, 24px size, containing a downward chevron or dot pattern in #d8eaff. Centered horizontally at the bottom of the hero, positioned ~50px above the fold edge.

## Do's and Don'ts

### Do
- Use Monument weight 400 at display sizes (64-96px) with letter-spacing -0.03em for all editorial headlines — never bold the type to add weight, add size instead
- Apply #1f58f2 Electric Cobalt exclusively to highlight individual words inside neutral #d8eaff headlines, never to full sentences or paragraphs
- Use #ff4105 Signal Orange only for outlined action buttons and active nav state indicators — never as a background fill or body text color
- Set all borders and hairline dividers in #d8eaff at 1px, creating a unified wireframe-in-light treatment across cards, frames, and section dividers
- Set body micro-labels and nav items in Mono at 10-12px with letter-spacing 0.16em and uppercase — the wide tracking is the signature, not optional
- Layer surfaces in concentric charcoal shades (#000000 → #0d0d0f → #232529 → #2b2f33) to create depth without using shadows
- Use 16px radius for portfolio and content cards, 8px radius for buttons and small tags — keep radii subtle and consistent

### Don't
- Do not use solid filled buttons — all CTAs are outlined with chromatic borders against transparent backgrounds
- Do not use #1f58f2 or #ff4105 for body text, borders, or background fills — they are reserved for accent and action roles only
- Do not add shadows or drop-shadow elevation — depth comes from surface color stepping, not from box-shadow
- Do not use multiple accent colors simultaneously — the system is cool-monochrome with exactly one warm accent (#ff4105)
- Do not set Monument at weights other than 400 — the single-weight philosophy is the design
- Do not use rounded radii above 24px on standard components — the 40.798px pill radius is reserved for specific tag/badge treatments
- Do not add gradients — the system is flat and monochromatic within surface levels, with the particle canvas as the only visual texture

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Void | `#000000` | Page canvas — the deepest background layer |
| 1 | Carbon | `#0d0d0f` | Card surface — elevated content blocks and portfolio cells |
| 2 | Graphite | `#232529` | Body background and footer border region — mid-layer |
| 3 | Slate | `#2b2f33` | Most common card and panel surface — default elevation level |

## Elevation

No shadows are used. Depth is achieved exclusively through stepped charcoal surface colors (#000000 → #0d0d0f → #232529 → #2b2f33) and 1px #d8eaff wireframe borders. This flat, shadow-free approach keeps the visual language diagrammatic and scientific, like CAD or observatory interfaces.

## Imagery

The site uses a particle/point-cloud visual system as its primary imagery — a WebGL canvas rendering thousands of #1f58f2 dots that form organic wave and constellation patterns against the #0d0d0f background. This appears full-bleed in the hero and as a secondary decoration in the 'Unknown' section. Portrait photography appears in the 'Meet the pioneers' section — tight head-and-shoulders crops on dark backgrounds, desaturated. The decorative sparkle/asterisk mark (hand-drawn, #1f58f2, ~40px) serves as a recurring visual motif between sections. No illustration, no 3D renders, no product screenshots — the visual vocabulary is restricted to: particle systems, portrait photography, and geometric wireframe frames.

## Layout

Full-bleed dark canvas with a 1400px max-width content container. Navigation is a single horizontal bar at the top: logo left, nav items center-left, CTA right. The hero is a full-viewport-height section with a centered or left-aligned 96px Monument headline layered over the particle cloud. Below the hero, a 4-column word-cloud section (THEY / HAVE / BECOME / INEVITABLE) uses oversized Monument type as editorial scaffolding. A 3-column portfolio card grid follows, then the 'Meet the pioneers' section with a left-aligned headline (blue sparkle accent) and a horizontal row of portrait cards. Section gaps are generous (100px), creating an editorial magazine rhythm — each section breathes independently rather than flowing continuously.

## Agent Prompt Guide

primary action: no distinct CTA color
**Quick Color Reference**
- Text (primary): #d8eaff
- Text (secondary): #6c757f
- Background (page): #000000 or #0d0d0f
- Border (hairline): #d8eaff (1px)
- Accent (highlight): #1f58f2
- Outlined action border: #ff4105

**3-5 Example Component Prompts**

No distinct primary action color was observed; use the extracted neutral button treatments instead of inventing a filled CTA color.


3. **Portfolio Card**: Square cell, #0d0d0f background, 1px #d8eaff border at 20% opacity, 16px radius. Company logo or wordmark centered inside in #d8eaff. Cell sits in a 3-column grid with 32px gap. Small Mono 10px uppercase label (#d8eaff, 0.16em tracking) above the grid.

4. **Decorative Sparkle Mark**: 40px diameter, 6-point asterisk drawn with 1.5px strokes in #1f58f2. Positioned to the left of a section headline as an editorial accent. Slight rotation jitter gives it a hand-drawn quality.

5. **Editorial Statement Paragraph**: Centered, max-width 600px. Monument 16px weight 400, color #6c757f, line-height 2.0 (32px). Single paragraph, no decoration — the muted color makes it context for the surrounding visual elements.

**Type Scale Reference**
- Display (96px / 1.00 / -0.03em) — hero headlines
- Heading (64px / 1.06 / -0.01em) — section titles
- Heading-sm (24px / 1.24 / -0.01em) — sub-section titles
- Body (16px / 1.24 / -0.01em) — Monument body text
- Caption (10px / 1.00 / 0.16em) — Mono uppercase labels

## Decorative Motif System

The sparkle/asterisk mark is a signature decorative element. Use it as a section-transition indicator, always in #1f58f2, approximately 40px diameter, with hand-drawn irregularity. Pair it with the blue accent color to create visual punctuation between editorial sections. The particle/point-cloud canvas is the other signature visual — use it as a full-bleed background in hero-level sections, never as a contained or clipped element.

## Color Temperature Discipline

The system is strictly cool-temperature with one warm exception. Ice-white #d8eaff text and Electric Cobalt #1f58f2 accent dominate all visual hierarchy. The single warm color — Signal Orange #ff4105 — appears only on outlined action buttons and active navigation states. Never use #ff4105 for decorative purposes, body text, or filled backgrounds. The thermal contrast between the cool system and this one warm accent is what makes the CTA feel 'switched on' rather than just visible.

## Similar Brands

- **Arc** — Same dark-canvas editorial design with a single vivid blue accent and oversized display headlines — both treat the homepage as a typographic statement rather than a product showcase
- **Notion Capital** — VC-firm dark aesthetic with cool-white serif/sans typography and restrained accent color, but Atlantic is more electric and particle-driven
- **Astro** — Dark-mode interface with a single saturated blue as the sole accent color, Monument-like geometric display type, and editorial section rhythm with generous spacing
- **Hugging Face** — Same dark-canvas + cool-white type + single warm-orange CTA approach, though Hugging Face uses yellow emoji-like accents rather than Atlantic's electric blue editorial highlights

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-ice-white: #d8eaff;
  --color-void-black: #000000;
  --color-carbon: #0d0d0f;
  --color-graphite: #232529;
  --color-slate: #2b2f33;
  --color-iron: #41464c;
  --color-steel: #565e66;
  --color-fog: #6c757f;
  --color-iron-edge: #565657;
  --color-electric-cobalt: #1f58f2;
  --color-signal-orange: #ff4105;

  /* Typography — Font Families */
  --font-monument: 'Monument', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-mono: 'Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1;
  --tracking-caption: 1.6px;
  --text-body: 14px;
  --leading-body: 1.5;
  --tracking-body: 0.84px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.24;
  --tracking-heading-sm: -0.24px;
  --text-heading: 64px;
  --leading-heading: 1.06;
  --tracking-heading: -0.64px;
  --text-display: 96px;
  --leading-display: 1;
  --tracking-display: -2.88px;

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
  --spacing-80: 80px;
  --spacing-100: 100px;
  --spacing-148: 148px;
  --spacing-200: 200px;
  --spacing-240: 240px;

  /* Layout */
  --page-max-width: 1400px;
  --section-gap: 100px;
  --card-padding: 32px;
  --element-gap: 16px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-2xl: 16px;
  --radius-3xl: 24px;
  --radius-3xl-2: 40.798px;

  /* Named Radii */
  --radius-tags: 8px;
  --radius-cards: 16px;
  --radius-pills: 40.798px;
  --radius-buttons: 8px;
  --radius-largecards: 24px;

  /* Surfaces */
  --surface-void: #000000;
  --surface-carbon: #0d0d0f;
  --surface-graphite: #232529;
  --surface-slate: #2b2f33;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-ice-white: #d8eaff;
  --color-void-black: #000000;
  --color-carbon: #0d0d0f;
  --color-graphite: #232529;
  --color-slate: #2b2f33;
  --color-iron: #41464c;
  --color-steel: #565e66;
  --color-fog: #6c757f;
  --color-iron-edge: #565657;
  --color-electric-cobalt: #1f58f2;
  --color-signal-orange: #ff4105;

  /* Typography */
  --font-monument: 'Monument', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-mono: 'Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1;
  --tracking-caption: 1.6px;
  --text-body: 14px;
  --leading-body: 1.5;
  --tracking-body: 0.84px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.24;
  --tracking-heading-sm: -0.24px;
  --text-heading: 64px;
  --leading-heading: 1.06;
  --tracking-heading: -0.64px;
  --text-display: 96px;
  --leading-display: 1;
  --tracking-display: -2.88px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-80: 80px;
  --spacing-100: 100px;
  --spacing-148: 148px;
  --spacing-200: 200px;
  --spacing-240: 240px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-2xl: 16px;
  --radius-3xl: 24px;
  --radius-3xl-2: 40.798px;
}
```
