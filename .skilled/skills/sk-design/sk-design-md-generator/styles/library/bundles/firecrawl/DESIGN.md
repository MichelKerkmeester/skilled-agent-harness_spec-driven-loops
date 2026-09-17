# Firecrawl — Style Reference
> Technical blueprint on warm vellum. A developer tool that swaps cold gray for a single burning orange signal, sitting on near-white surfaces stitched together by hairline grid lines.

**Theme:** light

Firecrawl operates as a developer-first workspace: a pale near-white canvas overlaid with a fine grid of hairline borders, a single vivid orange accent (#ff4d00) that acts as functional punctuation, and typography set in Suisse — a humanist grotesque whose tight tracking and generous x-height keep everything feeling engineered rather than editorial. Components are flat and quiet: pill-shaped controls (999px radius), 8px card corners, and shadow stacks that are barely perceptible (black at 2-3% alpha) so that depth comes from layering and the orange border-glow, not from drop shadows. The orange is never decorative — it appears on the CTA, the fire icon, highlight words in headlines, badge dots, and tab underlines. Everything else is a calibrated gray scale, with #e5e7eb doing the work of a thousand borders and #262626 carrying the full weight of body and heading text at AAA contrast against the off-white surfaces.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Ember Orange | `#ff4d00` | `--color-ember-orange` | Primary action background, accent text, highlight words in headlines, fire icon, active tab underline, badge dots, link strokes — the system's only chromatic signal |
| Ember Glow (light) | `#fcddcc` | `--color-ember-glow-light` | Soft orange-tinted shadow halos behind orange buttons and badges, giving them a warm bloom without raising elevation |
| Ember Wash (deep) | `#febec2` | `--color-ember-wash-deep` | Secondary warm-tinted shadow wash, used for outer glow rings on highlighted cards and code windows |
| Gridline | `#e5e7eb` | `--color-gridline` | Dominant hairline border, card outlines, input strokes, code window dividers, grid background lines — the structural skeleton of every screen |
| Ink | `#262626` | `--color-ink` | Primary text, heading fills, icon strokes, button text on light surfaces, code text |
| Vellum | `#f9f9f9` | `--color-vellum` | Page and card background, the softest surface in the stack; inset shadow fields use a vellum-tinted ring to create depth without darkening |
| Slate | `#727272` | `--color-slate` | Secondary text, muted body copy, placeholder labels, disabled-state copy |
| Graphite | `#616161` | `--color-graphite` | Link text in body copy, supporting paragraphs, slightly lighter than Ink for inline emphasis |
| Ash | `#949494` | `--color-ash` | Tertiary text, helper text, subtle icon strokes, caption-tier metadata |
| Stone | `#c7c7c7` | `--color-stone` | Placeholder text in inputs and code blocks, very light body text where contrast is deliberately reduced |
| Mist | `#b5b5b5` | `--color-mist` | Decorative strokes, faint dividers, background-pattern dots and crosses |
| Pebble | `#838383` | `--color-pebble` | Muted button text on neutral surfaces, subtle UI labels |

## Tokens — Typography

### Suisse — Primary interface and headline face. The 450 weight (a custom intermediate between regular and medium) is distinctive — it gives body text a slightly denser feel than a standard 400, and headings carry weight 500 for calm authority rather than boldness. Tracking tightens at display sizes (-0.01em at 60px, -0.005em at 40-52px) and opens slightly (+0.01-0.02em) at caption sizes for legibility. · `--font-suisse`
- **Substitute:** Inter, Söhne, or Untitled Sans (close humanist grotesques with similar x-height and tracking behavior)
- **Weights:** 400, 450, 500
- **Sizes:** 10, 12, 13, 14, 15, 16, 20, 24, 40, 52, 60
- **Line height:** 1.00, 1.07, 1.10, 1.20, 1.33, 1.40, 1.50, 1.60
- **Letter spacing:** -0.01em at 60px, -0.005em at 40-52px, normal at 16-24px, +0.01em at 12-14px, +0.02em at 10-13px
- **Role:** Primary interface and headline face. The 450 weight (a custom intermediate between regular and medium) is distinctive — it gives body text a slightly denser feel than a standard 400, and headings carry weight 500 for calm authority rather than boldness. Tracking tightens at display sizes (-0.01em at 60px, -0.005em at 40-52px) and opens slightly (+0.01-0.02em) at caption sizes for legibility.

### Geist Mono — Code, technical labels, and any developer-facing micro-copy. Used for code blocks, tab labels in code-switcher UI, URL examples, and inline code snippets. Geist Mono's clean monospace geometry pairs with Suisse's humanist proportions without visual conflict. · `--font-geist-mono`
- **Substitute:** JetBrains Mono, IBM Plex Mono, or Berkeley Mono
- **Weights:** 400, 500
- **Sizes:** 12, 13, 14
- **Line height:** 1.33, 1.54, 1.57
- **Letter spacing:** normal
- **Role:** Code, technical labels, and any developer-facing micro-copy. Used for code blocks, tab labels in code-switcher UI, URL examples, and inline code snippets. Geist Mono's clean monospace geometry pairs with Suisse's humanist proportions without visual conflict.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 10px | 1.5 | 0.2px | `--text-caption` |
| body | 14px | 1.5 | — | `--text-body` |
| heading-sm | 20px | 1.33 | — | `--text-heading-sm` |
| heading | 24px | 1.2 | — | `--text-heading` |
| heading-lg | 40px | 1.1 | -0.2px | `--text-heading-lg` |
| display | 52px | 1.07 | -0.26px | `--text-display` |
| display-xl | 60px | 1 | -0.6px | `--text-display-xl` |

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
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 56 | 56px | `--spacing-56` |
| 60 | 60px | `--spacing-60` |
| 64 | 64px | `--spacing-64` |
| 72 | 72px | `--spacing-72` |
| 164 | 164px | `--spacing-164` |
| 188 | 188px | `--spacing-188` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 999px |
| cards | 16px |
| icons | 999px |
| inputs | 8px |
| buttons | 999px |
| code-windows | 8px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| subtle | `rgb(249, 249, 249) 0px 0px 0px 6px` | `--shadow-subtle` |
| xl | `rgba(0, 0, 0, 0.02) 0px 40px 48px -20px, rgba(0, 0, 0, 0....` | `--shadow-xl` |
| xl-2 | `rgba(0, 0, 0, 0.03) 0px 24px 32px -12px, rgba(0, 0, 0, 0....` | `--shadow-xl-2` |
| subtle-2 | `color(display-p3 0.984314 0.984314 0.984314) 0px 0px 0px 8px` | `--shadow-subtle-2` |
| subtle-3 | `rgb(253, 253, 253) 0px 0px 0px 8px` | `--shadow-subtle-3` |
| xl-3 | `rgba(0, 0, 0, 0.02) 0px 0px 44px 0px, rgba(0, 0, 0, 0.03)...` | `--shadow-xl-3` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 96px
- **Card padding:** 24px
- **Element gap:** 12px

## Components

### Primary CTA Button (Pill)
**Role:** Filled orange pill button for highest-priority actions (Sign up, Get started)

Background #ff4d00, text #ffffff, font Suisse 14px weight 500, letter-spacing +0.01em. Padding 10px 18px. Radius 999px. Wrapped in a soft outer glow: box-shadow using #fcddcc at 0px 0px 0px 6px, creating a warm bloom without a hard drop shadow. No border.

### Ghost Nav Button
**Role:** Header action button for secondary navigation (GitHub star count, Sign in)

Transparent background, text #262626, font Suisse 14px weight 500. Padding 8px 12px. Radius 999px. Hover: light Vellum (#f9f9f9) background fill. No border by default.

### Code Tab Pill
**Role:** Language selector in the embedded code block (Python, Node.js, cURL, CLI)

Background transparent, text #727272, font Geist Mono 13px weight 500. Padding 6px 12px. Radius 999px. Active state: background #262626, text #ffffff. Inactive tabs separated by 2px gap.

### Search/Scrape Input Bar
**Role:** Hero interaction: URL input with action buttons

Container: white #ffffff background, border 1px #e5e7eb, radius 999px, padding 8px 8px 8px 20px. URL input: font Suisse 14px, placeholder #c7c7c7, no border. Inline action chips (Search, Scrape, Map, Crawl): Geist Mono 13px, text #262626, each in its own pill with #f9f9f9 background and radius 999px. Trailing submit button: #ff4d00 background, white text, radius 999px, 36px square, containing a right-arrow icon. Overall shadow: faint vellum ring (rgb(249,249,249) 0px 0px 0px 6px) for depth.

### Feature Card (Centered Icon)
**Role:** Three-column feature card (Search, Scrape, Interact)

Background #f9f9f9, border 1px #e5e7eb, radius 16px, padding 32px 24px. Centered orange icon (#ff4d00, stroke-based) at 24px size inside a 40px circle. Title: Suisse 16px weight 500, #262626, centered. Description: Suisse 14px weight 400, #727272, centered. Three cards in a row separated by 24px gap.

### Code Window
**Role:** Embedded code editor showing API usage example

Background #f9f9f9, border 1px #e5e7eb, radius 8px. Header bar: 40px tall, contains 3 traffic-light dots (6px, #e5e7eb) left-aligned, Geist Mono 12px filename center, copy-code button right-aligned with #f9f9f9 background and #262626 text. Body: Geist Mono 13px weight 400, line-height 1.57, padding 20px. Line numbers: Geist Mono 12px, #b5b5b5, right-aligned. Syntax: #262626 default, #ff4d00 for keywords/strings, #616161 for comments. Outer shadow: rgb(253,253,253) 0px 0px 0px 8px for ambient depth.

### Announcement Banner
**Role:** Top-of-page promotional bar (orange background)

Full-width, background #ff4d00, text #ffffff, font Suisse 14px weight 500, centered. Padding 10px 16px. Contains inline link with underline. No border or radius. Appears flush above the nav.

### Logo Cloud Card
**Role:** Horizontal row of partner/company logos

Each logo sits in a #f9f9f9 card with 1px #e5e7eb border, radius 8px, padding 24px. Logos rendered in #262626 monochrome. Cards are full-height and equal-width across the row, separated by 1px borders that form a continuous grid effect. Left side has a 2-line label in Suisse 14px (#262626 with #ff4d00 for the number).

### Section Header (Numbered)
**Role:** Section divider with index and label (e.g. "01 / MAIN FEATURES")

Layout: orange 4px dot + Geist Mono 12px #727272 index + "/" separator + uppercase Geist Mono 12px #727272 label. Left-aligned with a 2px orange vertical line. Followed by large display heading (Suisse 40-52px, #262626, weight 500) with optional orange highlight words.

### Pill Badge (Tag)
**Role:** Small status or feature tags (e.g. "NEW")

Background #ff4d00, text #ffffff, font Suisse 12px weight 500, letter-spacing +0.01em. Padding 2px 8px. Radius 999px. No border.

### Action Card Button (Scraping Selector)
**Role:** Inline action chip within the hero input (Search/Scrape/Map/Crawl)

Background #f9f9f9, text #262626, font Geist Mono 13px weight 500. Padding 4px 10px. Radius 999px. Small left icon (12px) in #727272. Gap between chips: 4px.

### Elevated Card (Marketing)
**Role:** Prominent content card with multi-layer shadow stack

Background #ffffff, border 1px #e5e7eb, radius 16px, padding 32px. Shadow stack: rgba(0,0,0,0.02) 0px 40px 48px -20px, rgba(0,0,0,0.03) 0px 32px 32px -20px, rgba(0,0,0,0.03) 0px 16px 24px -12px, rgba(0,0,0,0.03) 0px 0px 0px 1px — creates a gentle lift without darkening the card itself. Used sparingly for hero-adjacent promotional cards.

### Navigation Bar
**Role:** Sticky top navigation header

Background white, height ~64px, padding 0 24px. Left: fire icon logo (orange #ff4d00) + wordmark "Firecrawl" in Suisse 15px weight 500 #262626. Center: nav items in Suisse 14px weight 500 #262626, each with a chevron-down icon for dropdowns, 24px gap. Right: GitHub star count in Geist Mono 13px #262626 (255 label suffix in Slate #727272) + orange Sign up pill button. Border-bottom 1px #e5e7eb.

### World Map Background
**Role:** Decorative dot-map behind section headers

Full-width, height ~400px, composed of tiny #e5e7eb dots forming a world map silhouette. No labels or interactivity. Provides geographic atmosphere without competing with foreground text.

## Do's and Don'ts

### Do
- Use #ff4d00 exclusively for functional emphasis: CTA fills, active states, highlight words in headlines, badge dots, and the fire icon. Never use it for large decorative areas.
- Set body text at 14px Suisse weight 400 and reserve weight 500 for headings and interactive elements — the 450 weight is not used in interface copy.
- Apply 999px radius to all buttons, tags, and interactive pills; use 8px for inputs and code windows; use 16px for cards. Never mix these tiers.
- Use #e5e7eb 1px borders as the primary visual structure — they do the work that shadows would in other systems.
- Pair Suisse for prose with Geist Mono for any technical content (code, URLs, API names, file paths) to create a clear semantic split between documentation and copy.
- Tighten letter-spacing on display sizes (-0.005em at 40-52px, -0.01em at 60px) and open it on small sizes (+0.01-0.02em below 14px) — do not apply uniform tracking.
- Keep shadow stacks at 2-3% black alpha; depth comes from layering and ambient rings (rgb(249,249,249) 0px 0px 0px 6px), never from heavy drop shadows.

### Don't
- Don't introduce any chromatic color other than #ff4d00. Greens, blues, and purples are absent from the palette by design.
- Don't use filled colored backgrounds for large surface areas. Orange belongs on small interactive elements, not on section backgrounds or hero washes.
- Don't use sharp corners (0-4px radius) on buttons or tags. The pill shape is a core identity signal.
- Don't apply shadows with dark alpha above 5%. The system is deliberately flat — aggressive shadows break the blueprint feel.
- Don't use the 450 weight in headings. Headings are weight 500; the intermediate weight is only for body emphasis in long-form prose.
- Don't use color to convey hierarchy in body text. Hierarchy comes from weight (400 vs 500), size, and the Slate→Ink gray gradient (#727272→#262626).
- Don't place text directly on the dot/grid background without a card or surface layer — the gridlines are structural, not a backdrop for copy.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#ffffff` | Base page background, cleanest surface |
| 1 | Vellum | `#f9f9f9` | Card surfaces, code windows, subtle elevation from canvas |
| 2 | Gridline | `#e5e7eb` | Hairline borders, grid pattern lines, dividers |
| 3 | Shadow Tint | `#fcddcc` | Warm ambient shadow ring around orange elements |

## Elevation

- **Elevated marketing card:** `rgba(0, 0, 0, 0.02) 0px 40px 48px -20px, rgba(0, 0, 0, 0.03) 0px 32px 32px -20px, rgba(0, 0, 0, 0.03) 0px 16px 24px -12px, rgba(0, 0, 0, 0.03) 0px 0px 0px 1px`
- **Medium card lift:** `rgba(0, 0, 0, 0.03) 0px 24px 32px -12px, rgba(0, 0, 0, 0.03) 0px 16px 24px -8px, rgba(0, 0, 0, 0.03) 0px 8px 16px -4px, rgba(0, 0, 0, 0.03) 0px 0px 0px 1px`
- **Orange button glow:** `0 0 0 6px #fcddcc`
- **Ambient vellum ring:** `rgb(249, 249, 249) 0px 0px 0px 6px`

## Imagery

The visual language is nearly entirely text and UI — no photography, no illustration, no 3D. The only graphical elements are: (1) a subtle dot/grid pattern that tiles the hero background in #e5e7eb, reading as engineering graph paper; (2) a dotted world-map silhouette (#e5e7eb dots on white) behind section headers; (3) the fire icon logo in solid #ff4d00; (4) stroke-based orange icons inside feature cards (search/scraping/AI glyphs). The code window UI itself functions as a visual element — the embedded Python/Node.js code block is rendered as a realistic editor with traffic-light dots, line numbers, and syntax highlighting, making the product's technical capability the primary visual proof. All imagery is monochrome or single-color; no gradients, no multicolor illustrations, no photographic content anywhere.

## Layout

Max-width 1200px centered container, but hero and decorative bands extend full-bleed. Navigation is a sticky top bar with center-aligned product links. The hero is a centered stack: announcement banner → nav → badge → oversized display headline (52-60px) with one orange highlight phrase → 2-line subhead at 16px → URL input with action chips. Below the hero, the page alternates between: (1) a 3-column feature card grid with equal-width cards separated by #e5e7eb borders; (2) a full-bleed code-window section showing a 2-column split (code left, output right) with a language tab switcher floating above; (3) a logo cloud in a single horizontal row of 5-6 equal cells; (4) a dot-map section header with a large centered display heading below. Section gaps are generous (80-120px). The grid is always 3-column at desktop for feature cards, and the overall rhythm is vertical-stack with centered content rather than asymmetric or zig-zag.

## Agent Prompt Guide

## Quick Color Reference
- Page background: #ffffff
- Card/code surface: #f9f9f9
- Primary text: #262626
- Secondary/muted text: #727272
- Border/gridline: #e5e7eb
- primary action: #ff4d00 (filled action)
- Brand glow/halo: #fcddcc

## 5 Example Component Prompts

1. Create a Primary Action Button: #ff4d00 background, #262626 text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.

2. **Search input bar**: White background, 1px #e5e7eb border, border-radius 999px, padding 8px 8px 8px 20px. Contains a URL input (Suisse 14px, placeholder #c7c7c7) followed by inline action chips (Geist Mono 13px #262626 on #f9f9f9, radius 999px, 4px gaps) and a trailing 36px square #ff4d00 submit button with a white arrow icon. Outer ring: box-shadow rgb(249,249,249) 0px 0px 0px 6px.

3. **Feature card**: Background #f9f9f9, border 1px #e5e7eb, border-radius 16px, padding 32px 24px, text centered. Orange stroke icon (24px) inside a 40px circle at top. Title in Suisse 16px weight 500 #262626. Description in Suisse 14px weight 400 #727272.

4. **Code window**: Background #f9f9f9, border 1px #e5e7eb, border-radius 8px. Header bar 40px tall with 3 #e5e7eb traffic-light dots (6px) and Geist Mono 12px filename centered. Body padding 20px, Geist Mono 13px weight 400 line-height 1.57, line numbers in #b5b5b5 right-aligned. Syntax: #262626 default, #ff4d00 for keywords/strings, #616161 for comments. Outer shadow: rgb(253,253,253) 0px 0px 0px 8px.

5. **Section header (numbered)**: Layout left-aligned with 2px #ff4d00 vertical line. Orange 4px dot, then Geist Mono 12px #727272 text: "01 / MAIN FEATURES". Below, display heading in Suisse 52px weight 500 #262626, letter-spacing -0.26px, line-height 1.07, with one phrase in #ff4d00.

## Orange Discipline

The single most important rule in this system: #ff4d00 is rationed. It appears on approximately 3-4 element types per page — the primary CTA, the fire icon, 1-2 highlight words in the headline, and occasionally a badge or active-tab indicator. It never fills large surfaces, never appears in illustrations, and never tints background sections. The restraint is what makes it feel intentional rather than branded. When in doubt, use #262626.

## Typography Pairing Logic

Suisse carries all human-facing copy: headlines, body, nav, buttons, card titles. Geist Mono appears the moment content becomes technical: code blocks, API examples, file names, URL strings, language switcher tabs. The split is binary — if a string could appear in a README, it should be mono. If it could appear in a brochure, it's Suisse. This binary creates a clear developer-first voice without needing additional visual cues.

## Similar Brands

- **Vercel** — Same monochrome light surface with a single black-accented UI, Suisse-adjacent grotesque typography, and pill-shaped controls; differs in using black instead of orange for emphasis
- **Linear** — Same minimal light-mode workspace with hairline #e5e7eb borders doing structural work and flat components; differs in tighter density and purple accent
- **Modal** — Same developer-first aesthetic with monospace code windows, clean grotesque type, and a single warm accent color; differs in more compact information density
- **Resend** — Same off-white canvas with hairline grid lines, warm single-color accent (Resend uses a similar warm tone), and embedded code-as-hero pattern
- **Render** — Same light developer-tooling language with pill buttons, generous section gaps, and a single chromatic accent against near-white surfaces

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-ember-orange: #ff4d00;
  --color-ember-glow-light: #fcddcc;
  --color-ember-wash-deep: #febec2;
  --color-gridline: #e5e7eb;
  --color-ink: #262626;
  --color-vellum: #f9f9f9;
  --color-slate: #727272;
  --color-graphite: #616161;
  --color-ash: #949494;
  --color-stone: #c7c7c7;
  --color-mist: #b5b5b5;
  --color-pebble: #838383;

  /* Typography — Font Families */
  --font-suisse: 'Suisse', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-geist-mono: 'Geist Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.5;
  --tracking-caption: 0.2px;
  --text-body: 14px;
  --leading-body: 1.5;
  --text-heading-sm: 20px;
  --leading-heading-sm: 1.33;
  --text-heading: 24px;
  --leading-heading: 1.2;
  --text-heading-lg: 40px;
  --leading-heading-lg: 1.1;
  --tracking-heading-lg: -0.2px;
  --text-display: 52px;
  --leading-display: 1.07;
  --tracking-display: -0.26px;
  --text-display-xl: 60px;
  --leading-display-xl: 1;
  --tracking-display-xl: -0.6px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-w450: 450;
  --font-weight-medium: 500;

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
  --spacing-56: 56px;
  --spacing-60: 60px;
  --spacing-64: 64px;
  --spacing-72: 72px;
  --spacing-164: 164px;
  --spacing-188: 188px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 96px;
  --card-padding: 24px;
  --element-gap: 12px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-full: 999px;

  /* Named Radii */
  --radius-tags: 999px;
  --radius-cards: 16px;
  --radius-icons: 999px;
  --radius-inputs: 8px;
  --radius-buttons: 999px;
  --radius-code-windows: 8px;

  /* Shadows */
  --shadow-subtle: rgb(249, 249, 249) 0px 0px 0px 6px;
  --shadow-xl: rgba(0, 0, 0, 0.02) 0px 40px 48px -20px, rgba(0, 0, 0, 0.03) 0px 32px 32px -20px, rgba(0, 0, 0, 0.03) 0px 16px 24px -12px, rgba(0, 0, 0, 0.03) 0px 0px 0px 1px;
  --shadow-xl-2: rgba(0, 0, 0, 0.03) 0px 24px 32px -12px, rgba(0, 0, 0, 0.03) 0px 16px 24px -8px, rgba(0, 0, 0, 0.03) 0px 8px 16px -4px, rgba(0, 0, 0, 0.03) 0px 0px 0px 1px;
  --shadow-subtle-2: color(display-p3 0.984314 0.984314 0.984314) 0px 0px 0px 8px;
  --shadow-subtle-3: rgb(253, 253, 253) 0px 0px 0px 8px;
  --shadow-xl-3: rgba(0, 0, 0, 0.02) 0px 0px 44px 0px, rgba(0, 0, 0, 0.03) 0px 88px 56px -20px, rgba(0, 0, 0, 0.02) 0px 56px 56px -20px, rgba(0, 0, 0, 0.03) 0px 32px 32px -20px, rgba(0, 0, 0, 0.03) 0px 16px 24px -12px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgb(249, 249, 249) 0px 0px 0px 10px;

  /* Surfaces */
  --surface-canvas: #ffffff;
  --surface-vellum: #f9f9f9;
  --surface-gridline: #e5e7eb;
  --surface-shadow-tint: #fcddcc;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-ember-orange: #ff4d00;
  --color-ember-glow-light: #fcddcc;
  --color-ember-wash-deep: #febec2;
  --color-gridline: #e5e7eb;
  --color-ink: #262626;
  --color-vellum: #f9f9f9;
  --color-slate: #727272;
  --color-graphite: #616161;
  --color-ash: #949494;
  --color-stone: #c7c7c7;
  --color-mist: #b5b5b5;
  --color-pebble: #838383;

  /* Typography */
  --font-suisse: 'Suisse', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-geist-mono: 'Geist Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.5;
  --tracking-caption: 0.2px;
  --text-body: 14px;
  --leading-body: 1.5;
  --text-heading-sm: 20px;
  --leading-heading-sm: 1.33;
  --text-heading: 24px;
  --leading-heading: 1.2;
  --text-heading-lg: 40px;
  --leading-heading-lg: 1.1;
  --tracking-heading-lg: -0.2px;
  --text-display: 52px;
  --leading-display: 1.07;
  --tracking-display: -0.26px;
  --text-display-xl: 60px;
  --leading-display-xl: 1;
  --tracking-display-xl: -0.6px;

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
  --spacing-56: 56px;
  --spacing-60: 60px;
  --spacing-64: 64px;
  --spacing-72: 72px;
  --spacing-164: 164px;
  --spacing-188: 188px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-full: 999px;

  /* Shadows */
  --shadow-subtle: rgb(249, 249, 249) 0px 0px 0px 6px;
  --shadow-xl: rgba(0, 0, 0, 0.02) 0px 40px 48px -20px, rgba(0, 0, 0, 0.03) 0px 32px 32px -20px, rgba(0, 0, 0, 0.03) 0px 16px 24px -12px, rgba(0, 0, 0, 0.03) 0px 0px 0px 1px;
  --shadow-xl-2: rgba(0, 0, 0, 0.03) 0px 24px 32px -12px, rgba(0, 0, 0, 0.03) 0px 16px 24px -8px, rgba(0, 0, 0, 0.03) 0px 8px 16px -4px, rgba(0, 0, 0, 0.03) 0px 0px 0px 1px;
  --shadow-subtle-2: color(display-p3 0.984314 0.984314 0.984314) 0px 0px 0px 8px;
  --shadow-subtle-3: rgb(253, 253, 253) 0px 0px 0px 8px;
  --shadow-xl-3: rgba(0, 0, 0, 0.02) 0px 0px 44px 0px, rgba(0, 0, 0, 0.03) 0px 88px 56px -20px, rgba(0, 0, 0, 0.02) 0px 56px 56px -20px, rgba(0, 0, 0, 0.03) 0px 32px 32px -20px, rgba(0, 0, 0, 0.03) 0px 16px 24px -12px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgb(249, 249, 249) 0px 0px 0px 10px;
}
```
