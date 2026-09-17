# Garden Eight — Style Reference
> Monumental cream-paper editorial. A 215px serif headline sits alone on warm parchment, surrounded by floating sculptural forms and ocean-air negative space — the page behaves like the cover plate of an art monograph, not a dashboard.

**Theme:** light

Garden Eight operates as an art-book editorial spread: a warm cream parchment canvas hosts monumental serif type that behaves like gallery wall text rather than product UI. The palette is ruthlessly binary — bone-white surface, ink-black type — and every additional color is treated as intrusion. Layout breathes at near-museum scale, with 180px gutter margins and oversized negative space letting type and sculptural 3D objects become the only content. There is no functional color language: no alert red, no success green, no info blue. Decisions are made by weight, scale, and silence. The system reads more like a couture magazine masthead than a SaaS interface, and any agent reproducing it should prioritize typographic drama and atmospheric restraint over conventional UI affordances.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Parchment | `#dbd6d0` | `--color-parchment` | Page canvas, card surfaces, light dividers, link borders — a warm desaturated bone tone that replaces the conventional near-white and gives the whole system its editorial temperature |
| Carbon Ink | `#1e1f1f` | `--color-carbon-ink` | Primary text, display headlines, nav rules, card borders, icon strokes — near-black with the faintest warm cast that harmonizes with the parchment rather than fighting it |
| Pitch Black | `#000000` | `--color-pitch-black` | Reserved for maximum-contrast display moments and the deepest text on the lightest surfaces — used sparingly so Carbon Ink carries the default reading weight |

## Tokens — Typography

### Lausanne — Primary serif — carries nav labels at 12–15px weight 400, body and link copy at 14–15px weight 400, and the colossal 215px display headline at weight 200. The weight-200 display is the signature: most agencies use 600–700 for monumental type, Lausanne's hairline 200 lets the headline whisper at 215px and still feel like the loudest thing on the page through scale alone · `--font-lausanne`
- **Substitute:** Fraunces (Google Fonts) — shares the modern serif character with optical-size control; for closest free match use Fraunces opsz 144+ at the display size
- **Weights:** 200, 400
- **Sizes:** 12px, 14px, 15px, 215px
- **Line height:** 1.25–1.60 (body), 1.30 (headlines)
- **Role:** Primary serif — carries nav labels at 12–15px weight 400, body and link copy at 14–15px weight 400, and the colossal 215px display headline at weight 200. The weight-200 display is the signature: most agencies use 600–700 for monumental type, Lausanne's hairline 200 lets the headline whisper at 215px and still feel like the loudest thing on the page through scale alone

### Gunsan — Display serif companion — weight 600 at 215px with an aggressively tight 0.77 line-height creates the condensed, high-contrast letterspacing on hero compositions. The 0.77 leading is the tightest in the system and is the only place this font appears · `--font-gunsan`
- **Substitute:** Playfair Display (Google Fonts) — high-contrast modern serif that can replicate the 0.77 line-height drama at display sizes
- **Weights:** 600
- **Sizes:** 215px
- **Line height:** 0.77
- **Role:** Display serif companion — weight 600 at 215px with an aggressively tight 0.77 line-height creates the condensed, high-contrast letterspacing on hero compositions. The 0.77 leading is the tightest in the system and is the only place this font appears

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.5 | — | `--text-caption` |
| body-sm | 14px | 1.5 | — | `--text-body-sm` |
| display | 215px | 0.77 | — | `--text-display` |

## Tokens — Spacing & Shapes

**Density:** spacious

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 10 | 10px | `--spacing-10` |
| 12 | 12px | `--spacing-12` |
| 27 | 27px | `--spacing-27` |
| 30 | 30px | `--spacing-30` |
| 38 | 38px | `--spacing-38` |
| 45 | 45px | `--spacing-45` |
| 60 | 60px | `--spacing-60` |
| 180 | 180px | `--spacing-180` |
| 210 | 210px | `--spacing-210` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 1440px |
| cards | 30px |
| canvas | 0px |
| buttons | 1440px |

### Layout

- **Section gap:** 60px
- **Card padding:** 12-30px
- **Element gap:** 4-10px

## Components

### Monumental Display Headline
**Role:** Hero typography

215px Gunsan weight 600, line-height 0.77, color #1e1f1f on #dbd6d0 canvas. All-caps, centered or left-aligned. This is the single largest typographic element on any screen and should be the only text competing for attention — no subtitle, no supporting copy above the fold.

### Hairline Display Headline
**Role:** Alternative hero typography

215px Lausanne weight 200, line-height 1.30, color #1e1f1f. Same monumental scale but whisper-weight — used when the composition needs to feel like gallery wall text rather than magazine cover. The contrast between 200 and 600 at identical size defines the system's two display voices.

### Top Bar Navigation
**Role:** Global site navigation

Full-width transparent bar over the parchment canvas. Brand wordmark 'GARDEN EIGHT' at 12px Lausanne weight 400, 10px letter-tracking, top-left. Nav items (CASES, ABOUT, ARCHIVES, CONTACT) right-aligned, same 12px Lausanne weight 400, 38–45px horizontal padding between items. AI/JA language toggle at far right in identical treatment. No background fill, no border-bottom — the nav floats on the canvas.

### Pill Button
**Role:** Action trigger

1440px border-radius (true pill). 1px border in #1e1f1f or #dbd6d0 depending on surface, 12px horizontal padding, no fill by default. Text 12–14px Lausanne weight 400. On hover: fill inverts to the border color. The shape is the brand — every interactive element with a border should be a pill, never a rectangle.

### Text Link
**Role:** Inline navigation

12–15px Lausanne weight 400, color inherits from #1e1f1f. Underline is a 1px border-bottom in the same color. No color shift on hover — emphasis is created by weight change (400 → 200 reversal) rather than color, preserving the binary palette.

### Card with 30px Radius
**Role:** Project case, work tile

30px border-radius (the only non-pill, non-zero radius in the system). Surface inherits the parchment canvas — cards are defined by 1px #1e1f1f borders and 12–30px internal padding, not by background fill or shadow. 3D sculptural imagery sits inside these cards and bleeds close to the 30px corners.

### Sculptural 3D Object
**Role:** Atmospheric visual

Organic cream-toned 3D renders (the same hue family as the canvas, not a contrast color) float behind and around display type. Always full-bleed or edge-touching, never contained in a card frame. Shadows on these objects are the only shadow language in the system — the UI itself casts none.

### Language Toggle
**Role:** Locale switcher

Two text tokens (AI / JA) at 12px Lausanne weight 400, 10px gap. Active language underlined with a 1px border-bottom in #1e1f1f. No background, no border, no color change — selection is communicated by the underline rule alone.

### Scroll Indicator
**Role:** Below-fold affordance

Small circular icon at bottom-right of viewport, parchment canvas with 1px #1e1f1f border, 30px diameter. Suggests vertical continuation without arrow language.

## Do's and Don'ts

### Do
- Set display headlines at 215px with line-height 0.77 (Gunsan 600) or 1.30 (Lausanne 200) — never scale down to 'fit'; if it doesn't fit, the layout is wrong
- Use 180px horizontal padding on the page canvas to preserve the gallery-wall negative space
- Make every bordered interactive element a 1440px-radius pill — rectangles are not in the system
- Let 30px radius be the only non-pill corner radius in the entire interface (reserved for cards and image containers)
- Use weight 200 Lausanne for display when the page should feel like exhibition text; switch to Gunsan 600 when the page should feel like a magazine cover
- Keep the palette to two tones — Parchment canvas and Carbon Ink — and let weight + scale carry hierarchy instead of adding a third color
- Let 3D sculptural objects cast soft shadows on the canvas; the rest of the UI is shadowless

### Don't
- Never add accent colors (blue, red, green) for CTAs, alerts, or status — the system is binary and a chromatic action would break the editorial register
- Never use 0–8px corner radius on cards, modals, or image containers — only 30px or 1440px are permitted
- Never apply box-shadow to UI components — shadows belong only to the 3D sculptural elements
- Never set body type above 15px or below 12px — the type system jumps from reading size to monument size with nothing in between
- Never use line-height above 0.85 on display headlines; the 0.77–0.80 range is what creates the stacked, condensed drama
- Never add background fills to nav or buttons by default — borders and text alone carry the visual weight
- Never introduce gradients, patterns, or texture overlays on the canvas — the parchment tone is the only surface treatment

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Parchment Canvas | `#dbd6d0` | The dominant page background — warm bone, never pure white |
| 2 | Ink Plate | `#1e1f1f` | Dark inset sections, inverse cards, and any surface that needs to recede behind Carbon Ink text |

## Elevation

- **Sculptural 3D Object:** `0 30px 60px rgba(30,31,31,0.08), 0 10px 20px rgba(30,31,31,0.04)`

## Imagery

Imagery is dominated by large, organic 3D-rendered sculptural forms in the same warm cream hue family as the canvas. These objects are not product photography or illustration — they are abstract, biomorphic shapes (twisted ribbons, soft pods, melted geometries) rendered in matte cream with soft subsurface lighting. They float behind and around display type, partially overlapping, and treat the page as a shallow 3D stage. There is no human photography, no lifestyle imagery, no UI screenshots. The objects function as atmosphere and texture, not explanation.

## Layout

Full-bleed canvas with 180px horizontal gutter; content is never constrained to a max-width container. The hero is a centered or slightly off-center display headline at 215px with no supporting copy above the fold, set against floating 3D sculptural forms. Section rhythm is minimal — one editorial spread per screen, with generous 60px+ vertical breathing room between sections rather than alternating bands. Navigation is a single transparent top bar with brand-left and nav-right, never sticky-elevated, never shadowed. The overall density is sparse and museum-like: each screen contains one typographic moment and one sculptural moment, separated by silence.

## Agent Prompt Guide

## Quick Color Reference
- text: #1e1f1f
- background: #dbd6d0
- border: #1e1f1f (on light) or #dbd6d0 (on dark)
- accent: none — system is binary
- primary action: no distinct CTA color

## Example Component Prompts
No distinct primary action color was observed; use the extracted neutral button treatments instead of inventing a filled CTA color.

2. **Pill Button Row**: Three pill buttons in a horizontal row, each with 1440px border-radius, 1px solid #1e1f1f border, 12px horizontal padding, transparent fill. Text inside at 12px Lausanne weight 400, color #1e1f1f. 10px gap between pills. No background fill on any state except hover (inverts to #1e1f1f fill with #dbd6d0 text).

3. **Project Card**: 30px border-radius container, 1px solid #1e1f1f border, 30px internal padding, transparent fill inheriting the #dbd6d0 canvas. Project title at 14px Lausanne weight 400, color #1e1f1f. No shadow, no background color shift from the canvas — the border alone defines the card boundary.

4. **Top Bar Navigation**: Transparent overlay on #dbd6d0 canvas. 'GARDEN EIGHT' wordmark top-left at 12px Lausanne weight 400, letter-spacing 0.1em. Nav items (CASES, ABOUT, ARCHIVES, CONTACT) top-right at 12px Lausanne weight 400 with 38px horizontal gap. 'AI | JA' toggle at far right with 10px gap, active language marked by a 1px #1e1f1f border-bottom underline.

5. **Dark Inset Section**: Full-bleed band with #1e1f1f background, 60px vertical padding. Display text at 215px Lausanne weight 200, line-height 1.30, color #dbd6d0. The weight-200 whisper type on the dark surface is the system's secondary hero voice — softer, more contemplative than the Gunsan 600 cover treatment.

## Binary Palette Philosophy

The system deliberately refuses a chromatic accent layer. Every conventional UI signal that would normally be encoded in color (hover, focus, active, error, success) is re-encoded in weight, scale, border, or shape. This is a design choice about register: the studio does not want to feel like a SaaS product, and a blue CTA would immediately collapse the editorial posture. When in doubt, add more #dbd6d0 space rather than a third color.

## Type Scale Jumps

The type system has a dramatic gap between reading size (12–15px) and display size (215px). There is no intermediate 'large heading' tier — the page either whispers at body weight or shouts at 215px. This binary in scale mirrors the binary in color and is core to the system's editorial voice. Intermediate sizes (24px, 32px, 48px) should be avoided; compose hierarchy through weight shifts and the existing two-scale structure.

## Similar Brands

- **Pentagram** — Same binary palette discipline — black type on warm off-white with monumental serif display and museum-scale negative space, no chromatic accents in the system
- **Locomotive (MTL)** — Editorial agency aesthetic with sculptural 3D forms floating behind oversized serif headlines, treating the page as a typographic plate rather than a UI
- **Resn** — Experimental agency sites that treat display type as the only content and use 3D/atmosphere as supporting texture rather than explanatory imagery
- **Bureau Cool** — Portfolio-first agency sites with hairline serif display weights at extreme scale, warm neutral canvases, and zero conventional UI color language

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-parchment: #dbd6d0;
  --color-carbon-ink: #1e1f1f;
  --color-pitch-black: #000000;

  /* Typography — Font Families */
  --font-lausanne: 'Lausanne', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-gunsan: 'Gunsan', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --text-display: 215px;
  --leading-display: 0.77;

  /* Typography — Weights */
  --font-weight-extralight: 200;
  --font-weight-regular: 400;
  --font-weight-semibold: 600;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-27: 27px;
  --spacing-30: 30px;
  --spacing-38: 38px;
  --spacing-45: 45px;
  --spacing-60: 60px;
  --spacing-180: 180px;
  --spacing-210: 210px;

  /* Layout */
  --section-gap: 60px;
  --card-padding: 12-30px;
  --element-gap: 4-10px;

  /* Border Radius */
  --radius-3xl: 30px;
  --radius-full: 1440px;

  /* Named Radii */
  --radius-tags: 1440px;
  --radius-cards: 30px;
  --radius-canvas: 0px;
  --radius-buttons: 1440px;

  /* Surfaces */
  --surface-parchment-canvas: #dbd6d0;
  --surface-ink-plate: #1e1f1f;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-parchment: #dbd6d0;
  --color-carbon-ink: #1e1f1f;
  --color-pitch-black: #000000;

  /* Typography */
  --font-lausanne: 'Lausanne', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-gunsan: 'Gunsan', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --text-display: 215px;
  --leading-display: 0.77;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-27: 27px;
  --spacing-30: 30px;
  --spacing-38: 38px;
  --spacing-45: 45px;
  --spacing-60: 60px;
  --spacing-180: 180px;
  --spacing-210: 210px;

  /* Border Radius */
  --radius-3xl: 30px;
  --radius-full: 1440px;
}
```
