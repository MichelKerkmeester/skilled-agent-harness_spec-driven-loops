# Lithic — Style Reference
> Warm marble briefing room for card architects — confident, earthy, deliberate.

**Theme:** light

Lithic operates as a warm briefing room for card-issuing architects: cream marble surfaces, a single confident sans-serif, and three deliberate accent colors that each carry distinct semantic weight. The page alternates a deep black hero — a vault-like stage for physical card imagery and concentric arc patterns — with generously spaced warm-neutral sections where orange, violet, and green act as functional punctuation rather than decoration. Components feel editorial: thin hairline borders, 24px rounded corners, deep floating shadows on elevated cards, and cream-tinted surfaces that stack into a quiet hierarchy. Density is comfortable, rhythm is built from 8px and 24px increments, and the single Monument Grotesk family at weights 400/500 is allowed to carry every tonal shift from whisper to emphasis through size and tracking alone.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Ember Orange | `#ff6600` | `--color-ember-orange` | Primary action fill on CTA buttons, contact links, and key navigation entry points — warm saturated orange against cream and black grounds commands without feeling aggressive |
| Architect Violet | `#5c2999` | `--color-architect-violet` | Decorative stroke and border accent for feature panels, concentric arc illustrations, and iconography — deep saturated violet that frames content without competing with orange CTAs |
| Lichen Green | `#00cc88` | `--color-lichen-green` | Green outline accent for tags, dividers, and focused UI edges. Use as a supporting accent, not as a status color |
| Sandstone | `#aa8855` | `--color-sandstone` | Muted warm stroke and illustration tone used in decorative arc patterns, card imagery borders, and secondary outline accents |
| Bark Brown | `#665233` | `--color-bark-brown` | Darker warm tone for card-surface strokes, secondary illustration fills, and text-adjacent decorative borders |
| Honey Bronze | `#eec07a` | `--color-honey-bronze` | Lighter warm fill for icon strokes and card accent borders — sits between the muted sandstone and the cream surfaces |
| Obsidian | `#000000` | `--color-obsidian` | Primary text, hero canvas, deep card-image borders, ghost-button outlines — the structural anchor color |
| Paper White | `#ffffff` | `--color-paper-white` | Page canvas, card surfaces, primary text on dark grounds, button text on orange fills |
| Warm Cream | `#f6f3ee` | `--color-warm-cream` | Primary warm card and panel surface — the default elevated neutral for feature blocks and content containers |
| Lavender Mist | `#f6f1fe` | `--color-lavender-mist` | Cool-tinted feature panel surface used to break rhythm on alternating sections — pairs with the violet accent |
| Mint Whisper | `#ebfef6` | `--color-mint-whisper` | Primary page canvas and white card surfaces |
| Ash Gray | `#888888` | `--color-ash-gray` | Secondary body text, muted link borders, and disabled-state iconography |
| Smoke | `#e5e5e5` | `--color-smoke` | Hairline border on light neutral buttons and tertiary dividers |

## Tokens — Typography

### ABC Monument Grotesk — Sole typeface across every surface — a single custom grotesque that carries hierarchy through size, weight, and consistent -0.02em tracking. Weight 400 handles body, nav, and secondary text; weight 500 lifts buttons, active nav items, and key labels. The extremely tight 64px display at line-height 1.0 and the same -0.02em tracking at 14px body is signature — tracking never loosens regardless of size, which is unusual and unifies the scale. · `--font-abc-monument-grotesk`
- **Substitute:** Inter (closest open-source match for grotesque geometry and tight tracking behavior)
- **Weights:** 400, 500
- **Sizes:** 14, 16, 20, 24, 36, 64
- **Line height:** 1.0–1.71 (1.0 display, 1.2 large headings, 1.4–1.5 subheads, 1.5–1.71 body)
- **Letter spacing:** -0.02em across all sizes and weights
- **Role:** Sole typeface across every surface — a single custom grotesque that carries hierarchy through size, weight, and consistent -0.02em tracking. Weight 400 handles body, nav, and secondary text; weight 500 lifts buttons, active nav items, and key labels. The extremely tight 64px display at line-height 1.0 and the same -0.02em tracking at 14px body is signature — tracking never loosens regardless of size, which is unusual and unifies the scale.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 14px | 1.52 | -0.28px | `--text-caption` |
| body-sm | 16px | 1.5 | -0.32px | `--text-body-sm` |
| subheading | 20px | 1.4 | -0.4px | `--text-subheading` |
| heading-sm | 24px | 1.2 | -0.48px | `--text-heading-sm` |
| heading | 36px | 1.2 | -0.72px | `--text-heading` |
| display | 64px | 1 | -1.28px | `--text-display` |

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
| 120 | 120px | `--spacing-120` |
| 160 | 160px | `--spacing-160` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 24px |
| icons | 800px |
| images | 21.6px |
| buttons | 24px |
| smallElements | 8px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| xl | `rgba(0, 0, 0, 0.5) 0px 16px 32px 0px` | `--shadow-xl` |
| sm | `rgba(0, 0, 0, 0.1) 0px 4px 8px 0px` | `--shadow-sm` |
| xl-2 | `rgba(0, 0, 0, 0.1) 0px 16px 32px 0px` | `--shadow-xl-2` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 40px
- **Element gap:** 24px

## Components

### Primary CTA Button
**Role:** Main conversion action (Contact us, Get started)

Filled button: #ff6600 background, white text, Monument Grotesk weight 500 at 16px, 24px border-radius, 12px vertical and 38px horizontal padding, 0px 4px 8px 0px rgba(0,0,0,0.1) shadow. Includes a trailing arrow icon at 16px.

### Ghost Navigation Button
**Role:** Secondary action in nav and hero (Dashboard, Explore Sandbox)

Transparent background with 1px #000000 border, black text weight 500 at 16px, 8px border-radius, 10px vertical and 16px horizontal padding, trailing arrow icon.

### Warm Feature Card
**Role:** Default content card for feature blocks and trust signals

#f6f3ee background, no visible border, 24px border-radius, 40px padding. Content stacks vertically: heading at 24px weight 500, body at 16px weight 400, optional inline metadata. Often paired with a decorative concentric-arc illustration bleeding to one edge.

### Lavender Feature Panel
**Role:** Product feature showcase with violet accent

#f6f1fe background, 24px border-radius, 40px padding, violet concentric-arc pattern as background decoration. Contains split layout: text column left, product mockup right with status indicators.

### Mint Metric Callout
**Role:** Inline highlight panel for key statistics

#ebfef6 background, 24px border-radius, compact padding (~16-24px). Pairs with green accent text (#00cc88) for metric values and black for labels.

### Top Navigation Bar
**Role:** Primary site navigation

White background, full-width, left-aligned wordmark LITHIC in Monument Grotesk weight 500 at 20px with tracking -0.4px. Nav links in weight 400 at 16px, separated by ~24px gap. Right-aligned: text link (Contact us) and ghost button (Dashboard). Vertical padding 16-24px.

### Hero Vault
**Role:** Above-the-fold dramatic section

#000000 background filling full viewport width, rounded bottom corners (24px) on inner container. Large concentric-arc pattern in muted strokes (#aa8855, #665233). Headline at 64px weight 500 white, line-height 1.0, tracking -1.28px. Subhead at 20px white at 70% opacity. Two buttons side by side: ghost + primary.

### Brand Logo Strip
**Role:** Social proof and trust signal

Horizontal row of monochrome wordmarks on warm cream section, centered, evenly spaced with 48-64px gaps. Logos rendered in #000000 or desaturated gray, each ~80-100px wide.

### Availability Status Badge
**Role:** Live-status indicator in product mockups

Small inline group: 6-8px filled circle in #00cc88 followed by label text in #000000 at 14px weight 400. Aligned right within list rows.

### Concentric Arc Decoration
**Role:** Brand illustration pattern

Repeating thin-stroke arcs in warm tones (#aa8855, #665233, #5c2999) creating topographical or radar-like patterns. Used as background or edge decoration on feature cards and the hero. Stroke weight 1-2px, no fill.

### Inline Product Mockup Card
**Role:** Embedded screenshot or product UI illustration

White or cream surface, 24px border-radius, 21.6px image radius for contained product images, 0px 16px 32px rgba(0,0,0,0.1) shadow. Contains realistic UI: list rows, bar charts, status pills.

### Check List Item
**Role:** Feature bullet in detail panels

Inline row: 16-20px circular #5c2999 icon with white check mark, 8-12px right gap, label text in #000000 at 16px weight 400. Items stack with 12-16px vertical gap.

### CTA Footer Bar
**Role:** Bottom call-to-action band

Full-width band with mint or cream surface, centered text stack, multiple inline links with arrow icons. Headline at 20-24px weight 500, links at 16px weight 400 with 24-32px horizontal gap.

## Do's and Don'ts

### Do
- Use 24px border-radius on all cards, panels, and primary buttons to maintain the soft, editorial card geometry
- Apply -0.02em tracking at every type size from 14px body through 64px display — tracking never loosens with size
- Reserve #ff6600 exclusively for filled primary CTAs and use a ghost black-border button as the secondary action beside it
- Use #f6f3ee as the default warm card surface and alternate with #f6f1fe (lavender) and #ebfef6 (mint) at section transitions
- Set Monument Grotesk weight 500 for all interactive elements, labels, and display text; reserve weight 400 for body and secondary copy
- Anchor every page section with generous vertical rhythm — minimum 80px between major sections, 40px internal card padding
- Use the concentric-arc illustration pattern in warm muted tones (#aa8855, #665233) as section-edge decoration, never as foreground content

### Don't
- Do not loosen letter-spacing at larger sizes — the -0.02em tracking is constant across the entire scale and is signature
- Do not use the orange #ff6600 for body text, icons, or decorative borders — it is a filled-action color only
- Do not mix the violet #5c2999 and orange #ff6600 in the same component — each owns a distinct semantic zone
- Do not apply heavy shadows to small elements; reserve rgba(0,0,0,0.5) 0px 16px 32px for elevated cards only
- Do not introduce new sans-serif families — Monument Grotesk is the only typeface and the constraint is part of the identity
- Do not use sharp 0px corners on interactive elements — minimum 8px on small controls, 24px on cards and buttons
- Do not place dark text on the warm cream surface at less than 16px — 14px caption copy should use #888888 for hierarchy

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Obsidian Vault | `#000000` | Hero canvas and dramatic section backgrounds |
| 1 | Paper White | `#ffffff` | Page base canvas and default card surface |
| 2 | Warm Cream | `#f6f3ee` | Primary warm elevated card and feature panel surface |
| 3 | Lavender Mist | `#f6f1fe` | Cool-tinted feature panel for rhythm variation, pairs with violet |
| 4 | Mint Whisper | `#ebfef6` | Metric and status highlight surface, pairs with green |

## Elevation

- **Elevated Card:** `0px 16px 32px 0px rgba(0, 0, 0, 0.5)`
- **Primary CTA Button:** `0px 4px 8px 0px rgba(0, 0, 0, 0.1)`
- **Floating Image:** `0px 16px 32px 0px rgba(0, 0, 0, 0.1)`

## Imagery

Product-led with stylized card photography and abstract topographic illustrations. Hero features a darkened perspective of physical credit cards arranged in a diagonal cascade, lit from one side to create deep shadows and metallic-chip highlights. Throughout the page, concentric-arc line patterns in warm browns and violet act as recurring decorative texture — they read as radar sweeps or contour lines, evoking precision and infrastructure. Brand logos in the social-proof strip are rendered monochrome. Product mockups (API status lists, bar charts, transaction feeds) are shown as embedded UI cards with realistic micro-interactions. No lifestyle photography, no human subjects — the visual language is entirely object-focused, treating cards, data, and abstract geometry as the hero subjects.

## Layout

Full-width sections stack vertically with no side margins bleeding off-canvas, but inner content is centered within a 1200px max-width container. The hero breaks the pattern with a full-bleed black vault that extends edge-to-edge with only the content centered. Below the hero, sections alternate between warm cream (#f6f3ee) and tinted surfaces (lavender, mint) to create visual rhythm without dark/light contrast. Feature blocks use a 2-column split (text-left, visual-right) that mirrors on alternating rows, plus a 2x2 card grid for compact trust signals and compliance highlights. Navigation is a minimal top bar — wordmark left, three text links centered, contact + dashboard right — no sticky behavior visible. Section gaps are 80px; card internal padding is 40px; element gaps follow the 8px scale (8, 16, 24, 40). Footer is a single centered CTA band.

## Agent Prompt Guide

## Quick Color Reference
- text: #000000 (primary), #888888 (secondary)
- background: #ffffff (page), #f6f3ee (warm card), #f6f1fe (lavender panel), #ebfef6 (mint panel), #000000 (hero vault)
- border: #000000 (structural), #888888 (muted), #5c2999 (decorative accent)
- accent: #5c2999 (violet), #00cc88 (green status), #aa8855 (warm illustration)
- primary action: #ff6600 (filled action)

## Example Component Prompts
1. **Hero Vault**: Black (#000000) full-bleed background. Headline 'Rock solid issuing for breakthrough card products' at 64px Monument Grotesk weight 500, white, line-height 1.0, letter-spacing -1.28px. Subtext at 20px weight 400, white at 70% opacity. Two buttons side by side with 16px gap: ghost 'Explore Sandbox' (transparent, 1px #000000 border, 8px radius, 10px/16px padding) and filled 'Contact us' (#ff6600, white text, 24px radius, 12px/38px padding). Concentric-arc decoration in #aa8855 at 30% opacity bleeding from bottom-right.

2. **Warm Feature Card**: #f6f3ee surface, 24px radius, 40px padding. Heading 'Secure and compliant at scale' at 24px weight 500, #000000, letter-spacing -0.48px. Body 'SOC 1 Type 1, SOC 2 Type 2, PCI DSS, and ISO 27001' at 16px weight 400, #000000. Decorative violet concentric-arc pattern positioned bottom-right edge at 20% opacity.

3. **Availability Status Row**: White card surface, 24px radius, 24px padding. Each row: label text at 16px weight 400 #000000 left-aligned, status group right-aligned containing 8px filled #00cc88 circle and 'Available' text at 14px weight 400. Rows separated by 1px #e5e5e5 hairlines with 12px vertical padding each.

4. **Brand Logo Strip**: Warm cream (#f6f3ee) full-width band, 80px vertical padding. Centered horizontal row of 6-8 monochrome wordmarks in #000000 at consistent ~100px width, 64px horizontal gap between logos. Section heading '100+ high growth brands, billions in volume' at 36px weight 500 centered above the row.

5. Create a Primary Action Button: #ff6600 background, #000000 text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.

## Similar Brands

- **Plaid** — Same developer-trust fintech language: clean cream surfaces, single grotesque typeface, and a single vivid accent (orange for Plaid, orange for Lithic) reserved for primary CTAs
- **Stripe** — Shared restrained palette with one bright CTA color, generous spacing, and the same editorial card-grid rhythm for trust signals and feature highlights
- **Mercury** — Both target financial-infrastructure buyers with warm, confident surfaces and a single weight-500 grotesque carrying the entire typographic hierarchy
- **Modern Treasury** — Same developer-fintech positioning with cream/white surfaces, tight tracking on display headlines, and a single saturated color for conversion actions

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-ember-orange: #ff6600;
  --color-architect-violet: #5c2999;
  --color-lichen-green: #00cc88;
  --color-sandstone: #aa8855;
  --color-bark-brown: #665233;
  --color-honey-bronze: #eec07a;
  --color-obsidian: #000000;
  --color-paper-white: #ffffff;
  --color-warm-cream: #f6f3ee;
  --color-lavender-mist: #f6f1fe;
  --color-mint-whisper: #ebfef6;
  --color-ash-gray: #888888;
  --color-smoke: #e5e5e5;

  /* Typography — Font Families */
  --font-abc-monument-grotesk: 'ABC Monument Grotesk', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.52;
  --tracking-caption: -0.28px;
  --text-body-sm: 16px;
  --leading-body-sm: 1.5;
  --tracking-body-sm: -0.32px;
  --text-subheading: 20px;
  --leading-subheading: 1.4;
  --tracking-subheading: -0.4px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -0.48px;
  --text-heading: 36px;
  --leading-heading: 1.2;
  --tracking-heading: -0.72px;
  --text-display: 64px;
  --leading-display: 1;
  --tracking-display: -1.28px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;

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
  --spacing-120: 120px;
  --spacing-160: 160px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 40px;
  --element-gap: 24px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-2xl: 21.6px;
  --radius-3xl: 24px;
  --radius-full: 800px;

  /* Named Radii */
  --radius-cards: 24px;
  --radius-icons: 800px;
  --radius-images: 21.6px;
  --radius-buttons: 24px;
  --radius-smallelements: 8px;

  /* Shadows */
  --shadow-xl: rgba(0, 0, 0, 0.5) 0px 16px 32px 0px;
  --shadow-sm: rgba(0, 0, 0, 0.1) 0px 4px 8px 0px;
  --shadow-xl-2: rgba(0, 0, 0, 0.1) 0px 16px 32px 0px;

  /* Surfaces */
  --surface-obsidian-vault: #000000;
  --surface-paper-white: #ffffff;
  --surface-warm-cream: #f6f3ee;
  --surface-lavender-mist: #f6f1fe;
  --surface-mint-whisper: #ebfef6;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-ember-orange: #ff6600;
  --color-architect-violet: #5c2999;
  --color-lichen-green: #00cc88;
  --color-sandstone: #aa8855;
  --color-bark-brown: #665233;
  --color-honey-bronze: #eec07a;
  --color-obsidian: #000000;
  --color-paper-white: #ffffff;
  --color-warm-cream: #f6f3ee;
  --color-lavender-mist: #f6f1fe;
  --color-mint-whisper: #ebfef6;
  --color-ash-gray: #888888;
  --color-smoke: #e5e5e5;

  /* Typography */
  --font-abc-monument-grotesk: 'ABC Monument Grotesk', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.52;
  --tracking-caption: -0.28px;
  --text-body-sm: 16px;
  --leading-body-sm: 1.5;
  --tracking-body-sm: -0.32px;
  --text-subheading: 20px;
  --leading-subheading: 1.4;
  --tracking-subheading: -0.4px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -0.48px;
  --text-heading: 36px;
  --leading-heading: 1.2;
  --tracking-heading: -0.72px;
  --text-display: 64px;
  --leading-display: 1;
  --tracking-display: -1.28px;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-120: 120px;
  --spacing-160: 160px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-2xl: 21.6px;
  --radius-3xl: 24px;
  --radius-full: 800px;

  /* Shadows */
  --shadow-xl: rgba(0, 0, 0, 0.5) 0px 16px 32px 0px;
  --shadow-sm: rgba(0, 0, 0, 0.1) 0px 4px 8px 0px;
  --shadow-xl-2: rgba(0, 0, 0, 0.1) 0px 16px 32px 0px;
}
```
