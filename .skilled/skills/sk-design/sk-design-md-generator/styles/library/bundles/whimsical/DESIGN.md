# Whimsical — Style Reference
> Deep plum ink on lavender mist — a creative studio notebook that thinks it's a technical whiteboard.

**Theme:** light

Whimsical operates as a dark-plum-on-cream workspace: a near-black purple (#250835) does the heavy structural work — nav borders, body text, primary buttons — while Agrandir display headlines at 48-96px float above the surface with generous negative tracking. The palette is deliberately narrow: two purples, one warm-gray-purple for muted copy, and vivid violet/blue accents that read as functional punctuation on links and icons rather than decorative noise. Sections break the monochrome discipline with full-bleed gradient washes (blue→violet→pink, purple→pink) that preview the product canvas. Cards live at 8-16px radius with plum-tinted shadows at very low opacity, and the white canvas carries a barely-there lavender undertone (#ebe6ee, #f5f4f5) rather than pure neutral gray — everything sits in the same purple family.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Deep Plum | `#250835` | `--color-deep-plum` | Primary action fill, nav borders, headline text, card borders — the structural workhorse. High-contrast against white (18:1) lets it function as both color and text simultaneously |
| Dark Mauve | `#473054` | `--color-dark-mauve` | Secondary text and outlined action borders, muted plum that steps back from Deep Plum without leaving the family |
| Vivid Violet | `#ab2fed` | `--color-vivid-violet` | Accent link color, icon stroke — the brightest chromatic in the UI, used sparingly to mark interactive text and product iconography |
| Vivid Blue | `#0283ec` | `--color-vivid-blue` | Secondary accent on icons and flowchart elements — pairs with Vivid Violet to give the product canvas its dual-accent personality |
| Electric Indigo | `#4b38ee` | `--color-electric-indigo` | Tertiary accent on icons, occasionally used in flowchart node color alongside Vivid Blue |
| Warm Gray Purple | `#6a5b72` | `--color-warm-gray-purple` | Muted body text, list dividers, secondary borders — stays in the plum family at lower chroma to avoid breaking the monochrome discipline |
| Lavender Mist | `#ebe6ee` | `--color-lavender-mist` | Default border and divider color, low-contrast page texture — the neutral that replaces what most sites would do in #e5e5e5 |
| Soft White | `#f5f4f5` | `--color-soft-white` | Card surface slightly off-white to lift cards off the canvas without going full gray |
| Plum Shadow | `#cdc7d1` | `--color-plum-shadow` | Box-shadow base tone — shadows are plum-tinted (rgba(37,8,53,…)) so elevation reads as on-brand even at low opacity |
| Lavender Wash | `#decaff` | `--color-lavender-wash` | Decorative card and heading highlight wash — the lightest purple tint, used as background accent on badges and inline highlights |
| Blush Bloom | `#e9bded` | `--color-blush-bloom` | Hero gradient warm stop, decorative card surface — the pinker end of the lavender family used in gradient transitions and product showcase backgrounds |
| Sky Mist | `#bbcfe4` | `--color-sky-mist` | Cool decorative surface — the blue-tinted neutral used in card backgrounds and gradient cool stops to balance the purple warmth |
| Plum to Pink Wash | `linear-gradient(142deg, rgb(186, 89, 255) 0%, rgb(186, 89, 255) 30%, rgb(255, 89, 241) 100%)` | `--color-plum-to-pink-wash` | Decorative gradient wash — purple-to-pink spectrum used in hero backgrounds and marketing sections |
| Aurora Gradient | `linear-gradient(97deg, rgb(60, 161, 255) 5.54%, rgb(200, 82, 255) 49.85%, rgb(255, 96, 240) 94.14%)` | `--color-aurora-gradient` | Full-bleed section gradient — blue→violet→pink sweep used on logo band and feature section dividers |

## Tokens — Typography

### Agrandir — Display headlines only. Used at 48-96px for hero and section titles, 24px for large card titles. The 700 weight at huge sizes is confident but not heavy — character widths are wide and the negative tracking (-0.01em) tightens the silhouette. Single weight means hierarchy comes from size alone, not weight contrast. Substitute: Recoleta, Gilroy Bold, or Manrope 800 if Agrandir is unavailable. · `--font-agrandir`
- **Substitute:** Recoleta, Gilroy Bold
- **Weights:** 700
- **Sizes:** 24px, 48px, 64px, 96px
- **Line height:** 1.00–1.10
- **Letter spacing:** -0.01em at display sizes
- **Role:** Display headlines only. Used at 48-96px for hero and section titles, 24px for large card titles. The 700 weight at huge sizes is confident but not heavy — character widths are wide and the negative tracking (-0.01em) tightens the silhouette. Single weight means hierarchy comes from size alone, not weight contrast. Substitute: Recoleta, Gilroy Bold, or Manrope 800 if Agrandir is unavailable.

### Manrope — UI body font — handles everything below display: nav, buttons (400-600), body copy (400 at 14-16px), small labels (9-13px), and the occasional subheading (32px). Wide weight range allows three-tier hierarchy within UI text. Letter-spacing opens up to 0.15em on small labels (badges, 'NEW' tags) for an all-caps tracked feel. Substitute: Inter, DM Sans. · `--font-manrope`
- **Substitute:** Inter, DM Sans
- **Weights:** 400, 500, 600, 700
- **Sizes:** 9px, 10px, 12px, 13px, 14px, 16px, 32px
- **Line height:** 1.20, 1.40, 2.67
- **Letter spacing:** 0.009em to 0.15em depending on size; 0.15em on small uppercase labels
- **Role:** UI body font — handles everything below display: nav, buttons (400-600), body copy (400 at 14-16px), small labels (9-13px), and the occasional subheading (32px). Wide weight range allows three-tier hierarchy within UI text. Letter-spacing opens up to 0.15em on small labels (badges, 'NEW' tags) for an all-caps tracked feel. Substitute: Inter, DM Sans.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| label | 10px | 1.2 | 1.5px | `--text-label` |
| caption | 12px | 1.2 | 0.24px | `--text-caption` |
| body-sm | 14px | 1.4 | — | `--text-body-sm` |
| body | 16px | 1.4 | — | `--text-body` |
| subheading | 24px | 1.2 | -0.24px | `--text-subheading` |
| heading-sm | 32px | 1.2 | -0.32px | `--text-heading-sm` |
| heading | 48px | 1.1 | -0.48px | `--text-heading` |
| heading-lg | 64px | 1.05 | -0.64px | `--text-heading-lg` |
| display | 96px | 1 | -0.96px | `--text-display` |

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
| 36 | 36px | `--spacing-36` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 60 | 60px | `--spacing-60` |
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |
| 120 | 120px | `--spacing-120` |
| 160 | 160px | `--spacing-160` |
| 180 | 180px | `--spacing-180` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 12px |
| cards | 16px |
| links | 12px |
| badges | 9999px |
| images | 8px |
| buttons | 12px |
| featureCards | 40-120px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| xl | `rgba(37, 8, 53, 0.06) 0px 16px 32px -4px` | `--shadow-xl` |
| md | `rgba(37, 8, 53, 0.2) 0px 12px 16px -4px` | `--shadow-md` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 40px
- **Element gap:** 16px

## Components

### Top Navigation Bar
**Role:** Sticky site navigation

White surface with a 1px Lavender Mist (#ebe6ee) bottom border running the full width. Inner content is centered at max-width 1200px with 18px horizontal padding. Logo on left (32px), nav links centered (Manrope 500 14px, #250835), and 'Contact sales' + 'Log in' text links + 'Sign up' filled Deep Plum button on right. No drop shadow — the border line is the only separator.

### Announcement Banner
**Role:** Promote new features

Sits directly under the nav as a full-width band with rounded ends (9999px) and Lavender Mist border. White background. Contains a 'NEW' badge (Deep Plum fill, white text, 9999px radius, 9-10px Manrope 600 0.15em tracked) + body text in Manrope 500 14px #250835 + a star/sparkle icon. Tight 11px vertical padding.

### Primary Button (Filled)
**Role:** Main call-to-action

Deep Plum (#250835) background, white text, Manrope 600 14-16px. 12px border radius. Padding 8-10px vertical, 18px horizontal. Inset highlight via soft inner shadow or 1px lighter top edge. Often paired with a circular play/arrow icon button directly attached (Deep Plum circle with white arrow).

### Ghost / Outlined Button
**Role:** Secondary action

Transparent fill, 1px Dark Mauve (#473054) border, Dark Mauve text. Same 12px radius and 8-10px vertical / 18px horizontal padding as Primary. Manrope 500 14px.

### Pill Link with Arrow
**Role:** Inline navigation link

No background, text in Vivid Violet (#ab2fed) or Deep Plum, Manrope 500 14px, followed by a → chevron. Sits as the primary action inside feature cards. The arrow is the affordance — the link itself has no decoration.

### Hero Gradient Banner
**Role:** Hero section background

Full-bleed Plum-to-Pink gradient (#ba59ff → #ff59f1) as the hero canvas. Centered Agrandir 700 headline at 64-96px in white, Manrope 400 16-18px subhead in white, and a Deep Plum primary button below. A subtle grainy/textured overlay (sparse noise) runs across the gradient to give it a printed-paper feel.

### Product Preview Card
**Role:** Hero visual / product showcase

White surface, 16px border radius, sits overlapping the bottom of the hero. Contains the app UI screenshot with browser chrome (traffic-light dots, tab bar) at 8px top-radius. No drop shadow — contrast against the gradient does the lifting.

### Logo Cloud Band
**Role:** Social proof / customer logos

Full-bleed Aurora Gradient (#3ca1ff → violet → pink) section. White customer logos (Voyage, Mercado Libre, New Relic, Octopus Deploy, One Medical, Pendo) arranged in a single row, evenly spaced, ~40px height. No text labels — logos only.

### Feature Card
**Role:** Product feature showcase

White card, 16-40px border radius (larger cards push to 40-120px for visual variety). Internal padding 40px. Top half is a soft-tinted preview surface (Lavender Wash #decaff, Blush Bloom #e9bded, or Sky Mist #bbcfe4) at 8px radius with a miniature wireframe illustration. Below: Agrandir 700 24px title in Deep Plum, Manrope 400 14-16px description in Warm Gray Purple, and a Vivid Violet pill link with arrow. Soft drop shadow at rgba(37,8,53,0.06) 0 16px 32px -4px.

### Floating Pill Navigation
**Role:** In-app secondary nav (seen in product preview)

White pill (9999px radius) with Lavender Mist border, 1px. Contains Manrope 500 12-14px text in Deep Plum with small icons. Sits as an overlay element inside the product canvas.

### Icon Node (Product Canvas)
**Role:** Flowchart / diagram element

Small (16-24px) icons in Vivid Violet, Vivid Blue, or Electric Indigo. Filled style, 1-2px stroke weight. Used inside the product canvas to mark node types and toolbar actions.

### Share Button (In-App)
**Role:** Primary in-app action

Vivid Violet (#ab2fed) filled button, white text, Manrope 600 12-14px, 8-12px radius, small share icon prefix. The only chromatic filled button in the product UI — the violet is reserved for 'Share / publish / export' actions.

## Do's and Don'ts

### Do
- Use Deep Plum (#250835) for all primary buttons, nav borders, and headline text — it carries both the brand and the primary action role simultaneously.
- Set display headlines in Agrandir 700 at 48-96px with -0.01em letter-spacing. Do not use Agrandir below 24px.
- Use 12px radius on all buttons, nav pills, and inline links — this is the signature small radius that keeps the UI tight.
- Reserve Vivid Violet (#ab2fed) for inline links, share buttons, and product icons. Never use it for large backgrounds or hero fills.
- Use the Plum-to-Pink or Aurora gradient as full-bleed section backgrounds only — never as small accents or button fills.
- Apply shadows as rgba(37,8,53, x) — plum-tinted, never neutral gray. Keep opacity ≤0.2.
- Use Lavender Mist (#ebe6ee) for all default 1px borders and dividers — do not introduce #e5e5e5 or other neutral grays.

### Don't
- Do not use a sans-serif display font for headlines — Agrandir's wide, geometric character set is the signature; substituting a generic bold sans loses the brand.
- Do not fill hero or section backgrounds with flat solid colors — the gradient wash is what makes sections feel on-brand.
- Do not use vivid Violet as a background for body text or long-form copy — reserve it for short interactive elements.
- Do not introduce new border radii — the system lives at 8px (images), 12px (buttons/nav), 16px (cards), and 9999px (pills/badges).
- Do not use cool blue or neutral gray shadows — shadows must be plum-tinted (rgba(37,8,53,…)) to stay on-brand.
- Do not use pure black (#000000) for text or backgrounds — Deep Plum (#250835) is the darkest the system goes.
- Do not use Vivid Blue (#0283ec) for UI chrome outside the product canvas — it lives inside diagrams and icons, not on marketing pages.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#ffffff` | Page background, dominant canvas color across all sections |
| 1 | Soft Surface | `#f5f4f5` | Card surface slightly lifted from canvas |
| 2 | Lavender Border | `#ebe6ee` | Hairline borders, dividers, and low-contrast page texture |
| 3 | Highlight Wash | `#decaff` | Decorative card and heading highlight backgrounds |
| 4 | Gradient Field | `#e9bded` | Full-bleed gradient section backgrounds (plum-to-pink, aurora) |

## Elevation

- **Primary Button:** `rgba(37, 8, 53, 0.06) 0px 16px 32px -4px`
- **Ghost Link / Inline Action:** `rgba(37, 8, 53, 0.2) 0px 12px 16px -4px`

## Imagery

Product screenshots are the primary visual content — real UI captures of flowcharts, mind maps, and dashboards sit inside rounded-corner browser-chrome frames. Illustrations are minimal and wireframe-like: flat geometric shapes (rectangles, diamonds, cylinders for databases) in Vivid Violet, Vivid Blue, and Electric Indigo on white or light-tinted card surfaces. No photography, no 3D renders, no lifestyle imagery. Icons inside the product are filled, 1-2px stroke, multi-color (violet/blue/indigo palette). The hero uses a grainy noise texture overlay on the gradient to give it a printed-paper feel. Imagery density is moderate — each section gets one product preview or one feature card preview, never a wall of images.

## Layout

Max-width 1200px centered content with full-bleed gradient sections. Hero is a full-bleed gradient band (Plum-to-Pink) with centered Agrandir headline and a product preview card overlapping the bottom edge. Sections alternate: gradient hero → white canvas with centered display headline and subhead → 3-column feature card grid → full-bleed Aurora gradient logo band → another white section with text+image rows. Navigation is a sticky top bar with a centered nav cluster and right-aligned auth buttons. An announcement banner sits flush below the nav. Card grids use 3 columns at desktop, 1 column at mobile. Vertical rhythm is generous — ~80px between sections, ~40px internal card padding.

## Gradient System

Two signature gradients carry the brand's visual energy: (1) Plum-to-Pink (linear 142deg, #ba59ff → #ff59f1) for hero sections, and (2) Aurora (linear 97deg, #3ca1ff → #c852ff → #ff60f0) for logo bands and mid-page dividers. Both are full-bleed only — never used as button fills, card backgrounds, or inline accents. A subtle grainy noise texture overlays the gradient to add tactile depth without competing with the product preview.

## Agent Prompt Guide

**Quick Color Reference**
- text: #250835 (Deep Plum)
- background: #ffffff
- border: #ebe6ee (Lavender Mist)
- accent: #ab2fed (Vivid Violet)
- primary action: #250835 (filled action)
- gradient: linear-gradient(97deg, #3ca1ff, #c852ff, #ff60f0)

**3-5 Example Component Prompts**
1. Create a hero section: Plum-to-Pink gradient background (#ba59ff → #ff59f1). Headline at 96px Agrandir weight 700, white, letter-spacing -0.96px. Subhead at 16px Manrope weight 400, white. Primary CTA: Deep Plum (#250835) fill, white text, 12px radius, 8px 18px padding, with a circular white-arrow icon button attached. Product preview card overlapping the bottom: white surface, 16px radius, browser-chrome screenshot inside.
2. Create a feature card: white background, 16px radius, 40px padding. Top half: Lavender Wash (#decaff) inner surface at 8px radius with a wireframe illustration using Vivid Violet (#ab2fed) and Vivid Blue (#0283ec) elements. Title at 24px Agrandir 700, #250835. Description at 14px Manrope 400, #6a5b72. Below: a Vivid Violet (#ab2fed) pill link with → arrow, Manrope 500 14px. Soft shadow: rgba(37,8,53,0.06) 0 16px 32px -4px.
3. Create the top nav: white background, 1px Lavender Mist (#ebe6ee) bottom border. Logo (32px) left, nav links (Manrope 500 14px, #250835) centered, and right side has 'Contact sales' text link + 'Log in' text link + 'Sign up' Deep Plum filled button (12px radius, 8px 18px padding, Manrope 600 14px, white text). Max-width 1200px centered, 18px horizontal padding.
4. Create a logo cloud band: full-bleed Aurora gradient background (linear 97deg, #3ca1ff → #c852ff → #ff60f0). White customer logos (40px height) arranged in a single evenly-spaced row, no text labels.
5. Create an announcement banner: full-width band, white background, 1px Lavender Mist border, 9999px radius. Content: 'NEW' badge (Deep Plum fill, white text, 9999px radius, 10px Manrope 600, 1.5px letter-spacing) + body text (Manrope 500 14px, #250835) + sparkle icon.

## Similar Brands

- **Pitch** — Same approach: light canvas, single deep brand color for primary actions, one vivid accent for interactive elements, and large custom display headlines floating over generous whitespace.
- **Linear** — Similar monochrome discipline with a single dominant brand color doing structural work, though Linear goes dark-mode where Whimsical stays light.
- **Figma** — Shared product-canvas aesthetic with multi-color accent palette (violet/blue/pink) for diagram elements and a light, airy marketing site.
- **Notion** — Light surface with dark text, minimal color in chrome, and feature card grids with soft shadows and rounded corners.

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-deep-plum: #250835;
  --color-dark-mauve: #473054;
  --color-vivid-violet: #ab2fed;
  --color-vivid-blue: #0283ec;
  --color-electric-indigo: #4b38ee;
  --color-warm-gray-purple: #6a5b72;
  --color-lavender-mist: #ebe6ee;
  --color-soft-white: #f5f4f5;
  --color-plum-shadow: #cdc7d1;
  --color-lavender-wash: #decaff;
  --color-blush-bloom: #e9bded;
  --color-sky-mist: #bbcfe4;
  --color-plum-to-pink-wash: #ba59ff;
  --gradient-plum-to-pink-wash: linear-gradient(142deg, rgb(186, 89, 255) 0%, rgb(186, 89, 255) 30%, rgb(255, 89, 241) 100%);
  --color-aurora-gradient: #3ca1ff;
  --gradient-aurora-gradient: linear-gradient(97deg, rgb(60, 161, 255) 5.54%, rgb(200, 82, 255) 49.85%, rgb(255, 96, 240) 94.14%);

  /* Typography — Font Families */
  --font-agrandir: 'Agrandir', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-manrope: 'Manrope', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-label: 10px;
  --leading-label: 1.2;
  --tracking-label: 1.5px;
  --text-caption: 12px;
  --leading-caption: 1.2;
  --tracking-caption: 0.24px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.4;
  --text-body: 16px;
  --leading-body: 1.4;
  --text-subheading: 24px;
  --leading-subheading: 1.2;
  --tracking-subheading: -0.24px;
  --text-heading-sm: 32px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -0.32px;
  --text-heading: 48px;
  --leading-heading: 1.1;
  --tracking-heading: -0.48px;
  --text-heading-lg: 64px;
  --leading-heading-lg: 1.05;
  --tracking-heading-lg: -0.64px;
  --text-display: 96px;
  --leading-display: 1;
  --tracking-display: -0.96px;

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
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-60: 60px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-120: 120px;
  --spacing-160: 160px;
  --spacing-180: 180px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 40px;
  --element-gap: 16px;

  /* Border Radius */
  --radius-sm: 0.5px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-3xl: 40px;
  --radius-full: 80px;
  --radius-full-2: 120px;
  --radius-full-3: 160px;

  /* Named Radii */
  --radius-nav: 12px;
  --radius-cards: 16px;
  --radius-links: 12px;
  --radius-badges: 9999px;
  --radius-images: 8px;
  --radius-buttons: 12px;
  --radius-featurecards: 40-120px;

  /* Shadows */
  --shadow-xl: rgba(37, 8, 53, 0.06) 0px 16px 32px -4px;
  --shadow-md: rgba(37, 8, 53, 0.2) 0px 12px 16px -4px;

  /* Surfaces */
  --surface-canvas: #ffffff;
  --surface-soft-surface: #f5f4f5;
  --surface-lavender-border: #ebe6ee;
  --surface-highlight-wash: #decaff;
  --surface-gradient-field: #e9bded;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-deep-plum: #250835;
  --color-dark-mauve: #473054;
  --color-vivid-violet: #ab2fed;
  --color-vivid-blue: #0283ec;
  --color-electric-indigo: #4b38ee;
  --color-warm-gray-purple: #6a5b72;
  --color-lavender-mist: #ebe6ee;
  --color-soft-white: #f5f4f5;
  --color-plum-shadow: #cdc7d1;
  --color-lavender-wash: #decaff;
  --color-blush-bloom: #e9bded;
  --color-sky-mist: #bbcfe4;
  --color-plum-to-pink-wash: #ba59ff;
  --color-aurora-gradient: #3ca1ff;

  /* Typography */
  --font-agrandir: 'Agrandir', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-manrope: 'Manrope', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-label: 10px;
  --leading-label: 1.2;
  --tracking-label: 1.5px;
  --text-caption: 12px;
  --leading-caption: 1.2;
  --tracking-caption: 0.24px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.4;
  --text-body: 16px;
  --leading-body: 1.4;
  --text-subheading: 24px;
  --leading-subheading: 1.2;
  --tracking-subheading: -0.24px;
  --text-heading-sm: 32px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -0.32px;
  --text-heading: 48px;
  --leading-heading: 1.1;
  --tracking-heading: -0.48px;
  --text-heading-lg: 64px;
  --leading-heading-lg: 1.05;
  --tracking-heading-lg: -0.64px;
  --text-display: 96px;
  --leading-display: 1;
  --tracking-display: -0.96px;

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
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-120: 120px;
  --spacing-160: 160px;
  --spacing-180: 180px;

  /* Border Radius */
  --radius-sm: 0.5px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-3xl: 40px;
  --radius-full: 80px;
  --radius-full-2: 120px;
  --radius-full-3: 160px;

  /* Shadows */
  --shadow-xl: rgba(37, 8, 53, 0.06) 0px 16px 32px -4px;
  --shadow-md: rgba(37, 8, 53, 0.2) 0px 12px 16px -4px;
}
```
