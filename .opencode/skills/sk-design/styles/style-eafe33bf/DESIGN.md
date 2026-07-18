# 큰그림컴퍼니 — Style Reference
> Concrete slab typographic manifesto. A black-on-white press kit where oversized Helvetica does the work of photography, and the only texture is a single sheet of crumpled paper under the body type.

**Theme:** light

Bigpicture Company is a monochrome editorial system that treats the webpage as a printed press kit laid out on raw paper. The interface strips away all chromatic color and relies entirely on black ink, white space, hairline rules, and a single crumpled-paper texture to carry atmosphere. Typography is the product: display headlines reach 274px at Helvetica Neue 700 with aggressive negative tracking, making text the dominant visual mass on every screen. Monospace labels ([01-N INTRODUCTION], CREATIVE/AGENCY) act as print-style captions, while four-pointed sparkle icons serve as the only ornament between sections. Layout is generous and zine-like — 72px section gaps, 144-250px horizontal padding, and full-bleed image blocks with 288px corners let the page breathe like a gallery wall rather than a software product.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Press Ink | `#121212` | `--color-press-ink` | Primary text, hairlines, section borders, icon strokes, footer text — the singular dark tone that carries 95% of all foreground information |
| Paper White | `#ffffff` | `--color-paper-white` | Page canvas, card surfaces, nav pill background, heading-bordered surfaces |
| Newsprint | `#f1f1f1` | `--color-newsprint` | Subtle surface fills, soft borders, hairline dividers, the tone behind the crumpled-paper texture |
| Foil Gray | `#e1e1e1` | `--color-foil-gray` | Light borders, icon stroke accents, secondary dividers |
| Mute Gray | `#c5c5c5` | `--color-mute-gray` | Tertiary text, disabled state, low-contrast surface lines |

## Tokens — Typography

### Helvetica Neue — Universal workhorse — body copy at 17px/1.29, display headlines at 75–274px with -0.04em tracking at the largest sizes, nav labels at 15px · `--font-helvetica-neue`
- **Substitute:** Inter, Neue Haas Grotesk, or system-ui with tight optical tracking
- **Weights:** 400, 500, 700
- **Sizes:** 14, 15, 16, 17, 20, 75, 274
- **Line height:** 1.00–1.60
- **Letter spacing:** -0.0400em, -0.0100em
- **Role:** Universal workhorse — body copy at 17px/1.29, display headlines at 75–274px with -0.04em tracking at the largest sizes, nav labels at 15px

### PPSupplyMono — Meta labels and bracketed captions like [01-N INTRODUCTION] and section tags (ADVERTISEMENTS, CREATIVE/AGENCY, OFFLINE MARKETING) — these are the only typographic accents that break the Helvetica monotony · `--font-ppsupplymono`
- **Substitute:** JetBrains Mono, IBM Plex Mono, Space Mono
- **Weights:** 400
- **Sizes:** 13, 16, 17
- **Line height:** 1.00–2.00
- **Role:** Meta labels and bracketed captions like [01-N INTRODUCTION] and section tags (ADVERTISEMENTS, CREATIVE/AGENCY, OFFLINE MARKETING) — these are the only typographic accents that break the Helvetica monotony

### PPSupplySans — Secondary nav and footer micro-text where a different sans voice is needed · `--font-ppsupplysans`
- **Substitute:** Inter, Söhne, ABC Diatype
- **Weights:** 400
- **Sizes:** 17, 22
- **Line height:** 1.00–1.20
- **Role:** Secondary nav and footer micro-text where a different sans voice is needed

### Rock Salt — Rare handwritten signature accent for one or two words per page (e.g. the circled 'pleasure' annotation) — used like a stamp, never for content · `--font-rock-salt`
- **Substitute:** Caveat, Permanent Marker, or a custom handwritten font
- **Weights:** 400
- **Sizes:** 17
- **Line height:** 1.47
- **Letter spacing:** -0.0200em
- **Role:** Rare handwritten signature accent for one or two words per page (e.g. the circled 'pleasure' annotation) — used like a stamp, never for content

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 13px | 2 | — | `--text-caption` |
| body | 17px | 1.29 | — | `--text-body` |
| subheading | 20px | 1.2 | — | `--text-subheading` |
| heading-sm | 22px | 1.2 | — | `--text-heading-sm` |
| heading | 75px | 1.05 | -1.68px | `--text-heading` |
| display | 274px | 1 | -10.96px | `--text-display` |

## Tokens — Spacing & Shapes

**Density:** spacious

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 10 | 10px | `--spacing-10` |
| 17 | 17px | `--spacing-17` |
| 20 | 20px | `--spacing-20` |
| 30 | 30px | `--spacing-30` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 50 | 50px | `--spacing-50` |
| 72 | 72px | `--spacing-72` |
| 81 | 81px | `--spacing-81` |
| 144 | 144px | `--spacing-144` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 20px |
| cards | 20px |
| images | 288px |
| nav-item | 28px |
| nav-pill | 40px |

### Layout

- **Page max-width:** 1440px
- **Section gap:** 72px
- **Card padding:** 40px
- **Element gap:** 50px

## Components

### Navigation Pill
**Role:** Sticky top-center nav container

Floating white pill with 40px outer radius, 28px inner item radius, 1px solid #121212 border, 20px horizontal padding, 10px vertical padding. Contains HOME (active state with subtle inset fill) + PROJECTS + CONTACT in Helvetica Neue 15px/500 #121212, separated by thin dividers.

### Logo Wordmark
**Role:** Top-left brand identifier

Three-line stack reading 'Bigpicture Company / We share / Our pleasure' in Helvetica Neue 15px/500 #121212, flush left, no mark — the text is the logo.

### Display Headline
**Role:** Hero-scale typographic block

Helvetica Neue 700 at 274px, line-height 1.0, letter-spacing -0.04em (#121212). All-caps, multi-word lines that fill the viewport width — used for statements like 'PEOPLE BRAND' and 'PLEASURE'. No gradient, no shadow, no decoration — the size alone is the visual event.

### Section Heading
**Role:** Mid-page editorial headline

Helvetica Neue 700 at 75px, line-height 1.05, letter-spacing -0.01em (#121212). All-caps, often followed by a sparkle divider.

### Monospace Meta Tag
**Role:** Caption-style label

PPSupplyMono 16px/400, uppercase, letter-spacing normal, #121212. Enclosed in square brackets like [01-N INTRODUCTION]. Used to number sections and tag categories (ADVERTISEMENTS / CREATIVE/AGENCY / OFFLINE MARKETING) — acts as a running header in a printed zine.

### Body Manifesto Block
**Role:** Centered editorial paragraph

Helvetica Neue 400 at 17px, line-height 1.6, max-width ~720px, centered. #121212 on white. Used for the company description at the top of the page — restrained, justified feel, no drop cap, no emphasis.

### Sparkle Divider
**Role:** Section separator

Four-pointed star/sparkle icon in #121212, ~20px, repeated horizontally with 72px gaps to create a visual band between major sections. The only recurring decoration on the page.

### Rounded Image Block
**Role:** Full-bleed hero photography

Architectural/outdoor advertising photo with 288px border-radius, full viewport width, no caption. The extreme rounding softens what would otherwise be a stark industrial image.

### Address Block
**Role:** Contact / location caption

Helvetica Neue 400 at 17px/1.2, #121212, three-line stack (floor/address/country) placed over the image — typeset directly on top of the hero photo, no background plate.

### Handwritten Annotation
**Role:** Editorial stamp

Rock Salt 17px #121212 circled around a word (e.g. 'pleasure') — a print-editor's red-pen mark translated to handwritten type. Use once per page maximum.

### Footer Strip
**Role:** Bottom-of-page meta

Top border 1px solid #121212, 30–40px vertical padding, three-column grid: logo wordmark left, '© Seoul, Korea' right, monospace tag center. #121212 text on white.

### Nav Indicator Globe
**Role:** Inline iconographic accent

Small line-drawn globe icon in #121212 stroke, used in the company descriptor text and in the manifesto line 'WHEN SOMEONE ELSE IS NEED THAT JOY COMES BACK TO' — the globe replaces the word 'need' as a visual metaphor.

## Do's and Don'ts

### Do
- Set display headlines at 75–274px in Helvetica Neue 700 with -0.04em tracking — type size is the primary visual mass, not imagery
- Use #121212 as the only foreground color; never introduce chromatic accents
- Apply the 288px border-radius to all full-bleed images to soften architectural/outdoor photography
- Wrap meta labels in square brackets using PPSupplyMono 16px: [SECTION NAME]
- Use 40px radius for the navigation pill and 28px for individual nav items inside it
- Maintain 72px between major sections and 50px between content blocks within a section
- Place the four-pointed sparkle icon in a horizontal row of 4–5 as the standard section divider

### Don't
- Do not add any color other than the five neutrals (#121212, #ffffff, #f1f1f1, #e1e1e1, #c5c5c5) — zero chroma is the brand
- Do not use box-shadows; depth comes from hairline borders and the paper texture only
- Do not break the all-caps convention on display headlines; mixed case is reserved for the Rock Salt annotation
- Do not use 9999px pill radii on buttons or tags — the largest standard radius is 40px on the nav
- Do not compress line-height below 1.0 on display type, and do not exceed 1.6 on body
- Do not place body copy in a column wider than ~720px — the editorial measure must stay readable
- Do not add hover-lift or transition effects to cards; the aesthetic is static print, not interactive UI

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#ffffff` | Full page background, base for all content |
| 1 | Paper | `#f1f1f1` | Subtle fills behind body type and the crumpled texture layer |
| 2 | Elevated Pill | `#ffffff` | Floating navigation container, isolated card blocks |

## Elevation

No shadows. The system uses 1px hairline borders in #121212 and generous whitespace to establish structure. Depth comes from the crumpled-paper texture overlay and extreme type sizing, not from cast shadows or z-axis elevation.

## Imagery

Photography dominates the hero — large architectural and outdoor advertising shots (billboards, building wraps, street-level ad placements) presented full-bleed with 288px corner rounding. The crumpled paper texture overlays the lower page sections as a tactile surface treatment, giving the interface the feel of a print zine. A small line-drawn globe icon appears as the only illustrative element. No 3D, no abstract gradients, no product mockups — imagery is documentary, industrial, and rooted in the agency's outdoor advertising portfolio.

## Layout

Max-width ~1440px centered with 40–144px horizontal padding depending on section density. Hero is a full-bleed image with overlay type. Below the image, content alternates between centered text stacks and edge-to-edge display typography. The lower 60% of the page is a long scrolling manifesto where oversized display type fills the viewport width line by line, separated by sparkle divider rows. Navigation is a floating pill centered at the top of the viewport, not a full-width bar. Footer is a single hairline-bordered strip.

## Agent Prompt Guide

**Quick Color Reference**
- text: #121212
- background: #ffffff
- surface/soft: #f1f1f1
- border: #e1e1e1
- muted: #c5c5c5
- primary action: no distinct CTA color

**Example Component Prompts**

1. *Navigation Pill*: Centered floating container, 40px outer radius, 28px item radius, 1px solid #121212 border, white #ffffff background, 20px horizontal padding, 10px vertical padding. Three text items in Helvetica Neue 15px/500 #121212: HOME (active, with a subtle inset fill), PROJECTS, CONTACT.

2. *Display Headline*: Full-width block, text 'PEOPLE BRAND' in Helvetica Neue 700 at 274px, line-height 1.0, letter-spacing -10.96px, color #121212, on #ffffff background. Two lines, each filling the viewport width.

3. *Monospace Meta Tag*: Single line '[01-N INTRODUCTION]' in PPSupplyMono 16px/400, uppercase, letter-spacing normal, color #121212, centered above a section.

4. *Full-Bleed Image Block*: Photographic image (architectural/outdoor ad) at 100% viewport width, 288px border-radius on all corners, no caption, no border. Place a three-line address caption in Helvetica Neue 17px/1.2 #121212 over the image, top-right area, no background plate.

5. *Sparkle Divider Row*: Five four-pointed sparkle icons in #121212, 20px each, arranged horizontally with 72px gaps, centered on the page. Acts as a section break between major content blocks.

## Texture & Surface Treatment

The crumpled paper texture is a single low-opacity noise layer applied behind the lower 60% of the page (roughly from the PLEASURE section downward). It should read as a subtle tactile grain, not as a pattern — the goal is to make the digital surface feel like a physical print artifact. Do not tile it, do not animate it, do not apply it to cards or components. The texture is a page-level treatment, not a component-level one.

## Typographic Voice

Three voices coexist: Helvetica Neue (the workhorse, used for 95% of content including all display headlines), PPSupplyMono (the print caption, used for bracketed meta labels), and Rock Salt (the editor's pen, used once per page to circle a single word). The mono font carries editorial metadata; the handwritten font carries human annotation. Never substitute a serif for any of these — the system is strictly neo-grotesque + monospace + handwritten, with no Garamond or Times-style faces allowed.

## Similar Brands

- **Studio Daïdai** — Same monochrome neo-grotesque + monospace label pairing with oversized display headlines and generous editorial spacing
- **Bureau Cool** — Identical print-zine sensibility with white canvas, hairline rules, all-caps display type at 100–250px, and zero chromatic color
- **Apartamento Magazine** — Same restrained editorial restraint, hand-annotated typography, and white-paper surface treatment with subtle grain
- **AnOther Magazine digital** — Shares the oversized Helvetica display + monospace caption structure and the press-kit atmosphere on a white canvas
- **Werkplaats Typografie archive** — Same brutalist typographic-manifesto approach: one typeface family at extreme sizes, monospace metadata, no decorative imagery

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-press-ink: #121212;
  --color-paper-white: #ffffff;
  --color-newsprint: #f1f1f1;
  --color-foil-gray: #e1e1e1;
  --color-mute-gray: #c5c5c5;

  /* Typography — Font Families */
  --font-helvetica-neue: 'Helvetica Neue', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-ppsupplymono: 'PPSupplyMono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-ppsupplysans: 'PPSupplySans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-rock-salt: 'Rock Salt', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 13px;
  --leading-caption: 2;
  --text-body: 17px;
  --leading-body: 1.29;
  --text-subheading: 20px;
  --leading-subheading: 1.2;
  --text-heading-sm: 22px;
  --leading-heading-sm: 1.2;
  --text-heading: 75px;
  --leading-heading: 1.05;
  --tracking-heading: -1.68px;
  --text-display: 274px;
  --leading-display: 1;
  --tracking-display: -10.96px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-10: 10px;
  --spacing-17: 17px;
  --spacing-20: 20px;
  --spacing-30: 30px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-50: 50px;
  --spacing-72: 72px;
  --spacing-81: 81px;
  --spacing-144: 144px;

  /* Layout */
  --page-max-width: 1440px;
  --section-gap: 72px;
  --card-padding: 40px;
  --element-gap: 50px;

  /* Border Radius */
  --radius-2xl: 20px;
  --radius-3xl: 28px;
  --radius-3xl-2: 40px;
  --radius-full: 288px;

  /* Named Radii */
  --radius-tags: 20px;
  --radius-cards: 20px;
  --radius-images: 288px;
  --radius-nav-item: 28px;
  --radius-nav-pill: 40px;

  /* Surfaces */
  --surface-canvas: #ffffff;
  --surface-paper: #f1f1f1;
  --surface-elevated-pill: #ffffff;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-press-ink: #121212;
  --color-paper-white: #ffffff;
  --color-newsprint: #f1f1f1;
  --color-foil-gray: #e1e1e1;
  --color-mute-gray: #c5c5c5;

  /* Typography */
  --font-helvetica-neue: 'Helvetica Neue', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-ppsupplymono: 'PPSupplyMono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-ppsupplysans: 'PPSupplySans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-rock-salt: 'Rock Salt', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 13px;
  --leading-caption: 2;
  --text-body: 17px;
  --leading-body: 1.29;
  --text-subheading: 20px;
  --leading-subheading: 1.2;
  --text-heading-sm: 22px;
  --leading-heading-sm: 1.2;
  --text-heading: 75px;
  --leading-heading: 1.05;
  --tracking-heading: -1.68px;
  --text-display: 274px;
  --leading-display: 1;
  --tracking-display: -10.96px;

  /* Spacing */
  --spacing-10: 10px;
  --spacing-17: 17px;
  --spacing-20: 20px;
  --spacing-30: 30px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-50: 50px;
  --spacing-72: 72px;
  --spacing-81: 81px;
  --spacing-144: 144px;

  /* Border Radius */
  --radius-2xl: 20px;
  --radius-3xl: 28px;
  --radius-3xl-2: 40px;
  --radius-full: 288px;
}
```
