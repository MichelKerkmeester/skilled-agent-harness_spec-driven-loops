# Evermade — Style Reference
> Editorial punk on cream paper

**Theme:** light

Evermade uses an editorial-meets-punk aesthetic: warm cream canvases (#fef0e6) serve as the quiet stage, while a single hot-pink accent (#ff0389) and a deep maroon dark mode (#2d070b) provide the dramatic punctuation. The type system pairs Instrument Serif's magazine-grade display voice with DM Mono's technical labels and Manrope's neutral body, creating a clear three-tier hierarchy where each tier has a distinct visual job. Everything is pill-shaped (9999px radius) — buttons, tags, link underlines — giving the interface a soft, rounded, almost sticker-like quality. Components are flat and border-driven rather than shadow-driven; depth comes from alternating cream and blush surfaces and the occasional maroon band, not from elevation.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Wine Maroon | `#2d070b` | `--color-wine-maroon` | Dark section background, heading text on cream, card borders, footer surface — near-black with a blood-red undertone, sets the dramatic contrast against the cream canvas |
| Hot Pink | `#ff0389` | `--color-hot-pink` | Outlined action borders, link underlines, tag labels, decorative brand accent — the visual signature; appears as border-color and text, never as filled background |
| Cream Paper | `#fef0e6` | `--color-cream-paper` | Primary page canvas, section background, card surface for hero product mockups — warm off-white that reads as paper rather than screen |
| Blush Card | `#ffdce2` | `--color-blush-card` | Secondary card surface, subtle highlight wash, tag pill backgrounds — one step warmer and pinker than the cream, creates gentle figure-ground separation |
| Soft Pink | `#ffc7de` | `--color-soft-pink` | Muted pink accent for secondary links and tag borders — desaturated cousin of Hot Pink used where less visual weight is needed |
| Pure Black | `#000000` | `--color-pure-black` | Card borders on cream, dark text fallback, high-contrast borders — used sparingly, Wine Maroon usually takes the dark role |

## Tokens — Typography

### Instrument Serif — Display and heading serif — the editorial voice. Used for hero wordmarks, section headlines, and large statements. At 128px it becomes a background watermark. Classic transitional serif with high contrast strokes creates magazine gravitas · `--font-instrument-serif`
- **Substitute:** Playfair Display, Cormorant Garamond, EB Garamond
- **Weights:** 400
- **Sizes:** 32px, 48px, 128px
- **Line height:** 1.10, 1.40
- **Letter spacing:** -0.0100em
- **Role:** Display and heading serif — the editorial voice. Used for hero wordmarks, section headlines, and large statements. At 128px it becomes a background watermark. Classic transitional serif with high contrast strokes creates magazine gravitas

### DM Mono — UI labels, tag text, button text, eyebrows, metadata — monospace gives the interface a technical/editorial datestamp quality. The 0.04em tracking on labels creates typewriter-style uppercase headers · `--font-dm-mono`
- **Substitute:** JetBrains Mono, Space Mono, IBM Plex Mono
- **Weights:** 300, 400, 500
- **Sizes:** 11px, 14px, 16px, 32px
- **Line height:** 1.25, 1.40, 1.60
- **Letter spacing:** -0.01em to 0.04em (labels use 0.04em tracked uppercase)
- **OpenType features:** `"ss01" on`
- **Role:** UI labels, tag text, button text, eyebrows, metadata — monospace gives the interface a technical/editorial datestamp quality. The 0.04em tracking on labels creates typewriter-style uppercase headers

### Manrope — Body text and secondary copy — geometric sans that stays neutral so the serif can carry the brand voice. Used for paragraphs, descriptions, and long-form reading · `--font-manrope`
- **Substitute:** Inter, DM Sans, Plus Jakarta Sans
- **Weights:** 400
- **Sizes:** 12px, 14px, 18px, 22px
- **Line height:** 1.10, 1.20, 1.40
- **Letter spacing:** -0.0100em
- **Role:** Body text and secondary copy — geometric sans that stays neutral so the serif can carry the brand voice. Used for paragraphs, descriptions, and long-form reading

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 11px | 1.25 | 0.44px | `--text-caption` |
| body | 14px | 1.4 | -0.14px | `--text-body` |
| body-lg | 18px | 1.4 | -0.18px | `--text-body-lg` |
| subheading | 22px | 1.2 | -0.22px | `--text-subheading` |
| heading | 32px | 1.1 | -0.32px | `--text-heading` |
| heading-lg | 48px | 1.1 | -0.48px | `--text-heading-lg` |
| display | 128px | 1.1 | -1.28px | `--text-display` |

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
| 24 | 24px | `--spacing-24` |
| 32 | 32px | `--spacing-32` |
| 36 | 36px | `--spacing-36` |
| 40 | 40px | `--spacing-40` |
| 52 | 52px | `--spacing-52` |
| 104 | 104px | `--spacing-104` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 9999px |
| cards | 8px |
| inputs | 9999px |
| buttons | 9999px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80-120px
- **Card padding:** 16px
- **Element gap:** 8-12px

## Components

### Pill Outline Button
**Role:** Primary action trigger (outlined style)

9999px radius, 16px vertical × 24px horizontal padding, 1px Hot Pink border (#ff0389), transparent background, Hot Pink text in DM Mono 14px weight 400 with 0.04em tracking. Arrow icon right-aligned. Example: 'MORE INSIGHTS →'

### Pill Tag Label
**Role:** Category and metadata tag

9999px radius, 4px vertical × 12px horizontal padding, Blush Card background (#ffdce2) or Hot Pink text-only style. DM Mono 11-12px weight 400, uppercase, Hot Pink or Wine Maroon text. Often appears in clusters separated by dots

### Editorial Card
**Role:** Blog post / insight listing

8px radius, 16px padding, transparent background on cream canvas. Image at top (16:9 or 4:3), title in Manrope 22px weight 400 in Wine Maroon, tag pills below. No shadow — separation comes from image edge and whitespace

### Maroon Hero Section
**Role:** Above-the-fold dramatic stage

Wine Maroon (#2d070b) full-bleed background, Instrument Serif 128px display text in Hot Pink as background watermark, centered product mockup on Blush Card (#ffdce6) or cream square frame. No drop shadows on the phone mockups

### Centered Statement Block
**Role:** About/mission copy section

Cream background, max-width 720px centered. Eyebrow label in DM Mono 11px tracked uppercase with bullet prefix. Two paragraphs in Instrument Serif 32px weight 400, line-height 1.1, centered alignment. Very generous vertical padding (120px+)

### Podcast Player Widget
**Role:** Embedded audio/episode link card

Split card: left half Wine Maroon with 'EverTalk' wordmark and 'EST 2018' pill, right half white with episode title in Manrope 18px and DM Mono 'LISTEN NOW' label. Circular play button (9999px) with arrow icon, 1px hairline border

### Product Mockup Frame
**Role:** Device screenshot presentation

Square or rectangular container on Blush Card (#fef0e6) background, devices rendered with no surrounding shadow, slight rotation overlap between devices creates depth through positioning not blur

### Footer Bar
**Role:** Bottom dark band

Wine Maroon (#2d070b) full-bleed strip, minimal height (40-60px), often contains thin navigation links or copyright in DM Mono tracked uppercase

### Underline Link
**Role:** Inline text link

Hot Pink text (#ff0389) with 1px Hot Pink underline, Manrope body size, 2px underline offset. No background, no pill shape — flat text treatment with color and line as the only decoration

### Tag Cluster
**Role:** Multiple category tags grouped

Horizontal flex row of Pill Tag Labels separated by '·' dot dividers in Hot Pink. Common pattern: '# DIGITAL STRATEGY  ·  # EVERTALK  ·  # STRATEGY'

### Hero Watermark Text
**Role:** Background display type

Instrument Serif 128px in Hot Pink, set as full-width background layer behind foreground content, partially obscured. Creates the 'zine' or 'punk poster' atmosphere where type is texture

## Do's and Don'ts

### Do
- Use 9999px radius for all interactive elements (buttons, tags, inputs, link indicators)
- Set Hot Pink (#ff0389) as border-color and text-color only — never as a filled button background
- Use DM Mono 11-12px with 0.04em letter-spacing for all uppercase labels and eyebrows
- Use Instrument Serif 32-128px for headlines; pair with Manrope 14-18px for body
- Separate sections with Wine Maroon (#2d070b) full-bleed bands or generous 80-120px vertical gaps on Cream (#fef0e6)
- Use 1px borders in Wine Maroon or Hot Pink for card edges instead of drop shadows
- Center editorial statement blocks at max-width 720px with generous line-height (1.4) on body text

### Don't
- Do not use box-shadow or drop-shadow effects — depth comes from color contrast and borders only
- Do not fill buttons with Hot Pink — always leave the background transparent and use the border
- Do not mix the three typefaces arbitrarily; each has a specific role (serif=display, mono=UI, sans=body)
- Do not use pure white (#ffffff) as the page background; always use Cream (#fef0e6)
- Do not apply sharp corners (0-4px radius) to interactive elements; pills are mandatory
- Do not place the cream canvas on the maroon sections or the maroon on cream within the same content block
- Do not use more than two typefaces in a single component; the trio system relies on strict role separation

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Cream Canvas | `#fef0e6` | Default page background for content sections |
| 2 | Blush Card | `#ffdce2` | Blog post cards, tag pill backgrounds, subtle panel lifts |
| 3 | White Insert | `#ffffff` | Product mockup frames, image containers on cream |
| 4 | Maroon Stage | `#2d070b` | Hero section, footer, dramatic dark bands |

## Elevation

The system deliberately avoids shadows. Depth and hierarchy are communicated through three mechanisms: (1) color contrast — Wine Maroon bands on Cream create section breaks; (2) surface color shifts — Cream to Blush Card lifts panels; (3) border presence — 1px Wine Maroon or Hot Pink edges define component boundaries. This flat approach keeps the editorial/print metaphor intact: the interface reads as paper layouts, not as digital cards floating in space.

## Imagery

Product photography is tight, clean, and object-focused: phone mockups shown at slight rotation on solid Blush Card backgrounds, no lifestyle context. Photography in blog cards uses real-world documentary style (conference speakers, city skylines, audience shots) with natural color. Illustrations and icons are not prominent — the interface relies on type as decoration. The hero treatment layers 128px serif text as a background watermark behind product imagery, creating a punk-zine collage effect where oversized typography and product renders share the same plane.

## Layout

The page alternates between two structural modes. The hero is full-bleed Wine Maroon with a centered product mockup and oversized background serif text. Content sections shift to max-width 1200px centered on Cream canvas with generous vertical breathing room (80-120px between sections). Statement blocks use a narrower max-width (~720px) centered for editorial readability. Blog/insight sections use a 3-column card grid with equal-width columns. Navigation is minimal — likely a thin top bar or absent in favor of logo + menu. The footer is a thin Wine Maroon full-bleed band. The overall rhythm is: dramatic dark hero → quiet cream editorial → card grid → thin dark footer.

## Agent Prompt Guide

Quick Color Reference:
- text (headlines on cream): #2d070b
- text (body): #2d070b or #000000
- text (accent/labels): #ff0389
- background (canvas): #fef0e6
- background (card): #ffdce2
- background (dark section): #2d070b
- border (card): #2d070b at 1px
- border (action/tag): #ff0389 at 1px
- primary action: #ff0389 (outlined action border)

Example Component Prompts:

1. Create a blog insight card: Blush Card (#ffdce2) background not used — keep on cream. Image at top (4:3 ratio, 8px radius). Title in Manrope 22px weight 400, color #2d070b, letter-spacing -0.22px. Below title, a row of three pill tags: 9999px radius, #ffdce2 background or transparent with #ff0389 text, DM Mono 11px weight 400, 0.04em tracking, uppercase. 16px padding inside card. No shadow.

2. Create a centered editorial statement section: Cream (#fef0e6) background, 120px vertical padding. Eyebrow label 'YOUR DESIGN AND TECHNOLOGY PARTNER' in DM Mono 11px weight 500, #2d070b, 0.04em tracking, uppercase, centered with a small dot prefix. Headline in Instrument Serif 32px weight 400, #2d070b, line-height 1.1, centered, max-width 720px. Body paragraph below in Manrope 18px weight 400, #2d070b, line-height 1.4, centered.

3. Create a hero section: Wine Maroon (#2d070b) full-bleed background, 100vh height. Background watermark text in Instrument Serif 128px weight 400, #ff0389, set behind foreground, partially clipped at viewport edges. Foreground: two iPhone mockups at slight rotation overlap, placed on a #fef0e6 square frame, centered.

4. Create a primary action button: 9999px border-radius, transparent background, 1px solid #ff0389 border, 16px vertical × 24px horizontal padding. Text 'MORE INSIGHTS' in DM Mono 14px weight 400, #ff0389 color, 0.04em letter-spacing, uppercase. Right-arrow icon after text, same color.

5. Create a podcast player widget: 8px border-radius, split layout — left half #2d070b with 'EverTalk' wordmark in Instrument Serif 24px #ff0389, right half #ffffff with episode title in Manrope 16px #2d070b and a circular play button (9999px) with 1px #2d070b border.

## Similar Brands

- **Gumroad** — Same single-accent-color strategy with a vivid pink against warm light surfaces and pill-shaped CTAs
- **Linear** — Comparable monospace label system paired with editorial serif headlines and border-driven (not shadow-driven) component depth
- **Studio Function** — Shared agency-portfolio energy: oversized serif display type, warm cream canvases, and dramatic dark hero sections
- **Locomotive** — Similar punk-editorial blend with full-bleed dark hero bands, serif display watermarks, and pill-shaped outlined buttons

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-wine-maroon: #2d070b;
  --color-hot-pink: #ff0389;
  --color-cream-paper: #fef0e6;
  --color-blush-card: #ffdce2;
  --color-soft-pink: #ffc7de;
  --color-pure-black: #000000;

  /* Typography — Font Families */
  --font-instrument-serif: 'Instrument Serif', ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
  --font-dm-mono: 'DM Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-manrope: 'Manrope', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.25;
  --tracking-caption: 0.44px;
  --text-body: 14px;
  --leading-body: 1.4;
  --tracking-body: -0.14px;
  --text-body-lg: 18px;
  --leading-body-lg: 1.4;
  --tracking-body-lg: -0.18px;
  --text-subheading: 22px;
  --leading-subheading: 1.2;
  --tracking-subheading: -0.22px;
  --text-heading: 32px;
  --leading-heading: 1.1;
  --tracking-heading: -0.32px;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.1;
  --tracking-heading-lg: -0.48px;
  --text-display: 128px;
  --leading-display: 1.1;
  --tracking-display: -1.28px;

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
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-52: 52px;
  --spacing-104: 104px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80-120px;
  --card-padding: 16px;
  --element-gap: 8-12px;

  /* Border Radius */
  --radius-sm: 3px;
  --radius-lg: 8px;
  --radius-full: 9999px;

  /* Named Radii */
  --radius-tags: 9999px;
  --radius-cards: 8px;
  --radius-inputs: 9999px;
  --radius-buttons: 9999px;

  /* Surfaces */
  --surface-cream-canvas: #fef0e6;
  --surface-blush-card: #ffdce2;
  --surface-white-insert: #ffffff;
  --surface-maroon-stage: #2d070b;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-wine-maroon: #2d070b;
  --color-hot-pink: #ff0389;
  --color-cream-paper: #fef0e6;
  --color-blush-card: #ffdce2;
  --color-soft-pink: #ffc7de;
  --color-pure-black: #000000;

  /* Typography */
  --font-instrument-serif: 'Instrument Serif', ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
  --font-dm-mono: 'DM Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-manrope: 'Manrope', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.25;
  --tracking-caption: 0.44px;
  --text-body: 14px;
  --leading-body: 1.4;
  --tracking-body: -0.14px;
  --text-body-lg: 18px;
  --leading-body-lg: 1.4;
  --tracking-body-lg: -0.18px;
  --text-subheading: 22px;
  --leading-subheading: 1.2;
  --tracking-subheading: -0.22px;
  --text-heading: 32px;
  --leading-heading: 1.1;
  --tracking-heading: -0.32px;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.1;
  --tracking-heading-lg: -0.48px;
  --text-display: 128px;
  --leading-display: 1.1;
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
  --spacing-52: 52px;
  --spacing-104: 104px;

  /* Border Radius */
  --radius-sm: 3px;
  --radius-lg: 8px;
  --radius-full: 9999px;
}
```
