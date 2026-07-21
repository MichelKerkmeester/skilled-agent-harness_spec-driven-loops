# Tripolis-Park™ — Style Reference
> luminous violet portal — soft lavender light bleeding through frosted glass edges, achromatic content floating above.

**Theme:** light

Tripolis-Park uses a luminous violet-to-lavender gradient as its signature atmosphere — a soft, otherworldly wash that fills hero surfaces and section dividers, making the brand feel like a portal rather than a corporate site. Against this atmospheric purple, the interface stays strictly achromatic: pure white surfaces, black text, and hairline borders do all the structural work. Typography is custom and editorial — a humanist sans (Matter) paired with a refined serif (IvarHeadline) — set with tight negative tracking on display sizes to create confident, tight headlines. Components are minimal and borderless by default, with thin rectangular frames (no radius) used as deliberate compositional devices, not decoration.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Aurora Lilac | `linear-gradient(135deg, #c5b0ec 0%, #a78bdb 45%, #7c4fb8 100%)` | `--color-aurora-lilac` | Hero gradient start, atmospheric section backgrounds — the soft entry tone of the brand's signature violet wash |
| Deep Iris | `#7c4fb8` | `--color-deep-iris` | Hero gradient deep stop, section transition anchors — the rich violet terminus that gives the gradient its weight |
| Midnight Ink | `#000000` | `--color-midnight-ink` | Primary text, heading strokes, hairline borders, icon fills, link color |
| Carbon Mist | `#2d2d2d` | `--color-carbon-mist` | Secondary text, subdued headings — softer than pure black for less critical copy |
| Frost White | `#ffffff` | `--color-frost-white` | Page canvas, card surfaces, text on dark/gradient backgrounds, ghost button fill |
| Ash Veil | `#b5b5b5` | `--color-ash-veil` | Muted helper text, disabled states, tertiary metadata |
| Smoke Line | `#cccccc` | `--color-smoke-line` | Hairline dividers, subtle structural lines, secondary borders |
| Pale Mist | `#e2e2e2` | `--color-pale-mist` | Light borders, input field outlines, card edge definition |
| Concrete Gray | `#808080` | `--color-concrete-gray` | Surface variation, muted backgrounds, placeholder fills |

## Tokens — Typography

### Matter — Primary workhorse sans — body copy at 14px and 18px, subheadings at 27px. The humanist proportions and subtle warmth make long-form reading comfortable. Tabular numerals ('tnum') are enabled site-wide, signaling precision and data-readiness across all sizes. · `--font-matter`
- **Substitute:** Inter, Söhne, or DM Sans
- **Weights:** 400
- **Sizes:** 14px, 18px, 27px, 47px
- **Line height:** 1.20-1.25
- **Letter spacing:** -0.0250em, -0.0240em
- **OpenType features:** `"tnum"`
- **Role:** Primary workhorse sans — body copy at 14px and 18px, subheadings at 27px. The humanist proportions and subtle warmth make long-form reading comfortable. Tabular numerals ('tnum') are enabled site-wide, signaling precision and data-readiness across all sizes.

### Matter — Medium-weight emphasis — used for key headings and callouts at 27px and 47px with -0.025em tracking. The medium weight (not bold) keeps the voice measured and confident rather than aggressive. · `--font-matter`
- **Substitute:** Inter Medium, Söhne Medium
- **Weights:** 500
- **Sizes:** 
- **Line height:** 1.08-1.25
- **Letter spacing:** -0.025em at 47px
- **Role:** Medium-weight emphasis — used for key headings and callouts at 27px and 47px with -0.025em tracking. The medium weight (not bold) keeps the voice measured and confident rather than aggressive.

### Matter — SemiBold display weight — reserved for the most prominent headings at 47px with -0.024em tracking. The jump from Medium to SemiBold at the same size is rare and intentional: it creates a deliberate weight tier for hero-level statements. · `--font-matter`
- **Substitute:** Inter SemiBold, Söhne SemiBold
- **Weights:** 600
- **Sizes:** 
- **Line height:** 1.12
- **Letter spacing:** -0.024em at 47px
- **Role:** SemiBold display weight — reserved for the most prominent headings at 47px with -0.024em tracking. The jump from Medium to SemiBold at the same size is rare and intentional: it creates a deliberate weight tier for hero-level statements.

### IvarHeadline — Serif display face for editorial-style headings at 47px. The contrast with Matter's sans body creates a typographic duet — serif headlines anchor emotion and permanence, sans body delivers clarity. Tracking at -0.015em to -0.01em keeps the serif tight and contemporary rather than traditional. · `--font-ivarheadline`
- **Substitute:** Tiempos Headline, Playfair Display, or GT Sectra
- **Weights:** 400
- **Sizes:** 47px
- **Line height:** 1.08-1.12
- **Letter spacing:** -0.015em to -0.01em at 47px
- **Role:** Serif display face for editorial-style headings at 47px. The contrast with Matter's sans body creates a typographic duet — serif headlines anchor emotion and permanence, sans body delivers clarity. Tracking at -0.015em to -0.01em keeps the serif tight and contemporary rather than traditional.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 14px | 1.2 | — | `--text-caption` |
| body-lg | 18px | 1.25 | — | `--text-body-lg` |
| subheading | 27px | 1.25 | — | `--text-subheading` |
| heading | 47px | 1.12 | -0.7px | `--text-heading` |

## Tokens — Spacing & Shapes

**Base unit:** 6px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 12 | 12px | `--spacing-12` |
| 18 | 18px | `--spacing-18` |
| 36 | 36px | `--spacing-36` |
| 66 | 66px | `--spacing-66` |
| 90 | 90px | `--spacing-90` |
| 108 | 108px | `--spacing-108` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 0px |
| cards | 0px |
| frames | 0px |
| buttons | 0px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 88-110px
- **Card padding:** 23-36px
- **Element gap:** 5-23px

## Components

### Hero Gradient Banner
**Role:** Full-bleed section background with brand signature gradient

Full-width violet-to-lavender gradient (135deg, #c5b0ec → #a78bdb → #7c4fb8). No fixed height — content dictates vertical space. Curved organic shapes (visible as soft arcs in the gradient) overlay the wash to add depth. All content inside this banner uses white (#ffffff) text.

### Bordered Title Frame
**Role:** Compositional device for brand/title display in hero

Rectangular frame with 1-2px white (#ffffff) border, fully transparent fill, no radius (sharp corners). Contains the brand mark at 27px Matter Regular in white. Padding approximately 14px vertical, 23-36px horizontal. Functions as a 'window' motif — literalizing the 'window to new technology' tagline.

### Display Heading
**Role:** Hero-level statement headline

IvarHeadline Medium or Matter Medium/SemiBold at 47px, line-height 1.08-1.12, letter-spacing -0.015em to -0.025em. White (#ffffff) on gradient backgrounds, Midnight Ink (#000000) on white surfaces. The tight tracking and serif-or-sans duality is the signature typographic moment.

### Tagline Subtext
**Role:** Supporting text under hero/display headings

Matter Regular at 18px, line-height 1.25, white (#ffffff) on dark/gradient, Midnight Ink (#000000) on light. Maximum two lines. Weight 400 — the thinness contrasts the display heading's 47px weight, creating visual breath.

### Ghost Navigation Button
**Role:** Outlined/ghost-style action button in navigation

Transparent background, 1px white border (on dark) or 1px black border (on light), no radius, padding 5px vertical / 14px horizontal. Text at 14px Matter Regular. No fill on hover — opacity or border-color shift only.

### Section Divider Arc
**Role:** Organic curve separator between sections

Large curved SVG path overlaying the gradient background. No hard horizontal dividers — sections flow into each other via these soft arcs. Color is a lighter/darker variant of the surrounding gradient, creating layered depth.

### Navigation Bar
**Role:** Top-level site navigation

Transparent or white background, 36px horizontal padding, 14px Matter Regular links. Links are Midnight Ink (#000000) on light, white on gradient. No background fill — the nav floats on whatever surface it sits on.

### Body Text Block
**Role:** Paragraph content

Matter Regular at 14px, line-height 1.20, Midnight Ink (#000000). 23px bottom margin between paragraphs. Tabular numerals enabled. Maximum measure ~65-75 characters.

### Heading with Underline Accent
**Role:** Section heading with decorative element

Matter or IvarHeadline at 27-47px with 11-13px margin-bottom. Occasionally paired with a short colored rule or accent element below.

### Image Frame
**Role:** Photographic or illustrative content container

No border, no radius (0px), no shadow. Images bleed to their container edges with no decorative treatment. Full-bleed in hero, contained within max-width in content sections.

## Do's and Don'ts

### Do
- Use the Aurora Lilac → Deep Iris gradient (135deg) as the full-bleed background for hero sections, section transitions, and atmospheric dividers — never as a small accent or button fill.
- Set all display text at 47px with IvarHeadline Medium (serif) or Matter Medium/SemiBold (sans) with tracking between -0.015em and -0.025em — never set display copy at body sizes with display weight.
- Apply tabular numerals ('tnum') via font-feature-settings on all Matter text — it signals precision and is a non-negotiable brand mark.
- Use 0px border-radius on all components — cards, buttons, tags, frames. The sharp-cornered geometry is core to the system; rounding would undermine the architectural feel.
- Pair white text (#ffffff) on gradient/violet backgrounds, and Midnight Ink (#000000) on white surfaces — never use gray text on white for primary content.
- Use hairline borders (1px) in white on dark surfaces and Midnight Ink or Smoke Line (#cccccc) on light surfaces for structural framing.
- Maintain a 6px base unit for all spacing — derive all padding, margins, and gaps as multiples (12px, 18px, 23px, 36px).

### Don't
- Don't introduce additional colors to the palette — the system is achromatic + violet gradient. No green, blue, red, or warm accents outside the gradient.
- Don't use border-radius greater than 0px on any component — no rounded buttons, no pill tags, no curved cards. The sharp geometry is intentional.
- Don't set headings at weights above 600 (SemiBold) — the system relies on the Medium-to-SemiBold tier, not heavy/black weights.
- Don't apply drop shadows or elevation effects — the design uses flat surfaces with hairline borders for separation, never shadows.
- Don't use the gradient on small UI elements (buttons, badges, icons) — it belongs only on large atmospheric surfaces.
- Don't set body text below 14px or above 18px — the 14-18px range is the only readable zone for this system.
- Don't mix serif and sans within the same heading — choose IvarHeadline OR Matter for any single headline, not both.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#ffffff` | Base page background, primary content surface |
| 1 | Gradient Field | `#a78bdb` | Hero sections and atmospheric dividers — the brand's signature violet wash |
| 2 | Elevated Surface | `#ffffff` | Cards and content blocks floating on gradient fields — distinguished by hairline borders, not shadow |

## Elevation

The design system intentionally avoids drop shadows and elevation effects. All surface separation is achieved through the violet gradient field contrasting with pure white surfaces, and through 1px hairline borders (#cccccc or #e2e2e2 on light, #ffffff on dark). This creates a flat, architectural quality where depth comes from color fields and compositional framing, not from simulated z-axis elevation.

## Imagery

Photography and visual content are used sparingly and treated with minimal styling — no rounded corners, no drop shadows, no colored overlays. Images bleed to container edges or sit within sharp-cornered frames. The dominant visual is the gradient field itself with its organic curved arcs, which functions as both background and decorative element. When photographs appear, they are likely high-key and natural, treated with no filters or duotone effects — the object or scene speaks for itself within the system. The overall density is text-and-atmosphere dominant rather than image-heavy.

## Layout

The page uses a max-width 1200px centered container for content, with full-bleed gradient sections that extend beyond the container edges. The hero is a full-viewport gradient field with the brand title floating in a bordered frame and a tagline below. Sections flow into each other via organic curved arcs rather than hard dividers. Navigation is minimal — a top bar with ghost-style links floating transparently over the gradient. Content sections alternate between gradient fields and white surfaces, creating a rhythm of atmosphere-to-clarity. The layout is single-column or asymmetric two-column for content, with generous vertical spacing (88-110px between sections) to let the gradient breathe.

## Agent Prompt Guide

**Quick Color Reference**
- Text: #000000 (Midnight Ink)
- Background: #ffffff (Frost White)
- Border: #cccccc (Smoke Line)
- Accent: #7c4fb8 (Deep Iris)
- Gradient field: #b9a3e8 (Aurora Lilac) with linear-gradient(135deg, #c5b0ec 0%, #a78bdb 45%, #7c4fb8 100%)
- primary action: no distinct CTA color

**Example Component Prompts**

1. **Hero Section**: Full-bleed background with linear-gradient(135deg, #c5b0ec 0%, #a78bdb 45%, #7c4fb8 100%). Centered bordered frame: 1px white border, transparent fill, 0px radius, 14px 23px padding, containing 'Tripolis-Park™' at 27px Matter Regular weight 400 in #ffffff. Below: tagline at 18px Matter Regular in #ffffff, line-height 1.25. Section min-height 100vh, flexbox centered.

2. **Display Heading on White**: 'A window to new technology' at 47px IvarHeadline Medium, line-height 1.08, letter-spacing -0.7px, color #000000. 23px margin-bottom. Followed by body text at 14px Matter Regular, line-height 1.20, color #2d2d2d, max-width 65ch.

3. **Ghost Navigation Button**: Transparent background, 1px solid #000000 border, 0px radius, padding 5px 14px, text at 14px Matter Regular in #000000. On hover: border remains 1px but color shifts to #808080 — no fill change.

4. **Content Card on White**: Background #ffffff, 0px radius, 1px solid #e2e2e2 border, padding 23px. Heading at 27px Matter Medium in #000000 with -0.025em tracking. Body at 14px Matter Regular in #2d2d2d. No shadow.

5. **Gradient Section Divider**: Full-width 200px tall section with the Aurora Lilac → Deep Iris gradient. Overlay a large curved SVG arc in a lighter variant of the gradient. Content: 47px IvarHeadline Medium in #ffffff, line-height 1.08, letter-spacing -0.7px.

## Similar Brands

- **Linear** — Same flat-surface, no-radius, hairline-border component language with gradient atmospheric hero sections
- **Vercel** — Same monochrome content system with a single signature gradient as the hero atmospheric device
- **Arc** — Same editorial typography pairing (custom sans + serif display), tight negative tracking, and restrained achromatic palette
- **Pitch** — Same generous section spacing, sharp-cornered components, and gradient-as-atmosphere approach to hero design

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-aurora-lilac: #b9a3e8;
  --gradient-aurora-lilac: linear-gradient(135deg, #c5b0ec 0%, #a78bdb 45%, #7c4fb8 100%);
  --color-deep-iris: #7c4fb8;
  --color-midnight-ink: #000000;
  --color-carbon-mist: #2d2d2d;
  --color-frost-white: #ffffff;
  --color-ash-veil: #b5b5b5;
  --color-smoke-line: #cccccc;
  --color-pale-mist: #e2e2e2;
  --color-concrete-gray: #808080;

  /* Typography — Font Families */
  --font-matter: 'Matter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-ivarheadline: 'IvarHeadline', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.2;
  --text-body-lg: 18px;
  --leading-body-lg: 1.25;
  --text-subheading: 27px;
  --leading-subheading: 1.25;
  --text-heading: 47px;
  --leading-heading: 1.12;
  --tracking-heading: -0.7px;

  /* Typography — Weights */
  --font-weight-regular: 400;

  /* Spacing */
  --spacing-unit: 6px;
  --spacing-12: 12px;
  --spacing-18: 18px;
  --spacing-36: 36px;
  --spacing-66: 66px;
  --spacing-90: 90px;
  --spacing-108: 108px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 88-110px;
  --card-padding: 23-36px;
  --element-gap: 5-23px;

  /* Named Radii */
  --radius-tags: 0px;
  --radius-cards: 0px;
  --radius-frames: 0px;
  --radius-buttons: 0px;

  /* Surfaces */
  --surface-canvas: #ffffff;
  --surface-gradient-field: #a78bdb;
  --surface-elevated-surface: #ffffff;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-aurora-lilac: #b9a3e8;
  --color-deep-iris: #7c4fb8;
  --color-midnight-ink: #000000;
  --color-carbon-mist: #2d2d2d;
  --color-frost-white: #ffffff;
  --color-ash-veil: #b5b5b5;
  --color-smoke-line: #cccccc;
  --color-pale-mist: #e2e2e2;
  --color-concrete-gray: #808080;

  /* Typography */
  --font-matter: 'Matter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-ivarheadline: 'IvarHeadline', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.2;
  --text-body-lg: 18px;
  --leading-body-lg: 1.25;
  --text-subheading: 27px;
  --leading-subheading: 1.25;
  --text-heading: 47px;
  --leading-heading: 1.12;
  --tracking-heading: -0.7px;

  /* Spacing */
  --spacing-12: 12px;
  --spacing-18: 18px;
  --spacing-36: 36px;
  --spacing-66: 66px;
  --spacing-90: 90px;
  --spacing-108: 108px;
}
```
