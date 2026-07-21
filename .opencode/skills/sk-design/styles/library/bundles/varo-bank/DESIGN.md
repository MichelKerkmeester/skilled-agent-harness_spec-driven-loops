# Varo Bank — Style Reference
> neon bank statement on a sticky note — bold compressed type punched onto bright colored cardstock, held together by hairline black outlines

**Theme:** light

Varo Bank reads like a confident consumer-finance poster series printed on colored cardstock: pure white canvases interrupted by full-bleed bands of violet, lime, coral, and cream, each carrying chunky ultra-compressed display type. The visual system is deliberately loud — National 2 Compressed at 96–147px drives every headline with near-zero leading, making text behave like a graphic block rather than prose. A single saturated violet (#8c58d0) is the only true interactive color; everything else chromatic is decorative atmosphere, and the only neutrals that matter are true black and white. Borders are hairline and dark, radii are universally 4px, and shadows are absent — depth comes from flat color collision, not elevation. The whole product feels Gen-Z native: playful, financial-literacy-forward, and graphically assertive without feeling corporate.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Varo Violet | `#8c58d0` | `--color-varo-violet` | Primary action buttons, active nav, brand logo — the single saturated mid-violet that powers all interactive states |
| Deep Plum | `#42185f` | `--color-deep-plum` | Dark accent surfaces, bold text on light cards, full-bleed dark band backgrounds — almost-black with violet undertone |
| Lilac Mist | `#cdb0fa` | `--color-lilac-mist` | Soft violet fill for selected/secondary surface states, tag backgrounds |
| Coral Ember | `#ed6c52` | `--color-coral-ember` | Decorative section fills, icon highlights, dotted ticker text — warm chromatic punctuation that breaks up the violet dominance |
| Salmon Wash | `#f2a295` | `--color-salmon-wash` | Soft warm section background, muted coral — large-area color band that reads warm without screaming |
| Butter Cream | `#faefdc` | `--color-butter-cream` | Pale cream surface band — the gentlest warm neutral, used as an alternate section background to white |
| Lemon Zest | `#fdf0af` | `--color-lemon-zest` | High-saturation yellow accent for card borders, feature callouts, ticker text — never a fill, always an outline or text |
| Lime Pulse | `#d4e84b` | `--color-lime-pulse` | Vivid lime used in feature card backgrounds and outlined graphic elements — the most attention-grabbing decorative color |
| Forest Ink | `#183428` | `--color-forest-ink` | Deep green for dark feature card backgrounds and high-contrast text — rare but anchors green-themed cards |
| Mustard Shadow | `#4a4216` | `--color-mustard-shadow` | Muted olive text and border accent on yellow/cream surfaces — never used as a fill |
| Carbon | `#000000` | `--color-carbon` | Primary text, hairline borders, icon strokes — the dominant structural color |
| Paper White | `#ffffff` | `--color-paper-white` | Page canvas, card surfaces, button text on colored fills, inverted text on dark bands |
| Soft Ash | `#1c1c1c` | `--color-soft-ash` | Near-black secondary text and borders — barely distinguishable from Carbon but used for slightly softer contrast |
| Concrete | `#939393` | `--color-concrete` | Muted helper text, disabled states, secondary metadata |
| Fog | `#eff2f5` | `--color-fog` | Cool light-gray surface, pressed-button background, input field fill on dark sections |

## Tokens — Typography

### Neue Haas Grotesk Display — Body, subheads, small labels, button text, nav, form copy — the workhorse neo-grot at 12–72px. Weight 450 is the signature mid-weight for body copy; 500 for nav and labels; 400 for de-emphasized body. Letter-spacing tightens from 0.0200em at 12px to -0.0200em at 72px. Substitute: Inter, Söhne, or Neue Haas Grotesk Text Pro. · `--font-neue-haas-grotesk-display`
- **Weights:** 400, 450, 500
- **Sizes:** 12, 14, 16, 18, 20, 22, 28, 36, 44, 52, 72
- **Line height:** 1.11–1.56
- **Letter spacing:** -0.0200em, -0.0190em, -0.0130em, -0.0100em, 0.0200em, 0.0360em
- **Role:** Body, subheads, small labels, button text, nav, form copy — the workhorse neo-grot at 12–72px. Weight 450 is the signature mid-weight for body copy; 500 for nav and labels; 400 for de-emphasized body. Letter-spacing tightens from 0.0200em at 12px to -0.0200em at 72px. Substitute: Inter, Söhne, or Neue Haas Grotesk Text Pro.

### National 2 Compressed — Display headlines only — used at 56–147px with line-height 0.80–0.95, the ultra-condensed proportions make type behave as a graphic block; weight 450 for default, 700 for maximum-impact stat callouts. Substitute: Oswald (700/600) or Antonio Bold. Letter-spacing: -0.0100em across the scale. · `--font-national-2-compressed`
- **Weights:** 450, 700
- **Sizes:** 32, 56, 76, 96, 115, 147
- **Line height:** 0.80–1.10
- **Letter spacing:** -0.0100em
- **Role:** Display headlines only — used at 56–147px with line-height 0.80–0.95, the ultra-condensed proportions make type behave as a graphic block; weight 450 for default, 700 for maximum-impact stat callouts. Substitute: Oswald (700/600) or Antonio Bold. Letter-spacing: -0.0100em across the scale.

### Arial — Arial — detected in extracted data but not described by AI · `--font-arial`
- **Weights:** 400
- **Sizes:** 13px
- **Line height:** 1.2
- **Role:** Arial — detected in extracted data but not described by AI

### Times — Times — detected in extracted data but not described by AI · `--font-times`
- **Weights:** 400
- **Sizes:** 16px
- **Line height:** 1.2
- **Role:** Times — detected in extracted data but not described by AI

### Metropolis — Metropolis — detected in extracted data but not described by AI · `--font-metropolis`
- **Weights:** 500
- **Sizes:** 14px
- **Line height:** 1.14
- **Letter spacing:** -0.004
- **Role:** Metropolis — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.33 | 0.24px | `--text-caption` |
| body-sm | 14px | 1.2 | -0.004px | `--text-body-sm` |
| body | 16px | 1.4 | — | `--text-body` |
| subheading | 20px | 1.28 | — | `--text-subheading` |
| heading-sm | 28px | 1.2 | — | `--text-heading-sm` |
| heading | 36px | 1.17 | — | `--text-heading` |
| heading-lg | 52px | 1.11 | -0.676px | `--text-heading-lg` |
| display | 96px | 0.95 | -0.96px | `--text-display` |
| display-xl | 147px | 0.8 | -1.47px | `--text-display-xl` |

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
| 96 | 96px | `--spacing-96` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 4px |
| cards | 4px |
| images | 4px |
| inputs | 4px |
| buttons | 4px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 48-64px
- **Card padding:** 24px
- **Element gap:** 16-24px

## Components

### Primary CTA Button (Filled Violet)
**Role:** Only filled button variant — every meaningful action in the product

Background #8c58d0, white text at 16px Neue Haas Grotesk Display weight 500, 4px radius, 13px vertical padding × 32px horizontal padding, 1px border #8c58d0. On hover the border stays; only opacity or a subtle darken is acceptable. No shadow.

### Text-Only Action Button (Ghost)
**Role:** Secondary actions rendered as clickable text, often with an arrow

No background, no border. Text at 14–16px Neue Haas Grotesk Display weight 500 in #000000 or color-matched to the section. Frequently paired with a right-pointing arrow glyph. Padding 4px vertical.

### Email Input Field
**Role:** Hero and form lead-capture

White background, 1px border #000000, 4px radius, 16px horizontal padding × 12px vertical padding, placeholder at 16px weight 400 in #939393. Border thickens or shifts to #8c58d0 on focus. Always paired inline with a Primary CTA Button.

### Top Navigation Bar
**Role:** Persistent global header

White background, Varo wordmark in #8c58d0 at far left, 5–6 nav links in Neue Haas Grotesk Display 16px weight 500 #000000, spaced 24–40px apart. Log in text-link on the right, Primary CTA Button at far right. No border-bottom, no shadow — relies on the canvas contrast.

### Hero Split Section
**Role:** First screen above the fold

Two-column at ~1200px max-width, left column holds a kicker label (14px), display headline (National 2 Compressed 72–96px weight 450), and inline email capture. Right column is a large 4px-radius photograph or device mock on white canvas. Section padding 64–80px vertical.

### Ticker Marquee Band
**Role:** Scrolling trust statement / feature highlight

Full-bleed horizontal band, no fixed height — type fills viewport. Background rotates between #8c58d0 and dark sections. Text in National 2 Compressed 56–76px weight 700 in contrasting color (yellow on violet, violet on cream), separated by bullet dots. Repeats infinitely, scroll speed slow.

### Feature Card (Colored Fill)
**Role:** Product feature highlight in the 'Start banking better today' grid

Flat colored fill (#fdf0af, #d4e84b, #42185f, #8c58d0, #f2a295), 1px border in #000000, 4px radius, padding 24px. Headline uses National 2 Compressed 44–56px weight 450 in contrasting text color. A small line-art icon sits in one corner. Cards in a 4-column row on desktop, equal heights.

### Split Feature Section
**Role:** Product capability pages (Cash Advance, Line of Credit)

Two-column with generous 80–120px vertical padding. Background alternates white / cream / salmon. One side holds a National 2 Compressed 76–115px display headline in #000000; the other holds a 4px-radius lifestyle photograph at 500–600px width. Kicker label above headline at 16px weight 500.

### Dark CTA Banner
**Role:** Conversion closer, e.g. 'Quails apply' sections

Full-width band with #42185f or #183428 background, white or yellow text, 4px-radius inline Primary CTA Button (violet on dark, not inverted). Padding 48–64px vertical, text-aligned left, max-width 1200px.

### Footer
**Role:** Legal, links, app store badges

White or #1c1c1c background depending on section adjacency. Link text at 14px weight 400 in #000000 or #ffffff, 8–16px row gap. No large logo lockup — just the Varo wordmark small. Bottom legal copy in 12px #939393.

### Stat Callout (Oversized Number)
**Role:** In-page emphasis on dollar amounts or key facts

National 2 Compressed 115–147px weight 700, line-height 0.80, letter-spacing -0.0100em. Always in #000000 on light sections, or #fdf0af on dark sections. A superscript footnote numeral (¹ ² ³) is rendered inline at 1/4 the headline size in the same weight.

## Do's and Don'ts

### Do
- Use National 2 Compressed at 76–147px with line-height 0.80–0.95 for every display headline; never set line-height above 1.0 on display sizes.
- Apply the single violet #8c58d0 for every filled primary action — Log in link, Get started button, and Learn more all share this exact fill.
- Combine two type families only: National 2 Compressed for display, Neue Haas Grotesk Display for everything from 72px down. Never mix a third face.
- Set all radii to 4px — buttons, inputs, cards, images, and tags share the same corner radius for a uniform, sticker-like quality.
- Use 1px solid #000000 borders on every card, input, and graphic element. Color lives in fills, not strokes.
- Anchor every section with a kicker label (14–16px weight 500) above the display headline; the kicker names the product or concept.
- Tighten letter-spacing on large sizes: -0.0100em on National 2 Compressed, -0.0200em on Neue Haas Grotesk Display at 52px and above.

### Don't
- Never use #8c58d0 as decorative fill or section background — it is reserved exclusively for interactive elements. Colored section bands use cream, salmon, plum, or lime instead.
- Never introduce drop shadows, blur effects, or multi-layer elevation. The system is intentionally flat — if a surface needs separation, add a 1px black border or a color change.
- Never mix line-heights above 1.0 with National 2 Compressed — the compressed letterforms need tight leading to read as a graphic block; open leading destroys the block effect.
- Never place a chromatic button on a chromatic section background of the same hue family — violet buttons only sit on white, cream, or dark plum.
- Never use a serif, monospace, or handwriting face — the two-family system (compressed display + neutral grotesk) is the entire typographic identity.
- Never round corners above 4px or use pill-shaped buttons; 4px is a hard rule across the system.
- Never use #0000ee or any browser-default link color; all link text and underlines are #000000 or section-matched.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Paper White | `#ffffff` | Default page canvas, hero backgrounds |
| 1 | Cool Fog | `#eff2f5` | Pressed-state button, input on dark sections |
| 2 | Butter Cream | `#faefdc` | Warm alternate section background |
| 3 | Salmon Wash | `#f2a295` | Full-bleed colored section band |
| 4 | Deep Plum | `#42185f` | Dark inverted section band |

## Elevation

- **Feature Card:** `none — flat color fill with 1px solid #000000 border, no shadow`
- **Primary Button:** `none — flat fill, no shadow`

## Imagery

Varo's imagery is lifestyle-first and tightly cropped: young adults in casual environments (apartment interiors, laundromats, coffee shops) photographed in natural light with a warm, slightly desaturated treatment. Devices — iPhones showing the Varo app — appear frequently as hand-held hero objects rather than floating product shots. All photos are contained in 4px-radius frames with no shadow, feeling pasted onto the page like magazine cutouts. No illustrations, no abstract graphics, no 3D renders. Icons are line-art at 1.5–2px stroke weight, mono-color, matching the border treatment. Imagery occupies roughly 40% of any given section, balanced against the oversized display typography.

## Layout

Max-width 1200px centered content on a full-bleed white canvas. The hero is a 50/50 split: text-and-email-capture on the left, device-in-hand photo on the right, both at generous scale. Sections alternate rhythm by color band rather than by content type — a full-bleed violet or salmon band, then a contained white section, then another colored band, creating a poster-zine cadence. Product feature pages use a consistent 50/50 split with the display headline on one side and a cropped lifestyle photo on the other, flipping which side carries which across scroll. Feature cards appear in a 4-column row in the 'Start banking today' grid. Vertical rhythm is bold: 64–80px section padding, with display headlines so large they often dictate section height. Navigation is a clean top bar with no sticky behavior implied — no mega-menu, no sidebar. The overall cadence is: loud display → photo or card grid → colored band ticker → next section.

## Agent Prompt Guide

## Quick Color Reference
- text: #000000
- background: #ffffff
- border: #000000 (1px, always)
- accent: #8c58d0 (violet, interactive only)
- section band options: #faefdc (cream), #f2a295 (salmon), #42185f (plum), #d4e84b (lime)
- primary action: #8c58d0 (filled action)

## 3-5 Example Component Prompts
1. **Hero split section**: White background, max-width 1200px, two columns. Left column: 14px kicker 'Free online banking' in #000000 weight 500, then 96px headline in National 2 Compressed weight 450 line-height 0.95 letter-spacing -0.96px color #000000 ('Say hello to a 100% free bank account.'), then inline email input + violet Get started button. Right column: 4px-radius photograph of a hand holding an iPhone, 500px wide.

2. **Feature card in a 4-column grid**: Flat #fdf0af (lemon) fill, 1px solid #000000 border, 4px radius, 24px padding. Headline in National 2 Compressed 52px weight 450 color #000000. Line-art icon in top-right corner, #000000 stroke.

3. **Ticker marquee band**: Full-bleed #8c58d0 background, 80px vertical padding. Text in National 2 Compressed 56px weight 700 color #fdf0af, repeating: 'NO OVERDRAFT FEES · NO IN-NETWORK ATM FEES · NO MINIMUM BALANCE' separated by middle dots, scrolling horizontally at slow speed.

4. **Outlined ghost action button**: No background, 1px solid #000000 border, 4px radius, 13px vertical × 32px horizontal padding. Text in Neue Haas Grotesk Display 16px weight 500 color #000000 ('Learn more').

5. **Stat callout**: National 2 Compressed 147px weight 700 line-height 0.80 letter-spacing -1.47px color #000000, with a superscript '³' at 36px same weight, paired with body copy in Neue Haas Grotesk Display 16px weight 400 color #000000 at 1.40 line-height.

## Similar Brands

- **Chime** — Same digital-bank-only positioning with a single brand accent color, bold sans-serif headlines, and lifestyle photography of young adults in everyday financial moments
- **Current** — Identical use of oversized compressed display type for product headlines, flat colored section bands, and a single mid-violet as the primary interactive accent
- **Cash App** — Same Gen-Z financial-product energy: flat color blocks, minimal borders, chunky condensed display type, and bright decorative accent palette beyond the brand color
- **Step** — Same consumer-banking poster aesthetic — alternating colored bands, oversized headlines, and device-in-hand hero photography with a single vivid purple as the primary action
- **SoFi** — Same hairline-border card system and flat-color section bands, though SoFi runs more navy-dominant; Varo pushes the color palette further into coral and lime territory

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-varo-violet: #8c58d0;
  --color-deep-plum: #42185f;
  --color-lilac-mist: #cdb0fa;
  --color-coral-ember: #ed6c52;
  --color-salmon-wash: #f2a295;
  --color-butter-cream: #faefdc;
  --color-lemon-zest: #fdf0af;
  --color-lime-pulse: #d4e84b;
  --color-forest-ink: #183428;
  --color-mustard-shadow: #4a4216;
  --color-carbon: #000000;
  --color-paper-white: #ffffff;
  --color-soft-ash: #1c1c1c;
  --color-concrete: #939393;
  --color-fog: #eff2f5;

  /* Typography — Font Families */
  --font-neue-haas-grotesk-display: 'Neue Haas Grotesk Display', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-national-2-compressed: 'National 2 Compressed', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-times: 'Times', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-metropolis: 'Metropolis', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.33;
  --tracking-caption: 0.24px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.2;
  --tracking-body-sm: -0.004px;
  --text-body: 16px;
  --leading-body: 1.4;
  --text-subheading: 20px;
  --leading-subheading: 1.28;
  --text-heading-sm: 28px;
  --leading-heading-sm: 1.2;
  --text-heading: 36px;
  --leading-heading: 1.17;
  --text-heading-lg: 52px;
  --leading-heading-lg: 1.11;
  --tracking-heading-lg: -0.676px;
  --text-display: 96px;
  --leading-display: 0.95;
  --tracking-display: -0.96px;
  --text-display-xl: 147px;
  --leading-display-xl: 0.8;
  --tracking-display-xl: -1.47px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-w450: 450;
  --font-weight-medium: 500;
  --font-weight-bold: 700;

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
  --spacing-96: 96px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 48-64px;
  --card-padding: 24px;
  --element-gap: 16-24px;

  /* Border Radius */
  --radius-md: 4px;

  /* Named Radii */
  --radius-tags: 4px;
  --radius-cards: 4px;
  --radius-images: 4px;
  --radius-inputs: 4px;
  --radius-buttons: 4px;

  /* Surfaces */
  --surface-paper-white: #ffffff;
  --surface-cool-fog: #eff2f5;
  --surface-butter-cream: #faefdc;
  --surface-salmon-wash: #f2a295;
  --surface-deep-plum: #42185f;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-varo-violet: #8c58d0;
  --color-deep-plum: #42185f;
  --color-lilac-mist: #cdb0fa;
  --color-coral-ember: #ed6c52;
  --color-salmon-wash: #f2a295;
  --color-butter-cream: #faefdc;
  --color-lemon-zest: #fdf0af;
  --color-lime-pulse: #d4e84b;
  --color-forest-ink: #183428;
  --color-mustard-shadow: #4a4216;
  --color-carbon: #000000;
  --color-paper-white: #ffffff;
  --color-soft-ash: #1c1c1c;
  --color-concrete: #939393;
  --color-fog: #eff2f5;

  /* Typography */
  --font-neue-haas-grotesk-display: 'Neue Haas Grotesk Display', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-national-2-compressed: 'National 2 Compressed', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-times: 'Times', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-metropolis: 'Metropolis', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.33;
  --tracking-caption: 0.24px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.2;
  --tracking-body-sm: -0.004px;
  --text-body: 16px;
  --leading-body: 1.4;
  --text-subheading: 20px;
  --leading-subheading: 1.28;
  --text-heading-sm: 28px;
  --leading-heading-sm: 1.2;
  --text-heading: 36px;
  --leading-heading: 1.17;
  --text-heading-lg: 52px;
  --leading-heading-lg: 1.11;
  --tracking-heading-lg: -0.676px;
  --text-display: 96px;
  --leading-display: 0.95;
  --tracking-display: -0.96px;
  --text-display-xl: 147px;
  --leading-display-xl: 0.8;
  --tracking-display-xl: -1.47px;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-96: 96px;

  /* Border Radius */
  --radius-md: 4px;
}
```
