# beehiiv — Style Reference
> midnight observatory with neon plasma

**Theme:** dark

beehiiv uses a midnight-canvas language: near-black surfaces with subtle violet undertones, tight geometric display type in Clash Grotesk, and a signature electric-indigo-to-hot-magenta gradient that injects energy into an otherwise restrained layout. The page behaves like a product launch site — dark always, with content cards floating on the dark canvas using thin violet borders and faint glows rather than heavy shadows. Satoshi carries all interface text with comfortable spacing, while Clash Grotesk delivers the headline voice at 60-72px with zero letter-spacing for confident geometric authority. Accent color appears sparingly: as a gradient on hero text, as a full-bleed highlight on one testimonial card, and as small chromatic icons — never as large filled buttons. Components are flat and precise, relying on border-weight and inner glow rather than elevation.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Abyss Ink | `#060419` | `--color-abyss-ink` | Page background, deepest surface — the void that everything floats on |
| Deep Violet | `linear-gradient(to right bottom, rgba(6, 4, 25, 0.4), rgba(47, 57, 186, 0.8))` | `--color-deep-violet` | Card and panel surfaces — one step lifted from the canvas; Atmospheric gradient overlay — blends canvas into indigo accent |
| Twilight Plum | `#141230` | `--color-twilight-plum` | Elevated surfaces, active nav backgrounds, deeper card variants |
| Dark Plum | `#1b0e27` | `--color-dark-plum` | Hover states, inset surface, tooltip backgrounds |
| Periwinkle | `#acb0e3` | `--color-periwinkle` | Hairline borders with violet glow, decorative dividers |
| Slate Violet | `#4e4e6c` | `--color-slate-violet` | Muted borders, subdued dividers between sections |
| Silver Lilac | `#b8b8c8` | `--color-silver-lilac` | Secondary text, icon strokes, subdued labels |
| Lavender Mist | `#c4c2d6` | `--color-lavender-mist` | Body text on dark surfaces, link text, standard icons |
| Ghost White | `#f7f5ff` | `--color-ghost-white` | Light supporting surface for subtle backgrounds and section separation. Do not promote it to the primary CTA color |
| Pure White | `#ffffff` | `--color-pure-white` | Light supporting surface for subtle backgrounds and section separation. Do not promote it to the primary CTA color |
| Electric Indigo | `linear-gradient(90deg, #2f39ba 0%, #ff5ec4 100%)` | `--color-electric-indigo` | Brand accent — highlight testimonial card, gradient origin, decorative icon strokes; Signature gradient on hero text, highlight overlays, and brand energy |
| Hot Magenta | `#ff5ec4` | `--color-hot-magenta` | Brand accent — gradient terminus, star icons, playful tag fills |
| Orchid Pink | `#f092dd` | `--color-orchid-pink` | Medium pink — decorative chip backgrounds, gradient midtones |
| Cotton Candy | `#ffc8eb` | `--color-cotton-candy` | Soft pink wash — subtle accent surfaces, decorative tags |

## Tokens — Typography

### Clash Grotesk — Display and hero headlines — geometric and tight; 72px hero with line-height 1.00 creates near-architectural blocks. Free alternative: Space Grotesk or Migra. · `--font-clash-grotesk`
- **Substitute:** Space Grotesk
- **Weights:** 400, 700
- **Sizes:** 16px, 20px, 48px, 60px, 72px
- **Line height:** 1.00–1.20
- **Letter spacing:** normal
- **Role:** Display and hero headlines — geometric and tight; 72px hero with line-height 1.00 creates near-architectural blocks. Free alternative: Space Grotesk or Migra.

### Satoshi — Body, UI, buttons, navigation, subheadings, and section headings up to 48px. The 0.045em tracking gives it a slightly airy, contemporary feel at smaller sizes. Free alternative: Inter or General Sans. · `--font-satoshi`
- **Substitute:** Inter
- **Weights:** 400, 500, 600, 700
- **Sizes:** 12px, 14px, 16px, 18px, 20px, 24px, 48px
- **Line height:** 1.20–1.56
- **Letter spacing:** 0.045em
- **Role:** Body, UI, buttons, navigation, subheadings, and section headings up to 48px. The 0.045em tracking gives it a slightly airy, contemporary feel at smaller sizes. Free alternative: Inter or General Sans.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.5 | 0.54px | `--text-caption` |
| body-sm | 14px | 1.43 | 0.63px | `--text-body-sm` |
| body | 16px | 1.5 | 0.72px | `--text-body` |
| subheading | 18px | 1.56 | 0.81px | `--text-subheading` |
| heading-sm | 20px | 1.4 | 0.9px | `--text-heading-sm` |
| heading | 24px | 1.33 | 1.08px | `--text-heading` |
| heading-lg | 48px | 1.2 | — | `--text-heading-lg` |
| display | 72px | 1 | — | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 8px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 8 | 8px | `--spacing-8` |
| 16 | 16px | `--spacing-16` |
| 24 | 24px | `--spacing-24` |
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 64 | 64px | `--spacing-64` |
| 96 | 96px | `--spacing-96` |
| 128 | 128px | `--spacing-128` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 6px |
| pills | 9999px |
| inputs | 6px |
| buttons | 6px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| md | `rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.1)...` | `--shadow-md` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 96px
- **Card padding:** 32px
- **Element gap:** 16px

## Components

### Navigation Bar
**Role:** Top-level site header

Full-width bar on #060419 canvas, height ~64px, 1200px max-width centered. Left: beehiiv wordmark + bee icon. Center: nav links (Platform, Solutions, Resources, Enterprise, Ad Network, Pricing) in Satoshi 14px weight 500 #c4c2d6. Right: Login text link, 'Get a demo' ghost button, 'Sign up for free' white-filled button. No shadow — relies on the dark canvas for separation.

### Filled White CTA Button
**Role:** Primary conversion action in nav

Background #ffffff, text #060419 weight 600 Satoshi 14px, padding 10px 20px, radius 6px. No shadow. Maximum contrast against the dark canvas — the brightest element on the page.

### Ghost Outlined Button
**Role:** Secondary CTA in nav

Transparent background, 1px solid #4e4e6c border, text #ffffff Satoshi 14px weight 500, padding 10px 20px, radius 6px. Becomes a subtle outlined pill against the dark canvas.

### Brand Accent Button
**Role:** Sign-up with Google or highlighted action

Background #2f39ba (Electric Indigo), white text, Satoshi 14px weight 600, padding 10px 20px, radius 6px, Google G icon to the left. The single chromatic filled button — used for the conversion-critical Google OAuth flow.

### Hero Display Headline
**Role:** Above-the-fold hero text

Clash Grotesk weight 700 at 72px, line-height 1.00, letter-spacing normal. White text for the main message, with the final key word rendered in the indigo-to-magenta linear-gradient. Three lines stacked tight, no max-width constraint on the gradient word.

### Hero Subtext
**Role:** Supporting paragraph below hero headline

Satoshi 18px weight 400, color #c4c2d6, line-height 1.56. Constrained to ~560px max-width, left-aligned.

### Social Proof Bar
**Role:** Trust indicator with star rating

5 gold/yellow star icons (decorative, fill approximate #f5b800) followed by Satoshi 14px #c4c2d6 text: '4.9/5 from 28,479 customers'. Small G2 and trust badges inline. Sits between hero subtext and CTA row.

### Feature Card (Dark Variant)
**Role:** Product feature showcase card

Background #0d0b28 with 1px solid #141230 border, radius 6px, padding 0 (image bleeds to edges with internal padding ~24px for text). Subtle inner glow: top-left corner has a faint #2f39ba 4px starburst accent. Contains product UI screenshot preview at top, then Satoshi 20px weight 600 white heading, Satoshi 14px #b8b8c8 description, and 'Learn more →' link in #c4c2d6.

### Testimonial Card (Default)
**Role:** Standard customer quote

Background transparent with 1px solid #4e4e6c border, radius 6px, padding 32px. Satoshi 18px weight 400 #ffffff quote text, 64px avatar circle (48px actual) at bottom-left, Satoshi 14px #ffffff name and Satoshi 12px #b8b8c8 role/title beneath.

### Testimonial Card (Highlighted)
**Role:** Featured customer quote with brand accent

Full bleed of the indigo-to-magenta linear-gradient as background, white Satoshi 18px quote text, TIME brand mark (red square with white text) where avatar would be, Satoshi 14px #ffffff name and Satoshi 12px rgba(255,255,255,0.7) role. The single card that breaks the monochrome rule — used to anchor social proof.

### Trust Logo Strip
**Role:** Publisher/client logos below hero

Full-width section on #060419, Satoshi 12px weight 500 uppercase letter-spacing 0.045em #b8b8c8 caption: 'TRUSTED BY THE WORLD'S TOP PUBLISHERS, CREATORS, AND BRANDS'. Below: row of monochrome white logos at ~60% opacity, evenly spaced, 80px height max.

### Floating Product Preview Card
**Role:** Decorative product UI element in hero

Background #0d0b28 with 1px #4e4e6c border, radius 6px, padding 12px. Contains miniature analytics widgets (number tiles, bar chart with violet/pink bars, line graph). Floats with slight tilt or offset positioning in the hero right zone. Pink and violet chart accents echo the brand gradient.

### Chat Widget
**Role:** Persistent floating chat bubble

Bottom-right fixed element, background #ffffff, radius 9999px (pill shape), Satoshi 14px weight 500 #060419 text 'Chatbot Assistant', small chat icon to the left, subtle shadow rgba(0,0,0,0.1).

## Do's and Don'ts

### Do
- Use Clash Grotesk weight 700 at 60-72px for display headlines with line-height 1.00 — the tight leading is signature
- Apply the linear-gradient(90deg, #2f39ba, #ff5ec4) only to single words or short phrases, not to body text or entire headlines
- Set all borders to 1px in #4e4e6c or #acb0e3; never use thicker borders on dark surfaces
- Use 6px radius for all cards, buttons, inputs, and panels; use 9999px only for the chat widget pill and star rating decorative elements
- Maintain #060419 as the universal page background; all cards lift to #0d0b28 or #141230 — never use a light card on the dark canvas
- Use Satoshi with its native 0.045em tracking for all text up to 24px; switch to Clash Grotesk with normal tracking for anything 48px and above
- Keep the Electric Indigo (#2f39ba) and Hot Magenta (#ff5ec4) as accent punctuation — icons, gradients, and one highlighted card per section

### Don't
- Do not introduce light-mode surfaces, white cards, or any background above #1b0e27 in luminance — the dark canvas is the identity
- Do not use filled colored buttons larger than the 14px Google OAuth button; the CTA system stays mostly white or ghost
- Do not apply shadows to navigation, headers, or section dividers — elevation only appears on floating product mockups and the chat widget
- Do not use a border-radius other than 6px for rectangular components; mixing 8px or 12px breaks the geometric precision
- Do not add images, lifestyle photography, or decorative illustration — the product UI collage IS the visual content
- Do not use the gradient on backgrounds larger than a single word or the one highlighted testimonial card; overuse kills the energy
- Do not use more than two font families — Clash Grotesk for display, Satoshi for everything else; no serif faces, no monospace

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Abyss Canvas | `#060419` | Page background — the dark void beneath everything |
| 1 | Deep Violet Panel | `#0d0b28` | Card and feature panel surfaces |
| 2 | Twilight Plum Surface | `#141230` | Elevated cards, active states, inset panels |
| 3 | Plasma Accent | `#2f39ba` | Highlight surface — featured testimonial card, accent CTAs |

## Elevation

- **Feature cards and product preview tiles:** `rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.1) 0px 4px 6px -4px`

## Imagery

The visual language is product-screenshot-first: the hero is dominated by an exploded-view product mockup showing analytics tiles, notification cards, growth charts, and a bar graph — all rendered in the brand's dark UI with pink and violet chart accents. Photography is absent; instead, the site uses 3D-stacked UI cards as its hero visual. Trust logos are monochrome white wordmarks. Avatars in testimonials are circular crops. The decorative visual energy comes from the indigo-to-magenta gradient applied to select words and the TIME card. Icons throughout are thin-stroke line icons in Lavender Mist (#c4c2d6) with consistent 1.5px stroke weight.

## Layout

Max-width 1200px centered with generous padding (24px sides on mobile, wider on desktop). The page flows as a single dark column from top to bottom. Hero is a 2-column split: left column with stacked headline + subtext + social proof + CTA row, right column with the floating product preview collage. Below the hero: a full-width trust logo strip. Then the feature section with a 3-column card grid (stacking to 1-column on mobile), each card a tall panel with preview image on top and text below. The testimonial section uses the same 3-column grid pattern. Section gaps are 96px creating a confident vertical rhythm. The overall density is spacious — each section gets to breathe, and the dark canvas unifies the whole experience.

## Agent Prompt Guide

**Quick Color Reference**
- background: #060419
- card surface: #0d0b28
- elevated surface: #141230
- text primary: #ffffff
- text secondary: #c4c2d6
- border: #4e4e6c
- accent: #2f39ba
- gradient accent: linear-gradient(90deg, #2f39ba, #ff5ec4)
- primary action: no distinct CTA color

**Example Component Prompts**
1. *Navigation bar*: 1200px max-width centered, #060419 background, 64px height. Left: white wordmark. Center: nav links in Satoshi 14px weight 500 #c4c2d6. Right: ghost outlined button (1px #4e4e6c border, 6px radius, Satoshi 14px weight 500 white text) beside a white-filled button (#ffffff bg, #060419 text, 6px radius, Satoshi 14px weight 600).

2. *Hero headline*: Clash Grotesk weight 700 at 72px, line-height 1.00, white. Final word rendered with background: linear-gradient(90deg, #2f39ba, #ff5ec4), -webkit-background-clip: text, color: transparent. Three lines, left-aligned.

3. *Feature card*: Background #0d0b28, 1px solid #141230 border, 6px radius. Top 60% is a product UI mockup area with internal padding. Bottom 40%: Satoshi 20px weight 600 white heading, then Satoshi 14px #b8b8c8 body text, then 'Learn more →' link in #c4c2d6.

4. *Highlighted testimonial card*: Full background linear-gradient(90deg, #2f39ba, #ff5ec4), 6px radius, 32px padding. White Satoshi 18px quote text. Bottom-left: brand logo square (48px) and Satoshi 14px #ffffff name with Satoshi 12px rgba(255,255,255,0.7) role.

5. *Chat widget*: Fixed bottom-right, background #ffffff, radius 9999px, padding 12px 20px, Satoshi 14px weight 500 #060419 text 'Chatbot Assistant' with a small chat icon left, shadow: rgba(0,0,0,0.1) 0px 10px 15px -3px.

## Similar Brands

- **Linear** — Same dark-canvas product showcase with thin geometric borders, minimal shadows, and a single chromatic accent color for interactive states
- **Vercel** — Dark hero with massive condensed display type, monochromatic interface, and accent gradient on highlight elements only
- **Framer** — Dark-first product page with floating UI mockup collage in the hero, geometric display font, and restrained accent color usage
- **Substack** — Same creator/publisher audience and dark editorial product aesthetic, with confident headline type and minimal interface chrome

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-abyss-ink: #060419;
  --color-deep-violet: #0d0b28;
  --gradient-deep-violet: linear-gradient(to right bottom, rgba(6, 4, 25, 0.4), rgba(47, 57, 186, 0.8));
  --color-twilight-plum: #141230;
  --color-dark-plum: #1b0e27;
  --color-periwinkle: #acb0e3;
  --color-slate-violet: #4e4e6c;
  --color-silver-lilac: #b8b8c8;
  --color-lavender-mist: #c4c2d6;
  --color-ghost-white: #f7f5ff;
  --color-pure-white: #ffffff;
  --color-electric-indigo: #2f39ba;
  --gradient-electric-indigo: linear-gradient(90deg, #2f39ba 0%, #ff5ec4 100%);
  --color-hot-magenta: #ff5ec4;
  --color-orchid-pink: #f092dd;
  --color-cotton-candy: #ffc8eb;

  /* Typography — Font Families */
  --font-clash-grotesk: 'Clash Grotesk', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-satoshi: 'Satoshi', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --tracking-caption: 0.54px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.43;
  --tracking-body-sm: 0.63px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: 0.72px;
  --text-subheading: 18px;
  --leading-subheading: 1.56;
  --tracking-subheading: 0.81px;
  --text-heading-sm: 20px;
  --leading-heading-sm: 1.4;
  --tracking-heading-sm: 0.9px;
  --text-heading: 24px;
  --leading-heading: 1.33;
  --tracking-heading: 1.08px;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.2;
  --text-display: 72px;
  --leading-display: 1;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 8px;
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-96: 96px;
  --spacing-128: 128px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 96px;
  --card-padding: 32px;
  --element-gap: 16px;

  /* Border Radius */
  --radius-md: 6px;
  --radius-xl: 12px;
  --radius-full: 9999px;

  /* Named Radii */
  --radius-cards: 6px;
  --radius-pills: 9999px;
  --radius-inputs: 6px;
  --radius-buttons: 6px;

  /* Shadows */
  --shadow-md: rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.1) 0px 4px 6px -4px;

  /* Surfaces */
  --surface-abyss-canvas: #060419;
  --surface-deep-violet-panel: #0d0b28;
  --surface-twilight-plum-surface: #141230;
  --surface-plasma-accent: #2f39ba;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-abyss-ink: #060419;
  --color-deep-violet: #0d0b28;
  --color-twilight-plum: #141230;
  --color-dark-plum: #1b0e27;
  --color-periwinkle: #acb0e3;
  --color-slate-violet: #4e4e6c;
  --color-silver-lilac: #b8b8c8;
  --color-lavender-mist: #c4c2d6;
  --color-ghost-white: #f7f5ff;
  --color-pure-white: #ffffff;
  --color-electric-indigo: #2f39ba;
  --color-hot-magenta: #ff5ec4;
  --color-orchid-pink: #f092dd;
  --color-cotton-candy: #ffc8eb;

  /* Typography */
  --font-clash-grotesk: 'Clash Grotesk', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-satoshi: 'Satoshi', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --tracking-caption: 0.54px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.43;
  --tracking-body-sm: 0.63px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: 0.72px;
  --text-subheading: 18px;
  --leading-subheading: 1.56;
  --tracking-subheading: 0.81px;
  --text-heading-sm: 20px;
  --leading-heading-sm: 1.4;
  --tracking-heading-sm: 0.9px;
  --text-heading: 24px;
  --leading-heading: 1.33;
  --tracking-heading: 1.08px;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.2;
  --text-display: 72px;
  --leading-display: 1;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-96: 96px;
  --spacing-128: 128px;

  /* Border Radius */
  --radius-md: 6px;
  --radius-xl: 12px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-md: rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.1) 0px 4px 6px -4px;
}
```
