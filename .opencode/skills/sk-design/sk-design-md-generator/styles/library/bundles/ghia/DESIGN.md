# Ghia — Style Reference
> Mediterranean sunset on a vintage aperitivo label

**Theme:** light

Ghia expresses itself as a Mediterranean aperitivo label in digital form: warm cream canvases, deep wine-burgundy sections, and coral-pink CTAs that feel like vintage packaging. The type system pairs a humanist transitional serif (Vivey) for warmth and readability with a condensed display sans (FHA Condensed) for editorial all-caps headlines — the same contrast you'd find on an Italian spirits label. Components are rounded and tactile: pill buttons, circular product frames, and full-bleed product photography. The page alternates between sun-warmed cream surfaces and dark burgundy statement blocks, with color used sparingly to make the pink CTAs and blue accent moments pop. Density is relaxed and editorial — generous margins, large display headlines, and product photography that takes visual priority over text.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Ghia Burgundy | `#651c32` | `--color-ghia-burgundy` | Primary brand color, header bar, statement sections, marquee bands, footer — the deep wine that grounds the whole system |
| Coral CTA | `#ef6079` | `--color-coral-cta` | Filled pill buttons (Shop Bestsellers, Add to Cart, Our Story), active tab indicators, small accent dots |
| Aperitivo Cream | `#f2e2d5` | `--color-aperitivo-cream` | Primary page canvas and warm card surfaces |
| Bone White | `#fef6ee` | `--color-bone-white` | Lightest surface, header text on dark, soft secondary card backgrounds |
| Smoke Gray | `#e5e7eb` | `--color-smoke-gray` | Hairline borders, dividers, subtle structural separators |
| Charcoal | `#000000` | `--color-charcoal` | Icons, fine details, logo strokes on light surfaces |
| Olive Grove | `#3e4938` | `--color-olive-grove` | Supporting neutral for secondary UI, dividers, and muted labels. Do not promote it to the primary CTA color |
| Dusty Rose | `#dfcac8` | `--color-dusty-rose` | Soft accent border, tag backgrounds, muted product label echo |
| Riviera Blue | `#abd2eb` | `--color-riviera-blue` | Blue supporting accent for decorative details and low-frequency emphasis |
| Limoncello Yellow | `#f0e87b` | `--color-limoncello-yellow` | Highlight tags, sticker accents, energetic punctuation — the spark of citrus in the system |
| Sage Mist | `#b6cfd0` | `--color-sage-mist` | Muted surface accent, cool-toned badge or chip background |

## Tokens — Typography

### Vivey 22 Positive — Primary text face — body copy, nav links, buttons, product cards, footer. The humanist serif carries warmth and editorial feel; its italic-influenced curves feel handwritten and aperitivo-friendly rather than corporate. · `--font-vivey-22-positive`
- **Substitute:** Playfair Display, DM Serif Display, or Lora
- **Weights:** 400, 700
- **Sizes:** 10, 12, 13, 14, 15, 16, 18px
- **Line height:** 1.0–1.56
- **Role:** Primary text face — body copy, nav links, buttons, product cards, footer. The humanist serif carries warmth and editorial feel; its italic-influenced curves feel handwritten and aperitivo-friendly rather than corporate.

### FHA Condensed French NC — Display headlines, section titles, large statements — always set in all-caps with tight leading. The condensed proportions create editorial authority and reference classic spirits-label typography. · `--font-fha-condensed-french-nc`
- **Substitute:** Oswald, Bebas Neue, or Antonio
- **Weights:** 400
- **Sizes:** 24, 30, 32, 38, 44, 48, 52, 72px
- **Line height:** 1.0–1.33
- **Role:** Display headlines, section titles, large statements — always set in all-caps with tight leading. The condensed proportions create editorial authority and reference classic spirits-label typography.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 10px | 1.3 | — | `--text-caption` |
| body | 14px | 1.43 | — | `--text-body` |
| body-lg | 16px | 1.5 | — | `--text-body-lg` |
| subheading | 18px | 1.56 | — | `--text-subheading` |
| heading-sm | 24px | 1.33 | — | `--text-heading-sm` |
| heading | 32px | 1.2 | — | `--text-heading` |
| heading-lg | 44px | 1.15 | — | `--text-heading-lg` |
| heading-xl | 52px | 1.1 | — | `--text-heading-xl` |
| display | 72px | 1 | — | `--text-display` |

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
| 28 | 28px | `--spacing-28` |
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 56 | 56px | `--spacing-56` |
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |
| 200 | 200px | `--spacing-200` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 9999px |
| cards | 16px |
| buttons | 9999px |
| productFrames | 9999px |
| largeContainers | 24px |

### Layout

- **Page max-width:** 1280px
- **Section gap:** 64px
- **Card padding:** 24px
- **Element gap:** 16px

## Components

### Coral Pill Button (Primary)
**Role:** Main call-to-action

Filled coral-pink (#ef6079) pill with white Vivey text, 9999px radius, 12px 24px padding, 14px Vivey 400. Used for Shop Bestsellers, Add to Cart, Our Story, Save 30%. The coral against cream is the highest-energy moment in the interface.

### Outline Pill Button (Secondary)
**Role:** Secondary action

1px Smoke Gray border (#e5e7eb) on cream background, Vivey 14px 400 text in dark, 9999px radius, 12px 24px padding. Used for Shop All, navigation CTAs, less prominent actions.

### Top Announcement Bar
**Role:** Promotional header

Full-width Coral CTA (#ef6079) strip at very top of page, centered Vivey 12px white text. Always one short line — shipping, promo, or announcement.

### Navigation Header
**Role:** Primary site nav

Full-width Ghia Burgundy (#651c32) bar, ~64px tall. Script-serif white Ghia logo left, Vivey 14px white nav links center (Shop ▾, Build Your Own Bundle, Recipes, Subscription, Find In Store), search/user/cart icons right with 0 badge dot in coral.

### Hero Section
**Role:** Above-the-fold statement

Aperitivo Cream (#f2e2d5) full-bleed canvas, two-column on desktop. Left: FHA Condensed 72px Ghia Burgundy headline stacked on two lines with tight 1.0 leading, Vivey 16px muted body line, Coral Pill Button below. Right: product photography (bottles + glass) filling the frame, no rounded container — the imagery bleeds to the edges.

### Trust Marquee Bar
**Role:** Credibility strip

Ghia Burgundy (#651c32) full-width band, Vivey 14px 700 all-caps white text separated by bullet dots — 0% ALCOHOL • NO ARTIFICIAL FLAVORS • NO CAFFEINE • NO ADDED SUGAR • VEGAN. Repeating horizontally.

### Circular Product Card
**Role:** Product grid item

9999px-radius circular product image (bottle in dark setting) centered in frame, Vivey 16px 700 product name below, Vivey 12px price in muted brown. Sits on cream canvas. 'Save 30%' or 'Bestseller' yellow tag (#f0e87b) can overlay top-right.

### Brand Story Split Block
**Role:** Editorial about section

Two-column 50/50: left half Ghia Burgundy (#651c32) with FHA Condensed 32–44px cream text, Vivey 16px body, Coral Pill Button; right half is full-bleed lifestyle photography of cocktail glass + bottle. The dark block is the page's voice — it speaks louder than the cream sections.

### Product Detail Card (Shop Grid)
**Role:** E-commerce product card

Vertical card, 16px radius, cream interior, square product photo on top half, Vivey 18px 700 name (e.g. APÉRITIF), Vivey 14px body description (2 lines), Coral Pill Button 'Add to Cart — $38' at bottom. Sits on a dark burgundy textured background section.

### Category Filter Pill
**Role:** Product line switcher

Small pill tag, 9999px radius, 8px 16px padding. Inactive: cream fill, Vivey 12px 700 Ghia Burgundy text. Active: Rivira Blue (#abd2eb) fill or Coral CTA fill. Groups products by line — Apéritif, Le Spritz, Le Fizz.

### Footer
**Role:** Site footer

Ghia Burgundy (#651c32) full-width, multi-column Vivey 14px cream text, Ghia script logo repeated. Newsletter signup, social icons, legal links. Padding ~48–64px vertical.

### Highlight Sticker Tag
**Role:** Promotional badge on product

Limoncello Yellow (#f0e87b) rectangle, slight rotation (-5deg), Vivey 11px 700 dark text 'SAVE 30%' or 'BESTSELLER'. Applied as overlay sticker on product images — gives the tactile, hand-applied label feeling.

## Do's and Don'ts

### Do
- Set headlines in FHA Condensed all-caps with leading 1.0–1.15 — never in mixed case or with generous line-height
- Use 9999px radius on all buttons, tags, and product image frames
- Pair Coral CTA (#ef6079) fills with Bone White (#fef6ee) text at 14px Vivey 400
- Alternate full-bleed cream and burgundy sections to create editorial rhythm
- Crop product bottles into 9999px circular frames for grid items
- Use Limoncello Yellow (#f0e87b) only for promotional sticker overlays, not large surfaces
- Maintain 64–80px section padding and 24px card padding for breathing room

### Don't
- Don't use Olive Grove (#3e4938) or Rivira Blue (#abd2eb) as primary CTA fills — coral is the singular action color
- Don't set FHA Condensed below 24px — the condensed letterforms lose legibility at small sizes
- Don't use sharp 0px or 4px corner radii on interactive elements — the system is built on pill shapes
- Don't add drop shadows to cards or buttons — depth comes from color contrast and photography, not elevation
- Don't use gradients — the palette is strictly flat and Mediterranean
- Don't introduce new chromatic colors outside the burgundy/coral/cream system — Rivira Blue and Limoncello Yellow are accents, not foundations
- Don't mix serif and sans for the same hierarchy level — Vivey reads body, FHA Condensed reads display, never overlap

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#f2e2d5` | Default page background, warm cream ground |
| 1 | Light Card | `#fef6ee` | Elevated card or section on cream canvas, bone-white |
| 2 | Dark Statement | `#651c32` | Header bar, brand-story block, marquee — full-bleed burgundy bands |
| 3 | Deep Accent | `#3e4938` | Olive-toned dark surface for select CTA or footer blocks |

## Imagery

Product photography dominates the visual language. Bottles and cocktail glasses are shot on neutral backdrops (dark studio or bright white) with soft natural light, styled with fresh botanicals (citrus, berries, ice). The hero composition is editorial — multiple bottles artfully arranged with a pour mid-action. Lifestyle shots feature close-up glassware with garnishes, no people, no lifestyle context. Circular product crops (9999px radius) are a signature device — bottles framed like cameo portraits. The supporting 'texture' backgrounds behind product grids appear to be rich red/burgundy liquid or textured material, adding depth without competing. There is no illustration — every visual is photographic.

## Layout

Full-bleed sections alternating between Aperitivo Cream and Ghia Burgundy — no rounded section containers, the color bands extend edge-to-edge. Hero is two-column (text left ~40%, product photography right ~60%) on desktop, stacking on mobile. Product grids are 3-column on desktop, 2-column on tablet, 1-column on mobile, with generous 40–64px gutters. The brand-story block is a strict 50/50 split: dark statement left, photo right. Section rhythm is confident and editorial — large vertical gaps (80–120px) between bands, no decorative dividers, just color shifts. Navigation is a single sticky burgundy top bar. No sidebar, no mega-menu — the Shop dropdown is the only expanded nav element.

## Agent Prompt Guide

**Quick Color Reference**
- Background: #f2e2d5 (Aperitivo Cream)
- Text on light: #651c32 (Ghia Burgundy)
- Border: #e5e7eb (Smoke Gray)
No distinct primary action color was observed; use the extracted neutral button treatments instead of inventing a filled CTA color.
- Dark surface: #651c32 (Ghia Burgundy)
- primary action: no distinct CTA color

**3-5 Example Component Prompts**
1. **Hero Section**: Aperitivo Cream (#f2e2d5) full-bleed background, two-column layout. Left: FHA Condensed 72px all-caps Ghia Burgundy (#651c32) headline with line-height 1.0, Vivey 16px body in burgundy, Coral Pill Button (#ef6079 fill, #fef6ee text, 9999px radius, 12px 24px padding) below. Right: product photography of bottles, no container border, bleeding to frame edge.

2. **Circular Product Card**: 9999px radius product image centered, Vivey 16px 700 product name in #651c32 below, Vivey 12px price in muted #651c32. Optional Limoncello Yellow (#f0e87b) sticker tag rotated -5deg on top-right reading 'BESTSELLER' in Vivey 11px 700.

3. **Brand Story Split**: 50/50 columns. Left: Ghia Burgundy (#651c32) background, FHA Condensed 38px all-caps Bone White (#fef6ee) text, Vivey 16px body in cream, Coral Pill Button. Right: full-bleed cocktail lifestyle photography, no border or radius.

4. **Product Detail Card**: 16px radius, cream (#fef6ee) interior, square product photo top, Vivey 18px 700 name in #651c32, Vivey 14px description in #651c32, Coral Pill Button 'Add to Cart — $38' at bottom with 9999px radius.


## Similar Brands

- **Aperol** — Same Mediterranean aperitivo palette: bright orange-coral CTAs against cream and deep brand colors, pill buttons, condensed display headlines in all caps
- **Cipriani (Harry's Bar)** — Vintage spirits-label typography pairing of humanist serif body with condensed display caps, warm cream and burgundy editorial sections
- **Recess** — Same premium beverage e-commerce pattern: full-bleed alternating color bands, pill CTA buttons, circular product crops, serif-script logo treatment
- **Casa Dragones** — Editorial product-page layout with large product photography, condensed sans-serif display type, and warm-toned cream surfaces with dark accent sections
- **Omsom** — Same warm cream + deep berry brand pairing, pill buttons, humanist serif body type, and bold condensed display headlines in statement blocks

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-ghia-burgundy: #651c32;
  --color-coral-cta: #ef6079;
  --color-aperitivo-cream: #f2e2d5;
  --color-bone-white: #fef6ee;
  --color-smoke-gray: #e5e7eb;
  --color-charcoal: #000000;
  --color-olive-grove: #3e4938;
  --color-dusty-rose: #dfcac8;
  --color-riviera-blue: #abd2eb;
  --color-limoncello-yellow: #f0e87b;
  --color-sage-mist: #b6cfd0;

  /* Typography — Font Families */
  --font-vivey-22-positive: 'Vivey 22 Positive', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-fha-condensed-french-nc: 'FHA Condensed French NC', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.3;
  --text-body: 14px;
  --leading-body: 1.43;
  --text-body-lg: 16px;
  --leading-body-lg: 1.5;
  --text-subheading: 18px;
  --leading-subheading: 1.56;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.33;
  --text-heading: 32px;
  --leading-heading: 1.2;
  --text-heading-lg: 44px;
  --leading-heading-lg: 1.15;
  --text-heading-xl: 52px;
  --leading-heading-xl: 1.1;
  --text-display: 72px;
  --leading-display: 1;

  /* Typography — Weights */
  --font-weight-regular: 400;
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
  --spacing-56: 56px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-200: 200px;

  /* Layout */
  --page-max-width: 1280px;
  --section-gap: 64px;
  --card-padding: 24px;
  --element-gap: 16px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-3xl: 24px;
  --radius-full: 9999px;

  /* Named Radii */
  --radius-tags: 9999px;
  --radius-cards: 16px;
  --radius-buttons: 9999px;
  --radius-productframes: 9999px;
  --radius-largecontainers: 24px;

  /* Surfaces */
  --surface-canvas: #f2e2d5;
  --surface-light-card: #fef6ee;
  --surface-dark-statement: #651c32;
  --surface-deep-accent: #3e4938;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-ghia-burgundy: #651c32;
  --color-coral-cta: #ef6079;
  --color-aperitivo-cream: #f2e2d5;
  --color-bone-white: #fef6ee;
  --color-smoke-gray: #e5e7eb;
  --color-charcoal: #000000;
  --color-olive-grove: #3e4938;
  --color-dusty-rose: #dfcac8;
  --color-riviera-blue: #abd2eb;
  --color-limoncello-yellow: #f0e87b;
  --color-sage-mist: #b6cfd0;

  /* Typography */
  --font-vivey-22-positive: 'Vivey 22 Positive', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-fha-condensed-french-nc: 'FHA Condensed French NC', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.3;
  --text-body: 14px;
  --leading-body: 1.43;
  --text-body-lg: 16px;
  --leading-body-lg: 1.5;
  --text-subheading: 18px;
  --leading-subheading: 1.56;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.33;
  --text-heading: 32px;
  --leading-heading: 1.2;
  --text-heading-lg: 44px;
  --leading-heading-lg: 1.15;
  --text-heading-xl: 52px;
  --leading-heading-xl: 1.1;
  --text-display: 72px;
  --leading-display: 1;

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
  --spacing-56: 56px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-200: 200px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-3xl: 24px;
  --radius-full: 9999px;
}
```
