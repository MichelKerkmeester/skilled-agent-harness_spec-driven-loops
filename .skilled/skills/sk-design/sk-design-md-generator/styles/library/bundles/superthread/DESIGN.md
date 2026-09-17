# Superthread — Style Reference
> Whiteboard confidence with amber highlighter energy. Superthread feels like a well-organized notebook page — dark ink lines, ample white space, and a single warm yellow mark that signals what matters.

**Theme:** light

Superthread runs on a whiteboard-meets-editorial visual logic: a near-white canvas, one warm amber accent that feels like a highlighter swipe, and a very heavy reliance on hard 1px dark borders to define structure instead of shadows or fills. The dark slate (#1d2939) carries almost all type and iconography, giving the system a confident, ink-on-paper weight; the amber only appears as a functional accent on the primary CTA and as the underline brushstroke beneath the italic word in the headline. Components are compact and border-driven: cards and buttons share a 10px radius, surfaces stay nearly flat with minimal elevation, and the yellow→gold gradient on the CTA creates a single source of warmth in an otherwise monochromatic page. Typography carries the personality — Vela Sans at 80px display weight with slight negative tracking, the word "done" set in italic with a hand-drawn yellow underline as the brand's signature gesture. Density is compact, gaps hover around 10–15px between elements, and the page breathes in large 64–80px section bands.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Ink Black | `#000000` | `--color-ink-black` | Hairline borders, dividers, and icon strokes — the structural skeleton of every card, board, and list element. Used at full opacity in 1px widths to define edges instead of relying on shadows |
| Slate Ink | `#1d2939` | `--color-slate-ink` | Primary headings, body copy, and filled button backgrounds — the dominant near-black that gives the system its editorial weight. Filled CTA buttons and active tab states use this as the base fill |
| Canvas White | `#ffffff` | `--color-canvas-white` | Card and elevated surface backgrounds sitting above the page canvas |
| Page Mist | `#f9fafb` | `--color-page-mist` | Page-level background and section bands, creating a soft off-white canvas that lifts white cards without harsh contrast |
| Dust Border | `#e4e7ec` | `--color-dust-border` | Secondary borders and neutral button backgrounds where heavy ink-black would be too aggressive — used on ghost controls and subtle dividers |
| Graphite Text | `#667085` | `--color-graphite-text` | Secondary and muted text — subheadings, helper copy, metadata, and inactive nav items |
| Midnight Heading | `#101828` | `--color-midnight-heading` | Deep accent for high-emphasis headings and dark surface text where extra weight is needed beyond the default slate |
| Indigo Whisper | `#1d2a53` | `--color-indigo-whisper` | Subtle violet-leaning tint used for soft decorative backgrounds and link accents — adds a cold counterpoint to the warm amber without competing with the primary accent |
| Amber Mark | `#ffaa00` | `--color-amber-mark` | Yellow accent for outlined action borders, linked labels, and lightweight interactive emphasis. Do not promote it to the primary CTA color |
| Highlight Gradient | `linear-gradient(83deg, #ffcc34 0%, #ffaa00 100%)` | `--color-highlight-gradient` | Supporting palette color for small decorative accents when the core palette needs contrast. Do not promote it to the primary CTA color |

## Tokens — Typography

### sans-serif — sans-serif — detected in extracted data but not described by AI · `--font-sans-serif`
- **Weights:** 400, 500, 600
- **Sizes:** 12px, 16px
- **Line height:** 1.2
- **Role:** sans-serif — detected in extracted data but not described by AI

### Vela Sans — Primary typeface across all interface text — navigation, body, headings, and display. The 80px display weight with -0.01em tracking and the italic variant for emphasis words are the system's signature voice. Custom glyph alternates (blwf, cv03, cv04, cv09, cv11) give it a humanist warmth that a generic grotesque lacks. · `--font-vela-sans`
- **Substitute:** Inter
- **Weights:** 400, 500, 600
- **Sizes:** 12, 14, 16, 18, 20, 24, 32, 80
- **Line height:** 1.10–1.70
- **Letter spacing:** -0.01em at 32px and above; 0.02em at 12–16px
- **OpenType features:** `"blwf", "cv03", "cv04", "cv09", "cv11"`
- **Role:** Primary typeface across all interface text — navigation, body, headings, and display. The 80px display weight with -0.01em tracking and the italic variant for emphasis words are the system's signature voice. Custom glyph alternates (blwf, cv03, cv04, cv09, cv11) give it a humanist warmth that a generic grotesque lacks.

### Noto Sans — Secondary fallback for body copy and list content when Vela Sans is unavailable — a safety net that preserves rhythm but loses the custom personality. · `--font-noto-sans`
- **Substitute:** Inter
- **Weights:** 400, 500, 700
- **Sizes:** 16, 18
- **Line height:** 1.40
- **Role:** Secondary fallback for body copy and list content when Vela Sans is unavailable — a safety net that preserves rhythm but loses the custom personality.

### Inter (gs-inter-2020-11) — Small-label and button text rendering at compact sizes; brings tabular clarity to tags, badges, and dense UI rows. · `--font-inter-gs-inter-2020-11`
- **Substitute:** Inter
- **Weights:** 400, 600, 700
- **Sizes:** 12, 15
- **Line height:** 1.20
- **Role:** Small-label and button text rendering at compact sizes; brings tabular clarity to tags, badges, and dense UI rows.

### SF Pro Display — Apple-platform native rendering for cards and system surfaces — supplements Vela Sans on macOS/iOS contexts. · `--font-sf-pro-display`
- **Substitute:** system-ui
- **Weights:** 400, 500, 600, 700
- **Sizes:** 12, 16
- **Line height:** 1.20
- **Role:** Apple-platform native rendering for cards and system surfaces — supplements Vela Sans on macOS/iOS contexts.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.2 | 0.24px | `--text-caption` |
| body-sm | 14px | 1.7 | 0.28px | `--text-body-sm` |
| body | 16px | 1.5 | — | `--text-body` |
| subheading | 18px | 1.4 | — | `--text-subheading` |
| heading-sm | 20px | 1.4 | — | `--text-heading-sm` |
| heading | 24px | 1.33 | — | `--text-heading` |
| heading-lg | 32px | 1.2 | -0.32px | `--text-heading-lg` |
| display | 80px | 1.1 | -0.8px | `--text-display` |

## Tokens — Spacing & Shapes

**Density:** compact

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 5 | 5px | `--spacing-5` |
| 6 | 6px | `--spacing-6` |
| 7 | 7px | `--spacing-7` |
| 8 | 8px | `--spacing-8` |
| 10 | 10px | `--spacing-10` |
| 12 | 12px | `--spacing-12` |
| 13 | 13px | `--spacing-13` |
| 15 | 15px | `--spacing-15` |
| 16 | 16px | `--spacing-16` |
| 18 | 18px | `--spacing-18` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 25 | 25px | `--spacing-25` |
| 30 | 30px | `--spacing-30` |
| 40 | 40px | `--spacing-40` |

### Border Radius

| Element | Value |
|---------|-------|
| tabs | 10px |
| tags | 50px |
| cards | 10px |
| inputs | 10px |
| buttons | 10px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| xl | `rgba(0, 0, 0, 0.22) 0px 4px 30px 0px` | `--shadow-xl` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 64-80px
- **Card padding:** 20px
- **Element gap:** 10-15px

## Components

### Primary CTA Button (Amber)
**Role:** Top-of-page conversion action — 'Start for free'

Filled amber button with the #ffcc34→#ffaa00 gradient at 83deg. Text in #1d2939 at 16px Vela Sans weight 600. 10px border radius. Padding 13px vertical, 20px horizontal. Carries a soft rgba(0,0,0,0.22) 0px 4px 30px shadow for warm lift. Trailing arrow icon in the same dark ink.

### Primary CTA Button (Slate)
**Role:** Secondary conversion on dark or dense contexts

Filled #1d2939 button with white text. 10px radius. Same 13px/20px padding. Used when the amber accent would compete with adjacent highlight elements.

### Ghost Nav Link
**Role:** Top navigation items (Product, Solutions, Customers, Pricing, Resources)

No background, no border. Text in #1d2939 at 16px Vela Sans weight 500. 10px vertical padding. Caret icon for dropdown items in the same ink color.

### Text Link Button (Login)
**Role:** Low-emphasis account access in the nav bar

Plain text link in #1d2939, no underline, no border. 16px Vela Sans weight 500. Right-aligned in the nav.

### Hero Display Headline
**Role:** The signature 'Where work gets done' headline

80px Vela Sans weight 600 in #1d2939, line-height 1.10, letter-spacing -0.01em. Centered. The word 'done' is set in italic with a hand-drawn amber underline (slightly offset, irregular width) using #ffaa00 — this yellow brushstroke is the brand's defining gesture.

### Hero Subtext
**Role:** Supporting copy beneath the headline

18px Vela Sans weight 400 in #1d2939, line-height 1.40. Two centered lines. Comfortable reading width, not a full bleed.

### Tab Strip
**Role:** Product feature navigation (Tasks / Projects / Docs / Meeting agent / Saved filters / Sprints)

Horizontal row of text tabs on a white card with a 1px #000000 border and 10px radius. Active tab ('Tasks') uses a filled #1d2939 background with white text, 10px radius. Inactive tabs are plain #1d2939 text at 16px weight 500.

### Kanban Card (Product Preview)
**Role:** Card thumbnails shown in the hero product screenshot

White background, 1px #000000 border, 10px radius. Each card contains a colored header image (content-driven, not part of the token system), a title in Vela Sans weight 500 at 16px, a colored category pill, and a small thumbnail. Cards sit on a light gray (#f9fafb) board background with visible column dividers.

### Logo Bar
**Role:** Social proof row — 'Superthread is used at companies of all sizes'

Section heading centered in 20px Vela Sans weight 500, #1d2939. Logos below in a single horizontal row, all rendered in monochrome dark gray or black, evenly spaced. No card containers, no borders — logos float directly on the canvas.

### Section Container
**Role:** Generic content band wrapper

Full-width bands with #f9fafb or #ffffff background. Inner content constrained to 1200px max-width, centered. Vertical padding 64–80px. No visible card chrome — sections flow into each other with whitespace and background shifts.

### Brand Wordmark
**Role:** Logo lockup in the navigation header

Dark ink icon (a rounded square mark) followed by 'superthread.' in Vela Sans weight 600 at ~20px, #1d2939. Period included as a literal character. Left-aligned in the header.

### Filter Chip / Tag
**Role:** Inline labels on product cards and boards

Small pill with 50px border radius. 2px vertical / 8px horizontal padding. Background tinted to match content category (content-driven colors). Text in Vela Sans weight 500 at 12px.

## Do's and Don'ts

### Do
- Use the amber→gold gradient (linear-gradient(83deg, #ffcc34 0%, #ffaa00 100%)) for exactly one CTA per screen — never two competing warm actions on the same view.
- Set 1px solid #000000 borders on all cards, tabs, and structural containers — the system reads as flat editorial ink, not floating material.
- Use 10px border radius consistently for cards, buttons, and inputs — only tags and pill-shaped elements get 50px.
- Apply the italic amber-underlined treatment to one emphasis word per hero headline — the yellow brushstroke is the brand's signature, not a decoration you scatter.
- Set display headlines at 80px with -0.01em letter-spacing in Vela Sans weight 600; the tight tracking is part of the voice.
- Keep section backgrounds as a two-tone alternation between #f9fafb and #ffffff, with 64–80px vertical padding between bands.
- Limit accent color usage: amber appears on the primary CTA, the headline underline, and functional highlights — everything else stays in the slate-and-ink palette.

### Don't
- Do not introduce a drop shadow on cards or panels — structure is defined by borders, not elevation. The single exception is the warm bloom on the amber CTA.
- Do not use the amber gradient for secondary buttons, links, or informational chips — amber is a single-action signal, not a decoration.
- Do not use italic outside the one-word emphasis pattern in headlines — italic everywhere dilutes the signature gesture.
- Do not set borders in #e4e7ec or light grays on primary cards — the heavy #000000 1px border is the structural language; use Dust Border only for ghost controls and subtle dividers.
- Do not use display sizes below 32px or above 80px — the type scale is deliberately narrow to keep headlines commanding and body text compact.
- Do not add a second warm color to the palette — the system's power comes from a single warm accent against monochrome ink.
- Do not use rounded shapes above 10px for rectangular components — the 10px radius is the system's softness ceiling, reserved for tags to break the pattern.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Page Canvas | `#f9fafb` | Base page background — soft off-white for full-page sections and the body canvas. |
| 1 | Card Surface | `#ffffff` | Product cards, navigation menus, and elevated content panels sit on pure white above the canvas. |
| 2 | Subtle Band | `#eeeeee` | Light tonal banding for alternating section backgrounds where soft visual separation is needed without borders. |

## Elevation

- **Product screenshot card:** `rgba(204, 205, 206, 1) 0px 0px 0px 1px — hairline outer ring rather than a drop shadow`
- **Primary CTA button:** `rgba(0, 0, 0, 0.22) 0px 4px 30px 0px — soft warm bloom that lifts the amber button off the page`

## Imagery

The hero centers on a product screenshot rendered inside a browser-chrome frame — the UI itself is the hero image. The screenshot shows a Kanban board with colorful content cards (brand graphics, product photos, colored backgrounds) on a light gray board surface. A soft amber radial glow sits behind the browser frame on the canvas, tying the product back to the CTA color. Below the hero, the logo bar uses monochrome black logos on plain white — no lifestyle photography, no abstract graphics. The visual language is product-first: the interface IS the marketing. Photography and illustration are absent from chrome; color and content live inside the product cards shown in the screenshot.

## Layout

The page follows a centered, max-width contained layout at 1200px with a full-width canvas. The hero is a centered text stack (headline → subtext → CTA → tab strip → product screenshot) stacked vertically, not a split text+image layout. Below the hero, sections alternate between #f9fafb and #ffffff backgrounds in horizontal bands, each centered and vertically spaced 64–80px apart. The logo bar sits in its own quiet band with no container card. Navigation is a flat top bar with logo left, links center-left, login + amber CTA right — no sticky behavior, no mega-menu visible. Density is compact: product cards in the screenshot are tightly packed, the tab strip is inline, and the overall rhythm is dense information punctuated by large breathing bands.

## Agent Prompt Guide

## Quick Color Reference
- text: #1d2939
- background: #f9fafb (page) / #ffffff (card)
- border: #000000 (primary) / #e4e7ec (secondary)
- accent: #ffaa00 (amber — highlight only)
- primary action: #1d2939 (filled action)

## Example Component Prompts
1. **Hero headline block**: White (#f9fafb) canvas, centered. Headline at 80px Vela Sans weight 600, #1d2939, letter-spacing -0.8px, line-height 1.10. One emphasis word set in italic with a hand-drawn #ffaa00 underline beneath it. Subtext at 18px Vela Sans weight 400, #1d2939, two centered lines, line-height 1.40.

2. Create a Primary Action Button: #1d2939 background, #ffffff text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.

3. **Tab strip (product feature selector)**: White (#ffffff) card, 1px solid #000000 border, 10px radius. Horizontal row of tabs, gap 10px. Active tab: filled #1d2939 background, white text, 10px radius. Inactive tabs: transparent background, #1d2939 text at 16px Vela Sans weight 500.

4. **Kanban card**: White (#ffffff) background, 1px solid #000000 border, 10px radius. Colored header image strip at top (content-driven). Card title at 16px Vela Sans weight 500, #1d2939. Category tag below title as a pill (50px radius) with tinted background. Card sits on #f9fafb board surface with visible column dividers.

5. **Logo bar band**: Full-width section on #ffffff background, 64px vertical padding. Centered heading 'Superthread is used at companies of all sizes' at 20px Vela Sans weight 500, #1d2939. Below: single horizontal row of monochrome black logos, evenly spaced, no card containers.

## Similar Brands

- **Notion** — Same border-driven flat aesthetic with monochrome palette and a single warm accent color used sparingly for emphasis.
- **Linear** — Similar editorial weight in typography, compact density, and reliance on hard borders rather than shadows to define structure.
- **Height** — Same Kanban-first product framing with colorful content cards on a light board surface and minimal chrome around the product.
- **Coda** — Similar large display headline treatment, compact UI density, and a restrained palette that lets product screenshots carry the visual weight.
- **Tana** — Same whiteboard-meets-editorial feel with a single accent color and hairline borders as the primary structural device.

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-ink-black: #000000;
  --color-slate-ink: #1d2939;
  --color-canvas-white: #ffffff;
  --color-page-mist: #f9fafb;
  --color-dust-border: #e4e7ec;
  --color-graphite-text: #667085;
  --color-midnight-heading: #101828;
  --color-indigo-whisper: #1d2a53;
  --color-amber-mark: #ffaa00;
  --color-highlight-gradient: #ffcc34;
  --gradient-highlight-gradient: linear-gradient(83deg, #ffcc34 0%, #ffaa00 100%);

  /* Typography — Font Families */
  --font-sans-serif: 'sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-vela-sans: 'Vela Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-noto-sans: 'Noto Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter-gs-inter-2020-11: 'Inter (gs-inter-2020-11)', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-sf-pro-display: 'SF Pro Display', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.2;
  --tracking-caption: 0.24px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.7;
  --tracking-body-sm: 0.28px;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 18px;
  --leading-subheading: 1.4;
  --text-heading-sm: 20px;
  --leading-heading-sm: 1.4;
  --text-heading: 24px;
  --leading-heading: 1.33;
  --text-heading-lg: 32px;
  --leading-heading-lg: 1.2;
  --tracking-heading-lg: -0.32px;
  --text-display: 80px;
  --leading-display: 1.1;
  --tracking-display: -0.8px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-5: 5px;
  --spacing-6: 6px;
  --spacing-7: 7px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-13: 13px;
  --spacing-15: 15px;
  --spacing-16: 16px;
  --spacing-18: 18px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-25: 25px;
  --spacing-30: 30px;
  --spacing-40: 40px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 64-80px;
  --card-padding: 20px;
  --element-gap: 10-15px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 10px;
  --radius-2xl: 16px;
  --radius-full: 50px;

  /* Named Radii */
  --radius-tabs: 10px;
  --radius-tags: 50px;
  --radius-cards: 10px;
  --radius-inputs: 10px;
  --radius-buttons: 10px;

  /* Shadows */
  --shadow-xl: rgba(0, 0, 0, 0.22) 0px 4px 30px 0px;

  /* Surfaces */
  --surface-page-canvas: #f9fafb;
  --surface-card-surface: #ffffff;
  --surface-subtle-band: #eeeeee;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-ink-black: #000000;
  --color-slate-ink: #1d2939;
  --color-canvas-white: #ffffff;
  --color-page-mist: #f9fafb;
  --color-dust-border: #e4e7ec;
  --color-graphite-text: #667085;
  --color-midnight-heading: #101828;
  --color-indigo-whisper: #1d2a53;
  --color-amber-mark: #ffaa00;
  --color-highlight-gradient: #ffcc34;

  /* Typography */
  --font-sans-serif: 'sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-vela-sans: 'Vela Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-noto-sans: 'Noto Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter-gs-inter-2020-11: 'Inter (gs-inter-2020-11)', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-sf-pro-display: 'SF Pro Display', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.2;
  --tracking-caption: 0.24px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.7;
  --tracking-body-sm: 0.28px;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 18px;
  --leading-subheading: 1.4;
  --text-heading-sm: 20px;
  --leading-heading-sm: 1.4;
  --text-heading: 24px;
  --leading-heading: 1.33;
  --text-heading-lg: 32px;
  --leading-heading-lg: 1.2;
  --tracking-heading-lg: -0.32px;
  --text-display: 80px;
  --leading-display: 1.1;
  --tracking-display: -0.8px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-5: 5px;
  --spacing-6: 6px;
  --spacing-7: 7px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-13: 13px;
  --spacing-15: 15px;
  --spacing-16: 16px;
  --spacing-18: 18px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-25: 25px;
  --spacing-30: 30px;
  --spacing-40: 40px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 10px;
  --radius-2xl: 16px;
  --radius-full: 50px;

  /* Shadows */
  --shadow-xl: rgba(0, 0, 0, 0.22) 0px 4px 30px 0px;
}
```
