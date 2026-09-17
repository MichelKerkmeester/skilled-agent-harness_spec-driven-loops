# Letters — Style Reference
> morning clinic under open sky — a sterile white desk beneath a wash of soft blue, dotted with surgical-blue instruments.

**Theme:** light

Letters is a medical letterwriting tool that opens with an open-sky gradient hero — a soft blue atmospheric band that sets a calm, clinical tone before dropping into a clean white workspace. The system is 99% monochrome: pure white canvas, near-black text (#070709), pill-shaped dark CTAs, and 18px rounded cards floating on hairline shadows. One vivid blue (#2597d0) is reserved for functional punctuation — icons, micro-graphics, waveform players — never for buttons or large fills. Typography leans on Open Runde, a geometric humanist sans with aggressive negative tracking at display sizes (-0.04em at 80px) that tightens headlines into confident blocks. Components feel medical-instrument light: thin borders, generous card padding, pill buttons, and a reserved use of elevation that lets the sky hero do the emotional work.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Obsidian | `#070709` | `--color-obsidian` | Primary text, filled CTA buttons, and dark UI surfaces — near-black chosen over pure #000 to soften contrast against white canvas |
| Paper White | `#ffffff` | `--color-paper-white` | Page background, card surfaces, and button text — the primary canvas across all sections below the hero |
| Cloud Gray | `#f5f5f5` | `--color-cloud-gray` | Secondary card surfaces and section backgrounds — separates feature blocks from main canvas |
| Sky Tint | `#d7e6f5` | `--color-sky-tint` | Card box-shadow tint and subtle blue-toned surface — keeps elevation feeling atmospheric rather than gray |
| Charcoal | `#60606c` | `--color-charcoal` | Body text, secondary copy, and muted borders — the dominant neutral for non-heading content |
| Slate | `#8b8b8b` | `--color-slate` | Tertiary text and inactive border states — used for placeholder labels and disabled affordances |
| Ink | `#151515` | `--color-ink` | Heading color and strong dividers — slightly lighter than Obsidian for less severe emphasis |
| Surgical Blue | `#2597d0` | `--color-surgical-blue` | Icon strokes, mic glyph, waveform player, and small functional accents — the single chromatic note across the interface |
| Sky Gradient | `linear-gradient(180deg, #779bc1 0%, #9abfda 58%, #cbdcec 100%)` | `--color-sky-gradient` | Hero background — vertical wash from medium blue to near-white that establishes the medical-aspirational mood |

## Tokens — Typography

### sans-serif — sans-serif — detected in extracted data but not described by AI · `--font-sans-serif`
- **Weights:** 400, 700
- **Sizes:** 12px
- **Line height:** 1.2
- **Role:** sans-serif — detected in extracted data but not described by AI

### Open Runde — Primary display and heading face — geometric humanist with tight tracking at large sizes; the -0.04em at 80px compresses the headline into a single confident block. Use for all headings, nav, and large text. · `--font-open-runde`
- **Substitute:** Inter Tight, General Sans, or Manrope
- **Weights:** 400, 500, 600, 700, 900
- **Sizes:** 10, 12, 14, 16, 17, 18, 20, 28, 44, 80
- **Line height:** 0.90, 1.10, 1.20, 1.40, 1.49, 1.50
- **Letter spacing:** -0.0400em at display (80px), -0.0100em at body (16-18px), normal at small (10-12px)
- **OpenType features:** `'ss01' on`
- **Role:** Primary display and heading face — geometric humanist with tight tracking at large sizes; the -0.04em at 80px compresses the headline into a single confident block. Use for all headings, nav, and large text.

### Inter — Secondary body and UI text — used for small labels, nav items, and inline links where a more neutral reading rhythm is needed. Pairs with Open Runde for hierarchy contrast. · `--font-inter`
- **Substitute:** system-ui, -apple-system
- **Weights:** 400, 500
- **Sizes:** 14
- **Line height:** 1.20, 1.40, 1.50
- **Letter spacing:** -0.0220em at 14px, -0.0100em at 14px
- **Role:** Secondary body and UI text — used for small labels, nav items, and inline links where a more neutral reading rhythm is needed. Pairs with Open Runde for hierarchy contrast.

### The Doctor FreeVersion — Decorative handwritten/doctor's note face — used only in the Before/After card illustrations to evoke clinical handwriting. Not for functional UI text. · `--font-the-doctor-freeversion`
- **Substitute:** Caveat, Kalam
- **Weights:** 400
- **Sizes:** 14, 38
- **Line height:** 0.90, 1.40
- **Letter spacing:** -0.0100em
- **Role:** Decorative handwritten/doctor's note face — used only in the Before/After card illustrations to evoke clinical handwriting. Not for functional UI text.

### Open Runde Semibold — Open Runde Semibold — detected in extracted data but not described by AI · `--font-open-runde-semibold`
- **Weights:** 400
- **Sizes:** 16px, 17px, 18px, 44px
- **Line height:** 1.1, 1.32, 1.4, 1.49
- **Letter spacing:** -0.04, -0.011, -0.01, -0.009
- **Role:** Open Runde Semibold — detected in extracted data but not described by AI

### Open Runde Medium — Open Runde Medium — detected in extracted data but not described by AI · `--font-open-runde-medium`
- **Weights:** 400
- **Sizes:** 11px, 12px, 14px, 17px, 28px, 40px
- **Line height:** 1.09, 1.2, 1.3, 1.33, 1.4, 1.43
- **Letter spacing:** -0.08, -0.04, -0.012, -0.01, -0.007, -0.006, -0.001, 0.02
- **Role:** Open Runde Medium — detected in extracted data but not described by AI

### Open Runde Regular — Open Runde Regular — detected in extracted data but not described by AI · `--font-open-runde-regular`
- **Weights:** 400
- **Sizes:** 12px, 13px, 14px, 17px
- **Line height:** 1.14, 1.33, 1.4, 1.43, 1.45
- **Letter spacing:** -0.012, -0.01, -0.006
- **Role:** Open Runde Regular — detected in extracted data but not described by AI

### Open Runde Bold — Open Runde Bold — detected in extracted data but not described by AI · `--font-open-runde-bold`
- **Weights:** 400
- **Sizes:** 20px, 28px
- **Line height:** 1.2, 1.4
- **Letter spacing:** -0.04, -0.01
- **Role:** Open Runde Bold — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.2 | -0.01px | `--text-caption` |
| body-sm | 14px | 1.4 | -0.01px | `--text-body-sm` |
| body | 16px | 1.49 | -0.01px | `--text-body` |
| body-lg | 18px | 1.4 | -0.01px | `--text-body-lg` |
| subheading | 20px | 1.4 | -0.04px | `--text-subheading` |
| heading-sm | 28px | 1.2 | -0.04px | `--text-heading-sm` |
| heading | 44px | 1.1 | -0.04px | `--text-heading` |
| display | 80px | 0.9 | -0.04px | `--text-display` |

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
| 52 | 52px | `--spacing-52` |
| 56 | 56px | `--spacing-56` |
| 80 | 80px | `--spacing-80` |
| 96 | 96px | `--spacing-96` |
| 100 | 100px | `--spacing-100` |
| 120 | 120px | `--spacing-120` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 100px |
| cards | 18px |
| icons | 8px |
| inputs | 12px |
| buttons | 100px |
| nav-pills | 100px |
| large-cards | 32-48px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| subtle | `rgba(228, 229, 231, 0.24) 0px 1px 2px 0px` | `--shadow-subtle` |
| subtle-2 | `rgba(36, 36, 40, 0.1) 0px 1px 2px 0px, rgba(36, 36, 40, 0...` | `--shadow-subtle-2` |
| subtle-3 | `rgba(23, 107, 197, 0.08) 0px 1px 1px 0px, rgba(23, 107, 1...` | `--shadow-subtle-3` |
| xl | `rgba(16, 55, 132, 0.03) 0px 17px 37px 0px, rgba(16, 55, 1...` | `--shadow-xl` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80-120px
- **Card padding:** 40-48px
- **Element gap:** 12-16px

## Components

### Pill Primary Button
**Role:** Hero and feature CTAs — 'Sign up for free'

Filled pill button, 100px border-radius, 12-16px vertical padding, 24px horizontal padding. Background: #070709 (Obsidian). Text: white, Open Runde 14-16px weight 500, letter-spacing -0.01em. Carries a four-layer soft drop shadow: rgba(36,36,40,0.1) 0 1px 2px, rgba(36,36,40,0.09) 0 3px 3px, rgba(36,36,40,0.05) 0 6px 4px, rgba(36,36,40,0.01) 0 11px 4px — a barely-perceptible lift.

### Outlined Ghost Button
**Role:** Secondary actions, login, utility nav

Pill-shaped (100px radius) with transparent fill, 1px border in #000 or #bebecc, Open Runde 14px weight 500 in #070709. Used in the nav bar for 'Login' — sits beside the filled Sign up button for visual contrast without competing for weight.

### Feature Card
**Role:** Large product capability cards — 'Letters' and 'Transcribe' blocks

White surface, 18-32px border-radius, generous 40-48px internal padding. Carries the signature blue-tinted shadow: rgba(16,55,132,0.03) 0 17px 37px, 0 67px 67px, 0 150px 90px — large, very low-opacity, atmospheric. Inside: pill tag at top with icon (envelope/mic in #2597d0), 28-44px heading in Open Runde weight 600, supporting copy in #60606c.

### Upload Drop Zone
**Role:** Document upload affordance inside feature cards

Dashed 1px border in #bebecc, 12px radius, 16px padding. Centered icon (envelope in #2597d0) above 12px Open Runde label. On hover: border darkens to #8b8b8b, no fill change.

### Waveform Audio Player
**Role:** Consultation recording player inside Transcribe card

White card with 12px radius, 16px padding. Horizontal waveform rendered in #2597d0 (surgical blue) against white — the single most expressive use of chromatic color in the product UI. Play/pause dot in matching blue.

### Before/After Document Card
**Role:** Hero illustration showing transformation from handwritten to typed letter

Two overlapping white cards, 12-18px radius, slight rotation for stacked effect. 'Before' card uses The Doctor FreeVersion font with cursive text; 'After' card uses Open Runde body text. Each card has a small pill tag with checkmark/icon in #2597d0 at the top.

### Top Navigation Bar
**Role:** Site-wide primary navigation

Sticky top bar, white background, 1px bottom border in #000 or transparent. Left: logo (Letters wordmark + icon). Center: horizontal nav links — 'Use cases', 'Features', 'Pricing', 'Our doctors' in Inter 14px weight 500, #070709. Right: 'Login' ghost button + 'Sign up' filled pill button (same as hero CTA).

### Pill Tag / Chip
**Role:** Category labels inside feature cards (Letters, Transcribe)

100px radius, 4-6px vertical padding, 10-14px horizontal padding. White background with 1px border in #000. Icon (envelope/mic in #2597d0) + label in Open Runde 12-14px weight 500, #070709.

### Section Heading Block
**Role:** Section intros like 'Save [5] hours a week with Letters'

Centered stack: 28-44px Open Runde heading, weight 600, letter-spacing -0.04em, #070709. Optional inline number/emoji in #2597d0 for emphasis. No subtitle — heading stands alone on white.

### Hero Headline
**Role:** Above-the-fold primary message

80px Open Runde weight 600, line-height 0.90, letter-spacing -0.04em, white text. Two lines, tight stacked rhythm. Sits centered on the sky gradient with 20-28px between lines.

### Hero Subtext
**Role:** Supporting copy below hero headline

16-18px Open Runde weight 400, line-height 1.49, letter-spacing -0.01em, white. Two short lines, centered, max-width ~480px. Color is white at 90% opacity over the sky gradient for softness.

## Do's and Don'ts

### Do
- Use 100px border-radius for all buttons, tags, and pill-shaped elements — full rounding is the signature shape language
- Set display headings at 80px Open Runde weight 600 with letter-spacing -0.04em and line-height 0.90 — the tight stack is a defining rhythm
- Use #070709 (Obsidian) for all filled CTAs — never a chromatic button background, the near-black is the action color
- Apply the sky gradient only to the hero band; keep all other sections on pure white or #f5f5f5
- Reserve #2597d0 (Surgical Blue) for icons, waveform players, and small functional accents under 24px — never as a button fill or large surface
- Use the blue-tinted shadow stack (rgba(16,55,132,0.03) at large blur radii) for feature cards to keep elevation feeling atmospheric rather than corporate
- Center-align section headings and hero text — the layout rhythm is symmetrical, not asymmetric
- Use 40-48px internal padding on feature cards to maintain the spacious, clinical density

### Don't
- Never use a chromatic color as a CTA button background — the system is intentionally monochrome for action
- Never flatten the letter-spacing on large headings — the -0.04em at 44px+ is what makes Open Runde feel confident rather than generic
- Never apply the sky gradient below the hero — it loses meaning if repeated across sections
- Never use shadows with high opacity (>0.1) on cards — the system relies on barely-visible, large-radius shadows
- Don't pair Open Runde with other geometric sans-serifs like Helvetica or Roboto — the specific humanist geometry is part of the brand
- Never use The Doctor font for functional UI text — it is decorative only, for the handwritten note illustrations
- Don't place white cards directly on the sky gradient without internal padding — the cards need breathing room from the atmospheric background
- Avoid using #2597d0 for text longer than 2 words — it is for icons and micro-graphics, not body copy

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Sky Canvas | `#779bc1` | Hero gradient background — atmospheric top band |
| 2 | Paper Canvas | `#ffffff` | Primary page background for all content sections below the hero |
| 3 | Cloud Surface | `#f5f5f5` | Card and section backgrounds that need separation from the white canvas |
| 4 | Sky Tint Surface | `#d7e6f5` | Subtle blue-tinted surface used in shadow tints and selected highlights |
| 5 | Obsidian Surface | `#070709` | Filled CTA buttons, dark mode accents, and inverse UI elements |

## Elevation

- **Feature Card:** `rgba(16, 55, 132, 0.03) 0px 17px 37px 0px, rgba(16, 55, 132, 0.03) 0px 67px 67px 0px, rgba(16, 55, 132, 0.02) 0px 150px 90px 0px`
- **Pill Primary Button:** `rgba(36, 36, 40, 0.1) 0px 1px 2px 0px, rgba(36, 36, 40, 0.09) 0px 3px 3px 0px, rgba(36, 36, 40, 0.05) 0px 6px 4px 0px, rgba(36, 36, 40, 0.01) 0px 11px 4px 0px`
- **Upload Drop Zone:** `rgba(228, 229, 231, 0.24) 0px 1px 2px 0px`
- **Blue Accent Element:** `rgba(23, 107, 197, 0.08) 0px 1px 1px 0px, rgba(23, 107, 197, 0.07) 0px 3px 3px 0px`

## Imagery

Imagery is almost entirely UI-product — no lifestyle photography, no abstract 3D renders. The visual language is built from product cards showing the app's own interface: a Before/After document comparison, an upload zone with dashed border, and a waveform audio player. The only atmospheric visual is the sky gradient hero. Icons are flat, single-color line icons in #2597d0 (envelope, microphone, checkmark) — consistent stroke weight, no filled variants. Illustration style is restrained: product mockups on white with subtle rotation for depth, never tilted dramatically. The handwritten font (The Doctor) provides the only organic/handmade element, used exclusively to evoke clinical penmanship in the Before card.

## Layout

Full-bleed sky gradient hero with centered headline and subtext, CTA pill below. Transitions seamlessly to a white content area with generous section padding (80-120px). Feature sections use a 2-column grid of large rounded cards (18-32px radius) with equal proportions. Section headings are always centered, single-column, above the card grid. Navigation is a sticky white top bar with center-aligned link cluster and right-aligned auth actions. Overall rhythm: one atmospheric hero band, then alternating white and #f5f5f5 sections with consistent vertical breathing room. No sidebar, no mega-menu, no asymmetric layouts — the page reads as a calm, symmetrical column.

## Agent Prompt Guide

## Quick Color Reference
- text (primary): #070709 Obsidian
- text (secondary): #60606c Charcoal
- background: #ffffff Paper White
- surface (alt): #f5f5f5 Cloud Gray
- border: #000000 / #bebecc (use #bebecc for hairlines)
- accent: #2597d0 Surgical Blue (icons/waveforms only)
- primary action: #070709 (filled action)

## 3-5 Example Component Prompts
1. **Hero section**: Full-bleed sky gradient background (linear-gradient 180deg, #779bc1 → #cbdcec). Centered 80px Open Runde weight 600 headline in white, letter-spacing -0.04em, line-height 0.90. Subtext: 18px Open Runde weight 400, white at 90% opacity, max-width 480px. Below: filled pill button — #070709 background, 100px radius, white text 'Sign up for free', 12px 24px padding, with the four-layer soft shadow stack.

2. **Feature card**: White surface, 18px border-radius, 48px padding. Pill tag at top (100px radius, 1px black border, 4px 12px padding) with envelope icon in #2597d0 + label 'Letters' in Open Runde 12px weight 500. Below: 28px Open Runde weight 600 heading, then 16px weight 400 body in #60606c. Drop shadow: rgba(16,55,132,0.03) at 17px/67px/150px blur radii.

3. **Upload drop zone**: 12px border-radius, 1px dashed border in #bebecc, 16px padding. Centered envelope icon in #2597d0, 12px label below in Open Runde weight 500. On hover: border darkens to #8b8b8b.

4. **Waveform audio player**: White card, 12px radius, 16px padding. Horizontal audio waveform rendered in #2597d0 Surgical Blue across full width. Play/pause dot in matching blue at left.

5. **Before/After document pair**: Two overlapping white cards (18px radius) with 8px rotation difference for stacked effect. Before card: The Doctor font cursive handwriting. After card: Open Runde 14px weight 400 body text. Each has a small pill tag with checkmark icon in #2597d0 at the top center.

6. **Top navigation**: Sticky white bar, 1px bottom border. Left: 'Letters' wordmark + icon. Center: 4 nav links in Inter 14px weight 500, #070709. Right: outlined ghost 'Login' button (1px black border, 100px radius) + filled pill 'Sign up' button (#070709, 100px radius, white text).

## Typography Quick Reference
- Display: 80px / 0.90 / -0.04em / weight 600
- Heading: 44px / 1.10 / -0.04em / weight 600
- Subheading: 28px / 1.20 / -0.04em / weight 600
- Body: 16-18px / 1.40-1.49 / -0.01em / weight 400
- Caption: 12px / 1.20 / -0.01em / weight 500

## Similar Brands

- **Linear** — Same monochrome discipline with one restrained accent color, pill-shaped CTAs, and tight geometric sans-serif headings with negative tracking
- **Notion** — Comfortable density with rounded cards floating on near-white surfaces and a minimal icon-driven visual language
- **Cal.com** — Light theme with generous card padding, 18-32px rounded corners, and a single brand color used sparingly for icons and micro-interactions
- **Mercury** — Near-black filled pill CTAs against white surfaces, clinical spaciousness, and the use of gradient hero bands as the only atmospheric color moment
- **Vercel** — Minimal monochrome palette with sharp typographic hierarchy and pill-shaped interactive elements throughout

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-obsidian: #070709;
  --color-paper-white: #ffffff;
  --color-cloud-gray: #f5f5f5;
  --color-sky-tint: #d7e6f5;
  --color-charcoal: #60606c;
  --color-slate: #8b8b8b;
  --color-ink: #151515;
  --color-surgical-blue: #2597d0;
  --color-sky-gradient: #779bc1;
  --gradient-sky-gradient: linear-gradient(180deg, #779bc1 0%, #9abfda 58%, #cbdcec 100%);

  /* Typography — Font Families */
  --font-sans-serif: 'sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-open-runde: 'Open Runde', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-the-doctor-freeversion: 'The Doctor FreeVersion', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-open-runde-semibold: 'Open Runde Semibold', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-open-runde-medium: 'Open Runde Medium', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-open-runde-regular: 'Open Runde Regular', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-open-runde-bold: 'Open Runde Bold', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.2;
  --tracking-caption: -0.01px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.4;
  --tracking-body-sm: -0.01px;
  --text-body: 16px;
  --leading-body: 1.49;
  --tracking-body: -0.01px;
  --text-body-lg: 18px;
  --leading-body-lg: 1.4;
  --tracking-body-lg: -0.01px;
  --text-subheading: 20px;
  --leading-subheading: 1.4;
  --tracking-subheading: -0.04px;
  --text-heading-sm: 28px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -0.04px;
  --text-heading: 44px;
  --leading-heading: 1.1;
  --tracking-heading: -0.04px;
  --text-display: 80px;
  --leading-display: 0.9;
  --tracking-display: -0.04px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  --font-weight-black: 900;

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
  --spacing-52: 52px;
  --spacing-56: 56px;
  --spacing-80: 80px;
  --spacing-96: 96px;
  --spacing-100: 100px;
  --spacing-120: 120px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80-120px;
  --card-padding: 40-48px;
  --element-gap: 12-16px;

  /* Border Radius */
  --radius-lg: 10px;
  --radius-2xl: 18px;
  --radius-3xl: 24px;
  --radius-3xl-2: 32px;
  --radius-3xl-3: 36px;
  --radius-3xl-4: 40px;
  --radius-full: 48px;
  --radius-full-2: 60px;
  --radius-full-3: 100px;
  --radius-full-4: 120px;
  --radius-full-5: 135px;

  /* Named Radii */
  --radius-tags: 100px;
  --radius-cards: 18px;
  --radius-icons: 8px;
  --radius-inputs: 12px;
  --radius-buttons: 100px;
  --radius-nav-pills: 100px;
  --radius-large-cards: 32-48px;

  /* Shadows */
  --shadow-subtle: rgba(228, 229, 231, 0.24) 0px 1px 2px 0px;
  --shadow-subtle-2: rgba(36, 36, 40, 0.1) 0px 1px 2px 0px, rgba(36, 36, 40, 0.09) 0px 3px 3px 0px, rgba(36, 36, 40, 0.05) 0px 6px 4px 0px, rgba(36, 36, 40, 0.01) 0px 11px 4px 0px;
  --shadow-subtle-3: rgba(23, 107, 197, 0.08) 0px 1px 1px 0px, rgba(23, 107, 197, 0.07) 0px 3px 3px 0px;
  --shadow-xl: rgba(16, 55, 132, 0.03) 0px 17px 37px 0px, rgba(16, 55, 132, 0.03) 0px 67px 67px 0px, rgba(16, 55, 132, 0.02) 0px 150px 90px 0px;

  /* Surfaces */
  --surface-sky-canvas: #779bc1;
  --surface-paper-canvas: #ffffff;
  --surface-cloud-surface: #f5f5f5;
  --surface-sky-tint-surface: #d7e6f5;
  --surface-obsidian-surface: #070709;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-obsidian: #070709;
  --color-paper-white: #ffffff;
  --color-cloud-gray: #f5f5f5;
  --color-sky-tint: #d7e6f5;
  --color-charcoal: #60606c;
  --color-slate: #8b8b8b;
  --color-ink: #151515;
  --color-surgical-blue: #2597d0;
  --color-sky-gradient: #779bc1;

  /* Typography */
  --font-sans-serif: 'sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-open-runde: 'Open Runde', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-the-doctor-freeversion: 'The Doctor FreeVersion', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-open-runde-semibold: 'Open Runde Semibold', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-open-runde-medium: 'Open Runde Medium', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-open-runde-regular: 'Open Runde Regular', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-open-runde-bold: 'Open Runde Bold', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.2;
  --tracking-caption: -0.01px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.4;
  --tracking-body-sm: -0.01px;
  --text-body: 16px;
  --leading-body: 1.49;
  --tracking-body: -0.01px;
  --text-body-lg: 18px;
  --leading-body-lg: 1.4;
  --tracking-body-lg: -0.01px;
  --text-subheading: 20px;
  --leading-subheading: 1.4;
  --tracking-subheading: -0.04px;
  --text-heading-sm: 28px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -0.04px;
  --text-heading: 44px;
  --leading-heading: 1.1;
  --tracking-heading: -0.04px;
  --text-display: 80px;
  --leading-display: 0.9;
  --tracking-display: -0.04px;

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
  --spacing-52: 52px;
  --spacing-56: 56px;
  --spacing-80: 80px;
  --spacing-96: 96px;
  --spacing-100: 100px;
  --spacing-120: 120px;

  /* Border Radius */
  --radius-lg: 10px;
  --radius-2xl: 18px;
  --radius-3xl: 24px;
  --radius-3xl-2: 32px;
  --radius-3xl-3: 36px;
  --radius-3xl-4: 40px;
  --radius-full: 48px;
  --radius-full-2: 60px;
  --radius-full-3: 100px;
  --radius-full-4: 120px;
  --radius-full-5: 135px;

  /* Shadows */
  --shadow-subtle: rgba(228, 229, 231, 0.24) 0px 1px 2px 0px;
  --shadow-subtle-2: rgba(36, 36, 40, 0.1) 0px 1px 2px 0px, rgba(36, 36, 40, 0.09) 0px 3px 3px 0px, rgba(36, 36, 40, 0.05) 0px 6px 4px 0px, rgba(36, 36, 40, 0.01) 0px 11px 4px 0px;
  --shadow-subtle-3: rgba(23, 107, 197, 0.08) 0px 1px 1px 0px, rgba(23, 107, 197, 0.07) 0px 3px 3px 0px;
  --shadow-xl: rgba(16, 55, 132, 0.03) 0px 17px 37px 0px, rgba(16, 55, 132, 0.03) 0px 67px 67px 0px, rgba(16, 55, 132, 0.02) 0px 150px 90px 0px;
}
```
