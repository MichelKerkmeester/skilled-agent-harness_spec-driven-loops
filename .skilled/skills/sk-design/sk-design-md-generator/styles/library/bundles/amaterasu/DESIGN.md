# Amaterasu — Style Reference
> Celestial teal sanctuary

**Theme:** dark

Amaterasu lives inside a cinematic dark photograph: a full-bleed teal-lit profile portrait washes the viewport in deep cyan atmosphere, and a single deep cosmic violet (#1b2978) is the only structural ink in the system. Typography splits into two contrasting registers — a whisper-weight display face (TWKLausanne-200) locks headlines tight against the dark at 50–80px with aggressive negative tracking (-0.040em to -0.025em), while a wide-tracked all-caps label face (NeoSansPro-Medium) floats small nav and scroll cues at 10–12px with extreme +0.16em to +0.32em letter-spacing. Components stay deliberately thin: 20px-radius pill controls with violet hairline outlines instead of heavy filled blocks, white text floating in 40–60px negative space, and zero box-shadow elevation. The palette is a disciplined two-ink system (Polar White + Cosmic Violet) with teal appearing only as atmospheric photographic light and gradient washes — never as a UI surface, button, or text color.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Cosmic Violet | `#1b2978` | `--color-cosmic-violet` | Primary brand ink — outlined button borders, heading text on light surfaces, the only chromatic voice in the UI |
| Twilight Indigo | `#19366c` | `--color-twilight-indigo` | Deeper violet for secondary borders and gradient origins — bridges Cosmic Violet into the atmospheric range |
| Aurora Teal | `#75cdd6` | `--color-aurora-teal` | Atmospheric teal pulled from the hero photography — background washes and the emotional color of the brand |
| Cyan Glow | `radial-gradient(at 5.62% 33.12%, rgb(255, 255, 255) 30%, rgb(132, 205, 238) 100%)` | `--color-cyan-glow` | Terminal stop of the radial atmospheric gradients — recreates the directional key light of the hero at smaller scales; Decorative radial gradient that recreates the hero's directional teal light in section panels |
| Cosmic Violet Wash | `linear-gradient(174deg, rgb(42, 57, 142) 5%, rgb(85, 102, 197) 100%)` | `--color-cosmic-violet-wash` | Decorative violet gradient for atmospheric panels |
| Polar White | `#ffffff` | `--color-polar-white` | Primary text on the dark hero, light section surfaces, card backgrounds, button text on violet |
| Obsidian | `#000000` | `--color-obsidian` | Text on light surfaces and deepest contrast points |
| Silver Slate | `#7488a5` | `--color-silver-slate` | Near-gray stroke color for subtle decorative lines and secondary UI elements |
| Cerulean Mist | `#579dc0` | `--color-cerulean-mist` | Decorative SVG stroke for iconography and illustration accents |
| Storm Shadow | `#466187` | `--color-storm-shadow` | Muted blue used for link focus-ring shadows and hover glows |

## Tokens — Typography

### TWKLausanne-250 — Body, UI, and mid-tier headings — the workhorse family. 400 for paragraphs and descriptions, 700 for sub-headings and emphasized labels. The tight 1.13 line-height at 40px gives mid-headings a compressed, architectural feel · `--font-twklausanne-250`
- **Substitute:** Inter 400/700, Söhne 400/700, or Manrope 400/700
- **Weights:** 400, 700
- **Sizes:** 12px, 16px, 20px, 24px, 26px, 32px, 40px
- **Line height:** 1.13, 1.20, 1.23, 1.40
- **Role:** Body, UI, and mid-tier headings — the workhorse family. 400 for paragraphs and descriptions, 700 for sub-headings and emphasized labels. The tight 1.13 line-height at 40px gives mid-headings a compressed, architectural feel

### TWKLausanne-200 — Display and hero headlines — the lightest cut of TWKLausanne acts as an anti-convention choice: most brands shout at 80px with bold weights, this one whispers at 400 and achieves presence through restraint and aggressive negative tracking · `--font-twklausanne-200`
- **Substitute:** Inter Tight 200, Manrope 200, or any geometric sans at its lightest available weight
- **Weights:** 400
- **Sizes:** 50px, 60px, 80px
- **Line height:** 1.00
- **Letter spacing:** -0.040em at 80px, -0.033em at 60px, -0.025em at 50px
- **Role:** Display and hero headlines — the lightest cut of TWKLausanne acts as an anti-convention choice: most brands shout at 80px with bold weights, this one whispers at 400 and achieves presence through restraint and aggressive negative tracking

### NeoSansPro-Medium — Architectural all-caps labels — nav links, scroll cues, section markers, brand wordmark. The 2.0–3.0 line-height at 10px creates dramatic vertical breathing room, and the extreme +0.32em tracking turns tiny text into spatial markers rather than readable labels · `--font-neosanspro-medium`
- **Substitute:** Space Grotesk 500 uppercase with manual letter-spacing, or any geometric sans applied uppercase with wide tracking
- **Weights:** 400
- **Sizes:** 10px, 20px
- **Line height:** 1.20, 1.50, 2.00, 3.00
- **Letter spacing:** 0.16em, 0.32em
- **Role:** Architectural all-caps labels — nav links, scroll cues, section markers, brand wordmark. The 2.0–3.0 line-height at 10px creates dramatic vertical breathing room, and the extreme +0.32em tracking turns tiny text into spatial markers rather than readable labels

### Arial — Arial — detected in extracted data but not described by AI · `--font-arial`
- **Weights:** 400
- **Sizes:** 13px
- **Line height:** 1.2
- **Role:** Arial — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 10px | 2 | 3.2px | `--text-caption` |
| body | 16px | 1.4 | — | `--text-body` |
| subheading | 20px | 1.5 | 3.2px | `--text-subheading` |
| heading-sm | 26px | 1.2 | — | `--text-heading-sm` |
| heading | 40px | 1.13 | -1px | `--text-heading` |
| display-sm | 50px | 1 | -1.25px | `--text-display-sm` |
| display | 60px | 1 | -2px | `--text-display` |
| display-lg | 80px | 1 | -3.2px | `--text-display-lg` |

## Tokens — Spacing & Shapes

**Density:** spacious

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 5 | 5px | `--spacing-5` |
| 9 | 9px | `--spacing-9` |
| 10 | 10px | `--spacing-10` |
| 20 | 20px | `--spacing-20` |
| 22 | 22px | `--spacing-22` |
| 30 | 30px | `--spacing-30` |
| 40 | 40px | `--spacing-40` |
| 45 | 45px | `--spacing-45` |
| 50 | 50px | `--spacing-50` |
| 60 | 60px | `--spacing-60` |
| 100 | 100px | `--spacing-100` |
| 150 | 150px | `--spacing-150` |
| 210 | 210px | `--spacing-210` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 20px |
| links | 20px |
| buttons | 20px |

### Layout

- **Section gap:** 50-60px
- **Card padding:** 30-40px
- **Element gap:** 20px

## Components

### Hero Atmosphere Section
**Role:** Full-bleed opening viewport

100vh dark photographic background with deep teal-cyan key lighting on a profile portrait. Centered headline at 80px TWKLausanne-200 weight 400 in white with -3.2px tracking, floating in negative space. Optional right-aligned description at 12px TWKLausanne-250 white. No card, no panel, no border — the photograph is the container.

### Outlined CTA Button
**Role:** Primary call-to-action pill

20px border-radius, 1px solid Cosmic Violet #1b2978 border, transparent background, 16px 24px padding. Text at 12px NeoSansPro-Medium uppercase, 0.16em letter-spacing, white fill. Optional 5px gap to a left-arrow icon. The system's only interactive primary action — never a filled rectangle.

### Architectural Nav Link
**Role:** Top-right navigation text link

Plain text at 10px NeoSansPro-Medium uppercase, 0.32em letter-spacing, white fill, no underline. Sits at 9px right margin to an adjacent grid utility icon. Hover shifts letter-spacing or color to Cosmic Violet — never a background fill.

### Brand Wordmark
**Role:** Centered top-of-page brand mark

Text 'AMATERASU' at 10px NeoSansPro-Medium uppercase, 0.32em letter-spacing, white, centered horizontally at the top of the viewport with ~20px top padding. No logo icon, no image — pure typographic mark relying on extreme letter-spacing to carry brand presence.

### Scroll Cue
**Role:** Bottom-left viewport indicator

Text 'SCROLL TO EXPLORE' at 10px NeoSansPro-Medium uppercase, 0.32em letter-spacing, white, anchored bottom-left of the hero. Often paired with a thin down-arrow stroke icon at 5px left margin.

### Atmospheric Gradient Panel
**Role:** Tinted content section using radial light wash

Full-width section with background built from radial-gradient(at 5.62% 33.12%, #ffffff 30%, #84cdee 100%), 100–150px vertical padding, white or Cosmic Violet text floating over the wash. Replicates the hero's directional teal key light at section scale.

### Content Section (Light)
**Role:** Standard readable content block

Polar White #ffffff background, 40–60px vertical padding, heading at 40px TWKLausanne-250 weight 400 in Cosmic Violet #1b2978 with -0.025em tracking, body at 16px TWKLausanne-250 weight 400 in Obsidian. No card

## Do's and Don'ts

### Do

### Don't

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Hero Atmosphere | `#0a1a2` | Full-bleed dark photographic canvas — the emotional base, paired with teal key lighting and white floating text |
| 1 | Aurora Teal Panel | `#75cdd6` | Tinted atmospheric section background created via radial white-to-teal gradient washes |
| 2 | Polar Surface | `#ffffff` | Content section base — lets violet typography and clean components speak without atmospheric interference |

## Elevation

This system deliberately avoids box-shadows entirely — depth and separation are achieved through the full-bleed dark photographic hero, atmospheric teal gradient washes, and hairline Cosmic Violet borders on outlined components. The flat treatment is intentional: it keeps the brand feeling like a clinical neuroscience space rather than a typical SaaS dashboard. No card has ever needed a drop shadow; no modal has ever needed a glow.

## Agent Prompt Guide

primary action: #1b2978 (outlined action border)
Create an Outlined Primary Action: Transparent background, #1b2978 border and text, 9999px radius, compact pill padding. Use it for the main CTA instead of a filled button.

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-cosmic-violet: #1b2978;
  --color-twilight-indigo: #19366c;
  --color-aurora-teal: #75cdd6;
  --color-cyan-glow: #84cdee;
  --gradient-cyan-glow: radial-gradient(at 5.62% 33.12%, rgb(255, 255, 255) 30%, rgb(132, 205, 238) 100%);
  --color-cosmic-violet-wash: #3a3cb5;
  --gradient-cosmic-violet-wash: linear-gradient(174deg, rgb(42, 57, 142) 5%, rgb(85, 102, 197) 100%);
  --color-polar-white: #ffffff;
  --color-obsidian: #000000;
  --color-silver-slate: #7488a5;
  --color-cerulean-mist: #579dc0;
  --color-storm-shadow: #466187;

  /* Typography — Font Families */
  --font-twklausanne-250: 'TWKLausanne-250', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-twklausanne-200: 'TWKLausanne-200', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-neosanspro-medium: 'NeoSansPro-Medium', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 2;
  --tracking-caption: 3.2px;
  --text-body: 16px;
  --leading-body: 1.4;
  --text-subheading: 20px;
  --leading-subheading: 1.5;
  --tracking-subheading: 3.2px;
  --text-heading-sm: 26px;
  --leading-heading-sm: 1.2;
  --text-heading: 40px;
  --leading-heading: 1.13;
  --tracking-heading: -1px;
  --text-display-sm: 50px;
  --leading-display-sm: 1;
  --tracking-display-sm: -1.25px;
  --text-display: 60px;
  --leading-display: 1;
  --tracking-display: -2px;
  --text-display-lg: 80px;
  --leading-display-lg: 1;
  --tracking-display-lg: -3.2px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-5: 5px;
  --spacing-9: 9px;
  --spacing-10: 10px;
  --spacing-20: 20px;
  --spacing-22: 22px;
  --spacing-30: 30px;
  --spacing-40: 40px;
  --spacing-45: 45px;
  --spacing-50: 50px;
  --spacing-60: 60px;
  --spacing-100: 100px;
  --spacing-150: 150px;
  --spacing-210: 210px;

  /* Layout */
  --section-gap: 50-60px;
  --card-padding: 30-40px;
  --element-gap: 20px;

  /* Border Radius */
  --radius-2xl: 20px;

  /* Named Radii */
  --radius-tags: 20px;
  --radius-links: 20px;
  --radius-buttons: 20px;

  /* Surfaces */
  --surface-hero-atmosphere: #0a1a2;
  --surface-aurora-teal-panel: #75cdd6;
  --surface-polar-surface: #ffffff;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-cosmic-violet: #1b2978;
  --color-twilight-indigo: #19366c;
  --color-aurora-teal: #75cdd6;
  --color-cyan-glow: #84cdee;
  --color-cosmic-violet-wash: #3a3cb5;
  --color-polar-white: #ffffff;
  --color-obsidian: #000000;
  --color-silver-slate: #7488a5;
  --color-cerulean-mist: #579dc0;
  --color-storm-shadow: #466187;

  /* Typography */
  --font-twklausanne-250: 'TWKLausanne-250', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-twklausanne-200: 'TWKLausanne-200', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-neosanspro-medium: 'NeoSansPro-Medium', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 2;
  --tracking-caption: 3.2px;
  --text-body: 16px;
  --leading-body: 1.4;
  --text-subheading: 20px;
  --leading-subheading: 1.5;
  --tracking-subheading: 3.2px;
  --text-heading-sm: 26px;
  --leading-heading-sm: 1.2;
  --text-heading: 40px;
  --leading-heading: 1.13;
  --tracking-heading: -1px;
  --text-display-sm: 50px;
  --leading-display-sm: 1;
  --tracking-display-sm: -1.25px;
  --text-display: 60px;
  --leading-display: 1;
  --tracking-display: -2px;
  --text-display-lg: 80px;
  --leading-display-lg: 1;
  --tracking-display-lg: -3.2px;

  /* Spacing */
  --spacing-5: 5px;
  --spacing-9: 9px;
  --spacing-10: 10px;
  --spacing-20: 20px;
  --spacing-22: 22px;
  --spacing-30: 30px;
  --spacing-40: 40px;
  --spacing-45: 45px;
  --spacing-50: 50px;
  --spacing-60: 60px;
  --spacing-100: 100px;
  --spacing-150: 150px;
  --spacing-210: 210px;

  /* Border Radius */
  --radius-2xl: 20px;
}
```
