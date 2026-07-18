# Wrike — Style Reference
> Lime switch on a clean engineer's console — vivid green accents powered against deep navy authority, floating on white.

**Theme:** light

Wrike's design language is built on a stark white canvas punctuated by a single vivid lime green that acts as a power switch across the interface. The system uses a deep midnight navy for authority text and dark sections, with cool blue-gray neutrals providing soft surface separation rather than warm grays or heavy shadows. Typography is carried by TT Norms Pro at comfortable 4px-grid spacing, with weight 700 headlines that command attention against whisper-thin 400 body text. Components are pill-shaped (40px radius) and card-soft (20px radius), using one signature shadow recipe that floats product mockups off the page. The overall feel is enterprise-confident but energetic — a work-management tool that looks like a productivity OS, not a form.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Signal Green | `linear-gradient(to left, rgb(0, 153, 128), rgb(0, 178, 89), rgb(0, 224, 92), rgb(0, 178, 89), rgb(0, 153, 128))` | `--color-signal-green` | Green supporting accent for decorative details and low-frequency emphasis. Do not promote it to the primary CTA color; Decorative geometric shapes, radial glow accents in dark sections, gradient endpoints |
| Midnight Navy | `#162136` | `--color-midnight-navy` | Headlines, primary body text, navigation, dark footer sections — the structural anchor of the entire hierarchy |
| Slate Navy | `#2b3a57` | `--color-slate-navy` | Secondary headings, card titles, muted dark text — a softened navy for sub-hierarchy |
| Steel Blue-Gray | `#657694` | `--color-steel-blue-gray` | Helper text, secondary copy, muted labels, dropdown menus — the cool-toned equivalent of mid-gray |
| Mist Blue | `#bfc7d9` | `--color-mist-blue` | Hairline borders, dividers, input borders, subtle separators |
| Carbon | `#000000` | `--color-carbon` | Icon strokes, high-contrast text, SVG fills, decorative geometric accents |
| Paper White | `#ffffff` | `--color-paper-white` | Page canvas, card surfaces, inverse text on dark, input fills |
| Frost Surface | `#f2f5fa` | `--color-frost-surface` | Feature card backgrounds, subtle wash sections, ghost button hovers — the softest cool tint |
| Halo Blue-Gray | `#c1c9d8` | `--color-halo-blue-gray` | Shadow tones, elevated surface edges, decorative background shapes |
| Link Blue | `#0073d3` | `--color-link-blue` | Blue supporting accent for decorative details and low-frequency emphasis. Do not promote it to the primary CTA color |
| Smoke Gray | `#737a86` | `--color-smoke-gray` | Disabled button states, inactive controls, de-emphasized metadata |

## Tokens — Typography

### TT Norms Pro — Single-family system for all UI. Weight 700 for headlines and CTAs (commands attention on white), weight 600 for subheadings and button labels, weight 400 for body and descriptions. Tabular numerals (tnum) enabled for data-heavy product mockups; stylistic alternates ss01–ss04, ss06 active for refined letterforms in display sizes. The 0.125em letter-spacing on 12–13px all-caps creates the uppercase eyebrow pattern ('3+ HOURS', 'TRUSTED BY 20,000+ HAPPY CUSTOMERS WORLDWIDE') that structures every section. · `--font-tt-norms-pro`
- **Substitute:** Inter or DM Sans
- **Weights:** 400, 600, 700
- **Sizes:** 12, 13, 14, 16, 18, 20, 24, 32, 48, 64
- **Line height:** 1.10–2.00 (tight 1.10–1.20 for display, 1.38–1.50 for body, 2.00 for spacious eyebrows)
- **Letter spacing:** 0.125em for uppercase eyebrows at 12-13px, 0.013-0.014em for body and small headings
- **OpenType features:** `"ss01", "ss02", "ss03", "ss04", "ss06", "tnum"`
- **Role:** Single-family system for all UI. Weight 700 for headlines and CTAs (commands attention on white), weight 600 for subheadings and button labels, weight 400 for body and descriptions. Tabular numerals (tnum) enabled for data-heavy product mockups; stylistic alternates ss01–ss04, ss06 active for refined letterforms in display sizes. The 0.125em letter-spacing on 12–13px all-caps creates the uppercase eyebrow pattern ('3+ HOURS', 'TRUSTED BY 20,000+ HAPPY CUSTOMERS WORLDWIDE') that structures every section.

### Arial — Arial — detected in extracted data but not described by AI · `--font-arial`
- **Weights:** 600
- **Sizes:** 13px
- **Line height:** 1.2
- **Role:** Arial — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.6 | 0.125px | `--text-caption` |
| body-sm | 14px | 1.4 | 0.014px | `--text-body-sm` |
| body | 16px | 1.5 | 0.013px | `--text-body` |
| subheading | 18px | 1.4 | 0.013px | `--text-subheading` |
| heading-sm | 20px | 1.38 | 0.014px | `--text-heading-sm` |
| heading | 24px | 1.3 | 0.013px | `--text-heading` |
| heading-lg | 32px | 1.25 | — | `--text-heading-lg` |
| display | 48px | 1.2 | — | `--text-display` |
| hero | 64px | 1.1 | — | `--text-hero` |

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
| 36 | 36px | `--spacing-36` |
| 48 | 48px | `--spacing-48` |
| 60 | 60px | `--spacing-60` |
| 64 | 64px | `--spacing-64` |
| 68 | 68px | `--spacing-68` |
| 112 | 112px | `--spacing-112` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 20px |
| pills | 9999px |
| small | 4px |
| inputs | 8px |
| buttons | 40px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| xl | `rgba(24, 31, 56, 0.25) 0px 25px 45px -45px` | `--shadow-xl` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80-120px
- **Card padding:** 32-40px
- **Element gap:** 12-24px

## Components

### Primary CTA Button
**Role:** Main conversion action across hero, section CTAs, and footer

Filled Signal Green (#00e05c) background, white text, TT Norms Pro weight 600 at 16px, 40px pill radius, 14px 28px padding. The vivid green against pure white makes it impossible to miss. Used for 'Try Wrike for free' everywhere.

### Ghost Text Button
**Role:** Secondary action below primary CTA (e.g. 'Discover Wrike in 3 minutes')

No background, no border. Link Blue (#0073d3) text at 14-16px weight 400, paired with a small icon (play triangle, arrow). 8px padding. Sits directly under the primary CTA as a low-pressure alternative.

### Top Announcement Bar
**Role:** Time-sensitive promo strip above the nav

Full-bleed Signal Green (#00e05c) background, black or dark navy text at 13px weight 600, centered. 8-10px vertical padding. Lightning-bolt icon prefix. Appears only when a campaign is active.

### Navigation Bar
**Role:** Primary site navigation with logo and utility links

White background, no visible border bottom, sits on the white canvas. Wrike green checkmark wordmark left, nav links (Solutions, Product, Why Wrike?, Resources, Enterprise, Pricing) in Midnight Navy at 16px weight 400 with dropdown chevrons. Right cluster: 'Contact Sales' text link, language selector ('EN'), 'Log in' text, then filled Primary CTA. The single signature shadow rgba(24, 31, 56, 0.25) 0px 25px 45px -45px may apply on scroll.

### Feature Card
**Role:** Three-column feature block in AI section and similar grids

White background, 20px radius, no visible border. Card padding 32-40px internal. Eyebrow ('3+ HOURS') in uppercase 13px letter-spacing 0.125em weight 600 muted blue. Heading in Midnight Navy weight 700 at 20-24px. Body in Steel Blue-Gray #657694 at 14-16px weight 400. Green link text with right-arrow affordance. Bottom half contains a photo or illustration with floating green icon badges overlaid.

### Hero Section
**Role:** Above-the-fold landing

Full-bleed white background, max-width 1200px content. Two-column layout: left half has a 64px hero headline in Midnight Navy weight 700 (line-height 1.10) with one keyword highlighted in Signal Green, supporting body in Steel Blue-Gray, then Primary CTA + Ghost button stack. Right half shows a product mockup (dashboard UI) floating with the signature shadow rgba(24, 31, 56, 0.25) 0px 25px 45px -45px.

### Product Mockup
**Role:** Dashboard/UI screenshot rendered as a floating element

White card with 12-20px radius, floating via the signature shadow rgba(24, 31, 56, 0.25) 0px 25px 45px -45px. Internal content shows Kanban boards, charts, avatars, and project data in full color. Sometimes slightly rotated or offset to feel alive.

### Dark CTA Footer Section
**Role:** Final conversion band before page end

Full-bleed Midnight Navy #162136 background. Decorative green geometric shapes (triangles, pill blobs, glow circles) float on the edges as brand energy. Centered white headline weight 700 at 32-48px. Sub-copy in muted lighter navy. Email input (white fill, 8px radius, 14px placeholder) paired inline with Primary CTA. Star rating row below.

### Email Input + Button Combo
**Role:** Lead capture in the dark footer section

Horizontal flex row. Input: white background, 8px radius, 1px Mist Blue border, 14px placeholder in Steel Blue-Gray, 12-16px vertical padding. Button: same Primary CTA, 8px radius variant (not pill) to nest against the input edge.

### Client Logo Strip
**Role:** Social proof band below hero

White background, centered uppercase eyebrow 'TRUSTED BY 20,000+ HAPPY CUSTOMERS WORLDWIDE' at 13px letter-spacing 0.125em in muted gray. Row of 7-8 grayscale client logos at uniform height, evenly spaced. Logos are rendered in #000000 or muted navy with no color highlights.

### Award Badge
**Role:** Third-party recognition (G2, TrustRadius, Capterra)

Colorful shield/ribbon-shaped badge with multi-color gradient fills, 80-100px tall, centered above a caption label in Midnight Navy. Appears in a 3-column grid.

### Floating Icon Badge
**Role:** Small decorative icon overlaid on feature card photos

8-12px radius square or circle, Signal Green or white fill with green icon, semi-transparent backdrop. Overlaps the bottom corner of feature card photos to add brand color energy to otherwise neutral imagery.

## Do's and Don'ts

### Do
- Use Signal Green #00e05c as the ONLY chromatic accent in the interface — no secondary brand colors, no red error states rendered in chromatic red (use navy or muted gray for errors)
- Apply 40px pill radius to all standalone buttons; use 8px radius only on the email-capture button nested against an input
- Use the single shadow recipe rgba(24,31,56,0.25) 0px 25px 45px -45px for product mockups and sticky nav — never stack multiple shadows
- Highlight exactly one word in Signal Green within any hero or section headline (e.g. 'One platform', 'Wrike AI') — the green keyword is the visual anchor
- Set all eyebrows to uppercase 12-13px with letter-spacing 0.125em in Steel Blue-Gray #657694 to create the section-rhythm pattern
- Use Frost Surface #f2f5fa for feature card backgrounds and subtle section washes — never use it as a page background
- Keep the final CTA section dark navy #162136 with Signal Green geometric decorations as the page's energy release

### Don't
- Do not introduce a second accent color (no purple, no orange, no teal) — the system is monochromatic plus one green
- Do not use square or sharp-cornered buttons — pill radius is signature
- Do not stack multiple shadow recipes or add inner shadows — one shadow recipe only
- Do not render the dark CTA section in any color other than #162136 — light or mid-gray breaks the final-section contrast
- Do not use warm grays or beige neutrals — the entire neutral palette is cool blue-gray
- Do not use full-bleed photography as a hero — the product UI mockup is always the visual hero
- Do not render the Signal Green CTA in any variant other than a fully filled pill — no outlined green, no ghost green, no green text-only

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Page Canvas | `#ffffff` | Default page background |
| 1 | Frost Card | `#f2f5fa` | Feature cards, subtle section washes |
| 2 | Dark Stage | `#162136` | Final CTA section, dark-mode contrast band |
| 3 | Signal Layer | `#00e05c` | CTA fills, announcement bar, active state fills |

## Elevation

- **Product mockup cards:** `rgba(24, 31, 56, 0.25) 0px 25px 45px -45px`
- **Sticky navigation:** `rgba(24, 31, 56, 0.25) 0px 25px 45px -45px`

## Imagery

Photography appears only inside feature cards: real human shots of people at laptops, in meetings, in office contexts. Photos are treated as contained rectangles inside white cards, never full-bleed, and always overlaid with small floating green icon badges in the corners to inject brand color. No lifestyle hero photography — the product UI mockup IS the hero visual. Decorative geometric shapes (triangles, pill blobs, glows) appear in the dark footer section in Signal Green as brand energy. Icons are minimal: outlined or single-color flat, no 3D, no gradients, paired with green when interactive.

## Layout

Max-width 1200px centered container. Hero is a two-column split (text left, product mockup right) on white. Sections are full-bleed white bands stacked vertically with 80-120px vertical gaps, no alternating dark/light rhythm until the final CTA section which is a full-bleed dark navy band. Feature sections use 3-column card grids with equal widths. Content blocks are centered stacks with 2-column text+image alternating. Navigation is a single horizontal top bar, sticky on scroll, with no sidebar. Density is comfortable — generous padding inside cards, wide vertical breathing room between sections, never cramped.

## Agent Prompt Guide

**Quick Color Reference**
- text (primary): #162136 Midnight Navy
- text (muted): #657694 Steel Blue-Gray
- background (page): #ffffff Paper White
- background (card): #f2f5fa Frost Surface
- border: #bfc7d9 Mist Blue
- accent: #00e05c Signal Green
- primary action: no distinct CTA color

**3-5 Example Component Prompts**

No distinct primary action color was observed; use the extracted neutral button treatments instead of inventing a filled CTA color.

2. **Build a feature card**: White #ffffff background, 20px border-radius, 32px internal padding. Top: uppercase eyebrow '3+ HOURS' at 13px weight 600 letter-spacing 0.125em in #657694. Middle: heading at 24px weight 700 in #162136, then body at 16px weight 400 in #657694. Below body: a Link Blue #0073d3 text link with right-arrow at 16px. Bottom half: a 16:9 photo with a floating 10px-radius green (#00e05c) icon badge overlapping the bottom-left corner.



5. **Build a client logo strip**: White #ffffff background, centered. Eyebrow text 'TRUSTED BY 20,000+ HAPPY CUSTOMERS WORLDWIDE' at 13px weight 600 letter-spacing 0.125em in #657694, uppercase. Below: a single row of 8 grayscale client logos (rendered in #000000 or muted #2b3a57), each ~80px tall, evenly spaced with 40-60px gaps between them.

## Signature Choices

Three choices define Wrike's visual identity and would not appear in a generic SaaS system:

1. **Single-shade lime green as the only chromatic accent.** Every other color in the system is achromatic, near-gray, or navy. This makes the green on CTAs and the brand wordmark feel like a power switch — it only appears where the brand needs you to act. Using two accents (e.g. a blue and a green) would dilute this.

2. **Pill-shaped buttons at 40px radius.** Most enterprise SaaS uses 4-8px radius on buttons. Wrike pushes to 40px — nearly full-pill. Combined with the vivid green fill, the CTA reads as friendly and decisive, not corporate. The 8px-radius variant only appears on the email-capture button nested against the input.

3. **One shadow recipe for all elevation.** rgba(24,31,56,0.25) 0px 25px 45px -45px is the only shadow in the system. Used on product mockups and the sticky nav. Negative spread (-45px) means the shadow only appears at the bottom edge, giving a 'floating sheet' feel without haloing around all sides. Other systems use 3-5 shadow tiers; Wrike uses one.

## Similar Brands

- **Notion** — Same near-monochrome palette with a single vivid accent and pill-shaped CTAs; product mockups as hero visuals
- **Asana** — Same enterprise-SaaS white canvas with cool blue-gray neutrals, generous card padding, and structured 3-column feature grids
- **Linear** — Same restraint with a single signature accent color used sparingly for active states and CTAs, plus a deep navy inverse section for final CTAs
- **ClickUp** — Same competitive work-management positioning with bright green brand color, product mockup heroes, and award-badge social proof strips
- **Monday.com** — Same vivid accent-on-white SaaS pattern with rounded card components, feature grid sections, and dark-mode final CTA bands

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-signal-green: #00e05c;
  --gradient-signal-green: linear-gradient(to left, rgb(0, 153, 128), rgb(0, 178, 89), rgb(0, 224, 92), rgb(0, 178, 89), rgb(0, 153, 128));
  --color-midnight-navy: #162136;
  --color-slate-navy: #2b3a57;
  --color-steel-blue-gray: #657694;
  --color-mist-blue: #bfc7d9;
  --color-carbon: #000000;
  --color-paper-white: #ffffff;
  --color-frost-surface: #f2f5fa;
  --color-halo-blue-gray: #c1c9d8;
  --color-link-blue: #0073d3;
  --color-smoke-gray: #737a86;

  /* Typography — Font Families */
  --font-tt-norms-pro: 'TT Norms Pro', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.6;
  --tracking-caption: 0.125px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.4;
  --tracking-body-sm: 0.014px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: 0.013px;
  --text-subheading: 18px;
  --leading-subheading: 1.4;
  --tracking-subheading: 0.013px;
  --text-heading-sm: 20px;
  --leading-heading-sm: 1.38;
  --tracking-heading-sm: 0.014px;
  --text-heading: 24px;
  --leading-heading: 1.3;
  --tracking-heading: 0.013px;
  --text-heading-lg: 32px;
  --leading-heading-lg: 1.25;
  --text-display: 48px;
  --leading-display: 1.2;
  --text-hero: 64px;
  --leading-hero: 1.1;

  /* Typography — Weights */
  --font-weight-regular: 400;
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
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-36: 36px;
  --spacing-48: 48px;
  --spacing-60: 60px;
  --spacing-64: 64px;
  --spacing-68: 68px;
  --spacing-112: 112px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80-120px;
  --card-padding: 32-40px;
  --element-gap: 12-24px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 20px;
  --radius-3xl: 24px;
  --radius-3xl-2: 30px;
  --radius-3xl-3: 40px;

  /* Named Radii */
  --radius-cards: 20px;
  --radius-pills: 9999px;
  --radius-small: 4px;
  --radius-inputs: 8px;
  --radius-buttons: 40px;

  /* Shadows */
  --shadow-xl: rgba(24, 31, 56, 0.25) 0px 25px 45px -45px;

  /* Surfaces */
  --surface-page-canvas: #ffffff;
  --surface-frost-card: #f2f5fa;
  --surface-dark-stage: #162136;
  --surface-signal-layer: #00e05c;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-signal-green: #00e05c;
  --color-midnight-navy: #162136;
  --color-slate-navy: #2b3a57;
  --color-steel-blue-gray: #657694;
  --color-mist-blue: #bfc7d9;
  --color-carbon: #000000;
  --color-paper-white: #ffffff;
  --color-frost-surface: #f2f5fa;
  --color-halo-blue-gray: #c1c9d8;
  --color-link-blue: #0073d3;
  --color-smoke-gray: #737a86;

  /* Typography */
  --font-tt-norms-pro: 'TT Norms Pro', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.6;
  --tracking-caption: 0.125px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.4;
  --tracking-body-sm: 0.014px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: 0.013px;
  --text-subheading: 18px;
  --leading-subheading: 1.4;
  --tracking-subheading: 0.013px;
  --text-heading-sm: 20px;
  --leading-heading-sm: 1.38;
  --tracking-heading-sm: 0.014px;
  --text-heading: 24px;
  --leading-heading: 1.3;
  --tracking-heading: 0.013px;
  --text-heading-lg: 32px;
  --leading-heading-lg: 1.25;
  --text-display: 48px;
  --leading-display: 1.2;
  --text-hero: 64px;
  --leading-hero: 1.1;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-36: 36px;
  --spacing-48: 48px;
  --spacing-60: 60px;
  --spacing-64: 64px;
  --spacing-68: 68px;
  --spacing-112: 112px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 20px;
  --radius-3xl: 24px;
  --radius-3xl-2: 30px;
  --radius-3xl-3: 40px;

  /* Shadows */
  --shadow-xl: rgba(24, 31, 56, 0.25) 0px 25px 45px -45px;
}
```
