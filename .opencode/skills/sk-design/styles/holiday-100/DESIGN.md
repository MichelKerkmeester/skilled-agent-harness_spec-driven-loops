# Holiday 100 — Style Reference
> midnight gift gallery — the serif headline acts as the spotlight, the dark canvas is the velvet wall, and each product image hangs like a curated frame.

**Theme:** dark

Google's Holiday 100 is a dark-mode seasonal shopping showcase that reads like a midnight editorial spread rather than a product catalog. The defining move is pairing a dramatic display serif (Crimson Pro, used at up to 220px with -0.04em tracking) against Google Sans for UI, creating a magazine-cover gravity on what could otherwise be a utilitarian product grid. Saturated color blocks — crimson, royal blue, forest green, butter yellow, mint — serve as backgrounds for category tiles, each framing a single product photograph like a gallery spotlight against the near-black canvas (#333438). Surfaces stay flat and dark; the warmth comes from photography and accent color, not from elevation or gradients.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Onyx Canvas | `#333438` | `--color-onyx-canvas` | Page background — the primary dark surface that absorbs all surrounding chrome and lets photography and accent color carry visual weight |
| Graphite Card | `#202124` | `--color-graphite-card` | Card and product tile surfaces — one step lifted from the canvas, used for product listings, trending panels, and secondary groupings |
| Charcoal Border | `#1f1f1f` | `--color-charcoal-border` | Hairline borders on inputs, icons, and button edges — barely visible, defines boundaries without breaking the dark atmosphere |
| Muted Iron | `#9e9e9e` | `--color-muted-iron` | Muted helper text, secondary icon strokes, and low-emphasis metadata |
| Fog | `#45474c` | `--color-fog` | Subtle link borders and tertiary structural lines |
| Snow | `#e8e8e8` | `--color-snow` | Hairline borders, dividers, input outlines, and card edges on light surfaces. Do not promote it to the primary CTA color |
| Ice Blue | `#99c3ff` | `--color-ice-blue` | Outlined accent borders and decorative strokes on links, images, and card frames — the cool chromatic signature that brands links and featured borders without filling them |
| Crimson Spotlight | `#980b0b` | `--color-crimson-spotlight` | Red outline accent for tags, dividers, and focused UI edges. |
| Royal Blue | `#113979` | `--color-royal-blue` | Category tile background for Electronics — a saturated mid-blue that gives gadgets a stage |
| Powder Wash | `#d2e3fc` | `--color-powder-wash` | Light blue category background for Accessories — a desaturated counterweight to the deeper Royal Blue |
| Forest | `#073618` | `--color-forest` | Category tile background for Toys & Games and Home & Garden — deep green anchors the more organic categories |
| Mint | `#a8dab5` | `--color-mint` | Light green category background for Health & Wellness — the fresh, airy counterpart to Forest |
| Butter | `#ffedb8` | `--color-butter` | Category tile background for Beauty — warm pale yellow that softens the cosmetic category |
| Sky Tint | `#e8f0fe` | `--color-sky-tint` | Lightest blue wash, used as a text/foreground pairing on dark accent backgrounds to guarantee AAA contrast |
| Violet Whisper | `#c58af9` | `--color-violet-whisper` | Rare accent — appears on a small number of links, probably AI-related or featured annotation links |

## Tokens — Typography

### Crimson Pro — Display serif for the editorial headline moments. The 220px weight 200 'Holiday 100' wordmark is the single most identifiable element — a high-contrast serif at extreme size that signals 'curated annual feature' rather than a standard product page. Also used at 80px for section headers with italic emphasis on category names ('Beauty Maven' in italic). · `--font-crimson-pro`
- **Substitute:** Playfair Display, DM Serif Display, Cormorant Garamond
- **Weights:** 200, 400
- **Sizes:** 48px, 80px, 220px
- **Line height:** 0.91, 1.00
- **Letter spacing:** -0.0400em, -0.0200em
- **Role:** Display serif for the editorial headline moments. The 220px weight 200 'Holiday 100' wordmark is the single most identifiable element — a high-contrast serif at extreme size that signals 'curated annual feature' rather than a standard product page. Also used at 80px for section headers with italic emphasis on category names ('Beauty Maven' in italic).

### Google Sans — Primary UI and body typeface. Used for subtitles, category labels, card titles, button text, and product metadata. The weight 200 light variant is a distinctive choice — it keeps body text from feeling heavy against the dark canvas and pairs naturally with the serif display weights. The consistent -0.02em tracking across all sizes tightens the type into a controlled grid. · `--font-google-sans`
- **Substitute:** Inter, Roboto, DM Sans
- **Weights:** 200, 400, 500
- **Sizes:** 14px, 16px, 24px, 30px
- **Line height:** 1.14, 1.20, 1.25, 1.43, 1.50, 1.71
- **Letter spacing:** -0.0200em
- **Role:** Primary UI and body typeface. Used for subtitles, category labels, card titles, button text, and product metadata. The weight 200 light variant is a distinctive choice — it keeps body text from feeling heavy against the dark canvas and pairs naturally with the serif display weights. The consistent -0.02em tracking across all sizes tightens the type into a controlled grid.

### Arial — System fallback for ancillary content; sparse usage means it serves as safety net for elements not styled in the custom fonts. · `--font-arial`
- **Substitute:** system-ui, sans-serif
- **Weights:** 400, 700
- **Sizes:** 14px
- **Line height:** 1.20, 1.43
- **Role:** System fallback for ancillary content; sparse usage means it serves as safety net for elements not styled in the custom fonts.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 14px | 1.43 | -0.28px | `--text-caption` |
| body | 16px | 1.5 | -0.32px | `--text-body` |
| subheading | 24px | 1.25 | -0.48px | `--text-subheading` |
| heading-sm | 30px | 1.2 | -0.6px | `--text-heading-sm` |
| heading | 48px | 1 | -1.92px | `--text-heading` |
| heading-lg | 80px | 0.91 | -3.2px | `--text-heading-lg` |
| display | 220px | 0.91 | -8.8px | `--text-display` |

## Tokens — Spacing & Shapes

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 6 | 6px | `--spacing-6` |
| 8 | 8px | `--spacing-8` |
| 11 | 11px | `--spacing-11` |
| 12 | 12px | `--spacing-12` |
| 14 | 14px | `--spacing-14` |
| 16 | 16px | `--spacing-16` |
| 17 | 17px | `--spacing-17` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 36 | 36px | `--spacing-36` |
| 38 | 38px | `--spacing-38` |
| 40 | 40px | `--spacing-40` |
| 44 | 44px | `--spacing-44` |
| 57 | 57px | `--spacing-57` |
| 60 | 60px | `--spacing-60` |
| 172 | 172px | `--spacing-172` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 20px |
| pills | 9999px |
| buttons | 20px |
| linkUnderlines | 2px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 38px
- **Card padding:** 24px
- **Element gap:** 8px

## Components

### Hero Display Headline
**Role:** Opening title that establishes the editorial tone

Crimson Pro weight 200 at 220px, white (#e8e8e8), letter-spacing -8.8px, line-height 0.91. Centered above a large product photograph. The extreme size and whisper weight is the signature — authority through scale and restraint rather than boldness.

### Hero Subtitle
**Role:** Context line below the display headline

Google Sans weight 400 at 16px, white (#e8e8e8), centered, line-height 1.5. Sits with generous breathing room below the display wordmark before the hero image.

### Hero Image Block
**Role:** Full-bleed lifestyle product photograph

Large rectangular image with 20px corner radius, filling most of the viewport width under the headline. Photography is warm, lifestyle-lit, with gifts and people — not sterile product shots.

### Category Tile
**Role:** Navigable entry to a product category

Square-ish tile with a saturated solid color background (one of the seven category colors: crimson, royal blue, powder wash, forest, mint, butter, sky tint) containing a tightly cropped product photograph. 20px corner radius, no visible border. Category label sits below the tile in Google Sans 14px, white, centered. Arrow indicator on the rightmost tile suggests horizontal scroll.

### Category Scroll Strip
**Role:** Horizontal category navigation

Seven tiles in a single row with 8px column gap, section header 'Shop gift ideas by category' in Google Sans 24px above. The strip scrolls horizontally — the layout implies overflow with a right-edge arrow.

### Trending Stat Card
**Role:** Editorial callout panel with a single insight

Solid crimson (#980b0b) background, 20px radius, generous internal padding (~32-40px). White headline text in Google Sans, with the 'TRENDING' label in tiny caps at the top. The deep red against the dark canvas creates a magazine pull-quote effect.

### Product Card (Dark)
**Role:** Individual product listing on a dark surface

Dark surface (#202124) or transparent-on-canvas, square product image on a slightly lighter gray (#333438) inset, product name in Google Sans 14px white below. No border, no shadow — the contrast between image and surface defines the card edge.

### Collection Feature Card
**Role:** Hero product for a gift collection section

Large square product photograph (left), collection name caption below in Google Sans. Pairs alongside a Trending Stat Card and two smaller Product Cards in a mixed-width 2-column arrangement.

### Section Header with Serif Accent
**Role:** Gifts-for-[persona] collection titles

Crimson Pro weight 400 at 80px, white, with the persona name set in italic ('Beauty Maven'). Subtitle in Google Sans 16px immediately below. A 'Shop the full collection →' pill button sits to the right of the header — outlined, white border, white text.

### Pill Navigation Button
**Role:** Ghost/outlined call-to-action

9999px border-radius, white text and 1px white border, transparent background, Google Sans 14px with arrow icon. Used for 'Shop the full collection →' and similar tertiary actions.

### AI Mode Feature Block
**Role:** Promotional card for AI shopping mode

Slightly lighter card surface with internal 2-column layout: heading and link on the left (Google Sans 30px white, with 99c3ff link color), product phone mockup image on the right. 20px radius, contained width within the main column.

### Category Label
**Role:** Text label beneath each category tile

Google Sans 14px weight 400, white, centered, minimal — no badge styling, no chip background, just direct labeling under each colored square.

## Do's and Don'ts

### Do
- Use Crimson Pro for display and section headlines at 48px+ — never substitute a sans-serif for the editorial moments.
- Keep body and UI text in Google Sans weight 200 or 400, with consistent -0.02em tracking across all sizes.
- Place each category on its own signature saturated color background — use all seven category colors across the system, not just one.
- Maintain 38-40px vertical section gaps to keep the editorial breathing room between collections.
- Use 20px corner radius for all cards, tiles, and image blocks — it is the single structural radius of the system.
- Let the dark canvas (#333438) be the dominant field; lift surfaces only one step to #202124 for cards.
- Use outlined pill buttons (9999px radius, white border) for all secondary actions — there is no filled CTA color in this system.

### Don't
- Do not add drop shadows or elevation effects — the design uses flat tonal contrast, not shadows.
- Do not fill any button or CTA with a saturated color — all actions are ghost/outlined against the dark canvas.
- Do not use Crimson Pro for body or UI text — it is display-only, and mixing it into small sizes breaks the editorial hierarchy.
- Do not use light-theme surfaces or white card backgrounds — this is a dark-only system.
- Do not pair more than two accent colors in a single component — the category tiles work because each tile commits to one color.
- Do not use gradients — the design is built on flat color blocks and photography, no smooth transitions.
- Do not reduce the display headline below 80px — the editorial weight depends on the extreme scale.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Onyx Canvas | `#333438` | Page background — the consistent dark field across all sections. |
| 1 | Graphite Card | `#202124` | Product card and panel surfaces, slightly lifted from the canvas. |
| 2 | Category Tile | `#980b0b | #113979 | #073618 | #ffedb8 | #a8dab5 | #d2e3fc | #e8f0fe` | Full-bleed colored backgrounds for category cards — each category gets its own color stage for product photography. |

## Elevation

The design deliberately avoids drop shadows. Depth is created purely through tonal contrast between the onyx canvas (#333438), graphite cards (#202124), and lighter image backgrounds — not through elevation. This keeps the experience feeling flat, editorial, and screen-print-like rather than skeuomorphic or product-UI-like.

## Imagery

Photography-dominant throughout. Hero uses a warm, lifestyle-lit scene with a person holding a product in a domestic setting (blue curtains, gift boxes, bicycle). Category tiles use tightly cropped product-on-color-background shots — each product is photographed against its category's signature color, creating a consistent product-spotlight pattern. Product cards in collection sections use clean product-on-neutral-gray shots. No illustrations, no abstract graphics, no 3D renders — photography is the only visual medium beyond typography and solid color blocks.

## Layout

Centered, max-width ~1200px contained layout with a single column flow. The page reads top-to-bottom as a sequence of distinct sections, each with its own hero-like moment. The hero is a centered serif headline over a wide image. Category section is a horizontal-scroll row of square tiles. Collection sections use a mixed 2-column arrangement: one large product image + one trending stat card on the top row, two smaller product cards below. Section rhythm is consistent at ~38px gaps with generous internal padding. No sidebar, no persistent navigation chrome visible in screenshots — navigation is likely minimal or in a global app header outside the captured viewport.

## Agent Prompt Guide

## Quick Color Reference
- Text (primary): #e8e8e8
- Background (page): #333438
- Background (card): #202124
- Border (subtle): #1f1f1f
- Accent (outlined links/borders): #99c3ff
- primary action: #99c3ff (outlined action border)

## Example Component Prompts

1. **Hero Display Section**: Dark canvas (#333438) with a centered Crimson Pro weight 200 headline at 220px in #e8e8e8, letter-spacing -8.8px, line-height 0.91. Below it, a Google Sans 16px subtitle in white, centered. Then a full-width product photograph with 20px corner radius.

2. **Category Tile**: Square tile, 20px radius, solid color background (choose from crimson #980b0b, royal blue #113979, forest #073618, butter #ffedb8, mint #a8dab5, powder wash #d2e3fc, or sky tint #e8f0fe). Inside: a tightly cropped product photograph. Below: Google Sans 14px white label, centered.

3. **Trending Stat Card**: Crimson (#980b0b) background, 20px radius, 32-40px padding. Tiny 'TRENDING' label at top in Google Sans 12px. Headline in Google Sans 24-30px white. White text on the red background.

4. **Collection Section Header**: Crimson Pro weight 400 at 80px in white, with the persona noun in italic (e.g. 'Beauty Maven'). Google Sans 16px subtitle below in white. To the right, an outlined pill button: 9999px radius, 1px white border, transparent fill, Google Sans 14px white text with → arrow.

5. **Product Card**: Dark transparent or #202124 surface. Square product image (slightly lighter gray #333438 background behind product). Product name in Google Sans 14px white below the image. No border, no shadow, 20px corner radius on the overall card.

## Similar Brands

- **Apple Holiday/Seasonal landing pages** — Same dark canvas with massive serif display type and full-bleed lifestyle photography for curated seasonal product features.
- **Net-a-Porter editorial collections** — Magazine-cover layout with serif italic emphasis on category names, dark backgrounds, and product-spotlight photography.
- **Mr Porter gift guides** — Editorial gift guide pattern: large serif headlines, dark-mode cards, product photography framed by category color blocks.
- **Google Store product pages** — Same Google Sans / system-serif type pairing and dark canvas language, applied to a product showcase context.
- **Aesop seasonal features** — Restrained serif-on-dark editorial layout with generous spacing and color-blocked product photography.

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-onyx-canvas: #333438;
  --color-graphite-card: #202124;
  --color-charcoal-border: #1f1f1f;
  --color-muted-iron: #9e9e9e;
  --color-fog: #45474c;
  --color-snow: #e8e8e8;
  --color-ice-blue: #99c3ff;
  --color-crimson-spotlight: #980b0b;
  --color-royal-blue: #113979;
  --color-powder-wash: #d2e3fc;
  --color-forest: #073618;
  --color-mint: #a8dab5;
  --color-butter: #ffedb8;
  --color-sky-tint: #e8f0fe;
  --color-violet-whisper: #c58af9;

  /* Typography — Font Families */
  --font-crimson-pro: 'Crimson Pro', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-google-sans: 'Google Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.43;
  --tracking-caption: -0.28px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.32px;
  --text-subheading: 24px;
  --leading-subheading: 1.25;
  --tracking-subheading: -0.48px;
  --text-heading-sm: 30px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -0.6px;
  --text-heading: 48px;
  --leading-heading: 1;
  --tracking-heading: -1.92px;
  --text-heading-lg: 80px;
  --leading-heading-lg: 0.91;
  --tracking-heading-lg: -3.2px;
  --text-display: 220px;
  --leading-display: 0.91;
  --tracking-display: -8.8px;

  /* Typography — Weights */
  --font-weight-extralight: 200;
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-6: 6px;
  --spacing-8: 8px;
  --spacing-11: 11px;
  --spacing-12: 12px;
  --spacing-14: 14px;
  --spacing-16: 16px;
  --spacing-17: 17px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-36: 36px;
  --spacing-38: 38px;
  --spacing-40: 40px;
  --spacing-44: 44px;
  --spacing-57: 57px;
  --spacing-60: 60px;
  --spacing-172: 172px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 38px;
  --card-padding: 24px;
  --element-gap: 8px;

  /* Border Radius */
  --radius-sm: 2px;
  --radius-2xl: 20px;
  --radius-full: 9999px;

  /* Named Radii */
  --radius-cards: 20px;
  --radius-pills: 9999px;
  --radius-buttons: 20px;
  --radius-linkunderlines: 2px;

  /* Surfaces */
  --surface-onyx-canvas: #333438;
  --surface-graphite-card: #202124;
  --surface-category-tile: #980b0b | #113979 | #073618 | #ffedb8 | #a8dab5 | #d2e3fc | #e8f0fe;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-onyx-canvas: #333438;
  --color-graphite-card: #202124;
  --color-charcoal-border: #1f1f1f;
  --color-muted-iron: #9e9e9e;
  --color-fog: #45474c;
  --color-snow: #e8e8e8;
  --color-ice-blue: #99c3ff;
  --color-crimson-spotlight: #980b0b;
  --color-royal-blue: #113979;
  --color-powder-wash: #d2e3fc;
  --color-forest: #073618;
  --color-mint: #a8dab5;
  --color-butter: #ffedb8;
  --color-sky-tint: #e8f0fe;
  --color-violet-whisper: #c58af9;

  /* Typography */
  --font-crimson-pro: 'Crimson Pro', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-google-sans: 'Google Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.43;
  --tracking-caption: -0.28px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.32px;
  --text-subheading: 24px;
  --leading-subheading: 1.25;
  --tracking-subheading: -0.48px;
  --text-heading-sm: 30px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -0.6px;
  --text-heading: 48px;
  --leading-heading: 1;
  --tracking-heading: -1.92px;
  --text-heading-lg: 80px;
  --leading-heading-lg: 0.91;
  --tracking-heading-lg: -3.2px;
  --text-display: 220px;
  --leading-display: 0.91;
  --tracking-display: -8.8px;

  /* Spacing */
  --spacing-6: 6px;
  --spacing-8: 8px;
  --spacing-11: 11px;
  --spacing-12: 12px;
  --spacing-14: 14px;
  --spacing-16: 16px;
  --spacing-17: 17px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-36: 36px;
  --spacing-38: 38px;
  --spacing-40: 40px;
  --spacing-44: 44px;
  --spacing-57: 57px;
  --spacing-60: 60px;
  --spacing-172: 172px;

  /* Border Radius */
  --radius-sm: 2px;
  --radius-2xl: 20px;
  --radius-full: 9999px;
}
```
