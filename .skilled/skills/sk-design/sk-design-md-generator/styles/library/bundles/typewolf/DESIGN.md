# Typewolf — Style Reference
> Warm parchment typography atelier. Every element is a brownish-ink stamp on dusty rose paper, with no color allowed to compete with the type.

**Theme:** light

Typewolf reads as a warm, editorial type specimen magazine pressed into a website: a dusty rose canvas (#f8f5f5) supports white rectangular cards in a two-column grid, all anchored by brownish-ink text rather than any chromatic accent system. The palette is deliberately near-monochromatic — a dark warm brown (#443235) for body copy and headlines, a slightly lighter brown (#654a4e) for nav and secondary links, and a single muted dusty rose (#916a70) reserved for borders and quiet emphasis. Typography carries the entire identity: a transitional serif (Domaine Text) for body, an ultra-heavy condensed sans (Dia) for ALL-CAPS micro-labels with -0.03em tracking, and a high-contrast display serif (Domaine Display Narrow) for editorial headlines. Surfaces are sharp-cornered, elevated only by a warm-tinted diffuse shadow (rgba(145,106,112,0.15) 0 6px 24px) that ties the elevation back to the brand palette. The result is a site that feels more like a printed specimen catalog than a web product — restrained, content-first, and quietly opinionated.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Parchment Rose | `#f8f5f5` | `--color-parchment-rose` | Page canvas and section backgrounds — the warm off-white ground that gives the whole system its dusty, paper-like atmosphere |
| Specimen White | `#ffffff` | `--color-specimen-white` | Card surfaces and image wells — clean white plates that sit on the parchment canvas, carrying typographic specimens and editorial imagery |
| Ink Brown | `#443235` | `--color-ink-brown` | Primary text, headlines, and dominant body copy — the warm near-black that reads as ink rather than pure black against the rose canvas |
| Walnut | `#654a4e` | `--color-walnut` | Navigation text, secondary links, and muted metadata — one step lighter than Ink Brown for hierarchy without leaving the brown family |
| Charcoal | `#2e2c2c` | `--color-charcoal` | Deepest neutral for in-image text and high-contrast moments where Ink Brown isn't dark enough |
| Hairline Ash | `#cfc6c7` | `--color-hairline-ash` | Subtle border on form inputs and fine dividers — a warm gray that stays in the brown family |
| Dusty Rose | `#916a70` | `--color-dusty-rose` | Red supporting accent for decorative details and low-frequency emphasis. Do not promote it to the primary CTA color |

## Tokens — Typography

### DomaineText — Body text, navigation, links, and all running copy — a transitional serif that carries the editorial, printed-specimen feel. Its old-style figures (onum) and standard ligatures give body text a bookish quality. · `--font-domainetext`
- **Substitute:** Source Serif 4 or PT Serif
- **Weights:** 400
- **Sizes:** 14, 16, 18, 24, 28px
- **Line height:** 1.2–1.5
- **OpenType features:** `"calt", "clig", "kern", "liga", "onum"`
- **Role:** Body text, navigation, links, and all running copy — a transitional serif that carries the editorial, printed-specimen feel. Its old-style figures (onum) and standard ligatures give body text a bookish quality.

### Dia — ALL-CAPS micro-labels: nav items, category badges, dates, font attributions, and section tags. The ultra-heavy weight plus tight tracking creates a compact, industrial counterpoint to the serif body — a signature pairing that makes even a date stamp feel designed. · `--font-dia`
- **Substitute:** Bebas Neue or Oswald (700–800 weight)
- **Weights:** 900
- **Sizes:** 12, 13, 14, 15px
- **Line height:** 1.2–2.2
- **Letter spacing:** -0.03em
- **OpenType features:** `"calt", "clig", "kern", "liga", "smcp"`
- **Role:** ALL-CAPS micro-labels: nav items, category badges, dates, font attributions, and section tags. The ultra-heavy weight plus tight tracking creates a compact, industrial counterpoint to the serif body — a signature pairing that makes even a date stamp feel designed.

### DomaineDisplayNarrow — Editorial headlines, article titles, and the site wordmark. The narrow proportions and high contrast give display type a fashion-magazine authority — it is the voice that announces, never explains. · `--font-domainedisplaynarrow`
- **Substitute:** Playfair Display or Bodoni Moda (narrow variant)
- **Weights:** 700
- **Sizes:** 26, 42, 46px
- **Line height:** 1.2
- **OpenType features:** `"calt", "clig", "kern", "liga", "onum"`
- **Role:** Editorial headlines, article titles, and the site wordmark. The narrow proportions and high contrast give display type a fashion-magazine authority — it is the voice that announces, never explains.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.3 | -0.36px | `--text-caption` |
| body-sm | 14px | 1.45 | — | `--text-body-sm` |
| body | 16px | 1.5 | — | `--text-body` |
| subheading | 18px | 1.4 | — | `--text-subheading` |
| heading-sm | 24px | 1.3 | — | `--text-heading-sm` |
| heading | 28px | 1.25 | — | `--text-heading` |
| heading-lg | 42px | 1.2 | — | `--text-heading-lg` |
| display | 46px | 1.2 | — | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 8 | 8px | `--spacing-8` |
| 12 | 12px | `--spacing-12` |
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 28 | 28px | `--spacing-28` |
| 32 | 32px | `--spacing-32` |
| 36 | 36px | `--spacing-36` |
| 48 | 48px | `--spacing-48` |
| 188 | 188px | `--spacing-188` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 0px |
| badges | 0px |
| inputs | 4px |
| buttons | 0px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| lg | `rgba(145, 106, 112, 0.15) 0px 6px 24px 0px` | `--shadow-lg` |
| subtle | `rgb(245, 241, 242) 0px -3px 0px 0px inset` | `--shadow-subtle` |

### Layout

- **Page max-width:** 960px
- **Section gap:** 80px
- **Card padding:** 0px
- **Element gap:** 12px

## Components

### Site Wordmark
**Role:** Centered brand identity in the header

Centered 'Typewolf' set in DomaineDisplayNarrow 700 at 46px in Ink Brown (#443235), followed by a DomaineText 400 tagline ('What's Trending in Type') at ~18px in Walnut (#654a4e). Sits on the Parchment Rose canvas with generous vertical padding above and below.

### Primary Navigation
**Role:** Horizontal site navigation below the wordmark

Centered horizontal list of section links (FONT LISTS, LOOKBOOKS, CHECKLIST, FREE FONTS, LEARNING RESOURCES). Each item is Dia 900 at 13px in Walnut (#654a4e), ALL-CAPS with -0.03em letter-spacing, separated by generous horizontal padding (~19px). No background, no border — just text on the canvas, divided from content by a 1px rule with an inner shadow.

### Article Card — Image Specimen
**Role:** Two-column grid card showcasing a typographic composition

White (#ffffff) rectangular surface, 0px border-radius, no internal padding. Contains a full-bleed image (photographic, illustrated, or type-on-color background). Below the image: article title in DomaineDisplayNarrow 700 at 42px in Ink Brown; metadata row with category (Dia 900 12px, ALL-CAPS, Walnut) on the left, date stamp (Dia 900 12px, Walnut) on the right, separated from the next line by the font attribution (DomaineText 400 14px, Walnut). Elevated with the warm-tinted diffuse shadow.

### Article Card — Text Specimen
**Role:** Card variant with large type in the body rather than an image

Same white plate and shadow as the image card, but the content area is filled with oversized type in a display serif (DomaineDisplayNarrow or similar specimen font) at 42–46px, often with a small label like 'THE AUTHOR' in Dia 900 12px ALL-CAPS above. Functions as a typography sample first, article preview second.

### Category Label
**Role:** Small ALL-CAPS tag above article metadata

Dia 900 at 12px in Walnut (#654a4e), ALL-CAPS, -0.03em letter-spacing, no background or border. A pure typographic label — the visual weight does the work, not a pill or chip.

### Date Stamp
**Role:** Right-aligned publication date on article cards

Dia 900 at 12px in Walnut (#654a4e), ALL-CAPS, -0.03em letter-spacing. Right-aligned to the card edge with ~11px right padding. Matches the Category Label in size and weight for a balanced metadata row.

### Font Attribution
**Role:** Credits the typefaces featured in the specimen below the article title

DomaineText 400 at 14px in Walnut (#654a4e), sentence case. Format: 'FONTS — [Font Name], [Font Name]'. Functions as both credit and curiosity hook.

### Text Input
**Role:** Form field for search or subscription

White (#ffffff) background, 1px Hairline Ash (#cfc6c7) border, 4px border-radius, ~12px padding. Placeholder and entered text in DomaineText 400 14px in Walnut.

### Nav Divider
**Role:** Hairline rule separating navigation from content

A 1px line rendered via inset top shadow rgb(245, 241, 242) 0px -3px 0px 0px inset, matching the Parchment Rose. Full-width across the canvas, positioned directly below the nav row.

## Do's and Don'ts

### Do
- Use DomaineText 400 for all body, paragraph, and link text — never a sans-serif body face
- Use Dia 900 ALL-CAPS with -0.03em letter-spacing for every label, tag, date, and nav item; the condensed ultra-bold weight is the system's identifying texture
- Use DomaineDisplayNarrow 700 for headlines and the wordmark; never set display type in DomaineText or Dia
- Keep card and container radius at 0px — the system is built on sharp, printed-page edges
- Let the warm-tinted shadow (rgba(145, 106, 112, 0.15) 0 6px 24px) be the only elevation cue; no hard borders, no multiple shadow layers
- Set body text in Ink Brown (#443235) on Parchment Rose (#f8f5f5) — never pure black, never pure white background
- Maintain a 2-column card grid for editorial content; the two-up rhythm mirrors a magazine spread

### Don't
- Do not introduce a filled button or chromatic CTA — the system has no action color; interactions are typographic or ghost-level
- Do not add border-radius to cards, badges, or nav items — sharpness is a signature
- Do not use a sans-serif for body copy or headlines; the serif/condensed-sans pairing is the identity
- Do not set body text at pure #000 or headlines at less than 26px in DomaineDisplayNarrow
- Do not apply multiple shadow layers or gray (non-tinted) shadows; the rose-tinted diffuse shadow is the only acceptable elevation
- Do not use #916a70 (Dusty Rose) for buttons or large fills — it is a border/inset accent only
- Do not center body paragraphs or break the 2-column editorial grid without deliberate reason

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Canvas | `#f8f5f5` | Full-page background — the warm rose paper ground. |
| 2 | Card Plate | `#ffffff` | White rectangular cards and image containers elevated on the canvas. |

## Elevation

- **Article card:** `rgba(145, 106, 112, 0.15) 0px 6px 24px 0px`
- **Header divider:** `rgb(245, 241, 242) 0px -3px 0px 0px inset`

## Imagery

Every card is a typographic specimen: photographs, flat illustrations, scanned type prints, type-on-color blocks, and editorial compositions. Imagery is always contained within the card frame (never full-bleed beyond the grid), always sharp-cornered (0px radius), and always at 2:1 or similar landscape ratio. No lifestyle photography, no people — the subject is always type itself, staged on flat color or photographic backgrounds. Iconography is absent from the interface; Dia's letterforms do the labeling work.

## Layout

Centered single-column page (max-width ~960px) with a centered wordmark, centered horizontal nav, and a 2-column card grid for the main content stream. The hero is not a full-bleed image but a tight typographic lockup: large wordmark + tagline + nav, all centered on the warm canvas. Sections flow seamlessly with ~80px vertical gaps and no alternating bands. The card grid is the only recurring layout motif; there are no sidebars, no split text+image rows, no feature blocks — just a steady, magazine-like cascade of typographic specimens.

## Agent Prompt Guide

**Quick Color Reference**
- text (primary): #443235 Ink Brown
- text (secondary/nav/links): #654a4e Walnut
- background (page canvas): #f8f5f5 Parchment Rose
- surface (cards): #ffffff Specimen White
- border (accent / shadow tint): #916a70 Dusty Rose
- border (hairline): #cfc6c7 Hairline Ash
- primary action: no distinct CTA color

**3-5 Example Component Prompts**

1. *Article card (image specimen)*: White (#ffffff) rectangular surface, 0px radius, warm-tinted shadow (rgba(145,106,112,0.15) 0 6px 24px). Full-bleed image fills the top. Below: article title in DomaineDisplayNarrow 700 at 42px in #443235, then a metadata row with category label (Dia 900 12px ALL-CAPS, -0.03em tracking, #654a4e) left-aligned, date stamp (same Dia spec, right-aligned), and font attribution (DomaineText 400 14px, #654a4e) below.

2. *Text specimen card*: White (#ffffff) plate, 0px radius, same warm shadow. Small ALL-CAPS label 'THE AUTHOR' in Dia 900 12px #654a4e at the top. Body of oversized display type in DomaineDisplayNarrow 700 at 42–46px in #443235, filling the card.

3. *Primary navigation row*: Centered horizontal list on Parchment Rose (#f8f5f5) canvas. Each link in Dia 900 13px ALL-CAPS, -0.03em letter-spacing, #654a4e. ~19px horizontal gap between items. No backgrounds or borders. A 1px hairline rule with inner shadow rgb(245,241,242) 0 -3px 0 inset divides the nav from content below.

4. *Site wordmark + tagline*: Centered lockup on #f8f5f5. 'Typewolf' in DomaineDisplayNarrow 700 at 46px in #443235, followed by 'What's Trending in Type' in DomaineText 400 at 18px in #654a4e, ~12px below.

5. *Text input field*: White (#ffffff) background, 1px #cfc6c7 border, 4px radius, 12px padding. Placeholder and entered text in DomaineText 400 14px in #654a4e. No visible focus ring color needed beyond a 1px #916a70 border on focus.

## Similar Brands

- **Fonts In Use** — Same editorial typographic-specimen model: centered serif-led layout, brownish-neutral palette, and cards that are type-first compositions rather than conventional blog thumbnails
- **Typography by Hoefler & Co.** — Same warm, restrained type-presentation language — serif display headlines, generous whitespace, and a muted warm canvas that lets the specimens do the talking
- **It's Nice That** — Same editorial-grid feel with a centered masthead and two-column article stream, though Typewolf pushes further into the dusty-rose warm palette
- **Muzli by InVision** — Similar center-aligned content stream with typographic masthead, though Typewolf is sharper-cornered and warmer-toned

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-parchment-rose: #f8f5f5;
  --color-specimen-white: #ffffff;
  --color-ink-brown: #443235;
  --color-walnut: #654a4e;
  --color-charcoal: #2e2c2c;
  --color-hairline-ash: #cfc6c7;
  --color-dusty-rose: #916a70;

  /* Typography — Font Families */
  --font-domainetext: 'DomaineText', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-dia: 'Dia', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-domainedisplaynarrow: 'DomaineDisplayNarrow', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.3;
  --tracking-caption: -0.36px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.45;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 18px;
  --leading-subheading: 1.4;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.3;
  --text-heading: 28px;
  --leading-heading: 1.25;
  --text-heading-lg: 42px;
  --leading-heading-lg: 1.2;
  --text-display: 46px;
  --leading-display: 1.2;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-bold: 700;
  --font-weight-black: 900;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-36: 36px;
  --spacing-48: 48px;
  --spacing-188: 188px;

  /* Layout */
  --page-max-width: 960px;
  --section-gap: 80px;
  --card-padding: 0px;
  --element-gap: 12px;

  /* Border Radius */
  --radius-md: 4px;

  /* Named Radii */
  --radius-cards: 0px;
  --radius-badges: 0px;
  --radius-inputs: 4px;
  --radius-buttons: 0px;

  /* Shadows */
  --shadow-lg: rgba(145, 106, 112, 0.15) 0px 6px 24px 0px;
  --shadow-subtle: rgb(245, 241, 242) 0px -3px 0px 0px inset;

  /* Surfaces */
  --surface-canvas: #f8f5f5;
  --surface-card-plate: #ffffff;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-parchment-rose: #f8f5f5;
  --color-specimen-white: #ffffff;
  --color-ink-brown: #443235;
  --color-walnut: #654a4e;
  --color-charcoal: #2e2c2c;
  --color-hairline-ash: #cfc6c7;
  --color-dusty-rose: #916a70;

  /* Typography */
  --font-domainetext: 'DomaineText', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-dia: 'Dia', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-domainedisplaynarrow: 'DomaineDisplayNarrow', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.3;
  --tracking-caption: -0.36px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.45;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 18px;
  --leading-subheading: 1.4;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.3;
  --text-heading: 28px;
  --leading-heading: 1.25;
  --text-heading-lg: 42px;
  --leading-heading-lg: 1.2;
  --text-display: 46px;
  --leading-display: 1.2;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-36: 36px;
  --spacing-48: 48px;
  --spacing-188: 188px;

  /* Border Radius */
  --radius-md: 4px;

  /* Shadows */
  --shadow-lg: rgba(145, 106, 112, 0.15) 0px 6px 24px 0px;
  --shadow-subtle: rgb(245, 241, 242) 0px -3px 0px 0px inset;
}
```
