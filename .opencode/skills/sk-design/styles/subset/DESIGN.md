# Subset — Style Reference
> editorial boutique on raw linen

**Theme:** light

Subset is an editorial intimates boutique rendered on warm raw linen rather than stark white. The page breathes through a muted earth palette — sage, dusty blue, blush, ember — with Founders Grotesk as the workhorse voice and a refined serif (TT Ramillas) reserved for editorial headlines. Product photography is the hero; the UI gets out of the way with hairline borders, minimal radii, and no decorative shadows. The signature moves: aggressive letter-spacing on uppercase labels (0.1–0.15em), generous cream canvas, and color used as quiet punctuation on borders, badges, and icons rather than as large filled blocks.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Ink | `#241f20` | `--color-ink` | Neutral form states, badge text, and quiet UI feedback where color should stay understated. Do not promote it to the primary CTA color |
| Raw Linen | `#f5f4ee` | `--color-raw-linen` | Page canvas and card backgrounds — warm off-white, the signature surface that distinguishes this system from generic white SaaS |
| White | `#ffffff` | `--color-white` | Elevated card surfaces, badge fills, inverse text on dark buttons |
| Fog | `#808080` | `--color-fog` | Muted helper text, secondary dividers, disabled labels |
| Blush | `#edcdc2` | `--color-blush` | Accent surface wash — hero image tint, product photo backdrop, soft highlight zones |
| Charcoal | `#26262a` | `--color-charcoal` | Darkest UI surface — footer dark bands, chat widget shell, overlaid panels |
| Sage Leaf | `#8bbd78` | `--color-sage-leaf` | Signature accent — top announcement bar, hairline decorative borders, icon strokes, functional green; the brand's quiet living color |
| Heritage Blue | `#6487ba` | `--color-heritage-blue` | Primary action — filled buttons, link underlines, selected states; dusty mid-blue carries trust without corporate coldness |
| Midnight Forest | `#233735` | `--color-midnight-forest` | Dark filled buttons (hero CTA), deep green-black for high-emphasis actions; warmer than charcoal, more sophisticated than black |
| Ember | `#ff965b` | `--color-ember` | NEW badges, notification dots, star ratings, cart count bubble — vivid warm orange used sparingly as functional punctuation |

## Tokens — Typography

### FoundersGrotesk — Workhorse sans for navigation, product cards, badges, body text, buttons, inputs, icons. The 0.1–0.15em letter-spacing on 13–15px sizes is the signature tracking pattern for uppercase labels (NEW, ORGANIC COTTON, Shop Underwear). · `--font-foundersgrotesk`
- **Substitute:** Inter, Söhne, or DM Sans
- **Weights:** 400, 500, 700
- **Sizes:** 13, 14, 15, 16, 17, 18, 20, 24
- **Line height:** 1.20–1.63
- **Letter spacing:** 0.0180em, 0.0210em, 0.0240em, 0.0250em, 0.0270em, 0.0280em, 0.0300em, 0.0330em, 0.1000em, 0.1500em
- **Role:** Workhorse sans for navigation, product cards, badges, body text, buttons, inputs, icons. The 0.1–0.15em letter-spacing on 13–15px sizes is the signature tracking pattern for uppercase labels (NEW, ORGANIC COTTON, Shop Underwear).

### TTRamillas_Light — Editorial serif for hero headline, subhead, and body excerpts. Tight -0.01em tracking and low contrast strokes create a quiet, literary feel that contrasts the geometric sans. · `--font-ttramillaslight`
- **Substitute:** Cormorant Garamond, Playfair Display, or Lora
- **Weights:** 400
- **Sizes:** 18, 20, 24, 32, 40, 42
- **Line height:** 1.00–1.53
- **Letter spacing:** -0.0100em
- **Role:** Editorial serif for hero headline, subhead, and body excerpts. Tight -0.01em tracking and low contrast strokes create a quiet, literary feel that contrasts the geometric sans.

### GTStandard-M — Specialty text at 17px with 0.025em tracking — used for minimal secondary copy, not a primary face · `--font-gtstandard-m`
- **Substitute:** Söhne or Inter at matching weight
- **Weights:** 400
- **Sizes:** 17
- **Line height:** 1.50
- **Letter spacing:** 0.0250em
- **Role:** Specialty text at 17px with 0.025em tracking — used for minimal secondary copy, not a primary face

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 13px | 1.5 | 0.1px | `--text-caption` |
| body | 16px | 1.5 | — | `--text-body` |
| subheading | 18px | 1.4 | -0.01px | `--text-subheading` |
| heading-sm | 20px | 1.4 | 0.025px | `--text-heading-sm` |
| heading | 24px | 1.2 | — | `--text-heading` |
| heading-lg | 32px | 1.24 | -0.01px | `--text-heading-lg` |
| display | 42px | 1.29 | -0.01px | `--text-display` |

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
| 28 | 28px | `--spacing-28` |
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 64 | 64px | `--spacing-64` |
| 72 | 72px | `--spacing-72` |
| 160 | 160px | `--spacing-160` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 0px |
| badges | 2px |
| buttons | 0px |
| swatches | 9999px |
| chat-pill | 9999px |

### Layout

- **Page max-width:** 1280px
- **Section gap:** 64px
- **Card padding:** 16px
- **Element gap:** 8px

## Components

### Dark Filled Button
**Role:** Primary call-to-action (hero, product detail, checkout)

Background #233735, text #ffffff, FoundersGrotesk 14px weight 500, letter-spacing 0.025em, uppercase. Padding 16px vertical / 24px horizontal. Radius 0px — sharp rectangle, no rounding. No shadow. This is the 'SHOP MOTHERS DAY' button.

### Outlined Action Button
**Role:** Secondary action or link-style button

Transparent background, 1px border #233735 or #6487ba, text matching border color. FoundersGrotesk 14px weight 500, 0.025em tracking, uppercase. Padding 14px / 20px. Radius 0px.

### Announcement Bar
**Role:** Site-wide top strip

Full-bleed #8bbd78 sage background. Centered text, FoundersGrotesk 13px weight 400, #241f20, letter-spacing 0.10em, uppercase. Padding 8px vertical. No border.

### Top Navigation
**Role:** Primary site navigation

Sits on Raw Linen canvas. Logo (SUBSET in serif) centered. Left: category links (Start Here, Underwear, Bras, Lounge, Mens) in FoundersGrotesk 14px weight 400, 0.025em tracking. Right: search icon, Fitting Room, Recycle, Account, and cart bubble (Ember #ff965b fill, white number). All items vertically aligned, no dividers.

### Hero Overlay Card
**Role:** Centered editorial card on full-width hero image

White #ffffff background, 0px radius, generous padding (~48px). Contains serif headline at 42px, subtext, dark filled CTA, and meta line. Sits over split editorial imagery (product on left, model on right) at ~60% page width, centered.

### Category Card
**Role:** 5-up category grid (Shop Underwear, Bras, Lounge, Men's, All)

Portrait-ratio image fills card top, no border, 0px radius. Label below image: FoundersGrotesk 20px weight 400, #241f20, 0.025em tracking. Product count subtext: 14px, #808080, 0.025em tracking. Full-bleed within column, no card background — image sits directly on Raw Linen.

### Product Card
**Role:** 3-up product grid items

Square product image on Raw Linen background, no border or radius. NEW badge (Ember fill, white text, 2px radius) positioned top-right of image. Below image: star rating (Ember stars) + review count in 13px #808080. ORGANIC COTTON label in 13px #241f20, 0.10em tracking, uppercase. Product name 16px #241f20 weight 500. Price in 16px #241f20. Color swatch row: 16px circles, current variant outlined in #241f20.

### New Badge
**Role:** Product freshness indicator

Background #ff965b Ember, text #ffffff, FoundersGrotesk 13px weight 500, 0.10em tracking, uppercase. Padding 4px / 8px. Radius 2px. Positioned top-right of product image.

### Press Strip
**Role:** Editorial social proof band below hero

Raw Linen background, full-width single row. Left-aligned quote in serif (TTRamillas 18px) + bold publication name in FoundersGrotesk 14px weight 700, uppercase, 0.025em tracking. Items separated by generous horizontal whitespace, no dividers. 4 items at ~25% width each.

### Color Swatch
**Role:** Product variant selector

16px diameter circle, #9999px radius. Border 1px #e0e0e0 default; current selection gets 1px #241f20 outer ring. No fill change between states — only border weight signals selection.

### Chat Widget
**Role:** Persistent bottom-left support trigger

Pill shape, 9999px radius. Dark circle icon (#241f20) + white pill (#ffffff) with 'Chat with us' text in FoundersGrotesk 14px weight 500, #241f20. Fixed bottom-left, 16px offset from edges.

### Cart Count Bubble
**Role:** Cart icon notification

Small circle in navigation, #ff965b Ember fill, white number at 12px weight 700. Diameter ~20px, positioned overlapping the cart icon.

## Do's and Don'ts

### Do
- Set all page backgrounds and section bands to #f5f4ee Raw Linen — never use pure white as a canvas
- Use #233735 Midnight Forest for primary filled buttons with #ffffff text at 14px FoundersGrotesk weight 500, 0.025em tracking, uppercase
- Apply 0.10em letter-spacing to all uppercase micro-labels (NEW, ORGANIC COTTON, navigation links) at 13–15px FoundersGrotesk
- Reserve #ff965b Ember exclusively for badges, star ratings, and the cart count bubble — never for large filled blocks
- Use #8bbd78 Sage Leaf for hairline decorative borders and icon strokes, not for filled backgrounds
- Keep component radii at 0px for cards, buttons, and product images; use 9999px only for the chat pill and color swatches
- Use TTRamillas serif at 32–42px for editorial headlines; switch to FoundersGrotesk for all UI text and product information

### Don't
- Don't use pure #000000 for text or button fills — use #241f20 Ink instead for warmth
- Don't apply border-radius larger than 2px to product cards, buttons, or product images — the sharp rectangular geometry is the signature
- Don't use the sage green #8bbd78 or blue #6487ba as large filled backgrounds — they are accent and action colors only
- Don't set tracking below 0.025em on FoundersGrotesk body or UI text at 14–18px — the wide tracking is intentional
- Don't use drop shadows or box-shadows on cards or buttons — the system is flat, separated only by hairline borders and surface color shifts
- Don't use the blush #edcdc2 for UI components — it's a photographic surface tone, not a UI fill
- Don't introduce a new chromatic color for hover or active states — deepen the existing color (e.g. #8bbd78 → #5b7763) rather than adding new hues

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Raw Linen | `#f5f4ee` | Base page canvas — all section backgrounds sit on this warm cream |
| 2 | White | `#ffffff` | Product cards, hero overlay card, badge fills — the only true-white surface |
| 3 | Blush | `#edcdc2` | Accent wash — soft highlight zones in hero and editorial imagery |
| 4 | Midnight Forest | `#233735` | Dark CTA surface — filled primary buttons, inverted panels |

## Imagery

Large-scale editorial product and lifestyle photography dominates the visual language. Product shots are flat-lay on neutral surfaces (blush pink, raw linen), showing garments alone or in packaging with no lifestyle context. Hero imagery is split editorial: product-on-left, model-on-right, both warm-toned and softly lit. Category cards use full-bleed model portraits against neutral studio backdrops. No illustration, no 3D, no abstract graphics — photography is the only visual content and it occupies roughly 70% of the viewport on product-heavy pages. Stars in the rating system are the only graphic iconography; product imagery carries all the brand warmth.

## Layout

Max-width ~1280px centered, with the hero stretching full-bleed. The hero is a full-viewport editorial image with a centered white overlay card containing headline + CTA + meta. Below the hero, sections alternate between the Raw Linen canvas and product imagery, separated by generous 64px vertical gaps. The product grid is 3 columns; the category grid is 5 columns; the press strip is a 4-column single row of quotes. Navigation is a single horizontal bar with centered serif logo, left-aligned category links, and right-aligned account/cart cluster. The page rhythm is slow and editorial: large image blocks, then text, then image — never dense information stacking.

## Agent Prompt Guide

**Quick Color Reference**
- text: #241f20
- background: #f5f4ee (canvas) / #ffffff (cards)
- border: #241f20 (hairline) / #8bbd78 (decorative)
- accent: #8bbd78 Sage / #edcdc2 Blush / #ff965b Ember
- primary action: #233735 (filled action)

**Example Component Prompts**
1. *Hero overlay card*: Full-bleed editorial image (1280px wide), centered white card overlay (#ffffff, 0px radius, 48px padding). Serif headline 'Everyday Essentials She Deserves' at 42px TTRamillas weight 400, #241f20, -0.01em tracking. Dark filled CTA below: #233735 background, white text 'SHOP MOTHERS DAY', 14px FoundersGrotesk weight 500, 0.025em tracking, 16px/24px padding, 0px radius. Meta line: 14px FoundersGrotesk #808080, then star row (#ff965b stars) + 'Over 13,000 Five Star Reviews' in 14px #241f20.

2. *Product card*: Square product image on #f5f4ee canvas, 0px radius, no border. Ember #ff965b NEW badge (2px radius) top-right. Below image: 13px #ff965b stars + 13px #808080 review count. 'ORGANIC COTTON' label at 13px FoundersGrotesk weight 500, #241f20, 0.10em tracking, uppercase. Product name at 16px weight 500 #241f20. Price at 16px #241f20. Color swatch row of 16px circles, current variant ringed 1px #241f20.

3. *Category card*: Portrait-ratio model image filling card width, 0px radius, no border, sits on Raw Linen. Label 'Shop Underwear' below at 20px FoundersGrotesk weight 400, #241f20, 0.025em tracking. Count '13 Products' at 14px #808080, 0.025em tracking. No card background — image breathes into canvas.

4. *Announcement bar*: Full-bleed #8bbd78 Sage strip, 8px vertical padding. Centered text at 13px FoundersGrotesk weight 400, #241f20, 0.10em tracking, uppercase. No border, no shadow.

5. *Outlined action button*: Transparent background, 1px border #6487ba Heritage Blue, text #6487ba at 14px FoundersGrotesk weight 500, 0.025em tracking, uppercase, 14px/20px padding, 0px radius. The chromatic border is the action signal — no fill change on hover, only slight darken.

## Typography Signature

The defining typographic move is the wide-tracked uppercase micro-label. FoundersGrotesk at 13–15px with 0.10em to 0.15em letter-spacing appears on every category label, badge, and product attribute ('NEW', 'ORGANIC COTTON', 'Shop Underwear', announcement bar text). This tracking pattern is unusual — most systems stay at 0–0.05em — and it gives the UI a fashion-editorial cadence. Pair this with TTRamillas serif at 32–42px for headlines; the contrast between the airy tracked sans and the tight elegant serif (-0.01em) is the brand's typographic voice.

## Flatness Philosophy

Zero shadows. Zero gradients. Zero blur effects. Separation between elements comes from: surface color shifts (#f5f4ee → #ffffff), hairline 1px borders, and whitespace. Product images float directly on the Raw Linen canvas with no card containers or dividers. This flatness is deliberate — it lets the editorial photography do all the visual work and keeps the UI from competing with the garments.

## Similar Brands

- **Everlane** — Same editorial product photography on warm neutral canvas, wide-tracked uppercase labels, serif headlines paired with geometric sans, and zero-shadow flat component design
- **Cuyana** — Shared warm cream canvas, restrained earth-tone palette, hairline borders, and the boutique-editorial feel where photography and whitespace replace decorative UI
- **Reformation** — Same full-bleed editorial hero, serif logo wordmark, warm neutral backgrounds, and product grids where images sit directly on canvas without card containers
- **Glossier** — Similar soft, warm light-mode aesthetic with muted accent colors used sparingly on a near-white canvas, and a flat component system without heavy shadows

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-ink: #241f20;
  --color-raw-linen: #f5f4ee;
  --color-white: #ffffff;
  --color-fog: #808080;
  --color-blush: #edcdc2;
  --color-charcoal: #26262a;
  --color-sage-leaf: #8bbd78;
  --color-heritage-blue: #6487ba;
  --color-midnight-forest: #233735;
  --color-ember: #ff965b;

  /* Typography — Font Families */
  --font-foundersgrotesk: 'FoundersGrotesk', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-ttramillaslight: 'TTRamillas_Light', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-gtstandard-m: 'GTStandard-M', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 13px;
  --leading-caption: 1.5;
  --tracking-caption: 0.1px;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 18px;
  --leading-subheading: 1.4;
  --tracking-subheading: -0.01px;
  --text-heading-sm: 20px;
  --leading-heading-sm: 1.4;
  --tracking-heading-sm: 0.025px;
  --text-heading: 24px;
  --leading-heading: 1.2;
  --text-heading-lg: 32px;
  --leading-heading-lg: 1.24;
  --tracking-heading-lg: -0.01px;
  --text-display: 42px;
  --leading-display: 1.29;
  --tracking-display: -0.01px;

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
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-72: 72px;
  --spacing-160: 160px;

  /* Layout */
  --page-max-width: 1280px;
  --section-gap: 64px;
  --card-padding: 16px;
  --element-gap: 8px;

  /* Named Radii */
  --radius-cards: 0px;
  --radius-badges: 2px;
  --radius-buttons: 0px;
  --radius-swatches: 9999px;
  --radius-chat-pill: 9999px;

  /* Surfaces */
  --surface-raw-linen: #f5f4ee;
  --surface-white: #ffffff;
  --surface-blush: #edcdc2;
  --surface-midnight-forest: #233735;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-ink: #241f20;
  --color-raw-linen: #f5f4ee;
  --color-white: #ffffff;
  --color-fog: #808080;
  --color-blush: #edcdc2;
  --color-charcoal: #26262a;
  --color-sage-leaf: #8bbd78;
  --color-heritage-blue: #6487ba;
  --color-midnight-forest: #233735;
  --color-ember: #ff965b;

  /* Typography */
  --font-foundersgrotesk: 'FoundersGrotesk', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-ttramillaslight: 'TTRamillas_Light', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-gtstandard-m: 'GTStandard-M', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 13px;
  --leading-caption: 1.5;
  --tracking-caption: 0.1px;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 18px;
  --leading-subheading: 1.4;
  --tracking-subheading: -0.01px;
  --text-heading-sm: 20px;
  --leading-heading-sm: 1.4;
  --tracking-heading-sm: 0.025px;
  --text-heading: 24px;
  --leading-heading: 1.2;
  --text-heading-lg: 32px;
  --leading-heading-lg: 1.24;
  --tracking-heading-lg: -0.01px;
  --text-display: 42px;
  --leading-display: 1.29;
  --tracking-display: -0.01px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-72: 72px;
  --spacing-160: 160px;
}
```
