# Acctual — Style Reference
> Paper invoice on frosted glass

**Theme:** light

Acctual runs a white-canvas invoicing product on a near-monochrome foundation: paper-white surfaces, dense near-black text, and a single electric blue (#0098f2) used as functional punctuation for checkmarks, rates, and inline highlights. The brand voice is geometric and confident — pill-shaped controls, generous 16px card radii, and rounded invoice mockups floating against pure white. Color is deployed sparingly: most screens stay achromatic so the blue, violet, and pink decorative chips read as deliberate accents rather than noise. Typography is built on Open Runde at weight 600, with tight -0.03em tracking on display sizes that gives headlines a compressed, almost monolinear feel, paired with handwritten Caveat signatures for testimonial contrast.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Ink | `#1e1e1e` | `--color-ink` | Headings and primary body text — near-black with a slight cool cast reads as authoritative without the harshness of pure #000 |
| Carbon | `#0f0f0f` | `--color-carbon` | Body text and secondary headings — deeper than Ink, used where maximum contrast against white surfaces is needed |
| Midnight | `#0d111b` | `--color-midnight` | Primary action buttons (filled) — dark navy-black instead of pure black, giving CTAs a subtle blue undertone that harmonizes with the electric blue accent |
| Smoke | `#666666` | `--color-smoke` | Secondary body text, helper copy, muted descriptions under headlines |
| Fog | `#8d8d8d` | `--color-fog` | Tertiary text, nav links, subdued metadata — the lightest readable neutral before borders take over |
| Ash | `#999999` | `--color-ash` | Disabled state text, placeholder text, low-priority labels |
| Mist | `#ccd1da` | `--color-mist` | Hairline borders, input outlines, divider lines — cool blue-gray instead of pure gray so dividers feel on-brand |
| Paper | `#ffffff` | `--color-paper` | Page canvas, card surfaces, hero background — the dominant surface, occupying the majority of every viewport |
| Snow | `#f7fafc` | `--color-snow` | Subtle section backgrounds, alternating bands — barely warmer than Paper, creates gentle visual rhythm without darkening the page |
| Concrete | `#afb0b1` | `--color-concrete` | Muted surface fills, inactive chip backgrounds — sits between border and surface in the neutral stack |
| Electric Blue | `#0098f2` | `--color-electric-blue` | Brand accent — checkmark icons, payment rate callouts, inline highlights, the single most prominent chromatic color across the page |
| Iris | `#6c56fc` | `--color-iris` | Decorative accent and illustration fill — violet chip on invoice cards, secondary brand signal |
| Magenta | `#f200ca` | `--color-magenta` | Decorative accent and illustration fill — pink chip on invoice cards, tertiary brand signal |
| Leaf | `#5d9c06` | `--color-leaf` | Green text accent for links, tags, and emphasized short phrases. Use as a supporting accent, not as a status color |
| Coral | `#ff6363` | `--color-coral` | Red decorative accent for icons, marks, and small graphic details. Use as a supporting accent, not as a status color |
| Ice | `#cfeafa` | `--color-ice` | Tinted surface wash — light blue card backgrounds for highlight sections, soft accent backgrounds |
| Lavender | `#e1e0fc` | `--color-lavender` | Tinted surface wash — light violet card backgrounds for feature blocks |
| Blush | `#f6d2f4` | `--color-blush` | Tinted surface wash — light pink card backgrounds, decorative highlight blocks |

## Tokens — Typography

### sans-serif — sans-serif — detected in extracted data but not described by AI · `--font-sans-serif`
- **Weights:** 400
- **Sizes:** 12px
- **Line height:** 1.2
- **Role:** sans-serif — detected in extracted data but not described by AI

### Open Runde — Primary typeface for all headings and body text — geometric sans-serif with weight 600 at display sizes (64/48/40/32/24/20px) carrying -0.03em letter-spacing for compressed confident headlines; weight 500 for body (22/16/14px) with -0.02em tracking; 11px uppercase eyebrow labels at weight 600 with +0.02em tracking · `--font-open-runde`
- **Substitute:** Inter, DM Sans, or Outfit
- **Weights:** 500, 600
- **Sizes:** 11, 12, 14, 16, 20, 22, 24, 32, 40, 48, 64
- **Line height:** 1.13-1.78
- **Letter spacing:** -0.03em at 20px+ display, -0.02em at 14-16px body, +0.02em at 11px uppercase
- **OpenType features:** `"ss01" on`
- **Role:** Primary typeface for all headings and body text — geometric sans-serif with weight 600 at display sizes (64/48/40/32/24/20px) carrying -0.03em letter-spacing for compressed confident headlines; weight 500 for body (22/16/14px) with -0.02em tracking; 11px uppercase eyebrow labels at weight 600 with +0.02em tracking

### Caveat — Handwritten signature font for testimonial attributions — creates human warmth against the geometric system at small sizes only · `--font-caveat`
- **Substitute:** Dancing Script or Kalam
- **Weights:** 600
- **Sizes:** 16, 24
- **Line height:** 1.33, 1.50
- **Role:** Handwritten signature font for testimonial attributions — creates human warmth against the geometric system at small sizes only

### SF Pro Text — Secondary system font for small uppercase labels — only used sparingly where system rendering is preferred over Open Runde · `--font-sf-pro-text`
- **Substitute:** System UI sans-serif
- **Weights:** 600
- **Sizes:** 11
- **Line height:** 1.62
- **Letter spacing:** +0.02em
- **Role:** Secondary system font for small uppercase labels — only used sparingly where system rendering is preferred over Open Runde

### Inter — Inter — detected in extracted data but not described by AI · `--font-inter`
- **Weights:** 400, 500
- **Sizes:** 16px, 32px
- **Line height:** 1, 1.25
- **Role:** Inter — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| eyebrow | 11px | 1.62 | 0.22px | `--text-eyebrow` |
| body-sm | 14px | 1.43 | -0.28px | `--text-body-sm` |
| body | 16px | 1.5 | -0.32px | `--text-body` |
| body-lg | 22px | 1.29 | — | `--text-body-lg` |
| subheading | 24px | 1.33 | -0.72px | `--text-subheading` |
| heading-sm | 32px | 1.25 | -0.96px | `--text-heading-sm` |
| heading | 40px | 1.2 | -1.2px | `--text-heading` |
| heading-lg | 48px | 1.17 | -1.44px | `--text-heading-lg` |
| display | 64px | 1.13 | -1.92px | `--text-display` |

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
| 48 | 48px | `--spacing-48` |
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |
| 96 | 96px | `--spacing-96` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 100px |
| cards | 16px |
| icons | 888px |
| images | 20px |
| buttons | 100px |
| largeCards | 32px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| subtle | `rgba(10, 13, 20, 0.03) 0px 1px 2px 0px` | `--shadow-subtle` |
| subtle-2 | `rgb(36, 38, 40) 0px 0px 0px 1px, rgba(27, 28, 29, 0.48) 0...` | `--shadow-subtle-2` |
| subtle-3 | `rgba(0, 0, 0, 0.06) 0px 2px 3px -1px` | `--shadow-subtle-3` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 96px
- **Card padding:** 24px
- **Element gap:** 12px

## Components

### Filled Action Button
**Role:** Primary CTA — 'Send my first invoice', 'Create an invoice', 'Sign up for free'

Background #0d111b (Midnight), text #ffffff, border-radius 100px (pill), padding 8px 12px (small) or 6px 14px (nav), shadow rgb(36,38,40) 0px 0px 0px 1px + rgba(27,28,29,0.48) 0px 1px 2px 0px. Open Runde 14px/500, text #ffffff, letter-spacing -0.02em.

### Secondary Dark Button
**Role:** Compact dark action — nav-level CTAs and dense button rows

Background #0f0f0f (Carbon), text #ffffff, border-radius 100px, padding 6px 10px or 6px 14px. Same shadow stack as primary button. Used where a slightly smaller, denser button is needed in nav or toolbar contexts.

### Outline Link Button
**Role:** Navigation links — 'Freelancer', 'Agency', 'Pricing', 'Blog', 'Guides'

Background #ffffff, text #1e1e1, border-radius 100px, padding 8px 12px. No shadow. Functions as a ghost nav item inside the pill-shaped header container.

### Feature Card
**Role:** Standard content card for feature blocks and comparison panels

Background #fafafa (or #ffffff), border-radius 16px, padding 24px, no shadow. Open Runde 24px/600 heading with -0.03em tracking, body text 16px/500 in #666666. Sits flush on white canvas.

### Elevated Card
**Role:** Card with subtle elevation for invoice previews and testimonial blocks

Background #ffffff, border-radius 20px, shadow rgba(0,0,0,0.05) 0px 1.78px 8px 0px + rgba(0,0,0,0.04) 0px 0.89px 2.67px 0px. No padding (content fills card). Used for the invoice mockup stack and the testimonial quote card.

### Large Feature Panel
**Role:** Full-width feature section with generous internal padding

Background #fafafa, border-radius 32px, padding 96px 48px. No shadow. Used for the 'We designed an invoice...' section and similar spacious feature panels that need to feel like standalone editorial blocks.

### Tinted Accent Card
**Role:** Highlight block with brand-tinted background

Background rgba(0,152,242,0.16) (Ice at 16% opacity), border-radius 16px, no padding or shadow. Used for payment rate callout strips and highlighted info blocks.

### Invoice Mockup Card
**Role:** Overlapping invoice preview document

Background #ffffff, border-radius 16px, shadow rgba(10,13,20,0.03) 0px 1px 2px 0px. Contains a structured invoice layout: 'INVOICE NO' label at 11px uppercase in #666666, 'FROM/TO' blocks with brand-color circular icons (Iris #6c56fc, Leaf #5d9c06), line items in a table with #666666 labels and #1e1e1 values. Stacked with slight rotation and offset for depth.

### Star Rating Block
**Role:** 5-star rating indicator for testimonial credibility

Five solid orange/amber stars (default #f5a623 implied) centered above a quote. No border or background. Open Runde 24px/600 quote text below in #1e1e1, Caveat 16px/600 attribution in #666666.

### Payment Rate Badge
**Role:** Inline rate indicator — 'Cards 2.7%', 'Bank transfer 1%', 'Stablecoin 1%'

No background, inline horizontal arrangement: Electric Blue #0098f2 circular checkmark icon (radius 888px = fully round), followed by label text in #1e1e1 at 16px/500, rate value in bold. No padding, no border.

### FAQ Accordion Item
**Role:** Expandable question row in the FAQ section

Full-width row with no background, no border-radius, horizontal divider line (1px #ccd1da or similar hairline). Question text in #1e1e1 at 16px/500, plus icon (+) on the right in #1e1e1e. Vertical padding ~16px, spacing between items ~12px.

### Pill-Shaped Header Container
**Role:** Floating navigation bar wrapping logo, links, and CTAs

Background #ffffff, border-radius 100px, wrapping the entire nav row. Contains logo + nav links (outline buttons) + login text + filled CTA, all arranged inline with 8-12px gaps. Floats above the hero with subtle shadow.

### Logo Mark
**Role:** Acctual brand logo — stylized arrow/chevron monogram

Two stacked chevron/arrow shapes forming 'A' or '→' glyph, rendered in #1e1e1 (dark). Paired with 'Acctual' wordmark in Open Runde 16px/500, #1e1e1e.

### Eyebrow Label
**Role:** Small uppercase category tag above section headings — 'Used by 5,000+ businesses worldwide'

Open Runde 11px/600, letter-spacing +0.02em, text-transform uppercase, color #0098f2 (Electric Blue). No background, no border. Sits centered above the headline as a tiny blue capsule of context.

## Do's and Don'ts

### Do
- Use Open Runde weight 600 for all headings 20px and above with -0.03em letter-spacing — the tight tracking is the signature compressed headline feel
- Set primary action buttons to #0d111b with white text and 100px pill radius — never use colored fills for primary CTAs
- Use #0098f2 Electric Blue exclusively for inline icons (checkmarks), rate callouts, and eyebrow labels — never for button backgrounds or large surface fills
- Apply 16px border-radius to all content cards and 32px to large feature panels — radius hierarchy is a core part of the visual rhythm
- Set page canvas to pure #ffffff and use #fafafa or #f7fafc only for alternating section bands — keep the page as bright as possible
- Use Caveat 16px/600 for testimonial attributions only — it is a signature element, not a body font
- Stack invoice mockup cards with slight rotation and overlapping offset to create the layered paper effect visible in the hero

### Don't
- Don't use #0098f2, #6c56fc, or #f200ca as button backgrounds — the brand accent colors are decorative, not interactive
- Don't use pure #000000 for text or buttons — use #1e1e1 for text and #0d111b for button fills; the near-black tones are deliberate
- Don't apply box-shadow to feature cards — elevation is reserved for the invoice mockups and testimonial cards; flat surfaces are the norm
- Don't use border-radius below 10px on any interactive element — pills (100px), 16px, and 32px are the only valid radius values
- Don't use gradient backgrounds anywhere — the design is strictly flat with solid fills only
- Don't set body text below #666666 — the neutral floor for readable text is Smoke, not lighter grays
- Don't use more than two chromatic accent colors on a single screen — the system relies on color appearing as rare punctuation

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Paper | `#ffffff` | Page canvas — dominant background for the entire site, hero, and most content sections |
| 1 | Snow | `#fafafa` | Alternating section bands, feature card backgrounds, subtle contrast surfaces |
| 2 | Ice | `#cfeafa` | Tinted highlight blocks for payment info and feature callouts |
| 3 | Lavender | `#e1e0fc` | Violet-tinted card backgrounds for secondary feature blocks |

## Elevation

- **Primary Button:** `rgb(36, 38, 40) 0px 0px 0px 1px, rgba(27, 28, 29, 0.48) 0px 1px 2px 0px`
- **Elevated Card:** `rgba(0, 0, 0, 0.05) 0px 1.78px 8px 0px, rgba(0, 0, 0, 0.04) 0px 0.89px 2.67px 0px`
- **Invoice Mockup:** `rgba(10, 13, 20, 0.03) 0px 1px 2px 0px`

## Imagery

Imagery is minimal and product-focused: flat-lay photography of office objects (keyboard, binder clip, red binder, Apple display) cropped at the edges and scattered around the page as atmospheric decoration. The dominant visual asset is the layered invoice mockup stack — rendered as actual UI, not illustration, showing real invoice data with brand-color icons. Icons are simple flat geometric shapes (circles for checkmarks, rounded squares) in Electric Blue. No illustrations, no 3D renders, no lifestyle photography. The aesthetic is 'desktop overhead shot meets UI artifact'.

## Agent Prompt Guide

## Quick Color Reference
- Text (primary): #1e1e1e
- Text (secondary): #666666
- Text (muted): #8d8d8d
- Background (page): #ffffff
- Background (card): #fafafa
- Border: #ccd1da
- Accent: #0098f2
- primary action: #0d111b (filled action)

## 5 Example Component Prompts

1. Create a Primary Action Button: #0d111b background, #ffffff text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.

2. **Feature Card**: Background #fafafa, border-radius 16px, padding 24px, no shadow. Heading at 24px Open Runde weight 600, #1e1e1e, letter-spacing -0.72px. Body at 16px Open Runde weight 500, #666666.

3. **Payment Rate Badge**: Inline row — Electric Blue #0098f2 circular checkmark icon (12px diameter, 888px radius = perfect circle), followed by label text 'Cards' in #1e1e1e at 16px/500, then rate '2.7%' in bold #1e1e1e. No background, no border, no padding.

4. **Invoice Mockup Card**: Background #ffffff, border-radius 16px, shadow rgba(10,13,20,0.03) 0px 1px 2px. Header label 'INVOICE NO 001' at 11px Open Runde weight 600 uppercase, #666666. Two-column body: 'FROM' block with Iris #6c56fc circular icon + 'Marble Studio' at 20px/600 #1e1e1e; 'TO' block with Leaf #5d9c06 circular icon + 'Charm AI' at 20px/600. Address lines at 14px/500 in #666666.

5. **FAQ Accordion Row**: Full-width row, no background, 1px bottom border in #ccd1da. Question text at 16px Open Runde weight 500, #1e1e1e, padding 16px 0. Plus icon on right at 16px, #1e1e1e. Spacing between rows: 12px.

## Similar Brands

- **Stripe** — Same flat white-canvas approach with pill-shaped buttons, minimal shadows, and restrained use of color for functional accents rather than decoration
- **Linear** — Same compressed geometric sans-serif headlines with tight negative letter-spacing, dark filled CTA buttons, and a near-monochrome palette with rare chromatic punctuation
- **FreshBooks** — Same invoicing product category with overlapping paper/invoice mockup photography and a clean white-surface aesthetic for financial UI
- **Plausible Analytics** — Same approach of using a single vivid accent color (blue) sparingly against a white canvas, with pill-radius buttons and generous card padding
- **Vercel** — Same near-black (#0d111b range) primary buttons instead of pure black, minimal shadows, and geometric typography with tight tracking on display sizes

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-ink: #1e1e1e;
  --color-carbon: #0f0f0f;
  --color-midnight: #0d111b;
  --color-smoke: #666666;
  --color-fog: #8d8d8d;
  --color-ash: #999999;
  --color-mist: #ccd1da;
  --color-paper: #ffffff;
  --color-snow: #f7fafc;
  --color-concrete: #afb0b1;
  --color-electric-blue: #0098f2;
  --color-iris: #6c56fc;
  --color-magenta: #f200ca;
  --color-leaf: #5d9c06;
  --color-coral: #ff6363;
  --color-ice: #cfeafa;
  --color-lavender: #e1e0fc;
  --color-blush: #f6d2f4;

  /* Typography — Font Families */
  --font-sans-serif: 'sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-open-runde: 'Open Runde', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-caveat: 'Caveat', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-sf-pro-text: 'SF Pro Text', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-eyebrow: 11px;
  --leading-eyebrow: 1.62;
  --tracking-eyebrow: 0.22px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.43;
  --tracking-body-sm: -0.28px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.32px;
  --text-body-lg: 22px;
  --leading-body-lg: 1.29;
  --text-subheading: 24px;
  --leading-subheading: 1.33;
  --tracking-subheading: -0.72px;
  --text-heading-sm: 32px;
  --leading-heading-sm: 1.25;
  --tracking-heading-sm: -0.96px;
  --text-heading: 40px;
  --leading-heading: 1.2;
  --tracking-heading: -1.2px;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.17;
  --tracking-heading-lg: -1.44px;
  --text-display: 64px;
  --leading-display: 1.13;
  --tracking-display: -1.92px;

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
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-96: 96px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 96px;
  --card-padding: 24px;
  --element-gap: 12px;

  /* Border Radius */
  --radius-lg: 10px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-3xl: 32px;
  --radius-full: 50px;
  --radius-full-2: 100px;
  --radius-full-3: 888px;
  --radius-full-4: 999px;

  /* Named Radii */
  --radius-tags: 100px;
  --radius-cards: 16px;
  --radius-icons: 888px;
  --radius-images: 20px;
  --radius-buttons: 100px;
  --radius-largecards: 32px;

  /* Shadows */
  --shadow-subtle: rgba(10, 13, 20, 0.03) 0px 1px 2px 0px;
  --shadow-subtle-2: rgb(36, 38, 40) 0px 0px 0px 1px, rgba(27, 28, 29, 0.48) 0px 1px 2px 0px;
  --shadow-subtle-3: rgba(0, 0, 0, 0.06) 0px 2px 3px -1px;

  /* Surfaces */
  --surface-paper: #ffffff;
  --surface-snow: #fafafa;
  --surface-ice: #cfeafa;
  --surface-lavender: #e1e0fc;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-ink: #1e1e1e;
  --color-carbon: #0f0f0f;
  --color-midnight: #0d111b;
  --color-smoke: #666666;
  --color-fog: #8d8d8d;
  --color-ash: #999999;
  --color-mist: #ccd1da;
  --color-paper: #ffffff;
  --color-snow: #f7fafc;
  --color-concrete: #afb0b1;
  --color-electric-blue: #0098f2;
  --color-iris: #6c56fc;
  --color-magenta: #f200ca;
  --color-leaf: #5d9c06;
  --color-coral: #ff6363;
  --color-ice: #cfeafa;
  --color-lavender: #e1e0fc;
  --color-blush: #f6d2f4;

  /* Typography */
  --font-sans-serif: 'sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-open-runde: 'Open Runde', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-caveat: 'Caveat', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-sf-pro-text: 'SF Pro Text', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-eyebrow: 11px;
  --leading-eyebrow: 1.62;
  --tracking-eyebrow: 0.22px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.43;
  --tracking-body-sm: -0.28px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.32px;
  --text-body-lg: 22px;
  --leading-body-lg: 1.29;
  --text-subheading: 24px;
  --leading-subheading: 1.33;
  --tracking-subheading: -0.72px;
  --text-heading-sm: 32px;
  --leading-heading-sm: 1.25;
  --tracking-heading-sm: -0.96px;
  --text-heading: 40px;
  --leading-heading: 1.2;
  --tracking-heading: -1.2px;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.17;
  --tracking-heading-lg: -1.44px;
  --text-display: 64px;
  --leading-display: 1.13;
  --tracking-display: -1.92px;

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
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-96: 96px;

  /* Border Radius */
  --radius-lg: 10px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-3xl: 32px;
  --radius-full: 50px;
  --radius-full-2: 100px;
  --radius-full-3: 888px;
  --radius-full-4: 999px;

  /* Shadows */
  --shadow-subtle: rgba(10, 13, 20, 0.03) 0px 1px 2px 0px;
  --shadow-subtle-2: rgb(36, 38, 40) 0px 0px 0px 1px, rgba(27, 28, 29, 0.48) 0px 1px 2px 0px;
  --shadow-subtle-3: rgba(0, 0, 0, 0.06) 0px 2px 3px -1px;
}
```
