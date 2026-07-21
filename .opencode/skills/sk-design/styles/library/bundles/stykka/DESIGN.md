# Stykka — Style Reference
> Scandi atelier under white light — a quiet, hand-built showroom where the only voice is the photograph

**Theme:** light

Stykka is a Scandinavian kitchen brand that treats the interface like a museum catalog: pure white canvas, black hairline borders, and full-bleed photography that carries every ounce of warmth, color, and craft. The UI is deliberately invisible — there is no accent color, no decoration, no shadow stack — so that the kitchens in the imagery feel like the only subject on screen. Typography does the talking: Inter at tight negative tracking on large display sizes, uppercase tracked labels for section openers, and a system fallback for the tiniest metadata. Spacing is compact and editorial, with 10px gaps between elements and generous white space at the section level. Everything from the nav to the feature grid to the outlined CTA assumes a black-and-white photograph will do the emotional heavy lifting — the system stays out of the way.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Press Black | `#000000` | `--color-press-black` | Primary text, 1px hairlines, icon strokes, outlined button borders. The structural ink of the entire system — every border, every label, every headline resolves to this single value |
| Gallery White | `#ffffff` | `--color-gallery-white` | Page canvas, card surfaces, button text on dark surfaces, inverse overlay backgrounds. The unbroken ground on which every photograph sits |
| Plate Gray | `#b8b8b8` | `--color-plate-gray` | Subtle disabled state, placeholder fill, secondary metadata. Reads as 10.6:1 on black (safe for muted labels) but only 2.0:1 on white — never use as body text on the default canvas |

## Tokens — Typography

### sans-serif — sans-serif — detected in extracted data but not described by AI · `--font-sans-serif`
- **Weights:** 400
- **Sizes:** 12px
- **Line height:** 1.2
- **Role:** sans-serif — detected in extracted data but not described by AI

### Inter — Primary typeface for everything visible. Weight 400 carries body and nav; weight 500 lifts labels, button text, and the uppercase section openers. Display sizes (30–46px) use aggressive negative tracking (around -0.04em) that pulls letters together so headlines feel set in metal, not typeset. Sub-16px sizes flip to positive tracking (0.021em) for the small-caps label treatment that recurs across hero overlays and section headers · `--font-inter`
- **Substitute:** system-ui, -apple-system, Segoe UI, Roboto
- **Weights:** 400, 500
- **Sizes:** 11px, 14px, 16px, 22px, 24px, 30px, 46px
- **Line height:** 1.20, 1.25, 1.50
- **Letter spacing:** -1.93px at 46px / display, -1.20px at 30px / heading, -0.89px at 24px / heading-sm, -0.79px at 22px / subheading, -0.37px at 16px / body, +0.29px at 14px and +0.23px at 11px / small-caps labels and caption
- **OpenType features:** `"ss01" on for alternate single-storey 'a' if available, "tnum" for tabular numbers in any data row`
- **Role:** Primary typeface for everything visible. Weight 400 carries body and nav; weight 500 lifts labels, button text, and the uppercase section openers. Display sizes (30–46px) use aggressive negative tracking (around -0.04em) that pulls letters together so headlines feel set in metal, not typeset. Sub-16px sizes flip to positive tracking (0.021em) for the small-caps label treatment that recurs across hero overlays and section headers

### Azeret Mono — Reserved for a single editorial moment in the body — a 18px monospace line that breaks the Inter rhythm. Use sparingly, never more than once per page, to mark a hand-set caption, specification, or builder's note · `--font-azeret-mono`
- **Substitute:** IBM Plex Mono, JetBrains Mono, ui-monospace
- **Weights:** 400
- **Sizes:** 18px
- **Line height:** 1.00
- **Letter spacing:** -0.0100em
- **Role:** Reserved for a single editorial moment in the body — a 18px monospace line that breaks the Inter rhythm. Use sparingly, never more than once per page, to mark a hand-set caption, specification, or builder's note

### system-ui (sans-serif) — Invisible utility tier for the smallest chrome elements — copyright lines, version stamps, decorative micro-labels. Inter is the show; system-ui is the scaffolding you never notice · `--font-system-ui-sans-serif`
- **Substitute:** system-ui, -apple-system, Segoe UI
- **Weights:** 400
- **Sizes:** 12px
- **Line height:** 1.20
- **Role:** Invisible utility tier for the smallest chrome elements — copyright lines, version stamps, decorative micro-labels. Inter is the show; system-ui is the scaffolding you never notice

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 11px | 1.2 | 0.23px | `--text-caption` |
| body-sm | 14px | 1.25 | 0.29px | `--text-body-sm` |
| body | 16px | 1.5 | -0.37px | `--text-body` |
| subheading | 22px | 1.2 | -0.79px | `--text-subheading` |
| heading-sm | 24px | 1.2 | -0.89px | `--text-heading-sm` |
| heading | 30px | 1.1 | -1.2px | `--text-heading` |
| display | 46px | 1.05 | -1.93px | `--text-display` |

## Tokens — Spacing & Shapes

**Density:** compact

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 5 | 5px | `--spacing-5` |
| 8 | 8px | `--spacing-8` |
| 10 | 10px | `--spacing-10` |
| 11 | 11px | `--spacing-11` |
| 12 | 12px | `--spacing-12` |
| 15 | 15px | `--spacing-15` |
| 18 | 18px | `--spacing-18` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 25 | 25px | `--spacing-25` |
| 30 | 30px | `--spacing-30` |
| 33 | 33px | `--spacing-33` |
| 36 | 36px | `--spacing-36` |
| 40 | 40px | `--spacing-40` |
| 50 | 50px | `--spacing-50` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 8px |
| cards | 16px |
| buttons | 8px |
| imageContainers | 0px (photography is hard-edged to the grid line) |

### Layout

- **Page max-width:** 1280px
- **Section gap:** 60-80px
- **Element gap:** 10px

## Components

### Transparent Top Nav
**Role:** Primary navigation that sits over full-bleed hero photography

Full-width, position-absolute over hero, no background fill. Left cluster: nav links (About, Journal, Inspiration, Design) in Inter 16px weight 400 #000 with 20px horizontal spacing. Center: wordmark 'Stykka' in Inter 22-24px weight 500 #000. Right cluster: language selector and 'Start building' outlined button. 20px vertical padding. No border, no shadow, no background.

### Outlined CTA Button
**Role:** The only button variant on the site — used for every actionable element

Inter 16px weight 500 #000, 1px solid #000000 border, 8px radius, padding 10px 18px (approx). Transparent fill so it sits cleanly over photography. Hover inverts: fill becomes #000000, text becomes #ffffff. No drop-shadow, no scale transform. The 8px radius is deliberately soft but not pill — it reads as pressed metal, not a tag.

### Hero Section (Full-Bleed)
**Role:** First-screen brand statement

100vw × ~100vh image, no overlay, no gradient. Text block sits in the lower-left third, aligned to the 10px grid, padded from the viewport edge. Contains a tracked uppercase label, a display headline, and a single CTA. The hero is a photograph first and a layout second — no fake device frames, no illustration, no animation chrome.

### Hero Overlay Label
**Role:** Tracked small-caps category tag above headlines

Inter 14px weight 500 #ffffff (sits over photography), letter-spacing +0.29px, uppercase. Used in the hero and as the opener of every editorial section — it is the system's only repeated chrome. Color flips to #000000 on white backgrounds.

### Display Headline
**Role:** Primary editorial statement on hero and section openers

Inter 46px weight 400 #ffffff on hero / #000000 on white sections, line-height 1.05, letter-spacing -1.93px. Weight 400 (not 700) is the signature — the headline never shouts. It is set tight enough to feel architectural, not typeset.

### Feature Grid Card
**Role:** 4-column editorial card for product attributes

Image on top (full-bleed, hard 0px corners, 4:3 or 3:4 aspect), 10px row gap to title, title in Inter 14-16px weight 500 uppercase #000 letter-spacing +0.29px, 10px gap to body, body in Inter 16px weight 400 #000 line-height 1.50. No card surface, no border, no shadow — the image edge IS the card edge. 4 columns on desktop, collapses to 2 then 1.

### Language Selector
**Role:** Locale switcher in nav

Globe icon (16px stroke, 1px #000) + 'English' in Inter 16px weight 400 + small chevron. No background, no border. Sits inline with other nav elements with 20px gap.

### Section Header Block
**Role:** Editorial opener for a content section

Stack: tracked uppercase label (14px) → display or heading headline (30-46px) → optional supporting paragraph (16px, max-width ~60ch). Vertically centered or left-aligned to the 10px grid. Generous 60-80px section gap before and after. The header does most of the brand voice work — no decorative graphics.

### Image Grid (Multi-Column)
**Role:** Full-bleed photography showcase below the fold

2- or 3-column grid of hard-edged images, 10-15px gutters, no captions, no borders. Each image bleeds to the edge of its cell. This is the system's only way of communicating product warmth — by showing it, not by styling it.

### Inline Text Link
**Role:** Links within body copy

Inter 16px weight 400 #000, 1px underline offset 3px, underline color #000. No color shift, no bold — the link is identified by the underline alone, which keeps the editorial line unbroken.

### Footer Block
**Role:** Closing black band

Full-width #000000 background, text in #ffffff. Inter 14-16px weight 400. Same 20px internal padding rhythm as the nav. Minimal: a wordmark, a link list, and a copyright line in system-ui 12px. No social icons, no newsletter form — the system stays austere to the end.

### Monospace Spec Callout
**Role:** Editorial accent line for a material or dimension

Azeret Mono 18px weight 400 #000, line-height 1.00, letter-spacing -0.18px. Single line, full-bleed across the content column. Breaks the Inter rhythm deliberately — use for a quote, a dimension, or a builder's note. Never more than one per page.

## Do's and Don'ts

### Do
- Use #000000 for every text element and every 1px border — never introduce a second ink color, the system is intentionally monochromatic
- Set display headlines at Inter weight 400 (not 700) with tracking between -1.2px and -1.93px — the tight setting is the signature, not the weight
- Use the 14px uppercase tracked label (ls +0.29px) as the opener of every section — it is the only repeated UI motif and it carries the editorial voice
- Use the outlined CTA (1px #000 border, 8px radius, transparent fill) for every action — there is no filled or ghost variant, this is the only button
- Let photography fill the entire viewport for hero and feature sections — 0px corner radius on all image containers, the photo bleeds to the grid line
- Hold element gaps to 10px and section gaps to 60-80px — the compact density is what makes the white space feel intentional rather than empty
- Use 16px card radius (not 12px, not 8px) on any card surface that contains text — the extra softness separates editorial content from the harder 8px button geometry

### Don't
- Never introduce an accent color, brand color, or chromatic highlight — the system has none by design, the photography provides all warmth
- Never use a drop-shadow, box-shadow, or elevation token to group content — use a 1px border or whitespace instead, this is a flat system
- Never set a display headline at weight 500+ — the headline must whisper at 400 to preserve the editorial register
- Never use positive letter-spacing on sizes above 16px — the positive tracking is reserved for the 11-14px small-caps label tier only
- Never use a filled or solid button — the outlined 1px border is the only button geometry in the system
- Never apply the 16px card radius to images — images are always hard-edged (0px), the 16px is for text-bearing surfaces only
- Never place body text directly on a full-color photograph without a tonal treatment — the hero overlay uses #ffffff text, and any text on a photograph must be either pure white or pure black to survive the contrast

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Canvas | `#ffffff` | Default page background and image-negative space between sections |
| 2 | Ink | `#000000` | Reserved as a contrast surface for inverse buttons, footer block, or full-bleed black sections — not used as page background |

## Elevation

Zero shadow vocabulary. Structure is communicated entirely through 1px hairline borders in #000000 and whitespace. Cards, sections, and feature blocks float by adjacency, not by depth. Adding a drop-shadow breaks the editorial flatness of the system — if you need to group something, draw a border instead.

## Imagery

Photography is the entire visual system. The site uses no illustrations, no icons beyond simple line glyphs (globe, chevron, arrows), no abstract graphics, and no 3D renders. All imagery is warm, natural-light, editorial interior photography: timber kitchens, natural materials, daylight, human scale. Treatments are full-bleed with hard 0px corners — no rounded masking, no drop-shadow on photos, no duotone or color grading. Images occupy roughly 60% of the page area across the site, dominating the visual hierarchy over every UI element. The system is image-heavy in the sense that the few images shown are large, but the overall density is restrained — usually one full-bleed photograph per screen.

## Layout

Full-bleed max-width ~1280px centered container. Hero is a single 100vw × ~100vh photograph with a text overlay in the lower-left third — no split layout, no card hero, no video. Below the fold, the rhythm alternates: a centered 4-column feature grid, then a full-bleed 2- or 3-column image grid, then a black footer band. Sections are separated by 60-80px vertical whitespace, never by dividers. Navigation is a transparent bar absolutely positioned over the hero, becoming part of the page flow as the user scrolls. The layout reads as a long-scroll editorial spread — closer to a print catalog than a typical product page.

## Agent Prompt Guide

QUICK COLOR REFERENCE
- text: #000000
- background: #ffffff
- border: #000000 (1px hairlines only)
- accent: no distinct accent color (achromatic system — warmth comes from photography)
- primary action: no distinct CTA color

3-5 EXAMPLE COMPONENT PROMPTS

1. HERO SECTION
Full-viewport image (100vw × 100vh) with no overlay or gradient. Lower-left text block on a 10px grid, padded 40px from the viewport edge. Small-caps label: Inter 14px weight 500, #ffffff, uppercase, letter-spacing +0.29px, content 'EXPLORE KITCHENS'. Display headline below: Inter 46px weight 400, #ffffff, line-height 1.05, letter-spacing -1.93px, content 'Built to last'. Outlined button below: Inter 16px weight 500, 1px solid #000000 border (visible as a cutout or re-tinted to #ffffff when over dark photography), 8px radius, padding 10px 18px, label 'Start building'.

2. FEATURE GRID CARD
Image (4:3 aspect, 0px corner radius) on top. 10px row gap. Title: Inter 14px weight 500, #000000, uppercase, letter-spacing +0.29px. 10px gap. Body: Inter 16px weight 400, #000000, line-height 1.50, max-width 32ch. No card surface, no border, no shadow. Arranged in a 4-column grid with 20px column gaps, 40px row gaps.

3. TRANSPARENT TOP NAV
No distinct primary action color was observed; use the extracted neutral button treatments instead of inventing a filled CTA color.

4. SECTION HEADER
Stack on a centered 10px grid. Tracked label: Inter 14px weight 500, #000000, uppercase, letter-spacing +0.29px. 20px gap. Headline: Inter 30px weight 400, #000000, line-height 1.10, letter-spacing -1.20px. 20px gap. Optional supporting paragraph: Inter 16px weight 400, #000000, line-height 1.50, max-width 60ch.

5. FOOTER BLOCK
Full-width #000000 background. 20px internal padding. Inter 14-16px weight 400, #ffffff. Single wordmark left, link list center, copyright in system-ui 12px, #ffffff right. No social icons, no newsletter form.

## Similar Brands

- **Menu (space.menu)** — Same Scandinavian furniture-brand restraint, transparent nav over full-bleed interior photography, Inter at tight tracking, and an exclusively black/white interface that lets the product imagery carry all warmth
- **Hem** — Editorial Scandi furniture catalog with the same uppercased tracked label openers, hard-edged full-bleed product photography, and a gallery-white canvas with hairline structural borders
- **USM** — Modular furniture brand that uses a near-identical monospace label + Inter headline pairing, 0px image corners, and a 4-column feature grid layout for product attributes
- **Vitra** — Same museum-catalog posture: large confident display headlines at weight 400 (not bold), 1px black rules instead of shadows, and full-bleed interior photography that does the brand's emotional work

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-press-black: #000000;
  --color-gallery-white: #ffffff;
  --color-plate-gray: #b8b8b8;

  /* Typography — Font Families */
  --font-sans-serif: 'sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-azeret-mono: 'Azeret Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-system-ui-sans-serif: 'system-ui (sans-serif)', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.2;
  --tracking-caption: 0.23px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.25;
  --tracking-body-sm: 0.29px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.37px;
  --text-subheading: 22px;
  --leading-subheading: 1.2;
  --tracking-subheading: -0.79px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -0.89px;
  --text-heading: 30px;
  --leading-heading: 1.1;
  --tracking-heading: -1.2px;
  --text-display: 46px;
  --leading-display: 1.05;
  --tracking-display: -1.93px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-5: 5px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-11: 11px;
  --spacing-12: 12px;
  --spacing-15: 15px;
  --spacing-18: 18px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-25: 25px;
  --spacing-30: 30px;
  --spacing-33: 33px;
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-50: 50px;

  /* Layout */
  --page-max-width: 1280px;
  --section-gap: 60-80px;
  --element-gap: 10px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-2xl: 16px;

  /* Named Radii */
  --radius-tags: 8px;
  --radius-cards: 16px;
  --radius-buttons: 8px;
  --radius-imagecontainers: 0px (photography is hard-edged to the grid line);

  /* Surfaces */
  --surface-canvas: #ffffff;
  --surface-ink: #000000;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-press-black: #000000;
  --color-gallery-white: #ffffff;
  --color-plate-gray: #b8b8b8;

  /* Typography */
  --font-sans-serif: 'sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-azeret-mono: 'Azeret Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-system-ui-sans-serif: 'system-ui (sans-serif)', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.2;
  --tracking-caption: 0.23px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.25;
  --tracking-body-sm: 0.29px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.37px;
  --text-subheading: 22px;
  --leading-subheading: 1.2;
  --tracking-subheading: -0.79px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -0.89px;
  --text-heading: 30px;
  --leading-heading: 1.1;
  --tracking-heading: -1.2px;
  --text-display: 46px;
  --leading-display: 1.05;
  --tracking-display: -1.93px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-5: 5px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-11: 11px;
  --spacing-12: 12px;
  --spacing-15: 15px;
  --spacing-18: 18px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-25: 25px;
  --spacing-30: 30px;
  --spacing-33: 33px;
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-50: 50px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-2xl: 16px;
}
```
