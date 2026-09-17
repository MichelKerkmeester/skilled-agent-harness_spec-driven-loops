# Magicbeans — Style Reference
> Notion whiteboard with confetti

**Theme:** light

Magicbeans uses a playful Notion-adjacent language: warm off-white canvas, a single near-black pill CTA, and saturated color reserved exclusively for decorative squiggles and inline icons. The hero is the only loud element — a massive bold headline at 64px — and everything else stays quiet, monochrome, and border-driven rather than shadow-driven. Color functions as punctuation, never as structure: orange, green, and blue appear as tiny inline glyphs and wavy hand-drawn strokes scattered around the page edges, never as fills or buttons. Cards float on white against a slightly warm cream background, delineated by hairline gray borders rather than elevation, with a single layered card shadow used sparingly for the product screenshot only.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Ink Black | `#1a1a19` | `--color-ink-black` | Primary text, pill CTA background, logo mark, icon strokes — near-black rather than pure black gives a softer, warmer feel than #000000 |
| Pure Black | `#000000` | `--color-pure-black` | Occasional hard-black fills for high-contrast accents and announcement bar |
| Charcoal | `#333331` | `--color-charcoal` | Body text, link color, secondary headings — warmer than Ink Black, used when pure black feels too heavy |
| Slate Gray | `#808080` | `--color-slate-gray` | Muted helper text, placeholder content, disabled states |
| Hairline | `#e5e7eb` | `--color-hairline` | Default border for cards, inputs, icons, nav separators, and table dividers — the most-used color in the entire system |
| Cloud | `#f0f0f0` | `--color-cloud` | Secondary card borders, subtle structural outlines |
| Warm Canvas | `#faf9f7` | `--color-warm-canvas` | Page background — the slightly warm off-white that distinguishes this from a sterile pure-white SaaS look |
| Pure White | `#ffffff` | `--color-pure-white` | Card surfaces, button text, elevated panels — the layer above the warm canvas |
| Mint Wash | `#eaf7f0` | `--color-mint-wash` | Soft green-tinted surface wash for highlighted sections, tag backgrounds, subtle callout zones |
| Bean Orange | `#ff5310` | `--color-bean-orange` | Decorative squiggle strokes, inline icon accent, brand heartbeat — warm vivid orange that defines the playful personality |
| Bean Green | `#44c67f` | `--color-bean-green` | Decorative squiggle fills, inline icon accent, growth-positive visual cue — saturated mid-green for energy without screaming |
| Bean Blue | `#0098f1` | `--color-bean-blue` | Decorative squiggle outlines, inline icon accent — the third color in the confetti triad used sparingly |
| Mint Border | `#81e9b0` | `--color-mint-border` | Green outline accent for tags, dividers, and focused UI edges |

## Tokens — Typography

### Inter — All text — single-family system. Hero at 64px/weight 600+ is the loudest element; body sits at 16-17px/weight 400. Inter is the obvious Notion-native choice, so it feels native to the product it serves. Weight 500 carries nav and button labels; 600-700 reserved for headlines. · `--font-inter`
- **Substitute:** system-ui, -apple-system, 'Segoe UI', sans-serif
- **Weights:** 400, 500, 600, 700
- **Sizes:** 13, 14, 15, 16, 17, 24, 40, 64
- **Line height:** 1.2 (body), 1.0 (hero)
- **Letter spacing:** normal at all sizes — Inter's natural tracking is tight enough that the 64px headline reads as confident rather than loose
- **OpenType features:** `"cv11", "ss01" on for the single-story 'a' and alternate 'l' — gives Inter a more characterful, less generic look`
- **Role:** All text — single-family system. Hero at 64px/weight 600+ is the loudest element; body sits at 16-17px/weight 400. Inter is the obvious Notion-native choice, so it feels native to the product it serves. Weight 500 carries nav and button labels; 600-700 reserved for headlines.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 13px | 1.5 | — | `--text-caption` |
| body-lg | 17px | 1.5 | — | `--text-body-lg` |
| subheading | 24px | 1.33 | — | `--text-subheading` |
| heading-sm | 40px | 1.2 | — | `--text-heading-sm` |
| display | 64px | 1 | — | `--text-display` |

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
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |
| 200 | 200px | `--spacing-200` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 8px |
| tags | 9999px |
| cards | 12-16px |
| inputs | 8px |
| buttons | 9999px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| xl | `rgba(0, 0, 0, 0.01) 0px 94px 38px 0px, rgba(0, 0, 0, 0.02...` | `--shadow-xl` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80-100px
- **Card padding:** 32px
- **Element gap:** 8-16px

## Components

### Pill Primary CTA
**Role:** The single call-to-action — always near-black with white text, fully rounded

Background #1a1a19, text #ffffff, Inter weight 500 at 16px, border-radius 9999px, padding 12px 24px. Used for the main action on every page. Inherits Notion's button language — small, confident, never oversized.

### Ghost Text Link
**Role:** Secondary navigation and inline links

Text only, no background or border. Inter weight 400-500 at 14-16px in #1a1a19. Hover state is opacity 0.7. Examples: 'Pricing', 'Twitter' in the nav.

### Product Preview Card
**Role:** The dashboard screenshot container — the hero visual asset

Background #ffffff, border-radius 16px, the layered multi-stop shadow (rgba 0.01→0.04 over 94px vertical spread). This is the only component that uses a shadow stack — it gives the product screenshot a 'floating above the page' quality without looking heavy.

### Hairline-Bordered Card
**Role:** Standard content card for features, pricing tiers, or content blocks

Background #ffffff, border 1px solid #e5e7eb, border-radius 12px, padding 32px. No shadow — borders do the structural work. Keeps the page feeling light and Notion-document-like.

### Mint-Highlighted Card
**Role:** Featured/active card variant with green accent border

Same as hairline card but border-color #81e9b0 instead of #e5e7eb. Background may be #eaf7f0. Used to draw attention to recommended pricing tier or a featured feature.

### Announcement Bar
**Role:** Top-of-page message strip

Background #000000, text #ffffff, Inter weight 500 at 13-14px, centered, padding 6-8px vertical. High contrast to break from the warm canvas.

### Squiggle Decoration
**Role:** Hand-drawn wavy lines scattered around page edges

SVG strokes in #ff5310, #44c67f, or #0098f1. Appear as decorative accents near hero, feature sections, and footer. Stroke-width approximately 4-6px, no fill, freeform curves. These define the brand's playful personality.

### Inline Brand Icon
**Role:** Small colored glyphs embedded inside the hero headline

SVG icons in Bean Orange and Bean Green placed inline with hero text (e.g., the heart/bean icons in 'Your finances & invoices'). Size approximately 48-56px to match the cap-height of 64px Inter bold. These are the only place saturated color meets typography.

### Nav Bar
**Role:** Top navigation — minimal, asymmetric

Logo left ('● magic beans' with small dot glyph), 2 text links right. Background transparent over #faf9f7. Height approximately 60-64px, no border, no shadow. Padding 0 24px.

### Footer Background
**Role:** Page footer surface

Background #faf9f7 matching canvas — no visual break, just structural separation by content.

### Feature Icon Set
**Role:** Small outlined icons for feature lists or grid cards

Stroke-only, 1.5-2px stroke weight, color #1a1a19, typically 20-24px. Never filled. Notion-style line icons.

## Do's and Don'ts

### Do
- Use #1a1a19 for all primary CTAs — never use a chromatic color as a button background
- Reserve saturated color (#ff5310, #44c67f, #0098f1) exclusively for decorative squiggles and inline icons — never as fills, backgrounds, or large text
- Use 1px solid #e5e7eb for all card and input borders; avoid shadows except on the product preview card
- Set page background to #faf9f7, not #ffffff — the warm off-white is what distinguishes the brand from generic SaaS
- Use border-radius 9999px for all buttons, tags, and pills; 12-16px for cards; 8px for nav and inputs
- Set the hero headline at 64px Inter weight 600-700 with line-height 1.0 — the massive headline is the page's visual anchor
- Include 3 hand-drawn squiggle decorations per major page section in rotating Bean Orange, Green, and Blue

### Don't
- Don't use #ff5310, #44c67f, or #0098f1 as CTA button backgrounds or large filled shapes — they are decorative only
- Don't apply heavy drop-shadows to content cards — only the product preview card gets elevation
- Don't use pure white #ffffff as the page background — always use #faf9f7 for the warm canvas
- Don't use border-radius below 8px on any element — the minimum radius in this system is 8px
- Don't introduce new chromatic colors outside the Bean Orange/Green/Blue triad + Mint accent
- Don't use letter-spacing modifications — Inter's natural tracking is already correct for all sizes
- Don't set body text below 14px or above 17px — the type system is intentionally compact for a productivity-tool feel

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Warm Canvas | `#faf9f7` | Page background — the warm off-white that softens the entire page |
| 1 | Pure White | `#ffffff` | Card surfaces, elevated content, product screenshots |
| 2 | Mint Wash | `#eaf7f0` | Highlighted/featured card backgrounds, soft callout zones |
| 3 | Charcoal Pop | `#1a1a19` | CTA buttons, announcement bars, logo mark — the darkest surface |

## Elevation

- **Product Preview Card:** `0px 6px 13px rgba(0,0,0,0.04), 0px 24px 24px rgba(0,0,0,0.03), 0px 53px 32px rgba(0,0,0,0.02), 0px 94px 38px rgba(0,0,0,0.01)`

## Imagery

No photography or product photography — the visual language is pure UI and hand-drawn decoration. The hero features a large product screenshot (Notion dashboard) as a single floating card. Decorative squiggles in orange, green, and blue are hand-drawn SVG strokes (not illustrations or icons) placed asymmetrically around page edges. Icons are thin-stroke line icons in #1a1a19, never filled. The overall visual register is 'playful productivity app' — the squiggles add personality that a sterile invoicing tool wouldn't have, but the absence of illustration or photography keeps it document-native.

## Layout

Max-width 1200px centered. Hero is a centered single-column stack: massive 64px headline with inline colored icons, small body subtext, then black pill CTA. Below the hero, a single product preview card (dashboard screenshot) floats full-width with the layered shadow. The page uses generous vertical breathing room — 80-100px section gaps. Navigation is a minimal top bar with logo left and 2 text links right, no hamburger. Content sections are centered text blocks, not multi-column grids. The overall density is low — this is a marketing landing page, not a dashboard.

## Agent Prompt Guide

**Quick Color Reference**
- text: #1a1a19
- background: #faf9f7
- card surface: #ffffff
- border: #e5e7eb
- accent (decorative): #ff5310 / #44c67f / #0098f1
- primary action: no distinct CTA color

**Example Component Prompts**

1. Create a hero section: background #faf9f7. Headline 'Your finances & invoices powered by Notion' at 64px Inter weight 600, color #1a1a19, line-height 1.0, centered. Embed a 48px orange #ff5310 heart icon inline after 'finances' and a 48px green #44c67f paper-plane icon inline before 'invoices'. Subtext at 17px Inter weight 400, color #333331, max-width 560px, centered, 24px below headline. Black pill button below subtext: bg #1a1a19, text #ffffff, Inter 16px weight 500, border-radius 9999px, padding 12px 24px, 24px gap above.

2. Create a product preview card: container with background #ffffff, border-radius 16px, padding 0 (image bleeds to edges), and shadow 0px 6px 13px rgba(0,0,0,0.04), 0px 24px 24px rgba(0,0,0,0.03), 0px 53px 32px rgba(0,0,0,0.02), 0px 94px 38px rgba(0,0,0,0.01). Max-width 900px, centered.

3. Create a feature card: background #ffffff, border 1px solid #e5e7eb, border-radius 12px, padding 32px. Title at 24px Inter weight 600 #1a1a19, body at 16px Inter weight 400 #333331, 16px gap between title and body. Optional 24px line-icon in #1a1a19 above title.

4. Create a top nav: background transparent (over #faf9f7), height 60px, padding 0 24px, flexbox with logo left ('● magic beans' at 15px Inter weight 500 #1a1a19, the dot is a 8px #1a1a19 circle) and 2 text links right ('Pricing', 'Twitter' at 14px Inter weight 400 #1a1a19, 24px gap between them).

5. Add decorative squiggles: 3 hand-drawn SVG curves (path-based, no fill, stroke-width 5, stroke-linecap round) placed absolutely around the hero — one orange #ff5310 in the top-left area, one green #44c67f in the bottom-right, one blue #0098f1 in the bottom-left. Each curve is a freeform S-shape approximately 80-120px wide.

## Similar Brands

- **Notion** — Same Inter typeface, same warm off-white canvas, same hairline-border card language, same pill-shaped black CTAs — Magicbeans is intentionally Notion-native
- **Linear** — Same minimal single-CTA landing pattern, same restraint with color, same massive bold hero headline anchoring the page
- **Stripe** — Same generous vertical breathing room and centered single-column hero structure with product preview card below
- **Figma** — Same playful use of hand-drawn decorative shapes (squiggles) around page edges to add personality without cluttering the interface

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-ink-black: #1a1a19;
  --color-pure-black: #000000;
  --color-charcoal: #333331;
  --color-slate-gray: #808080;
  --color-hairline: #e5e7eb;
  --color-cloud: #f0f0f0;
  --color-warm-canvas: #faf9f7;
  --color-pure-white: #ffffff;
  --color-mint-wash: #eaf7f0;
  --color-bean-orange: #ff5310;
  --color-bean-green: #44c67f;
  --color-bean-blue: #0098f1;
  --color-mint-border: #81e9b0;

  /* Typography — Font Families */
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 13px;
  --leading-caption: 1.5;
  --text-body-lg: 17px;
  --leading-body-lg: 1.5;
  --text-subheading: 24px;
  --leading-subheading: 1.33;
  --text-heading-sm: 40px;
  --leading-heading-sm: 1.2;
  --text-display: 64px;
  --leading-display: 1;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 8px;
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-200: 200px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80-100px;
  --card-padding: 32px;
  --element-gap: 8-16px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-full: 9999px;

  /* Named Radii */
  --radius-nav: 8px;
  --radius-tags: 9999px;
  --radius-cards: 12-16px;
  --radius-inputs: 8px;
  --radius-buttons: 9999px;

  /* Shadows */
  --shadow-xl: rgba(0, 0, 0, 0.01) 0px 94px 38px 0px, rgba(0, 0, 0, 0.02) 0px 53px 32px 0px, rgba(0, 0, 0, 0.03) 0px 24px 24px 0px, rgba(0, 0, 0, 0.04) 0px 6px 13px 0px;

  /* Surfaces */
  --surface-warm-canvas: #faf9f7;
  --surface-pure-white: #ffffff;
  --surface-mint-wash: #eaf7f0;
  --surface-charcoal-pop: #1a1a19;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-ink-black: #1a1a19;
  --color-pure-black: #000000;
  --color-charcoal: #333331;
  --color-slate-gray: #808080;
  --color-hairline: #e5e7eb;
  --color-cloud: #f0f0f0;
  --color-warm-canvas: #faf9f7;
  --color-pure-white: #ffffff;
  --color-mint-wash: #eaf7f0;
  --color-bean-orange: #ff5310;
  --color-bean-green: #44c67f;
  --color-bean-blue: #0098f1;
  --color-mint-border: #81e9b0;

  /* Typography */
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 13px;
  --leading-caption: 1.5;
  --text-body-lg: 17px;
  --leading-body-lg: 1.5;
  --text-subheading: 24px;
  --leading-subheading: 1.33;
  --text-heading-sm: 40px;
  --leading-heading-sm: 1.2;
  --text-display: 64px;
  --leading-display: 1;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-200: 200px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-xl: rgba(0, 0, 0, 0.01) 0px 94px 38px 0px, rgba(0, 0, 0, 0.02) 0px 53px 32px 0px, rgba(0, 0, 0, 0.03) 0px 24px 24px 0px, rgba(0, 0, 0, 0.04) 0px 6px 13px 0px;
}
```
