# Runway — Style Reference
> Kraft paper ledger under amber desk lamp. Every screen should feel like opening a well-organized financial notebook: cream paper, espresso ink, one warm highlight color, no cold digital surfaces.

**Theme:** light

Runway renders a warm, paper-like financial workspace: a cream canvas (#f8f7f5) holds white card surfaces, linen-warm dividers (#e3dfd5), and deep espresso text (#261b07) that feels printed rather than rendered. A single amber accent (#f9a600) is the only chromatic signal in the interface — it marks the primary action and never decorates, giving CTAs the weight of a highlighter on a ledger page. Typography is tight and slightly humanist via the custom Interphases Pro Variable font with non-standard weights (492, 584), producing a confident density that reads like a well-set business document. Shadows are warm-tinted browns, not cool grays, so even elevation feels like layers of kraft paper rather than floating panels. The whole system communicates analytical warmth — serious about numbers, soft on the eyes.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Cream Canvas | `#f8f7f5` | `--color-cream-canvas` | Page background, hero wash, elevated card shadows — the warm paper that grounds every screen |
| Pure Paper | `#ffffff` | `--color-pure-paper` | Card surfaces, product screenshot backgrounds, button fills for ghost variants — the clean layer on top of cream |
| Linen Border | `#e3dfd5` | `--color-linen-border` | Primary divider color, card borders, section separators — warm gray that separates without cutting |
| Stone Mist | `#d5d2cd` | `--color-stone-mist` | Subtle button borders, secondary dividers — a step lighter than Linen for nested separation |
| Warm Ash | `#aca89f` | `--color-warm-ash` | Shadow tint base, muted icon strokes — warm brown undertone keeps shadows on-brand |
| Driftwood | `#8f897e` | `--color-driftwood` | Muted body text, nav borders, secondary heading borders — readable but recedes |
| Bark | `#61594a` | `--color-bark` | Body text, secondary content — warm dark gray for paragraphs and descriptions |
| Espresso | `#261b07` | `--color-espresso` | Primary text, headings, icons, nav text, footer text, top banner — deep warm black that replaces true black throughout |
| Amber Signal | `#f9a600` | `--color-amber-signal` | Yellow action color for filled buttons, selected navigation states, and focused conversion moments. |
| Burnished Gold | `#e89b01` | `--color-burnished-gold` | Yellow accent for outlined action borders, linked labels, and lightweight interactive emphasis. Do not promote it to the primary CTA color |
| Terracotta | `#f0624f` | `--color-terracotta` | Decorative accent, chart highlight, warm icon stroke — the secondary warm hue for visual punctuation |
| Wisteria | `#d5befa` | `--color-wisteria` | Soft badge background — the only cool wash in the system, used sparingly for tag differentiation |
| Honey Wash | `#f8da9d` | `--color-honey-wash` | Warm badge background — amber-tinted tag fill for status and category labels |

## Tokens — Typography

### Interphases Pro Variable — All interface text — headings, body, nav, buttons, labels. The custom variable font's non-standard mid-weight (492) and semibold (584) create a distinctive rhythm that standard 400/500/600/700 scales can't replicate. Tight tracking (-0.022em at display) makes headlines feel set rather than typed. · `--font-interphases-pro-variable`
- **Substitute:** Inter Variable (closest free alternative with similar geometric-humanist character and wide weight range)
- **Weights:** 400, 492, 584
- **Sizes:** 12px, 14px, 16px, 20px, 24px, 36px, 56px, 65px, 72px
- **Line height:** 1.00, 1.13, 1.25
- **Letter spacing:** -0.0220em at 72px, -0.0200em at 56px, -0.0170em at 36px, -0.0130em at 24px, -0.0110em at 20px, -0.0100em at 16px, 0.0500em at 12px
- **OpenType features:** `"ss01" on`
- **Role:** All interface text — headings, body, nav, buttons, labels. The custom variable font's non-standard mid-weight (492) and semibold (584) create a distinctive rhythm that standard 400/500/600/700 scales can't replicate. Tight tracking (-0.022em at display) makes headlines feel set rather than typed.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.25 | 0.6px | `--text-caption` |
| body-sm | 14px | 1.25 | -0.14px | `--text-body-sm` |
| body | 16px | 1.25 | -0.16px | `--text-body` |
| subheading-sm | 20px | 1.25 | -0.22px | `--text-subheading-sm` |
| subheading | 24px | 1.13 | -0.31px | `--text-subheading` |
| heading-sm | 36px | 1.13 | -0.61px | `--text-heading-sm` |
| heading | 56px | 1.13 | -1.12px | `--text-heading` |
| heading-lg | 65px | 1 | -1.43px | `--text-heading-lg` |
| display | 72px | 1 | -1.58px | `--text-display` |

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
| 12 | 12px | `--spacing-12` |
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 28 | 28px | `--spacing-28` |
| 30 | 30px | `--spacing-30` |
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 56 | 56px | `--spacing-56` |
| 63 | 63px | `--spacing-63` |
| 105 | 105px | `--spacing-105` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 8px |
| cards | 8px |
| badges | 4px |
| inputs | 8px |
| buttons | 8px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| sm | `color(srgb 0.14902 0.105882 0.027451 / 0.06) 0px 4px 8px 0px` | `--shadow-sm` |
| sm-2 | `color(srgb 1 1 1 / 0.56) 0px 2px 4px 0px inset, color(srg...` | `--shadow-sm-2` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 56-80px
- **Card padding:** 24-32px
- **Element gap:** 8-16px

## Components

### Amber CTA Button
**Role:** Primary action

Filled button with #f9a600 background, Espresso (#261b07) text, 8px radius, 8px 16px padding. Font: 16px Interphases weight 492. Carries a warm shadow stack: inset white highlight (rgba 255,255,255,0.56) at 0px 2px 4px, outer drop (rgba brown 0.06) at 0px 4px 8px, plus a 1px 2px shadow at 36% opacity for depth. The amber fill is the only chromatic button background in the system.

### Ghost Button
**Role:** Secondary action

Transparent background with Espresso (#261b07) text and border, 8px radius, 8px 16px padding. 1px solid border in #261b07. Same warm shadow as filled variant. Used alongside amber CTA when two actions are needed.

### Pill Nav Button (Talk to a human)
**Role:** Persistent conversion CTA in header

Amber filled (#f9a600) with Espresso text, 8px radius, 6px 12px padding. Smaller scale than hero CTA — 14px text. Appears in the top-right of every viewport.

### Dashboard Card
**Role:** Product UI container

White (#ffffff) surface on Cream Canvas (#f8f7f5) background. 8px radius, 1px Linen Border (#e3dfd5). 32px internal padding. Soft warm shadow: rgba(0.149, 0.106, 0.027, 0.06) 0px 4px 8px. Used for the entire app surface in product screenshots.

### Metric Tile
**Role:** KPI display within dashboard

White background, no border, 8px radius. Metric label in 12px caption, value in 20-24px weight 584, delta indicator in 12px. Contains a gradient line chart (blue→green gradient) in the lower portion.

### Sidebar Nav Item
**Role:** Left navigation within product UI

Transparent background default, 8px radius when active. Active state uses very subtle Linen (#e3dfd5) background fill. 14px Interphases weight 400, Espresso text. 8px 12px padding. Small icon prefix at 16px.

### Top Announcement Banner
**Role:** Site-wide promotion bar

Espresso (#261b07) background, white text, centered. 14px Interphases weight 400. Full-bleed strip above the main header. No padding beyond vertical centering — minimal height.

### G2 Trust Badge
**Role:** Social proof indicator

Inline badge with small G2 logo, 'G2.com 4.8/5 stars' text in 12px Driftwood (#8f897e). Sits left of header nav. No background or border — text-only credibility signal.

### Tag/Badge
**Role:** Category or status label

4px radius, 4px 8px padding, 12px Interphases weight 492. Background variants: Honey Wash (#f8da9d) with Espresso text, Wisteria (#d5befa) with Espresso text, or Linen (#e3dfd5) with Bark text. Compact pill-style indicators.

### AI Chat Panel
**Role:** Conversational interface overlay

White surface, 8px radius, subtle Linen border. Avatar circle (24px) with initials, message text in 14px Bark (#61594a). Input field at bottom: 8px radius, 1px Linen border, placeholder in Driftwood. Warm shadow matching dashboard cards.

### Customer Logo Strip
**Role:** Social proof section divider

Grayscale logos on Cream Canvas background. Logos rendered in Driftwood (#8f897e) or lighter to maintain monochrome rhythm. No background container — logos float on the canvas with generous vertical padding (48-64px above and below).

### Feature Icon Block
**Role:** Feature section icon + text

Small outlined icon (16-20px) in Espresso (#261b07) with 1.5px stroke. Sits above a heading-sm title and body description. 16px gap between icon and title, 8px between title and body. Left-aligned in text columns.

### Section Divider
**Role:** Horizontal rule between content blocks

1px solid Linen Border (#e3dfd5), full-width or constrained to content max-width. Used sparingly — most sections transition via whitespace alone.

## Do's and Don'ts

### Do
- Use #f9a600 (Amber Signal) as the ONLY filled chromatic button background — no other color gets a fill button treatment
- Set all text in Interphases Pro Variable (or Inter Variable substitute) at the defined weight stops: 400 for body, 492 for emphasis and buttons, 584 for headings and display
- Use Espresso (#261b07) for all primary text and icons — never use true #000000; the warm undertone is part of the brand
- Apply warm-tinted shadows (brown rgba 0.149, 0.106, 0.027) at 6% opacity with 0px 4px 8px spread — never use cool gray shadows
- Use 8px radius for all cards, buttons, and nav elements; reserve 4px for badges and tags; never use fully rounded pill shapes except for status indicators
- Set headlines at the tight tracking values from the type scale (e.g. -1.58px at 72px, -0.31px at 24px) — the negative letter-spacing is what makes display type feel set rather than typed
- Layer surfaces as Cream Canvas → Pure Paper → elevated white with shadow, using Linen (#e3dfd5) borders for separation rather than background color shifts

### Don't
- Do not introduce blue, green, red, or purple as interface colors — the only chromatic hues are amber (#f9a600, #e89b01) and warm accents (terracotta, honey, wisteria)
- Do not use #000000 for text or backgrounds — Espresso (#261b07) maintains the warm paper quality
- Do not apply shadows with cool gray tints — all shadows must use the warm brown base (srgb 0.149, 0.106, 0.027)
- Do not use filled buttons in any color other than Amber Signal for primary actions — secondary actions are ghost/outlined only
- Do not set body type at weight 700 or above — the custom font's weight 584 is the maximum semibold, and weight 492 serves as medium
- Do not use line-heights above 1.25 for any text — the system is tight and dense, not airy
- Do not separate sections with colored background bands — transition via whitespace and Linen dividers on the continuous Cream Canvas

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Cream Canvas | `#f8f7f5` | Base page background — the warm paper surface that grounds all content |
| 1 | Pure Paper | `#ffffff` | Card surfaces, product UI panels — the clean top layer |
| 2 | Linen Surface | `#e3dfd5` | Subtle elevated panels, active nav states, secondary surfaces |
| 3 | Honey Wash | `#f8da9d` | Warm badge/tag backgrounds — highest non-interactive surface |

## Elevation

- **Dashboard Card:** `0px 4px 8px 0px rgba(38, 27, 7, 0.06)`
- **Primary CTA Button:** `inset 0px 2px 4px 0px rgba(255, 255, 255, 0.56), 0px 4px 8px 0px rgba(38, 27, 7, 0.06), 0px 1px 2px 0px rgba(38, 27, 7, 0.36)`

## Imagery

Product screenshots dominate the visual space — large dashboard mockups showing the FP&A interface with gradient line charts (blue-to-green), metric tiles, and sidebar navigation. No lifestyle photography, no abstract illustrations, no 3D renders. Customer logos appear as a monochrome strip in Driftwood gray, stripped of brand color to maintain the paper-like consistency. The visual story is entirely carried by the product UI itself, framed within the warm cream canvas. Icons throughout the marketing pages are simple outlined glyphs in Espresso, 1.5px stroke weight.

## Layout

Max-width 1200px centered content column with full-bleed Cream Canvas background. The hero pattern is a centered headline stack (eyebrow tag → display headline → muted subtitle → dual CTAs) followed by a large product screenshot that bleeds to or near the viewport edges. Below the hero, sections alternate between centered text blocks and asymmetric text-left/product-right compositions, all separated by 56-80px vertical whitespace rather than dividers. The customer logo strip is a full-width band. The header is a simple horizontal bar: wordmark left, nav center-right, persistent amber pill CTA far-right. No sticky sidebar, no mega-menu — the nav is compact and flat.

## Agent Prompt Guide

## Quick Color Reference
- Text (primary): #261b07 (Espresso)
- Text (body): #61594a (Bark)
- Text (muted): #8f897e (Driftwood)
- Background (canvas): #f8f7f5 (Cream)
- Background (card): #ffffff (Pure Paper)
- Border: #e3dfd5 (Linen)
- Accent: #f9a600 (Amber — CTA fill only)
- primary action: #f9a600 (filled action)

## Example Component Prompts

1. **Hero Section**: Cream Canvas (#f8f7f5) background. Eyebrow tag at 12px Interphases weight 492, letter-spacing 0.6px, Espresso text. Display headline at 72px Interphases weight 584, line-height 1.0, letter-spacing -1.58px, Espresso (#261b07) text, centered. Subtitle at 20px weight 400, Bark (#61594a), centered, max-width 600px. Two CTAs side by side: Amber filled (#f9a600, Espresso text, 8px radius, 8px 16px padding, warm shadow) + Ghost button (transparent, 1px Espresso border, 8px radius, 8px 16px padding). 56px gap between headline and subtitle, 24px between subtitle and CTAs.

2. **Dashboard Card**: White (#ffffff) surface, 1px Linen (#e3dfd5) border, 8px radius, 32px padding, warm shadow (0px 4px 8px rgba(38,27,7,0.06)). Contains a header row (16px weight 492, Espresso) and a body area with metric tiles below.

3. **Metric Tile**: White background, no border, 8px radius, 24px padding. Label at 12px weight 400, Driftwood (#8f897e). Value at 24px weight 584, Espresso. Delta indicator at 12px weight 492, Terracotta (#f0624f) for positive. Gradient line chart (blue to green, low opacity) fills the lower 60% of the tile.

4. **Navigation Header**: Espresso (#261b07) left-aligned wordmark 'runway' at 20px weight 584. Center-right horizontal nav links at 14px weight 400, Espresso text, 16px gap between items. Far-right: Amber pill CTA (#f9a600, 8px radius, 6px 12px padding, 14px weight 492, Espresso text). Full-width, 16px vertical padding, 1px Linen bottom border.

5. **Tag/Badge**: Honey Wash (#f8da9d) background, Espresso text, 4px radius, 4px 8px padding, 12px Interphases weight 492. Inline display only — never used as a standalone block.

## Similar Brands

- **Mercury** — Same warm cream canvas with deep brown text and restrained single-accent approach; both feel like premium financial tools rendered in paper tones
- **Pigment** — Similar warm-neutral palette and compact dense typography for a financial planning product; both use soft warm shadows instead of cool gray elevation
- **Ramp** — Comparable tight type scale and warm light-mode design language for fintech, though Ramp leans cooler; shares the pattern of one chromatic CTA color against muted surfaces
- **Causal** — Both are FP&A tools with custom variable fonts, warm off-white backgrounds, and product-screenshot-driven marketing pages; similar editorial-meets-software visual register

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-cream-canvas: #f8f7f5;
  --color-pure-paper: #ffffff;
  --color-linen-border: #e3dfd5;
  --color-stone-mist: #d5d2cd;
  --color-warm-ash: #aca89f;
  --color-driftwood: #8f897e;
  --color-bark: #61594a;
  --color-espresso: #261b07;
  --color-amber-signal: #f9a600;
  --color-burnished-gold: #e89b01;
  --color-terracotta: #f0624f;
  --color-wisteria: #d5befa;
  --color-honey-wash: #f8da9d;

  /* Typography — Font Families */
  --font-interphases-pro-variable: 'Interphases Pro Variable', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.25;
  --tracking-caption: 0.6px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.25;
  --tracking-body-sm: -0.14px;
  --text-body: 16px;
  --leading-body: 1.25;
  --tracking-body: -0.16px;
  --text-subheading-sm: 20px;
  --leading-subheading-sm: 1.25;
  --tracking-subheading-sm: -0.22px;
  --text-subheading: 24px;
  --leading-subheading: 1.13;
  --tracking-subheading: -0.31px;
  --text-heading-sm: 36px;
  --leading-heading-sm: 1.13;
  --tracking-heading-sm: -0.61px;
  --text-heading: 56px;
  --leading-heading: 1.13;
  --tracking-heading: -1.12px;
  --text-heading-lg: 65px;
  --leading-heading-lg: 1;
  --tracking-heading-lg: -1.43px;
  --text-display: 72px;
  --leading-display: 1;
  --tracking-display: -1.58px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-w492: 492;
  --font-weight-w584: 584;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-5: 5px;
  --spacing-6: 6px;
  --spacing-7: 7px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-28: 28px;
  --spacing-30: 30px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-63: 63px;
  --spacing-105: 105px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 56-80px;
  --card-padding: 24-32px;
  --element-gap: 8-16px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;

  /* Named Radii */
  --radius-nav: 8px;
  --radius-cards: 8px;
  --radius-badges: 4px;
  --radius-inputs: 8px;
  --radius-buttons: 8px;

  /* Shadows */
  --shadow-sm: color(srgb 0.14902 0.105882 0.027451 / 0.06) 0px 4px 8px 0px;
  --shadow-sm-2: color(srgb 1 1 1 / 0.56) 0px 2px 4px 0px inset, color(srgb 0.14902 0.105882 0.027451 / 0.06) 0px 4px 8px 0px, color(srgb 0.14902 0.105882 0.027451 / 0.36) 0px 1px 2px 0px;

  /* Surfaces */
  --surface-cream-canvas: #f8f7f5;
  --surface-pure-paper: #ffffff;
  --surface-linen-surface: #e3dfd5;
  --surface-honey-wash: #f8da9d;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-cream-canvas: #f8f7f5;
  --color-pure-paper: #ffffff;
  --color-linen-border: #e3dfd5;
  --color-stone-mist: #d5d2cd;
  --color-warm-ash: #aca89f;
  --color-driftwood: #8f897e;
  --color-bark: #61594a;
  --color-espresso: #261b07;
  --color-amber-signal: #f9a600;
  --color-burnished-gold: #e89b01;
  --color-terracotta: #f0624f;
  --color-wisteria: #d5befa;
  --color-honey-wash: #f8da9d;

  /* Typography */
  --font-interphases-pro-variable: 'Interphases Pro Variable', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.25;
  --tracking-caption: 0.6px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.25;
  --tracking-body-sm: -0.14px;
  --text-body: 16px;
  --leading-body: 1.25;
  --tracking-body: -0.16px;
  --text-subheading-sm: 20px;
  --leading-subheading-sm: 1.25;
  --tracking-subheading-sm: -0.22px;
  --text-subheading: 24px;
  --leading-subheading: 1.13;
  --tracking-subheading: -0.31px;
  --text-heading-sm: 36px;
  --leading-heading-sm: 1.13;
  --tracking-heading-sm: -0.61px;
  --text-heading: 56px;
  --leading-heading: 1.13;
  --tracking-heading: -1.12px;
  --text-heading-lg: 65px;
  --leading-heading-lg: 1;
  --tracking-heading-lg: -1.43px;
  --text-display: 72px;
  --leading-display: 1;
  --tracking-display: -1.58px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-5: 5px;
  --spacing-6: 6px;
  --spacing-7: 7px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-28: 28px;
  --spacing-30: 30px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-63: 63px;
  --spacing-105: 105px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;

  /* Shadows */
  --shadow-sm: color(srgb 0.14902 0.105882 0.027451 / 0.06) 0px 4px 8px 0px;
  --shadow-sm-2: color(srgb 1 1 1 / 0.56) 0px 2px 4px 0px inset, color(srgb 0.14902 0.105882 0.027451 / 0.06) 0px 4px 8px 0px, color(srgb 0.14902 0.105882 0.027451 / 0.36) 0px 1px 2px 0px;
}
```
