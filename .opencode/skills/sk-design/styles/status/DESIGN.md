# Status — Style Reference
> encrypted vault behind midnight glass — a dark security console where the only color is a single violet signal lamp

**Theme:** dark

Status presents an encrypted-vault aesthetic: a near-black canvas (#09101c) with steel-toned borders and elevated slate surfaces that read as private infrastructure rather than consumer app. Color is rationed tightly — Status Violet (#7140fd) owns brand identity moments while Signal Blue (#2a4af5) carries the only filled action, and everything else stays in an achromatic 95% palette. Inter handles every typographic role, with display 88px headlines tracking at -0.021em that feel engineered rather than set. Comfortable 4px-based rhythm, 20-24px card radii, and 12px pill-shaped controls create a deliberate, security-first surface language. Product mockups (wallet, messenger) are the primary visual content — the device IS the hero, not lifestyle photography.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Midnight Ink | `#09101c` | `--color-midnight-ink` | Page canvas, card backgrounds, primary surface — the near-black base that absorbs everything else |
| Slate Depth | `#131d2f` | `--color-slate-depth` | Elevated surface for buttons and interactive containers, one step above the canvas |
| Steel Edge | `#1b273d` | `--color-steel-edge` | Primary border color, link underlines, nav separators — defines structural edges at very high frequency |
| Graphite Plate | `#3a4049` | `--color-graphite-plate` | Secondary card surface, subtle elevation tier above Midnight Ink |
| Slate Mist | `#647084` | `--color-slate-mist` | Muted body text, helper copy, secondary labels — readable but recessive |
| Ash Light | `#a1abbd` | `--color-ash-light` | Icon fills, tertiary text, nav inactive states — the lightest non-white neutral |
| Pale Mist | `#dce0e5` | `--color-pale-mist` | Light-section borders, hairline dividers, outlines on light backgrounds |
| Cloud | `#f0f2f5` | `--color-cloud` | Lightest neutral border, soft dividers in light sections |
| Paper | `#ffffff` | `--color-paper` | Light-section canvas, primary text on dark, inverted surface — dual-role neutral |
| Signal Blue | `#2a4af5` | `--color-signal-blue` | Primary action fill, brand-action emphasis — the only saturated button color, single violet-blue signal against the dark canvas |
| Status Violet | `#7140fd` | `--color-status-violet` | Violet text accent for links, tags, and emphasized short phrases |
| Deep Teal | `linear-gradient(78deg, rgb(42, 121, 155) -30%, rgb(246, 176, 60) 8%, rgb(255, 51, 163) 98%)` | `--color-deep-teal` | Accent hue in gradient washes, illustrative moments, secondary brand color in art; Brand gradient wash for decorative sections, hero accents, and section backgrounds |
| Amber Glow | `#f6b03c` | `--color-amber-glow` | Warm accent in gradient compositions and illustrative highlights — the yellow stop in tri-color gradients |

## Tokens — Typography

### Inter — Sole typeface across every role. Inter is chosen for its monospace-adjacent neutrality — it doesn't compete with the device mockups that dominate the page. The aggressive negative tracking on display sizes (-0.021em at 88px) tightens headlines into dense blocks of type that feel machined rather than editorial. Weight 500 is the workhorse for UI; 700 is reserved for primary headlines and emphasis. No serif, no display face — the system is deliberately sans-only and mono-personality. · `--font-inter`
- **Substitute:** Inter (Google Fonts), fallback: system-ui, -apple-system, sans-serif
- **Weights:** 400, 500, 600, 700
- **Sizes:** 11px, 13px, 15px, 16px, 19px, 27px, 64px, 88px
- **Line height:** 0.95, 1.06, 1.19, 1.40, 1.42, 1.45, 1.47, 1.50
- **Letter spacing:** -0.0210em at 88px display, -0.0200em at 64px, -0.0160em at 27px, -0.0090em at 19px, -0.0050em at 15-16px body, -0.0030em at 11-13px caption
- **Role:** Sole typeface across every role. Inter is chosen for its monospace-adjacent neutrality — it doesn't compete with the device mockups that dominate the page. The aggressive negative tracking on display sizes (-0.021em at 88px) tightens headlines into dense blocks of type that feel machined rather than editorial. Weight 500 is the workhorse for UI; 700 is reserved for primary headlines and emphasis. No serif, no display face — the system is deliberately sans-only and mono-personality.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 11px | 16 | -0.03px | `--text-caption` |
| body-md | 16px | 23.5 | -0.08px | `--text-body-md` |
| subheading | 19px | 26.6 | -0.17px | `--text-subheading` |
| heading-sm | 27px | 32.1 | -0.43px | `--text-heading-sm` |
| heading | 64px | 67.8 | -1.28px | `--text-heading` |
| display | 88px | 83.6 | -1.85px | `--text-display` |

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
| 48 | 48px | `--spacing-48` |
| 64 | 64px | `--spacing-64` |
| 68 | 68px | `--spacing-68` |
| 80 | 80px | `--spacing-80` |
| 112 | 112px | `--spacing-112` |
| 120 | 120px | `--spacing-120` |
| 160 | 160px | `--spacing-160` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 9999px |
| cards | 20px |
| pills | 9999px |
| images | 24px |
| buttons | 12px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| lg | `rgba(9, 16, 28, 0.08) 0px 4px 20px 0px` | `--shadow-lg` |
| lg-2 | `rgba(9, 16, 28, 0.04) 0px 2px 20px 0px` | `--shadow-lg-2` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 24px
- **Element gap:** 8-16px

## Components

### Download CTA Button (Filled)
**Role:** Primary download action for desktop and mobile platforms

Filled button with Signal Blue (#2a4af5) background, white text, 12px radius, 8-16px padding. Contains platform icon (Apple/Windows/Android) left of label. Weight 500, 15px text.

### Download CTA Button (Outlined)
**Role:** Secondary download action, ghost variant

Transparent background with 1px Steel Edge (#1b273d) border on dark surfaces or Pale Mist (#dce0e5) on light surfaces. 12px radius, 8-16px padding, 15px weight 500 text. Platform icon left of label.

### Pill Tag
**Role:** Category labels, section markers, product tags

Full-pill radius (9999px), 4-8px vertical padding, 12px horizontal padding. 13px weight 500 text. Background: Slate Depth (#131d2f) on dark, Cloud (#f0f2f5) on light. Text: Ash Light (#a1abbd) or Signal Blue (#2a4af5) for active.

### Top Announcement Banner
**Role:** Site-wide promotional/announcement bar

Full-width strip at top of page, Paper (#ffffff) background, 88% opacity overlay. 13px centered text with embedded link styled as underlined. Fixed/sticky positioning.

### Navigation Bar
**Role:** Primary site navigation

Transparent on hero, Midnight Ink (#09101c) on scroll. Logo left, nav links center (15px weight 500, Steel Edge color for inactive, Paper for active), download buttons right. 1px Steel Edge bottom border. Height ~64px.

### Feature Card
**Role:** Grid item in 'Built different' feature sections

3-column grid card on light Paper (#ffffff) background. No visible card surface — flat layout with generous 40px row gap. Icon at top (32-40px, full color or Status Violet), 27px weight 600 heading, 15px weight 400 body in Slate Mist (#647084).

### Product Showcase Card
**Role:** Device mockup containers — phone, tablet, desktop wallet UI

Screenshot/device mockup on Midnight Ink canvas, 20-24px radius, subtle shadow rgba(9,16,28,0.08) 0px 4px 20px. Mockups maintain aspect ratio, often overlapping with float effect.

### Onramp Info Card
**Role:** Payment method information callout

Light section card with Cloud (#f0f2f5) background, 20px radius, 16-24px padding. Contains heading + body + payment method icon row (Visa, Mastercard, Apple Pay, Google Pay at 32px).

### Wallet Asset List Item
**Role:** Individual asset row in wallet interface preview

Horizontal row, 16px vertical padding, Paper background. Token icon (colored circle, 32-40px) left, token name + balance center, fiat value right. Hairline Steel Edge (#1b273d) bottom border.

### Section Divider
**Role:** Visual separation between major page sections

No hard line — sections flow with background color transitions (dark to light to dark). Where needed, 1px Steel Edge (#1b273d) horizontal line with 40-80px vertical margin.

### Link (Text)
**Role:** Inline links, nav items, footer links

15px weight 500, Steel Edge (#1b273d) default on dark surfaces, Pale Mist (#dce0e5) on light. 1px underline at offset 4px. Hover: Signal Blue (#2a4af5) or Paper (#ffffff) with no underline shift.

### Decorative Gradient Orb
**Role:** Background atmospheric gradient in hero/section backgrounds

Large radial gradient (300-600px) positioned absolutely, 70% transparency to transparent. Colors cycle through Status Violet (#7140fd), Signal Blue (#2a4af5), Deep Teal (#2a799b), and Amber Glow (#f6b03c). Creates depth without imagery.

## Do's and Don'ts

### Do
- Use Inter for all text — no secondary typefaces, no serif, no display face
- Set display headlines at 88px with -1.85px letter-spacing and 0.95 line-height for tight, machined blocks of type
- Reserve Signal Blue (#2a4af5) exclusively for filled primary actions — never use it for decoration, icons, or text emphasis
- Apply 12px radius to all buttons, 20px to cards, 9999px to tags and pills
- Build the surface stack as Midnight Ink (#09101c) → Slate Depth (#131d2f) → Graphite Plate (#3a4049) for elevation
- Use device mockups as the primary visual content — the product UI carries the page, not photography
- Alternate dark and light sections with 80px gaps to create breathing rhythm across the page

### Don't
- Don't use Status Violet (#7140fd) for buttons, links, or actions — it is brand-identity only (logo, gradients, decorative moments)
- Don't introduce shadows stronger than rgba(9,16,28,0.08) 0px 4px 20px — the system avoids heavy elevation
- Don't use lifestyle photography, stock imagery, or contextual scenes — device mockups and abstract gradients only
- Don't set body text above 16px or below 13px — the 15-16px range is the readable sweet spot
- Don't apply gradients to text — gradients are atmospheric backgrounds only
- Don't use saturated colors for icons in feature grids unless they represent a specific brand token (crypto symbol, etc.)
- Don't mix light and dark within a single section — section background must be uniform, transitions happen at section boundaries

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Midnight Ink | `#09101c` | Base page canvas, the near-black foundation of all dark sections |
| 1 | Slate Depth | `#131d2f` | First elevation tier — buttons, interactive containers, subtle card lift |
| 2 | Graphite Plate | `#3a4049` | Second elevation tier — card surfaces that need to read as lifted from the canvas |
| 3 | Paper | `#ffffff` | Inverted surface for light feature sections, maximum contrast moment |

## Elevation

- **Card (Product Showcase):** `rgba(9, 16, 28, 0.08) 0px 4px 20px 0px`
- **Link (Hover/Focus):** `rgba(9, 16, 28, 0.04) 0px 2px 20px 0px`

## Imagery

Product-first visual language: device mockups (phone, tablet, desktop) showing the Status wallet and messenger UI are the dominant imagery. The device IS the hero — no lifestyle photography, no people, no contextual scenes. Illustrations are expressive and surreal (e.g., a hand reaching through space for floating crypto coins) in a flat, line-art style with full color fills. Icons in feature grids are small (32-40px), flat, and multicolored — each representing a concept (security shield, megaphone, gift box). Background atmosphere comes from large radial gradient orbs in brand colors. No stock photography anywhere.

## Layout

Max-width 1200px centered container with 24px horizontal padding. Hero is full-bleed dark with centered text-left headline (88px display) and right-aligned device mockup that extends partially beyond the container. The page alternates between dark sections (#09101c) and light sections (#ffffff) with generous 80px vertical gaps. Feature sections use a 3-column grid with 40px gaps on light backgrounds. Product showcase sections are 2-column (text left, mockup right) with asymmetric device sizing. Navigation is a fixed top bar that transitions from transparent to Midnight Ink on scroll. The rhythm is: dark hero → light features → dark product → light features → dark illustration footer.

## Agent Prompt Guide

primary action: #2a4af5 (filled action)
Create a Primary Action Button: #2a4af5 background, #ffffff text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.

## Similar Brands

- **Phantom** — Same dark canvas + single violet/blue action accent + device mockup hero approach for crypto wallet identity
- **Rainbow Wallet** — Dark-mode product UI with gradient atmospheric backgrounds and device-first hero compositions
- **MetaMask** — Deep-near-black canvas, orange/violet brand accent, and product-mockup-dominant visual language for web3 audience
- **Element (Matrix)** — Encrypted-messaging aesthetic with midnight canvas, steel borders, and deliberate security-infrastructure surface language
- **Linear** — Same 4px-based comfortable spacing rhythm, pill-shaped controls, and tight Inter type scale at all sizes

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-midnight-ink: #09101c;
  --color-slate-depth: #131d2f;
  --color-steel-edge: #1b273d;
  --color-graphite-plate: #3a4049;
  --color-slate-mist: #647084;
  --color-ash-light: #a1abbd;
  --color-pale-mist: #dce0e5;
  --color-cloud: #f0f2f5;
  --color-paper: #ffffff;
  --color-signal-blue: #2a4af5;
  --color-status-violet: #7140fd;
  --color-deep-teal: #2a799b;
  --gradient-deep-teal: linear-gradient(78deg, rgb(42, 121, 155) -30%, rgb(246, 176, 60) 8%, rgb(255, 51, 163) 98%);
  --color-amber-glow: #f6b03c;

  /* Typography — Font Families */
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 16;
  --tracking-caption: -0.03px;
  --text-body-md: 16px;
  --leading-body-md: 23.5;
  --tracking-body-md: -0.08px;
  --text-subheading: 19px;
  --leading-subheading: 26.6;
  --tracking-subheading: -0.17px;
  --text-heading-sm: 27px;
  --leading-heading-sm: 32.1;
  --tracking-heading-sm: -0.43px;
  --text-heading: 64px;
  --leading-heading: 67.8;
  --tracking-heading: -1.28px;
  --text-display: 88px;
  --leading-display: 83.6;
  --tracking-display: -1.85px;

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
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-68: 68px;
  --spacing-80: 80px;
  --spacing-112: 112px;
  --spacing-120: 120px;
  --spacing-160: 160px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 24px;
  --element-gap: 8-16px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-3xl: 24px;
  --radius-full: 9999px;

  /* Named Radii */
  --radius-tags: 9999px;
  --radius-cards: 20px;
  --radius-pills: 9999px;
  --radius-images: 24px;
  --radius-buttons: 12px;

  /* Shadows */
  --shadow-lg: rgba(9, 16, 28, 0.08) 0px 4px 20px 0px;
  --shadow-lg-2: rgba(9, 16, 28, 0.04) 0px 2px 20px 0px;

  /* Surfaces */
  --surface-midnight-ink: #09101c;
  --surface-slate-depth: #131d2f;
  --surface-graphite-plate: #3a4049;
  --surface-paper: #ffffff;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-midnight-ink: #09101c;
  --color-slate-depth: #131d2f;
  --color-steel-edge: #1b273d;
  --color-graphite-plate: #3a4049;
  --color-slate-mist: #647084;
  --color-ash-light: #a1abbd;
  --color-pale-mist: #dce0e5;
  --color-cloud: #f0f2f5;
  --color-paper: #ffffff;
  --color-signal-blue: #2a4af5;
  --color-status-violet: #7140fd;
  --color-deep-teal: #2a799b;
  --color-amber-glow: #f6b03c;

  /* Typography */
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 16;
  --tracking-caption: -0.03px;
  --text-body-md: 16px;
  --leading-body-md: 23.5;
  --tracking-body-md: -0.08px;
  --text-subheading: 19px;
  --leading-subheading: 26.6;
  --tracking-subheading: -0.17px;
  --text-heading-sm: 27px;
  --leading-heading-sm: 32.1;
  --tracking-heading-sm: -0.43px;
  --text-heading: 64px;
  --leading-heading: 67.8;
  --tracking-heading: -1.28px;
  --text-display: 88px;
  --leading-display: 83.6;
  --tracking-display: -1.85px;

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
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-68: 68px;
  --spacing-80: 80px;
  --spacing-112: 112px;
  --spacing-120: 120px;
  --spacing-160: 160px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-3xl: 24px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-lg: rgba(9, 16, 28, 0.08) 0px 4px 20px 0px;
  --shadow-lg-2: rgba(9, 16, 28, 0.04) 0px 2px 20px 0px;
}
```
