# HBO Max — Style Reference
> Cinema lobby at midnight. Pure black walls, one cool blue exit sign, and movie posters glowing from every surface.

**Theme:** dark

HBO Max is a cinema-dark streaming interface: deep black canvas, content poster art as the primary visual unit, and a single steel-blue accent that powers every interactive element. The design is deliberately sparse — white text floats on black, pricing cards flip the polarity to white-on-light to signal commerce zones, and typography does the heavy lifting through size and spacing rather than color. Components stay flat and minimal: 8px-radius buttons, hairline borders, no shadows, no gradients. The custom Max Sans typeface carries a slight positive letter-spacing on small labels, giving even utility text a cinematic, editorial quality.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Obsidian | `#000000` | `--color-obsidian` | Page background, hero canvas, navigation surface — the default darkness that lets poster art and white text feel illuminated |
| Smoke | `#050409` | `--color-smoke` | Near-black secondary surface, subtle elevation layer above pure black for section separation |
| Ash Mist | `#b8b6bb` | `--color-ash-mist` | Muted helper text, secondary body copy, disabled icon strokes — readable but recedes |
| Iron Veil | `#89868e` | `--color-iron-veil` | Tertiary text, inactive border outlines on controls |
| Faded Print | `#999999` | `--color-faded-print` | Lowest-priority metadata, footnote-level text and borders |
| Snow | `#ffffff` | `--color-snow` | Primary text, pricing card surfaces, icon fills, pill backgrounds — the dominant positive value in the system |
| Eclipse Indigo | `#0e0a17` | `--color-eclipse-indigo` | Near-black heading accent, subtle border tint for heading underlines |
| Signal Blue | `#3d6a99` | `--color-signal-blue` | Primary CTA fill, active link color, brand accent on icons and borders — the single chromatic note that powers all interactivity |
| Glacier Beam | `#71b8f2` | `--color-glacier-beam` | Blue text accent for links, tags, and emphasized short phrases. Do not promote it to the primary CTA color |

## Tokens — Typography

### Max Sans — Custom sans-serif. Weights 300–400 carry the bulk of body and headline work; 600–700 reserved for prices and CTAs; 100 used for ultra-light display moments. Positive letter-spacing (0.083–0.1em) on small labels gives cinematic, marquee-poster feel. · `--font-max-sans`
- **Substitute:** Inter, Helvetica Neue, or Söhne
- **Weights:** 100, 300, 400, 600, 700
- **Sizes:** 10, 12, 13, 14, 16, 18, 19, 20, 24, 26, 28, 35, 37, 44, 56
- **Line height:** 0.80, 1.00, 1.10, 1.11, 1.20, 1.23, 1.25, 1.35, 1.60, 1.96
- **Letter spacing:** +0.83px at 10px, +1.0px at 12px, +1.6px at 16px
- **OpenType features:** `"locl" 0`
- **Role:** Custom sans-serif. Weights 300–400 carry the bulk of body and headline work; 600–700 reserved for prices and CTAs; 100 used for ultra-light display moments. Positive letter-spacing (0.083–0.1em) on small labels gives cinematic, marquee-poster feel.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 10px | 1.6 | 0.83px | `--text-caption` |
| body | 14px | 1.25 | — | `--text-body` |
| body-lg | 16px | 1.2 | — | `--text-body-lg` |
| subheading | 18px | 1.23 | — | `--text-subheading` |
| heading-sm | 24px | 1.11 | — | `--text-heading-sm` |
| heading | 28px | 1.1 | — | `--text-heading` |
| heading-lg | 35px | 1 | — | `--text-heading-lg` |
| display | 56px | 0.8 | — | `--text-display` |

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
| 48 | 48px | `--spacing-48` |
| 56 | 56px | `--spacing-56` |
| 96 | 96px | `--spacing-96` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 4.5px |
| cards | 4.5px |
| pills | 100px |
| images | 8px |
| buttons | 8px |

### Layout

- **Page max-width:** 1280px
- **Section gap:** 64px
- **Card padding:** 24px
- **Element gap:** 16px

## Components

### Signal Blue CTA Button
**Role:** Primary call-to-action for sign-up, plan selection, and key conversion points

Filled #3d6a99 background, white text at 14px weight 600, 8px border-radius, 12px vertical × 16px horizontal padding. Uppercase or sentence case. Letter-spacing 0.083em. Used for 'Sign Up Now', 'Select Plan'.

### Ghost Outline Button
**Role:** Secondary CTA, nav actions against dark backgrounds

Transparent fill, 1px solid white border, white text weight 600, 8px radius, 10px vertical × 16px horizontal padding. Used for 'Sign Up Now' in the header against dark hero.

### Pricing Tier Card
**Role:** Subscription plan display with feature list and price

White (#ffffff) surface on black page — full polarity inversion. 4.5px border-radius, 24px padding, checkmark icons in blue (#3d6a99) for feature items, bold price at 28px weight 700, '/month' suffix in lighter weight. Bottom-right Signal Blue Select Plan button.

### Category Tile
**Role:** Genre/content category navigation cards

Full-bleed poster image background, 8px radius, overlay text at bottom: category name in white weight 600, 'for' label in muted white, content title in uppercase small-caps. Used for Movies, Family, Drama, Comedy, Action, True Crime.

### Billing Toggle
**Role:** Monthly/Yearly plan period switcher

Pill-shaped (100px radius) container with two segments. Active segment: white background, black text. Inactive: transparent, white text. 24px horizontal × 12px vertical padding per segment. SAVE badge floats above in #3d6a99.

### Header Navigation
**Role:** Top-level site navigation and auth actions

Transparent over hero, minimal. HBO Max logo left (white, stacked). Right side: 'Sign In' text link + 'Sign Up Now' ghost button. No background bar — floats directly on dark hero.

### Content Hero Grid
**Role:** Full-bleed poster wall above the fold

Dense grid of content poster art (10+ columns on desktop), slight tilt/perspective effect, poster images edge-to-edge. Logo + pricing copy + CTA centered over the grid with no card or panel — text sits directly on the artwork.

### Feature Check Item
**Role:** Line item within pricing cards listing plan capabilities

Blue (#3d6a99) checkmark icon at 14px, followed by dark text weight 400 at 14px. Consistent 8px vertical gap between items. Unchecked items: empty circle outline in same blue.

### Carousel Section Header
**Role:** Genre section titles with horizontal scroll affordance

Centered title at 28px weight 400, flanked by left/right arrow chevrons in muted gray. Adjacent dimmed genre labels scroll into view. Letter-spacing 0.083em for cinematic feel.

### Section Heading
**Role:** Major page section titles like 'Pick Your Perfect Plan'

White text at 28px weight 400, centered alignment, generous 64px vertical breathing room above and below. Subtext at 16px weight 400 in #b8b6bb muted gray.

### Annual Savings Link
**Role:** Yearly pricing callout below monthly price

'Or pay €X/year and save €Y' in blue (#3d6a99) text link at 12px weight 400, with right-arrow chevron. Sits directly below the /month price line.

## Do's and Don'ts

### Do
- Use #3d6a99 exclusively for filled CTA buttons, active states, and check icons — it is the system's only chromatic note
- Invert to white surfaces for any commerce/pricing zone; the rest of the page must stay black
- Set buttons to 8px radius and pill elements to 100px radius — never mix intermediate values
- Apply 0.083–0.1em positive letter-spacing on labels, badges, and small-caps text for the cinematic marquee quality
- Keep the page background pure #000000 with no overlays, gradients, or dim layers in content areas
- Use weight 300–400 for headlines; reserve 600–700 for prices, CTAs, and emphasis only
- Maintain generous vertical rhythm: 64px between sections, 24px card padding, 16px between elements

### Don't
- Never use drop shadows — depth comes from surface color polarity, not elevation
- Don't introduce additional accent colors — the system is monochrome plus one blue
- Avoid backgrounds lighter than #050409 outside of pricing cards
- Don't use letter-spacing tighter than -0.01em on small text; the system breathes outward, not inward
- Never place white buttons on white pricing cards or blue buttons on blue surfaces — polarity must flip
- Don't add gradients, glass effects, or blur — the aesthetic is flat cinema-dark
- Avoid using #3d6a99 for large decorative areas; it should stay as precise interactive punctuation, not fill backgrounds

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Obsidian Canvas | `#000000` | Full-page background, hero section base |
| 2 | Smoke Surface | `#050409` | Subtle section separator, slightly elevated dark panel |
| 3 | Snow Card | `#ffffff` | Pricing tier cards, feature panels — inverted polarity for commerce zones |
| 4 | Signal Blue Accent | `#3d6a99` | Active CTA buttons, selected toggle state |

## Elevation

No shadows. Depth is communicated exclusively through surface color polarity shifts — white cards on black background create contrast-based elevation, never drop shadows. This keeps the cinema-dark aesthetic pure: no fake light sources, only true surface contrast.

## Imagery

Content poster art is the entire visual identity. The hero is a dense, slightly perspective-tilted grid of real HBO Max show and movie posters — ten or more visible at once with no breathing room between them, creating a wall-of-content effect. Category tiles use full-bleed poster stills with overlaid text. No lifestyle photography, no abstract illustration, no 3D renders. Photography treatment: high-saturation, cinematic color grading inherited from the source material. Icons are minimal — simple checkmark outlines and chevron arrows, no decorative iconography.

## Layout

Full-bleed cinematic layout. The hero is a max-edge poster grid with centered logo and CTA floating over it — no container, no card. Below the fold: centered single-column stack with max-width 1280px. The pricing section breaks the dark pattern with a 4-column card grid on white surfaces, providing a stark polarity shift. Category tiles are 6 equal columns. Content carousels use a horizontal scroll model with chevron controls. Navigation is a transparent floating bar with no background fill. Section rhythm: dark band → light pricing band → dark content bands, creating a three-act visual structure.

## Agent Prompt Guide

**Quick Color Reference**
- text: #ffffff
- background: #000000
- border: #050409
- accent: #3d6a99
- link/hover: #71b8f2
- primary action: #3d6a99 (filled action)

**3-5 Example Component Prompts**

1. **Hero Section**: Full-bleed #000000 background with a 10-column grid of poster images filling the viewport. Centered white HBO Max logo at 56px weight 300, letter-spacing 0.083em. Below: 'Start streaming with HBO Max plans from €6.99/month' at 16px weight 400 white. Signal Blue CTA button: #3d6a99 fill, white text 14px weight 600, 8px radius, 12px 24px padding, letter-spacing 0.083em.

2. **Pricing Card**: White (#ffffff) surface, 4.5px radius, 24px padding. Plan name 'Standard' at 20px weight 400. Feature list: #3d6a99 checkmark icons at 14px with dark body text. Price '€10.99' at 28px weight 700, '/month' suffix at 14px weight 400. Signal Blue Select Plan button (8px radius) bottom-right. Annual savings link in #3d6a99 at 12px below price.

3. **Category Tile**: Full-bleed poster image, 8px radius, 200px height. Bottom overlay: category name 'Drama' in white 20px weight 600, 'HBO ORIGINAL' label in uppercase 10px weight 400 white at 0.1em tracking, content title 'EUPHORIA' in 12px weight 400.

4. **Billing Toggle**: 100px-radius pill, 2px border in #050409. 'MONTHLY' active: white fill, black text 14px weight 600. 'YEARLY' inactive: transparent, white text. SAVE 16% badge above in #3d6a99 with white text 10px weight 600.

5. **Carousel Header**: 'DISCOVER THE GREATEST' eyebrow at 12px weight 400 #b8b6bb, letter-spacing 0.1em. Genre name 'Epics' at 35px weight 300 white, centered. Left/right #89868e chevron arrows flanking, 24px from text.

## Polarity System

The defining structural principle is surface polarity inversion. The page lives in #000000 darkness. Commerce zones (pricing) flip to #ffffff light. Active states use #3d6a99 blue as the single chromatic signal. Never blend these zones with gradients, overlays, or transitional surfaces — the contrast between black, white, and blue IS the visual system. Cards on black feel like illuminated screens; cards on white feel like printed pages. This binary approach eliminates ambiguity about where the user is in the conversion funnel.

## Similar Brands

- **Netflix** — Same dark-canvas streaming aesthetic with content poster grids as the dominant visual unit, and sparse UI chrome that lets artwork carry the brand
- **Disney+** — Similar dark-mode entertainment layout with category carousels and single-accent CTA buttons against near-black backgrounds
- **Apple TV+** — Identical black-canvas minimalism with a single white wordmark and full-bleed content imagery, relying on weight contrast rather than color
- **Spotify** — Dark immersive interface where content art tiles carry the visual weight and the UI recedes into monochrome backgrounds with minimal accent color
- **Hulu** — Similar streaming-tier pricing card grid with polarity-inverted white cards on a dark page and single blue CTA accent

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-obsidian: #000000;
  --color-smoke: #050409;
  --color-ash-mist: #b8b6bb;
  --color-iron-veil: #89868e;
  --color-faded-print: #999999;
  --color-snow: #ffffff;
  --color-eclipse-indigo: #0e0a17;
  --color-signal-blue: #3d6a99;
  --color-glacier-beam: #71b8f2;

  /* Typography — Font Families */
  --font-max-sans: 'Max Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.6;
  --tracking-caption: 0.83px;
  --text-body: 14px;
  --leading-body: 1.25;
  --text-body-lg: 16px;
  --leading-body-lg: 1.2;
  --text-subheading: 18px;
  --leading-subheading: 1.23;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.11;
  --text-heading: 28px;
  --leading-heading: 1.1;
  --text-heading-lg: 35px;
  --leading-heading-lg: 1;
  --text-display: 56px;
  --leading-display: 0.8;

  /* Typography — Weights */
  --font-weight-thin: 100;
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-semibold: 600;
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
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-96: 96px;

  /* Layout */
  --page-max-width: 1280px;
  --section-gap: 64px;
  --card-padding: 24px;
  --element-gap: 16px;

  /* Border Radius */
  --radius-md: 4.5px;
  --radius-lg: 8px;
  --radius-full: 100px;

  /* Named Radii */
  --radius-tags: 4.5px;
  --radius-cards: 4.5px;
  --radius-pills: 100px;
  --radius-images: 8px;
  --radius-buttons: 8px;

  /* Surfaces */
  --surface-obsidian-canvas: #000000;
  --surface-smoke-surface: #050409;
  --surface-snow-card: #ffffff;
  --surface-signal-blue-accent: #3d6a99;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-obsidian: #000000;
  --color-smoke: #050409;
  --color-ash-mist: #b8b6bb;
  --color-iron-veil: #89868e;
  --color-faded-print: #999999;
  --color-snow: #ffffff;
  --color-eclipse-indigo: #0e0a17;
  --color-signal-blue: #3d6a99;
  --color-glacier-beam: #71b8f2;

  /* Typography */
  --font-max-sans: 'Max Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.6;
  --tracking-caption: 0.83px;
  --text-body: 14px;
  --leading-body: 1.25;
  --text-body-lg: 16px;
  --leading-body-lg: 1.2;
  --text-subheading: 18px;
  --leading-subheading: 1.23;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.11;
  --text-heading: 28px;
  --leading-heading: 1.1;
  --text-heading-lg: 35px;
  --leading-heading-lg: 1;
  --text-display: 56px;
  --leading-display: 0.8;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-96: 96px;

  /* Border Radius */
  --radius-md: 4.5px;
  --radius-lg: 8px;
  --radius-full: 100px;
}
```
