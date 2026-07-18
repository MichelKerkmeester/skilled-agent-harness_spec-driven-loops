# Neuralink — Style Reference
> obsidian laboratory with a single color synapse — a black void where only light, shadow, and one thin spectrum of color speak

**Theme:** mixed

Neuralink operates as a near-pure monochrome system: a near-black canvas, a white surface, and one off-white band, with no chromatic brand color at all. A single spectrum gradient — pink to violet — appears only as the announcement bar and as photo-card overlays, acting as the system's sole injection of warmth and life. Typography carries almost all of the brand voice: a geometric sans at weight 300 for display sizes with aggressively tight tracking (-0.165em at 48px) that gives headlines a compressed, engineered density. Pill-shaped controls (80px radius) sit against full-bleed black and white blocks, creating a cinematic, almost editorial rhythm where the only color signal is a faint synaptic glow.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Obsidian | `#000000` | `--color-obsidian` | Page hero canvas, primary text, section dividers, dark-mode blocks. The dominant structural color — used 931 times as backgrounds, borders, and text. Creates a void-like base that makes white type and the single gradient feel electric by contrast |
| Paper | `#ffffff` | `--color-paper` | Content section background, card surfaces, ghost-button text and border. The light counterpart to Obsidian — every content section sits on Paper, and outlined/ghost buttons invert to Paper stroke on Obsidian backgrounds |
| Ash | `#f5f5f5` | `--color-ash` | Soft off-white surface for the footer and secondary bands. Separates Paper from true white when a gentler contrast is needed — used for the meet-our-pioneers section background and the footer |
| Fog | `#bababa` | `--color-fog` | Muted nav text and low-emphasis dividers. A desaturated mid-gray for inactive navigation labels and subtle hairline borders where black would feel too heavy |
| Synapse Gradient | `linear-gradient(90deg, #e486ab, #7f80b3 20%, #435a93 50%, #6452d8 95%)` | `--color-synapse-gradient` | The only chromatic element in the entire system. A four-stop spectrum (warm rose → cool lavender → indigo → violet) used exclusively for the announcement bar and photo-card overlays. The dominant anchor color is the violet end (#6452d8), giving the gradient a cool, neurological character |

## Tokens — Typography

### UntitledSans — The sole typeface — a custom geometric sans used at all sizes and weights. Weight 300 at display sizes is anti-convention: most bold-tech brands use 600-700 for headlines, but Neuralink's whisper-light displays with aggressive negative tracking create authority through restraint and engineered density, not volume. Weight 400 for body, 500 for nav, 700 reserved for emphasis. · `--font-untitledsans`
- **Substitute:** Inter, Söhne, or General Sans
- **Weights:** 300, 400, 500, 700
- **Sizes:** 8px, 12px, 14px, 16px, 17px, 18px, 24px, 32px, 44px, 48px
- **Line height:** 1.00, 1.15, 1.20, 1.50
- **Letter spacing:** -0.165em at 48px display, -0.060em at 32px, -0.050em at 24px, -0.037em at 18px, -0.030em at 17px, -0.020em at 16px, -0.015em at 14px
- **Role:** The sole typeface — a custom geometric sans used at all sizes and weights. Weight 300 at display sizes is anti-convention: most bold-tech brands use 600-700 for headlines, but Neuralink's whisper-light displays with aggressive negative tracking create authority through restraint and engineered density, not volume. Weight 400 for body, 500 for nav, 700 reserved for emphasis.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.5 | -0.18px | `--text-caption` |
| body-sm | 14px | 1.5 | -0.21px | `--text-body-sm` |
| body | 16px | 1.5 | -0.32px | `--text-body` |
| body-lg | 18px | 1.5 | -0.67px | `--text-body-lg` |
| subheading | 24px | 1.2 | -1.2px | `--text-subheading` |
| heading-sm | 32px | 1.15 | -1.92px | `--text-heading-sm` |
| heading | 44px | 1.15 | -2.64px | `--text-heading` |
| display | 48px | 1 | -7.92px | `--text-display` |

## Tokens — Spacing & Shapes

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 5 | 5px | `--spacing-5` |
| 6 | 6px | `--spacing-6` |
| 8 | 8px | `--spacing-8` |
| 12 | 12px | `--spacing-12` |
| 16 | 16px | `--spacing-16` |
| 18 | 18px | `--spacing-18` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 30 | 30px | `--spacing-30` |
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 46 | 46px | `--spacing-46` |
| 50 | 50px | `--spacing-50` |
| 60 | 60px | `--spacing-60` |
| 240 | 240px | `--spacing-240` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 20px |
| buttons | 80px |
| nav-buttons | 16px |
| body-elements | 60px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 32px
- **Element gap:** 12px

## Components

### Synapse Announcement Bar
**Role:** Full-width gradient strip at the very top of every page

Full-bleed gradient bar (Synapse Gradient: rose → lavender → indigo → violet, 90deg). White text at 12px, weight 400, centered. Close button (×) on the far right. Height ~32px, no padding beyond vertical centering. This is the ONLY place the gradient appears as a solid bar.

### Minimal Navigation Header
**Role:** Primary site navigation on all pages

Sits on a #000000 (Obsidian) or #ffffff (Paper) background depending on the section. Logo (stylized N-wave mark) left-aligned. Nav links (Technology, Careers, Updates) right-aligned at 16px, weight 400, in Paper or Obsidian text. A pill-shaped 'Clinical Trials' button with 16px radius sits at the far right — 1px border matching the text color, transparent fill, 6px vertical / 12px horizontal padding.

### Full-Bleed Hero Block
**Role:** Primary page-opening visual zone

Full-viewport-width Obsidian (#000000) background extending edge-to-edge with no max-width constraint. Display text at 48px, weight 300, in #ffffff, positioned in the lower-left quadrant with generous left and bottom padding (~80-120px). A single ghost pill button sits below the headline. No imagery, no decoration — pure black void with white type.

### Ghost Pill Button
**Role:** Outlined/ghost action button used on dark backgrounds

Transparent background, 1px solid #ffffff border, border-radius 80px (full pill). Text at 16px, weight 400, #ffffff, with a 2px right arrow icon. Padding 12px vertical, 24px horizontal. No fill on hover — the button reads as a subtle outline, not a heavy action element.

### Filled Pill Button
**Role:** Primary action button used on light backgrounds

Solid #ffffff background on Obsidian sections, or solid #000000 on Paper sections. Border-radius 80px. Text at 16px, weight 500, contrasting color, with right arrow. Padding 12px vertical, 24px horizontal. Used sparingly — only one button appears in the hero.

### Two-Column Content Section
**Role:** Text-heavy explanatory content blocks on white background

#ffffff background, max-width ~1200px centered. Left column holds a large heading (44-48px, weight 300) with tight tracking. Right column holds two paragraphs of body text (16-18px, weight 400, #000000) stacked vertically with ~30px row gap. Generous vertical padding (80px top/bottom). No images, no cards — pure typographic layout.

### Pioneer Card
**Role:** Large photo-overlay card for featured audience segments

Aspect ratio roughly 3:4, border-radius 20px. Full-bleed photograph inside, overlaid with a gradient wash (teal/green on left card, pink/magenta on right card — used to differentiate card identity without adding UI color). White overlay text (heading at 24px weight 500, subtext at 16px weight 400) positioned in the lower-left. A ghost pill button (1px white border, 80px radius) sits below the text. Used in pairs side-by-side.

### Centered Section Heading
**Role:** Section-introducing title text

Centered alignment, 32-44px, weight 300, #000000. Sits on either Paper or Ash background with ~80px vertical padding above and below. No supporting subtitle — the heading stands alone, creating breathing room before the content below.

### Footer
**Role:** Page-bottom information area

Ash (#f5f5f5) background, full-width. Minimal content — likely links and copyright in small text (12-14px, weight 400, #000000). Generous padding (60-80px vertical). No color, no imagery — maintains the system's monochrome discipline to the bottom of the page.

## Do's and Don'ts

### Do
- Use #000000 as the full-bleed hero background with #ffffff display text at 48px weight 300, letter-spacing -7.92px
- Apply the Synapse Gradient only in the announcement bar and as photo-card overlay washes — never as a solid UI surface, button fill, or text color
- Set border-radius to 80px on all action buttons for full pill geometry; use 20px on cards and 60px on large container elements
- Maintain aggressive negative letter-spacing: -0.165em at 48px down to -0.015em at 14px, never let large type run at default tracking
- Separate content sections with Ash (#f5f5f5) bands between Paper (#ffffff) blocks to create rhythm without adding color
- Use weight 300 for all display and heading sizes (32px+); reserve weight 700 only for inline emphasis within body text
- Keep page max-width at 1200px for content sections; let hero and announcement bar go full-bleed edge-to-edge

### Don't
- Do not introduce any chromatic brand color — the system is monochrome by design, and the gradient is the only exception
- Do not use drop shadows, box-elevation, or blur effects on any component — depth comes from surface contrast only
- Do not use square or slightly-rounded corners (4px, 8px) on buttons — the 80px pill radius is a signature element
- Do not use weight 600 or 700 for headlines — the weight 300 display is a deliberate anti-convention choice
- Do not add letter-spacing to small text or use positive tracking anywhere — the entire scale runs negative or zero
- Do not use the gradient as a background for text blocks or data tables — it is reserved for the announcement bar and photo overlays
- Do not place multiple ghost buttons adjacent to each other on the same surface — one outlined action per zone, with filled buttons as the alternative

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Obsidian Canvas | `#000000` | Full-bleed hero sections, dark mode blocks, dramatic contrast zones |
| 2 | Paper Surface | `#ffffff` | Primary content background, text-heavy sections, card surfaces |
| 3 | Ash Band | `#f5f5f5` | Soft separator sections (meet-our-pioneers), footer, breathing room between Paper blocks |

## Elevation

Neuralink deliberately avoids shadows and box-elevation. The depth system is built entirely from surface color contrast: Obsidian blocks sit adjacent to Paper blocks, and Ash bands separate Paper sections. The only depth signal is the border on the gradient photo cards and the hairline button borders — no drop shadows, no blurred glows. This flat, shadowless approach reinforces the engineered, clinical aesthetic.

## Imagery

Photography appears only inside Pioneer Cards, treated as full-bleed backgrounds with gradient color washes (teal-green on one card, pink-magenta on the other) that temper the photo into the brand palette. The photos are portrait-oriented, showing people in soft natural-light environments — never clinical, never staged in a lab. No product photography, no 3D renders, no illustrations appear elsewhere. The hero and all content sections are purely typographic — no images, no icons beyond a small arrow glyph inside buttons. The visual system communicates through surface contrast and one gradient, not through visual content density.

## Layout

The page follows a full-bleed → contained → full-bleed rhythm. The hero is edge-to-edge Obsidian with no max-width constraint and text anchored in the lower-left. Content sections are centered within ~1200px max-width on Paper or Ash backgrounds. The layout alternates: Obsidian hero → Paper two-column content → Ash centered-heading + two-card grid → Ash footer. Navigation is a single thin bar that persists across all sections, adapting its text/border color to the underlying surface. Vertical spacing is generous (80px section gaps) with comfortable 12-30px element gaps. No sidebar, no mega-menu, no sticky elements beyond the nav bar itself.

## Agent Prompt Guide

**Quick Color Reference**
- text: #000000
- background (content): #ffffff
- background (hero/footer-dark): #000000
- background (soft band): #f5f5f5
- border (nav/inactive): #bababa
- accent (gradient only): #6452d8 (violet anchor) with rose→lavender→indigo→violet spectrum
- primary action: no distinct CTA color

**3-5 Example Component Prompts**

1. *Create a full-bleed hero section*: #000000 background, edge-to-edge with no max-width. Display text at 48px, UntitledSans weight 300, #ffffff, letter-spacing -7.92px, line-height 1.0, positioned lower-left with ~80px left padding and ~120px bottom padding. A ghost pill button below: transparent fill, 1px #ffffff border, 80px border-radius, 12px 24px padding, 16px weight 400 #ffffff text with right arrow.

2. *Create a two-column content section*: #ffffff background, max-width 1200px centered, 80px vertical padding. Left column: heading at 44px, UntitledSans weight 300, #000000, letter-spacing -2.64px. Right column: two paragraphs of body text at 16px, weight 400, #000000, stacked with 30px row gap.

3. *Create a Pioneer Card*: 3:4 aspect ratio, border-radius 20px, full-bleed photo background. Overlay a teal-to-green gradient wash at ~40% opacity on the lower half. White heading at 24px weight 500 in the lower-left with 32px padding. Below it, a ghost pill button: transparent fill, 1px #ffffff border, 80px radius, 16px weight 400 #ffffff text with arrow.

4. *Create the announcement bar*: full-bleed strip, height ~32px, background is the Synapse Gradient (linear-gradient 90deg, #e486ab, #7f80b3 20%, #435a93 50%, #6452d8 95%). White text at 12px, weight 400, centered. A white × close button on the far right.

5. *Create a minimal navigation bar*: transparent or #000000 background, logo on far left, nav links (Technology, Careers, Updates) at 16px weight 400 right-aligned with 20px gap between links, and a pill button 'Clinical Trials' at 16px border-radius, 1px #ffffff border, 6px 12px padding, 16px weight 400 #ffffff text at the far right.

## Similar Brands

- **Apple** — Same full-bleed black hero with massive light-weight display type and near-zero color palette — both rely on surface contrast and generous whitespace rather than chromatic branding
- **Stripe** — Both use tight-tracked geometric sans-serifs at display sizes with pill-shaped buttons and gradient accent strips, though Stripe introduces more color in its gradients
- **Linear** — Shared commitment to monochrome interface (0% colorfulness) with information density carried by typography and spacing rather than color coding
- **Nothing (Nothing.tech)** — Similar monochrome-first product aesthetic with dot-matrix typography and a single accent — both use restraint as the design statement
- **Humane (AI Pin)** — Both position as futuristic tech brands using near-pure black/white palettes with cinematic full-bleed heroes and pill-shaped ghost buttons

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-obsidian: #000000;
  --color-paper: #ffffff;
  --color-ash: #f5f5f5;
  --color-fog: #bababa;
  --color-synapse-gradient: #6452d8;
  --gradient-synapse-gradient: linear-gradient(90deg, #e486ab, #7f80b3 20%, #435a93 50%, #6452d8 95%);

  /* Typography — Font Families */
  --font-untitledsans: 'UntitledSans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --tracking-caption: -0.18px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --tracking-body-sm: -0.21px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.32px;
  --text-body-lg: 18px;
  --leading-body-lg: 1.5;
  --tracking-body-lg: -0.67px;
  --text-subheading: 24px;
  --leading-subheading: 1.2;
  --tracking-subheading: -1.2px;
  --text-heading-sm: 32px;
  --leading-heading-sm: 1.15;
  --tracking-heading-sm: -1.92px;
  --text-heading: 44px;
  --leading-heading: 1.15;
  --tracking-heading: -2.64px;
  --text-display: 48px;
  --leading-display: 1;
  --tracking-display: -7.92px;

  /* Typography — Weights */
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-5: 5px;
  --spacing-6: 6px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-18: 18px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-30: 30px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-46: 46px;
  --spacing-50: 50px;
  --spacing-60: 60px;
  --spacing-240: 240px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 32px;
  --element-gap: 12px;

  /* Border Radius */
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-full: 60px;
  --radius-full-2: 80px;

  /* Named Radii */
  --radius-cards: 20px;
  --radius-buttons: 80px;
  --radius-nav-buttons: 16px;
  --radius-body-elements: 60px;

  /* Surfaces */
  --surface-obsidian-canvas: #000000;
  --surface-paper-surface: #ffffff;
  --surface-ash-band: #f5f5f5;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-obsidian: #000000;
  --color-paper: #ffffff;
  --color-ash: #f5f5f5;
  --color-fog: #bababa;
  --color-synapse-gradient: #6452d8;

  /* Typography */
  --font-untitledsans: 'UntitledSans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --tracking-caption: -0.18px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --tracking-body-sm: -0.21px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.32px;
  --text-body-lg: 18px;
  --leading-body-lg: 1.5;
  --tracking-body-lg: -0.67px;
  --text-subheading: 24px;
  --leading-subheading: 1.2;
  --tracking-subheading: -1.2px;
  --text-heading-sm: 32px;
  --leading-heading-sm: 1.15;
  --tracking-heading-sm: -1.92px;
  --text-heading: 44px;
  --leading-heading: 1.15;
  --tracking-heading: -2.64px;
  --text-display: 48px;
  --leading-display: 1;
  --tracking-display: -7.92px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-5: 5px;
  --spacing-6: 6px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-18: 18px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-30: 30px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-46: 46px;
  --spacing-50: 50px;
  --spacing-60: 60px;
  --spacing-240: 240px;

  /* Border Radius */
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-full: 60px;
  --radius-full-2: 80px;
}
```
