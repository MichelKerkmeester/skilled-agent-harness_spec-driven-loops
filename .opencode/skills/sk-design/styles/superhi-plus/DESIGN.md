# SuperHi Plus — Style Reference
> Cobalt blueprint scattered with emoji marbles. The page lives half in electric blue, half in ice white, swapping sides as you scroll.

**Theme:** dark

SuperHi Plus uses a split-screen cobalt-and-ice language: one half of every section is saturated electric blue, the other is near-white, and the two panels swap roles as you scroll. Typography is a single-weight neo-grotesque display face at enormous scale (up to 85px) — the design speaks in one voice, never shouting or whispering, just stating. Decorative 3D emoji marbles anchor the light panels as visual texture while flat content lives on the blue. Components are chunky and tactile: 1px inset borders replace shadows, pill radii (50–72px) sit next to sharp 16px cards, and arrow-prefixed text labels function as navigation. The system is deliberately unornamented — no gradients, no drop shadows, no color tints — relying on the binary blue/white tension to create rhythm.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Cobalt Voltage | `#0033e5` | `--color-cobalt-voltage` | Primary surface, page background, filled action buttons, heading text, link color, and active borders. The structural anchor of the system — every dark panel lives here |
| Ice White | `#f0f7ff` | `--color-ice-white` | Light surface, card backgrounds on blue sections, heading and body text on blue panels, hairline borders, ghost button outlines. Counter-surface to Cobalt Voltage |
| Cobalt Mist | `#527ceb` | `--color-cobalt-mist` | Soft blue tint used sparingly for secondary button fills and tonal accents where Cobalt Voltage would be too heavy. Falls below WCAG on Ice White |
| Pitch | `#000000` | `--color-pitch` | SVG icon fills, nav element fills, and decorative graphic anchors. Used as the dark accent inside light panels |

## Tokens — Typography

### Haas Grot Disp Web — Single neo-grotesque display face used at all scales — from 16px body to 85px hero. The radical choice is weight 400 only: no bold, no light. The system relies on size and the blue/white contrast to create hierarchy, not weight. This flattens typographic texture into a single confident voice that reads as declarative rather than persuasive. · `--font-haas-grot-disp-web`
- **Substitute:** Söhne (paid) or Inter (free) at weight 400. Space Grotesk is a close free alternative for the slightly geometric character of the display cut.
- **Weights:** 400
- **Sizes:** 16px, 18px, 24px, 32px, 42px, 56px, 85px
- **Line height:** 1.50 / 1.33 / 1.25 / 1.20 / 1.14 / 1.13 / 1.14
- **Letter spacing:** normal (0px) at all sizes
- **Role:** Single neo-grotesque display face used at all scales — from 16px body to 85px hero. The radical choice is weight 400 only: no bold, no light. The system relies on size and the blue/white contrast to create hierarchy, not weight. This flattens typographic texture into a single confident voice that reads as declarative rather than persuasive.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| body-sm | 16px | 1.5 | — | `--text-body-sm` |
| body | 18px | 1.33 | — | `--text-body` |
| subheading | 24px | 1.25 | — | `--text-subheading` |
| heading-sm | 32px | 1.2 | — | `--text-heading-sm` |
| heading | 42px | 1.14 | — | `--text-heading` |
| heading-lg | 56px | 1.13 | — | `--text-heading-lg` |
| display | 85px | 1.14 | — | `--text-display` |

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
| 96 | 96px | `--spacing-96` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 50px |
| cards | 16px |
| inputs | 2px |
| buttons | 16px |
| nav-buttons | 50px |
| pill-buttons | 72px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| subtle | `rgb(0, 51, 229) 0px 0px 0px 1px inset` | `--shadow-subtle` |
| subtle-2 | `rgb(240, 247, 255) 0px 0px 0px 1px inset` | `--shadow-subtle-2` |

### Layout

- **Page max-width:** 1440px
- **Section gap:** 64px
- **Card padding:** 24px
- **Element gap:** 16px

## Components

### Arrow Navigation Button
**Role:** Primary in-page navigation between content sections (e.g. 'Funding', 'Support', 'Tools')

Large text-only button at 42px, weight 400, with a horizontal arrow (→) prefix. Background is Ice White on Cobalt Voltage or vice versa. Radius 16px. Padding 24px top/bottom, 24px left/right. No fill, no border — the arrow + size carries the affordance.

### Outlined Pill Button
**Role:** Secondary call-to-action and section links (e.g. 'View calculator')

Pill-shaped button with radius 50px. 1px border in Ice White on Cobalt Voltage background. Text at 18px weight 400, Ice White. Padding 14px vertical, 24px horizontal. Inserts a 1px Cobalt Voltage inset border as inner ring for double-line effect.

### Numbered List Item
**Role:** Sequential feature explanations in body content

Circled numeral (1, 2, 3) in Ice White outline at 24px, followed by a heading at 32px weight 400 in Ice White, then body copy at 18px in Ice White. Stack gap 16px. Numeral acts as section marker, not decorative bullet.

### Stat Tile
**Role:** Three-column highlight strip showing funding, timeline, tools

3D-rendered object icon (coin, hourglass, pencil) centered above a label and value. Icon at roughly 64px. Label at 18px Ice White. Value at 24px Ice White weight 400. Three tiles laid out in equal columns on Cobalt Voltage surface with 32px gaps.

### Content Card on Cobalt
**Role:** White-surface card placed on blue background for grouped content

Ice White background, 16px radius, 24px padding. 1px border in Ice White at 60% or the same blue. Used for feature groupings, ownership info blocks, and calculator callouts.

### Inline Text Link
**Role:** Contextual reference links within body copy

Cobalt Voltage text on Ice White surface or Ice White on Cobalt Voltage, underlined, 18px weight 400. No color change on hover in static design — relies on underline for affordance.

### Hero Split Panel
**Role:** First-fold composition establishing the blue/white dichotomy

Two-column 50/50 split. Left panel: Ice White background, large display headline (56–85px) in Cobalt Voltage left-aligned, decorative 3D emoji marbles filling the lower portion. Right panel: Cobalt Voltage background, body copy in Ice White right-aligned. Panels extend full-bleed to viewport edges.

### Section Heading Block
**Role:** Transitional headers between content bands

Heading at 42–56px weight 400 in Cobalt Voltage or Ice White depending on which surface it sits on. No eyebrow text, no subhead — the heading stands alone with 24px space below before body copy.

### Input Field
**Role:** Form inputs in calculator or application flows

Sharp 2px radius. Border 1px in Ice White. Background transparent on Cobalt Voltage. Padding 3px top/bottom. Text at 16px Ice White. No focus ring detected in data — uses inset border as state indicator.

### Brand Wordmark
**Role:** Site logo in header and footer

'SuperHi' in Haas Grot Disp Web at roughly 24px weight 400, with a circular smiley-face mark (○ with eyes and mouth) as the dot on the 'i'. Mark scales with text size. Always Ice White on Cobalt or Cobalt on Ice White.

### 3D Emoji Marble Cluster
**Role:** Decorative illustration filling light-panel negative space

Pile of 3D-rendered spheres in Cobalt Voltage and Ice White tones, each printed with an emoji face (😊, 😎, ❌, 🤪, 🙂). Balls range from 60–120px diameter, overlapping organically. Provides texture and personality on otherwise empty white space. No photographic people — the marbles ARE the social proof.

## Do's and Don'ts

### Do
- Use the two-color binary (Cobalt Voltage #0033e5 and Ice White #f0f7ff) as the only two surface options. Every panel belongs to one camp or the other — never blend.
- Keep all typography at weight 400. Let size (16 → 85px) and color contrast create hierarchy, never bold or light cuts.
- Pair 1px inset borders (in Cobalt Voltage or Ice White) as the universal depth indicator on buttons and cards — never use drop shadows.
- Use the arrow prefix (→) on all navigation text — it is the site's signature affordance for clickable text items.
- Let the 3D emoji marble cluster fill the negative space of any light panel. Empty Ice White is a design failure.
- Space sections at 64px vertical rhythm with 24px internal card padding. 16px is the floor for element gaps.
- Scale display headlines aggressively — 56px and 85px are the normal range, not the exception.

### Don't
- Never introduce a third color, gradient, or tinted neutral. The system is binary by design.
- Never set type in bold (600+), italic, or light (300) — weight 400 is the only voice.
- Never add drop shadows, blurs, or ambient elevation effects. Use 1px inset borders or nothing.
- Never use Cobalt Mist #527ceb for text on Ice White — it fails contrast (3.6:1). Reserve it for fills only.
- Never use a font with high x-height or humanist character (like Open Sans or Lato). The neo-grotesque flatness is the signature.
- Never place dense paragraphs in columns narrower than 480px — the single-weight face needs generous measure.
- Never add decorative dividers, rules, or ornamental graphics between sections. The blue/white alternation IS the divider.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Cobalt Voltage | `#0033e5` | Dominant page background, hero panels, content panels |
| 1 | Ice White | `#f0f7ff` | Counter-surface panel, card backgrounds on cobalt sections |
| 2 | Cobalt Mist | `#527ceb` | Tonal blue tint for secondary fills and soft accents |

## Elevation

The system deliberately replaces drop shadows with 1px inset borders in Cobalt Voltage or Ice White. Buttons and cards achieve depth through border-inset ring alone — no blur, no offset, no ambient occlusion. This keeps every element flat and graphic, matching the typographic restraint.

## Imagery

Imagery is exclusively 3D-rendered emoji-face spheres in Cobalt Voltage and Ice White tones, clustered as organic piles on light panels. No photography, no human portraits, no flat illustration. The marbles are the brand's only visual content — they function as social proof, personality marker, and negative-space filler simultaneously. Icons in feature blocks are also 3D-rendered objects (coin, hourglass, pencil) rather than flat line icons. All graphics have soft volumetric lighting and occupy generous space.

## Layout

Full-bleed split-screen layout. Every section is divided into two equal-width panels (50/50) that swap colors — one Ice White with imagery or display type, one Cobalt Voltage with body content. Panels extend edge-to-edge with no gutters or max-width constraints; page max-width is 1440px for content within panels. Section rhythm alternates which side is which (left=blue/right=white, then left=white/right=blue). Navigation is a minimal top bar with the wordmark. Within blue panels, content stacks vertically with 16–24px gaps; within white panels, the emoji marble cluster anchors the lower 60% while type lives in the upper portion. No card grids, no pricing tables, no sidebar.

## Agent Prompt Guide

**Quick Color Reference**
- text: #f0f7ff (on blue) or #0033e5 (on white)
- background: #0033e5 (primary) or #f0f7ff (secondary)
- border: 1px solid #f0f7ff (on blue) or 1px solid #0033e5 (on white)
- accent/icon: #0033e5 or #f0f7ff (binary, no tints)
- decorative fill: #000000 (SVG icons only)
- primary action: #0033e5 (filled action)

**Example Component Prompts**
1. Build a hero split panel: full-bleed 50/50. Left = #f0f7ff background, headline at 85px sohne-var weight 400 in #0033e5, emoji marble cluster filling lower 60%. Right = #0033e5 background, body copy at 18px weight 400 in #f0f7ff, right-aligned.
2. Create an arrow navigation button: 42px sohne-var weight 400 in #0033e5 on #f0f7ff background, prefix with → character, 16px radius, 24px padding all sides. No border, no fill change on hover — the arrow is the affordance.
3. Build a numbered feature list: circled numeral (1, 2, 3) at 24px in #f0f7ff outline on #0033e5 background, followed by 32px heading in #f0f7ff weight 400, then 18px body in #f0f7ff. 16px stack gap between items.
4. Create a stat tile: 3D coin icon (~64px) in #f0f7ff on #0033e5 background, label at 18px #f0f7ff, value at 24px #f0f7ff weight 400. Three tiles in equal columns with 32px gaps.
5. Build an outlined pill button: 50px radius, 1px border in #f0f7ff on #0033e5 background, 18px text in #f0f7ff weight 400, 14px vertical and 24px horizontal padding, inner 1px inset border in #0033e5 for double-ring effect.

## Typographic Discipline

The system uses a single neo-grotesque display face (Haas Grot Disp Web) at weight 400 only. No bold, no light, no italic. Hierarchy is achieved exclusively through size (16/18/24/32/42/56/85px) and color inversion. Line heights compress at scale: 1.50 at 16px drops to 1.13 at 85px. Letter-spacing stays at 0px throughout — the display face already has tight, even tracking. This is a radical flattening choice: the page reads as one confident voice rather than a hierarchy of emphases. An AI agent should never reach for a second font family or a different weight.

## Similar Brands

- **Linear** — Same single-weight neo-grotesque typography, flat surfaces with no shadows, and binary color logic for hierarchy
- **Vercel** — Identical split-panel composition pattern and aggressive display-type scale (50–80px range) with weight 400 only
- **Stripe** — Clean neo-grotesque type at 400 with tight line-heights and vibrant brand color used as full panel, not just accent
- **Pitch** — Same playful 3D-illustration approach to brand personality and reliance on 1px borders instead of drop shadows for depth
- **Arc Browser** — Equal commitment to a single saturated brand color flooding the canvas and a single-typeface-everywhere system

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-cobalt-voltage: #0033e5;
  --color-ice-white: #f0f7ff;
  --color-cobalt-mist: #527ceb;
  --color-pitch: #000000;

  /* Typography — Font Families */
  --font-haas-grot-disp-web: 'Haas Grot Disp Web', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-body-sm: 16px;
  --leading-body-sm: 1.5;
  --text-body: 18px;
  --leading-body: 1.33;
  --text-subheading: 24px;
  --leading-subheading: 1.25;
  --text-heading-sm: 32px;
  --leading-heading-sm: 1.2;
  --text-heading: 42px;
  --leading-heading: 1.14;
  --text-heading-lg: 56px;
  --leading-heading-lg: 1.13;
  --text-display: 85px;
  --leading-display: 1.14;

  /* Typography — Weights */
  --font-weight-regular: 400;

  /* Spacing */
  --spacing-unit: 8px;
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-96: 96px;

  /* Layout */
  --page-max-width: 1440px;
  --section-gap: 64px;
  --card-padding: 24px;
  --element-gap: 16px;

  /* Border Radius */
  --radius-sm: 2.4px;
  --radius-2xl: 16px;
  --radius-3xl: 24px;
  --radius-full: 50px;
  --radius-full-2: 55px;
  --radius-full-3: 72px;
  --radius-full-4: 120px;

  /* Named Radii */
  --radius-tags: 50px;
  --radius-cards: 16px;
  --radius-inputs: 2px;
  --radius-buttons: 16px;
  --radius-nav-buttons: 50px;
  --radius-pill-buttons: 72px;

  /* Shadows */
  --shadow-subtle: rgb(0, 51, 229) 0px 0px 0px 1px inset;
  --shadow-subtle-2: rgb(240, 247, 255) 0px 0px 0px 1px inset;

  /* Surfaces */
  --surface-cobalt-voltage: #0033e5;
  --surface-ice-white: #f0f7ff;
  --surface-cobalt-mist: #527ceb;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-cobalt-voltage: #0033e5;
  --color-ice-white: #f0f7ff;
  --color-cobalt-mist: #527ceb;
  --color-pitch: #000000;

  /* Typography */
  --font-haas-grot-disp-web: 'Haas Grot Disp Web', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-body-sm: 16px;
  --leading-body-sm: 1.5;
  --text-body: 18px;
  --leading-body: 1.33;
  --text-subheading: 24px;
  --leading-subheading: 1.25;
  --text-heading-sm: 32px;
  --leading-heading-sm: 1.2;
  --text-heading: 42px;
  --leading-heading: 1.14;
  --text-heading-lg: 56px;
  --leading-heading-lg: 1.13;
  --text-display: 85px;
  --leading-display: 1.14;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-96: 96px;

  /* Border Radius */
  --radius-sm: 2.4px;
  --radius-2xl: 16px;
  --radius-3xl: 24px;
  --radius-full: 50px;
  --radius-full-2: 55px;
  --radius-full-3: 72px;
  --radius-full-4: 120px;

  /* Shadows */
  --shadow-subtle: rgb(0, 51, 229) 0px 0px 0px 1px inset;
  --shadow-subtle-2: rgb(240, 247, 255) 0px 0px 0px 1px inset;
}
```
