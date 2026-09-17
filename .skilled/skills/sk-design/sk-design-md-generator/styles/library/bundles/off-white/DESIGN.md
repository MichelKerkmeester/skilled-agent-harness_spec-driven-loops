# OFF WHITE — Style Reference
> Glitched editorial monolith on midnight — a wall of pixelated green typography in which portrait photographs of a single human face are pressed into the negative space between monumental letterforms, all on absolute black.

**Theme:** dark

This is a conceptual editorial experience, not a product UI — the visual system weaponizes binary extremes (pure black canvas, pure white text) and three vivid chromatic accents (electric green, alarm red, hi-vis yellow) to physically manifest the site's theme of the 'gray area between black and white.' Typography is deliberately polarized: a custom blocky display face scaled to 180–500px acts as architecture, while a conventional Times serif at 16px whispers against it as editorial annotation. Layout is collage-driven rather than grid-rigid — portrait photographs overlap display type, bleed past frames, and stack in an irregular scatter, producing a zine/protest-poster feel that rejects conventional product UI patterns. Spacing is generous vertically (60–120px) but horizontally dense and chaotic, with no max-width container constraining the canvas. The custom 'Offwhite' display face is the single most important asset in the system: its blocky pixel-inspired geometry makes every letter a sculptural object.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Voltage Green | `#00fb34` | `--color-voltage-green` | Green action color for filled buttons, selected navigation states, and focused conversion moments |
| Alarm Red | `#ff0000` | `--color-alarm-red` | Frame borders, decorative strokes, section dividers — the most-used border color in the system. Borders total 44 instances vs only 12 backgrounds, meaning red reads as a hard rectangular frame or alert outline rather than a surface fill |
| Caution Yellow | `#fff500` | `--color-caution-yellow` | Yellow outline accent for tags, dividers, and focused UI edges |
| Absolute Black | `#000000` | `--color-absolute-black` | Page canvas, photo tile borders (104 image borders), all text colors. The most frequent single color in the system (3357 occurrences) — everything else floats on it |
| Pure White | `#ffffff` | `--color-pure-white` | Hairline borders, dividers, input outlines, and card edges on light surfaces. |
| Ashen Gray | `#aba4a4` | `--color-ashen-gray` | Medium-contrast borders, control outlines, and structural separators. |

## Tokens — Typography

### Offwhite — Sole display and heading face, also used for buttons and links. The blocky pixel-inspired geometry of this custom face is the brand's most important asset — at 180–500px each letter becomes a sculptural object that photographs nest into. Weights 600/700 are reserved for display-scale usage; 400 carries inline link and button use. · `--font-offwhite`
- **Substitute:** Druk Wide Bold, VT323 (for pixel-mood at small sizes), or a custom blocky display sans
- **Weights:** 400, 600, 700
- **Sizes:** 11, 18, 20, 36, 38, 42, 48, 56, 72, 96, 180, 500
- **Line height:** 1.00–1.56 (tight 1.00–1.10 for display, 1.25–1.56 for inline use)
- **Role:** Sole display and heading face, also used for buttons and links. The blocky pixel-inspired geometry of this custom face is the brand's most important asset — at 180–500px each letter becomes a sculptural object that photographs nest into. Weights 600/700 are reserved for display-scale usage; 400 carries inline link and button use.

### Times — Sole body face. The deliberate collision of a conventional serif against the radical blocky display face is a core editorial gesture — Times reads as quiet annotation, the opposite of Offwhite's shout. Body text is always 16px, always Times, always 1.20 leading. · `--font-times`
- **Substitute:** Source Serif Pro, PT Serif, or system 'Times New Roman'
- **Weights:** 400
- **Sizes:** 16
- **Line height:** 1.20
- **Role:** Sole body face. The deliberate collision of a conventional serif against the radical blocky display face is a core editorial gesture — Times reads as quiet annotation, the opposite of Offwhite's shout. Body text is always 16px, always Times, always 1.20 leading.

### Arial — Rare utility use for small button labels and meta text where Times would feel too 'editorial.' Used sparingly (freq=6) — only when functional UI needs a neutral voice. · `--font-arial`
- **Substitute:** Helvetica, Inter, system-ui
- **Weights:** 400
- **Sizes:** 13
- **Line height:** 1.20
- **Role:** Rare utility use for small button labels and meta text where Times would feel too 'editorial.' Used sparingly (freq=6) — only when functional UI needs a neutral voice.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 11px | 1.2 | — | `--text-caption` |
| body | 16px | 1.2 | — | `--text-body` |
| subheading | 18px | 1.3 | — | `--text-subheading` |
| body-lg | 20px | 1.31 | — | `--text-body-lg` |
| heading-sm | 36px | 1.25 | — | `--text-heading-sm` |
| heading-lg | 48px | 1.15 | — | `--text-heading-lg` |
| display | 72px | 1.1 | — | `--text-display` |
| display-lg | 96px | 1 | — | `--text-display-lg` |
| hero | 180px | 1 | — | `--text-hero` |
| monumental | 500px | 1 | — | `--text-monumental` |

## Tokens — Spacing & Shapes

**Base unit:** 6px

**Density:** spacious

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 40 | 40px | `--spacing-40` |
| 60 | 60px | `--spacing-60` |
| 90 | 90px | `--spacing-90` |
| 120 | 120px | `--spacing-120` |

### Border Radius

| Element | Value |
|---------|-------|
| links | 30px |
| images | 0px |
| buttons | 30px |
| surfaces | 0px |
| display-type | 0px |

### Layout

- **Section gap:** 60-120px
- **Card padding:** 40px
- **Element gap:** 40px

## Components

### Monumental Display Letterform
**Role:** Hero scale typography

Custom Offwhite face at 180–500px, line-height 1.00, weight 600 or 700, color #00fb34 on #000000. Each letter is a near-window-sized sculptural object with blocky pixel-inspired geometry. Letters interlock and overlap horizontally to form a single compound word, with portrait photos pressed into the gaps between strokes.

### Portrait Photo Tile
**Role:** Scattered editorial imagery

Sharp-edged (0px radius) rectangular photographs of a single human subject in cinematic dark-moody lighting. Sits at varying scales (roughly 120–280px wide), rotated slightly in some cases, with no internal padding or framing. Always layered against #000000 with no drop shadow — depth comes from z-stacking, not blur.

### Photo Collage Field
**Role:** Hero background composition

Irregular scatter of 12–20 Portrait Photo Tiles filling the negative space between Monumental Display Letterforms. No fixed grid columns — tiles are positioned to accentuate letter geometry, with eyes and faces deliberately placed at letter intersections.

### Editorial Body Passage
**Role:** Narrative annotation

Times 16px / 1.20 line-height, color #fff500 (Caution Yellow) on #000000. Body text is always 16px, never larger or smaller, and the serif/grotesk contrast against the Offwhite display face is the entire point. May run horizontally or rotated 90° vertically through the collage.

### Caution Yellow Hamburger Icon
**Role:** Navigation trigger

Three short horizontal bars in #fff500 (Caution Yellow), 2px stroke weight, positioned top-right. The only navigation UI visible — a minimal intrusion into the editorial composition.

### Red Frame Border
**Role:** Section delimiter / alert frame

Hard rectangular outline in #ff0000 (Alarm Red), 1–4px stroke, sharp 0px corners. Wraps a section, a single photo, or a body passage to signal 'this is the warning / this is the framed statement.' Background stays #000000 inside the frame.

### Filled Action Button
**Role:** Primary CTA

Offwhite face, 13px Arial or 18px Offwhite, weight 400, color #000000 on #00fb34 (Voltage Green) fill, 30px border-radius, padding 12px 24px. The 30px radius is the only soft edge in the system — every other element is sharp.

### Yellow Inline Link
**Role:** In-prose navigation

Offwhite 18px / 1.30, color #fff500, no underline by default, underline on hover. 30px border-radius if it ever becomes a pill-shaped tag. Sits inside Editorial Body Passages as a quiet yellow accent.

### Inverted White Text Block
**Role:** Binary counterpart passage

Times 16px / 1.20, color #000000 on #ffffff, no padding border. Used for passages that need to read as 'the other extreme' of the black/white binary — a literal white panel breaking the black canvas.

### Vertical Text Column
**Role:** Compositional spine

Same Times 16px body type, rotated 90° (reading bottom-to-top), threading vertically through the photo collage. Functions as a visual string connecting the top and bottom of the page composition.

## Do's and Don'ts

### Do
- Scale the Offwhite display face to 180–500px for hero letterforms and keep it at 1.00 line-height — the monumentality is the whole point
- Use 30px border-radius exclusively on buttons and links; everything else (display type, images, frames, surfaces) stays at 0px sharp edges
- Layer Portrait Photo Tiles behind and between display type, never in clean modular grids — the chaos is compositional
- Keep body copy at Times 16px / 1.20 line-height in #fff500 — the serif/grotesk collision against blocky Offwhite is the signature editorial gesture
- Maintain #000000 as the only canvas color across every section, including transition between sections — no light bands
- Use #00fb34 as the only filled action color, and let its neon glow carry CTA visibility against the black canvas

### Don't
- Don't apply box-shadows, drop-shadows, or gradients anywhere — depth must come from z-stacking and color contrast only
- Don't round image corners or display type edges; the blocky 0px geometry is what gives the system its protest-poster identity
- Don't introduce new accent colors beyond the four anchors (#000000, #ffffff, #00fb34, #ff0000, #fff500) — the chromatic vocabulary is intentionally narrow
- Don't constrain the layout to a max-width container; let display type and photos bleed to viewport edges
- Don't set the Offwhite display face below 36px — at small sizes it loses its blocky monumentality and reads as a generic bold sans
- Don't stack body copy in conventional centered columns — float it through the collage, including rotated 90° vertical runs
- Don't use a light background, even for cards or panels, unless intentionally creating a binary 'white extreme' passage with #000000 text

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Midnight Canvas | `#000000` | Full-bleed page background, all sections |
| 1 | Inverse Panel | `#ffffff` | Rare white-on-black inversion blocks, photo card edges |
| 2 | Alert Frame | `#ff0000` | Rectangular border frames, alert outlines |
| 3 | Neon Type Field | `#00fb34` | Display type fills, action backgrounds |
| 4 | Caution Highlight | `#fff500` | Editorial body text, link color, icon color |

## Elevation

Flat by absolute rule. Depth is generated exclusively through z-index layering, color contrast, and photo overlap — never through box-shadow, blur, or gradient. The blocky geometry of the Offwhite display face and the scattered photo tiles are the only depth signals; any soft shadow would dissolve the protest-poster tension the system is built on.

## Imagery

The visual language is single-subject cinematic portraiture: tight crops on a Black man's face (eyes, jaw, three-quarter profile, full-face), lit with high-contrast dark-moody key light, desaturated except for skin tones, set against deep out-of-focus dark backgrounds. Treatment is sharp-edged, never rounded or masked; images are rotated slightly and layered with hard rectangular edges rather than feathered. There is no lifestyle context, no product photography, no illustration — the human face IS the hero content. Density is high: 12–20 portrait tiles crowd the viewport at any given scroll position, deliberately overwhelming the eye. Role is narrative atmosphere, not decorative or explanatory — the portraits embody the site's 'gray area between black and white' theme through human presence.

## Layout

Full-bleed, no max-width container, no modular grid system. The page is built as a single tall vertical composition: Section 1 uses massive green 'OFF' letterforms (180–500px) with portrait photos filling the letter interiors and negative space, running edge-to-edge. Section 2 continues the pattern with 'WHITE' letterforms, same scale, same photo scatter, same black canvas. Body text (Times 16px in #fff500) floats through both sections, including rotated 90° vertical passages. A single yellow hamburger icon sits top-right as the only fixed navigation element. There is no header bar, no footer, no sidebar, no card grid — the composition is closer to a vertical poster or zine spread than a product page. Section gaps are 60–120px of pure black breathing room, but within sections the horizontal composition is dense and chaotic.

## Agent Prompt Guide

QUICK COLOR REFERENCE
• text on canvas: #fff500 (Caution Yellow) on #000000, or #ffffff (Pure White) on #000000
• canvas: #000000 (Absolute Black) — single canvas color, full-bleed
• border: #ff0000 (Alarm Red) for section frames, #000000 for photo tile edges
• accent (display type fill): #00fb34 (Voltage Green) on #000000
• primary action: #00fb34 (filled action)

3–5 EXAMPLE COMPONENT PROMPTS
1. HERO LETTERFORM BLOCK: Build a full-bleed section on #000000 canvas. Set 2–4 Offwhite display characters at 180–500px, line-height 1.00, weight 700, color #00fb34. Layer 8–14 portrait photo tiles (sharp 0px corners, varied sizes 120–280px) into the negative space between strokes, allowing some to extend behind letterforms. Add one Times 16px line in #fff500 floating between letters, possibly rotated 90°.
2. EDITORIAL BODY PASSAGE: Render a paragraph in Times 16px, line-height 1.20, color #fff500 on #000000. No max-width, no border, no background panel. Optionally rotate the entire block 90° to thread vertically through a photo composition.
3. RED ALERT FRAME: Draw a 1–4px #ff0000 rectangular border at 0px radius around a Times 16px passage. Canvas inside the frame stays #000000. Frame sits at the section edge, not centered, with 40px padding around the body text.
4. NAVIGATION TRIGGER: Place three horizontal 2px bars in #fff500, 24px wide with 6px gaps, positioned fixed at top-right with 30px margin. No background, no border — the yellow bars float on the black canvas.
5. FILLED ACTION BUTTON: Offwhite face 18px / 1.30, weight 400, #000000 text on #00fb34 background, 30px border-radius, 12px 24px padding, no border. Sits at the end of an Editorial Body Passage, inline rather than centered.

## Composition Rules

The system operates on a single compositional rule: monumental display type and intimate portrait photography must coexist in the same viewport, and the negative space of one must be filled by the other. Never put the Offwhite display face on a section without portrait tiles, and never show portrait tiles without display type anchoring them. Body text is the third voice and is always subordinate to both — it reads as annotation, never as headline. The four-anchor color palette (#000000, #ffffff, #00fb34, #ff0000, #fff500) is the entire chromatic vocabulary; introducing any additional hue breaks the binary-to-triadic logic the site is built on.

## Similar Brands

- **Virgil Abloh / Off-White™** — Shared quotation-mark and industrial-stencil typographic attitude, black-canvas default, and the deliberate conflation of 'off-white' as both a literal color and a conceptual middle ground
- **Bloomberg Businessweek covers** — Same radical use of full-bleed typography at extreme scale against photographic subjects, with a custom display face doing the work a layout grid would normally do
- **David Carson's Ray Gun era** — Anti-grid collage composition, type set at angles and overlapping imagery, and the rejection of clean product-UI conventions in favor of editorial chaos
- **Saul Bass title sequences** — Monumental single-color typographic forms carved out of black, with imagery pressed into letter-shaped negative space
- **It's Nice That / feature editorial spreads** — Same generous vertical rhythm (60–120px section gaps) and the alternation between a serif body voice and a display sans headline voice

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-voltage-green: #00fb34;
  --color-alarm-red: #ff0000;
  --color-caution-yellow: #fff500;
  --color-absolute-black: #000000;
  --color-pure-white: #ffffff;
  --color-ashen-gray: #aba4a4;

  /* Typography — Font Families */
  --font-offwhite: 'Offwhite', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-times: 'Times', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.2;
  --text-body: 16px;
  --leading-body: 1.2;
  --text-subheading: 18px;
  --leading-subheading: 1.3;
  --text-body-lg: 20px;
  --leading-body-lg: 1.31;
  --text-heading-sm: 36px;
  --leading-heading-sm: 1.25;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.15;
  --text-display: 72px;
  --leading-display: 1.1;
  --text-display-lg: 96px;
  --leading-display-lg: 1;
  --text-hero: 180px;
  --leading-hero: 1;
  --text-monumental: 500px;
  --leading-monumental: 1;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 6px;
  --spacing-40: 40px;
  --spacing-60: 60px;
  --spacing-90: 90px;
  --spacing-120: 120px;

  /* Layout */
  --section-gap: 60-120px;
  --card-padding: 40px;
  --element-gap: 40px;

  /* Border Radius */
  --radius-3xl: 30px;

  /* Named Radii */
  --radius-links: 30px;
  --radius-images: 0px;
  --radius-buttons: 30px;
  --radius-surfaces: 0px;
  --radius-display-type: 0px;

  /* Surfaces */
  --surface-midnight-canvas: #000000;
  --surface-inverse-panel: #ffffff;
  --surface-alert-frame: #ff0000;
  --surface-neon-type-field: #00fb34;
  --surface-caution-highlight: #fff500;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-voltage-green: #00fb34;
  --color-alarm-red: #ff0000;
  --color-caution-yellow: #fff500;
  --color-absolute-black: #000000;
  --color-pure-white: #ffffff;
  --color-ashen-gray: #aba4a4;

  /* Typography */
  --font-offwhite: 'Offwhite', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-times: 'Times', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.2;
  --text-body: 16px;
  --leading-body: 1.2;
  --text-subheading: 18px;
  --leading-subheading: 1.3;
  --text-body-lg: 20px;
  --leading-body-lg: 1.31;
  --text-heading-sm: 36px;
  --leading-heading-sm: 1.25;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.15;
  --text-display: 72px;
  --leading-display: 1.1;
  --text-display-lg: 96px;
  --leading-display-lg: 1;
  --text-hero: 180px;
  --leading-hero: 1;
  --text-monumental: 500px;
  --leading-monumental: 1;

  /* Spacing */
  --spacing-40: 40px;
  --spacing-60: 60px;
  --spacing-90: 90px;
  --spacing-120: 120px;

  /* Border Radius */
  --radius-3xl: 30px;
}
```
