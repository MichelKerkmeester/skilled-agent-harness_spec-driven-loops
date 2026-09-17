# Essie Wine — Style Reference
> Dusty rose chapbook with mustard chapter breaks

**Theme:** mixed

Essie Wine is an editorial neighborhood-wine-bar identity: three full-bleed color fields (dusty rose, warm white, mustard olive) stitched together by generous vertical breathing room and serif type that reads like a small magazine spread. Color is deployed as atmosphere, not accent — the entire page is the brand, and components are reduced to thin hairline rules, all-caps Elementa labels, and BasicCommercial serif body copy. The illustration in the hero is a single detailed line-art scene that does the storytelling work a SaaS site would delegate to feature cards and metrics. Interactions are quiet: ghost buttons, borderless inputs, no shadows, no gradients, no rounded corners — the only depth comes from section-to-section color shifts.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Ink Teal | `#062d32` | `--color-ink-teal` | Primary type, illustration linework, nav wordmark, heading hairlines — the near-black that reads as warm ink rather than flat black, giving the serif type a hand-printed quality |
| Dusty Rose | `#c9a9b5` | `--color-dusty-rose` | Hero section field — the signature chapter color. Used as a full-bleed canvas behind the line-art illustration to create the soft, sun-bleached, evening-light atmosphere |
| Mustard Olive | `#aa9e54` | `--color-mustard-olive` | Booking and function-section field — the warm, earthy second chapter. Appears as a full-bleed background that pushes serif headings and form labels into high-contrast territory |
| Slate Teal | `#344b52` | `--color-slate-teal` | Secondary text, link borders, tertiary headings — a lighter wash of Ink Teal for passages that shouldn't compete with the primary wordmark |
| Warm Bone | `#e9e9e2` | `--color-warm-bone` | Soft canvas variant, off-white surface, hairline divider tone — the off-white that warms the page between full-color sections |
| Mid Gray | `#767676` | `--color-mid-gray` | Input rule color — the single mid-gray used for form-field bottom borders, giving inputs a printed-on-paper feel rather than a digital-frame feel |
| Carbon | `#000000` | `--color-carbon` | Maximum-contrast text, form labels, submit-button type — pure black is reserved for the moments that need to feel stamped or pressed |
| Paper White | `#ffffff` | `--color-paper-white` | Default page canvas and the lightest of the three section fields. Provides the resting breath between the rose hero and the mustard form |

## Tokens — Typography

### BasicCommercial LT Com Roman — Primary serif for body copy and mid-size headings. The transitional serif does the heavy editorial lifting — long-form descriptions, section headers, booking copy. Light weight (300) on display sizes gives the type a drawn-on-paper confidence rather than a marketing-bold shout. · `--font-basiccommercial-lt-com-roman`
- **Substitute:** Freight Text Pro, Lora, EB Garamond
- **Weights:** 300, 400
- **Sizes:** 19px, 38px, 49px
- **Line height:** 1.16, 1.18, 1.20
- **Letter spacing:** 0.003em–0.026em (very tight on display, opening up to ~0.026em on body)
- **Role:** Primary serif for body copy and mid-size headings. The transitional serif does the heavy editorial lifting — long-form descriptions, section headers, booking copy. Light weight (300) on display sizes gives the type a drawn-on-paper confidence rather than a marketing-bold shout.

### Adobe Caslon — Display serif reserved for the largest editorial headings. Caslon's old-style figures and bracketed serifs are used sparingly as a typographic event — when it appears, it signals 'this is the title, read me first.' · `--font-adobe-caslon`
- **Substitute:** Caslon, Garamond Premier Pro Display
- **Weights:** 300
- **Sizes:** 49px
- **Line height:** 1.18
- **Letter spacing:** 0.003em
- **Role:** Display serif reserved for the largest editorial headings. Caslon's old-style figures and bracketed serifs are used sparingly as a typographic event — when it appears, it signals 'this is the title, read me first.'

### Elementa — Geometric sans for nav, buttons, form labels, and the wordmark. Always set in small caps with positive tracking — it functions as the 'metadata' voice. Its 0.042em letter-spacing on 16px is the single most distinctive micro-typographic decision on the site: it makes every label read as a printed stamp rather than a UI element. · `--font-elementa`
- **Substitute:** Suisse Int'l, Inter, Work Sans
- **Weights:** 300, 400
- **Sizes:** 16px, 19px
- **Line height:** 1.00, 1.16
- **Letter spacing:** 0.008em at body, opening to 0.042em (~0.67px) on small caps
- **Role:** Geometric sans for nav, buttons, form labels, and the wordmark. Always set in small caps with positive tracking — it functions as the 'metadata' voice. Its 0.042em letter-spacing on 16px is the single most distinctive micro-typographic decision on the site: it makes every label read as a printed stamp rather than a UI element.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 16px | 1.16 | 0.67px | `--text-caption` |
| subheading | 19px | 1.18 | 0.5px | `--text-subheading` |
| heading | 38px | 1.2 | 0.15px | `--text-heading` |
| display | 49px | 1.18 | 0.15px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** spacious

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 8 | 8px | `--spacing-8` |
| 20 | 20px | `--spacing-20` |
| 40 | 40px | `--spacing-40` |
| 68 | 68px | `--spacing-68` |
| 100 | 100px | `--spacing-100` |
| 136 | 136px | `--spacing-136` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 0px |
| cards | 0px |
| inputs | 0px |
| buttons | 0px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 150px
- **Card padding:** 27px
- **Element gap:** 23px

## Components

### Top Navigation Bar
**Role:** Primary site navigation

Single horizontal row spanning full viewport width. 'Essie Wine' wordmark in Elementa small caps at far left. Nav links (About, Bookings, Functions, Private Dining, Menu, Functions, Vouchers, Contact) spread across the top in Elementa weight 300, ~16px, letter-spacing 0.042em, color #062d32. 35px column gap between links. No background fill — sits directly on whatever section color is beneath. Sticky, minimal, no logo treatment beyond the wordmark.

### Hero Illustration Panel
**Role:** Above-the-fold brand storytelling

Full-bleed #c9a9b5 dusty-rose canvas. Single large editorial line-art illustration in #062d32 stroke — roughly 60% of viewport width, centered. The illustration is detailed: figures, a bicycle, bottles, a dog, the storefront facade, a person reading on the roof. No headline, no CTA — the illustration is the hero. Generous vertical padding (~150px top/bottom).

### Centered Serif Body Block
**Role:** Long-form editorial description

White (#ffffff) or off-white (#e9e9e2) full-bleed section. Body copy in BasicCommercial weight 300–400, ~38–49px, centered, max-width ~900px. Line-height 1.18–1.20. Color #062d32. This is the 'About' / 'Nestled in the backstreets…' pattern — one paragraph, one column, no sidebar, no images. 150px section padding top and bottom.

### Section Heading (Serif Display)
**Role:** Chapter title for colored sections

Centered, BasicCommercial or Caslon weight 300, ~38–49px, line-height 1.18, color #000000 on colored fields, color #062d32 on white. Sits at the top of full-bleed color sections with ~100–150px top padding. Functions as a printed chapter title — no eyebrow, no kicker, no decoration.

### Underline Input Field
**Role:** Form data entry

Bottom-border-only input, no box. 1px bottom border in #767676, no radius, no background fill, transparent on the colored field. Label set in Elementa small caps, ~16px, letter-spacing 0.042em, color #000000, positioned above the input with 8px gap. Input text in BasicCommercial weight 400, ~19px, color #062d32. Two-column grid (50/50) with 27px row gap on the booking form.

### Outlined Submit Button
**Role:** Primary form action

Full-width 1px black border, transparent fill, 27px vertical padding, 40px horizontal padding. Text in Elementa small caps, weight 300, letter-spacing 0.042em, color #000000. No radius, no shadow, no fill on hover — the border is the only signifier. This is the outlined chromatic action, not a filled CTA.

### Ghost Nav Link
**Role:** Top-bar navigation item

Elementa weight 300, 16px, letter-spacing 0.042em, color #062d32. No underline by default; 3px bottom border in #062d32 on hover/active. 3px padding-bottom. The hover border is the only state change — no fill, no color shift.

### Footer (Dusty Rose Repeat)
**Role:** Page closure

Repeats the #c9a9b5 dusty-rose field from the hero, creating a 'envelope' effect: the page opens and closes on the same color. Contains wordmark, contact details, and a small editorial illustration motif. Same #062d32 linework treatment.

## Do's and Don'ts

### Do
- Use the three chapter colors as full-bleed section fields: #c9a9b5 rose, #aa9e54 mustard, #ffffff white. Never tint them, mix them, or apply them as small accents.
- Set all labels, nav items, and button text in Elementa small caps with 0.042em letter-spacing — the printed-stamp tracking is the signature micro-typographic move.
- Use #062d32 Ink Teal for all primary type and illustration linework. Reserve #000000 Carbon for the highest-contrast moments (form labels, submit button).
- Give sections 100–150px vertical padding and use 150px as the default section-gap. The page should breathe like a printed page, not a dashboard.
- Use bottom-border-only inputs (1px #767676) with no box, no fill, no radius. The input field IS a printed line on a colored page.
- Let one large serif paragraph (BasicCommercial 38–49px) carry editorial sections. Do not split editorial body copy into multiple short paragraphs or sub-headings.
- Keep all corners square — 0px radius everywhere. The design's identity is print, not material.

### Don't
- Do not introduce a filled CTA button. The only action is the outlined submit button with a 1px black border and transparent fill.
- Do not use shadows, gradients, or any elevation effect. Depth comes from section color shifts only.
- Do not use photography, product shots, or 3D renders. The line-art illustration in #062d32 is the only imagery.
- Do not apply the chapter colors (#c9a9b5, #aa9e54) as small accent swatches, badges, or icon fills — they are full-bleed fields, not accents.
- Do not add a sticky/floating action bar, mega-menu, sidebar, or any persistent secondary navigation. The top bar is the only chrome.
- Do not round corners, use pill shapes, or apply any border-radius. All containers, buttons, and inputs are sharp-cornered.
- Do not use multiple sans-serif weights to create hierarchy. Hierarchy comes from the serif/sans pairing and size, not from bold/regular variation.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Paper White | `#ffffff` | Default canvas for body-text and 'About'-style editorial sections. |
| 2 | Warm Bone | `#e9e9e2` | Soft warm off-white for secondary surfaces, table-like panels, and hairline-rule tone. |
| 3 | Dusty Rose | `#c9a9b5` | Hero and atmospheric chapter field — the full-bleed brand color. |
| 4 | Mustard Olive | `#aa9e54` | Booking, functions, and form chapter field — the warm accent surface. |

## Elevation

Elevation is deliberately absent. The design rejects shadows, glows, and depth effects entirely — depth is communicated only through section-to-section color shifts (white → rose → mustard → white). All components sit flat on their color fields with hairline borders as the sole divider. This is a print-zine translation to the web: pages lie on the surface rather than floating above it.

## Imagery

Imagery is restricted to a single hero illustration in a detailed editorial line-art style — fine ~1.5px strokes in #062d32 ink-teal on the #c9a9b5 dusty-rose field. The illustration depicts a neighborhood wine-bar scene: storefront facade, figures with wine glasses, a cyclist, a dog, bottles on shelves, a person reading on the roof. No photography anywhere on the site. No product shots, no lifestyle photography, no abstract graphics. The illustration is the entire visual identity, and it appears once at full scale in the hero — it is not used as repeated decoration.

## Layout

Full-bleed section stack with no persistent sidebar or container. Each section occupies 100% viewport width and alternates between three color fields: dusty rose (hero/footer), paper white (editorial body), and mustard olive (forms/functions). Content is centered within each section with a ~1200px content max-width. The hero is an illustrated scene with no headline overlay; the about section is a single centered paragraph of large serif text; the booking section is a centered heading over a 2-column form grid. Navigation is a single minimal top bar present on every section. Section vertical padding is generous (100–150px) creating a slow, editorial scroll rhythm — one chapter per viewport rather than multiple stacked components. No card grids, no pricing tables, no feature columns — the layout is vertical storytelling, not dashboard architecture.

## Agent Prompt Guide

**Quick Color Reference**
- text: #062d32 (Ink Teal)
- background: #ffffff (Paper White)
- border: #767676 (Mid Gray) for inputs, #062d32 for nav/illustration
- accent: #c9a9b5 (Dusty Rose) and #aa9e54 (Mustard Olive) — used as full-bleed section fields, never as small UI accents
- primary action: #062d32 (outlined action border)

**Example Component Prompts**

1. **Hero Section**: Full-bleed #c9a9b5 dusty-rose background, 150px top/bottom padding. Single line-art illustration in #062d32 stroke centered, ~60% viewport width. No headline, no subtext, no button — the illustration is the hero.

2. **About / Editorial Body Block**: Full-bleed #ffffff background, 150px section padding. Centered BasicCommercial serif, weight 300, 49px, line-height 1.18, color #062d32, max-width 900px. One paragraph, no headings, no images.

3. **Section Heading on Mustard Field**: Full-bleed #aa9e54 background, 150px top padding. Caslon serif, weight 300, 49px, line-height 1.18, color #000000, centered. 100px bottom padding before form.

4. **Booking Form**: Two-column grid (50/50, 27px row gap) on #aa9e54 field. Each field: Elementa small-caps label (16px, 0.042em tracking, #000000) above, then 1px #767676 bottom-border input with BasicCommercial 19px text in #062d32. No boxes, no fill, 0px radius.

5. **Top Navigation**: Single row, full width, transparent background. 'Essie Wine' wordmark left in Elementa 16px small caps, 0.042em tracking, #062d32. Nav links spread across top with 35px column gap, same type spec. 3px #062d32 bottom border on hover/active.

## Similar Brands

- **Ruby Wine (neighborhood wine bars using editorial serif identity)** — Same full-bleed muted color fields and serif body copy used to evoke a printed neighborhood guide rather than a commerce site.
- **Maison Premiere (bar/restaurant brand sites)** — Same single-hero-illustration approach with all type set in serif at large sizes, no card grids or product UI.
- **Sweetgreen (early site era, pre-app pivot)** — Same sparse section rhythm with generous vertical padding and full-bleed colored chapter blocks.
- **Aesop (product brand sites with editorial restraint)** — Same near-zero decoration, serif-only hierarchy, and full-bleed off-white/earth-tone field alternation.

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-ink-teal: #062d32;
  --color-dusty-rose: #c9a9b5;
  --color-mustard-olive: #aa9e54;
  --color-slate-teal: #344b52;
  --color-warm-bone: #e9e9e2;
  --color-mid-gray: #767676;
  --color-carbon: #000000;
  --color-paper-white: #ffffff;

  /* Typography — Font Families */
  --font-basiccommercial-lt-com-roman: 'BasicCommercial LT Com Roman', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-adobe-caslon: 'Adobe Caslon', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-elementa: 'Elementa', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 16px;
  --leading-caption: 1.16;
  --tracking-caption: 0.67px;
  --text-subheading: 19px;
  --leading-subheading: 1.18;
  --tracking-subheading: 0.5px;
  --text-heading: 38px;
  --leading-heading: 1.2;
  --tracking-heading: 0.15px;
  --text-display: 49px;
  --leading-display: 1.18;
  --tracking-display: 0.15px;

  /* Typography — Weights */
  --font-weight-light: 300;
  --font-weight-regular: 400;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-8: 8px;
  --spacing-20: 20px;
  --spacing-40: 40px;
  --spacing-68: 68px;
  --spacing-100: 100px;
  --spacing-136: 136px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 150px;
  --card-padding: 27px;
  --element-gap: 23px;

  /* Named Radii */
  --radius-tags: 0px;
  --radius-cards: 0px;
  --radius-inputs: 0px;
  --radius-buttons: 0px;

  /* Surfaces */
  --surface-paper-white: #ffffff;
  --surface-warm-bone: #e9e9e2;
  --surface-dusty-rose: #c9a9b5;
  --surface-mustard-olive: #aa9e54;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-ink-teal: #062d32;
  --color-dusty-rose: #c9a9b5;
  --color-mustard-olive: #aa9e54;
  --color-slate-teal: #344b52;
  --color-warm-bone: #e9e9e2;
  --color-mid-gray: #767676;
  --color-carbon: #000000;
  --color-paper-white: #ffffff;

  /* Typography */
  --font-basiccommercial-lt-com-roman: 'BasicCommercial LT Com Roman', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-adobe-caslon: 'Adobe Caslon', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-elementa: 'Elementa', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 16px;
  --leading-caption: 1.16;
  --tracking-caption: 0.67px;
  --text-subheading: 19px;
  --leading-subheading: 1.18;
  --tracking-subheading: 0.5px;
  --text-heading: 38px;
  --leading-heading: 1.2;
  --tracking-heading: 0.15px;
  --text-display: 49px;
  --leading-display: 1.18;
  --tracking-display: 0.15px;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-20: 20px;
  --spacing-40: 40px;
  --spacing-68: 68px;
  --spacing-100: 100px;
  --spacing-136: 136px;
}
```
