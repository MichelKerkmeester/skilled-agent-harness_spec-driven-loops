# Cohere — Style Reference
> Editorial monograph on cream paper — every screen is a spread, not a dashboard.

**Theme:** light

Cohere reads as an editorial product monograph: a cream-white canvas, near-black typography, and pill-shaped dark CTAs carry the entire hierarchy without ornament. The signature is restraint — one tri-color gradient (coral → violet → blue) appears only inside photography and decorative washes, never on UI controls, so the interface stays monochrome while imagery supplies chromatic warmth. Typography does the heavy lifting: Unica77 at every UI role with tight negative tracking, and a wider CohereText display face for hero headlines, creating editorial authority rather than SaaS density. Components are minimal and confident — 22px rounded image cards, hairline #e5e7eb borders, dark filled actions — letting photography, code snippets, and copy carry the narrative weight.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Canvas White | `#ffffff` | `--color-canvas-white` | Primary page background, card surfaces, button text |
| Soft Cream | `#f0eee9` | `--color-soft-cream` | Subtle warm surface variant for alternating sections |
| Hairline Mist | `#e5e7eb` | `--color-hairline-mist` | Default borders, dividers, card outlines, input strokes |
| Silver Rule | `#d9d9dd` | `--color-silver-rule` | Secondary borders, nav dividers, subtle separators |
| Fog | `#93939f` | `--color-fog` | Muted body text, helper text, secondary labels |
| Slate Caption | `#75758a` | `--color-slate-caption` | Nav text, subdued annotations, breadcrumb-style labels |
| Graphite Body | `#616161` | `--color-graphite-body` | Tertiary body text, metadata, timestamps |
| Press Black | `#212121` | `--color-press-black` | Primary text, heading fill, icon stroke — the workhorse dark |
| Inkwell | `#17171c` | `--color-inkwell` | Dark surfaces, filled pill buttons, footer background, code panels |
| Charcoal Depth | `#2e2e2e` | `--color-charcoal-depth` | Deepest surface accent, overlay tint, code block background |
| Coral Glow | `linear-gradient(to right, #ff7759, #7670c5, #4c6ee6)` | `--color-coral-glow` | Decorative gradient stop — appears only in photography washes and ornamental highlights, never on UI controls |
| Iris Wash | `#7670c5` | `--color-iris-wash` | Decorative gradient midstop — transitional violet in the signature warm-to-cool sweep |
| Signal Blue | `#4c6ee6` | `--color-signal-blue` | Decorative gradient endpoint — cool terminal in the signature gradient, also a faint illustration accent |
| Lilac Mist | `#f0dff3` | `--color-lilac-mist` | Soft highlight wash, gradient surface tint for feature cards |
| Orchid | `#d18ee2` | `--color-orchid` | Mid-saturation accent in decorative washes and tag backgrounds |

## Tokens — Typography

### Unica77 — Primary UI and body typeface — weight 400 for body, captions, buttons, and nav; weight 700 for subheadings and card titles. The custom geometric-humanist forms give Cohere a distinctive editorial warmth that system sans-serifs cannot replicate. Letter-spacing -0.0100em across all sizes tightens the rhythm and keeps the display sizes from feeling airy. · `--font-unica77`
- **Substitute:** Inter, Söhne, or DM Sans
- **Weights:** 400, 700
- **Sizes:** 12, 14, 16, 18, 24, 32, 48
- **Line height:** 1.20, 1.30, 1.40, 1.50
- **Letter spacing:** -0.0100em
- **Role:** Primary UI and body typeface — weight 400 for body, captions, buttons, and nav; weight 700 for subheadings and card titles. The custom geometric-humanist forms give Cohere a distinctive editorial warmth that system sans-serifs cannot replicate. Letter-spacing -0.0100em across all sizes tightens the rhythm and keeps the display sizes from feeling airy.

### CohereText — Display-only face for the hero headline. Line-height locked at 1.00 and tracking at -0.0200em create a monumental, tightly-stacked wordmark presence — the first thing a visitor reads sits at this scale. Reserved exclusively for the largest statement on each page; never used below 48px. · `--font-coheretext`
- **Substitute:** GT Sectra Display or Tiempos Headline
- **Weights:** 400
- **Sizes:** 60, 72
- **Line height:** 1.00
- **Letter spacing:** -0.0200em
- **Role:** Display-only face for the hero headline. Line-height locked at 1.00 and tracking at -0.0200em create a monumental, tightly-stacked wordmark presence — the first thing a visitor reads sits at this scale. Reserved exclusively for the largest statement on each page; never used below 48px.

### CohereMono — Monospaced accent for version tags, code-like metadata, and micro-labels in the nav. The 8px size with 0.0200em tracking gives a technical, almost stamped quality that contrasts the editorial serif-adjacent primary face. · `--font-coheremono`
- **Substitute:** JetBrains Mono or IBM Plex Mono
- **Weights:** 400
- **Sizes:** 8, 14
- **Line height:** 1.40
- **Letter spacing:** 0.0200em
- **Role:** Monospaced accent for version tags, code-like metadata, and micro-labels in the nav. The 8px size with 0.0200em tracking gives a technical, almost stamped quality that contrasts the editorial serif-adjacent primary face.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.4 | -0.12px | `--text-caption` |
| body-sm | 14px | 1.4 | -0.14px | `--text-body-sm` |
| body | 16px | 1.5 | -0.16px | `--text-body` |
| subheading | 18px | 1.4 | -0.18px | `--text-subheading` |
| heading-sm | 24px | 1.3 | -0.24px | `--text-heading-sm` |
| heading | 32px | 1.3 | -0.32px | `--text-heading` |
| heading-lg | 48px | 1.2 | -0.48px | `--text-heading-lg` |
| display | 72px | 1 | -1.44px | `--text-display` |

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
| 56 | 56px | `--spacing-56` |
| 80 | 80px | `--spacing-80` |
| 128 | 128px | `--spacing-128` |
| 144 | 144px | `--spacing-144` |
| 160 | 160px | `--spacing-160` |
| 176 | 176px | `--spacing-176` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 9999px |
| cards | 22px |
| images | 22px |
| buttons | 9999px |
| small_ui | 4px |
| nav_elements | 8px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 24px
- **Element gap:** 16px

## Components

### Dark Pill Primary Button
**Role:** Primary action — the only filled button in the system

Filled #17171c pill at 9999px border-radius. White (#ffffff) Unica77 16px weight 400 text. Horizontal padding 24px, vertical padding 12px. No visible border, no shadow — the solid dark fill on white canvas is the entire visual signal. Single CTA instance per viewport region.

### Underline Text Link
**Role:** Secondary action / navigation affordance

Inherits text color #212121, Unica77 16px weight 400. 1px solid underline at #212121 offset 4px below baseline. No background, no border, no padding. Sits inline with body text or as a standalone secondary CTA beside the dark pill.

### Ghost Nav Button
**Role:** Tertiary nav-level action (e.g. 'Sign in')

Transparent background, #212121 Unica77 14px weight 400 text, no border, 8px vertical / 12px horizontal padding. Becomes a filled #17171c pill when converted to a CTA (see Dark Pill Primary Button).

### Feature Image Card
**Role:** Large media-forward content card used in product showcase sections

22px border-radius on all four corners. Full-bleed image or gradient wash filling the card; no visible border. Internal overlay panels (for code snippets or quotes) sit on #17171c with white text. Card-to-card gap: 16-24px.

### Outlined Content Card
**Role:** Compact card for feature lists, product specs, pricing tiers

White (#ffffff) surface, 1px solid #e5e7eb border, 22px border-radius. Internal padding 24-32px. Headings at Unica77 24px weight 700 #212121. No shadow — the hairline border is the only edge treatment.

### Top Navigation Bar
**Role:** Primary site navigation

White background, sits directly on canvas with no shadow or border. Logo left, nav links center, ghost button + dark pill right. Nav links at Unica77 14px weight 400 #212121 with 8px vertical / 16px horizontal padding and 8px border-radius on hover backgrounds. Vertically centered at ~64px height.

### Trust Logo Strip
**Role:** Social proof — 'Trusted by' brand row

Section heading in Unica77 16px weight 400 #212121 centered above. Brand logos rendered in monochrome #212121 on white, evenly distributed in a single row with 40-60px gaps. No card containers, no borders — logos float on the canvas.

### Feature Icon Block
**Role:** Three-up value proposition (Security / Deployment / Customization)

Stacked layout: thin-line icon at 48-64px in #212121 stroke, 16px gap to label below. Label in Unica77 18px weight 400 #212121. No background, no card, no border — the icon and label sit directly on the white canvas.

### Code Snippet Panel
**Role:** Embedded code or AI response preview within cards

Dark #17171c background, 12px border-radius, white #ffffff Unica77 14px text. Internal padding 16-24px. Often appears as an inset overlay on top of a larger image card.

### Footer Multi-Column
**Role:** Site-wide footer with link groups and newsletter

Dark #17171c background spanning full width. Column headers in white Unica77 16px weight 700 with a small arrow glyph. Link items in white Unica77 14px weight 400 with 12px vertical spacing. Newsletter input: transparent background, 1px solid white bottom border, white placeholder text, arrow submit icon. Social icons bottom-right as 20px monochrome white strokes.

### Newsletter Input
**Role:** Email capture in footer

Transparent background, no surrounding box. Single 1px solid #ffffff bottom border. Placeholder text 'Enter your email' at Unica77 14px weight 400 white. Submit arrow → icon to the right, 16px width, white stroke.

### Hero Headline
**Role:** Page-opening statement

CohereText weight 400 at 60-72px, line-height 1.00, letter-spacing -0.0200em, color #212121. Centered on the canvas. The tight stacking and display weight create a print-poster presence — no decoration, no underline, no color.

### Gradient Photography Wash
**Role:** Decorative hero image treatment

Full-bleed editorial photograph with a soft coral→violet→blue gradient overlay (linear-gradient to right, #ff7759 → #7670c5 → #4c6ee6). 22px border-radius when used as a contained card. Functions as brand expression, not interface.

## Do's and Don'ts

### Do
- Use Unica77 weight 400 for all body, nav, caption, and button text — reserve weight 700 for card titles and section labels only.
- Use 9999px border-radius for every button, tag, and pill-shaped control — Cohere's interface never uses sharp or moderately rounded buttons.
- Use 22px border-radius for every card, image, and content surface — this is the signature softness of the system.
- Center the hero headline at CohereText 60-72px / line-height 1.00 with -0.0200em tracking — never left-align the primary statement.
- Keep the chromatic gradient (coral → violet → blue) confined to photography washes and decorative overlays; UI controls stay monochrome.
- Use 1px solid #e5e7eb hairlines for all card and divider borders — never use drop shadows to separate surfaces.
- Maintain 80px vertical rhythm between major sections; cards within a section use 16-24px gaps.

### Don't
- Do not apply the signature gradient to buttons, links, or any interactive control — it belongs only in imagery.
- Do not use drop shadows on cards or panels — Cohere separates surfaces with hairline borders and background contrast, never elevation.
- Do not use colors from the gradient as text fills — #ff7759, #7670c5, and #4c6ee6 are never used for UI text or icons.
- Do not set type below 12px or above 72px — the system has no use for oversize or micro type.
- Do not use left-aligned hero headlines — Cohere's editorial voice requires centered display text.
- Do not introduce new border-radius values; use 4px for small UI, 8px for nav elements, 22px for cards, 9999px for pills — that's the complete set.
- Do not use a colored CTA button — the primary action is always #17171c fill with white text; secondary actions are underline links.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Canvas | `#ffffff` | Base page background, the default surface for all content |
| 2 | Warm Cream | `#f0eee9` | Alternate section background for visual separation without contrast |
| 3 | Lilac Wash | `#f0dff3` | Soft chromatic surface for feature cards and decorative blocks |
| 4 | Code Panel | `#17171c` | Dark inset surface for code snippets, AI response previews, and the dark pill button |
| 5 | Footer | `#17171c` | Full-bleed dark surface for site footer |

## Elevation

Cohere deliberately avoids drop shadows as a separation mechanism. Surface hierarchy is communicated through background color shifts (white → cream → lilac → ink) and 1px hairline borders at #e5e7eb. The only dark surface that 'elevates' visually is the #17171c code panel or button, which achieves prominence through tonal contrast rather than shadow.

## Imagery

Photography is editorial and human — full-bleed lifestyle shots of people in workspaces, a woman in a green silk blouse at a laptop, intimate product close-ups. Images are treated with a soft chromatic gradient wash (coral → violet → blue) that bleeds across the surface, giving every photograph a Cohere-specific warmth. Cards use 22px rounding and often contain dark code panels or AI response overlays inset on top of the image. No flat illustration system — the brand relies on photography and typographic emphasis rather than drawn graphics. Icons are minimal thin-line strokes, monochrome, 1.5px weight.

## Layout

Max-width ~1200px centered, with full-bleed sections alternating between white and cream backgrounds. Hero is centered text stack: display headline → subtitle → primary pill + underline link, with no hero image. Below the hero, a two-column image card row (product screenshot left, lifestyle photo right) with 16-24px gap. Trust logo strip follows as a single centered row. Feature section uses a 3-column icon block layout (Security / Deployment / Customization). Footer is a full-bleed dark band with a 5-column link grid plus a newsletter column on the left. Navigation is a minimal top bar — logo left, centered links, ghost button + dark pill right. Vertical rhythm uses 80px between major sections, 24-32px card padding internally.

## Agent Prompt Guide

Quick Color Reference:
- text: #212121
- background: #ffffff
- border: #e5e7eb
- accent: #ff7759 (decorative gradient only, not for UI)
- primary action: no distinct CTA color

Example Component Prompts:
No distinct primary action color was observed; use the extracted neutral button treatments instead of inventing a filled CTA color.
2. Create a hero headline: centered on white canvas, CohereText 72px weight 400, color #212121, line-height 1.00, letter-spacing -1.44px. One statement, no decoration.
3. Create a feature image card: 22px border-radius, full-bleed photograph, dark #17171c code panel inset at 24px padding with white 14px Unica77 text, 12px border-radius on the code panel.
4. Create an outlined content card: white background, 1px solid #e5e7eb border, 22px border-radius, 32px internal padding, heading in Unica77 24px weight 700 #212121, body in Unica77 16px weight 400 #212121.
5. Create a top navigation bar: white background, no border, logo at left, three nav links centered in Unica77 14px #212121 with 8px vertical padding, ghost 'Sign in' button and a #17171c dark pill 'Request a demo' button on the right.

## Gradient System

Cohere has exactly one signature gradient: linear-gradient(to right, #ff7759, #7670c5, #4c6ee6). It appears only as an overlay on photography and as a faint background wash on ornamental sections. The gradient flows warm-to-cool (coral → violet → blue) and is never used on interactive elements. A second decorative variant applies the same stops at 78° for diagonal compositions. Keep this gradient as a brand expression, not a UI accent.

## Monochrome Discipline

The interface is 99% achromatic. The five chromatic colors detected (#f0dff3, #d18ee2, #4c6ee6, #ff7759, and the mid violet) all appear in nav-adjacent or illustration contexts with very low frequency. The design rule is absolute: no chromatic color touches any text, button, border, or icon. Color exists in Cohere's world as photographic atmosphere, not as interface signal.

## Similar Brands

- **Linear** — Same minimalist monochrome interface with a single custom typeface and pill-shaped dark CTAs on white canvases
- **Anthropic** — Similar editorial approach to an AI brand — restrained palette, large display headlines, hairline borders, and photography-driven hero sections
- **Notion** — Shared pill-button geometry and the practice of letting a soft cream or warm-gray surface variant create section breaks without heavy contrast
- **Vercel** — Same monospaced micro-type accent, hairline #e5e7eb borders, and dark filled button as the only primary action
- **Stripe** — Similar gradient-as-illustration philosophy — chromatic color confined to decorative washes and imagery, never on functional UI

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-canvas-white: #ffffff;
  --color-soft-cream: #f0eee9;
  --color-hairline-mist: #e5e7eb;
  --color-silver-rule: #d9d9dd;
  --color-fog: #93939f;
  --color-slate-caption: #75758a;
  --color-graphite-body: #616161;
  --color-press-black: #212121;
  --color-inkwell: #17171c;
  --color-charcoal-depth: #2e2e2e;
  --color-coral-glow: #ff7759;
  --gradient-coral-glow: linear-gradient(to right, #ff7759, #7670c5, #4c6ee6);
  --color-iris-wash: #7670c5;
  --color-signal-blue: #4c6ee6;
  --color-lilac-mist: #f0dff3;
  --color-orchid: #d18ee2;

  /* Typography — Font Families */
  --font-unica77: 'Unica77', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-coheretext: 'CohereText', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-coheremono: 'CohereMono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.4;
  --tracking-caption: -0.12px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.4;
  --tracking-body-sm: -0.14px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.16px;
  --text-subheading: 18px;
  --leading-subheading: 1.4;
  --tracking-subheading: -0.18px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.3;
  --tracking-heading-sm: -0.24px;
  --text-heading: 32px;
  --leading-heading: 1.3;
  --tracking-heading: -0.32px;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.2;
  --tracking-heading-lg: -0.48px;
  --text-display: 72px;
  --leading-display: 1;
  --tracking-display: -1.44px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 8px;
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-56: 56px;
  --spacing-80: 80px;
  --spacing-128: 128px;
  --spacing-144: 144px;
  --spacing-160: 160px;
  --spacing-176: 176px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 24px;
  --element-gap: 16px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 22px;
  --radius-full: 9999px;

  /* Named Radii */
  --radius-tags: 9999px;
  --radius-cards: 22px;
  --radius-images: 22px;
  --radius-buttons: 9999px;
  --radius-smallui: 4px;
  --radius-navelements: 8px;

  /* Surfaces */
  --surface-canvas: #ffffff;
  --surface-warm-cream: #f0eee9;
  --surface-lilac-wash: #f0dff3;
  --surface-code-panel: #17171c;
  --surface-footer: #17171c;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-canvas-white: #ffffff;
  --color-soft-cream: #f0eee9;
  --color-hairline-mist: #e5e7eb;
  --color-silver-rule: #d9d9dd;
  --color-fog: #93939f;
  --color-slate-caption: #75758a;
  --color-graphite-body: #616161;
  --color-press-black: #212121;
  --color-inkwell: #17171c;
  --color-charcoal-depth: #2e2e2e;
  --color-coral-glow: #ff7759;
  --color-iris-wash: #7670c5;
  --color-signal-blue: #4c6ee6;
  --color-lilac-mist: #f0dff3;
  --color-orchid: #d18ee2;

  /* Typography */
  --font-unica77: 'Unica77', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-coheretext: 'CohereText', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-coheremono: 'CohereMono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.4;
  --tracking-caption: -0.12px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.4;
  --tracking-body-sm: -0.14px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.16px;
  --text-subheading: 18px;
  --leading-subheading: 1.4;
  --tracking-subheading: -0.18px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.3;
  --tracking-heading-sm: -0.24px;
  --text-heading: 32px;
  --leading-heading: 1.3;
  --tracking-heading: -0.32px;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.2;
  --tracking-heading-lg: -0.48px;
  --text-display: 72px;
  --leading-display: 1;
  --tracking-display: -1.44px;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-56: 56px;
  --spacing-80: 80px;
  --spacing-128: 128px;
  --spacing-144: 144px;
  --spacing-160: 160px;
  --spacing-176: 176px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 22px;
  --radius-full: 9999px;
}
```
