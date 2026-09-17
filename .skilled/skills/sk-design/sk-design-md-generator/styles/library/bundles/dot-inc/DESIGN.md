# Dot Inc. — Style Reference
> white laboratory with a single orange spark

**Theme:** light

Dot Inc. operates a precise, near-monochrome visual system anchored by pure white surfaces and a single high-saturation orange accent that acts as functional punctuation. The interface is spacious, typographically confident, and relies on Plus Jakarta Sans at varying weights to create hierarchy without color noise. Every container, image, and card carries a generous 20-30px radius — the softness is the brand's tactile signature, echoing the braille dot product itself. Components are flat, borders are hairline, and the single shadow token is reserved for the primary action button. Color appears only when the system needs you to do something.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Ember Orange | `#ff5a2f` | `--color-ember-orange` | Primary action buttons, active badges, accent borders — the system's only chromatic voice, used to signal interactivity and emphasis |
| Ember Orange (link variant) | `#f15b2b` | `--color-ember-orange-link-variant` | Orange text accent for links, tags, and emphasized short phrases. Do not promote it to the primary CTA color |
| Carbon Black | `#000000` | `--color-carbon-black` | Primary text, icons, image overlays, card headings — maximum contrast against white canvas |
| Graphite | `#1f1f1f` | `--color-graphite` | Headings, body emphasis, dark surface alternative — slightly softened black for large display text |
| Slate Dark | `#333333` | `--color-slate-dark` | List items, secondary body text, card content |
| Stone | `#555555` | `--color-stone` | Navigation labels, subdued body text |
| Pewter | `#707070` | `--color-pewter` | Muted descriptions, inactive list items, heading borders |
| Steel | `#a5a5a5` | `--color-steel` | Disabled or decorative text |
| Mist | `#b7bfc1` | `--color-mist` | Card borders, subtle button shadows — cool-tinted gray that defines container edges |
| Cloud | `#cbcbcb` | `--color-cloud` | Alternate card backgrounds, disabled surfaces |
| Fog | `#dddddd` | `--color-fog` | Neutral secondary button fill, placeholder surfaces |
| Paper | `#e5e7eb` | `--color-paper` | Hairline dividers, borders across all contexts — the structural neutral that separates sections |
| Pearl | `#f5f5f5` | `--color-pearl` | Card surfaces, subtle backgrounds, alternate section bands |
| Canvas White | `#ffffff` | `--color-canvas-white` | Page background, nav surface, card fill, button text — the dominant canvas |

## Tokens — Typography

### Plus Jakarta Sans — Sole typeface for all text — body, headings, nav, buttons, badges, icons. The wide weight range (300–800) carries the entire visual hierarchy; display sizes reach 80px at weight 300 for a light, expansive headline, while UI text sits at 14-16px weight 400-500 · `--font-plus-jakarta-sans`
- **Substitute:** Inter, DM Sans
- **Weights:** 300, 400, 500, 600, 700, 800
- **Sizes:** 12, 14, 15, 16, 18, 20, 22, 24, 30, 32, 40, 46, 50, 60, 80
- **Line height:** 1.34, 1.40, 1.45, 1.50, 1.60, 1.64, 1.78, 1.80
- **Letter spacing:** normal
- **Role:** Sole typeface for all text — body, headings, nav, buttons, badges, icons. The wide weight range (300–800) carries the entire visual hierarchy; display sizes reach 80px at weight 300 for a light, expansive headline, while UI text sits at 14-16px weight 400-500

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.6 | — | `--text-caption` |
| body-sm | 14px | 1.5 | — | `--text-body-sm` |
| body | 16px | 1.64 | — | `--text-body` |
| subheading | 20px | 1.5 | — | `--text-subheading` |
| heading-sm | 24px | 1.45 | — | `--text-heading-sm` |
| heading | 32px | 1.4 | — | `--text-heading` |
| heading-lg | 50px | 1.34 | — | `--text-heading-lg` |
| display | 80px | 1.34 | — | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** spacious

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
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 60 | 60px | `--spacing-60` |
| 80 | 80px | `--spacing-80` |
| 120 | 120px | `--spacing-120` |
| 208 | 208px | `--spacing-208` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 30px |
| cards | 20px |
| badges | 20px |
| images | 12-20px |
| buttons | 30px |
| headings | 100px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| md | `rgba(0, 0, 0, 0.25) 0px 4px 10px 0px` | `--shadow-md` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 40px
- **Element gap:** 24px

## Components

### Primary CTA Button (Ember Fill)
**Role:** Main call-to-action — 'Find a Reseller' style

Filled #ff5a2f background, white text, Plus Jakarta Sans 16px weight 500, padding 14px 24px, border-radius 30px. Carries the single shadow token: rgba(0,0,0,0.25) 0px 4px 10px 0px. This is the only component in the system with elevation.

### Secondary Ghost Button
**Role:** Companion action — 'Request a Demo' style

Transparent or #f5f5f5 background, #333333 text, no border, border-radius 30px, padding 14px 24px, Plus Jakarta Sans 16px weight 500. Sits alongside the Ember CTA as a lower-commitment alternative.

### Neutral Pill Button
**Role:** Tertiary or disabled action

#dddddd background, #333333 text, border-radius 30px, padding 14px 24px. Used for inactive or low-priority controls.

### Bordered Card
**Role:** Product content container

White or #f5f5f5 background, 1px #e5e7eb border, border-radius 20px, padding 40px. No shadow. Internal content uses 20-24px gaps.

### Shadowed Card (elevated)
**Role:** Featured product showcase

White background, border-radius 20px, no border, subtle shadow. Used sparingly to differentiate hero content blocks from standard cards.

### Hero Banner
**Role:** Full-width dark product showcase strip

Dark photographic background (near-black), centered white headline at 46-50px weight 300, white subtext at 18px weight 400, border-radius 20px on the container. Creates the single dramatic moment on a product page.

### Section Heading
**Role:** Page section title

Plus Jakarta Sans 40-50px weight 300-400, #1f1f1f or #000000, line-height 1.34. Frequently paired with a 18-20px weight 400 subheading in #333333.

### Badge (Ember Outline)
**Role:** Tag or category label

Transparent background, 1px #ff5a2f border, #ff5a2f text, Plus Jakarta Sans 12-14px weight 500, padding 4-6px 14px, border-radius 20px. Pill-shaped, thin stroke — the accent color in micro-form.

### Top Navigation Bar
**Role:** Site-wide primary navigation

White background, no visible border separator, padding 15-21px vertical. Logo left in Plus Jakarta Sans 24-30px weight 400, nav links in 16px weight 500 #555555, utility items (Partner Alliance, Language) right-aligned in 16px #333333 with globe icon in #ff5a2f.

### Breadcrumb
**Role:** Page location indicator

Plus Jakarta Sans 14px weight 400, #707070 text, separated by chevron arrows. Sits directly below the nav bar with 15px vertical padding.

### Rounded Image Container
**Role:** Product photography frame

Image clipped to 20px border-radius, no border. Photography is high-contrast, often on dark backgrounds to create product hero moments.

### Text Link
**Role:** Inline hyperlink

#f15b2b color, no underline by default, Plus Jakarta Sans inheriting size, weight 500. Inline within body copy.

## Do's and Don'ts

### Do
- Use #ff5a2f exclusively for primary action buttons and active state accents — it should appear on no more than 3-5 elements per viewport.
- Set border-radius to 20px for cards and images, 30px for buttons and badges, and 12-20px for inline images.
- Use Plus Jakarta Sans weight 300 or 400 for headlines 40px and above to maintain the light, spacious typographic feel.
- Apply 1px #e5e7eb borders for all card and section dividers — never use heavier borders or decorative lines.
- Space sections with 80px vertical gaps and use 24px for inter-element gaps within cards and lists.
- Keep backgrounds white (#ffffff) as the default canvas; use #f5f5f5 only for alternating content bands or subtle card elevation.
- Reserve the shadow token rgba(0,0,0,0.25) 0px 4px 10px 0px for the single primary CTA button per view.

### Don't
- Do not introduce additional chromatic colors — the system's identity depends on the 2% colorfulness ceiling.
- Do not use border-radius below 8px for any interactive element; the soft, rounded geometry is a core brand trait.
- Do not apply shadows to cards, images, or navigation — only the primary CTA may have elevation.
- Do not use #000000 for body text at sizes above 20px; switch to #1f1f1f for large headings to avoid harshness.
- Do not use bold (weight 700-800) for body or heading text — reserve weights 700-800 for short labels or tags only.
- Do not create flat hard-edged rectangular blocks; every container needs 20-30px radius.
- Do not use gradients — the system is entirely flat with single solid color fills.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#ffffff` | Page background, dominant surface |
| 1 | Pearl | `#f5f5f5` | Card fills, alternate section bands |
| 2 | Cloud | `#cbcbcb` | Disabled or secondary surface tint |
| 3 | Stone Dark | `#aeaeae` | Nav utility bar background |

## Elevation

- **Primary CTA Button:** `rgba(0, 0, 0, 0.25) 0px 4px 10px 0px`

## Imagery

Product photography dominates: the Dot Pad X device is shown in dramatic dark/nighttime settings with shallow depth of field, creating contrast against the otherwise white interface. Images are contained in 20px-radius frames. No illustrations, no abstract graphics, no lifestyle photography — the product IS the hero. Iconography is minimal: a globe icon for language, a chevron for breadcrumbs, and an external-link arrow, all rendered in single-stroke outlined style at 16-20px.

## Layout

Max-width 1200px centered content with full-bleed hero banners. The page follows a vertical scroll rhythm: white nav → breadcrumb → full-bleed dark hero with centered title → white product detail section with 2-column layout (image left, text right) → full-bleed dark secondary image band → alternating white/light-gray content sections. Section gaps are generous (80px) creating breathing room between blocks. Content within sections uses 2-column or centered single-column arrangements. Navigation is a single horizontal bar with left-aligned logo and right-aligned utility links, no sticky behavior visible.

## Agent Prompt Guide

**Quick Color Reference**
- Text: #1f1f1f (headings) / #333333 (body) / #707070 (muted)
- Background: #ffffff (page) / #f5f5f5 (cards)
- Border: #e5e7eb (hairline) / #b7bfc1 (card outline)
- Accent: #ff5a2f (Ember Orange — CTA fill, badges, active states)
- primary action: #ff5a2f (filled action)

**Example Component Prompts**
1. Build a primary CTA button: 30px border-radius, #ff5a2f background, white text, Plus Jakarta Sans 16px weight 500, padding 14px 24px, shadow rgba(0,0,0,0.25) 0px 4px 10px 0px. Use as 'Find a Reseller'.
2. Build a product hero banner: full-bleed dark photographic background, centered white headline at 50px Plus Jakarta Sans weight 300, white subtext at 18px weight 400, container border-radius 20px.
3. Build a bordered content card: white background, 1px #e5e7eb border, 20px border-radius, 40px padding, internal gap 24px between child elements.
4. Build an accent badge: transparent background, 1px #ff5a2f border, #ff5a2f text, Plus Jakarta Sans 12px weight 500, padding 4px 14px, border-radius 20px.
5. Build a secondary ghost button: transparent background, #333333 text, no border, 30px border-radius, padding 14px 24px, Plus Jakarta Sans 16px weight 500. Use as 'Request a Demo'.

## Similar Brands

- **Apple Product Pages** — Same near-monochrome palette with a single accent color, generous border-radius, spacious vertical rhythm, and full-bleed dark hero photography interrupting white sections
- **Teenage Engineering** — Shared use of Plus Jakarta Sans (or similar geometric sans), ultra-rounded corners (20-30px), and a single high-saturation accent against a clean white canvas
- **Nothing.tech** — Minimalist tech product presentation with bold headline weights, generous white space, and a single warm accent color punctuating an otherwise achromatic interface
- **Framework Computer** — Product-first layout with centered content, high-contrast typography, and restraint in color usage — letting hardware photography carry visual weight

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-ember-orange: #ff5a2f;
  --color-ember-orange-link-variant: #f15b2b;
  --color-carbon-black: #000000;
  --color-graphite: #1f1f1f;
  --color-slate-dark: #333333;
  --color-stone: #555555;
  --color-pewter: #707070;
  --color-steel: #a5a5a5;
  --color-mist: #b7bfc1;
  --color-cloud: #cbcbcb;
  --color-fog: #dddddd;
  --color-paper: #e5e7eb;
  --color-pearl: #f5f5f5;
  --color-canvas-white: #ffffff;

  /* Typography — Font Families */
  --font-plus-jakarta-sans: 'Plus Jakarta Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.6;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --text-body: 16px;
  --leading-body: 1.64;
  --text-subheading: 20px;
  --leading-subheading: 1.5;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.45;
  --text-heading: 32px;
  --leading-heading: 1.4;
  --text-heading-lg: 50px;
  --leading-heading-lg: 1.34;
  --text-display: 80px;
  --leading-display: 1.34;

  /* Typography — Weights */
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  --font-weight-extrabold: 800;

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
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-60: 60px;
  --spacing-80: 80px;
  --spacing-120: 120px;
  --spacing-208: 208px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 40px;
  --element-gap: 24px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 20px;
  --radius-3xl: 27px;
  --radius-3xl-2: 30px;
  --radius-full: 50px;
  --radius-full-2: 54px;
  --radius-full-3: 100px;
  --radius-full-4: 999px;

  /* Named Radii */
  --radius-nav: 30px;
  --radius-cards: 20px;
  --radius-badges: 20px;
  --radius-images: 12-20px;
  --radius-buttons: 30px;
  --radius-headings: 100px;

  /* Shadows */
  --shadow-md: rgba(0, 0, 0, 0.25) 0px 4px 10px 0px;

  /* Surfaces */
  --surface-canvas: #ffffff;
  --surface-pearl: #f5f5f5;
  --surface-cloud: #cbcbcb;
  --surface-stone-dark: #aeaeae;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-ember-orange: #ff5a2f;
  --color-ember-orange-link-variant: #f15b2b;
  --color-carbon-black: #000000;
  --color-graphite: #1f1f1f;
  --color-slate-dark: #333333;
  --color-stone: #555555;
  --color-pewter: #707070;
  --color-steel: #a5a5a5;
  --color-mist: #b7bfc1;
  --color-cloud: #cbcbcb;
  --color-fog: #dddddd;
  --color-paper: #e5e7eb;
  --color-pearl: #f5f5f5;
  --color-canvas-white: #ffffff;

  /* Typography */
  --font-plus-jakarta-sans: 'Plus Jakarta Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.6;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --text-body: 16px;
  --leading-body: 1.64;
  --text-subheading: 20px;
  --leading-subheading: 1.5;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.45;
  --text-heading: 32px;
  --leading-heading: 1.4;
  --text-heading-lg: 50px;
  --leading-heading-lg: 1.34;
  --text-display: 80px;
  --leading-display: 1.34;

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
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-60: 60px;
  --spacing-80: 80px;
  --spacing-120: 120px;
  --spacing-208: 208px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 20px;
  --radius-3xl: 27px;
  --radius-3xl-2: 30px;
  --radius-full: 50px;
  --radius-full-2: 54px;
  --radius-full-3: 100px;
  --radius-full-4: 999px;

  /* Shadows */
  --shadow-md: rgba(0, 0, 0, 0.25) 0px 4px 10px 0px;
}
```
