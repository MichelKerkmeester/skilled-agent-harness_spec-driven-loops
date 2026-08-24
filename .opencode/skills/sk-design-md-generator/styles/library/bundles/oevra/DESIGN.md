# Oevra — Style Reference
> sage greenhouse at dawn

**Theme:** light

Oevra speaks in a single quiet voice: sage green on white, whispered through enormous light-weight headlines. The chromatic palette is ruthlessly restrained — one muted olive (#778643) does all the talking across text, borders, and the occasional button, while every surface stays a white canvas washed with a soft sage radial gradient. Typography is the show: Suisse Int'l at 300-weight blows up to 90px display sizes that read like a meditation, paired with a 14–15px body in Space Grotesk. Components feel like artifacts in a greenhouse — rounded 15px corners, hairline 1px borders, no shadows, no fills, no decoration. The result is less an interface and more a slow walk through a plant nursery at dawn.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Eucalyptus | `radial-gradient(ellipse at 50% 50%, rgba(119,134,67,0.35) 0%, rgba(119,134,67,0.08) 50%, #ffffff 100%)` | `--color-eucalyptus` | Headline accents, body text emphasis, hairline borders, single filled CTA — the only chromatic voice in the entire system. Muted enough to never shout, present enough to carry the brand; Full-bleed background gradient behind hero and section text. The green is a breath, not a wall — it fades to white at the edges so text remains the focus |
| Ink Black | `#000000` | `--color-ink-black` | Primary text, dividers, image borders, icon strokes. Used at 1px hairline weight almost exclusively — never as a fill |
| Pure Canvas | `#ffffff` | `--color-pure-canvas` | Page background, card surfaces, button text on filled green CTAs. The dominant surface color across the entire site |
| Graphite | `#4e4e4e` | `--color-graphite` | Secondary body text, muted link borders, helper copy, footer text. Quieter than black but still AA-readable on white |
| Mist | `#c8c8c8` | `--color-mist` | Subtle surface wash for elevated panels, image placeholder backgrounds, very faint dividers. Used sparingly to add depth without darkening the page |

## Tokens — Typography

### space-regular — space-regular — detected in extracted data but not described by AI · `--font-space-regular`
- **Weights:** 400
- **Sizes:** 8px, 12px, 14px, 15px
- **Line height:** 1.2, 1.25, 1.3, 1.5
- **Role:** space-regular — detected in extracted data but not described by AI

### Suisse Int'l — Display and headline face. Light weight at 45–90px is the signature — headlines whisper instead of shout, creating a contemplative, editorial tone. Used for all section headlines, hero copy, and feature titles. · `--font-suisse-intl`
- **Substitute:** Inter, Söhne, Neue Haas Grotesk
- **Weights:** 300 (light), 400 (regular)
- **Sizes:** 34px, 45px, 75px, 90px
- **Line height:** 1.0–1.1
- **Role:** Display and headline face. Light weight at 45–90px is the signature — headlines whisper instead of shout, creating a contemplative, editorial tone. Used for all section headlines, hero copy, and feature titles.

### Suisse Int'l — Secondary body and footer text. Regular weight adds density to descriptions and supporting paragraphs beneath light-weight headlines. · `--font-suisse-intl`
- **Substitute:** Inter, Söhne, Neue Haas Grotesk
- **Weights:** 400 (regular)
- **Sizes:** 12px, 14px, 15px
- **Line height:** 1.2–1.3
- **Role:** Secondary body and footer text. Regular weight adds density to descriptions and supporting paragraphs beneath light-weight headlines.

### Space Grotesk — Primary body, UI labels, buttons, and navigation text. The geometric counter-forms pair with Suisse to give dense text a different texture from the display headlines. · `--font-space-grotesk`
- **Substitute:** DM Sans, Inter, General Sans
- **Weights:** 400 (regular)
- **Sizes:** 8px, 12px, 14px, 15px
- **Line height:** 1.2–1.5
- **Role:** Primary body, UI labels, buttons, and navigation text. The geometric counter-forms pair with Suisse to give dense text a different texture from the display headlines.

### System Sans — Micro-utility text, scroll indicators, and fine-print captions where a 1–2 word label sits in the margins. · `--font-system-sans`
- **Substitute:** system-ui, -apple-system, Segoe UI
- **Weights:** 400
- **Sizes:** 8px
- **Line height:** 1.5
- **Role:** Micro-utility text, scroll indicators, and fine-print captions where a 1–2 word label sits in the margins.

### ui-sans-serif — ui-sans-serif — detected in extracted data but not described by AI · `--font-ui-sans-serif`
- **Weights:** 400
- **Sizes:** 8px
- **Line height:** 1.5
- **Role:** ui-sans-serif — detected in extracted data but not described by AI

### suisse-light — suisse-light — detected in extracted data but not described by AI · `--font-suisse-light`
- **Weights:** 400
- **Sizes:** 34px, 45px, 75px, 90px
- **Line height:** 1, 1.1
- **Role:** suisse-light — detected in extracted data but not described by AI

### suisse-regular — suisse-regular — detected in extracted data but not described by AI · `--font-suisse-regular`
- **Weights:** 400
- **Sizes:** 12px, 14px, 15px
- **Line height:** 1.2, 1.25, 1.3
- **Role:** suisse-regular — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| body | 15px | 1.3 | — | `--text-body` |
| subheading | 34px | 1.1 | — | `--text-subheading` |
| heading-sm | 45px | 1.1 | — | `--text-heading-sm` |
| heading | 75px | 1 | — | `--text-heading` |
| display | 90px | 1 | — | `--text-display` |

## Tokens — Spacing & Shapes

**Density:** spacious

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 8 | 8px | `--spacing-8` |
| 11 | 11px | `--spacing-11` |
| 12 | 12px | `--spacing-12` |
| 15 | 15px | `--spacing-15` |
| 19 | 19px | `--spacing-19` |
| 23 | 23px | `--spacing-23` |
| 30 | 30px | `--spacing-30` |
| 38 | 38px | `--spacing-38` |
| 45 | 45px | `--spacing-45` |
| 60 | 60px | `--spacing-60` |
| 83 | 83px | `--spacing-83` |
| 120 | 120px | `--spacing-120` |
| 135 | 135px | `--spacing-135` |
| 180 | 180px | `--spacing-180` |
| 218 | 218px | `--spacing-218` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 15px |
| images | 15px |
| buttons | 22.5px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 75px
- **Card padding:** 30px
- **Element gap:** 23px

## Components

### Navigation Bar
**Role:** Top-level site navigation

Transparent, floats over the sage gradient. Logo (glasses icon + 'oevra' wordmark) at left in white at 12–14px. Nav links (ABOUT, LOGIN) in white, 8–12px Space Grotesk, uppercase. SIGN UP button is a white outlined pill at 22.5px radius with 11px padding. No background fill on the bar itself — the gradient shows through.

### Display Headline Block
**Role:** Hero and section headlines

Text in Suisse Light at 75–90px, line-height 1.0, color #ffffff (on green gradient) or #778643 (on white). Headlines span 3–4 lines, often with a short underline rule breaking the flow. This is the dominant visual element on every section.

### Inset Headline Image
**Role:** Photo embedded mid-headline

A small square photograph (approximately 60–80px) tucked into a headline, replacing a word or sitting inline with text. The image has 15px border-radius and breaks the typographic flow as a deliberate visual surprise.

### Ghost Pill Button
**Role:** Primary call-to-action

GET STARTED / GET THE APP. Outlined pill: 22.5px border-radius, 1px stroke, 11–15px vertical padding, 23–30px horizontal padding. Stroke and text in current text color (white on green sections, black on white sections). Arrow glyph (→→) follows the label. No fill, no shadow.

### Filled Green Button
**Role:** Sole chromatic CTA (SIGN UP in nav context)

The only filled button in the system. Background #778643, text #ffffff, 22.5px border-radius, 1px transparent border, 11px vertical / 23px horizontal padding. Used sparingly — most actions stay ghost/outlined to preserve the airy feel.

### Section Label
**Role:** Small uppercase eyebrow above headlines

AVAILABLE NOW / APP FEATURES. 8–12px Space Grotesk, uppercase, letter-spacing slightly wide, color matches the current text tone (white on green, #778643 on white). Sits to the left of or above the main headline, aligned to its first line.

### Numbered Feature Item
**Role:** Step indicators in feature lists

Three-column row at the section base. Each item: 2-digit number (01, 02, 03) in 8px Space Grotesk above a short uppercase label (THE CREATIVE PROCESS, THE FLOW STATE, GET UNBLOCKED) in Suisse Regular at 12–14px. Column gap 60px.

### Image Card
**Role:** Product screenshot or photograph container

Photograph or product shot placed in the lower-right of sections. 15px border-radius, often with a 1px black hairline border. No shadow, no padding — the image touches the radius edge. Sits at a slight angle or offset from the text grid to feel placed, not gridded.

### Body Description Block
**Role:** Supporting paragraph text

15px Suisse Regular or Space Grotesk, line-height 1.3–1.5, color #4e4e4e. Max width around 45ch. Sits below the display headline, left-aligned, generous margin-top (23–30px). Accompanied by a ghost CTA below it.

### Vertical Scroll Indicator
**Role:** Page-position cue on left margin

Word 'SCROLL' rotated 90° counter-clockwise, 8–12px, 1px line above it. Fixed to the left edge of the viewport, color matches the current section text tone.

### Footer Link Column
**Role:** Footer navigation list

Stack of links in 14–15px Suisse Regular, color #4e4e4, 15px vertical spacing between items. 1px hairline border separates columns. No headings — the list speaks for itself.

### Hairline Divider
**Role:** Visual separation

1px horizontal line in #000000 or #4e4e4, used inline within headlines to break text flow (e.g. a short rule sits between two headline lines). 30–45px width. Decorative typographic pause, not a structural divider.

## Do's and Don'ts

### Do
- Use Suisse Int'l at 300/400 weight for all headlines, scaled 45–90px with line-height 1.0–1.1
- Apply the Sage Mist radial gradient as the default page background wash — it should breathe, not saturate
- Reach for #778643 on text, borders, and the single filled CTA — never on large filled surfaces
- Use 15px border-radius on cards and images, 22.5px on all interactive elements (buttons, links, pills)
- Set section gaps at 75px and card padding at 30px — the spaciousness IS the brand
- Keep body text at 15px with 1.3 line-height in #4e4e4 for graphite-toned supporting copy
- Pair every display headline with a short uppercase section label (8–12px) as its anchor

### Don't
- Do not introduce a second chromatic color — the entire palette is one green and four neutrals
- Do not use bold or semibold weights for headlines; light weight at large size is the signature
- Do not apply box-shadows, glows, or blur effects for elevation — separation comes from whitespace and hairlines
- Do not use sharp corners (0–4px radius) on any surface or interactive element
- Do not use #778643 as a solid page or section background — it must always be diluted by the gradient or rendered as a thin line
- Do not crowd the layout with small text; if a paragraph exceeds 3 lines, the type is too small for the system
- Do not use icon fills or saturated illustrations — the visual language is photography, type, and gradient only

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#ffffff` | Page background, full-bleed white |
| 1 | Sage Mist | `#778643` | Soft radial gradient overlay on canvas — atmospheric, not structural |
| 2 | Mist Panel | `#c8c8c8` | Subtle elevated surface for image placeholders and light separators |

## Elevation

Elevation does not exist in this system. Surfaces are separated by whitespace, 1px hairlines, and the sage gradient wash — never by shadow. Adding a shadow would shatter the flat, greenhouse-like calm that defines the brand.

## Imagery

Imagery is restrained and photographic, never illustrated or 3D. Product screenshots (phone in hand, app UI crops) appear in 15px-radius image cards with hairline borders, positioned in the lower-right of sections as visual counterweights to text. One signature move: a small square photo is inset directly into a display headline, breaking the typographic line as a deliberate moment of surprise. Backgrounds are never photographic — they are always the sage radial gradient. No icons, no illustrations, no decorative graphics.

## Layout

Full-bleed page with a soft sage radial gradient that fills the entire viewport. Content sits in a max-width 1200px container, but sections rarely feel boxed — headlines span 70–80% of the viewport width and breathe against the gradient. Hero opens with a centered/left-aligned display headline (90px) and supporting copy, with a ghost CTA anchored to the bottom-right corner. A vertical 'SCROLL' indicator lives on the far left margin. Subsequent sections alternate between green-wash backgrounds and white, each anchored by a 45–90px Suisse Light headline, a small uppercase section label to its left, and body copy with a ghost CTA below. Numbered feature items (01, 02, 03) sit at section bases in a 3-column row. Image cards break the grid by floating into the lower-right, slightly offset from the text column. Navigation is transparent and floats over the hero gradient. The overall rhythm is slow, vertical, and editorial — a single column of generous sections rather than a dense multi-column dashboard.

## Agent Prompt Guide

**Quick Color Reference**
- background: #ffffff (with #778643 radial gradient wash)
- text: #000000 (primary), #4e4e4e (secondary), #778643 (accent)
- border: #000000 or #4e4e4e at 1px hairline
- accent: #778643
- primary action: #778643 (filled action)

**Example Component Prompts**
1. *Hero Section*: Full-bleed #ffffff base with radial-gradient(ellipse at 50% 50%, rgba(119,134,67,0.35), rgba(119,134,67,0.08) 50%, #ffffff 100%). Centered display headline at 90px Suisse Int'l weight 300, color #ffffff, line-height 1.0, spanning 3 lines. Below: 15px Space Grotesk weight 400, color #4e4e4e, max-width 45ch. Ghost pill CTA at bottom-right: 1px white stroke, 22.5px radius, 11px/23px padding, 12px Space Grotesk uppercase label + →→ arrow.

2. *Feature Section on White*: White background. 8px uppercase section label '#778643' left-aligned, 45px Suisse Int'l weight 300 headline in #778643. Small 60px square photograph with 15px radius inset into the headline line. Below: 15px Space Grotesk body in #4e4e4e, 30px gap to ghost outline button (1px #000 stroke, 22.5px radius).

3. *Numbered Feature Row*: Three columns at section base, 60px column gap. Each item: 8px '#778643' number (01, 02, 03) above 12px Space Grotesk uppercase label in #000000.

4. *Product Image Card*: Photograph at 15px border-radius with 1px #000000 hairline border, positioned bottom-right of section, overlapping the text column slightly. No padding, no shadow.

5. *Navigation Bar*: Transparent over gradient. Left: 12px white logo + 'oevra'. Right: 8–12px white Space Grotesk uppercase nav links (ABOUT, LOGIN) + white outlined pill button (SIGN UP) at 22.5px radius, 1px white stroke, 11px/23px padding.

## Similar Brands

- **Headspace** — Same soft, organic atmosphere with a single muted accent color against generous white space and rounded components
- **Calm** — Editorial-grade display headlines at 60–80px+, whisper-light weights, and a nature-evoking palette that relies on whitespace instead of decoration
- **Notion AI** — Monochrome interface with one chromatic accent used in text and thin borders rather than large fills; large confident display type
- **Linear** — Spacious single-column layouts with 15px-radius surfaces, hairline borders, and zero shadow elevation
- **Are.na** — Restrained two-tone palette (neutral + one accent), oversized editorial headlines, and a contemplative, slow-scrolling rhythm

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-eucalyptus: #778643;
  --gradient-eucalyptus: radial-gradient(ellipse at 50% 50%, rgba(119,134,67,0.35) 0%, rgba(119,134,67,0.08) 50%, #ffffff 100%);
  --color-ink-black: #000000;
  --color-pure-canvas: #ffffff;
  --color-graphite: #4e4e4e;
  --color-mist: #c8c8c8;

  /* Typography — Font Families */
  --font-space-regular: 'space-regular', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-suisse-intl: 'Suisse Int'l', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-space-grotesk: 'Space Grotesk', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-system-sans: 'System Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-ui-sans-serif: 'ui-sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-suisse-light: 'suisse-light', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-suisse-regular: 'suisse-regular', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-body: 15px;
  --leading-body: 1.3;
  --text-subheading: 34px;
  --leading-subheading: 1.1;
  --text-heading-sm: 45px;
  --leading-heading-sm: 1.1;
  --text-heading: 75px;
  --leading-heading: 1;
  --text-display: 90px;
  --leading-display: 1;

  /* Typography — Weights */
  --font-weight-regular: 400;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-11: 11px;
  --spacing-12: 12px;
  --spacing-15: 15px;
  --spacing-19: 19px;
  --spacing-23: 23px;
  --spacing-30: 30px;
  --spacing-38: 38px;
  --spacing-45: 45px;
  --spacing-60: 60px;
  --spacing-83: 83px;
  --spacing-120: 120px;
  --spacing-135: 135px;
  --spacing-180: 180px;
  --spacing-218: 218px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 75px;
  --card-padding: 30px;
  --element-gap: 23px;

  /* Border Radius */
  --radius-xl: 15px;
  --radius-2xl: 22.5px;

  /* Named Radii */
  --radius-cards: 15px;
  --radius-images: 15px;
  --radius-buttons: 22.5px;

  /* Surfaces */
  --surface-canvas: #ffffff;
  --surface-sage-mist: #778643;
  --surface-mist-panel: #c8c8c8;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-eucalyptus: #778643;
  --color-ink-black: #000000;
  --color-pure-canvas: #ffffff;
  --color-graphite: #4e4e4e;
  --color-mist: #c8c8c8;

  /* Typography */
  --font-space-regular: 'space-regular', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-suisse-intl: 'Suisse Int'l', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-space-grotesk: 'Space Grotesk', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-system-sans: 'System Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-ui-sans-serif: 'ui-sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-suisse-light: 'suisse-light', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-suisse-regular: 'suisse-regular', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-body: 15px;
  --leading-body: 1.3;
  --text-subheading: 34px;
  --leading-subheading: 1.1;
  --text-heading-sm: 45px;
  --leading-heading-sm: 1.1;
  --text-heading: 75px;
  --leading-heading: 1;
  --text-display: 90px;
  --leading-display: 1;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-11: 11px;
  --spacing-12: 12px;
  --spacing-15: 15px;
  --spacing-19: 19px;
  --spacing-23: 23px;
  --spacing-30: 30px;
  --spacing-38: 38px;
  --spacing-45: 45px;
  --spacing-60: 60px;
  --spacing-83: 83px;
  --spacing-120: 120px;
  --spacing-135: 135px;
  --spacing-180: 180px;
  --spacing-218: 218px;

  /* Border Radius */
  --radius-xl: 15px;
  --radius-2xl: 22.5px;
}
```
