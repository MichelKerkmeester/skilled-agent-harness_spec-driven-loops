# Getanchor — Style Reference
> Warm terracotta on sun-bleached cream.

**Theme:** light

Anchor's visual system reads as a warm editorial workspace: a sun-bleached cream canvas, one quiet terracotta accent, and type that feels set rather than styled. The dominant page surface is never pure white — it sits in the #f0e9e5 to #e3d7cd warm-cream range, which makes white product cards look lifted off the page like paper on paper. Color is rationed: roughly 99% of every screen is neutral, and the single warm orange (#ee884f) only fires on the primary action, earning attention by scarcity. Components stay flat and light — pill buttons, 4px-radius cards, hairline borders, and shadows so thin they read as paper grain rather than elevation. The tone is confident and unhurried, closer to a printed quarterly than a dashboard.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Ink | `#1e1e1e` | `--color-ink` | Body text, headings, primary borders, icon strokes — the dominant neutral that carries almost all type and structural lines |
| Cream Canvas | `#e3d7cd` | `--color-cream-canvas` | Page background and deepest warm surface — the base tone of the entire site |
| Warm White | `#f0e9e5` | `--color-warm-white` | Primary card and section surface, nav background, soft fills |
| Paper White | `#f5f2f0` | `--color-paper-white` | Button hover surfaces and elevated neutral blocks, slightly cooler than Warm White |
| Pure White | `#ffffff` | `--color-pure-white` | Top-level product card surfaces and modal panels that need to float above cream |
| Sand Border | `#c9c9c7` | `--color-sand-border` | Subtle warm-gray dividers and disabled controls |
| Stone Text | `#767676` | `--color-stone-text` | Secondary and helper text, muted labels, description copy |
| Charcoal | `#000000` | `--color-charcoal` | Pure black for SVG icon fills in dark contexts only |
| Terracotta | `#ee884f` | `--color-terracotta` | Primary action button fill, the one chromatic accent — warm orange against cream creates urgency without aggression |

## Tokens — Typography

### Archivo — Single typeface system. Weight 400 carries body, captions, and descriptions; weight 600 is reserved for headings, nav items, and button labels. Archivo's geometric warmth matches the cream palette — its straight-sided 'A' and open apertures read as set type, not screen type. · `--font-archivo`
- **Substitute:** Inter, Manrope, or DM Sans
- **Weights:** 400, 600
- **Sizes:** 11px, 13px, 14px, 15px, 16px, 18px, 36px, 44px, 52px, 68px
- **Line height:** 1.20–1.50 for body, 0.80–1.10 for display
- **Letter spacing:** -0.03em on display and headings (36–68px), -0.01em on body and subheadings (13–18px), 0.06em on uppercase caption labels (11px)
- **OpenType features:** `"ss01" on`
- **Role:** Single typeface system. Weight 400 carries body, captions, and descriptions; weight 600 is reserved for headings, nav items, and button labels. Archivo's geometric warmth matches the cream palette — its straight-sided 'A' and open apertures read as set type, not screen type.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 11px | 1.4 | 0.66px | `--text-caption` |
| body | 15px | 1.5 | -0.15px | `--text-body` |
| subheading | 18px | 1.4 | -0.18px | `--text-subheading` |
| heading-sm | 36px | 1.2 | -1.08px | `--text-heading-sm` |
| heading | 44px | 1.1 | -1.32px | `--text-heading` |
| heading-lg | 52px | 1 | -1.56px | `--text-heading-lg` |
| display | 68px | 0.9 | -2.04px | `--text-display` |

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
| 52 | 52px | `--spacing-52` |
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |
| 88 | 88px | `--spacing-88` |
| 120 | 120px | `--spacing-120` |
| 128 | 128px | `--spacing-128` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 4px |
| cards | 4px |
| icons | 4800px (pill containers) |
| inputs | 4px |
| buttons | 4800px (full pill) |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| subtle | `rgba(0, 0, 0, 0.01) 0px 4px 1px 0px, rgba(0, 0, 0, 0.04) ...` | `--shadow-subtle` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80-120px
- **Card padding:** 24px
- **Element gap:** 24px

## Components

### Primary CTA Button (Terracotta Pill)
**Role:** Hero and section-level conversion — Book a demo, Get started

Fill #ee884f, text white, Archivo 600 at 14-15px, fully pill-shaped at 4800px radius, 8px 24px padding. No border, no shadow. Carries the only chromatic color in the system — by scarcity it reads as the single confident action.

### Dark CTA Button (Ink Pill)
**Role:** Inverse primary action on cream or white surfaces

Fill #1e1e1, text white, Archivo 600 at 14px, pill radius 4800px, 8px 24px padding. Used for the header "Book a demo" button. Sits one step below Terracotta in the action hierarchy.

### Ghost Nav Button
**Role:** Header navigation items — Product, Use cases, Security, About, Blog

No fill, no border. Text #1e1e1, Archivo 400 at 14px. No background change on hover; underline or chevron indicates expandable. Maximum restraint in the nav.

### Section Eyebrow Label
**Role:** Tiny uppercase label above section headlines

Archivo 600 at 11px, letter-spacing 0.06em, color #1e1e1 or #767676. Sets the editorial tone — the same scale a magazine uses for kicker copy.

### Editorial Headline
**Role:** Primary section and hero headlines

Archivo 600 at 44–68px, color #1e1e1, tight tracking at -0.03em, line-height 0.9–1.1. Sizes down to 36px for sub-section headings. The weight-600 choice against a cream background makes headlines feel printed.

### Product Card (Hero Mock)
**Role:** The floating opportunities/data card on the hero right panel

Pure white #ffffff surface, 4px radius, subtle three-layer shadow (rgba 0.01/0.04/0.06 at 1-4px offsets). Sits on a warm peach gradient panel. Internal padding 24px, table-style rows with #f5f2f0 alternating fills.

### Tabbed Feature Section
**Role:** Knowledge Management, Response Automation, Document Intelligence, Collaboration

Left sidebar lists tabs in 11px Archivo 600 uppercase with 0.06em tracking; active tab has a small terracotta dot prefix. Right panel holds a 4px-radius #ffffff card on a cream-tinted diagram background.

### AI Generation Input
**Role:** Prompt and status interface inside feature demos

Light cream #f0e9e5 container with 4px radius. Input text in Archivo 400 #1e1e1e. Right-side action button is a Pill in dark #1e1e1 fill with white text. Status pill below: small dot + 'Searching sources' in #767676.

### Status Badge (Pill)
**Role:** In-flow status indicators — Generating..., Something

Fully pill-shaped (4800px radius), small Archivo 400 at 13px, with a leading dot in the same hue. Neutral variants use #767676 text on #f0e9e5; accent variants use terracotta.

### Knowledge Hub Diagram Card
**Role:** Integration/source visual in feature sections

#f0e9e5 background, 4px radius, centered diagram. Shows source icons in 4px white pill tiles connected to a central Anchor hub tile, then output destinations. Very flat, no shadow on this card.

### Feature Sub-Item Card
**Role:** Four-up grid items below a feature card — 'Connect all your knowledge', etc.

Warm white #f0e9e5 surface, 4px radius, 24px padding, Archivo 400 at 15px title and #767676 description. No border, no shadow. Quiet by design.

### Partner Logo Bar
**Role:** Social-proof strip — Papaya Global, Coralogix, Deel, etc.

Horizontal row on cream canvas, 80-120px section gap above and below. Logos in #1e1e1, no color treatment, evenly spaced. Above-bar eyebrow: "Trusted by leading sales, solutions, and security teams" in 11px uppercase.

### Search/Text Input
**Role:** Inline search or generation field

White #ffffff background, 1px #c9c9c7 border, 4px radius, 12-16px padding. Placeholder in #767676. Optional leading icon in #1e1e1e.

## Do's and Don'ts

### Do
- Use only #ee884f for primary action fills — never introduce a second chromatic accent
- Set headlines in Archivo 600 with -0.03em tracking; do not use 400 for display sizes
- Use the warm cream surface stack (#e3d7cd → #f0e9e5 → #f5f2f0 → #ffffff) for elevation — never pure white as the page base
- Apply 4800px radius to all buttons, badges, and icon containers — pill shape is signature
- Use 4px radius for all cards, inputs, and nav containers
- Keep shadows under 4px blur with opacity ≤ 0.06 — shadows should read as paper grain, not depth
- Set eyebrows and nav labels in 11px Archivo 600 with 0.06em letter-spacing in uppercase

### Don't
- Do not add a second accent color — the entire chromatic story is one warm orange
- Do not use pure black #000000 for body text; use #1e1e1
- Do not round cards to 8px, 12px, or 16px — the 4px card + 4800px button contrast is the system
- Do not apply heavy drop shadows or colored glows; the system is nearly flat
- Do not center body copy in paragraphs — keep paragraphs left-aligned
- Do not use weight 700 or 800 — Archivo only ships 400 and 600 in this system
- Do not mix cream and pure-white backgrounds within a single section; pick one surface tone and commit

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Cream Canvas | `#e3d7cd` | Deepest page background, sets warm tone |
| 1 | Warm White | `#f0e9e5` | Default section and card surface |
| 2 | Paper White | `#f5f2f0` | Lighter neutral block, button hover |
| 3 | Pure White | `#ffffff` | Elevated product cards that need to float above the warm layers |

## Elevation

- **Product Card (Hero):** `0px 1px 1px 0px rgba(0,0,0,0.06), 0px 2px 1px 0px rgba(0,0,0,0.04), 0px 4px 1px 0px rgba(0,0,0,0.01)`
- **Navigation Bar:** `0px 1px 1px 0px rgba(0,0,0,0.06), 0px 2px 1px 0px rgba(0,0,0,0.04), 0px 4px 1px 0px rgba(0,0,0,0.01)`

## Imagery

Imagery is minimal and product-led: the hero right panel uses a warm peach-to-cream gradient as a stage for a single white product card. Subsequent sections replace photography with UI mockups — knowledge diagrams, AI generation interfaces, opportunity tables. No lifestyle photography, no stock imagery, no illustration. The product IS the hero. Partner logos in the social-proof strip appear as flat monochrome #1e1e1 marks, no color treatment, evenly spaced. Icon style throughout is a mix of minimal outlined line icons in the nav and filled brand logos in integration diagrams.

## Layout

Max-width ~1200px centered content with full-bleed cream background. Hero is a two-column split: text-left (eyebrow, headline, description, CTA) and visual-right (product card on a warm gradient panel). Below the hero, a centered partner-logo bar introduces a three-act body. The main body alternates between a two-column intro (eyebrow tabs on the left, headline + description on the right) and a single full-width media card underneath — Knowledge Management, Response Automation, etc. Section gaps are generous (80-120px), and vertical rhythm is built on a 24px base. Navigation is a flat top bar with no sticky behavior visible — simple logo left, centered nav, single dark CTA right. Content density is low and editorial, never dashboard-busy.

## Agent Prompt Guide

Quick Color Reference
• text: #1e1e1e
• background (page): #e3d7cd or #f0e9e5
• surface (card): #ffffff or #f5f2f0
• border: #c9c9c7 or #f0e9e5
• accent: #ee884f
• primary action: #ee884f (filled action)

3-5 Example Component Prompts

1. Create a hero section. Page background #f0e9e5. Eyebrow label in Archivo 600, 11px, letter-spacing 0.66px, color #1e1e1e, uppercase. Headline in Archivo 600, 68px, color #1e1e1e, letter-spacing -2.04px, line-height 0.9. Body description in Archivo 400, 16px, color #1e1e1e. primary action: #ee884f (filled action)

2. Create a tabbed feature section. Cream #f0e9e5 page background. Left sidebar: tab list in 11px Archivo 600 uppercase, letter-spacing 0.66px, color #767676, with active tab prefixed by a 6px terracotta #ee884f dot. Right column: headline in Archivo 600, 36px, color #1e1e1e, letter-spacing -1.08px; subhead in Archivo 400, 18px, color #767676. Below: a white #ffffff card with 4px radius containing a centered integration diagram (source tiles in 4px white pills, central hub tile, destination tiles).

3. Create an AI generation interface card. Card background #f0e9e5, 4px radius, 24px padding. Top: a #ffffff input row with 1px #c9c9c7 border, 4px radius, 16px padding, placeholder in #767676. Right-aligned dark pill action: #1e1e1e fill, white text, 4800px radius, Archivo 600 14px, 8px 16px padding. Below: a status row with a small terracotta dot + 'Searching sources' in Archivo 400, 13px, #767676.

4. Create a partner logo bar. Cream #e3d9cd page background. Centered eyebrow in 11px Archivo 600 uppercase, letter-spacing 0.66px, #1e1e1e. Below: a single horizontal row of 6-8 logos in monochrome #1e1e1e, evenly spaced, 80-120px section gap top and bottom. No card, no border, no shadow.

5. Create a four-up feature grid. Section background #f0e9e5. Each card: background #f0e9e5 (sits one tone lighter than the page if the page is #e3d7cd), 4px radius, 24px padding, no border, no shadow. Title in Archivo 600, 15px, #1e1e1e. Description in Archivo 400, 15px, #767676. 24px gap between cards.

## Gradient & Atmosphere

The hero right panel uses a soft warm gradient from a deeper peach through to cream — this is the only place in the system where a non-solid color appears, and it exists purely to stage the product card. Reuse the gradient for any single full-bleed media container (product mockup, feature demo) but never as a section background or button fill. Approximate value: linear-gradient(180deg, #e8a87a 0%, #f0c9a3 40%, #f0e9e5 100%).

## Similar Brands

- **Linear** — Same single-accent restraint, dark ink on warm neutral, Archivo-family geometric type, and pill-shaped primary actions
- **Notion** — Shared editorial whitespace, warm off-white canvas rather than pure white, and UI-as-hero product cards floating on the page
- **Framer** — Similar generous section gaps, monochrome base with one warm chromatic punctuation, and pill CTA on cream
- **Vercel** — Confident oversized headlines with tight tracking, quiet neutrals, and a single action color used sparingly
- **Raycast** — Geometric sans (Archivo/Inter family) with weight-600 headlines, flat surfaces, and minimal shadow language

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-ink: #1e1e1e;
  --color-cream-canvas: #e3d7cd;
  --color-warm-white: #f0e9e5;
  --color-paper-white: #f5f2f0;
  --color-pure-white: #ffffff;
  --color-sand-border: #c9c9c7;
  --color-stone-text: #767676;
  --color-charcoal: #000000;
  --color-terracotta: #ee884f;

  /* Typography — Font Families */
  --font-archivo: 'Archivo', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.4;
  --tracking-caption: 0.66px;
  --text-body: 15px;
  --leading-body: 1.5;
  --tracking-body: -0.15px;
  --text-subheading: 18px;
  --leading-subheading: 1.4;
  --tracking-subheading: -0.18px;
  --text-heading-sm: 36px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -1.08px;
  --text-heading: 44px;
  --leading-heading: 1.1;
  --tracking-heading: -1.32px;
  --text-heading-lg: 52px;
  --leading-heading-lg: 1;
  --tracking-heading-lg: -1.56px;
  --text-display: 68px;
  --leading-display: 0.9;
  --tracking-display: -2.04px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-semibold: 600;

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
  --spacing-52: 52px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-88: 88px;
  --spacing-120: 120px;
  --spacing-128: 128px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80-120px;
  --card-padding: 24px;
  --element-gap: 24px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-full: 4800px;

  /* Named Radii */
  --radius-nav: 4px;
  --radius-cards: 4px;
  --radius-icons: 4800px (pill containers);
  --radius-inputs: 4px;
  --radius-buttons: 4800px (full pill);

  /* Shadows */
  --shadow-subtle: rgba(0, 0, 0, 0.01) 0px 4px 1px 0px, rgba(0, 0, 0, 0.04) 0px 2px 1px 0px, rgba(0, 0, 0, 0.06) 0px 1px 1px 0px;

  /* Surfaces */
  --surface-cream-canvas: #e3d7cd;
  --surface-warm-white: #f0e9e5;
  --surface-paper-white: #f5f2f0;
  --surface-pure-white: #ffffff;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-ink: #1e1e1e;
  --color-cream-canvas: #e3d7cd;
  --color-warm-white: #f0e9e5;
  --color-paper-white: #f5f2f0;
  --color-pure-white: #ffffff;
  --color-sand-border: #c9c9c7;
  --color-stone-text: #767676;
  --color-charcoal: #000000;
  --color-terracotta: #ee884f;

  /* Typography */
  --font-archivo: 'Archivo', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.4;
  --tracking-caption: 0.66px;
  --text-body: 15px;
  --leading-body: 1.5;
  --tracking-body: -0.15px;
  --text-subheading: 18px;
  --leading-subheading: 1.4;
  --tracking-subheading: -0.18px;
  --text-heading-sm: 36px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -1.08px;
  --text-heading: 44px;
  --leading-heading: 1.1;
  --tracking-heading: -1.32px;
  --text-heading-lg: 52px;
  --leading-heading-lg: 1;
  --tracking-heading-lg: -1.56px;
  --text-display: 68px;
  --leading-display: 0.9;
  --tracking-display: -2.04px;

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
  --spacing-52: 52px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-88: 88px;
  --spacing-120: 120px;
  --spacing-128: 128px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-full: 4800px;

  /* Shadows */
  --shadow-subtle: rgba(0, 0, 0, 0.01) 0px 4px 1px 0px, rgba(0, 0, 0, 0.04) 0px 2px 1px 0px, rgba(0, 0, 0, 0.06) 0px 1px 1px 0px;
}
```
