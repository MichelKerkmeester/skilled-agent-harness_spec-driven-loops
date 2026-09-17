# Contra — Style Reference
> Editorial portfolio wall on white marble

**Theme:** light

Contra operates as a curated creative-marketplace gallery: a bright white editorial canvas where almost every element is either deep ink or hairline gray, and chromatic color only erupts inside challenge/category cards and the hero gradient wash. The system reads like a print portfolio — flat, photo-forward, grid-disciplined — with one near-black action color (Charcoal #222834) carrying all primary interactivity. Typography is a custom GT Standard family whose large display sizes (up to 58px) with tight -0.01em tracking give the hero a magazine-cover gravity, while compact 14–16px body text keeps the dense directory rows legible. Components favor pill shapes (24px buttons, 16–40px tags) and razor-thin 4px card corners, with elevation achieved through a soft two-layer charcoal shadow rather than heavy borders.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Ink | `#14171f` | `--color-ink` | Primary text, headings, icon strokes, hairline borders, deep surfaces — the near-black backbone that makes white space read as gallery rather than form |
| Paper | `#ffffff` | `--color-paper` | Primary canvas and card surface — the default ground for the entire directory |
| Mist | `#f5f6f9` | `--color-mist` | Secondary surface for subtle bands, input fills, and tag/chip backgrounds that need to sit just behind Paper |
| Hairline | `#e5e7eb` | `--color-hairline` | Borders, dividers, and outlined-button strokes — the thinnest visible structural line |
| Slate | `#677084` | `--color-slate` | Secondary body text and muted nav labels — never used as a primary heading color |
| Fog | `#9ba2b0` | `--color-fog` | Tertiary text, placeholder text, disabled labels |
| Graphite | `#373f51` | `--color-graphite` | Dark borders and separators for elevated surfaces and inverted UI. |
| Charcoal | `#222834` | `--color-charcoal` | Primary filled button background, elevated card surface, and tag pill fill — the single non-neutral action color |
| Deep Ink | `#050505` | `--color-deep-ink` | Heaviest text weight and maximum-contrast border accents on dark cards |
| Pearl | `#d0d4dc` | `--color-pearl` | Icon strokes on white surfaces and faint structural outlines |
| Iris | `#6a57e3` | `--color-iris` | Category/challenge card background — vivid violet used as one of the rotating card-fill colors |
| Lilac | `#ddd8ff` | `--color-lilac` | Soft violet wash for decorative surfaces and pale category cards |
| Orchid | `#cd74dd` | `--color-orchid` | Vivid pink-purple card fill in the category carousel |
| Wine | `#45192f` | `--color-wine` | Deep muted plum card fill in the category carousel |
| Coral | `#ff5a5e` | `--color-coral` | Warm red card fill in the category carousel and highlight badges |
| Lime | `#f0fb96` | `--color-lime` | Vivid green-yellow card fill and decorative wash — the brightest accent in the palette |
| Hero Wash | `linear-gradient(90deg, rgb(205, 243, 253), rgb(157, 222, 249) 42.88%, rgb(151, 157, 241) 94.62%)` | `--color-hero-wash` | Hero background gradient running from icy cyan through sky blue into soft violet — the only multi-color wash on the page |

## Tokens — Typography

### GT Standard M — Workhorse for body text, navigation, buttons, labels, input fields, and most headings up to 24px. The 15–16px body with tight -0.01em tracking and generous 1.50 line-height is what gives Contra its editorial-density feel without sacrificing legibility. · `--font-gt-standard-m`
- **Substitute:** Inter, Söhne, or Untitled Sans
- **Weights:** 400, 500, 600
- **Sizes:** 12, 14, 15, 16, 24
- **Line height:** 1.15–1.60
- **Letter spacing:** -0.0100em, 0.1000em
- **Role:** Workhorse for body text, navigation, buttons, labels, input fields, and most headings up to 24px. The 15–16px body with tight -0.01em tracking and generous 1.50 line-height is what gives Contra its editorial-density feel without sacrificing legibility.

### GT Standard L — Reserved for the largest display moments (the 58px hero headline) and small uppercase eyebrows (8px at 0.15em tracking). The 0.88–1.05 line-heights at display sizes let the headline 'Get more creative' sit on a single tight block — a magazine-cover move, not a UI move. · `--font-gt-standard-l`
- **Substitute:** GT Sectra, Tiempos Headline, or Canela
- **Weights:** 400, 500, 600
- **Sizes:** 8, 12, 19, 23, 58
- **Line height:** 0.88–1.47
- **Letter spacing:** -0.0100em, 0.0200em, 0.0500em, 0.1500em
- **Role:** Reserved for the largest display moments (the 58px hero headline) and small uppercase eyebrows (8px at 0.15em tracking). The 0.88–1.05 line-heights at display sizes let the headline 'Get more creative' sit on a single tight block — a magazine-cover move, not a UI move.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.4 | — | `--text-caption` |
| body-sm | 14px | 1.43 | -0.14px | `--text-body-sm` |
| body-lg | 16px | 1.6 | -0.16px | `--text-body-lg` |
| subheading | 19px | 1.33 | -0.19px | `--text-subheading` |
| heading-sm | 23px | 1.39 | -0.23px | `--text-heading-sm` |
| display | 58px | 1.05 | -0.58px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** compact

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 8 | 8px | `--spacing-8` |
| 12 | 12px | `--spacing-12` |
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 28 | 28px | `--spacing-28` |
| 32 | 32px | `--spacing-32` |
| 36 | 36px | `--spacing-36` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 60 | 60px | `--spacing-60` |
| 68 | 68px | `--spacing-68` |
| 72 | 72px | `--spacing-72` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 16px |
| tags | 32px |
| cards | 4px |
| inputs | 10px |
| buttons | 24px |
| largePills | 40px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| md | `rgba(34, 40, 52, 0.05) 0px 4px 10px 0px, rgba(34, 40, 52,...` | `--shadow-md` |
| subtle | `rgb(19, 24, 25) 0px 1px 3px 0px inset` | `--shadow-subtle` |
| lg | `rgba(0, 0, 0, 0.05) 0px 10px 20px 0px` | `--shadow-lg` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 64px
- **Card padding:** 12px
- **Element gap:** 8px

## Components

### Top Navigation Bar
**Role:** Site header with brand, primary links, and auth

White (#ffffff) background with a 1px Hairline (#e5e7eb) bottom border. Logo on the left (Contra wordmark + diamond glyph), three text links (Payments, Partnerships, Contra Labs) in Ink 16px medium, and a Charcoal (#222834) pill 'Sign up' button (24px radius, white text, 8px/16px padding) plus a text 'Log in' link on the right. Height sits around 64px with 16px horizontal padding.

### Segmented Tab Switcher
**Role:** Binary mode toggle (Hire / Get Hired)

Pill container with Mist (#f5f6f9) background, two equal segments. Active segment is Paper (#ffffff) with a soft shadow and Ink (#14171f) bold text; inactive is Slate (#677084). Container radius is 16px, segment text is 14px medium. Sits centered above the hero headline.

### Hero Search Bar
**Role:** Primary discovery input

Wide rounded container (~16px radius) with Mist background and Hairline border. Magnifier icon on the left, placeholder 'Discover 1.5M+ creatives' in Fog (#9ba2b0), and a Charcoal pill 'Search' button (24px radius, white text) anchored on the right. Total height around 56px, max-width around 720px, centered in the hero.

### Primary Filled Button
**Role:** Main call-to-action

Charcoal (#222834) background, white text, 24px border-radius, 7px/16px padding, GT Standard M 14–15px medium. Carries the signature two-layer soft shadow: rgba(34,40,52,0.05) 0 4px 10px and rgba(34,40,52,0.04) -2px 18px 18px. The shadow is what lifts the button off the page without using a hard border.

### Ghost / Outlined Button
**Role:** Secondary action

Transparent or Paper background with a 1px Hairline (#e5e7eb) border, Ink (#14171f) text, 24px radius, same 7px/16px padding as the filled variant. Used for lower-emphasis actions where a filled Charcoal would be too loud.

### Trending Topic Card
**Role:** Featured challenge or community card in the 4-column hero strip

4px radius card with a deep background (one of Iris, Wine, Orchid, Ink, or a photographic dark image). White headline at 19–23px, muted white description, and a footer row with participant count, post count, and a stacked-avatar cluster. Dark overlay scrims at ~40% opacity when a photo is the background. 12px internal padding, height around 180px.

### Category Tab Bar
**Role:** Filter chips for project directory

Horizontal row of text tabs. The first three (Projects, People, Featured) sit in a Mist (#f5f6f9) pill container; the active one is Paper (#ffffff) with a soft shadow. The remaining categories (Web developers, Content creators, etc.) are plain text links in Slate, becoming Ink on hover. Font is GT Standard M 15px medium.

### Section Header
**Role:** Title for each content band

Left-aligned GT Standard L 23px medium Ink headline with a one-line 14px Slate description directly below. A 'View more' or 'View community' text link in Graphite (#373f51) sits flush right. Below the header: 24px gap, then the content grid.

### Project Showcase Card
**Role:** Individual creator/portfolio thumbnail

4px radius card with Paper background and 1px Hairline border. Thumbnail image fills the top portion (no radius — full-bleed to card edge). Below: 12px padding containing a 14–15px Ink title and Slate meta line. Some variants invert to a Charcoal (#222834) card with white text for 'featured' selection.

### Featured Brand Card (e.g. Webflow Foundations)
**Role:** Sponsored/partner module

4px radius dark card (Ink #14171f or Charcoal #222834) with a brand logo top-left and a 'Learn more →' link top-right. Center contains a large white display headline at 23–58px. Acts as a visual contrast block against the white sections — the only place colored brand logos and inverted type appear at scale.

### Image Mosaic Grid
**Role:** 4-column gallery of large project thumbnails

4 equal-width columns, 8px gaps between tiles, each tile is a 4px-radius image with no caption. Used at the top of themed sections (e.g. 'Projects we love') to set visual rhythm before narrower content follows.

### Input Field
**Role:** Text input for search, email, filters

Mist (#f5f6f9) background, 10px radius, 1px Hairline border on focus transition to Ink. Placeholder text in Fog (#9ba2b0) 14px. Internal padding 12px vertical / 16px horizontal. No floating labels — label sits above as a 12px Slate caption.

### Pill Tag / Filter Chip
**Role:** Removable filter or category marker

16–40px radius, Mist background, Ink 14px text, 4–8px vertical / 12px horizontal padding. Optional close × in Slate. Used for selected filters, role tags, and the segmented switcher.

## Do's and Don'ts

### Do
- Use the 24px pill radius for every filled or outlined button; pair it with the 7px/16px padding and the two-layer charcoal shadow
- Set the hero headline at 58px / 1.05 line-height / -0.58px tracking in GT Standard L — it is the only place a display size is permitted
- Default to Charcoal (#222834) for any filled action; only switch to outlined or ghost when the action is secondary
- Keep the canvas Paper (#ffffff) and use Mist (#f5f6f9) for the rare secondary band; do not invent gray surfaces between them
- Apply the hero gradient only to the top hero region — never reuse it as a card or section background
- Rotate the accent palette (Iris, Orchid, Wine, Coral, Lime) for category/challenge cards, but never place two vivid accent cards adjacent to each other without a neutral spacer
- Anchor every section with the Section Header pattern: 23px headline left, Slate description below, Graphite 'View more' link right

### Don't
- Do not introduce a new button color — Charcoal is the only filled action in the system
- Do not use any border-radius other than the six defined (4, 10, 16, 24, 32, 40); intermediate values break the pill/sharp rhythm
- Do not place vivid accent colors (Orchid, Coral, Lime) on text, icons, or borders — they are exclusively card-fill roles
- Do not use GT Standard L below 19px — it is a display family and loses its identity at body sizes
- Do not add colored shadows, glows, or gradients to buttons or cards; the two-layer charcoal shadow is the entire shadow vocabulary
- Do not center body text in the directory sections — left-align all project, category, and section content; centering is reserved for the hero and the segmented switcher
- Do not stack more than one Charcoal card visually adjacent — alternate dark cards with a white row to keep contrast readable

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#ffffff` | Full-page background and primary card surface |
| 1 | Mist Band | `#f5f6f9` | Subtle background bands and input/chip fills |
| 2 | Charcoal Card | `#222834` | Elevated featured cards and dark mode sections |
| 3 | Ink Card | `#14171f` | Darkest card level used for trending topic and feature cards |

## Elevation

- **Primary Filled Button:** `rgba(34, 40, 52, 0.05) 0px 4px 10px 0px, rgba(34, 40, 52, 0.04) -2px 18px 18px 0px`
- **Active Segmented Tab:** `rgb(19, 24, 25) 0px 1px 3px 0px inset`
- **Sticky Navigation:** `rgba(0, 0, 0, 0.05) 0px 10px 20px 0px`

## Imagery

The visual language is portfolio-first photography: tight, high-quality project crops served at 4-column mosaic scale with no lifestyle context — the work itself is the hero. Dark/inverted 'challenge' cards use a 40% black scrim to keep white type legible over photography. There are no illustrations, no 3D renders, and no decorative graphics. Icons are minimal line-style (the Contra diamond mark, the search magnifier, simple chevrons) rendered in Ink at 1–1.5px stroke weight. The hero gradient is the only atmospheric visual on an otherwise editorial-white page.

## Layout

The page runs as a single max-width (~1200px) centered column on a Paper canvas. The hero is a centered stack: segmented switcher → 58px display headline → subhead → search bar → 4-column trending card strip, separated from the directory by a Trending Topics eyebrow. Below the hero, the page alternates white section bands: each band opens with the Section Header (title left, View more right), then a 4-column image mosaic, sometimes followed by 2-column featured dark-card modules. The category tab bar acts as a horizontal divider between the hero and the first content section. Vertical rhythm is driven by 64px section gaps and 8–12px internal element gaps, with grids consistently at 4 columns for project thumbnails and 2 columns for sponsored/featured modules.

## Agent Prompt Guide

**Quick Color Reference**
- text: #14171f (Ink)
- background: #ffffff (Paper)
- secondary surface: #f5f6f9 (Mist)
- border: #e5e7eb (Hairline)
- accent card fills: #6a57e3 (Iris), #cd74dd (Orchid), #45192f (Wine), #ff5a5e (Coral), #f0fb96 (Lime)
- primary action: #222834 (filled action)

**Example Component Prompts**
1. *Build the hero*: Paper (#ffffff) canvas. Top nav: white with 1px Hairline (#e5e7eb) bottom border, Contra wordmark + 3 text links (Payments, Partnerships, Contra Labs) in Ink 16px medium, and a Charcoal (#222834) pill 'Sign up' button (24px radius, white text, 7px/16px padding, two-layer charcoal shadow). Below nav: centered Segmented Tab Switcher (HIRE active / GET HIRED inactive) with Mist (#f5f6f9) pill background, 16px radius, Paper active segment with inset shadow. Then GT Standard L 58px / 1.05 line-height / -0.58px tracking Ink headline 'Get more creative', then a 15px Slate subhead, then the Hero Search Bar (Mist fill, 16px radius, Hairline border, 'Discover 1.5M+ creatives' placeholder in Fog, Charcoal 'Search' button anchored right).

2. *Build a Trending Topic Card row*: 4-column grid, 8px gap, each card 4px radius, ~180px tall. Rotate backgrounds across Iris (#6a57e3), Ink (#14171f) with photo, Wine (#45192f), and a dark photo with 40% black scrim. White 19–23px headline top-left, Slate-on-dark description below, footer row with participant count + post count in white 12px and a stacked-avatar cluster on the right.

3. *Build a Section Header + project grid*: Section Header — GT Standard L 23px medium Ink title left, 14px Slate description below, Graphite (#373f51) 'View more' link right. 24px gap, then 4-column project showcase grid: each card 4px radius, Paper background, 1px Hairline border, full-bleed thumbnail on top, 12px padding below with 14–15px Ink title and Slate meta line.

4. *Build a Featured Brand Card (dark)*: 4px radius Charcoal (#222834) card, brand logo top-left in white, 'Learn more →' link top-right in white, centered GT Standard L 23–58px white display headline. Sits as a single visual contrast block in an otherwise white section.

5. *Build the Input Field*: Mist (#f5f6f9) fill, 10px radius, 1px Hairline border (transition to Ink on focus), 12px/16px padding, Fog (#9ba2b0) 14px placeholder, with a 12px Slate caption label sitting 6px above the field.

## Accent Card System

The five vivid colors (Iris, Orchid, Wine, Coral, Lime) plus deep Ink operate as a rotating deck for category, challenge, and community cards. They are not a free-form accent system — they are a fixed set that gets permuted across card slots to create variety in a repeating grid. When a slot needs to feature photography instead of a flat fill, Ink (#14171f) with a 40% black scrim substitutes for the chromatic fill, preserving the visual weight without introducing a new color. Lilac (#ddd8ff) is reserved for pale decorative washes and should never appear in the rotating card deck.

## Similar Brands

- **Behance** — Same portfolio-gallery structure with a near-black/white palette and rotating colored category cards across 4-column grids
- **Dribbble** — Light editorial canvas, hairline-gray cards, and the same anti-decorative philosophy where the work carries all the color
- **Webflow** — Similar pill-shaped Charcoal CTA buttons with the signature two-layer soft shadow, and the same max-width centered hero with a single large display headline
- **Read.cv** — Identical anti-illustration stance — the homepage is wall-to-wall creator photography with white surfaces and hairline borders doing all the structural work
- **Cargo** — Same editorial-portfolio density: compact type, tight tracking, and 4-column image grids separated by section headers with right-aligned 'View more' links

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-ink: #14171f;
  --color-paper: #ffffff;
  --color-mist: #f5f6f9;
  --color-hairline: #e5e7eb;
  --color-slate: #677084;
  --color-fog: #9ba2b0;
  --color-graphite: #373f51;
  --color-charcoal: #222834;
  --color-deep-ink: #050505;
  --color-pearl: #d0d4dc;
  --color-iris: #6a57e3;
  --color-lilac: #ddd8ff;
  --color-orchid: #cd74dd;
  --color-wine: #45192f;
  --color-coral: #ff5a5e;
  --color-lime: #f0fb96;
  --color-hero-wash: #9ddef9;
  --gradient-hero-wash: linear-gradient(90deg, rgb(205, 243, 253), rgb(157, 222, 249) 42.88%, rgb(151, 157, 241) 94.62%);

  /* Typography — Font Families */
  --font-gt-standard-m: 'GT Standard M', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-gt-standard-l: 'GT Standard L', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.4;
  --text-body-sm: 14px;
  --leading-body-sm: 1.43;
  --tracking-body-sm: -0.14px;
  --text-body-lg: 16px;
  --leading-body-lg: 1.6;
  --tracking-body-lg: -0.16px;
  --text-subheading: 19px;
  --leading-subheading: 1.33;
  --tracking-subheading: -0.19px;
  --text-heading-sm: 23px;
  --leading-heading-sm: 1.39;
  --tracking-heading-sm: -0.23px;
  --text-display: 58px;
  --leading-display: 1.05;
  --tracking-display: -0.58px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-60: 60px;
  --spacing-68: 68px;
  --spacing-72: 72px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 64px;
  --card-padding: 12px;
  --element-gap: 8px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 10px;
  --radius-2xl: 16px;
  --radius-3xl: 24px;
  --radius-3xl-2: 32px;
  --radius-3xl-3: 40px;
  --radius-full: 63px;
  --radius-full-2: 100px;

  /* Named Radii */
  --radius-nav: 16px;
  --radius-tags: 32px;
  --radius-cards: 4px;
  --radius-inputs: 10px;
  --radius-buttons: 24px;
  --radius-largepills: 40px;

  /* Shadows */
  --shadow-md: rgba(34, 40, 52, 0.05) 0px 4px 10px 0px, rgba(34, 40, 52, 0.04) -2px 18px 18px 0px;
  --shadow-subtle: rgb(19, 24, 25) 0px 1px 3px 0px inset;
  --shadow-lg: rgba(0, 0, 0, 0.05) 0px 10px 20px 0px;

  /* Surfaces */
  --surface-canvas: #ffffff;
  --surface-mist-band: #f5f6f9;
  --surface-charcoal-card: #222834;
  --surface-ink-card: #14171f;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-ink: #14171f;
  --color-paper: #ffffff;
  --color-mist: #f5f6f9;
  --color-hairline: #e5e7eb;
  --color-slate: #677084;
  --color-fog: #9ba2b0;
  --color-graphite: #373f51;
  --color-charcoal: #222834;
  --color-deep-ink: #050505;
  --color-pearl: #d0d4dc;
  --color-iris: #6a57e3;
  --color-lilac: #ddd8ff;
  --color-orchid: #cd74dd;
  --color-wine: #45192f;
  --color-coral: #ff5a5e;
  --color-lime: #f0fb96;
  --color-hero-wash: #9ddef9;

  /* Typography */
  --font-gt-standard-m: 'GT Standard M', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-gt-standard-l: 'GT Standard L', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.4;
  --text-body-sm: 14px;
  --leading-body-sm: 1.43;
  --tracking-body-sm: -0.14px;
  --text-body-lg: 16px;
  --leading-body-lg: 1.6;
  --tracking-body-lg: -0.16px;
  --text-subheading: 19px;
  --leading-subheading: 1.33;
  --tracking-subheading: -0.19px;
  --text-heading-sm: 23px;
  --leading-heading-sm: 1.39;
  --tracking-heading-sm: -0.23px;
  --text-display: 58px;
  --leading-display: 1.05;
  --tracking-display: -0.58px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-60: 60px;
  --spacing-68: 68px;
  --spacing-72: 72px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 10px;
  --radius-2xl: 16px;
  --radius-3xl: 24px;
  --radius-3xl-2: 32px;
  --radius-3xl-3: 40px;
  --radius-full: 63px;
  --radius-full-2: 100px;

  /* Shadows */
  --shadow-md: rgba(34, 40, 52, 0.05) 0px 4px 10px 0px, rgba(34, 40, 52, 0.04) -2px 18px 18px 0px;
  --shadow-subtle: rgb(19, 24, 25) 0px 1px 3px 0px inset;
  --shadow-lg: rgba(0, 0, 0, 0.05) 0px 10px 20px 0px;
}
```
