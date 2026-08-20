# Redis Agency — Style Reference
> After-hours editorial atelier — a pitch-black gallery where serif type and a single red radish do all the brand work.

**Theme:** dark

Redis Agency is a darkroom editorial system: a pitch-black canvas where massive Times New Roman display type and a single warm coral accent do all the talking. The visual language borrows from fashion magazine spreads and surrealist art direction — surreal food photography, organic green botanical forms, oversized serif headlines that feel cropped and overlapping rather than neatly typeset. Body and UI copy sit in a clean humanist sans (Suisse Intl) at modest sizes, which makes the display serif feel even more theatrical. The page stays nearly monochrome — black canvas, white type, a mid-gray for secondary text and hairline borders, and a coral red (#eb516d) that acts like a single brushstroke across an otherwise austere composition. Components are minimal: pill-shaped buttons, hairline borders, generous whitespace. Everything feels curated rather than generated — this is brand craft, not a SaaS dashboard.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Bone White | `#ffffff` | `--color-bone-white` | Primary text, pill button outlines, card outlines on dark canvas — high-contrast foreground against the black field |
| Smoke | `#808080` | `--color-smoke` | Secondary text, hairline borders, muted UI strokes — the mid-gray that softens without disappearing |
| Obsidian | `#000000` | `--color-obsidian` | Page canvas and true-black surface — the dominant ground that makes everything else float |
| Graphite | `#333333` | `--color-graphite` | Deep divider borders, near-invisible structural lines between dark surfaces |
| Radish Bloom | `#eb516d` | `--color-radish-bloom` | Single chromatic accent — barcode panel surface, red-punctuation moments; warm coral against the black field functions like a magazine pull-quote, used sparingly as the only saturated color in the UI |

## Tokens — Typography

### Times New Roman — Display and heading serif — set at 90px for the hero wordmark and 32px for secondary headlines; uses the system Times rather than a contemporary serif, which is the anti-trend move that gives the brand its archival-editorial feel. The tight 0.82 line-height at 90px lets letters touch and overlap, creating a cropped magazine-spread effect. · `--font-times-new-roman`
- **Substitute:** PP Editorial New, EB Garamond, or Playfair Display
- **Weights:** 400
- **Sizes:** 32px, 90px
- **Line height:** 0.82, 1.05
- **Letter spacing:** -0.0100em
- **Role:** Display and heading serif — set at 90px for the hero wordmark and 32px for secondary headlines; uses the system Times rather than a contemporary serif, which is the anti-trend move that gives the brand its archival-editorial feel. The tight 0.82 line-height at 90px lets letters touch and overlap, creating a cropped magazine-spread effect.

### Suisse Intl WebM — Primary UI and body sans — handles body text (14–18px), card content (18–24px), and larger non-serif headings (36–38px). The slightly negative tracking and humanist proportions keep body text dense and confident without competing with the display serif. · `--font-suisse-intl-webm`
- **Substitute:** Inter, Söhne, or Untitled Sans
- **Weights:** 400
- **Sizes:** 14px, 16px, 18px, 24px, 36px, 38px
- **Line height:** 1.16, 1.20, 1.40
- **Letter spacing:** -0.0080em
- **Role:** Primary UI and body sans — handles body text (14–18px), card content (18–24px), and larger non-serif headings (36–38px). The slightly negative tracking and humanist proportions keep body text dense and confident without competing with the display serif.

### Editorial New — Thin label and caption face at 100 weight — used for tiny annotations, breadcrumbs, or credits where extra-light strokes add editorial polish to a small detail · `--font-editorial-new`
- **Substitute:** PP Editorial New Thin, Inter Thin, or GT America Thin
- **Weights:** 100
- **Sizes:** 14px
- **Line height:** 1.20
- **Role:** Thin label and caption face at 100 weight — used for tiny annotations, breadcrumbs, or credits where extra-light strokes add editorial polish to a small detail

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 14px | 1.2 | — | `--text-caption` |
| body | 16px | 1.4 | -0.13px | `--text-body` |
| subheading | 18px | 1.2 | -0.14px | `--text-subheading` |
| heading-sm | 24px | 1.2 | -0.19px | `--text-heading-sm` |
| heading | 36px | 1.16 | -0.29px | `--text-heading` |
| display | 90px | 0.82 | -0.9px | `--text-display` |

## Tokens — Spacing & Shapes

**Density:** spacious

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 7 | 7px | `--spacing-7` |
| 9 | 9px | `--spacing-9` |
| 10 | 10px | `--spacing-10` |
| 13 | 13px | `--spacing-13` |
| 15 | 15px | `--spacing-15` |
| 20 | 20px | `--spacing-20` |
| 22 | 22px | `--spacing-22` |
| 25 | 25px | `--spacing-25` |
| 35 | 35px | `--spacing-35` |
| 40 | 40px | `--spacing-40` |
| 50 | 50px | `--spacing-50` |
| 60 | 60px | `--spacing-60` |
| 70 | 70px | `--spacing-70` |
| 80 | 80px | `--spacing-80` |
| 100 | 100px | `--spacing-100` |
| 120 | 120px | `--spacing-120` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 0px |
| links | 24px |
| pills | 44px |
| buttons | 40px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 70px
- **Card padding:** 25px
- **Element gap:** 22px

## Components

### Display Serif Headline
**Role:** Hero typographic anchor — the wordmark and section openers

Times New Roman at 90px, weight 400, line-height 0.82, letter-spacing -0.0100em (≈ -0.9px). White (#ffffff) on #000000 canvas. Deliberately oversized and tight-tracked so letters touch and overlap, creating a cropped, magazine-spread feeling. Set centered or left-aligned; never constrained by a tight measure.

### Pill Outline Button
**Role:** Primary call-to-action

1px solid #ffffff border, 40px border-radius (fully pill-shaped), #ffffff text on #000000 background. Padding approximately 10px 25px. Suisse Intl WebM 14–16px, weight 400, letter-spacing -0.0080em. No fill — outline only, keeping the surface feeling open and editorial rather than buttony.

### Rounded Asymmetric Link
**Role:** Inline text link within body copy

24px border-radius on the link container (asymmetric, gives a soft-blob shape rather than a true pill), #ffffff text with #ffffff underline or hairline. 20px horizontal padding. Used sparingly inside editorial copy blocks.

### Editorial Body Block
**Role:** Long-form paragraph text and descriptions

Suisse Intl WebM 16–18px, weight 400, line-height 1.4, letter-spacing -0.0080em. White (#ffffff) on black. 22px row-gap between paragraphs, 35–40px margin-bottom between distinct blocks. Tight measure (~60ch) for readability.

### Radish Accent Panel
**Role:** Sole chromatic surface — barcode and signature red moments

Solid #eb516d fill with #ffffff content. Functions as a magazine pull-quote or chapter marker. Sits on the black canvas as the only saturated color in the system; the eye locks onto it immediately.

### Barcode Element
**Role:** Decorative catalog/archival mark

Black-and-white #ffffff barcode on #eb516d accent panel or directly on #000000 canvas. Functions as a branding device — references product packaging and editorial mastheads. Centered with ~20–25px vertical padding around it.

### Hairline Divider
**Role:** Section separator

1px solid #808080 line at full or content width. No padding, no margin — the line does the work. Used between editorial sections rather than boxes or cards.

### Section Heading (Serif Secondary)
**Role:** Sub-section titles in editorial body

Times New Roman 32px, weight 400, line-height 1.05, letter-spacing -0.0100em. White. Centred or left-aligned. Sits above body text to introduce a new editorial beat.

### Sans Subheading
**Role:** UI labels and non-display headers

Suisse Intl WebM 36–38px, weight 400, line-height 1.16. White. Used for card titles, feature names, or any heading that should feel modern rather than editorial.

### Thin Label Caption
**Role:** Tiny annotations, breadcrumb trails, or credits

Editorial New 14px, weight 100, line-height 1.2, normal letter-spacing. White. The extra-light weight gives small details a quiet, typeset quality.

### Surreal Product Hero
**Role:** Primary visual centerpiece

Full-bleed editorial photograph: a single red radish surrounded by organic green plant or liquid forms floating in the black canvas. No border, no container, no rounded corners — the imagery occupies the field directly, breaking across the display type. Treated as artwork, not product UI.

### Ghost Navigation Link
**Role:** Top-level nav and footer links

Suisse Intl WebM 14–16px, weight 400, #ffffff text, no background, no border. 20–25px horizontal spacing between items. No underline by default; subtle hover state only.

## Do's and Don'ts

### Do
- Set the hero wordmark in Times New Roman 90px, line-height 0.82, letter-spacing -0.9px — the tight crop and overlapping letters are the signature
- Use #eb516d Radish Bloom for exactly one surface per screen — a barcode panel, a single badge, or a pull-quote block
- Outline buttons with 1px #ffffff border on 40px radius — never fill them, the ghost surface preserves the editorial openness
- Separate sections with 1px #808080 hairline dividers, not cards or boxes — the dark canvas does the structural work
- Set body copy at 16–18px Suisse Intl WebM, line-height 1.4, letter-spacing -0.0080em
- Allow imagery to overlap display type at the hero — the broken grid is intentional, not a layout bug
- Reserve Times New Roman for sizes ≥ 32px; below that it stops feeling editorial and starts feeling like a fallback

### Don't
- Do not fill buttons with #eb516d or any saturated color — buttons stay outlined in #ffffff, red is reserved for surfaces
- Do not use box-shadows or any drop-shadow elevation — the system relies on color contrast and hairline borders, not depth
- Do not introduce a second chromatic color into the UI palette — greens, blues, or any hue beyond #eb516d breaks the discipline
- Do not set Times New Roman below 32px — it loses its editorial authority and reads as a system default
- Do not use card containers with rounded corners and backgrounds for content blocks — content floats on the black canvas, separated by whitespace and hairlines
- Do not center body paragraphs — left-align editorial copy with a 600px measure for readability
- Do not use light-mode styling (white canvas, dark text) — the darkroom canvas is the system's defining surface

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Obsidian Canvas | `#000000` | Full-bleed page background — the darkroom field |
| 1 | Radish Panel | `#eb516d` | Accent surface for barcode and signature moments — the only chromatic surface in the system |

## Elevation

No shadows. The dark canvas and high-contrast white type do the work of separation. Hairline #808080 borders are the only structural lines; cards and surfaces are defined by negative space, not elevation.

## Imagery

Surreal editorial product photography — a single red radish suspended in the void, surrounded by organic green botanical or liquid forms that feel 3D-rendered and hand-shaped. The aesthetic is fashion-meets-archival: high-contrast, dark-background, tight crop, no lifestyle context. Imagery overlaps display type rather than sitting beside it, breaking the grid. The green plant matter is saturated and hyperreal; the radish is a single saturated red moment. Overall: image-heavy at the hero, then becomes text-dominant as the user scrolls. Imagery is decorative atmosphere, not explanatory content.

## Layout

Full-bleed dark canvas with no visible page padding at the hero — the radish, green forms, and oversized 'Redis Agency' serif type all share the same black field and overlap. Content begins centered or left-aligned with generous whitespace (70px section gaps). Max-width ~1200px for body content; hero extends full-bleed. The page flows as an editorial scroll: hero typographic moment → surreal visual → centered text block on black → accent barcode panel → secondary hero → more editorial copy. No card grids, no pricing tables, no feature matrices — this is a portfolio/spread layout, not a SaaS page. Navigation is a minimal top bar with ghost text links; no sticky behavior, no mega-menu.

## Agent Prompt Guide

## Quick Color Reference
- background: #000000 (Obsidian)
- text: #ffffff (Bone White)
- secondary text: #808080 (Smoke)
- border: #808080 (Smoke hairline)
- accent surface: #eb516d (Radish Bloom)
- primary action: #ffffff (filled action)

## 3-5 Example Component Prompts

1. **Display Hero Headline**: 'Redis Agency' in Times New Roman, 90px, weight 400, line-height 0.82, letter-spacing -0.9px, color #ffffff on #000000 canvas. Centered. Letters should touch and overlap — tight tracking is intentional, do not increase.

2. **Outlined Pill Button**: 1px solid #ffffff border, 40px border-radius, padding 10px 25px, text 'Подробнее' in Suisse Intl WebM 16px weight 400 letter-spacing -0.13px color #ffffff on #000000 background. No fill, no shadow.

3. **Radish Accent Panel**: Solid #eb516d background, 0px radius, full content-width, containing a centered #ffffff barcode element and 24px Suisse Intl WebM white caption beneath. Padding 40px vertical.

4. **Editorial Body Block**: Three paragraphs of body copy in Suisse Intl WebM 18px weight 400 line-height 1.4 letter-spacing -0.14px, color #ffffff on #000000. 22px gap between paragraphs, 70px margin above the block. Measure constrained to ~600px wide and left-aligned.

5. **Thin Label Caption**: Small label 'Agency / 2024' in Editorial New 14px weight 100 line-height 1.2 color #ffffff, sitting above a larger heading with 15px vertical spacing.

## Editorial Typography Rules

The display serif and the body sans are not interchangeable — they serve different registers. Times New Roman is reserved for moments that should feel archival, monumental, or cropped-from-a-magazine (hero wordmark, section openers, pull-quotes). Suisse Intl WebM handles everything that should feel like working design (body copy, UI labels, card titles, navigation). Never set Times New Roman below 32px — it loses its editorial authority and just looks like a system font fallback. Never set Suisse Intl WebM above 38px for body content — at that size the humanist sans starts competing with the display serif for attention.

## Color Discipline

The system has exactly one chromatic color: #eb516d Radish Bloom. It must remain rare — one panel, one moment, one barcode per page. Using it twice dilutes it; using it three times makes it a theme rather than an accent. Greens from the organic photography are NOT part of the UI palette — they are decorative imagery and should never appear as button fills, link colors, or icon strokes. The neutral stack (#ffffff, #808080, #333333, #000000) carries 95% of the interface.

## Similar Brands

- **Buck (buck.co)** — Same dark-canvas + single accent editorial approach with massive serif display type and surreal 3D imagery
- **Locomotive (locomotive.ca)** — Editorial layout with overlapping display type, full-bleed photography, and near-monochrome palette punctuated by one brand color
- **Resn (resn.co.nz)** — Surreal digital art direction with dark canvas, oversized type, and imagery that breaks the grid
- **Pentagram (pentagram.com)** — Agency portfolio that treats each project as an editorial spread rather than a SaaS landing page
- **Gunner (gunner.co)** — Minimalist dark agency site with hairline borders, ghost outlined buttons, and let the work speak

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-bone-white: #ffffff;
  --color-smoke: #808080;
  --color-obsidian: #000000;
  --color-graphite: #333333;
  --color-radish-bloom: #eb516d;

  /* Typography — Font Families */
  --font-times-new-roman: 'Times New Roman', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-suisse-intl-webm: 'Suisse Intl WebM', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-editorial-new: 'Editorial New', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.2;
  --text-body: 16px;
  --leading-body: 1.4;
  --tracking-body: -0.13px;
  --text-subheading: 18px;
  --leading-subheading: 1.2;
  --tracking-subheading: -0.14px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -0.19px;
  --text-heading: 36px;
  --leading-heading: 1.16;
  --tracking-heading: -0.29px;
  --text-display: 90px;
  --leading-display: 0.82;
  --tracking-display: -0.9px;

  /* Typography — Weights */
  --font-weight-thin: 100;
  --font-weight-regular: 400;

  /* Spacing */
  --spacing-7: 7px;
  --spacing-9: 9px;
  --spacing-10: 10px;
  --spacing-13: 13px;
  --spacing-15: 15px;
  --spacing-20: 20px;
  --spacing-22: 22px;
  --spacing-25: 25px;
  --spacing-35: 35px;
  --spacing-40: 40px;
  --spacing-50: 50px;
  --spacing-60: 60px;
  --spacing-70: 70px;
  --spacing-80: 80px;
  --spacing-100: 100px;
  --spacing-120: 120px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 70px;
  --card-padding: 25px;
  --element-gap: 22px;

  /* Border Radius */
  --radius-3xl: 24px;
  --radius-3xl-2: 40px;
  --radius-3xl-3: 44.0001px;

  /* Named Radii */
  --radius-cards: 0px;
  --radius-links: 24px;
  --radius-pills: 44px;
  --radius-buttons: 40px;

  /* Surfaces */
  --surface-obsidian-canvas: #000000;
  --surface-radish-panel: #eb516d;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-bone-white: #ffffff;
  --color-smoke: #808080;
  --color-obsidian: #000000;
  --color-graphite: #333333;
  --color-radish-bloom: #eb516d;

  /* Typography */
  --font-times-new-roman: 'Times New Roman', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-suisse-intl-webm: 'Suisse Intl WebM', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-editorial-new: 'Editorial New', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.2;
  --text-body: 16px;
  --leading-body: 1.4;
  --tracking-body: -0.13px;
  --text-subheading: 18px;
  --leading-subheading: 1.2;
  --tracking-subheading: -0.14px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -0.19px;
  --text-heading: 36px;
  --leading-heading: 1.16;
  --tracking-heading: -0.29px;
  --text-display: 90px;
  --leading-display: 0.82;
  --tracking-display: -0.9px;

  /* Spacing */
  --spacing-7: 7px;
  --spacing-9: 9px;
  --spacing-10: 10px;
  --spacing-13: 13px;
  --spacing-15: 15px;
  --spacing-20: 20px;
  --spacing-22: 22px;
  --spacing-25: 25px;
  --spacing-35: 35px;
  --spacing-40: 40px;
  --spacing-50: 50px;
  --spacing-60: 60px;
  --spacing-70: 70px;
  --spacing-80: 80px;
  --spacing-100: 100px;
  --spacing-120: 120px;

  /* Border Radius */
  --radius-3xl: 24px;
  --radius-3xl-2: 40px;
  --radius-3xl-3: 44.0001px;
}
```
