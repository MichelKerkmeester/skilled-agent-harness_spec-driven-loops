# Rarible — Style Reference
> blacklight crypto terminal — a midnight trading floor where a single highlighter mark signals everything that matters.

**Theme:** dark

Rarible runs on a near-black canvas punctuated by one electric chartreuse accent — a single highlighter color against a dark market terminal. The interface is dense, data-first, and overwhelmingly achromatic, with the neon yellow acting as a switch: active states, the primary login CTA, 

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Highlighter Lime | `#faff00` | `--color-highlighter-lime` | Green action color for filled buttons, selected navigation states, and focused conversion moments |
| Onyx Black | `#0a0a0a` | `--color-onyx-black` | Page canvas, table row backgrounds, elevated card surfaces — the base layer everything else floats on |
| Zinc Hairline | `#27272a` | `--color-zinc-hairline` | Borders, dividers, table cell separators, card outlines — the most-used border color, barely visible against the canvas, defining structure without weight |
| Carbon | `#18181b` | `--color-carbon` | Button hover/active surfaces, secondary card backgrounds — one step above canvas for subtle elevation |
| Pure White | `#ffffff` | `--color-pure-white` | Primary text, icon strokes, logo fills, filled-chip text — the default foreground for the entire interface |
| Steel Gray | `#9d9d9d` | `--color-steel-gray` | Secondary/muted text, inactive nav items, table metadata, helper labels |
| Ash Gray | `#6c6c6c` | `--color-ash-gray` | Tertiary text, disabled controls, low-emphasis metadata |
| Smoke | `#3b3b3b` | `--color-smoke` | Heavier borders, input field outlines — for elements that need more definition than the standard hairline |

## Tokens — Typography

### Geist Mono — Primary UI typeface — all body text, table data, buttons, inputs, navigation, prices, and metadata. The monospace choice gives the marketplace a terminal/trading-desk identity, aligning numerical data in tables and reinforcing a developer/collector audience. · `--font-geist-mono`
- **Substitute:** JetBrains Mono, IBM Plex Mono, Space Mono
- **Weights:** 400, 500
- **Sizes:** 10px, 12px, 14px, 18px, 24px
- **Line height:** 1.00–1.43
- **Letter spacing:** normal at all sizes
- **Role:** Primary UI typeface — all body text, table data, buttons, inputs, navigation, prices, and metadata. The monospace choice gives the marketplace a terminal/trading-desk identity, aligning numerical data in tables and reinforcing a developer/collector audience.

### Tomorrow — Display and section headings — section labels like 'Trending', 'Cards', 'Trusted by', and 'News'. A clean sans-serif contrast to the monospace body, giving headlines a slightly softer, more editorial voice while staying within the technical character. · `--font-tomorrow`
- **Substitute:** Inter, DM Sans, Manrope
- **Weights:** 400, 500
- **Sizes:** 14px, 18px, 24px, 28px
- **Line height:** 1.17–1.43
- **Role:** Display and section headings — section labels like 'Trending', 'Cards', 'Trusted by', and 'News'. A clean sans-serif contrast to the monospace body, giving headlines a slightly softer, more editorial voice while staying within the technical character.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 10px | 1 | — | `--text-caption` |
| body | 14px | 1.43 | — | `--text-body` |
| subheading | 18px | 1.4 | — | `--text-subheading` |
| heading | 24px | 1.29 | — | `--text-heading` |
| heading-lg | 28px | 1.17 | — | `--text-heading-lg` |

## Tokens — Spacing & Shapes

**Base unit:** 8px

**Density:** compact

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 8 | 8px | `--spacing-8` |
| 16 | 16px | `--spacing-16` |
| 24 | 24px | `--spacing-24` |
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 12px |
| pills | 9999px |
| images | 6px |
| inputs | 6px |
| buttons | 6px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| subtle | `rgba(0, 0, 0, 0.05) 0px 1px 2px 0px` | `--shadow-subtle` |
| subtle-2 | `rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.1) 0p...` | `--shadow-subtle-2` |

### Layout

- **Page max-width:** 1440px
- **Section gap:** 32px
- **Card padding:** 16px
- **Element gap:** 8px

## Components

### Header Navigation
**Role:** Top-level site navigation with search, chain selector, and auth actions

Full-width dark bar (#0a0a0a) with logo left, primary nav (Explore, Mint, Swap) in 14px Geist Mono, centered search input, and right-aligned $RARI link plus Login button. Height approx 56px, items separated by 8–12px gaps.

### Primary CTA Button (Login)
**Role:** Main conversion action in the header

Filled #faff00 background, #000000 text, 6px border-radius, approx 8px vertical × 16px horizontal padding, 14px Geist Mono weight 500. The only colored button on the page — its singularity is the point.

### Ghost Button (Go to mint page)
**Role:** Secondary action on featured collections

Transparent background, 1px #27272a border, #ffffff text, 6px radius, 8px × 16px padding, 14px Geist Mono. Sits inside cards as a quiet action.

### Chain Filter Pill
**Role:** Horizontal chain selector below the search bar

Small pill with icon + label (All, Ethereum, MegaETH, Base, RARI, More). Default state: transparent with #27272a border. Active/selected state: #faff00 background with #000000 text. Radius 9999px. Active state uses the brand lime to indicate the single selected chain.

### Featured Collection Banner
**Role:** Hero card showcasing a live minting collection

Full-width card with #0a0a0a background, 1px #27272a border, 12px radius, 16–24px padding. Contains a 'Minting now' label in #faff00, collection title in 18–24px Tomorrow, creator info, and ghost CTA button. Right side shows the collection's brand mark/avatar.

### Collection Card (Grid Item)
**Role:** Browseable NFT collection thumbnail in the cards row

Approx 200×200px tile, 6px radius, 1px #27272a border. Image fills top portion. Overlay or footer shows collection name (14px Tomorrow) and floor price in 12px Geist Mono with #9d9d9d. Cards have no shadow — only border separation.

### Trending Data Table
**Role:** Sortable list of top collections with live market data

Full-width table on #0a0a0a, row separators in #27272a, column headers in 12px Geist Mono #9d9d9d uppercase. Cell content in 14px Geist Mono #ffffff. Avatar + name column left, numeric columns right-aligned. Positive deltas in #faff00, negative in red/pink. Toggle 'List collection' button in header with time-range pill selector (1h, 6h, 24h, 7d, 30d).

### Search Input
**Role:** Central collection search in the header

Wide input with #0a0a0a background, 1px #27272a border, 6px radius, 12px × 16px padding. Placeholder 'Search collections' in #6c6c6c, 14px Geist Mono. Search icon left-aligned in #9d9d9d.

### Time-Range Pill Selector
**Role:** Compact filter for time windows on tables and charts

Row of 5 small pills: 1h, 6h, 24h, 7d, 30d. Default text #9d9d9d on transparent. Active pill has #27272a background with #ffffff text. 6px radius, compact 4px×8px padding, 12px Geist Mono.

### Brand Logo Card (Trusted By Grid)
**Role:** Partner/brand showcase tiles

2-row × 6-column grid of square tiles on #0a0a0a with 1px #27272a border, 12px radius. Logo centered in #ffffff. Logos vary from wordmarks to icon marks (base, Barbie, Paris Saint-Germain, Ubisoft, FOX Deportes, rekt, UFC, Universal, Hot Wheels, Ledger).

### News Post Card
**Role:** Content card linking to blog posts and insights

Horizontal layout: left thumbnail with colored 3D illustration, center title in 18px Tomorrow #ffffff with category tag ('INSIGHTS') in 12px Geist Mono #9d9d9d, right 'PFP PLAYBOOK' callout in #faff00. 12px card radius, hairline border.

### Crypto Ticker (Footer)
**Role:** Live crypto price display in the footer bar

Inline pill showing USD price and ETH price for $RARI. Right-aligned in the footer, 12px Geist Mono, with colored dot indicators (#faff00 for active).

### Footer Bar
**Role:** Site-wide footer with legal and links

Full-width dark bar (#0a0a0a) with 1px top border in #27272a. Left: copyright '© Rarible, Inc.' + Terms, Privacy, API in 12px Geist Mono #6c6c6c. Right: USD/Crypto toggle, price ticker, Community link.

## Do's and Don'ts

### Do
- Use #faff00 exclusively for the single primary action and active/selected states — one CTA per screen, no competing colored buttons.
- Set all UI text, table data, and button labels in Geist Mono 400/500 to preserve the terminal character; switch to Tomorrow only for section headings and display titles.
- Separate surfaces with 1px #27272a hairline borders rather than shadows — the design is deliberately flat, relying on line weight for hierarchy.
- Keep gaps tight: 8px between related elements, 16px within cards, 32px between sections. The page is data-dense, not airy.
- Use 6px radius for buttons, inputs, and thumbnails; 12px for cards and larger containers; 9999px only for pill toggles and chain selectors.
- Right-align all numeric data in tables and use #faff00 for positive percentage changes, a muted/pink tone for negative — color encodes data, not decoration.
- Default to #0a0a0a for both the page canvas and card surfaces; differentiate with border alone or step up to #18181b for interactive states.

### Don't
- Don't introduce a second accent color — the entire palette is monochrome with one chartreuse voice. Adding blue, red, or purple dilutes the identity.
- Don't apply drop shadows to cards, modals, or popovers. The system uses flat surfaces with hairline borders; elevation comes from layering, not blur.
- Don't use rounded corners above 12px on rectangular components — large radii break the technical, trading-desk feel.
- Don't set body text in a proportional sans-serif. Geist Mono is the identity; substituting Inter or system-ui erases the marketplace's distinctive character.
- Don't fill buttons with white or gray when you mean 'primary action' — only #faff00 communicates primary. Use ghost (transparent + border) for secondary.
- Don't add gradients, glassmorphism, or decorative backgrounds to content areas. The canvas is always flat #0a0a0a.
- Don't use color to indicate hover on text links — rely on underline or a subtle weight/color shift to #faff00, not background fills on inline text.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Page Canvas | `#0a0a0a` | Full-page background behind all content |
| 1 | Card / Table Surface | `#0a0a0a` | Cards and table rows share the canvas color, differentiated only by hairline borders |
| 2 | Interactive Surface | `#18181b` | Button hover/active states and secondary elevated panels |

## Elevation

- **Input fields and buttons (subtle resting shadow):** `0px 1px 2px 0px rgba(0, 0, 0, 0.05)`

## Imagery

Imagery is collection-driven: each NFT thumbnail is the hero of its card, with no lifestyle framing or context shots. Collection art varies wildly — 3D character renders (VeeFriends penguins, Pudy Penguins), abstract 3D shapes (Chromie Squiggle), flat illustrated icons, and photographic art — presented as tight square crops with no padding or shadow. Brand logos in the 'Trusted by' grid are rendered as flat white marks on the dark canvas, treating partner identities as uniform. A single news thumbnail uses a vivid magenta/pink illustration as visual contrast. The overall image strategy is 'show the asset, not the gallery': thumbnails sit edge-to-edge in their tiles, and the marketplace never editorializes the art with captions or descriptions on the index.

## Layout

Page layout is full-width and centered within a ~1440px max-width, with all content left-aligned to a consistent gutter. The hero is a single full-width featured collection banner, followed by a 6-column horizontal card grid (horizontally scrollable on narrow viewports), then a full-width trending data table, then a 6×2 brand-logo grid, and a 2-column news section. Section rhythm is consistent: each block is separated by ~32px vertical gap with no alternating background colors — the entire page is one continuous #0a0a0a canvas. Navigation is a sticky top bar with a secondary chain-filter row directly beneath it. Content density is high: tables pack 10+ rows above the fold, and card grids show 6 items per row without generous padding.

## Agent Prompt Guide

primary action: #faff00 (filled action)
Create a Primary Action Button: #faff00 background, #000000 text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.

## Similar Brands

- **OpenSea** — Same dark-canvas NFT marketplace layout with full-width data tables, collection card grids, and a high-density browse experience
- **Blur** — Matching dark-mode trading-desk aesthetic with monospaced data, compact tables, and a single vivid accent color for active states
- **Magic Eden** — Dark background with grid-based collection browsing, flat cards, and hairline-bordered tables for floor prices and volume
- **Uniswap** — Similar dark crypto-tool vocabulary — dense data tables, monospaced numeric alignment, and minimal decorative chrome
- **Zora** — Same creator-marketplace atmosphere with dark canvas, collection thumbnails as the dominant visual unit, and tabular data over decorative imagery

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-highlighter-lime: #faff00;
  --color-onyx-black: #0a0a0a;
  --color-zinc-hairline: #27272a;
  --color-carbon: #18181b;
  --color-pure-white: #ffffff;
  --color-steel-gray: #9d9d9d;
  --color-ash-gray: #6c6c6c;
  --color-smoke: #3b3b3b;

  /* Typography — Font Families */
  --font-geist-mono: 'Geist Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-tomorrow: 'Tomorrow', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1;
  --text-body: 14px;
  --leading-body: 1.43;
  --text-subheading: 18px;
  --leading-subheading: 1.4;
  --text-heading: 24px;
  --leading-heading: 1.29;
  --text-heading-lg: 28px;
  --leading-heading-lg: 1.17;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;

  /* Spacing */
  --spacing-unit: 8px;
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;

  /* Layout */
  --page-max-width: 1440px;
  --section-gap: 32px;
  --card-padding: 16px;
  --element-gap: 8px;

  /* Border Radius */
  --radius-md: 6px;
  --radius-xl: 12px;
  --radius-full: 9999px;

  /* Named Radii */
  --radius-cards: 12px;
  --radius-pills: 9999px;
  --radius-images: 6px;
  --radius-inputs: 6px;
  --radius-buttons: 6px;

  /* Shadows */
  --shadow-subtle: rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
  --shadow-subtle-2: rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.1) 0px 1px 2px -1px;

  /* Surfaces */
  --surface-page-canvas: #0a0a0a;
  --surface-card-table-surface: #0a0a0a;
  --surface-interactive-surface: #18181b;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-highlighter-lime: #faff00;
  --color-onyx-black: #0a0a0a;
  --color-zinc-hairline: #27272a;
  --color-carbon: #18181b;
  --color-pure-white: #ffffff;
  --color-steel-gray: #9d9d9d;
  --color-ash-gray: #6c6c6c;
  --color-smoke: #3b3b3b;

  /* Typography */
  --font-geist-mono: 'Geist Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-tomorrow: 'Tomorrow', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1;
  --text-body: 14px;
  --leading-body: 1.43;
  --text-subheading: 18px;
  --leading-subheading: 1.4;
  --text-heading: 24px;
  --leading-heading: 1.29;
  --text-heading-lg: 28px;
  --leading-heading-lg: 1.17;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;

  /* Border Radius */
  --radius-md: 6px;
  --radius-xl: 12px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-subtle: rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
  --shadow-subtle-2: rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.1) 0px 1px 2px -1px;
}
```
