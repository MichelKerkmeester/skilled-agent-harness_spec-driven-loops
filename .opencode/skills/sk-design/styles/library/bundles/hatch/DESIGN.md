# Hatch — Style Reference
> Hand-drawn zine meets pastel candy store. A cream-paper canvas splashed with mint highlights, confetti dots, and pill-shaped CTAs, where a chunky bold serif whispers fun and a blue mascot winks from the corner.

**Theme:** light

Hatch operates as a playful creative-agency brand on a warm cream canvas: the page reads like a hand-illustrated zine rather than a corporate SaaS site. Recoleta, a chunky high-contrast serif at very large sizes with tight negative tracking, carries every headline while a quiet grotesque (Lota Grotes Que Alt) handles UI and body. A four-color pastel palette — mint, sky, peach, pink — functions as functional punctuation against the cream, with mint green reserved for the primary action and the other three cycling through decorative dots, highlight swashes, illustration strokes, and tag chips. Cards, buttons, and tags lean heavily rounded (16–40px, full pill for CTAs), generous 4px-based spacing creates breathing room, and a recurring visual vocabulary of hand-drawn mint highlight swashes, confetti dots, and a cute blue mascot character threads the whole system together.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Cream Paper | `#f5f4f0` | `--color-cream-paper` | Page background, canvas — warm off-white that softens the overall feel and keeps the pastel accents from vibrating against pure white |
| Pure White | `#ffffff` | `--color-pure-white` | Card and button surfaces — sits one elevation above the cream canvas |
| Ink Black | `#000000` | `--color-ink-black` | Primary text, hairline borders, icon strokes, card outlines — the dominant structural color, 3625 occurrences make it the spine of every layout |
| Charcoal | `#222222` | `--color-charcoal` | Body text and secondary headings when a slightly softer black is needed |
| Slate | `#333333` | `--color-slate` | Nav text and subdued UI labels |
| Fog | `#dddfe2` | `--color-fog` | Subtle link underlines and dividers in muted contexts |
| Mint Splash | `#99ffcc` | `--color-mint-splash` | Primary action button fill, hand-drawn headline highlight swashes, active nav emphasis — the signature color that signals go |
| Plum Ink | `#160042` | `--color-plum-ink` | Deep brand accent for dark surface text, illustration fills, and emphasis — provides a rich counterweight to the pastels |
| Aubergine | `#26153f` | `--color-aubergine` | Outlined action border, dark button outline variant — borders and strokes when a deeper violet frame is needed without filling |
| Sky Pop | `#7bbbff` | `--color-sky-pop` | Decorative illustration strokes, confetti dots, secondary accent chips, icon outlines — the cool member of the pastel set |
| Bubblegum | `#ff99cc` | `--color-bubblegum` | Decorative confetti dots, highlight swashes, playful accent shapes — adds warmth and energy |
| Peach Pop | `#ffcc99` | `--color-peach-pop` | Decorative dots, warm accent fills, illustration warm tones — the sunset note in the pastel quartet |

## Tokens — Typography

### Recoleta — All headlines, hero display, nav wordmark. Used exclusively at weight 700; the high-contrast chunky serif gives the brand its editorial-creative voice. Scales from 32px subheadings up to 151px hero display. Tight negative tracking (approximately -0.028em) tightens the bold forms at large sizes so the headline reads as one confident block rather than airy display type. · `--font-recoleta`
- **Substitute:** DM Serif Display
- **Weights:** 700
- **Sizes:** 18px, 24px, 32px, 48px, 64px, 72px, 84px, 151px
- **Line height:** 1.00–1.30
- **Letter spacing:** -0.028em
- **Role:** All headlines, hero display, nav wordmark. Used exclusively at weight 700; the high-contrast chunky serif gives the brand its editorial-creative voice. Scales from 32px subheadings up to 151px hero display. Tight negative tracking (approximately -0.028em) tightens the bold forms at large sizes so the headline reads as one confident block rather than airy display type.

### Lota Grotes Que Alt — Body copy, UI labels, button text, nav links, icon labels. The 400 weight carries paragraphs and helper text; 700 weight handles button labels and small emphatic UI strings. Acts as the quiet utilitarian counterpoint to Recoleta's personality — it should never compete for attention. · `--font-lota-grotes-que-alt`
- **Substitute:** Inter
- **Weights:** 400, 700
- **Sizes:** 14px, 18px, 24px
- **Line height:** 1.20–2.30
- **Role:** Body copy, UI labels, button text, nav links, icon labels. The 400 weight carries paragraphs and helper text; 700 weight handles button labels and small emphatic UI strings. Acts as the quiet utilitarian counterpoint to Recoleta's personality — it should never compete for attention.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 14px | 1.5 | — | `--text-caption` |
| body | 18px | 1.5 | — | `--text-body` |
| subheading | 24px | 1.3 | — | `--text-subheading` |
| heading-sm | 32px | 1.2 | -0.9px | `--text-heading-sm` |
| heading | 48px | 1.1 | -1.34px | `--text-heading` |
| heading-lg | 64px | 1.1 | -1.79px | `--text-heading-lg` |
| display | 84px | 1.05 | -2.35px | `--text-display` |
| hero | 151px | 1 | -4.23px | `--text-hero` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** spacious

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
| 52 | 52px | `--spacing-52` |
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |
| 100 | 100px | `--spacing-100` |
| 120 | 120px | `--spacing-120` |
| 172 | 172px | `--spacing-172` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 100px |
| cards | 16px |
| large | 40px |
| pills | 9999px |
| small | 4px |
| buttons | 12px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 96px
- **Card padding:** 28-40px
- **Element gap:** 24px

## Components

### Mint CTA Button (Filled)
**Role:** Primary call-to-action in hero and key sections

Background #99ffcc, text #000000, 1px solid #000000 border, 12px radius, padding 10px 16px (or 8px horizontal on compact variants). Font: Lota Grotes Que Alt 700 at 18px. Sits confidently on the cream canvas — the mint fill is the single most attention-grabbing element on the page.

### Outline Button (Dark)
**Role:** Secondary action paired with the mint CTA

Transparent background, 1px solid #000000 border, 12px radius, padding 10px 16px. Text #000000 in Lota Grotes Que Alt 700. Always appears as the right-hand companion to the mint button in button groups.

### Pill Nav CTA
**Role:** Book-a-call button in the top navigation

Full 9999px (1440px) pill radius, background #99ffcc, 1px solid #000000 border, padding ~6px 16px. Text in Lota Grotes Que Alt 700. Distinguishes the persistent nav CTA from in-page CTAs by its full pill shape.

### Feature Card
**Role:** Logo tile in the social proof grid

Background #ffffff, 1px solid #000000 border, 16px radius, padding 24-32px. Contains a partner logo centered within. No shadow — the border alone defines the card edge on the cream canvas.

### Highlighted Headline Swash
**Role:** Hand-drawn highlight behind keywords in hero and section headlines

A mint green (#99ffcc) irregular oval brush stroke positioned behind selected words in Recoleta 700 headlines. Approximately 60-80% of the text height, offset to wrap the word's contour. This is a signature brand element — it should feel hand-drawn, not geometric.

### Confetti Decoration
**Role:** Scattered playful dots around hero and section edges

Small filled circles in #ff99cc, #7bbbff, #ffcc99, and #99ffcc, placed asymmetrically around headlines and illustrations. Sizes 6-12px, no border. They signal creative/playful energy without forming a pattern.

### Navigation Bar
**Role:** Top-of-page nav with logo and links

Transparent or cream (#f5f4f0) background, no border. Logo 'HATCH' in Recoleta 700 at left. Nav links in Lota Grotes Que Alt 400 at 14-18px in #000000, spaced with ~22px horizontal padding. Mint pill CTA anchored to the right.

### Circuit Illustration Panel
**Role:** Hero feature graphic showing platform distribution network

A rounded-rectangle container (~16px radius) with cream interior, containing radiating line-traces in peach, sky blue, and pink connecting social platform icons to a central mint play-button sphere. Functions as the primary explanatory visual below the hero.

### Mascot Character
**Role:** Brand mascot — blue speech bubble with pink headphones

Hand-drawn illustration: round blue (#7bbbff) speech bubble with a winking face, wearing pink (#ff99cc) headphones, with small sparkle marks. Used as a friendly anchor in the hero corner and section accents.

### Link Underline
**Role:** Inline text links in body copy

1px solid underline in #dddfe2 or #000000, no offset. Text remains in Lota Grotes Que Alt 400. Underline is the sole affordance — no color change on hover state to maintain editorial calm.

## Do's and Don'ts

### Do
- Use Recoleta 700 exclusively for all headlines and display text — never substitute a different serif or drop to a lower weight
- Apply the mint #99ffcc highlight swash behind one or two keywords per major headline to reinforce brand identity
- Pair every mint filled CTA with a dark outline button as its right-hand companion in button groups
- Set all cards to white #ffffff with a 1px solid #000000 border and 16px radius — never use shadows for depth
- Set the page background to cream #f5f4f0 rather than pure white to let the pastel accents read softly
- Use the full 9999px pill radius only for the persistent nav CTA and small tag chips — in-page CTAs use 12px radius
- Keep body text in Lota Grotes Que Alt 400 at 18px with generous line-height (1.5+) for an airy editorial read
- Place 4-8 confetti dots in mixed pastels around hero and section headlines, varying size 6-12px and color

### Don't
- Do not use box-shadow or drop-shadow on any element — depth comes from the cream/white surface contrast and 1px borders alone
- Do not use mint #99ffcc as a background fill for cards or large surfaces — reserve it for buttons and highlight swashes
- Do not mix sky blue, peach, and pink as CTA fills — only mint is a button color; the other three are decorative
- Do not center-align body paragraphs longer than three lines — switch to left-align at 600px max-width
- Do not use Recoleta below 24px — at small sizes the high-contrast serif becomes hard to read and the Lota grotesque should take over
- Do not use pure #000000 for large filled shapes or backgrounds — it dominates too aggressively on cream; use #000000 for strokes, text, and thin outlines only
- Do not apply the mint highlight swash to more than two keywords per headline or to body copy — it loses impact through repetition
- Do not add photography, stock images, or photorealistic renders — the visual system is illustration-only

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#f5f4f0` | Page background |
| 1 | Card | `#ffffff` | Elevated content surfaces, logo tiles, feature cards |
| 2 | Mint Action | `#99ffcc` | Primary CTA surface, highlight wash behind headlines |
| 3 | Decorative Accent | `#ffcc99` | Warm accent fills on illustration and chips |

## Elevation

Hatch avoids drop shadows entirely. All depth and separation is achieved through the combination of cream canvas + white card surfaces + 1px solid #000000 borders. This flat-with-line approach keeps the visual language in the zine/illustration register rather than a product-UI register. Never add box-shadow to cards, buttons, or modals.

## Imagery

Hatch's visual language is illustration-first, photography-last. The page relies on three repeating graphic devices: (1) a cute hand-drawn blue speech-bubble mascot with pink headphones, appearing as a hero companion; (2) a circuit-board style infographic with radiating colored traces connecting social platform icons to a central mint play sphere, which visualizes the 'every platform' idea; (3) scattered confetti dots in the four pastel colors placed asymmetrically around headlines. All graphics have hand-drawn, slightly imperfect edges — never geometric-perfect vectors. The palette of pastels on cream reinforces a paper/zine aesthetic. There is no photography anywhere on the visible sections; the visual work is entirely carried by illustration, typography, and color.

## Layout

The page is centered, max-width 1200px contained, with generous vertical breathing room between sections. The hero is a full-bleed cream canvas with a large centered headline (Recoleta 700 at 84-151px) with mint highlight swashes, a short paragraph below, and a two-button group (mint filled + dark outline) — the mascot sits in the lower-left corner of the hero. Below the hero, a full-width rounded-rectangle illustration panel (the circuit board) spans nearly the full content width. Further down, social proof appears as a horizontally-scrolling row of white logo cards in a single line, followed by additional text+visual sections. Navigation is a minimal top bar with the HATCH wordmark left, center nav links, and mint pill CTA right — no sticky behavior, no mega-menu. Section gaps are 96px+, card padding 28-40px, element gaps 24px. The overall rhythm is: large type, generous space, single illustration beat, repeat.

## Agent Prompt Guide

**Quick Color Reference**
- background: #f5f4f0
- card surface: #ffffff
- text: #000000
- border: #000000
- accent: #99ffcc
- primary action: #99ffcc (filled action)

**Example Component Prompts**
1. *Hero headline section*: Cream (#f5f4f0) full-bleed background. Centered headline in Recoleta 700 at 84px, color #000000, letter-spacing -2.35px, line-height 1.05. Behind the phrase 'Video Agency of Record' place a hand-drawn mint (#99ffcc) oval highlight swash approximately 70% of the cap height. Subtext paragraph below in Lota Grotes Que Alt 400 at 18px, #000000, max-width 600px centered. Two buttons side by side, 12px gap: mint filled button (#99ffcc bg, #000000 text and 1px border, 12px radius, 10px 16px padding, Lota Grotes Que Alt 700 18px) and dark outline button (transparent bg, 1px #000000 border, 12px radius, same padding/text). Scattered 6-12px confetti dots in #ff99cc, #7bbbff, #ffcc99 around the headline.

2. *Logo grid card*: White (#ffffff) background, 1px solid #000000 border, 16px border-radius, 32px padding all sides. Partner logo centered inside, no additional styling. No shadow.

3. *Top navigation*: Transparent background, HATCH wordmark in Recoleta 700 at 24px in #000000 at left. Center: four nav links in Lota Grotes Que Alt 400 at 14px in #000000 with 22px horizontal padding between them. Right: mint pill button (#99ffcc bg, #000000 text and border, 9999px radius, 6px 16px padding, Lota Grotes Que Alt 700). No drop shadow, no sticky border.

4. *Illustration panel container*: Cream (#f5f4f0) background matching the page, 1px solid #000000 border, 16px radius, 40px padding. Inside: radiating thin line-traces (1.5px stroke) in #ffcc99, #7bbbff, #ff99cc connecting small platform-icon glyphs to a central mint (#99ffcc) sphere with a dark play triangle inside.

5. *Highlight swash element*: An irregular oval path filled #99ffcc, no stroke, positioned absolutely behind a keyword in a Recoleta 700 headline. Width approximately matches the keyword width plus 8px, height approximately 60-80% of the cap height, offset downward so the top of the swash sits at the x-height. The shape should feel hand-drawn — slight irregularity in the path is intentional.

## Pastel Accent Rotation

The four pastel colors (mint, sky, peach, pink) are not interchangeable. Mint (#99ffcc) is the primary action color and the only one used as a button fill or headline highlight — never use sky, peach, or pink for a CTA. The remaining three (sky #7bbbff, peach #ffcc99, pink #ff99cc) cycle through decorative roles: confetti dots, illustration strokes, and small accent chips. When placing confetti, vary all three pastels plus mint to avoid clustering. When a single accent is needed for a small element like a tag or icon stroke, rotate across the three non-action pastels rather than defaulting to one.

## Highlight Swash Construction

The mint highlight behind keywords is a defining brand element and should be applied to at least one keyword per major headline. Construct as an SVG path or CSS shape: an irregular ellipse, approximately 8px horizontal padding on each side of the keyword, 70% of the cap height, filled #99ffcc, no stroke, no shadow, slight rotation (-3° to 3°) for hand-drawn feel. The swash sits behind the text in z-order, offset down so it covers the x-height and lower portion of the cap height. Apply to 1-2 keywords per headline maximum — swashing the entire headline dilutes the effect.

## Similar Brands

- **Figma Config / creative tool brand sites** — Same playful pastel-on-cream palette, hand-drawn illustration accents, and friendly mascot approach to a professional service
- **Notion** — Same zine-like editorial layout: cream canvas, bold serif headlines, generous spacing, and flat cards with hairline borders rather than heavy shadows
- **Mailchimp** — Same brand-mascot-plus-pastel-accent visual identity aimed at creative audiences, with hand-illustrated warmth replacing product-UI precision

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-cream-paper: #f5f4f0;
  --color-pure-white: #ffffff;
  --color-ink-black: #000000;
  --color-charcoal: #222222;
  --color-slate: #333333;
  --color-fog: #dddfe2;
  --color-mint-splash: #99ffcc;
  --color-plum-ink: #160042;
  --color-aubergine: #26153f;
  --color-sky-pop: #7bbbff;
  --color-bubblegum: #ff99cc;
  --color-peach-pop: #ffcc99;

  /* Typography — Font Families */
  --font-recoleta: 'Recoleta', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-lota-grotes-que-alt: 'Lota Grotes Que Alt', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.5;
  --text-body: 18px;
  --leading-body: 1.5;
  --text-subheading: 24px;
  --leading-subheading: 1.3;
  --text-heading-sm: 32px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -0.9px;
  --text-heading: 48px;
  --leading-heading: 1.1;
  --tracking-heading: -1.34px;
  --text-heading-lg: 64px;
  --leading-heading-lg: 1.1;
  --tracking-heading-lg: -1.79px;
  --text-display: 84px;
  --leading-display: 1.05;
  --tracking-display: -2.35px;
  --text-hero: 151px;
  --leading-hero: 1;
  --tracking-hero: -4.23px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-bold: 700;

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
  --spacing-52: 52px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-100: 100px;
  --spacing-120: 120px;
  --spacing-172: 172px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 96px;
  --card-padding: 28-40px;
  --element-gap: 24px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-3xl: 32px;
  --radius-3xl-2: 40px;
  --radius-full: 100px;
  --radius-full-2: 1440px;

  /* Named Radii */
  --radius-tags: 100px;
  --radius-cards: 16px;
  --radius-large: 40px;
  --radius-pills: 9999px;
  --radius-small: 4px;
  --radius-buttons: 12px;

  /* Surfaces */
  --surface-canvas: #f5f4f0;
  --surface-card: #ffffff;
  --surface-mint-action: #99ffcc;
  --surface-decorative-accent: #ffcc99;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-cream-paper: #f5f4f0;
  --color-pure-white: #ffffff;
  --color-ink-black: #000000;
  --color-charcoal: #222222;
  --color-slate: #333333;
  --color-fog: #dddfe2;
  --color-mint-splash: #99ffcc;
  --color-plum-ink: #160042;
  --color-aubergine: #26153f;
  --color-sky-pop: #7bbbff;
  --color-bubblegum: #ff99cc;
  --color-peach-pop: #ffcc99;

  /* Typography */
  --font-recoleta: 'Recoleta', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-lota-grotes-que-alt: 'Lota Grotes Que Alt', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.5;
  --text-body: 18px;
  --leading-body: 1.5;
  --text-subheading: 24px;
  --leading-subheading: 1.3;
  --text-heading-sm: 32px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -0.9px;
  --text-heading: 48px;
  --leading-heading: 1.1;
  --tracking-heading: -1.34px;
  --text-heading-lg: 64px;
  --leading-heading-lg: 1.1;
  --tracking-heading-lg: -1.79px;
  --text-display: 84px;
  --leading-display: 1.05;
  --tracking-display: -2.35px;
  --text-hero: 151px;
  --leading-hero: 1;
  --tracking-hero: -4.23px;

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
  --spacing-52: 52px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-100: 100px;
  --spacing-120: 120px;
  --spacing-172: 172px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-3xl: 32px;
  --radius-3xl-2: 40px;
  --radius-full: 100px;
  --radius-full-2: 1440px;
}
```
