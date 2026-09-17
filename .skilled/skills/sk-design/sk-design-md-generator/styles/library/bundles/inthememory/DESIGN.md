# Inthememory — Style Reference
> Architectural blueprint on white marble with a single warm spark. A quiet, editorial data room where deep teal ink and pill-shaped controls float over chalk-white surfaces, broken only by a single orange flare.

**Theme:** light

Inthememory presents a crisp editorial-meets-product surface: white canvas, deep ink-teal typography, and restrained warm-orange punctuation for moments of energy. Cards ride a light airy gray (#f1f7f9) with hairline borders, while pill-shaped controls (100px radius) and isometric line illustrations give the system a tactile, almost stationery-like warmth. Color is functional and rare — the electric blue (#0c67ff) is reserved for announcement bars and focus states, the orange (#fa4e1d) for hero iconography and occasional card backgrounds, and the entire chrome stays monochrome to let data and copy lead. Typography is custom Graphik at two weights only, creating a disciplined two-voice system where weight 500 earns emphasis and weight 400 carries everything else.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Ink Teal | `#102126` | `--color-ink-teal` | Primary text, borders, filled buttons, iconography — the structural backbone of the system. Its near-black teal reads as authoritative without the harshness of pure black |
| Slate Veil | `#3d5761` | `--color-slate-veil` | Secondary text, subtle borders — bridges body copy and muted UI chrome without competing with the primary ink |
| Fog Gray | `#677b82` | `--color-fog-gray` | Tertiary text, disabled states, low-emphasis labels — the quietest neutral that still maintains readability against white |
| Chalk White | `#ffffff` | `--color-chalk-white` | Page canvas, card surfaces, button text on dark fills — the dominant surface that lets the dark ink and accent colors carry the visual weight |
| Pale Mist | `#f1f7f9` | `--color-pale-mist` | Card backgrounds, section washes, subtle surface elevation — a barely-tinted cool gray that lifts cards off the white canvas without warmth |
| Hairline Gray | `#e9eef0` | `--color-hairline-gray` | Dividers, borders, input outlines — the thinnest structural line color, used where a 1px edge needs to exist without drawing attention |
| Ember Orange | `#fa4e1d` | `--color-ember-orange` | Orange wash for highlight backgrounds, decorative bands, and soft emphasis behind content. Do not promote it to the primary CTA color |
| Sunset Coral | `#fb6338` | `--color-sunset-coral` | Orange wash for highlight backgrounds, decorative bands, and soft emphasis behind content. Do not promote it to the primary CTA color |
| Signal Blue | `#0c67ff` | `--color-signal-blue` | Violet wash for highlight backgrounds, decorative bands, and soft emphasis behind content. Do not promote it to the primary CTA color |
| Info Indigo | `#0519d5` | `--color-info-indigo` | Violet state accent for badges, validation surfaces, and short status labels. Do not promote it to the primary CTA color |
| Soft Sky | `#e4eeff` | `--color-soft-sky` | Info badge backgrounds, subtle blue washes — the pastel counterpoint to Info Indigo, used when a blue element needs a tinted surface rather than a solid fill |

## Tokens — Typography

### Graphik — Single-family system. Weight 500 carries all emphasis (headings, nav, button labels, card titles) while weight 400 handles body, descriptions, and supporting text. The two-weight discipline creates a binary voice: 500 announces, 400 explains. The tight line-height ratio on display sizes (1.10 at 56px) gives headlines a compact, editorial density rather than airy marketing sprawl. · `--font-graphik`
- **Substitute:** Inter, Geist, Satoshi
- **Weights:** 400, 500
- **Sizes:** 12px, 14px, 16px, 18px, 20px, 40px, 56px
- **Line height:** 1.00, 1.10, 1.18, 1.20, 1.33, 1.50, 1.70
- **Letter spacing:** normal at all sizes — the font's natural metrics carry the rhythm
- **Role:** Single-family system. Weight 500 carries all emphasis (headings, nav, button labels, card titles) while weight 400 handles body, descriptions, and supporting text. The two-weight discipline creates a binary voice: 500 announces, 400 explains. The tight line-height ratio on display sizes (1.10 at 56px) gives headlines a compact, editorial density rather than airy marketing sprawl.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.5 | — | `--text-caption` |
| body-sm | 14px | 1.7 | — | `--text-body-sm` |
| body | 16px | 1.5 | — | `--text-body` |
| subheading | 18px | 1.33 | — | `--text-subheading` |
| heading-sm | 20px | 1.2 | — | `--text-heading-sm` |
| stats | 40px | 1.18 | — | `--text-stats` |
| display | 56px | 1.1 | — | `--text-display` |

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
| 96 | 96px | `--spacing-96` |
| 128 | 128px | `--spacing-128` |
| 200 | 200px | `--spacing-200` |
| 224 | 224px | `--spacing-224` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 12px |
| links | 20px |
| badges | 12px |
| inputs | 12px |
| buttons | 100px |

### Layout

- **Page max-width:** 1280px
- **Section gap:** 80px
- **Card padding:** 24px
- **Element gap:** 24px

## Components

### Pill Primary Button
**Role:** Main call-to-action button for the highest-priority action on any surface.

Filled with #102126 (Ink Teal), white text in Graphik 500 at 16px, 100px border-radius for full pill shape, padding 12px 24px. Contains a small circular icon (16px, white) to the right of the label, separated by 8px gap. The dark fill against white canvas creates a solid anchor that other elements defer to.

### Outline Pill Button
**Role:** Secondary action or alternative path button.

Transparent fill with 1px border in #102126, #102126 text, Graphik 500 at 16px, 100px radius, 12px 24px padding. Mirrors the primary pill geometry but uses a hairline border to reduce visual weight while maintaining the same click target.

### Announcement Bar
**Role:** Site-wide promotional or update banner at the very top of every page.

Full-bleed #0c67ff (Signal Blue) background, white text in Graphik 400 at 14px, centered content with inline pill-shaped tags (#ffffff background, #102126 text, 12px radius). Includes a close (×) button on the right. The only place this blue appears at full saturation on a large surface.

### Top Navigation
**Role:** Primary site navigation and brand identity header.

White background, 64px height, 1px bottom border in #e9eef0. Logo (Graphik 500, 20px, #102126) left-aligned. Nav links in Graphik 400 at 14px, #102126, with 24px gap between items. A small circular #0c67ff badge with white numeral appears on the 'Careers' link. A globe icon and dark pill 'Book a demo' button anchor the right side.

### Feature Card
**Role:** Individual capability or product feature card in the features section.

White background, 1px border in #e9eef0, 12px border-radius, 24px padding. Contains a full-width isometric illustration at the top (200px height area), followed by a title in Graphik 500 at 20px, #102126, and description in Graphik 400 at 14px, #3d5761. Cards sit in a horizontal scrollable row with 16px gap between them.

### Tab Toggle
**Role:** Segment control for switching between audience views (e.g., Retailers vs Brands).

Two-state pill toggle: inactive tab is transparent with #3d5761 text; active tab has a #f1f7f9 background and #102126 text. 20px border-radius, 8px 16px padding, Graphik 500 at 14px. The active state's pale background creates a subtle inset effect.

### Stats Block
**Role:** Quantitative proof points displayed in a horizontal row.

Large number in Graphik 500 at 40px, #102126, followed by a 2-3 line description in Graphik 400 at 14px, #677b82. No background or border — relies on whitespace and size contrast. The 40px numerals are the only mid-scale type between body and display, creating a clear statistical register.

### Carousel Arrow
**Role:** Navigation control for horizontal scrolling content rows.

Circular 40px button with #102126 fill, white chevron icon, positioned at the vertical center of the card row. Overlaps the content edge to signal scrollability. Appears on both left and right sides of scrollable card sections.

### Info Badge
**Role:** Small status or category tag for labeling content.

12px border-radius, 8px 12px padding. Background #e4eeff (Soft Sky), text #0519d5 (Info Indigo) in Graphik 500 at 12px. The pastel-on-deep-blue combination is the only semantic color pairing in the system, reserved for information classification.

### Section Header
**Role:** Eyebrow label above a major section title.

Graphik 400 at 14px, #677b82, positioned 6px above the main heading. The muted gray creates a whisper-quiet category label that doesn't compete with the section title below.

### Isometric Illustration
**Role:** Decorative line-art graphics that visualize product capabilities.

Thin 1.5px stroke illustrations in #102126 on white card backgrounds, with selective warm fills (#fa4e1d or #fb6338) on 1-2 key objects per illustration. Isometric perspective at 30° angles. No shadows or gradients — pure line work with minimal color blocking. Style is architectural and precise, matching the editorial typography voice.

### Hero Headline
**Role:** Primary page-level headline with inline decorative icons.

Graphik 400 at 56px, #102126, line-height 1.10. Contains 1-2 inline circular icon replacements for words: a blue #0c67ff circle with a white diamond replaces a concept word, an orange #fa4e1d circle with a white arrow replaces another, and the word 'data' sits inside a pill-shaped outline border (1px #102126 stroke, 100px radius). The mixed-media approach turns the headline into a visual composition.

### Featured Surface Card
**Role:** Accent card with warm background for highlighting key content.

Background #fb6338 (Sunset Coral), 12px border-radius, 24px padding. White text throughout: Graphik 500 at 20px for title, Graphik 400 at 14px for description. Used sparingly — the warm surface is a deliberate interruption in the cool palette to draw the eye to a specific feature or testimonial.

## Do's and Don'ts

### Do
- Use 100px border-radius for all buttons, nav items, and interactive pill controls to maintain the consistent tactile geometry
- Reserve #fa4e1d (Ember Orange) for hero iconography and decorative moments only — never for large background fields or body text
- Apply Graphik 500 exclusively for emphasis (headings, labels, button text, card titles) and Graphik 400 for everything else to preserve the two-voice discipline
- Use 1px borders in #e9eef0 for card edges and dividers rather than shadows — the system relies on hairlines and surface color shifts for separation
- Keep the palette monochrome on structural elements (nav, cards, body text) and let chromatic color appear only as functional punctuation
- Set display type at 56px with 1.10 line-height for editorial density rather than the more common 1.2+ ratio that creates airy marketing headlines
- Place isometric line illustrations at the top of feature cards with 200px+ height to let the architectural style breathe

### Don't
- Don't use shadows or elevation effects on cards — the system separates surfaces with hairline borders and subtle background shifts (#f1f7f9, #e4eeff), never with drop shadows
- Don't introduce additional font weights beyond 400 and 500 — the binary voice is the typographic signature
- Don't apply #0c67ff (Signal Blue) to body text, borders, or non-interactive elements — it's reserved for announcement bars, focus states, and active indicators
- Don't use sharp corners (0px radius) on any interactive element — everything from buttons to cards carries a radius of 12px or 100px
- Don't combine warm orange and electric blue in the same component — they are separate accent registers, not co-equal brand colors
- Don't add gradients, textures, or background patterns to the white canvas — the surface must remain clean and architectural
- Don't use font-size values between 20px and 40px for body content — the type scale jumps deliberately from 20px to 40px to maintain the editorial register gap

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#ffffff` | Base page background — the dominant surface across all pages |
| 1 | Card Surface | `#f1f7f9` | Elevated cards, section washes, subtle surface differentiation from the white canvas |
| 2 | Info Wash | `#e4eeff` | Info badge backgrounds, very light blue tinted surfaces for semantic content |
| 3 | Warm Accent | `#fb6338` | Featured card surfaces that need to break the cool palette and draw the eye |

## Elevation

The system deliberately avoids drop shadows as an elevation strategy. Surface separation is achieved entirely through: (1) hairline 1px borders in #e9eef0 for card edges, (2) background color shifts from #ffffff to #f1f7f9 to #e4eeff for tiered surfaces, and (3) the warm #fb6338 for featured/elevated content. This creates a flat, editorial, almost printed feel — like architectural plans on paper rather than a glass-morphism digital product. The absence of shadows is a signature choice, not an oversight.

## Imagery

The visual language is dominated by custom isometric line illustrations rendered in #102126 with selective warm fills (#fa4e1d, #fb6338) on 1-2 key objects per scene. These illustrations depict retail environments — store shelves, supply chains, merchandising layouts — at a 30° isometric angle with thin 1.5px strokes and no shading. The style is precise, architectural, and slightly technical, matching the data-intelligence product positioning. Photography is absent; the illustrations carry all explanatory visual weight. Icons are minimal: simple line or filled shapes in #102126, with occasional white icons on the dark pill buttons. The overall density is text-dominant with illustrations serving as visual anchors at the top of content cards.

## Layout

The page follows a max-width 1280px centered container with generous 80px section gaps creating clear vertical breathing room. The hero is a full-width white band with a centered headline (56px, max-width ~800px) and a single dark pill CTA below. Below the hero, sections alternate between white and #f1f7f9 backgrounds to create band-based rhythm. Feature content is organized in horizontal scrollable card rows (4-5 cards visible, with carousel arrows at the edges) rather than wrapping grids. Stats appear in a clean 4-column row with no dividers between them — relying on whitespace alone. The navigation is a fixed top bar (64px) with a full-width announcement bar above it. Content arrangement is consistently centered or left-aligned — no asymmetric or overlapping layouts. The overall density is spacious and editorial, with each section getting its own full viewport-height band to maintain a calm, unhurried reading pace.

## Agent Prompt Guide

## Quick Color Reference
- Text: #102126 (Ink Teal)
- Background: #ffffff (Chalk White)
- Border: #e9eef0 (Hairline Gray)
- Accent: #fa4e1d (Ember Orange)
- Interactive: #0c67ff (Signal Blue)
- primary action: #102126 (filled action)

## Example Component Prompts

1. **Hero Section**: Full-width white background. Centered headline at 56px Graphik 400, #102126, line-height 1.10. Include a 48px #0c67ff circle with a white diamond icon inline as a word replacement, and a 48px #fa4e1d circle with a white arrow icon as another word replacement. Wrap one key word in a 100px-radius outline border (1px #102126). Subtext at 18px Graphik 400, #3d5761, max-width 560px centered. Dark pill CTA below: #102126 fill, white text at 16px Graphik 500, 100px radius, 12px 24px padding, with a 16px white circular arrow icon to the right.

2. **Feature Card Row**: White background section. Section header in Graphik 400 at 14px #677b82 above a 40px Graphik 500 #102126 title. Tab toggle in top-right: two pills with 20px radius, active state has #f1f7f9 background and #102126 text, inactive is transparent with #3d5761 text. Below: horizontal row of 4 cards, each with 1px #e9eef0 border, 12px radius, 24px padding. Each card has a 180px-tall isometric line illustration in #102126 with one #fa4e1d accent fill, then a 20px Graphik 500 #102126 title, then 14px Graphik 400 #3d5761 description. Carousel arrows (40px circles, #102126 fill, white chevrons) at vertical center on both sides.

3. **Stats Section**: #f1f7f9 background. Section title in Graphik 500 at 40px #102126 on the left. Four stats in a row: each stat is a 40px Graphik 500 #102126 number above a 14px Graphik 400 #677b82 description, 24px gap between number and text, 80px gap between stats. No borders or dividers between stats.

4. **Navigation Bar**: 64px height, white background, 1px bottom border in #e9eef0. Logo (20px Graphik 500 #102126) left. Nav items in 14px Graphik 400 #102126 with 24px gap. One item has a small 20px #0c67ff circle badge with a white numeral. Right side: 16px globe icon in #102126, then a pill button (#102126 fill, white text 14px Graphik 500, 100px radius, 10px 20px padding) with a small white circular arrow icon.

5. **Info Badge**: 12px border-radius, 8px horizontal and 4px vertical padding. Background #e4eeff, text #0519d5 in Graphik 500 at 12px. Use for status labels or category tags that need semantic color coding.

## Isometric Illustration Style

All product and feature illustrations follow a strict isometric system: 30° angle projection, 1.5px stroke weight in #102126, no fills except for 1-2 accent objects per scene using #fa4e1d or #fb6338. No shadows, no gradients, no textures. The illustrations depict retail contexts — store shelves, supply chains, shopping experiences, data flows — at a consistent scale and detail level. The line-art precision matches the editorial typography, creating a cohesive system that feels more like an architectural firm's visual identity than a typical SaaS product page.

## Similar Brands

- **Linear** — Same disciplined two-weight typography, pill-shaped controls with full rounding, and a monochrome-plus-single-accent color strategy where color appears only as functional punctuation
- **Vercel** — Identical editorial approach: large quiet headlines on white canvas, hairline borders instead of shadows, and a cool-neutral palette with rare warm accent moments
- **Retool** — Same pill-button geometry (100px radius) and the practice of letting product illustrations carry the visual storytelling rather than photography or decorative gradients
- **Pigment** — Similar isometric illustration style for product features and the same approach of using warm accent colors sparingly against a predominantly cool-white interface
- **Pitch** — Shared editorial typography discipline with tight line-heights on display sizes, white-canvas-first design philosophy, and the use of inline icons within headlines as visual punctuation

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-ink-teal: #102126;
  --color-slate-veil: #3d5761;
  --color-fog-gray: #677b82;
  --color-chalk-white: #ffffff;
  --color-pale-mist: #f1f7f9;
  --color-hairline-gray: #e9eef0;
  --color-ember-orange: #fa4e1d;
  --color-sunset-coral: #fb6338;
  --color-signal-blue: #0c67ff;
  --color-info-indigo: #0519d5;
  --color-soft-sky: #e4eeff;

  /* Typography — Font Families */
  --font-graphik: 'Graphik', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --text-body-sm: 14px;
  --leading-body-sm: 1.7;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 18px;
  --leading-subheading: 1.33;
  --text-heading-sm: 20px;
  --leading-heading-sm: 1.2;
  --text-stats: 40px;
  --leading-stats: 1.18;
  --text-display: 56px;
  --leading-display: 1.1;

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
  --spacing-96: 96px;
  --spacing-128: 128px;
  --spacing-200: 200px;
  --spacing-224: 224px;

  /* Layout */
  --page-max-width: 1280px;
  --section-gap: 80px;
  --card-padding: 24px;
  --element-gap: 24px;

  /* Border Radius */
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-full: 100px;

  /* Named Radii */
  --radius-cards: 12px;
  --radius-links: 20px;
  --radius-badges: 12px;
  --radius-inputs: 12px;
  --radius-buttons: 100px;

  /* Surfaces */
  --surface-canvas: #ffffff;
  --surface-card-surface: #f1f7f9;
  --surface-info-wash: #e4eeff;
  --surface-warm-accent: #fb6338;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-ink-teal: #102126;
  --color-slate-veil: #3d5761;
  --color-fog-gray: #677b82;
  --color-chalk-white: #ffffff;
  --color-pale-mist: #f1f7f9;
  --color-hairline-gray: #e9eef0;
  --color-ember-orange: #fa4e1d;
  --color-sunset-coral: #fb6338;
  --color-signal-blue: #0c67ff;
  --color-info-indigo: #0519d5;
  --color-soft-sky: #e4eeff;

  /* Typography */
  --font-graphik: 'Graphik', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --text-body-sm: 14px;
  --leading-body-sm: 1.7;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 18px;
  --leading-subheading: 1.33;
  --text-heading-sm: 20px;
  --leading-heading-sm: 1.2;
  --text-stats: 40px;
  --leading-stats: 1.18;
  --text-display: 56px;
  --leading-display: 1.1;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-96: 96px;
  --spacing-128: 128px;
  --spacing-200: 200px;
  --spacing-224: 224px;

  /* Border Radius */
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-full: 100px;
}
```
