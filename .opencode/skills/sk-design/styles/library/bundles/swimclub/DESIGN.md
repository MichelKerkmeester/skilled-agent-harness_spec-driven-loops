# SwimClub — Style Reference
> Clinical dossier behind pixelated LCD readouts

**Theme:** mixed

SwimClub runs a clinical-journal visual system: almost entirely achromatic (white, black, cool gray) with a single vivid orange (#ff9e00) used as full-bleed punctuation rather than button color. Typography does the heavy lifting — a geometric grotesque (Px Grotesk) for body and headlines, a monospace (Apercu Mono) for data labels and navigation micro-copy, and a custom pixelated display face (Swimclub) reserved for the logo and oversized statistic numbers that read like LCD readouts. Surfaces alternate between a cool off-white canvas, stark white product cards, deep navy-black hero blocks with photographic product shots, and saturated orange stat panels. The interface feels like a medical dossier viewed through a retro arcade screen: clinical, editorial, slightly playful, with sharp 0px corners and hairline dashed borders that keep everything reading as diagram rather than decoration.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Tabloid Orange | `#ff9e00` | `--color-tabloid-orange` | Full-bleed section backgrounds (announcement bar, statistic panels) — the only chromatic brand color, used at maximum saturation to break the otherwise monochrome flow |
| Deep Capsule Navy | `linear-gradient(rgb(106, 144, 176), rgb(65, 115, 158) 30%, rgb(18, 58, 92) 97%, rgb(2, 5, 7) 139%)` | `--color-deep-capsule-navy` | Hero gradient terminal color and product photograph backgrounds — near-black with a blue undertone, not a pure black |
| Ink Black | `#000000` | `--color-ink-black` | Primary text, hairline borders, navigation dividers, card outlines, button text — the dominant structural color across the entire interface |
| Paper White | `#ffffff` | `--color-paper-white` | Page background, card surfaces, product image overlays, button fills, and text on dark or orange panels |
| Cool Gray | `#d2dce1` | `--color-cool-gray` | Muted UI surface for disabled controls, low-emphasis panels, and placeholder blocks. |
| Iron Gray | `#666666` | `--color-iron-gray` | Secondary body text and low-emphasis borders — the mid-tone of the neutral scale |
| Ash | `#b3b3b3` | `--color-ash` | Tertiary borders, disabled state outlines, muted icon strokes |
| Smoke | `#cccccc` | `--color-smoke` | Dividers, dashed-border accent on feature cards, subtle separator lines |

## Tokens — Typography

### Px Grotesk — Primary workhorse — body copy at 15–17px/400, subheadings at 21–31px/700, display headlines at 52–74px/700. Geometric grotesque with squared terminals gives a clinical, diagram-like feel. The 74px hero weight is set very tight (1.05) so multi-line headlines stack into a solid block. · `--font-px-grotesk`
- **Substitute:** Inter, Space Grotesk, or DM Sans
- **Weights:** 400, 700
- **Sizes:** 12, 15, 16, 17, 21, 31, 37, 52, 74
- **Line height:** 1.05, 1.10, 1.30, 1.70
- **Role:** Primary workhorse — body copy at 15–17px/400, subheadings at 21–31px/700, display headlines at 52–74px/700. Geometric grotesque with squared terminals gives a clinical, diagram-like feel. The 74px hero weight is set very tight (1.05) so multi-line headlines stack into a solid block.

### Apercu Mono Pro — Monospace micro-copy — navigation links, section labels, input placeholders, ingredient lists, and small data captions. Set at small sizes (15–17px) with a 0.02em positive letter-spacing so uppercase strings read as printed stamps or specimen labels rather than running text. · `--font-apercu-mono-pro`
- **Substitute:** IBM Plex Mono, JetBrains Mono, or Space Mono
- **Weights:** 400
- **Sizes:** 15, 17
- **Line height:** 1.10, 1.20
- **Letter spacing:** 0.02em
- **Role:** Monospace micro-copy — navigation links, section labels, input placeholders, ingredient lists, and small data captions. Set at small sizes (15–17px) with a 0.02em positive letter-spacing so uppercase strings read as printed stamps or specimen labels rather than running text.

### Swimclub (custom pixel/bitmap face) — Signature display face used exclusively for the wordmark and the three giant statistic numerals (60%, 50%, 1/4). The blocky, pixelated construction makes numbers look like LCD or 7-segment readouts — a deliberate retro-digital contrast against the clean grotesque body. Never set below 90px; its identity depends on scale. · `--font-swimclub-custom-pixelbitmap-face`
- **Substitute:** VT323, Press Start 2P, or a custom bitmap font
- **Weights:** 400
- **Sizes:** 96, 105
- **Line height:** 1.00
- **Role:** Signature display face used exclusively for the wordmark and the three giant statistic numerals (60%, 50%, 1/4). The blocky, pixelated construction makes numbers look like LCD or 7-segment readouts — a deliberate retro-digital contrast against the clean grotesque body. Never set below 90px; its identity depends on scale.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.3 | — | `--text-caption` |
| body-sm | 15px | 1.7 | — | `--text-body-sm` |
| subheading | 21px | 1.3 | — | `--text-subheading` |
| heading-sm | 31px | 1.1 | — | `--text-heading-sm` |
| heading | 37px | 1.1 | — | `--text-heading` |
| heading-lg | 52px | 1.05 | — | `--text-heading-lg` |
| display | 74px | 1.05 | — | `--text-display` |
| stat-numeral | 105px | 1 | — | `--text-stat-numeral` |

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
| 24 | 24px | `--spacing-24` |
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 64 | 64px | `--spacing-64` |
| 120 | 120px | `--spacing-120` |
| 140 | 140px | `--spacing-140` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 0px |
| cards | 0px |
| images | 0px |
| buttons | 0px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 120px
- **Card padding:** 32px
- **Element gap:** 4px

## Components

### Announcement Bar
**Role:** Site-wide top strip

Full-bleed #ff9e00 bar, ~32px tall, centered uppercase Apercu Mono Pro at 12px, black text. The single dose of orange at the very top — always present, always the first thing the eye lands on.

### Top Navigation
**Role:** Primary site nav

Three-zone layout on white: SHOP and ABOUT US left, Swimclub pixel wordmark center, ACCOUNT and CART (0) right. All links in Apercu Mono Pro 12–15px uppercase, letter-spacing 0.02em, black. No background, no border — the nav is just typographic restraint floating on white.

### Hero Block
**Role:** Above-the-fold introduction

Full-bleed dark gradient (#6a90b0 → #020507, top-left to bottom-right) with golden capsule product photography on the right and a text block on the left. Headline at 74px Px Grotesk weight 700, white, line-height 1.05. Subtext at 16–17px Px Grotesk weight 400, white. 64px left padding, generous breathing room from the nav.

### Outlined CTA Button (Hero)
**Role:** Primary call-to-action on dark backgrounds

White border 1px, white text, no fill, 0px radius, ~32px tall, Apercu Mono Pro 15px uppercase with 0.02em letter-spacing. The 'GET STARTED' button sits on the dark hero — outlined white is the only viable shape here. Sits inside a black-bordered white rectangle, giving it a stamped, printed feel.

### Outlined CTA Button (Light surface)
**Role:** Primary call-to-action on light backgrounds

Black border 1px, black text, no fill, 0px radius, 32px padding (16px horizontal, 8px vertical). Apercu Mono Pro 15px uppercase. The ghost/outlined pattern is consistent — buttons never fill with color.

### Media Credibility Bar
**Role:** Social proof strip

Horizontal row of four press/clinical logos (GQ, Stanford clinician, Clinicians' Choice badge, clinician count) on a white background separated by thin black vertical dividers. Each cell contains a small image or icon plus a short body-text caption. No card backgrounds — just dividers and type.

### Centered Headline Band
**Role:** Section opener

White or #d2dce1 band, centered headline at 31–37px Px Grotesk weight 700, followed by a single-line subtext at 15–17px weight 400. Tight centered alignment, 120px vertical padding above and below. Acts as a breathing pause between dense blocks.

### Orange Statistic Panel
**Role:** Data showcase

Full-bleed #ff9e00 band, divided into 2–4 equal columns by thin white vertical lines. Each column carries a tiny uppercase Apercu Mono Pro label (e.g. 'THE STATE OF MEN'S REPRODUCTIVE HEALTH') and a giant Swimclub pixel numeral at 96–105px in black. The pixel font on saturated orange is the site's most distinctive visual moment.

### Dashed-Border Feature Card
**Role:** Product benefit listing

White card with 1px dashed #cccccc border, 0px radius, 32px padding. Left side: small icon (sperm, molecule, DNA glyph) in black. Center: bold Px Grotesk 21px heading with a 15px weight 400 sub-label below. Right side: a small black minus/dash icon acting as a collapse indicator. The dashed border signals 'diagram entry' rather than 'product card'.

### Product Image Block
**Role:** Full-bleed product photography

Pure black (#020507) block, full container width, variable height, with white uppercase Apercu Mono Pro caption overlaid (e.g. 'OPTIMAL COUNT'). No text, no UI — just the dark canvas and the product, creating a cinematic pause.

### Ingredient Tag List
**Role:** Composed supplement ingredients

Inline run of uppercase Apercu Mono Pro tokens (COQ10, LYCOPENE, VITAMIN D3, VITAMIN E, OMEGA-3S, NAC, L-CARNITINE) separated by spaces, set at 15px. Introduced by a small uppercase label 'TARGETED WITH'. Reads as a specimen label.

### Icon Set
**Role:** Functional glyphs

Single-color black icons drawn at a consistent hairline stroke weight. Style is geometric/technical (diamond molecules, simplified sperm forms, DNA strands) — never decorative. Always paired with a short label, never floating alone.

## Do's and Don'ts

### Do
- Use #ff9e00 only as a full-bleed panel background for the announcement bar and statistic sections — never as a button fill, icon tint, or border.
- Reserve the Swimclub pixel font for the wordmark and statistic numerals at 90px or larger; it loses its character below that scale.
- Set Px Grotesk headlines tight — line-height 1.05 at 52–74px so multi-line stacks read as a solid block, not airy type.
- Use Apercu Mono Pro for every uppercase label, navigation item, and small data string; reserve Px Grotesk for body and headings.
- Keep all corners at 0px radius — sharp edges are the system's identity. Use 1px black or #cccccc dashed borders to separate sections.
- Alternate surface levels deliberately: white → #d2dce1 → #ff9e00 → #020507 to create the editorial rhythm.
- Use 120px vertical padding between major sections and 32px inside cards.

### Don't
- Don't round corners on cards, buttons, tags, or images — radius is 0px across the system.
- Don't use orange for buttons, links, or icons — it belongs only on full-bleed section backgrounds.
- Don't set the Swimclub pixel font below 90px or use it for body copy — it will become illegible.
- Don't use shadows or elevation effects — the system relies on flat surfaces and hairline borders, not depth.
- Don't mix the monospace and pixel fonts in the same size range — Apercu Mono is for micro-labels (12–17px), Swimclub is for giant readouts (90px+).
- Don't fill CTA buttons with color — keep them outlined (black border on light, white border on dark) with a transparent interior.
- Don't introduce new chromatic colors — the system is intentionally monochrome plus one orange.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas Gray | `#d2dce1` | Outermost page background between major sections, footer band — cool blue-gray that sets a clinical mood |
| 1 | Paper | `#ffffff` | Primary content surface — product cards, media bar, feature blocks, body sections |
| 2 | Orange Panel | `#ff9e00` | Full-bleed accent surface for announcement bar and statistic panel — interrupts the monochrome flow |
| 3 | Capsule Black | `#020507` | Hero and product photograph background — high-contrast stage for golden capsule imagery |

## Elevation

The design is deliberately shadowless. Hierarchy is created through surface contrast (white → #d2dce1 → orange → black), hairline 1px borders, and whitespace, never through drop shadows or blur. This keeps the interface reading as a flat printed document or clinical diagram rather than a skeuomorphic app.

## Imagery

Photography is reserved for the product: golden-amber capsules and softgel pills shot against dark blue-to-black gradient backgrounds with dramatic studio lighting. Treatment is high-contrast, moody, and product-only — no lifestyle imagery, no people, no context. The pills are the heroes, always isolated, always glowing. Imagery occupies roughly 50% of the hero block and the dedicated product photograph bands; the rest of the page is text and data.

## Layout

Page is a vertical stack of full-bleed bands rather than a max-width container flow. The hero is full-bleed dark; subsequent sections alternate between max-width-1200px centered content (white or #d2dce1) and edge-to-edge accent panels (orange, black). The nav is a thin typographic strip — no background bar, no shadow, no border. Hero is a 50/50 split: left text block, right product photograph on a gradient. Below the fold, the pattern is: centered headline band → 4-column media bar → centered headline band → 4-column orange stat panel → 2-column feature list with dark product image in the middle. Section gaps are 120px; card padding is 32px. Navigation is minimal top-only with no sticky behavior evident.

## Agent Prompt Guide

Quick Color Reference:
- text: #000000
- background: #ffffff
- section wash: #d2dce1
- dark surface: #020507
- accent panel: #ff9e00
- primary action: no distinct CTA color

Example Component Prompts:

No distinct primary action color was observed; use the extracted neutral button treatments instead of inventing a filled CTA color.

2. Create the orange statistic panel: full-bleed #ff9e00 background, divided into three equal columns by 1px white vertical lines. Each column: uppercase Apercu Mono Pro 12px label at top in black, then a Swimclub pixel-font numeral at 105px in black, then a short body caption in Px Grotesk 15px weight 400 below.

3. Create a dashed-border feature card: #ffffff background, 1px dashed #cccccc border, 0px radius, 32px padding. Left: small black geometric icon. Center: Px Grotesk 21px weight 700 heading with 15px weight 400 sub-label beneath. Right: small black minus/dash collapse icon.

4. Create the centered headline band: #d2dce1 background, 120px padding top and bottom, centered Px Grotesk 37px weight 700 heading in #000000, followed by a 16px weight 400 subtext in #000000, max-width 720px.

5. Create the top nav: #ffffff background, 32px vertical padding, three flex zones. Left: SHOP and ABOUT US in Apercu Mono Pro 12px uppercase, #000000, letter-spacing 0.02em. Center: Swimclub pixel wordmark at 21px. Right: ACCOUNT and CART (0) in the same monospace style. No borders, no background bar, no shadow.

## Similar Brands

- **Athletic Greens / AG1** — Same clinical-supplement editorial language: monochrome canvas, single full-bleed accent color, monospace data labels, oversized statistic numerals as the visual hero
- **Ritual Vitamins** — Same minimal monochrome palette with one warm accent, hairline borders, monospace ingredient lists, and product photography that dominates the dark hero
- **Brilliant (brilliant.org)** — Same pixel/digital display treatment for statistics and a clean grotesque body — the contrast between clinical sans-serif and retro-bitmap numerals is a shared signature
- **WHOOP** — Same dark full-bleed hero with centered white headline, achromatic body, and a single saturated accent (orange for SwimClub, red for WHOOP) used as a section punctuation rather than button color

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-tabloid-orange: #ff9e00;
  --color-deep-capsule-navy: #020507;
  --gradient-deep-capsule-navy: linear-gradient(rgb(106, 144, 176), rgb(65, 115, 158) 30%, rgb(18, 58, 92) 97%, rgb(2, 5, 7) 139%);
  --color-ink-black: #000000;
  --color-paper-white: #ffffff;
  --color-cool-gray: #d2dce1;
  --color-iron-gray: #666666;
  --color-ash: #b3b3b3;
  --color-smoke: #cccccc;

  /* Typography — Font Families */
  --font-px-grotesk: 'Px Grotesk', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-apercu-mono-pro: 'Apercu Mono Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-swimclub-custom-pixelbitmap-face: 'Swimclub (custom pixel/bitmap face)', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.3;
  --text-body-sm: 15px;
  --leading-body-sm: 1.7;
  --text-subheading: 21px;
  --leading-subheading: 1.3;
  --text-heading-sm: 31px;
  --leading-heading-sm: 1.1;
  --text-heading: 37px;
  --leading-heading: 1.1;
  --text-heading-lg: 52px;
  --leading-heading-lg: 1.05;
  --text-display: 74px;
  --leading-display: 1.05;
  --text-stat-numeral: 105px;
  --leading-stat-numeral: 1;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-64: 64px;
  --spacing-120: 120px;
  --spacing-140: 140px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 120px;
  --card-padding: 32px;
  --element-gap: 4px;

  /* Named Radii */
  --radius-tags: 0px;
  --radius-cards: 0px;
  --radius-images: 0px;
  --radius-buttons: 0px;

  /* Surfaces */
  --surface-canvas-gray: #d2dce1;
  --surface-paper: #ffffff;
  --surface-orange-panel: #ff9e00;
  --surface-capsule-black: #020507;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-tabloid-orange: #ff9e00;
  --color-deep-capsule-navy: #020507;
  --color-ink-black: #000000;
  --color-paper-white: #ffffff;
  --color-cool-gray: #d2dce1;
  --color-iron-gray: #666666;
  --color-ash: #b3b3b3;
  --color-smoke: #cccccc;

  /* Typography */
  --font-px-grotesk: 'Px Grotesk', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-apercu-mono-pro: 'Apercu Mono Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-swimclub-custom-pixelbitmap-face: 'Swimclub (custom pixel/bitmap face)', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.3;
  --text-body-sm: 15px;
  --leading-body-sm: 1.7;
  --text-subheading: 21px;
  --leading-subheading: 1.3;
  --text-heading-sm: 31px;
  --leading-heading-sm: 1.1;
  --text-heading: 37px;
  --leading-heading: 1.1;
  --text-heading-lg: 52px;
  --leading-heading-lg: 1.05;
  --text-display: 74px;
  --leading-display: 1.05;
  --text-stat-numeral: 105px;
  --leading-stat-numeral: 1;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-64: 64px;
  --spacing-120: 120px;
  --spacing-140: 140px;
}
```
