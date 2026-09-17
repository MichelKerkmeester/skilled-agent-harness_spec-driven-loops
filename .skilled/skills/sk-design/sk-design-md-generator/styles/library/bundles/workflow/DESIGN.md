# Workflow — Style Reference
> editorial manuscript on warm linen — a designer's working notebook spread open on white paper

**Theme:** light

Workflow uses an editorial-manuscript language: a white paper canvas, whisper-weight serif headlines in Crimson Pro 300, and Inter as the working sans for body and UI. The palette is aggressively monochrome — nearly every surface is white, off-white, or warm gray, with the only chromatic note being a dusty sage green used as functional punctuation (active states, approved indicators). Components are thin and flat: hairline borders, 4–8px radii, and shadows so faint they barely register. The aesthetic reads more like a printed design quarterly than a SaaS dashboard — authority comes from typographic restraint and generous whitespace, not from saturated color or heavy elevation. An AI agent building for this brand should treat serif headings at weight 300 as the signature move, keep color to near-zero, and let borders and spacing do the structural work.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Ink Black | `#1a1a1a` | `--color-ink-black` | Primary text, icon strokes, card and section borders, nav links |
| Paper White | `#ffffff` | `--color-paper-white` | Page canvas, card surfaces, button text on dark fills |
| Graphite | `#6a6a6a` | `--color-graphite` | Secondary text, helper copy, muted borders, image strokes |
| Warm Charcoal | `#4d3f32` | `--color-warm-charcoal` | Warm-toned text and borders — the brown-tinted dark used where the system needs a softer, paper-friendly alternative to pure black |
| Fog | `#f6f6f6` | `--color-fog` | Subtle section backgrounds, button hover fills, nav border, badge surfaces |
| Linen | `#ececec` | `--color-linen` | Card surface tint, secondary background panels, body section fills |
| Hairline | `#e3e3e3` | `--color-hairline` | Dividers and borders where a softer separator is needed |
| Pebble | `#8d8d8d` | `--color-pebble` | Tertiary icon strokes, decorative image borders |
| Sage | `#547e69` | `--color-sage` | Green outline accent for tags, dividers, and focused UI edges |
| Mint Wash | `#f1fcf6` | `--color-mint-wash` | Primary page canvas and white card surfaces |

## Tokens — Typography

### Crimson Pro — Headlines and section titles — a custom serif at whisper weight is the system's signature; most SaaS sites use 600–700 sans for headings, this 300 serif trades volume for editorial elegance · `--font-crimson-pro`
- **Substitute:** Cormorant Garamond, Libre Caslon Text, or Playfair Display at weight 300
- **Weights:** 300
- **Sizes:** 26px, 32px
- **Line height:** 1.00
- **Letter spacing:** normal
- **Role:** Headlines and section titles — a custom serif at whisper weight is the system's signature; most SaaS sites use 600–700 sans for headings, this 300 serif trades volume for editorial elegance

### Inter — Body copy, UI labels, nav links, button text, captions, card descriptions — the working sans for everything that isn't a headline; weight 500 is reserved for button labels and nav emphasis · `--font-inter`
- **Substitute:** Inter (already open-source), or IBM Plex Sans
- **Weights:** 400, 500
- **Sizes:** 11px, 12px, 13px, 14px, 15px, 16px
- **Line height:** 1.35–1.91
- **Letter spacing:** -0.0040em to 0.0040em
- **Role:** Body copy, UI labels, nav links, button text, captions, card descriptions — the working sans for everything that isn't a headline; weight 500 is reserved for button labels and nav emphasis

### Georgia — Inline editorial body — appears in article-preview content blocks as a serif voice, reinforcing the manuscript metaphor against the Inter interface chrome · `--font-georgia`
- **Substitute:** Georgia (system), or Source Serif Pro
- **Weights:** 400
- **Sizes:** 13px
- **Line height:** 1.35–1.62
- **Letter spacing:** normal
- **Role:** Inline editorial body — appears in article-preview content blocks as a serif voice, reinforcing the manuscript metaphor against the Inter interface chrome

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 11px | 1.4 | 0.04px | `--text-caption` |
| body-lg | 16px | 1.5 | — | `--text-body-lg` |
| heading-sm | 26px | 1 | — | `--text-heading-sm` |
| heading | 32px | 1 | — | `--text-heading` |

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
| 44 | 44px | `--spacing-44` |
| 48 | 48px | `--spacing-48` |
| 56 | 56px | `--spacing-56` |
| 72 | 72px | `--spacing-72` |
| 80 | 80px | `--spacing-80` |
| 100 | 100px | `--spacing-100` |
| 104 | 104px | `--spacing-104` |
| 164 | 164px | `--spacing-164` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 12px |
| pills | 9999px |
| badges | 4px |
| images | 12px |
| buttons | 8px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| sm | `rgba(0, 0, 0, 0.06) 0px 2px 6px 0px` | `--shadow-sm` |
| subtle | `rgba(0, 0, 0, 0.03) 0px 1px 3px 0px, rgba(0, 0, 0, 0.03) ...` | `--shadow-subtle` |

### Layout

- **Page max-width:** 1080px
- **Section gap:** 80px
- **Card padding:** 24px
- **Element gap:** 16px

## Components

### Primary Text Button (Ghost)
**Role:** Main CTA — 'Get started →', 'Try now'

No background fill, Ink Black (#1a1a1a) text in Inter 500 at 14–16px, 8px border-radius, 8px 16px padding. Arrow glyph in Ink Black. Sits flush on the white canvas with no border — the type weight and arrow carry the affordance.

### Outlined Action Button
**Role:** Secondary action — 'Start tour'

White fill (#ffffff), Ink Black border at 1px, Inter 500 14px Ink Black text, 8px radius, 12px 20px padding. Restrained outlined style rather than a filled block — keeps the interface flat and editorial.

### Pill Badge
**Role:** Compact tag or status label

Fog (#f6f6f6) background, Graphite (#6a6a6a) text at 12–13px Inter 400, 4px radius, 4px 8px padding. Used for secondary metadata.

### Sage Status Pill
**Role:** Approval/active state indicator

White fill, Sage (#547e69) border at 1px, Sage text at 13px Inter 500, 9999px radius for full pill. Indicates approved, active, or positive states without color flooding the surface.

### Feature Card
**Role:** 2×2 grid card explaining product capabilities

White (#ffffff) surface, no border, subtle multi-layer shadow (rgba 0.03 stack), 12px radius, 24px internal padding. Headline at Crimson Pro 300 26px Ink Black, body at Inter 400 15px Graphite. Card may contain a nested illustration or product preview panel.

### Comment Thread Panel
**Role:** Reviewer feedback sidebar

White fill, 1px Hairline (#e3e3e3) left or full border, 8px radius, 16px padding. Avatar (circular, 24px), Inter 400 13–14px for commenter name and timestamp, Inter 400 14px for comment body. Reaction/reply row at bottom with Sage icon tints.

### Tab Bar
**Role:** Content type switcher — Live websites, Figma, Images, Videos, Presentations

No background. Tabs in Inter 400 14px. Active tab: Ink Black text with a Sage (#547e69) 2px underline. Inactive: Graphite (#6a6a6a) text, no underline. 16px horizontal padding, 8px vertical padding per tab.

### Navigation Bar
**Role:** Top-level site navigation

White background, 1px Fog (#f6f6f6) bottom border. Wordmark in Inter 500 16px Ink Black. Links in Inter 400 14px Ink Black, 16px gap between items. No dropdown chrome — flat horizontal list.

### Product Preview Panel
**Role:** Hero and section visual — browser/app mockup

White surface, 8px radius, hairline 1px border in #e3e3e3, optional soft drop shadow. Internal browser-chrome bar with traffic-light dots and tab labels in Inter 12px. Content area shows the actual product UI in a smaller scale.

### Trust Logo Grid
**Role:** Social proof band — 'Trusted by creatives from over 150 countries'

Centered section title in Inter 400 14px Graphite, then a 5-column grid of monochrome brand wordmarks. Logos rendered in Warm Charcoal (#4d3f32) or Graphite, no color, equal sizing and spacing.

### Walkthrough Video Card
**Role:** Embedded video teaser inside a feature card

White circular avatar thumbnail (48px), 1px Hairline border, centered on a Fog (#f6f6f6) background panel. Duration label in Inter 500 12px Ink Black on a white pill badge with 4px radius. Sits inside a larger Feature Card.

### Share/Approve Action Row
**Role:** Top-right actions on a review surface

Inline button group: 'Share' in Inter 500 14px Ink Black ghost text, then an outlined Sage pill ('Approve') with 9999px radius, 6px 12px padding. No filled background buttons — the action weight is carried by the pill shape and sage border.

## Do's and Don'ts

### Do
- Set every headline in Crimson Pro 300 — weight 300 is the signature; never use a bold serif or a sans-serif heading.
- Use Inter 400 for all body and UI text; reserve Inter 500 for button labels and active nav emphasis only.
- Keep surfaces to Paper White, Fog, and Linen; reach for Mint Wash only when a status is semantically positive.
- Use Sage (#547e69) only for active state underlines, approval pills, and functional icon accents — never as a fill, never on a CTA background.
- Use 4px radius for badges, 8px for buttons, 12px for cards and images — do not mix in alternative radii.
- Use 1px hairline borders in #e3e3e3 or #f6f6f6 as the primary separation method; rely on shadow only for the product preview card.
- Center content in a 1080px max-width column with 80px section gaps; let whitespace carry the layout instead of dividers or color.

### Don't
- Do not use a filled colored button as a primary CTA — CTAs are ghost text buttons or outlined pills.
- Do not introduce new hues; the palette is monochrome with one sage accent, and adding blue, red, or purple breaks the editorial system.
- Do not use a bold or semibold weight for headlines — Crimson Pro 300 is non-negotiable.
- Do not add large drop shadows or colored glows; elevation must stay under rgba 0.06 alpha.
- Do not use 0px or 16px+ border-radius on cards — the system lives at 4, 8, 12, and 9999px.
- Do not use color for decorative shapes, background washes, or illustration fills beyond the sage accent.
- Do not use Georgia for UI chrome — it is reserved for editorial article-preview content blocks only.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Paper White | `#ffffff` | Primary page canvas — every section opens on this surface |
| 1 | Fog | `#f6f6f6` | Quiet section alternation and button hover fills |
| 2 | Linen | `#ececec` | Card-level tinting where a card needs to read as elevated from the page |
| 3 | Mint Wash | `#f1fcf6` | Status/approval surface — the only chromatic background in the system |

## Elevation

- **Product preview card:** `rgba(0, 0, 0, 0.06) 0px 2px 6px 0px`
- **Hero mockup panel:** `rgba(0, 0, 0, 0.03) 0px 1px 3px 0px, rgba(0, 0, 0, 0.03) 0px 5px 5px 0px, rgba(0, 0, 0, 0.02) 0px 10px 6px 0px`

## Imagery

The site is text-dominant with minimal standalone imagery. The hero uses a full-width product preview panel — a browser-chrome mockup showing the feedback tool's comment interface overlaid on a Squarespace page, with sage-tinted comment pins. Trust logos appear as monochrome wordmarks on white. Feature cards contain small embedded product screenshots or circular avatar thumbnails for walkthrough videos, always contained within 8–12px rounded panels. No photography, no illustration, no abstract graphics — the product UI IS the visual.

## Layout

Full-width white sections, content centered in a 1080px column. Hero is a centered stack: serif headline → supporting paragraph → ghost CTA → tab bar → product preview panel. Feature sections alternate between left-aligned text with right-side visual and a 2×2 card grid with generous 80px gaps. Trust logo band is a centered 5-column grid. Navigation is a single flat top bar with no dropdowns. The entire page reads top-to-bottom as a centered single column with no sidebars or asymmetric compositions.

## Agent Prompt Guide

**Quick Color Reference**
- text: #1a1a1a
- background: #ffffff
- border: #e3e3e3
- accent: #547e69 (sage)
- secondary surface: #f6f6f6
- primary action: no distinct CTA color

**3 Example Component Prompts**

No distinct primary action color was observed; use the extracted neutral button treatments instead of inventing a filled CTA color.

2. *Create a feature card:* White surface, 12px border-radius, multi-layer shadow (rgba 0.03 stacked 1px/5px/10px). 24px internal padding. Title at 26px Crimson Pro 300 in #1a1a1a. Body at 15px Inter 400 in #6a6a6a. Optional nested preview panel with 1px #e3e3e3 border and 8px radius.

3. *Create a tab bar:* White background, no border. Tabs in Inter 400 14px. Active tab: Ink Black text with 2px sage (#547e69) underline, 16px horizontal padding, 8px vertical. Inactive tabs: Graphite (#6a6a6a) text, no underline. 24px gap between tabs.

## Similar Brands

- **Notion** — Same restrained monochrome palette with whisper-weight headings and generous whitespace between content blocks
- **Figma** — Product-preview-as-hero pattern with a centered screenshot panel and clean Inter-based UI chrome
- **Linear** — Flat surfaces, hairline borders, and near-zero chromatic color with a single functional accent for state
- **Pitch** — Editorial typography approach — serif accents paired with a clean sans for body, sparse color, and soft elevation
- **Frame.io** — Creative-tool review interface with comment threads, share/approve actions, and a muted neutral palette

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-ink-black: #1a1a1a;
  --color-paper-white: #ffffff;
  --color-graphite: #6a6a6a;
  --color-warm-charcoal: #4d3f32;
  --color-fog: #f6f6f6;
  --color-linen: #ececec;
  --color-hairline: #e3e3e3;
  --color-pebble: #8d8d8d;
  --color-sage: #547e69;
  --color-mint-wash: #f1fcf6;

  /* Typography — Font Families */
  --font-crimson-pro: 'Crimson Pro', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-georgia: 'Georgia', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.4;
  --tracking-caption: 0.04px;
  --text-body-lg: 16px;
  --leading-body-lg: 1.5;
  --text-heading-sm: 26px;
  --leading-heading-sm: 1;
  --text-heading: 32px;
  --leading-heading: 1;

  /* Typography — Weights */
  --font-weight-light: 300;
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
  --spacing-44: 44px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-72: 72px;
  --spacing-80: 80px;
  --spacing-100: 100px;
  --spacing-104: 104px;
  --spacing-164: 164px;

  /* Layout */
  --page-max-width: 1080px;
  --section-gap: 80px;
  --card-padding: 24px;
  --element-gap: 16px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-3xl: 24px;
  --radius-full: 9999px;

  /* Named Radii */
  --radius-cards: 12px;
  --radius-pills: 9999px;
  --radius-badges: 4px;
  --radius-images: 12px;
  --radius-buttons: 8px;

  /* Shadows */
  --shadow-sm: rgba(0, 0, 0, 0.06) 0px 2px 6px 0px;
  --shadow-subtle: rgba(0, 0, 0, 0.03) 0px 1px 3px 0px, rgba(0, 0, 0, 0.03) 0px 5px 5px 0px, rgba(0, 0, 0, 0.02) 0px 10px 6px 0px;

  /* Surfaces */
  --surface-paper-white: #ffffff;
  --surface-fog: #f6f6f6;
  --surface-linen: #ececec;
  --surface-mint-wash: #f1fcf6;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-ink-black: #1a1a1a;
  --color-paper-white: #ffffff;
  --color-graphite: #6a6a6a;
  --color-warm-charcoal: #4d3f32;
  --color-fog: #f6f6f6;
  --color-linen: #ececec;
  --color-hairline: #e3e3e3;
  --color-pebble: #8d8d8d;
  --color-sage: #547e69;
  --color-mint-wash: #f1fcf6;

  /* Typography */
  --font-crimson-pro: 'Crimson Pro', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-georgia: 'Georgia', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.4;
  --tracking-caption: 0.04px;
  --text-body-lg: 16px;
  --leading-body-lg: 1.5;
  --text-heading-sm: 26px;
  --leading-heading-sm: 1;
  --text-heading: 32px;
  --leading-heading: 1;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-44: 44px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-72: 72px;
  --spacing-80: 80px;
  --spacing-100: 100px;
  --spacing-104: 104px;
  --spacing-164: 164px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-3xl: 24px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-sm: rgba(0, 0, 0, 0.06) 0px 2px 6px 0px;
  --shadow-subtle: rgba(0, 0, 0, 0.03) 0px 1px 3px 0px, rgba(0, 0, 0, 0.03) 0px 5px 5px 0px, rgba(0, 0, 0, 0.02) 0px 10px 6px 0px;
}
```
