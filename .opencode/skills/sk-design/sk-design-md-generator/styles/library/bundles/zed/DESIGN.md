# Zed — Style Reference
> Blueprint workshop, wide open. A near-white gridded page held together by a single deep violet-blue and the calm authority of a humanist serif — every screen feels like a chapter in a well-printed technical manual.

**Theme:** light

Zed reads as an open-source engineering notebook rendered on faint blueprint paper: a near-white grid canvas, a single deep violet-blue that carries every heading and link, and product chrome that stays almost entirely text and hairline borders. Typography is the personality — a humanist serif (Plex Serif) for headlines at surprisingly light weights (340), a custom Writer sans for UI and body, and a wide-tracked mono (Zed Mono) for labels and shortcuts. Components are sharp-cornered (2px radius), compact (6px gaps), and almost shadowless; structure is implied by 1px inset top-borders and the faint dotted grid beneath everything. The download CTA is the only saturated fill on the page, and surrounding it everything stays quiet, typographic, and editorial — closer to a technical whitepaper than a SaaS landing page.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Hero Violet | `#1348dc` | `--color-hero-violet` | Headlines, primary text links, brand mark — the single chromatic anchor that carries identity across the page |
| Signal Blue | `#2b7fff` | `--color-signal-blue` | Blue supporting accent for decorative details and low-frequency emphasis. Do not promote it to the primary CTA color |
| Sky Tint | `#8ec5ff` | `--color-sky-tint` | Blue supporting accent for decorative details and low-frequency emphasis. Do not promote it to the primary CTA color |
| Frost | `#bedbff` | `--color-frost` | Hairline blue borders, tag outlines, divider lines that need to read as on-brand rather than neutral |
| Slate Blue | `#74ade8` | `--color-slate-blue` | Icon strokes, secondary blue text, nav active markers — cool blue for chrome, not headlines |
| Ice Wash | `#e6effe` | `--color-ice-wash` | Subtle background tints behind selected nav, soft blue drop-shadow tint, hover wash |
| Deep Cobalt | `#053794` | `--color-deep-cobalt` | Pressed-state inset shadow and the deepest brand blue — appears only as a 2px inset top line on active nav items |
| Silver Mist | `#e5e7eb` | `--color-silver-mist` | Page canvas, dominant border color, the faint grid lines — the workhorse neutral that holds the system together |
| Pure White | `#ffffff` | `--color-pure-white` | Card surfaces, editor preview frames, raised content panels sitting on the Silver Mist canvas |
| Off-White | `#f4f4f2` | `--color-off-white` | Warm white surface variant, image backings, slightly creamier than Pure White |
| Graphite | `#3a3d43` | `--color-graphite` | Primary body and heading text, logo lockup color |
| Charcoal | `#464b57` | `--color-charcoal` | Strong body text, button text on light fills, dark UI labels |
| Slate | `#5d636f` | `--color-slate` | Secondary text, nav labels, supporting copy |
| Pewter | `#6a7282` | `--color-pewter` | Tertiary text, muted helper copy, disabled labels |
| Ash | `#878a98` | `--color-ash` | Muted icons, placeholder strokes, very low-emphasis UI |
| Steel | `#b2b5bb` | `--color-steel` | Muted text, icon outlines, very low-contrast labels |
| Fog | `#cccfd3` | `--color-fog` | Light borders, input borders at rest, disabled surfaces |
| Mist | `#dadde2` | `--color-mist` | Hairline dividers between rows, subtle background fills |
| Onyx | `#282c33` | `--color-onyx` | Dark editor preview surface, code block backgrounds |
| Midnight | `#2f343e` | `--color-midnight` | Dark surface variant for framed code/editor insets |

## Tokens — Typography

### Writer — Primary UI and body face — the calm, slightly condensed sans that carries every label, button, nav item, and paragraph. Its negative tracking (-0.4px at 16px) tightens the page into a dense, confident reading rhythm. At 9–11px it functions as micro-copy and tag text; at 14–16px it carries body paragraphs. Substitute: Inter, IBM Plex Sans, or Geist Sans at matching weights. · `--font-writer`
- **Substitute:** Inter or IBM Plex Sans
- **Weights:** 400
- **Sizes:** 9px, 10px, 11px, 12px, 13px, 14px, 16px
- **Line height:** 1.10, 1.33, 1.43, 1.50, 1.71
- **Letter spacing:** -0.0250em
- **Role:** Primary UI and body face — the calm, slightly condensed sans that carries every label, button, nav item, and paragraph. Its negative tracking (-0.4px at 16px) tightens the page into a dense, confident reading rhythm. At 9–11px it functions as micro-copy and tag text; at 14–16px it carries body paragraphs. Substitute: Inter, IBM Plex Sans, or Geist Sans at matching weights.

### Plex Serif — Headlines and display text. The signature choice is weight 340 for large display ('Love your editor again' at 48px) — an unusually light cut that whispers rather than shouts, paired with tight -0.02em tracking (-0.96px at 48px). This is what makes the page read editorial rather than promotional. Used at 26px for section headlines, 17px for sub-headings, and occasionally for body emphasis. Substitute: IBM Plex Serif or Source Serif Pro. · `--font-plex-serif`
- **Substitute:** IBM Plex Serif or Source Serif Pro
- **Weights:** 340, 400
- **Sizes:** 13px, 14px, 15px, 17px, 26px, 48px
- **Line height:** 1.10, 1.20, 1.25, 1.43, 1.50
- **Letter spacing:** -0.0200em
- **Role:** Headlines and display text. The signature choice is weight 340 for large display ('Love your editor again' at 48px) — an unusually light cut that whispers rather than shouts, paired with tight -0.02em tracking (-0.96px at 48px). This is what makes the page read editorial rather than promotional. Used at 26px for section headlines, 17px for sub-headings, and occasionally for body emphasis. Substitute: IBM Plex Serif or Source Serif Pro.

### Zed Mono — Monospaced face for keyboard shortcuts, command labels, keycaps, and editor chrome labels. Its +0.05em tracking (0.6px at 12px, 1.2px at 24px) deliberately widens letterforms to read as labels rather than code — a stylistic choice that signals 'this is a keybind, not syntax'. At 24px it functions as a large command-prompt display. Substitute: JetBrains Mono or IBM Plex Mono. · `--font-zed-mono`
- **Substitute:** JetBrains Mono or IBM Plex Mono
- **Weights:** 400
- **Sizes:** 10px, 11px, 12px, 24px
- **Line height:** 1.33, 1.50, 1.67, 2.00
- **Letter spacing:** 0.0500em
- **Role:** Monospaced face for keyboard shortcuts, command labels, keycaps, and editor chrome labels. Its +0.05em tracking (0.6px at 12px, 1.2px at 24px) deliberately widens letterforms to read as labels rather than code — a stylistic choice that signals 'this is a keybind, not syntax'. At 24px it functions as a large command-prompt display. Substitute: JetBrains Mono or IBM Plex Mono.

### ui-monospace — System mono fallback for nav and small chrome where a custom face isn't loaded. Negative tracking (-0.38px at 12px) tightens it for label use rather than code reading. · `--font-ui-monospace`
- **Weights:** 400, 700
- **Sizes:** 11px, 12px
- **Line height:** 1.00, 1.33, 1.43
- **Letter spacing:** -0.0320em
- **Role:** System mono fallback for nav and small chrome where a custom face isn't loaded. Negative tracking (-0.38px at 12px) tightens it for label use rather than code reading.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.5 | -0.3px | `--text-caption` |
| body | 14px | 1.5 | -0.35px | `--text-body` |
| heading-sm | 26px | 1.25 | -0.52px | `--text-heading-sm` |
| heading | 48px | 1.1 | -0.96px | `--text-heading` |

## Tokens — Spacing & Shapes

**Density:** compact

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 6 | 6px | `--spacing-6` |
| 8 | 8px | `--spacing-8` |
| 10 | 10px | `--spacing-10` |
| 12 | 12px | `--spacing-12` |
| 14 | 14px | `--spacing-14` |
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 32 | 32px | `--spacing-32` |
| 36 | 36px | `--spacing-36` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 224 | 224px | `--spacing-224` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 2px |
| cards | 2px |
| inputs | 2px |
| buttons | 2px |
| logoTiles | 2px |
| editorFrame | 6px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| subtle | `rgba(111, 123, 144, 0.1) 0px -2px 0px 0px inset` | `--shadow-subtle` |
| subtle-2 | `rgba(111, 123, 144, 0.05) 0px -2px 0px 0px inset` | `--shadow-subtle-2` |
| subtle-3 | `rgb(5, 55, 148) 0px -2px 0px 0px inset, rgb(230, 239, 254...` | `--shadow-subtle-3` |
| subtle-4 | `rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.1) 0p...` | `--shadow-subtle-4` |
| md | `rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.1)...` | `--shadow-md` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 64-80px
- **Card padding:** 24px
- **Element gap:** 6px

## Components

### Top Navigation Bar
**Role:** Primary site navigation, minimal header

White background, 1px #e5e7eb bottom border, ~60px height. Left: Zed wordmark in Writer at 16px weight 400 #3a3d43. Center: nav links (Product, Resources, Extensions, Docs, Pricing) in Writer 14px #5d636f, 24px horizontal gap. Right: search icon, language switcher, 'Sign up' ghost link, and 'Download' filled blue button (#2b7fff, white text, 2px radius, 8px 14px padding). Active nav item gets a 2px inset Deep Cobalt top-border and Ice Wash background.

### Primary Action Button (Download)
**Role:** Highest-priority conversion CTA

Filled #2b7fff background, white text in Writer 14px weight 400, 2px radius, 10px 16px padding, 6px gap between label and trailing icon. The vivid blue is the only saturated fill on the entire page; everything else recedes behind it. Sits with a subtle rgba(0,0,0,0.1) 0 1px 3px drop shadow. Trailing download arrow icon in white.

### Ghost / Outline Button (Clone source)
**Role:** Secondary action alongside the primary CTA

Transparent background, 1px #cccfd3 border, Writer 14px #3a3d43 text, 2px radius, 10px 16px padding, 6px gap to leading GitHub icon. Reads as the quieter sibling of the blue Download button.

### Hero Section
**Role:** First-screen identity statement

Full-width Silver Mist (#e5e7eb) canvas with a faint dotted grid overlay (8px dot spacing). Centered stack: Plex Serif 48px weight 340 #1348dc headline ('Love your editor again') with -0.96px tracking, Writer 16px #5d636f subtext below, then a horizontal row of Primary Action + Ghost Button with 8px gap, then Writer 13px #6a7280 platform line ('Available for macOS, Linux, and Windows'). Vertical rhythm uses 16–24px gaps between elements. No card, no background panel — the grid paper IS the hero.

### Three-Column Feature Block
**Role:** Value proposition summary (Fast, Intelligent, Collaborative)

Three equal-width columns on the Silver Mist canvas, 32px column gap. Each column: Plex Serif 17px weight 400 #1348dc label as a section title, Writer 14px #5d636f description paragraph below at 1.5 line-height. No cards, no borders, no icons — pure typographic separation. ~80px vertical padding above and below.

### Editor Preview Card
**Role:** Product showcase — the editor itself in context

The hero's main visual artifact. Dark surface #282c33 filling the full card, 6px corner radius, soft 10px 15px -3px black/0.1 drop shadow that lifts it off the canvas. Inside: a faux macOS title bar (traffic lights), tab strip with file names in Zed Mono 12px, a file tree on the left (Gruvbox-tinted backgrounds in the mockup), and the main code pane with syntax highlighting using the full editor color palette (green #a1c181 for strings, red #d07277 for keywords, yellow #dec184 for types, teal #6eb4bf for functions, violet #b477cf for variables, orange #bf956a for constants). The card sits centered at ~1200px wide.

### Logo Wall
**Role:** Social proof — trusted-by strip

Centered Plex Serif 26px weight 340 #1348dc heading ('Trusted by world-class developers & industry leading teams'), then a single horizontal row of grayscale company logos (Atlassian, Apple, Anthropic, Vercel, AWS, Baseten) at uniform ~80px height, evenly spaced. Logos are dark gray #3a3d43 to #5d636f, no color. ~48px vertical padding around the row.

### Testimonial Card
**Role:** Quoted endorsement from a named developer

White (#ffffff) surface on the Silver Mist canvas, 2px radius, 1px #e5e7eb border, 24px padding. Quote text in Plex Serif 15px weight 400 #3a3d43 at 1.5 line-height, set in italic-feeling rhythm. Bottom row: small avatar (32px circle, 2px radius), name in Writer 13px weight 400 #3a3d43, role/company in Writer 12px #6a7282. Featured testimonial (Anthropic) uses a slightly larger card with the same structure.

### Open Source Stats Block
**Role:** Community credibility numbers

Centered Plex Serif 26px #1348dc heading ('Open Source'), Writer 16px #5d636f subtext, then a four-column row of stats. Each stat: Plex Serif 26px weight 340 #1348dc number on top (7,784 / 78,821 / 1,766 / 1,020), Writer 13px #6a7282 label below. Numbers use the same display-weight serif as headlines to keep the typographic language consistent. Above and below the numbers, rows of tiny contributor avatar circles (24px, 2px radius) form a visual fence.

### Two-Column Feature Section (AI / Agentic Editing)
**Role:** Explanatory section pairing text with a product visual

Full-width Silver Mist band, 1200px centered content. Left column (~40%): Plex Serif 26px #1348dc section heading, Writer 16px #5d636f description, Writer 14px #1348dc 'Learn More →' link. Right column (~60%): a dark editor screenshot card (#282c33, 6px radius) showing a split-pane code review interface. Section gap ~80px above and below, creating a distinct band in the page rhythm.

### Keybind / Shortcut Label
**Role:** Monospaced keyboard hint used in editor chrome and feature callouts

Zed Mono 12px #3a3d43 text, +0.6px letter-spacing (0.05em), inside a 1px #cccfd3 bordered chip, 2px radius, 4px 8px padding. Sometimes sits on a #f4f4f2 background to read as a keycap. The wide tracking is what distinguishes it from inline code — it reads as a label, not as syntax.

### Footer
**Role:** Site footer with secondary links and brand mark

Silver Mist canvas continuing from the page, 1px #e5e7eb top border, 48px vertical padding. Writer 13px #6a7282 link list in 3–4 columns, Zed wordmark in Writer 14px #3a3d43 at the bottom-left. No background fill change — the footer is implied by a single horizontal rule, not a panel.

## Do's and Don'ts

### Do
- Set headlines in Plex Serif weight 340 at 48px with -0.96px tracking — the whisper-weight serif is the signature.
- Use Signal Blue (#2b7fff) fill for the primary Download action; it must be the only saturated fill on the screen.
- Build all cards, buttons, tags, and inputs with a 2px corner radius — sharp corners are part of the editorial feel.
- Use 6px gaps as the default element spacing and 64–80px as section gaps to keep the page compact and dense.
- Pair every action button with a ghost/outline variant sitting 8px to the right — never a single-button row.
- Express structure with 1px #e5e7eb borders and 2px inset top-lines, not with drop shadows.
- Use Zed Mono 12px with +0.6px tracking (0.05em) for keybind chips and command labels — the wide tracking distinguishes them from inline code.

### Don't
- Don't use Plex Serif above weight 400 for headlines — the lightness at 340 is the whole point.
- Don't introduce a second saturated color for buttons, tags, or accents — Hero Violet and Signal Blue are the only chromatic UI colors.
- Don't apply drop shadows to cards, nav, or text blocks — the only shadow that belongs is under the editor preview card.
- Don't round corners beyond 6px; 32px or 40px radii on any control breaks the editorial system.
- Don't use blue or violet for body text — those hues are reserved for headlines, links, and the CTA. Body text is Graphite or Slate.
- Don't set body text larger than 16px or smaller than 13px in Writer — outside that range the page loses its typographic discipline.
- Don't add decorative gradients, glassmorphism, or background images to sections — the dotted-grid canvas is the only texture allowed.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#e5e7eb` | Page background with faint dotted grid overlay |
| 1 | Card | `#ffffff` | White content cards, testimonial panels, feature blocks |
| 2 | Warm Surface | `#f4f4f2` | Cream-tinted surfaces for image holders and alternating bands |
| 3 | Blue Wash | `#e6effe` | Selected nav background, soft blue tinted zones |
| 4 | Dark Frame | `#282c33` | Editor screenshot and dark code insets |

## Elevation

- **Active nav item:** `rgb(5, 55, 148) 0px -2px 0px 0px inset, rgb(230, 239, 254) 0px 1px 3px 0px`
- **Subtle separator / button top-edge:** `rgba(111, 123, 144, 0.1) 0px -2px 0px 0px inset`
- **Light divider:** `rgba(111, 123, 144, 0.05) 0px -2px 0px 0px inset`
- **Raised button:** `rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.1) 0px 1px 2px -1px`
- **Editor screenshot card:** `rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.1) 0px 4px 6px -4px`

## Imagery

Imagery is dominated by one element: the dark editor screenshot. It appears full-bleed within a 1200px frame, presented as a high-fidelity product capture with the macOS chrome, tabs, file tree, and syntax-highlighted code. The code uses a Gruvbox-inspired palette of warm muted hues (green, red, yellow, teal, violet, orange) on a near-black surface — a deliberate visual contrast to the otherwise light page. Beyond the editor, the only other imagery is a row of grayscale company logos for social proof and small circular contributor avatars. No lifestyle photography, no abstract graphics, no illustrations. The grid-patterned page background functions as the primary visual texture.

## Layout

The page model is centered, max-width 1200px content within a full-width Silver Mist canvas. The canvas carries a faint dotted grid overlay (8px spacing) that reads as blueprint paper and persists across every section — there are no alternating colored bands, only a continuous textured background. The hero is a centered typographic stack: Plex Serif display headline, Writer subtext, two side-by-side buttons, platform line. Sections below follow a rhythm of centered headlines over content blocks: a 3-column feature row, a wide editor preview card, a centered logo wall, a 3-column testimonial row, a 4-column stats block, and a 2-column text+visual section. The navigation is a thin top bar with center-aligned nav links and right-aligned actions. Vertical rhythm uses 64–80px between major sections and 6–16px within content. The only true full-bleed moment is the Silver Mist canvas itself; content always sits within the 1200px column.

## Agent Prompt Guide

Quick Color Reference:
- Text (primary): #3a3d43 (Graphite)
- Text (secondary): #5d636f (Slate)
- Background (canvas): #e5e7eb (Silver Mist)
- Background (card): #ffffff (Pure White)
- Border (hairline): #e5e7eb (Silver Mist)
- Accent / Headline: #1348dc (Hero Violet)
- primary action: no distinct CTA color

Example Component Prompts:
No distinct primary action color was observed; use the extracted neutral button treatments instead of inventing a filled CTA color.
2. Editor preview card: Dark surface #282c33, 6px corner radius, soft shadow rgba(0,0,0,0.1) 0 10px 15px -3px. Inside: a 28px macOS title bar with red/yellow/green traffic lights, then a tab strip in Zed Mono 12px with +0.6px tracking showing file names. Main pane shows code in Zed Mono 12px with syntax colors — strings #a1c181, keywords #d07277, types #dec184, functions #6eb4bf, variables #b477cf, constants #bf956a — on the #282c33 background.
3. Three-column feature block: Three equal columns on the Silver Mist canvas with 32px column gap. Each column starts with a Plex Serif 17px weight 400 #1348dc label, followed by Writer 14px weight 400 #5d636f body text at line-height 1.50. No borders, no cards, no icons — pure typographic separation with 80px vertical padding above and below.
4. Testimonial card: White (#ffffff) surface, 2px radius, 1px #e5e7eb border, 24px padding. Quote in Plex Serif 15px weight 400 #3a3d43, italic-feel rhythm, line-height 1.50. Bottom row: 32px circular avatar, Writer 13px #3a3d43 name, Writer 12px #6a7282 role. Sits on the Silver Mist canvas as the only white object in a 3-column grid.
5. Keybind chip: Zed Mono 12px weight 400 #3a3d43 text, letter-spacing 0.6px (0.05em), 1px #cccfd3 border, #f4f4f2 background, 2px radius, 4px 8px padding. Used inline next to feature descriptions to signal keyboard shortcuts — the wide tracking is what makes it read as a label rather than code.

## Similar Brands

- **Linear** — Same single-accent-blue-on-near-white approach with sharp corners, typographic density, and a signature product screenshot as the visual centerpiece.
- **Vercel** — Minimal light landing pages anchored by a serif-or-geometric display headline, a single saturated CTA color, and full-bleed product chrome over a near-white canvas.
- **Tailscale** — Developer-tool sites that lean on compact typographic systems, hairline borders, and 2px-radius components instead of cards and elevation.
- **Resend** — Light-canvas dev marketing with one chromatic brand blue used sparingly, a dark code/editor inset as the hero visual, and tight editorial spacing.

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-hero-violet: #1348dc;
  --color-signal-blue: #2b7fff;
  --color-sky-tint: #8ec5ff;
  --color-frost: #bedbff;
  --color-slate-blue: #74ade8;
  --color-ice-wash: #e6effe;
  --color-deep-cobalt: #053794;
  --color-silver-mist: #e5e7eb;
  --color-pure-white: #ffffff;
  --color-off-white: #f4f4f2;
  --color-graphite: #3a3d43;
  --color-charcoal: #464b57;
  --color-slate: #5d636f;
  --color-pewter: #6a7282;
  --color-ash: #878a98;
  --color-steel: #b2b5bb;
  --color-fog: #cccfd3;
  --color-mist: #dadde2;
  --color-onyx: #282c33;
  --color-midnight: #2f343e;

  /* Typography — Font Families */
  --font-writer: 'Writer', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-plex-serif: 'Plex Serif', ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
  --font-zed-mono: 'Zed Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-ui-monospace: 'ui-monospace', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --tracking-caption: -0.3px;
  --text-body: 14px;
  --leading-body: 1.5;
  --tracking-body: -0.35px;
  --text-heading-sm: 26px;
  --leading-heading-sm: 1.25;
  --tracking-heading-sm: -0.52px;
  --text-heading: 48px;
  --leading-heading: 1.1;
  --tracking-heading: -0.96px;

  /* Typography — Weights */
  --font-weight-w340: 340;
  --font-weight-regular: 400;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-6: 6px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-14: 14px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-224: 224px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 64-80px;
  --card-padding: 24px;
  --element-gap: 6px;

  /* Border Radius */
  --radius-sm: 2px;
  --radius-md: 6px;
  --radius-3xl: 32px;
  --radius-3xl-2: 40px;

  /* Named Radii */
  --radius-tags: 2px;
  --radius-cards: 2px;
  --radius-inputs: 2px;
  --radius-buttons: 2px;
  --radius-logotiles: 2px;
  --radius-editorframe: 6px;

  /* Shadows */
  --shadow-subtle: rgba(111, 123, 144, 0.1) 0px -2px 0px 0px inset;
  --shadow-subtle-2: rgba(111, 123, 144, 0.05) 0px -2px 0px 0px inset;
  --shadow-subtle-3: rgb(5, 55, 148) 0px -2px 0px 0px inset, rgb(230, 239, 254) 0px 1px 3px 0px;
  --shadow-subtle-4: rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.1) 0px 1px 2px -1px;
  --shadow-md: rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.1) 0px 4px 6px -4px;

  /* Surfaces */
  --surface-canvas: #e5e7eb;
  --surface-card: #ffffff;
  --surface-warm-surface: #f4f4f2;
  --surface-blue-wash: #e6effe;
  --surface-dark-frame: #282c33;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-hero-violet: #1348dc;
  --color-signal-blue: #2b7fff;
  --color-sky-tint: #8ec5ff;
  --color-frost: #bedbff;
  --color-slate-blue: #74ade8;
  --color-ice-wash: #e6effe;
  --color-deep-cobalt: #053794;
  --color-silver-mist: #e5e7eb;
  --color-pure-white: #ffffff;
  --color-off-white: #f4f4f2;
  --color-graphite: #3a3d43;
  --color-charcoal: #464b57;
  --color-slate: #5d636f;
  --color-pewter: #6a7282;
  --color-ash: #878a98;
  --color-steel: #b2b5bb;
  --color-fog: #cccfd3;
  --color-mist: #dadde2;
  --color-onyx: #282c33;
  --color-midnight: #2f343e;

  /* Typography */
  --font-writer: 'Writer', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-plex-serif: 'Plex Serif', ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
  --font-zed-mono: 'Zed Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-ui-monospace: 'ui-monospace', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --tracking-caption: -0.3px;
  --text-body: 14px;
  --leading-body: 1.5;
  --tracking-body: -0.35px;
  --text-heading-sm: 26px;
  --leading-heading-sm: 1.25;
  --tracking-heading-sm: -0.52px;
  --text-heading: 48px;
  --leading-heading: 1.1;
  --tracking-heading: -0.96px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-6: 6px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-14: 14px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-224: 224px;

  /* Border Radius */
  --radius-sm: 2px;
  --radius-md: 6px;
  --radius-3xl: 32px;
  --radius-3xl-2: 40px;

  /* Shadows */
  --shadow-subtle: rgba(111, 123, 144, 0.1) 0px -2px 0px 0px inset;
  --shadow-subtle-2: rgba(111, 123, 144, 0.05) 0px -2px 0px 0px inset;
  --shadow-subtle-3: rgb(5, 55, 148) 0px -2px 0px 0px inset, rgb(230, 239, 254) 0px 1px 3px 0px;
  --shadow-subtle-4: rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.1) 0px 1px 2px -1px;
  --shadow-md: rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.1) 0px 4px 6px -4px;
}
```
