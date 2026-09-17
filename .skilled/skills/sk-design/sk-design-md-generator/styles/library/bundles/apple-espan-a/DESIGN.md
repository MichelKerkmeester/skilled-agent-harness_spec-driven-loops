# Apple (España) — Style Reference
> white gallery vitrine

**Theme:** light

Apple's iPad Air page is a gallery of negative space — vast white canvas interrupted by single-product hero photography and generous vertical breathing room. The visual system is monochrome at its core (#1d1d1f text on #ffffff surface) with one saturated blue (#0071e3) as the sole accent for the primary action, and never more than one chromatic moment per band. Typography does the heavy lifting: SF Pro Display at 80px weight 600 for hero, tightening to 56px and 48px for section headlines, always with negative letter-spacing — the headlines feel carved rather than typed. Cards float at 28px radius with zero shadow and no border; surfaces separate purely through tint shifts (white → #f3f6f6 → #e8e8ed). Buttons are pill-shaped (980px–9999px) or underlined text links — never boxes. Everything is airy, precise, and restrained.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Pure White | `#ffffff` | `--color-pure-white` | Page canvas, card surfaces, nav background, icon fills |
| Fog Mist | `#f3f6f6` | `--color-fog-mist` | Footer surface, secondary card tint, alternating section backgrounds |
| Paper Gray | `#fafafc` | `--color-paper-gray` | Opened nav menu surface — barely-distinguished from white canvas |
| Silver Smoke | `#e8e8ed` | `--color-silver-smoke` | Tertiary surface, subtle dividers, chip backgrounds |
| Ash Border | `#dedfe2` | `--color-ash-border` | Hairline separators, disabled button backgrounds |
| Graphite | `#6e6e73` | `--color-graphite` | Secondary body text, captions, helper labels |
| Charcoal | `#444545` | `--color-charcoal` | Nav text, secondary nav and link text |
| Steel | `#313131` | `--color-steel` | Nav icon fills, button text on light surfaces, dark surface tint |
| Near Black | `#1d1d1f` | `--color-near-black` | Headlines, primary body text, all editorial copy — the dominant ink |
| True Black | `#000000` | `--color-true-black` | Icon fills, input underline, maximum-emphasis headings |
| Apple Blue | `#0071e3` | `--color-apple-blue` | Primary action fill — the only chromatic button color, also nav hover and focus ring |
| Link Blue | `#0066cc` | `--color-link-blue` | Inline text link color, secondary link accent |
| Ember | `#b64400` | `--color-ember` | Orange state accent for badges, validation surfaces, and short status labels. |
| Ocean Depth | `linear-gradient(rgb(0, 76, 148) 45%, rgb(41, 123, 196) 90%)` | `--color-ocean-depth` | Hero gradient stop — deep blue anchoring the product spotlight wash |

## Tokens — Typography

### SF Pro Text — Body, navigation, micro-copy, and smaller headings. 17px/400 for primary body (line-height 1.47), 14px/600 for eyebrow labels and small link lists, 12px/400 for legal and fine print, 44px/400 for nav bar text, 34px/600 for card sub-headings. · `--font-sf-pro-text`
- **Substitute:** Inter or system-ui
- **Weights:** 400, 600
- **Sizes:** 8, 12, 14, 17, 20, 34, 44
- **Line height:** 1.18–1.83
- **Letter spacing:** -0.022em at 17px body, -0.016em at 14px, -0.010em at 12px, -0.011em at 34px, -0.003em at 44px nav
- **OpenType features:** `"numr" on`
- **Role:** Body, navigation, micro-copy, and smaller headings. 17px/400 for primary body (line-height 1.47), 14px/600 for eyebrow labels and small link lists, 12px/400 for legal and fine print, 44px/400 for nav bar text, 34px/600 for card sub-headings.

### SF Pro Display — Display and editorial headlines — 80px hero, 56px section opener, 48px feature, 28px sub-feature, 21px large body. Negative letter-spacing tightens as size increases (-0.015em at 80px down to 0.011em at 21px). The only family used at sizes ≥ 40px. · `--font-sf-pro-display`
- **Substitute:** Inter (tight tracking variant) or system-ui
- **Weights:** 600
- **Sizes:** 21, 28, 40, 48, 56, 80
- **Line height:** 1.07–1.38
- **Letter spacing:** -0.015em at 80px, -0.005em at 56px, -0.003em at 48px, 0.007em at 28px, 0.011em at 21px
- **OpenType features:** `"numr" on`
- **Role:** Display and editorial headlines — 80px hero, 56px section opener, 48px feature, 28px sub-feature, 21px large body. Negative letter-spacing tightens as size increases (-0.015em at 80px down to 0.011em at 21px). The only family used at sizes ≥ 40px.

### Arial — Arial — detected in extracted data but not described by AI · `--font-arial`
- **Weights:** 400
- **Sizes:** 13px
- **Line height:** 1.2
- **Role:** Arial — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.33 | -0.12px | `--text-caption` |
| body-sm | 14px | 1.43 | -0.22px | `--text-body-sm` |
| body | 17px | 1.47 | -0.37px | `--text-body` |
| subheading | 21px | 1.38 | 0.23px | `--text-subheading` |
| heading-sm | 28px | 1.14 | 0.2px | `--text-heading-sm` |
| heading | 40px | 1.1 | -0.12px | `--text-heading` |
| heading-lg | 56px | 1.07 | -0.28px | `--text-heading-lg` |
| display | 80px | 1.05 | -1.2px | `--text-display` |

## Tokens — Spacing & Shapes

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 8 | 8px | `--spacing-8` |
| 9 | 9px | `--spacing-9` |
| 10 | 10px | `--spacing-10` |
| 11 | 11px | `--spacing-11` |
| 13 | 13px | `--spacing-13` |
| 14 | 14px | `--spacing-14` |
| 19 | 19px | `--spacing-19` |
| 20 | 20px | `--spacing-20` |
| 25 | 25px | `--spacing-25` |
| 28 | 28px | `--spacing-28` |
| 30 | 30px | `--spacing-30` |
| 40 | 40px | `--spacing-40` |
| 44 | 44px | `--spacing-44` |
| 57 | 57px | `--spacing-57` |
| 83 | 83px | `--spacing-83` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 28px |
| chips | 9999px |
| buttons | 980px |
| nav-pill | 32px |
| small-elements | 12px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| subtle | `rgba(0, 0, 0, 0.11) 0px 0px 1px 0px inset` | `--shadow-subtle` |
| xl | `rgba(0, 0, 0, 0.05) 0px 0px 35px 20px` | `--shadow-xl` |

### Layout

- **Page max-width:** 1440px
- **Section gap:** 80px
- **Card padding:** 40px
- **Element gap:** 10px

## Components

### Hero Product Spotlight
**Role:** Full-bleed product reveal section

White (#ffffff) canvas, no card chrome. Product name in SF Pro Display 80px weight 600 #1d1d1f, letter-spacing -1.2px, centered. Tagline in SF Pro Display 28px weight 600 #1d1d1f. Single product render centered with generous whitespace — minimum 160px vertical padding above and below. No borders, no shadows, no decorative elements.

### Primary Blue Pill Button
**Role:** Single primary action per section

Background #0071e3, white (#ffffff) text, SF Pro Text 17px weight 400, border-radius 980px (full pill), padding 12px 22px, no border. Used at most once per viewport; if present, it is the only filled button. Saturated blue against pure white creates immediate focal weight.

### Text-Link Button
**Role:** Secondary or tertiary action — Apple's default

Transparent background, text #1d1d1f or #0066cc, SF Pro Text 17px weight 400, with right-arrow character (›) appended. Zero padding, zero border, zero radius. The arrow is part of the text, not an icon — it inherits color. This is the dominant button type on the site.

### Outlined Pill Link
**Role:** Tertiary navigation-style action

Transparent fill, 1px border #1d1d1f, text #1d1d1f, border-radius 32px, padding 8px 18px, SF Pro Text 14px weight 400. Used for compact inline actions like 'Ver el vídeo' where a contained affordance is needed without color emphasis.

### Feature Card (White)
**Role:** Product or feature showcase panel

Background #ffffff, border-radius 28px, zero shadow, zero border. Padding 40px minimum internal. Often contains a single product image, 28px headline, and one text-link button. Relies on container background contrast (sits on #f3f6f6 or #e8e8ed parent) for visual separation.

### Feature Card (Tinted)
**Role:** Secondary feature panel with subtle surface tint

Background #fafafc or #f3f6f6, border-radius 28px, zero shadow, zero border. Identical typography to the white card — the tint is the only differentiator. Used to create gentle banding when stacking multiple feature cards vertically.

### Global Navigation Bar
**Role:** Persistent top navigation

Background #ffffff (or #161617 in dark mode), height 44px, SF Pro Text 12px weight 400 #1d1d1f/#313131 nav items, 44px line-height, letter-spacing -0.01em. Apple logo left, centered item list, search and bag icons right. Backdrop filter saturate(1.8) blur(20px) when scrolled. Hamburger open state reveals #fafafc surface.

### Section Header Block
**Role:** Editorial section title with optional inline link

Left-aligned headline at SF Pro Display 48px or 56px weight 600 #1d1d1f, letter-spacing -0.003em to -0.005em. Optional right-aligned text link (17px #0066cc) on the same baseline. No eyebrow, no kicker — the headline is the sole title element. Vertical spacing 60–80px from preceding section.

### Eyebrow Label
**Role:** Small uppercase or sentence-case category label above headlines

SF Pro Text 14px weight 600 #1d1d1f or #0066cc, letter-spacing -0.016em. Pairs with a 56px headline. No decorative bullet, no separator — typographic hierarchy alone.

### Inline Text Link
**Role:** Hyperlink within paragraph copy

SF Pro Text 17px weight 400, color #0066cc, underline on hover only (no persistent underline). Sits inline within body text; no button chrome.

### Price Block
**Role:** Starting price display

SF Pro Text 17px weight 400 #6e6e73 with 'Desde' prefix. No decorative currency symbol treatment — the euro sign is inline at the same size and color. Sits below the CTA, vertically close (~8px).

### Badge (New / Limited)
**Role:** Product freshness indicator

Transparent background, text color #b64400 (ember orange), SF Pro Text 12px weight 400 or 14px weight 600, zero padding, zero radius. Inline with product name. No pill shape — the word 'Nuevo' is naked typographic punctuation.

### Footer Band
**Role:** Bottom regulatory and link surface

Background #f3f6f6, full-width, generous padding (~40px vertical). Link lists in SF Pro Text 12px weight 400 #6e6e73, dividers between columns are absent — spacing alone separates columns. Fine print and legal in same size and color, no smaller variant.

### Floating Video Play Badge
**Role:** Play button affordance on video thumbnails

Circular #ffffff badge (~40px) with concentric ring border, containing a play triangle in #0066cc. Floats over a card or image. Zero shadow — the white circle against the image is the elevation.

## Do's and Don'ts

### Do
- Use #0071e3 (Apple Blue) as the only filled button color — one per section maximum, never two blue buttons side by side.
- Set all card radii to 28px and pair with zero border, zero shadow — let container background tint create separation.
- Set hero headlines at SF Pro Display 80px weight 600 with letter-spacing -1.2px and line-height 1.05.
- Anchor all body copy in SF Pro Text 17px weight 400 at line-height 1.47 with letter-spacing -0.37px.
- Use 980px border-radius on every pill-shaped button so it renders fully round regardless of width.
- Maintain minimum 80px vertical gap between editorial sections; hero sections get 160px+ breathing room.
- Reserve #0066cc exclusively for inline text links within paragraph copy; never as a standalone chip.

### Don't
- Do not use any chromatic color other than #0071e3 for buttons — no orange, green, or red CTAs.
- Do not add borders or drop-shadows to cards; separation must come from surface tint or whitespace alone.
- Do not use sans-serif weights below 400 or decorative typefaces; the system is two families (SF Pro Display, SF Pro Text) only.
- Do not place two filled buttons in the same row — pair a single filled button with a text-link or an outlined pill.
- Do not use letter-spacing wider than 0.011em on any size; the system is always tight or normal tracking.
- Do not introduce background colors other than #ffffff, #fafafc, #f3f6f6, and #e8e8ed for surfaces.
- Do not use radius values other than 12px (small), 28px (card), 32px (nav pill), or 980px+ (full pill) — no 4px or 8px rounded corners.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Pure White Canvas | `#ffffff` | Default page background, dominant canvas for hero and product sections |
| 1 | Fog Mist | `#f3f6f6` | Footer, banded secondary sections, subtle section alternation |
| 2 | Paper Gray | `#fafafc` | Opened global nav menu surface |
| 3 | Silver Smoke Card | `#e8e8ed` | Tertiary card or chip surface when further visual separation is needed |

## Elevation

- **Feature card (rare):** `rgba(0, 0, 0, 0.05) 0px 0px 35px 20px`

## Imagery

Product photography is the sole visual medium: high-resolution renders of iPad hardware on pure white seamless backgrounds, photographed at slight 15–25° angles rather than flat orthographic views. No lifestyle staging, no human subjects, no environmental context. Images are always centered within their section, never cropped to bleed. One decorative gradient wash (linear #004c94 → #297bc4) appears behind select hero sections. Icons are monochrome SF Symbols-style glyphs in #1d1d1f or #313131 at ~24px, 1.5px stroke. No illustrations, no 3D renders beyond the product photography itself, no abstract graphics. Density is image-heavy in hero bands, text-dominant in feature grid sections.

## Agent Prompt Guide

Quick Color Reference:
- text: #1d1d1f
- background: #ffffff
- border: #dedfe2
- accent: #0071e3
- link: #0066cc
- primary action: #0071e3 (filled action)

Example Component Prompts:
1. Hero section: #ffffff background, no card chrome. Headline 'iPad Air' in SF Pro Display 80px weight 600, color #1d1d1f, letter-spacing -1.2px, line-height 1.05, centered. Subtitle in SF Pro Display 28px weight 600 #1d1d1f centered below. Product render centered with 160px vertical breathing room above and below.
2. Feature card: #ffffff background, border-radius 28px, no border, no shadow, 40px internal padding. Headline SF Pro Display 48px weight 600 #1d1d1f. Body SF Pro Text 17px weight 400 #6e6e73. Text-link button below body: transparent fill, color #0066cc, with right-arrow ›, zero padding.
3. Create a Primary Action Button: #0071e3 background, #ffffff text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.
4. Section header: left-aligned SF Pro Display 56px weight 600 #1d1d1f letter-spacing -0.28px. Right-aligned text link 'Ver el vídeo' in SF Pro Text 17px weight 400 #0066cc on the same baseline. 80px vertical gap to following content.
5. Inline text link within paragraph: SF Pro Text 17px weight 400 body copy in #6e6e73, with one inline link in #0066cc no underline at rest, underline on hover. Sits mid-paragraph with zero padding and no chrome.

## Typographic Philosophy

Two-family system with no decorative type: SF Pro Display (≥21px, editorial and display roles) and SF Pro Text (≤17px and all body/nav/label roles). The split is strict — Display never renders body copy, Text never renders above 44px. Weight 600 is the universal bold across both families; there is no weight 700 or 800. Negative letter-spacing tightens with size — at 80px it reaches -1.2px (carved), at 17px it is -0.37px (comfortable), at 12px it is -0.12px. The font feature setting "numr" (numeral alternates) is enabled on both families globally, making tabular figures consistent in price displays and counters.

## Layout Philosophy

Full-bleed sections stacked vertically, each internally centered within a max-width container of ~1440px. Hero sections are vertically tall (~800px+) with centered single-product photography — no split layouts, no sidebars. Feature sections alternate between centered text-and-image stacks and 2-column image+text pairings. Cards are used sparingly as content modules, not as layout scaffolding — the page reads as one continuous editorial scroll rather than a dashboard. Navigation is a single persistent 44px top bar; no side nav, no breadcrumbs. Section rhythm: 80px between editorial sections, 40px between adjacent cards, 10–12px between paired elements within a section.

## Visual Language

Product photography dominates — every editorial section is anchored by a single high-resolution product render on pure white, often photographed at a 15–25° angle rather than flat-on. Photography treatment is clean and high-key: pure white seamless backgrounds, no lifestyle staging, no human models, no props. Illustrations are absent — the visual language is 100% product photography plus typography. Icons are minimal and monochrome: SF Symbols-style outlined or filled glyphs in #1d1d1f or #313131, 1.5–2px stroke weight. Decorative use of color is limited to one product hero gradient wash (linear-gradient #004c94 → #297bc4) and the Apple Intelligence rainbow gradient (blue → violet → red → orange) — both rare and reserved for specific product stories. Density is image-heavy in hero zones, text-dominant in feature grids.

## Similar Brands

- **Tesla** — Same single-product hero with pure-white canvas, oversized weight-600 headline, and absence of traditional navigation chrome.
- **Bang & Olufsen** — Same monochrome restraint with product photography as the dominant visual element, generous negative space, and one accent color for action.
- **Nothing.tech** — Same typographic-driven hierarchy with weight-600 display headlines on near-white canvas and pill-shaped button affordances.
- **Linear** — Same strict two-family typography system (one display, one text), tight letter-spacing, and near-zero use of borders or shadows on surfaces.
- **Dyson** — Same high-key product photography on white, editorial section rhythm with oversized headlines, and minimal button chrome — text-link style CTAs.

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-pure-white: #ffffff;
  --color-fog-mist: #f3f6f6;
  --color-paper-gray: #fafafc;
  --color-silver-smoke: #e8e8ed;
  --color-ash-border: #dedfe2;
  --color-graphite: #6e6e73;
  --color-charcoal: #444545;
  --color-steel: #313131;
  --color-near-black: #1d1d1f;
  --color-true-black: #000000;
  --color-apple-blue: #0071e3;
  --color-link-blue: #0066cc;
  --color-ember: #b64400;
  --color-ocean-depth: #004c94;
  --gradient-ocean-depth: linear-gradient(rgb(0, 76, 148) 45%, rgb(41, 123, 196) 90%);

  /* Typography — Font Families */
  --font-sf-pro-text: 'SF Pro Text', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-sf-pro-display: 'SF Pro Display', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.33;
  --tracking-caption: -0.12px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.43;
  --tracking-body-sm: -0.22px;
  --text-body: 17px;
  --leading-body: 1.47;
  --tracking-body: -0.37px;
  --text-subheading: 21px;
  --leading-subheading: 1.38;
  --tracking-subheading: 0.23px;
  --text-heading-sm: 28px;
  --leading-heading-sm: 1.14;
  --tracking-heading-sm: 0.2px;
  --text-heading: 40px;
  --leading-heading: 1.1;
  --tracking-heading: -0.12px;
  --text-heading-lg: 56px;
  --leading-heading-lg: 1.07;
  --tracking-heading-lg: -0.28px;
  --text-display: 80px;
  --leading-display: 1.05;
  --tracking-display: -1.2px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-semibold: 600;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-9: 9px;
  --spacing-10: 10px;
  --spacing-11: 11px;
  --spacing-13: 13px;
  --spacing-14: 14px;
  --spacing-19: 19px;
  --spacing-20: 20px;
  --spacing-25: 25px;
  --spacing-28: 28px;
  --spacing-30: 30px;
  --spacing-40: 40px;
  --spacing-44: 44px;
  --spacing-57: 57px;
  --spacing-83: 83px;

  /* Layout */
  --page-max-width: 1440px;
  --section-gap: 80px;
  --card-padding: 40px;
  --element-gap: 10px;

  /* Border Radius */
  --radius-xl: 12px;
  --radius-3xl: 24px;
  --radius-3xl-2: 28px;
  --radius-3xl-3: 32px;
  --radius-3xl-4: 36px;
  --radius-full: 170px;
  --radius-full-2: 980px;
  --radius-full-3: 9999px;

  /* Named Radii */
  --radius-cards: 28px;
  --radius-chips: 9999px;
  --radius-buttons: 980px;
  --radius-nav-pill: 32px;
  --radius-small-elements: 12px;

  /* Shadows */
  --shadow-subtle: rgba(0, 0, 0, 0.11) 0px 0px 1px 0px inset;
  --shadow-xl: rgba(0, 0, 0, 0.05) 0px 0px 35px 20px;

  /* Surfaces */
  --surface-pure-white-canvas: #ffffff;
  --surface-fog-mist: #f3f6f6;
  --surface-paper-gray: #fafafc;
  --surface-silver-smoke-card: #e8e8ed;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-pure-white: #ffffff;
  --color-fog-mist: #f3f6f6;
  --color-paper-gray: #fafafc;
  --color-silver-smoke: #e8e8ed;
  --color-ash-border: #dedfe2;
  --color-graphite: #6e6e73;
  --color-charcoal: #444545;
  --color-steel: #313131;
  --color-near-black: #1d1d1f;
  --color-true-black: #000000;
  --color-apple-blue: #0071e3;
  --color-link-blue: #0066cc;
  --color-ember: #b64400;
  --color-ocean-depth: #004c94;

  /* Typography */
  --font-sf-pro-text: 'SF Pro Text', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-sf-pro-display: 'SF Pro Display', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.33;
  --tracking-caption: -0.12px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.43;
  --tracking-body-sm: -0.22px;
  --text-body: 17px;
  --leading-body: 1.47;
  --tracking-body: -0.37px;
  --text-subheading: 21px;
  --leading-subheading: 1.38;
  --tracking-subheading: 0.23px;
  --text-heading-sm: 28px;
  --leading-heading-sm: 1.14;
  --tracking-heading-sm: 0.2px;
  --text-heading: 40px;
  --leading-heading: 1.1;
  --tracking-heading: -0.12px;
  --text-heading-lg: 56px;
  --leading-heading-lg: 1.07;
  --tracking-heading-lg: -0.28px;
  --text-display: 80px;
  --leading-display: 1.05;
  --tracking-display: -1.2px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-9: 9px;
  --spacing-10: 10px;
  --spacing-11: 11px;
  --spacing-13: 13px;
  --spacing-14: 14px;
  --spacing-19: 19px;
  --spacing-20: 20px;
  --spacing-25: 25px;
  --spacing-28: 28px;
  --spacing-30: 30px;
  --spacing-40: 40px;
  --spacing-44: 44px;
  --spacing-57: 57px;
  --spacing-83: 83px;

  /* Border Radius */
  --radius-xl: 12px;
  --radius-3xl: 24px;
  --radius-3xl-2: 28px;
  --radius-3xl-3: 32px;
  --radius-3xl-4: 36px;
  --radius-full: 170px;
  --radius-full-2: 980px;
  --radius-full-3: 9999px;

  /* Shadows */
  --shadow-subtle: rgba(0, 0, 0, 0.11) 0px 0px 1px 0px inset;
  --shadow-xl: rgba(0, 0, 0, 0.05) 0px 0px 35px 20px;
}
```
