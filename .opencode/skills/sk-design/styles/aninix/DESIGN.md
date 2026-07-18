# Aninix — Style Reference
> white gallery wall with one indigo switch

**Theme:** light

Aninix operates on near-total chromatic restraint: a white canvas, bold confident type, and a single electric indigo that activates only where human intent lives. The page reads like a minimalist product gallery — every element is either pure structural gray or that one vivid blue-violet, which makes the brand color feel like a switch being thrown rather than decoration. Components are flat, lightly bordered, and generous with whitespace; the layout alternates light and dark showcase cards to let the product work breathe. Typography is large, heavy, and unapologetic — a 64px-plus display headline against a quiet field, with body text that stays at human scale.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Indigo Switch | `#374fd5` | `--color-indigo-switch` | Violet action color for filled buttons, selected navigation states, and focused conversion moments. |
| Pure White | `#ffffff` | `--color-pure-white` | Page canvas, button surfaces, card backgrounds, reverse text on dark blocks |
| Soft Mist | `#f0f0f0` | `--color-soft-mist` | Secondary card surfaces, subtle fill blocks beneath product showcases |
| Carbon Black | `#000000` | `--color-carbon-black` | Primary text, heavy icon strokes, structural borders, divider lines |
| Ink Black | `#171717` | `--color-ink-black` | Heading text, deep borders where pure black feels too sharp |
| Shadow Gray | `#333333` | `--color-shadow-gray` | Body text secondary weight, supporting borders |
| Steel | `#89909a` | `--color-steel` | Muted helper text, ghost button borders, icon strokes at lower prominence |
| Midnight | `#0b1118` | `--color-midnight` | Dark showcase card surfaces, near-black panels for gallery contrast |
| Fog | `#ced3d9` | `--color-fog` | Hairline borders, button shadow ambient layer, subtle dividers |

## Tokens — Typography

### sans-serif — sans-serif — detected in extracted data but not described by AI · `--font-sans-serif`
- **Weights:** 400
- **Sizes:** 12px
- **Line height:** 1.2
- **Role:** sans-serif — detected in extracted data but not described by AI

### Euclid Circular A — Display and heading — the site loads heavy custom geometric type at 700+ for hero and section titles. The slightly tight tracking (-0.01em) and condensed geometric forms give headlines a monolithic, confident feel against the white field · `--font-euclid-circular-a`
- **Substitute:** Inter (700/800) or Söhne Breit
- **Weights:** 700-800
- **Sizes:** 18px, 20px
- **Line height:** 1.05-1.30
- **Letter spacing:** -0.0100em
- **Role:** Display and heading — the site loads heavy custom geometric type at 700+ for hero and section titles. The slightly tight tracking (-0.01em) and condensed geometric forms give headlines a monolithic, confident feel against the white field

### system-ui — Body and subhead text — leans on the native sans stack, letting the display face do the heavy lifting. Weight 500 appears in nav and subheadings, 700 for inline emphasis · `--font-system-ui`
- **Substitute:** Inter or system sans
- **Weights:** 400, 500, 700
- **Sizes:** 16px, 18px
- **Line height:** 1.40-1.50
- **Role:** Body and subhead text — leans on the native sans stack, letting the display face do the heavy lifting. Weight 500 appears in nav and subheadings, 700 for inline emphasis

### P22 Mackinac Pro — Editorial body accent — a slab-influenced serif used sparingly in testimonial or contextual blocks, adding human warmth where the geometric display would feel cold · `--font-p22-mackinac-pro`
- **Substitute:** Source Serif Pro or PT Serif
- **Weights:** 400
- **Sizes:** 20px
- **Line height:** 1.40-1.50
- **Role:** Editorial body accent — a slab-influenced serif used sparingly in testimonial or contextual blocks, adding human warmth where the geometric display would feel cold

### system-ui — Captions, micro-labels, badge text — tiny, quiet, never decorative · `--font-system-ui`
- **Substitute:** system sans
- **Weights:** 400
- **Sizes:** 16px, 18px
- **Line height:** 1.20
- **Role:** Captions, micro-labels, badge text — tiny, quiet, never decorative

### P22 Mackinac Pro Medium Italic — P22 Mackinac Pro Medium Italic — detected in extracted data but not described by AI · `--font-p22-mackinac-pro-medium-italic`
- **Weights:** 400
- **Sizes:** 16px
- **Line height:** 1.5
- **Role:** P22 Mackinac Pro Medium Italic — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.2 | — | `--text-caption` |
| body-sm | 14px | 1.5 | — | `--text-body-sm` |
| body | 16px | 1.5 | — | `--text-body` |
| body-lg | 18px | 1.44 | — | `--text-body-lg` |
| subheading | 20px | 1.4 | — | `--text-subheading` |
| heading | 32px | 1.2 | -0.32px | `--text-heading` |
| heading-lg | 48px | 1.15 | -0.48px | `--text-heading-lg` |
| display | 72px | 1.05 | -0.72px | `--text-display` |

## Tokens — Spacing & Shapes

**Density:** compact

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 8 | 8px | `--spacing-8` |
| 10 | 10px | `--spacing-10` |
| 12 | 12px | `--spacing-12` |
| 13 | 13px | `--spacing-13` |
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 28 | 28px | `--spacing-28` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 80 | 80px | `--spacing-80` |
| 120 | 120px | `--spacing-120` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 16px |
| badges | 4px |
| buttons | 8px |
| largeShowcase | 24px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| sm | `rgba(104, 116, 123, 0.15) 0px 2px 7px 0px, rgba(104, 116,...` | `--shadow-sm` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 24px
- **Element gap:** 10px

## Components

### Primary CTA Button
**Role:** Main call-to-action ('Install plugin') — the one interactive element that demands visual presence

Indigo Switch (#374fd5) fill, white text, 8px radius, 24px horizontal × 13px vertical padding. Body weight, 16px. Carries a dual-layer cool gray shadow (rgba(104,116,123,0.15) 2px 7px + rgba(104,116,123,0.3) 5px 15px) — the only shadow in the system. Often paired with a small Figma icon prefix.

### Ghost / Outlined Button
**Role:** Secondary actions in the nav ('Log in', 'Install plugin' outline variant)

Transparent fill, 1px Steel (#89909a) border, 8px radius, 24px × 10px padding. Text in body or muted gray. No shadow.

### Aninix Attribution Chip
**Role:** Brand watermark on showcase cards — 'by Aninix' tag overlaid on gallery content

Indigo Switch (#374fd5) fill, white text at 12px caption weight, 4px radius, compact 4-8px padding. Appears bottom-left on both light and dark showcase cards as a consistent brand signature.

### Light Showcase Card
**Role:** Product gallery block on white canvas — displays the Figma app icon or light product work

White or Soft Mist (#f0f0f0) surface, 16px radius, generous internal padding (40px+), no border, no shadow. Contains centered product visual. Anchored by the indigo attribution chip.

### Dark Showcase Card
**Role:** Product gallery block for dark-mode product work — phone mockups, video stills, animation frames

Midnight (#0b1118) surface, 16px radius, 40px+ internal padding, no shadow. White or light-gray content sits on the dark ground. The indigo attribution chip is the only color in the card.

### Navigation Bar
**Role:** Top-level site navigation

White transparent, full-width, with 80px horizontal padding. Left: logo + wordmark. Center: text links (16px, body weight, #333). Right: ghost 'Install plugin' button + ghost 'Log in' button. No background fill, no border, no sticky shadow.

### Hero Display Block
**Role:** Above-the-fold headline and subhead stack

Centered on white. Display type at 72px / weight 700-800 / -0.72px tracking in Carbon Black (#000). Subhead at 20px system-ui weight 400 in Shadow Gray (#333). 40-48px vertical gap between headline and subhead.

### Social Proof Line
**Role:** User count reassurance beneath primary CTA

14px body-sm, muted gray (#333), centered, unadorned. No badge, no icon — a single quiet line of trust.

### Logo Mark
**Role:** Brand identity — play-button glyph in a rounded square

Indigo Switch (#374fd5) rounded square (~20px), white play triangle centered. Paired with 'Aninix' wordmark in body weight.

### Section Heading
**Role:** Mid-page section titles ('Hard to believe these animations...')

Heading-lg scale (48px), system-ui or Euclid Circular A weight 700, -0.48px tracking, Carbon Black (#000). Centered or left-aligned depending on section rhythm.

## Do's and Don'ts

### Do
- Use #374fd5 exclusively for the CTA fill, the logo mark, and the 'by Aninix' attribution chip — never as background fill for large sections
- Set the hero headline at 72px / weight 700+ with -0.72px tracking in #000 — the large type against white is the page's identity
- Apply 16px radius to all card surfaces and 8px radius to all buttons — these two values define the component geometry
- Let the dual-layer button shadow be the only shadow in the system; keep cards and nav completely flat
- Alternate light (#f0f0f0 or #ffffff) and dark (#0b1118) showcase cards to create visual rhythm without adding color
- Keep body text at 16-18px in system-ui weight 400-500; let the display face carry the brand voice
- Use 80px horizontal padding on the nav and 80px section gaps — the page breathes

### Don't
- Never use a chromatic color other than #374fd5 — the 1% colorfulness is the entire brand strategy
- Never apply the dual-shadow elevation to anything except the primary CTA button
- Never use more than 2 type families on a single screen — Euclid Circular A for display, system-ui for body, Mackinac only for editorial pull-quotes
- Never add gradients — the system is flat by philosophy
- Never use #000000 for body text at small sizes; switch to #171717 or #333333 for anything below 24px
- Never add icons inside body text or cards — iconography is restricted to the logo, CTA prefixes, and the nav
- Never use the indigo accent on text longer than a single word; it is for chips, buttons, and the glyph only

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#ffffff` | Page-level background; the void everything else sits on |
| 1 | Card Light | `#f0f0f0` | Soft secondary surface beneath product showcases and highlight blocks |
| 2 | Card Dark | `#0b1118` | Gallery cards showcasing dark-mode product work; the contrast beat |
| 3 | Accent Surface | `#374fd5` | CTA fills and brand chips; the chromatic punctuation point |

## Elevation

- **Primary CTA button:** `rgba(104, 116, 123, 0.15) 0px 2px 7px 0px, rgba(104, 116, 123, 0.3) 0px 5px 15px 0px`

## Imagery

Product-first gallery aesthetic. The visuals are full-bleed product work — app icons, animation frames, UI mockups — displayed in flat cards rather than lifestyle photography. No people, no environments. Dark and light product cards alternate to create rhythm. Accent artwork (a vivid yellow block with building icons) appears as deliberate chromatic punctuation, breaking the monochrome rule. Iconography is minimal: the logo play-glyph, a small Figma mark on CTAs, and social glyphs. No decorative illustration or stock photography anywhere.

## Layout

Max-width 1200px centered, with 80px outer horizontal padding on the nav. Hero is a centered single-column stack: massive display headline → subhead → CTA → social proof → two-card gallery row. Section rhythm alternates white and light-gray bands, each section separated by 80px vertical gap. Content is predominantly centered stacks with occasional 2-column or 3-column card grids. Dark showcase cards break the white-field monotony mid-page. The overall density is spacious — one focal element per viewport, no information-dense blocks.

## Agent Prompt Guide

**Quick Color Reference**
- text: #000000 (headings), #333333 (body), #89909a (muted)
- background: #ffffff (canvas), #f0f0f0 (light card), #0b1118 (dark card)
- border: #000000 (structural), #89909a (ghost button), #ced3d9 (hairline)
No distinct primary action color was observed; use the extracted neutral button treatments instead of inventing a filled CTA color.
- primary action: no distinct CTA color

**Example Component Prompts**

2. **Light Showcase Card**: #f0f0f0 surface, 16px radius, 40px padding, no border, no shadow. Centered product visual (app icon or mockup). Bottom-left indigo chip: #374fd5 fill, white 'by Aninix' text at 12px, 4px radius, 4px × 8px padding.

3. **Dark Showcase Card**: #0b1118 surface, 16px radius, 40px padding, no shadow. Phone or device mockup centered. Same indigo attribution chip in bottom-left.

4. **Ghost Nav Button**: Transparent fill, 1px #89909a border, 8px radius, 24px × 10px padding. Text at 16px system-ui weight 500, #333333. No shadow.

5. **Section Heading**: 48px Euclid Circular A weight 700, #000, letter-spacing -0.48px, centered. Followed by 40px gap to content below.

## Similar Brands

- **Linear** — Same near-monochrome palette with a single vivid accent, bold geometric display type, and card-based gallery layouts
- **Vercel** — White-canvas minimalism, heavy display headlines at 64-72px, generous 80px section spacing, and flat cards with large radii
- **Framer** — Dark-and-light alternating showcase cards, single accent color for CTAs and brand chips, spacious gallery rhythm
- **Pitch** — Restrained colorfulness, confident geometric type, and product-first imagery over decorative photography
- **Figma Config** — Plugin-marketplace aesthetic with indigo accent, Figma-branded CTA buttons, and community social proof lines

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-indigo-switch: #374fd5;
  --color-pure-white: #ffffff;
  --color-soft-mist: #f0f0f0;
  --color-carbon-black: #000000;
  --color-ink-black: #171717;
  --color-shadow-gray: #333333;
  --color-steel: #89909a;
  --color-midnight: #0b1118;
  --color-fog: #ced3d9;

  /* Typography — Font Families */
  --font-sans-serif: 'sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-euclid-circular-a: 'Euclid Circular A', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-system-ui: 'system-ui', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-p22-mackinac-pro: 'P22 Mackinac Pro', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-p22-mackinac-pro-medium-italic: 'P22 Mackinac Pro Medium Italic', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.2;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-body-lg: 18px;
  --leading-body-lg: 1.44;
  --text-subheading: 20px;
  --leading-subheading: 1.4;
  --text-heading: 32px;
  --leading-heading: 1.2;
  --tracking-heading: -0.32px;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.15;
  --tracking-heading-lg: -0.48px;
  --text-display: 72px;
  --leading-display: 1.05;
  --tracking-display: -0.72px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-bold: 700;
  --font-weight-extrabold: 800;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-13: 13px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-80: 80px;
  --spacing-120: 120px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 24px;
  --element-gap: 10px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-2xl: 16px;
  --radius-3xl: 24px;

  /* Named Radii */
  --radius-cards: 16px;
  --radius-badges: 4px;
  --radius-buttons: 8px;
  --radius-largeshowcase: 24px;

  /* Shadows */
  --shadow-sm: rgba(104, 116, 123, 0.15) 0px 2px 7px 0px, rgba(104, 116, 123, 0.3) 0px 5px 15px 0px;

  /* Surfaces */
  --surface-canvas: #ffffff;
  --surface-card-light: #f0f0f0;
  --surface-card-dark: #0b1118;
  --surface-accent-surface: #374fd5;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-indigo-switch: #374fd5;
  --color-pure-white: #ffffff;
  --color-soft-mist: #f0f0f0;
  --color-carbon-black: #000000;
  --color-ink-black: #171717;
  --color-shadow-gray: #333333;
  --color-steel: #89909a;
  --color-midnight: #0b1118;
  --color-fog: #ced3d9;

  /* Typography */
  --font-sans-serif: 'sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-euclid-circular-a: 'Euclid Circular A', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-system-ui: 'system-ui', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-p22-mackinac-pro: 'P22 Mackinac Pro', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-p22-mackinac-pro-medium-italic: 'P22 Mackinac Pro Medium Italic', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.2;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-body-lg: 18px;
  --leading-body-lg: 1.44;
  --text-subheading: 20px;
  --leading-subheading: 1.4;
  --text-heading: 32px;
  --leading-heading: 1.2;
  --tracking-heading: -0.32px;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.15;
  --tracking-heading-lg: -0.48px;
  --text-display: 72px;
  --leading-display: 1.05;
  --tracking-display: -0.72px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-13: 13px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-80: 80px;
  --spacing-120: 120px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-2xl: 16px;
  --radius-3xl: 24px;

  /* Shadows */
  --shadow-sm: rgba(104, 116, 123, 0.15) 0px 2px 7px 0px, rgba(104, 116, 123, 0.3) 0px 5px 15px 0px;
}
```
