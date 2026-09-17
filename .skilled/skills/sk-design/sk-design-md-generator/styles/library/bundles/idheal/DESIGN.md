# IDHEAL — Style Reference
> Architectural editorial masthead on white marble. Display type that could be 2 meters tall in print, single photography frames, and chromatic accents drawn with a fine-point pen.

**Theme:** light

IDHEAL is an editorial architecture portfolio language: a stark white canvas where massive black sans-serif display type dominates the top of the page like a masthead, paired with full-bleed architectural photography. The visual system is deliberately sparse — surfaces are flat, dividers are hairline, and shadow is used minimally and only as a soft gray halo. Chromatic color appears almost exclusively as thin outline strokes (terracotta, magenta, olive), never as filled buttons or large blocks, creating the effect of colored pencil marks on a white page. The pairing of Helvetica Neue for display and New Century Schoolbook for body gives the site a magazine-spread tension — industrial sans for headlines, literary serif for reading — anchored by compact spacing that keeps everything gallery-tight.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Pure White | `#ffffff` | `--color-pure-white` | Page canvas, card surfaces, button fills on dark — the entire layout sits on flat white without competing surface tones |
| Carbon Black | `#000000` | `--color-carbon-black` | Primary text, display headlines, nav borders, icon strokes — near-universal ink color, the dominant chromatic presence |
| Hairline Gray | `#e5e5e5` | `--color-hairline-gray` | Borders, dividers, subtle button outlines, muted surface backgrounds — the structural neutral that defines card edges without adding weight |
| Shadow Gray | `#cccccc` | `--color-shadow-gray` | Soft drop-shadow tint and secondary borders — only used in shadow stacks, never as a fill |
| Terracotta | `#bc5346` | `--color-terracotta` | Decorative outline accent on headings, body links, and section borders — the warm architectural counterweight to the cool palette |
| Magenta Pencil | `#ff00bc` | `--color-magenta-pencil` | High-frequency outline accent on borders and links — vivid magenta used as fine 1–2px strokes, never as a fill or background |
| Olive Foliage | `#51633c` | `--color-olive-foliage` | Muted green text and border accent — evokes plant material and landscape, used sparingly on body copy and decorative dividers |

## Tokens — Typography

### sans-serif — sans-serif — detected in extracted data but not described by AI · `--font-sans-serif`
- **Weights:** 400
- **Sizes:** 15px, 67px
- **Line height:** 1, 1.2
- **Role:** sans-serif — detected in extracted data but not described by AI

### Helvetica Neue LT Pro (Md) — Display and large headings — the 105px size defines the masthead scale, while 18–21px handles subheadings. The medium weight at extreme sizes is signature: heavy enough to anchor the page, never so heavy it becomes a poster. · `--font-helvetica-neue-lt-pro-md`
- **Substitute:** Helvetica, Arial, Inter (weight 500)
- **Weights:** 400
- **Sizes:** 12px, 18px, 21px, 105px
- **Line height:** 0.80–1.20
- **Role:** Display and large headings — the 105px size defines the masthead scale, while 18–21px handles subheadings. The medium weight at extreme sizes is signature: heavy enough to anchor the page, never so heavy it becomes a poster.

### Helvetica Neue LT Pro (Roman) — Body text, nav, buttons, lists — the everyday workhorse at 16–20px, with 39px available for feature headings · `--font-helvetica-neue-lt-pro-roman`
- **Substitute:** Helvetica, Arial, Inter
- **Weights:** 400
- **Sizes:** 12px
- **Line height:** 1.00–1.20
- **Role:** Body text, nav, buttons, lists — the everyday workhorse at 16–20px, with 39px available for feature headings

### Helvetica Neue LT Pro (Lt) — Fine-print body variant — used only at 12px for secondary micro-copy and captions · `--font-helvetica-neue-lt-pro-lt`
- **Substitute:** Helvetica Light, Inter Light
- **Weights:** 300
- **Sizes:** 16px
- **Line height:** 1.20
- **Role:** Fine-print body variant — used only at 12px for secondary micro-copy and captions

### Helvetica Neue LT Pro (Bd) — Bold body emphasis at 16px — sparingly used for in-paragraph highlights and label-like text · `--font-helvetica-neue-lt-pro-bd`
- **Substitute:** Helvetica Bold, Inter Bold
- **Weights:** 700
- **Sizes:** 12px, 16px, 20px, 39px
- **Line height:** 1.10
- **Role:** Bold body emphasis at 16px — sparingly used for in-paragraph highlights and label-like text

### New Century Schoolbook LT Std (Roman) — The editorial serif: body paragraphs, editorial headings, and section titles. Its slab-serif warmth counterbalances the industrial Helvetica display, giving long-form reading a literary feel. Used at 16–18px for body and 39–43px for editorial headings. · `--font-new-century-schoolbook-lt-std-roman`
- **Substitute:** Charter, Source Serif Pro, Crimson Text
- **Weights:** 400
- **Sizes:** 
- **Line height:** 0.95–1.10
- **Role:** The editorial serif: body paragraphs, editorial headings, and section titles. Its slab-serif warmth counterbalances the industrial Helvetica display, giving long-form reading a literary feel. Used at 16–18px for body and 39–43px for editorial headings.

### NewCenturySchlbkLTStd-Roman — NewCenturySchlbkLTStd-Roman — detected in extracted data but not described by AI · `--font-newcenturyschlbkltstd-roman`
- **Weights:** 400
- **Sizes:** 16px, 18px, 21px, 23px, 39px, 43px
- **Line height:** 0.95, 1, 1.08, 1.1
- **Role:** NewCenturySchlbkLTStd-Roman — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.2 | — | `--text-caption` |
| body | 16px | 1.1 | — | `--text-body` |
| subheading | 20px | 1.2 | — | `--text-subheading` |
| heading-sm | 23px | 1.1 | — | `--text-heading-sm` |
| heading | 39px | 1.08 | — | `--text-heading` |
| heading-lg | 67px | 1 | — | `--text-heading-lg` |
| display | 105px | 0.8 | — | `--text-display` |

## Tokens — Spacing & Shapes

**Density:** compact

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 5 | 5px | `--spacing-5` |
| 6 | 6px | `--spacing-6` |
| 7 | 7px | `--spacing-7` |
| 8 | 8px | `--spacing-8` |
| 10 | 10px | `--spacing-10` |
| 11 | 11px | `--spacing-11` |
| 12 | 12px | `--spacing-12` |
| 15 | 15px | `--spacing-15` |
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 23 | 23px | `--spacing-23` |
| 30 | 30px | `--spacing-30` |
| 45 | 45px | `--spacing-45` |
| 60 | 60px | `--spacing-60` |
| 65 | 65px | `--spacing-65` |
| 100 | 100px | `--spacing-100` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 37.5px |
| cards | 0px |
| links | 10px |
| buttons | 15px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| sm | `rgba(0, 0, 0, 0.2) 4px 2px 4px 0px` | `--shadow-sm` |
| sm-2 | `rgb(237, 237, 237) 2px -1px 6px 0px` | `--shadow-sm-2` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 30px
- **Card padding:** 10-12px
- **Element gap:** 10px

## Components

### Masthead Display
**Role:** Brand-scale display headline

Helvetica Neue Medium at 67–105px, line-height 0.80–1.00, color #000000. May span the full viewport width with letter-spacing at normal. This is the page's signature — it occupies the top of the screen like a newspaper masthead before giving way to photography.

### Editorial Heading
**Role:** Section-level serif heading

New Century Schoolbook at 39–43px, line-height 1.08–1.10, color #000000. Optional terracotta (#bc5346) or magenta (#ff00bc) 1–2px bottom border for accent. Sets the literary tone for content sections.

### Outlined Chromatic Link
**Role:** Primary navigation link with colored outline

Helvetica Neue Roman at 12–18px, 1–2px solid border in #bc5346, #ff00bc, #51633c, or #000000, padding 6–10px horizontal, radius 10px. Text inherits border color. No fill — the outline IS the design.

### Ghost Button
**Role:** Secondary action or nav control

White background (#ffffff), 1px border in #000000, radius 15px, padding 6–12px vertical and horizontal, Helvetica Neue 12–16px #000000. The 15px radius is notably softer than the sharp 0px card corners — this is the only rounded button variant.

### Pill Navigation
**Role:** Top-bar or floating nav control

White or hairline background, 1px solid #000000 border, radius 37.5px (pill), padding 10–20px horizontal. Sits at top of layout with the soft 4px 2px 4px shadow. The 37.5px radius creates the system's most generous curve.

### Architecture Photo Frame
**Role:** Full-bleed image container

Edge-to-edge or near-edge image with no border, no radius, and no caption box. Photos are presented raw — the architecture is the content. May be paired with a thin chromatic underline border (#ff00bc or #bc5346) at 1–2px.

### Flat Content Card
**Role:** Text block within a project or section

Zero radius, no background, no border by default. When a border is needed, use 1px #e5e5e5. Padding 10–15px. The flatness is intentional — cards do not compete with the photography.

### Magenta Section Divider
**Role:** Horizontal rule between content sections

1–2px solid line in #ff00bc, full-width or content-width. Replaces traditional gray dividers and injects the system's signature chromatic punctuation into otherwise monochrome layouts.

### Olive Body Link
**Role:** Inline text link within editorial copy

New Century Schoolbook 16–18px, color #51633c, optional 1px underline in same color. Used sparingly in body paragraphs to reference projects or external material without breaking reading rhythm.

### Tight Body Paragraph
**Role:** Editorial long-form text

New Century Schoolbook 16–18px, line-height 1.10, color #000000. No paragraph spacing larger than 15px. Reading width constrained to ~600–700px within a max-width container.

### Nav Item
**Role:** Top-level navigation entry

Helvetica Neue 12–16px, color #000000, 20px horizontal padding, optional 1px #000000 bottom border on active state. Sits inside the pill-shaped nav bar with 37.5px radius.

## Do's and Don'ts

### Do
- Use #ffffff as the sole page and card background — never introduce competing surface tones
- Set display headlines at 67–105px in Helvetica Neue Medium with line-height 0.80–1.00 to create masthead-scale impact
- Apply chromatic colors (#bc5346, #ff00bc, #51633c) exclusively as 1–2px borders and outlines, never as fills or backgrounds
- Pair New Century Schoolbook (body) with Helvetica Neue (display) to maintain the editorial magazine tension
- Use 10px radius for links and 15px for buttons, 37.5px for the nav pill — these three radii define the system's curvature scale
- Keep section gaps around 30px and element gaps around 10px to preserve gallery-tight density
- Anchor the page with the 4px 2px 4px rgba(0,0,0,0.2) shadow on nav and primary controls

### Don't
- Never fill buttons or large surfaces with #ff00bc, #bc5346, or #51633c — these colors live only as outline strokes
- Do not use heavy or multi-layer shadows — the system is built on flatness with minimal lift
- Avoid mixing more than two type families on a single screen — the New Century + Helvetica pair only works when each has a clear role
- Do not use Helvetica Neue at 12px as body text — reserve 12px for captions and micro-copy only
- Never set body text below 16px in New Century Schoolbook — the serif needs size to remain readable
- Do not introduce new border-radius values — stick to 0px (cards), 10px (links), 15px (buttons), 37.5px (nav)
- Avoid centered or symmetrical card grids — the editorial layout relies on asymmetric, magazine-style placement

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Canvas | `#ffffff` | Page background and primary surface — the layout is intentionally flat, with no competing surface tones |
| 2 | Hairline | `#e5e5e5` | Border, divider, and subtle surface variant — defines card edges at 1–2px without adding visual weight |
| 3 | Accent Stroke | `#ff00bc` | Chromatic outline used as a decorative surface edge — never a fill, always a 1–2px border treatment |
| 4 | Warm Accent | `#bc5346` | Terracotta outline on headings and links — secondary chromatic stroke layered on white |

## Elevation

- **Nav, Button, Body containers:** `rgba(0, 0, 0, 0.2) 4px 2px 4px 0px`
- **Cards and overlays:** `rgb(237, 237, 237) 2px -1px 6px 0px`

## Imagery

Full-bleed architectural photography is the dominant visual: exterior and interior shots of buildings, rooftops, terraces, and urban contexts. Images are presented raw with no overlays, no duotone treatment, and no rounded corners — they bleed to the layout edge or sit at exact 0px radius. Color photography with natural daylight, high contrast, and minimal post-processing. No illustrations, no icons (iconography is minimal and uses simple line strokes), no decorative graphics. The photograph IS the visual; the chromatic accents (terracotta, magenta, olive) act like fine pencil marks annotating the white page around the image.

## Layout

The page operates as an editorial spread: a full-bleed masthead with massive display type (IDHEA at 105px+) anchors the top, followed immediately by a large architectural photograph. Content sections use a max-width container around 1200px, centered, with text and images arranged in alternating asymmetric blocks — sometimes full-bleed image with overlaid or adjacent caption, sometimes text-left/image-right, sometimes a single column of editorial body text. Navigation is a minimal pill-shaped bar at the top with 37.5px radius and soft shadow. Section gaps are tight (~30px), creating a gallery-wall rhythm rather than a marketing-page rhythm. The overall density is compact, with information presented in a magazine spread rather than a dashboard grid.

## Agent Prompt Guide

**Quick Color Reference**
- text: #000000
- background: #ffffff
- border: #e5e5e5
- accent (outline strokes only): #ff00bc, #bc5346, #51633c
- primary action: #bc5346 (outlined action border)

**3-5 Example Component Prompts**
1. Create a masthead display: full-width, 0px margin. Text 'IDHEAL' at 105px Helvetica Neue weight 500, #000000, line-height 0.80. Below it, a full-bleed architectural photo with 0px radius and no caption box.

2. Create a nav bar: 37.5px pill radius, white #ffffff background, 1px solid #000000 border, soft shadow rgba(0,0,0,0.2) 4px 2px 4px 0px. Inside, links at 14px Helvetica Neue #000000 with 20px horizontal padding, separated by hairline #e5e5e5 dividers.

3. Create an outlined accent link: inline element, 1px solid #bc5346 border, 6px vertical and 10px horizontal padding, 10px border-radius. Text 14px Helvetica Neue in #bc5346, no fill background.

4. Create an editorial body section: max-width 1200px centered, padding 30px vertical. Heading 'Section Title' in New Century Schoolbook 39px #000000 with a 1px solid #ff00bc bottom border extending the full heading width. Body paragraph below in New Century Schoolbook 16px #000000, line-height 1.10, max-width 600px.

5. Create a ghost button: 15px border-radius, white #ffffff background, 1px solid #000000 border, padding 8px 16px. Text 14px Helvetica Neue #000000. Add shadow rgba(0,0,0,0.2) 4px 2px 4px 0px.

## Similar Brands

- **David Chipperfield Architects** — Same editorial masthead language: oversized sans-serif display type on white, full-bleed architectural photography, and minimal chromatic presence
- **OMA / Rem Koolhaas** — Magazine-spread layout rhythm with serif body text, sans-serif display, and architectural photography that bleeds to the edge with no decorative chrome
- **Studio Mumbai** — Restrained white canvas with one or two chromatic outline accents and large-scale photography as the primary visual content
- **Bureau Betak** — Gallery-tight spacing, display-scale typography, and the practice of using color as thin outline strokes rather than fills
- **Cobe (Danish architecture studio)** — Compact editorial layout, Helvetica Neue display paired with serif body, and photography presented raw with no rounded corners or overlays

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-pure-white: #ffffff;
  --color-carbon-black: #000000;
  --color-hairline-gray: #e5e5e5;
  --color-shadow-gray: #cccccc;
  --color-terracotta: #bc5346;
  --color-magenta-pencil: #ff00bc;
  --color-olive-foliage: #51633c;

  /* Typography — Font Families */
  --font-sans-serif: 'sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-helvetica-neue-lt-pro-md: 'Helvetica Neue LT Pro (Md)', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-helvetica-neue-lt-pro-roman: 'Helvetica Neue LT Pro (Roman)', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-helvetica-neue-lt-pro-lt: 'Helvetica Neue LT Pro (Lt)', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-helvetica-neue-lt-pro-bd: 'Helvetica Neue LT Pro (Bd)', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-new-century-schoolbook-lt-std-roman: 'New Century Schoolbook LT Std (Roman)', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-newcenturyschlbkltstd-roman: 'NewCenturySchlbkLTStd-Roman', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.2;
  --text-body: 16px;
  --leading-body: 1.1;
  --text-subheading: 20px;
  --leading-subheading: 1.2;
  --text-heading-sm: 23px;
  --leading-heading-sm: 1.1;
  --text-heading: 39px;
  --leading-heading: 1.08;
  --text-heading-lg: 67px;
  --leading-heading-lg: 1;
  --text-display: 105px;
  --leading-display: 0.8;

  /* Typography — Weights */
  --font-weight-regular: 400;

  /* Spacing */
  --spacing-5: 5px;
  --spacing-6: 6px;
  --spacing-7: 7px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-11: 11px;
  --spacing-12: 12px;
  --spacing-15: 15px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-23: 23px;
  --spacing-30: 30px;
  --spacing-45: 45px;
  --spacing-60: 60px;
  --spacing-65: 65px;
  --spacing-100: 100px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 30px;
  --card-padding: 10-12px;
  --element-gap: 10px;

  /* Border Radius */
  --radius-lg: 9.999px;
  --radius-xl: 15px;
  --radius-3xl: 37.5px;

  /* Named Radii */
  --radius-nav: 37.5px;
  --radius-cards: 0px;
  --radius-links: 10px;
  --radius-buttons: 15px;

  /* Shadows */
  --shadow-sm: rgba(0, 0, 0, 0.2) 4px 2px 4px 0px;
  --shadow-sm-2: rgb(237, 237, 237) 2px -1px 6px 0px;

  /* Surfaces */
  --surface-canvas: #ffffff;
  --surface-hairline: #e5e5e5;
  --surface-accent-stroke: #ff00bc;
  --surface-warm-accent: #bc5346;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-pure-white: #ffffff;
  --color-carbon-black: #000000;
  --color-hairline-gray: #e5e5e5;
  --color-shadow-gray: #cccccc;
  --color-terracotta: #bc5346;
  --color-magenta-pencil: #ff00bc;
  --color-olive-foliage: #51633c;

  /* Typography */
  --font-sans-serif: 'sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-helvetica-neue-lt-pro-md: 'Helvetica Neue LT Pro (Md)', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-helvetica-neue-lt-pro-roman: 'Helvetica Neue LT Pro (Roman)', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-helvetica-neue-lt-pro-lt: 'Helvetica Neue LT Pro (Lt)', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-helvetica-neue-lt-pro-bd: 'Helvetica Neue LT Pro (Bd)', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-new-century-schoolbook-lt-std-roman: 'New Century Schoolbook LT Std (Roman)', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-newcenturyschlbkltstd-roman: 'NewCenturySchlbkLTStd-Roman', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.2;
  --text-body: 16px;
  --leading-body: 1.1;
  --text-subheading: 20px;
  --leading-subheading: 1.2;
  --text-heading-sm: 23px;
  --leading-heading-sm: 1.1;
  --text-heading: 39px;
  --leading-heading: 1.08;
  --text-heading-lg: 67px;
  --leading-heading-lg: 1;
  --text-display: 105px;
  --leading-display: 0.8;

  /* Spacing */
  --spacing-5: 5px;
  --spacing-6: 6px;
  --spacing-7: 7px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-11: 11px;
  --spacing-12: 12px;
  --spacing-15: 15px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-23: 23px;
  --spacing-30: 30px;
  --spacing-45: 45px;
  --spacing-60: 60px;
  --spacing-65: 65px;
  --spacing-100: 100px;

  /* Border Radius */
  --radius-lg: 9.999px;
  --radius-xl: 15px;
  --radius-3xl: 37.5px;

  /* Shadows */
  --shadow-sm: rgba(0, 0, 0, 0.2) 4px 2px 4px 0px;
  --shadow-sm-2: rgb(237, 237, 237) 2px -1px 6px 0px;
}
```
