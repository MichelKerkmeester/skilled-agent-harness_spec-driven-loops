# Acolorbright — Style Reference
> White gallery walls around black-ink editorial type

**Theme:** light

AColorBright is a typographic monolith — an achromatic editorial canvas where a single custom serif/grotesque hybrid (RiformaLLWeb) does all the visual work. Every surface is paper-white or near-black; color is rejected entirely (0% colorfulness), so hierarchy comes from type size, weight contrast, and generous negative space. The signature motif is the numbered black circle preceding each section heading, creating a serial-chapter rhythm across what would otherwise be a long-form scroll. Components are borderless and shadowless — cards are defined by typography and 12px image radii, buttons are flat black-on-white rectangles with 8px corners, and dividers are implied by whitespace rather than hairlines. Imagery is the only chromatic interruption: full-bleed product photography sits inside rounded frames as proof of craft, not decoration.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Ink Black | `#1a1a1a` | `--color-ink-black` | Primary text, all structural borders (cards, lists, nav containers), heading borders, icon strokes — the dominant ink tone chosen over pure #000 for slightly softer edge contrast against white |
| Charcoal | `#262626` | `--color-charcoal` | Navigation backgrounds, filled button surfaces — the slightly lighter fill that keeps dark UI elements from feeling dead-flat against text |
| Graphite | `#666666` | `--color-graphite` | Body copy, secondary text, link borders, surface tints in data regions — the mid-neutral that carries paragraph-level content without competing with headings |
| Ash | `#999999` | `--color-ash` | Medium-contrast borders, control outlines, and structural separators. |
| Fog | `#e6e6e6` | `--color-fog` | Hairline borders, dividers, input outlines, and card edges on light surfaces. Do not promote it to the primary CTA color |
| Mist | `#f2f2f2` | `--color-mist` | Alternate row background in lists, the only surface tint lighter than white — used sparingly to band repeating entries |
| Paper | `#ffffff` | `--color-paper` | Page background, card surfaces, button text on dark fills, nav foreground — the default canvas everything else sits on |
| Pure Black | `#000000` | `--color-pure-black` | SVG icon fills, body accents, exact-black moments where maximum contrast is intentional (numbered section badges) |

## Tokens — Typography

### RiformaLLWeb — The sole typeface across all roles — body, headings, nav, buttons, hero, lists. The custom font is a neo-grotesque with subtle humanist warmth, used at 400 weight only. The signature choice is deploying 64px and 40px for headings and hero at a single light weight rather than escalating to 700; authority comes from size and tight tracking, not boldness. Letter-spacing is uniformly -0.01em everywhere, creating a slightly condensed, editorial feel that tightens as size grows. · `--font-riformallweb`
- **Substitute:** Inter Tight or Söhne at weight 400
- **Weights:** 400
- **Sizes:** 12px, 16px, 18px, 24px, 40px, 64px
- **Line height:** 1.00, 1.10, 1.15, 1.20, 1.25
- **Letter spacing:** -0.01em (uniform across all sizes)
- **OpenType features:** `"liga" 0`
- **Role:** The sole typeface across all roles — body, headings, nav, buttons, hero, lists. The custom font is a neo-grotesque with subtle humanist warmth, used at 400 weight only. The signature choice is deploying 64px and 40px for headings and hero at a single light weight rather than escalating to 700; authority comes from size and tight tracking, not boldness. Letter-spacing is uniformly -0.01em everywhere, creating a slightly condensed, editorial feel that tightens as size grows.

### Arial — System fallback rendered only in 12 button contexts — the rare UI element where the custom font fails to load, ensuring controls remain functional in any environment · `--font-arial`
- **Substitute:** system-ui
- **Weights:** 400
- **Sizes:** 13px
- **Line height:** 1.20
- **Letter spacing:** normal
- **Role:** System fallback rendered only in 12 button contexts — the rare UI element where the custom font fails to load, ensuring controls remain functional in any environment

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.2 | -0.12px | `--text-caption` |
| body-sm | 16px | 1.25 | -0.16px | `--text-body-sm` |
| body | 18px | 1.25 | -0.18px | `--text-body` |
| subheading | 24px | 1.15 | -0.24px | `--text-subheading` |
| heading | 40px | 1.1 | -0.4px | `--text-heading` |
| display | 64px | 1 | -0.64px | `--text-display` |

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
| 64 | 64px | `--spacing-64` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 16px |
| cards | 0px (no card radius — content is borderless) |
| images | 12px |
| buttons | 8px |

### Layout

- **Page max-width:** 1200px
- **Element gap:** 12-16px

## Components

### Numbered Section Heading
**Role:** Primary section identifier — the serial-chapter motif that runs the entire page

A 32px black circle (#000000 fill) containing a white numeral (1–5) in RiformaLLWeb 400 at 18px, followed by an inline H2 at 40px weight 400 #1a1a1a. The circle and heading sit on the same baseline. No padding, no border — the circle is a solid filled badge, not an outline.

### Section Body Paragraph
**Role:** Long-form explanatory text under each numbered heading

RiformaLLWeb 18px weight 400 #666666, line-height 1.25, max-width constrained to roughly 640px so paragraphs sit as a single column. No border, no background, no indent.

### Case Study Card (Image-Forward)
**Role:** Portfolio entry showing client work

Three-column grid card. Image fills 100% width with 12px border-radius and zero padding around it. Below the image: project name in RiformaLLWeb 16px weight 400 #1a1a1a, then a one-line description in 16px #666666. No card border, no shadow, no background fill — the white page is the card surface.

### Brand Identity Tile
**Role:** Visual brand showcase block (used in the 'Shape challenger brands' section)

A full-bleed colored panel — but since the site is achromatic, these panels display client brand artwork (vivid purple, lime green, concert photography) as raw images with 12px radius. The image IS the tile; no frame, no caption chrome above the title/caption that follows.

### Navigation Bar
**Role:** Top-level site navigation

Fixed or top-anchored. Logo 'AColorBright' in RiformaLLWeb 18px weight 400 #1a1a1a, left-aligned. A single hamburger menu icon (three-line glyph) in a 16px-radius white container with a #1a1a1a border, right-aligned. Transparent background — the white page shows through.

### Hero Intro Statement
**Role:** Opening editorial paragraph on the landing page

RiformaLLWeb 40px weight 400 #1a1a1a, line-height 1.10, letter-spacing -0.4px, max-width ~720px, left-aligned. Sits with 256px top padding to create a dramatic white field above. The paragraph functions as the page's thesis statement in oversized body type.

### Filled Dark Button
**Role:** Primary action when one is needed

Background #262626, text #ffffff, RiformaLLWeb 16px weight 400, padding 12px top/bottom and 6px left/right (the unusually tight horizontal padding is signature — buttons read as compact tags), border-radius 8px, no border, no shadow. Appears in nav and footer contexts.

### Outlined Light Button
**Role:** Secondary action variant

Transparent background, border 1px #e6e6e6, text #1a1a1a, RiformaLLWeb 16px weight 400, padding 12px 6px, border-radius 8px. The light border keeps the button visible without adding weight to the page.

### List Row with Alternating Band
**Role:** Repeated content entry (used in structured list sections)

Full-width row, padding 8-16px vertical, background #f2f2f2 on alternating rows to create zebra-striping against the white page. Text in RiformaLLWeb 16px weight 400 #1a1a1a, no row borders — the background shift alone separates entries.

### Project Caption Block
**Role:** Title-plus-description under portfolio imagery

Two text lines, no box. Line 1: project name in RiformaLLWeb 16px #1a1a1a. Line 2: description in RiformaLLWeb 16px #666666. 12px gap between lines. Zero padding, no border, no background.

### Footer Container
**Role:** Page bottom — minimal site closure

White background, 32-64px top margin from the last section, 32px horizontal padding. Content uses 16px #666666 text. No dark inverted block — the footer stays on the same white canvas as the rest of the page.

## Do's and Don'ts

### Do
- Use RiformaLLWeb (or Inter Tight substitute) at weight 400 only — never bold, never light, let size carry hierarchy
- Set the letter-spacing to -0.01em on every text element at every size — the uniform tight tracking is what makes the type feel editorial
- Use the numbered black circle badge (32px, #000000 fill, white numeral) to introduce every primary section — this serial numbering is the page's spine
- Apply 12px border-radius to all imagery and 8px to all buttons; never invert these radii
- Let product photography be the only color in the system — never add accent colors, gradients, or colored UI chrome
- Set section gaps to 64px minimum between chapters, and use 256px for the hero's top padding to create a dramatic white field
- Use #f2f2f2 only for alternating list row bands — never as a card background or panel fill

### Don't
- Do not introduce a brand color or accent hue — the 0% colorfulness is a deliberate creative statement, not a missing token
- Do not use drop shadows, box-shadows, or any blur-based elevation — depth comes from background shifts and radius only
- Do not use font-weight 600 or 700 — all hierarchy must come from size and tracking, not weight
- Do not wrap text in bordered or filled cards — body paragraphs sit directly on the white page with no container
- Do not use anything other than 12px, 16px, 18px, 24px, 40px, and 64px for font sizes — this is the complete type scale
- Do not add iconography beyond the hamburger glyph — the system's visual language is type + photography, not icons
- Do not use #000000 for large text or body copy — reserve pure black for the numbered badges and SVG fills, use #1a1a1a for all readable text

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Page Canvas | `#ffffff` | The default background for the entire site — every section, card, and component sits directly on this surface |
| 1 | Mist Band | `#f2f2f2` | Alternate row striping in lists and any rare tinted panel that needs to step off pure white without introducing color |
| 2 | Charcoal Fill | `#262626` | Inverse surface for filled buttons and any dark UI element that must stand out from the white page |
| 3 | Ink | `#1a1a1a` | Numbered section badges and any pure dark element that needs to read as graphic shape rather than text |

## Elevation

The system is intentionally shadowless. Elevation is communicated through the 12px image radius, background tonal shifts (white → f2f2f2), and typographic scale jumps — never through drop shadows. The only 'depth' is the slight #1a1a1a border on the hamburger menu container, and even that reads as a drawn frame rather than a raised surface. This is a design system that insists on paper-flatness.

## Imagery

Photography-dominant, specifically product and device photography. Treatment: tight crops of phones, laptops, and app screens shown at slight angles on neutral backgrounds (wooden tables, white desks, dark surfaces). Images are large, full-width within their grid cells, with 12px border-radius giving them a subtle softness. Concert and lifestyle photography appears in brand tiles without crops or color treatment — the images arrive at full saturation and the system trusts them. No illustration, no abstract graphics, no 3D renders. Icons are minimal — only a hamburger glyph in the nav. The visual identity is: show the work, let the white space frame it.

## Layout

Max-width ~1200px centered, with 32px horizontal padding at the edges. The page is a single continuous vertical scroll structured as five numbered chapters (1–5), each introduced by the black-circle badge + H2 pattern. Hero is a left-aligned oversized paragraph with 256px top padding, sitting alone in white space before the first chapter. Between chapters: 32-64px vertical gaps with no dividers. The case study sections use a 3-column grid of image-forward cards. The brand showcase section (chapter 3) uses 3 equal-width panels each filled with a single large image. No sidebar, no sticky elements beyond the minimal nav, no mega-menu. Navigation rhythm is: logo left, single hamburger right — nothing else competes.

## Agent Prompt Guide

**Quick Color Reference**
- text (primary): #1a1a1a
- text (body): #666666
- text (muted): #999999
- background: #ffffff
- surface tint: #f2f2f2
- border (structural): #1a1a1a
- border (subtle): #e6e6e6
- dark fill: #262626
- primary action: no distinct CTA color

**Example Component Prompts**
1. Build a numbered section heading: a 32px circle with #000000 fill, white '2' centered in RiformaLLWeb 18px weight 400, followed on the same line by a 40px weight 400 #1a1a1a heading at letter-spacing -0.4px. Sit on a #ffffff page with 64px top margin.

2. Build a case study card: full-width image (phone, laptop, or app screen) with 12px border-radius, no padding around it. Below: project name in 16px weight 400 #1a1a1a, then a 16px #666666 description, 12px gap between lines. Place in a 3-column grid with 32px gaps.

3. Build the hero intro: RiformaLLWeb 40px weight 400 #1a1a1a, line-height 1.10, letter-spacing -0.4px, max-width 720px, left-aligned, with 256px padding-top on a pure #ffffff page. No subhead, no button — text only.

4. Build the navigation bar: 'AColorBright' wordmark in RiformaLLWeb 18px weight 400 #1a1a1a left-aligned, a 40px square white container with 1px #1a1a1a border and 16px radius containing a three-line hamburger glyph right-aligned, 32px horizontal padding, transparent background.

5. Build a list row with banding: full-width row, 8-16px vertical padding, background #f2f2f2 on odd rows and #ffffff on even rows. Text in RiformaLLWeb 16px weight 400 #1a1a1a. No borders, no shadows — the background shift is the only separator.

## Similar Brands

- **Pentagram** — Same editorial single-column studio approach with oversized light-weight display type and zero decorative chrome
- **Manual (design studio)** — Same achromatic portfolio-grid layout where large product imagery inside rounded frames is the only visual event on a white page
- **Locomotive (formerly ueno)** — Same typographic-monolith aesthetic — one custom neo-grotesque at 400 weight, tight tracking, dramatic whitespace, numbered section structure
- **Ramotion** — Same device-photography-forward portfolio with identical 12px image radii and clean white-grid presentation

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-ink-black: #1a1a1a;
  --color-charcoal: #262626;
  --color-graphite: #666666;
  --color-ash: #999999;
  --color-fog: #e6e6e6;
  --color-mist: #f2f2f2;
  --color-paper: #ffffff;
  --color-pure-black: #000000;

  /* Typography — Font Families */
  --font-riformallweb: 'RiformaLLWeb', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.2;
  --tracking-caption: -0.12px;
  --text-body-sm: 16px;
  --leading-body-sm: 1.25;
  --tracking-body-sm: -0.16px;
  --text-body: 18px;
  --leading-body: 1.25;
  --tracking-body: -0.18px;
  --text-subheading: 24px;
  --leading-subheading: 1.15;
  --tracking-subheading: -0.24px;
  --text-heading: 40px;
  --leading-heading: 1.1;
  --tracking-heading: -0.4px;
  --text-display: 64px;
  --leading-display: 1;
  --tracking-display: -0.64px;

  /* Typography — Weights */
  --font-weight-regular: 400;

  /* Spacing */
  --spacing-unit: 8px;
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-64: 64px;

  /* Layout */
  --page-max-width: 1200px;
  --element-gap: 12-16px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;

  /* Named Radii */
  --radius-nav: 16px;
  --radius-cards: 0px (no card radius — content is borderless);
  --radius-images: 12px;
  --radius-buttons: 8px;

  /* Surfaces */
  --surface-page-canvas: #ffffff;
  --surface-mist-band: #f2f2f2;
  --surface-charcoal-fill: #262626;
  --surface-ink: #1a1a1a;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-ink-black: #1a1a1a;
  --color-charcoal: #262626;
  --color-graphite: #666666;
  --color-ash: #999999;
  --color-fog: #e6e6e6;
  --color-mist: #f2f2f2;
  --color-paper: #ffffff;
  --color-pure-black: #000000;

  /* Typography */
  --font-riformallweb: 'RiformaLLWeb', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.2;
  --tracking-caption: -0.12px;
  --text-body-sm: 16px;
  --leading-body-sm: 1.25;
  --tracking-body-sm: -0.16px;
  --text-body: 18px;
  --leading-body: 1.25;
  --tracking-body: -0.18px;
  --text-subheading: 24px;
  --leading-subheading: 1.15;
  --tracking-subheading: -0.24px;
  --text-heading: 40px;
  --leading-heading: 1.1;
  --tracking-heading: -0.4px;
  --text-display: 64px;
  --leading-display: 1;
  --tracking-display: -0.64px;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-64: 64px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
}
```
