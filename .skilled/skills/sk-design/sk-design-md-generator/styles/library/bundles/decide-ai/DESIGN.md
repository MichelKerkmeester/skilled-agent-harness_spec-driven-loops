# Decide AI — Style Reference
> Observatory at midnight — mint signal

**Theme:** dark

Decide AI operates as a midnight intelligence command center — a near-black canvas (Deep Obsidian) where massive display type dominates and a single mint-green accent (#73ffb9) punctuates the silence. The system speaks in two voices: whisper-quiet product cards on a dark surface, and oversized editorial headlines at 110–220px that fill the viewport like a magazine spread. Typography is the entire personality: PP Neue Montreal at display weights with aggressive negative tracking collapses the visual gap between letters, creating geometric solidity at extreme sizes. Components are minimal — pill-radius buttons, thin hairline borders in #e5e7eb, and almost no decoration. Color is rationed: a 2% colorfulness budget means the green accent appears as bars, icons, and rare punctuation rather than full surfaces. Density is comfortable and spacious, with generous vertical gaps and content centered in wide container widths.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Deep Obsidian | `#030303` | `--color-deep-obsidian` | Page canvas, card surfaces, body text on light surfaces |
| Pure Black | `#000000` | `--color-pure-black` | SVG fills, deepest surface level beneath Obsidian |
| Frost | `#ffffff` | `--color-frost` | Primary text on dark surfaces, icon fills, inverted surfaces |
| Silver Haze | `#e5e7eb` | `--color-silver-haze` | Hairline borders, dividers, subtle list separators |
| Mint Signal | `#73ffb9` | `--color-mint-signal` | Sole accent — decorative bars, active step indicators, icon highlights, signal punctuation against the dark canvas |

## Tokens — Typography

### PP Neue Montreal — Single typeface carrying the entire brand voice — body, headings, and oversized display (up to 220px). The aggressive negative tracking (-0.0360em at display, -0.0320em at subhead) is the signature: letters lock together tightly even at 110px+, making the type read as a solid mass rather than individual glyphs. Weight 700 reserved for the largest display moments, weight 500 for subheadings, weight 400 for body and UI text. · `--font-pp-neue-montreal`
- **Substitute:** Neue Haas Grotesk Display, Inter (tight tracking), or Söhne
- **Weights:** 400, 500, 700
- **Sizes:** 13, 14, 16, 17, 18, 22, 23, 30, 40, 46, 50, 54, 110, 220
- **Line height:** 1.00–1.62
- **Letter spacing:** -0.0360em at display sizes (110–220px), -0.0320em at 30–54px headings, normal at body sizes
- **OpenType features:** `"ss01" on if available — geometric alternates reinforce the editorial precision`
- **Role:** Single typeface carrying the entire brand voice — body, headings, and oversized display (up to 220px). The aggressive negative tracking (-0.0360em at display, -0.0320em at subhead) is the signature: letters lock together tightly even at 110px+, making the type read as a solid mass rather than individual glyphs. Weight 700 reserved for the largest display moments, weight 500 for subheadings, weight 400 for body and UI text.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 13px | 1.5 | — | `--text-caption` |
| body-lg | 17px | 1.62 | — | `--text-body-lg` |
| subheading | 22px | 1.38 | — | `--text-subheading` |
| heading-sm | 30px | 1.27 | -0.96px | `--text-heading-sm` |
| heading | 46px | 1.27 | -1.47px | `--text-heading` |
| heading-lg | 54px | 1 | -1.73px | `--text-heading-lg` |
| display | 110px | 1 | -3.96px | `--text-display` |
| display-xl | 220px | 1 | -7.92px | `--text-display-xl` |

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
| 28 | 28px | `--spacing-28` |
| 32 | 32px | `--spacing-32` |
| 36 | 36px | `--spacing-36` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 56 | 56px | `--spacing-56` |
| 60 | 60px | `--spacing-60` |
| 80 | 80px | `--spacing-80` |
| 112 | 112px | `--spacing-112` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 9999px |
| cards | 0px (sharp corners define the editorial feel) |
| links | 8.64px |
| buttons | 9999px (full pill) |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80-120px
- **Card padding:** 20px
- **Element gap:** 20px

## Components

### Display Headline
**Role:** Hero and section-opening type

PP Neue Montreal at 110–220px, weight 400–500, lineHeight 1.0, letter-spacing -0.0360em. Color: #ffffff. Fills viewport width, often split across lines for editorial rhythm. No drop shadow, no gradient — the size IS the visual weight.

### Pill Button
**Role:** Primary navigation action

9999px border-radius, 6px 20px padding, 14px PP Neue Montreal weight 500, text color #ffffff, transparent or #030303 background. Underlined on hover. The pill shape is the only button form in the system.

### Active Nav Link
**Role:** Underlined current-page indicator

14px PP Neue Montreal weight 500, #ffffff text, 1px underline in #ffffff, 8.64px radius on the underline region. Non-active nav items omit the underline.

### Product Card (Light Variant)
**Role:** Product feature card on dark background

White (#ffffff) surface, 0px border-radius, 20px padding, thin #e5e7eb hairline border. Contains: uppercase label (13px, letter-spacing wide, #030303), circular geometric icon in #030303 line art, product name at 40–46px weight 400, short description at 16px weight 400.

### Product Card (Dark Variant)
**Role:** Product feature card when inverted is needed

#030303 background, #e5e7eb hairline border, 0px radius, 20px padding. Same internal hierarchy as light variant with inverted colors.

### Step Indicator Bar
**Role:** Progress or phase marker (ST/00, 01.DATA, 02.TRUST, 03.UNIQUENESS)

Vertical bar: 3–4px wide, 40–60px tall. Active steps use #73ffb9 fill; inactive steps use #e5e7eb or transparent. Label sits above at 13–14px uppercase. Green bars are the only color punctuation on the hero canvas.

### Logo Mark
**Role:** Brand identity in nav and footer

PP Neue Montreal weight 700 at 16–18px, #ffffff on dark, preceded by a 4-point star/sparkle glyph (✦) in #ffffff. The star is a brand signature — it appears after the wordmark and in the mark variants.

### Geometric Icon (Circle)
**Role:** Product card icon and decorative motif

Circular outline in #030303, 48–64px diameter, containing intersecting geometric line work (rings, arcs, crosshairs). Stroke weight 1–1.5px. No fill — pure line art.

### Marquee Band
**Role:** Repeating brand text scroller

Full-bleed band with #030303 or #000000 background, PP Neue Montreal at 200–400px weight 400, #ffffff text, infinite horizontal scroll. Acts as a visual divider between major sections.

### Inline Tag
**Role:** Category or protocol label

PP Neue Montreal 13px weight 500, uppercase, #e5e7eb text, no background. Used as 'TRAINING', 'PROTOCOL', 'TOOLKIT' in card headers. 7–8px gap to adjacent content.

### Arrow Link
**Role:** Text link with directional indicator (Discover ↓, Try Now ↗)

PP Neue Montreal 14–16px weight 500, #ffffff text, underline on text, arrow glyph in #73ffb9 (green) or #ffffff. The green arrow is a rare but consistent accent on these directional links.

### Hero Subheadline
**Role:** Supporting text under display headline

PP Neue Montreal 18–22px weight 400, line-height 1.38, #e5e7eb color, max-width 60–70ch. Separated from headline by 12–20px gap and a thin #e5e7eb horizontal rule.

## Do's and Don'ts

### Do
- Use PP Neue Montreal at 110–220px for hero and section-opening headlines with letter-spacing -0.0360em
- Set page background to #030303 and let white product cards flip the contrast — this contrast IS the system
- Reserve #73ffb9 for step indicator bars, arrow glyphs, and icon highlights — never as a full button background
- Use 9999px border-radius for all buttons and tags; use 0px (sharp) for all cards and content surfaces
- Separate sections with 80–120px vertical gaps and a 1px #e5e7eb hairline rule
- Keep body text at 16–17px weight 400 with line-height 1.5–1.62 for comfortable reading rhythm
- Use the repeating marquee band (brand wordmark at 200–400px) as the primary section divider

### Don't
- Don't add box-shadows or drop-shadows — the system is intentionally flat; elevation comes from tonal contrast only
- Don't use the green accent (#73ffb9) on large surfaces — it loses impact as a signal when used decoratively
- Don't use a filled chromatic CTA button — primary actions are text links with arrows, or ghost pill buttons
- Don't introduce additional chromatic colors — the 2% colorfulness budget is deliberate; adding more dilutes the signal
- Don't use border-radius between 1px and 8px on cards or surfaces — the system is binary: 0px sharp or 9999px pill
- Don't set body text below 14px — the comfortable density and large display sizes mean smaller text breaks the visual hierarchy
- Don't center-align body paragraphs — left-align with 60–70ch measure for readability under the oversized headlines

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Canvas | `#030303` | Full-page dark background |
| 2 | Product Card | `#ffffff` | Light surface for product cards that flip the dark theme |
| 3 | Overlay | `#000000` | Deepest layer behind marquee and embedded media bands |

## Elevation

No shadows. Elevation is communicated exclusively through tonal contrast between the deep canvas (#030303), pure white product cards, and the bright Frost text. The flatness is intentional — shadows would soften the sharp editorial precision that defines the system.

## Imagery

Minimal photography; the system relies on geometric line-art icons (circular crosshairs, arcs, concentric rings) and typographic hero treatments. One embedded product screenshot band appears (Redactor module) as a full-bleed dark rectangle. Product cards use monochrome line-drawn glyphs rather than illustrations or photos. The marquee wordmark acts as a graphic element. No lifestyle imagery, no stock photography — the brand communicates through type, geometric mark, and negative space.

## Layout

Full-bleed dark canvas with content centered in ~1200px max-width container. Hero is a near-viewport section with step indicator bars above a 110–220px display headline. Sections are separated by 80–120px vertical gaps, thin hairline rules, and full-bleed marquee bands. Product features appear as a 3-column card grid with light cards on the dark canvas — the inversion creates visual punctuation. Navigation is a minimal top bar with logo left, links right. The page scrolls vertically as a sequence of editorial spreads rather than a dashboard.

## Agent Prompt Guide

**Quick Color Reference**
- text: #ffffff
- background: #030303
- border: #e5e7eb
- accent: #73ffb9
- surface (card): #ffffff
- primary action: no distinct CTA color

**3-5 Example Component Prompts**

1. **Hero Section**: Background #030303. Step indicator bars (3px × 50px, #73ffb9) above labels. Display headline: 'The future of intelligence.' at 110px PP Neue Montreal weight 500, #ffffff, letter-spacing -3.96px, line-height 1.0. Subheadline at 22px weight 400, #e5e7eb, line-height 1.38. 1px #e5e7eb horizontal rule separating subhead from footer line.

2. **Product Card Grid (3 columns)**: Each card #ffffff background, 0px radius, 1px #e5e7eb border, 20px padding. Uppercase tag at 13px weight 500 #030303. Circular line-art icon (56px, #030303 stroke 1.5px) centered. Product name at 40px weight 400 #030303. Description at 16px weight 400 #030303, line-height 1.56.

3. **Pill Navigation Button**: 9999px border-radius, 6px 20px padding, 14px PP Neue Montreal weight 500, text #ffffff, background transparent. Underline appears on hover in #ffffff.

4. **Marquee Divider Band**: Full-bleed #030303, PP Neue Montreal at 220px weight 400, #ffffff text, infinite horizontal scroll. Wordmark repeated with ✦ glyph separator.

5. **Arrow Text Link**: PP Neue Montreal 14px weight 500, #ffffff text with underline. Arrow glyph (↗ or ↓) in #73ffb9 immediately following the text.

## Similar Brands

- **Linear** — Same dark-canvas editorial approach with oversized display type and single accent color; both use geometric line-art icons and minimal color palettes
- **Vercel** — Near-black backgrounds, massive display headlines with tight tracking, and a rationed accent color; both treat type as the primary visual element
- **Anthropic** — Dark-mode technical brand with clean PP-Neue-style grotesk typography, comfortable density, and product cards that flip between dark and light surfaces
- **Rauno Freiberg** — Same editorial dark-canvas aesthetic with 100–200px display type, hairline rules, and near-monochrome palette with a single warm accent

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-deep-obsidian: #030303;
  --color-pure-black: #000000;
  --color-frost: #ffffff;
  --color-silver-haze: #e5e7eb;
  --color-mint-signal: #73ffb9;

  /* Typography — Font Families */
  --font-pp-neue-montreal: 'PP Neue Montreal', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 13px;
  --leading-caption: 1.5;
  --text-body-lg: 17px;
  --leading-body-lg: 1.62;
  --text-subheading: 22px;
  --leading-subheading: 1.38;
  --text-heading-sm: 30px;
  --leading-heading-sm: 1.27;
  --tracking-heading-sm: -0.96px;
  --text-heading: 46px;
  --leading-heading: 1.27;
  --tracking-heading: -1.47px;
  --text-heading-lg: 54px;
  --leading-heading-lg: 1;
  --tracking-heading-lg: -1.73px;
  --text-display: 110px;
  --leading-display: 1;
  --tracking-display: -3.96px;
  --text-display-xl: 220px;
  --leading-display-xl: 1;
  --tracking-display-xl: -7.92px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-60: 60px;
  --spacing-80: 80px;
  --spacing-112: 112px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80-120px;
  --card-padding: 20px;
  --element-gap: 20px;

  /* Border Radius */
  --radius-lg: 8.64px;
  --radius-full: 9999px;

  /* Named Radii */
  --radius-tags: 9999px;
  --radius-cards: 0px (sharp corners define the editorial feel);
  --radius-links: 8.64px;
  --radius-buttons: 9999px (full pill);

  /* Surfaces */
  --surface-canvas: #030303;
  --surface-product-card: #ffffff;
  --surface-overlay: #000000;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-deep-obsidian: #030303;
  --color-pure-black: #000000;
  --color-frost: #ffffff;
  --color-silver-haze: #e5e7eb;
  --color-mint-signal: #73ffb9;

  /* Typography */
  --font-pp-neue-montreal: 'PP Neue Montreal', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 13px;
  --leading-caption: 1.5;
  --text-body-lg: 17px;
  --leading-body-lg: 1.62;
  --text-subheading: 22px;
  --leading-subheading: 1.38;
  --text-heading-sm: 30px;
  --leading-heading-sm: 1.27;
  --tracking-heading-sm: -0.96px;
  --text-heading: 46px;
  --leading-heading: 1.27;
  --tracking-heading: -1.47px;
  --text-heading-lg: 54px;
  --leading-heading-lg: 1;
  --tracking-heading-lg: -1.73px;
  --text-display: 110px;
  --leading-display: 1;
  --tracking-display: -3.96px;
  --text-display-xl: 220px;
  --leading-display-xl: 1;
  --tracking-display-xl: -7.92px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-60: 60px;
  --spacing-80: 80px;
  --spacing-112: 112px;

  /* Border Radius */
  --radius-lg: 8.64px;
  --radius-full: 9999px;
}
```
