# V7labs — Style Reference
> Sunlit amber archive — editorial intelligence behind theater curtains. The first screen pours warm orange light through vertical drapery streaks, then strips to monochrome seriousness below.

**Theme:** mixed

V7 stages its interface like a film studio: a single warm amber hero floods the first screen with vertical curtain-like light streaks, then gives way to a high-contrast editorial system of cream-white canvases and near-black panels. The voice is serious and archival — Martina Plantijn serif at whisper-light weight for headlines carries a printed-publication authority, while the dense sans-serif body text in STK Bureau keeps the data-heavy product feel quiet and clinical. Color discipline is absolute in the interface: every interactive surface is either pure white, pure black, or the deep warm neutral, with the amber orange reserved almost exclusively for atmospheric hero and statistic blocks — never for buttons, never for links, never for accents. Components are pill-shaped and minimal, sitting flush on the page with hairline borders and almost no shadow, reinforcing the impression of a system designed for decisions rather than decoration.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Amber Curtain | `#ec580a` | `--color-amber-curtain` | Hero and statistics block backgrounds, brand atmospheric layer — the entire warm light system of the page, applied as full-bleed gradient with vertical streak texture. Never used for buttons, links, or inline accents |
| Ember Wash | `#ff683d` | `--color-ember-wash` | Lighter highlight within the amber gradient — the illuminated folds of the curtain texture, appearing in hero highlights and statistic card upper regions |
| Midnight Ink | `#00104e` | `--color-midnight-ink` | Deep navy used sparingly for outlined link borders and select link text — the only chromatic accent in the otherwise achromatic interface, and only where link affordance must be unmistakable |
| Canvas Cream | `#f7f6f5` | `--color-canvas-cream` | Page background, the warm off-white that gives the whole system its paper-like editorial base — sits behind cards, inputs, and quiet content areas |
| Paper White | `#ffffff` | `--color-paper-white` | Card surfaces, elevated panels, button fills for ghost and light action variants — the bright top layer of the surface stack |
| Charcoal Depth | `#1c1c1c` | `--color-charcoal-depth` | Dark section backgrounds, footer, inverse card surfaces — the counterweight to the amber hero, used when content must read against a near-black ground |
| Graphite | `#292929` | `--color-graphite` | Filled button backgrounds, input fields, dense neutral surfaces — the primary action surface when a button must be heavy and deliberate rather than ghost |
| Stone | `#484848` | `--color-stone` | Secondary card backgrounds and darker card variants on light sections |
| Mist | `#989897` | `--color-mist` | Muted helper text, secondary metadata, and low-emphasis borders on light backgrounds |
| Foil | `#6a6a6a` | `--color-foil` | Quiet border strokes and disabled text — present but unobtrusive |
| Onyx | `#000000` | `--color-onyx` | Primary text, hairline borders, icon strokes, the dominant border color across the entire interface |

## Tokens — Typography

### sans-serif — sans-serif — detected in extracted data but not described by AI · `--font-sans-serif`
- **Weights:** 400
- **Sizes:** 12px
- **Line height:** 1.2
- **Role:** sans-serif — detected in extracted data but not described by AI

### Martina Plantijn — Display and editorial headlines — the only serif in the system, used at whisper-light weight 300 for hero statements and section titles. The choice of a 300-weight serif is anti-convention: most enterprise tools shout in 600–700 sans-serif; V7 lets the serif breathe and creates authority through typographic restraint. Letterspacing tightens as size grows (-0.02em at 40px, -0.01em at 30px) so large displays optically close into a single word-mass. · `--font-martina-plantijn`
- **Substitute:** GT Sectra, Tiempos Headline, or Playfair Display at weight 300
- **Weights:** 300, 400
- **Sizes:** 24px, 30px, 40px, 60px
- **Line height:** 1.00, 1.07, 1.33, 1.40
- **Letter spacing:** -0.02em, -0.01em
- **Role:** Display and editorial headlines — the only serif in the system, used at whisper-light weight 300 for hero statements and section titles. The choice of a 300-weight serif is anti-convention: most enterprise tools shout in 600–700 sans-serif; V7 lets the serif breathe and creates authority through typographic restraint. Letterspacing tightens as size grows (-0.02em at 40px, -0.01em at 30px) so large displays optically close into a single word-mass.

### STK Bureau — Body, navigation, UI controls, and subheadings — the workhorse face. The 430 weight is unusual (a micro-step between regular and medium) and gives buttons and labels a slightly denser feel than standard 400. Letterspacing follows a consistent contraction pattern, tighter at larger sizes and approaching zero at 12px and below. Acts as the 'ink' of the system while Martina Plantijn acts as the 'voice'. · `--font-stk-bureau`
- **Substitute:** Inter, Söhne, or Untitled Sans at 400 and 500
- **Weights:** 400, 430
- **Sizes:** 9px, 10px, 12px, 14px, 16px, 18px, 21px, 24px
- **Line height:** 1.00, 1.08, 1.11, 1.14, 1.17, 1.25, 1.40, 1.43, 1.56
- **Letter spacing:** -0.027em, -0.025em, -0.02em, -0.01em
- **Role:** Body, navigation, UI controls, and subheadings — the workhorse face. The 430 weight is unusual (a micro-step between regular and medium) and gives buttons and labels a slightly denser feel than standard 400. Letterspacing follows a consistent contraction pattern, tighter at larger sizes and approaching zero at 12px and below. Acts as the 'ink' of the system while Martina Plantijn acts as the 'voice'.

### Inter — Small inline metadata and tertiary body text — appears in badge-like annotations and compact helper labels where STK Bureau's tighter tracking would feel too dense at minimum sizes. · `--font-inter`
- **Substitute:** System UI, SF Pro Text, or IBM Plex Sans at 400
- **Weights:** 400, 500
- **Sizes:** 12px, 16px
- **Line height:** 1.33
- **Role:** Small inline metadata and tertiary body text — appears in badge-like annotations and compact helper labels where STK Bureau's tighter tracking would feel too dense at minimum sizes.

### Inter Variable — Inter Variable — detected in extracted data but not described by AI · `--font-inter-variable`
- **Weights:** 400, 500
- **Sizes:** 12px
- **Line height:** 1.33
- **Role:** Inter Variable — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.2 | -0.01px | `--text-caption` |
| body-sm | 14px | 1.25 | -0.01px | `--text-body-sm` |
| body | 16px | 1.4 | -0.01px | `--text-body` |
| subheading | 18px | 1.43 | -0.02px | `--text-subheading` |
| subheading-lg | 24px | 1.4 | -0.02px | `--text-subheading-lg` |
| heading-sm | 30px | 1.33 | -0.01px | `--text-heading-sm` |
| heading | 40px | 1.07 | -0.02px | `--text-heading` |
| display | 60px | 1 | -0.02px | `--text-display` |

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
| 36 | 36px | `--spacing-36` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 60 | 60px | `--spacing-60` |
| 80 | 80px | `--spacing-80` |
| 100 | 100px | `--spacing-100` |
| 120 | 120px | `--spacing-120` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 12px |
| icons | 99px |
| pills | 99px |
| inputs | 160px |
| buttons | 160px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| subtle | `rgba(0, 0, 0, 0.25) 0px 1px 2px 0px` | `--shadow-subtle` |
| subtle-2 | `rgba(0, 0, 0, 0.05) 0px 1px 2px 0px` | `--shadow-subtle-2` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 24px
- **Element gap:** 8px

## Components

### Hero Amber Banner
**Role:** First-screen atmospheric statement

Full-bleed amber gradient (Amber Curtain #ec580a deepening into deeper ember, overlaid with vertical lighter streaks creating a curtain-of-light texture). Centered stack: Martina Plantijn 60px weight 300 display headline in white, followed by a subheading line in STK Bureau 18px, then a white pill button. Occupies the full viewport height. The streak texture is the signature — it makes the orange read as light through fabric, not as a flat fill.

### White Pill Button (Primary)
**Role:** Main call-to-action on amber and light sections

STK Bureau 14px weight 430, white fill (#ffffff), black text (#000000), 160px border-radius (fully pill), 12px 20px padding, 1px solid #000000 border. Appears on amber hero and dark sections. The black hairline border on a white pill is deliberate — it gives the button weight without filling it with color.

### Graphite Pill Button (Secondary)
**Role:** Heavier action on light and cream sections

STK Bureau 14px weight 430, #292929 fill, white text, 160px radius, 12px 20px padding. Used when a button must dominate the visual hierarchy on a light cream canvas. Reads as a near-black capsule.

### Ghost Pill Button
**Role:** Secondary or tertiary action

Transparent fill, 1px solid #000000 border, black text, 160px radius, 12px 20px padding. Used for 'Log in' and lower-priority actions where the button should be present but not assertive.

### Dark Feature Card
**Role:** Product workflow showcase on inverse sections

#1c1c1c background, 12px border-radius, 24px internal padding, minimal 1px subtle border. Contains a product-screenshot preview (blurred/darkened), a small label tag, a heading, and body text. The card sits on a #1c1c1c section background with no shadow — the boundary is created by the screenshot content, not by elevation.

### Statistic Card
**Role:** Large-number proof points on amber section

Amber gradient fill (Amber Curtain to Ember Wash), 12px radius, 24px padding, 8px inner gap. Houses a Martina Plantijn 60px weight 300 number in white, followed by a STK Bureau 16px descriptor. The card-on-amber effect: when cards are placed on the amber section, they become indistinguishable from the ground, making the number appear to float.

### Before/After Comparison Block
**Role:** Impact statement under statistics

Inline composition: STK Bureau 12px 'Before' label in #989897 muted text, then a slash, then a Martina Plantijn 24px weight 300 result figure. Sits directly under a statistic card with no container — the typographic contrast does the work.

### Logo Bar
**Role:** Social proof below hero

Horizontal row of partner/client wordmarks, STK Bureau 12px grayscale (#989897 or white on amber), 80px row gap, centered. Logos are rendered in white on the amber hero and in black or #989897 on light sections.

### Announcement Bar
**Role:** Slim top-of-page notice

Full-width, #1c1c1c background, STK Bureau 12px white text centered, with a small inline arrow glyph. 8px vertical padding, 4px element gap. The only dark element above the hero.

### Top Navigation
**Role:** Primary site navigation

Transparent background over hero (white text) on amber, then switches to white background with black text on cream sections. STK Bureau 14px weight 430. Logo on far left, nav links centered, 'Log in' ghost button + white pill 'Request a demo' on far right. Hairline 1px #000000 bottom border on light sections, none on amber.

### Cookie Consent Pill
**Role:** Persistent consent notice

White background, 8px radius, 16px padding, 1px #000000 border. STK Bureau 12px body text with a 'Privacy Policy' inline link. 'Okay' button is a 40px-radius pill with #000000 fill, white text. Positioned bottom-right with a soft drop shadow.

### Testimonial Quote Block
**Role:** Customer voice on amber section

Full-bleed continuation of the amber gradient, centered text stack: STK Bureau 24px weight 400 quote in white, followed by 12px attribution in lighter weight. Large internal padding (64px top/bottom), max-width 600px for the text column.

### Cookie Banner Override
**Role:** Persistent micro-CTA

Small 8px-radius card pinned bottom-right, white fill, 1px hairline border, 12px STK Bureau text. The 'Okay' action is a compact 40px-radius pill. This component is the only place a compact shadow appears.

## Do's and Don'ts

### Do
- Use 160px border-radius for all interactive buttons and form inputs — the fully pill shape is non-negotiable across every control
- Set headlines in Martina Plantijn weight 300 at 40px or 60px; never go bolder than 400 in the serif
- Apply the amber gradient only to full-bleed hero and statistics sections; never use it as a button fill, badge background, or inline accent
- Pair every white pill button with a 1px #000000 border — the hairline edge gives the pill weight without committing it to a color
- Alternate sections strictly between #f7f6f5 cream and #1c1c1c near-black; light content goes on cream, dark content (product screenshots, workflow demos) goes on near-black
- Use 1px solid #000000 as the default border color on light surfaces and 1px solid #292929 on dark surfaces
- Set body copy in STK Bureau 16px with -0.01em tracking; tighten to -0.02em only at 24px and above

### Don't
- Never apply the amber/orange palette to buttons, links, icons, or form controls — it belongs only to atmospheric full-bleed sections
- Never use shadows on cards, panels, or content surfaces — the only shadows permitted are on viewport-anchored overlays
- Never set a headline in STK Bureau or a body paragraph in Martina Plantijn — the serif/sans division between voice and ink is structural
- Never use radius values other than 99px, 12px, and 160px; the 8px mid-tier is reserved for small overlay cards only
- Never break the section alternation by placing light-mode product cards directly under the dark inverse sections without a clear boundary
- Never set body text below 14px in the editorial context; 12px is the absolute floor and belongs only in tags and metadata
- Never use chromatic color for status indicators, success states, or error states — stay achromatic and use weight, position, and the navy #00104 for emphasis only

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Canvas | `#f7f6f5` | The page ground — warm cream that reads like uncoated paper |
| 2 | Card | `#ffffff` | Lifted content surfaces — product cards, testimonial blocks, and white pill buttons sit here |
| 3 | Dark Panel | `#1c1c1c` | Inverse sections — workflow showcases and feature grids on near-black |
| 4 | Graphite Field | `#292929` | Dense surface for inputs, filled buttons, and the darker card tier |
| 5 | Amber Stage | `#ec580a` | Hero atmospheric layer and statistics blocks — the only chromatic surface tier |

## Elevation

- **Cookie consent card:** `rgba(0, 0, 0, 0.05) 0px 1px 2px 0px`
- **Floating notification badges:** `rgba(0, 0, 0, 0.25) 0px 1px 2px 0px`

## Imagery

No photography, no lifestyle imagery, no stock visuals. The only imagery is product-screenshot artwork embedded inside dark feature cards — previews of the V7 workspace, data tables, and document-processing UI, all rendered as realistic app captures with native OS chrome. The hero relies on a procedural gradient with vertical streak texture rather than a photograph. Iconography is absent or used at micro scale; the system reads as text-and-product-screenshot driven, not icon-driven. The visual language is editorial-archive: warm light + paper + darkroom, where the product screenshots ARE the imagery.

## Layout

The page model is a vertical stack of full-bleed sections, each section filling the full viewport width with no max-width constraint at the section level. Content inside sections is centered within a 1200px max-width column. The first section is a full-viewport amber hero with centered text stack. Below it, a logo bar sits centered within the amber field. The page then alternates: dark (#1c1c1c) product-workflow section with a 3-column card grid, then a full-bleed amber statistics block with a 3-column card grid of large numbers, then back to cream. The navigation is a single transparent bar over the hero that transitions to a white bar with hairline border as the user scrolls into cream sections. The overall rhythm is: warm → dark → warm → light → dark, with the amber sections acting as exclamation points and the cream/dark sections doing the quiet explanatory work.

## Agent Prompt Guide

**Quick Color Reference**
- text: #000000
- background: #f7f6f5 (cream) / #1c1c1c (dark)
- border: #000000 hairline
- accent: #ec580a (amber, atmospheric only)
- primary action: #292929 (filled action)

**Example Component Prompts**
1. *White pill action button*: STK Bureau 14px weight 430, white #ffffff fill, black #000000 text, 1px solid #000000 border, 160px border-radius, 12px vertical × 20px horizontal padding. Pair with a Graphite Pill Button variant using #292929 fill and white text for heavier emphasis.

2. *Hero amber banner*: Full-bleed amber gradient (linear from #ec580a deepening to #c44708, with lighter #ff683d vertical streaks at 20% opacity). Centered stack inside 1200px max-width: Martina Plantijn 60px weight 300 white headline with -0.02em tracking and 1.0 line-height, STK Bureau 18px weight 400 white subheading at 1.43 line-height, then a White Pill Button. Full viewport height.

3. *Dark product feature card*: #1c1c1c fill, 12px border-radius, 24px padding, 1px solid #292929 border. Contains a product-screenshot image block (blurred edges, aspect-ratio 16:10), a small STK Bureau 12px uppercase tag, a Martina Plantijn 30px weight 300 white heading, and a STK Bureau 14px #989897 body line. No shadow.

4. *Stat block on amber*: Amber gradient fill, 12px radius, 24px padding, 8px inner gap. Martina Plantijn 60px weight 300 white number at 1.0 line-height, STK Bureau 16px weight 400 white descriptor below at 1.25 line-height. Sits on the full-bleed amber section background — the card visually merges with the ground so only the number reads.

5. *Top navigation over hero*: Transparent background, no border, STK Bureau 14px weight 430 white text for nav items. Logo white on left, nav links centered, ghost 'Log in' link and white-pill 'Request a demo' button on right. When the user scrolls past the hero, the nav switches to white #ffffff background with a 1px solid #000000 bottom border and black text.

## Section Rhythm Rules

Sections alternate strictly between two states: AMBER (full-bleed gradient, white text, display serif, 80px vertical padding) and QUIET (cream #f7f6f5 background or dark #1c1c1c background, 80px vertical padding, STK Bureau body). No section may bridge between amber and quiet within a single block. The amber sections serve exactly three purposes: hero, statistics, and testimonials — they are exclamation points in an otherwise archival composition. Dark sections are reserved for product-workflow demonstrations; cream sections are reserved for explanations, feature grids, and supporting content. A dark section may never follow another dark section, and a cream section may never follow another cream section without an amber separator or a hairline divider.

## Similar Brands

- **Linear** — Same restrained achromatic UI with a single dramatic full-bleed color moment — Linear uses purple gradients, V7 uses amber, but the structural pattern of a vivid hero followed by a near-monochrome product surface is identical
- **Pinecone** — Similar editorial-archive feel with a serif display face carrying headline weight and a dense sans-serif body — and the same discipline of reserving one atmospheric color for hero blocks only
- **Harvey (legal AI)** — Same enterprise-AI pattern of warm, light-infused hero, cream/dark alternating sections, and pill-shaped minimal controls — the warm-light-intelligence visual vocabulary is shared
- **Anthropic** — Same whisper-light serif headlines (Anthropic uses a custom serif at weight 300–400) over full-bleed atmospheric color, then strict monochrome product surfaces below — both brands choose typographic restraint over display weight for authority
- **Hebbia** — Same enterprise-AI with a single warm atmospheric hero color and a near-black product showcase section below — the vertical-streak amber gradient treatment is distinctive to this corner of the market

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-amber-curtain: #ec580a;
  --color-ember-wash: #ff683d;
  --color-midnight-ink: #00104e;
  --color-canvas-cream: #f7f6f5;
  --color-paper-white: #ffffff;
  --color-charcoal-depth: #1c1c1c;
  --color-graphite: #292929;
  --color-stone: #484848;
  --color-mist: #989897;
  --color-foil: #6a6a6a;
  --color-onyx: #000000;

  /* Typography — Font Families */
  --font-sans-serif: 'sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-martina-plantijn: 'Martina Plantijn', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-stk-bureau: 'STK Bureau', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter-variable: 'Inter Variable', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.2;
  --tracking-caption: -0.01px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.25;
  --tracking-body-sm: -0.01px;
  --text-body: 16px;
  --leading-body: 1.4;
  --tracking-body: -0.01px;
  --text-subheading: 18px;
  --leading-subheading: 1.43;
  --tracking-subheading: -0.02px;
  --text-subheading-lg: 24px;
  --leading-subheading-lg: 1.4;
  --tracking-subheading-lg: -0.02px;
  --text-heading-sm: 30px;
  --leading-heading-sm: 1.33;
  --tracking-heading-sm: -0.01px;
  --text-heading: 40px;
  --leading-heading: 1.07;
  --tracking-heading: -0.02px;
  --text-display: 60px;
  --leading-display: 1;
  --tracking-display: -0.02px;

  /* Typography — Weights */
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-w430: 430;
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
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-60: 60px;
  --spacing-80: 80px;
  --spacing-100: 100px;
  --spacing-120: 120px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 24px;
  --element-gap: 8px;

  /* Border Radius */
  --radius-sm: 2px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-3xl: 33px;
  --radius-3xl-2: 40px;
  --radius-full: 99px;
  --radius-full-2: 120px;
  --radius-full-3: 160px;

  /* Named Radii */
  --radius-cards: 12px;
  --radius-icons: 99px;
  --radius-pills: 99px;
  --radius-inputs: 160px;
  --radius-buttons: 160px;

  /* Shadows */
  --shadow-subtle: rgba(0, 0, 0, 0.25) 0px 1px 2px 0px;
  --shadow-subtle-2: rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;

  /* Surfaces */
  --surface-canvas: #f7f6f5;
  --surface-card: #ffffff;
  --surface-dark-panel: #1c1c1c;
  --surface-graphite-field: #292929;
  --surface-amber-stage: #ec580a;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-amber-curtain: #ec580a;
  --color-ember-wash: #ff683d;
  --color-midnight-ink: #00104e;
  --color-canvas-cream: #f7f6f5;
  --color-paper-white: #ffffff;
  --color-charcoal-depth: #1c1c1c;
  --color-graphite: #292929;
  --color-stone: #484848;
  --color-mist: #989897;
  --color-foil: #6a6a6a;
  --color-onyx: #000000;

  /* Typography */
  --font-sans-serif: 'sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-martina-plantijn: 'Martina Plantijn', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-stk-bureau: 'STK Bureau', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter-variable: 'Inter Variable', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.2;
  --tracking-caption: -0.01px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.25;
  --tracking-body-sm: -0.01px;
  --text-body: 16px;
  --leading-body: 1.4;
  --tracking-body: -0.01px;
  --text-subheading: 18px;
  --leading-subheading: 1.43;
  --tracking-subheading: -0.02px;
  --text-subheading-lg: 24px;
  --leading-subheading-lg: 1.4;
  --tracking-subheading-lg: -0.02px;
  --text-heading-sm: 30px;
  --leading-heading-sm: 1.33;
  --tracking-heading-sm: -0.01px;
  --text-heading: 40px;
  --leading-heading: 1.07;
  --tracking-heading: -0.02px;
  --text-display: 60px;
  --leading-display: 1;
  --tracking-display: -0.02px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-60: 60px;
  --spacing-80: 80px;
  --spacing-100: 100px;
  --spacing-120: 120px;

  /* Border Radius */
  --radius-sm: 2px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-3xl: 33px;
  --radius-3xl-2: 40px;
  --radius-full: 99px;
  --radius-full-2: 120px;
  --radius-full-3: 160px;

  /* Shadows */
  --shadow-subtle: rgba(0, 0, 0, 0.25) 0px 1px 2px 0px;
  --shadow-subtle-2: rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
}
```
