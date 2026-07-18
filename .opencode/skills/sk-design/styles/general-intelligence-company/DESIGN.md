# General Intelligence Company — Style Reference
> Literary journal beside a bonfire

**Theme:** light

General Intelligence Company uses an editorial, almost literary visual language: a warm off-white canvas interrupted by hand-painted atmospheric illustrations (moonlit skylines, wildflower meadows) that do the emotional work, while the actual UI lives on clean white between these scenes. Typography carries the brand — a custom display serif (ppmondwest) speaks in a low, measured voice at 48–54px with tight -0.04em tracking, while a custom sans (af) handles everything utilitarian at 13–18px. Color is nearly absent: a warm parchment white, a soft green-gray border, and one vivid blue (#41a1cf) used only as an outlined action border. Components whisper — 4px and 8px radii, hairline 1px borders, subtle backdrop-blur on the navigation, no decorative shadows.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Parchment | `#fefffc` | `--color-parchment` | Page canvas — warm off-white slightly creamier than pure white, gives the whole site its book-page atmosphere |
| Paper | `#ffffff` | `--color-paper` | Card surfaces, section backgrounds, footer — the slightly cooler clean white used for elevated content areas |
| Linen | `#f9faf7` | `--color-linen` | Input fields, subtle surface wash, nav fill — barely-perceptible off-white that reads as neutral |
| Ink Black | `#171717` | `--color-ink-black` | Primary foreground token, strong body text where maximum contrast is needed |
| Graphite | `#2c2c2c` | `--color-graphite` | Headlines and key body text — softer than pure black, pairs with the warm canvas |
| Charcoal | `#444141` | `--color-charcoal` | Secondary text, button text — the workhorse text tone for body copy and UI labels |
| Ash | `#646464` | `--color-ash` | Muted helper text, descriptive copy, subdued UI |
| Fog | `#b4b8b4` | `--color-fog` | Tertiary borders, disabled states, lightest neutral in the scale |
| Mist | `#dee2de` | `--color-mist` | Hairline borders on cards, buttons, and section dividers — green-tinted to harmonize with illustrations |
| Twilight | `#282834` | `--color-twilight` | Near-black with a cool blue undertone — used for nav borders, icon strokes, and outlined actions; reads darker than its lightness suggests |
| Dusk | `#1f1f29` | `--color-dusk` | Filled button background — a near-black with cool violet undertone, the only non-white filled surface in the system |
| Signal Blue | `#41a1cf` | `--color-signal-blue` | Blue accent for outlined action borders, linked labels, and lightweight interactive emphasis. Do not promote it to the primary CTA color |
| Cerulean | `#0081c0` | `--color-cerulean` | Vivid blue used for a singular saturated card surface — the lone moment of pure color intensity, used sparingly as atmospheric punctuation |

## Tokens — Typography

### ppmondwest — Custom display serif for headlines and editorial copy — the voice of the brand. Tight -0.04em tracking at large sizes makes it feel set rather than typed; weight 400 even at 54px creates a confident, literary register rather than the 700-weight shouts common in tech. Liga features disabled. · `--font-ppmondwest`
- **Substitute:** Fraunces, Recoleta, GT Sectra
- **Weights:** 400, 500
- **Sizes:** 27px, 40px, 48px, 54px
- **Line height:** 1.1 (display), 1.5 (lead body)
- **Letter spacing:** -0.04em at 27px, -0.02em at 40-54px
- **OpenType features:** `"liga" 0`
- **Role:** Custom display serif for headlines and editorial copy — the voice of the brand. Tight -0.04em tracking at large sizes makes it feel set rather than typed; weight 400 even at 54px creates a confident, literary register rather than the 700-weight shouts common in tech. Liga features disabled.

### af — Custom sans for all UI, body copy, navigation, buttons, and small headings — a quiet, neutral workhorse. Weight 500 is the default for interactive and label text; weight 400 for body. Slight negative tracking (-0.01em) keeps dense UI from feeling airy. · `--font-af`
- **Substitute:** Inter, Geist, Söhne
- **Weights:** 400, 500, 600, 700
- **Sizes:** 13px, 15px, 16px, 18px
- **Line height:** 1.0 (nav/icons), 1.3 (body-sm/headings), 1.5 (body)
- **Letter spacing:** -0.01em to -0.012em
- **Role:** Custom sans for all UI, body copy, navigation, buttons, and small headings — a quiet, neutral workhorse. Weight 500 is the default for interactive and label text; weight 400 for body. Slight negative tracking (-0.01em) keeps dense UI from feeling airy.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 13px | 1.3 | -0.13px | `--text-caption` |
| body-sm | 15px | 1 | -0.15px | `--text-body-sm` |
| subheading | 18px | 1.3 | -0.18px | `--text-subheading` |
| heading-sm | 27px | 1.5 | -1.08px | `--text-heading-sm` |
| heading | 40px | 1.1 | -0.8px | `--text-heading` |
| heading-lg | 48px | 1.1 | -0.96px | `--text-heading-lg` |
| display | 54px | 1.1 | -1.08px | `--text-display` |

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
| 48 | 48px | `--spacing-48` |
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 50px (pill) |
| cards | 12px or 16px |
| buttons | 4px or 8px |
| large-surfaces | 24px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| sm | `rgba(0, 0, 0, 0.15) 0px 2px 6px 0px` | `--shadow-sm` |
| subtle | `rgba(0, 0, 0, 0.08) 0px 1px 1px 0px, rgba(0, 0, 0, 0.08) ...` | `--shadow-subtle` |
| subtle-2 | `rgb(222, 226, 222) 0px 0px 0px 1px` | `--shadow-subtle-2` |
| subtle-3 | `rgba(0, 0, 0, 0.06) 0px 2px 2px 0px, rgba(0, 0, 0, 0.04) ...` | `--shadow-subtle-3` |
| sm-2 | `rgba(0, 0, 0, 0.05) 0px 1px 8px 0px` | `--shadow-sm-2` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 32-64px
- **Card padding:** 16px
- **Element gap:** 8-12px

## Components

### Frosted Navigation Pill
**Role:** Primary site navigation

Floating pill at top center of the page, background rgba(255,255,255,0.06) with backdrop-blur(9-20px), 50px border-radius (fully rounded), 1px border in #282834 or white. Contains a small sun/landscape icon, three text links (About, Writing, Careers) in af 15px weight 500, and a bordered 'Get Cofounder' CTA button. The blur and transparency let the illustrated hero show through softly.

### Primary Outlined CTA Button
**Role:** Main call-to-action

8px border-radius, transparent background, 1px border in #41a1cf (Signal Blue), text in #41a1cf, af 15px weight 500, padding 5px 12px. The chromatic border is the entire visual identity of the button — no fill, no shadow. Arrow icon (→) inside a circle at the right edge.

### Secondary Outlined Button
**Role:** Secondary action

8px border-radius, transparent background, 1px border in #282834 (Twilight), text in #282834, af 15px weight 500, padding 5px 12px. The neutral cousin of the primary CTA — used when a second action appears alongside.

### Filled Dark Button
**Role:** Sole filled button variant

8px border-radius, background #1f1f29 (Dusk), text white, border 1px in #282834, af 15px weight 500, padding 8px 16px. Used very sparingly — the only filled button in the system, appears in footer or high-emphasis contexts.

### Ghost Text Link
**Role:** Inline links and tertiary navigation

No background, no border, text in #444141 or #282834, af 16px weight 400, often with an arrow icon. The default for 'Get to know us' style links. Underlined version used inline within headings for cross-references.

### Frosted Hero Overlay Card
**Role:** Hero information card

Overlays the illustrated hero. 24px border-radius, semi-transparent background, backdrop-blur, generous padding (80px on the vivid blue variant), white or dark text depending on background. The frosted glass treatment ties the UI to the painted illustration.

### White Content Card
**Role:** Standard content container

12px border-radius, background #ffffff (Paper), 1px border in #dee2de (Mist), shadow rgba(0,0,0,0.08) 0px 1px 1px / 0px 4px 5px. Padding varies — 0px for media cards, 16px for text cards. The soft green-tinted border is the signature edge treatment.

### Atmospheric Illustration Card
**Role:** Full-bleed illustrated section

Large format (often 1100000+ px area), 24px border-radius, vivid background color (#0081c0 Cerulean or painted landscape), generous internal padding 80-128px. These are the moments where color is allowed to exist — illustration-as-component.

### Diagram Card
**Role:** Visual explanation container

16px border-radius, semi-transparent white background, subtle shadow rgba(0,0,0,0.05) 0px 1px 8px, padding 12px. Houses line-art diagrams (isolated agent squares, coordinator nodes) — the visual explanations are always inside this soft frame.

### Input Field
**Role:** Form text input

0px border-radius (flat edges), background #f9faf7 (Linen), text #444141 (Charcoal), border-bottom-only in #444141. No visible top/side borders — the input is defined by its fill color and a single bottom line, giving a paper-form feel.

### Cookie Consent Banner
**Role:** Bottom-right notification

White background, rounded corners, small font af 13px, inline text + Decline/Accept text buttons separated by a vertical divider. The minimal, text-first treatment is characteristic — no icons, no color, no urgency.

### Footer
**Role:** Site footer

White background, large editorial statement in ppmondwest serif, small navigation links in af, generous vertical padding. The footer extends the literary feel — reading like the colophon of a book.

## Do's and Don'ts

### Do
- Use ppmondwest for any heading 27px and above; never use the sans for display text
- Set all ppmondwest headings to weight 400, never 600 or 700 — the serif does the work
- Use 1px solid #dee2de for all card and section borders; this green-tinted hairline is the visual signature
- Apply 8px border-radius to buttons and 12-16px to cards — avoid mixing 4px and 24px in the same surface
- Use #41a1cf as a border-only accent on CTAs; the system has no filled chromatic buttons
- Let the canvas be #fefffc (warm off-white), not pure #ffffff, to maintain the book-page atmosphere
- Pair display headings with line-height 1.1; pair body text with line-height 1.5 — the contrast is intentional

### Don't
- Do not use #000000 for text — use #171717 (Ink Black) or #2c2c2c (Graphite) for softer warmth
- Do not apply box-shadow to buttons; the system uses borders and backdrop-blur instead of elevation
- Do not introduce new accent colors — the palette is deliberately 95% neutral with one blue
- Do not use weight 600+ on ppmondwest; the serif's personality is in its thin strokes
- Do not use rgba or transparency on body text — all text colors should be solid hex values
- Do not use radius values above 24px except for the navigation pill; this is not a soft-rounded design
- Do not fill buttons with #41a1cf or #0081c0; Signal Blue and Cerulean are border/surface colors only

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Parchment Canvas | `#fefffc` | Base page background — warm off-white that gives the whole site its editorial register |
| 1 | Paper Card | `#ffffff` | Elevated content surfaces, footer, white content sections between illustrations |
| 2 | Linen Wash | `#f9faf7` | Input fields, subtle surface differentiation, nav pill fill at low opacity |
| 3 | Vivid Blue | `#0081c0` | Rare atmospheric accent surface — the only saturated color in the system, used as a punctuation moment |

## Elevation

- **Navigation Pill:** `rgba(0, 0, 0, 0.15) 0px 2px 6px 0px`
- **Content Card:** `rgba(0, 0, 0, 0.08) 0px 1px 1px 0px, rgba(0, 0, 0, 0.08) 0px 4px 5px 0px`
- **Diagram Card:** `rgba(0, 0, 0, 0.05) 0px 1px 8px 0px`
- **Atmospheric Card:** `rgba(0, 0, 0, 0.06) 0px 2px 2px 0px, rgba(0, 0, 0, 0.04) 0px 0px 0px 5px`

## Imagery

Hand-painted digital illustrations carry the emotional narrative: a moonlit New York skyline with cherry blossom branches framing the composition, a dark wildflower meadow with golden poppies and purple flowers, a pixelated yellow-and-pink flower rendered in a low-resolution game-art style. The illustrations are painterly, not flat-vector — they have visible brush texture, atmospheric depth, and cinematic color grading (cool blues for night, warm greens for fields). All illustrations sit full-bleed or at 24px radius against the white canvas. No photography, no product screenshots, no abstract 3D. The pixelated flower is the one element that breaks the painted language — a deliberate contrast. Icons are minimal: a small sun-over-landscape glyph in the nav, simple line arrows in buttons.

## Layout

Full-bleed illustrated hero sections alternate with clean white content sections in a vertical rhythm. The hero is a 100vh painted illustration with a floating frosted-glass navigation pill at top-center and a glassmorphic overlay card at bottom-left containing the headline and CTA. Content sections are max-width 1200px centered, with generous vertical breathing room (64-96px). Headlines are left-aligned and large, often spanning 6-8 columns. Two-column layouts pair text with diagrams or illustrations. The diagram sections use a 6+6 split: explanatory text and figure caption on the left, line-art diagram in a soft-bordered card on the right. Navigation is a single floating pill — no sidebar, no mega-menu. Footer is a white band with a large editorial statement. The overall density is spacious: one idea per screen, never crowded.

## Agent Prompt Guide

## Quick Color Reference
- text: #2c2c2c (headlines), #444141 (body), #646464 (muted)
- background: #fefffc (canvas), #ffffff (cards), #f9faf7 (inputs)
- border: #dee2de (cards), #282834 (nav/actions), #41a1cf (primary CTA)
- accent: #0081c0 (vivid blue — atmospheric surface only)
- foreground: #171717
- primary action: #41a1cf (outlined action border)

## 3-5 Example Component Prompts

1. **Outlined primary CTA button**: 8px border-radius, transparent background, 1px solid border in #41a1cf (Signal Blue), text #41a1cf, af family weight 500 at 15px, padding 5px 12px, with a small arrow icon in a circle on the right.

2. **Editorial headline section**: White (#ffffff) background, 64px vertical padding. Headline in ppmondwest weight 400 at 48px, line-height 1.1, letter-spacing -0.02em, color #2c2c2c. Subtext below in af weight 400 at 16px, line-height 1.5, color #646464.

3. Create an Outlined Primary Action: Transparent background, #41a1cf border and text, 9999px radius, compact pill padding. Use it for the main CTA instead of a filled button.

4. **Content card with hairline border**: 12px border-radius, background #ffffff, 1px solid border in #dee2de (Mist), shadow rgba(0,0,0,0.08) 0px 1px 1px / 0px 4px 5px. Padding 16px. Body text in af 16px weight 400, #444141.

5. **Full-bleed illustrated hero section**: 100vh height, illustration fills entire section (no border-radius or 24px). Floating glassmorphic overlay card at bottom-left: 24px border-radius, semi-transparent white background, backdrop-blur, 32px padding, serif headline in ppmondwest 48px weight 400, white text.

## Similar Brands

- **Stripe** — Same editorial use of large custom serif headings on a warm off-white canvas, with illustrations doing narrative work between clean white content sections
- **Linear** — Similar restraint in color usage — near-monochrome palette with a single chromatic accent, hairline borders, 8px button radius, and generous spacing
- **Anthropic** — Shared literary, almost book-like visual register: warm canvas, serif display type, and painted or hand-crafted imagery replacing stock photography
- **Notion** — Comparable soft-green border tones (#dee2de family) and the same approach of using atmospheric illustrations as structural section dividers
- **Pitch** — Similar product-as-editorial-object sensibility with custom serif display type, off-white canvas, and full-bleed illustrated sections punctuating clean white content blocks

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-parchment: #fefffc;
  --color-paper: #ffffff;
  --color-linen: #f9faf7;
  --color-ink-black: #171717;
  --color-graphite: #2c2c2c;
  --color-charcoal: #444141;
  --color-ash: #646464;
  --color-fog: #b4b8b4;
  --color-mist: #dee2de;
  --color-twilight: #282834;
  --color-dusk: #1f1f29;
  --color-signal-blue: #41a1cf;
  --color-cerulean: #0081c0;

  /* Typography — Font Families */
  --font-ppmondwest: 'ppmondwest', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-af: 'af', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 13px;
  --leading-caption: 1.3;
  --tracking-caption: -0.13px;
  --text-body-sm: 15px;
  --leading-body-sm: 1;
  --tracking-body-sm: -0.15px;
  --text-subheading: 18px;
  --leading-subheading: 1.3;
  --tracking-subheading: -0.18px;
  --text-heading-sm: 27px;
  --leading-heading-sm: 1.5;
  --tracking-heading-sm: -1.08px;
  --text-heading: 40px;
  --leading-heading: 1.1;
  --tracking-heading: -0.8px;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.1;
  --tracking-heading-lg: -0.96px;
  --text-display: 54px;
  --leading-display: 1.1;
  --tracking-display: -1.08px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

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
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-80: 80px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 32-64px;
  --card-padding: 16px;
  --element-gap: 8-12px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-3xl: 24px;
  --radius-full: 50.496px;

  /* Named Radii */
  --radius-nav: 50px (pill);
  --radius-cards: 12px or 16px;
  --radius-buttons: 4px or 8px;
  --radius-large-surfaces: 24px;

  /* Shadows */
  --shadow-sm: rgba(0, 0, 0, 0.15) 0px 2px 6px 0px;
  --shadow-subtle: rgba(0, 0, 0, 0.08) 0px 1px 1px 0px, rgba(0, 0, 0, 0.08) 0px 4px 5px 0px;
  --shadow-subtle-2: rgb(222, 226, 222) 0px 0px 0px 1px;
  --shadow-subtle-3: rgba(0, 0, 0, 0.06) 0px 2px 2px 0px, rgba(0, 0, 0, 0.04) 0px 0px 0px 5px;
  --shadow-sm-2: rgba(0, 0, 0, 0.05) 0px 1px 8px 0px;

  /* Surfaces */
  --surface-parchment-canvas: #fefffc;
  --surface-paper-card: #ffffff;
  --surface-linen-wash: #f9faf7;
  --surface-vivid-blue: #0081c0;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-parchment: #fefffc;
  --color-paper: #ffffff;
  --color-linen: #f9faf7;
  --color-ink-black: #171717;
  --color-graphite: #2c2c2c;
  --color-charcoal: #444141;
  --color-ash: #646464;
  --color-fog: #b4b8b4;
  --color-mist: #dee2de;
  --color-twilight: #282834;
  --color-dusk: #1f1f29;
  --color-signal-blue: #41a1cf;
  --color-cerulean: #0081c0;

  /* Typography */
  --font-ppmondwest: 'ppmondwest', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-af: 'af', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 13px;
  --leading-caption: 1.3;
  --tracking-caption: -0.13px;
  --text-body-sm: 15px;
  --leading-body-sm: 1;
  --tracking-body-sm: -0.15px;
  --text-subheading: 18px;
  --leading-subheading: 1.3;
  --tracking-subheading: -0.18px;
  --text-heading-sm: 27px;
  --leading-heading-sm: 1.5;
  --tracking-heading-sm: -1.08px;
  --text-heading: 40px;
  --leading-heading: 1.1;
  --tracking-heading: -0.8px;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.1;
  --tracking-heading-lg: -0.96px;
  --text-display: 54px;
  --leading-display: 1.1;
  --tracking-display: -1.08px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-80: 80px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-3xl: 24px;
  --radius-full: 50.496px;

  /* Shadows */
  --shadow-sm: rgba(0, 0, 0, 0.15) 0px 2px 6px 0px;
  --shadow-subtle: rgba(0, 0, 0, 0.08) 0px 1px 1px 0px, rgba(0, 0, 0, 0.08) 0px 4px 5px 0px;
  --shadow-subtle-2: rgb(222, 226, 222) 0px 0px 0px 1px;
  --shadow-subtle-3: rgba(0, 0, 0, 0.06) 0px 2px 2px 0px, rgba(0, 0, 0, 0.04) 0px 0px 0px 5px;
  --shadow-sm-2: rgba(0, 0, 0, 0.05) 0px 1px 8px 0px;
}
```
