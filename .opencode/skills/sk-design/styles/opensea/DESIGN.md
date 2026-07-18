# OpenSea — Style Reference
> Black trading terminal with frosted blue wireframes.

**Theme:** dark

OpenSea runs on a near-black canvas with paper-white text and a single cool blue accent (#83c3ff) that signals links, verified badges, and outlined interactive elements. Surfaces are stratified in tiny tonal steps (#080809 → #141415 → #1b1d1f → #26272d) so cards appear to float on the page through hairline inset white-alpha rings (rgba(255,255,255,0.08)) rather than drop shadows. Typography is restrained: gtAmerica at 12–16px for almost everything, with 20–32px reserved for section headers, and gtAmericaMono stepping in for prices, addresses, and numeric data. The layout is a three-pane shell — slim left icon rail, fluid center content, fixed right sidebar — and the rhythm stays dense, with 8–12px gutters and 4px/8px corner radii throughout.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Ice Signal | `#83c3ff` | `--color-ice-signal` | Verified badges, link text, outlined button borders, focus rings, and filter pills — the only chromatic accent on a monochrome canvas, cool enough to read as informational rather than promotional |
| Paper White | `#ffffff` | `--color-paper-white` | Primary text, icon strokes, hairline borders, and checkbox fills — the dominant surface signal against the near-black canvas |
| Fog | `#acadae` | `--color-fog` | Muted secondary text, placeholder copy, and subtle borders — the bridge tone between paper white and the dark surfaces |
| Iron | `#34353c` | `--color-iron` | Outlined button borders and tertiary dividers on the main canvas — the lightest neutral that still reads as a structural edge |
| Slate | `#3c3d40` | `--color-slate` | Hover-state surface wash on icons and small controls, lightest elevated background in the stack |
| Graphite | `#26272d` | `--color-graphite` | Navigation rail, footer, and elevated panel backgrounds — one step above the page surface |
| Charcoal | `#1b1d1f` | `--color-charcoal` | Page canvas and card surface — the dominant background under all content |
| Obsidian | `#141415` | `--color-obsidian` | Top navigation bar and footer base — the deepest layer of the surface stack |
| Void | `#080809` | `--color-void` | Body backdrop, outer page shell, and deepest shadow zone behind the nav |

## Tokens — Typography

### gtAmerica — Primary UI typeface — body copy, labels, nav items, buttons, and section headings from 12px through 32px, weight 500 reserved for labels and emphasized links, weight 400 for body and headings · `--font-gtamerica`
- **Substitute:** Inter
- **Weights:** 400, 500
- **Sizes:** 12, 14, 16, 20, 32
- **Line height:** 1.25, 1.5
- **Role:** Primary UI typeface — body copy, labels, nav items, buttons, and section headings from 12px through 32px, weight 500 reserved for labels and emphasized links, weight 400 for body and headings

### gtAmericaMono — Monospaced data typeface — ETH/USDC floor prices, token counts, contract-style strings, and any numeric value that must align column-to-column · `--font-gtamericamono`
- **Substitute:** JetBrains Mono
- **Weights:** 400, 500
- **Sizes:** 12, 14, 16
- **Line height:** 1.0, 1.25, 1.5
- **Role:** Monospaced data typeface — ETH/USDC floor prices, token counts, contract-style strings, and any numeric value that must align column-to-column

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.5 | — | `--text-caption` |
| body | 14px | 1.5 | — | `--text-body` |
| heading-sm | 20px | 1.25 | — | `--text-heading-sm` |
| heading-lg | 32px | 1.25 | — | `--text-heading-lg` |

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
| 32 | 32px | `--spacing-32` |
| 48 | 48px | `--spacing-48` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 4px |
| cards | 8px |
| icons | 4px |
| inputs | 4px |
| buttons | 4px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| subtle | `rgba(255, 255, 255, 0.08) 0px 0px 0px 1px inset` | `--shadow-subtle` |
| subtle-2 | `rgba(0, 0, 0, 0.03) 0px 1px 2px 0px` | `--shadow-subtle-2` |

### Layout

- **Page max-width:** 1440px
- **Section gap:** 48px
- **Card padding:** 12px
- **Element gap:** 8px

## Components

### Top Search Bar
**Role:** Global search and quick navigation

Full-width 40px-tall bar on the Obsidian (#141415) nav band. Contains a left-aligned search input with leading magnifier icon, placeholder 'Search OpenSea' in Fog (#acadae), and a trailing slash kbd hint. Trailing slot holds a connected wallet button and account avatar circle (32px). No visible border below — flush against the main canvas.

### Left Icon Rail
**Role:** Persistent primary navigation

Fixed 56px-wide vertical strip on the Void (#080809) left edge. Icon-only buttons (24px) stacked at 8px gaps, active item indicated by a 2px left accent bar in Ice Signal (#83c3ff) and a 4px radius background wash of Slate (#3c3d40). Bottom cluster holds settings, theme toggle, and user avatar.

### Filter Pill Bar
**Role:** Category and trait filtering

Horizontal row of outlined pills below the search bar on the main canvas. Pills are 28px tall, 4px radius, 1px border in Iron (#34353c), Paper White text at 14px weight 500, 10px horizontal padding. A trailing 'All' pill with leading chain-icon dots in Ice Signal, Emerald, Vermilion, and Violet acts as network selector.

### Featured Collection Card
**Role:** Hero card promoting a curated collection

8px radius, 12px padding over Charcoal (#1b1d1f) surface. A 1px inset ring (rgba(255,255,255,0.08)) defines the edge. Card header shows a 56×56 circular collection avatar (top-left) overlapping a 4:3 cover image that fills the card width. Title 20px weight 500, verified check in Ice Signal. Sub-line shows floor price in gtAmericaMono 14px with currency suffix in Fog.

### Floor Price Sidebar Item
**Role:** Compact collection row with live floor

Right-rail list item, 48px tall, 4px radius on hover (Slate wash). 28px square avatar at left, collection name 14px weight 500 truncated to one line, Ice Signal verified dot trailing. Right column stacks ETH/USDC price in gtAmericaMono 14px over a percent change line (10px, Paper White for positive, Vermilion tint for negative). Dividers are 1px Iron (#34353c) between rows.

### Trending Token Card
**Role:** Dense data card for active tokens

Small card on Charcoal surface, 8px radius, 12px padding, 1px inset white-alpha ring. 32px token avatar top-left, token name 14px weight 500 with Ice Signal dot, price line in gtAmericaMono 14px followed by a percent delta in 10px (custom-tinted positive/negative). Equal-width 3-column grid across the section.

### Outlined Action Button
**Role:** Primary interactive control

Ghost/outline style: 1px border in Ice Signal (#83c3ff) on the Charcoal canvas, Paper White text at 14px weight 500, 4px corner radius, 10px vertical / 16px horizontal padding. Hover lifts the border to full Paper White. No filled-blue variant — the only filled button is the wallet-connect at top right.

### Wallet Connect Pill
**Role:** Account and network status

Top-right pill, 32px tall, 4px radius, Charcoal fill with 1px Iron border. Leading 16px circular network dot, gtAmericaMono 14px showing truncated address (0x…7F67), trailing chevron. On click reveals full account panel with balance, recent activity, and disconnect.

### NFT Item Tile
**Role:** Base unit for marketplace grids

Square thumbnail-first tile, 8px radius, 1px inset white-alpha ring. Image fills to a 1:1 aspect, caption band is 56px tall with title 14px weight 500 truncated, secondary line in Fog at 12px. Price chips at the bottom-right of the thumbnail overlay in a Charcoal pill with gtAmericaMono text.

### Section Header
**Role:** In-page section title with optional link

32px weight 500 Paper White heading, single line, with an optional 14px weight 500 'See all' link in Ice Signal right-aligned. 24px gap below the header to the first content row. No background — sits directly on the Charcoal canvas.

### Highlighted Drop Banner
**Role:** Featured single NFT promo

Full-width card, 8px radius, 8px padding, with a blurred background image scrimmed to ~40% opacity. Foreground holds a 72×72 artwork thumbnail, 20px weight 500 title with Ice Signal verified dot, 14px Fog subtitle, and a row of 3 small price chips (8px radius, Charcoal fill, gtAmericaMono 12px).

### Footer
**Role:** Site-wide utility links

Slim 40px band on Obsidian (#141415) anchored to the bottom. Left cluster of small text links (Aggregating, Networks, Terms of Service, Privacy Policy) in 12px Fog, separated by 1px Iron dividers. Right cluster shows live ETH/USD price in gtAmericaMono 12px, a 'Support' link, and account quick-actions. Divider above the footer is 1px Iron.

## Do's and Don'ts

### Do
- Use #83c3ff exclusively for outlined interactive elements and informational links — never as a filled button background or large decorative area.
- Define every card edge with a 1px inset white-alpha ring (rgba(255,255,255,0.08)) instead of a drop shadow; keep the 0.03 black shadow only for the faintest lift on the highest elevated surface.
- Stay in the 12–16px gtAmerica range for almost all UI text; reserve 20px and 32px for section titles and the page hero.
- Use gtAmericaMono for any value that must align in a list — prices, counts, addresses, timestamps — and keep it in the 12–14px range.
- Pair 4px radius on buttons, icons, and pills with 8px radius on cards and tiles; never use a radius larger than 8px in the main UI.
- Layer surfaces on the fixed 5-step scale (#080809 → #141415 → #1b1d1f → #26272d → #3c3d40) so hierarchy reads through tonal steps, not shadows or borders.
- Keep element gaps in the 8–12px range and section gaps at 48px to preserve the dense, terminal-like information density.

### Don't
- Don't introduce a second chromatic accent — the system is monochrome with one Ice Signal blue; any added color competes with verified and link semantics.
- Don't use filled colored buttons, gradients, or glow effects; the outlined blue action is the most chromatic element allowed.
- Don't apply drop shadows heavier than the single 1px 2px black-alpha layer — OpenSea reads as flat, not skeumorphic.
- Don't set body or link text in Fog (#acadae) when the meaning is primary — reserve Fog for placeholders, subtitles, and timestamps.
- Don't use a corner radius above 8px on any container — larger radii break the dense, utilitarian feel.
- Don't set section headings above 32px or below 20px; the 20–32px window is the system's typographic voice for hierarchy.
- Don't place paper-white text on a paper-white background or on the lightest surface (#3c3d40) without a border — contrast must always clear 12:1 for body copy.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Void | `#080809` | Outer page shell, behind the nav rail and footer |
| 1 | Obsidian | `#141415` | Top navigation bar and footer base band |
| 2 | Charcoal | `#1b1d1f` | Primary page canvas and most card surfaces |
| 3 | Graphite | `#26272d` | Navigation rail, elevated panels, and footer border zone |
| 4 | Slate | `#3c3d40` | Hover wash on small controls and the lightest elevated state |

## Elevation

- **Card:** `rgba(255, 255, 255, 0.08) 0px 0px 0px 1px inset`
- **Card (elevated):** `rgba(0, 0, 0, 0.03) 0px 1px 2px 0px`

## Imagery

Visuals are user-uploaded NFT artwork — full-bleed square or 4:3 covers, high-saturation, often painterly or generative. The UI frames these artworks with 8px radius tiles and 1px inset white-alpha rings so the chrome never competes with the pixel content. Avatars are circular 28–72px crops, always overlapping the top-left corner of a collection card. No editorial photography, no illustrations, no decorative graphics — the marketplace is the artwork. Iconography is 1.5px-stroke, 24px, outlined style, single-color Paper White that flips to Ice Signal on active/verified states.

## Layout

Three-pane shell: a 56px fixed left icon rail on Void, a flexible center content column on Charcoal capped at ~1200px, and a 320px right sidebar of floor-price lists. The hero band is a single full-width Featured Collection card with a large 4:3 cover, overlaid title, and 4-up stat strip. Below, sections stack as 'Trending Tokens' (3-column dense card grid), 'Featured Collections' (3-up card grid), and 'Featured Drops' (3-up tile grid), each separated by 48px and introduced by a 32px left-aligned section header with a right-aligned Ice Signal 'See all'. Cards within a grid share equal widths; the grid never breaks to 4 columns. The right sidebar persists across all scroll positions, scrollable independently of the center pane.

## Agent Prompt Guide

Quick Color Reference
- text: #ffffff
- background: #1b1d1f
- border: #34353c
- accent / link: #83c3ff
- muted text: #acadae
- primary action: #83c3ff (outlined action border)

Example Component Prompts
1. Section header: 'Trending Tokens' at 32px gtAmerica weight 500, #ffffff, on the #1b1d1f canvas. Below, a 3-column card grid with 12px gaps. Each card is 8px radius, 12px padding, #1b1d1f surface, 1px inset rgba(255,255,255,0.08) ring.
2. Trending Token card: 32px circular avatar top-left, token name 14px gtAmerica weight 500 #ffffff, a 4px #83c3ff dot trailing the name. Price line in 14px gtAmericaMono #ffffff, percent delta in 12px #ffffff (positive) or the same #e24756 tint (negative). 4px radius on inner chips.
3. Outlined action button: 1px border in #83c3ff, 4px radius, 10px vertical / 16px horizontal padding, 14px gtAmerica weight 500 #ffffff label, sitting on a #1b1d1f surface with no fill.
4. Floor Price sidebar row: 48px tall, 28px square avatar at left, 14px gtAmerica weight 500 #ffffff collection name with trailing #83c3ff verified dot, right column shows ETH price in 14px gtAmericaMono #ffffff over a 10px percent line. Hover swaps the row background to #3c3d40 with 4px radius.
5. Featured Collection card: 8px radius, 12px padding, #1b1d1f fill, 1px inset rgba(255,255,255,0.08) ring. A 56px circular collection avatar overlapping the top-left of a 4:3 cover image that fills the card width. Title 20px gtAmerica weight 500 #ffffff, #83c3ff verified dot, floor price in 14px gtAmericaMono #ffffff with currency in #acadae.

## Similar Brands

- **Magic Eden** — Dark canvas with the same compact three-pane marketplace shell, monospaced price columns, and a single chromatic accent reserved for verified checks and links.
- **Blur.io** — Near-black trading-terminal aesthetic, dense right-rail price lists, and hairline inset white-alpha rings instead of drop shadows for card edges.
- **Rarible** — Dark-mode NFT marketplace with small-radius cards, icon-only left rail, and one cool blue used purely for informational emphasis.
- **Coinbase Wallet Portfolio** — Obsidian-toned finance surface, Ice Signal–like accent blue, and consistent use of mono fonts for numeric data in lists.

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-ice-signal: #83c3ff;
  --color-paper-white: #ffffff;
  --color-fog: #acadae;
  --color-iron: #34353c;
  --color-slate: #3c3d40;
  --color-graphite: #26272d;
  --color-charcoal: #1b1d1f;
  --color-obsidian: #141415;
  --color-void: #080809;

  /* Typography — Font Families */
  --font-gtamerica: 'gtAmerica', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-gtamericamono: 'gtAmericaMono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --text-body: 14px;
  --leading-body: 1.5;
  --text-heading-sm: 20px;
  --leading-heading-sm: 1.25;
  --text-heading-lg: 32px;
  --leading-heading-lg: 1.25;

  /* Typography — Weights */
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
  --spacing-32: 32px;
  --spacing-48: 48px;

  /* Layout */
  --page-max-width: 1440px;
  --section-gap: 48px;
  --card-padding: 12px;
  --element-gap: 8px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;

  /* Named Radii */
  --radius-tags: 4px;
  --radius-cards: 8px;
  --radius-icons: 4px;
  --radius-inputs: 4px;
  --radius-buttons: 4px;

  /* Shadows */
  --shadow-subtle: rgba(255, 255, 255, 0.08) 0px 0px 0px 1px inset;
  --shadow-subtle-2: rgba(0, 0, 0, 0.03) 0px 1px 2px 0px;

  /* Surfaces */
  --surface-void: #080809;
  --surface-obsidian: #141415;
  --surface-charcoal: #1b1d1f;
  --surface-graphite: #26272d;
  --surface-slate: #3c3d40;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-ice-signal: #83c3ff;
  --color-paper-white: #ffffff;
  --color-fog: #acadae;
  --color-iron: #34353c;
  --color-slate: #3c3d40;
  --color-graphite: #26272d;
  --color-charcoal: #1b1d1f;
  --color-obsidian: #141415;
  --color-void: #080809;

  /* Typography */
  --font-gtamerica: 'gtAmerica', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-gtamericamono: 'gtAmericaMono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --text-body: 14px;
  --leading-body: 1.5;
  --text-heading-sm: 20px;
  --leading-heading-sm: 1.25;
  --text-heading-lg: 32px;
  --leading-heading-lg: 1.25;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-48: 48px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;

  /* Shadows */
  --shadow-subtle: rgba(255, 255, 255, 0.08) 0px 0px 0px 1px inset;
  --shadow-subtle-2: rgba(0, 0, 0, 0.03) 0px 1px 2px 0px;
}
```
