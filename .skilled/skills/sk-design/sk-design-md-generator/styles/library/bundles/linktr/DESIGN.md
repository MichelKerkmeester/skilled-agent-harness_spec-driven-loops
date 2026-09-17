# Linktr — Style Reference
> Editorial posters stacked like candy. A full-bleed color-block site where lime green headlines sit on cobalt blue walls and white pill-shaped navs float across maroon fields.

**Theme:** mixed

Linktree speaks in full-volume color blocks: each section is a saturated wall of lime, cobalt, or maroon, and content floats on top as white pills and dark text. The system treats color as the layout, not decoration — headers, cards, and CTAs inherit the section hue rather than fighting it, while a recurring chartreuse green acts as the brand's singular action accent. Typography is a single custom geometric sans (Linksans) set extra-bold with tight negative tracking at display sizes, giving headlines a compressed, poster-like weight. Shapes are aggressively rounded: nav bars and buttons become perfect pills, cards become lozenges, and only form inputs keep a modest 8px corner. The result reads as a series of bold editorial spreads rather than a conventional product page.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Voltage Lime | `#d2e823` | `--color-voltage-lime` | Primary action buttons, highlighted headlines, accent surfaces — the brand's signature chartreuse, used sparingly as functional punctuation across every section |
| Cobalt Signal | `#2665d6` | `--color-cobalt-signal` | Full-bleed section backgrounds, link accents — saturated blue used as an alternate hero band |
| Bordeaux Maroon | `#780016` | `--color-bordeaux-maroon` | Full-bleed FAQ and deep sections — dark wine red for high-contrast blocks |
| Midnight Ink | `#1e2330` | `--color-midnight-ink` | Primary text, icon fills, dark UI outlines — near-black with a faint blue undertone, the default ink color |
| Plaster White | `#ffffff` | `--color-plaster-white` | Card surfaces, button text, pill nav background — pure white floats above the colored sections |
| Bone Canvas | `#f3f3f1` | `--color-bone-canvas` | Page background base, subtle button surfaces — warm off-white with a faint green cast |
| Cement Gray | `#adadad` | `--color-cement-gray` | Muted card backgrounds, disabled or secondary surfaces |
| Slate Mute | `#676b5f` | `--color-slate-mute` | Muted link text, secondary borders, low-emphasis text — warm desaturated olive-gray |
| Carbon | `#222222` | `--color-carbon` | Deep button text and borders for inverted controls |
| Lilac Whisper | `#e9c0e9` | `--color-lilac-whisper` | Decorative borders, icon strokes, soft accent washes — pastel pink used for outlines and ornaments |
| Indigo Abyss | `#061492` | `--color-indigo-abyss` | Deep card surfaces, tertiary button backgrounds — saturated navy |
| Forest Depth | `#254f1a` | `--color-forest-depth` | Headline outlines, bordered cards, body emphasis — dark forest green as an alternate text color |
| Saffron | `#d6a337` | `--color-saffron` | Card accent backgrounds — warm gold for variety blocks |

## Tokens — Typography

### Arial — System fallback for form inputs and legacy text nodes — only appears as a default rendering, not a designed choice · `--font-arial`
- **Substitute:** system-ui
- **Weights:** 400
- **Sizes:** 16px
- **Line height:** 1.50
- **Role:** System fallback for form inputs and legacy text nodes — only appears as a default rendering, not a designed choice

### Linksans — Primary brand typeface — geometric custom sans used everywhere from nav to 80px display headlines. Weight 700–800 at large sizes with negative letter-spacing creates the compressed, poster-like headline voice. Substitute with Inter or Space Grotesk if Linksans is unavailable. · `--font-linksans`
- **Substitute:** Inter
- **Weights:** 400, 500, 700, 800
- **Sizes:** 12px, 13px, 14px, 15px, 20px, 24px, 25px, 51px
- **Line height:** 1.06–1.50
- **Letter spacing:** -0.043em at 80px, -0.024em at 56px, -0.020em at 24–28px, -0.013em at 18px, -0.010em at 15–16px, normal at 12–14px
- **Role:** Primary brand typeface — geometric custom sans used everywhere from nav to 80px display headlines. Weight 700–800 at large sizes with negative letter-spacing creates the compressed, poster-like headline voice. Substitute with Inter or Space Grotesk if Linksans is unavailable.

### Linksans Linksansvf — Linksans Linksansvf — detected in extracted data but not described by AI · `--font-linksans-linksansvf`
- **Weights:** 400, 500, 700, 800
- **Sizes:** 14px, 16px, 18px, 24px, 28px, 56px, 80px
- **Line height:** 1, 1.06, 1.07, 1.2, 1.3, 1.5
- **Letter spacing:** -0.02, -0.01, 0.01
- **Role:** Linksans Linksansvf — detected in extracted data but not described by AI

### yerk — yerk — detected in extracted data but not described by AI · `--font-yerk`
- **Weights:** 400
- **Sizes:** 14px
- **Line height:** 1.5
- **Role:** yerk — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.5 | — | `--text-caption` |
| body-sm | 14px | 1.5 | -0.28px | `--text-body-sm` |
| body | 16px | 1.5 | -0.16px | `--text-body` |
| subheading | 20px | 1.31 | -0.4px | `--text-subheading` |
| heading-sm | 24px | 1.2 | -0.48px | `--text-heading-sm` |
| heading | 28px | 1.2 | -0.56px | `--text-heading` |
| heading-lg | 51px | 1.06 | -1.22px | `--text-heading-lg` |
| display-alt | 56px | 1.06 | -1.34px | `--text-display-alt` |
| display | 80px | 1 | -3.44px | `--text-display` |

## Tokens — Spacing & Shapes

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 8 | 8px | `--spacing-8` |
| 10 | 10px | `--spacing-10` |
| 14 | 14px | `--spacing-14` |
| 16 | 16px | `--spacing-16` |
| 18 | 18px | `--spacing-18` |
| 20 | 20px | `--spacing-20` |
| 22 | 22px | `--spacing-22` |
| 24 | 24px | `--spacing-24` |
| 26 | 26px | `--spacing-26` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 64 | 64px | `--spacing-64` |
| 65 | 65px | `--spacing-65` |
| 128 | 128px | `--spacing-128` |
| 216 | 216px | `--spacing-216` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 8px |
| tags | 9999px |
| cards | 32px |
| pills | 1000px |
| inputs | 8px |
| buttons | 9999px |

### Layout

- **Page max-width:** 1280px
- **Section gap:** 80px
- **Card padding:** 24px
- **Element gap:** 16px

## Components

### Floating Pill Navigation
**Role:** Primary site navigation

White rounded pill floating over full-bleed color sections. Background #ffffff, radius 1000px, height ~64px, horizontal padding ~32px. Logo on left in Midnight Ink (#1e2330). Nav links in 14–15px Linksans 500 at #1e2330. Right side: ghost 'Log in' (dark text, no border) + filled black 'Sign up free' button (#000000, white text, 9999px radius, 18px 22px padding).

### Lime Primary Button
**Role:** Main call-to-action

Filled chartreuse green button. Background #d2e823, text #1e2330, radius 9999px, padding 18px 22px. Font: Linksans 700 at 16px. The signature CTA color; appears on every section. Hover darkens to #b8c91b.

### Black Sign-Up Button
**Role:** Secondary navigation action

Filled black button in the nav pill. Background #000000, text #ffffff, radius 9999px, padding 12px 20px. Font: Linksans 500 at 14–15px. Sits at the far right of the floating nav.

### Ghost Text Button
**Role:** Tertiary inline action

Text-only button with no fill or border. Text in #1e2330, Linksans 500 at 14–15px. Used for 'Log in' in nav. Hover adds underline.

### Dark Outlined Card
**Role:** Feature or FAQ card

Card with dark background and light text. Background #780016 (maroon) or #061492, text #ffffff, radius 32–64px, padding 24px. Thin 1px border in #e9c0e9 or #254f1a. Used for FAQ items and feature blocks.

### Phone Mockup Card
**Role:** Product showcase

Rounded device frame containing app screenshots. Outer container radius 32–64px, often a brand-color block. Inner phone shape radius 41.6px. Used to display Linktree profile previews at angles.

### Bordered Accent Card
**Role:** Highlighted content block

Card with visible colored border, no fill or tinted fill. Border 2px in #e9c0e9 (pink) or #254f1a (forest), radius 32–64px, padding 24–32px. Background can be #ffffff or section color. Creates a sticker-like emphasis.

### Text Input Field
**Role:** Form input

Simple input with bottom border or full border. Border 1px in #000000 or #676b5f, radius 8px, padding 8px 16px. Placeholder text in #757575. Font: Linksans 400 at 16px. Used in handle-creation form.

### Section Heading Block
**Role:** Display headline

Large headline set in 80px or 56px Linksans 800, letter-spacing -0.043em or -0.024em, line-height 1.0–1.06. Color matches section logic: Midnight Ink (#1e2330) on lime, Voltage Lime (#d2e823) on blue, Lilac Whisper (#e9c0e9) on maroon. Word-wraps in 2-line editorial stacks.

### Handle Input Group
**Role:** Profile creation form

Composite input: small fixed prefix label ('linktr.ee/') in Linksans 500, paired with a text input. Sits inline with the lime primary button to its right. White card-like container with subtle background.

### FAQ Accordion Row
**Role:** Expandable question item

Full-width row inside maroon section. Background a slightly lighter maroon, radius 16–32px, padding 20–24px. Question text in #ffffff Linksans 500 at 16–18px. Chevron icon in white, rotates 180° on expand. 1px Lilac Whisper (#e9c0e9) border possible.

### Top Banner Strip
**Role:** Promotional announcement bar

Full-width thin strip above the floating nav. Background Voltage Lime (#d2e823) or white, text #1e2330 in Linksans 500 at 13–14px. Includes a close (×) button on the right. Centers a short message with bold inline emphasis.

## Do's and Don'ts

### Do
- Use Voltage Lime (#d2e823) as the single primary action color on every section; never substitute another hue for CTAs
- Set display headlines at 56–80px Linksans 800 with negative letter-spacing (-0.024em to -0.043em) — tight tracking is signature
- Float the white pill navigation over full-bleed color sections; it should never sit on a flat white page edge
- Use pill radius (9999px) for all buttons and tags; reserve 8px only for inputs and form fields
- Apply full-bleed solid color section backgrounds as the primary layout device; avoid gradients and shadows entirely
- Pair each section's background with a single contrasting text color — Midnight Ink on lime, Voltage Lime on blue, Lilac Whisper on maroon
- Keep card radius in the 32–64px range for a lozenge, sticker-like feel on colored backgrounds

### Don't
- Don't use box-shadow or any drop-shadow effect for depth — separation must come from color contrast
- Don't set body or headline type in Arial or any system font; Linksans is non-negotiable for brand voice
- Don't use CTA colors other than #d2e823 — avoid blue, maroon, or pink buttons even when they match a section
- Don't apply tight negative letter-spacing below 18px — tracking only tightens at display sizes
- Don't break the full-bleed section model with subtle background tints or muted neutrals; sections should be loud and saturated
- Don't center body paragraphs — text blocks are left-aligned in a generous measure (max ~520px)
- Don't use square or small-radius buttons; everything clickable is a pill or lozenge
- Don't add gradients to backgrounds, buttons, or text — the system is strictly flat color

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Bone Canvas | `#f3f3f1` | Base page background, off-white warm neutral |
| 1 | Plaster White | `#ffffff` | Floating nav, cards, input fields, button text |
| 2 | Color Section Band | `#d2e823` | Full-bleed hero and content sections |
| 3 | Color Section Band Alt | `#2665d6` | Alternate full-bleed sections |
| 4 | Deep Section Band | `#780016` | FAQ and footer depth sections |
| 5 | Cement Overlay | `#adadad` | Muted overlays and secondary card backgrounds |

## Elevation

The system avoids drop shadows entirely. Depth is achieved through full-bleed color contrast — a white pill nav visibly sits on a lime or blue field, a maroon card sits on a slightly lighter maroon, a phone mockup sits on a cobalt block. No box-shadow, no blur, no glow. Flatness is the identity; separation comes from hue jumps, not elevation.

## Imagery

Photography is lifestyle-candid: real creators in real environments, shot at medium distance with natural light, often posed with props that reinforce their trade (lettering artist with a brush, food founders with ingredients). Subjects are cropped with generous breathing room and never full-bleed — they sit in contained frames to the right of text. Product visuals are angled phone mockups floating in colored space, never literal screenshots. No illustration, no abstract graphics, no 3D renders. Iconography is minimal: simple outlined or filled glyphs at small sizes, Lilac Whisper or Midnight Ink, no multicolor icon system.

## Layout

Full-bleed color sections stacked vertically, each one a different hue (lime → blue → maroon). Inside each band, a max-width ~1280px centered content column. Hero pattern is a 2-column split: oversized left-aligned headline + supporting paragraph on the left, a contained photo or device mockup on the right. Navigation is a floating white pill that sits on top of the first color band, not pinned to the page edge. Sections alternate 2-column (text+visual) and full-width stacked content (centered headline → grid). No sidebar, no sticky header beyond the floating nav. Vertical rhythm is generous (80px section gaps) and the bottom of each section is a hard color cut, never a gradient fade.

## Agent Prompt Guide

Quick Color Reference:
- text: #1e2330 (Midnight Ink)
- background: #f3f3f1 (Bone Canvas) for neutral pages, or section-specific full-bleed colors
- surface/card: #ffffff (Plaster White)
- border: #e9c0e9 (Lilac Whisper) for decorative outlines, #000000 for structural edges
- accent: #d2e823 (Voltage Lime)
- primary action: #d2e823 (filled action)

Example Component Prompts:

1. Create a Primary Action Button: #d2e823 background, #000000 text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.

2. Create a floating white pill navigation: #ffffff background, 1000px radius, ~64px height, 32px horizontal padding. Left: 'Linktree' wordmark in 20px Linksans 700, #1e2330. Center: 5 nav links in 14px Linksans 500, #1e2330, 20px gap. Right: ghost 'Log in' text button (#1e2330, no border) + filled 'Sign up free' button (#000000 fill, #ffffff text, 9999px radius, 12px 20px padding, Linksans 500 14px).


4. Create a maroon FAQ section: full-bleed background #780016. Centered headline 'Questions? Answered' in 56px Linksans 800, color #e9c0e9, letter-spacing -1.34px. Below: 4 full-width accordion rows, each with background a slightly lighter maroon, 16–32px radius, 20–24px padding, 1px #e9c0e9 border, question text in #ffffff Linksans 500 18px, and a white chevron icon on the right.

5. Create a top announcement banner: full-width strip, background #d2e823, padding 12px 16px. Centered text in 13px Linksans 500, #1e2330, with a bold inline phrase and a × close button on the far right (16px, #1e2330).

## Type System Rules

Linksans is the only designed typeface; Arial appears only as a legacy fallback in form fields and should be replaced with Linksans wherever possible. The voice is compressed and heavy: display sizes (51–80px) use weight 800 with -0.024em to -0.043em letter-spacing, subheadings (20–28px) use weight 700 with -0.013em to -0.020em, and body (14–18px) uses weight 400–500 with -0.010em to normal tracking. Never set Linksans below 12px. Line-heights collapse at display sizes (1.0–1.06) and breathe at body sizes (1.31–1.50).

## Section Color Rotation

The page cycles through bold solid colors as full-bleed section bands, typically lime → blue → maroon with occasional neutral white in between. Each section pairs its background with exactly one text accent: Midnight Ink on lime, Voltage Lime on blue, Lilac Whisper on maroon. Do not introduce new section colors beyond the four established (lime, blue, maroon, white) unless extending the palette intentionally.

## Similar Brands

- **Duolingo** — Full-bleed saturated color sections with a single lime-green action accent and rounded pill-shaped CTAs
- **Headspace** — Bold flat-color bands stacked vertically, playful rounded shapes, and a single warm accent punctuating the palette
- **Gumroad** — Loud solid-color hero sections, compressed bold display type, and a creator-first lifestyle photography style
- **Loom** — Vivid blue and purple full-bleed sections with pill navigation and oversized editorial headlines
- **Spotify Wrapped** — Saturated color-block storytelling with a single bright accent (lime) popping against deep brand hues

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-voltage-lime: #d2e823;
  --color-cobalt-signal: #2665d6;
  --color-bordeaux-maroon: #780016;
  --color-midnight-ink: #1e2330;
  --color-plaster-white: #ffffff;
  --color-bone-canvas: #f3f3f1;
  --color-cement-gray: #adadad;
  --color-slate-mute: #676b5f;
  --color-carbon: #222222;
  --color-lilac-whisper: #e9c0e9;
  --color-indigo-abyss: #061492;
  --color-forest-depth: #254f1a;
  --color-saffron: #d6a337;

  /* Typography — Font Families */
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-linksans: 'Linksans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-linksans-linksansvf: 'Linksans Linksansvf', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-yerk: 'yerk', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --tracking-body-sm: -0.28px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.16px;
  --text-subheading: 20px;
  --leading-subheading: 1.31;
  --tracking-subheading: -0.4px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -0.48px;
  --text-heading: 28px;
  --leading-heading: 1.2;
  --tracking-heading: -0.56px;
  --text-heading-lg: 51px;
  --leading-heading-lg: 1.06;
  --tracking-heading-lg: -1.22px;
  --text-display-alt: 56px;
  --leading-display-alt: 1.06;
  --tracking-display-alt: -1.34px;
  --text-display: 80px;
  --leading-display: 1;
  --tracking-display: -3.44px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-bold: 700;
  --font-weight-extrabold: 800;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-14: 14px;
  --spacing-16: 16px;
  --spacing-18: 18px;
  --spacing-20: 20px;
  --spacing-22: 22px;
  --spacing-24: 24px;
  --spacing-26: 26px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-65: 65px;
  --spacing-128: 128px;
  --spacing-216: 216px;

  /* Layout */
  --page-max-width: 1280px;
  --section-gap: 80px;
  --card-padding: 24px;
  --element-gap: 16px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-2xl: 16px;
  --radius-3xl: 29.09px;
  --radius-3xl-2: 32px;
  --radius-3xl-3: 41.6px;
  --radius-full: 64px;
  --radius-full-2: 99px;
  --radius-full-3: 1000px;

  /* Named Radii */
  --radius-nav: 8px;
  --radius-tags: 9999px;
  --radius-cards: 32px;
  --radius-pills: 1000px;
  --radius-inputs: 8px;
  --radius-buttons: 9999px;

  /* Surfaces */
  --surface-bone-canvas: #f3f3f1;
  --surface-plaster-white: #ffffff;
  --surface-color-section-band: #d2e823;
  --surface-color-section-band-alt: #2665d6;
  --surface-deep-section-band: #780016;
  --surface-cement-overlay: #adadad;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-voltage-lime: #d2e823;
  --color-cobalt-signal: #2665d6;
  --color-bordeaux-maroon: #780016;
  --color-midnight-ink: #1e2330;
  --color-plaster-white: #ffffff;
  --color-bone-canvas: #f3f3f1;
  --color-cement-gray: #adadad;
  --color-slate-mute: #676b5f;
  --color-carbon: #222222;
  --color-lilac-whisper: #e9c0e9;
  --color-indigo-abyss: #061492;
  --color-forest-depth: #254f1a;
  --color-saffron: #d6a337;

  /* Typography */
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-linksans: 'Linksans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-linksans-linksansvf: 'Linksans Linksansvf', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-yerk: 'yerk', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --tracking-body-sm: -0.28px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.16px;
  --text-subheading: 20px;
  --leading-subheading: 1.31;
  --tracking-subheading: -0.4px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -0.48px;
  --text-heading: 28px;
  --leading-heading: 1.2;
  --tracking-heading: -0.56px;
  --text-heading-lg: 51px;
  --leading-heading-lg: 1.06;
  --tracking-heading-lg: -1.22px;
  --text-display-alt: 56px;
  --leading-display-alt: 1.06;
  --tracking-display-alt: -1.34px;
  --text-display: 80px;
  --leading-display: 1;
  --tracking-display: -3.44px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-14: 14px;
  --spacing-16: 16px;
  --spacing-18: 18px;
  --spacing-20: 20px;
  --spacing-22: 22px;
  --spacing-24: 24px;
  --spacing-26: 26px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-65: 65px;
  --spacing-128: 128px;
  --spacing-216: 216px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-2xl: 16px;
  --radius-3xl: 29.09px;
  --radius-3xl-2: 32px;
  --radius-3xl-3: 41.6px;
  --radius-full: 64px;
  --radius-full-2: 99px;
  --radius-full-3: 1000px;
}
```
