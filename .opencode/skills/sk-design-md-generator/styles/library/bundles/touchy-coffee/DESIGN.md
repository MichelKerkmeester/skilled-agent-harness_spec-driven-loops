# Touchy Coffee — Style Reference
> Hand-painted coffee zine — earthy paint bands, typewriter labels, and extreme pill buttons on warm matte surfaces.

**Theme:** mixed

Touchy Coffee operates like an indie zine meets corner coffee shop: a rotating cast of earthy, hand-mixed backgrounds (terracotta, sage, sky blue) where the product photography and a bouncy custom script logo do the heavy lifting, and the UI chrome stays deliberately lo-fi. Everything readable is set in Apercu Mono — a monospaced face that reads like a typewriter label, reinforcing the craft, small-batch identity over glossy e-commerce polish. Controls are extreme pills (100px radius), cards are softly rounded (20px), and the color system behaves like a set of paint swatches — lavender, terracotta, moss green, sage gray — applied to full-bleed section bands rather than used as accent dots. Borders are bold and black, text is unapologetically black-on-color, and the overall effect is tactile, warm, and personal rather than slick or optimized.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Ink | `#000000` | `--color-ink` | Body text, borders, pill button fills, logo — the structural constant across every section |
| Sage | `#788c8c` | `--color-sage` | Dominant neutral for section backgrounds, form borders, and the shop canvas — carries the largest surface area on the site |
| Cream | `#ffffff` | `--color-cream` | Card surfaces, input fills, text on dark pill buttons — the only true white, used sparingly as a counterpoint to the painted section bands |
| Terracotta | `#9f4920` | `--color-terracotta` | Hero section background, circular product label accents — warm clay red that grounds the brand in earth and roast |
| Lavender | `#a697c6` | `--color-lavender` | Violet outline accent for tags, dividers, and focused UI edges |
| Moss | `#5b9133` | `--color-moss` | Green accent for outlined action borders, linked labels, and lightweight interactive emphasis. Do not promote it to the primary CTA color |
| Sunshine | `#fff78f` | `--color-sunshine` | Surface band accent, subtle background wash — buttery yellow used as a section break between terracotta and sage |
| Sky | `#d0eaf4` | `--color-sky` | Testimonial section background — washed pale blue providing a cool, airy counterpoint to the warm dominant tones |

## Tokens — Typography

### Apercu Mono — Sole UI typeface — all navigation, body copy, prices, buttons, labels, and links rendered in monospace. The 50px size is reserved for hero display lines; 20-24px is the working range for everything from button text to product names. Monospaced letterforms are a deliberate anti-corporate signal: labels read like typewriter tags stamped on coffee bags, not SaaS chrome. · `--font-apercu-mono`
- **Substitute:** Space Mono, IBM Plex Mono, JetBrains Mono
- **Weights:** 400, 700
- **Sizes:** 20px, 24px, 50px
- **Line height:** 1.20, 1.50
- **Letter spacing:** normal at all sizes
- **Role:** Sole UI typeface — all navigation, body copy, prices, buttons, labels, and links rendered in monospace. The 50px size is reserved for hero display lines; 20-24px is the working range for everything from button text to product names. Monospaced letterforms are a deliberate anti-corporate signal: labels read like typewriter tags stamped on coffee bags, not SaaS chrome.

### Touchy Script (custom) — Custom hand-drawn bouncy script used exclusively for the wordmark 'touchy coffee'. The letterforms are loose, slightly irregular, and bubble-like — the single brand-defining element that signals craft and personality before any product is shown. · `--font-touchy-script-custom`
- **Substitute:** Caveat Brush, Permanent Marker, or Patrick Hand SC for approximate feel — but the actual logo is custom and should not be swapped for a system script
- **Weights:** 400
- **Sizes:** Logo only — roughly 180-220px equivalent on the hero
- **Line height:** 1.0
- **Role:** Custom hand-drawn bouncy script used exclusively for the wordmark 'touchy coffee'. The letterforms are loose, slightly irregular, and bubble-like — the single brand-defining element that signals craft and personality before any product is shown.

### Apercu Mono Bold — Apercu Mono Bold — detected in extracted data but not described by AI · `--font-apercu-mono-bold`
- **Weights:** 700
- **Sizes:** 20px
- **Line height:** 1.2
- **Role:** Apercu Mono Bold — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| subheading | 20px | 1.2 | — | `--text-subheading` |
| heading-sm | 24px | 1.2 | — | `--text-heading-sm` |
| display | 50px | 1.2 | — | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 20 | 20px | `--spacing-20` |
| 40 | 40px | `--spacing-40` |
| 60 | 60px | `--spacing-60` |
| 80 | 80px | `--spacing-80` |
| 100 | 100px | `--spacing-100` |
| 140 | 140px | `--spacing-140` |
| 160 | 160px | `--spacing-160` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 100px |
| cards | 20px |
| images | 20px |
| inputs | 100px |
| buttons | 100px |

### Layout

- **Section gap:** 80px
- **Card padding:** 20px
- **Element gap:** 20px

## Components

### Pill Navigation Button
**Role:** Primary site navigation (HOME, SHOP)

Inverted pill: #000000 background, #ffffff text, 100px border-radius, Apercu Mono Bold 20px uppercase, 10px vertical / 20px horizontal padding. Sits at the top corners of the hero, flat and high-contrast against the terracotta band.

### Shop Product Card
**Role:** Coffee bag product display

White card on Sage background, 20px border-radius, 20px padding. Contains a 20px-radius product photo of a kraft coffee bag, a 100px-radius circular accent label (Terracotta, pink, or dark) with the roast origin name in Apercu Mono, the product name in Apercu Mono 20px, and two stacked pill controls below.

### Size Selector Pill
**Role:** Product size and price display

Ghost pill: 1px #000000 border, 100px radius, Apercu Mono 20px, shows size + price (e.g. '12 OZ $27'). Outlined only — no fill.

### Add to Cart Pill
**Role:** Quantity stepper and add action

Outlined pill: 1px #000000 border, 100px radius, Apercu Mono Bold 20px uppercase. Contains a '- 1 +' stepper on the left and 'ADD' label on the right, separated by a thin vertical divider. No fill color — relies on black border for definition.

### Testimonial Card
**Role:** Customer review display

Solid color card (Moss green or Terracotta) with 20px radius, 20px padding. Five 5-pointed stars at the top (pink or yellow fill, ~28px), customer name in underlined Apercu Mono Bold 20px, review text in Apercu Mono 20px at 1.5 line-height. No shadow — color is the card.

### Progress Bar (Custom)
**Role:** Shop section decorative indicator

Long horizontal pill: 100px radius, Lavender (#a697c6) fill with a darker outlined track inside, containing a left-arrow icon. Sits centered below the product grid as a stylistic flourish, not a functional progress indicator.

### Newsletter Popup
**Role:** Email capture overlay

Pink (#f5b5c8) rounded card, 20px radius, positioned bottom-right. Header in Apercu Mono Bold 20px with a dismiss 'X' in the top-right corner. Body copy in Apercu Mono 20px, email input is a Cream (#ffffff) pill with 100px radius and black border, paired with a black 'SEND' pill button.

### Star Rating
**Role:** Visual review score indicator

Row of five 5-pointed star glyphs, each ~24-28px, filled in warm colors (pink #f5b5c8 or yellow #fff78f). No stroke — solid flat shapes, no outlined stars.

### Circular Origin Label
**Role:** Product origin badge on bag

100px radius circle (fully round), solid color fill (Terracotta, hot pink, or near-black), 20px padding. Origin name in Apercu Mono Bold uppercase, centered. Sits on the upper-left of the product photo as a stamp.

### Bottom Marquee Ticker
**Role:** Scrolling brand tagline strip

Full-width black band, white Apercu Mono 20px uppercase text, left-scrolling. Content is a continuous brand description ('WITH JUST THE RIGHT AMOUNT OF SHADE [leaf icon] THE SEED IS TENDERLY ATTENDED TO AS IT GROWS AND IT EVENTUALLY BLOSSOMS'). Repeats infinitely.

### Side Vertical Nav
**Role:** Secondary left-edge navigation

Vertically stacked Apercu Mono 20px links ('IN', 'OUR', 'SHOP') in black, left-aligned with wide letter-spacing, positioned along the left edge of the shop section. Acts as a supplementary nav, not a replacement for the top pills.

## Do's and Don'ts

### Do
- Use 100px border-radius for all interactive elements (buttons, inputs, tags, origin labels) — the extreme pill is the signature shape
- Use 20px border-radius for all cards and product images — the softer square gives containers a distinct identity from controls
- Set all UI text in Apercu Mono (or Space Mono / IBM Plex Mono substitute) — monospace is the brand's typographic signature, not a fallback
- Use full-bleed section bands of solid color (Terracotta, Sage, Sky) rather than card-on-white patterns — the site paints walls, not cards
- Reserve #000000 for text, borders, and inverted pill buttons — black is the ink that makes the painted backgrounds readable
- Use the custom script wordmark only for the brand name 'touchy coffee' — never set headlines in the script; headlines stay monospaced
- Apply color via background bands and card fills, not via accent dots or small chips — color here is architectural, not decorative

### Don't
- Don't use sharp corners (0-4px radius) on any interactive element — the pill is mandatory
- Don't introduce a sans-serif typeface for UI text — the monospaced constraint is what makes the brand read as craft, not commerce
- Don't use drop shadows or elevation on cards — the design relies on color contrast and border weight, not depth
- Don't place body content on a white page background — sections always live on a painted band (Sage, Terracotta, Sky, or Sunshine)
- Don't use the Terracotta or Lavender as small UI accents — they are section-scale colors, applied to full-bleed surfaces
- Don't center-align body text — the design uses left-aligned monospaced blocks that read like stamped labels
- Don't use icon outlines or line-style iconography — icons (arrow, star, leaf) are flat solid shapes, matched in visual weight to the bold borders

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Terracotta Band | `#9f4920` | Hero section canvas — warm clay full-bleed background |
| 2 | Sage Band | `#788c8c` | Shop/product grid section — dominant neutral canvas |
| 3 | Sky Band | `#d0eaf4` | Testimonials section — airy cool break between warm bands |
| 4 | Card Surface | `#ffffff` | Product cards, testimonial cards, newsletter popup — the elevated readable surface |

## Imagery

Product photography is the primary visual: tight, well-lit shots of kraft-paper coffee bags centered on flat backgrounds, each bag featuring a hand-applied circular origin label. No lifestyle photography, no hands holding mugs, no cafe interiors — the product is the subject. Surrounding graphics are minimal: flat solid star shapes, a single left-arrow icon, and a leaf glyph in the marquee. The wordmark script and the monospaced labels carry more visual personality than any illustration. Image treatment: contained within cards with 20px radius, no bleed, no overlays, no duotone.

## Layout

Full-bleed horizontal section bands stacked vertically: Terracotta hero (centered logo + tagline) → Sage shop section (3-column product grid) → Sky testimonials section (3-column review cards). Each band fills the viewport width and uses 80px vertical gaps. Navigation sits in the top corners of the hero (pill buttons) and as a vertical left-edge stack in the shop section. The product grid is 3 columns on desktop with generous 40-60px gaps. A black marquee ticker runs along the very bottom, full-width. No sidebar, no max-width container — the layout is edge-to-edge painted surfaces with content breathing inside them.

## Agent Prompt Guide

**Quick Color Reference**
- text: #000000
- background (sections): rotate between #9f4920 (Terracotta), #788c8c (Sage), #d0eaf4 (Sky)
- card surface: #ffffff
- border: #000000
- accent (progress bar, newsletter): #a697c6 (Lavender)
- primary action: #000000 (filled action)

**3-5 Example Component Prompts**

1. Create a hero section: full-bleed #9f4920 Terracotta background. Centered custom 'touchy coffee' script logo at ~200px in #000000. Below it, Apercu Mono 20px #000000 uppercase tagline 'SENSATIONAL COFFEES ROASTED IN TROY, NY'. Top-left corner: black pill button ('HOME', Apercu Mono Bold 20px white, 100px radius, 10px 20px padding). Top-right corner: identical black pill ('SHOP').

2. Create a product card on a #788c8c Sage background: white card with 20px radius and 20px padding. Contains a 20px-radius product photo of a kraft coffee bag. Top-left of the bag: 100px-radius Terracotta circle with 'COLOMBIA AURA DIAZ' in Apercu Mono Bold 20px white. Below photo: product name in Apercu Mono 20px #000000. Then two stacked pills: (a) outlined 100px-radius size selector ('↓ 12 OZ $27', 1px #000000 border, Apercu Mono 20px) and (b) outlined 100px-radius add control ('- 1 + | ADD', 1px #000000 border, Apercu Mono Bold 20px uppercase).

3. Create a testimonial card: solid #5b9133 Moss background, 20px radius, 20px padding. Top row: five solid pink (#f5b5c8) star shapes at 28px. Below: customer name in underlined Apercu Mono Bold 20px #000000, then 3-4 lines of review text in Apercu Mono 20px #000000 at 1.5 line-height. No shadow, no border — color is the card.

4. Create a newsletter popup: #f5b5c8 pink background, 20px radius, 300-360px width, positioned bottom-right. Header 'NEWSLETTER' in Apercu Mono Bold 20px #000000 with an 'X' close icon top-right. Body text in Apercu Mono 20px #000000. Email input: #ffffff pill with 100px radius, 1px #000000 border, placeholder 'YOUR EMAIL' in Apercu Mono 20px. Beside it: black 'SEND' pill (#000000 fill, #ffffff text, 100px radius, Apercu Mono Bold 20px).

5. Create a bottom marquee ticker: full-width #000000 band, 40-50px tall. Scrolling #ffffff Apercu Mono 20px uppercase text with a small leaf icon (solid #9f4920, ~16px) between phrases. Content repeats: 'WITH JUST THE RIGHT AMOUNT OF SHADE [leaf] THE SEED IS TENDERLY ATTENDED TO AS IT GROWS AND IT EVENTUALLY BLOSSOMS'.

## Color Band System

The site uses full-bleed color bands as its primary structural device rather than a white page with cards. The band sequence from top to bottom is: Terracotta (#9f4920) → Sage (#788c8c) → Sky (#d0eaf4). Each band fills 100% viewport width. White card surfaces sit on top of the bands as readable containers. This is not an accent-color system — it is a wall-paint system. When building new pages, assign each major section a band color from this palette and let the section's background do the brand work, with white cards for content. Do not introduce a white page background or a neutral gray section; the absence of a band would feel like the system is missing a wall.

## Similar Brands

- **Blue Bottle Coffee** — Similar commitment to a tight, restrained palette and a custom wordmark that carries brand identity, though Blue Bottle is far more minimal and sans-serif where Touchy is monospaced and zine-like
- **Stumptown Coffee** — Both treat the product bag as the hero image and rely on bold stamped labels with origin names, but Touchy's monospaced typography and full-bleed paint bands are far more playful
- **Cuvée Coffee** — Independent roaster with a hand-crafted visual identity and extreme pill-shaped UI controls, though Cuvée leans darker and more editorial where Touchy is warm and color-blocked
- **Onyx Coffee Lab** — Specialty roaster using bold geometric section bands and a strong typographic identity, but Onyx uses clean sans-serif where Touchy is unapologetically monospaced

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-ink: #000000;
  --color-sage: #788c8c;
  --color-cream: #ffffff;
  --color-terracotta: #9f4920;
  --color-lavender: #a697c6;
  --color-moss: #5b9133;
  --color-sunshine: #fff78f;
  --color-sky: #d0eaf4;

  /* Typography — Font Families */
  --font-apercu-mono: 'Apercu Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-touchy-script-custom: 'Touchy Script (custom)', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-apercu-mono-bold: 'Apercu Mono Bold', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-subheading: 20px;
  --leading-subheading: 1.2;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.2;
  --text-display: 50px;
  --leading-display: 1.2;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-20: 20px;
  --spacing-40: 40px;
  --spacing-60: 60px;
  --spacing-80: 80px;
  --spacing-100: 100px;
  --spacing-140: 140px;
  --spacing-160: 160px;

  /* Layout */
  --section-gap: 80px;
  --card-padding: 20px;
  --element-gap: 20px;

  /* Border Radius */
  --radius-2xl: 20px;
  --radius-full: 100px;

  /* Named Radii */
  --radius-tags: 100px;
  --radius-cards: 20px;
  --radius-images: 20px;
  --radius-inputs: 100px;
  --radius-buttons: 100px;

  /* Surfaces */
  --surface-terracotta-band: #9f4920;
  --surface-sage-band: #788c8c;
  --surface-sky-band: #d0eaf4;
  --surface-card-surface: #ffffff;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-ink: #000000;
  --color-sage: #788c8c;
  --color-cream: #ffffff;
  --color-terracotta: #9f4920;
  --color-lavender: #a697c6;
  --color-moss: #5b9133;
  --color-sunshine: #fff78f;
  --color-sky: #d0eaf4;

  /* Typography */
  --font-apercu-mono: 'Apercu Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-touchy-script-custom: 'Touchy Script (custom)', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-apercu-mono-bold: 'Apercu Mono Bold', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-subheading: 20px;
  --leading-subheading: 1.2;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.2;
  --text-display: 50px;
  --leading-display: 1.2;

  /* Spacing */
  --spacing-20: 20px;
  --spacing-40: 40px;
  --spacing-60: 60px;
  --spacing-80: 80px;
  --spacing-100: 100px;
  --spacing-140: 140px;
  --spacing-160: 160px;

  /* Border Radius */
  --radius-2xl: 20px;
  --radius-full: 100px;
}
```
