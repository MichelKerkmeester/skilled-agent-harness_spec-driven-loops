# Phantom — Style Reference
> Lavender dreamscape with a violet ghost. A pastel world that flips to midnight violet in key moments, with a friendly mascot ghost wandering between sections.

**Theme:** mixed

Phantom uses a whisper-thin custom typeface (Phantom, weight 350/400) and a dual-violet color world to make a crypto wallet feel like a friendly product, not a trading terminal. The page alternates between pale lavender surfaces and deep midnight-violet sections, with the brand ghost mascot acting as the only character in the system. Every interactive element is aggressively rounded — pills at 100px, large buttons at 32px, hero panels at 24px — giving the entire interface a soft, inflated quality. The signature shadow is not gray but brand-tinted violet (#e2dffe at 0px 0px 4px), making even small elevations feel on-brand. Type is set tight (-0.025em) and large, with display lines at 80–96px that read as quiet rather than loud because of the low weight.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Midnight Violet | `#3c315b` | `--color-midnight-violet` | Dark section backgrounds, primary text on light surfaces, nav text — the deep brand violet anchors identity and gives the dark hero/sections their weight |
| Lavender Whisper | `#e2dffe` | `--color-lavender-whisper` | Brand-tinted shadow, soft accent washes, subtle elevation glow — replaces neutral gray shadows so elevation stays on-brand |
| Ghost Lilac | `#ab9ff2` | `--color-ghost-lilac` | Violet supporting accent for decorative details and low-frequency emphasis. Do not promote it to the primary CTA color |
| Cornflower Pop | `#4a87f2` | `--color-cornflower-pop` | Rare accent for highlighted CTAs or featured buttons — a brighter blue-violet used sparingly for emphasis |
| Cream Glow | `#ffffc4` | `--color-cream-glow` | Decorative pastel surface — soft yellow wash for feature cards or playful callouts against the violet system |
| Blush Mist | `#ffdadc` | `--color-blush-mist` | Decorative pastel surface — pale pink wash for feature cards or playful callouts within the light sections |
| Emerald Mint | `#2ec08b` | `--color-emerald-mint` | Green supporting accent for decorative details and low-frequency emphasis. Use as a supporting accent, not as a status color |
| Cloud Canvas | `#fdfcfe` | `--color-cloud-canvas` | Page canvas, light card surfaces, button text on dark — the near-white base that everything sits on |
| Charcoal Ink | `#1c1c1c` | `--color-charcoal-ink` | Primary text on light surfaces, text on cream/blush accents — the dark reading color |
| Frost White | `#f4f2f4` | `--color-frost-white` | Secondary light surface, subtle panel backgrounds, light section fills — a warm-tinted off-white for elevation |
| Ash Veil | `#e9e8ea` | `--color-ash-veil` | Tertiary surface, hairline borders, disabled states — barely-there gray for structural separation |
| Slate Mute | `#86848d` | `--color-slate-mute` | Muted helper text, secondary icons, inactive nav items — mid-gray for de-emphasized content |

## Tokens — Typography

### Phantom — The sole typeface — custom Phantom with two whisper-light weights. Weight 350 for display/headlines, 400 for body and UI text. The single-weight light approach is anti-convention for crypto (which defaults to bold 700 headlines); the thin strokes make Phantom feel editorial and calm, not aggressive or financial. The custom letterforms — visible in the rounded 'a' and open 'e' — give the brand a distinctive typographic fingerprint that no system font replicates. · `--font-phantom`
- **Substitute:** Inter (weight 350/400) or Satoshi for closest geometry; avoid system-ui which lacks the custom curves
- **Weights:** 350, 400
- **Sizes:** 13px, 15px, 16px, 20px, 24px, 30px, 64px, 80px, 96px
- **Line height:** 1.0–1.4
- **Letter spacing:** -0.025em (universal; -0.325px at 13px through -2.4px at 96px)
- **Role:** The sole typeface — custom Phantom with two whisper-light weights. Weight 350 for display/headlines, 400 for body and UI text. The single-weight light approach is anti-convention for crypto (which defaults to bold 700 headlines); the thin strokes make Phantom feel editorial and calm, not aggressive or financial. The custom letterforms — visible in the rounded 'a' and open 'e' — give the brand a distinctive typographic fingerprint that no system font replicates.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 13px | 1.35 | -0.325px | `--text-caption` |
| body-sm | 15px | 1.4 | -0.375px | `--text-body-sm` |
| subheading | 20px | 1.25 | -0.5px | `--text-subheading` |
| heading-sm | 24px | 1.21 | -0.6px | `--text-heading-sm` |
| heading | 30px | 1.25 | -0.75px | `--text-heading` |
| heading-lg | 64px | 1.1 | -1.6px | `--text-heading-lg` |
| display | 80px | 1 | -2px | `--text-display` |

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
| 32 | 32px | `--spacing-32` |
| 48 | 48px | `--spacing-48` |
| 64 | 64px | `--spacing-64` |
| 96 | 96px | `--spacing-96` |
| 128 | 128px | `--spacing-128` |

### Border Radius

| Element | Value |
|---------|-------|
| body | 4px |
| pill | 100px |
| cards | 24px |
| buttons | 100px |
| largeButtons | 32px |
| smallElements | 16px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| sm | `rgb(226, 223, 254) 0px 0px 4px 0px` | `--shadow-sm` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 64px
- **Card padding:** 32px
- **Element gap:** 16px

## Components

### Pill Navigation Container
**Role:** Top-level navigation bar

Floating pill container with 100px border-radius, background #fdfcfe on light sections or transparent on dark sections. Contains logo, nav links (Phantom font 15px/350 weight, #1c1c1c text), search icon, and Download CTA. Padding 8px vertical, 16px horizontal. No visible border on light sections; gains subtle 1px #e9e8ea border on dark sections.

### Primary Filled CTA (Download Phantom)
**Role:** Main conversion button

Pill shape at 100px radius, background #ab9ff2 (Ghost Lilac), text #fdfcfe at 15px Phantom weight 400. Padding 12px 24px. Brand-tinted shadow #e2dffe at 0px 0px 4px. No border. Sits in top-right of nav and in hero center.

### Ghost Pill Button (See more)
**Role:** Secondary navigation or learn-more action

Pill shape at 100px radius, background #fdfcfe on light sections or transparent on dark sections. Text in #ab9ff2 (light sections) or #fdfcfe (dark sections) at 15px Phantom weight 400. Optional arrow icon (↗) in #ab9ff2. Padding 10px 20px. No shadow.

### Display Headline
**Role:** Hero and section H1

Centered text at 80–96px Phantom weight 350, line-height 1.0–1.1, letter-spacing -2.0 to -2.4px. Color #1c1c1c on light sections, #fdfcfe on dark sections. Word wrap over 2–3 lines with natural line breaks. The ghost mascot character substitutes for a word or sits inline within the headline.

### Subheadline (Eyebrow Text)
**Role:** Section pre-title

14–16px Phantom weight 400, #ab9ff2 or #1c1c1c opacity 0.6. Sits centered above display headlines as a soft intro line.

### Ghost Mascot Character
**Role:** Brand character integrated into copy

The Phantom ghost character rendered in #ab9ff2 (Ghost Lilac), sized inline with headline text (~60–80px). Drops into headlines replacing a word (e.g. 'Trading tools for [ghost] everyone'). Functions as visual punctuation and brand anchor.

### Section Panel (Light)
**Role:** Light content section background

Full-width background #f4f2f4 or #fdfcfe, with centered content at max-width 1200px. Section gap 64px vertical. Contains display headline + optional ghost mascot + optional pill CTA.

### Section Panel (Dark)
**Role:** Dark content section background

Full-width background #3c315b (Midnight Violet), with centered content at max-width 1200px. Display text inverts to #fdfcfe. Ghost mascot in #ab9ff2 remains the only chromatic element. Used for security/identity sections.

### Nav Dropdown Item
**Role:** Navigation dropdown link

Text link in Phantom 15px/350, color #1c1c1c on light, #fdfcfe on dark. No underline. Chevron down icon in #86848d. Hover: color shifts to #ab9ff2. No background change.

### Pastel Feature Card
**Role:** Decorative content card

Rounded rectangle at 24px radius, background in #ffffc4 (Cream Glow) or #ffdadc (Blush Mist). Padding 32px. Content in #1c1c1c. No shadow or border. Used sparingly for playful section accents.

### Success Badge
**Role:** Status indicator

Small pill at 100px radius, background #2ec08b (Emerald Mint), text #fdfcfe at 13px Phantom weight 400. Padding 4px 12px. Used for transaction confirmations and success states.

## Do's and Don'ts

### Do
- Use Phantom font at weight 350 for all display/headline text; never go above weight 400 anywhere in the system
- Apply -0.025em letter-spacing uniformly; never set type with default or positive tracking
- Use 100px border-radius for all buttons, tags, and nav containers — pills are mandatory, not optional
- Alternate section backgrounds between #fdfcfe/#f4f2f4 (light) and #3c315b (dark) to create the signature lavender-to-midnight rhythm
- Use brand-tinted shadow #e2dffe at 0px 0px 4px for button elevation — never use gray or black drop shadows
- Center all primary content at max-width 1200px with 64px+ vertical section gaps
- Integrate the ghost mascot character inline within display headlines as a word substitution

### Don't
- Never use weight 600+ in Phantom — the system is whisper-light, and bold breaks the tone
- Never use gray (#000000) shadows — all elevation must be brand-tinted #e2dffe
- Never use sharp corners below 16px radius on interactive elements — the system is aggressively rounded
- Never use #2ec08b (green) outside success/transactional badge contexts — it is semantic, not decorative
- Never stack more than one ghost mascot per section — the character is punctuation, not wallpaper
- Never use neutral gray (#86848d) for body text — only for icons and de-emphasized metadata
- Never create multi-column hero layouts — primary content must be a centered vertical stack

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Cloud Canvas | `#fdfcfe` | Base page background, light hero sections |
| 1 | Frost White | `#f4f2f4` | Light section fills, subtle card elevation |
| 2 | Cream Glow | `#ffffc4` | Decorative pastel feature card surface |
| 3 | Blush Mist | `#ffdadc` | Decorative pastel feature card surface |
| 4 | Midnight Violet | `#3c315b` | Dark section background, full-bleed dark hero panels |

## Elevation

- **Primary CTA button (filled):** `0px 0px 4px 0px #e2dffe — brand-tinted violet glow replacing neutral gray shadow`
- **Ghost/outline button:** `none — relies on 1px border and brand-tinted fill contrast`
- **Section panels:** `none — flat surfaces, no drop shadow`

## Imagery

Illustration-first with a custom ghost mascot character as the sole recurring visual. No photography, no product screenshots in primary surfaces. The ghost appears inline within headlines, as a standalone decorative element, and as a section anchor. Supporting visuals are flat vector illustrations in the pastel accent palette (#ffffc4, #ffdadc, #ab9ff2). Icons are thin-stroke outlined style, 1.5px weight, in #86848d or #ab9ff2. The visual density is low — the ghost and large type do the work, with generous white space around them.

## Layout

Centered, max-width 1200px content with full-bleed alternating background bands. The page rhythm is: light lavender section → deep violet dark section → light lavender, repeating down the page. Each section follows the pattern: optional eyebrow text → display headline (80–96px, centered, often 2 lines) → optional ghost mascot inline → single pill CTA. No multi-column grids in hero sections — everything is a centered vertical stack. The navigation is a single horizontal pill floating at the top, not a full-width bar. Generous vertical breathing room: 64px+ between sections, 48px+ between major elements. The layout is symmetrical and centered throughout — no asymmetric or split compositions in primary content.

## Agent Prompt Guide

**Quick Color Reference**
- text (on light): #1c1c1c
- text (on dark): #fdfcfe
- background (canvas): #fdfcfe
- background (dark section): #3c315b
- border / hairline: #e9e8ea
No distinct primary action color was observed; use the extracted neutral button treatments instead of inventing a filled CTA color.
- primary action: no distinct CTA color

**Example Component Prompts**


2. **Dark Security Section**: Full-width background #3c315b. Display headline at 64px Phantom weight 350, #fdfcfe, line-height 1.1, letter-spacing -1.6px, centered. Ghost mascot in #ab9ff2 inline. Ghost pill button: 100px radius, #fdfcfe background, #3c315b text, 10px 20px padding, arrow icon in #ab9ff2.


4. **Pastel Feature Card**: 24px radius, #ffffc4 background, 32px padding. Heading at 24px Phantom weight 350, #1c1c1c. Body at 16px Phantom weight 400, #1c1c1c. No shadow or border.

5. **Ghost Pill Secondary Button**: 100px radius, transparent background on dark sections or #fdfcfe on light, 1px border #ab9ff2, text #ab9ff2 at 15px Phantom weight 400, 10px 20px padding, arrow icon (↗) trailing.

## Similar Brands

- **Coinbase** — Same light/dark section alternation with centered display headlines, though Coinbase uses a blue system vs Phantom's violet
- **Rainbow Wallet** — Same playful pastel palette and rounded pill-button language for a crypto consumer product, with similar mascot-driven personality
- **Linear** — Same whisper-thin custom typeface approach with tight letter-spacing and large calm display sizes
- **Stripe** — Same centered max-width layout with alternating surface bands and single accent color for CTAs
- **Framer** — Same generous vertical breathing room, centered stacks, and pastel-on-dark section transitions

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-midnight-violet: #3c315b;
  --color-lavender-whisper: #e2dffe;
  --color-ghost-lilac: #ab9ff2;
  --color-cornflower-pop: #4a87f2;
  --color-cream-glow: #ffffc4;
  --color-blush-mist: #ffdadc;
  --color-emerald-mint: #2ec08b;
  --color-cloud-canvas: #fdfcfe;
  --color-charcoal-ink: #1c1c1c;
  --color-frost-white: #f4f2f4;
  --color-ash-veil: #e9e8ea;
  --color-slate-mute: #86848d;

  /* Typography — Font Families */
  --font-phantom: 'Phantom', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 13px;
  --leading-caption: 1.35;
  --tracking-caption: -0.325px;
  --text-body-sm: 15px;
  --leading-body-sm: 1.4;
  --tracking-body-sm: -0.375px;
  --text-subheading: 20px;
  --leading-subheading: 1.25;
  --tracking-subheading: -0.5px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.21;
  --tracking-heading-sm: -0.6px;
  --text-heading: 30px;
  --leading-heading: 1.25;
  --tracking-heading: -0.75px;
  --text-heading-lg: 64px;
  --leading-heading-lg: 1.1;
  --tracking-heading-lg: -1.6px;
  --text-display: 80px;
  --leading-display: 1;
  --tracking-display: -2px;

  /* Typography — Weights */
  --font-weight-w350: 350;
  --font-weight-regular: 400;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-96: 96px;
  --spacing-128: 128px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 64px;
  --card-padding: 32px;
  --element-gap: 16px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-2xl: 16px;
  --radius-3xl: 24px;
  --radius-3xl-2: 32px;
  --radius-full: 96px;
  --radius-full-2: 100px;

  /* Named Radii */
  --radius-body: 4px;
  --radius-pill: 100px;
  --radius-cards: 24px;
  --radius-buttons: 100px;
  --radius-largebuttons: 32px;
  --radius-smallelements: 16px;

  /* Shadows */
  --shadow-sm: rgb(226, 223, 254) 0px 0px 4px 0px;

  /* Surfaces */
  --surface-cloud-canvas: #fdfcfe;
  --surface-frost-white: #f4f2f4;
  --surface-cream-glow: #ffffc4;
  --surface-blush-mist: #ffdadc;
  --surface-midnight-violet: #3c315b;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-midnight-violet: #3c315b;
  --color-lavender-whisper: #e2dffe;
  --color-ghost-lilac: #ab9ff2;
  --color-cornflower-pop: #4a87f2;
  --color-cream-glow: #ffffc4;
  --color-blush-mist: #ffdadc;
  --color-emerald-mint: #2ec08b;
  --color-cloud-canvas: #fdfcfe;
  --color-charcoal-ink: #1c1c1c;
  --color-frost-white: #f4f2f4;
  --color-ash-veil: #e9e8ea;
  --color-slate-mute: #86848d;

  /* Typography */
  --font-phantom: 'Phantom', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 13px;
  --leading-caption: 1.35;
  --tracking-caption: -0.325px;
  --text-body-sm: 15px;
  --leading-body-sm: 1.4;
  --tracking-body-sm: -0.375px;
  --text-subheading: 20px;
  --leading-subheading: 1.25;
  --tracking-subheading: -0.5px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.21;
  --tracking-heading-sm: -0.6px;
  --text-heading: 30px;
  --leading-heading: 1.25;
  --tracking-heading: -0.75px;
  --text-heading-lg: 64px;
  --leading-heading-lg: 1.1;
  --tracking-heading-lg: -1.6px;
  --text-display: 80px;
  --leading-display: 1;
  --tracking-display: -2px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-96: 96px;
  --spacing-128: 128px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-2xl: 16px;
  --radius-3xl: 24px;
  --radius-3xl-2: 32px;
  --radius-full: 96px;
  --radius-full-2: 100px;

  /* Shadows */
  --shadow-sm: rgb(226, 223, 254) 0px 0px 4px 0px;
}
```
