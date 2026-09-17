# Axiom — Style Reference
> Terminal window at midnight — flat black canvas, monospaced text, and one orange cursor blinking

**Theme:** dark

Axiom is a terminal-grade dark interface where every glyph is monospaced, every surface is near-black, and one warm orange does all the chromatic work. The design language borrows from code editors and CLI tools — no gradients, almost no shadows, no rounded softness — instead layering information through subtle shifts in dark neutrals (from #000000 canvas to #191919 cards to #202020 borders) so the UI reads like a well-formatted log file. BerkeleyMono carries the entire voice, from hero headlines to nav labels, giving the product an engineering-native feel that signals audience before it signals brand. Orange appears as a precise tool: the primary CTA fill, the log-bar visualization, and a 2px left border that marks editorial case-study cards — never decorative, always functional.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Void | `#000000` | `--color-void` | Page background, nav fill, terminal surface |
| Carbon | `#111111` | `--color-carbon` | Primary surface, card base, hero canvas |
| Graphite | `#191919` | `--color-graphite` | Elevated card background, case-study card fill |
| Iron | `#202020` | `--color-iron` | Hairline borders, dividers, subtle separation |
| Slate | `#3a3a3a` | `--color-slate` | Muted borders, icon strokes, secondary lines |
| Pewter | `#505050` | `--color-pewter` | Subtle dividers, decorative rules |
| Steel | `#606060` | `--color-steel` | Tertiary text, icon detail, inactive labels |
| Ash | `#7e7e7e` | `--color-ash` | Muted helper text, small annotations |
| Fog | `#b4b4b4` | `--color-fog` | Secondary text, label text, muted body |
| Chalk | `#d9d9d9` | `--color-chalk` | Light borders, stroke detail on icons |
| Paper | `#eeeeee` | `--color-paper` | Primary text, nav links, heading fill, button text |
| Ember | `#da5c2c` | `--color-ember` | Orange supporting accent for decorative details and low-frequency emphasis. Do not promote it to the primary CTA color |

## Tokens — Typography

### BerkeleyMono — Universal typeface — headlines, body, nav, buttons, code, table cells, logo. Weight 400 carries prose and UI labels; weight 700 is reserved for emphasis and primary CTAs. The monospaced geometry unifies the brand and signals engineering audience. Every line of text, including navigation and button labels, sits in this monospaced grid — there is no proportional fallback for content. · `--font-berkeleymono`
- **Substitute:** JetBrains Mono, IBM Plex Mono, Fira Code
- **Weights:** 400, 700
- **Sizes:** 12px, 13px, 14px, 16px, 18px, 20px, 24px, 32px
- **Line height:** 1.0–1.71
- **Letter spacing:** normal
- **Role:** Universal typeface — headlines, body, nav, buttons, code, table cells, logo. Weight 400 carries prose and UI labels; weight 700 is reserved for emphasis and primary CTAs. The monospaced geometry unifies the brand and signals engineering audience. Every line of text, including navigation and button labels, sits in this monospaced grid — there is no proportional fallback for content.

### Inter — Secondary text layer — small icon labels, fine print, tertiary annotations where proportional letterforms reduce visual density below the mono baseline · `--font-inter`
- **Substitute:** system-ui, -apple-system, Segoe UI
- **Weights:** 400
- **Sizes:** 12px, 14px, 16px
- **Line height:** 1.33–1.50
- **Role:** Secondary text layer — small icon labels, fine print, tertiary annotations where proportional letterforms reduce visual density below the mono baseline

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.5 | — | `--text-caption` |
| body | 14px | 1.71 | — | `--text-body` |
| heading-sm | 18px | 1.56 | — | `--text-heading-sm` |
| heading | 20px | 1.4 | — | `--text-heading` |
| heading-lg | 24px | 1.33 | — | `--text-heading-lg` |
| display | 32px | 1.25 | — | `--text-display` |

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
| tags | 9999px |
| cards | 2px |
| icons | 9999px |
| inputs | 2px |
| buttons | 2px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| subtle | `rgba(0, 0, 0, 0.05) 0px 1px 2px 0px` | `--shadow-subtle` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 40px
- **Card padding:** 32px
- **Element gap:** 16px

## Components

### Primary CTA Button
**Role:** Hero call-to-action, conversion anchor

Filled button with #da5c2c background, #eeeeee text, BerkeleyMono 16px weight 700, 2px border radius, padding 10px 16px. Arrow glyph (→) follows the label. No shadow, no hover lift — color change only.

### Ghost Button
**Role:** Secondary action beside primary CTA

Transparent background, 1px #3a3a3a border, #eeeeee text, BerkeleyMono 16px weight 400, 2px radius, 10px 16px padding. Arrow glyph follows label. Sits in nav as "Sign up" and inline as "Sign up for free".

### Top Navigation Bar
**Role:** Primary site navigation, sticky on scroll

#000000 background, full-width, 16px horizontal padding. Logo (triangle mark + wordmark) left, nav links center in BerkeleyMono 14px weight 400 #eeeeee with dropdown chevrons, login/signup/demo cluster right. Height ~56px. Hairline #202020 bottom border optional.

### Announcement Banner
**Role:** Top-of-page product update strip

Full-width #111111 strip, BerkeleyMono 12px weight 400 #eeeeee text, centered or left-aligned. Closing × icon right. Subtle, not colorful — the message is the emphasis.

### Case Study Card
**Role:** Customer testimonial unit in horizontal scroller

#191919 background, 2px radius, 32px padding. 2px solid #da5c2c left border running full height — the only color in the card, functioning as a category tag. Customer logo top, headline BerkeleyMono 18px weight 400 #eeeeee, body text 14px, quote 14px italic-weight in a nested #111111 sub-card, avatar + name + role footer, underlined "case study →" link at bottom.

### Logo Grid Cell
**Role:** Customer logo display in social-proof band

#111111 background, 2px radius, centered grayscale logo, ~80px tall, 24px padding. Two rows of six cells. Logos rendered in #eeeeee or #b4b4b4 monochrome.

### Product Screenshot Panel
**Role:** Hero visual — the observability product UI

Full-width product mock with #111111 chrome, 2px radius, #202020 inner dividers. Tab bar (Datasets, Stream, Query, Dashboards, Monitor, Flows) in BerkeleyMono 12px with active tab underline. Blue log-bar histogram row (#2a7fff range) is the only interior color; results table below in #111111 with BerkeleyMono 12px monospaced columns and #3a3a3a row dividers.

### Arrow Decoration Field
**Role:** Background texture on hero right side

Repeating `>` glyphs in BerkeleyMono 12px weight 400 #3a3a3a, arranged in a diagonal right-pointing pattern. Fills negative space behind hero copy without adding visual weight — a terminal-style marquee that signals "streaming data".

### Tag / Pill
**Role:** Category label above card content (e.g., SAVINGS, SIMPLICITY)

Transparent background, BerkeleyMono 12px weight 400 #606060 uppercase, 0px padding. Pure typographic label, no border, no fill — the term sits above card headlines as editorial metadata.

### Pill Icon Badge
**Role:** Small circular badge or icon wrapper

9999px radius, ~24px diameter, #111111 or #202020 fill, white icon glyph centered. Used for utility icons and feature markers.

### Chevron Arrow Link
**Role:** Inline link with directional indicator

BerkeleyMono 14px weight 400 #eeeeee underlined text, followed by `→` glyph in same color. Appears at card footers ("Hapn case study →") and CTA-adjacent hints ("Book a demo →").

### Log Bar Histogram
**Role:** Data visualization in product UI and marketing

Tight rows of rectangular bars in #2a7fff or #da5c2c (the Ember accent), 4-8px tall, 2-4px gaps. Represents event volume over time. No axes labels in marketing context — the bar pattern itself is the visual.

## Do's and Don'ts

### Do
- Use BerkeleyMono for all UI text including nav, buttons, and labels — mixing proportional fonts breaks the terminal aesthetic
- Layer surfaces with #000000 → #111111 → #191919 → #202020 steps; never use box-shadow to create elevation
- Use #da5c2c (Ember) exclusively for primary action fills, log-bar visualization, and the 2px left border on case-study cards
- Set all border-radius to 2px for containers, cards, and buttons; reserve 9999px for tiny icon badges and tag pills under 32px
- Place the orange 2px left border on editorial/customer cards as a category mark — it is the only color punctuation in content blocks
- Use arrow glyphs (→) inline after action labels in BerkeleyMono to signal forward motion and reinforce the CLI cadence
- Anchor page background at pure #000000 and let paper-white (#eeeeee) text carry all hierarchy through weight (400 vs 700) and size

### Don't
- Don't introduce gradients, drop shadows beyond the single 1px/2px hairline, or colored backgrounds — the system is deliberately flat
- Don't use proportional sans-serif fonts (Inter, system-ui) for headlines, nav, or button labels — BerkeleyMono is non-negotiable for brand identity
- Don't apply #da5c2c to text, icons, or borders other than the CTA fill, log bars, and case-study left border — it loses meaning when scattered
- Don't round corners above 2px on cards, panels, or buttons — sharp geometry distinguishes this from typical SaaS soft-corner conventions
- Don't add light-theme sections or alternate surface colors — the entire product is dark-mode-only and any light surface breaks the system
- Don't use colored badge backgrounds for status (success/error/warning) — communicate state through BerkeleyMono symbols and border treatment only
- Don't place imagery or photography that isn't product UI or grayscale logo marks — the visual language is screenshots, log patterns, and arrow textures, not lifestyle photography

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Void | `#000000` | Page base, nav, terminal canvas |
| 1 | Carbon | `#111111` | Primary content surface, hero background, announcement strip, logo cells |
| 2 | Graphite | `#191919` | Elevated cards, case-study panels, inset blocks |
| 3 | Iron | `#202020` | Borders, dividers, subtle inner separation |

## Elevation

- **Buttons, small interactive surfaces:** `rgba(0, 0, 0, 0.05) 0px 1px 2px 0px`

## Imagery

Visuals are dominated by product UI screenshots — the actual observability dashboard with its blue log-bar histogram and monospaced result tables. Decorative imagery is limited to repeating `>` arrow glyphs in low-contrast #3a3a3a forming a streaming-data pattern behind the hero. Customer logos are rendered in grayscale (#eeeeee or #b4b4b4) on flat #111111 cells — no photography, no lifestyle imagery, no abstract 3D renders. The product screenshot IS the hero.

## Layout

Full-bleed dark canvas with content constrained to a ~1200px max-width centered column. The hero is a left-aligned text block (terminal prompt `~/` above a two-line monospaced headline) paired with a right-side arrow texture and a full-width product screenshot below. Section rhythm is steady: hero → product screenshot → social proof logo grid (2×6) → horizontal-scrolling case study cards (3–4 visible, overflow with ←→ chevrons) → footer. Spacing between sections is 40–64px. The case-study scroller breaks the static grid with horizontal movement, hinting at scroll-driven interaction. Navigation is a simple top bar with no sticky mega-menu — every nav link is a single line of BerkeleyMono with an optional dropdown chevron.

## Agent Prompt Guide

**Quick Color Reference**
- text: #eeeeee
- background: #000000
- surface (card): #111111
- elevated surface: #191919
- border / divider: #202020
No distinct primary action color was observed; use the extracted neutral button treatments instead of inventing a filled CTA color.
- primary action: no distinct CTA color

**3 Example Component Prompts**
2. Build a customer case-study card: #191919 background, 2px radius, 32px padding, 2px solid #da5c2c left border running full height. Customer logo top in #eeeeee. Headline BerkeleyMono 18px weight 400 #eeeeee. Quote block nested in #111111 with 16px padding, BerkeleyMono 14px weight 400 #b4b4b4. Footer row: 24px circular avatar + name BerkeleyMono 14px weight 700 #eeeeee + role 14px weight 400 #606060. Bottom link BerkeleyMono 14px underlined #eeeeee with → arrow.
3. Build a product screenshot panel: #111111 outer frame, 2px radius. Tab bar in BerkeleyMono 12px weight 400 #b4b4b4 with active tab underlined in #eeeeee. Histogram row of 4px-tall bars in #2a7fff at 2px intervals across full width. Results table in BerkeleyMono 12px weight 400 #eeeeee with #3a3a3a row dividers and #606060 timestamp column. No shadows, no rounded inner elements.

## Similar Brands

- **Vercel** — Same dark-mode developer aesthetic with monospaced accent typography and a near-black canvas, though Vercel uses Geist Mono rather than BerkeleyMono
- **Linear** — Dark-first interface with sharp 2px corners, flat surfaces, and a single warm accent color for primary actions against pure black backgrounds
- **Fly.io** — Engineering-native product UI using monospaced type throughout, near-black surfaces layered with hairline borders, and a single chromatic accent for CTAs
- **PlanetScale** — Dark-mode database product page with monospaced code-style typography, flat card surfaces, and a single warm orange accent on the primary CTA
- **Railway** — Developer-platform dark UI with terminal-inspired layouts, monospaced body text, and near-black surface layering instead of shadows

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-void: #000000;
  --color-carbon: #111111;
  --color-graphite: #191919;
  --color-iron: #202020;
  --color-slate: #3a3a3a;
  --color-pewter: #505050;
  --color-steel: #606060;
  --color-ash: #7e7e7e;
  --color-fog: #b4b4b4;
  --color-chalk: #d9d9d9;
  --color-paper: #eeeeee;
  --color-ember: #da5c2c;

  /* Typography — Font Families */
  --font-berkeleymono: 'BerkeleyMono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --text-body: 14px;
  --leading-body: 1.71;
  --text-heading-sm: 18px;
  --leading-heading-sm: 1.56;
  --text-heading: 20px;
  --leading-heading: 1.4;
  --text-heading-lg: 24px;
  --leading-heading-lg: 1.33;
  --text-display: 32px;
  --leading-display: 1.25;

  /* Typography — Weights */
  --font-weight-regular: 400;
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
  --section-gap: 40px;
  --card-padding: 32px;
  --element-gap: 16px;

  /* Border Radius */
  --radius-sm: 2px;
  --radius-full: 9999px;

  /* Named Radii */
  --radius-tags: 9999px;
  --radius-cards: 2px;
  --radius-icons: 9999px;
  --radius-inputs: 2px;
  --radius-buttons: 2px;

  /* Shadows */
  --shadow-subtle: rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;

  /* Surfaces */
  --surface-void: #000000;
  --surface-carbon: #111111;
  --surface-graphite: #191919;
  --surface-iron: #202020;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-void: #000000;
  --color-carbon: #111111;
  --color-graphite: #191919;
  --color-iron: #202020;
  --color-slate: #3a3a3a;
  --color-pewter: #505050;
  --color-steel: #606060;
  --color-ash: #7e7e7e;
  --color-fog: #b4b4b4;
  --color-chalk: #d9d9d9;
  --color-paper: #eeeeee;
  --color-ember: #da5c2c;

  /* Typography */
  --font-berkeleymono: 'BerkeleyMono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --text-body: 14px;
  --leading-body: 1.71;
  --text-heading-sm: 18px;
  --leading-heading-sm: 1.56;
  --text-heading: 20px;
  --leading-heading: 1.4;
  --text-heading-lg: 24px;
  --leading-heading-lg: 1.33;
  --text-display: 32px;
  --leading-display: 1.25;

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
  --radius-sm: 2px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-subtle: rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
}
```
