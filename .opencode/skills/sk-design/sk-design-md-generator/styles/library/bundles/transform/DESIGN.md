# Transform — Style Reference
> stage poster pinned to warm blush paper

**Theme:** light

Transform uses a theatrical broadside language: a warm blush cream canvas carries the entire site while oversized geometric headlines shout in heavy Walsheim weights. The palette is intentionally limited to three loud accents — spotlight magenta, festival violet, and stage orange — deployed like a punk poster printer's ink set, each one earning its place on a flat, unshadowed surface. Depth comes from full-bleed color blocking, not elevation, so sections read like clipped broadsheets stacked on warm paper. Components are weighty and rectangular; only links and a few interactive chips receive the 50px pill radius, making them feel like stickers pressed onto the page. Typography does the emotional work: weight 700–900 at 56–80px carries theatrical volume, while tight -0.02em tracking keeps the heavy forms from sprawling.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Blush Cardstock | `#f4ede9` | `--color-blush-cardstock` | Page background, nav surface, dominant canvas — the warm paper everything sits on |
| Ink Black | `#000000` | `--color-ink-black` | Primary text, section headings, hairline borders, icon strokes |
| Paper White | `#ffffff` | `--color-paper-white` | Card surface, dark-section text, button labels on chromatic fills |
| Ash Gray | `#d9d9d9` | `--color-ash-gray` | Alternate card surface when a quieter neutral block is needed |
| Steel Gray | `#767676` | `--color-steel-gray` | Muted input borders, secondary helper strokes |
| Festival Violet | `#340068` | `--color-festival-violet` | Full-bleed section bands, secondary filled CTA, footer background — heavy, immersive, sets the serious stage |
| Spotlight Magenta | `#fb00c2` | `--color-spotlight-magenta` | Primary filled CTA (DONATE), pull-quote text, heading borders, interactive emphasis — the loudest ink, reserved for moments that demand attention |
| Curtain Orange | `#ff1e00` | `--color-curtain-orange` | Pull-quote attribution, decorative heading borders — the warm third color that gives the palette a poster-like three-ink depth |

## Tokens — Typography

### Walsheim — Single-family type system used for everything from nav to display; the broad weight range (400–900) carries the entire tonal system so color never has to shout alone · `--font-walsheim`
- **Substitute:** Plus Jakarta Sans or Inter for the closest freely available geometric sans with comparable weight range; DM Sans as a fallback
- **Weights:** 400, 700, 800, 900
- **Sizes:** 16px, 18px, 22px, 24px, 40px, 56px, 80px
- **Line height:** 1.00–1.45 (tight on display, generous on body)
- **Letter spacing:** -0.02em across all sizes — tight tracking prevents the heavy weights from feeling slab-like and keeps body text compact
- **Role:** Single-family type system used for everything from nav to display; the broad weight range (400–900) carries the entire tonal system so color never has to shout alone

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| body-sm | 16px | 1.45 | -0.32px | `--text-body-sm` |
| body | 18px | 1.45 | -0.36px | `--text-body` |
| subheading | 22px | 1.38 | -0.44px | `--text-subheading` |
| heading-sm | 24px | 1.38 | -0.48px | `--text-heading-sm` |
| heading | 40px | 1.2 | -0.8px | `--text-heading` |
| heading-lg | 56px | 1.1 | -1.12px | `--text-heading-lg` |
| display | 80px | 1 | -1.6px | `--text-display` |

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
| 56 | 56px | `--spacing-56` |
| 80 | 80px | `--spacing-80` |
| 120 | 120px | `--spacing-120` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 50px |
| cards | 0px |
| links | 50px |
| inputs | 0px |
| buttons | 0px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 16px
- **Element gap:** 16px

## Components

### Primary Magenta CTA
**Role:** Donate and other high-priority filled action buttons

Filled rectangle in Spotlight Magenta (#fb00c2), white (#ffffff) label, no radius (0px), 8px vertical / 16px horizontal padding, Walsheim 700–800 uppercase at 16–18px. Sits on cream or dark sections; the saturated fill against neutral surroundings is the primary visual trigger.

### Secondary Violet CTA
**Role:** Lower-priority filled action, event recaps, dark-band call-to-action

Filled rectangle in Festival Violet (#340068), white label, 0px radius, 8px / 16px padding, Walsheim 700–800 uppercase. Used when the page context is already light and a second weighty action is needed without repeating the magenta voice.

### Ghost Navigation Link
**Role:** Primary nav items, inline text links

Black (#000000) text on cream, Walsheim 700 at 16–18px, no underline by default, 50px border-radius reserved for chip/tag treatment. When used as a chip/badge, wraps in a hairline border with the same 50px pill radius.

### Header Bar
**Role:** Persistent top navigation across all pages

Full-bleed Blush Cardstock (#f4ede9) bar, wordmark 'TRANSFORM' left in Walsheim 800–900 uppercase, nav items inline, DONATE button and outlined social icons right. Vertical padding 8–16px, no shadow, no border.

### Hero Stage Panel
**Role:** Above-the-fold performance introduction

Full-bleed dark stage photograph as background, left-aligned display headline at 56–80px Walsheim 800–900 in Paper White, sub-line in smaller white body weight, dark violet secondary CTA anchored bottom-left. No gradient overlay; the photograph itself provides the tonal floor.

### Pull-Quote Band
**Role:** Editorial testimonials, press quotes, voice-of-the-festival moments

Full-bleed Festival Violet (#340068) section, left-aligned display-size pull quote in Spotlight Magenta (#fb00c2) at 40–56px Walsheim 700, attribution on a new line in Curtain Orange (#ff1e00) at 22–24px. Carousel pagination dots below in magenta/white.

### Section Heading Block
**Role:** Introduces news, archive, programme, and content grids

Centered display heading in Ink Black, Walsheim 800–900 at 40–56px, single line where possible. Sits on Blush Cardstock with 48–80px vertical breathing room above and below. No underline, no decoration — the weight and size carry the emphasis.

### News Card
**Role:** Editorial card in content grids (news, opportunities, archive)

Top-anchored photograph fills the card, title and meta sit on Paper White (#ffffff) or Ash Gray (#d9d9d9) below the image, 0px radius, no border, no shadow. Grid: 4 columns on desktop, 2 on tablet, 1 on mobile, 16px column gap.

### Input Field
**Role:** Newsletter, search, and form fields

Ink Black (#000000) text on Paper White, 1px solid Steel Gray (#767676) border, 0px radius, 1px vertical / 2px horizontal padding shown in raw data but typical 12–16px effective padding, Walsheim 400 at 16px. Focus state thickens border to 2px in Ink Black.

### Outlined Social Icon
**Role:** Instagram, Facebook, ticket-link icons in header and footer

Square or circular outlined glyph in Ink Black (header) or Paper White (footer), ~20–24px box, 1.5–2px stroke, no fill. Sits inline with nav items.

### Page Footer
**Role:** Site-wide closing band

Full-bleed Festival Violet (#340068) background, Paper White text and links, generous 48–80px vertical padding, multi-column layout for addresses, social, and legal. The dark band visually seals the page against the warm cream body.

### Pill Link Chip
**Role:** Tag, category, or filterable inline link

50px border-radius pill, Ink Black 1px border on Blush Cardstock fill, Walsheim 700 at 16px, 8px vertical / 16px horizontal padding. The only place 50px radius appears — it signals 'clickable' without needing color.

## Do's and Don'ts

### Do
- Use Walsheim 700–900 for all headings and display text — never below 700, the heavy weight is the brand's voice
- Use 50px border-radius only on pill chips and link tags, and 0px on everything else — the radius dichotomy is intentional
- Use -0.02em tracking across every size; do not relax it on display headlines
- Anchor the page on the Blush Cardstock (#f4ede9) canvas; let dark sections earn their place as full-bleed bands
- Reserve Spotlight Magenta (#fb00c2) for primary CTAs and editorial emphasis; never use it as a passive background
- Keep the palette to three chromatic accents plus the cream/black/white neutrals; resist adding more colors
- Use full-bleed photographs as section backgrounds with no gradient overlay or border

### Don't
- Do not introduce shadows, glows, or blur effects — depth is built through flat color, not elevation
- Do not use thin or light weights (under 700) for headings or display text
- Do not round cards, buttons, or images — only pills get radius
- Do not use Curtain Orange (#ff1e00) for buttons or CTAs — it is a decorative editorial accent only
- Do not place content directly on Spotlight Magenta or Festival Violet without testing contrast; always use Paper White for text on these surfaces
- Do not stack more than two chromatic accents in one component — the palette relies on restraint
- Do not use gradients — no gradient tokens exist and the system is deliberately flat

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Blush Cardstock | `#f4ede9` | Default page canvas and nav surface |
| 2 | Paper White | `#ffffff` | Card body, button labels on chromatic fills |
| 3 | Ash Gray | `#d9d9d9` | Alternate card surface for quieter content blocks |
| 4 | Curtain Orange | `#ff1e00` | Section-band accent (rare, used decoratively) |
| 5 | Spotlight Magenta | `#fb00c2` | Section-band accent for editorial emphasis |
| 6 | Festival Violet | `#340068` | Full-bleed dark bands, footer, immersive sections |

## Elevation

No shadows detected and no elevation token is used. Depth is built entirely through flat color blocking — full-bleed sections, contrasted band backgrounds, and saturated fills against the warm cream canvas. Components sit on the surface like clipped paper, never floating.

## Imagery

Photography is the dominant visual language: large, atmospheric performance shots captured during live shows — stage lighting, audience silhouettes, dancers mid-motion. Images are treated full-bleed with no border, no rounding, and no overlay gradient; the raw photograph is the section. Subjects are stage-focused, high-contrast, often darker and warmer than the page, creating natural visual contrast against the blush canvas. There is no illustration system; the only graphic elements are outlined social icons.

## Layout

Full-bleed sections stacked vertically with no container constraint at the section level — each band fills the viewport width. Within bands, content is max-width 1200px centered. The page opens with a full-viewport dark photo hero with left-aligned display headline, then alternates between Blush Cardstock and Festival Violet full-bleed bands. Editorial rhythm: hero → cream grid → violet quote band → cream news grid → violet footer. Card grids use 4 columns at desktop collapsing to 2 then 1. Vertical rhythm is generous: 48–80px between sections, 16px between elements within a card. Navigation is a single top bar with a wordmark, inline links, and a right-aligned magenta CTA plus outlined social icons.

## Agent Prompt Guide

Quick Color Reference:
- text: #000000
- background: #f4ede9
- border: #000000
- accent: #fb00c2
- primary action: #fb00c2 (filled action)
- dark band: #340068
- editorial accent: #ff1e00

Example Component Prompts:
1. Create a primary donate button: filled Spotlight Magenta (#fb00c2) background, Paper White (#ffffff) label, Walsheim 800 uppercase at 18px, 8px vertical padding, 16px horizontal padding, 0px border-radius.
2. Create a pull-quote band: full-bleed Festival Violet (#340068) background, left-aligned display quote in Spotlight Magenta (#fb00c2) at 56px Walsheim 700 with -1.12px tracking, attribution below in Curtain Orange (#ff1e00) at 24px Walsheim 700, 80px vertical padding.
3. Create a news card: top-anchored full-bleed photograph, 0px border-radius, Paper White (#ffffff) body below, title in Ink Black (#000000) at 22px Walsheim 700 with -0.44px tracking, 16px internal padding.
4. Create a header bar: Blush Cardstock (#f4ede9) background, wordmark 'TRANSFORM' in Walsheim 900 at 24px uppercase in Ink Black, nav links inline in Walsheim 700 at 18px, magenta DONATE button right-aligned, outlined social icons after it.
5. Create a section heading: centered Ink Black (#000000) text in Walsheim 900 at 56px with -1.12px tracking, 80px vertical breathing room above and below, single line, no decoration.

## Color Pairing Rules

The three chromatic accents are designed to work as a three-ink poster set, not as independent UI states. Use them in this hierarchy: Festival Violet for full-bleed immersive bands (footer, quote, feature sections), Spotlight Magenta for the single loudest moment per page (one CTA, one pull-quote, one emphasis), Curtain Orange as a decorative third — almost always a single word or attribution, never a full component. Never combine all three in the same component; two maximum, and only when one is acting as a foreground accent against the other as background.

## Similar Brands

- **Barbican Centre** — Performing arts venue using oversized geometric sans-serif headlines, flat color blocking, and dark photographic hero panels with no gradient overlays
- **ICA London** — Contemporary arts institution combining a warm cream canvas with bold magenta-pink accents and heavy display type
- **Bold Italic** — Editorial publication with a blush cream background, saturated three-color accent palette, and flat unshadowed components
- **Haus der Kunst** — Cultural venue using heavy display typography on warm neutral surfaces with full-bleed photographic sections

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-blush-cardstock: #f4ede9;
  --color-ink-black: #000000;
  --color-paper-white: #ffffff;
  --color-ash-gray: #d9d9d9;
  --color-steel-gray: #767676;
  --color-festival-violet: #340068;
  --color-spotlight-magenta: #fb00c2;
  --color-curtain-orange: #ff1e00;

  /* Typography — Font Families */
  --font-walsheim: 'Walsheim', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-body-sm: 16px;
  --leading-body-sm: 1.45;
  --tracking-body-sm: -0.32px;
  --text-body: 18px;
  --leading-body: 1.45;
  --tracking-body: -0.36px;
  --text-subheading: 22px;
  --leading-subheading: 1.38;
  --tracking-subheading: -0.44px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.38;
  --tracking-heading-sm: -0.48px;
  --text-heading: 40px;
  --leading-heading: 1.2;
  --tracking-heading: -0.8px;
  --text-heading-lg: 56px;
  --leading-heading-lg: 1.1;
  --tracking-heading-lg: -1.12px;
  --text-display: 80px;
  --leading-display: 1;
  --tracking-display: -1.6px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-bold: 700;
  --font-weight-extrabold: 800;
  --font-weight-black: 900;

  /* Spacing */
  --spacing-unit: 8px;
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-80: 80px;
  --spacing-120: 120px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 16px;
  --element-gap: 16px;

  /* Border Radius */
  --radius-full: 50px;

  /* Named Radii */
  --radius-tags: 50px;
  --radius-cards: 0px;
  --radius-links: 50px;
  --radius-inputs: 0px;
  --radius-buttons: 0px;

  /* Surfaces */
  --surface-blush-cardstock: #f4ede9;
  --surface-paper-white: #ffffff;
  --surface-ash-gray: #d9d9d9;
  --surface-curtain-orange: #ff1e00;
  --surface-spotlight-magenta: #fb00c2;
  --surface-festival-violet: #340068;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-blush-cardstock: #f4ede9;
  --color-ink-black: #000000;
  --color-paper-white: #ffffff;
  --color-ash-gray: #d9d9d9;
  --color-steel-gray: #767676;
  --color-festival-violet: #340068;
  --color-spotlight-magenta: #fb00c2;
  --color-curtain-orange: #ff1e00;

  /* Typography */
  --font-walsheim: 'Walsheim', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-body-sm: 16px;
  --leading-body-sm: 1.45;
  --tracking-body-sm: -0.32px;
  --text-body: 18px;
  --leading-body: 1.45;
  --tracking-body: -0.36px;
  --text-subheading: 22px;
  --leading-subheading: 1.38;
  --tracking-subheading: -0.44px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.38;
  --tracking-heading-sm: -0.48px;
  --text-heading: 40px;
  --leading-heading: 1.2;
  --tracking-heading: -0.8px;
  --text-heading-lg: 56px;
  --leading-heading-lg: 1.1;
  --tracking-heading-lg: -1.12px;
  --text-display: 80px;
  --leading-display: 1;
  --tracking-display: -1.6px;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-80: 80px;
  --spacing-120: 120px;

  /* Border Radius */
  --radius-full: 50px;
}
```
