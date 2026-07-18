# Duties.xyz — Style Reference
> Monochrome broadside manifesto — a cream-paper zine where the only ink is black and the only type that matters is shouting.

**Theme:** light

Duties.xyz operates as a monochrome editorial broadsheet for an Oslo design studio and venture partner. A warm cream canvas (#f1f0ee) carries massive condensed display type — AS Therma Bold Condensed at 96-180px with negative tracking — that dominates the viewport like protest typography shouting \"BRANDS AND WEBSITES FOR BRAVE COMPANIES\". The palette is deliberately limited to pure black, warm off-white, and a single dark charcoal; there is no accent color, no decoration, no color punctuation of any kind. All interface rhythm comes from typographic scale, generous breathing room, and tight 8px-radius cards holding large project photography in full-bleed grids. The micro-typography uses a custom monospace (PP Neue Montreal Mono) with stylistic sets enabled (ss04, ss07, ss08, dlig, case, zero) for labels, metadata, and nav — a technical editorial voice paired with the screaming display type. The result is confident, restrained, brutally simple, and unmistakably a design studio's portfolio.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Cream Paper | `#f1f0ee` | `--color-cream-paper` | Page canvas and large surface fills; warm off-white sets the editorial paper tone |
| Pure Ink | `#000000` | `--color-pure-ink` | Primary text, nav links, icon strokes, footer metadata, logo marks — maximum contrast against cream |
| Charcoal Press | `#252525` | `--color-charcoal-press` | Supporting neutral for secondary UI, dividers, and muted labels. Do not promote it to the primary CTA color |
| Bone Gray | `#dbdad9` | `--color-bone-gray` | Quiet divider tone, subtle background blocks, low-emphasis surfaces — barely visible, only there for separation |
| Paper White | `#ffffff` | `--color-paper-white` | Inverse text on dark blocks, occasional clean card surfaces when maximum contrast is needed |

## Tokens — Typography

### AS Therma Bold Condensed — Hero and section display headlines; the screaming condensed grotesque that defines the brand voice. Set tight (lh 0.80) with aggressive negative tracking so letters nearly collide — the type itself is the decoration · `--font-as-therma-bold-condensed`
- **Substitute:** Bebas Neue Bold, Anton, Oswald Bold
- **Weights:** 400
- **Sizes:** 96px, 128px, 180px
- **Line height:** 0.80
- **Letter spacing:** -0.0670em at 96-128px, -0.0600em at 180px
- **Role:** Hero and section display headlines; the screaming condensed grotesque that defines the brand voice. Set tight (lh 0.80) with aggressive negative tracking so letters nearly collide — the type itself is the decoration

### PP Neue Montreal Mono Medium — Labels, metadata, nav items, project tags, marquee text, footer technical copy. The mono voice carries all secondary information and is the only text in the system with stylized alternates (ss04, ss07, ss08, zero) plus case and discretionary ligatures — it reads as editorial chrome · `--font-pp-neue-montreal-mono-medium`
- **Substitute:** JetBrains Mono Medium, IBM Plex Mono Medium, Space Mono Medium
- **Weights:** 400, 500
- **Sizes:** 14px
- **Line height:** 1.00, 1.15
- **OpenType features:** `"case", "dlig", "ss04", "ss07", "ss08", "zero", "ss07", "ss08"`
- **Role:** Labels, metadata, nav items, project tags, marquee text, footer technical copy. The mono voice carries all secondary information and is the only text in the system with stylized alternates (ss04, ss07, ss08, zero) plus case and discretionary ligatures — it reads as editorial chrome

### PP Neue Montreal SemiBold — Body paragraphs and longer-form copy in the About section; SemiBold weight at 18px reads as confident editorial prose, not corporate body text · `--font-pp-neue-montreal-semibold`
- **Substitute:** Inter SemiBold, Söhne SemiBold, Manrope SemiBold
- **Weights:** 400
- **Sizes:** 18px
- **Line height:** 1.20
- **OpenType features:** `"zero"`
- **Role:** Body paragraphs and longer-form copy in the About section; SemiBold weight at 18px reads as confident editorial prose, not corporate body text

### sans-serif (system) — Smallest utility text and legacy fallback. Used sparingly where the mono voice is not appropriate; rarely the primary choice · `--font-sans-serif-system`
- **Substitute:** system-ui, -apple-system, sans-serif
- **Weights:** 400
- **Sizes:** 12px
- **Line height:** 1.20
- **Role:** Smallest utility text and legacy fallback. Used sparingly where the mono voice is not appropriate; rarely the primary choice

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.2 | — | `--text-caption` |
| body-sm | 14px | 1.15 | — | `--text-body-sm` |
| body | 18px | 1.2 | — | `--text-body` |
| display | 96px | 0.8 | -6.43px | `--text-display` |
| display-lg | 128px | 0.8 | -8.58px | `--text-display-lg` |
| display-xl | 180px | 0.8 | -10.8px | `--text-display-xl` |

## Tokens — Spacing & Shapes

**Density:** compact

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 5 | 5px | `--spacing-5` |
| 6 | 6px | `--spacing-6` |
| 8 | 8px | `--spacing-8` |
| 10 | 10px | `--spacing-10` |
| 12 | 12px | `--spacing-12` |
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 40 | 40px | `--spacing-40` |
| 60 | 60px | `--spacing-60` |
| 80 | 80px | `--spacing-80` |
| 160 | 160px | `--spacing-160` |
| 240 | 240px | `--spacing-240` |

### Border Radius

| Element | Value |
|---------|-------|
| pill | 32px |
| cards | 8px |
| media | 8px |
| small | 4px |
| buttons | 32px |

### Layout

- **Page max-width:** 1440px
- **Section gap:** 80px
- **Card padding:** 20px
- **Element gap:** 10px

## Components

### Hero Display Headline
**Role:** The signature screaming headline that anchors the page

AS Therma Bold Condensed at 96-180px, weight 400, line-height 0.80, letter-spacing -0.067em to -0.06em. Pure black (#000000) on cream canvas. No padding, no margin-top — the text starts at the absolute top of the viewport. Set in all-caps naturally via the font, no transform needed. Occupies up to the full viewport width with no max-width constraint.

### Pill Navigation Button
**Role:** Floating menu trigger, sticky at bottom center

32px border-radius (full pill). Charcoal Press (#252525) fill, Cream Paper (#f1f0ee) text. PP Neue Montreal Mono Medium 14px weight 500, uppercase, letter-spacing normal. Padding approximately 10px 20px. Two icon dots (loader-style, ●●) sit to the left of the word \"MENU\". Floats centered at the bottom of the viewport with no shadow — relies on tonal contrast against the cream canvas.

### View Services CTA
**Role:** Primary call-to-action pill in the About block

32px border-radius. Cream Paper (#f1f0ee) fill, Pure Ink (#000000) text. PP Neue Montreal Mono Medium 14px weight 500, uppercase. Padding approximately 10px 20px. Trailing arrow (→) in the same color. No border, no shadow — the inverted tonal pair (cream on cream-bg with black text) is the only differentiator.

### Project Showcase Card
**Role:** Large project image with logo overlay

8px border-radius. Full-bleed photographic content (no padding around the image). Logo or project mark overlaid in white or black, positioned top-left or center-left, set in AS Therma Bold Condensed or a project-specific mark. No border, no shadow, no caption inside the card. Aspect ratio varies (roughly 3:2 or 4:3). Used in a horizontal row of 2-3 large images.

### Project Ticker Marquee
**Role:** Continuous horizontal booking-status banner

Single line of mono text (PP Neue Montreal Mono Medium 14px weight 500) repeating \"CURRENTLY BOOKING PROJECTS FOR SPRING / SUMMER 2026\" separated by a bullet (●). Pure Ink (#000000) on cream canvas. No background fill, no border. Should scroll continuously left or right. Height approximately 40px, vertically centered text.

### Project Grid Card
**Role:** Thumbnail card in the lower project grid

8px border-radius. Mixed visual content: brand work, packaging, illustration, etc. No caption inside the card — project name appears in mono small text below. Approximately 280-320px wide, aspect ratio roughly 4:5. Cream background between cards (gutters via 20px column gap).

### Project Caption Strip
**Role:** Meta-information row beneath project cards

Two short mono labels left-aligned: project name (uppercase, weight 500) followed by a bullet (●) and scope text (uppercase, weight 400). PP Neue Montreal Mono Medium 14px, Pure Ink (#000000). No background. Sits 10-20px below the card.

### Status Pill
**Role:** \"OFF-DUTY\" status indicator in the footer/header

Charcoal Press (#252525) circle (≈8px) followed by uppercase mono text \"OFF-DUTY\" in PP Neue Montreal Mono Medium 14px weight 500, Pure Ink on cream. No background fill, no border. Sits inline with surrounding footer text. The dot is the only color-coded state indicator in the system and uses charcoal (not a semantic green/red) because the palette is monochrome.

### About Section Text Block
**Role:** Long-form editorial copy

PP Neue Montreal SemiBold 18px weight 400, line-height 1.20, Pure Ink (#000000) on cream canvas. Max-width approximately 480-560px. No pull-quotes, no bold within body, no links colored differently. Appears in a single column on the left side of a 2-column about block (left column may be empty/labeled, right column holds this text).

### Footer Meta Row
**Role:** Bottom-of-page metadata strip

Three-column flex row: left = \"VERSION 6.0\" mono 12px, center = \"INSTAGRAM\" link, right = current status block. PP Neue Montreal Mono Medium 12-14px, Pure Ink (#000000), uppercase. No dividers, no background, sits directly on cream canvas with 40-60px of vertical breathing room above.

### Section Header
**Role:** Monochrome section title between major page blocks

AS Therma Bold Condensed 64-96px weight 400, line-height 0.80, letter-spacing -0.067em, Pure Ink (#000000) on cream. Left-aligned, flush to the page edge. No eyebrow text, no rule above. The scale is smaller than the hero but the same voice.

### Page Frame
**Role:** The full-bleed editorial canvas itself

Background: Cream Paper (#f1f0ee). No border, no card wrapping the page, no max-width container — content is placed directly on the canvas with 20-40px page-edge padding. Sections separated by 60-80px vertical gaps and tonal shifts (cream → bone-gray → cream), never by dividers or shadows.

## Do's and Don'ts

### Do

### Don't

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Cream Paper | `#f1f0ee` | Base page canvas |
| 1 | Bone Gray | `#dbdad9` | Subtle secondary surface for cards, dividers, or quiet blocks |
| 2 | Paper White | `#ffffff` | Elevated or inverse card surface |
| 3 | Charcoal Press | `#252525` | Dark surface for button fills, inverted text blocks, or rare dark sections |

## Elevation

No shadows, no glow, no depth tricks. The design is flatly printed like a broadsheet — separation between layers is achieved through the warm-cream/bone-gray/black/charcoal tonal steps, not through blur or offset. Any element that needs to feel elevated gets a 1px hairline border in #dbdad9 or sits on a slightly different cream tone. This is a deliberate print-design decision: the page should feel like ink on paper, not like glass on a screen.

## Imagery

Photography is full-bleed and editorial — project case study images are tightly cropped product renders (the EVS phone case with floating asteroids is a 3D render), packaging shots, and brand compositions that fill the entire card surface with no padding. Imagery is treated as flat content, not as decorative atmosphere: no rounded masks, no overlays, no color filters. Project thumbnails in the lower grid mix product photography, illustration (the hand-drawn pizza slice characters), and brand identity work. The only consistent rule is that imagery lives inside 8px-radius cards and never bleeds beyond them. No lifestyle photography, no people, no abstract decorative imagery — the work IS the imagery.

## Layout

The page is a single editorial scroll with no fixed sidebar or persistent top nav. Top of page: a massive display headline flush to the upper-left corner, no logo lockup, no top bar — the hero IS the identity. Below the hero, a thin meta-data strip (studio role, services offered, current status, location/time) sits across the full width at 12-14px mono. Project showcase follows as a horizontal row of 2-3 large image cards with logos overlaid. An about block is split into a left empty/label column and a right body-text column. A project grid (3-4 columns) showcases thumbnail work. A continuous marquee/ticker separates the major sections. Navigation is a single floating pill button anchored bottom-center, sticky. The footer is a 3-column meta row. Vertical rhythm is generous (60-80px section gaps) and horizontal rhythm is left-aligned, flush to a 20-40px page edge, with no centered content. The grid is asymmetric: sometimes 2-col, sometimes 3-col, sometimes 6-col — dictated by content, not by a strict column system.

## Agent Prompt Guide

**Quick Color Reference**\n- text (primary): #000000\n- background (canvas): #f1f0ee\n- border / hairline: #dbdad9\n- surface elevated (inverted): #252525\n- surface quiet: #dbdad9\n- primary action: no distinct CTA color

## Similar Brands

- **Pentagram** — Same monochrome editorial portfolio language — massive display type, zero accent color, project images carry the visual weight, minimal UI chrome
- **Manual (manualcreative.com)** — Same condensed grotesque display headlines at extreme sizes, same warm-paper / black-ink monochrome palette, same confidence-through-restraint typographic voice
- **Locomotive (locomotive.ca)** — Same cream-canvas + black-type editorial broadsheet aesthetic, oversized condensed headlines, project grid built on typographic rhythm rather than color
- **Resn (resn.co.nz)** — Same manifesto-style hero where the type itself is the first product, monochrome palette, studio-as-publisher attitude

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-cream-paper: #f1f0ee;
  --color-pure-ink: #000000;
  --color-charcoal-press: #252525;
  --color-bone-gray: #dbdad9;
  --color-paper-white: #ffffff;

  /* Typography — Font Families */
  --font-as-therma-bold-condensed: 'AS Therma Bold Condensed', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-pp-neue-montreal-mono-medium: 'PP Neue Montreal Mono Medium', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-pp-neue-montreal-semibold: 'PP Neue Montreal SemiBold', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-sans-serif-system: 'sans-serif (system)', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.2;
  --text-body-sm: 14px;
  --leading-body-sm: 1.15;
  --text-body: 18px;
  --leading-body: 1.2;
  --text-display: 96px;
  --leading-display: 0.8;
  --tracking-display: -6.43px;
  --text-display-lg: 128px;
  --leading-display-lg: 0.8;
  --tracking-display-lg: -8.58px;
  --text-display-xl: 180px;
  --leading-display-xl: 0.8;
  --tracking-display-xl: -10.8px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;

  /* Spacing */
  --spacing-5: 5px;
  --spacing-6: 6px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-40: 40px;
  --spacing-60: 60px;
  --spacing-80: 80px;
  --spacing-160: 160px;
  --spacing-240: 240px;

  /* Layout */
  --page-max-width: 1440px;
  --section-gap: 80px;
  --card-padding: 20px;
  --element-gap: 10px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-3xl: 32px;

  /* Named Radii */
  --radius-pill: 32px;
  --radius-cards: 8px;
  --radius-media: 8px;
  --radius-small: 4px;
  --radius-buttons: 32px;

  /* Surfaces */
  --surface-cream-paper: #f1f0ee;
  --surface-bone-gray: #dbdad9;
  --surface-paper-white: #ffffff;
  --surface-charcoal-press: #252525;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-cream-paper: #f1f0ee;
  --color-pure-ink: #000000;
  --color-charcoal-press: #252525;
  --color-bone-gray: #dbdad9;
  --color-paper-white: #ffffff;

  /* Typography */
  --font-as-therma-bold-condensed: 'AS Therma Bold Condensed', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-pp-neue-montreal-mono-medium: 'PP Neue Montreal Mono Medium', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-pp-neue-montreal-semibold: 'PP Neue Montreal SemiBold', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-sans-serif-system: 'sans-serif (system)', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.2;
  --text-body-sm: 14px;
  --leading-body-sm: 1.15;
  --text-body: 18px;
  --leading-body: 1.2;
  --text-display: 96px;
  --leading-display: 0.8;
  --tracking-display: -6.43px;
  --text-display-lg: 128px;
  --leading-display-lg: 0.8;
  --tracking-display-lg: -8.58px;
  --text-display-xl: 180px;
  --leading-display-xl: 0.8;
  --tracking-display-xl: -10.8px;

  /* Spacing */
  --spacing-5: 5px;
  --spacing-6: 6px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-40: 40px;
  --spacing-60: 60px;
  --spacing-80: 80px;
  --spacing-160: 160px;
  --spacing-240: 240px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-3xl: 32px;
}
```
