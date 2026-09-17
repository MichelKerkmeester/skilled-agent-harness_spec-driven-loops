# Assembly Coffee London — Style Reference
> Embers in a dark roastery. A near-black canvas with warm, low-lit product photography and italic serif labels — the feeling of a specialty coffee menu printed in a midnight zine.

**Theme:** dark

Assembly Coffee's visual system reads like an editorial magazine printed on black paper. The interface is overwhelmingly dark — near-black canvases carry everything — interrupted only by product photography lit against warm studio backdrops (ember-red, deep amber) and hairline typography in white. Two type families do all the work: a geometric sans (GT America) for UI scaffolding, navigation, and metadata, and a refined serif (ID00 Serif) for product names, section labels, and editorial copy, almost always in italic, which turns a functional nav list into a curated index. The palette is almost monochromatic: the chromatic vocabulary is rationed to badge fills (pale yellow, sage green, antique gold) and the occasional warm-tinted cream surface. Buttons are not loud — price chips and 'Shop Now' links live as small text or pill-shaped cream labels. Components are thin, sharp-cornered, and rely on borders and weight contrast rather than shadows or fills for separation.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Obsidian | `#0e1311` | `--color-obsidian` | Primary canvas — page backgrounds, hero sections, card surfaces. The near-black with a faint green undertone makes white type glow without feeling sterile |
| Pure Black | `#000000` | `--color-pure-black` | Deepest surface, borders, and type. Used for maximum-contrast outlines, product box photography backgrounds, and the darkest UI strokes |
| Ash Charcoal | `#1a1a1a` | `--color-ash-charcoal` | Secondary surface and border tone — slightly lifted from black for subtle layering on nav, dividers, and outlined button edges |
| Graphite | `#333333` | `--color-graphite` | Mid-neutral for secondary text, input borders, and card outlines where pure black is too heavy |
| Stone Gray | `#808080` | `--color-stone-gray` | Image placeholder and muted background tone — holds space where product photography is loading or absent |
| Silver | `#b3b3b3` | `--color-silver` | De-emphasized borders and helper text on light surfaces |
| Bone | `#ffffff` | `--color-bone` | Primary text on dark canvases, price-chip fills, inverted button surfaces. The brightest accent in an otherwise low-key palette |
| Linen | `#f6f7f2` | `--color-linen` | Warm off-white surface for inverted sections, price pill backgrounds, and soft button fills. Sits between bone and the khaki family |
| Sand Khaki | `#dfdbca` | `--color-sand-khaki` | Hairline borders, dividers, input outlines, and card edges on light surfaces. |
| Lichen Green | `#cadcac` | `--color-lichen-green` | Green state accent for badges, validation surfaces, and short status labels. |
| Citron | `#faf080` | `--color-citron` | Yellow state accent for badges, validation surfaces, and short status labels. |
| Antique Gold | `#cfa53b` | `--color-antique-gold` | Accent stroke and border for promotional or limited-availability badges. Reads as aged brass — never neon |
| Olive Bark | `#4d4a31` | `--color-olive-bark` | Dark olive link/announcement background — the deep green-brown of the top bar, grounded and earthy |

## Tokens — Typography

### GT America Standard — The UI workhorse: navigation labels, body copy, button text, metadata, footer text, cart count, form fields. Weight 400 for body, 500 for nav items, 600 sparingly for tiny uppercase labels like 'FEATURED'. At 11–14px it carries the entire structural layer. · `--font-gt-america-standard`
- **Substitute:** Inter, Söhne, or Neue Haas Grotesk
- **Weights:** 300, 400, 500, 600
- **Sizes:** 11, 12, 13, 14, 16, 18, 20, 21, 24, 42px
- **Line height:** 1.20, 1.25, 1.40, 1.50, 2.00
- **Role:** The UI workhorse: navigation labels, body copy, button text, metadata, footer text, cart count, form fields. Weight 400 for body, 500 for nav items, 600 sparingly for tiny uppercase labels like 'FEATURED'. At 11–14px it carries the entire structural layer.

### ID00 Serif — The editorial voice: product names, section headings, the 'Shop Now' and 'Limited Time Offer' labels in the hero, the 'Independent specialty coffee roaster…' manifesto copy. Almost always set in italic — this is the signature move. The italic serif against a black canvas is what makes the site read as a curated coffee journal rather than a store. · `--font-id00-serif`
- **Substitute:** GT Sectra, Cormorant Garamond Italic, or Playfair Display Italic
- **Weights:** 300, 400
- **Sizes:** 16, 18, 30, 36, 42px
- **Line height:** 1.00, 1.20, 1.25, 1.50
- **Role:** The editorial voice: product names, section headings, the 'Shop Now' and 'Limited Time Offer' labels in the hero, the 'Independent specialty coffee roaster…' manifesto copy. Almost always set in italic — this is the signature move. The italic serif against a black canvas is what makes the site read as a curated coffee journal rather than a store.

### Helvetica — Fallback / system substitute for small tertiary text and icons where GT America is not loaded. · `--font-helvetica`
- **Substitute:** system-ui, -apple-system, Arial
- **Weights:** 400, 500
- **Sizes:** 11, 14px
- **Line height:** 1.50
- **Role:** Fallback / system substitute for small tertiary text and icons where GT America is not loaded.

### reviewsio-font — reviewsio-font — detected in extracted data but not described by AI · `--font-reviewsio-font`
- **Weights:** 400
- **Sizes:** 15px, 16px, 22px, 24px
- **Line height:** 1
- **Role:** reviewsio-font — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 11px | 1.5 | — | `--text-caption` |
| body | 16px | 1.5 | — | `--text-body` |
| subheading | 18px | 1.4 | — | `--text-subheading` |
| heading-sm | 21px | 1.25 | — | `--text-heading-sm` |
| heading | 30px | 1.25 | — | `--text-heading` |
| heading-lg | 36px | 1.2 | — | `--text-heading-lg` |
| display | 42px | 1.2 | — | `--text-display` |

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
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 80 | 80px | `--spacing-80` |
| 96 | 96px | `--spacing-96` |
| 160 | 160px | `--spacing-160` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 4px |
| cards | 4px |
| badges | 4px |
| inputs | 4px |
| buttons | 4px |
| pricePills | 60px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| md | `rgba(0, 0, 0, 0.05) 0px 2.5px 10px -4px` | `--shadow-md` |
| subtle | `rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.1) 0p...` | `--shadow-subtle` |

### Layout

- **Page max-width:** 1400px
- **Section gap:** 80px
- **Card padding:** 20px
- **Element gap:** 16px

## Components

### Announcement Bar
**Role:** Top-of-page utility strip

Full-bleed bar at the very top, olive-bark background (#4d4a31) with cream text. GT America 11–13px, centered, single line. Used for shipping thresholds and time-sensitive messaging.

### Primary Header / Nav
**Role:** Site-wide navigation

Sticky dark header on #0e1311. Left: monogram + '10' (10th anniversary mark) in bone serif. Center: nav items in GT America 14px weight 500 (Coffee, Equipment, Accessories, Learning) with dropdown indicators, separated by a vertical hairline. Right: search icon, 'Log In' text link, cart count in parentheses, currency selector. Border-bottom 1px in #1a1a1a.

### Editorial Hero — Featured Column
**Role:** Left-side hero index

On dark gradient background (black → ember red), a vertical stack of four editorial entries. Each entry: product name in ID00 Serif italic 18–21px, bone (#ffffff); call-to-action subtext in GT America 13–14px weight 400, slightly dimmed. 'FEATURED' label in GT America 11px uppercase letter-spaced at the top. Entries are typographic links, not cards — generous vertical spacing (40–56px between entries) turns the index into a table of contents.

### Product Hero — Studio Photograph
**Role:** Right-side hero visual

Large product photograph (a black coffee box, 60% of viewport height) on a warm ember-red studio backdrop with soft floor shadow. No text overlay. The object is the hero; the UI defers to it.

### Editorial Manifesto Block
**Role:** Brand statement section

Full-width black (#0e1311) section. Centered or left-aligned ID00 Serif italic 30–36px, bone color, weight 300–400. Generous line-height (1.2). No buttons, no links — the prose IS the content.

### Product Card (Dark)
**Role:** Catalog product tile

Black or near-black background. Product photograph fills the upper 60–70% of the card on a warm-tinted studio backdrop. Product name in ID00 Serif italic 21–24px bone. Tasting notes in GT America 13–14px #b3b3b3. Price pill anchored bottom-left. Hairline border 1px in #1a1a1a, radius 4px.

### Price Pill
**Role:** Inline price chip

Linseed off-white (#f6f7f2) pill, border-radius 60px (near-full). Text 'From — €XX.XX' in GT America 13px weight 500, #0e1311. Horizontal padding 12–16px, vertical 6–8px. Sits inline with product name or floats bottom-left of a card.

### Editorial Tag Badge
**Role:** Category / status label

Small pill, radius 4px, padding 4px 8px. Text GT America 11px weight 500 uppercase, #0e1311. Background fills: #faf080 for 'New Release', #cadcac for 'Elevated Brewing' / editorial categories, #cfa53b stroke for limited-edition or special-release items. Always bone or #0e1311 text — never chromatic text on chromatic background.

### Outlined Text Button
**Role:** Primary navigation action

No filled CTA. 'Shop Now' and similar actions are ID00 Serif italic 16–18px bone, no border, no background — pure typographic links. Underline appears on hover.

### Search Icon Button
**Role:** Header utility

24px line icon, bone stroke, no background, 8px hit area padding. In the right-side header cluster.

### Cart Indicator
**Role:** Header utility

Text-only 'Cart (0)' in GT America 14px weight 500 bone, parentheses around the count, no badge or pill — restraint over notification badges.

### Pairing Banner (Red Box)
**Role:** Co-branded event block

Large deep-red (#7a1212 approx) framed block containing partner logos at top, event title in GT America uppercase, product name in ID00 Serif 30px, event date at bottom. 4px hairline border, radius 4px. Used for SHED/OTHER wine-pairing events.

## Do's and Don'ts

### Do
- Set headlines and product names in ID00 Serif italic — the italic serif is the brand's voice. Setting them in roman or in the sans destroys the editorial feel.
- Keep the canvas near-black (#0e1311 or #000000) and let bone (#ffffff) type carry the hierarchy. Reach for colored surfaces only for inverted sections or badge fills.
- Use 4px radii on cards, buttons, inputs, and badges. The 60px radius is reserved exclusively for the cream price pill — do not apply it to other components.
- Place product photography on warm, low-lit studio backdrops (ember red, dark amber, charcoal). Avoid white or bright backgrounds — they break the dark-gallery mood.
- Use badge colors (citron #faf080, lichen #cadcac, antique gold #cfa53b) sparingly and only for editorial tags, not for actions or alerts.
- Make CTAs typographic links in ID00 Serif italic, not filled buttons. A 4px-radius ghost button is acceptable only for secondary utility actions like the cart selector.
- Separate layers with 1px hairlines in #1a1a1a or #dfdbca, not with shadows. The system runs on border contrast, not elevation.

### Don't
- Do not introduce a filled chromatic CTA button. The system is intentionally CTA-less at the primary level — actions are italic serif links.
- Do not set body copy or navigation in the serif. GT America is for UI; ID00 Serif is for editorial and product naming. Mixing the two roles dilutes both.
- Do not use bright white (#ffffff) as a page background. The system is dark-first; invert only for price chips, modal overlays, and the rare light section.
- Do not apply saturated brand colors to backgrounds, cards, or text. The chromatic palette exists only as small badge fills and hairlines.
- Do not use large drop shadows. The 10px blur at 5% opacity is the ceiling — anything heavier reads as Material/iOS, not editorial gallery.
- Do not set headlines in weight 600 or 700. The serif runs 300–400 italic and the sans runs 400–500. Anything bolder breaks the whisper-quiet tone.
- Do not place product photography on a white or light-gray background. Always shoot against a warm, dark studio tone to maintain the ember-roastery atmosphere.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Obsidian Canvas | `#0e1311` | Page and section background — the default dark surface |
| 1 | Lifted Black | `#1a1a1a` | Subtle elevation on nav, outlined controls, and card borders |
| 2 | Warm Card | `#dfdbca` | Product card border and hairline dividers — the khaki undertone that warms the dark UI |
| 3 | Linen Invert | `#f6f7f2` | Inverted light surface for price chips, soft button fills, and occasional light-on-light sections |
| 4 | Bone Overlay | `#ffffff` | Highest-elevation surface — full-invert buttons, modal backgrounds, and badge fills |

## Elevation

- **Product card:** `rgba(0, 0, 0, 0.05) 0px 2.5px 10px -4px`
- **Lifted card:** `rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.1) 0px 1px 2px -1px`

## Imagery

Photography is the dominant visual medium, and it is shot like editorial still-life: products on warm studio backdrops (deep ember-red, dark amber, charcoal) with soft directional lighting and a single visible floor shadow. No lifestyle imagery, no hands, no people, no café interiors — the object (a coffee bag, a V60 dripper on a timber block, a black roastery box) is always the hero, shot at close-to-product scale. Treated backgrounds are slightly desaturated, low-key, and warm — the product is in color, the world around it is in shadow. Iconography is minimal: a single chat-bubble glyph in a bone circle bottom-right, and thin line icons in the header. No illustration, no abstract graphics, no gradients applied to UI — gradients appear only in the hero backdrop as a soft ember wash behind the photograph.

## Layout

Full-width dark sections stack vertically with generous vertical breathing room (80px+ between sections). No centered max-width container; content stretches edge-to-edge and uses generous left/right gutters. The hero is a two-column split: a left 'index' column (about 30% width) of typographic editorial entries, and a right 'photograph' column (about 55% width) holding a single product image, with empty black space at the far right acting as breathing room. Below the hero, sections alternate between centered prose (the manifesto block), two-column product+text splits, and wide product card grids. The product grid is 3 columns on desktop, 2 on tablet, with cards that are roughly square and tightly packed. Navigation is a centered horizontal bar in the header. The overall rhythm: quiet black, loud photograph, quiet black, quiet copy, loud photograph — a gallery cadence, not a SaaS cadence.

## Agent Prompt Guide

**Quick Color Reference**
- text (on dark): #ffffff
- text (secondary/muted): #b3b3b3
- Create a Primary Action Button: #000000 background, #ffffff text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.
- surface (warm border / hairline): #dfdbca
- accent (editorial badge — new release): #faf080
- primary action: #000000 (filled action)

**3–5 Example Component Prompts**

1. *Editorial Hero Index Entry*: A vertical stack entry on #0e1311 canvas. Product name in ID00 Serif italic 21px, #ffffff. Sublabel 'Shop Now' or 'Limited Time Offer' in ID00 Serif italic 16px, #b3b3b3. Vertical spacing 48px between entries. No border, no background, no button — pure typographic link.

2. *Product Card (Dark)*: Square card on #0e1311 background, 4px radius, 1px border in #1a1a1a. Upper 65%: product photograph on a warm ember-red studio backdrop with soft shadow. Lower 35%: product name in ID00 Serif italic 24px #ffffff, tasting notes in GT America 14px #b3b3b3, price pill at bottom-left.

3. *Price Pill*: Inline pill, 60px radius, #f6f7f2 background, padding 6px 16px. Text 'From — €29.95' in GT America 13px weight 500, #0e1311. No border, no shadow.

4. *Editorial Tag Badge*: Small pill, 4px radius, #faf080 background, padding 4px 8px. Text 'New Release' in GT America 11px weight 500 uppercase, #0e1311. No border.

5. *Manifesto Block*: Full-width #0e1311 section, 80px vertical padding above and below. Centered or left-aligned text in ID00 Serif italic 36px, #ffffff, line-height 1.2, weight 300. No buttons, no links, no images — the prose is the section.

## Similar Brands

- **Square Mile Coffee Roasters** — Same dark editorial aesthetic with warm studio product photography and serif-driven product names over near-black canvases.
- **Onyx Coffee Lab** — Specialty coffee brand using a near-black canvas with hairline borders and minimal CTAs, letting photography carry the visual weight.
- **Manhattan Special Roasting Co.** — Dark-mode product-first ecommerce with italic serif product naming and warm-toned product photography on moody backdrops.
- **Workshop Coffee** — UK specialty roaster with a similarly restrained palette, serif italic editorial labels, and product-photography-led hero sections.

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-obsidian: #0e1311;
  --color-pure-black: #000000;
  --color-ash-charcoal: #1a1a1a;
  --color-graphite: #333333;
  --color-stone-gray: #808080;
  --color-silver: #b3b3b3;
  --color-bone: #ffffff;
  --color-linen: #f6f7f2;
  --color-sand-khaki: #dfdbca;
  --color-lichen-green: #cadcac;
  --color-citron: #faf080;
  --color-antique-gold: #cfa53b;
  --color-olive-bark: #4d4a31;

  /* Typography — Font Families */
  --font-gt-america-standard: 'GT America Standard', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-id00-serif: 'ID00 Serif', ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
  --font-helvetica: 'Helvetica', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-reviewsio-font: 'reviewsio-font', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.5;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 18px;
  --leading-subheading: 1.4;
  --text-heading-sm: 21px;
  --leading-heading-sm: 1.25;
  --text-heading: 30px;
  --leading-heading: 1.25;
  --text-heading-lg: 36px;
  --leading-heading-lg: 1.2;
  --text-display: 42px;
  --leading-display: 1.2;

  /* Typography — Weights */
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-80: 80px;
  --spacing-96: 96px;
  --spacing-160: 160px;

  /* Layout */
  --page-max-width: 1400px;
  --section-gap: 80px;
  --card-padding: 20px;
  --element-gap: 16px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-md-2: 7px;
  --radius-lg: 10px;
  --radius-full: 60px;
  --radius-full-2: 9999px;

  /* Named Radii */
  --radius-nav: 4px;
  --radius-cards: 4px;
  --radius-badges: 4px;
  --radius-inputs: 4px;
  --radius-buttons: 4px;
  --radius-pricepills: 60px;

  /* Shadows */
  --shadow-md: rgba(0, 0, 0, 0.05) 0px 2.5px 10px -4px;
  --shadow-subtle: rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.1) 0px 1px 2px -1px;

  /* Surfaces */
  --surface-obsidian-canvas: #0e1311;
  --surface-lifted-black: #1a1a1a;
  --surface-warm-card: #dfdbca;
  --surface-linen-invert: #f6f7f2;
  --surface-bone-overlay: #ffffff;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-obsidian: #0e1311;
  --color-pure-black: #000000;
  --color-ash-charcoal: #1a1a1a;
  --color-graphite: #333333;
  --color-stone-gray: #808080;
  --color-silver: #b3b3b3;
  --color-bone: #ffffff;
  --color-linen: #f6f7f2;
  --color-sand-khaki: #dfdbca;
  --color-lichen-green: #cadcac;
  --color-citron: #faf080;
  --color-antique-gold: #cfa53b;
  --color-olive-bark: #4d4a31;

  /* Typography */
  --font-gt-america-standard: 'GT America Standard', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-id00-serif: 'ID00 Serif', ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
  --font-helvetica: 'Helvetica', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-reviewsio-font: 'reviewsio-font', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.5;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 18px;
  --leading-subheading: 1.4;
  --text-heading-sm: 21px;
  --leading-heading-sm: 1.25;
  --text-heading: 30px;
  --leading-heading: 1.25;
  --text-heading-lg: 36px;
  --leading-heading-lg: 1.2;
  --text-display: 42px;
  --leading-display: 1.2;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-80: 80px;
  --spacing-96: 96px;
  --spacing-160: 160px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-md-2: 7px;
  --radius-lg: 10px;
  --radius-full: 60px;
  --radius-full-2: 9999px;

  /* Shadows */
  --shadow-md: rgba(0, 0, 0, 0.05) 0px 2.5px 10px -4px;
  --shadow-subtle: rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.1) 0px 1px 2px -1px;
}
```
