# INO — Style Reference
> Museum vitrine in silence — every piece floats in white space like a single object behind glass, framed by near-black whisper type.

**Theme:** light

INO operates as a near-monochrome jewelry gallery: bone-white canvas, one warm near-black ink, and almost no chromatic expression at all. The visual system treats every ring like a museum object — clinical product photography floating in generous negative space, with hierarchy built through position, letter-spacing, and white volume rather than through type scale or color. Navigation lives at the foot of the page as four labeled dots (filled or hollow), a deliberate inversion of the ecommerce top-bar convention. The brand mark itself is a set of concentric ring outlines, echoing the product form and acting as a typographic sculpture rather than a logotype.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Obsidian Ink | `#212123` | `--color-obsidian-ink` | Neutral form states, badge text, and quiet UI feedback where color should stay understated. |
| Bone | `#ffffff` | `--color-bone` | Page canvas, card surfaces, inverse text on dark fills. The dominant surface; almost the entire site lives here |
| Carbon | `#000000` | `--color-carbon` | Icon fills, decorative graphic strokes, active state fills for the navigation dot indicator. Used sparingly for maximum tonal contrast against Bone |
| Ash | `#999999` | `--color-ash` | Medium-contrast borders, control outlines, and structural separators. |
| Pebble | `#a6a6a7` | `--color-pebble` | Muted helper text, fine body dividers, secondary metadata. The lightest functional gray — used for price labels and supporting copy that must recede |

## Tokens — Typography

### Sequel100Wide — Sole brand typeface, used at weight 400 only across every context — nav, body, headings, hero copy, prices, labels. The wide-set geometric character with generous letter-spacing carries the entire brand voice. The absence of bold weight is deliberate: hierarchy comes from uppercase casing, tracking, and position, not from weight variation. · `--font-sequel100wide`
- **Substitute:** Jost (400, set with +0.08em letter-spacing) or Space Grotesk for the wide geometric character
- **Weights:** 400
- **Sizes:** 11px, 14px, 16px, 18px
- **Line height:** 1.0–1.6
- **Letter spacing:** All-uppercase context, tracking sits at approximately +0.12em to +0.18em depending on size — tighter at 18px, wider at 11px
- **Role:** Sole brand typeface, used at weight 400 only across every context — nav, body, headings, hero copy, prices, labels. The wide-set geometric character with generous letter-spacing carries the entire brand voice. The absence of bold weight is deliberate: hierarchy comes from uppercase casing, tracking, and position, not from weight variation.

### Arial — System fallback for button rendering in legacy contexts. Not part of the brand voice — appears only when Sequel100Wide fails to load. · `--font-arial`
- **Substitute:** system-ui
- **Weights:** 400
- **Sizes:** 11px
- **Line height:** 1.0
- **Role:** System fallback for button rendering in legacy contexts. Not part of the brand voice — appears only when Sequel100Wide fails to load.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 11px | 1 | 1.5px | `--text-caption` |
| body-sm | 14px | 1.2 | 0.4px | `--text-body-sm` |
| body | 16px | 1.3 | 0.2px | `--text-body` |
| heading | 18px | 1.5 | — | `--text-heading` |

## Tokens — Spacing & Shapes

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 9 | 9px | `--spacing-9` |
| 11 | 11px | `--spacing-11` |
| 14 | 14px | `--spacing-14` |
| 18 | 18px | `--spacing-18` |
| 23 | 23px | `--spacing-23` |
| 34 | 34px | `--spacing-34` |
| 36 | 36px | `--spacing-36` |
| 38 | 38px | `--spacing-38` |
| 43 | 43px | `--spacing-43` |
| 63 | 63px | `--spacing-63` |
| 72 | 72px | `--spacing-72` |
| 144 | 144px | `--spacing-144` |
| 146 | 146px | `--spacing-146` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 8px |
| inputs | 8px |
| buttons | 50px |
| navIndicators | 9999px |

### Layout

- **Section gap:** 80-120px
- **Card padding:** 0px
- **Element gap:** 23px

## Components

### Hero Split Section
**Role:** Full-viewport landing composition combining a single narrative product photograph with brand tagline and collection entry point

Full-bleed layout, no container width constraint. Left 50% holds a single oversized product photograph (no crop guides, no overlay). Right 50% vertically centers three elements with 23px gaps: a micro-headline in 11px uppercase Ash, the concentric ring brand mark at roughly 280px diameter drawn in 2px white strokes, and a 11px uppercase Pebble call-to-action with a right arrow. No card, no border, no shadow — the photograph and the graphic are the only visual weight.

### Concentric Ring Brand Mark
**Role:** Primary brand identifier, replaces a wordmark or monogram

Six concentric oval outlines (slightly taller than wide) rendered as 2px solid strokes in white (on dark hero) or Obsidian Ink (on light sections). No fill, no text. The shape directly mirrors the ring products — the logo IS the product abstracted.

### Product Card
**Role:** Grid item for individual ring products in the collection

Zero padding card with no visible border or shadow. The product photograph fills the card edge-to-edge. Below the image: product name in 11px uppercase Obsidian Ink and price in 11px Pebble, separated by 9px gap. Name and price sit on the same baseline row with the price right-aligned. The product image itself provides the card's visual boundary.

### Bottom Navigation Bar
**Role:** Primary site navigation anchored to the page foot, not the top

Horizontally centered row of four links — SHOP, ABOUT, SUPPORT, JOURNAL — set in 11px uppercase Sequel100Wide with 1.5px letter-spacing. Each link is preceded by a 8px circular indicator: filled Carbon for the active page, 1px Ash outline for inactive pages. Links separated by 23px gaps. The bar sits at the very bottom of the viewport with 34px horizontal page padding.

### Pill Filter Button
**Role:** Sort and filter trigger for the product grid

50px border-radius capsule containing the word FILTER and a downward chevron in 11px uppercase Obsidian Ink. 14px vertical padding, 23px horizontal padding. 1px Obsidian Ink border. No fill — the pill is a ghost control that sits as a floating element in the grid's top-right.

### Product Price Tag
**Role:** Inline price display for product cards

11px uppercase Sequel100Wide, line-height 1.0, color Pebble (#a6a6a7). Always paired with the product name on the same row, separated by whitespace. No currency symbol in the display data — prices appear as ranges (e.g. €295,95 - €1.738,95) set in the same weight and color.

### Section Micro-Heading
**Role:** Uppercase intro line for hero copy, taglines, and section openers

11px Sequel100Wide weight 400, uppercase, letter-spacing 1.5px, line-height 1.0. Color ranges from Ash (#999999) for secondary context to Obsidian Ink for primary. Sets tone without competing with the visual content — deliberately quiet.

### Lifestyle Editorial Image
**Role:** Full-bleed desaturated photograph for storytelling breaks between product grids

Large-format editorial photograph (B&W or near-monochrome treatment) used as a full-bleed section break. Sits at 70-80% viewport height with no caption, no overlay, no border. Functions as a visual palate cleanser between product collections.

### Footer Link
**Role:** Inline text link in footer or supporting copy

11px uppercase Sequel100Wide, Obsidian Ink, no underline by default. On hover, gains a 1px Obsidian Ink underline. No color change, no fill — the link is distinguished by underline only.

### Circular Nav Indicator
**Role:** Visual state marker for the current page in the bottom navigation

8px diameter circle. Active state: solid Carbon (#000000) fill. Inactive state: 1px Ash (#999999) stroke, transparent fill. Positioned to the left of each nav label with 9px gap. The circle is the only color/shape distinction between active and inactive navigation.

## Do's and Don'ts

### Do
- Use Sequel100Wide at weight 400 only — never bold, never italic. The single weight is the voice.
- Set all UI text in uppercase with 1.5px letter-spacing at 11px, reducing slightly at larger sizes. Case and tracking do the work that weight and size do elsewhere.
- Maintain a strictly achromatic palette. The only colors permitted are #212123, #ffffff, #000000, #999999, and #a6a6a7. Do not introduce hue.
- Anchor primary navigation to the page foot, centered, with filled/outlined 8px circle indicators for state. Never use a top header bar for site navigation.
- Give product photography full-bleed space with zero card padding, no borders, and no drop shadows. Let the image define the card boundary.
- Separate sections with 80-120px of vertical whitespace or a full-bleed editorial photograph. Never use colored bands, gradient dividers, or hairline rules between sections.
- Use 50px border-radius for all pill-shaped controls (filter, tags) and 9999px for the navigation circle indicators. Cards use 8px radius or zero radius.

### Don't
- Do not introduce a brand color, accent hue, or any chromatic expression. The 1% colorfulness target is the identity.
- Do not use bold or semibold weights. The entire type system exists at weight 400.
- Do not add drop shadows, inner shadows, or any elevation effects to cards, buttons, or navigation elements. Flatness is the surface language.
- Do not use font sizes outside the 11px–18px range for interface text. Large display sizes would break the scale.
- Do not place navigation at the top of the page or use a sticky header. The bottom nav is the site map.
- Do not use underlines, color changes, or weight shifts for link hover states. A 1px Obsidian Ink underline appearing on hover is the only link state change.
- Do not use emoji, colored icons, or multicolor iconography. The concentric ring mark is the only graphical element — icons are absent by design.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#ffffff` | Full-bleed page background; the void that frames all content. |
| 1 | Product Plinth | `#ffffff` | Product card surfaces — same as canvas, relying on the product image and whitespace to define the card boundary rather than a border or shadow. |
| 2 | Active Node | `#000000` | Filled circle indicator for the active navigation item, selected-state icon fills. |

## Elevation

- **Product Card:** `none — cards have no shadow`
- **Hero Section:** `none — full-bleed photography sits flush on the canvas without elevation`

## Imagery

Two distinct image modes coexist: clinical product photography on a flat light-gray seamless (each ring shot front-and-center, no hands, no styling props, no shadows on the surface — the object is the hero) and narrative editorial imagery (the ring nestled in a grass-lined box, a hand holding a chain) treated as desaturated, full-bleed editorial breaks. Product images carry the product cards; editorial images carry the brand mood. Both are monochromatic or near-monochromatic — the grass in the hero is the only place green appears, and even it is muted to a forest tone. Icons are not used in the interface — the concentric ring mark replaces all iconography.

## Layout

Full-bleed canvas with no maximum content width. The hero spans edge-to-edge with a 50/50 split between photograph and graphic. Product grids appear as 3-column rows with generous 34px horizontal padding from the viewport edge. The bottom navigation is centered and anchored to the page foot, not sticky. Section breaks use either a full-bleed editorial photograph or pure whitespace — never a colored band, divider line, or gradient. The vertical rhythm is loose: 80-120px between major sections, with the page breathing rather than packing content. There is no sidebar, no mega-menu, no top header bar — the wordmark 'INO' sits at the top-left of the hero only.

## Agent Prompt Guide

## Quick Color Reference

- text: #212123 (Obsidian Ink)
- background: #ffffff (Bone)
- border: #212123 (Obsidian Ink) for active, #999999 (Ash) for inactive
- accent: none — the system is strictly achromatic
- primary action: no distinct CTA color

## Example Component Prompts

1. **Build a product grid card**: Zero padding, no border, no shadow. Full-bleed product image fills the card. Below the image, a single row with product name in 11px uppercase Sequel100Wide #212123 on the left, price in 11px #a6a6a7 on the right. 9px gap between the image and the text row. Cards sit in a 3-column grid with 34px horizontal page padding.

2. **Build the bottom navigation bar**: Horizontally centered at the page foot. Four links — SHOP, ABOUT, SUPPORT, JOURNAL — in 11px uppercase Sequel100Wide #212123 with 1.5px letter-spacing. Each link preceded by an 8px circle: solid #000000 for active, 1px #999999 outline for inactive. 23px gap between links. 34px padding from viewport edges.

No distinct primary action color was observed; use the extracted neutral button treatments instead of inventing a filled CTA color.

4. **Build the pill filter button**: 50px border-radius. 14px vertical padding, 23px horizontal padding. 1px #212123 border, no fill. Content: 'FILTER' in 11px uppercase Sequel100Wide #212123, followed by a 4px downward chevron stroke. Floats in the top-right of a product grid section.

5. **Build a section micro-heading**: 11px Sequel100Wide weight 400, uppercase, letter-spacing 1.5px, line-height 1.0, color #999999. Centered or left-aligned depending on section. 38px top margin from previous content.

## Navigation Inversion

The bottom navigation is a signature choice — most ecommerce sites anchor navigation to the top header. INO places 'INO' as a quiet top-left mark in the hero, then moves the full site map to a centered row at the page foot. This is not a sticky footer; it sits at the end of the scroll. The circle indicators (filled for active, outlined for inactive) make the current page state readable at a glance without any color or weight change to the label text. When building new pages, always include the bottom nav with the correct circle state — a filled Carbon circle for the current page, Ash outline for all others.

## Hierarchy Without Scale

The type scale only ranges from 11px to 18px. There is no display size, no h1-vs-h2 jump. Visual hierarchy is built entirely through: (1) uppercase casing, (2) letter-spacing variation, (3) tonal weight between Obsidian Ink and Ash/Pebble, and (4) spatial position and whitespace. A heading is an 18px uppercase Obsidian Ink line in generous space; a label is an 11px uppercase Ash line. When building new screens, do not introduce larger type sizes — the constraint is the signature.

## Similar Brands

- **The Row (therow.com)** — Same monochrome discipline, uppercase wide-set sans typography, gallery-style product photography on seamless white, and near-absolute absence of color or decoration.
- **Me+Em** — Similar bottom-anchored or footer-positioned navigation, restrained type scale, and achromatic product grids with generous whitespace between cards.
- **Sophie Buhai** — Fine jewelry site with extreme minimalism, hairline type, near-black on white palette, and editorial B&W lifestyle imagery breaking up product sections.
- **Toteme** — Ecommerce with strict monochrome palette, wide-tracked uppercase type, zero card borders or shadows, and products floating on white canvas.
- **Maison Margiela 's main ecommerce** — Numeric-only product naming, extreme typographic restraint, and the use of a single repeated graphic mark (Margiela's numbers) functioning like INO's concentric ring as the brand signature.

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-obsidian-ink: #212123;
  --color-bone: #ffffff;
  --color-carbon: #000000;
  --color-ash: #999999;
  --color-pebble: #a6a6a7;

  /* Typography — Font Families */
  --font-sequel100wide: 'Sequel100Wide', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1;
  --tracking-caption: 1.5px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.2;
  --tracking-body-sm: 0.4px;
  --text-body: 16px;
  --leading-body: 1.3;
  --tracking-body: 0.2px;
  --text-heading: 18px;
  --leading-heading: 1.5;

  /* Typography — Weights */
  --font-weight-regular: 400;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-9: 9px;
  --spacing-11: 11px;
  --spacing-14: 14px;
  --spacing-18: 18px;
  --spacing-23: 23px;
  --spacing-34: 34px;
  --spacing-36: 36px;
  --spacing-38: 38px;
  --spacing-43: 43px;
  --spacing-63: 63px;
  --spacing-72: 72px;
  --spacing-144: 144px;
  --spacing-146: 146px;

  /* Layout */
  --section-gap: 80-120px;
  --card-padding: 0px;
  --element-gap: 23px;

  /* Border Radius */
  --radius-lg: 7.8768px;
  --radius-lg-2: 10px;
  --radius-full: 50.4px;

  /* Named Radii */
  --radius-cards: 8px;
  --radius-inputs: 8px;
  --radius-buttons: 50px;
  --radius-navindicators: 9999px;

  /* Surfaces */
  --surface-canvas: #ffffff;
  --surface-product-plinth: #ffffff;
  --surface-active-node: #000000;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-obsidian-ink: #212123;
  --color-bone: #ffffff;
  --color-carbon: #000000;
  --color-ash: #999999;
  --color-pebble: #a6a6a7;

  /* Typography */
  --font-sequel100wide: 'Sequel100Wide', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1;
  --tracking-caption: 1.5px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.2;
  --tracking-body-sm: 0.4px;
  --text-body: 16px;
  --leading-body: 1.3;
  --tracking-body: 0.2px;
  --text-heading: 18px;
  --leading-heading: 1.5;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-9: 9px;
  --spacing-11: 11px;
  --spacing-14: 14px;
  --spacing-18: 18px;
  --spacing-23: 23px;
  --spacing-34: 34px;
  --spacing-36: 36px;
  --spacing-38: 38px;
  --spacing-43: 43px;
  --spacing-63: 63px;
  --spacing-72: 72px;
  --spacing-144: 144px;
  --spacing-146: 146px;

  /* Border Radius */
  --radius-lg: 7.8768px;
  --radius-lg-2: 10px;
  --radius-full: 50.4px;
}
```
