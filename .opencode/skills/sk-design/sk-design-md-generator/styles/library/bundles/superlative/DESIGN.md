# Superlative — Style Reference
> Industrial product monograph behind studio glass. A darkroom vitrine where hardware, label, and oversized headline share one continuous, almost weightless plane.

**Theme:** mixed

Superlative uses an industrial-design monograph language: warm cream canvas, dramatic dark product photography, and large editorial display type that behaves more like a print catalog than a SaaS landing page. Almost all UI is monochrome — the visual interest comes from a single warm ember accent that echoes the LED indicators on the hardware itself, never from decorative gradients or illustration. Components are deliberately sparse and almost sharp — thin 1px borders, tight 3px button radii, 15px gaps — so the product and the typography do the talking. The condensed uppercase labels with wide tracking function as a typographic wiring diagram, identifying every element on screen in the manner of an engineering schematic.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Pulp Cream | `#f6f4f2` | `--color-pulp-cream` | Page canvas, light section backgrounds, the warm off-white that defines the brand's paper-like base layer |
| Graphite Veil | `#e4e3e2` | `--color-graphite-veil` | Subtle card surfaces, hairline divider washes — one shade darker than the canvas for quiet elevation |
| Mid Ash | `#8c8c8c` | `--color-mid-ash` | Muted metadata text, disabled labels, secondary borders — the middle voice between ink and whisper |
| Ink Black | `#141414` | `--color-ink-black` | Primary text, dark section surfaces, the dominant heading color on light backgrounds |
| Charcoal Press | `#232323` | `--color-charcoal-press` | Body text on light backgrounds, secondary text on dark backgrounds — slightly softer than pure ink |
| Vapor | `#ffffff` | `--color-vapor` | Text on dark sections, inverted surface highlights, the lightest tone in the system |
| Null | `#000000` | `--color-null` | Hairline borders, focus outlines, the deepest void — used as a 1px stroke, never as a fill |
| Ember Diode | `#e66f27` | `--color-ember-diode` | Orange wash for highlight backgrounds, decorative bands, and soft emphasis behind content |

## Tokens — Typography

### SL-Regular-Condensed (custom: Superlative Condensed) — The signature labeling voice: product names, category tags, metadata strips. The wide 0.08em tracking at a 15px body size is the system's most identifiable choice — every element announces itself in uppercase condensed caps like a hardware serial plate. · `--font-sl-regular-condensed-custom-superlative-condensed`
- **Substitute:** Barlow Condensed, Roboto Condensed, Oswald
- **Weights:** 400
- **Sizes:** 15px, 23px, 90px
- **Line height:** 1.00 / 1.33
- **Letter spacing:** 0.08em
- **Role:** The signature labeling voice: product names, category tags, metadata strips. The wide 0.08em tracking at a 15px body size is the system's most identifiable choice — every element announces itself in uppercase condensed caps like a hardware serial plate.

### SL-Light (custom: Superlative Light) — Display and editorial heading voice at 90px / line-height 1.00. Weight 400 (not bold) at 90px is anti-convention — most product pages shout with 700 weight; this whispers at 400, letting the white text and negative space do the heavy lifting. Also used at 25px for secondary editorial subheads. · `--font-sl-light-custom-superlative-light`
- **Substitute:** Inter, Söhne, Söhne Buch, Helvetica Neue Light
- **Weights:** 400
- **Sizes:** 25px, 90px
- **Line height:** 1.00 / 1.20
- **Role:** Display and editorial heading voice at 90px / line-height 1.00. Weight 400 (not bold) at 90px is anti-convention — most product pages shout with 700 weight; this whispers at 400, letting the white text and negative space do the heavy lifting. Also used at 25px for secondary editorial subheads.

### SL-Regular (custom: Superlative Regular) — Default body and link text. A single weight at a single 15px size — the body text is deliberately quiet so the condensed labels and display headings dominate the voice. · `--font-sl-regular-custom-superlative-regular`
- **Substitute:** Inter, Söhne, Helvetica Neue, system-ui
- **Weights:** 400
- **Sizes:** 15px
- **Line height:** 1.00
- **Role:** Default body and link text. A single weight at a single 15px size — the body text is deliberately quiet so the condensed labels and display headings dominate the voice.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 15px | 1 | 1.2px | `--text-caption` |
| heading | 23px | 1.33 | 1.84px | `--text-heading` |
| subheading | 25px | 1.2 | — | `--text-subheading` |
| display | 90px | 1 | 7.2px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 8px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 5 | 5px | `--spacing-5` |
| 8 | 8px | `--spacing-8` |
| 11 | 11px | `--spacing-11` |
| 15 | 15px | `--spacing-15` |
| 19 | 19px | `--spacing-19` |
| 20 | 20px | `--spacing-20` |
| 30 | 30px | `--spacing-30` |
| 45 | 45px | `--spacing-45` |
| 60 | 60px | `--spacing-60` |
| 90 | 90px | `--spacing-90` |
| 120 | 120px | `--spacing-120` |
| 240 | 240px | `--spacing-240` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 0px |
| badges | 15px |
| buttons | 3px |

### Layout

- **Section gap:** 60-120px
- **Card padding:** 30px
- **Element gap:** 15px

## Components

### Top Navigation Bar
**Role:** Minimal site header

Full-bleed transparent bar over hero. Left-aligned: 'SUPERLATIVE' wordmark in SL-Regular-Condensed 15px at 0.08em tracking, uppercase, white. Below it: category link 'PRODUCT' in same treatment, clickable. Right-aligned: logo mark in white. No background fill, no border, no shadow — the bar sits directly on the hero image.

### Product Category Label
**Role:** Metadata label identifying product family

Renders as 'SB01 (SPACE BEE) MONOLAB' in SL-Regular-Condensed 15px, uppercase, 0.08em tracking, white. Adjacent 'NEW' badge sits inline. Functions like a hardware spec line — short, monospaced-feel, no decoration.

### NEW Status Badge
**Role:** Pill badge marking recent releases

Rounded pill, 15px border-radius, 11px vertical / 8px horizontal padding. 1px white border, transparent fill, white text in SL-Regular-Condensed 15px uppercase at 0.08em tracking. The 15px radius is the only soft element in the system — badges are the exception to the otherwise sharp geometry.

### Display Headline Overlay
**Role:** Hero editorial headline

90px SL-Light weight 400, white, line-height 1.00, letter-spacing 0.08em (7.2px). Overlaid directly on the dark hero photography. No background plate — the type sits raw on the product image, sometimes with the product silhouette breaking through the letterforms. This is the system's most dramatic typographic moment.

### BUY NOW Button
**Role:** Primary action button

Outlined ghost button: 1px white border, transparent fill, no shadow, 3px border-radius. Inner padding 11px vertical / 19px horizontal. Text: 'BUY NOW' in SL-Regular-Condensed 15px uppercase at 0.08em tracking, white. The 3px radius is deliberately almost-sharp — this is a hardware button, not a friendly chip.

### Ghost Text Link
**Role:** Inline navigation and footer link

SL-Regular 15px, white on dark or #141414 on light. No underline at rest. On hover/active: 1px underline appears. No color change. Part of the typographic labeling system, not a separate button — links behave like text until interacted with.

### Footer Column Heading
**Role:** Footer section label

SL-Regular-Condensed 15px uppercase, 0.08em tracking, muted color (#8c8c8c on dark). Sets up stacked list of links below (NEWS, SUPPORT, CAREERS, COMPANY) rendered in same family at body weight.

### Footer Legal Strip
**Role:** Bottom legal and copyright line

SL-Regular-Condensed 15px uppercase, 0.08em tracking, low-opacity white at the very bottom edge. Reads as part of the hardware's silkscreen rather than as a website footer.

### Product Hero Image
**Role:** Full-bleed product photograph

Dark studio photograph filling the entire viewport. Subject (the SB01 synthesizer) shot in a 3/4 angle with strong directional lighting; orange LED status lights visible on the unit. The image carries the brand's only chromatic moment — the warm ember #e66f27 appears naturally from the hardware's own indicators, never from added color in the UI.

### Hardware Silkscreen Label
**Role:** Inline product specification text

Rendered directly on product photography as if silkscreened onto the unit. SL-Regular-Condensed 15px uppercase at 0.08em tracking, white. Used for labels like 'POWER', 'USB', 'MIDI', 'PEDAL', 'TUNE', 'VCO' — every label echoes the actual silk-screening on the synthesizer faceplate.

### Inverted Section
**Role:** Dark editorial section

Background #141414 or #232323, all text in white or #8c8c8c. Used for dramatic product reveals. Components inside use the same 1px white borders and 3px radii as the hero — the system stays consistent regardless of section inversion.

## Do's and Don'ts

### Do
- Use SL-Regular-Condensed 15px uppercase at 0.08em tracking for every label, tag, and metadata string — this is the system's signature typographic move.
- Render the 90px display headline at weight 400 in SL-Light, never bold; the whisper-weight at display size is the brand's loudest gesture.
- Use 3px border-radius on all buttons and 15px on badges; keep all other elements (cards, images, containers) at 0px radius — the system is almost completely sharp.
- Reserve #e66f27 for LED-status moments, active states, or single-icon accents — never as a fill, gradient, or large surface.
- Stack footers and link lists in tight vertical columns separated by 15px gaps, in the manner of a hardware rear-panel spec plate.
- Let product photography carry all chromatic information; keep the surrounding UI strictly achromatic.
- Use 1px borders in #000000 (on light) or #ffffff (on dark) as the only structural delineation — no shadows, no fills for separation.

### Don't
- Don't introduce a saturated brand color other than #e66f27 — the system is monochrome by design.
- Don't use bold or semibold weights for headlines; weight 400 at 90px is the deliberate choice.
- Don't apply rounded corners larger than 15px — anything softer breaks the industrial-product metaphor.
- Don't add shadows, glows, or gradients for elevation — separation comes from background color shifts and 1px borders only.
- Don't use the condensed font for body copy longer than a few words; its 0.08em tracking and uppercase treatment make it illegible at paragraph length.
- Don't place a filled-color CTA button — the action is always an outlined ghost button in white or #141414.
- Don't use illustration or icon sets that introduce new color; icons should be line-art in the current section's text color.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Pulp Cream Canvas | `#f6f4f2` | Default light section background — the warm off-white 'paper' of the system |
| 1 | Graphite Veil | `#e4e3e2` | Raised card and panel surface on light sections |
| 2 | Charcoal Press | `#232323` | Inverted mid-dark surface for editorial sections |
| 3 | Ink Black | `#141414` | Hero and deepest dark surface for dramatic product photography |

## Elevation

The system deliberately uses zero shadows. Separation between layers is achieved entirely through background color shifts (Pulp Cream → Graphite Veil → Charcoal Press → Ink Black) and 1px hairline borders. This absence of shadow is a core choice: it keeps the surface flat and editorial, evoking a printed monograph or silkscreened hardware faceplate rather than a skeuomorphic app.

## Imagery

The site is image-led in a single specific way: large-format dark studio photography of the hardware itself, shot in dramatic 3/4 angles with directional lighting that picks out the warm orange of the LED indicators. No lifestyle photography, no people, no environments — the synthesizer is always isolated against a dark or warm-neutral background. The product photographs function like product monographs: tight crops, no context, the object as the only subject. No illustration system is used; the only graphic elements are the SL wordmark, a small geometric logo mark, and minimal line-art icons that match the section's text color.

## Layout

Full-bleed edge-to-edge layout with no max-width container. The hero is a single full-viewport dark product photograph with the 90px white headline overlaid as the dominant element, plus a small 'BUY NOW' outlined button and category navigation. Vertical rhythm is generous — 120–240px padding between major sections, with sections alternating between dark (hero, product reveal) and light (specs, editorial) treatments. Navigation is a minimal top bar with left-aligned labels and right-aligned logo, no background fill. Footer areas use stacked single-column text lists at 15px condensed tracking, reading like a hardware rear-panel spec sheet. The page reads top-to-bottom as a sequence of full-bleed editorial plates rather than a grid of cards.

## Agent Prompt Guide

Quick Color Reference:
- text (light bg): #141414
- text (dark bg): #ffffff
- text (muted/metadata): #8c8c8c
- background (light section): #f6f4f2
- background (dark section): #141414
- border (light section): #000000
- border (dark section): #ffffff
- accent / status LED: #e66f27
- primary action: no distinct CTA color

Example Component Prompts:

1. Display headline on dark hero: 90px SL-Light weight 400, color #ffffff, line-height 1.00, letter-spacing 7.2px, uppercase. Sits directly on full-bleed product photograph with no background plate.

2. Category label strip: SL-Regular-Condensed 15px uppercase, letter-spacing 1.2px, color #ffffff on dark or #141414 on light. Renders labels like 'SUPERLATIVE', 'PRODUCT', 'POWER', 'VCO' — every metadata string uses this treatment.

3. Outlined ghost BUY NOW button: 1px solid #ffffff border, 3px border-radius, transparent fill, 11px vertical / 19px horizontal padding. Text: 'BUY NOW' in SL-Regular-Condensed 15px uppercase at 0.08em tracking, white. No shadow, no fill change on hover — the border just thickens to 2px or the text underlines.

4. NEW status pill badge: 15px border-radius, 8px horizontal / 11px vertical padding, 1px solid #ffffff border, transparent background. Text: 'NEW' in SL-Regular-Condensed 15px uppercase at 0.08em tracking, white. The only soft-cornered element in the system.

5. Footer spec column: Stacked vertical list of links (NEWS, SUPPORT, CAREERS, COMPANY) in SL-Regular-Condensed 15px uppercase at 0.08em tracking, color #8c8c8c on dark background, 15px row gap. Above the list: section heading in the same treatment at white. No dividers, no icons — text only.

## Editorial Type Philosophy

The system's voice is established by the contrast between three weights of the same custom family: SL-Light (weight 400) at 90px for display, SL-Regular (weight 400) at 15px for body, and SL-Regular-Condensed (weight 400) at 15px with 0.08em tracking for labels. No bold weights exist. Authority comes from scale and tracking, not weight — a 90px whisper at letter-spacing 7.2px reads as more confident than a 48px bold would, because the restraint signals control. When generating new pages, never reach for font-weight 600 or 700; the entire hierarchy is built on size + tracking + family swap.

## Single-Accent Rule

The warm ember #e66f27 appears on the site only as the color of the hardware's LED status lights in product photography, and as a single status-glow accent on a control or indicator in the UI. It is never used as a button fill, a section background, a link color, or a brand wordmark. This single-accent discipline is what makes the photography feel branded without any UI chrome trying to compete with it. When in doubt: let the photo provide the color, keep the UI grey.

## Similar Brands

- **Teenage Engineering** — Same industrial-product monograph language: dark hero photography of hardware, oversized display type overlaid on product image, monochrome UI with a single warm accent from the device's own indicators.
- **Teenage Engineering — OP-1 product page** — Near-identical treatment: 90px-scale whisper-weight headlines in white on dark product photography, condensed uppercase labels as metadata, outlined ghost button for purchase action.
- **Native Instruments — hardware product pages** — Same full-bleed dark studio photography, 1px hairline borders, monochrome palette, and typographic hierarchy that puts the product image ahead of the UI.
- **Erica Synths** — Same silkscreen-label aesthetic: hardware spec text rendered as if printed on the device, condensed uppercase with wide tracking, warm cream-to-black surface stack.
- **1010 Music** — Same discipline of letting one vivid hardware color (their product's status LEDs) carry all the chromatic information, with a strictly monochrome interface around it.

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-pulp-cream: #f6f4f2;
  --color-graphite-veil: #e4e3e2;
  --color-mid-ash: #8c8c8c;
  --color-ink-black: #141414;
  --color-charcoal-press: #232323;
  --color-vapor: #ffffff;
  --color-null: #000000;
  --color-ember-diode: #e66f27;

  /* Typography — Font Families */
  --font-sl-regular-condensed-custom-superlative-condensed: 'SL-Regular-Condensed (custom: Superlative Condensed)', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-sl-light-custom-superlative-light: 'SL-Light (custom: Superlative Light)', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-sl-regular-custom-superlative-regular: 'SL-Regular (custom: Superlative Regular)', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 15px;
  --leading-caption: 1;
  --tracking-caption: 1.2px;
  --text-heading: 23px;
  --leading-heading: 1.33;
  --tracking-heading: 1.84px;
  --text-subheading: 25px;
  --leading-subheading: 1.2;
  --text-display: 90px;
  --leading-display: 1;
  --tracking-display: 7.2px;

  /* Typography — Weights */
  --font-weight-regular: 400;

  /* Spacing */
  --spacing-unit: 8px;
  --spacing-5: 5px;
  --spacing-8: 8px;
  --spacing-11: 11px;
  --spacing-15: 15px;
  --spacing-19: 19px;
  --spacing-20: 20px;
  --spacing-30: 30px;
  --spacing-45: 45px;
  --spacing-60: 60px;
  --spacing-90: 90px;
  --spacing-120: 120px;
  --spacing-240: 240px;

  /* Layout */
  --section-gap: 60-120px;
  --card-padding: 30px;
  --element-gap: 15px;

  /* Border Radius */
  --radius-sm: 3px;
  --radius-xl: 15px;

  /* Named Radii */
  --radius-cards: 0px;
  --radius-badges: 15px;
  --radius-buttons: 3px;

  /* Surfaces */
  --surface-pulp-cream-canvas: #f6f4f2;
  --surface-graphite-veil: #e4e3e2;
  --surface-charcoal-press: #232323;
  --surface-ink-black: #141414;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-pulp-cream: #f6f4f2;
  --color-graphite-veil: #e4e3e2;
  --color-mid-ash: #8c8c8c;
  --color-ink-black: #141414;
  --color-charcoal-press: #232323;
  --color-vapor: #ffffff;
  --color-null: #000000;
  --color-ember-diode: #e66f27;

  /* Typography */
  --font-sl-regular-condensed-custom-superlative-condensed: 'SL-Regular-Condensed (custom: Superlative Condensed)', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-sl-light-custom-superlative-light: 'SL-Light (custom: Superlative Light)', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-sl-regular-custom-superlative-regular: 'SL-Regular (custom: Superlative Regular)', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 15px;
  --leading-caption: 1;
  --tracking-caption: 1.2px;
  --text-heading: 23px;
  --leading-heading: 1.33;
  --tracking-heading: 1.84px;
  --text-subheading: 25px;
  --leading-subheading: 1.2;
  --text-display: 90px;
  --leading-display: 1;
  --tracking-display: 7.2px;

  /* Spacing */
  --spacing-5: 5px;
  --spacing-8: 8px;
  --spacing-11: 11px;
  --spacing-15: 15px;
  --spacing-19: 19px;
  --spacing-20: 20px;
  --spacing-30: 30px;
  --spacing-45: 45px;
  --spacing-60: 60px;
  --spacing-90: 90px;
  --spacing-120: 120px;
  --spacing-240: 240px;

  /* Border Radius */
  --radius-sm: 3px;
  --radius-xl: 15px;
}
```
