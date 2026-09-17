# Uizard — Style Reference
> violet aurora over obsidian — a single charged accent glowing against an ink-dark product canvas

**Theme:** dark

Uizard operates as a midnight creative studio: near-black canvases absorb attention while a single violet glow (#a881fe) acts as the room's neon sign, drawing the eye to generation moments. The interface stays overwhelmingly achromatic — white type, graphite borders, ink-black surfaces — so that the purple accent reads as functional electricity, not decoration. Typography is confident and modern: Satoshi Variable carries the product voice at comfortable weights, while Clash Grotesk breaks through at display scale for hero headlines with tight tracking. Components feel contained and architectural — cards with hairline graphite borders, pills and inputs softened to 8-12px radii, and a signature purple outer-glow shadow on the primary action that makes it appear to emit light rather than sit on a surface.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Violet Glow | `#a881fe` | `--color-violet-glow` | Primary action fill, brand accent, hero glow origin, logo mark — the charged purple that signals generation and AI intent |
| Deep Iris | `linear-gradient(0deg, rgb(100,25,255), rgb(168,129,254))` | `--color-deep-iris` | Gradient deep stop, brand purple core — anchors hero radial bloom and logo gradient ramp |
| Soft Lilac | `linear-gradient(189.47deg, rgb(204,178,255) 4.76%, rgb(100,25,255) 92.85%)` | `--color-soft-lilac` | Gradient highlight stop — outer edge of brand gradient where violet dissolves into the dark canvas |
| Signal Blue | `#1e90ff` | `--color-signal-blue` | Blue action color for filled buttons, selected navigation states, and focused conversion moments. |
| Obsidian | `#0b0b0b` | `--color-obsidian` | Page canvas, card surface — the foundational darkness everything floats on |
| Void Black | `#000000` | `--color-void-black` | Deepest surface tier, shadow base — used for shadow color and deepest elevation sink |
| Graphite | `#2e2e2e` | `--color-graphite` | Card and container borders — hairline outlines that separate dark surfaces without lifting them |
| Carbon | `#212121` | `--color-carbon` | Secondary borders, subtle dividers on dark sections |
| Slate | `#525252` | `--color-slate` | Muted border accent for low-emphasis containers and section dividers |
| Frost | `#f5f5f5` | `--color-frost` | Primary text on dark surfaces, hairline borders — the default ink |
| Pure White | `#ffffff` | `--color-pure-white` | Headline text, input field fill, high-emphasis foreground — maximum contrast moments |
| Pewter | `#aeaeae` | `--color-pewter` | Muted body text, secondary copy, metadata — reads as quiet information |

## Tokens — Typography

### Satoshi-Variable — Primary UI and body typeface — carries product voice across all body, button, input, card, and subheading contexts. The half-step weights (480, 540, 560) between 400 and 640 give the system finely tuned confidence: 400 for body, 480 for soft headings, 540 for buttons and subheads, 640 for emphasized UI labels. Substitute: Inter or General Sans · `--font-satoshi-variable`
- **Substitute:** Inter
- **Weights:** 400, 480, 540, 560, 640
- **Sizes:** 12px, 14px, 16px, 18px, 20px, 24px, 40px
- **Line height:** 1.00–1.43
- **Letter spacing:** -0.025em at 12px, -0.011em at 14px, -0.008em at 16px, -0.007em at 18px, -0.006em at 20px, -0.005em at 24px
- **Role:** Primary UI and body typeface — carries product voice across all body, button, input, card, and subheading contexts. The half-step weights (480, 540, 560) between 400 and 640 give the system finely tuned confidence: 400 for body, 480 for soft headings, 540 for buttons and subheads, 640 for emphasized UI labels. Substitute: Inter or General Sans

### ClashGrotesk-Variable — Display headline typeface — reserved for the hero statement. Clash Grotesk's geometric character at weight 540 with -0.008em tracking creates a distinctive editorial voice that Satoshi cannot replicate at scale. The single weight/size usage makes it a moment, not a pattern. Substitute: Clash Display or Space Grotesk Bold · `--font-clashgrotesk-variable`
- **Substitute:** Clash Display
- **Weights:** 540
- **Sizes:** 72px
- **Line height:** 1.00
- **Letter spacing:** -0.008em at 72px
- **Role:** Display headline typeface — reserved for the hero statement. Clash Grotesk's geometric character at weight 540 with -0.008em tracking creates a distinctive editorial voice that Satoshi cannot replicate at scale. The single weight/size usage makes it a moment, not a pattern. Substitute: Clash Display or Space Grotesk Bold

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.38 | -0.3px | `--text-caption` |
| body-sm | 14px | 1.43 | -0.154px | `--text-body-sm` |
| body | 16px | 1.4 | -0.128px | `--text-body` |
| subheading | 18px | 1.33 | -0.126px | `--text-subheading` |
| heading-sm | 20px | 1.29 | -0.12px | `--text-heading-sm` |
| heading | 24px | 1.25 | -0.12px | `--text-heading` |
| heading-lg | 40px | 1.2 | -1px | `--text-heading-lg` |
| display | 72px | 1 | -0.576px | `--text-display` |

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
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 64 | 64px | `--spacing-64` |
| 120 | 120px | `--spacing-120` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 16px |
| pills | 9999px |
| inputs | 8px |
| buttons | 12px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| xl | `rgba(3, 3, 3, 0.12) 0px 12px 30px -4px` | `--shadow-xl` |
| md | `rgba(168, 129, 254, 0.64) 0px 2px 12px 0px, rgb(168, 129,...` | `--shadow-md` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 24px
- **Element gap:** 12px

## Components

### Primary CTA Button (Violet)
**Role:** Main generation action

Filled violet (#a881fe) with white Satoshi 16px/540 text, 12px border-radius, 12px 24px padding. Signature outer glow: rgba(168,129,254,0.64) 0px 2px 12px with an inset 1px 1px highlight. The shadow makes the button appear to emit violet light rather than sit on the surface — the brand's most distinctive component moment.

### Secondary CTA Button (Blue)
**Role:** Top navigation signup

Filled Signal Blue (#1e90ff) with white Satoshi 14px/540 text, 8px border-radius, 8px 16px padding. Smaller and more utility-oriented than the violet primary; appears in the nav bar specifically.

### Ghost Nav Link
**Role:** Top navigation items

Transparent background, Frost (#f5f5f5) text, Satoshi 14px/480, 8px horizontal padding. One nav item ('AI Design') carries a small violet sparkle icon — the only color punctuation in the nav.

### Generation Prompt Bar
**Role:** Hero input + action composite

White (#ffffff) input field, 8px radius, ~56px height, Satoshi 16px/400 placeholder text in gray. Attached right-side violet Generate button (12px radius). The composite sits as a single rounded capsule — white-to-violet, the hero's interaction moment.

### Testimonial Card
**Role:** Customer quote container in masonry grid

Obsidian (#0b0b0b) fill, 1px Graphite (#2e2e2e) border, 16px radius, 24px padding. Contains circular avatar (40px), handle in Satoshi 14px/560 Frost, body text in Satoshi 14px/400 Frost. Social platform icon (Twitter/Instagram) top-right at Pewter (#aeaeae).

### Section Header
**Role:** Section titles like 'What our customers say about us'

Satoshi 40px/560 Frost, -1.0px tracking, left-aligned. Sits with generous 80px section gap above. No subtitle or eyebrow — the headline stands alone.

### Top Navigation Bar
**Role:** Persistent site navigation

Obsidian (#0b0b0b) background, ~64px height, logo left (white wordmark with violet sparkle icon), nav items center, utility actions right. No visible border bottom — separates from content via the canvas itself.

### Trust Logo Strip
**Role:** Social proof company logos

Horizontal row of company wordmarks in Frost (#f5f5f5) at ~30% opacity, evenly distributed, preceded by Satoshi 14px/400 caption 'Trusted by individuals and teams at the world's boldest companies'. Logos sit as monochrome — the violet brand does not compete with partner brands.

### Hero Section
**Role:** Page entry experience

Full-width Obsidian canvas with a large radial gradient bloom (#ccb2ff → #6419ff at 72.97% 270%) emanating from behind the content, creating the violet aurora signature. Centered 72px Clash Grotesk headline, 18px Satoshi 400 subhead in Pewter, prompt bar below.

### Inline Sparkle Icon
**Role:** AI feature indicator

Small four-point sparkle glyph in Violet Glow (#a881fe), ~12px, used to mark AI-powered features in nav and labels — the visual shorthand for 'this uses GenAI'.

## Do's and Don'ts

### Do
- Use #a881fe exclusively for the primary generation action and the AI sparkle indicator — its rarity is what makes it charged
- Apply the violet outer-glow shadow (rgba(168,129,254,0.64) 0px 2px 12px) only to the primary CTA, never to cards or inputs
- Set card borders to exactly 1px #2e2e2 with 16px radius — hairlines, not panels
- Use 12px radius for buttons, 8px for inputs, 16px for cards, and 9999px for pill tags — never let these collapse to one value
- Keep body text at 16px/400 Satoshi in Frost (#f5f5f5) on Obsidian (#0b0b0b); reach for Pewter (#aeaeae) only for de-emphasized metadata
- Reserve Clash Grotesk for 72px hero headlines only — Satoshi carries everything below 40px
- Maintain 80px vertical section gaps; 12px element gaps inside cards; 24px card padding

### Don't
- Do not place #a881fe on anything other than the primary action, sparkle icons, and the hero glow origin — overuse dilutes the brand charge
- Do not use heavy drop shadows on cards — the system relies on hairline borders and the canvas itself for separation
- Do not apply light-theme colors (#ffffff fills, #f5f5f5 surfaces) — this is a dark-first system where white appears only as text and inside the generation prompt bar
- Do not mix the violet brand with Signal Blue (#1e90ff) on the same surface — blue is reserved for the top-nav signup utility action
- Do not set card radius below 16px or above 20px — the rounded-but-architectural proportion is signature
- Do not use Clash Grotesk for subheadings, body, or UI labels — its 540 weight at 72px is a one-time hero moment
- Do not introduce gradients on text or small UI elements — gradients live in the hero bloom and the logo mark only

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Obsidian Canvas | `#0b0b0b` | Base page background — the foundational dark surface |
| 2 | Void Card | `#000000` | Deepest surface tier for elevated cards and modal sinks |
| 3 | Graphite Card | `#0b0b0b` | Standard card surface with 1px #2e2e2 border for testimonial and content cards |
| 4 | Frost Input | `#ffffff` | Inverted light surface for the generation prompt input field — the only white surface in the system |

## Elevation

- **Primary CTA Button:** `rgba(168, 129, 254, 0.64) 0px 2px 12px 0px, rgb(168, 129, 254) 0px 1px 1px 0px inset`
- **Elevated Panel / Modal:** `rgba(3, 3, 3, 0.12) 0px 12px 30px -4px`

## Imagery

The visual language is almost entirely UI and gradient — no photography, no illustrations, no product screenshots in the hero. The signature visual is the radial violet bloom behind the hero, a pure CSS gradient that creates an aurora-like atmosphere without imagery. Avatars in testimonials are small circular crops (40px). Company logos in the trust strip are monochrome wordmarks in Frost at reduced opacity. Icons are minimal: a four-point sparkle in violet for AI indicators, and small social platform glyphs in Pewter. The system communicates entirely through type, color, and light — the gradient does the emotional work that photography would do on a lifestyle brand.

## Layout

Max-width 1200px centered container with full-bleed dark sections. The hero is a centered stack: 72px display headline, 18px subhead, prompt bar — all vertically and horizontally centered on a full-viewport Obsidian canvas with a radial violet bloom behind. Trust logo strip is a full-width horizontal band below the hero. Testimonial section uses a 3-column masonry grid (cards of varying heights) with generous gutters. Section rhythm is consistent 80px vertical gaps, no alternating background colors — the canvas stays Obsidian throughout, and variation comes from card presence and the hero gradient. Navigation is a single 64px top bar, not sticky with backdrop blur. Content is consistently left-aligned for headings, centered only for the hero stack.

## Agent Prompt Guide

Quick Color Reference:
- text: #f5f5f5 (Frost)
- background: #0b0b0b (Obsidian)
- border: #2e2e2e (Graphite)
- accent: #a881fe (Violet Glow)
- primary action: #1e90ff (filled action)
- secondary utility: #1e90ff (Signal Blue)

3-5 Example Component Prompts:

1. Hero section: Obsidian (#0b0b0b) full-bleed canvas with radial gradient bloom (rgb(204,178,255) → rgb(100,25,255) at 72.97% 270%) behind content. Centered 72px ClashGrotesk weight 540 headline in #ffffff, letter-spacing -0.576px. 18px Satoshi 400 subhead in #aeaeae, max-width 600px. Below: a 56px-tall prompt composite — white (#ffffff) input field, 8px radius, Satoshi 16px/400 placeholder '#a881fe' violet Generate button attached right, 12px radius, white text, with outer glow shadow rgba(168,129,254,0.64) 0px 2px 12px.

2. Testimonial card: Obsidian (#0b0b0b) fill, 1px solid #2e2e2e border, 16px radius, 24px padding. 40px circular avatar top-left, Twitter/Instagram icon 16px top-right in #aeaeae. Username in Satoshi 14px/560 #f5f5f5 below avatar, body text in Satoshi 14px/400 #f5f5f5 below username, 12px gap between elements.

3. Create a Primary Action Button: #1e90ff background, #212121 text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.

4. Top navigation bar: Obsidian (#0b0b0b) background, 64px height, 1200px max-width centered. Left: white logo wordmark with violet (#a881fe) sparkle icon. Center: nav items in Satoshi 14px/480 #f5f5f5, 32px horizontal gap. Right: 'Sign up for free' button in #1e90ff, white text, Satoshi 14px/540, 8px radius, 8px 16px padding.

5. Section header: Satoshi 40px/560 #f5f5f5, letter-spacing -1.0px, left-aligned, 80px top margin from previous section.

## Similar Brands

- **Linear** — Same dark canvas + single charged accent (purple) + hairline borders + tight Satoshi/Inter-style typography
- **Vercel** — Same ink-black surfaces with a vivid gradient hero bloom and minimal, type-driven layout
- **Runway** — Same dark creative-tool atmosphere with a glowing violet/purple brand accent radiating from the hero
- **Framer** — Same dark product canvas with confident display typography, subtle card borders, and a single saturated accent for generation moments

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-violet-glow: #a881fe;
  --color-deep-iris: #6419ff;
  --gradient-deep-iris: linear-gradient(0deg, rgb(100,25,255), rgb(168,129,254));
  --color-soft-lilac: #ccb2ff;
  --gradient-soft-lilac: linear-gradient(189.47deg, rgb(204,178,255) 4.76%, rgb(100,25,255) 92.85%);
  --color-signal-blue: #1e90ff;
  --color-obsidian: #0b0b0b;
  --color-void-black: #000000;
  --color-graphite: #2e2e2e;
  --color-carbon: #212121;
  --color-slate: #525252;
  --color-frost: #f5f5f5;
  --color-pure-white: #ffffff;
  --color-pewter: #aeaeae;

  /* Typography — Font Families */
  --font-satoshi-variable: 'Satoshi-Variable', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-clashgrotesk-variable: 'ClashGrotesk-Variable', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.38;
  --tracking-caption: -0.3px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.43;
  --tracking-body-sm: -0.154px;
  --text-body: 16px;
  --leading-body: 1.4;
  --tracking-body: -0.128px;
  --text-subheading: 18px;
  --leading-subheading: 1.33;
  --tracking-subheading: -0.126px;
  --text-heading-sm: 20px;
  --leading-heading-sm: 1.29;
  --tracking-heading-sm: -0.12px;
  --text-heading: 24px;
  --leading-heading: 1.25;
  --tracking-heading: -0.12px;
  --text-heading-lg: 40px;
  --leading-heading-lg: 1.2;
  --tracking-heading-lg: -1px;
  --text-display: 72px;
  --leading-display: 1;
  --tracking-display: -0.576px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-w480: 480;
  --font-weight-w540: 540;
  --font-weight-w560: 560;
  --font-weight-w640: 640;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-120: 120px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 24px;
  --element-gap: 12px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-3xl: 28px;

  /* Named Radii */
  --radius-cards: 16px;
  --radius-pills: 9999px;
  --radius-inputs: 8px;
  --radius-buttons: 12px;

  /* Shadows */
  --shadow-xl: rgba(3, 3, 3, 0.12) 0px 12px 30px -4px;
  --shadow-md: rgba(168, 129, 254, 0.64) 0px 2px 12px 0px, rgb(168, 129, 254) 0px 1px 1px 0px inset;

  /* Surfaces */
  --surface-obsidian-canvas: #0b0b0b;
  --surface-void-card: #000000;
  --surface-graphite-card: #0b0b0b;
  --surface-frost-input: #ffffff;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-violet-glow: #a881fe;
  --color-deep-iris: #6419ff;
  --color-soft-lilac: #ccb2ff;
  --color-signal-blue: #1e90ff;
  --color-obsidian: #0b0b0b;
  --color-void-black: #000000;
  --color-graphite: #2e2e2e;
  --color-carbon: #212121;
  --color-slate: #525252;
  --color-frost: #f5f5f5;
  --color-pure-white: #ffffff;
  --color-pewter: #aeaeae;

  /* Typography */
  --font-satoshi-variable: 'Satoshi-Variable', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-clashgrotesk-variable: 'ClashGrotesk-Variable', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.38;
  --tracking-caption: -0.3px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.43;
  --tracking-body-sm: -0.154px;
  --text-body: 16px;
  --leading-body: 1.4;
  --tracking-body: -0.128px;
  --text-subheading: 18px;
  --leading-subheading: 1.33;
  --tracking-subheading: -0.126px;
  --text-heading-sm: 20px;
  --leading-heading-sm: 1.29;
  --tracking-heading-sm: -0.12px;
  --text-heading: 24px;
  --leading-heading: 1.25;
  --tracking-heading: -0.12px;
  --text-heading-lg: 40px;
  --leading-heading-lg: 1.2;
  --tracking-heading-lg: -1px;
  --text-display: 72px;
  --leading-display: 1;
  --tracking-display: -0.576px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-120: 120px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-3xl: 28px;

  /* Shadows */
  --shadow-xl: rgba(3, 3, 3, 0.12) 0px 12px 30px -4px;
  --shadow-md: rgba(168, 129, 254, 0.64) 0px 2px 12px 0px, rgb(168, 129, 254) 0px 1px 1px 0px inset;
}
```
