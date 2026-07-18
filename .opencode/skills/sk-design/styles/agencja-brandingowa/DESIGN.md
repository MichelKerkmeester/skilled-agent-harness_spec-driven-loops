# Agencja brandingowa — Style Reference
> Editorial white gallery with black ink typography

**Theme:** light

A stark editorial identity system built on absolute monochrome — white canvas, black ink, gray echoes. The design reads like a printed architecture monograph: every element earns its space through generous whitespace, precise typographic control, and a refusal to use color for anything but information. Type does all the emotional work; a single custom grotesk carries both 73px display lines and 10px meta labels, unified by a stylistic alternate ('ss01') that gives the letterforms a distinctive editorial edge. Components stay flat, borders stay hairlines, radii stay generously rounded, and the entire surface stack moves from pure white through cool grays to ink black without any chromatic interruption.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Pure White | `#ffffff` | `--color-pure-white` | Page background, card surface, inverted text on dark blocks |
| Ink Black | `#000000` | `--color-ink-black` | Primary text, headings, logo mark, all stroke and border weight |
| Obsidian | `#1f1f1f` | `--color-obsidian` | Dark section backgrounds, deep surface elevation, footer bands |
| Graphite Wash | `#333333` | `--color-graphite-wash` | Elevated dark surfaces, overlay panels |
| Slate | `#666666` | `--color-slate` | Muted body copy, secondary text, supporting meta |
| Steel | `#808080` | `--color-steel` | Tertiary text, captions, decorative strokes, logo placeholder tints |
| Fog | `#999999` | `--color-fog` | Subtle text, placeholder labels, inactive indicators |
| Pale Mist | `#cccccc` | `--color-pale-mist` | Hairline borders, dividers, subtle outlines, disabled link state |
| Vapor | `#e6e6e6` | `--color-vapor` | Card backgrounds, input fields, soft container fill |
| Ash | `#f2f2f2` | `--color-ash` | Section background, alternating band fill, image placeholder fill |

## Tokens — Typography

### 247 grotesk — The singular brand typeface — carries the logo, 73px display headlines, navigation labels, and all UI micro-copy in one voice. The 'ss01' stylistic alternate is critical: it reshapes select glyphs into a distinctive editorial form. Medium weight (500) is reserved for emphasis; the system trusts 400 for even the largest display sizes, giving headlines a quiet, authoritative restraint rather than visual shouting. · `--font-247-grotesk`
- **Substitute:** Inter, Neue Haas Grotesk, Söhne
- **Weights:** 400, 500
- **Sizes:** 10, 11, 14, 16, 19, 21, 28, 31, 35, 48, 52, 55, 73
- **Line height:** 1.00, 1.14, 1.20, 1.25, 1.30, 1.89
- **OpenType features:** `"ss01"`
- **Role:** The singular brand typeface — carries the logo, 73px display headlines, navigation labels, and all UI micro-copy in one voice. The 'ss01' stylistic alternate is critical: it reshapes select glyphs into a distinctive editorial form. Medium weight (500) is reserved for emphasis; the system trusts 400 for even the largest display sizes, giving headlines a quiet, authoritative restraint rather than visual shouting.

### Ntbau — Secondary workhorse for body paragraphs, supporting descriptions, and small annotations. The slight positive tracking (0.0190em) makes it readable at small sizes and gives it a measured, documentary feel that contrasts the tighter grotesk display. Weight 700 appears in fine print and legal micro-copy. · `--font-ntbau`
- **Substitute:** Söhne, Inter, Untitled Sans
- **Weights:** 400, 500, 700
- **Sizes:** 10, 11, 12, 14, 18
- **Line height:** 1.00, 1.14, 1.20, 1.30
- **Letter spacing:** 0.0190em
- **Role:** Secondary workhorse for body paragraphs, supporting descriptions, and small annotations. The slight positive tracking (0.0190em) makes it readable at small sizes and gives it a measured, documentary feel that contrasts the tighter grotesk display. Weight 700 appears in fine print and legal micro-copy.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 10px | 1.3 | — | `--text-caption` |
| body | 14px | 1.25 | — | `--text-body` |
| body-lg | 16px | 1.25 | — | `--text-body-lg` |
| subheading | 19px | 1.2 | — | `--text-subheading` |
| heading-sm | 28px | 1.14 | — | `--text-heading-sm` |
| heading | 35px | 1.14 | — | `--text-heading` |
| heading-lg | 52px | 1 | — | `--text-heading-lg` |
| display | 73px | 1 | — | `--text-display` |

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
| 48 | 48px | `--spacing-48` |
| 52 | 52px | `--spacing-52` |
| 56 | 56px | `--spacing-56` |
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |
| 112 | 112px | `--spacing-112` |
| 128 | 128px | `--spacing-128` |
| 184 | 184px | `--spacing-184` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 33.76px |
| cards | 33.76px |
| buttons | 42.96px |
| imagePlaceholders | 33.76px |

### Layout

- **Page max-width:** 1440px
- **Section gap:** 80-120px
- **Card padding:** 24-40px
- **Element gap:** 8-16px

## Components

### 247 Logo Mark
**Role:** Brand wordmark, top-left anchor of every page

Custom "247" typeset in 247 grotesk, bold weight, with distinctive slash/dot punctuation integrated into the numerals. Rendered in #000000 on light backgrounds, #ffffff on dark. Fixed size, not scaled. The 'ss01' alternate is essential to its character.

### Primary Navigation Link
**Role:** Top-bar site navigation

Uppercase 247 grotesk, weight 500, 11px, letter-spacing 0.0190em, #000000. Grouped in a multi-line block aligned left. Leading arrow (▸) on the active link. No underlines, no color shifts — emphasis comes purely from weight and the directional indicator.

### Language Toggle
**Role:** PL / EN switcher in header

Two stacked items (POLSKI, ENGLISH) in 247 grotesk 11px weight 500, #000000. Active language in 500, inactive in 400. Vertical stack with 5px row gap. Right-aligned to the header edge.

### Contact Link
**Role:** Persistent call-to-action in header

"KONTAKT" followed by a right arrow (→), 247 grotesk 11px weight 500, #000000. Positioned at the far right of the header. Functions as a text-only CTA — no button chrome.

### Office Info Card
**Role:** Header address and contact block

White card with 33.76px border-radius, 1px #cccccc border, containing a 1:1 image placeholder (top) and a text block below. Padding 24px. Label "BIURO" in 247 grotesk 11px weight 500, address lines in Ntbau 11px, email underlined.

### Display Headline
**Role:** Hero text, section openers

247 grotesk weight 400, 73px, line-height 1.0, #000000. Multi-line construction where the second line is italicized in #999999. Sets 52px+ variants for secondary sections. The use of 400 (not bold) for a 73px headline is a signature choice — the system relies on size and silence, not weight.

### Body Text Block
**Role:** Supporting description copy

Ntbau 14px, line-height 1.89, #000000. Generous line-height creates air between sentences. Used in narrow column widths (250-400px) beside large headlines for a magazine-spread feel.

### Scroll Indicator
**Role:** Bottom-left directional cue

"[ PRZEWIŃ W DÓŁ ]" in 247 grotesk 10px, #999999, bracketed in #cccccc. Bracket chars in hairline gray, text in muted gray — a typographic gesture rather than an icon.

### Client Logo Grid Item
**Role:** Index of brand clients

2-column wide cell containing a 01–12 number label (Ntbau 10px, #999999, top-left) and a centered grayscale client logo. 1px #e6e6e6 bottom border separates rows. No card chrome — logos float on white. The numbered label is a deliberate editorial device, not pagination.

### Brand Project Card
**Role:** Featured case study tile

Two-up grid of project showcases. Each card: a 1:1 or 16:9 image area with 33.76px radius, a project title in 247 grotesk 21px weight 400, and a category label below. White card background, no shadow, 1px #e6e6e6 border optional.

### Documentary Sidebar Label
**Role:** Vertical context marker on right edge

Rotated 90° text "DOKUMENTARIUSZ" in 247 grotesk 10px weight 500, letter-spacing 0.0190em, #000000. Positioned absolute on the right viewport edge, runs vertically. Anchors the page to its content category — an editorial masthead device.

### Section Header (All-Caps Eyebrow)
**Role:** Small uppercase label preceding section content

247 grotesk 11px weight 500, #000000, all-caps, letter-spacing 0.0190em. Two-line max. Sits flush-left with a 24-40px gap before the headline or content below.

## Do's and Don'ts

### Do
- Use #000000 for all primary text and structural elements — no off-black substitutes
- Apply the 'ss01' font feature setting on all 247 grotesk instances to preserve the alternate glyph forms
- Set display headlines at weight 400, never bold — let the 73px size carry the impact
- Maintain a minimum 80px section gap between major content blocks
- Use 0.0190em letter-spacing on all uppercase labels and Ntbau body text
- Separate rows and sections with 1px #e6e6e6 or #cccccc hairlines, never with shadow or color blocks
- Italicize the second line of multi-line display headlines in #999999 to create a typographic echo

### Don't
- Never introduce chromatic color — the system is 100% achromatic by design
- Never add box-shadow, glow, or blur effects to any element
- Never use weight 600+ for headlines — the system caps at 500 for emphasis
- Never reduce display headline below 48px or use 247 grotesk for body paragraphs
- Never center body text — always flush-left for the editorial alignment
- Never use square or small radii — the system commits to 33-43px rounded corners on all containers
- Never place CTAs in filled colored buttons — use text links with arrows or brackets only

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Pure Canvas | `#ffffff` | Page base, primary background |
| 1 | Ash Band | `#f2f2f2` | Section separators, image placeholders, light card fill |
| 2 | Vapor Card | `#e6e6e6` | Soft card containers, input fields |
| 3 | Hairline | `#cccccc` | Divider lines, subtle structural edges |
| 4 | Obsidian Block | `#1f1f1f` | Dark feature sections, inverted content blocks |
| 5 | Ink Black | `#000000` | Maximum contrast, logo lockup, documentary label |

## Elevation

The system deliberately avoids shadow elevation entirely. Depth and separation are achieved through surface tone shifts (#ffffff → #f2f2f2 → #e6e6e6), generous spacing, and hairline borders. The flatness is a core brand decision — it makes the interface feel like printed editorial matter rather than screen UI, reinforcing the studio's positioning as a craft brand-design agency.

## Imagery

Photography and project renders are presented in contained cards with generous 33.76px rounded corners, never full-bleed. Image treatment is neutral — grayscale or desaturated — to maintain the monochrome system discipline. A consistent placeholder system uses a centered image-icon glyph in a 1:1 frame with no decorative framing. Project imagery functions as portfolio evidence rather than lifestyle atmosphere; the studio's craft is the subject, not the setting. Iconography is minimal: small line-weight glyphs (16-24px) used only for functional cues like the language switcher arrow, the contact directional, and scroll indicators.

## Agent Prompt Guide

**Quick Color Reference**
- text: #000000
- background: #ffffff
- border: #cccccc / #e6e6e6
- muted text: #999999 / #808080
- dark surface: #1f1f1f
- primary action: no distinct CTA color

**Example Component Prompts**

1. **Hero Display Headline**: Two-line flush-left headline. First line: 247 grotesk weight 400, 73px, line-height 1.0, #000000. Second line: same family, weight 400, 73px, italic, color #999999. Max-width container 1200px, 120px left margin. Below headline: body text in narrow 350px column, Ntbau 14px, line-height 1.89, #000000.

2. **Client Logo Grid Cell**: 2-column cell with 80px height. Top-left number "03" in Ntbau 10px, #999999. Centered grayscale client logo at 60% opacity, 32px height, #808080. 1px #e6e6e6 bottom border, no side borders. White background, no padding.

3. **Office Info Card**: 280px wide card, 33.76px border-radius, 1px #cccccc border, white fill, 24px padding. Top: 1:1 image placeholder at 100% width with #f2f2f2 fill and centered image-icon glyph. Below: "BIURO" label in 247 grotesk 11px weight 500, then 4 address lines in Ntbau 11px line-height 1.30, email line underlined.

4. **Documentary Sidebar Label**: Absolutely positioned at right: 0, top: 40%. Text "DOKUMENTARIUSZ" in 247 grotesk 10px weight 500, letter-spacing 0.0190em, #000000, transform: rotate(90deg), transform-origin: right top. 1px #cccccc hairline beneath the rotated text.

5. **Section Header Eyebrow**: Flush-left, 247 grotesk 11px weight 500, all-caps, #000000, letter-spacing 0.0190em, two lines max. 40px margin-bottom before headline. 120px left margin to align with hero content edge.

## Typographic System Logic

The type system is intentionally bipolar: one display family (247 grotesk with 'ss01') and one text family (Ntbau with 0.0190em tracking). 247 grotesk handles everything from 10px nav labels to 73px display lines in a single voice, trusting the 'ss01' alternate and weight contrast (400 vs 500) to create hierarchy rather than swapping to a serif or condensed cut. Ntbau is reserved for body copy and small annotations where its wider tracking and gentler proportions support long-read readability. The italic-on-second-line display pattern is the system's most recognizable signature — it creates a typographic conversation between the first statement and the second, quieter echo.

## Similar Brands

- **Pentagram** — Same editorial restraint, generous whitespace, and text-driven hero composition with no decorative imagery
- **Werkstatt (Berlin)** — Identical commitment to absolute monochrome with a custom grotesk display face and italic second-line treatment
- **Manual Studio** — Shared numbered-grid client index pattern and hairline-bordered layout structure
- **Locomotive MTL** — Same flat surfaces, no-shadow elevation, and architectural-portfolio information density
- **Studio Dumbar** — Custom typeface as brand anchor and ruthless typographic discipline across all UI scales

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-pure-white: #ffffff;
  --color-ink-black: #000000;
  --color-obsidian: #1f1f1f;
  --color-graphite-wash: #333333;
  --color-slate: #666666;
  --color-steel: #808080;
  --color-fog: #999999;
  --color-pale-mist: #cccccc;
  --color-vapor: #e6e6e6;
  --color-ash: #f2f2f2;

  /* Typography — Font Families */
  --font-247-grotesk: '247 grotesk', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-ntbau: 'Ntbau', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.3;
  --text-body: 14px;
  --leading-body: 1.25;
  --text-body-lg: 16px;
  --leading-body-lg: 1.25;
  --text-subheading: 19px;
  --leading-subheading: 1.2;
  --text-heading-sm: 28px;
  --leading-heading-sm: 1.14;
  --text-heading: 35px;
  --leading-heading: 1.14;
  --text-heading-lg: 52px;
  --leading-heading-lg: 1;
  --text-display: 73px;
  --leading-display: 1;

  /* Typography — Weights */
  --font-weight-light: 300;
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
  --spacing-48: 48px;
  --spacing-52: 52px;
  --spacing-56: 56px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-112: 112px;
  --spacing-128: 128px;
  --spacing-184: 184px;

  /* Layout */
  --page-max-width: 1440px;
  --section-gap: 80-120px;
  --card-padding: 24-40px;
  --element-gap: 8-16px;

  /* Border Radius */
  --radius-3xl: 33.76px;
  --radius-3xl-2: 42.96px;

  /* Named Radii */
  --radius-tags: 33.76px;
  --radius-cards: 33.76px;
  --radius-buttons: 42.96px;
  --radius-imageplaceholders: 33.76px;

  /* Surfaces */
  --surface-pure-canvas: #ffffff;
  --surface-ash-band: #f2f2f2;
  --surface-vapor-card: #e6e6e6;
  --surface-hairline: #cccccc;
  --surface-obsidian-block: #1f1f1f;
  --surface-ink-black: #000000;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-pure-white: #ffffff;
  --color-ink-black: #000000;
  --color-obsidian: #1f1f1f;
  --color-graphite-wash: #333333;
  --color-slate: #666666;
  --color-steel: #808080;
  --color-fog: #999999;
  --color-pale-mist: #cccccc;
  --color-vapor: #e6e6e6;
  --color-ash: #f2f2f2;

  /* Typography */
  --font-247-grotesk: '247 grotesk', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-ntbau: 'Ntbau', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.3;
  --text-body: 14px;
  --leading-body: 1.25;
  --text-body-lg: 16px;
  --leading-body-lg: 1.25;
  --text-subheading: 19px;
  --leading-subheading: 1.2;
  --text-heading-sm: 28px;
  --leading-heading-sm: 1.14;
  --text-heading: 35px;
  --leading-heading: 1.14;
  --text-heading-lg: 52px;
  --leading-heading-lg: 1;
  --text-display: 73px;
  --leading-display: 1;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-48: 48px;
  --spacing-52: 52px;
  --spacing-56: 56px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-112: 112px;
  --spacing-128: 128px;
  --spacing-184: 184px;

  /* Border Radius */
  --radius-3xl: 33.76px;
  --radius-3xl-2: 42.96px;
}
```
