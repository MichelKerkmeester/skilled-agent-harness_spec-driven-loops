# Honk — Style Reference
> Cobalt billboard with a yellow highlighter slash

**Theme:** light

Honk operates on a saturated blue-canvas design system built for a messaging product that wants energy, not restraint. The entire viewport is a single electric blue field (#008fff) with white and signal-yellow typography floating on it — no warm grays, no soft cards, no light-mode chrome. Headlines are a custom heavy display face at 52px, tight-tracked, with one or two words flipped to vivid yellow (#ffe400) so key terms punch out of the headline. Surfaces are minimal: everything either sits directly on the blue or uses a hard 16px-radius white panel as a notification/UI element. The phone mockup carries the only secondary color (game-green) and floats with subtle decoration — speech bubbles, emoji-shaped UI nubs. The system reads as playful, confident, and loud on purpose: it is anti-corporate, anti-minimal, and uses color saturation as the primary brand carrier instead of typography or layout sophistication.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Honk Blue | `#008fff` | `--color-honk-blue` | Full-viewport page canvas, hero background, all top-level sections — the electric blue IS the brand surface, not a secondary accent |
| Honk Sky | `#00a0ff` | `--color-honk-sky` | Secondary blue for gradient bands, large decorative shapes, and depth layers behind the primary canvas |
| Signal Yellow | `#ffe400` | `--color-signal-yellow` | Accent words inside headlines, heading border underlines, and highlight punctuation — the only chromatic accent on the blue field, used sparingly for emphasis rather than decoration |
| Honk White | `#ffffff` | `--color-honk-white` | Hairline borders, dividers, input outlines, and card edges on light surfaces. Do not promote it to the primary CTA color |
| Carbon | `#111111` | `--color-carbon` | Primary text on light surfaces, dark borders, near-black detail work — used where text leaves the blue field |
| True Black | `#000000` | `--color-true-black` | SVG fills, graphic detail, maximum-contrast text where the design needs to drop to absolute black |
| Slate | `#363636` | `--color-slate` | Secondary graphic fills, dark illustration detail, softer-than-black accents in SVG work |
| Game Green | `#3fcc6b` | `--color-game-green` | Phone screen content (in-game UI inside device mockups) — a single-hue secondary color reserved for product-internal screens so the blue/yellow/white trio stays clean on the marketing surface |

## Tokens — Typography

### Honk Header — Hero and section display headlines — custom heavy display face at a single 52px size, tightly tracked at -0.012em. This is the signature wordmark voice: chunky, loud, slightly condensed, designed to read at billboard scale on the blue field · `--font-honk-header`
- **Substitute:** Archivo Black, Space Grotesk Bold, or Manrope ExtraBold
- **Weights:** 700
- **Sizes:** 52px
- **Line height:** 1.23
- **Letter spacing:** -0.012em
- **Role:** Hero and section display headlines — custom heavy display face at a single 52px size, tightly tracked at -0.012em. This is the signature wordmark voice: chunky, loud, slightly condensed, designed to read at billboard scale on the blue field

### Honk Sans — Body copy, sub-headings, button labels, link text, footer, icons — a neutral grotesk covering the full UI scale from 13px micro-labels to 19px lead paragraphs. Negative tracking across the board (-0.026em at 13px, -0.006em at 19px) tightens the grotesque to feel modern rather than airy · `--font-honk-sans`
- **Substitute:** Inter, Manrope, or Plus Jakarta Sans
- **Weights:** 400, 500, 600
- **Sizes:** 13px, 14px, 16px, 17px, 19px
- **Line height:** 1.20, 1.38, 1.47, 1.55
- **Letter spacing:** -0.026em at 13px, -0.024em at 14px, -0.018em at 16px, -0.006em at 17-19px
- **Role:** Body copy, sub-headings, button labels, link text, footer, icons — a neutral grotesk covering the full UI scale from 13px micro-labels to 19px lead paragraphs. Negative tracking across the board (-0.026em at 13px, -0.006em at 19px) tightens the grotesque to feel modern rather than airy

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 13px | 1.55 | -0.026px | `--text-caption` |
| body-lg | 19px | 1.55 | -0.006px | `--text-body-lg` |
| display | 52px | 1.23 | -0.012px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 8px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 14 | 14px | `--spacing-14` |
| 16 | 16px | `--spacing-16` |
| 24 | 24px | `--spacing-24` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 16px |
| buttons | 6px |
| small-pills | 6px |
| notification-panels | 16px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 20-24px
- **Element gap:** 16px

## Components

### Blue Hero Canvas
**Role:** Full-bleed hero section

100% viewport-width section filled with #008fff. Contains a two-column layout: left = stacked headline + sub + notification strip; right = floating phone mockup with decorative speech-bubble shapes. No top/bottom padding asymmetry — the blue extends edge-to-edge as the brand canvas.

### Highlighted Headline
**Role:** Hero/section H1

Honk Header 700 at 52px, white, -0.012em tracking, line-height 1.23. Typically split across 2-3 lines with 1-2 inner words wrapped in a <span> set to #ffe400 (Signal Yellow). The yellow word is never underlined or bolded differently — only color shifts.

### Hero Sub-headline
**Role:** Body intro under headline

Honk Sans 400 at 19px, white, line-height ~1.55, no emphasis styling. Sits 24-32px below the headline with no divider.

### Notification Banner
**Role:** Embedded chat notification UI

White (#ffffff) panel, 16px radius, 16-20px vertical padding, full-width within the hero column. Contains a tiny yellow location-pin icon at right, a 'Read Announcement →' label in small Honk Sans, and a bold message line. Functions as a live-product proof card, not a CTA — it shows the app in use.

### Phone Mockup Frame
**Role:** Device illustration for product showcase

Rendered iPhone-style frame (dark bezel) containing a green game screen. Sits at a slight tilt or float on the right side of the hero. Scaled to roughly 45-55% of the hero width. Never has a drop shadow — sits on the blue with color contrast alone.

### Speech Bubble Decoration
**Role:** Floating emoji-shaped UI nubs

Soft, rounded shapes (16-20px radius) in white with a single icon (heart, settings gear) centered. Float off the phone mockup as scattered confetti — these are brand decoration, not interactive elements. Two to three per hero at most.

### In-Phone Game Screen
**Role:** Product-internal UI (device screen content)

Green (#3fcc6b) fill inside the phone frame with white tic-tac-toe grid, avatar bubbles, and small white circular action buttons (volume, mute, mic) along the bottom. This is the ONLY context where green appears.

### Ghost Link Button
**Role:** Lightweight text link / action

Honk Sans 500 at 14-16px, white, no background, no border. Often paired with a chevron or arrow glyph. Used for 'X Chatter', footer links, and secondary actions. The 6px-radius token applies if a pill-shaped variant is needed.

### Footer Section
**Role:** Closing dark or blue band

Continues the blue field or shifts to a deeper tone. White text, Honk Sans 400 at 14-16px, link rows with minimal padding. No card-based footer columns — the footer reads as a flat list of links, not a card grid.

## Do's and Don'ts

### Do
- Use #008fff as the full-viewport canvas for every top-level section — never place the headline on a white card with a blue background behind it; the blue IS the surface.
- Flip one or two words inside a 52px Honk Header headline to #ffe400 to create emphasis. Never underline, italicize, or bold the highlighted word — color is the only differentiator.
- Set all body copy in Honk Sans at 16-19px with the negative tracking values from the type scale (-0.018em at 16px, -0.006em at 19px) — the tightened grotesque is part of the voice.
- Use the 16px-radius token for any white panel embedded in the blue field (notification banners, content cards, image containers) and the 6px-radius token for small pills or chips.
- Place the phone mockup on the right side of the hero at 45-55% column width, surrounded by 2-3 floating white speech-bubble decorations — never center it, never add a drop shadow.
- Use #3fcc6b green exclusively inside the phone screen for product-internal UI; keep the marketing surface to the blue/yellow/white trio only.
- Keep icon strokes at 2px in Honk Sans weight, white on blue — icons are line-style, never filled, never chromatic.

### Don't
- Don't use white or light-gray page backgrounds for marketing screens — the design system assumes the blue field is always present, so a white page reads as broken.
- Don't use #ffe400 for body text, button backgrounds, or large fill areas — Signal Yellow is a word-level highlight only, not a surface color.
- Don't introduce a third saturated color to the marketing surface (purple, red, orange) — only the blue field, yellow accents, white text, and the green inside device mockups are permitted.
- Don't use heavy drop shadows on cards, buttons, or the phone mockup — elevation comes from color contrast against the blue, not from shadow stacks.
- Don't split the headline across more than 3 lines or highlight more than 2 words with yellow — the system relies on a single punctuation moment, not scattered emphasis.
- Don't use a different font family for sub-headings, buttons, or links — Honk Sans at varied weights covers the entire UI; Honk Header is display-only.
- Don't use the 6px-radius token on cards or large panels, and don't use the 16px-radius token on buttons — keep small-radius on small elements, large-radius on large surfaces.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Honk Blue Canvas | `#008fff` | Full-viewport page background, hero, section bands |
| 1 | Honk Sky | `#00a0ff` | Gradient depth layer, large decorative shapes |
| 2 | Honk White Panel | `#ffffff` | Notification banners, embedded UI cards, device screen bezel, icon fills |

## Imagery

Product-internal screenshots are the primary visual: a single tilted iPhone mockup carrying a green tic-tac-toe game screen, positioned right-of-center in the hero. No photography, no lifestyle imagery, no human subjects. Decoration is limited to 2-3 floating white speech-bubble shapes (heart icon, settings gear, generic chat nub) that orbit the phone at varied sizes. All visual elements live on the saturated blue field; the green phone screen is the only secondary color in the system. The visual language reads as 'product IS the hero' — there is no attempt to humanize or contextualize the app with photos.

## Layout

Two-column hero with blue full-bleed background, left column ~45% width holding stacked headline → sub → notification banner → ghost link, right column ~50% width holding the phone mockup with surrounding speech-bubble decorations. Below the hero, sections continue the blue canvas with alternating single-column and two-column patterns. No centered stacks, no card grids, no pricing tables — the system avoids dense information layouts in favor of sparse, billboard-style sections separated by 80px vertical gaps. Navigation is a minimal top bar (logo left, small links right) over the blue, with no sticky variant and no mega-menu.

## Agent Prompt Guide

**Quick Color Reference**
- background: #008fff (full-viewport canvas)
- text: #ffffff (on blue), #111111 (on light panels)
- border: #ffffff (on blue), #111111 (on light)
- accent: #ffe400 (headline word highlights, small accent borders)
- primary action: no distinct CTA color
- device screen green: #3fcc6b (inside phone mockup only)

**3-5 Example Component Prompts**
1. **Hero Headline Block**: Blue #008fff full-viewport background. Headline 'Really, real-time messaging.' in Honk Header 700 at 52px, white, letter-spacing -0.012em, line-height 1.23, split across 2 lines with 'Really,' flipped to #ffe400. Sub-headline in Honk Sans 400 at 19px white. 80px gap to sub-headline.
2. **Notification Banner**: White #ffffff panel, 16px border-radius, 20px vertical padding, full-width within the hero column. Top row: small Honk Sans 500 at 13px white-on-blue label 'Read Announcement →' sitting above a bold Honk Sans 600 at 16px #111111 message line. Yellow #ffe400 location-pin icon at the far right, 20px size.
3. **Phone Mockup with Game Screen**: Dark iPhone bezel, 45% of hero column width, right-aligned. Screen fill #3fcc6b green. Inside: white tic-tac-toe 3×3 grid with 80px cell squares, 2 circular avatar bubbles at the top in #ffffff, and a bottom row of 3 small white circular buttons (volume, mute grid icon, mic). No drop shadow.
4. **Speech Bubble Decoration**: White #ffffff rounded shape, 16-20px border-radius, 60-80px diameter, centered icon (heart, settings gear) in #111111 at 24px. Float 20-40px away from the phone mockup at varied sizes. Two to three per hero, never overlapping the headline.
5. **Footer Link Row**: Blue #008fff background, 24px vertical padding, Honk Sans 400 at 14px white. Links separated by 16px horizontal gap, no dividers, no bullet characters. Pure flat list, not a column grid.

## Color Discipline

Honk is a three-color system on the marketing surface: blue field (#008fff), white text (#ffffff), yellow emphasis (#ffe400). Green (#3fcc6b) is quarantined inside the phone screen because the product is real-time messaging that includes in-chat games — the green is product content, not brand chrome. Any new page must keep this discipline: do not introduce purple, red, orange, or pink to the marketing surface. If a state color is needed (error/success), use Honk White at varying opacity (0.6 for muted, 1.0 for active) rather than a new hue.

## Similar Brands

- **Marco Polo** — Same full-bleed saturated brand color as the page canvas with a single phone-mockup-as-hero pattern, and similar chat-product visual restraint
- **IRL** — Same anti-minimal approach: loud single-hue background (purple for IRL, blue for Honk) with one bright accent color for keyword highlights inside white headlines
- **Dispo (David's Disposable)** — Same youth-coded saturated canvas and yellow accent strategy, with display headlines that flip individual words to a second bright color for emphasis
- **Giphy** — Same electric-blue marketing surface with floating emoji/GIF-shaped decorations and a single custom display face — visual energy over corporate restraint

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-honk-blue: #008fff;
  --color-honk-sky: #00a0ff;
  --color-signal-yellow: #ffe400;
  --color-honk-white: #ffffff;
  --color-carbon: #111111;
  --color-true-black: #000000;
  --color-slate: #363636;
  --color-game-green: #3fcc6b;

  /* Typography — Font Families */
  --font-honk-header: 'Honk Header', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-honk-sans: 'Honk Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 13px;
  --leading-caption: 1.55;
  --tracking-caption: -0.026px;
  --text-body-lg: 19px;
  --leading-body-lg: 1.55;
  --tracking-body-lg: -0.006px;
  --text-display: 52px;
  --leading-display: 1.23;
  --tracking-display: -0.012px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 8px;
  --spacing-14: 14px;
  --spacing-16: 16px;
  --spacing-24: 24px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 20-24px;
  --element-gap: 16px;

  /* Border Radius */
  --radius-md: 6px;
  --radius-2xl: 16px;

  /* Named Radii */
  --radius-cards: 16px;
  --radius-buttons: 6px;
  --radius-small-pills: 6px;
  --radius-notification-panels: 16px;

  /* Surfaces */
  --surface-honk-blue-canvas: #008fff;
  --surface-honk-sky: #00a0ff;
  --surface-honk-white-panel: #ffffff;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-honk-blue: #008fff;
  --color-honk-sky: #00a0ff;
  --color-signal-yellow: #ffe400;
  --color-honk-white: #ffffff;
  --color-carbon: #111111;
  --color-true-black: #000000;
  --color-slate: #363636;
  --color-game-green: #3fcc6b;

  /* Typography */
  --font-honk-header: 'Honk Header', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-honk-sans: 'Honk Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 13px;
  --leading-caption: 1.55;
  --tracking-caption: -0.026px;
  --text-body-lg: 19px;
  --leading-body-lg: 1.55;
  --tracking-body-lg: -0.006px;
  --text-display: 52px;
  --leading-display: 1.23;
  --tracking-display: -0.012px;

  /* Spacing */
  --spacing-14: 14px;
  --spacing-16: 16px;
  --spacing-24: 24px;

  /* Border Radius */
  --radius-md: 6px;
  --radius-2xl: 16px;
}
```
