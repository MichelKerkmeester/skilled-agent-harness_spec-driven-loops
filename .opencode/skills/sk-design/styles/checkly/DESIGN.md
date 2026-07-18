# Checkly — Style Reference
> Mission control at deep orbit

**Theme:** dark

Checkly lives in deep midnight-navy — a near-black cosmic canvas where white type floats like HUD readouts and one vivid electric blue acts as the signal accent. The system is deliberately sparse: hairline light-gray borders define structure instead of heavy shadows, product UI is shown as floating light-themed cards suspended on the dark void, and code blocks are treated as first-class content in JetBrains Mono. Inter at weight 300 gives headlines a whisper-quiet authority that lets the technical subject matter do the talking, while weight 500–600 carries operational UI. The overall feel is mission control at altitude — minimal chrome, maximal legibility, one accent doing all the semantic work.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Void Navy | `#041734` | `--color-void-navy` | Page background, hero canvas, section bands — the deep-space base on which all other UI floats |
| Signal Blue | `#0075ff` | `--color-signal-blue` | Blue text accent for links, tags, and emphasized short phrases. Do not promote it to the primary CTA color |
| Probe Cyan | `#008ef0` | `--color-probe-cyan` | Hover/active accent variant for buttons and interactive states |
| Hub Navy | `#002652` | `--color-hub-navy` | Secondary surface tint, logo wordmark — a slightly lighter shade of the void used for depth |
| Orbit Slate | `#0f172a` | `--color-orbit-slate` | Card surfaces, inset panels, terminal block backgrounds — the next level up from the void |
| Deck Charcoal | `#1a1f36` | `--color-deck-charcoal` | Elevated card surfaces, nested panel backgrounds — sits above Orbit Slate for layered depth |
| Deep Hull | `#1f2937` | `--color-deep-hull` | Borders on dark surfaces, section dividers within dark bands |
| Steel Edge | `#374151` | `--color-steel-edge` | Borders and dividers on cards and panels — the most common structural border |
| Console Gray | `#445458` | `--color-console-gray` | Secondary body text, muted labels, icon fills — readable on dark without competing with white headings |
| Slate Mute | `#64748b` | `--color-slate-mute` | Helper text, captions, tertiary metadata — drops information below the primary read |
| Mist | `#a7babe` | `--color-mist` | De-emphasized text, disabled labels, low-priority inline content |
| Halo | `#e5e7eb` | `--color-halo` | Hairline borders on dark surfaces, subtle dividers, the dominant structural line color |
| Pure White | `#ffffff` | `--color-pure-white` | Primary text, filled button background, logo fills — maximum contrast against the void |
| Status Green | `#4ade80` | `--color-status-green` | Green text accent for links, tags, and emphasized short phrases. Use as a supporting accent, not as a status color |

## Tokens — Typography

### Inter — Primary UI and heading typeface. Weight 300 for display headlines creates whisper-quiet authority; weight 400 for body; weight 500–600 for nav, buttons, and labels. · `--font-inter`
- **Substitute:** Inter (Google Fonts)
- **Weights:** 300, 400, 500, 600, 700
- **Sizes:** 10, 12, 14, 16, 18, 20, 24, 30, 32, 48, 60
- **Line height:** 1.20–1.63 (display 1.20, body 1.50, small 1.43)
- **Letter spacing:** -0.0400em at 60px, -0.0250em at 48px, 0.0500em at 10–12px (tracked-out micro-labels)
- **OpenType features:** `"ss01" on, "cv11" on`
- **Role:** Primary UI and heading typeface. Weight 300 for display headlines creates whisper-quiet authority; weight 400 for body; weight 500–600 for nav, buttons, and labels.

### JetBrains Mono — Code blocks, terminal output, CLI commands like `npx checkly init`. The custom font signal 'this is executable'. · `--font-jetbrains-mono`
- **Substitute:** JetBrains Mono (JetBrains), or Fira Code
- **Weights:** 400
- **Sizes:** 10, 12, 16
- **Line height:** 1.50–1.63
- **Role:** Code blocks, terminal output, CLI commands like `npx checkly init`. The custom font signal 'this is executable'.

### ui-monospace — System monospace fallback for inline code, tab indicators, secondary code contexts · `--font-ui-monospace`
- **Substitute:** SF Mono, Menlo, Consolas, monospace
- **Weights:** 400, 500
- **Sizes:** 11, 12, 14
- **Line height:** 1.33–1.63
- **Role:** System monospace fallback for inline code, tab indicators, secondary code contexts

### Consolas — Consolas — detected in extracted data but not described by AI · `--font-consolas`
- **Weights:** 400
- **Sizes:** 10px
- **Line height:** 1.5
- **Role:** Consolas — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 10px | 1.5 | 0.5px | `--text-caption` |
| body | 16px | 1.5 | — | `--text-body` |
| subheading | 20px | 1.4 | — | `--text-subheading` |
| heading-sm | 24px | 1.33 | — | `--text-heading-sm` |
| heading | 32px | 1.25 | — | `--text-heading` |
| heading-lg | 48px | 1.2 | -1.2px | `--text-heading-lg` |
| display | 60px | 1 | -2.4px | `--text-display` |

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
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 56 | 56px | `--spacing-56` |
| 64 | 64px | `--spacing-64` |
| 72 | 72px | `--spacing-72` |
| 80 | 80px | `--spacing-80` |
| 96 | 96px | `--spacing-96` |
| 104 | 104px | `--spacing-104` |
| 144 | 144px | `--spacing-144` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 9999px |
| cards | 12px |
| inputs | 8px |
| buttons | 8px |
| code-blocks | 12px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| md | `rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.1)...` | `--shadow-md` |
| xl | `rgba(0, 0, 0, 0.25) 0px 25px 50px -12px` | `--shadow-xl` |
| xl-2 | `rgb(0, 117, 255) 0px 25px 50px -12px` | `--shadow-xl-2` |
| md-2 | `rgba(0, 0, 0, 0.25) 0px 4px 12px 0px, rgba(0, 0, 0, 0.15)...` | `--shadow-md-2` |
| subtle | `rgba(0, 0, 0, 0.05) 0px 1px 2px 0px` | `--shadow-subtle` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 24px
- **Element gap:** 12px

## Components

### Primary CTA Button (White Filled)
**Role:** Main conversion action — 'Start for free', 'Book a demo'

White (#ffffff) background, Void Navy (#041734) text, 8px radius, Inter weight 500 at 14–16px, padding 10px 20px. Inverts against the dark canvas like a lit control panel switch.

### Secondary CTA Button (Outlined)
**Role:** Alternative action alongside primary CTA

Transparent background, 1px border in #cfdfec or #041734, white text, 8px radius, padding 10px 20px. Low-emphasis companion that defers to the filled button.

### Pill Badge / Status Tag
**Role:** Environment labels, status indicators, inline tags

9999px radius, 4–8px vertical padding, 10–12px horizontal padding. Background varies: green (#4ade80) for 'passing/available', dark navy for 'test/staging/prod' code blocks, subtle gray for category labels. Inter at 10–12px weight 500, letter-spacing 0.05em.

### Terminal / CLI Block
**Role:** Code snippets, install commands, config examples

Orbit Slate (#0f172a) background, 12px radius, padding 16–24px. JetBrains Mono at 12–16px, line-height 1.63. White text with green (#4ade80) and light blue (#bfdbfe) syntax accents. Often prefixed with a copy icon.

### Embedded Product Screenshot Card
**Role:** Dashboard previews, feature demonstrations, product evidence

White (#ffffff) background, 12–16px radius, subtle box-shadow rgba(0,0,0,0.25) 0px 25px 50px -12px. Floats on the dark canvas as a bright window into the product. Contains light-themed UI (charts, tables, status badges in green/red).

### Navigation Bar
**Role:** Top-level site navigation

Transparent or slightly tinted dark background, Inter weight 500 at 14px, white text, 24px horizontal padding on nav items, 8px vertical padding. Logo left, links center, auth actions right. Sticky on scroll.

### Section Heading with Blue Accent Words
**Role:** Display-level section titles

Inter weight 300 at 48–60px, white (#ffffff), letter-spacing -0.025em to -0.04em. Select words rendered in Signal Blue (#0075ff) to create semantic emphasis without underlining. Line-height 1.00–1.20.

### Feature Card (Dark Surface)
**Role:** Three-column feature highlights, capability summaries

Orbit Slate (#0f172a) or Deck Charcoal (#1a1f36) background, 12px radius, 24px padding, 1px border in #374151. Heading in white weight 500 at 20–24px, body in Console Gray (#445458) at 16px.

### Trust Logo Bar
**Role:** Social proof — customer/partner logos

Single row or two-row grid of company logos in white or light gray on the dark background. Logos desaturated to grayscale or rendered in white. No borders or containers — logos float directly on the section.

### Code Syntax Token
**Role:** Inline and block code highlighting

Colored tokens within terminal blocks: keywords in #d8b4fe (purple), strings in #4fd785 (green), numbers in #fde047 (yellow), function names in #bfdbfe (light blue), comments in #6094c1 (muted blue). Against the Orbit Slate background.

### Command Input Pill
**Role:** CLI install command display in hero

Dark rounded container with a copy affordance, monospace text showing the install command. Centered below hero CTAs as a secondary call-to-action. 12px radius, subtle border.

### Chat Widget Bubble
**Role:** Support chat launcher (bottom-right)

Signal Blue (#0075ff) circular button with a blue glow shadow rgb(0,117,255) 0px 25px 50px -12px. Fixed position bottom-right corner.

## Do's and Don'ts

### Do
- Use weight 300 Inter at 48–60px for display headlines — the whisper-weight is the signature
- Use #0075ff Signal Blue exclusively for accent text, highlighted words, icon strokes, and interactive links — never for backgrounds
- Use 9999px radius for all status pills, environment tags, and inline badges
- Use 8px radius for all buttons and 12px for cards — the 8/12 split is consistent across the system
- Use #e5e7eb at low opacity (or #374151 on dark surfaces) for hairline borders instead of heavy shadows
- Use JetBrains Mono for any code, CLI commands, or terminal output — never let Inter render code
- Use white (#ffffff) filled buttons as the primary CTA on the dark canvas — they read as 'switched on' controls

### Don't
- Don't use shadows as the primary structural method — use hairline borders in #374151 or #e5e7eb instead
- Don't use #0075ff as a large filled background — it's an accent, not a surface
- Don't use weight 700 or 800 for headlines — the system speaks at weight 300, not weight 900
- Don't use rounded radii above 16px on cards or panels — the 8/12/16 progression is the system
- Don't introduce new chromatic colors beyond Signal Blue, Status Green, and syntax-token colors
- Don't use Inter for code — always JetBrains Mono or system monospace
- Don't add gradients to UI surfaces — the system is flat with one subtle white-to-blue wash as the only gradient

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Void | `#041734` | Page and section background — the deep-space base |
| 1 | Orbit | `#0f172a` | Card surfaces, terminal blocks, code panels |
| 2 | Deck | `#1a1f36` | Elevated nested panels, tab content backgrounds |
| 3 | Product Light | `#ffffff` | Embedded product screenshot cards — light-themed UI floating on the dark canvas |

## Elevation

- **Embedded product card:** `rgba(0, 0, 0, 0.25) 0px 25px 50px -12px`
- **Standard surface card:** `rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.1) 0px 4px 6px -4px`
- **Chat widget:** `rgb(0, 117, 255) 0px 25px 50px -12px`
- **Inset dark card:** `rgba(0, 0, 0, 0.25) 0px 4px 12px 0px, rgba(0, 0, 0, 0.15) 0px 1px 3px 0px, rgba(255, 255, 255, 0.04) 0px 1px 0px 0px inset`

## Imagery

The visual language is predominantly iconographic and abstract rather than photographic. The hero features a stylized illustration of the raccoon mascot at the center of a network of curved connection lines radiating outward to floating tool/tech icons (GitHub, Slack, browser logos). Customer logos appear as monochrome white wordmarks in a trust bar. Product evidence comes from embedded light-themed dashboard screenshots that float as cards on the dark canvas. No lifestyle photography, no human faces, no real-world environments — the aesthetic is diagrammatic and infrastructural.

## Layout

The page is full-bleed dark navy with max-width 1200px content containers centered within sections. The hero is a centered text stack (headline → subhead → dual CTA → CLI command) with the raccoon illustration radiating connection lines as the visual anchor. Below the hero, sections alternate between text-left/visual-right 2-column patterns and 3-column feature card grids. Product screenshots are embedded as light cards spanning 2/3 to full width. The trust logo bar sits as a full-width band. Navigation is a top bar with logo left, links center, auth actions right. The overall rhythm is generous vertical breathing room (80px section gaps) with dense information packed into each section. Sections are separated by slight background color shifts within the navy family rather than hard dividers.

## Agent Prompt Guide

**Quick Color Reference**
- text: #ffffff (primary), #445458 (secondary), #64748b (muted)
- background: #041734 (page), #0f172a (card), #1a1f36 (elevated)
- border: #374151 (structural), #e5e7eb (hairline on dark)
- accent: #0075ff
- primary action: #041734 (filled action)

**Example Component Prompts**
1. *Hero section*: #041734 background. Display headline at 60px Inter weight 300, #ffffff, letter-spacing -2.4px. Subhead at 18px Inter weight 400, #445458. White filled button (8px radius, 10px 20px padding, #041734 text) beside a outlined button (1px #cfdfec border, #ffffff text). CLI command in a dark pill below using JetBrains Mono 14px.

2. *Feature card grid*: 3-column grid on #041734 background. Each card: #0f172a background, 12px radius, 24px padding, 1px #374151 border. Heading at 20px Inter weight 500, #ffffff. Body at 16px Inter weight 400, #445458.

3. *Terminal code block*: #0f172a background, 12px radius, 16px padding. JetBrains Mono 12px, line-height 1.63. Keywords in #d8b4fe, strings in #4fd785, function names in #bfdbfe, base text #ffffff.

4. *Embedded product screenshot card*: #ffffff background, 16px radius, shadow rgba(0,0,0,0.25) 0px 25px 50px -12px. Contains light-themed dashboard UI with green (#4ade80) status bars and gray data tables.

5. *Status pill badge*: 9999px radius, 4px 10px padding, #4ade80 background for 'passing' or #0f172a for 'test/staging/prod'. Inter 10px weight 500, letter-spacing 0.5px, dark or white text.

## Gradient System

The system uses exactly one gradient: a subtle white-to-blue wash (linear-gradient(rgb(255,255,255), rgba(96,148,193,0.2))) applied as a soft atmospheric overlay. No other gradients are used in UI surfaces. Signal Blue (#0075ff) is always rendered as a solid color, never as a gradient fill. This restraint is intentional — the dark canvas should feel like empty space, not a colored backdrop.

## Similar Brands

- **Vercel** — Same near-black canvas with white type and a single vivid accent color for interactive emphasis, same flat low-elevation aesthetic
- **Linear** — Same developer-tool dark UI with weight-300 display headlines, hairline borders, and Inter typography at whisper volumes
- **Railway** — Same deep navy infrastructure-tool aesthetic with code-as-first-class content and minimal chrome
- **PlanetScale** — Same dark-mode devtools pattern with floating product screenshots as evidence cards on a dark background

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-void-navy: #041734;
  --color-signal-blue: #0075ff;
  --color-probe-cyan: #008ef0;
  --color-hub-navy: #002652;
  --color-orbit-slate: #0f172a;
  --color-deck-charcoal: #1a1f36;
  --color-deep-hull: #1f2937;
  --color-steel-edge: #374151;
  --color-console-gray: #445458;
  --color-slate-mute: #64748b;
  --color-mist: #a7babe;
  --color-halo: #e5e7eb;
  --color-pure-white: #ffffff;
  --color-status-green: #4ade80;

  /* Typography — Font Families */
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-jetbrains-mono: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-ui-monospace: 'ui-monospace', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-consolas: 'Consolas', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.5;
  --tracking-caption: 0.5px;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 20px;
  --leading-subheading: 1.4;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.33;
  --text-heading: 32px;
  --leading-heading: 1.25;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.2;
  --tracking-heading-lg: -1.2px;
  --text-display: 60px;
  --leading-display: 1;
  --tracking-display: -2.4px;

  /* Typography — Weights */
  --font-weight-light: 300;
  --font-weight-regular: 400;
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
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-64: 64px;
  --spacing-72: 72px;
  --spacing-80: 80px;
  --spacing-96: 96px;
  --spacing-104: 104px;
  --spacing-144: 144px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 24px;
  --element-gap: 12px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-full: 9999px;

  /* Named Radii */
  --radius-tags: 9999px;
  --radius-cards: 12px;
  --radius-inputs: 8px;
  --radius-buttons: 8px;
  --radius-code-blocks: 12px;

  /* Shadows */
  --shadow-md: rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.1) 0px 4px 6px -4px;
  --shadow-xl: rgba(0, 0, 0, 0.25) 0px 25px 50px -12px;
  --shadow-xl-2: rgb(0, 117, 255) 0px 25px 50px -12px;
  --shadow-md-2: rgba(0, 0, 0, 0.25) 0px 4px 12px 0px, rgba(0, 0, 0, 0.15) 0px 1px 3px 0px, rgba(255, 255, 255, 0.04) 0px 1px 0px 0px inset;
  --shadow-subtle: rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;

  /* Surfaces */
  --surface-void: #041734;
  --surface-orbit: #0f172a;
  --surface-deck: #1a1f36;
  --surface-product-light: #ffffff;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-void-navy: #041734;
  --color-signal-blue: #0075ff;
  --color-probe-cyan: #008ef0;
  --color-hub-navy: #002652;
  --color-orbit-slate: #0f172a;
  --color-deck-charcoal: #1a1f36;
  --color-deep-hull: #1f2937;
  --color-steel-edge: #374151;
  --color-console-gray: #445458;
  --color-slate-mute: #64748b;
  --color-mist: #a7babe;
  --color-halo: #e5e7eb;
  --color-pure-white: #ffffff;
  --color-status-green: #4ade80;

  /* Typography */
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-jetbrains-mono: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-ui-monospace: 'ui-monospace', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-consolas: 'Consolas', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.5;
  --tracking-caption: 0.5px;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 20px;
  --leading-subheading: 1.4;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.33;
  --text-heading: 32px;
  --leading-heading: 1.25;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.2;
  --tracking-heading-lg: -1.2px;
  --text-display: 60px;
  --leading-display: 1;
  --tracking-display: -2.4px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-64: 64px;
  --spacing-72: 72px;
  --spacing-80: 80px;
  --spacing-96: 96px;
  --spacing-104: 104px;
  --spacing-144: 144px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-md: rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.1) 0px 4px 6px -4px;
  --shadow-xl: rgba(0, 0, 0, 0.25) 0px 25px 50px -12px;
  --shadow-xl-2: rgb(0, 117, 255) 0px 25px 50px -12px;
  --shadow-md-2: rgba(0, 0, 0, 0.25) 0px 4px 12px 0px, rgba(0, 0, 0, 0.15) 0px 1px 3px 0px, rgba(255, 255, 255, 0.04) 0px 1px 0px 0px inset;
  --shadow-subtle: rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
}
```
