# Smiling Wolf — Style Reference
> Print magazine in monochrome.

Two-tone cream and near-black panels alternate like editorial spreads; monospace metadata stamps float over large display type with tight tracking.

**Theme:** mixed

Smiling Wolf uses an editorial Swiss-minimalist language: a warm off-white canvas (#f7f3f0) and near-black surfaces (#131713) alternate to create a strict two-tone rhythm, with no chromatic accent, no gradients, and no shadows anywhere. Typography carries the entire brand voice — a custom display serif/sans hybrid (Bagoss Standard) speaks at large sizes with tight negative tracking and near-unity line-heights, while a wide-tracked monospace (General Grotesque Mono) stamps every label, tag, and metadata line in uppercase 9-10px. All corners are 4px sharp. The result reads like a print magazine spread — high-contrast blocks, generous negative space, hairline dividers, and a refusal of decoration.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Bone | `#f7f3f0` | `--color-bone` | Page canvas, card surfaces, dark-section text — warm off-white that keeps the page from feeling clinical |
| Obsidian | `#131713` | `--color-obsidian` | Primary text on light canvas, dark-section backgrounds, inverse-surface text — near-black with a barely-perceptible green undertone |
| Carbon | `#000000` | `--color-carbon` | Hairline borders, dividers, link strokes — the structural outline color; appears 1340× as border, defining every panel edge |
| Ash | `#bebcb9` | `--color-ash` | Secondary borders, inactive dividers — a step lighter than Carbon for de-emphasized edges |
| Graphite | `#858582` | `--color-graphite` | Muted helper text, secondary metadata, label text — sits at AA on dark and fails on light, so it belongs in the dark sections and monospace stamps |

## Tokens — Typography

### sans-serif — sans-serif — detected in extracted data but not described by AI · `--font-sans-serif`
- **Weights:** 400
- **Sizes:** 12px
- **Line height:** 1.2
- **Role:** sans-serif — detected in extracted data but not described by AI

### Bagoss Standard — Primary typeface for headings, subheadings, and body — weights 385 and 520 are near-custom; the 520 medium at 59-63px with -0.02em tracking is the display voice, the 400 at 14-20px is body · `--font-bagoss-standard`
- **Substitute:** Söhne, Inter, or General Sans at matching weights
- **Weights:** 385, 400, 520
- **Sizes:** 14, 20, 59, 63
- **Line height:** 0.98–1.40
- **Letter spacing:** -0.0200em at display (59-63px), -0.0100em at subheading, 0.0100em at body
- **OpenType features:** `"blwf", "cv03", "cv04", "cv09", "cv11"`
- **Role:** Primary typeface for headings, subheadings, and body — weights 385 and 520 are near-custom; the 520 medium at 59-63px with -0.02em tracking is the display voice, the 400 at 14-20px is body

### General Grotesque Mono — All-caps metadata, category labels, footer blocks — the 0.10em positive tracking at 9-10px is the signature stamp: every nav item, tagline, and micro-label uses it · `--font-general-grotesque-mono`
- **Substitute:** JetBrains Mono, IBM Plex Mono, or Berkeley Mono
- **Weights:** 400
- **Sizes:** 9, 10
- **Line height:** 1.60
- **Letter spacing:** 0.1000em
- **OpenType features:** `"blwf", "cv03", "cv04", "cv09", "cv11"`
- **Role:** All-caps metadata, category labels, footer blocks — the 0.10em positive tracking at 9-10px is the signature stamp: every nav item, tagline, and micro-label uses it

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| body | 14px | 1.4 | 0.14px | `--text-body` |
| subheading | 20px | 1.15 | -0.2px | `--text-subheading` |
| display | 59px | 0.98 | -1.18px | `--text-display` |
| display-lg | 63px | 1 | -1.26px | `--text-display-lg` |

## Tokens — Spacing & Shapes

**Density:** compact

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 6 | 6px | `--spacing-6` |
| 7 | 7px | `--spacing-7` |
| 8 | 8px | `--spacing-8` |
| 10 | 10px | `--spacing-10` |
| 14 | 14px | `--spacing-14` |
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 40 | 40px | `--spacing-40` |
| 60 | 60px | `--spacing-60` |
| 80 | 80px | `--spacing-80` |
| 90 | 90px | `--spacing-90` |
| 120 | 120px | `--spacing-120` |
| 180 | 180px | `--spacing-180` |
| 200 | 200px | `--spacing-200` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 4px |
| cards | 4px |
| images | 4px |
| buttons | 4px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 60-80px
- **Card padding:** 20px
- **Element gap:** 10px

## Components

### Display Headline
**Role:** Hero and section titles

Bagoss Standard weight 520 at 59-63px, line-height 0.98-1.0, letter-spacing -0.02em, color #131713 on Bone or #f7f3f0 on Obsidian. The near-unity line-height makes multi-line headlines lock into a tight block.

### Monospace Metadata Label
**Role:** Category tags, nav items, footer labels, timestamps

General Grotesque Mono weight 400, 9-10px, line-height 1.6, letter-spacing 0.10em, uppercase. Color: #131713 on Bone, #f7f3f0 on Obsidian, or #858582 for de-emphasized.

### Hairline Divider
**Role:** Section and row separators

1px solid #000000 border, full-width or proportional. Appears 1340× in the data — the most-used visual element. No rounded corners.

### Image Card
**Role:** Project thumbnails, journal hero images

4px border-radius, 1px #000000 border, full-bleed image with no overlay text. The border is structural, not decorative.

### Outlined Action Border
**Role:** Featured/metadata badge borders

1px solid #000000, 4px radius, padding 6px 10px. Contains uppercase monospace text at 9-10px. No fill — ghost style.

### Dark CTA Panel
**Role:** Contact/hero conversion sections

Full-bleed #131713 background. Left: 59-63px display headline in #f7f3f0. Right: stacked list of three monospace CTA links (e.g., 'Start a Project →', 'Say Hello →', 'Call Us →') separated by 1px #f7f3f0 hairline dividers, each row 60px tall, with a right-aligned arrow in #f7f3f0.

### Footer Block
**Role:** Site footer with contact details and nav

Bone background, 1px Carbon top border. Three monospace columns: left = contact email, center = social links, right = physical address. 9-10px uppercase, 0.10em tracking. Logo mark bottom-left in #131713.

### Top Navigation Bar
**Role:** Primary site navigation

Bone background, no border. Left: logo + 'SMILING WOLF' monospace stamp. Center: 'BRAND & DIGITAL AGENCY' monospace descriptor. Right: 'WORK ABOUT JOURNAL CONTACT' monospace nav, 9-10px, 0.10em tracking. Fixed-height, generous horizontal padding.

### CTA Link Row
**Role:** Action items in the dark panel

Full-width row, 60px height, 1px bottom border in #f7f3f0 (on Obsidian) or #000000 (on Bone). Left-aligned monospace label, right-aligned arrow character (→). Hover: no fill change, arrow translates 4px right.

### Project Grid Card
**Role:** Featured work thumbnails in the journal/work grid

Two-column grid on the work index. Each card: 4px radius, 1px #000000 border, image fills card edge-to-edge, monospace category label overlaid or positioned below in 9-10px.

## Do's and Don'ts

### Do
- Use only the five neutrals — Bone #f7f3f0, Obsidian #131713, Carbon #000000, Ash #bebcb9, Graphite #858582. No chromatic color, ever.
- Set display headlines in Bagoss Standard weight 520 at 59-63px with -0.02em tracking and line-height 0.98-1.0.
- Stamp all metadata, labels, and nav in General Grotesque Mono 9-10px uppercase with 0.10em tracking.
- Alternate sections between Bone and Obsidian full-bleed — never blend them with gradients or shadows.
- Use 4px border-radius on every rectangular element (cards, images, tags). No exceptions.
- Separate content with 1px #000000 hairlines, not spacing alone.
- Keep element gaps at 10px and section gaps at 60-80px; the rhythm depends on tight clustering punctuated by large breaks.

### Don't
- Don't introduce any color outside the five neutrals — no blues, no reds, no accents.
- Don't use shadows, glows, or blurs for elevation. Use surface flips and hairlines.
- Don't round corners beyond 4px. The design is structurally sharp.
- Don't set body copy above 20px or below 14px — the type scale is intentionally narrow.
- Don't use sans-serif for headings. Bagoss Standard carries the brand; system sans is only for sub-12px utility text.
- Don't set monospace text at sizes above 10px — the small stamp size is what makes it function as a label, not a heading.
- Don't use centered body text. The layout is left-aligned with tight tracking.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Bone Canvas | `#f7f3f0` | Default page background — warm off-white dominates the work and editorial sections |
| 2 | Obsidian Panel | `#131713` | Full-bleed dark sections — hero CTA panels, footer, and alternating bands that flip the type to Bone |

## Elevation

Zero shadows. All separation is achieved through: (1) alternating Bone/Obsidian surface flips, (2) 1px hairline borders in Carbon, and (3) generous negative space. The design treats shadow as an admission of weak layout — every panel edge is either a color change or a 1px line.

## Imagery

Imagery is minimal and editorial: project thumbnails appear as rectangular crops with 4px corners and 1px Carbon borders, presented in a two-column grid. No lifestyle photography, no decorative illustration, no abstract graphics. When present, photographs are tightly cropped, natural-color, and treated as document scans rather than brand assets. The dominant visual is typography itself — the 59-63px display headlines and the wide-tracked monospace stamps are the imagery.

## Layout

Full-bleed page with alternating surface bands. The dark CTA panel uses a two-column split: left half holds a 59-63px display headline, right half stacks three monospace CTA rows separated by 1px hairlines. The light sections use a max-width ~1200px centered container. The work grid is a two-column card layout with equal gutters. Navigation is a single fixed-height top bar with logo-left, descriptor-center, nav-right. The footer is a three-column monospace block beneath a 1px Carbon rule. Sections breathe with 60-80px vertical gaps; internal element gaps stay at 10px.

## Agent Prompt Guide

**Quick Color Reference**
- text: #131713
- background: #f7f3f0
- dark surface: #131713
- border: #000000
- muted text: #858582
- primary action: no distinct CTA color

**Example Component Prompts**

No distinct primary action color was observed; use the extracted neutral button treatments instead of inventing a filled CTA color.

2. **Monospace Nav Bar**: Bone #f7f3f0 background, no border. Left: logo + 'SMILING WOLF' in General Grotesque Mono 9px uppercase 0.10em tracking #131713. Center: 'BRAND & DIGITAL AGENCY' same style. Right: 'WORK  ABOUT  JOURNAL  CONTACT' spaced apart, same monospace treatment.

3. **Project Grid Card**: 4px border-radius, 1px solid #000000 border, image fills edge-to-edge, no padding. Below image: monospace 9px uppercase category label in #131713, 10px gap.

4. **Footer Block**: Bone #f7f3f0 background, 1px #000000 top border, 60px padding-top. Three monospace columns at 9-10px, 0.10em tracking, uppercase, color #131713. Left: email. Center: social links. Right: address. Logo mark bottom-left.

5. **Display Headline Block**: Bagoss Standard weight 520, 59px, line-height 0.98, letter-spacing -1.18px, color #131713 on Bone canvas. Two-line max. No decoration below.

## Similar Brands

- **Pentagram** — Same editorial two-tone surface alternation and oversized display type against restrained monochrome palette
- **Manual (manualcreative.com)** — Shared wide-tracked monospace metadata stamps and 1px hairline-divided content rows
- **Studio Dumbar** — Same Swiss-minimalist restraint: warm off-white canvas, near-black inverse panels, custom display serif, zero shadows
- **Locomotive (locomotive.ca)** — Agency sites that use compact monospace labels and tight negative-tracking display headlines in a strict two-color system

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-bone: #f7f3f0;
  --color-obsidian: #131713;
  --color-carbon: #000000;
  --color-ash: #bebcb9;
  --color-graphite: #858582;

  /* Typography — Font Families */
  --font-sans-serif: 'sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-bagoss-standard: 'Bagoss Standard', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-general-grotesque-mono: 'General Grotesque Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-body: 14px;
  --leading-body: 1.4;
  --tracking-body: 0.14px;
  --text-subheading: 20px;
  --leading-subheading: 1.15;
  --tracking-subheading: -0.2px;
  --text-display: 59px;
  --leading-display: 0.98;
  --tracking-display: -1.18px;
  --text-display-lg: 63px;
  --leading-display-lg: 1;
  --tracking-display-lg: -1.26px;

  /* Typography — Weights */
  --font-weight-w385: 385;
  --font-weight-regular: 400;
  --font-weight-w520: 520;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-6: 6px;
  --spacing-7: 7px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-14: 14px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-40: 40px;
  --spacing-60: 60px;
  --spacing-80: 80px;
  --spacing-90: 90px;
  --spacing-120: 120px;
  --spacing-180: 180px;
  --spacing-200: 200px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 60-80px;
  --card-padding: 20px;
  --element-gap: 10px;

  /* Border Radius */
  --radius-md: 4px;

  /* Named Radii */
  --radius-tags: 4px;
  --radius-cards: 4px;
  --radius-images: 4px;
  --radius-buttons: 4px;

  /* Surfaces */
  --surface-bone-canvas: #f7f3f0;
  --surface-obsidian-panel: #131713;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-bone: #f7f3f0;
  --color-obsidian: #131713;
  --color-carbon: #000000;
  --color-ash: #bebcb9;
  --color-graphite: #858582;

  /* Typography */
  --font-sans-serif: 'sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-bagoss-standard: 'Bagoss Standard', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-general-grotesque-mono: 'General Grotesque Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-body: 14px;
  --leading-body: 1.4;
  --tracking-body: 0.14px;
  --text-subheading: 20px;
  --leading-subheading: 1.15;
  --tracking-subheading: -0.2px;
  --text-display: 59px;
  --leading-display: 0.98;
  --tracking-display: -1.18px;
  --text-display-lg: 63px;
  --leading-display-lg: 1;
  --tracking-display-lg: -1.26px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-6: 6px;
  --spacing-7: 7px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-14: 14px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-40: 40px;
  --spacing-60: 60px;
  --spacing-80: 80px;
  --spacing-90: 90px;
  --spacing-120: 120px;
  --spacing-180: 180px;
  --spacing-200: 200px;

  /* Border Radius */
  --radius-md: 4px;
}
```
