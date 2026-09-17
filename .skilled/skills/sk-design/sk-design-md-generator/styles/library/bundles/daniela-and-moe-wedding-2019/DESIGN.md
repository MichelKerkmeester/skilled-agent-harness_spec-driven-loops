# Daniela and Moe Wedding 2019 — Style Reference
> Botanical wedding invitation on blush paper — editorial, hand-drawn, sun-warmed.

**Theme:** light

A warm, editorial wedding invitation language: a blush peach canvas, two-font system (delicate serif display + clean geometric sans), and oversized organic botanical illustrations that bleed off every edge. The palette is earthy and natural — deep navy ink for text, coral-vermillion as the single warm accent for borders and interactive moments, and muted greens, mustards, and dusty pinks living inside the foliage artwork. Layout is centered, generous, and almost magazine-like, with wide tracking on small-caps labels that whisper rather than shout. Every interactive element is a full pill (200px radius), every text block breathes with 32-48px vertical rhythm, and the overall feeling is hand-illustrated, sunlit, and unhurried.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Blush Canvas | `#fef1ec` | `--color-blush-canvas` | Primary page background, section backgrounds, hero canvas — the warm paper tone that carries every screen |
| Ink Navy | `#11223f` | `--color-ink-navy` | Primary text, headings, nav links, body copy, input borders — the only dark anchor in the system |
| Coral Vermillion | `#ff5734` | `--color-coral-vermillion` | Outlined link/action borders, active nav underline, button borders — the single warm accent that gives interactive elements their warmth |
| Dusty Peach | `#f6bba4` | `--color-dusty-peach` | Secondary surface tint, card accents, illustration fills — the softer sibling of the canvas |
| Forest Ink | `#193c35` | `--color-forest-ink` | Botanical illustration dark foliage — the deepest green in the artwork palette |
| Olive Grove | `#7e813c` | `--color-olive-grove` | Botanical illustration mid-tone leaves and stems |
| Mustard Bloom | `#e5ba2b` | `--color-mustard-bloom` | Botanical illustration flower accents — warm yellow punctuation in the foliage |
| Ember Orange | `#ec4f22` | `--color-ember-orange` | Botanical illustration bright flower highlights — the vividest warm note in the artwork |
| Sage Mist | `#c6d7d0` | `--color-sage-mist` | Botanical illustration soft greenery, dot patterns — the coolest note in the foliage |
| Deep Indigo | `#092a49` | `--color-deep-indigo` | Botanical illustration line work, fine stroke details |
| Pure White | `#ffffff` | `--color-pure-white` | Neutral form states, badge text, and quiet UI feedback where color should stay understated. Do not promote it to the primary CTA color |

## Tokens — Typography

### Canela Web — Display and headings — ultra-light 100 weight at 120px for the couple's names creates a high-contrast, fashion-editorial feeling. The 0.85 line-height at display size lets descenders and ascenders nearly touch. Mid-weights at 28-48px for section headings, all in serif italics where the brand allows. · `--font-canela-web`
- **Substitute:** Playfair Display, Cormorant Garamond, or DM Serif Display
- **Weights:** 100, 400, 500
- **Sizes:** 24, 28, 32, 48, 120px
- **Line height:** 0.85, 1.0, 1.2, 1.3, 1.4, 1.6, 2.0
- **Letter spacing:** normal
- **Role:** Display and headings — ultra-light 100 weight at 120px for the couple's names creates a high-contrast, fashion-editorial feeling. The 0.85 line-height at display size lets descenders and ascenders nearly touch. Mid-weights at 28-48px for section headings, all in serif italics where the brand allows.

### Calibre — Body, UI, labels, and secondary headings. The 0.2em letter-spacing transforms body text into small-caps labels and tracked section markers ("OUR STORY", "OCTOBER 18TH 2019"). Weight 300 for body paragraphs, 500 for emphasis. This font carries all functional text while Canela handles the poetry. · `--font-calibre`
- **Substitute:** Inter, Söhne, or Neue Haas Grotesk
- **Weights:** 300, 400, 500
- **Sizes:** 12, 16, 20, 24, 36, 48px
- **Line height:** 1.2, 1.4, 1.6, 2.0
- **Letter spacing:** 0.2em
- **Role:** Body, UI, labels, and secondary headings. The 0.2em letter-spacing transforms body text into small-caps labels and tracked section markers ("OUR STORY", "OCTOBER 18TH 2019"). Weight 300 for body paragraphs, 500 for emphasis. This font carries all functional text while Canela handles the poetry.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.6 | 2.4px | `--text-caption` |
| body-sm | 16px | 2 | — | `--text-body-sm` |
| body | 20px | 1.6 | — | `--text-body` |
| subheading | 24px | 1.4 | — | `--text-subheading` |
| heading-sm | 28px | 1.3 | — | `--text-heading-sm` |
| heading | 36px | 1.4 | — | `--text-heading` |
| heading-lg | 48px | 1.2 | — | `--text-heading-lg` |
| display | 120px | 0.85 | — | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 8px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 16 | 16px | `--spacing-16` |
| 24 | 24px | `--spacing-24` |
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 56 | 56px | `--spacing-56` |
| 64 | 64px | `--spacing-64` |
| 96 | 96px | `--spacing-96` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 200px |
| cards | 0px |
| inputs | 0px |
| buttons | 200px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 32px
- **Element gap:** 20px

## Components

### Pill Navigation Button
**Role:** Top nav links and interactive links

Text-only with 1-2px solid bottom border in Coral Vermillion (#ff5734). Calibre weight 400, ~16px, letter-spacing 0.2em. No background fill. The colored underline appears on hover/active. 200px border-radius despite being text links — the pill system is universal.

### Outlined Pill Button
**Role:** Primary action buttons (RSVP, etc.)

1-2px solid border in Coral Vermillion (#ff5734), no fill, 200px border-radius. Padding approximately 6px 24px. Calibre weight 500, 12-16px, letter-spacing 0.2em, uppercase. White or blush background.

### White Quiz Card
**Role:** Fun Facts grid items

Pure white (#ffffff) surface, no border, no shadow, no radius. Padding ~20-32px. Contains a line-art icon (64-80px) centered above a Calibre 16px label. Icons are thin-stroke line illustrations in #000000 or coral.

### Botanical Illustration Frame
**Role:** Decorative section edges

Full-bleed organic foliage in #193c35, #7e813c, #e5ba2b, #ec4f22, #c6d7d0. Flat vector style with no gradients. Abstract shapes that bleed off page edges. No border, no container — the illustration IS the container.

### Hero Name Display
**Role:** Couple's names centerpiece

Canela Web weight 100, 120px, line-height 0.85, color #11223f. Centered. The × or & between names is rendered as a thin coral line. No bold — the ultra-light weight is the signature.

### Date Eyebrow
**Role:** Date label above hero name

Calibre weight 400, 14-16px, letter-spacing 0.2em, uppercase, color #11223f. Centered. Sits 32-48px above the display name.

### Line-Art Icon
**Role:** Quiz card icons, decorative marks

Thin-stroke (1-1.5px) line illustrations in #000000 or #11223f. No fill, no color. Organic, hand-drawn quality. Size 60-80px. Abstract and minimal.

### Body Paragraph
**Role:** Long-form story text

Calibre weight 300, 20px, line-height 1.6-2.0, color #11223f. Max-width ~600px centered. Generous line-height creates the breathing room of editorial print.

### Section Heading (Serif Caps)
**Role:** Section titles ("DANCE, DANCE, DANCE")

Canela Web weight 400, 28-36px, uppercase, letter-spacing slightly tracked, color #11223f. Centered. Serif caps creates a typographic counterpoint to the sans-serif labels.

### Quiz Grid Container
**Role:** Fun Facts card grid

4-column grid of white cards on blush canvas. Gap ~4px between cards (tight grid). The grid sits inside a blush border frame. Each cell is equal-width.

### Hover Underline
**Role:** Interactive feedback for links and nav

1-2px solid line in Coral Vermillion (#ff5734) appears below text on hover. No color change, no background — just the underline materializing. Minimal, quiet interaction.

## Do's and Don'ts

### Do
- Use 200px border-radius on every button, tag, and pill-shaped element — the pill is the only shape language in the system
- Apply 0.2em letter-spacing to all Calibre text, especially labels, nav, and small caps
- Use Canela Web weight 100 at 120px for the hero name display — the ultra-light serif is the signature
- Set page backgrounds to Blush Canvas (#fef1ec) — never use pure white for section backgrounds
- Use #11223f for all text — never default to #000000 for body copy
- Let botanical illustrations bleed off page edges — contain them in rectangles and the design loses its hand
- Keep cards borderless and shadowless — depth comes from white-on-blush contrast, not elevation

### Don't
- Don't use bold weights (600+) for headings — the system whispers with 100-400 weights
- Don't use sharp corners on interactive elements — 200px pill radius is mandatory for buttons and tags
- Don't add drop shadows or box-shadows anywhere — the flat aesthetic is intentional
- Don't use #000000 for body text — use #11223f (Ink Navy) for warmth
- Don't use multiple accent colors for actions — Coral Vermillion (#ff5734) is the only warm accent
- Don't center-align long paragraphs — body text should be max-width ~600px, left-aligned within its centered container
- Don't use system fonts or sans-serifs for display text — Canela Web (or a quality serif substitute) is required for the hero and section headings

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Blush Canvas | `#fef1ec` | Base page background, hero section, story section — the warm paper tone |
| 1 | White Card | `#ffffff` | Quiz cards, content cards — clean white blocks floating on the blush canvas |
| 2 | Dusty Peach | `#f6bba4` | Inner card accents, illustration fills, soft surface highlights |

## Elevation

No shadows. The design uses flat color blocking and the blush canvas as the only depth mechanism. Cards are pure white blocks on the warm background — depth comes from contrast, not elevation.

## Imagery

Hand-drawn abstract botanical illustrations are the primary visual content. Style is flat vector, organic shapes, no gradients or shading — like a risograph print. Color palette within illustrations: Forest Ink (#193c35), Olive Grove (#7e813c), Mustard Bloom (#e5ba2b), Ember Orange (#ec4f22), Sage Mist (#c6d7d0), Dusty Peach (#f6bba4). Illustrations bleed off all four edges of the hero and section backgrounds, creating an immersive garden frame. Secondary visual content: thin-stroke line-art icons in black or navy for the quiz cards — hand-drawn quality, organic, minimal detail. No photography, no 3D, no gradients.

## Layout

Centered, single-column editorial layout. Max-width ~1200px for the overall page; content blocks are narrower (~600-800px) and centered. Hero is full-viewport height with botanical illustration framing the couple's names. Sections flow vertically with generous 80px+ gaps, each on the same Blush Canvas background. The Fun Facts section uses a 4-column grid of white cards inside a blush border frame. Navigation is a simple top bar, centered, with spaced serif links. No sidebar, no multi-column page layouts — everything is a centered stack.

## Agent Prompt Guide

## Quick Color Reference
- Primary text: #11223f (Ink Navy)
- Canvas/background: #fef1ec (Blush Canvas)
- Card surface: #ffffff (Pure White)
- Accent/interactive: #ff5734 (Coral Vermillion)
- Secondary surface: #f6bba4 (Dusty Peach)
- primary action: #ff5734 (filled action)

## Example Component Prompts

1. **Hero Name Display**: Canela Web weight 100, 120px, line-height 0.85, color #11223f, centered. A thin coral (#ff5734) × or & symbol between the two names. Above it, a Calibre 14px date label with 0.2em letter-spacing, uppercase, centered, 40px gap.

2. **Pill Navigation Button**: Calibre weight 400, 16px, letter-spacing 0.2em, uppercase, color #11223f. No background. On hover, a 1-2px solid bottom border in #ff5734 appears. Padding 8px 12px. Top of page, horizontally centered with 24-32px gaps between links.

3. **White Quiz Card**: Background #ffffff, no border, no shadow, no border-radius. Padding 24px 20px. Contains a 64px thin-stroke line-art icon in #000000 centered above, and a Calibre 16px label centered below. Arranged in a 4-column grid with 4px gaps.

4. **Section Heading Block**: Calibre 12px label with 0.2em letter-spacing, uppercase, color #11223f, centered. 24px gap below. Canela Web weight 400, 32px, uppercase, color #11223f, centered. 32px gap below. Calibre weight 300, 20px, line-height 1.6, color #11223f, max-width 600px, centered.

5. **Outlined Action Button**: Calibre weight 500, 14px, letter-spacing 0.2em, uppercase, color #ff5734. 1-2px solid border in #ff5734, no fill. Padding 8px 24px. Border-radius 200px. Background transparent over blush canvas.

## Illustration System

Botanical illustrations follow a strict flat-vector, no-gradient, organic-shape style. Only these colors are permitted in artwork: #193c35 (deepest dark), #7e813c (olive), #e5ba2b (mustard), #ec4f22 (ember), #c6d7d0 (sage), #f6bba4 (peach), #11223f (fine line work). Shapes should feel hand-cut and asymmetric — leaves, flowers, stems, and organic blobs. Illustrations always bleed off at least one page edge. No photographic elements, no 3D, no shadows within artwork.

## Similar Brands

- **Minted Wedding Suite** — Same editorial serif-plus-tracked-sans combo, blush backgrounds, and hand-illustrated botanical accents
- **Joy (wedding platform)** — Same warm earthy palette, organic line-art icons, and generous centered editorial layouts
- **The Knot Invitations** — Same serif display headings, dusty warm backgrounds, and botancial illustration framing
- **Paperless Post** — Same pill-button outlines, tracked sans-serif labels, and illustrated invitation aesthetic
- **Withjoy** — Same warm peach/earth palette, serif hero names, and minimal shadow-free card layouts

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-blush-canvas: #fef1ec;
  --color-ink-navy: #11223f;
  --color-coral-vermillion: #ff5734;
  --color-dusty-peach: #f6bba4;
  --color-forest-ink: #193c35;
  --color-olive-grove: #7e813c;
  --color-mustard-bloom: #e5ba2b;
  --color-ember-orange: #ec4f22;
  --color-sage-mist: #c6d7d0;
  --color-deep-indigo: #092a49;
  --color-pure-white: #ffffff;

  /* Typography — Font Families */
  --font-canela-web: 'Canela Web', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-calibre: 'Calibre', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.6;
  --tracking-caption: 2.4px;
  --text-body-sm: 16px;
  --leading-body-sm: 2;
  --text-body: 20px;
  --leading-body: 1.6;
  --text-subheading: 24px;
  --leading-subheading: 1.4;
  --text-heading-sm: 28px;
  --leading-heading-sm: 1.3;
  --text-heading: 36px;
  --leading-heading: 1.4;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.2;
  --text-display: 120px;
  --leading-display: 0.85;

  /* Typography — Weights */
  --font-weight-thin: 100;
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-medium: 500;

  /* Spacing */
  --spacing-unit: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-64: 64px;
  --spacing-96: 96px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 32px;
  --element-gap: 20px;

  /* Border Radius */
  --radius-full: 200px;

  /* Named Radii */
  --radius-tags: 200px;
  --radius-cards: 0px;
  --radius-inputs: 0px;
  --radius-buttons: 200px;

  /* Surfaces */
  --surface-blush-canvas: #fef1ec;
  --surface-white-card: #ffffff;
  --surface-dusty-peach: #f6bba4;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-blush-canvas: #fef1ec;
  --color-ink-navy: #11223f;
  --color-coral-vermillion: #ff5734;
  --color-dusty-peach: #f6bba4;
  --color-forest-ink: #193c35;
  --color-olive-grove: #7e813c;
  --color-mustard-bloom: #e5ba2b;
  --color-ember-orange: #ec4f22;
  --color-sage-mist: #c6d7d0;
  --color-deep-indigo: #092a49;
  --color-pure-white: #ffffff;

  /* Typography */
  --font-canela-web: 'Canela Web', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-calibre: 'Calibre', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.6;
  --tracking-caption: 2.4px;
  --text-body-sm: 16px;
  --leading-body-sm: 2;
  --text-body: 20px;
  --leading-body: 1.6;
  --text-subheading: 24px;
  --leading-subheading: 1.4;
  --text-heading-sm: 28px;
  --leading-heading-sm: 1.3;
  --text-heading: 36px;
  --leading-heading: 1.4;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.2;
  --text-display: 120px;
  --leading-display: 0.85;

  /* Spacing */
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-64: 64px;
  --spacing-96: 96px;

  /* Border Radius */
  --radius-full: 200px;
}
```
