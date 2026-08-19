# Flim — Style Reference
> Scattered polaroids on a sketchpad grid

**Theme:** light

Flim's design language is a creative-tool's analog workspace: a vast light-gray canvas etched with a subtle grid, scattered with rounded polaroid-like image cards, and anchored by a single oversized custom wordmark. The system is 99% monochrome — near-black ink on warm light gray paper — with tiny, deliberate splashes of signal green, ember orange, and highlight yellow used as functional punctuation rather than decoration. Typography splits into three voices: a heavy custom display face (Swizzy) for the hero wordmark, a mono micro-typeface (PP Neue Montreal Mono) for navigation, labels, and search placeholders, and system Arial for body. Components feel loose and handmade rather than gridded: pill-shaped search bars, image thumbnails with a 16px radius floating asymmetrically, ghost navigation, and a single hard-edged black button. The grid pattern and scattered image layout evoke a corkboard or lightbox — the visual metaphor of a creative agency's working surface.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Ink | `#141414` | `--color-ink` | Primary text, nav links, icon strokes, image card borders, filled button background, the dominant near-black that carries the entire UI |
| Paper | `#ffffff` | `--color-paper` | Text on dark surfaces, surface highlights, card surfaces floating above the canvas, button text on filled actions |
| Canvas | `#f5f5f5` | `--color-canvas` | Page background, search bar fills, the warm light gray that is the base layer for everything |
| Mist | `#e9e9e9` | `--color-mist` | Secondary surface fills, card backgrounds, alternating bands below the canvas, muted blocks |
| Hairline | `#d9d9d9` | `--color-hairline` | Grid line strokes, subtle dividers, the near-invisible linework that creates the sketchpad texture |
| Signal Green | `#30a81d` | `--color-signal-green` | Green outline accent for tags, dividers, and focused UI edges |
| Forest | `#21935b` | `--color-forest` | Deeper green for icon borders, heading underlines, secondary green accents where Signal Green would be too bright |
| Highlight Yellow | `#fecc33` | `--color-highlight-yellow` | Heading background highlight wash, warm tag fills — used as a marker-pen underline behind words, not as surface color |
| Ember | `#ff8400` | `--color-ember` | Warm card accent backgrounds, orange UI moments — the rare heat in an otherwise cool palette |

## Tokens — Typography

### Swizzy — The hero wordmark and large display moments. The signature choice: a 125px display at weight 500 (not 700-900), with aggressively tight -0.02em tracking and sub-1.0 line-height. The wordmark feels carved rather than printed — a confident mid-weight at enormous scale instead of a heavy slab. The slight 0.86 line-height at 125px is the signature optical correction that makes 'Flim' sit perfectly on its baseline. · `--font-swizzy`
- **Substitute:** Druk Wide, Migra, or Schibsted Grotesk at weight 500
- **Weights:** 500
- **Sizes:** 21px, 27px, 47px, 125px
- **Line height:** 0.86, 1.00, 1.10
- **Letter spacing:** -0.02em
- **Role:** The hero wordmark and large display moments. The signature choice: a 125px display at weight 500 (not 700-900), with aggressively tight -0.02em tracking and sub-1.0 line-height. The wordmark feels carved rather than printed — a confident mid-weight at enormous scale instead of a heavy slab. The slight 0.86 line-height at 125px is the signature optical correction that makes 'Flim' sit perfectly on its baseline.

### PP Neue Montreal Mono — The UI micro-voice: navigation labels, 'HOME', 'PRICING', 'LOG-IN', 'SIGN-UP', search bar placeholders, and the 'TRUSTED BY THE BRANDS SHAPING CULTURE' eyebrow. The wide 0.06em tracking transforms ordinary labels into engineered labels — every letter is spaced like a diagram annotation. This is the mono font's only role: small, uppercase, precisely tracked. · `--font-pp-neue-montreal-mono`
- **Substitute:** JetBrains Mono, IBM Plex Mono, or Space Mono at 400 with letter-spacing: 0.06em
- **Weights:** 400
- **Sizes:** 12px, 15px
- **Line height:** 1.00
- **Letter spacing:** 0.06em
- **Role:** The UI micro-voice: navigation labels, 'HOME', 'PRICING', 'LOG-IN', 'SIGN-UP', search bar placeholders, and the 'TRUSTED BY THE BRANDS SHAPING CULTURE' eyebrow. The wide 0.06em tracking transforms ordinary labels into engineered labels — every letter is spaced like a diagram annotation. This is the mono font's only role: small, uppercase, precisely tracked.

### Arial — Body and secondary text. A system font is the deliberate anti-statement — body copy doesn't try to be distinctive, it just reads. 16px for body, 32px for larger sub-claims. Weight 700 for emphasis in body copy. · `--font-arial`
- **Substitute:** Inter, system-ui, or Helvetica
- **Weights:** 400, 700
- **Sizes:** 16px, 32px
- **Line height:** 1.00, 1.13
- **Role:** Body and secondary text. A system font is the deliberate anti-statement — body copy doesn't try to be distinctive, it just reads. 16px for body, 32px for larger sub-claims. Weight 700 for emphasis in body copy.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 12 | 0.72px | `--text-caption` |
| body-sm | 15px | 15 | 0.9px | `--text-body-sm` |
| subheading | 21px | 21 | — | `--text-subheading` |
| heading-sm | 27px | 27 | — | `--text-heading-sm` |
| heading | 32px | 36 | — | `--text-heading` |
| heading-lg | 47px | 47 | — | `--text-heading-lg` |
| display | 125px | 108 | -2.5px | `--text-display` |

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
| 28 | 28px | `--spacing-28` |
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 52 | 52px | `--spacing-52` |
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |
| 100 | 100px | `--spacing-100` |
| 180 | 180px | `--spacing-180` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 16px |
| links | 4px |
| pills | 160px |
| images | 16px |
| buttons | 8px |
| headings | 25px |

### Layout

- **Section gap:** 80px
- **Card padding:** 20px
- **Element gap:** 24px

## Components

### Hero Wordmark
**Role:** The defining element — oversized brand display

125px Swizzy weight 500, #141414, letter-spacing -2.5px (-0.02em), line-height 0.86. Occupies the left half of the hero. The wordmark IS the hero — no background art, no illustration, no decoration around it. The slightly tightened line-height (0.86) is the optical correction that makes the letters sit perfectly.

### Ghost Navigation Link
**Role:** Top bar navigation items

PP Neue Montreal Mono 12px, #141414, letter-spacing 0.72px (0.06em), uppercase. No background, no border — just tracked-out type. Used for HOME, PRICING, LOG-IN, SIGN-UP. Padding: 6px 0 vertically. Weight 400.

### Filled Action Button
**Role:** The only filled button in the system

SIGN-UP button: #141414 background, #ffffff text, 8px border-radius, ~20px horizontal padding, ~8px vertical padding. PP Neue Montreal Mono 12px, weight 400, letter-spacing 0.72px. The button is a solid black rectangle with rounded corners — no gradient, no shadow, no hover state complexity.

### Avatar Badge with Status Dot
**Role:** User identity indicator on the sign-up button

Small circular avatar image (~24-32px) placed adjacent to or on the SIGN-UP button. Accompanied by a #30a81d Signal Green dot (~8px) to the right, indicating live/online status. The green dot is the only place Signal Green appears at significant prominence.

### Pill Search Bar
**Role:** The signature input — floating search that looks like a lozenge

Full-width pill shape with 160px border-radius (effectively fully rounded). Fill: #f5f5f5 (Canvas), no visible border. Placeholder text in PP Neue Montreal Mono 15px, letter-spacing 0.9px (0.06em), #141414, uppercase. A small filled action button ('SEARCH ⌘/') sits at the right end of the pill, #141414 background, #ffffff text, same 8px radius as the main button. Padding: ~16-20px vertical.

### Image Thumbnail Card
**Role:** The core content unit — photo/video stills scattered across the canvas

Rounded image with 16px border-radius. Floating on the #f5f5f5 canvas with a 1-2px #d9d9d9 hairline border. No shadow, no padding, no overlay text. The border is barely visible — the card feels pinned to the page rather than contained. Various sizes from ~150px to ~350px wide, placed in an asymmetric scattered grid.

### Grid Background Pattern
**Role:** The structural texture of the entire page

A repeating #d9d9d9 grid line pattern on the #f5f5f5 canvas. Lines are 1px, creating a subtle engineering-paper / sketchpad texture. The grid is visible enough to feel intentional but quiet enough to not compete with content. This pattern defines the entire page surface — it is the brand's surface, not a decorative overlay.

### Hero Tagline Block
**Role:** Right-aligned hero copy

Arial 32px, weight 400 (or 700), #141414, line-height 1.13. Right-aligned in the hero area, sitting opposite the wordmark. Three lines: a bold claim, a supporting line, a qualifier. No special treatment — just confident body text at heading scale.

### Brand Logo Strip
**Role:** Social proof band

A horizontal row of partner/brand logos (Zalando, BETC, etc.) in #141414, displayed in a single line with generous spacing. Above the row: PP Neue Montreal Mono 12px uppercase eyebrow text 'TRUSTED BY THE BRANDS SHAPING CULTURE' in #141414, letter-spacing 0.72px. The logos are monochrome — no color versions, no brand color bleed.

### Eyebrow Label
**Role:** Small uppercase section markers

PP Neue Montreal Mono 12px, weight 400, #141414, letter-spacing 0.72px (0.06em), uppercase. Used for section headers like 'TRUSTED BY THE BRANDS SHAPING CULTURE'. Center-aligned. The wide tracking is the signature — these labels feel like technical annotations on a blueprint.

### Highlighted Heading
**Role:** Text with a marker-pen highlight background

Heading text (#141414) with a #fecc33 background highlight behind specific words, creating a hand-marked effect. The highlight extends slightly beyond the text bounds with ~25px border-radius on the highlight block. The highlight is solid yellow — not a gradient, not translucent.

## Do's and Don'ts

### Do
- Use Swizzy at 125px with -2.5px letter-spacing and 0.86 line-height for the hero wordmark — never substitute a heavier weight to compensate for size.
- Apply 0.06em letter-spacing to all PP Neue Montreal Mono labels — the wide tracking IS the visual identity of navigation, eyebrows, and search placeholders.
- Use 16px border-radius for all image cards and thumbnails. 160px for all pill-shaped search bars and lozenge inputs. 8px for buttons. These three radii define the system.
- Set the page background to #f5f5f5 (Canvas) with a #d9d9d9 1px grid line pattern — the paper texture is the surface, not a background image.
- Use Signal Green (#30a81d) only for the status indicator dot and small accent borders. Never as a button fill, never as a large surface.
- Keep the layout loose and asymmetric. Scatter image cards at varying sizes and positions on the grid — do not force a rigid card grid.
- Default text color to #141414, never pure #000000 for body or headings. The near-black is warmer and sits better on #f5f5f5.

### Don't
- Don't add drop shadows to any component. Elevation comes from border weight and surface color contrast, never from box-shadow.
- Don't use #000000 as a design color. Reserve it for SVG fills and input borders. The system's near-black is #141414.
- Don't use a font other than Swizzy for the hero wordmark, or PP Neue Montreal Mono for labels/nav. Arial is acceptable for body. No other typefaces.
- Don't create filled buttons in color. The only filled button is the #141414 SIGN-UP action. All other CTAs should be ghost or text links.
- Don't use Highlight Yellow (#fecc33) as a surface fill. It is a text-highlight marker, not a background — it should sit behind specific words, not fill containers.
- Don't center-align body text. Headings and body copy are left-aligned (or right-aligned in the hero block). Only eyebrows and section labels are center-aligned.
- Don't force image cards into a uniform grid. The scattered polaroid layout is the visual signature — equal-width equal-spaced grids break the metaphor.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#f5f5f5` | Page background — the warm light gray paper that everything sits on |
| 1 | Surface | `#ffffff` | Card surfaces, search bar fills, elevated white blocks above the canvas |
| 2 | Raised | `#e9e9e9` | Secondary surface fills, muted blocks, alternating bands |
| 3 | Accent | `#fecc33` | Highlight wash behind words — the marker-pen underline |
| 4 | Ink | `#141414` | Darkest surface — filled button, image card borders, the near-black that grounds the system |

## Elevation

This system deliberately avoids drop shadows. Elevation is created by border weight (1-2px hairlines in #d9d9d9 or #e9e9e9), by the subtle canvas-to-surface contrast (#f5f5f5 vs #ffffff), and by the 16px border-radius that makes cards feel placed rather than floating. Shadows would break the analog paper metaphor — these surfaces are printed on, not hovering in 3D space.

## Imagery

Photography is the primary content medium. Images are real photographs of cinematic subjects — knights on horseback, dramatic lighting, film-still quality — cropped tightly and displayed as rounded thumbnails. Images are never full-bleed, never overlapping, never masked into custom shapes. Each image sits in its own rounded card with a faint #d9d9d9 hairline border, placed at varying sizes (150-350px wide) in an asymmetric scattered arrangement on the grid canvas. The treatment is 'polaroid pinned to a sketchpad' — each photo is an object, not a backdrop. No illustrations, no 3D renders, no abstract graphics. Icons (when present) are simple and thin-stroke in #141414. The visual density is image-heavy: photo thumbnails occupy more visual space than text across the page.

## Layout

The page is full-bleed with no max-width container — content stretches edge to edge within the grid pattern. The hero is a split layout: oversized wordmark on the left (Swizzy 125px), right-aligned tagline block on the right, both on the #f5f5f5 canvas with the grid pattern visible. Below the hero, the layout shifts to a loose scattered image grid — image thumbnails float at different positions and sizes on the grid, with a centered pill search bar cutting through the middle. Further down, a brand logo strip runs full-width with generous vertical padding. The section rhythm is defined by vertical breathing room (80px+ gaps between major sections) and the consistent grid background, not by alternating light/dark bands. Navigation is a minimal top bar with ghost links left-aligned and the SIGN-UP action right-aligned, with no sticky behavior implied. The overall feel is a single continuous page that flows like a lightbox — each image card is a work-in-progress pinned to a shared surface.

## Agent Prompt Guide

## Quick Color Reference
- Primary text: #141414
- Page background: #f5f5f5
- Card/surface: #ffffff
- Secondary surface: #e9e9e9
- Hairline borders: #d9d9d9
- Status/accent green: #30a81d
- primary action: no distinct CTA color

## Example Component Prompts

1. **Hero Wordmark**: Render 'Flim' in Swizzy (or Druk Wide substitute) at 125px, weight 500, color #141414, letter-spacing -2.5px, line-height 0.86. No background, no decoration. Place on #f5f5f5 canvas with #d9d9d9 1px grid line pattern.

2. **Pill Search Bar**: A full-width pill input with 160px border-radius, fill #f5f5f5, no visible border. Placeholder text 'SEARCH ANYTHING' in PP Neue Montreal Mono 15px, letter-spacing 0.9px, uppercase, #141414. Append a small filled button at the right end: #141414 background, #ffffff text 'SEARCH ⌘/', PP Neue Montreal Mono 12px, 8px border-radius, 8px 20px padding.

3. **Image Thumbnail Card**: A photograph inside a rounded container with 16px border-radius, 1px solid #d9d9d9 border, no shadow, no padding around the image. Float on the #f5f5f5 grid canvas at varying widths (150-350px) in an asymmetric scattered arrangement.

4. **Ghost Navigation Link**: PP Neue Montreal Mono 12px, weight 400, #141414, letter-spacing 0.72px, uppercase. No background, no border, no underline. Padding 6px 0. Used for nav items like HOME, PRICING, LOG-IN.

5. **Eyebrow Label**: PP Neue Montreal Mono 12px, weight 400, #141414, letter-spacing 0.72px, uppercase, center-aligned. Example: 'TRUSTED BY THE BRANDS SHAPING CULTURE'. The wide tracking is essential — do not tighten.

## Grid System

The page surface is defined by a #d9d9d9 1px grid line pattern on the #f5f5f5 canvas. This grid is not a layout grid for content alignment — it is a visual texture, like graph paper or engineering paper. Content (image cards, search bars, text blocks) sits on top of this grid and does not snap to it strictly. The grid creates the 'creative workspace' metaphor: the entire page IS the sketchpad, and content elements are objects placed on it. The grid should be subtle enough to not compete with content but visible enough to feel intentional. Use a repeating linear gradient or SVG pattern with 1px lines at ~32-40px intervals.

## Radii System

Three radii define the entire system: 8px for buttons (slight rounding, almost square), 16px for image cards and thumbnails (clearly rounded, friendly), and 160px for pill-shaped inputs and lozenges (fully rounded). A secondary 4px radius applies to small links and inline elements. The jump from 16px to 160px is intentional — there is no 24px, 32px, or 48px middle ground. This creates a clear visual language: containers are either 'rounded cards' or 'pills', with no ambiguous in-between.

## Similar Brands

- **Figma** — Same light canvas with content-as-objects approach, scattered image-grid hero layouts, and minimal top-bar navigation with a single filled CTA
- **Linear** — Same near-black #141414-on-light-gray typographic confidence, with a single hero wordmark and generous whitespace
- **Runway** — Same creative-tool metaphor of scattered image thumbnails on a neutral surface, with film-still photography as the primary content
- **Are.na** — Same polaroid-pinned-to-board visual language — asymmetric scattered images on a textured light background, no rigid grid
- **Pitch** — Same minimal navigation, single oversized wordmark hero, and monochrome canvas with tiny color accents

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-ink: #141414;
  --color-paper: #ffffff;
  --color-canvas: #f5f5f5;
  --color-mist: #e9e9e9;
  --color-hairline: #d9d9d9;
  --color-signal-green: #30a81d;
  --color-forest: #21935b;
  --color-highlight-yellow: #fecc33;
  --color-ember: #ff8400;

  /* Typography — Font Families */
  --font-swizzy: 'Swizzy', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-pp-neue-montreal-mono: 'PP Neue Montreal Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 12;
  --tracking-caption: 0.72px;
  --text-body-sm: 15px;
  --leading-body-sm: 15;
  --tracking-body-sm: 0.9px;
  --text-subheading: 21px;
  --leading-subheading: 21;
  --text-heading-sm: 27px;
  --leading-heading-sm: 27;
  --text-heading: 32px;
  --leading-heading: 36;
  --text-heading-lg: 47px;
  --leading-heading-lg: 47;
  --text-display: 125px;
  --leading-display: 108;
  --tracking-display: -2.5px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-52: 52px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-100: 100px;
  --spacing-180: 180px;

  /* Layout */
  --section-gap: 80px;
  --card-padding: 20px;
  --element-gap: 24px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-2xl: 16px;
  --radius-3xl: 25.0353px;
  --radius-full: 64px;
  --radius-full-2: 160px;

  /* Named Radii */
  --radius-cards: 16px;
  --radius-links: 4px;
  --radius-pills: 160px;
  --radius-images: 16px;
  --radius-buttons: 8px;
  --radius-headings: 25px;

  /* Surfaces */
  --surface-canvas: #f5f5f5;
  --surface-surface: #ffffff;
  --surface-raised: #e9e9e9;
  --surface-accent: #fecc33;
  --surface-ink: #141414;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-ink: #141414;
  --color-paper: #ffffff;
  --color-canvas: #f5f5f5;
  --color-mist: #e9e9e9;
  --color-hairline: #d9d9d9;
  --color-signal-green: #30a81d;
  --color-forest: #21935b;
  --color-highlight-yellow: #fecc33;
  --color-ember: #ff8400;

  /* Typography */
  --font-swizzy: 'Swizzy', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-pp-neue-montreal-mono: 'PP Neue Montreal Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 12;
  --tracking-caption: 0.72px;
  --text-body-sm: 15px;
  --leading-body-sm: 15;
  --tracking-body-sm: 0.9px;
  --text-subheading: 21px;
  --leading-subheading: 21;
  --text-heading-sm: 27px;
  --leading-heading-sm: 27;
  --text-heading: 32px;
  --leading-heading: 36;
  --text-heading-lg: 47px;
  --leading-heading-lg: 47;
  --text-display: 125px;
  --leading-display: 108;
  --tracking-display: -2.5px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-52: 52px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-100: 100px;
  --spacing-180: 180px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-2xl: 16px;
  --radius-3xl: 25.0353px;
  --radius-full: 64px;
  --radius-full-2: 160px;
}
```
