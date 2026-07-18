# Flatfile — Style Reference
> Quiet data journal on warm parchment

**Theme:** light

Flatfile presents a quiet, editorial design system on warm parchment — the entire canvas carries a faint cream-green wash rather than stark white, making data tooling feel like reading a printed report. The primary chromatic is a near-black midnight violet (#090b2b) that carries all headings, brand marks, and emphasis, while interactions are anchored by a single near-black pill button (#151515) and a single warm sage secondary button (#e5ebd3). Structure is built almost entirely from hairline #e5e7eb rules — there is barely a shadow in the system, and depth is achieved through surface shifts between #f8f8f8 card layers and the #e5ebd3 hero wash rather than elevation. Typography leans editorial: a geometric humanist sans (Flatfile Diatype) does all UI work, while Source Serif 4 enters exclusively for customer quotes, giving testimonials a printed-publication feel that contrasts with the data-product UI.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Midnight Ink | `#090b2b` | `--color-midnight-ink` | Primary brand color for headings, logo, emphasized text, nav labels, and icon strokes — a near-black with a faint violet cast that reads as ink rather than pure black against the cream canvas |
| Obsidian | `#151515` | `--color-obsidian` | Dark elevated surface for cards, headers, and contained panels. Do not promote it to the primary CTA color |
| Graphite | `#1b1b1e` | `--color-graphite` | Primary body and heading text, dark card fills, and icon fills — the workhorse near-black with the faintest cool cast |
| Charcoal | `#262626` | `--color-charcoal` | Secondary dark surfaces and muted borders for inverted panels |
| Steel | `#808080` | `--color-steel` | Mid-gray for supporting UI marks, icon fills, and medium borders |
| Silver | `#aaaaaa` | `--color-silver` | Lighter mid-gray for tertiary text, placeholder copy, and decorative fills |
| Fog | `#d7d7d7` | `--color-fog` | Subtle border tone for ghost controls and quiet dividers |
| Mist | `#e5e7eb` | `--color-mist` | The system's structural hairline — dominant border, divider, and table-rule color across every layout context |
| Parchment | `#e5ebd3` | `--color-parchment` | Warm sage-cream wash used as the hero background and as the secondary button fill — gives the page its printed-paper atmosphere |
| Linen | `#f8f8f8` | `--color-linen` | Card and elevated surface background — one step off the page to create depth without shadows |
| Paper | `#ffffff` | `--color-paper` | Pure white reserved for inverted buttons, tag chips, and high-contrast list items where Mist would be too muted |
| Slate Link | `#8c8c8c` | `--color-slate-link` | Default link and breadcrumb text color, distinct from body text gray |

## Tokens — Typography

### FlatfileDiatypeVariable — FlatfileDiatypeVariable — detected in extracted data but not described by AI · `--font-flatfilediatypevariable`
- **Weights:** 400, 500
- **Sizes:** 16px
- **Line height:** 1.5
- **Role:** FlatfileDiatypeVariable — detected in extracted data but not described by AI

### Flatfile Diatype (Variable) — Primary UI and body sans — nav links, buttons, body copy, small labels, and card content. The variable axis lets the system shift between neutral body weight and slightly heavier button weight without changing family. · `--font-flatfile-diatype-variable`
- **Substitute:** Inter or Söhne
- **Weights:** 400-500
- **Sizes:** 12px, 14px, 16px, 22px, 38px, 60px
- **Line height:** 1.18-1.50
- **Letter spacing:** -0.0160em to -0.0230em at display sizes; normal at body
- **Role:** Primary UI and body sans — nav links, buttons, body copy, small labels, and card content. The variable axis lets the system shift between neutral body weight and slightly heavier button weight without changing family.

### Flatfile Diatype (Static) — Display and section heading sizes. Uses tighter tracking as size grows — the 60px display sits at -0.0320em, pulling letters into a compact editorial block. · `--font-flatfile-diatype-static`
- **Substitute:** Inter Display or Söhne Breit
- **Weights:** 400
- **Sizes:** 12px, 14px, 16px, 22px, 38px, 60px
- **Line height:** 1.00-1.18
- **Letter spacing:** -0.0320em at 60px, -0.0300em at 38px
- **Role:** Display and section heading sizes. Uses tighter tracking as size grows — the 60px display sits at -0.0320em, pulling letters into a compact editorial block.

### Source Serif 4 — Reserved exclusively for customer-quote hero text in testimonial cards. The serif italic-leaning humanist voice creates a print-publication contrast against the otherwise sans-only system. · `--font-source-serif-4`
- **Substitute:** Source Serif 4 or Tiempos Text
- **Weights:** 400
- **Sizes:** 38px
- **Line height:** 1.00
- **Letter spacing:** -0.0320em
- **Role:** Reserved exclusively for customer-quote hero text in testimonial cards. The serif italic-leaning humanist voice creates a print-publication contrast against the otherwise sans-only system.

### Sharp Grotesk — Secondary display face for product-feature subheadings where a more condensed, technical voice is needed — used sparingly to break up the Diatype rhythm. · `--font-sharp-grotesk`
- **Substitute:** Space Grotesk or GT America
- **Weights:** 500
- **Sizes:** 26px
- **Line height:** 1.42
- **Letter spacing:** -0.0100em
- **Role:** Secondary display face for product-feature subheadings where a more condensed, technical voice is needed — used sparingly to break up the Diatype rhythm.

### Booton — Booton — detected in extracted data but not described by AI · `--font-booton`
- **Weights:** 469
- **Sizes:** 16px
- **Line height:** 1.5
- **Letter spacing:** -0.005
- **Role:** Booton — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.42 | -0.144px | `--text-caption` |
| body-sm | 14px | 1.43 | -0.224px | `--text-body-sm` |
| body | 16px | 1.5 | -0.08px | `--text-body` |
| subheading | 22px | 1.42 | -0.352px | `--text-subheading` |
| heading-sm | 26px | 1.42 | -0.26px | `--text-heading-sm` |
| heading | 38px | 1.18 | -1.14px | `--text-heading` |
| display | 60px | 1 | -1.92px | `--text-display` |

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
| 64 | 64px | `--spacing-64` |
| 88 | 88px | `--spacing-88` |
| 112 | 112px | `--spacing-112` |
| 120 | 120px | `--spacing-120` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 99px |
| tags | 8px |
| cards | 12px |
| buttons | 99px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 64-88px
- **Card padding:** 24-32px
- **Element gap:** 16px

## Components

### Primary CTA Pill (Book a demo)
**Role:** Main conversion action

Filled near-black pill, 99px radius. Fill #151515, text #ffffff, Flatfile Diatype 16px weight 500, padding 12px 24px. Sits on the cream hero and on white sections with equal contrast.

### Secondary CTA Pill (Check out Obvious)
**Role:** Soft secondary action

Filled Parchment (#e5ebd3) pill, 99px radius. Text in Midnight Ink (#090b2b) weight 500, 16px. Padding 12px 24px. Only used in the hero zone where the warm wash supports it.

### Ghost Nav Link
**Role:** Top-bar navigation item

No background, no border. Text in Graphite (#1b1b1e) at 16px weight 400, padding 8px 12px. Hover shifts to Midnight Ink (#090b2b).

### Floating File Card
**Role:** Hero product showcase card

White surface (#ffffff), 12px radius, thin #e5e7eb border, subtle drop shadow. Contains a small chromatic icon, file title (Flatfile Diatype 14-16px weight 500 #1b1b1e), and file extension tag (.xlsx, .ndtx, .json) in lighter weight.

### Sticky Top Nav Bar
**Role:** Global navigation

Floating white bar with 99px radius, centered on the page with margin. Contains logo, nav links, divider, Log in text link, and the dark CTA pill. Thin #e5e7eb border.

### Testimonial Card
**Role:** Customer quote block

Linen (#f8f8f8) surface, 12px radius, #e5e7eb border. Top row: author name (Graphite 16px) + role + customer logo row. Center: Source Serif 4 38px quote text. Bottom: metric stats (25% / 20% decrease) in Graphite with caption labels in Silver.

### Carousel Arrow Button
**Role:** Testimonial pagination

40px circle, Mist (#e5e7eb) border, no fill. Diatype 16px arrow glyph in Graphite. Sits inline-right of the metric row.

### Step Tab Bar (Extract / Prepare / Map / Build)
**Role:** Process-step indicator

Dark Obsidian (#151515) pill container, 99px radius, padding 8px. Five step labels in white at 14-16px weight 400, separated by hairline #262626 dividers inside the pill. The active step could be highlighted with weight 500.

### Gradient Hero Band
**Role:** Full-bleed atmospheric divider

Edge-to-edge gradient transitioning from a dusty teal-green on the left through warm amber-orange on the right. No text overlay — purely atmospheric, used to break up long scroll runs.

### Section Heading Block
**Role:** Page-section opener

Centered, generous 88px top padding. H1 in Diatype 60px weight 400 with -1.92px tracking in Midnight Ink, optional subtext in Slate Link gray at 18px weight 400, optional centered dark CTA below.

### Link List Item
**Role:** Footer or nav text link

Flat text, no underline, Slate Link (#8c8c8c) at 14-16px. Hover shifts to Midnight Ink.

### File Extension Tag
**Role:** Format indicator chip

Small text tag (.xlsx, .json, .ndtx) in Silver (#aaaaaa) at 12px weight 400, set tight against the file title in the floating card.

## Do's and Don'ts

### Do
- Use #151515 filled pills at 99px radius for all primary CTAs — never a rectangular button.
- Set every display heading at 60px in Flatfile Diatype weight 400 with -1.92px tracking; never go bolder than 500 for the display voice.
- Use #e5e7eb for all structural dividers and table rules; it is the system's connective tissue.
- Reserve Source Serif 4 exclusively for the customer-quote hero text inside testimonial cards.
- Layer the canvas as Parchment (#e5ebd3) → Paper (#ffffff) → Linen (#f8f8f8) for depth instead of adding shadows.
- Use 88px section padding above every new page section to preserve the editorial breathing room.
- Center the page content at max-width 1200px; never edge-to-edge inside content zones.

### Don't
- Do not introduce a secondary chromatic brand color — Midnight Ink (#090b2b) is the only one.
- Do not use box-shadows to separate cards; shift the surface color one step instead.
- Do not set body text in anything other than Graphite (#1b1b1e) or #090b2b — no chromatic body copy.
- Do not use rectangular (non-pill) buttons; the 99px radius is a signature.
- Do not pair a chromatic icon color with chromatic background — keep the surface white and the icon the only color.
- Do not apply letter-spacing looser than -0.0050em — the system is built on tight, compact tracking at every size.
- Do not use the Parchment (#e5ebd3) wash outside the hero — it is a hero-only atmosphere, not a general surface.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Parchment Canvas | `#e5ebd3` | Hero section wash — the warm sage-cream that gives the page its editorial paper feel. |
| 1 | Paper | `#ffffff` | True-white body sections, inverted button faces, tag chips. |
| 2 | Linen | `#f8f8f8` | Card and panel surfaces that sit one layer above the page. |
| 3 | Obsidian | `#151515` | Footer band and filled CTA pill — the deepest surface in the system. |

## Elevation

- **Floating File Card (hero):** `0 8px 24px rgba(9, 11, 43, 0.08)`
- **Testimonial Card:** `0 1px 2px rgba(9, 11, 43, 0.04)`

## Imagery

The visual language is product-screenshot-led, not photography-led. Hero imagery consists of overlapping floating UI cards (file rows with colored icons) that depict the actual product in use — the product is the visual. A full-bleed atmospheric gradient band (teal-to-amber) provides the only decorative color moment and breaks the parchment monotony. Customer testimonial cards use crisp monochrome partner logos (BuildOps, Kottino, GrowthZone) as social proof. No lifestyle photography, no 3D renders, no stock illustration. Icons are flat, single-weight, and color-coded by file type (green, orange, purple, red squares). The overall effect is a printed data-tools brochure — paper, ink, and one warm gradient.

## Layout

Centered, max-width 1200px containment with generous outer margins. The hero is a full-bleed Parchment wash with a centered headline stack and floating product cards anchoring the bottom. Navigation is a floating pill-shaped white bar (not edge-to-edge), centered horizontally above the hero. Below the hero, sections alternate between pure white and a full-bleed teal-to-amber gradient band. Feature sections are centered single-column stacks, testimonial sections are single full-width cards, and process steps are presented as a dark pill tab bar centered above supporting copy. Spacing is generous — 88px between major sections, 64px between subsections, 16-24px within cards. The vertical rhythm is slow and editorial rather than dense product-grid.

## Agent Prompt Guide

Quick Color Reference:
- text: #1b1b1e
- background: #e5ebd3 (hero) / #ffffff (body)
- border: #e5e7eb
- accent: #090b2b
- primary action: no distinct CTA color

3 Example Component Prompts:

No distinct primary action color was observed; use the extracted neutral button treatments instead of inventing a filled CTA color.


3. Build a testimonial card: Linen (#f8f8f8) background, 12px radius, 1px #e5e7eb border, 32px padding. Top row: author name + role in #1b1b1e 16px on the left, customer logos aligned right. Center: quote text in Source Serif 4 38px weight 400, #1b1b1e, letter-spacing -1.14px, set as italic. Bottom: two metric stats (e.g. '25%') in #1b1b1e 22px with caption labels in #aaaaaa 12px, plus 40px circular arrow buttons with #e5e7eb border on the far right.

## Gradient Band

The only gradient in the system is a full-bleed atmospheric band used sparingly between major sections. It transitions from a dusty teal-green (~#5a7a72) on the left through warm amber-orange (~#c89148) on the right, with no text or interactive elements overlaid. Use it once per long-scroll page to break the parchment/white rhythm; never use it as a card background or hero.

## Similar Brands

- **Linear** — Same near-black pill CTAs, single dominant brand ink, and hairline-border-first depth model over heavy shadows.
- **Mercury** — Similar editorial restraint — cream-warm canvas, single chromatic brand color used as ink, sans-led type with sparing serif accents.
- **Retool** — Developer-tool tone with pill buttons, warm neutrals, and product-screenshot imagery rather than lifestyle photography.
- **Vercel** — Same near-monochrome palette with a single near-black CTA pill and hairline #e5e7eb structural rules.

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-midnight-ink: #090b2b;
  --color-obsidian: #151515;
  --color-graphite: #1b1b1e;
  --color-charcoal: #262626;
  --color-steel: #808080;
  --color-silver: #aaaaaa;
  --color-fog: #d7d7d7;
  --color-mist: #e5e7eb;
  --color-parchment: #e5ebd3;
  --color-linen: #f8f8f8;
  --color-paper: #ffffff;
  --color-slate-link: #8c8c8c;

  /* Typography — Font Families */
  --font-flatfilediatypevariable: 'FlatfileDiatypeVariable', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-flatfile-diatype-variable: 'Flatfile Diatype (Variable)', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-flatfile-diatype-static: 'Flatfile Diatype (Static)', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-source-serif-4: 'Source Serif 4', ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
  --font-sharp-grotesk: 'Sharp Grotesk', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-booton: 'Booton', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.42;
  --tracking-caption: -0.144px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.43;
  --tracking-body-sm: -0.224px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.08px;
  --text-subheading: 22px;
  --leading-subheading: 1.42;
  --tracking-subheading: -0.352px;
  --text-heading-sm: 26px;
  --leading-heading-sm: 1.42;
  --tracking-heading-sm: -0.26px;
  --text-heading: 38px;
  --leading-heading: 1.18;
  --tracking-heading: -1.14px;
  --text-display: 60px;
  --leading-display: 1;
  --tracking-display: -1.92px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-w469: 469;
  --font-weight-medium: 500;

  /* Spacing */
  --spacing-unit: 8px;
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-64: 64px;
  --spacing-88: 88px;
  --spacing-112: 112px;
  --spacing-120: 120px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 64-88px;
  --card-padding: 24-32px;
  --element-gap: 16px;

  /* Border Radius */
  --radius-xl: 12px;
  --radius-full: 99px;
  --radius-full-2: 999px;

  /* Named Radii */
  --radius-nav: 99px;
  --radius-tags: 8px;
  --radius-cards: 12px;
  --radius-buttons: 99px;

  /* Surfaces */
  --surface-parchment-canvas: #e5ebd3;
  --surface-paper: #ffffff;
  --surface-linen: #f8f8f8;
  --surface-obsidian: #151515;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-midnight-ink: #090b2b;
  --color-obsidian: #151515;
  --color-graphite: #1b1b1e;
  --color-charcoal: #262626;
  --color-steel: #808080;
  --color-silver: #aaaaaa;
  --color-fog: #d7d7d7;
  --color-mist: #e5e7eb;
  --color-parchment: #e5ebd3;
  --color-linen: #f8f8f8;
  --color-paper: #ffffff;
  --color-slate-link: #8c8c8c;

  /* Typography */
  --font-flatfilediatypevariable: 'FlatfileDiatypeVariable', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-flatfile-diatype-variable: 'Flatfile Diatype (Variable)', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-flatfile-diatype-static: 'Flatfile Diatype (Static)', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-source-serif-4: 'Source Serif 4', ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
  --font-sharp-grotesk: 'Sharp Grotesk', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-booton: 'Booton', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.42;
  --tracking-caption: -0.144px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.43;
  --tracking-body-sm: -0.224px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.08px;
  --text-subheading: 22px;
  --leading-subheading: 1.42;
  --tracking-subheading: -0.352px;
  --text-heading-sm: 26px;
  --leading-heading-sm: 1.42;
  --tracking-heading-sm: -0.26px;
  --text-heading: 38px;
  --leading-heading: 1.18;
  --tracking-heading: -1.14px;
  --text-display: 60px;
  --leading-display: 1;
  --tracking-display: -1.92px;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-64: 64px;
  --spacing-88: 88px;
  --spacing-112: 112px;
  --spacing-120: 120px;

  /* Border Radius */
  --radius-xl: 12px;
  --radius-full: 99px;
  --radius-full-2: 999px;
}
```
