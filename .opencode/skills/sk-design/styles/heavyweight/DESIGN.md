# Heavyweight — Style Reference
> Paper specimen archive. A wall of photographed letterforms printed on textured stock, hung on a cool off-white gallery wall with hairline frames.

**Theme:** light

Heavyweight treats its typefaces as museum objects: each card presents a photographic specimen of large type set in physical space, filling the card edge-to-edge. The surrounding chrome dissolves into a thin navigation bar, hairline borders, and a single custom sans (Nuckle) at just 14–16px — letting the specimens carry every visual decision. The palette is near-monochrome: cool off-white canvas (#f3f5fa), white card surfaces, near-black ink (#222222), with a single vivid mint green (#39d17f) reserved exclusively for new-release tags. An unusual 11px card radius sits between editorial and soft-modern, and the 3-column grid breathes with comfortable 12px gaps while the dense specimen coverage keeps the page visually full.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Canvas Mist | `#f3f5fa` | `--color-canvas-mist` | Page background, the base surface everything sits on. Cool off-white with a faint blue cast — distinct from pure white so the white cards read as elevated without needing shadows |
| Card White | `#ffffff` | `--color-card-white` | Card surfaces, specimen containers, navigation background. Creates the canvas → card elevation step through surface contrast alone |
| Press Black | `#222222` | `--color-press-black` | Primary text, structural borders, card frames, button outlines. Near-black (not pure #000) so it reads as ink rather than void against the cool canvas |
| Hairline Char | `#2d2d2d` | `--color-hairline-char` | Secondary borders, nav dividers, subtle structural lines. One shade softer than Press Black for hierarchy between primary and secondary framing |
| Mute Slate | `#888888` | `--color-mute-slate` | Secondary text — style counts, descriptive labels, helper copy. Creates a tertiary information layer below the primary font names |
| New Mint | `#39d17f` | `--color-new-mint` | Green outline accent for tags, dividers, and focused UI edges. Do not promote it to the primary CTA color |

## Tokens — Typography

### Nuckle — All UI chrome — navigation, card labels, weight lists, section headers, style counts. The single custom sans carries every text element outside the featured typefaces themselves. The extreme size restraint (just two sizes) is deliberate: the fewer decisions the UI typeface makes, the more visual space the product typefaces can occupy. Weight 500 for labels and emphasis, weight 400 for secondary information. · `--font-nuckle`
- **Substitute:** Inter, or similar geometric humanist sans at matched weights
- **Weights:** 400, 500
- **Sizes:** 14px, 16px
- **Line height:** 1.00, 1.14, 1.25
- **Letter spacing:** 0.0130em at 14px, 0.0140em at 16px — slightly positive tracking, the only typographic 'decision' the UI makes beyond size and weight. Counterintuitively positive for a near-monochrome UI; the tracking opens the letterforms enough to feel editorial rather than compressed.
- **Role:** All UI chrome — navigation, card labels, weight lists, section headers, style counts. The single custom sans carries every text element outside the featured typefaces themselves. The extreme size restraint (just two sizes) is deliberate: the fewer decisions the UI typeface makes, the more visual space the product typefaces can occupy. Weight 500 for labels and emphasis, weight 400 for secondary information.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 14px | 1.14 | 0.18px | `--text-caption` |
| body | 16px | 1.25 | 0.22px | `--text-body` |

## Tokens — Spacing & Shapes

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 5 | 5px | `--spacing-5` |
| 7 | 7px | `--spacing-7` |
| 8 | 8px | `--spacing-8` |
| 10 | 10px | `--spacing-10` |
| 12 | 12px | `--spacing-12` |
| 18 | 18px | `--spacing-18` |
| 30 | 30px | `--spacing-30` |

### Border Radius

| Element | Value |
|---------|-------|
| all | 11px |
| tags | 11px |
| cards | 11px |
| buttons | 11px |

### Layout

- **Section gap:** 64px
- **Card padding:** 12px
- **Element gap:** 12px

## Components

### Font Specimen Card
**Role:** Primary content unit — displays a typeface with a full-bleed photographic specimen

White (#ffffff) surface on #f3f5fa canvas. 1px #222222 border, 11px border-radius. Large specimen image fills the card top edge-to-edge, clipped to the 11px radius. Below the image: 12px padding all sides. Font name in Nuckle 16px/1.25 weight 500 #222222, followed by style count in 16px weight 400 #888888 (format: 'Name (N styles)'). Weight list below in 14px/1.14, with available weights in weight 500 and unavailable in weight 400 #888888.

### Top Navigation Bar
**Role:** Site-wide header with logo, section links, and account/cart

Full-width, white (#ffffff) background, 1px #2d2d2d bottom border, 8px vertical padding. Left: 14px Nuckle weight 500 #222222 'Heavyweight' + weight 400 #888888 'Digital Type Foundry'. Center: 14px Nuckle weight 400 #222222 links 'Fonts | In Use | Projects | Stuff | Information' separated by 2px right margins. Right: 14px Nuckle weight 400 #222222 'Account | Cart 0'.

### New Release Tag
**Role:** Marks newly released typefaces in the specimen grid

14px Nuckle weight 500 #39d17f text reading 'New', optionally preceded by a 4px #39d17f dot. No background, no border, no padding. Positioned inline next to the font name in specimen card headers. The #39d17f is the only chromatic color in the system — its scarcity makes new releases instantly recognizable without needing a pill shape or background fill.

### Ghost Button
**Role:** Interactive controls for weight filters and selection

#f3f5fa background, 1px #222222 border, 11px border-radius. 14px Nuckle weight 400 #222222 text. 7px vertical padding, 10–18px horizontal padding. On hover/active: inverts to #222222 background with #ffffff text. No shadow, no transition complexity — the inversion is instantaneous.

### Section Header Label
**Role:** Small text label introducing a grid section (e.g., 'Fonts')

14px Nuckle weight 500 #222222, left-aligned. 5px padding top/bottom, 8px padding left. Sits above the card grid with a subtle visual weight that doesn't compete with the specimens below it.

### Weight Label List
**Role:** Lists all available weights/widths for a typeface below the specimen image

14px Nuckle, weight 400 #222222 for available weights, weight 500 for the currently selected or emphasized weight. Horizontal flow with natural wrapping. 4px margin-bottom between lines. The weight names are the product's own vocabulary (Condensed, SemiBold, etc.) displayed in the typeface's own design.

### Hairline Divider
**Role:** Separates content sections and frames elements

1px solid #2d2d2d (subtle) or #222222 (structural). Used as card borders, nav bottom border, and section dividers. No shadow, no gap — the line itself is the separator. The system relies on these hairlines for all visual structure.

### Style Count Indicator
**Role:** Shows the number of styles in a typeface family

14px Nuckle weight 400 #888888, inline with the font name. Format: '(N styles)' in parentheses. The muted gray creates a secondary information layer that doesn't compete with the primary font name.

### Logo Mark
**Role:** Brand identifier in the top-left of the navigation

Small geometric icon (appears as a circular/abstract mark) followed by 'Heavyweight' wordmark in 14px Nuckle weight 500 #222222. The mark is a simple geometric shape — no complex illustration, no color, no embellishment.

## Do's and Don'ts

### Do
- Use #f3f5fa as the page canvas and #ffffff for card surfaces — the subtle contrast between the two is the foundation of the system's spatial hierarchy
- Use Nuckle 16px/1.25 weight 500 for card titles and 14px/1.14 weight 400 for secondary information
- Use 11px border-radius on all cards, buttons, and tags — this radius is the system's signature and distinguishes it from standard 4px or 8px SaaS conventions
- Use #39d17f exclusively for 'New' tags — never for actions, links, or decorative accents
- Use 1px #222222 or #2d2d2d borders for separation — never use shadows or background-color changes alone
- Let specimen images fill cards edge-to-edge — the type is the product, not the chrome
- Use 12px gaps between elements and 12px card padding — comfortable density without excess breathing room

### Don't
- Don't introduce additional chromatic colors — the near-monochrome palette is the system's identity and any second accent would dilute the 'New' tag's signal
- Don't use shadows or elevation effects — separation is achieved through hairline borders and surface contrast only
- Don't use border-radius values other than 11px — standard 4px or 8px would break the editorial feel
- Don't display the 'New' tag in any color other than #39d17f, and don't give it a background fill or pill shape
- Don't use more than two type sizes in the UI (14px and 16px) — the restraint lets featured typefaces dominate the visual field
- Don't add decorative gradients, patterns, or background imagery to the chrome — the canvas is always flat #f3f5fa
- Don't use filled chromatic buttons — the system has no distinct CTA color; all actions are ghost/outlined with #f3f5fa fill and #222222 border

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Canvas | `#f3f5fa` | Page background — the gallery wall |
| 2 | Card Surface | `#ffffff` | Specimen cards, navigation bar — the mounted objects |
| 3 | Ink | `#222222` | Inverted surface for dark specimens or potential dark-mode treatment |

## Elevation

The system avoids shadows entirely. Spatial hierarchy is created through surface contrast (cool off-white canvas → white cards) and 1px hairline borders (#222222 or #2d2d2d). Cards sit close to the surface — the way museum labels sit beside objects rather than floating above them. When depth is needed, the system inverts: a #222222 surface with #f3f5fa text replaces the typical shadow + lift pattern. This editorial-print approach keeps the chrome invisible and lets the type specimens dominate.

## Imagery

Each card features a full-bleed photographic specimen of type set in physical space — printed on paper, embossed on cardboard, painted on walls. The specimens are art-directed photographs, not digital renders: visible paper texture, print dot patterns, and dimensional letterforms catching light. The 'Atlantic' specimen shows type embossed on brown cardboard stock; the 'Animo' specimen shows white type on a dark printed surface; the 'Cigars' specimen is a tight close-crop of a single serif letter in gray. These are the product — the surrounding UI dissolves to let them dominate. No illustrations, no decorative photography. The only icons are simple geometric marks in the navigation. The visual language is editorial-print: photographed artifacts on a gallery wall, not screen-native graphics.

## Layout

Full-width 3-column card grid on a #f3f5fa canvas. Each card is roughly equal width with 12px gaps between cards. Cards are arranged alphabetically by typeface name. A thin top navigation bar (white background, 1px #2d2d2d bottom border) spans the full viewport width. No sidebar, no mega-menu, no secondary navigation. The first section shows the beginning of the font grid; subsequent sections continue the grid with more typefaces. Section rhythm is established by the card grid itself rather than alternating bands or dividers. The page breathes with comfortable 12px element gaps and 64px section padding, but the dense specimen coverage keeps the page visually full at every scroll position.

## Agent Prompt Guide

Quick Color Reference:
- ink: #222222
- canvas: #f3f5fa
- surface: #ffffff
- border: #2d2d2d
- mute: #888888
- new tag: #39d17f
- primary action: no distinct CTA color

Example Component Prompts:

1. Create a font specimen card: white (#ffffff) surface, 1px #222222 border, 11px border-radius. Large specimen image fills the card top edge-to-edge. Below the image, 12px padding. Font name in Nuckle 16px/1.25 weight 500 #222222, followed by '(N styles)' in 16px weight 400 #888888. Weight list below in 14px/1.14 — available weights in weight 500, unavailable in weight 400 #888888.

2. Build the top navigation bar: full-width, white (#ffffff) background, 1px #2d2d2d bottom border, 8px vertical padding. Left: 14px Nuckle weight 500 #222222 'Heavyweight' + weight 400 #888888 'Digital Type Foundry'. Center: 14px Nuckle weight 400 #222222 links separated by pipes. Right: 14px Nuckle weight 400 #222222 'Account | Cart 0'.

3. Design a new-release tag: 14px Nuckle weight 500 #39d17f text reading 'New', preceded by a 4px #39d17f dot. No background, no border, no padding. Positioned inline next to the font name in specimen card headers.

4. Create a ghost button: #f3f5fa background, 1px #222222 border, 11px border-radius. 14px Nuckle weight 400 #222222 text. 7px vertical padding, 18px horizontal padding. On hover: invert to #222222 background with #ffffff text.

5. Create a 3-column card grid section: #f3f5fa canvas background, 12px gap between cards. Each card is a font specimen as described above. 64px vertical padding above and below the grid.

## Similar Brands

- **Klim Type Foundry** — Same specimen-card grid approach with monochromatic chrome and type treated as photographed artifact
- **Pangram Pangram** — Minimal UI with type specimens as the visual product and similar card-based grid structure
- **Commercial Type** — Editorial specimen presentation with large type photography and restrained UI chrome
- **Ohno Type** — Cool off-white canvas, hairline borders, type-forward layout with no decorative chrome
- **Dinamo** — Specimen grid with photographed type, minimal navigation, monochromatic palette with selective accent

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-canvas-mist: #f3f5fa;
  --color-card-white: #ffffff;
  --color-press-black: #222222;
  --color-hairline-char: #2d2d2d;
  --color-mute-slate: #888888;
  --color-new-mint: #39d17f;

  /* Typography — Font Families */
  --font-nuckle: 'Nuckle', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.14;
  --tracking-caption: 0.18px;
  --text-body: 16px;
  --leading-body: 1.25;
  --tracking-body: 0.22px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-5: 5px;
  --spacing-7: 7px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-18: 18px;
  --spacing-30: 30px;

  /* Layout */
  --section-gap: 64px;
  --card-padding: 12px;
  --element-gap: 12px;

  /* Border Radius */
  --radius-lg: 11px;

  /* Named Radii */
  --radius-all: 11px;
  --radius-tags: 11px;
  --radius-cards: 11px;
  --radius-buttons: 11px;

  /* Surfaces */
  --surface-canvas: #f3f5fa;
  --surface-card-surface: #ffffff;
  --surface-ink: #222222;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-canvas-mist: #f3f5fa;
  --color-card-white: #ffffff;
  --color-press-black: #222222;
  --color-hairline-char: #2d2d2d;
  --color-mute-slate: #888888;
  --color-new-mint: #39d17f;

  /* Typography */
  --font-nuckle: 'Nuckle', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.14;
  --tracking-caption: 0.18px;
  --text-body: 16px;
  --leading-body: 1.25;
  --tracking-body: 0.22px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-5: 5px;
  --spacing-7: 7px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-18: 18px;
  --spacing-30: 30px;

  /* Border Radius */
  --radius-lg: 11px;
}
```
