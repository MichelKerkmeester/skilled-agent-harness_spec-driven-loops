# alet — Style Reference
> Vintage editorial contact sheet on warm taupe paper.

**Theme:** light

ALET Agency operates as a print-magazine spread translated to the web: a warm taupe canvas (#ada59b) swallows the entire page, typography stays whisper-small (11–13px WorkSans for all UI), and the ALET wordmark itself is set in a light serif with extreme letter-spacing that reads more like a magazine masthead than a logo. The entire color palette is strictly achromatic warm grays — there is no accent color, no CTA button fill, no state color. All visual interest comes from the photograph grid: an asymmetric, scattered arrangement of editorial imagery with floating category labels (GRAPHIC DESIGN, SOCIAL MEDIA, ART DIRECTION, etc.) positioned around it like captions on a contact sheet. Components are nearly invisible — no cards, no shadows, no fills, no rounded containers. The interface dissolves into the paper, and the work is the only thing the eye lands on.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Taupe Paper | `#ada59b` | `--color-taupe-paper` | Full-page canvas, the single dominant surface — every section and component sits on this warm gray, never on white or near-black. The warm undertone (vs cool slate) is what makes the whole site feel like printed stock rather than a digital UI |
| Ink Black | `#000000` | `--color-ink-black` | Primary text, all borders, all hairlines, all SVG strokes. Used at full opacity — no softened text grays, no 80% black. The crispness against warm taupe creates the magazine-printed feel |
| Charcoal | `#252525` | `--color-charcoal` | Navigation text and the nav underline borders. Slightly softer than pure ink for the persistent top-of-page chrome so the nav recedes behind the work |
| Graphite | `#101010` | `--color-graphite` | Secondary text and supporting borders where Charcoal reads too soft but pure Ink is too loud. The single mid-step between nav and body |
| Stone | `#454545` | `--color-stone` | Occasional inset surface for body-level containers — the only tonal step above the canvas, used sparingly for any small frame or block that needs to separate from the page without introducing color |
| Press Black | `#060506` | `--color-press-black` | Fine SVG illustration stroke — near-identical to Ink Black but kept distinct in the source. Use for line-art icons and decorative vector marks |

## Tokens — Typography

### WorkSans — All UI chrome: navigation, category labels, body copy, metadata, toggle text. Deliberately tiny — 11–13px forces an editorial intimacy and keeps the page from feeling like a product interface. Set in Work Sans Regular at default tracking; the small size is what makes it feel like print captions rather than web UI. · `--font-worksans`
- **Substitute:** Inter, IBM Plex Sans, or any humanist sans at the same size to preserve the caption-like feel
- **Weights:** 400
- **Sizes:** 11px, 12px, 13px
- **Line height:** 1.00–1.50
- **Role:** All UI chrome: navigation, category labels, body copy, metadata, toggle text. Deliberately tiny — 11–13px forces an editorial intimacy and keeps the page from feeling like a product interface. Set in Work Sans Regular at default tracking; the small size is what makes it feel like print captions rather than web UI.

### SilkSerif — The ALET wordmark and any other serif display moment. Light weight at 23px with tight leading (0.94) and extremely wide letter-spacing — the letters almost float apart. The serif is the only non-sans on the site, which is what makes the brand mark readable as a masthead rather than a wordmark. · `--font-silkserif`
- **Substitute:** Cormorant Garamond Light, Playfair Display, or any high-contrast transitional serif at light weight with letter-spacing opened to roughly 0.5em
- **Weights:** 300 (Light)
- **Sizes:** 23px
- **Line height:** 0.94
- **Role:** The ALET wordmark and any other serif display moment. Light weight at 23px with tight leading (0.94) and extremely wide letter-spacing — the letters almost float apart. The serif is the only non-sans on the site, which is what makes the brand mark readable as a masthead rather than a wordmark.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 11px | 1.1 | — | `--text-caption` |
| body-sm | 12px | 1.1 | — | `--text-body-sm` |
| body | 13px | 1.1 | — | `--text-body` |

## Tokens — Spacing & Shapes

**Base unit:** 6px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 5 | 5px | `--spacing-5` |
| 11 | 11px | `--spacing-11` |
| 22 | 22px | `--spacing-22` |
| 23 | 23px | `--spacing-23` |
| 36 | 36px | `--spacing-36` |
| 101 | 101px | `--spacing-101` |
| 180 | 180px | `--spacing-180` |
| 209 | 209px | `--spacing-209` |

### Border Radius

| Element | Value |
|---------|-------|
| images | 0px |
| buttons | 9999px |
| smallFrames | 10.8px |

### Layout

- **Section gap:** 101-180px
- **Card padding:** 0px
- **Element gap:** 11-23px

## Components

### Editorial Image Tile
**Role:** The work — photography placed on the taupe canvas in an asymmetric scattered grid

Full-bleed photographs at varying aspect ratios, positioned with marginLeft/marginTop in irregular offsets (101–209px range). No border, no shadow, no radius. Sharp 0px corners. Image content provides all color in the entire system.

### Floating Category Label
**Role:** Anchors the image grid — names the discipline (GRAPHIC DESIGN, SOCIAL MEDIA, ART DIRECTION, etc.)

11–12px Work Sans Regular, uppercase, Ink Black (#000000), normal tracking, positioned absolutely around the image field like a contact-sheet caption. No background, no border, no underline.

### Corner Nav Link
**Role:** Primary navigation — top-left and top-right clusters

11–12px Work Sans Regular, uppercase, Charcoal (#252525). Separated by 36px gaps in the top bar. Hover swaps to Ink Black. No fill, no underline at rest — a 1px Charcoal border-bottom may appear on the active route.

### ALET Wordmark
**Role:** Centered masthead in the top bar — the only serif on the site

SilkSerif Light at 23px, Ink Black, letter-spacing opened to roughly 0.5–0.8em (letters nearly detached), line-height 0.94. Functions as a magazine title plate, not a logo lockup.

### Layout Toggle
**Role:** Switches the image grid between LINEAR and RANDOM arrangement

11px Work Sans, uppercase, flanking a 9999px-radius pill track with a small circular thumb (roughly 10.8px diameter). Track and thumb are stroke-only in Ink Black on the taupe canvas — no fill states, no color.

### Studio Statement
**Role:** Centered editorial blurb below the image field

13px Work Sans Regular, Ink Black, set in a centered single-block paragraph beneath the grid. No surrounding container — the type floats directly on the taupe paper.

### Hairline Divider
**Role:** Section separation

1px Ink Black line spanning the full viewport width. Used extremely sparingly — the system prefers whitespace and the scattered image field to communicate rhythm over explicit dividers.

### Pill Container
**Role:** Rare surface for a small inline element (e.g. the toggle track)

9999px border-radius, 1px Ink Black stroke, transparent fill on the taupe canvas. The pill is the only rounded form in the system and appears only on the layout toggle.

## Do's and Don'ts

### Do
- Use #ada59b as the page canvas for every section, every page, every state — the taupe paper is the brand
- Set all UI text at 11–13px in Work Sans Regular; never scale up to 14–16px for a 'primary' label
- Set the ALET wordmark in Silk Serif Light at 23px with letter-spacing opened to ~0.5em
- Use #000000 for all text, borders, and SVG strokes at full opacity — no softened blacks
- Place photographs at 0px radius, no border, no shadow — let the image edges meet the canvas directly
- Use 9999px radius only for the layout-toggle pill; 10.8px only for tiny inset frames; everything else stays sharp
- Keep section gaps in the 101–209px range — the page breathes like a printed spread, not a dashboard

### Don't
- Do not introduce any chromatic color — no accent, no CTA fill, no status greens/reds/blues
- Do not use white, off-white, or near-black as a section background — the taupe canvas is the only surface
- Do not add box-shadows, elevation, or gradient fills to any component
- Do not use a sans-serif for the wordmark or any display moment — Silk Serif is the only serif and the only size above 13px
- Do not round image corners or wrap photographs in cards with fills or borders
- Do not center body text in narrow columns — the studio statement is the only centered block, and it spans a wide measure
- Do not use large display weights (600–700) — the system runs entirely on Regular and Light

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Taupe Paper | `#ada59b` | The entire page. No section ever changes background color — the canvas is monolithic and the photographs are the only color that ever appears. |
| 1 | Stone Block | `#454545` | Rare inset surfaces — the occasional small framed block or bordered container that needs a subtle tonal lift off the canvas. |

## Elevation

The design intentionally avoids elevation entirely. There are no shadows, no overlays, no z-axis depth cues. Components sit flush on the taupe canvas like prints pinned to a wall. Where a component needs separation, use a 1px hairline in Ink Black or a subtle 10.8px rounded frame in Stone — never shadow.

## Imagery

Photography is the sole source of color in the entire system. The site is a grid of tightly cropped editorial stills — packaging shots, interior photography, portrait details, product on table — all at high resolution, all at sharp 0px corners, scattered with irregular offsets (101–209px) so the grid reads as a contact sheet rather than a structured grid. The photographs are warm, slightly desaturated, lit naturally — they sit comfortably on the taupe canvas without jarring against it. No illustrations, no icons beyond tiny line-art strokes, no 3D renders, no abstract graphics. Image-heavy layout where photography occupies roughly 40–50% of the viewport in the hero band, tapering as the page scrolls. The role of imagery is to BE the work — the site is a portfolio, not a product page.

## Layout

Full-bleed page, no max-width container, no centered column. The top bar is a three-part composition: nav cluster top-left (OUR WORK), centered ALET wordmark, nav cluster top-right (ABOUT / PROCESS / CONTACT) — all sitting in the corners and center of the viewport, not inside a header container. Below the top bar, a tall asymmetric image field with floating category labels (GRAPHIC DESIGN, SOCIAL MEDIA, ART DIRECTION, COPYWRITING, PHOTOGRAPHY & FILM, CREATIVE CONSULTANCY) positioned at irregular coordinates around it. The grid has no visible columns or gutters — images overlap and offset freely. A centered studio statement and a LINEAR/RANDOM layout toggle sit below the field. Section rhythm is defined entirely by the scattered imagery and 101–180px vertical breathing room between bands; no alternating dark/light sections, no dividers, no cards.

## Agent Prompt Guide

Quick Color Reference:
  text: #000000
  background: #ada59b
  border: #000000
  accent: none — there is no accent color in this system
  primary action: no distinct CTA color

Example Component Prompts:

1. Create a top navigation bar on a #ada59b full-bleed canvas. Left cluster: 'OUR WORK' at 11px Work Sans Regular, #252525, uppercase, letter-spacing normal. Center: the word 'ALET' set in Silk Serif Light, 23px, #000000, line-height 0.94, letter-spacing roughly 0.5em so the letters are widely separated. Right cluster: 'ABOUT   PROCESS   CONTACT' at 11px Work Sans, #252525, with 36px gaps between links. No background fill, no border on the bar itself — it floats directly on the taupe canvas.

2. Create an editorial image grid section on #ada59b. Place 6–8 photographs at varying aspect ratios (roughly 1:1, 4:5, 3:2) with marginLeft and marginTop offsets between 101px and 209px so the grid reads scattered and asymmetric, not column-aligned. Each image is 0px border-radius, no border, no shadow. Surround the grid with floating category labels in 11px Work Sans, #000000, uppercase, positioned at irregular coordinates: 'GRAPHIC DESIGN' top-left, 'SOCIAL MEDIA' top-center, 'ART DIRECTION' top-right, 'COPYWRITING' bottom-left, 'PHOTOGRAPHY & FILM' bottom-center, 'CREATIVE CONSULTANCY' bottom-right.

3. Create a layout toggle component on the #ada59b canvas: the word 'LINEAR' on the left, 'RANDOM' on the right, both at 11px Work Sans uppercase #000000, flanking a 9999px-radius pill track (roughly 28px wide × 14px tall) drawn with a 1px #000000 stroke, transparent fill. A small circular thumb (~10.8px diameter) sits inside the track, also 1px #000000 stroke, no fill.

4. Create a studio statement block centered below the image grid. Single paragraph, 13px Work Sans Regular, #000000, line-height 1.5, centered, sitting directly on the #ada59b canvas with roughly 180px of padding above. No container, no border, no background.

5. Create a small pill tag component for inline use: 1px #000000 stroke, 9999px radius, transparent fill on #ada59b, 11px Work Sans Regular #000000 text inside, 5px vertical and 11px horizontal padding. No fill states — the pill remains outline-only at rest and on hover.

## Similar Brands

- **Pentagram** — Same editorial-portfolio language: no accent color, full-bleed canvas, serif masthead, scattered project imagery, micro-typography
- **Marcin Rusak Studio** — Same warm-paper aesthetic with photography as the sole chromatic element and barely-there UI chrome
- **Bureau Cool** — Same caption-scale 11–13px sans-serif navigation with a centered serif wordmark and asymmetric image scatter
- **Hyer Goods** — Same contact-sheet image arrangement and ultra-minimal achromatic system where photography carries the color

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-taupe-paper: #ada59b;
  --color-ink-black: #000000;
  --color-charcoal: #252525;
  --color-graphite: #101010;
  --color-stone: #454545;
  --color-press-black: #060506;

  /* Typography — Font Families */
  --font-worksans: 'WorkSans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-silkserif: 'SilkSerif', ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.1;
  --text-body-sm: 12px;
  --leading-body-sm: 1.1;
  --text-body: 13px;
  --leading-body: 1.1;

  /* Typography — Weights */
  --font-weight-regular: 400;

  /* Spacing */
  --spacing-unit: 6px;
  --spacing-5: 5px;
  --spacing-11: 11px;
  --spacing-22: 22px;
  --spacing-23: 23px;
  --spacing-36: 36px;
  --spacing-101: 101px;
  --spacing-180: 180px;
  --spacing-209: 209px;

  /* Layout */
  --section-gap: 101-180px;
  --card-padding: 0px;
  --element-gap: 11-23px;

  /* Border Radius */
  --radius-lg: 10.8px;
  --radius-full: 9999px;

  /* Named Radii */
  --radius-images: 0px;
  --radius-buttons: 9999px;
  --radius-smallframes: 10.8px;

  /* Surfaces */
  --surface-taupe-paper: #ada59b;
  --surface-stone-block: #454545;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-taupe-paper: #ada59b;
  --color-ink-black: #000000;
  --color-charcoal: #252525;
  --color-graphite: #101010;
  --color-stone: #454545;
  --color-press-black: #060506;

  /* Typography */
  --font-worksans: 'WorkSans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-silkserif: 'SilkSerif', ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.1;
  --text-body-sm: 12px;
  --leading-body-sm: 1.1;
  --text-body: 13px;
  --leading-body: 1.1;

  /* Spacing */
  --spacing-5: 5px;
  --spacing-11: 11px;
  --spacing-22: 22px;
  --spacing-23: 23px;
  --spacing-36: 36px;
  --spacing-101: 101px;
  --spacing-180: 180px;
  --spacing-209: 209px;

  /* Border Radius */
  --radius-lg: 10.8px;
  --radius-full: 9999px;
}
```
