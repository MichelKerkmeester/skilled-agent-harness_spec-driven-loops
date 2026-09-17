# Instrument — Style Reference
> Newspaper broadsheet meets brutalist poster

**Theme:** light

Instrument runs a stark monochrome editorial system: white canvas, near-black surfaces, a single mid-gray for secondary voice. Two custom type families carry the entire identity — a geometric sans for everything functional and a refined serif for emotional statements. The page rhythm is built on contrast: edge-to-edge massive wordmark, then a solid black cinematic hero, then breathing white space with serif-led editorial moments. Interactive elements are pill-shaped; content containers use a generous 24px radius. Color is never decorative here — it only signals hierarchy through value, not hue.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Obsidian | `#070708` | `--color-obsidian` | Primary text, all borders, full-bleed dark surfaces, pill-button outlines — the near-black that absorbs everything; choosing 070708 over pure black removes blue-cast and reads warmer on screen |
| Paper | `#ffffff` | `--color-paper` | Page canvas, card surfaces, reverse text on dark blocks, pill-button backgrounds and inverse outlines |
| Ash | `#808080` | `--color-ash` | Secondary labels, muted helper text, inactive filter states, badge borders, meta tags — the only mid-tone voice for tertiary information |

## Tokens — Typography

### Instrument-Sans — The workhorse. One weight (400) handles everything from 11px micro-labels to the 352px edge-to-edge wordmark. Tracking opens dramatically at scale: -0.05em at display, 0 to -0.005em at body, expanding to +0.05em–0.11em on uppercase badges. ss12 stylistic set and ligatures are always on — they define the typeface's character. · `--font-instrument-sans`
- **Substitute:** Inter, Satoshi, General Sans
- **Weights:** 400
- **Sizes:** 11px, 12px, 14px, 15px, 16px, 18px, 19px, 23px, 28px, 36px, 352px
- **Line height:** 0.85 (display), 1.00–1.13 (headlines), 1.22–1.45 (body), 1.56–1.60 (relaxed body)
- **Letter spacing:** -0.05em at 352px; -0.025em at 36px; -0.01em at 28px; -0.005em at 15–16px; +0.05em at 12px uppercase
- **OpenType features:** `"liga" on, "ss12" on`
- **Role:** The workhorse. One weight (400) handles everything from 11px micro-labels to the 352px edge-to-edge wordmark. Tracking opens dramatically at scale: -0.05em at display, 0 to -0.005em at body, expanding to +0.05em–0.11em on uppercase badges. ss12 stylistic set and ligatures are always on — they define the typeface's character.

### Instrument-Serif — Reserved for editorial statement headlines — the 'we are' sentences. One weight, one size, one job. The serif creates an emotional counterpoint to the geometric sans: the page shifts register from confident command (sans) to reflective thought (serif) in a single line. · `--font-instrument-serif`
- **Substitute:** GT Sectra, Tiempos Headline, Source Serif
- **Weights:** 400
- **Sizes:** 64px, 352px
- **Line height:** 1.13
- **Letter spacing:** -0.02em at 64px
- **OpenType features:** `"liga" on, "ss12" on`
- **Role:** Reserved for editorial statement headlines — the 'we are' sentences. One weight, one size, one job. The serif creates an emotional counterpoint to the geometric sans: the page shifts register from confident command (sans) to reflective thought (serif) in a single line.

### Instrument-Serif-Italic — Instrument-Serif-Italic — detected in extracted data but not described by AI · `--font-instrument-serif-italic`
- **Weights:** 400
- **Sizes:** 352px
- **Line height:** 0.85
- **Letter spacing:** -0.05
- **Role:** Instrument-Serif-Italic — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 11px | 1.43 | 0.05px | `--text-caption` |
| body-sm | 14px | 1.45 | -0.005px | `--text-body-sm` |
| body | 16px | 1.43 | -0.005px | `--text-body` |
| body-lg | 19px | 1.45 | -0.005px | `--text-body-lg` |
| subheading | 23px | 1.33 | -0.01px | `--text-subheading` |
| heading | 28px | 1.26 | -0.01px | `--text-heading` |
| heading-lg | 36px | 1.22 | -0.025px | `--text-heading-lg` |
| display-serif | 64px | 1.13 | -0.02px | `--text-display-serif` |
| display | 352px | 0.85 | -0.05px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** compact

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
| 48 | 48px | `--spacing-48` |
| 64 | 64px | `--spacing-64` |
| 96 | 96px | `--spacing-96` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 999px |
| cards | 24px |
| badges | 999px |
| images | 24px |
| inputs | 8px |
| buttons | 999px |

### Layout

- **Page max-width:** 1400px
- **Section gap:** 80px
- **Card padding:** 24px
- **Element gap:** 8px

## Components

### Pill Nav Item
**Role:** Primary navigation links in the top bar

Text label, 12px Instrument-Sans, 0.05em letter-spacing, uppercase. Border: 1px solid #070708 or 1px solid #808080 (inactive). Radius: 999px. Padding: 3px 10px. No background fill on rest state.

### Pill Filter Chip
**Role:** Category filters for case study and press grids

12px Instrument-Sans uppercase, 0.05em tracking. Border: 1px solid #070708 (active) or 1px solid #808080 (inactive). Radius: 999px. Padding: 4px 10px. Active state: filled #070708 background with #ffffff text.

### Outlined Pill Button
**Role:** Secondary call-to-action — 'SEE MORE', contact links

Label at 12px Instrument-Sans, uppercase, 0.05em tracking. Border: 1px solid #070708, 1px radius 999px. Padding: 8px 20px. Background: transparent. No fill on hover — stays outlined. This is the only button style used; no filled CTA variant exists.

### Wordmark Display
**Role:** Brand identifier and page-anchoring display element

Instrument-Sans at 352px, weight 400, line-height 0.85, letter-spacing -0.05em (-17.6px). Renders edge-to-edge, breaking past container gutters. Color: #070708 on light, #ffffff on dark. This is the visual signature — the page is named by it.

### Editorial Statement Headline
**Role:** Mission/positioning sentences — the 'who we are' voice

Instrument-Serif at 64px, weight 400, line-height 1.13, letter-spacing -0.02em. Color: #070708. Italic variant of Instrument-Serif reserved for emphasis words within the same line. Max-width constrained to ~14 words per line for editorial cadence.

### Project Card
**Role:** Case study tile in the 4-column recent work grid

Image with 24px radius, no border, no shadow. Caption block below or overlaying. Padding internal: 24px. Background: #ffffff. Hover state not decorative — content swaps or image changes.

### Press Article Card
**Role:** External press coverage and article links

Image at 24px radius, 8px gap to meta row (PRESS | ARTICLE | 5 MINUTES in 11px uppercase 0.08em tracking). Title at 19–23px Instrument-Sans below image with 16px margin-top. Source name appears as inline link style in #070708.

### Video Play Trigger
**Role:** Hero video launch affordance

Centered on full-bleed dark hero. White triangle (play icon) inside a larger geometric crown/badge mark. No background fill, no button chrome — the mark itself is the control, drawn in #ffffff at ~120px on #070708.

### Hero Banner
**Role:** Full-bleed cinematic dark section after the wordmark

Background: #070708, full viewport width, ~80vh height. Rounded bottom corners at 24px on the white-edge intersection. Contains only the centered play mark. No text, no nav — pure atmosphere.

### Inline Emphasized Phrase
**Role:** Highlighting key words inside long body paragraphs

Regular Instrument-Sans body text (19–23px) with individual words or phrases rendered in a different visual treatment — either Instrument-Serif italic or a lighter weight gray (#808080). Used to add cadence and hierarchy without color.

### Text Input
**Role:** Form fields, newsletter capture

Border: 1px solid #070708, radius 8px (the only sharp-cornered element). Padding: 12px 16px. Placeholder: #808080, 14px Instrument-Sans. No floating labels, no decorative icons.

### Section Divider
**Role:** Visual separation between content blocks

1px solid #070708 horizontal rule spanning the content width. No spacing above/below — sections breathe through whitespace alone, never through dividers except as hard section breaks.

### Meta Tag
**Role:** Small uppercase labels — category, read time, type

11px Instrument-Sans, uppercase, letter-spacing 0.08em. Color: #070708 or #808080. No background, no border — pure type. Appears above titles, beside timestamps, as inline metadata.

## Do's and Don'ts

### Do
- Use Instrument-Sans at 400 weight for all functional UI — never introduce bold weights, the system is a single-weight machine
- Apply 999px radius to every interactive element: nav, buttons, filter chips, badges — pills are the only interactive shape
- Reserve Instrument-Serif exclusively for the 64px editorial statement; it must never appear in navigation, labels, or body
- Render the wordmark at 352px with line-height 0.85 and -0.05em tracking so it bleeds edge-to-edge past container gutters
- Set all small uppercase labels (badges, meta, nav) between 11–12px with tracking of 0.05em–0.11em — they should feel like printed captions
- Use #070708 (not #000000) for all dark surfaces and text — the subtle warmth keeps the system from feeling digital-sterile
- Invert to #070708 full-bleed for hero or feature blocks, then return to #ffffff — the page breathes in binary value shifts

### Don't
- Do not introduce any saturated color — the system is 0% colorful; adding hue breaks the editorial discipline
- Do not use filled button backgrounds as primary actions; all CTAs are outlined pills or text links
- Do not use shadow or drop-shadow effects — depth comes from surface inversion (#070708 vs #ffffff), never from blur
- Do not set body text below 14px or above 23px; the range between body-sm and subheading is the work zone
- Do not round cards, images, or content blocks to anything other than 24px; mixing radii breaks the two-shape system (pill + 24px)
- Do not stack the serif and the large display sans on the same viewport; the wordmark claims its screen alone
- Do not use #000000 or pure white — the warmth of #070708 and slight cream of #ffffff are the system's actual voice

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Paper | `#ffffff` | Page canvas — the default body background |
| 1 | Obsidian | `#070708` | Full-bleed hero and feature blocks — cinematic inversion for high-contrast moments |

## Imagery

Imagery is curated and editorial — high-quality product shots, dark moody photography, vibrant campaign stills — all contained in 24px-radius cards within a 4-column grid. The hero is pure black with a single white icon mark, no photography. No illustration, no decorative graphics, no 3D renders. Icons are geometric and minimal (the crown/play badge mark is the only repeated iconographic element). Photography treatment varies per project: some warm-toned, some high-contrast black-and-white — the frame is the work, not the styling.

## Layout

Full-bleed top, max-width contained below. The wordmark stretches edge-to-edge (not contained in 1400px). Then a full-bleed black hero, then white body content capped at ~1400px. Content sections use generous 80px vertical gaps. The case study grid is 4 columns of equal cards. Article/press grid is also 4 columns with meta labels above titles. Editorial statements use a constrained measure (~14 words/line) and are centered or left-aligned. Navigation is a single horizontal row of pill links split left/right around a centered status message — no sticky behavior, no mega-menu.

## Agent Prompt Guide

Quick Color Reference:
- text: #070708
- background: #ffffff
- border: #070708 (primary) / #808080 (muted)
- muted text: #808080
- reverse (on dark): #ffffff
- primary action: no distinct CTA color

Example Component Prompts:

1. Create a top navigation bar: white #ffffff background. Left cluster of three pill nav items (WORK, SERVICES, ABOUT) in 12px Instrument-Sans uppercase, 0.05em letter-spacing, 1px solid #070708 border, 999px radius, 3px 10px padding. Center status message: 'CAMPAIGN US WINNERS: DESIGN STUDIO AGENCY OF THE YEAR 2026! SEE MORE →' in 12px Instrument-Sans uppercase. Right cluster mirrors left (EONS, CAREERS, LATEST, CONTACT). Full-bleed width.

2. Create a full-bleed dark hero section: #070708 background, ~80vh height, 24px bottom radius where it meets the next white section. Centered: a white geometric crown/badge mark with a triangle play icon at ~120px, #ffffff. No text, no buttons — pure atmospheric block.

3. Create a recent work grid: 4 columns on white #ffffff background, 24px gap. Each card: image at 24px radius, no border, no shadow. Filter row above grid: pills at 12px Instrument-Sans uppercase 0.05em tracking, 1px solid #070708 border, 999px radius, 4px 10px padding. Active filter has filled #070708 background with #ffffff text.

4. Create an editorial statement block: centered or left-aligned Instrument-Serif at 64px, weight 400, line-height 1.13, letter-spacing -0.02em, color #070708. Max-width ~900px so the line breaks at ~14 words. One word may switch to Instrument-Serif Italic for emphasis. Below it, 80px of whitespace, then a 1px #070708 horizontal rule.

5. Create a press article card: image at 24px radius (aspect ratio ~4:3), 8px gap to meta row showing 'PRESS | ARTICLE | 5 MINUTES' in 11px Instrument-Sans uppercase 0.08em tracking, #808080. 16px below: title in 23px Instrument-Sans, weight 400, color #070708, letter-spacing -0.01em. Clickable as inline text link.

## Editorial Voice & Cadence

The page is written like a design journal, not a SaaS landing page. Sentence rhythm matters: short declarative statements, then a pause, then a longer reflective clause. The 64px Instrument-Serif is where this voice lives. Below it, a 19–23px Instrument-Sans body paragraph continues the thought in a different register — this contrast (serif statement → sans explanation) is the content's structural pattern. Individual words inside sans paragraphs may shift to a lighter gray or italic serif for emphasis, creating inline rhythm without color.

## Similar Brands

- **Pentagram** — Same zero-color agency identity with massive display type, editorial serif statements, and monochrome grid systems
- **Manual (manualcreative.com)** — Editorial agency aesthetic with serif/sans duality, pill navigation, and 24px-radius project cards
- **Locomotive (locomotive.ca)** — Full-bleed black hero sections, generous whitespace, and achromatic agency portfolio structure
- **Resn** — Bold wordmark-as-hero treatment and confident monochrome restraint in agency presentation
- **Wieden+Kennedy** — Newspaper-broadsheet pacing with large serif statements and dense project grids in grayscale

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-obsidian: #070708;
  --color-paper: #ffffff;
  --color-ash: #808080;

  /* Typography — Font Families */
  --font-instrument-sans: 'Instrument-Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-instrument-serif: 'Instrument-Serif', ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
  --font-instrument-serif-italic: 'Instrument-Serif-Italic', ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.43;
  --tracking-caption: 0.05px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.45;
  --tracking-body-sm: -0.005px;
  --text-body: 16px;
  --leading-body: 1.43;
  --tracking-body: -0.005px;
  --text-body-lg: 19px;
  --leading-body-lg: 1.45;
  --tracking-body-lg: -0.005px;
  --text-subheading: 23px;
  --leading-subheading: 1.33;
  --tracking-subheading: -0.01px;
  --text-heading: 28px;
  --leading-heading: 1.26;
  --tracking-heading: -0.01px;
  --text-heading-lg: 36px;
  --leading-heading-lg: 1.22;
  --tracking-heading-lg: -0.025px;
  --text-display-serif: 64px;
  --leading-display-serif: 1.13;
  --tracking-display-serif: -0.02px;
  --text-display: 352px;
  --leading-display: 0.85;
  --tracking-display: -0.05px;

  /* Typography — Weights */
  --font-weight-regular: 400;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-96: 96px;

  /* Layout */
  --page-max-width: 1400px;
  --section-gap: 80px;
  --card-padding: 24px;
  --element-gap: 8px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-3xl: 24px;
  --radius-3xl-2: 32px;
  --radius-full: 999px;

  /* Named Radii */
  --radius-nav: 999px;
  --radius-cards: 24px;
  --radius-badges: 999px;
  --radius-images: 24px;
  --radius-inputs: 8px;
  --radius-buttons: 999px;

  /* Surfaces */
  --surface-paper: #ffffff;
  --surface-obsidian: #070708;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-obsidian: #070708;
  --color-paper: #ffffff;
  --color-ash: #808080;

  /* Typography */
  --font-instrument-sans: 'Instrument-Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-instrument-serif: 'Instrument-Serif', ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
  --font-instrument-serif-italic: 'Instrument-Serif-Italic', ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.43;
  --tracking-caption: 0.05px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.45;
  --tracking-body-sm: -0.005px;
  --text-body: 16px;
  --leading-body: 1.43;
  --tracking-body: -0.005px;
  --text-body-lg: 19px;
  --leading-body-lg: 1.45;
  --tracking-body-lg: -0.005px;
  --text-subheading: 23px;
  --leading-subheading: 1.33;
  --tracking-subheading: -0.01px;
  --text-heading: 28px;
  --leading-heading: 1.26;
  --tracking-heading: -0.01px;
  --text-heading-lg: 36px;
  --leading-heading-lg: 1.22;
  --tracking-heading-lg: -0.025px;
  --text-display-serif: 64px;
  --leading-display-serif: 1.13;
  --tracking-display-serif: -0.02px;
  --text-display: 352px;
  --leading-display: 0.85;
  --tracking-display: -0.05px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-96: 96px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-3xl: 24px;
  --radius-3xl-2: 32px;
  --radius-full: 999px;
}
```
