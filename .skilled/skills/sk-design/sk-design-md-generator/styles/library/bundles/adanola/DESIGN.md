# Adanola — Style Reference
> Editorial lookbook on white paper. A fashion editorial spread where typography and photography breathe across clean white surfaces, with black ink for type and a whisper-thin custom sans-serif (Favorit) carrying the entire brand voice.

**Theme:** light

Adanola is a gallery-like fashion canvas where the product photography is the entire visual language and the UI almost disappears. The interface is near-monochrome — white surfaces, black text, and a single thin sans-serif typeface (Favorit) — letting the color of the garments themselves become the only chromatic accent on most pages. Components are deliberately lightweight: no shadows, no gradients, no decorative borders, just hairline rules, ghost outlines on primary actions, and 4px corner radii that read as crisp rather than soft. Spacing is compact and consistent (4px base), but the generous whitespace around imagery creates a calm, editorial rhythm that treats every product shot as a full-bleed editorial spread. The overall feel is closer to a high-end print lookbook than a typical e-commerce grid.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Carbon Ink | `#000000` | `--color-carbon-ink` | Primary text, filled action buttons, icon strokes, hairlines — the dominant ink across the entire interface |
| Paper White | `#ffffff` | `--color-paper-white` | Page canvas, card surfaces, text on dark fills, image backgrounds |
| Soft Mist | `#e5e7eb` | `--color-soft-mist` | Subtle surface alternation, disabled states, skeleton backgrounds, light dividers |
| Warm Fog | `#f0efe7` | `--color-warm-fog` | Off-white surface variant for subtle banding between product rows and editorial sections |
| Blush Sand | `#f5ebd5` | `--color-blush-sand` | Warm cream surface for editorial highlight sections and seasonal accents |
| Smoke Charcoal | `#333333` | `--color-smoke-charcoal` | Secondary text, input borders, subdued UI chrome |
| Onyx | `#1d1d1d` | `--color-onyx` | Dark borders and separators for elevated surfaces and inverted UI. Do not promote it to the primary CTA color |
| Stone Gray | `#cccccc` | `--color-stone-gray` | Placeholder backgrounds, image placeholder fills, neutral swatch defaults |
| Slate | `#2f3440` | `--color-slate` | Cool charcoal for product photography backgrounds and muted editorial surfaces |
| Olive Drab | `#636355` | `--color-olive-drab` | Warm muted surface for product photography contexts |
| Maroon Clay | `#523037` | `--color-maroon-clay` | Warm muted surface for product photography contexts |
| Deep Iris | `#222845` | `--color-deep-iris` | Cool muted surface for product photography contexts |
| Pewter | `#677284` | `--color-pewter` | Cool gray for product photography contexts |
| Driftwood | `#dfccbe` | `--color-driftwood` | Warm beige for product photography contexts |
| Pale Tide | `#badce4` | `--color-pale-tide` | Cool pastel surface for editorial accent sections |

## Tokens — Typography

### Favorit — Brand and UI typeface — used across all navigation, headings, body, buttons, inputs, and product cards. Custom monoline sans-serif with tight tracking (0.025em). Substitutes: Inter, Söhne, or Neue Haas Grotesk. The whisper-weight 400 at 30px for hero headlines is a signature choice — most fashion sites use display serifs or bold weights, but Adanola's regular-weight headlines in a clean sans feel like editorial captions rather than advertising slogans. · `--font-favorit`
- **Substitute:** Inter
- **Weights:** 400, 500, 700
- **Sizes:** 9, 12, 14, 16, 20, 30
- **Line height:** 1.00, 1.20, 1.33, 1.40
- **Letter spacing:** 0.025em
- **OpenType features:** `"ss01" on, "cv11" on`
- **Role:** Brand and UI typeface — used across all navigation, headings, body, buttons, inputs, and product cards. Custom monoline sans-serif with tight tracking (0.025em). Substitutes: Inter, Söhne, or Neue Haas Grotesk. The whisper-weight 400 at 30px for hero headlines is a signature choice — most fashion sites use display serifs or bold weights, but Adanola's regular-weight headlines in a clean sans feel like editorial captions rather than advertising slogans.

### Nunito Sans — Secondary fallback for form inputs and minor chrome elements · `--font-nunito-sans`
- **Substitute:** Nunito Sans
- **Weights:** 400, 700
- **Sizes:** 12
- **Line height:** 1.20
- **Role:** Secondary fallback for form inputs and minor chrome elements

### Arial — System fallback for legacy email and content blocks · `--font-arial`
- **Substitute:** Arial
- **Weights:** 400
- **Sizes:** 14
- **Line height:** 1.20
- **Role:** System fallback for legacy email and content blocks

### swym-font — swym-font — detected in extracted data but not described by AI · `--font-swym-font`
- **Weights:** 400
- **Sizes:** 12px
- **Line height:** 1
- **Role:** swym-font — detected in extracted data but not described by AI

### Source Sans Pro — Source Sans Pro — detected in extracted data but not described by AI · `--font-source-sans-pro`
- **Weights:** 400
- **Sizes:** 12px
- **Line height:** 1.33
- **Role:** Source Sans Pro — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| body | 14px | 1.33 | 0.35px | `--text-body` |
| heading | 20px | 1.2 | 0.5px | `--text-heading` |
| display | 30px | 1.2 | 0.75px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** compact

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 8 | 8px | `--spacing-8` |
| 12 | 12px | `--spacing-12` |
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 0px |
| cards | 0px |
| images | 0px |
| inputs | 4px |
| buttons | 4px |

### Layout

- **Page max-width:** 1440px
- **Section gap:** 64px
- **Card padding:** 16px
- **Element gap:** 8px

## Components

### Ghost CTA Button
**Role:** Primary hero and section action (e.g. 'SHOP ACTIVE')

Transparent fill, 1px solid #000000 border, Carbon Ink text in Favorit 12px weight 500, 4px border-radius, 6px 24px padding, no shadow. The outlined treatment is the default primary action — filled black is reserved for secondary inline actions.

### Filled Quick Add Button
**Role:** Compact product-card action for adding to bag

Solid #000000 fill, white text in Favorit 12px weight 500, no visible border (or 1px matching fill), 4px border-radius, 4px 10px padding, sits at bottom-right of each product card.

### Product Card
**Role:** Grid item in product listing sections

Zero border-radius, 16px padding, white background. Image fills card width with no rounding. Below image: product name in Favorit 12px weight 400 at #000000, price directly underneath in same style. Color swatch row (small 12-16px squares) sits above the title. No card shadow or border — the image edge defines the card boundary.

### Top Navigation Bar
**Role:** Site-wide navigation header

White background, 4px vertical padding rows inside nav container, horizontal layout with left-aligned category links (SHOP, ACTIVE, SWEATS, SPRING SUMMER) in Favorit 12px weight 500, center-aligned wordmark 'ADANOLA' in Favorit 30px weight 700, right-aligned icon cluster (wishlist heart, search, account, bag). Hairline 1px bottom border in #000000.

### Announcement Bar
**Role:** Top-of-page promotional strip

Black (#000000) background, white text in Favorit 9px weight 400, centered single-line message ('FREE Standard Delivery on orders over €125'). Full-bleed width, minimal vertical padding (~4-6px).

### Category Tab Filter
**Role:** Horizontal category switcher above product grids

Text-only tabs in Favorit 12px weight 500. Active tab has #000000 background with white text and 0px border-radius (sharp rectangle). Inactive tabs are black text on white with no border. 4-6px horizontal gap between tabs. No underline or chevron indicators.

### Wishlist Heart Icon
**Role:** Save-to-favorites trigger on product cards

Small outline heart icon in top-right of each product card image, #000000 stroke, 1.5px weight, ~16px size. Fills to solid black on active/hover state. No background container — floats over image.

### Color Swatch Row
**Role:** Product colorway selector on cards

Horizontal row of 4-6 small 12x12px squares below product image, each representing a color variant. 4px gap between swatches. Outlined active swatch with 1px #000000 border, inactive swatches have no border. Colors are exact garment hues (blues, greens, grays, blacks, whites).

### Search Input
**Role:** Site search and product filtering

Underlined text input with 1px #333333 bottom border, no side borders, no background fill. Placeholder text in Favorit 12px weight 400, #333333 at 60% opacity. 4px border-radius only on the underline terminals if any rounding exists.

### Chat Widget
**Role:** Live chat and support trigger

Circular floating button bottom-right of viewport, ~48px diameter, black (#000000) fill, white speech-bubble icon centered. No shadow or elevation — flat circle. Sits above page content at all times.

### Hero Image Section
**Role:** Full-bleed editorial photography

Edge-to-edge lifestyle photography with no overlay or gradient. Centered headline 'The Ultimate staples' in white Favorit 30px weight 400 overlaid on image with 0.025em letter-spacing. Ghost CTA button centered below headline. Image aspect ratio approximately 16:6, filling the full viewport width.

### Product Grid
**Role:** Main product listing layout

4-column grid on desktop, 16-24px column gap, generous 64px row gap between sections. White background. Section heading ('New & Trending') in Favorit 20px weight 700 at top-left. Grid items are flush — no card containers, just images with metadata beneath.

### Split Editorial Section
**Role:** Two-image lifestyle feature block

Two equal-width images side by side, full-bleed, no gap or 4px gap. Each image fills 50% viewport width. No text overlay — the imagery speaks alone. White or neutral background between this section and adjacent content.

### Slide Pagination Dots
**Role:** Carousel/slider position indicator

Two small horizontal bars (~30px wide, 2px tall) centered below the hero. Active bar is #000000, inactive is #cccccc. No circular dots — uses thin rectangular bars to match the editorial-minimal tone.

## Do's and Don'ts

### Do
- Use Favorit at all UI touchpoints — navigation, buttons, product names, headings — with 0.025em letter-spacing as the brand's defining typographic fingerprint
- Set primary actions as ghost/outlined buttons (1px #000000 border, transparent fill) — filled black is reserved for compact secondary actions like Quick Add
- Keep all border-radius values at 0px for product cards, images, and tags; use 4px only for buttons and inputs — the crisp rectangular geometry is core to the editorial lookbook feel
- Let product photography provide all color on listing and editorial pages — the UI chrome should stay near-monochrome (white surfaces, black text, #e5e7eb alternation) so garment hues read as the only chromatic accents
- Use compact 4px-based spacing (4/8/16/24px) for UI elements, then break to generous 64px+ section gaps to create the calm editorial rhythm between product grids
- Anchor the product card layout to a 4-column desktop grid with images that fill card width edge-to-edge — no card containers, no shadows, no borders around product images
- Apply the black announcement bar (#000000 bg, white 9px Favorit text) as a persistent strip above the nav for promotions and shipping messages

### Don't
- Do not introduce drop shadows or box-shadow elevation on any component — the design system is deliberately flat and relies on whitespace and hairlines for separation
- Do not use saturated brand colors for buttons, links, or interactive states — keep the action palette strictly black/white/outline
- Do not round product card images or product card containers — the sharp rectangular edges are signature to the lookbook treatment
- Do not use display serifs, script fonts, or decorative typefaces for headings — the whisper-weight regular Favorit at 30px is the hero voice
- Do not add gradient backgrounds, colored section bands, or decorative patterns to page sections — alternation should be subtle (#e5e7eb, #f0efe7, #f5ebd5) at most
- Do not add icon containers, badges, or pill shapes around UI elements — tags and labels should be plain text with optional hairline underlines
- Do not use large border-radius values (8px+) on any element — the entire system is anchored to 0px and 4px radii only

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Paper White | `#ffffff` | Primary page canvas and product card background |
| 1 | Soft Mist | `#e5e7eb` | Alternate section background for visual banding |
| 2 | Warm Fog | `#f0efe7` | Off-white editorial section background |
| 3 | Blush Sand | `#f5ebd5` | Warm cream editorial highlight sections |
| 4 | Pale Tide | `#badce4` | Cool pastel editorial accent band |

## Elevation

The design system deliberately avoids shadows and elevation as a defining choice. Separation between elements is achieved through whitespace, hairline 1px borders in #000000 or #333333, and subtle surface color alternation (#e5e7eb, #f0efe7, #f5ebd5) rather than z-axis depth. The only floating element — the chat widget — uses a solid black fill rather than a shadow to stand out. This flatness reinforces the editorial print-magazine metaphor: pages sit on the surface of the screen the way photographs sit on paper.

## Imagery

Photography-dominant visual language centered on full-bleed lifestyle imagery of models in activewear. Treatment is editorial rather than commercial: models captured in candid motion (stretching, walking, mid-stride) rather than static studio poses. Color treatment is natural and unfiltered — garment colors are true-to-life without duotone or color grading. Images have zero border-radius and are not masked — raw rectangular crops that fill their containers edge-to-edge. The hero uses a wide aspect ratio (~16:6) with no overlay graphics, letting the photograph itself carry the visual weight. Product card images are clean studio shots on neutral backgrounds, tightly cropped to the garment. The overall density is image-heavy on editorial sections and grid-heavy on product listings, with text always subordinate to imagery. No illustrations, no 3D renders, no abstract graphics — photography is the only visual medium.

## Layout

Full-bleed page model with content constrained to ~1440px max-width on desktop. The hero is a full-viewport-width image with centered headline overlay and ghost CTA. Below the hero, the page alternates between product grid sections (4-column desktop grid) and editorial split-image blocks (two equal-width lifestyle photos). Navigation is a minimal top bar with a black announcement strip above it — no sticky header behavior apparent, no sidebar, no mega-menu. Category browsing uses simple horizontal tab filters above product grids rather than a full category page. The rhythm is spacious: 64px+ vertical gaps between major sections, compact 8-16px spacing within product cards. Grid usage is consistent 4-column for products, 2-column for editorial features, single-column for category navigation. No masonry, no asymmetric layouts — everything is rigidly grid-aligned to reinforce the catalog/lookbook structure.

## Agent Prompt Guide

Quick Color Reference:
- text: #000000
- background: #ffffff
- surface alternate: #e5e7eb
- border: #000000
- accent surface: #f5ebd5
- primary action: #000000 (filled action)

Example Component Prompts:
1. Create a hero section: full-bleed lifestyle photograph (no border-radius, no overlay), white text headline 'The Ultimate staples' centered in Favorit 30px weight 400 with 0.75px letter-spacing. Below the headline, a ghost CTA button: transparent fill, 1px solid #000000 border, 4px border-radius, 'SHOP ACTIVE' in Favorit 12px weight 500 #000000, 6px 24px padding.

2. Create a product grid section: 4-column grid on #ffffff background, 16px column gap, 64px row gap. Section heading 'New & Trending' in Favorit 20px weight 700 #000000 at top-left. Each card has a full-width product image (no rounding, no border), 4 color swatch squares (12x12px) below, product name in Favorit 12px weight 400 #000000, price beneath in same style, and a filled black 'Quick Add' button at bottom-right (12px text, 4px radius, 4px 10px padding).

3. Create the top navigation: white background with 1px #000000 bottom border. Black announcement bar above: #000000 fill, white Favorit 9px weight 400 centered text 'FREE Standard Delivery on orders over €125'. Nav row: left-aligned category links (SHOP, ACTIVE, SWEATS, SPRING SUMMER) in Favorit 12px weight 500 #000000, center-aligned wordmark 'ADANOLA' in Favorit 30px weight 700, right-aligned icon cluster (heart, search, person, bag) as 16px outlined icons in #000000.

4. Create a category tab filter: horizontal row of text tabs in Favorit 12px weight 500. Active tab 'HOODIES' has #000000 background with white text and 0px border-radius. Inactive tabs 'SHORTS', 'T-SHIRTS' are #000000 text on white. 6px gap between tabs. No underlines or chevrons.

5. Create a Primary Action Button: #000000 background, #ffffff text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.

## Typography Philosophy

Favorit is the sole brand voice and appears in every UI context — there is no secondary display font, no serif companion, no decorative alternate. The defining choice is using weight 400 (regular) at 30px for hero headlines: most fashion e-commerce sites push to 600-700 weight for impact, but Adanola's regular-weight headlines read as editorial captions rather than advertising copy. Combined with the tight 0.025em letter-spacing, this gives the type a monoline, almost typewriter-like quality that feels like a fashion magazine pull-quote. Body text stays at 12-14px in weight 400-500, keeping the information layer quiet so imagery dominates. The 9px size for the announcement bar is unusually small — it's meant to be read, not noticed, a functional footnote at the top of the page.

## Similar Brands

- **Aritzia** — Similar gallery-like product presentation with minimal UI chrome, photography-first editorial layouts, and compact sans-serif typography with generous whitespace
- **Gymshark** — Same activewear category with clean product grids, ghost/outline CTA buttons, and monochrome UI that lets product photography provide all color
- **Reformation** — Editorial fashion site with full-bleed lifestyle photography, minimal navigation, custom sans-serif typography, and an almost zero-shadow flat interface
- **COS** — Minimalist fashion brand with restrained UI, generous whitespace between sections, hairline borders instead of shadows, and near-monochrome palette that lets garment colors stand alone
- **Everlane** — Clean e-commerce with product-grid-first layout, transparent/outlined action buttons, compact spacing, and a deliberate absence of decorative UI elements

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-carbon-ink: #000000;
  --color-paper-white: #ffffff;
  --color-soft-mist: #e5e7eb;
  --color-warm-fog: #f0efe7;
  --color-blush-sand: #f5ebd5;
  --color-smoke-charcoal: #333333;
  --color-onyx: #1d1d1d;
  --color-stone-gray: #cccccc;
  --color-slate: #2f3440;
  --color-olive-drab: #636355;
  --color-maroon-clay: #523037;
  --color-deep-iris: #222845;
  --color-pewter: #677284;
  --color-driftwood: #dfccbe;
  --color-pale-tide: #badce4;

  /* Typography — Font Families */
  --font-favorit: 'Favorit', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-nunito-sans: 'Nunito Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-swym-font: 'swym-font', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-source-sans-pro: 'Source Sans Pro', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-body: 14px;
  --leading-body: 1.33;
  --tracking-body: 0.35px;
  --text-heading: 20px;
  --leading-heading: 1.2;
  --tracking-heading: 0.5px;
  --text-display: 30px;
  --leading-display: 1.2;
  --tracking-display: 0.75px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;

  /* Layout */
  --page-max-width: 1440px;
  --section-gap: 64px;
  --card-padding: 16px;
  --element-gap: 8px;

  /* Border Radius */
  --radius-md: 4px;

  /* Named Radii */
  --radius-tags: 0px;
  --radius-cards: 0px;
  --radius-images: 0px;
  --radius-inputs: 4px;
  --radius-buttons: 4px;

  /* Surfaces */
  --surface-paper-white: #ffffff;
  --surface-soft-mist: #e5e7eb;
  --surface-warm-fog: #f0efe7;
  --surface-blush-sand: #f5ebd5;
  --surface-pale-tide: #badce4;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-carbon-ink: #000000;
  --color-paper-white: #ffffff;
  --color-soft-mist: #e5e7eb;
  --color-warm-fog: #f0efe7;
  --color-blush-sand: #f5ebd5;
  --color-smoke-charcoal: #333333;
  --color-onyx: #1d1d1d;
  --color-stone-gray: #cccccc;
  --color-slate: #2f3440;
  --color-olive-drab: #636355;
  --color-maroon-clay: #523037;
  --color-deep-iris: #222845;
  --color-pewter: #677284;
  --color-driftwood: #dfccbe;
  --color-pale-tide: #badce4;

  /* Typography */
  --font-favorit: 'Favorit', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-nunito-sans: 'Nunito Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-swym-font: 'swym-font', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-source-sans-pro: 'Source Sans Pro', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-body: 14px;
  --leading-body: 1.33;
  --tracking-body: 0.35px;
  --text-heading: 20px;
  --leading-heading: 1.2;
  --tracking-heading: 0.5px;
  --text-display: 30px;
  --leading-display: 1.2;
  --tracking-display: 0.75px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;

  /* Border Radius */
  --radius-md: 4px;
}
```
