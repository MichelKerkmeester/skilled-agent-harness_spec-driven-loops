# Better Stack — Style Reference
> Midnight SRE console

**Theme:** dark

Better Stack operates as a midnight SRE console: a near-black canvas with monochrome surfaces, hairline borders doing the work that elevation does elsewhere, and a single violet-blue accent that surfaces only on actions, links, and gradients. Typography is Helvetica Now with stylistic alternates enabled, giving headlines a crisp, engineered feel — tight tracking, medium weights, and no decorative flourishes. The interface reads like a dark IDE: borders define shapes, inset white highlights suggest depth without drop shadows, and color appears as a scarce resource to mark interactivity. Components are light, flat, and confident — rounded 16px cards, 9999px pill buttons, no heavy panels or skeuomorphic depth.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Void Black | `#0f101a` | `--color-void-black` | Page canvas, nav background, link backgrounds |
| Carbon Surface | `#151621` | `--color-carbon-surface` | Card surfaces, primary button background — one step above the canvas |
| Gunmetal | `#1f2433` | `--color-gunmetal` | Input borders, elevated card borders, subtle surface lift |
| Steel Border | `#939db8` | `--color-steel-border` | Primary hairline border, icon outlines, nav borders — the workhorse border that defines most shapes |
| Muted Steel | `#646e87` | `--color-muted-steel` | Secondary text, subdued borders, inactive nav items |
| Frost | `#c9d3ee` | `--color-frost` | Active nav text, icon strokes, light-on-dark headings |
| Pure White | `#ffffff` | `--color-pure-white` | Primary heading text, body text emphasis, button text |
| Deep Ink | `#000000` | `--color-deep-ink` | SVG icon fills, shadow anchor for inset highlights |
| Iris Blue | `linear-gradient(353deg, rgb(91, 99, 211) 17.51%, rgb(124, 135, 247) 183.08%)` | `--color-iris-blue` | Supporting palette color for small decorative accents when the core palette needs contrast. Do not promote it to the primary CTA color |
| Periwinkle Glow | `#98a4f7` | `--color-periwinkle-glow` | Link color, gradient end stop, accent borders — the only chromatic UI color |

## Tokens — Typography

### Helvetica Now Text — Body text, navigation, buttons, inputs, card content, links, icons · `--font-helvetica-now-text`
- **Substitute:** Inter
- **Weights:** 400, 500, 700
- **Sizes:** 10, 12, 13, 14, 16, 20, 28, 36px
- **Line height:** 1.45, 1.50, 1.55, 1.60, 1.85
- **Letter spacing:** -0.01em uniformly
- **OpenType features:** `"ss01" on, "ss03" on, "ss04" on, "ss19" on`
- **Role:** Body text, navigation, buttons, inputs, card content, links, icons

### Helvetica Now Display — Hero and section headlines · `--font-helvetica-now-display`
- **Substitute:** Inter Display
- **Weights:** 500, 700
- **Sizes:** 40, 53px
- **Line height:** 1.08, 1.10
- **Letter spacing:** -0.01em
- **OpenType features:** `"salt" on, "ss02" on; "ss01" on, "ss03" on, "ss04" on, "ss19" on`
- **Role:** Hero and section headlines

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 10px | 1.55 | -0.1px | `--text-caption` |
| body-sm | 14px | 1.55 | -0.14px | `--text-body-sm` |
| body | 16px | 1.6 | -0.16px | `--text-body` |
| subheading | 20px | 1.45 | -0.2px | `--text-subheading` |
| heading-sm | 28px | 1.45 | -0.28px | `--text-heading-sm` |
| heading | 36px | 1.17 | -0.36px | `--text-heading` |
| heading-lg | 40px | 1.1 | -0.4px | `--text-heading-lg` |
| display | 53px | 1.08 | -0.53px | `--text-display` |

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
| 44 | 44px | `--spacing-44` |
| 48 | 48px | `--spacing-48` |
| 56 | 56px | `--spacing-56` |
| 128 | 128px | `--spacing-128` |
| 164 | 164px | `--spacing-164` |
| 192 | 192px | `--spacing-192` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 10px |
| cards | 16px |
| inputs | 10px |
| buttons | 9999px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| subtle | `rgba(255, 255, 255, 0.25) 0px 1px 3px 0px inset` | `--shadow-subtle` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 20px
- **Element gap:** 20px

## Components

### Primary CTA Button (Gradient)
**Role:** Main call-to-action — sign up, start for free

Pill shape (9999px radius). Background: linear-gradient(353deg, #5b63d3 17.51%, #7c87f7 183.08%). Text: white, Helvetica Now Text 16px weight 500. Padding: 8px 20px. No border. White text. This is the only gradient element in the UI — it earns the right to be chromatic by being the conversion point.

### Ghost/Outlined Button
**Role:** Secondary actions — explore pricing, explore AI SRE

Pill shape (9999px radius). Transparent background, 1px border in #939db8 or #262935. Text: #c9d3ee or #ffffff, Helvetica Now Text 14-16px weight 500. Padding: 8px 20px. Often paired with a chevron/arrow icon.

### Email Input Field
**Role:** Hero lead capture

Background: #0f101a (canvas, not surface — sits as a well). Border: 1px #1f2433. Radius: 10px. Padding: 12px 20px. Placeholder text in #646e87. Helvetica Now Text 16px weight 400. Pairs with a gradient CTA button to its right.

### Comparison Card
**Role:** Pricing/feature comparison panel (the 'At a fraction of your current costs' section)

Background: #151621. Border: 1px #1f2433. Radius: 16px. Padding: 20-24px internal. Contains 3-column metric headers (1 TB, 1 TB, 1 TB), pricing rows, and a fine-print footnote in 12px #646e87. The card creates a floating data table feel.

### Testimonial Card
**Role:** Social proof tiles in the grid

Background: #151621. Border: 1px #1f2433. Radius: 16px. Padding: 20px. Contains quoted text (Helvetica Now Text 14-16px), a handle in #98a4f7, a display name, an avatar circle, and a small periwinkle checkmark icon.

### Top Navigation Bar
**Role:** Primary site navigation

Background: #0f101a (canvas, transparent over page). Height: ~56px. Horizontal layout with logo left, nav links center (Platform, Documentation, Pricing, Community, Company, Enterprise), Sign In and gradient Sign Up button right. Subtle inset white highlight at the top edge (rgba(255,255,255,0.25) 0 1px 3px inset) creates a hairline divider from the page.

### Logo Trust Bar
**Role:** Social proof below hero

Horizontal row of partner/customer logos (NordVPN, UNICEF, Canada, Decathlon, Raycast, Ametek). Logos are monochrome #939db8 or #646e87, no color, evenly spaced with ~40-60px gaps. No background, no border — sits directly on the dark canvas.

### Product Screenshot Showcase
**Role:** Hero visual — dashboard mockup

Large dark product UI mockup with internal panels showing observability charts (area charts in muted periwinkle, line graphs, KPI cards). The screenshot itself acts as a visual element, floating on the canvas with no frame or shadow.

### Section Heading Block
**Role:** Section titles (e.g., 'Don't just take our word for it')

Centered text block. Heading: Helvetica Now Display 40px weight 500, white. Subtext: Helvetica Now Text 16-20px weight 400, #c9d3ee or #646e87. Max-width contained, centered. Often followed by a carousel/grid of cards below.

### Metric Stat Block
**Role:** Key statistics in feature sections (80x more data, 98% lower costs)

Large number in Helvetica Now Display 40-53px weight 500, white. Label below in 14-16px weight 400, #c9d3ee. Left-aligned within a two-column layout, tight 4-8px gap between number and label.

### Navigation Dropdown Item
**Role:** Dropdown menu items under Platform/Community nav links

Background: #151621. Border: 1px #1f2433. Radius: 16px. Padding: 16-20px. Contains small icon + label pairs. Text in #ffffff or #c9d3ee.

## Do's and Don'ts

### Do
- Use #939db8 as the default border color for cards, inputs, and dividers — it's the structural border of the system
- Use the violet-blue gradient (linear-gradient(353deg, #5b63d3, #7c87f7)) exclusively for the primary CTA — one gradient, one job
- Apply the inset white highlight (rgba(255,255,255,0.25) 0 1px 3px inset) to nav and filled buttons for a 1px top rim-light
- Use Helvetica Now Display at weight 500 for headlines — not 700; authority comes from precision, not weight
- Keep letter-spacing at -0.01em uniformly across all text sizes; the tracking is part of the system identity
- Enable font features "ss01", "ss03", "ss04", "ss19" on body text and add "salt", "ss02" on display — these shape the distinctive letterforms
- Define depth through surface tones (#0f101a → #151621 → #1f2433), not drop shadows

### Don't
- Don't use drop shadows for elevation — the system uses inset highlights and surface contrast only
- Don't use the periwinkle (#98a4f7) as a filled button background — it belongs to links and gradient stops
- Don't use weight 700 for body or nav text — 500 is the maximum for UI; 700 is reserved for emphasis only
- Don't introduce new chromatic colors — the 10% colorfulness budget is already spent on the violet-blue accent
- Don't use sharp corners (0-4px) on cards or buttons — 16px for cards, 9999px for buttons, 10px for inputs
- Don't use the canvas color (#0f101a) for card surfaces — cards must be at least #151621 to be distinguishable
- Don't use bright or saturated text colors — text should be white, #c9d3ee, or #646e87 only

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#0f101a` | Page background, full-bleed dark base |
| 1 | Card Surface | `#151621` | Card bodies, comparison panels, product containers |
| 2 | Elevated Border | `#1f2433` | Input fields, bordered card edges |

## Elevation

- **Navigation Bar:** `rgba(255, 255, 255, 0.25) 0px 1px 3px 0px inset`
- **Primary Button (filled):** `rgba(255, 255, 255, 0.25) 0px 1px 3px 0px inset`

## Imagery

The site uses product screenshots as hero visuals — actual dashboard UI mockups showing observability charts, logs, and metrics panels. These are not stock photos but rendered product surfaces, dark-themed to match the page. No lifestyle photography, no abstract illustrations, no 3D renders. Partner/customer logos appear as monochrome wordmarks in #939db8. The visual language is entirely product-centric: the tool's own interface IS the marketing imagery.

## Layout

Max-width 1200px centered content with full-bleed dark sections. Hero is a split layout: left column with headline (40-53px display), subtext, email input + gradient CTA, and fine print; right column with a large product screenshot that overlaps or sits as a floating panel. Subsequent sections alternate between two-column text+visual layouts and centered text blocks with card grids below. Sections are separated by generous vertical breathing room (80px+). Testimonials appear in a 4-column card grid. The rhythm is: dark hero → 2-col cost comparison → card grid testimonials → dark footer.

## Agent Prompt Guide

## Quick Color Reference
- Text primary: #ffffff
- Text secondary: #c9d3ee
- Text muted: #646e87
- Canvas: #0f101a
- Card surface: #151621
- Border: #939db8
- Accent / links: #98a4f7
- primary action: #151621 (filled action)

## Example Component Prompts

1. Create a Primary Action Button: #151621 background, #ffffff text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.

2. **Ghost Navigation Button**: Pill shape, transparent background, 1px border in #262935, text #c9d3ee, Helvetica Now Text 14px weight 500, padding 8px 20px, with a right chevron icon.

3. **Comparison Card**: Background #151621, 1px border #1f2433, 16px radius, 24px padding. Contains a 3-column header row with metric labels in 20px weight 500 white, a divider in #1f2433, and rows comparing competitor vs Better Stack with prices in 16px weight 500.

4. **Testimonial Tile**: Background #151621, 1px border #1f2433, 16px radius, 20px padding. Quote text in 14px weight 400 #ffffff, Twitter handle in #98a4f7, display name in 14px weight 500, avatar circle 32px, small periwinkle checkmark icon.

5. **Hero Section**: Full-width dark canvas (#0f101a). Left: 53px display headline in white, 20px subtext in #c9d3ee, email input (background #0f101a, 1px border #1f2433, 10px radius) paired with a gradient 'Start for free' button. Right: large product screenshot floating with no frame or shadow. Vertical spacing 40px between headline and subtext.

## Similar Brands

- **Linear** — Same dark engineering-tool aesthetic with tight borders, gradient CTA, and flat surfaces
- **Vercel** — Dark canvas with a single chromatic accent (blue/indigo gradient), hairline borders defining shapes
- **Render** — Near-black background, monochrome surfaces, minimal color used only for primary actions
- **Railway** — Dark devtool interface with flat cards, border-defined shapes, restrained accent color

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-void-black: #0f101a;
  --color-carbon-surface: #151621;
  --color-gunmetal: #1f2433;
  --color-steel-border: #939db8;
  --color-muted-steel: #646e87;
  --color-frost: #c9d3ee;
  --color-pure-white: #ffffff;
  --color-deep-ink: #000000;
  --color-iris-blue: #5b63d3;
  --gradient-iris-blue: linear-gradient(353deg, rgb(91, 99, 211) 17.51%, rgb(124, 135, 247) 183.08%);
  --color-periwinkle-glow: #98a4f7;

  /* Typography — Font Families */
  --font-helvetica-now-text: 'Helvetica Now Text', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-helvetica-now-display: 'Helvetica Now Display', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.55;
  --tracking-caption: -0.1px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.55;
  --tracking-body-sm: -0.14px;
  --text-body: 16px;
  --leading-body: 1.6;
  --tracking-body: -0.16px;
  --text-subheading: 20px;
  --leading-subheading: 1.45;
  --tracking-subheading: -0.2px;
  --text-heading-sm: 28px;
  --leading-heading-sm: 1.45;
  --tracking-heading-sm: -0.28px;
  --text-heading: 36px;
  --leading-heading: 1.17;
  --tracking-heading: -0.36px;
  --text-heading-lg: 40px;
  --leading-heading-lg: 1.1;
  --tracking-heading-lg: -0.4px;
  --text-display: 53px;
  --leading-display: 1.08;
  --tracking-display: -0.53px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
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
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-44: 44px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-128: 128px;
  --spacing-164: 164px;
  --spacing-192: 192px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 20px;
  --element-gap: 20px;

  /* Border Radius */
  --radius-lg: 10px;
  --radius-2xl: 16px;
  --radius-3xl: 26px;
  --radius-3xl-2: 43px;
  --radius-full: 200px;
  --radius-full-2: 9999px;

  /* Named Radii */
  --radius-nav: 10px;
  --radius-cards: 16px;
  --radius-inputs: 10px;
  --radius-buttons: 9999px;

  /* Shadows */
  --shadow-subtle: rgba(255, 255, 255, 0.25) 0px 1px 3px 0px inset;

  /* Surfaces */
  --surface-canvas: #0f101a;
  --surface-card-surface: #151621;
  --surface-elevated-border: #1f2433;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-void-black: #0f101a;
  --color-carbon-surface: #151621;
  --color-gunmetal: #1f2433;
  --color-steel-border: #939db8;
  --color-muted-steel: #646e87;
  --color-frost: #c9d3ee;
  --color-pure-white: #ffffff;
  --color-deep-ink: #000000;
  --color-iris-blue: #5b63d3;
  --color-periwinkle-glow: #98a4f7;

  /* Typography */
  --font-helvetica-now-text: 'Helvetica Now Text', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-helvetica-now-display: 'Helvetica Now Display', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.55;
  --tracking-caption: -0.1px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.55;
  --tracking-body-sm: -0.14px;
  --text-body: 16px;
  --leading-body: 1.6;
  --tracking-body: -0.16px;
  --text-subheading: 20px;
  --leading-subheading: 1.45;
  --tracking-subheading: -0.2px;
  --text-heading-sm: 28px;
  --leading-heading-sm: 1.45;
  --tracking-heading-sm: -0.28px;
  --text-heading: 36px;
  --leading-heading: 1.17;
  --tracking-heading: -0.36px;
  --text-heading-lg: 40px;
  --leading-heading-lg: 1.1;
  --tracking-heading-lg: -0.4px;
  --text-display: 53px;
  --leading-display: 1.08;
  --tracking-display: -0.53px;

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
  --spacing-44: 44px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-128: 128px;
  --spacing-164: 164px;
  --spacing-192: 192px;

  /* Border Radius */
  --radius-lg: 10px;
  --radius-2xl: 16px;
  --radius-3xl: 26px;
  --radius-3xl-2: 43px;
  --radius-full: 200px;
  --radius-full-2: 9999px;

  /* Shadows */
  --shadow-subtle: rgba(255, 255, 255, 0.25) 0px 1px 3px 0px inset;
}
```
