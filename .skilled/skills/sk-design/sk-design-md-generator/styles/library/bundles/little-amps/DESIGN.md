# Little Amps — Style Reference
> vinyl record sleeve in afternoon sun. Cream paper, burnt-orange ink, a single dusty blue stamp, every label set in monospace — the interface behaves like a printed coffee zine: tactile, editorial, never sterile.

**Theme:** light

Little Amps is a warm analog coffee-shop world: cream-paper canvas, rich espresso-brown type, and burnt-orange accents that feel like sun-faded label ink. The interface reads like a printed zine or vinyl insert — a custom chunky display serif handles headlines while monospaced type (Necto Mono, Roboto Mono) labels everything that is structural: nav, buttons, prices, dates, callouts. Photography is documentary and tactile (hands on records, café counters, coffee cherries) and anchors every section. Color is sparse but decisive: a single vivid red-orange does the work of links and highlights, a dusty blue and marigold yellow appear as quiet secondary signals. Surfaces are flat, borders are hairline warm-taupe lines, and radius stays small (3–8px) — the aesthetic is curated and editorial, not soft or rounded.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Espresso | `#522c25` | `--color-espresso` | Primary text, icons, card borders, nav, footer, input fields — the structural dark that holds every screen together, warm rather than black to stay on-brand with roasted coffee |
| Burnt Orange | `#c03001` | `--color-burnt-orange` | Filled action buttons, active links, key highlights, badge fills — the single vivid accent that makes interactive elements feel switched on against the cream canvas |
| Amber Ink | `#c46500` | `--color-amber-ink` | Secondary accent for emphasized text, hover states, and warm callouts — a slightly darker orange that pairs with Burnt Orange for tonal depth |
| Marigold Wash | `#febf6f` | `--color-marigold-wash` | Soft highlight backgrounds, tag fills, and decorative washes — used sparingly to add warm sunlight moments inside otherwise neutral layouts |
| Dusty Blue | `#89b4ca` | `--color-dusty-blue` | Cool counter-accent for secondary buttons, link backgrounds, and color variety — the only blue in the system, it reads as a quiet companion to the warm palette |
| Cream Paper | `#fff9f2` | `--color-cream-paper` | Page canvas, card surfaces, button fills, input backgrounds — the base layer of every screen, warm off-white that replaces pure white |
| Linen Beige | `#f6ede3` | `--color-linen-beige` | Card backgrounds, section surfaces, image borders, body borders — one step deeper than canvas, creates gentle layered surfaces without elevation |
| Taupe Hairline | `#e6dad4` | `--color-taupe-hairline` | Hairline dividers, card borders, nav separators, subtle structural lines — the only border color most components need |
| Sandstone | `#cbbbb4` | `--color-sandstone` | Muted card backgrounds, soft surface fills, disabled surface states — a warm gray-taupe for low-emphasis panels |
| Coffee Dust | `#977e77` | `--color-coffee-dust` | Muted body text, helper text, low-emphasis copy — warm brown-gray that fades into the cream without disappearing |

## Tokens — Typography

### Little Amps — Custom display serif for brand wordmark, section headlines, and large editorial titles. Heavy negative tracking (-0.10em) at 41–51px creates a tight, chunky retro-poster feel. The heaviest typographic element on every page and the signature voice of the brand. · `--font-little-amps`
- **Substitute:** Recoleta, Canela, or DM Serif Display
- **Weights:** 500
- **Sizes:** 20px, 22px, 41px, 45px, 50px, 51px
- **Line height:** 0.80–1.00
- **Letter spacing:** -0.10em
- **Role:** Custom display serif for brand wordmark, section headlines, and large editorial titles. Heavy negative tracking (-0.10em) at 41–51px creates a tight, chunky retro-poster feel. The heaviest typographic element on every page and the signature voice of the brand.

### Inclusive Sans — Primary body and UI text. Used for descriptions, paragraphs, and most readable content. Consistent 0.05em positive tracking gives a slightly looser, zine-like feel. The workhorse — appears in nearly every context. · `--font-inclusive-sans`
- **Substitute:** Inter, Work Sans, or Public Sans
- **Weights:** 400
- **Sizes:** 12px, 13px, 14px, 15px, 16px
- **Line height:** 1.00–1.60
- **Letter spacing:** 0.05em
- **Role:** Primary body and UI text. Used for descriptions, paragraphs, and most readable content. Consistent 0.05em positive tracking gives a slightly looser, zine-like feel. The workhorse — appears in nearly every context.

### Necto Mono — Labels, buttons, navigation, dates, prices, and all structural metadata. Tighter line-heights (0.80–1.20) and monospaced forms make it feel like stamped or typewriter-set type. 0.05em tracking is the system-wide small-caps standard. · `--font-necto-mono`
- **Substitute:** JetBrains Mono, IBM Plex Mono, or Space Mono
- **Weights:** 400, 500
- **Sizes:** 10px, 12px, 13px, 14px, 16px
- **Line height:** 0.80–1.20
- **Letter spacing:** 0.05em
- **Role:** Labels, buttons, navigation, dates, prices, and all structural metadata. Tighter line-heights (0.80–1.20) and monospaced forms make it feel like stamped or typewriter-set type. 0.05em tracking is the system-wide small-caps standard.

### Roboto Mono — Secondary monospaced text for code-like or technical labels, supplementing Necto Mono in body and data contexts. · `--font-roboto-mono`
- **Substitute:** Roboto Mono, Space Mono, or IBM Plex Mono
- **Weights:** 400
- **Sizes:** 14px, 16px
- **Line height:** 1.10
- **Letter spacing:** -0.02em to 0.05em
- **Role:** Secondary monospaced text for code-like or technical labels, supplementing Necto Mono in body and data contexts.

### GTStandard-M — Rare body fallback — appears in minimal contexts. · `--font-gtstandard-m`
- **Substitute:** Söhne, Inter, or system-ui
- **Weights:** 400
- **Sizes:** 16px
- **Line height:** 1.50
- **Letter spacing:** normal
- **Role:** Rare body fallback — appears in minimal contexts.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 10px | 1.1 | 0.5px | `--text-caption` |
| body | 14px | 1.6 | 0.7px | `--text-body` |
| heading-sm | 20px | 1 | -2px | `--text-heading-sm` |
| heading | 22px | 1 | -2.2px | `--text-heading` |
| display | 50px | 0.85 | -5px | `--text-display` |

## Tokens — Spacing & Shapes

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 5 | 5px | `--spacing-5` |
| 6 | 6px | `--spacing-6` |
| 7 | 7px | `--spacing-7` |
| 8 | 8px | `--spacing-8` |
| 10 | 10px | `--spacing-10` |
| 12 | 12px | `--spacing-12` |
| 14 | 14px | `--spacing-14` |
| 15 | 15px | `--spacing-15` |
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 22 | 22px | `--spacing-22` |
| 24 | 24px | `--spacing-24` |
| 30 | 30px | `--spacing-30` |
| 36 | 36px | `--spacing-36` |
| 90 | 90px | `--spacing-90` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 8px |
| badges | 3px |
| images | 8px |
| inputs | 3px |
| buttons | 3px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 40-64px
- **Card padding:** 24-36px
- **Element gap:** 6-12px

## Components

### Filled Action Button
**Role:** Primary CTA — Shop, Read More, Listen Now, Quick View

Solid Burnt Orange (#c03001) background, Cream Paper (#fff9f2) text, 3px radius, Necto Mono at 12–14px weight 400, 0.05em tracking, uppercase. Padding 10px 12px. Small, tight, stamp-like. The button reads as a printed label, not a pill.

### Ghost Outline Button
**Role:** Secondary action — border-only variants

Transparent background, Espresso (#522c25) 1px border, Espresso text, 3px radius, Necto Mono 12–14px uppercase. Padding 6–10px vertical. Used when a filled orange button would compete with a primary on the same screen.

### Navigation Link
**Role:** Top nav menu items: SHOP, ABOUT, WHOLESALE, COMMUNITY BOARD, CONTACT

Necto Mono 12–14px weight 400, 0.05em tracking, uppercase, Espresso (#522c25) text. No background. Small dropdown caret next to SHOP. Aligned in a single horizontal row centered in the header.

### Hero Brand Block
**Role:** Brand lockup overlaid on hero image

Little Amps display serif at 45–51px weight 500, -0.10em tracking, in Burnt Orange (#c03001). Two lines: brand name stacked over a small decorative line-art icon (espresso machine or coffee bag). Positioned top-left of the hero image with generous padding.

### Product Card
**Role:** E-commerce product tile — Friend Blend shown

Linen Beige (#f6ede3) background, 8px radius, product image framed with 8px radius and hairline border. Below image: product name in Inclusive Sans 16px Espresso, price in Necto Mono, tasting notes in Coffee Dust (#977e77), roast level bar, and a Dusty Blue (#89b4ca) Quick View button at 3px radius. Padding 24–36px.

### Editorial Card
**Role:** Community Board / blog post tile

Cream Paper (#fff9f2) background, Taupe Hairline (#e6dad4) 1px border, 8px radius. Image on top (8px radius), then date in Necto Mono 10–12px, title in Little Amps serif 20–22px -0.10em, excerpt in Inclusive Sans 14px Coffee Dust, and a filled Burnt Orange Read More button at 3px radius.

### Horizontal Scroll Carousel
**Role:** Community Board and product sliders

Row of 4–5 cards with consistent 14–16px gaps. Small circular prev/next arrow buttons (12px) in the top-right corner. No visible scrollbar — navigation is icon-only.

### Header / Nav Bar
**Role:** Site-wide top navigation

Cream Paper (#fff9f2) background, thin Taupe Hairline (#e6dad4) 1px bottom border. Brand wordmark logo on the left (lowercase custom mark), centered nav links in Necto Mono uppercase, right-aligned Account dropdown and Cart counter. Height approximately 64–80px.

### Date Stamp
**Role:** Article and post publication dates

Necto Mono 10–12px weight 400, 0.05em tracking, Coffee Dust (#977e77) text. Dot-separated format (e.g. '06.03.2026'). Sits above titles in editorial cards.

### Tasting Notes Bar
**Role:** Flavor profile indicator on product pages

Three small monospace labels (Roastness, Acidity, Complexity) with circular dot indicators below each, in Necto Mono 10–12px Espresso. A horizontal scale bar below shows roast level (e.g. Medium Roast) in Inclusive Sans 14px.

### Hero Image Banner
**Role:** Full-bleed top-of-page photography

Edge-to-edge lifestyle or product photography (record player, café interior) on Cream Paper canvas. No overlay, no gradient — the image IS the hero. Often paired with the Hero Brand Block in the top-left corner.

### Decorative Line-Art Icon
**Role:** Small brand mark and section accents (duck, espresso machine, coffee bag)

Espresso (#522c25) or Burnt Orange (#c03001) 1–2px stroke, no fill, approximately 24–40px. Hand-drawn illustrative style — appears next to headlines and as the brand mascot in the header logo.

### Slider Counter
**Role:** Carousel position indicator (01 — 03)

Necto Mono 10–12px in the bottom-right of carousels. Format: current slide number, em-dash, total slides, flanked by small prev/next arrow buttons.

### Shop All Pill Button
**Role:** Section transition link at bottom of carousels

Small Burnt Orange filled button with Cream Paper text at 3px radius. Necto Mono 12px uppercase, tight padding (8–10px vertical). Appears at the bottom-left of each major carousel section.

## Do's and Don'ts

### Do
- Use Little Amps serif for all display headlines at 20–51px with -0.10em tracking — it is the only voice that signals brand identity.
- Set all UI labels, nav, buttons, dates, and prices in Necto Mono uppercase with 0.05em tracking — this monospace voice IS the structural system.
- Default page background to Cream Paper (#fff9f2) and use Linen Beige (#f6ede3) for the next surface up — never use pure white.
- Use Burnt Orange (#c03001) as the single filled action color; keep all primary CTAs on a 3px radius for a printed-label feel.
- Hairline all borders at 1px in Taupe Hairline (#e6dad4) — never use heavy shadows or thick borders.
- Use Coffee Dust (#977e77) for any muted, secondary, or helper text — never use plain gray.
- Pair full-bleed documentary photography with the Hero Brand Block in the top-left corner; let the image do the atmosphere.

### Don't
- Don't use pure black, pure white, or blue-gray system neutrals — the palette is warm and coffee-toned throughout.
- Don't use large border-radius (pill shapes, 16px+, fully rounded) — the system is sharp-cornered at 3–8px.
- Don't use heavy drop shadows or elevation effects — depth comes from surface color shifts, not shadows.
- Don't set body or paragraph text in display serif or monospace — Inclusive Sans is the only body face.
- Don't introduce additional accent colors — the system is disciplined: one vivid orange, one amber, one marigold, one dusty blue.
- Don't use bright pure red, green, or blue for state semantics — the warm palette rewrites these into Espresso and Burnt Orange.
- Don't use Inter, Helvetica, or system-ui for branding moments — the custom display serif and monospace pairing is non-negotiable.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Cream Paper | `#fff9f2` | Page canvas and default background |
| 2 | Linen Beige | `#f6ede3` | Card surfaces, section bands, image frames |
| 3 | Sandstone | `#cbbbb4` | Muted panel fills, secondary card surfaces |

## Elevation

The system deliberately avoids drop shadows. Depth is communicated through three flat cream/beige surface levels (Cream Paper → Linen Beige → Sandstone) and 1px hairline borders in Taupe Hairline. Components float through color layering, not shadow. This keeps the aesthetic flat, editorial, and zine-like — consistent with the printed-label and vinyl-sleeve metaphor.

## Imagery

Photography is documentary, tactile, and lifestyle-led: hands touching record players, café counter scenes with baristas and customers, raw coffee cherries in hands, vinyl records, coffee bag packaging. Treatment is warm and slightly desaturated, matching the cream-and-espresso palette. Images are full-bleed at the hero level but contained in 8px-radius frames within cards. No stock photography, no abstract gradients, no 3D renders. Illustrations are minimal line-art icons (espresso machine, coffee bag, duck mascot) in 1–2px Espresso or Burnt Orange strokes — hand-drawn, never geometric. Imagery occupies roughly 40–50% of page real estate and carries the brand atmosphere more than typography or color alone.

## Layout

Page model is centered max-width (~1200px) on a full-bleed Cream Paper canvas, with content comfortably contained rather than edge-to-edge except for the hero image. The hero pattern is a full-bleed documentary photograph (record player / café interior) with the brand lockup overlaid in the top-left corner, followed by a horizontal nav bar pinned below the image. Section rhythm alternates between editorial text blocks (centered or left-aligned headlines over short paragraph copy) and image-heavy carousels (Community Board, product grids). Card grids use 3–4 columns on desktop with 14–16px gaps. Content density is comfortable — generous breathing room between sections (40–64px), with small tight internal padding. Navigation is a single horizontal bar with no sidebar or mega-menu. Carousels include small icon-only prev/next controls and a numeric position counter.

## Agent Prompt Guide

**Quick Color Reference**
- canvas: #fff9f2
- card surface: #f6ede3
- text: #522c25
- muted text: #977e77
- border: #e6dad4
- accent: #c03001
- primary action: #c03001 (filled action)

**Example Component Prompts**

1. *Editorial Card*: Cream Paper (#fff9f2) background, Taupe Hairline (#e6dad4) 1px border, 8px radius. Image at top with 8px radius. Date in Necto Mono 10px Coffee Dust (#977e77), 0.05em tracking, format '06.03.2026'. Title in Little Amps serif 22px weight 500, Espresso (#522c25), -2.2px tracking. Body excerpt in Inclusive Sans 14px Coffee Dust. Filled Read More button: Burnt Orange (#c03001) background, Cream Paper text, 3px radius, Necto Mono 12px uppercase, 10px 12px padding.

2. *Product Card*: Linen Beige (#f6ede3) background, 8px radius. Product image framed at 8px radius. Name in Inclusive Sans 16px Espresso. Price in Necto Mono 13px Amber Ink (#c46500). Tasting notes in Inclusive Sans 14px Coffee Dust. Roast level bar: 1px Taupe Hairline line with filled segment in Espresso. Quick View button: Dusty Blue (#89b4ca) background, Cream Paper text, 3px radius, Necto Mono 12px uppercase.

3. *Hero Brand Block*: Little Amps display serif at 50px weight 500, Burnt Orange (#c03001), -5px tracking, two lines left-aligned. Small line-art coffee bag icon (24px, Espresso stroke) positioned to the right of the second line. Padding 32px from top-left of hero image.

4. *Nav Bar*: Cream Paper (#fff9f2) background, 1px Taupe Hairline bottom border, height 72px. Brand wordmark logo at left (lowercase custom mark, Little Amps serif 20px Espresso). Center: nav items in Necto Mono 13px uppercase Espresso, 0.05em tracking, 24px gaps: SHOP ▾, ABOUT, WHOLESALE, COMMUNITY BOARD, CONTACT. Right: ACCOUNT ▾ and CART 0 in same style.

5. *Ghost Outline Button*: Transparent background, 1px Espresso (#522c25) border, 3px radius. Text in Necto Mono 13px weight 500 Espresso, 0.05em tracking, uppercase. Padding 8px 14px. Use for secondary actions when a filled Burnt Orange button is already on screen.

## Typography Pairing Logic

The system uses a strict three-font hierarchy: Little Amps (custom display serif) speaks only at the brand and headline level — 20px and up, always in Espresso or Burnt Orange. Necto Mono handles everything structural and metadata: nav, buttons, dates, prices, labels — always uppercase, always 0.05em tracking, always between 10–16px. Inclusive Sans is the only body face, set at 13–16px with 0.05em tracking. Roboto Mono appears as a secondary monospace for data contexts. Never let display serif and monospace appear in the same line of body copy — they serve separate emotional registers.

## Color Behavior Rules

Color is rationed, not decorated. Cream Paper is the default for 80% of surface area. Linen Beige appears only inside cards or section bands. Burnt Orange (#c03001) is the single filled-button color and should appear at most 1–2 times per viewport. Amber Ink (#c46500) is for text emphasis only, not backgrounds. Marigold Wash (#febf6f) and Dusty Blue (#89b4ca) are seasonal or secondary accents — never use both in the same component. Espresso (#522c25) is the only structural dark and handles all text, borders, and icons.

## Similar Brands

- **Blue Bottle Coffee** — Same documentary café photography on cream/off-white canvas with a single dark accent for text and one warm accent for CTAs
- **Sey Coffee** — Editorial zine-like layout with monospaced labels, tight corners, and warm coffee-toned palette replacing standard neutrals
- **Onyx Coffee Lab** — Heavy use of monospaced typography for technical metadata (roast dates, origins, scores) and flat surfaces without shadows
- **Stumptown Coffee** — Warm cream canvas, burnt-orange accent, and lifestyle photography that leads the page rather than supporting it
- **Counter Culture Coffee** — Editorial grid system with strong typographic hierarchy, small-radius buttons, and a restrained warm palette with one vivid accent

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-espresso: #522c25;
  --color-burnt-orange: #c03001;
  --color-amber-ink: #c46500;
  --color-marigold-wash: #febf6f;
  --color-dusty-blue: #89b4ca;
  --color-cream-paper: #fff9f2;
  --color-linen-beige: #f6ede3;
  --color-taupe-hairline: #e6dad4;
  --color-sandstone: #cbbbb4;
  --color-coffee-dust: #977e77;

  /* Typography — Font Families */
  --font-little-amps: 'Little Amps', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inclusive-sans: 'Inclusive Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-necto-mono: 'Necto Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-roboto-mono: 'Roboto Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-gtstandard-m: 'GTStandard-M', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.1;
  --tracking-caption: 0.5px;
  --text-body: 14px;
  --leading-body: 1.6;
  --tracking-body: 0.7px;
  --text-heading-sm: 20px;
  --leading-heading-sm: 1;
  --tracking-heading-sm: -2px;
  --text-heading: 22px;
  --leading-heading: 1;
  --tracking-heading: -2.2px;
  --text-display: 50px;
  --leading-display: 0.85;
  --tracking-display: -5px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-5: 5px;
  --spacing-6: 6px;
  --spacing-7: 7px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-14: 14px;
  --spacing-15: 15px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-22: 22px;
  --spacing-24: 24px;
  --spacing-30: 30px;
  --spacing-36: 36px;
  --spacing-90: 90px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 40-64px;
  --card-padding: 24-36px;
  --element-gap: 6-12px;

  /* Border Radius */
  --radius-sm: 3px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 22px;

  /* Named Radii */
  --radius-cards: 8px;
  --radius-badges: 3px;
  --radius-images: 8px;
  --radius-inputs: 3px;
  --radius-buttons: 3px;

  /* Surfaces */
  --surface-cream-paper: #fff9f2;
  --surface-linen-beige: #f6ede3;
  --surface-sandstone: #cbbbb4;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-espresso: #522c25;
  --color-burnt-orange: #c03001;
  --color-amber-ink: #c46500;
  --color-marigold-wash: #febf6f;
  --color-dusty-blue: #89b4ca;
  --color-cream-paper: #fff9f2;
  --color-linen-beige: #f6ede3;
  --color-taupe-hairline: #e6dad4;
  --color-sandstone: #cbbbb4;
  --color-coffee-dust: #977e77;

  /* Typography */
  --font-little-amps: 'Little Amps', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inclusive-sans: 'Inclusive Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-necto-mono: 'Necto Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-roboto-mono: 'Roboto Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-gtstandard-m: 'GTStandard-M', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.1;
  --tracking-caption: 0.5px;
  --text-body: 14px;
  --leading-body: 1.6;
  --tracking-body: 0.7px;
  --text-heading-sm: 20px;
  --leading-heading-sm: 1;
  --tracking-heading-sm: -2px;
  --text-heading: 22px;
  --leading-heading: 1;
  --tracking-heading: -2.2px;
  --text-display: 50px;
  --leading-display: 0.85;
  --tracking-display: -5px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-5: 5px;
  --spacing-6: 6px;
  --spacing-7: 7px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-14: 14px;
  --spacing-15: 15px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-22: 22px;
  --spacing-24: 24px;
  --spacing-30: 30px;
  --spacing-36: 36px;
  --spacing-90: 90px;

  /* Border Radius */
  --radius-sm: 3px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 22px;
}
```
