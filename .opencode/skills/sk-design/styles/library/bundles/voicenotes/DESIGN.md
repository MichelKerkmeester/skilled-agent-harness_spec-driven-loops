# Voicenotes — Style Reference
> cream-paper notebook with a single inkwell. A warm parchment workspace where oversized editorial serifs meet whisper-quiet Inter UI, and almost every pixel is neutral except a single green check that says "you're safe."

**Theme:** light

Voicenotes operates as a quiet, editorial note-taking workspace: a warm cream canvas with nearly zero chroma, where the only vivid mark is a single green check used as a tiny trust signal. The visual identity is a conversation between a humanist display serif (Instrument Serif) and a utilitarian sans (Inter) — the serif sings the marketing headlines while the sans does all the interface labor. Components are low-elevation, generously rounded, and pill-shaped for actions, giving every screen the feel of paper notebook pages laid out on a desk rather than a chrome-heavy SaaS dashboard.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Parchment | `#faf9f5` | `--color-parchment` | Page canvas, hero backgrounds, section bands — the warm off-white that makes the whole product feel like paper rather than a screen |
| Paper White | `#ffffff` | `--color-paper-white` | Card surfaces, modal backgrounds, elevated panels — pure white sits on top of Parchment to create depth without shadows |
| Soft Sky | `#eaf2f8` | `--color-soft-sky` | Soft section background, alternate surface, and quiet card fill |
| Hairline | `#e5e7eb` | `--color-hairline` | Primary border color for cards, dividers, and input fields — the most-used neutral in the system |
| Bone | `#cbcac7` | `--color-bone` | Secondary borders, card outlines in dense grids, subtle structural dividers |
| Ash | `#717171` | `--color-ash` | Muted body text, helper copy, secondary metadata, timestamps, and icon fills at rest |
| Pebble | `#848381` | `--color-pebble` | Tertiary text and low-emphasis labels |
| Slate Dark | `#646462` | `--color-slate-dark` | Secondary headings and medium-emphasis body text |
| Charcoal | `#222222` | `--color-charcoal` | Headline text, SVG illustration fills, logo lockup — the warm-tinted near-black for editorial type |
| Ink | `#0d0d0d` | `--color-ink` | Primary action button background, primary navigation text, high-emphasis links — the only dark fill used for interactive elements |
| Jet | `#000000` | `--color-jet` | Body text color, icon strokes, high-contrast outlines — the sharpest dark in the system |
| Confirm Green | `#34c759` | `--color-confirm-green` | Green wash for highlight backgrounds, decorative bands, and soft emphasis behind content. Use as a supporting accent, not as a status color |

## Tokens — Typography

### ui-sans-serif — ui-sans-serif — detected in extracted data but not described by AI · `--font-ui-sans-serif`
- **Weights:** 400
- **Sizes:** 16px
- **Line height:** 1.5
- **Role:** ui-sans-serif — detected in extracted data but not described by AI

### InstrumentSerif-Regular — Display and heading serif — used exclusively for editorial section headlines and hero copy. At 60-80px with -0.02em tracking, it creates a magazine-cover presence that contrasts against Inter's utility. The single weight (400) and high contrast strokes give headlines an unhurried, confident voice that would feel overwrought in any bolder weight. · `--font-instrumentserif-regular`
- **Substitute:** Playfair Display, EB Garamond, Cormorant Garamond
- **Weights:** 400
- **Sizes:** 20px, 60px, 80px
- **Line height:** 1.00-1.40
- **Letter spacing:** -0.0200em at 60-80px, normal at 20px
- **Role:** Display and heading serif — used exclusively for editorial section headlines and hero copy. At 60-80px with -0.02em tracking, it creates a magazine-cover presence that contrasts against Inter's utility. The single weight (400) and high contrast strokes give headlines an unhurried, confident voice that would feel overwrought in any bolder weight.

### Inter — Universal UI and body sans — Inter handles all interface text from 10px micro-labels up to 20px subheadings. The 400 weight is the workhorse for body, 500 for buttons and labels, 600 for emphasis, and 700 reserved for the smallest badge text. Tight letter-spacing (-0.009em at 14-18px) gives dense UI text a modern, engineered feel. · `--font-inter`
- **Substitute:** system-ui, -apple-system, Helvetica Neue
- **Weights:** 400-700
- **Sizes:** 10px, 12px, 14px, 15px, 16px, 18px, 20px
- **Line height:** 1.21-1.71
- **Letter spacing:** -0.0090em at body sizes, -0.0030em at larger sizes, normal at 10-12px
- **Role:** Universal UI and body sans — Inter handles all interface text from 10px micro-labels up to 20px subheadings. The 400 weight is the workhorse for body, 500 for buttons and labels, 600 for emphasis, and 700 reserved for the smallest badge text. Tight letter-spacing (-0.009em at 14-18px) gives dense UI text a modern, engineered feel.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 10px | 1.5 | — | `--text-caption` |
| body | 16px | 1.5 | -0.048px | `--text-body` |
| subheading | 18px | 1.47 | -0.054px | `--text-subheading` |
| heading-sm | 20px | 1.4 | -0.4px | `--text-heading-sm` |
| heading | 60px | 1.17 | -1.2px | `--text-heading` |
| display | 80px | 1 | -1.6px | `--text-display` |

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
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 28 | 28px | `--spacing-28` |
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 12px |
| links | 6px |
| images | 16px |
| inputs | 12px |
| buttons | 9999px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| md | `rgba(0, 0, 0, 0.15) 0px 0px 10px 0px` | `--shadow-md` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 20px
- **Element gap:** 16px

## Components

### Primary Pill Button
**Role:** Main call-to-action across hero and feature sections

Filled black pill button with white text. Background #0d0d0d, text #ffffff, border-radius 9999px, padding 12px 24px. Font: Inter Medium 16px. Used for 'Download for Mac' and 'Download' in the top nav. The dark fill on cream background creates the strongest contrast moment on the page.

### Ghost Pill Button
**Role:** Secondary actions in navigation and inline contexts

Transparent background with #0d0d0d text, border-radius 9999px, no border. Font: Inter Medium 16px. Used for 'Log in' in the top nav. Keeps the pill language consistent with the primary button while deferring visual weight.

### Tab Nav Item
**Role:** Primary navigation between product modes

Icon (emoji or product icon) paired with Inter Medium 16px text, gap 6px, bottom border 2px solid #0d0d0d when active. Inactive state has no border and #717171 text color. Padding 8px 4px. Sits centered in the top nav with quiet underline-based active state.

### Note Card
**Role:** Display of individual recorded meeting notes in grid

White card (#ffffff) with #cbcac7 border, border-radius 12px, padding 16-20px. Contains a small timestamp in Inter 10-12px #717171, a title in Inter SemiBold 14-16px #0d0d0d, a summary excerpt in Inter Regular 14px #717171, and a duration badge at the bottom. The light border replaces shadow for elevation — the system deliberately avoids heavy drop shadows.

### Feature Card
**Role:** Product showcase panels in the features grid

White card on #faf9f5 background, border-radius 12-16px, padding 16px. Contains a product screenshot or UI mockup. May have a subtle border or sit on a #eaf2f8 tinted surface variant. Large enough to hold a full meeting interface screenshot with context.

### Trust Badge Row
**Role:** Social proof and compliance signals below the hero

Inline horizontal arrangement of small text labels with a colored dot prefix. Green dot (#34c759) for compliance items like 'SOC 2 Type II & GDPR Compliant', yellow/amber dot for star ratings. Font: Inter 14px #717171. Dot size ~8px. Gap 24px between items.

### Integration Logo Cluster
**Role:** Visual proof of platform compatibility

Row of grayscale brand logos (Zoom, Meet, Teams, Slack, Webex) centered on the page. Each logo rendered in a single neutral tone (#222222 or #717171), no brand colors. Sits on the cream canvas with 32px gap from surrounding text.

### Search Overlay
**Role:** AI-powered search bar floating above content

White pill-shaped bar (border-radius 9999px or 16px) with #e5e7eb border, shadow rgba(0,0,0,0.15) 0px 0px 10px. Contains placeholder text in Inter 16px #717171 and a blue circular (#0088ff) send button on the right. Floats above the note grid as a floating action.

### Hero Product Screenshot
**Role:** Primary visual demonstration of the product

Large product mockup (typically a Zoom/meeting interface window) placed against colorful paint-splash textures. The window mockup has #ffffff background with #e5e7eb border, 16px radius. The paint textures use a multi-color gradient (green to cyan to blue) but are contained outside the UI frame, so the product itself stays neutral.

### Note Grid
**Role:** Multi-column display of meeting note cards

Responsive grid (3-4 columns at desktop) of Note Cards with 16-24px gap. The grid is the signature data-display pattern: dense, information-rich, with consistent card geometry creating a tile-like rhythm on the cream background.

### Section Heading
**Role:** Editorial section titles between content blocks

Instrument Serif Regular, 60px at desktop, line-height 1.17, letter-spacing -0.02em, color #222222. Centered or left-aligned depending on section. Often two-line with a period or em-dash punctuation for editorial voice. Examples: 'Simple as it gets.', 'Real teams. Real meetings. Real results.'

### Status Indicator Dot
**Role:** Small functional color marker

8px circle in #34c759 (green) for success/compliance or amber for ratings. Always paired with a text label, never standalone. The only place chromatic color is permitted in the interface.

## Do's and Don'ts

### Do
- Use #faf9f5 as the default page background for all full-page layouts — never use pure #ffffff as the canvas.
- Set headlines in Instrument Serif at 60-80px with -0.02em letter-spacing and 1.17 line-height for editorial presence.
- Set all body and UI text in Inter, choosing weight by emphasis: 400 for body, 500 for buttons/labels, 600 for headings, 700 for 10px badges only.
- Use 9999px border-radius for all buttons, tags, and pill-shaped interactive elements.
- Use 12-16px border-radius for cards and content containers — never sharp corners.
- Limit chromatic color to #34c759 for status dots, trust checkmarks, and compliance badges only.
- Apply the #eaf2f8 tint sparingly for info panels that need differentiation from white cards.

### Don't
- Do not introduce any brand accent color beyond #34c759 — the system is intentionally near-monochrome.
- Do not use drop shadows for elevation — use borders (#e5e7eb, #cbcac7) and surface color contrast instead.
- Do not set body text below 14px in Inter 400, or below 10px in any weight.
- Do not apply the Instrument Serif to UI text, labels, or anything below 20px — it loses readability and its editorial purpose.
- Do not center-align body paragraphs or card content longer than two lines — the serif is for display, not body.
- Do not use the #0d0d0d button fill for anything other than the single primary action per view.
- Do not stack more than two border-radius values in a single component family — pick pill (9999px) or card (12-16px), not both.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Parchment Canvas | `#faf9f5` | Base page background — the warm cream that defines the system's paper-notebook feel |
| 1 | Paper White | `#ffffff` | Standard card and content surface — sits on top of Parchment for depth without shadow |
| 2 | Soft Sky Tint | `#eaf2f8` | Accent card variant for info panels and feature callouts needing subtle differentiation |
| 3 | Ink Overlay | `#0d0d0d` | Modal, popover, and floating overlay surfaces — the only dark surface in the system |

## Elevation

The system deliberately avoids heavy drop shadows for elevation. Instead, depth is communicated through: (1) a 1-step warm surface stack — Parchment #faf9f5 canvas → Paper White #ffffff cards → Soft Sky #eaf2f8 tinted panels, and (2) hairline borders in #e5e7eb and #cbcac7. The only shadow in the system is a soft 10px black-at-15% glow reserved for floating elements like the AI search overlay. This keeps the visual language feeling like flat paper, not skeuomorphic UI.

## Imagery

Imagery is dominated by product screenshots and UI mockups rather than photography or illustration. The product is always shown in a meeting-interface context: a browser/app window with participant tiles on the left and a 'Morning sync' notes panel on the right. These product frames are placed against expressive, colorful paint-splash textures (greens, teals, pinks, blues) that bleed off the canvas edges, creating a deliberate contrast: the UI is sterile and monochrome while the surrounding atmosphere is painterly and vivid. There is no lifestyle photography, no stock imagery, and no abstract geometric decoration. The colorful textures serve a dual role: they make the product screenshots feel like editorial spreads rather than spec sheets, and they provide the only chromatic energy in an otherwise neutral system. The icon set is minimal and uses emoji (🤝, 📓, 📝) for navigation, giving the nav a casual, personal quality.

## Layout

The page follows a single-column, centered, max-width-1200px container pattern. The hero is a centered text stack: large serif headline, 3-line subtext, pill CTA, trust badges, then a full-bleed product screenshot that breaks the container width. Section rhythm alternates between Parchment background and Paper White cards, with 80px vertical gaps between major sections. Content arrangements use: (1) centered editorial headings, (2) 3-column card grids for features and notes, (3) horizontal logo rows for trust and integrations, and (4) full-bleed product mockup bands. Navigation is a single thin top bar with a logo left, centered tab nav with emoji icons, and right-aligned ghost + primary pill buttons. The overall density is compact — cards pack tightly in grids, text blocks have minimal line-height padding, and the page rewards scrolling with continuous information rather than spacious hero moments.

## Agent Prompt Guide

**Quick Color Reference**
- text: #0d0d0d
- background: #faf9f5
- card surface: #ffffff
- border: #e5e7eb
- accent: #34c759 (status/trust only)
- primary action: #0d0d0d (filled action)

**3 Example Component Prompts**

1. Create a Primary Action Button: #0d0d0d background, #ffffff text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.

2. **Note Card Grid**: 3-column grid with 20px gap. Each card: #ffffff background, #cbcac7 1px border, 12px radius, 20px padding. Timestamp in Inter 12px #717171 at top. Title in Inter SemiBold 16px #0d0d0d. Summary in Inter 14px #717171, 2-line clamp. Duration badge at bottom in Inter 12px #717171 with a small clock icon.

3. **Feature Section**: Parchment background. Centered section heading in Instrument Serif 60px #222222, letter-spacing -0.02em. Below: row of 4 grayscale integration logos (each in #222222), 32px gap, centered. Then a 3-column grid of feature cards — each card has 16px padding, 16px radius, contains a product screenshot with 12px radius and #e5e7eb border.

## Similar Brands

- **Granola** — Same AI meeting-notes category with an identical cream-canvas editorial aesthetic, Instrument Serif headlines, and near-monochrome palette
- **Reflect** — Same paper-notebook metaphor with warm off-white canvas, pill buttons, and a serif/sans typographic pairing for headings vs UI
- **Tana** — Same compact-density product UI with hairline-border cards, minimal shadows, and a single accent color used only for status indicators
- **Notion** — Same restrained near-monochrome system where the only color appears in small functional dots and tags, with content doing the visual work
- **Craft** — Same editorial-document visual language with oversized serif headings against clean Inter-style UI and product-screenshot hero sections

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-parchment: #faf9f5;
  --color-paper-white: #ffffff;
  --color-soft-sky: #eaf2f8;
  --color-hairline: #e5e7eb;
  --color-bone: #cbcac7;
  --color-ash: #717171;
  --color-pebble: #848381;
  --color-slate-dark: #646462;
  --color-charcoal: #222222;
  --color-ink: #0d0d0d;
  --color-jet: #000000;
  --color-confirm-green: #34c759;

  /* Typography — Font Families */
  --font-ui-sans-serif: 'ui-sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-instrumentserif-regular: 'InstrumentSerif-Regular', ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.5;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.048px;
  --text-subheading: 18px;
  --leading-subheading: 1.47;
  --tracking-subheading: -0.054px;
  --text-heading-sm: 20px;
  --leading-heading-sm: 1.4;
  --tracking-heading-sm: -0.4px;
  --text-heading: 60px;
  --leading-heading: 1.17;
  --tracking-heading: -1.2px;
  --text-display: 80px;
  --leading-display: 1;
  --tracking-display: -1.6px;

  /* Typography — Weights */
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

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 20px;
  --element-gap: 16px;

  /* Border Radius */
  --radius-md: 6px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-3xl: 24px;
  --radius-full: 9999px;

  /* Named Radii */
  --radius-cards: 12px;
  --radius-links: 6px;
  --radius-images: 16px;
  --radius-inputs: 12px;
  --radius-buttons: 9999px;

  /* Shadows */
  --shadow-md: rgba(0, 0, 0, 0.15) 0px 0px 10px 0px;

  /* Surfaces */
  --surface-parchment-canvas: #faf9f5;
  --surface-paper-white: #ffffff;
  --surface-soft-sky-tint: #eaf2f8;
  --surface-ink-overlay: #0d0d0d;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-parchment: #faf9f5;
  --color-paper-white: #ffffff;
  --color-soft-sky: #eaf2f8;
  --color-hairline: #e5e7eb;
  --color-bone: #cbcac7;
  --color-ash: #717171;
  --color-pebble: #848381;
  --color-slate-dark: #646462;
  --color-charcoal: #222222;
  --color-ink: #0d0d0d;
  --color-jet: #000000;
  --color-confirm-green: #34c759;

  /* Typography */
  --font-ui-sans-serif: 'ui-sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-instrumentserif-regular: 'InstrumentSerif-Regular', ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.5;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.048px;
  --text-subheading: 18px;
  --leading-subheading: 1.47;
  --tracking-subheading: -0.054px;
  --text-heading-sm: 20px;
  --leading-heading-sm: 1.4;
  --tracking-heading-sm: -0.4px;
  --text-heading: 60px;
  --leading-heading: 1.17;
  --tracking-heading: -1.2px;
  --text-display: 80px;
  --leading-display: 1;
  --tracking-display: -1.6px;

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

  /* Border Radius */
  --radius-md: 6px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-3xl: 24px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-md: rgba(0, 0, 0, 0.15) 0px 0px 10px 0px;
}
```
