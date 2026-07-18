# robot.com — Style Reference
> a printed editorial spread with a yellow highlighter

Warm off-white paper, ink-black type, and a single neon-yellow accent that marks what matters — the system behaves like a confident magazine layout, not a software dashboard.

**Theme:** light

robot.com speaks in a near-monochrome voice — warm off-white canvas, ink-black text, and a single screaming-yellow accent that operates like a highlighter on a printed page. The system feels editorial and confident: aggressive type (custom Yellix at up to 100px with negative tracking), pill-shaped controls (24-30px radii dominate), and section-level color blocks that flip between off-white, near-black, and yellow rather than subtle gradient washes. Product photography is treated as full-bleed cinematic evidence — no crops, no UI chrome around it — while text blocks sit in narrow left-aligned columns that leave generous right-side breathing room. The visual rhythm alternates quiet monochrome bands with bold accent blocks, making the yellow feel earned rather than decorative.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Yellix Yellow | `#fff65d` | `--color-yellix-yellow` | Primary action buttons, section accent blocks, highlight tags, decorative fills — the sole chromatic color, used sparingly to make a single element pop per view |
| Bone White | `#ffffff` | `--color-bone-white` | Page canvas, inverted text on dark blocks, filled button text |
| Warm Parchment | `#f8f6f3` | `--color-warm-parchment` | Card surfaces, secondary canvas tone, subtle elevation over pure white |
| Fog Gray | `#d9d7d5` | `--color-fog-gray` | Quietest neutral surface layer, faint dividers, muted backgrounds |
| Ash Gray | `#8f8e8d` | `--color-ash-gray` | Tertiary body text, subtle borders, caption-weight copy |
| Stone Gray | `#727272` | `--color-stone-gray` | Secondary body text, quiet helper copy, secondary borders |
| Ink Black | `#262626` | `--color-ink-black` | Primary text, heading color, dominant border color, dark section fill — near-black with slight warmth, never pure #000 |
| Charcoal | `#2d2d2d` | `--color-charcoal` | Card-level dark surface, deep accent block alternative to Ink Black |
| Pure Black | `#000000` | `--color-pure-black` | Primary action button fill, high-contrast decorative fills — reserved for moments demanding maximum weight |

## Tokens — Typography

### Yellix — Yellix is a custom grotesque with personality — slightly humanist proportions, aggressively tight tracking at display sizes (-0.214em at 100px) that makes headlines read as compressed editorial blocks rather than airy SaaS titles. The ss01 and salt features suggest alternates and stylistic glyph variants used selectively. Yellix carries the entire system: nav, body, display, buttons. The line-height ratio collapses at display (0.96-1.0) creating stacked headline density, then opens to 1.16-1.25 for body for legibility. · `--font-yellix`
- **Substitute:** Inter, GT Walsheim, or Söhne
- **Weights:** 400, 500, 600
- **Sizes:** 10, 12, 14, 15, 16, 18, 24, 32, 38, 41, 52, 72, 100
- **Line height:** 0.96, 1.00, 1.06, 1.10, 1.16, 1.22, 1.25
- **Letter spacing:** Tracking tightens dramatically with size: -0.214em at 100px, -0.03em at 52px, -0.025em at 38-41px, -0.02em at 24-32px, -0.01em at 18px, normal at 10-16px
- **OpenType features:** `"ss01" on, "salt" on`
- **Role:** Yellix is a custom grotesque with personality — slightly humanist proportions, aggressively tight tracking at display sizes (-0.214em at 100px) that makes headlines read as compressed editorial blocks rather than airy SaaS titles. The ss01 and salt features suggest alternates and stylistic glyph variants used selectively. Yellix carries the entire system: nav, body, display, buttons. The line-height ratio collapses at display (0.96-1.0) creating stacked headline density, then opens to 1.16-1.25 for body for legibility.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.22 | — | `--text-caption` |
| body-sm | 14px | 1.22 | — | `--text-body-sm` |
| body | 16px | 1.25 | — | `--text-body` |
| subheading | 18px | 1.22 | -0.18px | `--text-subheading` |
| heading-sm | 24px | 1.16 | -0.48px | `--text-heading-sm` |
| heading | 38px | 1.1 | -0.95px | `--text-heading` |
| heading-lg | 52px | 1.06 | -1.56px | `--text-heading-lg` |
| display | 72px | 1 | -2.16px | `--text-display` |
| display-xl | 100px | 0.96 | -21.4px | `--text-display-xl` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** compact

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

### Border Radius

| Element | Value |
|---------|-------|
| nav | 24px |
| tags | 24px |
| cards | 24px |
| buttons | 30px |
| nav-large | 17px |
| buttons-pill | 9999px |
| buttons-tight | 4px |

### Layout

- **Page max-width:** 1280px
- **Section gap:** 64px
- **Card padding:** 24px
- **Element gap:** 8px

## Components

### Floating Pill Nav
**Role:** Primary site navigation, always visible

A floating pill-shaped nav bar centered at the top of the viewport (approximately 5% from top), separated from the edges with generous horizontal padding. Background: Bone White #ffffff. Border-radius: 24px. Contains the robot.com wordmark (Yellix 14-16px weight 500) and a dropdown chevron. The pill floats above hero content without a shadow — its white fill against the hero image creates natural separation.

### Talk to Sales Button
**Role:** Persistent top-right conversion CTA

Pill-shaped button in the top-right corner, background: Bone White #ffffff, text: Ink Black #262626 at Yellix 14px weight 500. Border-radius: 24px. Padding approximately 10px 18px. Sits at the same vertical level as the floating nav. No fill change on hover — operates as a ghost action visible against any background.

### Black Filled Action Button
**Role:** Primary conversion action (Get in Touch)

Background: Pure Black #000000. Text: Bone White #ffffff at Yellix 16px weight 500. Border-radius: 30px (large pill). Padding approximately 12px 24px. No visible border. This is the system's maximum-weight interactive — used sparingly for conversion moments.

### Outlined Ghost Button
**Role:** Secondary action (Explore Robots)

Background: transparent or Bone White #ffffff. Border: 1px Ink Black #262626. Text: Ink Black #262626 at Yellix 16px weight 500. Border-radius: 30px. Padding approximately 12px 24px. Pairs directly with the black filled button as a less-committed alternative.

### Yellow Accent Block
**Role:** Section-level color punctuation

Full-width section background filled with Yellix Yellow #fff65d. Contains display-size headlines in Ink Black #262626. No card containers or borders — the yellow is the container. This is the system's most expressive element: a full-bleed color band that signals editorial emphasis rather than informational hierarchy.

### Dark Quote Band
**Role:** Full-width dark section for editorial pull-quotes and testimonials

Background: Ink Black #262626. Text: Bone White #ffffff at Yellix 38-41px weight 500 with -0.025em letter-spacing. Accompanied by a small product thumbnail (square, approximately 100-120px) with 10px radius. The dark band flips the page into inverse mode, creating visual punctuation between light sections.

### Watch Video Button
**Role:** In-hero media trigger

Pill-shaped button with Bone White #ffffff background, Ink Black #262626 text at Yellix 16px weight 500. Contains a play triangle icon prefix. Border-radius: 24px. Sits in the bottom-right quadrant of the hero, overlaid on the video background.

### Hero Headline Block
**Role:** Centered or left-aligned display text on full-bleed media

Yellix 41-52px weight 500, Ink Black #262626 or Bone White #ffffff depending on media contrast. Letter-spacing: -0.025em. Line-height: 1.10. Two-line headlines max. Paired with no subtext — the headline speaks alone.

### Logo Trust Strip
**Role:** Social proof through partner/brand logos

Horizontal row of grayscale partner logos (Sodexo, Grubhub, GXO, AWS, SKIP). All logos rendered in Ink Black #262626 on Bone White #ffffff. Section heading "Trusted by" in Yellix 32px weight 500. Logos spaced with approximately 48-64px gaps. No card containers — logos float on the canvas.

### Product Showcase Split
**Role:** Two-column product reveal (text left, image right)

Left column: narrow text block (~40% width) with headline at Yellix 38-41px weight 500, body copy at 16px in Stone Gray #727272, and two CTA buttons stacked or side-by-side. Right column: full product render or photo taking ~55% width, with no border or radius treatment — the image is raw. Vertical center-aligned.

### Section Corner Arrow
**Role:** Scroll-down indicator on hero

Small square button (approximately 32-40px) in the bottom-right corner of the hero section, Bone White #ffffff background with a downward chevron icon in Ink Black. Border-radius: 4px. Subtle, non-decorative — functional scroll prompt.

### Color-Card Highlight
**Role:** Yellow-filled emphasis card for features or metrics

Background: Yellix Yellow #fff65d. Border-radius: 10px. Padding: 24px. Text in Ink Black #262626. Used for standout data points, feature callouts, or pricing emphasis. The 10px radius distinguishes it from the system's dominant 24px pill language — cards are softer rectangles, not pills.

## Do's and Don'ts

### Do
- Use #fff65d yellow as the only chromatic color — never introduce additional hues; the monochrome-plus-one-yellow system is the brand's signature
- Use Yellix at display sizes (52-100px) with -0.025em to -0.214em tracking — the tight tracking is what makes headlines feel editorial rather than corporate
- Apply 24-30px border-radius to all interactive elements (buttons, nav, tags) — the pill language is non-negotiable for UI chrome
- Use 10px radius for card containers and 4px for utility buttons — smaller radii distinguish content from chrome
- Alternate section backgrounds in bold blocks: Bone White → Warm Parchment → Ink Black → Yellix Yellow — the section-level color flip is the page rhythm
- Use #000000 only for the single most important button per view — let #262626 carry all other dark elements to avoid pure-black fatigue
- Enable Yellix font features "ss01" and "salt" globally — they define the custom glyph personality and distinguish the system from generic Inter

### Don't
- Don't introduce gradients — the system is built on flat color blocks; any gradient breaks the editorial print metaphor
- Don't use #fff65d yellow for body text or large backgrounds behind body copy — it is for accent blocks and single-element emphasis only
- Don't use shadows for elevation — the system relies on color block contrast and border-radius alone for depth; shadows would add SaaS-dashboard softness that conflicts with the print editorial feel
- Don't use serif typefaces — Yellix's grotesque personality is the entire typographic identity; a serif would break the voice
- Don't use open letter-spacing or generous line-heights at display sizes — the 0.96-1.10 line-height and negative tracking at 52-100px is what makes headlines distinctive
- Don't use border-radius below 4px on content cards or above 30px on UI chrome — the radius scale is deliberate: 4px (utility), 10px (cards), 24-30px (pills/buttons), 9999px (tags)
- Don't crop or frame product photography with borders or card containers — full-bleed treatment is what gives the product cinematic presence

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#ffffff` | Page-level background, dominant surface for the majority of content |
| 1 | Warm Card | `#f8f6f3` | Elevated card surface, subtle warm tint that differentiates from canvas without stark contrast |
| 2 | Fog | `#d9d7d5` | Quietest neutral, faint dividers and muted background bands |
| 3 | Charcoal Block | `#262626` | Full-width section flip to dark mode for editorial quotes and contrast moments |
| 4 | Yellow Accent | `#fff65d` | Full-bleed editorial accent section, highest visual prominence in the system |

## Elevation

The system intentionally avoids shadows. Depth is communicated through color block contrast — Bone White canvas, Warm Parchment cards, Ink Black bands, and Yellix Yellow accents stack as discrete surface layers rather than floating elevations. This reinforces the editorial print metaphor: pages don't float, they turn.

## Imagery

Photography and video are full-bleed and cinematic — no crops, no card framing, no decorative borders. Product shots show complete robots in real environments (sidewalks, labs) with shallow depth of field. The hero uses a muted, slightly desaturated video of a delivery robot in a park setting; the product showcase uses a clean studio render on a light gray background. Logo strip uses grayscale partner marks. A small square product thumbnail (10px radius) appears within the dark quote band. No illustration or 3D abstract graphics — only real photography and clean product renders.

## Layout

Page model is full-bleed with no fixed container width — sections span the entire viewport. Hero is a full-viewport video/image with a centered or left-aligned headline floating over it, plus a floating pill nav and top-right sales button. The page rhythm alternates: full-bleed hero → light gray split section (narrow text left, wide image right) → white logo strip → full-bleed dark quote band → full-bleed yellow accent section. Sections are separated by 64-80px gaps or flow seamlessly into adjacent color blocks. Content is consistently left-aligned within narrow text columns (approximately 40% width) while imagery takes the remaining 55-60%. Navigation is a single floating pill, not a traditional bar — minimal and editorial.

## Agent Prompt Guide

## Quick Color Reference
- Text primary: #262626 (Ink Black)
- Text secondary: #727272 (Stone Gray)
- Background canvas: #ffffff (Bone White)
- Background card: #f8f6f3 (Warm Parchment)
- Border: #262626 (Ink Black, 1px)
- Accent: #fff65d (Yellix Yellow)
- primary action: #fff65d (filled action)

## 3-5 Example Component Prompts

1. **Hero Section**: Full-viewport background image/video of a delivery robot. Floating pill nav (white #ffffff, 24px radius, Yellix 14px weight 500) centered at top. Centered headline "Robots for now, not someday" in Yellix 52px weight 500, #262626, letter-spacing -1.56px, line-height 1.06. No subtext. "Watch" button bottom-right: white #ffffff fill, 24px radius, Yellix 16px weight 500, #262626 text, with play triangle icon.

2. **Product Showcase Split**: Two-column layout, left 40% / right 55%. Left: headline "Not someday. Not in a lab. Today." in Yellix 41px weight 500, #262626, -1.025px tracking. Body at Yellix 16px weight 400, #727272. Two buttons: filled black (#000000, white text, 30px radius, Yellix 16px weight 500) and ghost outlined (transparent fill, 1px #262626 border, 30px radius). Right: full-bleed product image, no border or radius.

3. **Yellow Accent Section**: Full-width background #fff65d. Display headline "Robotics for the real world" in Yellix 72px weight 500, #262626, letter-spacing -2.16px, line-height 1.0. No buttons, no cards — the yellow IS the container. Add 80px vertical padding.

4. **Dark Quote Band**: Full-width background #262626. Small square product thumbnail (120px, 10px radius) left-aligned. Pull quote at Yellix 41px weight 500, #ffffff, -1.025px tracking, line-height 1.10. 80px vertical padding.

5. **Logo Trust Strip**: Background #ffffff. Section heading "Trusted by" in Yellix 32px weight 500, #262626. Horizontal row of 5 grayscale logos in #262626, spaced 64px apart. 48px vertical padding above and below the logo row.

## Similar Brands

- **Tesla** — Same near-monochrome palette with a single bold accent color, full-bleed cinematic hero photography, minimal pill navigation, and editorial display typography
- **Nothing.tech** — Same confident minimalism with a stark single-accent color system, custom grotesque type with tight tracking, and product-as-hero photography without UI framing
- **Arc browser** — Same editorial print-magazine approach: large display type with negative tracking, monochrome canvas with bold color-block section flips, and pill-shaped UI chrome
- **Framework Computer** — Same compact density, near-zero ornamentation, dark text on warm off-white, and photography that shows real product context without decorative framing

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-yellix-yellow: #fff65d;
  --color-bone-white: #ffffff;
  --color-warm-parchment: #f8f6f3;
  --color-fog-gray: #d9d7d5;
  --color-ash-gray: #8f8e8d;
  --color-stone-gray: #727272;
  --color-ink-black: #262626;
  --color-charcoal: #2d2d2d;
  --color-pure-black: #000000;

  /* Typography — Font Families */
  --font-yellix: 'Yellix', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.22;
  --text-body-sm: 14px;
  --leading-body-sm: 1.22;
  --text-body: 16px;
  --leading-body: 1.25;
  --text-subheading: 18px;
  --leading-subheading: 1.22;
  --tracking-subheading: -0.18px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.16;
  --tracking-heading-sm: -0.48px;
  --text-heading: 38px;
  --leading-heading: 1.1;
  --tracking-heading: -0.95px;
  --text-heading-lg: 52px;
  --leading-heading-lg: 1.06;
  --tracking-heading-lg: -1.56px;
  --text-display: 72px;
  --leading-display: 1;
  --tracking-display: -2.16px;
  --text-display-xl: 100px;
  --leading-display-xl: 0.96;
  --tracking-display-xl: -21.4px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;

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

  /* Layout */
  --page-max-width: 1280px;
  --section-gap: 64px;
  --card-padding: 24px;
  --element-gap: 8px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 10px;
  --radius-2xl: 17px;
  --radius-3xl: 24px;
  --radius-3xl-2: 30px;
  --radius-full: 9999px;

  /* Named Radii */
  --radius-nav: 24px;
  --radius-tags: 24px;
  --radius-cards: 24px;
  --radius-buttons: 30px;
  --radius-nav-large: 17px;
  --radius-buttons-pill: 9999px;
  --radius-buttons-tight: 4px;

  /* Surfaces */
  --surface-canvas: #ffffff;
  --surface-warm-card: #f8f6f3;
  --surface-fog: #d9d7d5;
  --surface-charcoal-block: #262626;
  --surface-yellow-accent: #fff65d;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-yellix-yellow: #fff65d;
  --color-bone-white: #ffffff;
  --color-warm-parchment: #f8f6f3;
  --color-fog-gray: #d9d7d5;
  --color-ash-gray: #8f8e8d;
  --color-stone-gray: #727272;
  --color-ink-black: #262626;
  --color-charcoal: #2d2d2d;
  --color-pure-black: #000000;

  /* Typography */
  --font-yellix: 'Yellix', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.22;
  --text-body-sm: 14px;
  --leading-body-sm: 1.22;
  --text-body: 16px;
  --leading-body: 1.25;
  --text-subheading: 18px;
  --leading-subheading: 1.22;
  --tracking-subheading: -0.18px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.16;
  --tracking-heading-sm: -0.48px;
  --text-heading: 38px;
  --leading-heading: 1.1;
  --tracking-heading: -0.95px;
  --text-heading-lg: 52px;
  --leading-heading-lg: 1.06;
  --tracking-heading-lg: -1.56px;
  --text-display: 72px;
  --leading-display: 1;
  --tracking-display: -2.16px;
  --text-display-xl: 100px;
  --leading-display-xl: 0.96;
  --tracking-display-xl: -21.4px;

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

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 10px;
  --radius-2xl: 17px;
  --radius-3xl: 24px;
  --radius-3xl-2: 30px;
  --radius-full: 9999px;
}
```
