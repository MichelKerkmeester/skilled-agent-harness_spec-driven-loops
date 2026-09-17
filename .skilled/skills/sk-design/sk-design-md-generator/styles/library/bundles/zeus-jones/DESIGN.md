# Zeus Jones — Style Reference
> risograph broadsheet on warm cream — a page that prints like a zine and loads like a gallery.

**Theme:** light

Zeus Jones operates on an editorial broadsheet language: a warm cream canvas carries the entire site while one near-black ink (#1a1c2c) does all the typographic and interactive work. The signature move is weight 100 display type at 60–90px — headline copy that whispers rather than shouts, a deliberate inversion of the agency-website reflex to use bold display sans. Interactive elements are fully rounded pills; cards, images, and tags share a 20px radius. Shadows are absent — the design uses border weight and type contrast for separation. The hero breaks the monochrome with a single full-bleed aurora of color, but every section below it returns to the quiet cream-and-ink discipline, with underlined sans-serif and serif italic used as editorial emphasis devices.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Midnight Ink | `#1a1c2c` | `--color-midnight-ink` | Primary text, filled pill buttons, hairline borders, dark surfaces — the only chromatic color in the system; near-black with a barely-perceptible cool navy cast that softens the contrast against warm cream without losing the gravitas of pure black |
| Warm Parchment | `#fcfaf3` | `--color-warm-parchment` | Page canvas and light surface base — a creamy off-white that replaces the default SaaS pure-white with paper warmth, making the page feel printed rather than rendered |
| Soft Linen | `#ebe9e4` | `--color-soft-linen` | Elevated card and panel surface — one step darker than the canvas, used sparingly to lift a card or a section band without introducing a new color |
| Obsidian | `#000000` | `--color-obsidian` | SVG icon fills and decorative monochrome marks — reserved for vector assets where true black reads cleaner than the navy-tinted Midnight Ink |
| Blush Coral | `#fd9494` | `--color-blush-coral` | Sporadic warm accent — emerges from the hero aurora and may surface in tag dots or decorative washes; the only warm hue that earns a place in an otherwise cool-neutral system |

## Tokens — Typography

### ZJSansDisplay — Primary typeface for body, navigation, subheadings, and the 40–48px heading range. The 12px eyebrow and tag text carries +0.05em tracking (letter-spacing: 0.6px at 12px) to read as a small caps eyebrow; everything at 16px and above sits at -0.02em (-0.32px at 16px) for tight, editorial density. This is the working sans that does 95% of the page's communicative labor. · `--font-zjsansdisplay`
- **Substitute:** Inter
- **Weights:** 400, 500
- **Sizes:** 12, 16, 18, 24, 40, 48, 60, 90px
- **Line height:** 1.00–1.60 (tight at display sizes, generous at body)
- **Letter spacing:** -0.0200em, 0.0500em
- **Role:** Primary typeface for body, navigation, subheadings, and the 40–48px heading range. The 12px eyebrow and tag text carries +0.05em tracking (letter-spacing: 0.6px at 12px) to read as a small caps eyebrow; everything at 16px and above sits at -0.02em (-0.32px at 16px) for tight, editorial density. This is the working sans that does 95% of the page's communicative labor.

### FeatureDeckLight — Hero display face used at 60–90px with line-height compressed to 1.07–1.11. Weight 100 is the anti-convention signature: while every agency site uses 600–800 for display, this hairline weight makes the largest text the lightest on the page — authority through restraint, not volume. The italic cut is used for poetic emphasis words inside the headline (e.g. 'the world'). · `--font-featuredecklight`
- **Substitute:** GT Sectra Display Thin (commercial) or Playfair Display weight 400 for a free serif-italic fallback
- **Weights:** 100
- **Sizes:** 60, 90px
- **Line height:** 1.07–1.11
- **Letter spacing:** -0.0200em
- **Role:** Hero display face used at 60–90px with line-height compressed to 1.07–1.11. Weight 100 is the anti-convention signature: while every agency site uses 600–800 for display, this hairline weight makes the largest text the lightest on the page — authority through restraint, not volume. The italic cut is used for poetic emphasis words inside the headline (e.g. 'the world').

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.5 | 0.6px | `--text-caption` |
| body-sm | 16px | 1.6 | -0.32px | `--text-body-sm` |
| body | 18px | 1.5 | -0.36px | `--text-body` |
| subheading | 24px | 1.3 | -0.48px | `--text-subheading` |
| heading-sm | 40px | 1.2 | -0.8px | `--text-heading-sm` |
| heading | 48px | 1.11 | -0.96px | `--text-heading` |
| display | 60px | 1.07 | -1.2px | `--text-display` |
| display-lg | 90px | 1.07 | -1.8px | `--text-display-lg` |

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
| 120 | 120px | `--spacing-120` |
| 128 | 128px | `--spacing-128` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 9999px |
| tags | 9999px |
| cards | 20px |
| images | 20px |
| buttons | 9999px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 40px
- **Card padding:** 16px
- **Element gap:** 16px

## Components

### Filled Pill Button (Primary Action)
**Role:** Primary call-to-action, used sparingly — contact, next-step, conversion.

Fully rounded (radius 9999px) pill button. Background: Midnight Ink #1a1c2c. Text: Warm Parchment #fcfaf3, ZJSansDisplay 16px weight 400, tracking -0.32px. Padding: 16px vertical × 24px horizontal. No border, no shadow. The pill geometry and ink fill against cream is the only filled action in the system — when in doubt, this is the button.

### Outlined Pill Tag (Project Label)
**Role:** Labels on project cards and section eyebrows.

Fully rounded pill (radius 9999px). Border: 1px solid Midnight Ink #1a1c2c. Background: transparent / Warm Parchment. Text: ZJSansDisplay 12px weight 500, tracking +0.6px (uppercase by convention), color Midnight Ink. Padding: 8px vertical × 16px horizontal. These tags sit directly below project card images.

### Project Card
**Role:** Portfolio grid item under the 'recent work' section.

Radius 20px. Image fills the card top with 20px radius on the top corners only. Below the image: an outlined pill tag, then a 24–40px subheading in ZJSansDisplay weight 400, color Midnight Ink, with a short descriptor in 18px body weight 400. No card border, no shadow — separation comes from the Soft Linen #ebe9e4 background visible in the gap between cards.

### Hero Display Headline
**Role:** Opening statement on the landing page.

Set in FeatureDeckLight weight 100 at 90px (display-lg), line-height 1.07, letter-spacing -1.8px. Color: Midnight Ink #1a1c2c. Sits over a full-bleed colorful aurora background image. Specific words receive a 1px underline; the final clause switches to serif italic in the same weight 100. No max-width — the headline spans the viewport with generous side padding.

### Announcement Bar
**Role:** Thin strip below the hero promoting a publication or event.

Full-width row, 1px bottom border in Midnight Ink. Left-aligned content: a small 8px filled dot in Blush Coral #fd9494, then ZJSansDisplay 16px weight 400 text in Midnight Ink, ending with an underlined link. Padding: 16px vertical × 40px horizontal. Background: Warm Parchment.

### Sticky Top Navigation
**Role:** Persistent brand and menu bar.

Full-bleed, transparent over the hero aurora, then Warm Parchment after scroll. Left: wordmark 'Zeus Jones' set in ZJSansDisplay 16px weight 500, two lines stacked. Right: a 3-line hamburger icon in Obsidian #000000. No background fill, no border, no shadow — the nav disappears into the page.

### Section Eyebrow with Dash
**Role:** Small label introducing a content section, paired with a counter.

ZJSansDisplay 16px weight 400, Midnight Ink. Format: 'How we partner —' (em dash separator), with '1 of 7' right-aligned in the same style. Tracking -0.32px. Sits above a section heading with 24px gap.

### Section Heading (Serif Display)
**Role:** Headings for content sections below the hero.

FeatureDeckLight weight 100 at 48–60px, line-height 1.11, tracking -0.96 to -1.2px. Color: Midnight Ink. Used for 'Brand Strategy & Architecture' and similar section titles. The ultra-light weight carries into the body sections, maintaining the hero's typographic voice.

### Next/Previous Step Link
**Role:** Pagination between sequential content steps.

ZJSansDisplay 16px weight 400, Midnight Ink, paired with a right-arrow (→) character. Right-aligned. Underline appears on hover. No button fill — this is a text affordance, not a button.

### Underlined Emphasis Text
**Role:** Inline emphasis within body and headline copy.

Default underline style: 1px solid Midnight Ink, offset 4px below baseline. Applied to key words in the hero ('grow', 'mean more') and in the announcement bar link. The underline is the system's only emphasis device — no bold, no color change, no italic on sans-serif text.

### Footer
**Role:** Site footer (inferred from context frequency).

Warm Parchment background, 1px top border in Midnight Ink. Content in ZJSansDisplay 16px weight 400, Midnight Ink. Generous padding (40px+ vertical). Minimal link list, no logo repetition, no social icon grid — the footer closes the editorial tone.

## Do's and Don'ts

### Do
- Use #1a1c2c (Midnight Ink) for every filled button, heading, body paragraph, and hairline border — it is the system's only working color and the only legitimate action background.
- Set display headlines at 60–90px in FeatureDeckLight weight 100 with -0.02em tracking and line-height 1.07 — the hairline weight is the brand's signature, never substitute with 600+.
- Use 9999px radius for every button, tag, and nav element; use 20px for every card, image, and panel — these are the only two radii in the system.
- Apply 1px solid #1a1c2c underlines to emphasized words inside headlines and links — this is the editorial emphasis device, not bold or color.
- Keep the body of the page in Warm Parchment #fcfaf3 and reserve Soft Linen #ebe9e4 for the occasional elevated card or section band.
- Use 12px ZJSansDisplay weight 500 with +0.05em tracking (0.6px) for all eyebrows, tags, and small labels — this is the only uppercase-tracked text style.
- Maintain section gaps of 40px and element gaps of 16px; the page reads in 8px increments, never break the grid with arbitrary spacing.

### Don't
- Never use box-shadows or drop-shadows — the system is flat by design; use 1px borders and surface tonal steps for separation instead.
- Never use a bold or 600+ weight for display headlines — weight 100 at 60–90px is the signature; a bold version would erase the brand voice.
- Never introduce a new accent color for buttons, links, or interactive elements — the action is always filled Midnight Ink on Warm Parchment.
- Never use pure white (#ffffff) as a background — the canvas is Warm Parchment #fcfaf3; pure white would break the printed-paper quality.
- Never add a gradient to UI components, buttons, or cards — the system is solid-fill only; color gradients are reserved for the single full-bleed hero image.
- Never use sharp corners (0–4px radius) on cards or buttons — the system is either 20px rounded or fully pill-shaped; no in-between.
- Never use decorative dividers, background patterns, or ornamental graphics below the hero — the body of the site is typographic and photographic only.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Warm Parchment | `#fcfaf3` | Page canvas and default body surface |
| 2 | Soft Linen | `#ebe9e4` | Elevated card or panel — one tonal step up from the canvas |
| 3 | Midnight Ink | `#1a1c2c` | Dark surface for filled buttons and inverted sections |

## Elevation

The system deliberately avoids box-shadows. Hierarchy is established through type weight contrast (weight 100 display against weight 500 labels), hairline 1px borders in Midnight Ink, and surface tonal steps. A 1px solid border in #1a1c2c is the system's only structural separator — no soft drop shadows, no glow effects, no layered cards. This flatness is part of the editorial identity: the page should feel like ink on paper, not like a glass-morphism dashboard.

## Imagery

The visual system is dominated by two image modes: a single full-bleed psychedelic aurora on the hero (pink, violet, yellow, and green diffused color fields — clearly a photographic or AI-generated abstract, not a gradient token), and rectangular project card thumbnails with 20px radius showing editorial photography, product renders, and campaign artwork. Below the hero, imagery is contained, never full-bleed except for the card images themselves. Icon style is minimal — line-based menu icon in Obsidian #000000, and small 8px filled dots in Blush Coral #fd9494 as bullet markers. The site carries no illustration, no 3D, no product screenshots, and no icon system beyond utility marks. Photography treatment varies per project card and is not normalized — the design system treats images as content, not as styled components.

## Layout

The page model is full-bleed with generous side padding (~40px at desktop). The hero is a full-viewport display headline over a colorful aurora background — no navigation chrome competes with the statement. Below the hero, a thin 1px-bordered announcement bar spans edge-to-edge. Content sections follow a single-column or wide-grid structure with a 1200px max-width reading area; project cards appear in a 4-column horizontal row with overflow scrolling (the row is intentionally wider than the viewport, showing partial cards at the edges as a 'more work' affordance). Section headings are left-aligned with a 24px gap below a small eyebrow label. Spacing is generous: 40px between major sections, 16px between elements within a section. The overall rhythm is editorial — long quiet sections separated by typographic anchors, no dense information blocks, no sidebar navigation, no mega-menu.

## Agent Prompt Guide

Quick Color Reference:
- text: #1a1c2c (Midnight Ink)
- background: #fcfaf3 (Warm Parchment)
- card surface: #ebe9e4 (Soft Linen)
- border: #1a1c2c 1px
- accent: #fd9494 (Blush Coral — decorative only)
- primary action: #1a1c2c (filled action)

Example Component Prompts:

1. Hero Display Headline — 'Zeus Jones: risograph on warm cream'. Set a 90px FeatureDeckLight weight 100 headline at #1a1c2c, line-height 1.07, letter-spacing -1.8px, over a full-bleed colorful aurora background. Underline the words 'risograph' and 'warm'. End the headline with 'cream.' in serif italic. No max-width; pad 80px left.

2. Filled Pill Button — 'Interested? let's talk'. 9999px radius. Background #1a1c2c. Text #fcfaf3, ZJSansDisplay 16px weight 400, tracking -0.32px. Padding 16px vertical × 24px horizontal. No border, no shadow.

3. Project Card — four cards in a horizontal row, each with a 20px-radius image filling the top, a pill tag below (1px #1a1c2c border, radius 9999px, 12px ZJSansDisplay weight 500 +0.6px tracking, #1a1c2c text, padding 8px × 16px), then a 24px ZJSansDisplay weight 400 title, then an 18px body descriptor. Background Warm Parchment #fcfaf3; cards separated by 16px gap.

4. Section Heading + Eyebrow — eyebrow row: 'How we partner —' left-aligned, '1 of 7' right-aligned, ZJSansDisplay 16px weight 400 #1a1c2c, tracking -0.32px, 1px solid #1a1c2c bottom border across the row. Below, 24px gap, then a 48px FeatureDeckLight weight 100 heading at #1a1c2c, tracking -0.96px.

5. Announcement Bar — full-width strip, 1px solid #1a1c2c bottom border, 16px vertical padding. Left content: 8px filled dot in #fd9494, then ZJSansDisplay 16px weight 400 #1a1c2c text, ending with an underlined 'Learn more' link. Background #fcfaf3.

## Similar Brands

- **Pentagram** — Same editorial restraint, custom display serif at large sizes, cream/near-black palette, pill-shaped tags, no shadows.
- **Studio Dumbar** — Daring typographic weight choices (including hairline display), warm-neutral canvas, single-color systems, flat layout without elevation.
- **Collins** — Weight-100 display type as a brand voice, near-black text on warm off-white, editorial project card grids, minimal navigation chrome.
- **Instrument** — Restrained monochrome interface with one chromatic hero break, pill-shaped controls, editorial body typography, flat surfaces.

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-midnight-ink: #1a1c2c;
  --color-warm-parchment: #fcfaf3;
  --color-soft-linen: #ebe9e4;
  --color-obsidian: #000000;
  --color-blush-coral: #fd9494;

  /* Typography — Font Families */
  --font-zjsansdisplay: 'ZJSansDisplay', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-featuredecklight: 'FeatureDeckLight', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --tracking-caption: 0.6px;
  --text-body-sm: 16px;
  --leading-body-sm: 1.6;
  --tracking-body-sm: -0.32px;
  --text-body: 18px;
  --leading-body: 1.5;
  --tracking-body: -0.36px;
  --text-subheading: 24px;
  --leading-subheading: 1.3;
  --tracking-subheading: -0.48px;
  --text-heading-sm: 40px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -0.8px;
  --text-heading: 48px;
  --leading-heading: 1.11;
  --tracking-heading: -0.96px;
  --text-display: 60px;
  --leading-display: 1.07;
  --tracking-display: -1.2px;
  --text-display-lg: 90px;
  --leading-display-lg: 1.07;
  --tracking-display-lg: -1.8px;

  /* Typography — Weights */
  --font-weight-thin: 100;
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
  --spacing-120: 120px;
  --spacing-128: 128px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 40px;
  --card-padding: 16px;
  --element-gap: 16px;

  /* Border Radius */
  --radius-2xl: 20px;
  --radius-full: 1000px;
  --radius-full-2: 1584px;
  --radius-full-3: 1782px;

  /* Named Radii */
  --radius-nav: 9999px;
  --radius-tags: 9999px;
  --radius-cards: 20px;
  --radius-images: 20px;
  --radius-buttons: 9999px;

  /* Surfaces */
  --surface-warm-parchment: #fcfaf3;
  --surface-soft-linen: #ebe9e4;
  --surface-midnight-ink: #1a1c2c;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-midnight-ink: #1a1c2c;
  --color-warm-parchment: #fcfaf3;
  --color-soft-linen: #ebe9e4;
  --color-obsidian: #000000;
  --color-blush-coral: #fd9494;

  /* Typography */
  --font-zjsansdisplay: 'ZJSansDisplay', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-featuredecklight: 'FeatureDeckLight', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --tracking-caption: 0.6px;
  --text-body-sm: 16px;
  --leading-body-sm: 1.6;
  --tracking-body-sm: -0.32px;
  --text-body: 18px;
  --leading-body: 1.5;
  --tracking-body: -0.36px;
  --text-subheading: 24px;
  --leading-subheading: 1.3;
  --tracking-subheading: -0.48px;
  --text-heading-sm: 40px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -0.8px;
  --text-heading: 48px;
  --leading-heading: 1.11;
  --tracking-heading: -0.96px;
  --text-display: 60px;
  --leading-display: 1.07;
  --tracking-display: -1.2px;
  --text-display-lg: 90px;
  --leading-display-lg: 1.07;
  --tracking-display-lg: -1.8px;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-120: 120px;
  --spacing-128: 128px;

  /* Border Radius */
  --radius-2xl: 20px;
  --radius-full: 1000px;
  --radius-full-2: 1584px;
  --radius-full-3: 1782px;
}
```
