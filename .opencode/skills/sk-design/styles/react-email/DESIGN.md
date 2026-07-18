# React Email — Style Reference
> Obsidian workshop for code artisans — deep matte black, hairline white edges, and one cyan beacon glowing through developer glass.

**Theme:** dark

React Email presents itself as an obsidian workshop where developer tools feel handcrafted: deep black canvases, precise white typography, and a single cyan accent that glows through product imagery like light through aquarium glass. The visual rhythm is editorial — generous section gaps, left-aligned text blocks, and right-aligned product visuals that drift in and out of focus through subtle radial glows. Components feel engineered rather than decorated: thin hairline borders, inset white edge highlights that read as machined metal, and near-zero elevation. Code is first-class citizen — monospace badges sit inline with CTAs, terminal commands share visual weight with button labels, and the Inter / CommitMono pairing bridges marketing copy and developer documentation without tonal shift.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Obsidian | `#000000` | `--color-obsidian` | Page canvas, primary background — the floor everything sits on |
| Carbon | `#0f0f10` | `--color-carbon` | Card and elevated surface — one step up from canvas for contained blocks |
| Graphite | `#27272a` | `--color-graphite` | Borders, dividers, inset surfaces, nav background — the structural neutral |
| Filament | `#e5e7eb` | `--color-filament` | Hairline borders on badges, tags, and outlined controls — the machined edge |
| Paper | `#ffffff` | `--color-paper` | Primary text, filled CTA background, icon strokes — the highest contrast signal |
| Fog | `#abafb4` | `--color-fog` | Secondary text, subdued body copy, card labels |
| Ash | `#6e727a` | `--color-ash` | Muted helper text, badge captions, metadata |
| Mist | `#99a1af` | `--color-mist` | Tertiary text, icon strokes, disabled-state foreground |
| Silver | `#cad5e2` | `--color-silver` | Decorative icon strokes, product-mock accent lines |
| Slate | `#364153` | `--color-slate` | Deep icon fills, secondary button text, sparse accent |
| Sleet | `#f3f4f6` | `--color-sleet` | Code editor chrome, light surface insets, inverted card fill |
| Neon Cyan | `#52e1fe` | `--color-neon-cyan` | Blue text accent for links, tags, and emphasized short phrases. Do not promote it to the primary CTA color |
| Beacon Teal | `#25aeba` | `--color-beacon-teal` | Glow halo behind hero product imagery, soft radial accent |
| Amber | `#ffb86a` | `--color-amber` | Decorative icon accent, editorial highlight — the warm counterpoint to cyan |

## Tokens — Typography

### Inter — Primary interface and editorial type — headlines at weight 500 with aggressive negative tracking (up to -0.05em at 68px) create display density without heaviness; body at 400 reads cleanly against Obsidian canvas · `--font-inter`
- **Substitute:** system-ui, -apple-system, sans-serif
- **Weights:** 400, 460, 500
- **Sizes:** 12, 14, 16, 18, 20, 24, 35, 68
- **Line height:** 1.43, 1.55, 1.50, 1.40, 1.33, 1.20, 1.00, 0.94
- **Letter spacing:** -0.0500em at 68px, -0.0250em at 35px, -0.0100em at 18px, -0.0080em at 16px
- **Role:** Primary interface and editorial type — headlines at weight 500 with aggressive negative tracking (up to -0.05em at 68px) create display density without heaviness; body at 400 reads cleanly against Obsidian canvas

### CommitMono — Code-first monospace — terminal commands, file labels, badge text, inline code snippets; 13–14px range keeps code as peer to body copy rather than as ornamental detail · `--font-commitmono`
- **Substitute:** JetBrains Mono, Fira Code, ui-monospace
- **Weights:** 400
- **Sizes:** 13, 14
- **Line height:** 1.30, 1.33, 1.40, 1.43, 1.55
- **Role:** Code-first monospace — terminal commands, file labels, badge text, inline code snippets; 13–14px range keeps code as peer to body copy rather than as ornamental detail

### -apple-system — Email preview rendering — the email itself uses system font stack so rendered output matches recipient inbox; liga features disabled to keep copy neutral · `--font-apple-system`
- **Substitute:** system-ui, BlinkMacSystemFont, Segoe UI
- **Weights:** 400, 600, 700
- **Sizes:** 14, 25
- **Line height:** 1.44, 1.55
- **OpenType features:** `"liga" 0`
- **Role:** Email preview rendering — the email itself uses system font stack so rendered output matches recipient inbox; liga features disabled to keep copy neutral

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.55 | -0.008px | `--text-caption` |
| body-sm | 14px | 1.55 | -0.008px | `--text-body-sm` |
| body | 16px | 1.5 | -0.008px | `--text-body` |
| subheading | 18px | 1.4 | -0.01px | `--text-subheading` |
| heading-sm | 20px | 1.33 | — | `--text-heading-sm` |
| heading | 24px | 1.2 | — | `--text-heading` |
| heading-lg | 35px | 1 | -0.025px | `--text-heading-lg` |
| display | 68px | 0.94 | -0.05px | `--text-display` |

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
| 80 | 80px | `--spacing-80` |
| 96 | 96px | `--spacing-96` |
| 104 | 104px | `--spacing-104` |
| 160 | 160px | `--spacing-160` |
| 216 | 216px | `--spacing-216` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 12px |
| badges | 2px |
| buttons | 8px |
| heroPanels | 24px |
| largeSurfaces | 18px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| subtle | `rgba(255, 255, 255, 0.1) 0px 0px 0px 1px inset, rgba(255,...` | `--shadow-subtle` |
| subtle-2 | `rgba(0, 0, 0, 0.05) 0px 1px 2px 0px` | `--shadow-subtle-2` |
| md | `rgba(37, 174, 186, 0.1) 0px 0px 9px 4px` | `--shadow-md` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 20px
- **Element gap:** 12px

## Components

### Primary CTA Button
**Role:** Main call-to-action — drives exploration of components

White filled (#ffffff) background, Obsidian (#000000) text, 8px radius, 16px horizontal × 10px vertical padding, Inter weight 500 at 14px. Inset hairline shadow (rgba(255,255,255,0.15) 0px 1px 0px inset) adds a subtle machined edge. Right-arrow icon (→) in #000000 sits 6px after label.

### Terminal Command Badge
**Role:** Inline install command — signals developer-first positioning

CommitMono 13px in Filament (#e5e7eb) on Carbon (#0f0f10) background, 8px radius, 4px top/bottom × 12px left/right padding, 1px border in Graphite (#27272a). Small copy icon (📋) right-aligned, 6px from text. Sits inline with primary CTA as a peer, not beneath it.

### Ghost Secondary Button
**Role:** Secondary action — docs link, see examples

Transparent background, Filament (#e5e7eb) text at Inter 14px weight 500, 8px radius, 16px × 10px padding. Inset hairline border (rgba(255,255,255,0.1) 0px 0px 0px 1px). Hover: background lifts to Graphite (#27272a).

### Tab Switcher
**Role:** Toggle between code styling approaches (Tailwind / CSS)

Pill container, Carbon (#0f0f10) background, 24px radius. Two tabs: inactive = transparent with Fog (#abafb4) text; active = Graphite (#27272a) fill with Paper (#ffffff) text. Inter 14px weight 500. 8px horizontal × 8px vertical padding per tab, 2px gap between tabs.

### Code Editor Window
**Role:** Code display surface — split pane with preview

Carbon (#0f0f10) background, 12px radius, 1px border in Graphite (#27272a). Traffic-light window controls (three small dots) top-left at 6px from edge. File label centered ('email-template.tsx') in CommitMono 13px Mist (#99a1af). Copy icon top-right. Internal padding 20px. Code text in CommitMono with syntax coloring: keywords Amber (#ffb86a), strings Paper, comments Slate (#364153).

### Email Preview Card
**Role:** Live render of email output — the proof

Sleet (#f3f4f6) background — intentionally inverted to simulate an email inbox. 12px radius, sits in right half of split pane. Inter 14px–18px for body, system font stack for email body content. Renders logo, heading, paragraph, and CTA button in true email style (white button, black text, 8px radius).

### Editor Toolbar
**Role:** Rich text editor controls — formatting actions

Light surface (Sleet #f3f4f6) bar, 12px top radius. Icon buttons in a row: B, I, U, S, link, image, list, list-ordered, H1–H3, heading dropdown. Icons are 16px, Slate (#364153) stroke. Separator divider (1px Filament) at 16px intervals. Active state: icon fills with Obsidian.

### Editor Content Card
**Role:** Editable email surface

Sleet (#f3f4f6) background, 12px bottom radius (mates with toolbar). Padding 24px. Inter 16px for body, Obsidian text. H2 at 20px weight 600. Bullet lists with 4px indent. 'Try it! Type /' prompt at bottom in CommitMono to demonstrate block insertion.

### GitHub Star Badge
**Role:** Social proof and repo link — top-right nav

Carbon (#0f0f10) background, 8px radius, 1px border in Graphite (#27272a). GitHub octocat icon + star icon in Mist, star count in Paper Inter 14px weight 500. 8px × 8px internal padding.

### Brand App Icon
**Role:** Logo mark — recognizable visual anchor in hero and nav

36px square, 8px radius, Neon Cyan (#52e1fe) background with subtle radial glow. White interlocked atom/circle glyph centered, 1.5px stroke. Used in hero (larger) and nav (compact).

### Top Navigation Bar
**Role:** Primary site navigation

Graphite (#27272a) background, sits flush to top. Logo left (brand icon + wordmark in Paper), nav links center (Components, Templates, Editor, Docs in Fog #abafb4, hover Paper), GitHub star badge right. Height ~56px, max-width 1200px centered with 40px horizontal padding.

### Feature Section Heading
**Role:** Section-level editorial heading

Inter 35px weight 500, Paper (#ffffff), letter-spacing -0.025em, line-height 1.00. Two-line wraps allowed. Below: Fog (#abafb4) subheading at 18px weight 400, line-height 1.40. 16px gap between heading and subheading.

### Hero Product Visualization
**Role:** Atmospheric product showcase — the 'library' of email components

Full-bleed on right side of hero. 3D rendered spiral of email component cards in blue-cyan palette, positioned off-center-right so edges fade into Canvas. Radial glow: radial-gradient(rgba(37, 99, 235, 0.1) 0%, rgba(0, 0, 0, 0) 80%) centered behind visualization. Soft Beacon Teal (#25aeba) bloom shadow.

## Do's and Don'ts

### Do
- Use Inter at weight 500 for all headings and CTAs — the medium weight creates presence without heaviness against the dark canvas
- Apply -0.05em letter-spacing at 68px display size and scale proportionally down to -0.008em at 16px body — this is what makes headlines feel sharp rather than loose
- Pair every primary CTA with a terminal command badge in CommitMono as a visual peer, not a subordinate — the install command is the real CTA for developers
- Use the inset hairline shadow (rgba(255,255,255,0.1) 0px 0px 0px 1px inset, rgba(255,255,255,0.15) 0px 1px 0px 0px inset) on all interactive surfaces to create the machined-edge feel
- Reserve Neon Cyan (#52e1fe) and Beacon Teal (#25aeba) for product visualization glows and the brand icon only — never for text or UI controls
- Maintain the split-pane pattern (code left / preview right) for any code-related section — it demonstrates the product's value proposition structurally
- Set 80px section gaps between major sections and 12px internal element gaps within sections to preserve the comfortable editorial rhythm

### Don't
- Do not use heavy drop shadows for elevation — the system uses inset hairline borders and near-imperceptible 1–2px shadows, not Material-style elevation
- Do not introduce saturated colors beyond the three accents (Neon Cyan, Beacon Teal, Amber) — the 2% colorfulness is a defining constraint, not an accident
- Do not use weight 600 or 700 in Inter for UI — the system caps at weight 500; weight 700 appears only inside the email preview's system font stack
- Do not round all corners uniformly — the system deliberately mixes 2px (badges), 8px (buttons), 12px (cards), 18px (panels), and 24px (hero surfaces)
- Do not use cyan or teal for text or button backgrounds — these colors glow behind product imagery, they do not appear as functional UI
- Do not place CTAs on light backgrounds — the entire system is dark-mode, and the white CTA achieves contrast against Obsidian, which it would lose on Sleet
- Do not use gradients on UI elements — the only gradients are atmospheric radial glows behind product visualizations, not on buttons, cards, or text

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Obsidian | `#000000` | Page canvas — the floor |
| 1 | Carbon | `#0f0f10` | Card surface — contained blocks, editor windows |
| 2 | Graphite | `#27272a` | Nav bar, elevated panels, inset borders |
| 3 | Sleet | `#f3f4f6` | Inverted light surface — email preview body |

## Elevation

- **Cards and editor windows:** `rgba(0, 0, 0, 0.05) 0px 1px 2px 0px`
- **Inset hairline (buttons, cards, tags):** `rgba(255, 255, 255, 0.1) 0px 0px 0px 1px inset, rgba(255, 255, 255, 0.15) 0px 1px 0px 0px inset`
- **Hero product visualization glow:** `rgba(37, 174, 186, 0.1) 0px 0px 9px 4px`

## Imagery

Product-first visual language: the hero centers a 3D spiral of email component mockups rendered in a blue-cyan glow against pure black, suggesting a 'library' or 'collection' metaphor. The glow uses radial-gradient from rgba(37, 99, 235, 0.1) to transparent — soft, atmospheric, never harsh. Secondary visuals are code editor mockups (split-pane code + preview) and email editor wireframes with toolbars. Icons are outlined with thin strokes (1.5–2px), monochrome (Mist/Fog), occasionally accented with Amber for editorial emphasis. No photography, no lifestyle imagery — the product IS the hero, shown through realistic UI reproductions rather than stock visuals.

## Layout

Full-bleed dark sections with max-width 1200px centered content. Hero is asymmetric: text block anchored left (40–45% width), product visualization right with radial glow bleeding off the right edge. Sections alternate between two patterns: (1) text-left + product-right with generous 80px vertical gaps, and (2) centered headline + subtitle + tab switcher + full-width editor/preview split. Navigation is a thin top bar with logo left, links center, GitHub star badge right — sticky and minimal. Code sections use split-pane layouts (code left, live preview right) with chrome-mimicking window controls. Content rhythm is spacious but information-dense within each block — every section earns its vertical space with real product demonstration.

## Agent Prompt Guide

**Quick Color Reference**
- text: #ffffff (primary), #abafb4 (secondary), #6e727a (muted)
- background: #000000 (canvas), #0f0f10 (card), #27272a (nav/border)
- border: #27272a (structural), #e5e7eb (hairline/badge)
- accent: #52e1fe (cyan glow), #25aeba (teal halo), #ffb86a (amber icon)
- primary action: #ffffff (filled action)

**3-5 Example Component Prompts**

1. Build a hero section: Obsidian (#000000) background. Display headline at 68px Inter weight 500, #ffffff, letter-spacing -0.05em, line-height 0.94. Subtext at 18px weight 400, #abafb4, max-width 480px. Below: a row with a white filled button ("Explore components →", 8px radius, Inter 14px weight 500, 16px×10px padding) and a terminal command badge (CommitMono 13px, #e5e7eb text, #0f0f10 bg, 8px radius, copy icon). Right side: product visualization with radial glow (radial-gradient(rgba(37, 99, 235, 0.1), transparent 80%)) bleeding off canvas edge.

2. Build a tab switcher: Carbon (#0f0f10) background, 24px radius pill. Two tabs — Tailwind (active: #27272a fill, #ffffff text) and CSS (inactive: transparent, #abafb4 text). Inter 14px weight 500, 8px padding, 2px gap. Centered above a code/preview split.

3. Build a code editor window: #0f0f10 background, 12px radius, 1px border in #27272a. Three traffic-light dots top-left (6px from edge). File label 'email-template.tsx' centered in CommitMono 13px #99a1af. Copy icon top-right. Code body in CommitMono with Amber (#ffb86a) for keywords, #ffffff for strings, #364153 for comments. 20px internal padding.

4. Build a section heading block: Inter 35px weight 500, #ffffff, letter-spacing -0.025em, line-height 1.00. 16px gap to subheading: Inter 18px weight 400, #abafb4, line-height 1.40. 80px vertical space above and below the block.

5. Build a ghost secondary button: transparent background, #e5e7eb text, Inter 14px weight 500, 8px radius, 16px×10px padding. 1px inset border (rgba(255,255,255,0.1)). On hover: background shifts to #27272a.

## Similar Brands

- **Vercel** — Same dark-mode editorial layout with asymmetric hero (text-left, product-right), aggressive negative letter-spacing on large headlines, and white CTAs against near-black canvas
- **Linear** — Same hairline-bordered interactive surfaces with inset white edge highlights, monospace command badges paired with primary buttons, and sparse use of accent color
- **Resend** — Direct competitor with identical developer-first positioning — dark canvas, Inter + mono pairing, split-pane code/preview sections, terminal install commands as peer to CTAs
- **Stripe Docs** — Same generous section spacing (64–80px), left-aligned editorial typography, and the pattern of letting product visualization (3D/code) carry the right half of the hero

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-obsidian: #000000;
  --color-carbon: #0f0f10;
  --color-graphite: #27272a;
  --color-filament: #e5e7eb;
  --color-paper: #ffffff;
  --color-fog: #abafb4;
  --color-ash: #6e727a;
  --color-mist: #99a1af;
  --color-silver: #cad5e2;
  --color-slate: #364153;
  --color-sleet: #f3f4f6;
  --color-neon-cyan: #52e1fe;
  --color-beacon-teal: #25aeba;
  --color-amber: #ffb86a;

  /* Typography — Font Families */
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-commitmono: 'CommitMono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-apple-system: '-apple-system', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.55;
  --tracking-caption: -0.008px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.55;
  --tracking-body-sm: -0.008px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.008px;
  --text-subheading: 18px;
  --leading-subheading: 1.4;
  --tracking-subheading: -0.01px;
  --text-heading-sm: 20px;
  --leading-heading-sm: 1.33;
  --text-heading: 24px;
  --leading-heading: 1.2;
  --text-heading-lg: 35px;
  --leading-heading-lg: 1;
  --tracking-heading-lg: -0.025px;
  --text-display: 68px;
  --leading-display: 0.94;
  --tracking-display: -0.05px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-w460: 460;
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
  --spacing-80: 80px;
  --spacing-96: 96px;
  --spacing-104: 104px;
  --spacing-160: 160px;
  --spacing-216: 216px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 20px;
  --element-gap: 12px;

  /* Border Radius */
  --radius-sm: 2px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 18px;
  --radius-3xl: 24px;

  /* Named Radii */
  --radius-cards: 12px;
  --radius-badges: 2px;
  --radius-buttons: 8px;
  --radius-heropanels: 24px;
  --radius-largesurfaces: 18px;

  /* Shadows */
  --shadow-subtle: rgba(255, 255, 255, 0.1) 0px 0px 0px 1px inset, rgba(255, 255, 255, 0.15) 0px 1px 0px 0px inset;
  --shadow-subtle-2: rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
  --shadow-md: rgba(37, 174, 186, 0.1) 0px 0px 9px 4px;

  /* Surfaces */
  --surface-obsidian: #000000;
  --surface-carbon: #0f0f10;
  --surface-graphite: #27272a;
  --surface-sleet: #f3f4f6;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-obsidian: #000000;
  --color-carbon: #0f0f10;
  --color-graphite: #27272a;
  --color-filament: #e5e7eb;
  --color-paper: #ffffff;
  --color-fog: #abafb4;
  --color-ash: #6e727a;
  --color-mist: #99a1af;
  --color-silver: #cad5e2;
  --color-slate: #364153;
  --color-sleet: #f3f4f6;
  --color-neon-cyan: #52e1fe;
  --color-beacon-teal: #25aeba;
  --color-amber: #ffb86a;

  /* Typography */
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-commitmono: 'CommitMono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-apple-system: '-apple-system', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.55;
  --tracking-caption: -0.008px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.55;
  --tracking-body-sm: -0.008px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.008px;
  --text-subheading: 18px;
  --leading-subheading: 1.4;
  --tracking-subheading: -0.01px;
  --text-heading-sm: 20px;
  --leading-heading-sm: 1.33;
  --text-heading: 24px;
  --leading-heading: 1.2;
  --text-heading-lg: 35px;
  --leading-heading-lg: 1;
  --tracking-heading-lg: -0.025px;
  --text-display: 68px;
  --leading-display: 0.94;
  --tracking-display: -0.05px;

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
  --spacing-80: 80px;
  --spacing-96: 96px;
  --spacing-104: 104px;
  --spacing-160: 160px;
  --spacing-216: 216px;

  /* Border Radius */
  --radius-sm: 2px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 18px;
  --radius-3xl: 24px;

  /* Shadows */
  --shadow-subtle: rgba(255, 255, 255, 0.1) 0px 0px 0px 1px inset, rgba(255, 255, 255, 0.15) 0px 1px 0px 0px inset;
  --shadow-subtle-2: rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
  --shadow-md: rgba(37, 174, 186, 0.1) 0px 0px 9px 4px;
}
```
