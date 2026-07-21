# Sequel — Style Reference
> Private screening after dark — a single warm lamp in an otherwise unlit cinema.

**Theme:** dark

Sequel is a private screening after dark — a pitch-black canvas hosting cinematic, warm-toned portraiture and a single warm off-white accent that acts like lamplight in an otherwise unlit room. The system is strictly achromatic (0% colorfulness): pure black, warm cream, and three neutral grays carry the entire visual language, and the absence of chromatic color is itself the brand position — money this old doesn't need to shout. Typography is editorial and restrained, pairing a custom geometric sans (VisueltPro) with a display serif (Bradford) reserved for the aspirational word "legacy" set in italic. Weight 300 headlines whisper instead of declare; uppercase tracked labels (0.05–0.08em) do the typographic work most sites assign to color. Components are glassy and precise — pill controls, frosted chips with an inner top highlight, flat #202020 cards that sit one step above the void — and the only shadows in the system are functional: a soft drop under the cream button and a rim-lit glass effect on badges.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Void Black | `#000000` | `--color-void-black` | Page canvas, nav background, icon fill — the default state of the page; everything is built ON the void, not against it |
| Pure White | `#ffffff` | `--color-pure-white` | Primary text, heading fill, ghost button stroke, icon stroke — the reading and structural color |
| Charcoal | `#202020` | `--color-charcoal` | Elevated card surface, secondary panels — the single quiet step above the canvas that implies elevation without shadow |
| Graphite | `#333333` | `--color-graphite` | Hairline borders, badge outlines, subtle dividers — sits between surface and text, never decorative |
| Lamp Cream | `#f5f5f0` | `--color-lamp-cream` | Primary filled action button background — the only chromatic-temperature accent; warm off-white reads as lamplight against pure black and keeps CTAs from feeling sterile |
| Smoke | `#999999` | `--color-smoke` | Light text on dark surfaces, inverse labels, and high-contrast captions. Do not promote it to the primary CTA color |

## Tokens — Typography

### VisueltPro — Primary workhorse across all contexts: body (16px/400), nav links (15–16px/500), uppercase labels (10–13px/400–500 with 0.03–0.08em tracking), and narrative headlines (30–54px/300). The whisper-thin 300 weight at 54px is the signature move — most premium sites use bold or serif italic for hero text; Sequel uses hairline sans and lets size + negative tracking do the work. · `--font-visueltpro`
- **Substitute:** Inter, Satoshi, General Sans
- **Weights:** 300, 400, 500
- **Sizes:** 10px, 11px, 12px, 13px, 14px, 15px, 16px, 18px, 20px, 21px, 30px, 32px, 54px, 57px, 115px, 128px
- **Line height:** 1.0–1.5
- **Letter spacing:** -0.05em at 57px and 128px display sizes; -0.025em at 30px subheadings; +0.08em at 10px caption; +0.05em at 11–12px labels; +0.03em at 13px small caps
- **OpenType features:** `"ss01" on, "cv11" on`
- **Role:** Primary workhorse across all contexts: body (16px/400), nav links (15–16px/500), uppercase labels (10–13px/400–500 with 0.03–0.08em tracking), and narrative headlines (30–54px/300). The whisper-thin 300 weight at 54px is the signature move — most premium sites use bold or serif italic for hero text; Sequel uses hairline sans and lets size + negative tracking do the work.

### Bradford — Display serif reserved exclusively for the aspirational/poetic word in a headline — e.g. the italic "legacy" inside "Your legacy, made." Appears at display sizes only (57–128px) and only in italic, never as running text. Creates the editorial poetry that distinguishes a family-office brand from a VC. · `--font-bradford`
- **Substitute:** Canela, Tiempos Headline, GT Super
- **Weights:** 500
- **Sizes:** 32px, 57px, 128px
- **Line height:** 1.0–1.2
- **Letter spacing:** -0.05em at 128px, -0.025em at 57px
- **Role:** Display serif reserved exclusively for the aspirational/poetic word in a headline — e.g. the italic "legacy" inside "Your legacy, made." Appears at display sizes only (57–128px) and only in italic, never as running text. Creates the editorial poetry that distinguishes a family-office brand from a VC.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| label-sm | 11px | 1.5 | 0.55px | `--text-label-sm` |
| body | 16px | 1.5 | — | `--text-body` |
| body-lg | 20px | 1.5 | — | `--text-body-lg` |
| subheading | 30px | 1.2 | -0.75px | `--text-subheading` |
| heading | 54px | 1.2 | — | `--text-heading` |
| heading-lg | 57px | 1 | -2.85px | `--text-heading-lg` |
| display | 128px | 1 | -3.2px | `--text-display` |

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
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |
| 96 | 96px | `--spacing-96` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 10px |
| badges | 9999px |
| inputs | 0px |
| buttons | 9999px |
| playButton | 50% |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| xl | `rgba(0, 0, 0, 0.35) 0px 10px 30px 0px, rgba(255, 255, 255...` | `--shadow-xl` |
| lg | `rgba(0, 0, 0, 0.15) 0px 4px 20px 0px` | `--shadow-lg` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 96-120px
- **Card padding:** 0px
- **Element gap:** 16px

## Components

### Primary Filled Pill Button
**Role:** The single primary action — used for "Build the future", "For members", "For founders" in nav and CTAs.

Background #f5f5f0, text #000000, 9999px border-radius, 0px vertical / 24px horizontal padding, 16px VisueltPro weight 500. Optional drop shadow rgba(0,0,0,0.15) 0px 4px 20px lifts it off the black canvas. The warm cream against pure black is the only filled button treatment in the system.

### Ghost Outline Pill Button
**Role:** Secondary action or paired navigation control.

Background transparent, 1px #ffffff border, text #ffffff, 9999px border-radius, 0px vertical / 20px horizontal padding, 16px VisueltPro weight 500. Used when a second action sits beside a primary cream button or when the action should recede into the dark canvas.

### Frosted Glass Badge
**Role:** Category labels on media cards — "Founders", "Athletes, Artists & Entrepreneurs", "Series A", "Seed".

Background rgba(200,200,200,0.1) with backdrop-filter blur(20px) saturate(1.4), text #ffffff, 9999px border-radius, 8px vertical / 16px horizontal padding, 11px VisueltPro weight 500 uppercase with +0.05em letter-spacing. Wrapped in a two-layer shadow: outer rgba(0,0,0,0.35) 0px 10px 30px plus inner inset rgba(255,255,255,0.08) 0px 1px 0px — the inner white edge is what makes it read as glass catching imaginary light, not a flat translucent chip.

### Elevated Card
**Role:** Container for content blocks that need to sit one step above the void.

Background #202020, 10px border-radius, no shadow, no border. Padding is handled by internal content, not the card itself. The single tone shift from #000 to #202020 implies elevation without a drop shadow — adding a shadow would break the flat cinematic feel.

### Cinematic Media Card
**Role:** Founder portraits, member stories, hero imagery.

Background transparent, 10px border-radius, no shadow, no internal padding. Contains a full-bleed photograph with text overlay anchored bottom-left and an optional frosted glass badge anchored top-right. Photos are warm-toned, natural-light documentary style; text sits at 16–21px over a subtle bottom gradient scrim (rgba(0,0,0,0.4) to transparent).

### Video Play Button
**Role:** The "Watch the film" call-to-action in the hero.

Circular 50% radius, 1px #ffffff border, transparent or rgba(255,255,255,0.08) background, contains a small play triangle and "Watch the film" label at 13px VisueltPro weight 400 uppercase tracked 0.03em. Sits as a floating glass element bottom-right of the hero, never inside a card.

### Section Display Heading
**Role:** The signature headline pattern — "Your legacy, made." or "The digital family office investing in founders…"

VisueltPro weight 300 or 500 at 54–128px, #ffffff, line-height 1.0–1.2, letter-spacing -0.05em at 57px+. Headlines mix weight 300 prose with an italic Bradford serif accent for the emotional keyword ("legacy"). Never set in all-caps, never decorated with gradients or color.

### Italic Serif Accent Word
**Role:** The single emotional/payoff word inside a display headline.

Bradford italic, 500 weight, same size as the surrounding VisueltPro, #ffffff. Always italic, always lowercase, always the word carrying the brand's emotional claim (currently "legacy"). Sits inline — never on its own line.

### Top Navigation Bar
**Role:** Persistent minimal header — logo left, 3 text links center, 1 pill CTA right.

Transparent background over the hero, switches to #000000 on scroll. Logo is the custom "sequel" wordmark with a four-bar mark (||||) suggesting sound-wave/equalizer. Nav links (Founders, Membership, Stories) at 15px VisueltPro weight 500, white, no underline, 16px element gap. Right-side CTA is the cream filled pill button. 0px border, no shadow, sits at the very top edge of the viewport.

### Section Heading Pair
**Role:** A reusable two-line headline block: line 1 sets context in VisueltPro, line 2 carries the italic serif payoff.

First line: VisueltPro 54px weight 300 or 57px weight 500, white, -0.05em tracking. Second line: same VisueltPro sentence with one word swapped to Bradford italic at the same size. Both lines left-aligned, anchored to a 1200px content column with 24-48px gap between lines. The pattern is "The [noun] [verb] [preposition] [italic-serif-payoff]".

### Hero Gradient Overlay
**Role:** Implicit scrim behind hero text — not a decorative gradient, a readability layer.

Linear gradient from rgba(0,0,0,0.0) at top to rgba(0,0,0,0.55) at bottom across the bottom 40% of the hero image. Ensures headline text contrast over photography without darkening the full frame. The only gradient in the system.

## Do's and Don'ts

### Do
- Use #f5f5f0 exclusively for primary filled buttons — never introduce chromatic accents, even for hover states
- Set all buttons, badges, and chips to 9999px border-radius; set all cards and image containers to 10px
- Apply weight 300 to narrative headlines at 54px and weight 500 to display headlines at 57–128px — never use bold (700+)
- Apply uppercase + positive letter-spacing (0.05–0.08em) to all label, badge, and metadata text
- Apply -0.05em letter-spacing to all display text at 57px and above
- Keep the page canvas at pure #000000 — never lighten the background or add a tint
- Use #202020 for card surfaces to imply elevation through tone, not shadow

### Don't
- Never use a chromatic color anywhere in the interface — the system is 0% colorfulness by design
- Never apply a drop shadow to cards, content surfaces, or images — only to the cream button and glass badges
- Never use sharp corners (0px radius) on buttons, badges, or chips — pill (9999px) or 10px only
- Never set body text below 16px; never set a label below 10px
- Never use a heading weight above 500 or below 300
- Never use 1px solid #fff for borders or dividers — use #333333 or glass effects only
- Never place text directly on raw photography without a bottom gradient scrim for contrast

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Void | `#000000` | Page canvas, hero background, nav background |
| 1 | Charcoal | `#202020` | Elevated card surface — single quiet elevation step |
| 2 | Graphite | `#333333` | Hairline borders, badge outlines |
| 3 | Lamp Cream | `#f5f5f0` | Primary action surface — the only non-neutral surface tone |

## Elevation

- **Primary Filled Pill Button:** `rgba(0, 0, 0, 0.15) 0px 4px 20px 0px`
- **Frosted Glass Badge:** `rgba(0, 0, 0, 0.35) 0px 10px 30px 0px, rgba(255, 255, 255, 0.08) 0px 1px 0px 0px inset`

## Imagery

Cinematic documentary-style photography dominates — warm-toned, natural-light portraits of founders, athletes, and artists in their working environments (unrolling blueprints at a wooden table, recording in a vocal booth, gazing through office windows). Images are treated as full-bleed hero stills or 10px-radius card containers, never cropped to product-spec tightness. Color treatment is warm-neutral, slightly desaturated, evoking 35mm film stock with shallow depth of field. No illustrations, no product screenshots, no 3D renders, no icon sets. The mood is intimate and observational — these are people building things in real spaces, not lifestyle stock photography. The custom logo wordmark "sequel" uses a four vertical-bar mark (||||) that reads as a sound wave or equalizer, hinting at the brand's audio/film DNA.

## Layout

Full-bleed dark canvas with content centered to a 1200px max-width column. The hero is a full-viewport cinematic still with a single display headline anchored bottom-left and a small glass play button anchored bottom-right — no nav-bar fold, no above-the-fold content block, the photograph IS the fold. Below the hero, sections alternate between pure black voids and #202020 card surfaces, with 96–120px vertical breathing room between sections. Content is arranged in 2-column card grids (founder stories, member spotlights) with 16-24px gaps. Section headings are centered or left-aligned depending on rhythm, never justified. Navigation is a minimal top bar: logo left, three text links center, single cream pill CTA right — no sidebar, no mega-menu, no search. The footer closes with a single display headline ("Your legacy, made.") and a sparse row of links.

## Agent Prompt Guide

**Quick Color Reference**
- text: #ffffff
- background: #000000
- border: #333333
- accent: #f5f5f0
- primary action: #f5f5f0 (filled action)

**Example Component Prompts**

1. *Create a primary CTA button*: 9999px border-radius, background #f5f5f0, text #000000, padding 0px 24px, font 16px VisueltPro weight 500, optional drop shadow rgba(0,0,0,0.15) 0px 4px 20px. Label the text in sentence case.

2. *Create a frosted glass category badge*: 9999px border-radius, background rgba(200,200,200,0.1) with backdrop-filter blur(20px) saturate(1.4), text #ffffff uppercase 11px VisueltPro weight 500 with +0.05em letter-spacing, padding 8px 16px. Add the two-layer shadow: outer rgba(0,0,0,0.35) 0px 10px 30px + inner inset rgba(255,255,255,0.08) 0px 1px 0px.

3. *Create a hero section with display headline*: Full-bleed background image with a bottom gradient overlay (rgba(0,0,0,0) to rgba(0,0,0,0.55) across the bottom 40%). Headline: VisueltPro 128px weight 500, #ffffff, letter-spacing -3.2px, line-height 1.0. Swap the emotional keyword (e.g. "legacy") to Bradford italic at the same size. Anchor the headline bottom-left of the 1200px content column.

4. *Create a 2-column cinematic media card grid*: Two cards side by side with 16px gap, each card 10px border-radius with no shadow and no padding. Inside each card: a full-bleed photograph, a frosted glass badge top-right, and a 21px VisueltPro weight 500 white headline bottom-left over the gradient scrim.

5. *Create a circular video play button*: 50% border-radius, 1px #ffffff border, transparent background, contains a 10px white play triangle and "Watch the film" label at 13px VisueltPro weight 400 uppercase with +0.03em tracking.

## Typography Signature

The headline pattern alternates between two voices: VisueltPro weight 300 for narrative prose and Bradford italic for the single emotional payoff word. This is the system's only typographic flourish — there is no decorative color, no gradient type, no animated text. The mix of hairline sans and italic serif inside the same sentence is what makes a Sequel headline read as editorial rather than corporate. Display sizes (57–128px) always carry -0.025em to -0.05em tracking; uppercase labels (10–13px) always carry +0.03em to +0.08em. Body text is always 16px minimum, always VisueltPro weight 400, always white on black or charcoal.

## Motion Philosophy

The system uses expressive but restrained motion. Standard transitions are 0.2–0.3s with cubic-bezier(0.625, 0.05, 0, 1) easing — a slow-out curve that makes UI feel weighted and premium rather than snappy. Common transitions: opacity fades, transform slides, background and border-color shifts. There is a 45s linear `leagues-scrolling` marquee animation (the only long-duration motion in the system), used for partner/portfolio logo strips. Never animate color hue, never use spring physics, never use bounce easings — motion should feel like a slow zoom on a film still, not a UI spring.

## Similar Brands

- **A24** — Same dark-canvas editorial language — pitch-black backgrounds, warm cinematic photography, a single accent tone, and display serif mixed with restrained sans typography. Both brands signal taste through restraint rather than decoration.
- **Apple Vision Pro product page** — Full-bleed cinematic photography on pure black, hairline-weight display headlines at extreme sizes, and warm off-white pill CTAs as the only action color. Same "the image is the interface" philosophy.
- **Kering corporate site** — Institutional luxury on pure black — heavy use of large breathing room, charcoal-on-black card surfaces, serif accents in display headings, and zero chromatic color in the UI chrome.
- **The Row (therow.com)** — Monochrome editorial commerce — same warm cream accent against black, same display serif for product names, same whisper-thin sans for body text, same refusal to use color as decoration.
- **Berkshire Hathaway annual letters web archive** — Anti-design institutional confidence — the visual system signals seriousness through what it omits (no color, no shadows, no decoration) rather than what it adds. Same "we don't need to impress you" posture.

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-void-black: #000000;
  --color-pure-white: #ffffff;
  --color-charcoal: #202020;
  --color-graphite: #333333;
  --color-lamp-cream: #f5f5f0;
  --color-smoke: #999999;

  /* Typography — Font Families */
  --font-visueltpro: 'VisueltPro', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-bradford: 'Bradford', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-label-sm: 11px;
  --leading-label-sm: 1.5;
  --tracking-label-sm: 0.55px;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-body-lg: 20px;
  --leading-body-lg: 1.5;
  --text-subheading: 30px;
  --leading-subheading: 1.2;
  --tracking-subheading: -0.75px;
  --text-heading: 54px;
  --leading-heading: 1.2;
  --text-heading-lg: 57px;
  --leading-heading-lg: 1;
  --tracking-heading-lg: -2.85px;
  --text-display: 128px;
  --leading-display: 1;
  --tracking-display: -3.2px;

  /* Typography — Weights */
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-medium: 500;

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
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-96: 96px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 96-120px;
  --card-padding: 0px;
  --element-gap: 16px;

  /* Border Radius */
  --radius-lg: 10px;
  --radius-full: 9999px;

  /* Named Radii */
  --radius-cards: 10px;
  --radius-badges: 9999px;
  --radius-inputs: 0px;
  --radius-buttons: 9999px;
  --radius-playbutton: 50%;

  /* Shadows */
  --shadow-xl: rgba(0, 0, 0, 0.35) 0px 10px 30px 0px, rgba(255, 255, 255, 0.08) 0px 1px 0px 0px inset;
  --shadow-lg: rgba(0, 0, 0, 0.15) 0px 4px 20px 0px;

  /* Surfaces */
  --surface-void: #000000;
  --surface-charcoal: #202020;
  --surface-graphite: #333333;
  --surface-lamp-cream: #f5f5f0;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-void-black: #000000;
  --color-pure-white: #ffffff;
  --color-charcoal: #202020;
  --color-graphite: #333333;
  --color-lamp-cream: #f5f5f0;
  --color-smoke: #999999;

  /* Typography */
  --font-visueltpro: 'VisueltPro', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-bradford: 'Bradford', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-label-sm: 11px;
  --leading-label-sm: 1.5;
  --tracking-label-sm: 0.55px;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-body-lg: 20px;
  --leading-body-lg: 1.5;
  --text-subheading: 30px;
  --leading-subheading: 1.2;
  --tracking-subheading: -0.75px;
  --text-heading: 54px;
  --leading-heading: 1.2;
  --text-heading-lg: 57px;
  --leading-heading-lg: 1;
  --tracking-heading-lg: -2.85px;
  --text-display: 128px;
  --leading-display: 1;
  --tracking-display: -3.2px;

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
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-96: 96px;

  /* Border Radius */
  --radius-lg: 10px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-xl: rgba(0, 0, 0, 0.35) 0px 10px 30px 0px, rgba(255, 255, 255, 0.08) 0px 1px 0px 0px inset;
  --shadow-lg: rgba(0, 0, 0, 0.15) 0px 4px 20px 0px;
}
```
