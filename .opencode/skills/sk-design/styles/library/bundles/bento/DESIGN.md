# Bento — Style Reference
> bento lunchbox on sunlit linoleum. A grid of rounded, sticker-like cards in lime, lavender, cobalt, and maroon, each ringed with thick black ink, sitting on warm off-white linen beneath a confident geometric headline.

**Theme:** mixed

Bento speaks in a sunlit, pop-art bento-box language: full-bleed banded sections in lime, royal blue, and maroon stack vertically like a Japanese lunch tray, separated by generous white space on a warm linen canvas (#f3f3f1). The system is high-contrast and confident — thick black outlines wrap nearly every shape (1284+ black border occurrences), giving cards, buttons, and illustrations a hand-drawn, sticker-like quality that rejects soft shadows. Typography is tight and assertive: a custom geometric sans at up to 800 weight, with negative tracking that pulls display headlines into a single dense mass at 80px. The color palette is deliberately loud but disciplined — lime green is the single loud action accent, while maroon, royal blue, lavender, forest, cobalt, and gold serve as decorative section/card fills. Components lean pill-shaped (99px) and heavily rounded (64px, 32px), with small-radius (8px) exceptions for nav and inputs. The overall mood is playful, maximalist, and unapologetically graphic — a creator-tool brand that celebrates personality over neutrality.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Lime Spark | `#d2e823` | `--color-lime-spark` | Primary action buttons, active nav fills, highlight card surfaces — the single loud CTA accent that punches through every colored band |
| Lavender Mist | `#e9c0e9` | `--color-lavender-mist` | Decorative borders, icon outlines, soft card edges, and subtle highlight washes — a pastel companion that desaturates without disappearing |
| Cobalt Band | `#2665d6` | `--color-cobalt-band` | Violet outline accent for tags, dividers, and focused UI edges. Do not promote it to the primary CTA color |
| Maroon Plate | `#780016` | `--color-maroon-plate` | Deep section backgrounds, card fills — anchors the lower page with a wine-colored tray that makes white type glow |
| Cobalt Deep | `#061492` | `--color-cobalt-deep` | Card surface fills for product mockups and feature blocks — a denser, more intense blue than Cobalt Band |
| Forest Ink | `#254f1a` | `--color-forest-ink` | Card surface fills, body accent text — the dark green that grounds warm-toned card compositions |
| Mustard Pop | `#d6a337` | `--color-mustard-pop` | Card surface fills, decorative tile colors — a warm gold that adds variety to bento grid compositions |
| Linen Canvas | `#f3f3f1` | `--color-linen-canvas` | Page background, neutral button fills, soft section breaks — the warm off-white base that lets colored bands float |
| White Plate | `#ffffff` | `--color-white-plate` | Card surfaces, form inputs, icon fills, and inverted text on dark/colored backgrounds |
| Ink Black | `#000000` | `--color-ink-black` | Primary text, dominant borders (all cards/buttons/icons carry a black stroke), and illustration outlines — the structural ink that defines every shape |
| Midnight Ink | `#1e2330` | `--color-midnight-ink` | Secondary dark text and borders, heading strokes on light surfaces, icon outlines — a near-black with a cool cast that softens the harshness of pure black |
| Sage Mute | `#676b5f` | `--color-sage-mute` | Muted helper text, secondary link borders, low-emphasis captions — a desaturated olive-gray that recedes without disappearing |
| Silver Border | `#c7c8cb` | `--color-silver-border` | Subtle button borders, disabled states, low-emphasis dividers |
| Charcoal Pill | `#222222` | `--color-charcoal-pill` | Dark mode button borders, hover state outlines on inverted components |
| Concrete Tile | `#adadad` | `--color-concrete-tile` | Placeholder card backgrounds, skeleton states, and muted tile fills |
| Leaf Wash | `#ebffc5` | `--color-leaf-wash` | Soft section backgrounds and highlight washes — a very pale lime that echoes Lime Spark without competing |
| Moss Tint | `#e8efd6` | `--color-moss-tint` | Alternate pale surface for section banding — a desaturated green-gray that adds another neutral layer |

## Tokens — Typography

### Arial — System fallback only — present in small quantities, likely from a legacy or utility context. Do not use as a primary face. · `--font-arial`
- **Weights:** 400
- **Sizes:** 16px
- **Line height:** 1.50
- **Role:** System fallback only — present in small quantities, likely from a legacy or utility context. Do not use as a primary face.

### Linksans — Primary type system for all UI, body, headings, and display. Used at 400 for body, 500 for emphasis, 700 for subheadings/buttons, 800 for the densest display headlines. The 800-weight display at 80px with -0.043em tracking is the signature: type that reads as a single shape, not a sentence. Substitute with Inter or General Sans for close geometric proportions. · `--font-linksans`
- **Substitute:** Inter (variable) or General Sans
- **Weights:** 400, 500, 700, 800
- **Sizes:** 12px, 13px, 14px, 15px, 16px, 18px, 20px, 24px, 25px, 28px, 51px, 56px, 80px
- **Line height:** 1.00, 1.06, 1.07, 1.20, 1.30, 1.50, 2.32
- **Letter spacing:** -0.0430em at 51px, -0.0240em at 28px, -0.0200em at 14-18px, -0.0130em at 20-25px, -0.0100em at 16px, +0.0100em at small body
- **Role:** Primary type system for all UI, body, headings, and display. Used at 400 for body, 500 for emphasis, 700 for subheadings/buttons, 800 for the densest display headlines. The 800-weight display at 80px with -0.043em tracking is the signature: type that reads as a single shape, not a sentence. Substitute with Inter or General Sans for close geometric proportions.

### Linksans Linksansvf — Linksans Linksansvf — detected in extracted data but not described by AI · `--font-linksans-linksansvf`
- **Weights:** 400, 500, 700, 800
- **Sizes:** 14px, 16px, 18px, 24px, 28px, 56px, 80px
- **Line height:** 1, 1.06, 1.07, 1.2, 1.3, 1.5
- **Letter spacing:** -0.02, -0.01, 0.01
- **Role:** Linksans Linksansvf — detected in extracted data but not described by AI

### yerk — yerk — detected in extracted data but not described by AI · `--font-yerk`
- **Weights:** 400
- **Sizes:** 14px
- **Line height:** 1.5
- **Role:** yerk — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.5 | 0.12px | `--text-caption` |
| body-sm | 14px | 1.5 | -0.28px | `--text-body-sm` |
| body | 16px | 1.5 | -0.16px | `--text-body` |
| body-lg | 18px | 1.3 | -0.36px | `--text-body-lg` |
| subheading | 24px | 1.2 | -0.48px | `--text-subheading` |
| heading-sm | 28px | 1.07 | -0.67px | `--text-heading-sm` |
| heading | 51px | 1.06 | -2.19px | `--text-heading` |
| display | 80px | 1 | -3.44px | `--text-display` |

## Tokens — Spacing & Shapes

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 8 | 8px | `--spacing-8` |
| 10 | 10px | `--spacing-10` |
| 14 | 14px | `--spacing-14` |
| 16 | 16px | `--spacing-16` |
| 18 | 18px | `--spacing-18` |
| 20 | 20px | `--spacing-20` |
| 22 | 22px | `--spacing-22` |
| 24 | 24px | `--spacing-24` |
| 26 | 26px | `--spacing-26` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 64 | 64px | `--spacing-64` |
| 65 | 65px | `--spacing-65` |
| 128 | 128px | `--spacing-128` |
| 216 | 216px | `--spacing-216` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 8px |
| tags | 99px |
| cards | 32px |
| inputs | 8px |
| buttons | 99px |
| largeCards | 64px |
| organicShapes | 1000px |
| smallElements | 16px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 64-80px
- **Card padding:** 20-24px
- **Element gap:** 12-16px

## Components

### Lime Spark Primary Button
**Role:** Single dominant CTA — sign up, get started, submit

Fill #d2e823, text #000000 at Linksans 700 16px, 99px pill radius, padding 18px 28px or 20px horizontal. Carries a 2-3px solid #000000 border that makes the lime read as a sticker rather than a flat button. Hover deepens the lime slightly; active adds a small downward translate. No drop shadow — the black outline IS the elevation.

### Ghost Pill Button
**Role:** Secondary action — Log in, Cancel, Learn more

Transparent fill, text #000000 at Linksans 500 16px, 99px pill radius, padding 18px 22px. 2px #000000 border. Sits beside primary without competing.

### White Inverted Button
**Role:** CTA on colored band sections (maroon, blue, lime)

Fill #ffffff, text #000000, 99px radius, Linksans 700 16px, 18px 28px padding. Always wrapped in a thin #000000 border to maintain the sticker aesthetic on any background.

### Social Link Pill
**Role:** Creator profile link button (the bento.me link-in-bio use case)

Fill #ffffff or #f3f3f1, text #000000 Linksans 500 14-16px, 99px pill, 2px #000000 border, 14-18px vertical padding, 20-24px horizontal padding. Icon left at 20px, always monoline black.

### Bento Card Surface
**Role:** Feature card, product block, or decorative tile in a bento grid

One of the brand fills (Lime Spark, Lavender Mist, Cobalt Deep, Forest Ink, Mustard Pop, Maroon Plate, or Linen Canvas). Radius 32-64px, 2-3px #000000 border, padding 20-24px. No shadow. Text color inverts to #ffffff or #000000 based on the card's fill luminance.

### Organic Blob Card
**Role:** Hero illustration card, decorative shape, phone mockup frame

Uses the 1000px radius (effectively a squircle/blob). Fill is a brand color or white, always ringed by 2-3px #000000 border. The signature shape: looks like a sticker peeled from a sheet.

### Phone Mockup Frame
**Role:** Product preview — showcases the creator's link page on a phone

Black-bordered rounded rectangle, 32-64px radius, displaying a screenshot of a bento.me page inside. Often tilted 2-4° for dynamism. The frame itself is #000000 or a brand color fill.

### Section Band Background
**Role:** Full-bleed colored section — hero, feature, CTA zones

Full viewport width, min-height 80vh. Fills rotate through Lime Spark, Cobalt Band, Maroon Plate, and Linen Canvas to create the bento-tray effect. Section padding 64-80px vertical. Headlines on dark bands use #ffffff or #d2e823; on light bands use #000000.

### Pill Navigation Bar
**Role:** Top-level site navigation

Float centered, white (#ffffff) fill, 8px radius, 2px #000000 border, padding 8px 8px 8px 24px. Logo left, nav links center as ghost text, CTA right as Lime Spark pill or dark button.

### Form Input
**Role:** Text input for email, name, search

Fill #ffffff, 2px #000000 border, 8px radius, padding 12px 16px. Placeholder text in #757575 at Linksans 400 16px. Focus state thickens border to 3px and adds a Lime Spark outer ring at 2px offset.

### Cookie Consent Modal
**Role:** Privacy/cookie notice overlay

Fixed bottom-left card, fill #ffffff, 16-32px radius, 2-3px #000000 border, padding 24px, max-width 360px. Title Linksans 700 16px #000000, body Linksans 400 14px #676b5f. Three stacked buttons: Accept All (Lime Spark filled), Reject All (ghost), Customize (ghost text link).

### Monoline Icon
**Role:** UI icons — nav, social, features

1.5-2px stroke, #000000 fill or stroke, no color fills. Square or circular bounding box, 20-24px display size. Style is flat geometric, no shadows or gradients.

### Top Banner Strip
**Role:** Promotional announcement bar (e.g. 'THE CREATOR INDEX')

Full-bleed, 40-48px height, Leaf Wash (#ebffc5) or Lime Spark fill, text Linksans 500 14px #000000, centered. Underline accent on key phrase.

## Do's and Don'ts

### Do
- Use Lime Spark (#d2e823) as the single primary action fill — never introduce a second CTA color, the loudness of lime only works in isolation
- Wrap every card, button, and illustration in a 2-3px solid #000000 border — the black outline is the elevation system, drop shadows are forbidden
- Use 99px pill radius for every interactive element (buttons, tags, social links) and 32-64px for card surfaces
- Stack sections as full-bleed color bands rotating through Lime Spark, Cobalt Band (#2665d6), Maroon Plate (#780016), and Linen Canvas (#f3f3f1)
- Set display headlines at 80px Linksans 800 with -0.043em tracking so they read as a single shape, not a sentence
- Invert card text to #ffffff or #000000 based on the fill luminance — never use a mid-gray for card text
- Use the 1000px radius (squircle/blob) for hero illustrations, phone mockups, and organic decorative shapes

### Don't
- Don't add drop shadows, inner shadows, or blur effects — the black border IS the elevation; stacking shadows breaks the sticker aesthetic
- Don't use Lavender Mist (#e9c0e9), Forest Ink (#254f1a), or Mustard Pop (#d6a337) as CTA fills — they are decorative card colors, not action colors
- Don't introduce a neutral gray button that competes with Lime Spark — secondary actions must be ghost/outlined with a black border
- Don't use Cobalt Band (#2665d6) or Maroon Plate (#780016) for body text — they are section background fills, not legible text colors
- Don't soften the type with positive letter-spacing or light weights in headlines — the design only works when display type is 700-800 and tightly tracked
- Don't use sharp corners (< 8px) on any card or button — the system requires organic rounding at every level
- Don't use #000000 text on the Maroon Plate or Cobalt Band backgrounds without first testing contrast — use #ffffff or #d2e823 instead

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Linen Canvas | `#f3f3f1` | Page base, default section background between color bands |
| 1 | White Plate | `#ffffff` | Card surfaces, form inputs, modals, navigation float |
| 2 | Leaf Wash | `#ebffc5` | Soft highlight sections, banner strips, subtle elevated wash |
| 3 | Moss Tint | `#e8efd6` | Alternate neutral surface, section banding variation |
| 4 | Concrete Tile | `#adadad` | Skeleton/placeholder card fills, muted tile backgrounds |
| 5 | Cobalt Band | `#2665d6` | Full-bleed section background — hero/feature band |
| 6 | Maroon Plate | `#780016` | Full-bleed section background — bottom CTA/social band |

## Elevation

Bento has no drop shadows. The entire elevation system is replaced by a consistent 2-3px solid #000000 border on every elevated element — cards, buttons, modals, illustrations, and phone mockups. This creates a flat, sticker-like, comic-book aesthetic where shape is defined by outline rather than by light. A hover state may add a 2px translate, but never a shadow.

## Imagery

The site is image-led, using three distinct visual modes: (1) 3D-rendered phone mockups tilted 2-4° displaying the bento product UI, always framed by thick black borders to match the sticker aesthetic; (2) colorful bento-grid card compositions — small rounded squares in brand colors (maroon, cobalt, lime, mustard, lavender) arranged in a masonry-like cluster, each ringed in black; (3) lifestyle photography in the hero band — staged portraits of creators in saturated color environments (a man in a brown suit against maroon wood paneling, a person in a red beanie against a blue background). Illustrations are flat with heavy black outlines, no gradients, no soft shadows. The overall density is balanced — roughly 40% imagery, 60% text/colored surface, with the color bands doing as much visual work as the photos.

## Layout

Full-bleed vertically stacked color bands with no central max-width on the sections themselves — each band stretches edge-to-edge. Content within bands is centered with a max-width of ~1200px, using a 12-column grid. The hero is a left-aligned headline + right-aligned phone mockup split (50/50). Subsequent sections alternate: text-left/image-right, then text-right/image-left, creating a Z-pattern rhythm. The bento grid sections use a 2x3 or 3x3 asymmetric masonry of rounded color tiles. The bottom band is a maroon full-bleed with a left-aligned headline and a right-side bento card cluster. Vertical rhythm is generous — 64-80px between sections, with the color band transitions themselves acting as the dividers. Navigation is a floating white pill bar centered at the top, not a full-width header.

## Agent Prompt Guide

**Quick Color Reference**
- text: #000000
- background (canvas): #f3f3f1
- card surface: #ffffff
- border (all shapes): #000000 (2-3px)
- accent (decorative): #e9c0e9 (Lavender Mist)
- primary action: #d2e823 (filled action)

**3-5 Example Component Prompts**

1. **Hero Section**: Full-bleed Lime Spark (#d2e823) background, 80px height per side padding. Left column: headline 'bio you' at 80px Linksans 800, color #000000, letter-spacing -3.44px. Below at 18px Linksans 400, color #000000, supporting copy. CTA: Lime Spark filled button with 2px #000000 border, 99px radius, text 'Get started for free' at 16px 700 #000000, padding 18px 28px. Right column: phone mockup at 2° tilt, white card surface with 2px #000000 border, 32px radius, displaying a bento profile inside.

2. Create a Primary Action Button: #d2e823 background, #000000 text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.

3. **Bento Card Grid**: Three columns on Linen Canvas (#f3f3f1) background. Cards: mix of 32px and 64px radius, fills rotating through #d2e823, #061492, #254f1a, #d6a337, #780016, #e9c0e9. Every card has 2-3px #000000 border, 20-24px padding, text inverting to #ffffff or #000000 based on luminance.

4. **Cookie Consent Modal**: Fixed bottom-left, 360px max-width, #ffffff fill, 16px radius, 2px #000000 border, 24px padding. Title 'We Value Your Privacy' at 16px Linksans 700 #000000. Body at 14px Linksans 400 #676b5f. Three stacked buttons: 'Accept All' (Lime Spark #d2e823 filled, 99px radius, black border), 'Reject All' (ghost, 99px radius, black border, black text), 'Customize my choices' (text link in #000000).

5. **Social Link Profile Page**: White (#ffffff) background, centered 480px column. Avatar at top in 1000px radius blob, 3px #000000 border. Stacked social link pills below: each #ffffff fill, 2px #000000 border, 99px radius, 18px vertical padding, 20-24px horizontal padding, monoline black icon left at 20px, label at 16px Linksans 500 #000000.

## Similar Brands

- **Notion** — Same bento-grid layout language — rounded card tiles in varied colors stacked asymmetrically on a warm off-white canvas
- **Gumroad** — Same maximalist creator-tool aesthetic with saturated color blocks, pill buttons, and personality-forward typography
- **Brilliant** — Same playful educational-app vibe with bold colors, thick black outlines on illustrations, and a flat sticker-like design language
- **Poppi** — Same loud, pop-art color palette and rounded organic shapes used as a brand differentiator
- **Linktree** — Same product category (link-in-bio) with pill-shaped social link buttons and bright, attention-grabbing section colors

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-lime-spark: #d2e823;
  --color-lavender-mist: #e9c0e9;
  --color-cobalt-band: #2665d6;
  --color-maroon-plate: #780016;
  --color-cobalt-deep: #061492;
  --color-forest-ink: #254f1a;
  --color-mustard-pop: #d6a337;
  --color-linen-canvas: #f3f3f1;
  --color-white-plate: #ffffff;
  --color-ink-black: #000000;
  --color-midnight-ink: #1e2330;
  --color-sage-mute: #676b5f;
  --color-silver-border: #c7c8cb;
  --color-charcoal-pill: #222222;
  --color-concrete-tile: #adadad;
  --color-leaf-wash: #ebffc5;
  --color-moss-tint: #e8efd6;

  /* Typography — Font Families */
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-linksans: 'Linksans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-linksans-linksansvf: 'Linksans Linksansvf', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-yerk: 'yerk', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --tracking-caption: 0.12px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --tracking-body-sm: -0.28px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.16px;
  --text-body-lg: 18px;
  --leading-body-lg: 1.3;
  --tracking-body-lg: -0.36px;
  --text-subheading: 24px;
  --leading-subheading: 1.2;
  --tracking-subheading: -0.48px;
  --text-heading-sm: 28px;
  --leading-heading-sm: 1.07;
  --tracking-heading-sm: -0.67px;
  --text-heading: 51px;
  --leading-heading: 1.06;
  --tracking-heading: -2.19px;
  --text-display: 80px;
  --leading-display: 1;
  --tracking-display: -3.44px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-bold: 700;
  --font-weight-extrabold: 800;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-14: 14px;
  --spacing-16: 16px;
  --spacing-18: 18px;
  --spacing-20: 20px;
  --spacing-22: 22px;
  --spacing-24: 24px;
  --spacing-26: 26px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-65: 65px;
  --spacing-128: 128px;
  --spacing-216: 216px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 64-80px;
  --card-padding: 20-24px;
  --element-gap: 12-16px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-2xl: 16px;
  --radius-3xl: 29.09px;
  --radius-3xl-2: 32px;
  --radius-3xl-3: 41.6px;
  --radius-full: 64px;
  --radius-full-2: 99px;
  --radius-full-3: 1000px;

  /* Named Radii */
  --radius-nav: 8px;
  --radius-tags: 99px;
  --radius-cards: 32px;
  --radius-inputs: 8px;
  --radius-buttons: 99px;
  --radius-largecards: 64px;
  --radius-organicshapes: 1000px;
  --radius-smallelements: 16px;

  /* Surfaces */
  --surface-linen-canvas: #f3f3f1;
  --surface-white-plate: #ffffff;
  --surface-leaf-wash: #ebffc5;
  --surface-moss-tint: #e8efd6;
  --surface-concrete-tile: #adadad;
  --surface-cobalt-band: #2665d6;
  --surface-maroon-plate: #780016;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-lime-spark: #d2e823;
  --color-lavender-mist: #e9c0e9;
  --color-cobalt-band: #2665d6;
  --color-maroon-plate: #780016;
  --color-cobalt-deep: #061492;
  --color-forest-ink: #254f1a;
  --color-mustard-pop: #d6a337;
  --color-linen-canvas: #f3f3f1;
  --color-white-plate: #ffffff;
  --color-ink-black: #000000;
  --color-midnight-ink: #1e2330;
  --color-sage-mute: #676b5f;
  --color-silver-border: #c7c8cb;
  --color-charcoal-pill: #222222;
  --color-concrete-tile: #adadad;
  --color-leaf-wash: #ebffc5;
  --color-moss-tint: #e8efd6;

  /* Typography */
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-linksans: 'Linksans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-linksans-linksansvf: 'Linksans Linksansvf', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-yerk: 'yerk', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --tracking-caption: 0.12px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --tracking-body-sm: -0.28px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.16px;
  --text-body-lg: 18px;
  --leading-body-lg: 1.3;
  --tracking-body-lg: -0.36px;
  --text-subheading: 24px;
  --leading-subheading: 1.2;
  --tracking-subheading: -0.48px;
  --text-heading-sm: 28px;
  --leading-heading-sm: 1.07;
  --tracking-heading-sm: -0.67px;
  --text-heading: 51px;
  --leading-heading: 1.06;
  --tracking-heading: -2.19px;
  --text-display: 80px;
  --leading-display: 1;
  --tracking-display: -3.44px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-14: 14px;
  --spacing-16: 16px;
  --spacing-18: 18px;
  --spacing-20: 20px;
  --spacing-22: 22px;
  --spacing-24: 24px;
  --spacing-26: 26px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-65: 65px;
  --spacing-128: 128px;
  --spacing-216: 216px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-2xl: 16px;
  --radius-3xl: 29.09px;
  --radius-3xl-2: 32px;
  --radius-3xl-3: 41.6px;
  --radius-full: 64px;
  --radius-full-2: 99px;
  --radius-full-3: 1000px;
}
```
