# Safepal — Style Reference
> Electric violet cosmos with mint stars. SafPal lives in a deep indigo night where the only warmth is a neon mint accent and a single violet that burns like a signal flare.

**Theme:** dark

SafePal speaks in a cosmic violet vernacular: deep indigo canvases recede into atmospheric space while mint-green punctuation snaps focus back to the surface. The visual system rides on a vivid electric violet (#4a21ef) that saturates mid-page sections, paired with a luminous mint (#79efbd) that functions as the sole chromatic accent for headings, tags, and outlined action borders. Typography is monumental and assertive — the display headline at 80px with weight 800 demands ownership of the viewport, while body copy sits at a calm 16px. The 100px pill radius on buttons is the most recognizable shape signature, creating a soft contrast against the 24px card radius and the angular isometric illustrations of hardware wallets and phones that float in deep space. Surfaces stack from white cards over violet fields, with almost no shadows — depth is communicated through color contrast and illustrative floating elements rather than elevation.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Signal Violet | `linear-gradient(154.24deg, rgb(191, 255, 228) 11.19%, rgb(74, 33, 239) 62.38%)` | `--color-signal-violet` | Page backgrounds, section bands, gradient anchor — the dominant chromatic field that defines brand presence across mid-page sections; Hero atmospheric gradient bridging mint into violet — sets the cosmic mood |
| Mint Pulse | `#79efbd` | `--color-mint-pulse` | Headline text on violet fields, outlined action borders, pill button fills, accent highlights — the sole warm punctuation against the cool violet |
| Terminal Green | `#18d26e` | `--color-terminal-green` | Green accent for outlined action borders, linked labels, and lightweight interactive emphasis. Use as a supporting accent, not as a status color |
| Deep Indigo | `linear-gradient(124.15deg, rgb(13, 11, 51) 0%, rgb(75, 62, 211) 218.07%)` | `--color-deep-indigo` | Hero background, darkest surface layer, text on light surfaces, gradient terminus; Dark section backgrounds, depth gradient behind illustrations |
| Carbon | `#1d1d1d` | `--color-carbon` | Body text, heading text on light surfaces, high-contrast typography color |
| Lavender Mist | `#f7f6ff` | `--color-lavender-mist` | Light card surfaces, subtle tints, nav backgrounds, gentle surface lift over white |
| Paper White | `#ffffff` | `--color-paper-white` | Card surfaces, text on dark backgrounds, footer surfaces, badge fills |
| Steel Gray | `#666666` | `--color-steel-gray` | Muted body text, secondary labels, dividers, icon strokes at rest |

## Tokens — Typography

### AlibabaPuHuiTi-2 — All interface text — custom geometric sans with extreme weight range. Display uses 800 for assertive headlines; body sits at 400 with comfortable 1.5+ line-height. The 137px size enables wall-scale hero typography. Heavy weights (800–1000) are used sparingly to avoid visual fatigue. · `--font-alibabapuhuiti-2`
- **Substitute:** Inter, DM Sans, or Poppins at matching weights
- **Weights:** 400, 700, 800, 900, 1000
- **Sizes:** 12px, 14px, 16px, 18px, 24px, 32px, 48px, 80px, 137px
- **Line height:** 1.00–1.60
- **Role:** All interface text — custom geometric sans with extreme weight range. Display uses 800 for assertive headlines; body sits at 400 with comfortable 1.5+ line-height. The 137px size enables wall-scale hero typography. Heavy weights (800–1000) are used sparingly to avoid visual fatigue.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.5 | — | `--text-caption` |
| body-sm | 14px | 1.5 | — | `--text-body-sm` |
| body | 16px | 1.57 | — | `--text-body` |
| subheading | 18px | 1.56 | — | `--text-subheading` |
| heading-sm | 24px | 1.5 | — | `--text-heading-sm` |
| heading | 32px | 1.2 | — | `--text-heading` |
| heading-lg | 48px | 1.17 | — | `--text-heading-lg` |
| display | 80px | 1 | — | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 12 | 12px | `--spacing-12` |
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 32 | 32px | `--spacing-32` |
| 36 | 36px | `--spacing-36` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 80 | 80px | `--spacing-80` |
| 100 | 100px | `--spacing-100` |
| 160 | 160px | `--spacing-160` |
| 180 | 180px | `--spacing-180` |
| 200 | 200px | `--spacing-200` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 12px |
| cards | 24px |
| other | 48px |
| buttons | 100px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80-113px
- **Card padding:** 24px
- **Element gap:** 12-16px

## Components

### Pill Primary Button
**Role:** Main call-to-action

Fully rounded 100px radius, mint (#79efbd) fill, Deep Indigo (#0d0b33) text, weight 700, 16px size, 12px 24px padding. The pill shape is the most recognizable interaction element.

### Pill Ghost Button
**Role:** Secondary or navigation action

100px radius, transparent or white fill, mint (#79efbd) border at 1-2px, white or mint text. Used for download CTAs in nav.

### Hero Headline
**Role:** Display-level section heading

80px size, weight 800, white or Deep Indigo text depending on field, line-height 1.0. Sets the monumental, ownership-staking tone of the brand.

### Section Heading
**Role:** Mid-page section title

48px size, weight 800, white text on violet or mint text on dark. Centered alignment with generous above-spacing.

### Wallet Card
**Role:** Product showcase card

24px radius, white (#ffffff) fill, no visible shadow, 24px padding. Contains product imagery with floating illustration treatment.

### Testimonial Card
**Role:** Social proof card

24px radius, white fill, 24-32px padding, no border, no shadow. Contains quote text, avatar circle, and attribution with role label.

### Navigation Bar
**Role:** Top-level site navigation

Transparent over hero, white surface on scroll. 12px radius on dropdown elements. Logo left, links centered, language selector and pill download button right.

### Announcement Bar
**Role:** Site-wide news strip

Violet (#4a21ef) fill, white text, centered, thin height. Link text underlined with mint accent.

### Isometric Illustration Set
**Role:** Decorative hero and section visuals

Angular isometric renders of hardware wallets, phones, and crypto objects. Deep indigo outlines with mint and white fills. Float in space at varied scales with no ground plane.

### Feature Card
**Role:** Product feature highlight

24px radius, lavender (#f7f6ff) or white fill, generous padding, icon at top, heading + body text below. Minimal decoration.

### Badge Tag
**Role:** Category or status label

Pill or 12px radius, mint fill with dark text, small 12px size, 4-8px padding. Used for token tags and status indicators.

### Footer Surface
**Role:** Bottom site navigation

White or dark surface, multi-column link grid, logo, social icons. Generous 48-64px padding top and bottom.

## Do's and Don'ts

### Do
- Use 100px border-radius on all buttons and tags — the pill shape is the system's most recognizable signature
- Set hero headlines at 80px weight 800 in white over Deep Indigo (#0d0b33) or mint (#79efbd) over violet — never dilute the display weight below 700
- Use #4a21ef as the dominant mid-page section background — let violet breathe across large vertical bands rather than appearing as small accents
- Pair mint (#79efbd) exclusively as accent text or outlined actions on violet fields — mint should never appear on white surfaces as a fill
- Maintain 80-113px between major sections to preserve the cosmic spaciousness — dense stacking breaks the atmospheric rhythm
- Use isometric illustrations of wallet hardware and phones as floating objects in space, not grounded product shots
- Keep all surfaces shadowless — communicate depth through color contrast and illustration layering only
- Center-align section headings and hero text — asymmetric layouts break the poster-like clarity

### Don't
- Never use #4a21ef as a small accent — it must dominate sections or not appear
- Do not apply drop shadows to cards or buttons — the system is flat by design
- Avoid body text below 14px — the scale starts at 12px for captions only
- Never use the mint (#79efbd) as a large background fill for content sections — reserve it for accents and pill buttons
- Do not mix multiple gradient directions in one screen — each gradient should anchor one atmospheric moment
- Avoid outlined rectangular buttons — all interactive elements must use 100px pill radius
- Do not place white text on #f7f6ff — the contrast fails at that combination
- Never use weight 400 for headlines — the system demands 700+ for any heading level

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Cosmic Canvas | `#0d0b33` | Hero and dark section base — deepest surface |
| 1 | Signal Field | `#4a21ef` | Primary brand section backgrounds — mid-page bands |
| 2 | Mint Accent | `#79efbd` | Highlight surfaces, pill button fills, accent zones |
| 3 | Lavender Lift | `#f7f6ff` | Subtle card tint over white |
| 4 | Paper | `#ffffff` | Top-level card and content surfaces |

## Elevation

Elevation is communicated through color contrast and floating isometric illustrations rather than drop shadows. Surfaces separate by hue and saturation step — white cards sit on violet fields, mint pills sit on indigo — with no visible shadow stacks. This flat-elevation approach keeps the visual system graphic and poster-like.

## Imagery

Illustration-driven with strong isometric perspective. Hardware wallets, smartphones, and crypto coins are rendered as angular 3D objects with deep indigo outlines, white faces, and mint-green accent details. Objects float in space without ground planes, scattered at varied scales and rotations. No photography of people or environments. The treatment is graphic-poster style — think vector illustration meets product render. Sparkle marks and small star shapes add cosmic atmosphere around larger objects. Decorative purple gradient orbs appear behind some compositions to add depth.

## Layout

Full-bleed sections with no max-width constraint on backgrounds — only text and content containers are constrained to ~1200px. Hero is dark with centered headline over isometric illustration cluster. Mid-page sections alternate between solid violet (#4a21ef) bands and lighter treatments with centered headings. Card grids are 3-column for testimonials and product showcases, with generous gutters (24-32px). Navigation is a fixed top bar with transparent-on-hero behavior. Sections flow seamlessly with no visible dividers — transitions are marked by color field changes. Content rhythm is spacious: 80-113px between sections creates breathing room for the cosmic atmosphere.

## Agent Prompt Guide

## Quick Color Reference
- background (dark): #0d0b33
- background (brand): #4a21ef
- surface (light): #ffffff
- accent/text on violet: #79efbd
- body text: #1d1d1d
- primary action: #79efbd (filled action)

## Example Component Prompts

1. **Hero Section**: Full-bleed Deep Indigo (#0d0b33) background. Centered headline at 80px AlibabaPuHuiTi-2 weight 800 in white, line-height 1.0. Subtext at 18px weight 400 in #79efbd. Floating isometric illustration of a hardware wallet and phone below the headline. 80-113px vertical padding.

2. **Pill Outline Button**: 100px border-radius, transparent fill, 2px #79efbd border, #79efbd text, 16px size weight 700, 12px 24px padding. Used for download or secondary actions.

3. **Violet Section Banner**: Full-bleed #4a21ef background, 113px vertical padding. Centered section heading at 48px weight 800 in white. Centered body text at 16px weight 400 in white with 0.8 opacity. 3-column card grid below with white cards at 24px radius and 24px padding.

4. **Testimonial Card**: White (#ffffff) fill, 24px border-radius, 32px padding, no shadow. Quote text at 16px weight 400 in #1d1d1d. Attribution block at bottom with 40px circular avatar, name in 14px weight 700 #1d1d1d, role in 14px weight 400 #666666.

5. **Navigation Bar**: Transparent background over hero, 12px radius on dropdown elements. Logo left (white), nav links centered in 16px weight 400 white, language globe icon + 'English' label, and a ghost pill button (100px radius, white border, white text) on the far right.

## Similar Brands

- **Ledger** — Same dark cosmic crypto-wallet visual language with hardware product illustrations and a single brand color dominating sections
- **Phantom Wallet** — Similar violet-and-dark crypto branding with pill-shaped CTAs and bold display headlines
- **Trust Wallet** — Dark hero sections with floating 3D product illustrations and vibrant gradient transitions
- **MetaMask** — Crypto product showcase style with monochromatic hero and illustration-driven product pages

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-signal-violet: #4a21ef;
  --gradient-signal-violet: linear-gradient(154.24deg, rgb(191, 255, 228) 11.19%, rgb(74, 33, 239) 62.38%);
  --color-mint-pulse: #79efbd;
  --color-terminal-green: #18d26e;
  --color-deep-indigo: #0d0b33;
  --gradient-deep-indigo: linear-gradient(124.15deg, rgb(13, 11, 51) 0%, rgb(75, 62, 211) 218.07%);
  --color-carbon: #1d1d1d;
  --color-lavender-mist: #f7f6ff;
  --color-paper-white: #ffffff;
  --color-steel-gray: #666666;

  /* Typography — Font Families */
  --font-alibabapuhuiti-2: 'AlibabaPuHuiTi-2', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --text-body: 16px;
  --leading-body: 1.57;
  --text-subheading: 18px;
  --leading-subheading: 1.56;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.5;
  --text-heading: 32px;
  --leading-heading: 1.2;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.17;
  --text-display: 80px;
  --leading-display: 1;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-bold: 700;
  --font-weight-extrabold: 800;
  --font-weight-black: 900;
  --font-weight-w1000: 1000;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-80: 80px;
  --spacing-100: 100px;
  --spacing-160: 160px;
  --spacing-180: 180px;
  --spacing-200: 200px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80-113px;
  --card-padding: 24px;
  --element-gap: 12-16px;

  /* Border Radius */
  --radius-xl: 12px;
  --radius-3xl: 24px;
  --radius-full: 48px;
  --radius-full-2: 100px;

  /* Named Radii */
  --radius-nav: 12px;
  --radius-cards: 24px;
  --radius-other: 48px;
  --radius-buttons: 100px;

  /* Surfaces */
  --surface-cosmic-canvas: #0d0b33;
  --surface-signal-field: #4a21ef;
  --surface-mint-accent: #79efbd;
  --surface-lavender-lift: #f7f6ff;
  --surface-paper: #ffffff;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-signal-violet: #4a21ef;
  --color-mint-pulse: #79efbd;
  --color-terminal-green: #18d26e;
  --color-deep-indigo: #0d0b33;
  --color-carbon: #1d1d1d;
  --color-lavender-mist: #f7f6ff;
  --color-paper-white: #ffffff;
  --color-steel-gray: #666666;

  /* Typography */
  --font-alibabapuhuiti-2: 'AlibabaPuHuiTi-2', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --text-body: 16px;
  --leading-body: 1.57;
  --text-subheading: 18px;
  --leading-subheading: 1.56;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.5;
  --text-heading: 32px;
  --leading-heading: 1.2;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.17;
  --text-display: 80px;
  --leading-display: 1;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-80: 80px;
  --spacing-100: 100px;
  --spacing-160: 160px;
  --spacing-180: 180px;
  --spacing-200: 200px;

  /* Border Radius */
  --radius-xl: 12px;
  --radius-3xl: 24px;
  --radius-full: 48px;
  --radius-full-2: 100px;
}
```
