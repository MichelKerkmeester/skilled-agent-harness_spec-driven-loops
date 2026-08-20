# Base44 — Style Reference
> sunlit notepad with a lime highlighter

**Theme:** light

Base44 operates in a sunlit, near-monochrome workspace language: a warm off-white canvas (#faf9f7) holds flat white cards with whisper-thin borders and almost no shadow, letting air and generous spacing carry the visual weight. Typography splits between a custom geometric sans for UI chrome and a lighter display face for headlines that breathe at 48-56px with tight tracking — authority through spaciousness, not density. Three signature colors punctuate this quiet system: a lime-green CTA (#ebffb1 fill, #ade900 border) that makes the primary action glow like a fresh highlighter, a vivid orange (#ff631f) reserved for the logo and decorative accents, and a sunset gradient band that breaks the monochrome with warmth. Components feel lightweight and fast — fully-rounded pill buttons, 8px-radius cards, ghost inputs, and minimal elevation. Motion is gentle and spring-like (cubic-bezier(0.22, 1, 0.36, 1)) with everything easing into place rather than snapping.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Canvas Bone | `#faf9f7` | `--color-canvas-bone` | Page background, section bands, large surface fills — the warm off-white that defines the entire atmosphere |
| Card White | `#ffffff` | `--color-card-white` | Card surfaces, elevated panels, input backgrounds, footer — pure white sitting on the bone canvas |
| Ink Black | `#0f0f0f` | `--color-ink-black` | Primary text, filled action buttons, icon strokes, nav color — the dominant near-black that carries all type and the filled dark CTA |
| Graphite | `#232529` | `--color-graphite` | Secondary text, button text, nav strokes — slightly softer than Ink Black for de-emphasized copy |
| Hairline | `#d1d1d1` | `--color-hairline` | Default 1px borders on cards, inputs, dividers — the thinnest structural line |
| Soft Border | `#e6e6e6` | `--color-soft-border` | Secondary borders, subtle surface backgrounds — softer than Hairline for nested edges |
| Muted Ink | `#a0a0a0` | `--color-muted-ink` | Tertiary text, disabled states, muted icon strokes |
| Lime Wash | `#ebffb1` | `--color-lime-wash` | Primary CTA fill (Start Building button) — a pale lime that glows against the bone canvas like a fresh highlighter mark |
| Lime Edge | `#ade900` | `--color-lime-edge` | Green accent for outlined action borders, linked labels, and lightweight interactive emphasis. Do not promote it to the primary CTA color |
| Ember Orange | `#ff631f` | `--color-ember-orange` | Logo color, decorative fill accents, secondary action — vivid orange used sparingly to anchor brand identity |
| Sunset Gradient | `linear-gradient(rgba(250, 249, 247, 0) 2.46%, rgb(255, 240, 222) 23.04%, rgb(255, 174, 83) 54.09%, rgba(255, 174, 83, 0) 93.84%)` | `--color-sunset-gradient` | Full-bleed section banner — a warm peach-to-coral gradient used as a single atmospheric band between content sections |
| Sky Wash | `radial-gradient(97.22% 78.13% at 50% -21%, rgb(93, 179, 207) 22.39%, rgba(145, 201, 220, 0.56) 58.43%, rgba(250, 249, 247, 0) 85.73%)` | `--color-sky-wash` | Hero radial gradient — a cool blue-cyan that radiates from the top of the hero section, giving the page an airy open-sky feeling |

## Tokens — Typography

### WixMadeforText — Primary UI sans — body text, buttons, nav, inputs, badges, all chrome. The geometric forms and slightly expanded tracking on small sizes (0.025em at 12px, 0.18em uppercase) give it a friendly, slightly humanist feel that keeps 16px body text comfortable to scan · `--font-wixmadefortext`
- **Substitute:** Inter
- **Weights:** 400, 500, 700
- **Sizes:** 12, 14, 16, 18
- **Line height:** 1.25, 1.30, 1.50
- **Letter spacing:** 0.025em at 12px, 0.18em uppercase at 12px, normal at 16px
- **Role:** Primary UI sans — body text, buttons, nav, inputs, badges, all chrome. The geometric forms and slightly expanded tracking on small sizes (0.025em at 12px, 0.18em uppercase) give it a friendly, slightly humanist feel that keeps 16px body text comfortable to scan

### WixMisoRegular — Display headline face — used at 48-56px with tight tracking (-0.02em) and very tight line-height (1.05). The single weight at 400 creates a calm, confident headline that doesn't shout — authority through spaciousness. Body sizes (20-24px) share the same character, keeping the type system coherent across scales · `--font-wixmisoregular`
- **Substitute:** DM Serif Display or Source Serif Pro at matching weight
- **Weights:** 400
- **Sizes:** 20, 24, 48, 54, 56
- **Line height:** 1.05, 1.10, 1.20, 1.42
- **Letter spacing:** -0.0200em
- **Role:** Display headline face — used at 48-56px with tight tracking (-0.02em) and very tight line-height (1.05). The single weight at 400 creates a calm, confident headline that doesn't shout — authority through spaciousness. Body sizes (20-24px) share the same character, keeping the type system coherent across scales

### WixMisoLight — Secondary display — lighter weight version for subheadings (25px) and lead body text (17px), creating tonal contrast against the Regular headlines. Same family guarantees harmony while the weight difference adds hierarchy without size jumps · `--font-wixmisolight`
- **Substitute:** DM Serif Display Light or a lighter serif like Lora at matching weight
- **Weights:** 400 (light cut)
- **Sizes:** 17, 25
- **Line height:** 1.20, 1.50
- **Role:** Secondary display — lighter weight version for subheadings (25px) and lead body text (17px), creating tonal contrast against the Regular headlines. Same family guarantees harmony while the weight difference adds hierarchy without size jumps

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.25 | 0.3px | `--text-caption` |
| body-sm | 14px | 1.5 | — | `--text-body-sm` |
| body | 16px | 1.5 | — | `--text-body` |
| subheading | 20px | 1.1 | — | `--text-subheading` |
| heading-sm | 25px | 1.2 | — | `--text-heading-sm` |
| heading | 48px | 1.05 | -0.96px | `--text-heading` |
| heading-lg | 54px | 1.2 | — | `--text-heading-lg` |
| display | 56px | 1.05 | — | `--text-display` |

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
| 80 | 80px | `--spacing-80` |
| 120 | 120px | `--spacing-120` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 9999px |
| cards | 8px |
| inputs | 8px |
| buttons | 9999px |
| large-cards | 30px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| lg | `rgba(0, 0, 0, 0.07) 0px 6px 20px 0px` | `--shadow-lg` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 24px
- **Element gap:** 16px

## Components

### Lime CTA Pill
**Role:** Primary action button

Fully rounded pill (9999px radius), filled #ebffb1 with a 1px #ade900 border, #0f0f0f text, 8px/16px padding, 14-16px WixMadeforText weight 500. The lime-on-lime-edge combo makes the primary action glow — it should be the most colorful element on any page

### Ink Filled Pill
**Role:** Secondary dark action

Fully rounded pill (9999px radius), solid #0f0f0f fill with #ffffff text, 0px/21.6px horizontal padding. Used for dark-mode CTAs and 'Get started' variants where the lime pill isn't appropriate

### Ghost Pill Button
**Role:** Tertiary action, suggestion chips

Transparent background, #232529 or #0f0f0f text, 1px #d1d1d1 border, 9999px radius, 8px/12px padding. Used for the suggestion chips ('Reporting Dashboard', 'Gaming Platform') beneath the hero input

### Frosted Nav Pill
**Role:** Sticky header CTA container

Semi-transparent white background (rgba(255,255,255,0.4)) with backdrop-filter blur(6px), 9999px radius, 1px border at rgba(15,15,15,0.15). The frosted-glass treatment makes the nav feel weightless and floating

### Text Link Button
**Role:** Inline nav and footer links

No background, no border, #0f0f0f text at 16px WixMadeforText weight 400. Zero padding — sits inline with nav items. Underline appears on hover only

### Flat White Card
**Role:** Standard content card, FAQ items, feature blocks

Pure white #ffffff fill, 8px radius, 1px #d1d1d1 border, no shadow, 24px padding. The absence of shadow keeps the page feeling flat and architectural — hierarchy comes from background contrast (white card on bone canvas), not elevation

### Soft Shadow Card
**Role:** Hero input container, elevated prompt card

Near-white #fefcfb fill, 30px radius, soft shadow rgba(0,0,0,0.07) 0px 6px 20px 0px. Used sparingly — only for the central hero input and elements that need to feel lifted and interactive. The 30px radius is much larger than standard cards, marking it as a 'focal' surface

### Ghost Input
**Role:** Prompt input, search field

Transparent background inside a Soft Shadow Card container, no border, #0f0f0f placeholder text, 25px top padding, 16px horizontal padding, 28px left padding (for icon). The input feels like writing on a clean sheet rather than filling a form field

### Orange Submit Circle
**Role:** Action trigger inside input

Solid #ff631f fill, circular shape (~40px), white arrow icon centered. The vivid orange against the white card creates a single hot-spot of color — the one moment where the brand orange becomes functional

### Uppercase Eyebrow Label
**Role:** Section labels, category tags

12px WixMadeforText weight 500, letter-spacing 0.18em, uppercase, #232529 color. Used for labels like 'NOT SURE WHERE TO START? TRY ONE OF THESE:' — the wide tracking transforms small text into architectural labels

### Accordion FAQ Row
**Role:** FAQ item

No background, no card — just a 1px #d1d1d1 bottom border, full-width row, question text in WixMadeforText 16px #0f0f0f, plus icon on the right. The flat list with hairline dividers replaces traditional card-based FAQs

### Top Navigation Bar
**Role:** Site header

Sticky header, #faf9f7 background, max-width 1200px centered, logo left (orange disc + black wordmark), nav links centered (Product, Use Cases, Resources, Pricing, Enterprise), language toggle + frosted lime CTA right. Height ~56px

### Sunset Gradient Band
**Role:** Atmospheric section divider

Full-bleed band using the sunset gradient (transparent → peach #ffe0de → orange #ffae53 → coral #ff7f47 → transparent). Used as a single horizontal band between content sections to break the monochrome without requiring a full dark section

## Do's and Don'ts

### Do
- Use WixMisoRegular at 48-56px weight 400 with -0.96px tracking for all primary headlines — the single-weight serif creates calm authority without shouting
- Set all buttons and tags to 9999px (pill) radius — the fully-rounded shape is the system's defining silhouette
- Use #ebffb1 fill + #ade900 border for the primary CTA, never plain black or blue — the lime glow is the brand's signature action
- Maintain hairline borders at 1px #d1d1d1 for all structural dividers — never use heavier borders or visible elevation to separate content
- Keep the page canvas at #faf9f7 (warm bone) and use #ffffff only for cards that need to lift off the canvas — the two-tone surface system is the entire depth model
- Apply the uppercase eyebrow label treatment (12px, 0.18em tracking, weight 500) to all section labels — it transforms small text into architectural wayfinding
- Use cubic-bezier(0.22, 1, 0.36, 1) for all entrance animations — the spring-like ease-out matches the warm, unhurried atmosphere

### Don't
- Don't add drop shadows to cards — the system uses background contrast (white on bone) for hierarchy, not elevation. Reserve the single shadow for the hero prompt card only
- Don't use #ff631f orange on text or large fills — it's reserved for the logo, decorative accents, and the submit circle inside the input
- Don't set headline weight above 400 — the system uses weight and tracking for hierarchy, not boldness. Heavier weights would break the calm, spacious feel
- Don't use saturated blue for links or actions — the system has no traditional 'info blue'; interactive elements are either lime, black, or ghost
- Don't create dark sections — the page is entirely light-mode. Use the sunset gradient band for atmospheric breaks, never a full dark background
- Don't use borders heavier than 1px — the hairline aesthetic is the entire structural language. Thicker borders feel heavy and corporate
- Don't use corner radii below 8px on any surface — the system rounds generously (8px cards, 30px hero card, 9999px pills). Sharp corners clash with the warm, friendly tone

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas Bone | `#faf9f7` | Page background, large section fills — the warm off-white that defines atmosphere |
| 1 | Card White | `#ffffff` | Content cards, FAQ rows, standard elevated surfaces — pure white sitting on bone |
| 2 | Soft Cream | `#fefcfb` | Hero prompt card, focal interactive surfaces — nearly-white cream with the single soft shadow |
| 3 | Lime Wash | `#ebffb1` | Primary CTA fill — the action surface that breaks the monochrome |

## Elevation

Elevation is deliberately minimal: most surfaces are flat with hairline borders, and the single soft shadow (rgba(0,0,0,0.07) 0px 6px 20px) is reserved for the hero prompt card only. Depth comes from background contrast (white card on bone canvas) and generous spacing, not from stacked shadows. The system treats elevation as an exception, not a tool.

## Imagery

Imagery is minimal and product-focused: the hero features a centered prompt-input card (the product itself as the hero visual), followed by full-bleed gradient bands (sky-blue radial wash, sunset horizontal band) that act as atmospheric dividers rather than decorative images. No photography, no stock illustrations, no product screenshots in the visible sections. Icons are simple line/stroke style in #0f0f0f, with the brand logo using a solid orange disc with black horizontal lines (a stylized database/server icon). The visual density is text-dominant with the product UI (the input card) serving as the primary visual anchor.

## Layout

Max-width 1200px centered container with generous side padding. The hero is a full-bleed light section with a centered headline stack (56px display + 18px subtext) and the prompt input card as the visual anchor, all sitting under a sky-blue radial gradient wash. Below the hero, a full-bleed sunset gradient band breaks the monochrome before returning to the bone canvas for content sections. Section rhythm is consistent: large vertical breathing room (~80px section gaps), centered text stacks alternating with asymmetric two-column layouts. The FAQ section uses a split layout: left-aligned heading column and right-aligned accordion list. Navigation is a sticky top bar with frosted-glass CTA pill, logo left, centered nav, and actions right. The footer is a dark band (contrasting with the light body) at the very bottom.

## Agent Prompt Guide

primary action: #0f0f0f (filled action)
Create a Primary Action Button: #0f0f0f background, #ffffff text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.
## Quick Color Reference
- Text (primary): #0f0f0f
- Text (secondary): #232529
- Background (canvas): #faf9f7
- Surface (card): #ffffff
- Border (hairline): #d1d1d1

## Example Component Prompts

1. **Hero prompt card**: White #fefcfb surface, 30px border-radius, soft shadow rgba(0,0,0,0.07) 0px 6px 20px. Inside: transparent ghost input with #0f0f0f placeholder text, 25px top padding, 28px left padding for icon. Orange #ff631f circular submit button (~40px) on the right with white arrow icon.


3. **FAQ accordion row**: Full-width row with 1px #d1d5 bottom border, no background, WixMadeforText 16px #0f0f0f question text left-aligned, plus icon (#0f0f0f stroke) right-aligned. No card wrapping, no padding beyond vertical breathing room.

4. **Display headline**: WixMisoRegular 48px weight 400, #0f0f0f color, line-height 1.05, letter-spacing -0.96px. Centered or left-aligned on #faf9f7 canvas. Never bold — the single weight at 400 is the entire hierarchy tool.

5. **Uppercase eyebrow label**: WixMadeforText 12px weight 500, letter-spacing 0.18em, uppercase, #232529 color. Place above section headings as wayfinding — the wide tracking transforms small text into an architectural label.

## Motion Philosophy

Motion is gentle and spring-like, matching the warm unhurried atmosphere. Primary easing: cubic-bezier(0.22, 1, 0.36, 1) for entrances (spring-out), standard ease for color/border transitions (0.15-0.16s). The named animation 'fade-in-up' handles content entrance. Durations are short (0.15-0.3s for micro-interactions, up to 2s for ambient animations). Everything transitions: color, background-color, border-color, fill, stroke, transform, and opacity — but never layout properties. The frosted nav pill uses backdrop-filter blur(6px) to create a floating weightless header.

## Similar Brands

- **Linear** — Same single-accent approach — Linear uses a purple action color against a dark canvas; Base44 uses lime against a warm bone canvas with the same restraint
- **Vercel** — Both use generous whitespace, hairline borders, and minimal elevation; Vercel's Geist typography and Base44's WixMiso share the same single-weight display approach
- **Framer** — Same fully-rounded pill buttons, warm off-white canvas, and atmospheric gradient bands breaking up monochrome content sections
- **Notion** — Both use a nearly-monochrome palette with a single vivid accent color, ghost inputs that feel like writing on paper, and generous spacing that lets content breathe

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-canvas-bone: #faf9f7;
  --color-card-white: #ffffff;
  --color-ink-black: #0f0f0f;
  --color-graphite: #232529;
  --color-hairline: #d1d1d1;
  --color-soft-border: #e6e6e6;
  --color-muted-ink: #a0a0a0;
  --color-lime-wash: #ebffb1;
  --color-lime-edge: #ade900;
  --color-ember-orange: #ff631f;
  --color-sunset-gradient: #ffae53;
  --gradient-sunset-gradient: linear-gradient(rgba(250, 249, 247, 0) 2.46%, rgb(255, 240, 222) 23.04%, rgb(255, 174, 83) 54.09%, rgba(255, 174, 83, 0) 93.84%);
  --color-sky-wash: #5db3cf;
  --gradient-sky-wash: radial-gradient(97.22% 78.13% at 50% -21%, rgb(93, 179, 207) 22.39%, rgba(145, 201, 220, 0.56) 58.43%, rgba(250, 249, 247, 0) 85.73%);

  /* Typography — Font Families */
  --font-wixmadefortext: 'WixMadeforText', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-wixmisoregular: 'WixMisoRegular', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-wixmisolight: 'WixMisoLight', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.25;
  --tracking-caption: 0.3px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 20px;
  --leading-subheading: 1.1;
  --text-heading-sm: 25px;
  --leading-heading-sm: 1.2;
  --text-heading: 48px;
  --leading-heading: 1.05;
  --tracking-heading: -0.96px;
  --text-heading-lg: 54px;
  --leading-heading-lg: 1.2;
  --text-display: 56px;
  --leading-display: 1.05;

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
  --spacing-80: 80px;
  --spacing-120: 120px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 24px;
  --element-gap: 16px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-xl: 14px;
  --radius-3xl: 30px;
  --radius-full: 70px;
  --radius-full-2: 200px;
  --radius-full-3: 9999px;

  /* Named Radii */
  --radius-tags: 9999px;
  --radius-cards: 8px;
  --radius-inputs: 8px;
  --radius-buttons: 9999px;
  --radius-large-cards: 30px;

  /* Shadows */
  --shadow-lg: rgba(0, 0, 0, 0.07) 0px 6px 20px 0px;

  /* Surfaces */
  --surface-canvas-bone: #faf9f7;
  --surface-card-white: #ffffff;
  --surface-soft-cream: #fefcfb;
  --surface-lime-wash: #ebffb1;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-canvas-bone: #faf9f7;
  --color-card-white: #ffffff;
  --color-ink-black: #0f0f0f;
  --color-graphite: #232529;
  --color-hairline: #d1d1d1;
  --color-soft-border: #e6e6e6;
  --color-muted-ink: #a0a0a0;
  --color-lime-wash: #ebffb1;
  --color-lime-edge: #ade900;
  --color-ember-orange: #ff631f;
  --color-sunset-gradient: #ffae53;
  --color-sky-wash: #5db3cf;

  /* Typography */
  --font-wixmadefortext: 'WixMadeforText', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-wixmisoregular: 'WixMisoRegular', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-wixmisolight: 'WixMisoLight', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.25;
  --tracking-caption: 0.3px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 20px;
  --leading-subheading: 1.1;
  --text-heading-sm: 25px;
  --leading-heading-sm: 1.2;
  --text-heading: 48px;
  --leading-heading: 1.05;
  --tracking-heading: -0.96px;
  --text-heading-lg: 54px;
  --leading-heading-lg: 1.2;
  --text-display: 56px;
  --leading-display: 1.05;

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
  --spacing-80: 80px;
  --spacing-120: 120px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-xl: 14px;
  --radius-3xl: 30px;
  --radius-full: 70px;
  --radius-full-2: 200px;
  --radius-full-3: 9999px;

  /* Shadows */
  --shadow-lg: rgba(0, 0, 0, 0.07) 0px 6px 20px 0px;
}
```
