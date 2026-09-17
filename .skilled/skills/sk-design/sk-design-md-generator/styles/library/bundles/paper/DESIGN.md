# Paper — Style Reference
> warm paper notebook under studio lights

**Theme:** light

Paper uses a warm-paper-studio language: a cream ivory canvas instead of white, calm monochrome typography in a custom display face, and a single cool blue accent that does almost no UI work. The two-tone headline (dark first line, mid-gray continuation) is the signature move — it treats the hero copy as a composition of weights rather than a single block. Surfaces sit flat on the page with one barely-there card shadow, borders are hairline, and the product feels like a printed notebook page under cool studio light. Most of the chromatic energy lives inside the product screenshot; the marketing surface around it stays restrained, near-achromatic, and grid-quiet.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Bone Canvas | `#efefe4` | `--color-bone-canvas` | Page background — warm cream instead of white, the signature surface that makes the whole site feel like a notebook page |
| Paper White | `#fcfcf9` | `--color-paper-white` | Primary page canvas and white card surfaces. Do not promote it to the primary CTA color |
| Bright Card | `#ffffff` | `--color-bright-card` | Pure white card surface for highest elevation, code panels, product chrome |
| Mist | `#f3f3f4` | `--color-mist` | Subtle alternate band background, soft dividers in long pages |
| Ash Gray | `#e3e3e3` | `--color-ash-gray` | Card backgrounds in denser sections, soft grouping surface |
| Stone | `#d7d7d6` | `--color-stone` | Hairline borders, card outlines, surface separators |
| Smoke | `#c1c1c0` | `--color-smoke` | Secondary borders, diagram strokes, muted dividers |
| Pewter | `#a8a8a8` | `--color-pewter` | Icon strokes, low-priority borders, decorative vector fills |
| Graphite | `#909090` | `--color-graphite` | Secondary body text, the lighter half of the two-tone headline, heading accents |
| Slate | `#83837e` | `--color-slate` | Subdued heading and link text, warm-gray captions |
| Iron | `#666666` | `--color-iron` | Helper text, metadata, tertiary copy |
| Lava | `#434341` | `--color-lava` | Near-black emphasis text, slightly softer than full ink for long reads |
| Carbon | `#222222` | `--color-carbon` | Near-black used in nav chrome and high-contrast text |
| Ink | `#181818` | `--color-ink` | Primary text, nav active state, filled button background — neutral dark, not chromatic |
| Studio Blue | `#5d8cd7` | `--color-studio-blue` | Brand icon mark, decorative vector accent — cool blue against warm cream is the only chromatic tension in the marketing surface |
| Wash Blue | `#81adec` | `--color-wash-blue` | Lighter blue used for soft body accents and nav underlines |

## Tokens — Typography

### Matter — Display and headline face — custom, wide stance, unusual light-to-medium weights (360 is whisper-thin). Carries the hero, the two-tone headline split, and large pull quotes. Tight tracking on display (-0.0200em at 64px) gives the type a composed, editorial feel · `--font-matter`
- **Substitute:** Söhne, Inter Tight, or a humanist geometric like Manrope
- **Weights:** 360, 400, 480, 500, 550
- **Sizes:** 14px, 18px, 48px, 64px
- **Line height:** 1.00, 1.56, 2.00
- **Letter spacing:** -1.28px at 64px, -0.96px at 48px, -0.28px at 14px
- **OpenType features:** `"calt" on, "ss01" on`
- **Role:** Display and headline face — custom, wide stance, unusual light-to-medium weights (360 is whisper-thin). Carries the hero, the two-tone headline split, and large pull quotes. Tight tracking on display (-0.0200em at 64px) gives the type a composed, editorial feel

### Inter — UI and body face — captions, button labels, nav, metadata, product chrome. Tight negative tracking on small sizes (-0.0100em at 12–14px) keeps dense UI legible · `--font-inter`
- **Substitute:** Inter (native), or system-ui
- **Weights:** 400, 500, 600
- **Sizes:** 12px, 14px, 16px, 18px, 24px, 36px
- **Line height:** 1.20, 1.40, 1.50, 1.56, 1.75, 2.00
- **Letter spacing:** -0.30px at 12px, -0.14px at 14px, -0.16px at 16px, -0.18px at 18px, 0.10px at 24px
- **OpenType features:** `"calt" on`
- **Role:** UI and body face — captions, button labels, nav, metadata, product chrome. Tight negative tracking on small sizes (-0.0100em at 12–14px) keeps dense UI legible

### Paper Mono — Code, file paths, version labels, tiny metadata. Loose positive tracking (+0.0150em to +0.0160em) at small sizes gives the mono a calm, terminal-like cadence · `--font-paper-mono`
- **Substitute:** JetBrains Mono, IBM Plex Mono
- **Weights:** 400
- **Sizes:** 11px, 12px
- **Line height:** 1.33, 2.55
- **Letter spacing:** 0.17px at 11px, 0.19px at 12px
- **OpenType features:** `"calt" on`
- **Role:** Code, file paths, version labels, tiny metadata. Loose positive tracking (+0.0150em to +0.0160em) at small sizes gives the mono a calm, terminal-like cadence

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 11px | 1.33 | 0.17px | `--text-caption` |
| body | 14px | 1.56 | -0.14px | `--text-body` |
| body-lg | 18px | 1.75 | -0.18px | `--text-body-lg` |
| subheading | 24px | 1.3 | 0.1px | `--text-subheading` |
| heading-sm | 36px | 1.2 | -0.36px | `--text-heading-sm` |
| heading | 48px | 1.14 | -0.96px | `--text-heading` |
| display | 64px | 1 | -1.28px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** compact

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 8 | 8px | `--spacing-8` |
| 12 | 12px | `--spacing-12` |
| 16 | 16px | `--spacing-16` |
| 24 | 24px | `--spacing-24` |
| 32 | 32px | `--spacing-32` |
| 36 | 36px | `--spacing-36` |
| 40 | 40px | `--spacing-40` |
| 44 | 44px | `--spacing-44` |
| 60 | 60px | `--spacing-60` |
| 64 | 64px | `--spacing-64` |
| 120 | 120px | `--spacing-120` |
| 172 | 172px | `--spacing-172` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 9999px |
| cards | 8px |
| buttons | 4px |
| heroPanels | 20px |
| largeCards | 12px |
| imageFrames | 24px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| md | `rgba(0, 0, 0, 0.12) 0px 4px 10px 0px, rgba(0, 0, 0, 0.12)...` | `--shadow-md` |
| sm | `rgba(0, 0, 0, 0.08) 0px 8px 8px -4px, rgba(0, 0, 0, 0.08)...` | `--shadow-sm` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 96px
- **Card padding:** 32px
- **Element gap:** 8px

## Components

### Filled Dark Button
**Role:** Primary action — the only filled button in the system

#181818 background, #fcfcf9 text, 4px radius, 6px 14px padding, Inter 14px weight 500, no border. Used for 'download Paper' and equivalent primary CTAs. Lowercase label, no trailing arrow.

### Ghost Link Button
**Role:** Secondary action — paired with the filled button

Transparent background, #181818 text, no border, Inter 14px weight 500, trailing arrow glyph (→) at 6px gap. Used for 'open Paper in the browser →' and other soft CTAs.

### Nav Link
**Role:** Top-bar navigation item

Inter 14px weight 400, #181818 text, 8px horizontal padding, no underline. 'downloads' is set in weight 500 as the active endpoint. Right-aligned cluster: 'sign up' in weight 400, 'downloads →' in weight 500.

### Brand Wordmark
**Role:** Site logo

Word 'Paper' in Inter 16px weight 600, #181818, preceded by a 14×14 #5d8cd7 rounded-square mark. The blue mark is the only saturated color in the header.

### Two-Tone Headline
**Role:** Hero and section heading

Matter weight 400 at 64px / 48px, split across two visual weights: first line in #181818, continuation lines in #83837 at the same size. Tracking -1.28px at 64px, -0.96px at 48px. Line height 1.00–1.14 — the lines stack tight, almost overlapping, for a composed editorial feel.

### Eyebrow Label
**Role:** Section pre-title, status marker

Inter 12px weight 500, #909090, often lowercase ('used in production by designers at', 'open alpha'). Optional 8px gap to the heading below.

### Lead Paragraph
**Role:** Body copy under hero and section headlines

Matter 18px weight 400, #666666, line-height 1.75, max-width ~56ch. No drop-cap, no bold inline emphasis — the tone is calm and expository.

### Product Screenshot Card
**Role:** Hero visual and feature showcase

White (#fcfcf9) surface, 8px radius, 32px padding around the app chrome, elevated with the three-layer card shadow. Contains traffic-light dots top-left, a sidebar of file names, and a right-side properties panel — all rendered as flat product UI inside the card.

### Logo Cloud
**Role:** Social proof band

Single row or two-row grid of customer logos, Pewter (#83837e) monochrome, 40–48px tall, 32–40px gap, centered. No dividers, no card wrapping. Eyebrow 'used in production by designers at' centered above.

### Code Block (Claude Code panel)
**Role:** Developer-facing feature illustration

Rounded panel with 8px radius, 12–24px padding, #fcfcf9 background, hairline #d7d7d6 border. Body in Paper Mono 11–12px weight 400. File paths and code keywords colored with brand blue (#5d8cd7), comment lines in #909090. No syntax-highlight rainbow — palette stays near-monochrome.

### Ghost Card
**Role:** Marketing card without shadow

#fcfcf9 background, 1px #d7d7d6 border, 8px radius, 24–32px padding. Used when the product card would feel too heavy — text-only groupings, plan summaries, simple feature blocks.

### Geometric Pattern Overlay
**Role:** Decorative page-edge treatment

Subtle thin-line isometric grid in #d7d7d6, drawn at ~20% opacity, anchored to the upper-right corner of the hero and select sections. Never full-bleed, always clipped to a triangular wedge. Provides spatial depth without adding color.

## Do's and Don'ts

### Do
- Use #181818 as the only filled-button background — never introduce a chromatic CTA color
- Split headlines into two visual weights: first line in Ink (#181818), continuation in Slate (#83837e), both at the same Matter display size
- Set the page background to Bone Canvas (#efefe4); reserve #ffffff for elevated cards and product chrome only
- Use 4px radius for buttons and tags, 8px for cards, 12–24px for product frames — never mix these scales on the same surface
- Keep the body in Matter 18px weight 400 at #666666 with 1.75 line-height for editorial calm
- Use the three-layer card shadow only on product screenshots and floating tool panels — marketing cards stay flat with hairline borders
- Limit blue (#5d8cd7) to the brand mark, decorative vectors, and code accents — never as a button fill or large text color

### Don't
- Don't add a chromatic accent for CTAs, links, or active states — the action language is neutral dark, period
- Don't use white (#ffffff) as the page background; the cream canvas is the signature and replacing it kills the look
- Don't bold inline keywords inside body copy — the tone is uniform, not emphatic
- Don't apply the card shadow to headings, logos, or icon rows — it belongs only to the product screenshot and floating panels
- Don't set the two-tone headline in two different sizes or two different fonts; the effect comes from identical Matter metrics with different fill colors
- Don't use saturated semantic colors (red/green/yellow) for status — if needed, use Pewter or Iron instead
- Don't add gradients — the system is flat, warm, and achromatic, with the product screenshot providing the only visual richness

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Bone Canvas | `#efefe4` | Page background — warm cream, the signature base |
| 1 | Paper White | `#fcfcf9` | Card and panel surfaces floating on the canvas |
| 2 | Bright Card | `#ffffff` | Pure white elevation for product chrome and code panels |
| 3 | Mist | `#f3f3f4` | Alternate band and inset surface |

## Elevation

- **Product card, elevated panel:** `rgba(0, 0, 0, 0.12) 0px 4px 10px 0px, rgba(0, 0, 0, 0.12) 0px 2px 4px -1px, rgba(0, 0, 0, 0.12) 0px 0px 4px -1px`
- **Popover, floating tool palette:** `rgba(0, 0, 0, 0.08) 0px 8px 8px -4px, rgba(0, 0, 0, 0.08) 0px 2px 4px -2px, rgba(0, 0, 0, 0.08) 0px 1px 1px -1px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px`

## Imagery

Almost no marketing photography. The single hero visual is a product screenshot of the Paper app itself, presented inside a white card with the three-layer shadow. Customer logos appear as flat monochrome wordmarks in a centered cloud. A faint isometric line grid in #d7d7d6 sits in the upper-right corner of the hero and repeats on select sections, providing spatial depth without color. Iconography (in the product UI) is line-based at ~1.5px stroke, monochrome, using Pewter and Iron.

## Layout

Centered max-width container at 1200px with comfortable side gutters on a full-bleed Bone Canvas. The hero is a left-aligned text block (eyebrow → two-tone headline → lead → button pair) with the product screenshot card centered below, slightly wider than the text column. Subsequent sections are centered single-column with eyebrow + two-tone heading + lead + content block, separated by 96px vertical gaps. Logo cloud sits as a centered band between hero and the first product section. The page uses a consistent rhythm: eyebrow → headline → lead → visual or content, never asymmetric or magazine-style. Navigation is a flat top bar with left-aligned logo and right-aligned CTA cluster; no sticky shadow, no mega-menu.

## Agent Prompt Guide

**Quick Color Reference**
- page background: #efefe4 (Bone Canvas)
- card surface: #fcfcf9 (Paper White) or #ffffff (Bright Card)
- text primary: #181818 (Ink)
- text secondary: #83837e (Slate) or #666666 (Iron)
- border / hairline: #d7d7d6 (Stone)
- brand accent: #5d8cd7 (Studio Blue) — icons and code only, never buttons
- primary action: #181818 (filled action)

**3 Example Component Prompts**

1. *Hero section on Bone Canvas (#efefe4).* Two-tone headline: first line 'design incredible' in Matter weight 400 at 64px, color #181818, letter-spacing -1.28px; second line 'the connected canvas for teams shipping with agents' in same Matter 64px weight 400, color #83837e, line-height 1.0. Lead paragraph: Matter 18px weight 400, #666666, line-height 1.75, max-width 56ch. Button row: filled 'download Paper' — #181818 background, #fcfcf9 text, Inter 14px weight 500, 4px radius, 6px 14px padding. Ghost 'open Paper in the browser →' — transparent, #181818 text, Inter 14px weight 500, trailing arrow.

2. *Product screenshot card.* White #fcfcf9 surface, 8px radius, 32px padding around the app chrome, elevated with the three-layer card shadow (rgba(0,0,0,0.12) 0 4px 10px, 0 2px 4px -1px, 0 0px 4px -1px). Traffic-light dots top-left in #c1c1c0, sidebar in #909090, main canvas white. Right panel uses #f3f3f4 inputs with 4px radius.

3. *Logo cloud band.* Centered eyebrow 'used in production by designers at' in Inter 12px weight 500, #909090. Below, a centered grid of customer wordmarks in #83837e, 40px tall, 40px gap, single row or 2-row wrap. No card wrapper, no dividers, no per-logo backgrounds.

## Two-Tone Headline System

The headline is a two-line composition at the same Matter size: line 1 in #181818 weight 400, line 2 in #83837e weight 400, both at 64px (display) or 48px (heading). Tracking tightens with size (-1.28px at 64px, -0.96px at 48px). Line-height 1.0–1.14 makes the lines almost touch. Never bold, never italic, never a different font. This is the single most recognizable type move in the system.

## Surface and Border Language

Three layers stack: Bone Canvas (#efefe4) for the page, Paper White (#fcfcf9) for cards, Bright Card (#ffffff) for the highest-elevation product chrome. Hairline #d7d7d6 borders replace shadows on every marketing surface; the three-layer shadow is reserved for the product screenshot and one or two floating panels. Stone (#d7d7d6) and Smoke (#c1c1c0) are the only two border colors; never use a chromatic stroke.

## Similar Brands

- **Linear** — Same cream-tinted neutral palette, hairline borders, and a single dark filled button as the only CTA weight
- **Vercel** — Compact density, tight display tracking, and a marketing surface that stays achromatic while the product UI carries the color
- **Figma** — Design-tool hero with a large product screenshot card centered below a left-aligned text block on a soft neutral canvas
- **Pitch** — Editorial two-tone headlines mixing dark and mid-gray at the same size, calm sans-serif body, product-first composition
- **Notion** — Warm near-white page background instead of pure white, hairline-bordered ghost cards, monochrome iconography

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-bone-canvas: #efefe4;
  --color-paper-white: #fcfcf9;
  --color-bright-card: #ffffff;
  --color-mist: #f3f3f4;
  --color-ash-gray: #e3e3e3;
  --color-stone: #d7d7d6;
  --color-smoke: #c1c1c0;
  --color-pewter: #a8a8a8;
  --color-graphite: #909090;
  --color-slate: #83837e;
  --color-iron: #666666;
  --color-lava: #434341;
  --color-carbon: #222222;
  --color-ink: #181818;
  --color-studio-blue: #5d8cd7;
  --color-wash-blue: #81adec;

  /* Typography — Font Families */
  --font-matter: 'Matter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-paper-mono: 'Paper Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.33;
  --tracking-caption: 0.17px;
  --text-body: 14px;
  --leading-body: 1.56;
  --tracking-body: -0.14px;
  --text-body-lg: 18px;
  --leading-body-lg: 1.75;
  --tracking-body-lg: -0.18px;
  --text-subheading: 24px;
  --leading-subheading: 1.3;
  --tracking-subheading: 0.1px;
  --text-heading-sm: 36px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -0.36px;
  --text-heading: 48px;
  --leading-heading: 1.14;
  --tracking-heading: -0.96px;
  --text-display: 64px;
  --leading-display: 1;
  --tracking-display: -1.28px;

  /* Typography — Weights */
  --font-weight-w360: 360;
  --font-weight-regular: 400;
  --font-weight-w480: 480;
  --font-weight-medium: 500;
  --font-weight-w550: 550;
  --font-weight-semibold: 600;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-44: 44px;
  --spacing-60: 60px;
  --spacing-64: 64px;
  --spacing-120: 120px;
  --spacing-172: 172px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 96px;
  --card-padding: 32px;
  --element-gap: 8px;

  /* Border Radius */
  --radius-sm: 1px;
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 20px;
  --radius-3xl: 24px;

  /* Named Radii */
  --radius-tags: 9999px;
  --radius-cards: 8px;
  --radius-buttons: 4px;
  --radius-heropanels: 20px;
  --radius-largecards: 12px;
  --radius-imageframes: 24px;

  /* Shadows */
  --shadow-md: rgba(0, 0, 0, 0.12) 0px 4px 10px 0px, rgba(0, 0, 0, 0.12) 0px 2px 4px -1px, rgba(0, 0, 0, 0.12) 0px 0px 4px -1px;
  --shadow-sm: rgba(0, 0, 0, 0.08) 0px 8px 8px -4px, rgba(0, 0, 0, 0.08) 0px 2px 4px -2px, rgba(0, 0, 0, 0.08) 0px 1px 1px -1px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;

  /* Surfaces */
  --surface-bone-canvas: #efefe4;
  --surface-paper-white: #fcfcf9;
  --surface-bright-card: #ffffff;
  --surface-mist: #f3f3f4;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-bone-canvas: #efefe4;
  --color-paper-white: #fcfcf9;
  --color-bright-card: #ffffff;
  --color-mist: #f3f3f4;
  --color-ash-gray: #e3e3e3;
  --color-stone: #d7d7d6;
  --color-smoke: #c1c1c0;
  --color-pewter: #a8a8a8;
  --color-graphite: #909090;
  --color-slate: #83837e;
  --color-iron: #666666;
  --color-lava: #434341;
  --color-carbon: #222222;
  --color-ink: #181818;
  --color-studio-blue: #5d8cd7;
  --color-wash-blue: #81adec;

  /* Typography */
  --font-matter: 'Matter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-paper-mono: 'Paper Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.33;
  --tracking-caption: 0.17px;
  --text-body: 14px;
  --leading-body: 1.56;
  --tracking-body: -0.14px;
  --text-body-lg: 18px;
  --leading-body-lg: 1.75;
  --tracking-body-lg: -0.18px;
  --text-subheading: 24px;
  --leading-subheading: 1.3;
  --tracking-subheading: 0.1px;
  --text-heading-sm: 36px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -0.36px;
  --text-heading: 48px;
  --leading-heading: 1.14;
  --tracking-heading: -0.96px;
  --text-display: 64px;
  --leading-display: 1;
  --tracking-display: -1.28px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-44: 44px;
  --spacing-60: 60px;
  --spacing-64: 64px;
  --spacing-120: 120px;
  --spacing-172: 172px;

  /* Border Radius */
  --radius-sm: 1px;
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 20px;
  --radius-3xl: 24px;

  /* Shadows */
  --shadow-md: rgba(0, 0, 0, 0.12) 0px 4px 10px 0px, rgba(0, 0, 0, 0.12) 0px 2px 4px -1px, rgba(0, 0, 0, 0.12) 0px 0px 4px -1px;
  --shadow-sm: rgba(0, 0, 0, 0.08) 0px 8px 8px -4px, rgba(0, 0, 0, 0.08) 0px 2px 4px -2px, rgba(0, 0, 0, 0.08) 0px 1px 1px -1px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;
}
```
