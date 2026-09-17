# Tedy — Style Reference
> Marshmallow world with a raspberry pulse — pastel surface washes on white, one hot pink doing all the urgent work.

**Theme:** light

Tedy operates in a soft pastel universe built on one disciplined trick: a near-white canvas flooded with candy-colored surface washes (lavender, mint, butter, sky) and a single hot raspberry (#fd1774) doing all the urgent work. The pink is the only saturated color in the entire system — every CTA, every action surface, every tension point comes from that one hue, with a signature raspberry-tinted shadow extending 18px below it. Typography is where the system gets unexpectedly loud: Montreal Neue hits 104px at line-height 0.90 with tracking pulled to -6.5%, producing poster-etched density that contradicts the soft surroundings — headlines are set almost on top of themselves. Radii are uniformly generous (32px on cards, 999px on buttons, nothing sharp anywhere), and the atmosphere is amplified by colored radial-gradient glows that make the white space feel lit rather than empty.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Raspberry Pulse | `#fd1774` | `--color-raspberry-pulse` | Primary CTA fill, active states, colored shadow accents — the sole saturated hue in the system, creating urgency against matte pastels |
| Ink Black | `#030712` | `--color-ink-black` | Neutral form states, badge text, and quiet UI feedback where color should stay understated. Do not promote it to the primary CTA color |
| Lavender Mist | `linear-gradient(to top, rgb(231, 214, 255) 0%, oklab(0.902604 0.0325668 -0.0481643 / 0.85) 50%, rgba(0, 0, 0, 0) 100%)` | `--color-lavender-mist` | Hero card background, testimonial card wash, section surface — the dominant pastel; Hero gradient base — soft lavender fading downward into white; Composite atmospheric glow — purple/pink/teal/amber radial halos blending on white canvas |
| Mint Cream | `#e3f7d6` | `--color-mint-cream` | Feature card surface, success-tinted badges, body wash — pastel green for nature/wellness cues |
| Butter Cream | `#fff1cd` | `--color-butter-cream` | Warning-tinted badges, warm section wash, pill highlights |
| Sky Wash | `#ddf5fb` | `--color-sky-wash` | Soft section background, alternate surface, and quiet card fill |
| Sand Wash | `#f4efe9` | `--color-sand-wash` | Warm neutral section surface, cream card backgrounds |
| Carbon | `#171717` | `--color-carbon` | Dark elevated surface for cards, headers, and contained panels. Do not promote it to the primary CTA color |
| Steel | `#6b7280` | `--color-steel` | Muted body text, secondary borders, de-emphasized labels |
| Silver | `#e5e7eb` | `--color-silver` | Hairline dividers, ghost button borders, list separators |
| Pure White | `#ffffff` | `--color-pure-white` | Page canvas, card surfaces, button text, ghost button fill |
| Lime Zest | `#64d71e` | `--color-lime-zest` | Green decorative accent for icons, marks, and small graphic details. Use as a supporting accent, not as a status color |
| Teal Current | `#4bb7cf` | `--color-teal-current` | Blue decorative accent for icons, marks, and small graphic details. Use as a supporting accent, not as a status color |

## Tokens — Typography

### Montreal Neue — Sole interface typeface. Weight 500 for nav, buttons, and emphasis; weight 400 for body. Display sizes (56–104px) use line-heights under 1.0 (0.90–0.98) with aggressive negative tracking (-0.025em to -0.065em) — this is the system's signature move. Body sizes (14–23px) sit at 1.38–1.50 line-height with minimal tracking. The contrast between poster-tight headlines and airy body copy is the rhythm. · `--font-montreal-neue`
- **Substitute:** Inter (free) or General Sans (Fontshare) — pick Inter for accessibility, General Sans for closer geometric match to Montreal Neue's round forms
- **Weights:** 400, 500
- **Sizes:** 14px, 15px, 16px, 17px, 19px, 23px, 28px, 56px, 59px, 61px, 64px, 70px, 80px, 85px, 86px, 104px
- **Line height:** 0.90 – 1.50
- **Letter spacing:** -0.065em at 104px → -0.005em at 16px, scaling with size
- **OpenType features:** `"ss01" on`
- **Role:** Sole interface typeface. Weight 500 for nav, buttons, and emphasis; weight 400 for body. Display sizes (56–104px) use line-heights under 1.0 (0.90–0.98) with aggressive negative tracking (-0.025em to -0.065em) — this is the system's signature move. Body sizes (14–23px) sit at 1.38–1.50 line-height with minimal tracking. The contrast between poster-tight headlines and airy body copy is the rhythm.

### Georgia — Sporadic decorative serif used in one card context — appears to break the sans-only system intentionally, possibly for a quoted/styled statistic. Treat as accent-only, never body. · `--font-georgia`
- **Substitute:** Source Serif Pro (free)
- **Weights:** 700
- **Sizes:** 80px
- **Line height:** normal
- **Role:** Sporadic decorative serif used in one card context — appears to break the sans-only system intentionally, possibly for a quoted/styled statistic. Treat as accent-only, never body.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 14px | 1.45 | -0.07px | `--text-caption` |
| body-sm | 16px | 1.5 | -0.08px | `--text-body-sm` |
| subheading | 23px | 1.38 | -0.12px | `--text-subheading` |
| heading-sm | 28px | 1.05 | -0.56px | `--text-heading-sm` |
| heading | 56px | 0.98 | -1.4px | `--text-heading` |
| heading-lg | 64px | 0.96 | -2.56px | `--text-heading-lg` |
| display | 80px | 0.92 | -4px | `--text-display` |
| display-xl | 104px | 0.9 | -6.76px | `--text-display-xl` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 8 | 8px | `--spacing-8` |
| 12 | 12px | `--spacing-12` |
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 28 | 28px | `--spacing-28` |
| 32 | 32px | `--spacing-32` |
| 36 | 36px | `--spacing-36` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 56 | 56px | `--spacing-56` |
| 72 | 72px | `--spacing-72` |
| 80 | 80px | `--spacing-80` |
| 84 | 84px | `--spacing-84` |
| 96 | 96px | `--spacing-96` |
| 112 | 112px | `--spacing-112` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 32px |
| badges | 32px |
| images | 24px |
| buttons | 999px |
| nav-pills | 999px |
| small-cards | 16px |
| feature-cards | 20px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| xl | `rgba(17, 24, 39, 0.16) 0px 28px 52px 0px` | `--shadow-xl` |
| subtle | `rgb(255, 241, 205) 0px 0px 0px 1px` | `--shadow-subtle` |
| xl-2 | `rgba(253, 23, 116, 0.6) 0px 14px 35px -18px` | `--shadow-xl-2` |
| subtle-2 | `rgba(255, 255, 255, 0.08) 0px 1px 0px 0px inset, rgba(255...` | `--shadow-subtle-2` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 24px
- **Element gap:** 16px

## Components

### Primary CTA Button
**Role:** Filled pill button for the main conversion action

Raspberry Pulse (#fd1774) fill, white text, 999px radius, 14px 24px padding, Montreal Neue 16px weight 500. Carries the signature colored shadow rgba(253, 23, 116, 0.6) 0px 14px 35px -18px. Use for 'Book a demo' and any single highest-priority action per screen.

### Ghost Button
**Role:** Secondary action surface

Pure white fill with Ink Black (#030712) text, 1px Silver (#e5e7eb) border, 999px radius, 14px 24px padding, 16px weight 500. Pairs beside the primary CTA. The 'Discover Tedy' variant in the hero adds a small circular icon with a Raspberry border before the label.

### Auth Button
**Role:** Account/sign-in action

Carbon (#171717) fill, white text, 999px radius, 14px 24px padding. Visually distinct from the pink CTA so users never confuse 'book a demo' with 'sign in'.

### Navigation Bar
**Role:** Top-level site navigation

White background, full-width, 18px vertical padding, 1200px max-width centered content. Logo left, nav links center (text-only with dropdown chevrons), utility controls right: language pill (EN/ON) in a white outlined pill, then primary CTA, then auth button. Nav items are 16px Montreal Neue weight 500, Ink Black.

### Hero Card
**Role:** Hero left column with headline and CTAs

Lavender Mist (#e5d6ff) fill, 32px radius, 40-48px padding, contains display-xl headline (104px, lh 0.90, tracking -0.065em), body subtext, and CTA pair stacked vertically. The lavender card is the page's most visually dominant surface.

### Photo Collage
**Role:** Hero right column image grid

2x2 grid of lifestyle photos (candid, joyful people), each image cropped with 24px radius, with 8-12px gaps. The bottom-left image overlaps slightly into the lavender card area to create depth.

### Pastel Feature Card
**Role:** Product feature explanation surface

White inner card sitting on a colored background (lavender, mint, butter, or sky), 16-20px radius, 24px padding. Contains icon container + heading + body. The card-to-background contrast is the entire visual effect — no shadow needed, just the color difference.

### Floating Product Mockup
**Role:** Screenshot/dashboard preview card

White card with a large browser-frame mockup, 32px+ radius (up to 44-48px on hero-class cards), sits on a pastel background. Carries the dramatic dark shadow stack (rgba(0,0,0,0.35) 0px 30px 80px 0px) — the most elevated element in the system. One per feature section.

### Icon Container
**Role:** Category/feature icon wrapper

Small rounded square (12-16px radius) with a pastel fill (mint, lavender, sky, butter), 24-32px padding, contains a simple line icon. Used inside feature cards and category selectors.

### Pill Badge
**Role:** Inline tag, status, or highlight

Pastel fill (mint, butter, sky, lavender) with a 1px border in the same hue family, 32px radius, 8px 14px padding, 14px Montreal Neue weight 500 Ink Black text. The outline-border treatment makes badges feel like stickers rather than blocks.

### Category Selector Card
**Role:** Multi-choice benefits category picker

White card on a pastel surface, 16px radius, 24px padding, contains a 3-column grid of icon containers. Each icon container holds a category icon (pet, health, travel, etc.) with a label below.

### Testimonial Card
**Role:** Customer quote with photo

Lavender Mist fill, 32-44px radius, split layout: left ~40% contains pull-quote text (large quote mark glyph, body copy, attribution), right ~60% contains a large candid portrait photo with 24px radius that breaks the card's right edge slightly. The photo extends beyond the card to create a 'peek' effect.

### Trust Logo Bar
**Role:** Social proof strip

White background, single row of 6-8 customer logos in grayscale, evenly distributed with generous horizontal spacing. No logo card backgrounds — logos sit directly on white. Sits between hero and first content section.

### Stat Highlight Card
**Role:** Dashboard preview stat

White card on a pastel background with a semi-circular gauge chart and metric list. Small inline pills ('You have X', 'Average impact: 680 days') use mint or butter pastel fills with 32px radius — mini version of the Pill Badge.

### Section Divider
**Role:** Visual break between content bands

No hard divider — sections are separated by switching pastel surface color and 80px vertical gap. The white-to-pastel-to-white rhythm is the divider.

## Do's and Don'ts

### Do
- Set headlines at 56px+ with line-height under 1.0 and tracking between -0.025em and -0.065em — this is the system's signature typographic move
- Use Raspberry Pulse (#fd1774) exclusively for primary CTA fills and its companion shadow — never apply it to text, icons, or decorative elements
- Apply 32px radius to all cards, images, and badges; 999px to all buttons and nav pills — no sharp corners anywhere
- Let body copy breathe at 17px / line-height 1.43 with minimal tracking (-0.005em) — the contrast between airy body and tight headlines is the rhythm
- Layer pastel surface washes (lavender, mint, butter, sky) behind white cards to create section hierarchy without shadows
- Center content at 1200px max-width with 80px section gaps — spaciousness is part of the brand
- Use Montreal Neue weight 500 for nav, buttons, and labels; weight 400 for body and descriptive text
- Place the colored radial-gradient ambient glow on the hero and key feature areas to make white space feel lit

### Don't
- Don't introduce a second saturated color — the entire accent system hinges on Raspberry Pulse being the only hot hue
- Don't set body text at display tracking (-0.04em or tighter) — tracking must scale with size
- Don't use sharp 0-4px corner radii on cards or images — the system is uniformly round
- Don't apply the Raspberry Pulse shadow to non-CTA elements — the colored shadow is reserved for the primary action
- Don't use dark UI surfaces except for the auth button and intentional dark cards — light mode is structural
- Don't set display type with line-height above 1.05 — the poster-tight stacking is essential
- Don't add new fonts — Montreal Neue carries the system; Georgia is a one-off accent only
- Don't use borders where a color contrast would work — the pastel-on-white relationship is cleaner than hairlines
- Don't set display sizes below 56px when the text is a true headline — the scale jumps are intentional

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Page Canvas | `#ffffff` | Default page background — pure white |
| 1 | Lavender Surface | `#e5d6ff` | Hero and testimonial card backgrounds |
| 1 | Mint Surface | `#e3f7d6` | Feature card backgrounds, body washes |
| 1 | Butter Surface | `#fff1cd` | Warm section washes, warning-tinted cards |
| 1 | Sky Surface | `#ddf5fb` | Cool section washes, info backgrounds |
| 1 | Sand Surface | `#f4efe9` | Warm cream card backgrounds |
| 2 | Card Surface | `#ffffff` | White cards sitting on pastel washes |
| 3 | Dark Surface | `#171717` | Auth buttons, dark image overlays |

## Elevation

- **Primary CTA Button:** `rgba(253, 23, 116, 0.6) 0px 14px 35px -18px`
- **Floating Product Mockup Card:** `inset rgba(255, 255, 255, 0.08) 0px 1px 0px 0px, inset rgba(255, 255, 255, 0.03) 0px -1px 0px 0px, rgba(0, 0, 0, 0.35) 0px 30px 80px 0px`
- **Generic Elevated Element:** `rgba(17, 24, 39, 0.16) 0px 28px 52px 0px`
- **Badge Outline:** `rgb(255, 241, 205) 0px 0px 0px 1px`

## Imagery

Photography dominates the visual system: candid, high-key lifestyle shots of diverse young adults laughing, working, and connecting — never staged corporate portraits. Images are tightly cropped, warm-toned, and arranged in 2x2 collages or as large breakout portraits that slightly exceed their card edges. Treatment is rounded (24px radius), never full-bleed, and the warm color grading harmonizes with the pastel surface washes. No illustrations, no abstract graphics, no product screenshots-as-marketing — when product UI appears, it sits inside a floating mockup card with a dramatic shadow. Iconography is line-based and minimal, living inside pastel rounded-square containers. Photography is the emotional engine; UI is the logic.

## Layout

Page model is max-width 1200px centered with generous side padding. The hero is a two-column split: lavender text card left (≈45% width) with a 2x2 photo collage right (≈55%), the bottom-left photo slightly overlapping the card to break the grid. Below the hero sits a single-row trust logo bar on white. Content sections alternate between pastel-wash backgrounds and white, each section using a 2-column layout (text left, floating mockup right) or single-column centered. Cards inside sections use white-on-pastel contrast rather than borders. Vertical rhythm is spacious — 80px between sections, 24px inside cards, 16px between elements. Navigation is a top white bar with pill-shaped utility controls; no sticky/sidebar patterns. The overall flow is: hero → trust → alternating feature bands (3-4 sections) → testimonial → footer.

## Agent Prompt Guide

**Quick Color Reference**
- text: #030712
- background: #ffffff
- border: #e5e7eb
- accent (pastel surface): #e5d6ff
- primary action: #fd1774 (filled action)

**Example Component Prompts**

1. Create a Primary Action Button: #fd1774 background, #ffffff text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.

2. *Floating product mockup*: White card (#ffffff), 32px radius, sitting on a mint (#e3f7d6) background. Contains a browser-frame UI mockup with the dark shadow stack: inset rgba(255,255,255,0.08) 0px 1px 0px, inset rgba(255,255,255,0.03) 0px -1px 0px, rgba(0,0,0,0.35) 0px 30px 80px 0px. Padding 24px.

3. *Testimonial card*: Lavender Mist (#e5d6ff) background, 32px radius, 40px padding. Two-column: left contains a quote mark glyph in Ink Black (#030712) at 48px, body quote at 19px weight 400 #030712, attribution at 14px weight 400 #6b7280. Right column contains a portrait photo at 24px radius that breaks the right card edge by ~20px.

4. *Pill badge*: Butter Cream (#fff1cd) background with matching 1px #fff1cd border, 32px radius, 8px 14px padding. Text at 14px Montreal Neue weight 500 in #030712. Use for tags, status indicators, inline highlights.

5. *Icon container*: Mint Cream (#e3f7d6) fill, 14px radius, 16px padding. Contains a line icon at 24px in #030712. Pair with a label below at 15px weight 500 #030712.

## Typography Philosophy

Montreal Neue is the single typeface. The defining contrast is between display and body: display sizes (56–104px) use line-heights of 0.90–0.98 with tracking pulled to -0.025em or tighter, creating poster-like density where lines almost touch. Body sizes (14–23px) use line-heights of 1.38–1.50 with tracking near zero, giving breathing room. Never interpolate — the gap between subheading (23px, lh 1.38) and heading-sm (28px, lh 1.05) is intentional, marking the transition from readable to sculptural. Weights are limited to 400 and 500; no bold exists in the system.

## Similar Brands

- **Headspace** — Same pastel-surface-on-white rhythm, soft rounded geometry, and warm candied color palette that signals wellness and care
- **Maven** — Similar pill-shaped buttons, generous 32px+ card radii, and a single accent color used with restraint against soft backgrounds
- **Linear** — Comparable typographic confidence — display sizes set with tight tracking and near-zero line-height to create density against airy surroundings
- **Notion** — Shares the minimalist white canvas with selective pastel washes, pill controls, and the discipline of one typeface doing everything
- **Wispr Flow** — Same approach to hero composition — pastel text card on one side, candid photo collage on the other, with the same warm/friendly tone

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-raspberry-pulse: #fd1774;
  --color-ink-black: #030712;
  --color-lavender-mist: #e5d6ff;
  --gradient-lavender-mist: linear-gradient(to top, rgb(231, 214, 255) 0%, oklab(0.902604 0.0325668 -0.0481643 / 0.85) 50%, rgba(0, 0, 0, 0) 100%);
  --color-mint-cream: #e3f7d6;
  --color-butter-cream: #fff1cd;
  --color-sky-wash: #ddf5fb;
  --color-sand-wash: #f4efe9;
  --color-carbon: #171717;
  --color-steel: #6b7280;
  --color-silver: #e5e7eb;
  --color-pure-white: #ffffff;
  --color-lime-zest: #64d71e;
  --color-teal-current: #4bb7cf;

  /* Typography — Font Families */
  --font-montreal-neue: 'Montreal Neue', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-georgia: 'Georgia', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.45;
  --tracking-caption: -0.07px;
  --text-body-sm: 16px;
  --leading-body-sm: 1.5;
  --tracking-body-sm: -0.08px;
  --text-subheading: 23px;
  --leading-subheading: 1.38;
  --tracking-subheading: -0.12px;
  --text-heading-sm: 28px;
  --leading-heading-sm: 1.05;
  --tracking-heading-sm: -0.56px;
  --text-heading: 56px;
  --leading-heading: 0.98;
  --tracking-heading: -1.4px;
  --text-heading-lg: 64px;
  --leading-heading-lg: 0.96;
  --tracking-heading-lg: -2.56px;
  --text-display: 80px;
  --leading-display: 0.92;
  --tracking-display: -4px;
  --text-display-xl: 104px;
  --leading-display-xl: 0.9;
  --tracking-display-xl: -6.76px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-72: 72px;
  --spacing-80: 80px;
  --spacing-84: 84px;
  --spacing-96: 96px;
  --spacing-112: 112px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 24px;
  --element-gap: 16px;

  /* Border Radius */
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-3xl: 24px;
  --radius-3xl-2: 32px;
  --radius-3xl-3: 44.8px;
  --radius-full: 48px;
  --radius-full-2: 57.6px;
  --radius-full-3: 999px;

  /* Named Radii */
  --radius-cards: 32px;
  --radius-badges: 32px;
  --radius-images: 24px;
  --radius-buttons: 999px;
  --radius-nav-pills: 999px;
  --radius-small-cards: 16px;
  --radius-feature-cards: 20px;

  /* Shadows */
  --shadow-xl: rgba(17, 24, 39, 0.16) 0px 28px 52px 0px;
  --shadow-subtle: rgb(255, 241, 205) 0px 0px 0px 1px;
  --shadow-xl-2: rgba(253, 23, 116, 0.6) 0px 14px 35px -18px;
  --shadow-subtle-2: rgba(255, 255, 255, 0.08) 0px 1px 0px 0px inset, rgba(255, 255, 255, 0.03) 0px -1px 0px 0px inset, rgba(0, 0, 0, 0.35) 0px 30px 80px 0px;

  /* Surfaces */
  --surface-page-canvas: #ffffff;
  --surface-lavender-surface: #e5d6ff;
  --surface-mint-surface: #e3f7d6;
  --surface-butter-surface: #fff1cd;
  --surface-sky-surface: #ddf5fb;
  --surface-sand-surface: #f4efe9;
  --surface-card-surface: #ffffff;
  --surface-dark-surface: #171717;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-raspberry-pulse: #fd1774;
  --color-ink-black: #030712;
  --color-lavender-mist: #e5d6ff;
  --color-mint-cream: #e3f7d6;
  --color-butter-cream: #fff1cd;
  --color-sky-wash: #ddf5fb;
  --color-sand-wash: #f4efe9;
  --color-carbon: #171717;
  --color-steel: #6b7280;
  --color-silver: #e5e7eb;
  --color-pure-white: #ffffff;
  --color-lime-zest: #64d71e;
  --color-teal-current: #4bb7cf;

  /* Typography */
  --font-montreal-neue: 'Montreal Neue', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-georgia: 'Georgia', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.45;
  --tracking-caption: -0.07px;
  --text-body-sm: 16px;
  --leading-body-sm: 1.5;
  --tracking-body-sm: -0.08px;
  --text-subheading: 23px;
  --leading-subheading: 1.38;
  --tracking-subheading: -0.12px;
  --text-heading-sm: 28px;
  --leading-heading-sm: 1.05;
  --tracking-heading-sm: -0.56px;
  --text-heading: 56px;
  --leading-heading: 0.98;
  --tracking-heading: -1.4px;
  --text-heading-lg: 64px;
  --leading-heading-lg: 0.96;
  --tracking-heading-lg: -2.56px;
  --text-display: 80px;
  --leading-display: 0.92;
  --tracking-display: -4px;
  --text-display-xl: 104px;
  --leading-display-xl: 0.9;
  --tracking-display-xl: -6.76px;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-72: 72px;
  --spacing-80: 80px;
  --spacing-84: 84px;
  --spacing-96: 96px;
  --spacing-112: 112px;

  /* Border Radius */
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-3xl: 24px;
  --radius-3xl-2: 32px;
  --radius-3xl-3: 44.8px;
  --radius-full: 48px;
  --radius-full-2: 57.6px;
  --radius-full-3: 999px;

  /* Shadows */
  --shadow-xl: rgba(17, 24, 39, 0.16) 0px 28px 52px 0px;
  --shadow-subtle: rgb(255, 241, 205) 0px 0px 0px 1px;
  --shadow-xl-2: rgba(253, 23, 116, 0.6) 0px 14px 35px -18px;
  --shadow-subtle-2: rgba(255, 255, 255, 0.08) 0px 1px 0px 0px inset, rgba(255, 255, 255, 0.03) 0px -1px 0px 0px inset, rgba(0, 0, 0, 0.35) 0px 30px 80px 0px;
}
```
