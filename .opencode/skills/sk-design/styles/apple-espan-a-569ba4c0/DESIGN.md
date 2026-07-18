# Apple (España) — Style Reference
> white museum gallery at noon

**Theme:** light

Apple's product page language is a luminous white gallery: every pixel of chrome is stripped away so the photographed product and one bold typographic statement own the screen. Headlines in SF Pro Display at 64–96px do nearly all of the work, set in near-black (#1d1d1f) with selectively tinted words — a green verb for one emotion, a blue verb for another — that turn the headline itself into a micro-product story. Surfaces are paper-flat: no shadows, no gradients, no decorative borders, only hairline rules and generous whitespace. Interaction is reduced to two button archetypes — a blue pill (#0071e3) for the purchase moment and a subtle neutral pill (#e2e2e5) for everything else — surrounded by a sea of 28px-rounded cards that float on a #f5f5f7 canvas. The whole system is engineered to feel weightless, confident, and barely-designed: the brand is the product, and the design system is the silence around it.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Pure Canvas | `#f5f5f7` | `--color-pure-canvas` | Page background, section bands, card surfaces — a near-white that separates structural surfaces from pure white product highlights without introducing tint |
| Paper White | `#ffffff` | `--color-paper-white` | Elevated card surfaces, icon fills, and inverted text on dark/colored backgrounds |
| Obsidian | `#1d1d1f` | `--color-obsidian` | Primary text, headlines, card borders, nav rules — the singular dark anchor; not pure black, a graphite that softens contrast on white |
| Iron Gray | `#707070` | `--color-iron-gray` | Secondary nav borders, list dividers, subdued UI metadata |
| Slate | `#474747` | `--color-slate` | Nav borders, link underlines, secondary text in dense lists |
| Charcoal | `#333336` | `--color-charcoal` | Nav text, button labels on neutral surfaces — slightly cool graphite for UI controls |
| Mist | `#e2e2e5` | `--color-mist` | Neutral pill button fill, secondary surface tier for compact controls and list rows |
| Fog | `#d6d6d6` | `--color-fog` | List row backgrounds, hairline separators in data-dense sections |
| Void | `#000000` | `--color-void` | Icon fills on light surfaces, nav logo — reserved for the most absolute contrast moments |
| Signal Blue | `#0071e3` | `--color-signal-blue` | Blue action color for filled buttons, selected navigation states, and focused conversion moments. |
| Deep Link Blue | `#0066cc` | `--color-deep-link-blue` | Inline link text and link underlines throughout body copy — the only chromatic text color permitted in paragraph flow |
| Pulse Green | `#03aa49` | `--color-pulse-green` | Accent word within hero headlines (e.g. the first verb of a product tagline) — used to color-code an emotional concept inside otherwise monochrome type |
| Deep Green | `#03873a` | `--color-deep-green` | Darker green variant for text-level green accents and underlined links in sustainability/spec contexts |
| Ultraviolet | `#8668ff` | `--color-ultraviolet` | Violet outline accent for tags, dividers, and focused UI edges. |
| Ember Orange | `#ed6300` | `--color-ember-orange` | Orange outline accent for tags, dividers, and focused UI edges. |
| Lagoon Teal | `#00a1b3` | `--color-lagoon-teal` | Teal outline accent for tags, dividers, and focused UI edges. |

## Tokens — Typography

### SF Pro Display — Hero headlines, section headings, and the page-level brand statement. Set in semibold at very large sizes (64–96px) with aggressive negative tracking (-0.019em to -0.005em) that tightens the headline into a single confident block. Smaller sizes (21–28px) carry section headings and card titles. The signature choice: weight 600 is the heaviest weight on the entire site — Apple trusts display weight 600 over 700+ to command the page · `--font-sf-pro-display`
- **Substitute:** Inter, Helvetica Neue, system-ui
- **Weights:** 600
- **Sizes:** 21px, 24px, 28px, 39px, 64px, 76px, 80px, 96px
- **Line height:** 1.04–1.17 for display sizes; 1.33 for sub-heading sizes
- **Letter spacing:** -0.0190em at 96px, -0.0150em at 64px, -0.0090em at 39px, 0.0110em at 21px (positive tracking for small display sizes)
- **OpenType features:** `"numr" on`
- **Role:** Hero headlines, section headings, and the page-level brand statement. Set in semibold at very large sizes (64–96px) with aggressive negative tracking (-0.019em to -0.005em) that tightens the headline into a single confident block. Smaller sizes (21–28px) carry section headings and card titles. The signature choice: weight 600 is the heaviest weight on the entire site — Apple trusts display weight 600 over 700+ to command the page

### SF Pro Text — Body copy, nav labels, button text, spec text, and large display numerals (44px). Weight 400 is the paragraph default; weight 600 marks links, button labels, and emphasis within body text. The 44px instance is a display-numeral role used for prices or large data — it borrows SF Pro Text rather than Display because the data needs to feel tabular, not editorial · `--font-sf-pro-text`
- **Substitute:** Inter, Helvetica Neue, system-ui
- **Weights:** 400, 600
- **Sizes:** 12px, 14px, 17px, 20px, 44px
- **Line height:** 1.18–1.47 for body; 1.00 for the 44px nav utility size
- **Letter spacing:** -0.0220em at 44px, -0.0190em at 20px, -0.0160em at 17px, -0.0100em at 14px, -0.0030em at 12px
- **OpenType features:** `"numr" on`
- **Role:** Body copy, nav labels, button text, spec text, and large display numerals (44px). Weight 400 is the paragraph default; weight 600 marks links, button labels, and emphasis within body text. The 44px instance is a display-numeral role used for prices or large data — it borrows SF Pro Text rather than Display because the data needs to feel tabular, not editorial

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.33 | -0.036px | `--text-caption` |
| body-sm | 14px | 1.43 | -0.14px | `--text-body-sm` |
| body | 17px | 1.47 | -0.272px | `--text-body` |
| subheading | 21px | 1.33 | 0.231px | `--text-subheading` |
| heading-sm | 28px | 1.14 | -0.252px | `--text-heading-sm` |
| heading | 39px | 1.07 | -0.351px | `--text-heading` |
| heading-lg | 64px | 1.06 | -0.96px | `--text-heading-lg` |
| display | 96px | 1.04 | -1.824px | `--text-display` |

## Tokens — Spacing & Shapes

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 8 | 8px | `--spacing-8` |
| 9 | 9px | `--spacing-9` |
| 10 | 10px | `--spacing-10` |
| 13 | 13px | `--spacing-13` |
| 14 | 14px | `--spacing-14` |
| 15 | 15px | `--spacing-15` |
| 18 | 18px | `--spacing-18` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 28 | 28px | `--spacing-28` |
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 80 | 80px | `--spacing-80` |
| 89 | 89px | `--spacing-89` |
| 160 | 160px | `--spacing-160` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 980px |
| cards | 28px |
| links | 10px |
| buttons | 980px |
| buttons-large | 36px |

### Layout

- **Page max-width:** 1440px
- **Section gap:** 80-120px
- **Card padding:** 28px
- **Element gap:** 8-12px

## Components

### Primary Action Button
**Role:** The purchase or key conversion moment — Apple's only filled chromatic button

Pill shape at 980px radius, filled with #0071e3, white text in SF Pro Text 17px / weight 600. Padding 11px vertical, 20px horizontal. Letter-spacing -0.022em. No border, no shadow. This is the only button on the page permitted to be blue.

### Neutral Pill Button
**Role:** Secondary action — 'Learn more', 'See all', disclosure expanders

Pill shape at 980px radius, filled with #e2e2e5, text in #333336 SF Pro Text 17px / weight 600. Same 11px/20px padding as the primary. The visual quiet cousin of the primary: identical geometry, desaturated fill.

### Pill Disclosure Item
**Role:** Expandable spec detail rows in the 'Más de cerca' (closer look) section

Pill shape at 980px radius, transparent fill with 1px border in #d6d6d6. Left side holds a small '+' icon, right side holds the spec label in SF Pro Text 14px / weight 400 / #1d1d1f. No background fill until expanded.

### Product Hero Block
**Role:** Full-bleed product showcase above the fold

White canvas (#ffffff). Centered composition: the photographed product floats without frame, followed below by the brand kicker (Apple logo glyph + 'WATCH SE 3' in SF Pro Text 12px / weight 600 / uppercase / letter-spacing tight), then the display headline (SF Pro Display 64-96px / weight 600) where one or two verbs are tinted in #03aa49, #0066cc, or #8668ff. Headlines are set left-aligned, not centered.

### Headline with Tinted Accent Words
**Role:** Signature typographic pattern — the colored-word-in-headline technique

SF Pro Display 64px / weight 600 / #1d1d1f, with a single verb or noun in #03aa49 (green for energy), #0066cc (blue for intelligence), #8668ff (violet for software), #ed6300 (orange for fitness), or #00a1b3 (teal for health). The tint lives on the word, not a highlight, and the rest of the line stays Obsidian.

### Feature Card
**Role:** Large rectangular card for product close-up photography with caption

Border-radius 28px. Background #ffffff. 1px hairline border in #1d1d1f (very subtle, often absent — the card sits on #f5f5f7 canvas with no border). The image occupies the full card width; caption text in SF Pro Text 17px / weight 400 / #1d1d1f sits at the right edge of the card, left-aligned within its own column.

### Sticky Top Navigation
**Role:** Global product line nav with pill background utility area

White fill, 1px bottom border in #d6d6d6. Nav labels in SF Pro Text 12px / weight 400 / #1d1d1f. Apple logo at left in #000000. Right-side utility items (search, bag) at 980px pill radius with #f5f5f7 background. The pill radius is used to round the search and bag containers, not the nav bar itself.

### Utility Bar
**Role:** Slim promotional band above the main nav

Full-width band in #f5f5f7. Single line of SF Pro Text 12px / weight 400 / #1d1d1f text, centered. Inline 'Comprar >' link in #0066cc. No border, no padding emphasis — sits flush above the nav.

### Band Section
**Role:** Alternating full-width content bands — the page's primary structural unit

Each band is a full-bleed horizontal block, either #ffffff or #f5f5f7. Section heading sits in the top-left corner in SF Pro Display 39-64px / weight 600 / #1d1d1f. Content within the band uses the standard max-width container with generous internal padding (~80px top/bottom). Bands alternate between text-left/image-right and image-left/text-right compositions.

### Price + Action Stack
**Role:** The buy moment cluster directly under the hero headline

Two elements on one row: 'Desde 269 €' price in SF Pro Text 14px / weight 400 / #1d1d1f, followed by the Primary Action Button (#0071e3 pill, white text). The price label has no border, no background — it is pure text, letting the blue pill do the visual work.

### Link Inline (Body Flow)
**Role:** In-paragraph link text

Color #0066cc, 1px underline in #0066cc. SF Pro Text 17px / weight 400 (inherits paragraph weight). No special padding or background.

## Do's and Don'ts

### Do
- Use SF Pro Display weight 600 for any display-size headline; never go heavier than 600 — the restraint is the authority
- Tint single words in headlines using #03aa49, #0066cc, #8668ff, #ed6300, or #00a1b3; keep the rest of the line #1d1d1f
- Use #0071e3 fill on a 980px pill as the sole primary action — never apply this blue to text, borders, or non-button surfaces
- Set headlines left-aligned within a left-aligned content column; do not center display type
- Use 28px border-radius for cards and 980px (full pill) for buttons — these two radii carry the entire shape language
- Pair every chromatic button with a #1d1d1f text label nearby (price, kicker) so the blue pill remains the singular attention point
- Let product photography fill the card; place caption text at the card's edge in a narrow column rather than overlaying the image

### Don't
- Do not introduce box-shadows, glows, or drop-shadows — elevation comes from surface contrast and 1px hairlines only
- Do not use the chromatic accent colors (green, violet, orange, teal) for backgrounds, buttons, or large fills — they are word-tints only
- Do not use #0000ee or any unstyled browser-default link color — always #0066cc with a 1px underline
- Do not set body copy above 20px or below 14px; 17px is the singular paragraph size
- Do not use a border-radius value other than 10px, 28px, 32px, 36px, or 980px — these are the only radii in the system
- Do not center the hero headline or the price+CTA cluster — left-alignment is structural, not stylistic
- Do not apply gradients to text, buttons, or cards; gradients are reserved for potential future decorative use and are not a current pattern on the product surface

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#f5f5f7` | Page-level background, the base on which all sections sit |
| 1 | Card | `#ffffff` | Product cards, feature callout blocks, and any content container that needs to lift off the canvas |
| 2 | Control | `#e2e2e5` | Neutral pill buttons, secondary list rows, compact UI surfaces |
| 3 | Divider | `#d6d6d6` | Hairline separators and subtle row backgrounds in data-dense bands |

## Elevation

Apple's product pages do not use box-shadow. Elevation is achieved entirely through surface contrast — #ffffff cards on a #f5f5f7 canvas, with 1px hairlines in #d6d6d6 or #1d1d1f providing the only structural division. The system intentionally avoids drop shadows, glows, or depth cues; everything sits on the same optical plane, which keeps the product photography visually unchallenged.

## Imagery

Photography dominates. The site is a hardware showcase — every section is built around large, high-resolution product photography rendered on pure white with no lifestyle context, no props, no environment. The watch is photographed at three-quarter angles showing the face, band, and case simultaneously; the band colors (neon yellow, orange, slate) are used as compositional color blocks against the white. There is zero illustration, zero iconographic decoration, and zero 3D rendering — everything is optical product photography. The only non-photographic visual is the Apple logo and the occasional small SF Symbol-style icon (search, bag, plus). Imagery density is very low relative to text: one or two large photographs per band, surrounded by vast white margins. The visual hierarchy is photograph > headline > body > UI chrome.

## Layout

Full-bleed bands stacked vertically, each band a horizontal slice of #ffffff or #f5f5f7. Page max-width is 1440px but content containers sit narrower (~980px) and are left-aligned, never centered. The hero band is a tall product showcase: product image at top half, then below it the left-aligned kicker, display headline, and price+CTA cluster. Subsequent bands alternate between image-left/text-right and text-left/image-right compositions at roughly 50/50 width splits. The 'Lo principal' (highlights) section uses large feature cards with full-bleed photography and a narrow text column anchored to the right edge of each card. The 'Más de cerca' section uses a centered composition: small pill disclosure list on the left, large product image on the right. Section gaps are generous (80-120px). The overall rhythm is slow, photographic, and editorial — bands breathe.

## Agent Prompt Guide

## Quick Color Reference
- text (primary): #1d1d1f
- background: #ffffff (cards) / #f5f5f7 (canvas)
- border / hairline: #1d1d1f or #d6d6d6
- link inline: #0066cc with 1px underline
- accent word in headline: #03aa49 (green), #0066cc (blue), #8668ff (violet), #ed6300 (orange), #00a1b3 (teal)
- primary action: #0071e3 (filled action)
- neutral action: #e2e2e5 fill, #333336 text

## Example Component Prompts

1. **Hero Headline with Tinted Verb**: Build a hero block on #ffffff. Product image (centered, full width up to 1200px). Below: kicker 'APPLE WATCH SE 3' in SF Pro Text 12px / weight 600 / uppercase / #1d1d1f. Display headline at 64px SF Pro Display / weight 600 / letter-spacing -0.015em, where the first word is #03aa49 and the remaining words are #1d1d1f. Set left-aligned within a 980px content column.

2. **Primary Action Button**: Pill at 980px radius. Fill #0071e3. Text 'Comprar' in SF Pro Text 17px / weight 600 / #ffffff, letter-spacing -0.022em. Padding 11px vertical, 20px horizontal. No border, no shadow.

3. **Feature Band Section**: Full-bleed band on #f5f5f7. Section heading 'Lo principal.' in SF Pro Display 64px / weight 600 / #1d1d1f, left-aligned in a 980px column. Below: a 28px-radius white card containing a full-bleed product photograph on the left two-thirds, and body caption text in SF Pro Text 17px / weight 400 / #1d1d1f in the right one-third column. Top padding 80px, bottom padding 120px.

4. **Neutral Pill Disclosure**: Pill at 980px radius, transparent fill, 1px border #d6d6d6. '+' icon at left in #1d1d1f. Label text in SF Pro Text 14px / weight 400 / #1d1d1f. 11px vertical padding, 16px horizontal.

5. **Price + Action Stack**: Inline row on a single baseline. Left: 'Desde 269 €' in SF Pro Text 14px / weight 400 / #1d1d1f. Right: the Primary Action Button (#0071e3 pill, 'Comprar', 11px/20px padding). 8px gap between the two elements.

## Similar Brands

- **Apple (global product pages)** — Identical design system — the same SF Pro Display headlines with tinted accent words, 980px pill buttons in #0071e3, #f5f5f7 canvas, and zero-shadow layout. This is the source of truth.
- **Bose** — Same white-gallery product photography approach with left-aligned product hero and one-color CTA pill (Bose red); same comfortable spacing and absence of shadows
- **Dyson** — Same product-as-hero composition on pure white with display-weight headlines and a single chromatic action color (Dyson yellow); same hairline-divided section bands
- **Sonos** — Same large product photography, generous vertical band spacing, and one bold monochromatic + neutral button system; identical avoidance of decorative gradients or shadows
- **Teenage Engineering** — Same commitment to large display-weight headlines and product photography on white, with the same restrained two-button system (one chromatic, one neutral) and tight 28px card radii

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-pure-canvas: #f5f5f7;
  --color-paper-white: #ffffff;
  --color-obsidian: #1d1d1f;
  --color-iron-gray: #707070;
  --color-slate: #474747;
  --color-charcoal: #333336;
  --color-mist: #e2e2e5;
  --color-fog: #d6d6d6;
  --color-void: #000000;
  --color-signal-blue: #0071e3;
  --color-deep-link-blue: #0066cc;
  --color-pulse-green: #03aa49;
  --color-deep-green: #03873a;
  --color-ultraviolet: #8668ff;
  --color-ember-orange: #ed6300;
  --color-lagoon-teal: #00a1b3;

  /* Typography — Font Families */
  --font-sf-pro-display: 'SF Pro Display', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-sf-pro-text: 'SF Pro Text', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.33;
  --tracking-caption: -0.036px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.43;
  --tracking-body-sm: -0.14px;
  --text-body: 17px;
  --leading-body: 1.47;
  --tracking-body: -0.272px;
  --text-subheading: 21px;
  --leading-subheading: 1.33;
  --tracking-subheading: 0.231px;
  --text-heading-sm: 28px;
  --leading-heading-sm: 1.14;
  --tracking-heading-sm: -0.252px;
  --text-heading: 39px;
  --leading-heading: 1.07;
  --tracking-heading: -0.351px;
  --text-heading-lg: 64px;
  --leading-heading-lg: 1.06;
  --tracking-heading-lg: -0.96px;
  --text-display: 96px;
  --leading-display: 1.04;
  --tracking-display: -1.824px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-semibold: 600;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-9: 9px;
  --spacing-10: 10px;
  --spacing-13: 13px;
  --spacing-14: 14px;
  --spacing-15: 15px;
  --spacing-18: 18px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-80: 80px;
  --spacing-89: 89px;
  --spacing-160: 160px;

  /* Layout */
  --page-max-width: 1440px;
  --section-gap: 80-120px;
  --card-padding: 28px;
  --element-gap: 8-12px;

  /* Border Radius */
  --radius-lg: 10px;
  --radius-3xl: 28px;
  --radius-3xl-2: 32px;
  --radius-3xl-3: 36px;
  --radius-full: 980px;

  /* Named Radii */
  --radius-nav: 980px;
  --radius-cards: 28px;
  --radius-links: 10px;
  --radius-buttons: 980px;
  --radius-buttons-large: 36px;

  /* Surfaces */
  --surface-canvas: #f5f5f7;
  --surface-card: #ffffff;
  --surface-control: #e2e2e5;
  --surface-divider: #d6d6d6;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-pure-canvas: #f5f5f7;
  --color-paper-white: #ffffff;
  --color-obsidian: #1d1d1f;
  --color-iron-gray: #707070;
  --color-slate: #474747;
  --color-charcoal: #333336;
  --color-mist: #e2e2e5;
  --color-fog: #d6d6d6;
  --color-void: #000000;
  --color-signal-blue: #0071e3;
  --color-deep-link-blue: #0066cc;
  --color-pulse-green: #03aa49;
  --color-deep-green: #03873a;
  --color-ultraviolet: #8668ff;
  --color-ember-orange: #ed6300;
  --color-lagoon-teal: #00a1b3;

  /* Typography */
  --font-sf-pro-display: 'SF Pro Display', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-sf-pro-text: 'SF Pro Text', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.33;
  --tracking-caption: -0.036px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.43;
  --tracking-body-sm: -0.14px;
  --text-body: 17px;
  --leading-body: 1.47;
  --tracking-body: -0.272px;
  --text-subheading: 21px;
  --leading-subheading: 1.33;
  --tracking-subheading: 0.231px;
  --text-heading-sm: 28px;
  --leading-heading-sm: 1.14;
  --tracking-heading-sm: -0.252px;
  --text-heading: 39px;
  --leading-heading: 1.07;
  --tracking-heading: -0.351px;
  --text-heading-lg: 64px;
  --leading-heading-lg: 1.06;
  --tracking-heading-lg: -0.96px;
  --text-display: 96px;
  --leading-display: 1.04;
  --tracking-display: -1.824px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-9: 9px;
  --spacing-10: 10px;
  --spacing-13: 13px;
  --spacing-14: 14px;
  --spacing-15: 15px;
  --spacing-18: 18px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-80: 80px;
  --spacing-89: 89px;
  --spacing-160: 160px;

  /* Border Radius */
  --radius-lg: 10px;
  --radius-3xl: 28px;
  --radius-3xl-2: 32px;
  --radius-3xl-3: 36px;
  --radius-full: 980px;
}
```
