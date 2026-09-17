# Literal — Style Reference
> Library in soft daylight — a reading room where warm cream walls meet dark walnut shelves.

**Theme:** light

Literal is a literary reading room rendered in soft daylight: a near-monochrome canvas where the only chromatic note is a single forest green that marks the primary action. Headlines speak in a warm bookish serif (Libre Baskerville) while every functional element stays in clean geometric Inter, creating a quiet tension between editorial and digital. Surfaces are paper-like — soft warm gray canvas beneath pure white cards with hairline borders and almost no shadow. The whole experience is calm, spacious, and content-led, with book covers and product screenshots doing the visual work that color and ornament don't.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Forest Green | `#278458` | `--color-forest-green` | Primary CTA fill, brand accent, star glyph in wordmark, active states — a single chromatic note anchoring an otherwise achromatic interface |
| Charcoal | `#444340` | `--color-charcoal` | Primary body and UI text, icon strokes, default border outlines |
| Soft Gray | `#f8f8f8` | `--color-soft-gray` | Page canvas and section backgrounds — warm off-white that makes white cards feel layered rather than floating |
| Warm Gray | `#9a988b` | `--color-warm-gray` | Muted helper text, secondary metadata, list dividers, de-emphasized links |
| Hairline Gray | `#eeeeee` | `--color-hairline-gray` | Card and component borders, subtle dividers between sections and list items |
| Paper White | `#ffffff` | `--color-paper-white` | Card surfaces, button text, input fills — the elevated surface above the gray canvas |
| Ink Black | `#000000` | `--color-ink-black` | Heading text, dark secondary action fill (App Store button), heavy borders on featured headings |

## Tokens — Typography

### Inter — All functional UI — body copy, buttons, navigation, inputs, captions, feature descriptions, hero subtext · `--font-inter`
- **Substitute:** system-ui, -apple-system, Segoe UI, Roboto
- **Weights:** 400, 500, 700
- **Sizes:** 14, 15, 16, 22, 40
- **Line height:** 1.35–1.50
- **Role:** All functional UI — body copy, buttons, navigation, inputs, captions, feature descriptions, hero subtext

### Libre Baskerville — Reserved exclusively for section and page headings — the serif is the editorial signal that separates display from interface · `--font-libre-baskerville`
- **Substitute:** Lora, Source Serif Pro, Crimson Text
- **Weights:** 500
- **Sizes:** 28
- **Line height:** 1.35
- **Role:** Reserved exclusively for section and page headings — the serif is the editorial signal that separates display from interface

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 14px | 1.45 | — | `--text-caption` |
| body | 16px | 1.45 | — | `--text-body` |
| subheading | 22px | 1.4 | — | `--text-subheading` |
| heading | 28px | 1.35 | — | `--text-heading` |
| display | 40px | 1.35 | — | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 8 | 8px | `--spacing-8` |
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 28 | 28px | `--spacing-28` |
| 40 | 40px | `--spacing-40` |
| 80 | 80px | `--spacing-80` |
| 160 | 160px | `--spacing-160` |
| 180 | 180px | `--spacing-180` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 8px |
| other | 16px |
| images | 4px |
| buttons | 4px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 20px
- **Element gap:** 20px

## Components

### Primary CTA Button
**Role:** Main conversion action — appears once or twice per section, always green

Filled #278458 background, white text, Inter 15px weight 500, 4px radius, 14px vertical × 28px horizontal padding, right-arrow glyph after label. 100% width on mobile, auto on desktop.

### Dark App Store Button
**Role:** Secondary download CTA paired alongside the primary CTA

Filled #000000 background, white text, Inter 15px weight 500, 4px radius, 14px × 28px padding. Apple glyph precedes the two-line label 'Download on the App Store'.

### Ghost Nav Button (Sign in)
**Role:** Tertiary navigation action in the header

Transparent background, #444340 text, Inter 15px weight 400, no border. Underline on hover.

### Search Input
**Role:** Global search field in the navigation bar

Borderless, transparent background, #444340 placeholder text, magnifying-glass icon at left. Sits flush in the nav bar with no visible container — the absence of a border is the design statement.

### Feature Card
**Role:** Product capability card in the 3-column feature grid

#ffffff background, 1px #eeeeee border, 8px radius, 20px padding. Contains a serif subheading (Inter 22px weight 700 or Libre Baskerville 28px weight 500) followed by bullet text or a product screenshot. Optional very faint shadow (rgba 0,0,0,0.04) reinforces elevation without weight.

### Testimonial Card
**Role:** Social-proof card in the 'Loved by everyone' grid

#ffffff background, 1px #eeeeee border, 8px radius, 20px padding. Layout: avatar (circular, ~40px) + display name in Inter 15px weight 500 + verified check + platform glyph on one row, quote text in Inter 15px weight 400 below.

### Section Heading (Serif)
**Role:** Editorial section title — the moment where the page breathes

Libre Baskerville 28px weight 500, #000000, centered alignment, line-height 1.35. The only place the serif appears outside feature card subheadings.

### Hero Headline (Serif)
**Role:** Page-level editorial title

Libre Baskerville-style serif at 40px weight 500, #000000, centered, line-height 1.35. Two-line stack, roughly 8–12 words.

### Book Cover Collage
**Role:** Decorative hero visual — books arranged in a scattered but balanced cluster

Individual book covers rendered as 4px-radius rectangular thumbnails, no shadows, slight rotation variation, layered with subtle overlap. Covers provide all the color in the hero; no background tint or framing device.

### Product Screenshot Tile
**Role:** In-feature visual showing the app interface (reading tracker, library list, scanner)

Phone or interface mockup placed inside a feature card, contained with 4px radius, no device frame, sits on the white card background as a clean screenshot.

### Navigation Bar
**Role:** Sticky top header with brand, search, and actions

White background, #ffffff, 1px #eeeeee bottom border. Left: wordmark 'Literal' in Inter 22px weight 700 + green asterisk glyph. Center: full-width search input. Right: 'Sign in' ghost link + green 'Join →' CTA button. Height roughly 60px.

### Bullet List (Feature Points)
**Role:** Supporting list of capabilities inside feature cards

Inter 15px weight 400, #444340, 10px vertical gap between items, no bullets or checkmarks — clean text stack only.

## Do's and Don'ts

### Do
- Use #278458 green exclusively for the primary CTA and the brand star glyph — never as a decorative accent on text, icons, or borders
- Set headings in Libre Baskerville 28–40px weight 500; never substitute Inter or a system serif for display type
- Keep the page canvas at #f8f8f8 and card surfaces at #ffffff with a 1px #eeeeee border — avoid colored card backgrounds or drop shadows beyond rgba(0,0,0,0.04)
- Use 4px radius for buttons and images, 8px for cards, 16px for large media blocks — never mix intermediate values like 6px or 12px
- Center all section headings and keep the 3-column grid consistent across feature and testimonial sections
- Default to Inter 15–16px weight 400 for body text with 1.45–1.50 line-height — this is the reading-optimized baseline
- Maintain 80px vertical section gaps to preserve the airy, page-of-a-book feel

### Don't
- Do not introduce a second chromatic color — the monochromatic system is the brand
- Do not use Libre Baskerville for body text, captions, buttons, or any UI element — it is reserved for headings only
- Do not use #000000 as a primary CTA fill — #278458 owns that role; #000000 is only for the dark App Store button and heading text
- Do not apply heavy drop shadows, glows, or colored shadows — elevation is communicated through border and a 1–2% opacity shadow only
- Do not use rounded pill buttons or radii above 16px — the system is crisp and bookish, not bubbly
- Do not add gradients, glassmorphism, or background images to cards or sections — surfaces stay flat
- Do not break the centered, symmetric layout with asymmetric or left-aligned hero compositions — the page reads like a printed page

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#f8f8f8` | Page background and section bands |
| 1 | Card | `#ffffff` | Feature cards, testimonial cards, input fields |
| 2 | Ink | `#000000` | Dark secondary action surface (App Store download) |
| 3 | Brand | `#278458` | Primary action surface (Join for free, Sign up now) |

## Elevation

- **Feature card:** `0 1px 3px rgba(0,0,0,0.04), 0 0 0 1px #eeeeee`
- **Testimonial card:** `0 1px 3px rgba(0,0,0,0.04), 0 0 0 1px #eeeeee`

## Imagery

Imagery is content-driven, not decorative. The hero uses a scattered collage of real book covers (4px-radius thumbnails, slight overlap, no framing) that supply all the color the page otherwise lacks. Feature sections insert clean product screenshots — phone-shaped reading tracker, library list, camera scanner UI — rendered without device bezels, sitting directly on white card surfaces. The social-proof section uses circular user avatars from Twitter. There is no stock photography, no abstract gradient art, no illustrations. Icons are line-based, single-stroke, #444340 or #9a988b.

## Layout

Page is max-width contained at ~1200px, centered, with a sticky white nav bar at the top. The hero is a centered vertical stack: serif headline, short subtext, two CTAs side by side, then the book-cover collage below. Feature sections alternate between the #f8f8f8 canvas and white card content arranged in a 3-column grid with generous 80px section gaps. Testimonials repeat the 3-column pattern. The rhythm is always: serif heading → optional CTA → grid of cards. Navigation is a single top bar with a full-width inline search; there is no sidebar, no mega-menu, no sticky in-page nav.

## Agent Prompt Guide

**Quick Color Reference**
- text: #444340
- background: #f8f8f8
- border: #eeeeee
- card surface: #ffffff
- accent: #278458
- primary action: #278458 (filled action)

**3-5 Example Component Prompts**

1. Create a Primary Action Button: #278458 background, #ffffff text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.

2. *Create a feature card*: #ffffff background, 1px #eeeeee border, 8px radius, 20px padding, optional shadow 0 1px 3px rgba(0,0,0,0.04). Card contains a subheading in Inter 22px weight 700 #000000, followed by a bullet list in Inter 15px weight 400 #444340 with 10px row gap, then a product screenshot at 4px radius.

3. *Create a testimonial card*: #ffffff background, 1px #eeeeee border, 8px radius, 20px padding. Top row: 40px circular avatar + display name in Inter 15px weight 500 #444340 + verified glyph. Body: quote text in Inter 15px weight 400 #444340, line-height 1.50.

4. *Create the navigation bar*: #ffffff background, 1px #eeeeee bottom border, 60px height. Left: 'Literal' wordmark in Inter 22px weight 700 #000000 followed by a green #278458 asterisk glyph. Center: full-width search input with borderless transparent background and #9a988b placeholder text 'Search for books, authors, shelves, users…'. Right: 'Sign in' ghost link in Inter 15px weight 400 #444340, then green #278458 'Join →' button (4px radius, 14px 24px padding, Inter 15px weight 500, white text).


## Similar Brands

- **Are.na** — Same literary-editorial sensibility: monochromatic warm canvas, serif headlines against sans body, single accent-free palette that lets content carry the color
- **Read.cv** — Mirror-image visual system: near-white canvas, generous whitespace, serif display type, restrained single-accent approach, bookish/magazine-like cadence
- **Substack** — Same serif-heading + clean-Inter-body pairing on a white canvas with minimal ornament, the same feeling of reading a printed page on screen
- **Goodreads** — Same domain (book tracking) and same flat, content-led layout language — though Literal is far more restrained and monochromatic where Goodreads is denser and warmer

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-forest-green: #278458;
  --color-charcoal: #444340;
  --color-soft-gray: #f8f8f8;
  --color-warm-gray: #9a988b;
  --color-hairline-gray: #eeeeee;
  --color-paper-white: #ffffff;
  --color-ink-black: #000000;

  /* Typography — Font Families */
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-libre-baskerville: 'Libre Baskerville', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.45;
  --text-body: 16px;
  --leading-body: 1.45;
  --text-subheading: 22px;
  --leading-subheading: 1.4;
  --text-heading: 28px;
  --leading-heading: 1.35;
  --text-display: 40px;
  --leading-display: 1.35;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-40: 40px;
  --spacing-80: 80px;
  --spacing-160: 160px;
  --spacing-180: 180px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 20px;
  --element-gap: 20px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-2xl: 16px;

  /* Named Radii */
  --radius-cards: 8px;
  --radius-other: 16px;
  --radius-images: 4px;
  --radius-buttons: 4px;

  /* Surfaces */
  --surface-canvas: #f8f8f8;
  --surface-card: #ffffff;
  --surface-ink: #000000;
  --surface-brand: #278458;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-forest-green: #278458;
  --color-charcoal: #444340;
  --color-soft-gray: #f8f8f8;
  --color-warm-gray: #9a988b;
  --color-hairline-gray: #eeeeee;
  --color-paper-white: #ffffff;
  --color-ink-black: #000000;

  /* Typography */
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-libre-baskerville: 'Libre Baskerville', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.45;
  --text-body: 16px;
  --leading-body: 1.45;
  --text-subheading: 22px;
  --leading-subheading: 1.4;
  --text-heading: 28px;
  --leading-heading: 1.35;
  --text-display: 40px;
  --leading-display: 1.35;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-40: 40px;
  --spacing-80: 80px;
  --spacing-160: 160px;
  --spacing-180: 180px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-2xl: 16px;
}
```
