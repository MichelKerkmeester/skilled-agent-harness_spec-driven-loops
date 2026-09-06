# Moxie — Style Reference
> Editorial darkroom with a single periwinkle flare — serif headlines float on a black void while a vivid blue accent punctuates the silence.

**Theme:** dark

Moxie's design system operates as an editorial PR-agency darkroom: deep black canvas, warm cream typography, and a single vivid periwinkle accent that lights up interactions like a stage spotlight. The pairing of IBM Plex Serif (for headlines) with IBM Plex Sans (for everything else) creates a magazine-meets-product tension — the serif whispers authority and editorial polish, while the sans keeps functional UI grounded and modern. Layout breathes generously with large centered serif hero statements, asymmetric card grids for work showcases, and horizontal scrolling case-study carousels. Color is used sparingly: the cream (#f4efd4) does the heavy lifting for text and hairline borders on cards, the periwinkle blue (#84acfb) acts as a singular accent for italic emphasis, active states, and the sole filled CTA, and deeper warm grays layer card-on-card depth. There are no shadows, no gradients, no decorative chrome — the system relies on generous spacing, type contrast, and selective color punctuation to create hierarchy.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Periwinkle Flare | `#84acfb` | `--color-periwinkle-flare` | Primary action background, italic emphasis text, active nav state, heading accent — the lone chromatic signal in an otherwise achromatic system, used surgically to make interactions feel switched on |
| Warm Cream | `#f4efd4` | `--color-warm-cream` | Primary text, card borders, hairline dividers, card surfaces — a warm off-white that softens the black void and carries the editorial tone |
| Warm Ash | `#626055` | `--color-warm-ash` | Secondary card borders, muted text, button borders — a mid-tone warm gray for layering depth between cream borders and the black canvas |
| Charcoal Veil | `#333333` | `--color-charcoal-veil` | Subtle borders, low-emphasis dividers, body text borders — the deepest visible neutral for near-invisible structural lines |

## Tokens — Typography

### IBM Plex Serif — Display and heading typeface — weight 300 at 55px creates a whisper-light editorial presence; this serif choice signals PR-agency sophistication and gives the brand a magazine-editorial voice that distinguishes it from typical sans-serif tech sites · `--font-ibm-plex-serif`
- **Substitute:** EB Garamond, Cormorant Garamond, Source Serif Pro
- **Weights:** 300, 400, 500
- **Sizes:** 17px, 22px, 26px, 28px, 43px, 55px
- **Line height:** 1.10, 1.20
- **Role:** Display and heading typeface — weight 300 at 55px creates a whisper-light editorial presence; this serif choice signals PR-agency sophistication and gives the brand a magazine-editorial voice that distinguishes it from typical sans-serif tech sites

### IBM Plex Sans — Body, UI, navigation, buttons, captions — the functional workhorse at 16-17px weight 400; weight 300 is used for secondary text creating a light, airy body voice; weight 500 for emphasis and button labels · `--font-ibm-plex-sans`
- **Substitute:** Inter, Source Sans Pro, system-ui
- **Weights:** 300, 400, 500
- **Sizes:** 10px, 12px, 14px, 16px, 17px, 24px
- **Line height:** 1.00, 1.20, 1.50
- **Role:** Body, UI, navigation, buttons, captions — the functional workhorse at 16-17px weight 400; weight 300 is used for secondary text creating a light, airy body voice; weight 500 for emphasis and button labels

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 10px | 1.2 | — | `--text-caption` |
| body-lg | 17px | 1.5 | — | `--text-body-lg` |
| subheading | 24px | 1.2 | — | `--text-subheading` |
| heading-sm | 28px | 1.2 | — | `--text-heading-sm` |
| heading | 43px | 1.1 | — | `--text-heading` |
| display | 55px | 1.1 | — | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 28 | 28px | `--spacing-28` |
| 48 | 48px | `--spacing-48` |
| 52 | 52px | `--spacing-52` |
| 76 | 76px | `--spacing-76` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 1000px |
| cards | 8-14px |
| buttons | 1000px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80-120px
- **Card padding:** 19-35px
- **Element gap:** 17-21px

## Components

### Pill Navigation Button
**Role:** Primary CTA in nav bar

Fully rounded pill (1000px radius) filled with #84acfb periwinkle blue, cream text (#f4efd4) in IBM Plex Sans weight 500, 7px vertical / 21px horizontal padding. The single chromatic element in the header, making it the obvious action target.

### Outlined Pill Button
**Role:** Secondary action button

Pill shape (1000px radius) with warm ash (#626055) border, transparent fill, cream text (#f4efd4) in IBM Plex Sans 14-16px weight 400. Used for secondary CTAs like 'Meet the team'.

### Hero Serif Statement
**Role:** Section-opening editorial headline

Centered IBM Plex Serif weight 300 at 55px, warm cream (#f4efd4) color, line-height 1.10. Key words in italic periwinkle (#84acfb) for emphasis — the italic-periwinkle combination is the signature accent pattern.

### Brand Logo Strip
**Role:** Client/brand showcase row

Horizontal row of client brand wordmarks in cream (#f4efd4) on black canvas, centered, evenly spaced with ~35px gaps. Each logo is a different typographic identity (serif, sans, script) at uniform visual weight.

### Case Study Card
**Role:** Portfolio work tile

Rounded card (~8-14px radius) with cream (#f4efd4) hairline border, no fill, contains a full-bleed image with cream border, and a small circular '+' button overlay in the top-right corner. 17-21px internal padding.

### Testimonial Card
**Role:** Client quote card

Card with ~14px radius, cream (#f4efd4) border, slightly elevated dark surface. Opens with a large periwinkle (#84acfb) opening quotation mark. Quote text in IBM Plex Sans 14-16px cream, attribution name in weight 500, title in lighter weight.

### Carousel Navigation Arrows
**Role:** Horizontal scroll controls

Small circular buttons with cream (#f4efd4) border and arrow icons, positioned at the top-right of carousels. Minimal, functional, ghost-style.

### Section Heading
**Role:** Subsection title

IBM Plex Serif weight 300 at 43px, cream (#f4efd4), left-aligned, with generous top spacing (~80-100px) from previous section. Establishes the editorial section rhythm.

### Italic Accent Phrase
**Role:** Inline emphasis within serif headlines

Words or short phrases set in IBM Plex Serif italic, periwinkle blue (#84acfb) color, embedded within cream serif statements. The signature visual move — 'builds category leaders', 'venture' — turns ordinary headlines into typographic compositions.

### Hamburger Menu Icon
**Role:** Mobile/simplified nav trigger

Three thin horizontal lines in cream (#f4efd4), minimal weight, positioned top-left. No background, no border — pure typographic icon.

## Do's and Don'ts

### Do
- Use IBM Plex Serif weight 300 at 43-55px for all section and hero headlines — the whisper-light weight is non-negotiable for the editorial voice
- Apply the italic-periwinkle accent pattern: set one key phrase per headline in IBM Plex Serif italic, color #84acfb, to create typographic rhythm
- Use 1000px border-radius (full pill) for all buttons and interactive tags
- Set card borders to 1px #f4efd4 with no fill or shadow — structure is created by lines and spacing, never by elevation
- Maintain black (#000000) as the sole page background — never lighten it with gray washes or subtle gradients
- Use IBM Plex Sans weight 300 for secondary body text and weight 500 for button labels and attributions to create clear text hierarchy
- Space sections with 80-120px vertical gaps to let the dark canvas and serif type breathe

### Don't
- Don't use drop shadows on any element — the system is intentionally shadowless and relies on borders and spacing for structure
- Don't use #84acfb for large background areas or decorative blocks — it is a surgical accent, not a surface color
- Don't set headlines in IBM Plex Sans — the serif/sans split is a load-bearing system choice; headlines must always be Plex Serif
- Don't use weight 600-700 for headlines — the whisper-light 300 weight is the signature; heavier weights would break the editorial tone
- Don't introduce additional accent colors — the system is monochromatic plus one periwinkle; adding a second chromatic would dilute the signal
- Don't add gradients, glows, or blur effects to any element — the flatness is the point
- Don't use square or small-radius buttons for primary actions — all interactive elements should be pill-shaped (1000px radius)

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Void Canvas | `#000000` | Page background — the deep black that everything sits on, creating maximum contrast for cream typography |
| 1 | Card Surface | `#1a1a1a` | Elevated card backgrounds for testimonials, case study tiles, and content blocks |
| 2 | Cream Border | `#f4efd4` | Hairline card borders that define structure without elevation — the primary border color |

## Elevation

No shadows. Hierarchy is created through generous spacing, hairline cream borders, and card-on-card tonal layering — never drop shadows. This deliberate shadowlessness keeps the design flat, editorial, and fast.

## Imagery

Imagery is photo-driven and editorial: full-bleed campaign stills (Liquid Death portrait), product close-ups (Oura ring macro shot), and video call screenshots fill case study tiles. Treatment is raw and uncropped — images sit in their card containers with cream hairline borders rather than masked or shaped. Photography is high-contrast and dramatic, matching the dark canvas. No illustrations, no abstract graphics, no 3D renders. Icons are minimal — only the '+' overlay button and carousel arrows. The visual language is 'show the work at full fidelity' rather than stylized or decorative.

## Layout

Full-width dark sections separated by generous vertical rhythm (80-120px). Hero is centered text-only with a large serif statement floating on black void. Content sections use a max-width ~1200px centered container. Case study tiles appear in a 2-column grid with one large featured tile and a grid of smaller thumbnails. Testimonials use a 3-column horizontal card row with carousel navigation. The brand logo strip is a single full-width centered row. Navigation is minimal: hamburger left, wordmark center, single pill CTA right — no mega-menu, no sidebar.

## Agent Prompt Guide

**Quick Color Reference**
- background: #000000 (page canvas)
- text: #f4efd4 (warm cream)
- border: #f4efd4 (hairline card borders)
- accent: #84acfb (periwinkle — italic emphasis, active states)
- primary action: #84acfb (filled action)

**Example Component Prompts**
1. *Hero editorial statement*: Center on black canvas. Headline in IBM Plex Serif weight 300, 55px, color #f4efd4, line-height 1.10. Embed one italic phrase in IBM Plex Serif italic, color #84acfb, same size. No background image, no decorative elements.

2. Create a Primary Action Button: #84acfb background, #333333 text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.

3. *Case study card*: 14px border-radius, 1px border #f4efd4, no fill, padding 19px. Contains a full-bleed image filling the card interior. Small 32px circular '+' button in top-right corner with 1px #f4efd4 border, transparent fill, cream '+' icon.

4. *Testimonial card*: 14px border-radius, 1px border #f4efd4, surface #1a1a1a, padding 31-35px. Opening: large '#84acfb' quotation mark (serif, 40px). Body: IBM Plex Sans 14px #f4efd4, line-height 1.50. Attribution: name in weight 500, title in weight 300.

5. *Section heading with italic accent*: IBM Plex Serif weight 300, 43px, #f4efd4, left-aligned, 80-100px top margin. Second word in italic #84acfb.

## Similar Brands

- **Pentagram** — Same editorial dark canvas with serif headlines and generous whitespace — both treat the homepage as a typographic composition rather than a product surface
- **Giant Spoon** — Agency-site convention of large centered serif statements on dark backgrounds with a single accent color for emphasis and CTAs
- **Anomaly** — Dark-mode agency aesthetic mixing serif and sans typography with pill-shaped navigation CTAs and a single vivid accent color
- **Red Antler** — Brand-agency pattern of warm cream typography on black with strategic color accents and editorial serif headlines

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-periwinkle-flare: #84acfb;
  --color-warm-cream: #f4efd4;
  --color-warm-ash: #626055;
  --color-charcoal-veil: #333333;

  /* Typography — Font Families */
  --font-ibm-plex-serif: 'IBM Plex Serif', ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
  --font-ibm-plex-sans: 'IBM Plex Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.2;
  --text-body-lg: 17px;
  --leading-body-lg: 1.5;
  --text-subheading: 24px;
  --leading-subheading: 1.2;
  --text-heading-sm: 28px;
  --leading-heading-sm: 1.2;
  --text-heading: 43px;
  --leading-heading: 1.1;
  --text-display: 55px;
  --leading-display: 1.1;

  /* Typography — Weights */
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-medium: 500;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-28: 28px;
  --spacing-48: 48px;
  --spacing-52: 52px;
  --spacing-76: 76px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80-120px;
  --card-padding: 19-35px;
  --element-gap: 17-21px;

  /* Border Radius */
  --radius-lg: 8.65108px;
  --radius-xl: 13.8417px;
  --radius-full: 1000px;

  /* Named Radii */
  --radius-tags: 1000px;
  --radius-cards: 8-14px;
  --radius-buttons: 1000px;

  /* Surfaces */
  --surface-void-canvas: #000000;
  --surface-card-surface: #1a1a1a;
  --surface-cream-border: #f4efd4;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-periwinkle-flare: #84acfb;
  --color-warm-cream: #f4efd4;
  --color-warm-ash: #626055;
  --color-charcoal-veil: #333333;

  /* Typography */
  --font-ibm-plex-serif: 'IBM Plex Serif', ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
  --font-ibm-plex-sans: 'IBM Plex Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.2;
  --text-body-lg: 17px;
  --leading-body-lg: 1.5;
  --text-subheading: 24px;
  --leading-subheading: 1.2;
  --text-heading-sm: 28px;
  --leading-heading-sm: 1.2;
  --text-heading: 43px;
  --leading-heading: 1.1;
  --text-display: 55px;
  --leading-display: 1.1;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-28: 28px;
  --spacing-48: 48px;
  --spacing-52: 52px;
  --spacing-76: 76px;

  /* Border Radius */
  --radius-lg: 8.65108px;
  --radius-xl: 13.8417px;
  --radius-full: 1000px;
}
```
