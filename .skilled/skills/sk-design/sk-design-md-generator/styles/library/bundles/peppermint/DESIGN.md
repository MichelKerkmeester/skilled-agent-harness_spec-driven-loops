# Peppermint — Style Reference
> Midnight canvas with playful streamers — a deep navy void where hand-drawn ribbons and geometric type dance above warm cream paper surfaces.

**Theme:** dark

Peppermint runs on a midnight-canvas principle: a near-black indigo (#0a1d4b) saturates the page as both background and brand DNA, giving the site the feeling of a deep-ocean screen where bold illustrations and geometric type float free. Excon's display cuts — tightly tracked, geometric, editorial — are the visual signature, paired with Generalsans' humanist warmth for everything conversational. The system deliberately alternates between dark immersion bands and warm cream (#fcf6ea, #faedd2) paper-surfaces, so heavy content areas (FAQ, forms) feel grounded in tactile warmth rather than floating in the void. Hand-drawn illustrations with flowing ribbon strokes in pink, teal, and ice-blue do the heavy atmospheric lifting — there is no photography, no gradients, no decorative shadows. Components are confidently round (24px cards, 48–100px pill buttons) and sit on the canvas with color contrast alone rather than elevation.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Midnight Sapphire | `#0a1d4b` | `--color-midnight-sapphire` | Primary canvas for hero and feature bands, body text on cream surfaces, outlined action borders — the void that everything floats on |
| Bright Violet | `#9c8bf9` | `--color-bright-violet` | Rare accent fill for highlight buttons and emphasis moments — a vivid punctuation against the matte navy canvas |
| Deep Indigo | `#162d67` | `--color-deep-indigo` | Elevated card surface against the main canvas — one step lighter than Midnight Sapphire, used for nested feature cards |
| Slate Violet | `#3a486b` | `--color-slate-violet` | Muted text on dark sections, secondary borders and dividers — a desaturated companion to the primary navy |
| Warm Cream | `#fcf6ea` | `--color-warm-cream` | Hairline borders, dividers, input outlines, and card edges on light surfaces. Do not promote it to the primary CTA color |
| Sand | `#faedd2` | `--color-sand` | FAQ section background, warm surface wash, decorative fills — slightly more saturated than Warm Cream to signal content zones |
| Graphite | `#474b60` | `--color-graphite` | Body text borders, form field borders, subtle dividers — cool gray that reads as neutral on both light and dark surfaces |
| Khaki | `#b4ad98` | `--color-khaki` | Muted helper text, subtle borders, low-emphasis labels — a warm desaturated gray for tertiary information |
| Pure White | `#ffffff` | `--color-pure-white` | Primary text and icon color on dark sections, high-contrast borders — used sparingly for maximum readability |
| Coral Pink | `#ffb8d9` | `--color-coral-pink` | Illustrative ribbon strokes, decorative accent lines, hand-drawn highlights in feature illustrations |
| Mint Wave | `#68dacb` | `--color-mint-wave` | Illustrative ribbon strokes, teal accents in feature card backgrounds — the secondary illustrative color |
| Ice Blue | `#bcdff0` | `--color-ice-blue` | Illustrative ribbon strokes, light blue decorative curves in hero and feature illustrations |
| Pale Mint | `#a1e8df` | `--color-pale-mint` | Secondary illustrative teal — lighter ribbon strokes and soft decorative elements |
| Blush | `#ffe9f4` | `--color-blush` | Soft pink-tinted card surface — warm pink background for individual feature card variants |

## Tokens — Typography

### Excon — Display and heading typeface — tightly tracked geometric cuts that define the editorial voice. Used at massive sizes (90–151px) for hero and section headings with aggressive negative letter-spacing (-0.04em to -0.1em) that makes the letterforms lock into architectural shapes. Line-heights below 1.0 at display sizes create a compressed, almost overlapping density. Substitute: Space Grotesk or Archivo for close geometric character with similar tracking behavior. · `--font-excon`
- **Weights:** 400, 500, 700
- **Sizes:** 24px, 25px, 45px, 48px, 50px, 60px, 90px, 128px, 130px, 151px, 274px
- **Line height:** 0.87, 0.92, 1.00, 1.09
- **Letter spacing:** -0.04em to -0.1em, scaling with size — tighter at larger sizes (up to -15px at 151px, -5px at 128px, -2.2px at 48px, -1.3px at 25px)
- **Role:** Display and heading typeface — tightly tracked geometric cuts that define the editorial voice. Used at massive sizes (90–151px) for hero and section headings with aggressive negative letter-spacing (-0.04em to -0.1em) that makes the letterforms lock into architectural shapes. Line-heights below 1.0 at display sizes create a compressed, almost overlapping density. Substitute: Space Grotesk or Archivo for close geometric character with similar tracking behavior.

### Generalsans — Body and UI typeface — humanist sans for all conversational text, buttons, labels, FAQ content, and card descriptions. Normal letter-spacing. The contrast with Excon's compressed display cuts is the typographic signature: editorial headlines whisper in geometric precision while body text speaks in approachable warmth. Substitute: Inter or DM Sans for a similar humanist feel at UI sizes. · `--font-generalsans`
- **Weights:** 400, 500, 700
- **Sizes:** 14px, 16px, 18px
- **Line height:** 1.14, 1.22, 1.25, 1.43, 1.50
- **Role:** Body and UI typeface — humanist sans for all conversational text, buttons, labels, FAQ content, and card descriptions. Normal letter-spacing. The contrast with Excon's compressed display cuts is the typographic signature: editorial headlines whisper in geometric precision while body text speaks in approachable warmth. Substitute: Inter or DM Sans for a similar humanist feel at UI sizes.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 14px | 1.43 | — | `--text-caption` |
| body-sm | 16px | 1.5 | — | `--text-body-sm` |
| body | 18px | 1.43 | — | `--text-body` |
| subheading | 24px | 1.22 | -1.32px | `--text-subheading` |
| heading | 48px | 1.09 | -2.21px | `--text-heading` |
| heading-lg | 90px | 0.92 | -3.96px | `--text-heading-lg` |
| display | 128px | 0.87 | -5.12px | `--text-display` |

## Tokens — Spacing & Shapes

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 10 | 10px | `--spacing-10` |
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 26 | 26px | `--spacing-26` |
| 27 | 27px | `--spacing-27` |
| 28 | 28px | `--spacing-28` |
| 30 | 30px | `--spacing-30` |
| 36 | 36px | `--spacing-36` |
| 38 | 38px | `--spacing-38` |
| 40 | 40px | `--spacing-40` |
| 42 | 42px | `--spacing-42` |
| 50 | 50px | `--spacing-50` |
| 64 | 64px | `--spacing-64` |
| 100 | 100px | `--spacing-100` |
| 120 | 120px | `--spacing-120` |

### Border Radius

| Element | Value |
|---------|-------|
| faq | 16px |
| cards | 24px |
| pills | 100px |
| small | 16px |
| buttons | 48px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 40px
- **Card padding:** 24px
- **Element gap:** 16px

## Components

### Hero Section
**Role:** Full-bleed dark band with centered headline, subtext, and CTA

Full-viewport-width #0a1d4b background. Centered Excon display heading at 90–128px, weight 700, white (#ffffff), letter-spacing -3.96px to -5.12px. Subtext in Generalsans 18px, weight 400, white. CTA button centered below. Large hand-drawn illustration bleeding from edges with ribbon strokes.

### Pill CTA Button (Light on Dark)
**Role:** Primary action button on dark canvas sections

48px border-radius, Warm Cream (#fcf6ea) fill, Midnight Sapphire (#0a1d4b) text, Generalsans 16px weight 500, padding 16px 28px. Sits centered or left-aligned against the dark canvas. No shadow — color contrast alone creates the button presence.

### Pill CTA Button (Dark on Light)
**Role:** Primary action button on cream sections

48px border-radius, Midnight Sapphire (#0a1d4b) fill, white (#ffffff) text, Generalsans 16px weight 500, padding 16px 28px. Inverted version for light-band contexts.

### Feature Card
**Role:** Individual illustration card in the 4-column feature grid

24px border-radius, solid color background (varies: Warm Cream, Deep Indigo, Mint Wave, Blush), padding 24px. Contains a centered flat illustration, optional small label text in Generalsans 14px. No shadow — the colored fill IS the card boundary. Cards sit with 16–20px gaps between them.

### FAQ Accordion Item (Closed)
**Role:** Expandable question in the FAQ section

16px border-radius, Warm Cream (#fcf6ea) background, padding 20px 28px. Question text in Generalsans 16px weight 500, Midnight Sapphire color. Plus icon (+) on the right in Midnight Sapphire. 1px hairline border in #fcf6ea or no visible border.

### FAQ Accordion Item (Open)
**Role:** Expanded FAQ answer state

Same dimensions as closed item but background shifts to Sand (#faedd2) — a warmer, more saturated cream that signals active state. Answer body in Generalsans 16px weight 400, Midnight Sapphire color. Minus icon (−) replaces the plus. No animation needed — the color shift is the state indicator.

### Section Heading
**Role:** Large editorial heading for section introductions

Excon, weight 700, 90px, white (#ffffff) on dark sections or Midnight Sapphire (#0a1d4b) on cream sections. Letter-spacing -3.96px, line-height 0.92. Left-aligned or centered depending on section. May include a decorative underline in Coral Pink or Mint Wave.

### Body Text Block
**Role:** Paragraph content under headings and in FAQ answers

Generalsans 18px, weight 400, line-height 1.43. White (#ffffff) on dark sections, Midnight Sapphire (#0a1d4b) on cream sections. Max-width constrained to ~600px for readability. No special styling — the type itself is the design.

### Brand Logo
**Role:** Wordmark + icon at the top of the page

Small monogram icon (circular mark) + 'peppermint' wordmark in Generalsans weight 500, white on dark canvas. Centered horizontally. No visible nav links — the logo is the entire header.

### Hero Illustration
**Role:** Large hand-drawn character/object illustration

Full-color flat illustration with hand-drawn character (diverse hand holding phone/card), 2-4 flowing ribbon strokes in Coral Pink, Mint Wave, Ice Blue, and Pale Mint. Sits at the bottom or right edge of the hero, bleeding off the canvas. No gradients, no shadows — flat color fills with clean outlines.

### Feature Card Illustration
**Role:** Centered object illustration inside a feature card

Flat color illustration of an object or character (phone, card, lock, briefcase) sized to fill ~60% of the card. Solid color fills in the card's accent palette. No text overlay — the illustration speaks alone or with a small Generalsans label below.

### Decorative Ribbon Stroke
**Role:** Flowing hand-drawn line element

2-3px stroke width, hand-drawn curve in Coral Pink (#ffb8d9), Mint Wave (#68dacb), Ice Blue (#bcdff0), or Pale Mint (#a1e8df). Used as background atmosphere in hero and feature sections. No fill, pure stroke. Lengths vary from short flourishes to long sweeping curves.

### Subtle Star/Sparkle Motif
**Role:** Small decorative punctuation

4-pointed star shape in white or Mint Wave, 8–12px size. Scattered sparingly around illustrations and headings as playful accent dots. No animation required.

## Do's and Don'ts

### Do
- Use Excon for all display headings at 48px+ with letter-spacing between -2px and -5px — the tight tracking is the brand's editorial signature
- Use Midnight Sapphire (#0a1d4b) as the primary canvas color for dark sections — it is both the background and the brand DNA
- Use 48px border-radius for all interactive buttons and 100px for full pill shapes — no sharp-cornered buttons
- Alternate between dark navy bands and warm cream (#fcf6ea/#faedd2) bands to create section rhythm without dividers
- Use Generalsans at 16-18px for all body and UI text — never use Excon for anything below 24px
- Differentiate surfaces through color stepping (#0a1d4b → #162d67 → #9c8bf9) rather than shadows or borders
- Use flat hand-drawn illustrations with flowing ribbon strokes in Coral Pink, Mint Wave, and Ice Blue as the primary visual element — no photography, no gradients

### Don't
- Do not use drop shadows for elevation — the design system relies on color contrast and surface stepping instead
- Do not use Excon below 24px — its tight tracking and geometric character become illegible at body sizes
- Do not use photography or 3D renders — the visual language is exclusively flat hand-drawn illustration
- Do not mix rounded and sharp corners — all interactive elements use 48px+ radius, all cards use 24px
- Do not use the bright violet (#9c8bf9) as a large surface — it is a rare accent, not a fill color
- Do not add gradients — the design is intentionally flat, with color contrast doing the visual work
- Do not use a visible navigation bar or menu — the brand is expressed through the centered logo alone

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Midnight Canvas | `#0a1d4b` | Primary page background for hero and feature bands |
| 1 | Deep Indigo | `#162d67` | Elevated card surface against the main canvas |
| 2 | Warm Cream | `#fcf6ea` | Light content zones, card surfaces on light bands, inverted button fills |
| 3 | Sand | `#faedd2` | FAQ section background, warm content wash |

## Elevation

The design intentionally avoids drop shadows as an elevation strategy. Instead, surfaces are differentiated through color contrast alone — Deep Indigo (#162d67) sits one step lighter than Midnight Sapphire (#0a1d4b) to create elevation, and warm cream bands interrupt dark sections to signal content zones. Borders are hairline-thin (1px) in muted tones. This flat, color-driven approach keeps the focus on illustrations and type rather than chrome.

## Imagery

The visual language is exclusively hand-drawn illustration — no photography, no 3D renders, no product screenshots. Illustrations feature diverse human characters (hands, full figures) with flat color fills, no gradients, and clean outlines. The signature decorative element is flowing ribbon/streamer strokes in pink (#ffb8d9), teal (#68dacb), and ice-blue (#bcdff0) that weave through hero and feature sections with loose, hand-drawn energy. Small sparkle/star motifs add playful punctuation. Feature cards contain centered object illustrations (phone, card, lock with wings) on solid colored backgrounds. Illustrations are large and confident — they occupy 30-40% of visual space in the hero and are the primary atmospheric element. Icon style within UI is minimal and geometric, using the same illustrative spirit at smaller scale.

## Layout

Full-bleed sections with no gutters between bands — each section is a solid color block that fills the viewport width. Content within sections is max-width 1200px and centered. The page rhythm alternates between dark navy bands (hero, features) and warm cream bands (FAQ), creating a clear light/dark alternation. Hero is a centered text stack over a dark canvas with illustrations bleeding off the edges. Feature sections use a 4-column card grid with illustrations as the primary content. The FAQ section is a single-column list of accordion items on a cream background. Navigation is minimal — just a centered logo at the top, no visible nav bar or menu. Section gaps are tight (40px) with the color change itself doing the separation work.

## Agent Prompt Guide

**Quick Color Reference**
- text (dark sections): #ffffff
- text (light sections): #0a1d4b
- Create a Primary Action Button: #9c8bf9 background, #474b60 text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.
- background (light bands): #fcf6ea or #faedd2
- border (subtle): #474b60
- accent: #9c8bf9
- primary action: #9c8bf9 (filled action)

**Example Component Prompts**


2. Create a feature card: 24px border-radius, #fcf6ea background, 24px padding. Centered flat illustration of an object (phone, card, or character) filling 60% of the card area. Small label in Generalsans 14px weight 400, #0a1d4b, centered below the illustration. No shadow, no border.

3. Create a FAQ accordion item (open state): 16px border-radius, #faedd2 background, 20px 28px padding. Question in Generalsans 16px weight 500, #0a1d4b. Answer body in Generalsans 16px weight 400, #0a1d4b, line-height 1.5. Minus icon (−) on the right in #0a1d4b.

4. Create a section heading: Excon weight 700, 90px, #ffffff (on dark) or #0a1d4b (on light), letter-spacing -3.96px, line-height 0.92. Add a decorative underline stroke in #ffb8d9 beneath the text, 3px height, 60% width of the text.

5. Create a decorative ribbon stroke: SVG path, 2-3px stroke, no fill, hand-drawn curve in #68dacb. Positioned as background atmosphere element, 200-400px length, flowing S-curve shape.

## Color Role Summary

The palette is built on a dual-mode canvas system: Midnight Sapphire (#0a1d4b) is the dark void, and Warm Cream (#fcf6ea) is its paper-warm counterpoint. These two surfaces alternate to create section rhythm. Within the dark canvas, Deep Indigo (#162d67) provides one-step elevation for nested cards. The accent palette serves two purposes: Bright Violet (#9c8bf9) is a rare chromatic punctuation for emphasis, while Coral Pink, Mint Wave, and Ice Blue are exclusively illustrative — they live in the hand-drawn ribbon strokes and never on UI surfaces. Graphite and Khaki handle muted text and borders, reading as neutral on both light and dark surfaces.

## Typography Philosophy

Excon is the editorial voice — it speaks in compressed, tightly-tracked geometric cuts that make headlines feel architectural and confident. It is used at 48px+ with aggressive negative letter-spacing that intensifies with size. Generalsans is the conversational voice — humanist, normal-spaced, and approachable at 14-18px. The system never uses Excon below 24px or Generalsans above 24px. This binary creates a clear typographic contract: big text makes architectural statements, small text speaks to the reader as a person.

## Similar Brands

- **Stripe** — Same dark-canvas hero treatment with centered display headlines and single CTA — the dramatic typography-to-negative-space ratio is nearly identical
- **Ramp** — Same confidence in massive display type, though Ramp uses lighter backgrounds — the typographic authority and rounded component language overlap
- **Mercury** — Same approach of using dark navy as both canvas and brand DNA, with cream/warm-white as the light-surface counterpoint and pill-shaped CTAs

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-midnight-sapphire: #0a1d4b;
  --color-bright-violet: #9c8bf9;
  --color-deep-indigo: #162d67;
  --color-slate-violet: #3a486b;
  --color-warm-cream: #fcf6ea;
  --color-sand: #faedd2;
  --color-graphite: #474b60;
  --color-khaki: #b4ad98;
  --color-pure-white: #ffffff;
  --color-coral-pink: #ffb8d9;
  --color-mint-wave: #68dacb;
  --color-ice-blue: #bcdff0;
  --color-pale-mint: #a1e8df;
  --color-blush: #ffe9f4;

  /* Typography — Font Families */
  --font-excon: 'Excon', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-generalsans: 'Generalsans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.43;
  --text-body-sm: 16px;
  --leading-body-sm: 1.5;
  --text-body: 18px;
  --leading-body: 1.43;
  --text-subheading: 24px;
  --leading-subheading: 1.22;
  --tracking-subheading: -1.32px;
  --text-heading: 48px;
  --leading-heading: 1.09;
  --tracking-heading: -2.21px;
  --text-heading-lg: 90px;
  --leading-heading-lg: 0.92;
  --tracking-heading-lg: -3.96px;
  --text-display: 128px;
  --leading-display: 0.87;
  --tracking-display: -5.12px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-10: 10px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-26: 26px;
  --spacing-27: 27px;
  --spacing-28: 28px;
  --spacing-30: 30px;
  --spacing-36: 36px;
  --spacing-38: 38px;
  --spacing-40: 40px;
  --spacing-42: 42px;
  --spacing-50: 50px;
  --spacing-64: 64px;
  --spacing-100: 100px;
  --spacing-120: 120px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 40px;
  --card-padding: 24px;
  --element-gap: 16px;

  /* Border Radius */
  --radius-md: 5px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-3xl: 24px;
  --radius-3xl-2: 36px;
  --radius-full: 48px;
  --radius-full-2: 100px;

  /* Named Radii */
  --radius-faq: 16px;
  --radius-cards: 24px;
  --radius-pills: 100px;
  --radius-small: 16px;
  --radius-buttons: 48px;

  /* Surfaces */
  --surface-midnight-canvas: #0a1d4b;
  --surface-deep-indigo: #162d67;
  --surface-warm-cream: #fcf6ea;
  --surface-sand: #faedd2;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-midnight-sapphire: #0a1d4b;
  --color-bright-violet: #9c8bf9;
  --color-deep-indigo: #162d67;
  --color-slate-violet: #3a486b;
  --color-warm-cream: #fcf6ea;
  --color-sand: #faedd2;
  --color-graphite: #474b60;
  --color-khaki: #b4ad98;
  --color-pure-white: #ffffff;
  --color-coral-pink: #ffb8d9;
  --color-mint-wave: #68dacb;
  --color-ice-blue: #bcdff0;
  --color-pale-mint: #a1e8df;
  --color-blush: #ffe9f4;

  /* Typography */
  --font-excon: 'Excon', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-generalsans: 'Generalsans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.43;
  --text-body-sm: 16px;
  --leading-body-sm: 1.5;
  --text-body: 18px;
  --leading-body: 1.43;
  --text-subheading: 24px;
  --leading-subheading: 1.22;
  --tracking-subheading: -1.32px;
  --text-heading: 48px;
  --leading-heading: 1.09;
  --tracking-heading: -2.21px;
  --text-heading-lg: 90px;
  --leading-heading-lg: 0.92;
  --tracking-heading-lg: -3.96px;
  --text-display: 128px;
  --leading-display: 0.87;
  --tracking-display: -5.12px;

  /* Spacing */
  --spacing-10: 10px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-26: 26px;
  --spacing-27: 27px;
  --spacing-28: 28px;
  --spacing-30: 30px;
  --spacing-36: 36px;
  --spacing-38: 38px;
  --spacing-40: 40px;
  --spacing-42: 42px;
  --spacing-50: 50px;
  --spacing-64: 64px;
  --spacing-100: 100px;
  --spacing-120: 120px;

  /* Border Radius */
  --radius-md: 5px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-3xl: 24px;
  --radius-3xl-2: 36px;
  --radius-full: 48px;
  --radius-full-2: 100px;
}
```
