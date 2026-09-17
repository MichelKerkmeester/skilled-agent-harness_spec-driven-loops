# Default — Style Reference
> Mission control behind frosted glass — weight 400 headlines float over matte-black panels lit by thin blue ring-light accents.

**Theme:** dark

Default operates in a dark control-room language: near-black canvas, hairline borders, and pill-shaped controls that feel calm rather than loud. Typography stays light — weight 400 at 52–64px — so headlines whisper against the matte background instead of shouting. Color is rationed: blue is the only true brand accent (links, active states, highlights, rings), green/red are reserved for success/destructive signals, and neutral fills (off-white #f2f2f2) do the work of primary CTAs. Surfaces stack in subtle elevation jumps (canvas → card → elevated panel) achieved mostly through 0.5px hairlines and inset 1px white-alpha highlights rather than drop shadows. Components are tight, compact, and information-dense — this is infrastructure software, not marketing spectacle.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Void | `#0b0c0e` | `--color-void` | Deepest page canvas, terminal background, behind everything |
| Graphite | `#131416` | `--color-graphite` | Primary card surface, panels, elevated containers, table rows |
| Charcoal | `#1f1f21` | `--color-charcoal` | Secondary surface, borders, dividers, rail backgrounds |
| Smoke | `#3c3d3e` | `--color-smoke` | Button borders, subtle separators |
| Steel | `#71717a` | `--color-steel` | Muted body text, captions, helper text, dimmed labels |
| Fog | `#858687` | `--color-fog` | Secondary text, icon strokes, inactive nav items |
| Ash | `#9d9e9f` | `--color-ash` | Tertiary text, placeholder text, disabled states |
| Chalk | `#cececf` | `--color-chalk` | Body text secondary, table cell text |
| Snow | `#ffffff` | `--color-snow` | Primary headings, body text, icon fills, active states — the dominant ink at 413 occurrences |
| Bone | `#f2f2f2` | `--color-bone` | Primary action button fill — off-white pill against dark creates the highest-contrast CTA without introducing a chromatic brand color |
| Ink | `#333333` | `--color-ink` | Secondary body text, navigation labels, and subdued headings. Do not promote it to the primary CTA color |
| Signal Blue | `#3b82f6` | `--color-signal-blue` | Brand accent — active nav indicators, link highlights, icon fills, active card borders. The one true chromatic color; used 21 times as fills, borders, and background tints |
| Arc Blue | `#60a5fa` | `--color-arc-blue` | Light blue text accent, informational highlights, node icons in workflow diagrams |
| Ring Blue | `#93c5fd` | `--color-ring-blue` | Focus rings, active card outline borders, selection state outlines at low alpha |
| Mint | `#4ade80` | `--color-mint` | Green outline accent for tags, dividers, and focused UI edges. Use as a supporting accent, not as a status color |
| Fern | `#22c55e` | `--color-fern` | Green wash for highlight backgrounds, decorative bands, and soft emphasis behind content. Use as a supporting accent, not as a status color |
| Coral | `#f87171` | `--color-coral` | Red text accent for links, tags, and emphasized short phrases. Use as a supporting accent, not as a status color |
| Ember | `#ea580c` | `--color-ember` | Decorative icon accent — orange chromatic chip in product mockups |
| Iris | `#314ef0` | `--color-iris` | Brand chip background tint in embedded mockups and product screenshots |

## Tokens — Typography

### Inter — Used for everything — display, body, UI, labels. The distinctive choice is weight 400 at 52–64px for headlines: most SaaS sites use 600–700, but Default's whisper-weight headlines feel more like a technical document or terminal readout than a marketing page. Fractional weights (420, 440, 450) are deployed at the 15–18px body range for fine-grained text density control. Font features ss01 and ss03 are enabled — these are Inter's stylistic alternates (single-storey 'a' and 'g' with closed tails) that give the type a more geometric, engineered feel. · `--font-inter`
- **Substitute:** Inter (variable) — load with features 'ss01', 'ss03' enabled
- **Weights:** 400, 420, 440, 450, 480, 500, 580
- **Sizes:** 8px, 9px, 10px, 11px, 12px, 13px, 14px, 15px, 16px, 17px, 18px, 32px, 42px, 44px, 48px, 52px, 64px
- **Line height:** 0.94, 1.00, 1.05, 1.20, 1.25, 1.27, 1.28, 1.33, 1.36, 1.38, 1.40, 1.43, 1.44, 1.45, 1.47, 1.50, 1.57, 1.60, 1.69, 1.80
- **Letter spacing:** Tightens aggressively with size: -0.015em at 7–12px, -0.023em at 14px, -0.026em at 13px, -0.034em at 18px, -0.025em at 52px, -0.021em at 42px, -0.020em at 44–64px. The negative tracking is heaviest at body sizes (where it compensates for Inter's open spacing) and relaxes slightly at display sizes.
- **OpenType features:** `"ss01" on, "ss03" on`
- **Role:** Used for everything — display, body, UI, labels. The distinctive choice is weight 400 at 52–64px for headlines: most SaaS sites use 600–700, but Default's whisper-weight headlines feel more like a technical document or terminal readout than a marketing page. Fractional weights (420, 440, 450) are deployed at the 15–18px body range for fine-grained text density control. Font features ss01 and ss03 are enabled — these are Inter's stylistic alternates (single-storey 'a' and 'g' with closed tails) that give the type a more geometric, engineered feel.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| body-lg | 14px | 1.43 | -0.32px | `--text-body-lg` |
| body-xl | 16px | 1.5 | — | `--text-body-xl` |
| subheading | 18px | 1 | -0.61px | `--text-subheading` |
| heading | 32px | 1.25 | -0.64px | `--text-heading` |
| heading-lg | 42px | 1.2 | -0.88px | `--text-heading-lg` |
| display | 52px | 1 | -1.3px | `--text-display` |
| display-lg | 64px | 0.94 | -1.28px | `--text-display-lg` |

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
| 36 | 36px | `--spacing-36` |
| 48 | 48px | `--spacing-48` |
| 52 | 52px | `--spacing-52` |
| 64 | 64px | `--spacing-64` |
| 68 | 68px | `--spacing-68` |
| 80 | 80px | `--spacing-80` |
| 96 | 96px | `--spacing-96` |
| 116 | 116px | `--spacing-116` |

### Border Radius

| Element | Value |
|---------|-------|
| lg | 16px |
| md | 12px |
| sm | 8.77px |
| xl | 20px |
| xs | 5.26px |
| 2xl | 24px |
| cards | 12px |
| pills | 10px |
| buttons | 10px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| sm | `rgba(0, 0, 0, 0.1) 0px 1px 4px 0px, rgba(0, 0, 0, 0.1) 0p...` | `--shadow-sm` |
| sm-2 | `rgba(0, 0, 0, 0.02) 0px 2px 4px 0px, rgba(0, 0, 0, 0.02) ...` | `--shadow-sm-2` |
| subtle | `rgba(0, 0, 0, 0.25) 0px 1px 2px 0px inset, rgba(0, 0, 0, ...` | `--shadow-subtle` |
| subtle-2 | `rgba(0, 0, 0, 0.04) 0px 0px 0px 1px, rgba(0, 0, 0, 0.06) ...` | `--shadow-subtle-2` |
| xl | `rgba(0, 0, 0, 0.05) 0px 100px 106px 0px, rgba(0, 0, 0, 0....` | `--shadow-xl` |
| xl-2 | `rgba(0, 0, 0, 0.05) 0px 20px 25px -5px, rgba(0, 0, 0, 0.0...` | `--shadow-xl-2` |
| sm-3 | `rgba(0, 0, 0, 0.1) 0px 1px 4px 0px, rgba(0, 0, 0, 0.1) 0p...` | `--shadow-sm-3` |
| subtle-3 | `rgba(59, 130, 246, 0.25) 0px 0px 0px 1.5px` | `--shadow-subtle-3` |
| sm-4 | `rgba(0, 0, 0, 0.063) 0px 4px 6px 1px, rgba(0, 0, 0, 0.15)...` | `--shadow-sm-4` |
| subtle-4 | `rgba(0, 0, 0, 0.15) 0px 0px 2px 0px, rgba(0, 0, 0, 0.08) ...` | `--shadow-subtle-4` |
| sm-5 | `rgba(34, 197, 94, 0.55) 0px 0px 4px 0px` | `--shadow-sm-5` |
| sm-6 | `rgba(59, 130, 246, 0.55) 0px 0px 4px 0px` | `--shadow-sm-6` |

### Layout

- **Page max-width:** 1080px
- **Section gap:** 96px
- **Card padding:** 28px
- **Element gap:** 8px

## Components

### Primary Pill Button (Bone)
**Role:** The main CTA — Request a Demo, Learn More, Get Started

Background #f2f2f2, text #333333, border none, border-radius 10px, padding 8px 20px, font-size 14px weight 400. Shadow: 0 1px 4px rgba(0,0,0,0.1) + 0 0 1px rgba(0,0,0,0.1). The off-white fill against the dark canvas is the only bright element on most pages — it reads as a single confident click target.

### Secondary Pill Button (Ghost)
**Role:** Secondary actions, nav CTAs, less prominent triggers

Background rgba(255,255,255,0.05), text #ffffff, border none, border-radius 10px, padding 8px 16px, font-size 14px weight 400. Whisper-quiet on dark — present but not competing with the primary action.

### Text Link Button
**Role:** Inline navigation, platform menu items, footer links

Background transparent, text rgba(255,255,255,0.92), border none, no padding, border-radius 0, font-size 14px weight 400. The high opacity (0.92, not 1.0) creates a subtle softness that distinguishes links from body text without a color shift.

### Announcement Bar
**Role:** Top-of-page funding news, product launches

Full-bleed strip at top of page, background #0b0c0, text 14px weight 400, centered. Includes 'Read more' link in #ffffff with underline. Dismissible with × icon at 92% opacity.

### Feature Card (Tabbed Content)
**Role:** Infrastructure capability cards in the tabbed section (Data, Tools, Agent, Governance)

Background #121316, border-radius 12px, padding 28px 32px, no visible shadow. Left column lists tab labels with small icon (16px) in signal blue, text #ffffff, 14px weight 400. Active tab has a white underline indicator.

### Product Mockup Card (Floating Panel)
**Role:** Embedded product screenshots in hero and feature sections

Background rgba(21,22,24,0.8), border-radius 7px, with a complex layered shadow: 0 100px 106px rgba(0,0,0,0.05), 0 42px 44px rgba(0,0,0,0.04), 0 22px 24px rgba(0,0,0,0.03), 0 12px 12px rgba(0,0,0,0.03). Contains tab bar at top, data table or workflow canvas inside, status badges with green/blue text.

### Logo Strip Card
**Role:** Customer logo display between hero and content

Transparent background, logos rendered in #858687 (mid-gray) with brightness(0) invert(1) filter on dark surfaces. No card container — logos float in a single row with 48–64px gap. Logos are monochrome to avoid chromatic noise.

### Status Badge (Live/Active)
**Role:** Real-time indicators on mockup cards, workflow nodes

Background transparent or rgba(74,222,128,0.1), text #4ade80, border 1px #4ade80, border-radius 5.26px, padding 2px 6px, font-size 9–10px weight 500. Small green dot prefix. The thin border + green text combo is more architectural than a solid filled badge.

### Workflow Node Card
**Role:** Node in the embedded workflow builder mockup

Background #131416, border 1px rgba(255,255,255,0.08), border-radius 8.77px, padding 12px. Contains small icon (16px) in node-specific color (blue for triggers, green for actions, orange for enrichtment), node title in 12px weight 500, description in 10px weight 400 in #858687. Connected by thin lines with small circular handle dots.

### Nav Header
**Role:** Sticky top navigation bar

Height 72px (4.5rem), background transparent over hero, becomes semi-transparent with backdrop blur on scroll. Contains logo (left), nav items centered (Platform dropdown, Agent, Resources) at 14px weight 400, Login text link + Request a Demo pill button (right). Border-bottom 0.5px rgba(255,255,255,0.07) when scrolled.

### Data Table Row
**Role:** Rows in embedded CRM/data mockups

Background #131416, border-bottom 0.5px rgba(255,255,255,0.05), padding 8px 12px. Cell text 10–12px weight 400 in #cececf. Avatar circles 16px with company logo, company name in #ffffff, numeric values right-aligned. Column headers in 9px weight 500 in #858687 with sort indicators.

### Icon Tile (Tool Icon)
**Role:** Floating tool/integration icons in the 'revenue stack' section

Background rgba(255,255,255,0.03), border 0.5px rgba(255,255,255,0.08), border-radius 8.77px, size 48–64px, contains a single monochrome icon at 24px in #858687 or #b6b6b7. Tiles float with varied opacity and blur to create depth — some are sharp, some are 20–30% opacity, some have backdrop blur.

### Footer
**Role:** Site footer with links and legal

Background #171717, padding 48px vertical, border-top 0.5px rgba(255,255,255,0.07). Columns of links in 12px weight 400 #858687, section headers in 9px weight 500 #71717a. No large logo or social icons visible — minimal and institutional.

## Do's and Don'ts

### Do
- Use weight 400 for all headlines 32px and above — the whisper-weight is the signature
- Set primary action buttons to #f2f2f2 fill with #333333 text and 10px radius — never introduce a chromatic brand color for CTAs
- Apply 0.5px solid borders (never 1px) for card edges, dividers, and panel outlines
- Use Inter with 'ss01' and 'ss03' font features enabled — the geometric alternates are part of the identity
- Stack surfaces in three levels: #0b0c0 canvas → #131416 card → rgba(255,255,255,0.05) hover
- Apply tight letter-spacing at body sizes: -0.026em at 13px, -0.023em at 14px, -0.034em at 18px
- Use Signal Blue (#3b82f6) only for active states, links, and icon accents — never for backgrounds or large fills

### Don't
- Do not use weight 600+ for headlines — it breaks the calm, terminal-like register
- Do not use blue or any chromatic color for CTA buttons — the bone (#f2f2f2) pill is the only primary action
- Do not use 1px or thicker borders — 0.5px hairlines are essential to the 'frosted glass' surface treatment
- Do not apply large drop shadows to cards — elevation comes from inset highlights, not cast shadows
- Do not use more than one weight from the 500+ range per text block — the type system is built on the 400–480 range
- Do not introduce gradients on UI elements — the site is deliberately flat with single-color fills only
- Do not use green or red as decorative color — they are semantic signals (success/destructive) only

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Void | `#0b0c0` | Page canvas, hero background, footer |
| 1 | Graphite | `#131416` | Card surfaces, panels, elevated containers |
| 2 | Charcoal | `#1f1f21` | Nested surfaces, input fields, secondary panels |
| 3 | Soft Fill | `#ffffff0f` | Hover states, ghost button backgrounds, subtle interactive surfaces |

## Elevation

- **Primary action button:** `0 1px 4px rgba(0,0,0,0.1), 0 0 1px rgba(0,0,0,0.1)`
- **Card:** `inset 0 1px 0 rgba(255,255,255,0.08), 0 0 0 0.5px rgba(255,255,255,0.07), 0 20px 44px rgba(0,0,0,0.14), 0 4px 10px rgba(0,0,0,0.08)`
- **Panel:** `inset 0 1px 0 rgba(255,255,255,0.09), 0 0 0 0.5px rgba(255,255,255,0.07), 0 16px 36px rgba(0,0,0,0.12)`
- **Icon:** `0 0 0 1px rgba(0,0,0,0.04), 0 1px 1px -0.5px rgba(0,0,0,0.06), 0 3px 3px -1.5px rgba(0,0,0,0.06)`

## Imagery

No photography. The visual language is pure UI: product mockups, workflow node diagrams, data tables, and tool icon tiles. Embedded product screenshots are the primary visual content — they show a dark CRM-like interface with green status badges, blue workflow nodes, and tabular data. The 'revenue stack' section uses floating icon tiles (Salesforce, HubSpot, etc.) at varying opacity with backdrop blur to create a spatial depth effect — sharp tiles in the foreground, blurred tiles fading into the background. The hero features a large multi-panel product mockup with a chat panel, a workflow canvas with connected nodes, and a form builder. All imagery is rendered in the same dark palette as the UI — there is no light-mode content, no lifestyle photography, no abstract gradients.

## Layout

Max-width 1080px (67.5rem) centered, with sections that feel full-bleed but content stays contained. Hero is a two-column split: large headline left (60% width), supporting copy + CTA right (40% width), with a multi-panel product mockup below spanning full width. Below the hero: logo strip (single row, centered), then a feature section with a dark canvas and floating icon tiles that bleed beyond the content column. The infrastructure section uses a tabbed two-column layout: left column (30%) lists tab labels with icons and short descriptions, right column (70%) shows an active product mockup. Cards and panels are 12px radius with 28px 32px padding. Section gaps are generous (96px+) to let the dark sections breathe. Navigation is a single sticky top bar at 72px — no sidebar, no mega-menu visible, just a 'Platform' dropdown trigger.

## Agent Prompt Guide

**Quick Color Reference**
- text: #ffffff (primary), #858687 (secondary), #71717a (muted)
- background: #0b0c0e (page), #131416 (card), #1f1f21 (panel)
- border: rgba(255,255,255,0.07) at 0.5px
- accent: #3b82f6 (Signal Blue)
- primary action: #f2f2f2 (filled action)

**Example Component Prompts**

1. Create a hero section: #0b0c0e background. Headline at 52px Inter weight 400, #ffffff, letter-spacing -1.3px, line-height 1.0. Secondary pill button: #f2f2f2 fill, #333 text, 10px radius, 8px 20px padding, 14px Inter weight 400. Subtext at 18px Inter weight 450, #858687, letter-spacing -0.61px.

2. Create a feature card: #131416 background, 12px radius, 28px 32px padding, 0.5px solid rgba(255,255,255,0.07) border. Title at 32px Inter weight 400, #ffffff. Description at 14px Inter weight 400, #858687. Small icon at 16px in #3b82f6.

3. Create a status badge: transparent background, 1px solid #4ade80 border, 5.26px radius, 2px 6px padding, 9px Inter weight 500, #4ade80 text. Prefix with 4px green dot.

4. Create a workflow node card: #131416 background, 8.77px radius, 12px padding, 0.5px solid rgba(255,255,255,0.08) border. Title at 12px Inter weight 500, #ffffff. Description at 10px Inter weight 400, #858687.

5. Create a nav header: 72px height, transparent background, backdrop blur 6px. Logo left, nav items centered at 14px Inter weight 400, login text link + secondary pill button right. Bottom border 0.5px rgba(255,255,255,0.07).

## Similar Brands

- **Linear** — Same dark canvas with near-black backgrounds, hairline borders, Inter typeface with whisper-weight headlines, and pill-shaped CTAs
- **Vercel** — Same weight-400 display type, #f2f2f2 bone-white primary buttons on black, and minimal chromatic palette with one signal accent
- **Cursor** — Same developer-tool aesthetic with dark surfaces, green/red semantic status colors, and Inter at light weights for all display sizes
- **Retool** — Same information-dense dark UI with product mockup screenshots as the primary visual, compact spacing, and hairline-bordered panels
- **Modal** — Same infra-for-engineers positioning reflected in the terminal-like type weight, dark matte surfaces, and rationed blue accent color

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-void: #0b0c0e;
  --color-graphite: #131416;
  --color-charcoal: #1f1f21;
  --color-smoke: #3c3d3e;
  --color-steel: #71717a;
  --color-fog: #858687;
  --color-ash: #9d9e9f;
  --color-chalk: #cececf;
  --color-snow: #ffffff;
  --color-bone: #f2f2f2;
  --color-ink: #333333;
  --color-signal-blue: #3b82f6;
  --color-arc-blue: #60a5fa;
  --color-ring-blue: #93c5fd;
  --color-mint: #4ade80;
  --color-fern: #22c55e;
  --color-coral: #f87171;
  --color-ember: #ea580c;
  --color-iris: #314ef0;

  /* Typography — Font Families */
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-body-lg: 14px;
  --leading-body-lg: 1.43;
  --tracking-body-lg: -0.32px;
  --text-body-xl: 16px;
  --leading-body-xl: 1.5;
  --text-subheading: 18px;
  --leading-subheading: 1;
  --tracking-subheading: -0.61px;
  --text-heading: 32px;
  --leading-heading: 1.25;
  --tracking-heading: -0.64px;
  --text-heading-lg: 42px;
  --leading-heading-lg: 1.2;
  --tracking-heading-lg: -0.88px;
  --text-display: 52px;
  --leading-display: 1;
  --tracking-display: -1.3px;
  --text-display-lg: 64px;
  --leading-display-lg: 0.94;
  --tracking-display-lg: -1.28px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-w420: 420;
  --font-weight-w440: 440;
  --font-weight-w450: 450;
  --font-weight-w480: 480;
  --font-weight-medium: 500;
  --font-weight-w580: 580;

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
  --spacing-36: 36px;
  --spacing-48: 48px;
  --spacing-52: 52px;
  --spacing-64: 64px;
  --spacing-68: 68px;
  --spacing-80: 80px;
  --spacing-96: 96px;
  --spacing-116: 116px;

  /* Layout */
  --page-max-width: 1080px;
  --section-gap: 96px;
  --card-padding: 28px;
  --element-gap: 8px;

  /* Border Radius */
  --radius-md: 5.26171px;
  --radius-lg: 8.76951px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-3xl: 24px;
  --radius-3xl-2: 30px;

  /* Named Radii */
  --radius-lg: 16px;
  --radius-md: 12px;
  --radius-sm: 8.77px;
  --radius-xl: 20px;
  --radius-xs: 5.26px;
  --radius-2xl: 24px;
  --radius-cards: 12px;
  --radius-pills: 10px;
  --radius-buttons: 10px;

  /* Shadows */
  --shadow-sm: rgba(0, 0, 0, 0.1) 0px 1px 4px 0px, rgba(0, 0, 0, 0.1) 0px 0px 1px 0px;
  --shadow-sm-2: rgba(0, 0, 0, 0.02) 0px 2px 4px 0px, rgba(0, 0, 0, 0.02) 0px 0px 8px 0px;
  --shadow-subtle: rgba(0, 0, 0, 0.25) 0px 1px 2px 0px inset, rgba(0, 0, 0, 0.02) 0px 2px 4px 0px, rgba(0, 0, 0, 0.02) 0px 0px 8px 0px;
  --shadow-subtle-2: rgba(0, 0, 0, 0.04) 0px 0px 0px 1px, rgba(0, 0, 0, 0.06) 0px 1px 1px -0.5px, rgba(0, 0, 0, 0.06) 0px 3px 3px -1.5px;
  --shadow-xl: rgba(0, 0, 0, 0.05) 0px 100px 106px 0px, rgba(0, 0, 0, 0.04) 0px 42px 44px 0px, rgba(0, 0, 0, 0.03) 0px 22px 24px 0px, rgba(0, 0, 0, 0.03) 0px 12px 12px 0px;
  --shadow-xl-2: rgba(0, 0, 0, 0.05) 0px 20px 25px -5px, rgba(0, 0, 0, 0.05) 0px 8px 10px 0px;
  --shadow-sm-3: rgba(0, 0, 0, 0.1) 0px 1px 4px 0px, rgba(0, 0, 0, 0.1) 0px 0px 1px 0px, rgba(255, 255, 255, 0.06) 0px 1px 0px 0px inset;
  --shadow-subtle-3: rgba(59, 130, 246, 0.25) 0px 0px 0px 1.5px;
  --shadow-sm-4: rgba(0, 0, 0, 0.063) 0px 4px 6px 1px, rgba(0, 0, 0, 0.15) 0px 0px 1px 1px;
  --shadow-subtle-4: rgba(0, 0, 0, 0.15) 0px 0px 2px 0px, rgba(0, 0, 0, 0.08) 0px 16px 40px 0px;
  --shadow-sm-5: rgba(34, 197, 94, 0.55) 0px 0px 4px 0px;
  --shadow-sm-6: rgba(59, 130, 246, 0.55) 0px 0px 4px 0px;

  /* Surfaces */
  --surface-void: #0b0c0;
  --surface-graphite: #131416;
  --surface-charcoal: #1f1f21;
  --surface-soft-fill: #ffffff0f;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-void: #0b0c0e;
  --color-graphite: #131416;
  --color-charcoal: #1f1f21;
  --color-smoke: #3c3d3e;
  --color-steel: #71717a;
  --color-fog: #858687;
  --color-ash: #9d9e9f;
  --color-chalk: #cececf;
  --color-snow: #ffffff;
  --color-bone: #f2f2f2;
  --color-ink: #333333;
  --color-signal-blue: #3b82f6;
  --color-arc-blue: #60a5fa;
  --color-ring-blue: #93c5fd;
  --color-mint: #4ade80;
  --color-fern: #22c55e;
  --color-coral: #f87171;
  --color-ember: #ea580c;
  --color-iris: #314ef0;

  /* Typography */
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-body-lg: 14px;
  --leading-body-lg: 1.43;
  --tracking-body-lg: -0.32px;
  --text-body-xl: 16px;
  --leading-body-xl: 1.5;
  --text-subheading: 18px;
  --leading-subheading: 1;
  --tracking-subheading: -0.61px;
  --text-heading: 32px;
  --leading-heading: 1.25;
  --tracking-heading: -0.64px;
  --text-heading-lg: 42px;
  --leading-heading-lg: 1.2;
  --tracking-heading-lg: -0.88px;
  --text-display: 52px;
  --leading-display: 1;
  --tracking-display: -1.3px;
  --text-display-lg: 64px;
  --leading-display-lg: 0.94;
  --tracking-display-lg: -1.28px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-36: 36px;
  --spacing-48: 48px;
  --spacing-52: 52px;
  --spacing-64: 64px;
  --spacing-68: 68px;
  --spacing-80: 80px;
  --spacing-96: 96px;
  --spacing-116: 116px;

  /* Border Radius */
  --radius-md: 5.26171px;
  --radius-lg: 8.76951px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-3xl: 24px;
  --radius-3xl-2: 30px;

  /* Shadows */
  --shadow-sm: rgba(0, 0, 0, 0.1) 0px 1px 4px 0px, rgba(0, 0, 0, 0.1) 0px 0px 1px 0px;
  --shadow-sm-2: rgba(0, 0, 0, 0.02) 0px 2px 4px 0px, rgba(0, 0, 0, 0.02) 0px 0px 8px 0px;
  --shadow-subtle: rgba(0, 0, 0, 0.25) 0px 1px 2px 0px inset, rgba(0, 0, 0, 0.02) 0px 2px 4px 0px, rgba(0, 0, 0, 0.02) 0px 0px 8px 0px;
  --shadow-subtle-2: rgba(0, 0, 0, 0.04) 0px 0px 0px 1px, rgba(0, 0, 0, 0.06) 0px 1px 1px -0.5px, rgba(0, 0, 0, 0.06) 0px 3px 3px -1.5px;
  --shadow-xl: rgba(0, 0, 0, 0.05) 0px 100px 106px 0px, rgba(0, 0, 0, 0.04) 0px 42px 44px 0px, rgba(0, 0, 0, 0.03) 0px 22px 24px 0px, rgba(0, 0, 0, 0.03) 0px 12px 12px 0px;
  --shadow-xl-2: rgba(0, 0, 0, 0.05) 0px 20px 25px -5px, rgba(0, 0, 0, 0.05) 0px 8px 10px 0px;
  --shadow-sm-3: rgba(0, 0, 0, 0.1) 0px 1px 4px 0px, rgba(0, 0, 0, 0.1) 0px 0px 1px 0px, rgba(255, 255, 255, 0.06) 0px 1px 0px 0px inset;
  --shadow-subtle-3: rgba(59, 130, 246, 0.25) 0px 0px 0px 1.5px;
  --shadow-sm-4: rgba(0, 0, 0, 0.063) 0px 4px 6px 1px, rgba(0, 0, 0, 0.15) 0px 0px 1px 1px;
  --shadow-subtle-4: rgba(0, 0, 0, 0.15) 0px 0px 2px 0px, rgba(0, 0, 0, 0.08) 0px 16px 40px 0px;
  --shadow-sm-5: rgba(34, 197, 94, 0.55) 0px 0px 4px 0px;
  --shadow-sm-6: rgba(59, 130, 246, 0.55) 0px 0px 4px 0px;
}
```
