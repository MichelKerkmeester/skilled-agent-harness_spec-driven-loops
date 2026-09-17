# Google for Education — Style Reference
> Open notebook in morning light — a digital classroom where whitespace, type, and one blue accent do all the work.

**Theme:** light

Google for Education operates as a restrained utility surface: a near-white canvas anchored by two type families (Google Sans Text for body and UI, Google Sans Display for headlines) and a single brand blue that functions as the system's only chromatic voice. Hierarchy comes from scale jumps and tracking — the 80px display headline is tightly tracked, while 12–16px body text opens up with positive letter-spacing for small-size legibility. Surfaces avoid decorative gradients and heavy shadows, relying on generous whitespace, 24–28px card radii, and pill-shaped controls to feel approachable rather than corporate. Color is functional punctuation, not atmosphere: green identifies the Classroom brand mark, blue marks links and active states, and everything else stays in a narrow gray scale (#202124 → #3c4043 → #5f6368 → #dadce0).

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Canvas White | `#f8f9fa` | `--color-canvas-white` | Page background, card surfaces, section bands — the off-white ground that prevents harshness against pure white product screenshots |
| Charcoal Ink | `#202124` | `--color-charcoal-ink` | Primary text, display headlines, active icon strokes — the deepest readable black-blue for maximum hierarchy |
| Graphite | `#3c4043` | `--color-graphite` | Secondary headings, nav text, strong body — one step lighter than charcoal for sub-headings and navigation labels |
| Slate | `#5f6368` | `--color-slate` | Muted body text, helper copy, icon glyphs, breadcrumb separators, footer micro-copy |
| Mist | `#dadce0` | `--color-mist` | Hairline borders, card outlines, input strokes, dividers between sections — the only structural separator in the system |
| Cloud Shadow | `#c4c6c7` | `--color-cloud-shadow` | Soft elevation on focused inputs and floating chips |
| Google Blue | `#1a73e8` | `--color-google-blue` | Blue supporting accent for decorative details and low-frequency emphasis. Do not promote it to the primary CTA color |
| Google Blue Deep | `#1967d2` | `--color-google-blue-deep` | Blue supporting accent for decorative details and low-frequency emphasis. Do not promote it to the primary CTA color |
| Classroom Green | `#188038` | `--color-classroom-green` | Green supporting accent for decorative details and low-frequency emphasis |

## Tokens — Typography

### Google Sans Display — Display headlines and section titles. The 80px display weight is the page's signature — tightly tracked and stacked to two lines in the hero. At 48px and below, tracking relaxes toward 0. Substituting with Inter (closest free analog) or Product Sans preserves the geometric warmth; system sans-serif will feel colder. · `--font-google-sans-display`
- **Substitute:** Inter, Product Sans, or DM Sans
- **Weights:** 400, 500, 700
- **Sizes:** 16px, 18px, 20px, 22px, 28px, 48px, 80px
- **Line height:** 1.09, 1.15, 1.17, 1.20, 1.29, 1.40, 1.50, 1.56, 1.75
- **Letter spacing:** -0.0100em at 80px, -0.0060em at 48px and below, 0.0010em at 20px, 0.0310em at 16px
- **Role:** Display headlines and section titles. The 80px display weight is the page's signature — tightly tracked and stacked to two lines in the hero. At 48px and below, tracking relaxes toward 0. Substituting with Inter (closest free analog) or Product Sans preserves the geometric warmth; system sans-serif will feel colder.

### Google Sans Text — Body copy, navigation, buttons, form inputs, helper text, breadcrumbs. Weight 400 is the default; 500 marks emphasis and nav-active states. The positive tracking at small sizes (0.036em at 12px) is anti-convention — it adds air to prevent the dense, gray-on-gray feel that typical SaaS body copy produces. · `--font-google-sans-text`
- **Substitute:** Inter, Roboto, or Noto Sans
- **Weights:** 300, 400, 500
- **Sizes:** 12px, 14px, 16px, 18px
- **Line height:** 1.00, 1.44, 1.50, 1.56, 1.63, 1.67, 1.71
- **Letter spacing:** 0.0060em at 18px, 0.0170em at 16px, 0.0360em at 12px — tracking opens as size shrinks, the opposite of most systems
- **Role:** Body copy, navigation, buttons, form inputs, helper text, breadcrumbs. Weight 400 is the default; 500 marks emphasis and nav-active states. The positive tracking at small sizes (0.036em at 12px) is anti-convention — it adds air to prevent the dense, gray-on-gray feel that typical SaaS body copy produces.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.5 | 0.432px | `--text-caption` |
| body-sm | 14px | 1.5 | 0.238px | `--text-body-sm` |
| body | 16px | 1.56 | 0.272px | `--text-body` |
| subheading | 18px | 1.67 | 0.108px | `--text-subheading` |
| heading-sm | 22px | 1.29 | -0.132px | `--text-heading-sm` |
| heading | 28px | 1.2 | -0.168px | `--text-heading` |
| heading-lg | 48px | 1.15 | -0.288px | `--text-heading-lg` |
| display | 80px | 1.09 | -0.8px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 8px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 8 | 8px | `--spacing-8` |
| 16 | 16px | `--spacing-16` |
| 24 | 24px | `--spacing-24` |
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 80 | 80px | `--spacing-80` |
| 88 | 88px | `--spacing-88` |
| 120 | 120px | `--spacing-120` |
| 216 | 216px | `--spacing-216` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 24-28px |
| chips | 9999px |
| links | 4px |
| inputs | 4px |
| buttons | 200px (pill) |
| navItems | 8px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 64-80px
- **Card padding:** 32-40px
- **Element gap:** 8-16px

## Components

### Top Announcement Bar
**Role:** Slim sticky banner above nav for product news, promos, and data-protection notices

Full-width band at 48px height, #f8f9fa background (same as canvas — no visual weight, just a divider line at the bottom in #dadce0). Body text 14px Google Sans Text weight 400 in #3c4043, centered. Inline link in #1a73e8 underlined. Close icon (X) at far right in #5f6368.

### Primary Navigation Bar
**Role:** Sticky global header with brand, primary links, search, account, and contact action

64px height, white background, 1px #dadce0 bottom border. Left: Google for Education wordmark (Google Sans Display, 18px, #202124). Center: nav links (Our values, Products, AI, Resources) at 14px weight 400 in #3c4043, underline indicator at 2px #1a73e8 on active. Right: search icon, account avatar (32px circle, #f8f9fa with #5f6368 glyph), 'Sign in' text link, and the filled pill button. Padding 0 24px.

### Filled Pill Button
**Role:** Primary interactive element — used for the highest-priority action per screen

Height 40px, padding 0 24px, border-radius 200px (fully pill). Background #1a73e8, text white, Google Sans Text 14px weight 500. No border. Hover/pressed: background shifts to #1967d2. One per viewport maximum — pair with a ghost button for secondary actions.

### Ghost Pill Button
**Role:** Secondary interactive element — pairs with the filled button to offer an alternative path

Same dimensions as the filled pill (40px height, 200px radius, 0 24px padding) but background is transparent, border 1px solid #dadce0, text #1a73e8. Hover: background #f8f9fa, border #1a73e8.

### Breadcrumb Trail
**Role:** Path indicator below nav showing page hierarchy

Left-aligned, 12px Google Sans Text weight 400 in #5f6368. Segments separated by '›' glyph in #5f6368. Current page segment in #202124 weight 500. Vertical padding 16px above and below.

### Hero Section
**Role:** Page-level introduction with brand mark, headline, description, and action pair

Centered, max-width 800px for the text block. Vertical padding 80px top, 64px bottom. Brand mark (small product icon + name) sits 32px above headline. Display headline: 80px Google Sans Display weight 400, #202124, letter-spacing -0.8px, two lines max. Description: 18px Google Sans Text weight 400, #5f6368, max-width 640px, 24px margin-top. Action pair: filled pill + ghost pill, 16px gap, 32px margin-top from description.

### Feature Showcase Card
**Role:** Two-column side-by-side panels showing product capabilities with embedded UI screenshots

Equal-width columns, 24px gap. Each card: border-radius 24px, padding 0 (the product screenshot bleeds to the card edge with a 8px inset for the inner caption). Top half: product UI screenshot with a soft blue-to-transparent gradient background (#1a73e8 at 8% opacity fading down). Bottom half: white background with 32px padding, heading 22px weight 500 #202124, body 16px #5f6368, and a text link with arrow at the bottom in #1a73e8.

### Tab Switcher
**Role:** Horizontal filter control to switch between feature categories

Inline row of three text labels (Personalize learning, Simplify everyday tasks, Gain insights and visibility) in a single pill container. Container: border-radius 9999px, border 1px #dadce0, background white, padding 4px. Active tab: background #f8f9fa, border-radius 9999px inset, text #202124 weight 500. Inactive: #5f6368 weight 400. No background fill on the active state — just a subtle gray pill within a gray pill.

### Inline Text Link
**Role:** Hyperlink within body copy and as standalone call-to-action labels

Google Sans Text, inherits size from surrounding text. Color #1a73e8. Underline 1px, underline-offset 2px. Hover: color #1967d2. Used for 'Try now', 'Learn more', breadcrumb links, and in-body references.

### Product Brand Mark
**Role:** Small icon-and-label combination identifying a Google product within the Education ecosystem

32×32px rounded square icon (border-radius 8px) paired with product name in 18px Google Sans Display weight 500 #202124. 12px gap between icon and label. Vertically centered as a group.

### Modal Dialog
**Role:** Overlay for region selection, confirmations, and focused tasks

Centered on scrim background (rgba(32, 33, 36, 0.5)). Card: 480px max-width, background white, border-radius 8px, no shadow — separation comes from the scrim alone. Header: product name with 32px icon at left, close (X) at right in #5f6368. Body: 16px #3c4043, 24px padding. Footer: right-aligned action pair (text link 'Stay here' + filled pill 'Go'), 16px gap, 24px padding.

### Search Icon Button
**Role:** Compact utility trigger in the nav for site search

40×40px, border-radius 50%. Transparent background, 24px magnifying-glass glyph in #5f6368. Hover: background #f8f9fa, glyph #202124. No border.

### Section Divider
**Role:** Visual break between page bands without adding a hard line

Whitespace-only divider. 64–80px vertical gap between content blocks. If a line is needed, use 1px #dadce0 spanning the full container width.

## Do's and Don'ts

### Do
- Use 200px border-radius on all filled and ghost buttons to maintain the pill shape that defines the system
- Set display headlines at 80px with -0.8px letter-spacing and 1.09 line-height — tight tracking at scale is the signature
- Apply positive letter-spacing to body text: 0.272px at 16px, 0.432px at 12px — tracking opens as size shrinks
- Use #1a73e8 for all interactive blue — links, icons, filled buttons, tab indicators, and active nav underlines
- Separate sections with 64–80px of whitespace, not divider lines — the canvas is uniform, rhythm comes from spacing
- Set card radii to 24–28px for feature panels and 8px for modals — the gap between these two radii is intentional
- Default to weight 400 for body and weight 500 for emphasis — never use 700 in body copy

### Don't
- Do not introduce shadows on cards or panels — elevation comes from surface color shifts, not box-shadow
- Do not use more than one filled button per viewport — pair with a ghost pill for secondary actions
- Do not use green (#188038) outside the Classroom brand mark and explicit success states — it is not a generic accent
- Do not use #1a73e8 for decorative backgrounds or large surface fills — it is an interactive color, reserve it for state
- Do not set display headlines above 80px or use weight 700 in headlines — the 80px weight-400 display is the ceiling
- Do not add gradients — the system is flat; the only color variation is the soft #e8f0fe tint behind product screenshots
- Do not use letter-spacing below 0 on body text — negative tracking is reserved for 22px and above

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#f8f9fa` | Page background — the soft off-white that prevents glare against white product screenshots |
| 1 | Card Surface | `#ffffff` | Feature cards, modal dialogs, embedded UI containers — true white to lift content off the canvas |
| 2 | Feature Panel Tint | `#e8f0fe` | Soft blue wash behind product screenshots in feature cards — ties the product UI to the brand accent |
| 3 | Scrim | `#20212480` | Modal overlay background — dims the page to focus attention |

## Elevation

The system uses almost no shadow. Elevation is communicated through surface color shifts (canvas #f8f9fa → card white) and the scrim layer behind modals. The one shadow value detected (#c4c6c7) appears only on focused input fields, where a soft outer ring communicates active state without adding visual weight to the page.

## Imagery

Imagery is product-screenshot-first: full-bleed captures of the actual Classroom interface rendered as the hero of each feature card, with a soft blue tint behind them to integrate with the page. No lifestyle photography, no stock illustrations, no decorative abstract graphics. Icons are flat, monochromatic, and geometric — Google Material outlined style at 1.5px stroke weight. The visual language is 'show the product' rather than 'illustrate the concept': every image is a literal screen of the software doing its job.

## Layout

Max-width 1200px centered container with 24px horizontal padding. Hero is a centered single-column stack (brand mark → display headline → description → action pair) with generous vertical breathing room (80px top, 64px bottom). Feature sections use a two-column equal grid with 24px gap, each card stacking a product screenshot over a text block. A horizontal tab switcher separates feature blocks. No sidebar, no asymmetric hero, no full-bleed imagery — everything sits inside the centered container against a uniform canvas. Navigation is a single sticky top bar; no mega-menu, no secondary nav row. The overall rhythm is: hero → feature pair → tab switcher → feature pair → repeating — each band separated by 64–80px of whitespace rather than dividers.

## Agent Prompt Guide

Quick Color Reference:
- text primary: #202124
- text secondary: #3c4043
- text muted: #5f6368
- background: #f8f9fa
- border: #dadce0
- accent: #1a73e8
- primary action: no distinct CTA color

Example Component Prompts:

1. Build a hero section. Background #f8f9fa, centered text block max-width 800px, padding 80px top / 64px bottom. Small product brand mark (32px icon + 18px Google Sans Display weight 500 #202124 label) at top. Display headline 80px Google Sans Display weight 400 #202124 letter-spacing -0.8px, two lines. Description 18px Google Sans Text weight 400 #5f6368, max-width 640px, 24px margin-top. Below: a filled pill (height 40px, radius 200px, background #1a73e8, white 14px weight 500 text) paired with a ghost pill (same size, transparent background, 1px #dadce0 border, #1a73e8 text), 16px gap, 32px margin-top from description.

2. Build a feature showcase card. Two equal-width columns side by side, 24px gap. Each card: border-radius 24px, no border, no shadow. Top half: product UI screenshot image, full-bleed to the card edges, set against a #e8f0fe background tint. Bottom half: white background, 32px padding all sides. Heading 22px Google Sans Display weight 500 #202124, 8px margin-bottom. Body 16px Google Sans Text weight 400 #5f6368. Bottom-left: inline text link in #1a73e8 with right-arrow glyph.

3. Build a tab switcher. Inline row inside a pill container (border-radius 9999px, 1px #dadce0 border, white background, 4px padding). Three tab labels in 14px Google Sans Text. Active tab: background #f8f9fa, text #202124 weight 500, border-radius 9999px. Inactive: #5f6368 weight 400, no background. Tabs separated only by the container padding, no internal dividers.

4. Build a breadcrumb trail. 12px Google Sans Text weight 400 #5f6368. Segments separated by '›' glyph in #5f6368 with 8px horizontal margin. Current (last) segment in #202124 weight 500. Clickable segments colored #1a73e8. Container padding 16px vertical.

5. Build a modal dialog. Centered on a scrim (rgba(32, 33, 36, 0.5)). Card: max-width 480px, white background, border-radius 8px, no shadow. Header: 32px product icon left-aligned with 18px product name in Google Sans Display weight 500 #202124, 24px padding, close X icon at right in #5f6368. Body: 16px #3c4043 text, 24px padding. Footer: right-aligned text link 'Stay here' in #1a73e8 paired with filled pill 'Go' (background #1a73e8, white text, 200px radius, 0 24px padding, 40px height), 16px gap, 24px padding.

## Similar Brands

- **Notion** — Same restrained single-accent approach — near-white canvas, one chromatic voice (blue for Notion, Google blue here), generous whitespace, and pill-shaped controls
- **Apple Education** — Both center on large tightly-tracked display headlines, use product screenshots as feature heroes, and keep the chrome almost invisible with a single-color nav bar
- **Figma** — Share the 'product-as-hero' visual logic — no decorative imagery, embedded UI screenshots carry the visual weight, and color is purely functional
- **Linear** — Both rely on tight typographic hierarchy and a narrow gray scale, with one brand color that appears only on interactive elements and icons
- **Microsoft Education** — Same light-canvas, large-headline hero pattern and product-screenshot feature cards, though Microsoft uses a broader accent palette

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-canvas-white: #f8f9fa;
  --color-charcoal-ink: #202124;
  --color-graphite: #3c4043;
  --color-slate: #5f6368;
  --color-mist: #dadce0;
  --color-cloud-shadow: #c4c6c7;
  --color-google-blue: #1a73e8;
  --color-google-blue-deep: #1967d2;
  --color-classroom-green: #188038;

  /* Typography — Font Families */
  --font-google-sans-display: 'Google Sans Display', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-google-sans-text: 'Google Sans Text', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --tracking-caption: 0.432px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --tracking-body-sm: 0.238px;
  --text-body: 16px;
  --leading-body: 1.56;
  --tracking-body: 0.272px;
  --text-subheading: 18px;
  --leading-subheading: 1.67;
  --tracking-subheading: 0.108px;
  --text-heading-sm: 22px;
  --leading-heading-sm: 1.29;
  --tracking-heading-sm: -0.132px;
  --text-heading: 28px;
  --leading-heading: 1.2;
  --tracking-heading: -0.168px;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.15;
  --tracking-heading-lg: -0.288px;
  --text-display: 80px;
  --leading-display: 1.09;
  --tracking-display: -0.8px;

  /* Typography — Weights */
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 8px;
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-80: 80px;
  --spacing-88: 88px;
  --spacing-120: 120px;
  --spacing-216: 216px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 64-80px;
  --card-padding: 32-40px;
  --element-gap: 8-16px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-3xl: 24px;
  --radius-3xl-2: 28px;
  --radius-full: 200px;
  --radius-full-2: 300px;

  /* Named Radii */
  --radius-cards: 24-28px;
  --radius-chips: 9999px;
  --radius-links: 4px;
  --radius-inputs: 4px;
  --radius-buttons: 200px (pill);
  --radius-navitems: 8px;

  /* Surfaces */
  --surface-canvas: #f8f9fa;
  --surface-card-surface: #ffffff;
  --surface-feature-panel-tint: #e8f0fe;
  --surface-scrim: #20212480;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-canvas-white: #f8f9fa;
  --color-charcoal-ink: #202124;
  --color-graphite: #3c4043;
  --color-slate: #5f6368;
  --color-mist: #dadce0;
  --color-cloud-shadow: #c4c6c7;
  --color-google-blue: #1a73e8;
  --color-google-blue-deep: #1967d2;
  --color-classroom-green: #188038;

  /* Typography */
  --font-google-sans-display: 'Google Sans Display', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-google-sans-text: 'Google Sans Text', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --tracking-caption: 0.432px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --tracking-body-sm: 0.238px;
  --text-body: 16px;
  --leading-body: 1.56;
  --tracking-body: 0.272px;
  --text-subheading: 18px;
  --leading-subheading: 1.67;
  --tracking-subheading: 0.108px;
  --text-heading-sm: 22px;
  --leading-heading-sm: 1.29;
  --tracking-heading-sm: -0.132px;
  --text-heading: 28px;
  --leading-heading: 1.2;
  --tracking-heading: -0.168px;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.15;
  --tracking-heading-lg: -0.288px;
  --text-display: 80px;
  --leading-display: 1.09;
  --tracking-display: -0.8px;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-80: 80px;
  --spacing-88: 88px;
  --spacing-120: 120px;
  --spacing-216: 216px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-3xl: 24px;
  --radius-3xl-2: 28px;
  --radius-full: 200px;
  --radius-full-2: 300px;
}
```
