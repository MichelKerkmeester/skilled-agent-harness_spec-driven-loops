# Savee — Style Reference
> Black canvas for visual curators

**Theme:** dark

Savee operates in near-total darkness: an almost pure black canvas (#050505) where the only chromatic element is a single electric indigo (#1500ff) that punctuates the interface like a neon gallery light. Typography does all the heavy lifting — a single custom sans-serif used at every level, from 96px display headlines with 0.96 line-height and -0.04em tracking down to 13px captions, creating a confident editorial rhythm that feels more like a museum wall than a SaaS dashboard. Surfaces are barely distinguishable: the page canvas, elevated cards (#151515), and deeper overlays (#1e1e1e) form a near-invisible hierarchy that lets imagery and type carry the experience. The lone violet accent on the primary CTA is the only visual noise the system permits — everything else is white type on black, pill-shaped controls, and generous 64px section breathing room.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Electric Indigo | `#1500ff` | `--color-electric-indigo` | Violet supporting accent for decorative details and low-frequency emphasis. Do not promote it to the primary CTA color |
| Obsidian | `#050505` | `--color-obsidian` | Page canvas, deepest background — the void that all content sits on |
| Charcoal | `#151515` | `--color-charcoal` | Elevated surface, product preview frames, secondary panels |
| Graphite | `#1e1e1e` | `--color-graphite` | Deeper overlay surface, hover states on dark cards, input fields |
| Paper | `#fdfdfd` | `--color-paper` | Primary text, inverted surface, button text, high-contrast foreground |
| Silver | `#e5e5e5` | `--color-silver` | Hairline borders, dividers, subtle structural edges |
| Pearl | `#d4d4d4` | `--color-pearl` | Secondary text, subdued headings, placeholder body copy |
| Slate | `#2f2f2f` | `--color-slate` | Footer borders, low-contrast dividers between dark zones |
| Ash | `#a3a3a3` | `--color-ash` | Muted helper text, inactive icons, de-emphasized metadata |
| Stone | `#737373` | `--color-stone` | Tertiary text, timestamps, supplementary labels |

## Tokens — Typography

### Savee Font — The sole typeface — a custom geometric sans used at every scale. Weight 400 carries the editorial body and nav; weight 500 appears on buttons and emphasized labels. The 96px display at 0.96 line-height with -0.04em tracking is the system's signature: it compresses into a dense confident block rather than stretching vertically, making the headline feel sculptural. · `--font-savee-font`
- **Substitute:** Inter, DM Sans, or Satoshi (geometric sans-serifs with similar x-height proportions and tight default tracking)
- **Weights:** 400, 500
- **Sizes:** 13, 14, 16, 18, 21, 24, 30, 36, 60, 96
- **Line height:** 0.96, 1.00, 1.11, 1.13, 1.23, 1.25, 1.29, 1.33, 1.38, 1.50
- **Letter spacing:** -0.04em at 96px, -0.02em at 60px, -0.01em at 36-30px, normal at 24-18px, +0.01em at 16px, +0.015em at 14-13px
- **Role:** The sole typeface — a custom geometric sans used at every scale. Weight 400 carries the editorial body and nav; weight 500 appears on buttons and emphasized labels. The 96px display at 0.96 line-height with -0.04em tracking is the system's signature: it compresses into a dense confident block rather than stretching vertically, making the headline feel sculptural.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 13px | 1.5 | 0.195px | `--text-caption` |
| body | 16px | 1.5 | 0.16px | `--text-body` |
| body-lg | 18px | 1.38 | — | `--text-body-lg` |
| subheading | 21px | 1.33 | — | `--text-subheading` |
| heading-sm | 24px | 1.29 | -0.24px | `--text-heading-sm` |
| heading | 30px | 1.25 | -0.3px | `--text-heading` |
| heading-lg | 36px | 1.13 | -0.36px | `--text-heading-lg` |
| display | 60px | 1 | -1.2px | `--text-display` |
| display-lg | 96px | 0.96 | -3.84px | `--text-display-lg` |

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
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |
| 96 | 96px | `--spacing-96` |
| 128 | 128px | `--spacing-128` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 9999px |
| cards | 14px |
| pills | 9999px |
| inputs | 9999px |
| buttons | 9999px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 64px
- **Card padding:** 24px
- **Element gap:** 12px

## Components

### Primary Pill Button
**Role:** The sole filled action in the system

Electric Indigo (#1500ff) background, Paper (#fdfdfd) text at 14-16px weight 500, fully rounded 9999px radius, 12px 24px padding. This is the only place the brand color lives — every other interactive element defers to it. Appears once per viewport maximum to preserve its impact.

### Ghost Pill Button
**Role:** Secondary action that doesn't compete with the primary

Transparent background, 1px Paper (#fdfdfd) border at ~30% opacity or full opacity, Paper text at 14px weight 500, 9999px radius, 10px 20px padding. Used for 'Sign up' and 'Join over 1M users' — the outlined variant lets the primary indigo button own the hierarchy.

### Navigation Bar
**Role:** Minimal top-level site navigation

Transparent background floating on the Obsidian canvas. Logo at left in Paper white, text-only nav links (Features, Marketplace, What's new, Reviews) centered in Pearl (#d4d4d4) at 14px, auth actions (Log in, Sign up) at right. No background fill, no shadow, no border — the nav exists purely as type on the void.

### Display Headline
**Role:** Hero-level typography that defines the page

96px Savee Font weight 500, Paper (#fdfdfd), line-height 0.96, letter-spacing -0.04em. The extreme tightness and massive scale make it read as a single sculptural block. Centered horizontally with generous top/bottom breathing room (64-80px). The hero is centered single-column — no split layout, no side imagery.

### Editorial Body Block
**Role:** Long-form persuasive text at unusual scale

36px Savee Font weight 400, Paper (#fdfdfd), line-height 1.13, letter-spacing -0.01em. This is body copy at headline scale — 36px is massive for prose, creating a magazine-like reading experience. Left-aligned, max-width ~800px, sits below the hero with 48-64px separation.

### Partner Logo Strip
**Role:** Social proof band

Single horizontal row of grayscale brand logos (Apple, Google, Nike, Adobe, Pentagram, Airbnb, MWS) in Ash (#a3a3a3) or Pearl (#d4d4d4), evenly distributed across the full content width. Preceded by a small caption in Stone (#737373) at 13px. No logos colored, no hover effects — the strip is quiet authority.

### Product Preview Frame
**Role:** Large product screenshot or video container below the hero

Charcoal (#151515) background surface filling most of the viewport width, 14px border-radius, no border, no shadow. The subtle lift from canvas (#050505) to surface (#151515) is the only elevation cue — no drop shadows are used anywhere in the system.

### Text Link
**Role:** Inline navigation within body copy

Inherits body color (Paper or Pearl) with underline on hover only. No chromatic links — even interactive text stays in the neutral palette, reserving Electric Indigo exclusively for the primary CTA.

### Subhead Caption
**Role:** Descriptive subtext under headlines

16-18px Savee Font weight 400, Pearl (#d4d4d4), centered, line-height 1.50. Sits 16-24px below the display headline. The muted color creates a clear visual step-down from the headline without using a different size or weight.

### Full-Width Section Spacer
**Role:** Vertical rhythm between page sections

64-80px of pure Obsidian canvas with no visual element. Sections breathe into the void — no dividers, no background color shifts, no gradient transitions. The darkness itself is the separator.

### Footer Divider
**Role:** Low-contrast structural edge

1px horizontal line in Slate (#2f2f2f) or Silver (#e5e5e5) at ~10% opacity, spanning the content width. The only structural border in the entire system — used to separate the footer from the page body.

## Do's and Don'ts

### Do
- Use #1500ff Electric Indigo exclusively for the single primary CTA on any given screen — never for secondary actions, links, icons, or decorative elements
- Set display headlines at 96px with line-height 0.96 and letter-spacing -0.04em so the type compresses into a confident sculptural block rather than stretching
- Apply 9999px border-radius to every button, tag, and pill — the pill shape is the system's only control geometry
- Use 14px radius for card and product preview surfaces, and nothing else — keep the shape vocabulary to exactly two radii
- Let the Obsidian canvas (#050505) be the separator between sections — add 64-80px of empty space rather than lines, color shifts, or gradient transitions
- Set body prose at 36px when it needs to carry editorial weight; drop to 18px for functional descriptions. Never use 14-16px for primary page copy
- Keep all text in the neutral palette (#fdfdfd, #d4d4d4, #a3a3a3) — the only chromatic color is the CTA indigo

### Don't
- Never use #1500ff for anything other than the primary CTA fill — not for links, not for icons, not for hover states, not for badges
- Never add drop shadows or elevation glows to cards — the system uses surface color shifts (#050505 → #151515 → #1e1e1e) for hierarchy, not shadows
- Never set body text below 16px for primary content — captions and metadata can go to 13-14px, but main copy stays large
- Never introduce additional accent colors, even in illustrations or partner logos — the partner strip stays grayscale to preserve the indigo's dominance
- Never use border-radius values between 0px and 9999px for buttons — the system is binary: fully rounded pills or 14px card corners, nothing in between
- Never apply gradients to backgrounds, buttons, or text — the system is flat monochrome with one solid color exception
- Never use line-height above 1.50 for any text size — the tight line-heights (0.96-1.38) are the system's editorial signature

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#050505` | Full-page background, the void surface |
| 1 | Elevated Panel | `#151515` | Product preview frames, image containers, card surfaces |
| 2 | Deep Overlay | `#1e1e1` | Input fields, nested interactive elements, hover states |

## Elevation

The system deliberately avoids drop shadows entirely. Hierarchy is expressed through surface color steps (#050505 canvas → #151515 elevated panel → #1e1e1 deep overlay) and through type scale alone. The absence of shadows is a signature choice — it keeps the interface feeling like a flat gallery wall rather than a layered software product.

## Imagery

Imagery is product-first and user-curated. The hero shows a large product preview frame in Charcoal (#151515) suggesting a dark-mode app interface. Partner logos are rendered in flat grayscale — no color, no depth, no backgrounds. The overall visual density is text-dominant: the 96px headline and 36px body copy occupy far more visual space than any imagery. When user content appears (bookmarks, mood boards), it is presented as raw crops on the Obsidian canvas without decorative frames or treatments.

## Layout

The page is centered single-column with a max content width around 1200px. The hero opens with a centered display headline, subtext, and single CTA — no split layout, no side imagery. Below the hero, a large product preview frame (Charcoal rectangle) occupies the full content width. A partner logo strip follows as a single horizontal row. Then large left-aligned editorial body text at 36px. Navigation is a floating text-only bar with no background fill. Sections are separated by 64-80px of pure Obsidian canvas — no dividers, no color bands. The rhythm is: massive centered type → large dark product frame → quiet logo strip → oversized prose → void.

## Agent Prompt Guide

**Quick Color Reference**
- text: #fdfdfd
- background: #050505
- border: #e5e5e5
No distinct primary action color was observed; use the extracted neutral button treatments instead of inventing a filled CTA color.
- primary action: no distinct CTA color

**Example Component Prompts**


2. Create an editorial body section: #050505 background. Left-aligned prose at 36px Savee Font weight 400, #fdfdfd, line-height 1.13, letter-spacing -0.36px. Max-width 800px. No drop shadows, no card backgrounds — text sits directly on the void.

3. Create a product preview frame: #151515 background, 14px border-radius, full content width (max 1200px), no border, no shadow. Suggests a dark app interface screenshot.


5. Create a partner logo strip: single horizontal row of 8 grayscale logos in #a3a3a3, evenly spaced across full content width. Preceded by a caption at 13px #737373 reading 'Used by leading design studios and teams'. No colored logos, no hover effects.

## Radius Philosophy

The system uses exactly two radius values: 9999px for all interactive elements (buttons, tags, pills, inputs) creating a soft pill shape, and 14px for all passive surfaces (cards, product frames, preview containers). No 4px, no 8px, no 16px. The pill controls and the softly rounded cards together define the system's tactile language — buttons feel like physical pills you press, surfaces feel like slightly rounded frames. This binary radius vocabulary is as important as the color palette to the system's identity.

## Similar Brands

- **Are.na** — Same near-black canvas, oversized editorial typography, single-color or minimal palette, text-dominant hero with no decorative imagery
- **Linear** — Same dark-mode product UI with one vivid accent color (Linear uses #5e6ad2 indigo, Savee uses #1500ff), pill-shaped controls, tight line-heights, and surface color stepping instead of shadows
- **Pitch** — Same confident use of large-scale display type (90px+) with tight tracking on dark backgrounds, minimal color, and generous vertical breathing room between sections
- **VSCO** — Same dark gallery aesthetic for creative tools, pill-shaped CTAs, and the strategy of reserving color exclusively for the single most important action
- **Things 3 (Cultured Code)** — Same near-black background, pure white type, single blue accent for primary action, pill controls, and the philosophy that restraint in color creates confidence in the product

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-electric-indigo: #1500ff;
  --color-obsidian: #050505;
  --color-charcoal: #151515;
  --color-graphite: #1e1e1e;
  --color-paper: #fdfdfd;
  --color-silver: #e5e5e5;
  --color-pearl: #d4d4d4;
  --color-slate: #2f2f2f;
  --color-ash: #a3a3a3;
  --color-stone: #737373;

  /* Typography — Font Families */
  --font-savee-font: 'Savee Font', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 13px;
  --leading-caption: 1.5;
  --tracking-caption: 0.195px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: 0.16px;
  --text-body-lg: 18px;
  --leading-body-lg: 1.38;
  --text-subheading: 21px;
  --leading-subheading: 1.33;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.29;
  --tracking-heading-sm: -0.24px;
  --text-heading: 30px;
  --leading-heading: 1.25;
  --tracking-heading: -0.3px;
  --text-heading-lg: 36px;
  --leading-heading-lg: 1.13;
  --tracking-heading-lg: -0.36px;
  --text-display: 60px;
  --leading-display: 1;
  --tracking-display: -1.2px;
  --text-display-lg: 96px;
  --leading-display-lg: 0.96;
  --tracking-display-lg: -3.84px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-96: 96px;
  --spacing-128: 128px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 64px;
  --card-padding: 24px;
  --element-gap: 12px;

  /* Border Radius */
  --radius-xl: 14px;
  --radius-full: 9999px;

  /* Named Radii */
  --radius-tags: 9999px;
  --radius-cards: 14px;
  --radius-pills: 9999px;
  --radius-inputs: 9999px;
  --radius-buttons: 9999px;

  /* Surfaces */
  --surface-canvas: #050505;
  --surface-elevated-panel: #151515;
  --surface-deep-overlay: #1e1e1;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-electric-indigo: #1500ff;
  --color-obsidian: #050505;
  --color-charcoal: #151515;
  --color-graphite: #1e1e1e;
  --color-paper: #fdfdfd;
  --color-silver: #e5e5e5;
  --color-pearl: #d4d4d4;
  --color-slate: #2f2f2f;
  --color-ash: #a3a3a3;
  --color-stone: #737373;

  /* Typography */
  --font-savee-font: 'Savee Font', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 13px;
  --leading-caption: 1.5;
  --tracking-caption: 0.195px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: 0.16px;
  --text-body-lg: 18px;
  --leading-body-lg: 1.38;
  --text-subheading: 21px;
  --leading-subheading: 1.33;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.29;
  --tracking-heading-sm: -0.24px;
  --text-heading: 30px;
  --leading-heading: 1.25;
  --tracking-heading: -0.3px;
  --text-heading-lg: 36px;
  --leading-heading-lg: 1.13;
  --tracking-heading-lg: -0.36px;
  --text-display: 60px;
  --leading-display: 1;
  --tracking-display: -1.2px;
  --text-display-lg: 96px;
  --leading-display-lg: 0.96;
  --tracking-display-lg: -3.84px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-96: 96px;
  --spacing-128: 128px;

  /* Border Radius */
  --radius-xl: 14px;
  --radius-full: 9999px;
}
```
