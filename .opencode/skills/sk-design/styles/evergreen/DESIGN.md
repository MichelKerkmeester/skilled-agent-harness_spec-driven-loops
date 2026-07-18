# Evergreen — Style Reference
> Sunlit greenhouse on linen paper

**Theme:** light

Evergreen uses a warm editorial language on a cream linen canvas, pairing a high-contrast didone-influenced serif for headlines with a friendly geometric sans for body. The palette is nearly monochrome — black ink, warm off-white surfaces, and a single soft sage mint used as organic highlight wash, never as decoration. The only saturated color is botanical and appears as a quiet accent inside avatars, badges, and illustrative leaves, never on buttons or large blocks. Components are rounded and tactile: pill-shaped primary buttons in pure black, 10px card radii, soft cream cards floating on the warmer page tone. Layout is centered and generous, with serif headlines large enough to dominate each section, body copy kept short and confident, and product/recognition mockups framed by hand-drawn leaf illustrations that bleed past their container edges.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Linen Canvas | `#edede2` | `--color-linen-canvas` | Page background — the warm off-white base all sections sit on; this is the dominant surface of the entire site |
| Bone Card | `#fffff3` | `--color-bone-card` | Card and elevated surface background — slightly lighter than the canvas so cards read as lifted paper without shadow |
| Pure White | `#ffffff` | `--color-pure-white` | Reserved for inverted text on dark buttons, product mockup surfaces, and high-contrast inline elements |
| Ink Black | `#000000` | `--color-ink-black` | Primary action button fill, heading text, hairline borders, and the announcement bar — the high-contrast workhorse |
| Charcoal | `#333333` | `--color-charcoal` | Secondary text, icon strokes, and soft border definition where pure black would feel too heavy |
| Sage Mint | `#beedc0` | `--color-sage-mint` | Organic highlight wash for avatar backgrounds, tag pills, and the soft glow behind recognition cards — the only chromatic color, used like a botanical accent |

## Tokens — Typography

### ivypresto-headline — Display and hero headlines only. This high-contrast didone-flavored serif at 74px (hero) and 54px (section) is the brand's signature voice — generous letterforms, tight leading, and weight 600 carry authority without feeling corporate. Mixed inline with circular avatar images to embed people into the sentence itself. · `--font-ivypresto-headline`
- **Substitute:** Playfair Display, DM Serif Display
- **Weights:** 600
- **Sizes:** 54px, 74px
- **Line height:** 1.40–1.49
- **Role:** Display and hero headlines only. This high-contrast didone-flavored serif at 74px (hero) and 54px (section) is the brand's signature voice — generous letterforms, tight leading, and weight 600 carry authority without feeling corporate. Mixed inline with circular avatar images to embed people into the sentence itself.

### Rubik — All non-headline text: subheadings, body, button labels, form labels, badges. Weight 400 for body paragraphs, 500–600 for buttons and tags, 700 sparingly for emphasized stats. Friendly geometric sans balances the editorial serif above it. · `--font-rubik`
- **Substitute:** DM Sans, Inter
- **Weights:** 400, 500, 600, 700
- **Sizes:** 12px, 17px, 18px, 19px, 20px, 21px, 23px, 28px, 30px
- **Line height:** 1.41–1.90
- **Role:** All non-headline text: subheadings, body, button labels, form labels, badges. Weight 400 for body paragraphs, 500–600 for buttons and tags, 700 sparingly for emphasized stats. Friendly geometric sans balances the editorial serif above it.

### Arial — Small UI labels and icon-adjacent micro-copy where a system font suffices · `--font-arial`
- **Substitute:** system-ui, -apple-system
- **Weights:** 400
- **Sizes:** 12px
- **Line height:** 1.60
- **Role:** Small UI labels and icon-adjacent micro-copy where a system font suffices

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.6 | — | `--text-caption` |
| body-sm | 17px | 1.9 | — | `--text-body-sm` |
| body | 19px | 1.9 | — | `--text-body` |
| subheading-sm | 21px | 1.7 | — | `--text-subheading-sm` |
| subheading | 23px | 1.54 | — | `--text-subheading` |
| heading-sm | 30px | 1.41 | — | `--text-heading-sm` |
| heading | 54px | 1.48 | — | `--text-heading` |
| display | 74px | 1.4 | — | `--text-display` |

## Tokens — Spacing & Shapes

**Density:** spacious

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 5 | 5px | `--spacing-5` |
| 10 | 10px | `--spacing-10` |
| 12 | 12px | `--spacing-12` |
| 14 | 14px | `--spacing-14` |
| 15 | 15px | `--spacing-15` |
| 18 | 18px | `--spacing-18` |
| 24 | 24px | `--spacing-24` |
| 29 | 29px | `--spacing-29` |
| 30 | 30px | `--spacing-30` |
| 36 | 36px | `--spacing-36` |
| 42 | 42px | `--spacing-42` |
| 48 | 48px | `--spacing-48` |
| 50 | 50px | `--spacing-50` |
| 60 | 60px | `--spacing-60` |
| 72 | 72px | `--spacing-72` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 46px |
| cards | 10px |
| links | 30px |
| inputs | 7px |
| buttons | 40.5px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 120px
- **Card padding:** 20px
- **Element gap:** 14px

## Components

### Primary Pill Button
**Role:** Main call-to-action ('Start 14 Day Trial')

Filled black pill, 40.5px radius, horizontal padding ~24px, vertical padding ~14px. Label in Rubik 500, white (#ffffff), 16–18px. Pure black (#000000) fill creates the only dark surface on the cream canvas, making the action feel switched on.

### Ghost Pill Button
**Role:** Secondary action ('Schedule a demo')

Outlined pill, 40.5px radius, 1px #000000 border, transparent fill. Rubik 500 label in #000000. Sits in the top nav and offers a quieter alternative to the primary black fill.

### Ink Announcement Bar
**Role:** Top-of-page banner for promos or feature highlights

Full-bleed #000000 strip, white Rubik 400–500 text ~14–16px, centered. A single underlined link in white gives it editorial weight. Acts as the page's only dark band before the cream body.

### Editorial Headline Block
**Role:** Hero and section headings

IvyPresto Headline 600 at 74px (hero) or 54px (section), line-height ~1.4, color #000000. Center-aligned. Circular avatar images (sage mint #beedc0 background) are inserted inline mid-sentence — the headline reads as a sentence with faces, not a headline with badges below.

### Product Mockup Frame
**Role:** Showcases the recognition feed UI

Container card with #fffff3 background, 10px radius, and decorative green leaf illustrations drawn behind/beside it that extend past its edges. Inner UI shows a dark plum/purple sidebar next to a white feed of recognition cards. Leaves are the brand's signature bleed-element.

### Recognition Feed Card
**Role:** Individual recognition entry inside the product mockup

White (#ffffff) card on a near-white feed background, ~10px radius, subtle hairline border. Two circular avatar photos flanking a sentence in Rubik 400. Recognition counts (fires, seeds, values) sit inline as small pill tags.

### Avatar Circle with Sage Wash
**Role:** User avatars throughout the product UI and hero

Circular image, ~48–64px, with a #beedc0 sage mint background plate behind the crop. The mint never fills the avatar — it acts as a glowing halo around portrait photos.

### Pill Tag
**Role:** Stat highlights, seed counts, value labels

Fully rounded 46px radius, small Rubik 500–600 label at 12–14px, soft background. Used for social proof numbers like '+500 000 trees planted' and inline recognition values ('Grit', 'Forward').

### Integrations Strip
**Role:** Displays Slack, Teams, and other partner logos

A horizontal row of integration brand marks (Slack rainbow, Teams blue) on the cream background, each paired with a Rubik 'add to Slack / Add to Teams' label. The multicolor partner logos are the only spots of pure color saturation on the page.

### Feature List Row
**Role:** Three-up feature explanations ('No setup cost', etc.)

Three equal-width columns on cream background, each with a small icon above a Rubik 400–500 label, centered. No card containers, no dividers — separation comes from whitespace alone.

### Top Navigation Bar
**Role:** Primary site navigation

Transparent on the cream canvas. Evergreen wordmark with a green leaf icon at left, horizontal Rubik 500 links (Home, ESG, Pricing, Customers, Purpose, Login) at center, and a ghost pill 'Schedule a demo' at right. No background, no shadow — the nav floats in the page tone.

### Body Text Block
**Role:** Supporting paragraph copy under hero/section headlines

Rubik 400, ~19px, line-height ~1.9, color #000000, centered, max-width ~620px. The generous leading and large size let the text breathe as a counterweight to the dense serif headlines.

## Do's and Don'ts

### Do
- Use IvyPresto Headline 600 at 54–74px for all page and section headlines — never substitute a sans-serif here
- Fill primary CTAs with #000000 at 40.5px pill radius and white Rubik 500 label; no other color should ever fill a button
- Use #edede2 as the page background and #fffff3 for card surfaces — never invert to pure white cards on white or dark themes
- Place circular portrait photos on a #beedc0 sage mint halo, not inside square frames, and never fill large blocks with the green
- Center hero headlines and body copy within a max-width of ~1200px, letting the serif occupy the full width of the page
- Decorate product mockups with hand-drawn green leaf illustrations that bleed past the card edges into the surrounding cream
- Set body copy at 19px with 1.9 line-height in Rubik 400 — tight leading would fight the airy editorial rhythm

### Don't
- Don't use sage mint (#beedc0) as a button fill, link color, or large background — it's an accent wash, not a brand color for action
- Don't introduce additional accent colors, gradients, or saturated hues — the palette is intentionally monochrome with one botanical tint
- Don't apply box-shadow to cards, buttons, or images — lift comes from the cream-on-cream surface stack only
- Don't set headlines below 54px; the serif is designed for editorial scale and loses its presence at body sizes
- Don't use square or 4px-radius buttons; all interactive elements are pills (40.5px) or fully rounded tags (46px)
- Don't fill backgrounds with #ffffff for the page; only #edede2 carries the warm linen character
- Don't use sans-serif or system fonts for headlines — IvyPresto (or Playfair Display) is the brand's typographic identity

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Linen Canvas | `#edede2` | Page background — the warm base tone every section sits on |
| 1 | Bone Card | `#fffff3` | Card surfaces, product mockup panels, and recognition feed containers |
| 2 | Pure White | `#ffffff` | Inverted button text, inline highlight blocks, and inner product UI |
| 3 | Ink Black | `#000000` | Announcement bar and primary button fill — the darkest surface |

## Elevation

- **Product mockup card:** `none — separation achieved through #fffff3 surface on #edede2 canvas, no shadow`
- **Recognition feed cards:** `none — flat with hairline border instead of shadow`
- **Primary pill button:** `none — the pure black fill on cream is sufficient contrast`

## Imagery

Imagery is minimal and editorial. The site uses circular portrait photography exclusively — no landscapes, no lifestyle scenes, no stock imagery. Avatars appear both inline within headline sentences and as product UI elements, always sitting on a #beedc0 sage mint halo. The only illustrative element is a set of hand-drawn green leaf shapes that decorate the product mockup section, extending past the card's edges to create organic, non-rectangular compositions. The product mockup itself is a styled screenshot rather than a literal capture. Overall visual density is low — text and typography carry the page, with photography and illustration acting as quiet punctuation.

## Layout

The page is a single centered column on a warm cream canvas with no max-width sidebar or asymmetric gutter. The hero opens with a tall top announcement bar, then a logo + horizontal nav row, then a centered editorial headline (serif, 74px) with circular avatar photos embedded inline. Body copy is centered at ~620px max-width, followed by a single centered primary CTA. The product showcase section uses a max-width ~1200px container with the product mockup centered and leaf illustrations bleeding outward. Below the product, a three-column feature row uses equal thirds with no dividers. Subsequent sections alternate between centered serif headlines + short body + CTA blocks. Navigation is a minimal transparent top bar. Vertical rhythm is generous (~120px between sections) and the overall feel is editorial-magazine rather than dashboard-dense.

## Agent Prompt Guide

Quick Color Reference:
- text: #000000
- background: #edede2
- card surface: #fffff3
- border: #333333
- accent: #beedc0 (sage mint, wash only)
- primary action: #000000 (filled action)

Example Component Prompts:

1. Hero headline block: page background #edede2. Centered IvyPresto Headline 600 at 74px, line-height 1.4, color #000000. Two circular portrait photos (64px, with #beedc0 sage mint halo behind) inserted inline between words of the headline sentence.

2. Primary CTA button: 40.5px pill radius, #000000 fill, white Rubik 500 label at 17px, padding 14px vertical and 28px horizontal. Center it below the hero body copy with 40px top margin.

3. Product mockup card: 10px radius, #fffff3 fill, 1px #333333 hairline border, max-width 900px centered. Inside, a white #ffffff feed area on the right and a dark plum sidebar on the left, with two stacked recognition feed cards (white, 10px radius, hairline border). Place hand-drawn green leaf illustrations behind the card that extend ~60px past each side into the cream canvas.

4. Avatar circle: 56px circular photo crop on a #beedc0 sage mint circle background (64px container, photo centered inside). Always circular, never squared.

5. Stat highlight pill: 46px fully rounded tag, #fffff3 fill, 1px #333333 border, Rubik 600 label at 14px in #000000. Used for social proof numbers and inline recognition values.

## Similar Brands

- **Headspace** — Same warm cream backgrounds, soft rounded pill CTAs, and a single botanical accent color used sparingly as highlight wash
- **Calm** — Editorial serif-style headlines on a muted off-white canvas with generous breathing room and minimal decoration
- **Notion** — Monochrome palette with one accent tint, centered editorial layout, and soft rounded card surfaces without heavy shadows
- **Substack** — Cream/linen backgrounds, serif headlines at editorial scale, and a sense of warm, paper-like reading space
- **Loom** — Friendly geometric sans body type paired with confident display headlines, single-accent palette, and pill-shaped primary buttons

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-linen-canvas: #edede2;
  --color-bone-card: #fffff3;
  --color-pure-white: #ffffff;
  --color-ink-black: #000000;
  --color-charcoal: #333333;
  --color-sage-mint: #beedc0;

  /* Typography — Font Families */
  --font-ivypresto-headline: 'ivypresto-headline', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-rubik: 'Rubik', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.6;
  --text-body-sm: 17px;
  --leading-body-sm: 1.9;
  --text-body: 19px;
  --leading-body: 1.9;
  --text-subheading-sm: 21px;
  --leading-subheading-sm: 1.7;
  --text-subheading: 23px;
  --leading-subheading: 1.54;
  --text-heading-sm: 30px;
  --leading-heading-sm: 1.41;
  --text-heading: 54px;
  --leading-heading: 1.48;
  --text-display: 74px;
  --leading-display: 1.4;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-5: 5px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-14: 14px;
  --spacing-15: 15px;
  --spacing-18: 18px;
  --spacing-24: 24px;
  --spacing-29: 29px;
  --spacing-30: 30px;
  --spacing-36: 36px;
  --spacing-42: 42px;
  --spacing-48: 48px;
  --spacing-50: 50px;
  --spacing-60: 60px;
  --spacing-72: 72px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 120px;
  --card-padding: 20px;
  --element-gap: 14px;

  /* Border Radius */
  --radius-md: 7px;
  --radius-lg: 10px;
  --radius-3xl: 30px;
  --radius-3xl-2: 40.5px;
  --radius-3xl-3: 46px;

  /* Named Radii */
  --radius-tags: 46px;
  --radius-cards: 10px;
  --radius-links: 30px;
  --radius-inputs: 7px;
  --radius-buttons: 40.5px;

  /* Surfaces */
  --surface-linen-canvas: #edede2;
  --surface-bone-card: #fffff3;
  --surface-pure-white: #ffffff;
  --surface-ink-black: #000000;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-linen-canvas: #edede2;
  --color-bone-card: #fffff3;
  --color-pure-white: #ffffff;
  --color-ink-black: #000000;
  --color-charcoal: #333333;
  --color-sage-mint: #beedc0;

  /* Typography */
  --font-ivypresto-headline: 'ivypresto-headline', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-rubik: 'Rubik', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.6;
  --text-body-sm: 17px;
  --leading-body-sm: 1.9;
  --text-body: 19px;
  --leading-body: 1.9;
  --text-subheading-sm: 21px;
  --leading-subheading-sm: 1.7;
  --text-subheading: 23px;
  --leading-subheading: 1.54;
  --text-heading-sm: 30px;
  --leading-heading-sm: 1.41;
  --text-heading: 54px;
  --leading-heading: 1.48;
  --text-display: 74px;
  --leading-display: 1.4;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-5: 5px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-14: 14px;
  --spacing-15: 15px;
  --spacing-18: 18px;
  --spacing-24: 24px;
  --spacing-29: 29px;
  --spacing-30: 30px;
  --spacing-36: 36px;
  --spacing-42: 42px;
  --spacing-48: 48px;
  --spacing-50: 50px;
  --spacing-60: 60px;
  --spacing-72: 72px;

  /* Border Radius */
  --radius-md: 7px;
  --radius-lg: 10px;
  --radius-3xl: 30px;
  --radius-3xl-2: 40.5px;
  --radius-3xl-3: 46px;
}
```
