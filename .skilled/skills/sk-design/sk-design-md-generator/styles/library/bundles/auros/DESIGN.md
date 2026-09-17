# Auros — Style Reference
> Abyssal terminal with bioluminescent data orbs

**Theme:** dark

Auros operates as an abyssal fintech terminal: near-black teal canvas with bioluminescent data orbs and teal-to-pink light gradients that suggest depth, liquidity, and flow. The interface is sparse and cinematic, relying on a single custom display face (Matter) at medium weight with aggressive negative tracking to create scale without shouting. Color is rationed — achromatic whites and silvers carry almost all content, while the chromatic palette is reserved for atmospheric gradients, card surface differentiation, and one signature pill button that morphs from teal-cyan to lavender-pink. Cards float on subtle teal-tinted surface lifts (16px radius, no shadows) rather than using elevation, so the hierarchy reads as depth-of-water rather than shadow-on-paper. Components feel engineered and instrument-like: uppercase tracked labels, thin geometric arrow icons, large numerical stats in pale pink.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Liquid Abyss | `#012624` | `--color-liquid-abyss` | Primary canvas — page background, header, hero, and the dominant dark-teal field. Establishes the deep-water atmosphere |
| Liquid Deep | `#011d1c` | `--color-liquid-deep` | Recessed surface level — footer background and deeper card panels. Reads as a half-step darker than the canvas, creating a subtle depth gradient downward |
| Liquid Kelp | `#003734` | `--color-liquid-kelp` | Raised card surface and primary button fill — the lifted surface that sits one step above the abyss. Used for feature cards, content panels, and the gradient button's origin point |
| Liquid Mist | `#edfffe` | `--color-liquid-mist` | Cool-tinted off-white for emphasized body text, section labels, and warm-light typographic moments. Carries a barely-perceptible cyan whisper that ties body text to the teal atmosphere |
| Platinum | `#ffffff` | `--color-platinum` | Pure white for headings, nav items, icon strokes, and high-contrast text. The dominant text color across all heading levels and the primary nav |
| Silver Mist | `#bbc7c6` | `--color-silver-mist` | Secondary body text, muted descriptions, and link color in resting state. Carries a faint green undertone that harmonizes with the teal canvas |
| Ash | `#f2f2f2` | `--color-ash` | Tertiary text for pull-quotes and testimonial copy. A neutral cool-gray fallback when Silver Mist's teal undertone is too colored |
| Slate Deep | `#707777` | `--color-slate-deep` | Subtle surface tint for inactive or low-emphasis backgrounds. Sits between canvas and card for very low-elevation differentiation |
| Lavender Phosphor | `#fde9ff` | `--color-lavender-phosphor` | Highlight color for large statistics, counter numbers, and emphasis figures. The pink end of the signature gradient — used sparingly as luminous punctuation on dark surfaces |
| Bioluminescent Gradient | `linear-gradient(90deg, rgb(0, 130, 124) 0%, rgb(203, 255, 252) 100%)` | `--color-bioluminescent-gradient` | Signature button and UI gradient — linear sweep from teal-cyan through pale aqua into lavender-pink. The brand's signature chromatic gesture |
| Aurora Gradient | `linear-gradient(90deg, rgb(203, 255, 252) 0%, rgb(237, 255, 254) 26.25%, rgb(255, 253, 250) 47.57%, rgb(250, 209, 255) 88.96%)` | `--color-aurora-gradient` | Supporting palette color for small decorative accents when the core palette needs contrast. |

## Tokens — Typography

### Matter — Primary display and body face — used at weight 500 for all headings (H1–H3) and oversized kinetic text (86–295px). Weight 400 for body and UI copy. Characterized by aggressive negative tracking on large sizes (-0.04em at 61px, -0.046em at 86px) and wide positive tracking on uppercase labels (0.08em at 20px, 0.12em at 12px, 0.15em at 10px). The medium-weight-only heading strategy is distinctive — no bold, no light — giving the type a uniform mechanical confidence. · `--font-matter`
- **Substitute:** Inter, DM Sans, or Satoshi for close geometric-grotesk match
- **Weights:** 400, 500
- **Sizes:** 10, 12, 13, 14, 16, 20, 24, 36, 61, 86, 96, 295px
- **Line height:** 1.0, 1.3, 1.4, 1.5
- **Letter spacing:** -0.046em at 86px, -0.04em at 61px, -0.02em at 24px, 0.08em uppercase at 20px, 0.12em uppercase at 12px, 0.15em uppercase at 10px
- **Role:** Primary display and body face — used at weight 500 for all headings (H1–H3) and oversized kinetic text (86–295px). Weight 400 for body and UI copy. Characterized by aggressive negative tracking on large sizes (-0.04em at 61px, -0.046em at 86px) and wide positive tracking on uppercase labels (0.08em at 20px, 0.12em at 12px, 0.15em at 10px). The medium-weight-only heading strategy is distinctive — no bold, no light — giving the type a uniform mechanical confidence.

### Arial — Secondary fallback for interactive UI elements (nav, buttons, hero micro-copy, footer). Only appears at 14px — used as a safe generic fallback where Matter isn't loaded, covering form labels, button text, and small utility copy. · `--font-arial`
- **Substitute:** system-ui, -apple-system, sans-serif
- **Weights:** 400
- **Sizes:** 14px
- **Line height:** 1.43
- **Role:** Secondary fallback for interactive UI elements (nav, buttons, hero micro-copy, footer). Only appears at 14px — used as a safe generic fallback where Matter isn't loaded, covering form labels, button text, and small utility copy.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 10px | 1.4 | 1.5px | `--text-caption` |
| body | 16px | 1.4 | — | `--text-body` |
| subheading | 24px | 1.3 | -0.48px | `--text-subheading` |
| heading | 36px | 1 | — | `--text-heading` |
| heading-lg | 61px | 1 | -2.44px | `--text-heading-lg` |
| display | 96px | 1 | -3.84px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** spacious

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 12 | 12px | `--spacing-12` |
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 28 | 28px | `--spacing-28` |
| 32 | 32px | `--spacing-32` |
| 36 | 36px | `--spacing-36` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |
| 120 | 120px | `--spacing-120` |
| 140 | 140px | `--spacing-140` |
| 160 | 160px | `--spacing-160` |
| 164 | 164px | `--spacing-164` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 16px |
| small | 6px |
| buttons | 6px |

### Layout

- **Page max-width:** 1440px
- **Section gap:** 68px
- **Card padding:** 36-48px
- **Element gap:** 20px

## Components

### Gradient Pill Button
**Role:** Primary CTA

Filled button with the aurora gradient background (cyan → white → pink). 6px border-radius, 32px vertical padding, 22px horizontal padding. Text in dark color (#222222) at 14px Arial, uppercase. Used for the most important action on each section. The gradient direction is horizontal, creating a sunrise effect.

### Ghost Navigation Link
**Role:** Nav item

Transparent background, no border, uppercase text at 12px Matter weight 400 with 0.12em letter-spacing. White color in active state, silver (#bbc7c6) for inactive. No padding — sits inline with tight 16px column-gap between items.

### Surface Card
**Role:** Content container

Card with #003734 (Liquid Kelp) background, 16px border-radius, 36px padding all sides. No shadow, no border. Headings at 36px Matter 500 white, body at 16px Matter 400 silver. Used for feature blocks and content panels on the Explore section.

### Recessed Card
**Role:** Deep content panel

Card with #011d1c (Liquid Deep) background, 16px border-radius, 120px vertical padding. Creates a sunken well effect — the deepest UI surface, used for footer-adjacent content blocks and call-to-action panels with maximum breathing room.

### Feature Row Card
**Role:** Service listing

Transparent background card with 16px radius and 48px vertical / 36px horizontal padding. Contains a heading, body description, and a small square arrow icon button (32×32, 6px radius, dark teal fill with white arrow). Used for the three service divisions (Proprietary Trading, Liquidity Solutions, Careers) in the Explore section.

### Arrow Icon Button
**Role:** Inline link trigger

32×32 square button, 6px border-radius, semi-transparent dark teal fill (rgba(3, 81, 75, 0.5)). Contains a white diagonal arrow (↗) icon. Always positioned to the right of a card title as a 'go to' trigger.

### Uppercase Section Label
**Role:** Eyebrow / kicker

12px or 20px Matter weight 500, uppercase, letter-spacing 0.08–0.12em, silver (#bbc7c6) or mist (#edfffe) color. Appears above section headings as a categorical label (e.g. 'AUROS', 'EXPLORE'). Wide tracking is signature — it reads as technical instrumentation labeling.

### Hero Headline
**Role:** Page-level title

61–96px Matter weight 500, line-height 1.0, letter-spacing -0.04em, white. Fluid sizing via clamp(2.5rem, ..., 3.8rem) for H1 and clamp(2.1rem, ..., 3rem) for H2. Tight tracking compensates for the geometric letterforms at scale.

### Oversized Kinetic Text
**Role:** Section-spanning display

86–295px Matter weight 500 at line-height 1.0, letter-spacing -0.046em. Used for massive section markers (the 'We D' text visible in the particle sphere section). The extreme size creates a kinetic, almost physical presence — text as environmental element.

### Statistic Counter
**Role:** Metric display

Large number in lavender-phosphor pink (#fde9ff) with label below in mist (#edfffe) or silver at 13px uppercase tracked. The pink-on-teal combination is the signature emphasis treatment — statistics glow against the dark canvas.

### Navigation Bar
**Role:** Site header

Full-width header, transparent background, ~80px height. Logo (Auros wordmark + mark) left, nav links centered, CTA button right. 6px radius on the CTA. Items separated by 16–24px gaps.

### Geometric Molecule Illustration
**Role:** Decorative graphic

Flat geometric pattern of circles and connector shapes in silver/white, positioned as right-column decoration in the Explore section. No fill complexity — just white circles and thin connector lines forming an abstract molecular/network diagram.

### Particle Sphere Visual
**Role:** Hero animation

3D particle sphere rendered in teal-cyan and white dots, rotating in the hero or section transition. The particles pick up the canvas teal and the accent pink, creating a bioluminescent data orb effect. Functions as a brand-defining visual element.

## Do's and Don'ts

### Do
- Use only the teal-green surface stack (#011d1c → #012624 → #003734) for background differentiation — never introduce gray, black, or blue surfaces
- Reserve the aurora gradient exclusively for primary CTAs and signature accent moments — never as a background fill or decoration
- Set all headings at Matter weight 500 — no bold, no light, no other weights at display sizes
- Apply uppercase tracking (0.08–0.15em) to all section labels, kickers, and eyebrow text at 10–20px
- Use lavender-phosphor pink (#fde9ff) only for large statistics and emphasis figures — never for body text or UI controls
- Keep card radii at 16px and small element radii at 6px — these two values are the complete shape vocabulary
- Use line-height 1.0 for all display text above 36px and line-height 1.4 for all body text — the contrast defines the typographic rhythm

### Don't
- Do not use drop shadows or box-shadows for elevation — differentiation comes from surface color shifts in the teal stack, not shadow
- Do not introduce bold (600+) or light (300-) weights at display sizes — the medium-only strategy is core to the mechanical confidence
- Do not use white (#ffffff) for body text — reserve pure white for headings and nav, use silver (#bbc7c6) or mist (#edfffe) for body
- Do not apply the aurora gradient to text, borders, or backgrounds larger than a single button — it loses luminosity at scale
- Do not use rounded corners above 16px — the system is sharp-rounded, not pill-shaped (buttons are 6px, cards are 16px)
- Do not place light text on light-pink (#fde9ff) — the pink is a background for dark text, not a text color on dark surfaces
- Do not use any color outside the Liquid teal scale, silver neutrals, and lavender-phosphor accent — the palette is rationed and deliberate

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Liquid Abyss | `#012624` | Page canvas — the dominant background field. All content floats on this. |
| 1 | Liquid Deep | `#011d1c` | Recessed surface — footer and very deep panels that sink below the canvas. |
| 2 | Liquid Kelp | `#003734` | Raised card surface — content cards, feature panels, and the lifted UI layer. |
| 3 | Slate Deep | `#707777` | Low-emphasis surface tint for inactive states and subtle differentiation. |

## Elevation

The design deliberately avoids drop shadows. Depth is communicated through a teal-tinted surface stack (abyss → deep → kelp) where each level is a darker or lighter step in the same green hue. This creates the sensation of objects floating at different depths in water rather than being raised off paper. The absence of shadows reinforces the dark, instrument-panel atmosphere and prevents visual noise in a interface that relies on color and scale for hierarchy.

## Imagery

Imagery is minimal and atmospheric. The hero features a 3D particle sphere — thousands of small teal-cyan and white dots forming a rotating orb that picks up the canvas color and the lavender-pink accent at its edges, creating a bioluminescent data-entity effect. Section decorations include flat geometric molecular diagrams (white circles and thin connector lines on the dark canvas) used as right-column balancing elements. No photography, no lifestyle imagery, no people — the visual language is pure data-graphics and abstract forms. The particle sphere is the defining brand mark visual; it should appear at least once on any major page to anchor the deep-water metaphor.

## Layout

Full-bleed dark canvas with max-width 1440px content. Hero is a centered text stack (eyebrow → headline → subtext → CTA) occupying the full viewport height, with the particle sphere as a background element. Sections are full-width bands separated by generous 68px+ vertical gaps, alternating between canvas and slightly recessed surfaces. The Explore section uses an asymmetric two-column layout: left column is stacked feature cards, right column holds the geometric molecular illustration. Content is centered in narrow columns (max ~600px) for readability rather than stretching edge-to-edge. The footer is a recessed well (#011d1c) with 120px vertical padding, creating a deep-pool effect. Navigation is a thin transparent bar with items spaced at 16–24px gaps. The overall rhythm is cinematic and spacious — each section breathes, and the deep-water color scheme makes every gap feel like falling deeper.

## Agent Prompt Guide

**Quick Color Reference**
- Text (primary): #ffffff
- Text (body/secondary): #bbc7c6
- Text (emphasis/mist): #edfffe
- Background (canvas): #012624
- Border: #707777 or rgba(255,255,255,0.1)
- Accent (stats/highlights): #fde9ff
- primary action: #003734 (filled action)

**Example Component Prompts**

1. Create a Primary Action Button: #003734 background, #ffffff text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.

2. **Create a feature card:** Background #003734, 16px radius, 36px padding. Heading at 36px Matter 500 #ffffff, line-height 1.0. Body at 16px Matter 400 #bbc7c6. Arrow icon button (32×32, 6px radius, rgba(3,81,75,0.5) fill) positioned top-right with white ↗ icon.

3. **Create a statistics block:** Three columns. Large number (e.g. '$18.21B') at 86px Matter 500 #fde9ff, line-height 1.0, letter-spacing -3.96px. Label below at 13px Matter 400, uppercase, 0.055em letter-spacing, #edfffe.


## Similar Brands

- **Wintermute** — Same dark teal-black crypto-native palette with white text, generous spacing, and minimal decoration — both feel like trading-terminal instrument panels rather than marketing sites
- **Jump Crypto** — Dark mode institutional crypto aesthetic with uppercase tracked labels, medium-weight display type, and a single restrained accent color — both prioritize data-readability over visual spectacle
- **Galaxy Digital** — Deep dark canvas with luminous accent moments, spacious section rhythm, and a focus on scale through type rather than imagery — similar cinematic financial-institution atmosphere
- **Flowdesk** — Dark teal-dominant palette with gradient accent buttons, geometric decorative elements, and medium-weight geometric type — shares the bioluminescent fintech-terminal sensibility

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-liquid-abyss: #012624;
  --color-liquid-deep: #011d1c;
  --color-liquid-kelp: #003734;
  --color-liquid-mist: #edfffe;
  --color-platinum: #ffffff;
  --color-silver-mist: #bbc7c6;
  --color-ash: #f2f2f2;
  --color-slate-deep: #707777;
  --color-lavender-phosphor: #fde9ff;
  --color-bioluminescent-gradient: #00827c;
  --gradient-bioluminescent-gradient: linear-gradient(90deg, rgb(0, 130, 124) 0%, rgb(203, 255, 252) 100%);
  --color-aurora-gradient: #cbfffc;
  --gradient-aurora-gradient: linear-gradient(90deg, rgb(203, 255, 252) 0%, rgb(237, 255, 254) 26.25%, rgb(255, 253, 250) 47.57%, rgb(250, 209, 255) 88.96%);

  /* Typography — Font Families */
  --font-matter: 'Matter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.4;
  --tracking-caption: 1.5px;
  --text-body: 16px;
  --leading-body: 1.4;
  --text-subheading: 24px;
  --leading-subheading: 1.3;
  --tracking-subheading: -0.48px;
  --text-heading: 36px;
  --leading-heading: 1;
  --text-heading-lg: 61px;
  --leading-heading-lg: 1;
  --tracking-heading-lg: -2.44px;
  --text-display: 96px;
  --leading-display: 1;
  --tracking-display: -3.84px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-120: 120px;
  --spacing-140: 140px;
  --spacing-160: 160px;
  --spacing-164: 164px;

  /* Layout */
  --page-max-width: 1440px;
  --section-gap: 68px;
  --card-padding: 36-48px;
  --element-gap: 20px;

  /* Border Radius */
  --radius-md: 6px;
  --radius-xl: 12px;
  --radius-2xl: 16px;

  /* Named Radii */
  --radius-cards: 16px;
  --radius-small: 6px;
  --radius-buttons: 6px;

  /* Surfaces */
  --surface-liquid-abyss: #012624;
  --surface-liquid-deep: #011d1c;
  --surface-liquid-kelp: #003734;
  --surface-slate-deep: #707777;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-liquid-abyss: #012624;
  --color-liquid-deep: #011d1c;
  --color-liquid-kelp: #003734;
  --color-liquid-mist: #edfffe;
  --color-platinum: #ffffff;
  --color-silver-mist: #bbc7c6;
  --color-ash: #f2f2f2;
  --color-slate-deep: #707777;
  --color-lavender-phosphor: #fde9ff;
  --color-bioluminescent-gradient: #00827c;
  --color-aurora-gradient: #cbfffc;

  /* Typography */
  --font-matter: 'Matter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.4;
  --tracking-caption: 1.5px;
  --text-body: 16px;
  --leading-body: 1.4;
  --text-subheading: 24px;
  --leading-subheading: 1.3;
  --tracking-subheading: -0.48px;
  --text-heading: 36px;
  --leading-heading: 1;
  --text-heading-lg: 61px;
  --leading-heading-lg: 1;
  --tracking-heading-lg: -2.44px;
  --text-display: 96px;
  --leading-display: 1;
  --tracking-display: -3.84px;

  /* Spacing */
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-120: 120px;
  --spacing-140: 140px;
  --spacing-160: 160px;
  --spacing-164: 164px;

  /* Border Radius */
  --radius-md: 6px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
}
```
