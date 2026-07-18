# Peak Design — Style Reference
> Gallery wall, half lit

**Theme:** light

Peak Design is a gallery-grade commerce experience: a near-monochrome canvas where editorial typography and product photography do all the work. The system alternates between crisp white surfaces and deep near-black panels, creating dramatic split layouts where one side carries an italic serif headline and the other a full-bleed product or lifestyle image. Typography is the brand's primary voice — a tall condensed display serif (Exposure-style) for headlines paired with a neutral grotesque (Geist) for UI and an all-caps compressed sans (bryant) for labels, eyebrows, and buttons. The interface stays disciplined: no chromatic UI elements, no decorative gradients, no shadows — just hairline borders, two corner radii (4 and 8), and a single red accent reserved for rare emphasis. Components feel engineered rather than decorated: thin dividers, flat product cards, pill-shaped filter chips, and ghost buttons that read as architectural annotations.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Carbon Ink | `#1a211e` | `--color-carbon-ink` | Primary text, dark hero panels, body copy, icons, borders on light surfaces — the near-black that anchors every headline and forms the deep-background panels of split sections |
| Paper White | `#ffffff` | `--color-paper-white` | Light supporting surface for subtle backgrounds and section separation. Do not promote it to the primary CTA color |
| True Black | `#000000` | `--color-true-black` | Maximum contrast elements: headline fills on white, announcement bar, footer treatments, solid icon strokes — appears where the design demands the sharpest edge |
| Obsidian | `#0c0c0c` | `--color-obsidian` | Deep panel surfaces and image overlays — slightly softer than true black, used for full-bleed dark sections that need to feel weighty without flat black's harshness |
| Fog | `#eef1f0` | `--color-fog` | Light supporting surface for subtle backgrounds and section separation. Do not promote it to the primary CTA color |
| Mist | `#e0e0e0` | `--color-mist` | Divider lines, disabled states, subtle structural separators — the mid-light gray that defines boundaries between sections on the white canvas |
| Graphite | `#606562` | `--color-graphite` | Muted body text, secondary navigation, metadata labels — the de-emphasized text tone for information that supports but should not compete with headlines |
| Ash Border | `#cccfcd` | `--color-ash-border` | Hairline input borders, subtle dividers — a warm-leaning gray that reads as a soft pencil line against white surfaces |
| Slate | `#363537` | `--color-slate` | Navigation text on light surfaces, mid-weight borders — reads as near-black at small sizes but carries a subtle warmth |
| Pewter | `#4e4e4e` | `--color-pewter` | Supporting neutral for secondary UI, dividers, and muted labels |
| Ember Red | `#cc2e39` | `--color-ember-red` | Red supporting accent for decorative details and low-frequency emphasis |

## Tokens — Typography

### Geist — Body copy, product titles, descriptions, form inputs, link text, footer content. Weight 400 for body, 600 for emphasis, 700 for product names and important inline labels. The neutral grotesque lets the display serif and condensed sans carry the brand voice while Geist handles everything functional and readable. · `--font-geist`
- **Substitute:** Inter, Söhne, Helvetica Neue
- **Weights:** 400, 600, 700
- **Sizes:** 14px, 16px
- **Line height:** 1.00–1.50
- **Role:** Body copy, product titles, descriptions, form inputs, link text, footer content. Weight 400 for body, 600 for emphasis, 700 for product names and important inline labels. The neutral grotesque lets the display serif and condensed sans carry the brand voice while Geist handles everything functional and readable.

### Exposure-style serif (Exposure-10) — Display and hero headlines. Single weight (400) in an italic-leaning serif creates editorial gravitas — these are the words that set the brand's tone, used sparingly on full-bleed dark panels and key section openers. The tight tracking (-0.025em) lets large letterforms feel composed rather than airy. · `--font-exposure-style-serif-exposure-10`
- **Substitute:** Playfair Display, GT Super, Tiempos Headline
- **Weights:** 400
- **Sizes:** 40px, 48px, 80px
- **Line height:** 1.10
- **Letter spacing:** -0.025em at 40-80px
- **Role:** Display and hero headlines. Single weight (400) in an italic-leaning serif creates editorial gravitas — these are the words that set the brand's tone, used sparingly on full-bleed dark panels and key section openers. The tight tracking (-0.025em) lets large letterforms feel composed rather than airy.

### Bryant-style condensed sans (bryant) — Navigation labels, category filter buttons, button text, eyebrows, section tags, and secondary headings. The compressed uppercase forms with positive tracking create an industrial, label-like voice — these words identify and instruct, never describe. · `--font-bryant-style-condensed-sans-bryant`
- **Substitute:** Druk Wide, Inter Display Bold, Neue Haas Grotesk Display Bold (uppercase)
- **Weights:** 700
- **Sizes:** 14px, 16px, 24px, 32px
- **Line height:** 1.10–1.40
- **Letter spacing:** 0.038em at 14px, 0.057em at 16px (positive tracking for all-caps treatment)
- **Role:** Navigation labels, category filter buttons, button text, eyebrows, section tags, and secondary headings. The compressed uppercase forms with positive tracking create an industrial, label-like voice — these words identify and instruct, never describe.

### Geist Mono — Small technical labels, SKUs, or micro-data — appears in the smallest details where monospaced alignment signals precision or product specification. · `--font-geist-mono`
- **Substitute:** JetBrains Mono, IBM Plex Mono
- **Weights:** 400
- **Sizes:** 14px
- **Line height:** 1.00
- **Role:** Small technical labels, SKUs, or micro-data — appears in the smallest details where monospaced alignment signals precision or product specification.

### Exposure-10 — Exposure-10 — detected in extracted data but not described by AI · `--font-exposure-10`
- **Weights:** 400
- **Sizes:** 40px, 48px, 80px
- **Line height:** 1.1
- **Letter spacing:** -0.025, -0.01
- **Role:** Exposure-10 — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 14px | 1 | — | `--text-caption` |
| button-label | 16px | 1.1 | 0.91px | `--text-button-label` |
| heading-sm | 24px | 1.2 | 0.91px | `--text-heading-sm` |
| heading | 32px | 1.2 | — | `--text-heading` |
| heading-lg | 48px | 1.1 | -1.2px | `--text-heading-lg` |
| display | 80px | 1.1 | -2px | `--text-display` |

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
| 64 | 64px | `--spacing-64` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 4px |
| cards | 8px |
| badges | 9999px |
| images | 8px |
| inputs | 4px |
| buttons | 4px |
| buttonsRounded | 32px |

### Layout

- **Page max-width:** 1440px
- **Section gap:** 80px
- **Card padding:** 24px
- **Element gap:** 24px

## Components

### Announcement Bar
**Role:** Top utility bar for promotions and links

Full-width black (#1a211e) strip, ~32px tall, white (#ffffff) text at 14px bryant weight 700 uppercase with 0.057em tracking. Content centered horizontally. Provides shipping/warranty/return info and secondary navigation entry points (store finder, mission).

### Primary Navigation
**Role:** Main site header with logo, category links, search, and account controls

White (#ffffff) background, ~64px tall, with hairline bottom border (#e0e0e0). Left: Peak Design diamond/peak logo in #1a211e. Center-left: category links in bryant 700 16px uppercase (#363537), letter-spacing 0.057em. Center: full search input field with #eef1f0 background, #cccfcd border, 4px radius, 14px Geist placeholder text in #606562. Right: Support link, account icon, cart icon — all in #1a211e. No background fill, no elevation.

### Category Filter Bar
**Role:** Horizontal scrollable product category selector

Pill-shaped filter chips below the main nav, 8px row gap between chips. Active state: #1a211 fill with #ffffff text. Inactive: transparent fill with #363537 text and #cccfcd border. Text: bryant 700 16px uppercase. Height ~40px, horizontal padding 20px, border-radius 9999px. Arrow buttons on right edge for overflow.

### Product Card
**Role:** Individual product tile in the product grid

White (#ffffff) background, no visible border. Product image fills the card top with 8px border-radius. No padding between image and text. 'New' badge: #4e4e4 pill at top-left of image, white bryant 700 14px text, padding 2px 8px, 9999px radius. Product title: Geist 400 16px #1a211, 4px gap to brand label. Brand label 'Kelp': Geist 400 14px #606562. Price: Geist 400 16px #1a211, 8px below brand label. Card has no shadow or border — content separates by whitespace alone.

### Hero Split Panel
**Role:** Full-width hero with editorial headline on one side, product image on the other

Two-column 50/50 split, full viewport width, 400-600px height. Left panel: #0c0c0c or #1a211 background with eyebrow label in bryant 700 14px white uppercase, then display headline in Exposure-style serif 48-80px italic #ffffff with -0.025em tracking, line-height 1.10. Subtext in Geist 400 16px white at 80% opacity. Right panel: full-bleed product or lifestyle image with no border-radius (flush to viewport edge). Vertical centering of text content within left panel.

### Filled Button (on dark)
**Role:** Primary action button on dark hero panels

White (#ffffff) fill, no border, 4px corner radius. Padding: 12px vertical, 20px horizontal. Text: bryant 700 16px uppercase in #1a211, letter-spacing 0.057em. No shadow, no hover state with elevation shift — the button is a solid rectangle of contrast.

### Outlined Button (on dark)
**Role:** Secondary action button on dark hero panels

Transparent fill, 1px white (#ffffff) border, 4px corner radius. Padding: 12px vertical, 20px horizontal. Text: bryant 700 16px uppercase in #ffffff, letter-spacing 0.057em. Border is thin enough to read as an annotation rather than a container.

### Ghost Button (on light)
**Role:** Text-only or borderless action on white surfaces

No background, no border. Text: bryant 700 14-16px uppercase in #1a211, letter-spacing 0.057em. Used for inline links and low-emphasis actions that should feel like annotations on the page.

### Carousel Pagination Dots
**Role:** Position indicator for scrollable product carousels

Horizontal row of 4-6 dots, 8px gap. Active dot: ~8px wide solid #1a211 rounded pill. Inactive: ~8px circle in #cccfcd. Centered below the product row.

### Search Field
**Role:** Persistent search input in the main navigation

#eef1f0 background fill, 1px #cccfcd border, 4px corner radius. Height ~40px, width fills available nav space. Left icon (magnifying glass) in #606562 at 16px. Placeholder text 'Search for packing cubes' in Geist 400 14px #606562.

### Section Heading Block
**Role:** Editorial heading for content sections like 'Explore our products'

Large display serif in #1a211, left-aligned, 48-80px size, line-height 1.10. Optional em-dash suffix (—) as a visual terminal. Appears at the top of content sections with 64px top padding from the previous section.

### Navigation Icon Button
**Role:** Account, cart, and utility icons in the header

No background, no border. Icon only at 20-24px, stroke weight 1.5px, color #1a211e. 8px padding around clickable area. No hover state with background fill — the icon darkens slightly on interaction.

## Do's and Don'ts

### Do
- Use the Exposure-style serif italic only for hero and section-display headlines at 48px or larger; never for body, UI labels, or anything below 40px.
- Set body text in Geist 400 at 16px with 1.5 line-height; reserve Geist 600/700 for product names and inline emphasis only.
- Use bryant 700 uppercase with positive tracking (0.038em at 14px, 0.057em at 16px) for every navigation label, button, and eyebrow text — never set bryant in mixed case.
- Alternate between white (#ffffff) and near-black (#0c0c0c or #1a211e) full-bleed sections to create editorial split layouts; never use both tones within a single product card or form.
- Maintain 8px border-radius for all cards and product images, 4px for all buttons, inputs, and nav elements, and 9999px for all badges and filter pills.
- Use #cc2e39 Ember Red only for single-instance emphasis (a sale indicator, urgency badge, or brand punctuation); never apply it to standard buttons, links, or repeated UI elements.
- Keep product cards borderless and shadowless — separate them from the canvas with 24px+ whitespace, not with containers or elevation.

### Don't
- Do not introduce colored backgrounds for buttons, cards, or section panels — the system is deliberately monochromatic with black/white/gray only.
- Do not add box-shadow or drop-shadow to any element; the design relies on flat color contrast and hairline borders for separation.
- Do not set body or UI text in the Exposure serif — it is a display face only and loses legibility below 32px.
- Do not use mixed case with the bryant font; it is designed for compressed uppercase labels and reads as a different typeface in lowercase.
- Do not place the full-color Ember Red on more than one element per viewport; its power comes from scarcity in a grayscale system.
- Do not use rounded corners larger than 8px on cards or images, and never apply 32px or 9999px radius to anything other than buttons and badges respectively.
- Do not center-align body copy or product descriptions — the layout language is left-aligned and editorial, with centered alignment reserved for hero headlines and section labels only.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#ffffff` | Primary page background for product grids, content sections, and the right side of split layouts |
| 1 | Soft Card | `#eef1f0` | Contained component backgrounds, input fields, secondary buttons — subtle lift from canvas |
| 2 | Hairline | `#e0e0e0` | Divider lines and border separators between sections and cards |
| 3 | Deep Panel | `#0c0c0c` | Full-bleed dark sections, hero panels, image overlays — dramatic contrast zones |

## Elevation

The design intentionally avoids all shadows and elevation effects. Separation between elements is achieved through flat color contrast (white vs near-black panels), hairline 1px borders in #e0e0e0 or #cccfcd, and generous whitespace. There is no z-axis in this system — everything sits on a single plane, and depth is implied by tone rather than by offset or blur.

## Imagery

Product photography dominates the visual language: bags, slings, and camera gear shot on pure white backgrounds with no lifestyle context, lit to show material texture and hardware details. Lifestyle imagery appears only in full-bleed editorial sections (e.g., hands holding cameras in a circle) and occupies the full viewport width on one side of a split panel. Images have no border-radius in hero contexts (flush to edges) and 8px radius in card contexts. No illustrations, no abstract graphics, no icon illustrations beyond functional UI icons. The product IS the hero — the photography is studio-grade, consistent angle, consistent lighting, consistent white ground, and the UI steps back to let the objects speak.

## Layout

Full-bleed page sections that alternate between white and near-black, each section spanning the full viewport width with no max-width constraint at the section level. Content within sections is max-width ~1440px and centered. The dominant hero pattern is a 50/50 split: text block (eyebrow + display headline + subtext + buttons) on one side, full-bleed product or lifestyle image on the other. Below the fold, product grids use 4 columns of equal-width product cards with generous 24-32px gaps. Category filter bars sit directly below the main nav as a horizontal row of pill chips. Section rhythm is defined by alternating light/dark bands with 80px vertical padding between sections, creating an editorial magazine cadence. Navigation is a sticky top bar with a thin announcement strip above it.

## Agent Prompt Guide

**Quick Color Reference**
- text: #1a211e
- background: #ffffff
- dark panel: #0c0c0c
- border: #e0e0e0
- muted text: #606562
- accent: #cc2e39 (rare emphasis only)
- primary action: no distinct CTA color

**Example Component Prompts**

1. **Hero Split Panel**: Full-viewport-width section, 50/50 split. Left half: #0c0c0c background, vertical-center aligned. Eyebrow text in bryant 700 14px white uppercase, letter-spacing 0.91px, margin-bottom 8px. Display headline in Exposure-style serif italic 56px #ffffff, letter-spacing -1.4px, line-height 1.10, max-width 480px. Subtext in Geist 400 16px white, 12px margin-top. Right half: full-bleed product image, no border-radius, object-fit cover, flush to viewport edge.

2. **Product Grid Card**: White background, no border, no shadow. Product image at top with 8px border-radius, aspect-ratio 1:1. 'New' badge: absolute top-left 8px from edge, #4e4e4e fill, bryant 700 12px white text, padding 2px 8px, 9999px radius. Below image, 12px gap, then product title in Geist 400 16px #1a211e. 4px gap, brand label 'Kelp' in Geist 400 14px #606562. 4px gap, price in Geist 400 16px #1a211e.

3. **Outlined Hero Button**: Transparent fill, 1px #ffffff border, 4px radius. Padding 12px 20px. Text: bryant 700 16px uppercase in #ffffff, letter-spacing 0.91px. No hover state changes background — only opacity shifts to 0.85.

4. **Category Filter Pill (Active)**: #1a211e background, no border, 9999px radius, padding 8px 20px. Text: bryant 700 14px white uppercase, letter-spacing 0.53px. Inactive variant: transparent background, 1px #cccfcd border, text in #363537.

5. **Search Field**: Full-width within nav, height 40px. #eef1f0 background, 1px #cccfcd border, 4px radius. Left padding 36px for icon. Magnifying glass icon 16px in #606562, absolute left 12px. Placeholder text in Geist 400 14px #606562.

## Editorial Section Patterns

Peak Design's layout language follows three repeating section archetypes: (1) Split hero — 50/50 dark-left/text + light-right/image, with the display serif doing the work; (2) Product carousel — horizontal row of 4 product cards under a left-aligned display heading, with pagination dots below; (3) Manifesto blocks — centered or left-aligned display serif text on white, with optional em-dash terminal, followed by a single ghost or outlined button. Every full-bleed section alternates polarity (white → black → white) to maintain editorial rhythm. No section uses a gradient, image overlay with text, or colored background.

## Similar Brands

- **Aesop** — Same restrained editorial typography with serif display + clean sans body, monochromatic warm-neutral palette, generous whitespace, and product photography on pure backgrounds
- **Mismo** — Same premium bag/accessories commerce aesthetic with split hero sections, condensed uppercase nav labels, and near-monochrome palette with black hero panels
- **Bellroy** — Same product-grid-first commerce layout with flat product cards, hairline borders, compressed sans nav, and alternating light/dark section bands
- **Muji** — Same flat-shaded minimalism with no shadows or gradients, typographic hierarchy as the only visual structure, and a system where whitespace does the work of decoration

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-carbon-ink: #1a211e;
  --color-paper-white: #ffffff;
  --color-true-black: #000000;
  --color-obsidian: #0c0c0c;
  --color-fog: #eef1f0;
  --color-mist: #e0e0e0;
  --color-graphite: #606562;
  --color-ash-border: #cccfcd;
  --color-slate: #363537;
  --color-pewter: #4e4e4e;
  --color-ember-red: #cc2e39;

  /* Typography — Font Families */
  --font-geist: 'Geist', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-exposure-style-serif-exposure-10: 'Exposure-style serif (Exposure-10)', ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
  --font-bryant-style-condensed-sans-bryant: 'Bryant-style condensed sans (bryant)', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-geist-mono: 'Geist Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-exposure-10: 'Exposure-10', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1;
  --text-button-label: 16px;
  --leading-button-label: 1.1;
  --tracking-button-label: 0.91px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: 0.91px;
  --text-heading: 32px;
  --leading-heading: 1.2;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.1;
  --tracking-heading-lg: -1.2px;
  --text-display: 80px;
  --leading-display: 1.1;
  --tracking-display: -2px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

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
  --spacing-64: 64px;

  /* Layout */
  --page-max-width: 1440px;
  --section-gap: 80px;
  --card-padding: 24px;
  --element-gap: 24px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-3xl: 32px;
  --radius-full: 9999px;

  /* Named Radii */
  --radius-nav: 4px;
  --radius-cards: 8px;
  --radius-badges: 9999px;
  --radius-images: 8px;
  --radius-inputs: 4px;
  --radius-buttons: 4px;
  --radius-buttonsrounded: 32px;

  /* Surfaces */
  --surface-canvas: #ffffff;
  --surface-soft-card: #eef1f0;
  --surface-hairline: #e0e0e0;
  --surface-deep-panel: #0c0c0c;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-carbon-ink: #1a211e;
  --color-paper-white: #ffffff;
  --color-true-black: #000000;
  --color-obsidian: #0c0c0c;
  --color-fog: #eef1f0;
  --color-mist: #e0e0e0;
  --color-graphite: #606562;
  --color-ash-border: #cccfcd;
  --color-slate: #363537;
  --color-pewter: #4e4e4e;
  --color-ember-red: #cc2e39;

  /* Typography */
  --font-geist: 'Geist', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-exposure-style-serif-exposure-10: 'Exposure-style serif (Exposure-10)', ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
  --font-bryant-style-condensed-sans-bryant: 'Bryant-style condensed sans (bryant)', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-geist-mono: 'Geist Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-exposure-10: 'Exposure-10', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1;
  --text-button-label: 16px;
  --leading-button-label: 1.1;
  --tracking-button-label: 0.91px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: 0.91px;
  --text-heading: 32px;
  --leading-heading: 1.2;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.1;
  --tracking-heading-lg: -1.2px;
  --text-display: 80px;
  --leading-display: 1.1;
  --tracking-display: -2px;

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
  --spacing-64: 64px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-3xl: 32px;
  --radius-full: 9999px;
}
```
