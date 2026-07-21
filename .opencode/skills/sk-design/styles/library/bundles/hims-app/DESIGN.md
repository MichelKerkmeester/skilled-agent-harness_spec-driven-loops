# Hims App — Style Reference
> spa brochure on vellum paper

**Theme:** light

Hims App operates as a calm, monochrome wellness interface where one violet accent does all the emotional work against an otherwise achromatic canvas. The system is built for breath: oversized type in a custom geometric sans (sofia), generously rounded surfaces (30–52px radii), and long-spread soft shadows that make cards appear to float rather than sit. The hero is photographic and intimate — a hand holding a phone, product color bleeding into real skin — but the surrounding UI stays austere: white canvas, black type, hairline borders. Violet #5d48db is reserved almost exclusively for headlines and occasional borders, never for filled buttons. Components feel like printed editorial spreads: large negative space, no decorative gradients in chrome, and a single type family carrying every weight of meaning.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Hims Violet | `#5d48db` | `--color-hims-violet` | Headline text, display borders, brand accent — the single chromatic voice in an otherwise monochrome system |
| Carbon Black | `#000000` | `--color-carbon-black` | Primary text, hairline borders, icon fills, nav dividers — the structural ink of the interface |
| Paper White | `#ffffff` | `--color-paper-white` | Page canvas, card surfaces, nav background, image backgrounds — the base surface at every elevation level |
| Vellum Gray | `#f0f0f0` | `--color-vellum-gray` | List dividers, subtle row separators, muted list text — the quietest structural neutral |
| Graphite | `#2e2e2e` | `--color-graphite` | Secondary heading text, heading borders — slightly softer than pure black for non-display headings |
| Linen | `#e0e0e0` | `--color-linen` | Hairline borders, list separators, thin structural strokes |
| Stone | `#8f8f8f` | `--color-stone` | Muted body copy, subdued links, secondary metadata text |
| Soft Mint | `#3fd194` | `--color-soft-mint` | Decorative product accent — appears inside app screenshot tiles (e.g. Acne Program card), not a UI token |
| Iris | `#9685ff` | `--color-iris` | Decorative product accent — appears in product gradient washes inside phone mockup content |

## Tokens — Typography

### sofia — Sofia is the sole typeface. Its geometric, low-contrast letterforms carry everything from 14px nav labels to 280px display heroes. Weight 400 is the default at all sizes; weight 500 is reserved for emphasis. The extreme size range (14→280px) with consistent tight tracking (-0.012em to -0.057em) creates a system that scales smoothly from caption to billboard. Signature choice: the ultra-tight tracking even at body sizes (-0.012em at 14px) gives body text a compressed, editorial density unusual for a consumer health app. · `--font-sofia`
- **Substitute:** Inter, Manrope, or DM Sans
- **Weights:** 400, 500
- **Sizes:** 14, 16, 18, 20, 24, 32, 35, 37, 39, 44, 81, 84, 85, 141, 220, 280
- **Line height:** 1.00, 1.04, 1.10, 1.15, 1.18, 1.20, 1.25, 1.33, 1.43, 1.67, 2.44, 2.50, 2.78
- **Letter spacing:** -0.057em at 280px, -0.047em at 220px, -0.017em at 84px, -0.012em at 14–20px
- **Role:** Sofia is the sole typeface. Its geometric, low-contrast letterforms carry everything from 14px nav labels to 280px display heroes. Weight 400 is the default at all sizes; weight 500 is reserved for emphasis. The extreme size range (14→280px) with consistent tight tracking (-0.012em to -0.057em) creates a system that scales smoothly from caption to billboard. Signature choice: the ultra-tight tracking even at body sizes (-0.012em at 14px) gives body text a compressed, editorial density unusual for a consumer health app.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 14px | 1.67 | -0.012px | `--text-caption` |
| body-sm | 16px | 1.43 | -0.012px | `--text-body-sm` |
| body | 18px | 1.33 | -0.012px | `--text-body` |
| subheading | 20px | 1.25 | -0.012px | `--text-subheading` |
| heading-sm | 32px | 1.2 | -0.017px | `--text-heading-sm` |
| heading | 44px | 1.15 | -0.017px | `--text-heading` |
| heading-lg | 84px | 1.1 | -0.017px | `--text-heading-lg` |
| display | 141px | 1.04 | -0.047px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** spacious

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 64 | 64px | `--spacing-64` |
| 100 | 100px | `--spacing-100` |
| 156 | 156px | `--spacing-156` |
| 160 | 160px | `--spacing-160` |
| 200 | 200px | `--spacing-200` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 52px |
| cards | 30px |
| buttons | 30px |
| app-icon | 45px |
| feature-cards | 45px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| xl | `rgba(0, 0, 0, 0.12) 0px 27px 104px 0px` | `--shadow-xl` |
| xl-2 | `rgba(0, 0, 0, 0.11) 0px 8px 127px 0px` | `--shadow-xl-2` |
| xl-3 | `rgba(0, 0, 0, 0.25) 0px 9px 46px 0px` | `--shadow-xl-3` |
| xl-4 | `rgba(0, 0, 0, 0.06) 0px 8px 30px 0px` | `--shadow-xl-4` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 90px
- **Card padding:** 32px
- **Element gap:** 20px

## Components

### Display Headline
**Role:** Hero-level typographic statement

Sofia weight 400 at 84–141px, line-height 1.04–1.10, letter-spacing -0.017em to -0.047em. Color: Hims Violet #5d48db for primary displays, Carbon Black #000000 for section dividers. Centered alignment. No accompanying subtitle at this level — the type stands alone against white space.

### Section Heading
**Role:** Mid-page section anchors

Sofia weight 400 at 32–44px, line-height 1.15–1.20, letter-spacing -0.017em. Color: Carbon Black #000000 or Graphite #2e2e2e. Centered or left-aligned depending on layout. Often paired with a rounded-square icon tile above (45px radius, white card, soft shadow, single-stroke icon).

### Icon Tile
**Role:** Decorative section marker

White card at 45px border-radius, approximately 120×120px, containing a single outlined/filled icon in Carbon Black. Shadow: rgba(0,0,0,0.12) 0px 27px 104px. Floats above the heading it labels.

### Phone Mockup Frame
**Role:** Hero visual anchor

iPhone device frame held by a human hand (photographic). Device shadow: rgba(0,0,0,0.25) 0px 9px 46px. Sits centered on a soft purple/lavender radial glow gradient (violet bleed from the product imagery into white canvas). The phone screen content is the product — not a static screenshot but styled with internal gradient cards.

### Top Nav Bar
**Role:** Primary site navigation

Pill-shaped container at 52px border-radius, white fill, shadow rgba(0,0,0,0.06) 0px 8px 30px. Left: Hims & Hers wordmark in sofia. Right: Apple App Store download badge (pill, white background, 1px black border at 30px radius, 16px vertical padding, 22px horizontal padding). Padding: 16px top/bottom, 22px sides.

### App Store Download Button
**Role:** Primary conversion action

Pill shape at 30px border-radius, white fill, 1px Carbon Black border. Apple logo + 'Download now' text in sofia 16px weight 400. No filled CTA variant — the outlined pill IS the action style for this system.

### Program Card (in-app)
**Role:** Product category card inside phone mockup

Rounded card with product-tinted gradient background (e.g. iris-to-lavender, or mint-to-teal). Small badge label ('ED Program', 'Acne Program') at top-right in white text on a translucent dark pill. Headline text overlaid in white. Represents the product's own UI, not the marketing site's UI.

### Feature Row
**Role:** Content section with icon and heading

Vertical stack: Icon Tile (120×120, 45px radius) → 40px gap → Section Heading (32–44px) → 32px gap → body text. Centered or left-aligned. All spacing uses the 4px base unit scaled up (32, 40, 64, 90px).

### Footer
**Role:** Site footer with legal and nav

White background, 100px top padding, 64px horizontal padding. Carbon Black text at 14–16px. Hairline borders at 1px in Vellum Gray #f0f0f0 separate columns.

## Do's and Don'ts

### Do
- Use Hims Violet #5d48db only for display headlines and occasional 1px borders — never for filled buttons, backgrounds, or body text
- Set card border-radius to 30px for standard cards, 45px for feature/hero cards, and 52px for the nav pill
- Apply shadow rgba(0,0,0,0.12) 0px 27px 104px to standard cards — the long spread is essential to the floating effect
- Set page background to #ffffff and let cards share the same color; differentiation comes from shadow and radius, not fill
- Use sofia at weight 400 for all body and display text; reserve weight 500 sparingly for emphasis
- Center headlines at 84px+ and apply letter-spacing between -0.017em and -0.047em — tight tracking is signature
- Maintain 90px vertical gaps between major sections and 32px internal card padding

### Don't
- Do not introduce a second accent color into the marketing UI — violet #5d48db is the only chromatic voice
- Do not use filled colored buttons — the action style is the white pill with black border at 30px radius
- Do not apply tight shadows (0 2px 4px) — every shadow in this system spreads 27px+ vertically
- Do not use black at less than 2e2e2 for heading text — the slightly softer graphite prevents harshness on white
- Do not add decorative gradients to UI surfaces — gradients are reserved for product imagery inside phone mockups
- Do not set card radii below 30px or above 52px — the system has exactly three radius tiers
- Do not use body type above 20px without shifting to heading role and applying -0.017em tracking

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Page Canvas | `#ffffff` | Base background for all sections |
| 1 | Card Surface | `#ffffff` | Elevated cards, app icon tiles, program cards — same color as canvas, distinguished by shadow and radius only |
| 2 | Nav Surface | `#ffffff` | Top navigation bar, pill-shaped container at 52px radius with soft shadow |

## Elevation

- **Card (standard):** `rgba(0, 0, 0, 0.12) 0px 27px 104px 0px`
- **Card (large/feature):** `rgba(0, 0, 0, 0.11) 0px 8px 127px 0px`
- **Phone mockup:** `rgba(0, 0, 0, 0.25) 0px 9px 46px 0px`
- **Nav bar:** `rgba(0, 0, 0, 0.06) 0px 8px 30px 0px`

## Imagery

Imagery is photographic and intimate: a human hand (appears to be a woman's hand with neutral-toned nails) holding an iPhone in soft, diffused light. The device is the hero — there is no lifestyle context, no room, no environment. The phone screen displays the actual product UI, which uses its own gradient-washed cards (mint-to-teal, iris-to-lavender) as secondary color language. Behind the device, a soft radial glow in pale violet bleeds into the white canvas, connecting the product to the brand accent. No illustrations, no 3D renders, no abstract graphics. Treatment: full-bleed centered, no rounded masking on the device itself, and the lavender glow is the only atmospheric element.

## Layout

Page model is centered and max-width contained (1200px). The hero is a full-width white canvas with a centered headline pair ('Total care. / Totally different.') stacked vertically at 84–141px, with the phone mockup floating below. Sections flow vertically with 90px gaps, no alternating dark/light bands — the entire page stays on white. Content is arranged in centered stacks: headline → icon tile → body text. No asymmetric compositions, no side-by-side text+image pairs in the visible flow. Navigation is a pill-shaped floating bar at the top. The overall rhythm is editorial: each section gets the full viewport's attention before the next begins.

## Agent Prompt Guide

## Quick Color Reference

- Primary text: #000000 (Carbon Black)
- Background: #ffffff (Paper White)
- Muted text: #8f8f8f (Stone)
- Hairline border: #e0e0e0 (Linen) or #f0f0f0 (Vellum Gray)
- Headline accent: #5d48db (Hims Violet)
- primary action: no distinct CTA color

## Example Component Prompts

**1. Display Headline Section**
White #ffffff canvas. Centered headline 'Total care. Totally different.' in sofia weight 400, 141px, line-height 1.04, letter-spacing -0.047em, color #5d48db. No subtitle. 90px gap below before next section.

**2. Icon Tile + Section Heading**
White canvas. Centered Icon Tile: 120×120px, 45px border-radius, white fill, shadow rgba(0,0,0,0.12) 0px 27px 104px. Contains a single black outlined icon centered. 40px gap below, then heading 'Programs' in sofia weight 400, 84px, line-height 1.10, letter-spacing -0.017em, color #000000.

**3. Feature Card Grid**
White canvas. 3-column grid of cards, each 30px border-radius, 32px padding, white fill, shadow rgba(0,0,0,0.11) 0px 8px 127px. Card heading in sofia 32px weight 400 #000000. Card body in sofia 18px weight 400 #8f8f8f. 20px gap between cards horizontally, 32px vertically.

**4. Outlined Pill Download Button**
White fill, 1px #000000 border, 30px border-radius, padding 16px vertical × 22px horizontal. Apple logo icon (16px, black) + text 'Download now' in sofia 16px weight 400 #000000. No fill variant exists.

**5. Floating Nav Bar**
Pill-shaped container, 52px border-radius, white fill, shadow rgba(0,0,0,0.06) 0px 8px 30px. Padding 16px top/bottom. Left: 'hims & hers' wordmark in sofia. Right: outlined download pill (see component 4). Fixed position at top of page.

## Similar Brands

- **Calm** — Same oversized type-in-near-empty-space approach, soft long-spread shadows, and near-monochrome palette with a single muted accent
- **Headspace** — Shared spacious, breathy layout with centered headlines, rounded-everything components, and warm-but-restrained visual tone
- **Stripe** — Same editorial precision: custom geometric sans, tight letter-spacing at display sizes, and a violet/purple accent used sparingly for emphasis
- **Whoop** — Similar health/wellness positioning with minimal UI, soft shadows, and product-foreground photography on pure white

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-hims-violet: #5d48db;
  --color-carbon-black: #000000;
  --color-paper-white: #ffffff;
  --color-vellum-gray: #f0f0f0;
  --color-graphite: #2e2e2e;
  --color-linen: #e0e0e0;
  --color-stone: #8f8f8f;
  --color-soft-mint: #3fd194;
  --color-iris: #9685ff;

  /* Typography — Font Families */
  --font-sofia: 'sofia', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.67;
  --tracking-caption: -0.012px;
  --text-body-sm: 16px;
  --leading-body-sm: 1.43;
  --tracking-body-sm: -0.012px;
  --text-body: 18px;
  --leading-body: 1.33;
  --tracking-body: -0.012px;
  --text-subheading: 20px;
  --leading-subheading: 1.25;
  --tracking-subheading: -0.012px;
  --text-heading-sm: 32px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -0.017px;
  --text-heading: 44px;
  --leading-heading: 1.15;
  --tracking-heading: -0.017px;
  --text-heading-lg: 84px;
  --leading-heading-lg: 1.1;
  --tracking-heading-lg: -0.017px;
  --text-display: 141px;
  --leading-display: 1.04;
  --tracking-display: -0.047px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-64: 64px;
  --spacing-100: 100px;
  --spacing-156: 156px;
  --spacing-160: 160px;
  --spacing-200: 200px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 90px;
  --card-padding: 32px;
  --element-gap: 20px;

  /* Border Radius */
  --radius-3xl: 30px;
  --radius-3xl-2: 45px;
  --radius-full: 52px;

  /* Named Radii */
  --radius-nav: 52px;
  --radius-cards: 30px;
  --radius-buttons: 30px;
  --radius-app-icon: 45px;
  --radius-feature-cards: 45px;

  /* Shadows */
  --shadow-xl: rgba(0, 0, 0, 0.12) 0px 27px 104px 0px;
  --shadow-xl-2: rgba(0, 0, 0, 0.11) 0px 8px 127px 0px;
  --shadow-xl-3: rgba(0, 0, 0, 0.25) 0px 9px 46px 0px;
  --shadow-xl-4: rgba(0, 0, 0, 0.06) 0px 8px 30px 0px;

  /* Surfaces */
  --surface-page-canvas: #ffffff;
  --surface-card-surface: #ffffff;
  --surface-nav-surface: #ffffff;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-hims-violet: #5d48db;
  --color-carbon-black: #000000;
  --color-paper-white: #ffffff;
  --color-vellum-gray: #f0f0f0;
  --color-graphite: #2e2e2e;
  --color-linen: #e0e0e0;
  --color-stone: #8f8f8f;
  --color-soft-mint: #3fd194;
  --color-iris: #9685ff;

  /* Typography */
  --font-sofia: 'sofia', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.67;
  --tracking-caption: -0.012px;
  --text-body-sm: 16px;
  --leading-body-sm: 1.43;
  --tracking-body-sm: -0.012px;
  --text-body: 18px;
  --leading-body: 1.33;
  --tracking-body: -0.012px;
  --text-subheading: 20px;
  --leading-subheading: 1.25;
  --tracking-subheading: -0.012px;
  --text-heading-sm: 32px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -0.017px;
  --text-heading: 44px;
  --leading-heading: 1.15;
  --tracking-heading: -0.017px;
  --text-heading-lg: 84px;
  --leading-heading-lg: 1.1;
  --tracking-heading-lg: -0.017px;
  --text-display: 141px;
  --leading-display: 1.04;
  --tracking-display: -0.047px;

  /* Spacing */
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-64: 64px;
  --spacing-100: 100px;
  --spacing-156: 156px;
  --spacing-160: 160px;
  --spacing-200: 200px;

  /* Border Radius */
  --radius-3xl: 30px;
  --radius-3xl-2: 45px;
  --radius-full: 52px;

  /* Shadows */
  --shadow-xl: rgba(0, 0, 0, 0.12) 0px 27px 104px 0px;
  --shadow-xl-2: rgba(0, 0, 0, 0.11) 0px 8px 127px 0px;
  --shadow-xl-3: rgba(0, 0, 0, 0.25) 0px 9px 46px 0px;
  --shadow-xl-4: rgba(0, 0, 0, 0.06) 0px 8px 30px 0px;
}
```
