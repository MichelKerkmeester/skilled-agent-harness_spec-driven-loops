# Harness.io — Style Reference
> midnight mission control with phosphor-green accents

**Theme:** dark

Harness's Gitness surface reads as a nocturnal command deck: near-black canvas (#070707) with stacked card surfaces in marginally lighter shades, oversized display headlines in a condensed Calsans face with positive tracking, and a teal/mint accent (#70dcd3) that surfaces on highlight cards like a phosphor monitor glow. The page stays quiet and high-contrast — white text at AAA contrast on deep neutrals, hairline borders in light gray (not dark) to define edges against the dark canvas, and pill-shaped controls (800px radius) that feel like physical hardware buttons. Color is rationed: one bright blue (#0092e4) for active link borders and one mint (#70dcd3) for accent cards, nothing else. Spacing breathes — generous card padding, comfortable section gaps, and large display sizes that let the type carry the hierarchy rather than color or weight.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Void Canvas | `#070707` | `--color-void-canvas` | Page background, deepest surface — near-black, the floor everything else sits on |
| Carbon Plate | `#0d0e12` | `--color-carbon-plate` | Primary card surface, one step above the canvas — the dominant elevated panel |
| Obsidian | `#141418` | `--color-obsidian` | Secondary card surface, code blocks, nested panels |
| Iron Edge | `#2e3038` | `--color-iron-edge` | Mid-tier surface, dividers, hover overlays on dark surfaces |
| Steel Border | `#22222a` | `--color-steel-border` | Heavy structural borders, button outlines on dark, nav separators |
| Pure White | `#ffffff` | `--color-pure-white` | Primary text, filled pill button fill, icon strokes — the only high-luminance neutral |
| Cloud Mist | `#f0f0f0` | `--color-cloud-mist` | Secondary text, soft fills, muted surface highlights |
| Fog | `#d9dae5` | `--color-fog` | Card hairline borders — counterintuitively light on the dark canvas, defining card edges by luminosity contrast |
| Ash | `#c8cad0` | `--color-ash` | Body text secondary, muted descriptions, helper text |
| Graphite | `#aeaeb7` | `--color-graphite` | Tertiary body text, subdued labels, disabled-ish state |
| Slate Mute | `#a2a4a9` | `--color-slate-mute` | Nav borders, inactive nav text, structural dividers in chrome |
| Cinder | `#60606c` | `--color-cinder` | Deep muted text, low-priority links, icon rest state |
| Phosphor Mint | `#70dcd3` | `--color-phosphor-mint` | Accent card fill, highlight surfaces — the signature brand glow, reserved for featured cards and stat panels |
| Signal Blue | `#0092e4` | `--color-signal-blue` | Link borders, active link text, focus accents — the interface's action stroke |
| Ice Blue | `#a6e5f2` | `--color-ice-blue` | Decorative soft borders, light accent strokes on cards |
| Current Blue | `#00ade4` | `--color-current-blue` | Active nav state, selected menu items, current-page indicator |
| Deep Signal | `#0677d4` | `--color-deep-signal` | Input focus border, form active state, info semantic stroke |
| Verdant Edge | `#75ae4c` | `--color-verdant-edge` | Green accent for outlined action borders, linked labels, and lightweight interactive emphasis. Use as a supporting accent, not as a status color |
| Steel Iris | `#929dbd` | `--color-steel-iris` | Card decorative borders with cool blue-gray tint, secondary card outlines |

## Tokens — Typography

### Geist — Body, UI, and navigation typeface. Geist handles all functional text: body copy at 16px/1.50, nav items at 14-15px, button labels at 14-16px, captions at 12px. Tight negative tracking (-0.017em to -0.020em) at display sizes creates density; positive tracking (0.042-0.094em) at 8-10px gives badge and micro-text an uppercase stencil feel. · `--font-geist`
- **Substitute:** Inter, or system-ui as fallback
- **Weights:** 300, 400, 500, 600
- **Sizes:** 8, 10, 12, 14, 15, 16, 18, 20, 22, 24, 40
- **Line height:** 0.88, 1.00, 1.13, 1.20, 1.22, 1.37, 1.38, 1.44, 1.50, 1.57
- **Letter spacing:** -0.020em at large sizes, -0.017em at 24-40px, 0.016-0.018em at 14-16px body, 0.042-0.094em at 8-12px captions/badges
- **OpenType features:** `"liga" on`
- **Role:** Body, UI, and navigation typeface. Geist handles all functional text: body copy at 16px/1.50, nav items at 14-15px, button labels at 14-16px, captions at 12px. Tight negative tracking (-0.017em to -0.020em) at display sizes creates density; positive tracking (0.042-0.094em) at 8-10px gives badge and micro-text an uppercase stencil feel.

### Calsans — Display and heading typeface. Calsans is a condensed, geometric sans with positive tracking (0.056em) that makes headlines feel engineered rather than editorial — letters spread apart like instrument panel labels. Weight 300 used at largest sizes creates an anti-confident presence: massive, airy, never shouting. Weight 600 appears in mid-size headings for grounding. · `--font-calsans`
- **Substitute:** Space Grotesk, or any wide-tracked geometric sans
- **Weights:** 300, 600
- **Sizes:** 18, 24, 32, 34, 56, 64, 72, 88
- **Line height:** 0.96, 1.00, 1.10, 1.15, 1.20, 1.37
- **Letter spacing:** 0.056em at all sizes (~4.9px at 88px, ~3.1px at 56px, ~1.8px at 32px)
- **OpenType features:** `"liga" on`
- **Role:** Display and heading typeface. Calsans is a condensed, geometric sans with positive tracking (0.056em) that makes headlines feel engineered rather than editorial — letters spread apart like instrument panel labels. Weight 300 used at largest sizes creates an anti-confident presence: massive, airy, never shouting. Weight 600 appears in mid-size headings for grounding.

### Helvetica — Helvetica — detected in extracted data but not described by AI · `--font-helvetica`
- **Weights:** 400, 600
- **Sizes:** 13px
- **Line height:** 1.69
- **OpenType features:** `"liga"`
- **Role:** Helvetica — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.22 | 0.5px | `--text-caption` |
| body-sm | 14px | 1.44 | 0.25px | `--text-body-sm` |
| body | 16px | 1.5 | 0.27px | `--text-body` |
| subheading | 20px | 1.5 | -0.34px | `--text-subheading` |
| heading-sm | 32px | 1.1 | 1.8px | `--text-heading-sm` |
| heading | 56px | 1.1 | 3.1px | `--text-heading` |
| heading-lg | 72px | 1 | 4px | `--text-heading-lg` |
| display | 88px | 0.96 | 4.9px | `--text-display` |

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
| 56 | 56px | `--spacing-56` |
| 80 | 80px | `--spacing-80` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 20px |
| badges | 800px |
| inputs | 5px |
| buttons | 800px |
| nestedCards | 16px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| subtle | `rgba(0, 0, 0, 0.05) 2px 2px 0px 0px` | `--shadow-subtle` |
| subtle-2 | `rgb(255, 255, 255) 0px -1px 0px 0px inset, rgb(255, 255, ...` | `--shadow-subtle-2` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 24px
- **Element gap:** 16px

## Components

### Hero Headline (Calsans Display)
**Role:** Primary page headline

Calsans weight 300 at 88px/0.96 line-height, color #ffffff, letter-spacing 0.056em (~4.9px). The positive tracking on massive type is signature — headlines feel like instrument panel readouts, not editorial. Two-tone color treatment on hero: 'The End-To-End' in pure white, with a secondary line optionally in Phosphor Mint (#70dcd3) for the opening phrase.

### Filled Pill Button (Primary)
**Role:** Primary action CTA

Background #ffffff, text #070707, border-radius 800px (full pill), padding 12px 24px, font Geist 500 at 16px. Dark text on white fill — the inversion of the dark interface makes the button physically pop. Subtle inset highlight: rgb(255,255,255) inset shadows on the top/sides create a light edge against the white fill, giving the pill a slightly embossed quality.

### Ghost Pill Button (Secondary)
**Role:** Secondary or navigational action

Transparent background, border 1px solid #ffffff, text #ffffff, border-radius 800px, padding 12px 24px, Geist 400 at 16px. The border is bright white at full opacity — the button's identity comes from the outline, not the fill.

### Dark Surface Card
**Role:** Primary content container

Background #0d0e12, border 1px solid #d9dae5 (light border on dark surface), border-radius 20px, padding 24px. The counterintuitive light border defines the card edge against the dark canvas — this is the system-defining move. No shadow; the border is the elevation.

### Phosphor Accent Card
**Role:** Featured/highlight card

Background #70dcd3 (the mint), no border or subtle #d9dae5 border, border-radius 20px, padding 24px. Used sparingly — one per viewport maximum. The teal fill makes the card look lit from within, like a phosphor screen.

### Code/Syntax Surface
**Role:** Code blocks, terminal output

Background #141418 (Obsidian), border-radius 16px, padding 16-20px, Geist Mono (or Geist fallback) at 13-14px, text #aeaeb7 with syntax highlighting. Sits nested inside Carbon Plate cards.

### Navigation Bar
**Role:** Top site navigation

Background #070707 (transparent over canvas), height ~64px, logo left, links centered in Geist 14px, #ffffff text with #a2a4a9 for inactive items, border-bottom 1px solid #a2a4a9 (again, light borders on dark). Right side: contact link + filled pill CTA. Sticky, no background blur needed against solid dark canvas.

### Activity Row (PR/Commit List)
**Role:** Git activity feed item

Horizontal row: avatar circle (32px) + commit message in Geist 14px weight 500 (#ffffff) + metadata in Geist 12px (#aeaeb7) + status dot (8px circle) in Phosphor Mint (#70dcd3) for pass, Verdant Edge (#75ae4c) for success, or a warm tone for warning. Padding 10px 0, separated by 1px #2e3038 dividers.

### Input Field
**Role:** Form text input

Background #0d0e12, border 1px solid #2e3038 (rest) or #0677d4 (focus), border-radius 5px, padding 12px, text Geist 14px #ffffff, placeholder #60606c. Focus adds a 1px Deep Signal border — no glow ring, just a sharp color change.

### Status Badge
**Role:** Inline status indicator

Border-radius 800px (pill), padding 2px 8px, Geist 11-12px with 0.042-0.094em tracking. Variants: success = border 1px #75ae4c with text #75ae4c, info = border 1px #0677d4 with text #0677d4. Outlined style, never filled.

### Section Header (Eyebrow + Title)
**Role:** Section introduction

Eyebrow label in Geist 12px uppercase with 0.094em tracking, color #a6e5f2 or #929dbd, above a Calsans heading at 56px/1.1 weight 300. The uppercase eyebrow with wide tracking is the section's quiet signal.

### 3D Product Visual Block
**Role:** Hero and feature illustration

Full-bleed rendered product imagery with neon-lit 3D objects on a dark gradient ground. The image is not a flat screenshot — it has dimensional lighting, glowing edges, and a horizon line. Blends into the #070707 canvas with no hard mask.

### Footer Link Column
**Role:** Footer navigation section

Column heading in Geist 14px weight 500 #ffffff, links in Geist 13-14px weight 400 #aeaeb7 with no underline. 8-16px vertical gap between items. Four-column grid with generous column gaps (32-40px).

## Do's and Don'ts

### Do
- Use Calsans for all headlines at 56px or larger with its native positive tracking (0.056em)
- Define card edges with a 1px #d9dae5 light border, not shadows or background contrast alone
- Use the filled white pill (800px radius, #ffffff fill, #070707 text) for the single primary action on any screen
- Apply the Phosphor Mint (#70dcd3) accent to no more than one card or panel per viewport
- Use 20px radius for cards and 800px (pill) for all interactive controls
- Keep body text at 16px Geist weight 400 with -0.017em tracking; use weight 500 only for emphasized labels
- Anchor all dark surfaces to the Void Canvas (#070707) as the base; stack upward through #0d0e12 → #141418

### Don't
- Don't use drop shadows on cards or panels — the system defines elevation through light borders and surface luminance steps
- Don't fill buttons with color — the only filled button is white, everything else is ghost/outlined
- Don't use multiple accent colors in one section — Phosphor Mint and Signal Blue should not co-occur on the same surface
- Don't set body text below 14px or above 18px — the reading range is narrow and confident
- Don't apply negative letter-spacing to Calsans — its positive tracking is structural to the typeface's identity
- Don't use dark borders on cards; the system uses light (#d9dae5) borders to define edges on dark surfaces
- Don't break the dark theme with light sections — the entire page lives in the dark spectrum

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Void Canvas | `#070707` | Page background, the base layer |
| 1 | Carbon Plate | `#0d0e12` | Primary cards, hero feature panels, content blocks |
| 2 | Obsidian | `#141418` | Nested cards, code surfaces, secondary panels within cards |
| 3 | Iron Edge | `#2e3038` | Hover states, active overlays, raised interactive surfaces |

## Elevation

- **Dark Surface Card:** `none (relies on 1px #d9dae5 border for definition)`
- **Filled Pill Button:** `rgba(0, 0, 0, 0.05) 2px 2px 0px 0px, rgb(255, 255, 255) 0px -1px 0px 0px inset, rgb(255, 255, 255) 1px 0px 0px 0px inset, rgb(255, 255, 255) -1px 0px 0px 0px inset, rgb(255, 255, 255) 0px 1px 0px 0px inset`
- **Input Field:** `rgba(0, 0, 0, 0.05) 2px 2px 0px 0px`

## Imagery

Hero and feature sections use 3D-rendered product visuals: curved tracks, flowing light ribbons, abstract geometric objects lit with neon edge-light. These renders sit on dark gradient grounds (linear-gradient from rgb(22,48,82) to rgb(13,14,18)) and blend seamlessly into the #070707 canvas. No photography, no flat illustration — the visual language is CGI/dimensional. Icons in the UI are minimal and appear as simple line glyphs in #ffffff or muted grays. The only flat content imagery is the activity feed with circular avatars and status dots.

## Layout

Max-width 1200px centered content. Hero is split 50/50: headline and subtext left-aligned, 3D visual bleeding to right edge. Subsequent sections are full-bleed dark bands with centered content. Feature sections alternate between 2-column text+visual layouts and centered headline + card grid. Card grids are typically 2-3 columns with 20-24px gaps. Section gaps are generous (64-80px). Navigation is a single sticky top bar, no sidebar. The page rhythm is: dark hero → dark feature section → dark accent section → dark footer — it never breaks from the dark theme.

## Agent Prompt Guide

**Quick Color Reference**
- canvas: #070707
- card surface: #0d0e12
- primary text: #ffffff
- secondary text: #aeaeb7 / #c8cad0
- border: #d9dae5 (light on dark)
- accent: #70dcd3 (mint)
- link/active: #0092e4 (blue)
- primary action: #ffffff (filled action)

**Example Component Prompts**

1. Create a Primary Action Button: #ffffff background, #070707 text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.

2. **Feature Card Grid**: 3-column grid on #070707 background, 20px gaps. Each card: background #0d0e12, border 1px solid #d9dae5, border-radius 20px, padding 24px. Icon in #70dcd3 at 24px. Title in Calsans 32px weight 300, color #ffffff, letter-spacing 0.056em. Body in Geist 16px weight 400, color #aeaeb7.

3. **Activity Feed Row**: Background #0d0e12 card with 1px #d9dae5 border, 20px radius. Each row: 32px circular avatar + Geist 14px weight 500 text in #ffffff + Geist 12px metadata in #aeaeb7 + 8px status dot in #70dcd3. Rows separated by 1px #2e3038 dividers. Row padding 10px 0.


5. **Footer Link Grid**: 4-column grid on #070707 background. Column headers in Geist 14px weight 500, #ffffff. Links in Geist 14px weight 400, #aeaeb7, no underline. 12px row gap, 40px column gap. Bottom bar: copyright in Geist 13px #60606c, social icons (32px) in #a2a4a9.

## Similar Brands

- **Linear** — Same near-black canvas, high-contrast white text, pill-shaped controls, and minimal use of color as functional punctuation rather than decoration
- **Vercel** — Dark-mode devtools aesthetic with geometric sans display type, generous spacing, and a single accent color used sparingly
- **Supabase** — Deep dark surfaces with a distinct teal/green accent for featured elements, and light hairline borders defining card edges on dark backgrounds
- **Railway** — Near-black canvas with stacked neutral surface levels, pill controls, and a restrained palette where color appears only as small functional accents
- **Resend** — Dark devtools surface with oversized display type, white pill CTAs on dark backgrounds, and quiet use of a single accent color

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-void-canvas: #070707;
  --color-carbon-plate: #0d0e12;
  --color-obsidian: #141418;
  --color-iron-edge: #2e3038;
  --color-steel-border: #22222a;
  --color-pure-white: #ffffff;
  --color-cloud-mist: #f0f0f0;
  --color-fog: #d9dae5;
  --color-ash: #c8cad0;
  --color-graphite: #aeaeb7;
  --color-slate-mute: #a2a4a9;
  --color-cinder: #60606c;
  --color-phosphor-mint: #70dcd3;
  --color-signal-blue: #0092e4;
  --color-ice-blue: #a6e5f2;
  --color-current-blue: #00ade4;
  --color-deep-signal: #0677d4;
  --color-verdant-edge: #75ae4c;
  --color-steel-iris: #929dbd;

  /* Typography — Font Families */
  --font-geist: 'Geist', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-calsans: 'Calsans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-helvetica: 'Helvetica', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.22;
  --tracking-caption: 0.5px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.44;
  --tracking-body-sm: 0.25px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: 0.27px;
  --text-subheading: 20px;
  --leading-subheading: 1.5;
  --tracking-subheading: -0.34px;
  --text-heading-sm: 32px;
  --leading-heading-sm: 1.1;
  --tracking-heading-sm: 1.8px;
  --text-heading: 56px;
  --leading-heading: 1.1;
  --tracking-heading: 3.1px;
  --text-heading-lg: 72px;
  --leading-heading-lg: 1;
  --tracking-heading-lg: 4px;
  --text-display: 88px;
  --leading-display: 0.96;
  --tracking-display: 4.9px;

  /* Typography — Weights */
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;

  /* Spacing */
  --spacing-unit: 8px;
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-56: 56px;
  --spacing-80: 80px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 24px;
  --element-gap: 16px;

  /* Border Radius */
  --radius-sm: 1px;
  --radius-md: 5px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-3xl: 24px;
  --radius-3xl-2: 32px;
  --radius-3xl-3: 40px;
  --radius-full: 50px;
  --radius-full-2: 800px;

  /* Named Radii */
  --radius-cards: 20px;
  --radius-badges: 800px;
  --radius-inputs: 5px;
  --radius-buttons: 800px;
  --radius-nestedcards: 16px;

  /* Shadows */
  --shadow-subtle: rgba(0, 0, 0, 0.05) 2px 2px 0px 0px;
  --shadow-subtle-2: rgb(255, 255, 255) 0px -1px 0px 0px inset, rgb(255, 255, 255) 1px 0px 0px 0px inset, rgb(255, 255, 255) -1px 0px 0px 0px inset, rgb(255, 255, 255) 0px 1px 0px 0px inset;

  /* Surfaces */
  --surface-void-canvas: #070707;
  --surface-carbon-plate: #0d0e12;
  --surface-obsidian: #141418;
  --surface-iron-edge: #2e3038;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-void-canvas: #070707;
  --color-carbon-plate: #0d0e12;
  --color-obsidian: #141418;
  --color-iron-edge: #2e3038;
  --color-steel-border: #22222a;
  --color-pure-white: #ffffff;
  --color-cloud-mist: #f0f0f0;
  --color-fog: #d9dae5;
  --color-ash: #c8cad0;
  --color-graphite: #aeaeb7;
  --color-slate-mute: #a2a4a9;
  --color-cinder: #60606c;
  --color-phosphor-mint: #70dcd3;
  --color-signal-blue: #0092e4;
  --color-ice-blue: #a6e5f2;
  --color-current-blue: #00ade4;
  --color-deep-signal: #0677d4;
  --color-verdant-edge: #75ae4c;
  --color-steel-iris: #929dbd;

  /* Typography */
  --font-geist: 'Geist', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-calsans: 'Calsans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-helvetica: 'Helvetica', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.22;
  --tracking-caption: 0.5px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.44;
  --tracking-body-sm: 0.25px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: 0.27px;
  --text-subheading: 20px;
  --leading-subheading: 1.5;
  --tracking-subheading: -0.34px;
  --text-heading-sm: 32px;
  --leading-heading-sm: 1.1;
  --tracking-heading-sm: 1.8px;
  --text-heading: 56px;
  --leading-heading: 1.1;
  --tracking-heading: 3.1px;
  --text-heading-lg: 72px;
  --leading-heading-lg: 1;
  --tracking-heading-lg: 4px;
  --text-display: 88px;
  --leading-display: 0.96;
  --tracking-display: 4.9px;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-56: 56px;
  --spacing-80: 80px;

  /* Border Radius */
  --radius-sm: 1px;
  --radius-md: 5px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-3xl: 24px;
  --radius-3xl-2: 32px;
  --radius-3xl-3: 40px;
  --radius-full: 50px;
  --radius-full-2: 800px;

  /* Shadows */
  --shadow-subtle: rgba(0, 0, 0, 0.05) 2px 2px 0px 0px;
  --shadow-subtle-2: rgb(255, 255, 255) 0px -1px 0px 0px inset, rgb(255, 255, 255) 1px 0px 0px 0px inset, rgb(255, 255, 255) -1px 0px 0px 0px inset, rgb(255, 255, 255) 0px 1px 0px 0px inset;
}
```
