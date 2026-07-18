# HashiCorp — Style Reference
> midnight control room with violet neon — a dark technical surface where a glowing hexagonal cube serves as the only chromatic anchor

**Theme:** dark

HashiCorp operates a midnight control-room aesthetic: near-black canvases swallow the page, letting a single electric violet-blue brand signal carry every interactive moment. Headlines use a custom geometric sans at heavy weights with tight negative tracking, giving typography a compressed, confident posture rather than airy elegance. The 3D hexagonal cube render — glowing violet and indigo — is the signature visual, appearing wherever the brand needs to feel tangible. Surfaces stay nearly flat with hairline borders and almost imperceptible shadows; the depth comes from gradient washes, not elevation. Body copy is achromatic, generously sized, and unornamented, letting the brand blue do the work of guiding attention through links, active states, and tab indicators.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Void Canvas | `#000000` | `--color-void-canvas` | Primary page background, hero foundation, footer base — the near-black void that absorbs all other content |
| Onyx Surface | `#0d0e12` | `--color-onyx-surface` | Elevated cards, panels, input fields, secondary surface layer above the void |
| Obsidian Plate | `#15181e` | `--color-obsidian-plate` | Highest elevation tier — modals, popovers, overlay containers |
| Ash Text | `#656a76` | `--color-ash-text` | Muted body copy, helper text, metadata, placeholder content |
| Steel Secondary | `#3b3d45` | `--color-steel-secondary` | Icon strokes, decorative line work, tertiary UI elements |
| Graphite Border | `#b2b6bd` | `--color-graphite-border` | Borders, dividers, inactive control outlines at mid-contrast |
| Fog Divider | `#d5d7db` | `--color-fog-divider` | High-frequency dividers, light borders, subtle separators, partner logo treatment |
| Bone | `#e0e2e5` | `--color-bone` | Button borders on filled controls, hairline outlines |
| Chalk | `#efeff1` | `--color-chalk` | Primary text on dark surfaces, headings, body copy at highest contrast |
| Pure White | `#ffffff` | `--color-pure-white` | Maximum-contrast text, filled button text, the brightest surface accent |
| Brand Cobalt | `#2264d6` | `--color-brand-cobalt` | Primary brand color — active nav items, links, icon fills, tab indicators, the dominant chromatic signal |
| Signal Blue | `#2b89ff` | `--color-signal-blue` | Blue supporting accent for decorative details and low-frequency emphasis. Do not promote it to the primary CTA color |
| Hyperlink Violet | `#1060ff` | `--color-hyperlink-violet` | Violet supporting accent for decorative details and low-frequency emphasis. Do not promote it to the primary CTA color |
| Plum Glass | `#42225b` | `--color-plum-glass` | Badge background fill, decorative deep-violet surface for category tags |
| Amethyst Edge | `#b457ff` | `--color-amethyst-edge` | Badge borders, violet accent strokes, decorative outline highlights |
| Violet Dawn | `#6c81ff` | `--color-violet-dawn` | Gradient origin — the cool blue-violet start of the hero and cube illumination |
| Iris Glow | `#c08dff` | `--color-iris-glow` | Gradient terminus — warm violet end of the hero gradient, the lighter face of the 3D cube render |

## Tokens — Typography

### system-ui — Body copy, navigation links, button labels, form inputs, badges — the workhorse text stack. System UI at 15–16px with 1.6–1.71 line-height creates generous, readable body text. Weight 500 for nav emphasis, 600 for button labels. No custom tracking, relying on the platform's default kerning. · `--font-system-ui`
- **Substitute:** -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue
- **Weights:** 400, 500, 600
- **Sizes:** 13, 14, 15, 16, 17px
- **Line height:** 1.5–1.71 for body, 1.2 for compact UI text
- **Role:** Body copy, navigation links, button labels, form inputs, badges — the workhorse text stack. System UI at 15–16px with 1.6–1.71 line-height creates generous, readable body text. Weight 500 for nav emphasis, 600 for button labels. No custom tracking, relying on the platform's default kerning.

### Hashicorp Sans — All headings and display text — a custom geometric sans with tight negative tracking (-0.01em) that compresses the headline posture. Weight 700 at 82px anchors the hero; weight 600 carries section headings. The +0.1em positive tracking appears on uppercase eyebrow labels, creating a wide-spaced technical caption register. 'kern' feature enabled for tight headline kerning. · `--font-hashicorp-sans`
- **Substitute:** Inter, Space Grotesk, or General Sans
- **Weights:** 600, 700
- **Sizes:** 13, 17, 19, 26, 34, 42, 52, 82px
- **Line height:** 1.17–1.21 for display, 1.35 for subheadings, 1.69 for body-sized usages
- **Letter spacing:** -0.01em on display sizes, +0.1em on uppercase eyebrow labels
- **OpenType features:** `"kern"`
- **Role:** All headings and display text — a custom geometric sans with tight negative tracking (-0.01em) that compresses the headline posture. Weight 700 at 82px anchors the hero; weight 600 carries section headings. The +0.1em positive tracking appears on uppercase eyebrow labels, creating a wide-spaced technical caption register. 'kern' feature enabled for tight headline kerning.

### Arial — Arial — detected in extracted data but not described by AI · `--font-arial`
- **Weights:** 400
- **Sizes:** 16px
- **Line height:** 1.2
- **Role:** Arial — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 13px | 1.5 | 0.1px | `--text-caption` |
| body | 16px | 1.69 | — | `--text-body` |
| subheading | 19px | 1.35 | -0.01px | `--text-subheading` |
| heading-sm | 26px | 1.21 | -0.01px | `--text-heading-sm` |
| heading | 34px | 1.19 | -0.01px | `--text-heading` |
| heading-lg | 42px | 1.18 | -0.01px | `--text-heading-lg` |
| display | 82px | 1.17 | -0.01px | `--text-display` |

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
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 64 | 64px | `--spacing-64` |
| 88 | 88px | `--spacing-88` |
| 96 | 96px | `--spacing-96` |
| 128 | 128px | `--spacing-128` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 4px |
| cards | 8px |
| badges | 4px |
| inputs | 4px |
| buttons | 4px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| subtle | `rgba(97, 104, 117, 0.05) 0px 1px 1px 0px, rgba(97, 104, 1...` | `--shadow-subtle` |
| subtle-2 | `rgba(101, 106, 118, 0.05) 0px 1px 1px 0px, rgba(101, 106,...` | `--shadow-subtle-2` |
| subtle-3 | `rgba(97, 104, 117, 0.1) 0px 1px 2px 1px inset` | `--shadow-subtle-3` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 64px
- **Card padding:** 24px
- **Element gap:** 16px

## Components

### Hero Gradient Banner
**Role:** Full-bleed dark hero with diagonal violet-blue gradient sweep

Background #000000 base with linear-gradient(-45deg, #6c81ff → #c08dff) sweeping from upper-right toward lower-left, creating a luminous angled band. Headline at 82px Hashicorp Sans weight 700 in #efeff1, tracking -0.82px. Subtext at 17px system-ui weight 400 in #b2b6bd. No card surface — text sits directly on the gradient void. Padding ~80px vertical, content centered or left-aligned within 1200px max-width.

### Announcement Pill
**Role:** Inline editorial announcement above the hero headline

Compact pill at ~4px radius containing a tag chip (e.g. 'Do Cloud Right, Explained') with #b457ff border on #42225b fill, followed by descriptive text at 13–14px in #d5d7db, and a 'Watch now →' link in #2b89ff. Horizontal flex layout with 8–12px gaps, vertical padding ~3–4px. Functions as a content teaser, not a primary action.

### Outlined Ghost Button
**Role:** Secondary CTA on dark surfaces

Transparent fill with 1px solid #efeff1 border at 4px radius. Text in #efeff1 at 15px system-ui weight 500, padding 11px 19px. The standard 'Meet The Infrastructure Cloud' / 'Learn more' variant. Box-shadow: rgba(97,104,117,0.05) 0px 1px 1px, rgba(97,104,117,0.05) 0px 2px 2px — barely-there depth that whispers elevation rather than declaring it.

### Filled Primary Button
**Role:** Primary conversion action

Solid #2b89ff fill with white text at 15px system-ui weight 600, 4px radius, padding 11px 19px. The 'Get started' variant — the highest-saturation chromatic button in the system, used sparingly to mark the single most important action on a page.

### Text Link Button
**Role:** Tertiary navigation action

No border, no fill. Text in #efeff1 at 15px system-ui weight 500, often paired with an icon (e.g. '→' for 'Try HCP'). Padding minimal. The 'Log in' / 'Contact us' style — relies on hover color shift to #2b89ff for affordance.

### Top Navigation Bar
**Role:** Primary site navigation

Transparent over hero, then #0d0e12 on scroll. Logo (hexagonal H mark) at left, nav items at 15px system-ui weight 500 in #b2b6bd, with the active item underlined in #2264d6. Right-aligned action cluster: ghost login + outlined contact + filled get-started. Height ~64px, horizontal padding 24–48px. The nav maintains 4px radius on interactive items.

### Partner Logo Bar
**Role:** Social proof band beneath hero

Section header 'TRUSTED BY LEADING ORGANIZATIONS' in uppercase Hashicorp Sans weight 600, tracked at +0.1em, size 13px, color #b2b6bd. Below: horizontal row of partner logos rendered in #d5d7db at uniform height ~24px, evenly spaced with 32–48px gaps. Logos are monochrome — no original brand color survives the dark-mode treatment.

### Feature Split Section
**Role:** Two-column editorial feature block

Left column: eyebrow label (Hashicorp Sans 13px uppercase +0.1em in #b2b6bd) + headline (Hashicorp Sans 34–42px weight 700 in #efeff1) + body text (16px system-ui in #b2b6bd with inline links in #2b89ff) + action buttons. Right column: 3D render or product visual. Gap between columns ~64px. Section background #0d0e12 to differentiate from void canvas.

### 3D Hexagonal Cube Render
**Role:** Signature brand visual element

A glowing isometric hexagonal prism rendered in 3D, with faces lit by the violet-to-blue gradient (#6c81ff → #c08dff) and a soft purple underglow on the surface below. The HashiCorp 'H' logo is debossed on the top face. Subtle line drawings of architectural/circuit elements extend from the base. This is the system's hero visual — the single piece of recognizable brand imagery.

### Tab Navigation
**Role:** Content section switching control

Horizontal tabs at top of a content section. Inactive tabs: 17px system-ui weight 500 in #656a76. Active tab: same size/weight in #efeff1 with a 2px underline in #2264d6. 4px radius on any background hover state. Tabs separated by 24–32px horizontal gap.

### Resource Card
**Role:** Editorial content card for resources/reports

Background #0d0e12 with 1px #15181 border, 8px radius. Padding 24px. Contains a feature image (16:9 or similar), then a headline (Hashicorp Sans 19px weight 600 in #efeff1) and descriptive text (15px system-ui in #b2b6bd). No drop shadow — separation is purely from the border and surface contrast.

### Featured Report Card
**Role:** Hero-sized content card with gradient thumbnail

Larger variant of the resource card. Thumbnail uses a full-bleed gradient (e.g. linear-gradient(-45deg, #ff8791, #f9b571) for warm accent) with an embedded chart/visual. Headline at 26px Hashicorp Sans weight 600, body at 15px. Occupies roughly 2/3 of the row width with companion text cards stacked on the right.

### Badge / Category Tag
**Role:** Compact metadata label

Small pill at 4px radius with 1px border. Default variant: #b457ff border on transparent or #42225b fill, text in #efeff1 at 13px Hashicorp Sans weight 600 with +0.1em tracking. Used for content categorization (e.g. 'What's new', 'Webinars & events'). Padding ~3px 8px.

### Input Field
**Role:** Form input on dark surface

Background #0d0e12, 1px #3b3d45 border, 4px radius. Text in #efeff1 at 16px system-ui, placeholder in #656a76. Inset shadow: rgba(97,104,117,0.1) 0px 1px 2px 1px inset for subtle depression. Focus state: border shifts to #2b89ff. Padding 11px 16px.

## Do's and Don'ts

### Do
- Use #000000 as the primary page background and layer surfaces in the order #000000 → #0d0e12 → #15181 for incremental elevation
- Apply #2264d6 exclusively for active states, active nav items, and tab indicators — never as a decorative fill
- Set all heading text in Hashicorp Sans weight 600–700 with -0.01em letter-spacing for the compressed, confident posture
- Use the +0.1em tracking on Hashicorp Sans weight 600 at 13px for uppercase eyebrow labels (section headers, 'TRUSTED BY' bands)
- Maintain 4px radius on all interactive controls (buttons, inputs, badges, nav items) and reserve 8px for content cards
- Keep shadows at rgba(97,104,117,0.05) opacity — depth should be felt, not seen
- Use the violet-to-blue gradient (#6c81ff → #c08dff) as a directional light source on hero sections and the 3D cube render

### Don't
- Do not introduce additional chromatic colors — the brand signal is singular and frequency matters
- Do not use rounded radii above 8px; this system is geometric and precise, not friendly or soft
- Do not use drop shadows darker than 10% opacity — heavy shadows break the void-canvas illusion
- Do not use #2264d6 or #2b89ff as a background fill for buttons; the filled primary button is the only exception and uses #2b89ff sparingly
- Do not mix positive and negative letter-spacing within the same heading; pick one tracking register per block
- Do not let body text drop below 14px or above 17px — the 15–16px sweet spot is the readable standard
- Do not use full-color partner logos in the trust bar; all logos must be rendered in #d5d7db to maintain the monochrome band

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Void Canvas | `#000000` | Primary page background — the base void against which all content floats |
| 2 | Onyx Surface | `#0d0e12` | Cards, input fields, content sections that need to separate from the void |
| 3 | Obsidian Plate | `#15181` | Modals, popovers, elevated overlays requiring maximum separation |

## Elevation

- **Outlined Ghost Button:** `rgba(97, 104, 117, 0.05) 0px 1px 1px 0px, rgba(97, 104, 117, 0.05) 0px 2px 2px 0px`
- **Top Navigation:** `rgba(101, 106, 118, 0.05) 0px 1px 1px 0px, rgba(101, 106, 118, 0.05) 0px 2px 2px 0px`
- **Input Field:** `rgba(97, 104, 117, 0.1) 0px 1px 2px 1px inset`

## Imagery

The visual language is dominated by 3D renders rather than photography. The signature asset is an illuminated hexagonal prism (representing the HashiCorp 'H' logo in volumetric form) rendered in a violet-to-blue gradient with a soft underglow. Supporting visuals include abstract gradient washes, data charts, and subtle architectural/circuit line drawings. Photography is absent — this is a UI-first, object-first visual system. Partner logos are flattened to monochrome. The density is low: one hero image per section, with text occupying the majority of visual real estate.

## Layout

Full-bleed dark canvases with content constrained to a 1200px max-width centered column. The hero is a full-viewport dark gradient with centered (or slightly left-aligned) headline. Sections alternate between #000000 and #0d0e12 backgrounds to create visual rhythm without light/dark polarity. Content follows a repeating 2-column split pattern: text-left/visual-right, with generous 64px section gaps. Tab-driven resource sections use a 1-large-plus-2-small asymmetric grid. The nav is a fixed top bar that transitions from transparent (over hero) to solid #0d0e12 (on scroll). Overall density is spacious — one concept per section, with breathing room between blocks.

## Agent Prompt Guide

## Quick Color Reference
- text: #efeff1
- background: #000000
- surface: #0d0e12
- border: #3b3d45
- accent: #2264d6 (active states, links)
- primary action: no distinct CTA color

## Example Component Prompts

No distinct primary action color was observed; use the extracted neutral button treatments instead of inventing a filled CTA color.

2. **Feature Split Section**: Two-column layout, 64px gap. Left: eyebrow label in Hashicorp Sans 13px weight 600 uppercase, +1.3px tracking, color #b2b6bd. Headline in Hashicorp Sans 42px weight 700, #efeff1, -0.42px tracking. Body in system-ui 16px weight 400, #b2b6bd, with inline links in #2b89ff. Right: 3D hexagonal cube render with violet-blue gradient faces.

3. **Tab Navigation + Content**: Tabs row — inactive in system-ui 17px weight 500 #656a76, active in #efeff1 with 2px #2264d6 underline. Below: resource card on #0d0e12 surface, 1px #15181e border, 8px radius, 24px padding. Card headline in Hashicorp Sans 19px weight 600 #efeff1, body in system-ui 15px #b2b6bd.

4. **Partner Logo Bar**: Section header 'TRUSTED BY LEADING ORGANIZATIONS' in Hashicorp Sans 13px weight 600, tracking +1.3px, color #b2b6bd. Horizontal logo row, all logos rendered in monochrome #d5d7db, ~24px height, 32–48px gaps.

5. **Badge Component**: 4px radius pill, 1px #b457ff border, transparent fill, text in Hashicorp Sans 13px weight 600 uppercase with +1.3px tracking, color #efeff1. Padding 3px 8px.

## Similar Brands

- **Vercel** — Same dark-void canvas with electric accent color and geometric sans display type, though Vercel uses a warmer accent and more gradient washes
- **Linear** — Identical compressed headline tracking, dark near-black surface, and a single vivid chromatic accent (purple for Linear, blue-violet for HashiCorp) that marks every interactive moment
- **Stripe** — Same gradient-from-edges hero treatment and 3D brand mark as the section anchor, though Stripe's canvas is lighter
- **PlanetScale** — Matching dark enterprise aesthetic with restrained typography, a single saturated brand signal, and 3D geometric brand visuals

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-void-canvas: #000000;
  --color-onyx-surface: #0d0e12;
  --color-obsidian-plate: #15181e;
  --color-ash-text: #656a76;
  --color-steel-secondary: #3b3d45;
  --color-graphite-border: #b2b6bd;
  --color-fog-divider: #d5d7db;
  --color-bone: #e0e2e5;
  --color-chalk: #efeff1;
  --color-pure-white: #ffffff;
  --color-brand-cobalt: #2264d6;
  --color-signal-blue: #2b89ff;
  --color-hyperlink-violet: #1060ff;
  --color-plum-glass: #42225b;
  --color-amethyst-edge: #b457ff;
  --color-violet-dawn: #6c81ff;
  --color-iris-glow: #c08dff;

  /* Typography — Font Families */
  --font-system-ui: 'system-ui', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-hashicorp-sans: 'Hashicorp Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 13px;
  --leading-caption: 1.5;
  --tracking-caption: 0.1px;
  --text-body: 16px;
  --leading-body: 1.69;
  --text-subheading: 19px;
  --leading-subheading: 1.35;
  --tracking-subheading: -0.01px;
  --text-heading-sm: 26px;
  --leading-heading-sm: 1.21;
  --tracking-heading-sm: -0.01px;
  --text-heading: 34px;
  --leading-heading: 1.19;
  --tracking-heading: -0.01px;
  --text-heading-lg: 42px;
  --leading-heading-lg: 1.18;
  --tracking-heading-lg: -0.01px;
  --text-display: 82px;
  --leading-display: 1.17;
  --tracking-display: -0.01px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
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
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-88: 88px;
  --spacing-96: 96px;
  --spacing-128: 128px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 64px;
  --card-padding: 24px;
  --element-gap: 16px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;

  /* Named Radii */
  --radius-nav: 4px;
  --radius-cards: 8px;
  --radius-badges: 4px;
  --radius-inputs: 4px;
  --radius-buttons: 4px;

  /* Shadows */
  --shadow-subtle: rgba(97, 104, 117, 0.05) 0px 1px 1px 0px, rgba(97, 104, 117, 0.05) 0px 2px 2px 0px;
  --shadow-subtle-2: rgba(101, 106, 118, 0.05) 0px 1px 1px 0px, rgba(101, 106, 118, 0.05) 0px 2px 2px 0px;
  --shadow-subtle-3: rgba(97, 104, 117, 0.1) 0px 1px 2px 1px inset;

  /* Surfaces */
  --surface-void-canvas: #000000;
  --surface-onyx-surface: #0d0e12;
  --surface-obsidian-plate: #15181;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-void-canvas: #000000;
  --color-onyx-surface: #0d0e12;
  --color-obsidian-plate: #15181e;
  --color-ash-text: #656a76;
  --color-steel-secondary: #3b3d45;
  --color-graphite-border: #b2b6bd;
  --color-fog-divider: #d5d7db;
  --color-bone: #e0e2e5;
  --color-chalk: #efeff1;
  --color-pure-white: #ffffff;
  --color-brand-cobalt: #2264d6;
  --color-signal-blue: #2b89ff;
  --color-hyperlink-violet: #1060ff;
  --color-plum-glass: #42225b;
  --color-amethyst-edge: #b457ff;
  --color-violet-dawn: #6c81ff;
  --color-iris-glow: #c08dff;

  /* Typography */
  --font-system-ui: 'system-ui', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-hashicorp-sans: 'Hashicorp Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 13px;
  --leading-caption: 1.5;
  --tracking-caption: 0.1px;
  --text-body: 16px;
  --leading-body: 1.69;
  --text-subheading: 19px;
  --leading-subheading: 1.35;
  --tracking-subheading: -0.01px;
  --text-heading-sm: 26px;
  --leading-heading-sm: 1.21;
  --tracking-heading-sm: -0.01px;
  --text-heading: 34px;
  --leading-heading: 1.19;
  --tracking-heading: -0.01px;
  --text-heading-lg: 42px;
  --leading-heading-lg: 1.18;
  --tracking-heading-lg: -0.01px;
  --text-display: 82px;
  --leading-display: 1.17;
  --tracking-display: -0.01px;

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
  --spacing-88: 88px;
  --spacing-96: 96px;
  --spacing-128: 128px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;

  /* Shadows */
  --shadow-subtle: rgba(97, 104, 117, 0.05) 0px 1px 1px 0px, rgba(97, 104, 117, 0.05) 0px 2px 2px 0px;
  --shadow-subtle-2: rgba(101, 106, 118, 0.05) 0px 1px 1px 0px, rgba(101, 106, 118, 0.05) 0px 2px 2px 0px;
  --shadow-subtle-3: rgba(97, 104, 117, 0.1) 0px 1px 2px 1px inset;
}
```
