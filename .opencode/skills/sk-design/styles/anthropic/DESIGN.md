# Anthropic — Style Reference
> scientific field journal on warm parchment — quiet ivory surfaces, editorial serif headlines, and a single clay accent that only appears when you must act

**Theme:** light

Anthropic's interface reads like a curated research publication on warm parchment paper. Ivory and oat neutrals replace the typical cool-gray tech palette, giving every surface a paper-like quality that pairs with a custom serif used at unprecedented scale for both body and display text. A single clay-toned accent surfaces only at moments of action; everything else stays quiet and editorial. Components are flat — hairline borders and selective bottom-corner radii replace shadows as the elevation language, sans-serif handles UI chrome, and the serif carries voice.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Slate Dark | `#141413` | `--color-slate-dark` | Primary text, headings, footer background, hairline borders — near-black with a hint of warmth, never pure black |
| Ivory Medium | `#f0eee6` | `--color-ivory-medium` | Page canvas and large surface fills — the parchment background that sets the entire warm tone |
| Ivory Light | `#faf9f5` | `--color-ivory-light` | Card surfaces, elevated panels, skip-link buttons — one step brighter than canvas for subtle layering without shadows |
| Cloud Medium | `#b0aea5` | `--color-cloud-medium` | Muted helper text, inactive nav items, secondary labels — the neutral that recedes without disappearing |
| Cloud Dark | `#87867f` | `--color-cloud-dark` | Outlined button borders, mid-contrast dividers |
| Stone | `#cccbc8` | `--color-stone` | Hairline borders and dividers between sections — visible but never assertive |
| Slate Medium | `#3d3d3a` | `--color-slate-medium` | Dark-on-dark borders inside the footer |
| Oat Warm | `#e3dacc` | `--color-oat-warm` | Secondary warm surface for grouped panels and feature containers — a deeper paper tone for variety |
| Manilla | `#f5e3c7` | `--color-manilla` | Featured hero card background — vintage paper tone that signals editorial importance without color shouting |
| Clay | `#d97757` | `--color-clay` | Filled CTA buttons (e.g. cookie consent accept) — the single chromatic accent in the system, a terracotta warmth that belongs to the earth-tone family rather than typical UI blue |
| Clay Deep | `#c6613f` | `--color-clay-deep` | Hover/pressed state for Clay CTAs and the canonical accent token — deeper version of the primary accent |

## Tokens — Typography

### Anthropic Serif — Editorial voice — used for the display heading at 68px, all body copy at 20px, card titles, and supporting paragraphs. The serif carries personality; its presence in body text (unusual for tech sites) signals research-publication DNA. Weight 400 is default, 600 for emphasis. · `--font-anthropic-serif`
- **Substitute:** Georgia, Source Serif Pro, Charter
- **Weights:** 400, 600
- **Sizes:** 14px, 18px, 20px, 24px, 68px
- **Line height:** 1.10, 1.40, 1.43
- **Letter spacing:** normal
- **Role:** Editorial voice — used for the display heading at 68px, all body copy at 20px, card titles, and supporting paragraphs. The serif carries personality; its presence in body text (unusual for tech sites) signals research-publication DNA. Weight 400 is default, 600 for emphasis.

### Anthropic Sans — UI chrome and display sans — nav links, buttons, footers, badges, and the bold sans display heading at 61px weight 700. The 61px sans display sits beside the 68px serif display as a deliberate dual-system: sans shouts declarative statements, serif reads as editorial essay. · `--font-anthropic-sans`
- **Substitute:** Inter, system-ui, Arial
- **Weights:** 400, 500, 600, 700
- **Sizes:** 12px, 15px, 16px, 20px, 24px, 61px
- **Line height:** 1.00, 1.10, 1.25, 1.30, 1.40
- **Letter spacing:** -0.0200em at 12px (tight nav/caption tracking), -0.0050em at 15-16px (subtle UI tightening), -0.0020em at larger sizes
- **Role:** UI chrome and display sans — nav links, buttons, footers, badges, and the bold sans display heading at 61px weight 700. The 61px sans display sits beside the 68px serif display as a deliberate dual-system: sans shouts declarative statements, serif reads as editorial essay.

### Anthropic Mono — Reserved for code or technical snippets — appears sparingly · `--font-anthropic-mono`
- **Substitute:** JetBrains Mono, SF Mono, Menlo
- **Weights:** 400
- **Sizes:** 16px
- **Line height:** 1.40
- **Role:** Reserved for code or technical snippets — appears sparingly

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.4 | -0.24px | `--text-caption` |
| body-sm | 16px | 1 | -0.08px | `--text-body-sm` |
| body | 20px | 1.4 | — | `--text-body` |
| subheading | 24px | 1.3 | -0.05px | `--text-subheading` |
| heading | 61px | 1.1 | -0.12px | `--text-heading` |
| display | 68px | 1.1 | — | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** compact

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 8 | 8px | `--spacing-8` |
| 12 | 12px | `--spacing-12` |
| 16 | 16px | `--spacing-16` |
| 24 | 24px | `--spacing-24` |
| 32 | 32px | `--spacing-32` |
| 76 | 76px | `--spacing-76` |
| 100 | 100px | `--spacing-100` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 0px |
| cards | 24px |
| links | 0px |
| badges | 0px |
| buttons | 8px (bottom-only on filled variants), 12px (outlined) |

### Layout

- **Page max-width:** 1280px
- **Section gap:** 80-120px
- **Card padding:** 24-32px
- **Element gap:** 8px

## Components

### Text Link Button
**Role:** Primary inline link styled as a button — used for navigation and inline actions

Transparent background, #141413 text color, no border, 0px radius, padding 22px 12px. Underline appears on hover. No background fill at any state — this is text that happens to be clickable, not a container.

### Filled Ivory Button
**Role:** Primary action button on light surfaces

Background #faf9f5, text #141413, bottom-only border-radius 8px (top corners sharp), padding 12px 31px. The bottom-only radius is a signature choice — the button reads like a tab or card pulled from a stack, not a generic pill. No border, no shadow.

### Outlined Dark Button
**Role:** Secondary action on dark backgrounds (cookie consent, modal footer)

Transparent background, #ffffff text, 1px border in #87867f, 12px radius, padding 8px 16px. Compact size, ghost treatment that lets the dark background show through.

### Clay Filled Button
**Role:** The single chromatic CTA — used sparingly for the most consequential actions

Background #d97757, white text, 8px radius, padding matching Filled Ivory Button proportions. Reserved for moments where acceptance must be visually distinct from the rest of the editorial interface. Deepens to #c6613f on hover.

### Featured Hero Card
**Role:** Large editorial card for announcements and story highlights

Background #f5e3c7 (manilla), 24px border-radius, no shadow, no border. Generous internal padding (~48-64px) to accommodate large serif display text and editorial illustration. The warm paper tone separates it from ivory cards without using color.

### Release Card
**Role:** Compact card for latest releases grid

Background #faf9f5, 24px radius, 1px border in #cccbc8 or no border, padding ~24px. Title in Anthropic Sans 24px weight 600 or Anthropic Serif 20px, body in serif 20px. Three-column grid layout.

### Top Navigation Bar
**Role:** Sticky site navigation

Transparent or #f0eee6 background, logo left in Anthropic Sans 12px weight 700 all-caps letter-spaced, nav links right-aligned at 12px sans with #b0aea5 hover-to-#141413 transition. Dropdown indicators as chevrons. The 'Try Claude' button on the right uses Filled Ivory Button styling. No background blur, no shadow.

### Footer
**Role:** Dark closing section with link columns

Full-bleed #141413 background, #faf9f5 text, multi-column link grid with 8px link gaps. Section headings in sans 12px weight 600, link items in sans 12px at #b0aea5. The dark footer is the only inversion in the system — a final grounded anchor after all the parchment above.

### Hero Heading Block
**Role:** Asymmetric first-screen composition

Two-column layout: left holds Anthropic Sans 61px weight 700 heading with inline underlined links mid-phrase; right holds supporting serif paragraph at 20px. Generous whitespace around the block. Headings use #141413, supporting text #141413 at reduced visual weight.

### Inline Underlined Link
**Role:** Text link embedded in paragraphs and headings

No background, text inherits parent color (#141413), 1px underline always visible (not just on hover) in #141413. The persistent underline is editorial — it matches print convention where links are typeset with underlines, not the UI convention of reveal-on-hover.

### Badge / Inline Label
**Role:** Small tag for categories and metadata

Transparent background, #141413 text, 0px radius, no padding above/below the text baseline. Effectively just bold or weighted text in flow — not a container. Used sparingly.

### Cookie Consent Bar
**Role:** Bottom-pinned consent prompt

Dark band (#141413 background) or dark overlay containing body text and three action buttons: Filled Ivory Button (Accept), Outlined Dark Button (Customize, Reject). The contrast inversion makes consent legible against the parchment above.

### Skip Link
**Role:** Accessibility utility for keyboard navigation

Background #faf9f5, text #141413, small padding, visible only on focus. Positioned absolutely at the top edge.

## Do's and Don'ts

### Do
- Use Anthropic Serif at 20px for all body copy and Anthropic Sans at 12-16px for UI chrome — the serif/sans split defines the system's voice.
- Use #f0eee6 as the page canvas and #faf9f5 for cards; reach for #f5e3c7 only when a card needs to feel like a featured editorial spread.
- Use the bottom-only 8px radius on filled buttons (Filled Ivory Button); this signature corner treatment replaces the generic pill.
- Use #d97757 Clay exclusively for the most consequential single CTA on any given page; never apply it to multiple actions or decorative elements.
- Keep underlines persistent on inline links — editorial print convention, not reveal-on-hover.
- Reach for 24px radius on all card-level surfaces to maintain the paper-stacked feel.
- Use the 61px sans weight 700 paired with the 68px serif weight 400 as the dual display system — sans for declarative statements, serif for editorial reflection.

### Don't
- Don't introduce cool grays, blues, or any color outside the warm earth-tone family — the palette is ivory/oat/clay, period.
- Don't use box-shadow for elevation — this system elevates through surface tone (#f0eee6 → #faf9f5 → #f5e3c7) and 1px borders only.
- Don't use the Clay accent for decoration, icons, hover states, or non-CTA elements; reserve #d97757 for filled action buttons only.
- Don't set body text in sans-serif — body must be serif at 20px; sans is UI chrome only.
- Don't apply uniform border-radius to buttons; the bottom-only 8px is a signature, not a default that should be rounded everywhere.
- Don't use bright white (#ffffff) as a surface — the system is ivory-tinted throughout (#faf9f5, #f0eee6, #f5e3c7); pure white would feel clinical and break the paper metaphor.
- Don't add gradients, glows, or color washes to backgrounds; surfaces are flat solid fills only.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#f0eee6` | Page-level background — the parchment that everything sits on |
| 1 | Card Surface | `#faf9f5` | Standard card and elevated panel — one tonal step above canvas |
| 2 | Warm Feature Surface | `#f5e3c7` | Featured hero card and editorial highlights — manilla paper tone for visual emphasis |
| 3 | Deep Warm Surface | `#e3dacc` | Secondary grouped panels and deeper warm containers |
| 4 | Inversion Surface | `#141413` | Footer and dark utility bands — the only dark surface in the system |

## Elevation

- **Card:** `none — elevated through surface tone shift, not shadow`
- **Button:** `none — identity through fill color and bottom-corner radius`
- **Navigation:** `none — flat, relies on tonal difference from page canvas`

## Imagery

Imagery leans heavily into vintage scientific illustration: the hero feature card contains a dense botanical/zoological collage of butterflies and moths rendered in classic naturalist plate style, evoking 19th-century field guides. Illustrations are warm-toned to harmonize with the parchment background rather than pop against it. No photography, no product screenshots, no abstract gradients. Iconography is minimal — small chevrons for dropdowns and sparse line indicators, always in the same warm-neutral family as text. The visual density is low: large blocks of text and whitespace dominate, with imagery appearing only at hero-feature scale.

## Agent Prompt Guide

## Quick Color Reference
- text: #141413 (Slate Dark)
- background: #f0eee6 (Ivory Medium)
- card surface: #faf9f5 (Ivory Light)
- border: #cccbc8 (Stone)
- muted text: #b0aea5 (Cloud Medium)
- primary action: #d97757 (filled action)

## Example Component Prompts

1. **Hero section**: Canvas #f0eee6. Left column: headline at 61px Anthropic Sans weight 700, #141413, letter-spacing -0.12px. Inline links within the headline underlined persistently in #141413. Right column: supporting paragraph at 20px Anthropic Serif weight 400, #141413. Two-column layout, max-width 1280px centered, generous vertical padding (~120px top).

2. Create a Primary Action Button: #d97757 background, #141413 text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.

3. **Three-column release grid**: Three cards on #f0eee6 canvas, each card #faf9f5 with 24px radius and 24px padding. Card title at 24px Anthropic Sans weight 600, #141413. Card body at 20px Anthropic Serif weight 400, #141413. Inline link at bottom: 'Model details →' in #141413 with persistent underline.


5. **Dark footer**: Full-bleed #141413 background, #faf9f5 text, max-width 1280px content centered. Column headings at 12px Anthropic Sans weight 600, #faf9f5. Link items at 12px sans weight 400, #b0aea5 with 8px vertical gaps.

## Similar Brands

- **Arc Browser** — Same warm parchment neutrals and nature-inspired accent palette, editorial type treatment, and rejection of cold tech-blue UI conventions
- **Stripe** — Editorial documentation aesthetic with serif body text paired with sans UI, warm grays instead of cool blues, and section-based max-width reading layout
- **Notion** — Type-driven minimal interface where typography carries hierarchy more than color or shadow, generous whitespace, restrained palette
- **Linear** — Monochrome restraint and the discipline of using a single accent color only at decisive action moments
- **Cursor** — Contemporary AI-product visual language with custom sans + serif type pairing and minimal decorative chrome

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-slate-dark: #141413;
  --color-ivory-medium: #f0eee6;
  --color-ivory-light: #faf9f5;
  --color-cloud-medium: #b0aea5;
  --color-cloud-dark: #87867f;
  --color-stone: #cccbc8;
  --color-slate-medium: #3d3d3a;
  --color-oat-warm: #e3dacc;
  --color-manilla: #f5e3c7;
  --color-clay: #d97757;
  --color-clay-deep: #c6613f;

  /* Typography — Font Families */
  --font-anthropic-serif: 'Anthropic Serif', ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
  --font-anthropic-sans: 'Anthropic Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-anthropic-mono: 'Anthropic Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.4;
  --tracking-caption: -0.24px;
  --text-body-sm: 16px;
  --leading-body-sm: 1;
  --tracking-body-sm: -0.08px;
  --text-body: 20px;
  --leading-body: 1.4;
  --text-subheading: 24px;
  --leading-subheading: 1.3;
  --tracking-subheading: -0.05px;
  --text-heading: 61px;
  --leading-heading: 1.1;
  --tracking-heading: -0.12px;
  --text-display: 68px;
  --leading-display: 1.1;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-76: 76px;
  --spacing-100: 100px;

  /* Layout */
  --page-max-width: 1280px;
  --section-gap: 80-120px;
  --card-padding: 24-32px;
  --element-gap: 8px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-3xl: 24px;

  /* Named Radii */
  --radius-nav: 0px;
  --radius-cards: 24px;
  --radius-links: 0px;
  --radius-badges: 0px;
  --radius-buttons: 8px (bottom-only on filled variants), 12px (outlined);

  /* Surfaces */
  --surface-canvas: #f0eee6;
  --surface-card-surface: #faf9f5;
  --surface-warm-feature-surface: #f5e3c7;
  --surface-deep-warm-surface: #e3dacc;
  --surface-inversion-surface: #141413;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-slate-dark: #141413;
  --color-ivory-medium: #f0eee6;
  --color-ivory-light: #faf9f5;
  --color-cloud-medium: #b0aea5;
  --color-cloud-dark: #87867f;
  --color-stone: #cccbc8;
  --color-slate-medium: #3d3d3a;
  --color-oat-warm: #e3dacc;
  --color-manilla: #f5e3c7;
  --color-clay: #d97757;
  --color-clay-deep: #c6613f;

  /* Typography */
  --font-anthropic-serif: 'Anthropic Serif', ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
  --font-anthropic-sans: 'Anthropic Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-anthropic-mono: 'Anthropic Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.4;
  --tracking-caption: -0.24px;
  --text-body-sm: 16px;
  --leading-body-sm: 1;
  --tracking-body-sm: -0.08px;
  --text-body: 20px;
  --leading-body: 1.4;
  --text-subheading: 24px;
  --leading-subheading: 1.3;
  --tracking-subheading: -0.05px;
  --text-heading: 61px;
  --leading-heading: 1.1;
  --tracking-heading: -0.12px;
  --text-display: 68px;
  --leading-display: 1.1;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-76: 76px;
  --spacing-100: 100px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-3xl: 24px;
}
```
