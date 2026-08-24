# Raus — Style Reference
> Warm cabin journal on cream paper — every page a postcard from the woods.

**Theme:** light

Raus is an editorial cabin-booking platform rendered as a warm, hand-printed travel journal: cream paper backgrounds, generous generous breathing room, and photography that sits beside text rather than beneath it. The brand uses a deep forest green as a calm, non-shouting identity color — present in the wordmark and key links but never screaming — while a bright marigold yellow search bar acts as the single visual exclamation point on each page, anchoring the booking flow. Typography does the heavy lifting: a single neo-grotesque face set at weight 300 with tight negative tracking creates an airy, almost whispered voice that contrasts with the confident, rounded geometry of the components. Surfaces are warm and matte, corners are generously rounded (20px is the default, 40px for hero cards), and shadows are absent — depth comes from layering cream on cream, not elevation.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Charcoal | `#23212c` | `--color-charcoal` | Body text, headings, dark surfaces, icon strokes, hairline borders. Anchors the entire system — almost-black but slightly warm, never pure black |
| Paper | `#f7f0e1` | `--color-paper` | Primary page background and card canvas — warm cream that gives the entire site its printed, hand-made feel. Not white, not beige; paper |
| Snow | `#ffffff` | `--color-snow` | Search bar text, button labels on dark fills, image overlays, and any surface that needs to sit forward of the cream canvas |
| Pine | `#006434` | `--color-pine` | Brand wordmark, primary headings on hero, link text, and the only chromatic authority — deep forest green used sparingly to mark identity, never decoration |
| Marigold | `#fcbd1c` | `--color-marigold` | Search bar surface, accent blocks, tag fills, the single bright punctuation on an otherwise muted page. Makes the booking flow unmistakable |
| Morning Sky | `#a6dfff` | `--color-morning-sky` | Top announcement bar background and soft accent surfaces. Cool counterpoint to the warm canvas — signals timely, transient messaging |
| Ember | `#dd5000` | `--color-ember` | Gift voucher CTA on the announcement bar and warm interactive accent. Reads as firelight against the cream — chosen for urgency in promotional contexts, not for the primary booking flow |

## Tokens — Typography

### neue-haas-unica — Single typeface for everything from 12px captions to 40px display headlines. Weight 300 is the signature — headings whisper rather than shout, creating authority through restraint. Weight 400 reserves itself for meta labels (IDEA 32, PERSPECTIVES, navigation items) and body copy where 300 would feel too fragile. · `--font-neue-haas-unica`
- **Substitute:** Neue Haas Grotesk Display, Inter (weight 300), National 2, Untitled Sans
- **Weights:** 300, 400
- **Sizes:** 12px, 14px, 16px, 18px, 22px, 36px, 40px
- **Line height:** 0.95–1.33 depending on size
- **Letter spacing:** Consistently negative across all sizes: -0.02em at display, tapering to -0.005em at caption. The tight tracking is a defining voice — letters pull close, creating density without weight.
- **OpenType features:** `"ss01" on (stylistic alternates), "tnum" on (tabular numerals for prices and dates in the search bar)`
- **Role:** Single typeface for everything from 12px captions to 40px display headlines. Weight 300 is the signature — headings whisper rather than shout, creating authority through restraint. Weight 400 reserves itself for meta labels (IDEA 32, PERSPECTIVES, navigation items) and body copy where 300 would feel too fragile.

### fonts — fonts — detected in extracted data but not described by AI · `--font-fonts`
- **Weights:** 300
- **Sizes:** 22px, 28px, 36px, 40px
- **Line height:** 0.95, 1, 1.07, 1.18
- **Letter spacing:** -0.02, -0.015, -0.01
- **Role:** fonts — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.18 | -0.06px | `--text-caption` |
| body-sm | 14px | 1.33 | -0.07px | `--text-body-sm` |
| body | 16px | 1.29 | -0.08px | `--text-body` |
| subheading | 18px | 1.22 | -0.18px | `--text-subheading` |
| heading-sm | 22px | 1.15 | -0.33px | `--text-heading-sm` |
| heading | 28px | 1.07 | -0.42px | `--text-heading` |
| heading-lg | 36px | 1 | -0.72px | `--text-heading-lg` |
| display | 40px | 0.95 | -0.8px | `--text-display` |

## Tokens — Spacing & Shapes

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 5 | 5px | `--spacing-5` |
| 6 | 6px | `--spacing-6` |
| 8 | 8px | `--spacing-8` |
| 10 | 10px | `--spacing-10` |
| 12 | 12px | `--spacing-12` |
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 26 | 26px | `--spacing-26` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 96 | 96px | `--spacing-96` |
| 120 | 120px | `--spacing-120` |
| 192 | 192px | `--spacing-192` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 20px |
| buttons | 20px |
| nav-pills | 99px |
| hero-cards | 40px |
| small-chips | 12px |

### Layout

- **Page max-width:** 1280px
- **Section gap:** 80-120px
- **Card padding:** 20-24px
- **Element gap:** 20px

## Components

### Announcement Bar
**Role:** Top-of-page time-sensitive messaging

Full-bleed strip, Morning Sky (#a6dfff) background, 40px height, centered message in Charcoal 14px. Houses an Ember (#dd5000) text-link CTA with an arrow glyph. Dismissible with a small × at the far right. No padding on the message itself — it floats centered.

### Primary Navigation
**Role:** Site-wide header

Transparent over cream canvas. Left: RAUS wordmark in Pine green, 40px weight 300, letter-spacing -0.8px — the brand's visual anchor. Right: 5 nav items in Charcoal 16px weight 400, 20px horizontal spacing, language toggle (EN ▾) in a pill border (99px radius, 1px Charcoal border, 12px 16px padding).

### Hero Headline
**Role:** Opening pitch on landing pages

Set in neue-haas-unica weight 300, 36–40px, Charcoal, letter-spacing -0.72 to -0.8px. Max 2 lines. The line-height of 0.95–1.0 lets lines pull tight — the headline reads as a single shape. Always sits flush left, never centered.

### Marigold Search Bar
**Role:** Primary booking widget

The signature component. Marigold (#fcbd1c) background, 40px radius pill spanning nearly the full content width. Inside, 4 horizontally distributed fields separated by hairline Charcoal dividers: REGION (dropdown), ARRIVAL & DEPARTURE (two date inputs with → arrow between), GUESTS (counter), and a Charcoal (#23212c) pill button labeled 'Search' in Snow white, 16px weight 400, 12px 24px padding, 20px radius. Field labels are 10px uppercase Charcoal, values are 16px Charcoal with underline-only inputs (no boxes).

### Editorial Photo Card
**Role:** Content imagery with IDEA caption

Full-bleed image with 20px radius, paired with a small caption block below. Caption starts with a category label (IDEA 32) in 12px weight 400 Charcoal, followed by a sentence in 18px weight 300 Charcoal. Image-to-caption gap: 16px. No card chrome — the image IS the card.

### Journal Article Card
**Role:** Blog/perspective grid item

Image-first card in a 3-column grid. Image fills the card with 20px radius. A Snow (#ffffff) overlay panel sits at the bottom-left of the image, 20px padding, 12px radius on outer corners. Inside: category label 'PERSPECTIVES' in 10px weight 400 Charcoal, headline in 22px weight 300 Charcoal. No visible card border or shadow — the image is the card, the panel is the label.

### Pill Link Button
**Role:** Inline navigation or section entry

Ghost-style link in a 99px radius pill, 1px Charcoal border, 10px 20px padding. Label in 14px weight 400 Charcoal. Example usage: 'View all articles →'. Subtle hover: border thickens to 1.5px or fill flips to Charcoal with Snow text.

### CTA Button (Filled Dark)
**Role:** Primary action in any flow

Charcoal (#23212c) fill, Snow (#ffffff) text, 20px radius, 14px 24px padding, 16px weight 400. Used for the Search submit and any flow-critical action. No shadow. Hover: fill remains Charcoal; a 2px Pine green underline appears below for active/pressed states.

### Language Toggle
**Role:** Locale switcher in nav

99px radius pill, 1px Charcoal border, 12px 16px padding, 14px weight 400 Charcoal text. Small ▾ caret beside the language code.

### Footer
**Role:** Site footer

Cream canvas continues — no dark footer inversion. Columns of links in 14px weight 400 Charcoal, generous 24–32px vertical spacing. Brand wordmark appears small at top-left. No social icon row by default; instead a quiet, editorial link list.

### Date Input Pair
**Role:** Search bar date selection

Two side-by-side date fields with a → arrow between. Each field is 14px Charcoal underlined text (no box). Arrow is 14px Charcoal, 6px horizontal padding. The pairing reads as a single flow, not two inputs.

### Dropdown Selector
**Role:** Region/guests selection

Label-first pattern: 10px uppercase category label in Charcoal sits above a 16px underlined value. ▾ caret at the far right. No border, no box — just a typographic contract that opens a panel on click.

## Do's and Don'ts

### Do
- Set all headlines at weight 300 with negative letter-spacing — -0.8px at 40px, tapering to -0.07px at 12px. This is the voice; do not bold it up.
- Use Pine green (#006434) only for the wordmark, primary headlines on the hero, and inline text links. Never as a button fill, badge background, or decorative shape.
- Keep the cream Paper (#f7f0e1) as the dominant canvas across every page. Only the Marigold search bar, Morning Sky announcement strip, and Snow image overlays are allowed to break it.
- Round every interactive element generously: 20px for buttons and cards, 40px for hero cards, 99px for pill-style nav. The system should feel soft, never angular.
- Compose hero sections as asymmetric 2-column image pairs (one taller, one shorter) rather than centered stacks. Photography sits beside copy, not beneath it.
- Use Marigold (#fcbd1c) as a surface, not a stroke or text color. It belongs on the search bar, accent blocks, and tag fills — nowhere else.
- Label content with small uppercase meta tags (IDEA 32, PERSPECTIVES) in 12px weight 400 Charcoal before any descriptive copy. The category is the headline.

### Don't
- Never use a drop shadow on any component. Depth comes from cream-on-cream layering and radius, not elevation.
- Never center body copy or headlines. Everything reads left-aligned against the cream canvas.
- Never apply Marigold, Ember, or Morning Sky to body text. They are surface and accent colors only — Charcoal is the only text color.
- Never use a sharp corner (0–8px radius) on any visible element. Even chips and inline tags use 12px minimum; cards never go below 20px.
- Never use Pine green as a button background. If a brand-color action is needed, use Charcoal fill with Pine text on a Snow pill — the green earns its weight by being rare.
- Never set display text at line-height above 1.05. The tight 0.95–1.0 range is what makes 40px weight 300 feel sculptural instead of airy.
- Never place photography inside a frame, border, or card with a visible stroke. Images sit directly on the cream canvas with only a radius to define their edge.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Paper Canvas | `#f7f0e1` | Base page background — warm cream that defines the entire mood |
| 1 | Snow Surface | `#ffffff` | Image overlays, search button fill, elevated card surfaces |
| 2 | Morning Sky Band | `#a6dfff` | Top announcement strip, floating utility surfaces |
| 3 | Marigold Bar | `#fcbd1c` | Search bar and accent blocks — the one surface that is allowed to shout |

## Elevation

Shadows are deliberately absent. Depth is built through three quiet techniques: (1) warm cream layering slightly off-cream cards, (2) the 20px radius creating soft edge transitions, and (3) the 40px radius on hero cards producing a poster-like lift. Where a clickable affordance is needed, a dark Charcoal fill or a 2px Charcoal border does the work — never a drop shadow.

## Imagery

Photography is the product: large, full-bleed editorial shots of cabins in forests and meadows, shot in soft natural light with warm greens and muted earth tones. Images are treated as content objects, not decoration — they sit directly on the cream canvas with a 20–40px radius and no frames, borders, or overlays other than the white caption panel on journal cards. No illustration, no abstract graphics, no icons-heavy visual style. The aesthetic is hand-printed travel journal: one or two photographs per section, generously sized, captioned with a small IDEA number and a single descriptive sentence. Lifestyle photography of guests (people with dogs, reading on terraces) appears only in the journal grid. No 3D renders, no stock-style product cutouts.

## Layout

Full-bleed cream canvas with content max-width 1280px centered. Hero is a left-aligned headline over an asymmetric 2-column image pair (one image roughly 60% width, the other 40% with a 32px gap), with the Marigold search bar floating across the bottom of the hero. Section rhythm is open: 80–120px vertical gaps between bands, no divider lines, no alternating dark/light inversion. Content blocks are always 2- or 3-column grids of editorial photo cards with IDEA captions. The journal section is a strict 3-column grid with no card chrome — images carry the structure. Navigation is a single transparent header bar, not sticky. Footer continues the cream canvas without inversion. Overall density is generous and editorial — this is a reading experience that happens to take bookings, not a dashboard.

## Agent Prompt Guide

## Quick Color Reference
- text: #23212c (Charcoal)
- background: #f7f0e1 (Paper cream)
- border: #23212c at 1px for ghost buttons; 2px for active states
- accent: #fcbd1c (Marigold — search bar and accent surfaces only)
- brand: #006434 (Pine — wordmark and links only)
- primary action: #23212c (filled action)

## Example Component Prompts

1. **Marigold Search Bar** — Build a 40px-radius pill spanning 900px width, Marigold (#fcbd1c) background. Inside, four horizontally distributed fields: 'REGION' (10px uppercase label, 16px underlined value 'All Regions'), 'ARRIVAL & DEPARTURE' (two 16px date values with a 14px → arrow between), 'GUESTS' (16px value '2 Guests'), and a Charcoal (#23212c) 20px-radius button labeled 'Search' in Snow (#ffffff) 16px weight 400. Separate fields with 1px Charcoal vertical dividers. No box borders on the fields themselves — just underlines.

2. **Hero Headline Block** — Cream (#f7f0e1) canvas. Headline at 40px neue-haas-unica weight 300, Charcoal (#23212c), letter-spacing -0.8px, line-height 0.95. Max-width 600px, left-aligned. Below: 18px weight 300 Charcoal subhead at 1.22 line-height, max 2 lines. Headline sits in the top-left quadrant of a 2-column image grid below it.

3. **Editorial Photo Card** — Full-bleed image with 20px radius. Below the image, a 16px gap, then a caption block: first line 'IDEA 32' in 12px weight 400 Charcoal, second line the description in 18px weight 300 Charcoal. No card background, no border — the image sits on cream and the caption sits on cream.

4. **Journal Article Card** — Image filling the card at 20px radius. Overlaid at bottom-left, a Snow (#ffffff) panel with 20px padding, 12px outer radius. Inside the panel: 'PERSPECTIVES' in 10px uppercase weight 400 Charcoal, 4px gap, then a 22px weight 300 Charcoal headline, 1.15 line-height, max 2 lines.

5. **Pill Link Button** — 99px radius, 1px Charcoal border, transparent fill, 10px 20px padding, label in 14px weight 400 Charcoal followed by a → arrow. Example: 'View all articles →'. Hover: fill becomes Charcoal, text becomes Snow.

## Similar Brands

- **Airbnb (Stays category, editorial mode)** — Same generous whitespace, photography-first hero, and single calm brand color supporting rather than dominating the layout
- **Getaway** — Same cabin-in-nature photography, large rounded image cards, and a quiet near-monochrome palette that lets the imagery carry the brand
- **Camping Cabins (Various European indie operators)** — Same cream-paper aesthetic, editorial IDEA-style captions beneath photography, and a single saturated accent (yellow/orange) reserved for the booking action
- **Field Mag** — Same editorial-journal treatment of outdoor/travel content — serif-free neo-grotesque at light weights, warm backgrounds, photography as primary content unit
- **Suiteness** — Same neo-grotesque typography at weight 300 with tight tracking, pill-shaped inputs in a single bright accent color for the search/booking flow

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-charcoal: #23212c;
  --color-paper: #f7f0e1;
  --color-snow: #ffffff;
  --color-pine: #006434;
  --color-marigold: #fcbd1c;
  --color-morning-sky: #a6dfff;
  --color-ember: #dd5000;

  /* Typography — Font Families */
  --font-neue-haas-unica: 'neue-haas-unica', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-fonts: 'fonts', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.18;
  --tracking-caption: -0.06px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.33;
  --tracking-body-sm: -0.07px;
  --text-body: 16px;
  --leading-body: 1.29;
  --tracking-body: -0.08px;
  --text-subheading: 18px;
  --leading-subheading: 1.22;
  --tracking-subheading: -0.18px;
  --text-heading-sm: 22px;
  --leading-heading-sm: 1.15;
  --tracking-heading-sm: -0.33px;
  --text-heading: 28px;
  --leading-heading: 1.07;
  --tracking-heading: -0.42px;
  --text-heading-lg: 36px;
  --leading-heading-lg: 1;
  --tracking-heading-lg: -0.72px;
  --text-display: 40px;
  --leading-display: 0.95;
  --tracking-display: -0.8px;

  /* Typography — Weights */
  --font-weight-light: 300;
  --font-weight-regular: 400;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-5: 5px;
  --spacing-6: 6px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-26: 26px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-96: 96px;
  --spacing-120: 120px;
  --spacing-192: 192px;

  /* Layout */
  --page-max-width: 1280px;
  --section-gap: 80-120px;
  --card-padding: 20-24px;
  --element-gap: 20px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-xl: 12px;
  --radius-2xl: 20px;
  --radius-3xl: 40px;
  --radius-full: 72px;
  --radius-full-2: 99px;

  /* Named Radii */
  --radius-cards: 20px;
  --radius-buttons: 20px;
  --radius-nav-pills: 99px;
  --radius-hero-cards: 40px;
  --radius-small-chips: 12px;

  /* Surfaces */
  --surface-paper-canvas: #f7f0e1;
  --surface-snow-surface: #ffffff;
  --surface-morning-sky-band: #a6dfff;
  --surface-marigold-bar: #fcbd1c;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-charcoal: #23212c;
  --color-paper: #f7f0e1;
  --color-snow: #ffffff;
  --color-pine: #006434;
  --color-marigold: #fcbd1c;
  --color-morning-sky: #a6dfff;
  --color-ember: #dd5000;

  /* Typography */
  --font-neue-haas-unica: 'neue-haas-unica', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-fonts: 'fonts', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.18;
  --tracking-caption: -0.06px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.33;
  --tracking-body-sm: -0.07px;
  --text-body: 16px;
  --leading-body: 1.29;
  --tracking-body: -0.08px;
  --text-subheading: 18px;
  --leading-subheading: 1.22;
  --tracking-subheading: -0.18px;
  --text-heading-sm: 22px;
  --leading-heading-sm: 1.15;
  --tracking-heading-sm: -0.33px;
  --text-heading: 28px;
  --leading-heading: 1.07;
  --tracking-heading: -0.42px;
  --text-heading-lg: 36px;
  --leading-heading-lg: 1;
  --tracking-heading-lg: -0.72px;
  --text-display: 40px;
  --leading-display: 0.95;
  --tracking-display: -0.8px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-5: 5px;
  --spacing-6: 6px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-26: 26px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-96: 96px;
  --spacing-120: 120px;
  --spacing-192: 192px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-xl: 12px;
  --radius-2xl: 20px;
  --radius-3xl: 40px;
  --radius-full: 72px;
  --radius-full-2: 99px;
}
```
