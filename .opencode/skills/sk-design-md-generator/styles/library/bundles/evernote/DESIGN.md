# Evernote — Style Reference
> Afternoon sun on cream paper — a warm, lived-in notebook where white cards float on beige, dark text breathes, and one lime-green highlighter marks the important things.

**Theme:** light

Evernote is a warm-paper productivity workspace: a cream canvas (#f9f6f2) replaces the typical white SaaS background, giving every screen the feel of a sunlit notebook page. The interface stays nearly monochrome — charcoal text, white elevated cards, hairline gray borders — with one vivid lime green (#94e130) acting as the singular energy accent for CTAs, icons, and highlights. Display headlines use Figtree at 300 weight with tight tracking, reading as editorial and airy rather than corporate. The visual rhythm is calm: centered hero stacks, generous section gaps, card carousels with small colored category squares, and a single dark contrast band (black with organic gradient blobs) that breaks the cream monotony for high-energy moments.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Lime Sprout | `#94e130` | `--color-lime-sprout` | Primary action button, icon highlights, accent tags — the singular chromatic punctuation that makes actions feel switched on against the cream canvas |
| Paper Cream | `#f9f6f2` | `--color-paper-cream` | Page canvas, hero background, section backgrounds — warm off-white that replaces standard white with a paper-like quality |
| Ivory Card | `#f4eee5` | `--color-ivory-card` | Alternate card surface, warm-toned elevated panels that sit one step deeper than the cream canvas |
| Pure White | `#ffffff` | `--color-pure-white` | Elevated card surfaces, product screenshot containers, button text on dark fills |
| Slate Border | `#e7e7e7` | `--color-slate-border` | Card borders, hairline dividers between content sections and list items |
| Smoke | `#a1a1a1` | `--color-smoke` | Muted link borders, nav underlines, subtle structural dividers |
| Stone | `#737373` | `--color-stone` | Helper text, tertiary body content, subdued annotations |
| Graphite | `#4e4d4c` | `--color-graphite` | Secondary text, icon strokes, subdued UI labels |
| Iron | `#262626` | `--color-iron` | Dark surface elements, body borders on inverted sections |
| Charcoal | `#141414` | `--color-charcoal` | Primary text, dark filled buttons, heading color — the near-black that carries all weight in the type system |
| Onyx | `#000000` | `--color-onyx` | Maximum-contrast borders, footer rules, SVG fills where absolute black is needed |

## Tokens — Typography

### Figtree — Primary typeface across all UI — display, headings, body, nav, buttons. Weight 300 at 72px hero is a signature choice: whisper-light headlines that feel editorial and confident rather than bold-and-shouting. The geometric humanist forms of Figtree at 300 weight give the warm cream canvas a modern editorial feel. · `--font-figtree`
- **Substitute:** Inter, DM Sans, or Nunito Sans
- **Weights:** 300, 400, 500, 600
- **Sizes:** 8, 12, 13, 14, 16, 18, 20, 24, 40, 50, 72
- **Line height:** 1.00–1.60
- **Letter spacing:** -0.0500em at 72px/50px/40px, -0.0300em at 24px, +0.0100em at small sizes
- **Role:** Primary typeface across all UI — display, headings, body, nav, buttons. Weight 300 at 72px hero is a signature choice: whisper-light headlines that feel editorial and confident rather than bold-and-shouting. The geometric humanist forms of Figtree at 300 weight give the warm cream canvas a modern editorial feel.

### Inter — Secondary body text at 16–20px, likely fallback or supplementary paragraph copy. Used sparingly alongside Figtree for longer-form descriptive text. · `--font-inter`
- **Substitute:** system-ui, -apple-system
- **Weights:** 400, 600
- **Sizes:** 16, 20
- **Line height:** 1.30, 1.50
- **Letter spacing:** -0.0500em
- **Role:** Secondary body text at 16–20px, likely fallback or supplementary paragraph copy. Used sparingly alongside Figtree for longer-form descriptive text.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.5 | 0.12px | `--text-caption` |
| body-sm | 14px | 1.5 | -0.14px | `--text-body-sm` |
| body | 16px | 1.5 | -0.48px | `--text-body` |
| subheading | 20px | 1.4 | -0.6px | `--text-subheading` |
| heading-sm | 24px | 1.3 | -0.72px | `--text-heading-sm` |
| heading | 40px | 1.2 | -2px | `--text-heading` |
| heading-lg | 50px | 1.1 | -2.5px | `--text-heading-lg` |
| display | 72px | 1 | -3.6px | `--text-display` |

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
| 120 | 120px | `--spacing-120` |
| 144 | 144px | `--spacing-144` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 5px |
| cards | 10px |
| pills | 52px |
| buttons | 5px |
| large-cards | 16px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 32px
- **Element gap:** 8-16px

## Components

### Primary CTA Button (Dark)
**Role:** Main conversion button on light backgrounds — the default call-to-action

Filled charcoal #141414 button, white text, Figtree 500 at 16px, padding 14px 28px (using 28px token), 5px border-radius. No shadow. Text is sentence case. This is the 'Get Evernote free' and 'Start for free' treatment.

### Primary CTA Button (Lime)
**Role:** Energy-action button used on dark sections to make CTAs pop

Filled Lime Sprout #94e130 button, Charcoal #141414 text, Figtree 500 at 16px, padding 14px 28px, 5px radius. Used on the dark 'supercharged' section to create maximum contrast against the black background.

### Ghost Nav Button
**Role:** Secondary nav-level action like 'Download' — lower-emphasis than the primary CTA

White background, 1px Charcoal #141414 border, Charcoal text, Figtree 500 at 16px, padding 10px 20px, 5px radius. Sits in the top nav beside the filled CTA.

### Text Link
**Role:** Inline link in body copy or nav

Charcoal #141414 text, Figtree 400, 1px bottom border in #a1a1a1 (Smoke) or matching text color. No background. Used for 'Log in', 'Already have an account? Log in' style links.

### Top Navigation Bar
**Role:** Primary site navigation

Horizontal bar on Paper Cream #f9f6f2 background, no border. Left: Evernote elephant logo + green accent. Center: nav links (Figtree 500, 14-16px). Right: Log in (text link) + Ghost Download + Filled Dark CTA. Vertical padding ~16px.

### Feature Card
**Role:** Card in the features carousel — one capability per card

White #ffffff background, 1px Slate Border #e7e7e7, 10px border-radius, padding 32px. Contains a 40px colored icon square (lime, blue, yellow, or purple) at top-left, Figtree 500 title at 20-24px, Figtree 400 body at 16px in Graphite #4e4d4c. Cards are equal-width in a horizontal carousel.

### Product Screenshot Card
**Role:** Large product preview image with browser-chrome frame

White #ffffff surface, 16px border-radius, browser-chrome top bar with traffic-light dots. Contains the actual app UI with notebook sidebar and note editor. Used in hero as the primary product demonstration.

### Category Icon Square
**Role:** Small colored block that color-codes a feature card category

40x40px rounded-square (10px radius) in a single brand-saturated color — blue, green, yellow, or purple. Contains a small white/mono icon centered. Acts as the only chromatic element on an otherwise monochrome card.

### Dark Contrast Section
**Role:** High-energy section that breaks the cream rhythm with full-black background

Solid black #000000 background, white text, Figtree 300 at 50px headline. Organic gradient blob shapes (green-to-transparent, blue-to-purple-to-transparent) float in corners as atmospheric decoration. Lime Sprout CTA sits centered below the headline.

### Carousel Navigation
**Role:** Pagination control for card carousels

Two circular arrow buttons (32px diameter) with 1px Charcoal border, white fill, centered chevron icon. Placed below the card row, centered horizontally.

### Tag/Pill Badge
**Role:** Category tag like 'Organize' on dark section

Small pill with 52px border-radius, 6-10px vertical padding, 12-16px horizontal padding, Figtree 500 at 13-14px. On light backgrounds: light fill with dark text. On dark sections: subtle colored fill (e.g. pale pink #fad0f6) with dark text.

## Do's and Don'ts

### Do
- Use Paper Cream #f9f6f2 as the default page canvas — never switch to pure white for full-page backgrounds
- Set hero headlines at 72px Figtree weight 300 with -3.6px letter-spacing for the signature airy editorial feel
- Apply Lime Sprout #94e130 only to one element per viewport: a CTA, an icon, or a tag — never as a background fill
- Use 5px border-radius for all buttons and 10px for cards — this subtle rounding is core to the warm, non-techy personality
- Maintain a minimum 80px gap between major sections to preserve the generous breathing room visible in the layout
- Pair the dark filled CTA on cream backgrounds with the lime filled CTA on dark sections — the CTA color flips with the surface
- Use colored 40px icon squares (blue/green/yellow/purple) on feature cards to create category coding without adding text labels

### Don't
- Don't use pure white #ffffff as a page background — it breaks the warm paper system
- Don't apply weight 600 or above to display headlines — weight 300 is the signature, heavier weights feel corporate
- Don't use Lime Sprout for large background fills, gradients, or decorative bands — it loses its energy when used at scale
- Don't add drop shadows to cards — the system relies on flat hairline borders (#e7e7e7) for separation, not elevation
- Don't use fully rounded (9999px) buttons — 5px is the intentional subtle rounding, not pill-shaped
- Don't introduce more than one additional accent color per screen — the cream + charcoal + lime triad is the system
- Don't use letter-spacing looser than -0.03em on headings — the tight tracking is what makes the large type feel modern rather than textbook

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Paper Cream | `#f9f6f2` | Base page canvas — the warm default surface |
| 1 | Ivory Card | `#f4eee5` | First elevated tier — warm-toned cards sitting on the cream canvas |
| 2 | Pure White | `#ffffff` | Highest elevation — product screenshots, feature cards, ghost buttons |
| 3 | Onyx | `#000000` | Inverted section surface — dark contrast bands that break the cream rhythm |

## Elevation

- **Feature Card:** `none — uses 1px #e7e7e7 border instead of shadow`
- **Product Screenshot Card:** `none — flat surface on cream canvas`
- **Dark Contrast Section:** `none — relies on tonal contrast, not shadow`

## Imagery

No traditional photography. Visual content is almost entirely product UI screenshots presented inside browser-chrome frames with 16px corner radius. The only decorative visuals are organic gradient blob shapes (green, blue, purple) that appear in dark contrast sections as atmospheric background elements — they are soft-edged, large-scale, and partially transparent. Iconography uses outlined mono icons inside small colored category squares. The overall density is text-dominant with a single large product screenshot per major section.

## Layout

Max-width 1200px centered content on a full-bleed Paper Cream background. Hero is a centered stack: large editorial headline, centered subtext, single CTA, then a large product screenshot card below. Feature section is a horizontal card carousel with equal-width white cards and circular arrow controls below. A full-bleed dark band interrupts the cream rhythm for high-energy sections, then returns to cream. Vertical rhythm is generous: ~80px between major sections, 32px card padding, 8-16px element gaps. Navigation is a simple top bar with logo left, links center, and two right-aligned CTAs.

## Agent Prompt Guide

**Quick Color Reference**
- Background: #f9f6f2 (Paper Cream)
- Card surface: #ffffff (Pure White)
- Border: #e7e7e7 (Slate Border)
- Text primary: #141414 (Charcoal)
- Text secondary: #4e4d4c (Graphite)
- Accent / primary action: #94e130 (filled action)

**Example Component Prompts**

1. Create a Primary Action Button: #94e130 background, #000000 text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.

2. **Feature Card**: White #ffffff background, 1px #e7e7e7 border, 10px border-radius, 32px padding. 40x40px icon square in #94e130 (lime) at top-left with 10px radius, containing a white outlined icon. Title at 20px Figtree weight 500 in #141414. Body at 16px Figtree weight 400 in #4e4d4c.



5. **Carousel Control Row**: Two 32px circular buttons, 1px #141414 border, white fill, centered arrow icons. Horizontally centered, 24px gap between them, placed 24px below the card row.

## Similar Brands

- **Notion** — Same warm-cream + white card aesthetic with centered editorial headlines and generous breathing room, though Notion leans more minimal and Evernote carries a bolder lime accent
- **Dropbox** — Shared approach of large centered display headlines on soft warm backgrounds with a single chromatic accent for CTAs
- **Craft** — Similar paper-like warmth in the canvas color, flat card treatment with hairline borders, and oversized editorial typography at display sizes
- **Todoist** — Productivity tool with comparable cream-warm backgrounds, white card surfaces, and a single high-energy accent color used sparingly on primary actions
- **Bear (notes app)** — Notes-product aesthetic that pairs warm off-white surfaces with editorial light-weight headlines and restrained accent usage

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-lime-sprout: #94e130;
  --color-paper-cream: #f9f6f2;
  --color-ivory-card: #f4eee5;
  --color-pure-white: #ffffff;
  --color-slate-border: #e7e7e7;
  --color-smoke: #a1a1a1;
  --color-stone: #737373;
  --color-graphite: #4e4d4c;
  --color-iron: #262626;
  --color-charcoal: #141414;
  --color-onyx: #000000;

  /* Typography — Font Families */
  --font-figtree: 'Figtree', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --tracking-caption: 0.12px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --tracking-body-sm: -0.14px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.48px;
  --text-subheading: 20px;
  --leading-subheading: 1.4;
  --tracking-subheading: -0.6px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.3;
  --tracking-heading-sm: -0.72px;
  --text-heading: 40px;
  --leading-heading: 1.2;
  --tracking-heading: -2px;
  --text-heading-lg: 50px;
  --leading-heading-lg: 1.1;
  --tracking-heading-lg: -2.5px;
  --text-display: 72px;
  --leading-display: 1;
  --tracking-display: -3.6px;

  /* Typography — Weights */
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;

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
  --spacing-120: 120px;
  --spacing-144: 144px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 32px;
  --element-gap: 8-16px;

  /* Border Radius */
  --radius-md: 5px;
  --radius-lg: 10px;
  --radius-2xl: 16px;
  --radius-full: 52px;

  /* Named Radii */
  --radius-nav: 5px;
  --radius-cards: 10px;
  --radius-pills: 52px;
  --radius-buttons: 5px;
  --radius-large-cards: 16px;

  /* Surfaces */
  --surface-paper-cream: #f9f6f2;
  --surface-ivory-card: #f4eee5;
  --surface-pure-white: #ffffff;
  --surface-onyx: #000000;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-lime-sprout: #94e130;
  --color-paper-cream: #f9f6f2;
  --color-ivory-card: #f4eee5;
  --color-pure-white: #ffffff;
  --color-slate-border: #e7e7e7;
  --color-smoke: #a1a1a1;
  --color-stone: #737373;
  --color-graphite: #4e4d4c;
  --color-iron: #262626;
  --color-charcoal: #141414;
  --color-onyx: #000000;

  /* Typography */
  --font-figtree: 'Figtree', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --tracking-caption: 0.12px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --tracking-body-sm: -0.14px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.48px;
  --text-subheading: 20px;
  --leading-subheading: 1.4;
  --tracking-subheading: -0.6px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.3;
  --tracking-heading-sm: -0.72px;
  --text-heading: 40px;
  --leading-heading: 1.2;
  --tracking-heading: -2px;
  --text-heading-lg: 50px;
  --leading-heading-lg: 1.1;
  --tracking-heading-lg: -2.5px;
  --text-display: 72px;
  --leading-display: 1;
  --tracking-display: -3.6px;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-120: 120px;
  --spacing-144: 144px;

  /* Border Radius */
  --radius-md: 5px;
  --radius-lg: 10px;
  --radius-2xl: 16px;
  --radius-full: 52px;
}
```
