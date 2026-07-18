# Zelt — Style Reference
> Amber on raw linen — the single honey accent glows against warm cream and near-black ink, as if sunlight fell across a paper spread.

**Theme:** light

Zelt is a warm, editorial HR platform rendered in the register of a sunlit reading room rather than a cold enterprise dashboard. Its entire visual system rests on a cream-and-charcoal monochrome — page canvas, cards, dividers, and typography all live in desaturated warm neutrals — while a single honey-amber accent (#ffcd6d) punctuates the interface at decision points: the demo button, the get-started button, the webinar banner. Components are pill-shaped and weightless, surfaces are flat with hairline borders, and display type is set in a confident geometric sans with aggressively tight tracking. The result feels closer to a magazine spread or a design studio's landing page than to typical HR/IT software, and that warmth is the entire brand.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Ink | `#121718` | `--color-ink` | Primary text, icon strokes, hairline borders, default link text — near-black with a barely-warm cast that harmonizes with the cream canvas rather than fighting it |
| Paper | `#ffffff` | `--color-paper` | Elevated card surfaces, button text on amber, icon fills — the brightest stop in the stack, used sparingly to lift content above the cream canvas |
| Linen | `#f6f3ef` | `--color-linen` | Card backgrounds, soft surface fill, inset panels — the warm off-white that sits one step above the page canvas |
| Parchment | `#e4e0dd` | `--color-parchment` | Page canvas, outer body background — the warm light gray that gives the entire interface its sunlit quality |
| Graphite | `#2f2f2f` | `--color-graphite` | Dark surface fill for inverted cards, footer band, contrast blocks — darker than Ink so it reads as a deliberate charcoal panel |
| Slate | `#444444` | `--color-slate` | Secondary neutral action background, muted utility surfaces — sits between Ink and the canvas for low-emphasis interactive fills |
| Honey | `#ffcd6d` | `--color-honey` | Primary action fill for the demo and get-started buttons, key brand moments — the single saturated color in the system, reserved for decisions that move the user forward |
| Apricot | `#ffe2aa` | `--color-apricot` | Yellow wash for highlight backgrounds, decorative bands, and soft emphasis behind content. Do not promote it to the primary CTA color |

## Tokens — Typography

### sans-serif (system) — Full type system — weight 500/700 at 76–101px with tracking as tight as -0.043em gives headlines a quiet authority without resorting to a serif; weight 400 at 16–18px handles body; the huge size range (8px → 101px) is editorial in proportion, not product-UI proportions · `--font-sans-serif-system`
- **Substitute:** Inter
- **Weights:** 300, 400, 500, 700
- **Sizes:** 8px, 12px, 13px, 14px, 15px, 16px, 17px, 18px, 23px, 24px, 29px, 32px, 43px, 58px, 76px, 86px, 101px
- **Line height:** 0.95, 1.00, 1.02, 1.15, 1.16, 1.20, 1.24, 1.35, 1.40, 1.60, 2.63
- **Letter spacing:** -4.34px at 101px, -3.18px at 86px, -2.28px at 76px, -1.45px at 58px, -0.86px at 43px, -0.38px at 32px, -0.29px at 29px, -0.17px at 24px, -0.05px at 18px, 0 at 16px and below
- **OpenType features:** `"ss01" on, "cv11" on`
- **Role:** Full type system — weight 500/700 at 76–101px with tracking as tight as -0.043em gives headlines a quiet authority without resorting to a serif; weight 400 at 16–18px handles body; the huge size range (8px → 101px) is editorial in proportion, not product-UI proportions

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.4 | -0.03px | `--text-caption` |
| body-sm | 14px | 1.35 | -0.05px | `--text-body-sm` |
| body | 16px | 1.4 | -0.05px | `--text-body` |
| subheading | 18px | 1.35 | -0.05px | `--text-subheading` |
| heading-sm | 24px | 1.24 | -0.17px | `--text-heading-sm` |
| heading | 32px | 1.2 | -0.38px | `--text-heading` |
| heading-lg | 43px | 1.16 | -0.86px | `--text-heading-lg` |
| display | 76px | 1.02 | -2.28px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** spacious

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 8 | 8px | `--spacing-8` |
| 12 | 12px | `--spacing-12` |
| 16 | 16px | `--spacing-16` |
| 32 | 32px | `--spacing-32` |
| 36 | 36px | `--spacing-36` |
| 72 | 72px | `--spacing-72` |
| 144 | 144px | `--spacing-144` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 12px |
| tags | 12px |
| tiny | 4px |
| cards | 12px |
| small | 8px |
| buttons | 12px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 24-32px
- **Element gap:** 12-16px

## Components

### Primary Action Button
**Role:** Highest-emphasis call-to-action across the marketing site

Filled Honey (#ffcd6d) with Ink text at 16px weight 500, 12px border-radius, 16px vertical / 24px horizontal padding. No border, no shadow, no hover state beyond a subtle darken. The rounded pill silhouette and warm fill are the signature interactive moment in the system.

### Secondary Ghost Button
**Role:** Lower-emphasis action or link-style button

Transparent fill with a 1px Ink border, Ink text at 16px weight 500, 12px radius, 12px / 20px padding. Used for secondary paths like 'Login' or alternative actions where the warm CTA would compete for too much attention.

### Pill Tag / Badge
**Role:** Status pill and category labels

Apricot (#ffe2aa) background with Ink text at 13px weight 500, 12px radius, 4px / 12px padding. Carries the brand warmth into metadata without the commitment of the full Honey button. Used for the 'Latest Webinar' label.

### Top Notification Bar
**Role:** Site-wide announcement strip across the top of every page

Full-width Apricot (#ffe2aa) band, 40–48px tall, centered content with a pill-shaped Apricot tag on the left and a small Ink close icon on the right. Sets the warm tone of the entire experience before the navigation even loads.

### Floating Navigation Bar
**Role:** Primary site navigation

White surface floating over the canvas with a 12px radius and a single 1px hairline Ink border (8% opacity). Logo on the left, link group centered, and a Honey 'See demo' button anchored on the right. 56–64px tall, never shadows, never elevates — it just sits.

### Nav Link
**Role:** Individual navigation item

Ink text at 15px weight 400, 12px radius hover background of Parchment (#e4e0dd), no underline. Hover is a gentle surface lift, not a color change.

### Hero Headline Block
**Role:** Above-the-fold primary message

Centered stack: display-weight headline at 76–86px, Ink, weight 500, tracking -0.030em, line-height 1.02. Subtitle directly below at 18px weight 400, Ink, 24px gap. Single Honey primary button below the subtitle. The headline is the hero — no hero image competes with it.

### Card Surface (Light)
**Role:** Content container for features, pricing tiers, and grouped information

White (#ffffff) or Linen (#f6f3ef) fill, 12px radius, 1px Ink border at low opacity, 24–32px internal padding, no shadow. The hairline border does all the delineation work; elevation is never used.

### Card Surface (Dark)
**Role:** Inverted card for contrast sections and the footer

Graphite (#2f2f2f) fill, 12px radius, 32px internal padding, Paper text. Used sparingly — typically one dark band per page to break the warm rhythm.

### Scroll Indicator
**Role:** Floating affordance hinting at more content below the fold

Small circular Paper button (40px) with a 1px Ink hairline border and a 16px down-arrow icon in Ink. Fixed bottom-left, 24px from the edge. Subtle, never animated aggressively.

### Icon
**Role:** All UI iconography throughout the system

Outlined 1.5px stroke, Ink color, 16–24px size, no fill, no multicolor. Monochrome outlines that read as line drawings, matching the editorial tone of the typography.

### Close / Dismiss Icon
**Role:** Remove affordance for banners, modals, toasts

Simple X glyph in Ink, 16px, inside a 32px transparent hit area. Sits at the far edge of notification bars and modal headers.

## Do's and Don'ts

### Do
- Use Honey (#ffcd6d) for exactly one element per viewport — the primary action — and nothing else.
- Set all interactive surfaces (buttons, nav, tags, cards) to a 12px border-radius; the pill silhouette is the system signature.
- Pair weight 500/700 with sizes 58px and above, and apply tracking as tight as -0.043em — the headlines earn their weight through restraint, not volume.
- Keep page canvas at Parchment (#e4e0dd) and lift content with White or Linen cards using 1px Ink hairline borders at low opacity; never use drop shadows for elevation.
- Center hero blocks with a single 76–86px headline, an 18px subtitle, and a single Honey button — no hero imagery competes with the type.
- Use Apricot (#ffe2aa) for ambient warmth (notification bar, soft tags) and Honey (#ffcd6d) only for action — the two ambers have distinct jobs.
- Maintain 80px section gaps and let the cream canvas breathe; the spaciousness is the brand as much as the color is.

### Don't
- Don't introduce a second saturated color — the system is monochrome warm with one amber accent, and any second hue breaks the spell.
- Don't apply drop shadows to cards, buttons, or nav — delineation is done with hairline 1px borders and surface fill alone.
- Don't set headlines below weight 500 at display sizes; the tight tracking only reads as confident when paired with sufficient weight.
- Don't round corners below 8px on interactive elements and below 12px on cards/buttons — sharp corners fight the pill-shaped language.
- Don't use blue, purple, or any cool hue for links, icons, or accents; all chromatic energy comes from the warm amber family.
- Don't fill large surfaces with Honey — the accent loses its meaning when it covers anything bigger than a button.
- Don't set body text below 16px or above 18px — the system is editorial in proportion, not dense data-UI proportions.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Parchment Canvas | `#e4e0dd` | Outer page background — the warm gray the entire site sits on |
| 2 | Linen Card | `#f6f3ef` | Soft elevated surface for inline cards and grouped content |
| 3 | Paper Card | `#ffffff` | Highest-lift surface for prominent cards and the floating nav |
| 4 | Apricot Wash | `#ffe2aa` | Warm tint for notification bars and decorative bands |
| 5 | Graphite Panel | `#2f2f2f` | Inverted dark surface for contrast sections and footer |

## Elevation

Zelt deliberately avoids drop shadows. All elevation is communicated through surface fill progression (Parchment → Linen → Paper) combined with 1px hairline Ink borders at reduced opacity. This keeps the interface flat, editorial, and paper-like, which is the core of the warm-aesthetic. The absence of shadow is not a missing feature — it is a defining choice.

## Imagery

Zelt's visual language is overwhelmingly type-driven, not image-driven. The hero is pure typography on a warm cream canvas with no supporting photograph or illustration. Decorative elements appear to lean toward soft 3D abstract objects (a partial white sphere is visible at the fold), suggesting a restrained library of matte, neutral 3D renders rather than lifestyle photography. Iconography is strictly outlined monochrome at 1.5px stroke, reading as line drawings rather than filled glyphs. The ratio of type to imagery is heavily skewed toward type — the warm palette and editorial typography carry the entire visual experience without photographic support.

## Layout

Page model is centered, max-width contained at approximately 1200px, with the Parchment canvas extending full-bleed behind the content column. The hero pattern is a centered single-column text stack: display-weight headline, subtitle, single primary button — no split image/text, no full-bleed background image. Section rhythm flows as seamless warm bands with generous 80px vertical gaps rather than alternating light/dark blocks, though single dark Graphite sections are inserted occasionally for contrast. Content arrangement favors centered stacks and symmetric card grids over asymmetric or z-pattern layouts. Navigation is a floating pill-shaped bar (12px radius, white surface, hairline border) that hovers above the canvas rather than anchoring to the viewport edge. Density is spacious throughout — the cream canvas breathes between sections, and cards never feel crowded.

## Agent Prompt Guide

Quick Color Reference:
• text: #121718 (Ink)
• background: #e4e0dd (Parchment canvas)
• card surface: #ffffff (Paper) or #f6f3ef (Linen)
• border: #121718 at ~8% opacity (1px hairline)
• accent: #ffcd6d (Honey) / #ffe2aa (Apricot)
• primary action: no distinct CTA color

Example Component Prompts:

No distinct primary action color was observed; use the extracted neutral button treatments instead of inventing a filled CTA color.

2. Floating nav: White (#ffffff) surface, 12px radius, 1px #121718 border at 8% opacity, 60px tall, centered horizontally, no shadow. Logo text 'zelt' at 18px weight 700 in #121718 on the left. Nav links at 15px weight 400 in #121718 centered. Primary 'See demo' button on the right: #ffcd6d fill, #121718 text, 12px radius, 8px 20px padding.

3. Feature card: White (#ffffff) background, 12px radius, 1px #121718 border at 8% opacity, 32px padding. Heading at 24px weight 500, #121718, letter-spacing -0.17px. Body text at 16px weight 400, #121718, 16px top margin.

4. Top notification bar: Full-width #ffe2aa band, 44px tall, centered content. Left side: small pill tag with #ffe2aa fill (slightly darker), #121718 text at 13px weight 500, 4px 12px padding, 12px radius. Center: announcement text at 14px weight 400 in #121718. Right: 16px X icon in #121718.

5. Dark contrast section: #2f2f2f background, full-width band, 80px vertical padding. White (#ffffff) text, display headline at 58px weight 500 with letter-spacing -1.45px. Content centered, max-width 1200px.

## Similar Brands

- **Notion** — Same warm cream canvas, generous whitespace, and editorial typography that feels more like a reading experience than enterprise software
- **Mercury** — Same approach of a single warm accent against monochrome neutral surfaces, with pill-shaped buttons and tight-tracked display type
- **Pitch** — Same spacious centered layouts, hairline-bordered floating surfaces, and the confidence to let oversized type carry the page without imagery
- **Linear** — Same clean geometric sans with aggressive negative tracking on display sizes, and the same flat-surface-plus-hairline-border approach to elevation
- **Loom** — Same approachable enterprise tone — warm palette, rounded interactive elements, and the willingness to break from the cold blue/gray SaaS convention

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-ink: #121718;
  --color-paper: #ffffff;
  --color-linen: #f6f3ef;
  --color-parchment: #e4e0dd;
  --color-graphite: #2f2f2f;
  --color-slate: #444444;
  --color-honey: #ffcd6d;
  --color-apricot: #ffe2aa;

  /* Typography — Font Families */
  --font-sans-serif-system: 'sans-serif (system)', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.4;
  --tracking-caption: -0.03px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.35;
  --tracking-body-sm: -0.05px;
  --text-body: 16px;
  --leading-body: 1.4;
  --tracking-body: -0.05px;
  --text-subheading: 18px;
  --leading-subheading: 1.35;
  --tracking-subheading: -0.05px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.24;
  --tracking-heading-sm: -0.17px;
  --text-heading: 32px;
  --leading-heading: 1.2;
  --tracking-heading: -0.38px;
  --text-heading-lg: 43px;
  --leading-heading-lg: 1.16;
  --tracking-heading-lg: -0.86px;
  --text-display: 76px;
  --leading-display: 1.02;
  --tracking-display: -2.28px;

  /* Typography — Weights */
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-32: 32px;
  --spacing-36: 36px;
  --spacing-72: 72px;
  --spacing-144: 144px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 24-32px;
  --element-gap: 12-16px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;

  /* Named Radii */
  --radius-nav: 12px;
  --radius-tags: 12px;
  --radius-tiny: 4px;
  --radius-cards: 12px;
  --radius-small: 8px;
  --radius-buttons: 12px;

  /* Surfaces */
  --surface-parchment-canvas: #e4e0dd;
  --surface-linen-card: #f6f3ef;
  --surface-paper-card: #ffffff;
  --surface-apricot-wash: #ffe2aa;
  --surface-graphite-panel: #2f2f2f;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-ink: #121718;
  --color-paper: #ffffff;
  --color-linen: #f6f3ef;
  --color-parchment: #e4e0dd;
  --color-graphite: #2f2f2f;
  --color-slate: #444444;
  --color-honey: #ffcd6d;
  --color-apricot: #ffe2aa;

  /* Typography */
  --font-sans-serif-system: 'sans-serif (system)', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.4;
  --tracking-caption: -0.03px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.35;
  --tracking-body-sm: -0.05px;
  --text-body: 16px;
  --leading-body: 1.4;
  --tracking-body: -0.05px;
  --text-subheading: 18px;
  --leading-subheading: 1.35;
  --tracking-subheading: -0.05px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.24;
  --tracking-heading-sm: -0.17px;
  --text-heading: 32px;
  --leading-heading: 1.2;
  --tracking-heading: -0.38px;
  --text-heading-lg: 43px;
  --leading-heading-lg: 1.16;
  --tracking-heading-lg: -0.86px;
  --text-display: 76px;
  --leading-display: 1.02;
  --tracking-display: -2.28px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-32: 32px;
  --spacing-36: 36px;
  --spacing-72: 72px;
  --spacing-144: 144px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;
}
```
