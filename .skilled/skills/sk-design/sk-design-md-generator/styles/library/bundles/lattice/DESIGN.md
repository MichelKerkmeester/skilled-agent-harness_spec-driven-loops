# Lattice — Style Reference
> Botanical field journal on warm parchment — a quiet cream canvas where dark forest ink does the speaking and pastel specimen cards provide the color.

**Theme:** light

Lattice reads like a botanical field journal rendered in product form: a warm parchment canvas (#f7f6f2) carries the entire site, with a single near-black forest ink (#001f1f) doing the heavy lifting as both primary text and primary action surface. The signature is a system of pastel-tinted feature cards — mint, lime, lavender, buttercream — each color-coding a product module like a specimen tray, paired with dark filled and outlined buttons in the same forest green. Typography is a single geometric sans (Matter) at compact sizes, with tight tracking on large display copy and wide tracking on small uppercase labels. Everything sits on generous rounded corners (14–29px), soft 1px-tinted shadows, and zero decorative noise — color appears as functional punctuation, not ornament.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Parchment | `#f7f6f2` | `--color-parchment` | Page background — the warm off-white canvas that gives the entire system its paper-like, non-clinical feel. Never use pure white for the body background |
| Paper White | `#ffffff` | `--color-paper-white` | Card surfaces, product UI mockups, and embedded media containers — pure white lifted above the parchment canvas to create subtle elevation without shadows |
| Forest Ink | `#001f1f` | `--color-forest-ink` | Neutral form states, badge text, and quiet UI feedback where color should stay understated. Do not promote it to the primary CTA color |
| Lichen Gray | `#5c7070` | `--color-lichen-gray` | Secondary text and medium-emphasis borders. Sits between Forest Ink and the lighter grays — use for body descriptions, supporting copy, and subtle dividers |
| Stone | `#6a7878` | `--color-stone` | Muted body text, nav borders, and tertiary UI elements. The readable-but-quiet gray for descriptions and helper text |
| Slate | `#455252` | `--color-slate` | Dark borders and separators for elevated surfaces and inverted UI. Do not promote it to the primary CTA color |
| Mist | `#889494` | `--color-mist` | Lightest text tier — captions, metadata, tertiary labels. Use for timestamps, footnotes, and non-essential annotations |
| Meadow | `#cdface` | `--color-meadow` | Pill badge fills, success highlights, and light accent surfaces. The signature light green for category tags, status indicators, and soft highlight washes |
| Deep Forest | `#2a4e1c` | `--color-deep-forest` | Dark green accent for data visualization, illustration strokes, and secondary green elements. Distinct from Forest Ink in that it reads clearly as green, not near-black |
| Deep Teal | `#003d3d` | `--color-deep-teal` | Secondary brand accent — teal-toned borders, illustration fills, and data visualization. Used alongside Deep Forest for multi-color charts and decorative elements |
| Olive | `#515c0b` | `--color-olive` | Chart and illustration accent — the yellow-green in the multi-color palette system. Used in data bars, category indicators, and decorative strokes |
| Plum | `#7a2251` | `--color-plum` | Magenta-pink accent for data visualization and illustration. The warm-cool counterpoint in the multi-color palette system |
| Saffron | `#a36a14` | `--color-saffron` | Amber-gold accent for data visualization and illustration. The warm yellow in the multi-color palette system, used in charts and decorative strokes |
| Iris | `#652ea3` | `--color-iris` | Violet accent for data visualization, illustration strokes, and the integrations section gradient. The cool counterpoint in the multi-color palette |
| Mint Surface | `#e4f7f9` | `--color-mint-surface` | Pastel feature card background — the pale aqua tint assigned to product modules like Performance. Each product area gets its own pastel home |
| Lime Surface | `#f8fbe7` | `--color-lime-surface` | Pastel feature card background — the pale yellow-green tint for modules like Goals & OKRs. The warmest pastel in the system |
| Lavender Surface | `#e1e1fa` | `--color-lavender-surface` | Pastel card background — pale violet for testimonial cards, secondary feature blocks, and the cool side of the pastel system |
| Blush Surface | `#fcf2fe` | `--color-blush-surface` | Pastel card background — near-white pink for subtle surface differentiation. The quietest of the pastel tints |
| Buttercream | `#fff3c2` | `--color-buttercream` | Warm pastel accent surface — soft yellow for tag backgrounds and light highlight zones |
| Sage Glow | `#eff5ce` | `--color-sage-glow` | Green pastel accent for tag backgrounds and soft category highlights. A more saturated green than Lime Surface |
| Petal | `#fde5ff` | `--color-petal` | Pink pastel accent for tag backgrounds and soft category highlights |
| Lilac Stroke | `#dcc2eb` | `--color-lilac-stroke` | Muted violet for illustration strokes and decorative outlines |
| Halo Gradient | `radial-gradient(circle, rgb(191, 241, 245) 32%, rgb(169, 235, 169) 64%, rgb(103, 226, 235))` | `--color-halo-gradient` | Hero radial gradient — the lime-to-teal aurora behind the product device frame. Evokes a natural, organic light source rather than a tech glow |

## Tokens — Typography

### Matter — Sole typeface across the entire system — nav, body, buttons, headings, and display. A geometric sans with humanist warmth that keeps the warm-parchment aesthetic feeling organic rather than clinical. Weight 500 for headings and buttons, weight 400 for body and supporting text. Tight tracking (-0.024em) on display sizes creates a compact, confident headline; wide tracking (0.08em) on 11px labels gives uppercase tags breathing room. · `--font-matter`
- **Substitute:** Inter, DM Sans, or Switzer
- **Weights:** 400, 500
- **Sizes:** 11, 13, 14, 16, 17, 18, 19, 22, 47, 72
- **Line height:** 0.90, 1.00, 1.10, 1.20, 1.30
- **Letter spacing:** -0.024em on display/headings (47–72px), 0.08em on 11px uppercase labels, normal at body sizes
- **Role:** Sole typeface across the entire system — nav, body, buttons, headings, and display. A geometric sans with humanist warmth that keeps the warm-parchment aesthetic feeling organic rather than clinical. Weight 500 for headings and buttons, weight 400 for body and supporting text. Tight tracking (-0.024em) on display sizes creates a compact, confident headline; wide tracking (0.08em) on 11px labels gives uppercase tags breathing room.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 11px | 1.3 | 0.88px | `--text-caption` |
| body-sm | 14px | 1.3 | — | `--text-body-sm` |
| body | 16px | 1.3 | — | `--text-body` |
| subheading | 19px | 1.2 | — | `--text-subheading` |
| heading-sm | 22px | 1.2 | — | `--text-heading-sm` |
| heading | 47px | 1 | -1.13px | `--text-heading` |
| display | 72px | 0.9 | -1.73px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** compact

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 8 | 8px | `--spacing-8` |
| 12 | 12px | `--spacing-12` |
| 20 | 20px | `--spacing-20` |
| 36 | 36px | `--spacing-36` |
| 48 | 48px | `--spacing-48` |
| 72 | 72px | `--spacing-72` |
| 116 | 116px | `--spacing-116` |
| 188 | 188px | `--spacing-188` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 14px |
| badges | 22px |
| inputs | 12px |
| buttons | 29px |
| feature-cards | 14-43px |
| small-elements | 7px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| md | `color(srgb 0 0.121569 0.121569 / 0.04) 0px 12px 12px -6px...` | `--shadow-md` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 72px
- **Card padding:** 28px
- **Element gap:** 8-12px

## Components

### Filled Primary Button
**Role:** Main call-to-action — the highest-emphasis interactive element

Filled Forest Ink (#001f1f) background with white text. 29px border-radius (pill-like but slightly softened). 13px vertical / 11-18px horizontal padding. Matter 500 at 14-16px. Letter-spacing normal. This is the dark anchor that makes the warm cream canvas feel intentional.

### Outlined Secondary Button
**Role:** Companion to the primary CTA — same hierarchy weight, different surface treatment

Transparent background with 1.5px Forest Ink (#001f1f) border. Forest Ink text. 29px border-radius. Same padding as filled variant. Pairs directly beside the filled button (e.g. 'Request a demo' filled + 'Take a tour' outlined).

### Category Pill Badge
**Role:** Section labels and content taxonomy markers

Meadow (#cdface) background fill with Forest Ink (#001f1f) text and a 1px Forest Ink border. 22px border-radius. ~9px vertical / 11px horizontal padding. Matter 500 at 13px. Always paired with a small arrow icon (→) inside a circular forest-ink container on the right.

### Pastel Feature Card
**Role:** Product module showcase — each product area gets its own colored home

Rounded card with a pastel tint background (Mint #e4f7f9, Lime #f8fbe7, Lavender #e1e1fa). 14-43px border-radius. Contains a category icon (circular, filled with a slightly deeper shade), a title in Forest Ink at 19-22px, a description in Lichen Gray, and an embedded product UI screenshot. The pastel tint is the card's identity — never apply gradients or patterns to these.

### Testimonial Card
**Role:** Social proof — customer quotes with quantified results

Lavender (#e1e1fa) or pastel-tinted background. 14px border-radius. Contains: avatar (circular, ~48px), name in Forest Ink at 16px weight 500, role/company in Lichen Gray, quote text in Forest Ink at 14-16px, a large stat number (e.g. '30h', '2,000') in Forest Ink at 47px, and a 'Read the story →' link in Forest Ink.

### Product Device Frame
**Role:** Hero visual — the product UI displayed inside a device/laptop frame

A rounded-corner container (large radius ~14-29px) showing the product interface on a white card. Set against the Hero Gradient (radial mint→lime→teal). The frame has a subtle forest-tinted shadow. This is the only place where the radial gradient appears.

### Integration Banner
**Role:** Section-level call-to-action linking to integrations

Full-width card with a violet-to-blue gradient background. Contains a centered 'Integrations →' pill badge. Wide radius (~14-29px). This gradient is the cool counterpart to the hero's warm radial — used once per page as a section closer.

### Top Navigation
**Role:** Primary site navigation — persistent across all pages

Sticky top bar on Parchment background. Lattice logo (dark teal text + small multi-color petal icon) on the left. Center: nav items (Platform, Why Lattice, Customers, Resources, Pricing) in Slate (#455252) at 14px weight 500 with dropdown chevrons. Right: 'Log in' text link and a filled Forest Ink 'Request a demo' button with 11.5px radius.

### Announcement Banner
**Role:** Top-of-page promotional strip

Sits above the nav bar. Light mint/teal background. Contains event title in Forest Ink at 13px, a vertical divider, and a 'Register now →' link. Can be dismissed with a close button on the right.

### Customer Logo Strip
**Role:** Social proof — trusted-by logos below the hero

Horizontal row of customer logos (greenhouse, Robinhood, loom, duolingo, Discord, brooklinen, npr, gusto) in muted gray tones on the Parchment background. Logos sit at uniform size with even spacing. No background card — the logos float on the canvas.

### Link with Arrow
**Role:** Inline navigation link — used in body copy and card footers

Forest Ink text with an arrow character (→) trailing. Underlined on hover. 14-16px Matter 500. No background or border — color and weight carry the emphasis.

### Section Header
**Role:** Page section title pattern — the universal section opener

Category Pill Badge on top, then a heading at 47px Matter 500 in Forest Ink with -1.13px tracking, line-height 1.00. To the right or below: a description paragraph in Lichen Gray at 16-19px, optionally followed by a Link with Arrow. The badge → heading → description rhythm repeats across every section.

## Do's and Don'ts

### Do
- Use #001f1f (Forest Ink) for all primary text, primary buttons, and structural borders — let one dark color carry the entire system's weight
- Use Parchment #f7f6f2 as the page background on all screens — never substitute pure white for the body canvas
- Assign each product module or section category its own pastel tint (Mint, Lime, Lavender, Blush) for its feature card background — the color-coding system is signature
- Pair filled and outlined buttons side by side for every primary action: filled Forest Ink + outlined Forest Ink at 29px radius
- Use the 11px caption size with 0.08em letter-spacing for uppercase category labels and micro-text — wide tracking is the system's way of signaling 'tag/label'
- Apply the radial gradient (mint→lime→teal) only in the hero device frame area — it is a single-use atmospheric element, not a repeatable pattern
- Use the soft forest-tinted shadow stack (4% alpha, negative spread) for all card and image elevation — the 1px final ring replaces explicit border declarations

### Don't
- Don't use pure black (#000000) for text or UI elements — Forest Ink #001f1f is always the dark structural color, even though contrast ratios are identical
- Don't apply the pastel surface tints to full-page sections — they belong only on contained feature cards and testimonial blocks
- Don't use sharp corners (0px radius) on any interactive element — the system minimum is 7px, and most elements are 14-29px
- Don't introduce additional accent colors beyond the defined palette — the multi-color chart system (Deep Forest, Deep Teal, Olive, Plum, Saffron, Iris) is reserved for data visualization and illustration, never for UI surfaces
- Don't use heavy or high-opacity shadows — the entire shadow system stays at 0.04-0.08 alpha for the organic, paper-like lift
- Don't place colored buttons (green, violet, etc.) as primary actions — the primary CTA is always Forest Ink filled, regardless of section context
- Don't break the badge → heading → description section header rhythm — every section opens with the Category Pill Badge, then heading, then description

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Parchment Canvas | `#f7f6f2` | Page background — the base layer everything sits on |
| 1 | Paper White Card | `#ffffff` | Product UI mockups, embedded content, and standard card surfaces lifted above the canvas |
| 2 | Pastel Feature Card | `#e4f7f9` | Color-coded product module cards — mint, lime, lavender tints assign each feature area its own visual territory |

## Elevation

- **Cards, images, icons, links:** `color(srgb 0 0.121569 0.121569 / 0.04) 0px 12px 12px -6px, color(srgb 0 0.121569 0.121569 / 0.04) 0px 6px 6px -3px, color(srgb 0 0.121569 0.121569 / 0.04) 0px 3px 3px -1.5px, color(srgb 0 0.121569 0.121569 / 0.08) 0px 1px 1px -0.5px, color(srgb 0 0.121569 0.121569 / 0.04) 0px 0px 0px 1px`

## Imagery

Imagery is product-led, not lifestyle. The hero uses a device frame containing a real product UI screenshot set against a soft radial gradient — no stock photography of people. Feature cards embed actual product interface screenshots (performance review panels, OKR tracking lists) as the primary visual proof. Customer logos appear in a flat monochrome strip — no testimonials photography beyond circular avatar crops. The only non-product visual element is the multi-color petal flower icon in the logo, which hints at the botanical/growth metaphor. All imagery sits on rounded containers with the soft forest-tinted shadow. No full-bleed photography anywhere — the Parchment canvas always wraps the content.

## Layout

Max-width 1200px centered, never full-bleed. Every section follows the same opening rhythm: Category Pill Badge → bold heading at 47px → description paragraph → content. The hero uses a two-column split (headline + buttons on the left, description text on the right) rather than a centered stack. Product feature sections use a 2-column card grid where each card has its own pastel tint. Testimonials display in a horizontal carousel with 3-up cards and dot pagination. Section gaps are generous (~72px) creating breathing room between bands. Navigation is a sticky top bar with the announcement banner above it. The page reads top-to-bottom as: announcement → nav → hero (split layout + device frame) → logo strip → platform overview (2-col pastel cards) → customer stories (carousel) → integrations banner (gradient closer).

## Agent Prompt Guide

## Quick Color Reference
- Text: #001f1f (Forest Ink)
- Background: #f7f6f2 (Parchment)
- Border: #5c7070 (Lichen Gray) or #001f1f for structural borders
- Accent: #cdface (Meadow) for badges and highlights
- primary action: #cdface (filled action)
- Card surface: #ffffff (Paper White) for product UI, pastel tints (#e4f7f9, #f8fbe7, #e1e1fa) for feature cards

## Example Component Prompts

1. **Hero Section**: Parchment (#f7f6f2) background. Headline at 72px Matter 500, #001f1f, letter-spacing -1.73px, line-height 0.90. Subtext at 19px Matter 400, #5c7070. Filled button: #001f1f background, white text, 29px radius, 13px 18px padding. Outlined button beside it: transparent, 1.5px #001f1f border, #001f1f text, 29px radius. Below: product device frame on a radial gradient (mint→lime→teal).

2. **Pastel Feature Card**: Mint (#e4f7f9) background fill, 14px radius. Category icon in a circular container with a slightly deeper mint. Title at 22px Matter 500, #001f1f. Description at 16px Matter 400, #5c7070. Embedded white product UI card with soft forest-tinted shadow.

3. **Category Pill Badge**: #cdface background, 1px #001f1f border, 22px radius, 9px 11px padding. Text at 13px Matter 500, #001f1f, with 0.08em letter-spacing. Small arrow icon in a circular #001f1f container on the right.

4. **Testimonial Card**: Lavender (#e1e1fa) background, 14px radius. Circular avatar (48px) top-left. Name at 16px Matter 500, #001f1f. Role in #5c7070 at 14px. Quote in #001f1f at 14px. Large stat number at 47px Matter 500, #001f1f. 'Read the story →' link in #001f1f at 14px Matter 500.

5. **Integration Banner**: Full-width card with violet-to-blue linear gradient background, 14px radius. Centered 'Integrations →' pill badge in white/forest-ink styling. 72px vertical padding.

## Pastel System

Each product module or content category is assigned a pastel tint that serves as its visual home. This is not a random color rotation — it is a deliberate taxonomy system where users begin to associate Mint = Performance, Lime = Goals & OKRs, Lavender = Testimonials. When creating a new section, pick the pastel that matches the content category and use it only for that section's feature card background. The full pastel set: Mint #e4f7f9, Lime #f8fbe7, Lavender #e1e1fa, Blush #fcf2fe, Buttercream #fff3c2, Sage #eff5ce, Petal #fde5ff. Never apply pastels to full-width sections or to non-card elements.

## Similar Brands

- **Notion** — Same warm off-white canvas approach with a single dark text/button color and pastel-tinted feature blocks replacing section dividers
- **Linear** — Compact geometric sans-serif typography with tight tracking on large headlines and a restrained color palette that lets one dark accent do the structural work
- **Webflow** — Product-led homepage with embedded UI screenshots in rounded device frames, pastel-tinted feature cards, and a dark single-color primary CTA
- **Intercom** — Warm non-white canvas with soft shadows, pill-shaped badges, and a system of color-coded product cards each in its own pastel hue

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-parchment: #f7f6f2;
  --color-paper-white: #ffffff;
  --color-forest-ink: #001f1f;
  --color-lichen-gray: #5c7070;
  --color-stone: #6a7878;
  --color-slate: #455252;
  --color-mist: #889494;
  --color-meadow: #cdface;
  --color-deep-forest: #2a4e1c;
  --color-deep-teal: #003d3d;
  --color-olive: #515c0b;
  --color-plum: #7a2251;
  --color-saffron: #a36a14;
  --color-iris: #652ea3;
  --color-mint-surface: #e4f7f9;
  --color-lime-surface: #f8fbe7;
  --color-lavender-surface: #e1e1fa;
  --color-blush-surface: #fcf2fe;
  --color-buttercream: #fff3c2;
  --color-sage-glow: #eff5ce;
  --color-petal: #fde5ff;
  --color-lilac-stroke: #dcc2eb;
  --color-halo-gradient: #a9eba9;
  --gradient-halo-gradient: radial-gradient(circle, rgb(191, 241, 245) 32%, rgb(169, 235, 169) 64%, rgb(103, 226, 235));

  /* Typography — Font Families */
  --font-matter: 'Matter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.3;
  --tracking-caption: 0.88px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.3;
  --text-body: 16px;
  --leading-body: 1.3;
  --text-subheading: 19px;
  --leading-subheading: 1.2;
  --text-heading-sm: 22px;
  --leading-heading-sm: 1.2;
  --text-heading: 47px;
  --leading-heading: 1;
  --tracking-heading: -1.13px;
  --text-display: 72px;
  --leading-display: 0.9;
  --tracking-display: -1.73px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-20: 20px;
  --spacing-36: 36px;
  --spacing-48: 48px;
  --spacing-72: 72px;
  --spacing-116: 116px;
  --spacing-188: 188px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 72px;
  --card-padding: 28px;
  --element-gap: 8-12px;

  /* Border Radius */
  --radius-lg: 7.2192px;
  --radius-xl: 11.5507px;
  --radius-xl-2: 14.4384px;
  --radius-2xl: 18.048px;
  --radius-2xl-2: 21.6576px;
  --radius-3xl: 28.8768px;
  --radius-3xl-2: 43.3152px;

  /* Named Radii */
  --radius-cards: 14px;
  --radius-badges: 22px;
  --radius-inputs: 12px;
  --radius-buttons: 29px;
  --radius-feature-cards: 14-43px;
  --radius-small-elements: 7px;

  /* Shadows */
  --shadow-md: color(srgb 0 0.121569 0.121569 / 0.04) 0px 12px 12px -6px, color(srgb 0 0.121569 0.121569 / 0.04) 0px 6px 6px -3px, color(srgb 0 0.121569 0.121569 / 0.04) 0px 3px 3px -1.5px, color(srgb 0 0.121569 0.121569 / 0.08) 0px 1px 1px -0.5px, color(srgb 0 0.121569 0.121569 / 0.04) 0px 0px 0px 1px;

  /* Surfaces */
  --surface-parchment-canvas: #f7f6f2;
  --surface-paper-white-card: #ffffff;
  --surface-pastel-feature-card: #e4f7f9;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-parchment: #f7f6f2;
  --color-paper-white: #ffffff;
  --color-forest-ink: #001f1f;
  --color-lichen-gray: #5c7070;
  --color-stone: #6a7878;
  --color-slate: #455252;
  --color-mist: #889494;
  --color-meadow: #cdface;
  --color-deep-forest: #2a4e1c;
  --color-deep-teal: #003d3d;
  --color-olive: #515c0b;
  --color-plum: #7a2251;
  --color-saffron: #a36a14;
  --color-iris: #652ea3;
  --color-mint-surface: #e4f7f9;
  --color-lime-surface: #f8fbe7;
  --color-lavender-surface: #e1e1fa;
  --color-blush-surface: #fcf2fe;
  --color-buttercream: #fff3c2;
  --color-sage-glow: #eff5ce;
  --color-petal: #fde5ff;
  --color-lilac-stroke: #dcc2eb;
  --color-halo-gradient: #a9eba9;

  /* Typography */
  --font-matter: 'Matter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.3;
  --tracking-caption: 0.88px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.3;
  --text-body: 16px;
  --leading-body: 1.3;
  --text-subheading: 19px;
  --leading-subheading: 1.2;
  --text-heading-sm: 22px;
  --leading-heading-sm: 1.2;
  --text-heading: 47px;
  --leading-heading: 1;
  --tracking-heading: -1.13px;
  --text-display: 72px;
  --leading-display: 0.9;
  --tracking-display: -1.73px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-20: 20px;
  --spacing-36: 36px;
  --spacing-48: 48px;
  --spacing-72: 72px;
  --spacing-116: 116px;
  --spacing-188: 188px;

  /* Border Radius */
  --radius-lg: 7.2192px;
  --radius-xl: 11.5507px;
  --radius-xl-2: 14.4384px;
  --radius-2xl: 18.048px;
  --radius-2xl-2: 21.6576px;
  --radius-3xl: 28.8768px;
  --radius-3xl-2: 43.3152px;

  /* Shadows */
  --shadow-md: color(srgb 0 0.121569 0.121569 / 0.04) 0px 12px 12px -6px, color(srgb 0 0.121569 0.121569 / 0.04) 0px 6px 6px -3px, color(srgb 0 0.121569 0.121569 / 0.04) 0px 3px 3px -1.5px, color(srgb 0 0.121569 0.121569 / 0.08) 0px 1px 1px -0.5px, color(srgb 0 0.121569 0.121569 / 0.04) 0px 0px 0px 1px;
}
```
