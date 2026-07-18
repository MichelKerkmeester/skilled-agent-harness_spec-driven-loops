# Aaron Poe & Co — Style Reference
> Quiet white gallery — coral pink whispers float in vast considered silence, framed only by pill-shaped nav and tightly-tracked type.

**Theme:** light

Aaron Poe & Co operates as a curator's white room — a creative director's portfolio that strips interface to typography, whitespace, and a single accent. The canvas is pure white; the type stack pairs Geist (tightly tracked, negative letter-spacing) with system fonts for body copy; and a warm coral pink (#ea587d) surfaces only on heading text and hairline borders, never as a filled button. Components feel like gallery placards: a floating pill-shaped nav, centered bio blocks, and subtle 1px inset borders replacing the need for drop shadows. The rhythm is editorial — vast negative space punctuated by compressed, confident type and one whisper of color.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Coral Rose | `#ea587d` | `--color-coral-rose` | Accent for heading text, hairline borders, and active-state markers — the single chromatic signal in an otherwise achromatic system |
| Pure White | `#ffffff` | `--color-pure-white` | Page canvas, card surfaces, and inverted backgrounds |
| Cloud | `#f2f2f2` | `--color-cloud` | Pill nav background, subtle surface elevation, and inset border shadows |
| Bone | `#d9d8d4` | `--color-bone` | Warm-toned secondary surface tint for alternating bands |
| Char | `#282828` | `--color-char` | Primary text, body copy, and most interface strokes |
| Ink | `#121212` | `--color-ink` | Heavier headings, body text, and prominent borders |
| Black | `#000000` | `--color-black` | Maximum-emphasis text, logo wordmark, and strong border lines |
| Fog | `#b3b3b3` | `--color-fog` | Muted helper text and disabled-state strokes |
| Mist | `#cccccc` | `--color-mist` | Lowest-emphasis borders and decorative dividers |

## Tokens — Typography

### -apple-system — System-font fallback for body text and rendering across platforms. Used wherever native OS fonts provide a reliable, performance-optimized default at body size. · `--font-apple-system`
- **Substitute:** BlinkMacSystemFont, Segoe UI, Roboto, sans-serif
- **Weights:** 400
- **Sizes:** 16px
- **Line height:** 1.00
- **OpenType features:** `"dlig" 0, "hlig" 0, "liga" 0, "rlig" 0, "smcp" 0`
- **Role:** System-font fallback for body text and rendering across platforms. Used wherever native OS fonts provide a reliable, performance-optimized default at body size.

### Geist — Primary display and UI typeface. The 300 weight at micro sizes (8–10px) creates whisper-quiet labels; the negative letter-spacing (-0.056em at 8px, -0.037em at 10px) tightens small type into dense, confident blocks. 400 at 16–18px serves body and subheadings with -0.025em to -0.011em tracking. · `--font-geist`
- **Substitute:** Inter, Satoshi, General Sans
- **Weights:** 300, 400, 500
- **Sizes:** 8px, 10px, 16px, 18px
- **Line height:** 1.00, 1.17, 1.38, 2.67
- **Letter spacing:** -0.056em at 8px, -0.037em at 10px, -0.025em at 16px, -0.011em at 18px
- **OpenType features:** `"ss02", "lnum"`
- **Role:** Primary display and UI typeface. The 300 weight at micro sizes (8–10px) creates whisper-quiet labels; the negative letter-spacing (-0.056em at 8px, -0.037em at 10px) tightens small type into dense, confident blocks. 400 at 16–18px serves body and subheadings with -0.025em to -0.011em tracking.

### wtqc (custom display) — Reserved for prominent display headings (30px, 1.07 line-height, -0.033em tracking) and compact labels (12px, 1.33 line-height). The tight 1.07 line-height on the 30px size gives headings a condensed, editorial feel. · `--font-wtqc-custom-display`
- **Substitute:** Geist, Inter
- **Weights:** 500
- **Sizes:** 12px, 30px
- **Line height:** 1.07, 1.33
- **Letter spacing:** -0.033em at both sizes
- **OpenType features:** `"lnum"`
- **Role:** Reserved for prominent display headings (30px, 1.07 line-height, -0.033em tracking) and compact labels (12px, 1.33 line-height). The tight 1.07 line-height on the 30px size gives headings a condensed, editorial feel.

### custom_166638 — custom_166638 — detected in extracted data but not described by AI · `--font-custom166638`
- **Weights:** 300
- **Sizes:** 8px
- **Line height:** 1.5
- **OpenType features:** `"dlig" 0, "hlig" 0, "liga" 0, "rlig" 0, "smcp" 0`
- **Role:** custom_166638 — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption-sm | 10px | 1.17 | -0.37px | `--text-caption-sm` |
| body | 16px | 1.38 | -0.4px | `--text-body` |
| subheading | 18px | 2.67 | -0.2px | `--text-subheading` |
| heading | 30px | 1.07 | -0.99px | `--text-heading` |

## Tokens — Spacing & Shapes

**Density:** comfortable

### Border Radius

| Element | Value |
|---------|-------|
| cards | 4px |
| inputs | 4px |
| buttons | 4px |
| pillNav | 24px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| subtle | `rgb(242, 242, 242) 0px 0px 0px 1px inset` | `--shadow-subtle` |

### Layout

- **Page max-width:** 720px
- **Section gap:** 120px
- **Card padding:** 24px
- **Element gap:** 16px

## Components

### Wordmark Logo
**Role:** Brand identity in the top-left corner

Bold text-only 'aaronpoe' mark in #000000 or #282828, set at approximately 18–20px with tight tracking. No icon, no symbol — the name IS the brand. Positioned flush-left with generous left margin.

### Pill Navigation Bar
**Role:** Primary site navigation

Floating horizontal pill centered at the top of the page. Background #f2f2f2, border-radius 24px (fully pill-shaped), padding approximately 8px 8px. Contains three nav items separated by subtle spacing. The pill sits on the white canvas with no shadow — the color difference and rounded form do all the work.

### Nav Item — Default
**Role:** Inactive navigation link

Text label in #282828 at 12–14px, weight 400, letter-spacing near zero. No background fill, no border. Padding approximately 8px 16px.

### Nav Item — Active (with dot indicator)
**Role:** Current page indicator in the pill nav

Identical text styling to default nav items, prefixed with a small coral pink dot (#ea587d) at approximately 6px diameter. The dot is the only active-state signal — no bold weight change, no background shift, no underline.

### Bio Text Block
**Role:** Centered hero content — the creator's statement

Centered paragraph block at max-width ~520–640px, set in system or Geist 16–18px weight 400 in #282828, line-height 1.38–1.5. Two paragraphs separated by one blank line. No background, no border, no decoration — pure typography floating in white space.

### Section Heading with Coral Border
**Role:** Content section titles and category labels

Text in coral pink (#ea587d), potentially with a coral hairline border-bottom (1px solid #ea587d). The pink heading is the primary chromatic event in the system — it draws the eye without filling space. Size 24–30px, weight 300–500.

### Ghost Button (Start a Project)
**Role:** Contact / conversion action in the nav

Text-only or hairline-bordered button in the pill nav. Text at 12–14px weight 400 in #282828. No background fill, no border in default state. On hover, optionally a #f2f2f2 background or 1px #282828 border.

### Hairline Card
**Role:** Content container for case studies, project tiles, or grouped content

White surface (#ffffff) with 1px solid border in #e5e5e5 or #cccccc, border-radius 4px, padding 24px. No drop shadow — the 1px border defines the edge. May optionally use the inset shadow technique (box-shadow: rgb(242,242,242) 0px 0px 0px 1px inset) for a hairline that matches the cloud surface color.

### Inset Border Divider
**Role:** Ultra-subtle section separation without visible lines

A 1px inset shadow using #f2f2f2 (rgb(242,242,242)) creates a barely-perceptible edge. Used when a physical border would be too heavy but some surface definition is needed.

### Project Tile
**Role:** Portfolio work entry — image or text-based

Larger card variant with border-radius 4px, 1px border, generous internal padding (32–48px). Likely contains a project title in Geist, optional thumbnail, and a coral-pink category label or hairline accent.

## Do's and Don'ts

### Do
- Use #ea587d only on heading text, hairline borders, and the active-nav dot — never as a filled button or background
- Set all headings in Geist or wtqc with negative letter-spacing (-0.033em to -0.056em depending on size) to achieve the compressed editorial feel
- Use 24px border-radius for the pill navigation and 4px for all cards and buttons
- Default to max-width 720px for centered text blocks; let whitespace do the layout work
- Separate cards and sections with 1px solid borders in #cccccc or #e5e5e5 — never with drop shadows
- Use #f2f2f2 as the surface tint for floating elements like the pill nav
- Set body text at 16–18px in #282828 with 1.38–1.5 line-height for comfortable reading

### Don't
- Do not add drop shadows to cards, buttons, or navigation — the system is intentionally flat
- Do not use #ea587d as a button background fill — the accent only appears on headings and borders
- Do not use large border-radii on cards — keep them at 4px; only the pill nav gets 24px
- Do not introduce new chromatic colors — the system is deliberately monochrome with one pink accent
- Do not use positive letter-spacing — all text tracks tight (negative values) to feel compressed and confident
- Do not fill the page with imagery or illustrations — let typography and whitespace carry the composition
- Do not use dark mode as the default theme — white canvas is the signature; dark (#121212) is reserved for inverted sections only

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Canvas | `#ffffff` | Primary page background — the infinite white wall |
| 2 | Pill Surface | `#f2f2f2` | Navigation pill background and subtle card elevation |
| 3 | Warm Band | `#d9d8d4` | Occasional warm-toned section divider or band |
| 4 | Inverted | `#121212` | Dark-mode sections or inverted text blocks |

## Elevation

- **All surfaces:** `rgb(242, 242, 242) 0px 0px 0px 1px inset`

## Imagery

No photography, illustration, or product imagery detected. The site is pure typography and whitespace — the creator's name, bio text, and navigation are the only visual content. Any portfolio work would be presented as text-based case study entries within hairline cards, not as image galleries. This text-only approach reinforces the editorial, gallery-curated personality.

## Layout

Page-level layout is centered and max-width contained (approximately 720px for text content). The top of the page features a split header: the wordmark logo flush-left, the pill navigation floating centered. Below the header, vast white space leads to a centered bio text block that sits in the upper-middle of the viewport. The rhythm is vertical and unhurried — sections separated by 100–120px of whitespace, with no visible dividers or alternating color bands. Navigation is minimal (a single pill nav, no sidebar, no mega-menu). The overall density is sparse — the page is approximately 80% white space, making the centered type feel like a gallery placard on a white wall.

## Agent Prompt Guide

## Quick Color Reference
- text: #282828 (body) / #000000 (logo/emphasis) / #121212 (headings)
- background: #ffffff (canvas) / #f2f2f2 (pill nav, subtle surfaces)
- border: #cccccc (hairlines) / #e5e5e5 (card edges)
- accent: #ea587d (headings, active dot, accent borders only — never fills)
- muted text: #b3b3b3
- primary action: no distinct CTA color

## Example Component Prompts

1. **Pill Navigation Bar**: Centered floating nav at top of page. Background #f2f2f2, border-radius 24px, padding 8px 8px, height ~40px. Contains 3 items spaced ~16px apart. Sits on #ffffff canvas with no shadow. Items at 12px Geist weight 400, #282828, letter-spacing -0.4px.

2. **Bio Text Block**: Centered paragraph block, max-width 560px, text-align center. Two paragraphs in Geist 18px weight 400, #282828, line-height 2.67 (the generous value creates breathing room between lines). No background, no border. Vertically positioned ~200px from top of viewport.

3. **Section Heading**: Text 'Selected Work' in coral pink #ea587d, Geist 30px weight 500, letter-spacing -0.99px, line-height 1.07. Optionally with a 1px solid #ea587d border-bottom, 24px below the text.

4. **Hairline Card**: White surface #ffffff, border 1px solid #e5e5e5, border-radius 4px, padding 24px. Contains a project title in Geist 16px weight 500 #121212, and a short description in Geist 14px weight 400 #282828. No drop shadow.

5. **Active Nav Item with Dot**: Same styling as default nav item (Geist 12px weight 400 #282828), but prefixed with a 6px diameter circle in #ea587d, positioned 8px to the left of the text with 2px gap.

## Type Philosophy

The system uses negative letter-spacing aggressively at every size, with tighter tracking on display sizes (-0.056em at 8px, -0.033em at 30px) and slightly looser tracking at body size (-0.025em to -0.011em at 16–18px). This creates a voice that feels compressed, editorial, and confident — the opposite of airy or breathy typography. Font feature settings "ss02" and "lnum" are enabled on Geist, activating stylistic set 02 and lining figures for consistent numerical alignment. The 2.67 line-height at 18px body is unusual and deliberate — it creates generous vertical rhythm between lines, making the bio text feel meditative rather than dense.

## Similar Brands

- **Manual (cerealmag.com/manual)** — Same editorial white-space approach with centered text blocks, hairline borders, and almost no imagery — relies on typography and whitespace as the design
- **It's Nice That (itsnicethat.com)** — Gallery-curated white canvas with pill-shaped navigation, restrained color palette, and editorial typography with tight tracking
- **Pentagram (pentagram.com)** — Creative agency portfolio using pure white backgrounds, single accent color moments, and text-forward project tiles within hairline-bordered cards
- **Sam Soffes (soff.es)** — Minimal personal site with system font typography, pill-shaped nav, and one accent color used sparingly on headings and links
- **Are.na (are.na)** — Generous white space, 4px card radii, 1px hairline borders replacing shadows, and a single warm accent against an otherwise achromatic palette

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-coral-rose: #ea587d;
  --color-pure-white: #ffffff;
  --color-cloud: #f2f2f2;
  --color-bone: #d9d8d4;
  --color-char: #282828;
  --color-ink: #121212;
  --color-black: #000000;
  --color-fog: #b3b3b3;
  --color-mist: #cccccc;

  /* Typography — Font Families */
  --font-apple-system: '-apple-system', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-geist: 'Geist', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-wtqc-custom-display: 'wtqc (custom display)', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-custom166638: 'custom_166638', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption-sm: 10px;
  --leading-caption-sm: 1.17;
  --tracking-caption-sm: -0.37px;
  --text-body: 16px;
  --leading-body: 1.38;
  --tracking-body: -0.4px;
  --text-subheading: 18px;
  --leading-subheading: 2.67;
  --tracking-subheading: -0.2px;
  --text-heading: 30px;
  --leading-heading: 1.07;
  --tracking-heading: -0.99px;

  /* Typography — Weights */
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-medium: 500;

  /* Layout */
  --page-max-width: 720px;
  --section-gap: 120px;
  --card-padding: 24px;
  --element-gap: 16px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 10px;
  --radius-2xl: 17px;
  --radius-3xl: 24px;
  --radius-full: 90px;

  /* Named Radii */
  --radius-cards: 4px;
  --radius-inputs: 4px;
  --radius-buttons: 4px;
  --radius-pillnav: 24px;

  /* Shadows */
  --shadow-subtle: rgb(242, 242, 242) 0px 0px 0px 1px inset;

  /* Surfaces */
  --surface-canvas: #ffffff;
  --surface-pill-surface: #f2f2f2;
  --surface-warm-band: #d9d8d4;
  --surface-inverted: #121212;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-coral-rose: #ea587d;
  --color-pure-white: #ffffff;
  --color-cloud: #f2f2f2;
  --color-bone: #d9d8d4;
  --color-char: #282828;
  --color-ink: #121212;
  --color-black: #000000;
  --color-fog: #b3b3b3;
  --color-mist: #cccccc;

  /* Typography */
  --font-apple-system: '-apple-system', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-geist: 'Geist', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-wtqc-custom-display: 'wtqc (custom display)', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-custom166638: 'custom_166638', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption-sm: 10px;
  --leading-caption-sm: 1.17;
  --tracking-caption-sm: -0.37px;
  --text-body: 16px;
  --leading-body: 1.38;
  --tracking-body: -0.4px;
  --text-subheading: 18px;
  --leading-subheading: 2.67;
  --tracking-subheading: -0.2px;
  --text-heading: 30px;
  --leading-heading: 1.07;
  --tracking-heading: -0.99px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 10px;
  --radius-2xl: 17px;
  --radius-3xl: 24px;
  --radius-full: 90px;

  /* Shadows */
  --shadow-subtle: rgb(242, 242, 242) 0px 0px 0px 1px inset;
}
```
