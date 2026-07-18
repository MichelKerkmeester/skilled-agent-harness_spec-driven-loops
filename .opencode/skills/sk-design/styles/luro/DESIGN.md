# Luro — Style Reference
> Crimson laser chamber. Deep obsidian walls, every surface ringed in hot pink plasma.

**Theme:** dark

Luro operates as a dark cinematic showcase where the product floats on near-obsidian canvas and every card emits a hot crimson halo. The signature isn't a surface color — it's a shadow: a wide pink plasma glow that lifts cards off the void and makes the UI feel like neon signage in a dark room. Typography is geometric and tightly tracked in Graphik, with negative letter-spacing pulling the large display headlines into a single dense block. Layout is spacious and centered, with a product screenshot hero above a 4-up media grid, then alternating feature blocks. The visual economy is extreme: a few card variants, a pill button, and one consistent glow shadow do all the work.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Obsidian Void | `#10020a` | `--color-obsidian-void` | Page canvas and primary surface background — the near-black that everything floats above |
| Dark Mulberry | `#1e0313` | `--color-dark-mulberry` | Elevated card surface — the second tier above the canvas, slightly warmed by the glow that surrounds it |
| Frost White | `#ffffff` | `--color-frost-white` | Primary text, hairline borders, nav links, and icon fills on dark surfaces |
| Soft Chalk | `#f2f2f2` | `--color-soft-chalk` | Light surface fill for product mockup cards and inner product UI panels |
| Plasma Pink | `#ff0068` | `--color-plasma-pink` | Red supporting accent for decorative details and low-frequency emphasis |
| Deep Crimson | `#91013d` | `--color-deep-crimson` | Wide outer glow color — the broad pink wash that bleeds 99px from card edges into the void |
| Ruby Shadow | `#700130` | `--color-ruby-shadow` | Largest ambient glow spread — the most diffuse layer of the multi-stop shadow stack |
| Magenta Wine | `#9f0142` | `--color-magenta-wine` | Secondary glow tint on product image frames; the slightly warmer pink in the shadow gradient |

## Tokens — Typography

### Graphik Web — Primary typeface for all UI — nav, body, buttons, headings, and the display hero. Negative letter-spacing tightens every size from 14px up; the 104px display sits at -0.046em so the two-line headline reads as a single dense block. Weight 600 is the workhorse for nav and button labels, 700 for hero, 400 for body. · `--font-graphik-web`
- **Substitute:** Inter, Söhne, Geist
- **Weights:** 400, 600, 700
- **Sizes:** 14, 16, 18, 28, 34, 40, 51, 62, 104
- **Line height:** 1.20, 1.25, 1.30, 1.50, 1.65, 2.00
- **Letter spacing:** -0.046em at 104px, -0.038em at 62px, -0.032em at 51px, -0.025em at 40px, -0.021em at 34px, -0.012em at 14-18px
- **OpenType features:** `"ss01" on, "cv11" on`
- **Role:** Primary typeface for all UI — nav, body, buttons, headings, and the display hero. Negative letter-spacing tightens every size from 14px up; the 104px display sits at -0.046em so the two-line headline reads as a single dense block. Weight 600 is the workhorse for nav and button labels, 700 for hero, 400 for body.

### Graphik Cond Web — Rare display variant for the gradient section heading — the condensed width creates a horizontal banner feel distinct from the upright display sizes · `--font-graphik-cond-web`
- **Substitute:** Inter Tight, Barlow Condensed
- **Weights:** 400
- **Sizes:** 38
- **Line height:** 1.00
- **Letter spacing:** normal
- **Role:** Rare display variant for the gradient section heading — the condensed width creates a horizontal banner feel distinct from the upright display sizes

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 14px | 1.5 | -0.012px | `--text-caption` |
| body-sm | 16px | 1.5 | -0.012px | `--text-body-sm` |
| body | 18px | 1.5 | -0.012px | `--text-body` |
| subheading | 28px | 1.3 | -0.021px | `--text-subheading` |
| heading-sm | 34px | 1.25 | -0.021px | `--text-heading-sm` |
| heading | 40px | 1.2 | -0.025px | `--text-heading` |
| heading-lg | 51px | 1.2 | -0.032px | `--text-heading-lg` |
| display | 62px | 1.1 | -0.038px | `--text-display` |
| display-lg | 104px | 0.95 | -0.046px | `--text-display-lg` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** spacious

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 8 | 8px | `--spacing-8` |
| 12 | 12px | `--spacing-12` |
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 28 | 28px | `--spacing-28` |
| 32 | 32px | `--spacing-32` |
| 36 | 36px | `--spacing-36` |
| 60 | 60px | `--spacing-60` |
| 64 | 64px | `--spacing-64` |
| 68 | 68px | `--spacing-68` |
| 72 | 72px | `--spacing-72` |
| 112 | 112px | `--spacing-112` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 24px |
| images | 24px |
| inputs | 12px |
| buttons | 180px |
| featureBlock | 24px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| xl | `rgba(255, 0, 104, 0.54) 0px 0px 33px 0px, rgba(255, 0, 10...` | `--shadow-xl` |
| lg | `rgba(255, 0, 104, 0.9) 0px 0px 21px -5px, rgba(255, 0, 10...` | `--shadow-lg` |
| xl-2 | `rgba(255, 0, 104, 0.36) 0px 0px 90px 0px` | `--shadow-xl-2` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 96px
- **Card padding:** 32px
- **Element gap:** 16px

## Components

### Glow Product Card
**Role:** Primary card pattern — a product screenshot or feature visual on a dark surface ringed by a pink plasma halo

Obsidian or Mulberry card surface (#10020a or #1e0313), 24px radius, 32px internal padding, box-shadow stack: 0 0 33px 0 rgba(255,0,104,0.54) and 0 0 99px -21px rgba(255,0,104,0.4). Contains a product image at 24px radius, optional caption, and play-button affordance centered over the image.

### Glow Feature Block
**Role:** Two-column feature panel — illustration on the left, title and description on the right

Mulberry card surface (#1e0313), 24px radius, 32px padding, 80px ambient glow: 0 0 90px 0 rgba(255,0,104,0.36). Title at 28-34px Graphik 700 in Frost White, description at 16-18px Graphik 400 in Frost White at 70% opacity.

### Pill Button
**Role:** Primary action shape — fully rounded pill with the same glow treatment as cards

180px border-radius (extreme pill), 14px vertical and 24px horizontal padding, Graphik 600 at 16px, Frost White text on Mulberry surface. Box-shadow: 0 0 33px 0 rgba(255,0,104,0.54) plus the wide 99px spread. Used sparingly — the site is primarily showcase, not action-driven.

### Ghost Nav Link
**Role:** Text-only navigation item, no fill or border

Graphik 600 at 16px, Frost White, no background, no border. Top-right 'Blog' link uses this treatment; active state is the same weight and color (the nav is intentionally flat).

### Brand Lockup
**Role:** Wordmark + symbol in the top-left of every page

White mark in a 36px circular container with a thin Frost White hairline border, followed by 'LURO' in Graphik 700 at 18-20px, letter-spacing -0.021em, Frost White. The circular mark has the same hairline ring used on avatar and badge containers throughout.

### Stat Badge (Floating Metric Card)
**Role:** Compact data badge floating beside the hero — the '91% Design system adoption' pattern

Mulberry surface (#1e0313), 24px radius, 16-20px padding, pink plasma glow. Contains a circular progress ring (2px stroke, Plasma Pink #ff0068) and a Graphik 700 number in Frost White with a 14px Graphik 400 label in Frost White at 60% opacity.

### Product Video Tile
**Role:** Clickable video thumbnail in the 4-up media grid

Product screenshot on a Mulberry surface, 24px radius, centered circular play button at 48px diameter — solid Obsidian fill with a Frost White triangle. The same two-stop glow stack as the Glow Product Card.

### Section Heading (Gradient)
**Role:** Display heading for mid-page sections — 'Built for your workflow' pattern

Graphik Cond Web 400 at 38px, line-height 1.0, no letter-spacing adjustment. Fill is a horizontal pink gradient (Plasma Pink #ff0068 to a lighter rose), with a soft horizontal glow band running behind the text. Centered above the section description at 18px Graphik 400 in Frost White at 60% opacity.

### Hairline Divider
**Role:** 1px separator between nav items, card edges, and footer sections

1px solid Frost White at 8-12% opacity, full-width or 24px rounded, no shadow. The only non-glow structural separator in the system.

## Do's and Don'ts

### Do
- Use the two-stop pink plasma shadow stack (0 0 33px 0 rgba(255,0,104,0.54) + 0 0 99px -21px rgba(255,0,104,0.4)) on every card and image — that halo IS the elevation language
- Set border-radius to 24px on all cards, images, and feature blocks; reserve 180px for the pill button only
- Tighten letter-spacing progressively as size grows: -0.012em at 14-18px, -0.025em at 40px, -0.046em at 104px display
- Pair Frost White text with the deep canvas (#10020a) or the warmer Mulberry (#1e0313) — never place white text on a flat mid-gray
- Use weight 600 for nav and buttons, 700 for headings, 400 for body — do not introduce 500
- Center the hero composition and let the 91% stat badge float to the right with its own ring, breaking the symmetrical headline block
- Let product screenshots sit on the light Chalk surface (#f2f2f2) inside the dark card — the contrast between the void and the bright product is the page's structural rhythm

### Don't
- Do not use a gray or black drop shadow — any non-pink shadow will break the brand instantly
- Do not use a square or 4-8px radius on a primary card — the 24px curve is what makes the glow read as a soft halo rather than a hard box
- Do not set the Plasma Pink (#ff0068) as a fill on a large surface — it should only appear as a thin stroke, an icon accent, or a shadow color
- Do not use weight 500 — the system jumps from 400 to 600, and 500 reads as washed out against the tight tracking
- Do not place body text at 70% opacity on light surfaces — the muted opacity treatment is only for text on the dark canvas
- Do not use a 1-2px border to create card edges — cards are defined entirely by their glow and surface step, not by outlines
- Do not mix two heading typefaces on the same screen — Graphik Cond is reserved for a single gradient section heading per page; everything else is Graphik Web

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Obsidian Canvas | `#10020a` | Page-wide background — the void everything sits on |
| 1 | Mulberry Card | `#1e0313` | Elevated card and feature block surface — reads as a step up from the canvas even in the dark |
| 2 | Chalk Product | `#f2f2f2` | Inverted light surface used inside product mockup panels and the product card browser frame |

## Elevation

- **Glow Card (primary):** `0 0 33px 0 rgba(255,0,104,0.54), 0 0 99px -21px rgba(255,0,104,0.4)`
- **Glow Image Frame:** `0 0 21px -5px rgba(255,0,104,0.9), 0 0 27px -3px rgba(255,0,104,0.6)`
- **Glow Feature Block:** `0 0 90px 0 rgba(255,0,104,0.36)`

## Imagery

The visual language is screenshot-first and dark. The hero is a single large product dashboard mockup (line chart, data table, sidebar) sitting on the dark canvas with the pink plasma halo — no lifestyle photography, no abstract illustration. Below the hero, a 4-up grid of video thumbnails repeats the same dashboard family (overview, button component, colors, components inventory) with circular play buttons centered. Feature blocks use small UI-crop illustrations: a Figma sync node connected to a sync icon, a Figma/CodePen/ProtoPie icon stack beside a sign-up form mockup, a button wireframe. Every illustration is white-line or chrome-on-dark, never colorful. Photography and 3D renders are absent — the product UI is the imagery, and the glow shadows are the atmosphere.

## Layout

Max-width 1200px centered container. The page is a vertical stack of distinct, well-separated sections rather than a continuous scroll. Hero is a split: left-aligned two-line headline (104px Graphik 700, two lines, tight tracking) with a 16-18px description below, and a floating stat badge to the right at the vertical center of the headline. Below the hero, a single product mockup card spans nearly full-width. The mid-page has a centered gradient section heading above a 2-column feature grid (cards with illustration-on-left, text-on-right). A 4-column video grid sits in the lower third. Navigation is a minimal top bar: brand lockup left, a single text link right. Section gaps are generous (80-96px) to let the glow halos breathe without bleeding into each other.

## Agent Prompt Guide

Quick Color Reference:
- text: #ffffff (Frost White)
- background: #10020a (Obsidian Void)
- card surface: #1e0313 (Dark Mulberry)
- product surface: #f2f2f2 (Soft Chalk)
- border / hairline: #ffffff at 8-12% opacity
- accent stroke: #ff0068 (Plasma Pink) — icons, rings, gradient text only
- primary action: no distinct CTA color

Example Component Prompts:

1. Create a glow feature block: Mulberry surface (#1e0313), 24px radius, 32px padding, ambient box-shadow 0 0 90px 0 rgba(255,0,104,0.36). Left side: a 40px white-line icon of a connected node. Right side: title at 28px Graphik 700 weight in Frost White with -0.021em letter-spacing, then 16px Graphik 400 description in Frost White at 70% opacity.

2. Create a hero product card: Chalk (#f2f2f2) inner surface on a Mulberry (#1e0313) card, 24px radius, 32px padding, box-shadow 0 0 33px 0 rgba(255,0,104,0.54) + 0 0 99px -21px rgba(255,0,104,0.4). Inside the chalk surface render a browser frame with traffic-light dots top-left, a 40px heading, and a 4-row data table with red and gray progress bars.

3. Create a stat badge: Mulberry surface (#1e0313), 24px radius, 20px padding, full plasma glow stack. Left: a 48px circular ring with 2px Plasma Pink (#ff0068) stroke, 75% filled. Right: '91%' at 28px Graphik 700 Frost White above 'Metric label' at 14px Graphik 400 Frost White at 60% opacity.

4. Create a gradient section heading: 38px Graphik Cond Web 400, line-height 1.0, no letter-spacing adjustment, fill a horizontal linear gradient from #ff0068 to a lighter rose. Behind the text, a soft horizontal pink glow band at 20% opacity spanning the full container width.

5. Create the top navigation: 1200px max-width centered row with 20px vertical padding. Left: 36px circular Frost White hairline-bordered brand mark followed by 'LURO' in Graphik 700 at 18px Frost White with -0.021em letter-spacing. Right: a single 'Link' in Graphik 600 at 16px Frost White, no border or background.

## Color Naming Logic

The chromatic palette (#700130, #91013d, #9f0142, #ff0068) is not a fill palette — it is a shadow stack. Each hex represents a different layer of the same plasma glow: the tightest, brightest, smallest spread is #ff0068 (Plasma Pink); the wide warm wash is #91013d (Deep Crimson); the most diffuse outer falloff is #700130 (Ruby Shadow). When building cards or images, always use the full multi-stop stack — never a single shadow. The visible difference between 'tight halo' and 'soft nebula' is what gives the system its depth.

## Similar Brands

- **Linear** — Same dark cinematic canvas with tightly tracked geometric sans display headlines and a single saturated accent for interactive states
- **Vercel** — Same obsidian-on-near-black surface stack with generous glow halos around hero cards and ultra-tight negative letter-spacing on large display type
- **Pitch** — Same dark UI with a vivid neon accent (Pitch uses purple, Luro uses pink) used as gradient fills and icon strokes rather than large surface fills
- **Raycast** — Same minimal top nav with brand mark left and a single text action right, paired with a product-screenshot hero floating on a near-black canvas

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-obsidian-void: #10020a;
  --color-dark-mulberry: #1e0313;
  --color-frost-white: #ffffff;
  --color-soft-chalk: #f2f2f2;
  --color-plasma-pink: #ff0068;
  --color-deep-crimson: #91013d;
  --color-ruby-shadow: #700130;
  --color-magenta-wine: #9f0142;

  /* Typography — Font Families */
  --font-graphik-web: 'Graphik Web', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-graphik-cond-web: 'Graphik Cond Web', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.5;
  --tracking-caption: -0.012px;
  --text-body-sm: 16px;
  --leading-body-sm: 1.5;
  --tracking-body-sm: -0.012px;
  --text-body: 18px;
  --leading-body: 1.5;
  --tracking-body: -0.012px;
  --text-subheading: 28px;
  --leading-subheading: 1.3;
  --tracking-subheading: -0.021px;
  --text-heading-sm: 34px;
  --leading-heading-sm: 1.25;
  --tracking-heading-sm: -0.021px;
  --text-heading: 40px;
  --leading-heading: 1.2;
  --tracking-heading: -0.025px;
  --text-heading-lg: 51px;
  --leading-heading-lg: 1.2;
  --tracking-heading-lg: -0.032px;
  --text-display: 62px;
  --leading-display: 1.1;
  --tracking-display: -0.038px;
  --text-display-lg: 104px;
  --leading-display-lg: 0.95;
  --tracking-display-lg: -0.046px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-36: 36px;
  --spacing-60: 60px;
  --spacing-64: 64px;
  --spacing-68: 68px;
  --spacing-72: 72px;
  --spacing-112: 112px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 96px;
  --card-padding: 32px;
  --element-gap: 16px;

  /* Border Radius */
  --radius-xl: 12px;
  --radius-2xl: 18px;
  --radius-3xl: 24px;
  --radius-full: 180px;
  --radius-full-2: 1800px;

  /* Named Radii */
  --radius-cards: 24px;
  --radius-images: 24px;
  --radius-inputs: 12px;
  --radius-buttons: 180px;
  --radius-featureblock: 24px;

  /* Shadows */
  --shadow-xl: rgba(255, 0, 104, 0.54) 0px 0px 33px 0px, rgba(255, 0, 104, 0.4) 0px 0px 99px -21px;
  --shadow-lg: rgba(255, 0, 104, 0.9) 0px 0px 21px -5px, rgba(255, 0, 104, 0.6) 0px 0px 27px -3px;
  --shadow-xl-2: rgba(255, 0, 104, 0.36) 0px 0px 90px 0px;

  /* Surfaces */
  --surface-obsidian-canvas: #10020a;
  --surface-mulberry-card: #1e0313;
  --surface-chalk-product: #f2f2f2;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-obsidian-void: #10020a;
  --color-dark-mulberry: #1e0313;
  --color-frost-white: #ffffff;
  --color-soft-chalk: #f2f2f2;
  --color-plasma-pink: #ff0068;
  --color-deep-crimson: #91013d;
  --color-ruby-shadow: #700130;
  --color-magenta-wine: #9f0142;

  /* Typography */
  --font-graphik-web: 'Graphik Web', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-graphik-cond-web: 'Graphik Cond Web', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.5;
  --tracking-caption: -0.012px;
  --text-body-sm: 16px;
  --leading-body-sm: 1.5;
  --tracking-body-sm: -0.012px;
  --text-body: 18px;
  --leading-body: 1.5;
  --tracking-body: -0.012px;
  --text-subheading: 28px;
  --leading-subheading: 1.3;
  --tracking-subheading: -0.021px;
  --text-heading-sm: 34px;
  --leading-heading-sm: 1.25;
  --tracking-heading-sm: -0.021px;
  --text-heading: 40px;
  --leading-heading: 1.2;
  --tracking-heading: -0.025px;
  --text-heading-lg: 51px;
  --leading-heading-lg: 1.2;
  --tracking-heading-lg: -0.032px;
  --text-display: 62px;
  --leading-display: 1.1;
  --tracking-display: -0.038px;
  --text-display-lg: 104px;
  --leading-display-lg: 0.95;
  --tracking-display-lg: -0.046px;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-36: 36px;
  --spacing-60: 60px;
  --spacing-64: 64px;
  --spacing-68: 68px;
  --spacing-72: 72px;
  --spacing-112: 112px;

  /* Border Radius */
  --radius-xl: 12px;
  --radius-2xl: 18px;
  --radius-3xl: 24px;
  --radius-full: 180px;
  --radius-full-2: 1800px;

  /* Shadows */
  --shadow-xl: rgba(255, 0, 104, 0.54) 0px 0px 33px 0px, rgba(255, 0, 104, 0.4) 0px 0px 99px -21px;
  --shadow-lg: rgba(255, 0, 104, 0.9) 0px 0px 21px -5px, rgba(255, 0, 104, 0.6) 0px 0px 27px -3px;
  --shadow-xl-2: rgba(255, 0, 104, 0.36) 0px 0px 90px 0px;
}
```
