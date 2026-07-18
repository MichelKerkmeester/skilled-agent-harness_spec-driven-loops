# herding.app — Style Reference
> Warm charcoal desk with a single neon spray — monochrome editorial dark UI broken by one vivid teal-lime wash.

**Theme:** dark

Herding operates as a dim, warm-toned control room: a near-black canvas of olive-charcoal surfaces, one tight utilitarian typeface at every size, and almost no chromatic noise. The interface stays monochrome and editorial — close-set type, generous gutters, soft 16px corners, and a persistent ink-into-paper inset shadow that makes cards feel pressed into the page rather than floating. The single color event is a saturated teal-to-lime gradient used sparingly as a feature banner or highlight wash; everywhere else, hierarchy comes from value contrast between warm grays and a slightly cream off-white. Components are flat, rounded, and weightless — buttons are thin-stroked outlines, tags sit as small monospaced chips, and the only 'accent' punctuation is the gradient itself.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Off-White Ink | `#fffffe` | `--color-off-white-ink` | Primary text, icon strokes, heading color — slightly cream warm-white reads softer than pure #fff against olive-charcoal surfaces |
| Page Void | `#1c1c1a` | `--color-page-void` | Deepest page background, behind everything; the recessed layer |
| Graphite Card | `#232320` | `--color-graphite-card` | Primary card and surface — most panels, modals, and elevated containers |
| Slate Matte | `#2e2e2b` | `--color-slate-matte` | Canvas-level surface, outer page background, content area baseline |
| Ash Step | `#35352f` | `--color-ash-step` | Subtle surface lift, nested card backgrounds, hover wash |
| Stone Lift | `#3e3e38` | `--color-stone-lift` | Higher elevation tier, active rows, secondary surface |
| Pewter Button | `#45453e` | `--color-pewter-button` | Button and chip backgrounds, pressed states |
| Bistre Border | `#161615` | `--color-bistre-border` | Dark border stroke, hairline separators, outline button border on hover |
| Fog Text | `#7f7e77` | `--color-fog-text` | Secondary muted text, captions, inactive controls; Reserved for button/dark accents |
| Sand Label | `#a3a29c` | `--color-sand-label` | Mid-level text, metadata, helper copy, list labels — warm gray that holds presence without competing with primary text |
| Spray Wash | `linear-gradient(90deg, #2ad4d8 0%, #3fe0a6 50%, #c8f57a 100%)` | `--color-spray-wash` | Decorative highlight — the only chromatic accent in the system, used exclusively inside the teal-to-lime gradient banner |

## Tokens — Typography

### Styrene — Single typeface serves everything from 11px captions to 45px display. Geometric humanist sans with tight apertures; weight 400 only — no bold. Tight -0.05em tracking is applied at every size, making headings feel condensed and utilitarian rather than elegant · `--font-styrene`
- **Substitute:** Inter (400), General Sans, Söhne
- **Weights:** 400
- **Sizes:** 11px, 14px, 15px, 20px, 27px, 45px
- **Line height:** 1.12 (display), 1.20 (subhead), 1.56 (body)
- **Letter spacing:** -0.05em at all sizes (≈ -0.55px at 11px, -0.75px at 15px, -1.0px at 20px, -1.35px at 27px, -2.25px at 45px)
- **Role:** Single typeface serves everything from 11px captions to 45px display. Geometric humanist sans with tight apertures; weight 400 only — no bold. Tight -0.05em tracking is applied at every size, making headings feel condensed and utilitarian rather than elegant

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 11px | 1.2 | -0.55px | `--text-caption` |
| body-sm | 14px | 1.56 | -0.7px | `--text-body-sm` |
| subheading | 20px | 1.2 | -1px | `--text-subheading` |
| heading | 27px | 1.2 | -1.35px | `--text-heading` |
| display | 45px | 1.12 | -2.25px | `--text-display` |

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
| 24 | 24px | `--spacing-24` |
| 32 | 32px | `--spacing-32` |
| 48 | 48px | `--spacing-48` |
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 9999px |
| cards | 16px |
| small | 12px |
| images | 7.5px |
| buttons | 16px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| xl | `rgba(8, 9, 1, 0.08) 0px 56px 72px 0px inset, rgba(8, 9, 1...` | `--shadow-xl` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 48px
- **Card padding:** 32px
- **Element gap:** 8-16px

## Components

### Outlined CTA Button
**Role:** Primary and secondary actions (Sign Up, Log In, Accept Folders)

Transparent fill, 1px border in #a3a29c, 16px radius, text in #fffffe at 14px, letter-spacing -0.7px. Horizontal padding ~24px, vertical ~12px. No fill ever — the button is purely stroked. On hover, border brightens to #fffffe.

### Theme Switcher Toggle
**Role:** Light/dark mode control in header

Pill shape (9999px radius), 1px #a3a29c border, tiny circular knob inside at #a3a29c, label 'THEME SWITCHER' in 11px uppercase tracking -0.55px to the right. Sits as a compact 28px-high element.

### Gradient Banner Card
**Role:** Featured content panel with the only color in the system

Full-bleed teal-to-lime gradient (linear-gradient 90deg from #2ad4d8 through #3fe0a6 to #c8f57a) filling the top of a 16px-radius card. Acts as a stage for product mockups or hero imagery. Used at most once per page to preserve the system rule that color is rare.

### Product Mockup Card
**Role:** Screenshot container showing the app interface

#232320 surface, 16px radius, inset shadow stack creates a recessed well. Two-pane layout inside: narrow left sidebar rail (#35352f) with category list in #a3a29c, wider right pane (#232320) with folder items and thumbnail strips. 7.5px radius on inner thumbnails.

### Top Hero Grid
**Role:** Three-column intro band (logo+headline, description, CTA cluster)

Three equal cards, each 16px radius, #232320 fill, ~32px internal padding, 16-24px column gap. Left card holds a small icon mark and 27px display headline. Middle holds 15px body description. Right holds stacked outlined CTA buttons and helper text in #a3a29c.

### Numbered Instruction List
**Role:** Step-by-step explainer block

Left-aligned vertical list inside a 16px-radius card. Each row: monospace-feeling digit prefix (15px, #fffffe) + instruction text (15px, #fffffe, line-height 1.56). 15px vertical row gap, 32px card padding.

### Category Card
**Role:** Folder/collection item with grouped sub-items

#232320 surface, 16px radius. Header in 14px uppercase tracking -0.7px (#a3a29c) with a small dot bullet. Sub-items listed vertically at 14px #fffffe with 8px row gap. Optional thumbnail strip along the bottom with 7.5px radius on each thumb.

### Icon Feature Card
**Role:** Small feature highlight tile (Order, Through, Reorder)

#2e2e2b surface, 12-16px radius, 32px padding. Centered geometric icon in #a3a29c (stroke-based, no fill). Label below in 14px #fffffe, with two small social/link icon chips at bottom right.

### Content Type Chip Row
**Role:** Inline tag list for content formats (images, videos, text, code)

Pill-shaped (9999px) chips, transparent fill, 1px #a3a29c border, 11px uppercase text in #fffffe, ~8px horizontal / 4px vertical padding. The word 'code' is bolded (visually emphasized via color #fffffe) inside the sentence to mark a type.

### Image Thumbnail
**Role:** Bookmark preview tile

7.5px radius, fills its container, object-fit cover. No overlay, no caption inside. Used in rows or grids to preview saved content.

### Inset Well Card
**Role:** Base elevated container that 'sinks' into the canvas

#232320 fill, 16px radius, no drop shadow. Instead, the multi-layer inset shadow (rgba(8,9,1,0.08) at 56px blur down to rgba(8,9,1,0.047) 1px ring) creates an inner vignette and a 1px inner border, making the card feel like a depression in the page.

## Do's and Don'ts

### Do
- Use only the warm-charcoal surface stack — Page Void #1c1c1a → Slate Matte #2e2e2b → Graphite Card #232320 → Ash Step #35352f → Stone Lift #3e3e38 — for all layering
- Apply the teal-to-lime gradient at most once per screen; it is the only chromatic event and must stay rare
- Set letter-spacing to -0.05em on every text element regardless of size, including 11px captions
- Use the inset shadow stack on all card and panel surfaces instead of any drop shadow
- Use 16px radius on cards and buttons, 7.5px on images and icons, 9999px on tags and toggles
- Use #fffffe for primary text and #a3a29c for secondary labels — never introduce a third text gray
- Keep all headings and body in weight 400; the system has no bold weight

### Don't
- Do not introduce a filled primary button — actions are always outlined in #a3a29c or #fffffe
- Do not use the gradient on text, icons, or strokes — reserve it for a large feature banner only
- Do not apply drop shadows to any element; the system uses inset shadows exclusively
- Do not pair Styrene with a second typeface; the single-font system is the signature
- Do not use bright white #ffffff — always use the slightly cream #fffffe for warmth against the olive-charcoal canvas
- Do not exceed 45px for display sizes; the scale tops out and curves back down
- Do not place multiple gradient banners on a single page; color saturation must remain below 2% of the surface area

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Page Void | `#1c1c1a` | Deepest recess, behind the outer canvas |
| 2 | Slate Matte | `#2e2e2b` | Outer page background, baseline canvas |
| 3 | Graphite Card | `#232320` | Primary card and panel surface |
| 4 | Ash Step | `#35352f` | Nested surface, sidebar rails, sub-cards |
| 5 | Stone Lift | `#3e3e38` | Top-level elevation, active items, toggles |

## Elevation

- **Card / Panel:** `inset rgba(8,9,1,0.08) 0px 56px 72px 0px, inset rgba(8,9,1,0.024) 0px 24px 29px 0px, inset rgba(8,9,1,0.02) 0px 11px 14px 0px, inset rgba(8,9,1,0.01) 0px 6px 7px 0px, inset rgba(8,9,1,0.008) 0px 2.5px 2px 0px, inset rgba(8,9,1,0.047) 0px 0px 0px 1px`

## Imagery

No photography. Imagery consists of product mockups rendered as dark UI screenshots inside recessed cards, small geometric stroke icons in #a3a29c, and the teal-to-lime gradient used as a single decorative wash. The gradient is the only full-bleed color; everything else stays inside the warm-charcoal palette. Icons are line-based, 1px-1.5px stroke, monoline, geometric. Thumbnails are tight crops of saved content (images, video stills, page captures) with no lifestyle context — the saved object is the hero, presented at 7.5px radius.

## Layout

Max-width ~1200px centered. The top of the page is a 3-column equal grid: logo+headline left, description middle, CTA cluster right — each cell is its own 16px-radius card. Below that, a full-width gradient banner card holds a 2-pane product mockup (narrow sidebar + wider content area). Sections are stacked vertically with 48px gaps. The lower half alternates between single full-width content cards and 2-column grids. Navigation is minimal — no sticky header, no sidebar; controls live inside the right column of the top grid (Sign Up, Log In, Theme Switcher). The grid is rigid and columnar, not fluid or asymmetric.

## Agent Prompt Guide

Quick Color Reference:
- text: #fffffe (primary), #a3a29c (secondary), #7f7e77 (muted)
- background: #2e2e2b (canvas), #232320 (card), #1c1c1a (deep recess)
- border: #161615 (hairline), #a3a29c (button outline)
- accent: #3fe0a6 (gradient mid-stop, never used solid)
- gradient: linear-gradient(90deg, #2ad4d8 0%, #3fe0a6 50%, #c8f57a 100%)
- primary action: no distinct CTA color

Example Component Prompts:
1. Top hero card: 16px radius, #232320 fill, 32px padding, inset shadow stack. Small icon top-left in #a3a29c, 27px display headline below in #fffffe with -1.35px tracking.
2. Outlined action button: 16px radius, transparent fill, 1px border in #a3a29c, 14px #fffffe text with -0.7px tracking, 12px vertical and 24px horizontal padding.
3. Gradient feature banner: full-width card at 16px radius, filled with linear-gradient(90deg, #2ad4d8, #3fe0a6, #c8f57a), containing a dark product mockup with 7.5px image radius.
4. Category list card: #232320 surface, 16px radius, 32px padding. 14px uppercase label in #a3a29c with -0.7px tracking, 8px gap between sub-items rendered in 14px #fffffe.
5. Numbered step list: 16px-radius #232320 card, each row 15px #fffffe with a 15px monospace digit prefix, 15px vertical row gap, 32px card padding.

## Similar Brands

- **Linear** — Same dark-mode-only canvas with near-black surfaces, one tight geometric sans, and color restricted to a single vivid accent
- **Vercel** — Identical approach of monochrome dark UI with one gradient hero, strict typographic hierarchy, and hairline-outlined buttons
- **Raycast** — Shares the recessed-card aesthetic with inset shadows, warm-charcoal palette, and minimal use of color outside featured moments
- **Things 3** — Same editorial restraint: single typeface, generous spacing, rounded surfaces, and an almost puritanical color discipline

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-off-white-ink: #fffffe;
  --color-page-void: #1c1c1a;
  --color-graphite-card: #232320;
  --color-slate-matte: #2e2e2b;
  --color-ash-step: #35352f;
  --color-stone-lift: #3e3e38;
  --color-pewter-button: #45453e;
  --color-bistre-border: #161615;
  --color-fog-text: #7f7e77;
  --color-sand-label: #a3a29c;
  --color-spray-wash: #3fe0a6;
  --gradient-spray-wash: linear-gradient(90deg, #2ad4d8 0%, #3fe0a6 50%, #c8f57a 100%);

  /* Typography — Font Families */
  --font-styrene: 'Styrene', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.2;
  --tracking-caption: -0.55px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.56;
  --tracking-body-sm: -0.7px;
  --text-subheading: 20px;
  --leading-subheading: 1.2;
  --tracking-subheading: -1px;
  --text-heading: 27px;
  --leading-heading: 1.2;
  --tracking-heading: -1.35px;
  --text-display: 45px;
  --leading-display: 1.12;
  --tracking-display: -2.25px;

  /* Typography — Weights */
  --font-weight-regular: 400;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-80: 80px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 48px;
  --card-padding: 32px;
  --element-gap: 8-16px;

  /* Border Radius */
  --radius-lg: 7.5px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-full: 1485px;
  --radius-full-2: 9999px;

  /* Named Radii */
  --radius-tags: 9999px;
  --radius-cards: 16px;
  --radius-small: 12px;
  --radius-images: 7.5px;
  --radius-buttons: 16px;

  /* Shadows */
  --shadow-xl: rgba(8, 9, 1, 0.08) 0px 56px 72px 0px inset, rgba(8, 9, 1, 0.024) 0px 24px 29px 0px inset, rgba(8, 9, 1, 0.02) 0px 11px 14px 0px inset, rgba(8, 9, 1, 0.01) 0px 6px 7px 0px inset, rgba(8, 9, 1, 0.008) 0px 2.5px 2px 0px inset, rgba(8, 9, 1, 0.047) 0px 0px 0px 1px inset;

  /* Surfaces */
  --surface-page-void: #1c1c1a;
  --surface-slate-matte: #2e2e2b;
  --surface-graphite-card: #232320;
  --surface-ash-step: #35352f;
  --surface-stone-lift: #3e3e38;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-off-white-ink: #fffffe;
  --color-page-void: #1c1c1a;
  --color-graphite-card: #232320;
  --color-slate-matte: #2e2e2b;
  --color-ash-step: #35352f;
  --color-stone-lift: #3e3e38;
  --color-pewter-button: #45453e;
  --color-bistre-border: #161615;
  --color-fog-text: #7f7e77;
  --color-sand-label: #a3a29c;
  --color-spray-wash: #3fe0a6;

  /* Typography */
  --font-styrene: 'Styrene', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.2;
  --tracking-caption: -0.55px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.56;
  --tracking-body-sm: -0.7px;
  --text-subheading: 20px;
  --leading-subheading: 1.2;
  --tracking-subheading: -1px;
  --text-heading: 27px;
  --leading-heading: 1.2;
  --tracking-heading: -1.35px;
  --text-display: 45px;
  --leading-display: 1.12;
  --tracking-display: -2.25px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-80: 80px;

  /* Border Radius */
  --radius-lg: 7.5px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-full: 1485px;
  --radius-full-2: 9999px;

  /* Shadows */
  --shadow-xl: rgba(8, 9, 1, 0.08) 0px 56px 72px 0px inset, rgba(8, 9, 1, 0.024) 0px 24px 29px 0px inset, rgba(8, 9, 1, 0.02) 0px 11px 14px 0px inset, rgba(8, 9, 1, 0.01) 0px 6px 7px 0px inset, rgba(8, 9, 1, 0.008) 0px 2.5px 2px 0px inset, rgba(8, 9, 1, 0.047) 0px 0px 0px 1px inset;
}
```
