# Leif Products — Style Reference
> Apothecary on raw linen. A warm, hand-pressed editorial where ink-black type sits on bone-cream paper beside botanical product photography.

**Theme:** light

Leif is an editorial apothecary: warm cream canvas, botanical product photography, and whisper-thin display type that treats body care like a fashion magazine spread. The palette is almost entirely warm neutrals — stone, bone, ink, a dusty rose blush, and a pale chartreuse for accent — so the only color in the interface comes from the products and botanicals themselves. Layout breathes through generous product photography, split editorial compositions, and minimal chrome. Type does the heavy lifting: PP Right Grotesk at weight 200 for headlines creates a calligraphic lightness uncommon in commerce, while Söhne Mono small caps label scent families like museum tags. Components stay quiet — hairline borders, near-zero radii, no shadows — letting the imagery and typography carry the brand.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Bone | `#fafaf9` | `--color-bone` | Page canvas, primary card surface — the off-white paper tone the entire interface sits on, warm enough to feel linen, not bright enough to feel clinical |
| Ink | `#000000` | `--color-ink` | All body type, primary action border, all interactive strokes — the only dark in the system, pure black rather than warm charcoal to create maximum contrast against the cream canvas |
| Stone | `#e5e2dc` | `--color-stone` | Card borders, hairline dividers, subtle section breaks — the warm gray-beige that separates elements without drawing attention |
| Linen | `#edede7` | `--color-linen` | Hairline borders, dividers, input outlines, and card edges on light surfaces. Do not promote it to the primary CTA color |
| Graphite | `#595959` | `--color-graphite` | Card secondary text, muted metadata, price-adjacent labels — the mid-gray that recedes behind the primary ink-black headlines |
| Silt | `#d6d1c7` | `--color-silt` | Neutral form states, badge text, and quiet UI feedback where color should stay understated. Do not promote it to the primary CTA color |
| Blush | `#ead1d0` | `--color-blush` | Decorative accent surface, soft wash behind editorial text blocks, occasional section tints — the dusty rose that nods to botanical petals without becoming saccharine |
| Citron | `#f3ffa9` | `--color-citron` | Promotional highlight surface — used sparingly as a wash behind sale tags, value bundle badges, or limited-edition callouts; pale enough to never compete with product photography |

## Tokens — Typography

### PP Right Grotesk — Display headlines and section titles — weight 200 is anti-convention for commerce; the ultra-thin strokes create a calligraphic, editorial whisper that treats product names as poetry rather than slogans. Tight tracking (-0.015em) pulls the delicate strokes into a cohesive block. · `--font-pp-right-grotesk`
- **Substitute:** Inter Tight at weight 200, or Manrope 200
- **Weights:** 200
- **Sizes:** 34px, 52px, 75px
- **Line height:** 1.00
- **Letter spacing:** -0.015em to -0.01em
- **Role:** Display headlines and section titles — weight 200 is anti-convention for commerce; the ultra-thin strokes create a calligraphic, editorial whisper that treats product names as poetry rather than slogans. Tight tracking (-0.015em) pulls the delicate strokes into a cohesive block.

### Söhne — Primary body, UI, navigation, product names, buttons — the workhorse neutral grotesque. Weight 400 for body copy keeps a quiet editorial feel; weight 500 for navigation and product names adds enough presence to guide the eye. Slight positive tracking on uppercase labels opens them up to read as proper editorial tags. · `--font-shne`
- **Substitute:** Inter, Söhne Trial, or General Sans
- **Weights:** 400, 500
- **Sizes:** 10px, 12px, 13px, 15px, 16px, 18px, 20px, 22px, 26px
- **Line height:** 1.15 to 1.38
- **Letter spacing:** 0.02em (uppercase labels), -0.01em (body)
- **Role:** Primary body, UI, navigation, product names, buttons — the workhorse neutral grotesque. Weight 400 for body copy keeps a quiet editorial feel; weight 500 for navigation and product names adds enough presence to guide the eye. Slight positive tracking on uppercase labels opens them up to read as proper editorial tags.

### Söhne Mono — Micro-labels and scent-family tags — used for 'SMOKY & MEDITATIVE', 'BUTTERY & SOFT', 'VALUE BUNDLE' type annotations. The monospace width and widened tracking (0.05em) give these labels a scientific, museum-catalog quality that contrasts with the organic display type. · `--font-shne-mono`
- **Substitute:** JetBrains Mono, IBM Plex Mono, or Geist Mono
- **Weights:** 400
- **Sizes:** 11px, 12px, 13px
- **Line height:** 1.17 to 1.23
- **Letter spacing:** 0.05em
- **Role:** Micro-labels and scent-family tags — used for 'SMOKY & MEDITATIVE', 'BUTTERY & SOFT', 'VALUE BUNDLE' type annotations. The monospace width and widened tracking (0.05em) give these labels a scientific, museum-catalog quality that contrasts with the organic display type.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 10px | 1.35 | 0.2px | `--text-caption` |
| body | 15px | 1.38 | — | `--text-body` |
| body-lg | 18px | 1.33 | — | `--text-body-lg` |
| subheading | 22px | 1.27 | — | `--text-subheading` |
| heading-sm | 26px | 1.22 | -0.26px | `--text-heading-sm` |
| display | 52px | 1 | -0.78px | `--text-display` |
| display-lg | 75px | 1 | -0.75px | `--text-display-lg` |

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
| 40 | 40px | `--spacing-40` |
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |
| 120 | 120px | `--spacing-120` |
| 160 | 160px | `--spacing-160` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 0px |
| cards | 0px |
| inputs | 0px |
| buttons | 0px |

### Layout

- **Page max-width:** 1440px
- **Section gap:** 64px
- **Card padding:** 12px
- **Element gap:** 8-12px

## Components

### Outlined Action Button
**Role:** Primary interactive trigger (e.g. 'EXPLORE COLLECTION')

Ink-black (#000000) 1px border, Bone (#fafaf9) fill, Ink text in Söhne 12px weight 500 uppercase with 0.02em tracking. Zero radius — sharp rectangular edges reinforce the editorial print feel. Padding 12px 24px. No shadow, no fill state — the action is communicated entirely through the outline weight.

### Ghost Link Button
**Role:** Secondary text-based actions and navigation links

Ink text in Söhne 13px weight 500, underlined with Ink 1px border-bottom. No background, no padding beyond text height. Used for 'Shop', 'About', 'Journal' in nav and 'SHOP KAKADU PLUM' style inline actions.

### Product Card
**Role:** Grid cell for product listings in collections

Square product image with no radius on the Bone (#fafaf9) background. Product name in Söhne 16px weight 400 left-aligned below image. Price in Söhne 16px weight 400 right-aligned. No card border, no shadow. Scentscape label in Söhne Mono 11px uppercase at bottom of card with 0.05em tracking.

### Value Bundle Badge
**Role:** Promotional label overlaid on product cards

Citron (#f3ffa9) background fill, Ink (#000000) text in Söhne Mono 11px uppercase. Zero radius, sits at top-left of product image. The only color on a product card, drawing the eye without competing with the product photo.

### Hero Editorial Split
**Role:** Full-viewport homepage hero

Two-column 50/50 split. Left: full-bleed product photography (hands holding a cream box with 'Wild Rosella' printed in PP Right Grotesk 200). Right: Bone (#fafaf9) panel with 'Scents of affection' headline at PP Right Grotesk 52px weight 200, tracking -0.78px, followed by body copy in Söhne 16px weight 400. Black outlined 'EXPLORE COLLECTION' button below.

### Scent Family Filter
**Role:** Left-sidebar category navigation on collection pages

Vertical list of scent categories. Each row: small square thumbnail image left, category name in Söhne Mono 11px uppercase centered, radio dot right. Active row has a filled black dot; inactive rows have empty circles. Border-bottom 1px Stone (#e5e2dc) separates rows. Zero padding beyond the image height — extremely compact.

### Category Feature Card
**Role:** Right-side featured display on the 'Meet the family' page

Large square product/botanical photograph (50% width) on left, text panel on right. Headline 'Kakadu Plum' in PP Right Grotesk 34px weight 200. Subtitle 'BUTTERY & SOFT' in Söhne Mono 11px uppercase. Description in Söhne 15px weight 400. Inline 'SHOP KAKADU PLUM' ghost link at bottom.

### Announcement Bar
**Role:** Top-of-page promotional strip

Blush (#ead1d0) background bar spanning full viewport width. Centered text in Söhne Mono 12px uppercase with 0.05em tracking: 'FREE STD SHIPPING AU WIDE ON ORDERS $50+'. Close icon (×) at right. Height approximately 40px. The only persistent colored surface on the site.

### Primary Navigation
**Role:** Top bar with logo and menu items

Bone (#fafaf9) background, no border-bottom. 'leif' wordmark at left in PP Right Grotesk 200 at ~26px. Center menu items ('Shop', 'About', 'Journal', 'Loyalty') in Söhne 13px weight 500. Right cluster: currency selector 'EUR ▾', search icon, account icon, cart icon — all Ink stroke icons, no fills.

### Product Card Hover State
**Role:** Interactive feedback for product grid items

On hover, the product name gains an Ink underline border. The image itself does not zoom or shift — the restraint is the point. No color change, no shadow lift, no overlay.

### Footer
**Role:** Bottom-of-page navigation and legal content

Ink (#000000) background, Bone (#fafaf9) text. Column-based layout with category links in Söhne 13px weight 400. Section headings in Söhne Mono 11px uppercase. Logo in Bone at the bottom. Generous vertical padding (64px+).

## Do's and Don'ts

### Do
- Use PP Right Grotesk weight 200 for all display headlines at 34px and above — the ultra-thin stroke is the signature, never substitute with weight 400 or 500
- Apply Söhne Mono 11-12px with 0.05em tracking for all small uppercase labels (scent families, badges, metadata) — this creates the museum-tag rhythm
- Keep all corners at 0px radius — every component should have sharp rectangular edges to maintain the editorial print feel
- Use #fafaf9 (Bone) as the exclusive page background — never pure white, never gray
- Let product photography carry the color — the interface palette stays warm-neutral so botanicals and amber bottles become the only chromatic elements
- Use 1px borders in #e5e2dc (Stone) or #000000 (Ink) for all separation — no shadows, no fills, no background tints to create depth
- Set display headlines to line-height 1.0 with tight negative tracking (-0.015em) so the thin strokes lock into a cohesive editorial block

### Don't
- Don't use any chromatic brand color for buttons, links, or CTAs — the system is intentionally achromatic; color appears only in the Blush announcement bar and Citron promotional wash
- Don't add border-radius to buttons, cards, images, or tags — sharp corners are non-negotiable
- Don't use box-shadows or drop-shadows for elevation — depth comes from whitespace and hairline borders only
- Don't use PP Right Grotesk below 26px — the ultra-thin weight becomes illegible at small sizes; switch to Söhne for anything under that threshold
- Don't use pure white (#ffffff) as a background — the slightly warm Bone (#fafaf9) is the canvas, pure white would feel sterile and break the linen paper metaphor
- Don't center-align body copy or long-form descriptions — left-align all paragraphs; centering is reserved for the announcement bar and hero subheadings only
- Don't use bright or saturated colors for icons, hover states, or active states — Ink (#000000) and Graphite (#595959) are the only two interaction colors

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Bone | `#fafaf9` | Page canvas — the linen-paper foundation every element sits on |
| 2 | Citron Wash | `#f3ffa9` | Promotional surface — used behind value badges and sale highlights |
| 3 | Blush Wash | `#ead1d0` | Editorial accent surface — soft pink wash behind descriptive text blocks |
| 4 | Ink | `#000000` | Inverted surface — primary action buttons, dark product cards, full-bleed footer zones |

## Elevation

Leif uses zero shadows. Depth comes from border hairlines, whitespace, and the contrast between full-bleed product photography and the flat cream canvas. A shadow would feel heavy and digital — antithetical to the hand-pressed, paper-stock aesthetic. All 'elevation' is achieved through background color shifts (Bone → Citron → Blush → Ink) and border weight changes.

## Imagery

Product photography is the dominant visual element. Style: editorial, high-key, studio-lit with soft natural shadows. Products are shot on neutral stone or skin-tone backgrounds, often with hands, botanicals, or raw ingredients (rose petals, fruit, clay) as supporting context. No lifestyle environments — no bathrooms, no kitchens, no human models in settings. The object is always the hero. Close-up crops show texture and material quality (amber glass, matte ceramic, paper labels). Image treatment: no filters, no duotone, no overlays — pure photography. Aspect ratios are consistently square for product grid, full-bleed vertical for hero. No illustrations, no icons beyond minimal UI line icons, no 3D renders. The imagery language is 'still life catalog' — the way a botanical reference book or Aesop product page treats its subjects.

## Layout

Leif uses a full-bleed max-width 1440px layout with no centered narrow-column constraint. The homepage hero is a dramatic 50/50 split: left half is a full-bleed product photograph extending to the viewport edge, right half is a Bone panel with vertically centered text. Below the hero, product collections use a 3-column grid with generous gutters. Category pages ('Meet the family') use an asymmetric two-column layout: a compact left sidebar (approximately 25% width) listing scent families, paired with a large featured category display on the right. Section rhythm is consistent: full-width product grid bands separated by editorial text+image split sections. Navigation is a minimal top bar with no sticky behavior, no mega-menu, no sidebar. Vertical spacing between sections is generous (64px) but not extreme — comfortable editorial pacing, not luxurious whitespace.

## Agent Prompt Guide

**Quick Color Reference**
- text: #000000 (Ink)
- background: #fafaf9 (Bone)
- border: #e5e2dc (Stone) for subtle, #000000 (Ink) for interactive
- accent surface: #ead1d0 (Blush) for announcement bars, #f3ffa9 (Citron) for promotional badges
- primary action: no distinct CTA color

**Example Component Prompts**

1. **Hero Editorial Split**: Full-viewport 50/50 layout. Left half: full-bleed product photo. Right half: Bone (#fafaf9) background. Headline 'Scents of affection' in PP Right Grotesk 52px weight 200, color Ink (#000000), letter-spacing -0.78px, line-height 1.0. Subtext in Söhne 15px weight 400, line-height 1.38. Outlined button below: 1px Ink border, Bone fill, text 'EXPLORE COLLECTION' in Söhne 12px weight 500 uppercase with 0.02em tracking, padding 12px 24px, 0px radius.

2. **Product Grid Card**: Bone (#fafaf9) background, no border, 0px radius. Square product image fills the card. Below: product name in Söhne 16px weight 400 left-aligned, price in Söhne 16px weight 400 right-aligned. Bottom row: scent label in Söhne Mono 11px uppercase, 0.05em tracking, e.g. 'SMOKY & MEDITATIVE'. Optional Citron (#f3ffa9) badge top-left with text 'VALUE BUNDLE' in Söhne Mono 11px uppercase on Ink.

3. **Scent Family Filter Row**: Full-width row, 1px Stone (#e5e2dc) border-bottom. Small square thumbnail (~60px) on left, scent name in Söhne Mono 11px uppercase centered in the row, radio indicator on right (filled Ink dot if active, empty circle if not). Zero vertical padding beyond image height.

4. **Announcement Bar**: Full-bleed Blush (#ead1d0) background, 40px height. Centered text 'FREE STD SHIPPING AU WIDE ON ORDERS $50+' in Söhne Mono 12px uppercase, 0.05em tracking, Ink color. Close × icon at right in Ink.

5. **Category Feature Display**: Two-column asymmetric layout — left 50% is a large square botanical/product photograph, right 50% is Bone (#fafaf9) with text stacked vertically. Headline 'Kakadu Plum' in PP Right Grotesk 34px weight 200, Ink. Subtitle 'BUTTERY & SOFT' in Söhne Mono 11px uppercase below headline. Description paragraph in Söhne 15px weight 400. Ghost link 'SHOP KAKADU PLUM' in Söhne 13px weight 500, Ink, 1px Ink border-bottom, at bottom.

## Type Pairing Logic

PP Right Grotesk (display) and Söhne (body) are intentionally contrasting: the calligraphic ultra-thin display against the neutral grotesque body creates tension between editorial poetry and practical commerce. Söhne Mono (labels) sits between them, bridging the two with its scientific monospace voice. The rule: display type (34px+) always uses PP Right Grotesk 200; body and UI (≤26px) always uses Söhne 400/500; labels and metadata (≤13px) always uses Söhne Mono with uppercase + 0.05em tracking. Never mix the roles.

## Chromatic Restraint

The interface is 0% colorful — all warmth comes from the Bone/Stone/Linen neutrals and the two accent washes (Blush and Citron). This is a deliberate choice: Leif sells botanical body care where the products themselves (amber oils, green extracts, colored bars) are the only color in the user's experience. Adding brand color to the UI would compete with the products. The Citron (#f3ffa9) appears only on sale/value badges; the Blush (#ead1d0) appears only on the announcement bar. Both are desaturated enough to feel like part of the paper-stock palette, not chromatic interruptions.

## Similar Brands

- **Aesop** — Same achromatic warm-cream palette, same editorial split layouts, same restraint in using the product photography as the only color in the system
- **Aarke** — Same near-monochrome interface, same zero-radius sharp components, same ultra-thin display headlines paired with quiet neutral grotesk body type
- **Mara Beauty** — Same warm bone-and-ink palette, same museum-tag small-caps mono labels, same full-bleed botanical product photography treatment
- **Hims** — Same editorial split-hero composition with large display type on one side and full-bleed photography on the other
- **Oase** — Same scent/mood-based category navigation pattern with radio-dot selectors and compact sidebar list, same botanical still-life photography style

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-bone: #fafaf9;
  --color-ink: #000000;
  --color-stone: #e5e2dc;
  --color-linen: #edede7;
  --color-graphite: #595959;
  --color-silt: #d6d1c7;
  --color-blush: #ead1d0;
  --color-citron: #f3ffa9;

  /* Typography — Font Families */
  --font-pp-right-grotesk: 'PP Right Grotesk', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-shne: 'Söhne', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-shne-mono: 'Söhne Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.35;
  --tracking-caption: 0.2px;
  --text-body: 15px;
  --leading-body: 1.38;
  --text-body-lg: 18px;
  --leading-body-lg: 1.33;
  --text-subheading: 22px;
  --leading-subheading: 1.27;
  --text-heading-sm: 26px;
  --leading-heading-sm: 1.22;
  --tracking-heading-sm: -0.26px;
  --text-display: 52px;
  --leading-display: 1;
  --tracking-display: -0.78px;
  --text-display-lg: 75px;
  --leading-display-lg: 1;
  --tracking-display-lg: -0.75px;

  /* Typography — Weights */
  --font-weight-extralight: 200;
  --font-weight-regular: 400;
  --font-weight-medium: 500;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-40: 40px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-120: 120px;
  --spacing-160: 160px;

  /* Layout */
  --page-max-width: 1440px;
  --section-gap: 64px;
  --card-padding: 12px;
  --element-gap: 8-12px;

  /* Border Radius */
  --radius-sm: 3px;
  --radius-md: 6px;

  /* Named Radii */
  --radius-tags: 0px;
  --radius-cards: 0px;
  --radius-inputs: 0px;
  --radius-buttons: 0px;

  /* Surfaces */
  --surface-bone: #fafaf9;
  --surface-citron-wash: #f3ffa9;
  --surface-blush-wash: #ead1d0;
  --surface-ink: #000000;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-bone: #fafaf9;
  --color-ink: #000000;
  --color-stone: #e5e2dc;
  --color-linen: #edede7;
  --color-graphite: #595959;
  --color-silt: #d6d1c7;
  --color-blush: #ead1d0;
  --color-citron: #f3ffa9;

  /* Typography */
  --font-pp-right-grotesk: 'PP Right Grotesk', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-shne: 'Söhne', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-shne-mono: 'Söhne Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.35;
  --tracking-caption: 0.2px;
  --text-body: 15px;
  --leading-body: 1.38;
  --text-body-lg: 18px;
  --leading-body-lg: 1.33;
  --text-subheading: 22px;
  --leading-subheading: 1.27;
  --text-heading-sm: 26px;
  --leading-heading-sm: 1.22;
  --tracking-heading-sm: -0.26px;
  --text-display: 52px;
  --leading-display: 1;
  --tracking-display: -0.78px;
  --text-display-lg: 75px;
  --leading-display-lg: 1;
  --tracking-display-lg: -0.75px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-40: 40px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-120: 120px;
  --spacing-160: 160px;

  /* Border Radius */
  --radius-sm: 3px;
  --radius-md: 6px;
}
```
