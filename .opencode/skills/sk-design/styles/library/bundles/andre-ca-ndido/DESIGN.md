# André Cândido — Style Reference
> Editorial serif on cream paper with one yellow highlighter mark.

**Theme:** light

André Cândido's portfolio operates as an editorial design studio: a near-monochrome canvas of off-white paper and near-black ink, with one warm yellow accent that breaks the page like a highlighter mark. The signature is the pairing of PP Mori — a geometric sans — with Editorial New, a high-contrast didone serif used at extreme display sizes (up to 160px) for headlines that behave like magazine covers. Components are quiet and lightweight: hairline borders, pill-shaped buttons (24-50px radius), capsule-shaped images (800px radius), and no shadows. The footer inverts into a deep #111118 panel where the yellow reappears, creating a single dramatic dark moment in an otherwise airy light page. The visual system is dense with personality despite being 97% achromatic — circular text badges, playful geometric project cards, and asymmetric editorial grids give it character without color.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Ink Black | `#111118` | `--color-ink-black` | Primary text, nav text, dark footer surface, filled button background, badge fills — near-black with a barely-perceptible cool tint reads as warmer than pure #000 in print contexts |
| Paper White | `#ffffff` | `--color-paper-white` | Page canvas, card surfaces, button text on dark fills, inverted button text — the dominant ground |
| Soft Ash | `#dddddd` | `--color-soft-ash` | Muted borders, image placeholder backgrounds, secondary dividers |
| Stone Gray | `#bdbdbd` | `--color-stone-gray` | List dividers, body-level borders, tertiary structural lines |
| Slate | `#7c7c7c` | `--color-slate` | Helper text, de-emphasized body copy, subtle metadata |
| Graphite | `#333333` | `--color-graphite` | Link text and link borders in body context — slight lift from pure ink |
| True Black | `#000000` | `--color-true-black` | Hard border accent in lists and structural dividers where maximum contrast is needed |
| Night Forest | `#283338` | `--color-night-forest` | Navigation-specific borders and text — a cool desaturated charcoal distinct from the warm Ink Black |
| Highlighter Yellow | `#fef199` | `--color-highlighter-yellow` | Yellow wash for highlight backgrounds, decorative bands, and soft emphasis behind content. Do not promote it to the primary CTA color |

## Tokens — Typography

### PP Mori — Body, nav, UI, and secondary display — the workhorse sans. Weight 200 carries small labels with editorial lightness; 400 is body; 600 is reserved for button text and emphasis. The unusually wide 0.107em letter-spacing on small text (12-15px) gives nav and badges an open, tracked-out feel typical of fashion-editorial UI. · `--font-pp-mori`
- **Substitute:** Inter, Manrope, or DM Sans
- **Weights:** 200, 400, 600
- **Sizes:** 12px, 14px, 15px, 16px, 18px, 24px, 72px
- **Line height:** 1.00–1.40
- **Letter spacing:** 0.107em at 12-15px, tighter at larger sizes
- **Role:** Body, nav, UI, and secondary display — the workhorse sans. Weight 200 carries small labels with editorial lightness; 400 is body; 600 is reserved for button text and emphasis. The unusually wide 0.107em letter-spacing on small text (12-15px) gives nav and badges an open, tracked-out feel typical of fashion-editorial UI.

### Editorial New — Hero and section display headlines only — a thin didone serif at extreme sizes (70-160px) with 1.0 line-height. The whisper-thin weight 200 is the signature: most serif sites use 400-600 for display, this site lets the letterforms almost disappear, making the few words monumental. The contrast between the ultra-thin serif and the heavier PP Mori body creates the magazine-cover tension that defines the brand. · `--font-editorial-new`
- **Substitute:** Playfair Display, DM Serif Display, or Libre Caslon Display
- **Weights:** 200
- **Sizes:** 48px, 70px, 72px, 160px
- **Line height:** 1.00–1.20
- **Role:** Hero and section display headlines only — a thin didone serif at extreme sizes (70-160px) with 1.0 line-height. The whisper-thin weight 200 is the signature: most serif sites use 400-600 for display, this site lets the letterforms almost disappear, making the few words monumental. The contrast between the ultra-thin serif and the heavier PP Mori body creates the magazine-cover tension that defines the brand.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.4 | 1.28px | `--text-caption` |
| body-sm | 14px | 1.4 | 1.5px | `--text-body-sm` |
| body | 16px | 1.4 | — | `--text-body` |
| subheading | 18px | 1.4 | — | `--text-subheading` |
| heading-sm | 24px | 1.2 | — | `--text-heading-sm` |
| heading | 48px | 1.1 | — | `--text-heading` |
| heading-lg | 72px | 1.1 | — | `--text-heading-lg` |
| display | 160px | 1 | — | `--text-display` |

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
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |
| 112 | 112px | `--spacing-112` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 80px |
| cards | 8px |
| links | 8px |
| badges | 50px |
| images | 800px |
| buttons | 24px |
| headings | 150px |

### Layout

- **Section gap:** 80-120px
- **Card padding:** 24px
- **Element gap:** 16-24px

## Components

### Filled Pill Button (Light)
**Role:** Primary CTA on light backgrounds

Ink Black (#111118) fill, Paper White (#ffffff) text, PP Mori 14-15px weight 600, letter-spacing 0.107em, uppercase tracking. 24px border-radius, 16px horizontal × 10px vertical padding. 1px Ink Black border for definition.

### Ghost Pill Button
**Role:** Secondary action on light backgrounds

Transparent fill, 1px Ink Black (#111118) border, Ink Black text. 24px border-radius, 16px × 10px padding. Used for the 'Start a project' and 'About me' actions.

### Capsule Link Button
**Role:** Inline text-link with border treatment

8px radius, 1px border in #333333 or #111118, small PP Mori 14-15px weight 400. Behaves like a pill-tag hybrid for 'Work with me' in nav.

### Work Card
**Role:** Portfolio project tile in the grid

8px border-radius, contains a capsule-shaped (800px radius) image, project name overlaid in PP Mori 600. Image bleeds to capsule shape regardless of source aspect ratio. No shadow.

### About Card (Sidebar)
**Role:** 'Your New Partner' intro block

Left-column card with portrait image, uppercase PP Mori 12-14px label 'YOUR NEW PARTNER' with down-arrow icon, intro paragraph in PP Mori 16px, embedded ghost button.

### Footer CTA Panel
**Role:** Dark closing section with primary conversion

Full-width Ink Black (#111118) background, 'Ready to take your brand to the next level?' in PP Mori body weight. Massive pill button: outlined in Highlighter Yellow (#fef199), 150px radius, Editorial New or PP Mori text at 48-72px, arrow icon in a separate circular capsule (50px radius) touching the main pill.

### Circular Text Badge
**Role:** Decorative availability indicator (the 'AVAILABLE NOW' element)

Text wraps around an invisible circle in PP Mori 12px weight 400, 0.107em tracking, Ink Black on white. A small emoji or icon sits at the center. Used as a single floating decorative element — not a repeatable component.

### Service/Client Logo Row
**Role:** Trust strip showing partner brands

Horizontal row of monochrome logos, PP Mori or custom, evenly spaced with 24-40px gaps. No borders, logos sit directly on white. Filters to grayscale for uniformity.

### Navigation Bar
**Role:** Top-level site navigation

Sticky/fixed top bar, white background, 1px bottom border. Logo block (name + 'Visual Designer' sub-label) left, centered nav links (Work, Services, About) in PP Mori 15-16px, capsule CTA right. 80px radius on the nav container edges in some breakpoints.

### Project Detail Image Card
**Role:** Large showcase image within portfolio pages

800px border-radius creating a capsule/lozenge shape. No padding, no border, no shadow — the shape IS the container. Used for phone mockups and hero project visuals.

### Headline Display Block
**Role:** Section-opening serif statement

Editorial New weight 200 at 70-160px, line-height 1.0-1.1, Ink Black on white. Occupies full width of its container. No uppercase, no decoration — the extreme thinness is the visual event.

## Do's and Don'ts

### Do
- Use Editorial New weight 200 exclusively for display headlines at 48px or larger — never below 48px, never above weight 200
- Keep the page 97% achromatic: Ink Black, Paper White, and grayscale neutrals handle 95% of the visual load
- Apply 0.107em letter-spacing to all PP Mori text at 12-15px — this tracked-out feel is the small-type signature
- Use 24px radius for buttons, 8px for cards, 800px for images — the radius scale is dramatic and must be preserved
- Reserve #fef199 yellow for the dark footer panel only — it is the single chromatic event on the page
- Maintain generous section gaps of 80-120px between major blocks; the airy rhythm is editorial, not compact
- Let display headlines run full-width without max-width constraints; the oversized serif is the layout

### Don't

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Paper | `#ffffff` | Base page canvas and card surfaces |
| 2 | Soft Mist | `#dddddd` | Subtle alt sections, image card backgrounds, muted panels |
| 3 | Ink Black | `#111118` | Footer and CTA panel — the only dark surface, creates the page's only dramatic inversion |

## Agent Prompt Guide

primary action: #111118 (filled action)
Create a Primary Action Button: #111118 background, #ffffff text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-ink-black: #111118;
  --color-paper-white: #ffffff;
  --color-soft-ash: #dddddd;
  --color-stone-gray: #bdbdbd;
  --color-slate: #7c7c7c;
  --color-graphite: #333333;
  --color-true-black: #000000;
  --color-night-forest: #283338;
  --color-highlighter-yellow: #fef199;

  /* Typography — Font Families */
  --font-pp-mori: 'PP Mori', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-editorial-new: 'Editorial New', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.4;
  --tracking-caption: 1.28px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.4;
  --tracking-body-sm: 1.5px;
  --text-body: 16px;
  --leading-body: 1.4;
  --text-subheading: 18px;
  --leading-subheading: 1.4;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.2;
  --text-heading: 48px;
  --leading-heading: 1.1;
  --text-heading-lg: 72px;
  --leading-heading-lg: 1.1;
  --text-display: 160px;
  --leading-display: 1;

  /* Typography — Weights */
  --font-weight-extralight: 200;
  --font-weight-regular: 400;
  --font-weight-semibold: 600;

  /* Spacing */
  --spacing-unit: 8px;
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-112: 112px;

  /* Layout */
  --section-gap: 80-120px;
  --card-padding: 24px;
  --element-gap: 16-24px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-3xl: 24px;
  --radius-full: 50px;
  --radius-full-2: 80px;
  --radius-full-3: 150px;
  --radius-full-4: 800px;

  /* Named Radii */
  --radius-nav: 80px;
  --radius-cards: 8px;
  --radius-links: 8px;
  --radius-badges: 50px;
  --radius-images: 800px;
  --radius-buttons: 24px;
  --radius-headings: 150px;

  /* Surfaces */
  --surface-paper: #ffffff;
  --surface-soft-mist: #dddddd;
  --surface-ink-black: #111118;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-ink-black: #111118;
  --color-paper-white: #ffffff;
  --color-soft-ash: #dddddd;
  --color-stone-gray: #bdbdbd;
  --color-slate: #7c7c7c;
  --color-graphite: #333333;
  --color-true-black: #000000;
  --color-night-forest: #283338;
  --color-highlighter-yellow: #fef199;

  /* Typography */
  --font-pp-mori: 'PP Mori', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-editorial-new: 'Editorial New', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.4;
  --tracking-caption: 1.28px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.4;
  --tracking-body-sm: 1.5px;
  --text-body: 16px;
  --leading-body: 1.4;
  --text-subheading: 18px;
  --leading-subheading: 1.4;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.2;
  --text-heading: 48px;
  --leading-heading: 1.1;
  --text-heading-lg: 72px;
  --leading-heading-lg: 1.1;
  --text-display: 160px;
  --leading-display: 1;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-112: 112px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-3xl: 24px;
  --radius-full: 50px;
  --radius-full-2: 80px;
  --radius-full-3: 150px;
  --radius-full-4: 800px;
}
```
