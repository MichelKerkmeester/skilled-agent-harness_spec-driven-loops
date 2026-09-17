# Monarch — Style Reference
> warm linen notebook under morning light

**Theme:** light

Monarch Money uses a warm editorial-fintech language: soft cream canvas, white product surfaces, and a single vivid orange that acts as functional punctuation against an otherwise monochrome warm-gray system. Typography is the signature — a high-contrast pairing of a light-weight modern sans for UI with a distinctive editorial display face at large sizes, both carrying aggressive negative tracking that tightens the layout into a confident, magazine-like rhythm. The interface feels handcrafted rather than corporate: pill-shaped controls, hairline warm borders, whisper-light shadows, and generous breathing room that lets product screenshots carry the visual weight.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Ember Orange | `#ff692d` | `--color-ember-orange` | Primary action buttons, active nav indicators, key UI accents — the only chromatic color in the system, reserved so it reads as decisive when it appears |
| Linen | `#efecea` | `--color-linen` | Page canvas and section backgrounds — the warm cream that separates the site from sterile white SaaS |
| Ink | `#22201d` | `--color-ink` | Primary text, icon strokes, heading color, footer text — near-black with a warm brown undertone that harmonizes with the cream canvas |
| Graphite | `#777573` | `--color-graphite` | Muted body text, secondary helper text, captions — warm mid-gray that sits between Ink and Paper |
| Stone | `#dcd9d6` | `--color-stone` | Hairline borders, dividers, table separators, icon outlines — the warm neutral that stitches cards and sections together |
| Paper | `#ffffff` | `--color-paper` | Card surfaces, elevated product panels, input fields — pure white that floats above the Linen canvas |
| Smoke | `#cccccc` | `--color-smoke` | Light text on dark surfaces, inverse labels, and high-contrast captions. Do not promote it to the primary CTA color |

## Tokens — Typography

### ABC Oracle — All UI text — body, buttons, nav, links, cards, labels. The weight 350 default is unusually light; most fintech systems default to 400-500, but Monarch's lighter body weight lets the orange accent carry more visual weight. Letter-spacing sits at -0.010 to -0.012em across all sizes. · `--font-abc-oracle`
- **Substitute:** Inter or Söhne (use weight 350 if available, otherwise 400)
- **Weights:** 100, 350, 400, 500
- **Sizes:** 14px, 15px, 16px, 18px, 20px
- **Line height:** 1.30–1.56
- **Letter spacing:** -0.012em at 14px, -0.010em at 16px, normal at 20px+
- **Role:** All UI text — body, buttons, nav, links, cards, labels. The weight 350 default is unusually light; most fintech systems default to 400-500, but Monarch's lighter body weight lets the orange accent carry more visual weight. Letter-spacing sits at -0.010 to -0.012em across all sizes.

### Copernicus — All display and section headings. The signature choice: a single weight 350 used at every heading size, paired with aggressive negative tracking (-0.050em to -0.067em). The tight tracking compresses wide headings into compact, editorial blocks rather than airy marketing copy. At 48px the -0.067em tracking is extreme — it pulls letters almost touching, creating a dense, premium feel. · `--font-copernicus`
- **Substitute:** Fraunces or Source Serif 4 (set weight 350, apply matching negative tracking)
- **Weights:** 350
- **Sizes:** 32px, 40px, 48px
- **Line height:** 1.20
- **Letter spacing:** -0.050em at 32px, -0.060em at 40px, -0.067em at 48px
- **Role:** All display and section headings. The signature choice: a single weight 350 used at every heading size, paired with aggressive negative tracking (-0.050em to -0.067em). The tight tracking compresses wide headings into compact, editorial blocks rather than airy marketing copy. At 48px the -0.067em tracking is extreme — it pulls letters almost touching, creating a dense, premium feel.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 14px | 1.43 | -0.17px | `--text-caption` |
| body | 16px | 1.5 | -0.16px | `--text-body` |
| body-lg | 18px | 1.56 | -0.18px | `--text-body-lg` |
| subheading | 20px | 1.33 | -0.2px | `--text-subheading` |
| heading-sm | 32px | 1.2 | -1.6px | `--text-heading-sm` |
| heading | 40px | 1.2 | -2.4px | `--text-heading` |
| display | 48px | 1.2 | -3.22px | `--text-display` |

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
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 64 | 64px | `--spacing-64` |
| 72 | 72px | `--spacing-72` |
| 80 | 80px | `--spacing-80` |
| 96 | 96px | `--spacing-96` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 9999px |
| cards | 12px |
| pills | 9999px |
| inputs | 8px |
| buttons | 9999px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| subtle | `rgba(34, 32, 29, 0.05) 0px 1px 2px 0px` | `--shadow-subtle` |
| md | `rgba(34, 32, 29, 0.1) 0px 10px 15px -3px, rgba(34, 32, 29...` | `--shadow-md` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 64px
- **Card padding:** 24px
- **Element gap:** 16px

## Components

### Primary Pill Button
**Role:** Main call-to-action — 'Sign up', 'Unlock better money habits'

9999px border-radius, Ember Orange (#ff692d) fill, white text at 16px weight 500, 12px 24px padding, subtle 1px shadow at rgba(34,32,29,0.05).

### Ghost Pill Button
**Role:** Secondary action — 'Sign in' in header

9999px border-radius, transparent fill, Ink (#22201d) text at 16px weight 500, 12px 24px padding, no border.

### Outlined Pill Button
**Role:** Tertiary action — 'Learn more' links in feature blocks

9999px border-radius, transparent fill, Ember Orange (#ff692d) text, 1.5px Ember Orange border, 8px 20px padding.

### Feature Card
**Role:** Feature block with label, headline, body text, and CTA

12px border-radius, white or transparent fill on Linen canvas, no visible border, 24px internal padding, generous vertical breathing room between label (uppercase tracked ABC Oracle 14px Ember Orange) and heading (Copernicus 32px Ink).

### Product Screenshot Card
**Role:** Embedded app UI mockups in 'What is Monarch?' and feature sections

12px border-radius, white (#ffffff) fill, 1px Stone (#dcd9d6) border, soft two-layer shadow at rgba(34,32,29,0.1) 0px 10px 15px -3px / 0px 4px 6px -4px.

### Top Navigation Bar
**Role:** Sticky header with logo, nav links, and auth actions

White background, 64px height, Monarch wordmark with orange butterfly icon left-aligned, nav links (Features, For Couples, For Professionals, Pricing, Download) center/left at 16px weight 400 Ink, ghost 'Sign in' and filled orange 'Sign up' buttons right-aligned.

### Hero Overlay Card
**Role:** Headline + subtext + CTA floating over lifestyle photography

Semi-transparent white (#ffffff at ~85%) background, 12px radius, 24-32px padding, 16px backdrop blur, Copernicus 48px heading, ABC Oracle 18px body in Graphite, Ember Orange pill CTA below.

### Stat Badge Overlay
**Role:** Floating data cards over hero image (net worth, account list)

Frosted glass effect — white at 75% opacity, 12px radius, 16px padding, Stone border, small monospace-style numerics in Ink.

### Press / Award Badge Row
**Role:** Social proof strip below hero

Single horizontal row on Linen canvas, 4-5 award logos (WSJ, Forbes, CNBC) separated by 5-star rating and descriptive caption, centered, 48px vertical padding.

### Promo Banner
**Role:** Top-of-page announcement bar

Ember Orange (#ff692d) background, white centered text at 14px weight 400, 8px vertical padding, spans full viewport width.

### Section Header
**Role:** Centered eyebrow + heading + subtext block

Uppercase tracked eyebrow in Ember Orange at 14px weight 500, Copernicus heading below at 40-48px Ink, ABC Oracle 18px Graphite subtext, all centered, 64px vertical gap to content below.

## Do's and Don'ts

### Do
- Use Ember Orange (#ff692d) exclusively for filled buttons, active states, and eyebrow labels — never as a text color for body copy or as a background wash
- Set all buttons to 9999px border-radius — the pill shape is the system's most recognizable element
- Apply Copernicus at weight 350 for all headings with the matching negative tracking per size (-3.22px at 48px, -2.40px at 40px, -1.60px at 32px)
- Use Linen (#efecea) as the page background and white (#ffffff) as card surfaces — never invert this stack
- Use Stone (#dcd9d6) for all hairline borders and dividers at 1px — the warm gray harmonizes with the cream canvas
- Set body text to ABC Oracle weight 350-400 with -0.010em tracking — lighter weight lets the orange accent dominate
- Embed product UI as 12px-radius cards with 1px Stone border and the two-layer shadow — these screenshots are the primary visual proof

### Don't
- Don't introduce additional accent colors — the monochrome warm-neutral + single orange is the entire system
- Don't use square or 4px-radius buttons — the pill (9999px) is non-negotiable
- Don't set headings in ABC Oracle or body text in Copernicus — the font split is strict by role
- Don't use pure black (#000000) or pure white (#ffffff) as backgrounds — the warm shift in Ink and Linen is what makes the system feel editorial rather than corporate
- Don't apply heavy shadows to cards or buttons — the system relies on hairline shadows at 5% opacity, not dramatic elevation
- Don't use uppercase or letter-spaced text for body content — tracked caps are reserved for eyebrow labels only
- Don't use the orange gradient (red→orange) on UI elements — it's a promotional accent only, not a surface treatment

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Linen Canvas | `#efecea` | Full page background, section bands, hero backdrop behind photography |
| 1 | Paper Card | `#ffffff` | Product UI screenshots, feature cards, elevated content blocks sitting on the canvas |
| 2 | Ember Accent | `#ff692d` | Pill button fills, notification badges, active state highlights |

## Elevation

- **Primary Pill Button:** `rgba(34, 32, 29, 0.05) 0px 1px 2px 0px`
- **Product Screenshot Card:** `rgba(34, 32, 29, 0.1) 0px 10px 15px -3px, rgba(34, 32, 29, 0.1) 0px 4px 6px -4px`

## Imagery

Lifestyle photography dominates: warm, golden-hour couple-on-couch scenes with natural light, slightly desaturated to let the orange UI accents pop. Product UI is shown as embedded screenshots (dashboard, reports, transaction lists) at full fidelity — these carry the most visual weight after the hero photo. Icons are minimal: small orange butterfly brand mark, thin-line icons in Ink for UI controls, and award logos in grayscale. No illustration style is used — the system is photographic and product-screenshot driven. Imagery is always contained with 12px corners, never full-bleed except in the hero.

## Layout

Max-width 1200px centered container with 24px side padding. Hero is full-bleed: lifestyle photo fills the viewport, headline card overlays bottom-left, floating data cards overlay right side. Below hero, content flows in 64px vertical sections on Linen canvas, alternating between white product screenshot cards and text-forward feature blocks. Feature sections use a 3-column or 2-column grid: text-left, screenshot-right, with generous 64px gaps between sections. Press badges sit in a single full-width horizontal strip. Navigation is a sticky white top bar with centered logo-left, links-center, actions-right.

## Agent Prompt Guide

**Quick Color Reference**
- background: #efecea (Linen canvas)
- surface: #ffffff (Paper cards)
- text: #22201d (Ink)
- muted text: #777573 (Graphite)
- border: #dcd9d6 (Stone)
- primary action: #ff692d (filled action)

**Example Component Prompts**

1. **Hero Section**: Full-bleed warm lifestyle photo background. Bottom-left overlay card: white at 85% opacity, 12px radius, 24px padding. Headline at 48px Copernicus weight 350, #22201d, letter-spacing -3.22px. Body at 18px ABC Oracle weight 350, #777573. Ember Orange pill CTA: #ff692d fill, white text, 9999px radius, 12px 24px padding, subtle shadow.

2. **Feature Block**: Linen (#efecea) background. 2-column grid, 64px row gap. Left column: uppercase eyebrow at 14px ABC Oracle weight 500, #ff692d, letter-spacing 0.05em. Heading at 32px Copernicus weight 350, #22201d, letter-spacing -1.60px. Body at 16px ABC Oracle weight 350, #777573. Outlined pill button: 9999px radius, #ff692d border 1.5px, #ff692d text, 8px 20px padding. Right column: white product screenshot card, 12px radius, 1px #dcd9d6 border, soft shadow.

3. **Navigation Bar**: Sticky white bar, 64px height. Left: Monarch wordmark with small orange butterfly icon. Center: nav links at 16px ABC Oracle weight 400, #22201d. Right: ghost 'Sign in' (transparent, #22201d text) and filled 'Sign up' (Ember Orange #ff692d, white text), both 9999px radius, 12px 24px padding.

4. **Promo Banner**: Full-width #ff692d background, 8px vertical padding. Centered white text at 14px ABC Oracle weight 400. Spans viewport edge to edge.

5. **Stat Badge Overlay**: Floating card over hero image. White at 75% opacity, 12px radius, 16px padding, 1px #dcd9d6 border, subtle backdrop blur. Small uppercase label at 12px ABC Oracle, #777573. Large number at 24px ABC Oracle weight 350, #22201d.

## Signature Typography Pairing

The Copernicus + ABC Oracle pairing is the system's most distinctive choice. Copernicus is an editorial display face used at a single weight (350) across all heading sizes — no bold, no light variation. This is unconventional: most sites use weight contrast within a single family to create hierarchy. Monarch instead creates hierarchy through size + tracking alone, with the tracking tightening aggressively as size grows (-1.60px at 32px → -3.22px at 48px). The result is headings that feel sculpted rather than typed. ABC Oracle handles all UI at weight 350-500 with very light tracking (-0.010em), giving body text a refined, almost printed quality that matches the editorial heading face.

## Gradient System

A single gradient is used in the system: linear-gradient(to right, #e5484d, #ff692d). It appears only in promotional or celebratory contexts (referral banners, special offers). Never apply it to buttons, cards, or backgrounds — it is an accent treatment, not a surface treatment.

## Similar Brands

- **Copernicus (font foundries showcasing Copernicus)** — Editorial display typography with single-weight headings and tight tracking — same sculptural heading approach
- **Pinterest** — Warm lifestyle photography hero with floating data cards and a single accent color against cream/warm-neutral canvas
- **Acorns** — Personal finance with warm color temperature and lifestyle-forward photography rather than cold blue data dashboards
- **Notion** — Light, spacious layout with generous vertical breathing room, hairline borders, and pill-shaped controls

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-ember-orange: #ff692d;
  --color-linen: #efecea;
  --color-ink: #22201d;
  --color-graphite: #777573;
  --color-stone: #dcd9d6;
  --color-paper: #ffffff;
  --color-smoke: #cccccc;

  /* Typography — Font Families */
  --font-abc-oracle: 'ABC Oracle', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-copernicus: 'Copernicus', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.43;
  --tracking-caption: -0.17px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.16px;
  --text-body-lg: 18px;
  --leading-body-lg: 1.56;
  --tracking-body-lg: -0.18px;
  --text-subheading: 20px;
  --leading-subheading: 1.33;
  --tracking-subheading: -0.2px;
  --text-heading-sm: 32px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -1.6px;
  --text-heading: 40px;
  --leading-heading: 1.2;
  --tracking-heading: -2.4px;
  --text-display: 48px;
  --leading-display: 1.2;
  --tracking-display: -3.22px;

  /* Typography — Weights */
  --font-weight-thin: 100;
  --font-weight-w350: 350;
  --font-weight-regular: 400;
  --font-weight-medium: 500;

  /* Spacing */
  --spacing-unit: 8px;
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-72: 72px;
  --spacing-80: 80px;
  --spacing-96: 96px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 64px;
  --card-padding: 24px;
  --element-gap: 16px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-full: 9999px;

  /* Named Radii */
  --radius-tags: 9999px;
  --radius-cards: 12px;
  --radius-pills: 9999px;
  --radius-inputs: 8px;
  --radius-buttons: 9999px;

  /* Shadows */
  --shadow-subtle: rgba(34, 32, 29, 0.05) 0px 1px 2px 0px;
  --shadow-md: rgba(34, 32, 29, 0.1) 0px 10px 15px -3px, rgba(34, 32, 29, 0.1) 0px 4px 6px -4px;

  /* Surfaces */
  --surface-linen-canvas: #efecea;
  --surface-paper-card: #ffffff;
  --surface-ember-accent: #ff692d;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-ember-orange: #ff692d;
  --color-linen: #efecea;
  --color-ink: #22201d;
  --color-graphite: #777573;
  --color-stone: #dcd9d6;
  --color-paper: #ffffff;
  --color-smoke: #cccccc;

  /* Typography */
  --font-abc-oracle: 'ABC Oracle', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-copernicus: 'Copernicus', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.43;
  --tracking-caption: -0.17px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.16px;
  --text-body-lg: 18px;
  --leading-body-lg: 1.56;
  --tracking-body-lg: -0.18px;
  --text-subheading: 20px;
  --leading-subheading: 1.33;
  --tracking-subheading: -0.2px;
  --text-heading-sm: 32px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -1.6px;
  --text-heading: 40px;
  --leading-heading: 1.2;
  --tracking-heading: -2.4px;
  --text-display: 48px;
  --leading-display: 1.2;
  --tracking-display: -3.22px;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-72: 72px;
  --spacing-80: 80px;
  --spacing-96: 96px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-subtle: rgba(34, 32, 29, 0.05) 0px 1px 2px 0px;
  --shadow-md: rgba(34, 32, 29, 0.1) 0px 10px 15px -3px, rgba(34, 32, 29, 0.1) 0px 4px 6px -4px;
}
```
