# Dovetail — Style Reference
> blueprint control room at midnight.

**Theme:** dark

Dovetail's design language is a dark command center: near-black canvas, subtle grid wireframes, and cool gray type that recedes so charts and data can lead. A single vivid cornflower blue (#6798ff) acts as the system's only chromatic accent — it appears on the announcement bar, feature icons, and active highlights, never as decorative noise. Typography is Inter at every layer with progressively tighter tracking as sizes grow (from -0.012em at 14px to -0.036em at 64px), giving headlines a compressed, engineered quality rather than a marketing gloss. Components are weightless: 8px radii, hairline borders at #1e1e1 or #313131, zero shadows, and flat surfaces that stack through tone rather than elevation. The overall rhythm is compact, technical, and instrument-like — a tool room, not a pitch deck.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Blue Cornflower | `#6798ff` | `--color-blue-cornflower` | Accent for announcement bar, feature icons, active states, and data highlight strokes |
| Page Ink | `#0a0a0a` | `--color-page-ink` | Primary page background — the dark canvas that everything sits on |
| Card Carbon | `#1e1e1e` | `--color-card-carbon` | Card surfaces, button backgrounds, and key borders that delineate panels |
| Deep Coal | `#141414` | `--color-deep-coal` | Alternate surface level for nested cards and section backgrounds |
| Onyx | `#000000` | `--color-onyx` | Pure black used in SVG illustration fills and contrast anchors |
| Steel Border | `#313131` | `--color-steel-border` | Hairline borders on image frames and subtle dividers |
| Graphite | `#454545` | `--color-graphite` | Mid-tone borders on outline buttons and input frames |
| Fog | `#7c7c7c` | `--color-fog` | Disabled or de-emphasized button text |
| Ash | `#a7a7a7` | `--color-ash` | Secondary body text, borders on muted elements, icon strokes |
| Snow | `#ffffff` | `--color-snow` | Primary text, primary filled button background, icon fills, nav links |

## Tokens — Typography

### Inter — All UI and editorial text. Weight 400 for body and meta, 500 for nav and button labels, 600 for headings. Display sizes (56–64px) carry heavy negative tracking to feel engineered and compact. · `--font-inter`
- **Substitute:** Inter is freely available on Google Fonts
- **Weights:** 400, 500, 600
- **Sizes:** 14, 16, 20, 24, 40, 56, 64
- **Line height:** 1.13–1.57
- **Letter spacing:** -0.17px at 14px, -0.19px at 16px, -0.50px at 24px, -0.84px at 40px, -2.02px at 56px, -2.30px at 64px
- **OpenType features:** `"liga" on`
- **Role:** All UI and editorial text. Weight 400 for body and meta, 500 for nav and button labels, 600 for headings. Display sizes (56–64px) carry heavy negative tracking to feel engineered and compact.

### JetBrains Mono — Monospaced labels for section eyebrows (e.g. "HOW IT WORKS"), BETA tags, and small data codes. Wide positive tracking (0.071–0.083em) gives these labels a technical, instrument-panel feel. · `--font-jetbrains-mono`
- **Substitute:** JetBrains Mono via Google Fonts
- **Weights:** 400
- **Sizes:** 12, 14
- **Line height:** 1.00, 1.40
- **Letter spacing:** 1.0px at 14px, 0.85px at 12px
- **OpenType features:** `"liga" on`
- **Role:** Monospaced labels for section eyebrows (e.g. "HOW IT WORKS"), BETA tags, and small data codes. Wide positive tracking (0.071–0.083em) gives these labels a technical, instrument-panel feel.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.4 | 0.85px | `--text-caption` |
| body-sm | 14px | 1.5 | -0.17px | `--text-body-sm` |
| body | 16px | 1.5 | -0.19px | `--text-body` |
| subheading | 20px | 1.4 | -0.42px | `--text-subheading` |
| heading-sm | 24px | 1.33 | -0.5px | `--text-heading-sm` |
| heading | 40px | 1.2 | -0.84px | `--text-heading` |
| heading-lg | 56px | 1.14 | -2.02px | `--text-heading-lg` |
| display | 64px | 1.13 | -2.3px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 8px

**Density:** compact

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 8 | 8px | `--spacing-8` |
| 16 | 16px | `--spacing-16` |
| 24 | 24px | `--spacing-24` |
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 64 | 64px | `--spacing-64` |
| 96 | 96px | `--spacing-96` |
| 200 | 200px | `--spacing-200` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 4px |
| cards | 8px |
| inputs | 8px |
| buttons | 8px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 64-96px
- **Card padding:** 24-32px
- **Element gap:** 8-16px

## Components

### White Filled Button (Primary)
**Role:** Primary action — the most prominent CTA on a page

White background (#ffffff), near-black text (#0a0a0a), 8px radius, 16px horizontal / 10px vertical padding. Inter 500 at 14px. Used for "Contact sales" and "Try Dovetail free" in high-priority positions. No border, no shadow.

### Dark Outlined Button (Secondary)
**Role:** Secondary action paired beside a primary

Transparent or #0a0a0a background, 1px border at #454545, white text (#ffffff), 8px radius, 16px / 10px padding. Inter 500 at 14px. The lower-emphasis counterpart to the white filled button.

### Ghost Nav Button
**Role:** Top-bar utility actions like "Log in"

No background, no border, white text at 14px Inter 500. Sits inline with nav items. Padding matches nav height rhythm.

### Stat Card
**Role:** Highlights a single metric in the "How it works" section

#1e1e1 background, 1px border at #1e1e1 (or transparent — separation comes from surface tone), 8px radius, 24px padding. A small #6798ff icon sits above a 40px Inter 600 metric value in white, followed by a 14px label in #a7a7a7. No shadow, no hover lift.

### Section Eyebrow Label
**Role:** Small uppercase label above section headlines (e.g. "HOW IT WORKS")

JetBrains Mono 400 at 12px, white or #a7a7a7 text, letter-spacing 0.85px. No background, sits directly above headline with 16-24px gap.

### Product Preview Card
**Role:** Inset mockup of the Dovetail dashboard inside the hero

#1e1e1 surface with 8px radius, contains a real product UI rendering with charts, tables, and colored data bars. Acts as a flat, borderless visual element — no shadow or frame chrome.

### BETA Tag
**Role:** Marks features in early release (e.g. "AI Docs BETA")

Inline text tag, no background, #a7a7a7 text at 12px Inter 400, with "BETA" uppercase in JetBrains Mono 400 at 12px. Sits beside the feature name with 8px gap.

### Logo Strip Item
**Role:** Customer logo in the trust bar

Greyscale SVG, roughly 80px wide, 8-16px gap between items. Logos sit on transparent background at ~60% opacity to stay subordinate to the page.

### Footer Link Column
**Role:** Site map columns in the footer

Column header in 12px Inter 500 uppercase at #a7a7a7 (letter-spacing ~0.5px). Links below in 14px Inter 400 white, 8-12px vertical gap between links. No bullet markers.

### Social Icon Button
**Role:** LinkedIn, X, Instagram, YouTube in footer

24px square, white stroke or fill, no background, no border, no hover chrome — flat icon-on-dark.

### Announcement Bar
**Role:** Top-of-page promo strip

Full-width #6798ff blue background, white text at 14px Inter 500, centered content with a small dismiss icon on the right. 8px vertical padding.

### Rating Badge
**Role:** G2 and Capterra star ratings below the logo strip

5 white stars at 12-14px, followed by "4.5/5 · 62" or similar in 12px Inter 400 #a7a7a7. Inline horizontal layout with 16px gap.

## Do's and Don'ts

### Do
- Use 8px radius for all buttons, cards, and inputs — the only deviation is 4px for small tags and inline chips.
- Set page background to #0a0a0a and reserve #1e1e1 exclusively for card and button surfaces so the surface hierarchy reads through tone alone.
- Use #6798ff only for functional accents: announcement bars, feature icons, active nav states, and data highlight strokes — never as a background fill for content blocks.
- Set display headlines at 56-64px Inter 600 with tracking between -2.0 and -2.3px so they feel engineered, not editorial.
- Reserve JetBrains Mono for eyebrows, BETA tags, and small data labels with positive 0.85-1.0px tracking — never use it for body or headings.
- Keep section gaps between 64-96px and element gaps between 8-16px to maintain the compact, technical density.
- Default to white filled buttons for primary actions and dark outlined (1px #454545) for secondary — never use the blue accent on a button background.

### Don't
- Do not introduce a second chromatic color — the system is monochrome with a single blue accent.
- Do not use shadows or elevation to separate surfaces — rely on tone shifts between #0a0a0a, #141414, and #1e1e1e.
- Do not use gradients on any surface, button, or background.
- Do not use #6798ff as a filled button background — it belongs only on icons, the announcement bar, and small accent strokes.
- Do not use 66px or pill radii on cards or buttons — the 8px corner is the system signature.
- Do not set body text below 14px or use weights lighter than 400 — the type stack is deliberately compact, not delicate.
- Do not use pure #000000 as a page background — it is reserved for SVG illustration fills; pages live on #0a0a0a or #141414.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#0a0a0a` | Page background |
| 1 | Section | `#141414` | Alternate band or inset section background |
| 2 | Card | `#1e1e1` | Card, button fill, and bordered component surface |
| 3 | Raised Edge | `#313131` | Image frames and fine separators |

## Elevation

The system deliberately avoids box-shadows entirely. Surface separation is achieved through flat tone shifts (#0a0a0a → #141414 → #1e1e1 → #313131) and 1px hairline borders at #1e1e1 or #454545. Components feel like instrument panels — flush, parallel, and dimensional only through color value, not depth.

## Imagery

Imagery is minimal and functional: greyscale customer logos in a single trust strip, one or two product-screenshot cards showing real dashboard UI (charts, tables, data bars), and sparse flat illustrations in the footer (a pixel smiley face on a #6798ff tile). No lifestyle photography, no hero video, no decorative 3D. The grid wireframe pattern overlaid on the dark background is the only repeated visual motif — it signals "blueprint" and gives the dark surface structure. Icons are small, single-color (white or #6798ff), 16-20px, stroke-based with a 1.5-2px weight, and sit inline with text rather than floating as decoration.

## Layout

Pages are max-width 1200px centered with generous side padding. The hero uses an asymmetric 50/50 split: left column carries headline, subtext, and dual CTAs; right column holds a product preview card. Section rhythm is uniform — dark background continues throughout with no alternating bands, separated only by vertical spacing. Stat highlights and feature grids use 3-column or 4-column card rows at equal widths. Navigation is a single top bar with logo, product/use-cases/resources/enterprise/customers/pricing links center-left, and Log in + Contact sales right-aligned. No sidebar, no mega-menu. Footer is a 4-column link grid plus a single illustration card on the right. The overall density is compact and consistent — every section breathes the same amount.

## Agent Prompt Guide

**Quick Color Reference**
- text: #ffffff (primary), #a7a7a7 (secondary), #7c7c7c (disabled)
- background: #0a0a0a (page), #1e1e1e (card/button)
- border: #1e1e1e (subtle), #454545 (outlined button), #313131 (image frame)
- accent: #6798ff (icons, announcement bar, active states)
- primary action: #1e1e1e (filled action)

**Example Component Prompts**
1. Create a Primary Action Button: #1e1e1e background, #ffffff text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.
2. Build a 3-column stat row: each cell is a #1e1e1e card with 8px radius and 24px padding. Inside, a #6798ff icon (16px, stroke) sits above a 40px Inter 600 white metric value, followed by a 14px Inter 400 #a7a7a7 label.
3. Build a top navigation bar: #0a0a0a background, logo on the left, nav links in 14px Inter 500 #ffffff, spaced 24px apart, centered. On the right, a ghost "Log in" text link and a white filled "Contact sales" button (8px radius, 16px/10px padding). Height 64px.
4. Build a section with a JetBrains Mono eyebrow: 12px uppercase label in #a7a7a7 with 0.85px letter-spacing, 24px gap below to a 40px Inter 600 #ffffff headline with -0.84px tracking.
5. Build a footer link column: 12px Inter 500 uppercase #a7a7a7 header with 0.5px tracking, followed by 14px Inter 400 white links stacked at 12px vertical gap. No bullets, no separators.

## Grid Wireframe Motif

A subtle 1px grid pattern at #1e1e1e sits behind the dark canvas across hero and feature sections. The grid is square (roughly 40-60px cells), very low contrast, and never carries content — it exists to give the otherwise flat dark surface a sense of structure and engineering intent. When recreating this system, overlay a 1px #1e1e1e linear-gradient or repeating-linear-gradient grid on the page background; do not attempt to recreate it with borders on individual elements.

## Similar Brands

- **Linear** — Same dark canvas, single vivid blue accent, Inter typeface, 8px radii, and zero-shadow flat surfaces with tone-based hierarchy.
- **Vercel** — Dark-first instrument-panel aesthetic with tight Inter tracking on display sizes, monochrome palette, and minimal blue functional accents.
- **Cursor** — Compact dark UI with a single cool accent color, compact density, and a product-preview-led hero layout.
- **Retool** — Developer-tool dark theme with neutral primary buttons, hairline borders, and product UI inlined directly into marketing sections.

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-blue-cornflower: #6798ff;
  --color-page-ink: #0a0a0a;
  --color-card-carbon: #1e1e1e;
  --color-deep-coal: #141414;
  --color-onyx: #000000;
  --color-steel-border: #313131;
  --color-graphite: #454545;
  --color-fog: #7c7c7c;
  --color-ash: #a7a7a7;
  --color-snow: #ffffff;

  /* Typography — Font Families */
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-jetbrains-mono: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.4;
  --tracking-caption: 0.85px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --tracking-body-sm: -0.17px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.19px;
  --text-subheading: 20px;
  --leading-subheading: 1.4;
  --tracking-subheading: -0.42px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.33;
  --tracking-heading-sm: -0.5px;
  --text-heading: 40px;
  --leading-heading: 1.2;
  --tracking-heading: -0.84px;
  --text-heading-lg: 56px;
  --leading-heading-lg: 1.14;
  --tracking-heading-lg: -2.02px;
  --text-display: 64px;
  --leading-display: 1.13;
  --tracking-display: -2.3px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;

  /* Spacing */
  --spacing-unit: 8px;
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-64: 64px;
  --spacing-96: 96px;
  --spacing-200: 200px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 64-96px;
  --card-padding: 24-32px;
  --element-gap: 8-16px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-full: 66px;

  /* Named Radii */
  --radius-tags: 4px;
  --radius-cards: 8px;
  --radius-inputs: 8px;
  --radius-buttons: 8px;

  /* Surfaces */
  --surface-canvas: #0a0a0a;
  --surface-section: #141414;
  --surface-card: #1e1e1;
  --surface-raised-edge: #313131;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-blue-cornflower: #6798ff;
  --color-page-ink: #0a0a0a;
  --color-card-carbon: #1e1e1e;
  --color-deep-coal: #141414;
  --color-onyx: #000000;
  --color-steel-border: #313131;
  --color-graphite: #454545;
  --color-fog: #7c7c7c;
  --color-ash: #a7a7a7;
  --color-snow: #ffffff;

  /* Typography */
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-jetbrains-mono: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.4;
  --tracking-caption: 0.85px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --tracking-body-sm: -0.17px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.19px;
  --text-subheading: 20px;
  --leading-subheading: 1.4;
  --tracking-subheading: -0.42px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.33;
  --tracking-heading-sm: -0.5px;
  --text-heading: 40px;
  --leading-heading: 1.2;
  --tracking-heading: -0.84px;
  --text-heading-lg: 56px;
  --leading-heading-lg: 1.14;
  --tracking-heading-lg: -2.02px;
  --text-display: 64px;
  --leading-display: 1.13;
  --tracking-display: -2.3px;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-64: 64px;
  --spacing-96: 96px;
  --spacing-200: 200px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-full: 66px;
}
```
