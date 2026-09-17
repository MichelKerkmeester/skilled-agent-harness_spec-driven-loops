# Lamborghini.com — Style Reference
> Showroom black with one yellow car under spotlights

**Theme:** mixed

Lamborghini's design language is automotive theater: a cinematic dark stage where Giallo yellow punctuates an otherwise black-and-white world. The interface alternates between full-bleed dark hero canvases (where video and product photography dominate) and quiet light-gray content surfaces (where editorial storytelling takes over). Typography is the loudest element — an industrial custom sans-serif (LamboType) spoken only in UPPERCASE, scaled aggressively to 80–120px for hero statements. Components are minimal and structural: no rounded cards, no soft shadows, no decorative gradients — just hard-edged surfaces, hairline rules, and one vivid yellow action button. The overall feeling is gallery-grade restraint interrupted by a single confident color hit, the way a matte black showroom is broken by one yellow car under a spotlight.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Giallo Vivo | `#ffc000` | `--color-giallo-vivo` | Yellow supporting accent for decorative details and low-frequency emphasis. Do not promote it to the primary CTA color |
| Giallo Ombra | `#917300` | `--color-giallo-ombra` | Hover or secondary yellow state, list markers with brand accent — darker mustard variant of the primary |
| Carbony Black | `#202020` | `--color-carbony-black` | Primary text, dark hero canvases, navigation bar — the workhorse near-black used at 1400+ occurrences |
| Pure Black | `#000000` | `--color-pure-black` | Body copy, footer ink, icon strokes on light surfaces — maximum contrast text and absolute dark |
| Carbon Deep | `#181818` | `--color-carbon-deep` | Headline color on light surfaces, dark surface variant, link ink — slightly warmer alternative to pure black |
| Pearl White | `#ffffff` | `--color-pearl-white` | Page canvas, light card surface, button text on dark, hero text overlay — dominant light surface |
| Marble Gray | `#f5f5f5` | `--color-marble-gray` | Alternate section background, body container fill, badge surface — the off-white that breaks up the white-white rhythm |
| Graphite Border | `#494949` | `--color-graphite-border` | Section dividers, link ink on light backgrounds, mid-weight borders |
| Steel Mid | `#7d7d7d` | `--color-steel-mid` | Button border outlines, secondary link text, muted UI chrome |
| Ash Border | `#969696` | `--color-ash-border` | Light borders, disabled states, tertiary dividers on white surfaces |
| Anvil | `#313131` | `--color-anvil` | Body copy variant, dark border accent — sits between Carbony Black and deeper neutrals |

## Tokens — Typography

### LamboType — Exclusive brand typeface used at all hierarchy levels. Renders always in UPPERCASE for editorial weight, with a consistent 0.0230em letter-spacing across all sizes — the spacing is wide enough to feel engineered, not cramped. Display sizes reach 120px with tight 0.92–1.00 line-height so headlines stack into monolithic typographic blocks. The single weight (400) at radically different sizes (10px labels → 120px display) is the signature: the system achieves voice through scale contrast, never weight contrast. · `--font-lambotype`
- **Substitute:** Barlow Condensed (closest open equivalent for the tall industrial feel); Rajdhani as a fallback; Bebas Neue for display-only contexts
- **Weights:** 400
- **Sizes:** 10px, 12px, 16px, 18px, 27px, 32px, 40px, 54px, 80px, 120px
- **Line height:** 0.92, 1.00, 1.13, 1.15, 1.19, 1.37, 1.38, 1.50, 1.56, 1.63, 1.83, 2.00
- **Letter spacing:** 0.0230em across all sizes — applied uniformly to labels (12px), body (16px), and display (120px) alike, giving every text node an engineered, spaced-out rhythm
- **Role:** Exclusive brand typeface used at all hierarchy levels. Renders always in UPPERCASE for editorial weight, with a consistent 0.0230em letter-spacing across all sizes — the spacing is wide enough to feel engineered, not cramped. Display sizes reach 120px with tight 0.92–1.00 line-height so headlines stack into monolithic typographic blocks. The single weight (400) at radically different sizes (10px labels → 120px display) is the signature: the system achieves voice through scale contrast, never weight contrast.

### Open Sans — Rare fallback or supplementary body text at 16px, normal letter-spacing — only used in 3 occurrences, effectively vestigial; do not introduce for new pages · `--font-open-sans`
- **Substitute:** system-ui
- **Weights:** 400
- **Sizes:** 16px
- **Line height:** 1.50
- **Role:** Rare fallback or supplementary body text at 16px, normal letter-spacing — only used in 3 occurrences, effectively vestigial; do not introduce for new pages

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 10px | 1.5 | 0.23px | `--text-caption` |
| body | 16px | 1.5 | 0.37px | `--text-body` |
| subheading | 18px | 1.5 | 0.41px | `--text-subheading` |
| heading-sm | 27px | 1.37 | 0.62px | `--text-heading-sm` |
| heading | 32px | 1.38 | 0.74px | `--text-heading` |
| heading-lg | 40px | 1.19 | 0.92px | `--text-heading-lg` |
| display | 54px | 1.13 | 1.24px | `--text-display` |
| display-lg | 80px | 1 | 1.84px | `--text-display-lg` |
| hero | 120px | 0.92 | 2.76px | `--text-hero` |

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
| 160 | 160px | `--spacing-160` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 0px |
| badges | 0px |
| images | 0px |
| buttons | 0px |

### Layout

- **Page max-width:** 1440px
- **Section gap:** 80px
- **Card padding:** 24px
- **Element gap:** 24px

## Components

### Hero Stage
**Role:** Full-bleed cinematic opener with video or photographic background

Full-viewport dark canvas (#202020 or #000000) with overlaid white LamboType headline at 80–120px, uppercase, line-height ~0.92, letter-spacing 0.0230em. Eyebrow label at 12–16px sits above headline in same uppercase treatment. Yellow CTA button anchored bottom-left, pause/video control anchored bottom-right. Content sits in a left-aligned column, max 50% of viewport width.

### Giallo Action Button
**Role:** Primary call-to-action

Solid #ffc000 background, no border, 0px radius, padding 16px 24px. LamboType 12–16px uppercase white text (#ffffff) with arrow icon (→) in 16px to the right of the label. Letter-spacing 0.0230em. No shadow. Sits as a hard rectangular block of yellow against dark or white surfaces — the only color in the interface, so it must dominate.

### Ghost Link Button
**Role:** Secondary action or text-link CTA

No fill, no border. LamboType 12–16px uppercase text in #202020 or #ffffff depending on surface, with right-arrow icon. Letter-spacing 0.0230em. Used for less critical actions (model listings, editorial links). The arrow is the only visual anchor.

### Outlined Nav Button
**Role:** Tertiary button with border

Transparent fill, 1px border in #7d7d7d or #969696, 0px radius, 12–16px LamboType uppercase text. Used sparingly in navigation or filter contexts where a middle-weight button is needed between Giallo solid and Ghost link.

### Top Navigation Bar
**Role:** Primary site navigation

Fixed top bar at full width, #202020 background, ~64px height. Left: hamburger menu icon + 'MENU' label in white LamboType 12px. Center: bull logo in white. Right: camera icon + search icon. No visible border-bottom — the dark surface meets the hero directly.

### Section Heading Block
**Role:** Editorial section title with linked descriptor

Two-column row: left side holds section name in LamboType 40–54px uppercase #202020 (#000000 on #f5f5f5), right side holds 'descubrir [topic]' link in LamboType 12px uppercase #202020 with right-arrow. Vertically centered, separated by generous whitespace. This is the signature section opener pattern.

### Product Image Tile
**Role:** Full-bleed product photograph

0px radius, no border, no shadow — photographs run edge-to-edge within their grid cell. Caption sits below in LamboType 12–16px uppercase #202020 with a date stamp at 10–12px above the title. No rounded corners, no overlay UI.

### Three-Column Story Grid
**Role:** Editorial story or news grid

Three equal-width columns with 24px gap. Each cell: date label (10–12px LamboType uppercase) above headline (16–27px LamboType uppercase), then a full-bleed image below at 0px radius. No card chrome — the image and text float directly on the white canvas with whitespace as the only separator.

### Carousel Navigation Pips
**Role:** Hero slide indicator and pause control

Bottom-right of hero: two horizontal short lines (active + inactive) at ~40px width, 1–2px height, #ffffff, with a hexagonal pause button outlined in #ffffff. LamboType is not used here — these are pure iconographic elements. Spacing between pips: 24px.

### Full-Bleed Editorial Image
**Role:** Large product or lifestyle photograph

100% width, 0px radius, no caption overlay. Photograph extends edge to edge of viewport. Used for car close-ups (leather stitching, badges) and lifestyle shots (circuit, landscape). The image does the talking — no frame, no shadow, no rounded corner.

### Event Banner
**Role:** Promotional or event announcement band

Lighter photographic background with overlay text block at left. Headline at 54–80px LamboType uppercase white, supporting body at 16–18px uppercase white, then a Giallo CTA button below. Right side: implicit photographic content. Padding: 40px top/bottom.

### Date Stamped Card
**Role:** News or article entry

White surface, 0px radius, no border. Date in LamboType 10–12px uppercase #7d7d7d or #969696. Headline in LamboType 16–18px uppercase #202020, 0.0230em letter-spacing. Followed by a 4:3 or 16:9 image at 0px radius. Padding: 24px.

## Do's and Don'ts

### Do
- Render every heading in UPPERCASE LamboType at 0.0230em letter-spacing — no exceptions, this is the typographic voice
- Use #ffc000 Giallo Vivo for exactly one element per screen, almost always the primary action button
- Alternate between full-bleed #202020 dark surfaces and #ffffff/#f5f5f5 light surfaces section by section to create cinematic pacing
- Scale display type aggressively: 80–120px for hero statements, 40–54px for section openers, 16–18px for body
- Keep all radius values at 0px — hard edges are non-negotiable, from buttons to images to cards
- Use 8px-base spacing multiples (8, 16, 24, 32, 40, 48, 64, 80px) — never break the grid with arbitrary values
- Separate components with surface color contrast and whitespace, never with shadows or borders

### Don't
- Do not use rounded corners on any element — buttons, images, cards, and badges all sit at 0px radius
- Do not introduce additional colors beyond #ffc000 and its #917300 variant — the 0% colorfulness is the brand
- Do not add drop shadows, soft glows, or elevation effects — separation comes from surface color only
- Do not use more than one weight of LamboType — it ships at 400 only; hierarchy comes from size and uppercase treatment
- Do not place the Giallo yellow on more than one element per screen — it loses urgency as a signal
- Do not use lowercase or sentence case for any display or heading text — UPPERCASE is mandatory at 16px and above
- Do not apply letter-spacing values other than 0.0230em — the uniform tracking is what makes the type system feel engineered

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas White | `#ffffff` | Default page background for editorial and content sections |
| 1 | Marble | `#f5f5f5` | Alternate section background, subtle band separator from white canvas |
| 2 | Carbony | `#202020` | Dark stage for full-bleed heroes, video backgrounds, and product showcase sections |
| 3 | Carbon Deep | `#181818` | Navigation bar, footer, and slightly darker surface for layering above Carbony |
| 4 | Pure Black | `#000000` | Terminal contrast surface, body ink, deepest text |

## Elevation

Lamborghini deliberately avoids drop shadows. All visual separation comes from surface color contrast (white → #f5f5f5 → #202020 → #000000) and hairline 1px borders. Components sit flat against the canvas like automotive body panels — no floating cards, no soft glows. This is a hard-edged, industrial aesthetic where shadow would feel decorative and weak.

## Imagery

Photography is the primary visual language and dominates the interface. Treatment is full-bleed and edge-to-edge with 0px radius — images are never cropped to rounded frames. The hero uses cinematic video and atmospheric photography (tunnels, headlights, road motion) on dark canvases. Product photography is tight, macro-grade detail: leather stitching, embroidered bull logos, body panel curves. Car lineup photography uses track and landscape backgrounds (Imola circuit, open road). Lifestyle and editorial imagery is high-contrast, low-key, often shot at dawn/dusk or in studio lighting. No illustration, no abstract graphics, no icons-as-decoration. Icons are minimal and white-on-dark line icons. The image-to-text ratio is high in heroes, balanced in editorial sections.

## Layout

The page model alternates between full-bleed dark stages and max-width (1440px) contained light sections. The hero is full-viewport with a centered or left-aligned text block sitting over a video/photographic background. Subsequent sections use a centered max-width container with left-aligned text in two-column rows (heading left, link right). Feature and story sections deploy 3-column image grids with 24px gap. Navigation is a fixed dark top bar (64px) with centered logo. Footer is full-width dark. Vertical rhythm uses 80px section gaps with 24px internal element spacing. The overall flow is: dark cinematic hero → light editorial band → dark product showcase → light story grid → dark footer. Sections rarely use visible dividers — surface color contrast alone defines the boundaries.

## Agent Prompt Guide

Quick Color Reference:
- text: #202020 (primary on light), #ffffff (primary on dark)
- background: #ffffff (light canvas), #202020 (dark stage)
- border: #969696 (light hairlines), #494949 (darker dividers)
- accent: #ffc000 (Giallo Vivo — single hit per screen)
- primary action: no distinct CTA color

Example Component Prompts:

No distinct primary action color was observed; use the extracted neutral button treatments instead of inventing a filled CTA color.

2. Create a section heading block: two-column row on #ffffff background. Left: section name at 54px LamboType weight 400, uppercase, #202020, letter-spacing 0.0230em. Right: discovery link at 12px LamboType weight 400, uppercase, #202020 with right-arrow icon. 80px padding top and bottom. No borders, no shadows.

3. Create a three-column story grid: three equal columns with 24px gap on #ffffff. Each cell: date label at 10px LamboType weight 400, uppercase, #7d7d7d, then headline at 16px LamboType weight 400, uppercase, #202020, then a full-bleed photograph below at 0px radius. 64px section gap above the grid.


5. Create a product image tile: full-bleed photograph at 0px radius, no border, no shadow. Below the image: caption in 12px LamboType weight 400, uppercase, #202020, letter-spacing 0.0230em. 24px padding around the tile content. Sits on #ffffff or #f5f5f5 surface.

## Similar Brands

- **Ferrari.com** — Same automotive-theater approach: dark cinematic hero with full-bleed video, monospace-tinged uppercase display type, single Rosso Corsa red accent against black-and-white palette, and 0px-radius hard edges throughout
- **Porsche.com** — Shares the alternating dark hero / light editorial section rhythm, uppercase condensed-style display headlines at 80–120px scale, and a monochromatic palette punctuated by a single brand color (red for Porsche) on CTAs only
- **Ducati.com** — Both lean into full-bleed dark product photography, uppercase custom sans-serif headlines with uniform letter-spacing, and a minimal component vocabulary — 0px radius buttons, hairline borders, no shadows
- **Aston Martin** — Luxury automotive restraint: dark cinematic surfaces, uppercase editorial display type, a single accent color (British Racing Green or Aston Martin Green) used only on action elements, generous 80px section spacing
- **McLaren Automotive** — Industrial engineering aesthetic: dark full-bleed hero stages, uppercase condensed display sans-serif, single vibrant accent (Papaya Orange) as the lone chromatic element, 0px-radius hard-edged component system

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-giallo-vivo: #ffc000;
  --color-giallo-ombra: #917300;
  --color-carbony-black: #202020;
  --color-pure-black: #000000;
  --color-carbon-deep: #181818;
  --color-pearl-white: #ffffff;
  --color-marble-gray: #f5f5f5;
  --color-graphite-border: #494949;
  --color-steel-mid: #7d7d7d;
  --color-ash-border: #969696;
  --color-anvil: #313131;

  /* Typography — Font Families */
  --font-lambotype: 'LamboType', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-open-sans: 'Open Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.5;
  --tracking-caption: 0.23px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: 0.37px;
  --text-subheading: 18px;
  --leading-subheading: 1.5;
  --tracking-subheading: 0.41px;
  --text-heading-sm: 27px;
  --leading-heading-sm: 1.37;
  --tracking-heading-sm: 0.62px;
  --text-heading: 32px;
  --leading-heading: 1.38;
  --tracking-heading: 0.74px;
  --text-heading-lg: 40px;
  --leading-heading-lg: 1.19;
  --tracking-heading-lg: 0.92px;
  --text-display: 54px;
  --leading-display: 1.13;
  --tracking-display: 1.24px;
  --text-display-lg: 80px;
  --leading-display-lg: 1;
  --tracking-display-lg: 1.84px;
  --text-hero: 120px;
  --leading-hero: 0.92;
  --tracking-hero: 2.76px;

  /* Typography — Weights */
  --font-weight-regular: 400;

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
  --spacing-160: 160px;

  /* Layout */
  --page-max-width: 1440px;
  --section-gap: 80px;
  --card-padding: 24px;
  --element-gap: 24px;

  /* Named Radii */
  --radius-cards: 0px;
  --radius-badges: 0px;
  --radius-images: 0px;
  --radius-buttons: 0px;

  /* Surfaces */
  --surface-canvas-white: #ffffff;
  --surface-marble: #f5f5f5;
  --surface-carbony: #202020;
  --surface-carbon-deep: #181818;
  --surface-pure-black: #000000;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-giallo-vivo: #ffc000;
  --color-giallo-ombra: #917300;
  --color-carbony-black: #202020;
  --color-pure-black: #000000;
  --color-carbon-deep: #181818;
  --color-pearl-white: #ffffff;
  --color-marble-gray: #f5f5f5;
  --color-graphite-border: #494949;
  --color-steel-mid: #7d7d7d;
  --color-ash-border: #969696;
  --color-anvil: #313131;

  /* Typography */
  --font-lambotype: 'LamboType', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-open-sans: 'Open Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.5;
  --tracking-caption: 0.23px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: 0.37px;
  --text-subheading: 18px;
  --leading-subheading: 1.5;
  --tracking-subheading: 0.41px;
  --text-heading-sm: 27px;
  --leading-heading-sm: 1.37;
  --tracking-heading-sm: 0.62px;
  --text-heading: 32px;
  --leading-heading: 1.38;
  --tracking-heading: 0.74px;
  --text-heading-lg: 40px;
  --leading-heading-lg: 1.19;
  --tracking-heading-lg: 0.92px;
  --text-display: 54px;
  --leading-display: 1.13;
  --tracking-display: 1.24px;
  --text-display-lg: 80px;
  --leading-display-lg: 1;
  --tracking-display-lg: 1.84px;
  --text-hero: 120px;
  --leading-hero: 0.92;
  --tracking-hero: 2.76px;

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
  --spacing-160: 160px;
}
```
