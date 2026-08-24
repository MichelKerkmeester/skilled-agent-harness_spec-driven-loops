# Kinfolk — Style Reference
> Editorial broadsheet on bone-white linen — generous margins, ink-black serif, and a single warm-paper accent for section breaks.

**Theme:** light

Kinfolk translates a printed art-magazine to the web: bone-white canvases, full-bleed editorial photography, and serif type that does the heavy lifting while the interface stays nearly invisible. The entire palette is monochromatic — black ink on warm off-white paper, with a single warm sage-gray (#dbded5) used as a paper-tinted section break. There are no accent colors, no filled buttons, no decorative gradients; hierarchy is built through typographic scale, whitespace, and the rhythm of image-to-text transitions. Display serif at 50–60px with -0.025em tracking carries the editorial gravitas; a single weight (400) across all families creates a deliberately quiet, consistent voice. The result is less a website than a gallery wall — the photographs and headlines are the exhibits, and the UI is the white wall around them.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Ink Black | `#000000` | `--color-ink-black` | Primary type, borders, icon strokes, and all hairline rules. The only foreground color in the system |
| Bone White | `#ffffff` | `--color-bone-white` | Primary canvas, card surfaces, and reverse text on dark photo overlays |
| Paper Mist | `#f4f4f4` | `--color-paper-mist` | Soft surface elevation for insets, input fields, and section backgrounds that need to step down from pure white without introducing a hue |
| Sage Paper | `#dbded5` | `--color-sage-paper` | Warm greenish-gray paper tint used as a section-break wash and full-bleed band. Provides the only chromatic moment in the system without becoming a brand color |

## Tokens — Typography

### Kinfolk-Serif-Text — Long-form body copy, captions, and article decks at 20px (lead paragraphs) and 15px (body). Normal letter-spacing lets the text breathe at reading size; the elevated line-height (1.5 at 15px) gives prose an airier, more literary rhythm than typical web body text. · `--font-kinfolk-serif-text`
- **Substitute:** Cormorant Garamond, Lora
- **Weights:** 400
- **Sizes:** 15px, 20px
- **Line height:** 1.25–1.50
- **Letter spacing:** normal
- **Role:** Long-form body copy, captions, and article decks at 20px (lead paragraphs) and 15px (body). Normal letter-spacing lets the text breathe at reading size; the elevated line-height (1.5 at 15px) gives prose an airier, more literary rhythm than typical web body text.

### Kinfolk-Serif-Display — Hero and feature headlines (60px, lh 1.0, tracking -0.025em / -1.5px). The tight tracking on a single 400 weight produces compressed, almost carved letterforms — authority through restraint, not volume. Used sparingly for the largest editorial moments. · `--font-kinfolk-serif-display`
- **Substitute:** Playfair Display, Cormorant Garamond
- **Weights:** 400
- **Sizes:** 20px
- **Line height:** 1.00
- **Letter spacing:** -0.025em
- **OpenType features:** `"liga" on, "dlig" on`
- **Role:** Hero and feature headlines (60px, lh 1.0, tracking -0.025em / -1.5px). The tight tracking on a single 400 weight produces compressed, almost carved letterforms — authority through restraint, not volume. Used sparingly for the largest editorial moments.

### Kinfolk-Serif-Deck — Section titles, article headlines, and deck/sub-deck lines at 50/32/25px. Same 400-only discipline as the display face but at intermediate optical sizes. Tracking is still negative at the top end (-0.5px at 50px) for that dense editorial feel. · `--font-kinfolk-serif-deck`
- **Substitute:** Cormorant Garamond, EB Garamond
- **Weights:** 400
- **Sizes:** 25px, 32px, 50px, 60px
- **Line height:** 1.04–1.19
- **Letter spacing:** -0.01em to -0.005em
- **Role:** Section titles, article headlines, and deck/sub-deck lines at 50/32/25px. Same 400-only discipline as the display face but at intermediate optical sizes. Tracking is still negative at the top end (-0.5px at 50px) for that dense editorial feel.

### Kinfolk-Sans — UI chrome, metadata, category labels, navigation, button text, and small functional text. Tracking opens up dramatically at the small end (0.06em / ~0.78px at 13px) — a common editorial convention that makes all-caps metadata read as labels rather than body. One weight only, with scale doing all the differentiation. · `--font-kinfolk-sans`
- **Substitute:** Inter, Söhne, GT America Standard
- **Weights:** 400
- **Sizes:** 13px, 15px, 16px, 20px, 25px
- **Line height:** 1.16–1.50
- **Letter spacing:** 0.01em to 0.06em (widens at smaller sizes)
- **Role:** UI chrome, metadata, category labels, navigation, button text, and small functional text. Tracking opens up dramatically at the small end (0.06em / ~0.78px at 13px) — a common editorial convention that makes all-caps metadata read as labels rather than body. One weight only, with scale doing all the differentiation.

### Arial — Arial — detected in extracted data but not described by AI · `--font-arial`
- **Weights:** 400
- **Sizes:** 13px
- **Line height:** 1.2
- **Role:** Arial — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 13px | 1.2 | 0.78px | `--text-caption` |
| body-sm | 15px | 1.5 | — | `--text-body-sm` |
| subheading | 20px | 1.33 | — | `--text-subheading` |
| heading-sm | 25px | 1.19 | 0.25px | `--text-heading-sm` |
| heading | 32px | 1.16 | -0.32px | `--text-heading` |
| heading-lg | 50px | 1.04 | -0.5px | `--text-heading-lg` |
| display | 60px | 1 | -1.5px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 8 | 8px | `--spacing-8` |
| 12 | 12px | `--spacing-12` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 40 | 40px | `--spacing-40` |
| 60 | 60px | `--spacing-60` |
| 80 | 80px | `--spacing-80` |
| 120 | 120px | `--spacing-120` |
| 200 | 200px | `--spacing-200` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 0px |
| links | 2px |
| inputs | 0px |
| buttons | 0px |

### Layout

- **Page max-width:** 1400px
- **Section gap:** 80px
- **Card padding:** 20px
- **Element gap:** 20px

## Components

### Editorial Cover Hero
**Role:** Issue cover / feature image for the current issue

Centred magazine-cover image (roughly 280×370px, sharp 0px corners) floating on a #ffffff canvas, with no border or shadow. Above the cover sits a two-line serif title at Kinfolk-Serif-Deck 50px (line 1) and the same size or slightly smaller (line 2) — all-caps issue number, title-case issue name. The composition is symmetrical and unhurried, with ~120px of vertical breathing room between title and image.

### Full-Bleed Editorial Photo Section
**Role:** Immersive lifestyle/editorial photography that anchors a story

Edge-to-edge image (100vw, no radius, no overlay tint) with white serif overlay text anchored to the lower-left or lower-right corner. Headline at Kinfolk-Serif-Deck 50px, weight 400, color #ffffff, tracking -0.01em. Captions and category labels in Kinfolk-Sans 13px with 0.06em tracking. The photo does all the visual work; type sits in negative space within the image.

### Article Card Grid
**Role:** 5-up grid of latest stories on the issue landing

Five equal columns at the desktop breakpoint, each card is image-on-top / type-below. Image: full-column-width, 0px radius, no border. Below: 4px gap, then Kinfolk-Sans 13px category label in #000 with 0.06em tracking, then Kinfolk-Sans 16-20px headline in #000, then a 1-2 line excerpt in Kinfolk-Serif-Text 15px. The grid sits on #ffffff with 20px column gaps; no card has a background, border, or shadow.

### Article Title Block
**Role:** Feature-story headline beneath the article grid

Centred stack on #ffffff. Lead line in Kinfolk-Sans 25px as an eyebrow/credit (e.g. a contributor name). Main title at Kinfolk-Serif-Deck 50–60px, weight 400, line-height ~1.04, tracking -0.01em, #000. Subtitle/deck at Kinfolk-Serif-Deck 32px. Generous 60-80px vertical rhythm between lines; the block is the typographic equivalent of a magazine cover spread.

### Latest Stories Sidebar
**Role:** Compact list of supplemental links in the lower-right of editorial sections

Right-aligned stack with a small Kinfolk-Sans 13px all-caps label ("LATEST STORIES", 0.06em tracking) followed by a vertical list. Each list item is a category label in Kinfolk-Sans 13px + a story title in Kinfolk-Serif-Text 15px, separated by 15-20px of vertical space. Bullets are square or hyphen glyphs in #000; no background fill, no borders.

### Header Bar
**Role:** Top-level site navigation

White (#ffffff) background, no border, no shadow. KINFOLK wordmark in Kinfolk-Sans 16px, 0.06em tracking, #000, flush-left with ~24px page padding. A simple hamburger icon (two stacked 1px-thick black lines) sits flush-right. Total header height ~64px. The chrome intentionally competes with nothing.

### Subscribe CTA Button
**Role:** Primary conversion in the persistent bottom bar

Inline text link with a 1px #000 hairline border (border-radius 0px), 9px 13px padding, Kinfolk-Sans 13px label in #000 with 0.06em tracking. No fill, no shadow. Sits inside a full-width #000 footer bar alongside a "Login" ghost text link. The button feels like a typographic element, not a UI control — the inverse of a typical filled CTA.

### Footer Bar
**Role:** Persistent subscription prompt at the bottom of the viewport

Full-width #000 background, ~48px tall. Left-aligned helper text in Kinfolk-Sans 13px #ffffff. Right-aligned: "Login" text link + the outlined Subscribe CTA. The footer is the only large #000 surface in the system and reads as a printed colophon strip.

### Category Label
**Role:** Issue/section tag above article titles

Kinfolk-Sans 13px, weight 400, #000, 0.06em tracking, sentence-case. No background, no border, no icon. Functions as a typographic eyebrow sitting 5-10px above the related headline.

### Cover Link Pair
**Role:** Read/Buy action beneath a featured cover

Two text links separated by a vertical pipe ("Buy | Read"), centred, Kinfolk-Sans 15px #000, no decoration beyond a 1px #000 underline. Click targets inherit the same 2px underline-radius convention. The pipe separator is a print-publication convention; the absence of buttons reinforces the editorial voice.

## Do's and Don'ts

### Do
- Set all primary headlines in Kinfolk-Serif-Deck or Kinfolk-Serif-Display at weight 400 only — never bold or medium.
- Reserve #dbded5 for full-bleed section bands; never use it for small surfaces, badges, or icons.
- Use negative letter-spacing at every display size: -0.025em at 60px, -0.01em at 50px, -0.005em at 32px.
- Let full-bleed photography carry visual weight; keep UI chrome to under 10% of the viewport at any scroll position.
- Use 0px border-radius on every card, button, and image — the 2px radius appears only on inline text links.
- Set body line-height to 1.5 at 15px and 1.33 at 20px; tighter line-heights are reserved for display sizes above 32px.
- Reverse type (#ffffff on #000) only inside the persistent footer bar and over full-bleed photography; never on white-canvas cards.

### Don't
- Do not introduce any chromatic color beyond #dbded5 — the 0% colorfulness is the brand.
- Do not use filled buttons; every action is a text link with a 1px hairline border at most.
- Do not add shadows or elevation to cards — the surface hierarchy is purely typographic and positional.
- Do not use sans-serif for headlines, deck lines, or pull quotes; serif carries the entire editorial voice.
- Do not bold or italicize any of the Kinfolk type families; weight 400 is the only registered weight.
- Do not mix the #f4f4f4 mist and #dbded5 sage in adjacent surfaces — they read as conflicting neutrals.
- Do not use tracking above 0.06em on any text size; wide tracking is a 13px-and-below convention only.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Canvas | `#ffffff` | Base page background and majority of editorial card surfaces |
| 2 | Inset Mist | `#f4f4f4` | Subtle elevation for form fields, secondary content blocks, and gentle band separation |
| 3 | Sage Band | `#dbded5` | Full-bleed paper-tint section that reads as a magazine spread break rather than a colored block |

## Imagery

Full-bleed editorial photography is the dominant visual asset: lifestyle, interiors, fashion, and art-direction imagery shot in muted, naturalistic palettes with a slightly desaturated, film-like quality. Photos are presented edge-to-edge (0px radius, no borders, no overlays) and act as the background for overlaid white serif type. The magazine cover and article-grid thumbnails use tight vertical and square crops. There are no illustrations, no abstract graphics, and no iconography beyond a single hamburger glyph; icons are absent because the serif type and the photography carry all semantic weight. Image density is high but never decorative — every photograph serves a story, never an empty card.

## Layout

The site is a max-width ~1400px centred canvas on #ffffff, with full-bleed editorial sections that break out to 100vw. The first screen is a centred, vertically-stacked composition (wordmark top-left / hamburger top-right / centred issue title / centred cover image) — quiet and symmetrical. Below that, full-bleed photo sections alternate with white-space article grids, creating a print-magazine reading rhythm. The article grid is a 5-column equal-width row at desktop, collapsing to fewer columns on smaller breakpoints. Text is almost always left-aligned within cards and centred for hero/feature moments. The only persistent UI chrome is the 64px top header and the ~48px black footer bar; between them the page reads as uninterrupted editorial.

## Agent Prompt Guide

**Quick Color Reference**
- text: #000000 (Ink Black)
- background: #ffffff (Bone White)
- border: #000000 1px hairline
- accent: #dbded5 (Sage Paper) — section bands only
- reverse text: #ffffff on #000000 (footer, photo overlays)
- primary action: no distinct CTA color

**3 Example Component Prompts**

1. *Build a feature headline block on white:* Canvas #ffffff, no border, no shadow. Eyebrow line in Kinfolk-Sans 25px, weight 400, #000000, 0.25px letter-spacing. Main title in Kinfolk-Serif-Deck 50px, weight 400, line-height 1.04, letter-spacing -0.5px, #000000, centred. Subtitle in Kinfolk-Serif-Deck 32px, weight 400, line-height 1.16, letter-spacing -0.16px, #000000, centred. 60px vertical gap between each line.

2. *Build a full-bleed editorial photo section:* Edge-to-edge image at 100vw, 0px radius, no border. Overlay text anchored to the lower-left with 32px page padding. Headline in Kinfolk-Serif-Deck 50px, weight 400, line-height 1.04, letter-spacing -0.5px, #ffffff. Category label above the headline in Kinfolk-Sans 13px, #ffffff, letter-spacing 0.78px, sentence-case.

3. *Build an article card:* No card background, no border, no shadow. Top: full-column-width image with 0px radius. 20px gap below image. Category label in Kinfolk-Sans 13px, #000000, letter-spacing 0.78px, then 8px gap, then headline in Kinfolk-Sans 16px, weight 400, #000000, then 10px gap, then excerpt in Kinfolk-Serif-Text 15px, line-height 1.5, #000000. Card sits in a 5-column grid with 20px column gaps.

## Elevation Philosophy

This system deliberately avoids box-shadows and fill-based elevation. Hierarchy is established through: (1) the contrast of full-bleed photography against bone-white canvas, (2) the sage paper band (#dbded5) as a step-down surface for section breaks, and (3) typographic scale alone — no card needs to lift off the page because nothing on the page is pretending to be a windowed UI. The only border treatment is the 1px hairline, used on text links and the subscribe CTA. A designer who needs to add a shadow should first ask whether the element belongs in a different surface layer.

## Typography Philosophy

Every type family ships with a single registered weight (400). Visual differentiation comes from optical size and tracking, not from weight contrast. Display faces compress with negative tracking (-0.025em at the top) while UI sans-serif opens up dramatically at small sizes (up to 0.06em at 13px). The serif/sans split mirrors a magazine's body-vs-caption convention: serif for everything the reader is meant to linger on, sans for everything functional (labels, metadata, buttons, navigation). Never set serif below 15px — at that size, the system drops to Kinfolk-Sans to preserve legibility.

## Similar Brands

- **The Gentlewoman** — Same editorial-magazine-on-the-web approach: monochromatic palette, full-bleed photography, single-weight serif headlines, and zero decorative UI chrome.
- **Cereal magazine** — Bone-white canvas, sage/muted-warm section bands, thin serif type, and an almost complete absence of color in the interface — the photography and the type do all the work.
- **Aesop (aesop.com)** — Same ultra-restrained monochromatic system with generous whitespace, serif editorial headlines, and no filled CTAs — only text-link or hairline-bordered actions.
- **Apartamento** — Print-magazine typography ported directly to web, with single-weight serif, warm off-white paper tones, and full-bleed editorial imagery as the primary content surface.
- **The New Order (theneworder.jp)** — Editorial publication with tightly tracked serif display type, black-and-white UI, and a restrained typographic system that treats whitespace as a design element.

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-ink-black: #000000;
  --color-bone-white: #ffffff;
  --color-paper-mist: #f4f4f4;
  --color-sage-paper: #dbded5;

  /* Typography — Font Families */
  --font-kinfolk-serif-text: 'Kinfolk-Serif-Text', ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
  --font-kinfolk-serif-display: 'Kinfolk-Serif-Display', ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
  --font-kinfolk-serif-deck: 'Kinfolk-Serif-Deck', ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
  --font-kinfolk-sans: 'Kinfolk-Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 13px;
  --leading-caption: 1.2;
  --tracking-caption: 0.78px;
  --text-body-sm: 15px;
  --leading-body-sm: 1.5;
  --text-subheading: 20px;
  --leading-subheading: 1.33;
  --text-heading-sm: 25px;
  --leading-heading-sm: 1.19;
  --tracking-heading-sm: 0.25px;
  --text-heading: 32px;
  --leading-heading: 1.16;
  --tracking-heading: -0.32px;
  --text-heading-lg: 50px;
  --leading-heading-lg: 1.04;
  --tracking-heading-lg: -0.5px;
  --text-display: 60px;
  --leading-display: 1;
  --tracking-display: -1.5px;

  /* Typography — Weights */
  --font-weight-regular: 400;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-40: 40px;
  --spacing-60: 60px;
  --spacing-80: 80px;
  --spacing-120: 120px;
  --spacing-200: 200px;

  /* Layout */
  --page-max-width: 1400px;
  --section-gap: 80px;
  --card-padding: 20px;
  --element-gap: 20px;

  /* Border Radius */
  --radius-sm: 2px;

  /* Named Radii */
  --radius-cards: 0px;
  --radius-links: 2px;
  --radius-inputs: 0px;
  --radius-buttons: 0px;

  /* Surfaces */
  --surface-canvas: #ffffff;
  --surface-inset-mist: #f4f4f4;
  --surface-sage-band: #dbded5;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-ink-black: #000000;
  --color-bone-white: #ffffff;
  --color-paper-mist: #f4f4f4;
  --color-sage-paper: #dbded5;

  /* Typography */
  --font-kinfolk-serif-text: 'Kinfolk-Serif-Text', ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
  --font-kinfolk-serif-display: 'Kinfolk-Serif-Display', ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
  --font-kinfolk-serif-deck: 'Kinfolk-Serif-Deck', ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
  --font-kinfolk-sans: 'Kinfolk-Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 13px;
  --leading-caption: 1.2;
  --tracking-caption: 0.78px;
  --text-body-sm: 15px;
  --leading-body-sm: 1.5;
  --text-subheading: 20px;
  --leading-subheading: 1.33;
  --text-heading-sm: 25px;
  --leading-heading-sm: 1.19;
  --tracking-heading-sm: 0.25px;
  --text-heading: 32px;
  --leading-heading: 1.16;
  --tracking-heading: -0.32px;
  --text-heading-lg: 50px;
  --leading-heading-lg: 1.04;
  --tracking-heading-lg: -0.5px;
  --text-display: 60px;
  --leading-display: 1;
  --tracking-display: -1.5px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-40: 40px;
  --spacing-60: 60px;
  --spacing-80: 80px;
  --spacing-120: 120px;
  --spacing-200: 200px;

  /* Border Radius */
  --radius-sm: 2px;
}
```
