# Atoms — Style Reference
> white atelier with one blue spark

**Theme:** light

Atoms operates as a quiet workshop: near-white canvas, one confident blue-violet accent, and typography that lets content breathe rather than perform. The system is almost achromatic — gray is the structural material, and the single chromatic note appears only when something is actionable, linked, or wants to be named. Surfaces are flat and soft, cards float on barely-there shadows, and radii swing between fully pill-shaped (9999px) and generously rounded (24px) — never sharp, never heavy. IBM Plex Sans carries the UI at compact sizes while Plex Serif surfaces once, at 48px, giving the hero headline a literary weight that the product photography (template thumbnails with Mac chrome) deliberately undercuts with its playful, colorful content.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Atoms Blue | `#4267ff` | `--color-atoms-blue` | Violet supporting accent for decorative details and low-frequency emphasis. Do not promote it to the primary CTA color |
| Atoms Blue Deep | `#425ce1` | `--color-atoms-blue-deep` | Violet supporting accent for decorative details and low-frequency emphasis. Do not promote it to the primary CTA color |
| Mac Red | `#ff5f56` | `--color-mac-red` | Red supporting accent for decorative details and low-frequency emphasis |
| Mac Yellow | `#ffbd2e` | `--color-mac-yellow` | Decorative window-chrome dot on template preview thumbnails |
| Mac Green | `#27c93f` | `--color-mac-green` | Decorative window-chrome dot on template preview thumbnails |
| Canvas Mist | `#e5e7eb` | `--color-canvas-mist` | Page-level background, hairline dividers, icon strokes — the dominant neutral that defines the system's floor |
| Surface White | `#ffffff` | `--color-surface-white` | Card backgrounds, input fields, elevated surfaces — the top layer of the surface stack |
| Surface Fog | `#f6f6f6` | `--color-surface-fog` | Subtle recessed surfaces, secondary card backgrounds, image overlays |
| Ink Black | `#0d0d0d` | `--color-ink-black` | Primary text, heading text, icon fills, input borders — near-black rather than pure black for less harshness |
| Pure Black | `#000000` | `--color-pure-black` | Maximum-contrast text, dark template preview surfaces, image elements requiring true black |
| Charcoal | `#3c3c3c` | `--color-charcoal` | Secondary text, badge labels, muted icon fills — sits between Ink Black and the mid-grays |
| Mid Gray | `#767676` | `--color-mid-gray` | Tertiary text, placeholder text, disabled button labels, input helper text |
| Silver | `#b0b0b0` | `--color-silver` | Muted icon fills, decorative text, low-emphasis UI marks |
| Border Gray | `#d1d1d1` | `--color-border-gray` | Subtle borders and dividers where Canvas Mist feels too prominent |

## Tokens — Typography

### IBM Plex Sans — The workhorse — body, buttons, nav, cards, badges, inputs, small headings. Plex Sans brings a technical, slightly geometric quality that reads as 'builder tool' rather than 'marketing page.' 400 for body, 500 for nav and button labels, 600 for card titles and section headings. · `--font-ibm-plex-sans`
- **Substitute:** Inter, DM Sans, system-ui
- **Weights:** 400, 500, 600
- **Sizes:** 12px, 14px, 16px, 18px, 20px, 24px, 32px, 48px
- **Line height:** 1.17–1.67
- **Role:** The workhorse — body, buttons, nav, cards, badges, inputs, small headings. Plex Sans brings a technical, slightly geometric quality that reads as 'builder tool' rather than 'marketing page.' 400 for body, 500 for nav and button labels, 600 for card titles and section headings.

### IBM Plex Serif — The hero headline voice — used at 48px/600 exactly once on the page. A serif on a dev-tool site is anti-convention; it gives the main promise editorial weight while the rest of the UI stays in the sans-serif workshop tone. This single serif moment is the brand's typographic signature. · `--font-ibm-plex-serif`
- **Substitute:** Source Serif Pro, Lora, Georgia
- **Weights:** 600
- **Sizes:** 48px
- **Line height:** 1.17
- **Role:** The hero headline voice — used at 48px/600 exactly once on the page. A serif on a dev-tool site is anti-convention; it gives the main promise editorial weight while the rest of the UI stays in the sans-serif workshop tone. This single serif moment is the brand's typographic signature.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.5 | — | `--text-caption` |
| body-sm | 14px | 1.57 | — | `--text-body-sm` |
| body | 16px | 1.5 | — | `--text-body` |
| subheading | 18px | 1.49 | — | `--text-subheading` |
| heading-sm | 20px | 1.4 | — | `--text-heading-sm` |
| heading | 24px | 1.33 | — | `--text-heading` |
| heading-lg | 32px | 1.25 | — | `--text-heading-lg` |
| display | 48px | 1.17 | — | `--text-display` |

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
| 44 | 44px | `--spacing-44` |
| 48 | 48px | `--spacing-48` |
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |
| 160 | 160px | `--spacing-160` |
| 240 | 240px | `--spacing-240` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 24px |
| small | 8px |
| badges | 9999px |
| images | 12px |
| inputs | 8px |
| buttons | 9999px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| lg | `rgba(13, 13, 13, 0.08) 0px 8px 24px -4px, rgba(13, 13, 13...` | `--shadow-lg` |
| sm | `rgba(13, 13, 13, 0.04) 0px 1px 4px 0px` | `--shadow-sm` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 64px
- **Card padding:** 24px
- **Element gap:** 8-16px

## Components

### Primary Pill Button
**Role:** Main action trigger — Sign up, Start for free

Background #4267ff, text #ffffff, IBM Plex Sans 14px/500, padding 8px 16px, border-radius 9999px (fully pill-shaped). The chromatic exception in a grayscale system; appears at most once or twice per screen to maintain visual scarcity.

### Ghost Pill Button
**Role:** Secondary navigation action — Log in

Transparent background, text #0d0d0d, IBM Plex Sans 14px/500, padding 8px 16px, border-radius 9999px. The quiet companion to the Primary Pill Button.

### Nav Link
**Role:** Top navigation items — Pricing, Resources

Text #0d0d0d, IBM Plex Sans 14px/500, padding 4px 12px, border-radius 9999px, optional dropdown caret. No underline, no bold — the weight difference between nav and body text is 500 vs 400, barely perceptible.

### Hero Prompt Input
**Role:** Central product input on landing — 'Create a SaaS subscription app…'

Background #ffffff, border 1px #e5e7eb, border-radius 8px, padding 20px, IBM Plex Sans 16px/400 placeholder text in #767676. The input sits inside a container card with a + add button and the Primary Pill Button aligned right. Container padding 24px, border-radius 8px.

### Template Preview Card
**Role:** Showcase of pre-built app templates

Background #ffffff, border-radius 12px on the preview image (24px on the outer card), Mac window chrome (three traffic-light dots in #ff5f56 / #ffbd2 / #27c93f) rendered above the image. Title in IBM Plex Sans 16px/600 #0d0d0d below the image. Shadow: rgba(13,13,13,0.08) 0px 8px 24px -4px + rgba(13,13,13,0.04) 0px 4px 4px 0px.

### Testimonial Card
**Role:** User quote display — grid of 3–4 columns

Background #ffffff, border-radius 24px (generous), padding 24px, shadow stack same as template card. Header row: platform icon (Discord/X/Reddit/Product Hunt logo in 24px square with 4px radius) + title in IBM Plex Sans 16px/600 with the word 'Atoms' highlighted in #4267ff. Body in IBM Plex Sans 14px/400 #3c3c3c. Footer: avatar (24px circle) + name in 14px/500.

### Pill Badge Tag
**Role:** Category filters — SaaS Apps, E-commerce, Internal Tools, Personal Projects

Background transparent, border 1px #e5e7eb, text #0d0d0d, IBM Plex Sans 14px/500, padding 4px 12px, border-radius 9999px. Active state: background #0d0d0d, text #ffffff. The 'SaaS Apps' active state is the only dark pill in the system.

### Suggestion Chip
**Role:** Quick-build prompts below input — AI Tool, Internal Tool, SaaS, Dashboard, E-commerce, Game

Background transparent, text #0d0d0d, IBM Plex Sans 14px/400, inline icon (16px) + label, padding 4px 8px, no border, no radius. Arranged in a horizontal scrollable row separated by 4px gaps.

### Avatar Stack
**Role:** Social proof element above hero headline

Seven circular avatars (32px) with 8px overlap, each in a distinct hue (orange, gray, pink, blue, teal, green, purple) with 2px white border. The only place where the palette breaks its achromatic discipline — deliberately human and warm above the clinical headline.

### Social Proof Stat Row
**Role:** Trust metrics — 100K+ GitHub Star, 1,000,000+ Builders, 1# on ProductHunt

Horizontal row, IBM Plex Sans 16px/400 #767676 for labels, italic 16px/500 for numbers, small icon (16px) preceding each. Vertically separated by generous horizontal padding (48px+). No card, no background — sits directly on #e5e7eb canvas.

### Brand Wordmark
**Role:** Logo in top-left

Dark atom/gear icon (20px) + 'Atoms' text in IBM Plex Sans 16px/600 #0d0d0d. The icon is the only brand mark element; no separate colored logo treatment.

## Do's and Don'ts

### Do
- Use #4267ff only for primary actions, link text, and the brand wordmark — never as a background wash or decorative fill
- Set border-radius to 9999px for every button, badge, and pill-shaped interactive element
- Set border-radius to 24px for all card-level containers and 12px for preview images inside them
- Use IBM Plex Serif 48px/600 exactly once per page — the hero headline — and never elsewhere
- Apply the dual-layer shadow (0px 8px 24px -4px at 0.08 + 0px 4px 4px at 0.04) to any card that lifts off the #e5e7eb canvas
- Build on the three-layer surface stack: #e5e7eb page → #ffffff cards → #f6f6f6 recessed wells
- Use #0d0d0d (not #000000) for body text and primary borders — the near-black is deliberately softer

### Don't
- Don't introduce additional accent colors — the system is intentionally monochromatic with one blue voice
- Don't use square corners or small radii (<8px) on any interactive element
- Don't use #4267ff on backgrounds larger than 120px wide — the chromatic note must stay small and intentional
- Don't apply the serif font to subheadings, card titles, or anywhere below 48px
- Don't use drop shadows stronger than the defined dual-layer stack — heavy shadows would break the soft, flat character
- Don't use #000000 for text — always prefer #0d0d0d for warmth and #3c3c3c for secondary copy
- Don't stack more than one Primary Pill Button per viewport quadrant — the blue should never compete with itself

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas Mist | `#e5e7eb` | Page background — the floor of the entire interface |
| 1 | Surface White | `#ffffff` | Cards, input fields, elevated content blocks |
| 2 | Surface Fog | `#f6f6f6` | Recessed wells, secondary panels, subtle background differentiation |
| 3 | Ink Black | `#0d0d0d` | Active/selected pill badges, dark contrast surfaces (used sparingly) |

## Elevation

- **Card (template preview, testimonial):** `rgba(13, 13, 13, 0.08) 0px 8px 24px -4px, rgba(13, 13, 13, 0.04) 0px 4px 4px 0px`
- **Subtle UI element (input border, divider):** `rgba(13, 13, 13, 0.04) 0px 1px 4px 0px`

## Imagery

Template preview thumbnails dominate the visual content: product screenshots framed as Mac desktop windows (rounded-corner browser/app chrome with red/yellow/green traffic-light dots). No lifestyle photography, no abstract illustrations, no hero imagery. The avatar row above the headline is the only burst of warm, human color — seven distinct-hue circular faces with white ring borders. Product screenshots inside templates are dark and content-rich, creating contrast against the white card containers. Icon style is small, monoline, and appears as inline glyphs within suggestion chips and social proof rows.

## Layout

Centered, max-width ~1200px container. Hero is a vertically stacked single column: avatar row → display headline → subtitle → input card → suggestion chips. The page then transitions to a template gallery (3-column grid with category filter pills above) and a testimonial wall (3-4 column masonry of equal-height cards). Navigation is a minimal top bar — logo left, page links center-left, auth actions right. No sidebar, no sticky header effects, no full-bleed sections. Sections are separated by 64px vertical gaps on the #e5e7eb canvas, creating a rhythm of white cards floating in gray space.

## Agent Prompt Guide

## Quick Color Reference
- Page background: #e5e7eb
- Card surface: #ffffff
- Primary text: #0d0d0d
- Secondary text: #3c3c3c
- Muted/placeholder text: #767676
- Hairline borders: #e5e7eb
- Accent / brand blue: #4267ff
- primary action: no distinct CTA color

## Example Component Prompts

No distinct primary action color was observed; use the extracted neutral button treatments instead of inventing a filled CTA color.

**Template Preview Card**: White card on #e5e7eb canvas. Border-radius 24px, padding 24px below image. Image area (border-radius 12px) shows a Mac window with traffic-light dots (#ff5f56, #ffbd2e, #27c93f) in the top-left corner over a dark product screenshot. Title below in IBM Plex Sans 16px weight 600 #0d0d0d. Apply dual shadow: rgba(13,13,13,0.08) 0px 8px 24px -4px + rgba(13,13,13,0.04) 0px 4px 4px 0px.

**Testimonial Card**: White card, border-radius 24px, padding 24px. Header: 24px platform icon (border-radius 4px) + title in IBM Plex Sans 16px/600 with the word 'Atoms' in #4267ff. Body text in IBM Plex Sans 14px/400 #3c3c3c. Footer: 24px circular avatar + name in 14px/500 #0d0d0d. Same dual shadow as template card.


**Category Filter Pill**: Transparent background, 1px border #e5e7eb, text #0d0d0d, IBM Plex Sans 14px/500, padding 4px 12px, border-radius 9999px. Active state inverts: background #0d0d0d, text #ffffff, no border.

## Typographic Signature

The system's most distinctive choice is the single-use IBM Plex Serif at 48px/600 for the hero headline. Every other piece of text — subheadings, body, nav, buttons, card titles — stays in IBM Plex Sans. This creates a one-moment-of-warmth effect: the promise ('Turn ideas into products that sell') feels editorial and human, while the rest of the interface feels like a clean workshop. An AI agent should never apply Plex Serif to subheadings, card titles, or any text below 32px — doing so dilutes the signature.

## Avatar Stack Rule

Above the hero headline sits a horizontal row of 7 circular avatars in distinct hues (warm orange, cool gray, pink, blue, teal, green, purple), each 32px with 2px white borders and 8px overlap. This is the only place the system allows chromatic diversity outside the brand blue. The purpose is human warmth and social proof — the faces break the grayscale discipline to signal 'real people built things here.' Replicate this only above the primary headline on landing pages, never within content sections.

## Similar Brands

- **Vercel** — Same near-monochrome canvas (#f6f6f6 / white cards), one blue accent, generous 24px card radii, and centered max-width hero composition
- **Linear** — Shares the minimal color philosophy with a single chromatic action color, pill-shaped controls, and Plex-family geometric sans-serif typography
- **Framer** — Same centered hero with input-as-hero-element pattern, dark template preview cards on light canvas, and pill-shaped CTA buttons
- **Raycast** — Mac-window-chrome aesthetic on product previews (traffic-light dots), compact pill badges for categories, and a quiet achromatic palette with selective color
- **Cal.com** — Similar template-card layout with rounded images and titles below, social-proof stat row pattern, and light gray canvas supporting white floating cards

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-atoms-blue: #4267ff;
  --color-atoms-blue-deep: #425ce1;
  --color-mac-red: #ff5f56;
  --color-mac-yellow: #ffbd2e;
  --color-mac-green: #27c93f;
  --color-canvas-mist: #e5e7eb;
  --color-surface-white: #ffffff;
  --color-surface-fog: #f6f6f6;
  --color-ink-black: #0d0d0d;
  --color-pure-black: #000000;
  --color-charcoal: #3c3c3c;
  --color-mid-gray: #767676;
  --color-silver: #b0b0b0;
  --color-border-gray: #d1d1d1;

  /* Typography — Font Families */
  --font-ibm-plex-sans: 'IBM Plex Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-ibm-plex-serif: 'IBM Plex Serif', ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --text-body-sm: 14px;
  --leading-body-sm: 1.57;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 18px;
  --leading-subheading: 1.49;
  --text-heading-sm: 20px;
  --leading-heading-sm: 1.4;
  --text-heading: 24px;
  --leading-heading: 1.33;
  --text-heading-lg: 32px;
  --leading-heading-lg: 1.25;
  --text-display: 48px;
  --leading-display: 1.17;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;

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
  --spacing-44: 44px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-160: 160px;
  --spacing-240: 240px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 64px;
  --card-padding: 24px;
  --element-gap: 8-16px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-3xl: 24px;
  --radius-3xl-2: 32px;
  --radius-3xl-3: 40px;
  --radius-full: 999px;
  --radius-full-2: 9999px;

  /* Named Radii */
  --radius-cards: 24px;
  --radius-small: 8px;
  --radius-badges: 9999px;
  --radius-images: 12px;
  --radius-inputs: 8px;
  --radius-buttons: 9999px;

  /* Shadows */
  --shadow-lg: rgba(13, 13, 13, 0.08) 0px 8px 24px -4px, rgba(13, 13, 13, 0.04) 0px 4px 4px 0px;
  --shadow-sm: rgba(13, 13, 13, 0.04) 0px 1px 4px 0px;

  /* Surfaces */
  --surface-canvas-mist: #e5e7eb;
  --surface-surface-white: #ffffff;
  --surface-surface-fog: #f6f6f6;
  --surface-ink-black: #0d0d0d;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-atoms-blue: #4267ff;
  --color-atoms-blue-deep: #425ce1;
  --color-mac-red: #ff5f56;
  --color-mac-yellow: #ffbd2e;
  --color-mac-green: #27c93f;
  --color-canvas-mist: #e5e7eb;
  --color-surface-white: #ffffff;
  --color-surface-fog: #f6f6f6;
  --color-ink-black: #0d0d0d;
  --color-pure-black: #000000;
  --color-charcoal: #3c3c3c;
  --color-mid-gray: #767676;
  --color-silver: #b0b0b0;
  --color-border-gray: #d1d1d1;

  /* Typography */
  --font-ibm-plex-sans: 'IBM Plex Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-ibm-plex-serif: 'IBM Plex Serif', ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --text-body-sm: 14px;
  --leading-body-sm: 1.57;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 18px;
  --leading-subheading: 1.49;
  --text-heading-sm: 20px;
  --leading-heading-sm: 1.4;
  --text-heading: 24px;
  --leading-heading: 1.33;
  --text-heading-lg: 32px;
  --leading-heading-lg: 1.25;
  --text-display: 48px;
  --leading-display: 1.17;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-44: 44px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-160: 160px;
  --spacing-240: 240px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-3xl: 24px;
  --radius-3xl-2: 32px;
  --radius-3xl-3: 40px;
  --radius-full: 999px;
  --radius-full-2: 9999px;

  /* Shadows */
  --shadow-lg: rgba(13, 13, 13, 0.08) 0px 8px 24px -4px, rgba(13, 13, 13, 0.04) 0px 4px 4px 0px;
  --shadow-sm: rgba(13, 13, 13, 0.04) 0px 1px 4px 0px;
}
```
