# Hyper Foundation — Style Reference
> Living emerald sanctuary — a deep forest vault where a single luminous mint glow breathes through organic, shadowed forms.

**Theme:** dark

Hyperliquid reads as a dark editorial cryptofinance environment: a deep forest-green canvas breathing with organic, softly glowing teal shapes that create depth without literal imagery. A single luminous mint accent provides all action, iconography, and typographic emphasis against the dark surface, producing a near-monochromatic palette where brightness is rationed as punctuation. Display headlines use a custom serif (Teodor) at 90px with tight 0.75 leading — an editorial, magazine-like gesture that contrasts with the lightweight Inter body text, which keeps a quiet conversational register. Pill-shaped controls at 60px radius are the primary interaction language, paired with generous negative space and a single signature mint-glow shadow that makes elevated surfaces feel like light sources rather than floating panels.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Forest Depths | `#072724` | `--color-forest-depths` | Page canvas, hero background, deep surface layer — the dominant dark field that everything else floats on |
| Midnight Tide | `#0f3933` | `--color-midnight-tide` | Primary text on canvas, strong borders, secondary surface tint — readable white-space-equivalent for dark mode |
| Shadow Teal | `#23524c` | `--color-shadow-teal` | Elevated surface, card fills, subtle borders — one step lighter than the canvas for layer separation |
| Charcoal Hairline | `#2c2e33` | `--color-charcoal-hairline` | Subtle dividers and default 1px borders across cards, images, and icons — almost invisible on the dark canvas, used for structural quietness |
| Abyss Green | `#122d28` | `--color-abyss-green` | Decorative background blob — deepest atmospheric tint behind organic hero shapes |
| Deep Lagoon | `#1c3f38` | `--color-deep-lagoon` | Decorative mid-tone blob in the hero atmosphere, sits between canvas and surface |
| Mist Gray | `#b0c5c1` | `--color-mist-gray` | Muted body text, secondary descriptions, captions — desaturated enough to recede behind the mint accent |
| Pure Light | `#ffffff` | `--color-pure-light` | Headline text on dark canvas, high-contrast text inside mint-filled buttons |
| Mint Glow | `#97fcd7` | `--color-mint-glow` | Green text accent for links, tags, and emphasized short phrases. Do not promote it to the primary CTA color |
| Teal Pulse | `#33998c` | `--color-teal-pulse` | Mid-saturation teal for SVG strokes, secondary decorative accents, hover/transition states between dark surface and mint highlight |

## Tokens — Typography

### Teodor — Display and editorial headlines, brand statements, section titles. Custom serif with sharp contrast between thick and thin strokes; at 90px with 0.75 leading it creates a magazine-cover authority that is the signature typographic gesture of the site. Subheading scale at 24px carries the same character into smaller contexts. · `--font-teodor`
- **Substitute:** GT Sectra, Tiempos Headline, Recoleta, Playfair Display
- **Weights:** 400
- **Sizes:** 24px, 55px, 60px, 90px
- **Line height:** 0.75 at 90px, 1.00 at 55-60px, 1.50 at 24px
- **Letter spacing:** normal
- **OpenType features:** `"kern"`
- **Role:** Display and editorial headlines, brand statements, section titles. Custom serif with sharp contrast between thick and thin strokes; at 90px with 0.75 leading it creates a magazine-cover authority that is the signature typographic gesture of the site. Subheading scale at 24px carries the same character into smaller contexts.

### Inter — Body copy, UI labels, navigation, buttons, captions. The weight 300 default across most sizes keeps the interface quiet against the display serif — the contrast between Teodor's editorial presence and Inter's whisper-light functional text is a defining rhythm of the system. · `--font-inter`
- **Substitute:** system-ui, -apple-system, 'Helvetica Neue', Roboto
- **Weights:** 300, 400
- **Sizes:** 12px, 16px, 20px, 28px, 35px
- **Line height:** 1.50 at 12-16px, 1.30 at 20-28px, 1.00 at 35px
- **Letter spacing:** normal
- **OpenType features:** `"kern"`
- **Role:** Body copy, UI labels, navigation, buttons, captions. The weight 300 default across most sizes keeps the interface quiet against the display serif — the contrast between Teodor's editorial presence and Inter's whisper-light functional text is a defining rhythm of the system.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.5 | — | `--text-caption` |
| body-sm | 16px | 1.5 | — | `--text-body-sm` |
| body | 20px | 1.3 | — | `--text-body` |
| subheading | 24px | 1.5 | — | `--text-subheading` |
| heading-sm | 28px | 1.3 | — | `--text-heading-sm` |
| heading | 35px | 1 | — | `--text-heading` |
| heading-lg | 55px | 1 | — | `--text-heading-lg` |
| display | 90px | 0.75 | — | `--text-display` |

## Tokens — Spacing & Shapes

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 6 | 6px | `--spacing-6` |
| 8 | 8px | `--spacing-8` |
| 9 | 9px | `--spacing-9` |
| 14 | 14px | `--spacing-14` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 30 | 30px | `--spacing-30` |
| 32 | 32px | `--spacing-32` |
| 37 | 37px | `--spacing-37` |
| 40 | 40px | `--spacing-40` |
| 50 | 50px | `--spacing-50` |
| 90 | 90px | `--spacing-90` |
| 100 | 100px | `--spacing-100` |
| 113 | 113px | `--spacing-113` |
| 160 | 160px | `--spacing-160` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 60px |
| cards | 12px |
| buttons | 60px |
| largePills | 37px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| lg | `rgb(151, 252, 215) 0px 0px 20px 5px` | `--shadow-lg` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80-100px
- **Card padding:** 20-24px
- **Element gap:** 24px

## Components

### Pill Primary Button
**Role:** Main call-to-action (e.g. Start Trading, Launch App)

60px border-radius, Mint Glow (#97fcd7) fill, white (#ffffff) text at 16px Inter weight 400, 14px vertical and 28px horizontal padding. Sits as the single most luminous element on any screen.

### Pill Ghost Button
**Role:** Secondary action (e.g. Start Building)

60px border-radius, 1px Mint Glow (#97fcd7) border, transparent fill, Mint Glow text at 16px Inter weight 400, 14px vertical and 28px horizontal padding. Pairs directly beside the primary button.

### Navigation Pill
**Role:** Top-right primary nav action (Launch App)

60px border-radius, Mint Glow (#97fcd7) fill, Midnight Tide (#0f3933) text at 14px Inter weight 400, 9px vertical and 20px horizontal padding. Compact variant of the primary button sized for the nav bar.

### Top Navigation Bar
**Role:** Global header

Transparent background over hero, no visible border. Logo lockup left, nav links (Stats, Docs, Ecosystem) in Inter 16px weight 300 in Pure Light, action pill right. Minimal weight; the nav reads as a thin line, not a panel.

### Brand Mark / Logo Glyph
**Role:** Standalone brand icon (butterfly/dumbbell shape)

Two-lobed organic shape rendered in Mint Glow (#97fcd7), ~28px in nav context, scaled larger as hero centerpiece above the display headline.

### Logo Lockup
**Role:** Brand identifier in nav and footer

Brand mark glyph + "Hyperliquid" wordmark set in Inter weight 400, white. Lockup sits flush-left, no background.

### Hero Section
**Role:** Above-the-fold brand statement

Full-bleed Forest Depths (#072724) canvas overlaid with large organic blob shapes in Abyss Green (#122d28), Deep Lagoon (#1c3f38), and Shadow Teal (#23524c), with soft Teal Pulse (#33998c) rim lighting. Centered brand mark, 90px Teodor headline in Pure Light, 20px Inter body in Mist Gray, button row beneath.

### Glow Card
**Role:** Featured content surface with elevated emphasis

12px border-radius, Shadow Teal (#23524c) fill, 1px Midnight Tide (#0f3933) border, 20-24px internal padding, and the signature mint outer-glow shadow (rgba(151,252,215,0.4) 0px 0px 20px 5px). Used sparingly for one or two priority cards per page.

### Standard Card
**Role:** Default content surface

12px border-radius, Shadow Teal (#23524c) fill, 1px Charcoal Hairline (#2c2e33) or Midnight Tide border, 20-24px padding. No shadow; relies on tonal contrast and border for definition.

### Section Headline Block
**Role:** Section introduction

Teodor 55-60px at line-height 1.0, Pure Light, left- or center-aligned. May include a small Mint Glow eyebrow tag or icon above.

### Tag / Chip
**Role:** Inline labels, category markers, status indicators

60px border-radius (full pill), transparent or Shadow Teal fill, Mint Glow border 1px, Mint Glow or Mist Gray text at 12-14px Inter weight 400, 6px vertical and 14px horizontal padding.

## Do's and Don'ts

### Do
- Use Mint Glow (#97fcd7) as the only fully saturated color on any screen — restrict it to one CTA, one brand mark, or one highlight per viewport.
- Set display headlines in Teodor weight 400 at 90px with 0.75 line-height; this tight leading is the signature editorial gesture.
- Set body and UI text in Inter weight 300 by default; reserve weight 400 for interactive controls and emphasis.
- Use 60px border-radius for every button, tag, and pill element — sharp corners would feel off-system.
- Express elevation with the mint outer-glow shadow on cards, never with gray drop-shadow stacks.
- Build backgrounds from organic, softly-edged shapes in Abyss Green, Deep Lagoon, and Shadow Teal layered over Forest Depths — never flat solid fills for hero regions.
- Keep paragraph text in Mist Gray (#b0c5c1), reserving Pure Light for headlines only — this is what makes the typography feel layered rather than uniformly white.

### Don't
- Do not introduce any new saturated hue — the entire chromatic vocabulary is mint; adding red, blue, or yellow breaks the rarified atmosphere.
- Do not use box-shadow with gray or black tones; the only allowed shadow color is the mint glow rgba(151,252,215,0.4).
- Do not set Teodor below 24px — its editorial detail collapses at small sizes and Inter should take over.
- Do not use square or 4px corner radii on interactive elements; the system is defined by 60px pill geometry.
- Do not place mint text directly on the Forest Depths canvas at small sizes without enough weight — mint on dark needs at least 16px / 400 weight to read.
- Do not use the Charcoal Hairline (#2c2e33) as a visible decorative border — it is for near-invisible structural hairlines only.
- Do not center-align body paragraphs; keep body text left-aligned to maintain the editorial reading rhythm.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Forest Depths | `#072724` | Page canvas and hero background |
| 1 | Abyss / Deep Lagoon | `#122d28` | Deepest atmospheric layer within hero organic shapes |
| 2 | Shadow Teal | `#23524c` | Card surface, elevated panel |
| 3 | Mint Glow | `#97fcd7` | Highlight surface for featured cards, glow rims, primary CTAs |

## Elevation

- **Featured card with glow:** `0px 0px 20px 5px rgba(151, 252, 215, 0.4)`

## Imagery

The site avoids photography entirely. Visual atmosphere is built from large, soft-edged organic blob shapes layered in Abyss Green, Deep Lagoon, and Shadow Teal over the Forest Depths canvas, with Teal Pulse rim lighting. These read as bioluminescent fluid forms rather than literal objects — abstract, dimensional, and brand-colored. The brand mark itself is the only repeated graphic motif (a two-lobed organic shape). Icons appear in a single mint stroke weight. No product screenshots, no illustrations of people or devices, no lifestyle photography. The system is image-free, relying on type, color, and shape to carry the visual weight.

## Layout

Full-bleed dark canvas with no visible page container. The hero occupies the full viewport with a centered stack: brand mark, 90px Teodor headline (centered, two lines), 20px Inter body paragraph (centered, ~560px max width), then a two-button row. Navigation is a single thin bar flush to the top with no background panel, logo left and pill action right. Below the hero, sections use centered or left-aligned content with 80-100px vertical gaps, alternating between standard text-on-canvas blocks and card grids (likely 2-3 columns at 1200px max width). Content density is low — most sections breathe with significant negative space, and the dark canvas absorbs visual weight so layouts can be sparse without feeling empty.

## Agent Prompt Guide

**Quick Color Reference**
- canvas: #072724
- surface: #23524c
- border: #0f3933 (strong) / #2c2e33 (hairline)
- text primary: #ffffff
- text muted: #b0c5c1
- accent: #97fcd7
- primary action: no distinct CTA color

**Example Component Prompts**

1. *Build a hero section*: Full-bleed #072724 canvas with a centered stack. Brand mark glyph in #97fcd7 (two-lobed organic shape, ~40px). Headline at 90px Teodor weight 400, #ffffff, line-height 0.75, centered. Body text at 20px Inter weight 300, #b0c5c1, centered, max-width 560px. Two buttons below: filled pill (#97fcd7 fill, #0f3933 text, 60px radius, 14px 28px padding) and ghost pill (1px #97fcd7 border, #97fcd7 text, transparent fill, 60px radius).

2. *Build a glow feature card*: 12px radius, #23524c fill, 1px #0f3933 border, 24px internal padding, shadow `0px 0px 20px 5px rgba(151,252,215,0.4)`. Card title at 24px Teodor weight 400 #ffffff. Description at 16px Inter weight 300 #b0c5c1. Optional small #97fcd7 tag chip at top (60px radius, 1px #97fcd7 border, #97fcd7 text, 12px Inter).

3. *Build a top navigation bar*: Transparent background, no border, 80px height. Left: logo lockup (#97fcd7 glyph + "Hyperliquid" wordmark in Inter 16px weight 400 #ffffff). Right: nav links Stats, Docs, Ecosystem in Inter 16px weight 300 #ffffff, followed by a pill button (#97fcd7 fill, #0f3933 text, 60px radius, 9px 20px padding).

4. *Build a section headline block*: 55px Teodor weight 400 #ffffff, line-height 1.0, left-aligned, max-width 720px. Above it, a 12px Inter weight 400 #97fcd7 eyebrow label in uppercase tracking.

5. *Build a category tag/chip*: 60px border-radius, transparent fill, 1px #97fcd7 border, 6px 14px padding, text in 12px Inter weight 400 #97fcd7.

## Background Atmosphere System

The hero and section backgrounds are built from 3-4 large, soft-edged organic blob shapes layered over the base #072724 canvas. The layering order from back to front: #072724 (base) → #122d28 (largest, darkest blob) → #1c3f38 (mid-tone) → #23524c (foreground highlight) → optional #33998c rim/edge accent. Each blob has heavily blurred edges (effectively a soft radial gradient between two of these colors). Blobs are oversized and partially off-screen so only their curved edges are visible, creating the impression of depth without a literal scene. This atmosphere is signature to the brand — sections that omit it feel flat and off-system.

## Similar Brands

- **Uniswap** — Same dark canvas with a single vivid accent color and minimal chrome — both rely on brand color as the lone signal of action.
- **Linear** — Comparable near-monochromatic dark palette with pill-shaped controls and generous spacing, though Linear uses purple where Hyperliquid uses mint.
- **Vercel** — Similar editorial restraint — geometric sans body, oversized display headlines, and a luxury-tech atmosphere built from space rather than decoration.
- **Phantom** — Dark crypto-wallet surface treatment with a single saturated accent and pill UI controls, though Phantom leans purple/violet instead of mint.

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-forest-depths: #072724;
  --color-midnight-tide: #0f3933;
  --color-shadow-teal: #23524c;
  --color-charcoal-hairline: #2c2e33;
  --color-abyss-green: #122d28;
  --color-deep-lagoon: #1c3f38;
  --color-mist-gray: #b0c5c1;
  --color-pure-light: #ffffff;
  --color-mint-glow: #97fcd7;
  --color-teal-pulse: #33998c;

  /* Typography — Font Families */
  --font-teodor: 'Teodor', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --text-body-sm: 16px;
  --leading-body-sm: 1.5;
  --text-body: 20px;
  --leading-body: 1.3;
  --text-subheading: 24px;
  --leading-subheading: 1.5;
  --text-heading-sm: 28px;
  --leading-heading-sm: 1.3;
  --text-heading: 35px;
  --leading-heading: 1;
  --text-heading-lg: 55px;
  --leading-heading-lg: 1;
  --text-display: 90px;
  --leading-display: 0.75;

  /* Typography — Weights */
  --font-weight-light: 300;
  --font-weight-regular: 400;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-6: 6px;
  --spacing-8: 8px;
  --spacing-9: 9px;
  --spacing-14: 14px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-30: 30px;
  --spacing-32: 32px;
  --spacing-37: 37px;
  --spacing-40: 40px;
  --spacing-50: 50px;
  --spacing-90: 90px;
  --spacing-100: 100px;
  --spacing-113: 113px;
  --spacing-160: 160px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80-100px;
  --card-padding: 20-24px;
  --element-gap: 24px;

  /* Border Radius */
  --radius-xl: 12px;
  --radius-3xl: 37px;
  --radius-full: 60px;

  /* Named Radii */
  --radius-tags: 60px;
  --radius-cards: 12px;
  --radius-buttons: 60px;
  --radius-largepills: 37px;

  /* Shadows */
  --shadow-lg: rgb(151, 252, 215) 0px 0px 20px 5px;

  /* Surfaces */
  --surface-forest-depths: #072724;
  --surface-abyss-deep-lagoon: #122d28;
  --surface-shadow-teal: #23524c;
  --surface-mint-glow: #97fcd7;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-forest-depths: #072724;
  --color-midnight-tide: #0f3933;
  --color-shadow-teal: #23524c;
  --color-charcoal-hairline: #2c2e33;
  --color-abyss-green: #122d28;
  --color-deep-lagoon: #1c3f38;
  --color-mist-gray: #b0c5c1;
  --color-pure-light: #ffffff;
  --color-mint-glow: #97fcd7;
  --color-teal-pulse: #33998c;

  /* Typography */
  --font-teodor: 'Teodor', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --text-body-sm: 16px;
  --leading-body-sm: 1.5;
  --text-body: 20px;
  --leading-body: 1.3;
  --text-subheading: 24px;
  --leading-subheading: 1.5;
  --text-heading-sm: 28px;
  --leading-heading-sm: 1.3;
  --text-heading: 35px;
  --leading-heading: 1;
  --text-heading-lg: 55px;
  --leading-heading-lg: 1;
  --text-display: 90px;
  --leading-display: 0.75;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-6: 6px;
  --spacing-8: 8px;
  --spacing-9: 9px;
  --spacing-14: 14px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-30: 30px;
  --spacing-32: 32px;
  --spacing-37: 37px;
  --spacing-40: 40px;
  --spacing-50: 50px;
  --spacing-90: 90px;
  --spacing-100: 100px;
  --spacing-113: 113px;
  --spacing-160: 160px;

  /* Border Radius */
  --radius-xl: 12px;
  --radius-3xl: 37px;
  --radius-full: 60px;

  /* Shadows */
  --shadow-lg: rgb(151, 252, 215) 0px 0px 20px 5px;
}
```
