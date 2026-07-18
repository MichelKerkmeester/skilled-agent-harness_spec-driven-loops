# Sketch — Style Reference
> serif poetry on pastel paper

**Theme:** light

Sketch's design language is a writer's studio reimagined as software: a quiet, nearly grayscale canvas where one warm serif headline and a single soft pink-to-lavender gradient do all the emotional work. The interface itself is restrained — Inter at modest sizes, thin dividers, pill-shaped controls — letting the product (the Sketch app) and the community's quotes breathe. The signature move is the dark pill CTA wrapped in a diffused magenta halo: a button that glows like a desk lamp at dusk, signaling action without shouting. Color is rationed; when it appears, it arrives as atmospheric wash (the hero gradient) or as a tiny punctuation (a violet badge, a teal tag), never as structural fill.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Obsidian | `#212123` | `--color-obsidian` | Primary text, headings, icon strokes — near-black with a faint cool undertone, softer than pure #000 to reduce glare on long-form copy |
| Bone | `#fafafa` | `--color-bone` | Light supporting surface for subtle backgrounds and section separation. Do not promote it to the primary CTA color |
| Graphite | `#4a4a4a` | `--color-graphite` | Body text, secondary copy, footer text — the mid-gray that creates the reading layer between headlines and captions |
| Carbon | `#000000` | `--color-carbon` | Pure black reserved for the highest-contrast elements: nav links, button labels, icon fills where absolute clarity is required |
| Slate | `#5c5c5c` | `--color-slate` | Muted body text, secondary nav, caption-level copy |
| Mist | `#a7a7a7` | `--color-mist` | Placeholder text, disabled states, tertiary icons, hairline strokes where subtlety is the point |
| Ash | `#c4c4c4` | `--color-ash` | Subtle shadows under icons and buttons, ghost borders on inactive controls |
| Fog | `#e6e6e6` | `--color-fog` | Input field shadows, card hairline borders, the lightest visible structural line |
| Onyx | `#151515` | `--color-onyx` | Dark supporting neutral for text, icons, and strong contrast. Do not promote it to the primary CTA color |
| Steel | `#7f7f7f` | `--color-steel` | Tertiary text, metadata, timestamps in testimonials |
| Iris | `#555dff` | `--color-iris` | Accent badges, feature tags — a single violet used sparingly as categorical punctuation on a sea of grayscale |
| Lagoon | `#03cbbc` | `--color-lagoon` | Secondary accent badges — a cool teal that pairs with Iris as the site's only chromatic vocabulary for tags and labels |
| Cobalt | `#4389e6` | `--color-cobalt` | Blue supporting accent for decorative details and low-frequency emphasis |
| Dusk Wash | `linear-gradient(104deg, rgb(252, 122, 155) 0%, rgb(180, 126, 238) 100%)` | `--color-dusk-wash` | Hero atmospheric gradient — the warm pink that bleeds into lavender across the hero, setting the entire emotional register |
| Prism Drift | `linear-gradient(90deg, rgb(50, 173, 247) 20%, rgb(116, 75, 208) 40%, rgb(233, 127, 66) 50%, rgb(50, 173, 247) 75%)` | `--color-prism-drift` | Decorative multi-stop gradient used in product showcase contexts — blue to purple to orange, cycling for visual energy |

## Tokens — Typography

### Reckless — Display headings only — the editorial serif used for hero text and large section titles. Weight 500 (medium) with tightened tracking (-0.02em to -0.023em) gives it a literary confidence without feeling old-fashioned. The choice to use a serif at all is the signature: most SaaS toolkits default to geometric sans-serifs; Reckless signals that Sketch is a craft tool for people who think in type. · `--font-reckless`
- **Substitute:** Playfair Display, Source Serif Pro, or Lora
- **Weights:** 500
- **Sizes:** 44px, 76px
- **Line height:** 1.00, 1.09
- **Letter spacing:** -0.023em at 76px, -0.02em at 44px
- **OpenType features:** `"calt", "liga"`
- **Role:** Display headings only — the editorial serif used for hero text and large section titles. Weight 500 (medium) with tightened tracking (-0.02em to -0.023em) gives it a literary confidence without feeling old-fashioned. The choice to use a serif at all is the signature: most SaaS toolkits default to geometric sans-serifs; Reckless signals that Sketch is a craft tool for people who think in type.

### InterVariable — All UI, body, navigation, buttons, inputs, and small headings. Inter's tall x-height and open counters keep body text readable at 14–16px; the 300 weight is used for lighter emphasis (captions, helper text), 400 for body, 500 for button labels and nav items, 600 for small section headings. The variable axis allows smooth weight transitions without loading separate files. · `--font-intervariable`
- **Substitute:** Inter (Google Fonts), or system-ui
- **Weights:** 300, 400, 500, 600
- **Sizes:** 11px, 12px, 14px, 15px, 16px, 17px, 20px, 22px, 24px
- **Line height:** 1.00, 1.09, 1.15, 1.17, 1.25, 1.33, 1.40, 1.41, 1.43, 1.50, 1.60, 1.65
- **Letter spacing:** normal
- **OpenType features:** `"calt", "liga"`
- **Role:** All UI, body, navigation, buttons, inputs, and small headings. Inter's tall x-height and open counters keep body text readable at 14–16px; the 300 weight is used for lighter emphasis (captions, helper text), 400 for body, 500 for button labels and nav items, 600 for small section headings. The variable axis allows smooth weight transitions without loading separate files.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 11px | 1.5 | — | `--text-caption` |
| body-lg | 15px | 1.6 | — | `--text-body-lg` |
| heading-sm | 20px | 1.4 | — | `--text-heading-sm` |
| heading | 22px | 1.33 | — | `--text-heading` |
| heading-lg | 24px | 1.25 | — | `--text-heading-lg` |
| display-sm | 44px | 1 | -0.88px | `--text-display-sm` |
| display | 76px | 1 | -1.75px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 8px

**Density:** spacious

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 8 | 8px | `--spacing-8` |
| 16 | 16px | `--spacing-16` |
| 24 | 24px | `--spacing-24` |
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 56 | 56px | `--spacing-56` |
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |
| 88 | 88px | `--spacing-88` |
| 96 | 96px | `--spacing-96` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 24px |
| cards | 20px |
| icons | 8px |
| badges | 9999px |
| images | 12px |
| inputs | 3px |
| buttons | 20px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| subtle | `rgba(0, 0, 0, 0.2) 0px 1px 3px 0px` | `--shadow-subtle` |
| subtle-2 | `rgba(0, 0, 0, 0.05) 0px 1px 1px 0px inset, rgba(255, 255,...` | `--shadow-subtle-2` |
| sm | `rgba(0, 0, 0, 0.1) 0px 2px 4px 0px` | `--shadow-sm` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 24px
- **Element gap:** 8px

## Components

### Glow Halo CTA
**Role:** Primary action button — the signature dark pill with diffused magenta border

Filled button with #151515 background, white text, 20px border-radius, ~12px 24px padding. Distinctive feature: a soft outer glow ring in warm pink/magenta (the button appears to sit inside a blurred halo, roughly 3–4px outside the border). Inter weight 500, 15px. Download arrow icon in white. Used for the hero 'Get started for free' and the persistent 'Get started' in the nav.

### Ghost Nav Button
**Role:** Secondary nav action

Transparent or Bone (#fafafa) fill, Obsidian (#212123) text, 20px radius, smaller padding (~8px 16px). Inter weight 500, 15px. Used for 'Sign In' in the navigation. No border.

### Diamond Logo Mark
**Role:** Brand identifier in nav

A diamond/triangular glyph in Obsidian (#212123) — the only brand mark present. Clean geometric shape, no gradient or fill treatment. Appears top-left, 24–28px tall.

### Announcement Banner
**Role:** In-page update notice

Rounded card with white/Bone fill, 20px radius, subtle border or soft shadow. Contains a bold title (Inter 600, 15px) and lighter description text (Inter 400, 14px, Graphite). Centered horizontally, max-width ~600px. Sits below the hero CTA area.

### Hero Headline Block
**Role:** Primary display text

Reckless serif at 76px, weight 500, Obsidian color, letter-spacing -1.75px, line-height 1.0. Left-aligned, max-width ~480px. Set against a soft pink-to-lavender gradient background. Pair: Inter body text at 16px in Graphite, max-width ~420px.

### Accent Badge
**Role:** Categorical tags and labels

Pill-shaped (9999px radius), ~6px 12px padding, Inter weight 500 at 11–12px, white text on chromatic fill. Three variants: Iris (#555dff), Lagoon (#03cbbc), Cobalt (#4389e6). Used for feature categorization, not as buttons.

### Product Showcase Card
**Role:** Large image/screenshot container

Full-bleed screenshot of the Sketch app interface, 20px corner radius, subtle drop shadow. No border. The image itself contains the product UI with a purple/pink gradient overlay. Centered, max-width ~900px, sits below announcement banner.

### Testimonial Quote Card
**Role:** Social proof display

Bone (#fafafa) or white fill, no visible border, generous internal padding (~32px). Large quotation mark glyph in Fog (#a7a7a7) or Light gray as decorative element. Quote text in Obsidian, Inter 400 at 16–17px. Faded/disabled testimonials use reduced opacity (~30%) and Mist (#a7f7f7) text to create a carousel preview effect.

### Navigation Bar
**Role:** Top-level site navigation

Transparent or Bone background, sticky position, 24px radius on any visible pill elements. Logo left, nav links center-left (Product dropdown, Explore dropdown, Pricing, Support), actions right (Sign In text link + Glow Halo CTA). Inter weight 500 at 15px for nav items. Dropdown items in Inter 400 at 14px.

### Dropdown Menu Panel
**Role:** Expanded navigation submenu

Bone background, 20px radius, soft shadow. Two-column layout with category headers (Inter 600, 14px) and link items (Inter 400, 14px). Generous padding (24px). Items separated by 8–12px vertical spacing.

### Secondary Nav Bar
**Role:** Section-level navigation

Appears on sub-pages with links (Design, Prototype, Collaborate, About Sketch) left-aligned and the Glow Halo CTA right-aligned. No background, just text links in Obsidian with the same pill CTA.

### Input Field
**Role:** Text input

Bone background, 3px or 16px border-radius, 1px Fog (#e6e6e6) border. Inter 400 at 14px placeholder text in Mist (#a7a7a7). Padding ~12px 16px. Minimal, no focus glow — the restraint is the point.

## Do's and Don'ts

### Do
- Use Reckless serif at 44–76px for display headlines only; never for body, UI, or navigation text.
- Set the primary CTA to a #151515 fill with the signature pink/magenta outer glow ring at 20px radius.
- Keep the page canvas at #fafafa (Bone) and reserve #212123 (Obsidian) for primary text and the darkest interactive states.
- Apply the pink-to-lavender gradient (Dusk Wash) as a full-bleed hero background; never as a small decorative element or button fill.
- Use the three accent colors (Iris, Lagoon, Cobalt) only inside 9999px-radius badges; never as background fills for cards, buttons, or large surfaces.
- Maintain 8px as the base spacing unit with 80px vertical rhythm between sections.
- Set body text at 14–16px Inter with 1.5–1.6 line-height; the reading layer is generous, not dense.

### Don't
- Don't use Reckless below 44px — the serif's character requires display-scale size to read correctly.
- Don't introduce additional saturated colors beyond Iris, Lagoon, and Cobalt; the system is 97% achromatic by design.
- Don't apply the Dusk Wash gradient to cards, buttons, or text backgrounds — it is atmospheric only.
- Don't use sharp corners (0–4px) on cards or buttons; the minimum structural radius is 8px for icons, 20px for containers.
- Don't add heavy drop shadows to cards; use hairline borders or the existing subtle shadow patterns, not theatrical elevation.
- Don't use weight 700 or above in Inter; the max weight in the system is 600.
- Don't place chromatic badges on chromatic backgrounds; badges need the Bone or Obsidian canvas behind them to read.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Bone Canvas | `#fafafa` | Primary page background — the warm off-white that gives the site its paper-like, studio quality |
| 1 | Pure White Cards | `#ffffff` | Product screenshots, announcement cards, elevated surfaces that need to feel like paper laid on the canvas |
| 2 | Onyx Action | `#151515` | Primary CTA button fill — the darkest interactive surface, wrapped in the signature pink glow |
| 3 | Dusk Gradient | `#fc7a9b` | Atmospheric hero background — a soft pink-to-lavender wash that bleeds from the top-left, signaling warmth without saturation |

## Elevation

- **Glow Halo CTA:** `0 0 0 3px rgba(252, 122, 155, 0.35), 0 0 12px 2px rgba(252, 122, 155, 0.2)`
- **Icon container:** `0px 1px 3px 0px rgba(0, 0, 0, 0.2)`
- **Nav dropdown panel:** `0px 4px 16px 0px rgba(0, 0, 0, 0.08), 0px 1px 2px 0px rgba(0, 0, 0, 0.04)`

## Imagery

The site is text-dominant with one large product screenshot as the primary visual asset. That screenshot shows the actual Sketch app interface — a dense tool panel on the left, canvas in the center, inspector on the right — overlaid with a purple/pink gradient wash that ties it to the hero's atmosphere. Decorative elements are minimal: large quotation mark glyphs in the testimonial section, a diamond logo mark, and a few small UI icons. No photography, no illustrations, no abstract 3D renders — the product IS the visual content. The hero gradient and the product screenshot gradient are the only chromatic visual treatments.

## Layout

Max-width ~1200px centered content with full-bleed hero sections. The hero uses a soft pink-to-lavender gradient that bleeds from the top-left corner, with headline + subtext + CTA left-aligned and max-width ~480px. Navigation is a clean top bar: logo left, links center-left, Sign In + CTA right. Below the hero: a centered announcement card, then a full-width product screenshot (no side margins, bleeds to ~900px max). The testimonial section uses a carousel pattern with the active quote at full opacity and adjacent quotes faded to ~30% opacity, creating a sense of depth. Section rhythm is 80px vertical gaps with seamless flow — no alternating dark bands, no visible dividers between sections. The overall density is spacious: one idea per screen, generous whitespace, the product screenshot does the heavy lifting.

## Agent Prompt Guide

Quick Color Reference:
- text: #212123 (Obsidian)
- background: #fafafa (Bone)
- border: #e6e6e6 (Fog) for hairlines, #a7a7a7 (Mist) for muted
- accent: #555dff (Iris) for violet badges
- primary action: no distinct CTA color

3 Example Component Prompts:

No distinct primary action color was observed; use the extracted neutral button treatments instead of inventing a filled CTA color.

2. Create a testimonial card: #fafafa background, 20px radius, no border, 32px padding. Large decorative quotation mark in #a7a7a7 at 64px. Quote text in Inter 400 at 17px, #212123, line-height 1.6. Attribution below in Inter 500 at 14px, #4a4a4a.


## Gradient System

Two gradients serve different roles and must never be mixed:

1. Dusk Wash (atmospheric): linear-gradient(104deg, #fc7a9b 0%, #b47ede 100%). Applied only as full-bleed hero/background wash at 20–40% opacity over the Bone canvas. This is the site's emotional signature — warm, editorial, unhurried.

2. Prism Drift (energy): linear-gradient(90deg, #32adf7 20%, #744bd0 40%, #e97f42 50%, #32adf7 75%). A four-stop cycling gradient used only in product showcase contexts — specifically behind or overlaid on the Sketch app screenshot. Its function is to make the product feel alive and colorful without committing the interface to any of those hues.

Rule: Never use these gradients on text, buttons, or small UI elements. They are scene-setters, not accent fills.

## Typographic Voice

The Reckless/Inter pairing is the most opinionated choice in the system. Reckless at 76px with -1.75px tracking says 'we are confident enough to use a serif for our biggest promise.' Inter handles everything below 24px because its clarity and tall x-height keep UI elements readable at small sizes. The contrast between a literary display face and a workhorse UI face is the entire tone: craft meets tool, writer meets software.

Letter-spacing is aggressive on display (approximately -2.3% of font size) and normal everywhere else. Never apply negative tracking to Inter — the optical adjustments are already baked in and tightening further makes it feel clinical rather than confident.

## Similar Brands

- **Notion** — Same restrained grayscale canvas with a single serif/sans pairing and generous whitespace; both use pill-shaped buttons and soft shadows
- **Figma** — Same product-as-marketing approach where the app screenshot is the hero visual; both use minimal accent colors against near-white backgrounds
- **Linear** — Same opinionated typography pairing (serif display + geometric sans body) and dark pill CTAs as primary actions
- **Arc Browser** — Same atmospheric gradient hero treatment and editorial serif headlines that break the SaaS convention of geometric sans-serif display type

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-obsidian: #212123;
  --color-bone: #fafafa;
  --color-graphite: #4a4a4a;
  --color-carbon: #000000;
  --color-slate: #5c5c5c;
  --color-mist: #a7a7a7;
  --color-ash: #c4c4c4;
  --color-fog: #e6e6e6;
  --color-onyx: #151515;
  --color-steel: #7f7f7f;
  --color-iris: #555dff;
  --color-lagoon: #03cbbc;
  --color-cobalt: #4389e6;
  --color-dusk-wash: #fc7a9b;
  --gradient-dusk-wash: linear-gradient(104deg, rgb(252, 122, 155) 0%, rgb(180, 126, 238) 100%);
  --color-prism-drift: #32adf7;
  --gradient-prism-drift: linear-gradient(90deg, rgb(50, 173, 247) 20%, rgb(116, 75, 208) 40%, rgb(233, 127, 66) 50%, rgb(50, 173, 247) 75%);

  /* Typography — Font Families */
  --font-reckless: 'Reckless', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-intervariable: 'InterVariable', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.5;
  --text-body-lg: 15px;
  --leading-body-lg: 1.6;
  --text-heading-sm: 20px;
  --leading-heading-sm: 1.4;
  --text-heading: 22px;
  --leading-heading: 1.33;
  --text-heading-lg: 24px;
  --leading-heading-lg: 1.25;
  --text-display-sm: 44px;
  --leading-display-sm: 1;
  --tracking-display-sm: -0.88px;
  --text-display: 76px;
  --leading-display: 1;
  --tracking-display: -1.75px;

  /* Typography — Weights */
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;

  /* Spacing */
  --spacing-unit: 8px;
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-56: 56px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-88: 88px;
  --spacing-96: 96px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 24px;
  --element-gap: 8px;

  /* Border Radius */
  --radius-sm: 3px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-3xl: 24px;
  --radius-3xl-2: 28px;
  --radius-full: 9999px;

  /* Named Radii */
  --radius-nav: 24px;
  --radius-cards: 20px;
  --radius-icons: 8px;
  --radius-badges: 9999px;
  --radius-images: 12px;
  --radius-inputs: 3px;
  --radius-buttons: 20px;

  /* Shadows */
  --shadow-subtle: rgba(0, 0, 0, 0.2) 0px 1px 3px 0px;
  --shadow-subtle-2: rgba(0, 0, 0, 0.05) 0px 1px 1px 0px inset, rgba(255, 255, 255, 0.5) 0px 1px 4px 0px inset, rgba(0, 0, 0, 0.94) 0px -2px 4px 0px inset, rgba(0, 0, 0, 0.2) 0px 1px 4px 0px;
  --shadow-sm: rgba(0, 0, 0, 0.1) 0px 2px 4px 0px;

  /* Surfaces */
  --surface-bone-canvas: #fafafa;
  --surface-pure-white-cards: #ffffff;
  --surface-onyx-action: #151515;
  --surface-dusk-gradient: #fc7a9b;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-obsidian: #212123;
  --color-bone: #fafafa;
  --color-graphite: #4a4a4a;
  --color-carbon: #000000;
  --color-slate: #5c5c5c;
  --color-mist: #a7a7a7;
  --color-ash: #c4c4c4;
  --color-fog: #e6e6e6;
  --color-onyx: #151515;
  --color-steel: #7f7f7f;
  --color-iris: #555dff;
  --color-lagoon: #03cbbc;
  --color-cobalt: #4389e6;
  --color-dusk-wash: #fc7a9b;
  --color-prism-drift: #32adf7;

  /* Typography */
  --font-reckless: 'Reckless', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-intervariable: 'InterVariable', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.5;
  --text-body-lg: 15px;
  --leading-body-lg: 1.6;
  --text-heading-sm: 20px;
  --leading-heading-sm: 1.4;
  --text-heading: 22px;
  --leading-heading: 1.33;
  --text-heading-lg: 24px;
  --leading-heading-lg: 1.25;
  --text-display-sm: 44px;
  --leading-display-sm: 1;
  --tracking-display-sm: -0.88px;
  --text-display: 76px;
  --leading-display: 1;
  --tracking-display: -1.75px;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-56: 56px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-88: 88px;
  --spacing-96: 96px;

  /* Border Radius */
  --radius-sm: 3px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-3xl: 24px;
  --radius-3xl-2: 28px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-subtle: rgba(0, 0, 0, 0.2) 0px 1px 3px 0px;
  --shadow-subtle-2: rgba(0, 0, 0, 0.05) 0px 1px 1px 0px inset, rgba(255, 255, 255, 0.5) 0px 1px 4px 0px inset, rgba(0, 0, 0, 0.94) 0px -2px 4px 0px inset, rgba(0, 0, 0, 0.2) 0px 1px 4px 0px;
  --shadow-sm: rgba(0, 0, 0, 0.1) 0px 2px 4px 0px;
}
```
