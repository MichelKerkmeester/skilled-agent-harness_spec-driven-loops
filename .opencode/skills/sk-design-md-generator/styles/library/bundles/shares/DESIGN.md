# Shares — Style Reference
> Ivory terminal with violet pulse — a clinical white workspace where one color marks every deliberate action.

**Theme:** light

A monochromatic fintech interface on near-white surfaces, where one vivid violet does all the talking. The visual language is sparse and confident: no decorative gradients, no chromatic ornamentation, no shadow theatrics. Everything sits on flat porcelain with dark charcoal text, and the only color that earns attention is Signal Violet (#594ff4), reserved strictly for action — filled buttons, active links, brand marks. Components lean on geometry rather than depth: pill-shaped controls (99px radius), generously rounded cards (36px), and soft 1px gray dividers instead of elevation. Typography is geometric and tightly tracked, with large headlines at compressed line-heights (1.05–1.15) that feel architectural rather than editorial. Product mockups float in layered, slightly overlapping arrangements — phone + dashboard + code panel — anchored by a single brand color.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Signal Violet | `#594ff4` | `--color-signal-violet` | Primary action fill, active links, brand iconography — the only chromatic color in the system, creating high-contrast urgency against the monochrome canvas |
| Inkstone | `#1f1f1f` | `--color-inkstone` | Primary headings, body text emphasis, dark surface fills — the dominant dark neutral |
| Graphite | `#333333` | `--color-graphite` | Secondary text, dense borders, icon strokes — the most-used neutral |
| Slate | `#5d5d5d` | `--color-slate` | Muted body text, navigation subtext, secondary borders |
| Smoke | `#888888` | `--color-smoke` | Tertiary text, helper copy, light borders |
| Ash | `#b0b0b0` | `--color-ash` | Muted link text, hairline dividers, inactive borders |
| Mist | `#e7e7e7` | `--color-mist` | Image and photo borders, very light separators |
| Cloud | `#f6f6f6` | `--color-cloud` | Card surfaces, FAQ panels, subtle background tints — the soft elevation layer |
| Porcelain | `#ffffff` | `--color-porcelain` | Page canvas, button text on violet fill, primary card background — the dominant base surface |
| Obsidian | `#000000` | `--color-obsidian` | Footer fill, maximum-contrast text — used sparingly for the darkest dark |

## Tokens — Typography

### Aeonik — Primary brand typeface for all text — geometric sans with weights 500 (medium) for body/UI and 700 (bold) for headlines. The 72px/56px display sizes paired with tight 1.05–1.10 line-heights create architectural headlines that feel constructed rather than editorial. Tracking of 0.075em applies to uppercase eyebrows and headings, giving them a premium, slightly-spaced cadence. · `--font-aeonik`
- **Substitute:** Inter, DM Sans, or Manrope at matching weights
- **Weights:** 500, 700
- **Sizes:** 14px, 15px, 16px, 17px, 18px, 20px, 26px, 36px, 56px, 72px
- **Line height:** 1.00–1.50
- **Letter spacing:** 0.075em (uppercase eyebrows and display headlines)
- **OpenType features:** `"ss01" on, "cv11" on`
- **Role:** Primary brand typeface for all text — geometric sans with weights 500 (medium) for body/UI and 700 (bold) for headlines. The 72px/56px display sizes paired with tight 1.05–1.10 line-heights create architectural headlines that feel constructed rather than editorial. Tracking of 0.075em applies to uppercase eyebrows and headings, giving them a premium, slightly-spaced cadence.

### Rubik — Minor inline use only — appears in small widget contexts, not the primary system font · `--font-rubik`
- **Substitute:** Inter, system-ui
- **Weights:** 500
- **Sizes:** 14px
- **Line height:** 1.50
- **Role:** Minor inline use only — appears in small widget contexts, not the primary system font

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 14px | 1.5 | 1.05px | `--text-caption` |
| heading-sm | 20px | 1.33 | 1.5px | `--text-heading-sm` |
| heading | 26px | 1.2 | 1.95px | `--text-heading` |
| heading-lg | 36px | 1.15 | 2.7px | `--text-heading-lg` |
| display | 56px | 1.1 | 4.2px | `--text-display` |
| display-lg | 72px | 1.05 | 5.4px | `--text-display-lg` |

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
| 28 | 28px | `--spacing-28` |
| 32 | 32px | `--spacing-32` |
| 48 | 48px | `--spacing-48` |
| 52 | 52px | `--spacing-52` |
| 96 | 96px | `--spacing-96` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 99px |
| cards | 36px |
| images | 10px |
| inputs | 16px |
| buttons | 99px |
| accordion | 16px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| xl | `rgba(0, 0, 0, 0.12) 0px 0px 60px -13px` | `--shadow-xl` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 64px
- **Card padding:** 32px
- **Element gap:** 24px

## Components

### Pill Primary Button
**Role:** Main call-to-action — the sole filled chromatic element

Filled Signal Violet (#594ff4) background, white text, 99px border-radius (full pill), Aeonik 500 at 16px. Padding 12px 28px or 16px 28px depending on size. No shadow. The pill geometry and single-color confidence make every CTA visually unmistakable against the monochrome canvas.

### Ghost Navigation Button
**Role:** Secondary header CTA — minimal, text-and-border

Transparent or white background with Signal Violet border, Signal Violet text, 99px radius, Aeonik 500 at 16px, padding 10px 24px. Lighter visual weight than the primary pill, signaling secondary action hierarchy.

### Feature Highlight Card
**Role:** Icon + heading + description unit in 3-column grids

Transparent or white background, no border. Icon at top (Signal Violet stroke), heading in Aeonik 700 at 20px Inkstone (#1f1f1f), body in Aeonik 500 at 16px Slate (#5d5d5d). Vertical rhythm of 16–24px between elements. The card does not carry its own surface — the white page IS the card.

### Product Showcase Card
**Role:** Large 2-column section with text-left, visual-right

White or Cloud (#f6f6f6) background, 36px border-radius, 32px internal padding. Left column: heading (Aeonik 700 36px Inkstone), body (Aeonik 500 16px Slate), CTA pill button. Right column: layered product mockup floating slightly above the card surface with the single soft shadow pattern.

### FAQ Accordion Item
**Role:** Expandable question/answer panel

Cloud (#f6f6f6) background, 16px border-radius, padding 20px 24px. Question text in Aeonik 500 at 16px Inkstone, with a small chevron icon on the right. Closed by default; expanded reveals body text below in lighter Slate. No animation emphasis — the toggle is instant and quiet.

### Navigation Bar
**Role:** Top-of-page global navigation

White background, full-width, 64–80px height. Left: logo mark (Signal Violet geometric 'S' + wordmark). Center: nav links (Aeonik 500 16px Inkstone, with dropdown chevrons). Right: Ghost or Primary pill CTA. Hairline bottom border in Ash (#b0b0b0) or none — the nav floats on white with no shadow.

### Layered Product Mockup Cluster
**Role:** Hero visual composition of phone, dashboard, and code panels

Three overlapping product screenshots arranged with intentional layering: phone mockup front-left, dashboard panel center-right, code/JSON panel back-right. Each panel has 10–16px border-radius and the single shadow pattern (rgba(0,0,0,0.12) 0 0 60px -13px) for soft depth. Accent green line charts inside the dashboard are the only secondary color (from product content, not design tokens).

### Stats Display Block
**Role:** Large number + label pattern

Large figure in Aeonik 700 at 26–36px Inkstone, with a small percentage delta in muted green below (product data). Label in Aeonik 500 at 14–16px Smoke (#888888) above. Horizontal row layout with 24–32px gaps between stat groups.

### Section Eyebrow Label
**Role:** Small uppercase heading above section titles

Aeonik 500 at 14–16px, letter-spacing 0.075em, uppercase, centered or left-aligned. Color: Inkstone or Smoke. Paired with a large heading below. This eyebrow-to-headline rhythm is the section signature.

### Dark Footer
**Role:** Full-bleed dark band at page bottom

Obsidian (#000000) or Inkstone (#1f1f1f) background, white and Slate text. Links in Aeonik 500 at 16px. Generous padding (48–64px vertical). Logo, nav columns, and legal text in a multi-column grid. The only dark surface in an otherwise light page — it reads as a definitive close.

### Stat Badge / Tag
**Role:** Small pill-shaped label with violet or neutral fill

99px border-radius, padding 4px 12px, Aeonik 500 at 14px. Two variants: Signal Violet background with white text (active/selected), or Cloud (#f6f6f6) background with Inkstone text (neutral tag).

## Do's and Don'ts

### Do
- Use #594ff4 Signal Violet exclusively for primary actions, active states, and brand iconography — never for decorative or background purposes
- Set all interactive buttons to 99px border-radius for the signature pill geometry
- Set all content cards to 36px border-radius with 32px internal padding for the soft, generous feel
- Use Aeonik 500 for body and UI, Aeonik 700 for headings — never mix in other weights or families
- Apply 0.075em letter-spacing to all uppercase eyebrows and display headlines for the tracked-out premium cadence
- Use #f6f6f6 Cloud as the card surface to create elevation through tint, not shadow
- Reserve the single soft shadow pattern for floating product mockups only — never for buttons, cards, or inputs
- Keep section gaps at 64px and element gaps at 24px to maintain the comfortable, architectural rhythm

### Don't
- Do not introduce additional chromatic colors — the system is 98% monochrome and any new hue breaks the discipline
- Do not use sharp corners (0–4px) on cards or images — all containers should be 16px+ radius
- Do not apply heavy drop shadows to UI elements — depth comes from surface tint, not blur
- Do not use gradient fills anywhere — the system is flat by design
- Do not use serif, slab, or display fonts — Aeonik (or Inter/DM Sans substitute) is the only typeface
- Do not set body text above 16px or headings below 26px — the type scale jumps are deliberate
- Do not use emoji or multicolor icon sets — icons are monoline, monocolor, 1.5–2px stroke
- Do not add animations, parallax, or scroll-triggered effects — the system is static and clinical

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Porcelain | `#ffffff` | Page canvas — the dominant base surface |
| 1 | Cloud | `#f6f6f6` | Card and FAQ panel surface — subtle elevation through tint, not shadow |
| 2 | Signal Violet | `#594ff4` | Action surface — filled buttons and active states |
| 3 | Inkstone | `#1f1f1f` | Dark surface — footer and inverted panels |

## Elevation

- **Layered Product Mockup:** `rgba(0, 0, 0, 0.12) 0px 0px 60px -13px`

## Imagery

No photography, no illustration, no decorative graphics. The visual language is entirely product-mockup-driven: floating phone screens, dashboard panels, and code editor windows arranged in layered, slightly overlapping compositions. Mockups have 10–16px border-radius and one soft shadow pattern. Inside the product, a vivid green line chart (#1AAB8B approximate) provides the only secondary color accent. The product IS the hero — there are no lifestyle images, no team photos, no abstract backgrounds. Icons are minimal line-art, 1.5–2px stroke, monocolor (Signal Violet or Inkstone).

## Layout

Max-width 1200px centered container, full-bleed sections within that constraint. Hero: centered headline (72px) + subtext (17–18px) stacked vertically, then layered product mockup cluster below. Feature highlights: 3-column equal grid with icon + heading + body, centered within container. Product detail sections: 2-column text-left / visual-right, alternating direction down the page. FAQ: centered single-column with max-width ~720px. Footer: full-bleed dark band spanning edge-to-edge. Navigation: sticky top bar, white, 64–80px height, logo-left / nav-center / CTA-right. Section rhythm: generous vertical breathing (64–96px between sections) with seamless flow, no alternating dark bands.

## Agent Prompt Guide

**Quick Color Reference**
- text (primary): #1f1f1f Inkstone
- text (secondary): #5d5d5d Slate
- text (muted): #888888 Smoke
- background (page): #ffffff Porcelain
- background (card): #f6f6f6 Cloud
- border (hairline): #b0b0b0 Ash
- accent / primary action: #594ff4 (filled action)

**3-5 Example Component Prompts**

1. **Hero Section**: White (#ffffff) page background. Centered headline: Aeonik 700, 72px, #1f1f1f, line-height 1.05, letter-spacing 0.075em. Subtext below: Aeonik 500, 17px, #5d5d5d, line-height 1.50. Below text, a layered product mockup cluster: phone screen (10px radius) overlapping a dashboard panel (16px radius) overlapping a code editor panel (16px radius), all with shadow rgba(0,0,0,0.12) 0 0 60px -13px.

2. **Pill Primary Button**: #594ff4 Signal Violet background, white text, Aeonik 500 at 16px, 99px border-radius, padding 12px 28px, no shadow. Text: 'Get started'.

3. **Feature Highlight Card**: Transparent background (sits on white page). Signal Violet icon at top (monoline, 2px stroke, 32px size). Heading: Aeonik 700, 20px, #1f1f1f. Body: Aeonik 500, 16px, #5d5d5d, line-height 1.50. Vertical gap of 16px between icon, heading, and body.

4. **FAQ Accordion Item**: #f6f6f6 Cloud background, 16px border-radius, padding 20px 24px. Question text: Aeonik 500, 16px, #1f1f1f. Chevron icon on the right (#1f1f1f). No border, no shadow.

5. **Dark Footer**: #000000 or #1f1f1f full-bleed background, 64px vertical padding. Three-column grid of links in Aeonik 500, 16px, white or #b0b0b0 text. Logo mark (Signal Violet geometric shape + white wordmark) at top-left.

## Similar Brands

- **Mercury** — Same monochrome-on-white fintech aesthetic with a single accent color, pill-shaped CTAs, and generous whitespace — both treat the product mockup as the hero visual
- **Stripe** — Shared commitment to a single chromatic accent against a clean white canvas, tight typographic discipline, and pill-shaped primary actions
- **Linear** — Identical 99px pill-button radius, monochrome interface with one vivid accent, and the same flat-surface-over-shadow elevation philosophy
- **Ramp** — Same sparse white-canvas fintech language, dark charcoal typography, and violet-adjacent accent used only for actions — the product UI does the visual heavy lifting
- **Wealthfront** — Fellow investing platform with a clinical white-interface approach, large rounded product cards, and restrained use of color for functional emphasis only

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-signal-violet: #594ff4;
  --color-inkstone: #1f1f1f;
  --color-graphite: #333333;
  --color-slate: #5d5d5d;
  --color-smoke: #888888;
  --color-ash: #b0b0b0;
  --color-mist: #e7e7e7;
  --color-cloud: #f6f6f6;
  --color-porcelain: #ffffff;
  --color-obsidian: #000000;

  /* Typography — Font Families */
  --font-aeonik: 'Aeonik', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-rubik: 'Rubik', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.5;
  --tracking-caption: 1.05px;
  --text-heading-sm: 20px;
  --leading-heading-sm: 1.33;
  --tracking-heading-sm: 1.5px;
  --text-heading: 26px;
  --leading-heading: 1.2;
  --tracking-heading: 1.95px;
  --text-heading-lg: 36px;
  --leading-heading-lg: 1.15;
  --tracking-heading-lg: 2.7px;
  --text-display: 56px;
  --leading-display: 1.1;
  --tracking-display: 4.2px;
  --text-display-lg: 72px;
  --leading-display-lg: 1.05;
  --tracking-display-lg: 5.4px;

  /* Typography — Weights */
  --font-weight-medium: 500;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-48: 48px;
  --spacing-52: 52px;
  --spacing-96: 96px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 64px;
  --card-padding: 32px;
  --element-gap: 24px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 10px;
  --radius-2xl: 16px;
  --radius-3xl: 24px;
  --radius-3xl-2: 30px;
  --radius-3xl-3: 36px;
  --radius-full: 50px;
  --radius-full-2: 60px;
  --radius-full-3: 99px;

  /* Named Radii */
  --radius-tags: 99px;
  --radius-cards: 36px;
  --radius-images: 10px;
  --radius-inputs: 16px;
  --radius-buttons: 99px;
  --radius-accordion: 16px;

  /* Shadows */
  --shadow-xl: rgba(0, 0, 0, 0.12) 0px 0px 60px -13px;

  /* Surfaces */
  --surface-porcelain: #ffffff;
  --surface-cloud: #f6f6f6;
  --surface-signal-violet: #594ff4;
  --surface-inkstone: #1f1f1f;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-signal-violet: #594ff4;
  --color-inkstone: #1f1f1f;
  --color-graphite: #333333;
  --color-slate: #5d5d5d;
  --color-smoke: #888888;
  --color-ash: #b0b0b0;
  --color-mist: #e7e7e7;
  --color-cloud: #f6f6f6;
  --color-porcelain: #ffffff;
  --color-obsidian: #000000;

  /* Typography */
  --font-aeonik: 'Aeonik', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-rubik: 'Rubik', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.5;
  --tracking-caption: 1.05px;
  --text-heading-sm: 20px;
  --leading-heading-sm: 1.33;
  --tracking-heading-sm: 1.5px;
  --text-heading: 26px;
  --leading-heading: 1.2;
  --tracking-heading: 1.95px;
  --text-heading-lg: 36px;
  --leading-heading-lg: 1.15;
  --tracking-heading-lg: 2.7px;
  --text-display: 56px;
  --leading-display: 1.1;
  --tracking-display: 4.2px;
  --text-display-lg: 72px;
  --leading-display-lg: 1.05;
  --tracking-display-lg: 5.4px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-48: 48px;
  --spacing-52: 52px;
  --spacing-96: 96px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 10px;
  --radius-2xl: 16px;
  --radius-3xl: 24px;
  --radius-3xl-2: 30px;
  --radius-3xl-3: 36px;
  --radius-full: 50px;
  --radius-full-2: 60px;
  --radius-full-3: 99px;

  /* Shadows */
  --shadow-xl: rgba(0, 0, 0, 0.12) 0px 0px 60px -13px;
}
```
