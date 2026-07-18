# UGLYCASH — Style Reference
> Sticker-covered notebook on cream paper — a vibe of irreverent, maximalist fintech that wears its chaos proudly.

**Theme:** light

UGLYCASH runs a sticker-bombed Gen-Z finance language: warm light canvas, oversized black display type, and a riot of vivid accent panels (hot pink, electric cyan, toxic lime, dusty khaki) splashed across mostly achromatic layouts. The signature move is a heavy black hairline (1px) that traces every surface — cards, phone frames, buttons, illustrations — giving the impression of printed stickers peeled onto a page. Radii are exaggerated (16px for controls, 38–46px for hero cards) to amplify the soft, toy-like feel, while the palette stays disciplined: one neutral canvas, one neutral surface, and three or four saturated brand colors used as full-bleed card fills rather than thin accents. Headlines shout at 85–164px with negative tracking; body text retreats to 14–18px Inter. Everything reads as fast, loud, and deliberately unpolished.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Static Black | `#000000` | `--color-static-black` | Text, borders, icon strokes, button outlines — the structural ink that outlines every sticker-like surface and carries all body and heading type |
| Paper Cream | `#f2f2f2` | `--color-paper-cream` | Page canvas, body backgrounds, and soft section fills |
| Card White | `#ffffff` | `--color-card-white` | Elevated card surfaces and inverse text on dark panels |
| Surface Graphite | `#3a3a3a` | `--color-surface-graphite` | Dark card and panel fills for inverted sections |
| Hardware Ink | `#000100` | `--color-hardware-ink` | Near-black phone-frame and hardware fills (visually indistinguishable from #000000, used on device mockups) |
| Hairline Smoke | `#6e6e6e` | `--color-hairline-smoke` | Muted body text and secondary borders |
| Placeholder Ash | `#888888` | `--color-placeholder-ash` | Helper text, disabled-state type, and low-priority metadata |
| Sticker Khaki | `#e7e3bf` | `--color-sticker-khaki` | Card and panel fills — dusty olive-cream that reads as vintage paper against the white canvas |
| Riot Pink | `#fa00ff` | `--color-riot-pink` | Saturated card fills, sticker backgrounds, hero callouts — the loudest voice in the accent set |
| Voltage Cyan | `#02bbff` | `--color-voltage-cyan` | Saturated card fills and feature panel backgrounds — secondary brand voice, often paired with phone mockup screenshots |
| Toxic Lime | `#adff02` | `--color-toxic-lime` | Green action color for filled buttons, selected navigation states, and focused conversion moments |

## Tokens — Typography

### Helvetica Now Display Cn Bold — Display and headline voice — compressed, ultra-bold, negative tracking (-0.033em at 85–164px). Carries the page's identity: shouty statements like 164px section openers. Substitute with 'Helvetica Neue Condensed Bold' or 'Roboto Condensed 900'. · `--font-helvetica-now-display-cn-bold`
- **Substitute:** Helvetica Neue Condensed Bold or Roboto Condensed 900
- **Weights:** 700, 900
- **Sizes:** 20px, 64px, 85px, 164px
- **Line height:** 0.85, 0.94, 1.20
- **Letter spacing:** -0.033em at display sizes, -0.020em at 20px
- **Role:** Display and headline voice — compressed, ultra-bold, negative tracking (-0.033em at 85–164px). Carries the page's identity: shouty statements like 164px section openers. Substitute with 'Helvetica Neue Condensed Bold' or 'Roboto Condensed 900'.

### Inter — Body, UI, navigation, and small headings. Weight 400 for body, 500 for emphasis, 700 for subheadings. Letter-spacing -0.02em tightens the UI text. Free Google Font. · `--font-inter`
- **Substitute:** Inter
- **Weights:** 400, 500, 700
- **Sizes:** 12px, 14px, 18px, 20px, 24px
- **Line height:** 1.17, 1.20, 1.22, 1.29, 1.33, 1.40
- **Letter spacing:** -0.02em
- **Role:** Body, UI, navigation, and small headings. Weight 400 for body, 500 for emphasis, 700 for subheadings. Letter-spacing -0.02em tightens the UI text. Free Google Font.

### Miss Fajardose — Hand-lettered display accent — used sparingly (one observation) for a personal signature on a card. Substitute with 'Caveat Brush' or 'Permanent Marker' for the same marker-on-paper feel. · `--font-miss-fajardose`
- **Substitute:** Caveat Brush or Permanent Marker
- **Weights:** 400
- **Sizes:** 38px
- **Line height:** 1.20
- **Role:** Hand-lettered display accent — used sparingly (one observation) for a personal signature on a card. Substitute with 'Caveat Brush' or 'Permanent Marker' for the same marker-on-paper feel.

### System sans-serif — Fallback body fallback; appears in 357 instances as the default rendering surface for generic UI chrome and inline text nodes. · `--font-system-sans-serif`
- **Substitute:** system-ui
- **Weights:** 400
- **Sizes:** 12px
- **Line height:** 1.20
- **Role:** Fallback body fallback; appears in 357 instances as the default rendering surface for generic UI chrome and inline text nodes.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.2 | -0.24px | `--text-caption` |
| body-sm | 14px | 1.29 | — | `--text-body-sm` |
| body | 18px | 1.33 | -0.36px | `--text-body` |
| subheading | 20px | 1.2 | -0.4px | `--text-subheading` |
| heading-sm | 24px | 1.22 | -0.48px | `--text-heading-sm` |
| heading | 64px | 0.94 | -1.28px | `--text-heading` |
| heading-lg | 85px | 0.85 | -2.81px | `--text-heading-lg` |
| display | 164px | 0.85 | -5.41px | `--text-display` |

## Tokens — Spacing & Shapes

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 5 | 5px | `--spacing-5` |
| 9 | 9px | `--spacing-9` |
| 10 | 10px | `--spacing-10` |
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 27 | 27px | `--spacing-27` |
| 34 | 34px | `--spacing-34` |
| 96 | 96px | `--spacing-96` |
| 168 | 168px | `--spacing-168` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 16px |
| buttons | 16px |
| hairline | 1px |
| heroCards | 38px |
| phoneFrames | 43px |
| featurePanels | 46px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 96px
- **Card padding:** 24px
- **Element gap:** 10px

## Components

### Floating Navigation Pill
**Role:** Persistent top header

White (#ffffff) pill, 16px radius, 1px black border, fixed at the top center of the viewport. Contains the wordmark left-aligned, social icons centered, and a black-bordered 'Get the App' ghost button on the right with a small black square icon. Padding roughly 10px vertical, 20px horizontal.

### Ghost Navigation Button (Get the App)
**Role:** Secondary header action

White background, 1px black border, 16px radius, Inter 14px weight 500, black text, padding 5–10px. Left-side 20px black square icon.

### Display Headline Block
**Role:** Hero and section openers

Helvetica Now Display Cn Bold 85–164px, weight 900, line-height 0.85, letter-spacing -0.033em (-2.81px at 85px, -5.41px at 164px), color #000000, centered or left-aligned at 168px page padding. The condensed bold caps are the loudest element on any screen.

### Feature Card (Saturated Sticker)
**Role:** Three-up feature showcase

Full-bleed saturated fill (Riot Pink #fa00ff, Voltage Cyan #02bbff, or Sticker Khaki #e7e3bf), 1px black border, 16px radius, 24px padding. Contains a tilted phone-mockup illustration and a heading. Cards sit on a 34px column gap.

### Sticker Card (Khaki)
**Role:** Neutral feature card

Sticker Khaki (#e7e3bf) fill, 1px black border, 16px radius, 24px padding, no shadow. Used when a card needs visual weight without screaming a brand color.

### Dark Panel Card
**Role:** Inverted surface for bank/account listings

Surface Graphite (#3a3a3a) or Hardware Ink (#000100) fill, white (#ffffff) text, 1px black border, 16–46px radius. Hosts list rows with flag icons, country names, and outlined 'Open' buttons.

### Toxic Lime Pill Button
**Role:** Primary action in lists or CTAs

Toxic Lime (#adff02) background, 1px black border, 16px radius, Inter 14px weight 700, black text, padding 5–10px. The only filled color CTA in the system.

### Outlined Open Button
**Role:** Row-level action inside account lists

White (#ffffff) background, 1px black border, 16px radius, Inter 14px weight 500 black text, padding 5–10px.

### Bank Account Row
**Role:** List item inside Dark Panel Card

White interior surface inside a dark panel, 1px black border, 8–16px radius. Left: 24px square flag icon. Center: country name (Inter 18px weight 700) over muted helper text (Inter 14px weight 400 in #6e6e6e). Right: Outlined Open Button.

### Phone Mockup Frame
**Role:** Product preview

Hardware Ink (#000100) or Surface Graphite (#3a3a3a) body, 1px black border, 43px outer radius with 8–16px offset duplicate frame creating the peeled-sticker effect. Interior shows the app screen on a white card.

### Tilted Sticker Illustration
**Role:** Decorative motif across cards

Saturated fills (#fa00ff, #02bbff, #adff02, #e7e3bf) with 1px black borders, rotated -8° to +12°, sitting on top of card surfaces as if physically pasted on. Often contains bold short copy or iconography.

### Footer Social Row
**Role:** Brand/footer micro-interaction

Inline icon group (Discord, Instagram) rendered as 16–20px black-filled glyphs inside the navigation pill. No background, no border, 10px gap between icons.

### Section Title (H2)
**Role:** Mid-page section headers

Helvetica Now Display Cn Bold 64px, weight 700, line-height 0.94, letter-spacing -0.02em (-1.28px), color #000000, left-aligned, 96px section padding above/below.

### Card Caption (Sub-label)
**Role:** Two-line card description

Inter 18px weight 500, line-height 1.33, color #000000. Always rendered as a two-line stack: action verb first, benefit clause second.

## Do's and Don'ts

### Do
- Use 1px solid #000000 borders on every card, button, and phone frame — borders are the load-bearing structure, not shadows
- Use Helvetica Now Display Cn Bold at 85–164px with letter-spacing -0.033em for section openers; never let body text reach display sizes
- Reach for the saturated brand colors (#fa00ff, #02bbff, #adff02, #e7e3bf) as full card or panel fills, never as thin text accents
- Set card and button radius to 16px; escalate to 38–46px only for hero-scale panels and phone frames
- Keep the page canvas at #f2f2f2 and default card surface at #ffffff; let the saturated stickers do the loud work on top
- Use Inter for everything below 24px — body, UI, navigation, captions — at 14–18px with -0.02em tracking
- Maintain 96px vertical section gaps and 10–20px element gaps to preserve the comfortable, sticker-pasted rhythm

### Don't
- Do not add drop shadows; elevation is drawn with borders and offset duplicate frames
- Do not use the saturated brand colors for thin underlines, icon strokes, or 1px borders — they need fill to read as stickers
- Do not use more than two type families on a single surface; Helvetica Now + Inter (or one handwritten accent) is the ceiling
- Do not push body text below 14px or above 20px — the UI scale is tight and the contrast assumes 14–18px body
- Do not set radius to 0 or to 9999px; the system lives in the 1px / 16px / 38–46px range
- Do not use the brand colors as text color on white backgrounds — black text on saturated fills, white text only on #000100/#3a3a3a panels
- Do not let display headlines wrap before 4 words; the 164px size assumes 1–3 short lines at 0.85 line-height

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas Cream | `#f2f2f2` | Page background and outer gutter |
| 1 | Card White | `#ffffff` | Default product/feature card surface |
| 2 | Sticker Khaki | `#e7e3bf` | Tinted feature panel and section background |
| 3 | Surface Graphite | `#3a3a3a` | Inverted dark sections and phone-frame fills |

## Elevation

- **Sticker Cards:** `1px solid #000000 — borders carry the weight`
- **Phone Mockups:** `1px solid #000000 with optional 8–16px offset duplicate frame for the peeled-sticker depth illusion`

## Imagery

Imagery is dominated by tilted, sticker-style illustrations of credit cards, percentage badges, candy/gem shapes, and phone mockups — all rendered with 1px black outlines and saturated fills as if die-cut and pasted onto the page. Photography is absent. Phone mockups appear repeatedly, sometimes overlapping cards at -8° to +12° rotations. Icons are flat, single-color, and outline-stroked in black. The visual register is printed-ephemera, not polished product render.

## Layout

Max-width 1200px centered, with the navigation rendered as a floating pill (not a full-width bar). The hero is a centered stacked composition: small floating nav, two-line 164px headline, then a phone mockup directly below. Mid-page alternates a three-column feature card row (16px radius, 24px column gap) with two-line captions beneath. A 168px horizontal padding wraps the hero, and 96px vertical gaps separate major sections. The bank-listing section uses a single dark panel with stacked white rows rather than a grid. Overall density is comfortable — generous whitespace between sections, tight rhythm inside cards.

## Agent Prompt Guide

## Quick Color Reference
- text: #000000
- background: #f2f2f2
- surface (card): #ffffff
- border: #000000 (1px, non-negotiable)
- accent sticker fills: #fa00ff (Riot Pink), #02bbff (Voltage Cyan), #adff02 (Toxic Lime), #e7e3bf (Sticker Khaki)
- primary action: no distinct CTA color

## Example Component Prompts
1. **Floating Nav Pill**: white (#ffffff) pill, 1px #000000 border, 16px radius, 10px/20px padding, fixed top-center, contains 'UGLYCASH' wordmark left, Discord + Instagram black icons middle, 'Get the App' ghost button right (white fill, 1px #000000 border, 16px radius, Inter 14/500).
2. **Display Headline Section**: 164px Helvetica Now Display Cn Bold weight 900, #000000, line-height 0.85, letter-spacing -5.41px, centered, with 168px horizontal page padding and 96px vertical gap below.
3. **Three-Up Feature Card Row**: three cards on a 24px column gap, each 16px radius with 1px #000000 border. Card 1 fill #e7e3bf, Card 2 fill #fa00ff, Card 3 fill #02bbff. Each card has 24px padding, a tilted phone mockup inside, and below the row a two-line caption in Inter 18/500 #000000.
4. **Toxic Lime Pill Action**: #adff02 background, 1px #000000 border, 16px radius, Inter 14/700 #000000, padding 5px/10px, sits inside any card or panel as a list-level action.
5. **Dark Bank-Listing Panel**: #3a3a3a fill, 1px #000000 border, 46px radius, 24px padding, containing white (#ffffff) interior rows with 16px radius, flag icon left, Inter 18/700 country name, Inter 14/400 #6e6e6e helper text, and a white-fill outlined 'Open' button right.

## Similar Brands

- **Cash App** — Same bright-against-neutral sticker aesthetic with single-vivid accent panels and oversized bold type, but UGLYCASH pushes the outlined-sticker border treatment harder
- **Revolut** — Comparable fintech information architecture (multi-currency account lists inside dark panels), though UGLYCASH swaps Revolut's purple for a louder neon-pink/cyan/lime palette and a brutalist border language
- **Gumroad** — Shares the irreverent Gen-Z tone, sticker-style illustration treatment, and a cream-and-black canvas that lets saturated accent colors do the work
- **Pimento** — Tilted illustrated cards, condensed display headlines, and a paper-on-paste visual metaphor are virtually identical in approach

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-static-black: #000000;
  --color-paper-cream: #f2f2f2;
  --color-card-white: #ffffff;
  --color-surface-graphite: #3a3a3a;
  --color-hardware-ink: #000100;
  --color-hairline-smoke: #6e6e6e;
  --color-placeholder-ash: #888888;
  --color-sticker-khaki: #e7e3bf;
  --color-riot-pink: #fa00ff;
  --color-voltage-cyan: #02bbff;
  --color-toxic-lime: #adff02;

  /* Typography — Font Families */
  --font-helvetica-now-display-cn-bold: 'Helvetica Now Display Cn Bold', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-miss-fajardose: 'Miss Fajardose', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-system-sans-serif: 'System sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.2;
  --tracking-caption: -0.24px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.29;
  --text-body: 18px;
  --leading-body: 1.33;
  --tracking-body: -0.36px;
  --text-subheading: 20px;
  --leading-subheading: 1.2;
  --tracking-subheading: -0.4px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.22;
  --tracking-heading-sm: -0.48px;
  --text-heading: 64px;
  --leading-heading: 0.94;
  --tracking-heading: -1.28px;
  --text-heading-lg: 85px;
  --leading-heading-lg: 0.85;
  --tracking-heading-lg: -2.81px;
  --text-display: 164px;
  --leading-display: 0.85;
  --tracking-display: -5.41px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-bold: 700;
  --font-weight-black: 900;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-5: 5px;
  --spacing-9: 9px;
  --spacing-10: 10px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-27: 27px;
  --spacing-34: 34px;
  --spacing-96: 96px;
  --spacing-168: 168px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 96px;
  --card-padding: 24px;
  --element-gap: 10px;

  /* Border Radius */
  --radius-sm: 1px;
  --radius-lg: 8.2px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-2xl-2: 23px;
  --radius-3xl: 38px;
  --radius-3xl-2: 43px;
  --radius-3xl-3: 46px;
  --radius-full: 50px;
  --radius-full-2: 100px;

  /* Named Radii */
  --radius-cards: 16px;
  --radius-buttons: 16px;
  --radius-hairline: 1px;
  --radius-herocards: 38px;
  --radius-phoneframes: 43px;
  --radius-featurepanels: 46px;

  /* Surfaces */
  --surface-canvas-cream: #f2f2f2;
  --surface-card-white: #ffffff;
  --surface-sticker-khaki: #e7e3bf;
  --surface-surface-graphite: #3a3a3a;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-static-black: #000000;
  --color-paper-cream: #f2f2f2;
  --color-card-white: #ffffff;
  --color-surface-graphite: #3a3a3a;
  --color-hardware-ink: #000100;
  --color-hairline-smoke: #6e6e6e;
  --color-placeholder-ash: #888888;
  --color-sticker-khaki: #e7e3bf;
  --color-riot-pink: #fa00ff;
  --color-voltage-cyan: #02bbff;
  --color-toxic-lime: #adff02;

  /* Typography */
  --font-helvetica-now-display-cn-bold: 'Helvetica Now Display Cn Bold', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-miss-fajardose: 'Miss Fajardose', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-system-sans-serif: 'System sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.2;
  --tracking-caption: -0.24px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.29;
  --text-body: 18px;
  --leading-body: 1.33;
  --tracking-body: -0.36px;
  --text-subheading: 20px;
  --leading-subheading: 1.2;
  --tracking-subheading: -0.4px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.22;
  --tracking-heading-sm: -0.48px;
  --text-heading: 64px;
  --leading-heading: 0.94;
  --tracking-heading: -1.28px;
  --text-heading-lg: 85px;
  --leading-heading-lg: 0.85;
  --tracking-heading-lg: -2.81px;
  --text-display: 164px;
  --leading-display: 0.85;
  --tracking-display: -5.41px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-5: 5px;
  --spacing-9: 9px;
  --spacing-10: 10px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-27: 27px;
  --spacing-34: 34px;
  --spacing-96: 96px;
  --spacing-168: 168px;

  /* Border Radius */
  --radius-sm: 1px;
  --radius-lg: 8.2px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-2xl-2: 23px;
  --radius-3xl: 38px;
  --radius-3xl-2: 43px;
  --radius-3xl-3: 46px;
  --radius-full: 50px;
  --radius-full-2: 100px;
}
```
