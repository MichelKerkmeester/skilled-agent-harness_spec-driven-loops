# Dovetail — Style Reference
> Cream-paper editorial magazine on a sunlit table

**Theme:** light

Dovetail reads like a printed editorial spread digitized — warm cream canvases, near-black ink, and a single buttery yellow accent that functions as a mood rather than a brand color. Typography is confidently oversized (72px display headlines) yet tightly tracked, giving the site a literary weight without heaviness. The signature visual device is the pill-shaped capability tag (91px radius), used as a stacking motif on the right rail. Components are flat: filled near-black buttons, ghost text links, and 16px-radius photo cards. Imagery alternates between detailed monochrome editorial illustration and full-color photography, with no shadows, gradients, or decorative effects — separation happens through whitespace and hairline borders.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Butter Cream | `#f9e5b1` | `--color-butter-cream` | Hero and section canvas — the warm cream that defines the entire brand atmosphere |
| Ink Black | `#1d1e21` | `--color-ink-black` | Primary text, filled buttons, and the dark surface that anchors contrast — softer than pure black, warm against the cream |
| True Black | `#000000` | `--color-true-black` | Illustration strokes, icon fills, and SVG detail work — only the darkest graphic elements |
| Warm Bone | `#fef9f3` | `--color-warm-bone` | Card surfaces, secondary text on dark, and the lighter off-white that sits above the cream canvas |
| Ash Gray | `#e5e7eb` | `--color-ash-gray` | Hairline borders, image outlines, subtle dividers, and neutral tag fills — the structural neutral that separates every section |

## Tokens — Typography

### Lausanne — Single typeface for everything. Weight 400 carries body and nav; weight 600 is the workhorse for subheadings and button labels; weight 700 dominates display headlines at 48–72px. Letter-spacing tightens at display sizes (negative tracking) and opens slightly on small body text — a classic editorial rhythm. Its grotesque geometry with humanist warmth is what gives the site its literary feel; a neutral like Inter or Söhne could approximate it. · `--font-lausanne`
- **Substitute:** Inter, Söhne, or Neue Haas Grotesk
- **Weights:** 400, 600, 700
- **Sizes:** 20px, 22px, 28px, 32px, 48px, 72px
- **Line height:** 1.00–1.50
- **Letter spacing:** -0.0100em at 72px, -0.0050em at 48px, 0.0050em at 22–28px, 0.0070–0.0100em at 20px and below
- **Role:** Single typeface for everything. Weight 400 carries body and nav; weight 600 is the workhorse for subheadings and button labels; weight 700 dominates display headlines at 48–72px. Letter-spacing tightens at display sizes (negative tracking) and opens slightly on small body text — a classic editorial rhythm. Its grotesque geometry with humanist warmth is what gives the site its literary feel; a neutral like Inter or Söhne could approximate it.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| body-sm | 20px | 28 | 0.14px | `--text-body-sm` |
| body | 22px | 30 | 0.11px | `--text-body` |
| subheading | 28px | 36 | — | `--text-subheading` |
| heading | 32px | 40 | — | `--text-heading` |
| heading-lg | 48px | 56 | -0.24px | `--text-heading-lg` |
| display | 72px | 72 | -0.72px | `--text-display` |

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
| 72 | 72px | `--spacing-72` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 16px |
| buttons | 9999px |
| navItems | 9999px |
| pillTags | 91px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 64-96px
- **Card padding:** 28-32px
- **Element gap:** 24px

## Components

### Filled Pill Button
**Role:** Primary call-to-action (e.g., 'Get in touch')

Near-black (#1d1e21) fill, white text (#fef9f3) at 16px weight 600, 9999px border-radius, 14px vertical padding × 16–20px horizontal padding. Sits as a compact, dark punctuation mark on the cream canvas.

### Ghost Text Link
**Role:** Secondary navigation or inline links (e.g., 'About us ↗', 'Learn more')

Ink Black text (#1d1e21) at 16–18px weight 400, no border, no fill. Often paired with an arrow glyph (↗) in 600 weight. Underline only on hover.

### Capability Pill Tag
**Role:** Stacking service/discipline labels (Capital, + Design, + Tech, + Strategy, + Finance)

Warm Bone (#fef9f3) fill with Ash Gray (#e5e7eb) 1px border, 91px border-radius, 20–24px vertical padding × 24–32px horizontal padding. Text at 22–28px weight 600. The extreme radius makes them read as soft lozenges that overlap visually when stacked.

### Editorial Illustration Panel
**Role:** Decorative hero or section illustration

Monochrome line-and-fill illustration in True Black (#000000) on the cream canvas. Detailed human figures, organic line work, no color. Functions as a visual counterweight to the typography on the right side of the hero.

### Photo Card
**Role:** Portfolio or team imagery in a grid

Color photograph with 16px border-radius, 1px Ash Gray (#e5e7eb) border, 32px internal padding context. No shadow — separation comes from the hairline border against the cream background.

### Section Divider
**Role:** Horizontal rule between major content sections

1px solid Ash Gray (#e5e7eb) line, full content-width, no decorative ornament. Provides the only visual break between sections on lighter pages.

### Brand Mark Glyph
**Role:** Logomark in nav (custom 'Ж' or ligature symbol)

Pure black (#1d1e21) filled geometric glyph, ~32–40px tall, positioned at far right of nav. Acts as a visual signature — the one purely symbolic element in the system.

### Wordmark Header
**Role:** Site title in nav (e.g., 'Dovetail')

Lausanne 700 at 32–48px, Ink Black, sits at far left of nav. Functions as a home link. Same treatment across all pages.

### Two-Column Split Section
**Role:** Primary content layout pattern

Max-width 1200px, 50/50 split. Left column: heading + body text + optional ghost link. Right column: stacked pill tags, illustration, or photo. Vertical alignment: top-aligned, with generous 32–48px gap between columns.

### Tagline Pill Cluster
**Role:** Vertical stack of capability tags on right rail

4–5 pill tags (91px radius) stacked with 8–12px row gap, right-aligned. Creates a visual list that reads as a word cloud of disciplines.

### Inline Tag Label
**Role:** Section identifiers like 'Our portfolio'

Ink Black text at 16–18px weight 600, no decoration, sits directly above section headlines as a one-word category marker.

## Do's and Don'ts

### Do
- Use #f9e5b1 (Butter Cream) as the dominant canvas for hero and feature sections — it is the brand's atmosphere, not just a background color
- Set display headlines at 48–72px in Lausanne 700 with negative letter-spacing (-0.0050 to -0.0100em) for editorial weight
- Use the 91px pill radius exclusively for capability/discipline tags; never apply it to buttons or cards
- Stack pill tags with 8–12px gaps to create the signature vertical column on the right rail of split sections
- Separate sections with 1px Ash Gray (#e5e7eb) hairlines rather than shadows or background changes
- Keep CTAs to a single dark filled pill — the button is punctuation, not a banner
- Pair text-only ghost links with an arrow glyph (↗) in weight 600 to signal off-page navigation
- Set body text at 20–22px with slightly positive tracking (0.0050–0.0070em) for the printed-page reading rhythm

### Don't
- Never use shadows or gradients — this system is completely flat; depth comes only from layering cream over cream and hairline borders
- Don't introduce additional accent colors — the entire system runs on Butter Cream, Ink Black, and Warm Bone plus two neutrals
- Don't apply 9999px (pill) radius to cards or image containers — pills are for interactive elements and tags only, cards stay at 16px
- Don't use display weight (700) for body copy — reserve it for headlines 28px and above; body sits at 400
- Never set body text below 18px — the editorial scale starts generous and stays generous
- Don't center-align long-form body text — left-align everything below 32px for readability
- Avoid overlapping decorative elements or z-axis layering — the layout is strictly horizontal and two-dimensional
- Don't add icon badges, avatars, or decorative dots — the system is typographically driven with imagery as the only visual accent

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Butter Cream Canvas | `#f9e5b1` | Hero and feature section backgrounds — the brand's signature warm surface |
| 1 | Warm Bone | `#fef9f3` | Card surfaces, pill tag fills, and lighter secondary sections |
| 2 | Ash Gray | `#e5e7eb` | Hairline borders, subtle dividers, and neutral structural elements |
| 3 | Ink Black | `#1d1e21` | Darkest surface — filled buttons, footer accents, and high-contrast panels |

## Imagery

Two distinct visual modes alternate across the site. The first is detailed monochrome editorial illustration — fine-line human figures, organic shapes, filled-black elements — rendered in True Black on the cream canvas, functioning as a literary counterweight to large headlines. The second is full-color documentary-style photography (team portraits, workspace overheads) presented in 16px-radius cards with hairline borders. Both treatments are full-bleed within their containers and never overlap. The illustration carries the hero; photography carries the portfolio and about sections. No 3D renders, no abstract gradients, no product mockups — visuals are either drawn or shot, never generated.

## Layout

Max-width 1200px centered content on a full-bleed Butter Cream canvas. The nav is a single horizontal bar: wordmark left, text links center-right, brand glyph far right, with generous 32px horizontal padding. The hero is a full-viewport-height split — oversized headline left at 72px, editorial illustration right, dark CTA pill below the headline. Subsequent sections alternate between two-column splits (text-left / visual-right) and centered stacked headlines, each separated by a hairline divider rather than background changes. Card grids are simple 2-column with 24px gutters. The overall rhythm is slow and generous: 64–96px between sections, 32–48px between elements, no sticky navigation, no sidebar. The page reads top-to-bottom as a continuous editorial spread.

## Agent Prompt Guide

**Quick Color Reference**
- Text: #1d1e21
- Background (hero/sections): #f9e5b1
- Surface (cards/light sections): #fef9f3
- Border: #e5e7eb
- Accent: #f9e5b1 (butter cream itself, used as canvas not as a fill)
- primary action: #1d1e21 (filled action)

**Example Component Prompts**

1. **Hero Section**: Butter Cream (#f9e5b1) full-bleed background. Wordmark 'Dovetail' at 48px Lausanne 700, #1d1e21, top-left. Nav links ('About us', 'Portfolio') in 16px Lausanne 400, #1d1e21, top-right. Display headline at 72px Lausanne 700, #1d1e21, letter-spacing -0.72px, placed in the left half with 32px from the left edge. Dark filled pill button below the headline: #1d1e21 background, #fef9f3 text, 9999px radius, 14px 20px padding. Monochrome editorial illustration in #000000 on the right half.

2. **Capability Tag Stack**: Vertical column of pill tags, right-aligned. Each tag: #fef9f3 fill, 1px #e5e7eb border, 91px radius, 20px 32px padding, text in 28px Lausanne 600 #1d1e21. Tags: 'Capital', '+ Design', '+ Tech', '+ Strategy', '+ Finance'. 8px row gap between tags.

3. **Two-Column Split Section**: Max-width 1200px, 50/50 layout. Left: 32px Lausanne 600 #1d1e21 heading, then 20px Lausanne 400 #1d1e21 body, then ghost link with arrow glyph at 18px. Right: #fef9f3 card with 16px radius and 1px #e5e7eb border, containing a color photograph at full card width with 0 internal padding (image fills card).

4. **Photo Card Grid**: Two cards side by side, 24px gap. Each card: 16px radius, 1px #e5e7eb border, no shadow. Image fills the card edge-to-edge. Caption below in 18px Lausanne 400 #1d1e21 with 16px top margin.

5. **Dark Filled Button**: #1d1e21 background, #fef9f3 text at 16px Lausanne 600, 9999px border-radius, 14px vertical × 20px horizontal padding. No border, no shadow. Used once per viewport as the primary action.

## Typography Philosophy

Lausanne carries the entire system — no secondary typeface, no monospace, no serif accent. The discipline of a single typeface with three weights (400/600/700) forces hierarchy to come from size and spacing alone, which is what gives the site its editorial calm. Display weights (700) are reserved for headlines 28px and above. The 72px display is the maximum ceiling — nothing goes larger. Body text starts at 20px, which is generous for web and reinforces the printed-page reading rhythm. Letter-spacing tightens at large sizes and opens at small sizes, following classical typographic convention rather than a flat uniform value.

## Similar Brands

- **Klasse14** — Same warm cream-and-black editorial palette with a single accent-free canvas and oversized confident headlines
- **Aether Capital** — Similar near-black text on warm off-white with hairline borders and no shadows — the investment-firm-as-editorial-spread approach
- **Open Store** — Cream canvas, monochrome illustration paired with photography, and pill-shaped stacked capability tags as a signature motif
- **Antler** — Same two-column editorial layout with oversized serif-adjacent sans headlines and a single warm neutral canvas color
- **Northzone** — Light cream backgrounds, near-black ink, generous whitespace, and the same flat zero-shadow component treatment

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-butter-cream: #f9e5b1;
  --color-ink-black: #1d1e21;
  --color-true-black: #000000;
  --color-warm-bone: #fef9f3;
  --color-ash-gray: #e5e7eb;

  /* Typography — Font Families */
  --font-lausanne: 'Lausanne', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-body-sm: 20px;
  --leading-body-sm: 28;
  --tracking-body-sm: 0.14px;
  --text-body: 22px;
  --leading-body: 30;
  --tracking-body: 0.11px;
  --text-subheading: 28px;
  --leading-subheading: 36;
  --text-heading: 32px;
  --leading-heading: 40;
  --text-heading-lg: 48px;
  --leading-heading-lg: 56;
  --tracking-heading-lg: -0.24px;
  --text-display: 72px;
  --leading-display: 72;
  --tracking-display: -0.72px;

  /* Typography — Weights */
  --font-weight-regular: 400;
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
  --spacing-72: 72px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 64-96px;
  --card-padding: 28-32px;
  --element-gap: 24px;

  /* Border Radius */
  --radius-2xl: 16px;
  --radius-3xl: 24px;
  --radius-full: 91px;
  --radius-full-2: 9999px;

  /* Named Radii */
  --radius-cards: 16px;
  --radius-buttons: 9999px;
  --radius-navitems: 9999px;
  --radius-pilltags: 91px;

  /* Surfaces */
  --surface-butter-cream-canvas: #f9e5b1;
  --surface-warm-bone: #fef9f3;
  --surface-ash-gray: #e5e7eb;
  --surface-ink-black: #1d1e21;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-butter-cream: #f9e5b1;
  --color-ink-black: #1d1e21;
  --color-true-black: #000000;
  --color-warm-bone: #fef9f3;
  --color-ash-gray: #e5e7eb;

  /* Typography */
  --font-lausanne: 'Lausanne', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-body-sm: 20px;
  --leading-body-sm: 28;
  --tracking-body-sm: 0.14px;
  --text-body: 22px;
  --leading-body: 30;
  --tracking-body: 0.11px;
  --text-subheading: 28px;
  --leading-subheading: 36;
  --text-heading: 32px;
  --leading-heading: 40;
  --text-heading-lg: 48px;
  --leading-heading-lg: 56;
  --tracking-heading-lg: -0.24px;
  --text-display: 72px;
  --leading-display: 72;
  --tracking-display: -0.72px;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-72: 72px;

  /* Border Radius */
  --radius-2xl: 16px;
  --radius-3xl: 24px;
  --radius-full: 91px;
  --radius-full-2: 9999px;
}
```
