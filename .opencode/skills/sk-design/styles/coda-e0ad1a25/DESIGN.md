# Coda — Style Reference
> Monumental letters on warm cream parchment — Coda reads like a hand-set marketplace poster, not a SaaS dashboard.

**Theme:** light

Coda's visual language is a confident, almost architectural marketplace identity built on a warm cream canvas (#f8f9eb) rather than stark white. The defining signature is monumental display type — a custom geometric grotesque (Monument Grotesk) set extremely tight (line-height 0.90) at sizes up to 134px, making headlines feel like carved signage rather than web copy. Every surface is bordered, not shadowed: hairline charcoal outlines on cream create a blueprint-like precision that pairs with pill-shaped tags, small rounded buttons (~13px radius), and one deep forest-green section that breaks the monochrome rhythm with organic blob shapes. Color is used as deliberate, sparse punctuation — a mint card here, a lilac or rose card there — while the structural palette stays earthy and achromatic. The effect is half editorial brutalism, half boutique storefront: warm, tactile, and emphatically physical rather than digital-glass.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Cream Parchment | `#f8f9eb` | `--color-cream-parchment` | Page canvas, primary background, nav and body surface |
| Pure White | `#ffffff` | `--color-pure-white` | Elevated card surfaces, icon fills inside outlined containers, text on dark buttons |
| Obsidian | `#000000` | `--color-obsidian` | Hairline borders, primary text, outline strokes, dark surface dividers |
| Charcoal | `#202020` | `--color-charcoal` | Filled button background, dark elevated surfaces, secondary text on cream |
| Sage Mist | `#c0c2a9` | `--color-sage-mist` | Muted borders, icon strokes, secondary text, soft dividers between sections |
| Olive Slate | `#5a5a4f` | `--color-olive-slate` | Secondary and meta text, subdued captions, lower-emphasis copy |
| Pebble | `#7c7d76` | `--color-pebble` | Tertiary text, caption labels, subdued helper copy on cream |
| Bone | `#edeee1` | `--color-bone` | Subtle button border, faint hover surface, near-canvas divider |
| Forest Depths | `#003d21` | `--color-forest-depths` | Hero feature section background, brand-defining dark band, bold UI surface |
| Mint Sprout | `#aafdc0` | `--color-mint-sprout` | Light green card surface, heading accent stroke, lively pastel fill |
| Cobalt Ink | `#041668` | `--color-cobalt-ink` | Decorative icon fill, deep accent stroke, secondary brand hue |
| Plum Depth | `#2d0078` | `--color-plum-depth` | Decorative icon fill, deep accent stroke, tertiary brand hue |
| Wine Shadow | `#3f0929` | `--color-wine-shadow` | Decorative icon fill, deep accent stroke, warm accent hue |
| Lilac Wash | `#d3beff` | `--color-lilac-wash` | Soft purple card surface, pastel feature tile |
| Sky Wash | `#b0f4ff` | `--color-sky-wash` | Soft teal card surface, pastel feature tile |
| Rose Wash | `#ffc0e6` | `--color-rose-wash` | Soft pink card surface, pastel feature tile |

## Tokens — Typography

### ui-sans-serif — ui-sans-serif — detected in extracted data but not described by AI · `--font-ui-sans-serif`
- **Weights:** 400
- **Sizes:** 16px
- **Line height:** 1.5
- **Role:** ui-sans-serif — detected in extracted data but not described by AI

### Monument Grotesk (custom) — The single voice of the brand — headlines, body, buttons, nav, and tags all use this custom geometric grotesque. Weight 800 for monumental display, 500 for medium emphasis, 400 for body and UI. The tight 0.90 leading on large sizes is a signature: type compresses into architectural blocks instead of airy editorial columns. · `--font-monument-grotesk-custom`
- **Substitute:** Archivo, Space Grotesk, or Inter Tight at 700/800 weights
- **Weights:** 400, 500, 800
- **Sizes:** 10, 12, 14, 16, 18, 21, 22, 25, 34, 45, 54, 63, 72, 134
- **Line height:** 0.90–1.50 depending on size
- **Letter spacing:** Near-zero: -0.01em at all sizes for optical tightening on bold weights
- **Role:** The single voice of the brand — headlines, body, buttons, nav, and tags all use this custom geometric grotesque. Weight 800 for monumental display, 500 for medium emphasis, 400 for body and UI. The tight 0.90 leading on large sizes is a signature: type compresses into architectural blocks instead of airy editorial columns.

### JetBrains Mono — Code-like monospace used for pill tags, small status badges, and technical microcopy. The mono voice deliberately contrasts the rounded geometric grotesque, signaling 'system' or 'label' rather than 'message'. · `--font-jetbrains-mono`
- **Substitute:** IBM Plex Mono or JetBrains Mono
- **Weights:** 400
- **Sizes:** 10, 12, 14, 16
- **Line height:** 1.20–1.37
- **Role:** Code-like monospace used for pill tags, small status badges, and technical microcopy. The mono voice deliberately contrasts the rounded geometric grotesque, signaling 'system' or 'label' rather than 'message'.

### System UI Sans — Fallback and accessibility text where Monument Grotesk is unavailable; also used for non-brand secondary text and link rendering in card surfaces · `--font-system-ui-sans`
- **Substitute:** System default sans-serif stack
- **Weights:** 400
- **Sizes:** 16
- **Line height:** 1.50
- **Role:** Fallback and accessibility text where Monument Grotesk is unavailable; also used for non-brand secondary text and link rendering in card surfaces

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.37 | -0.01px | `--text-caption` |
| body-sm | 14px | 1.43 | -0.01px | `--text-body-sm` |
| body | 16px | 1.5 | -0.01px | `--text-body` |
| subheading | 21px | 1.3 | -0.01px | `--text-subheading` |
| heading-sm | 25px | 1.3 | -0.01px | `--text-heading-sm` |
| heading | 34px | 1.13 | -0.01px | `--text-heading` |
| heading-lg | 45px | 1.02 | -0.01px | `--text-heading-lg` |
| display | 72px | 0.9 | -0.01px | `--text-display` |
| display-xl | 134px | 0.9 | -0.01px | `--text-display-xl` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 6 | 6px | `--spacing-6` |
| 9 | 9px | `--spacing-9` |
| 13 | 13px | `--spacing-13` |
| 14 | 14px | `--spacing-14` |
| 17 | 17px | `--spacing-17` |
| 18 | 18px | `--spacing-18` |
| 27 | 27px | `--spacing-27` |
| 36 | 36px | `--spacing-36` |
| 45 | 45px | `--spacing-45` |
| 63 | 63px | `--spacing-63` |
| 72 | 72px | `--spacing-72` |
| 89 | 89px | `--spacing-89` |
| 107 | 107px | `--spacing-107` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 22px |
| badges | 9999px |
| buttons | 13px |
| heroCards | 45px |
| largeCards | 27px |
| smallButtons | 9px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 72px
- **Card padding:** 27px
- **Element gap:** 13px

## Components

### Announcement Bar
**Role:** Slim full-width strip above the navigation

Charcoal (#202020) background spanning edge-to-edge, 4–9px row gap inside, tracking-wide monospace caption in #f8f9eb at 12px, optional right-aligned close (×) in cream. Height is compact — one line of text with comfortable vertical padding.

### Top Navigation
**Role:** Primary site header with logo, links, language switcher, and CTA

Transparent or Cream Parchment (#f8f9eb) background, no bottom border. CODA wordmark in Monument Grotesk weight 800 at ~25px on the left. Center: four nav links in 16px weight 500, #202020. Right: language flag dropdown, 'Contact us' text link, and a filled dark Charcoal CTA button (13px radius, 13px 18px padding, white text). Nav links separated by ~27px horizontal gap.

### Filled Primary Button
**Role:** Primary call-to-action ('Get Started', 'Learn more')

Charcoal (#202020) fill, white text, Monument Grotesk weight 500 at 16px, 13px border-radius, padding 13px 18px, no border. Sits as the only filled button variant — there is no chromatic CTA. Hover slightly lightens to #2e2e2e.

### Outlined Ghost Button
**Role:** Secondary action on cream backgrounds

Transparent fill, 1.5px #c0c2a9 (Sage Mist) border, Charcoal text, 9px radius, 13px 18px padding. Used for low-emphasis actions that should not compete with the primary CTA.

### Pill Status Badge
**Role:** Small contextual label above section headlines ('READY TO GROW? WE'RE READY TO GO')

Full 9999px radius, 1.5px #c0c2a9 Sage Mist border, transparent fill, JetBrains Mono 12px uppercase in #202020. Padding 9px 13px. The pill shape and monospace text are a deliberate 'system tag' signal.

### Monumental Display Headline
**Role:** Hero and section-headline typography

Monument Grotesk weight 800 at 72–134px, line-height 0.90, letter-spacing -0.01em, color #000000. Icon glyphs (circular logos, smiley, arrow chips) are set inline as black outlined marks, aligned to the baseline — type and pictogram sit on the same line. Two-line stack: top line long, second line short and centered beneath.

### Subheadline
**Role:** Supporting paragraph under hero or section headlines

Monument Grotesk weight 400 at 18–21px, line-height 1.30, Charcoal (#202020), centered under the display headline. Acts as the 'quiet voice' after the monumental shout.

### Full-Bleed Forest Section
**Role:** Feature showcase band breaking the cream rhythm

Forest Depths (#003d21) background, full-bleed, ~45px corner radius on its top edge so it bleeds into the cream canvas as a soft mound. Inside: organic circular blob clusters in Mint Sprout at 60–80% opacity, layered like a 3D coin stack. Section padding 63–72px top/bottom.

### Feature Card with Outlined Icon
**Role:** Feature explanation card (e.g. 'Your web store, your way')

Forest Depths (#003d21) background continues behind, card itself is the Forest surface. Left side: Mint Sprout text headline in Monument Grotesk 800 at 45–54px, weight 800, line-height 1.02. Right side: a Mint Sprout (#aafdc0) rounded square card (~22px radius, 27px padding) containing a bold black icon (smiley face, etc.) in Monument Grotesk style, a short description in 14px Charcoal, and a Filled Primary Button (dark on the mint).

### Pastel Surface Card
**Role:** Tonal card highlighting a specific feature or content tile

Single full-bleed pastel surface in one of Lilac Wash (#d3beff), Sky Wash (#b0f4ff), Rose Wash (#ffc0e6), or Mint Sprout (#aafdc0). 22–27px radius, 27px padding. The color is the entire background — no border, no shadow. Headline in Monument Grotesk 800 in matching dark accent (Cobalt Ink, Plum Depth, Wine Shadow, or Charcoal).

### Icon-in-Rounded-Square
**Role:** Small icon container used in lists and feature callouts

22px radius, ~45×45px, filled with a chromatic accent (Mint Sprout, Cobalt Ink, etc.), 2px black outline. Icon is a single Monument Grotesk-styled pictogram (face, arrow, coin) in black, centered.

### Inline Graphic Glyph
**Role:** Decorative icon set inline with display headlines

Black-outlined geometric mark (circle with face, chip with arrow, spiral, double chevron) sized to match the cap-height of the display headline, set on the same baseline. Functions as a typographic ornament, not a separator.

## Do's and Don'ts

### Do
- Set display headlines in Monument Grotesk weight 800 at line-height 0.90 — type compression is the brand's identity, not a typographic mistake to fix.
- Default to Cream Parchment (#f8f9eb) as the canvas for all new screens; reserve Forest Depths (#003d21) for one feature band per page so it lands as a deliberate shift, not a competing background.
- Use Charcoal (#202020) as the only filled button color — there is no chromatic CTA. Accent colors belong to icons, card surfaces, and decorative strokes, never to action backgrounds.
- Border everything instead of shadowing: 1.5px Obsidian (#000000) or Sage Mist (#c0c2a9) outlines on cream surfaces. Elevation comes from outline and fill, not from box-shadow.
- Use the pastel palette (Mint Sprout, Lilac Wash, Sky Wash, Rose Wash) as full-card backgrounds — one color per card, no borders, no gradients inside.
- Apply 13px radius to buttons and 22px radius to cards consistently. Reserve 9999px for pill badges and tags only.
- Keep monospace (JetBrains Mono) restricted to 10–14px status tags, badges, and small caps labels — never use it for body sentences.

### Don't
- Do not set headlines with comfortable or airy line-height (1.3+) at display sizes — the brand's monumental effect collapses if display type breathes.
- Do not introduce a chromatic filled button (blue, green, purple) — the only CTA fill is Charcoal. Adding color to CTAs dilutes the monochrome discipline.
- Do not use #ffffff as the page background — Coda's warmth depends on Cream Parchment. Pure white makes the design feel like a generic SaaS page.
- Do not apply drop shadows or multi-layer box-shadows to cards or buttons — the border system replaces elevation. A shadow here breaks the blueprint metaphor.
- Do not mix the pastel colors inside a single card or use gradients to blend them — each pastel card is a single solid wash.
- Do not use rounded fonts (Inter, Nunito) or humanist serifs as substitutes for Monument Grotesk — the geometric grotesque compression is the signature.
- Do not add chromatic borders to dark cards. Dark sections use Mint Sprout or pastel fills internally; their outlines stay monochrome or none.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Cream Parchment | `#f8f9eb` | Primary page canvas, nav background, hero surface |
| 2 | Pure White | `#ffffff` | Elevated card surface inside dark sections, icon fills |
| 2 | Pastel Mint | `#aafdc0` | Light feature card surface, text accent on dark sections |
| 2 | Pastel Lilac | `#d3beff` | Pastel card surface variant |
| 2 | Pastel Sky | `#b0f4ff` | Pastel card surface variant |
| 2 | Pastel Rose | `#ffc0e6` | Pastel card surface variant |
| 3 | Charcoal | `#202020` | Filled button surface, dark elevated card |
| 3 | Forest Depths | `#003d21` | Full-bleed feature band, brand-defining dark surface |
| 4 | Obsidian | `#000000` | Outlined and bordered containers, text, inline graphic glyphs |

## Imagery

Imagery is minimal and text-driven. The site uses abstract 3D-rendered organic blob clusters (overlapping soft circular forms in Mint Sprout and Forest Depths) as decorative atmosphere inside the dark feature band — these are the only major visuals and feel sculptural, not photographic. Black-outlined icon glyphs (smiley faces, arrows, spirals, chip patterns) function as pictographic ornaments, set inline with display type at headline scale. There is no photography, no lifestyle imagery, and no product screenshots; the brand is expressed through monumental typography and the cream-and-forest color contrast alone. Icons are monoline geometric, matched to Monument Grotesk's character widths.

## Layout

Centered, max-width ~1200px contained layout with full-bleed feature bands. Top of page: announcement bar → nav → centered hero with a pill status badge, then a two-line monumental display headline with inline icon glyphs, then a short subheadline. Below the hero, a full-bleed Forest Depths band with organic blob decoration and a single feature card (icon + headline + CTA) sits inside. Sections are vertically separated by 63–72px gaps, with the Forest band connecting to cream via a ~45px radius mound rather than a hard edge. The rest of the page alternates cream canvas with isolated pastel card surfaces. Navigation is a single top bar with logo left, four text links center, language flag and CTA right. No sidebar, no sticky patterns beyond the announcement bar.

## Agent Prompt Guide

Quick Color Reference:
- text: #000000 (Obsidian) for primary copy, #202020 (Charcoal) for secondary
- background: #f8f9eb (Cream Parchment) for canvas, #003d21 (Forest Depths) for one full-bleed feature band
- border: #c0c2a9 (Sage Mist) 1.5px on cream, #000000 (Obsidian) 1.5px for stronger outlines
- accent: #aafdc0 (Mint Sprout) for the primary accent surface and headline color on dark sections
- pastel cards: #d3beff, #b0f4ff, #ffc0e6 — each used as a single solid wash on a card
- primary action: #202020 (filled action)

Example Component Prompts:

1. Hero Section — Centered on Cream Parchment (#f8f9eb). Pill badge at top: 9999px radius, 1.5px #c0c2a9 border, transparent fill, JetBrains Mono 12px uppercase in #202020 reading the section label, padding 9px 13px. Monumental headline below: Monument Grotesk weight 800, 72–96px, line-height 0.90, letter-spacing -0.01em, color #000000, centered. Two black inline icon glyphs (rounded square smiley, chip-arrow) sized to the cap-height and set on the headline baseline. Subheadline: Monument Grotesk weight 400, 18–21px, line-height 1.30, #202020, centered, max-width ~640px.

2. Filled Primary Button — Charcoal (#202020) fill, white text, Monument Grotesk weight 500, 16px, padding 13px 18px, 13px border-radius, no border. Used for 'Get Started' and 'Learn more' CTAs.

3. Outlined Ghost Button — Transparent fill, 1.5px #c0c2a9 (Sage Mist) border, #202020 text in Monument Grotesk weight 500, 16px, padding 13px 18px, 9px border-radius. Used for secondary actions on cream.

4. Full-Bleed Forest Feature Section — Forest Depths (#003d21) background spanning edge-to-edge with a ~45px top-corner radius so it meets cream as a soft mound. Inside: a cluster of overlapping Mint Sprout (#aafdc0) circular blob shapes at 60–80% opacity on the right half. Feature card on the left: Mint Sprout headline in Monument Grotesk weight 800, 45–54px, line-height 1.02. To the right of the card, a small Mint Sprout rounded card (22px radius, 27px padding) with a black smiley icon, 14px description in #202020, and a Charcoal filled CTA inside.

5. Pastel Feature Card — One solid pastel wash (use #aafdc0, #d3beff, #b0f4ff, or #ffc0e6) as the entire card background, 22–27px border-radius, 27px padding, no border, no shadow. Headline in Monument Grotesk weight 800 at 34–45px in the matching dark accent (#003d21, #2d0078, #041668, or #3f0929).

## Similar Brands

- **Stripe** — Same monumental gradient display typography and single-action-color discipline; Coda's cream parchment and bordered system echo Stripe's editorial restraint but with a warmer, more boutique canvas
- **Linear** — Shared tight line-heights on display type and a calm neutral canvas, though Coda replaces Linear's dark mode with a warm cream and uses outline-based elevation instead of dark cards
- **Gumroad** — Same creator/marketplace DNA, but Coda swaps Gumroad's saturated pink for a forest-green section, and uses Monument Grotesk weight 800 at monumental sizes where Gumroad leans on rounded display fonts
- **Cash App** — Both pair a single deep brand color (forest green vs Cash App green) with monumental display type, though Coda's monochrome cream system is far more restrained and editorial
- **Vercel** — Same hairline-bordered component language and confidence in negative space, but Coda builds on a warm cream instead of Vercel's near-black, and lets display type dominate instead of code

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-cream-parchment: #f8f9eb;
  --color-pure-white: #ffffff;
  --color-obsidian: #000000;
  --color-charcoal: #202020;
  --color-sage-mist: #c0c2a9;
  --color-olive-slate: #5a5a4f;
  --color-pebble: #7c7d76;
  --color-bone: #edeee1;
  --color-forest-depths: #003d21;
  --color-mint-sprout: #aafdc0;
  --color-cobalt-ink: #041668;
  --color-plum-depth: #2d0078;
  --color-wine-shadow: #3f0929;
  --color-lilac-wash: #d3beff;
  --color-sky-wash: #b0f4ff;
  --color-rose-wash: #ffc0e6;

  /* Typography — Font Families */
  --font-ui-sans-serif: 'ui-sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-monument-grotesk-custom: 'Monument Grotesk (custom)', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-jetbrains-mono: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-system-ui-sans: 'System UI Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.37;
  --tracking-caption: -0.01px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.43;
  --tracking-body-sm: -0.01px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.01px;
  --text-subheading: 21px;
  --leading-subheading: 1.3;
  --tracking-subheading: -0.01px;
  --text-heading-sm: 25px;
  --leading-heading-sm: 1.3;
  --tracking-heading-sm: -0.01px;
  --text-heading: 34px;
  --leading-heading: 1.13;
  --tracking-heading: -0.01px;
  --text-heading-lg: 45px;
  --leading-heading-lg: 1.02;
  --tracking-heading-lg: -0.01px;
  --text-display: 72px;
  --leading-display: 0.9;
  --tracking-display: -0.01px;
  --text-display-xl: 134px;
  --leading-display-xl: 0.9;
  --tracking-display-xl: -0.01px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-extrabold: 800;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-6: 6px;
  --spacing-9: 9px;
  --spacing-13: 13px;
  --spacing-14: 14px;
  --spacing-17: 17px;
  --spacing-18: 18px;
  --spacing-27: 27px;
  --spacing-36: 36px;
  --spacing-45: 45px;
  --spacing-63: 63px;
  --spacing-72: 72px;
  --spacing-89: 89px;
  --spacing-107: 107px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 72px;
  --card-padding: 27px;
  --element-gap: 13px;

  /* Border Radius */
  --radius-lg: 8.94498px;
  --radius-xl: 13.4175px;
  --radius-2xl: 17.89px;
  --radius-2xl-2: 22.3625px;
  --radius-3xl: 26.835px;
  --radius-3xl-2: 44.725px;
  --radius-full: 9999px;

  /* Named Radii */
  --radius-cards: 22px;
  --radius-badges: 9999px;
  --radius-buttons: 13px;
  --radius-herocards: 45px;
  --radius-largecards: 27px;
  --radius-smallbuttons: 9px;

  /* Surfaces */
  --surface-cream-parchment: #f8f9eb;
  --surface-pure-white: #ffffff;
  --surface-pastel-mint: #aafdc0;
  --surface-pastel-lilac: #d3beff;
  --surface-pastel-sky: #b0f4ff;
  --surface-pastel-rose: #ffc0e6;
  --surface-charcoal: #202020;
  --surface-forest-depths: #003d21;
  --surface-obsidian: #000000;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-cream-parchment: #f8f9eb;
  --color-pure-white: #ffffff;
  --color-obsidian: #000000;
  --color-charcoal: #202020;
  --color-sage-mist: #c0c2a9;
  --color-olive-slate: #5a5a4f;
  --color-pebble: #7c7d76;
  --color-bone: #edeee1;
  --color-forest-depths: #003d21;
  --color-mint-sprout: #aafdc0;
  --color-cobalt-ink: #041668;
  --color-plum-depth: #2d0078;
  --color-wine-shadow: #3f0929;
  --color-lilac-wash: #d3beff;
  --color-sky-wash: #b0f4ff;
  --color-rose-wash: #ffc0e6;

  /* Typography */
  --font-ui-sans-serif: 'ui-sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-monument-grotesk-custom: 'Monument Grotesk (custom)', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-jetbrains-mono: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-system-ui-sans: 'System UI Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.37;
  --tracking-caption: -0.01px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.43;
  --tracking-body-sm: -0.01px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.01px;
  --text-subheading: 21px;
  --leading-subheading: 1.3;
  --tracking-subheading: -0.01px;
  --text-heading-sm: 25px;
  --leading-heading-sm: 1.3;
  --tracking-heading-sm: -0.01px;
  --text-heading: 34px;
  --leading-heading: 1.13;
  --tracking-heading: -0.01px;
  --text-heading-lg: 45px;
  --leading-heading-lg: 1.02;
  --tracking-heading-lg: -0.01px;
  --text-display: 72px;
  --leading-display: 0.9;
  --tracking-display: -0.01px;
  --text-display-xl: 134px;
  --leading-display-xl: 0.9;
  --tracking-display-xl: -0.01px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-6: 6px;
  --spacing-9: 9px;
  --spacing-13: 13px;
  --spacing-14: 14px;
  --spacing-17: 17px;
  --spacing-18: 18px;
  --spacing-27: 27px;
  --spacing-36: 36px;
  --spacing-45: 45px;
  --spacing-63: 63px;
  --spacing-72: 72px;
  --spacing-89: 89px;
  --spacing-107: 107px;

  /* Border Radius */
  --radius-lg: 8.94498px;
  --radius-xl: 13.4175px;
  --radius-2xl: 17.89px;
  --radius-2xl-2: 22.3625px;
  --radius-3xl: 26.835px;
  --radius-3xl-2: 44.725px;
  --radius-full: 9999px;
}
```
