# Fiverr.com — Style Reference
> Digital bazaar spotlight — vivid green pulse on dark theatrical stages. One neon-green period anchors the wordmark; everything else is monochrome staging built to make service offerings glow.

**Theme:** mixed

Fiverr operates as a marketplace stage where bright white product surfaces meet dark theatrical backdrops, bound by one vivid signature green that signals trust and transaction. The custom Macan typeface carries an unusually wide weight range — from ultra-light 280 display headlines to bold 700 callouts — with aggressive negative tracking at large sizes pulling the type tight against itself. Pill-shaped controls, 16px-radius cards, and a single soft shadow create a tactile marketplace UI that feels approachable rather than corporate. The dark green (#003912) service category cards function as a secondary brand surface — categories literally sit on green-tinted stages, reinforcing identity through repetition.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Fiverr Green | `#1dbf73` | `--color-fiverr-green` | Logo dot, link color, category tag pill borders, selected states, brand iconography — the single chromatic pulse that anchors identity; used sparingly so it reads as signal, not decoration |
| Forest Stage | `#003912` | `--color-forest-stage` | Service category card backgrounds in Popular Services and Pro sections — dark tinted-green surfaces that make category thumbnails glow like products under stage lighting |
| Carbon | `#222325` | `--color-carbon` | Primary text, filled button background, dark promotional banner backgrounds, body borders — the matte-black backbone of the entire interface |
| Graphite | `#62646a` | `--color-graphite` | Secondary text, subtle borders, list dividers, navigation borders — the most-used neutral; handles 80% of structural hairlines |
| Paper | `#ffffff` | `--color-paper` | Page surfaces, card surfaces, input fills, text on dark backgrounds — the canvas |
| Mist | `#dadbdd` | `--color-mist` | Lightest structural border, footer hairlines, soft dividers |
| Fog | `#c5c6c9` | `--color-fog` | Input field default borders, subtle form separators |
| Slate | `#404145` | `--color-slate` | Heading text alternative, icon fills when slightly softer than Carbon is needed |
| Smoke | `#74767e` | `--color-smoke` | Tertiary helper text, inactive nav items, muted icon fills |

## Tokens — Typography

### Macan — Sole typeface across every surface — custom geometric sans with a humanist warmth. The 280 ultralight weight is the headline signature: whisper-thin display type at 72px with -0.06em tracking creates editorial weightlessness that most marketplace UIs reject in favor of bold confidence. Body sits at 400, navigation and tags at 600, CTAs at 700. · `--font-macan`
- **Substitute:** Inter or DM Sans
- **Weights:** 280, 400, 600, 700
- **Sizes:** 10, 14, 16, 18, 48, 72
- **Line height:** 1.00, 1.05, 1.20, 1.50, 1.56, 1.57, 2.40
- **Letter spacing:** -0.06em at 72px display, -0.03em at 48px heading, normal below
- **Role:** Sole typeface across every surface — custom geometric sans with a humanist warmth. The 280 ultralight weight is the headline signature: whisper-thin display type at 72px with -0.06em tracking creates editorial weightlessness that most marketplace UIs reject in favor of bold confidence. Body sits at 400, navigation and tags at 600, CTAs at 700.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 10px | 1.56 | — | `--text-caption` |
| body-sm | 14px | 1.57 | — | `--text-body-sm` |
| body | 16px | 1.5 | — | `--text-body` |
| subheading | 18px | 1.2 | — | `--text-subheading` |
| heading-lg | 48px | 1.05 | -1.44px | `--text-heading-lg` |
| display | 72px | 1 | -4.32px | `--text-display` |

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
| 28 | 28px | `--spacing-28` |
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 56 | 56px | `--spacing-56` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 4px |
| cards | 16px |
| pills | 9999px |
| inputs | 12px |
| buttons | 8px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| md | `rgba(0, 0, 0, 0.13) 0px 3px 10px 0px` | `--shadow-md` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 40px
- **Card padding:** 16px
- **Element gap:** 12px

## Components

### Primary Filled Button
**Role:** Top-level action (Join, Find your AI Director, Join now)

Carbon #222325 fill, white text, Macan 600 at 16px, 8px corner radius, 16px vertical / 16px horizontal padding, no border. The dark-on-light button is the default action; it sits quietly against the white canvas and loud against the dark stage.

### Green Outlined Pill
**Role:** Category quick-link tag (Website Development, UGC Videos, etc.)

Transparent fill, 1.5px #1dbf73 border, #1dbf73 text and arrow icon, Macan 400 at 16px, 9999px full-pill radius, 8px vertical / 16px horizontal padding. Multiple pills sit in a horizontal row beneath the hero search; the green border is the only chromatic signal on the hero.

### Ghost Text Link
**Role:** Sign in, Become a Seller, inline footer links

No fill, no border, #222325 or #62646a text at Macan 400 16px, 4px vertical padding. Becomes #1dbf73 on hover for in-content links.

### Hero Search Bar
**Role:** Primary entry point — service discovery

White #ffffff fill, #dadbdd 1px border, 4px radius, 16px vertical / 20px horizontal padding. Dark Carbon square search button docked on the right with white magnifying glass icon, 48×48px touch target. Placeholder text in #74767 Smoke at Macan 400 16px.

### Service Category Card (Dark Green Stage)
**Role:** Popular Services grid card — Website Dev, Video Editing, etc.

Forest Stage #003912 background, 16px radius, 25px top padding, single soft shadow rgba(0,0,0,0.13) 0px 3px 10px. White Macan 600 16px category title top-left. Full-bleed category illustration (laptop, camera, book mockup) sits in the lower 60% with slight padding. Six cards per row, horizontal scroll on overflow.

### Feature Benefit Row Item
**Role:** Icon + caption in the 'Make it all happen with freelancers' row

No card surface. Line-icon at 32×32 in #222325 stroke, Macan 400 14px caption text in #404145, 12px column gap between icon and text. Four items in a single row, evenly spaced across the container width.

### Dark Promotional Banner
**Role:** AI Director / Fiverr Pro full-bleed section

Carbon #222325 or Forest Stage #003912 full-width background, generous 64px+ vertical padding. White display headline at Macan 280 / 48px, white subtext at Macan 400 16px. Ghost white-outlined Filled Button docked right or bottom-left. Image carousel or stacked portrait cards float on the right side.

### Freelancer Portrait Card
**Role:** AI Director carousel — stacked freelancer photos

Carbon #222325 rounded background 12px radius, full-bleed square freelancer photo, white Macan 600 14px name overlaid bottom-left, category caption in #62646a below name. Cards are 140–160px wide, overlap each other by ~20px to create a layered carousel effect.

### Category Icon Strip
**Role:** Bottom-of-hero horizontal category navigation

Eight to ten items in a single row, equal width. Line-icon at 32×32 in #222325 stroke above Macan 400 14px label in #404145. 16px gap between icon and label, 12px between items. No card, no background — icons sit directly on the white canvas.

### Top Navigation Bar
**Role:** Persistent site header

White #ffffff background, 64px height, hairline #dadbdd bottom border. Left: Fiverr wordmark with green period. Center: inline search bar (Hero Search Bar, compacted to 400px). Right: Fiverr Pro dropdown, Explore dropdown, language selector, Sign in ghost link, Join dark filled button. Items separated by 12–24px gaps.

### Trending Tag Bar
**Role:** Secondary category strip below main nav

White background, Macan 400 14px label 'Trending' in #404145 followed by horizontal comma-separated category links in #62646a. No borders, no cards, no background fills — pure text density.

### Input Field
**Role:** Text input — search and form contexts

White #ffffff fill, #c5c6c9 1px border, 12px radius, 10px vertical / 16px horizontal padding. Focus state shifts border to #1dbf73. Placeholder text at Macan 400 16px in #74767 Smoke.

## Do's and Don'ts

### Do
- Use #1dbf73 exclusively for links, the logo dot, selected/active states, and category tag borders — never for filled buttons or large surface areas
- Apply Macan weight 280 at 72px for hero display headlines with -0.06em tracking — the ultralight display is the brand's signature editorial choice
- Use 9999px radius for all category tag pills and inline link pills; use 16px for service cards; use 8px for action buttons
- Apply the single soft shadow rgba(0,0,0,0.13) 0px 3px 10px 0px to service category cards only — do not stack or add stronger shadows elsewhere
- Alternate between Carbon #222325 and Forest Stage #003912 for full-bleed promotional sections; both function as dark stages for white type and image content
- Use Macan 400 for body, 600 for subheadings and navigation, 700 only for primary CTA button labels
- Keep element gap at 12px within component groups; use 24–40px between component groups; sections separated by 40–64px vertical space

### Don't
- Do not use #1dbf73 as a filled CTA background — it appears only as borders, links, and the logo dot
- Do not use bold (700) weights for body or display copy — the 280 ultralight display and 400 body are what distinguish Fiverr from generic marketplace UIs
- Do not introduce colors outside the nine-token neutral + green system; no purples, blues, or warm tones
- Do not add decorative gradients — the system is flat surfaces with one shadow, no gradient language
- Do not apply corner radii other than the four defined values (4px nav, 8px buttons, 12px inputs, 16px cards, 9999px pills)
- Do not use #000000 for text or backgrounds — #222325 Carbon is the designated near-black, slightly warmer and softer than pure black
- Do not place multiple chromatic elements adjacent; the green must read as punctuation, not as a wash

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#ffffff` | Default page background |
| 1 | Card Surface | `#ffffff` | Elevated card and input backgrounds on the white canvas |
| 2 | Dark Stage | `#222325` | Full-bleed dark promotional sections and filled button surfaces |
| 3 | Green Stage | `#003912` | Service category cards and Pro-section hero panels |

## Elevation

- **Service category card:** `rgba(0, 0, 0, 0.13) 0px 3px 10px 0px`

## Imagery

Photography is full-bleed lifestyle imagery used exclusively in the hero — warm interior scenes of people working, with a dark overlay that pushes text legibility and unifies the background into a single Carbon-toned stage. Service category thumbnails are colorful product mockups (laptops, cameras, books, architecture renders) that sit inside the dark green Forest Stage cards, creating high contrast between the saturated product art and the muted dark-green surface. Freelancer portraits are tight head-and-shoulders crops on dark backgrounds for the carousel. Iconography is a single-weight line-icon set in #222325 stroke for category strip and feature rows. No 3D renders, no abstract graphics, no duotone photography — the system relies on real product photography and flat line-icons only.

## Layout

Max-width 1200px centered container with generous outer padding. Hero is full-bleed with a dark photographic background and centered/left-aligned headline + search bar stack. Below the hero, a white section introduces the Category Icon Strip (10 items, single row, equal width). Popular Services follows as a horizontal-scrolling card carousel of six visible dark-green category cards. Benefit row is a four-column text grid with no card surfaces. Dark promotional sections (AI Director, Fiverr Pro) alternate full-bleed with the white sections, each using a different dark surface (Carbon, then Forest Stage) to create visual rhythm. Navigation is a persistent 64px top bar with inline search. Section vertical rhythm is 40–64px between bands.

## Agent Prompt Guide

## Quick Color Reference
- text (primary): #222325 Carbon
- text (secondary): #62646a Graphite
- background (canvas): #ffffff Paper
- border (default): #62646a Graphite (structural) / #dadbdd Mist (hairline) / #c5c6c9 Fog (inputs)
- accent: #1dbf73 Fiverr Green (links, tag borders, logo dot, active states)
- dark stage: #003912 Forest Stage (category cards, Pro sections) / #222325 Carbon (promotional banners, filled buttons)
- primary action: #222325 (filled action)

## Example Component Prompts

1. **Service Category Card (Dark Green Stage)**: #003912 background, 16px radius, 25px top padding / 16px horizontal padding. White Macan 600 16px category title top-left. Full-bleed category illustration below. Soft shadow rgba(0,0,0,0.13) 0px 3px 10px 0px. Sized 200×260px in a 6-column horizontal carousel.

2. **Category Tag Pill**: Transparent fill, 1.5px #1dbf73 border, 9999px full-pill radius, 8px vertical / 16px horizontal padding. #1dbf73 text and right-arrow icon at Macan 400 16px. Multiple pills in a row with 12px gap.

3. **Hero Search Bar**: White #ffffff fill, #dadbdd 1px border, 4px radius, 16px vertical / 20px horizontal padding, full container width up to 680px. Carbon #222325 48×48px square search button docked right with white magnifier icon. Placeholder 'Search for any service...' in #74767e Macan 400 16px.

4. **Dark Promotional Banner (AI Director style)**: Carbon #222325 full-bleed background, 64px vertical padding. White display headline Macan 280 48px with -1.44px tracking. White subtext Macan 400 16px. Ghost white Filled Button (transparent fill, 1.5px white border, white text, 8px radius) bottom-left. Freelancer portrait cards stacked on the right, each 140px wide with 12px radius.

5. **Top Navigation Bar**: White #ffffff background, 64px height, #dadbdd 1px bottom border. Left: Fiverr wordmark in #222325 with #1dbf73 green period. Center: 400px compacted search bar. Right: Fiverr Pro + Explore dropdowns, language selector, 'Sign in' ghost link, 'Join' Carbon filled button (16px Macan 600 white text, 8px radius, 16px padding). Items spaced 24px apart.

## Similar Brands

- **Upwork** — Same marketplace card-grid layout with dark promotional sections and a single brand color accent, though Upwork uses green in filled buttons while Fiverr reserves it for outlined tags and links
- **Etsy** — Same approach of dark category cards (Etsy's charcoal product cards) below a full-bleed photographic hero with centered search — the marketplace taxonomy grid pattern is shared
- **99designs** — Same freelancer-portrait-on-dark-stage carousel pattern and dark promotional banners breaking up white product surfaces
- **Shutterstock** — Same horizontal-scrolling category card grid with dark backgrounds and product mockup thumbnails, though Shutterstock uses red as its signature pulse vs Fiverr's green
- **Toptal** — Same editorial ultralight display headline treatment on dark hero sections, though Toptal leans monochrome while Fiverr anchors with green

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-fiverr-green: #1dbf73;
  --color-forest-stage: #003912;
  --color-carbon: #222325;
  --color-graphite: #62646a;
  --color-paper: #ffffff;
  --color-mist: #dadbdd;
  --color-fog: #c5c6c9;
  --color-slate: #404145;
  --color-smoke: #74767e;

  /* Typography — Font Families */
  --font-macan: 'Macan', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.56;
  --text-body-sm: 14px;
  --leading-body-sm: 1.57;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 18px;
  --leading-subheading: 1.2;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.05;
  --tracking-heading-lg: -1.44px;
  --text-display: 72px;
  --leading-display: 1;
  --tracking-display: -4.32px;

  /* Typography — Weights */
  --font-weight-w280: 280;
  --font-weight-regular: 400;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

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
  --spacing-40: 40px;
  --spacing-56: 56px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 40px;
  --card-padding: 16px;
  --element-gap: 12px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-full: 9999px;

  /* Named Radii */
  --radius-nav: 4px;
  --radius-cards: 16px;
  --radius-pills: 9999px;
  --radius-inputs: 12px;
  --radius-buttons: 8px;

  /* Shadows */
  --shadow-md: rgba(0, 0, 0, 0.13) 0px 3px 10px 0px;

  /* Surfaces */
  --surface-canvas: #ffffff;
  --surface-card-surface: #ffffff;
  --surface-dark-stage: #222325;
  --surface-green-stage: #003912;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-fiverr-green: #1dbf73;
  --color-forest-stage: #003912;
  --color-carbon: #222325;
  --color-graphite: #62646a;
  --color-paper: #ffffff;
  --color-mist: #dadbdd;
  --color-fog: #c5c6c9;
  --color-slate: #404145;
  --color-smoke: #74767e;

  /* Typography */
  --font-macan: 'Macan', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.56;
  --text-body-sm: 14px;
  --leading-body-sm: 1.57;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 18px;
  --leading-subheading: 1.2;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.05;
  --tracking-heading-lg: -1.44px;
  --text-display: 72px;
  --leading-display: 1;
  --tracking-display: -4.32px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-56: 56px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-md: rgba(0, 0, 0, 0.13) 0px 3px 10px 0px;
}
```
