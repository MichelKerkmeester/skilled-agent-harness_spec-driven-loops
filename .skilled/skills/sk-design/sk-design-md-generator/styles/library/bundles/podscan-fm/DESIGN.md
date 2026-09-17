# Podscan.fm — Style Reference
> Green-lit podcast radar on white paper — a quiet instrument panel where one emerald signal cuts through grayscale data.

**Theme:** light

Podscan.fm reads as a modern data-intelligence console on a crisp white canvas: monochrome foundation, one vivid emerald green as the single navigational north star, and a disciplined palette of categorical colors (violet, pink, blue, teal) used only to differentiate adjacent use-cases or pricing tiers. Typography is a system sans rendered tight — negative tracking at every size creates a compressed, data-display rhythm rather than editorial looseness. Components are flat, lightly bordered, rounded at 8–12px, and rely on hairline #e5e7eb dividers more than shadow for separation. Sentiment badges, colored icon disks, and tier-distinct CTA fills (black, green, violet) carry the color load, so a new page should feel mostly grayscale with green as the verb-action color and secondary hues appearing only as small functional punctuation.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Emerald Signal | `#059669` | `--color-emerald-signal` | Green action color for filled buttons, selected navigation states, and focused conversion moments. |
| Mint Pulse | `#10b981` | `--color-mint-pulse` | Secondary green for iconography, category tags, and decorative emphasis where a lighter hue is needed |
| Onyx Ink | `#18181b` | `--color-onyx-ink` | Primary text, dark CTA fill, logo wordmark, elevated headings — the near-black that anchors every screen |
| Pure Canvas | `#ffffff` | `--color-pure-canvas` | Page background, card surfaces, button text on dark fills, input fields |
| Fog | `#f4f4f5` | `--color-fog` | Subtle surface lift for muted cards, table headers, tag backgrounds |
| Slate Whisper | `#71717a` | `--color-slate-whisper` | Muted helper text, link color in body copy, caption-level metadata |
| Graphite | `#52525b` | `--color-graphite` | Secondary body text, table cell text, secondary nav items |
| Zinc Veil | `#a1a1aa` | `--color-zinc-veil` | Tertiary text, disabled controls, icon strokes at low contrast |
| Charcoal | `#3f3f46` | `--color-charcoal` | Strong secondary text, button label on light fills, table emphasis |
| Ash Border | `#e5e7eb` | `--color-ash-border` | Universal hairline border — the dominant structural divider between cards, inputs, table rows, and sections |
| Silver Trace | `#d4d4d8` | `--color-silver-trace` | Secondary border on links and lighter dividers |
| Violet Tier | `#9333ea` | `--color-violet-tier` | Advanced-plan CTA fill, Partnership/Discovery category icon, premium-tier accent — second tier-color signal |
| Indigo Spark | `#4f46e5` | `--color-indigo-spark` | Alternate violet for iconography and link emphasis where a cooler purple reads better |
| Pink Pulse | `#ec4899` | `--color-pink-pulse` | Audience Intelligence category icon, decorative accent strokes |
| Cobalt Signal | `#2563eb` | `--color-cobalt-signal` | API & Data Platform category icon, link emphasis in body copy |
| Sky Veil | `#60a5fa` | `--color-sky-veil` | Lighter blue for iconography and secondary accent strokes |
| Teal Trace | `#14b8a6` | `--color-teal-trace` | Iconography accent, decorative stroke on category visuals |
| Sprout Wash | `#d1fae5` | `--color-sprout-wash` | Green wash for highlight backgrounds, decorative bands, and soft emphasis behind content. Use as a supporting accent, not as a status color |
| Crimson Ink | `#b91c1c` | `--color-crimson-ink` | Red text accent for links, tags, and emphasized short phrases. Use as a supporting accent, not as a status color |
| Rose Blush | `#db2777` | `--color-rose-blush` | Red text accent for links, tags, and emphasized short phrases. Use as a supporting accent, not as a status color |
| Forest Verdant | `#16a34a` | `--color-forest-verdant` | Green text accent for links, tags, and emphasized short phrases. Use as a supporting accent, not as a status color |
| Marigold Spark | `#eab308` | `--color-marigold-spark` | Ideas nav marker, small highlight tokens, feature-flag dots |
| Mint Mist | `#ecfdf5` | `--color-mint-mist` | Primary page canvas and white card surfaces |
| Sky Mist | `#eff6ff` | `--color-sky-mist` | Soft blue-tint surface wash behind informational callouts |
| Lilac Mist | `#f3e8ff` | `--color-lilac-mist` | Soft violet-tint surface wash behind premium-tier highlights |

## Tokens — Typography

### Inter Tight — Display and heading family — 60px weight 700 for hero headlines, 36px weight 700 for section titles, 24–30px weight 600 for subheadings. The compressed Inter Tight cuts width at every size, giving headlines a dense, data-screen weight rather than airy editorial feel. The 60px display sits at near-unity line-height (1.00), so it functions as a single stacked statement. · `--font-inter-tight`
- **Substitute:** Inter Tight (closest free) → Inter, then system-ui sans-serif
- **Weights:** 400, 600, 700
- **Sizes:** 14, 20, 24, 30, 36, 60
- **Line height:** 1.00, 1.11, 1.20, 1.33, 1.40, 1.43
- **Letter spacing:** -0.029em at 14px (-0.41px), -0.025em at 20px (-0.5px), -0.020em at 24px (-0.48px), -0.017em at 30px (-0.51px), -0.013em at 36px (-0.47px), -0.011em at 60px (-0.66px)
- **Role:** Display and heading family — 60px weight 700 for hero headlines, 36px weight 700 for section titles, 24–30px weight 600 for subheadings. The compressed Inter Tight cuts width at every size, giving headlines a dense, data-screen weight rather than airy editorial feel. The 60px display sits at near-unity line-height (1.00), so it functions as a single stacked statement.

### ui-sans-serif (system stack) — Workhorse body and UI family — 16px/1.50 weight 400 for paragraphs, 14px/1.43 weight 500 for labels and button text, 12px/1.33 weight 500 for caption and metadata, 18–20px weight 600 for emphasized body. Weight 600 carries nav and in-text emphasis; 700 is reserved for short uppercase-style labels. Negative tracking applied at every size keeps the system reading tight and tabular even in running text. · `--font-ui-sans-serif-system-stack`
- **Substitute:** system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif
- **Weights:** 400, 500, 600, 700
- **Sizes:** 12, 14, 16, 18, 20, 30
- **Line height:** 1.20, 1.33, 1.38, 1.40, 1.43, 1.50, 1.56
- **Letter spacing:** -0.0330em, -0.0290em, -0.0250em, -0.0220em, -0.0200em, -0.0130em
- **Role:** Workhorse body and UI family — 16px/1.50 weight 400 for paragraphs, 14px/1.43 weight 500 for labels and button text, 12px/1.33 weight 500 for caption and metadata, 18–20px weight 600 for emphasized body. Weight 600 carries nav and in-text emphasis; 700 is reserved for short uppercase-style labels. Negative tracking applied at every size keeps the system reading tight and tabular even in running text.

### ui-monospace (system stack) — Inline code, transcript snippets, and tabular timestamps in feed cards — rendered at 12px with the same -0.033em tracking as UI text so monospace blocks sit flush with surrounding copy. · `--font-ui-monospace-system-stack`
- **Substitute:** ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace
- **Weights:** 400
- **Sizes:** 12
- **Line height:** 1.33
- **Letter spacing:** -0.0330em
- **Role:** Inline code, transcript snippets, and tabular timestamps in feed cards — rendered at 12px with the same -0.033em tracking as UI text so monospace blocks sit flush with surrounding copy.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.33 | -0.4px | `--text-caption` |
| body-sm | 14px | 1.43 | -0.41px | `--text-body-sm` |
| body | 16px | 1.5 | -0.4px | `--text-body` |
| subheading | 20px | 1.4 | -0.4px | `--text-subheading` |
| heading-sm | 24px | 1.33 | -0.48px | `--text-heading-sm` |
| heading | 30px | 1.2 | -0.39px | `--text-heading` |
| heading-lg | 36px | 1.11 | -0.47px | `--text-heading-lg` |
| display | 60px | 1 | -0.66px | `--text-display` |

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
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |
| 88 | 88px | `--spacing-88` |
| 112 | 112px | `--spacing-112` |
| 168 | 168px | `--spacing-168` |
| 216 | 216px | `--spacing-216` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 12px |
| pills | 9999px |
| badges | 9999px |
| inputs | 12px |
| buttons | 8px |
| largeCards | 16px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| subtle | `rgba(0, 0, 0, 0.05) 0px 1px 2px 0px` | `--shadow-subtle` |
| md | `rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.1)...` | `--shadow-md` |
| subtle-2 | `rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.1) 0p...` | `--shadow-subtle-2` |
| md-2 | `rgba(5, 150, 105, 0.2) 0px 10px 15px -3px, rgba(5, 150, 1...` | `--shadow-md-2` |
| xl | `rgba(0, 0, 0, 0.1) 0px 20px 25px -5px, rgba(0, 0, 0, 0.1)...` | `--shadow-xl` |
| xl-2 | `rgba(0, 0, 0, 0.25) 0px 25px 50px -12px` | `--shadow-xl-2` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 64px
- **Card padding:** 24px
- **Element gap:** 16px

## Components

### Primary Green CTA Button
**Role:** The dominant action verb — used for trial starts, monitor activations, and search submissions

Fill #059669, white text at 14px weight 600, padding 10px 20px, radius 8px, no border. On hover, gains a tinted green shadow at rgba(5,150,105,0.2) spread 15px. Sits with white text (not green text) — the dark-on-green contrast carries weight at 14px.

### Black Onyx CTA Button
**Role:** Secondary primary action — used in nav (Try Free) and as the Premium tier CTA

Fill #18181b, white text at 14px weight 600, padding 10px 20px, radius 8px. Functions as the neutral authority action when green is reserved for a higher-priority verb on the same screen.

### Violet Tier CTA Button
**Role:** Differentiates the Advanced/Enterprise pricing tier from other plans on the same page

Fill #9333ea, white text at 14px weight 600, padding 10px 20px, radius 8px. The single violet CTA on the pricing page — color itself communicates the tier above the price label.

### Ghost / Outline Button
**Role:** Secondary supporting action that pairs with a filled CTA on the same row

Fill #ffffff, 1px solid #e5e7eb border, text #18181b at 14px weight 600, padding 10px 20px, radius 8px. Used for 'See how it works' beside the green Start CTA.

### Navigation Bar
**Role:** Sticky top-level navigation on all pages

White background, 1px bottom border #e5e7eb, height 64px, horizontal padding 32px. Nav items at 14px weight 500 in #52525b, with the active/hover state at #18181b. Far-right contains a pill-shaped black 'Try Free' button with radius 9999px. Uses the subtle nav shadow 0px 1px 3px rgba(0,0,0,0.1) when sticky.

### Logo Wordmark Badge
**Role:** Brand mark in the top-left of the navigation

Pill-shaped container with #18181b fill, white 'podscan' wordmark, padding roughly 6px 14px, radius 9999px. The pill is the only dark element in the header besides the CTA button.

### Live Intelligence Feed Card
**Role:** The hero product surface — a real-time list of brand mentions, the system's primary value proof

White card, radius 12px, 1px #e5e7eb border, padding 16px, with an internal tab row at the top (Live Intelligence active, MCP for AI Agents and REST API inactive). Each row is 56–64px tall, contains a 32px square brand avatar, 2-line mention preview, timestamp at 12px in #71717a, and a sentiment badge aligned right. Tabs use a 2px emerald underline on the active tab.

### Sentiment Badge
**Role:** Color-coded classification chip on every feed row

Pill shape (radius 9999px), padding 2px 10px, 12px weight 500 text. Variants: Neutral — #f4f4f5 background, #52525b text; Positive — #d1fae5 background, #16a34a text; Negative — light rose background with #b91c1c text. Color is the only state differentiator — no icon inside.

### Hero Stat Line
**Role:** Triple-metric trust strip below the primary CTAs

Single horizontal row of three items separated by generous horizontal space, each item: a small 16px emerald green icon followed by a bold value (e.g. 4.6M+) in #18181b at 14px weight 600 and a muted descriptor in #52525b at 14px weight 400. No card or background — sits directly on the canvas.

### Use Case Card
**Role:** Top-of-funnel audience-segmentation cards (PR / Brand / Marketer)

White card, 1px #e5e7eb border, radius 8px, padding 20px. Left-aligned 24px emerald icon in a soft square, bold label at 14px weight 600 in #18181b, one-line descriptor at 13px in #71717a. Cards sit in a 3-column grid with 16px gaps.

### Database Search Bar
**Role:** Full-width search input for the episode database

Container is a single rounded input with radius 12px, 1px #e5e7eb border, padding 4px 4px 4px 16px. Inner text input is flush, 16px weight 400 in #18181b with placeholder in #a1a1aa. Trailing 36px square black submit button with white 'Search →' at 14px weight 600. Search-icon glyph sits inside the input at 16px in #71717a.

### Feature Category Card
**Role:** Four-card grid linking to the core product surfaces (Brand Monitoring, Partnership Discovery, API & Data, Audience Intelligence)

White card, 1px #e5e7eb border, radius 12px, padding 32px vertical / 24px horizontal, centered content. Top: 40px circular icon disk tinted in the category color (green, violet, blue, pink) with white glyph. Title at 18px weight 600 in #18181b below.

### Pricing Tier Card
**Role:** Three-tier pricing comparison surface

White card, radius 12px, 1px #e5e7eb border, padding 32px. Contains a category-tinted square icon (24px) top-left, tier name at 18px weight 600, large price at 36px weight 700 in #18181b with '/mo' at 14px in #71717a, billing-period subtext in #52525b. Feature list uses 14px weight 400 in #18181b with green check marks. The Professional card adds a 2px #059669 border and a 'Most Popular' emerald pill at the top-right edge.

### Most Popular Pill Badge
**Role:** Tier-selection indicator floating on the recommended plan

Emerald #059669 fill, white text at 12px weight 600, padding 4px 12px, radius 9999px, positioned overlapping the top border of the Professional pricing card.

### Text Input / Search Field
**Role:** Form input baseline for any text entry

1px #e5e7eb border, radius 12px, padding 12px 16px, 14px weight 400 text in #18181b, placeholder in #a1a1aa. On focus the border shifts to #059669 with a subtle green-tinted ring; no box-shadow otherwise.

## Do's and Don'ts

### Do
- Use #059669 as the single filled CTA color for the page's primary action verb; reserve Onyx #18181b for the secondary 'neutral' action and Violet #9333ea for enterprise-tier actions
- Set all body, subhead, and display text at negative letter-spacing between -0.4px and -0.66px — the tight tracking is what makes the system read as a data console rather than editorial
- Separate cards and panels with 1px #e5e7eb borders and 0–1px subtle shadows; reserve the rgba(0,0,0,0.1) 10-15px shadow for hover and the floating hero card only
- Differentiate categorical icons by hue (green = monitoring, violet = discovery, blue = API, pink = audience) and back them with 40px circular tinted disks from the Lilac/Mint/Sky Wash palette
- Keep page background at #ffffff and apply tinted washes (#ecfdf5, #eff6ff, #f3e8ff) only as 100px-ish callout blocks behind positive, info, or premium messaging
- Cap content at 1200px max-width with 32px gutter; use 64px vertical gap between major sections and 24px between card grid rows
- Use radius 9999px exclusively for pills, tags, badges, and the logo lockup — never for cards, inputs, or buttons

### Don't
- Don't introduce new saturated accent colors beyond the green/violet/blue/pink/teal set — the system has exactly five categorical hues and they are already mapped to specific roles
- Don't use 700-weight for anything other than the display hero (60px), large section titles (36px), and price numerals — heavy weight on body text breaks the console feel
- Don't apply gradients, drop shadows beyond the listed tokens, or blur effects — the design is deliberately flat and border-driven
- Don't use warm grays or off-white backgrounds; the canvas must be pure #ffffff and the only tinted surfaces are the three semantic washes
- Don't set border-radius above 16px on cards or inputs; the 12px max is what gives components their crisp, dashboard-like profile
- Don't place more than one emerald CTA on the same row; if multiple actions are needed, the secondary must be Ghost (white fill, #e5e7eb border) or Black (Onyx fill)
- Don't add decorative imagery, illustrations, or background patterns to the main page sections — the system communicates entirely through type, color-coded icons, and feed-row data

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Pure Canvas | `#ffffff` | Default page background — the system sits on white, never off-white or warm cream |
| 1 | Fog Plate | `#f4f4f5` | First surface lift for table headers, muted background panels, and tag clusters |
| 2 | Mint Wash | `#ecfdf5` | Tinted success-positive callout surfaces, paired with green text and Sprout Wash badges |
| 2 | Sky Wash | `#eff6ff` | Tinted informational callout surfaces paired with blue accents |
| 2 | Lilac Wash | `#f3e8ff` | Tinted premium-tier callout surfaces paired with violet accents |

## Elevation

- **Subtle Card / Inline Element:** `0px 1px 2px 0px rgba(0, 0, 0, 0.05)`
- **Raised Card / Button Hover:** `0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -4px rgba(0, 0, 0, 0.1)`
- **Nav Bar / Sticky Header:** `0px 1px 3px 0px rgba(0, 0, 0, 0.1), 0px 1px 2px -1px rgba(0, 0, 0, 0.1)`
- **Primary Green CTA Hover:** `0px 10px 15px -3px rgba(5, 150, 105, 0.2), 0px 4px 6px -4px rgba(5, 150, 105, 0.2)`
- **Floating Hero Card:** `0px 25px 50px -12px rgba(0, 0, 0, 0.25)`

## Imagery

The site is imagery-light by design — no hero photograph, no product screenshots, no decorative illustration. The visual centerpieces are the Live Intelligence feed rows (real brand logos cropped to 32px squares inside cards) and a small set of 24–40px category icons rendered as flat filled glyphs inside circular tinted disks. Icon style is flat, single-weight, mono-glyph with no outlines; categorical color (green/violet/blue/pink) does the differentiation work. The only atmospheric element is the floating hero card which sits on a soft 25px-50px black-tinted shadow, giving the product preview a slight 'lifted' feel against the otherwise flat canvas. The aesthetic is best described as a screenshot-first interface — the data IS the hero, not a stylized image of the data.

## Layout

Max-width 1200px centered layout with 32px outer gutters. The hero follows a centered-stacked text pattern: 60px display headline, 18px subhead, side-by-side primary + ghost CTAs, a single trust line, then a horizontal stat row. Below the hero, a full-bleed product surface (the Live Intelligence card) is the first thing the user sees — it overlaps the visual flow between hero and feature blocks. Section rhythm is a single alternating pattern of white-background sections separated by 64px vertical gaps; no dark/light band alternation. Content arrangement is centered-stacks for hero and pricing, 3-column equal grids for use-case and pricing cards, 4-column grid for feature category cards, and 2-column image+text alternation is not used — Podscan stays single-column or symmetric-grid throughout. The database search bar is a centered contained block (roughly 800px wide) sitting on a faint bordered card. Navigation is a single sticky 64px top bar with a right-aligned black pill CTA; there is no sidebar or mega-menu.

## Agent Prompt Guide

## Quick Color Reference
- Background: #ffffff
- Surface lift: #f4f4f5
- Text primary: #18181b
- Text muted: #71717a
- Border: #e5e7eb
- Accent / brand: #059669 (emerald — also the primary action)
- Secondary action: #18181b (black onyx)
- Tier action: #9333ea (violet, Advanced plan only)
- primary action: #059669 (filled action)

## Example Component Prompts

1. **Primary CTA Button** — Fill #059669, white text at 14px weight 600 ui-sans-serif, padding 10px 20px, radius 8px. On hover, drop shadow 0px 10px 15px -3px rgba(5,150,105,0.2). Used for 'Start free trial', 'Start monitoring free', 'Search'.

2. **Hero Headline Block** — White canvas. Headline 60px Inter Tight weight 700 #18181b, letter-spacing -0.66px, line-height 1.0, centered, max-width 720px. Subhead 18px ui-sans-serif weight 400 #52525b, line-height 1.5, max-width 560px. Below: 14px trust line in #71717a.

3. **Live Intelligence Feed Card** — White surface, radius 12px, 1px #e5e7eb border, padding 16px. Top tab row: 'Live Intelligence' active with 2px #059669 underline, two inactive tabs at 14px weight 500 #52525b. Feed rows: 32px square brand avatar, two-line mention at 14px weight 400 #18181b, 12px timestamp in #71717a, and a sentiment pill badge aligned right (Neutral #f4f4f5/#52525b, Positive #d1fae5/#16a34a, Negative light-rose/#b91c1c). 56px row height with 1px #f4f4f5 internal divider.

4. **Pricing Tier Card** — White card, radius 12px, padding 32px, 1px #e5e7eb border. Top-left: 24px category icon in a 40px tinted square. Tier name 18px weight 600 #18181b. Price 36px weight 700 #18181b with '/mo' 14px #71717a. Feature list 14px #18181b with green #059669 check marks. The recommended plan adds a 2px #059669 border and a 'Most Popular' emerald pill (#059669 fill, white 12px weight 600, radius 9999px) overlapping the top edge.

5. **Feature Category Card (4-up grid)** — White card, 1px #e5e7eb border, radius 12px, padding 32px top/bottom and 24px sides, centered. 40px circular icon disk in category tint (green #d1fae5, violet #f3e8ff, blue #dbeafe, pink #fce7f3) with a 20px white glyph. Title 18px weight 600 #18181b. Grid: 4 equal columns at 1200px max-width with 16px gaps.

## Similar Brands

- **Brand24** — Same social/listening intelligence layout pattern — centered hero, live feed preview card, three-tier pricing with a green Most-Popular highlight
- **Mention** — Identical emerald-as-CTA color discipline on a white canvas, with 3-column use-case cards and a border-driven flat component system
- **Linear** — Same Inter Tight headline treatment with tight -0.5px tracking, dark-on-light primary buttons paired with ghost secondaries, and a hairline-border card aesthetic
- **Pinecone** — Same data-intelligence console rhythm — white canvas, single green primary action, categorical icon colors, and pricing tiers distinguished by CTA hue

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-emerald-signal: #059669;
  --color-mint-pulse: #10b981;
  --color-onyx-ink: #18181b;
  --color-pure-canvas: #ffffff;
  --color-fog: #f4f4f5;
  --color-slate-whisper: #71717a;
  --color-graphite: #52525b;
  --color-zinc-veil: #a1a1aa;
  --color-charcoal: #3f3f46;
  --color-ash-border: #e5e7eb;
  --color-silver-trace: #d4d4d8;
  --color-violet-tier: #9333ea;
  --color-indigo-spark: #4f46e5;
  --color-pink-pulse: #ec4899;
  --color-cobalt-signal: #2563eb;
  --color-sky-veil: #60a5fa;
  --color-teal-trace: #14b8a6;
  --color-sprout-wash: #d1fae5;
  --color-crimson-ink: #b91c1c;
  --color-rose-blush: #db2777;
  --color-forest-verdant: #16a34a;
  --color-marigold-spark: #eab308;
  --color-mint-mist: #ecfdf5;
  --color-sky-mist: #eff6ff;
  --color-lilac-mist: #f3e8ff;

  /* Typography — Font Families */
  --font-inter-tight: 'Inter Tight', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-ui-sans-serif-system-stack: 'ui-sans-serif (system stack)', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-ui-monospace-system-stack: 'ui-monospace (system stack)', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.33;
  --tracking-caption: -0.4px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.43;
  --tracking-body-sm: -0.41px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.4px;
  --text-subheading: 20px;
  --leading-subheading: 1.4;
  --tracking-subheading: -0.4px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.33;
  --tracking-heading-sm: -0.48px;
  --text-heading: 30px;
  --leading-heading: 1.2;
  --tracking-heading: -0.39px;
  --text-heading-lg: 36px;
  --leading-heading-lg: 1.11;
  --tracking-heading-lg: -0.47px;
  --text-display: 60px;
  --leading-display: 1;
  --tracking-display: -0.66px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

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
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-88: 88px;
  --spacing-112: 112px;
  --spacing-168: 168px;
  --spacing-216: 216px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 64px;
  --card-padding: 24px;
  --element-gap: 16px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-full: 9999px;

  /* Named Radii */
  --radius-cards: 12px;
  --radius-pills: 9999px;
  --radius-badges: 9999px;
  --radius-inputs: 12px;
  --radius-buttons: 8px;
  --radius-largecards: 16px;

  /* Shadows */
  --shadow-subtle: rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
  --shadow-md: rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.1) 0px 4px 6px -4px;
  --shadow-subtle-2: rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.1) 0px 1px 2px -1px;
  --shadow-md-2: rgba(5, 150, 105, 0.2) 0px 10px 15px -3px, rgba(5, 150, 105, 0.2) 0px 4px 6px -4px;
  --shadow-xl: rgba(0, 0, 0, 0.1) 0px 20px 25px -5px, rgba(0, 0, 0, 0.1) 0px 8px 10px -6px;
  --shadow-xl-2: rgba(0, 0, 0, 0.25) 0px 25px 50px -12px;

  /* Surfaces */
  --surface-pure-canvas: #ffffff;
  --surface-fog-plate: #f4f4f5;
  --surface-mint-wash: #ecfdf5;
  --surface-sky-wash: #eff6ff;
  --surface-lilac-wash: #f3e8ff;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-emerald-signal: #059669;
  --color-mint-pulse: #10b981;
  --color-onyx-ink: #18181b;
  --color-pure-canvas: #ffffff;
  --color-fog: #f4f4f5;
  --color-slate-whisper: #71717a;
  --color-graphite: #52525b;
  --color-zinc-veil: #a1a1aa;
  --color-charcoal: #3f3f46;
  --color-ash-border: #e5e7eb;
  --color-silver-trace: #d4d4d8;
  --color-violet-tier: #9333ea;
  --color-indigo-spark: #4f46e5;
  --color-pink-pulse: #ec4899;
  --color-cobalt-signal: #2563eb;
  --color-sky-veil: #60a5fa;
  --color-teal-trace: #14b8a6;
  --color-sprout-wash: #d1fae5;
  --color-crimson-ink: #b91c1c;
  --color-rose-blush: #db2777;
  --color-forest-verdant: #16a34a;
  --color-marigold-spark: #eab308;
  --color-mint-mist: #ecfdf5;
  --color-sky-mist: #eff6ff;
  --color-lilac-mist: #f3e8ff;

  /* Typography */
  --font-inter-tight: 'Inter Tight', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-ui-sans-serif-system-stack: 'ui-sans-serif (system stack)', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-ui-monospace-system-stack: 'ui-monospace (system stack)', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.33;
  --tracking-caption: -0.4px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.43;
  --tracking-body-sm: -0.41px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.4px;
  --text-subheading: 20px;
  --leading-subheading: 1.4;
  --tracking-subheading: -0.4px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.33;
  --tracking-heading-sm: -0.48px;
  --text-heading: 30px;
  --leading-heading: 1.2;
  --tracking-heading: -0.39px;
  --text-heading-lg: 36px;
  --leading-heading-lg: 1.11;
  --tracking-heading-lg: -0.47px;
  --text-display: 60px;
  --leading-display: 1;
  --tracking-display: -0.66px;

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
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-88: 88px;
  --spacing-112: 112px;
  --spacing-168: 168px;
  --spacing-216: 216px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-subtle: rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
  --shadow-md: rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.1) 0px 4px 6px -4px;
  --shadow-subtle-2: rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.1) 0px 1px 2px -1px;
  --shadow-md-2: rgba(5, 150, 105, 0.2) 0px 10px 15px -3px, rgba(5, 150, 105, 0.2) 0px 4px 6px -4px;
  --shadow-xl: rgba(0, 0, 0, 0.1) 0px 20px 25px -5px, rgba(0, 0, 0, 0.1) 0px 8px 10px -6px;
  --shadow-xl-2: rgba(0, 0, 0, 0.25) 0px 25px 50px -12px;
}
```
