# Branding — Style Reference
> Black gallery wall, blood-red punctuation — Oversized white display type floats on a void-like dark canvas, interrupted by a single vivid red accent and dramatic ornamental display faces that feel like gallery signage rather than web UI.

**Theme:** dark

SVZ operates in the visual register of a high-fashion editorial: pitch-black canvas, oversized display typography that dominates the viewport, and a single arterial red that appears like a wound in the monochrome. The interface is deliberately sparse — most surfaces carry no chrome at all, letting type, photographic collage, and oversized background shapes do the work. Text is primarily white on near-black, with an off-white (#f3efef) reserved for inverted bodies and footers. Hierarchy is achieved through scale (160px display stepping down to 10px labels) and weight contrast (300 whisper-thin body against 700 blocky caps), never through color or chrome. Every interactive element is ghost or hairline-bordered — the system refuses to shout with buttons, preferring arrows and discover-call links that feel like editorial pull-quotes.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Void Canvas | `#080808` | `--color-void-canvas` | Primary page background; the base upon which all display type and floating shapes sit |
| Absolute Black | `#000000` | `--color-absolute-black` | Deepest surface, decorative fills, icon strokes — the floor beneath the void |
| Charcoal Plate | `#171617` | `--color-charcoal-plate` | Footer and inverted section backgrounds, slightly elevated off the base void |
| Smoke Plate | `#262525` | `--color-smoke-plate` | Secondary surface for content blocks and image treatments layered over the void |
| Graphite Lift | `#393939` | `--color-graphite-lift` | Subtle elevation surface and card background; the only visible shadow color |
| Bone White | `#fcfcfc` | `--color-bone-white` | Primary text, hairline borders, icon outlines — the dominant non-black color in the system |
| Linen | `#f3efef` | `--color-linen` | Inverted body sections, off-white text on dark cards, soft warm-white content surfaces |
| Ash | `#d4d2d2` | `--color-ash` | Muted secondary text, nav labels, subtle borders — the whispered voice between bone and graphite |
| Pebble | `#b5b2b2` | `--color-pebble` | Disabled borders, tertiary helper text, low-priority metadata |
| Iron | `#525252` | `--color-iron` | Link underlines, nav dividers, hairline separators on dark surfaces |
| Arterial Red | `#fe1e34` | `--color-arterial-red` | Sole brand accent — card borders, cursor, hero dot, gradient terminator; the only saturated color and it is used like a heartbeat, not a coat of paint |
| Crimson Pure | `#ff0000` | `--color-crimson-pure` | Heading underline accent and decorative fill — a purer red for typographic emphasis only |

## Tokens — Typography

### Kmr Waldenburg — Primary display and UI typeface across nav, headings, body, buttons, and the full scale from 10px tracked nav labels to 160px hero display. The custom face is the system's signature — its bold caps at 64–160px carry negative tracking (-0.075em to -0.080em) that compresses the letters into architectural blocks. Substitute: Neue Haas Grotesk Display, or Inter at matching weights and tracking. · `--font-kmr-waldenburg`
- **Substitute:** Neue Haas Grotesk Display / Inter
- **Weights:** 300, 400, 700
- **Sizes:** 10, 12, 14, 24, 32, 42, 64, 80, 160
- **Line height:** 0.90, 1.00, 1.05, 1.10, 1.20, 1.50
- **Letter spacing:** Tight: -0.017em at body, -0.038em to -0.050em at headings, -0.075em to -0.080em at 80–160px display; tracked OUT to +0.071em and +0.308em for 10–12px nav labels
- **Role:** Primary display and UI typeface across nav, headings, body, buttons, and the full scale from 10px tracked nav labels to 160px hero display. The custom face is the system's signature — its bold caps at 64–160px carry negative tracking (-0.075em to -0.080em) that compresses the letters into architectural blocks. Substitute: Neue Haas Grotesk Display, or Inter at matching weights and tracking.

### Editorialnew — Serif italic companion — appears as the 'crafting' / 'for the' connective words between display caps and as refined body/heading accents. The contrast of this soft serif whisper against the 700-weight caps is the system's typographic signature. Substitute: Editorial Old, Canela, or Playfair Display Italic. · `--font-editorialnew`
- **Substitute:** Editorial Old / Playfair Display Italic
- **Weights:** 300
- **Sizes:** 14, 20, 32
- **Line height:** 1.00, 1.10, 1.50
- **Letter spacing:** -0.050em at 32px, -0.020em at 20px
- **Role:** Serif italic companion — appears as the 'crafting' / 'for the' connective words between display caps and as refined body/heading accents. The contrast of this soft serif whisper against the 700-weight caps is the system's typographic signature. Substitute: Editorial Old, Canela, or Playfair Display Italic.

### Dirtyline 36 Daysoftype 2022 — Ornamental display face used for single-letter or short-word spectacle moments (the stylized 'a' in 'WE ARE'). Aggressive -0.100em tracking at 24px makes it a sculptural object rather than readable type. Substitute: Tobias, Rogue Serif, or any expressive display serif with calligraphic contrast. · `--font-dirtyline-36-daysoftype-2022`
- **Substitute:** Tobias / Rogue Serif
- **Weights:** 400
- **Sizes:** 24, 64, 80
- **Line height:** 0.90, 1.05, 1.10
- **Letter spacing:** -0.100em at 24px, -0.037em at 64px, -0.030em at 80px
- **Role:** Ornamental display face used for single-letter or short-word spectacle moments (the stylized 'a' in 'WE ARE'). Aggressive -0.100em tracking at 24px makes it a sculptural object rather than readable type. Substitute: Tobias, Rogue Serif, or any expressive display serif with calligraphic contrast.

### system-ui — Quiet body fallback and small icon labels — only used where Kmr Waldenburg's geometric personality would overpower micro-copy. Effectively the 'muted' voice in the type system. · `--font-system-ui`
- **Substitute:** system-ui / -apple-system
- **Weights:** 300, 400
- **Sizes:** 12, 14
- **Line height:** 1.20, 1.50
- **Letter spacing:** normal
- **Role:** Quiet body fallback and small icon labels — only used where Kmr Waldenburg's geometric personality would overpower micro-copy. Effectively the 'muted' voice in the type system.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 10px | 1.2 | 0.8px | `--text-caption` |
| body | 14px | 1.5 | -0.24px | `--text-body` |
| subheading | 24px | 1.1 | -0.91px | `--text-subheading` |
| heading-sm | 32px | 1.05 | -1.6px | `--text-heading-sm` |
| heading | 42px | 1.05 | -2px | `--text-heading` |
| heading-lg | 64px | 1 | -4.8px | `--text-heading-lg` |
| display | 80px | 0.9 | -6px | `--text-display` |
| display-xl | 160px | 0.9 | -12.8px | `--text-display-xl` |

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
| 48 | 48px | `--spacing-48` |
| 56 | 56px | `--spacing-56` |
| 80 | 80px | `--spacing-80` |
| 112 | 112px | `--spacing-112` |
| 128 | 128px | `--spacing-128` |
| 184 | 184px | `--spacing-184` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 3px |
| cards | 8px |
| buttons | 8px |
| largeCards | 14.4px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| sm | `rgba(255, 255, 255, 0.2) 0px 2px 5px 0px inset` | `--shadow-sm` |

### Layout

- **Section gap:** 48-64px
- **Card padding:** 12-24px
- **Element gap:** 24px

## Components

### Ghost CTA Link
**Role:** Primary action affordance across the site

Uppercase 12px Kmr Waldenburg weight 400 with 0.071em letter-spacing, bone-white (#fcfcfc) text on void canvas, paired with a 45° arrow icon. No fill, no background, no border. 32px vertical padding, 8px horizontal. Replaces the conventional button entirely — the system treats calls-to-action as editorial pull-quotes, not UI controls.

### Discovery Call Outlined Button
**Role:** Rare filled-style affordance for high-intent actions

Top-right header element: uppercase 12px tracked text inside an 8px-radius rectangle with a 1px hairline border at #d4d2d2 on the void, containing a diagonal arrow. Internal padding 12px 24px. This is the only element that visually resembles a 'button' in the conventional sense — even it is a ghost.

### Hero Display Headline
**Role:** Page-opening typographic statement

160px Kmr Waldenburg weight 700, all caps, line-height 0.90, letter-spacing -12.8px. White (#fcfcfc) on void (#080808). Small Editorialnew italic weight 300 words ('crafting', 'for the') sit inline at 42px between the caps as connective tissue. The two type families are locked at the same baseline grid.

### Section Transition Headline
**Role:** Mid-page typographic punctuation (e.g. 'WE ARE')

80px Kmr Waldenburg weight 700 with -6px tracking, paired with a single oversized ornamental letter from Dirtyline 36 Daysoftype 2022 in 80–160px. The contrast between blocky geometric caps and a hand-drawn calligraphic glyph is the signature moment.

### Bordered Brand Card
**Role:** Highlighted content card using the brand accent

Background: void or smoke (#080808–#262525). Border: 1px solid #fe1e34. Border-radius: 8px. Internal padding: 24px. The red border is the only chromatic border in the system; it functions as a 'featured' marker, not decoration.

### Standard Card
**Role:** Generic content surface

Background #080808 or #f3efef, 1px hairline border at #d4d2d2 (on dark) or #525252 (on light), 8px radius, 12–24px internal padding. Inset highlight: rgba(255,255,255,0.2) 0px 2px 5px 0px inset on dark variants to suggest a glass edge.

### Hairline Link
**Role:** Inline and nav text links

12–14px Kmr Waldenburg weight 400, uppercase, 0.071em tracking. Underline in #525252 (on dark) or #b5b2b2 (on light). 3px border-radius is reserved for link/nav containers only. No color change on hover — the system relies on weight or position shift instead.

### Top Navigation
**Role:** Primary site navigation bar

Full-width, transparent over void canvas. Logo 'SVZ' top-left in 32px Editorialnew or Kmr Waldenburg caps. Four column groups (AGENCY, WORK, CULTURE, INSIGHTS) centered as tracked uppercase labels with stacked sub-items in 12px. Discovery Call outlined button pinned top-right. No background fill — the nav floats on the void.

### Footer Panel
**Role:** Site footer

Charcoal (#171617) background, full-bleed, bone-white text. Mirrors the nav's column structure. 48px vertical padding minimum.

### Accent Dot
**Role:** Scattered red punctuation across the canvas

Solid 16–24px #fe1e34 circle, no border, no shadow. Appears as a cursor-like marker near CTA areas and as visual rhythm against the void. Functions like a drop of blood in the monochrome system.

### Decorative Background Shape
**Role:** Atmospheric large-scale visual element

Oversized geometric forms (crosses, arrows, letters) rendered in #171617 to #262525 with 8–20% perceived opacity, bleeding off-canvas. Establishes editorial composition without competing with foreground type. No interaction.

### Editorial Body Panel
**Role:** Long-form content section

Linen (#f3efef) background, 080808 text, 14px Kmr Waldenburg weight 400, line-height 1.50, 24px section padding. The only high-density reading surface in the system. 1px #d4d2d2 border or seamless transition from a dark section.

## Do's and Don'ts

### Do
- Let type carry hierarchy — use 80–160px display sizes for hero moments and 10–12px tracked uppercase for metadata; do not introduce color, chrome, or icons to compensate.
- Use #fe1e34 only as a 1px border on one or two featured elements per page, plus the accent dot — the red must remain rare to function as punctuation.
- Mix Kmr Waldenburg caps at 700 with Editorialnew italic weight 300 on the same baseline for editorial contrast — this two-family dialogue is the signature.
- Maintain 0.90–1.10 line-height on all display sizes; the system uses tight leading to let oversized type feel architectural rather than airy.
- Track 10–12px nav and label text OUT to +0.071em–+0.308em and display text IN to -0.050em–-0.080em — letter-spacing is a load-bearing typographic tool, not decoration.
- Anchor interactive elements with a diagonal arrow icon (↗) rather than color, weight, or background change — hover states should shift position or weight, not hue.
- Use #f3efef as the only surface that escapes the void; light sections feel like turning a page in a magazine.

### Don't
- Do not introduce filled buttons, drop shadows, or gradients on UI elements — the system rejects conventional depth and uses a single white inset highlight at most.
- Do not use #fe1e34 as a text color, background fill, or icon color beyond borders and the single accent dot; spreading the red flattens its meaning.
- Do not use Kmr Waldenburg body weights (300/400) for display headings under 64px — the system reserves 700 weight for sizes 42px and above to preserve impact.
- Do not apply border-radius above 14.4px; the system uses crisp 3px (nav/links) and 8px (cards/buttons) only — rounding is a whisper, not a curve.
- Do not place body text below 14px or above 32px without shifting to a display role; 10–12px is reserved for tracked uppercase labels with no sentence structure.
- Do not combine more than two typeface families in a single composition (Kmr Waldenburg + Editorialnew, or + Dirtyline 36); adding a third breaks the editorial discipline.
- Do not use #000000 as a text color on dark surfaces — the void (#080808) and bone-white (#fcfcfc) pairing is the system's reading contract; pure black text only appears on #f3efef.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Void | `#080808` | Page canvas — the absolute floor |
| 1 | Absolute | `#000000` | Deepest surface, behind decorative shapes and image overlays |
| 2 | Charcoal | `#171617` | Footer and inverted content surfaces |
| 3 | Smoke | `#262525` | Elevated content blocks and image treatments |
| 4 | Graphite | `#393939` | Card surface — the only platform that receives the white inset highlight shadow |
| 5 | Linen | `#f3efef` | Inverted body panel — warm-white surface for content contrast |

## Elevation

- **Card (dark variant):** `rgba(255, 255, 255, 0.2) 0px 2px 5px 0px inset`

## Imagery

Imagery is editorial-collage: large-scale photographic textures (leopard-print heart, animal patterns) and oversized geometric shapes bleeding off-canvas in Smoke (#171617–#262525) tones. Full-bleed, no rounded corners, no contained frames — images occupy the canvas like wallpaper, not thumbnails. Photography is high-contrast, dark/moody, often surreal or fashion-editorial, used to punctuate display type rather than explain product. Iconography is minimal: 1px hairline arrows (↗) and stroked SVGs in bone-white on the void. No illustration, no 3D, no abstract gradients on content.

## Layout

Full-bleed dark canvas with no max-width container — content uses generous internal padding (48–64px section gaps) to feel composed against the void. The hero is a full-viewport moment dominated by 160px display type centered or left-aligned, with the dark background visible around all four edges. Sections alternate between void (#080808) and a single inverted linen (#f3efef) body panel, with 48–80px vertical breathing room. Navigation is a transparent top bar; no sticky header, no sidebar. Content arrangement is editorial: asymmetric, with display headlines set as two- or three-line stacks and small italic connectives. Card grids (when used) are 2–3 columns with 24px gaps, 8px radius, and 1px hairline borders.

## Agent Prompt Guide

**Quick Color Reference**
- text: #fcfcfc
- background: #080808
- border: #d4d2d2 (on dark) / #525252 (on light)
- accent: #fe1e34
- primary action: #fe1e34 (filled action)

**3-5 Example Component Prompts**

1. Create a Primary Action Button: #fe1e34 background, #fcfcfc text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.

2. Build a featured project card: background #080808, 1px solid #fe1e34 border, 8px border-radius, 24px padding. Headline 'PROJECT NAME' in 24px Kmr Waldenburg weight 700, color #fcfcfc, letter-spacing -0.91px. Body description in 14px Kmr Waldenburg weight 400, color #d4d2d2, line-height 1.50. The red border is the only chromatic chrome — do not add shadows, fills, or icons.

3. Build the top navigation: transparent background over void canvas. Left: logo 'SVZ' in 32px Kmr Waldenburg weight 700 caps, color #fcfcfc. Center: four column headers (AGENCY, WORK, CULTURE, INSIGHTS) in 10px Kmr Waldenburg weight 400 uppercase, tracked +0.8px, color #d4d2d2, each with 2–3 sub-items in 12px same color directly below at 8px row gap. Right: a Discovery Call outlined button — 8px border-radius rectangle with 1px #d4d2d2 border, 12px 24px padding, 'DISCOVERY CALL ↗' in 12px Kmr Waldenburg weight 400 uppercase, color #fcfcfc, tracked +0.85px.

4. Build an inverted body section: background #f3efef, 64px vertical padding. Body text in 14px Kmr Waldenburg weight 400, color #080808, line-height 1.50. Section heading 'EDITORIAL' in 32px Kmr Waldenburg weight 700, color #080808, letter-spacing -1.6px, uppercase. Use this surface sparingly — it is the only escape from the void and should feel like turning a page.

5. Build a 'WE ARE' transition moment: void background, 80px Kmr Waldenburg weight 700 caps spelling 'WE' and 'RE' with extreme letter-spacing -6px, color #fcfcfc, line-height 0.90. Between them, a single ornamental 160px character from Dirtyline 36 Daysoftype 2022 (a stylized 'a' or calligraphic letterform) as a sculptural object — the geometric caps and the hand-drawn glyph must sit on the same baseline with the cap-height of the glyph matching the cap-height of the surrounding letters.

## Similar Brands

- **Locomotive Mtl** — Same agency-portfolio instinct for oversized display type on dark canvases, with display faces treated as editorial objects rather than UI text
- **Resn** — Dark-mode creative agency site with a single saturated accent color used as punctuation and a refusal of conventional button chrome
- **Huge** — Editorial-magazine layout rhythm, hairline-bordered cards on near-black surfaces, and serif-italic connectives woven into display caps
- **Active Theory** — Full-bleed dark canvas, bleeding decorative shapes behind display type, and a single vivid accent (their neon) used as rare punctuation
- **Ueno** — Agency sites that treat typography as art direction — mixing geometric sans display with editorial serif italics and letting the type do the layout work

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-void-canvas: #080808;
  --color-absolute-black: #000000;
  --color-charcoal-plate: #171617;
  --color-smoke-plate: #262525;
  --color-graphite-lift: #393939;
  --color-bone-white: #fcfcfc;
  --color-linen: #f3efef;
  --color-ash: #d4d2d2;
  --color-pebble: #b5b2b2;
  --color-iron: #525252;
  --color-arterial-red: #fe1e34;
  --color-crimson-pure: #ff0000;

  /* Typography — Font Families */
  --font-kmr-waldenburg: 'Kmr Waldenburg', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-editorialnew: 'Editorialnew', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-dirtyline-36-daysoftype-2022: 'Dirtyline 36 Daysoftype 2022', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-system-ui: 'system-ui', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.2;
  --tracking-caption: 0.8px;
  --text-body: 14px;
  --leading-body: 1.5;
  --tracking-body: -0.24px;
  --text-subheading: 24px;
  --leading-subheading: 1.1;
  --tracking-subheading: -0.91px;
  --text-heading-sm: 32px;
  --leading-heading-sm: 1.05;
  --tracking-heading-sm: -1.6px;
  --text-heading: 42px;
  --leading-heading: 1.05;
  --tracking-heading: -2px;
  --text-heading-lg: 64px;
  --leading-heading-lg: 1;
  --tracking-heading-lg: -4.8px;
  --text-display: 80px;
  --leading-display: 0.9;
  --tracking-display: -6px;
  --text-display-xl: 160px;
  --leading-display-xl: 0.9;
  --tracking-display-xl: -12.8px;

  /* Typography — Weights */
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 8px;
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-80: 80px;
  --spacing-112: 112px;
  --spacing-128: 128px;
  --spacing-184: 184px;

  /* Layout */
  --section-gap: 48-64px;
  --card-padding: 12-24px;
  --element-gap: 24px;

  /* Border Radius */
  --radius-sm: 3px;
  --radius-lg: 8px;
  --radius-xl: 14.4px;

  /* Named Radii */
  --radius-nav: 3px;
  --radius-cards: 8px;
  --radius-buttons: 8px;
  --radius-largecards: 14.4px;

  /* Shadows */
  --shadow-sm: rgba(255, 255, 255, 0.2) 0px 2px 5px 0px inset;

  /* Surfaces */
  --surface-void: #080808;
  --surface-absolute: #000000;
  --surface-charcoal: #171617;
  --surface-smoke: #262525;
  --surface-graphite: #393939;
  --surface-linen: #f3efef;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-void-canvas: #080808;
  --color-absolute-black: #000000;
  --color-charcoal-plate: #171617;
  --color-smoke-plate: #262525;
  --color-graphite-lift: #393939;
  --color-bone-white: #fcfcfc;
  --color-linen: #f3efef;
  --color-ash: #d4d2d2;
  --color-pebble: #b5b2b2;
  --color-iron: #525252;
  --color-arterial-red: #fe1e34;
  --color-crimson-pure: #ff0000;

  /* Typography */
  --font-kmr-waldenburg: 'Kmr Waldenburg', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-editorialnew: 'Editorialnew', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-dirtyline-36-daysoftype-2022: 'Dirtyline 36 Daysoftype 2022', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-system-ui: 'system-ui', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.2;
  --tracking-caption: 0.8px;
  --text-body: 14px;
  --leading-body: 1.5;
  --tracking-body: -0.24px;
  --text-subheading: 24px;
  --leading-subheading: 1.1;
  --tracking-subheading: -0.91px;
  --text-heading-sm: 32px;
  --leading-heading-sm: 1.05;
  --tracking-heading-sm: -1.6px;
  --text-heading: 42px;
  --leading-heading: 1.05;
  --tracking-heading: -2px;
  --text-heading-lg: 64px;
  --leading-heading-lg: 1;
  --tracking-heading-lg: -4.8px;
  --text-display: 80px;
  --leading-display: 0.9;
  --tracking-display: -6px;
  --text-display-xl: 160px;
  --leading-display-xl: 0.9;
  --tracking-display-xl: -12.8px;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-80: 80px;
  --spacing-112: 112px;
  --spacing-128: 128px;
  --spacing-184: 184px;

  /* Border Radius */
  --radius-sm: 3px;
  --radius-lg: 8px;
  --radius-xl: 14.4px;

  /* Shadows */
  --shadow-sm: rgba(255, 255, 255, 0.2) 0px 2px 5px 0px inset;
}
```
