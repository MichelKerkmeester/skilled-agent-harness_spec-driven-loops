# Current — Style Reference
> Editorial gallery in black and white. A whisper-thin headline floats on white paper beside a saturated photograph — banking as a magazine spread, not a dashboard.

**Theme:** light

Current uses an editorial monochrome language: stark white canvas, pure black navigation, and whisper-thin soehne headlines that command through restraint rather than weight. The UI itself contains zero chromatic color — every screen is built from black, white, and two shades of slate gray, with a single warm-to-cool gradient reserved for brand expression. Photography brings all the color, and it does so in saturated, slightly surreal editorial frames. Components are pill-shaped and ghost-like: black-filled primary buttons sit beside thin-outlined ghost links, and the only meaningful shadow in the system is a soft ambient glow on the floating app CTA. The aesthetic reads more like a fashion magazine spread than a banking app.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Pure Black | `#000000` | `--color-pure-black` | Navigation bar, filled primary buttons, primary headlines, hairline borders, icon strokes — the structural ink of the entire system |
| Paper White | `#ffffff` | `--color-paper-white` | Page canvas, card surfaces, nav text, button text on dark — the negative space that makes the whisper-thin type readable |
| Slate | `#737582` | `--color-slate` | Body copy, secondary text, link text, thin borders — the only mid-tone in the palette carries all helper and supporting information |
| Iron | `#4e525e` | `--color-iron` | Heavier borders, dividers in dense areas, secondary structural edges |
| Mist | `#ebeff2` | `--color-mist` | Input field fills, subtle recessed surfaces, hover wash on form fields |
| Current Spectrum | `linear-gradient(0.62deg, #f4cb45 0.27%, #f47635 25%, #5900f5 50.25%, rgba(0,0,0,0) 100.22%)` | `--color-current-spectrum` | Brand gradient (yellow → orange → purple → transparent) used on the wordmark and brand-mark expressions — the only chromatic surface in the system |

## Tokens — Typography

### soehne — Sole typeface across the entire system. Weight 100–300 at large sizes (48–90px) is the signature choice — headlines whisper at ultra-thin weight with negative tracking, producing a fashion-editorial cadence rarely seen in fintech. Weight 400 handles body and UI, weight 700 for button labels and bold feature titles. · `--font-soehne`
- **Substitute:** Suisse Int'l, Inter (variable), or Geist
- **Weights:** 100, 300, 400, 700
- **Sizes:** 12, 16, 18, 20, 21, 24, 48, 72, 90
- **Line height:** 1.0, 1.1, 1.2, 1.25, 1.4, 1.5, 1.6
- **Letter spacing:** -0.04em at 90px, -0.04em at 72px, -0.02em at 48px, -0.013em at 24px, -0.01em at 18–20px, -0.004em at 16px, normal at 12px
- **Role:** Sole typeface across the entire system. Weight 100–300 at large sizes (48–90px) is the signature choice — headlines whisper at ultra-thin weight with negative tracking, producing a fashion-editorial cadence rarely seen in fintech. Weight 400 handles body and UI, weight 700 for button labels and bold feature titles.

### proxima-nova — proxima-nova — detected in extracted data but not described by AI · `--font-proxima-nova`
- **Weights:** 400, 700
- **Sizes:** 16px, 43px
- **Line height:** 1.4
- **Letter spacing:** -0.01, -0.004
- **Role:** proxima-nova — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.5 | — | `--text-caption` |
| body-sm | 14px | 1.5 | -0.14px | `--text-body-sm` |
| body | 16px | 1.5 | -0.16px | `--text-body` |
| body-lg | 18px | 1.4 | -0.18px | `--text-body-lg` |
| subheading | 20px | 1.4 | -0.2px | `--text-subheading` |
| heading-sm | 24px | 1.25 | -0.31px | `--text-heading-sm` |
| heading | 48px | 1.1 | -0.96px | `--text-heading` |
| heading-lg | 72px | 1.05 | -2.88px | `--text-heading-lg` |
| display | 90px | 1 | -3.6px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 8px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 8 | 8px | `--spacing-8` |
| 16 | 16px | `--spacing-16` |
| 24 | 24px | `--spacing-24` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 80 | 80px | `--spacing-80` |
| 120 | 120px | `--spacing-120` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 9999px |
| tags | 9999px |
| input | 9999px |
| buttons | 9999px |
| smallButton | 8px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| xl | `rgba(0, 0, 0, 0.01) 0px 140px 56px 0px, rgba(0, 0, 0, 0.0...` | `--shadow-xl` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 24px
- **Element gap:** 24px

## Components

### Top Navigation Bar
**Role:** Primary site navigation

Full-bleed black (#000) bar, 100% width, ~60px height. Left: product links ('Spend', 'Save', 'Invest', 'Advance') in 16px soehne weight 400, white, 32px gap. Center: 'current' wordmark in soehne weight 400 white, ~24px. Right: secondary links ('About', 'Help') in 16px white, followed by a white 'Get Started' button (pill, black text, 14px vertical / 24px horizontal padding). Hairline black border (1px) separates nav from page.

### Filled Primary Button
**Role:** High-intent conversion action (Get Started, sign-up)

Background #000, text #fff, soehne weight 400 at 16px, padding 14px vertical / 24px horizontal, border-radius 9999px (full pill). No border, no shadow. The black-on-white inversion is the only 'color' moment in the system — the button feels like a stamp pressed onto paper.

### Outlined Ghost Button (Learn More)
**Role:** Secondary / informational action

Background transparent, border 1px solid #000, text #000, soehne weight 400 at 16px, padding 14px vertical / 24px horizontal, border-radius 9999px. The outline is hairline-thin — sits like a drawn loop on the page, not a UI container.

### Mobile Number Input
**Role:** Hero conversion form

Single-row input with built-in CTA. Container is a pill (9999px radius) filled #ebeff2. Input text is soehne 16px #000, placeholder 'Enter your mobile number' in #737582. Attached right-side button is the filled primary (black pill, white 'Get Started' label) sitting flush inside the same pill container — the two elements form one continuous capsule.

### Feature Card (3-column grid)
**Role:** Product capability highlight

White background, no border, no shadow, 24px padding. Top: full-bleed photograph (rounded 0px, sharp corners, or 30px slight rounding on some variants). Middle: bold feature title in soehne weight 700 at 18–20px #000. Below: 1–2 line description in soehne weight 400 at 16px #737582. Bottom: ghost 'Learn More' button (outlined, pill). Cards sit directly on white canvas — separation comes from spacing alone, not borders or elevation.

### Editorial Split Section
**Role:** Long-form product storytelling (e.g. credit building)

Two-column layout, 50/50 split. Left: full-bleed editorial photograph (square or 4:3, sharp or slightly rounded 8px corners). Right: vertical stack beginning with an uppercase eyebrow label ('CREDIT BUILDING') in soehne weight 400 at 12–14px, letter-spacing 0, #000. Headline in soehne weight 300 at 48px, #000, letter-spacing -0.96px. Body in soehne 400 at 16px, #737582. Outlined ghost button at the bottom. 80px vertical section padding.

### Press Logo Strip
**Role:** Social proof band below hero

Full-width white band, single horizontal row of publication wordmarks (CBS News, Forbes, USA Today, CNBC, WSJ) evenly distributed. Logos rendered in #000, height ~24px, no captions, no dividers between them. The strip acts as a visual breath between the hero and the first content block.

### Floating App CTA
**Role:** Persistent mobile app install prompt

Fixed to the bottom-right viewport corner, 280px wide white card with the four-layer ambient shadow stack. Contains a small phone mockup illustration (left), two-line copy 'Get the app & get your money going' in soehne 14px #000, and a right arrow icon in #000. Border-radius 12px, 16px padding. The only elevated element in the entire system — visually announces itself as a floating card while everything else stays flat.

### Inverted Nav Button (Get Started — top right)
**Role:** Sign-up CTA in the black navigation

White pill button on the black nav bar: background #fff, text #000, soehne weight 400 at 16px, padding 8px vertical / 20px horizontal, border-radius 9999px. Smallest pill in the system — the tighter horizontal padding distinguishes it from larger in-page primary buttons.

### Hero Headline
**Role:** Primary above-the-fold message

soehne weight 300 at 72px (or 90px on wider viewports), #000, letter-spacing -2.88px, line-height 1.05. Max-width ~480px, left-aligned. Below it: 16px helper subtext in #737582 with a small info-circle icon (16px outlined). The whisper-thin weight at this size is the system's defining typographic signature.

### Tag / Pill (utility)
**Role:** Inline label or status indicator

soehne weight 400 at 12–14px #000, padding 4px 12px, border-radius 9999px, background transparent, border 1px solid #000. Used sparingly — for category labels above feature cards.

## Do's and Don'ts

### Do
- Set hero headlines in soehne weight 300 (or lighter) at 72–90px with -0.04em tracking — never use weight 700 for the primary page message
- Use 9999px border-radius for all buttons, inputs, tags, and the nav CTA — pill shapes are the only geometry in the system
- Build every screen on pure white (#ffffff) with black (#000000) for type, icons, and filled actions — the palette does not include any chromatic UI color
- Use #737582 for body copy, helper text, and link text — never use black for secondary information
- Separate cards and sections with 24–80px whitespace and 1px hairlines, never with shadows or tinted backgrounds
- Let editorial photography supply all color — choose saturated, slightly surreal imagery and let it bleed to its native aspect
- Use the Current Spectrum gradient exclusively on the wordmark and brand-mark expressions — never on product UI surfaces

### Don't
- Do not use weight 600+ for page headlines — the whisper-thin type at 100–300 is the brand's signature restraint
- Do not introduce any chromatic UI color (blue, green, red, purple) into buttons, links, or surfaces — the system is strictly achromatic
- Do not add drop shadows to cards, modals, or buttons — the floating app CTA is the only elevated element
- Do not use sharp 0–4px corners on any interactive element — pills (9999px) or generous rounding (8–30px) only
- Do not use letter-spacing greater than 0 on any text — all tracking is tight or negative, even at display sizes
- Do not create dark or tinted section backgrounds — every section sits on white; the black nav is the only inversion
- Do not place icons, emoji, or decorative graphics inside the content flow — the only visual elements are type, photography, and pill buttons

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#ffffff` | Primary page background |
| 1 | Recessed | `#ebeff2` | Input fields, subtle washed panels |
| 2 | Raised | `#ffffff` | Cards and feature blocks on the white canvas, defined by hairline borders not shadow |
| 3 | Inverted | `#000000` | Navigation bar and dark UI moments |

## Elevation

- **Floating App CTA:** `rgba(0, 0, 0, 0.01) 0px 140px 56px 0px, rgba(0, 0, 0, 0.05) 0px 79px 47px 0px, rgba(0, 0, 0, 0.09) 0px 35px 35px 0px, rgba(0, 0, 0, 0.1) 0px 9px 19px 0px`

## Imagery

Photography carries the entire emotional load of the brand — the UI itself is colorless. Imagery falls into two modes: (1) Editorial lifestyle portraits, full-bleed or contained, shot against saturated backdrops (powder blue walls, pink skies, green foliage) with subjects caught mid-movement (dancing, jumping, walking) — the energy is candid, not staged. (2) Hand-built illustrative compositions combining real photography with flat graphic shapes (clouds, arrows, dollar signs) in neon pink, green, and blue — surreal, slightly retro, magazine-cover energy. All imagery is treated with hard rectangular crops or slight rounding (8–30px), never masked circles. Photo aspect ratios lean square or 4:5 portrait. No duotone overlays, no color grading — the saturated source color is the point. Icons throughout the UI are outlined, 1px stroke, mono-color black, 16–20px. The gradient spectrum (yellow→orange→purple) is reserved for the wordmark and appears nowhere in product UI.

## Layout

Max-width 1200px centered content column with generous 48px horizontal padding on the nav and 24px on body. The page rhythm alternates: black nav (inverted band) → white hero (split: text left, full-bleed square photo right) → white press strip → white three-column feature grid → white editorial split section (photo left, text right) → repeating. Sections are separated by 80px vertical gaps with no dividers, no tinted bands — pure white flows continuously. The floating app CTA is the only element that breaks out of the content column, pinned bottom-right. The hero uses a vertical hairline divider (1px black) to separate the text block from the image at the column boundary. Card grids are always 3-column at desktop, collapsing to 1-column on mobile. No sidebars, no mega-menus, no decorative chrome — every pixel is either type, photography, or a single pill button.

## Agent Prompt Guide

**Quick Color Reference**
- text: #000000
- background: #ffffff
- body / helper text: #737582
- border: #000000 (1px hairline)
- input fill: #ebeff2
- brand accent: Current Spectrum gradient (yellow → orange → purple) on wordmark only
- primary action: #000000 (filled action)

**Example Component Prompts**
1. *Hero headline block:* White canvas, left-aligned. Headline in soehne weight 300 at 72px, #000000, letter-spacing -2.88px, line-height 1.05, max-width 480px. Below it a 16px subtext in soehne 400, #737582, with a 16px outlined info-circle icon.

2. *Filled primary button:* Background #000000, text #ffffff, soehne weight 400 at 16px, padding 14px 24px, border-radius 9999px, no border, no shadow. Use as the only filled button in any composition.

3. *Outlined ghost Learn More button:* Background transparent, border 1px solid #000000, text #000000, soehne weight 400 at 16px, padding 14px 24px, border-radius 9999px. Pair with every feature card.

4. *Three-column feature grid:* White background, 1200px max-width, 80px section padding. Each column: full-bleed square photo on top (0px or 8px radius), 24px gap, bold feature title in soehne 700 at 20px #000000, 8px gap, 16px body in soehne 400 #737582, 24px gap, outlined ghost Learn More button.

5. *Editorial split section:* Two-column 50/50. Left: full-bleed square editorial photograph (8px radius). Right: 12px uppercase eyebrow 'CREDIT BUILDING' in soehne 400 #000, 16px gap, 48px headline in soehne 300 #000000 with -0.96px tracking, 16px gap, 16px body in soehne 400 #737582, 24px gap, outlined ghost button.

## Similar Brands

- **Apple Card (Apple)** — Same achromatic UI with whisper-thin type and a single saturated photography source supplying all color; both treat finance as an editorial artifact
- **Cash App** — Same monochrome-on-white layout language with bold-but-thin display headlines and pill-shaped actions; both lean on lifestyle photography for personality
- **Chime** — Same minimal black-and-white fintech landing pattern with large light-weight headlines, 3-column feature grid, and press-logo social-proof band
- **Stripe** — Same restraint in UI color (near-achromatic), generous whitespace, hairline borders, and ultra-light display weights for hero headlines
- **Aesop** — Same editorial gallery aesthetic — minimal type, full-bleed lifestyle photography, almost no decorative chrome, the product is the visual

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-pure-black: #000000;
  --color-paper-white: #ffffff;
  --color-slate: #737582;
  --color-iron: #4e525e;
  --color-mist: #ebeff2;
  --color-current-spectrum: #f4cb45;
  --gradient-current-spectrum: linear-gradient(0.62deg, #f4cb45 0.27%, #f47635 25%, #5900f5 50.25%, rgba(0,0,0,0) 100.22%);

  /* Typography — Font Families */
  --font-soehne: 'soehne', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-proxima-nova: 'proxima-nova', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --tracking-body-sm: -0.14px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.16px;
  --text-body-lg: 18px;
  --leading-body-lg: 1.4;
  --tracking-body-lg: -0.18px;
  --text-subheading: 20px;
  --leading-subheading: 1.4;
  --tracking-subheading: -0.2px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.25;
  --tracking-heading-sm: -0.31px;
  --text-heading: 48px;
  --leading-heading: 1.1;
  --tracking-heading: -0.96px;
  --text-heading-lg: 72px;
  --leading-heading-lg: 1.05;
  --tracking-heading-lg: -2.88px;
  --text-display: 90px;
  --leading-display: 1;
  --tracking-display: -3.6px;

  /* Typography — Weights */
  --font-weight-thin: 100;
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 8px;
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-80: 80px;
  --spacing-120: 120px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 24px;
  --element-gap: 24px;

  /* Border Radius */
  --radius-md: 5.6px;
  --radius-lg: 8px;
  --radius-3xl: 30px;
  --radius-full: 999px;
  --radius-full-2: 9999px;

  /* Named Radii */
  --radius-nav: 9999px;
  --radius-tags: 9999px;
  --radius-input: 9999px;
  --radius-buttons: 9999px;
  --radius-smallbutton: 8px;

  /* Shadows */
  --shadow-xl: rgba(0, 0, 0, 0.01) 0px 140px 56px 0px, rgba(0, 0, 0, 0.05) 0px 79px 47px 0px, rgba(0, 0, 0, 0.09) 0px 35px 35px 0px, rgba(0, 0, 0, 0.1) 0px 9px 19px 0px;

  /* Surfaces */
  --surface-canvas: #ffffff;
  --surface-recessed: #ebeff2;
  --surface-raised: #ffffff;
  --surface-inverted: #000000;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-pure-black: #000000;
  --color-paper-white: #ffffff;
  --color-slate: #737582;
  --color-iron: #4e525e;
  --color-mist: #ebeff2;
  --color-current-spectrum: #f4cb45;

  /* Typography */
  --font-soehne: 'soehne', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-proxima-nova: 'proxima-nova', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --tracking-body-sm: -0.14px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.16px;
  --text-body-lg: 18px;
  --leading-body-lg: 1.4;
  --tracking-body-lg: -0.18px;
  --text-subheading: 20px;
  --leading-subheading: 1.4;
  --tracking-subheading: -0.2px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.25;
  --tracking-heading-sm: -0.31px;
  --text-heading: 48px;
  --leading-heading: 1.1;
  --tracking-heading: -0.96px;
  --text-heading-lg: 72px;
  --leading-heading-lg: 1.05;
  --tracking-heading-lg: -2.88px;
  --text-display: 90px;
  --leading-display: 1;
  --tracking-display: -3.6px;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-80: 80px;
  --spacing-120: 120px;

  /* Border Radius */
  --radius-md: 5.6px;
  --radius-lg: 8px;
  --radius-3xl: 30px;
  --radius-full: 999px;
  --radius-full-2: 9999px;

  /* Shadows */
  --shadow-xl: rgba(0, 0, 0, 0.01) 0px 140px 56px 0px, rgba(0, 0, 0, 0.05) 0px 79px 47px 0px, rgba(0, 0, 0, 0.09) 0px 35px 35px 0px, rgba(0, 0, 0, 0.1) 0px 9px 19px 0px;
}
```
