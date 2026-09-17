# Volume — Style Reference
> gallery wall with whispers — editorial restraint on paper-white canvas, the chrome is invisible, the imagery is the only color

**Theme:** light

Volume reads as an editorial gallery for design publications: full-bleed photographic campaigns with whisper-light Messina Sans headlines floating over image backgrounds. The chrome itself is nearly invisible — paper-white canvas, charcoal type, hairline borders, and a small set of pill-shaped status tags that carry the only chromatic punctuation. The extreme light weights (300/350) and tight negative tracking create a refined, magazine-page atmosphere where negative space and imagery do the heavy lifting. Every surface favors restraint and breathing room, letting the projects — not the interface — command attention.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Ink | `#272727` | `--color-ink` | Primary text, nav, footer text, dark pill tags (funded, successful) — the workhorse near-black that grounds every layout |
| Graphite | `#717171` | `--color-graphite` | Secondary text, hairline borders on cards, images, and inputs — the quiet structural neutral |
| Ash | `#949494` | `--color-ash` | Tertiary text, subtle borders, disabled or muted states |
| Fog | `#cdcccc` | `--color-fog` | Light placeholder text, decorative dividers on dark surfaces |
| Paper | `#ffffff` | `--color-paper` | Page canvas, card surfaces, text on dark/image overlays — the dominant background across all sections |
| Void | `#000000` | `--color-void` | Occasional deep surface for emphasis blocks, SVG fills |
| Ember | `#e75a00` | `--color-ember` | Orange wash for highlight backgrounds, decorative bands, and soft emphasis behind content |
| Signal Red | `#c52910` | `--color-signal-red` | Accent — alert and availability tags, sits between Ember and Brick in the warm surface stack |
| Brick | `#962921` | `--color-brick` | Red wash for highlight backgrounds, decorative bands, and soft emphasis behind content |

## Tokens — Typography

### Messina Sans — Single-family system covering nav, body, display, and UI. The signature choice is using weight 300/350 everywhere — headlines whisper rather than shout, creating editorial restraint. 50px and 80px display sizes with tight tracking (-0.02em) float over full-bleed campaign imagery; 14–20px handles body and UI; 0.07em wide tracking is used for eyebrow labels and tag text. · `--font-messina-sans`
- **Substitute:** Inter (weight 300) or Söhne Buch
- **Weights:** 300, 350
- **Sizes:** 14px, 18px, 20px, 32px, 50px, 80px
- **Line height:** 1.00, 1.18, 1.40, 2.00
- **Letter spacing:** -0.02em for display/headlines, 0.07em for small UI labels and tags
- **Role:** Single-family system covering nav, body, display, and UI. The signature choice is using weight 300/350 everywhere — headlines whisper rather than shout, creating editorial restraint. 50px and 80px display sizes with tight tracking (-0.02em) float over full-bleed campaign imagery; 14–20px handles body and UI; 0.07em wide tracking is used for eyebrow labels and tag text.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 14px | 1.4 | 0.98px | `--text-caption` |
| body | 18px | 1.4 | -0.36px | `--text-body` |
| subheading | 20px | 1.4 | -0.4px | `--text-subheading` |
| heading-sm | 32px | 1.18 | -0.64px | `--text-heading-sm` |
| heading | 50px | 1.18 | -1px | `--text-heading` |
| display | 80px | 1 | -1.6px | `--text-display` |

## Tokens — Spacing & Shapes

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 8 | 8px | `--spacing-8` |
| 10 | 10px | `--spacing-10` |
| 12 | 12px | `--spacing-12` |
| 13 | 13px | `--spacing-13` |
| 15 | 15px | `--spacing-15` |
| 17 | 17px | `--spacing-17` |
| 19 | 19px | `--spacing-19` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 30 | 30px | `--spacing-30` |
| 45 | 45px | `--spacing-45` |
| 60 | 60px | `--spacing-60` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 50px |
| cards | 50px |
| buttons | 50px |

### Layout

- **Section gap:** 80-120px
- **Card padding:** 30px
- **Element gap:** 10-15px

## Components

### Top Navigation Bar
**Role:** Minimal site chrome with centered primary links and account/cart on the right

White background, no border, ~30px vertical padding. Logo top-left at ~30px. Centered nav links (EXPLORE, ABOUT) in 14px Messina Sans weight 300, Ink (#272727), letter-spacing 0.07em uppercase. Right-aligned ACCOUNT and CART links in same style. No sticky behavior implied; transparent over hero images.

### Full-Bleed Campaign Hero
**Role:** Project showcase card with photographic background and overlaid text

Full-viewport-width image background, 500–600px tall. White text overlay bottom-left at 30px from edge. Project title at 50px Messina Sans weight 300, white, letter-spacing -1px. Subtitle (author name) at 20px weight 300, white. Below subtitle: pill-shaped status tags with 10px gap. No gradient overlay; relies on image contrast for legibility.

### Dark Status Pill (Funded/Successful)
**Role:** Indicates funding milestone reached

50px border-radius (full pill). Ink (#272727) background, white text, 14px Messina Sans weight 300, letter-spacing 0.07em uppercase. Horizontal padding 15px, vertical padding 8–10px. No border.

### Warm Status Pill (Limited/Available)
**Role:** Indicates scarcity or availability state

50px border-radius. Signal Red (#c52910) or Ember (#e75a00) background, white text, 14px Messina Sans weight 300, letter-spacing 0.07em uppercase. Same dimensions as dark pill; distinguished only by warm fill.

### Editorial Headline Block
**Role:** Large typographic statement below hero sequences

White background, generous top/bottom padding (80–120px). Headline at 80px Messina Sans weight 300, Ink color, letter-spacing -1.6px, line-height 1.0. Max-width ~800px left-aligned with 30px page-edge padding. No supporting imagery — pure typography breathing.

### Hairline-Bordered Card
**Role:** Content cards for supplementary project info

White background, 1px Graphite (#717171) border, 50px border-radius, 30px internal padding. Content stacks vertically with 10–15px gaps. No shadow; the border alone defines the card edge.

### Tag Input
**Role:** Search or filter field

Transparent or white background, 1px Graphite (#717171) border, 17px horizontal padding × 13px vertical padding. 14px Messina Sans weight 300, Ink text, Fog (#cdcccc) placeholder. No focus ring color specified; relies on border.

### Footer
**Role:** Minimal site footer

White background, 30px padding. Ink text at 14px weight 300, letter-spacing 0.07em uppercase for links. Centered or left-aligned with no visual divider from content above.

### Cookie Consent Bar
**Role:** Fixed-bottom compliance notice

White or very light background, full-width, ~60px tall. Left-aligned body text at 14px with a link to Privacy policy. Right-aligned two buttons: 'Preferences' (outlined, Ink border) and 'Accept' (filled Ink background, white text). Both buttons at 50px radius, 15px horizontal × 8px vertical padding.

## Do's and Don'ts

### Do
- Use Messina Sans at weight 300 or 350 for all text — heavier weights break the editorial restraint
- Set pill tags, buttons, and status indicators to 50px border-radius for the full pill shape
- Apply -0.02em letter-spacing on display sizes (50px+) and 0.07em on small UI labels and uppercase tags
- Use full-bleed photographic backgrounds for hero sections — never flat color blocks for campaign showcases
- Keep the page canvas Paper (#ffffff) and let imagery be the only source of color in a section
- Stack pill tags with 10px gaps beneath the hero subtitle, never float them separately
- Reserve warm accent colors (Ember, Signal Red, Brick) exclusively for status and availability tags

### Don't
- Do not use type weights above 350 — bold or semibold text violates the whisper-light voice
- Do not use sharp corners on cards, tags, or buttons — 50px radius is system-wide
- Do not add drop shadows to cards or elevated surfaces — borders alone define edges
- Do not apply the warm accent palette to buttons, headings, or icons — those are strictly for status tags
- Do not constrain heroes to a max-width — campaign imagery must span the full viewport
- Do not use system fonts or sans-serif alternatives at different weights as a substitute for Messina Sans's specific light cut
- Do not introduce gradients — the system is flat color + photography only

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Paper | `#ffffff` | Page canvas, body backgrounds, editorial text sections |
| 1 | Card | `#ffffff` | Bordered content cards on Paper, defined by hairline Graphite border rather than fill |
| 2 | Overlay | `#000000` | Text on photographic backgrounds relies on image contrast, not a scrim |

## Elevation

The system is deliberately shadowless. Elevation is communicated through hairline borders (1px Graphite #717171) and the 50px pill radius rather than box-shadow. This preserves the flat editorial print feel — cards look like printed inserts, not floating panels.

## Imagery

Photography dominates as full-bleed campaign backgrounds — no illustration, no product renders, no abstract graphics within the UI itself. The geometric teal illustration in the first hero is part of the project's own artwork, not system chrome. Images are large-format editorial: architectural, typographic, atmospheric (night scenes, workshop interiors). No duotone or color treatment is applied at the system level; photographs appear in their native tonal range. Iconography is minimal to absent in the visible chrome.

## Layout

Full-bleed, viewport-spanning campaign heroes stack vertically with no gaps between them. Each hero is ~500–600px tall with bottom-left text overlay. Below the hero sequence, a spacious white editorial section holds a single large headline at 80px, left-aligned with generous left padding (~30px). Navigation is a thin top bar — logo top-left, centered links, account/cart top-right — with no sticky behavior. The overall rhythm alternates between immersive photographic full-bleed blocks and quiet typographic white space, creating a gallery-walk cadence rather than a scrollable feed.

## Agent Prompt Guide

**Quick Color Reference**
- text: #272727 (Ink)
- background: #ffffff (Paper)
- border: #717171 (Graphite, 1px)
- accent: #c52910 (Signal Red, tags only)
- dark surface: #272727 (Ink)
- primary action: no distinct CTA color

**Example Component Prompts**

1. *Full-bleed campaign hero*: Background is a full-viewport-width photograph. Bottom-left overlay: project title at 50px Messina Sans weight 300, #ffffff, letter-spacing -1px. Subtitle at 20px weight 300, white. Below at 10px gap: two pill tags with 50px radius, #272727 background, white text, 14px weight 300, letter-spacing 0.07em uppercase, 15px horizontal × 10px vertical padding.

2. *Editorial headline section*: White background, 100px top padding. Headline at 80px Messina Sans weight 300, #272727, letter-spacing -1.6px, line-height 1.0, max-width 800px, left-aligned with 30px page-edge inset.

3. *Dark status pill*: 50px border-radius, #272727 background, 14px Messina Sans weight 300 uppercase white text, letter-spacing 0.07em, 15px × 10px padding.

4. *Warm availability pill*: Same dimensions as dark pill but #c52910 background, white text — used for 'Limited copies' or 'Available now' indicators.

5. *Bordered content card*: White background, 1px #717171 border, 50px border-radius, 30px internal padding. No shadow. Content stacks with 12px gaps at 18px Messina Sans weight 300, #272727.

## Similar Brands

- **Kickstarter** — Same full-bleed campaign hero with overlaid title/subtitle and pill-shaped status badges beneath
- **It's Nice That** — Editorial gallery rhythm alternating between large photography and quiet white typographic space
- **Unseen** — Design-publishing sensibility with restrained chrome, letting project imagery carry the visual weight
- **Drip** — Single-light-weight sans-serif system with pill UI elements and minimal interface decoration

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-ink: #272727;
  --color-graphite: #717171;
  --color-ash: #949494;
  --color-fog: #cdcccc;
  --color-paper: #ffffff;
  --color-void: #000000;
  --color-ember: #e75a00;
  --color-signal-red: #c52910;
  --color-brick: #962921;

  /* Typography — Font Families */
  --font-messina-sans: 'Messina Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.4;
  --tracking-caption: 0.98px;
  --text-body: 18px;
  --leading-body: 1.4;
  --tracking-body: -0.36px;
  --text-subheading: 20px;
  --leading-subheading: 1.4;
  --tracking-subheading: -0.4px;
  --text-heading-sm: 32px;
  --leading-heading-sm: 1.18;
  --tracking-heading-sm: -0.64px;
  --text-heading: 50px;
  --leading-heading: 1.18;
  --tracking-heading: -1px;
  --text-display: 80px;
  --leading-display: 1;
  --tracking-display: -1.6px;

  /* Typography — Weights */
  --font-weight-light: 300;
  --font-weight-w350: 350;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-13: 13px;
  --spacing-15: 15px;
  --spacing-17: 17px;
  --spacing-19: 19px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-30: 30px;
  --spacing-45: 45px;
  --spacing-60: 60px;

  /* Layout */
  --section-gap: 80-120px;
  --card-padding: 30px;
  --element-gap: 10-15px;

  /* Border Radius */
  --radius-full: 50px;

  /* Named Radii */
  --radius-tags: 50px;
  --radius-cards: 50px;
  --radius-buttons: 50px;

  /* Surfaces */
  --surface-paper: #ffffff;
  --surface-card: #ffffff;
  --surface-overlay: #000000;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-ink: #272727;
  --color-graphite: #717171;
  --color-ash: #949494;
  --color-fog: #cdcccc;
  --color-paper: #ffffff;
  --color-void: #000000;
  --color-ember: #e75a00;
  --color-signal-red: #c52910;
  --color-brick: #962921;

  /* Typography */
  --font-messina-sans: 'Messina Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.4;
  --tracking-caption: 0.98px;
  --text-body: 18px;
  --leading-body: 1.4;
  --tracking-body: -0.36px;
  --text-subheading: 20px;
  --leading-subheading: 1.4;
  --tracking-subheading: -0.4px;
  --text-heading-sm: 32px;
  --leading-heading-sm: 1.18;
  --tracking-heading-sm: -0.64px;
  --text-heading: 50px;
  --leading-heading: 1.18;
  --tracking-heading: -1px;
  --text-display: 80px;
  --leading-display: 1;
  --tracking-display: -1.6px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-13: 13px;
  --spacing-15: 15px;
  --spacing-17: 17px;
  --spacing-19: 19px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-30: 30px;
  --spacing-45: 45px;
  --spacing-60: 60px;

  /* Border Radius */
  --radius-full: 50px;
}
```
