# Craftwork — Style Reference
> Designer's atelier with one acid-green lamp. A bright, paper-clean workspace where one vivid lime accent marks the premium shelf and everything else is a measured, gallery-quiet neutral.

**Theme:** light

Craftwork is a clean, light-canvas marketplace language built on near-monochrome neutrals — white cards on #f9f9f9 paper, deep black text, hairline gray borders — with one acid-green (#cafc00) accent that acts as a visual highlighter for premium and brand moments. A geometric humanist sans (Euclid Circular A) carries the typography, running from whisper-tight 72px display headlines (ls ≈ -0.069em) down to compact 14–16px body text, creating a density that feels editorial rather than spacious. Components sit lightly on the surface: 10px rounded cards, 9999px pill nav buttons, and shadows so subtle they read as paper texture rather than elevation. The remaining two accents — vermillion #f54911 and magenta #c42df9 — appear only as decorative punctuation in icons, tags, and illustration, never competing with the green for attention. The overall rhythm is compact and content-forward, prioritizing catalog density over generous white space.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Acid Green | `#cafc00` | `--color-acid-green` | Brand accent — the singular chromatic highlight. Marks the Pro Access pill in the nav, the primary upgrade button, and occasional pill highlights. The only color allowed to carry brand meaning at full saturation |
| Vermillion | `#f54911` | `--color-vermillion` | Secondary accent — warm red-orange for emphasis text, decorative borders, and small brand moments. Never used for backgrounds at scale |
| Magenta Pop | `#c42df9` | `--color-magenta-pop` | Tertiary accent — vivid pink for icons, decorative strokes, and illustration pops. Functions as a tertiary tag color in the brand palette |
| Ink Black | `#000000` | `--color-ink-black` | Primary text, heading strokes, and the dominant interface color. Carries body copy, icons, and high-contrast borders |
| Obsidian | `#0d0d0d` | `--color-obsidian` | Dark surface fill for active states, dark buttons, and inverted sections |
| Charcoal | `#1e1e1e` | `--color-charcoal` | Secondary dark surface — slightly softer than Obsidian for cards that need depth without going fully black |
| Slate Ink | `#14151a` | `--color-slate-ink` | Near-black for specific UI borders and text where pure black reads too harsh against warm grays |
| Graphite | `#606060` | `--color-graphite` | Secondary text, muted icons, and secondary button text. The workhorse mid-gray for body copy that should recede |
| Ash Gray | `#999999` | `--color-ash-gray` | Tertiary text, placeholder copy, and disabled icon strokes |
| Mist | `#9ea0a8` | `--color-mist` | Cool-leaning gray for subtle borders and muted helper text |
| Paper | `#f9f9f9` | `--color-paper` | Page canvas — the dominant background across the entire site. Slightly warm, never pure white |
| Fog | `#f2f2f2` | `--color-fog` | Secondary surface for inset panels, section dividers, and soft background washes |
| Snow | `#ffffff` | `--color-snow` | Light supporting surface for subtle backgrounds and section separation. Do not promote it to the primary CTA color |
| Hairline | `#dee0e3` | `--color-hairline` | Hairline borders, dividers, and input outlines. The thinnest structural line in the system |

## Tokens — Typography

### Euclid Circular A — The single typeface across the entire system. Euclid Circular A is a geometric humanist sans with wide apertures and circular geometry — it reads modern but warm, which keeps a design-marketplace brand from feeling cold. Used for everything from 11px nav labels to 72px display headlines. The negative letter-spacing pattern (tightest at -0.069em for 72px, loosening to 0 at 11px) creates a deliberate density that defines the site's editorial rhythm. · `--font-euclid-circular-a`
- **Substitute:** DM Sans, Outfit, or Plus Jakarta Sans
- **Weights:** 400, 500, 600, 700
- **Sizes:** 11, 12, 14, 15, 16, 18, 20, 22, 24, 32, 36, 42, 62, 72
- **Line height:** 1.00–1.83 (tight at display, generous at caption)
- **Letter spacing:** -0.069em at 72px, -0.050em at 62px, -0.040em at 42px, -0.030em at 36px, -0.027em at 32px, -0.020em at 24px, -0.018em at 22px, -0.016em at 20px, -0.007em at 16px, 0 at 14px and below
- **OpenType features:** `"clig" 0, "liga" 0`
- **Role:** The single typeface across the entire system. Euclid Circular A is a geometric humanist sans with wide apertures and circular geometry — it reads modern but warm, which keeps a design-marketplace brand from feeling cold. Used for everything from 11px nav labels to 72px display headlines. The negative letter-spacing pattern (tightest at -0.069em for 72px, loosening to 0 at 11px) creates a deliberate density that defines the site's editorial rhythm.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 11px | 1.5 | — | `--text-caption` |
| body-sm | 14px | 1.5 | — | `--text-body-sm` |
| body | 16px | 1.5 | -0.11px | `--text-body` |
| subheading | 20px | 1.3 | -0.32px | `--text-subheading` |
| heading-sm | 24px | 1.22 | -0.48px | `--text-heading-sm` |
| heading | 36px | 1.13 | -1.08px | `--text-heading` |
| heading-lg | 42px | 1.14 | -1.68px | `--text-heading-lg` |
| display | 72px | 1 | -4.97px | `--text-display` |

## Tokens — Spacing & Shapes

**Density:** compact

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 5 | 5px | `--spacing-5` |
| 6 | 6px | `--spacing-6` |
| 7 | 7px | `--spacing-7` |
| 8 | 8px | `--spacing-8` |
| 9 | 9px | `--spacing-9` |
| 10 | 10px | `--spacing-10` |
| 12 | 12px | `--spacing-12` |
| 13 | 13px | `--spacing-13` |
| 14 | 14px | `--spacing-14` |
| 15 | 15px | `--spacing-15` |
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 25 | 25px | `--spacing-25` |
| 30 | 30px | `--spacing-30` |
| 37 | 37px | `--spacing-37` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 10px |
| pills | 9999px |
| avatars | 9999px |
| buttons | 10px |
| nav-tabs | 10px |
| logo-cards | 16px |
| large-panels | 20px |
| testimonials | 10px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| subtle | `rgba(47, 43, 67, 0.1) 0px -1px 0px 0px inset, rgba(47, 43...` | `--shadow-subtle` |
| subtle-2 | `rgba(47, 43, 67, 0.1) 0px 1px 3px 0px, rgba(47, 43, 67, 0...` | `--shadow-subtle-2` |
| subtle-3 | `rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.2) 0...` | `--shadow-subtle-3` |
| subtle-4 | `rgba(20, 21, 26, 0.05) 0px 1px 2px 0px` | `--shadow-subtle-4` |
| xl | `rgba(0, 0, 0, 0.04) 0px 8px 40px 0px, rgba(0, 0, 0, 0.03)...` | `--shadow-xl` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 64px
- **Card padding:** 20px
- **Element gap:** 8px

## Components

### Top Navigation Bar
**Role:** Sticky header for site-wide navigation

White (#ffffff) background, 10px bottom radius, inset top hairline border + 1px/3px shadow combo. Logo (V mark) left-aligned, centered search bar with ⌘K shortcut hint, right-aligned secondary nav (Become an author, Pro Access pill, cart icon, Login, hamburger). Height ~64px, full-bleed.

### Pro Access Pill Button
**Role:** Premium upgrade entry point in the nav

9999px radius pill, #cafc00 background, black text, lightning bolt icon prefix. Padding ~6px 12px. The only nav element with chromatic fill — it earns attention through color isolation.

### Centered Search Bar
**Role:** Primary catalog search with keyboard shortcut

Rounded input (10px radius), #f9f9f9 or white background, #dee0e3 border, 14-16px placeholder text in #999999. Inline ⌘K keycap hint on the right. Width ~400px, centered in the nav.

### Primary Upgrade Button
**Role:** Hero and section-level call to unlock Pro

10px radius, #cafc00 background, black text, lightning bolt icon. Padding ~12px 24px. Weight 500-600. Sits beside ghost secondary buttons in CTA pairs.

### Ghost Secondary Button
**Role:** Low-priority paired CTA (e.g., Explore Catalog)

10px radius, white or #f9f9f9 background, #dee0e3 or #14151a border, black text. Same dimensions as the primary button to create balanced CTA pairs.

### Category Tab Bar
**Role:** Primary resource category filter

Horizontal row of 10px-radius tabs. Active tab: #0d0d0d or #1e1e1 background with white text. Inactive: #dee0e3 background with dark text. Full-width segmented control style.

### Subcategory Filter Pills
**Role:** Secondary filter chips below the category tabs

9999px radius pills, #dee0e3 or #f2f2f2 background, #606060 or black text, ~10px 16px padding. Compact, text-only, no icons.

### Resource Logo Card
**Role:** Catalog tile for UI kits, mockups, fonts, etc.

10px radius, white background, subtle hairline border or shadow. Internal preview area (16-20px radius) displays a colorful illustration or screenshot. Title and category label below. The card is the primary unit of the catalog grid.

### Testimonial Card
**Role:** User quote with avatar attribution

White (#ffffff) surface, 10px radius, #dee0e3 hairline border. Quote text in 14-16px body. 9999px avatar circle (32-40px) with user photo, bold name below, muted role/title. Padding ~16-20px. Arranged in 3-column masonry grid.

### Company Logo Wall
**Role:** Social proof band of trusted brands

Centered horizontal row of monochrome black logos (Google, Uber, PayPal, Microsoft, etc.) in #606060 or #999999. No background, sits directly on Paper canvas. Logos are flat, single-color, uniformly sized.

### Hero Headline Block
**Role:** Full-width centered hero with display typography

Max-width ~800px centered. 62-72px display headline in #000000 with ls ≈ -0.069em. 16-20px subtitle in #606060. CTA pair below. The hero breathes with generous vertical padding (80-120px) despite the overall compact density.

### Cookie Consent Banner
**Role:** Bottom-floating compliance notice

White background, 10px radius, soft floating shadow (rgba 0,0,0,0.04 at 8px/40px). Cookie icon + bold heading + body copy + Cookie Policy link. Dismissible with X button. Fixed to bottom center.

### Promo Top Banner
**Role:** Announcement strip above the nav

Magenta (#c42df9) or vermillion (#f54911) solid background, white text, centered. 32-40px height. Contains offer text and a CTA pill (CWA & PAIN$ style). The only place a full-bleed chromatic band appears.

## Do's and Don'ts

### Do
- Use #cafc00 only as a singular brand accent — one element per viewport section should carry it, never two competing for attention
- Set display headlines at 62-72px with letter-spacing between -0.050em and -0.069em to match the site's tight editorial rhythm
- Use 10px radius for all cards, buttons, and inputs; reserve 9999px exclusively for pills, avatars, and the Pro Access button
- Keep the page canvas at #f9f9f9 and float cards on #ffffff — never use #ffffff as the page background
- Apply the signature shadow pattern (inset hairline + 3px drop at rgba(47,43,67,0.1)) to all elevated surfaces for paper-layering depth
- Set body text at 16px with -0.007em tracking and 1.5 line-height; tighten progressively as size increases
- Pair the acid-green primary button with a ghost secondary button of identical dimensions to create balanced CTA blocks

### Don't
- Don't use #cafc0
Don't use #f54911 or #c42df9 as background fills at scale — they are decorative accents, not surface colors
- Don't apply shadows heavier than rgba(0,0,0,0.04) at 8px/40px — the system relies on paper-quiet elevation, never dramatic floating
- Don't use radii other than 10px (rectangular), 16-20px (large panels), or 9999px (pills) — no 4px, 6px, or 8px in-between values
- Don't set display headlines at 48-56px — the scale jumps from 42px to 62px, so 50px reads as a mistake
- Don't use pure black (#000000) for large backgrounds or cards — reserve it for text and small icon strokes; use #0d0d0d or #1e1e1 for dark surfaces
- Don't add letter-spacing to small text (14px and below) — the negative tracking is only effective from 16px upward
- Don't introduce a second typeface — Euclid Circular A covers every role from caption to display

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Paper Canvas | `#f9f9f9` | Page background — the dominant warm off-white that everything sits on. |
| 1 | Snow Card | `#ffffff` | Card and component surface — pure white that lifts content off the Paper canvas. |
| 2 | Fog Inset | `#f2f2f2` | Inset panels, secondary backgrounds, and section washes that need to recede further. |
| 3 | Hairline Border | `#dee0e3` | Dividers and structural lines that define boundaries without using shadows. |

## Elevation

- **Navigation bar, cards, buttons:** `rgba(47, 43, 67, 0.1) 0px -1px 0px 0px inset, rgba(47, 43, 67, 0.1) 0px 1px 3px 0px`
- **Floating elements (cookie banner, dropdowns):** `rgba(0, 0, 0, 0.04) 0px 8px 40px 0px, rgba(0, 0, 0, 0.03) 0px 2px 12px 0px`
- **Hover lift on interactive cards:** `rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.2) 0px 5px 10px 0px`

## Imagery

Imagery is catalog-forward: colorful product previews (UI kits, mockups, font specimens) displayed inside rounded card frames. The cards themselves are neutral — white or paper — letting the illustrated previews carry the color. Decorative illustrations in the hero and section dividers use the full three-color accent palette (acid green, vermillion, magenta) at low saturation as soft radial gradient washes. No photography of people or environments; the site is entirely iconography, product crops, and brand-colored illustration. Iconography is outlined at ~1.5-2px stroke, monochrome black or accent-colored, with geometric simplicity matching the typeface.

## Layout

Max-width 1200px centered, with a generous hero that breaks the content width for full-bleed display typography. The hero is a centered stack: logo mark → display headline → subtitle → CTA pair. Sections below alternate between content bands and social-proof bands (company logo wall) without alternating light/dark contrast — everything stays on Paper canvas. Category navigation uses a full-width segmented tab bar, followed by a centered row of filter pills. The catalog grid is 4-column on desktop (UI kit, Mockup, Icon, Inspiration tiles), collapsing to 2-3 columns on smaller screens. Testimonials use a 3-column masonry layout. Vertical rhythm is compact (40-64px section gaps) but the hero and CTA sections open up to 80-120px padding to create breathing room around the most important content. Navigation is a single sticky top bar — no sidebar, no mega-menu.

## Agent Prompt Guide

## Quick Color Reference
- text: #000000
- background: #f9f9f9
- card surface: #ffffff
- border: #dee0e3
- brand accent: #cafc00 (Acid Green — observed on Pro Access pill and upgrade button)
- secondary accent: #f54911 (Vermillion — emphasis text, decorative borders)
- tertiary accent: #c42df9 (Magenta — icons, decorative strokes)
- primary action: no distinct CTA color

## Example Component Prompts

1. **Hero Section** — Paper (#f9f9f9) background, full-bleed. Display headline at 72px Euclid Circular A weight 700, #000000, letter-spacing -4.97px. Subtitle at 20px weight 400, #606060. Acid-green accent button (#cafc00 bg, black text, 10px radius, 12px 24px padding, lightning icon) paired with a ghost button (white bg, #dee0e3 border, 10px radius, 12px 24px padding). 80–120px vertical padding.

2. **Resource Catalog Card** — White (#ffffff) surface, 10px radius, hairline #dee0e3 border or subtle inset shadow. Internal preview at 16px radius showing colorful product art. Title at 16px weight 600 black below, category label at 12px weight 400 #999999. 20px internal padding. 4-column grid.

3. **Category Tab Bar** — Full-width segmented control. Active tab: #0d0d0d background, white text, 10px radius. Inactive tab: #dee0e3 background, #000000 text. 4px gap between tabs. Container has no background — sits on Paper canvas.

4. **Testimonial Card** — White (#ffffff) surface, 10px radius, #dee0e3 border. Quote text at 14px weight 400, #000000. 9999px avatar (40px) with photo, name at 14px weight 600 below, role at 12px #606060. 20px padding. 3-column masonry.

5. **Top Navigation** — Sticky, white (#ffffff) background, 10px bottom radius, inset hairline + 3px shadow. Logo left, centered search (~400px, 10px radius, #f9f9f9 bg, ⌘K keycap hint right), right cluster with #cafc00 pill (Pro Access, 9999px radius, black text, lightning icon) + cart icon + Login text link.

## Gradient System

Gradients are used sparingly as soft background washes to add atmospheric depth without introducing new color tokens. The pattern is always a radial fade from a desaturated green-tinted translucent fill to fully transparent — never a multi-color gradient.

- **Hero wash**: radial-gradient(80% 60% at 55% 5%, rgba(180,235,160,0.45), transparent) — soft lime glow from the top-center
- **Section wash A**: radial-gradient(70% 80% at -5% 75%, rgba(180,235,160,0.35), transparent) — corner glow from bottom-left
- **Section wash B**: radial-gradient(circle at 45% 45%, rgba(200,250,190,0.25), transparent 55%) — centered diffused glow

These washes sit on the Paper canvas and should never appear on card surfaces or over text content. They define the mood of hero and transition sections only.

## Similar Brands

- **Gumroad** — Same compact marketplace density with a single vivid accent color (Gumroad's pink) against clean white surfaces and minimal chrome
- **Framer** — Similar light-canvas aesthetic with tight geometric sans-serif typography and one brand accent reserved for premium moments
- **Pitch** — Same near-monochrome neutral palette with a singular acid-bright accent, generous display typography, and paper-quiet shadows
- **Linear** — Identical approach to geometric sans-serif headlines with negative letter-spacing and clean white card surfaces on an off-white canvas
- **Dribbble Shop** — Same creator-marketplace grid pattern with rounded resource cards and a single chromatic accent for premium upgrades

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-acid-green: #cafc00;
  --color-vermillion: #f54911;
  --color-magenta-pop: #c42df9;
  --color-ink-black: #000000;
  --color-obsidian: #0d0d0d;
  --color-charcoal: #1e1e1e;
  --color-slate-ink: #14151a;
  --color-graphite: #606060;
  --color-ash-gray: #999999;
  --color-mist: #9ea0a8;
  --color-paper: #f9f9f9;
  --color-fog: #f2f2f2;
  --color-snow: #ffffff;
  --color-hairline: #dee0e3;

  /* Typography — Font Families */
  --font-euclid-circular-a: 'Euclid Circular A', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.5;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.11px;
  --text-subheading: 20px;
  --leading-subheading: 1.3;
  --tracking-subheading: -0.32px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.22;
  --tracking-heading-sm: -0.48px;
  --text-heading: 36px;
  --leading-heading: 1.13;
  --tracking-heading: -1.08px;
  --text-heading-lg: 42px;
  --leading-heading-lg: 1.14;
  --tracking-heading-lg: -1.68px;
  --text-display: 72px;
  --leading-display: 1;
  --tracking-display: -4.97px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-5: 5px;
  --spacing-6: 6px;
  --spacing-7: 7px;
  --spacing-8: 8px;
  --spacing-9: 9px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-13: 13px;
  --spacing-14: 14px;
  --spacing-15: 15px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-25: 25px;
  --spacing-30: 30px;
  --spacing-37: 37px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 64px;
  --card-padding: 20px;
  --element-gap: 8px;

  /* Border Radius */
  --radius-md: 4.915px;
  --radius-lg: 10px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-3xl: 33px;
  --radius-3xl-2: 36px;
  --radius-full: 1000px;
  --radius-full-2: 9999px;

  /* Named Radii */
  --radius-cards: 10px;
  --radius-pills: 9999px;
  --radius-avatars: 9999px;
  --radius-buttons: 10px;
  --radius-nav-tabs: 10px;
  --radius-logo-cards: 16px;
  --radius-large-panels: 20px;
  --radius-testimonials: 10px;

  /* Shadows */
  --shadow-subtle: rgba(47, 43, 67, 0.1) 0px -1px 0px 0px inset, rgba(47, 43, 67, 0.1) 0px 1px 3px 0px;
  --shadow-subtle-2: rgba(47, 43, 67, 0.1) 0px 1px 3px 0px, rgba(47, 43, 67, 0.1) 0px -1px 0px 0px inset;
  --shadow-subtle-3: rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.2) 0px 5px 10px 0px;
  --shadow-subtle-4: rgba(20, 21, 26, 0.05) 0px 1px 2px 0px;
  --shadow-xl: rgba(0, 0, 0, 0.04) 0px 8px 40px 0px, rgba(0, 0, 0, 0.03) 0px 2px 12px 0px;

  /* Surfaces */
  --surface-paper-canvas: #f9f9f9;
  --surface-snow-card: #ffffff;
  --surface-fog-inset: #f2f2f2;
  --surface-hairline-border: #dee0e3;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-acid-green: #cafc00;
  --color-vermillion: #f54911;
  --color-magenta-pop: #c42df9;
  --color-ink-black: #000000;
  --color-obsidian: #0d0d0d;
  --color-charcoal: #1e1e1e;
  --color-slate-ink: #14151a;
  --color-graphite: #606060;
  --color-ash-gray: #999999;
  --color-mist: #9ea0a8;
  --color-paper: #f9f9f9;
  --color-fog: #f2f2f2;
  --color-snow: #ffffff;
  --color-hairline: #dee0e3;

  /* Typography */
  --font-euclid-circular-a: 'Euclid Circular A', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.5;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.11px;
  --text-subheading: 20px;
  --leading-subheading: 1.3;
  --tracking-subheading: -0.32px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.22;
  --tracking-heading-sm: -0.48px;
  --text-heading: 36px;
  --leading-heading: 1.13;
  --tracking-heading: -1.08px;
  --text-heading-lg: 42px;
  --leading-heading-lg: 1.14;
  --tracking-heading-lg: -1.68px;
  --text-display: 72px;
  --leading-display: 1;
  --tracking-display: -4.97px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-5: 5px;
  --spacing-6: 6px;
  --spacing-7: 7px;
  --spacing-8: 8px;
  --spacing-9: 9px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-13: 13px;
  --spacing-14: 14px;
  --spacing-15: 15px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-25: 25px;
  --spacing-30: 30px;
  --spacing-37: 37px;

  /* Border Radius */
  --radius-md: 4.915px;
  --radius-lg: 10px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-3xl: 33px;
  --radius-3xl-2: 36px;
  --radius-full: 1000px;
  --radius-full-2: 9999px;

  /* Shadows */
  --shadow-subtle: rgba(47, 43, 67, 0.1) 0px -1px 0px 0px inset, rgba(47, 43, 67, 0.1) 0px 1px 3px 0px;
  --shadow-subtle-2: rgba(47, 43, 67, 0.1) 0px 1px 3px 0px, rgba(47, 43, 67, 0.1) 0px -1px 0px 0px inset;
  --shadow-subtle-3: rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.2) 0px 5px 10px 0px;
  --shadow-subtle-4: rgba(20, 21, 26, 0.05) 0px 1px 2px 0px;
  --shadow-xl: rgba(0, 0, 0, 0.04) 0px 8px 40px 0px, rgba(0, 0, 0, 0.03) 0px 2px 12px 0px;
}
```
