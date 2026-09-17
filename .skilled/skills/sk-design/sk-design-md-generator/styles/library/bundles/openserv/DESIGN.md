# OpenServ — Style Reference
> Bright blueprint on frosted glass

**Theme:** light

OpenServ operates in a bright, almost gallery-like visual register: pure white canvas, hairline-bordered surface cards, and two high-contrast typographic voices — a geometric grotesque for UI and a whisper-light transitional serif for headlines and section moments. Color is rationed: a single vivid violet (#5f79ff) carries every interactive moment, while a saturated mint (#01fe93) flashes only on success, highlights, and a thin gradient stripe at section boundaries. The interface is deliberately unweighted — no drop shadows on content, no decorative gradients, no emoji-grade illustration. Rounded geometry at 16px for surfaces and 100px for action buttons gives the whole product a soft, optimistic feel without sliding into the rounded-everything SaaS template.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Signal Violet | `#5f79ff` | `--color-signal-violet` | Primary action fill, active nav state, icon accent strokes, focused border — the single chromatic anchor that makes buttons feel switched on against the white canvas |
| Mint Pulse | `#01fe93` | `--color-mint-pulse` | Green action color for filled buttons, selected navigation states, and focused conversion moments |
| Pure White | `#ffffff` | `--color-pure-white` | Page background, card surface, button text on violet fill, inverted surface for nav float |
| Ink Black | `#000000` | `--color-ink-black` | Primary text, heading text, hairline borders, icon strokes, footer ink |
| Fog Gray | `#f5f5f5` | `--color-fog-gray` | Card surface lift, subtle background blocks, muted link backgrounds |
| Mist Gray | `#a6a6a6` | `--color-mist-gray` | Muted nav text, secondary borders, placeholder strokes |
| Ash Gray | `#4d4d4d` | `--color-ash-gray` | Body secondary text, subdued copy, supporting label color |
| Smoke Gray | `#9c9c9c` | `--color-smoke-gray` | Tertiary borders, disabled or inactive outlines |
| Slate Gray | `#707070` | `--color-slate-gray` | Helper text, metadata, fine print |

## Tokens — Typography

### sans-serif — sans-serif — detected in extracted data but not described by AI · `--font-sans-serif`
- **Weights:** 400
- **Sizes:** 12px
- **Line height:** 1.2
- **Role:** sans-serif — detected in extracted data but not described by AI

### OS Studio Grotesk — Primary UI and body typeface — geometric grotesque used for nav, buttons, body copy, cards, and most interface text at sizes 12–24px. At 40–72px it serves as secondary display when paired with the serif. Slightly negative tracking (-0.017em to -0.020em) tightens dense UI labels. · `--font-os-studio-grotesk`
- **Substitute:** Inter, Manrope, or DM Sans
- **Weights:** 400
- **Sizes:** 12px, 13px, 15px, 20px, 22px, 24px, 30px, 40px, 72px
- **Line height:** 0.90, 1.00, 1.10, 1.14, 1.18, 1.25, 1.40
- **Letter spacing:** -0.02em to -0.017em
- **OpenType features:** `"blwf" on, "cv03" on, "cv04" on, "cv09" on, "cv11" on`
- **Role:** Primary UI and body typeface — geometric grotesque used for nav, buttons, body copy, cards, and most interface text at sizes 12–24px. At 40–72px it serves as secondary display when paired with the serif. Slightly negative tracking (-0.017em to -0.020em) tightens dense UI labels.

### OS Chronik — Display serif used for editorial headlines like 'Build • Launch • Run' and 'Join the Appcelerator' — the 300 weight is the signature: most product sites push serifs to 400–600, but this light cut lets headlines read as quiet announcements rather than shouts. Tighter tracking at 72px (-0.020em) keeps the long descenders visually anchored. · `--font-os-chronik`
- **Substitute:** Cormorant Garamond Light, Playfair Display Light, or EB Garamond Light
- **Weights:** 300
- **Sizes:** 18px, 24px, 34px, 72px
- **Line height:** 0.90, 1.00, 1.10, 1.20
- **Letter spacing:** -0.020em at 72px, -0.015em at 24–34px
- **OpenType features:** `"blwf" on, "cv03" on, "cv04" on, "cv09" on, "cv11" on`
- **Role:** Display serif used for editorial headlines like 'Build • Launch • Run' and 'Join the Appcelerator' — the 300 weight is the signature: most product sites push serifs to 400–600, but this light cut lets headlines read as quiet announcements rather than shouts. Tighter tracking at 72px (-0.020em) keeps the long descenders visually anchored.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.2 | — | `--text-caption` |
| body | 15px | 1.4 | — | `--text-body` |
| subheading | 20px | 1.25 | — | `--text-subheading` |
| heading-sm | 24px | 1.2 | — | `--text-heading-sm` |
| heading | 30px | 1.18 | — | `--text-heading` |
| heading-lg | 40px | 1.1 | — | `--text-heading-lg` |
| display | 72px | 0.9 | -1.44px | `--text-display` |

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
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 60 | 60px | `--spacing-60` |
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |
| 120 | 120px | `--spacing-120` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 16px |
| cards | 16px |
| badges | 100px |
| images | 16px |
| inputs | 12px |
| buttons | 100px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| xl | `rgba(0, 0, 0, 0.1) 0px 0px 48px 0px` | `--shadow-xl` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 24px
- **Element gap:** 10-20px

## Components

### Floating Nav Bar
**Role:** Primary site navigation

Pill-shaped container with #ffffff background, 16px border radius, 48px soft shadow, containing logo lockup left, center nav links in OS Studio Grotesk 15px #000000, and a violet pill CTA on the right. The bar floats with generous top margin and does not span full width — it lives centered with white space on both sides.

### Violet Pill CTA
**Role:** Primary action button

Filled #5f79ff background, white text in OS Studio Grotesk 15px weight 400, 100px border radius (fully rounded), 10px vertical padding, 18–20px horizontal padding. Arrow glyph in white after label. Used for 'Open App', 'Read', 'See More' style actions.

### Ghost Nav Link
**Role:** Secondary navigation

Text-only, no background, OS Studio Grotesk 15px #000000, 8px horizontal padding. No underline, no hover fill — hover state only shifts color toward #5f79ff.

### Content Card
**Role:** Categorical content tile (Docs, Economics, Whitepaper)

White background with 1px #f5f5f5 or #a6a6a6 border, 16px border radius, 24px internal padding. Header label in violet (#5f79ff) caption weight, title in OS Studio Grotesk 20–24px #000000, body copy in 15px #4d4d4d. Footer row with violet pill button left and a circular plus/expand button right at 40px diameter.

### Highlight Card
**Role:** Featured content with image

Same structure as Content Card but with a 16px radius image block filling 40–50% of the card height. Images are full-bleed within the card with no internal padding; can be dark photographic or network-graph illustrations.

### Editorial Headline Block
**Role:** Section title with editorial typography

Centered stack on pure white. Display heading in OS Chronik 300 at 72px, color #000000, letter-spacing -1.44px, line-height 0.9. Supporting subtitle in OS Studio Grotesk 18–20px #4d4d4d below with 16–20px gap. No decorative elements — the typography does all the work.

### Decorative Sparkle
**Role:** Atmospheric hero illustration

Four-pointed star shapes and small circles in #d9defc or light violet at 10–20% opacity, scattered asymmetrically around display text. Acts as subtle atmosphere without competing with the headline.

### Section Divider Stripe
**Role:** Visual break between content bands

A thin 2–4px tall band running full-bleed at the page edge, split into segments of #01fe93, #5f79ff, and #000000. Functions as a section closer and brand recolor in a single line.

### Logo Lockup
**Role:** Brand mark in nav and footer

Circular concentric ring icon in #000000 paired with 'OpenServ' wordmark in OS Studio Grotesk 400 #000000, 15px. Icon sits flush-left of wordmark with 8px gap.

### Expand Button
**Role:** Card action affordance

Circular 40px diameter button with 1px #a6a6a6 border, white fill, containing a thin '+' glyph in #000000. Sits bottom-right of content cards to invite interaction.

## Do's and Don'ts

### Do
- Use #5f79ff filled pills with 100px radius for every primary action — never rectangular CTAs.
- Pair the two typefaces deliberately: OS Chronik 300 for editorial moments (hero, section openers, large quotes), OS Studio Grotesk 400 for everything functional.
- Keep cards flat with 1px hairline borders at #a6a6a6 or #f5f5f5 — no drop shadows on content surfaces.
- Apply -0.020em letter-spacing at 72px display and -0.017em at 20–24px UI sizes; let the negative tracking do the tightening work.
- Center editorial headlines on pure white with no decoration — the OS Chronik 300 weight is the visual event.
- Use 16px radius for all cards, images, and nav containers — the 100px pill is reserved exclusively for buttons and badges.
- Apply the mint-violet-black section stripe only as a closing band, not as inline decoration.

### Don't
- Don't use drop shadows on cards, buttons, or images — shadow is reserved for the floating nav.
- Don't push the serif above weight 300 — heavier weights break the whisper-quiet editorial voice.
- Don't introduce additional accent colors — the system is monochromatic with exactly two chromatic notes.
- Don't use rectangular buttons with 4–8px radius; the pill shape is a system commitment.
- Don't apply gradients to surfaces; the only gradient-adjacent element is the tri-color section stripe.
- Don't set body text below 13px or above 18px — the 15px body / 13px small / 18px subhead range is the readable band.
- Don't use #01fe93 as a CTA fill — mint is a status/accent role, not an action color.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#ffffff` | Page background — pure white, no texture |
| 1 | Card | `#f5f5f5` | Elevated content blocks and soft surface distinction |
| 2 | Tint Wash | `#d9defc` | Subtle violet-tinted accent surface for highlighted panels |

## Elevation

- **Floating Nav Bar:** `0px 0px 48px 0px rgba(0, 0, 0, 0.1)`

## Imagery

Imagery is sparse and deliberate. The hero uses abstract decorative elements only — small four-pointed sparkle shapes and circles in light violet at low opacity, plus a single italicized word 'Run' as a visual anchor. Content cards use two image modes: clean editorial photography on the left edge (portrait crops with hard cut, no rounded treatment on the photo itself beyond the 16px card radius) and dark network-graph illustrations with green/teal neural-network visualization on dark backgrounds. No lifestyle photography, no staged scenes, no 3D renders — imagery either documents (whitepaper covers, document photos) or diagrams (AI agent network topologies). The visual language treats imagery as informational, not emotional.

## Layout

The page uses a max-width 1200px centered container with generous outer white space. The hero is a vertically centered stack with decorative sparkles and a large display word, followed by a full-width editorial headline block. Content sections alternate between centered text blocks and 3-column card grids (docs, economics, whitepaper) with horizontal scroll capability. The floating nav is the only element that breaks the page rhythm — it sits elevated above the content with a soft 48px shadow halo. Section transitions use full-bleed colored stripes rather than whitespace gaps. Overall density is comfortable with 80px section gaps and 24px card padding, creating a gallery-like breathing rhythm.

## Agent Prompt Guide

Quick Color Reference:
- text: #000000 (headings, body), #4d4d4d (secondary), #a6a6a6 (muted)
- background: #ffffff (canvas), #f5f5f5 (card lift)
- border: #a6a6a6 (hairline), #5f79ff (focused/action)
- accent: #01fe93 (status, highlight)
- primary action: #5f79ff (filled action)

Example Component Prompts:

1. Create a floating nav bar: white (#ffffff) pill background, 16px radius, centered horizontally with 24px top margin, 48px soft shadow (0px 0px 48px rgba(0,0,0,0.1)). Inside: logo lockup (concentric ring icon + 'OpenServ' in OS Studio Grotesk 15px #000000) on the left, nav links ('Builders', 'Research', 'Blog', 'Partners', 'Team') centered in 15px #000000 with 16px gaps, and a violet pill CTA ('Open App ↗') on the right with #5f79ff fill, white text, 100px radius, 10px/20px padding.

2. Create an editorial hero headline: centered on pure white canvas, headline in OS Chronik 300 at 72px #000000 with letter-spacing -1.44px and line-height 0.9. Below at 20px gap, subtitle in OS Studio Grotesk 18px #4d4d4d. Decorate with three small four-pointed sparkle shapes in #d9defc at 15% opacity scattered asymmetrically around the headline.

3. Create a content card grid: three equal-width cards in a row with 20px gaps. Each card: white background, 1px #f5f5f5 border, 16px radius, 24px padding. Card 1 header: 'Docs' in #5f79ff 12px caption, title 'Whitepaper' in OS Studio Grotesk 20px #000000, body in 15px #4d4d4d. Footer: violet pill button ('Read', #5f79ff fill, white text, 100px radius) on left, circular 40px '+' button with 1px #a6a6a6 border on right.

4. Create a section divider: a 3px tall full-bleed band at the page bottom, split into three segments — left third #01fe93, middle third #5f79ff, right third #000000 — sitting flush against the next section with no padding above or below.

5. Create a highlight card: white card with 1px #a6a6a6 border, 16px radius. Top half: 16px radius image area filled with a dark (#0a0a0a) background showing a green-teal neural network graph (thin lines connecting small nodes in #01fe93 and #5f79ff at 60% opacity). Bottom half: 24px padding with title in OS Studio Grotesk 24px #000000, body in 15px #4d4d4d, and a violet pill 'Read' button at the bottom-left.

## Typography Pairing Logic

The system uses exactly two typefaces with strict role separation. OS Studio Grotesk (geometric grotesque, weight 400 only) handles all functional UI: nav, buttons, labels, body copy, card titles, metadata. OS Chronik (transitional serif, weight 300 only) handles editorial moments: hero display text, section openers, large pull-quotes, the 'Build • Launch • Run' style statements. The 300 serif weight is anti-convention — most brands push serif headlines to 400–700 for authority; here the whisper weight creates authority through restraint, letting the violet action color carry the system's assertiveness. The grotesque stays at 400 throughout to avoid competing with the serif's lightness. Negative letter-spacing tightens both faces at larger sizes (-0.020em at 72px display, -0.017em at 20–24px subhead) and relaxes toward 0 at 12–15px body sizes.

## Similar Brands

- **Linear** — Same white-canvas minimalism with a single vivid chromatic accent for actions, hairline-bordered flat cards, and tight geometric sans-serif UI typography
- **Vercel** — Near-identical floating pill nav bar, generous section whitespace, pure white surfaces with no decorative shadows, and rationed single-accent color usage
- **Stripe** — Editorial serif headlines paired with clean grotesque body type, gradient-free flat surfaces, and the same gallery-like document-card grid rhythm
- **Anthropic** — Restrained typography with intentional weight contrast between display and body, off-white card surfaces, and minimal use of a single brand chromatic
- **Framer** — Pill-shaped primary CTAs, light-mode interface with floating elevated nav, and the same pattern of decorative atmospheric shapes (sparkles, dots) around display type

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-signal-violet: #5f79ff;
  --color-mint-pulse: #01fe93;
  --color-pure-white: #ffffff;
  --color-ink-black: #000000;
  --color-fog-gray: #f5f5f5;
  --color-mist-gray: #a6a6a6;
  --color-ash-gray: #4d4d4d;
  --color-smoke-gray: #9c9c9c;
  --color-slate-gray: #707070;

  /* Typography — Font Families */
  --font-sans-serif: 'sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-os-studio-grotesk: 'OS Studio Grotesk', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-os-chronik: 'OS Chronik', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.2;
  --text-body: 15px;
  --leading-body: 1.4;
  --text-subheading: 20px;
  --leading-subheading: 1.25;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.2;
  --text-heading: 30px;
  --leading-heading: 1.18;
  --text-heading-lg: 40px;
  --leading-heading-lg: 1.1;
  --text-display: 72px;
  --leading-display: 0.9;
  --tracking-display: -1.44px;

  /* Typography — Weights */
  --font-weight-light: 300;
  --font-weight-regular: 400;

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
  --spacing-48: 48px;
  --spacing-60: 60px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-120: 120px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 24px;
  --element-gap: 10-20px;

  /* Border Radius */
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-3xl: 40px;
  --radius-full: 100px;
  --radius-full-2: 1000px;

  /* Named Radii */
  --radius-nav: 16px;
  --radius-cards: 16px;
  --radius-badges: 100px;
  --radius-images: 16px;
  --radius-inputs: 12px;
  --radius-buttons: 100px;

  /* Shadows */
  --shadow-xl: rgba(0, 0, 0, 0.1) 0px 0px 48px 0px;

  /* Surfaces */
  --surface-canvas: #ffffff;
  --surface-card: #f5f5f5;
  --surface-tint-wash: #d9defc;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-signal-violet: #5f79ff;
  --color-mint-pulse: #01fe93;
  --color-pure-white: #ffffff;
  --color-ink-black: #000000;
  --color-fog-gray: #f5f5f5;
  --color-mist-gray: #a6a6a6;
  --color-ash-gray: #4d4d4d;
  --color-smoke-gray: #9c9c9c;
  --color-slate-gray: #707070;

  /* Typography */
  --font-sans-serif: 'sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-os-studio-grotesk: 'OS Studio Grotesk', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-os-chronik: 'OS Chronik', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.2;
  --text-body: 15px;
  --leading-body: 1.4;
  --text-subheading: 20px;
  --leading-subheading: 1.25;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.2;
  --text-heading: 30px;
  --leading-heading: 1.18;
  --text-heading-lg: 40px;
  --leading-heading-lg: 1.1;
  --text-display: 72px;
  --leading-display: 0.9;
  --tracking-display: -1.44px;

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
  --spacing-48: 48px;
  --spacing-60: 60px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-120: 120px;

  /* Border Radius */
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-3xl: 40px;
  --radius-full: 100px;
  --radius-full-2: 1000px;

  /* Shadows */
  --shadow-xl: rgba(0, 0, 0, 0.1) 0px 0px 48px 0px;
}
```
