# Fuser — Style Reference
> Scattered polaroids on a designer's working wall

**Theme:** light

Fuser is a light, airy creative-canvas interface that treats the page itself like a scattered studio mood board: white surfaces, thin hairline borders, generous breathing room, and a single confident violet accent. The visual grammar is polaroids-on-paper — floating image cards, subtle shadows, soft 16px radii — layered over a faint grid that implies infinite workspace. Typography pairs a humanist serif display face (Marund) with a utilitarian sans (Inter) so headlines feel editorial while UI stays neutral. Color is used as functional punctuation, not decoration: violet for connection and action, a vivid green for live/connected node markers, and an almost-achromatic neutral scale for everything else. The aesthetic signals creative-tool-with-serious-substance — playful in composition, disciplined in execution.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Electric Violet | `#432dd7` | `--color-electric-violet` | Primary brand accent — icon strokes, card borders, active link underlines, connection lines, and the dominant chromatic signal across product surfaces |
| Bright Indigo | `#4f39f6` | `--color-bright-indigo` | Interactive links, active nav items, icon highlights, and secondary borders — a slightly lighter sibling to Electric Violet for hover/active states |
| Deep Indigo | `#312c85` | `--color-deep-indigo` | Pressed/visited state of brand accent, dark text on light-violet surfaces, and the deepest chromatic token in the brand scale |
| Soft Violet | `#a6a5fe` | `--color-soft-violet` | Outlined button borders, light icon strokes, and lavender-toned hairlines — the pastel end of the brand ramp |
| Lavender Mist | `#d7defd` | `--color-lavender-mist` | Filled primary action background, soft chip/badge fills, and tinted section washes — the chromatic surface that makes CTAs feel warm without shouting |
| Periwinkle Wash | `#c6d2ff` | `--color-periwinkle-wash` | Soft tinted body backgrounds and gentle section highlights — used sparingly to break up white space |
| Signal Green | `#00c950` | `--color-signal-green` | Green decorative accent for icons, marks, and small graphic details |
| Paper | `#fafafa` | `--color-paper` | Page canvas and card surface — the lightest layer, sits behind everything |
| Fog | `#f5f5f5` | `--color-fog` | Secondary surface, button hover fills, and section backgrounds — the step below Paper |
| Cloud | `#efefef` | `--color-cloud` | Subtle button borders, inset surface fills, and the faintest hairline dividers |
| Mist | `#e5e5e5` | `--color-mist` | Card borders, subtle dividers, and disabled surfaces — the first gray that reads as a visible line |
| Pale Steel | `#d4d4d4` | `--color-pale-steel` | Icon fills and decorative shapes on light surfaces |
| Silver | `#b7b7b7` | `--color-silver` | Soft shadows, placeholder text in dark mode, and muted decorative fills |
| Mid Gray | `#a1a1a1` | `--color-mid-gray` | Muted icon fills, secondary button borders, and de-emphasized text |
| Steel | `#828282` | `--color-steel` | Caption text, nav meta, and medium-emphasis supporting copy |
| Slate | `#737373` | `--color-slate` | Body subtext, icon inactive state, and heading accents — the most-used muted text color |
| Graphite | `#666666` | `--color-graphite` | Body text on light tinted surfaces where pure black would feel too heavy |
| Iron | `#525252` | `--color-iron` | Primary text on light surfaces, most-used border color, and structural hairlines — the workhorse neutral |
| Charcoal | `#404040` | `--color-charcoal` | Secondary heading text and body emphasis |
| Dark Steel | `#262626` | `--color-dark-steel` | Heading text and strong body copy |
| Onyx | `#171717` | `--color-onyx` | Primary heading text, logo fill, and the darkest body text — near-black without the harshness of pure #000 |
| Near Black | `#0a0a0a` | `--color-near-black` | Display headline text, primary button labels, and maximum-contrast text |

## Tokens — Typography

### Marund — Display and heading face — a humanist serif with personality. Used for hero headlines, section titles, and editorial moments. Tight tracking (-0.05em at 96px) pulls letters close for a confident, considered feel. Weights 400–450 for body, 500–600 for headlines. The custom stylistic sets 'ss00' and 'ss03' define its distinctive character. · `--font-marund`
- **Substitute:** Fraunces, Newsreader, or DM Serif Display
- **Weights:** 400, 450, 500, 600
- **Sizes:** 14, 16, 17, 18, 20, 22, 24, 30, 48, 96
- **Line height:** 1.00, 1.10, 1.40, 1.43, 1.50
- **Letter spacing:** -0.0500em at 96px, -0.0250em at 48px and below
- **OpenType features:** `"ss00", "ss03"`
- **Role:** Display and heading face — a humanist serif with personality. Used for hero headlines, section titles, and editorial moments. Tight tracking (-0.05em at 96px) pulls letters close for a confident, considered feel. Weights 400–450 for body, 500–600 for headlines. The custom stylistic sets 'ss00' and 'ss03' define its distinctive character.

### Inter Variable — Body, UI, and secondary heading face — the operational typeface. Inter handles navigation, buttons, body copy, captions, labels, and supporting metadata. Weight 300 is used for light emphasis moments; 500–600 for button labels and nav links. The 0.14em tracking on small uppercase text creates the spaced-eyebrow label pattern seen above section headings. · `--font-inter-variable`
- **Substitute:** Inter, system-ui, or Geist
- **Weights:** 300, 400, 500, 600
- **Sizes:** 10, 12, 13, 14, 16, 18, 24, 30, 36
- **Line height:** 0.80, 1.00, 1.10, 1.20, 1.25, 1.33, 1.40, 1.43, 1.50, 1.56, 1.71
- **Letter spacing:** 0.1400em at 10–12px (uppercase eyebrow labels), -0.0250em at 24px+
- **Role:** Body, UI, and secondary heading face — the operational typeface. Inter handles navigation, buttons, body copy, captions, labels, and supporting metadata. Weight 300 is used for light emphasis moments; 500–600 for button labels and nav links. The 0.14em tracking on small uppercase text creates the spaced-eyebrow label pattern seen above section headings.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| micro | 10px | 1.2 | 1.4px | `--text-micro` |
| eyebrow | 12px | 1.4 | 1.68px | `--text-eyebrow` |
| caption | 14px | 1.43 | — | `--text-caption` |
| body-sm | 16px | 1.5 | — | `--text-body-sm` |
| body | 18px | 1.5 | — | `--text-body` |
| subheading | 24px | 1.33 | -0.6px | `--text-subheading` |
| heading-sm | 30px | 1.25 | -0.75px | `--text-heading-sm` |
| heading | 36px | 1.2 | -0.9px | `--text-heading` |
| heading-lg | 48px | 1.1 | -1.2px | `--text-heading-lg` |
| display | 96px | 1 | -4.8px | `--text-display` |

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
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 64 | 64px | `--spacing-64` |
| 72 | 72px | `--spacing-72` |
| 80 | 80px | `--spacing-80` |
| 96 | 96px | `--spacing-96` |
| 112 | 112px | `--spacing-112` |
| 136 | 136px | `--spacing-136` |
| 160 | 160px | `--spacing-160` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 6px |
| cards | 16px |
| images | 6px |
| inputs | 6px |
| buttons | 6px |
| navPill | 12px |
| largeCards | 24px |
| smallCards | 12px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| md | `rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.1)...` | `--shadow-md` |
| subtle | `oklch(0 0 0 / 0.3) 0px 0px 2px 0px inset, oklch(0 0 0 / 0...` | `--shadow-subtle` |
| subtle-2 | `oklch(0.439 0 0) 0px 0px 0px 0px` | `--shadow-subtle-2` |
| subtle-3 | `oklch(0.439 0 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.1) 0px ...` | `--shadow-subtle-3` |
| subtle-4 | `oklch(0.556 0 0) 0px 0px 0px 0px` | `--shadow-subtle-4` |
| subtle-5 | `oklch(0.145 0 0) 0px 0px 0px 0px, oklab(0.999994 0.000045...` | `--shadow-subtle-5` |
| subtle-6 | `oklch(0.145 0 0) 0px 0px 0px 0px` | `--shadow-subtle-6` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 96px
- **Card padding:** 16px
- **Element gap:** 8px

## Components

### Floating Polaroid Card
**Role:** Hero decorative card containing imagery, styled like a physical photo placed on a designer's wall

White card surface (#ffffff) on a #fafafa canvas. Border-radius 16px. Drop shadow: rgba(0,0,0,0.1) 0px 10px 15px -3px, rgba(0,0,0,0.1) 0px 4px 6px -4px. Internal image fills the card with 6px corner radius. Slight tilt (±2–4°) optional. No border line — the shadow defines the edge.

### Workspace Canvas Card
**Role:** Product-surface card used in the connected-canvas showcase — represents a node on the infinite canvas

White surface (#ffffff), 12–16px border-radius, 1px border in #e5e5e5 or #f5f5f5. Soft shadow using the same 10-15-3 / 4-6-4 stack at reduced opacity. Internal header bar contains a small colored status dot (green #00c950 or amber) and model/attribution label in Inter 12px medium. Image area below header at 6px radius. Small 8px green node markers at card edges indicate connection points.

### Floating Navigation Pill
**Role:** Sticky top navigation bar with a pill-shaped container

White surface (#ffffff), 12px border-radius, 1px border in #e5e5e5 or #f5f5f5, subtle shadow. Floats centered at the top with horizontal padding 24–32px. Contains logo icon (left), nav links in Inter 14px weight 500 #0a0a0a, Login text link, and outlined CTA button. Height approximately 48–56px.

### Primary CTA — Filled Lavender
**Role:** Main call-to-action button (hero and primary conversions)

Background #d7defd (Lavender Mist), text #0a0a0a (Near Black), 6px border-radius, padding 8px 20px. Inter 14px weight 500. Optional 1.5px outer ring in #a6a5fe at 2px offset for emphasis (the 'hero' treatment). Arrow icon after label in #0a0a0a.

### Secondary CTA — Outlined Violet
**Role:** Navigation and secondary action button

Transparent background, 1.5px border in #a6a5fe (Soft Violet), text #0a0a0a, 6px border-radius, padding 6px 16px. Inter 14px weight 500. Arrow icon after label. Hover: border deepens to #4f39f6, bg becomes #d7defd at 30% opacity.

### Ghost Text Link
**Role:** Inline text links and tertiary actions

No background, no border. Inter 14px weight 400–500, color #0a0a0a or #4f39f6 for chromatic links. Underline appears on hover only, 1px, #4f39f6.

### Announcement Banner
**Role:** Top utility bar above main nav for product announcements

Light surface (#f5f5f5 or #fafafa with subtle border-bottom in #e5e5e5). Inter 12px weight 400, text #525252. Contains icon + message + 'Learn More >' link in #4f39f6. Full-width, 32–40px height.

### Section Eyebrow Label
**Role:** Small uppercase label above section headings

Inter 12px weight 500, letter-spacing 0.14em, text-transform uppercase, color #737373. Contained in a subtle pill (#f5f5f5 bg, 6px radius) with optional hairline border #e5e5e5. Used as 'Used by folks at' or 'The best models for the job' section markers.

### Display Headline
**Role:** Hero and section-level heading

Marund weight 500–600, sizes 48–96px, line-height 1.0–1.1, letter-spacing -0.025em to -0.05em. Color #0a0a0a. Centered for hero, left-aligned for content sections. The tight negative tracking at 96px (-4.8px) is the signature moment.

### Body Subtitle
**Role:** Supporting paragraph below headlines

Inter weight 400, 16–18px, line-height 1.5, color #737373 or #525252. Centered for hero, left-aligned for content. Maximum 2 lines for hero subtitles.

### Logo Cloud Row
**Role:** Social proof bar showing partner/brand logos

Grayscale logos in a single horizontal row, centered. Logo color #737373 or #828282, scaled to 20–24px height. Arranged in one or two rows with 48–80px horizontal gaps. No logos in color — they all sit at the same muted neutral to avoid competing with the brand.

### Connection Line
**Role:** Curved SVG path connecting workspace canvas cards in the product showcase

Stroke #432dd7 (Electric Violet) at 1–1.5px width, opacity 0.4–0.6. Curved (Bezier) paths flowing between card node markers. Optional small filled circle endpoints at connection points, 6–8px diameter.

### Status Node Marker
**Role:** Small indicator dot on canvas cards showing live/connected state

6–8px filled circle, #00c950 (Signal Green) with optional 1px white inner ring for separation against card surfaces. Positioned at card edges or near content headers.

### Embedded Chat Block
**Role:** AI-generated content card embedded in the workspace canvas

White card with 1px #e5e5e5 border, 12px radius. Header: small colored dot (model indicator) + model name in Inter 12px medium. Body: Inter 14px weight 400, color #262626, line-height 1.6. Optional bold spans for headings within the generated text.

## Do's and Don'ts

### Do
- Use Lavender Mist (#d7defd) as the filled action background for primary CTAs and pair with Near Black (#0a0a0a) text — never invert to white-on-violet.
- Apply 16px border-radius to all content cards and 6px to all buttons, tags, and image fills — this two-radius system defines the visual language.
- Use Marund for all editorial headlines at 30px+ and Inter for everything below — the serif/sans split is the typographic signature.
- Place Signal Green (#00c950) only on node markers, status dots, and live indicators — never on buttons, text, or large surfaces.
- Track uppercase eyebrow labels at 0.14em (1.68px at 12px) and use Inter weight 500 in #737373 — this creates the 'section marker' pattern.
- Build hero compositions with floating cards at 16px radius on #fafafa canvas with the standard 10-15-3 / 4-6-4 drop shadow — no other shadow recipe.
- Apply negative letter-spacing to display sizes: -4.8px at 96px, -1.2px at 48px, scaling proportionally down to -0.6px at 24px.

### Don't
- Do not use #4f39f6 or #432dd7 as filled button backgrounds — the brand violet is for strokes, borders, and icons only; fills belong in Lavender Mist (#d7defd).
- Do not use Signal Green (#00c950) for success messaging, checkmarks, or semantic states — it is exclusively a canvas-node status indicator in this system.
- Do not apply shadows to buttons or inputs — the shadow system is reserved for floating cards and elevated panels.
- Do not mix Marund and Inter at the same size for the same role — pick one face per hierarchy level and stay consistent.
- Do not use pure #000000 for body or heading text — Onyx (#171717) and Near Black (#0a0a0a) give the same contrast with less harshness.
- Do not use border-radius values outside the scale (6, 12, 16, 24) — do not round to 8px or 10px; the system is binary: sharp-small or soft-large.
- Do not place logos in the logo cloud in their brand colors — all logos must sit at #737373 or #828282 gray to maintain visual calm.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#fafafa` | Page background — the white-paper base layer |
| 1 | Surface | `#f5f5f5` | Section backgrounds, subtle recessed areas |
| 2 | Card | `#ffffff` | Elevated cards, floating panels, and polaroid surfaces — the primary content surface |
| 3 | Tinted | `#d7defd` | Lavender-tinted surface for filled CTAs and soft highlight washes |

## Elevation

- **Floating Polaroid Card:** `rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.1) 0px 4px 6px -4px`
- **Workspace Canvas Card:** `rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.1) 0px 4px 6px -4px`
- **Navigation Pill:** `rgba(0, 0, 0, 0.08) 0px 2px 8px 0px`

## Imagery

Imagery is the visual centerpiece of the site, styled as scattered physical photos on a white studio wall. Floating polaroid-style cards contain diverse creative content: abstract gradient art, portrait photography, fashion model shots, motocross action photography, topographic line illustrations, and product silhouettes. All images sit inside 16px-radius white cards with soft drop shadows, 6px internal image radius, and no visible border — the shadow alone defines the edge. The palette is restrained: images carry their own color while the surrounding UI stays achromatic with violet accents. No lifestyle staging, no overlapping compositions — each card is isolated and 'placed' deliberately. The treatment says: these are creative references pinned to a working canvas, not stock photography.

## Layout

The page is a full-bleed light canvas with sections stacked vertically and generous 96px vertical gaps. The hero is a centered composition: a floating pill navigation bar at the top, then a centered headline (Marund 48–96px) with subtitle (Inter 18px), CTA, and a halo of scattered polaroid cards orbiting the text at slight angles. Below the hero, the product showcase section uses a full-width canvas with interconnected workspace cards arranged in an organic, non-grid pattern, linked by curved violet SVG paths. Cards vary in size and are placed with deliberate asymmetry rather than rigid columns. The logo cloud section is a single centered horizontal row of grayscale marks. Sections alternate between pure #fafafa canvas and subtle #f5f5f5 bands for rhythm. All content is centered or asymmetric — never left-aligned in a corporate-grid pattern. The overall feel is: a creative tool's homepage should look like the product it sells — a spacious, playful, connected canvas.

## Agent Prompt Guide

**Quick Color Reference**
- text: #0a0a0a (display/headings), #525252 (body), #737373 (muted)
- background: #fafafa (page), #ffffff (cards), #f5f5f5 (sections)
- border: #e5e5e5 (cards), #f5f5f5 (subtle hairlines)
- accent: #432dd7 (violet — borders, icons, links)
- primary action: #d7defd (filled action)
- node/status: #00c950 (green, for canvas connection dots only)

**Example Component Prompts**

1. Create a floating polaroid card: white (#ffffff) surface, 16px border-radius, drop shadow rgba(0,0,0,0.1) 0px 10px 15px -3px and rgba(0,0,0,0.1) 0px 4px 6px -4px. Internal image fills the card with 6px image radius. Slight 2–3° rotation. No visible border.

2. Create a Primary Action Button: #d7defd background, #000000 text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.


4. Create a hero headline: Marund weight 500, 96px, line-height 1.0, letter-spacing -4.8px, color #0a0a0a, centered. Below it, a subtitle in Inter 18px weight 400, color #737373, line-height 1.5, max-width 480px, centered.

5. Create a workspace canvas card: white (#ffffff) surface, 12px border-radius, 1px border in #e5e5e5. Header contains a 6px #00c950 status dot + model name in Inter 12px medium #525252. Body image below at 6px radius. An 8px #00c950 node marker sits at the card's right edge for connection point.

## Similar Brands

- **Figma** — Same light-canvas treatment with floating card compositions, white surfaces, and a single chromatic accent (Figma's purple/orange, Fuser's violet) used sparingly for interactive elements
- **Linear** — Shared typographic discipline — serif/sans pairing for display vs UI, tight negative letter-spacing on large headlines, and an almost-achromatic interface with one confident accent color
- **Arc Browser** — Same creative-tool aesthetic with scattered card layouts, playful asymmetry, and a soft light theme that feels more like a designer's workspace than a corporate product page
- **Pitch** — Similar presentation-as-product approach: the homepage itself demonstrates the tool by showing interconnected cards on a canvas, with violet as the connection color and generous whitespace
- **Notion** — Same restrained light interface, hairline borders, subtle shadows on elevated cards, and a typographic system where the display face carries personality while the sans handles all UI

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-electric-violet: #432dd7;
  --color-bright-indigo: #4f39f6;
  --color-deep-indigo: #312c85;
  --color-soft-violet: #a6a5fe;
  --color-lavender-mist: #d7defd;
  --color-periwinkle-wash: #c6d2ff;
  --color-signal-green: #00c950;
  --color-paper: #fafafa;
  --color-fog: #f5f5f5;
  --color-cloud: #efefef;
  --color-mist: #e5e5e5;
  --color-pale-steel: #d4d4d4;
  --color-silver: #b7b7b7;
  --color-mid-gray: #a1a1a1;
  --color-steel: #828282;
  --color-slate: #737373;
  --color-graphite: #666666;
  --color-iron: #525252;
  --color-charcoal: #404040;
  --color-dark-steel: #262626;
  --color-onyx: #171717;
  --color-near-black: #0a0a0a;

  /* Typography — Font Families */
  --font-marund: 'Marund', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter-variable: 'Inter Variable', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-micro: 10px;
  --leading-micro: 1.2;
  --tracking-micro: 1.4px;
  --text-eyebrow: 12px;
  --leading-eyebrow: 1.4;
  --tracking-eyebrow: 1.68px;
  --text-caption: 14px;
  --leading-caption: 1.43;
  --text-body-sm: 16px;
  --leading-body-sm: 1.5;
  --text-body: 18px;
  --leading-body: 1.5;
  --text-subheading: 24px;
  --leading-subheading: 1.33;
  --tracking-subheading: -0.6px;
  --text-heading-sm: 30px;
  --leading-heading-sm: 1.25;
  --tracking-heading-sm: -0.75px;
  --text-heading: 36px;
  --leading-heading: 1.2;
  --tracking-heading: -0.9px;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.1;
  --tracking-heading-lg: -1.2px;
  --text-display: 96px;
  --leading-display: 1;
  --tracking-display: -4.8px;

  /* Typography — Weights */
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-w450: 450;
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
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-72: 72px;
  --spacing-80: 80px;
  --spacing-96: 96px;
  --spacing-112: 112px;
  --spacing-136: 136px;
  --spacing-160: 160px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 96px;
  --card-padding: 16px;
  --element-gap: 8px;

  /* Border Radius */
  --radius-md: 6px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-3xl: 24px;

  /* Named Radii */
  --radius-tags: 6px;
  --radius-cards: 16px;
  --radius-images: 6px;
  --radius-inputs: 6px;
  --radius-buttons: 6px;
  --radius-navpill: 12px;
  --radius-largecards: 24px;
  --radius-smallcards: 12px;

  /* Shadows */
  --shadow-md: rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.1) 0px 4px 6px -4px;
  --shadow-subtle: oklch(0 0 0 / 0.3) 0px 0px 2px 0px inset, oklch(0 0 0 / 0.1) 0px 1px 0px 0px inset;
  --shadow-subtle-2: oklch(0.439 0 0) 0px 0px 0px 0px;
  --shadow-subtle-3: oklch(0.439 0 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.1) 0px 4px 6px -4px;
  --shadow-subtle-4: oklch(0.556 0 0) 0px 0px 0px 0px;
  --shadow-subtle-5: oklch(0.145 0 0) 0px 0px 0px 0px, oklab(0.999994 0.0000455678 0.0000200868 / 0.4) 0px 1px 3px 0px, oklab(0.999994 0.0000455678 0.0000200868 / 0.5) 0px 0px 4px 0px, oklab(0 0 0 / 0.3) 0px 0px 2px 0px inset, oklab(0 0 0 / 0.1) 0px 1px 0px 0px inset;
  --shadow-subtle-6: oklch(0.145 0 0) 0px 0px 0px 0px;

  /* Surfaces */
  --surface-canvas: #fafafa;
  --surface-surface: #f5f5f5;
  --surface-card: #ffffff;
  --surface-tinted: #d7defd;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-electric-violet: #432dd7;
  --color-bright-indigo: #4f39f6;
  --color-deep-indigo: #312c85;
  --color-soft-violet: #a6a5fe;
  --color-lavender-mist: #d7defd;
  --color-periwinkle-wash: #c6d2ff;
  --color-signal-green: #00c950;
  --color-paper: #fafafa;
  --color-fog: #f5f5f5;
  --color-cloud: #efefef;
  --color-mist: #e5e5e5;
  --color-pale-steel: #d4d4d4;
  --color-silver: #b7b7b7;
  --color-mid-gray: #a1a1a1;
  --color-steel: #828282;
  --color-slate: #737373;
  --color-graphite: #666666;
  --color-iron: #525252;
  --color-charcoal: #404040;
  --color-dark-steel: #262626;
  --color-onyx: #171717;
  --color-near-black: #0a0a0a;

  /* Typography */
  --font-marund: 'Marund', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter-variable: 'Inter Variable', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-micro: 10px;
  --leading-micro: 1.2;
  --tracking-micro: 1.4px;
  --text-eyebrow: 12px;
  --leading-eyebrow: 1.4;
  --tracking-eyebrow: 1.68px;
  --text-caption: 14px;
  --leading-caption: 1.43;
  --text-body-sm: 16px;
  --leading-body-sm: 1.5;
  --text-body: 18px;
  --leading-body: 1.5;
  --text-subheading: 24px;
  --leading-subheading: 1.33;
  --tracking-subheading: -0.6px;
  --text-heading-sm: 30px;
  --leading-heading-sm: 1.25;
  --tracking-heading-sm: -0.75px;
  --text-heading: 36px;
  --leading-heading: 1.2;
  --tracking-heading: -0.9px;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.1;
  --tracking-heading-lg: -1.2px;
  --text-display: 96px;
  --leading-display: 1;
  --tracking-display: -4.8px;

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
  --spacing-72: 72px;
  --spacing-80: 80px;
  --spacing-96: 96px;
  --spacing-112: 112px;
  --spacing-136: 136px;
  --spacing-160: 160px;

  /* Border Radius */
  --radius-md: 6px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-3xl: 24px;

  /* Shadows */
  --shadow-md: rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.1) 0px 4px 6px -4px;
  --shadow-subtle: oklch(0 0 0 / 0.3) 0px 0px 2px 0px inset, oklch(0 0 0 / 0.1) 0px 1px 0px 0px inset;
  --shadow-subtle-2: oklch(0.439 0 0) 0px 0px 0px 0px;
  --shadow-subtle-3: oklch(0.439 0 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.1) 0px 4px 6px -4px;
  --shadow-subtle-4: oklch(0.556 0 0) 0px 0px 0px 0px;
  --shadow-subtle-5: oklch(0.145 0 0) 0px 0px 0px 0px, oklab(0.999994 0.0000455678 0.0000200868 / 0.4) 0px 1px 3px 0px, oklab(0.999994 0.0000455678 0.0000200868 / 0.5) 0px 0px 4px 0px, oklab(0 0 0 / 0.3) 0px 0px 2px 0px inset, oklab(0 0 0 / 0.1) 0px 1px 0px 0px inset;
  --shadow-subtle-6: oklch(0.145 0 0) 0px 0px 0px 0px;
}
```
