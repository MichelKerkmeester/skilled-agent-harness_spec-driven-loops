# Alden — Style Reference
> serene clinic on warm parchment — a page so quiet the single blue word and sage button feel like the only sound in the room

**Theme:** light

Alden operates on an editorial healthcare register: a near-white canvas warmed by a single cream parchment surface, deep near-black typography, and exactly two chromatic accents — a whisper-soft sky blue used like a highlighter on chosen words, and a muted sage green reserved for the primary action. The system is 98% achromatic and feels intentionally clinical-but-warm, closer to a premium health magazine than a SaaS dashboard. Type mixes a geometric sans for UI with a contemporary serif for the biggest headlines, tightened by consistently negative tracking so the type sits dense and confident rather than airy. Surfaces are flat with very soft card edges (16px), buttons are fully pill-shaped, and the only decorative motion is the subtle blue wash at section edges. An AI agent should treat color as punctuation, not decoration — silence is the default state.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Parchment Cream | `#f3f1eb` | `--color-parchment-cream` | Alternate surface and product-mockup backdrop — the warm cream gives the white canvas a second, softer layer without introducing contrast noise |
| Ink Black | `#28262a` | `--color-ink-black` | Primary headings, body text, and the heaviest borders — a near-black with the faintest plum undertone, softer than pure #000 for large blocks of text |
| Graphite | `#4a4a4c` | `--color-graphite` | Secondary text, icon strokes, and lighter borders — the mid-neutral that separates captions from body without going to gray |
| Paper White | `#ffffff` | `--color-paper-white` | Page canvas and card surfaces — the dominant background across the entire system |
| Fog Border | `#dddcdd` | `--color-fog-border` | Hairline dividers, badge fills, and the softest UI separators |
| Silver | `#cbcbcb` | `--color-silver` | Mid-weight dividers and de-emphasized body borders |
| Sky Highlight | `#97cde5` | `--color-sky-highlight` | In-line accent on chosen words within headings, and soft card iconography — a dusty pastel blue that reads as annotation, never as brand chrome |
| Sage Action | `#c8dfaa` | `--color-sage-action` | Primary CTA fill and decorative wash — the only saturated fill in the interface, used sparingly so the button always feels intentional |

## Tokens — Typography

### Stk bureau Sans Book Trial — Workhorse sans for body, nav, buttons, badges, cards, and most UI. Tight tracking (-0.02em at body, scaling to -0.04em at 56px) gives it a condensed, editorial density. Substitute: Inter or Söhne. · `--font-stk-bureau-sans-book-trial`
- **Substitute:** Inter
- **Weights:** 400, 500, 600
- **Sizes:** 12, 14, 16, 18, 24, 30, 32, 40, 48, 56
- **Line height:** 1.00–1.50
- **Letter spacing:** -0.04em at 56px, -0.03em at 40px, -0.02em at 16px, 0.02em at 12px (badges)
- **Role:** Workhorse sans for body, nav, buttons, badges, cards, and most UI. Tight tracking (-0.02em at body, scaling to -0.04em at 56px) gives it a condensed, editorial density. Substitute: Inter or Söhne.

### Stk bureau Serif Book Trial — Display serif reserved for the largest editorial statements — the About headline and pull quotes. The 258px instance is a single oversized decorative mark, not a functional type size. Bring it in to add gravity to section openers; never use it in UI. Substitute: Source Serif 4 or Lora. · `--font-stk-bureau-serif-book-trial`
- **Substitute:** Source Serif 4
- **Weights:** 400, 500
- **Sizes:** 24, 40, 48, 56, 258
- **Line height:** 1.00, 1.20, 1.40
- **Letter spacing:** -0.04em at 48–56px, -0.02em at 24px
- **Role:** Display serif reserved for the largest editorial statements — the About headline and pull quotes. The 258px instance is a single oversized decorative mark, not a functional type size. Bring it in to add gravity to section openers; never use it in UI. Substitute: Source Serif 4 or Lora.

### Inter — Inter — detected in extracted data but not described by AI · `--font-inter`
- **Weights:** 400
- **Sizes:** 32px, 40px
- **Line height:** 1.2, 1.3
- **Letter spacing:** -0.02
- **Role:** Inter — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.2 | 0.24px | `--text-caption` |
| body-sm | 14px | 1.5 | -0.28px | `--text-body-sm` |
| body | 16px | 1.5 | -0.32px | `--text-body` |
| subheading | 18px | 1.4 | -0.36px | `--text-subheading` |
| heading-sm | 24px | 1.3 | -0.48px | `--text-heading-sm` |
| heading | 32px | 1.2 | -0.64px | `--text-heading` |
| heading-lg | 48px | 1.2 | -1.44px | `--text-heading-lg` |
| display | 56px | 1 | -2.24px | `--text-display` |

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
| 80 | 80px | `--spacing-80` |
| 112 | 112px | `--spacing-112` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 16px |
| badges | 30px |
| images | 24px |
| buttons | 100px |
| smallUI | 4px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 40px
- **Element gap:** 16px

## Components

### Pill Primary Button
**Role:** Main conversion action — the only saturated filled button in the system

Sage green fill (#c8dfaa), Ink Black text (#28262a), 100px border-radius, 12px vertical / 20px horizontal padding, Stk bureau Sans 16px / 500. No border, no shadow. Sits quiet against the white canvas — the color does the work, not the container.

### Ghost Navigation Link
**Role:** Top-nav and footer text links

No background, no border, Ink Black text (#28262a) at 14–16px / 400, 8px vertical / 12px horizontal hit area. No underline; active state uses the same color with weight 500.

### Hero Display Headline
**Role:** Above-the-fold statement on every primary page

Stk bureau Sans 48–56px / 400, Ink Black (#28262a), line-height 1.00, letter-spacing -1.44 to -2.24px. One phrase is swapped to Sky Highlight (#97cde5) to act as inline annotation. Centered on white canvas with the paragraph beneath at 18px.

### Editorial Section Headline
**Role:** Large body-section openers in the About and feature sections

Stk bureau Serif 40–56px / 400, Ink Black (#28262a), line-height 1.20, letter-spacing -1.44 to -2.24px, centered. One or two inline words re-colored to Sky Highlight (#97cde5) for emphasis.

### Cream Product Stage
**Role:** Container that presents UI mockups and screenshots

Parchment Cream (#f3f1eb) background, 24px corner radius on inner device frames, generous 40–48px internal padding. No shadow — the contrast between the white canvas and cream stage is the only elevation cue.

### Feature Card
**Role:** Content card on cream or white surfaces

White (#ffffff) fill, 16px border-radius, 1px Fog Border (#dddcdd) or no border at all, 40px padding. Headings 24px / 500 Ink Black, body 16px Graphite (#4a4a4c). No shadow, no hover lift.

### Pill Badge
**Role:** Category labels, status tags, inline annotations

Fog Border (#dddcdd) fill or Sky Highlight (#97cde5) fill for accent variants, Ink Black or white text, 30–50px border-radius, 8px vertical / 16px horizontal padding, Stk bureau Sans 12px / 500 with +0.24px tracking.

### Logo Strip
**Role:** Social proof band of partner / investor marks

Single horizontal row, 16px row-gap, all logos rendered monochrome (#28262a) on white. No card frame, no divider — spacing is the only separator.

### Quote Block
**Role:** Testimonial or pull-quote section

Stk bureau Serif 24–32px / 400, Ink Black, centered, with a single highlighted phrase in Sky Highlight. Attributor block beneath: 40px avatar, 14px name in 500, 12px role in Graphite. Subtle blue gradient wash anchored bottom-right.

### Decorative Blue Wash
**Role:** Atmospheric accent at section corners

Soft radial or linear gradient from Sky Highlight (#97cde5) at low opacity fading to transparent. Anchored at the bottom-right of testimonial sections. Never used as a background fill — only as edge atmosphere.

### Top Navigation Bar
**Role:** Persistent site header

White (#ffffff) background, 16px vertical padding, logo left (Alden wordmark in Ink Black 18px / 500), nav links right at 14px / 400 with 32px gaps. 'Get Started' is a Sage Action pill button. No shadow, no border-bottom.

### Avatar Stack
**Role:** Small group of headshots used as social proof or team accents

Circular 40px avatars with 1px Fog Border ring, overlapping 8–12px, arranged loosely around section openers. No labels.

## Do's and Don'ts

### Do
- Keep the canvas 98% achromatic — let Sky Highlight and Sage Action be the only chromatic pixels in any viewport.
- Use Stk bureau Sans for everything functional and switch to Stk bureau Serif only at 40px and above for editorial gravity.
- Tighten tracking aggressively: -0.04em at 56px, -0.02em at 16px. Negative letter-spacing is the system's signature.
- Use Sky Highlight (#97cde5) on individual words inside headings, not on full lines, never on backgrounds.
- Reach for 100px border-radius on every button and badge — the pill shape is non-negotiable for brand consistency.
- Use Parchment Cream (#f3f1eb) as a second surface, not as a background tint — full bands or full containers, never partial fills.
- Separate layers with contrast between white and cream rather than with shadows or borders.

### Don't
- Don't introduce a new accent color — the system is intentionally limited to sky blue and sage green.
- Don't add box-shadows. Elevation comes from the white-to-cream surface contrast, not depth.
- Don't use 24px border-radius on buttons — buttons are always fully pill-shaped at 100px.
- Don't apply Sky Highlight to body paragraphs or backgrounds — it is an in-heading annotation only.
- Don't use Inter or system fonts as the default; always load the Stk bureau (or its Inter/Source Serif substitutes) to preserve the editorial register.
- Don't center product screenshots on pure white — always stage them on Parchment Cream so the device frame reads as object, not page.
- Don't use serif for UI chrome (nav, buttons, badges, form fields) — serif is display-only.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Page Canvas | `#ffffff` | Default page background and primary reading surface |
| 2 | Parchment Band | `#f3f1eb` | Warm cream section backdrop and product-mockup stage |
| 3 | Card Surface | `#ffffff` | Elevated cards and inner panels on top of either canvas or parchment |
| 4 | Accent Wash | `#c8dfaa` | Sparingly used decorative highlight, usually behind a CTA or as section edge wash |

## Elevation

Alden deliberately avoids box-shadows. Elevation is communicated entirely through surface contrast: white cards on a cream band, or cream bands on a white canvas. The only structural line in the system is a 1px #dddcdd hairline, used sparingly. This produces a flat, editorial-documentary feel where hierarchy comes from typography scale and surface tone, not depth.

## Imagery

Imagery is almost entirely product UI mockups staged on the Parchment Cream surface — no lifestyle photography, no abstract illustration, no 3D. The hero centers a three-panel scheduling/voice agent mockup rendered as clean white cards on cream. People appear only as small circular avatar crops (40px) scattered around section openers, used as human punctuation rather than portraiture. A soft blue atmospheric wash anchors the bottom-right of the testimonial section. Iconography is mono-stroke in Ink Black, consistent 1.5px weight, drawn geometric rather than rounded. The overall visual register is editorial-documentary: the product UI is the hero, avatars are proof of people, and the blue wash is the only decorative element.

## Layout

Page is max-width ~1200px centered, but hero and product-stage sections break to full-bleed white-to-cream bands. Hero pattern is a centered headline-over-canvas with the product mockup staged on a cream band beneath. Section rhythm alternates: white canvas → cream product stage → white canvas with centered editorial headline → cream band with logo strip. Content arrangement is almost entirely centered stacks, never left-aligned text-with-side-image. The avatar accents break the symmetry by floating loosely around headlines, creating intentional negative space. The navigation is a minimal top bar with logo left and three links plus a pill CTA right; no sticky behavior, no mega-menu. Card grids are not used — the system prefers vertical centered stacks over multi-column feature grids.

## Agent Prompt Guide

## Quick Color Reference
- text: #28262a (Ink Black)
- background: #ffffff (Paper White)
- border: #dddcdd (Fog Border)
- accent: #97cde5 (Sky Highlight) — in-heading word annotation only
- primary action: #c8dfaa (filled action)
- alternate surface: #f3f1eb (Parchment Cream)

## Example Component Prompts
1. **Hero Headline**: Center on white canvas. 56px Stk bureau Sans weight 400, #28262a, letter-spacing -2.24px, line-height 1.00. Wrap the phrase 'Home Healthcare' in a span with color #97cde5. Subline at 18px / 400 / #4a4a4c, 24px below.

2. **Pill CTA Button**: Background #c8dfaa, text #28262a, 100px border-radius, 12px vertical / 20px horizontal padding, 16px Stk bureau Sans weight 500, no border, no shadow. Place 24px below the subline.

3. **Cream Product Stage**: Full-bleed #f3f1eb band, 80px vertical padding. Inside, a 24px-radius frame holding white (#ffffff) UI cards with 16px radius, 1px #dddcdd border, 40px padding. Stage width max 1100px centered.

4. **Editorial Section Headline**: 48px Stk bureau Serif weight 400, #28262a, line-height 1.20, letter-spacing -1.44px, centered on white canvas. Color the word 'healthcare' #97cde5.

5. **Pill Badge**: 30px border-radius, 8px vertical / 16px horizontal padding, #dddcdd background, 12px Stk bureau Sans weight 500, #28262a text, letter-spacing 0.24px.

## Surface & Contrast Logic

The system uses exactly two surfaces: #ffffff (Paper White) for the default reading canvas and #f3f1eb (Parchment Cream) as a second, warmer stage. Cards on either surface are always #ffffff themselves, so the card edge reads against the surrounding tone rather than via border or shadow. This white-on-white-on-cream layering is the only elevation language in the system. Sage Action (#c8dfaa) and Sky Highlight (#97cde5) are functional paints, not surface tones — they never appear as full backgrounds, only as button fills, in-heading word annotations, and edge washes.

## Similar Brands

- **Linear** — Same near-monochrome discipline with a single muted accent and pill-shaped CTAs, though Linear skews dark where Alden is editorial-light.
- **Stripe** — Equally restrained palette, centered hero, editorial serif/sans pairing, and the practice of using a single soft color as inline emphasis inside otherwise black headlines.
- **Anthropic** — Comfortable spacing, near-white canvas, pill primary buttons, and the same confidence of letting the product mockup do the visual work while chrome stays nearly invisible.
- **Aesop** — Cream-and-ink palette, serif display headlines, near-zero decorative chrome — the same editorial-documentary register applied to a different industry.

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-parchment-cream: #f3f1eb;
  --color-ink-black: #28262a;
  --color-graphite: #4a4a4c;
  --color-paper-white: #ffffff;
  --color-fog-border: #dddcdd;
  --color-silver: #cbcbcb;
  --color-sky-highlight: #97cde5;
  --color-sage-action: #c8dfaa;

  /* Typography — Font Families */
  --font-stk-bureau-sans-book-trial: 'Stk bureau Sans Book Trial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-stk-bureau-serif-book-trial: 'Stk bureau Serif Book Trial', ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.2;
  --tracking-caption: 0.24px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --tracking-body-sm: -0.28px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.32px;
  --text-subheading: 18px;
  --leading-subheading: 1.4;
  --tracking-subheading: -0.36px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.3;
  --tracking-heading-sm: -0.48px;
  --text-heading: 32px;
  --leading-heading: 1.2;
  --tracking-heading: -0.64px;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.2;
  --tracking-heading-lg: -1.44px;
  --text-display: 56px;
  --leading-display: 1;
  --tracking-display: -2.24px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;

  /* Spacing */
  --spacing-unit: 8px;
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-112: 112px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 40px;
  --element-gap: 16px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-3xl: 24px;
  --radius-3xl-2: 30px;
  --radius-full: 50px;
  --radius-full-2: 100px;

  /* Named Radii */
  --radius-cards: 16px;
  --radius-badges: 30px;
  --radius-images: 24px;
  --radius-buttons: 100px;
  --radius-smallui: 4px;

  /* Surfaces */
  --surface-page-canvas: #ffffff;
  --surface-parchment-band: #f3f1eb;
  --surface-card-surface: #ffffff;
  --surface-accent-wash: #c8dfaa;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-parchment-cream: #f3f1eb;
  --color-ink-black: #28262a;
  --color-graphite: #4a4a4c;
  --color-paper-white: #ffffff;
  --color-fog-border: #dddcdd;
  --color-silver: #cbcbcb;
  --color-sky-highlight: #97cde5;
  --color-sage-action: #c8dfaa;

  /* Typography */
  --font-stk-bureau-sans-book-trial: 'Stk bureau Sans Book Trial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-stk-bureau-serif-book-trial: 'Stk bureau Serif Book Trial', ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.2;
  --tracking-caption: 0.24px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --tracking-body-sm: -0.28px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.32px;
  --text-subheading: 18px;
  --leading-subheading: 1.4;
  --tracking-subheading: -0.36px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.3;
  --tracking-heading-sm: -0.48px;
  --text-heading: 32px;
  --leading-heading: 1.2;
  --tracking-heading: -0.64px;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.2;
  --tracking-heading-lg: -1.44px;
  --text-display: 56px;
  --leading-display: 1;
  --tracking-display: -2.24px;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-112: 112px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-3xl: 24px;
  --radius-3xl-2: 30px;
  --radius-full: 50px;
  --radius-full-2: 100px;
}
```
