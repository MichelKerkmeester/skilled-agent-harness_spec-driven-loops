# Extract — Style Reference
> Editorial monolith on gallery paper

**Theme:** light

Extract operates as an editorial gallery space: a white canvas interrupted by one pastel mint wash, a single monumental wordmark, and confident body type. The visual system is almost entirely achromatic — near-black ink on white paper — with #e7feda mint appearing only as section-level atmospheric color, never as a UI accent or button fill. Hierarchy is built through extreme typographic scale contrast (104px display vs 19px body) rather than color, weight, or decoration. Components are flat and thin: hairline borders, ~9px radii, no shadows, no gradients. The navigation is a floating pill that hovers over content, reinforcing the gallery metaphor — visitors walk through curated rooms rather than scrolling a page.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Gallery White | `#ffffff` | `--color-gallery-white` | Neutral form states, badge text, and quiet UI feedback where color should stay understated. Do not promote it to the primary CTA color |
| Ink Black | `#070707` | `--color-ink-black` | Primary text, hairline borders, filled buttons, nav text — the structural linework of the entire system; Dark surface for project cards and editorial spreads — the inverse of the canvas, used to make featured work feel like a framed plate |
| Spearmint Wash | `#e7feda` | `--color-spearmint-wash` | Green wash for highlight backgrounds, decorative bands, and soft emphasis behind content. Do not promote it to the primary CTA color |

## Tokens — Typography

### Feature Deck — Display and section-heading face used exclusively for monumental wordmark treatments. The 104px 'Extract' lockup and 44px subheadings carry the entire brand voice through scale alone — no other display serif or grotesque is needed. · `--font-feature-deck`
- **Substitute:** Bricolage Grotesque Display, Archivo Black, or GT Walsheim Bold
- **Weights:** 400
- **Sizes:** 44px, 104px
- **Line height:** 1.25, 1.50
- **Role:** Display and section-heading face used exclusively for monumental wordmark treatments. The 104px 'Extract' lockup and 44px subheadings carry the entire brand voice through scale alone — no other display serif or grotesque is needed.

### ABC Diatype — Universal workhorse — body copy (18-19px), nav and meta (19px), subheadings (21px), and card titles (34px). Weight 700 is used sparingly for emphasis within body contexts. The tight 1.25 line-height on larger sizes keeps the editorial density. · `--font-abc-diatype`
- **Substitute:** Inter, Manrope, or Söhne
- **Weights:** 400, 700
- **Sizes:** 18px, 19px, 21px, 34px
- **Line height:** 1.25, 1.40, 1.50, 2.00
- **Role:** Universal workhorse — body copy (18-19px), nav and meta (19px), subheadings (21px), and card titles (34px). Weight 700 is used sparingly for emphasis within body contexts. The tight 1.25 line-height on larger sizes keeps the editorial density.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| body-sm | 18px | 1.5 | — | `--text-body-sm` |
| subheading | 21px | 1.4 | — | `--text-subheading` |
| heading-sm | 34px | 1.4 | — | `--text-heading-sm` |
| heading | 44px | 1.25 | — | `--text-heading` |
| display | 104px | 1.25 | — | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 9 | 9px | `--spacing-9` |
| 12 | 12px | `--spacing-12` |
| 14 | 14px | `--spacing-14` |
| 16 | 16px | `--spacing-16` |
| 19 | 19px | `--spacing-19` |
| 23 | 23px | `--spacing-23` |
| 25 | 25px | `--spacing-25` |
| 28 | 28px | `--spacing-28` |
| 37 | 37px | `--spacing-37` |
| 54 | 54px | `--spacing-54` |
| 59 | 59px | `--spacing-59` |
| 65 | 65px | `--spacing-65` |
| 74 | 74px | `--spacing-74` |
| 93 | 93px | `--spacing-93` |
| 111 | 111px | `--spacing-111` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 9px |
| buttons | 5px |
| navPill | 9999px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 59px
- **Card padding:** 19px
- **Element gap:** 19px

## Components

### Floating Pill Navigation
**Role:** Persistent site navigation

White pill-shaped bar (border-radius: 9999px) with thin #070707 border, 1px stroke. Contains 4 text links (Projects, Latest, About us, Contact) in ABC Diatype 19px weight 400, #070707. Floats centered over content with a subtle white fill that occludes the layer beneath. No shadow — separation comes from the border alone.

### Display Wordmark
**Role:** Brand identity at hero scale

The literal word 'Extract' set in Feature Deck at 104px, #070707, line-height 1.0. Occupies the full content width and bleeds visually off the right edge. This is not a logo lockup — it IS the page. Below it, a serif tagline at 34px (ABC Diatype 400, line-height 1.4) functions as a quiet mission statement.

### Editorial Project Card (Dark)
**Role:** Featured work showcase on light canvas

#070707 background, 9.3px border-radius, no shadow. Contains a full-bleed image or typographic spread (e.g. a large white serif 'Π' or a magazine cover). Padding is internal to the media; the card itself is flush. Width adapts to a 2-column or 3-column grid.

### News Article Card
**Role:** Editorial/blog entry on mint section

Transparent background on #e7feda canvas. Top: 9.3px-radius image (16:10 or similar editorial ratio). Title in ABC Diatype 19px weight 700, #070707. Body excerpt in ABC Diatype 18px weight 400, #070707, line-height 1.5. No border, no shadow — separation is purely typographic and spatial.

### Hairline Section Divider
**Role:** Vertical separation between content zones

1px solid #070707 line spanning the content width. Used between the project grid and the 'Recent projects' heading, and below the news section. No gaps above/below — the line touches adjacent content, creating a sharp editorial break.

### Ghost Text Link
**Role:** Inline navigation ('View all', project titles)

ABC Diatype 19px weight 400, #070707, with a 1px underline offset 4px from baseline. Underline is the only hover affordance — no color change, no background. Treated as editorial annotation, not a UI button.

### Outlined Input Field
**Role:** Form input for contact/newsletter

White background, 4.6px border-radius, 1px #070707 border. Padding 9px vertical, 19px horizontal. Placeholder and value in ABC Diatype 19px weight 400. No focus ring color change — the existing border simply thickens to 2px on focus.

### Hero Image Plate
**Role:** Full-bleed editorial photography

Large photographic image (warm amber/orange tones) with 9.3px border-radius. Sits below the wordmark and overlaps the floating nav. No caption, no border, no shadow — the image is the content.

### Section Header
**Role:** Introductory heading for content blocks

ABC Diatype 34px weight 400, #070707, left-aligned. Paired with a right-aligned 'View all' ghost link on the same baseline. Vertical margin 59px top, 19px bottom. On the mint section, text remains #070707 — the mint is the background, not an accent.

### Footer
**Role:** Site closure

Background transitions to #e7feda mint. Contains repeated floating pill nav, small print links, and studio metadata. ABC Diatype 18-19px, #070707 throughout. Maintains the same typographic system as body content — no distinct footer face.

## Do's and Don'ts

### Do
- Use #070707 for all text, borders, and filled UI controls — it is the only structural color in the system
- Reserve #e7feda mint for full section backgrounds, never for buttons, icons, tags, or text
- Set the display wordmark at 104px in Feature Deck with no letter-spacing adjustment — let the natural metrics carry the impact
- Use 9.3px border-radius for all cards, images, and content containers; 4.6px for inputs and small controls; 9999px only for the floating nav pill
- Maintain 1px hairline #070707 borders for all separation — never use shadows to lift elements off the canvas
- Pair Feature Deck 44px section heads with ABC Diatype 19px body — the scale jump is the hierarchy, not weight or color
- Keep the floating nav centered, persistent, and visually identical on every screen — it is the only persistent chrome

### Don't
- Do not introduce a second accent color — the system is built on the tension between black, white, and one mint wash
- Do not apply the mint #e7feda to buttons, links, icons, or hover states — it is atmospheric only
- Do not add drop shadows, inner glows, or any elevation effects — flatness is the signature
- Do not use Feature Deck for body copy or sub-100px text — it is display-only and loses legibility below 44px
- Do not use colored backgrounds inside cards on the mint section — let the section color be the unifying field
- Do not center body text — only the display wordmark and nav are centered; all editorial copy is left-aligned
- Do not use border-radius values outside the 4.6px / 9.3px / 9999px scale — the system is intentionally tight

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#ffffff` | Default page background, card surfaces on light sections, button fills inside dark panels |
| 1 | Mint Zone | `#e7feda` | Atmospheric section background (newsworthy blocks, footer) — marks editorial content zones |
| 2 | Ink Panel | `#070707` | Inverted surface for featured project cards — makes editorial spreads feel framed and elevated without using shadow |

## Elevation

The design system intentionally avoids drop shadows entirely. Elevation and separation are achieved through three mechanisms only: (1) a 1px #070707 hairline border, (2) a #070707 filled surface on a #ffffff canvas, and (3) a 1px thickness increase on the existing border for focus/active states. This flatness reinforces the editorial gallery metaphor — paper on paper, not cards floating in space.

## Imagery

Editorial photography dominates the visual language. Images are treated as full-bleed plates rather than illustrations — warm-toned, human, often featuring people in staged-but-natural moments (a young man in amber light, a woman in a studio, a hand holding a printed calendar). All images share a 9.3px border-radius, giving them a consistent subtle framing. There is no use of stock photography aesthetic, no illustrations, no abstract graphics, and no icon system beyond simple text links. The warm amber/orange of the hero photo creates a color contrast against the otherwise near-monochrome palette and the cool mint sections, acting as a third emotional register without becoming a design token.

## Layout

Content is centered with a max-width of ~1200px and generous side margins (54-59px). The hero breaks this pattern by allowing the 104px wordmark to bleed across the full content width, establishing a typographic-first opening. Below the hero, the layout settles into a strict editorial grid: a 2-column project showcase on a light gray band, then a 'Recent projects' heading with a 3-column news card grid on a mint background, then footer. Sections are separated by 1px hairline dividers, not by background color changes alone — the mint section is the only true color zone. Navigation is a floating centered pill that persists across all sections, visually breaking the vertical flow. The overall rhythm is spacious and gallery-like: large breathing gaps between sections, no decorative ornament, no overlapping elements.

## Agent Prompt Guide

Quick Color Reference:
- text: #070707
- background: #ffffff
- border: #070707 (1px)
- accent: #e7feda (section background only)
- primary action: no distinct CTA color

Example Component Prompts:
1. Build a floating pill navigation: 1px #070707 border, white background, border-radius 9999px, padding 9px 14px. Links set in ABC Diatype 19px weight 400, #070707, separated by 19px gaps. No shadow, centered horizontally.
2. Build a hero section: #ffffff background. Display wordmark 'Extract' in Feature Deck 104px weight 400, #070707, line-height 1.0, bleeding to the right edge. Below: ABC Diatype 34px serif tagline in #070707. Full-bleed editorial photograph with 9.3px border-radius beneath.
3. Build a news article card on a #e7feda section: transparent background, 9.3px-radius image at top, title in ABC Diatype 19px weight 700 #070707, body in ABC Diatype 18px weight 400 #070707 line-height 1.5. No border, no shadow.
4. Build a dark project card: #070707 background, 9.3px border-radius, full-bleed media inside (typographic spread or photograph), no internal padding, no border, no shadow.
5. Build a section header: ABC Diatype 34px weight 400 #070707 left-aligned, paired with a right-aligned 'View all' ghost link (ABC Diatype 19px #070707, 1px underline). 59px top margin, 19px bottom margin.

## Similar Brands

- **Pentagram** — Same editorial gallery approach — minimal UI chrome, oversized typographic statements, and content-as-artwork project showcases on a restrained palette
- **Manual (manualcreative.com)** — Shared design-studio discipline: near-monochrome canvas, one pastel section color, serif/sans type pairing, and flat hairlined cards with no shadows
- **Locomotive (locomotive.ca)** — Both treat the homepage as a typographic poster first and a portfolio second — full-bleed wordmark hero followed by curated image grids
- **DIA Studio** — Identical floating-pill navigation pattern, generous whitespace, and the discipline of letting a single pastel hue mark a content zone

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-gallery-white: #ffffff;
  --color-ink-black: #070707;
  --color-spearmint-wash: #e7feda;

  /* Typography — Font Families */
  --font-feature-deck: 'Feature Deck', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-abc-diatype: 'ABC Diatype', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-body-sm: 18px;
  --leading-body-sm: 1.5;
  --text-subheading: 21px;
  --leading-subheading: 1.4;
  --text-heading-sm: 34px;
  --leading-heading-sm: 1.4;
  --text-heading: 44px;
  --leading-heading: 1.25;
  --text-display: 104px;
  --leading-display: 1.25;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-9: 9px;
  --spacing-12: 12px;
  --spacing-14: 14px;
  --spacing-16: 16px;
  --spacing-19: 19px;
  --spacing-23: 23px;
  --spacing-25: 25px;
  --spacing-28: 28px;
  --spacing-37: 37px;
  --spacing-54: 54px;
  --spacing-59: 59px;
  --spacing-65: 65px;
  --spacing-74: 74px;
  --spacing-93: 93px;
  --spacing-111: 111px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 59px;
  --card-padding: 19px;
  --element-gap: 19px;

  /* Border Radius */
  --radius-md: 4.63636px;
  --radius-lg: 9.27273px;

  /* Named Radii */
  --radius-cards: 9px;
  --radius-buttons: 5px;
  --radius-navpill: 9999px;

  /* Surfaces */
  --surface-canvas: #ffffff;
  --surface-mint-zone: #e7feda;
  --surface-ink-panel: #070707;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-gallery-white: #ffffff;
  --color-ink-black: #070707;
  --color-spearmint-wash: #e7feda;

  /* Typography */
  --font-feature-deck: 'Feature Deck', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-abc-diatype: 'ABC Diatype', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-body-sm: 18px;
  --leading-body-sm: 1.5;
  --text-subheading: 21px;
  --leading-subheading: 1.4;
  --text-heading-sm: 34px;
  --leading-heading-sm: 1.4;
  --text-heading: 44px;
  --leading-heading: 1.25;
  --text-display: 104px;
  --leading-display: 1.25;

  /* Spacing */
  --spacing-9: 9px;
  --spacing-12: 12px;
  --spacing-14: 14px;
  --spacing-16: 16px;
  --spacing-19: 19px;
  --spacing-23: 23px;
  --spacing-25: 25px;
  --spacing-28: 28px;
  --spacing-37: 37px;
  --spacing-54: 54px;
  --spacing-59: 59px;
  --spacing-65: 65px;
  --spacing-74: 74px;
  --spacing-93: 93px;
  --spacing-111: 111px;

  /* Border Radius */
  --radius-md: 4.63636px;
  --radius-lg: 9.27273px;
}
```
