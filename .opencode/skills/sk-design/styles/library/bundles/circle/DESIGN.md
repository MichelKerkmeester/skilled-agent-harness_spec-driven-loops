# Circle — Style Reference
> Aurora-lit mission control in deep midnight. A near-black indigo page glows from the center outward, cradling a single white product panel like a lit window in a planetarium.

**Theme:** dark

Circle's design system is a deep-space stage: a near-black indigo canvas radiates soft aurora gradients toward the center, and a single bright product screenshot floats on that darkness like a window into daylight. The product surface inside is crisp white and information-dense, while the marketing surface around it is theatrical — gradient CTAs, pill-shaped everything, and pastel-tinted accent cards that feel like constellation markers. Typography is a single family (Inter) pushed from whisper-tight tracking at 64px down to relaxed spacing at 10px, giving headlines a dense, confident weight that fills the dark space. The visual rhythm alternates between the cosmic dark page and floating white product panels; this contrast — not color variety — is the signature.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Void Indigo | `#0f0f35` | `--color-void-indigo` | Page canvas — the cosmic-dark background that radiates the aurora gradient. All marketing copy and product panels float on this surface |
| Deep Space | `#15163d` | `--color-deep-space` | Outer page background where the aurora gradient fades to black, framing the central glow |
| Product White | `#ffffff` | `--color-product-white` | Product panel surfaces, input fields, card fills inside the embedded product screenshots, and the top navigation bar |
| Pure Ink | `#0a0a0a` | `--color-pure-ink` | Primary text color inside product panels and on white surfaces — near-black, slightly softer than #000 |
| Graphite | `#191b1f` | `--color-graphite` | Secondary text, icon strokes on dark canvas, and dark-mode body copy |
| Steel | `#737373` | `--color-steel` | Muted helper text, secondary nav labels, and inactive tab text |
| Charcoal | `#262626` | `--color-charcoal` | Tertiary text and body copy on white surfaces |
| Hairline | `#e4e7eb` | `--color-hairline` | Borders, dividers, table separators, and subtle structural lines — the dominant border color across all components |
| Signal Blue | `linear-gradient(142deg, rgb(64, 143, 237) 18.68%, rgb(62, 27, 201) 78.25%)` | `--color-signal-blue` | Supporting palette color for small decorative accents when the core palette needs contrast. Do not promote it to the primary CTA color |
| Plasma Violet | `#3e1bc9` | `--color-plasma-violet` | Supporting palette color for small decorative accents when the core palette needs contrast. Do not promote it to the primary CTA color |
| Nebula Blue | `#3655e5` | `--color-nebula-blue` | Secondary brand fill — vivid blue-violet used for solid accent surfaces and card backgrounds in feature blocks |
| Cosmic Purple | `#5a3f99` | `--color-cosmic-purple` | Deep purple background fill for video thumbnail cards and feature panels, anchoring darker sections of the page |
| Twilight Iris | `#484b73` | `--color-twilight-iris` | Muted violet used for subtle borders and outlines on the dark canvas — a low-contrast structural line |
| Blush Mist | `#ffe0e2` | `--color-blush-mist` | Pastel rose-tinted surface for soft accent cards and pill buttons — the warmest of the pastel constellation |
| Lavender Whisper | `#f2dbf5` | `--color-lavender-whisper` | Pastel lavender surface for accent cards and ghost buttons — the signature pastel that bridges the aurora's pink and purple ends |
| Sunbeam | `#fff0d8` | `--color-sunbeam` | Pastel cream-yellow surface for warm accent cards and highlight buttons |
| Polar Sky | `#e0eafc` | `--color-polar-sky` | Pastel blue-white surface for cool accent cards and secondary CTA buttons |
| Mint Glow | `#e4f6f4` | `--color-mint-glow` | Pastel mint surface for accent cards and quiet informational buttons |
| Focus Beam | `#539cf2` | `--color-focus-beam` | Blue supporting accent for decorative details and low-frequency emphasis. Use as a supporting accent, not as a status color |

## Tokens — Typography

### Inter — Single-family system: Inter carries everything from 10px eyebrow labels to 64px display headlines. The aggressive negative tracking at display sizes (-3.2px at 64px) makes headlines feel dense and architectural rather than airy, which suits the cosmic-dark page. Positive 0.5px tracking only appears on 10px uppercase eyebrows, creating a tight micro-label style. Weight 500 is the default for UI; 600 for button labels; 700 sparingly for hero emphasis. · `--font-inter`
- **Substitute:** DM Sans, Plus Jakarta Sans
- **Weights:** 400, 500, 600, 700
- **Sizes:** 10, 11, 14, 16, 18, 20, 24, 32, 40, 48, 56, 64
- **Line height:** 1.10, 1.20, 1.21, 1.25, 1.28, 1.29, 1.30, 1.33, 1.40, 1.43, 1.45, 1.50, 1.56
- **Letter spacing:** -3.2px at 64px, -2.63px at 56px, -1.78px at 48px, -1.24px at 40px, -0.9px at 32px, -0.6px at 24px, -0.46px at 20px, -0.38px at 18px, -0.29px at 16px, -0.22px at 14px, -0.08px at 11px, 0.5px at 10px (uppercase eyebrows)
- **Role:** Single-family system: Inter carries everything from 10px eyebrow labels to 64px display headlines. The aggressive negative tracking at display sizes (-3.2px at 64px) makes headlines feel dense and architectural rather than airy, which suits the cosmic-dark page. Positive 0.5px tracking only appears on 10px uppercase eyebrows, creating a tight micro-label style. Weight 500 is the default for UI; 600 for button labels; 700 sparingly for hero emphasis.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 10px | 1.5 | 0.5px | `--text-caption` |
| body-sm | 14px | 1.5 | -0.22px | `--text-body-sm` |
| body | 16px | 1.5 | -0.29px | `--text-body` |
| subheading | 18px | 1.45 | -0.38px | `--text-subheading` |
| heading-sm | 20px | 1.4 | -0.46px | `--text-heading-sm` |
| heading | 24px | 1.33 | -0.6px | `--text-heading` |
| heading-lg | 32px | 1.3 | -0.9px | `--text-heading-lg` |
| heading-xl | 40px | 1.25 | -1.24px | `--text-heading-xl` |
| display | 56px | 1.1 | -2.63px | `--text-display` |

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
| 36 | 36px | `--spacing-36` |
| 40 | 40px | `--spacing-40` |
| 44 | 44px | `--spacing-44` |
| 48 | 48px | `--spacing-48` |
| 52 | 52px | `--spacing-52` |
| 56 | 56px | `--spacing-56` |
| 80 | 80px | `--spacing-80` |
| 120 | 120px | `--spacing-120` |

### Border Radius

| Element | Value |
|---------|-------|
| tabs | 9999px |
| cards | 24px |
| inputs | 9999px |
| buttons | 9999px |
| smallCards | 20px |
| largePanels | 32px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| sm | `rgba(169, 169, 169, 0.08) 0px 4px 8px 0px` | `--shadow-sm` |
| subtle | `rgb(83, 156, 242) 0px 0px 0px 2px` | `--shadow-subtle` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80-120px
- **Card padding:** 24px
- **Element gap:** 8-16px

## Components

### Gradient CTA Button
**Role:** Primary action trigger — the moment a visitor becomes a user.

Filled with the Signal Blue → Plasma Violet gradient at 142deg. Pill shape (9999px radius). Padding 14px top/bottom × 24px left/right. Inter weight 500-600, 16px, white text, no letter-spacing override. No border. No shadow — the gradient IS the elevation.

### Ghost Navigation Button
**Role:** Secondary navigation action (e.g. 'Start free trial' in the top bar).

Transparent fill, 1px solid #e4e7eb border, pill shape (9999px radius). Padding 8px 18px. Inter weight 500, 14-16px, #0a0a0a text on the white nav bar.

### Email Capture Input with Inline Button
**Role:** Hero-level lead capture — the most prominent interactive element on the page.

A single pill-shaped container (9999px radius) combining a white input field and the gradient CTA button side by side. Input: white background, no visible border, 16px Inter, #737373 placeholder. Button: gradient fill, white text, shares the pill's radius curve on the right side only. Total height ~48px.

### Pastel Accent Card
**Role:** Decorative feature card and soft-action container — a marker in the pastel constellation.

One of five pastel surface colors (Blush Mist, Lavender Whisper, Sunbeam, Polar Sky, Mint Glow). 24px radius. 24px padding. No border, no shadow. Used to visually group related content blocks without using borders or lines.

### Pastel Ghost Button
**Role:** Soft secondary action — a gentler alternative to the gradient CTA.

Pastel surface fill (Blush Mist, Lavender Whisper, Sunbeam, Polar Sky, or Mint Glow), pill shape (9999px radius). Padding 10-14px top/bottom × 18-24px left/right. Inter weight 500, 14-16px, #0a0a0a text. No border, no shadow.

### Product Tab Navigation
**Role:** Product feature switcher — lets visitors explore different modules without scrolling.

Horizontal row of text tabs on the dark canvas. Active tab: pill shape (9999px radius), dark fill slightly lighter than canvas (#1a1a4a or similar), white text, subtle inset appearance. Inactive tabs: transparent fill, #737373 text, no border. Inter weight 500, 14-16px. Tabs are separated by 24-32px gaps.

### Product Panel (Embedded Screenshot)
**Role:** The product UI shown floating on the dark page — a lit window into the real product.

White card containing the actual product interface. 16-24px radius, very subtle shadow (rgba(169,169,169,0.08) at 4px/8px), 1px solid #e4e7eb border for extra definition. Internal padding follows the product's own design (typically 0 — the product fills the panel edge-to-edge).

### Video Thumbnail Card
**Role:** Embedded video player for product walkthroughs and testimonials.

Deep purple gradient or solid #5a3f99 background. 24px radius. 24px padding. Contains a circular play button (48px, white fill, #0a0a0a triangle icon). Heading and subtext overlay at top-left in white Inter.

### Trust Logo Strip
**Role:** Social proof band — 'Trusted by the world's top communities'.

A row of white logo marks on the dark canvas, horizontally distributed. No card, no border — logos float directly on the void. Small caption text above in #737373, Inter weight 400, 14px.

### Top Navigation Bar
**Role:** Primary site navigation — the only bright horizontal band cutting across the dark page.

White background (#ffffff), full-width, sits above the dark hero. Contains: brand wordmark left, nav links center (Inter weight 500, 14-16px, #0a0a0a), ghost 'Start free trial' button and 'Log in' text link right. No shadow, no border-bottom — the white-to-dark transition IS the divider.

### Star Rating Badge
**Role:** Review platform trust signal — G2/Capterra/GetApp/Trustpilot stars.

Small inline cluster: platform logos (small, ~20px) + 5 gold stars (Unicode ★ or SVG) + '70k+ reviews' text. Inter weight 500, 14px, #ffffff on dark canvas. Centered, sits above the hero headline.

### Two-Column Feature Section
**Role:** Content blocks that combine a media element with explanatory text.

Two-column layout: left column holds a video thumbnail card or product panel, right column holds a heading (32-40px, white) + body paragraph (16-18px, #c4c4d4 or similar muted) + gradient CTA button. 80-120px vertical gap between sections. Max-width ~1200px centered.

## Do's and Don'ts

### Do
- Use the blue→purple gradient (Signal Blue #408fed to Plasma Violet #3e1bc9) exclusively for the primary CTA — it is the only action button that should compete with the aurora page.
- Set border-radius to 9999px for all buttons, inputs, tabs, and tags — pill shape is the geometry of this system.
- Keep the page background at #0f0f35 and let the aurora gradient radiate from the center; never replace it with a flat dark or light color.
- Use Inter at display sizes (40-64px) with aggressive negative tracking (-1.24px to -3.2px) so headlines feel dense and architectural rather than airy.
- Separate the marketing page from the product using color contrast alone — white panels on dark canvas, not shadows or borders.
- Use pastel accent surfaces (Blush Mist, Lavender Whisper, Sunbeam, Polar Sky, Mint Glow) for soft cards and ghost buttons to add variety without breaking the dark/light binary.
- Limit shadow usage to rgba(169,169,169,0.08) at 4px/8px — a single whisper-soft elevation for product panels only.

### Don't
- Don't use a flat solid color for the page background — the aurora gradient radiating from center is the signature.
- Don't use square or rounded-rectangle buttons — pill (9999px) is the only button shape in this system.
- Don't add borders, strokes, or extra shadows to CTA buttons — the gradient fill carries all the visual weight.
- Don't use a separate font family for headings — Inter at all sizes, differentiated only by weight and tracking.
- Don't use light text on white surfaces or dark text on the dark canvas — maintain the binary contrast: white text on #0f0f35, #0a0a0a text on white.
- Don't stack multiple gradients or use the brand gradient as a background fill for large areas — reserve it for buttons and small accent shapes.
- Don't introduce a second CTA style that competes with the gradient — pastel ghost buttons are the only alternative, and they should never carry the same visual weight.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Void Canvas | `#0f0f35` | The cosmic page background where the aurora gradient lives — every marketing section floats on this. |
| 1 | Aurora Glow | `#15163d` | The outer radius of the hero gradient where the central glow fades into the void. |
| 2 | Product Panel | `#ffffff` | White product screenshots, embedded UI panels, and the top navigation bar — bright islands on the dark page. |
| 3 | Accent Card | `#ffe0e2` | Pastel-tinted surface for feature cards, soft buttons, and decorative markers — the pastel constellation. |

## Elevation

- **Product Panel / Card:** `0px 4px 8px 0px rgba(169, 169, 169, 0.08)`
- **Input Focus Ring:** `0px 0px 0px 2px #539cf2`

## Imagery

Imagery is minimal and product-focused. The dominant visual is the embedded product screenshot — a white panel showing the actual Circle dashboard (audience management, member lists, score badges) floating on the dark canvas. The second visual element is a video thumbnail card with a real photograph of two people (founders or community members) tinted with a deep purple overlay (#5a3f99). No illustrations, no abstract graphics, no 3D renders. Trust logos are monochrome white marks. The aurora gradient on the hero IS the primary visual atmosphere — it replaces what would normally be a hero photograph or illustration. Photography style (when present) is warm, candid, and slightly desaturated, with people in natural light.

## Layout

Max-width 1200px centered content on a full-bleed dark canvas. The page alternates between two surface modes: the cosmic dark marketing surface (sections separated by 80-120px vertical gaps, centered or two-column layouts) and the bright product surface (the embedded white product screenshot panel). The hero is centered with the aurora gradient radiating behind a single-column headline + email capture + trust logos below. Below the hero, sections use a two-column pattern: media on the left, text + CTA on the right. Product tab navigation sits as a horizontal band between the hero and the first product panel. The top navigation bar is the only light element above the fold, creating a stark white-to-dark transition. Content density is comfortable — generous breathing room, no multi-column card grids, no masonry. The layout reads as a series of 'windows' opening onto the product from a dark stage.

## Agent Prompt Guide

**Quick Color Reference**
- text (on dark): #ffffff
- text (on white): #0a0a0a
- background (page): #0f0f35
- background (product panel): #ffffff
- border: #e4e7eb
- accent surface: #ffe0e2 (or rotate through #f2dbf5, #fff0d8, #e0eafc, #e4f6f4)
- primary action: #f2dbf5 (filled action)

**Example Component Prompts**

1. Create a Primary Action Button: #f2dbf5 background, #000000 text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.

2. **Product panel with tab navigation**: Dark canvas (#0f0f35). A horizontal tab row centered above: 8-9 text tabs in 16px Inter weight 500, #737373 inactive, active tab in a pill shape (9999px radius) with a slightly lighter dark fill (#1a1a4a) and #ffffff text. Below: a white product panel (24px radius, 1px solid #e4e7eb border, subtle rgba(169,169,169,0.08) shadow at 4px/8px) showing a dashboard mockup with a member list table.


4. **Pastel accent card grid**: A row of 4-5 cards, each with a different pastel surface (Blush Mist #ffe0e2, Lavender Whisper #f2dbf5, Sunbeam #fff0d8, Polar Sky #e0eafc, Mint Glow #e4f6f4). 24px radius, 24px padding, no border, no shadow. Each card contains a heading at 20px Inter weight 600, #0a0a0a, and body text at 14px Inter weight 400, #262626.

5. **Trust logo strip**: On the #0f0f35 canvas, a centered 14px Inter weight 400 caption in #737373 ('Trusted by the world's top communities'). Below: a horizontal row of 6-7 monochrome white logo marks, evenly distributed, each ~100px wide, no card or border.

## Similar Brands

- **Linear** — Same dark cosmic canvas with a single bright product panel floating on it, same pill-shaped CTAs, same gradient accents, same single-family Inter typography with aggressive negative tracking at display sizes.
- **Vercel** — Same near-black background with a centered aurora-like gradient glow, same monochromatic page with a single vivid gradient CTA, same whisper-tight headline tracking.
- **Framer** — Same dark page with floating white product surfaces, same pill geometry for all interactive elements, same restrained shadow approach relying on surface contrast for separation.
- **Raycast** — Same dark immersive page with a product screenshot as the hero visual, same Inter-only typography stack, same gradient CTAs with no borders or shadows.

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-void-indigo: #0f0f35;
  --color-deep-space: #15163d;
  --color-product-white: #ffffff;
  --color-pure-ink: #0a0a0a;
  --color-graphite: #191b1f;
  --color-steel: #737373;
  --color-charcoal: #262626;
  --color-hairline: #e4e7eb;
  --color-signal-blue: #408fed;
  --gradient-signal-blue: linear-gradient(142deg, rgb(64, 143, 237) 18.68%, rgb(62, 27, 201) 78.25%);
  --color-plasma-violet: #3e1bc9;
  --color-nebula-blue: #3655e5;
  --color-cosmic-purple: #5a3f99;
  --color-twilight-iris: #484b73;
  --color-blush-mist: #ffe0e2;
  --color-lavender-whisper: #f2dbf5;
  --color-sunbeam: #fff0d8;
  --color-polar-sky: #e0eafc;
  --color-mint-glow: #e4f6f4;
  --color-focus-beam: #539cf2;

  /* Typography — Font Families */
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.5;
  --tracking-caption: 0.5px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --tracking-body-sm: -0.22px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.29px;
  --text-subheading: 18px;
  --leading-subheading: 1.45;
  --tracking-subheading: -0.38px;
  --text-heading-sm: 20px;
  --leading-heading-sm: 1.4;
  --tracking-heading-sm: -0.46px;
  --text-heading: 24px;
  --leading-heading: 1.33;
  --tracking-heading: -0.6px;
  --text-heading-lg: 32px;
  --leading-heading-lg: 1.3;
  --tracking-heading-lg: -0.9px;
  --text-heading-xl: 40px;
  --leading-heading-xl: 1.25;
  --tracking-heading-xl: -1.24px;
  --text-display: 56px;
  --leading-display: 1.1;
  --tracking-display: -2.63px;

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
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-44: 44px;
  --spacing-48: 48px;
  --spacing-52: 52px;
  --spacing-56: 56px;
  --spacing-80: 80px;
  --spacing-120: 120px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80-120px;
  --card-padding: 24px;
  --element-gap: 8-16px;

  /* Border Radius */
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-3xl: 24px;
  --radius-3xl-2: 32px;
  --radius-full: 1000px;
  --radius-full-2: 9999px;

  /* Named Radii */
  --radius-tabs: 9999px;
  --radius-cards: 24px;
  --radius-inputs: 9999px;
  --radius-buttons: 9999px;
  --radius-smallcards: 20px;
  --radius-largepanels: 32px;

  /* Shadows */
  --shadow-sm: rgba(169, 169, 169, 0.08) 0px 4px 8px 0px;
  --shadow-subtle: rgb(83, 156, 242) 0px 0px 0px 2px;

  /* Surfaces */
  --surface-void-canvas: #0f0f35;
  --surface-aurora-glow: #15163d;
  --surface-product-panel: #ffffff;
  --surface-accent-card: #ffe0e2;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-void-indigo: #0f0f35;
  --color-deep-space: #15163d;
  --color-product-white: #ffffff;
  --color-pure-ink: #0a0a0a;
  --color-graphite: #191b1f;
  --color-steel: #737373;
  --color-charcoal: #262626;
  --color-hairline: #e4e7eb;
  --color-signal-blue: #408fed;
  --color-plasma-violet: #3e1bc9;
  --color-nebula-blue: #3655e5;
  --color-cosmic-purple: #5a3f99;
  --color-twilight-iris: #484b73;
  --color-blush-mist: #ffe0e2;
  --color-lavender-whisper: #f2dbf5;
  --color-sunbeam: #fff0d8;
  --color-polar-sky: #e0eafc;
  --color-mint-glow: #e4f6f4;
  --color-focus-beam: #539cf2;

  /* Typography */
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.5;
  --tracking-caption: 0.5px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --tracking-body-sm: -0.22px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.29px;
  --text-subheading: 18px;
  --leading-subheading: 1.45;
  --tracking-subheading: -0.38px;
  --text-heading-sm: 20px;
  --leading-heading-sm: 1.4;
  --tracking-heading-sm: -0.46px;
  --text-heading: 24px;
  --leading-heading: 1.33;
  --tracking-heading: -0.6px;
  --text-heading-lg: 32px;
  --leading-heading-lg: 1.3;
  --tracking-heading-lg: -0.9px;
  --text-heading-xl: 40px;
  --leading-heading-xl: 1.25;
  --tracking-heading-xl: -1.24px;
  --text-display: 56px;
  --leading-display: 1.1;
  --tracking-display: -2.63px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-44: 44px;
  --spacing-48: 48px;
  --spacing-52: 52px;
  --spacing-56: 56px;
  --spacing-80: 80px;
  --spacing-120: 120px;

  /* Border Radius */
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-3xl: 24px;
  --radius-3xl-2: 32px;
  --radius-full: 1000px;
  --radius-full-2: 9999px;

  /* Shadows */
  --shadow-sm: rgba(169, 169, 169, 0.08) 0px 4px 8px 0px;
  --shadow-subtle: rgb(83, 156, 242) 0px 0px 0px 2px;
}
```
