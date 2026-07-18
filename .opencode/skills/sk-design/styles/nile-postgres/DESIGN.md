# Nile Postgres — Style Reference
> infra sunset on black velvet — a quiet command center where three pastel tiles glow in the dark

**Theme:** dark

Nile operates in the visual language of an infrastructure command center: a near-black canvas (#0e0e0e) with elevated surface cards (#1c1c1c) and a trio of pastel feature blocks — cyan #6fe2ff, amber #ffba6a, and lavender #d8d3ff — that function as colored tiles floating in deep space. Typography is geometric and precise: Aeonik at weights 400/500/600/700, with display sizes stretching to 96px on tight negative tracking, giving headlines an architectural, engineered feel. A signature sunset gradient (amber → lavender → cyan) threads through the hero wordmark and likely other moments, providing the only moment of continuous color flow. Components stay flat and quiet — hairline borders (#2f3336) over heavy elevation, pill buttons (9999px), rounded 16-20px cards, and no decorative shadows. The overall atmosphere is restrained infrastructure: developer-facing, confident through restraint rather than spectacle, with chromatic accents used sparingly as functional category tags rather than decoration.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Deep Void | `#0e0e0e` | `--color-deep-void` | Page canvas, deepest surface — the black that everything floats on |
| Carbon | `#1c1c1c` | `--color-carbon` | Card surfaces, elevated panels, testimonial tiles |
| Graphite | `#2b2b2b` | `--color-graphite` | Mid-elevation surfaces, subtle layering above cards |
| Smoke | `#3f3f3f` | `--color-smoke` | Borders, dividers on elevated elements, button outlines |
| Charcoal Edge | `#2f3336` | `--color-charcoal-edge` | Hairline card borders — the quietest structural line |
| Snow | `#ffffff` | `--color-snow` | Primary text, headings, icons — the dominant foreground |
| Ash | `#d3d3d3` | `--color-ash` | Secondary text, muted labels, icon fills at rest |
| Slate Mist | `#a1a1aa` | `--color-slate-mist` | Tertiary text, helper copy, de-emphasized metadata |
| Signal Cyan | `#6fe2ff` | `--color-signal-cyan` | Blue action color for filled buttons, selected navigation states, and focused conversion moments. |
| Amber Tile | `#ffba6a` | `--color-amber-tile` | Amber feature card background, warm category accent in the trio |
| Lavender Tile | `#d8d3ff` | `--color-lavender-tile` | Lavender feature card background, cool category accent in the trio |
| Sunset Sweep | `linear-gradient(90deg, #f4c587 9%, #d6d3e9 52%, #99d2ec 94%)` | `--color-sunset-sweep` | Signature gradient — amber to lavender to cyan, used on hero wordmark highlights and atmospheric washes |

## Tokens — Typography

### Aeonik — Primary interface and display typeface — geometric, precise, used for everything from body copy to 96px hero headlines · `--font-aeonik`
- **Substitute:** Inter, Satoshi, General Sans
- **Weights:** 400, 600, 700
- **Sizes:** 12px, 14px, 15px, 16px, 18px, 20px, 24px, 32px, 40px, 42px, 48px, 64px, 96px
- **Line height:** 1.00, 1.08, 1.10, 1.18, 1.20, 1.25, 1.43, 1.50, 1.56, 1.60
- **Letter spacing:** -0.01em on display (40px+), 0.01em on small text, normal at body
- **Role:** Primary interface and display typeface — geometric, precise, used for everything from body copy to 96px hero headlines

### ui-monospace — Code snippets, technical labels, inline code — the developer voice within the geometric system · `--font-ui-monospace`
- **Substitute:** JetBrains Mono, IBM Plex Mono
- **Weights:** 400
- **Sizes:** 14px
- **Line height:** 1.14, 1.18, 1.50
- **Letter spacing:** 0.01em
- **Role:** Code snippets, technical labels, inline code — the developer voice within the geometric system

### aeonikMedium — aeonikMedium — detected in extracted data but not described by AI · `--font-aeonikmedium`
- **Weights:** 500
- **Sizes:** 16px, 20px, 24px, 96px
- **Line height:** 1, 1.2, 1.25, 1.5
- **Role:** aeonikMedium — detected in extracted data but not described by AI

### Inter — Inter — detected in extracted data but not described by AI · `--font-inter`
- **Weights:** 400
- **Sizes:** 12px
- **Line height:** 1.33
- **Role:** Inter — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.5 | 0.01px | `--text-caption` |
| body-sm | 14px | 1.43 | 0.01px | `--text-body-sm` |
| body | 16px | 1.5 | — | `--text-body` |
| subheading | 18px | 1.56 | — | `--text-subheading` |
| heading-sm | 20px | 1.25 | — | `--text-heading-sm` |
| heading-lg | 32px | 1.2 | -0.01px | `--text-heading-lg` |
| heading-xl | 40px | 1.18 | -0.4px | `--text-heading-xl` |
| heading-2xl | 48px | 1.1 | -0.48px | `--text-heading-2xl` |
| display | 64px | 1.08 | -0.64px | `--text-display` |
| display-lg | 96px | 1 | -0.96px | `--text-display-lg` |

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
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |
| 96 | 96px | `--spacing-96` |
| 112 | 112px | `--spacing-112` |
| 128 | 128px | `--spacing-128` |
| 160 | 160px | `--spacing-160` |
| 192 | 192px | `--spacing-192` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 6px |
| cards | 20px |
| pills | 9999px |
| inputs | 10px |
| buttons | 9999px |
| special | 100px |
| smallCards | 16px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80-96px
- **Card padding:** 24px
- **Element gap:** 8-12px

## Components

### Pill Primary Button
**Role:** Main call-to-action across hero and feature sections

Filled with Signal Cyan #6fe2ff, text in Deep Void #0e0e0, font-weight 500, 16px text, padding 10px 20px, border-radius 9999px (fully pill-shaped). Includes a right-arrow glyph in the same dark color. This is the only chromatic filled button in the system.

### Ghost Outline Button
**Role:** Secondary actions, nav-adjacent controls

Transparent fill, 1px border in #3f3f3f, white text at 14-16px, border-radius 9999px, padding 8px 16px. Blends into the dark canvas with just enough edge to register as interactive.

### Pill Nav Link
**Role:** Top navigation items

White text on transparent, 15-16px weight 400, no border. On hover or active: subtle white/10 background appears.

### Announcement Pill
**Role:** Compact top-of-page announcement (e.g. product launches)

Dark fill #1c1c1c, 1px border #3f3f3f, text 14px white with muted secondary, border-radius 9999px, padding 8px 16px. Includes a small arrow icon on the right.

### Testimonial Card
**Role:** Social proof in horizontal scroll layout

Background #1c1c1c, 1px border #2f3336, border-radius 20px, padding 16-20px. Contains avatar (40px circle), name in white weight 600, role/company in Ash #d3d3d3, quote body in white weight 400 at 14-15px. Includes a 'View on X' link and a close X glyph. Cards are slightly wider than tall, designed to sit in a horizontal scroll row.

### Colored Feature Tile
**Role:** Category-coded feature blocks in the feature grid

Solid pastel fill: Amber #ffba6a, Lavender #d8d3ff, or Signal Cyan #6fe2ff. Text in Deep Void #0e0e0e. Border-radius 20px, padding 24px. Contains a bold heading (18-20px weight 600), body text (15px weight 400), and a 'Learn more →' link. These are the only large chromatic surfaces in the system.

### Gradient Highlight Box
**Role:** Signature moment — the hero word treatment and section dividers

Rounded container (20-24px radius) with the sunset gradient fill (#f4c587 → #d6d3e9 → #99d2ec). May contain text clipped to the gradient or sit as a decorative wash. In the hero, it frames a single highlighted word from the headline with a dashed border outline.

### Code Block Card
**Role:** SQL/code examples in feature sections

Dark terminal-style card: background #1c1c1c, border 1px #2f3336, border-radius 16px, padding 24px. Monospace font (ui-monospace) at 14px. Uses VS Code-style syntax highlighting: #9cdcfe for keywords, #dcdcaa for functions/strings, #b5cea8 for numbers, #4fc1ff for types.

### Product Icon Tile
**Role:** Visual badge for feature sections (e.g. the chip/vector graphic)

Dark square 200x200px with rounded corners (24px), 1px border #3f3f3f, contains a centered icon or product graphic. Functions as a visual anchor beside feature copy.

### Brand Logo Mark
**Role:** Site identity — 'Nile' wordmark with N-glyph

Stylized 'N' glyph in white, followed by 'Nile' wordmark in Aeonik weight 600. Approximately 24px tall in the header. The N has a distinctive curved/ribbon-like construction.

### Info Statement Banner
**Role:** Full-width summary statement (e.g. the gradient description block)

Rounded container (20px radius) with the sunset gradient as background, large padding (40-48px), contains the brand logo + a sentence-length summary in Deep Void text. Functions as a brand-recap moment between sections.

### Icon (UI)
**Role:** Small interface icons — arrows, close, social, nav

Stroke-based or filled glyphs in white or Ash #d3d3d3 at 16-20px. Generally 1.5-2px stroke weight, geometric construction matching Aeonik's precision.

## Do's and Don'ts

### Do
- Use 9999px border-radius for all interactive elements — buttons, nav pills, announcement tags — to maintain the pill-shaped consistency across the system
- Use Signal Cyan #6fe2ff exclusively for primary actions; never substitute it for decorative or non-action purposes
- Use the three pastel feature tile colors (Amber #ffba6a, Lavender #d8d3ff, Cyan #6fe2ff) as solid card fills with Deep Void text, never as text colors or thin accents
- Apply the sunset gradient only as a deliberate signature moment — full container fills or clipped text — not as a subtle background wash
- Set body text at 16px Aeonik weight 400 in white #ffffff, with secondary text in Ash #d3d3d3 — never use gray for primary copy
- Use card padding of 24px and card border-radius of 20px as the default for all surface containers
- Maintain section gaps of 80-96px to preserve the comfortable, breathing rhythm between content blocks
- Set display headlines at 64-96px with negative letter-spacing (-0.01em) to achieve the architectural, engineered feel

### Don't
- Do not use chromatic colors (Cyan, Amber, Lavender) for body text, borders, or icons — they are exclusively surface fills for feature tiles and primary actions
- Do not add box-shadows or drop-shadows to cards or buttons — the system relies on flat surfaces and hairline borders for depth
- Do not use the gradient as a button background, icon fill, or text color outside its intended signature moments
- Do not break the pill shape — every button, tag, and announcement must use 9999px radius, never rounded rectangles
- Do not use pure black #000000 — always use Deep Void #0e0e0 for canvas and Carbon #1c1c1c for cards
- Do not introduce new accent colors beyond the trio — the system is deliberately constrained to cyan/amber/lavender plus neutrals
- Do not set body text below 14px or use weights other than 400 for paragraph copy — Aeonik's geometric clarity depends on generous sizing and regular weight
- Do not use spacing values outside the 4/8/12/16/24/32/48/80/96 scale — the 8px base unit must govern all rhythm

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Deep Void | `#0e0e0` | Page canvas, the base of the stack |
| 1 | Carbon | `#1c1c1c` | Card surfaces, testimonial tiles, elevated panels |
| 2 | Graphite | `#2b2b2b` | Mid-elevation backgrounds, nested panels |
| 3 | Smoke | `#3f3f3f` | High-elevation surfaces, modal backgrounds |

## Elevation

Nile intentionally avoids shadows. Depth is achieved through a three-step surface stack (Deep Void #0e0e0 → Carbon #1c1c1c → Graphite #2b2b2b) and hairline borders in #2f3336. Elevation is flat and architectural, not skeuomorphic — cards sit on the canvas like tiles, not floating panels.

## Imagery

Visual language is minimal and product-focused: no lifestyle photography, no abstract decorative graphics. Imagery consists of (1) a single product graphic — a dark square tile with a circuit/vector icon (the Nile N-glyph on a dotted grid) — used as a visual anchor in feature sections, and (2) code screenshots styled as dark terminal cards with VS Code syntax highlighting. The pastel feature tiles themselves act as visual elements, breaking up the dark canvas with blocks of color. Icons are geometric, stroke-based, and white or ash-gray. The overall feel is engineering documentation meets product page: everything serves to explain a technical capability.

## Layout

Max-width ~1200px centered content with full-bleed dark canvas. The hero is a left-aligned text stack: announcement pill, then a 64-96px headline with one word highlighted by a dashed-border gradient box, followed by a one-sentence subhead and a cyan pill CTA. The page flows in vertical sections with 80-96px gaps. Below the hero: a 'What People Are Saying' section with horizontally scrolling testimonial cards. Then a full-width gradient statement banner with logo + summary. Then feature sections in a 2-column layout (left: text + colored feature tiles stacked, right: code screenshot or product graphic). Navigation is a top bar with centered nav links, brand left, and a ghost outline button + cyan pill CTA on the right. The grid is generous and breathing — no dense information layouts.

## Agent Prompt Guide

**Quick Color Reference**
- Text primary: #ffffff
- Text secondary: #d3d3d3
- Text muted: #a1a1aa
- Background canvas: #0e0e0e
- Card surface: #1c1c1c
- Border hairline: #2f3336
- Border emphasis: #3f3f3f
- primary action: #6fe2ff (filled action)
- Feature tile warm: #ffba6a
- Feature tile cool: #d8d3ff
- Feature tile go: #6fe2ff
- Signature gradient: linear-gradient(90deg, #f4c587, #d6d3e9, #99d2ec)

**Example Component Prompts**

1. **Pill Primary Button**: "Create a pill-shaped button: fill #6fe2ff, text #0e0e0e in Aeonik weight 500 at 16px, padding 10px 20px, border-radius 9999px, with a right-arrow glyph in #0e0e0e."

2. **Colored Feature Tile**: "Build a feature card: solid fill #ffba6a (or #d8d3ff / #6fe2ff), border-radius 20px, padding 24px, heading in Aeonik weight 600 at 20px in #0e0e0e, body text weight 400 at 15px in #0e0e0e, and a 'Learn more →' link at 14px weight 500 in #0e0e0e."

3. **Testimonial Card**: "Design a testimonial card: background #1c1c1c, 1px border #2f3336, border-radius 20px, padding 20px. Top row: 40px circular avatar, name in Aeonik weight 600 at 14px white, role in #d3d3d3 at 13px. Quote body in white weight 400 at 14px with 1.5 line-height. Bottom: 'View on X' ghost link and a close X icon."

4. **Code Block Card**: "Create a code example card: background #1c1c1c, border 1px #2f3336, border-radius 16px, padding 24px. Monospace text at 14px. Apply VS Code-style syntax: keywords in #9cdcfe, strings in #dcdcaa, numbers in #b5cea8, types in #4fc1ff, default text in #d4d4d4."

5. **Gradient Highlight Box (Hero Word)**: "Build a signature highlight container: border-radius 20px, background linear-gradient(90deg, #f4c587 9%, #d6d3e9 52%, #99d2ec 94%), 1px dashed border in white at 50% opacity, padding 4px 12px, containing a single headline word in Aeonik weight 700 at 64-96px in #0e0e0e."

## Similar Brands

- **Vercel** — Same dark-canvas + single bright accent approach, with pill-shaped CTAs and restrained geometric typography
- **Supabase** — Dark infrastructure-product aesthetic with developer-focused code screenshots and green-cyan accent palette
- **PlanetScale** — Database-infrastructure brand with deep dark surfaces, generous spacing, and a single vivid accent color for primary actions
- **Railway** — Dark devtool landing pages with horizontal-scroll social proof sections and minimal flat component design
- **Linear** — Dark UI with precise geometric typography (similar to Aeonik's style), tight letter-spacing on display sizes, and quiet color usage

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-deep-void: #0e0e0e;
  --color-carbon: #1c1c1c;
  --color-graphite: #2b2b2b;
  --color-smoke: #3f3f3f;
  --color-charcoal-edge: #2f3336;
  --color-snow: #ffffff;
  --color-ash: #d3d3d3;
  --color-slate-mist: #a1a1aa;
  --color-signal-cyan: #6fe2ff;
  --color-amber-tile: #ffba6a;
  --color-lavender-tile: #d8d3ff;
  --color-sunset-sweep: #d6d3e9;
  --gradient-sunset-sweep: linear-gradient(90deg, #f4c587 9%, #d6d3e9 52%, #99d2ec 94%);

  /* Typography — Font Families */
  --font-aeonik: 'Aeonik', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-ui-monospace: 'ui-monospace', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-aeonikmedium: 'aeonikMedium', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --tracking-caption: 0.01px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.43;
  --tracking-body-sm: 0.01px;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 18px;
  --leading-subheading: 1.56;
  --text-heading-sm: 20px;
  --leading-heading-sm: 1.25;
  --text-heading-lg: 32px;
  --leading-heading-lg: 1.2;
  --tracking-heading-lg: -0.01px;
  --text-heading-xl: 40px;
  --leading-heading-xl: 1.18;
  --tracking-heading-xl: -0.4px;
  --text-heading-2xl: 48px;
  --leading-heading-2xl: 1.1;
  --tracking-heading-2xl: -0.48px;
  --text-display: 64px;
  --leading-display: 1.08;
  --tracking-display: -0.64px;
  --text-display-lg: 96px;
  --leading-display-lg: 1;
  --tracking-display-lg: -0.96px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 8px;
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-96: 96px;
  --spacing-112: 112px;
  --spacing-128: 128px;
  --spacing-160: 160px;
  --spacing-192: 192px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80-96px;
  --card-padding: 24px;
  --element-gap: 8-12px;

  /* Border Radius */
  --radius-md: 6px;
  --radius-lg: 10px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-3xl: 24px;
  --radius-full: 100px;
  --radius-full-2: 9999px;

  /* Named Radii */
  --radius-tags: 6px;
  --radius-cards: 20px;
  --radius-pills: 9999px;
  --radius-inputs: 10px;
  --radius-buttons: 9999px;
  --radius-special: 100px;
  --radius-smallcards: 16px;

  /* Surfaces */
  --surface-deep-void: #0e0e0;
  --surface-carbon: #1c1c1c;
  --surface-graphite: #2b2b2b;
  --surface-smoke: #3f3f3f;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-deep-void: #0e0e0e;
  --color-carbon: #1c1c1c;
  --color-graphite: #2b2b2b;
  --color-smoke: #3f3f3f;
  --color-charcoal-edge: #2f3336;
  --color-snow: #ffffff;
  --color-ash: #d3d3d3;
  --color-slate-mist: #a1a1aa;
  --color-signal-cyan: #6fe2ff;
  --color-amber-tile: #ffba6a;
  --color-lavender-tile: #d8d3ff;
  --color-sunset-sweep: #d6d3e9;

  /* Typography */
  --font-aeonik: 'Aeonik', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-ui-monospace: 'ui-monospace', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-aeonikmedium: 'aeonikMedium', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --tracking-caption: 0.01px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.43;
  --tracking-body-sm: 0.01px;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 18px;
  --leading-subheading: 1.56;
  --text-heading-sm: 20px;
  --leading-heading-sm: 1.25;
  --text-heading-lg: 32px;
  --leading-heading-lg: 1.2;
  --tracking-heading-lg: -0.01px;
  --text-heading-xl: 40px;
  --leading-heading-xl: 1.18;
  --tracking-heading-xl: -0.4px;
  --text-heading-2xl: 48px;
  --leading-heading-2xl: 1.1;
  --tracking-heading-2xl: -0.48px;
  --text-display: 64px;
  --leading-display: 1.08;
  --tracking-display: -0.64px;
  --text-display-lg: 96px;
  --leading-display-lg: 1;
  --tracking-display-lg: -0.96px;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-96: 96px;
  --spacing-112: 112px;
  --spacing-128: 128px;
  --spacing-160: 160px;
  --spacing-192: 192px;

  /* Border Radius */
  --radius-md: 6px;
  --radius-lg: 10px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-3xl: 24px;
  --radius-full: 100px;
  --radius-full-2: 9999px;
}
```
