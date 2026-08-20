# Arthursimonini — Style Reference
> printed film programme in black ink

**Theme:** dark

Arthur Simonini is a high-contrast editorial showcase built on absolute monochrome: pure black canvas, pure white type, and nothing in between. The visual identity is carried entirely by two custom serif faces — a quiet text-grade serif for navigation and metadata, and an ornamental didone with discretionary ligatures reserved for oversized display moments. Layout is ruled by hairline white borders that act as section dividers and grid rails, not by cards, shadows, or color. Content is presented like a printed film programme or a French luxury maison lookbook: typographic marquees scroll repeated section titles, film posters fill grids in grayscale, and generous negative space lets the ligature-rich display type breathe. No color, no gradients, no fills, no elevation — the entire system is an exercise in typographic and structural discipline.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Obsidian | `#000000` | `--color-obsidian` | Page canvas, nav background, poster grid ground |
| Bone | `#ffffff` | `--color-bone` | All text, hairline section borders, image borders, icon strokes |

## Tokens — Typography

### RomieLigatures-Regular — Display headlines, section titles, marquee text. The signature choice: this didone carries discretionary ligatures (dlig) that fuse letters into ornamental shapes — the oversized wordmarks and repeated marquee bands rely on these ligatures for their distinctive character. Line-height collapses to 0.73 at the 167px size so stacked display lines almost touch, creating a dense editorial block. Reserved exclusively for type-as-art moments; never used for body copy or UI labels. · `--font-romieligatures-regular`
- **Substitute:** Playfair Display, Bodoni Moda, GT Super
- **Weights:** 400
- **Sizes:** 18px, 65px, 167px
- **Line height:** 0.73, 0.90, 1.20
- **OpenType features:** `"dlig" on, "kern" on`
- **Role:** Display headlines, section titles, marquee text. The signature choice: this didone carries discretionary ligatures (dlig) that fuse letters into ornamental shapes — the oversized wordmarks and repeated marquee bands rely on these ligatures for their distinctive character. Line-height collapses to 0.73 at the 167px size so stacked display lines almost touch, creating a dense editorial block. Reserved exclusively for type-as-art moments; never used for body copy or UI labels.

### LifeLTStd-Roman — Navigation links, metadata, body copy, timestamps, section category labels. A single weight at a single size — the system does not modulate emphasis through weight. Tracking is normal. This is the functional typeface that scaffolds the UI while the display face performs. Its quietness is the point: LifeLTStd is a transitional serif that reads cleanly at 18px without competing with the display type. · `--font-lifeltstd-roman`
- **Substitute:** Cormorant Garamond, Lora, Spectral
- **Weights:** 400
- **Sizes:** 18px
- **Line height:** 1.00, 1.20
- **OpenType features:** `"kern" on`
- **Role:** Navigation links, metadata, body copy, timestamps, section category labels. A single weight at a single size — the system does not modulate emphasis through weight. Tracking is normal. This is the functional typeface that scaffolds the UI while the display face performs. Its quietness is the point: LifeLTStd is a transitional serif that reads cleanly at 18px without competing with the display type.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 18px | 1 | — | `--text-caption` |
| heading-sm | 65px | 0.9 | — | `--text-heading-sm` |
| display | 167px | 0.73 | — | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 8px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 5 | 5px | `--spacing-5` |
| 10 | 10px | `--spacing-10` |
| 15 | 15px | `--spacing-15` |
| 20 | 20px | `--spacing-20` |
| 40 | 40px | `--spacing-40` |
| 62 | 62px | `--spacing-62` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 0px |
| cards | 0px |
| inputs | 0px |
| buttons | 0px |

### Layout

- **Section gap:** 40px
- **Card padding:** 15px
- **Element gap:** 15px

## Components

### Scrolling Marquee Navigation
**Role:** Primary navigation

Horizontal band of repeated section titles (BARDOT, PLAYLIST, AFFAIRES SENSIBLES, SHIN SEKAI) in RomieLigatures, white on black, separated by tiny uppercase category prefixes (B.O., PLAY, HABILLAGES, DISQUES) in LifeLTStd. The repeated text scrolls horizontally, filling the full viewport width with 15px vertical padding. No visible buttons, no underlines, no hover color shift — the entire nav is a typographic texture.

### Site Wordmark
**Role:** Brand identity header

ARTHUR SIMONINI at 167px in RomieLigatures, white on black, line-height 0.73, left-aligned, no margin above. The display ligatures fuse 'AR' and 'TH' and 'SI' into ornamental shapes. This is the single largest type element on the site.

### Hairline Section Divider
**Role:** Structural separator

1px solid white (#ffffff) horizontal line spanning the full viewport width. Used between every content block — between the wordmark and the first marquee, between marquees, and above grids. No padding gap; the line touches the text above and below directly. This is the only structural component.

### Playlist Track Row
**Role:** Music list item

Full-width row on black, track title in RomieLigatures 65px (or LifeLTStd 18px for parenthetical subtitles), duration timestamp right-aligned in LifeLTStd 18px. No background fill, no border, no hover state visible — rows are separated only by 40px vertical rhythm. The duration is a quiet typographic counterweight to the oversized title.

### Film Poster Grid
**Role:** Image gallery

Multi-column grid (approximately 6 columns) of poster thumbnails on black. Each poster is a grayscale photograph with a 1px solid white border. No gap between posters — the white borders form a continuous grid lattice. No captions, no titles beneath images. The images themselves are the content.

### Section Category Label
**Role:** Eyebrow / kicker text

Tiny uppercase prefix (B.O., PLAY, HABILLAGES, DISQUES, P.U.B.S., O.N.E.R.T.S., I.N.F.O.S.) in LifeLTStd 18px, white, positioned to the left of section titles. Acts as a taxonomy marker. Letter-spacing is normal — the visual gap between the dots in the abbreviations is a typographic device, not tracked space.

### Timestamp / Duration
**Role:** Metadata indicator

LifeLTStd 18px, white, right-aligned. Appears at the end of playlist rows. Line-height 1.0. No separator punctuation — just a bare number with colon-separated minutes:seconds.

### Poster Thumbnail
**Role:** Content card

Grayscale film still or poster art, framed by a 1px white border on all sides. No shadow, no padding inside the border, no caption. The image fills its frame edge-to-edge. Aspect ratios vary (portrait posters, landscape stills) but the white border is always exactly 1px.

## Do's and Don'ts

### Do
- Use only #000000 and #ffffff — every surface, every border, every character is one of these two values.
- Reserve RomieLigatures for display moments only: site wordmark, section titles, marquee bands, and track names at 65px+. Never use it for UI labels or metadata.
- Use LifeLTStd 18px as the single body/nav/label size across the entire site — do not introduce a type scale beyond the four documented roles.
- Separate every content block with a 1px solid white hairline that spans 100% viewport width with no padding gap.
- Set display type at 167px with line-height 0.73 so stacked lines nearly touch — this density is the editorial signature.
- Enable discretionary ligatures ("dlig" on) on all RomieLigatures usage — the fused letterforms are the brand's most recognizable visual element.
- Use 15px padding for all internal spacing within bands and 40px between major content sections.

### Don't
- Never introduce color — not for hover states, not for active nav, not for error messages, not for decorative accents.
- Never use border-radius — all corners are square (0px). This includes buttons, images, and tags.
- Never apply box-shadow or drop-shadow — elevation is expressed through white hairlines and negative space, not depth.
- Never use bold or semibold weights — both typefaces operate at 400 only. Emphasis comes from size contrast, not weight.
- Never use RomieLigatures for body copy, labels, timestamps, or anything below 65px — the decorative ligatures become illegible at small sizes.
- Never add background fills, gradients, or colored overlays to poster images — keep them raw grayscale with only a white border.
- Never center-align body text or metadata — left-align for content, right-align only for timestamps and durations.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Obsidian Canvas | `#000000` | Full-bleed page background, navigation bar |
| 2 | Bone Image Frame | `#ffffff` | Hairline borders around poster thumbnails and between sections — the only non-text white usage |

## Imagery

Imagery is restricted to film poster art and grayscale stills, presented in a dense borderless grid where 1px white frames create a lattice structure. All images are desaturated to near-grayscale. No photography of the designer, no lifestyle imagery, no product shots — the visual content is exclusively other people's film artwork. The rest of the site is pure typography: no illustrations, no icons (functional UI icons are absent entirely), no decorative graphics. The image grid sits at the bottom of the page as a portfolio wall, while everything above it is type-only.

## Layout

Full-bleed layout with no max-width container — every band stretches edge-to-edge across the viewport. The page reads as a vertical stack of typographic bands separated by hairline white rules: site wordmark → category marquee → second marquee → playlist list → poster grid. Navigation is embedded inline as scrolling marquee text rather than a separate header bar. The poster grid is a 6-column equal-width grid with zero gutter, where white image borders form the grid lines. Content is left-aligned throughout except for timestamps which are right-aligned. Density shifts from sparse (large margins around the wordmark and between sections) to dense (playlist rows at 40px rhythm, poster grid with no gaps). No sidebar, no sticky header, no breadcrumbs — the layout is a single scrollable column of horizontal bands.

## Agent Prompt Guide

**Quick Color Reference:**
- background: #000000
- text: #ffffff
- border: #ffffff (1px hairline)
- accent: #ffffff (no chromatic accent exists)
- primary action: no distinct CTA color

**Example Component Prompts:**

1. Create a full-bleed site header: black (#000000) background, 0px padding. The wordmark "ARTHUR SIMONINI" set in RomieLigatures at 167px, weight 400, white (#ffffff), line-height 0.73, left-aligned, with discretionary ligatures enabled ("dlig" on, "kern" on). Below the wordmark, a 1px solid white hairline divider spans 100% viewport width.

2. Create a scrolling marquee navigation band: black background, 15px padding top and bottom. Repeated text "B.O. HABILAGES DISQUES PUBS ONERTS INFOS" in RomieLigatures at 18px, white, with the category prefixes (B.O., HABILLAGES, DISQUES) in LifeLTStd 18px preceding each section name. The marquee fills 100% width and scrolls horizontally. No buttons, no borders, no hover states.

3. Create a playlist track row: black background, 40px vertical gap between rows. Track title in RomieLigatures 65px white left-aligned, with a parenthetical subtitle like (BOMBING WAR OST) in LifeLTStd 18px on the same line. Duration timestamp in LifeLTStd 18px right-aligned. No background fill, no row border — rows are separated by spacing alone.

4. Create a film poster grid: 6 equal columns, 0px gap, black page background. Each cell contains a grayscale poster image filling 100% of the cell, wrapped in a 1px solid white border. No captions, no titles, no padding inside the frame. The white borders between adjacent images merge into a continuous grid lattice.

5. Create a section category eyebrow: LifeLTStd 18px, white, uppercase, left-aligned, positioned 15px above a section title. Content is a taxonomy prefix like "B.O." or "HABILLAGES" with intentional periods acting as visual rhythm devices. No bold, no color, no border.

## Similar Brands

- **Saint Laurent (ysl.com)** — Same absolute black-and-white discipline with oversized serif display type and zero decorative color — both treat typography as the sole brand expression
- **Celine (celine.com)** — Identical editorial restraint: pure monochrome, hairline dividers, serif typefaces, and large negative space framing type-as-art
- **S Moda (El País weekend magazine)** — Same high-contrast typographic masthead approach with custom ligature-rich display faces on a black field
- **Sleek Magazine (sleek-mag.com)** — Same white-on-black editorial layout with marquee-style repeated text bands and grayscale content grids

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-obsidian: #000000;
  --color-bone: #ffffff;

  /* Typography — Font Families */
  --font-romieligatures-regular: 'RomieLigatures-Regular', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-lifeltstd-roman: 'LifeLTStd-Roman', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 18px;
  --leading-caption: 1;
  --text-heading-sm: 65px;
  --leading-heading-sm: 0.9;
  --text-display: 167px;
  --leading-display: 0.73;

  /* Typography — Weights */
  --font-weight-regular: 400;

  /* Spacing */
  --spacing-unit: 8px;
  --spacing-5: 5px;
  --spacing-10: 10px;
  --spacing-15: 15px;
  --spacing-20: 20px;
  --spacing-40: 40px;
  --spacing-62: 62px;

  /* Layout */
  --section-gap: 40px;
  --card-padding: 15px;
  --element-gap: 15px;

  /* Named Radii */
  --radius-tags: 0px;
  --radius-cards: 0px;
  --radius-inputs: 0px;
  --radius-buttons: 0px;

  /* Surfaces */
  --surface-obsidian-canvas: #000000;
  --surface-bone-image-frame: #ffffff;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-obsidian: #000000;
  --color-bone: #ffffff;

  /* Typography */
  --font-romieligatures-regular: 'RomieLigatures-Regular', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-lifeltstd-roman: 'LifeLTStd-Roman', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 18px;
  --leading-caption: 1;
  --text-heading-sm: 65px;
  --leading-heading-sm: 0.9;
  --text-display: 167px;
  --leading-display: 0.73;

  /* Spacing */
  --spacing-5: 5px;
  --spacing-10: 10px;
  --spacing-15: 15px;
  --spacing-20: 20px;
  --spacing-40: 40px;
  --spacing-62: 62px;
}
```
