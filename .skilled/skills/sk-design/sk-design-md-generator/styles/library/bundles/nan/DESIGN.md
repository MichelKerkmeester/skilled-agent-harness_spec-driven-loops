# NaN — Style Reference
> mint greenhouse of living letters — a pastel type lab where every headline is the product itself

**Theme:** light

NaN runs its website like a working specimen sheet: the mint-green canvas is the page, and the page is the product. Massive custom display faces (200-336px) are the visual architecture; a monospaced sans (NaN Holo Mono) set in uppercase with 0.075em tracking is the chrome that holds everything together. The palette is ruthlessly tight — one pastel canvas, near-black text (#262626, never pure black), one bright lime accent (#00ff00) for raw typographic flourishes, and a single pink-purple-blue gradient for the lone chromatic CTA. Borders do the work that shadows usually do: 1-2px hairlines define cards, inputs, and the type tester frame with no elevation. The interaction model is a live font tester — sliders for size and leading, dropdowns for family and weight — letting visitors steer the display in real time, which makes the site function as both storefront and demo.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Mint Canvas | `#b7ffb4` | `--color-mint-canvas` | Page background, card surfaces — the signature pastel that makes dark type appear sunlit rather than printed |
| Lime Spark | `#00ff00` | `--color-lime-spark` | Decorative typographic flourishes and SVG scribble overlays — a raw signal-green that contrasts the pastel canvas without warming it |
| Carbon Ink | `#262626` | `--color-carbon-ink` | Primary text, borders, icon strokes, button outlines — softer than pure black, sits on mint without vibrating |
| Obsidian | `#000000` | `--color-obsidian` | Display-type fills at the largest sizes, pure-black SVG fills for the heaviest display specimens |
| Fog | `#999999` | `--color-fog` | Muted helper text, inactive borders, disabled controls — the quietest readable neutral on the mint canvas |
| Smoke | `#767676` | `--color-smoke` | Input field borders in resting state — darker than fog to signal interactivity without competing with the canvas |
| Bone | `#efefef` | `--color-bone` | Light surface for elevated UI bits (button hover, inverted controls) — provides a near-white counterpoint when the canvas needs to recede |
| Paper | `#ffffff` | `--color-paper` | Input field interior, pure-white text on dark inverted moments |
| Aurora Gradient | `linear-gradient(270deg, rgb(255, 163, 182), rgb(221, 169, 255) 33%, rgb(162, 209, 255) 66%, rgb(255, 163, 182))` | `--color-aurora-gradient` | Supporting palette color for small decorative accents when the core palette needs contrast. Do not promote it to the primary CTA color |

## Tokens — Typography

### NaN Holo Mono — All interface chrome — navigation, labels, buttons, form controls, metadata, keyboard hints. Set uppercase with +0.075em tracking, the letter-spacing is the signature that makes mono read as a deliberate UI system rather than terminal output. The weight range lets it flex from thin nav links to heavy button text without leaving the family. · `--font-nan-holo-mono`
- **Substitute:** JetBrains Mono, IBM Plex Mono, Space Mono
- **Weights:** 300, 400, 500, 700, 800, 900
- **Sizes:** 12, 13, 14, 16, 20, 24, 26, 32, 45px
- **Line height:** 1.0–3.0
- **Letter spacing:** 0.075em (≈1.2px at 16px, ≈3.4px at 45px)
- **OpenType features:** `"dlig" 0, "liga" 0`
- **Role:** All interface chrome — navigation, labels, buttons, form controls, metadata, keyboard hints. Set uppercase with +0.075em tracking, the letter-spacing is the signature that makes mono read as a deliberate UI system rather than terminal output. The weight range lets it flex from thin nav links to heavy button text without leaving the family.

### NaN Holo — Prose body and large secondary headlines that need to sit beside display specimens without competing. The 86px weight-300 size is a typographic statement — a humanist counterweight to the blocky display faces above it. · `--font-nan-holo`
- **Substitute:** Inter, Söhne, Untitled Sans
- **Weights:** 300, 400, 700
- **Sizes:** 12, 16, 45, 86px
- **Line height:** 1.2–1.5
- **OpenType features:** `"dlig" 0, "liga" 0`
- **Role:** Prose body and large secondary headlines that need to sit beside display specimens without competing. The 86px weight-300 size is a typographic statement — a humanist counterweight to the blocky display faces above it.

### NaN Archy On ExtraBlack — Hero display headline — the signature specimen face, shown at its native 228px with tight 0.90 leading so the letterforms stack into a near-monolithic mass. This is the typeface the homepage exists to sell. · `--font-nan-archy-on-extrablack`
- **Substitute:** Druk, Compacta, Inter Black Compressed
- **Weights:** 400
- **Sizes:** 228px
- **Line height:** 0.90
- **OpenType features:** `"dlig", "frac" 0, "onum" 0, "ss01" 0, "ss02" 0, "ss03" 0, "ss05" 0, "tnum" 0`
- **Role:** Hero display headline — the signature specimen face, shown at its native 228px with tight 0.90 leading so the letterforms stack into a near-monolithic mass. This is the typeface the homepage exists to sell.

### NaN SuperX Sans Display Black — Secondary display face — ultra-tight 0.85 leading creates a dense typographic slab, the contrast to Archy's rounded forms. Used in alternate hero rotations. · `--font-nan-superx-sans-display-black`
- **Substitute:** Druk Wide, Inter Black, Söhne Breit
- **Weights:** 400
- **Sizes:** 216px
- **Line height:** 0.85
- **OpenType features:** `"dlig", "frac" 0, "onum" 0, "ss01" 0, "ss02" 0, "ss03" 0, "tnum" 0`
- **Role:** Secondary display face — ultra-tight 0.85 leading creates a dense typographic slab, the contrast to Archy's rounded forms. Used in alternate hero rotations.

### NaN SuperX Serif Text Thin Italic — Editorial italic display — the serif counterpoint that proves the practice spans humanist letterforms, not just geometric sans. Thin weight at 216px is a tension device: fragile strokes at monumental size. · `--font-nan-superx-serif-text-thin-italic`
- **Substitute:** Tiempos Headline, Domaine Display, Canela
- **Weights:** 400
- **Sizes:** 216px
- **Line height:** 1.00
- **OpenType features:** `"dlig" 0, "frac" 0, "onum" 0, "ss01" 0, "ss02" 0, "ss03" 0, "ss05" 0, "tnum" 0`
- **Role:** Editorial italic display — the serif counterpoint that proves the practice spans humanist letterforms, not just geometric sans. Thin weight at 216px is a tension device: fragile strokes at monumental size.

### NaN Holo Gigawide Ultra1 — Ultra-condensed display at 336px — the widest single-character scale on the site, used sparingly as a one-word exclamation. · `--font-nan-holo-gigawide-ultra1`
- **Substitute:** Druk Condensed Super, Compacta Black
- **Weights:** 400
- **Sizes:** 336px
- **Line height:** 0.80
- **OpenType features:** `"ss01" 0, "ss02" 0, "ss03" 0, "ss04" 0, "ss05" 0, "ss06" 0, "ss07" 0, "ss08" 0, "ss09" 0, "ss10" 0`
- **Role:** Ultra-condensed display at 336px — the widest single-character scale on the site, used sparingly as a one-word exclamation.

### NaN Rage family (Zipp, Soft, Beau, Sans Narrow) — Card specimen headlines in the 'You Might Have Missed' grid — each card shows the family name rendered in that exact family at 86px, making the grid self-documenting. · `--font-nan-rage-family-zipp-soft-beau-sans-narrow`
- **Substitute:** Recoleta, Pangram Sans, GT America
- **Weights:** 400
- **Sizes:** 86px
- **Line height:** 1.00
- **Role:** Card specimen headlines in the 'You Might Have Missed' grid — each card shows the family name rendered in that exact family at 86px, making the grid self-documenting.

### NaNRageZippNarrowThin — NaNRageZippNarrowThin — detected in extracted data but not described by AI · `--font-nanragezippnarrowthin`
- **Weights:** 400
- **Sizes:** 86px
- **Line height:** 1
- **Role:** NaNRageZippNarrowThin — detected in extracted data but not described by AI

### NaNRageSoftXCondensedRegular — NaNRageSoftXCondensedRegular — detected in extracted data but not described by AI · `--font-nanragesoftxcondensedregular`
- **Weights:** 400
- **Sizes:** 86px
- **Line height:** 1
- **Role:** NaNRageSoftXCondensedRegular — detected in extracted data but not described by AI

### NaNRageBeauStandardSemibold — NaNRageBeauStandardSemibold — detected in extracted data but not described by AI · `--font-nanragebeaustandardsemibold`
- **Weights:** 400
- **Sizes:** 86px
- **Line height:** 1
- **Role:** NaNRageBeauStandardSemibold — detected in extracted data but not described by AI

### NaNRageSansNarrowMedium — NaNRageSansNarrowMedium — detected in extracted data but not described by AI · `--font-nanragesansnarrowmedium`
- **Weights:** 400
- **Sizes:** 86px
- **Line height:** 1
- **Role:** NaNRageSansNarrowMedium — detected in extracted data but not described by AI

### NaNSerfATextLightItalic — NaNSerfATextLightItalic — detected in extracted data but not described by AI · `--font-nanserfatextlightitalic`
- **Weights:** 400
- **Sizes:** 86px
- **Line height:** 1
- **Role:** NaNSerfATextLightItalic — detected in extracted data but not described by AI

### NaNSerfSansLightItalic — NaNSerfSansLightItalic — detected in extracted data but not described by AI · `--font-nanserfsanslightitalic`
- **Weights:** 400
- **Sizes:** 86px
- **Line height:** 1
- **Role:** NaNSerfSansLightItalic — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.5 | — | `--text-caption` |
| body | 16px | 1.5 | 1.2px | `--text-body` |
| subheading | 20px | 1.5 | — | `--text-subheading` |
| heading-sm | 24px | 1.2 | — | `--text-heading-sm` |
| heading | 32px | 1.2 | — | `--text-heading` |
| display-sm | 45px | 1.2 | 3.4px | `--text-display-sm` |
| display | 86px | 1 | — | `--text-display` |
| display-lg | 216px | 0.85 | — | `--text-display-lg` |
| display-xl | 228px | 0.9 | — | `--text-display-xl` |
| display-mega | 336px | 0.8 | — | `--text-display-mega` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** compact

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 8 | 8px | `--spacing-8` |
| 12 | 12px | `--spacing-12` |
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 60 | 60px | `--spacing-60` |
| 80 | 80px | `--spacing-80` |
| 120 | 120px | `--spacing-120` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 18px |
| small | 2px |
| inputs | 2px |
| buttons | 29.4px |

### Layout

- **Page max-width:** 1440px
- **Section gap:** 80px
- **Card padding:** 20px
- **Element gap:** 10px

## Components

### Top Navigation Bar
**Role:** Primary site navigation

Sticky top bar on #b7ffb4 canvas. Left: 'NaN' wordmark in NaN Holo Mono 14px uppercase. Center: nav links (FONTS, COMMISSIONS, PROJECTS, TXT, SHOP, STUDIO) in NaN Holo Mono 14px uppercase, #262626, letter-spacing 0.075em, 32px gap. Right: CART (0), ACCOUNT, then a tri-color circle icon and a small 'NaN' dot. No background fill, no shadow — sits directly on canvas. Bottom edge: no border, sections define their own top spacing.

### Hero Statement Block
**Role:** Opening brand description

Left-aligned paragraph in NaN Holo Mono 26px weight 400, #262626, line-height 2.25. Content fills roughly 75% of viewport width. No background, no border — the text IS the hero. A lime-green (#00ff00) SVG scribble overlays the right portion at ~40% opacity, drawing the eye past the text without blocking it.

### Live Font Tester
**Role:** Interactive type specimen controller

Sectioned widget with four control rows stacked vertically on a #b7ffb4 canvas. Row 1: small section label (◉ Our Latest Font Release, NaN Holo Mono 14px #262626, 0.075em tracking). Row 2: Size slider (left-aligned label 'Size 220px', then NaN Holo Mono 12px, line-track 1px #262626 with 6px #262626 thumb) + Leading slider (right-side label 'Leading', identical track style) + two select dropdowns (NaN Holo Mono 13px, 1px #262626 border, 2px radius, no fill). Row 3: keyboard-shortcut chips (rounded squares, 1px #262626 border, NaN Holo Mono 12px) + a pear emoji. Row 4: a massive display specimen in the selected family at the selected size. No drop shadows — borders and whitespace define the frame.

### Aurora CTA Button
**Role:** Sole chromatic primary action

Filled pill button, 29.4px radius, horizontal aurora gradient (pink #ffa3b6 → violet #dda9ff → blue #a2d1ff → pink). Label in NaN Holo Mono 14px weight 500, #262626, uppercase, 0.075em tracking. Padding 14px 20px. Sits centered below the display specimen. One per page — this gradient is rationed because it is the only warm element in a cool palette.

### Display Headline (Specimen)
**Role:** Full-bleed type demonstration

Massive custom typeface rendered at 216-336px, weight 400, #000000 or #262626, line-height 0.80-0.90 depending on face. Text bleeds to both edges of the viewport (no max-width clamp) so the letterforms define the page's lateral scale. No background, no border — the type floats on the mint canvas.

### Font Specimen Card
**Role:** Library entry in the 'You Might Have Missed' grid

Three-column grid on the mint canvas. Each card: 1px #262626 border, 18px radius, transparent fill (shows mint through). Interior padding 20px. The card's own family name is rendered IN that family at 86px, weight 400, #262626, line-height 1.0 — the card is its own specimen. Two-line stack: 'NaN' (smaller) above 'Rage Zipp' (larger). No shadow, no hover elevation — the 1px border does all the work.

### Section Label
**Role:** Subsection heading

Left-aligned '◉ Section Name' in NaN Holo Mono 14px weight 400, #262626, 0.075em tracking. The hollow circle (◉) is a recurring typographic bullet that marks every new section without using color or weight changes. Followed by generous vertical breathing space (60-80px) before the section content.

### Select Dropdown
**Role:** Form control within the font tester

Inline select element, NaN Holo Mono 13px, #262626, 1px #262626 border, 2px radius, transparent fill. No focus ring color change — interaction is communicated through a 1-2px border darkening to #000000 on hover/focus. Inline with text controls on a single row.

### Range Slider
**Role:** Numeric control for size/leading

Native range input styled as a 1px #262626 line track with a 6px square #262626 thumb. Label text in NaN Holo Mono 12px, #262626, sits above the track. No value tooltip — the display specimen updates in real time as the user drags, providing feedback.

### Keyboard Hint Chip
**Role:** Reveals power-user shortcuts

Small rounded-square button, ~20×20px, 1px #262626 border, 2px radius, NaN Holo Mono 11px #262626 label. Used to surface shortcuts (e.g. 'R', arrows, 'OT') adjacent to the font tester controls.

## Do's and Don'ts

### Do
- Set all interface text in NaN Holo Mono with 0.075em tracking — the monospace + tracking combo is what reads as 'NaN UI' versus generic mono
- Use #262626 for text and borders, never #000000 for UI chrome — pure black is reserved for the heaviest display specimens
- Let display specimens bleed to viewport edges without a max-width clamp; the type defines the lateral scale
- Use the aurora gradient button (29.4px radius) exactly once per page — the gradient is rationed because it's the only warm element
- Mark every new section with a hollow circle bullet (◉) in 14px NaN Holo Mono, followed by 60-80px vertical space
- Make specimen cards self-documenting: render the card's font name IN that font, not as a label
- Keep all elevation to 1-2px hairline borders in #262626 — never introduce drop shadows

### Don't
- Don't use #ffffff as a page surface — it kills the mint canvas identity
- Don't use #000000 for body text or UI borders — it fights the pastel canvas
- Don't set the Holo Mono tracking below 0.05em — the letter-spacing is what makes the mono read as deliberate UI
- Don't introduce additional accent colors — the palette is mint, lime, carbon, and the aurora gradient, nothing else
- Don't add drop shadows to cards or buttons — the site defines depth through borders and whitespace only
- Don't use a 4px or 8px radius on cards — the 18px card radius is the signature soft-corner language
- Don't wrap display specimens in centered containers; full-bleed is what makes the type feel architectural

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Mint Canvas | `#b7ffb4` | Page background and base surface for all sections |
| 1 | Bone Lift | `#efefef` | Rare elevated surface for inverted or hover states where mint needs to recede |
| 2 | Aurora CTA | `#ffa3b6` | The sole gradient surface — the discover-more button |

## Imagery

Zero photography, zero illustration beyond the lime SVG scribble overlay. The site IS imagery: each custom typeface is photographed (rendered) at 200-336px and the resulting letterforms ARE the visual content. Product screenshots are absent because the product is the typography itself. The only non-typographic graphical element is a tri-color circle icon (likely a theme/palette swatch) in the nav and a pear emoji in the font tester — small, playful, and accepted as part of the studio's informal voice. Card specimens double as their own photography: the card titled 'Rage Zipp' is photographed by being typeset in Rage Zipp.

## Layout

Full-bleed canvas with no global max-width clamp on display type. Top nav is a single horizontal row, sticky, with the wordmark left and utility links right. The hero is a left-aligned statement paragraph occupying ~75% viewport width, with no centered hero or split-screen image. Sections stack vertically with 60-80px gaps, each opened by a small mono-uppercase label. The 'You Might Have Missed' section is a 3-column card grid. The display specimens in the font tester span the full viewport width and bleed off the right edge intentionally. Density is sparse and editorial — the mint canvas breathes between sections, and the only dense moment is the font tester control row.

## Agent Prompt Guide

**Quick Color Reference**
- Page background: #b7ffb4 (Mint Canvas)
- Primary text & borders: #262626 (Carbon Ink)
- Muted text & disabled borders: #999999 (Fog)
- Decorative accent: #00ff00 (Lime Spark)
- Inverted / elevated surface: #efefef (Bone)
- primary action: #b7ffb4 (filled action)

**Example Component Prompts**
1. *Hero statement*: full-width #b7ffb4 background, left-aligned paragraph in NaN Holo Mono 26px weight 400, #262626, line-height 2.25, letter-spacing 0.075em, occupying ~75% viewport width. Overlay a lime (#00ff00) SVG scribble at the right edge.
2. *Display specimen*: full-bleed headline in NaN Archy On ExtraBlack 228px, weight 400, #000000, line-height 0.90, bleeding past the right viewport edge. No background, no border, no max-width.
3. Create a Primary Action Button: #b7ffb4 background, #000000 text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.
4. *Font specimen card*: 1px #262626 border, 18px radius, transparent fill (shows #b7ffb4 through), 20px padding. The card's own title rendered in its native family at 86px weight 400 #262626 line-height 1.0. Three-column grid.
5. *Section label*: left-aligned '◉ Section Name' in NaN Holo Mono 14px weight 400, #262626, 0.075em tracking, followed by 80px vertical space before content begins.

## Type Tester Interaction Model

The font tester is a signature component: visitors drag Size (80-336px) and Leading (0.8-1.2) sliders and select a family + weight from dropdowns, and a live display specimen updates in real time. The interaction makes the site function as both a storefront and a working demo. When recreating, render the four control elements (size slider, leading slider, family dropdown, weight dropdown) on a single row above the specimen, with section labels in NaN Holo Mono 12px, all borders at 1px #262626, 2px radius, transparent fill. The specimen below should use the same color and padding rhythm as the hero display block. No toggle buttons, no modal — the tester is always visible and always live.

## Similar Brands

- **Pangram Pangram** — Same type-foundry-as-website model where custom display faces at 100-200px ARE the page, with a minimal mono-uppercase nav wrapping the specimens
- **Klim Type Foundry** — Same specimen-first architecture — large type specimens dominate the viewport, monospaced metadata labels, single-color canvas with no decorative imagery
- **OH no Type** — Same bold-display-on-pastel-canvas approach and playful studio tone, with type specimens doubling as page composition
- **Future Fonts** — Same experimental-foundry aesthetic — mint-toned canvas, uppercase mono nav, type families presented as cards with the family name set in its own face
- **Commercial Type** — Same live font-tester pattern with sliders and dropdowns controlling a real-time display specimen, and 1px hairline borders defining all UI frames

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-mint-canvas: #b7ffb4;
  --color-lime-spark: #00ff00;
  --color-carbon-ink: #262626;
  --color-obsidian: #000000;
  --color-fog: #999999;
  --color-smoke: #767676;
  --color-bone: #efefef;
  --color-paper: #ffffff;
  --color-aurora-gradient: #ffa3b6;
  --gradient-aurora-gradient: linear-gradient(270deg, rgb(255, 163, 182), rgb(221, 169, 255) 33%, rgb(162, 209, 255) 66%, rgb(255, 163, 182));

  /* Typography — Font Families */
  --font-nan-holo-mono: 'NaN Holo Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-nan-holo: 'NaN Holo', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-nan-archy-on-extrablack: 'NaN Archy On ExtraBlack', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-nan-superx-sans-display-black: 'NaN SuperX Sans Display Black', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-nan-superx-serif-text-thin-italic: 'NaN SuperX Serif Text Thin Italic', ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
  --font-nan-holo-gigawide-ultra1: 'NaN Holo Gigawide Ultra1', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-nan-rage-family-zipp-soft-beau-sans-narrow: 'NaN Rage family (Zipp, Soft, Beau, Sans Narrow)', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-nanragezippnarrowthin: 'NaNRageZippNarrowThin', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-nanragesoftxcondensedregular: 'NaNRageSoftXCondensedRegular', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-nanragebeaustandardsemibold: 'NaNRageBeauStandardSemibold', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-nanragesansnarrowmedium: 'NaNRageSansNarrowMedium', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-nanserfatextlightitalic: 'NaNSerfATextLightItalic', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-nanserfsanslightitalic: 'NaNSerfSansLightItalic', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: 1.2px;
  --text-subheading: 20px;
  --leading-subheading: 1.5;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.2;
  --text-heading: 32px;
  --leading-heading: 1.2;
  --text-display-sm: 45px;
  --leading-display-sm: 1.2;
  --tracking-display-sm: 3.4px;
  --text-display: 86px;
  --leading-display: 1;
  --text-display-lg: 216px;
  --leading-display-lg: 0.85;
  --text-display-xl: 228px;
  --leading-display-xl: 0.9;
  --text-display-mega: 336px;
  --leading-display-mega: 0.8;

  /* Typography — Weights */
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-bold: 700;
  --font-weight-extrabold: 800;
  --font-weight-black: 900;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-60: 60px;
  --spacing-80: 80px;
  --spacing-120: 120px;

  /* Layout */
  --page-max-width: 1440px;
  --section-gap: 80px;
  --card-padding: 20px;
  --element-gap: 10px;

  /* Border Radius */
  --radius-sm: 2px;
  --radius-lg: 8px;
  --radius-2xl: 18px;
  --radius-3xl: 29.4px;

  /* Named Radii */
  --radius-cards: 18px;
  --radius-small: 2px;
  --radius-inputs: 2px;
  --radius-buttons: 29.4px;

  /* Surfaces */
  --surface-mint-canvas: #b7ffb4;
  --surface-bone-lift: #efefef;
  --surface-aurora-cta: #ffa3b6;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-mint-canvas: #b7ffb4;
  --color-lime-spark: #00ff00;
  --color-carbon-ink: #262626;
  --color-obsidian: #000000;
  --color-fog: #999999;
  --color-smoke: #767676;
  --color-bone: #efefef;
  --color-paper: #ffffff;
  --color-aurora-gradient: #ffa3b6;

  /* Typography */
  --font-nan-holo-mono: 'NaN Holo Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-nan-holo: 'NaN Holo', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-nan-archy-on-extrablack: 'NaN Archy On ExtraBlack', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-nan-superx-sans-display-black: 'NaN SuperX Sans Display Black', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-nan-superx-serif-text-thin-italic: 'NaN SuperX Serif Text Thin Italic', ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
  --font-nan-holo-gigawide-ultra1: 'NaN Holo Gigawide Ultra1', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-nan-rage-family-zipp-soft-beau-sans-narrow: 'NaN Rage family (Zipp, Soft, Beau, Sans Narrow)', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-nanragezippnarrowthin: 'NaNRageZippNarrowThin', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-nanragesoftxcondensedregular: 'NaNRageSoftXCondensedRegular', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-nanragebeaustandardsemibold: 'NaNRageBeauStandardSemibold', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-nanragesansnarrowmedium: 'NaNRageSansNarrowMedium', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-nanserfatextlightitalic: 'NaNSerfATextLightItalic', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-nanserfsanslightitalic: 'NaNSerfSansLightItalic', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: 1.2px;
  --text-subheading: 20px;
  --leading-subheading: 1.5;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.2;
  --text-heading: 32px;
  --leading-heading: 1.2;
  --text-display-sm: 45px;
  --leading-display-sm: 1.2;
  --tracking-display-sm: 3.4px;
  --text-display: 86px;
  --leading-display: 1;
  --text-display-lg: 216px;
  --leading-display-lg: 0.85;
  --text-display-xl: 228px;
  --leading-display-xl: 0.9;
  --text-display-mega: 336px;
  --leading-display-mega: 0.8;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-60: 60px;
  --spacing-80: 80px;
  --spacing-120: 120px;

  /* Border Radius */
  --radius-sm: 2px;
  --radius-lg: 8px;
  --radius-2xl: 18px;
  --radius-3xl: 29.4px;
}
```
