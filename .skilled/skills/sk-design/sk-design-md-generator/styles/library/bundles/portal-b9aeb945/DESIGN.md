# Portal — Style Reference
> twilight serif editorial — a premium indie magazine spread sitting inside a native iOS aesthetic

**Theme:** light

Portal uses a twilight-editorial visual language: a dramatic sunset gradient hero (sky-blue fading through violet to warm coral) gives way to a clean, paper-white editorial canvas below. Display headlines are set in Perfectly Nineties — a confident retro serif that signals craft over typical startup sans. Body and UI copy stay in Inter at restrained sizes, with one vivid iOS-blue accent (#007aff) punctuating an otherwise achromatic system. Surfaces are flat and generously rounded: cards at 22-30px, buttons as full pills at 50px, and the floating nav as a soft white capsule. Elevation is whispered rather than dropped — the system prefers 1px outlines and pale #f7f7f7 glow rings over heavy shadows.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Signal Blue | `#007aff` | `--color-signal-blue` | Primary action buttons, active states, brand icon highlights, inline links — the only chromatic accent in an otherwise achromatic system. iOS-native vivid blue that makes functional elements feel switched on |
| Ink Black | `#000000` | `--color-ink-black` | Headings, primary borders, button text — maximum-contrast structural color |
| Graphite | `#3e3e3e` | `--color-graphite` | Body text, secondary borders — softer than black for sustained reading on white |
| Smoke | `#636363` | `--color-smoke` | Muted helper text, metadata labels, subtle borders |
| Paper White | `#ffffff` | `--color-paper-white` | Hairline borders, dividers, input outlines, and card edges on light surfaces. Do not promote it to the primary CTA color |
| Ash Mist | `#f7f7f7` | `--color-ash-mist` | Page canvas background, soft glow rings around cards and images, pale elevation halos |
| Dusk Gradient | `linear-gradient(180deg, #4a7ff2 0%, #7b7ed8 30%, #c98ab5 65%, #e8a87c 100%)` | `--color-dusk-gradient` | Hero background — sky-blue descending through violet to warm coral sunset with landscape silhouettes at the base. Defines the system's only atmospheric moment |

## Tokens — Typography

### Perfectly Nineties Regular — Display and heading — the signature editorial voice. Used exclusively for H1/H2 at 36-48px. The retro serif is the system's personality anchor, deliberately contrasting with Inter body to feel like a magazine, not a dashboard · `--font-perfectly-nineties-regular`
- **Substitute:** Playfair Display, DM Serif Display, or Recoleta
- **Weights:** 400
- **Sizes:** 36px, 48px
- **Line height:** 1.00
- **Letter spacing:** normal
- **OpenType features:** `"blwf", "cv03", "cv04", "cv09", "cv11"`
- **Role:** Display and heading — the signature editorial voice. Used exclusively for H1/H2 at 36-48px. The retro serif is the system's personality anchor, deliberately contrasting with Inter body to feel like a magazine, not a dashboard

### Inter — Body, nav, links, labels — the workhorse UI font. Weight 400 for body, 500 for nav/medium emphasis, 600 for button text. Tighter tracking gives it a refined iOS-native feel · `--font-inter`
- **Substitute:** SF Pro Text, -apple-system, Helvetica Neue
- **Weights:** 400, 500, 600
- **Sizes:** 10px, 12px, 14px, 16px, 18px
- **Line height:** 1.20-1.35
- **Letter spacing:** -0.02em
- **OpenType features:** `"blwf", "cv03", "cv04", "cv09", "cv11"`
- **Role:** Body, nav, links, labels — the workhorse UI font. Weight 400 for body, 500 for nav/medium emphasis, 600 for button text. Tighter tracking gives it a refined iOS-native feel

### System sans-serif — Utility/microcopy fallback — small inline metadata, secondary labels · `--font-system-sans-serif`
- **Substitute:** inherit Inter
- **Weights:** 400
- **Sizes:** 12px
- **Line height:** 1.20
- **Letter spacing:** normal
- **Role:** Utility/microcopy fallback — small inline metadata, secondary labels

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| micro | 10px | 1.2 | -0.2px | `--text-micro` |
| caption | 12px | 1.2 | -0.24px | `--text-caption` |
| body-sm | 14px | 1.3 | -0.28px | `--text-body-sm` |
| body | 16px | 1.35 | -0.32px | `--text-body` |
| heading-sm | 18px | 1.35 | -0.36px | `--text-heading-sm` |
| heading | 36px | 1 | — | `--text-heading` |
| display | 48px | 1 | — | `--text-display` |

## Tokens — Spacing & Shapes

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 5 | 5px | `--spacing-5` |
| 6 | 6px | `--spacing-6` |
| 8 | 8px | `--spacing-8` |
| 10 | 10px | `--spacing-10` |
| 12 | 12px | `--spacing-12` |
| 14 | 14px | `--spacing-14` |
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 36 | 36px | `--spacing-36` |
| 40 | 40px | `--spacing-40` |
| 45 | 45px | `--spacing-45` |
| 60 | 60px | `--spacing-60` |
| 80 | 80px | `--spacing-80` |
| 100 | 100px | `--spacing-100` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 22px |
| cards | 22-30px |
| badges | 50px |
| images | 30-40px |
| buttons | 50px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| subtle | `rgb(247, 247, 247) 0px 0px 0px 5px` | `--shadow-subtle` |
| subtle-2 | `rgba(255, 255, 255, 0.6) 0px 0.5px 0px 0.5px inset, rgba(...` | `--shadow-subtle-2` |
| subtle-3 | `rgba(255, 255, 255, 0.6) 0px 0.5px 0px 0.5px inset` | `--shadow-subtle-3` |
| subtle-4 | `rgb(247, 247, 247) 0px 0px 0px 1px` | `--shadow-subtle-4` |
| subtle-5 | `rgb(255, 255, 255) 0px 1px 0px 0px inset, rgba(0, 0, 0, 0...` | `--shadow-subtle-5` |
| subtle-6 | `rgb(140, 194, 255) 0px 1px 0px 1px inset` | `--shadow-subtle-6` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80-120px
- **Card padding:** 20px
- **Element gap:** 10px

## Components

### Hero Pill Button
**Role:** Primary CTA on the gradient hero — the most visible interactive element on the page

50px border-radius, #ffffff background, #000000 text in Inter 600 at 14-16px, padding 14px 24px. No border. The white-on-gradient contrast makes it the clear action target against the blue-to-coral backdrop

### Ghost Pill Button
**Role:** Secondary CTA or cancel action

50px border-radius, transparent background, 1.5px #000000 border, #000000 text in Inter 500 at 14-16px, padding 12px 22px. Outlined only — never filled

### Floating Nav Capsule
**Role:** Top-level site navigation — replaces a traditional full-width header bar

22px border-radius, #ffffff background, 1px border with 5px #f7f7f7 soft glow ring. Contains brand mark (gradient circle icon + 'Portal' wordmark in Inter 600 18px) on left, nav links (Product, Blog, Contact in Inter 500 14px #000000) on right. Padding 8px 16px. Floats with 16-24px top margin

### Device Mockup Card
**Role:** Product showcase frame in the hero — contains the Portal app interface preview

Outer frame at 22-30px border-radius, #ffffff background, 5px #f7f7f7 glow ring as elevation. Inner screen area shows the Portal product UI at 16px border-radius. The mockup overlaps into the landscape silhouette at the hero's bottom

### Editorial Content Block
**Role:** Below-the-fold text sections on the white/light canvas

Centered or left-aligned text column at 640-720px max reading width. H2 in Perfectly Nineties 400 at 36px, #000000, line-height 1.0. Body in Inter 400 at 16px, #3e3e3, line-height 1.35, letter-spacing -0.32px. Paragraphs separated by 16-20px gap. Section gap 80-120px from adjacent blocks

### Brand Mark Icon
**Role:** Logo lockup in the nav capsule and footer

Circular icon with blue-to-violet gradient (matches hero gradient mid-tones), containing a white paper-plane or forward-arrow glyph. Paired with 'Portal' wordmark in Inter 600 18px, #000000. Icon-to-text gap 8px

### Project Card
**Role:** Inside the Portal product UI — individual project portal entries

16-22px border-radius, #ffffff background, 1px #f7f7f7 border or soft glow. Padding 20px. Project title in Inter 600 16px, metadata in Inter 400 14px #636363, status badges below

### Status Badge
**Role:** Project status indicators in the product UI

50px border-radius full pill, Inter 500 12px text, padding 4px 10px. Subtle #f7f7f7 background for neutral states, #007aff-tinted background for active/paid states

### Nav Link Item
**Role:** Individual link in the floating nav capsule

Inter 500 14px, #000000, 8px horizontal padding, 4px vertical padding. No underline. Hover: opacity 0.6 or subtle color transition

### Soft Glow Ring
**Role:** Elevation substitute — surrounds cards, mockups, and floating images

0px 0px 0px 5px #f7f7f7 — a pale outline that creates the sense of light emanating from the element rather than a traditional drop shadow. The system's depth language

### Hero Gradient Background
**Role:** Full-bleed atmospheric hero section

180deg linear gradient from #4a7ff2 (sky-blue) at top through #7b7ed8 (violet) to #c98ab5 (mauve) and #e8a87c (warm coral) at the bottom, with dark landscape tree/horizon silhouettes along the bottom 15-20% of the viewport

## Do's and Don'ts

### Do
- Set all display headings in Perfectly Nineties Regular at 36-48px, line-height 1.0, weight 400 — this serif is the system's signature voice and must not be diluted by using it at smaller sizes
- Use #007aff exclusively for functional accents: primary CTA fills, active states, brand icon highlights, and inline links. Never use it for decorative backgrounds or large surface fills
- Make every button a full pill at 50px border-radius with no exception — 12-14px vertical padding, 20-24px horizontal padding
- Keep body text in Inter at 14-16px, line-height 1.30-1.35, with -0.02em letter-spacing for a refined iOS-native feel
- Round all card and image corners to 22-30px — the generous radii are what give the system its soft, premium character
- Default the page canvas to #f7f7f7 with cards on #ffffff. Use the 5px #f7f7f7 glow ring as your primary elevation technique instead of drop shadows
- Use #000000 for headings and primary borders only; switch to #3e3e3 for body text and #636363 for muted helper text and secondary metadata

### Don't
- Don't introduce a second chromatic accent color — the system is monochromatic plus exactly one blue (#007aff)
- Don't use Perfectly Nineties for body text, captions, buttons, or UI labels — it is display-only at 36px and above
- Don't apply drop shadows heavier than the 5px #f7f7f7 glow ring or 1px #000000 outline — heavy shadows break the flat editorial feel
- Don't use sharp corners (0-4px radius) on any interactive element or card — minimum 7px, prefer 16px+ for cards and 50px for buttons
- Don't set body text below 14px in Inter or above weight 600 — the weight range is the system's restraint mechanism
- Don't place #000000 text directly on a chromatic or gradient background — text must sit on white or #f7f7f7 surfaces only
- Don't use #007aff for large fills, hero backgrounds, or decorative shapes — it is a functional accent, not a surface color

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Page Canvas | `#f7f7f7` | Base background for all content sections below the hero gradient |
| 1 | Card Surface | `#ffffff` | Product cards, project entries, content blocks sitting on the canvas |
| 2 | Nav Pill | `#ffffff` | Floating navigation capsule with #f7f7f7 soft glow ring |
| 3 | Hero Atmosphere | `#7a7fd4` | Full-bleed gradient background for the hero section — the only chromatic surface in the system |

## Elevation

- **Cards and mockups:** `0px 0px 0px 5px #f7f7f7`
- **Filled buttons:** `inset 0 1px 0 0 #ffffff, 0 0 0 1px rgba(0,0,0,0.15), 0 3px 2px 0 rgba(0,0,0,0.06)`

## Imagery

The hero is the only atmospheric visual: a full-bleed gradient sunset landscape (blue sky through violet to coral) with silhouetted tree horizons along the bottom edge. All other imagery is product screenshots presented inside white device-frame mockups with soft glow rings. There is no lifestyle photography, no stock imagery, and no illustrations. The product UI itself (shown in the device mockup) uses white cards with clean typography and small inline data elements. The visual strategy is one dramatic atmospheric moment (the hero) followed by pure UI and editorial typography. The blue brand accent (#007aff) appears in the gradient brand icon and as functional highlights in the product UI — never as decorative imagery.

## Layout

Centered max-width layout at approximately 1200px. The hero is full-bleed with the gradient extending edge-to-edge, and a device mockup overlapping the bottom into a landscape silhouette. Below the hero, content flows on a #f7f7f7 canvas with centered or left-aligned text columns at 640-720px reading width. Section gaps are generous (80-120px) to let the editorial typography breathe. The navigation is a floating pill capsule anchored at the top of the viewport with margin, not a full-width bar. Content sections are single-column and text-dominant — no multi-column grids or card grids in the marketing sections. The product mockup is the only visual element competing with text in the hero composition.

## Agent Prompt Guide

## Quick Color Reference
- text (headings): #000000
- text (body): #3e3e3e
- text (muted): #636363
- background (canvas): #f7f7f7
- background (card): #ffffff
- border: #000000 (primary) / #f7f7f7 (soft glow ring)
- accent: #007aff
- primary action: #007aff (filled action)

## Example Component Prompts

1. Create a Primary Action Button: #007aff background, #ffffff text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.

2. **Floating nav capsule**: White #ffffff background, 22px border-radius, 1px subtle border with 5px #f7f7f7 soft glow ring. Left: gradient circle icon (40px, blue-to-violet gradient) + 'Portal' wordmark in Inter 600 18px #000000. Right: 'Product', 'Blog', 'Contact' in Inter 500 14px #000000, separated by 20px gaps. Container padding 8px 16px. Float at top with 20px margin.

3. **Editorial content block**: Centered on #f7f7f7 canvas, max-width 640px. H2 in Perfectly Nineties Regular 400 at 36px, #000000, line-height 1.0. Body paragraph in Inter 400 at 16px, #3e3e3e, line-height 1.35, letter-spacing -0.32px. Paragraph margin-bottom 20px. Section gap 100px above and below.

4. **Device mockup card**: White #ffffff frame at 22px border-radius, 5px #f7f7f7 glow ring. Inner screen area: #ffffff background, project card with 16px border-radius containing a title in Inter 600 16px #000000, metadata in Inter 400 14px #636363, and a status badge (50px radius pill, Inter 500 12px).

5. **Ghost nav link**: Inter 500 14px, #000000, padding 4px 8px, no underline, no border. Hover: opacity 0.6 with 200ms transition. Set inside a white #ffffff nav capsule with 22px border-radius.

## Signature Choices

What makes this system visually distinctive from the sea of generic SaaS landing pages:

- **Retro serif in a tech product**: Perfectly Nineties Regular at display sizes is anti-convention for SaaS. Most startups use geometric sans for everything. The serif creates a magazine/editorial voice that signals craft and taste over speed and engineering.

- **Single iOS-blue accent**: #007aff is Apple's system blue. Using it as the only chromatic accent in an otherwise achromatic system is a deliberate native-aesthetic choice — it makes the product feel at home on macOS/iOS without copying Apple wholesale.

- **Glow rings instead of shadows**: The 5px #f7f7f7 halo around cards and mockups is a depth technique borrowed from visionOS/frosted glass. It whispers elevation rather than declaring it with a drop shadow.

- **50px pill buttons**: Full rounding on all interactive elements. The pill is the system's gesture toward softness — combined with the serif headlines, it creates a product that feels handcrafted rather than engineered.

- **Hero as atmosphere, not pitch**: The gradient landscape hero doesn't show a dashboard screenshot or a feature list — it sets a mood. The product earns attention through beauty, not claims. This is unusual in a productivity SaaS category that typically leads with product screenshots.

## Similar Brands

- **Linear** — Same monochromatic palette with a single vivid accent color, generous rounded corners, and clean Inter-based UI typography
- **Pitch** — Editorial display-serif headlines paired with minimal sans-serif body, clean white surfaces, and restrained accent usage
- **Framer** — Magazine-style editorial layout with dramatic hero visuals and large confident serif type treatment
- **Arc Browser** — Distinctive gradient brand identity with soft, generous rounded shapes and a single functional accent color

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-signal-blue: #007aff;
  --color-ink-black: #000000;
  --color-graphite: #3e3e3e;
  --color-smoke: #636363;
  --color-paper-white: #ffffff;
  --color-ash-mist: #f7f7f7;
  --color-dusk-gradient: #7a7fd4;
  --gradient-dusk-gradient: linear-gradient(180deg, #4a7ff2 0%, #7b7ed8 30%, #c98ab5 65%, #e8a87c 100%);

  /* Typography — Font Families */
  --font-perfectly-nineties-regular: 'Perfectly Nineties Regular', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-system-sans-serif: 'System sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-micro: 10px;
  --leading-micro: 1.2;
  --tracking-micro: -0.2px;
  --text-caption: 12px;
  --leading-caption: 1.2;
  --tracking-caption: -0.24px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.3;
  --tracking-body-sm: -0.28px;
  --text-body: 16px;
  --leading-body: 1.35;
  --tracking-body: -0.32px;
  --text-heading-sm: 18px;
  --leading-heading-sm: 1.35;
  --tracking-heading-sm: -0.36px;
  --text-heading: 36px;
  --leading-heading: 1;
  --text-display: 48px;
  --leading-display: 1;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-5: 5px;
  --spacing-6: 6px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-14: 14px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-45: 45px;
  --spacing-60: 60px;
  --spacing-80: 80px;
  --spacing-100: 100px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80-120px;
  --card-padding: 20px;
  --element-gap: 10px;

  /* Border Radius */
  --radius-md: 7px;
  --radius-2xl: 16px;
  --radius-2xl-2: 22px;
  --radius-3xl: 26px;
  --radius-3xl-2: 30px;
  --radius-3xl-3: 40px;
  --radius-full: 50px;

  /* Named Radii */
  --radius-nav: 22px;
  --radius-cards: 22-30px;
  --radius-badges: 50px;
  --radius-images: 30-40px;
  --radius-buttons: 50px;

  /* Shadows */
  --shadow-subtle: rgb(247, 247, 247) 0px 0px 0px 5px;
  --shadow-subtle-2: rgba(255, 255, 255, 0.6) 0px 0.5px 0px 0.5px inset, rgba(255, 255, 255, 0.4) 0px 0px 30px 0px inset, rgba(255, 255, 255, 0.8) 0px 0px 12px 0px inset;
  --shadow-subtle-3: rgba(255, 255, 255, 0.6) 0px 0.5px 0px 0.5px inset;
  --shadow-subtle-4: rgb(247, 247, 247) 0px 0px 0px 1px;
  --shadow-subtle-5: rgb(255, 255, 255) 0px 1px 0px 0px inset, rgba(0, 0, 0, 0.15) 0px 0px 0px 1px, rgba(0, 0, 0, 0.06) 0px 3px 2px 0px;
  --shadow-subtle-6: rgb(140, 194, 255) 0px 1px 0px 1px inset;

  /* Surfaces */
  --surface-page-canvas: #f7f7f7;
  --surface-card-surface: #ffffff;
  --surface-nav-pill: #ffffff;
  --surface-hero-atmosphere: #7a7fd4;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-signal-blue: #007aff;
  --color-ink-black: #000000;
  --color-graphite: #3e3e3e;
  --color-smoke: #636363;
  --color-paper-white: #ffffff;
  --color-ash-mist: #f7f7f7;
  --color-dusk-gradient: #7a7fd4;

  /* Typography */
  --font-perfectly-nineties-regular: 'Perfectly Nineties Regular', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-system-sans-serif: 'System sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-micro: 10px;
  --leading-micro: 1.2;
  --tracking-micro: -0.2px;
  --text-caption: 12px;
  --leading-caption: 1.2;
  --tracking-caption: -0.24px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.3;
  --tracking-body-sm: -0.28px;
  --text-body: 16px;
  --leading-body: 1.35;
  --tracking-body: -0.32px;
  --text-heading-sm: 18px;
  --leading-heading-sm: 1.35;
  --tracking-heading-sm: -0.36px;
  --text-heading: 36px;
  --leading-heading: 1;
  --text-display: 48px;
  --leading-display: 1;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-5: 5px;
  --spacing-6: 6px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-14: 14px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-45: 45px;
  --spacing-60: 60px;
  --spacing-80: 80px;
  --spacing-100: 100px;

  /* Border Radius */
  --radius-md: 7px;
  --radius-2xl: 16px;
  --radius-2xl-2: 22px;
  --radius-3xl: 26px;
  --radius-3xl-2: 30px;
  --radius-3xl-3: 40px;
  --radius-full: 50px;

  /* Shadows */
  --shadow-subtle: rgb(247, 247, 247) 0px 0px 0px 5px;
  --shadow-subtle-2: rgba(255, 255, 255, 0.6) 0px 0.5px 0px 0.5px inset, rgba(255, 255, 255, 0.4) 0px 0px 30px 0px inset, rgba(255, 255, 255, 0.8) 0px 0px 12px 0px inset;
  --shadow-subtle-3: rgba(255, 255, 255, 0.6) 0px 0.5px 0px 0.5px inset;
  --shadow-subtle-4: rgb(247, 247, 247) 0px 0px 0px 1px;
  --shadow-subtle-5: rgb(255, 255, 255) 0px 1px 0px 0px inset, rgba(0, 0, 0, 0.15) 0px 0px 0px 1px, rgba(0, 0, 0, 0.06) 0px 3px 2px 0px;
  --shadow-subtle-6: rgb(140, 194, 255) 0px 1px 0px 1px inset;
}
```
