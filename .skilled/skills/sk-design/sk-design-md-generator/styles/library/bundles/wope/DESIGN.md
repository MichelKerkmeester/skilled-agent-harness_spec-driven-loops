# Wope — Style Reference
> Wope - violet horizon interface. Think of a dark observatory table with a purple light bloom rising from below the glass.

**Theme:** dark

Wope - violet horizon interface. The page feels like a control deck lit from beneath by ultraviolet light: a nearly black-violet canvas, pale gray body copy, and concentrated purple glow under the product UI. The signature move is contrast by illumination rather than by layering — surfaces stay close to #0a0118 and depth comes from translucent white borders, blur, and radiant gradients instead of heavy shadow. Rebond Grotesque appears only where the brand wants scale and impact, while Inter V handles everything else with tight negative tracking in larger sizes and occasional wide-tracked utility text. Buttons, badges, and small controls are all full pills at 999px radius, set against mostly 16px cards, so soft controls float inside a more architectural content frame.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Night Violet | `#0a0118` | `--color-night-violet` | Page background, dark card surfaces, footer and section canvas |
| Void Plum | `#0c0616` | `--color-void-plum` | Inverse text on light treatments, occasional dark text on pale surfaces |
| Soft Quartz | `#ffffff` | `--color-soft-quartz` | Primary headings, buttons, borders, icons, input text, dominant foreground |
| Muted Steel | `#d2d0dd` | `--color-muted-steel` | Secondary heading tone, brighter muted copy over Night Violet |
| Ash Lilac | `#9b96b0` | `--color-ash-lilac` | Body copy, navigation links, supporting labels, low-emphasis UI text |
| Dim Fog | `#85808c` | `--color-dim-fog` | Inactive icons, subtle separators, tertiary interface details |
| Ultraviolet Core | `#713dff` | `--color-ultraviolet-core` | Primary accent, active links, luminous highlights — saturated violet against the black-violet canvas creates the site’s underlit glow |
| Lilac Beam | `#b7a4fb` | `--color-lilac-beam` | Gradient flare, line effects, ambient glow edges — used as the cooler top note inside purple light blooms |
| Horizon Glow | `#8562ff` | `--color-horizon-glow` | Gradient midpoint and visual hotspot — the brighter violet that makes hero illumination feel energized instead of flat |
| Glass White 04 | `#ffffff` | `--color-glass-white-04` | Tinted fills for ghost pills, badge backgrounds, translucent overlays |
| Glass White 10 | `#ffffff` | `--color-glass-white-10` | Hairline borders on pills and glass panels |
| Ultraviolet Horizon | `linear-gradient(180deg, rgba(183, 164, 251, 0) 0%, rgba(183, 164, 251, 0.5) 50%, rgba(133, 98, 255, 0.5) 75%, rgba(133, 98, 255, 0) 100%)` | `--color-ultraviolet-horizon` | Hero light field, illuminated dividers, ambient section glow |
| Violet Beam | `linear-gradient(180deg, rgba(183, 164, 251, 0) 0%, rgb(183, 164, 251) 50%, rgb(133, 98, 255) 75%, rgba(133, 98, 255, 0) 100%)` | `--color-violet-beam` | Brighter line and halo treatments where the glow should read crisp instead of misty |
| Deep Fade Veil | `linear-gradient(180deg, rgba(11, 2, 23, 0) 22.69%, rgba(22, 9, 42, 0.5) 100%)` | `--color-deep-fade-veil` | Section overlays and bottom fades that darken content without breaking the purple atmosphere |

## Tokens — Typography

### Inter V — System font for navigation, body copy, links, buttons, badges, inputs, and smaller headings. The custom build is doing more than a stock Inter install: disabled standard ligature behavior plus alternate stylistic sets make the text feel slightly engineered rather than default SaaS. Use 400 for body, 500 for controls and links, 700 for compact emphasis; apply tighter tracking at larger UI sizes and the wide tracking only for utility-style labels. · `--font-inter-v`
- **Substitute:** Inter
- **Weights:** 400, 500, 700
- **Sizes:** 14px, 16px, 18px, 20px, 24px, 28px
- **Line height:** 1.15, 1.33, 1.40, 1.43, 1.50, 1.56, 1.71
- **Letter spacing:** -0.28px at 14px, -0.16px at 16px, -0.36px at 18px, -0.40px at 20px, -0.48px at 24px, 2.24px at 28px
- **OpenType features:** `"calt" 0, "cv06", "liga" 0; "cv01", "dlig", "salt", "ss01", "ss03", "ss14"; "cv01", "cv02", "cv03", "cv04", "cv09", "cv10", "ss14"; "calt" 0, "cv06", "dlig", "liga" 0; "cv01", "salt", "ss01", "ss03", "ss14"`
- **Role:** System font for navigation, body copy, links, buttons, badges, inputs, and smaller headings. The custom build is doing more than a stock Inter install: disabled standard ligature behavior plus alternate stylistic sets make the text feel slightly engineered rather than default SaaS. Use 400 for body, 500 for controls and links, 700 for compact emphasis; apply tighter tracking at larger UI sizes and the wide tracking only for utility-style labels.

### Rebond Grotesque — Display and headline font for hero statements and major section titles. The heavier serifless grotesque gives Wope its large-scale voice: broad, compact, and slightly formal, which keeps the glowing purple environment from feeling playful. Use only for headline moments, not for buttons or dense UI. · `--font-rebond-grotesque`
- **Substitute:** Sora
- **Weights:** 700
- **Sizes:** 20px, 24px, 56px, 72px
- **Line height:** 1.11, 1.14, 1.33, 1.60
- **Letter spacing:** -0.40px at 20px, -0.48px at 24px, -1.12px at 56px, -1.44px at 72px
- **OpenType features:** `"cv01", "salt", "ss01", "ss03", "ss14"`
- **Role:** Display and headline font for hero statements and major section titles. The heavier serifless grotesque gives Wope its large-scale voice: broad, compact, and slightly formal, which keeps the glowing purple environment from feeling playful. Use only for headline moments, not for buttons or dense UI.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 14px | 16 | -0.28px | `--text-caption` |
| body | 16px | 21 | -0.16px | `--text-body` |
| subheading | 18px | 28 | -0.36px | `--text-subheading` |
| heading-sm | 24px | 36 | -0.48px | `--text-heading-sm` |
| heading | 28px | 48 | 2.24px | `--text-heading` |
| heading-lg | 56px | 74 | -1.12px | `--text-heading-lg` |
| display | 72px | 80 | -1.44px | `--text-display` |

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
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |
| 96 | 96px | `--spacing-96` |
| 108 | 108px | `--spacing-108` |
| 112 | 112px | `--spacing-112` |
| 120 | 120px | `--spacing-120` |
| 124 | 124px | `--spacing-124` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 16px |
| badges | 999px |
| inputs | 0px |
| buttons | 999px |
| overlayCards | 10px |

### Layout

- **Page max-width:** 1248px
- **Section gap:** 108px
- **Card padding:** 28px
- **Element gap:** 16px

## Components

### Primary Glass CTA Pill
**Role:** Main action button in hero and high-attention areas

Use a 999px pill with background rgba(255,255,255,0.04), 1px solid rgba(255,255,255,0.1), white label text, and padding 7px 24px. Keep the fill translucent so the button reads like lit glass floating above #0a0118 rather than a solid chip.

### Header Outline Pill Button
**Role:** Secondary header actions such as Log in

Transparent background, 1px solid rgba(255,255,255,0.1), 999px radius, padding 4px 16px, label in white or Ash Lilac depending on emphasis. This variant should feel lighter and smaller than the primary CTA.

### Text Navigation Pill
**Role:** Minimal nav actions and tertiary controls

Transparent background, no visible border, 999px radius, padding 4px 24px, white text. Use when the interface wants pill spacing without a framed container.

### Hero Trial Badge
**Role:** Compact promotional label above or below hero copy

Pill badge with background rgba(255,255,255,0.04), white text, 999px radius, and padding 4px 14px. Border may be omitted or kept at 1px rgba(255,255,255,0.1) when placed over a strong glow.

### Feature Surface Card
**Role:** Primary content card for feature summaries and product panels

Use Night Violet #0a0118 background, 16px radius, no shadow, and internal padding of 28px when content sits inside. Separate from the page with 1px translucent white borders or slight glow edges rather than elevation.

### Frosted Info Card
**Role:** Secondary glass panel for smaller callouts

Use background rgba(255,255,255,0.02), 16px radius, no shadow, 28px padding, and optional backdrop blur(4px). This reads as a lighter film over the dark canvas.

### Overlay Mini Card
**Role:** Floating stat, tooltip, or decorative UI inset

Use background rgba(10,1,24,0.2), 10px radius, no shadow. Combine with blur(8px) and a thin rgba(255,255,255,0.1) border when it sits on top of product visuals.

### Product Screenshot Frame
**Role:** Large hero UI showcase container

Large 16px rounded frame in #0a0118 with subtle internal glow, no shadow, and an underlighting treatment using the Ultraviolet Horizon gradient. The screenshot should appear embedded into the purple light field, not hovering above it.

### Header Bar
**Role:** Top navigation container

Full-width bar over the dark canvas, content centered within 1248px, low-contrast links in Ash Lilac, and action pills aligned right. Use 16px horizontal grouping gaps and a restrained 78px height zone.

### Borderless Input Field
**Role:** Email or search input inside dark callout forms

Transparent background, no visible border, 0px radius, white text, padding 14px 130px 14px 20px. Pair with a surrounding card or underline rather than boxing the field itself.

### Logo Rail
**Role:** Social-proof brand strip

Contained horizontal row of monochrome partner logos in white or Dim Fog on the dark canvas. Keep the rail low contrast and evenly spaced so it sits as a quiet separator between hero and feature content.

### Section Block
**Role:** Standard vertical content band

Transparent section wrapper with 124px top and bottom padding when used as a major page band. Inside, center content and keep internal stacks at 16px or 24px gaps.

## Do's and Don'ts

### Do
- Use Night Violet #0a0118 as the dominant canvas and keep most sections within that same dark-violet family.
- Use Rebond Grotesque 56px or 72px with -1.12px to -1.44px tracking for hero and section headlines.
- Set body and navigation text in Inter V using Ash Lilac #9b96b0 for default copy and Soft Quartz #ffffff for emphasis.
- Use 999px radius for buttons and badges; reserve 16px radius for cards and 10px for floating overlays.
- Build glow with Ultraviolet Core #713dff, Lilac Beam #b7a4fb, and Horizon Glow #8562ff gradients instead of heavy drop shadows.
- Use 1px borders in rgba(255,255,255,0.1) on pills, glass cards, and framed surfaces.
- Keep vertical section rhythm large: 108px section gaps and 124px padding on major content bands.

### Don't
- Do not introduce bright non-violet accents like teal, green, or orange into primary UI actions.
- Do not use square or lightly rounded buttons; controls are pills at 999px radius.
- Do not place strong opaque white cards on the page; surfaces stay dark or translucent over #0a0118.
- Do not add conventional black box-shadows; depth comes from blur, borders, and glow gradients.
- Do not use Rebond Grotesque for body copy, labels, or buttons.
- Do not collapse muted text and primary text into one tone; keep #9b96b0 for support text and #ffffff for primary content.
- Do not use bordered rectangular inputs; the input itself is borderless and relies on its container treatment.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Night Canvas | `#0a0118` | Global page background and default section base |
| 1 | Glass Film | `#ffffff` | Translucent fills at 2% to 4% opacity for badges, CTAs, and frosted cards |
| 2 | Dark Panel | `#0a0118` | Primary cards and screenshot frames with 16px radius |
| 3 | Overlay Veil | `#16092a` | Gradient fades and blurred overlays above the base canvas |
| 4 | Ultraviolet Glow | `#713dff` | Illuminated accent field beneath hero imagery and active focal points |

## Elevation

Wope avoids conventional elevation. Cards and UI frames sit nearly flush with the #0a0118 canvas, then separate through 1px translucent borders, backdrop blur(4px), blur(8px), and purple underlighting gradients. Even large product panels feel embedded in the page, as if backlit from below rather than raised above it.

## Imagery

The page is product-visual first: large contained screenshots of the SEO interface, framed with rounded corners and immersed in purple glow. Graphics are abstract and atmospheric rather than illustrative — grid lines, light rays, and radiant horizon effects create the scene around the UI. Logos are monochrome and quiet. The layout is text-dominant at the top, then gives substantial visual area to the product frame, so imagery works as proof of the software rather than decoration.

## Agent Prompt Guide

Quick Color Reference: background #0a0118; primary text #ffffff; body text #9b96b0; border rgba(255,255,255,0.1); CTA accent #713dff; glow highlight #8562ff. Example component prompts: 1) Create a hero section with background #0a0118, centered Rebond Grotesque headline at 72px weight 700 line-height 1.11 letter-spacing -1.44px in #ffffff, supporting Inter text at 18px weight 400 line-height 1.56 in #9b96b0, and a glass CTA pill with rgba(255,255,255,0.04) fill, 1px rgba(255,255,255,0.1) border, 999px radius, 7px 24px padding, white text. 2) Create a dark product screenshot frame: 16px radius card in #0a0118, no shadow, thin rgba(255,255,255,0.1) border, purple underglow using linear-gradient(180deg, rgba(183,164,251,0) 0%, rgba(183,164,251,0.5) 50%, rgba(133,98,255,0.5) 75%, rgba(133,98,255,0) 100%). 3) Create a header bar inside 1248px max width with Inter 14px/16px links in #9b96b0, 16px item gaps, a transparent outline login pill with 4px 16px padding and 999px radius, plus a stronger glass signup pill. 4) Create a feature card using #0a0118 background, 16px radius, 28px padding, headline in Rebond Grotesque 24px #ffffff, body in Inter 16px #9b96b0, and no drop shadow. 5) Create a promo badge with rgba(255,255,255,0.04) fill, 999px radius, padding 4px 14px, white 14px Inter text, placed above a dark section title.

## Similar Brands

- **Linear** — Shared dark product-first presentation with restrained neutrals and concentrated violet illumination
- **Raycast** — Similar black-purple glow field and glassy, pill-based control styling
- **Arc** — Uses atmospheric gradients and soft-luminous dark surfaces instead of traditional shadows
- **Warp** — Comparable dark developer-style canvas with bright accent lighting and centered hero statements

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-night-violet: #0a0118;
  --color-void-plum: #0c0616;
  --color-soft-quartz: #ffffff;
  --color-muted-steel: #d2d0dd;
  --color-ash-lilac: #9b96b0;
  --color-dim-fog: #85808c;
  --color-ultraviolet-core: #713dff;
  --color-lilac-beam: #b7a4fb;
  --color-horizon-glow: #8562ff;
  --color-glass-white-04: #ffffff;
  --color-glass-white-10: #ffffff;
  --color-ultraviolet-horizon: #8562ff;
  --gradient-ultraviolet-horizon: linear-gradient(180deg, rgba(183, 164, 251, 0) 0%, rgba(183, 164, 251, 0.5) 50%, rgba(133, 98, 255, 0.5) 75%, rgba(133, 98, 255, 0) 100%);
  --color-violet-beam: #8562ff;
  --gradient-violet-beam: linear-gradient(180deg, rgba(183, 164, 251, 0) 0%, rgb(183, 164, 251) 50%, rgb(133, 98, 255) 75%, rgba(133, 98, 255, 0) 100%);
  --color-deep-fade-veil: #16092a;
  --gradient-deep-fade-veil: linear-gradient(180deg, rgba(11, 2, 23, 0) 22.69%, rgba(22, 9, 42, 0.5) 100%);

  /* Typography — Font Families */
  --font-inter-v: 'Inter V', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-rebond-grotesque: 'Rebond Grotesque', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 16;
  --tracking-caption: -0.28px;
  --text-body: 16px;
  --leading-body: 21;
  --tracking-body: -0.16px;
  --text-subheading: 18px;
  --leading-subheading: 28;
  --tracking-subheading: -0.36px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 36;
  --tracking-heading-sm: -0.48px;
  --text-heading: 28px;
  --leading-heading: 48;
  --tracking-heading: 2.24px;
  --text-heading-lg: 56px;
  --leading-heading-lg: 74;
  --tracking-heading-lg: -1.12px;
  --text-display: 72px;
  --leading-display: 80;
  --tracking-display: -1.44px;

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
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-96: 96px;
  --spacing-108: 108px;
  --spacing-112: 112px;
  --spacing-120: 120px;
  --spacing-124: 124px;

  /* Layout */
  --page-max-width: 1248px;
  --section-gap: 108px;
  --card-padding: 28px;
  --element-gap: 16px;

  /* Border Radius */
  --radius-lg: 10px;
  --radius-2xl: 16px;
  --radius-full: 999px;

  /* Named Radii */
  --radius-cards: 16px;
  --radius-badges: 999px;
  --radius-inputs: 0px;
  --radius-buttons: 999px;
  --radius-overlaycards: 10px;

  /* Surfaces */
  --surface-night-canvas: #0a0118;
  --surface-glass-film: #ffffff;
  --surface-dark-panel: #0a0118;
  --surface-overlay-veil: #16092a;
  --surface-ultraviolet-glow: #713dff;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-night-violet: #0a0118;
  --color-void-plum: #0c0616;
  --color-soft-quartz: #ffffff;
  --color-muted-steel: #d2d0dd;
  --color-ash-lilac: #9b96b0;
  --color-dim-fog: #85808c;
  --color-ultraviolet-core: #713dff;
  --color-lilac-beam: #b7a4fb;
  --color-horizon-glow: #8562ff;
  --color-glass-white-04: #ffffff;
  --color-glass-white-10: #ffffff;
  --color-ultraviolet-horizon: #8562ff;
  --color-violet-beam: #8562ff;
  --color-deep-fade-veil: #16092a;

  /* Typography */
  --font-inter-v: 'Inter V', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-rebond-grotesque: 'Rebond Grotesque', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 16;
  --tracking-caption: -0.28px;
  --text-body: 16px;
  --leading-body: 21;
  --tracking-body: -0.16px;
  --text-subheading: 18px;
  --leading-subheading: 28;
  --tracking-subheading: -0.36px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 36;
  --tracking-heading-sm: -0.48px;
  --text-heading: 28px;
  --leading-heading: 48;
  --tracking-heading: 2.24px;
  --text-heading-lg: 56px;
  --leading-heading-lg: 74;
  --tracking-heading-lg: -1.12px;
  --text-display: 72px;
  --leading-display: 80;
  --tracking-display: -1.44px;

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
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-96: 96px;
  --spacing-108: 108px;
  --spacing-112: 112px;
  --spacing-120: 120px;
  --spacing-124: 124px;

  /* Border Radius */
  --radius-lg: 10px;
  --radius-2xl: 16px;
  --radius-full: 999px;
}
```
