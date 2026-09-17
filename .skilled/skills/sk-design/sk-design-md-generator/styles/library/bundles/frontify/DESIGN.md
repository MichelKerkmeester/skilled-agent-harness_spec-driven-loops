# Frontify — Style Reference
> Warm atelier with orange punctuation — a museum catalog rendered in cream and ink, where a single warm orange acts as the only raised voice in an otherwise hushed room.

**Theme:** light

Frontify operates as an editorial brand-management workspace: a warm cream canvas (#f0f0eb) holds white card surfaces and dark teal hero moments, with a single vivid orange (#ff3b00) acting as functional punctuation rather than decorative color. Typography carries the identity — a high-contrast serif display face (Cranny) sets an editorial, near-print tone at 40–96px, while a clean grotesque (ABC Diatype) handles all interface text at 14–18px with positive tracking. The system avoids heavy shadows and gradients, relying on warm neutrals, hairline borders, and comfortable 8px-base spacing to create a calm, considered density. Components feel lightweight: 8px card radii, pill buttons at 24–40px, ghost controls, and image-forward compositions where brand assets become the hero content.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Warm Parchment | `#f0f0eb` | `--color-warm-parchment` | Page canvas, hero section dividers, large surface fills — warm cream replaces stark white to soften the entire interface |
| Gallery White | `#ffffff` | `--color-gallery-white` | Card surfaces, elevated panels, button text on dark fills — pure white reserved for objects sitting on the cream canvas |
| Soft Linen | `#e1e1db` | `--color-soft-linen` | Secondary card surface, subtle background fills behind grouped content |
| Mist Gray | `#d7d7cf` | `--color-mist-gray` | Subtle background fills, body section dividers |
| Pale Stone | `#cbcbc5` | `--color-pale-stone` | Light hairline borders on neutral surfaces |
| Ash Gray | `#bfbfb8` | `--color-ash-gray` | Icon strokes, secondary borders, muted decorative elements |
| Graphite Warm | `#575753` | `--color-graphite-warm` | Secondary card text, muted card labels |
| Charcoal Warm | `#464643` | `--color-charcoal-warm` | Body-level borders, secondary text on warm surfaces |
| Ink | `#111110` | `--color-ink` | Primary text, hairline borders across all surfaces, filled button background — the structural neutral that carries nearly all interface weight |
| Signal Orange | `#ff3b00` | `--color-signal-orange` | Sole chromatic accent — highlights, active tags, icon fills, decorative punctuation. Used sparingly to make functional moments feel switched on against the warm monochrome |
| Deep Teal | `#042a2b` | `--color-deep-teal` | Gray outline accent for tags, dividers, and focused UI edges. |

## Tokens — Typography

### Cranny — Display and editorial heading face — high-contrast serif used for hero headlines and section titles at 40–96px. Weight 300 at display sizes creates a whisper-soft authority; weight 400 carries through subheadings. This is the brand's typographic signature: an editorial serif in a sea of SaaS grotesques. · `--font-cranny`
- **Substitute:** Fraunces, Playfair Display, or DM Serif Display
- **Weights:** 300, 400
- **Sizes:** 16, 18, 20, 24, 28, 32, 40, 61, 80, 96px
- **Line height:** 0.91, 1.00, 1.10, 1.30, 1.50
- **Letter spacing:** -0.0070em at display (80–96px), 0.0100em at small sizes
- **Role:** Display and editorial heading face — high-contrast serif used for hero headlines and section titles at 40–96px. Weight 300 at display sizes creates a whisper-soft authority; weight 400 carries through subheadings. This is the brand's typographic signature: an editorial serif in a sea of SaaS grotesques.

### ABC Diatype — Primary interface and body text — neutral grotesque handling nav, buttons, inputs, body copy, and card labels. The +0.01em positive tracking is unusually generous for a grotesque and creates a calm, considered rhythm in body text. · `--font-abc-diatype`
- **Substitute:** Inter, Söhne, or GT America
- **Weights:** 400, 500
- **Sizes:** 14, 18px
- **Line height:** 1.00, 1.30, 1.35, 1.50
- **Letter spacing:** 0.0100em (0.14px at 14px, 0.18px at 18px)
- **Role:** Primary interface and body text — neutral grotesque handling nav, buttons, inputs, body copy, and card labels. The +0.01em positive tracking is unusually generous for a grotesque and creates a calm, considered rhythm in body text.

### Satoshi — Secondary body fallback for specific micro-copy contexts · `--font-satoshi`
- **Substitute:** DM Sans or Manrope
- **Weights:** 400
- **Sizes:** 14px
- **Line height:** 1.30
- **Letter spacing:** 0.0100em
- **Role:** Secondary body fallback for specific micro-copy contexts

### Cabinetgrotesk — Bold display variant for emphasis and large numerals — tighter, heavier counterpoint to the editorial Cranny · `--font-cabinetgrotesk`
- **Substitute:** Cabinet Grotesk (Indus Type) or General Sans Bold
- **Weights:** 500, 700
- **Sizes:** 16, 40px
- **Line height:** 1.00, 1.20
- **Letter spacing:** 0.0100em
- **Role:** Bold display variant for emphasis and large numerals — tighter, heavier counterpoint to the editorial Cranny

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 14px | 1.3 | 0.14px | `--text-caption` |
| body | 18px | 1.35 | 0.18px | `--text-body` |
| subheading | 24px | 1.3 | 0.24px | `--text-subheading` |
| heading-sm | 32px | 1.2 | 0.32px | `--text-heading-sm` |
| heading | 40px | 1.1 | 0.4px | `--text-heading` |
| heading-lg | 61px | 1 | -0.43px | `--text-heading-lg` |
| display | 80px | 0.95 | -0.56px | `--text-display` |
| display-xl | 96px | 0.91 | -0.67px | `--text-display-xl` |

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
| 80 | 80px | `--spacing-80` |
| 128 | 128px | `--spacing-128` |
| 160 | 160px | `--spacing-160` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 9999px |
| cards | 8px |
| images | 18px |
| nav-pills | 32px |
| buttons-lg | 40px |
| buttons-sm | 24px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 32px
- **Element gap:** 8-16px

## Components

### Top Navigation Bar
**Role:** Persistent site navigation

Horizontal bar on #f0f0eb background. Left: logo + dropdown menu items (Platform, Customers, Partnerships, Resources). Right: text link (Pricing), language selector (EN), ghost Login button (outlined pill, 32px radius), and filled Demo button (Ink #111110, white text, 32px radius, 12px 20px padding). Height ~64px.

### Dark Hero Section
**Role:** Primary landing section

Full-bleed #042a2b background with centered content. Display heading at 80–96px Cranny weight 300, white text, -0.67px letter-spacing. Subtext at 18px ABC Diatype weight 400, white at ~80% opacity. Button row below with 16px gap. Optional centered product preview image with 18px radius and 80% width constraint.

### Filled Dark Button
**Role:** Primary action

Ink (#111110) background, white text, ABC Diatype 14px weight 500, 0.14px letter-spacing. Padding 12px 20px, border-radius 24px (compact) or 40px (large). No border, no shadow. Used for 'Book demo' and 'Demo' CTAs.

### Ghost Button
**Role:** Secondary action

Transparent background with 1px border in white (on dark hero) or Ink (on light sections). ABC Diatype 14px weight 400, 0.14px letter-spacing. Padding 12px 20px, border-radius 24px. Includes optional arrow icon (▷) after label. Used for 'See the platform', 'Login'.

### Logo Bar
**Role:** Social proof / partner display

Horizontal row of partner logos on cream canvas, evenly distributed. Logos in black or grayscale, no color treatment. Comfortable spacing between logos, sits as a full-width strip between hero and feature sections.

### Feature Heading Block
**Role:** Section introduction

Centered text stack on cream canvas. Heading at 40–61px Cranny weight 300–400, Ink color. Subtext at 18px ABC Diatype weight 400, Graphite (#575753). Gap between heading and subtext: 16–24px. Section padding: 80px vertical.

### Upload Drop Zone
**Role:** File interaction surface

Dashed border (1px, #cbcbc5), cream background, 8px radius. Centered icon + label stack. ABC Diatype 18px weight 400 for label, Graphite color. Minimum height ~320px.

### Media Library Card
**Role:** Content container for image grid

White (#ffffff) surface, 8px radius, 32px internal padding. Contains breadcrumb header (Nobrand > Libraries > Media in 14px ABC Diatype, #575753 with chevron separators) and 4×2 image grid below.

### Overlapping Image Tile
**Role:** Gallery thumbnail

18px border-radius, no border. Arranged in grid with 2–3° random rotation and ~8px overlap between adjacent tiles. Creates a casual, editorial scrapbook feel rather than a rigid grid.

### Pill Tag
**Role:** Filter or metadata label

White background, 1px border in Pale Stone (#cbcbc5), ABC Diatype 12–14px weight 400, Ink text. Fully rounded (9999px radius). Padding 6px 12px. Used for format tags (PNG) and action labels (Magic hour).

### Breadcrumb
**Role:** Navigation path indicator

Inline horizontal list, 14px ABC Diatype weight 400. Items in Graphite (#575753) separated by chevron (›) in Ash Gray (#bfbfb8). First item preceded by small logo icon. No background, sits at top of content cards.

### CTA Card with Glass Overlay
**Role:** Action prompt on image

Semi-transparent panel (rgba(255,255,255,0.85)) with 18px radius overlaid on hero photography. Contains pill tags and a Signal Orange action button. The orange button is a small square with rounded corners (8px) and a white sparkle/star icon — the only place where orange carries visual weight.

## Do's and Don'ts

### Do
- Use Cranny weight 300 for all display headlines — the whisper-soft serif is the brand's typographic signature
- Set all interface text in ABC Diatype with 0.0100em positive tracking (0.14px at 14px, 0.18px at 18px)
- Use #f0f0eb Warm Parchment as the page canvas; reserve #ffffff Gallery White exclusively for cards sitting on the canvas
- Apply 8px radius to all content cards, 24–40px radius to buttons (24px compact, 40px hero-scale)
- Use #ff3b00 Signal Orange only for small functional moments (active tags, icon accents, single CTA button) — never for large fills or backgrounds
- Maintain 80px section gaps on the cream canvas; use the dark #042a2b surface sparingly for full-bleed editorial moments
- Separate components with 1px hairline borders in Ink (#111110) rather than drop shadows

### Don't
- Don't use drop shadows or elevation stacks — depth comes from warm neutral layering and hairline borders only
- Don't use Cranny for body text or interface labels — it is a display face only; pair with ABC Diatype
- Don't apply Signal Orange to large fills, page sections, or text — it loses meaning when used at scale
- Don't use pure #000000 for text or borders — Ink (#111110) is the structural black; reserve #000000 for SVG fills only
- Don't center-align body copy or multi-line text longer than 60 characters — display headlines and short labels only
- Don't use standard 4px or 6px radii on cards — the system uses 8px minimum for content surfaces
- Don't introduce additional chromatic accents; the system is warm-monochrome with one orange voice

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#f0f0eb` | Base page background — warm cream replaces stark white |
| 1 | Card | `#ffffff` | Content cards, feature panels sitting on the canvas |
| 2 | Elevated Card | `#e1e1db` | Secondary grouped content, subtle background variation |
| 3 | Dark Surface | `#042a2b` | Hero sections and editorial dark moments |

## Elevation

The system deliberately avoids drop shadows as a structural tool. Depth is communicated through warm neutral layering (#f0f0eb → #ffffff → #e1e1db), hairline borders in #111110, and the occasional dark-teal surface (#042a2b) for dramatic contrast. Components sit on flat planes separated by 1px borders rather than lifted by shadow.

## Imagery

Image-forward and editorial: full-bleed cinematic photography in dark hero sections (lifestyle, atmospheric, often silhouetted figures against skies), contained 18px-radius image grids with slight rotation and overlap (2 rows of 4 in the media library view), and brand-asset thumbnails presented as gallery objects. Photography is warm-toned, high-contrast, and treated as content rather than decoration — the images ARE the page, not illustrations of it. No flat illustration system; visuals are either photographic or absent.

## Layout

Max-width 1200px centered content on a warm cream canvas. The page opens with a full-bleed dark hero (#042a2b background) containing a centered serif headline at 80–96px, a subtext line, and two buttons (filled + ghost). Below, sections alternate on the cream canvas with generous 80px vertical gaps. Logo bars sit as horizontal strips with comfortable spacing. Feature sections use centered headline → subtext → visual stack. The media library view shows a 4×2 image grid with intentional 2–3° rotation and overlap between tiles, framed by a single rounded card container.

## Agent Prompt Guide

## Quick Color Reference
- Canvas/page background: #f0f0eb (Warm Parchment)
- Card surface: #ffffff (Gallery White)
- Primary text & borders: #111110 (Ink)
- Secondary text: #575753 (Graphite Warm)
- Dark hero surface: #042a2b (Deep Teal)
- Accent (small functional moments only): #ff3b00 (Signal Orange)
- primary action: #111110 (filled action)

## Example Component Prompts

1. **Dark Hero Section**: Full-bleed #042a2b background, centered. Display headline at 80px Cranny weight 300, #ffffff, letter-spacing -0.56px. Subtext at 18px ABC Diatype weight 400, white at 85% opacity. Two buttons below with 16px gap: filled Ink (#111110, white text, 24px radius, 12px 20px padding) and ghost (transparent, 1px white border, white text, 24px radius, 12px 20px padding).

2. **Feature Section Block**: Cream #f0f0eb background, 80px vertical padding. Centered heading at 40px Cranny weight 400, #111110, 0.40px letter-spacing. Subtext at 18px ABC Diatype weight 400, #575753, 16px gap below heading. Max content width 640px.

3. **Media Library Card**: White #ffffff surface, 8px radius, 32px padding. Breadcrumb at top in 14px ABC Diatype #575753 separated by › in #bfbfb8. Below: 4-column image grid with 18px-radius tiles, 8px gaps, optional 2–3° rotation on each tile.

4. **Top Navigation Bar**: #f0f0eb background, 64px height. Left cluster: logo + ABC Diatype 14px weight 500 nav items in #111110 with 24px gaps. Right cluster: text link (Pricing), language selector, ghost Login button (1px #111110 border, 32px radius, 12px 16px padding), filled Demo button (#111110 bg, white text, 32px radius, 12px 16px padding).

5. **Pill Tag Filter**: White background, 1px border in #cbcbc5, 9999px radius, 6px 12px padding. ABC Diatype 14px weight 400 in #111110. For the orange variant: #ff3b00 background, white text, no border, 8px radius (square-ish, not pill) with a small white sparkle icon.

## Similar Brands

- **Webflow** — Same dark-hero-into-light-sections rhythm with large editorial display type and warm neutrals
- **Linear** — Comfortable 8px-base density, hairline borders on flat surfaces, and restraint around color
- **Pitch** — Editorial serif headlines paired with a single warm accent color and image-forward presentations
- **Arc Browser** — Warm cream canvas with deep dark contrast sections and oversized editorial typography
- **Notion** — Comfortable spacing, soft card radii, and a calm near-monochrome palette with minimal elevation

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-warm-parchment: #f0f0eb;
  --color-gallery-white: #ffffff;
  --color-soft-linen: #e1e1db;
  --color-mist-gray: #d7d7cf;
  --color-pale-stone: #cbcbc5;
  --color-ash-gray: #bfbfb8;
  --color-graphite-warm: #575753;
  --color-charcoal-warm: #464643;
  --color-ink: #111110;
  --color-signal-orange: #ff3b00;
  --color-deep-teal: #042a2b;

  /* Typography — Font Families */
  --font-cranny: 'Cranny', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-abc-diatype: 'ABC Diatype', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-satoshi: 'Satoshi', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-cabinetgrotesk: 'Cabinetgrotesk', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.3;
  --tracking-caption: 0.14px;
  --text-body: 18px;
  --leading-body: 1.35;
  --tracking-body: 0.18px;
  --text-subheading: 24px;
  --leading-subheading: 1.3;
  --tracking-subheading: 0.24px;
  --text-heading-sm: 32px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: 0.32px;
  --text-heading: 40px;
  --leading-heading: 1.1;
  --tracking-heading: 0.4px;
  --text-heading-lg: 61px;
  --leading-heading-lg: 1;
  --tracking-heading-lg: -0.43px;
  --text-display: 80px;
  --leading-display: 0.95;
  --tracking-display: -0.56px;
  --text-display-xl: 96px;
  --leading-display-xl: 0.91;
  --tracking-display-xl: -0.67px;

  /* Typography — Weights */
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 8px;
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-128: 128px;
  --spacing-160: 160px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 32px;
  --element-gap: 8-16px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 18px;
  --radius-3xl: 24px;
  --radius-3xl-2: 32px;
  --radius-3xl-3: 40px;

  /* Named Radii */
  --radius-tags: 9999px;
  --radius-cards: 8px;
  --radius-images: 18px;
  --radius-nav-pills: 32px;
  --radius-buttons-lg: 40px;
  --radius-buttons-sm: 24px;

  /* Surfaces */
  --surface-canvas: #f0f0eb;
  --surface-card: #ffffff;
  --surface-elevated-card: #e1e1db;
  --surface-dark-surface: #042a2b;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-warm-parchment: #f0f0eb;
  --color-gallery-white: #ffffff;
  --color-soft-linen: #e1e1db;
  --color-mist-gray: #d7d7cf;
  --color-pale-stone: #cbcbc5;
  --color-ash-gray: #bfbfb8;
  --color-graphite-warm: #575753;
  --color-charcoal-warm: #464643;
  --color-ink: #111110;
  --color-signal-orange: #ff3b00;
  --color-deep-teal: #042a2b;

  /* Typography */
  --font-cranny: 'Cranny', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-abc-diatype: 'ABC Diatype', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-satoshi: 'Satoshi', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-cabinetgrotesk: 'Cabinetgrotesk', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.3;
  --tracking-caption: 0.14px;
  --text-body: 18px;
  --leading-body: 1.35;
  --tracking-body: 0.18px;
  --text-subheading: 24px;
  --leading-subheading: 1.3;
  --tracking-subheading: 0.24px;
  --text-heading-sm: 32px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: 0.32px;
  --text-heading: 40px;
  --leading-heading: 1.1;
  --tracking-heading: 0.4px;
  --text-heading-lg: 61px;
  --leading-heading-lg: 1;
  --tracking-heading-lg: -0.43px;
  --text-display: 80px;
  --leading-display: 0.95;
  --tracking-display: -0.56px;
  --text-display-xl: 96px;
  --leading-display-xl: 0.91;
  --tracking-display-xl: -0.67px;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-128: 128px;
  --spacing-160: 160px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 18px;
  --radius-3xl: 24px;
  --radius-3xl-2: 32px;
  --radius-3xl-3: 40px;
}
```
