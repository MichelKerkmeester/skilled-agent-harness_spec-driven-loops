# Chester's Garden — Style Reference
> Flimsy art-zine on drafting paper

**Theme:** light

Chester's Garden is a personal digital garden rendered as a quiet, editorial broadsheet on soft gray paper. The visual language is deliberately unfussy: a near-white canvas layered onto a cool gray substrate, serif display type at whisper-weight 300 that feels typeset rather than designed, and a masonry grid where cards of varying heights lock together like magazine columns. Body text is compact Inter with selectively bolded words inside flowing sentences, echoing how a reader underlines a phrase in a book. Pastel tag pills (mint, butter yellow, sage) and one rust-orange link color provide the only chromatic moments — accents behave like highlighter marks, not like a brand identity. Everything else is restrained: hairline borders, tiny radii, no gradients, no decorative elevation, and images sit in their own muted card frames.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Paper Gray | `#e5e7eb` | `--color-paper-gray` | Page background, card borders, hairline dividers — the cool, slightly blue-gray substrate that every surface sits on or against |
| Bone White | `#fafafa` | `--color-bone-white` | Card and content-tile surface — reads as warm white against the cool Paper Gray substrate, giving each block a subtle lift without any shadow |
| Full Black | `#000000` | `--color-full-black` | Primary body text, nav logo, image letterbox bars — maximum contrast, used for sentences that need to carry the page |
| Ink Charcoal | `#171717` | `--color-ink-charcoal` | Headline and link text — almost black but not quite, so Fraunces serifs feel printed rather than digital |
| Soft Graphite | `#404040` | `--color-soft-graphite` | Secondary body text, supporting metadata lines under headings |
| Pencil Gray | `#a3a3a3` | `--color-pencil-gray` | Tertiary text, icon strokes, placeholder labels — fades to the background and only earns attention when scanned for |
| Highlight Mint | `#daf5ae` | `--color-highlight-mint` | Pill-tag background (FILTER, READ) — the first chromatic accent tier, like a fluorescent marker on the page |
| Highlight Butter | `#fde5a7` | `--color-highlight-butter` | Pill-tag background (NOW BREWING) — second accent tier, warmer counterpart to the mint |
| Highlight Sage | `#b7f2cc` | `--color-highlight-sage` | Pill-tag background (READ variants) — third accent tier, softer green for less emphatic tags |
| Rust Underline | `#7c2d12` | `--color-rust-underline` | Occasional inline emphasis — the only warm chromatic voice in the palette, used sparingly to single out one word or phrase inside a body sentence |
| Navy Quotation | `#0c4a6e` | `--color-navy-quotation` | Occasional inline emphasis — the cool counterpart to Rust Underline, used for the same hand-underline-in-a-book purpose |

## Tokens — Typography

### Fraunces — Display and editorial headings — light-weight serif at 30/36/60px. The whisper weight and optical-size personality of Fraunces make every headline feel hand-set rather than UI-generated; this is the single most distinctive typographic choice on the site · `--font-fraunces`
- **Substitute:** Lora (300) or Cormorant Garamond Light
- **Weights:** 300
- **Sizes:** 30px, 36px, 60px
- **Line height:** 1.00-1.25
- **Letter spacing:** -0.03em
- **Role:** Display and editorial headings — light-weight serif at 30/36/60px. The whisper weight and optical-size personality of Fraunces make every headline feel hand-set rather than UI-generated; this is the single most distinctive typographic choice on the site

### Inter — Body, navigation, metadata, card titles, footer. Used everywhere the voice is functional and not editorial. Compact 14px for card-level metadata, comfortable 16px for running prose · `--font-inter`
- **Substitute:** system-ui or IBM Plex Sans
- **Weights:** 400
- **Sizes:** 14px, 16px
- **Line height:** 1.43-1.63
- **Letter spacing:** -0.025em
- **Role:** Body, navigation, metadata, card titles, footer. Used everywhere the voice is functional and not editorial. Compact 14px for card-level metadata, comfortable 16px for running prose

### ui-monospace — Code-fence and small technical labels — inherits the same tight tracking as Inter so mono blocks align with the proportional text around them · `--font-ui-monospace`
- **Substitute:** JetBrains Mono or SF Mono
- **Weights:** 400
- **Sizes:** 14px
- **Line height:** 1.43
- **Letter spacing:** -0.025em
- **Role:** Code-fence and small technical labels — inherits the same tight tracking as Inter so mono blocks align with the proportional text around them

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 14px | 1.43 | -0.35px | `--text-caption` |
| body | 16px | 1.5 | -0.4px | `--text-body` |
| heading-sm | 30px | 1.2 | -0.9px | `--text-heading-sm` |
| heading | 36px | 1.11 | -1.08px | `--text-heading` |
| display | 60px | 1 | -1.8px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** compact

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 8 | 8px | `--spacing-8` |
| 12 | 12px | `--spacing-12` |
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 28 | 28px | `--spacing-28` |
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 9999px |
| cards | 8px |
| images | 8px |
| buttons | 4px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| subtle | `rgba(0, 0, 0, 0.1) 0px 0px 0px 1px inset, rgba(0, 0, 0, 0...` | `--shadow-subtle` |
| md | `rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.1)...` | `--shadow-md` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 24px
- **Card padding:** 20px
- **Element gap:** 8px

## Components

### Top Navigation Bar
**Role:** Minimal site header with brand mark and routing

Transparent bar sitting on the Paper Gray canvas. Left side: 'Chester' wordmark in Inter 16px/400 Ink Charcoal. Center: nav links (Projects, Writing, Reading, Hobbies) at Inter 16px, color shifts between Full Black and Pencil Gray for active/hover. Right side: social links (GitHub, Twitter, CV) at Inter 16px Full Black. No background fill, no shadow, no border — 20px vertical padding, 28-32px horizontal padding

### Editorial Intro Block
**Role:** Opening prose section above the card grid

Large left-aligned text block on the Paper Gray canvas, no card chrome. Begins with 'Hey there, I'm Chester 👋' at 60px Fraunces 300 in Ink Charcoal. Body sentences at 16px Inter 400, with strategic words bumped to weight 600 (Chester, digital garden, building, Mobbin, coffee, plants, climbing, reading, writing). 24px row gap between paragraphs. No box, no border — text floats on the substrate

### Project Tile (Image Card)
**Role:** Default unit in the masonry grid, links out to external project

Bone White card with 8px radius, 1px hairline border in Paper Gray. Full-bleed image (or screenshot) clipped to the card's top, 8px top radius. Below image: 16px padding block containing 'Projects · [Project Name]' caption at Inter 14px in Soft Graphite, and a 12×12 external-link arrow icon top-right in Pencil Gray. No drop shadow. Inset top + bottom borders using rgba(0,0,0,0.1) at 1px give a subtle ruled-paper edge

### Book Cover Tile
**Role:** Card variant for reading-shelf entries

Bone White card, 8px radius, 1px Paper Gray border. Left: book-cover image clipped to 4px radius. Right column: 16px Inter 600 title in Ink Charcoal, 'Donald A. Norman' at 16px Inter 400 in Soft Graphite, and an 'READ' pill badge floating at the right edge

### Accent Tag Pill
**Role:** Compact label badge on cards and metadata lines

9999px (pill) radius, horizontal padding 6-8px, vertical padding 2-4px. Inter 12-14px uppercase, letter-spacing 0.5px, weight 500. Available background fills: Highlight Mint, Highlight Butter, Highlight Sage. Text always Full Black for AAA contrast on the pastels. Floating, no border

### Hobby Feature Card
**Role:** Photo-forward card for hobbies (Coffee, Plants) with headline + descriptor

Tall Bone White card, 8px radius, 1px Paper Gray border. Top: full-bleed photograph at 8px top radius. Below: stacked text — a Highlight Butter or Highlight Mint tag pill, then a 30-36px Fraunces 300 headline in Ink Charcoal, then a Soft Graphite descriptor line at 14px Inter. 20px padding inside the text block

### Image Letterbox Card
**Role:** Photo entry with date and film stock caption (Camera section)

Bone White card, 8px radius. Image framed by Full Black letterbox bars top and bottom (typical 2.4:1 cinematic crop). Caption strip: 'Film:NeverBik KIRO 400' at Inter 12px in Pencil Gray, bottom-left of the letterbox

### Inline Word Emphasis
**Role:** Selective bolding of single words within body sentences

Within a 16px Inter 400 sentence, one or two words are bumped to weight 600 in Ink Charcoal to simulate hand-underlining. No underline, no highlight background, no italic — just a weight shift. Used for personal-noun and activity-noun emphasis (Chester, plants, climbing, writing)

### Ghost Link Arrow
**Role:** External-link affordance on every project tile

12×12 outlined arrow-up-right icon in Pencil Gray, absolutely positioned top-right of card with 8px inset. No background, no border, no hover state beyond color shift to Full Black

### Footer Social Row
**Role:** Bottom-of-page social links and CV

Inter 16px Full Black text links separated by 8-12px gaps, left-aligned or right-aligned in the page column. No background, no border, no icon — plain text only, matching the nav's restraint

## Do's and Don'ts

### Do
- Set every headline in Fraunces weight 300 at 30, 36, or 60px with line-height 1.0-1.25 and -0.03em tracking — never bold or semibold the serif
- Place every card surface on the Paper Gray (#e5e7eb) substrate using Bone White (#fafafa) as the fill; rely on this single color step instead of drop shadows for separation
- Use 8px radius for image cards, 4px radius for small UI controls, and 9999px for accent tag pills
- Bump single words inside Inter body sentences from 400 to 600 weight for emphasis — never use underline, italic, or color for the same purpose
- Reach for Highlight Mint (#daf5ae), Highlight Butter (#fde5a7), or Highlight Sage (#b7f2cc) as tag backgrounds with Full Black text — these are the only allowed chromatic fills on UI elements
- Use ui-monospace 14px with -0.025em tracking for any inline code or technical label so the mono block aligns with surrounding Inter
- Keep the nav and footer as transparent text rows on the Paper Gray canvas — no fills, no borders, no logos, no icons

### Don't
- Do not raise Fraunces above weight 300 — the whisper-weight serif is the defining choice and bolding it destroys the editorial voice
- Do not introduce drop shadows, gradient fills, or glow effects on standard content tiles — the only shadow is the soft 10% black blur on hero image cards and the 1px inset paper edge
- Do not use bright saturated brand colors for buttons, links, or CTAs — there is no CTA color in this system; actions are text links in Ink Charcoal
- Do not alternate dark and light sections or introduce a dark mode — the entire page is a single Paper Gray tone
- Do not add icon systems, illustrations, or 3D graphics; visuals are restricted to photographs, book covers, and screenshots inside Bone White cards
- Do not set body text above 16px or below 14px — the Inter scale is intentionally narrow to maintain the compact zine rhythm
- Do not use the two inline emphasis colors (Rust Underline, Navy Quotation) on more than one or two words per sentence — they are the most chromatic elements on the site and must remain rare

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Drafting Paper | `#e5e7eb` | Page substrate — everything sits on or is defined against this color |
| 1 | Bone White Card | `#fafafa` | Standard content card or project tile |
| 2 | Highlight Pill | `#daf5ae` | Accent tag surface floating on a card |

## Elevation

- **Project tile / image card:** `rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.1) 0px 4px 6px -4px`
- **Inset card border (paper-edge effect):** `rgba(0, 0, 0, 0.1) 0px 0px 0px 1px inset, rgba(0, 0, 0, 0.1) 0px -2px 0px 1px inset`

## Imagery

Imagery is photograph-first, not illustration-first. The site is photo-heavy in the masonry grid: book covers (studio-lit product shots against solid backgrounds), still-life photos (plants on shelves, climbing wall crops, phone screens), black-and-white film photography with visible grain, and product/app screenshots framed in white. Treatment is editorial — photos sit in their own Bone White cards with 8px radius, letterboxed where the aspect ratio demands, and captioned in 12px Inter beneath. There is no decorative illustration, no abstract gradient art, and no 3D rendering. Iconography is restricted to a single 12×12 outlined external-link arrow used to signal outbound cards; otherwise the only icons are emoji (👋 🌱 🪨) used inline in the intro prose, treating them as a typographic flourish rather than a graphic system.

## Layout

The page is a single, unbroken vertical scroll with a max-width of ~1200px centered on the Paper Gray canvas. The first viewport is the editorial intro: a full-width left-aligned prose block on the bare substrate, no card chrome, no hero image. Below the intro, the layout shifts into a multi-column masonry grid where tiles of varying heights (2x, 3x, 4x row spans) interlock — some tiles are pure text, others are full images, others are image-plus-metadata. The grid breathes with 12-24px gaps between tiles, and individual tiles alternate between 8px and 4px corner radii to keep the rhythm slightly irregular. There is no sticky header, no sidebar, and no mega-menu; the navigation is a single thin row at the very top. Sections do not alternate light/dark — the entire page is one continuous paper-gray tone, with individual tiles doing all the visual work through their Bone White surfaces and photographic content.

## Agent Prompt Guide

**Quick Color Reference**
- text: #000000 (primary body), #171717 (headlines/links), #404040 (secondary), #a3a3a3 (tertiary/icons)
- background: #e5e7eb (page), #fafafa (card)
- border: #e5e7eb (hairline), rgba(0,0,0,0.1) (inset paper edge)
- accent: #daf5ae, #fde5a7, #b7f2cc (tag pill backgrounds only)
- primary action: no distinct CTA color

**Example Component Prompts**
1. Build the editorial intro block: Paper Gray (#e5e7eb) canvas, no card chrome. 'Hey there, I'm Chester 👋' at 60px Fraunces weight 300, color #171717, letter-spacing -1.8px, line-height 1.0. Follow with 16px Inter 400 body in #000000, selectively bolding single words (Chester, digital garden, building, Mobbin, plants, climbing) to weight 600. 24px row gap between paragraphs.
2. Build a project tile card: Bone White (#fafafa) fill, 8px radius, 1px #e5e7eb hairline border plus the inset paper-edge shadow (rgba(0,0,0,0.1) 0px 0px 0px 1px inset, rgba(0,0,0,0.1) 0px -2px 0px 1px inset). Top: full-bleed project screenshot clipped to 8px top corners. Below: 20px padding, caption 'Projects · Design Spells' at 14px Inter 400 in #404040. Top-right 12×12 outlined arrow-up-right icon in #a3a3a3.
3. Build an accent tag pill: 9999px radius, 6px vertical and 8px horizontal padding, Highlight Mint (#daf5ae) background, 'READ' in Inter 12px weight 500 uppercase in #000000. No border, floats on the card surface.
4. Build a hobby feature card: tall Bone White tile, 8px radius, 1px #e5e7eb border. Full-bleed plant photograph at top with 8px top radius. Below: 20px padding, then a Highlight Butter (#fde5a7) pill with 'ARACEAE' text, then 'Philodendron hederaceum 'Micans'' at 36px Fraunces 300 in #171717, line-height 1.11, letter-spacing -1.08px.
5. Build the top nav bar: transparent background, no shadow, 20px vertical padding, 32px horizontal padding. Left: 'Chester' at 16px Inter 400 in #171717. Center row: Projects, Writing, Reading, Hobbies at 16px Inter 400 in #000000, 12px gaps. Right row: GitHub, Twitter, CV at 16px Inter 400 in #000000, 12px gaps.

## The Bolding-In-Prose Rule

The site's most distinctive content pattern is the selective bolding of single words inside otherwise regular-weight sentences — 'I like building things and I'm currently helping to build Mobbin', where 'building' and 'Mobbin' jump to weight 600. This is the equivalent of underlining a word with a pencil while reading. When generating prose for this system, always identify one or two carry-words per sentence (proper nouns, activity verbs, project names) and bump them to 600. Do not bold phrases, do not bold more than two words per sentence, and do not introduce any other emphasis mechanism (no underline, no italic, no color).

## Similar Brands

- **Maggie Appleton** — Same digital-garden-as-portfolio concept, same light-gray substrate with white tiles, and the same selective-bolding-within-prose emphasis pattern
- **Tom Critchlow** — Personal site with a low-saturation pastel palette, serif display type for editorial voice, and a masonry card grid of mixed content blocks
- **Are.na** — Quiet, almost print-like visual restraint with hairline borders, small radii, and chromatic restraint to a few pastel accent tones
- **Craig Mod** — Editorial-portfolio hybrid with a light-warm canvas, serif headlines treated as long-form reading rather than UI, and almost no decorative chrome
- **Coby Sherman / Coby's Garden** — Nearly identical digital-garden masonry layout, Paper-Gray-on-Bone-White surface treatment, and Fraunces-light display headlines

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-paper-gray: #e5e7eb;
  --color-bone-white: #fafafa;
  --color-full-black: #000000;
  --color-ink-charcoal: #171717;
  --color-soft-graphite: #404040;
  --color-pencil-gray: #a3a3a3;
  --color-highlight-mint: #daf5ae;
  --color-highlight-butter: #fde5a7;
  --color-highlight-sage: #b7f2cc;
  --color-rust-underline: #7c2d12;
  --color-navy-quotation: #0c4a6e;

  /* Typography — Font Families */
  --font-fraunces: 'Fraunces', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-ui-monospace: 'ui-monospace', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.43;
  --tracking-caption: -0.35px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.4px;
  --text-heading-sm: 30px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -0.9px;
  --text-heading: 36px;
  --leading-heading: 1.11;
  --tracking-heading: -1.08px;
  --text-display: 60px;
  --leading-display: 1;
  --tracking-display: -1.8px;

  /* Typography — Weights */
  --font-weight-light: 300;
  --font-weight-regular: 400;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-40: 40px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 24px;
  --card-padding: 20px;
  --element-gap: 8px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-full: 9999px;

  /* Named Radii */
  --radius-tags: 9999px;
  --radius-cards: 8px;
  --radius-images: 8px;
  --radius-buttons: 4px;

  /* Shadows */
  --shadow-subtle: rgba(0, 0, 0, 0.1) 0px 0px 0px 1px inset, rgba(0, 0, 0, 0.1) 0px -2px 0px 1px inset;
  --shadow-md: rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.1) 0px 4px 6px -4px;

  /* Surfaces */
  --surface-drafting-paper: #e5e7eb;
  --surface-bone-white-card: #fafafa;
  --surface-highlight-pill: #daf5ae;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-paper-gray: #e5e7eb;
  --color-bone-white: #fafafa;
  --color-full-black: #000000;
  --color-ink-charcoal: #171717;
  --color-soft-graphite: #404040;
  --color-pencil-gray: #a3a3a3;
  --color-highlight-mint: #daf5ae;
  --color-highlight-butter: #fde5a7;
  --color-highlight-sage: #b7f2cc;
  --color-rust-underline: #7c2d12;
  --color-navy-quotation: #0c4a6e;

  /* Typography */
  --font-fraunces: 'Fraunces', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-ui-monospace: 'ui-monospace', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.43;
  --tracking-caption: -0.35px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.4px;
  --text-heading-sm: 30px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -0.9px;
  --text-heading: 36px;
  --leading-heading: 1.11;
  --tracking-heading: -1.08px;
  --text-display: 60px;
  --leading-display: 1;
  --tracking-display: -1.8px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-40: 40px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-subtle: rgba(0, 0, 0, 0.1) 0px 0px 0px 1px inset, rgba(0, 0, 0, 0.1) 0px -2px 0px 1px inset;
  --shadow-md: rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.1) 0px 4px 6px -4px;
}
```
