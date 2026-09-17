# Quin — Style Reference
> warm cream notebook with stamped yellow ink

**Theme:** light

Quin reads like a warm, paper-textured productivity journal — cream canvases, heavy black type, and two accent hues (honey yellow and powder blue) that feel hand-stamped rather than digitally applied. The system is overwhelmingly achromatic; warmth comes from the ivory page color (#fffcf2) and a sandstone neutral palette, not from hue. Hierarchy is built through Instrument Sans at extreme size jumps — 96px display headlines compress to 0.75 line-height with aggressive negative tracking, while body text breathes at 1.5–1.71. Every interface surface sits flat or uses a single hairline border; elevation is implied by tonal shifts in the cream scale, never by drop shadows. Geist Mono with wide positive tracking labels every interactive element, turning nav items, buttons, and badges into typeset stamps rather than chrome.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Ivory Page | `#fffcf2` | `--color-ivory-page` | Primary canvas — page background, card surfaces, light section bands |
| Sandstone | `#f0ecdf` | `--color-sandstone` | Secondary surface — alternating bands, section dividers, subtle card fills |
| Pebble Border | `#d0cec6` | `--color-pebble-border` | Hairline borders, button outlines, nav dividers, card edges |
| Driftwood | `#a19c8c` | `--color-driftwood` | Muted decorative borders and tonal accents where a softer line is needed |
| Stone Mid | `#68655b` | `--color-stone-mid` | Mid-neutral text, icon strokes, secondary borders |
| Graphite | `#545454` | `--color-graphite` | Body text, link borders, icon color — the workhorse neutral for readable content |
| Charcoal | `#222222` | `--color-charcoal` | Heading text, emphasized body copy, dark surface text |
| Obsidian | `#141414` | `--color-obsidian` | Primary action fill, strongest text, dominant border color — the visual anchor |
| Jet Black | `#000000` | `--color-jet-black` | SVG fills, icon strokes, maximum contrast accents |
| Smoke | `#393737` | `--color-smoke` | Decorative SVG fills and strokes — vector artwork on dark sections |
| Honey Yellow | `#f7cf49` | `--color-honey-yellow` | Primary brand accent — announcement bar, highlight badges, decorative blocks, the signature warm punctuation against cream |
| Burnt Umber | `#492812` | `--color-burnt-umber` | Dark warm accent — button fills in warm contexts, icon borders, tertiary buttons needing chromatic weight |
| Powder Blue | `#a9e1ff` | `--color-powder-blue` | Cool accent — secondary CTA fills, info badges, test card backgrounds, the soft counterpoint to honey yellow |
| Ash | `#8a8883` | `--color-ash` | Subtle border accent, near-gray for dividers that need to recede |

## Tokens — Typography

### Instrument Sans — Primary typeface for all editorial and UI text — display headlines compress to 0.75 with -3.17em tracking, body sits at 1.5–1.71 with relaxed tracking · `--font-instrument-sans`
- **Substitute:** Inter, DM Sans
- **Weights:** 400, 500, 600
- **Sizes:** 14, 16, 20, 26, 28, 32, 40, 44, 56, 80, 96
- **Line height:** 0.75–1.71
- **Letter spacing:** -3.17px at 96px, -2.32px at 80px, -1.12px at 56px, -0.88px at 44px, -0.64px at 32px, -0.52px at 26px, -0.18px at 20px, -0.14px at 16px
- **OpenType features:** `"kern", "ss01", "ss03", "ss05", "ss07", "ss08", "ss12"`
- **Role:** Primary typeface for all editorial and UI text — display headlines compress to 0.75 with -3.17em tracking, body sits at 1.5–1.71 with relaxed tracking

### Geist Mono — Monospaced label face for nav items, buttons, badges, and tags — set uppercase with wide positive tracking to read as typeset stamps · `--font-geist-mono`
- **Substitute:** JetBrains Mono, IBM Plex Mono
- **Weights:** 300, 400
- **Sizes:** 12, 14, 16, 26
- **Line height:** 1.0–2.0
- **Letter spacing:** 0.92px at 16px, 0.54px at 12px, up to 0.2em on tag labels
- **OpenType features:** `"kern", "ss01", "ss03", "ss05", "ss07", "ss08", "ss12"`
- **Role:** Monospaced label face for nav items, buttons, badges, and tags — set uppercase with wide positive tracking to read as typeset stamps

### Font Awesome 7 Sharp — Icon glyphs rendered at heavy weight — sharp geometric forms that match the editorial type system · `--font-font-awesome-7-sharp`
- **Substitute:** Lucide, Phosphor
- **Weights:** 900
- **Sizes:** 26, 40
- **Line height:** 1.0
- **Letter spacing:** 0.0460em
- **Role:** Icon glyphs rendered at heavy weight — sharp geometric forms that match the editorial type system

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.5 | 0.54px | `--text-caption` |
| body-sm | 14px | 1.5 | -0.09px | `--text-body-sm` |
| body | 16px | 1.71 | -0.14px | `--text-body` |
| subheading | 20px | 1.35 | -0.18px | `--text-subheading` |
| heading-sm | 26px | 1.2 | -0.52px | `--text-heading-sm` |
| heading | 32px | 1.15 | -0.64px | `--text-heading` |
| heading-lg | 44px | 1.1 | -0.88px | `--text-heading-lg` |
| heading-xl | 56px | 1.05 | -1.12px | `--text-heading-xl` |
| display | 80px | 0.92 | -2.32px | `--text-display` |
| display-lg | 96px | 0.75 | -3.17px | `--text-display-lg` |

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
| tags | 0px |
| cards | 0px |
| badges | 0px |
| inputs | 0px |
| buttons | 0px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 64-80px
- **Card padding:** 24px
- **Element gap:** 16-24px

## Components

### Announcement Bar
**Role:** Top-of-page product announcement strip

Full-width #f7cf49 honey yellow band. Left-aligned headline in Instrument Sans 14px medium #141414. Right-aligned uppercase Geist Mono 12px #141414 link with arrow. No padding above/below bar — sits flush against viewport edges with 12-16px internal padding. Sharp corners, no border.

### Primary Navigation
**Role:** Site-wide header navigation

Cream (#fffcf2) background, 1px #d0cec6 bottom border. Logo left (Quin mark + wordmark). Nav links center-right in uppercase Geist Mono 12px weight 400 with 0.54px tracking, color #545454. Right cluster: 'LOGIN' as text link and 'GET STARTED' as a 1px #d0cec6 outlined button with uppercase Geist Mono 12px label, 24px horizontal padding, 12px vertical padding, no radius.

### Hero Headline
**Role:** Above-the-fold editorial headline

Centered Instrument Sans 96px weight 400 in #141414, line-height 0.75, letter-spacing -3.17px. The extreme compression and whisper-weight at display size creates a poster-like authority. Subtext below in Instrument Sans 16px weight 400 #545454 at 1.71 line-height, max-width ~560px, centered.

### Feature Tab Bar
**Role:** Horizontal tab selector for product features

Row of equal-width tab cells separated by 1px #d0cec6 vertical borders. Active tab filled with honey yellow #f7cf49 background and Obsidian #141414 text. Inactive tabs: cream background, #545454 text. Labels in Instrument Sans 16px weight 500. No radius — tabs read as printed table cells.

### Product Screenshot Frame
**Role:** Device mockup showcase on textured background

Full-bleed image section with wood-grain photographic background. Phone or laptop mockup centered, screen showing app UI. Below the device, a floating pill-shaped caption in cream #fffcf2 with #141414 text, Instrument Sans 16px, no border. Decorative color blocks (small yellow and blue squares) anchor corners as graphic stamps.

### Integration Logo Grid
**Role:** Partner/integration logo display

Full-width grid of logo tiles on cream background, separated by 1px #f0ecdf borders. Each cell ~120px square, centered logo, no padding beyond internal centering. 12-column responsive grid collapsing to 6 then 4 columns. Section heading centered above in Instrument Sans 32px #141414.

### Testimonial Block
**Role:** Customer quote on colored background

Full-width section with powder blue #a9e1ff background. Quote text left-aligned in Instrument Sans 40px weight 400 #545454 (or #141414) at tight line-height. Attribution below in Instrument Sans 16px #545454. Product screenshot on right side with slight rotation for dynamism.

### Stat Block
**Role:** Large numerical proof point

Two-column stat display on cream or colored background. Oversized Instrument Sans 56-80px weight 400 #141414 for the number (e.g. '40+', '5x'). Caption below in Instrument Sans 16px weight 400 #545454. No dividers between number and label — relies on size contrast.

### Filled Dark Button
**Role:** Primary action button (dark filled)

1px #141414 border, #141414 fill, cream #fffcf2 text. Instrument Sans 16px weight 500. Padding 24px horizontal, 12-16px vertical. No radius — sharp rectangular stamp. Hover inverts: cream fill, dark text. Uppercase Geist Mono 12px label variant for nav CTAs.

### Outlined Button
**Role:** Secondary action button (hairline outline)

1px #d0cec6 border on #fffcf2 fill, #141414 text. Same dimensions and typography as filled button. No fill change on hover — border darkens to #141414. Used for 'GET DEMO' and 'LOGIN' actions.

### CTA Pill Button (Blue)
**Role:** Tertiary accent action button

Powder blue #a9e1ff fill, #141414 text, no border. Instrument Sans 16px weight 500, uppercase Geist Mono 12px variant. Same sharp-rectangle geometry as all other buttons. Used for 'TRY QUIN FREE' and in-product actions like 'Join meeting'.

### Badge / Tag
**Role:** Small status or category label

No border, no radius. Uppercase Geist Mono 12px weight 400 with 0.54-1.2px tracking. Background fills: #f7cf49 (honey), #a9e1ff (blue), or #eeeeee (neutral). Text in #141414. Padding 6-8px vertical, 8-12px horizontal. Sits inline with content as a typeset label.

### Footer
**Role:** Site footer with dark background

Dark section (#141414 or near-black) with cream #fffcf2 text. Column layout for link groups. Instrument Sans 14-16px for links, #fffcf2 text. Small print and copyright in Instrument Sans 12px #545454 or #d0cec6 on dark. Logo mark repeated in cream.

## Do's and Don'ts

### Do
- Set display headlines at 80–96px Instrument Sans weight 400 with line-height 0.75–0.92 and tracking between -2.32 and -3.17px — never let display text breathe loosely
- Use 0px border-radius on every component — cards, buttons, badges, inputs are sharp rectangles, not rounded shapes
- Apply uppercase Geist Mono 12px with +0.54px tracking for all nav links, button labels, and badge text — this is the system's typeset signature
- Keep the canvas on #fffcf2 ivory; use #f0ecdf sandstone for alternating bands and #d0cec6 pebble for all hairline borders
- Reserve honey yellow #f7cf49 for announcement bars, highlight badges, and one decorative block per section — never fill large surfaces
- Use Instrument Sans at the full size range (14–96px) within a single composition; the extreme jumps create the editorial rhythm
- Pair text in #141414 obsidian against #fffcf2 canvas for 17.9:1 AAA contrast — let body text live in #545454 graphite for hierarchy

### Don't
- Never apply border-radius — this system is defined by its sharp, paper-like edges; rounded corners break the editorial stamp metaphor
- Don't use #f7cf49 for body text or large fills — it loses contrast against cream; reserve it for small accent surfaces and borders
- Avoid drop shadows or box-shadow elevation — depth comes from tonal shifts in the cream scale, never from blur effects
- Don't introduce new accent hues beyond honey yellow, burnt umber, and powder blue — the 3% colorfulness budget is deliberate
- Never set Instrument Sans body text above 20px or below 14px; mid-range sizes are reserved for headings and subheadings
- Don't use centered text in body paragraphs — only the hero headline and section headings center; body stays left-aligned
- Avoid tight letter-spacing on body text; the aggressive negative tracking applies only to display sizes 32px and above

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Ivory Page | `#fffcf2` | Default page canvas — all editorial and product sections |
| 2 | Sandstone Band | `#f0ecdf` | Alternating section background, subtle tonal shift within the cream scale |
| 3 | Blue Feature Section | `#a9e1ff` | Full-width colored band for testimonials and feature highlights |
| 4 | Honey Accent | `#f7cf49` | Saturated accent surface for announcement bars and highlight blocks |
| 5 | Dark Footer | `#141414` | Inverted dark surface for footer and terminal sections |

## Elevation

The system deliberately avoids drop shadows. Depth is communicated through a four-step cream scale (#fffcf2 → #f0ecdf → #d0cec6 → #a9e1ff) and hairline 1px borders in #d0cec6. Elevation is tonal, not spatial — cards on cream are implied by a single pixel border, not by blur or offset. This keeps the page feeling like printed paper rather than glass UI.

## Imagery

Product photography dominates: real device mockups (phones, laptops) photographed on physical surfaces like wooden desks and lined paper, never on plain white. The wooden-grain hero background and notebook-paper footer texture ground the brand in tactile, analog materials. Photography is warm-toned, slightly desaturated, and always full-bleed. Small decorative color blocks (yellow squares, blue squares, black squares) appear as graphic stamps in section corners — abstract geometric accents that echo a print layout. Integration logos are the only flat-graphic element, displayed in a clean grid without frames. No illustrations, no 3D renders, no stock photography of people.

## Layout

Max-width 1200px centered container with no full-bleed exception for colored bands. Hero is centered text-stack with a 96px headline and 560px-wide subtext, no hero image. The page alternates between cream (#fffcf2) and colored full-bleed sections — powder blue for testimonials, dark (#141414) for the footer. Product showcases break the container edge: device mockups sit on photographic backgrounds (wood grain, lined paper) that span full viewport width. Section rhythm is 64-80px vertical gaps with no visible dividers between bands. Navigation is a single fixed top bar with cream background and hairline bottom border. Content arrangement is mostly centered stacks and symmetric two-column splits; the tab bar (Meeting prep, Note-taking, etc.) is a full-width row of equal cells reading as a printed table. Card grids (integrations) use 12-column responsive layout. Overall density is spacious — generous whitespace, one idea per section, breathing room between headline and supporting content.

## Agent Prompt Guide

**Quick Color Reference**
- text: #141414 (obsidian)
- background: #fffcf2 (ivory)
- border: #d0cec6 (pebble)
- accent: #f7cf49 (honey yellow)
- secondary accent: #a9e1ff (powder blue)
- primary action: #f7cf49 (filled action)

**Example Component Prompts**

1. Create a hero section: #fffcf2 background, no padding above nav. Centered headline 'Meet your dream assistant' at 96px Instrument Sans weight 400, #141414, line-height 0.75, letter-spacing -3.17px. Subtext at 16px Instrument Sans weight 400, #545454, max-width 560px, centered, line-height 1.71. No buttons in hero — let the headline carry it.

2. Create a feature tab bar: full-width row of 7 equal cells on #fffcf2 background, 1px #d0cec6 vertical dividers between cells. Active cell filled #f7cf49 with #141414 text. Inactive cells cream background with #545454 text. Labels in Instrument Sans 16px weight 500. No radius, no shadow.

3. Create a product screenshot frame: full-bleed section with wood-grain photographic background. Phone mockup centered showing app UI. Below the device, a floating caption in #fffcf2 cream with 1px #d0cec6 border, Instrument Sans 16px #141414 text, no radius, 12px 24px padding. Small #f7cf49 and #a9e1ff square stamps in opposing corners as decorative anchors.

4. Create a testimonial block: full-width #a9e1ff powder blue background. Left half: quote in Instrument Sans 40px weight 400, #545454, tight line-height 1.1. Attribution below in Instrument Sans 16px #545454. Right half: laptop product screenshot with slight 3-degree rotation. 80px vertical padding.

5. Create a stat block: two columns on #fffcf2 background. Left: '40+' in Instrument Sans 80px weight 400, #141414, line-height 0.92. Caption 'Hours of admin work offloaded each month' in Instrument Sans 16px #545454 below. No divider, no card frame — relies on size contrast alone.

## Similar Brands

- **Notion** — Same warm cream-and-black editorial language with sharp corners, oversized centered headlines, and a single yellow accent appearing in small stamped accents rather than large fills
- **Linear** — Shared preference for tight line-heights at display sizes and a near-achromatic palette with one chromatic accent; both use sharp-rectangle buttons with hairline borders
- **Substack** — Cream-toned canvas, heavy black serif-adjacent sans display type, and a product surface that feels like reading a printed journal rather than using software
- **Cron** — Notion-adjacent productivity aesthetic with warm neutrals, instrument-style sans, and flat surfaces defined by borders rather than shadows
- **Stripe** — Similar approach to hairlines and sharp geometry, with a comparable use of a single warm accent hue against a near-white canvas

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-ivory-page: #fffcf2;
  --color-sandstone: #f0ecdf;
  --color-pebble-border: #d0cec6;
  --color-driftwood: #a19c8c;
  --color-stone-mid: #68655b;
  --color-graphite: #545454;
  --color-charcoal: #222222;
  --color-obsidian: #141414;
  --color-jet-black: #000000;
  --color-smoke: #393737;
  --color-honey-yellow: #f7cf49;
  --color-burnt-umber: #492812;
  --color-powder-blue: #a9e1ff;
  --color-ash: #8a8883;

  /* Typography — Font Families */
  --font-instrument-sans: 'Instrument Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-geist-mono: 'Geist Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-font-awesome-7-sharp: 'Font Awesome 7 Sharp', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --tracking-caption: 0.54px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --tracking-body-sm: -0.09px;
  --text-body: 16px;
  --leading-body: 1.71;
  --tracking-body: -0.14px;
  --text-subheading: 20px;
  --leading-subheading: 1.35;
  --tracking-subheading: -0.18px;
  --text-heading-sm: 26px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -0.52px;
  --text-heading: 32px;
  --leading-heading: 1.15;
  --tracking-heading: -0.64px;
  --text-heading-lg: 44px;
  --leading-heading-lg: 1.1;
  --tracking-heading-lg: -0.88px;
  --text-heading-xl: 56px;
  --leading-heading-xl: 1.05;
  --tracking-heading-xl: -1.12px;
  --text-display: 80px;
  --leading-display: 0.92;
  --tracking-display: -2.32px;
  --text-display-lg: 96px;
  --leading-display-lg: 0.75;
  --tracking-display-lg: -3.17px;

  /* Typography — Weights */
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-black: 900;

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
  --section-gap: 64-80px;
  --card-padding: 24px;
  --element-gap: 16-24px;

  /* Named Radii */
  --radius-tags: 0px;
  --radius-cards: 0px;
  --radius-badges: 0px;
  --radius-inputs: 0px;
  --radius-buttons: 0px;

  /* Surfaces */
  --surface-ivory-page: #fffcf2;
  --surface-sandstone-band: #f0ecdf;
  --surface-blue-feature-section: #a9e1ff;
  --surface-honey-accent: #f7cf49;
  --surface-dark-footer: #141414;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-ivory-page: #fffcf2;
  --color-sandstone: #f0ecdf;
  --color-pebble-border: #d0cec6;
  --color-driftwood: #a19c8c;
  --color-stone-mid: #68655b;
  --color-graphite: #545454;
  --color-charcoal: #222222;
  --color-obsidian: #141414;
  --color-jet-black: #000000;
  --color-smoke: #393737;
  --color-honey-yellow: #f7cf49;
  --color-burnt-umber: #492812;
  --color-powder-blue: #a9e1ff;
  --color-ash: #8a8883;

  /* Typography */
  --font-instrument-sans: 'Instrument Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-geist-mono: 'Geist Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-font-awesome-7-sharp: 'Font Awesome 7 Sharp', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --tracking-caption: 0.54px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --tracking-body-sm: -0.09px;
  --text-body: 16px;
  --leading-body: 1.71;
  --tracking-body: -0.14px;
  --text-subheading: 20px;
  --leading-subheading: 1.35;
  --tracking-subheading: -0.18px;
  --text-heading-sm: 26px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -0.52px;
  --text-heading: 32px;
  --leading-heading: 1.15;
  --tracking-heading: -0.64px;
  --text-heading-lg: 44px;
  --leading-heading-lg: 1.1;
  --tracking-heading-lg: -0.88px;
  --text-heading-xl: 56px;
  --leading-heading-xl: 1.05;
  --tracking-heading-xl: -1.12px;
  --text-display: 80px;
  --leading-display: 0.92;
  --tracking-display: -2.32px;
  --text-display-lg: 96px;
  --leading-display-lg: 0.75;
  --tracking-display-lg: -3.17px;

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
}
```
