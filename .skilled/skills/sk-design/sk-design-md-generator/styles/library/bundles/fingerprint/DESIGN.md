# Fingerprint — Style Reference
> warm CRT terminal on cream paper — a fraud-detection lab notebook where code blocks are the main characters

**Theme:** light

Fingerprint reads as a developer tool that has been deliberately warmed up: a cream-paper canvas (#fafaf8) sits beneath sharp black type, a single vivid orange (#f35b22) does the work of a highlighter on key nouns, and the rest of the accent palette is borrowed from an IDE — teal, blue, pink, green as code-syntax tokens. Surfaces are flat with hairline borders; elevation is whispered, not announced. The hero alternates between editorial typography (Inter, tight tracking) and a dark CRT-style terminal panel, establishing a two-mode visual rhythm: light prose, dark code. Orange never decorates — it annotates, turning one word per headline into a call-to-action, and turning the primary button into the only filled rectangle on the page.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Cream Paper | `#fafaf8` | `--color-cream-paper` | Page canvas and primary surface — warm off-white that softens the otherwise stark black/orange system |
| Card White | `#ffffff` | `--color-card-white` | Elevated card surfaces and input backgrounds — sits one step above the cream canvas |
| Pebble Gray | `#f0f0ef` | `--color-pebble-gray` | Secondary surface for section bands, subtle backgrounds behind grouped content |
| Linen Border | `#e4e5e1` | `--color-linen-border` | Hairline dividers, card borders, and table separators — the dominant structural line color |
| Ash | `#d9d9d9` | `--color-ash` | Disabled controls, placeholder shapes, and de-emphasized borders |
| Ink | `#141415` | `--color-ink` | Primary headings, body text, and the near-black terminal panel background |
| Graphite | `#2e2e2c` | `--color-graphite` | Dark elevated surfaces for code blocks and terminal mockups |
| Carbon | `#454542` | `--color-carbon` | Secondary text, button text on light backgrounds, icon strokes |
| Slate | `#6e6f6c` | `--color-slate` | Muted helper text and meta-information |
| Stone | `#8c8c89` | `--color-stone` | Tertiary captions, timestamps, inactive nav items |
| Fog | `#b7b7b4` | `--color-fog` | Light placeholder text, icon tints on muted backgrounds |
| Signal Orange | `#f35b22` | `--color-signal-orange` | Orange supporting accent for decorative details and low-frequency emphasis. Do not promote it to the primary CTA color |
| Ember | `#ff5e24` | `--color-ember` | Hover state for Signal Orange, secondary highlight orange for icons and micro-emphasis |
| Apricot | `#f77c55` | `--color-apricot` | Lighter orange for inline links, secondary text accents, and warm icon strokes |
| Burnt Orange | `#be400f` | `--color-burnt-orange` | Deep orange for borders on featured elements, hover borders, and dark-mode accent strokes |
| Persimmon | `#d14200` | `--color-persimmon` | Darkest orange for high-contrast text accents on light surfaces and breadcrumb separators |
| Peach Blush | `#ffcab5` | `--color-peach-blush` | Pale orange wash for decorative borders and soft highlight backgrounds |
| Teal Token | `#88d2c3` | `--color-teal-token` | IDE syntax-highlight color for strings and identifiers in code blocks — repeated at scale gives the page its terminal texture |
| Sky Token | `#8bc5f3` | `--color-sky-token` | IDE syntax-highlight for keys, booleans, and object properties in code blocks |
| Orchid Token | `#c678dd` | `--color-orchid-token` | IDE syntax-highlight for keywords and function names in code blocks |
| Forest | `#165424` | `--color-forest` | Green supporting accent for decorative details and low-frequency emphasis. Use as a supporting accent, not as a status color |
| Success Green | `#62b06d` | `--color-success-green` | Green supporting accent for decorative details and low-frequency emphasis. Use as a supporting accent, not as a status color |
| Coral Alert | `#f67976` | `--color-coral-alert` | Red supporting accent for decorative details and low-frequency emphasis. Use as a supporting accent, not as a status color |
| Rose Blush | `#f9aea9` | `--color-rose-blush` | Red supporting accent for decorative details and low-frequency emphasis. Use as a supporting accent, not as a status color |

## Tokens — Typography

### Inter — Primary UI and editorial typeface — handles all headings, body text, buttons, and navigation. Weight 600 is the default for headlines, weight 400 for body, weight 500 for labels. Calt and liga features are disabled, giving the type a more uniform, 'engineered' feel rather than the swashy alternates Inter ships with. · `--font-inter`
- **Substitute:** Inter (Google Fonts)
- **Weights:** 300, 400, 500, 600, 700
- **Sizes:** 9, 10, 11, 12, 13, 14, 16, 30, 36, 48
- **Line height:** 1.15 (display/heading), 1.50 (body), 1.60 (body-sm), 1.67 (captions)
- **Letter spacing:** -0.0620em at 48px (≈-2.98px), -0.0200em at 36px (≈-0.72px), 0.0010em at 16px (≈0.016px), 0.0100em at 14px (≈0.14px), 0.0600em at 12px (≈0.72px), 0.0800em at 11px (≈0.88px), 0.1200em at 10px (≈1.2px), 0.2000em at 9px (≈1.8px)
- **OpenType features:** `"calt" 0, "liga" 0`
- **Role:** Primary UI and editorial typeface — handles all headings, body text, buttons, and navigation. Weight 600 is the default for headlines, weight 400 for body, weight 500 for labels. Calt and liga features are disabled, giving the type a more uniform, 'engineered' feel rather than the swashy alternates Inter ships with.

### JetBrains Mono — Developer-language typeface — owns the eyebrow labels ('I'M A DEVELOPER'), code blocks, terminal output, API URLs, and visitor IDs. Acts as a visual signature: whenever the page shifts from prose to technical content, JetBrains Mono takes over. Weight 470 is the distinctive 'regular' weight that sits between 400 and 500. · `--font-jetbrains-mono`
- **Substitute:** JetBrains Mono (Google Fonts) or IBM Plex Mono
- **Weights:** 300, 400, 470, 500, 600, 700
- **Sizes:** 8, 10, 11, 12, 13, 14
- **Line height:** 0.86 (tight label stacks), 1.00 (inline code), 1.45–1.62 (code blocks)
- **Letter spacing:** -0.0800em (tight tracking on IDs/strings), 0.0010em (default), 0.1000em (wide tracking on uppercase eyebrow labels)
- **Role:** Developer-language typeface — owns the eyebrow labels ('I'M A DEVELOPER'), code blocks, terminal output, API URLs, and visitor IDs. Acts as a visual signature: whenever the page shifts from prose to technical content, JetBrains Mono takes over. Weight 470 is the distinctive 'regular' weight that sits between 400 and 500.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| eyebrow | 11px | 1.45 | 0.88px | `--text-eyebrow` |
| heading-sm | 30px | 1.17 | -0.6px | `--text-heading-sm` |
| heading | 36px | 1.15 | -0.72px | `--text-heading` |
| display | 48px | 1.15 | -2.98px | `--text-display` |

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
| 48 | 48px | `--spacing-48` |
| 56 | 56px | `--spacing-56` |
| 72 | 72px | `--spacing-72` |
| 96 | 96px | `--spacing-96` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 4px |
| cards | 12px |
| badges | 4px |
| buttons | 4px |
| code-panels | 12px |
| large-blocks | 16px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| subtle | `rgba(24, 25, 22, 0.06) 0px 1px 2px 0px` | `--shadow-subtle` |
| subtle-2 | `rgba(24, 25, 22, 0.02) 0px 2px 1px 0px, rgba(24, 25, 22, ...` | `--shadow-subtle-2` |
| subtle-3 | `rgb(255, 255, 255) 0px 1px 0px 0px inset` | `--shadow-subtle-3` |
| subtle-4 | `rgba(228, 229, 225, 0.3) 0px 1px 0px 0px inset, rgba(110,...` | `--shadow-subtle-4` |
| subtle-5 | `rgba(255, 255, 255, 0.2) 0px 1px 0px 0px inset, rgba(24, ...` | `--shadow-subtle-5` |
| subtle-6 | `rgba(255, 255, 255, 0.04) 0px 1px 0px 0px inset, rgba(0, ...` | `--shadow-subtle-6` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 72px
- **Card padding:** 24px
- **Element gap:** 8px

## Components

### Primary CTA Button
**Role:** Filled orange button for top-of-funnel conversion actions

Background: #f35b22. Text: #ffffff, Inter weight 500, 14px, letter-spacing 0.14px. Padding: 12px 24px. Border-radius: 4px. Box-shadow: rgba(255,255,255,0.2) 0px 1px 0px 0px inset, rgba(24,25,22,0.06) 0px 1px 2px 0px, rgba(24,25,22,0.1) 0px -1px 0px 0px inset. Hover transitions to #ff5e24. The only filled button in the system — everything else is ghost or outlined.

### Secondary Ghost Button
**Role:** Outlined or transparent button for secondary actions

Background: transparent. Text: #141415, Inter weight 500, 14px. Border: 1px solid #d9d9d9. Border-radius: 4px. Padding: 12px 24px. No shadow. Used for 'Contact Sales' and 'See all Use Cases' — always paired with a primary CTA.

### Terminal Code Panel
**Role:** Dark code block showing API responses, visitor IDs, and JSON output

Background: #141415. Border-radius: 12px. Padding: 24px. Text: JetBrains Mono weight 400, 13px, line-height 1.57. JSON keys in #8bc5f3 (Sky), string values in #88d2c3 (Teal), numbers/booleans in #c678dd (Orchid), punctuation in #abb2bf. May include a top tab bar with an 'I'M A DEVELOPER' eyebrow label in JetBrains Mono 11px weight 500, letter-spacing 0.88px, color #abb2bf. This is the page's signature component.

### Feature Card
**Role:** Light card for use cases, features, and content blocks

Background: #ffffff. Border: 1px solid #e4e5e1. Border-radius: 12px. Padding: 24px. Box-shadow: rgba(228,229,225,0.3) 0px 1px 0px 0px inset, rgba(110,111,109,0.1) 0px -1px 0px 0px inset. Contains a small orange icon (stroke 1.5px, #f35b22) at top-left, Inter weight 600 heading 16px, body text 14px weight 400 in #6e6f6c. No hover elevation change.

### Accordion Use Case Item
**Role:** Expandable list item for use case descriptions

Background: #ffffff. Border: 1px solid #e4e5e1. Border-radius: 4px. Padding: 16px 20px. Title in Inter weight 600 16px #141415 with a small orange icon prefix. Expand/collapse chevron in #8c8c89. Expanded body text in Inter 14px weight 400 #454542. Stacked vertically with 1px gap between items.

### Eyebrow Label
**Role:** Small uppercase label above headings and section titles

JetBrains Mono weight 500, 11px, line-height 1.45, letter-spacing 0.88px. Color: #f35b22 for branded labels (e.g., 'I'M A DEVELOPER'), #6e6f6c for neutral labels. Always uppercase. Acts as a category marker before the main heading.

### Stats Block
**Role:** Large numeric stat with caption

Number: Inter weight 600, 36px, color #f35b22, letter-spacing -0.72px. Caption below: Inter weight 400, 14px, color #6e6f6c, line-height 1.5. Arranged in 3-column equal-width grid with 72px gap. The orange number is the visual anchor; the caption recedes.

### Trust Logo Strip
**Role:** Row of partner/client logos for social proof

Full-width band, background #ffffff. Logos displayed at uniform height (~24px), grayscale, evenly spaced in a single row. Above the logos, a centered eyebrow label in JetBrains Mono: 'TRUSTED BY 6000+ COMPANIES OF ALL SIZES' in 11px, letter-spacing 0.88px, color #8c8c89.

### Navigation Bar
**Role:** Fixed top navigation header

Background: rgba(250,250,248,0.85) with backdrop blur. Height: 64px. Logo (fingerprint icon + 'Fingerprint' wordmark) left, primary nav links center (Inter 14px weight 500 #141415), two buttons right (ghost 'Login' + filled 'Get Started'). Box-shadow: rgba(24,25,22,0.02) 0px 2px 1px 0px, rgba(24,25,22,0.1) 0px -1px 0px 0px inset.

### Inline Highlighted Word
**Role:** Single word or phrase in Signal Orange within a heading

Runs inline within an otherwise black Inter heading. Color: #f35b22, same weight and size as surrounding text. Used to create editorial emphasis without changing the typographic rhythm. Example: 'Identify Every Visitor' where 'Every' is orange.

### Device Detection Card
**Role:** Overlay card showing device intelligence data next to a phone mockup

Background: #ffffff. Border: 1px solid #e4e5e1. Border-radius: 12px. Padding: 16px. Contains structured key-value pairs: label in Inter 12px weight 500 #6e6f6c, value in JetBrains Mono 13px #141415. Suspicious scores highlighted in #f67976. Clean, tabular, monospace data presentation.

### Integration Icon Row
**Role:** Horizontal strip of technology/integration logos

Small icons (~32px) in a single row, evenly spaced. Icons are grayscale or muted. Background: dark or light depending on section. Used to show platform breadth (SDKs, integrations). No labels — icon recognition is the point.

## Do's and Don'ts

### Do
- Use #f35b22 as the single filled button color — never introduce a second filled button color
- Apply the inline orange highlight pattern to one word per headline: wrap the most important noun in #f35b22 while keeping the rest #141415
- Set Calt and Liga to 0 on all Inter text to preserve the engineered, non-decorative letterform character
- Use JetBrains Mono 11px weight 500 with 0.88px letter-spacing for all uppercase eyebrow labels
- Apply 4px radius to buttons, nav items, and badges; 12px radius to cards and code panels; 16px only to large feature blocks
- Pair every primary CTA with a ghost secondary button — never show a primary CTA alone in the navigation or hero
- Use #141415 or #2e2e2c as the background for any code or terminal content — code blocks should never appear on the cream canvas

### Don't
- Don't add drop shadows beyond the four defined elevation tokens — the system uses hairline borders and inset highlights, not floating shadows
- Don't use the syntax-highlight colors (#88d2c3, #8bc5f3, #c678dd) outside of code/terminal contexts — they are borrowed from an IDE palette, not decoration
- Don't introduce a second accent color — orange is the only chromatic voice in the system
- Don't use #f35b22 on dark backgrounds without testing contrast — the orange is calibrated for light surfaces
- Don't set body text below 14px in Inter or below 12px in JetBrains Mono — the type scale has a hard floor
- Don't apply rounded corners above 16px — the system is intentionally low-radius, not pill-shaped
- Don't use gradients — the system is flat; if depth is needed, use the inset highlight + border-radius 12px pattern instead

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Cream Canvas | `#fafaf8` | Base page background and dominant surface for all content sections |
| 2 | Card White | `#ffffff` | Elevated cards, feature blocks, and form surfaces that sit on the canvas |
| 3 | Pebble Band | `#f0f0ef` | Alternating section background to create visual separation between content groups |
| 4 | Terminal Dark | `#141415` | Dark code blocks, terminal mockups, and developer-focused panels — the only dark surface in the system |
| 5 | Graphite Panel | `#2e2e2c` | Slightly lighter dark surface for nested code blocks and elevated terminal sections |

## Elevation

- **Navigation bar:** `rgba(24, 25, 22, 0.02) 0px 2px 1px 0px, rgba(24, 25, 22, 0.1) 0px -1px 0px 0px inset`
- **Cards:** `rgba(228, 229, 225, 0.3) 0px 1px 0px 0px inset, rgba(110, 111, 109, 0.1) 0px -1px 0px 0px inset`
- **Links and interactive text:** `rgba(24, 25, 22, 0.06) 0px 1px 2px 0px`
- **Primary buttons:** `rgba(255, 255, 255, 0.2) 0px 1px 0px 0px inset, rgba(24, 25, 22, 0.06) 0px 1px 2px 0px, rgba(24, 25, 22, 0.1) 0px -1px 0px 0px inset`

## Imagery

Visuals are dominated by dark code/terminal panels showing JSON API responses and visitor identification data — these are the product's portfolio pieces, not decorative. Supporting visuals include a minimal phone/device mockup showing device intelligence results in a card overlay. The trust bar at the bottom uses small grayscale partner logos in a single row. No lifestyle photography, no illustrations, no 3D renders. The only 'graphic' element is the fingerprint logo mark, a simple overlapping-circle fingerprint icon in Signal Orange. When screenshots or product UI appear, they are treated as flat artifacts: dark backgrounds, mono fonts, syntax-highlighted text — the page treats code as a first-class visual medium.

## Layout

Max-width ~1200px centered content with full-bleed background sections. The hero is a centered text stack over the cream canvas, immediately followed by a wide dark terminal panel that breaks the light grid. Below the fold, the page alternates between two-column text+visual blocks (text-left/visual-right, then visual-left/text-right) and full-width feature card grids. Stats sections use a 3-column equal-width grid with large orange numbers. The trust bar is a single full-width row of logos. Navigation is a fixed top bar with logo left, primary nav center, and two buttons (ghost + filled orange) right. The overall rhythm is: light prose → dark code → light prose → dark code, creating a two-mode cadence that reinforces the developer-tool identity.

## Agent Prompt Guide

**Quick Color Reference**
- text: #141415
- background: #fafaf8
- card surface: #ffffff
- border: #e4e5e1
- accent / inline highlight: #f35b22
- primary action: no distinct CTA color

**3 Example Component Prompts**

No distinct primary action color was observed; use the extracted neutral button treatments instead of inventing a filled CTA color.

2. Create a stats section: 3-column grid, 72px gap. Each cell: large number in Inter weight 600 36px, #f35b22, letter-spacing -0.72px (e.g., '250+', '4 Billion +', '50 Million +'). Below each number, a caption in Inter 14px weight 400, #6e6f6c, line-height 1.5. Background: #fafaf8. No card containers — the numbers float directly on the canvas.

3. Create a use-case accordion: stacked vertical list of items, 1px gap. Each item: #ffffff background, 1px #e4e5e1 border, 4px radius, 16px 20px padding. Title row: small #f35b22 icon (stroke 1.5px) + Inter weight 600 16px #141415 text, right-aligned chevron in #8c8c89. Expanded state reveals body text in Inter 14px weight 400 #454542 below the title.

## Similar Brands

- **Snyk** — Same devtools DNA: warm-neutral canvas, single bold accent color for CTAs, JetBrains Mono for code, dark code panels breaking up light prose sections
- **Linear** — Similar tight typographic rhythm with negative letter-spacing on headings, hairline borders, flat cards with subtle inset highlights instead of drop shadows
- **Vercel** — Same editorial approach to monochrome: near-black text on warm off-white, one accent color doing all the emphasis work, minimal elevation philosophy
- **Auth0 / Okta Developer** — Shared developer-console aesthetic with terminal-style dark panels containing syntax-highlighted JSON, mono fonts for technical content, and code-as-hero compositions

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-cream-paper: #fafaf8;
  --color-card-white: #ffffff;
  --color-pebble-gray: #f0f0ef;
  --color-linen-border: #e4e5e1;
  --color-ash: #d9d9d9;
  --color-ink: #141415;
  --color-graphite: #2e2e2c;
  --color-carbon: #454542;
  --color-slate: #6e6f6c;
  --color-stone: #8c8c89;
  --color-fog: #b7b7b4;
  --color-signal-orange: #f35b22;
  --color-ember: #ff5e24;
  --color-apricot: #f77c55;
  --color-burnt-orange: #be400f;
  --color-persimmon: #d14200;
  --color-peach-blush: #ffcab5;
  --color-teal-token: #88d2c3;
  --color-sky-token: #8bc5f3;
  --color-orchid-token: #c678dd;
  --color-forest: #165424;
  --color-success-green: #62b06d;
  --color-coral-alert: #f67976;
  --color-rose-blush: #f9aea9;

  /* Typography — Font Families */
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-jetbrains-mono: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-eyebrow: 11px;
  --leading-eyebrow: 1.45;
  --tracking-eyebrow: 0.88px;
  --text-heading-sm: 30px;
  --leading-heading-sm: 1.17;
  --tracking-heading-sm: -0.6px;
  --text-heading: 36px;
  --leading-heading: 1.15;
  --tracking-heading: -0.72px;
  --text-display: 48px;
  --leading-display: 1.15;
  --tracking-display: -2.98px;

  /* Typography — Weights */
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-w470: 470;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
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
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-72: 72px;
  --spacing-96: 96px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 72px;
  --card-padding: 24px;
  --element-gap: 8px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;

  /* Named Radii */
  --radius-nav: 4px;
  --radius-cards: 12px;
  --radius-badges: 4px;
  --radius-buttons: 4px;
  --radius-code-panels: 12px;
  --radius-large-blocks: 16px;

  /* Shadows */
  --shadow-subtle: rgba(24, 25, 22, 0.06) 0px 1px 2px 0px;
  --shadow-subtle-2: rgba(24, 25, 22, 0.02) 0px 2px 1px 0px, rgba(24, 25, 22, 0.1) 0px -1px 0px 0px inset;
  --shadow-subtle-3: rgb(255, 255, 255) 0px 1px 0px 0px inset;
  --shadow-subtle-4: rgba(228, 229, 225, 0.3) 0px 1px 0px 0px inset, rgba(110, 111, 109, 0.1) 0px -1px 0px 0px inset;
  --shadow-subtle-5: rgba(255, 255, 255, 0.2) 0px 1px 0px 0px inset, rgba(24, 25, 22, 0.06) 0px 1px 2px 0px, rgba(24, 25, 22, 0.1) 0px -1px 0px 0px inset;
  --shadow-subtle-6: rgba(255, 255, 255, 0.04) 0px 1px 0px 0px inset, rgba(0, 0, 0, 0.2) 0px -1px 0px 0px inset;

  /* Surfaces */
  --surface-cream-canvas: #fafaf8;
  --surface-card-white: #ffffff;
  --surface-pebble-band: #f0f0ef;
  --surface-terminal-dark: #141415;
  --surface-graphite-panel: #2e2e2c;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-cream-paper: #fafaf8;
  --color-card-white: #ffffff;
  --color-pebble-gray: #f0f0ef;
  --color-linen-border: #e4e5e1;
  --color-ash: #d9d9d9;
  --color-ink: #141415;
  --color-graphite: #2e2e2c;
  --color-carbon: #454542;
  --color-slate: #6e6f6c;
  --color-stone: #8c8c89;
  --color-fog: #b7b7b4;
  --color-signal-orange: #f35b22;
  --color-ember: #ff5e24;
  --color-apricot: #f77c55;
  --color-burnt-orange: #be400f;
  --color-persimmon: #d14200;
  --color-peach-blush: #ffcab5;
  --color-teal-token: #88d2c3;
  --color-sky-token: #8bc5f3;
  --color-orchid-token: #c678dd;
  --color-forest: #165424;
  --color-success-green: #62b06d;
  --color-coral-alert: #f67976;
  --color-rose-blush: #f9aea9;

  /* Typography */
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-jetbrains-mono: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-eyebrow: 11px;
  --leading-eyebrow: 1.45;
  --tracking-eyebrow: 0.88px;
  --text-heading-sm: 30px;
  --leading-heading-sm: 1.17;
  --tracking-heading-sm: -0.6px;
  --text-heading: 36px;
  --leading-heading: 1.15;
  --tracking-heading: -0.72px;
  --text-display: 48px;
  --leading-display: 1.15;
  --tracking-display: -2.98px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-72: 72px;
  --spacing-96: 96px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;

  /* Shadows */
  --shadow-subtle: rgba(24, 25, 22, 0.06) 0px 1px 2px 0px;
  --shadow-subtle-2: rgba(24, 25, 22, 0.02) 0px 2px 1px 0px, rgba(24, 25, 22, 0.1) 0px -1px 0px 0px inset;
  --shadow-subtle-3: rgb(255, 255, 255) 0px 1px 0px 0px inset;
  --shadow-subtle-4: rgba(228, 229, 225, 0.3) 0px 1px 0px 0px inset, rgba(110, 111, 109, 0.1) 0px -1px 0px 0px inset;
  --shadow-subtle-5: rgba(255, 255, 255, 0.2) 0px 1px 0px 0px inset, rgba(24, 25, 22, 0.06) 0px 1px 2px 0px, rgba(24, 25, 22, 0.1) 0px -1px 0px 0px inset;
  --shadow-subtle-6: rgba(255, 255, 255, 0.04) 0px 1px 0px 0px inset, rgba(0, 0, 0, 0.2) 0px -1px 0px 0px inset;
}
```
