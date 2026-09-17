# Yllw — Style Reference
> Swiss-Bauhaus print monograph. Think oversized Grotesk on warm putty paper, hairline rules, no shadows — architecture rendered as typography.

**Theme:** light

Yllw is an editorial workspace brand: a single variable font pressed into monumental display sizes, a near-grayscale palette anchored by one warm putty neutral, and borders drawn with 1px inset strokes instead of shadows. The page reads like a Swiss-Bauhaus print artifact dropped onto a web canvas — oversized uppercase headlines (often 90–216px) with line-heights pulled tight to 0.88, a dominant putty-stone hue (#cac7b4) that functions simultaneously as canvas, button, and border, and a single signal-yellow announcement bar that acts as the only chromatic punctuation. Components are deliberately raw: 2px corners, hairline rules, no decorative gradients, no elevation depth — every surface is defined by adjacency, not by shadow. New screens should feel like pages from the same printed monograph, not like a product UI.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Putty Stone | `#cac7b4` | `--color-putty-stone` | Light neutral action fill for buttons on dark surfaces. |
| Signal Yellow | `#ffdd00` | `--color-signal-yellow` | Top announcement bar background, occasional highlight — the only fully saturated color in the system, reserved for time-sensitive messaging and high-visibility callouts |
| Ink | `#000000` | `--color-ink` | Primary text, icon strokes, primary borders — the maximum-contrast foreground that does 90% of the typographic and structural work |
| Paper | `#ffffff` | `--color-paper` | Inverse surface, card backgrounds on darker sections, button text on filled putty buttons, hairline border against putty canvas |
| Carbon | `#191919` | `--color-carbon` | Secondary dark surface for feature sections and inverted blocks — softer than pure ink, used where a dark band needs to feel like printed stock rather than a screen |
| Smoke | `#cccccc` | `--color-smoke` | Disabled and divider strokes on light surfaces — a third neutral tier between ink and putty for de-emphasized rules |

## Tokens — Typography

### Gd Grio Vf — Single variable font covering everything from 13px captions to 216px hero display. Used universally for headings, body, nav, buttons, badges, cards, and footers. The signature choice is weight 500–600 at 116–216px with line-height compressed to 0.88–0.96 — type that crowds itself like a printed headline slab, not like UI text. · `--font-gd-grio-vf`
- **Substitute:** Inter Variable (variable axis) or Söhne (non-free)
- **Weights:** 400, 500, 600, 700
- **Sizes:** 13, 14, 16, 18, 20, 26, 36, 40, 44, 64, 90, 97, 116, 166, 216
- **Line height:** 0.88, 0.90, 0.96, 1.00, 1.04, 1.18, 1.24, 1.28, 1.50
- **Letter spacing:** -0.025em at 216px (≈-5.4px), -0.020em at 166px (≈-3.32px), -0.015em at 116px (≈-1.74px), -0.010em at 64px (≈-0.64px), -0.008em at 40px (≈-0.32px), -0.006em at 26px (≈-0.156px), -0.005em at 16px (≈-0.08px)
- **OpenType features:** `Inherits variable font axes; no explicit OpenType feature overrides detected`
- **Role:** Single variable font covering everything from 13px captions to 216px hero display. Used universally for headings, body, nav, buttons, badges, cards, and footers. The signature choice is weight 500–600 at 116–216px with line-height compressed to 0.88–0.96 — type that crowds itself like a printed headline slab, not like UI text.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 13px | 1.28 | -0.08px | `--text-caption` |
| body | 16px | 1.5 | -0.08px | `--text-body` |
| subheading | 18px | 1.28 | — | `--text-subheading` |
| heading-sm | 20px | 1.24 | — | `--text-heading-sm` |
| heading | 26px | 1.18 | -0.156px | `--text-heading` |
| heading-xl | 44px | 1 | — | `--text-heading-xl` |
| display-sm | 64px | 0.96 | -0.64px | `--text-display-sm` |
| display | 97px | 0.9 | -1.455px | `--text-display` |
| display-lg | 166px | 0.88 | -3.32px | `--text-display-lg` |
| display-xl | 216px | 0.88 | -5.4px | `--text-display-xl` |

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
| 80 | 80px | `--spacing-80` |
| 96 | 96px | `--spacing-96` |
| 128 | 128px | `--spacing-128` |
| 160 | 160px | `--spacing-160` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 2px |
| tags | 2px |
| cards | 6px |
| badges | 2px |
| buttons | 2px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| subtle | `rgb(0, 0, 0) 0px 0px 0px 1px inset` | `--shadow-subtle` |
| subtle-2 | `rgb(255, 255, 255) 0px 0px 0px 1px inset` | `--shadow-subtle-2` |
| subtle-3 | `rgb(255, 255, 255) 0px 0px 0px 1px` | `--shadow-subtle-3` |

### Layout

- **Page max-width:** 1400px
- **Section gap:** 64-96px
- **Card padding:** 24-32px
- **Element gap:** 16-24px

## Components

### Announcement Bar
**Role:** Site-wide top strip for time-sensitive messaging

Full-bleed #ffdd00 (Signal Yellow) bar, 32–40px tall. Text in Gd Grio Vf 13–14px, weight 500, #000000, centered. No padding inside the colored zone beyond the line-height. Optional flag icon and language switcher sit at the far right with 8px gap. Serves as the only chromatic punctuation across the entire site.

### Primary Navigation
**Role:** Sticky top nav with logo, grouped links, and CTA

Sits on #cac7b4 (Putty Stone) canvas. Logo mark on the left ('YLLW' wordmark in Gd Grio Vf 16px, weight 700, uppercase, letter-spacing tight). Two link groups flanking center: left group (Services, Interior, Subscription, YLLW Factory) and right group (Projects, Customer Segments), separated by ~200px of whitespace. Far right: text links (About Us, Contact) then a 2px-radius filled button (#cac7b4 background, #000000 border inset 1px, 16px 20px padding, 14px weight 500). Total nav height ~56px.

### Primary CTA Button (Putty Filled)
**Role:** The default action — booking a meeting, subscribing, confirming

Background #cac7b4, text #000000, 2px border-radius, 1px inset #000000 stroke. Padding 12px 20px. Gd Grio Vf 14px, weight 500, negative letter-spacing. No hover state beyond a subtle background shift toward #b8b5a3. This is the only 'action color' in the system — it is deliberately muted so it never competes with the display typography.

### Secondary Button (White Outlined)
**Role:** Companion to the primary, used for 'See our subscription solutions' style actions

Background #ffffff, text #000000, 2px border-radius, 1px inset #000000 stroke. Same padding (12px 20px) and 14px weight 500 type as the primary. Sits on putty canvas where the filled button would disappear into the background.

### Ghost Text Link
**Role:** Inline navigation, 'About Us', 'Contact', section-level links

No background, no border. Gd Grio Vf 14px, weight 500, #000000, underline only on hover. 8–12px horizontal spacing from adjacent links. The absence of chrome is deliberate — links exist as type first, controls second.

### Hero Display Headline
**Role:** Opening page statement, full viewport width

Gd Grio Vf at 116–216px, weight 500, uppercase, line-height 0.88, letter-spacing tightened to -0.015em to -0.025em. Color #000000 on #cac7b4 canvas. Text breaks across 2 lines with a visual element (image or graphic) embedded inline between the words — the 'SPACES' and 'GROWTH' halves are separated by a photograph. The line-height compression makes the two-line block occupy roughly the same vertical space as one would expect from a single line — it is a slab, not a paragraph.

### Section Heading (Mid Display)
**Role:** Interior section titles like 'SUBSCRIPTION', 'FOUR STEPS, A CLEAR PROCESS'

Gd Grio Vf 40–64px, weight 500–600, uppercase, line-height 0.96, letter-spacing -0.01em. Color #ffffff when overlaid on putty/photographic backgrounds, #000000 on putty canvas. Sits with generous 48–64px top padding above.

### Service Accordion Row
**Role:** Expandable service list in the 'Four Steps' section

Full-width row on #ffffff surface with 1px #000000 hairline at top and bottom. Left column: short descriptor in Gd Grio Vf 14px weight 400 #000000 (e.g. 'Flexible office solutions'). Right column: service name in Gd Grio Vf 20–26px weight 500 uppercase #000000 (e.g. 'SUBSCRIPTION'). Far right: a '+' glyph at 18px for expand state, rotating to '−' when open. Row height ~64–80px, 24px horizontal padding. No card background, no shadow — the hairline rule does the grouping.

### Carousel Slide (Overlay Card)
**Role:** Hero-level feature panels with overlaid title and copy

Full-width band, ~480–600px tall, background either a desaturated photograph (e.g. an architectural floor plan) or the putty canvas. Title text in #ffffff Gd Grio Vf 64–90px uppercase weight 500 sits center-left with 48px padding. Body copy in #ffffff 16px weight 400, max-width 480px, sits below the title. Navigation arrows (← →) are 40×40px boxes with 1px inset white border, 2px radius, at the bottom-left. Two button variants sit to the right of the body copy: a 'See solutions' secondary button and a 'Book a meeting' primary button.

### Info Card (Putty Surface)
**Role:** Compact content blocks for stats, highlights, or feature snippets

Background #cac7b4, 6px border-radius, 1px #000000 hairline. Padding 24–32px. Optional 1px inset white stroke for cards sitting on darker sections. No shadow. Headline at 26–36px weight 600, supporting text at 14–16px weight 400. The 6px radius is the only place a non-2px corner appears — it is reserved for this card type to give it slight softness without breaking the system's sharp character.

### Image Tile (Inline Hero Photo)
**Role:** Photograph embedded between hero headline words

Raw rectangular image, no border-radius, no border, no caption. Sits inline within the text flow, sized to roughly match the x-height of the display headline it interrupts. Treatment is documentary, not decorative — straight crops, no overlays, no rounded corners.

### Language Switcher
**Role:** Locale toggle in the announcement bar

Compact control with a small flag glyph (24×16px, no border-radius), 8px gap, then 'EN' in Gd Grio Vf 13px weight 500 #000000 with a 2px-tall chevron glyph. Sits at the far right of the announcement bar.

## Do's and Don'ts

### Do
- Set every page background to #cac7b4 (Putty Stone) unless the section is explicitly inverted — this color is the system's structural identity, not just a surface choice.
- Use Gd Grio Vf for everything, including UI labels and buttons — mixing in a secondary typeface breaks the editorial coherence.
- Pull display line-height to 0.88–0.96 at 64px+ — the tight leading is what makes the headlines feel architectural rather than typographic.
- Define cards and buttons with 1px inset strokes in #000000 or #ffffff, never with drop shadows — shadows do not exist in this system.
- Keep the primary CTA to #cac7b4 background with #000000 text — it is deliberately muted so the display type can do the visual heavy lifting.
- Reserve #ffdd00 (Signal Yellow) exclusively for the announcement bar and one-off high-urgency callouts; using it in the body collapses the hierarchy.
- Apply 2px border-radius to all buttons, tags, badges, and nav controls — 6px is reserved for content cards only.

### Don't
- Don't introduce drop shadows, blur, or glow effects — the system rejects all forms of depth-via-blur.
- Don't add a second saturated accent color (orange, red, blue) — yellow is the only chromatic voice, and adding another would break the editorial restraint.
- Don't round corners above 6px — anything softer than that feels like a different product (consumer app, not monograph).
- Don't use line-height above 1.0 for display sizes — loose leading on 100px+ type reads as a blog post, not a poster.
- Don't apply positive letter-spacing to large type — the negative tracking at 64px+ is what gives the headlines their compressed, slab-like weight.
- Don't place black buttons on putty canvas — use white-filled secondary buttons for contrast, not inverted primaries.
- Don't use gradients, duotones, or color overlays on photography — the floor plan and people shots in the hero are unprocessed.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Putty Canvas | `#cac7b4` | Default page background and dominant neutral plane — sets the warm, paper-like tone across the site |
| 1 | Paper Card | `#ffffff` | Lifted card surface that sits on top of the putty canvas for contrast |
| 2 | Signal Banner | `#ffdd00` | Full-bleed top announcement bar — the only chromatic band in the system |
| 3 | Carbon Block | `#191919` | Inverted section background for feature/footer dark blocks |

## Elevation

- **Buttons (outlined on light):** `inset 0 0 0 1px #000000`
- **Buttons (outlined on dark):** `inset 0 0 0 1px #ffffff`
- **Focus ring:** `0 0 0 1px #ffffff (on dark surfaces)`

## Imagery

Photography is documentary and unprocessed — straight crops of office interiors, hands-on-laptops teamwork, and architectural floor plans/blueprints. No lifestyle staging, no color grading, no duotone overlays. Images are rectangular with no border-radius, embedded inline within the text flow rather than treated as standalone hero panels. The floor plan in the carousel is a muted near-monochrome that blends with the putty canvas. The overall image-to-text ratio is low — the site is text-dominant, with photography functioning as visual punctuation between oversized headline words rather than as the focal point. No illustration, no 3D, no abstract graphics. Icons are minimal and typographic (the '+' expand glyph, the '← →' arrows, the 'EN ▾' locale toggle) — no icon library, no filled glyphs.

## Layout

Page model is max-width contained (~1200–1400px) with a putty canvas that bleeds edge-to-edge. The hero is a two-line monumental headline at 116–216px with a photograph embedded inline between the words, centered text block with the paragraph below. Below the hero, sections alternate between white surfaces (e.g. the 'Four Steps' accordion list) and putty/photographic full-bleed bands (e.g. the Subscription carousel). A single full-bleed carousel with 480–600px height serves as a feature showcase, using left-aligned overlay text on a desaturated image. Content arrangement is editorial: centered stacks for hero, left-aligned two-column for body+visual blocks, and full-width row-based accordions for service listings. Navigation is a single horizontal bar with two link clusters and a right-aligned CTA. No sidebar, no mega-menu. Section gaps are 64–96px, with 48px padding between section title and content. The rhythm is print-like — generous breathing room, no information density, each block is given room to read as a single statement.

## Agent Prompt Guide

Quick Color Reference:
- text: #000000 (primary) / #ffffff (on dark/putty)
- background: #cac7b4 (canvas) / #ffffff (cards) / #191919 (inverted sections)
- border: #000000 (1px inset, default) / #ffffff (on dark surfaces)
- accent: #ffdd00 (announcement bar only)
- primary action: no distinct CTA color

Example Component Prompts:
1. Build a hero section: #cac7b4 canvas. Headline in Gd Grio Vf 166px weight 500 uppercase, #000000, line-height 0.88, letter-spacing -0.02em, split across two lines with a rectangular photograph embedded inline between the two halves. Paragraph below in Gd Grio Vf 16px weight 400 #000000, max-width 640px, centered.
2. Build a service accordion row: #ffffff surface, 1px #000000 hairline top and bottom, 80px height. Left column has Gd Grio Vf 14px weight 400 #000000 short label. Right column has Gd Grio Vf 26px weight 500 uppercase #000000 service name. Far right has a '+' glyph at 18px in #000000. 24px horizontal padding.
3. Build a carousel slide: full-width #cac7b4 or photographic background, 520px height. Title in Gd Grio Vf 90px weight 500 uppercase #ffffff, line-height 0.9, positioned center-left with 48px padding. Below: 16px body copy #ffffff max-width 480px, then a white outlined button (See solutions) beside a putty filled button (Book a meeting). Bottom-left: 40×40px arrow nav with 1px inset #ffffff border.
4. Build an info card: #cac7b4 background, 6px radius, 1px #000000 hairline, 32px padding. Headline Gd Grio Vf 26px weight 600 #000000, supporting text 16px weight 400 #000000 below.
No distinct primary action color was observed; use the extracted neutral button treatments instead of inventing a filled CTA color.

## Similar Brands

- **Pentagram** — Same editorial-monograph approach — single grotesque typeface, oversized display headlines, minimal palette, hairline rules instead of cards or shadows.
- **Werkstatt (Studio Dumbar/Experimental Jetset studios)** — Same Swiss-Bauhaus print-artifact feel: monolinear typography at monumental sizes, putty/earthy neutral canvas, accent used sparingly, sharp 2px corners.
- **Aesop** — Same restrained editorial restraint — warm neutral background, large quiet display type, single muted action color, no decorative gradients or shadows.
- **Vitsoe** — Same typographic confidence and product-as-poster sensibility — single sans-serif at extreme sizes, hairline dividers, putty/warm-gray canvas, almost no color.
- **Resn** — Same convention-breaking choice to use a single near-gray as the dominant brand surface rather than white, giving the page a printed-paper quality rather than a screen quality.

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-putty-stone: #cac7b4;
  --color-signal-yellow: #ffdd00;
  --color-ink: #000000;
  --color-paper: #ffffff;
  --color-carbon: #191919;
  --color-smoke: #cccccc;

  /* Typography — Font Families */
  --font-gd-grio-vf: 'Gd Grio Vf', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 13px;
  --leading-caption: 1.28;
  --tracking-caption: -0.08px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.08px;
  --text-subheading: 18px;
  --leading-subheading: 1.28;
  --text-heading-sm: 20px;
  --leading-heading-sm: 1.24;
  --text-heading: 26px;
  --leading-heading: 1.18;
  --tracking-heading: -0.156px;
  --text-heading-xl: 44px;
  --leading-heading-xl: 1;
  --text-display-sm: 64px;
  --leading-display-sm: 0.96;
  --tracking-display-sm: -0.64px;
  --text-display: 97px;
  --leading-display: 0.9;
  --tracking-display: -1.455px;
  --text-display-lg: 166px;
  --leading-display-lg: 0.88;
  --tracking-display-lg: -3.32px;
  --text-display-xl: 216px;
  --leading-display-xl: 0.88;
  --tracking-display-xl: -5.4px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 8px;
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-96: 96px;
  --spacing-128: 128px;
  --spacing-160: 160px;

  /* Layout */
  --page-max-width: 1400px;
  --section-gap: 64-96px;
  --card-padding: 24-32px;
  --element-gap: 16-24px;

  /* Border Radius */
  --radius-sm: 2px;
  --radius-md: 6px;
  --radius-2xl: 16px;

  /* Named Radii */
  --radius-nav: 2px;
  --radius-tags: 2px;
  --radius-cards: 6px;
  --radius-badges: 2px;
  --radius-buttons: 2px;

  /* Shadows */
  --shadow-subtle: rgb(0, 0, 0) 0px 0px 0px 1px inset;
  --shadow-subtle-2: rgb(255, 255, 255) 0px 0px 0px 1px inset;
  --shadow-subtle-3: rgb(255, 255, 255) 0px 0px 0px 1px;

  /* Surfaces */
  --surface-putty-canvas: #cac7b4;
  --surface-paper-card: #ffffff;
  --surface-signal-banner: #ffdd00;
  --surface-carbon-block: #191919;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-putty-stone: #cac7b4;
  --color-signal-yellow: #ffdd00;
  --color-ink: #000000;
  --color-paper: #ffffff;
  --color-carbon: #191919;
  --color-smoke: #cccccc;

  /* Typography */
  --font-gd-grio-vf: 'Gd Grio Vf', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 13px;
  --leading-caption: 1.28;
  --tracking-caption: -0.08px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.08px;
  --text-subheading: 18px;
  --leading-subheading: 1.28;
  --text-heading-sm: 20px;
  --leading-heading-sm: 1.24;
  --text-heading: 26px;
  --leading-heading: 1.18;
  --tracking-heading: -0.156px;
  --text-heading-xl: 44px;
  --leading-heading-xl: 1;
  --text-display-sm: 64px;
  --leading-display-sm: 0.96;
  --tracking-display-sm: -0.64px;
  --text-display: 97px;
  --leading-display: 0.9;
  --tracking-display: -1.455px;
  --text-display-lg: 166px;
  --leading-display-lg: 0.88;
  --tracking-display-lg: -3.32px;
  --text-display-xl: 216px;
  --leading-display-xl: 0.88;
  --tracking-display-xl: -5.4px;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-96: 96px;
  --spacing-128: 128px;
  --spacing-160: 160px;

  /* Border Radius */
  --radius-sm: 2px;
  --radius-md: 6px;
  --radius-2xl: 16px;

  /* Shadows */
  --shadow-subtle: rgb(0, 0, 0) 0px 0px 0px 1px inset;
  --shadow-subtle-2: rgb(255, 255, 255) 0px 0px 0px 1px inset;
  --shadow-subtle-3: rgb(255, 255, 255) 0px 0px 0px 1px;
}
```
