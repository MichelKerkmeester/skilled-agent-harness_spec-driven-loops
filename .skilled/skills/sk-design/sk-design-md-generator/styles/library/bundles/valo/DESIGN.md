# Valo — Style Reference
> noir observatory at midnight — weight-300 typography floats on pure black while a single teal-violet gradient passes through like a laser line across the room.

**Theme:** dark

Valo runs on a noir observatory aesthetic: deep-black canvas, a single custom serif-less voice at whisper weight (300), and one luminous blue-teal-violet gradient used as deliberate punctuation rather than decoration. Typography does the heavy lifting — 100px display headlines with tight negative tracking feel like illuminated ink on obsidian, while the rest of the interface stays nearly invisible. The gradient appears in exactly three roles: a single accent word inside a headline, a thin floating ring/torus visual, and a wash at the page foot — never as a button fill or panel background. Components are flat, hairline-bordered, and borderless where possible; interaction is signaled by circular arrow buttons and numbered sequencing, not by color or shadow. Every screen should feel like a page torn from a dark scientific monograph: quiet, confident, with one moment of light.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Void | `#000000` | `--color-void` | Page canvas, hero background, all primary surface area. Sets the dark-stage tone for every screen |
| Bone | `#e5e7eb` | `--color-bone` | Hairline borders, dividers, and muted secondary text. The workhorse neutral that defines edges without adding visual weight |
| Paper | `#ffffff` | `--color-paper` | Primary headings, body text, nav links, and icon strokes. Maximum contrast against Void for clear information hierarchy |
| Graphite | `#4d4d4d` | `--color-graphite` | Subtle nav borders and disabled/inactive state lines. Sits between Void and Bone for low-emphasis structural lines |
| Spectrum Wash | `linear-gradient(270deg, rgb(158, 61, 178), rgb(27, 102, 248), rgb(36, 218, 217), rgb(179, 198, 232))` | `--color-spectrum-wash` | Hero accent gradient — applied to a single headline word and the floating torus visual. Cool blue midpoint of the signature violet→blue→teal→lavender ramp |
| Deep Field | `linear-gradient(90deg, rgb(30, 35, 60), rgb(10, 64, 153))` | `--color-deep-field` | Footer band gradient origin — near-black indigo transitioning into brand blue. Defines the bottom-of-page atmospheric shift |
| Atmospheric Fade | `linear-gradient(90deg, rgb(25, 81, 162), rgb(112, 218, 180))` | `--color-atmospheric-fade` | Secondary gradient — blue-to-mint wash used in supporting visuals and transitional bands. Cooler, more subdued than the hero spectrum |

## Tokens — Typography

### Valo — Exclusive typeface across all UI: nav links, body copy, section labels, and display headlines. Weight 300 carries headlines and body — the anti-convention whisper-weight creates scientific authority through restraint. Weight 700 is reserved for micro-labels and the few moments that need to anchor a page. The custom cut of this single family is the brand voice. · `--font-valo`
- **Substitute:** Inter (for 400/700) paired with a thin display weight like Söhne Breit Halbfett or National 2 Thin for 300
- **Weights:** 300, 400, 700
- **Sizes:** 10, 13, 15, 18, 24, 30, 38, 60, 100
- **Line height:** 1.0–1.63 by role
- **Letter spacing:** -0.0270em, -0.0130em, 0.1000em
- **OpenType features:** `"clig" on, "liga" on, "ss03" on`
- **Role:** Exclusive typeface across all UI: nav links, body copy, section labels, and display headlines. Weight 300 carries headlines and body — the anti-convention whisper-weight creates scientific authority through restraint. Weight 700 is reserved for micro-labels and the few moments that need to anchor a page. The custom cut of this single family is the brand voice.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 10px | 1.4 | 1px | `--text-caption` |
| body | 15px | 1.63 | — | `--text-body` |
| subheading | 18px | 1.4 | — | `--text-subheading` |
| heading-sm | 24px | 1.33 | -0.31px | `--text-heading-sm` |
| heading | 38px | 1.2 | -0.49px | `--text-heading` |
| heading-lg | 60px | 1.2 | -0.78px | `--text-heading-lg` |
| display | 100px | 1 | -2.7px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 36 | 36px | `--spacing-36` |
| 108 | 108px | `--spacing-108` |
| 216 | 216px | `--spacing-216` |

### Border Radius

| Element | Value |
|---------|-------|
| icons | 9999px |
| links | 9999px |
| buttons | 9999px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 45px
- **Element gap:** 18-20px

## Components

### Top Navigation Bar
**Role:** Global site navigation anchored to top of every page

Horizontal bar on Void (#000000) background. Wordmark "Valo" at 24px weight 400 Paper (#ffffff) flush left. Nav items (Approach, Company, Partnership, News & Insights, Contact) right-aligned at 13px weight 400 Paper with 27px horizontal spacing. 7px top/bottom padding. No background fill, no border below — the negative space defines the bar.

### Hero Display Headline
**Role:** Opening page-level statement, left-aligned on dark canvas

100px Valo weight 300 Paper (#ffffff), line-height 1.0, letter-spacing -2.7px. The word "aha" is the only chromatic moment — rendered in the Spectrum Wash gradient (linear 270deg violet→blue→teal→lavender) as inline text. No background, no border. Sets the editorial tone.

### Hero Subhead Paragraph
**Role:** Supporting description under the display headline

15px Valo weight 400 Bone (#e5e7eb), line-height 1.63. Max-width constrained to align with headline measure. No label, no link, no decoration — the paragraph is the quiet second beat.

### Section Label Tag
**Role:** Micro-category label introducing each major content section

10px Valo weight 400 Paper (#ffffff), letter-spacing 1.0px (0.1em), uppercase. Sits above section content with 18px top padding. Functions as a typographic flag, not a button — no background, no border.

### Gradient Torus Visual
**Role:** Decorative conceptual illustration representing the feedback loop of drug discovery

Large thin-stroke ring (approximately 400px diameter) rendered with the Spectrum Wash gradient applied as a stroke. Floats on Void canvas to the left of paired content. The only saturated-color shape on the page — its presence is the page's focal anchor.

### Numbered Content Block
**Role:** Sequential feature/item layout with index number and description

Two-column structure. Left column: 13px Valo weight 400 Bone (#e5e7eb) numeral ("01", "02") at 0.1em tracking. Right column: 18px Valo weight 700 Paper subheading, followed by 15px weight 400 Bone body at line-height 1.63. 14px gap between subheading and body. 23px vertical gap between numbered items.

### Circle Arrow Link Button
**Role:** Inline call-to-action for secondary navigation ("Explore our approach", "Join our team")

48px circular button (9999px radius) with 1px Bone (#e5e7eb) border on Void background. White right-arrow icon (→) centered inside. Paired with a 18px Valo weight 400 Paper text link to its right with 20px gap. The circle is the system's only geometric interaction primitive — used wherever a click is invited.

### Content Section Heading
**Role:** Mid-page section title introducing a new content block

38px Valo weight 300 Paper (#ffffff), line-height 1.2, letter-spacing -0.49px. Left-aligned, sits 36-45px below the preceding section. No underline, no background — weight 300 is the only emphasis needed.

### Gradient Footer Band
**Role:** Atmospheric closing zone with site links and copyright

Full-bleed band with the Atmospheric Fade gradient (linear 90deg #1951a2 → #70dab4) transitioning into the Spectrum Wash tones. Contains the Valo wordmark (24px Paper, left) and a row of footer links (13px Paper, right) at 20px gaps: Privacy Policy, Terms & Conditions, Cookie Consent, Preferences, Twitter, LinkedIn, © line. No top or bottom border — the gradient itself defines the zone.

### Hairline Section Divider
**Role:** Vertical separation between content sections

1px solid Bone (#e5e7eb) line, full content-width. No other styling. Used sparingly — most sections breathe on whitespace alone.

## Do's and Don'ts

### Do
- Set all display and body text in Valo weight 300 — the whisper-weight is the brand voice, not a fallback
- Apply the Spectrum Wash gradient to exactly one word per headline maximum — chromatic type is punctuation, not paint
- Use 9999px radius for every interactive element (buttons, link icons, tags) — circles are the only geometric interaction shape in the system
- Set display headlines at -2.7px letter-spacing (100px) and -0.78px (60px) — the negative tracking tightens large type to feel carved rather than typed
- Use 0.1em letter-spacing on all small-caps labels, nav items, and numbered prefixes — the wide tracking signals scientific precision
- Anchor every section with the uppercase Section Label Tag at 10px — the typographic flag gives pages a magazine-like structure
- Use the 01, 02 numbered pattern for sequential content blocks — sequencing reads as methodical, fitting the discovery narrative

### Don't
- Don't use weight 700 for body copy or long-form paragraphs — the voice is light; 700 belongs to subheadings and micro-labels only
- Don't apply the Spectrum Wash gradient to button backgrounds, panel fills, or large-area surfaces — it belongs on text accents, ring strokes, and the footer band only
- Don't introduce card surfaces, drop shadows, or elevated panels — the canvas stays flat; depth comes from type scale, not from z-axis
- Don't use borders thicker than 1px — the entire system runs on hairlines (Bone at 1px); anything heavier breaks the editorial register
- Don't add a chromatic brand color outside the violet→blue→teal→lavender ramp — the system is intentionally near-monochrome with one gradient family
- Don't center body text or multi-line content — the layout is left-aligned and the measure should align with the headline edge
- Don't use stock photography, emoji, or decorative illustration — visuals are limited to the gradient torus and the footer wash; everything else is type and whitespace

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Void Canvas | `#000000` | Full-bleed page background — the dominant surface for hero, content, and mid-page sections. |
| 2 | Gradient Footer Band | `#1b66f8` | Atmospheric full-width wash at the page foot, blending teal, blue, and violet to close the visual story. |

## Elevation

This system intentionally avoids shadows and elevation. Depth is communicated through type scale and whitespace, not z-axis layering. The only layered surface is the gradient footer band, which acts as a horizon line rather than an elevated card. No box-shadows, no blur, no glow.

## Imagery

Imagery is minimal and geometric: a single large gradient-stroke torus/ring floats on the hero of feature sections, and a full-bleed gradient band closes the page. No photography, no illustration beyond the ring, no product screenshots. The gradient itself is the visual content — a teal-to-blue-to-violet-to-lavender sweep used as both text fill (on one headline word) and as a thin stroke (on the ring). Iconography is restricted to a single white right-arrow glyph inside circular buttons. Every other visual element is type, hairline, or empty canvas.

## Layout

Max-width 1200px centered content column on a full-bleed #000000 canvas. Hero is left-aligned: large display headline (100px) over a 15px subhead paragraph, all flush to the content column's left edge with generous left padding. Below the hero, sections alternate between text-only blocks and paired text+visual layouts — the gradient torus sits to the left of a two-column content block containing subheading, numbered items, and a circle-arrow link. Section rhythm is set by 45px+ vertical gaps and the occasional hairline divider; no banding colors, no card grids. Navigation is a single top bar with logo left and links right. The page closes with a full-bleed gradient footer band containing footer links — the only moment the canvas shifts from pure black to color.

## Agent Prompt Guide

**Quick Color Reference**
- text: #ffffff (Paper)
- background: #000000 (Void)
- border: #e5e7eb (Bone), 1px
- accent gradient: linear-gradient(270deg, rgb(158,61,178), rgb(27,102,248), rgb(36,218,217), rgb(179,198,232))
- footer gradient: linear-gradient(90deg, rgb(30,35,60), rgb(10,64,153)) transitioning to the teal-mint wash
- primary action: no distinct CTA color

**Example Component Prompts**

1. Build a hero section on #000000. Headline at 100px Valo weight 300, #ffffff, line-height 1.0, letter-spacing -2.7px. Render the single word "aha" inline using the Spectrum Wash gradient as the text color. Below: 15px Valo weight 400, #e5e7eb, line-height 1.63, max-width matching the headline measure. No buttons, no images.

2. Build a paired text-and-visual section. Left: a 400px-diameter thin ring (2px stroke) filled with the Spectrum Wash gradient as stroke color, centered vertically. Right: a 38px Valo weight 300 #ffffff section heading at line-height 1.2, followed by a 15px #e5e7eb intro paragraph, then a numbered list (01, 02) at 13px #e5e7eb numerals (0.1em tracking) paired with 18px weight 700 #ffffff subheadings and 15px weight 400 #e5e7eb bodies. Close with a 48px circular ghost button (1px #e5e7eb border, white → arrow icon) paired with an 18px #ffffff text link.

3. Build a full-bleed footer band. Background: linear-gradient(90deg, #1e233c, #0a4099) blending into a teal-violet wash. Left: 24px Valo weight 400 #ffffff wordmark. Right: a row of 13px Valo weight 400 #ffffff links at 20px gaps (Privacy Policy, Terms, Cookie Consent, Preferences, Twitter, LinkedIn, © 2026 Valo Health). No top border — the gradient defines the zone.

4. Build a section label. 10px Valo weight 400 #ffffff, uppercase, letter-spacing 1.0px. Place 36px above its parent content block. No background, no border.

5. Build a top navigation bar. Background: #000000 (transparent over canvas). Left: 24px Valo weight 400 #ffffff "Valo" wordmark. Right: 5 nav items at 13px Valo weight 400 #ffffff with 27px horizontal gaps and 7px top/bottom padding. No background fill, no border-bottom.

## Gradient System

Three gradients form the system's chromatic vocabulary, and they share a single hue family (violet → blue → teal → mint → lavender). Usage is strictly rationed: the Spectrum Wash (#9e3db2 → #1b66f8 → #24dad9 → #b3c6e8) lives on exactly one word per page, on the torus stroke, and as the climax of the footer band. The Deep Field (#1e233c → #0a4099) is the footer's opening — near-black indigo easing into brand blue. The Atmospheric Fade (#1951a2 → #70dab4) is a secondary wash for transitional moments. Never stack gradients. Never apply gradients to button fills or panel backgrounds. Treat each gradient use as a budgeted moment — too many, and the system loses its editorial restraint.

## Similar Brands

- **Linear** — Same dark-canvas + weight-light typography + single-hue accent restraint — Linear's dark mode uses one purple accent against near-black surfaces with whisper-weight display type
- **Vercel** — Identical minimalist dark aesthetic with a single chromatic gradient moment, ultra-thin display headlines, and the same flat-no-elevation philosophy
- **Arc Browser** — Editorial dark-mode sensibility with oversized display type set tight, generous negative space, and circular interaction primitives
- **Recursion** — Fellow AI-bio company with a comparable scientific-monograph-on-black visual register — large light-weight type, restrained color, and torus/loop motifs in hero illustrations
- **SpaceX** — Shares the deep-black canvas, sparse whitespace, and weight-300-400 display typography that reads as engineering-precise rather than marketing-loud

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-void: #000000;
  --color-bone: #e5e7eb;
  --color-paper: #ffffff;
  --color-graphite: #4d4d4d;
  --color-spectrum-wash: #1b66f8;
  --gradient-spectrum-wash: linear-gradient(270deg, rgb(158, 61, 178), rgb(27, 102, 248), rgb(36, 218, 217), rgb(179, 198, 232));
  --color-deep-field: #1e233c;
  --gradient-deep-field: linear-gradient(90deg, rgb(30, 35, 60), rgb(10, 64, 153));
  --color-atmospheric-fade: #1951a2;
  --gradient-atmospheric-fade: linear-gradient(90deg, rgb(25, 81, 162), rgb(112, 218, 180));

  /* Typography — Font Families */
  --font-valo: 'Valo', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.4;
  --tracking-caption: 1px;
  --text-body: 15px;
  --leading-body: 1.63;
  --text-subheading: 18px;
  --leading-subheading: 1.4;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.33;
  --tracking-heading-sm: -0.31px;
  --text-heading: 38px;
  --leading-heading: 1.2;
  --tracking-heading: -0.49px;
  --text-heading-lg: 60px;
  --leading-heading-lg: 1.2;
  --tracking-heading-lg: -0.78px;
  --text-display: 100px;
  --leading-display: 1;
  --tracking-display: -2.7px;

  /* Typography — Weights */
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-36: 36px;
  --spacing-108: 108px;
  --spacing-216: 216px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 45px;
  --element-gap: 18-20px;

  /* Border Radius */
  --radius-full: 9999px;

  /* Named Radii */
  --radius-icons: 9999px;
  --radius-links: 9999px;
  --radius-buttons: 9999px;

  /* Surfaces */
  --surface-void-canvas: #000000;
  --surface-gradient-footer-band: #1b66f8;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-void: #000000;
  --color-bone: #e5e7eb;
  --color-paper: #ffffff;
  --color-graphite: #4d4d4d;
  --color-spectrum-wash: #1b66f8;
  --color-deep-field: #1e233c;
  --color-atmospheric-fade: #1951a2;

  /* Typography */
  --font-valo: 'Valo', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.4;
  --tracking-caption: 1px;
  --text-body: 15px;
  --leading-body: 1.63;
  --text-subheading: 18px;
  --leading-subheading: 1.4;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.33;
  --tracking-heading-sm: -0.31px;
  --text-heading: 38px;
  --leading-heading: 1.2;
  --tracking-heading: -0.49px;
  --text-heading-lg: 60px;
  --leading-heading-lg: 1.2;
  --tracking-heading-lg: -0.78px;
  --text-display: 100px;
  --leading-display: 1;
  --tracking-display: -2.7px;

  /* Spacing */
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-36: 36px;
  --spacing-108: 108px;
  --spacing-216: 216px;

  /* Border Radius */
  --radius-full: 9999px;
}
```
