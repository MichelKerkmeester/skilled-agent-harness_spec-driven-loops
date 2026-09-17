# Patreon — Style Reference
> White gallery for creator portraits — a near-blank editorial stage where the only color lives inside the frame.

**Theme:** light

Patreon is an editorial-monochrome platform: a near-pure white canvas where the only color is photographic. The UI recedes so creator portraits can dominate. The custom 'Oracle' typeface is set in whisper-light weights (250–350) with aggressively tight negative tracking, producing a high-fashion magazine tone rather than a typical SaaS register. Buttons and inputs are pill-shaped (30–45px radii), borders are hairline #1a1a1a, and the single filled action is pure black — no chromatic brand color, no gradients, no decorative tint. The system is deliberately austere: the visual richness comes from real human photography, not from interface ornament.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Obsidian | `#1a1a1a` | `--color-obsidian` | Primary text, hairline borders, subtle dividers — used at very-high frequency (1452 instances) across body, list, card, and input borders. The near-black rather than pure #000 keeps the UI from feeling harsh while preserving the monochromatic authority |
| Paper | `#ffffff` | `--color-paper` | Page canvas, card surfaces, button text on dark fills, input fields. The base layer everything else floats on |
| Stage Black | `#000000` | `--color-stage-black` | High-contrast neutral action fill for primary buttons on light surfaces. |
| Concrete | `#959595` | `--color-concrete` | Mid-tone neutral for secondary text, muted metadata, disabled states. Bridges the gap between #1a1a1a and white for hierarchical de-emphasis |
| Stone | `#90867a` | `--color-stone` | Warm-tinted neutral appearing in hero overlays and photographic edges. Subtly breaks the otherwise cool monochrome with an organic warmth pulled from creator imagery |
| Sky Tint | `#94bbff` | `--color-sky-tint` | Soft blue-washed section background visible behind the creator-photo carousel. Functions as a breathing tonal band between the pure-white canvas and photographic blocks — never used on UI controls |
| Deep Sky | `#71a0ff` | `--color-deep-sky` | Violet wash for highlight backgrounds, decorative bands, and soft emphasis behind content. Do not promote it to the primary CTA color |
| Brand Blue | `#002a57` | `--color-brand-blue` | Deep navy from the logo wordmark and highest-contrast brand moments. The darkest chromatic in the system, reserved for brand identity and the cookie banner link text |

## Tokens — Typography

### Oracle — Sole typeface across all contexts — body, heading, button, link, input, card. The 250–300 weights for display and headings are anti-convention: most platforms shout with 700–800 weights; Oracle whispers, creating editorial authority through restraint. The 500 weight appears only in UI controls and nav. Negative letter-spacing scales with size: -0.06em at 188px down to -0.018em at 22px, pulling the wide display headlines into a tight, monolithic block. · `--font-oracle`
- **Substitute:** Söhne (Klim Type Foundry) — same ultra-light weight range and tight tracking. Free alternative: 'Inter' at weight 200–300 captures the feel.
- **Weights:** 250, 300, 350, 400, 500
- **Sizes:** 8, 14, 15, 22, 26, 27, 39, 54, 128, 188
- **Line height:** 0.87, 0.98, 1.00, 1.10, 1.20, 1.50
- **Letter spacing:** -0.06em at 188px, -0.055em at 128px, -0.04em at 54px, -0.023em at 27px, -0.02em at 22px, -0.018em at 15px, +0.02em at 8px (uppercase micro-labels)
- **OpenType features:** `'ss01' on, 'tnum' on, 'kern' on`
- **Role:** Sole typeface across all contexts — body, heading, button, link, input, card. The 250–300 weights for display and headings are anti-convention: most platforms shout with 700–800 weights; Oracle whispers, creating editorial authority through restraint. The 500 weight appears only in UI controls and nav. Negative letter-spacing scales with size: -0.06em at 188px down to -0.018em at 22px, pulling the wide display headlines into a tight, monolithic block.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| body-sm | 14px | 1.5 | — | `--text-body-sm` |
| subheading | 22px | 1.2 | -0.44px | `--text-subheading` |
| heading-sm | 26px | 1.1 | -0.6px | `--text-heading-sm` |
| heading | 39px | 1 | -0.88px | `--text-heading` |
| heading-lg | 54px | 0.98 | -2.16px | `--text-heading-lg` |
| display | 128px | 0.87 | -7.04px | `--text-display` |
| display-xl | 188px | 0.87 | -11.28px | `--text-display-xl` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 8 | 8px | `--spacing-8` |
| 20 | 20px | `--spacing-20` |
| 60 | 60px | `--spacing-60` |
| 120 | 120px | `--spacing-120` |
| 128 | 128px | `--spacing-128` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 9999px |
| cards | 30px |
| links | 30px |
| inputs | 45px |
| buttons | 30px |

### Layout

- **Page max-width:** 1440px
- **Section gap:** 64-96px
- **Card padding:** 16-24px
- **Element gap:** 8-14px

## Components

### Primary CTA Button (Get Started)
**Role:** The single filled button in the system — the only black surface element besides text.

Pure #000000 fill, #ffffff text, 30px border-radius, 14px vertical × 21px horizontal padding, Oracle weight 400 at 15px. No border. Appears once per screen in the top-right nav. The contrast against the white page creates the only visual 'pulse' in the otherwise monochrome UI.

### Ghost Outline Button (Log in)
**Role:** Secondary action in the nav — de-emphasized relative to the primary CTA.

Transparent fill, #1a1a1a 1px border, #1a1a1a text, 30px radius, 14px × 21px padding, Oracle 400 at 15px. Sits left of the primary CTA as a quieter option.

### Pill Nav Link (Updates)
**Role:** Navigation item styled as a pill with full border — distinct from flat text links.

Transparent fill, #1a1a1a 1px border, full 9999px radius, 11px vertical × 15px horizontal padding, Oracle 400 at 15px. Creates a visual 'chip' pattern that signals it as a content category rather than a destination.

### Text Nav Link
**Role:** Standard navigation items (Creators, Features, Pricing, Resources).

No background, no border, #1a1a1a text, Oracle 400 at 15px, 8px horizontal padding. Flush to baseline, no underline by default. Underline or opacity change on hover.

### Creator Portrait Card
**Role:** Photographic content card in the grid layout — the system's primary content unit.

Square or 4:5 aspect ratio photography with no visible border or shadow. 30px radius on the photo container. Creator name in Oracle 400 at 15px below the image in #1a1a1a. No card background — the image sits directly on the page canvas.

### Hero Photography Block
**Role:** Full-bleed creator portrait that fills the viewport's height, carrying the page's emotional weight.

Edge-to-edge image with no padding or margin. White or light text overlay positioned in the lower third. No gradient overlay — the text relies on natural contrast in the photograph. Headline set in Oracle 250 at 54–128px in #ffffff.

### Search Input (Find a Creator)
**Role:** Top-nav search field with icon prefix.

White fill, #1a1a1a 1px border, 45px radius (more rounded than buttons), 11px vertical × 15px horizontal padding, Oracle 400 at 15px. Search icon left-aligned in #1a1a1a. Placeholder text in #959595.

### Cookie Consent Banner
**Role:** Fixed-bottom modal for privacy compliance — the only floating UI element.

White fill, 1px #1a1a1a border, 12px radius, horizontal padding 24px. Heading in Oracle 500 at 15px #1a1a1a. Body in Oracle 400 at 15px #1a1a1a. Three action buttons stacked: filled #1a1a1a (Accept all), outlined #1a1a1a (Reject non-essential), text link (More choices). A blue link (#002a57) for 'See Our Privacy Policy'.

### Section Headline (Editorial)
**Role:** Large display text used in section openers like 'Creativity powered by fandom'.

Oracle 250 at 54–128px, #1a1a1a on white or #ffffff on dark/photo, line-height 0.98–1.1, letter-spacing scaled to -0.04em. The weight-250 choice is the signature: the type looks almost handwritten or sketched rather than typed.

### Body Text Block
**Role:** Standard paragraph copy for descriptions and marketing prose.

Oracle 400 at 15px, #1a1a1a, line-height 1.5, letter-spacing -0.018em. 20px bottom margin for paragraph spacing. No drop cap, no pull quote — entirely utilitarian.

### Footer
**Role:** Standard site footer with link columns.

White or near-white fill, 1px top border in #1a1a1a, 64px+ vertical padding. Link columns in Oracle 400 at 15px #1a1a1a. No social icons styled with color — likely monochrome glyphs.

## Do's and Don'ts

### Do
- Use Oracle at weight 250–300 for all display headlines (54px+); the whisper-light weight is the brand's typographic signature.
- Keep the primary CTA (#000000 fill, 30px radius) as the only filled dark surface — never introduce a second filled button style.
- Use 30px border-radius on all buttons, links, and cards; 45px on inputs; 9999px on tag/pill elements.
- Set letter-spacing at -0.04em to -0.06em on any display-size type (54px+); tighter tracking at larger sizes prevents the light weight from looking airy.
- Let photography fill the visual space — use 4:5 or 1:1 aspect ratio creator portraits with 30px radius and no card chrome.
- Use #1a1a1a for all text and borders, not #000000 — the near-black reads as softer while preserving contrast.
- Maintain a 4px spacing base with comfortable density: 8–14px between elements, 16–24px card padding, 64–96px section gaps.

### Don't
- Do not introduce a chromatic brand color for buttons, links, or CTAs — the system is deliberately monochrome.
- Do not use display weights above 500 on Oracle; the 600+ range breaks the editorial whisper-tone.
- Do not add shadows or elevation to cards — the system relies on hairline borders and white space for separation.
- Do not use gradients on buttons, backgrounds, or overlays — the data shows zero gradient usage.
- Do not set body text in anything wider than Oracle; the custom typeface's geometry is part of the identity.
- Do not round corners at less than 30px on containers — the pill-everywhere approach is structural, not decorative.
- Do not place UI text directly on busy photography without sufficient natural contrast or a solid overlay — legibility over atmosphere.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Paper | `#ffffff` | Page canvas — the dominant background across all sections |
| 2 | Stage | `#94bbff` | Tinted section band appearing behind the creator-photo carousel — a soft blue atmospheric break |
| 3 | Overlay | `#1a1a1a` | Dark text overlay on hero photography — semi-transparent or full-opacity for caption legibility |

## Elevation

The system uses no shadows. Depth and separation are achieved through: (1) hairline #1a1a1a 1px borders on inputs, buttons, and cards; (2) generous white space between sections; (3) the contrast between pure-black CTA fills and the white canvas; and (4) edge-to-edge photography that creates natural visual layering. Adding box-shadow would break the flat editorial register.

## Imagery

Photography is the entire visual system. Creator portraits are shot in warm, natural-light environments — a podcaster with headphones, an artist at an easel, a musician with a golden mirror frame. Treatment is full-bleed with no decorative framing, no duotone, no color grading overlay. Photos are presented at large scale (full viewport width or edge-to-edge section bands) with generous aspect ratios. No illustration, no 3D renders, no abstract graphics appear. The only non-photographic visual is the small 'P' Patreon logo mark in the nav, set in solid black. Photography density is very high: every section break features at least one creator portrait, making the page read as a visual editorial rather than a product UI.

## Layout

Full-bleed hero with edge-to-edge photography and a single sticky top nav. Navigation is minimal: 4 text links left, centered logo, search + login + CTA right. The page is divided into full-viewport-height sections, each anchored by a large creator photograph with a single editorial headline overlaid in the lower third. A distinctive mid-page section uses a soft blue (#94bbff) background band displaying a horizontal carousel/grid of square creator portrait cards with no card chrome. Content alternates between white-canvas text blocks (centered or left-aligned, max-width ~1200px) and full-bleed photographic sections. Section gaps are generous (64–96px) to let each creator story breathe. No sidebar, no mega-menu, no multi-column dashboard patterns — this is a marketing surface, not a product UI.

## Agent Prompt Guide

QUICK COLOR REFERENCE
- text/border: #1a1a1a
- background/canvas: #ffffff
- primary action: #000000 (filled action)
- muted text: #959595
- brand logo/accent: #002a57
- section tint: #94bbff

EXAMPLE COMPONENT PROMPTS:

1. Create a hero section: Full-bleed creator photograph as background, no overlay. Headline 'Creativity is everywhere' positioned lower-left in Oracle weight 250 at 128px, #ffffff, line-height 0.87, letter-spacing -0.06em. No subtext, no button — let the photo carry it.

2. Create a creator portrait card: Square (1:1) photograph with 30px border-radius, no border, no shadow. Creator name below in Oracle 400 at 15px, #1a1a1a, 14px top margin. No card background — image sits directly on #ffffff canvas.

3. Create a top navigation bar: White fill, sticky, 16px vertical padding. Left: four text links (Creators, Features, Pricing, Resources) in Oracle 400 at 15px, #1a1a1a, 8px horizontal gap. Center: Patreon 'P' logo in #000000. Right: search input (45px radius, 1px #1a1a1a border, placeholder 'Find a Creator' in #959595), ghost outline button 'Log in' (30px radius, 1px #1a1a1a border, #1a1a1a text), filled black button 'Get Started' (30px radius, #000000 fill, #ffffff text).

4. Create a section opener: White canvas, max-width 1200px centered. Headline 'Creativity powered by fandom' in Oracle 250 at 54px, #1a1a1a, line-height 0.98, letter-spacing -0.04em. Below, a horizontal row of 5 creator portrait cards (square, 30px radius, overlapping slightly with -4px margin). Section background transitions to #94bbff at 50% height.

5. Create a body text block: White background, max-width 640px. Paragraph in Oracle 400 at 15px, #1a1a1a, line-height 1.5, letter-spacing -0.018em, 20px bottom margin. No first-line indent, no drop cap.

## Typography Philosophy

Oracle is set exclusively in weights 250–500. The absence of bold (600+) is a deliberate constraint: the system communicates hierarchy through size and tracking, not weight escalation. A 128px headline at weight 250 has the same visual mass as a 22px subhead at weight 500 — the system balances lightness with scale. Body text sits at 15px (not the more common 16px), creating a tighter visual density that pairs with the light display weights. All letter-spacing is negative except the 8px uppercase micro-labels (+0.02em), which need slight expansion to remain legible.

## Radius System

Three discrete radius values define the system's softness: 30px (buttons, links, cards), 45px (inputs), and 9999px (pill tags and the 'Updates' nav chip). There are no sharp 0px corners and no intermediate values like 8px or 12px. The choice to push past typical 'rounded' territory (4–16px) into 'pill' territory (30–45px) makes every interactive element feel inviting and finger-friendly, reinforcing the creator-community warmth.

## Similar Brands

- **Substack** — Same monochrome-editorial approach: white canvas, single-color logo, serif-or-light-sans typography, photography-driven hero, pill-shaped buttons, near-zero chromatic palette.
- **Medium** — Editorial publishing aesthetic with extreme typographic restraint, custom or near-custom light-weight type, photography as primary content, and an almost total absence of color in the interface.
- **Apple (macOS / iCloud pages)** — Same whisper-weight headline philosophy (SF Pro at 200–300 for hero copy), full-bleed product photography, and monochrome UI chrome that defers to imagery.
- **Arc Browser** — Similar ultra-rounded geometry (pill buttons, generous radii), custom-feeling typeface at light weights, and a marketing site that uses bold photography over UI ornament.
- **VSCO** — Creator-tool platform with a deliberately understated, near-monochrome marketing surface that lets the user-generated photography and portfolios take visual precedence.

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-obsidian: #1a1a1a;
  --color-paper: #ffffff;
  --color-stage-black: #000000;
  --color-concrete: #959595;
  --color-stone: #90867a;
  --color-sky-tint: #94bbff;
  --color-deep-sky: #71a0ff;
  --color-brand-blue: #002a57;

  /* Typography — Font Families */
  --font-oracle: 'Oracle', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --text-subheading: 22px;
  --leading-subheading: 1.2;
  --tracking-subheading: -0.44px;
  --text-heading-sm: 26px;
  --leading-heading-sm: 1.1;
  --tracking-heading-sm: -0.6px;
  --text-heading: 39px;
  --leading-heading: 1;
  --tracking-heading: -0.88px;
  --text-heading-lg: 54px;
  --leading-heading-lg: 0.98;
  --tracking-heading-lg: -2.16px;
  --text-display: 128px;
  --leading-display: 0.87;
  --tracking-display: -7.04px;
  --text-display-xl: 188px;
  --leading-display-xl: 0.87;
  --tracking-display-xl: -11.28px;

  /* Typography — Weights */
  --font-weight-w250: 250;
  --font-weight-light: 300;
  --font-weight-w350: 350;
  --font-weight-regular: 400;
  --font-weight-medium: 500;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-20: 20px;
  --spacing-60: 60px;
  --spacing-120: 120px;
  --spacing-128: 128px;

  /* Layout */
  --page-max-width: 1440px;
  --section-gap: 64-96px;
  --card-padding: 16-24px;
  --element-gap: 8-14px;

  /* Border Radius */
  --radius-3xl: 30px;
  --radius-3xl-2: 37.5px;
  --radius-3xl-3: 45px;

  /* Named Radii */
  --radius-tags: 9999px;
  --radius-cards: 30px;
  --radius-links: 30px;
  --radius-inputs: 45px;
  --radius-buttons: 30px;

  /* Surfaces */
  --surface-paper: #ffffff;
  --surface-stage: #94bbff;
  --surface-overlay: #1a1a1a;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-obsidian: #1a1a1a;
  --color-paper: #ffffff;
  --color-stage-black: #000000;
  --color-concrete: #959595;
  --color-stone: #90867a;
  --color-sky-tint: #94bbff;
  --color-deep-sky: #71a0ff;
  --color-brand-blue: #002a57;

  /* Typography */
  --font-oracle: 'Oracle', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --text-subheading: 22px;
  --leading-subheading: 1.2;
  --tracking-subheading: -0.44px;
  --text-heading-sm: 26px;
  --leading-heading-sm: 1.1;
  --tracking-heading-sm: -0.6px;
  --text-heading: 39px;
  --leading-heading: 1;
  --tracking-heading: -0.88px;
  --text-heading-lg: 54px;
  --leading-heading-lg: 0.98;
  --tracking-heading-lg: -2.16px;
  --text-display: 128px;
  --leading-display: 0.87;
  --tracking-display: -7.04px;
  --text-display-xl: 188px;
  --leading-display-xl: 0.87;
  --tracking-display-xl: -11.28px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-20: 20px;
  --spacing-60: 60px;
  --spacing-120: 120px;
  --spacing-128: 128px;

  /* Border Radius */
  --radius-3xl: 30px;
  --radius-3xl-2: 37.5px;
  --radius-3xl-3: 45px;
}
```
