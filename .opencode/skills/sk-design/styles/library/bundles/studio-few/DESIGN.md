# Studio Few — Style Reference
> monochrome letterform sanctuary — a white gallery where black ink is the only ornament

**Theme:** light

Studio Few is a type foundry where the product is the alphabet, so the design recedes entirely. The interface is pure achromatic: white canvas, black ink, a single mid-gray for inactive controls, and almost no decorative chrome. Every screen is a vertical sequence of full-width specimen rows — a tiny label, two thin slider tracks for size and weight, an outlined Trial button, a solid black View button, and then enormous custom type rendered at 115–158px as the hero. The custom Sterling family carries all UI text at 12–14px, while the specimen displays use the foundry's own faces (Formative, Voyager, Anthro, Blok, ArbeitPro, Apex), each shown solo with no surrounding art. The result feels like a gallery wall: the only thing with visual weight is the letterform itself.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Ink Black | `#000000` | `--color-ink-black` | Body text, button fills, hairline borders, slider tracks, active states — the single dominant tone that gives every specimen its anchor |
| Paper White | `#ffffff` | `--color-paper-white` | Page canvas, card surfaces, input fills, button text on dark fills |
| Foam Gray | `#ebedee` | `--color-foam-gray` | Subtle surface lift and low-contrast dividers when a row needs to separate from pure white without using ink |
| Concrete Gray | `#b7b7b7` | `--color-concrete-gray` | Medium-contrast borders, control outlines, and structural separators. |
| Graphite | `#333333` | `--color-graphite` | Secondary surfaces and darker neutral blocks when a row needs more weight than white but less than pure black |
| Mid Ink | `#18181d` | `--color-mid-ink` | Near-black with a barely-perceptible cool cast — used where pure #000000 would feel flat against the slightly warm page |
| Ash | `#858585` | `--color-ash` | Quiet link text and low-emphasis labels |

## Tokens — Typography

### SterlingVF — Workhorse for all UI chrome: navigation, labels, slider values, button text, font metadata, links. The weight 300 is reserved for quiet labels; 400 reads as the default body voice; 500 only appears on active or selected states. A barely-positive tracking (0.017em) at 12–14px gives small caps a calm, typeset quality rather than a screen-reading feel. · `--font-sterlingvf`
- **Substitute:** Inter, Söhne, Neue Haas Grotesk
- **Weights:** 300, 400, 500
- **Sizes:** 12, 14, 16px
- **Line height:** 1.33 – 1.71
- **Letter spacing:** 0.196 – 0.238px at body sizes; -0.28px at 14px for tight labels
- **Role:** Workhorse for all UI chrome: navigation, labels, slider values, button text, font metadata, links. The weight 300 is reserved for quiet labels; 400 reads as the default body voice; 500 only appears on active or selected states. A barely-positive tracking (0.017em) at 12–14px gives small caps a calm, typeset quality rather than a screen-reading feel.

### Sterling — Static fallback face for the same UI roles as SterlingVF, used where variable axes aren't needed (icons, simple buttons). Carries a slightly wider tracking than the variable sibling to stay legible at very small sizes. · `--font-sterling`
- **Substitute:** Inter
- **Weights:** 400, 500
- **Sizes:** 12, 14, 16px
- **Line height:** 1.33 – 2.17
- **Letter spacing:** 0.204px at 12px
- **Role:** Static fallback face for the same UI roles as SterlingVF, used where variable axes aren't needed (icons, simple buttons). Carries a slightly wider tracking than the variable sibling to stay legible at very small sizes.

### Formative — Showcase serif. Drawn at 158px as the hero specimen, its tight -0.02em tracking and unit line-height let the letterforms touch shoulder-to-shoulder — a wall of type, not a line of type. · `--font-formative`
- **Substitute:** Tiempos Headline, GT Sectra Display
- **Weights:** 400
- **Sizes:** 158px
- **Line height:** 1.00
- **Letter spacing:** -3.16px
- **Role:** Showcase serif. Drawn at 158px as the hero specimen, its tight -0.02em tracking and unit line-height let the letterforms touch shoulder-to-shoulder — a wall of type, not a line of type.

### Voyager — Showcase display face. The -0.10em tracking is the design's most extreme optical choice — letters collapse into each other at 158px to form a continuous black bar, a deliberate counterpoint to the breathable Sterling UI text. · `--font-voyager`
- **Substitute:** Druk, Compressed
- **Weights:** 400
- **Sizes:** 158px
- **Line height:** 0.70 – 1.00
- **Letter spacing:** -15.8px
- **Role:** Showcase display face. The -0.10em tracking is the design's most extreme optical choice — letters collapse into each other at 158px to form a continuous black bar, a deliberate counterpoint to the breathable Sterling UI text.

### BlokVF — Geometric display specimen. Uses normal letter-spacing — the only showcase face that doesn't pull tight — because its blocky geometry already has built-in density. · `--font-blokvf`
- **Substitute:** GT America Mono, ABC Diatype Mono
- **Weights:** 400
- **Sizes:** 115px
- **Line height:** 1.20 – 1.71
- **Role:** Geometric display specimen. Uses normal letter-spacing — the only showcase face that doesn't pull tight — because its blocky geometry already has built-in density.

### ArbeitProContrastVF — High-contrast serif specimen, shown in the hero photograph as a printed type-on-monitor mockup — the only showcase face presented through photography rather than as raw type on the page. · `--font-arbeitprocontrastvf`
- **Substitute:** GT Sectra, Lyon Display
- **Weights:** 400
- **Sizes:** 158px
- **Line height:** 1.00
- **Letter spacing:** -3.16px
- **Role:** High-contrast serif specimen, shown in the hero photograph as a printed type-on-monitor mockup — the only showcase face presented through photography rather than as raw type on the page.

### AnthroVF — Humanist sans specimen at display scale, pairing weight 400 and tight tracking to show a softer counterpoint to Blok's geometry. · `--font-anthrovf`
- **Substitute:** GT Walsheim, Söhne Breit
- **Weights:** 400
- **Sizes:** 158px
- **Line height:** 1.00
- **Letter spacing:** -3.16px
- **Role:** Humanist sans specimen at display scale, pairing weight 400 and tight tracking to show a softer counterpoint to Blok's geometry.

### ApexVF — Display specimen with the loosest line-height of the showcase set, letting ascenders and descenders breathe vertically. · `--font-apexvf`
- **Substitute:** Druk Wide, Reckless
- **Weights:** 400
- **Sizes:** 158px
- **Line height:** 1.71
- **Role:** Display specimen with the loosest line-height of the showcase set, letting ascenders and descenders breathe vertically.

### Arbeittechnikvf — Technical/industrial specimen, tight tracking and unit line-height so its monoline forms read as a structural element. · `--font-arbeittechnikvf`
- **Substitute:** GT America Mono, Aktiv Grotesk
- **Weights:** 400
- **Sizes:** 158px
- **Line height:** 1.00
- **Letter spacing:** -3.16px
- **Role:** Technical/industrial specimen, tight tracking and unit line-height so its monoline forms read as a structural element.

### Work Sans — Failsafe for any environment where the custom Sterling face cannot load — never the primary voice, but the only Google face in the system. · `--font-work-sans`
- **Substitute:** Inter, Source Sans 3
- **Weights:** 400
- **Sizes:** 16px
- **Line height:** 1.50
- **Role:** Failsafe for any environment where the custom Sterling face cannot load — never the primary voice, but the only Google face in the system.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.5 | 0.204px | `--text-caption` |
| body-sm | 14px | 1.43 | 0.196px | `--text-body-sm` |
| body | 16px | 1.5 | — | `--text-body` |
| display | 115px | 1.2 | — | `--text-display` |
| display-lg | 158px | 1 | -3.16px | `--text-display-lg` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 12 | 12px | `--spacing-12` |
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 36 | 36px | `--spacing-36` |
| 112 | 112px | `--spacing-112` |
| 136 | 136px | `--spacing-136` |
| 160 | 160px | `--spacing-160` |

### Border Radius

| Element | Value |
|---------|-------|
| images | 2px |
| buttons | 6px |
| controls | 2px |

### Layout

- **Section gap:** 80-120px
- **Card padding:** 24px
- **Element gap:** 16px

## Components

### Top Navigation Bar
**Role:** Primary site navigation

Full-bleed white bar, 12px right padding for the nav cluster, left-aligned 'Fe' logomark in #000000, right-aligned text links (Fonts, Mockups, Branding) in SterlingVF 14px weight 400 #000000, followed by a cart icon with a numeric count in SterlingVF 12px. Hairline 1px #000000 bottom border at low opacity, no background fill change on scroll.

### Logomark
**Role:** Brand mark

Two-letter mark 'Fe' rendered in SterlingVF weight 500, 16px, #000000, 0 letter-spacing. Always left-aligned, always at the same baseline as the nav links — no logo lockup, no tagline.

### Font Specimen Row
**Role:** Core content unit — one row per typeface

Full-width white row separated from the next by a 1px #ebedee hairline. Internal grid: left cluster (font name in SterlingVF 12px weight 400 uppercase tracking 0.017em #000000, plus a small play icon in a 6px-radius circular button), center cluster (SIZE slider at 1/3 width, WEIGHT slider at 1/3 width, each with a 1px #000000 track and a 12px #000000 thumb), right cluster (Trial outlined button + View filled button). Below the controls, the specimen itself runs edge-to-edge in the showcase face at 115–158px, #000000, line-height 1.0, padding 24px top, 24px bottom.

### Hero Specimen Image
**Role:** Full-bleed photographic type mockup

Edge-to-edge photograph showing a physical type-on-screen composition — a monitor displaying a type specimen, set on a dark stone or concrete surface. The image carries the page's only tonal variation. 0 border-radius, 0 padding, full viewport width.

### Play / Preview Button
**Role:** Specimen interaction trigger

24×24px circular button, 6px radius, 1px #000000 border, transparent background. Contains a small triangle play glyph in #000000 at 10px. Sits to the right of the font name label.

### Size Slider
**Role:** Live-resize control for the specimen

1px #000000 hairline track spanning the column width, with a 12px circular #000000 thumb. Label 'SIZE' in SterlingVF 12px uppercase, current value displayed on the left in SterlingVF 12px weight 400. Min/max labels omitted — the current value is the only readout.

### Weight Slider
**Role:** Live-weight control for the specimen

Identical construction to the Size Slider. Label 'WEIGHT' with current value. The weight value rendered next to the label updates in real time as the thumb moves, giving the visitor immediate feedback on the typeface's weight range.

### Trial Button
**Role:** Outlined secondary action

SterlingVF 14px weight 400 #000000, 1px #000000 border, transparent background, 6px radius, 24px horizontal padding, 12px vertical padding. No hover fill — the button remains a wireframe at all times, its outline is its only identity.

### View Button
**Role:** Primary neutral action

SterlingVF 14px weight 500 #ffffff text on a #000000 fill, 6px radius, 24px horizontal padding, 12px vertical padding, 1px #000000 border. The page's only solid button — the filled counterpart to the outlined Trial, used wherever a committed action is needed (open specimen, add to cart).

### Display Type Specimen
**Role:** The foundry's product, shown at full scale

A single word or short phrase set in the showcase face at 115–158px, #000000, line-height 1.0, letter-spacing -0.02em (or -0.10em for Voyager). Always full-width of its container, with 24px vertical padding above and below. The specimen word is chosen to show the face's character set — mixed caps, descenders, and punctuation.

### Section Divider
**Role:** Vertical separation between specimen rows

A single 1px #ebedee or #b7b7b7 hairline running the full content width. The only structural divider in the system — no boxes, no cards, no shadows. Each row breathes into the next.

### Cart Indicator
**Role:** Top-right shopping cart state

Small line-drawn shopping bag icon in SterlingVF 16px #000000, followed by a numeric count in SterlingVF 12px weight 400. Always paired with the nav links, never a separate widget.

## Do's and Don'ts

### Do
- Use #000000 as the only ink and #ffffff as the only paper — no chromatic accents, no gradients, no color tints on any UI element.
- Set all UI text in SterlingVF at 12–14px with the 0.017em positive tracking the face ships with; the tracking is part of the foundry's identity, not a setting to override.
- Render every showcase face at 115–158px, line-height 1.0, letter-spacing -0.02em (or -0.10em for Voyager) so the letterforms collapse into a single typographic mass.
- Use 6px radius for all buttons and 2px for everything else; the radius vocabulary is exactly two values, never three.
- Separate specimen rows with a 1px #ebedee or #b7b7b7 hairline, never with background color changes, shadows, or cards.
- Pair an outlined Trial button (transparent fill, 1px ink border) with a filled View button (ink fill, paper text) as the only button pattern in the system.
- Use 16px for row/column gaps inside a specimen row and 24px for button padding — the 4px base unit makes these the only spacing values that should ever appear.

### Don't
- Do not introduce any chromatic color — no blue links, no green success states, no red warnings; the page is 0% colorful and must stay that way.
- Do not use shadows, glows, or any elevation effects; depth in this system comes from hairline borders and surface tone changes only.
- Do not set showcase type below 115px or above 158px — the specimen is a fixed scale, not a responsive fluid range.
- Do not add borders to images, avatars, or icons; the system uses 2px radius on a single element type and 0 on everything else.
- Do not use rounded pills (9999px radius) for buttons; the 6px radius is the foundry's signature geometric proportion.
- Do not wrap UI controls in cards, panels, or containers — sliders and buttons sit directly on the row background.
- Do not use Work Sans or any Google fallback as a visible UI face; Sterling is the only voice, and Work Sans is a silent failsafe.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Paper | `#ffffff` | Full-page canvas and every specimen row's background |
| 1 | Foam | `#ebedee` | Imperceptible lift for input fields and soft dividers |
| 2 | Graphite Block | `#333333` | Dark secondary surface when a section needs a tonal counterweight to the page |
| 3 | Ink | `#000000` | Heaviest surface — solid buttons, selected states, photographic specimen backdrop |

## Imagery

Imagery is scarce and entirely functional. The only photograph is the hero specimen: a moody, low-key product shot of a monitor displaying a type specimen, set on a dark stone or concrete plinth. It is desaturated to near-monochrome, full-bleed, and unframed — no rounded corners, no drop shadow, no overlay. Everything else on the site is pure typography: no icons beyond thin line glyphs (play, cart), no illustrations, no decorative graphics. The visual language is the type itself, and the photograph exists only to prove the type looks as good in physical space as it does on screen.

## Layout

The page is a single vertical column with full-bleed sections stacked edge-to-edge. The hero is a full-viewport-width photograph with no internal padding. Below it, the page becomes a repeating pattern: a thin control strip (font label, sliders, Trial/View buttons) followed immediately by a giant specimen set in the showcase face. Each row is separated by a single 1px hairline, and rows run from the left edge of the viewport to the right edge — there is no max-width container and no centered column. The top bar is the only horizontally-padded element on the page, with the 'Fe' logomark flush left and the nav links flush right. Vertical rhythm is generous: roughly 80–120px of breathing room between specimen rows so each typeface gets its own silent room. The grid inside each row is a 3-zone flex: left cluster (label + play), center cluster (two sliders), right cluster (two buttons) — no card wraps them, they sit on the white paper directly.

## Agent Prompt Guide

Quick Color Reference
- text: #000000
- background: #ffffff
- border / hairline: #b7b7b7 (soft) or #000000 (active)
- surface lift: #ebedee
- primary action: #000000 (filled action)
- muted / inactive: #858585

Example Component Prompts
1. Specimen Row: full-width white row, 1px #ebedee bottom hairline. Left cluster: font name in SterlingVF 12px weight 400 uppercase, letter-spacing 0.204px, #000000, followed by a 24×24px play button with 1px #000000 border, 6px radius. Center cluster: Size slider and Weight slider, each a 1px #000000 track with a 12px circular #000000 thumb, current value in SterlingVF 12px next to the label. Right cluster: outlined Trial button (SterlingVF 14px #000000, 1px border, transparent fill, 6px radius, 24px / 12px padding) and filled View button (SterlingVF 14px weight 500 #ffffff on #000000 fill, 6px radius, 24px / 12px padding). Below the controls, render a specimen word in a showcase face at 158px, #000000, line-height 1.0, letter-spacing -3.16px, 24px vertical padding.
2. Top Navigation Bar: full-width white bar, 1px #b7b7b7 bottom border. Left: 'Fe' logomark in SterlingVF 16px weight 500 #000000. Right: 'Fonts', 'Mockups', 'Branding' in SterlingVF 14px weight 400 #000000, 12px right padding each, followed by a line-drawn cart icon in #000000 with a count in SterlingVF 12px.
3. Hero Specimen Image: full-bleed photograph of a monitor displaying a type specimen on a dark stone surface. No border, no radius, no overlay, no padding.
4. Weight Slider: 1px #000000 hairline track, 12px circular #000000 thumb, 'WEIGHT' label in SterlingVF 12px uppercase #000000 with current numeric value to its left, all on a transparent background.
5. Display Specimen Word: a single word in a custom serif at 158px, #000000, line-height 1.0, letter-spacing -3.16px, no container, no background, full row width with 24px top and bottom padding.

## Type Specimen Philosophy

Every showcase face is shown at a single canonical display size (115px for Blok, 158px for all others) with a fixed letter-spacing. This is deliberate: the foundry wants visitors to read the face at its intended scale, not at a responsive shrunken size. A specimen at 158px is a specimen; a specimen at 48px is a logo. The system enforces this by treating the display size as a design token, not a CSS value to be interpolated.

## Similar Brands

- **Production Type** — Same monochrome-only specimen presentation where custom type is the only visual element and the surrounding UI is reduced to a single hairline and two buttons per face
- **Grilli Type** — Same typographic-gallery aesthetic with large-scale display specimens and a near-absence of color, relying on letter-tracking decisions (tight on display, positive on labels) to carry the brand
- **Klim Type Foundry** — Same architectural restraint: full-width sections, one typeface per row, sliders for live type testing, and a typographic system that treats chrome as invisible
- **Commercial Type** — Same specimen-as-page-unit approach with neutral UI scaffolding, large display sizes, and slider controls for live weight and size adjustments

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-ink-black: #000000;
  --color-paper-white: #ffffff;
  --color-foam-gray: #ebedee;
  --color-concrete-gray: #b7b7b7;
  --color-graphite: #333333;
  --color-mid-ink: #18181d;
  --color-ash: #858585;

  /* Typography — Font Families */
  --font-sterlingvf: 'SterlingVF', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-sterling: 'Sterling', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-formative: 'Formative', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-voyager: 'Voyager', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-blokvf: 'BlokVF', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-arbeitprocontrastvf: 'ArbeitProContrastVF', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-anthrovf: 'AnthroVF', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-apexvf: 'ApexVF', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-arbeittechnikvf: 'Arbeittechnikvf', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-work-sans: 'Work Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --tracking-caption: 0.204px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.43;
  --tracking-body-sm: 0.196px;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-display: 115px;
  --leading-display: 1.2;
  --text-display-lg: 158px;
  --leading-display-lg: 1;
  --tracking-display-lg: -3.16px;

  /* Typography — Weights */
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-medium: 500;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-36: 36px;
  --spacing-112: 112px;
  --spacing-136: 136px;
  --spacing-160: 160px;

  /* Layout */
  --section-gap: 80-120px;
  --card-padding: 24px;
  --element-gap: 16px;

  /* Border Radius */
  --radius-sm: 2px;
  --radius-md: 6px;

  /* Named Radii */
  --radius-images: 2px;
  --radius-buttons: 6px;
  --radius-controls: 2px;

  /* Surfaces */
  --surface-paper: #ffffff;
  --surface-foam: #ebedee;
  --surface-graphite-block: #333333;
  --surface-ink: #000000;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-ink-black: #000000;
  --color-paper-white: #ffffff;
  --color-foam-gray: #ebedee;
  --color-concrete-gray: #b7b7b7;
  --color-graphite: #333333;
  --color-mid-ink: #18181d;
  --color-ash: #858585;

  /* Typography */
  --font-sterlingvf: 'SterlingVF', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-sterling: 'Sterling', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-formative: 'Formative', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-voyager: 'Voyager', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-blokvf: 'BlokVF', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-arbeitprocontrastvf: 'ArbeitProContrastVF', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-anthrovf: 'AnthroVF', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-apexvf: 'ApexVF', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-arbeittechnikvf: 'Arbeittechnikvf', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-work-sans: 'Work Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --tracking-caption: 0.204px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.43;
  --tracking-body-sm: 0.196px;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-display: 115px;
  --leading-display: 1.2;
  --text-display-lg: 158px;
  --leading-display-lg: 1;
  --tracking-display-lg: -3.16px;

  /* Spacing */
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-36: 36px;
  --spacing-112: 112px;
  --spacing-136: 136px;
  --spacing-160: 160px;

  /* Border Radius */
  --radius-sm: 2px;
  --radius-md: 6px;
}
```
