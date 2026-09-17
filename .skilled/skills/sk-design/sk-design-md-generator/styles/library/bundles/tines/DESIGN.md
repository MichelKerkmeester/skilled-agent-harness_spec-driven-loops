# Tines — Style Reference
> lavender observatory under glass — soft warm white, deep violet edges, specimen cards in pastel tints

**Theme:** light

Tines is a violet-drenched observatory: a soft, warm-white canvas (#fcf9f5) layered with a deep iris (#4d3e78) that saturates borders, text, and iconography like ink on parchment. Reckless serif headlines sit at whisper-weights (300) with tight negative tracking, while Roobert sans carries all UI at near-equal weight. The system replaces typical flat SaaS chrome with hand-drawn whimsy: illustrated clouds, paper planes, and sprouts float across sections as decorative atmosphere. Cards are the signature element — pastel-tinted backgrounds paired with vivid, saturated 2px borders in pink, orange, green, or teal, creating a 'lab notebook' feeling where each story is its own labeled specimen. Buttons are quietly confident: ghost outlines on hero CTAs, pill-shaped deep-violet fills for booking, and zero drop-shadow elevation throughout.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Deep Iris | `#4d3e78` | `--color-deep-iris` | Primary brand color, dominant borders, body text, icon strokes, link color — saturates the interface like violet ink on parchment |
| Amethyst | `#6956a8` | `--color-amethyst` | Secondary brand violet for mid-weight text, secondary borders, and decorative iconography |
| Iris Glow | `#745fbb` | `--color-iris-glow` | Filled primary action button background — the only filled CTA color, used sparingly to make Book a demo / Sign up commands feel switched on |
| Lilac Mist | `#f3ecf7` | `--color-lilac-mist` | Soft violet-tinted surface for cards, table rows, and section backgrounds |
| Parchment | `#fcf9f5` | `--color-parchment` | Primary page canvas — warm off-white, the base layer everything sits on |
| Licheno | `#e9f3e7` | `--color-licheno` | Mint-tinted card surface for testimonial and feature cards |
| Apricot Wash | `#feede0` | `--color-apricot-wash` | Peach-tinted card surface for warm-coded testimonial cards |
| Rose Quartz | `#ffdce8` | `--color-rose-quartz` | Pink-tinted card surface for pink-themed testimonial cards |
| Sky Tint | `#ccdcf8` | `--color-sky-tint` | Blue-tinted card surface for blue-themed testimonial cards |
| Lavender Veil | `#eadff8` | `--color-lavender-veil` | Muted violet surface for table headers, footer accents, and subtle dividers |
| Orchid Pink | `#a54b7a` | `--color-orchid-pink` | Vivid pink accent for specimen-card borders, icon fills, and decorative illustration strokes |
| Tangerine | `#b74d1a` | `--color-tangerine` | Vivid orange accent for specimen-card borders, icon strokes, and secondary callouts |
| Forest Fern | `#1f7a57` | `--color-forest-fern` | Green outline accent for tags, dividers, and focused UI edges |
| Cobalt | `#3c699b` | `--color-cobalt` | Vivid blue accent for specimen-card borders and tech iconography |
| Peacock | `#058380` | `--color-peacock` | Vivid teal accent for specimen-card borders and unique illustration touches |
| Periwinkle | `#4780bc` | `--color-periwinkle` | Secondary blue border for grid-card variants and icon strokes |
| Plum | `#803218` | `--color-plum` | Deep maroon for text emphasis, badge labels, and inline highlights on warm cards |
| Crimson | `#a53c3a` | `--color-crimson` | Red accent for outlined action borders, linked labels, and lightweight interactive emphasis. Use as a supporting accent, not as a status color |
| Vermilion | `#e14f4c` | `--color-vermilion` | Red decorative accent for icons, marks, and small graphic details. Use as a supporting accent, not as a status color |
| Pure | `#ffffff` | `--color-pure` | Card foreground, inverted text on dark surfaces, base layer for product screenshot cards |

## Tokens — Typography

### Reckless — Display and editorial headlines, hero statements, and section titles. The 300-weight headlines with negative letter-spacing (as tight as -0.030em at 72px) create a quiet, confident serif voice that contrasts the playful sans body · `--font-reckless`
- **Substitute:** Lora, Source Serif Pro, or PT Serif
- **Weights:** 300, 400, 500, 600, 700
- **Sizes:** 20, 22, 24, 26, 28, 46, 52, 64, 72
- **Line height:** 0.90–1.40
- **Letter spacing:** -0.030em at 64-72px, -0.020em at 46-52px, -0.015em to -0.007em at 20-28px
- **Role:** Display and editorial headlines, hero statements, and section titles. The 300-weight headlines with negative letter-spacing (as tight as -0.030em at 72px) create a quiet, confident serif voice that contrasts the playful sans body

### Roobert — Body text, navigation, buttons, labels, and all UI microcopy. Carries positive letter-spacing (0.007em–0.100em) at small sizes, giving uppercase tags and nav a spaced, instrument-label quality · `--font-roobert`
- **Substitute:** Inter, Söhne, or DM Sans
- **Weights:** 400, 500, 600, 700, 900
- **Sizes:** 10, 11, 12, 13, 14, 16, 18
- **Line height:** 1.00–1.40
- **Letter spacing:** 0.007em–0.060em for body, 0.050em–0.100em for uppercase tags and eyebrow labels
- **Role:** Body text, navigation, buttons, labels, and all UI microcopy. Carries positive letter-spacing (0.007em–0.100em) at small sizes, giving uppercase tags and nav a spaced, instrument-label quality

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 10px | 1 | 1px | `--text-caption` |
| eyebrow | 12px | 1.15 | 0.6px | `--text-eyebrow` |
| body-sm | 14px | 1.4 | — | `--text-body-sm` |
| body | 16px | 1.4 | — | `--text-body` |
| subheading | 20px | 1.2 | -0.4px | `--text-subheading` |
| heading-sm | 24px | 1.1 | -0.36px | `--text-heading-sm` |
| heading | 28px | 1.05 | -0.42px | `--text-heading` |
| heading-lg | 52px | 1 | -1.04px | `--text-heading-lg` |
| display | 72px | 0.98 | -2.16px | `--text-display` |

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
| 32 | 32px | `--spacing-32` |
| 36 | 36px | `--spacing-36` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 72 | 72px | `--spacing-72` |
| 96 | 96px | `--spacing-96` |
| 156 | 156px | `--spacing-156` |
| 168 | 168px | `--spacing-168` |
| 200 | 200px | `--spacing-200` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 7px |
| tags | 7px |
| cards | 14px |
| pills | 9999px |
| buttons | 14px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 24px
- **Element gap:** 24px

## Components

### Hero Headline (Reckless Display)
**Role:** Primary page-opening statement

Reckless weight 300, 64–72px, line-height 0.98, letter-spacing -2.16px. Centered on warm white canvas. Color #4d3e78. The whisper-weight serif is the anti-thesis of typical SaaS bold sans — authority through restraint.

### Filled Primary Button (Iris Glow)
**Role:** Primary conversion action — Book a demo, Sign up

Background #745fbb, white text, Roobert weight 600 at 16px, padding 12px 24px, border-radius 14px. Letter-spacing 0.010em. Sits in pill or rounded-rect variants. The only filled chromatic action in the system.

### Ghost Outlined Button
**Role:** Secondary action paired with filled CTA

Transparent background, 1.5px border in #4d3e78, text in #4d3e78, Roobert weight 600, padding 12px 24px, border-radius 14px. The Book a demo / Sign up free hero pair uses this variant on the right.

### Nav Pill Bar
**Role:** Primary navigation container

White pill-shaped container with rounded 7px internal radii, padding 4px, holds nav links at Roobert 14px weight 500 in #4d3e78. Sticky to top of page.

### Specimen Testimonial Card
**Role:** Customer story or stat card with colored border

White or pastel-tinted background (#e9f3e7, #feede0, #ccdcf8, #ffdce8), 2px border in vivid accent color (Orchid Pink #a54b7a, Tangerine #b74d1a, Cobalt #3c699b, Forest Fern #1f7a57), border-radius 14px, padding 24px. Contains quote text, attribution, and a brand logo. Each card feels like a labeled botanical specimen.

### Product Screenshot Frame
**Role:** Workflow UI mockup floating on hero canvas

White background, 14px radius, subtle 1px border in #eadff8 or no border, large padding around UI chrome. Contains in-app icons, node graphs, and form fields. Positioned at slight overlap angles for depth.

### Logo Strip
**Role:** Social proof — client logos

Horizontal row of monochrome violet (#4d3e78) logos on warm white background, equal vertical centering, 40–60px height per logo, 48–80px gap between logos.

### Feature Side-by-Side
**Role:** Two-column text + product mockup sections

Left column: Reckless subheading 28px in #4d3e78, body copy in #6956a8 at 16px, optional ghost button. Right column: floating product screenshot or illustration. Vertical spacing 80px between sections.

### Event Banner Card
**Role:** Promotional card for virtual events or content

Deep violet background (#4d3e78) variant or pastel-tinted variant. Contains eyebrow date label, Reckless heading, CTA link. Border-radius 14px, padding 32px.

### Stat Callout Card
**Role:** Large-number metric card

Pastel-tinted background, 2px colored border, large Reckless serif number at 46–52px weight 300 in #4d3e78, small caption label in Roobert 14px below. Example: '750 days of work time saved' in pink-bordered card.

### Navigation Link
**Role:** Top-bar nav item with dropdown indicator

Roobert 14px weight 500, color #4d3e78, padding 8px 12px, dropdown chevron at 8px. Hover state: background #f3ecf7, border-radius 7px.

### Footer
**Role:** Site-wide footer

Warm white (#fcf9f5) background, 1px top border in #eadff8, multi-column link grid, Roobert 14px weight 400 in #6956a8, logo in #4d3e78, generous 64px vertical padding.

### Cookie Consent Bar
**Role:** Bottom-pinned consent notice

White background, 1px border in #eadff8, border-radius 14px, body text in #4d3e78 at 14px, 'Accept all' filled violet button on right, 'More options' ghost link beside it.

### Eyebrow Tag
**Role:** Pre-headline category label

Roobert weight 600 at 12px, uppercase, letter-spacing 0.060em, color #4d3e78. Often paired with a small violet dot or arrow. Example: 'Explore' / 'Workflow capability matrix' tags on hero.

## Do's and Don'ts

### Do
- Use 14px border-radius for all cards, buttons, and major containers — this is the system's defining shape and must be applied consistently
- Apply vivid 2px colored borders (Orchid Pink, Tangerine, Cobalt, Forest Fern) to testimonial and stat cards, paired with matching pastel surface tints — this creates the specimen-card signature
- Set Reckless headlines to weight 300 with negative letter-spacing (-2.16px at 72px) — the whisper-weight serif is the anti-convention that makes the brand feel editorial rather than corporate
- Use Iris Glow #745fbb as the ONLY filled button color; pair with ghost outlined #4d3e78 buttons for secondary actions in a 1:1 layout
- Maintain warm-white #fcf9f5 as the page canvas — never use pure white #ffffff for full-page backgrounds; reserve white for cards and product frames
- Apply positive letter-spacing (0.050–0.100em) to uppercase Roobert labels and eyebrow tags for the instrument-label quality
- Use the full color vocabulary per card — each specimen card should pick one accent family (pink, orange, blue, green, teal) and use both the surface tint and border from that family

### Don't
- Don't use drop shadows for elevation — the system relies on borders, surface tints, and color contrast instead; any box-shadow breaks the flat specimen-card aesthetic
- Don't set Reckless headlines to weight 600+ — the system depends on the contrast between light serif display and medium sans body
- Don't introduce gray-only neutrals (#6b7280, #9ca3af) — all neutrals in the system carry a warm or violet cast and live on the Parchment/Lavender Veil spectrum
- Don't use pure black #000000 for text — the dominant text color is Deep Iris #4d3e78, even for body copy
- Don't place UI elements on pure white full-bleed backgrounds — pages should sit on warm Parchment #fcf9f5 with white reserved for elevated cards
- Don't use more than two font families — Reckless for headlines only, Roobert for everything else; mixing additional serifs or sans-serifs fractures the editorial-system feel
- Don't apply the vivid accent colors to large filled regions — they live as 2px borders and small decorative touches, never as full card backgrounds or hero washes

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Parchment | `#fcf9f5` | Page canvas — the warm white base all sections sit on |
| 1 | Lilac Mist | `#f3ecf7` | First elevated surface — table rows, subtle section differentiation, light card backgrounds |
| 2 | Pastel Tints | `#e9f3e7` | Card surface family — each card picks from mint, peach, pink, blue, or sky tints |
| 3 | Pure White | `#ffffff` | Product screenshot frames, modal surfaces, cookie bar — the most elevated layer |

## Elevation

This system deliberately avoids drop-shadow elevation. Depth is created through three mechanisms: (1) warm Parchment canvas beneath white cards, (2) vivid 2px colored borders that frame each card as a labeled specimen, and (3) subtle surface tint shifts between Lilac Mist, pastel tints, and pure white. The result is a flat, editorial, almost botanical-illustration quality — cards feel pinned to the page rather than floating above it.

## Imagery

Imagery is illustrative and decorative rather than photographic. Hand-drawn line illustrations of clouds, paper planes, sprouts, vines, satellites, and botanical elements float across sections in Deep Iris #4d3e78 line work with occasional accent-color fills (Orchid Pink, Tangerine, Forest Fern). The illustrations overlap hero copy and product mockups, creating a layered, scrapbook-like atmosphere. Product screenshots appear as white-carded UI frames showing workflow node graphs, forms, and dashboards — the product is the hero, not stock photography. No live-action photos anywhere; the visual language is 100% illustration + product UI.

## Layout

Max-width 1200px centered with full-bleed warm Parchment canvas. Hero opens with centered Reckless headline over violet-illustration atmosphere, flanked by floating product-screenshot cards at slight overlapping angles. Below the fold: logo strip on white band, then alternating sections — text-left/mockup-right and text-right/mockup-left in a 2-column 50/50 split at 80px vertical gaps. Testimonial section uses a dense 3-4 column grid of pastel specimen cards with 24px gaps. Navigation is a centered floating pill bar at the top with 4 primary items, login/signup links, and a filled Book a demo button on the right. Sections flow seamlessly without dividers — depth comes from surface tints, not lines.

## Agent Prompt Guide

## Quick Color Reference
- text (primary): #4d3e78 (Deep Iris)
- text (secondary): #6956a8 (Amethyst)
- background (page): #fcf9f5 (Parchment)
- border (default): #4d3e78 (Deep Iris)
- accent (pink): #a54b7a
- accent (orange): #b74d1a
- accent (green): #1f7a57
- accent (blue): #3c699b
- primary action: #745fbb (filled action)

## Example Component Prompts

1. **Hero Section**: Warm Parchment #fcf9f5 canvas. Centered Reckless serif headline at 72px weight 300, color #4d3e78, letter-spacing -2.16px, line-height 0.98. Subtext at 18px Roobert weight 400 in #6956a8. Two buttons side by side: ghost outlined (1.5px border #4d3e78, text #4d3e78, 14px radius, 12px 24px padding) and filled (background #745fbb, white text, 14px radius, 12px 24px padding). Decorate with hand-drawn cloud and paper plane illustrations in #4d3e78 line work.

2. **Specimen Testimonial Card**: White background, 2px border in Orchid Pink #a54b7a, 14px radius, 24px padding. Quote text in Reckless 24px weight 400 color #4d3e78. Attribution in Roobert 14px weight 500 in #6956a8. Brand logo at bottom in #4d3e78. Five-star rating in Tangerine #b74d1a below attribution.

3. **Stat Callout Card**: Pastel pink background #ffdce8, 2px border in Orchid Pink #a54b7a, 14px radius, 24px padding. Large Reckless number '750 days' at 52px weight 300, letter-spacing -1.04px, color #4d3e78. Caption below in Roobert 14px weight 500, color #6956a8, letter-spacing 0.050em.

4. **Navigation Pill Bar**: White background, floating centered, border-radius 7px on inner items, max-width 600px, padding 4px. Nav links in Roobert 14px weight 500 color #4d3e78 with 8px padding. Hover state: background #f3ecf7. Filled #745fbb 'Book a demo' button on the right outside the pill with 14px radius.

5. **Product Screenshot Frame**: White background card, 14px radius, subtle 1px border in #eadff8 (Lavender Veil), padding 8px around the UI mockup. Inside: workflow node graph with rounded white nodes connected by thin #4d3e78 lines, small status icons in Forest Fern #1f7a57 and Tangerine #b74d1a.

## Color Family System

The design uses five vivid color families — each family pairs a pastel surface tint with a vivid 2px border. This creates the specimen-card system where every card is clearly labeled and color-coded:

- **Orchid Pink family**: tint #ffdce8, border #a54b7a, text accent #803218
- **Tangerine family**: tint #feede0, border #b74d1a, text accent #e16521
- **Forest Fern family**: tint #e9f3e7, border #1f7a57, text accent #195642
- **Cobalt family**: tint #ccdcf8, border #3c699b, text accent #4780bc
- **Peacock family**: tint #f3ecf7, border #058380, text accent #05a49c

When building any new card, section, or callout, pick one family and use its tint + border together. The Deep Iris #4d3e78 is the universal text and icon color that sits on all families.

## Similar Brands

- **Notion** — Same warm off-white canvas with deep brand-tinted text and a serif/sans typographic pairing, though Notion uses pure black where Tines uses Deep Iris violet
- **Linear** — Shares the pill-shaped navigation bar floating over content and the comfort with whisper-weight headlines over product mockups, though Linear is dark-mode and monochromatic where Tines is light and color-rich
- **Mailchimp** — Both embrace hand-drawn illustration as atmospheric decoration and use vivid accent colors as personality punctuation on a light canvas
- **Pitch** — Similar editorial-serif-headline-over-light-canvas approach with playful illustration accents and a single dominant brand color saturating the interface
- **Webflow** — Both use specimen-card layouts with colored borders and pastel tints for testimonials, and both pair a serif display with a geometric sans body

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-deep-iris: #4d3e78;
  --color-amethyst: #6956a8;
  --color-iris-glow: #745fbb;
  --color-lilac-mist: #f3ecf7;
  --color-parchment: #fcf9f5;
  --color-licheno: #e9f3e7;
  --color-apricot-wash: #feede0;
  --color-rose-quartz: #ffdce8;
  --color-sky-tint: #ccdcf8;
  --color-lavender-veil: #eadff8;
  --color-orchid-pink: #a54b7a;
  --color-tangerine: #b74d1a;
  --color-forest-fern: #1f7a57;
  --color-cobalt: #3c699b;
  --color-peacock: #058380;
  --color-periwinkle: #4780bc;
  --color-plum: #803218;
  --color-crimson: #a53c3a;
  --color-vermilion: #e14f4c;
  --color-pure: #ffffff;

  /* Typography — Font Families */
  --font-reckless: 'Reckless', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-roobert: 'Roobert', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1;
  --tracking-caption: 1px;
  --text-eyebrow: 12px;
  --leading-eyebrow: 1.15;
  --tracking-eyebrow: 0.6px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.4;
  --text-body: 16px;
  --leading-body: 1.4;
  --text-subheading: 20px;
  --leading-subheading: 1.2;
  --tracking-subheading: -0.4px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.1;
  --tracking-heading-sm: -0.36px;
  --text-heading: 28px;
  --leading-heading: 1.05;
  --tracking-heading: -0.42px;
  --text-heading-lg: 52px;
  --leading-heading-lg: 1;
  --tracking-heading-lg: -1.04px;
  --text-display: 72px;
  --leading-display: 0.98;
  --tracking-display: -2.16px;

  /* Typography — Weights */
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  --font-weight-black: 900;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-72: 72px;
  --spacing-96: 96px;
  --spacing-156: 156px;
  --spacing-168: 168px;
  --spacing-200: 200px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 24px;
  --element-gap: 24px;

  /* Border Radius */
  --radius-sm: 3px;
  --radius-md: 7px;
  --radius-lg: 9.6px;
  --radius-xl: 14px;
  --radius-2xl: 21.6px;
  --radius-3xl: 24px;
  --radius-3xl-2: 28px;
  --radius-3xl-3: 36px;
  --radius-3xl-4: 39px;

  /* Named Radii */
  --radius-nav: 7px;
  --radius-tags: 7px;
  --radius-cards: 14px;
  --radius-pills: 9999px;
  --radius-buttons: 14px;

  /* Surfaces */
  --surface-parchment: #fcf9f5;
  --surface-lilac-mist: #f3ecf7;
  --surface-pastel-tints: #e9f3e7;
  --surface-pure-white: #ffffff;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-deep-iris: #4d3e78;
  --color-amethyst: #6956a8;
  --color-iris-glow: #745fbb;
  --color-lilac-mist: #f3ecf7;
  --color-parchment: #fcf9f5;
  --color-licheno: #e9f3e7;
  --color-apricot-wash: #feede0;
  --color-rose-quartz: #ffdce8;
  --color-sky-tint: #ccdcf8;
  --color-lavender-veil: #eadff8;
  --color-orchid-pink: #a54b7a;
  --color-tangerine: #b74d1a;
  --color-forest-fern: #1f7a57;
  --color-cobalt: #3c699b;
  --color-peacock: #058380;
  --color-periwinkle: #4780bc;
  --color-plum: #803218;
  --color-crimson: #a53c3a;
  --color-vermilion: #e14f4c;
  --color-pure: #ffffff;

  /* Typography */
  --font-reckless: 'Reckless', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-roobert: 'Roobert', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1;
  --tracking-caption: 1px;
  --text-eyebrow: 12px;
  --leading-eyebrow: 1.15;
  --tracking-eyebrow: 0.6px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.4;
  --text-body: 16px;
  --leading-body: 1.4;
  --text-subheading: 20px;
  --leading-subheading: 1.2;
  --tracking-subheading: -0.4px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.1;
  --tracking-heading-sm: -0.36px;
  --text-heading: 28px;
  --leading-heading: 1.05;
  --tracking-heading: -0.42px;
  --text-heading-lg: 52px;
  --leading-heading-lg: 1;
  --tracking-heading-lg: -1.04px;
  --text-display: 72px;
  --leading-display: 0.98;
  --tracking-display: -2.16px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-72: 72px;
  --spacing-96: 96px;
  --spacing-156: 156px;
  --spacing-168: 168px;
  --spacing-200: 200px;

  /* Border Radius */
  --radius-sm: 3px;
  --radius-md: 7px;
  --radius-lg: 9.6px;
  --radius-xl: 14px;
  --radius-2xl: 21.6px;
  --radius-3xl: 24px;
  --radius-3xl-2: 28px;
  --radius-3xl-3: 36px;
  --radius-3xl-4: 39px;
}
```
