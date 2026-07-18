# Analogue — Style Reference
> Light tunnel through void

**Theme:** dark

Analogue operates as a cinematic void with a single luminous focal point: white type against near-black depth, interrupted only by a blue-white photographic light burst. The system is strictly achromatic — no chromatic accents, no shadows, no decorative gradients — so every emotional beat must come from typography, photography, and negative space. Type sits at a compressed 11–18px body register with whisper-tight tracking (-0.05em at display) and cinematically tight line-heights (1.00–1.05 on 40–60px display), making headlines feel like film titles rather than web headings. The LCD dot font appears as a single rare accent — digital punctuation in an otherwise humanist system. Navigation is a floating translucent pill, buttons are achromatic outlines or ghosts, and the architecture of the page (borders, surfaces, dividers) is so flat it disappears, forcing the photography and the type to do all the work.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Ink | `#000000` | `--color-ink` | Pure black — the structural anchor, used for hairlines, border strokes, and the deepest surface layer beneath imagery |
| Graphite | `#1c1c1c` | `--color-graphite` | Primary text and dominant UI foreground — body copy, headings, and the off-black tone that softens pure black for large runs of type |
| Paper | `#ffffff` | `--color-paper` | Primary page canvas and white card surfaces. |
| Mist | `#ededed` | `--color-mist` | Subtle surface wash for cards and elevated panels — the gentlest step off Paper, used where a panel needs to register without shouting |
| Ash | `#b8b8b8` | `--color-ash` | Tertiary surface and muted background fills — visible only as quiet backing for inactive states or low-emphasis blocks |
| Steel | `#7a7a7a` | `--color-steel` | Secondary text and subtle UI borders — metadata, timestamps, supporting copy, the mid-gray that bridges Graphite and Ash |
| Pewter | `#a6a6a6` | `--color-pewter` | Tertiary text and the quietest dividers — labels, tag text, anywhere type needs to recede into the surface |

## Tokens — Typography

### Graphik Medium — Primary typeface for all body, headings, and links. The custom Graphik brings humanist warmth that prevents the monochrome palette from feeling cold — paired with aggressive negative tracking (-0.05em at 60px) it compresses headlines into a single film-credit-like line. Weights stay at 400 and 500 only; no bold jumps, only tonal shifts between regular and medium. · `--font-graphik-medium`
- **Substitute:** Inter (closest free match), General Sans, or Manrope
- **Weights:** 400, 500
- **Sizes:** 11px, 13px, 17px, 18px, 40px, 60px
- **Line height:** 1.00–1.30 (cinematically tight on display, roomier at caption)
- **Letter spacing:** -0.0500em, -0.0400em, -0.0350em, -0.0310em, -0.0270em
- **Role:** Primary typeface for all body, headings, and links. The custom Graphik brings humanist warmth that prevents the monochrome palette from feeling cold — paired with aggressive negative tracking (-0.05em at 60px) it compresses headlines into a single film-credit-like line. Weights stay at 400 and 500 only; no bold jumps, only tonal shifts between regular and medium.

### LCDDot TR — Rare digital accent — a pixel/dot-matrix display face used for at most one or two elements per page (counters, timestamps, glitch labels). Its positive tracking (+0.025em to +0.04em) and rigid grid construction create a single moment of machine voice in an otherwise humanist system, like a digital readout appearing in a dark room. · `--font-lcddot-tr`
- **Substitute:** VT323, DSEG7 Classic, or Major Mono Display
- **Weights:** 400
- **Sizes:** 20px
- **Line height:** 1.00
- **Letter spacing:** 0.0250em – 0.0400em (positive; rare in a system dominated by negative tracking)
- **Role:** Rare digital accent — a pixel/dot-matrix display face used for at most one or two elements per page (counters, timestamps, glitch labels). Its positive tracking (+0.025em to +0.04em) and rigid grid construction create a single moment of machine voice in an otherwise humanist system, like a digital readout appearing in a dark room.

### system sans-serif — Fallback micro-text — utility copy, browser-rendered labels, or fallback rendering when custom fonts fail to load · `--font-system-sans-serif`
- **Substitute:** system-ui
- **Weights:** 400
- **Sizes:** 12px
- **Line height:** 1.20
- **Role:** Fallback micro-text — utility copy, browser-rendered labels, or fallback rendering when custom fonts fail to load

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| micro | 11px | 1.3 | -0.297px | `--text-micro` |
| caption | 13px | 1.25 | -0.351px | `--text-caption` |
| subheading | 18px | 1.1 | -0.558px | `--text-subheading` |
| heading | 40px | 1.05 | -1.6px | `--text-heading` |
| display | 60px | 1 | -3px | `--text-display` |

## Tokens — Spacing & Shapes

**Density:** compact

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 5 | 5px | `--spacing-5` |
| 10 | 10px | `--spacing-10` |
| 11 | 11px | `--spacing-11` |
| 13 | 13px | `--spacing-13` |
| 20 | 20px | `--spacing-20` |
| 29 | 29px | `--spacing-29` |
| 30 | 30px | `--spacing-30` |
| 40 | 40px | `--spacing-40` |
| 50 | 50px | `--spacing-50` |
| 60 | 60px | `--spacing-60` |
| 70 | 70px | `--spacing-70` |
| 100 | 100px | `--spacing-100` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 10px |
| links | 13px |
| images | 10px |
| buttons | 100px |
| navPill | 1000px |

### Layout

- **Section gap:** 60-70px
- **Card padding:** 20-30px
- **Element gap:** 10px

## Components

### Floating Navigation Pill
**Role:** Primary site navigation — a single floating element at the top-center of every page

1000px border-radius, horizontally centered, fixed position. Frosted background (rgba(255,255,255,0.15) with backdrop-blur) so it reads over both dark and light hero imagery. Three segments: left nav link (WORK), center wordmark (analogue, Graphik Medium 500, larger weight), right nav link (ABOUT). All text in Graphik 13px, white. Internal padding ~5px 20px. The pill's translucency is its identity — it must feel like glass hovering over the page, not a solid bar.

### Hero Headline Overlay
**Role:** Opening statement set directly over a full-bleed photographic hero

Display 60px Graphik Medium weight 500, color #ffffff, letter-spacing -3.0px, line-height 1.00 — text must fit on a single visual line at desktop widths. Center-aligned horizontally, vertically anchored to viewport center. No drop shadow, no background plate; the hero image provides its own contrast. Headlines should read like a single thought, not a wrapped paragraph.

### Text Fragment Node
**Role:** Individual repositionable text elements used in animated/scroll-triggered sequences

13–18px Graphik Medium, Graphite on light surfaces / white on dark. No container, no background, no border — each fragment is bare type positioned absolutely or via flex/grid. Opacity ranges from 0.15 to 1.0 to create depth in animated reveals. Multiple fragments form a complete sentence when read in order.

### Ghost Navigation Link
**Role:** Text-only link inside the nav pill (WORK, ABOUT)

Graphik Medium 13px, weight 400, color #ffffff at 0.6 opacity (resting) → 1.0 (hover). No underline, no background, no border. Letter-spacing -0.351px matches the caption scale. Hover transition is opacity-only, 200ms ease.

### Outlined Link Button
**Role:** Secondary action — the system's only button shape

Graphik Medium 13px, weight 500, Graphite text on transparent background, 1px border in Graphite, 100px border-radius (pill shape), padding 10px 20px. Hover inverts: Graphite background, Paper text. No shadow at any state.

### Project Card
**Role:** Image-led work tile in case-study grids

10px border-radius on the image (the container itself has no border or background). Caption below in 13px Graphik Medium 400, Steel color, no title styling above the image — the image carries the work's identity. Gap between image and caption: 10px. Card surface is transparent on the Paper canvas.

### LCD Digital Readout
**Role:** Scarce pixel-font accent for timestamps, counters, or glitch text

LCDDot TR 20px, line-height 1.00, letter-spacing +0.5px to +0.8px (positive — opposite of the rest of the system). Color: white on dark sections, Graphite on light. Padding 5px 10px in a 10px-radius container with no border, used as a single editorial accent, never as a button or functional control.

### Hairline Divider
**Role:** Invisible architectural element — separates sections without declaring itself

1px height, full container width, color Ink (#000000) at 0.08 opacity, or Steel (#7a7a7a) at 0.3 opacity on light surfaces. No margin above/below — sits flush within a section's vertical rhythm. Used sparingly; most sections should separate purely through whitespace.

### Image Thumbnail
**Role:** Inline imagery in case studies and detail pages

10px border-radius, full-bleed within its container (no padding inside the radius). Color treatment follows the source — no filters, no duotones, no overlays. Images are the only source of color and contrast in the system and should be left untouched.

## Do's and Don'ts

### Do
- Use only colors from the seven-step achromatic scale — Paper through Ink — with no chromatic accent at any point
- Set display headlines at 60px with -3.0px letter-spacing and 1.00 line-height so they read as a single tight line of type
- Anchor the nav as a 1000px-radius floating pill with frosted-glass background; never use a solid-bar or sidebar nav
- Use 10px as the default element gap; reserve 40–70px for inter-section breathing room only
- Apply 10px radius to images and cards, 13px to inline links, 100px to buttons, 1000px to the nav — radius is a role signal, not a style choice
- Deploy the LCD dot font at most once per page as a 20px accent; treat it as a moment of digital interruption in an otherwise humanist system
- Let photography carry all color and contrast; never apply duotone, saturation shifts, or color overlays to imagery

### Don't
- Don't introduce any color — no blues, reds, greens, purples — the system is defined by its absolute achromatic discipline
- Don't add shadows to cards, buttons, or content surfaces; depth comes from surface tone shifts, not elevation
- Don't use bold or semibold weights — the system stays at 400 and 500 only, with weight shifts replacing color as the hierarchy tool
- Don't wrap display headlines to multiple lines at desktop widths; the 60px / -3.0px / 1.00 setting is designed for single-line cinematic statements
- Don't use 0px, 4px, or 8px radii — every container in the system sits at 10px, 13px, 100px, or 1000px
- Don't add underlines to links; use opacity (0.6 → 1.0) or a 1px border shift instead
- Don't use the LCD dot font for body copy, labels, or functional UI — reserve it strictly for editorial/digital-accent moments

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Void | `#000000` | Hero photography field, deepest base layer |
| 1 | Graphite | `#1c1c1c` | Off-black for dark sections, inverse text backgrounds |
| 2 | Paper | `#ffffff` | Primary page canvas |
| 3 | Mist | `#ededed` | Card surfaces, elevated panels, subtle section washes |

## Elevation

- **Floating Navigation Pill:** `0 1px 0 rgba(0,0,0,0.05), 0 8px 32px rgba(0,0,0,0.08) — barely-there frosted-glass depth, enough to lift the pill off the hero without breaking the flat aesthetic`

## Imagery

Analogue's visual language is dominated by a single recurring photographic motif: a high-contrast light burst radiating from a central point against near-black depth — visually equivalent to staring into a tunnel of light, a supernova, or a camera flash filling a void. The image is treated full-bleed with no overlay, no border, no rounded corners on the hero (sharp, cinematic, world-filling). It is not illustration or product photography; it is atmosphere, pure visual emotion, and the only color in an otherwise achromatic system (a cold blue-white cast against black). Supporting imagery, if present in case studies, is left unfiltered — no duotone, no saturation shift. The system contains no icon set of any size, no illustrations, no 3D renders. Photography is the sole visual instrument, and it is deployed once, at scale, as a hero — never as decoration.

## Layout

Every page opens with a full-viewport dark hero (100vw × 100vh) containing the single light-burst image and one centered white display headline. The floating nav pill sits absolutely positioned at top-center, outside the document flow. Below the hero, content sections live on a Paper (#ffffff) canvas at full width with internal max-width centering (no rigid grid — content blocks are placed loosely, often spanning 6–10 columns of a 12-column sense). Section gaps are generous (60–70px) but the body type stays compressed at 11–18px, so density varies between text-rich editorial blocks and wide photographic breaks. There is no consistent card grid — case studies appear as vertically stacked editorial pages with full-width images, not as uniform tiles. Navigation is a single global pill; no sidebar, no secondary nav, no footer menu visible. The overall page rhythm is: dark cinematic opening → one or more light editorial sections → dark or image-led closing.

## Agent Prompt Guide

**Quick Color Reference**
- text: #1c1c1c (Graphite) on light / #ffffff (Paper) on dark
- background: #ffffff (Paper) — primary canvas
- border: #000000 (Ink) at low opacity, or #1c1c1c (Graphite) for emphasis
- accent: none — system is fully achromatic
- secondary text: #7a7a7a (Steel)
- primary action: no distinct CTA color

**Example Component Prompts**

1. **Build a floating nav pill**: 1000px border-radius, centered horizontally at top of viewport, fixed position. Frosted background rgba(255,255,255,0.15) with backdrop-blur(20px). Three inline items: left link "WORK" in Graphik 13px weight 400 white at 0.6 opacity; center wordmark "analogue" in Graphik 13px weight 500 white at 1.0 opacity; right link "ABOUT" matching the left. Padding 5px 20px. Subtle shadow 0 8px 32px rgba(0,0,0,0.08).

2. **Build a hero headline over a dark image**: Full-bleed 100vw × 100vh photographic background (a central light-burst on near-black). Centered white display text: 60px Graphik Medium weight 500, color #ffffff, letter-spacing -3.0px, line-height 1.00, text-align center. Single line. No background plate, no overlay, no shadow on the text.

3. **Build an outlined ghost button**: Graphik Medium 13px weight 500, color #1c1c1c, transparent background, 1px solid #1c1c1c border, 100px border-radius, padding 10px 20px. Hover: swap to #1c1c1c background with #ffffff text. No shadow at any state.

4. **Build a project image card**: Transparent container on a #ffffff canvas. Image fills the container with 10px border-radius. 10px gap below the image. Caption: Graphik Medium 13px weight 400, color #7a7a7a, letter-spacing -0.351px. No title above the image. No card border or background.

5. **Build an LCD digital readout accent**: 20px LCDDot TR (or VT323 as substitute), color #ffffff on dark surfaces, 10px border-radius container with no border, padding 5px 10px. Use sparingly — one per page maximum, as editorial punctuation only.

## Similar Brands

- **Active Theory** — Same full-bleed dark immersive hero with a single luminous focal point and minimal monochrome interface
- **Locomotive** — Same compact Graphik-family type, near-flat surfaces, and a black-canvas cinematic agency aesthetic
- **Resn** — Same experimental monochrome agency language with a single dramatic visual moment carrying the page
- **Ueno** — Same tight 13–17px body type with aggressive negative tracking and a fully achromatic palette
- **Aristide Benoist** — Same centered oversized display headline over a dark photographic field with a floating minimal nav

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-ink: #000000;
  --color-graphite: #1c1c1c;
  --color-paper: #ffffff;
  --color-mist: #ededed;
  --color-ash: #b8b8b8;
  --color-steel: #7a7a7a;
  --color-pewter: #a6a6a6;

  /* Typography — Font Families */
  --font-graphik-medium: 'Graphik Medium', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-lcddot-tr: 'LCDDot TR', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-system-sans-serif: 'system sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-micro: 11px;
  --leading-micro: 1.3;
  --tracking-micro: -0.297px;
  --text-caption: 13px;
  --leading-caption: 1.25;
  --tracking-caption: -0.351px;
  --text-subheading: 18px;
  --leading-subheading: 1.1;
  --tracking-subheading: -0.558px;
  --text-heading: 40px;
  --leading-heading: 1.05;
  --tracking-heading: -1.6px;
  --text-display: 60px;
  --leading-display: 1;
  --tracking-display: -3px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;

  /* Spacing */
  --spacing-5: 5px;
  --spacing-10: 10px;
  --spacing-11: 11px;
  --spacing-13: 13px;
  --spacing-20: 20px;
  --spacing-29: 29px;
  --spacing-30: 30px;
  --spacing-40: 40px;
  --spacing-50: 50px;
  --spacing-60: 60px;
  --spacing-70: 70px;
  --spacing-100: 100px;

  /* Layout */
  --section-gap: 60-70px;
  --card-padding: 20-30px;
  --element-gap: 10px;

  /* Border Radius */
  --radius-lg: 10px;
  --radius-xl: 13px;
  --radius-2xl: 20px;
  --radius-full: 100px;
  --radius-full-2: 1000px;

  /* Named Radii */
  --radius-cards: 10px;
  --radius-links: 13px;
  --radius-images: 10px;
  --radius-buttons: 100px;
  --radius-navpill: 1000px;

  /* Surfaces */
  --surface-void: #000000;
  --surface-graphite: #1c1c1c;
  --surface-paper: #ffffff;
  --surface-mist: #ededed;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-ink: #000000;
  --color-graphite: #1c1c1c;
  --color-paper: #ffffff;
  --color-mist: #ededed;
  --color-ash: #b8b8b8;
  --color-steel: #7a7a7a;
  --color-pewter: #a6a6a6;

  /* Typography */
  --font-graphik-medium: 'Graphik Medium', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-lcddot-tr: 'LCDDot TR', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-system-sans-serif: 'system sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-micro: 11px;
  --leading-micro: 1.3;
  --tracking-micro: -0.297px;
  --text-caption: 13px;
  --leading-caption: 1.25;
  --tracking-caption: -0.351px;
  --text-subheading: 18px;
  --leading-subheading: 1.1;
  --tracking-subheading: -0.558px;
  --text-heading: 40px;
  --leading-heading: 1.05;
  --tracking-heading: -1.6px;
  --text-display: 60px;
  --leading-display: 1;
  --tracking-display: -3px;

  /* Spacing */
  --spacing-5: 5px;
  --spacing-10: 10px;
  --spacing-11: 11px;
  --spacing-13: 13px;
  --spacing-20: 20px;
  --spacing-29: 29px;
  --spacing-30: 30px;
  --spacing-40: 40px;
  --spacing-50: 50px;
  --spacing-60: 60px;
  --spacing-70: 70px;
  --spacing-100: 100px;

  /* Border Radius */
  --radius-lg: 10px;
  --radius-xl: 13px;
  --radius-2xl: 20px;
  --radius-full: 100px;
  --radius-full-2: 1000px;
}
```
