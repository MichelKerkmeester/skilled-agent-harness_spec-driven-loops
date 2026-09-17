# Atoms — Style Reference
> obsidian monolith in candlelight — a near-black canvas where a single warm champagne accent cuts like a blade through the darkness

**Theme:** dark

Atoms operates in a near-total monochrome discipline: pure black canvases carry warm cream type and a single champagne accent. The system avoids color as decoration and instead uses a tight chromatic scale — cream for text, gold for emphasis, black for depth — to create an atmosphere of industrial precision, like machined titanium under tungsten light. Layout is compact, typographic, and grid-driven: large geometric logo marks, centered headline stacks, and dark bordered cards that hold company information with minimal chrome. Components are flat, low-contrast, and rely on hairline borders rather than shadows for definition. Motion is implied through structure rather than animation; every element reads as placed, not animated.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Champagne Gold | `#c8ad86` | `--color-champagne-gold` | Accent headings, category tags, decorative borders — the only chromatic color in the system, used sparingly to mark emphasis and brand-bearing elements |
| Candlelight Cream | `#fff7dd` | `--color-candlelight-cream` | Primary text, hairline borders, icon strokes — warm off-white reads softer than pure white against the black canvas |
| Obsidian Black | `#000000` | `--color-obsidian-black` | Page canvas, card surfaces, image backgrounds — absolute black dominates the visual field |
| Ember Ash | `#66635f` | `--color-ember-ash` | Muted surface variation, secondary backgrounds, low-emphasis fills |

## Tokens — Typography

### Switzer — Primary typeface for all headings, body, and navigation — a geometric sans with unusually tight tracking on display sizes (-0.042em at 44px) that creates a precision-engineered feel. Weight 400 for body, 500 for labels and tags. The negative letter-spacing on the 44px headline tightens the word shapes into compact, machined forms. · `--font-switzer`
- **Substitute:** Inter, General Sans, Satoshi
- **Weights:** 400, 500
- **Sizes:** 10px, 12px, 14px, 16px, 44px
- **Line height:** 1.00–1.13
- **Letter spacing:** -1.85px at 44px, -0.5px at 16px, 0.18px at 10px
- **Role:** Primary typeface for all headings, body, and navigation — a geometric sans with unusually tight tracking on display sizes (-0.042em at 44px) that creates a precision-engineered feel. Weight 400 for body, 500 for labels and tags. The negative letter-spacing on the 44px headline tightens the word shapes into compact, machined forms.

### system-ui sans-serif — Fallback / system rendering for micro-UI and link text · `--font-system-ui-sans-serif`
- **Weights:** 400
- **Sizes:** 12px
- **Line height:** 1.20
- **Role:** Fallback / system rendering for micro-UI and link text

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 10px | 1.2 | 0.18px | `--text-caption` |
| body | 14px | 1.4 | — | `--text-body` |
| heading | 44px | 1.13 | -1.85px | `--text-heading` |

## Tokens — Spacing & Shapes

**Density:** compact

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 6 | 6px | `--spacing-6` |
| 8 | 8px | `--spacing-8` |
| 10 | 10px | `--spacing-10` |
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 36 | 36px | `--spacing-36` |
| 40 | 40px | `--spacing-40` |
| 44 | 44px | `--spacing-44` |
| 48 | 48px | `--spacing-48` |
| 56 | 56px | `--spacing-56` |
| 60 | 60px | `--spacing-60` |
| 80 | 80px | `--spacing-80` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 100px |
| cards | 4px |
| buttons | 4px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 32px
- **Element gap:** 8-16px

## Components

### Hero Logo Mosaic
**Role:** Full-bleed brand mark

Large geometric/pixelated logo mark centered in the viewport, composed of square tile elements in #c8ad86 with a slightly desaturated, metallic texture. Occupies roughly 40% of the hero viewport height. No background — sits directly on black canvas.

### Hero Headline
**Role:** Primary statement type

44px Switzer weight 400, color #fff7dd, letter-spacing -1.85px, line-height 1.13. Center-aligned, max-width ~600px. Sentence flows across 3 lines with natural breaks. No color emphasis on individual words.

### Ghost Text Link
**Role:** Navigation cue to secondary content

Small body-sm text in #fff7dd with an inline arrow glyph (→). No underline, no button chrome. Hover state shifts to #c8ad86. 12px Switzer 400.

### Top Navigation Bar
**Role:** Global site navigation

Full-width black bar with 36px vertical padding, 40px horizontal padding. Left: 

### Company Card
**Role:** Portfolio/company grid item

3-column grid card on #000000 background with 1px border in #fff7dd at ~20% opacity (or #c8ad86). 4px border-radius. Padding 32px. Contains: logo area (centered, ~120px tall), company name (14px Switzer 500 #fff7dd), category tag (pill), description (12px #fff7dd 70% opacity), footer links row separated by 2px gaps.

### Category Tag Pill
**Role:** Industry/sector label

100px border-radius (fully rounded). 1px border in #c8ad86, transparent fill. Text: 10px Switzer 500, color #c8ad86, letter-spacing 0.18px. Padding 4px 10px. Renders as outlined pill.

### Company Logo Tile
**Role:** Brand mark display within card

Large area (full card width, ~200px tall) with centered logo. Logo rendered in #fff7dd or #c8ad86. No background fill — logo floats on card surface.

### Card Footer Link Row
**Role:** External resource links

Horizontal row of links (

### Section Header
**Role:** Content section title

Large Switzer heading, left-aligned, color #fff7dd. Often overlaps with sticky nav on scroll — uses blend or z-index layering.

### Arrow Glyph
**Role:** Directional/link indicator

Simple rightward arrow (→) rendered inline with text. 12-14px, inherits text color. Used on ghost links and card footer links.

## Do's and Don'ts

### Do
- Use #fff7dd for all primary text and hairline borders on black surfaces
- Reserve #c8ad86 exclusively for category tags, accent headings, and decorative borders — never as a full-surface fill
- Apply Switzer with tight negative letter-spacing on all display sizes: -1.85px at 44px, -0.13px at 16px
- Set border-radius to 4px on cards and buttons, 100px on tags and pills only
- Separate cards and sections with 1px hairline borders, never with shadows or background fills
- Keep vertical rhythm tight: 8-16px between related elements, 80px between major sections
- Render all icons and arrows in #fff7dd or #c8ad86 — never introduce additional colors

### Don't
- Do not use shadows, glows, or blur effects for elevation — define surfaces with borders only
- Do not introduce saturated colors beyond the champagne accent — no blues, greens, or reds
- Do not use pure white (#ffffff) for text — #fff7dd is warmer and on-brand
- Do not add background fills to cards or sections — they sit directly on the black canvas
- Do not use large border-radius values on cards (no 12px, 16px, 24px) — stay at 4px max for rectangles
- Do not apply letter-spacing to body text — keep tracking tight only on 16px+ sizes
- Do not animate color, position, or scale on load — the system is static and placed, not kinetic

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#000000` | Full-bleed page background |
| 1 | Card | `#000000` | Company card surface — same as canvas, defined by 1px hairline border |
| 2 | Muted Surface | `#66635f` | Subtle background variation for nav or secondary zones |

## Elevation

Elevation is achieved through hairline borders and value contrast, never through shadows. Cards sit on the same black canvas, separated only by 1px borders in #fff7dd or #c8ad86. This flat, shadowless approach reinforces the precision-machined, industrial aesthetic — surfaces feel cut from the same material, not stacked.

## Imagery

Imagery is minimal and structural rather than photographic. The hero features a large geometric/pixelated logo mark composed of square tiles in a metallic champagne tone with subtle texture, functioning as a brand artifact rather than illustration. Company cards contain flat logo marks (wordmarks, monograms, symbol logos) rendered in #fff7dd or #c8ad86 on the card surface. No photography, no lifestyle imagery, no product renders. The visual language is closer to a brand identity guideline than a marketing page — every visual element is logo, type, or geometric form.

## Layout

Full-bleed dark canvas with centered, max-width 1200px content zones. The hero is a vertical stack: large geometric logo mark, followed by a centered 3-line headline at 44px, followed by a single ghost text link. Navigation is a fixed top bar with the wordmark left and 3 links right. The companies section is a 3-column card grid with consistent card dimensions, each card containing a logo area, name, category tag, description, and external links. Vertical spacing between sections is generous (80px) while spacing within cards is compact (8-16px). Content is always centered or left-aligned — no asymmetric or overlapping layouts.

## Agent Prompt Guide

## Quick Color Reference\n- Background: #000000\n- Primary text: #fff7dd\n- Accent / emphasis: #c8ad86\n- Muted surface: #66635f\n- Border: #fff7dd at 20-30% opacity, or #c8ad86 for accent borders\n- primary action: no distinct CTA color

## Similar Brands

- **Figure AI** — Same near-monochrome dark aesthetic with single warm accent and tight geometric typography for a physical AI/robotics brand
- **Physical Intelligence** — Identical restraint — black canvas, cream type, no decorative imagery, structural logo-forward hero
- **Rivian (early site)** — Premium industrial brand language: absolute black backgrounds, warm off-white text, hairline borders, no shadows
- **VanMoof** — Compact typographic system on dark canvas with single accent and centered headline stacks
- **Nothing (nothing.tech)** — Geometric logo-as-hero treatment and dot-matrix / tile-based visual identity on pure black

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-champagne-gold: #c8ad86;
  --color-candlelight-cream: #fff7dd;
  --color-obsidian-black: #000000;
  --color-ember-ash: #66635f;

  /* Typography — Font Families */
  --font-switzer: 'Switzer', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-system-ui-sans-serif: 'system-ui sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.2;
  --tracking-caption: 0.18px;
  --text-body: 14px;
  --leading-body: 1.4;
  --text-heading: 44px;
  --leading-heading: 1.13;
  --tracking-heading: -1.85px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-6: 6px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-44: 44px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-60: 60px;
  --spacing-80: 80px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 32px;
  --element-gap: 8-16px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-full: 100px;

  /* Named Radii */
  --radius-tags: 100px;
  --radius-cards: 4px;
  --radius-buttons: 4px;

  /* Surfaces */
  --surface-canvas: #000000;
  --surface-card: #000000;
  --surface-muted-surface: #66635f;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-champagne-gold: #c8ad86;
  --color-candlelight-cream: #fff7dd;
  --color-obsidian-black: #000000;
  --color-ember-ash: #66635f;

  /* Typography */
  --font-switzer: 'Switzer', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-system-ui-sans-serif: 'system-ui sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.2;
  --tracking-caption: 0.18px;
  --text-body: 14px;
  --leading-body: 1.4;
  --text-heading: 44px;
  --leading-heading: 1.13;
  --tracking-heading: -1.85px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-6: 6px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-44: 44px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-60: 60px;
  --spacing-80: 80px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-full: 100px;
}
```
