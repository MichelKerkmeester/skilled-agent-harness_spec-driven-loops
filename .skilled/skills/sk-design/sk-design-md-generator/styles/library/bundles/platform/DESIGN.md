# PLATFORM — Style Reference
> white cube gallery under spotlights

**Theme:** light

PLATFORM is a monochromatic gallery vitrine: pure white canvas, pure black type, and a single typographic voice that lets the artworks carry all the color. The interface is editorial rather than commercial — generous negative space, hairline borders, and a compact 15px body size that keeps the catalog dense without feeling utilitarian. Every element is reduced to its essential geometric form: no shadows, no rounded corners, no decorative gradients. Visual weight comes from typography alone, with the display size of 72px and a restrained 1.00 line-height creating the slow, deliberate cadence of a printed exhibition catalog.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Bone White | `#ffffff` | `--color-bone-white` | Page background, card surfaces, negative space |
| Lamp Black | `#000000` | `--color-lamp-black` | Primary text, card and nav borders, link color — the only structural color in the system |
| Ash Gray | `#dddddd` | `--color-ash-gray` | Hairline dividers, subtle surface separation |
| Concrete Gray | `#cccccc` | `--color-concrete-gray` | Secondary borders, input outlines, disabled states |
| Smoke Gray | `#b3b3b3` | `--color-smoke-gray` | Muted helper text, metadata captions, placeholder labels |
| Graphite | `#808080` | `--color-graphite` | Secondary captions, timestamps, de-emphasized metadata |
| Iron Gray | `#aaaaaa` | `--color-iron-gray` | Tertiary captions, breadcrumb separators, fine print |

## Tokens — Typography

### MediumLLWeb — All text across the site — UI, body, and display. A single neo-grotesque custom face from Production Type carrying every typographic role. Weight 400 is the default for body and navigation; weight 500 is reserved for artist names, prices, and emphasis in card metadata. Display sizes (48–72px) use the same 400 weight with tight line-height (1.00–1.15) to create the measured, catalog-page cadence. · `--font-mediumllweb`
- **Substitute:** Söhne, Inter, Neue Haas Grotesk
- **Weights:** 400, 500
- **Sizes:** 12px, 15px, 20px, 48px, 72px
- **Line height:** 1.00, 1.15, 1.20
- **Letter spacing:** 0.01em at 20px and below, 0.02em at 48px and above
- **OpenType features:** `"tnum" on for price alignment in card metadata`
- **Role:** All text across the site — UI, body, and display. A single neo-grotesque custom face from Production Type carrying every typographic role. Weight 400 is the default for body and navigation; weight 500 is reserved for artist names, prices, and emphasis in card metadata. Display sizes (48–72px) use the same 400 weight with tight line-height (1.00–1.15) to create the measured, catalog-page cadence.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.2 | 0.01px | `--text-caption` |
| body-sm | 15px | 1.2 | 0.01px | `--text-body-sm` |
| subheading | 20px | 1.15 | 0.01px | `--text-subheading` |
| heading | 48px | 1.15 | 0.02px | `--text-heading` |
| display | 72px | 1 | 0.02px | `--text-display` |

## Tokens — Spacing & Shapes

**Density:** compact

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 5 | 5px | `--spacing-5` |
| 6 | 6px | `--spacing-6` |
| 7 | 7px | `--spacing-7` |
| 8 | 8px | `--spacing-8` |
| 9 | 9px | `--spacing-9` |
| 10 | 10px | `--spacing-10` |
| 11 | 11px | `--spacing-11` |
| 13 | 13px | `--spacing-13` |
| 17 | 17px | `--spacing-17` |
| 18 | 18px | `--spacing-18` |
| 20 | 20px | `--spacing-20` |
| 30 | 30px | `--spacing-30` |
| 36 | 36px | `--spacing-36` |
| 72 | 72px | `--spacing-72` |
| 122 | 122px | `--spacing-122` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 0px |
| cards | 0px |
| badges | 0px |
| inputs | 0px |
| buttons | 0px |

### Layout

- **Page max-width:** 1280px
- **Section gap:** 72px
- **Card padding:** 30px
- **Element gap:** 10px

## Components

### Top Navigation Bar
**Role:** Primary site header

Horizontal bar with flat 0px radius. Left: 'PLATFORM:' label in 12px MediumLLWeb 500 uppercase, followed by Shop / Objects / Artists links at 15px weight 400. Right: region selector (US), account icon, saved items, search. 1px solid #000000 bottom border separates nav from content. Padding: 6px vertical, 20–40px horizontal.

### Hero Spotlight Banner
**Role:** Full-width editorial feature

Full-bleed dark photographic image filling the viewport. Centered overlay text: 'SPOTLIGHT:' at 48px weight 400 followed by artist name at 72px weight 400, both #ffffff on the darkened photo. Subtext at 15px centered below, plus an '› Explore now' link. No buttons, no card chrome — pure type on image.

### Section Header Band
**Role:** Zone introduction block

Horizontal band with #dddddd background or hairline border. Left column: section title in 12px 500 uppercase tracking 0.02em. Center: descriptive paragraph at 15px weight 400. Right: '› Browse artworks' text link. 1px #000000 bottom border divides band from content grid.

### Artwork Card
**Role:** Individual artwork listing

Vertical card with 0px radius and no shadow. 1px #000000 border. Artwork image fills the card width with a 1:1 or 3:4 aspect ratio. Below image: artist name at 12px 500 uppercase centered, work title and year at 15px 400, medium description at 15px 400, and price at 12px 500 — all centered. A small star/save icon sits at the bottom. Card padding: ~20px below image.

### Artwork Grid
**Role:** Catalog collection layout

4-column grid on desktop, 2-column on tablet, 1-column on mobile. Equal-width columns with 20–30px gutters. Each card occupies one grid cell with consistent image-to-text ratio across the row.

### Text Link
**Role:** Inline navigation and call-to-action

Plain underlined #000000 text at 15px weight 400. Leading chevron '›' character for directional links like 'Explore now', 'Browse artworks', 'View all'. No button background, no color change on hover — underline thickens or weight shifts to 500.

### Ghost Icon Button
**Role:** Utility actions in nav and cards

Icon-only button with 0px radius, no background, no border. Uses #000000 stroke/fill for account, saved items, search, and save-to-collection icons. 4–6px padding around icon.

### Body Text Block
**Role:** Editorial paragraphs and descriptions

15px MediumLLWeb weight 400 at 1.20 line-height. #000000 color on #ffffff background. Max-width ~640px for readable measure. Used for feature descriptions, artist bios, and zone intros.

### Metadata Caption
**Role:** Artist, title, year, medium, price

Centered stack under each artwork: artist name in 12px 500 uppercase, title and year in 15px 400, price in 12px 500. Tabular numerals enabled for price alignment. All #000000.

### Footer
**Role:** Site footer with links and info

Top 1px #000000 border, #ffffff background. Multi-column link list at 15px weight 400, grouped by category. Bottom row: copyright and legal links in 12px. Flat, no decoration.

### Search Input
**Role:** Nav search field

Transparent background, 1px #000000 bottom border only (no full box). Placeholder text at 15px in #b3b3b3. No border-radius. Search icon inline at right.

## Do's and Don'ts

### Do
- Use only #000000 for all text, borders, and interactive elements — never introduce chromatic colors for UI purposes
- Set all border-radius to 0px on buttons, cards, inputs, badges, and tags — sharp corners are the signature
- Set MediumLLWeb 400 as the default weight for all body and heading text; reserve 500 exclusively for labels, artist names, and prices
- Use 1px #000000 borders for card outlines, nav separation, and section dividers — never thicker
- Keep the type scale to five sizes: 12, 15, 20, 48, 72px — resist adding intermediate steps
- Use tabular numerals (tnum) for all prices and numeric metadata to ensure column alignment in card grids
- Maintain a max-width of ~1280px with generous side margins so the catalog breathes like a gallery wall

### Don't
- Do not add rounded corners to any element — the sharp-edge aesthetic is load-bearing for the gallery identity
- Do not introduce shadows, glows, or blur effects — depth comes from borders and band color shifts only
- Do not use color for hierarchy — rely solely on weight (400 vs 500) and size (12–72px)
- Do not use gradient backgrounds, even subtle ones — the system is strictly binary black/white
- Do not use 13–17px body sizes — the compact 15px at 1.20 line-height is the intentional rhythm
- Do not center body copy inside cards beyond metadata — long-form text should be left-aligned with a ~640px measure
- Do not add colored badges, tags, or status pills — labels are plain uppercase 12px 500 text only

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Bone White | `#ffffff` | Base page canvas and card backgrounds |
| 2 | Ash Gray | `#dddddd` | Subtle surface tint for zone bands and dividers |

## Elevation

The design system deliberately avoids shadows. All depth and separation is achieved through 1px hairline borders in #000000 or #dddddd, plus background color shifts between white and light gray bands. There is no floating, no blurring, no z-axis — the interface reads as a flat printed page pinned to the wall.

## Imagery

Imagery is exclusively fine-art photography: paintings, sculptures, and mixed-media works presented as straight product crops on white. No lifestyle context, no staged room shots, no human models interacting with the art. Each artwork fills its card frame edge-to-edge, treated as a precious object isolated for inspection. The hero image is a full-bleed atmospheric photograph — dark, slightly blurred, with dramatic light — that functions as an editorial mood-setter rather than a product shot. No illustrations, no icons beyond minimal functional glyphs, no decorative graphics.

## Layout

Full-bleed hero section with centered overlay type, followed by a gray zone-band header introducing each content section, then a 4-column card grid of artworks. The page is contained within a ~1280px max-width for the card grid and text blocks, but the hero and section bands stretch edge-to-edge. Section rhythm is consistent: every zone opens with a hairline-bordered header band (gray bg, left-aligned label, centered description, right-aligned link), followed by the card grid. Navigation is a minimal top bar with no sticky behavior. No sidebars, no breadcrumbs within the main flow — the layout is strictly vertical: nav → hero → zone band → grid → zone band → grid → footer.

## Agent Prompt Guide

**Quick Color Reference**
- text: #000000
- background: #ffffff
- border: #000000
- muted text: #b3b3b3
- divider: #dddddd
- primary action: no distinct CTA color

**3–5 Example Component Prompts**

1. *Artwork Card*: 0px radius, 1px solid #000000 border, no shadow. Artwork image fills card width edge-to-edge. Below: artist name centered at 12px MediumLLWeb weight 500 uppercase, title and year at 15px weight 400, medium at 15px weight 400, price at 12px weight 500. All text #000000 on #ffffff. 20px padding below image.

2. *Hero Spotlight Banner*: Full-bleed dark photographic image, 100vh. Centered overlay: 'SPOTLIGHT:' at 48px MediumLLWeb 400 #ffffff, artist name at 72px weight 400 #ffffff, line-height 1.00, letter-spacing 0.02em. Below: 15px descriptive subtext #ffffff, then '› Explore now' text link.

3. *Section Header Band*: #dddddd background, 1px solid #000000 bottom border. Left: section label at 12px weight 500 uppercase. Center: description at 15px weight 400. Right: '› Browse all' underlined text link at 15px weight 400. 20px vertical padding.

4. *Artwork Grid*: 4 equal columns, 24px gap, max-width 1280px centered. Each cell is an Artwork Card. Grid sits directly below the Section Header Band with no additional spacing.

5. *Top Navigation*: 0px radius, #ffffff background, 1px solid #000000 bottom border. Left: 'PLATFORM:' at 12px weight 500 uppercase. Nav links (Shop, Objects, Artists) at 15px weight 400 #000000. Right: region selector and icon buttons (account, saved, search) as 0px ghost buttons. 6px vertical padding.

## Similar Brands

- **David Zwirner** — Same monochrome gallery-catalogue approach with white canvas, black type, and artwork presented as unframed product crops in a dense grid
- **Hauser & Wirth** — Editorial art-world aesthetic with hairline borders, zero shadows, sharp corners, and a single neo-grotesque typeface carrying all hierarchy
- **The MoMA Store** — Minimalist art-retail layout with centered metadata stacks under each artwork, 1px black card borders, and no decorative chrome
- **Pace Gallery** — Full-bleed dark hero photography, restrained black-and-white system, and compact body type that lets the catalog artwork dominate

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-bone-white: #ffffff;
  --color-lamp-black: #000000;
  --color-ash-gray: #dddddd;
  --color-concrete-gray: #cccccc;
  --color-smoke-gray: #b3b3b3;
  --color-graphite: #808080;
  --color-iron-gray: #aaaaaa;

  /* Typography — Font Families */
  --font-mediumllweb: 'MediumLLWeb', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.2;
  --tracking-caption: 0.01px;
  --text-body-sm: 15px;
  --leading-body-sm: 1.2;
  --tracking-body-sm: 0.01px;
  --text-subheading: 20px;
  --leading-subheading: 1.15;
  --tracking-subheading: 0.01px;
  --text-heading: 48px;
  --leading-heading: 1.15;
  --tracking-heading: 0.02px;
  --text-display: 72px;
  --leading-display: 1;
  --tracking-display: 0.02px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-5: 5px;
  --spacing-6: 6px;
  --spacing-7: 7px;
  --spacing-8: 8px;
  --spacing-9: 9px;
  --spacing-10: 10px;
  --spacing-11: 11px;
  --spacing-13: 13px;
  --spacing-17: 17px;
  --spacing-18: 18px;
  --spacing-20: 20px;
  --spacing-30: 30px;
  --spacing-36: 36px;
  --spacing-72: 72px;
  --spacing-122: 122px;

  /* Layout */
  --page-max-width: 1280px;
  --section-gap: 72px;
  --card-padding: 30px;
  --element-gap: 10px;

  /* Named Radii */
  --radius-tags: 0px;
  --radius-cards: 0px;
  --radius-badges: 0px;
  --radius-inputs: 0px;
  --radius-buttons: 0px;

  /* Surfaces */
  --surface-bone-white: #ffffff;
  --surface-ash-gray: #dddddd;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-bone-white: #ffffff;
  --color-lamp-black: #000000;
  --color-ash-gray: #dddddd;
  --color-concrete-gray: #cccccc;
  --color-smoke-gray: #b3b3b3;
  --color-graphite: #808080;
  --color-iron-gray: #aaaaaa;

  /* Typography */
  --font-mediumllweb: 'MediumLLWeb', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.2;
  --tracking-caption: 0.01px;
  --text-body-sm: 15px;
  --leading-body-sm: 1.2;
  --tracking-body-sm: 0.01px;
  --text-subheading: 20px;
  --leading-subheading: 1.15;
  --tracking-subheading: 0.01px;
  --text-heading: 48px;
  --leading-heading: 1.15;
  --tracking-heading: 0.02px;
  --text-display: 72px;
  --leading-display: 1;
  --tracking-display: 0.02px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-5: 5px;
  --spacing-6: 6px;
  --spacing-7: 7px;
  --spacing-8: 8px;
  --spacing-9: 9px;
  --spacing-10: 10px;
  --spacing-11: 11px;
  --spacing-13: 13px;
  --spacing-17: 17px;
  --spacing-18: 18px;
  --spacing-20: 20px;
  --spacing-30: 30px;
  --spacing-36: 36px;
  --spacing-72: 72px;
  --spacing-122: 122px;
}
```
