# DJI — Style Reference
> aerospace black canvas with a single electric blue thrust

**Theme:** mixed

DJI presents its products like aviation reveal footage: the hero is a near-black void where the device emerges from shadow, then the rest of the site opens into a clean, light-gray editorial grid of product cards. The palette is deliberately restrained — nearly monochromatic — with one vivid blue (#0070d5) that does the work of brand recognition, active state, and the one persistent call to action. Typography is Open Sans in a wide weight range (300–600) with tight negative tracking on display sizes, giving headlines a engineered, technical feel without serif warmth. Components are minimal: pill-shaped buttons at 64px radius, flat product cards with no decorative borders, ghost links with chevrons, and an almost shadowless surface system that lets the product photography carry all visual weight.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Onyx | `#000000` | `--color-onyx` | Primary text, icons, dark hero backgrounds, footer — the dominant ink color across all UI |
| Paper | `#ffffff` | `--color-paper` | Card surfaces, nav bar, product detail panels, input fields — the lightest surface in the stack |
| Fog | `#ededed` | `--color-fog` | Page canvas behind card grids and product sections — slightly cool, lower than pure white so product imagery pops |
| Slate | `#6c7073` | `--color-slate` | Muted helper text, disabled states, secondary button borders, input placeholder |
| Graphite | `#595959` | `--color-graphite` | Body copy, secondary nav text, descriptions — the workhorse text gray that sits between headlines and helper text |
| Iron | `#303233` | `--color-iron` | Primary nav item text, section headings on light backgrounds — darker than body to anchor hierarchy |
| Ash | `#8c8c8c` | `--color-ash` | Tertiary captions, meta text, fine print |
| Carbon | `#272727` | `--color-carbon` | Footer background, dark panels — deep neutral for terminal/closing sections |
| Signal Blue | `#0070d5` | `--color-signal-blue` | Blue supporting accent for decorative details and low-frequency emphasis. |
| Indigo Steel | `#3b63a9` | `--color-indigo-steel` | Secondary link state, hover or visited variant of Signal Blue — a muted counterpart that reads as the same brand without competing for attention |

## Tokens — Typography

### Open Sans — Primary UI and content typeface across nav, body, headings, and buttons — chosen for its technical/neutral humanist character that pairs well with hardware product imagery; weight 300 on large display sizes with -0.03em tracking creates an engineered, almost aerospace-instrument feel · `--font-open-sans`
- **Substitute:** Inter, Source Sans 3, Noto Sans
- **Weights:** 300, 400, 500, 600
- **Sizes:** 12, 14, 16, 18, 20, 24, 32, 40
- **Line height:** 1.20, 1.33, 1.43, 1.50, 2.00
- **Letter spacing:** -0.03em at 40px, -0.02em at 24–32px, normal at 12–18px
- **Role:** Primary UI and content typeface across nav, body, headings, and buttons — chosen for its technical/neutral humanist character that pairs well with hardware product imagery; weight 300 on large display sizes with -0.03em tracking creates an engineered, almost aerospace-instrument feel

### Arial — Arial — detected in extracted data but not described by AI · `--font-arial`
- **Weights:** 400
- **Sizes:** 13px
- **Line height:** 1.2
- **Role:** Arial — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.5 | — | `--text-caption` |
| body-sm | 14px | 1.5 | — | `--text-body-sm` |
| body | 16px | 1.5 | — | `--text-body` |
| subheading | 20px | 1.43 | -0.02px | `--text-subheading` |
| heading-sm | 24px | 1.33 | -0.02px | `--text-heading-sm` |
| heading | 32px | 1.25 | -0.02px | `--text-heading` |
| display | 40px | 1.2 | -0.03px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 8px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 8 | 8px | `--spacing-8` |
| 16 | 16px | `--spacing-16` |
| 24 | 24px | `--spacing-24` |
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 64 | 64px | `--spacing-64` |
| 88 | 88px | `--spacing-88` |
| 112 | 112px | `--spacing-112` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 4px |
| tags | 99px |
| cards | 4px |
| inputs | 4px |
| buttons | 64px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| md | `rgba(0, 0, 0, 0.1) 0px 16px 16px 0px` | `--shadow-md` |
| md-2 | `rgba(0, 0, 0, 0.1) 0px 8px 16px 0px` | `--shadow-md-2` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 48px
- **Card padding:** 24px
- **Element gap:** 8px

## Components

### Hero Product Stage
**Role:** Full-bleed dark section introducing a new product

Black (#000000) background filling the viewport, centered display headline in white at 40px/300 weight with -0.03em tracking, subtext at 16px in #ededed, and a centered product render that emerges from the black with edge lighting. Includes a ghost outlined 'Leer más' button below the copy.

### Tienda Shop Button
**Role:** Persistent primary navigation CTA

Filled pill button with #0070d5 background, white text, 64px border-radius, approximately 8px 24px padding, Open Sans 14px/500. Sits at the right edge of the nav bar and is the only consistently chromatic action element on the site.

### Ghost Read-More Button
**Role:** Secondary text-style action with chevron

Transparent background, 1px solid white border in dark hero contexts (or #303233 in light contexts), 64px radius, white/dark text, chevron glyph after label. Used for 'Leer más', 'Comprar', 'Reservar' — all non-critical navigation actions.

### Product Card
**Role:** Product showcase tile in grid layouts

White (#ffffff) surface on Fog (#ededed) canvas, 4px corner radius, 24px internal padding, centered category label at 12px in Slate, product name at 24px/600 in Iron, short descriptor at 14px in Graphite, and a centered product image below. No border, no shadow — relies on background contrast alone.

### Category Tabs / Nav Items
**Role:** Horizontal navigation in the header

Inline text links in Open Sans 14px/500 in Iron (#303233), separated by 24px horizontal gap, 4px bottom padding with active indicator line. No background fills — active state shown by weight shift to 600 or color shift to Signal Blue.

### Language Selector
**Role:** Region/language picker in nav

Pill-shaped ghost control with globe icon and 'España' label, #303233 text, 1px border, 99px radius, 4px 12px padding.

### Full-Bleed Carousel Banner
**Role:** Large promotional image with overlaid headline

Edge-to-edge photographic background (landscape/scene imagery), large white display headline overlaid at 32–40px/300 with -0.02em tracking, ghost outlined 'Leer más' and 'Reservar' buttons beneath. Previous/next chevron controls on the left and right edges.

### Floating Action Buttons
**Role:** Persistent utility controls (support, chat)

Circular white buttons, ~48px diameter, with 1px border in #ededed, positioned fixed to the right edge. Blue accent (#0070d5) applied to the support icon background for the chat variant.

### Top Promo Bar
**Role:** Dismissable announcement strip

Centered single line of body-sm text in Iron on white, 8px vertical padding, with a close (×) icon on the right. Links within the bar use Signal Blue with an inline chevron.

### Footer
**Role:** Terminal site navigation and legal

Carbon (#272727) background, white text at 14px, multi-column link grid, Open Sans 400 for links and 600 for column headings. Generous 48px internal padding.

### Input Field
**Role:** Search and form inputs

White background, 1px border in Slate (#6c7073), 4px corner radius, 12px 16px padding, Open Sans 14px in Iron for value, Graphite for placeholder.

### Icon
**Role:** UI iconography (search, account, cart, support)

Stroke-based line icons at 20px, 1.5px stroke weight, single-color in Iron (#303233) by default, shifting to Signal Blue when interactive. No filled variants.

## Do's and Don'ts

### Do
- Use #0070d5 only for the persistent shop button, active nav indicators, and in-text links — do not introduce additional accent colors
- Use the dark hero pattern (#000000 full-bleed with white display text) for any product reveal or campaign landing
- Apply 64px border-radius to all buttons and tags to maintain the pill geometry that defines DJI's control shape
- Use Open Sans weight 300 with -0.03em letter-spacing for all display sizes 32px and above
- Let the Fog (#ededed) canvas separate white product cards without borders or shadows — do not add card outlines
- Apply 8px vertical spacing as the base element gap, scaling to 16px between card rows and 48px between sections
- Reserve shadow (rgba(0,0,0,0.1) 0px 8–16px 16px) exclusively for the sticky nav and floating overlays

### Don't
- Do not use Signal Blue for body copy, headings, or large background areas — it must remain a small functional accent
- Do not add decorative borders or heavy shadows to product cards — the 4px radius with no border is the signature
- Do not use a chromatic background for full-page sections other than the dark hero and footer
- Do not use serif, display, or decorative typefaces — Open Sans at 300–600 is the only family
- Do not introduce semantic colors (green/red/yellow) for status indicators unless a real product flow requires them
- Do not use sharp 0px or large 16px+ radii on buttons — the 64px pill is non-negotiable for brand consistency
- Do not apply gradients to backgrounds, buttons, or cards — the system is strictly flat

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Hero Void | `#000000` | Full-bleed dark stage for product reveal — product silhouettes emerge from pure black with edge lighting |
| 1 | Page Canvas | `#ededed` | Default body background behind grids and content sections |
| 2 | Card Surface | `#ffffff` | Product cards, detail panels, nav bar — lifted from canvas by brightness alone, not shadow |
| 3 | Footer | `#272727` | Terminal dark band at the bottom of long pages |

## Elevation

- **Navigation bar (sticky):** `rgba(0, 0, 0, 0.1) 0px 8px 16px 0px`
- **Floating nav elements / overlays:** `rgba(0, 0, 0, 0.1) 0px 16px 16px 0px`

## Imagery

Imagery is hero-grade product photography on neutral backgrounds: the hero uses edge-lit device renders emerging from black, while the product grid uses clean three-quarter-angle product shots on white seamless backdrops. Lifestyle and scene photography (snow landscapes, aerial environments) appears in full-bleed carousel banners as aspirational context, not as UI decoration. No illustration, no 3D abstractions, no icon-as-decoration. Icons are minimal 1.5px stroke line icons for nav utility only. The visual language says: the product IS the brand — everything else is a quiet stage.

## Layout

Max-width 1200px centered content lane with full-bleed sections extending beyond. The page rhythm alternates: (1) full-bleed dark hero with centered display copy, (2) 2×2 product card grid on Fog canvas with generous 48px gaps, (3) full-bleed photographic carousel with overlaid headline, (4) 2×2 or 3-column category grid. The sticky nav bar is a single horizontal row with the DJI wordmark left, category links centered, and utility icons + the blue Tienda button right. No sidebar, no mega-menu in the visible flow — navigation is strictly horizontal. Content density shifts from sparse (hero, carousel) to compact (product grid) but never feels cluttered.

## Agent Prompt Guide

Quick Color Reference:
- text: #000000 (primary) / #303233 (nav) / #595959 (body) / #6c7073 (helper)
- background: #ffffff (cards/nav) / #ededed (page canvas) / #000000 (hero) / #272727 (footer)
- border: #6c7073 (inputs/secondary) / #ededed (dividers)
- accent/link: #0070d5
- primary action: no distinct CTA color

Example Component Prompts:
1. Build a product card: white surface (#ffffff) on Fog (#ededed) canvas, 4px radius, 24px padding. Category label at 12px Open Sans in #6c7073, product name at 24px weight 600 in #303233, descriptor at 14px in #595959, centered product image below the copy. No border, no shadow.
2. Build the sticky nav: white (#ffffff) background, 1px bottom border in #ededed, Open Sans 14px weight 500 nav links in #303233 separated by 24px gaps, DJI wordmark left, Signal Blue (#0070d5) pill button with 64px radius and white 14px weight 500 text at the right edge.
3. Build a hero section: full-bleed #000000 background, centered display headline in white Open Sans 40px weight 300 with -0.03em letter-spacing, 16px subtext in #ededed below, and a ghost outlined button (1px white border, 64px radius, white text) with a chevron glyph.
4. Build a category grid: Fog (#ededed) canvas, 2×2 grid of white cards with 4px radius and 24px internal padding, 48px gap between cards, each card containing a centered product image, a 24px weight 600 title in #303233, and a 14px #595959 description.
5. Build a footer: #272727 background, white text at 14px Open Sans 400, multi-column link grid with 48px internal padding, column headings at 14px weight 600.

## Gradient System

The system intentionally avoids gradients. All surfaces are flat solid colors. The visual depth hierarchy is achieved through tonal value (black hero → fog canvas → white cards) and generous spacing, never through color transitions or overlays.

## Similar Brands

- **Apple** — Same dark-hero-into-light-grid rhythm and product-as-hero photography style, with a single restrained accent color used sparingly across an otherwise monochrome palette
- **GoPro** — Shares the action-camera product grid pattern with full-bleed lifestyle imagery, neutral canvas, and a single blue interactive accent
- **Garmin** — Comparable product-card density on a cool-gray canvas with pill-shaped buttons and minimal decorative chrome
- **Sony Electronics** — Similar editorial product grid with dramatic dark hero reveals, flat white cards, and a quietly chromatic link/CTA accent

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-onyx: #000000;
  --color-paper: #ffffff;
  --color-fog: #ededed;
  --color-slate: #6c7073;
  --color-graphite: #595959;
  --color-iron: #303233;
  --color-ash: #8c8c8c;
  --color-carbon: #272727;
  --color-signal-blue: #0070d5;
  --color-indigo-steel: #3b63a9;

  /* Typography — Font Families */
  --font-open-sans: 'Open Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 20px;
  --leading-subheading: 1.43;
  --tracking-subheading: -0.02px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.33;
  --tracking-heading-sm: -0.02px;
  --text-heading: 32px;
  --leading-heading: 1.25;
  --tracking-heading: -0.02px;
  --text-display: 40px;
  --leading-display: 1.2;
  --tracking-display: -0.03px;

  /* Typography — Weights */
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;

  /* Spacing */
  --spacing-unit: 8px;
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-88: 88px;
  --spacing-112: 112px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 48px;
  --card-padding: 24px;
  --element-gap: 8px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-full: 60px;
  --radius-full-2: 64px;
  --radius-full-3: 99px;
  --radius-full-4: 1408px;

  /* Named Radii */
  --radius-nav: 4px;
  --radius-tags: 99px;
  --radius-cards: 4px;
  --radius-inputs: 4px;
  --radius-buttons: 64px;

  /* Shadows */
  --shadow-md: rgba(0, 0, 0, 0.1) 0px 16px 16px 0px;
  --shadow-md-2: rgba(0, 0, 0, 0.1) 0px 8px 16px 0px;

  /* Surfaces */
  --surface-hero-void: #000000;
  --surface-page-canvas: #ededed;
  --surface-card-surface: #ffffff;
  --surface-footer: #272727;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-onyx: #000000;
  --color-paper: #ffffff;
  --color-fog: #ededed;
  --color-slate: #6c7073;
  --color-graphite: #595959;
  --color-iron: #303233;
  --color-ash: #8c8c8c;
  --color-carbon: #272727;
  --color-signal-blue: #0070d5;
  --color-indigo-steel: #3b63a9;

  /* Typography */
  --font-open-sans: 'Open Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 20px;
  --leading-subheading: 1.43;
  --tracking-subheading: -0.02px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.33;
  --tracking-heading-sm: -0.02px;
  --text-heading: 32px;
  --leading-heading: 1.25;
  --tracking-heading: -0.02px;
  --text-display: 40px;
  --leading-display: 1.2;
  --tracking-display: -0.03px;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-88: 88px;
  --spacing-112: 112px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-full: 60px;
  --radius-full-2: 64px;
  --radius-full-3: 99px;
  --radius-full-4: 1408px;

  /* Shadows */
  --shadow-md: rgba(0, 0, 0, 0.1) 0px 16px 16px 0px;
  --shadow-md-2: rgba(0, 0, 0, 0.1) 0px 8px 16px 0px;
}
```
