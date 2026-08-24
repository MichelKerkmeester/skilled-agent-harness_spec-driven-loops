# Geniestudio — Style Reference
> soft daylight notebook — the kind with generous margins and a single bold pen stroke

**Theme:** light

Genie uses an airy, daylight-studio language: a pale sky-blue canvas (#ebf5ff) hosts an almost-monochrome interface where near-black buttons provide the only dense visual weight. Display type runs enormous — up to 148px in Aeonik — with a fixed weight 500 that feels engraved rather than shouted, and tracking pulled tight (-0.02em) so headlines read as confident typography, not decorative type. Rounded shapes dominate: 32px cards, 9999px pills, and soft pastel washes (lavender, mint, peach, sky) become the only places color appears beyond a single vivid blue accent and the dark charcoal CTA fill. Whimsical 3D-rendered illustrations — clouds, crayons, smiling objects, floating envelopes — float in the whitespace and carry the brand's personality; the UI itself stays disciplined, almost architectural in its restraint.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Sky Tint | `#ebf5ff` | `--color-sky-tint` | Page canvas and soft background washes — the defining ambient color that sets the daylight atmosphere |
| Paper White | `#ffffff` | `--color-paper-white` | Pure card surfaces, button text, and icon fills on dark controls |
| Bone White | `#fafdff` | `--color-bone-white` | Primary card surface and elevated panel backgrounds — a barely-blue white that feels paper-like |
| Mist Gray | `#f6f7f8` | `--color-mist-gray` | Subtle secondary surfaces and section dividers |
| Ink | `#0a0d12` | `--color-ink` | All heading text, primary display type, and deep emphasis copy |
| Charcoal | `#181d27` | `--color-charcoal` | Filled button backgrounds and the dense visual anchor against the airy canvas |
| Graphite | `#535862` | `--color-graphite` | Secondary body text and supporting copy |
| Fog | `#93979f` | `--color-fog` | Muted helper text, FAQ answers, and low-emphasis body |
| Slate Shadow | `#3b3d41` | `--color-slate-shadow` | Dark shadow tone behind buttons and elevated controls |
| Iris Blue | `linear-gradient(rgb(71, 157, 255) 11.43%, rgb(0, 105, 224) 78.2%)` | `--color-iris-blue` | Brand accent — chromatic borders, outline strokes, and the single vivid punctuation color in the otherwise pale system; Brand gradient used for decorative borders and accent fills |
| Sky Blue | `#0099ff` | `--color-sky-blue` | Inline highlight text and emphasis spans within body copy |
| Lavender Wash | `#f1e6ff` | `--color-lavender-wash` | Pastel card surface for feature tiles and category blocks |
| Mint Wash | `#d3f6e3` | `--color-mint-wash` | Pastel card surface for feature tiles and category blocks |
| Powder Blue | `#cce7ff` | `--color-powder-blue` | Gray wash for highlight backgrounds, decorative bands, and soft emphasis behind content |
| Solar Gradient | `linear-gradient(rgb(255, 249, 224) 0%, rgb(255, 236, 163) 100%)` | `--color-solar-gradient` | Warm gradient stop for decorative feature highlights |
| Violet Gradient | `linear-gradient(rgb(244, 235, 255) 0%, rgb(228, 204, 255) 100%)` | `--color-violet-gradient` | Decorative gradient wash for feature category blocks |
| Aqua Gradient | `linear-gradient(rgb(229, 246, 255) 0%, rgb(194, 233, 255) 100%)` | `--color-aqua-gradient` | Decorative gradient wash for feature category blocks |
| Peach Gradient | `linear-gradient(rgb(255, 242, 235) 0%, rgb(255, 209, 184) 100%)` | `--color-peach-gradient` | Decorative gradient wash for feature category blocks |

## Tokens — Typography

### Aeonik — Display and heading face for all editorial moments — 148px hero headlines, 72px section openers, 48px card titles, 32px subheadings. Fixed at weight 500; the brand never goes bolder. Tracking pulls tight at -0.02em which gives the geometric forms a sculpted, almost engraved quality at large sizes. Substitute: 'Söhne', 'Inter', or 'General Sans'. · `--font-aeonik`
- **Substitute:** Söhne or Inter
- **Weights:** 500
- **Sizes:** 20px, 24px, 32px, 48px, 72px, 148px
- **Line height:** 1.05–1.25
- **Letter spacing:** -0.02em at 72px+ ; tight tracking scales with size
- **OpenType features:** `"case"`
- **Role:** Display and heading face for all editorial moments — 148px hero headlines, 72px section openers, 48px card titles, 32px subheadings. Fixed at weight 500; the brand never goes bolder. Tracking pulls tight at -0.02em which gives the geometric forms a sculpted, almost engraved quality at large sizes. Substitute: 'Söhne', 'Inter', or 'General Sans'.

### Geist — UI and body face for everything below the headline tier — body copy, buttons, labels, captions, card descriptions, nav links. Weight 500 is the workhorse; 600 only for tiny 10px micro-labels. The 18px / 20px sizes with -0.01em tracking carry the interface's conversational voice. Substitute: 'Geist', 'Inter', or 'Söhne'. · `--font-geist`
- **Substitute:** Geist or Inter
- **Weights:** 500, 600
- **Sizes:** 10px, 12px, 14px, 16px, 18px, 20px
- **Line height:** 1.14–1.50
- **Letter spacing:** -0.01em across all sizes
- **OpenType features:** `"case"`
- **Role:** UI and body face for everything below the headline tier — body copy, buttons, labels, captions, card descriptions, nav links. Weight 500 is the workhorse; 600 only for tiny 10px micro-labels. The 18px / 20px sizes with -0.01em tracking carry the interface's conversational voice. Substitute: 'Geist', 'Inter', or 'Söhne'.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 10px | 1.4 | -0.1px | `--text-caption` |
| body-sm | 14px | 1.14 | -0.14px | `--text-body-sm` |
| body | 16px | 1.35 | — | `--text-body` |
| body-lg | 18px | 1.33 | -0.18px | `--text-body-lg` |
| subheading | 20px | 1.4 | -0.2px | `--text-subheading` |
| heading-sm | 24px | 1.17 | -0.48px | `--text-heading-sm` |
| heading | 32px | 1.25 | -0.64px | `--text-heading` |
| heading-lg | 48px | 1.17 | -0.96px | `--text-heading-lg` |
| display | 72px | 1.11 | -1.44px | `--text-display` |
| hero | 148px | 1.05 | -2.96px | `--text-hero` |

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
| 80 | 80px | `--spacing-80` |
| 88 | 88px | `--spacing-88` |
| 120 | 120px | `--spacing-120` |
| 160 | 160px | `--spacing-160` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 9999px |
| cards | 32px |
| images | 24px |
| inputs | 16px |
| buttons | 32px |
| cardsSmall | 16px |
| buttonsPill | 9999px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| lg | `rgba(4, 69, 144, 0.08) 0px 14px 20px 4px` | `--shadow-lg` |
| subtle | `rgba(10, 13, 18, 0.8) 0px 1px 2px 0px, rgb(10, 13, 18) 0p...` | `--shadow-subtle` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 40px
- **Element gap:** 24px

## Components

### Primary CTA Button
**Role:** Filled dark pill — the only dense visual element on the page

Background #181d27, white text (#ffffff), border-radius 32px (or 9999px for full pill), padding 12px 32px, font Geist 16px weight 500, letter-spacing -0.01em. Tight dark shadow ring (0 1px 2px rgba(10,13,18,0.8), 0 0 0 1px #0a0d12) gives it a pressed, pressed-into-page quality. Used for 'Sign up' and the single hero action.

### Secondary CTA Button
**Role:** Smaller filled pill for inline actions

Background #181d27, white text, border-radius 16px, padding 8px 16px, Geist 14px weight 500. Compact variant of the primary.

### Ghost Nav Link
**Role:** Header navigation text

No background, Geist 16px weight 500, color inherits from #0a0d12 or #535862, no underline, no hover background fill. Sits on the canvas as plain typography.

### Feature Card (32px radius)
**Role:** Primary content card — FAQ, testimonial, feature block

Background #fafdff (bone white), border-radius 32px, padding 40px on all sides, no visible border, no shadow. The card relies on the color shift from canvas (#ebf5ff) to surface (#fafdff) and the 32px radius to define itself.

### Pastel Category Tile
**Role:** Colored feature block — style library, category cards

Solid pastel background (#f1e6ff lavender, #d3f6e3 mint, #cce7ff powder blue, #fff2be solar), border-radius 32px, generous padding, no border. Each tile is a flat wash of color — no gradients on the tile itself, though some use gradient fills (#c2e9ff, #e4ccff, #ffd1b8).

### Testimonial Card
**Role:** Masonry-style horizontal card in the social-proof section

Background #fafdff, border-radius 32px, padding 40px, contains a pull-quote at Geist 18px #535862, a divider, then avatar + name (Geist 16px weight 500 #0a0d12) + role (Geist 14px #93979f) and a brand logo on the right. Cards bleed off the edges of the viewport in a continuous horizontal marquee.

### FAQ Accordion Row
**Role:** Expandable question/answer block

Background #fafdff, border-radius 32px, padding 40px. Question in Geist 18-20px weight 500 #0a0d12, answer in Geist 16px #93979f. Animated open/close using grid-template-rows transition at 0.65s ease.

### Pill Tag / Chip
**Role:** Category labels and status indicators

Border-radius 9999px, Geist 12-14px weight 500, padding 4px 12px. Appears in pastel-tinted backgrounds for category labels.

### Marquee Logo Strip
**Role:** Endlessly scrolling brand logo wall

Continuous horizontal marquee animation (no visible container). Logos are monochrome or brand-colored, float in the sky canvas with no card wrapper. Uses linear(0 0%, 0.55 7.5%, ...) timing function for the scroll.

### Hero Gradient Banner
**Role:** Decorative border/frame around hero artwork

Thin border using the iris gradient (linear-gradient(71,157,255 11.43%, 0,105,224 78.2%)) with 3px solid weight and border-radius 90px. The only place a gradient border appears — it frames the hero illustration like a polaroid edge.

### 3D Illustration Asset
**Role:** Whimsical floating objects — clouds, crayons, envelopes, smiley faces, flowers

Rounded, dimensional, pastel-colored 3D renders. They float in the canvas as isolated objects with no background container. Colors come from the pastel palette (#cce7ff, #f1e6ff, #d3f6e3, #ffd1b8) plus a vivid iris blue accent. Sized large and given room to breathe — they are the brand personality, not decoration.

### Section Header
**Role:** Centered display headline + supporting subhead

Aeonik 48-72px weight 500 in #0a0d12, centered, with a Geist 18px subhead in #535862 below. The 148px hero variant is reserved for the first screen. Letter-spacing tightens with size (-0.96px at 48px, -1.44px at 72px, -2.96px at 148px).

## Do's and Don'ts

### Do
- Use weight 500 (not 600 or 700) for all display and heading type — the system is intentionally mid-weight, never bold
- Apply 32px border-radius to all content cards and 9999px to all interactive pills and tags
- Set the page canvas to #ebf5ff and card surfaces to #fafdff — the pale blue-to-bone-white shift is the primary depth mechanism
- Use the dark fill #181d27 for all filled buttons; reserve #0069e0 for accent borders and inline highlight text only
- Pull heading tracking to -0.02em and body tracking to -0.01em; never set type with default or positive letter-spacing
- Let 3D illustrations float in the canvas without cards, borders, or backgrounds — they are the brand voice, not decoration
- Use the iris gradient (71,157,255 → 0,105,224) only for thin 3px accent borders; never as a button fill or large surface

### Don't
- Do not use bold weights (600+) for display headlines — Aeonik 500 is the ceiling
- Do not use 90° sharp corners on cards or buttons — minimum 16px, default 32px, pill 9999px
- Do not place saturated blue (#0069e0) as a button fill — it is an outline/accent color, not a CTA color
- Do not add box-shadows to content cards — depth comes from the canvas/surface color shift, not elevation
- Do not use body-weight black (#000000) for text — use #0a0d12, which has a hint of blue that ties to the canvas
- Do not mix more than two pastel washes in a single section — the pastel palette is for tile variety, not visual noise
- Do not set display type below 48px or use display sizes for body content — the scale has a hard floor for editorial moments

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Sky Canvas | `#ebf5ff` | Page background — the defining pale-blue atmosphere |
| 1 | Paper Card | `#fafdff` | Primary card and panel surface |
| 2 | Pure White | `#ffffff` | Modal and elevated overlay surfaces |
| 3 | Mist Section | `#f6f7f8` | Subtle section banding and secondary surface |

## Elevation

- **Primary Button:** `0 1px 2px rgba(10, 13, 18, 0.8), 0 0 0 1px rgb(10, 13, 18)`
- **Decorative Section Blocks:** `0 14px 20px 4px rgba(4, 69, 144, 0.08)`

## Imagery

The site leans heavily on 3D-rendered illustrations: soft, rounded, dimensional objects in pastel colors (lavender, mint, peach, powder blue) with a single vivid iris-blue accent object per scene. Objects float in the canvas as isolated subjects — a cloud and a crayon here, an envelope and a smiley face there — with no background, no shadow plate, no lifestyle staging. The style is playful, toy-like, and slightly squishy, almost like clay renders. The canvas is the negative space; illustrations are the positive. There is no photography, no product screenshots in the traditional sense, and no abstract graphic patterns. The 3D objects carry all the personality.

## Layout

Max-width 1200px centered with generous side margins. The hero is a centered text+illustration stack: headline at 148px above a single 3D render, with one dark CTA button below — no left/right split, no columns. Sections alternate between centered single-column editorial stacks (headline → subhead → content) and full-bleed horizontal bands (marquee strips, category tile rows). Cards appear in 3-column grids for feature sections and in a continuous horizontal marquee for testimonials. The layout breathes — vertical section gaps run 80-120px, and even within sections the element gaps sit at 24-40px. Navigation is minimal: logo left, two text links center, single filled CTA right, all in a single row. The footer is a wide centered CTA block followed by a 4-column link grid.

## Agent Prompt Guide

Quick Color Reference:
- text: #0a0d12 (headings), #535862 (body), #93979f (muted)
- background: #ebf5ff (canvas), #fafdff (card), #ffffff (elevated)
- border: transparent default; #0069e0 for accent outlines
- accent: #0069e0 (iris blue — borders, highlights)
- primary action: #181d27 (filled action)

Example Component Prompts:
1. Create a hero section: #ebf5ff canvas, centered Aeonik 148px weight 500 headline in #0a0d12 with -0.02em tracking, a single 3D-rendered illustration floating below on transparent background, and one filled CTA button (#181d27, #ffffff text, 32px radius, 12px 32px padding, Geist 16px weight 500).
2. Build a feature card: #fafdff background, 32px border-radius, 40px padding all sides, Aeonik 48px weight 500 title in #0a0d12 with -0.96px tracking, Geist 18px body in #535862. No border, no shadow.
3. Create a pastel category tile: solid #f1e6ff (or #d3f6e3 / #cce7ff / #fff2be) background, 32px radius, 40px padding, Aeonik 32px weight 500 label in #0a0d12 centered, with a small 3D illustration inset.
4. Build a testimonial card: #fafdff background, 32px radius, 40px padding, Geist 18px quote in #535862, Geist 16px name in #0a0d12, Geist 14px role in #93979f, brand logo at the right.
5. Create a dark filled button: #181d27 background, #ffffff text, 32px radius, 12px 32px padding, Geist 16px weight 500, tight shadow ring (0 1px 2px rgba(10,13,18,0.8), 0 0 0 1px #0a0d12).

## Motion Philosophy

Animation is expressive but not aggressive. Marquee scrolls run continuously for logo strips and testimonial walls. FAQ accordions use grid-template-rows transition at 0.65s ease for a soft expand. Scroll-triggered reveals use cubic-bezier(0.16, 1, 0.3, 1) — a fast start and gentle settle. The custom linear() timing function in the marquee creates a non-uniform scroll speed that feels organic, not mechanical. Durations cluster around 0.3-0.65s; nothing is snappy, nothing is slow.

## Similar Brands

- **Linear** — Same near-monochrome canvas with a single accent color, oversized display type at weight 500, and pill-shaped dark CTA buttons
- **Framer** — Same playful 3D illustration language floating on a pale tinted canvas, generous spacing, and 32px card radii
- **Vercel** — Same near-black button fill (#181d27 ≈ their dark surfaces) and typographic-first layout where type does the work and decoration stays minimal
- **Pitch** — Same dark filled pill buttons, pale neutral canvas, and confident mid-weight display typography

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-sky-tint: #ebf5ff;
  --color-paper-white: #ffffff;
  --color-bone-white: #fafdff;
  --color-mist-gray: #f6f7f8;
  --color-ink: #0a0d12;
  --color-charcoal: #181d27;
  --color-graphite: #535862;
  --color-fog: #93979f;
  --color-slate-shadow: #3b3d41;
  --color-iris-blue: #0069e0;
  --gradient-iris-blue: linear-gradient(rgb(71, 157, 255) 11.43%, rgb(0, 105, 224) 78.2%);
  --color-sky-blue: #0099ff;
  --color-lavender-wash: #f1e6ff;
  --color-mint-wash: #d3f6e3;
  --color-powder-blue: #cce7ff;
  --color-solar-gradient: #fff2be;
  --gradient-solar-gradient: linear-gradient(rgb(255, 249, 224) 0%, rgb(255, 236, 163) 100%);
  --color-violet-gradient: #e4ccff;
  --gradient-violet-gradient: linear-gradient(rgb(244, 235, 255) 0%, rgb(228, 204, 255) 100%);
  --color-aqua-gradient: #c2e9ff;
  --gradient-aqua-gradient: linear-gradient(rgb(229, 246, 255) 0%, rgb(194, 233, 255) 100%);
  --color-peach-gradient: #ffd1b8;
  --gradient-peach-gradient: linear-gradient(rgb(255, 242, 235) 0%, rgb(255, 209, 184) 100%);

  /* Typography — Font Families */
  --font-aeonik: 'Aeonik', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-geist: 'Geist', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.4;
  --tracking-caption: -0.1px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.14;
  --tracking-body-sm: -0.14px;
  --text-body: 16px;
  --leading-body: 1.35;
  --text-body-lg: 18px;
  --leading-body-lg: 1.33;
  --tracking-body-lg: -0.18px;
  --text-subheading: 20px;
  --leading-subheading: 1.4;
  --tracking-subheading: -0.2px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.17;
  --tracking-heading-sm: -0.48px;
  --text-heading: 32px;
  --leading-heading: 1.25;
  --tracking-heading: -0.64px;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.17;
  --tracking-heading-lg: -0.96px;
  --text-display: 72px;
  --leading-display: 1.11;
  --tracking-display: -1.44px;
  --text-hero: 148px;
  --leading-hero: 1.05;
  --tracking-hero: -2.96px;

  /* Typography — Weights */
  --font-weight-medium: 500;
  --font-weight-semibold: 600;

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
  --spacing-80: 80px;
  --spacing-88: 88px;
  --spacing-120: 120px;
  --spacing-160: 160px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 40px;
  --element-gap: 24px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-2xl: 16px;
  --radius-3xl: 24px;
  --radius-3xl-2: 32px;
  --radius-3xl-3: 36px;
  --radius-full: 90px;
  --radius-full-2: 9999px;

  /* Named Radii */
  --radius-tags: 9999px;
  --radius-cards: 32px;
  --radius-images: 24px;
  --radius-inputs: 16px;
  --radius-buttons: 32px;
  --radius-cardssmall: 16px;
  --radius-buttonspill: 9999px;

  /* Shadows */
  --shadow-lg: rgba(4, 69, 144, 0.08) 0px 14px 20px 4px;
  --shadow-subtle: rgba(10, 13, 18, 0.8) 0px 1px 2px 0px, rgb(10, 13, 18) 0px 0px 0px 1px;

  /* Surfaces */
  --surface-sky-canvas: #ebf5ff;
  --surface-paper-card: #fafdff;
  --surface-pure-white: #ffffff;
  --surface-mist-section: #f6f7f8;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-sky-tint: #ebf5ff;
  --color-paper-white: #ffffff;
  --color-bone-white: #fafdff;
  --color-mist-gray: #f6f7f8;
  --color-ink: #0a0d12;
  --color-charcoal: #181d27;
  --color-graphite: #535862;
  --color-fog: #93979f;
  --color-slate-shadow: #3b3d41;
  --color-iris-blue: #0069e0;
  --color-sky-blue: #0099ff;
  --color-lavender-wash: #f1e6ff;
  --color-mint-wash: #d3f6e3;
  --color-powder-blue: #cce7ff;
  --color-solar-gradient: #fff2be;
  --color-violet-gradient: #e4ccff;
  --color-aqua-gradient: #c2e9ff;
  --color-peach-gradient: #ffd1b8;

  /* Typography */
  --font-aeonik: 'Aeonik', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-geist: 'Geist', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.4;
  --tracking-caption: -0.1px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.14;
  --tracking-body-sm: -0.14px;
  --text-body: 16px;
  --leading-body: 1.35;
  --text-body-lg: 18px;
  --leading-body-lg: 1.33;
  --tracking-body-lg: -0.18px;
  --text-subheading: 20px;
  --leading-subheading: 1.4;
  --tracking-subheading: -0.2px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.17;
  --tracking-heading-sm: -0.48px;
  --text-heading: 32px;
  --leading-heading: 1.25;
  --tracking-heading: -0.64px;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.17;
  --tracking-heading-lg: -0.96px;
  --text-display: 72px;
  --leading-display: 1.11;
  --tracking-display: -1.44px;
  --text-hero: 148px;
  --leading-hero: 1.05;
  --tracking-hero: -2.96px;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-88: 88px;
  --spacing-120: 120px;
  --spacing-160: 160px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-2xl: 16px;
  --radius-3xl: 24px;
  --radius-3xl-2: 32px;
  --radius-3xl-3: 36px;
  --radius-full: 90px;
  --radius-full-2: 9999px;

  /* Shadows */
  --shadow-lg: rgba(4, 69, 144, 0.08) 0px 14px 20px 4px;
  --shadow-subtle: rgba(10, 13, 18, 0.8) 0px 1px 2px 0px, rgb(10, 13, 18) 0px 0px 0px 1px;
}
```
