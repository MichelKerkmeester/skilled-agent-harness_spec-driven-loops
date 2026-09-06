# Bang & Olufsen — Style Reference
> Scandinavian gallery on porcelain. When a B&O page goes dark, the product is lit like a sculpture in a midnight alcove; when it goes light, the product floats on white silk with nothing else competing for attention.

**Theme:** light

Bang & Olufsen runs on a gallery-museum logic: near-pure white porcelain canvases with products floating as sculptural objects, interrupted by rare full-bleed chromatic chambers — a deep ultramarine violet that swallows the screen, occasionally a saturated terracotta-red moment — for emotional punctuation. Typography is a single custom neo-grotesque (BeoSupreme) that does all the talking: whisper-tight at display sizes, generously tracked uppercase at micro-labels, no other typeface needed. Components are stripped to their bones: pill-shaped ghost controls, hairline borders, no decorative shadows, no gradient buttons, no icon flourishes. The grid is generous, the negative space is the luxury. Every product gets its own floating pedestal; the surrounding white is the room. Color is rationed like a precious material — when it appears, it owns the entire frame.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Porcelain Canvas | `#ffffff` | `--color-porcelain-canvas` | Page backgrounds, product card surfaces, navigation bar — the dominant ground against which every product floats |
| Bone | `#fcfaee` | `--color-bone` | Secondary surface for warm-neutral blocks, button text on dark backgrounds, alternative canvas when white would feel sterile |
| Obsidian | `#191817` | `--color-obsidian` | Primary text and product bodies — a warm near-black that reads softer than pure #000000 against white |
| Pure Ink | `#000000` | `--color-pure-ink` | Icon strokes, micro-labels, fine borders, and the harshest text contrast moments |
| Graphite | `#555555` | `--color-graphite` | Secondary body copy, metadata, price labels, muted helper text |
| Mist | `#e5e5e5` | `--color-mist` | Hairline input borders and the only structural divider in the system |
| Ultramarine Velvet | `#060daa` | `--color-ultramarine-velvet` | Hero backgrounds, dramatic full-bleed section chambers, footer washes — saturated, almost black-blue violet used to swallow entire frames and make a single product feel theatrical |

## Tokens — Typography

### BeoSupreme — The single typeface carrying the entire brand voice. Display and headings: weight 500–700 at 24–36px with tight tracking (-0.056em → -0.014em) for confident, compressed headlines. Body and UI: weight 400 at 14–16px, normal tracking, line-height 1.5–1.7. Micro-labels (nav, badges, 'Est. 1925' tagline): weight 500 at 9–12px with wide tracking up to +0.143em, rendered uppercase to function as quiet architectural annotations. No second typeface competes. · `--font-beosupreme`
- **Substitute:** Neue Haas Grotesk Display Pro (closest), with Inter or Söhne as free alternatives
- **Weights:** 400, 500, 700
- **Sizes:** 9, 12, 14, 16, 24, 36
- **Line height:** 1.15–2.19
- **Letter spacing:** -2.0px at 36px display → -0.2px at 14px body → +1.3px at 9px micro-label (upright tracking inverts: tighter as size grows)
- **OpenType features:** `"kern" 1, "liga" 1`
- **Role:** The single typeface carrying the entire brand voice. Display and headings: weight 500–700 at 24–36px with tight tracking (-0.056em → -0.014em) for confident, compressed headlines. Body and UI: weight 400 at 14–16px, normal tracking, line-height 1.5–1.7. Micro-labels (nav, badges, 'Est. 1925' tagline): weight 500 at 9–12px with wide tracking up to +0.143em, rendered uppercase to function as quiet architectural annotations. No second typeface competes.

### object-fit: cover; object-position: center; — object-fit: cover; object-position: center; — detected in extracted data but not described by AI · `--font-object-fit-cover-object-position-center`
- **Weights:** 400
- **Sizes:** 16px
- **Line height:** 1.15
- **Role:** object-fit: cover; object-position: center; — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.67 | 0.288px | `--text-caption` |
| body-sm | 14px | 1.43 | -0.196px | `--text-body-sm` |
| body | 16px | 1.5 | -0.224px | `--text-body` |
| subheading | 24px | 1.25 | -0.336px | `--text-subheading` |
| heading | 36px | 1.15 | -2.016px | `--text-heading` |

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
| 36 | 36px | `--spacing-36` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 56 | 56px | `--spacing-56` |
| 60 | 60px | `--spacing-60` |
| 80 | 80px | `--spacing-80` |
| 236 | 236px | `--spacing-236` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 0px |
| badges | 2px |
| inputs | 0px |
| buttons | 40px |

### Layout

- **Page max-width:** 1440px
- **Section gap:** 60-80px
- **Card padding:** 0px
- **Element gap:** 8-16px

## Components

### Ghost Pill Button
**Role:** Primary interactive control in light sections

40px border-radius, 1px hairline border in #000000, transparent fill, 14px BeoSupreme weight 500, #000000 text, 12px 28px padding. Hover: fill inverts to #000000 with #ffffff text. No drop shadow, no fill in default state — the outline IS the affordance.

### Inverted Pill Button (Dark Chamber)
**Role:** Primary interactive control over ultramarine or obsidian backgrounds

40px border-radius, 1px border in #ffffff, transparent fill, 14px BeoSupreme weight 500, #ffffff text. The ghost treatment persists even on dark surfaces — buttons never become filled blocks, preserving the gallery wall aesthetic.

### Product Card (White Surface)
**Role:** Product grid item in listing and category pages

Zero padding, zero border, zero shadow. Pure #ffffff ground. Product image floats centered with 25px left/right gutter at top, then 16px vertical gap to product name (16px weight 500, #191817), then 8px gap to price (14px weight 400, #555555). The card is invisible — only the product and its label exist.

### Product Showcase Card (Dramatic Chamber)
**Role:** Hero product spotlight on ultramarine background

#060daa full-bleed surface, product image centered and oversized, product name and micro-description in #ffffff at lower-left, 16px weight 400 body and 24px weight 500 headline, generous 80px+ padding on all sides. No card chrome — the colored plane IS the card.

### Top Navigation Bar
**Role:** Global header

Fixed/sticky top bar, #ffffff background, 1px bottom hairline in #e5e5e5 (optional, often invisible). Three-zone layout: left cluster (hamburger 'Menú' + search 'Buscar' icons with 9–12px micro-labels), center wordmark ('BANG & OLUFSEN' in 16px weight 500 with 'Est. 1925' subtitle in 9px tracked), right cluster (account, location pin, cart icons). 64px tall, 25px horizontal padding.

### Search Input
**Role:** Inline search field

1px bottom border in #e5e5e5 (or #000000 on emphasis), no side borders, 14px BeoSupreme weight 400, #000000 text, #555555 placeholder, 12px vertical padding. Underline-only, no boxed input.

### Micro-Label Annotation
**Role:** Tags, category labels, 'New' badges, metadata

2px border-radius, uppercase, 9–12px BeoSupreme weight 500, letter-spacing +0.025em to +0.143em, #000000 or #ffffff text. Background is transparent or a flat #191817 block. Functions as architectural captioning, not decoration.

### Footer Wash
**Role:** Global footer

#060daa background (matches hero chamber), #ffffff text, multi-column link grid with 9–14px BeoSupreme. Same ultramarine plane repeats from hero to footer, creating bookend rhythm across the page.

### Price Tag
**Role:** Product price display

14px BeoSupreme weight 400, #555555. Currency symbol separated by 4px, no decorative formatting, no strikethrough, no sale badge treatment. A price is a fact, not a marketing event.

### Color Variant Swatch
**Role:** Product color option selector

Small circular swatch (no visible border in extraction, but typical pattern: 16-20px circle filled with product color, optional 1px #000000 ring on selected). No text label — the color speaks.

### Section Heading
**Role:** In-page editorial section title (e.g. 'Explore nuestros superventas')

36px BeoSupreme weight 500, #191817, letter-spacing -0.056em, centered or left-aligned with 60-80px top margin. Tight tracking on a large size produces compressed, confident display text — the whisper of luxury, not a shout.

### Product Grid Row
**Role:** Horizontal product carousel or grid row

4-5 column grid on desktop, even 25px gutters, no dividers between cards, no card background. Each cell is 25% of max-width container. Images sized to ~200px square, centered in cell with text below.

## Do's and Don'ts

### Do
- Use BeoSupreme at all sizes; never introduce a second typeface
- Use 40px border-radius for all buttons and interactive pills
- Use #060daa only as a full-bleed background plane — never as a text color, icon, or small accent
- Use 0px border-radius for all cards, inputs, and containers; cards should be invisible
- Apply tight letter-spacing (-0.056em) at 36px display and loosen tracking (+0.143em) at 9px micro-labels — the inverting tracking is signature
- Place product photography on pure #ffffff or #060daa grounds; never composite on busy backgrounds
- Maintain 60-80px vertical rhythm between sections; let products breathe

### Don't
- Don't use drop shadows on cards, buttons, or popovers — the system is shadow-free
- Don't use #060daa as a CTA fill or link color — it is a plane, not a button
- Don't use any chromatic color for text other than as a full background
- Don't introduce gradients on UI elements — only on hero photography if at all
- Don't fill buttons with solid color in default state — outline/ghost is the only treatment
- Don't use 2px or small radii on buttons; pills (40px) are the only button shape
- Don't crowd product cells with badges, ratings, or sale tags — the price and name are enough

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Porcelain | `#ffffff` | Default page and product listing canvas |
| 2 | Bone | `#fcfaee` | Warm secondary surface for editorial sections |
| 3 | Ultramarine Chamber | `#060daa` | Full-bleed dramatic hero and showcase moments |
| 4 | Obsidian | `#191817` | Dark contrast surface, product photography grounds |

## Elevation

Bang & Olufsen deliberately uses no drop shadows. Depth is created through color contrast (white card on white page → no card, colored plane → product floats), scale (oversized product images dominate text), and generous negative space. Elevation is communicated by the absence of a border, not by a shadow.

## Imagery

Product photography is the sole visual asset — no lifestyle, no models, no environmental context. Products are shot on pure neutral grounds (white, black, gradient navy) with controlled studio lighting that emphasizes material: brushed aluminum, leather grain, anodized copper, silicone matte. Treatment is tight-crop, centered, hero-isolated. Color treatment is desaturated and true-to-material — the copper reads as copper, not as 'golden hour'. A secondary visual motif: rare full-bleed product silhouettes against saturated single-color planes (ultramarine, terracotta-red) for editorial moments. Iconography: hairline 1px stroke, monochrome black on white or white on dark, geometric, no fills, no multicolor.

## Layout

Max-width 1440px centered container with 25px horizontal padding at the edges. Hero is full-bleed (breaks the container) with the ultramarine chamber extending edge to edge. Product grids are 4-5 column even layouts with 25px gutters, scrollable horizontally on mobile. Sections alternate between white ground and full-bleed colored chambers — the rhythm is: white product grid → ultramarine hero → white product grid → saturated red editorial banner → white product grid → ultramarine footer. Navigation is a minimal top bar that floats over both white and colored sections (text inverts to white on dark). The page breathes — section gaps are 60-80px, individual products get their own breathing room within cells, no information density.

## Agent Prompt Guide

**Quick Color Reference**
- text primary: #191817 (Obsidian)
- text secondary: #555555 (Graphite)
- text on dark: #ffffff (Porcelain)
- background canvas: #ffffff (Porcelain)
- background warm alternative: #fcfaee (Bone)
- background dramatic chamber: #060daa (Ultramarine Velvet)
- border hairline: #e5e5e5 (Mist)
- primary action: no distinct CTA color

**Example Component Prompts**

1. *Ghost Pill Button*: 40px border-radius, 1px solid #000000 border, transparent fill, 14px BeoSupreme weight 500 text in #000000, 12px 28px padding, no shadow. Hover: fill becomes #000000, text becomes #ffffff.

2. *Product Card on White*: #ffffff background, zero padding, zero border, zero shadow. Center product image (200px square) with 25px horizontal gutter. Below: 16px gap, product name in 16px BeoSupreme weight 500 #191817. 8px gap, price in 14px BeoSupreme weight 400 #555555.

3. *Ultramarine Hero Chamber*: Full-bleed #060daa background, 80px padding all sides, oversized product image centered (60% viewport height), product name in 36px BeoSupreme weight 500 #ffffff at lower-left with letter-spacing -0.056em, micro-description in 16px BeoSupreme weight 400 #ffffff below.

4. *Top Navigation*: 64px tall, #ffffff background, 25px horizontal padding. Left: hamburger + 'Menú' in 12px BeoSupreme weight 500 #000000 tracked +0.025em, then 16px gap, search icon + 'Buscar' in same style. Center: 'BANG & OLUFSEN' in 16px BeoSupreme weight 500 #000000 with 'Est. 1925' subtitle in 9px tracked +0.143em below. Right: account/location/cart icons, 16px gap each, in #000000.

5. *Section Heading*: 36px BeoSupreme weight 500 #191817, letter-spacing -0.056em, line-height 1.15, 60-80px top margin, centered or left-aligned on #ffffff canvas. Tight tracking creates compressed, confident display — authority through restraint, not volume.

## Tracking Inversion Principle

The signature type behavior is tracking that inverts with size: -0.056em at 36px display, -0.014em at 24px, normal at 16px, +0.025em at 12px, +0.143em at 9px. Large text tightens; small text opens. This produces headlines that feel compressed and confident while micro-labels feel airy and architectural. Any new size added to the system must follow this curve — never apply display tracking to body, never apply micro-label tracking to headlines.

## Color Rationing

Color is treated as a precious material. The page is ~99% achromatic at any given moment. When #060daa appears, it occupies an entire frame. When terracotta-red appears in editorial banners, it likewise owns the full bleed. Never use chromatic color for small UI elements, icons, or text accents — that would be spending pennies in a system that deals in full canvas blocks. If a small functional color is needed, use Obsidian #191817 or Pure Ink #000000.

## Similar Brands

- **Apple** — Same zero-chrome product cards on white, oversized centered product photography as hero, no shadows, whisper-tight display type, single-typeface system
- **Bose** — Similar premium audio ecommerce with full-bleed dark hero chambers breaking up white product grids, but B&O is more austere and gallery-like
- **Loewe (loewe.tv)** — Comparable European luxury electronics with editorial product-as-sculpture photography on saturated color planes and minimal type
- **Teenage Engineering** — Same Scandinavian design restraint, product floating on pure grounds, single neo-grotesque typeface carrying the entire system
- **Vitra** — Identical gallery-museum treatment of objects, generous negative space, invisible card chrome, no decorative shadows

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-porcelain-canvas: #ffffff;
  --color-bone: #fcfaee;
  --color-obsidian: #191817;
  --color-pure-ink: #000000;
  --color-graphite: #555555;
  --color-mist: #e5e5e5;
  --color-ultramarine-velvet: #060daa;

  /* Typography — Font Families */
  --font-beosupreme: 'BeoSupreme', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-object-fit-cover-object-position-center: 'object-fit: cover; object-position: center;', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.67;
  --tracking-caption: 0.288px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.43;
  --tracking-body-sm: -0.196px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.224px;
  --text-subheading: 24px;
  --leading-subheading: 1.25;
  --tracking-subheading: -0.336px;
  --text-heading: 36px;
  --leading-heading: 1.15;
  --tracking-heading: -2.016px;

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
  --spacing-32: 32px;
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-60: 60px;
  --spacing-80: 80px;
  --spacing-236: 236px;

  /* Layout */
  --page-max-width: 1440px;
  --section-gap: 60-80px;
  --card-padding: 0px;
  --element-gap: 8-16px;

  /* Border Radius */
  --radius-sm: 2px;
  --radius-3xl: 40px;

  /* Named Radii */
  --radius-cards: 0px;
  --radius-badges: 2px;
  --radius-inputs: 0px;
  --radius-buttons: 40px;

  /* Surfaces */
  --surface-porcelain: #ffffff;
  --surface-bone: #fcfaee;
  --surface-ultramarine-chamber: #060daa;
  --surface-obsidian: #191817;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-porcelain-canvas: #ffffff;
  --color-bone: #fcfaee;
  --color-obsidian: #191817;
  --color-pure-ink: #000000;
  --color-graphite: #555555;
  --color-mist: #e5e5e5;
  --color-ultramarine-velvet: #060daa;

  /* Typography */
  --font-beosupreme: 'BeoSupreme', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-object-fit-cover-object-position-center: 'object-fit: cover; object-position: center;', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.67;
  --tracking-caption: 0.288px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.43;
  --tracking-body-sm: -0.196px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.224px;
  --text-subheading: 24px;
  --leading-subheading: 1.25;
  --tracking-subheading: -0.336px;
  --text-heading: 36px;
  --leading-heading: 1.15;
  --tracking-heading: -2.016px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-60: 60px;
  --spacing-80: 80px;
  --spacing-236: 236px;

  /* Border Radius */
  --radius-sm: 2px;
  --radius-3xl: 40px;
}
```
