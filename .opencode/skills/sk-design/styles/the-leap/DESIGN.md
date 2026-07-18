# The Leap — Style Reference
> espresso ink on warm cream

**Theme:** light

The Leap uses a warm-creator economy visual language: near-white canvas, espresso-brown text instead of black, a single acid lime-yellow CTA that pops against muted surfaces, and serif display headlines paired with a contemporary neo-grotesque body. Decorative pastels (lavender, mint, sky blue, lemon) appear inside product mockups and section washes rather than chrome. Cards are generously rounded (30px), buttons are fully pill-shaped (100px), and the whole system reads approachable and editorial — the opposite of corporate SaaS. The brown-on-cream + lime accent palette signals a brand built for individual creators, not enterprise buyers.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Espresso Ink | `#482317` | `--color-espresso-ink` | Primary text, headings, nav links, body copy, and outlined button borders — a warm dark brown that replaces pure black and gives the whole system a softer, editorial voice |
| Fog Border | `#e5e7eb` | `--color-fog-border` | Hairline borders, dividers, input outlines, and icon strokes across cards, nav, and body containers |
| Cream Canvas | `#fafafa` | `--color-cream-canvas` | Page background and card surfaces — the off-white that everything sits on, warmer than pure white |
| Lime Spark | `#ecf956` | `--color-lime-spark` | Green action color for filled buttons, selected navigation states, and focused conversion moments. |
| Lilac Whisper | `#efd8f0` | `--color-lilac-whisper` | Decorative pastel surface used inside product mockups and gradient washes — soft lavender that recedes behind content |
| Mint Tint | `#c6e57d` | `--color-mint-tint` | Decorative pastel surface — light green used in card backgrounds and gradient endpoints |
| Lemon Cream | `#f3fb9a` | `--color-lemon-cream` | Decorative pastel surface — pale lemon used in testimonial card washes and gradient stops |
| Sky Hush | `#b1dcfc` | `--color-sky-hush` | Decorative pastel surface — muted blue used as occasional card background accent |

## Tokens — Typography

### Favorit — Body text, links, nav items, card content — same family as ABC Favorit with slightly looser line-height (1.5) for reading comfort · `--font-favorit`
- **Substitute:** Inter
- **Weights:** 350, 400
- **Sizes:** 13px, 15px, 16px, 20px, 29px
- **Line height:** 1.00, 1.50
- **Letter spacing:** +0.01em at 13px, +0.008em at 16px
- **Role:** Body text, links, nav items, card content — same family as ABC Favorit with slightly looser line-height (1.5) for reading comfort

### Tobias — Display serif for hero and section headlines — large sizes with tight tracking (-0.02em) create editorial gravitas. The light weight (300) is anti-convention for hero text; most sites use 600-700, this whisper-weight signals confidence and restraint · `--font-tobias`
- **Substitute:** Source Serif Pro
- **Weights:** 300
- **Sizes:** 54px, 60px, 70px
- **Line height:** 1.03, 1.20
- **Letter spacing:** -1.4px at 70px, -1.2px at 60px, -1.08px at 54px
- **Role:** Display serif for hero and section headlines — large sizes with tight tracking (-0.02em) create editorial gravitas. The light weight (300) is anti-convention for hero text; most sites use 600-700, this whisper-weight signals confidence and restraint

### ABC Favorit — Primary UI and body typeface — neo-grotesque with slight warmth, weight 350 for body and 400 for emphasis. Tight tracking (-0.02em) at larger sizes gives headings a compressed, modern feel · `--font-abc-favorit`
- **Substitute:** Inter
- **Weights:** 350, 400
- **Sizes:** 14px, 15px, 16px, 20px, 22px, 25px, 27px, 30px
- **Line height:** 1.00, 1.07, 1.20
- **Letter spacing:** -0.02em at 30px, -0.015em at 16px, +0.008em at 14px
- **Role:** Primary UI and body typeface — neo-grotesque with slight warmth, weight 350 for body and 400 for emphasis. Tight tracking (-0.02em) at larger sizes gives headings a compressed, modern feel

### Favorit-Bold — Emphasis headings and subheads — bold weight with aggressive tracking (-0.037em) creates a tight, assertive counterpoint to the light serif displays · `--font-favorit-bold`
- **Substitute:** Inter Bold
- **Weights:** 700
- **Sizes:** 18px, 24px
- **Line height:** 1.00, 1.20
- **Letter spacing:** -0.89px at 24px, -0.67px at 18px
- **Role:** Emphasis headings and subheads — bold weight with aggressive tracking (-0.037em) creates a tight, assertive counterpoint to the light serif displays

### Favorit-Regular — Favorit-Regular — detected in extracted data but not described by AI · `--font-favorit-regular`
- **Weights:** 400
- **Sizes:** 20px
- **Line height:** 1.2
- **Letter spacing:** 0.008
- **Role:** Favorit-Regular — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 13px | 1.5 | 0.13px | `--text-caption` |
| body | 16px | 1.5 | 0.13px | `--text-body` |
| subheading | 20px | 1.2 | 0.16px | `--text-subheading` |
| heading-sm | 27px | 1.07 | -0.54px | `--text-heading-sm` |
| heading | 30px | 1.2 | -0.6px | `--text-heading` |
| heading-lg | 54px | 1.03 | -1.08px | `--text-heading-lg` |
| display | 70px | 1.03 | -1.4px | `--text-display` |

## Tokens — Spacing & Shapes

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 5 | 5px | `--spacing-5` |
| 7 | 7px | `--spacing-7` |
| 8 | 8px | `--spacing-8` |
| 10 | 10px | `--spacing-10` |
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 22 | 22px | `--spacing-22` |
| 24 | 24px | `--spacing-24` |
| 26 | 26px | `--spacing-26` |
| 30 | 30px | `--spacing-30` |
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 50 | 50px | `--spacing-50` |
| 60 | 60px | `--spacing-60` |
| 64 | 64px | `--spacing-64` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 20px |
| body | 6px |
| cards | 30px |
| links | 9px |
| buttons | 100px |
| smallCards | 15px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| sm | `rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) ...` | `--shadow-sm` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 30px
- **Element gap:** 16px

## Components

### Lime CTA Button
**Role:** Primary action — sign up, get started, submit

Pill-shaped button with 100px border-radius, #ecf956 lime-yellow fill, #482317 espresso text, ABC Favorit weight 700 at 14-15px, 16px horizontal × 8px vertical padding. The only filled chromatic button in the system; its acid green against warm cream creates visual urgency without aggression

### Ghost Text Button
**Role:** Secondary action — learn more, sign in

No background fill, #482317 espresso text, uppercase tracking, weight 700, sits inline with CTAs. Used for 'SIGN IN' in nav and secondary flow actions

### Outlined Brown Button
**Role:** Tertiary action with border emphasis

1px #482317 espresso border, transparent fill, espresso text, 100px pill radius. Used when a secondary action needs more weight than a ghost link but less than the lime CTA

### Testimonial Card
**Role:** Social proof — customer review display

30px border-radius, #fafafa cream background, 1px #e5e7eb fog border, 30px padding. Contains: review title (Favorit-Bold 18px), body text (Favorit 14-16px), 5 yellow stars, reviewer name and Trustpilot link. Cards sit in a 3-column grid with 16-24px gaps

### Product Card Mockup
**Role:** Hero visual — creator link-in-bio preview

30px border-radius, floating card with pastel gradient fill (lavender to mint), contains avatar, creator name, social icons, and embedded product cards. Slightly rotated for playful composition, sits on the hero section

### Navigation Bar
**Role:** Top-level site navigation

Horizontal bar with logo left, center nav links (FEATURES, PRICING, DISCOVER, RESOURCES) in uppercase ABC Favorit weight 350, right side has ghost 'SIGN IN' and lime CTA 'SIGN UP FREE'. Subtle drop shadow: rgba(0,0,0,0.1) 0px 4px 6px -1px. No background fill — transparent over page canvas

### Section Heading Group
**Role:** Section title and subtitle stack

Tobias serif 54-60px for main heading, espresso ink color, -1.08 to -1.2px letter-spacing, line-height 1.03. Subtitle below in Favorit 16-20px, espresso ink, max-width ~600px, centered or left-aligned depending on section

### Step Illustration Block
**Role:** How-it-works step with phone mockup

Numbered step (Tobias serif numeral), short label (Favorit), phone mockup with UI screenshot, decorative hand-drawn arrow connecting steps. Pastel background washes (mint, lavender) for visual separation

### Star Rating Display
**Role:** Review rating indicator

5 solid yellow/gold stars (approximately #f5b800 implied), inline with testimonial cards. No container, no background — stars sit directly on cream card surface

### Pastel Section Background
**Role:** Decorative section wash

Full-width section with gradient or solid pastel fill (lemon #f3fb9a, lavender #efd8f0, mint #c6e57d), 30px border-radius on contained content blocks, creates visual rhythm between white sections

### Creator Profile Badge
**Role:** Inline creator attribution

Small pill badge with 20px border-radius, #fafafa background, 1px fog border, contains circular avatar + creator name + role. Used floating over product mockups in hero

### Nav Dropdown Indicator
**Role:** Expandable nav item chevron

Small downward chevron icon (stroke #482317, 1px) next to nav items with submenus (FEATURES, RESOURCES). No background, sits inline with nav text

## Do's and Don'ts

### Do
- Use #ecf956 lime as the only filled button color — it must remain the single chromatic action accent against the warm neutral system
- Set all buttons to 100px pill radius; cards to 30px radius; never mix sharp corners with this system
- Pair Tobias weight 300 serif displays (54-70px) with ABC Favorit weight 350-400 body — the serif/sans contrast is the system's editorial signature
- Use #482317 espresso for all text — never pure #000000, the warm brown is what makes the system feel approachable
- Apply pastel washes (#f3fb9a, #efd8f0, #c6e57d) to section backgrounds, not to text or interactive elements
- Set hero and section headings to line-height 1.03 with negative letter-spacing — the tight rhythm is essential to the editorial feel
- Use uppercase ABC Favorit weight 700 with positive tracking for nav items and button labels

### Don't
- Don't introduce a second action color — the lime CTA only works because everything else is neutral or pastel decorative
- Don't use Tobias serif for body text or UI labels — reserve it for displays and large section headings only
- Don't apply shadows to cards — the system uses flat surfaces with borders; the only shadow is the nav bar drop shadow
- Don't use pure white #ffffff or pure black #000000 — cream #fafafa and espresso #482317 define the warm palette
- Don't set card radius below 15px — the generous rounding (15-30px) is core to the friendly creator-economy feel
- Don't add gradient text effects or color overlays to the serif headings — keep them flat espresso on cream
- Don't use more than one pastel wash per section — multiple competing pastels will flatten the visual hierarchy

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Page Canvas | `#fafafa` | Off-white page background |
| 1 | Card Surface | `#fafafa` | Testimonial cards, product cards, content blocks |
| 2 | Decorative Wash | `#efd8f0` | Pastel lavender section or card accent |
| 2 | Accent Wash | `#f3fb9a` | Pastel lemon section or card accent |

## Elevation

- **Navigation bar:** `rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px`

## Imagery

Lifestyle photography of real creators (not stock models) is the primary visual: warm, candid, individual personality. Product mockups are the secondary visual: phone screens, link-in-bio cards, and course previews with pastel gradient backgrounds. Decorative elements are hand-drawn and playful — sketchy arrows, star stickers, organic shapes in lime and yellow. No 3D renders, no corporate stock photography, no abstract gradient meshes. Icons are thin-stroke (1px) line icons in espresso brown, no filled icon variants.

## Layout

Centered max-width container (1200px) with generous side padding. Hero is full-bleed with a two-column split: left text block (headline + subhead + CTA), right floating product card mockup at slight rotation. Sections alternate between cream canvas and pastel washes (lavender-to-mint gradient, solid lemon, solid mint) creating visual rhythm. How-it-works section uses centered text above a 2-step illustration flow with connecting arrow. Testimonials are a 3-column card grid on a lavender-mint gradient background. Vertical spacing is generous (80px section gaps) with comfortable density throughout. Navigation is a minimal top bar — no sidebar, no mega-menu, just centered text links with dropdown chevrons.

## Agent Prompt Guide

Quick Color Reference:
- Text: #482317 (Espresso Ink)
- Background: #fafafa (Cream Canvas)
- Border: #e5e7eb (Fog Border)
- Accent: #ecf956 (Lime Spark)
- Pastel washes: #efd8f0, #c6e57d, #f3fb9a
- primary action: #ecf956 (filled action)

Example Component Prompts:

1. Create a hero section: cream #fafafa background. Two-column layout (55/45 split). Left: Tobias serif headline at 60px weight 300, #482317, letter-spacing -1.2px, line-height 1.03. Subtitle in ABC Favorit 20px weight 400, #482317, max-width 500px. Lime CTA button (#ecf956 fill, 100px radius, 16px×40px padding, #482317 text weight 700, 15px uppercase). Right: floating product card mockup at 5° rotation, 30px radius, pastel gradient fill.

2. Create a testimonial card grid: 3-column grid, 24px gap. Each card: #fafafa background, 1px #e5e7eb border, 30px border-radius, 30px padding. Title in Favorit-Bold 18px #482317. Body in Favorit 15px weight 350 #482317, line-height 1.5. Five yellow stars (solid #f5b800, 16px each) at bottom-left. Reviewer name in Favorit 14px weight 400.

3. Create a Primary Action Button: #ecf956 background, high-contrast text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.

4. Create a section with pastel background: full-width lavender-to-mint gradient background (linear-gradient 129deg, #f3e8f3 to #dff5dd). Centered max-width 1200px content. Heading: Tobias 54px weight 300, #482317, centered. 80px top/bottom padding on the section.

5. Create a how-it-works step block: numbered '1.' in Tobias 70px weight 300 #482317, label 'Discovers you' in Favorit 20px weight 400 below. Phone mockup centered, 15px radius, cream #fafafa fill, contains UI screenshot. Decorative lime hand-drawn arrow connecting to next step.

## Similar Brands

- **Substack** — Same warm-creator palette approach with editorial serif displays paired with simple sans body, generous card rounding, and a single accent color
- **Gumroad** — Same creator-economy friendliness with pastel washes, pill buttons, and approachable rounded cards targeting individual sellers
- **Kit (ConvertKit)** — Same warm neutral base with a single vivid accent color, generous spacing, and editorial typography mixing serif and sans
- **Stan Store** — Same link-in-bio creator platform visual language with bold serif headlines, lime/bright CTAs, and pastel decorative cards

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-espresso-ink: #482317;
  --color-fog-border: #e5e7eb;
  --color-cream-canvas: #fafafa;
  --color-lime-spark: #ecf956;
  --color-lilac-whisper: #efd8f0;
  --color-mint-tint: #c6e57d;
  --color-lemon-cream: #f3fb9a;
  --color-sky-hush: #b1dcfc;

  /* Typography — Font Families */
  --font-favorit: 'Favorit', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-tobias: 'Tobias', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-abc-favorit: 'ABC Favorit', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-favorit-bold: 'Favorit-Bold', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-favorit-regular: 'Favorit-Regular', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 13px;
  --leading-caption: 1.5;
  --tracking-caption: 0.13px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: 0.13px;
  --text-subheading: 20px;
  --leading-subheading: 1.2;
  --tracking-subheading: 0.16px;
  --text-heading-sm: 27px;
  --leading-heading-sm: 1.07;
  --tracking-heading-sm: -0.54px;
  --text-heading: 30px;
  --leading-heading: 1.2;
  --tracking-heading: -0.6px;
  --text-heading-lg: 54px;
  --leading-heading-lg: 1.03;
  --tracking-heading-lg: -1.08px;
  --text-display: 70px;
  --leading-display: 1.03;
  --tracking-display: -1.4px;

  /* Typography — Weights */
  --font-weight-light: 300;
  --font-weight-w350: 350;
  --font-weight-regular: 400;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-5: 5px;
  --spacing-7: 7px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-22: 22px;
  --spacing-24: 24px;
  --spacing-26: 26px;
  --spacing-30: 30px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-50: 50px;
  --spacing-60: 60px;
  --spacing-64: 64px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 30px;
  --element-gap: 16px;

  /* Border Radius */
  --radius-md: 6px;
  --radius-lg: 9px;
  --radius-xl: 15px;
  --radius-2xl: 20px;
  --radius-3xl: 30px;
  --radius-full: 100px;

  /* Named Radii */
  --radius-nav: 20px;
  --radius-body: 6px;
  --radius-cards: 30px;
  --radius-links: 9px;
  --radius-buttons: 100px;
  --radius-smallcards: 15px;

  /* Shadows */
  --shadow-sm: rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px;

  /* Surfaces */
  --surface-page-canvas: #fafafa;
  --surface-card-surface: #fafafa;
  --surface-decorative-wash: #efd8f0;
  --surface-accent-wash: #f3fb9a;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-espresso-ink: #482317;
  --color-fog-border: #e5e7eb;
  --color-cream-canvas: #fafafa;
  --color-lime-spark: #ecf956;
  --color-lilac-whisper: #efd8f0;
  --color-mint-tint: #c6e57d;
  --color-lemon-cream: #f3fb9a;
  --color-sky-hush: #b1dcfc;

  /* Typography */
  --font-favorit: 'Favorit', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-tobias: 'Tobias', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-abc-favorit: 'ABC Favorit', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-favorit-bold: 'Favorit-Bold', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-favorit-regular: 'Favorit-Regular', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 13px;
  --leading-caption: 1.5;
  --tracking-caption: 0.13px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: 0.13px;
  --text-subheading: 20px;
  --leading-subheading: 1.2;
  --tracking-subheading: 0.16px;
  --text-heading-sm: 27px;
  --leading-heading-sm: 1.07;
  --tracking-heading-sm: -0.54px;
  --text-heading: 30px;
  --leading-heading: 1.2;
  --tracking-heading: -0.6px;
  --text-heading-lg: 54px;
  --leading-heading-lg: 1.03;
  --tracking-heading-lg: -1.08px;
  --text-display: 70px;
  --leading-display: 1.03;
  --tracking-display: -1.4px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-5: 5px;
  --spacing-7: 7px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-22: 22px;
  --spacing-24: 24px;
  --spacing-26: 26px;
  --spacing-30: 30px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-50: 50px;
  --spacing-60: 60px;
  --spacing-64: 64px;

  /* Border Radius */
  --radius-md: 6px;
  --radius-lg: 9px;
  --radius-xl: 15px;
  --radius-2xl: 20px;
  --radius-3xl: 30px;
  --radius-full: 100px;

  /* Shadows */
  --shadow-sm: rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px;
}
```
