# Stable Audio — Style Reference
> Sunlit studio on warm paper.

**Theme:** light

Stable Audio uses a warm-paper studio language: the canvas is cream (#f4f1ec) rather than clinical white, letting bold black headlines and a single amber CTA sit on a surface that feels analog and approachable, like a record sleeve. Full-bleed colored panels — lavender, mustard, sage, khaki — function as oversized section backgrounds behind product mockups, giving the page rhythm the way paint-chip swatches might behind a mixing console. Every interactive element is pill-shaped (9999px) and every card surface is a near-sharp 4px, creating a deliberate contrast between round controls and angular content blocks. A signature half-circle "sun" graphic recurs in every track artwork, and a vivid neon green (#a0f32f) marks every audio-active element, making sound visible across the interface. Product screenshots do the explanatory work; illustration and lifestyle photography are deliberately absent.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Amber Pulse | `#f9a916` | `--color-amber-pulse` | Yellow supporting accent for decorative details and low-frequency emphasis. Do not promote it to the primary CTA color |
| Lime Signal | `#a0f32f` | `--color-lime-signal` | Green supporting accent for decorative details and low-frequency emphasis. |
| Lavender Wash | `#c4bae3` | `--color-lavender-wash` | Text-to-audio feature panel background — large full-bleed section tint |
| Mustard Field | `#e1ca46` | `--color-mustard-field` | Audio-to-audio feature panel background — full-bleed section tint |
| Sage Mist | `#9fc2c7` | `--color-sage-mist` | Sound effects feature panel background — full-bleed section tint |
| Khaki Paper | `#e5dfc8` | `--color-khaki-paper` | Secondary panel tint, hero left-column background — warm beige sitting one step darker than the main cream canvas |
| Warm Canvas | `#f4f1ec` | `--color-warm-canvas` | Page background, dominant cream surface — every section and most cards sit on this tone |
| Pure Paper | `#ffffff` | `--color-pure-paper` | Card surfaces, track cards, elevated panels — the only true white in the system |
| Pale Mist | `#e2e2e7` | `--color-pale-mist` | Cool light-gray structural tone for subtle UI layers beneath the warm cream |
| Hairline | `#d2d1db` | `--color-hairline` | Borders, dividers, subtle separators |
| Ink Stone | `#27262b` | `--color-ink-stone` | Secondary text, dark app-interface surfaces, filled toggle states — near-black with a slight warm cast |
| Charcoal | `#000000` | `--color-charcoal` | Dark supporting neutral for text, icons, and strong contrast. Do not promote it to the primary CTA color |
| Ash | `#737170` | `--color-ash` | Muted body text, helper text, metadata — mid-gray for tertiary information |

## Tokens — Typography

### Inter — All text — headlines commit to weight 700 (bold), never 500 or 600; the two-weight commitment is a signature choice that gives the interface a confident, opinionated voice without needing a display face · `--font-inter`
- **Substitute:** DM Sans, Manrope
- **Weights:** 400, 700
- **Sizes:** 12, 14, 16, 18, 20, 30, 40
- **Line height:** 1.00, 1.15, 1.33, 1.50, 1.71, 1.78
- **Letter spacing:** -0.0210em, -0.0170em, -0.0150em, -0.0140em, -0.0110em, -0.0060em
- **Role:** All text — headlines commit to weight 700 (bold), never 500 or 600; the two-weight commitment is a signature choice that gives the interface a confident, opinionated voice without needing a display face

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 18 | -0.07px | `--text-caption` |
| body-sm | 14px | 20 | -0.09px | `--text-body-sm` |
| body | 16px | 25 | -0.1px | `--text-body` |
| subheading | 18px | 28 | -0.2px | `--text-subheading` |
| heading-sm | 20px | 30 | -0.3px | `--text-heading-sm` |
| heading | 30px | 40 | -0.51px | `--text-heading` |
| heading-lg | 40px | 46 | -0.84px | `--text-heading-lg` |

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
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 96 | 96px | `--spacing-96` |
| 128 | 128px | `--spacing-128` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 9999px |
| cards | 4px |
| images | 4px |
| buttons | 9999px |
| toggles | 9999px |
| trackCards | 4px |

### Layout

- **Page max-width:** 1280px
- **Section gap:** 80px
- **Card padding:** 24px
- **Element gap:** 16px

## Components

### Amber CTA Button
**Role:** Primary call-to-action (Sign up, Try now, Generate)

Filled pill, #f9a916 background, #000000 bold text, 9999px border-radius, padding 12px 24px, Inter weight 700 at 14-16px. Often paired with a → arrow icon at the right.

### Ghost Nav Button
**Role:** Secondary nav action (Log in)

White fill, #000000 1px border, 9999px border-radius, #000000 bold text at 14px, padding 8px 20px. Sits inline with the amber CTA in the header.

### Active Toggle Pill
**Role:** Selected state in text-to-audio / audio-to-audio toggle group

Filled pill, #27262b background, #ffffff bold text, 9999px border-radius, padding 8px 20px, Inter weight 700 at 14-16px.

### Inactive Toggle Pill
**Role:** Unselected state in toggle groups

Transparent fill, #000000 1px border, #000000 bold text, 9999px border-radius, same padding as active state.

### Track Card
**Role:** Display a generated music track with artwork, title, description, and player

White #ffffff surface, 4px border-radius, padding 24px. Contains a square half-circle lime-green (#a0f32f) artwork block at top, track title in Inter 700 16px, description in Inter 400 14px #737170, and a 'Try prompt' dark button.

### Try Prompt Dark Button
**Role:** Action inside track cards to reuse the generation prompt

Filled pill, #27262b background, #ffffff bold text, 9999px border-radius, padding 6px 16px, Inter weight 700 at 12-14px.

### Lavender Feature Panel
**Role:** Text-to-audio feature showcase section

Full-bleed #c4bae3 background section, 2-column layout: left column has bold #000000 heading at 30-40px and body copy; right column holds a white product mockup card. Padding 48-64px vertical.

### Mustard Feature Panel
**Role:** Audio-to-audio feature showcase section

Full-bleed #e1ca46 background, same 2-column structure as the lavender panel, with yellow-toned product mockup card on the right.

### Half-Circle Art Graphic
**Role:** Signature track-artwork element

A semi-circular arc shape in #a0f32f filling the top half of a square frame, set against a muted panel color. This 'sun' motif recurs in every track card and product mockup — it is the visual shorthand for 'audio' across the system.

### Audio Waveform Player
**Role:** In-card playback control with timeline and playhead

Horizontal waveform visualization spanning the card width, time labels (0:00 / 3:00) in Inter 400 12px #737170 at each end, circular play button on the left, draggable playhead. Waveform rendered in #27262b against the white card.

### Product Mockup Card
**Role:** Full app interface preview embedded in feature sections

Large white card (#ffffff) with 4px radius, containing a realistic screenshot of the Stable Audio app — prompt input textarea, model selector, duration slider, generate button, and history list. Often set against a colored feature panel.

### Header Bar
**Role:** Site-wide navigation

Transparent bar on the cream canvas, logo 'Stable Audio' with sun-burst icon at top-left in #000000, Sign up (amber) and Log in (ghost) buttons at top-right. Minimal, no background fill.

## Do's and Don'ts

### Do
- Use #f4f1ec Warm Canvas as the page background for every section — never replace it with pure white
- Give every button, tag, and toggle a 9999px border-radius; the pill shape is the system's most recognizable trait
- Use #f9a916 Amber Pulse as the sole fill for primary action buttons (Try now, Sign up, Generate)
- Render headlines at Inter weight 700 with negative tracking (-0.84px at 40px) — do not use weight 500 or 600 for display copy
- Build feature sections as full-bleed colored panels (lavender, mustard, sage, khaki) behind white product mockup cards
- Use the half-circle lime-green (#a0f32f) arc graphic in every track-artwork and music-related visual
- Keep card surface radius at 4px — the contrast between round controls and angular cards is intentional

### Don't
- Do not use #ffffff as a full page or section background — it breaks the warm-paper feeling
- Do not add drop shadows to cards or panels — depth comes from surface color contrast only
- Do not introduce additional button accent colors — amber is the single action color
- Do not use weight 500 or 600 for headlines — the system commits to 700 bold or 400 regular
- Do not use photography, lifestyle imagery, or people in section visuals — product mockups and geometric graphics only
- Do not use square radii on buttons or tags — the 9999px pill is non-negotiable
- Do not use the vivid lime green (#a0f32f) for non-audio UI — reserve it for active sound and waveform elements

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#f4f1ec` | Page background, dominant warm cream surface |
| 1 | Card | `#ffffff` | Elevated card surfaces (track cards, nav, product cards) |
| 2 | Feature Panel | `#c4bae3` | Full-bleed colored section backgrounds (lavender, mustard, sage, khaki variants) |
| 3 | Dark Surface | `#27262b` | Dark app-interface surfaces, active toggle states |

## Elevation

No shadows. Depth is created entirely by surface color contrast — warm cream canvas behind white cards behind full-bleed colored feature panels. The absence of drop shadows keeps the design flat and poster-like, like printed album art.

## Imagery

No photography, no people, no lifestyle imagery. The visual system is pure UI: product mockups (screenshots of the Stable Audio app) and geometric graphic motifs. The signature visual is a half-circle lime-green arc inside a muted square — a flat 'sun' shape that recurs in every track artwork. Audio waveforms are rendered as thin dark bars on white. All imagery is flat, sharp-cornered, and product-focused: the app IS the hero.

## Layout

Full-bleed colored sections with centered max-width content (1280px). Hero is a 2-column split: headline left, product card right, both on the warm cream canvas. Feature sections alternate as full-bleed colored panels (lavender, mustard, sage) each with a 2-column text-left / product-mockup-right structure. Intro sections on white have centered headlines. Vertical rhythm is generous: 80px between sections. Navigation is a transparent bar with no background fill, logo top-left, action buttons top-right. The overall page reads top-to-bottom as: cream hero → centered white intro → lavender feature → mustard feature → sage feature → white CTA, a colorful vertical progression.

## Agent Prompt Guide

## Quick Color Reference
- Text: #000000 (primary) / #27262b (secondary) / #737170 (muted)
- Background: #f4f1ec (canvas) / #ffffff (card)
- Border: #d2d1db
- Accent: #a0f32f (lime green, audio/sound-active only)
- primary action: no distinct CTA color

## Example Component Prompts

No distinct primary action color was observed; use the extracted neutral button treatments instead of inventing a filled CTA color.

2. **Feature Section Panel**: Full-bleed #c4bae3 lavender background, 80px vertical padding, two columns. Left: bold heading Inter 700 30px #000000, body copy Inter 400 16px #27262b, ghost outline button (white fill, #000000 border, 9999px radius). Right: white product mockup card (#ffffff, 4px radius) containing app UI preview.

3. **Toggle Group**: Two pills side by side, 9999px radius, 8px 20px padding, Inter 700 14px. Active: #27262b fill, #ffffff text. Inactive: transparent fill, #000000 1px border, #000000 text.

4. **Header Bar**: Transparent on cream canvas. Logo 'Stable Audio' + sun-burst icon (#000000) at top-left. Top-right: amber 'Sign up' pill (#f9a916, #000000 bold text, 9999px radius) and ghost 'Log in' button (white fill, #000000 border, 9999px radius).

5. **Track Artwork Block**: Square 1:1 frame with 4px radius. Top half: filled #a0f32f lime-green half-circle. Bottom half: muted panel color (e.g. #e5dfc8 khaki). No text inside the art block itself.

## Color Panel System

Colored panels are structural, not decorative. Each major feature section gets a full-bleed background tint from a fixed palette: #c4bae3 (lavender) for text-to-audio, #e1ca46 (mustard) for audio-to-audio, #9fc2c7 (sage) for sound effects. These panels extend edge-to-edge with no border or shadow — the color itself defines the section boundary. Product mockup cards (white, 4px radius) always sit on the right side of these panels, creating a consistent 2-column template that can be reused for any feature.

## Similar Brands

- **Suno AI** — Same music-generation product category with bold black headlines and product-mockup-driven marketing pages
- **Luma AI** — Same flat, poster-like aesthetic with full-bleed colored section panels behind product showcases
- **Runway** — Same commitment to pill-shaped controls, bold display type, and feature-section-as-product-demo layout
- **Stability AI** — Parent brand sibling with a similar warm, confident typographic voice and clean light-mode interface
- **Midjourney** — Same anti-corporate, opinionated visual identity with strong black headlines and minimal chrome

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-amber-pulse: #f9a916;
  --color-lime-signal: #a0f32f;
  --color-lavender-wash: #c4bae3;
  --color-mustard-field: #e1ca46;
  --color-sage-mist: #9fc2c7;
  --color-khaki-paper: #e5dfc8;
  --color-warm-canvas: #f4f1ec;
  --color-pure-paper: #ffffff;
  --color-pale-mist: #e2e2e7;
  --color-hairline: #d2d1db;
  --color-ink-stone: #27262b;
  --color-charcoal: #000000;
  --color-ash: #737170;

  /* Typography — Font Families */
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 18;
  --tracking-caption: -0.07px;
  --text-body-sm: 14px;
  --leading-body-sm: 20;
  --tracking-body-sm: -0.09px;
  --text-body: 16px;
  --leading-body: 25;
  --tracking-body: -0.1px;
  --text-subheading: 18px;
  --leading-subheading: 28;
  --tracking-subheading: -0.2px;
  --text-heading-sm: 20px;
  --leading-heading-sm: 30;
  --tracking-heading-sm: -0.3px;
  --text-heading: 30px;
  --leading-heading: 40;
  --tracking-heading: -0.51px;
  --text-heading-lg: 40px;
  --leading-heading-lg: 46;
  --tracking-heading-lg: -0.84px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-96: 96px;
  --spacing-128: 128px;

  /* Layout */
  --page-max-width: 1280px;
  --section-gap: 80px;
  --card-padding: 24px;
  --element-gap: 16px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-full: 9999px;

  /* Named Radii */
  --radius-tags: 9999px;
  --radius-cards: 4px;
  --radius-images: 4px;
  --radius-buttons: 9999px;
  --radius-toggles: 9999px;
  --radius-trackcards: 4px;

  /* Surfaces */
  --surface-canvas: #f4f1ec;
  --surface-card: #ffffff;
  --surface-feature-panel: #c4bae3;
  --surface-dark-surface: #27262b;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-amber-pulse: #f9a916;
  --color-lime-signal: #a0f32f;
  --color-lavender-wash: #c4bae3;
  --color-mustard-field: #e1ca46;
  --color-sage-mist: #9fc2c7;
  --color-khaki-paper: #e5dfc8;
  --color-warm-canvas: #f4f1ec;
  --color-pure-paper: #ffffff;
  --color-pale-mist: #e2e2e7;
  --color-hairline: #d2d1db;
  --color-ink-stone: #27262b;
  --color-charcoal: #000000;
  --color-ash: #737170;

  /* Typography */
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 18;
  --tracking-caption: -0.07px;
  --text-body-sm: 14px;
  --leading-body-sm: 20;
  --tracking-body-sm: -0.09px;
  --text-body: 16px;
  --leading-body: 25;
  --tracking-body: -0.1px;
  --text-subheading: 18px;
  --leading-subheading: 28;
  --tracking-subheading: -0.2px;
  --text-heading-sm: 20px;
  --leading-heading-sm: 30;
  --tracking-heading-sm: -0.3px;
  --text-heading: 30px;
  --leading-heading: 40;
  --tracking-heading: -0.51px;
  --text-heading-lg: 40px;
  --leading-heading-lg: 46;
  --tracking-heading-lg: -0.84px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-96: 96px;
  --spacing-128: 128px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-full: 9999px;
}
```
