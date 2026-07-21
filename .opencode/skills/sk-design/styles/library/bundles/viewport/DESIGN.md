# Viewport — Style Reference
> Mint sticky-notes on a glass desk. A clean productivity canvas where one vivid indigo button is the only thing that 'switches on' against pale teal surfaces and white walls.

**Theme:** light

Viewport uses a bright, airy workspace language: pure white canvas, generous breathing room, and a signature mint-teal surface that softens sections without darkening them. The entire chromatic story is a tight two-color duo — vivid indigo for actions and mint-teal for surfaces — connected by a cyan-to-violet gradient that lives only on the primary CTA. Typography is calm and geometric: HK Sentiments Bold for headlines at a whisper-heavy 700 weight, Silka for everything functional at 14–18px, tracking pulled tight across the scale. Components feel like smooth tiles: large 16px radii on cards, 12px on buttons, 100px pills for tags, and shadows that are either barely-there gray or a branded cyan glow — never neutral mid-tones. Layouts center a single headline per section, then let wide product screenshots do the work, often floating over the mint surface like sticky notes on a glass desk.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Indigo Voltage | `linear-gradient(0deg, rgb(0,202,242) 0%, rgb(77,77,255) 100%)` | `--color-indigo-voltage` | Primary action buttons, active nav states, accent borders, heading highlights — the sole chromatic brand color, making every interactive element unmistakable; Primary CTA button fill — the only gradient in the system, flowing from cyan to indigo vertically |
| Mint Whisper | `radial-gradient(102% 82% at 50% 107.7%, rgba(0,202,242,0.3) 0%, rgb(241,243,245) 100%)` | `--color-mint-whisper` | Signature section surface — replaces gray for feature panels, product wrappers, and comparison cards; a soft teal that reads as a colored canvas rather than a colored card; Radial hero wash — cyan blooming into neutral gray for ambient atmosphere on showcase sections |
| Cyan Pulse | `#00caf2` | `--color-cyan-pulse` | Gradient origin point and link glow shadow; appears only inside the cyan→indigo button gradient and the radial brand wash |
| Cyan Mist | `#66dff7` | `--color-cyan-mist` | Soft cyan used as a link-focus glow ring; bridges Mint Whisper and the gradient endpoints |
| Ink Black | `#000000` | `--color-ink-black` | Primary text, icons, hairline borders, and image outlines — used at high frequency for structural edges rather than fills |
| Paper White | `#ffffff` | `--color-paper-white` | Page canvas, card surfaces, button text on indigo fills |
| Fog Veil | `#f8f9fa` | `--color-fog-veil` | Secondary card and section surface — the next step up from pure white before reaching Mint Whisper |
| Ash Border | `#c8c9cf` | `--color-ash-border` | Muted borders and dividers; structural edges that need to be visible but never assertive |
| Graphite Depth | `#333333` | `--color-graphite-depth` | Deep accent for headings and section frames where pure black would feel too sharp |
| Steel Caption | `#7f8087` | `--color-steel-caption` | Body helper text, link base color, icon fills, and secondary metadata — the de facto mid-neutral for prose |
| Haze Card | `#e3e6ec` | `--color-haze-card` | Tertiary card surface for grouped content blocks and inner panels |

## Tokens — Typography

### Silka SemiBold — Silka SemiBold — detected in extracted data but not described by AI · `--font-silka-semibold`
- **Weights:** 400, 600, 700
- **Sizes:** 14px, 16px
- **Line height:** 1, 1.2, 1.4
- **Letter spacing:** -0.036
- **Role:** Silka SemiBold — detected in extracted data but not described by AI

### HK Sentiments — Display and section headings — a bold serif-adjacent sans that carries the voice of headlines, tightened by negative tracking · `--font-hk-sentiments`
- **Substitute:** Manrope
- **Weights:** 700
- **Sizes:** 24px, 28px, 32px
- **Line height:** 1.10-1.20
- **Letter spacing:** -0.018em at 32px, -0.017em at 28px, -0.006em at 24px
- **Role:** Display and section headings — a bold serif-adjacent sans that carries the voice of headlines, tightened by negative tracking

### Silka — All UI text, body copy, button labels, and inline links — a neutral geometric sans for the functional layer · `--font-silka`
- **Substitute:** Inter
- **Weights:** 400, 500, 600, 700
- **Sizes:** 14px, 16px, 18px
- **Line height:** 1.00-1.40
- **Letter spacing:** -0.036em to 0.010em depending on weight
- **Role:** All UI text, body copy, button labels, and inline links — a neutral geometric sans for the functional layer

### Silka Italic — Accent italic for emphasized phrases inside body copy · `--font-silka-italic`
- **Substitute:** Inter Italic
- **Weights:** 400
- **Sizes:** 
- **Line height:** 1.20
- **Letter spacing:** 0.010em
- **Role:** Accent italic for emphasized phrases inside body copy

### system-ui sans-serif — Micro UI text — tag labels, fine print, timestamp-style metadata · `--font-system-ui-sans-serif`
- **Substitute:** system-ui
- **Weights:** 400
- **Sizes:** 12px
- **Line height:** 1.20
- **Role:** Micro UI text — tag labels, fine print, timestamp-style metadata

### Silka Regular — Silka Regular — detected in extracted data but not described by AI · `--font-silka-regular`
- **Weights:** 400
- **Sizes:** 14px, 16px, 18px
- **Line height:** 1, 1.2
- **Letter spacing:** 0.01
- **Role:** Silka Regular — detected in extracted data but not described by AI

### Silka Medium Italic — Silka Medium Italic — detected in extracted data but not described by AI · `--font-silka-medium-italic`
- **Weights:** 400
- **Sizes:** 18px
- **Line height:** 1.2
- **Letter spacing:** 0.01
- **Role:** Silka Medium Italic — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.2 | — | `--text-caption` |
| body-sm | 14px | 1.2 | -0.144px | `--text-body-sm` |
| body | 16px | 1.3 | -0.176px | `--text-body` |
| subheading | 18px | 1.2 | -0.198px | `--text-subheading` |
| heading-sm | 24px | 1.2 | -0.144px | `--text-heading-sm` |
| heading | 28px | 1.2 | -0.476px | `--text-heading` |
| display | 32px | 1.1 | -0.576px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 8 | 8px | `--spacing-8` |
| 12 | 12px | `--spacing-12` |
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 60 | 60px | `--spacing-60` |
| 72 | 72px | `--spacing-72` |
| 80 | 80px | `--spacing-80` |
| 100 | 100px | `--spacing-100` |
| 120 | 120px | `--spacing-120` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 100px |
| cards | 16px |
| inputs | 8px |
| buttons | 12px |
| featureFrames | 20px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| md | `rgba(0, 202, 242, 0.6) 0px 4px 12px 0px` | `--shadow-md` |
| md-2 | `rgba(0, 0, 0, 0.25) 0px 8px 16px 0px` | `--shadow-md-2` |
| lg | `rgba(0, 0, 0, 0.1) 0px 15px 20px -5px` | `--shadow-lg` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 64px
- **Card padding:** 24px
- **Element gap:** 12px

## Components

### Gradient Primary Button
**Role:** Hero CTA — the one and only filled action

Vertical cyan-to-indigo gradient (rgb(0,202,242) → rgb(77,77,255)), white text in Silka Medium 16px, 12px corner radius, padding 12px 24px, no border, subtle drop shadow rgba(0,0,0,0.25) 0 8px 16px. This is the brand's loudest element and should appear once per section at most.

### Outlined Sign-In Button
**Role:** Secondary nav action

Transparent fill, 1px solid #000000 border, 12px radius, Silka Medium 14px in #000000, padding 8px 16px. Sits in the top nav next to the gradient CTA.

### Section Tag Pill
**Role:** Eyebrow label above section headings

100px pill radius, #e3e6ec background, uppercase Silka SemiBold 12px in #4d4dff, padding 6px 14px. Marks the topic of the next section in a soft chip.

### Before/After Comparison Card
**Role:** Hero dual-card showing the product's value

Two side-by-side cards with 16px radius, 24px padding, #f8f9fa background. Each contains a screenshot frame with a small circular status badge centered above (red #ff4d4d X or indigo #4d4dff check), plus a short caption in Silka Regular 14px #333333.

### Mint Feature Panel
**Role:** Full-width product showcase wrapper

Full-bleed #c5fbee background, generous 64px vertical padding, centered product screenshot framed inside a white card with 16px radius and a soft drop shadow. The mint surface replaces the typical gray section.

### Product Screenshot Frame
**Role:** Inset preview of the product UI

White card, 16px radius, 1px hairline border in #c8c9cf, inner padding 0 (image bleeds to edges), drop shadow rgba(0,0,0,0.1) 0 15px 20px -5px. Always centered inside a Mint Feature Panel.

### Brand Showcase Carousel Card
**Role:** Full-bleed brand design samples

Wide card with multi-image grid inside, 20px radius, layered over a cyan radial wash background. Contains labeled sub-panels in white with their own 12px radius and small captions.

### Status Icon Badge
**Role:** Tiny circular indicator above cards

40px circle, solid fill in #4d4dff (positive) or warm red (negative), white icon centered, drops with 8px gap above the card. Sits like a sticker.

### Top Navigation Bar
**Role:** Site-wide header

White background, no border, 64px height, flex row with logo left, links centered in Silka Medium 14px #333333, CTA pair right-aligned. Sticky behavior assumed for long pages.

### Footer Link Group
**Role:** Bottom-of-page navigation

Stacked Silka Regular 14px links in #7f8087 with 10px row gap, 24px column gap between groups. Group headings in Silka SemiBold 12px uppercase in #333333.

### Section Heading Block
**Role:** Title + subtitle pair above a feature

Centered stack: HK Sentiments Bold 28-32px in #000000 with -0.476 to -0.576px letter-spacing, optional one-line subtitle in Silka Regular 18px #7f8087. Vertical rhythm 16px between lines.

### Ghost Link
**Role:** Inline text link

Silka Regular 14px in #7f8087, 1px dotted underline in #7f8087, hover state adds the cyan glow ring rgba(0,202,242,0.6) 0 4px 12px around the text.

## Do's and Don'ts

### Do
- Use the cyan→indigo vertical gradient (rgb(0,202,242) → rgb(77,77,255)) only on the single highest-priority CTA per section; never apply it to cards, nav, or secondary buttons
- Reserve #c5fbee Mint Whisper for full-bleed feature panels behind product screenshots; never use it as a small accent or badge fill
- Set hero and section headings in HK Sentiments Bold 28–32px with -0.476 to -0.576px letter-spacing to lock in the tight, geometric voice
- Apply 16px radius to all cards, 12px to all buttons, and 100px to all tags and pills — these three radii define the system
- Use 1px solid #000000 or #c8c9cf for hairline borders; never reach for thicker decorative borders
- Center every section's heading block (tag pill + title + optional subtitle) and let product screenshots do the visual work below it
- Pull Silka tracking to -0.036em on SemiBold 14–16px to match the extracted micro-tightening at UI sizes

### Don't
- Don't introduce new saturated colors — the chromatic system is exactly two: indigo #4d4dff and mint #c5fbee, connected by cyan in the gradient
- Don't use #c5fbee on a white card as a hover state or chip fill; it is a surface-level treatment, not a foreground accent
- Don't apply shadows to text, nav, or tags; elevation belongs only on product frames, comparison cards, and the gradient CTA
- Don't switch to a serif or display script for headings — HK Sentiments Bold 700 is the only display voice, and tracking stays negative at every size
- Don't stack multiple feature blocks per section; one headline, one product frame, one breath of space is the rhythm
- Don't use dark mode patterns — the canvas is always #ffffff or #f8f9fa, never a near-black surface
- Don't substitute the cyan→indigo gradient with a flat #4d4dff fill on the hero CTA; the gradient is what makes the primary action feel 'switched on'

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Paper White Canvas | `#ffffff` | Default page background |
| 1 | Fog Veil | `#f8f9fa` | Section separators and quiet content blocks |
| 2 | Haze Card | `#e3e6ec` | Tertiary grouped panels |
| 3 | Mint Whisper | `#c5fbee` | Signature feature surface and product wrapper |

## Elevation

- **Comparison cards and feature panels:** `rgba(0, 0, 0, 0.1) 0px 15px 20px -5px`
- **Showcase frames and elevated tiles:** `rgba(0, 0, 0, 0.25) 0px 8px 16px 0px`
- **Cyan link glow:** `rgba(0, 202, 242, 0.6) 0px 4px 12px 0px`

## Imagery

Product screenshots dominate the visual language — real UI captures of the Viewport board, asset library, and brand kit views, not abstract mockups. Screenshots are presented as floating white cards on the mint surface with hairline borders and soft shadows, never with gradients or color overlays applied to them. The only non-product imagery is contained inside the screenshots themselves (design samples in green-teal palettes). No lifestyle photography, no people, no hero illustration — the product IS the hero. Icons are minimal and outlined, using the same #4d4dff or #000000 as surrounding text. Decorative graphics are limited to the cyan radial wash behind the brand showcase carousel.

## Layout

Page is max-width 1200px centered with a fixed top nav. The hero opens as a centered single-column stack: eyebrow-style headline in HK Sentiments Bold 32px, a one-sentence subtitle in Silka Regular 18px #7f8087, then the gradient CTA, then a two-column comparison row with 24px gap. Sections alternate between white canvas and Mint Whisper (#c5fbee) full-bleed bands, separated by 64px vertical padding. Each feature section follows the same pattern: optional tag pill, centered heading block, then a single wide product frame or 2–3 column grid of product previews. Navigation is a minimal sticky top bar — no sidebar, no mega-menu. Content density stays low; each section claims the full viewport-width with generous breathing room rather than packing information side by side.

## Agent Prompt Guide

primary action: #4d4dff (filled action)
Create a Primary Action Button: #4d4dff background, #ffffff text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.

Example Component Prompts:
1. Build a hero CTA: vertical gradient from #00caf2 to #4d4dff, white Silka Medium 16px label, 12px radius, 12px 24px padding, drop shadow rgba(0,0,0,0.25) 0 8px 16px.
2. Build a Mint Feature Panel: full-width #c5fbee background, 64px vertical padding, centered HK Sentiments Bold 28px #000000 heading with -0.476px tracking, then a white product frame (16px radius, 1px #c8c9cf border, shadow rgba(0,0,0,0.1) 0 15px 20px -5px) containing a product screenshot.
3. Build a section tag pill: 100px radius, #e3e6ec fill, uppercase Silka SemiBold 12px in #4d4dff, 6px 14px padding.
4. Build a before/after comparison card: 16px radius, #f8f9fa fill, 24px padding, a 40px circular status badge (red or indigo) floating 8px above the card center, product screenshot inside, and a Silka Regular 14px #333333 caption below.

## Gradient System

Gradients are rationed — there are exactly two in the entire system. The CTA gradient flows vertically from cyan rgb(0,202,242) at 0% to indigo rgb(77,77,255) at 100%, used only on the highest-priority filled button per page. The radial wash is a cyan bloom (rgba(0,202,242,0.3)) expanding from the bottom-center into a neutral gray (rgb(241,243,245)), used only as an ambient backdrop for the brand showcase carousel. No other gradients, no diagonal sweeps, no multicolor decorations.

## Similar Brands

- **Pitch** — Same light-canvas-plus-one-vivid-accent approach with generous section spacing and product-screenshot-led layouts
- **Notion** — Quiet white surfaces, minimal chrome, and product screenshots treated as floating tiles with soft shadows
- **Linear** — Tight typographic scale with negative letter-spacing on bold headings and a single saturated brand color that does the work of a palette
- **Frame.io** — Creative-tool marketing pages that lead with centered hero copy, before/after visual storytelling, and wide product preview frames

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-indigo-voltage: #4d4dff;
  --gradient-indigo-voltage: linear-gradient(0deg, rgb(0,202,242) 0%, rgb(77,77,255) 100%);
  --color-mint-whisper: #c5fbee;
  --gradient-mint-whisper: radial-gradient(102% 82% at 50% 107.7%, rgba(0,202,242,0.3) 0%, rgb(241,243,245) 100%);
  --color-cyan-pulse: #00caf2;
  --color-cyan-mist: #66dff7;
  --color-ink-black: #000000;
  --color-paper-white: #ffffff;
  --color-fog-veil: #f8f9fa;
  --color-ash-border: #c8c9cf;
  --color-graphite-depth: #333333;
  --color-steel-caption: #7f8087;
  --color-haze-card: #e3e6ec;

  /* Typography — Font Families */
  --font-silka-semibold: 'Silka SemiBold', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-hk-sentiments: 'HK Sentiments', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-silka: 'Silka', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-silka-italic: 'Silka Italic', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-system-ui-sans-serif: 'system-ui sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-silka-regular: 'Silka Regular', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-silka-medium-italic: 'Silka Medium Italic', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.2;
  --text-body-sm: 14px;
  --leading-body-sm: 1.2;
  --tracking-body-sm: -0.144px;
  --text-body: 16px;
  --leading-body: 1.3;
  --tracking-body: -0.176px;
  --text-subheading: 18px;
  --leading-subheading: 1.2;
  --tracking-subheading: -0.198px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -0.144px;
  --text-heading: 28px;
  --leading-heading: 1.2;
  --tracking-heading: -0.476px;
  --text-display: 32px;
  --leading-display: 1.1;
  --tracking-display: -0.576px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-60: 60px;
  --spacing-72: 72px;
  --spacing-80: 80px;
  --spacing-100: 100px;
  --spacing-120: 120px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 64px;
  --card-padding: 24px;
  --element-gap: 12px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-full: 100px;

  /* Named Radii */
  --radius-tags: 100px;
  --radius-cards: 16px;
  --radius-inputs: 8px;
  --radius-buttons: 12px;
  --radius-featureframes: 20px;

  /* Shadows */
  --shadow-md: rgba(0, 202, 242, 0.6) 0px 4px 12px 0px;
  --shadow-md-2: rgba(0, 0, 0, 0.25) 0px 8px 16px 0px;
  --shadow-lg: rgba(0, 0, 0, 0.1) 0px 15px 20px -5px;

  /* Surfaces */
  --surface-paper-white-canvas: #ffffff;
  --surface-fog-veil: #f8f9fa;
  --surface-haze-card: #e3e6ec;
  --surface-mint-whisper: #c5fbee;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-indigo-voltage: #4d4dff;
  --color-mint-whisper: #c5fbee;
  --color-cyan-pulse: #00caf2;
  --color-cyan-mist: #66dff7;
  --color-ink-black: #000000;
  --color-paper-white: #ffffff;
  --color-fog-veil: #f8f9fa;
  --color-ash-border: #c8c9cf;
  --color-graphite-depth: #333333;
  --color-steel-caption: #7f8087;
  --color-haze-card: #e3e6ec;

  /* Typography */
  --font-silka-semibold: 'Silka SemiBold', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-hk-sentiments: 'HK Sentiments', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-silka: 'Silka', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-silka-italic: 'Silka Italic', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-system-ui-sans-serif: 'system-ui sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-silka-regular: 'Silka Regular', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-silka-medium-italic: 'Silka Medium Italic', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.2;
  --text-body-sm: 14px;
  --leading-body-sm: 1.2;
  --tracking-body-sm: -0.144px;
  --text-body: 16px;
  --leading-body: 1.3;
  --tracking-body: -0.176px;
  --text-subheading: 18px;
  --leading-subheading: 1.2;
  --tracking-subheading: -0.198px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -0.144px;
  --text-heading: 28px;
  --leading-heading: 1.2;
  --tracking-heading: -0.476px;
  --text-display: 32px;
  --leading-display: 1.1;
  --tracking-display: -0.576px;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-60: 60px;
  --spacing-72: 72px;
  --spacing-80: 80px;
  --spacing-100: 100px;
  --spacing-120: 120px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-full: 100px;

  /* Shadows */
  --shadow-md: rgba(0, 202, 242, 0.6) 0px 4px 12px 0px;
  --shadow-md-2: rgba(0, 0, 0, 0.25) 0px 8px 16px 0px;
  --shadow-lg: rgba(0, 0, 0, 0.1) 0px 15px 20px -5px;
}
```
