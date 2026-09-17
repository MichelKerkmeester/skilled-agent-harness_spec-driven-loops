# Factory — Style Reference
> Terminal war room at midnight. Factory is a stark black control surface where a single white card lands like a flashlit dispatch — the only object in the room is the work itself.

**Theme:** dark

Factory operates as a terminal war room: deep black canvas, weight-400 Geist type pressed tight with negative tracking, and generous negative space that lets two functional accents — signal orange and metric green — speak above the noise. The signature move is the light card floating on near-black ground (#eeeeee panels on #101010 canvas), creating stark figure/ground contrast rather than soft elevation. Almost all interaction is carried by monochrome surfaces; chromatic color is reserved for live data states and status pulses, never decoration. Components sit flat with minimal radii, thin 1px borders, and zero shadow dependency — the design earns its depth through contrast and spacing rhythm, not blur or glow.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Obsidian Canvas | `#101010` | `--color-obsidian-canvas` | Page background, footer base — the void everything else is measured against |
| Carbon Lift | `#1d1a18` | `--color-carbon-lift` | Raised dark surfaces, nav wells, button fills — one step up from canvas for interactive depth |
| Ash Stroke | `#3d3a39` | `--color-ash-stroke` | Hairline borders, ghost button outlines, separator lines |
| Graphite Mid | `#4d4947` | `--color-graphite-mid` | Mid-tone fills for chart bodies, secondary surfaces, neutral data visualization |
| Warm Granite | `#8a8380` | `--color-warm-granite` | Muted body text, secondary copy, inactive labels — warm gray to soften the black |
| Pale Stone | `#b8b3b0` | `--color-pale-stone` | Tertiary text, section eyebrows, subdued supporting copy |
| Bone | `#eeeeee` | `--color-bone` | Primary text, light card surfaces, the single bright figure on dark ground |
| Chalk | `#fafafa` | `--color-chalk` | High-emphasis light button fill, log-in button, elevated neutral surface |
| Signal Orange | `#ee6018` | `--color-signal-orange` | Orange decorative accent for icons, marks, and small graphic details |
| Metric Green | `#a0ca92` | `--color-metric-green` | Green decorative accent for icons, marks, and small graphic details |

## Tokens — Typography

### Geist — All interface text — body, headings, buttons, nav, hero. Used at weight 400 almost universally; weight 500 is reserved for emphasis (e.g. footer heading). The flat 400-only treatment is a signature: authority is implied by size and tracking, not by bold weight. · `--font-geist`
- **Substitute:** Inter, system-ui
- **Weights:** 400, 500
- **Sizes:** 12, 14, 16, 36, 44, 72
- **Line height:** 1.0–1.5
- **Letter spacing:** -0.0400em, -0.0310em, -0.0250em
- **Role:** All interface text — body, headings, buttons, nav, hero. Used at weight 400 almost universally; weight 500 is reserved for emphasis (e.g. footer heading). The flat 400-only treatment is a signature: authority is implied by size and tracking, not by bold weight.

### Geist Mono — Captions, labels, status tags, metric units — always uppercase 12px with tight tracking. Carries the 'terminal' voice that distinguishes engineering surfaces from marketing surfaces. · `--font-geist-mono`
- **Substitute:** JetBrains Mono, IBM Plex Mono, ui-monospace
- **Weights:** 400
- **Sizes:** 12, 14, 16
- **Line height:** 1.0–1.2
- **Letter spacing:** -0.0200em
- **Role:** Captions, labels, status tags, metric units — always uppercase 12px with tight tracking. Carries the 'terminal' voice that distinguishes engineering surfaces from marketing surfaces.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1 | -0.24px | `--text-caption` |
| body-sm | 14px | 1.43 | — | `--text-body-sm` |
| body | 16px | 1.5 | — | `--text-body` |
| heading | 36px | 1.1 | -1.12px | `--text-heading` |
| heading-lg | 44px | 1.12 | -1.1px | `--text-heading-lg` |
| display | 72px | 1 | -2.88px | `--text-display` |

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
| 56 | 56px | `--spacing-56` |
| 80 | 80px | `--spacing-80` |
| 96 | 96px | `--spacing-96` |
| 120 | 120px | `--spacing-120` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 3px |
| cards | 10px |
| buttons | 3px |
| largePanels | 20px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 96px
- **Card padding:** 24px
- **Element gap:** 24px

## Components

### Top Navigation Bar
**Role:** Persistent header across all pages

Transparent over #101010 canvas. Height ~64px. Left-aligned wordmark 'FACTORY' in #eeeeee, 12px Geist Mono uppercase, letter-spacing wide. Nav links (Product, Enterprise, Pricing, News, Company, Careers) in #eeeeee at 14px Geist weight 400, uppercase. Log In = #fafafa fill, 3px radius, #101010 text, 0 14px padding. Contact Sales = ghost text link with arrow, transparent fill, 1px #3d3a39 border, 0px radius, 24px vertical padding.

### Dark Filled Button
**Role:** Primary interactive control in dark contexts

Background #1f1d1c, text #eeeeee, 3px border-radius, 0 14px padding, Geist 14px weight 400. No border. Used for actions that commit within a dark surface.

### Light Filled Button (Log In)
**Role:** High-emphasis auth trigger

Background #fafafa, text #eeeeee (note: on the light fill, text is inverted to dark in practice — #101010), 3px border-radius, 0 14px padding. The only chromatic-contrast button in the system; appears once in the nav.

### Ghost Text Link
**Role:** Secondary navigation, in-text links, 'Read More' affordances

Transparent background, 1px #3d3a39 border, 0px radius (flat), 24px vertical padding, #eeeeee text. Behaves like a typographic button — no fill ever appears on hover, only text/border color shift to #fafafa.

### Light Surface Card
**Role:** Featured content panels, CTAs, case studies — the figure on dark ground

Background #eeeeee, 10px border-radius, 24px padding all sides, no shadow. Contains dark text (#101010 or #060505) inside. Often carries a subtle grain/noise texture overlay. This is the system's primary way to create visual hierarchy on dark pages.

### Dashboard Frame
**Role:** Product hero — the live software factory preview

macOS window chrome (traffic-light dots) on a #0d0d0d panel with 10px radius. Internal content is a dark grid of metric tiles with 1px #1d1a18 dividers. Header bar: dark fill, Geist Mono 12px uppercase for window title, status dot in #ee6018.

### Metric Tile
**Role:** Individual data cell inside the dashboard

No background, 1px #1d1a18 hairline divider, 20px padding. Label: Geist Mono 12px uppercase #b8b3b0, tracking -0.24px. Value: Geist 36px weight 400, #eeeeee, tracking -1.12px. Sparkline below: 40px tall, 1px stroke in #ee6018 or #a0ca92.

### CTA Section Card
**Role:** Conversion closer at page bottom

Light card (#eeeeee) ~480px wide, 10px radius, 24px padding, optional grain texture. Eyebrow: Geist Mono 12px uppercase, #ee6018 dot + #101010 text. Headline: Geist 36px weight 400, #101010. CTA: dark filled button using #101010 fill, #eeeeee text, 3px radius.

### Status Pulse
**Role:** Inline 'live' indicator on logos, avatars, section headers

6px filled circle in #ee6018 with optional 1px stroke. Sits immediately before label text. No animation required, but pairs with marquee/animation in the marquee logo strip.

### Logo Strip (Trust Bar)
**Role:** Social proof band beneath hero

Single row of partner wordmarks on #101010 canvas, all rendered in #8a8380 at consistent visual weight. No card backgrounds, no dividers — just the wordmarks floating in negative space. Separated from surrounding sections by 96px vertical breathing room.

### Feature Card Row
**Role:** Multi-card sections explaining product capabilities

Dark cards (transparent on #101010) with 1px #1d1a18 hairline border, 10px radius, 20px padding. 'Read More →' ghost link in footer. No card background fill — the card is implied by the border, not the surface.

### Footer
**Role:** Site footer with link columns and brand mark

Background #101010, 96px+ vertical padding. Headings: Geist Mono 12px uppercase #eeeeee. Links: 14px Geist weight 400 #8a8380. No dividers between columns — generous column gap (24–36px) does the separation.

## Do's and Don'ts

### Do
- Keep the canvas #101010 on every section. Light cards (#eeeeee) are the only objects allowed to be bright.
- Use Geist 400 for everything. Reach for weight 500 only when a label must dominate a dense surface (footer headings, key CTAs).
- Apply negative letter-spacing proportionally to size: -0.04em at 72px, -0.025em at 44px, -0.02em at 12px. Display type earns its weight through tightness, not boldness.
- Reserve #ee6018 for live status, build-state indicators, and accent strokes in data charts. Never use it as a button fill.
- Set border-radius to 3px on buttons and nav elements, 10px on cards, 20px on the largest panels. Do not round corners more than this — the system is not soft.
- Build depth through #eeeeee-on-#101010 contrast and 96px+ section gaps. Do not introduce drop shadows or blur to fake elevation.
- Use Geist Mono 12px uppercase for eyebrows, status labels, and column headers. This is the system's secondary voice and the fastest way to signal 'instrument, not marketing'.

### Don't
- Do not introduce additional accent colors. The palette is two neutrals (#101010, #eeeeee), one warm gray for muted text (#8a8380), and two functional accents (#ee6018, #a0ca92). Anything else is noise.
- Do not use weight 600+ or bold for headings. The system speaks at weight 400 with tight tracking — bolding breaks the voice.
- Do not put #ee6018 or #a0ca92 on button backgrounds, card surfaces, or large text fills. They are data-voice colors, not chrome colors.
- Do not use line-height above 1.5. Display sizes use lh=1; body sits at 1.5. Anything looser makes the page feel editorial rather than technical.
- Do not add drop shadows, glows, or blurs to cards, buttons, or modals. The system's elevation is contrast, not depth-of-field.
- Do not mix in serif typefaces or display fonts. Geist and Geist Mono only.
- Do not fill buttons with brand color. The primary action is a neutral dark fill (#1f1d1c) or a neutral light fill (#fafafa) — chromatic CTAs would break the monochrome chrome.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Obsidian Canvas | `#101010` | Page base, hero, all non-card sections |
| 1 | Carbon Lift | `#1d1a18` | Nav well, inline buttons, subtle panel elevation |
| 2 | Bone Card | `#eeeeee` | Light cards on dark ground — the signature figure/ground move |
| 3 | Chalk Elevated | `#fafafa` | Light button fill, top of the light surface stack |

## Elevation

No shadows. Depth is built through figure/ground contrast — a #eeeeee card landing on a #101010 canvas does the work a drop shadow would do in other systems. The only box-shadow token observed is a 1px hairline at near-black, never a diffuse glow. This keeps the interface flat and instrument-like.

## Imagery

Imagery is minimal and product-led. The dominant visual is a photorealistic macOS dashboard screenshot serving as the hero — a real-feeling terminal panel with traffic-light chrome, monospaced column headers, and live sparklines in orange and green. There is no lifestyle photography, no people, no abstract gradients. Decorative texture on light cards is a subtle film-grain noise overlay, not an illustration. Logos in the trust bar are rendered as monochrome wordmarks, not as color photos. The brand relies on UI-in-UI: showing the product is the imagery.

## Layout

Full-bleed #101010 canvas at all times — no light body background. Max content width ~1200px, centered. Hero is a 2-column split: left third holds the headline + supporting copy + button row, right two-thirds holds the dashboard screenshot at near-1:1 scale. Section rhythm: dark band → logo strip → dark band with feature cards → dark band with CTA card. Vertical spacing between sections is 96px+ — the page breathes. Cards in grid layouts are separated by 24px gaps, never touching. Navigation is a single sticky top bar, no sidebar, no mega-menu — the surface stays uncluttered.

## Agent Prompt Guide

**Quick Color Reference**
- canvas: #101010
- text: #eeeeee
- muted text: #8a8380
- card surface: #eeeeee
- accent (live status / data signal): #ee6018
- accent (positive metric / trend): #a0ca92
- primary action: #1d1a18 (filled action)

**Example Component Prompts**
1. *Hero section*: Full-bleed #101010 background, max-width 1200px centered. Headline at 72px Geist weight 400, #eeeeee, letter-spacing -2.88px, line-height 1. Supporting copy at 16px Geist weight 400, #8a8380. Two buttons inline: a dark filled button (#1f1d1c, #eeeeee text, 3px radius, 0 14px padding) followed by a ghost link with arrow (transparent, 1px #3d3a39 border, 0px radius, 24px vertical padding).
2. Create a Primary Action Button: #1d1a18 background, #eeeeee text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.
3. *Dashboard metric tile*: no background, 1px #1d1a18 bottom border, 20px padding. Label: Geist Mono 12px uppercase #b8b3b0. Value: Geist 36px weight 400, #eeeeee, letter-spacing -1.12px. Sparkline: 40px tall, 1px stroke, color #ee6018 (negative trend) or #a0ca92 (positive trend).
4. *Trust logo strip*: full-width #101010 band, 96px vertical padding, single row of 8 partner wordmarks rendered in #8a8380, evenly distributed with 24px+ gaps. No card backgrounds, no dividers.
5. *Top nav bar*: transparent on #101010, ~64px tall. Wordmark left: 'FACTORY' Geist Mono 12px uppercase #eeeeee. Nav center/right: Product, Enterprise, Pricing, News, Company, Careers in Geist 14px weight 400 #eeeeee uppercase. Log In button: #fafafa fill, #101010 text, 3px radius. Contact Sales: ghost text link with arrow.

## Motion Philosophy

Transitions are short and mechanical: 0.15s–0.2s with cubic-bezier(0.4, 0, 0.2, 1) easing — the feel of a CLI tool, not a marketing site. Color, background-color, border-color, and stroke all transition together so state changes feel like a single switch flipping, not a layered animation. Named motion (marquee-scroll, sfDashboardFrameIn) appears sparingly: a slow logo marquee and a single dashboard entrance. Avoid spring physics, parallax, or scroll-driven effects — the surface should feel still and precise.

## Voice & Type Treatment

Two voices, one family. Geist 400 carries all marketing and body copy — flat, calm, undecorated. Geist Mono 12px uppercase carries all instrument labels: column headers, status tags, 'BUILD WITH US', nav items. This split is structural: when a user sees Mono, they know they are looking at a system surface, not a page surface. Maintain this discipline even when extending the product.

## Similar Brands

- **Linear** — Same monochrome-dark canvas, weight-400 display type with tight negative tracking, and one restrained accent (Linear's purple vs Factory's orange) reserved for state and status, never decoration.
- **Vercel** — Identical figure/ground strategy: pitch-black canvas, one bright card or screenshot as hero, Geist-family type at flat weight, no drop shadows — depth earned through contrast.
- **Resend** — Shares the terminal-warm aesthetic — warm grays (#8a8380 class) instead of cold, Geist Mono labels, minimal radii (3–10px), and chromatic accents used only as functional signal in product UI.
- **Cursor** — Developer-tool dark surface with Geist-weight typography, dashboard hero pattern showing the product in a windowed UI, and a single warm accent for active states.
- **Railway** — Same instrument-panel sensibility — dark canvas, monospaced eyebrows, metric tiles with live data, and an anti-decorative stance that treats color as data not chrome.

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-obsidian-canvas: #101010;
  --color-carbon-lift: #1d1a18;
  --color-ash-stroke: #3d3a39;
  --color-graphite-mid: #4d4947;
  --color-warm-granite: #8a8380;
  --color-pale-stone: #b8b3b0;
  --color-bone: #eeeeee;
  --color-chalk: #fafafa;
  --color-signal-orange: #ee6018;
  --color-metric-green: #a0ca92;

  /* Typography — Font Families */
  --font-geist: 'Geist', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-geist-mono: 'Geist Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1;
  --tracking-caption: -0.24px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.43;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-heading: 36px;
  --leading-heading: 1.1;
  --tracking-heading: -1.12px;
  --text-heading-lg: 44px;
  --leading-heading-lg: 1.12;
  --tracking-heading-lg: -1.1px;
  --text-display: 72px;
  --leading-display: 1;
  --tracking-display: -2.88px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;

  /* Spacing */
  --spacing-unit: 8px;
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-56: 56px;
  --spacing-80: 80px;
  --spacing-96: 96px;
  --spacing-120: 120px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 96px;
  --card-padding: 24px;
  --element-gap: 24px;

  /* Border Radius */
  --radius-sm: 3px;
  --radius-lg: 10px;
  --radius-2xl: 20px;

  /* Named Radii */
  --radius-nav: 3px;
  --radius-cards: 10px;
  --radius-buttons: 3px;
  --radius-largepanels: 20px;

  /* Surfaces */
  --surface-obsidian-canvas: #101010;
  --surface-carbon-lift: #1d1a18;
  --surface-bone-card: #eeeeee;
  --surface-chalk-elevated: #fafafa;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-obsidian-canvas: #101010;
  --color-carbon-lift: #1d1a18;
  --color-ash-stroke: #3d3a39;
  --color-graphite-mid: #4d4947;
  --color-warm-granite: #8a8380;
  --color-pale-stone: #b8b3b0;
  --color-bone: #eeeeee;
  --color-chalk: #fafafa;
  --color-signal-orange: #ee6018;
  --color-metric-green: #a0ca92;

  /* Typography */
  --font-geist: 'Geist', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-geist-mono: 'Geist Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1;
  --tracking-caption: -0.24px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.43;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-heading: 36px;
  --leading-heading: 1.1;
  --tracking-heading: -1.12px;
  --text-heading-lg: 44px;
  --leading-heading-lg: 1.12;
  --tracking-heading-lg: -1.1px;
  --text-display: 72px;
  --leading-display: 1;
  --tracking-display: -2.88px;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-56: 56px;
  --spacing-80: 80px;
  --spacing-96: 96px;
  --spacing-120: 120px;

  /* Border Radius */
  --radius-sm: 3px;
  --radius-lg: 10px;
  --radius-2xl: 20px;
}
```
