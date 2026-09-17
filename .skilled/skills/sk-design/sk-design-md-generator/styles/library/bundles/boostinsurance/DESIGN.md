# Boostinsurance — Style Reference
> Abyssal mission control

**Theme:** dark

Boost Insurance inhabits an abyssal command center: deep teal canvas, faint topographic grid lines, and bioluminescent lime-green accents that feel switched-on against the matte dark surface. The platform is rendered as floating glass UI cards — slightly translucent, subtly bordered, rounded generously — floating over the dark ocean of the page, suggesting infrastructure and scale rather than personality. Typography does most of the talking: an enormous light-weight display cut (Gellix at 90–120px) with tight negative tracking, paired against a quiet, readable body. Color is rationed — a single signature cyan-to-lime gradient powers the primary action and a few under-line flourishes, while the rest of the surface stays deep teal, off-white text, and barely-visible hairline borders. The overall density is spacious and confident, with breathing room between every section and section transitions that feel like descending deeper into a system rather than scrolling a brochure.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Abyss Teal | `#002025` | `--color-abyss-teal` | Page canvas and dominant surface — the deep-ocean background that carries every section; large bordered card fills also read as this token because the surface stack collapses into a single dark plane |
| Slate Reef | `#244348` | `--color-slate-reef` | Mid-tier surface and dividers — floating card fills slightly lighter than the canvas, section dividers, hairline borders around hero card and feature blocks |
| Tidewater | `#455c60` | `--color-tidewater` | Elevated surface and heavier borders — used for raised card surfaces and stroke weights where more separation from the canvas is needed |
| Lichen | `#54696c` | `--color-lichen` | Muted surface accent and softer card borders — for secondary container backgrounds and quieter stroke treatments |
| Deep Kelp | `#05333a` | `--color-deep-kelp` | Lowest-elevation surface behind content inside dark cards — used for card padding interior fills where the outer card is lighter |
| Storm Glass | `#7d8f92` | `--color-storm-glass` | Muted body text and secondary borders — helper text, captions, inactive icon strokes, and quiet UI labels |
| Sea Mist | `#9eaeb0` | `--color-sea-mist` | Tertiary text and border — for less-emphasized copy and fine dividers that should recede further than Storm Glass |
| Pale Foam | `#b7c6c9` | `--color-pale-foam` | Lightest neutral — icon outlines on dark surfaces and thin card borders where higher contrast is needed without using full white |
| Bone | `#fffffa` | `--color-bone` | Primary text and high-contrast iconography — headlines, body copy, button text, and reverse-mode icon fills; a warm off-white that softens against the teal canvas |
| Lime Voltage | `#79fa4b` | `--color-lime-voltage` | Primary brand accent — underline flourishes under display keywords, eyebrow labels in uppercase, decorative SVG fills, product-category icon glows, and the terminal stop of the signature gradient |
| Pale Lime | `#a4ed8a` | `--color-pale-lime` | Lighter lime used for subdued accent text and outlined-link borders where a softer hit of brand color is needed |
| Voltage Dark | `#0b3222` | `--color-voltage-dark` | Dark green surface — for solid-fill lime-tinted backgrounds and badge containers where the lime accent needs a darker anchor |
| Cyan Pulse | `linear-gradient(100.7deg, #30d7f1 8.74%, #79fa4b 92.06%)` | `--color-cyan-pulse` | Supporting palette color for small decorative accents when the core palette needs contrast. Do not promote it to the primary CTA color |
| Solar Yellow | `linear-gradient(277.33deg, #fce344 -2.48%, #79fa4b 47.21%, #30d7f1 93.62%)` | `--color-solar-yellow` | Secondary gradient stop — the warm tail of the tri-stop accent gradient used sparingly on decorative flows and a few product-card highlights |

## Tokens — Typography

### Gellix — Primary brand typeface — used for all display, heading, body, and UI copy. Weight 300 at 90–120px is the signature headline treatment: anti-convention for an enterprise platform, the whisper-weight display is what makes the dark canvas feel premium rather than heavy. The 0.35em tracking on 12-13px is reserved for uppercase eyebrow labels like 'OUR PRODUCTS'. · `--font-gellix`
- **Substitute:** GT Walsheim, Inter, or DM Sans
- **Weights:** 300, 400, 500, 600
- **Sizes:** 12, 13, 14, 16, 18, 20, 22, 26, 48, 90, 120px
- **Line height:** 0.85, 1.00, 1.05, 1.10, 1.20, 1.25, 1.30, 1.45
- **Letter spacing:** -0.04em at 90-120px, -0.03em at 48-90px, -0.02em at 22-26px, -0.01em at 16-20px, 0.08em at 14px, 0.35em at 12-13px uppercase labels
- **OpenType features:** `"ss01" on, "cv11" on`
- **Role:** Primary brand typeface — used for all display, heading, body, and UI copy. Weight 300 at 90–120px is the signature headline treatment: anti-convention for an enterprise platform, the whisper-weight display is what makes the dark canvas feel premium rather than heavy. The 0.35em tracking on 12-13px is reserved for uppercase eyebrow labels like 'OUR PRODUCTS'.

### Times — Rare legacy or fallback appearance — appears sparsely in the data, likely a system fallback for a single decorative or legal string; not a brand typeface and should not be propagated into new pages · `--font-times`
- **Weights:** 400
- **Sizes:** 16px
- **Line height:** 1.20
- **Letter spacing:** normal
- **Role:** Rare legacy or fallback appearance — appears sparsely in the data, likely a system fallback for a single decorative or legal string; not a brand typeface and should not be propagated into new pages

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.3 | 0.35px | `--text-caption` |
| body-sm | 14px | 1.45 | 0.08px | `--text-body-sm` |
| body | 16px | 1.25 | -0.01px | `--text-body` |
| subheading | 18px | 1.3 | -0.01px | `--text-subheading` |
| heading-sm | 22px | 1.25 | -0.02px | `--text-heading-sm` |
| heading | 26px | 1.2 | -0.02px | `--text-heading` |
| heading-lg | 48px | 1.1 | -0.03px | `--text-heading-lg` |
| display | 90px | 1 | -0.04px | `--text-display` |
| display-xl | 120px | 0.85 | -0.04px | `--text-display-xl` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** spacious

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 8 | 8px | `--spacing-8` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 40 | 40px | `--spacing-40` |
| 60 | 60px | `--spacing-60` |
| 100 | 100px | `--spacing-100` |
| 112 | 112px | `--spacing-112` |
| 136 | 136px | `--spacing-136` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 999px |
| cards | 30px |
| images | 30px |
| buttons | 999px |
| smallElements | 10px |
| tightElements | 3px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 96-128px
- **Card padding:** 40px
- **Element gap:** 20-25px

## Components

### Top Navigation Bar
**Role:** Persistent dark header

Sits directly on Abyss Teal (#002025) canvas with no border, 80px height, 20px horizontal padding. Logo on the left (boost wordmark + lime-green stacked-layers icon), five text nav items with dropdown chevrons in Bone (#fffffa) at 14px, and a ghost outlined Contact Us button on the right with 1px Bone border, 999px radius, 18px horizontal padding, 9px vertical padding.

### Gradient Pill CTA
**Role:** Primary action button

Filled with the signature cyan-to-lime gradient (linear-gradient(100.7deg, #30d7f1, #79fa4b)), Bone (#fffffa) text at 16px Gellix 500, 999px radius, 18px horizontal padding, 9px vertical padding. The gradient orientation runs roughly horizontal with cyan at the top-left and lime at the bottom-right, giving the button a directional pull. Use this for exactly one action per view.

### Ghost Outline Button
**Role:** Secondary nav action

Transparent background, 1px Bone (#fffffa) border, Bone text at 14px Gellix 500, 999px radius, 20px horizontal padding, 9px vertical padding. Used in the nav bar for the right-aligned Contact Us. No hover fill change beyond a subtle opacity dip.

### Floating Product Card
**Role:** Hero illustration

A glassmorphic card floating in the right half of the hero: Slate Reef (#244348) semi-transparent background, 1px Slate Reef border, 30px radius, 40px padding. Inside it, a list of insurance category tags (Insurance, Business Owners, Crypto, Pet Health) in muted Storm Glass with 10px radius, then a highlighted active card with Deep Kelp (#05333a) background containing a green product icon, a 'Your Product' label, and a yellow Solar Yellow gradient button.

### Feature Illustration Tile
**Role:** Section visual

A 30px-radius container with a Slate Reef border, holding a tilted (slight rotation, roughly -3deg) grid of miniature product cards. Each mini card mirrors the hero product-card pattern: green icon top-left, gradient bar placeholders, 'Your Product' or 'Your Insurance' label in Pale Foam. The tilt and the repeated pattern create depth without using shadows.

### Stats Highlight Block
**Role:** Social proof band

A rounded-rectangle band on Abyss Teal with a 1px Slate Reef border, 30px radius, housing a large sentence-left and a logo-grid right. Sentence uses Gellix 300 at 26-32px with the key number ($100+ Billion) underlined in Lime Voltage, plus a horizontal Lime Voltage gradient line under the whole block as a visual anchor. Logo grid is 2 columns of 5 partner logos, each in faded Pale Foam at 40% opacity.

### Underline Accent
**Role:** Inline emphasis on keywords

A 2-3px lime-green (#79fa4b) line drawn under a single display-scale word, usually the last word of a headline. Sits flush at the baseline of the Gellix 300 letterforms. Used to give the giant whisper-weight headlines a focal point without breaking the monochrome text treatment.

### Eyebrow Label
**Role:** Section category marker

12-13px Gellix 500, uppercase, Lime Voltage (#79fa4b) color, 0.35em letter-spacing, 1.0-1.2 line height. Sits above section headlines with a small 4-6px gap. A 6px lime-green dot or icon typically precedes the text. Examples: 'OUR PRODUCTS', 'COMMERCIAL LINES'.

### Display Headline
**Role:** Primary section and hero headline

Gellix 300, 90-120px on desktop, Bone (#fffffa) color, line-height 0.85-1.0, letter-spacing -0.04em. Tightly set, with one keyword carrying the Underline Accent. At 120px the line-height drops to 0.85 to overlap ascenders/descenders across two lines into a single confident block.

### Insurance Product Tag
**Role:** Category chip

Small pill at 10px radius, Abyss Teal (#002025) background, 1px Slate Reef (#244348) border, Storm Glass (#7d8f92) text at 12-14px Gellix 400. Stacks vertically in lists. Active state: 1px Lime Voltage border and Pale Foam text.

### Product Icon Badge
**Role:** Category icon container

32-40px square container, 8px radius, filled with a darker green or lime-tinted gradient, holding a white icon at 60% of container size. Always Lime Voltage or a lime-gradient fill. Used in product cards, feature lists, and as inline anchors next to product names.

### Inline Text Link
**Role:** In-prose navigation

Bone (#fffffa) text at 16-18px Gellix 400, no underline by default, 2px Lime Voltage underline on hover. Used inside body paragraphs to link to secondary actions like 'or work with Boost to create something new.'

### Section Divider Line
**Role:** Quiet transition between sections

A 1px horizontal stroke in Slate Reef (#244348) spanning the full content width, occasionally interrupted by an eyebrow label or a 2px Lime Voltage gradient segment. The gradient variant is used as a visual bookmark under a stats block.

## Do's and Don'ts

### Do
- Use the cyan-to-lime linear-gradient(100.7deg, #30d7f1, #79fa4b) on exactly one primary CTA per view, set on a 999px-radius pill with Bone text at 16px Gellix 500 and 18px/9px padding.
- Set display headlines at 90-120px Gellix 300 with -0.04em letter-spacing and line-height 0.85-1.0; let the last keyword carry a 2-3px Lime Voltage (#79fa4b) underline accent.
- Reserve Lime Voltage (#79fa4b) for accents only — eyebrow labels, underline flourishes, product icons, and gradient stops — never as a paragraph background or large fill.
- Use the four-tier surface stack (Abyss #002025 → Deep Kelp #05333a → Slate Reef #244348 → Tidewater #455c60) to imply depth without shadows; each step is roughly +5-8% luminance over the previous.
- Round all large containers — cards, illustrations, hero panels — to 30px; round all chips, tags, and small surfaces to 10px; round all buttons and pills to 999px. Never use a square corner on a card-sized element.
- Set body copy at 16-18px Gellix 400 in Bone (#fffffa) with -0.01 to -0.02em letter-spacing, and mute secondary text to Storm Glass (#7d8f92) or Sea Mist (#9eaeb0) at the same size.
- Use uppercase eyebrow labels at 12-13px Gellix 500 with 0.35em letter-spacing in Lime Voltage, typically preceded by a 6px lime-green dot, to introduce every major section.

### Don't
- Do not use a filled neutral or lime rectangle as a CTA background — the primary action must be the cyan-to-lime gradient pill; outlined actions in Pale Lime or Bone are the only acceptable alternatives.
- Do not set display headlines in weight 500 or 600 — the whisper-weight 300 at 90-120px is the signature; bolder display weights destroy the premium dark-canvas feel.
- Do not introduce shadows beyond the soft Abyss-tinted glow on the floating hero card — the design relies on surface-tier contrast and 30px radii, not drop shadows, to imply depth.
- Do not place photography on the page — all imagery must be UI mockups, isometric card grids, or icon-driven product illustrations rendered in lime-green and cyan.
- Do not use red, orange, or warm-saturated semantic colors — the palette is intentionally cold-teal with a single lime-green hit; success states should use Lime Voltage or Voltage Dark, not green-from-semantic-library.
- Do not set body text tighter than -0.02em — negative tracking works at 90px+ but destroys readability at 16-18px; respect the size-to-tracking curve.
- Do not exceed one gradient element per viewport — the cyan-to-lime gradient is precious; if a section already uses a gradient CTA, the section's underline accents and icons should stay solid Lime Voltage.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Abyss | `#002025` | Page canvas — the base plane every section sits on |
| 1 | Deep Kelp | `#05333a` | Card interior fill — slightly lifted from the canvas, used for the background inside larger card containers |
| 2 | Slate Reef | `#244348` | Floating cards and feature containers — clearly lifted from the canvas, the most common card surface |
| 3 | Tidewater | `#455c60` | Highest elevation surface — reserved for raised elements that need to break the floating-card pattern |

## Elevation

- **Floating product card:** `0 0 60px rgba(0, 32, 37, 0.4), inset 0 0 0 1px #244348`
- **Feature illustration card:** `0 0 0 1px #244348, inset 0 0 80px rgba(0, 32, 37, 0.6)`

## Imagery

No photography anywhere on the site — all visual content is illustration and product UI mockups. The hero features a floating glassmorphic insurance-product card with lime-green category icons and gradient placeholder bars. Mid-page sections use tilted isometric card grids showing miniature insurance-product tiles (each tile repeats the green-icon + gradient-bar pattern). Partner logos appear in a faded grid against the dark surface. Icons are consistently filled, rounded, and brand-green-tinted, with no outline-style icons anywhere. All illustrations feel schematic and product-focused — they show the platform itself rather than people, places, or lifestyle context. Imagery occupies roughly 30% of screen real estate, always contained inside 30px-radius rounded frames.

## Layout

The page is a single full-bleed dark canvas with content constrained to a max-width 1200px container centered horizontally. The hero is a two-column split: oversized headline + body + CTA on the left, floating glassmorphic product card on the right with significant negative space between them. Subsequent sections alternate between two rhythms: (1) split text-plus-illustration at 50/50 with the illustration tilted slightly and contained in a 30px-radius frame, and (2) full-width stats or partner-logo bands. Section gaps are generous (96-128px), creating the sensation of descending through layers of a system. Navigation is a minimal top bar with logo, five dropdown menu items, and a ghost outlined Contact-Us button right-aligned. There are no sidebars, no mega-menus expanded, and no sticky elements beyond the top nav. The grid system is implicit 12-column with comfortable gutters, and the visual rhythm deliberately avoids 3-column card grids in favor of asymmetric two-up compositions.

## Agent Prompt Guide

**Quick Color Reference**
- text primary: #fffffa (Bone)
- text muted: #7d8f92 (Storm Glass)
- background canvas: #002025 (Abyss Teal)
- card surface: #244348 (Slate Reef)
- border hairline: #244348 (Slate Reef)
- accent: #79fa4b (Lime Voltage)
- primary action: #a4ed8a (outlined action border)

**3-5 Example Component Prompts**
1. Create an Outlined Primary Action: Transparent background, #a4ed8a border and text, 9999px radius, compact pill padding. Use it for the main CTA instead of a filled button.

2. *Stats highlight block*: full-width band, Abyss Teal background, 30px radius, 1px Slate Reef (#244348) border, 40px padding. Left side: 'We've helped leading brands provide over $100+ Billion of protection.' in Gellix 300 at 26px, Bone, with '$100+ Billion' underlined in Lime Voltage. Right side: 2-column partner logo grid in Pale Foam (#b7c6c9) at 40% opacity. A 2px Lime Voltage gradient divider line spans the bottom of the block.

3. *Section with eyebrow + headline + body + illustration*: Eyebrow 'OUR PRODUCTS' at 12px Gellix 500, uppercase, 0.35em letter-spacing, Lime Voltage, preceded by a 6px Lime Voltage dot. Headline 'Products built for the modern world.' in Gellix 300 at 48px Bone, -0.03em letter-spacing, with 'world' underlined Lime Voltage. Body at 18px Gellix 400 in Storm Glass, with a Pale Lime (#a4ed8a) inline text link. Left side: a 30px-radius container holding a tilted (-3deg) grid of miniature product cards, each with a Lime Voltage icon and a cyan-to-lime gradient placeholder bar.

4. *Footer link with hover state*: Inline link 'or work with Boost to create something new.' set as Bone text at 18px Gellix 400 with no underline by default, gaining a 2px Lime Voltage underline on hover. The link sits at the end of a body paragraph in Storm Glass; only the link itself is Bone.

5. *Ghost outline nav button*: Transparent background, 1px Bone (#fffffa) border, 999px radius, 20px horizontal and 9px vertical padding, text 'Contact Us' in Gellix 500 at 14px Bone. Right-aligned in the 80px-tall top nav bar that sits directly on Abyss Teal canvas with no border.

## Similar Brands

- **Coalition (cyber insurance)** — Same dark teal canvas with a single vivid lime-green accent reserved for eyebrows, icons, and underlines; both favor oversized whisper-weight headlines and generous section breathing room.
- **Modern Treasury** — Same dark-mode enterprise fintech atmosphere with floating product cards, minimal saturated palette, and pill-shaped CTAs; the surface-tier contrast approach to depth (no heavy shadows) is shared.
- **Plaid** — Same restrained dark UI with a single brand-color accent used sparingly for CTAs and data visualization, plus the floating-card product-mockup illustration style in the hero.
- **Vouch (insurtech)** — Same insurtech category and dark-canvas treatment, with 30px-radius card containers and a single bright accent that gives technical infrastructure a sense of being switched on.
- **Ramp** — Same approach of whisper-weight display headlines on a dark canvas, pill CTAs, and rationing color to one or two accents rather than using a wide palette.

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-abyss-teal: #002025;
  --color-slate-reef: #244348;
  --color-tidewater: #455c60;
  --color-lichen: #54696c;
  --color-deep-kelp: #05333a;
  --color-storm-glass: #7d8f92;
  --color-sea-mist: #9eaeb0;
  --color-pale-foam: #b7c6c9;
  --color-bone: #fffffa;
  --color-lime-voltage: #79fa4b;
  --color-pale-lime: #a4ed8a;
  --color-voltage-dark: #0b3222;
  --color-cyan-pulse: #30d7f1;
  --gradient-cyan-pulse: linear-gradient(100.7deg, #30d7f1 8.74%, #79fa4b 92.06%);
  --color-solar-yellow: #fce344;
  --gradient-solar-yellow: linear-gradient(277.33deg, #fce344 -2.48%, #79fa4b 47.21%, #30d7f1 93.62%);

  /* Typography — Font Families */
  --font-gellix: 'Gellix', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-times: 'Times', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.3;
  --tracking-caption: 0.35px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.45;
  --tracking-body-sm: 0.08px;
  --text-body: 16px;
  --leading-body: 1.25;
  --tracking-body: -0.01px;
  --text-subheading: 18px;
  --leading-subheading: 1.3;
  --tracking-subheading: -0.01px;
  --text-heading-sm: 22px;
  --leading-heading-sm: 1.25;
  --tracking-heading-sm: -0.02px;
  --text-heading: 26px;
  --leading-heading: 1.2;
  --tracking-heading: -0.02px;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.1;
  --tracking-heading-lg: -0.03px;
  --text-display: 90px;
  --leading-display: 1;
  --tracking-display: -0.04px;
  --text-display-xl: 120px;
  --leading-display-xl: 0.85;
  --tracking-display-xl: -0.04px;

  /* Typography — Weights */
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-40: 40px;
  --spacing-60: 60px;
  --spacing-100: 100px;
  --spacing-112: 112px;
  --spacing-136: 136px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 96-128px;
  --card-padding: 40px;
  --element-gap: 20-25px;

  /* Border Radius */
  --radius-sm: 2.9952px;
  --radius-md: 4.9968px;
  --radius-lg: 10px;
  --radius-2xl: 15.9984px;
  --radius-3xl: 26.496px;
  --radius-3xl-2: 29.9952px;
  --radius-3xl-3: 33.9984px;
  --radius-full: 999px;

  /* Named Radii */
  --radius-tags: 999px;
  --radius-cards: 30px;
  --radius-images: 30px;
  --radius-buttons: 999px;
  --radius-smallelements: 10px;
  --radius-tightelements: 3px;

  /* Surfaces */
  --surface-abyss: #002025;
  --surface-deep-kelp: #05333a;
  --surface-slate-reef: #244348;
  --surface-tidewater: #455c60;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-abyss-teal: #002025;
  --color-slate-reef: #244348;
  --color-tidewater: #455c60;
  --color-lichen: #54696c;
  --color-deep-kelp: #05333a;
  --color-storm-glass: #7d8f92;
  --color-sea-mist: #9eaeb0;
  --color-pale-foam: #b7c6c9;
  --color-bone: #fffffa;
  --color-lime-voltage: #79fa4b;
  --color-pale-lime: #a4ed8a;
  --color-voltage-dark: #0b3222;
  --color-cyan-pulse: #30d7f1;
  --color-solar-yellow: #fce344;

  /* Typography */
  --font-gellix: 'Gellix', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-times: 'Times', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.3;
  --tracking-caption: 0.35px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.45;
  --tracking-body-sm: 0.08px;
  --text-body: 16px;
  --leading-body: 1.25;
  --tracking-body: -0.01px;
  --text-subheading: 18px;
  --leading-subheading: 1.3;
  --tracking-subheading: -0.01px;
  --text-heading-sm: 22px;
  --leading-heading-sm: 1.25;
  --tracking-heading-sm: -0.02px;
  --text-heading: 26px;
  --leading-heading: 1.2;
  --tracking-heading: -0.02px;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.1;
  --tracking-heading-lg: -0.03px;
  --text-display: 90px;
  --leading-display: 1;
  --tracking-display: -0.04px;
  --text-display-xl: 120px;
  --leading-display-xl: 0.85;
  --tracking-display-xl: -0.04px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-40: 40px;
  --spacing-60: 60px;
  --spacing-100: 100px;
  --spacing-112: 112px;
  --spacing-136: 136px;

  /* Border Radius */
  --radius-sm: 2.9952px;
  --radius-md: 4.9968px;
  --radius-lg: 10px;
  --radius-2xl: 15.9984px;
  --radius-3xl: 26.496px;
  --radius-3xl-2: 29.9952px;
  --radius-3xl-3: 33.9984px;
  --radius-full: 999px;
}
```
