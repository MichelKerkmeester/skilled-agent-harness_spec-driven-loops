# Column — Style Reference
> deep navy ledger under cool dawn

**Theme:** light

Column uses a deep-navy institutional language on a near-white canvas: the page reads as a trustworthy banking product surface first, a developer playground second. Brand color is not a single hue but a coordinated pair — indigo navy #111a4a for serious structure, seafoam green #44b48b for data and code — with one warm orange (#ec652b) reserved for high-signal accent surfaces like the Brex card. Typography is dominated by SuisseIntl, a geometric grotesque used across the full weight range from 300 (links) through 600 (display), which gives the system a refined, editorial register most fintechs lack. Cards float on generous white surfaces with subtle multi-layer shadows; most UI chrome is flat, with depth appearing only where a card needs to feel like a physical object (transaction widgets, product mockups). Code and financial data live in monospace, tinted seafoam — a visual signal that this is a bank built by engineers, for engineers.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Indigo Navy | `#111a4a` | `--color-indigo-navy` | Primary brand color — filled CTAs, navigation active states, heading text, logo wordmark. The deep violet-tinted navy carries institutional weight without going pure black; pairs with white text for the site's most confident button |
| Midnight Ink | `#011821` | `--color-midnight-ink` | Dark surface and emphasis text — product card backgrounds, high-contrast body copy. Near-gray with a cool blue-green undertone; works as the dark-mode substrate when a section needs to invert |
| Slate Ink | `#3b3e47` | `--color-slate-ink` | Secondary heading and body text — slightly warmer than Midnight Ink, used where pure black feels too harsh against the light canvas |
| Steel | `#7c7f88` | `--color-steel` | Body and link text — the dominant muted text color (245 occurrences in body). Neutral gray-blue that reads as quiet, never washed out |
| Fog | `#a9acb6` | `--color-fog` | Icon strokes, tertiary borders, placeholder text. Mid-gray that separates without competing with text |
| Mist | `#cbcccf` | `--color-mist` | Lightest body text — captions, disclaimers, fine print. Stays legible on white but recedes visually |
| Silver Lining | `#e3e4e8` | `--color-silver-lining` | Card borders, input borders, divider lines. The structural hairline color — appears wherever two surfaces need to separate without shadow |
| Cloud Canvas | `#f6f6f8` | `--color-cloud-canvas` | Page background — the dominant canvas color. Near-white with a barely-perceptible cool tint that keeps the page from feeling sterile |
| Pure White | `#ffffff` | `--color-pure-white` | Card surfaces, nav background, button fills, secondary text. The top layer of the surface stack |
| Charcoal | `#232730` | `--color-charcoal` | Nav icons, dark icon strokes — slightly bluer than pure black, used in icon contexts where Slate Ink would be too warm |
| Obsidian | `#12161e` | `--color-obsidian` | Deep icon strokes and nav elements. Near-black with a blue undertone that matches the indigo navy family |
| Pure Black | `#000000` | `--color-pure-black` | Maximum contrast text, dark fills in illustrations. Used sparingly — Indigo Navy or Slate Ink carry most text work |
| Signal Orange | `#ec652b` | `--color-signal-orange` | Accent CTA fill and featured card background — one of the few saturated warm colors in the system. Appears on the Brex highlight card and select buttons to draw the eye without feeling decorative |
| Peach Glow | `#f2936b` | `--color-peach-glow` | Soft accent surface — lighter companion to Signal Orange, used as card backgrounds where warmth is needed at lower intensity |
| Seafoam 600 | `#44b48b` | `--color-seafoam-600` | Code and data text — the signature color for JSON keys, identifiers, and financial values in code snippets. Also used for chart data points and growth visualizations |
| Seafoam 700 | `#167e6c` | `--color-seafoam-700` | Darker seafoam for strokes, chart lines, and icon accents in data contexts. Anchors the seafoam scale on darker backgrounds |
| Seafoam 400 | `#94efb7` | `--color-seafoam-400` | Highlighted code text — string values, URLs, API endpoints in code blocks. The lightest seafoam, reads as green-tinted monospace |
| Deep Sea | `#023247` | `--color-deep-sea` | Decorative stroke and chart accent — deep teal used in SVG illustrations and data visualizations alongside the seafoam scale |
| Sky Cyan | `#88deeb` | `--color-sky-cyan` | Soft accent surface and stroke — appears as background washes behind data widgets and as decorative chart strokes |
| Cobalt Edge | `#1e4199` | `--color-cobalt-edge` | Violet wash for highlight backgrounds, decorative bands, and soft emphasis behind content. Do not promote it to the primary CTA color |
| Ocean Depth | `#0c6997` | `--color-ocean-depth` | Decorative fill — medium blue used in illustration and SVG contexts |

## Tokens — Typography

### SuisseIntl — Primary typeface — used for all headings, body, buttons, nav, links, and card text. The custom geometric grotesque gives Column a distinctive editorial register that distinguishes it from Inter-only fintechs. Weight 600 at 52–60px for display, weight 500 for sub-headings, weight 400 for body, weight 300 for low-emphasis links. · `--font-suisseintl`
- **Substitute:** Inter
- **Weights:** 300, 400, 500, 600
- **Sizes:** 11, 12, 14, 16, 18, 20, 24, 28, 40, 48, 52, 60
- **Line height:** 1.0, 1.1, 1.3, 1.33, 1.38, 1.4, 1.43, 1.5
- **Letter spacing:** -0.03em at 52px, -0.02em at 40–48px, -0.01em at 20–28px, normal at 14–16px
- **OpenType features:** `"salt" 2`
- **Role:** Primary typeface — used for all headings, body, buttons, nav, links, and card text. The custom geometric grotesque gives Column a distinctive editorial register that distinguishes it from Inter-only fintechs. Weight 600 at 52–60px for display, weight 500 for sub-headings, weight 400 for body, weight 300 for low-emphasis links.

### SuisseIntlMono — Monospace companion to SuisseIntl — used for technical labels, API identifiers, and inline data in UI chrome. Maintains the same proportions as SuisseIntl so mono and proportional text align cleanly in mixed contexts. · `--font-suisseintlmono`
- **Substitute:** JetBrains Mono
- **Weights:** 400
- **Sizes:** 10, 12, 14
- **Line height:** 1.5
- **OpenType features:** `"cv11", "salt" 2`
- **Role:** Monospace companion to SuisseIntl — used for technical labels, API identifiers, and inline data in UI chrome. Maintains the same proportions as SuisseIntl so mono and proportional text align cleanly in mixed contexts.

### SFMono — Code snippet rendering — appears in JSON examples and API documentation blocks. Tinted in seafoam green scale to visually distinguish code from UI prose. · `--font-sfmono`
- **Substitute:** Fira Code
- **Weights:** 400
- **Sizes:** 10, 12
- **Line height:** 1.5
- **OpenType features:** `"cv11", "salt" 2`
- **Role:** Code snippet rendering — appears in JSON examples and API documentation blocks. Tinted in seafoam green scale to visually distinguish code from UI prose.

### Inter — UI fallback font — used in dashboard and product surface contexts where Inter's wider character set and system familiarity take priority over brand identity. · `--font-inter`
- **Substitute:** Inter
- **Weights:** 400, 500, 600
- **Sizes:** 10, 12, 14, 16, 20, 24
- **Line height:** 1.0, 1.1, 1.14, 1.33, 1.5
- **Letter spacing:** -0.03em at 24px, -0.02em at 16–20px
- **OpenType features:** `"cv11"`
- **Role:** UI fallback font — used in dashboard and product surface contexts where Inter's wider character set and system familiarity take priority over brand identity.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| micro | 10px | 1.5 | — | `--text-micro` |
| caption | 12px | 1.5 | — | `--text-caption` |
| body | 16px | 1.5 | — | `--text-body` |
| body-lg | 18px | 1.33 | — | `--text-body-lg` |
| subheading-sm | 20px | 1.1 | -0.2px | `--text-subheading-sm` |
| subheading-lg | 28px | 1.1 | -0.28px | `--text-subheading-lg` |
| heading-sm | 40px | 1.1 | -0.8px | `--text-heading-sm` |
| heading | 48px | 1.1 | -0.96px | `--text-heading` |
| heading-lg | 52px | 1.1 | -1.56px | `--text-heading-lg` |
| display | 60px | 1 | -0.6px | `--text-display` |

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
| 64 | 64px | `--spacing-64` |
| 72 | 72px | `--spacing-72` |
| 80 | 80px | `--spacing-80` |
| 96 | 96px | `--spacing-96` |
| 100 | 100px | `--spacing-100` |
| 144 | 144px | `--spacing-144` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 9999px |
| cards | 8px |
| inputs | 8px |
| buttons | 8px |
| nav-pills | 8px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| subtle | `rgba(17, 26, 74, 0.1) 0px 1px 3px 0px, rgba(17, 26, 74, 0...` | `--shadow-subtle` |
| subtle-2 | `rgba(87, 90, 100, 0.12) 0px 0px 0px 1px` | `--shadow-subtle-2` |
| subtle-3 | `rgba(0, 0, 0, 0.05) 0px 0px 0px 1px inset` | `--shadow-subtle-3` |
| xl | `rgba(0, 0, 0, 0.02) 0px 40px 32px 0px, rgba(0, 0, 0, 0.03...` | `--shadow-xl` |
| subtle-4 | `rgba(0, 0, 0, 0.1) 0px 1px 2px 0px, rgb(255, 255, 255) 0p...` | `--shadow-subtle-4` |
| subtle-5 | `rgba(0, 0, 0, 0.1) 0px 1px 2px 0px` | `--shadow-subtle-5` |
| subtle-6 | `rgb(17, 26, 74) 0px 0px 0px 1px, rgba(0, 0, 0, 0.25) 0px ...` | `--shadow-subtle-6` |
| xl-2 | `rgba(30, 30, 44, 0.15) 24px 48px 64px 0px, rgb(255, 255, ...` | `--shadow-xl-2` |
| sm | `rgba(18, 22, 30, 0.024) 0px 1px 4px 0px, rgba(18, 22, 30,...` | `--shadow-sm` |
| lg | `rgb(255, 255, 255) 0px 0px 20px 0px inset, rgba(0, 0, 0, ...` | `--shadow-lg` |
| subtle-7 | `rgba(0, 0, 0, 0.05) 0px 0px 0px 1px inset, rgba(0, 0, 0, ...` | `--shadow-subtle-7` |
| sm-2 | `rgba(0, 0, 0, 0.1) 0px 4px 8px 0px, rgba(0, 0, 0, 0.1) 0p...` | `--shadow-sm-2` |
| subtle-8 | `rgb(255, 255, 255) 0px 1px 0px 0px` | `--shadow-subtle-8` |
| subtle-9 | `rgba(17, 26, 74, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1...` | `--shadow-subtle-9` |
| md | `rgba(17, 26, 74, 0.05) 0px 8px 16px 0px, rgba(17, 26, 74,...` | `--shadow-md` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 72px
- **Card padding:** 24px
- **Element gap:** 8px

## Components

### Primary Filled Button
**Role:** Main call-to-action — highest-emphasis interactive element.

Background: #111a4a (Indigo Navy). Text: #ffffff, 14px SuisseIntl weight 500, letter-spacing normal. Border: none. Radius: 8px. Padding: 12px top/bottom, 20px left/right. Arrow icon after label. Box-shadow: rgba(17,26,74,0.1) 0px 1px 3px, rgba(17,26,74,0.05) 0px 1px 0px, with inset white highlight for slight inner luminosity. Used for 'Sign up' and top-of-page conversion actions.

### Secondary Outlined Button
**Role:** Secondary action — less weight than primary but still a distinct CTA.

Background: transparent. Text: #111a4a, 14px SuisseIntl weight 500. Border: 1px solid #111a4a. Radius: 8px. Padding: 12px top/bottom, 32px left/right. No arrow by default. Used for 'Documentation' and 'Learn about our bank' — sits beside the primary without competing.

### Ghost Navigation Pill
**Role:** Top-bar navigation trigger — 'Products', 'Developers', 'Blog'.

Background: rgba(255,255,255,0.25) with backdrop blur. Text: #000000, 14px SuisseIntl weight 400. Border: 1px solid #ffffff. Radius: 8px. Padding: 6px top/bottom, 12px left/right. Chevron icon for dropdowns. Frosted-glass effect sits over the hero background.

### Pill Button
**Role:** Compact action — tag-like buttons used for filtering and quick navigation.

Background: rgba(255,255,255,0.5). Text: #232730, 12–14px SuisseIntl weight 400. Border: 1px solid #e3e4e8. Radius: 8px (not fully rounded). Padding: 0px vertical, 16px horizontal for compact alignment.

### Accent Orange Button
**Role:** High-attention CTA — used when a section needs a warm, urgent accent.

Background: #ec652b (Signal Orange). Text: #ffffff, 14px SuisseIntl weight 500. Border: none. Radius: 8px. Padding: 12px top/bottom, 20px left/right. Appears on the Brex highlight card and select promotional surfaces — never on the primary nav.

### Product Card (Elevated)
**Role:** Feature showcase card — used for product mockups and feature highlights.

Background: rgba(2,50,71,0.01) (near-transparent with the faintest blue-green tint). Radius: 8px. Box-shadow: five-layer progressive shadow stack — rgba(0,0,0,0.02) at 40px/32px, 0.03 at 22px/18px, 0.03 at 12px/10px, 0.04 at 7px/5px, 0.07 at 3px/2px. Padding: 0 (content is positioned absolutely inside). No border. The shadow stack creates a diffused, hovering presence rather than a hard card edge.

### Transaction Widget Card
**Role:** Compact data card — shows account balances, transfer details, payment status.

Background: #ffffff. Radius: 8px. Box-shadow: rgba(30,30,44,0.15) 24px 48px 64px — a dramatic, off-axis shadow that makes the widget feel like it's floating above the hero. Inset border: 1px solid #ffffff. Padding: 12px top/bottom, 0 left/right. Contains flag icons, amount text (SuisseIntl weight 500, 16–18px), and status badges.

### Bordered Content Card
**Role:** Standard card for grouped content — quotes, code examples, feature blocks.

Background: #ffffff. Radius: 8px. Box-shadow: rgba(18,22,30,0.024) 0px 1px 4px, rgba(18,22,30,0.05) 0px 1px 0px, rgba(18,22,30,0.024) 0px 0px 0px 1px — combines a hairline border with a whisper of shadow. Padding: 12px all sides.

### Code Block
**Role:** JSON/API example — shows developer-facing content with syntax-tinted text.

Background: #ffffff. Radius: 8px. Monospace: SFMono 12px, line-height 1.5. Keys tinted #167e6c (Seafoam 700), string values #94efb7 (Seafoam 400), structural brackets in #232730. The entire block reads as a data object rather than formatted prose.

### FDIC Badge
**Role:** Trust indicator — regulatory badge for bank membership.

Background: rgba(255,255,255,0.8) with backdrop blur(8px). Text: #000000, 10–12px SuisseIntl weight 400. Radius: 9999px (full pill). Padding: 4px 12px. Semi-transparent so it floats over the hero gradient without blocking it.

### Tag with Dot
**Role:** Status or category label — 'TRUSTED AT SCALE II', 'DEVELOPER FIRST'.

Background: rgba(0,0,0,0) (transparent, sits over light backgrounds). Text: #000000 or #111a4a, 12px SuisseIntl weight 500, uppercase, letter-spacing slightly expanded. Small green or blue dot prefix for category color. Radius: 0 (no rounding — reads as a label, not a chip).

### Logo Bar Card
**Role:** Partner/customer logo showcase — used in trust strip and case studies.

Background: #ffffff or transparent. Individual logos rendered as flat monochrome SVG at 16–20px height, #000000 or #7c7f88. Spacing: 48px between logos. No card chrome — logos sit directly on the canvas with whitespace as separator.

### Account Balance Card
**Role:** Featured account display — the Brex operating account mockup.

Background: #ec652b (Signal Orange) for the primary featured card, or #ffffff for secondary. Radius: 8px. Contains SwissIntl amount text at 24px weight 500, small chart line in white at 60% opacity, and account metadata in 12px weight 400. The orange variant is the system's most saturated surface — used at most once per page.

### Stats Row
**Role:** Trust metrics — '$4.5T+', '99.999%', 'No. 1', '$100B+'.

Four-column grid with no dividers. Each stat: number in #167e6c (Seafoam 700) at 28px SuisseIntl weight 500, label in #7c7f88 at 14px weight 400 below. 48px row gap. The seafoam number color ties the stats to the data/code visual language.

## Do's and Don'ts

### Do
- Use 8px radius for all cards, buttons, inputs, and interactive surfaces — the 9999px pill is reserved exclusively for badges and tags.
- Pair the Indigo Navy (#111a4a) primary button with the Secondary Outlined Button (#111a4a border, transparent fill) — never place two filled CTAs side by side.
- Render code snippets in SFMono at 12px with line-height 1.5, tinting keys in #167e6c (Seafoam 700) and string values in #94efb7 (Seafoam 400).
- Apply the five-layer progressive shadow stack to product cards only — do not use it on bordered content cards, which get the simpler 1px hairline + whisper shadow.
- Set heading letter-spacing to -0.03em at 52px and -0.02em at 40–48px — the tight tracking on large sizes is essential to the SuisseIntl editorial feel.
- Use Signal Orange (#ec652b) for at most one surface per page — the accent is designed to be rare and high-signal.
- Set section gaps to 72px and card padding to 24px — the comfortable density is part of the institutional trust register.

### Don't
- Don't use the 9999px pill radius on buttons — buttons stay at 8px to maintain the sharp, confident banking feel.
- Don't place seafoam green (#44b48b) on body copy outside code or data contexts — the color signals technical content, not prose.
- Don't stack more than two card shadow styles on the same page — the product card shadow and the transaction widget shadow are both dramatic; using both simultaneously creates visual noise.
- Don't use the linear rainbow gradient on UI elements — it's a one-time decorative asset for the halftone map illustration only.
- Don't set body text below 14px in SuisseIntl — drop to SuisseIntlMono or SFMono at 10–12px for micro-copy and technical labels.
- Don't apply the Cobalt Edge (#1e4199) or Ocean Depth (#0c6997) colors to text or buttons — they are decorative SVG colors only.
- Don't use pure black (#000000) for body text — use Slate Ink (#3b3e47) or Obsidian (#12161e) for a softer, more refined dark.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Page Canvas | `#f6f6f8` | Base page background — the near-white cool-tinted surface that fills the viewport. |
| 1 | Card Surface | `#ffffff` | Top of the surface stack — content cards, transaction widgets, code blocks all sit here. |
| 2 | Frosted Overlay | `#ffffff80` | Translucent layer for nav pills, badges, and overlays that need to hint at background content beneath. |
| 3 | Sky Wash | `#88deeb` | Decorative background wash — used as soft accent behind data sections and chart areas. |
| 4 | Signal Orange Surface | `#f2936b` | Featured accent card background — the highest-signal warm surface, used at most once per page for the Brex highlight. |
| 5 | Deep Surface | `#011821` | Dark mode inversion — appears when a section needs to flip to dark navy for contrast. |

## Elevation

- **Product Card:** `rgba(0,0,0,0.02) 0px 40px 32px 0px, rgba(0,0,0,0.03) 0px 22px 18px 0px, rgba(0,0,0,0.03) 0px 12px 10px 0px, rgba(0,0,0,0.04) 0px 7px 5px 0px, rgba(0,0,0,0.07) 0px 3px 2px 0px`
- **Transaction Widget:** `rgba(30,30,44,0.15) 24px 48px 64px 0px, rgb(255,255,255) 0px 0px 0px 1px inset`
- **Bordered Card:** `rgba(18,22,30,0.024) 0px 1px 4px 0px, rgba(18,22,30,0.05) 0px 1px 0px 0px, rgba(18,22,30,0.024) 0px 0px 0px 1px`
- **Primary Button:** `rgba(17,26,74,0.1) 0px 1px 3px 0px, rgba(17,26,74,0.05) 0px 1px 0px 0px, rgba(255,255,255,0.5) 0px 1px 0px 0px inset, rgba(255,255,255,0.5) 0px 1px 4px 0px inset`

## Imagery

Imagery is minimal and functional — Column avoids stock photography entirely. The visual language is built from three sources: (1) SVG data illustrations, specifically a dotted halftone world map rendered in indigo-to-orange-to-seafoam gradient dots that creates a global-scale atmosphere behind the hero; (2) product mockup cards — floating widgets showing account balances, transfer details, and JSON code snippets in white cards with dramatic shadows; (3) chart visualizations — candlestick or bar charts in seafoam green with thin connecting lines, used in the trust/stats section. The halftone map is the signature visual element — its gradient transitions from #d65620 (orange) through violet, blue, sky cyan, seafoam, to yellow, creating a spectrum that ties together the entire brand palette in a single decorative surface. Icons are uniformly outlined at 1.5–2px stroke weight in #232730 or #a9acb6, with filled variants for active states. No lifestyle photography, no abstract 3D renders — the restraint is deliberate, keeping focus on product and data.

## Layout

Full-page structure is max-width 1200px centered with generous side margins (64–80px on desktop). Hero is a split layout — headline and CTAs left-aligned at 40% width, with a floating transaction widget positioned right at 55–70% width over the halftone map background. Below the hero, sections alternate between white (#ffffff) and the light canvas (#f6f6f8) with 72px vertical gaps. Content arrangement follows a consistent 6-column grid: text blocks span 4 columns (66%), image/product cards span 5–6 columns with deliberate off-grid positioning. Feature sections use a 2-column text-left/product-right pattern. The trust stats section breaks to a full-width 4-column equal grid. Customer logos sit in a single centered row with 48px gaps. The footer is compact, 2-column layout. Navigation is a fixed top bar, 62px tall, transparent over the hero with backdrop blur, transitioning to white on scroll. No sidebar, no mega-menu — dropdowns are simple chevron menus.

## Agent Prompt Guide

## Quick Color Reference
- Background: #f6f6f8
- Card surface: #ffffff
- Primary text: #111a4a (Indigo Navy)
- Muted text: #7c7f88 (Steel)
- Accent: #ec652b (Signal Orange) — reserve for one featured surface per page
- primary action: #ec652b (filled action)

## Example Component Prompts

1. Create a Primary Action Button: #ec652b background, #000000 text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.

2. **Create a trust stats row**: Four equal columns on #f6f6f8 canvas, 48px gaps. Each stat: number at 28px SuisseIntl weight 500, #167e6c (Seafoam 700). Label below at 14px weight 400, #7c7f88. No dividers between columns.

3. **Create a code block**: #ffffff background, 8px radius, simple hairline border (rgba(18,22,30,0.024) 0 0 0 1px). Content in SFMono 12px line-height 1.5. Keys in #167e6c, string values in #94efb7, brackets and structure in #232730. Padding: 24px all sides.

4. **Create a customer logo bar**: Single horizontal row on #ffffff background. Logos at 16–20px height, monochrome in #000000 or #7c7f88. 48px gap between logos. Centered, no card chrome.


## Signature Visual Element

The halftone world map is Column's most distinctive decorative asset — a field of small dots arranged in a grid pattern, with each dot sized and colored according to a spectrum gradient: orange (#d65620) → violet (#9f7aee) → blue (#4575cd) → sky cyan (#71d2f0) → seafoam (#44b48b) → yellow (#f4df69). Dots are 2–4px in diameter, spaced 8–10px apart, covering a world map silhouette. The gradient creates a sense of global connectivity and financial flow without literal illustration. This gradient should not be reused on UI elements — it belongs only on the map illustration.

## Typography Personality

SuisseIntl's character variants ('salt' 2) subtly modify the typeface's default letterforms — the single-story 'a' and other alternates give the font a warmer, more editorial feel than its Swiss grotesque origins. This is a deliberate choice: most fintechs use Inter or Söhne, which read as generic and tech-forward. SuisseIntl reads as institutional and considered, like the type you'd find in a private bank's annual report. The weight range (300–600) is used fully — weight 300 appears on low-emphasis links (a deliberate softening), weight 600 only on the largest display sizes. This range gives the system tonal flexibility most single-weight systems lack.

## Similar Brands

- **Brex** — Same navy-and-orange dual-accent palette on light backgrounds, same institutional-but-modern fintech register, similar card-driven layout with floating product widgets.
- **Mercury** — Deep navy typography on near-white canvas, restrained use of a single warm accent, developer-focused financial product language with code-adjacent typography.
- **Plaid** — Light canvas with deep navy primary text, white card surfaces with subtle shadows, and a visual language built around data and product mockups rather than photography.
- **Stripe** — Max-width centered layout, dramatic card shadows on floating product widgets, geometric grotesque typography, and the same restraint in using color as functional punctuation.
- **Wise** — Trust-forward fintech aesthetic with a near-white canvas, deep brand text color, and a visual system that prioritizes data clarity and institutional credibility over decorative flourish.

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-indigo-navy: #111a4a;
  --color-midnight-ink: #011821;
  --color-slate-ink: #3b3e47;
  --color-steel: #7c7f88;
  --color-fog: #a9acb6;
  --color-mist: #cbcccf;
  --color-silver-lining: #e3e4e8;
  --color-cloud-canvas: #f6f6f8;
  --color-pure-white: #ffffff;
  --color-charcoal: #232730;
  --color-obsidian: #12161e;
  --color-pure-black: #000000;
  --color-signal-orange: #ec652b;
  --color-peach-glow: #f2936b;
  --color-seafoam-600: #44b48b;
  --color-seafoam-700: #167e6c;
  --color-seafoam-400: #94efb7;
  --color-deep-sea: #023247;
  --color-sky-cyan: #88deeb;
  --color-cobalt-edge: #1e4199;
  --color-ocean-depth: #0c6997;

  /* Typography — Font Families */
  --font-suisseintl: 'SuisseIntl', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-suisseintlmono: 'SuisseIntlMono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-sfmono: 'SFMono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-micro: 10px;
  --leading-micro: 1.5;
  --text-caption: 12px;
  --leading-caption: 1.5;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-body-lg: 18px;
  --leading-body-lg: 1.33;
  --text-subheading-sm: 20px;
  --leading-subheading-sm: 1.1;
  --tracking-subheading-sm: -0.2px;
  --text-subheading-lg: 28px;
  --leading-subheading-lg: 1.1;
  --tracking-subheading-lg: -0.28px;
  --text-heading-sm: 40px;
  --leading-heading-sm: 1.1;
  --tracking-heading-sm: -0.8px;
  --text-heading: 48px;
  --leading-heading: 1.1;
  --tracking-heading: -0.96px;
  --text-heading-lg: 52px;
  --leading-heading-lg: 1.1;
  --tracking-heading-lg: -1.56px;
  --text-display: 60px;
  --leading-display: 1;
  --tracking-display: -0.6px;

  /* Typography — Weights */
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;

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
  --spacing-64: 64px;
  --spacing-72: 72px;
  --spacing-80: 80px;
  --spacing-96: 96px;
  --spacing-100: 100px;
  --spacing-144: 144px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 72px;
  --card-padding: 24px;
  --element-gap: 8px;

  /* Border Radius */
  --radius-sm: 2px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-full: 9999px;

  /* Named Radii */
  --radius-tags: 9999px;
  --radius-cards: 8px;
  --radius-inputs: 8px;
  --radius-buttons: 8px;
  --radius-nav-pills: 8px;

  /* Shadows */
  --shadow-subtle: rgba(17, 26, 74, 0.1) 0px 1px 3px 0px, rgba(17, 26, 74, 0.05) 0px 1px 0px 0px, rgba(255, 255, 255, 0.5) 0px 1px 0px 0px inset, rgba(255, 255, 255, 0.5) 0px 1px 4px 0px inset;
  --shadow-subtle-2: rgba(87, 90, 100, 0.12) 0px 0px 0px 1px;
  --shadow-subtle-3: rgba(0, 0, 0, 0.05) 0px 0px 0px 1px inset;
  --shadow-xl: rgba(0, 0, 0, 0.02) 0px 40px 32px 0px, rgba(0, 0, 0, 0.03) 0px 22px 18px 0px, rgba(0, 0, 0, 0.03) 0px 12px 10px 0px, rgba(0, 0, 0, 0.04) 0px 7px 5px 0px, rgba(0, 0, 0, 0.07) 0px 3px 2px 0px;
  --shadow-subtle-4: rgba(0, 0, 0, 0.1) 0px 1px 2px 0px, rgb(255, 255, 255) 0px 0px 0px 1px inset;
  --shadow-subtle-5: rgba(0, 0, 0, 0.1) 0px 1px 2px 0px;
  --shadow-subtle-6: rgb(17, 26, 74) 0px 0px 0px 1px, rgba(0, 0, 0, 0.25) 0px 2px 4px 0px, rgba(0, 0, 0, 0.25) 0px 1px 2px 0px;
  --shadow-xl-2: rgba(30, 30, 44, 0.15) 24px 48px 64px 0px, rgb(255, 255, 255) 0px 0px 0px 1px inset;
  --shadow-sm: rgba(18, 22, 30, 0.024) 0px 1px 4px 0px, rgba(18, 22, 30, 0.05) 0px 1px 0px 0px, rgba(18, 22, 30, 0.024) 0px 0px 0px 1px;
  --shadow-lg: rgb(255, 255, 255) 0px 0px 20px 0px inset, rgba(0, 0, 0, 0.1) 0px 1px 2px 0px, rgba(255, 255, 255, 0.5) 0px 0px 0px 1px inset;
  --shadow-subtle-7: rgba(0, 0, 0, 0.05) 0px 0px 0px 1px inset, rgba(0, 0, 0, 0.1) 0px -1px 0px 0px inset, rgba(0, 0, 0, 0.02) 0px -48px 24px -24px inset, rgba(0, 0, 0, 0.05) 0px 4px 8px 0px, rgba(0, 0, 0, 0.05) 0px 2px 4px 0px, rgba(0, 0, 0, 0.05) 0px 1px 1px 0px;
  --shadow-sm-2: rgba(0, 0, 0, 0.1) 0px 4px 8px 0px, rgba(0, 0, 0, 0.1) 0px 2px 4px 0px, rgba(0, 0, 0, 0.25) 0px 1px 1px 0px;
  --shadow-subtle-8: rgb(255, 255, 255) 0px 1px 0px 0px;
  --shadow-subtle-9: rgba(17, 26, 74, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 1px 2px 0px, rgba(255, 255, 255, 0.5) 0px 0px 0px 1px inset;
  --shadow-md: rgba(17, 26, 74, 0.05) 0px 8px 16px 0px, rgba(17, 26, 74, 0.05) 0px 4px 8px 0px;

  /* Surfaces */
  --surface-page-canvas: #f6f6f8;
  --surface-card-surface: #ffffff;
  --surface-frosted-overlay: #ffffff80;
  --surface-sky-wash: #88deeb;
  --surface-signal-orange-surface: #f2936b;
  --surface-deep-surface: #011821;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-indigo-navy: #111a4a;
  --color-midnight-ink: #011821;
  --color-slate-ink: #3b3e47;
  --color-steel: #7c7f88;
  --color-fog: #a9acb6;
  --color-mist: #cbcccf;
  --color-silver-lining: #e3e4e8;
  --color-cloud-canvas: #f6f6f8;
  --color-pure-white: #ffffff;
  --color-charcoal: #232730;
  --color-obsidian: #12161e;
  --color-pure-black: #000000;
  --color-signal-orange: #ec652b;
  --color-peach-glow: #f2936b;
  --color-seafoam-600: #44b48b;
  --color-seafoam-700: #167e6c;
  --color-seafoam-400: #94efb7;
  --color-deep-sea: #023247;
  --color-sky-cyan: #88deeb;
  --color-cobalt-edge: #1e4199;
  --color-ocean-depth: #0c6997;

  /* Typography */
  --font-suisseintl: 'SuisseIntl', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-suisseintlmono: 'SuisseIntlMono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-sfmono: 'SFMono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-micro: 10px;
  --leading-micro: 1.5;
  --text-caption: 12px;
  --leading-caption: 1.5;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-body-lg: 18px;
  --leading-body-lg: 1.33;
  --text-subheading-sm: 20px;
  --leading-subheading-sm: 1.1;
  --tracking-subheading-sm: -0.2px;
  --text-subheading-lg: 28px;
  --leading-subheading-lg: 1.1;
  --tracking-subheading-lg: -0.28px;
  --text-heading-sm: 40px;
  --leading-heading-sm: 1.1;
  --tracking-heading-sm: -0.8px;
  --text-heading: 48px;
  --leading-heading: 1.1;
  --tracking-heading: -0.96px;
  --text-heading-lg: 52px;
  --leading-heading-lg: 1.1;
  --tracking-heading-lg: -1.56px;
  --text-display: 60px;
  --leading-display: 1;
  --tracking-display: -0.6px;

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
  --spacing-64: 64px;
  --spacing-72: 72px;
  --spacing-80: 80px;
  --spacing-96: 96px;
  --spacing-100: 100px;
  --spacing-144: 144px;

  /* Border Radius */
  --radius-sm: 2px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-subtle: rgba(17, 26, 74, 0.1) 0px 1px 3px 0px, rgba(17, 26, 74, 0.05) 0px 1px 0px 0px, rgba(255, 255, 255, 0.5) 0px 1px 0px 0px inset, rgba(255, 255, 255, 0.5) 0px 1px 4px 0px inset;
  --shadow-subtle-2: rgba(87, 90, 100, 0.12) 0px 0px 0px 1px;
  --shadow-subtle-3: rgba(0, 0, 0, 0.05) 0px 0px 0px 1px inset;
  --shadow-xl: rgba(0, 0, 0, 0.02) 0px 40px 32px 0px, rgba(0, 0, 0, 0.03) 0px 22px 18px 0px, rgba(0, 0, 0, 0.03) 0px 12px 10px 0px, rgba(0, 0, 0, 0.04) 0px 7px 5px 0px, rgba(0, 0, 0, 0.07) 0px 3px 2px 0px;
  --shadow-subtle-4: rgba(0, 0, 0, 0.1) 0px 1px 2px 0px, rgb(255, 255, 255) 0px 0px 0px 1px inset;
  --shadow-subtle-5: rgba(0, 0, 0, 0.1) 0px 1px 2px 0px;
  --shadow-subtle-6: rgb(17, 26, 74) 0px 0px 0px 1px, rgba(0, 0, 0, 0.25) 0px 2px 4px 0px, rgba(0, 0, 0, 0.25) 0px 1px 2px 0px;
  --shadow-xl-2: rgba(30, 30, 44, 0.15) 24px 48px 64px 0px, rgb(255, 255, 255) 0px 0px 0px 1px inset;
  --shadow-sm: rgba(18, 22, 30, 0.024) 0px 1px 4px 0px, rgba(18, 22, 30, 0.05) 0px 1px 0px 0px, rgba(18, 22, 30, 0.024) 0px 0px 0px 1px;
  --shadow-lg: rgb(255, 255, 255) 0px 0px 20px 0px inset, rgba(0, 0, 0, 0.1) 0px 1px 2px 0px, rgba(255, 255, 255, 0.5) 0px 0px 0px 1px inset;
  --shadow-subtle-7: rgba(0, 0, 0, 0.05) 0px 0px 0px 1px inset, rgba(0, 0, 0, 0.1) 0px -1px 0px 0px inset, rgba(0, 0, 0, 0.02) 0px -48px 24px -24px inset, rgba(0, 0, 0, 0.05) 0px 4px 8px 0px, rgba(0, 0, 0, 0.05) 0px 2px 4px 0px, rgba(0, 0, 0, 0.05) 0px 1px 1px 0px;
  --shadow-sm-2: rgba(0, 0, 0, 0.1) 0px 4px 8px 0px, rgba(0, 0, 0, 0.1) 0px 2px 4px 0px, rgba(0, 0, 0, 0.25) 0px 1px 1px 0px;
  --shadow-subtle-8: rgb(255, 255, 255) 0px 1px 0px 0px;
  --shadow-subtle-9: rgba(17, 26, 74, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 1px 2px 0px, rgba(255, 255, 255, 0.5) 0px 0px 0px 1px inset;
  --shadow-md: rgba(17, 26, 74, 0.05) 0px 8px 16px 0px, rgba(17, 26, 74, 0.05) 0px 4px 8px 0px;
}
```
