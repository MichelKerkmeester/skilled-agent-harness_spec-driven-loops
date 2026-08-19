# Cora — Style Reference
> Romantic sky painting with floating desk

**Theme:** light

Cora pairs a romantic plein-air sky painting with a precision product interface — the page feels like looking up through clouds at freedom, then returning to a calm desk. The signature move is full-bleed atmospheric illustration as the canvas, not as a banner: tree branches, cumulus clouds, and birds occupy the entire viewport, with UI elements floating on top like cards laid against a window. Typography is literary: a light-weight serif (signifier) for headlines whispers where most SaaS sites shout, and a workhorse sans (switzer) handles the product surface. Color stays minimal — vivid cerulean sky, one deep navy for filled actions, warm red as a single ink-stamp accent — so the painting and the type do the emotional work, not the palette.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Cerulean Sky | `#117bc8` | `--color-cerulean-sky` | Full-bleed canvas for hero and atmospheric sections, primary nav background, sky-illustration base |
| Deep Cerulean | `#0d5c96` | `--color-deep-cerulean` | Tinted shadow color — the brand-blue cast on every elevation shadow makes even drop shadows feel atmospheric |
| Atmosphere Blue | `#60a8dd` | `--color-atmosphere-blue` | Outlined action border — secondary buttons and card outlines gain a cool sky tint instead of neutral gray |
| Midnight Navy | `#09426c` | `--color-midnight-navy` | Primary filled action background — the Get Started pill, pressed against the sky, reads as a deep horizon line |
| Berry Red | `#cf372d` | `--color-berry-red` | Single chromatic accent — reserved for emphasis ink, important markers, and the occasional stamp of urgency against the blue |
| Cloud White | `#ffffff` | `--color-cloud-white` | Primary surface for cards, product UI, testimonial panels — the white that floats against the sky |
| Mist Gray | `#ebebeb` | `--color-mist-gray` | Subtle card background for nested surfaces, the lightest gray still distinct from pure white |
| Fog | `#dadada` | `--color-fog` | Hairline borders and dividers — the only neutral border color in the system |
| Stone | `#a1a1a1` | `--color-stone` | Muted helper text and secondary metadata |
| Graphite | `#7d7d7d` | `--color-graphite` | Tertiary text, icon fills, low-emphasis labels |
| Ink | `#2b2b2b` | `--color-ink` | Body text and dominant UI strokes — the dark that anchors serif type against white cards |
| Obsidian | `#1d1b20` | `--color-obsidian` | Deepest text tone, used sparingly for highest-emphasis body copy with a barely-warm purple undertone |

## Tokens — Typography

### switzer — Product and UI workhorse — body copy at 16-18px weight 400, navigation and buttons at 14-16px weight 500-600, labels at 12-14px weight 500. This geometric grotesque (Indian Type Foundry) stays out of the serif's way; the pair of a literary display face and a neutral UI face is the system's tonal balance. · `--font-switzer`
- **Substitute:** Inter, Geist, Manrope
- **Weights:** 400, 500, 600, 700
- **Sizes:** 12, 14, 15, 16, 17, 18, 20, 22
- **Line height:** 1.00-1.24
- **Role:** Product and UI workhorse — body copy at 16-18px weight 400, navigation and buttons at 14-16px weight 500-600, labels at 12-14px weight 500. This geometric grotesque (Indian Type Foundry) stays out of the serif's way; the pair of a literary display face and a neutral UI face is the system's tonal balance.

### signifier — Display and headline serif — light weight (300) at 45-55px for hero and section titles, regular (400) at 24-36px for subheadings. The italic-leaning, high-contrast serif (Indian Type Foundry family) is the brand's literary voice; weight 300 makes headlines feel aspirational rather than commanding. · `--font-signifier`
- **Substitute:** Cormorant Garamond, EB Garamond, Playfair Display
- **Weights:** 300, 400
- **Sizes:** 24, 34, 36, 45, 55
- **Line height:** 1.02-1.20
- **Role:** Display and headline serif — light weight (300) at 45-55px for hero and section titles, regular (400) at 24-36px for subheadings. The italic-leaning, high-contrast serif (Indian Type Foundry family) is the brand's literary voice; weight 300 makes headlines feel aspirational rather than commanding.

### Times — Times — detected in extracted data but not described by AI · `--font-times`
- **Weights:** 400
- **Sizes:** 16px
- **Line height:** 1.2
- **Role:** Times — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.2 | — | `--text-caption` |
| body-sm | 14px | 1.24 | — | `--text-body-sm` |
| body | 16px | 1.2 | — | `--text-body` |
| subheading | 22px | 1.2 | — | `--text-subheading` |
| heading-sm | 34px | 1.18 | — | `--text-heading-sm` |
| heading | 45px | 1.02 | — | `--text-heading` |
| display | 55px | 1.02 | — | `--text-display` |

## Tokens — Spacing & Shapes

**Density:** compact

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 5 | 5px | `--spacing-5` |
| 6 | 6px | `--spacing-6` |
| 7 | 7px | `--spacing-7` |
| 8 | 8px | `--spacing-8` |
| 10 | 10px | `--spacing-10` |
| 11 | 11px | `--spacing-11` |
| 12 | 12px | `--spacing-12` |
| 14 | 14px | `--spacing-14` |
| 15 | 15px | `--spacing-15` |
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 21 | 21px | `--spacing-21` |
| 22 | 22px | `--spacing-22` |
| 38 | 38px | `--spacing-38` |
| 108 | 108px | `--spacing-108` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 9999px |
| cards | 12px |
| inputs | 8px |
| modals | 20px |
| buttons | 9999px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| sm | `rgba(0, 0, 0, 0.25) 4px 6px 8px -2px, rgba(0, 0, 0, 0.2) ...` | `--shadow-sm` |
| sm-2 | `rgba(0, 0, 0, 0.1) 0px 4px 4px 0px` | `--shadow-sm-2` |
| sm-3 | `rgba(0, 0, 0, 0.25) 4px 6px 8px 0px, rgba(0, 0, 0, 0.25) ...` | `--shadow-sm-3` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 64px
- **Card padding:** 24px
- **Element gap:** 12px

## Components

### Hero Sky Panel
**Role:** Full-viewport atmospheric illustration as page canvas

Full-bleed sky painting (cumulus clouds, tree foliage, birds) at 100vw × 100vh. No gradient overlay — the illustration IS the background. White serif headline at 55px, weight 300, centered. White subtext at 18px switzer weight 400. All text floats directly on the painted sky with no card or panel behind it.

### Primary Filled Action
**Role:** The single most important conversion on any page

Pill shape, 9999px radius. Background #09426c (Midnight Navy), text #ffffff, switzer 16px weight 500. Padding 12px 24px. Trailing arrow icon (→) at 16px. No border. The dark navy against cerulean sky reads as a horizon line — this is the button that anchors the composition.

### Secondary Outlined Action
**Role:** Alternative or lower-priority action

Pill shape, 9999px radius. Transparent or #ffffff background, 1px border in #60a8dd (Atmosphere Blue), text #60a8dd, switzer 16px weight 500. Padding 12px 24px. The sky-tinted border keeps the secondary action on-brand instead of falling to neutral gray.

### Top Nav
**Role:** Persistent header over sky backgrounds

Full-width, transparent over hero. Logo left: white 'Coro' wordmark in a small bordered badge. Right cluster: text link 'Log in' in white, then a solid #117bc8 (Cerulean Sky) pill 'Start free trial' with white text. The nav sits on the painting without a background fill — it trusts the illustration to provide contrast.

### Testimonial Card
**Role:** Social proof floating against white or sky

White (#ffffff) background, 12px radius, 24px padding. Shadow: 0px 4px 4px 0px rgba(0,0,0,0.1). Quote text in switzer 16px weight 400 #2b2b2b. Attribution line: bold name 14px switzer 600, role/company 14px weight 400 in Stone (#a1a1a1). Optional small avatar circle. Cards float on white sections with generous 24px gap between them.

### Product UI Preview Frame
**Role:** In-context screenshot of the email dashboard

Laptop bezel mockup at ~70% page width, centered. Inside: white app surface with a blue header bar (#117bc8), serif date heading, list of email cards. The product UI uses the same #117bc8 blue for its internal header — the in-app color matches the marketing canvas, bridging the two surfaces.

### Email Row Card
**Role:** In-product list item (visible in the dashboard preview)

White background, 8px radius, 12px padding. Hairline bottom border in #dadada. Subject line in switzer 16px weight 500 #2b2b2b. Preview text in 14px weight 400 #7d7d7d. Optional status dot or category label left-aligned.

### Section Headline on Sky
**Role:** Large headline floating on the continuing sky illustration

White signifier serif at 45px weight 300, centered. Optional supporting copy at 18px switzer 400 #ffffff with 60% opacity. The sky painting continues behind — sections don't end at the viewport; the illustration flows vertically through the page.

### Hairline Divider
**Role:** Separator between content blocks

1px solid #dadada. Used sparingly — most separation is achieved through white space and the sky/white alternation rather than lines.

### Logo Badge
**Role:** Brand mark in nav and footer

Small rectangle (approx 60×32px) with 1px white border on blue backgrounds, or 1px #2b2b2b border on white. 'Coro' wordmark inside, switzer 16px weight 600 in white or ink. On sky sections, the badge gets a subtle dotted/star pattern decoration on the border.

### Floating CTA Bar
**Role:** Full-width free-trial prompt on sky sections

Centered pill button in the upper portion of a sky-only section. Same Primary Filled Action styling. No background panel — the button sits naked against the painting.

### Muted Body Text
**Role:** Secondary descriptive copy

switzer 18px weight 400 in #7d7d7d (Graphite) for helper descriptions, or #ffffff at 80% opacity when on sky. Line height 1.24 for breathing room.

## Do's and Don'ts

### Do
- Use the full-bleed sky illustration as the page canvas for hero and transition sections — never crop it to a banner shape or place it in a card.
- Set all drop shadows with the brand-blue tint (#0d5c96 at 0.25 opacity or rgba(0,0,0,0.1)) — neutral gray shadows break the atmospheric mood.
- Pair serif (signifier) at weight 300 with sans (switzer) at weight 400-500 — never set UI text in the serif or headlines in bold sans.
- Use 9999px pill radius for every button and tag — square or rounded-rect buttons break the system's softness.
- Alternate full-bleed sky sections with white content sections — the rhythm of painting → quiet → painting creates the breathing cadence.
- Keep the palette to white, cerulean, midnight navy, atmosphere blue, and one red accent — do not introduce additional chromatic UI colors.
- Set the Primary Filled Action background to #09426c (Midnight Navy), not to #117bc8 — the filled button must be darker than the sky to read as a foreground object.

### Don't
- Do not use solid #117bc8 as a filled button background — it disappears against the sky canvas; the filled action must be Midnight Navy (#09426c).
- Do not place serif (signifier) type on body copy, nav items, or button labels — it is reserved for headlines at 24px and above.
- Do not add a card or panel behind headlines floating on the sky — the text should sit directly on the illustration.
- Do not use neutral gray borders (#cccccc, #e0e0e0) — all borders are either #dadada (hairline on white) or #60a8dd (on sky).
- Do not crop, overlay gradients on, or apply blur to the sky illustration — it must be shown raw and full-bleed.
- Do not introduce additional accent hues (greens, purples, yellows) — the palette is disciplined: cerulean, navy, one red, neutrals.
- Do not set body text below 14px or above 18px — switzer is tuned for that range and loses its clarity outside it.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Sky Canvas | `#117bc8` | Full-bleed painted background for hero and atmospheric transition sections |
| 1 | Cloud White | `#ffffff` | Quiet content sections, cards, product UI surfaces, testimonial panels |
| 2 | Mist Gray | `#ebebeb` | Nested or secondary card backgrounds when white-on-white needs a tier break |

## Elevation

- **Testimonial Card:** `0px 4px 4px 0px rgba(0, 0, 0, 0.1)`
- **Product Preview Frame:** `4px 6px 8px -2px rgba(0, 0, 0, 0.25), -4px -1px 8px -2px rgba(0, 0, 0, 0.2)`
- **Elevated Card:** `4px 6px 8px 0px rgba(0, 0, 0, 0.25), -4px -6px 8px 0px rgba(0, 0, 0, 0.25)`

## Imagery

The defining visual element is a full-bleed romantic landscape painting — cerulean sky, volumetric cumulus clouds, a large tree with autumn-tinted foliage on one side, birds in flight. The illustration occupies 100% of the viewport and flows vertically through the page, breaking only for white content sections before continuing. The style is painterly and 19th-century-romantic (plein-air, almost Thomas Cole) rather than flat or modern. Product UI appears only as a contained laptop mockup inside the hero, never as full-bleed screenshots elsewhere. Icons are minimal — a single arrow on the CTA button is the only glyph. No photography, no 3D, no abstract gradients. The painting carries the entire emotional weight of the brand.

## Layout

Page is structured as alternating full-bleed atmospheric bands and quiet white content bands. The hero is 100vh of sky painting with centered serif headline and a single CTA. Testimonial cards float on a white section in a horizontal row with generous gap. Product preview sits centered below the hero headline. Subsequent sections return to the sky illustration with floating headlines and CTAs. Navigation is a minimal transparent bar over the hero. Content blocks that contain copy are constrained to a max-width of ~1200px and centered, while the sky painting is always full-bleed regardless of viewport. The vertical rhythm is: sky hero → white testimonials → sky section → white content → sky CTA — the painting is the connective tissue between quiet product moments.

## Agent Prompt Guide

**Quick Color Reference**
- Background (sky canvas): #117bc8
- Background (quiet sections): #ffffff
- Text (primary): #2b2b2b
- Text (muted): #7d7d7d
- Border (hairline): #dadada
- Accent: #cf372d (Berry Red — use sparingly)
- primary action: #09426c (filled action)

**Example Component Prompts**

1. *Hero with floating headline:* Full-viewport background of a painted cerulean sky with clouds and tree foliage (100vw × 100vh, no overlay). Centered white serif headline at 55px signifier weight 300. White subtext at 18px switzer weight 400 with 80% opacity. primary action: #09426c (filled action)

2. *Testimonial card on white:* White (#ffffff) card, 12px radius, 24px padding, shadow 0px 4px 4px rgba(0,0,0,0.1). Quote in switzer 16px weight 400 #2b2b2b. Attribution: name in switzer 14px weight 600 #2b2b2b, role in switzer 14px weight 400 #a1a1a1. Float in a horizontal row with 24px gap between cards on a white section background.

3. *Section headline on continuing sky:* White signifier serif at 45px weight 300, centered, sitting directly on the sky illustration with no card or panel behind it. Supporting copy at 18px switzer 400, white at 80% opacity. Optional Atmosphere Blue (#60a8dd) outlined pill button below as secondary action.

4. *Product email row (in-app surface):* White card 8px radius, 12px padding, 1px bottom border in #dadada. Subject in switzer 16px weight 500 #2b2b2b. Preview in switzer 14px weight 400 #7d7d7d. Sits inside a white app surface with a #117bc8 header bar.

5. *Outlined ghost action:* Pill 9999px radius, transparent background, 1px border #60a8dd, text #60a8dd, switzer 16px weight 500, 12px 24px padding. Use for secondary CTAs that must stay visible on the sky background.

## Similar Brands

- **Linear** — Same single-accent-color discipline and generous full-bleed hero sections with centered serif-leaning type
- **Arc** — Same romantic, atmospheric full-bleed illustration treatment used as the entire hero canvas rather than a contained banner
- **Notion** — Same ultra-minimal UI chrome (one filled button, one ghost button, transparent nav) that lets the imagery and type carry the page
- **Loom** — Same soft, aspirational brand atmosphere with serif headlines and a single cerulean-blue accent for the primary action
- **Clay** — Same literary serif display + neutral sans body pairing and full-bleed atmospheric section breaks

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-cerulean-sky: #117bc8;
  --color-deep-cerulean: #0d5c96;
  --color-atmosphere-blue: #60a8dd;
  --color-midnight-navy: #09426c;
  --color-berry-red: #cf372d;
  --color-cloud-white: #ffffff;
  --color-mist-gray: #ebebeb;
  --color-fog: #dadada;
  --color-stone: #a1a1a1;
  --color-graphite: #7d7d7d;
  --color-ink: #2b2b2b;
  --color-obsidian: #1d1b20;

  /* Typography — Font Families */
  --font-switzer: 'switzer', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-signifier: 'signifier', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-times: 'Times', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.2;
  --text-body-sm: 14px;
  --leading-body-sm: 1.24;
  --text-body: 16px;
  --leading-body: 1.2;
  --text-subheading: 22px;
  --leading-subheading: 1.2;
  --text-heading-sm: 34px;
  --leading-heading-sm: 1.18;
  --text-heading: 45px;
  --leading-heading: 1.02;
  --text-display: 55px;
  --leading-display: 1.02;

  /* Typography — Weights */
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-5: 5px;
  --spacing-6: 6px;
  --spacing-7: 7px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-11: 11px;
  --spacing-12: 12px;
  --spacing-14: 14px;
  --spacing-15: 15px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-21: 21px;
  --spacing-22: 22px;
  --spacing-38: 38px;
  --spacing-108: 108px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 64px;
  --card-padding: 24px;
  --element-gap: 12px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-3xl: 24px;
  --radius-3xl-2: 35px;
  --radius-full: 9999px;

  /* Named Radii */
  --radius-tags: 9999px;
  --radius-cards: 12px;
  --radius-inputs: 8px;
  --radius-modals: 20px;
  --radius-buttons: 9999px;

  /* Shadows */
  --shadow-sm: rgba(0, 0, 0, 0.25) 4px 6px 8px -2px, rgba(0, 0, 0, 0.2) -4px -1px 8px -2px;
  --shadow-sm-2: rgba(0, 0, 0, 0.1) 0px 4px 4px 0px;
  --shadow-sm-3: rgba(0, 0, 0, 0.25) 4px 6px 8px 0px, rgba(0, 0, 0, 0.25) -4px -6px 8px 0px;

  /* Surfaces */
  --surface-sky-canvas: #117bc8;
  --surface-cloud-white: #ffffff;
  --surface-mist-gray: #ebebeb;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-cerulean-sky: #117bc8;
  --color-deep-cerulean: #0d5c96;
  --color-atmosphere-blue: #60a8dd;
  --color-midnight-navy: #09426c;
  --color-berry-red: #cf372d;
  --color-cloud-white: #ffffff;
  --color-mist-gray: #ebebeb;
  --color-fog: #dadada;
  --color-stone: #a1a1a1;
  --color-graphite: #7d7d7d;
  --color-ink: #2b2b2b;
  --color-obsidian: #1d1b20;

  /* Typography */
  --font-switzer: 'switzer', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-signifier: 'signifier', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-times: 'Times', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.2;
  --text-body-sm: 14px;
  --leading-body-sm: 1.24;
  --text-body: 16px;
  --leading-body: 1.2;
  --text-subheading: 22px;
  --leading-subheading: 1.2;
  --text-heading-sm: 34px;
  --leading-heading-sm: 1.18;
  --text-heading: 45px;
  --leading-heading: 1.02;
  --text-display: 55px;
  --leading-display: 1.02;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-5: 5px;
  --spacing-6: 6px;
  --spacing-7: 7px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-11: 11px;
  --spacing-12: 12px;
  --spacing-14: 14px;
  --spacing-15: 15px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-21: 21px;
  --spacing-22: 22px;
  --spacing-38: 38px;
  --spacing-108: 108px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-3xl: 24px;
  --radius-3xl-2: 35px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-sm: rgba(0, 0, 0, 0.25) 4px 6px 8px -2px, rgba(0, 0, 0, 0.2) -4px -1px 8px -2px;
  --shadow-sm-2: rgba(0, 0, 0, 0.1) 0px 4px 4px 0px;
  --shadow-sm-3: rgba(0, 0, 0, 0.25) 4px 6px 8px 0px, rgba(0, 0, 0, 0.25) -4px -6px 8px 0px;
}
```
