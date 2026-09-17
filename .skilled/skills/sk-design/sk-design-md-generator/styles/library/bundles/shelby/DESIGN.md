# Shelby — Style Reference
> neon signage on cocoa leather

**Theme:** dark

Shelby runs on a warm-cocoa dark canvas punctuated by electric hot-pink type — a brutalist-cute aesthetic that swaps the typical fintech dark-gray for an almost edible brown background and turns contrast into spectacle. Typography is the hero: oversized GT-Planar display weights at 59-95px with aggressively tight tracking, set center-aligned on full-bleed color blocks that flip between deep umber, hot pink, and pale rose. Components are flat and undecorated — no shadows, tiny 4-10px radii, monospaced uppercase micro-labels in ABCReproMono that float above headlines like product codes. The rhythm is theatrical: each section is a color field change, not a card grid.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Cocoa Husk | `#322312` | `--color-cocoa-husk` | Primary page canvas, body text on light surfaces, large display type on pink fields |
| Neon Orchid | `#ff77c9` | `--color-neon-orchid` | Signature accent — massive display headlines on dark sections, body links, icon strokes, tag fills, the dominant brand voice |
| Petal Wash | `#ffdfef` | `--color-petal-wash` | Light section canvas, button label text on dark fields, badge text |
| Plum Velvet | `#470b64` | `--color-plum-velvet` | Deepest accent surface — section backgrounds that sit between the cocoa base and neon pink, creates tonal depth in the surface stack |
| Bubblegum Blush | `#ffc2e1` | `--color-bubblegum-blush` | Soft pink surface for cards, footer panels, and the lighter half of alternating section bands |
| Lavender Haze | `#e2c9f8` | `--color-lavender-haze` | Muted violet fill for decorative graphic elements, secondary illustration accent |
| Magenta Spark | `#de8aff` | `--color-magenta-spark` | Rare hot violet for standout card backgrounds — used sparingly to break the pink monotony |
| Oxblood Rust | `#481d2a` | `--color-oxblood-rust` | Red supporting accent for decorative details and low-frequency emphasis. Use as a supporting accent, not as a status color |
| Lilac Whisper | `#eee2ff` | `--color-lilac-whisper` | Near-white lavender for button text and borders on dark surfaces, ghost-control labels |
| Walnut Vein | `#5b4f41` | `--color-walnut-vein` | Muted warm gray for badge borders and hairline dividers — a lighter cocoa for subtle structural lines |

## Tokens — Typography

### Times — Times — detected in extracted data but not described by AI · `--font-times`
- **Weights:** 400
- **Sizes:** 10px
- **Line height:** 1
- **Role:** Times — detected in extracted data but not described by AI

### GT-Planar — Primary display and body typeface. Weight 300 is reserved for the 95px display headlines, weight 700 drives 42-59px section headings, weight 400 carries 16-22px body. Tight negative tracking at -0.04em on display and -0.02em on sub-display is a signature choice — the letters compress into each other for a sculptural, almost condensed feel · `--font-gt-planar`
- **Substitute:** Inter Tight or General Sans
- **Weights:** 300, 400, 500, 700
- **Sizes:** 10px, 16px, 18px, 22px, 42px, 48px, 59px, 95px
- **Line height:** 0.90, 0.95, 1.00, 1.15, 1.20, 1.40
- **Letter spacing:** -0.04em at display (95px), -0.02em at 42-59px, normal at body sizes
- **Role:** Primary display and body typeface. Weight 300 is reserved for the 95px display headlines, weight 700 drives 42-59px section headings, weight 400 carries 16-22px body. Tight negative tracking at -0.04em on display and -0.02em on sub-display is a signature choice — the letters compress into each other for a sculptural, almost condensed feel

### ABCReproMono — Monospaced micro-labels for uppercase eyebrow text above headlines, badge tags, and section markers. Line-height 0.79 is aggressive — these labels sit tight and act as typographic punctuation · `--font-abcrepromono`
- **Substitute:** JetBrains Mono or IBM Plex Mono
- **Weights:** 400, 500
- **Sizes:** 11px, 12px
- **Line height:** 0.79, 1.20
- **Role:** Monospaced micro-labels for uppercase eyebrow text above headlines, badge tags, and section markers. Line-height 0.79 is aggressive — these labels sit tight and act as typographic punctuation

### SuisseIntl — UI micro-text for nav links, icon-adjacent labels, and small interactive elements. Acts as a secondary voice to GT-Planar for interface chrome · `--font-suisseintl`
- **Substitute:** Suisse Int'l or Inter
- **Weights:** 400
- **Sizes:** 10px
- **Line height:** 1.00, 1.20
- **Role:** UI micro-text for nav links, icon-adjacent labels, and small interactive elements. Acts as a secondary voice to GT-Planar for interface chrome

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 11px | 0.79 | — | `--text-caption` |
| body | 18px | 1.4 | — | `--text-body` |
| subheading | 22px | 1.2 | — | `--text-subheading` |
| heading-sm | 42px | 1 | -0.84px | `--text-heading-sm` |
| heading | 48px | 0.95 | -0.96px | `--text-heading` |
| heading-lg | 59px | 0.95 | -1.18px | `--text-heading-lg` |
| display | 95px | 0.9 | -3.8px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 8 | 8px | `--spacing-8` |
| 12 | 12px | `--spacing-12` |
| 20 | 20px | `--spacing-20` |
| 36 | 36px | `--spacing-36` |
| 40 | 40px | `--spacing-40` |
| 116 | 116px | `--spacing-116` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 10px |
| badges | 4px |
| inputs | 4px |
| buttons | 4px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 20px
- **Element gap:** 15px

## Components

### Navigation Bar
**Role:** Persistent top header

Sits on the cocoa canvas with a 1px hairline border in #5b4f41. Left: Shelby wordmark with diamond glyph in #ff77c9. Right: monospaced nav links (ABCReproMono 12px uppercase, #ffdfef) and a ghost button (see Ghost Button). Padding 20px top/bottom, full-width with 1200px inner constraint.

### Ghost Button
**Role:** Primary UI button on dark surfaces

1px solid border in #eee2ff, text in #eee2ff at ABCReproMono 12px uppercase, transparent background, 4px radius, 12px vertical / 20px horizontal padding. Includes a small arrow icon (↗) after the label. Used for 'READ DOCS' in the nav and as the only CTA in the hero.

### Filled Pill Button
**Role:** Light surface button on dark sections

Background #ffdfef, text #322312 at ABCReproMono 12px uppercase weight 500, 4px radius, 12px vertical / 20px horizontal padding, optional trailing arrow icon. The light pill against the dark canvas creates maximum contrast and reads as the action layer.

### Hero Headline Block
**Role:** Full-bleed display statement

GT-Planar weight 700 at 59-95px, set in #ff77c9, centered, line-height 0.90-0.95, letter-spacing -0.04em. Sits on the cocoa canvas with massive vertical breathing room (120-160px above and below). The text is the design — no supporting illustration, no gradient overlay.

### Light Section Headline Block
**Role:** Headline on petal-wash or bubblegum-blush backgrounds

GT-Planar weight 700 at 42-59px, set in #322312, line-height 0.95, letter-spacing -0.02em. When the section flips to a light pink background, the same typography recurs but the ink color shifts to cocoa. This color-flip is the primary visual device of the system.

### Eyebrow Label
**Role:** Uppercase section marker

ABCReproMono 11px uppercase weight 500, letter-spacing normal, line-height 0.79, in the contrasting surface color (#322312 on light, #ff77c9 on dark). Floats 20-40px above the headline block. Reads as a product code or chapter number, not a category label.

### Monospaced Nav Link
**Role:** Inline navigation text

ABCReproMono 12px uppercase, #ffdfef on dark, with 15px horizontal margin between items. No underline, no hover state decoration — just color shift to #ff77c9 on hover.

### Section Band
**Role:** Full-bleed color block separator

Each major section is a full-width colored band: cocoa → petal wash → plum → bubblegum blush → cocoa. Bands are edge-to-edge with no border, no shadow, no rounded corners. Vertical padding 80-120px. This is the layout system — not cards or grids, but stacked color fields.

### Surface Card
**Role:** Content container on light sections

Background #ffdfef or #ffc2e1, 10px radius, 20px padding, 1px border in #5b4f41. No shadow. Content inside uses GT-Planar 16-18px in #322312.

### Badge / Tag
**Role:** Status or category indicator

ABCReproMono 11px uppercase weight 500, 4px radius, 8px vertical / 12px horizontal padding, 1px border in #5b4f41, text in the matching surface color. Background is the current section's surface color.

### Inline Icon
**Role:** Decorative glyph

16-20px stroke icons in #ff77c9 or #ffdfef depending on surface. 1.5-2px stroke weight. Monochrome only — no multicolor icons. The diamond logo glyph is a custom geometric shape, not a standard icon set.

### Wordmark Lockup
**Role:** Brand identity element

Diamond glyph + 'Shelby' wordmark, GT-Planar weight 700 at 18-22px in #ff77c9, sits in the top-left of the nav. The diamond is a rotated square outline — geometric, not a shield or abstract blob.

### Horizontal Divider Line
**Role:** Section-to-section transition

1px solid line in #ff77c9, full-width, no margin. Used sparingly between hero and secondary sections on the cocoa canvas. Functions as a typographic rule, not a visual ornament.

## Do's and Don'ts

### Do
- Use GT-Planar weight 700 at 59-95px for every primary headline, center-aligned, with letter-spacing -0.04em
- Set body text in GT-Planar weight 400 at 18px with 1.4 line-height, in #322312 on light surfaces or #ffdfef on dark
- Prefix every headline block with an ABCReproMono 11px uppercase eyebrow label in the contrasting surface color
- Flip between cocoa (#322312) and light pink (#ffdfef or #ffc2e1) as full-bleed section backgrounds — never use white or neutral gray as a canvas
- Use 4px radius for buttons and badges, 10px for cards — never exceed 12px
- Make #ff77c9 the dominant accent for display type, links, and icon strokes — it should appear on every screen
- Keep all components flat with no shadows, no gradients, and no glassmorphism

### Don't
- Don't use rounded corners above 12px — the sharp-edged flatness is essential to the aesthetic
- Don't add drop shadows or elevation to cards, buttons, or any interactive element
- Don't use white (#ffffff) or neutral gray as a page background — only cocoa, plum, and pink tones
- Don't set body text below 16px or above 22px — the type system has a narrow body range
- Don't introduce a new accent color — the palette is intentionally restricted to pink/violet/brown
- Don't left-align display headlines — the system is center-aligned for the hero, eyebrow-above, headline-below pattern
- Don't use stock photography, product screenshots, or 3D renders — the design is typographic and graphic only

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Cocoa Husk | `#322312` | Base canvas — dominant page background |
| 1 | Plum Velvet | `#470b64` | Deep tonal section backgrounds |
| 2 | Bubblegum Blush | `#ffc2e1` | Light section canvas, card backgrounds |
| 3 | Petal Wash | `#ffdfef` | Brightest surface — alternating light sections, button labels |

## Elevation

No shadows. The design relies entirely on color-field contrast and full-bleed section bands for hierarchy. Elevation is communicated by lightness shifts in the surface stack (cocoa → plum → blush → petal) rather than drop shadows or floating elements. This keeps every surface feeling printed and flat — the aesthetic is poster-like, not skeuomorphic.

## Imagery

No photography, no product screenshots, no 3D renders. The visual language is purely typographic and graphic: oversized display type on full-bleed color fields, monospaced micro-labels acting as typographic punctuation, and the occasional geometric icon (diamond logo glyph, arrow indicators). Illustration is limited to flat decorative shapes in lavender and pink that sit behind or beside text blocks. The color bands themselves are the imagery — each section's background is a deliberate visual statement.

## Layout

Full-bleed stacked color bands, no card grids in the main flow. Page model is a vertical sequence of edge-to-edge sections, each with its own background color from the surface stack. The hero is a massive centered headline on cocoa, followed by a horizontal neon-pink divider line, then alternating light and dark sections. Content within each section is center-aligned with a 1200px max-width inner constraint, generous vertical padding (80-120px), and eyebrow-label-above-headline-below stacking. Navigation is a persistent top bar with hairline border. The layout reads like a printed poster sequence, not a web app dashboard.

## Agent Prompt Guide

## Quick Color Reference
- Canvas (dark): #322312
- Canvas (light): #ffdfef
- Accent / display type: #ff77c9
- Body text on dark: #ffdfef
- Body text on light: #322312
- Hairline border: #5b4f41
- primary action: no distinct CTA color

## Example Component Prompts
1. **Hero section**: Full-bleed #322312 background, 120px vertical padding. GT-Planar weight 700 at 95px, #ff77c9, center-aligned, letter-spacing -3.8px, line-height 0.90. ABCReproMono 11px uppercase eyebrow in #ff77c9, 30px above the headline.

2. **Light section headline**: Full-bleed #ffdfef background, 80px vertical padding. GT-Planar weight 700 at 48px, #322312, center-aligned, letter-spacing -0.96px. Eyebrow label above in #322312 using ABCReproMono 11px.

3. **Ghost navigation button**: 1px solid border #eee2ff, transparent fill, text ABCReproMono 12px uppercase in #eee2ff, 4px radius, 12px/20px padding, trailing ↗ icon.

4. **Section card**: Background #ffc2e1, 10px radius, 20px padding, 1px border #5b4f41. GT-Planar 18px body text in #322312.

5. **Eyebrow + headline pair**: ABCReproMono 11px uppercase weight 500 in #ff77c9, line-height 0.79, sitting 24px above a GT-Planar weight 700 59px headline in #ff77c9 with -1.18px letter-spacing.

## Similar Brands

- **Berachain** — Same warm-dark canvas with neon pink accent type and oversized grotesque display headlines on full-bleed color fields
- **Monad** — Similar theatrical dark-mode crypto aesthetic with massive centered headlines and flat color-band section transitions
- **Aptos** — Shares the brutalist-cute tension of tight grotesk type at extreme sizes on rich dark backgrounds with a single hot accent
- **Lattice (HR)** — Same tight GT-Planar/Inter-style grotesk with aggressively negative letter-spacing on display sizes, center-aligned single-column layouts

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-cocoa-husk: #322312;
  --color-neon-orchid: #ff77c9;
  --color-petal-wash: #ffdfef;
  --color-plum-velvet: #470b64;
  --color-bubblegum-blush: #ffc2e1;
  --color-lavender-haze: #e2c9f8;
  --color-magenta-spark: #de8aff;
  --color-oxblood-rust: #481d2a;
  --color-lilac-whisper: #eee2ff;
  --color-walnut-vein: #5b4f41;

  /* Typography — Font Families */
  --font-times: 'Times', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-gt-planar: 'GT-Planar', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-abcrepromono: 'ABCReproMono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-suisseintl: 'SuisseIntl', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 0.79;
  --text-body: 18px;
  --leading-body: 1.4;
  --text-subheading: 22px;
  --leading-subheading: 1.2;
  --text-heading-sm: 42px;
  --leading-heading-sm: 1;
  --tracking-heading-sm: -0.84px;
  --text-heading: 48px;
  --leading-heading: 0.95;
  --tracking-heading: -0.96px;
  --text-heading-lg: 59px;
  --leading-heading-lg: 0.95;
  --tracking-heading-lg: -1.18px;
  --text-display: 95px;
  --leading-display: 0.9;
  --tracking-display: -3.8px;

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
  --spacing-20: 20px;
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-116: 116px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 20px;
  --element-gap: 15px;

  /* Border Radius */
  --radius-md: 3.95833px;
  --radius-lg: 9.89583px;

  /* Named Radii */
  --radius-cards: 10px;
  --radius-badges: 4px;
  --radius-inputs: 4px;
  --radius-buttons: 4px;

  /* Surfaces */
  --surface-cocoa-husk: #322312;
  --surface-plum-velvet: #470b64;
  --surface-bubblegum-blush: #ffc2e1;
  --surface-petal-wash: #ffdfef;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-cocoa-husk: #322312;
  --color-neon-orchid: #ff77c9;
  --color-petal-wash: #ffdfef;
  --color-plum-velvet: #470b64;
  --color-bubblegum-blush: #ffc2e1;
  --color-lavender-haze: #e2c9f8;
  --color-magenta-spark: #de8aff;
  --color-oxblood-rust: #481d2a;
  --color-lilac-whisper: #eee2ff;
  --color-walnut-vein: #5b4f41;

  /* Typography */
  --font-times: 'Times', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-gt-planar: 'GT-Planar', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-abcrepromono: 'ABCReproMono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-suisseintl: 'SuisseIntl', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 0.79;
  --text-body: 18px;
  --leading-body: 1.4;
  --text-subheading: 22px;
  --leading-subheading: 1.2;
  --text-heading-sm: 42px;
  --leading-heading-sm: 1;
  --tracking-heading-sm: -0.84px;
  --text-heading: 48px;
  --leading-heading: 0.95;
  --tracking-heading: -0.96px;
  --text-heading-lg: 59px;
  --leading-heading-lg: 0.95;
  --tracking-heading-lg: -1.18px;
  --text-display: 95px;
  --leading-display: 0.9;
  --tracking-display: -3.8px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-20: 20px;
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-116: 116px;

  /* Border Radius */
  --radius-md: 3.95833px;
  --radius-lg: 9.89583px;
}
```
