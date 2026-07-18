# Merlin — Style Reference
> Handwritten margin notes on white paper. A calm off-white page where one vivid green dot says yes, soft pastel light bleeds in from the edges, and Inter does the heavy talking.

**Theme:** light

Merlin uses a hushed, paper-like productivity language: a warm off-white canvas, flat white surfaces, a single vivid green accent that makes the primary action feel like a green light turning on, and soft pastel atmospheric gradients reserved for the page's top and the product backdrop. Type is bold and confident at display sizes but quiet at body sizes — Inter carries the entire voice in one family, letting weight and tracking do all the work. The system feels hand-touched: handwritten green annotations in a script style sit beside machine-clean sans-serif, bridging warmth and product precision. Components stay close to the page — thin hairlines replace heavy elevation, pills replace boxes, and the nav floats as a capsule rather than anchoring as a bar.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Paper White | `#f5f5f4` | `--color-paper-white` | Page canvas — the warm off-white ground the entire page sits on |
| Card Snow | `#ffffff` | `--color-card-snow` | Card surfaces, product mockup backgrounds, floating nav capsule |
| Blush Mist | `#fdf8f7` | `--color-blush-mist` | Subtle warm-tinted surface for accent cards or highlighted zones |
| Ink Black | `#000000` | `--color-ink-black` | Primary headings, strong borders, icon strokes — maximum contrast |
| Body Charcoal | `#1c1d1f` | `--color-body-charcoal` | Body text, secondary borders — near-black that softens display ink |
| Steel Gray | `#6a6b6c` | `--color-steel-gray` | Icon fills/strokes, secondary borders, muted interface elements |
| Graphite | `#808080` | `--color-graphite` | Muted headings, link borders, tertiary text |
| Ash | `#aaaaaa` | `--color-ash` | Light borders, disabled text, subtle separators |
| Hairline | `#cccccc` | `--color-hairline` | Divider lines, light background washes |
| Mist | `#dddddd` | `--color-mist` | Card borders, link underlines, soft outlines |
| Cloud | `#eeeeee` | `--color-cloud` | Lightest borders, soft card outlines, gentle separators |
| Signal Green | `#34c759` | `--color-signal-green` | Green action color for filled buttons, selected navigation states, and focused conversion moments |
| Link Blue | `#3575f8` | `--color-link-blue` | Inline links, highlight text within body copy |
| Dawn Wash | `linear-gradient(180deg, rgb(150, 223, 255) 0%, rgb(237, 237, 237) 58.17%, rgb(221, 221, 221) 100%)` | `--color-dawn-wash` | Atmospheric top-of-page gradient — soft sky blue bleeding down into warm gray, the page's only colored light source |

## Tokens — Typography

### Inter — Sole typeface — display headlines at 60-70px weight 400-500 with negative tracking, body at 14-16px weight 400, uppercase labels at 9-10px with wide positive tracking. The whisper-to-shout range (300-600) lets one family carry hierarchy without ever leaving the page. · `--font-inter`
- **Substitute:** Inter via Google Fonts
- **Weights:** 300, 400, 500, 600
- **Sizes:** 9, 10, 12, 13, 14, 16, 20, 23, 25, 26, 30, 40, 60, 70
- **Line height:** 1.00, 1.13, 1.15, 1.17, 1.40, 1.50, 1.55
- **Letter spacing:** -0.043em at 70px, -0.031em at 60px, 0.025em at 13px, 0.031em at 12px, 0.036em at 10px, 0.038em at 9px, 0.042em at 10px (uppercase tracking)
- **Role:** Sole typeface — display headlines at 60-70px weight 400-500 with negative tracking, body at 14-16px weight 400, uppercase labels at 9-10px with wide positive tracking. The whisper-to-shout range (300-600) lets one family carry hierarchy without ever leaving the page.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 10px | 1.5 | 0.036px | `--text-caption` |
| body | 16px | 1.5 | — | `--text-body` |
| subheading | 20px | 1.4 | — | `--text-subheading` |
| heading-sm | 25px | 1.4 | — | `--text-heading-sm` |
| heading | 40px | 1.15 | — | `--text-heading` |
| heading-lg | 60px | 1.13 | -1.86px | `--text-heading-lg` |
| display | 70px | 1.13 | -3.01px | `--text-display` |

## Tokens — Spacing & Shapes

**Density:** compact

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 5 | 5px | `--spacing-5` |
| 6 | 6px | `--spacing-6` |
| 8 | 8px | `--spacing-8` |
| 10 | 10px | `--spacing-10` |
| 13 | 13px | `--spacing-13` |
| 15 | 15px | `--spacing-15` |
| 20 | 20px | `--spacing-20` |
| 25 | 25px | `--spacing-25` |
| 30 | 30px | `--spacing-30` |
| 40 | 40px | `--spacing-40` |
| 50 | 50px | `--spacing-50` |
| 60 | 60px | `--spacing-60` |
| 80 | 80px | `--spacing-80` |
| 100 | 100px | `--spacing-100` |
| 120 | 120px | `--spacing-120` |
| 180 | 180px | `--spacing-180` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 20px |
| inputs | 12.5px |
| buttons | 100px |
| nav-capsule | 100px |
| product-mockup | 30px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| subtle | `rgb(235, 232, 233) 1px 3px 1px 0px` | `--shadow-subtle` |
| sm | `rgb(238, 238, 238) 0px 3px 8px 0px` | `--shadow-sm` |
| xl | `rgba(0, 0, 0, 0.25) 0px 40px 60px 0px` | `--shadow-xl` |
| subtle-2 | `rgba(0, 0, 0, 0.05) 0px 2px 2px 0px` | `--shadow-subtle-2` |
| subtle-3 | `rgb(238, 238, 238) 3px 6px 1px 0px` | `--shadow-subtle-3` |
| subtle-4 | `rgb(221, 221, 221) 0px 2px 1px 0px` | `--shadow-subtle-4` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 20px
- **Element gap:** 10px

## Components

### Primary CTA Button
**Role:** The single filled action on the page — the only chromatic filled element

Pill-shaped, 100px border-radius. Fill: #34c759 (Signal Green). Text: #ffffff, Inter 14px weight 500, no tracking override. Padding: 10px 20px. No border. The green against the paper-white canvas is the page's only warm chroma — it must stay rare to remain meaningful.

### Ghost Text Button
**Role:** Secondary inline actions with no visual weight

Transparent fill, no border. Text: #1c1d1f, Inter 14px weight 400. Used for 'Pricing' and 'Manifesto' in the floating nav.

### Outline Sign-Up Button
**Role:** Nav-level action that sits beside ghost text but needs more presence

Transparent fill, 1px border #1c1d1f, 100px radius. Text: #1c1d1f, Inter 14px weight 500. Rounded pill matching the nav capsule curvature.

### Floating Navigation Capsule
**Role:** Page-level navigation that hovers at the bottom-center

White (#ffffff) capsule, 100px border-radius, shadow rgb(238,238,238) 0px 3px 8px 0px. Contains logo icon, ghost text links (Pricing, Manifesto), Login text, and outlined Sign-up button. Floats above content with generous bottom margin.

### Social Proof Badge
**Role:** Trust indicator above the headline

Small pill with green dot indicator, text '7,000+ Merlin' in #1c1d1f at ~12px. Dot: 4px circle #34c759.

### Handwritten Annotation
**Role:** Warm, personal margin note — the signature human touch

Script/handwritten font in #34c759 (Signal Green), ~20px. Used as decorative labels ('Imagine', 'Try merlin free for 7 days') with small curved arrow connectors. This is the only element that breaks the sans-serif system — it introduces a second voice that feels like a note from a friend.

### Display Headline
**Role:** Page-level statement — the largest typographic element

Inter 60-70px weight 400, color #000000, letter-spacing -0.031em to -0.043em. Multi-line with inline brand mark. Line-height 1.13.

### Body Description
**Role:** Sub-headline supporting text

Inter 16px weight 400, color #6a6b6c, line-height 1.5. Centered, max-width constrained for readability.

### Logo Trust Bar
**Role:** Row of client/company logos below the CTA

Horizontal row of grayscale logos (Notion, Salesforce, Harvard, HubSpot, McKinsey) with 'Used by professionals at' label above. Logos rendered in #808080 or #6a6b6c for monochrome treatment.

### Product Mockup Card
**Role:** Laptop/tablet frame containing the product UI screenshot

Rounded rectangle 30px radius, large drop-shadow rgba(0,0,0,0.25) 0px 40px 60px 0px. Contains a Van Gogh-style painted landscape background behind a white product UI window. The shadow is dramatic — this is the page's one moment of depth.

### Feature Description Block
**Role:** Section-level statement beside product mockups

Bold Inter 20-25px weight 500 statement, left-aligned. Accompanied by a handwritten annotation in green above it. No card chrome — sits directly on the canvas.

## Do's and Don'ts

### Do
- Use Inter for all text — no secondary families except the handwritten annotation script
- Use #34c759 exclusively for the primary CTA and handwritten annotations — no other green or chromatic accent
- Apply 100px border-radius to all buttons and the floating nav capsule
- Set page canvas to #f5f5f4 and card surfaces to #ffffff — never invert this stack
- Use the Dawn Wash gradient only at the top of the page as atmospheric light — never as a section divider
- Write display headlines at 60-70px with letter-spacing -0.031em to -0.043em and weight 400 — not 700
- Place the product mockup with its 40px 60px deep shadow as the only dramatic elevation on the page

### Don't
- Don't add additional chromatic accents — blue (#3575f8) is only for inline links, not buttons or icons
- Don't use heavy borders — prefer #eeeeee or #dddddd at 1px for all separators
- Don't introduce a second sans-serif — Inter carries the entire system alone
- Don't use box-shadow on standard cards — the product mockup shadow is the page's only dramatic elevation
- Don't fill buttons with black — the only filled button color is Signal Green
- Don't use sharp corners below 12.5px — minimum radius is 12.5px on inputs, 20px on cards
- Don't use uppercase body text — uppercase tracking (+0.036em) is reserved for 9-10px labels only

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Page Canvas | `#f5f5f4` | Warm off-white ground covering the entire page |
| 1 | Card Snow | `#ffffff` | Standard card and component surface |
| 2 | Blush Mist | `#fdf8f7` | Warm-tinted accent surface for featured elements |
| 3 | Atmospheric Wash | `#96dfff` | Gradient zone — soft blue light at page top |

## Elevation

- **Product mockup card:** `rgba(0, 0, 0, 0.25) 0px 40px 60px 0px`
- **Standard card:** `rgb(235, 232, 233) 1px 3px 1px 0px`
- **Floating nav capsule:** `rgb(238, 238, 238) 0px 3px 8px 0px`

## Imagery

Product screenshots are the dominant visual: full laptop/tablet frames showing the Merlin inbox UI with a Van Gogh Starry Night-style painted landscape as the app's background — this painted backdrop is the brand's signature visual moment. Hands holding the device ground the mockup in human use. Logo trust bar uses flat grayscale company marks. The top of the page bleeds a soft blue-to-gray gradient as atmospheric light. No photography of people, no abstract 3D renders, no illustration outside the painted product backdrop.

## Layout

Centered, max-width 1200px page model with generous vertical breathing room. Hero: centered headline stack on paper-white canvas with a soft gradient bleed at the very top — headline, subtext, and CTA all center-aligned. Section 2: product mockup card centered with a bold left-aligned statement beside or above it, anchored by a handwritten green annotation. Floating nav: pill-shaped capsule at bottom-center, persistent. Sections separated by 80px gaps with no dividers — the off-white canvas flows continuously. Content density is compact but unhurried: 10px element gaps, 20px card padding, but 80px between sections creates the spacious feel.

## Agent Prompt Guide

**Quick Color Reference**
- text: #000000 (headings), #1c1d1f (body), #6a6b6c (muted)
- background: #f5f5f4 (canvas), #ffffff (cards)
- border: #eeeeee (light), #dddddd (card), #1c1d1f (button outline)
- accent: #34c759 (Signal Green — CTA + handwriting)
- gradient: Dawn Wash — linear-gradient(180deg, #96dfff 0%, #ededed 58%, #dddddd 100%)
- primary action: #34c759 (filled action)

**3-5 Example Component Prompts**

1. Create a Primary Action Button: #34c759 background, #000000 text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.

2. **Product Mockup Card**: 30px border-radius, shadow rgba(0,0,0,0.25) 0px 40px 60px 0px. Inside: painted landscape background (Van Gogh-style blue sky with swirls) framing a white product UI window with inbox cards. The mockup sits centered on the canvas with 80px margin above and below.

3. **Floating Nav Capsule**: White (#ffffff) pill, 100px radius, shadow rgb(238,238,238) 0px 3px 8px 0px. Contents left to right: logo icon, 'Pricing' ghost text, 'Manifesto' ghost text, 'Login' ghost text, 'Sign up' outlined button (1px border #1c1d1f, 100px radius, Inter 14px weight 500). All text #1c1d1f. Position: bottom-center, fixed, 24px from bottom.

4. **Feature Statement Block**: Handwritten green annotation ('Imagine') in script font #34c759, ~20px, with a curved arrow connector. Below: bold statement in Inter 25px weight 500, #000000, left-aligned, max-width 600px. No card chrome — sits directly on canvas.

5. **Trust Logo Bar**: 'Used by professionals at' label in Inter 10px weight 500, uppercase, #808080, letter-spacing 0.036em, centered. Below: horizontal row of 5 grayscale company logos in #808080, evenly spaced, ~20px gap between each.

## Design Philosophy

Merlin's visual system runs on three tensions: **paper and pixel** (off-white canvas with crisp Inter), **typewriter and handwriting** (bold sans-serif headlines with script annotations), and **flat and deep** (mostly borderless surfaces with one dramatic shadow on the product mockup). These pairings are what make it feel human rather than corporate. The single green accent and the painted product background are the only chromatic moments — everything else is grayscale, which means when color does appear it carries all the weight.

## Similar Brands

- **Linear** — Same single-accent-color restraint with Inter typography and generous whitespace
- **Notion AI** — Paper-warm canvas with off-white tones, soft borders, and handwritten-feeling annotations
- **Arc Browser** — Bold display headlines with tight tracking, pill-shaped CTAs, and product-forward hero
- **Raycast** — Compact density, Inter-only typography, and a single vivid accent against neutral surfaces

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-paper-white: #f5f5f4;
  --color-card-snow: #ffffff;
  --color-blush-mist: #fdf8f7;
  --color-ink-black: #000000;
  --color-body-charcoal: #1c1d1f;
  --color-steel-gray: #6a6b6c;
  --color-graphite: #808080;
  --color-ash: #aaaaaa;
  --color-hairline: #cccccc;
  --color-mist: #dddddd;
  --color-cloud: #eeeeee;
  --color-signal-green: #34c759;
  --color-link-blue: #3575f8;
  --color-dawn-wash: #96dfff;
  --gradient-dawn-wash: linear-gradient(180deg, rgb(150, 223, 255) 0%, rgb(237, 237, 237) 58.17%, rgb(221, 221, 221) 100%);

  /* Typography — Font Families */
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.5;
  --tracking-caption: 0.036px;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 20px;
  --leading-subheading: 1.4;
  --text-heading-sm: 25px;
  --leading-heading-sm: 1.4;
  --text-heading: 40px;
  --leading-heading: 1.15;
  --text-heading-lg: 60px;
  --leading-heading-lg: 1.13;
  --tracking-heading-lg: -1.86px;
  --text-display: 70px;
  --leading-display: 1.13;
  --tracking-display: -3.01px;

  /* Typography — Weights */
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;

  /* Spacing */
  --spacing-5: 5px;
  --spacing-6: 6px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-13: 13px;
  --spacing-15: 15px;
  --spacing-20: 20px;
  --spacing-25: 25px;
  --spacing-30: 30px;
  --spacing-40: 40px;
  --spacing-50: 50px;
  --spacing-60: 60px;
  --spacing-80: 80px;
  --spacing-100: 100px;
  --spacing-120: 120px;
  --spacing-180: 180px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 20px;
  --element-gap: 10px;

  /* Border Radius */
  --radius-lg: 10px;
  --radius-xl: 12.5px;
  --radius-xl-2: 15px;
  --radius-2xl: 20px;
  --radius-3xl: 25px;
  --radius-3xl-2: 30px;
  --radius-3xl-3: 40px;
  --radius-full: 60px;
  --radius-full-2: 65px;
  --radius-full-3: 75px;
  --radius-full-4: 100px;

  /* Named Radii */
  --radius-cards: 20px;
  --radius-inputs: 12.5px;
  --radius-buttons: 100px;
  --radius-nav-capsule: 100px;
  --radius-product-mockup: 30px;

  /* Shadows */
  --shadow-subtle: rgb(235, 232, 233) 1px 3px 1px 0px;
  --shadow-sm: rgb(238, 238, 238) 0px 3px 8px 0px;
  --shadow-xl: rgba(0, 0, 0, 0.25) 0px 40px 60px 0px;
  --shadow-subtle-2: rgba(0, 0, 0, 0.05) 0px 2px 2px 0px;
  --shadow-subtle-3: rgb(238, 238, 238) 3px 6px 1px 0px;
  --shadow-subtle-4: rgb(221, 221, 221) 0px 2px 1px 0px;

  /* Surfaces */
  --surface-page-canvas: #f5f5f4;
  --surface-card-snow: #ffffff;
  --surface-blush-mist: #fdf8f7;
  --surface-atmospheric-wash: #96dfff;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-paper-white: #f5f5f4;
  --color-card-snow: #ffffff;
  --color-blush-mist: #fdf8f7;
  --color-ink-black: #000000;
  --color-body-charcoal: #1c1d1f;
  --color-steel-gray: #6a6b6c;
  --color-graphite: #808080;
  --color-ash: #aaaaaa;
  --color-hairline: #cccccc;
  --color-mist: #dddddd;
  --color-cloud: #eeeeee;
  --color-signal-green: #34c759;
  --color-link-blue: #3575f8;
  --color-dawn-wash: #96dfff;

  /* Typography */
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.5;
  --tracking-caption: 0.036px;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 20px;
  --leading-subheading: 1.4;
  --text-heading-sm: 25px;
  --leading-heading-sm: 1.4;
  --text-heading: 40px;
  --leading-heading: 1.15;
  --text-heading-lg: 60px;
  --leading-heading-lg: 1.13;
  --tracking-heading-lg: -1.86px;
  --text-display: 70px;
  --leading-display: 1.13;
  --tracking-display: -3.01px;

  /* Spacing */
  --spacing-5: 5px;
  --spacing-6: 6px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-13: 13px;
  --spacing-15: 15px;
  --spacing-20: 20px;
  --spacing-25: 25px;
  --spacing-30: 30px;
  --spacing-40: 40px;
  --spacing-50: 50px;
  --spacing-60: 60px;
  --spacing-80: 80px;
  --spacing-100: 100px;
  --spacing-120: 120px;
  --spacing-180: 180px;

  /* Border Radius */
  --radius-lg: 10px;
  --radius-xl: 12.5px;
  --radius-xl-2: 15px;
  --radius-2xl: 20px;
  --radius-3xl: 25px;
  --radius-3xl-2: 30px;
  --radius-3xl-3: 40px;
  --radius-full: 60px;
  --radius-full-2: 65px;
  --radius-full-3: 75px;
  --radius-full-4: 100px;

  /* Shadows */
  --shadow-subtle: rgb(235, 232, 233) 1px 3px 1px 0px;
  --shadow-sm: rgb(238, 238, 238) 0px 3px 8px 0px;
  --shadow-xl: rgba(0, 0, 0, 0.25) 0px 40px 60px 0px;
  --shadow-subtle-2: rgba(0, 0, 0, 0.05) 0px 2px 2px 0px;
  --shadow-subtle-3: rgb(238, 238, 238) 3px 6px 1px 0px;
  --shadow-subtle-4: rgb(221, 221, 221) 0px 2px 1px 0px;
}
```
