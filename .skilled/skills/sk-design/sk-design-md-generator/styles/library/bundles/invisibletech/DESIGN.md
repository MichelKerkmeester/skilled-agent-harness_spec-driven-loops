# Invisibletech — Style Reference
> Editorial sketchbook on graph paper

**Theme:** light

Invisible Tech reads as an editorial sketchbook laid over graph paper: a near-pure white canvas dotted with a faint grid, scattered with loose hand-drawn vignettes (basketball players, overhead cars, a globe), and anchored by a tight two-column content rhythm. The typographic system is a deliberate duet between two custom faces — Apk Galeria carries everything human (body, headlines, quotes) with a serif-influenced rhythm and progressively tighter tracking as type scales up, while Apkpraktikal handles everything categorical as wide-tracked small caps (section eyebrows, navigation labels, tab names). The color system is almost entirely achromatic — black, graphite, and a stack of grays do 98% of the work — with exactly two chromatic accents that carry meaning: a vivid cobalt blue for wayfinding dots and a lime-chartreuse green reserved exclusively for the primary conversion action. Components are pill-shaped, borders are 1px hairlines, and the page never raises its voice with shadows or gradients — it whispers, then lets the two-tone headline (one phrase in near-black, the following phrase in mid-gray) do the dramatic work.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Carbon Ink | `#0f0f0f` | `--color-carbon-ink` | Primary text, hero CTA button fill, logo mark — the dominant non-white color carrying 1000+ borders and all body copy |
| Graphite | `#222222` | `--color-graphite` | Secondary surface fill, dark card backgrounds, button borders — one step lighter than Carbon for layered elements |
| Iron | `#4c4c4c` | `--color-iron` | Body text, input borders, button borders, card borders — the working neutral for readable secondary copy |
| Steel | `#606060` | `--color-steel` | Muted headings, subhead text, supporting borders |
| Slate | `#898989` | `--color-slate` | Subtle heading text, dividers, light borders |
| Fog | `#9d9d9d` | `--color-fog` | Image borders, icon borders, tertiary text |
| Silver | `#b2b2b2` | `--color-silver` | Link borders, decorative dividers, lightest structural lines |
| Pewter | `#c6c6c6` | `--color-pewter` | Hairline borders, disabled states |
| Ash | `#dbdbdb` | `--color-ash` | Subtle borders, card outlines |
| Mist | `#efefef` | `--color-mist` | Soft surface fills, secondary button backgrounds, subtle wash backgrounds |
| Canvas White | `#ffffff` | `--color-canvas-white` | Page background, card surface, button text on dark fills |
| Ice Blue | `#e6f1ff` | `--color-ice-blue` | Feature card surfaces, soft highlight panels — the only tinted neutral, used to frame product previews and walkthrough banners |
| Cobalt Spark | `#0c76fe` | `--color-cobalt-spark` | Wayfinding dots beside section eyebrows, icon accents, link color — the navigation accent, never used as a fill |
| Lime Glow | `#dcf58f` | `--color-lime-glow` | Green action color for filled buttons, selected navigation states, and focused conversion moments. |

## Tokens — Typography

### Apk Galeria — Primary display and body typeface. Carries headlines, body copy, buttons, and quotes with a serif-influenced rhythm. Custom font with no direct open substitute; the signature is its slightly elongated proportions and progressively tighter negative tracking as size scales up (-0.030em at 64px down to -0.009em at 18px). The two-tone headline pattern (one phrase in #0f0f0f, the next phrase in #898989 or #4c4c4c) creates a call-and-response rhythm that defines the brand voice. · `--font-apk-galeria`
- **Substitute:** GT Sectra, Tiempos Text, or Newsreader as close editorial alternatives; otherwise system serif
- **Weights:** 400, 500
- **Sizes:** 12, 14, 16, 18, 20, 22, 24, 28, 36, 48, 52, 64
- **Line height:** 1.00–1.50
- **Letter spacing:** -0.030em at 64px, -0.024em at 52px, -0.018em at 48px, -0.014em at 36px, -0.011em at 28px, -0.010em at 24px, -0.009em at 18–22px, normal at 12–16px
- **OpenType features:** `"liga" on, "kern" on`
- **Role:** Primary display and body typeface. Carries headlines, body copy, buttons, and quotes with a serif-influenced rhythm. Custom font with no direct open substitute; the signature is its slightly elongated proportions and progressively tighter negative tracking as size scales up (-0.030em at 64px down to -0.009em at 18px). The two-tone headline pattern (one phrase in #0f0f0f, the next phrase in #898989 or #4c4c4c) creates a call-and-response rhythm that defines the brand voice.

### Apkpraktikal — Categorical label typeface. Used exclusively for section eyebrows (OUR PLATFORM, FEATURED SOLUTIONS), navigation items, tab labels, and badge text. The wide tracking (0.12–0.14em at 14–16px) transforms short labels into uppercase spatial signatures that read more like architectural annotations than headlines. Weight 700 for emphasized CTAs in small caps form. · `--font-apkpraktikal`
- **Substitute:** JetBrains Mono, IBM Plex Mono, or Space Mono
- **Weights:** 400, 700
- **Sizes:** 12, 13, 14, 16, 20
- **Line height:** 1.00–1.40
- **Letter spacing:** 0.14em at 16px, 0.12em at 14px, 0.05em at 13px, 0.04em at 12px
- **OpenType features:** `"tnum" on`
- **Role:** Categorical label typeface. Used exclusively for section eyebrows (OUR PLATFORM, FEATURED SOLUTIONS), navigation items, tab labels, and badge text. The wide tracking (0.12–0.14em at 14–16px) transforms short labels into uppercase spatial signatures that read more like architectural annotations than headlines. Weight 700 for emphasized CTAs in small caps form.

### Karla — Karla — detected in extracted data but not described by AI · `--font-karla`
- **Weights:** 400
- **Sizes:** 16px
- **Line height:** 1.4
- **Role:** Karla — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.4 | 0.48px | `--text-caption` |
| body-sm | 14px | 1.43 | — | `--text-body-sm` |
| body | 16px | 1.5 | — | `--text-body` |
| subheading | 18px | 1.4 | -0.16px | `--text-subheading` |
| heading-sm | 24px | 1.2 | -0.24px | `--text-heading-sm` |
| heading | 36px | 1.2 | -0.5px | `--text-heading` |
| heading-lg | 48px | 1.1 | -0.86px | `--text-heading-lg` |
| display | 64px | 1 | -1.92px | `--text-display` |

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
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 64 | 64px | `--spacing-64` |
| 72 | 72px | `--spacing-72` |
| 80 | 80px | `--spacing-80` |
| 120 | 120px | `--spacing-120` |
| 160 | 160px | `--spacing-160` |
| 240 | 240px | `--spacing-240` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 9999px |
| cards | 12px |
| pills | 9999px |
| badges | 9999px |
| buttons | 9999px |

### Layout

- **Page max-width:** 1280px
- **Section gap:** 80px
- **Card padding:** 24px
- **Element gap:** 24px

## Components

### Primary Lime CTA
**Role:** The single high-intent conversion action on any page

Filled pill button, 9999px radius, #dcf58f background, #0f0f0f text. Uses Apkpraktikal at 13px weight 700 with 0.05em tracking, uppercase. Padding 10px 20px. No border. This is the only lime element on the page and should appear at most once per viewport.

### Secondary Black CTA
**Role:** Hero call-to-action, navigation confirmations

Filled pill button, 9999px radius, #0f0f0f background, #ffffff text. Apkpraktikal 13px weight 700, uppercase, 0.05em tracking. Padding 10px 20px. No border. Used when a stronger visual weight is needed than the lime CTA, typically as the primary in-page action.

### Ghost Text Link
**Role:** Inline navigation, section links, card CTAs

No background, no border. Text in #0c76fe (links) or #0f0f0f (section actions), Apk Galeria 14–16px weight 400. Often paired with a small ↗ or → glyph in #0c76fe. The right-arrow or up-right-arrow is a signature element.

### Eyebrow Label
**Role:** Section category indicator above every major heading

A 6px colored dot (#0c76fe or matching accent) followed by Apkpraktikal 12–13px weight 400 in uppercase with 0.12–0.14em tracking, color #0f0f0f. Always sits above a left-aligned section heading with ~16px gap below. The dot color encodes section category.

### Two-Tone Headline
**Role:** Primary page or section heading

Apk Galeria 36–64px weight 500, line-height 1.0–1.2, tracking -0.5 to -1.9px. The signature: one phrase in #0f0f0f, the following phrase in a lighter weight or lighter gray (#898989 or #4c4c4c), creating a call-and-response rhythm. No drop cap, no underline, no decoration — the tonal shift IS the emphasis.

### Ice Blue Feature Panel
**Role:** Product preview, walkthrough banner, soft container

Full-bleed or contained card with #e6f1ff background, 12px border-radius, 24px padding. Contains a heading in Apk Galeria 18–22px #0f0f0f and an inline text link in #0c76fe. No border, no shadow — color alone defines the surface lift.

### Product Card
**Role:** Feature or platform component showcase

White or #e6f1ff card with 12px radius, 1px #dbdbdb border, 24px padding. Title in Apk Galeria 20–24px weight 500, body in 14–16px #4c4c4c. Includes a mock window or interface preview rendered as a nested card with a 3-dot traffic light header.

### Side Navigation Item
**Role:** Category selector in platform/feature sections

Horizontal row: 20px line-icon (outlined, 1.5px stroke) + Apkpraktikal 14px uppercase label in #0f0f0f or #b2b2b2 (inactive state). Active state darkens text to #0f0f0f and adds a → arrow on the right. 16px vertical padding between items.

### Pill Badge
**Role:** Tag, status indicator, meta-label

9999px radius, 4–8px vertical padding, 12–16px horizontal padding. Background #efefef or #ffffff with 1px #dbdbdb border. Text in Apkpraktikal 12px uppercase, 0.12em tracking, #0f0f0f.

### Top Navigation Bar
**Role:** Primary site navigation

Sticky white bar, ~64px tall, full-width. Left: logo mark (12px square + wordmark in Apk Galeria 18px). Center: 5–6 text links in Apk Galeria 14px #0f0f0f, each with a small ↗ icon. Right: 'Meridal Expert Marketplace' text link + Lime Glow CTA button.

### Client Logo Strip
**Role:** Social proof footer band

Horizontal row of grayscale partner/client logos on white background, 40–60px tall, evenly spaced with ~80px gaps. Logos rendered in #0f0f0f or #4c4c4c only — no color.

### Mock Window Frame
**Role:** Product UI screenshot container

Card-within-a-card: outer #ffffff card with 12px radius and 1px #dbdbdb border, 24px padding. Inner mock window has its own 8px radius, 1px #e0e0e0 border, and a header strip with three small circles (traffic lights) in #dbdbdb.

## Do's and Don'ts

### Do
- Use Apk Galeria for everything human — body, headlines, quotes, button labels when not using the categorical face
- Use Apkpraktikal in uppercase with 0.12–0.14em tracking for all section eyebrows, tab labels, and categorical metadata
- Apply negative letter-spacing to Apk Galeria at every size above 18px, scaling from -0.009em at 22px to -0.030em at 64px
- Reserve #dcf58f exclusively for the single primary CTA per viewport — never as a background, icon, or decoration
- Use the two-tone headline pattern: one phrase in #0f0f0f, the following phrase in #898989 or #4c4c4c at the same weight and size
- Place a 6px #0c76fe dot before every section eyebrow label
- Use 9999px radius for all buttons, badges, and navigation pills; 12px radius for all cards and panels

### Don't
- Don't introduce box-shadows or drop-shadows — the design system uses color contrast and 1px borders for all elevation, not depth effects
- Don't use #dcf58f as a decorative element, card background, or hover state — it signals conversion only
- Don't apply Apkpraktikal to body copy or headlines longer than four words — the wide tracking breaks readability at length
- Don't use #0c76fe as a button fill or large surface — it is a wayfinding accent (dots, icons, link text) only
- Don't add gradients — the brand is committed to flat, matte surfaces with no color transitions
- Don't use fully black #000000 — always use #0f0f0f for the deepest tone to maintain the slightly soft contrast profile
- Don't combine the lime CTA and black CTA in the same row — pick one per action group, never both

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#ffffff` | Page background, hero canvas with dot grid overlay |
| 1 | Soft Card | `#efefef` | Secondary buttons, subtle surface lifts |
| 2 | Tinted Card | `#e6f1ff` | Feature panels, product preview cards, walkthrough banners |
| 3 | Dark Surface | `#222222` | Dark mode sections or inverted cards |
| 4 | Accent Fill | `#dcf58f` | Primary CTA pill button only |

## Elevation

The design system intentionally avoids box-shadows and drop-shadows entirely. All visual hierarchy is achieved through three mechanisms: (1) tonal contrast between #ffffff canvas and #e6f1ff or #efefef surfaces, (2) 1px hairline borders in #dbdbdb or #b2b2b2, and (3) typographic weight and color shifts in headings. Components feel like they are printed on the same sheet of paper, not floating above it.

## Imagery

The site blends three imagery modes: (1) hand-drawn editorial illustrations — loose, almost childlike line drawings of people, basketball hoops, overhead cars, a globe, a US map, and a suitcase — scattered asymmetrically around the hero like pinned-up concept sketches, rendered in a limited palette of #0c76fe blue, #dcf58f green, and warm peach/skin tones with a single ink-color outline; (2) product UI mockups — nested card frames with traffic-light headers, rendered as flat screenshots embedded in content sections; (3) partner/client logo strips — grayscale, evenly spaced, no color or styling. The illustrations never use realistic photography; the product shots never use 3D perspective. Everything is flat, drawn, or printed.

## Layout

Page model is a centered max-width container (1280px) with generous side padding, sitting on a pure white canvas. The hero breaks the container slightly — decorative illustrations float outside the max-width into the page margins, anchored by a subtle full-bleed dot grid background. Content sections follow a consistent rhythm: eyebrow dot + uppercase label, large left-aligned heading, then a two-column arrangement (heading/intro on left at ~40% width, supporting body on right at ~50%) with ~80–120px vertical gaps between sections. The platform section introduces a 2-column split with a left sidebar (icon + uppercase label list) and a right feature panel. Card grids appear in 2-column layouts rather than 3- or 4-column; the brand favors fewer, larger modules over dense matrices. Navigation is a single top bar, sticky, with no sidebar or mega-menu.

## Agent Prompt Guide

**Quick Color Reference**
- text: #0f0f0f (primary), #4c4c4c (body), #898989 (muted)
- background: #ffffff (canvas), #e6f1ff (feature card), #efefef (soft surface)
- border: #dbdbdb (default), #b2b2b2 (decorative)
- accent: #0c76fe (wayfinding dots, links, icons)
- primary action: #dcf58f (filled action)

**3-5 Example Component Prompts**

1. *Hero headline*: Apk Galeria 64px weight 500, #0f0f0f for the first phrase, #898989 for the second phrase at the same weight, line-height 1.0, letter-spacing -1.92px. Max-width 900px, left-aligned on white canvas with a faint dot-grid background.

2. *Section eyebrow + heading*: 6px #0c76fe dot, then Apkpraktikal 13px weight 400 uppercase with 0.12em tracking in #0f0f0f. Below at 16px gap: Apk Galeria 48px weight 500, #0f0f0f, letter-spacing -0.86px, line-height 1.1. Left-aligned, max-width 800px.

3. *Primary lime CTA button*: 9999px radius pill, #dcf58f background, Apkpraktikal 13px weight 700 uppercase with 0.05em tracking in #0f0f0f. Padding 10px 20px. No border, no shadow. Place once per viewport at the highest-intent action.

4. *Ice blue feature panel*: #e6f1ff background, 12px radius, 24px padding. Heading in Apk Galeria 22px weight 500 #0f0f0f, inline link in Apk Galeria 14px #0c76fe with a ↗ arrow. No border, no shadow.

5. *Side navigation item*: 20px outlined line-icon (1.5px stroke, #0f0f0f) + Apkpraktikal 14px uppercase label with 0.12em tracking in #0f0f0f. Active state adds a → arrow on the right at 16px gap. 16px vertical padding between items.

## Typographic Duet

The two-font pairing is the brand's most distinctive choice and must be preserved: Apk Galeria for the human voice (narrative, body, headlines, quotes) and Apkpraktikal for the system voice (labels, categories, navigation, metadata). Never use Apkpraktikal for sentences longer than four words — the wide 0.12–0.14em tracking destroys readability at length. Never set Apk Galeria in uppercase; the letterforms are designed for mixed case and lose their character when cased.

## Similar Brands

- **Linear** — Same near-monochrome palette with a single vivid accent color and tight typographic system, though Linear skews darker
- **Stripe** — Same pattern of two-tone headlines (one phrase dark, one phrase muted gray) and editorial spacing rhythm on a white canvas
- **Arc Browser** — Same use of a single saturated accent color (Arc uses blue) against a near-white canvas with custom display type
- **Pitch** — Same pill-shaped buttons, generous white space, and the same instinct to use one small saturated color as punctuation rather than a dominant brand color

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-carbon-ink: #0f0f0f;
  --color-graphite: #222222;
  --color-iron: #4c4c4c;
  --color-steel: #606060;
  --color-slate: #898989;
  --color-fog: #9d9d9d;
  --color-silver: #b2b2b2;
  --color-pewter: #c6c6c6;
  --color-ash: #dbdbdb;
  --color-mist: #efefef;
  --color-canvas-white: #ffffff;
  --color-ice-blue: #e6f1ff;
  --color-cobalt-spark: #0c76fe;
  --color-lime-glow: #dcf58f;

  /* Typography — Font Families */
  --font-apk-galeria: 'Apk Galeria', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-apkpraktikal: 'Apkpraktikal', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-karla: 'Karla', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.4;
  --tracking-caption: 0.48px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.43;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 18px;
  --leading-subheading: 1.4;
  --tracking-subheading: -0.16px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -0.24px;
  --text-heading: 36px;
  --leading-heading: 1.2;
  --tracking-heading: -0.5px;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.1;
  --tracking-heading-lg: -0.86px;
  --text-display: 64px;
  --leading-display: 1;
  --tracking-display: -1.92px;

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
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-72: 72px;
  --spacing-80: 80px;
  --spacing-120: 120px;
  --spacing-160: 160px;
  --spacing-240: 240px;

  /* Layout */
  --page-max-width: 1280px;
  --section-gap: 80px;
  --card-padding: 24px;
  --element-gap: 24px;

  /* Border Radius */
  --radius-full: 50px;
  --radius-full-2: 9999px;

  /* Named Radii */
  --radius-nav: 9999px;
  --radius-cards: 12px;
  --radius-pills: 9999px;
  --radius-badges: 9999px;
  --radius-buttons: 9999px;

  /* Surfaces */
  --surface-canvas: #ffffff;
  --surface-soft-card: #efefef;
  --surface-tinted-card: #e6f1ff;
  --surface-dark-surface: #222222;
  --surface-accent-fill: #dcf58f;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-carbon-ink: #0f0f0f;
  --color-graphite: #222222;
  --color-iron: #4c4c4c;
  --color-steel: #606060;
  --color-slate: #898989;
  --color-fog: #9d9d9d;
  --color-silver: #b2b2b2;
  --color-pewter: #c6c6c6;
  --color-ash: #dbdbdb;
  --color-mist: #efefef;
  --color-canvas-white: #ffffff;
  --color-ice-blue: #e6f1ff;
  --color-cobalt-spark: #0c76fe;
  --color-lime-glow: #dcf58f;

  /* Typography */
  --font-apk-galeria: 'Apk Galeria', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-apkpraktikal: 'Apkpraktikal', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-karla: 'Karla', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.4;
  --tracking-caption: 0.48px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.43;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 18px;
  --leading-subheading: 1.4;
  --tracking-subheading: -0.16px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -0.24px;
  --text-heading: 36px;
  --leading-heading: 1.2;
  --tracking-heading: -0.5px;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.1;
  --tracking-heading-lg: -0.86px;
  --text-display: 64px;
  --leading-display: 1;
  --tracking-display: -1.92px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-72: 72px;
  --spacing-80: 80px;
  --spacing-120: 120px;
  --spacing-160: 160px;
  --spacing-240: 240px;

  /* Border Radius */
  --radius-full: 50px;
  --radius-full-2: 9999px;
}
```
