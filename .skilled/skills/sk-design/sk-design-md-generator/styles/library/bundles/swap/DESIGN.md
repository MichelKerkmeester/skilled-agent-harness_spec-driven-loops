# Swap — Style Reference
> Mint editorial greenhouse — pale sage rooms with vivid lime accents and whisper-weight serif type.

**Theme:** light

Swap's design is a pale-mint editorial canvas anchored by a high-fashion display serif and pill-shaped vivid green CTAs. The brand reads like a luxury fashion magazine spread digitized — generous whitespace, a barely-there sage wash, and lime-green accents that feel like fresh foliage against a near-white backdrop. Everything sits lightly: thin charcoal-black borders, soft 28px blur shadows, 24px card radii, and a custom display serif that shifts between ultra-thin (100) and light (300) to whisper rather than shout. The green-to-yellow gradient display text is the only moment of visual spectacle — the rest of the system stays restrained, monochrome, and editorial, with color appearing as small functional punctuation for primary actions, tags, and active states.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Mint Wash | `#f2ffe3` | `--color-mint-wash` | Page canvas, section backgrounds, hero wash — the dominant surface tone |
| Vivid Lime | `linear-gradient(90deg, rgb(130, 255, 135), rgb(163, 253, 167) 50%, rgb(222, 255, 130))` | `--color-vivid-lime` | Primary action button fill, accent highlights, gradient mid-stop, active tag backgrounds; Display text treatment — vivid lime-to-citrus gradient on hero headlines |
| Forest Depth | `#0d5b3b` | `--color-forest-depth` | Deep green card backgrounds, contrast surfaces, gradient anchor |
| Pine Shadow | `#083a26` | `--color-pine-shadow` | Darkest green for emphasis cards, gradient endpoints, high-contrast text on light surfaces |
| Spring Gradient Start | `#82ff87` | `--color-spring-gradient-start` | Gradient anchor for display type and decorative washes |
| Citrus Gradient End | `#deff82` | `--color-citrus-gradient-end` | Gradient endpoint for display type — yellow-green warmth in hero text |
| Charcoal Ink | `#000000` | `--color-charcoal-ink` | Primary text, hairline borders, dark action buttons, icon strokes |
| Cream Paper | `#ffffff` | `--color-cream-paper` | Card surfaces, button text on dark fills, input backgrounds, elevated overlays |
| Stone Charcoal | `#2d3637` | `--color-stone-charcoal` | Secondary dark surface, icon fills, dark borders, muted dark mode text |
| Warm Mist | `#e9e7e2` | `--color-warm-mist` | Alternate section backgrounds, disabled states, cream-toned surfaces |
| Silver Border | `#cccccc` | `--color-silver-border` | Light dividers, inactive borders, subtle separators |
| Sage Gray | `#838676` | `--color-sage-gray` | Muted accent card backgrounds, secondary decorative surfaces |
| Eucalyptus | `#9cb0a8` | `--color-eucalyptus` | Muted sage for outlined secondary action borders, subtle green-tinted UI |

## Tokens — Typography

### mainFont — mainFont — detected in extracted data but not described by AI · `--font-mainfont`
- **Weights:** 400, 500, 700
- **Sizes:** 9px, 12px, 15px, 16px, 18px, 24px, 30px
- **Line height:** 1, 1.2, 1.4, 1.5
- **Letter spacing:** -0.01
- **Role:** mainFont — detected in extracted data but not described by AI

### Custom Editorial Serif (swap-serif) — Display and headline serif — used exclusively for hero/headline contexts at 72–120px. Weight 100 for maximum impact headlines, weight 300 for sub-headlines. Negative letter-spacing (-0.017em) tightens the high-contrast strokes for fashion-editorial density. This ultra-thin serif against pale mint is the signature combination — it borrows from luxury print typography (Bodoni/Didone lineage) to make a commerce platform feel like a magazine spread. · `--font-custom-editorial-serif-swap-serif`
- **Substitute:** Playfair Display, Cormorant Garamond, or Libre Caslon Display
- **Weights:** 100, 300
- **Sizes:** 
- **Line height:** 0.95, 1.00
- **Role:** Display and headline serif — used exclusively for hero/headline contexts at 72–120px. Weight 100 for maximum impact headlines, weight 300 for sub-headlines. Negative letter-spacing (-0.017em) tightens the high-contrast strokes for fashion-editorial density. This ultra-thin serif against pale mint is the signature combination — it borrows from luxury print typography (Bodoni/Didone lineage) to make a commerce platform feel like a magazine spread.

### Custom UI Sans (swap-sans) — Primary interface and body typeface — 16px for body, 15px for compact UI, 18px for lead paragraphs, 24px and 30px for section sub-headings. Weight 400 is default, 500 for emphasis, 700 for labels and small caps eyebrow text. Slight negative tracking (-0.01em) tightens the geometric forms for a precise, modern feel. The sans is functional and quiet — it never competes with the display serif. · `--font-custom-ui-sans-swap-sans`
- **Substitute:** Inter, Söhne, or General Sans
- **Weights:** 400, 500, 700
- **Sizes:** 
- **Line height:** 1.00, 1.20, 1.40, 1.50
- **Letter spacing:** -0.16px at 16px, -0.24px at 24px
- **OpenType features:** `"ss01" on`
- **Role:** Primary interface and body typeface — 16px for body, 15px for compact UI, 18px for lead paragraphs, 24px and 30px for section sub-headings. Weight 400 is default, 500 for emphasis, 700 for labels and small caps eyebrow text. Slight negative tracking (-0.01em) tightens the geometric forms for a precise, modern feel. The sans is functional and quiet — it never competes with the display serif.

### secondaryFont — secondaryFont — detected in extracted data but not described by AI · `--font-secondaryfont`
- **Weights:** 100, 300
- **Sizes:** 72px, 80px, 120px
- **Line height:** 0.95, 1
- **Letter spacing:** -0.017, -0.01
- **Role:** secondaryFont — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.2 | -0.12px | `--text-caption` |
| body-sm | 15px | 1.4 | -0.15px | `--text-body-sm` |
| subheading | 18px | 1.4 | -0.18px | `--text-subheading` |
| heading-sm | 24px | 1.2 | -0.24px | `--text-heading-sm` |
| heading | 30px | 1.2 | -0.3px | `--text-heading` |
| display | 72px | 0.95 | -1.22px | `--text-display` |
| display-lg | 120px | 0.95 | -2.04px | `--text-display-lg` |

## Tokens — Spacing & Shapes

**Density:** compact

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 6 | 6px | `--spacing-6` |
| 7 | 7px | `--spacing-7` |
| 8 | 8px | `--spacing-8` |
| 10 | 10px | `--spacing-10` |
| 11 | 11px | `--spacing-11` |
| 12 | 12px | `--spacing-12` |
| 15 | 15px | `--spacing-15` |
| 19 | 19px | `--spacing-19` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 30 | 30px | `--spacing-30` |
| 40 | 40px | `--spacing-40` |
| 80 | 80px | `--spacing-80` |
| 160 | 160px | `--spacing-160` |
| 200 | 200px | `--spacing-200` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 200px |
| cards | 24px |
| badges | 10px |
| inputs | 100px |
| buttons | 200px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| xl | `rgba(0, 0, 0, 0.09) 0px 0px 28px 0px` | `--shadow-xl` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80-120px
- **Card padding:** 30px
- **Element gap:** 8-16px

## Components

### Primary Lime Pill Button
**Role:** Main call-to-action across hero and section CTAs

Filled vivid lime (#a3fda7) with black text. Border-radius 200px (full pill). Padding 12px 24px. Body text at 16px weight 500, -0.01em tracking. No shadow. The lime-on-mint combination creates a fresh, botanical accent against the pale canvas.

### Secondary Black Pill Button
**Role:** Secondary action alongside primary CTAs (e.g. "Book a Demo")

Solid black (#000000) fill with white (#ffffff) text. Border-radius 200px. Padding 12px 24px. 16px weight 500. Hairline-thin or borderless. Pairs with the lime primary as a high-contrast anchor.

### Outlined Ghost Button
**Role:** Tertiary or alternative actions

Transparent fill with 1px black or sage (#9cb0a8) border. Border-radius 200px. 16px weight 500, black or dark charcoal text. Used for less prominent navigation or section links.

### Hero Gradient Display Block
**Role:** Oversized brand statement in hero and feature sections

Full-bleed text block with the green-to-citrus linear gradient (#82ff87 → #a3fda7 → #deff82) applied as background-clip text. Custom serif at 80–120px weight 100, line-height 0.95, tracking -0.017em. Creates a botanical, fresh visual punctuation — the only place where color is allowed to be loud.

### Soft Card
**Role:** Content cards, feature blocks, brand story panels

White (#ffffff) surface on the mint canvas. Border-radius 24px. Padding 30px. No border. Soft shadow rgba(0,0,0,0.09) 0px 0px 28px 0px for a gentle, diffused lift. The generous radius + soft shadow creates a pillow-like, premium feel.

### Brand Logo Grid Card
**Role:** Customer/partner logo showcase section

Grid of 5 columns × 3 rows of brand wordmarks on white or mint background. Logos are rendered in muted gray or original brand color, evenly spaced with 30–40px gaps. No card containers — logos float on the canvas to keep the editorial feel.

### Section Header with Eyebrow
**Role:** Section introduction with small caps label and serif headline

Small uppercase eyebrow text in sans weight 700 at 12px, letter-spacing slightly increased, black. Main headline in serif weight 300 at 48–72px, black, tracking -0.017em. Centered or left-aligned with generous top spacing (60–80px above).

### Pill Input Field
**Role:** Email capture, form fields, search

White fill with thin (#cccccc or #000000) 1px border. Border-radius 100px (full pill). Padding 14px 24px. 16px sans weight 400. Placeholder in #999999. Focus state shifts border to vivid lime (#a3fda7).

### Eyebrow Label
**Role:** Small all-caps section identifier above headlines

Uppercase sans weight 700 at 9–12px, black, slightly increased letter-spacing. Sits 20–30px above its associated headline. Used to introduce content sections with editorial precision.

### Top Navigation Bar
**Role:** Primary site navigation

White or transparent background over mint canvas. 64–72px tall. Logo left (serif "Swap" wordmark in black). Nav links in sans 15px weight 400, black. Sign in link and lime pill CTA pinned right. No shadow or hairline bottom border.

### Full-Bleed Hero Section
**Role:** Opening brand statement

Pale mint (#f2ffe3) background filling the viewport. Centered or left-aligned serif headline at 72–120px weight 100. Subtext at 18px weight 400 in charcoal (#2d3637). Two CTAs side by side: lime primary + black secondary. Generous vertical padding (120–160px top/bottom).

### Logo Strip Section
**Role:** Social proof via partner/customer logos

White or mint background. Serif heading at 30–48px weight 300 centered. Optional lime pill CTA below. Logo grid beneath with 5 columns, even spacing, logos in grayscale or muted tone. No card containers.

### Statement Section Divider
**Role:** Full-width editorial section break with large display text

Mint background with oversized serif headline at 72–120px weight 100, applied with the green-to-citrus gradient as text fill. Acts as a visual pause and brand moment between content sections.

## Do's and Don'ts

### Do
- Use the custom display serif at weight 100 for all hero/feature headlines — this whisper-thin weight is the signature; never substitute with bold sans headlines
- Use 200px border-radius for all buttons and tags to maintain the pill-shaped language
- Pair the vivid lime (#a3fda7) fill with pure black (#000000) text on all primary CTAs for 17:1 contrast
- Apply the 90deg green-to-citrus gradient as background-clip text only on display-sized serif headlines (72px+)
- Set section gaps to 80–120px to preserve the editorial breathing room between content blocks
- Use the pale mint (#f2ffe3) as the primary canvas and reserve white (#ffffff) for card surfaces and inputs — never invert this hierarchy
- Set the display serif to line-height 0.95 and letter-spacing -0.017em to maintain the tight, fashion-editorial density

### Don't
- Never use bold or semibold weights for display headlines — the ultra-thin serif is the brand signature
- Never use sharp or small border-radii on buttons — anything below 100px breaks the pill language
- Never apply the green-to-citrus gradient to body text, UI labels, or anything below 48px
- Never use a dark or charcoal page background — the entire system is built on pale mint and white
- Never use colored body text — all paragraph and UI copy stays in black (#000000) or charcoal (#2d3637)
- Never add heavy drop shadows — the only shadow allowed is the 28px soft black-9% blur on cards
- Never use multiple chromatic accent colors simultaneously — lime is the sole accent; sage gray and forest green appear only in gradients or specific card contexts

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Mint Canvas | `#f2ffe3` | Primary page background and hero wash |
| 1 | White Card | `#ffffff` | Card surfaces, input fields, elevated content blocks |
| 2 | Warm Mist | `#e9e7e2` | Alternate section background, disabled state fill |
| 3 | Vivid Lime Surface | `#a3fda7` | Active tag, highlight wash, primary CTA fill |
| 4 | Forest Surface | `#0d5b3b` | Dark contrast card, emphasis surface for inverted content |

## Elevation

- **Soft Card:** `0px 0px 28px 0px rgba(0, 0, 0, 0.09)`

## Imagery

The site is overwhelmingly text-driven and editorial — no photography, no product imagery, no lifestyle shots. The only visual elements are: (1) oversized gradient-clipped display type that acts as the hero visual, (2) a grid of partner/customer logo wordmarks in muted grayscale serving as social proof, and (3) minimal line-style icons. The mint background, gradient display text, and logo wordmarks together form the entire visual language. When illustration appears, it is likely abstract botanical or geometric in lime and green tones.

## Layout

Max-width 1200px centered container with full-bleed mint sections. Hero is a centered stack: large serif headline, short subtext paragraph, two pill CTAs (lime + black) side by side, then an oversized gradient display block below as visual punctuation. Sections alternate between mint canvas and white card surfaces, separated by 80–120px gaps. Logo showcase is a 5-column grid centered with a serif heading and optional CTA. Content sections use left-aligned serif headlines with left-aligned body text below. Navigation is a single white/transparent top bar — no sticky behavior, no sidebar, no mega-menu. The overall rhythm is vertical and editorial, like scrolling through a fashion magazine spread.

## Agent Prompt Guide

**Quick Color Reference**
- Text: #000000
- Background (canvas): #f2ffe3
- Surface (card): #ffffff
- Border: #cccccc (light) / #000000 (emphasis)
- Accent: #a3fda7
- primary action: #a3fda7 (filled action)

**Example Component Prompts**

1. Create a hero section: pale mint (#f2ffe3) full-bleed background, 120px top padding. Centered serif headline at 72px weight 100, #000000, letter-spacing -0.017em, line-height 0.95. Subtext below at 18px sans weight 400, #2d3637. Two CTAs side by side with 12px gap: a lime pill (#a3fda7 fill, #000000 text, 200px radius, 12px 24px padding, 16px weight 500) and a black pill (#000000 fill, #ffffff text, 200px radius, same padding).

2. Create a Primary Action Button: #a3fda7 background, #000000 text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.

3. Create a soft content card: white (#ffffff) background, 24px border-radius, 30px padding, shadow 0px 0px 28px 0px rgba(0,0,0,0.09). Eyebrow label in 12px sans weight 700 uppercase, #000000. Serif headline at 30px weight 300, #000000, -0.017em tracking. Body at 16px sans weight 400, #2d3637.

4. Create a pill input field: white (#ffffff) fill, 1px #cccccc border, 100px border-radius, 14px 24px padding, 16px sans weight 400, placeholder #999999. Focus state: border becomes #a3fda7 (vivid lime).

5. Create a gradient display statement block: pale mint (#f2ffe3) background, 100px vertical padding. Oversized serif text at 120px weight 100, line-height 0.95, letter-spacing -0.017em, with linear-gradient(90deg, #82ff87, #a3fda7 50%, #deff82) applied as background-clip text. The gradient should fill the text glyphs, not the background.

## Similar Brands

- **The Yes (Boston-based fashion commerce)** — Same pale pastel canvas with a single vivid accent color, pill-shaped CTAs, and editorial serif display type for a fashion-luxury feel
- **Shopify (premium brand pages)** — Same generous whitespace, 24px card radii, and restrained single-accent color approach for commerce content marketing
- **Glossier brand site** — Same pale-toned canvas with botanical green accents, pill buttons, and editorial large-type hero treatment
- **Bambuser** — Same fashion-commerce editorial aesthetic with oversized gradient display type as the hero visual moment
- **Aritzia brand pages** — Same whisper-thin display serif headlines, near-white canvas, and pill-shaped dark secondary CTAs pairing with a vivid accent

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-mint-wash: #f2ffe3;
  --color-vivid-lime: #a3fda7;
  --gradient-vivid-lime: linear-gradient(90deg, rgb(130, 255, 135), rgb(163, 253, 167) 50%, rgb(222, 255, 130));
  --color-forest-depth: #0d5b3b;
  --color-pine-shadow: #083a26;
  --color-spring-gradient-start: #82ff87;
  --color-citrus-gradient-end: #deff82;
  --color-charcoal-ink: #000000;
  --color-cream-paper: #ffffff;
  --color-stone-charcoal: #2d3637;
  --color-warm-mist: #e9e7e2;
  --color-silver-border: #cccccc;
  --color-sage-gray: #838676;
  --color-eucalyptus: #9cb0a8;

  /* Typography — Font Families */
  --font-mainfont: 'mainFont', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-custom-editorial-serif-swap-serif: 'Custom Editorial Serif (swap-serif)', ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
  --font-custom-ui-sans-swap-sans: 'Custom UI Sans (swap-sans)', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-secondaryfont: 'secondaryFont', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.2;
  --tracking-caption: -0.12px;
  --text-body-sm: 15px;
  --leading-body-sm: 1.4;
  --tracking-body-sm: -0.15px;
  --text-subheading: 18px;
  --leading-subheading: 1.4;
  --tracking-subheading: -0.18px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -0.24px;
  --text-heading: 30px;
  --leading-heading: 1.2;
  --tracking-heading: -0.3px;
  --text-display: 72px;
  --leading-display: 0.95;
  --tracking-display: -1.22px;
  --text-display-lg: 120px;
  --leading-display-lg: 0.95;
  --tracking-display-lg: -2.04px;

  /* Typography — Weights */
  --font-weight-thin: 100;
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-6: 6px;
  --spacing-7: 7px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-11: 11px;
  --spacing-12: 12px;
  --spacing-15: 15px;
  --spacing-19: 19px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-30: 30px;
  --spacing-40: 40px;
  --spacing-80: 80px;
  --spacing-160: 160px;
  --spacing-200: 200px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80-120px;
  --card-padding: 30px;
  --element-gap: 8-16px;

  /* Border Radius */
  --radius-lg: 10px;
  --radius-3xl: 24px;
  --radius-full: 100px;
  --radius-full-2: 200px;

  /* Named Radii */
  --radius-tags: 200px;
  --radius-cards: 24px;
  --radius-badges: 10px;
  --radius-inputs: 100px;
  --radius-buttons: 200px;

  /* Shadows */
  --shadow-xl: rgba(0, 0, 0, 0.09) 0px 0px 28px 0px;

  /* Surfaces */
  --surface-mint-canvas: #f2ffe3;
  --surface-white-card: #ffffff;
  --surface-warm-mist: #e9e7e2;
  --surface-vivid-lime-surface: #a3fda7;
  --surface-forest-surface: #0d5b3b;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-mint-wash: #f2ffe3;
  --color-vivid-lime: #a3fda7;
  --color-forest-depth: #0d5b3b;
  --color-pine-shadow: #083a26;
  --color-spring-gradient-start: #82ff87;
  --color-citrus-gradient-end: #deff82;
  --color-charcoal-ink: #000000;
  --color-cream-paper: #ffffff;
  --color-stone-charcoal: #2d3637;
  --color-warm-mist: #e9e7e2;
  --color-silver-border: #cccccc;
  --color-sage-gray: #838676;
  --color-eucalyptus: #9cb0a8;

  /* Typography */
  --font-mainfont: 'mainFont', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-custom-editorial-serif-swap-serif: 'Custom Editorial Serif (swap-serif)', ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
  --font-custom-ui-sans-swap-sans: 'Custom UI Sans (swap-sans)', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-secondaryfont: 'secondaryFont', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.2;
  --tracking-caption: -0.12px;
  --text-body-sm: 15px;
  --leading-body-sm: 1.4;
  --tracking-body-sm: -0.15px;
  --text-subheading: 18px;
  --leading-subheading: 1.4;
  --tracking-subheading: -0.18px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -0.24px;
  --text-heading: 30px;
  --leading-heading: 1.2;
  --tracking-heading: -0.3px;
  --text-display: 72px;
  --leading-display: 0.95;
  --tracking-display: -1.22px;
  --text-display-lg: 120px;
  --leading-display-lg: 0.95;
  --tracking-display-lg: -2.04px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-6: 6px;
  --spacing-7: 7px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-11: 11px;
  --spacing-12: 12px;
  --spacing-15: 15px;
  --spacing-19: 19px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-30: 30px;
  --spacing-40: 40px;
  --spacing-80: 80px;
  --spacing-160: 160px;
  --spacing-200: 200px;

  /* Border Radius */
  --radius-lg: 10px;
  --radius-3xl: 24px;
  --radius-full: 100px;
  --radius-full-2: 200px;

  /* Shadows */
  --shadow-xl: rgba(0, 0, 0, 0.09) 0px 0px 28px 0px;
}
```
