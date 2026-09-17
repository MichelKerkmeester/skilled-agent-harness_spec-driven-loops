# Things — Style Reference
> Apple keynote at half volume — a gallery wall of tilted product frames floating on a quiet cool-gray canvas, with one vivid blue spark pulling the eye to every interactive moment.

**Theme:** light

Things presents a gallery-like product page where the app speaks through generous white space, tilted product mockups, and a single confident blue accent. The aesthetic borrows from Apple's editorial restraint — system fonts, near-grayscale neutrals, subtle layered elevation, and rounded cards with 18px radii feel premium without ever feeling cold. Color appears sparingly and functionally: a vivid blue for links, icons, and the circular play control; a slightly lighter blue for secondary headings; and a near-black (#303336) for body text against a faintly cool canvas (#f2f5f7). Sections breathe with 40-80px vertical gaps, and hierarchy is carried by type weight (600-800 for headings) and generous line-height rather than decorative flourishes.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Ink | `#303336` | `--color-ink` | Primary text, body copy, heading text — near-black with a faint cool cast, never pure #000, keeping the page from feeling harsh |
| Paper | `#ffffff` | `--color-paper` | Card surfaces, elevated product mockups, input fields — pure white against the cooler canvas reads as lifted, not flat |
| Mist | `#f2f5f7` | `--color-mist` | Page canvas, full-width background bands — a cool-tinted off-white that feels softer than pure white but still reads as light |
| Fog | `#838b96` | `--color-fog` | Secondary body text, helper copy, muted descriptions — the most-used neutral after Ink, creates the dominant mid-tone of the page |
| Ash | `#55606e` | `--color-ash` | Tertiary text, icon strokes, decorative dividers — a cool gray that still carries enough chroma to read as designed, not default |
| Smoke | `#44474b` | `--color-smoke` | Deep body text alternative, emphasized inline text — sits between Ink and Fog for mid-emphasis passages |
| Silver | `#9299a4` | `--color-silver` | Disabled or de-emphasized text, tertiary metadata |
| Pebble | `#8e9196` | `--color-pebble` | Muted link text, breadcrumb-style secondary navigation |
| Hairline | `#dfe3e8` | `--color-hairline` | Input borders, subtle dividers, card edges — cool and barely-there, defines boundaries without darkening the surface |
| Signal Blue | `#2576eb` | `--color-signal-blue` | Blue supporting accent for decorative details and low-frequency emphasis. Do not promote it to the primary CTA color |
| Sky Blue | `#5c9cf5` | `--color-sky-blue` | Secondary blue for heading accents, lighter link states, decorative icon highlights — a softer companion to Signal Blue used when the primary blue would feel too loud |

## Tokens — Typography

### ui-sans-serif (system stack: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'SF Pro Display') — All UI and editorial text. The system stack is deliberate — on Apple devices this resolves to SF Pro, matching the Things app itself. Weight 600-800 carries headings; weight 400 carries body. No custom or web-loaded font; the restraint IS the brand. · `--font-ui-sans-serif-system-stack-apple-system-blinkmacsystemfont-sf-pro-text-sf-pro-display`
- **Substitute:** Inter, Helvetica Neue, system-ui
- **Weights:** 400, 600, 700, 800
- **Sizes:** 13, 14, 15, 16, 17, 18, 20, 24, 36
- **Line height:** 1.00–1.60
- **Letter spacing:** normal across all sizes; no display tracking
- **Role:** All UI and editorial text. The system stack is deliberate — on Apple devices this resolves to SF Pro, matching the Things app itself. Weight 600-800 carries headings; weight 400 carries body. No custom or web-loaded font; the restraint IS the brand.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 13px | 1.4 | — | `--text-caption` |
| body | 15px | 1.6 | — | `--text-body` |
| subheading | 18px | 1.3 | — | `--text-subheading` |
| heading-sm | 20px | 1.25 | — | `--text-heading-sm` |
| heading | 24px | 1.2 | — | `--text-heading` |
| display | 36px | 1.2 | — | `--text-display` |

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
| 36 | 36px | `--spacing-36` |
| 40 | 40px | `--spacing-40` |
| 200 | 200px | `--spacing-200` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 18px |
| icons | 3px |
| inputs | 6px |
| buttons | 6px |
| headings | 12.8px |
| playButton | 9999px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| sm | `rgba(0, 0, 0, 0.1) 0px 2px 8px 0px, rgba(0, 0, 0, 0.1) 0p...` | `--shadow-sm` |

### Layout

- **Page max-width:** 960px
- **Section gap:** 80px
- **Card padding:** 24px
- **Element gap:** 10px

## Components

### App Icon Badge
**Role:** Brand mark displayed in the hero

Rounded square app icon (Things logo: blue gradient field with white checkmark) rendered at ~120px. Functions as a visual anchor at the top of the hero. No border, no shadow — the icon's own internal gradient provides all visual weight.

### Circular Play Button
**Role:** Primary interactive control for the introduction video

36-40px circle, background #4f91fb (or #2576eb), white triangle play glyph centered, border-radius 9999px. Functions as the only filled chromatic control on the page. Pairs with adjacent text link in Signal Blue (#2576eb). The circle is the brand's signature interactive moment.

### Inline Text Link
**Role:** Navigational and contextual links throughout the page

No underline by default; color #2576eb at 15-17px weight 400. Hover state deepens to #1a5fb8. Often paired with a small ▸ chevron (3px radius, 12-14px) indicating further navigation. Never a filled button — this design favors quiet text links over button-style CTAs.

### Product Mockup Card
**Role:** Showcases the Things app interface in context

White (#ffffff) surface with 18px border-radius and the layered ambient + contact shadow (0 2px 8px rgba(0,0,0,0.1) + 0 0 2px rgba(0,0,0,0.1)). Often displayed at a 3-5° rotation for editorial energy. Contains the app's native UI: category sidebar with colored icons, main content area with task rows. No border, no outline — shadow defines the edge.

### Hero Section Stack
**Role:** First-screen introduction to the product

Centered vertically and horizontally on the Mist canvas. Stack order: app icon (~120px), display heading 'Things' at 36px weight 700 in Ink, body description at 17-18px weight 400 in Fog (1.6 line-height for breathing room), then play button + text link. No background image, no gradient — the hero is pure typography on canvas.

### Feature Heading Row
**Role:** Introduces a new content block

Icon (24-32px, rounded 3px radius, often Signal Blue) left-aligned with heading text at 24px weight 700 in Ink. Examples: play-circle icon before 'Prepare Presentation', Things app icon before 'Simply Powerful'. Icon-text gap: 10-12px.

### Section Divider
**Role:** Separates distinct content bands

Implemented as full-width horizontal color shifts between Mist and white bands, or as generous vertical whitespace (80px) without any visible line. Never a 1px hairline rule — dividers are spatial, not linear.

### Top Navigation Bar
**Role:** Minimal site navigation

Wordmark 'Things' with small icon (3px radius) on the far left, three text links (Features, Support, Blog) right-aligned. All text at 15px weight 400 in Ash (#55606e) or Ink. No background fill, no border-bottom, no shadow — the nav floats on the canvas.

### Product Category Icon
**Role:** Decorative icons representing app's built-in task categories

Rounded square (3px radius), ~16-18px, each in a distinct hue: Inbox (Signal Blue), Today (yellow), Upcoming (pink/red), Anytime (green), Someday (teal). These are product content, not design system tokens, but they define the page's secondary color moments alongside the brand blue.

### Body Description Block
**Role:** Supporting paragraph copy under headings

Centered or left-aligned, 17-18px weight 400 in Fog (#838b96), max-width ~540px for comfortable measure, line-height 1.6. Never in Ink — the lighter gray signals supporting copy without hierarchy collision.

### Tilted Product Showcase
**Role:** Editorial layout device for app screenshots

Two product mockup cards overlapping at slight angles (one rotated -4°, one +3°), creating depth without 3D. Cards have 18px radius and the standard layered shadow. The tilt is signature — it breaks the otherwise rigid centered grid and gives the page editorial rhythm.

## Do's and Don'ts

### Do
- Use the system sans-serif stack exclusively — never load a web font; the page's restraint depends on it
- Reserve #2576eb for interactive moments: links, the play button, icon accents. Never paint a large surface in brand blue
- Use #f2f5f7 as the full-bleed canvas and #ffffff only for lifted card surfaces — this two-tone surface language is the page's structural backbone
- Set body copy at 17-18px weight 400 in #838b96 with 1.6 line-height and ~540px max-width for comfortable measure
- Apply 18px border-radius to all elevated cards and product mockups; 6px to buttons and inputs; 9999px to the circular play control
- Use the paired shadow stack (0 2px 8px + 0 0 2px at 10% black) for any elevated surface — ambient lift plus a hairline contact shadow
- Separate sections with 80px of vertical whitespace or a full-width color band shift, never with a visible divider line

### Don't
- Don't introduce filled CTA buttons — the design language uses text links and the circular play control, not rectangular action buttons
- Don't use pure black (#000000) for body text — #303336 is the Ink, and pure black would break the page's cool, soft cast
- Don't add decorative gradients, textures, or background imagery to the hero or sections — the canvas is the design
- Don't use the category icon hues (yellow, pink, green, teal) as UI accent colors — they are product content from the app, not brand tokens
- Don't apply shadows to text, icons, or small UI elements — shadows are reserved for elevated cards and product mockups
- Don't add a border-bottom or background fill to the navigation — it should float invisibly on the canvas
- Don't tighten body line-height below 1.5 — the airy vertical rhythm is as important as the type size itself

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Canvas | `#f2f5f7` | Full-bleed page background, section bands |
| 2 | Card | `#ffffff` | Product mockup surfaces, elevated content cards, input fields |
| 3 | Accent Surface | `#4f91fb` | Saturated blue fill for the circular play control — only place a chromatic color fills a surface |

## Elevation

- **Product mockup card:** `0 2px 8px rgba(0,0,0,0.1), 0 0 2px rgba(0,0,0,0.1)`
- **Elevated content card:** `0 2px 8px rgba(0,0,0,0.1), 0 0 2px rgba(0,0,0,0.1)`

## Imagery

Imagery is almost entirely product mockups — real screenshots of the Things app interface presented as tilted editorial cards. No lifestyle photography, no abstract illustrations, no decorative graphics beyond the app icon itself. When icons appear, they are the app's own category glyphs (Inbox, Today, Upcoming, Anytime, Someday) rendered at 3px radius in their distinct category hues. The play control icon is a simple white triangle on a Signal Blue circle. Treatment is raw: screenshots have no border, no frame, no device chrome — they sit as floating rectangles on the cool canvas, their tilt and shadow doing all the visual work. Icon style is filled, not outlined, with rounded corners. Density is low: text and product visuals alternate in generous breathing room, never crowded.

## Layout

Page is max-width ~960px centered on a full-bleed #f2f5f7 canvas. The hero is a centered vertical stack (icon → heading → description → play link) with no background image. Below the fold, sections alternate between white product showcase bands and Mist canvas bands, each separated by 80px of whitespace. Product mockups are displayed at slight rotations (-4° to +3°) for editorial energy, often overlapping each other in pairs. Text blocks are centered or left-aligned at max-width 540px. There is no sidebar, no multi-column grid in the body — the layout is single-column with generous lateral margins. The top nav is a single horizontal bar floating on the canvas with no background fill, no border, and no shadow. Grid usage is minimal: feature headings are single-column, product showcases are 2-card compositions, and the only multi-column content is the app's own UI shown within mockups.

## Agent Prompt Guide

Quick Color Reference:
- text: #303336 (primary), #838b96 (body), #55606e (tertiary)
- background: #f2f5f7 (canvas), #ffffff (card)
- border: #dfe3e8
- accent: #2576eb (links, icons, play button), #5c9cf5 (secondary blue)
- primary action: no distinct CTA color

Example Component Prompts:
1. Build a hero section on a #f2f5f7 canvas. Center a 120px Things app icon, then a 36px display heading in #303336 weight 700. Below it, a 17px body paragraph in #838b96 weight 400, line-height 1.6, max-width 540px. Finish with a 40px circular play button (background #4f91fb, white play triangle, 9999px radius) beside a 15px Signal Blue text link 'Watch Introduction Video' in #2576eb.

2. Build a product mockup card: 18px border-radius, white (#ffffff) surface, shadow 0 2px 8px rgba(0,0,0,0.1) + 0 0 2px rgba(0,0,0,0.1). Rotate the card -4° for editorial tilt. Inside, show the app UI with a sidebar of category icons (each 3px radius, distinct hues) and a main content area with task rows in #303336 text.

3. Build a feature heading row: 28px Signal Blue icon (#2576eb, 3px radius) left-aligned, then 24px weight 700 text in #303336. 10-12px gap between icon and text. Below, a 17px description paragraph in #838b96 with 1.6 line-height and 540px max-width.

4. Build the top navigation: no background, no border. Left: a 20px Things wordmark in #303336 weight 700 with a small 3px-radius icon. Right: three text links (Features, Support, Blog) in 15px #55606e weight 400, each separated by 24px of horizontal space.

5. Build a two-card product showcase: two white cards with 18px radius and the standard layered shadow, one rotated -4° and one +3°, overlapping slightly in the center. Section background is #f2f5f7, with 80px padding above and below.

## Visual Language

Imagery is almost entirely product mockups — real screenshots of the Things app interface presented as tilted editorial cards. No lifestyle photography, no abstract illustrations, no decorative graphics beyond the app icon itself. When icons appear, they are the app's own category glyphs (Inbox, Today, Upcoming, Anytime, Someday) rendered at 3px radius in their distinct category hues. The play control icon is a simple white triangle on a Signal Blue circle. Treatment is raw: screenshots have no border, no frame, no device chrome — they sit as floating rectangles on the cool canvas, their tilt and shadow doing all the visual work. Icon style is filled, not outlined, with rounded corners. Density is low: text and product visuals alternate in generous breathing room, never crowded.

## Layout

Page is max-width ~960px centered on a full-bleed #f2f5f7 canvas. The hero is a centered vertical stack (icon → heading → description → play link) with no background image. Below the fold, sections alternate between white product showcase bands and Mist canvas bands, each separated by 80px of whitespace. Product mockups are displayed at slight rotations (-4° to +3°) for editorial energy, often overlapping each other in pairs. Text blocks are centered or left-aligned at max-width 540px. There is no sidebar, no multi-column grid in the body — the layout is single-column with generous lateral margins. The top nav is a single horizontal bar floating on the canvas with no background fill, no border, and no shadow. Grid usage is minimal: feature headings are single-column, product showcases are 2-card compositions, and the only multi-column content is the app's own UI shown within mockups.

## Similar Brands

- **Apple product pages (apple.com/mac, apple.com/iphone)** — Same system-font typography, tilted product hero shots, single accent color restraint, and 18px rounded card surfaces with ambient shadow
- **Linear** — Shared product-showcase aesthetic with tilted UI screenshots on a clean canvas, but Linear adds a dark theme where Things stays firmly light
- **Notion** — Similar minimal product marketing pages with generous whitespace, but Notion uses warmer neutrals and decorative illustration where Things stays cool and product-only
- **Bear (notes app)** — Fellow Apple-ecosystem product with a near-identical system-font + light-canvas + single-accent approach, same audience expectation of editorial restraint

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-ink: #303336;
  --color-paper: #ffffff;
  --color-mist: #f2f5f7;
  --color-fog: #838b96;
  --color-ash: #55606e;
  --color-smoke: #44474b;
  --color-silver: #9299a4;
  --color-pebble: #8e9196;
  --color-hairline: #dfe3e8;
  --color-signal-blue: #2576eb;
  --color-sky-blue: #5c9cf5;

  /* Typography — Font Families */
  --font-ui-sans-serif-system-stack-apple-system-blinkmacsystemfont-sf-pro-text-sf-pro-display: 'ui-sans-serif (system stack: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'SF Pro Display')', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 13px;
  --leading-caption: 1.4;
  --text-body: 15px;
  --leading-body: 1.6;
  --text-subheading: 18px;
  --leading-subheading: 1.3;
  --text-heading-sm: 20px;
  --leading-heading-sm: 1.25;
  --text-heading: 24px;
  --leading-heading: 1.2;
  --text-display: 36px;
  --leading-display: 1.2;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  --font-weight-extrabold: 800;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-200: 200px;

  /* Layout */
  --page-max-width: 960px;
  --section-gap: 80px;
  --card-padding: 24px;
  --element-gap: 10px;

  /* Border Radius */
  --radius-sm: 3px;
  --radius-md: 6px;
  --radius-xl: 12.8px;
  --radius-2xl: 18px;

  /* Named Radii */
  --radius-cards: 18px;
  --radius-icons: 3px;
  --radius-inputs: 6px;
  --radius-buttons: 6px;
  --radius-headings: 12.8px;
  --radius-playbutton: 9999px;

  /* Shadows */
  --shadow-sm: rgba(0, 0, 0, 0.1) 0px 2px 8px 0px, rgba(0, 0, 0, 0.1) 0px 0px 2px 0px;

  /* Surfaces */
  --surface-canvas: #f2f5f7;
  --surface-card: #ffffff;
  --surface-accent-surface: #4f91fb;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-ink: #303336;
  --color-paper: #ffffff;
  --color-mist: #f2f5f7;
  --color-fog: #838b96;
  --color-ash: #55606e;
  --color-smoke: #44474b;
  --color-silver: #9299a4;
  --color-pebble: #8e9196;
  --color-hairline: #dfe3e8;
  --color-signal-blue: #2576eb;
  --color-sky-blue: #5c9cf5;

  /* Typography */
  --font-ui-sans-serif-system-stack-apple-system-blinkmacsystemfont-sf-pro-text-sf-pro-display: 'ui-sans-serif (system stack: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'SF Pro Display')', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 13px;
  --leading-caption: 1.4;
  --text-body: 15px;
  --leading-body: 1.6;
  --text-subheading: 18px;
  --leading-subheading: 1.3;
  --text-heading-sm: 20px;
  --leading-heading-sm: 1.25;
  --text-heading: 24px;
  --leading-heading: 1.2;
  --text-display: 36px;
  --leading-display: 1.2;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-200: 200px;

  /* Border Radius */
  --radius-sm: 3px;
  --radius-md: 6px;
  --radius-xl: 12.8px;
  --radius-2xl: 18px;

  /* Shadows */
  --shadow-sm: rgba(0, 0, 0, 0.1) 0px 2px 8px 0px, rgba(0, 0, 0, 0.1) 0px 0px 2px 0px;
}
```
